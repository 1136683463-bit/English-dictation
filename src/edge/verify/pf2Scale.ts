/**
 * PF2 · 规模数据构造器（2026-09-22 数据规模 / 算法复杂度专项）
 *
 * 只服务 `pf2*-*.test.ts`，不参与产品构建（`src/**\/*.test.ts` 之外无引用）。
 *
 * 目标：造出「用户长期使用后」的 AppData 形状——
 * 卡片数 / 复习记录数**随使用持续增长**，是本次排查的重点变量。
 *
 * 规模模型（与真实数据分布对齐的简化的模型）：
 * - 每张卡都有 1 条 schedule（`normalizeSchedules` 会给缺计划的卡补默认计划，
 *   所以真实数据里 schedules.length ≈ cards.length）；
 * - 每张卡都有平均 `reviewsPerCard` 条复习记录（默认 1）；
 * - `grammarRatio` 比例的卡是语法句子卡（type=sentence + tags 含「语法」），
 *   它们是 —— `listDueGrammarReviewCards` / `buildGrammarReviewSession` / `summarizeGrammarMastery`
 *   的 n；
 * - 余下的是词卡（type=word + unitId），它们是 —— `getDueCards` / `buildSpellingQueue` /
 *   `getWeakCardInsights` / `getUnitStats` 的 n。
 *
 * 时间基准：所有 nextReviewAt / reviewedAt 都落在固定过去时间，
 * 保证「到期」「近 14 天低分」这两个时间窗在不同规模下**口径一致**（否则测的是口径不是复杂度）。
 */
import type { AppData, Card, Review, Schedule, SentenceDetails, Unit, WordDetails } from "../../types";
import { APP_SCHEMA_VERSION, defaultSettings } from "../../services/storage";

/** 固定过去时间：任何真实 now 都晚于它 → 恒「已到期」。 */
export const PAST = "2024-01-01T00:00:00.000Z";
/** 固定近期时间：落在「近 14 天」窗口内（用真实 now 作为基准时不可靠，故统一用 Date.now() 之前的相对时间）。 */
export const recentIso = (offsetMs: number) => new Date(Date.now() - offsetMs).toISOString();

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export interface ScaleOptions {
  /** 卡片总数（= schedules 总数）。 */
  cards: number;
  /** 每张卡的平均复习记录数（默认 1 → reviews.length ≈ cards）。 */
  reviewsPerCard?: number;
  /** 语法句子卡占比（默认 0.4）。 */
  grammarRatio?: number;
  /** 词书数量（默认：把词卡按 20 张一本切分，最少 1 本）。 */
  unitCount?: number;
  /** 复习记录里低分（rating<=2）的占比（默认 0.3）——`getWeakCards` / `getWeakCardInsights` 的 y。 */
  wrongRatio?: number;
  /** 词卡是否都带 unitId（默认 true）。false 用于验证 `ensureDefaultUnits` 的回填路径。 */
  assignUnit?: boolean;
}

export interface ScaleData extends AppData {
  __scale: {
    cards: number;
    reviews: number;
    schedules: number;
    grammarCards: number;
    wordCards: number;
    units: number;
  };
}

/**
 * 造一份规模数据（不经迁移管线，直接是合法的内存态 AppData）。
 * 想测迁移管线用 `migrateData(scaleData(opts))` 或 `parseBackupJson(JSON.stringify(...))`。
 */
export const scaleData = (options: ScaleOptions): ScaleData => {
  const total = Math.max(0, Math.floor(options.cards));
  const reviewsPerCard = options.reviewsPerCard ?? 1;
  const grammarRatio = options.grammarRatio ?? 0.4;
  const wrongRatio = options.wrongRatio ?? 0.3;
  const assignUnit = options.assignUnit ?? true;
  const grammarCards = Math.round(total * grammarRatio);
  const wordCards = total - grammarCards;

  const cards: Card[] = [];
  const schedules: Schedule[] = [];
  const sentenceDetails: SentenceDetails[] = [];
  const wordDetails: WordDetails[] = [];
  const reviews: Review[] = [];

  // 词书：把词卡按 20 张一本平分（真实数据 MAX_WORDS_PER_UNIT=200，但单元数很多时
  // 页面按本遍历的成本才是重点，所以给足单元数）。
  const unitCount = Math.max(1, options.unitCount ?? Math.ceil(wordCards / 20));
  const units: Unit[] = Array.from({ length: unitCount }, (_, index) => ({
    id: `unit-${index + 1}`,
    title: `词书 ${index + 1}`,
    description: "",
    order: index + 1,
    color: "#f06423",
    createdAt: PAST,
    updatedAt: PAST
  }));

  const reviewCount = Math.max(0, Math.round(reviewsPerCard));
  let reviewSeq = 0;

  const pushReviews = (cardId: string, mode: Review["mode"], baseFront: string) => {
    for (let index = 0; index < reviewCount; index += 1) {
      const wrong = (reviewSeq + index) % 100 < Math.round(wrongRatio * 100);
      reviews.push({
        id: `review-${reviewSeq}`,
        cardId,
        mode,
        rating: wrong ? 1 : 4,
        answer: baseFront,
        diffJson: "[]",
        // 分散在近 30 天：一部分落在「近 14 天」窗口内，一部分在外。
        reviewedAt: recentIso(((reviewSeq % 30) + 1) * DAY)
      });
      reviewSeq += 1;
    }
  };

  for (let index = 0; index < grammarCards; index += 1) {
    const id = `gcard-${index}`;
    const sentence = `I have studied the word number ${index} for a while`;
    cards.push({
      id,
      type: "sentence",
      front: sentence,
      back: "",
      note: "语法课核心句",
      sourceId: `lesson:lesson-${(index % 197) + 1}`,
      tags: ["语法"],
      status: index % 7 === 0 ? "mastered" : "review",
      priority: false,
      createdAt: PAST,
      updatedAt: PAST,
      masteredAt: index % 7 === 0 ? PAST : null
    });
    schedules.push({
      cardId: id,
      easeFactor: 2.5,
      intervalDays: 1,
      reviewCount: (index % 5) + 1,
      lapseCount: index % 4,
      nextReviewAt: PAST
    });
    sentenceDetails.push({
      cardId: id,
      sentence,
      translation: "",
      keywords: [],
      grammarNote: "",
      audioUrl: ""
    });
    pushReviews(id, index % 3 === 0 ? "recall" : "cloze", sentence);
  }

  for (let index = 0; index < wordCards; index += 1) {
    const id = `wcard-${index}`;
    const unitIndex = unitCount > 0 ? index % unitCount : 0;
    cards.push({
      id,
      type: "word",
      front: `word${index}`,
      back: `词 ${index}`,
      note: "",
      unitId: assignUnit ? units[unitIndex].id : undefined,
      tags: ["核心100"],
      status: index % 5 === 0 ? "new" : index % 11 === 0 ? "mastered" : "review",
      priority: index % 13 === 0,
      createdAt: PAST,
      updatedAt: PAST,
      masteredAt: index % 11 === 0 ? PAST : null
    });
    schedules.push({
      cardId: id,
      easeFactor: 2.5,
      intervalDays: 1,
      reviewCount: (index % 6) + 1,
      lapseCount: index % 5,
      nextReviewAt: index % 4 === 0 ? new Date(Date.now() + 3 * DAY).toISOString() : PAST
    });
    wordDetails.push({
      cardId: id,
      word: `word${index}`,
      phonetic: "",
      partOfSpeech: "n.",
      chineseDefinition: `词 ${index}`,
      englishDefinition: "",
      collocations: "",
      synonyms: "",
      antonyms: "",
      confusedWords: "",
      audioUrl: "",
      sourceSentence: ""
    });
    pushReviews(id, "spelling", `word${index}`);
  }

  const data: AppData = {
    schemaVersion: APP_SCHEMA_VERSION,
    unitGroups: [],
    units,
    cards,
    wordDetails,
    sentenceDetails,
    materials: [],
    materialSegments: [],
    reviews,
    mistakeGenerations: [],
    adventures: [],
    huntAttempts: [],
    huntResults: [],
    grammarLessonsDone: [],
    grammarLessonStagesDone: {},
    grammarBoostsDone: {},
    diaryEntries: [],
    schedules,
    dictionaryEntries: [],
    seededWordVersions: ["core-100-v1"],
    languageGates: [],
    gateAttempts: [],
    runeStates: [],
    settings: { ...defaultSettings }
  };

  return {
    ...data,
    __scale: {
      cards: cards.length,
      reviews: reviews.length,
      schedules: schedules.length,
      grammarCards,
      wordCards,
      units: unitCount
    }
  } as ScaleData;
};

/** 预热 + 多轮取平均的计时器。返回平均毫秒。 */
export const timeIt = (fn: () => unknown, rounds = 5): number => {
  fn(); // 预热（JIT）
  const samples: number[] = [];
  for (let index = 0; index < rounds; index += 1) {
    const start = performance.now();
    fn();
    samples.push(performance.now() - start);
  }
  return samples.reduce((sum, value) => sum + value, 0) / samples.length;
};

/** 中位数（抗离群）。 */
/**
 * 取多轮中的**最小值**作为耗时估计（2026-09-22 由中位数改为最小值）。
 *
 * 为什么：整套测试并行跑，其他用例的 CPU 占用会污染单次测量。
 * 中位数仍会被持续的后台负载抬高（实测同一用例单独跑通过、全量并行下偶发失败），
 * 而最小值最接近「没有外界干扰时的真实成本」——对「比较两个规模的成本比」这类
 * 相对断言来说，最小值也是更稳的估计量。
 */
export const timeMedian = (fn: () => unknown, rounds = 5): number => {
  fn();
  let best = Number.POSITIVE_INFINITY;
  for (let index = 0; index < rounds; index += 1) {
    const start = performance.now();
    fn();
    best = Math.min(best, performance.now() - start);
  }
  return best;
};
