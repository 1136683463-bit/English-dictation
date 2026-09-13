import { getMistakeCards } from "./reviewService";
import { nowIso, uid } from "./storage";
import { AppData, Unit } from "../types";

/**
 * 动态词书（PRD-wordbook-v2 P1-1，#3 拍板：实体 Unit + 系统徽标）。
 *
 * 「我的错词书」生命周期：
 * - 生成/同步（syncMistakeBookUnit）：错词本入口一键触发——不存在则创建实体 Unit
 *   （dynamicKind="mistakes"，书架一等公民）；当前错词补入；达到毕业门槛的成员移出；
 * - 毕业（isMistakeGraduated）：最近一次拼写错误之后，有 ≥2 个不同自然日的拼写正确记录
 *   （同日连对不算——会话内即时改对不是掌握证据）；
 * - 即时毕业（applyMistakeBookGraduation）：每次拼写判题后调用，避免等手动同步；
 * - 毕业标记：Card.mistakeGraduatedAt，晚于最近一次错误即错词本「已掌握」标记；
 *   再次出错后判定自动失效（最新 review 是错误 → 不满足毕业条件），下次同步重新入书。
 */

export const MISTAKE_BOOK_UNIT_TITLE = "我的错词书";
export const MISTAKE_BOOK_UNIT_COLOR = "#dc2626";
/** 毕业门槛：最近一次拼写错误后，正确记录覆盖的不同自然日数。 */
export const GRADUATION_CORRECT_DAYS = 2;

export const getMistakeBookUnit = (data: AppData): Unit | undefined =>
  data.units.find((unit) => unit.dynamicKind === "mistakes");

const localDateKey = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

/** 毕业判定：有拼写错误史，且最近一次错误之后有 ≥GRADUATION_CORRECT_DAYS 个不同自然日的正确记录。 */
export const isMistakeGraduated = (data: AppData, cardId: string): boolean => {
  const spellingReviews = data.reviews
    .filter((review) => review.cardId === cardId && review.mode === "spelling")
    .sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt));
  const correctDays = new Set<string>();
  let sawWrong = false;
  for (const review of spellingReviews) {
    if (review.rating <= 2) {
      sawWrong = true;
      break;
    }
    const key = localDateKey(review.reviewedAt);
    if (key) correctDays.add(key);
  }
  return sawWrong && correctDays.size >= GRADUATION_CORRECT_DAYS;
};

export interface MistakeBookSyncResult {
  data: AppData;
  unitId: string;
  created: boolean;
  /** 本次补入的错词数。 */
  added: number;
  /** 本次毕业移出的词数。 */
  graduated: number;
}

/** 生成/同步动态错词书：幂等——无变化时原样返回。 */
export const syncMistakeBookUnit = (data: AppData): MistakeBookSyncResult => {
  const mistakeCardIds = new Set(getMistakeCards(data, { limit: Math.max(1, data.cards.length) }).map((card) => card.id));

  let next = data;
  let unit = getMistakeBookUnit(next);
  let created = false;
  if (!unit) {
    const timestamp = nowIso();
    const maxOrder = next.units.reduce((max, item) => Math.max(max, item.order), 0);
    const newUnit: Unit = {
      id: uid("unit"),
      title: MISTAKE_BOOK_UNIT_TITLE,
      description: `错词自动聚成的动态词书：连续 ${GRADUATION_CORRECT_DAYS} 天答对自动毕业移出。`,
      order: maxOrder + 1,
      color: MISTAKE_BOOK_UNIT_COLOR,
      dynamicKind: "mistakes",
      createdAt: timestamp,
      updatedAt: timestamp
    };
    next = { ...next, units: [...next.units, newUnit] };
    unit = newUnit;
    created = true;
  }
  const unitId = unit.id;

  const memberIds = new Set(next.cards.filter((card) => card.unitId === unitId).map((card) => card.id));
  const graduatingIds = next.cards
    .filter((card) => card.unitId === unitId && isMistakeGraduated(next, card.id))
    .map((card) => card.id);
  const graduatingSet = new Set(graduatingIds);
  const addIds = next.cards
    .filter(
      (card) =>
        card.type === "word" &&
        mistakeCardIds.has(card.id) &&
        !memberIds.has(card.id) &&
        !graduatingSet.has(card.id) &&
        !isMistakeGraduated(next, card.id)
    )
    .map((card) => card.id);
  const addSet = new Set(addIds);

  if (graduatingIds.length === 0 && addIds.length === 0) {
    return { data: next, unitId, created, added: 0, graduated: 0 };
  }

  const timestamp = nowIso();
  next = {
    ...next,
    cards: next.cards.map((card) => {
      if (graduatingSet.has(card.id)) {
        return { ...card, unitId: undefined, mistakeGraduatedAt: timestamp, updatedAt: timestamp };
      }
      if (addSet.has(card.id)) {
        // 重新入书时清除过期毕业标记（再次出错后旧标记已失效，保持数据干净）。
        return { ...card, unitId, mistakeGraduatedAt: undefined, updatedAt: timestamp };
      }
      return card;
    })
  };
  return { data: next, unitId, created, added: addIds.length, graduated: graduatingIds.length };
};

/** 拼写判题后的即时毕业检查：仅当该卡属于动态错词书且达到毕业门槛时移出 + 标记。 */
export const applyMistakeBookGraduation = (
  data: AppData,
  cardId: string
): { data: AppData; graduated: boolean } => {
  const card = data.cards.find((item) => item.id === cardId);
  if (!card?.unitId) return { data, graduated: false };
  const unit = data.units.find((item) => item.id === card.unitId);
  if (unit?.dynamicKind !== "mistakes" || !isMistakeGraduated(data, cardId)) {
    return { data, graduated: false };
  }
  const timestamp = nowIso();
  return {
    data: {
      ...data,
      cards: data.cards.map((item) =>
        item.id === cardId ? { ...item, unitId: undefined, mistakeGraduatedAt: timestamp, updatedAt: timestamp } : item
      )
    },
    graduated: true
  };
};
