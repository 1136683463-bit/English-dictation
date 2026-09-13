import { AppData, Card, Unit } from "../types";

/**
 * M1 打点基线（PRD P1-7）：趁 0 进度窗口建立干净的本地基线。
 *
 * 覆盖 4 类打点：
 * 1. Unit.completedAt —— 整本全部掌握的时间戳（由 syncUnitCompletion 维护）；
 * 2. 死卡统计 —— 建卡后 72h 未学（status 仍为 new 且零复习记录）；
 * 3. streak / 有效学习日聚合 —— 从 reviews.reviewedAt 推导，不新增存储；
 * 4. 导入词质量 —— 按 tag「文件导入」区分启动率与死卡率。
 *
 * 全部为纯函数：输入 AppData，输出统计或新的 AppData，不直接读写存储。
 */

export const IMPORT_SOURCE_TAG = "文件导入";
export const DEAD_CARD_THRESHOLD_HOURS = 72;

const DAY_MS = 24 * 60 * 60 * 1000;

const isoNow = () => new Date().toISOString();

/** 本地时区的 YYYY-MM-DD，与 diary/mistake 的 dateKey 口径一致。 */
export const localDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export interface StreakStats {
  /** 连续学习天数：从今天（或昨天）往回数的连续有效学习日。 */
  currentStreak: number;
  /** 最近 7 天（含今天）的有效学习日数，即北极星「周有效学习日」。 */
  learningDaysLast7: number;
  /** 最近一次学习的日期 key，从未学过时为空串。 */
  lastLearningDateKey: string;
  /** 累计有效学习日总数。 */
  totalLearningDays: number;
}

/** 收集所有「有效学习日」的 date key（按 review 时间推导，已去重排序）。 */
export const collectLearningDateKeys = (data: AppData): string[] =>
  Array.from(new Set(data.reviews.map((review) => localDateKey(new Date(review.reviewedAt))))).sort();

export const computeStreakStats = (data: AppData, now = new Date()): StreakStats => {
  const learnedKeys = new Set(collectLearningDateKeys(data));
  if (learnedKeys.size === 0) {
    return { currentStreak: 0, learningDaysLast7: 0, lastLearningDateKey: "", totalLearningDays: 0 };
  }

  let currentStreak = 0;
  // 今天没学不打断 streak（今天还没结束），从昨天起算；昨天也没学则 streak 归零。
  const cursor = new Date(now);
  if (!learnedKeys.has(localDateKey(cursor))) cursor.setTime(cursor.getTime() - DAY_MS);
  while (learnedKeys.has(localDateKey(cursor))) {
    currentStreak += 1;
    cursor.setTime(cursor.getTime() - DAY_MS);
  }

  let learningDaysLast7 = 0;
  for (let offset = 0; offset < 7; offset += 1) {
    const day = new Date(now.getTime() - offset * DAY_MS);
    if (learnedKeys.has(localDateKey(day))) learningDaysLast7 += 1;
  }

  const sortedKeys = Array.from(learnedKeys).sort();
  return {
    currentStreak,
    learningDaysLast7,
    lastLearningDateKey: sortedKeys[sortedKeys.length - 1] ?? "",
    totalLearningDays: learnedKeys.size
  };
};

export interface DeadCardGroup {
  unitId?: string;
  unitTitle: string;
  deadCount: number;
  /** 该组里最早建卡的时间，用于「等了 N 天」唤醒文案。 */
  oldestCreatedAt: string;
}

export interface DeadCardStats {
  totalDead: number;
  /** 其中来自「文件导入」的死卡数。 */
  importedDead: number;
  /** 按词书分组，按最早建卡时间升序（最早被遗忘的书排最前）。 */
  groups: DeadCardGroup[];
}

export const isImportedCard = (card: Card) => card.tags.includes(IMPORT_SOURCE_TAG);

/** 死卡：建卡超过阈值仍处于 new 且没有任何复习记录的单词卡。 */
export const computeDeadCards = (
  data: AppData,
  now = new Date(),
  thresholdHours = DEAD_CARD_THRESHOLD_HOURS
): DeadCardStats => {
  const reviewedCardIds = new Set(data.reviews.map((review) => review.cardId));
  const thresholdMs = thresholdHours * 60 * 60 * 1000;
  const unitTitleById = new Map(data.units.map((unit) => [unit.id, unit.title]));

  const groups = new Map<string, DeadCardGroup>();
  let totalDead = 0;
  let importedDead = 0;

  for (const card of data.cards) {
    if (card.type !== "word" || card.status !== "new" || reviewedCardIds.has(card.id)) continue;
    const createdAt = new Date(card.createdAt).getTime();
    if (!Number.isFinite(createdAt) || now.getTime() - createdAt <= thresholdMs) continue;

    totalDead += 1;
    if (isImportedCard(card)) importedDead += 1;

    const key = card.unitId ?? "";
    const existing = groups.get(key);
    if (existing) {
      existing.deadCount += 1;
      if (card.createdAt < existing.oldestCreatedAt) existing.oldestCreatedAt = card.createdAt;
    } else {
      groups.set(key, {
        unitId: card.unitId,
        unitTitle: card.unitId ? unitTitleById.get(card.unitId) ?? "未知词书" : "未分组单词",
        deadCount: 1,
        oldestCreatedAt: card.createdAt
      });
    }
  }

  return {
    totalDead,
    importedDead,
    groups: Array.from(groups.values()).sort((a, b) => a.oldestCreatedAt.localeCompare(b.oldestCreatedAt))
  };
};

export interface ImportQualityStats {
  /** 「文件导入」的词总数（不含 suspended）。 */
  importedTotal: number;
  /** 其中已启动学习（有任意复习记录）的数量。 */
  importedStarted: number;
  /** 其中超过 72h 未学的死卡数。 */
  importedDead72h: number;
  /** 非导入词的总数，用于对照。 */
  otherTotal: number;
  /** 非导入词的已启动数量。 */
  otherStarted: number;
}

/** 导入 vs 手动词质量对比（数析打点清单第 1 项）。 */
export const computeImportQuality = (
  data: AppData,
  now = new Date(),
  thresholdHours = DEAD_CARD_THRESHOLD_HOURS
): ImportQualityStats => {
  const reviewedCardIds = new Set(data.reviews.map((review) => review.cardId));
  const thresholdMs = thresholdHours * 60 * 60 * 1000;

  const stats: ImportQualityStats = {
    importedTotal: 0,
    importedStarted: 0,
    importedDead72h: 0,
    otherTotal: 0,
    otherStarted: 0
  };

  for (const card of data.cards) {
    if (card.type !== "word" || card.status === "suspended") continue;
    const imported = isImportedCard(card);
    if (imported) {
      stats.importedTotal += 1;
      if (reviewedCardIds.has(card.id)) stats.importedStarted += 1;
      const createdAt = new Date(card.createdAt).getTime();
      if (card.status === "new" && !reviewedCardIds.has(card.id) && now.getTime() - createdAt > thresholdMs) {
        stats.importedDead72h += 1;
      }
    } else {
      stats.otherTotal += 1;
      if (reviewedCardIds.has(card.id)) stats.otherStarted += 1;
    }
  }

  return stats;
};

/**
 * 维护 Unit.completedAt：
 * - 词书有 ≥1 张词卡且全部 mastered → 首次达成时写入当前时间；
 * - 之后任何一张卡退回 learning/review/new → 清除（重新学完再记新时间）。
 * 不可变更新：没有变化的 unit 保持原引用。
 */
export const syncUnitCompletion = (data: AppData, timestamp = isoNow()): AppData => {
  const cardsByUnit = new Map<string, Card[]>();
  const unassigned: Card[] = [];
  for (const card of data.cards) {
    if (card.type !== "word") continue;
    if (card.unitId) {
      const list = cardsByUnit.get(card.unitId);
      if (list) list.push(card);
      else cardsByUnit.set(card.unitId, [card]);
    } else {
      unassigned.push(card);
    }
  }

  const isUnitComplete = (cards: Card[]) => cards.length > 0 && cards.every((card) => card.status === "mastered");

  let changed = false;
  const units = data.units.map((unit): Unit => {
    const cards = cardsByUnit.get(unit.id) ?? [];
    const complete = isUnitComplete(cards);
    if (complete && !unit.completedAt) {
      changed = true;
      return { ...unit, completedAt: timestamp, updatedAt: timestamp };
    }
    if (!complete && unit.completedAt) {
      changed = true;
      const { completedAt: _completedAt, ...rest } = unit;
      return { ...rest, updatedAt: timestamp };
    }
    return unit;
  });

  // 未分配词卡的「词书」不承载 completedAt，这里只需保证单元循环覆盖所有 unit。
  void unassigned;

  return changed ? { ...data, units } : data;
};
