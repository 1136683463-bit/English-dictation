import type { AppData, GrammarErrorTag, HuntCase, HuntError } from "../types";
import { huntCases } from "../data/huntCases";
import { grammarLessons } from "../data/grammarLessons";
import { computeWeakSpots } from "./grammarWeakSpotsService";

/**
 * F3 回马枪（2026-09-13 PRD）：关 2/关 3 头部 1–2 题「弱点加权旧点变式」。
 *
 * 设计要点：
 * - 题源复用 huntCase 的植错点（noticing 训练的成熟形态），同点不同案——用户见过罪名但没见过这句，
 *   是间隔提取 + 变式迁移，不是背答案。
 * - 选题优先级：① 弱点档案（grammarWeakSpotsService，频率×新近加权）Top 罪名 → 含该罪名的案件抽 1 题；
 *   ② 无弱点时降级为「最近 3 课的 huntCaseIds 随机 1 题」（保证任何进度下都有题可出）。
 * - 埋点：grammar_ambush_result（weakSpotTag 非空=命中弱点；null=降级随机），供 D3 看回马枪正确率。
 */

export interface AmbushQuestion {
  /** 被抽中的案件。 */
  caseItem: HuntCase;
  /** 被抽中的植错点。 */
  error: HuntError;
  /** 命中的弱点罪名（降级随机时为 null）。 */
  weakSpotTag: GrammarErrorTag | null;
  /** 被回顾的旧课 id（huntCase 反查到的引用课；番外案为 null）。 */
  sourceLessonId: string | null;
  /** 题干话术（零术语，叙事皮）。 */
  promptZh: string;
}

/** 案件 → 引用它的课（huntCaseIds 反查；番外案无引用课）。 */
const findSourceLesson = (caseId: string): string | null =>
  grammarLessons.find((lesson) => lesson.huntCaseIds.includes(caseId))?.id ?? null;

/** 从含指定罪名的案件里抽一个该罪名的植错点（确定性取第一案第一处，保证可回放、不跳变）。 */
const pickErrorByTag = (tag: GrammarErrorTag, excludeCaseIds: Set<string>): AmbushQuestion | null => {
  for (const caseItem of huntCases) {
    if (excludeCaseIds.has(caseItem.id)) continue;
    const error = caseItem.errors.find((item) => item.tag === tag);
    if (!error) continue;
    return {
      caseItem,
      error,
      weakSpotTag: tag,
      sourceLessonId: findSourceLesson(caseItem.id),
      promptZh: "回马一枪——这个错误你之前遇到过，这次换了个马甲。指出有问题的那个词。"
    };
  }
  return null;
};

/** 降级：从最近几课的 huntCaseIds 里抽 1 题（按课程编号取当前课之前最近的有案课）。 */
const pickFallbackError = (currentLessonId: string, excludeCaseIds: Set<string>): AmbushQuestion | null => {
  const current = grammarLessons.find((lesson) => lesson.id === currentLessonId);
  const currentNumber = current?.number ?? Number.MAX_SAFE_INTEGER;
  // 当前课之前、最近的 3 个有 huntCase 的课
  const recentWithCases = grammarLessons
    .filter((lesson) => lesson.number < currentNumber && lesson.huntCaseIds.length > 0)
    .sort((a, b) => b.number - a.number)
    .slice(0, 3);
  for (const lesson of recentWithCases) {
    for (const caseId of lesson.huntCaseIds) {
      if (excludeCaseIds.has(caseId)) continue;
      const caseItem = huntCases.find((item) => item.id === caseId);
      const error = caseItem?.errors[0];
      if (!caseItem || !error) continue;
      return {
        caseItem,
        error,
        weakSpotTag: null,
        sourceLessonId: lesson.id,
        promptZh: "回马一枪——前几课的旧知识换了件外套。指出有问题的那个词。"
      };
    }
  }
  // 兜底：任意一个未排除的案件第一处错
  for (const caseItem of huntCases) {
    if (excludeCaseIds.has(caseItem.id)) continue;
    const error = caseItem.errors[0];
    if (!error) continue;
    return {
      caseItem,
      error,
      weakSpotTag: null,
      sourceLessonId: findSourceLesson(caseItem.id),
      promptZh: "回马一枪——指出有问题的那个词。"
    };
  }
  return null;
};

/**
 * 为指定关卡出 count 道回马枪题（默认 1 题，关 2/关 3 头部 1–2 题）。
 * 优先按弱点档案 Top 罪名各出 1 题；弱点不足 count 时用降级题补足；同案不重复出。
 * excludeCaseIds：本关正文已用的案件（避免回马枪与正文撞题）。
 */
export const buildAmbushQuestions = (
  data: AppData,
  currentLessonId: string,
  count = 1,
  excludeCaseIds: string[] = []
): AmbushQuestion[] => {
  const exclude = new Set(excludeCaseIds);
  const questions: AmbushQuestion[] = [];

  // ① 弱点加权：按 score 排序的活跃弱点，逐罪名出题
  const weakSpots = computeWeakSpots(data);
  for (const spot of weakSpots) {
    if (questions.length >= count) break;
    const question = pickErrorByTag(spot.tag, exclude);
    if (question) {
      questions.push(question);
      exclude.add(question.caseItem.id); // 同案不重复出
    }
  }

  // ② 降级补足：无弱点或弱点题不够时，用最近 3 课旧点补齐
  while (questions.length < count) {
    const fallback = pickFallbackError(currentLessonId, exclude);
    if (!fallback) break;
    questions.push(fallback);
    exclude.add(fallback.caseItem.id);
  }

  return questions;
};

/** 回马枪判题：点中的词是否为该植错点（复用 hunt 的命中口径——点中 tokenIndex 即中）。 */
export const judgeAmbushPick = (question: AmbushQuestion, pickedTokenIndex: number): boolean =>
  pickedTokenIndex === question.error.tokenIndex;

// ── F1 关 2/关 3 内容来源（2026-09-13 PRD §6.1）──────────────────────────

/**
 * 关 2 回访提取题（cloze/rebuild）：复现本课核心句型，凭记忆产出而非再认。
 * 题源：本课 targetSentence + variants 三态（肯定/否定/疑问）+ recall 句型，共 3–5 题。
 * cloze = 给句意抽掉关键词填空；rebuild = 给打乱的词块重建句子（复用 arrange 内核）。
 */
export interface RevisitQuestion {
  kind: "cloze" | "rebuild";
  /** 句意提示（中文）。 */
  intentZh: string;
  /** 完整正确句。 */
  answer: string;
  /** cloze：抽掉关键词后的题干（用 ___ 占位）；rebuild：不使用。 */
  clozeText?: string;
  /** cloze 被抽掉的词（答案词）。 */
  clozeAnswer?: string;
  /** rebuild：打乱后的词块；cloze：不使用。 */
  rebuildTokens?: string[];
}

/** 抽句子的「语法关键词」做 cloze 空位：优先 be 动词/助动词/谓语动词（本课语法点所在），抽不到用第 2 词。 */
const pickClozeWord = (sentence: string): { clozeText: string; clozeAnswer: string } => {
  const GRAMMAR_WORDS = /^(am|is|are|was|were|will|did|does|do|have|has|can|must|should|went|go|drawing|playing|reading|listening|doing|ate|saw|watched)$/i;
  const words = sentence.split(/\s+/).filter(Boolean);
  const grammarIndex = words.findIndex((w) => GRAMMAR_WORDS.test(w.replace(/[.,!?;:]$/g, "")));
  const index = grammarIndex >= 0 ? grammarIndex : Math.min(1, words.length - 1);
  const answer = words[index].replace(/[.,!?;:]$/g, "");
  const clozeWords = [...words];
  clozeWords[index] = words[index].endsWith(".") || words[index].endsWith("?") ? "___" + words[index].slice(-1) : "___";
  return { clozeText: clozeWords.join(" "), clozeAnswer: answer };
};

/** 确定性打乱词块（复用课程同款 mulberry32 思路，种子 = 句文本，保证可回放）。 */
const shuffleTokens = (tokens: string[], seed: string): string[] => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  let state = h >>> 0;
  const rand = () => { state = (state + 0x6d2b79f5) | 0; let t = Math.imul(state ^ (state >>> 15), 1 | state); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const arr = [...tokens];
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  if (arr.every((v, i) => v === tokens[i]) && arr.length > 1) [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]];
  return arr;
};

/**
 * 构建关 2 回访问卷：核心句 rebuild + variants 各 1 题（cloze/rebuild 轮换防背答案）。
 * 取题：targetSentence(rebuild) + 肯定(cloze) + 否定(rebuild) + 疑问(cloze)，按可用 variants 截断到 3–5 题。
 */
export const buildRevisitQuiz = (lessonId: string): RevisitQuestion[] => {
  const lesson = grammarLessons.find((item) => item.id === lessonId);
  if (!lesson) return [];
  const quiz: RevisitQuestion[] = [];
  // 第 1 题：核心句 rebuild（完整产出）
  quiz.push({
    kind: "rebuild",
    intentZh: lesson.intentZh,
    answer: lesson.targetSentence,
    rebuildTokens: shuffleTokens(lesson.targetSentence.split(/\s+/).filter(Boolean), lesson.targetSentence)
  });
  // variants 三态轮换：肯定 cloze、否定 rebuild、疑问 cloze
  const variants = lesson.variants ?? [];
  const pattern: Array<"cloze" | "rebuild"> = ["cloze", "rebuild", "cloze"];
  variants.slice(0, 3).forEach((variant, i) => {
    const kind = pattern[i % pattern.length];
    if (kind === "cloze") {
      const { clozeText, clozeAnswer } = pickClozeWord(variant.en);
      quiz.push({ kind, intentZh: variant.zh, answer: variant.en, clozeText, clozeAnswer });
    } else {
      quiz.push({ kind, intentZh: variant.zh, answer: variant.en, rebuildTokens: shuffleTokens(variant.en.split(/\s+/).filter(Boolean), variant.en) });
    }
  });
  return quiz.slice(0, 5); // 上限 5 题（PRD §6.1：3–5 题）
};

/** 关 3 旧案重审配置：本课新案 + 30–50% 旧罪名变式（复用 huntCase 现有案件，按 30–50% 比例混入旧案）。 */
export interface Stage3CasePlan {
  /** 本课新案（本课 huntCaseIds 对应案件）。 */
  newCases: HuntCase[];
  /** 旧案变式（30–50%，从本课之前课的旧案里抽）。 */
  revisitCases: HuntCase[];
}

export const buildStage3CasePlan = (lessonId: string): Stage3CasePlan => {
  const lesson = grammarLessons.find((item) => item.id === lessonId);
  if (!lesson) return { newCases: [], revisitCases: [] };
  const newCases = lesson.huntCaseIds
    .map((id) => huntCases.find((item) => item.id === id))
    .filter((item): item is HuntCase => Boolean(item));
  // 旧案：本课之前所有课的 huntCaseIds（排除本课已用）
  const usedIds = new Set(lesson.huntCaseIds);
  const oldCaseIds = grammarLessons
    .filter((item) => item.number < lesson.number)
    .flatMap((item) => item.huntCaseIds)
    .filter((id) => !usedIds.has(id));
  const oldCases = oldCaseIds
    .map((id) => huntCases.find((item) => item.id === id))
    .filter((item): item is HuntCase => Boolean(item));
  // 30–50% 混入：旧案数 = 新案数 × 40%（取中值），至少 1 案（有旧案可取时）
  const targetRevisit = newCases.length === 0 ? Math.min(2, oldCases.length) : Math.max(1, Math.round(newCases.length * 0.4));
  const revisitCases = oldCases.slice(0, Math.min(targetRevisit, oldCases.length));
  return { newCases, revisitCases };
};
