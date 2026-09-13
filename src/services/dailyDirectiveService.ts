import { buildSpellingQueue, getStudyScopeUnitIds, isReviewOnlyDay } from "./spellingQueueService";
import { computeStreakWithGrace, dayKey, startOfLocalWeek } from "./statsService";
import { AppData, Card, Unit } from "../types";

/**
 * 书架每日指令卡（PRD-wordbook-v2 P0-4，v1 P0-2 遗留）。
 *
 * 每天给用户一个不可误解的答案：「今天学哪本、学多少、多久」。
 * 决策链自上而下取第一条命中（v1 PRD 流程 B）：
 * 1. backlog   —— 积压预警：全局到期 >48h 且 ≥10 张 → 指向积压最多的词书；
 * 2. wake      —— 死卡唤醒：建书 ≥72h 且全书零复习记录 → 指向最早未学书；
 * 3. speedrun  —— 速通本未完成 → 速通本指令；
 * 4. normal    —— 常规：到期最多的词书优先，无到期则最早创建的未学完书；
 * 5. celebrate —— 全部清空 → 庆祝态；
 * 0. empty     —— 书架无词书 → 引导态。
 *
 * 硬口径（验收标准）：指令卡数字 = 实际队列数字。
 * totalCards / newCount / reviewCount 全部从 buildSpellingQueue(unit, smart)
 * 的真实队列里数出来，不另算一套，保证点「开始今日学习」后看到的就是这些词。
 */

export type DailyDirectiveKind = "empty" | "backlog" | "wake" | "speedrun" | "normal" | "celebrate";

export interface DailyDirective {
  kind: DailyDirectiveKind;
  /** 学习对象（empty/celebrate 为 null；backlog 可能为 null=未分配词走全局队列）。 */
  unitId: string | null;
  unitTitle: string | null;
  /** 实际队列长度（= buildSpellingQueue 结果数）。 */
  totalCards: number;
  /** 队列内新词数（status=new）。 */
  newCount: number;
  /** 队列内复习数（非新词）。 */
  reviewCount: number;
  /** 预计分钟（按 SECONDS_PER_CARD 估算）。 */
  minutes: number;
  /** kind=backlog：全局积压（到期 >48h）张数。 */
  backlogCount?: number;
  /** kind=backlog：最早积压距今天数。 */
  backlogOldestDays?: number;
  /** kind=wake：词书创建后等待的整天数。 */
  waitedDays?: number;
  /** 本周学习日（有任意复习记录的自然日数，周一起算）。 */
  weekLearnDays: number;
  /** 连续学习天数（含每周 1 天宽限口径）。 */
  streak: number;
  /** P1-4：今天是否处于纯复习日临时档（队列不含新词，数字同步反映）。 */
  reviewOnly: boolean;
}

/** 积压阈值：到期超过 48h 且总数达到该值才触发预警（v1 P1-4 口径）。 */
export const BACKLOG_OVERDUE_HOURS = 48;
export const BACKLOG_MIN_CARDS = 10;
/** 死卡阈值：建书 72h 零复习即视为死卡书（与 G1 首学转化 ≤72h 同口径）。 */
export const DEAD_UNIT_HOURS = 72;
/** 单卡耗时估算：v1 数据测算 50 卡 ≈ 15-20 分钟 → ≈21s/卡，取整 20s。 */
export const SECONDS_PER_CARD = 20;
/** 指令卡队列上限：与 SpellingPage 默认 limit 一致。 */
export const DIRECTIVE_QUEUE_LIMIT = 30;

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

const estimateMinutes = (cards: number) => Math.max(1, Math.round((cards * SECONDS_PER_CARD) / 60));

export interface DeadUnitInfo {
  unit: Unit;
  /** 建书后等待的整天数（下限 DEAD_UNIT_HOURS/24）。 */
  waitedDays: number;
}

/**
 * 死卡书列表（P1-5 唤醒条与指令卡 wake 态共用口径）：
 * 建书 ≥72h、有词卡、且全书零复习记录；按创建时间升序（最早的最该唤醒）。
 */
export const getDeadUnits = (data: AppData, now = new Date()): DeadUnitInfo[] => {
  const deadThreshold = now.getTime() - DEAD_UNIT_HOURS * HOUR_MS;
  const reviewedCardIds = new Set(data.reviews.map((review) => review.cardId));
  return data.units
    .filter((unit) => new Date(unit.createdAt).getTime() <= deadThreshold)
    .map((unit) => ({
      unit,
      cards: data.cards.filter((card) => card.type === "word" && card.status !== "suspended" && card.unitId === unit.id)
    }))
    .filter((entry) => entry.cards.length > 0 && entry.cards.every((card) => !reviewedCardIds.has(card.id)))
    .sort((a, b) => a.unit.createdAt.localeCompare(b.unit.createdAt))
    .map((entry) => ({
      unit: entry.unit,
      waitedDays: Math.max(DEAD_UNIT_HOURS / 24, Math.floor((now.getTime() - new Date(entry.unit.createdAt).getTime()) / DAY_MS))
    }));
};

export const buildDailyDirective = (data: AppData, now = new Date()): DailyDirective => {
  const wordCards = data.cards.filter((card) => card.type === "word" && card.status !== "suspended");
  const scheduleByCardId = new Map(data.schedules.map((schedule) => [schedule.cardId, schedule]));

  const weekStart = startOfLocalWeek(now);
  const weekLearnDays = new Set(
    data.reviews
      .filter((review) => {
        const time = new Date(review.reviewedAt).getTime();
        return Number.isFinite(time) && time >= weekStart.getTime() && time <= now.getTime();
      })
      .map((review) => dayKey(new Date(review.reviewedAt)))
  ).size;
  const streak = computeStreakWithGrace(data.reviews, now).streak;
  const reviewOnly = isReviewOnlyDay(data.settings, now);
  const base = { weekLearnDays, streak, reviewOnly };

  if (data.units.length === 0) {
    return { kind: "empty", unitId: null, unitTitle: null, totalCards: 0, newCount: 0, reviewCount: 0, minutes: 0, ...base };
  }

  const queueFor = (unitId: string | null): Card[] =>
    buildSpellingQueue(data, unitId, "standard", DIRECTIVE_QUEUE_LIMIT, null, [], "smart", reviewOnly);

  const withCounts = (
    kind: DailyDirectiveKind,
    unitId: string | null,
    unitTitle: string | null,
    queue: Card[],
    extra: Partial<DailyDirective> = {}
  ): DailyDirective => {
    const newCount = queue.filter((card) => card.status === "new").length;
    return {
      kind,
      unitId,
      unitTitle,
      totalCards: queue.length,
      newCount,
      reviewCount: queue.length - newCount,
      minutes: estimateMinutes(queue.length),
      ...extra,
      ...base
    };
  };

  const unitById = new Map(data.units.map((unit) => [unit.id, unit]));
  // P2-1 学习范围锁定：指令卡候选（积压/唤醒/速通/常规）只取范围内词书。
  const scopeIds = getStudyScopeUnitIds(data.settings);
  const inScopeUnit = (unit: Unit) => !scopeIds || scopeIds.has(unit.id);

  // 1. 积压预警：到期 >48h 且 ≥10 张 → 指向积压最多的词书（未分配词最多则走全局队列）。
  const overdueThreshold = now.getTime() - BACKLOG_OVERDUE_HOURS * HOUR_MS;
  const overdueCards = wordCards.filter((card) => {
    if (card.status !== "learning" && card.status !== "review") return false;
    // P2-1：锁定学习范围时，未分配词与范围外词书不计入积压
    if (scopeIds && (!card.unitId || !scopeIds.has(card.unitId))) return false;
    const schedule = scheduleByCardId.get(card.id);
    return schedule ? new Date(schedule.nextReviewAt).getTime() <= overdueThreshold : false;
  });
  if (overdueCards.length >= BACKLOG_MIN_CARDS) {
    const countByUnitId = new Map<string | null, number>();
    for (const card of overdueCards) {
      const key = card.unitId && unitById.has(card.unitId) ? card.unitId : null;
      countByUnitId.set(key, (countByUnitId.get(key) ?? 0) + 1);
    }
    let targetUnitId: string | null = null;
    let targetCount = -1;
    for (const [unitId, count] of countByUnitId) {
      if (count > targetCount) {
        targetUnitId = unitId;
        targetCount = count;
      }
    }
    const oldestAt = Math.min(...overdueCards.map((card) => new Date(scheduleByCardId.get(card.id)!.nextReviewAt).getTime()));
    return withCounts("backlog", targetUnitId, targetUnitId ? (unitById.get(targetUnitId)?.title ?? null) : null, queueFor(targetUnitId), {
      backlogCount: overdueCards.length,
      backlogOldestDays: Math.max(0, Math.floor((now.getTime() - oldestAt) / DAY_MS))
    });
  }

  // 2. 死卡唤醒：建书 ≥72h、全书零复习记录，取最早创建的一本（口径见 getDeadUnits）。
  for (const entry of getDeadUnits(data, now).filter((candidate) => inScopeUnit(candidate.unit))) {
    const queue = queueFor(entry.unit.id);
    // 今日新词配额已耗尽时队列为空，跳过这本（避免发出 0 卡指令）。
    if (queue.length === 0) continue;
    return withCounts("wake", entry.unit.id, entry.unit.title, queue, {
      waitedDays: entry.waitedDays
    });
  }

  // 3. 速通本未完成：按 order 取第一本队列非空的速通本。
  const speedRunUnits = data.units
    .filter((unit) => unit.speedRun && !unit.completedAt && inScopeUnit(unit))
    .sort((a, b) => a.order - b.order);
  for (const unit of speedRunUnits) {
    const queue = queueFor(unit.id);
    if (queue.length === 0) continue;
    return withCounts("speedrun", unit.id, unit.title, queue);
  }

  // 4. 常规：到期最多的词书优先；并列/无到期取最早创建（先建先学）。
  const dueCountOf = (unit: Unit) =>
    wordCards.filter((card) => {
      if (card.unitId !== unit.id || (card.status !== "learning" && card.status !== "review")) return false;
      const schedule = scheduleByCardId.get(card.id);
      return schedule ? new Date(schedule.nextReviewAt).getTime() <= now.getTime() : false;
    }).length;
  const candidates = data.units
    .filter(inScopeUnit)
    .map((unit) => ({ unit, queue: queueFor(unit.id), dueCount: dueCountOf(unit) }))
    .filter((candidate) => candidate.queue.length > 0)
    .sort((a, b) => b.dueCount - a.dueCount || a.unit.createdAt.localeCompare(b.unit.createdAt));
  if (candidates.length > 0) {
    const top = candidates[0];
    return withCounts("normal", top.unit.id, top.unit.title, top.queue);
  }

  // 5. 全部清空 → 庆祝态。
  return { kind: "celebrate", unitId: null, unitTitle: null, totalCards: 0, newCount: 0, reviewCount: 0, minutes: 0, ...base };
};
