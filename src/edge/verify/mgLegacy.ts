/**
 * 老用户数据夹具（2026-09-22，老数据行为一致性验证）。
 *
 * 目标：造出**字段不全 / 字段是旧名 / 早期版本结构**的数据，让它们走
 * `seedAppData`（内部 = parseBackupJson = migrateData + applyStartupMigration）
 * 这条真实升级入口，然后验证「每一项功能是否都对」——
 * 不只是「能加载」。历史版本对照（git 上的 types.ts）：
 *
 *   - 最早版本（04c5ca1 / 8f44fa3）的 `Card` **没有** prioritySource / suspendedFrom /
 *     mistakeGraduatedAt；`Schedule` **没有** recoveryCount；AppData 已经一次性带上了
 *     huntAttempts / huntResults / grammarLessonsDone / diaryEntries（所以「整个字段缺失」
 *     仍是真实的老数据形态——早期备份、手工裁剪、同步合并都可能少）。
 *   - `grammarLessonStagesDone` / `grammarBoostsDone` 是 2026-09-13 F1 之后才有的
 *     可选字段，双写上线前的存量数据只有 `grammarLessonsDone`（关 1 口径）。
 *
 * 本文件只负责「造数据」，断言留在各 mg5/mg6/mg7 用例里。
 */
import type { AppData, Card, DiaryEntry, HuntAttempt, HuntResult, Review, Schedule, SentenceDetails } from "../../types";
import { makeAppData } from "./fixtures";

/** 固定过去时间：永远已到期，且不随测试运行时刻漂移。 */
export const LEGACY_ISO = "2024-01-01T00:00:00.000Z";
/** 一个「根本解析不出时间」的垃圾串（老数据里常见的脏值）。 */
export const BROKEN_ISO = "not-a-date";

/** 早期版本卡片：只有 Card 类型最原始的那批字段。 */
export const legacyCard = (overrides: Partial<Card> & { id: string; front: string }): Record<string, unknown> => ({
  type: "word",
  back: "",
  note: "",
  tags: [],
  status: "review",
  priority: false,
  createdAt: LEGACY_ISO,
  updatedAt: LEGACY_ISO,
  ...overrides
});

/**
 * 早期版本语法句子卡（tags 缺失 / sourceId 缺失两种形态都用它造）。
 * front 用真实课程核心句，这样卡片能对上真实课程与真实复习题型。
 */
export const legacySentenceCard = (
  overrides: Partial<Card> & { id: string; front: string }
): Record<string, unknown> =>
  legacyCard({
    type: "sentence",
    status: "review",
    ...overrides
  });

/** 早期版本复习计划：没有 recoveryCount。 */
export const legacySchedule = (cardId: string, overrides: Partial<Schedule> = {}): Record<string, unknown> => ({
  cardId,
  easeFactor: 2.5,
  intervalDays: 1,
  reviewCount: 1,
  lapseCount: 0,
  nextReviewAt: LEGACY_ISO,
  ...overrides
});

export const legacyReview = (
  cardId: string,
  overrides: Partial<Review> = {}
): Record<string, unknown> => ({
  id: `review_${cardId}_legacy`,
  cardId,
  mode: "spelling",
  rating: 4,
  answer: "",
  diffJson: "[]",
  reviewedAt: LEGACY_ISO,
  ...overrides
});

/** 早期日记条目：先造「字段齐全」的版本，再由调用方按场景删字段。 */
export const legacyDiaryEntry = (overrides: Partial<DiaryEntry> = {}): Record<string, unknown> => ({
  id: "diary_legacy_1",
  dateKey: "2024-01-01",
  questionId: "q_legacy_1",
  questionZh: "今天你做了什么？",
  answerEn: "I go to park yesterday.",
  correctedEn: "I went to the park yesterday.",
  issues: [
    {
      original: "go",
      correction: "went",
      explanation: "说的是昨天的事，动词换个说法更顺。"
    }
  ],
  status: "done",
  createdAt: LEGACY_ISO,
  ...overrides
});

export const legacyHuntAttempt = (
  overrides: Partial<HuntAttempt> = {}
): Record<string, unknown> => ({
  id: "hunt_attempt_legacy_1",
  caseId: "hunt-kitchen-note",
  tokenIndex: 0,
  guessedTag: "tense",
  hit: false,
  createdAt: LEGACY_ISO,
  ...overrides
});

export const legacyHuntResult = (
  overrides: Partial<HuntResult> = {}
): Record<string, unknown> => ({
  id: "hunt_result_legacy_1",
  caseId: "hunt-kitchen-note",
  found: 1,
  total: 1,
  misses: 0,
  stars: 3,
  durationMs: 60000,
  finishedAt: LEGACY_ISO,
  ...overrides
});

export const legacySentenceDetails = (
  cardId: string,
  sentence: string,
  overrides: Partial<SentenceDetails> = {}
): Record<string, unknown> => ({
  cardId,
  sentence,
  translation: "",
  keywords: [],
  grammarNote: "",
  audioUrl: "",
  ...overrides
});

/**
 * 老数据的公共底：带上 seededWordVersions 以免补种 100 张内置核心词
 * （补种会污染「老数据实际内容 → 页面数字」的对照）。
 */
export const legacyBase = (patch: Record<string, unknown> = {}): Partial<AppData> =>
  makeAppData({
    seededWordVersions: ["core-100-v1"],
    ...patch
  } as Partial<AppData>);

/** 一节课的真实 id / 核心句（用于跨模块一致性用例）。 */
export const LESSON_ID = "lesson-13-now";
export const LESSON_SENTENCE = "I am drawing a picture.";
