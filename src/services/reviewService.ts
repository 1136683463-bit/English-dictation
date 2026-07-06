import { AppData, Card, Rating, Review, ReviewMode, Schedule } from "../types";
import { nowIso, uid } from "./storage";

const DAY_MS = 24 * 60 * 60 * 1000;

const addMinutes = (minutes: number) => new Date(Date.now() + minutes * 60 * 1000).toISOString();
const addDays = (days: number) => new Date(Date.now() + days * DAY_MS).toISOString();

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

export const getDueCards = (data: AppData): Card[] => {
  const now = new Date();
  const dueIds = new Set(
    data.schedules
      .filter((schedule) => new Date(schedule.nextReviewAt) <= now)
      .map((schedule) => schedule.cardId)
  );
  return data.cards
    .filter((card) => card.status !== "suspended" && dueIds.has(card.id))
    .sort((a, b) => {
      const aSchedule = data.schedules.find((schedule) => schedule.cardId === a.id);
      const bSchedule = data.schedules.find((schedule) => schedule.cardId === b.id);
      return (aSchedule?.nextReviewAt ?? "").localeCompare(bSchedule?.nextReviewAt ?? "");
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
  const firstReviewByCardId = data.reviews.reduce<Map<string, Review>>((firstReviews, review) => {
    const current = firstReviews.get(review.cardId);
    if (!current || getReviewTime(review) < getReviewTime(current)) {
      firstReviews.set(review.cardId, review);
    }
    return firstReviews;
  }, new Map());
  const weakCards = activeCards.filter((card) => {
    const schedule = scheduleByCardId.get(card.id);
    return card.priority || (schedule?.lapseCount ?? 0) > 0 || lowRatingCardIds.has(card.id);
  });
  const mastered = activeCards.filter((card) => card.status === "mastered").length;
  const priority = activeCards.filter((card) => card.priority).length;

  return {
    dueWords: dueCards.filter((card) => card.type === "word").length,
    dueSentences: dueCards.filter((card) => card.type === "sentence").length,
    dueTotal: dueCards.length,
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
    wrongCards: activeCards.filter((card) => lowRatingCardIds.has(card.id)).length,
    weakCards: weakCards.length,
    weakWords: weakCards.filter((card) => card.type === "word").length,
    totalCards: data.cards.length,
    activeCards: activeCards.length,
    mastered,
    priority,
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

const isWrongReview = (review: Review) => review.rating <= 2;

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

export const getWeakStats = (data: AppData) => {
  const insights = getWeakCardInsights(data, { type: "word", limit: data.cards.length });
  return {
    weakWords: insights.length,
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
  let easeFactor = schedule.easeFactor;
  let intervalDays = schedule.intervalDays;
  let lapseCount = schedule.lapseCount;
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
    intervalDays = Math.max(1, Math.round((intervalDays || 1) * easeFactor));
    nextReviewAt = addDays(intervalDays);
  } else {
    easeFactor = Math.min(3.2, easeFactor + 0.12);
    intervalDays = Math.max(3, Math.round((intervalDays || 1) * easeFactor * 1.3));
    nextReviewAt = addDays(intervalDays);
  }

  const nextSchedule: Schedule = {
    cardId: card.id,
    easeFactor,
    intervalDays,
    reviewCount: schedule.reviewCount + 1,
    lapseCount,
    nextReviewAt
  };

  const nextStatus = rating === 4 && nextSchedule.reviewCount >= 4 ? "mastered" : "review";
  const nextPriority = lapseCount >= 3 || card.priority;

  const review: Review = {
    id: reviewId,
    cardId: card.id,
    mode,
    rating,
    answer,
    diffJson,
    reviewedAt: timestamp
  };

  return {
    data: {
      ...data,
      cards: data.cards.map((item) =>
        item.id === card.id
          ? { ...item, status: nextStatus, priority: nextPriority, updatedAt: timestamp }
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
