import { getMistakesByDate } from "./mistakeBookService";
import { getDueCards, getMistakeCards, getNewCardsForToday } from "./reviewService";
import { dayKey } from "./statsService";
import { AppData, Card, Settings } from "../types";

/**
 * 拼写队列构建（PRD-wordbook-v2 P0-2）。
 * 从 SpellingPage 抽出的纯函数，便于单测验收口径：
 * - unit 锁定 + smart：到期词优先 → 未到期 learning/review 按到期升序 → 新词补足（全局新词配额）；
 *   mastered 默认不入场；
 * - unit 锁定 + all：「全量复刷」手动入口，整本（含 mastered）按创建顺序入场；
 * - mistakes 模式：按错词本口径（unit 过滤 / 日期过滤）；
 * - ?cards= 定向训练：指定卡集优先于其他规则；
 * - P1-4 纯复习日（reviewOnly）：standard 模式不安排新词，只出复习轨道卡。
 */

export type SpellingQueueMode = "standard" | "mistakes";

/** P0-2：unit 队列范围——smart 按记忆状态过滤（mastered 不入场）；all = 「全量复刷」手动入口（含 mastered）。 */
export type SpellingUnitScope = "smart" | "all";

/** P1-4：今天是否处于「纯复习日」临时档（settings.reviewOnlyDayKey = 当天 dayKey，跨天自动失效）。 */
export const isReviewOnlyDay = (settings: Settings, now = new Date()): boolean =>
  settings.reviewOnlyDayKey === dayKey(now);

/**
 * P2-1 学习范围锁定：返回锁定的词书 id 集合；未设置/空数组 = 未锁定（null）。
 * 只作用于全局智能队列与指令卡候选；词书单队列是显式进入，视为用户主动覆盖。
 */
export const getStudyScopeUnitIds = (settings: Settings): Set<string> | null => {
  const ids = settings.studyScopeUnitIds;
  return ids && ids.length > 0 ? new Set(ids) : null;
};

export const buildSpellingQueue = (
  data: AppData,
  unitId: string | null,
  queueMode: SpellingQueueMode,
  limit = 30,
  mistakeDate?: string | null,
  cardIds: string[] = [],
  unitScope: SpellingUnitScope = "smart",
  reviewOnly = false
): Card[] => {
  const normalizedLimit = Math.max(1, limit);
  const cardIdSet = new Set(cardIds);
  const filterRequestedCards = (cards: Card[]) =>
    cardIds.length === 0 ? cards : cards.filter((card) => cardIdSet.has(card.id));

  if (queueMode === "mistakes") {
    if (mistakeDate) {
      return filterRequestedCards(
        getMistakesByDate(data, mistakeDate)
          .filter((entry) => !unitId || entry.card.unitId === unitId)
          .map((entry) => entry.card)
      ).slice(0, normalizedLimit);
    }
    return filterRequestedCards(getMistakeCards(data, { unitId, limit: normalizedLimit })).slice(0, normalizedLimit);
  }
  const dataCards = getDueCards(data);
  const allCards = data.cards;
  // R5 定向训练：standard 模式同样尊重 ?cards= 指定卡集（此前只在 mistakes 模式生效）。
  if (cardIds.length > 0 && !unitId) {
    const cardById = new Map(allCards.map((card) => [card.id, card]));
    return cardIds
      .map((id) => cardById.get(id))
      .filter((card): card is Card => Boolean(card) && card!.type === "word" && card!.status !== "suspended")
      .slice(0, normalizedLimit);
  }
  if (unitId) {
    const unitWords = allCards.filter((card) => card.type === "word" && card.status !== "suspended" && card.unitId === unitId);
    // P0-2 全量复刷：手动入口，整本（含 mastered）按创建顺序复刷。
    if (unitScope === "all") {
      return filterRequestedCards(unitWords).slice(0, normalizedLimit);
    }
    // P0-2 智能队列：到期词优先 → 未到期 learning/review 按到期升序 → 新词补足（全局 ≤10/日配额，#2 拍板全局共享）。
    // mastered 默认不入场；new 卡占用的是全局新词配额，避免多本连学时新词爆量。
    const scheduleByCardId = new Map(data.schedules.map((schedule) => [schedule.cardId, schedule]));
    const now = new Date();
    const inReviewTrack = unitWords.filter((card) => card.status !== "new" && card.status !== "mastered");
    const dueUnitWords = inReviewTrack
      .filter((card) => {
        const schedule = scheduleByCardId.get(card.id);
        return schedule && new Date(schedule.nextReviewAt) <= now;
      })
      .sort((a, b) => (scheduleByCardId.get(a.id)?.nextReviewAt ?? "").localeCompare(scheduleByCardId.get(b.id)?.nextReviewAt ?? ""));
    const upcomingUnitWords = inReviewTrack
      .filter((card) => {
        const schedule = scheduleByCardId.get(card.id);
        return !schedule || new Date(schedule.nextReviewAt) > now;
      })
      .sort((a, b) => (scheduleByCardId.get(a.id)?.nextReviewAt ?? "").localeCompare(scheduleByCardId.get(b.id)?.nextReviewAt ?? ""));
    // P1-4 纯复习日：不安排新词，队列只剩复习轨道（到期 + 未到期）。
    const unitNewCards = reviewOnly ? [] : getNewCardsForToday(data, { type: "word" }).filter((card) => card.unitId === unitId);
    return filterRequestedCards([...dueUnitWords, ...upcomingUnitWords, ...unitNewCards]).slice(0, normalizedLimit);
  }
  // R1 到期口径拆分：真到期单词优先；不足 limit 时用今日新词（New cards/day）补足；
  // 两者都为空才回退到全部 active 单词（保留现有回退行为）。
  // P2-1 学习范围锁定：全局队列只出范围内词书的词（未分配词在锁定时视为范围外）。
  const scopeIds = getStudyScopeUnitIds(data.settings);
  const inScope = (card: Card) => !scopeIds || (card.unitId ? scopeIds.has(card.unitId) : false);
  const dueWords = dataCards.filter((card) => card.type === "word" && inScope(card));
  // P1-4 纯复习日：只出到期词，不用新词补足、不回退全量（空队列=今日复习已清空）。
  if (reviewOnly) return filterRequestedCards(dueWords).slice(0, normalizedLimit);
  const queue =
    dueWords.length >= normalizedLimit
      ? dueWords
      : [...dueWords, ...getNewCardsForToday(data, { type: "word" }).filter(inScope)];
  if (queue.length > 0) return queue.slice(0, normalizedLimit);
  return allCards.filter((card) => card.type === "word" && card.status !== "suspended" && inScope(card)).slice(0, normalizedLimit);
};
