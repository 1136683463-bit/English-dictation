import { AppData, Card, Review } from "../types";
// R8：rating 判定唯一权威来源，禁止本地副本。
import { isCorrectReview, isWrongReview } from "./reviewRating";

const DAY_MS = 24 * 60 * 60 * 1000;
const weekDayLabels = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

const clampPercent = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

// ─── 学习健康度（R1：唯一权威实现，视图层禁止再写公式） ───
// 设计依据：健康度 = 各维度得分按权重加权平均；无数据的维度按权重剔除后
// 重归一化（禁止按 100 分兜底，否则 0 数据新用户会系统性虚高）。
export const HEALTH_SCORE_WEIGHTS = {
  goalCompletion: 0.35, // 周目标完成度：反映"有没有按节奏学"
  spelling: 0.25, // 拼写正确率：反映"学得扎不扎实"
  dueLoad: 0.25, // 到期负载：反映"有没有欠债"
  weakWords: 0.15 // 薄弱词：反映"有没有拖后腿的词"
} as const;

// 健康度分档阈值：≥82 节奏健康（good），≥62 节奏可控（steady），否则需要收尾（attention）。
export const HEALTH_SCORE_THRESHOLDS = { good: 82, steady: 62 } as const;

// 薄弱词惩罚系数：每个薄弱词扣 8 分（经验值，约 13 个薄弱词清零该维度）。
export const WEAK_WORD_PENALTY = 8;

export type HealthTone = "good" | "steady" | "attention";

export interface HealthScoreInput {
  hasActivity: boolean; // 是否有任何学习活动（false 时不应产出分数）
  goalCompletionPercent: number;
  spellingAccuracy: number | null; // null = 本周无拼写数据，该维度剔除
  dueTotal: number;
  dueReviewGoal: number; // <= 0 表示未配置每日复习上限，到期维度剔除
  weakWords: number;
}

// R11 健康度可解释化：维度元数据（标签 + 提分行动指引），与权重表一一对应。
const HEALTH_DIMENSION_META = {
  goalCompletion: {
    label: "目标完成",
    hint: "每天先清到期复习，把周目标完成度拉满，是最稳的提分项。"
  },
  spelling: {
    label: "拼写正确率",
    hint: "拼写正确率偏低：错词拼写专项练 3 分钟，提分最快。"
  },
  dueLoad: {
    label: "到期负载",
    hint: "到期负债在压分：先清到期复习，清完这一项即回满分。"
  },
  weakWords: {
    label: "薄弱词",
    hint: "薄弱词在拖后腿：优先巩固连续错误的词。"
  }
} as const;

export type HealthDimensionKey = keyof typeof HEALTH_SCORE_WEIGHTS;

export interface HealthScoreDimension {
  key: HealthDimensionKey;
  label: string;
  available: boolean; // false = 该维度无数据，未参与计算
  score: number | null; // 维度得分（0-100）
  baseWeight: number; // 原始权重
  effectiveWeight: number; // 无数据维度剔除后重归一化的权重
  contribution: number; // score × effectiveWeight，对总分的贡献
}

export interface HealthScoreBreakdown {
  total: number;
  dimensions: HealthScoreDimension[];
  /** 最能提分的行动指引（得分最低的可用维度）；无可用维度时为 null。 */
  topLever: string | null;
}

/**
 * R11：健康度构成分解。与 computeHealthScore 共用同一计算路径，
 * 保证展开层"各维度贡献之和 = 总分"恒成立（验收①）。
 */
export const computeHealthScoreBreakdown = (input: HealthScoreInput): HealthScoreBreakdown | null => {
  if (!input.hasActivity) return null;

  const build = (
    key: HealthDimensionKey,
    available: boolean,
    score: number | null
  ): HealthScoreDimension => ({
    key,
    label: HEALTH_DIMENSION_META[key].label,
    available,
    score,
    baseWeight: HEALTH_SCORE_WEIGHTS[key],
    effectiveWeight: 0, // 归一化后回填
    contribution: 0
  });

  const dimensions: HealthScoreDimension[] = [
    build("goalCompletion", true, clampPercent(input.goalCompletionPercent)),
    build(
      "spelling",
      input.spellingAccuracy !== null,
      input.spellingAccuracy === null ? null : clampPercent(input.spellingAccuracy)
    ),
    build(
      "dueLoad",
      input.dueReviewGoal > 0,
      input.dueReviewGoal > 0 ? 100 - clampPercent((input.dueTotal / input.dueReviewGoal) * 100) : null
    ),
    build("weakWords", true, 100 - clampPercent(input.weakWords * WEAK_WORD_PENALTY))
  ];

  const available = dimensions.filter((dimension) => dimension.available && dimension.score !== null);
  const totalWeight = available.reduce((sum, dimension) => sum + dimension.baseWeight, 0);
  if (totalWeight <= 0) return null;

  for (const dimension of available) {
    dimension.effectiveWeight = dimension.baseWeight / totalWeight;
    // 不预取整：保证 Σ(score × effectiveWeight) 与 total 严格同源，展示层再取整。
    dimension.contribution = dimension.score! * dimension.effectiveWeight;
  }

  const total = clampPercent(available.reduce((sum, dimension) => sum + dimension.score! * dimension.effectiveWeight, 0));
  const weakest = available.reduce((min, dimension) => (dimension.score! < min.score! ? dimension : min));
  return {
    total,
    dimensions,
    topLever: HEALTH_DIMENSION_META[weakest.key].hint
  };
};

export const computeHealthScore = (input: HealthScoreInput): number | null => {
  return computeHealthScoreBreakdown(input)?.total ?? null;
};

export const getHealthTone = (score: number): HealthTone =>
  score >= HEALTH_SCORE_THRESHOLDS.good
    ? "good"
    : score >= HEALTH_SCORE_THRESHOLDS.steady
      ? "steady"
      : "attention";

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

// R13：上周同口径对照组。hasBaseline=false（上周零复习）时 UI 显示"—"，不显示误导性的 +100%。
export interface WeeklyComparison {
  reviewCount: number;
  // R14：全模式正确率（主指标）与拼写单项（次指标）双口径。
  overallAccuracy: number | null;
  spellingAccuracy: number | null;
  firstReviewedWords: number;
  hasBaseline: boolean;
}

export interface WeeklyStatsReport {
  weekRangeLabel: string;
  weekReviewCount: number;
  weekReviewedCards: number;
  // R4：全页"新词"唯一口径 = 本周首次进入复习的单词数（不再按 createdAt 统计）。
  weekFirstReviewedWords: number;
  weekMasteredCards: number;
  weekMasteredWords: number;
  // R13：累计掌握单词数（北极星指标，口径 = 当前 status=mastered 的 word 卡）。
  masteredWordsTotal: number;
  previousWeek: WeeklyComparison;
  // R18：零成本次级指标——均有明确行动含义，否则不上页。
  /** 本周有复习行为的不同自然日数（行动含义：每天至少 1 次即可点亮当天）。 */
  weekActiveDays: number;
  /** 本周「错词修复」数：本周之前错过（rating≤2）且本周重回正确（rating≥3）的 word 卡（行动含义：薄弱池减员进度）。 */
  weekFixedWords: number;
  /** 本周已过的自然日数（含今天），配合 weekActiveDays 展示。 */
  elapsedWeekDays: number;
  spellingAccuracy: number | null;
  spellingCorrect: number;
  spellingTotal: number;
  // R14：全模式正确率（主指标）——含 dictation/cloze/recall/recognize 全部模式；spellingAccuracy 退居次指标，口径不变。
  overallAccuracy: number | null;
  overallCorrect: number;
  overallTotal: number;
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

export const startOfLocalWeek = (date: Date) => {
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

// R13：掌握时间的唯一口径——优先 masteredAt（进入 mastered 瞬间打点，不随 priority/编辑变化），
// 历史数据无 masteredAt 时回退 updatedAt（normalizeCard 已做过同款回退，这里再兜底一次内存态）。
const masteredTimeOf = (card: Card) => card.masteredAt ?? card.updatedAt;

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
  const weekMasteredCards = activeCards.filter(
    (card) => card.status === "mastered" && isBetween(masteredTimeOf(card), weekStart, weekEnd)
  ).length;
  const weekMasteredWords = activeCards.filter(
    (card) => card.type === "word" && card.status === "mastered" && isBetween(masteredTimeOf(card), weekStart, weekEnd)
  ).length;
  const weekSpellingReviews = weekReviews.filter((review) => review.mode === "spelling");
  const spellingCorrect = weekSpellingReviews.filter(isCorrectReview).length;
  const spellingTotal = weekSpellingReviews.length;
  const spellingAccuracy = spellingTotal === 0 ? null : Math.round((spellingCorrect / spellingTotal) * 100);
  // R14：全模式口径——weekReviews 已按周过滤，直接聚合（rating>=3 即正确，与单项同标尺）。
  const overallCorrect = weekReviews.filter(isCorrectReview).length;
  const overallTotal = weekReviews.length;
  const overallAccuracy = overallTotal === 0 ? null : Math.round((overallCorrect / overallTotal) * 100);
  // R4：过滤无效时间戳——getTime 对非法日期返回 0，会被 min 误选为"最早复习"，
  // 导致该卡永远不算"本周新词"。
  const firstReviewByCardId = data.reviews.reduce<Map<string, Review>>((firstReviews, review) => {
    if (getTime(review.reviewedAt) <= 0) return firstReviews;
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

  // R13：上周同口径对照（自然周，周一起）。hasBaseline 只看复习次数——上周零复习视为无对照基线。
  const prevWeekStart = addDays(weekStart, -7);
  const prevWeekReviews = data.reviews.filter((review) => isBetween(review.reviewedAt, prevWeekStart, weekStart));
  const prevSpellingReviews = prevWeekReviews.filter((review) => review.mode === "spelling");
  const prevSpellingCorrect = prevSpellingReviews.filter(isCorrectReview).length;
  const prevOverallCorrect = prevWeekReviews.filter(isCorrectReview).length;
  const previousWeek: WeeklyComparison = {
    reviewCount: prevWeekReviews.length,
    overallAccuracy:
      prevWeekReviews.length === 0 ? null : Math.round((prevOverallCorrect / prevWeekReviews.length) * 100),
    spellingAccuracy:
      prevSpellingReviews.length === 0 ? null : Math.round((prevSpellingCorrect / prevSpellingReviews.length) * 100),
    firstReviewedWords: activeCards.filter((card) => {
      const firstReview = firstReviewByCardId.get(card.id);
      return card.type === "word" && firstReview && isBetween(firstReview.reviewedAt, prevWeekStart, weekStart);
    }).length,
    hasBaseline: prevWeekReviews.length > 0
  };
  const masteredWordsTotal = activeCards.filter(
    (card) => card.type === "word" && card.status === "mastered"
  ).length;

  // R18：本周活跃天数——不同自然日去重；非法时间戳（getTime≤0）不计。
  const weekActiveDays = new Set(
    weekReviews.filter((review) => getTime(review.reviewedAt) > 0).map((review) => dateKey(new Date(review.reviewedAt)))
  ).size;
  // R18：错词修复——「本周前错过」∩「本周对过」的 word 卡。与薄弱词（R2）同向：修复一个，薄弱池少一个潜在成员。
  const wrongBeforeWeekCardIds = new Set(
    data.reviews
      .filter((review) => isWrongReview(review) && getTime(review.reviewedAt) > 0 && getTime(review.reviewedAt) < weekStart.getTime())
      .map((review) => review.cardId)
  );
  const correctThisWeekCardIds = new Set(weekReviews.filter(isCorrectReview).map((review) => review.cardId));
  const weekFixedWords = activeCards.filter(
    (card) => card.type === "word" && wrongBeforeWeekCardIds.has(card.id) && correctThisWeekCardIds.has(card.id)
  ).length;
  // R4：句子目标按 cardId 去重（同一张句卡一天练 2 次只计 1）。
  const reviewedSentenceCardIdsThisWeek = new Set(
    weekReviews
      .filter((review) => cardById.get(review.cardId)?.type === "sentence")
      .map((review) => review.cardId)
  );
  const reviewedSentencesThisWeek = reviewedSentenceCardIdsThisWeek.size;
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
      detail: "去重后的句子卡片数"
    }
  ];
  // R4：未配置（target=0）的子目标不参与平均，避免"没设句子目标反被 0% 拖累"。
  const configuredGoals = goalProgress.filter((goal) => goal.target > 0);
  const goalCompletionPercent =
    configuredGoals.length === 0
      ? 0
      : Math.round(configuredGoals.reduce((sum, item) => sum + item.percent, 0) / configuredGoals.length);

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
        (card) => card.status === "mastered" && isBetween(masteredTimeOf(card), dayStart, dayEnd)
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
    weekFirstReviewedWords: firstReviewedWordsThisWeek,
    weekMasteredCards,
    weekMasteredWords,
    masteredWordsTotal,
    previousWeek,
    weekActiveDays,
    weekFixedWords,
    elapsedWeekDays,
    spellingAccuracy,
    spellingCorrect,
    spellingTotal,
    overallAccuracy,
    overallCorrect,
    overallTotal,
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
    suggestions.push(`未来 7 天预计 ${dueNextWeek} 张卡到期，先清到期复习，再添加新词。`);
  } else if (dueNextWeek > 0) {
    suggestions.push(`未来 7 天有 ${dueNextWeek} 张卡会到期，可以拆成 2-3 次短复习。`);
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

export const computeStreak = (reviews: { reviewedAt: string }[], now = new Date()) => {
  const days = new Set(reviews.map((review) => dayKey(new Date(review.reviewedAt))));
  const offsetKey = (offset: number) => {
    const date = new Date(now);
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

/**
 * R7：streak + 每周宽限机制（逻辑层，UI 集成在 R6 之后）。
 *
 * 规则：
 * - 每个自然周（周一起，与 R4 口径一致）允许漏学 1 天不断签，宽限自动消耗、不可积攒、跨周重置；
 * - 同一自然周漏学第 2 天即断签，断签当天起往前的记录不再计入；
 * - 宽限"保断不加天"：streak 只计实际学习日，宽限日防止断签但不增加天数（对齐 Duolingo streak freeze 语义，避免"只学 1 天显示 2 天"的尾巴膨胀）；
 * - 历史起点自然终止：回退越过最早学习日即结束，不消耗宽限（否则刚学几天的新用户会被起点前的"漏学"误标宽限已用）；
 * - 今天"在途"不算漏学：今天无记录但昨天有，streak 从昨天起算、不消耗宽限；
 * - graceUsedThisWeek 只报告当前自然周的宽限消耗状态（历史周的宽限消耗不影响展示）。
 */
export interface StreakWithGrace {
  streak: number;
  graceUsedThisWeek: boolean;
}

export const computeStreakWithGrace = (
  reviews: { reviewedAt: string }[],
  now = new Date()
): StreakWithGrace => {
  const days = new Set(reviews.map((review) => dayKey(new Date(review.reviewedAt))));
  const todayStart = startOfLocalDay(now);
  const hasToday = days.has(dayKey(todayStart));
  const yesterdayStart = addDays(todayStart, -1);
  if (!hasToday && !days.has(dayKey(yesterdayStart))) {
    return { streak: 0, graceUsedThisWeek: false };
  }

  const currentWeekKey = dayKey(startOfLocalWeek(now));
  const earliestKey = Math.min(...days);
  let cursor = hasToday ? todayStart : yesterdayStart;
  let cursorWeekKey = dayKey(startOfLocalWeek(cursor));
  let missedInCursorWeek = 0;
  let streak = 0;
  let graceUsedThisWeek = false;

  // 有限性：回退越过最早学习日（earliestKey）即终止。
  while (true) {
    const weekKey = dayKey(startOfLocalWeek(cursor));
    if (weekKey !== cursorWeekKey) {
      cursorWeekKey = weekKey;
      missedInCursorWeek = 0;
    }
    if (days.has(dayKey(cursor))) {
      streak += 1;
    } else {
      if (dayKey(cursor) < earliestKey) break; // 历史起点：自然终止，不耗宽限
      missedInCursorWeek += 1;
      if (missedInCursorWeek > 1) break;
      if (weekKey === currentWeekKey) graceUsedThisWeek = true;
      // 宽限日：保断不加天
    }
    cursor = addDays(cursor, -1);
  }

  return { streak, graceUsedThisWeek };
};

// ─── R9：未来 N 天到期负载预测 ───

export interface DueForecastDay {
  dateKey: string;
  label: string; // 周一/周二...
  shortDate: string; // M/D
  count: number;
}

/**
 * 逐日到期预测：基于 schedules.nextReviewAt 统计 [明天, 明天+days) 的每日到期卡数。
 * 口径与 dueNextWeek 完全一致（排除 suspended、无效日期不计），保证手工核对可复算（验收①）。
 */
export const getDueForecast = (data: AppData, days = 14, now = new Date()): DueForecastDay[] => {
  const todayStart = startOfLocalDay(now);
  const tomorrowStart = addDays(todayStart, 1);
  const horizonEnd = addDays(tomorrowStart, days);
  const cardById = new Map(data.cards.map((card) => [card.id, card]));

  const countByDay = new Map<string, number>();
  for (const schedule of data.schedules) {
    const card = cardById.get(schedule.cardId);
    if (!card || card.status === "suspended") continue;
    const nextReviewAt = new Date(schedule.nextReviewAt);
    if (!isValidDate(nextReviewAt)) continue;
    if (nextReviewAt < tomorrowStart || nextReviewAt >= horizonEnd) continue;
    const key = dateKey(startOfLocalDay(nextReviewAt));
    countByDay.set(key, (countByDay.get(key) ?? 0) + 1);
  }

  return Array.from({ length: days }, (_, index) => {
    const dayStart = addDays(tomorrowStart, index);
    return {
      dateKey: dateKey(dayStart),
      label: weekDayLabels[dayStart.getDay()],
      shortDate: shortDate(dayStart),
      count: countByDay.get(dateKey(dayStart)) ?? 0
    };
  });
};

/**
 * R9 验收②③：峰值日超每日目标 → 行动建议；全空 → 正向文案；否则 null（不打扰）。
 */
export const buildDueForecastAdvice = (
  forecast: DueForecastDay[],
  dueReviewGoal: number
): string | null => {
  const total = forecast.reduce((sum, day) => sum + day.count, 0);
  if (total === 0) {
    return "未来 14 天没有到期压力，适合补一点新材料或新词。";
  }
  if (dueReviewGoal <= 0) return null;
  const peak = forecast.reduce((max, day) => (day.count > max.count ? day : max), forecast[0]);
  if (peak.count > dueReviewGoal) {
    const overflow = peak.count - dueReviewGoal;
    return `${peak.label}（${peak.shortDate}）到期 ${peak.count} 张，超过每日目标 ${dueReviewGoal} 张，建议提前清掉 ${overflow} 张。`;
  }
  return null;
};

// ─── R12：记忆成熟度分布 ───
// 分桶阈值直接映射调度档位 intervalDays ∈ {0-1 / 2-6 / 7-20 / ≥21}（PRD-Q4 决策，零算法改动）。

export type MaturityBucket = "new" | "learning" | "stable" | "mastered";

export const MATURITY_BUCKET_ORDER: MaturityBucket[] = ["new", "learning", "stable", "mastered"];

export const MATURITY_BUCKET_META: Record<MaturityBucket, { label: string; rangeLabel: string }> = {
  new: { label: "新学", rangeLabel: "间隔 0-1 天" },
  learning: { label: "巩固中", rangeLabel: "间隔 2-6 天" },
  stable: { label: "稳定", rangeLabel: "间隔 7-20 天" },
  mastered: { label: "掌握", rangeLabel: "间隔 ≥21 天" }
};

export const getMaturityBucket = (intervalDays: number): MaturityBucket => {
  if (intervalDays >= 21) return "mastered";
  if (intervalDays >= 7) return "stable";
  if (intervalDays >= 2) return "learning";
  return "new";
};

export interface MaturityDistribution {
  buckets: Array<{ key: MaturityBucket; label: string; rangeLabel: string; count: number }>;
  /** 参与分布的卡片总数（非 suspended；四桶之和恒等于此值，验收①）。 */
  total: number;
}

/**
 * 记忆成熟度分布：全部非 suspended 卡按调度 intervalDays 分四桶。
 * 无 schedule 的卡按 intervalDays=0 落入"新学"（与调度默认一致）。
 */
export const getMaturityDistribution = (data: AppData): MaturityDistribution => {
  const scheduleByCardId = new Map(data.schedules.map((schedule) => [schedule.cardId, schedule]));
  const countByBucket: Record<MaturityBucket, number> = { new: 0, learning: 0, stable: 0, mastered: 0 };
  let total = 0;

  for (const card of data.cards) {
    if (card.status === "suspended") continue;
    const intervalDays = scheduleByCardId.get(card.id)?.intervalDays ?? 0;
    countByBucket[getMaturityBucket(intervalDays)] += 1;
    total += 1;
  }

  return {
    buckets: MATURITY_BUCKET_ORDER.map((key) => ({
      key,
      label: MATURITY_BUCKET_META[key].label,
      rangeLabel: MATURITY_BUCKET_META[key].rangeLabel,
      count: countByBucket[key]
    })),
    total
  };
};

// R13：北极星里程碑阶梯。
export const MASTERED_WORD_MILESTONES = [100, 200, 500, 1000, 2000, 5000];

export interface MasteredMilestone {
  /** 累计掌握单词数。 */
  total: number;
  /** 下一个里程碑；已全部达成为 null。 */
  next: number | null;
  /** 距下一里程碑还差多少词；已全部达成为 0。 */
  remaining: number;
  /** 最近达成的里程碑；一个都未达成为 null。 */
  lastPassed: number | null;
  text: string;
}

/**
 * 里程碑叙事文案（验收③跨里程碑正确）：
 * - total=0：引导起步；
 * - 途中：报"距 X 词还差 Y"；
 * - 全部达成：报最高里程碑。
 */
export const buildMasteredMilestone = (total: number): MasteredMilestone => {
  const safeTotal = Math.max(0, Math.round(total));
  const next = MASTERED_WORD_MILESTONES.find((milestone) => safeTotal < milestone) ?? null;
  const lastPassed = [...MASTERED_WORD_MILESTONES].reverse().find((milestone) => safeTotal >= milestone) ?? null;
  const remaining = next === null ? 0 : next - safeTotal;
  const text =
    safeTotal === 0
      ? `还没有掌握单词，向 ${MASTERED_WORD_MILESTONES[0]} 词里程碑进发`
      : next === null
        ? `已突破 ${MASTERED_WORD_MILESTONES[MASTERED_WORD_MILESTONES.length - 1]} 词，全部里程碑达成`
        : `距 ${next} 词里程碑还差 ${remaining} 词`;

  return { total: safeTotal, next, remaining, lastPassed, text };
};
