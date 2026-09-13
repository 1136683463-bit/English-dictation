import { AppData, Card, Review } from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;
const weekDayLabels = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export interface DailyTrend {
  dateKey: string;
  label: string;
  shortDate: string;
  reviews: number;
  correct: number;
  wrong: number;
  spellingReviews: number;
  spellingCorrect: number;
  newCards: number;
  masteredCards: number;
}

export interface FrequentMistakeWord {
  card: Card;
  wrongCount: number;
  recentWrongCount: number;
  spellingWrongCount: number;
  latestWrongAt: string | null;
  lapseCount: number;
  accuracy: number | null;
}

export interface WeeklyGoalProgress {
  label: string;
  current: number;
  target: number;
  percent: number;
  detail: string;
}

export interface WeeklyStatsReport {
  weekRangeLabel: string;
  weekReviewCount: number;
  weekReviewedCards: number;
  weekNewCards: number;
  weekNewWords: number;
  weekMasteredCards: number;
  weekMasteredWords: number;
  spellingAccuracy: number | null;
  spellingCorrect: number;
  spellingTotal: number;
  goalCompletionPercent: number;
  goalProgress: WeeklyGoalProgress[];
  sevenDayTrend: DailyTrend[];
  mostWrongWords: FrequentMistakeWord[];
  nextWeekSuggestions: string[];
  dueNextWeek: number;
  hasLearningActivity: boolean;
}

const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

const startOfLocalDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const getTime = (value: string) => {
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
};

const isBetween = (value: string, start: Date, end: Date) => {
  const time = getTime(value);
  return time >= start.getTime() && time < end.getTime();
};

const startOfLocalWeek = (date: Date) => {
  const start = startOfLocalDay(date);
  const offset = start.getDay() === 0 ? -6 : 1 - start.getDay();
  start.setDate(start.getDate() + offset);
  return start;
};

const dateKey = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");

const shortDate = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;

const formatRange = (start: Date, end: Date) => `${shortDate(start)}-${shortDate(addDays(end, -1))}`;

const percent = (current: number, target: number) => {
  if (target <= 0) return current > 0 ? 100 : 0;
  return Math.min(100, Math.round((current / target) * 100));
};

const isCorrectReview = (review: Review) => review.rating >= 3;
const isWrongReview = (review: Review) => review.rating <= 2;

export const getWeeklyStatsReport = (data: AppData, now = new Date()): WeeklyStatsReport => {
  const activeCards = data.cards.filter((card) => card.status !== "suspended");
  const cardById = new Map(data.cards.map((card) => [card.id, card]));
  const scheduleByCardId = new Map(data.schedules.map((schedule) => [schedule.cardId, schedule]));
  const todayStart = startOfLocalDay(now);
  const tomorrowStart = addDays(todayStart, 1);
  const weekStart = startOfLocalWeek(now);
  const weekEnd = addDays(weekStart, 7);
  const elapsedWeekDays = Math.max(1, Math.min(7, Math.round((todayStart.getTime() - weekStart.getTime()) / DAY_MS) + 1));
  const recentStart = addDays(todayStart, -6);

  const weekReviews = data.reviews.filter((review) => isBetween(review.reviewedAt, weekStart, weekEnd));
  const weekReviewedCards = new Set(weekReviews.map((review) => review.cardId)).size;
  const weekNewCards = activeCards.filter((card) => isBetween(card.createdAt, weekStart, weekEnd)).length;
  const weekNewWords = activeCards.filter((card) => card.type === "word" && isBetween(card.createdAt, weekStart, weekEnd)).length;
  const weekMasteredCards = activeCards.filter(
    (card) => card.status === "mastered" && isBetween(card.updatedAt, weekStart, weekEnd)
  ).length;
  const weekMasteredWords = activeCards.filter(
    (card) => card.type === "word" && card.status === "mastered" && isBetween(card.updatedAt, weekStart, weekEnd)
  ).length;
  const weekSpellingReviews = weekReviews.filter((review) => review.mode === "spelling");
  const spellingCorrect = weekSpellingReviews.filter(isCorrectReview).length;
  const spellingTotal = weekSpellingReviews.length;
  const spellingAccuracy = spellingTotal === 0 ? null : Math.round((spellingCorrect / spellingTotal) * 100);
  const firstReviewByCardId = data.reviews.reduce<Map<string, Review>>((firstReviews, review) => {
    const current = firstReviews.get(review.cardId);
    if (!current || getTime(review.reviewedAt) < getTime(current.reviewedAt)) {
      firstReviews.set(review.cardId, review);
    }
    return firstReviews;
  }, new Map());

  const firstReviewedWordsThisWeek = activeCards.filter((card) => {
    const firstReview = firstReviewByCardId.get(card.id);
    return card.type === "word" && firstReview && isBetween(firstReview.reviewedAt, weekStart, weekEnd);
  }).length;
  const reviewedSentencesThisWeek = weekReviews.filter((review) => cardById.get(review.cardId)?.type === "sentence").length;
  const reviewTarget = Math.max(0, data.settings.dailyReviewLimit || 0) * elapsedWeekDays;
  const newWordTarget = Math.max(0, data.settings.dailyNewWords || 0) * elapsedWeekDays;
  const sentenceTarget = Math.max(0, data.settings.dailySentences || 0) * elapsedWeekDays;
  const goalProgress: WeeklyGoalProgress[] = [
    {
      label: "复习",
      current: weekReviews.length,
      target: reviewTarget,
      percent: percent(weekReviews.length, reviewTarget),
      detail: `按本周已过 ${elapsedWeekDays} 天计算`
    },
    {
      label: "新词",
      current: firstReviewedWordsThisWeek,
      target: newWordTarget,
      percent: percent(firstReviewedWordsThisWeek, newWordTarget),
      detail: "首次进入复习的单词"
    },
    {
      label: "句子",
      current: reviewedSentencesThisWeek,
      target: sentenceTarget,
      percent: percent(reviewedSentencesThisWeek, sentenceTarget),
      detail: "句子卡片复习次数"
    }
  ];
  const goalCompletionPercent =
    goalProgress.length === 0
      ? 0
      : Math.round(goalProgress.reduce((sum, item) => sum + item.percent, 0) / goalProgress.length);

  const sevenDayTrend = Array.from({ length: 7 }, (_, index) => {
    const dayStart = addDays(recentStart, index);
    const dayEnd = addDays(dayStart, 1);
    const dayReviews = data.reviews.filter((review) => isBetween(review.reviewedAt, dayStart, dayEnd));
    const daySpellingReviews = dayReviews.filter((review) => review.mode === "spelling");

    return {
      dateKey: dateKey(dayStart),
      label: weekDayLabels[dayStart.getDay()],
      shortDate: shortDate(dayStart),
      reviews: dayReviews.length,
      correct: dayReviews.filter(isCorrectReview).length,
      wrong: dayReviews.filter(isWrongReview).length,
      spellingReviews: daySpellingReviews.length,
      spellingCorrect: daySpellingReviews.filter(isCorrectReview).length,
      newCards: activeCards.filter((card) => isBetween(card.createdAt, dayStart, dayEnd)).length,
      masteredCards: activeCards.filter(
        (card) => card.status === "mastered" && isBetween(card.updatedAt, dayStart, dayEnd)
      ).length
    };
  });

  const recentWrongStart = addDays(tomorrowStart, -14).getTime();
  const reviewsByWordId = new Map<string, Review[]>();
  data.reviews.forEach((review) => {
    const card = cardById.get(review.cardId);
    if (!card || card.type !== "word" || card.status === "suspended") return;
    reviewsByWordId.set(review.cardId, [...(reviewsByWordId.get(review.cardId) ?? []), review]);
  });

  const mostWrongWords = Array.from(reviewsByWordId.entries())
    .flatMap(([cardId, reviews]): FrequentMistakeWord[] => {
      const card = cardById.get(cardId);
      if (!card) return [];
      const wrongReviews = reviews.filter(isWrongReview);
      if (wrongReviews.length === 0) return [];
      const correctReviews = reviews.filter(isCorrectReview);
      const spellingWrongCount = wrongReviews.filter((review) => review.mode === "spelling").length;
      const recentWrongCount = wrongReviews.filter((review) => getTime(review.reviewedAt) >= recentWrongStart).length;
      const latestWrongAt = wrongReviews
        .slice()
        .sort((a, b) => getTime(b.reviewedAt) - getTime(a.reviewedAt))[0]?.reviewedAt ?? null;

      return [{
        card,
        wrongCount: wrongReviews.length,
        recentWrongCount,
        spellingWrongCount,
        latestWrongAt,
        lapseCount: scheduleByCardId.get(cardId)?.lapseCount ?? 0,
        accuracy: reviews.length === 0 ? null : Math.round((correctReviews.length / reviews.length) * 100)
      }];
    })
    .sort((a, b) => {
      if (b.recentWrongCount !== a.recentWrongCount) return b.recentWrongCount - a.recentWrongCount;
      if (b.wrongCount !== a.wrongCount) return b.wrongCount - a.wrongCount;
      if (b.lapseCount !== a.lapseCount) return b.lapseCount - a.lapseCount;
      return getTime(b.latestWrongAt ?? "") - getTime(a.latestWrongAt ?? "");
    })
    .slice(0, 10);

  const dueNextWeek = data.schedules.filter((schedule) => {
    const card = cardById.get(schedule.cardId);
    if (!card || card.status === "suspended") return false;
    const nextReviewAt = new Date(schedule.nextReviewAt);
    if (!isValidDate(nextReviewAt)) return false;
    return nextReviewAt >= tomorrowStart && nextReviewAt < addDays(tomorrowStart, 7);
  }).length;

  const nextWeekSuggestions = buildNextWeekSuggestions({
    activeCards,
    dueNextWeek,
    goalCompletionPercent,
    mostWrongWords,
    spellingAccuracy,
    weekReviewCount: weekReviews.length,
    dailyReviewLimit: data.settings.dailyReviewLimit
  });

  return {
    weekRangeLabel: formatRange(weekStart, weekEnd),
    weekReviewCount: weekReviews.length,
    weekReviewedCards,
    weekNewCards,
    weekNewWords,
    weekMasteredCards,
    weekMasteredWords,
    spellingAccuracy,
    spellingCorrect,
    spellingTotal,
    goalCompletionPercent,
    goalProgress,
    sevenDayTrend,
    mostWrongWords,
    nextWeekSuggestions,
    dueNextWeek,
    hasLearningActivity: data.reviews.length > 0 || activeCards.length > 0
  };
};

const buildNextWeekSuggestions = ({
  activeCards,
  dueNextWeek,
  goalCompletionPercent,
  mostWrongWords,
  spellingAccuracy,
  weekReviewCount,
  dailyReviewLimit
}: {
  activeCards: Card[];
  dueNextWeek: number;
  goalCompletionPercent: number;
  mostWrongWords: FrequentMistakeWord[];
  spellingAccuracy: number | null;
  weekReviewCount: number;
  dailyReviewLimit: number;
}) => {
  const suggestions: string[] = [];
  const activeWords = activeCards.filter((card) => card.type === "word").length;
  const masteredWords = activeCards.filter((card) => card.type === "word" && card.status === "mastered").length;
  const masteredPercent = activeWords === 0 ? 0 : Math.round((masteredWords / activeWords) * 100);
  const reviewLimit = Math.max(1, dailyReviewLimit || 30);

  if (activeCards.length === 0) {
    return ["先导入或添加一小组高频词，再开始建立可复习的历史记录。"];
  }

  if (weekReviewCount === 0) {
    suggestions.push(`下周先用每天 ${Math.min(12, reviewLimit)} 次复习重启节奏，连续两天比一次冲刺更稳。`);
  }

  if (dueNextWeek > reviewLimit * 3) {
    suggestions.push(`下周预计 ${dueNextWeek} 张卡到期，先清到期复习，再添加新词。`);
  } else if (dueNextWeek > 0) {
    suggestions.push(`下周有 ${dueNextWeek} 张卡会到期，可以拆成 2-3 次短复习。`);
  }

  if (spellingAccuracy !== null && spellingAccuracy < 80) {
    suggestions.push("安排 3 次错词专项拼写，把正确率拉回 80% 以上后再扩充新词。");
  }

  if (mostWrongWords.length > 0) {
    suggestions.push(`优先处理「${mostWrongWords[0].card.front}」等高频错词，复习时先看来源句再拼写。`);
  }

  if (goalCompletionPercent < 60 && weekReviewCount > 0) {
    suggestions.push("本周目标完成度偏低，下周可以先把每日目标调小一点，保证每天都能收尾。");
  }

  if (masteredPercent >= 80 && activeWords > 0) {
    suggestions.push("已掌握词占比很高，下周适合补一批新词，避免复习池变得太安静。");
  }

  return suggestions.slice(0, 4);
};

export const dayKey = (date: Date) =>
  date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

export const computeStreak = (reviews: { reviewedAt: string }[]) => {
  const days = new Set(reviews.map((review) => dayKey(new Date(review.reviewedAt))));
  const offsetKey = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    return dayKey(date);
  };

  let cursor = days.has(offsetKey(0)) ? 0 : days.has(offsetKey(1)) ? 1 : -1;
  if (cursor === -1) return 0;

  let streak = 0;
  while (days.has(offsetKey(cursor))) {
    streak += 1;
    cursor += 1;
  }
  return streak;
};
