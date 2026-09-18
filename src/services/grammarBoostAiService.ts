import type { AiProviderSettings, AppData, GrammarErrorTag } from "../types";
import {
  buildAiThinkingParams,
  isAiProviderConfigured,
  normalizeChatCompletionsUrl,
  postChatCompletion
} from "./aiHttpClient";
import { GRAMMAR_ERROR_TAGS } from "./huntService";
import { normalizeLessonSentence } from "./lessonService";
import { nowIso } from "./storage";
import type { BoostItem } from "./grammarBoostService";

/**
 * 「趁热练」AI 层（2026-09-18 PRD §4.6/§4.7）。
 *
 * 边界（PRD Non-goal 5/6）：
 * - AI 只做批改、归因、措辞与解释；**判分一律走确定性规则**（diffScore / 词块比对）。
 * - AI 生成的题目**必须过校验才可下发**（6 条校验，见 validateGeneratedItem）——不过则丢弃。
 * - 未配置 AI / 超时 / 解析失败 → 立即降级（degraded=true），功能不消失（PRD US-5）。
 *
 * 契约对齐日记批改（diaryService.buildCorrectionMessages）：corrected / recast / issues[tag] / followUp，
 * 复用同一解析口径，不建第二套管线；共性 prompt 规则抽为共享常量。
 */

/** 单次 AI 调用的超时（不吃 provider 默认 120s——延迟而非成本才是瓶颈，PRD §7.4）。 */
const BOOST_AI_TIMEOUT_MIN_MS = 8_000;
const BOOST_AI_TIMEOUT_MAX_MS = 10_000;

export const boostAiTimeoutMs = (provider: AiProviderSettings): number =>
  Math.min(Math.max(provider.timeoutMs, BOOST_AI_TIMEOUT_MIN_MS), BOOST_AI_TIMEOUT_MAX_MS);

// ── 缓存（旁路 localStorage 键，不进 AppData / 不参与导出）────────────────

const CORRECTION_CACHE_KEY = "grammar-boost-ai-cache-v1";
const ITEMS_CACHE_KEY = "grammar-boost-items-v1";
/** 批改结果保留 30 天；模型或课程内容变化即失效（键里带 model 与 contentHash）。 */
const CORRECTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const hasLocalStorage = (): boolean => {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
};

const readCache = (key: string): Record<string, unknown> => {
  if (!hasLocalStorage()) return {};
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { entries?: unknown };
    return parsed && typeof parsed.entries === "object" && parsed.entries !== null
      ? (parsed.entries as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
};

const writeCache = (key: string, entries: Record<string, unknown>): void => {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify({ version: 1, entries }));
  } catch {
    // 存储满 / 隐私模式：缓存失败静默，不影响主流程。
  }
};

/** 内容指纹：课程锚点句变化 → 缓存失效（PRD §7.1 的 contentHash 口径）。 */
export const boostContentHash = (lessonId: string, anchors: string[]): string => {
  const text = `${lessonId}|${anchors.map((anchor) => normalizeLessonSentence(anchor)).join("|")}`;
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
};

// ── 批改契约（对齐 diaryService）──────────────────────────────────

export interface BoostCorrection {
  corrected: string;
  recast?: string;
  issues: Array<{ original: string; correction: string; explanation: string; tag?: GrammarErrorTag }>;
  followUp?: string;
}

export type BoostDegradeReason = "not_configured" | "timeout" | "error" | "invalid";

export const GRAMMAR_CORRECTION_RULES = [
  "You are a gentle English tutor for Chinese beginners (CEFR A1-A2).",
  "Fix only clear grammar issues: tense, subject-verb agreement, missing be-verb, articles, plurals, prepositions, word order.",
  "Keep the learner's own words and meaning. Never upgrade vocabulary or rewrite into advanced English.",
  "If the sentence is already correct, return it unchanged with an empty issues array.",
  "Each explanation must be one short sentence in Simplified Chinese, warm and encouraging.",
  "For each issue, also classify it into exactly one tag from this list:",
  "tense (verb tense), sv_agreement (third-person -s), missing_be (missing am/is/are), article (a/an/the),",
  "plural (countable/singular-plural), preposition (wrong preposition), fragment (missing subject or verb),",
  "run_on (because...so / run-on sentence), word_order (adjective or phrase order), verb_form (verb form).",
  "Pick the closest tag; when unsure, use tense.",
  "Also provide a \"recast\": a natural, native-sounding version of the SAME meaning, still within A2 vocabulary."
].join(" ");

/** 温柔档：刚学完本课，先夸一处 + 最多指一处（对抗行业最普遍的过量纠错，PRD §6 UX 原则④）。 */
const GENTLE_INSTRUCTION =
  "Correction style: GENTLE. Start with one specific praise for what the learner got right. "
  + "Point out AT MOST 1 issue (the most important one). If there are more, stay silent about them.";

/**
 * 整档一次性批改的 prompt（PRD §4.6：批改放在整档结束之后，不逐题调用）。
 *
 * 为什么合批：串行 3 次调用 × 3–8s 会吃掉一档 4 分钟预算的 1/4–1/2，且每次都要等；
 * 合成一次调用后用户只等一次，且 AI 能看到同一课的多句产出、给更一致的点评。
 */
export const buildBoostBatchCorrectionMessages = (
  input: {
    grammarPoint: string;
    /** 本次该档里用户写出的句子（最多 3 条）。 */
    entries: Array<{ intentZh: string; answerEn: string; targetEn: string; taskKind?: string }>;
  },
  style: "gentle" | "standard" | "strict" = "gentle"
) => [
  {
    role: "system" as const,
    content: [
      "The learner just finished a grammar lesson and did a short post-lesson recap exercise.",
      "Below are the sentences they wrote themselves, each with the Chinese prompt and the target sentence of the lesson.",
      "Some items carry a taskKind: \"variant\" means they were asked to say the same thing in another form (negative/question),",
      "\"fix\" means they were shown a wrong sentence and asked to correct it. Judge accordingly — do not expect a literal copy of the target for those.",
      "Judge each sentence briefly.",
      GRAMMAR_CORRECTION_RULES,
      style === "gentle" ? GENTLE_INSTRUCTION : `Correction style: ${style.toUpperCase()}.`,
      `The lesson's target grammar point (plain words, never repeat technical terms to the learner): ${input.grammarPoint}.`,
      "Respond with a JSON object: {\"items\": [{\"corrected\": string, \"recast\": string, \"issues\": [{\"original\": string, \"correction\": string, \"explanation\": string, \"tag\": string}], \"comment\": string}]}.",
      "Return exactly one item per input sentence, in the same order. \"comment\" is one short warm Chinese sentence about that sentence.",
      "The first character of your reply is { and the last is }. Never write notes before or after."
    ].join(" ")
  },
  {
    role: "user" as const,
    content: JSON.stringify({ sentences: input.entries })
  }
];

const extractJsonObject = (text: string): Record<string, unknown> => {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("模型没有返回可解析的 JSON。");
  return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
};


export interface BoostBatchCorrectionEntry extends BoostCorrection {
  /** 用户写的那句原话（回显用）。 */
  originalEn: string;
  /** 该题的中文意图。 */
  intentZh: string;
  /** 一句话点评（AI 给；缺省时页面只展示 corrected/recast）。 */
  comment?: string;
}

export interface BoostBatchCorrectionOutcome {
  ok: boolean;
  entries: BoostBatchCorrectionEntry[];
  degraded: boolean;
  degradeReason: BoostDegradeReason | null;
  latencyMs: number;
  cached: boolean;
}

/**
 * 整档一次性批改（PRD §4.6 的正解）：一次调用批改本档用户写过的所有句子。
 * 命中缓存（按 lesson+tier+model+contentHash+句子集合哈希）直接返回，零延迟。
 * 失败/未配置返回空数组 + degraded，页面走本地对照降级。
 */
export const requestBoostBatchCorrection = async (
  provider: AiProviderSettings,
  input: {
    lessonId: string;
    tier: 1 | 2 | 3;
    grammarPoint: string;
    contentHash: string;
    entries: Array<{ intentZh: string; answerEn: string; targetEn: string; taskKind?: string }>;
  },
  style: "gentle" | "standard" | "strict" = "gentle"
): Promise<BoostBatchCorrectionOutcome> => {
  const startedAt = Date.now();
  if (!isAiProviderConfigured(provider) || input.entries.length === 0) {
    return { ok: false, entries: [], degraded: true, degradeReason: "not_configured", latencyMs: 0, cached: false };
  }

  // 缓存键带上「用户实际写的句子」——同课同档，不同作答不该复用同一份批改。
  const answersStamp = input.entries.map((entry) => normalizeLessonSentence(entry.answerEn)).join("|");
  const key = `${input.lessonId}:${input.tier}:batch:${provider.model}:${input.contentHash}:${boostHashText(answersStamp)}`;
  const cache = readCache(CORRECTION_CACHE_KEY);
  const cachedRaw = cache[key] as { at?: number; entries?: BoostBatchCorrectionEntry[] } | undefined;
  if (cachedRaw?.entries && typeof cachedRaw.at === "number" && Date.now() - cachedRaw.at < CORRECTION_TTL_MS) {
    return { ok: true, entries: cachedRaw.entries, degraded: false, degradeReason: null, latencyMs: 0, cached: true };
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), boostAiTimeoutMs(provider));
  try {
    const { response, json: payload } = await postChatCompletion<{
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    }>(
      normalizeChatCompletionsUrl(provider.baseUrl),
      provider.apiKey,
      (withOptionalFields) => ({
        model: provider.model,
        temperature: Math.min(provider.temperature, 0.4),
        max_tokens: 900,
        ...(withOptionalFields ? { response_format: { type: "json_object" }, ...buildAiThinkingParams() } : {}),
        messages: buildBoostBatchCorrectionMessages(
          { grammarPoint: input.grammarPoint, entries: input.entries },
          style
        )
      }),
      controller.signal
    );
    if (!response.ok) {
      return { ok: false, entries: [], degraded: true, degradeReason: "error", latencyMs: Date.now() - startedAt, cached: false };
    }
    const content = payload.choices?.[0]?.message?.content ?? "";
    const parsed = extractJsonObject(content);
    const rawItems = Array.isArray(parsed.items) ? (parsed.items as Record<string, unknown>[]) : [];
    const entries: BoostBatchCorrectionEntry[] = [];
    rawItems.forEach((raw, position) => {
      const source = input.entries[position];
      if (!source) return;
      const corrected = typeof raw.corrected === "string" ? raw.corrected.trim() : "";
      if (!corrected) return;
      const issues = Array.isArray(raw.issues)
        ? (raw.issues as Record<string, unknown>[])
            .map((issue) => ({
              original: typeof issue.original === "string" ? issue.original : "",
              correction: typeof issue.correction === "string" ? issue.correction : "",
              explanation: typeof issue.explanation === "string" ? issue.explanation : "",
              ...(GRAMMAR_ERROR_TAGS.includes(issue.tag as GrammarErrorTag)
                ? { tag: issue.tag as GrammarErrorTag }
                : {})
            }))
            .filter((issue) => issue.original || issue.correction)
        : [];
      entries.push({
        originalEn: source.answerEn,
        intentZh: source.intentZh,
        corrected,
        recast: typeof raw.recast === "string" && raw.recast.trim() ? raw.recast.trim() : undefined,
        comment: typeof raw.comment === "string" && raw.comment.trim() ? raw.comment.trim() : undefined,
        issues
      });
    });
    if (entries.length === 0) {
      return { ok: false, entries: [], degraded: true, degradeReason: "invalid", latencyMs: Date.now() - startedAt, cached: false };
    }
    writeCache(CORRECTION_CACHE_KEY, { ...cache, [key]: { at: Date.now(), entries } });
    return { ok: true, entries, degraded: false, degradeReason: null, latencyMs: Date.now() - startedAt, cached: false };
  } catch {
    return { ok: false, entries: [], degraded: true, degradeReason: "timeout", latencyMs: Date.now() - startedAt, cached: false };
  } finally {
    window.clearTimeout(timer);
  }
};

/** 批改缓存键用的短哈希（仅内部使用）。 */
const boostHashText = (text: string): string => {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
};

// ── 变式题生成（档 3 锚点不足时；答案先定、AI 只措辞，6 条校验）────────

const VARIANT_CACHE_SCHEMA = "v1";

export interface GeneratedBoostItem {
  /** 中文意图（题面）。 */
  intentZh: string;
  /** 正确英文句（必须与课程锚点一致——由确定性规则先定，AI 不得变形造句）。 */
  answer: string;
  /** 该题来源锚点的 sourceRef（用于去重与埋点）。 */
  anchorRef: string;
}

export const buildVariantMessages = (input: {
  grammarPoint: string;
  anchors: Array<{ en: string; zh: string }>;
  weakSpotPlain?: string[];
  count: number;
}) => [
  {
    role: "system" as const,
    content: [
      "You write short recap exercises for a Chinese beginner learning English (CEFR A1-A2).",
      "You are given anchor sentences that are ALREADY CORRECT. Pick some of them and write a fresh Chinese prompt for each.",
      "HARD RULES: never change, shorten, or re-inflect the English anchor sentence — copy it character for character.",
      "Each Chinese prompt must describe the situation so the learner knows which anchor sentence to say, without revealing the English words.",
      "The Chinese prompt must not contain any English word.",
      "Prefer anchors related to the learner's weak grammar points when provided.",
      "Return JSON only: {\"items\": [{\"zh\": string, \"en\": string}]}. The first character of your reply is { and the last is }."
    ].join(" ")
  },
  {
    role: "user" as const,
    content: JSON.stringify({
      grammarPoint: input.grammarPoint,
      anchors: input.anchors,
      weakPoints: input.weakSpotPlain ?? [],
      count: input.count
    })
  }
];

/**
 * 6 条校验（PRD §4.7）——任一不过即丢弃该题，用本地题补位；绝不为了凑数放未校验题。
 * ① 归一化后答案必须与某条课程锚点一致（防 AI 自行变形造句）
 * ② 题面不得包含答案原文（防泄漏）
 * ③ 题面英文部分不得出现（中文题面里混英文）
 * ④ 中文题面非空且长度合理（≤60 字）
 * ⑤ 答案长度 ≤12 词（与 A2 零基础负荷匹配）
 * ⑥ 同一批内答案不重复
 */
export const validateGeneratedItems = (
  items: Array<{ zh?: unknown; en?: unknown }>,
  anchors: Array<{ en: string; zh: string }>
): GeneratedBoostItem[] => {
  const anchorByNormalized = new Map<string, { en: string; zh: string }>();
  for (const anchor of anchors) {
    anchorByNormalized.set(normalizeLessonSentence(anchor.en), anchor);
  }
  const usedAnswers = new Set<string>();
  const result: GeneratedBoostItem[] = [];
  for (const raw of items) {
    const zh = typeof raw.zh === "string" ? raw.zh.trim() : "";
    const en = typeof raw.en === "string" ? raw.en.trim() : "";
    // ④ 中文题面
    if (!zh || zh.length > 60) continue;
    // ③ 题面不得混英文单词（中文里出现 3 个以上连续字母视为混入）
    if (/[A-Za-z]{3,}/.test(zh)) continue;
    // ① 答案必须命中锚点
    const normalized = normalizeLessonSentence(en);
    const anchor = anchorByNormalized.get(normalized);
    if (!anchor) continue;
    // ⑤ 长度上限
    if (en.split(/\s+/).filter(Boolean).length > 12) continue;
    // ② 题面不得泄漏答案原文（按词判断，含大小写不敏感的单字词）
    const answerWords = anchor.en
      .split(/\s+/)
      .map((word) => word.replace(/[.,!?;:]/g, "").toLowerCase())
      .filter((word) => word.length >= 4);
    if (answerWords.some((word) => zh.toLowerCase().includes(word))) continue;
    // ⑥ 批内不重复
    if (usedAnswers.has(normalized)) continue;
    usedAnswers.add(normalized);
    result.push({ intentZh: zh, answer: anchor.en, anchorRef: `ai:${normalized}` });
  }
  return result;
};

export interface GenerateVariantsOutcome {
  ok: boolean;
  items: GeneratedBoostItem[];
  degraded: boolean;
  degradeReason: BoostDegradeReason | null;
  latencyMs: number;
  cached: boolean;
}

/**
 * 生成档 3 的补充变式题。命中缓存直接返回（同一课二次进入题面完全一致）。
 * 失败/未配置返回空数组与 degraded 标记，调用方用本地题补位（补位不足则减题）。
 */
export const requestBoostVariantItems = async (
  provider: AiProviderSettings,
  input: {
    lessonId: string;
    anchors: Array<{ en: string; zh: string }>;
    grammarPoint: string;
    weakSpotPlain?: string[];
    count: number;
    contentHash: string;
  }
): Promise<GenerateVariantsOutcome> => {
  const startedAt = Date.now();
  if (!isAiProviderConfigured(provider) || input.anchors.length === 0 || input.count <= 0) {
    return { ok: false, items: [], degraded: true, degradeReason: "not_configured", latencyMs: 0, cached: false };
  }

  const key = `${input.lessonId}:3:variants:${provider.model}:${VARIANT_CACHE_SCHEMA}:${input.contentHash}:${input.count}`;
  const cache = readCache(ITEMS_CACHE_KEY);
  const cachedRaw = cache[key] as { at?: number; items?: GeneratedBoostItem[] } | undefined;
  if (cachedRaw?.items) {
    return { ok: true, items: cachedRaw.items, degraded: false, degradeReason: null, latencyMs: 0, cached: true };
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), boostAiTimeoutMs(provider));
  try {
    const { response, json: payload } = await postChatCompletion<{
      choices?: Array<{ message?: { content?: string } }>;
    }>(
      normalizeChatCompletionsUrl(provider.baseUrl),
      provider.apiKey,
      (withOptionalFields) => ({
        model: provider.model,
        temperature: Math.min(provider.temperature, 0.6),
        max_tokens: 700,
        ...(withOptionalFields ? { response_format: { type: "json_object" }, ...buildAiThinkingParams() } : {}),
        messages: buildVariantMessages({
          grammarPoint: input.grammarPoint,
          anchors: input.anchors,
          weakSpotPlain: input.weakSpotPlain,
          count: input.count
        })
      }),
      controller.signal
    );
    if (!response.ok) {
      return { ok: false, items: [], degraded: true, degradeReason: "error", latencyMs: Date.now() - startedAt, cached: false };
    }
    const content = payload.choices?.[0]?.message?.content ?? "";
    const parsed = extractJsonObject(content);
    const rawItems = Array.isArray(parsed.items) ? (parsed.items as Array<{ zh?: unknown; en?: unknown }>) : [];
    const validated = validateGeneratedItems(rawItems, input.anchors).slice(0, input.count);
    if (validated.length === 0) {
      return { ok: false, items: [], degraded: true, degradeReason: "invalid", latencyMs: Date.now() - startedAt, cached: false };
    }
    writeCache(ITEMS_CACHE_KEY, { ...cache, [key]: { at: Date.now(), items: validated } });
    return { ok: true, items: validated, degraded: false, degradeReason: null, latencyMs: Date.now() - startedAt, cached: false };
  } catch {
    return { ok: false, items: [], degraded: true, degradeReason: "timeout", latencyMs: Date.now() - startedAt, cached: false };
  } finally {
    window.clearTimeout(timeout);
  }
};

/** 把校验通过的生成题转成 BoostItem（题面来自 AI 措辞，答案来自课程锚点）。 */
export const generatedToBoostItem = (
  generated: GeneratedBoostItem,
  lessonId: string,
  index: number,
  /** 讲解句（AI 生成题没有课程自带 explain，用本课一句话规则兜底）。 */
  explainZh = ""
): BoostItem => ({
  id: `boost-${lessonId}-t3-ai-${index}`,
  kind: "produce",
  promptZh: "再补一句——照着意思自己写出来。",
  intentZh: generated.intentZh,
  answer: generated.answer,
  explainZh,
  sourceRef: generated.anchorRef,
  itemKind: "ai",
  fromReview: false
});

/** 清空缓存（设置页/排查用；缓存不参与导出）。 */
export const clearBoostAiCache = (): void => {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.removeItem(CORRECTION_CACHE_KEY);
    window.localStorage.removeItem(ITEMS_CACHE_KEY);
  } catch {
    // 忽略
  }
};

/** 供页面判断：档 3 是否「能拿到 AI 批改」。 */
export const canUseBoostAi = (provider: AiProviderSettings): boolean => isAiProviderConfigured(provider);

