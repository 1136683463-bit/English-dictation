import { AppData, Card, Unit } from "../types";
import { nowIso, uid } from "./storage";

/**
 * P0-3 词书粒度重组：所有词书单本 ≤ 25 词，存量一次性迁移。
 *
 * - 35 词本拆为 23 + 12（按 MAX_WORDS_PER_UNIT 均匀切块的首本 + 余量）；
 * - 已学进度自动跟随：card.status / schedules 不动，只改 card.unitId（析客待确认 #1 的执行口径）；
 * - 前两本「完全未启动」的词书标记速通本徽标（speedRun）；
 * - 积累型词书（冒险积累）不拆：它按用途持续吸纳，拆分会破坏收藏夹语义。
 */

export const MAX_WORDS_PER_UNIT = 200;
export const ACCUMULATION_UNIT_IDS = ["unit-adventure-accumulation"];
export const DEFAULT_SPEED_RUN_COUNT = 2;

export interface RestructureResult {
  data: AppData;
  /** 被拆分的原词书数量。 */
  splitUnitCount: number;
  /** 拆分新增的词书数量（不含原书）。 */
  createdUnitCount: number;
  /** 本次被标记为速通本的词书 ID。 */
  speedRunUnitIds: string[];
}

/**
 * 把一组词卡切成 ≤maxSize 的均衡小块：先算块数 ceil(n/maxSize)，再均分余量。
 * 例如 35 词、上限 25 → 2 块 → 18+17（比 25+10 更均衡，两本都接近速通节奏）。
 */
export const chunkCards = (cards: Card[], maxSize: number): Card[][] => {
  const size = Math.max(1, Math.round(maxSize));
  if (cards.length <= size) return [cards.slice()];

  const count = Math.ceil(cards.length / size);
  const base = Math.floor(cards.length / count);
  let extra = cards.length % count;

  const chunks: Card[][] = [];
  let cursor = 0;
  for (let index = 0; index < count; index += 1) {
    const take = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra -= 1;
    chunks.push(cards.slice(cursor, cursor + take));
    cursor += take;
  }
  return chunks;
};

const getUnitWordCards = (data: AppData, unitId: string): Card[] =>
  data.cards
    .filter((card) => card.type === "word" && card.unitId === unitId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.front.localeCompare(b.front));

/**
 * 标记速通本：最早创建、且完全未启动（全部 new）的前 count 本 → speedRun true；
 * 其余未启动的书清除标记；已启动的书保留现有标记（学了一半的速通本不丢徽标）。
 * 幂等：重复执行结果稳定。
 */
export const applySpeedRunMarks = (
  data: AppData,
  count = DEFAULT_SPEED_RUN_COUNT,
  timestamp = nowIso()
): { data: AppData; speedRunUnitIds: string[] } => {
  if (count <= 0) return { data, speedRunUnitIds: [] };

  const cardsByUnit = new Map<string, Card[]>();
  for (const card of data.cards) {
    if (card.type !== "word" || !card.unitId) continue;
    const list = cardsByUnit.get(card.unitId);
    if (list) list.push(card);
    else cardsByUnit.set(card.unitId, [card]);
  }

  const isUntouched = (cards: Card[]) => cards.length > 0 && cards.every((card) => card.status === "new");

  const eligible = data.units
    .filter((unit) => !ACCUMULATION_UNIT_IDS.includes(unit.id))
    .filter((unit) => isUntouched(cardsByUnit.get(unit.id) ?? []))
    .sort((a, b) => a.order - b.order);
  const speedRunIds = new Set(eligible.slice(0, count).map((unit) => unit.id));

  let changed = false;
  const units = data.units.map((unit): Unit => {
    const cards = cardsByUnit.get(unit.id) ?? [];
    if (!isUntouched(cards)) return unit; // 已启动的书保留现状（含速通徽标）

    const shouldMark = speedRunIds.has(unit.id);
    if (shouldMark && !unit.speedRun) {
      changed = true;
      return { ...unit, speedRun: true };
    }
    if (!shouldMark && unit.speedRun) {
      changed = true;
      const { speedRun: _speedRun, ...rest } = unit;
      return rest;
    }
    return unit;
  });

  return { data: changed ? { ...data, units } : data, speedRunUnitIds: Array.from(speedRunIds) };
};

/**
 * 存量迁移入口：把所有超过 maxWords 的词书拆成 ≤maxWords 的若干本。
 * 幂等 —— 拆完后所有词书 ≤ maxWords，再次执行为 no-op。
 */
export const restructureOversizedUnits = (
  data: AppData,
  options: { maxWords?: number; speedRunCount?: number; timestamp?: string } = {}
): RestructureResult => {
  const maxWords = Math.max(1, Math.round(options.maxWords ?? MAX_WORDS_PER_UNIT));
  const timestamp = options.timestamp ?? nowIso();

  let next = data;
  let splitUnitCount = 0;
  let createdUnitCount = 0;
  let maxOrder = data.units.reduce((max, unit) => Math.max(max, unit.order), 0);

  const oversized = [...data.units]
    .sort((a, b) => a.order - b.order)
    .filter((unit) => !ACCUMULATION_UNIT_IDS.includes(unit.id))
    .filter((unit) => getUnitWordCards(data, unit.id).length > maxWords);

  for (const unit of oversized) {
    const cards = getUnitWordCards(next, unit.id);
    if (cards.length <= maxWords) continue; // 前面拆分可能已重排，保护幂等

    const chunks = chunkCards(cards, maxWords);
    if (chunks.length <= 1) continue;

    splitUnitCount += 1;
    createdUnitCount += chunks.length - 1;

    // 原书保留第一块（保住原 id / createdAt / groupId），其余块新建词书；
    // 卡片只改 unitId，status / schedules 原样跟随 → 已学进度自动迁移。
    const units: Unit[] = [];
    const reassignments = new Map<string, string>();

    units.push({
      ...unit,
      title: `${unit.title} · 1`,
      description: unit.description ? `${unit.description} · 拆分自原书` : "拆分自原书",
      updatedAt: timestamp,
      completedAt: undefined,
      speedRun: undefined
    });
    chunks[0].forEach((card) => reassignments.set(card.id, unit.id));

    for (let index = 1; index < chunks.length; index += 1) {
      const newUnit: Unit = {
        id: uid("unit"),
        title: `${unit.title} · ${index + 1}`,
        description: unit.description ? `${unit.description} · 拆分自原书` : "拆分自原书",
        order: ++maxOrder,
        color: unit.color,
        groupId: unit.groupId,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      units.push(newUnit);
      chunks[index].forEach((card) => reassignments.set(card.id, newUnit.id));
    }

    next = {
      ...next,
      units: [...next.units.filter((item) => item.id !== unit.id), ...units],
      cards: next.cards.map((card) =>
        reassignments.has(card.id) ? { ...card, unitId: reassignments.get(card.id), updatedAt: timestamp } : card
      )
    };
  }

  const marked = applySpeedRunMarks(next, options.speedRunCount ?? DEFAULT_SPEED_RUN_COUNT, timestamp);

  return {
    data: marked.data,
    splitUnitCount,
    createdUnitCount,
    speedRunUnitIds: marked.speedRunUnitIds
  };
};
