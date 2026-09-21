import { AppData, Card, CardStatus, Rating, Review, ReviewMode, Schedule } from "../types";
// R8：rating 判定唯一权威来源，禁止本地副本。
import { isCorrectReview, isWrongReview } from "./reviewRating";
import { nowIso, uid } from "./storage";

const DAY_MS = 24 * 60 * 60 * 1000;

// R2：priority 康复摘星阈值——系统置位的卡连续 2 次 rating>=3 视为康复，自动摘除。
export const PRIORITY_RECOVERY_THRESHOLD = 2;

/**
 * 掌握判定与写入的唯一权威（W0 口径统一，2026-09-18 PRD 前置项）。
 *
 * 历史上 mastered 有两处独立写入：① 本文件的 SM-2 达标（rating=4 且累计复习 ≥4 次）；
 * ② 语法复习页的 free_type「连续两次输出通过」。两处各写一遍 status/masteredAt，
 * 掌握度分布会因路径不同而漂移（见 data-audit-grammar-boost-2026-09-18 洞察 2）。
 * 现在判定分两个判据函数、写入统一走 applyMasteredStatus。
 */
export const CARD_MASTERED_MIN_REVIEW_COUNT = 4;

export const isMasteredBySpacedRepetition = (rating: Rating, nextReviewCount: number): boolean =>
  rating === 4 && nextReviewCount >= CARD_MASTERED_MIN_REVIEW_COUNT;

/**
 * 语法句子卡已在 mastered 时不再被这一次复习降级（R09 Step2 验收项「已 mastered 卡不降级」）。
 *
 * 为什么只对语法句子卡：语法复习页的掌握判据是「自由输出连续 2 次一次通过」，
 * 是一个**跨多次会话**才达成的复合条件；而 SM-2 分支每次复习都会重算
 * `rating === 4 && reviewCount >= 4`，于是一次「想不起来了，看答案」（rating 1）
 * 就把卡片打回 review——复习页顶部的「已掌握 N」随之**倒退**，
 * 与 PRD「让用户看到已掌握在增长」的目标直接冲突。
 *
 * 词卡的降级行为（reviewService.test.ts R13）保持不变：词卡掌握判据就是 SM-2 本身，
 * 答错了收回掌握标记是自洽的。
 */
const keepsMasteredStatus = (card: Card, nextStatus: CardStatus): boolean =>
  nextStatus === "review" && card.status === "mastered" && card.type === "sentence" && card.tags.includes("语法");

/**
 * 把一张卡置为 mastered（幂等；已在 mastered 时保留原 masteredAt）。
 * 两条掌握路径共用此写入，保证 status 与 masteredAt 语义一致。
 */
export const applyMasteredStatus = (data: AppData, cardId: string): AppData => {
  const timestamp = nowIso();
  return {
    ...data,
    cards: data.cards.map((card) =>
      card.id === cardId && card.status !== "mastered"
        ? { ...card, status: "mastered" as const, masteredAt: card.masteredAt ?? timestamp, updatedAt: timestamp }
        : card
    )
  };
};

const addMinutes = (minutes: number) => new Date(Date.now() + minutes * 60 * 1000).toISOString();

/**
 * 间隔上限（2026-09-21 修，P0）。
 *
 * `rating === 4` 分支是 `intervalDays × easeFactor × 1.3`，easeFactor 第 6 次触顶 3.2
 * 之后乘数固定 4.16。连续「一次答对」十几次以后 intervalDays 会指数增长：
 *   第 7 次已 11095 天、第 13 次约 5.75e7 天，第 14 次 `Date.now() + days * DAY_MS`
 *   超出 Date 的 ±8.64e15 ms 上限 → `new Date()` 得到 Invalid Date →
 *   `toISOString()` 抛 `RangeError: Invalid time value`。
 * 项目没有 ErrorBoundary，该次评分不生效、之后每次点击都抛同一错——用户卡死在复习页。
 *
 * 上限取 10 年：任何真实复习场景都不会需要更远，同时给存量异常数据（如 1e9）
 * 留出「一次复习即被拉回」的自愈路径。
 */
export const MAX_INTERVAL_DAYS = 3650;

/** 把间隔夹到 [0, MAX_INTERVAL_DAYS]；非有限数（NaN / Infinity）按 0 处理。 */
const clampIntervalDays = (days: number): number => {
  if (!Number.isFinite(days)) return 0;
  return Math.min(MAX_INTERVAL_DAYS, Math.max(0, days));
};

const addDays = (days: number) => new Date(Date.now() + clampIntervalDays(days) * DAY_MS).toISOString();

const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

const isSameLocalDay = (value: string, day = new Date()) => {
  const date = new Date(value);
  if (!isValidDate(date)) return false;

  return (
    date.getFullYear() === day.getFullYear() &&
    date.getMonth() === day.getMonth() &&
    date.getDate() === day.getDate()
  );
};

const getReviewTime = (review: Review) => {
  const time = new Date(review.reviewedAt).getTime();
  return Number.isNaN(time) ? 0 : time;
};

export const createInitialSchedule = (cardId: string): Schedule => ({
  cardId,
  easeFactor: 2.5,
  intervalDays: 0,
  reviewCount: 0,
  lapseCount: 0,
  nextReviewAt: nowIso()
});

// 到期口径（R1）：只有已进入复习轨道的卡（learning/review）且排期已过才算"到期"。
// status === "new" 的卡不再立即到期，由每日训练队列按 New cards/day 模式通过
// getNewCardsForToday 混入；mastered / suspended 一律不进到期队列。
export const getDueCards = (data: AppData): Card[] => {
  const now = new Date();
  const scheduleByCardId = new Map(data.schedules.map((schedule) => [schedule.cardId, schedule]));
  const dueIds = new Set(
    data.schedules
      .filter((schedule) => new Date(schedule.nextReviewAt) <= now)
      .map((schedule) => schedule.cardId)
  );
  return data.cards
    .filter(
      (card) =>
        card.status !== "suspended" &&
        card.status !== "new" &&
        card.status !== "mastered" &&
        dueIds.has(card.id)
    )
    .sort((a, b) => {
      const aSchedule = scheduleByCardId.get(a.id);
      const bSchedule = scheduleByCardId.get(b.id);
      return (aSchedule?.nextReviewAt ?? "").localeCompare(bSchedule?.nextReviewAt ?? "");
    });
};

const getFirstReviewByCardId = (reviews: Review[]) =>
  reviews.reduce<Map<string, Review>>((firstReviews, review) => {
    const current = firstReviews.get(review.cardId);
    if (!current || getReviewTime(review) < getReviewTime(current)) {
      firstReviews.set(review.cardId, review);
    }
    return firstReviews;
  }, new Map());

// 今日"已学新词"口径：与 getLearningStats 的 newWordsToday 一致——
// active 卡中，其首次复习（first review）发生在今天本地日的数量。
const countFirstReviewedToday = (data: AppData, type: Card["type"]) => {
  const firstReviewByCardId = getFirstReviewByCardId(data.reviews);
  return data.cards.filter((card) => {
    if (card.status === "suspended" || card.type !== type) return false;
    const firstReview = firstReviewByCardId.get(card.id);
    return Boolean(firstReview && isSameLocalDay(firstReview.reviewedAt));
  }).length;
};

// 今日新卡默认配额口径：
// - word（或未指定类型，新卡以单词为主）：max(0, dailyNewWords - 今日已首评新词数)，对齐 Anki New cards/day；
// - sentence：直接用 dailySentences 作为每日上限（不扣减今日已学，保持简单）；
// - 其他类型：暂不设每日上限。
const getDefaultNewCardLimit = (data: AppData, type?: Card["type"]) => {
  if (type === "sentence") return Math.max(0, data.settings.dailySentences);
  if (type && type !== "word") return Number.POSITIVE_INFINITY;
  return Math.max(0, data.settings.dailyNewWords - countFirstReviewedToday(data, "word"));
};

// 返回今日应混入训练队列的新卡：status === "new" 的 active 卡，按创建时间升序（先建先学）。
export const getNewCardsForToday = (
  data: AppData,
  options: { type?: Card["type"]; limit?: number } = {}
): Card[] => {
  const limit = options.limit ?? getDefaultNewCardLimit(data, options.type);
  if (limit <= 0) return [];

  return data.cards
    .filter((card) => card.status === "new" && (options.type ? card.type === options.type : true))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .slice(0, limit);
};

// R2：薄弱词滑动口径的唯一权威实现（Q2 已追认为正式口径）。
// 口径：priority || 最近一次复习为低分 || 近 14 天内有低分。
// 旧口径"历史任意一次低分即永久计入"只增不减——一个词错过后连续答对也永远算薄弱。
// lapseCount 为永久累计值，不参与滑动口径（历史上的 lapse 且近期表现良好不应计入）。
// 健康度、Today 摘要、Training/Review 页的薄弱词数字必须全部源于此函数。
export const getWeakCards = (data: AppData): Card[] => {
  const activeCards = data.cards.filter((card) => card.status !== "suspended");
  const recentWrongSince = Date.now() - 14 * DAY_MS;
  const latestReviewByCardId = new Map<string, Review>();
  const recentWrongCardIds = new Set<string>();
  for (const review of data.reviews) {
    const time = getReviewTime(review);
    const current = latestReviewByCardId.get(review.cardId);
    if (!current || time >= getReviewTime(current)) {
      latestReviewByCardId.set(review.cardId, review);
    }
    if (isWrongReview(review) && time >= recentWrongSince) {
      recentWrongCardIds.add(review.cardId);
    }
  }
  return activeCards.filter((card) => {
    const latestReview = latestReviewByCardId.get(card.id);
    return (
      card.priority ||
      (latestReview !== undefined && isWrongReview(latestReview)) ||
      recentWrongCardIds.has(card.id)
    );
  });
};

export const getLearningStats = (data: AppData) => {
  const dueCards = getDueCards(data);
  const activeCards = data.cards.filter((card) => card.status !== "suspended");
  const scheduleByCardId = new Map(data.schedules.map((schedule) => [schedule.cardId, schedule]));
  const todayReviews = data.reviews.filter((review) => isSameLocalDay(review.reviewedAt));
  const reviewedCardIdsToday = new Set(todayReviews.map((review) => review.cardId));
  const lowRatingCardIds = new Set(data.reviews.filter(isWrongReview).map((review) => review.cardId));
  const lowRatingCardIdsToday = new Set(todayReviews.filter(isWrongReview).map((review) => review.cardId));
  const firstReviewByCardId = getFirstReviewByCardId(data.reviews);
  // R6 窗口口径用的近 14 天低分卡集合；薄弱词判定本身已收敛到 getWeakCards（R2 唯一权威源）。
  const recentWrongSince = Date.now() - 14 * DAY_MS;
  const recentWrongCardIds = new Set<string>();
  for (const review of data.reviews) {
    const time = getReviewTime(review);
    if (isWrongReview(review) && time >= recentWrongSince) {
      recentWrongCardIds.add(review.cardId);
    }
  }
  const weakCards = getWeakCards(data);
  const mastered = activeCards.filter((card) => card.status === "mastered").length;
  const priority = activeCards.filter((card) => card.priority).length;

  return {
    dueWords: dueCards.filter((card) => card.type === "word").length,
    dueSentences: dueCards.filter((card) => card.type === "sentence").length,
    // R1 新口径：dueTotal 只统计"真到期"卡（不含新卡/mastered）。
    // dueOverdueTotal 与 dueTotal 同值，显式命名便于新代码表达"真到期"语义。
    dueTotal: dueCards.length,
    dueOverdueTotal: dueCards.length,
    dueReviewGoal: data.settings.dailyReviewLimit,
    reviewedToday: todayReviews.length,
    reviewedCardsToday: reviewedCardIdsToday.size,
    reviewedWordsToday: activeCards.filter((card) => card.type === "word" && reviewedCardIdsToday.has(card.id)).length,
    reviewedSentencesToday: activeCards.filter((card) => card.type === "sentence" && reviewedCardIdsToday.has(card.id)).length,
    newWordsToday: activeCards.filter((card) => {
      const firstReview = firstReviewByCardId.get(card.id);
      return card.type === "word" && firstReview && isSameLocalDay(firstReview.reviewedAt);
    }).length,
    newWordGoal: data.settings.dailyNewWords,
    sentenceGoal: data.settings.dailySentences,
    wrongToday: lowRatingCardIdsToday.size,
    // R6 窗口口径：wrongCards 只计近 14 天有低分的卡；终身累计保留为次要字段。
    wrongCards: activeCards.filter((card) => recentWrongCardIds.has(card.id)).length,
    wrongCardsLifetime: activeCards.filter((card) => lowRatingCardIds.has(card.id)).length,
    weakCards: weakCards.length,
    weakWords: weakCards.filter((card) => card.type === "word").length,
    totalCards: data.cards.length,
    activeCards: activeCards.length,
    mastered,
    priority,
    // R12：手动标星 vs 系统关注拆分计数。
    priorityManual: activeCards.filter((card) => card.priority && card.prioritySource !== "system").length,
    // R2 口径修正：系统关注 = 被置位 priority 且非手动标星（含 legacy 无 source）。
    // 不再用 lapseCount≥3 兜底——历史 lapse 但未置位的卡不算系统关注，
    // 否则康复摘星后会被终身 lapse 立即算回。
    prioritySystem: activeCards.filter((card) => card.priority && card.prioritySource !== "manual").length,
    newCards: activeCards.filter((card) => card.status === "new").length,
    availableNewWords: activeCards.filter((card) => card.type === "word" && card.status === "new").length,
    suspendedCards: data.cards.length - activeCards.length,
    missingScheduleCards: activeCards.filter((card) => !scheduleByCardId.has(card.id)).length,
    cardsByType: {
      words: activeCards.filter((card) => card.type === "word").length,
      phrases: activeCards.filter((card) => card.type === "phrase").length,
      sentences: activeCards.filter((card) => card.type === "sentence").length
    },
    latestReviewAt: data.reviews[data.reviews.length - 1]?.reviewedAt ?? null,
    nextDueAt:
      activeCards
        .map((card) => scheduleByCardId.get(card.id)?.nextReviewAt)
        .filter((value): value is string => Boolean(value))
        .sort()[0] ?? null
  };
};

export interface WeakCardInsight {
  card: Card;
  latestReview?: Review;
  latestWrongReview?: Review;
  wrongCount: number;
  recentWrongCount: number;
  consecutiveWrongCount: number;
  lapseCount: number;
  score: number;
}

const getCardReviews = (data: AppData, cardId: string) =>
  data.reviews
    .filter((review) => review.cardId === cardId)
    .sort((a, b) => a.reviewedAt.localeCompare(b.reviewedAt));

export const getWeakCardInsights = (
  data: AppData,
  options: {
    limit?: number;
    unitId?: string | null;
    type?: Card["type"];
  } = {}
): WeakCardInsight[] => {
  const since = Date.now() - 14 * DAY_MS;

  return data.cards
    .filter((card) => card.status !== "suspended")
    .filter((card) => (options.type ? card.type === options.type : true))
    .filter((card) => (options.unitId ? card.unitId === options.unitId : true))
    .map((card) => {
      const reviews = getCardReviews(data, card.id);
      const wrongReviews = reviews.filter(isWrongReview);
      const recentWrongCount = wrongReviews.filter((review) => {
        const reviewedAt = new Date(review.reviewedAt).getTime();
        return Number.isFinite(reviewedAt) && reviewedAt >= since;
      }).length;
      const latestReviews = reviews.slice().reverse();
      const consecutiveWrongCount = latestReviews.findIndex((review) => !isWrongReview(review));
      const schedule = data.schedules.find((item) => item.cardId === card.id);
      const normalizedConsecutiveWrong =
        consecutiveWrongCount === -1 ? latestReviews.length : Math.max(0, consecutiveWrongCount);
      const latestWrongReview = wrongReviews[wrongReviews.length - 1];
      const score =
        normalizedConsecutiveWrong * 6 +
        recentWrongCount * 3 +
        wrongReviews.length +
        (schedule?.lapseCount ?? 0) * 2 +
        (card.priority ? 2 : 0);

      return {
        card,
        latestReview: reviews[reviews.length - 1],
        latestWrongReview,
        wrongCount: wrongReviews.length,
        recentWrongCount,
        consecutiveWrongCount: normalizedConsecutiveWrong,
        lapseCount: schedule?.lapseCount ?? 0,
        score
      };
    })
    .filter((insight) => insight.wrongCount > 0 || insight.lapseCount > 0 || insight.consecutiveWrongCount > 0)
    .sort((a, b) => {
      if (b.consecutiveWrongCount !== a.consecutiveWrongCount) {
        return b.consecutiveWrongCount - a.consecutiveWrongCount;
      }
      if (b.recentWrongCount !== a.recentWrongCount) return b.recentWrongCount - a.recentWrongCount;
      if (b.score !== a.score) return b.score - a.score;
      return (b.latestWrongReview?.reviewedAt ?? "").localeCompare(a.latestWrongReview?.reviewedAt ?? "");
    })
    .slice(0, options.limit ?? 30);
};

export const getMistakeCards = (
  data: AppData,
  options: {
    limit?: number;
    unitId?: string | null;
  } = {}
) => getWeakCardInsights(data, { ...options, type: "word" }).map((insight) => insight.card);

// @deprecated 薄弱词计数请用 getLearningStats().weakWords / getWeakCards；
// 本函数仅继续提供 consecutiveErrorWords / recentErrorWords（保留导出防外部断裂）。
export const getWeakStats = (data: AppData) => {
  const insights = getWeakCardInsights(data, { type: "word", limit: data.cards.length });
  return {
    // R2：weakWords 委托权威口径，与 getLearningStats().weakWords 同源（值可能变化，属预期）。
    weakWords: getWeakCards(data).filter((card) => card.type === "word").length,
    consecutiveErrorWords: insights.filter((insight) => insight.consecutiveWrongCount >= 2).length,
    recentErrorWords: insights.filter((insight) => insight.recentWrongCount > 0).length
  };
};

export const getRecentErrorReviews = (data: AppData, limit = 5) => {
  const cardById = new Map(data.cards.map((card) => [card.id, card]));
  const scheduleByCardId = new Map(data.schedules.map((schedule) => [schedule.cardId, schedule]));

  return data.reviews
    .filter(isWrongReview)
    .slice()
    .sort((a, b) => getReviewTime(b) - getReviewTime(a))
    .slice(0, limit)
    .map((review) => {
      const card = cardById.get(review.cardId);
      const schedule = scheduleByCardId.get(review.cardId);

      return {
        review,
        card,
        schedule,
        title: card?.front ?? "已删除卡片",
        description: card?.back ?? "",
        type: card?.type ?? "word",
        lapseCount: schedule?.lapseCount ?? 0,
        nextReviewAt: schedule?.nextReviewAt ?? null
      };
    });
};

export interface ReviewUndoSnapshot {
  cardId: string;
  reviewId: string;
  previousCard?: Card;
  previousSchedule?: Schedule;
}

export const undoReview = (data: AppData, snapshot: ReviewUndoSnapshot): AppData => {
  const previousCard = snapshot.previousCard;
  const cards = previousCard
    ? data.cards.some((card) => card.id === snapshot.cardId)
      ? data.cards.map((card) => (card.id === snapshot.cardId ? previousCard : card))
      : [...data.cards, previousCard]
    : data.cards.filter((card) => card.id !== snapshot.cardId);

  const previousSchedule = snapshot.previousSchedule;
  const schedules = previousSchedule
    ? data.schedules.some((schedule) => schedule.cardId === snapshot.cardId)
      ? data.schedules.map((schedule) => (schedule.cardId === snapshot.cardId ? previousSchedule : schedule))
      : [...data.schedules, previousSchedule]
    : data.schedules.filter((schedule) => schedule.cardId !== snapshot.cardId);

  return {
    ...data,
    cards,
    schedules,
    reviews: data.reviews.filter((review) => review.id !== snapshot.reviewId)
  };
};

export const markCardsPriority = (data: AppData, cardIds: string[]): AppData => {
  const priorityIds = new Set(cardIds);
  const timestamp = nowIso();

  return {
    ...data,
    cards: data.cards.map((card) =>
      priorityIds.has(card.id) && !card.priority
        ? { ...card, priority: true, updatedAt: timestamp }
        : card
    )
  };
};

export const applyReviewWithUndo = (
  data: AppData,
  card: Card,
  mode: ReviewMode,
  rating: Rating,
  answer = "",
  diffJson = ""
): { data: AppData; undo: ReviewUndoSnapshot } => {
  const previousCard = data.cards.find((item) => item.id === card.id);
  const previousSchedule = data.schedules.find((item) => item.cardId === card.id);
  const schedule = data.schedules.find((item) => item.cardId === card.id) ?? createInitialSchedule(card.id);
  /**
   * easeFactor 也要守一道（2026-09-21 修）。
   *
   * `Math.max(1.3, NaN - 0.25)` 得到的是 NaN——Math.max 对 NaN 不做保护。
   * 一旦 easeFactor 是 NaN（非持久化路径可达：内存态、同步导入、测试构造），
   * rating 3/4 的乘法会把 NaN 传进 intervalDays，`addDays` 随即抛
   * `RangeError: Invalid time value`；rating 1/2 虽不抛，但会把 NaN 写回 schedule 留毒。
   * normalizeSchedules 用 asNumber 兜住了持久化路径，这里补上非持久化路径。
   * 落到默认值 2.5（SM-2 的标准初值）——比归零或 1.3 更合理：那是「未知」不是「很难」。
   */
  let easeFactor = Number.isFinite(schedule.easeFactor) ? schedule.easeFactor : 2.5;
  // 起点就夹一次：存量里可能存着 1e9 这类异常间隔（旧版本没有上限），
  // 不夹的话它会一直传下去（见 MAX_INTERVAL_DAYS 说明）。
  let intervalDays = clampIntervalDays(schedule.intervalDays);
  let lapseCount = Number.isFinite(schedule.lapseCount) ? schedule.lapseCount : 0;
  let nextReviewAt = schedule.nextReviewAt;
  const timestamp = nowIso();
  const reviewId = uid("review");

  if (rating === 1) {
    easeFactor = Math.max(1.3, easeFactor - 0.25);
    intervalDays = 0;
    lapseCount += 1;
    nextReviewAt = addMinutes(10);
  } else if (rating === 2) {
    easeFactor = Math.max(1.3, easeFactor - 0.1);
    intervalDays = 1;
    nextReviewAt = addDays(1);
  } else if (rating === 3) {
    // R09 Step1：语法句子卡「多次尝试后通过」不再放大间隔——试几次才答对说明还没内化，
    // 间隔维持原样（不变短也不拉长），防止未掌握卡被排远。cloze 词卡（词汇听写）口径不动。
    const isGrammarSentenceCard = card.type === "sentence" && card.tags.includes("语法");
    if (isGrammarSentenceCard) {
      intervalDays = Math.max(1, intervalDays || 1);
    } else {
      intervalDays = clampIntervalDays(Math.max(1, Math.round((intervalDays || 1) * easeFactor)));
    }
    nextReviewAt = addDays(intervalDays);
  } else {
    easeFactor = Math.min(3.2, easeFactor + 0.12);
    intervalDays = clampIntervalDays(Math.max(3, Math.round((intervalDays || 1) * easeFactor * 1.3)));
    nextReviewAt = addDays(intervalDays);
  }

  const review: Review = {
    id: reviewId,
    cardId: card.id,
    mode,
    rating,
    answer,
    diffJson,
    reviewedAt: timestamp
  };

  // R2 priority 康复摘星：仅系统置位卡（priority && prioritySource !== "manual"，含 legacy 无 source）
  // 参与康复计数；手动标星永不自动摘除、不维护该字段（保持 undefined）。
  // rating>=3（T1 判定）累计 +1，rating<=2 清零重来；连续 2 次正确（PRIORITY_RECOVERY_THRESHOLD）摘星。
  const participatesRecovery = card.priority === true && card.prioritySource !== "manual";
  const nextRecoveryCount = participatesRecovery
    ? isCorrectReview(review)
      ? (schedule.recoveryCount ?? 0) + 1
      : 0
    : schedule.recoveryCount;
  const recovered = participatesRecovery && (nextRecoveryCount ?? 0) >= PRIORITY_RECOVERY_THRESHOLD;

  const nextSchedule: Schedule = {
    cardId: card.id,
    easeFactor,
    intervalDays,
    reviewCount: schedule.reviewCount + 1,
    lapseCount,
    nextReviewAt,
    // R2：仅参与康复的卡维护 recoveryCount（摘星时归零）；其余卡不写入该字段。
    ...(participatesRecovery ? { recoveryCount: recovered ? 0 : nextRecoveryCount } : {})
  };

  const spacedRepetitionStatus: CardStatus = isMasteredBySpacedRepetition(rating, nextSchedule.reviewCount)
    ? "mastered"
    : "review";
  // R09 Step2：语法句子卡一旦掌握就不再被单次失误降级（见 keepsMasteredStatus 说明）。
  const nextStatus: CardStatus = keepsMasteredStatus(card, spacedRepetitionStatus)
    ? "mastered"
    : spacedRepetitionStatus;
  // R2：康复摘星必须真正写入 priority:false 并清除 prioritySource。
  // R2 修复（QA 对抗发现）：lapseCount 是终身累计值，自动置位只在「本次产生新 lapse 且
  // 累计≥3」时触发；若沿用 lapseCount>=3 恒真条件，摘星后下一次复习会被历史 lapse 立即
  // 重新置位（且 prioritySource 写回 system 形成脏数据），康复摘星形同虚设。
  const newLapseAutoSet = rating === 1 && lapseCount >= 3;
  const nextPriority = recovered ? false : newLapseAutoSet || card.priority;
  // R12 重点口径拆分：算法自动置位标记为 system；用户手动标星（manual）优先保留。
  const nextPrioritySource = recovered
    ? undefined
    : newLapseAutoSet
      ? card.prioritySource ?? "system"
      : card.prioritySource;

  return {
    data: {
      ...data,
      cards: data.cards.map((item) =>
        item.id === card.id
          ? {
              ...item,
              status: nextStatus,
              priority: nextPriority,
              prioritySource: nextPrioritySource,
              // R13：仅在「非 mastered → mastered」转换瞬间打点； mastered 期间保持不变，退出 mastered 时清空。
              masteredAt:
                nextStatus === "mastered"
                  ? item.status === "mastered"
                    ? item.masteredAt ?? timestamp
                    : timestamp
                  : null,
              updatedAt: timestamp
            }
          : item
      ),
      schedules: data.schedules.some((item) => item.cardId === card.id)
        ? data.schedules.map((item) => (item.cardId === card.id ? nextSchedule : item))
        : [...data.schedules, nextSchedule],
      reviews: [...data.reviews, review]
    },
    undo: {
      cardId: card.id,
      reviewId,
      previousCard,
      previousSchedule
    }
  };
};

export const applyReview = (
  data: AppData,
  card: Card,
  mode: ReviewMode,
  rating: Rating,
  answer = "",
  diffJson = ""
): AppData => applyReviewWithUndo(data, card, mode, rating, answer, diffJson).data;
