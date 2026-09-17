import type {
  AppData,
  GrammarErrorTag,
  GrammarLesson,
  HuntAttempt,
  HuntCase,
  HuntError,
  HuntResult
} from "../types";
import { huntCases } from "../data/huntCases";
import { grammarLessons } from "../data/grammarLessons";
import { addSentence } from "./cardService";
import { nowIso, uid } from "./storage";

/** 罪名的正式中文名，用于罪名按钮与结算展示。 */
export const GRAMMAR_ERROR_TAG_LABELS: Record<GrammarErrorTag, string> = {
  tense: "时态变形",
  sv_agreement: "主谓一致",
  missing_be: "缺 be 动词",
  article: "冠词",
  plural: "单复数",
  preposition: "介词",
  fragment: "句子残缺",
  run_on: "连接词误用",
  word_order: "语序",
  verb_form: "动词形式",
  comparison: "比较级"
};

/** 罪名的人话版解释，零基础也能看懂，展示在罪名按钮的小字里。 */
export const GRAMMAR_ERROR_TAG_PLAIN: Record<GrammarErrorTag, string> = {
  tense: "事情发生在过去，动词要换成过去式",
  sv_agreement: "他 / 她 / 它做事，动词要加 s",
  missing_be: "主语和形容词之间少了个『是』（am/is/are）",
  article: "可数名词单数前面要有 a / an / the",
  plural: "两个以上要加 s，有些词永远不加",
  preposition: "固定搭配记整块，不能按中文直译",
  run_on: "because 和 so 不能同时用，留一个",
  word_order: "词语站错了位置——英语的语序和中文不太一样",
  verb_form: "动词要穿对形式——原形 / -ing / 过去式，看位置定",
  fragment: "每个句子必须有主语和动词",
  comparison: "两个里比一个，形容词要带上 -er 或 more"
};

/** 每个案件的线索额度：误判达到这个数后只是不再提示，不会阻塞游戏。 */
export const HUNT_CLUE_BUDGET = 5;

/** 挑选收进错词本的词时要跳过的功能词。 */
const NON_CONTENT_WORDS = new Set(["a", "an", "the", "is", "are", "to"]);

/**
 * 从改正结果里挑一个值得收进错词本的词（如 "moved"；短语取第一个实词）。
 * 兜底规则：纯冠词（a / an / the）与「去掉 xx」这类删词型修正返回空串，调用方应跳过，避免垃圾数据。
 */
export const pickCorrectionWord = (correction: string): string => {
  const trimmed = correction.trim();
  if (!trimmed || trimmed.startsWith("去掉")) return "";

  const words = trimmed.split(/\s+/).filter(Boolean);
  const meaningful = words.find((word) => !NON_CONTENT_WORDS.has(word));
  return meaningful ?? "";
};

export const listHuntCases = (): HuntCase[] => huntCases;

// ── R01 课程锁：学会之后才解锁对应破案挑战 ──────────────────

/** 案件 → 引用它的课程（huntCaseIds 反查）。 */
const findUnlockLesson = (caseId: string): GrammarLesson | undefined =>
  grammarLessons.find((lesson) => lesson.huntCaseIds.includes(caseId));

export interface HuntCaseLockInfo {
  caseItem: HuntCase;
  unlocked: boolean;
  /** 未解锁时，引用该案的课程（用于「学完第 X 课就来破案」提示）。 */
  unlockLesson: GrammarLesson | null;
}

/** 番外案（未被任何课 huntCaseIds 引用）的解锁档位：完成第一季（前 12 课）即整体解锁（决策①，2026-09-14 拍板）。 */
const EXTRA_CASES_UNLOCK_LESSON_NUMBER = 12;

/**
 * R01 课程锁：
 * - 被课程引用的案件：该课完成后解锁；
 * - 番外案（未被任何课引用）：完成第 12 课（第一季收官）后整体解锁——
 *   番外案是综合复习性质，错误类型混合，需要第一季的知识点打底才不会越级撞墙。
 */
export const listHuntCasesWithLock = (data: AppData): HuntCaseLockInfo[] => {
  const done = new Set(data.grammarLessonsDone ?? []);
  const seasonOneDone =
    grammarLessons.filter((lesson) => lesson.number <= EXTRA_CASES_UNLOCK_LESSON_NUMBER)
      .every((lesson) => done.has(lesson.id)) &&
    grammarLessons.some((lesson) => lesson.number <= EXTRA_CASES_UNLOCK_LESSON_NUMBER);
  return huntCases.map((caseItem) => {
    const unlockLesson = findUnlockLesson(caseItem.id) ?? null;
    const unlocked = unlockLesson ? done.has(unlockLesson.id) : seasonOneDone;
    return { caseItem, unlocked, unlockLesson };
  });
};

/** 是否有任一案件已解锁（路径页判断「去侦探找错」入口是否可用）。 */
export const hasUnlockedHuntCase = (data: AppData): boolean =>
  listHuntCasesWithLock(data).some((info) => info.unlocked);

/** 找出落在某个词上的错误；该词没问题则返回 undefined。 */
export const findErrorAt = (caseItem: HuntCase, tokenIndex: number): HuntError | undefined =>
  caseItem.errors.find((error) => error.tokenIndex === tokenIndex);

export type HuntVerdictKind = "hit" | "wrongTag" | "notError" | "alreadyFound";

export interface HuntVerdict {
  kind: HuntVerdictKind;
  error?: HuntError;
  message: string;
}

/** 命中失败时按真正的错误类型给一条针对性的线索，把误判变成教学机会。 */
const tagHintForWrongGuess: Record<GrammarErrorTag, string> = {
  tense: "再看看句子里的事件发生在什么时候。",
  sv_agreement: "再看看主语是一个人还是几个人。",
  missing_be: "把这个句子慢慢读一遍，看看是不是少了一个动词。",
  article: "看看名词前面的帽子（a / an / the）戴对了吗。",
  plural: "数一数数量，再想想该不该加 -s。",
  preposition: "这个小词是固定搭配，试着整块记住它。",
  fragment: "这个句子还缺一块，看看缺的是主语还是动词。",
  run_on: "两个连接词不能同时出现，留一个就够。",
  word_order: "看看这句里哪个词站错了位置。",
  verb_form: "再想想这里需要动词的哪种形式。",
  comparison: "两个东西比一比，看看形容词要不要加 -er 或 more。"
};

/**
 * 对一次「选罪名」做裁决：
 * - alreadyFound：这个词之前已经找到过；
 * - notError：这个词没有问题（语气温和，不挫败）；
 * - wrongTag：这里确实有错但罪名选错了，给出按 tag 定制的线索；
 * - hit：命中。
 */
export const judgeGuess = (
  caseItem: HuntCase,
  tokenIndex: number,
  guessedTag: GrammarErrorTag | null,
  foundIndexes: number[]
): HuntVerdict => {
  if (foundIndexes.includes(tokenIndex)) {
    return {
      kind: "alreadyFound",
      message: "这个词你已经找到过了，看看别的地方吧。"
    };
  }

  const error = findErrorAt(caseItem, tokenIndex);
  if (!error) {
    return {
      kind: "notError",
      message: "这个词没有问题，放心。继续侦查别的线索吧。"
    };
  }

  if (guessedTag === error.tag) {
    return {
      kind: "hit",
      error,
      message: "找到了！这个证据收进案卷。"
    };
  }

  const guessedLabel = guessedTag ? GRAMMAR_ERROR_TAG_LABELS[guessedTag] : "";
  const hint = tagHintForWrongGuess[error.tag];
  return {
    kind: "wrongTag",
    error,
    message: guessedLabel
      ? `这里确实有问题，但不是${guessedLabel}。${hint}`
      : `这里确实有问题。${hint}`
  };
};

/** 星级：0 次误判 3 星，1-2 次 2 星，3 次及以上 1 星。 */
export const computeStars = (misses: number): number => {
  if (misses <= 0) return 3;
  if (misses <= 2) return 2;
  return 1;
};

/**
 * 提示目标（用户请求提示时）：按词序返回第一个尚未找到的错误；全部找到返回 undefined。
 * 只提示「罪名 + 大概位置」，不直接给词——方向由我们指，答案让玩家自己找。
 */
export const pickHintTarget = (
  caseItem: HuntCase,
  foundIndexes: number[]
): HuntError | undefined =>
  caseItem.errors.find((error) => !foundIndexes.includes(error.tokenIndex));

/** 提示文案：罪名 + 前半段 / 后半段的大致方位。 */
export const buildHintMessage = (caseItem: HuntCase, error: HuntError): string => {
  const position = error.tokenIndex < caseItem.tokens.length / 2 ? "前半段" : "后半段";
  return `还藏着一处「${GRAMMAR_ERROR_TAG_LABELS[error.tag]}」漏洞，就在这段话的${position}附近——再仔细读读看。`;
};

export interface HuntResultInput {
  caseId: string;
  found: number;
  total: number;
  misses: number;
  durationMs: number;
}

/** 由一局的结果构造 HuntResult（星级自动计算，finishedAt 取当前时间）。 */
export const buildHuntResult = (
  caseItem: HuntCase,
  misses: number,
  durationMs: number,
  startedAt: string
): HuntResult => {
  const elapsedFromStartedAt = Date.now() - new Date(startedAt).getTime();
  const safeDurationMs = Number.isFinite(durationMs) && durationMs >= 0
    ? Math.round(durationMs)
    : Math.max(0, Math.round(elapsedFromStartedAt));

  return {
    id: uid("hunt_result"),
    caseId: caseItem.id,
    found: caseItem.errors.length,
    total: caseItem.errors.length,
    misses: Math.max(0, Math.round(misses)),
    stars: computeStars(Math.max(0, Math.round(misses))),
    durationMs: safeDurationMs,
    finishedAt: nowIso()
  };
};

export interface HuntAttemptInput {
  caseId: string;
  tokenIndex: number;
  guessedTag: GrammarErrorTag | null;
  hit: boolean;
}

/** 追加一次点选记录（不可变）。 */
export const appendHuntAttempt = (data: AppData, input: HuntAttemptInput): AppData => {
  const attempt: HuntAttempt = {
    id: uid("hunt_attempt"),
    caseId: input.caseId,
    tokenIndex: Math.max(0, Math.round(input.tokenIndex)),
    guessedTag: input.guessedTag,
    hit: input.hit,
    createdAt: nowIso()
  };

  return { ...data, huntAttempts: [...data.huntAttempts, attempt] };
};

/** 追加一条破案结算（不可变）。 */
export const appendHuntResult = (data: AppData, result: HuntResult): AppData => ({
  ...data,
  huntResults: [...data.huntResults, result]
});

// ── R02 找错知识缺口 → SM-2 复习队列 ─────────────────────────

/**
 * 由案件原文构造「植错句 → 正确句」的对照卡正面文本。
 * 每个植错点生成一张卡：正面 = 完整正确句（含本处修正语境），复习时按产出型任务复现。
 * 返回空串表示该处错误不适合成卡（如「去掉 xx」的删词型修正）。
 */
const sentenceForError = (caseItem: HuntCase, error: HuntError): string => {
  if (error.correction.trim().startsWith("去掉")) return "";
  return caseItem.tokens.join(" ");
};

/**
 * R02：结案后把本局暴露的知识缺口生成句子卡进入 SM-2 复习队列（tags「语法」，sourceId=hunt:<caseId>）。
 * 缺口判定：hintedTokens（看过提示才找到）∪ wrongTagTokens（罪名归错）——
 * 这两处都是「知道有错但没真正掌握」的信号；一次到位的错误说明本就敏锐，不必重复进队列。
 * 幂等：同一案件 + 同一罪名只收一次（重玩同案不会重复建卡）。
 */
export const addHuntGapSentences = (
  data: AppData,
  caseItem: HuntCase,
  gapTokenIndexes: number[]
): { data: AppData; added: number } => {
  const gapSet = new Set(gapTokenIndexes);
  let next = data;
  let added = 0;
  for (const error of caseItem.errors) {
    if (!gapSet.has(error.tokenIndex)) continue;
    const sentence = sentenceForError(caseItem, error);
    if (!sentence) continue;
    // 幂等键 = 案件 + 罪名 + 原错词（同案同罪名可能有多处不同错词，如两个不同的过去式，需各自成卡）
    const gapKey = `[${error.tag}:${error.original}]`;
    const duplicated = next.cards.some((card) => {
      if (card.type !== "sentence" || card.sourceId !== `hunt:${caseItem.id}`) return false;
      const details = next.sentenceDetails.find((item) => item.cardId === card.id);
      return details?.grammarNote.includes(gapKey) ?? false;
    });
    if (duplicated) continue;
    next = addSentence(next, {
      sentence,
      translation: "",
      keywords: "",
      grammarNote: `[${error.tag}:${error.original}] ${GRAMMAR_ERROR_TAG_LABELS[error.tag]}：${error.original} → ${error.correction}。${error.explanation}`,
      sourceId: `hunt:${caseItem.id}`,
      note: `找错案件：${caseItem.title}（${GRAMMAR_ERROR_TAG_LABELS[error.tag]}）`,
      tags: "语法"
    });
    added += 1;
  }
  return { data: next, added };
};

export interface HuntTagStat {
  tag: GrammarErrorTag;
  /** 选了这个罪名且命中的次数。 */
  found: number;
  /** 选了这个罪名但没有命中的次数（含误判与选错罪名）。 */
  wrong: number;
}

export interface HuntProgressSummary {
  solvedCaseIds: string[];
  totalCases: number;
  totalMisses: number;
  hitCount: number;
  guessCount: number;
  tagStats: HuntTagStat[];
}

/** 全部罪名枚举：遥测、日记归因、指标统计共用同一份词表（R01 硬依赖：tag 词表唯一来源）。 */
export const GRAMMAR_ERROR_TAGS: GrammarErrorTag[] = [
  "tense",
  "sv_agreement",
  "missing_be",
  "article",
  "plural",
  "preposition",
  "fragment",
  "run_on",
  "word_order",
  "verb_form"
];

/**
 * 汇总找错进度：
 * - solved 判定：某个案件的结算里 found === total（total 以案件实际错误数为准）；
 * - totalMisses：所有结算里的误判次数之和；
 * - tagStats：只按「选了某罪名是否命中」统计。
 */
export const summarizeHuntProgress = (data: AppData): HuntProgressSummary => {
  const totalByCaseId = new Map(huntCases.map((caseItem) => [caseItem.id, caseItem.errors.length]));
  const solvedCaseIds = huntCases
    .filter((caseItem) => {
      const total = totalByCaseId.get(caseItem.id) ?? 0;
      return data.huntResults.some((result) => result.caseId === caseItem.id && result.found === total);
    })
    .map((caseItem) => caseItem.id);

  const foundByTag = new Map<GrammarErrorTag, number>();
  const wrongByTag = new Map<GrammarErrorTag, number>();
  let hitCount = 0;

  for (const attempt of data.huntAttempts) {
    if (attempt.hit) hitCount += 1;
    if (!attempt.guessedTag) continue;
    const bucket = attempt.hit ? foundByTag : wrongByTag;
    bucket.set(attempt.guessedTag, (bucket.get(attempt.guessedTag) ?? 0) + 1);
  }

  const tagStats: HuntTagStat[] = GRAMMAR_ERROR_TAGS.map((tag) => ({
    tag,
    found: foundByTag.get(tag) ?? 0,
    wrong: wrongByTag.get(tag) ?? 0
  }));

  return {
    solvedCaseIds,
    totalCases: huntCases.length,
    totalMisses: data.huntResults.reduce((sum, result) => sum + result.misses, 0),
    hitCount,
    guessCount: data.huntAttempts.length,
    tagStats
  };
};
