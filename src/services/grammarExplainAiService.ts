import type { AiProviderSettings } from "../types";
import { buildAiThinkingParams, isAiProviderConfigured, normalizeChatCompletionsUrl, postChatCompletion } from "./aiHttpClient";
import {
  DECLINED_ANSWER,
  explainCacheKey,
  validateExplainAnswer,
  type ExplainAnswer,
  type ExplainValidationFailure,
  type LessonExplainContext
} from "./grammarExplainService";

/**
 * 「问一句」AI 服务（2026-09-19 PRD R-AI5 网络部分 + R-AI6 缓存与降级）。
 *
 * 只做三件事：prompt 构造、网络调用（8–10s 钳制）、缓存读写。
 * 三道校验在 grammarExplainService（本地），本服务调它——**缓存命中也要过校验**，
 * 缓存不能成为绕过校验的后门。
 *
 * 降级纪律（四条全部静默）：未配置不渲染入口 / 超时 / 校验失败 / 网络错误——
 * 无错误提示、无空位、页面照常（用户不需要知道 AI 挂了）。
 */

const CACHE_KEY = "grammar-explain-v1";
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
/** 一次一问一答，给后台加载留余量；10s 是 PRD 写死的上限（单课 ≤2 次 × 最坏 +16s）。 */
const EXPLAIN_TIMEOUT_MS = 10_000;

const hasLocalStorage = (): boolean => {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
};

const readCache = (): Record<string, { at: number; answer: ExplainAnswer }> => {
  if (!hasLocalStorage()) return {};
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { entries?: unknown };
    return parsed && typeof parsed.entries === "object" && parsed.entries !== null
      ? (parsed.entries as Record<string, { at: number; answer: ExplainAnswer }>)
      : {};
  } catch {
    return {};
  }
};

const writeCache = (entries: Record<string, { at: number; answer: ExplainAnswer }>): void => {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ version: 1, entries }));
  } catch {
    // 存储满 / 隐私模式：静默
  }
};

/** 清空追问缓存（设置页出口用）。 */
export const clearExplainCache = (): void => {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.removeItem(CACHE_KEY);
  } catch {
    // 忽略
  }
};

// ── prompt ───────────────────────────────────────────────

export const buildExplainMessages = (input: {
  question: string;
  anchorText: string;
  allowedSources: Array<{ ref: string; text: string }>;
  /**
   * C3（M3）：本课此前问过的问题（仅问题文本，≤3 条）。
   * **纪律：只进 prompt 上下文，绝不进 allowedSources**——白名单是防幻觉的唯一防线，
   * 把摘要塞进去等于重新打开口子（PRD 明确列为风险 R7）。
   */
  previousQuestions?: string[];
}) => [
  {
    role: "system" as const,
    content: [
      "You answer ONE question from a Chinese beginner (CEFR A1-A2) about the grammar point they just studied.",
      "You are given the lesson's own explanation snippets (allowedSources). Use ONLY these —",
      "you must NOT invent new grammar rules, new example sentences, or new conclusions.",
      "If the snippets cannot answer the question, return declined=true — admitting you don't know is BETTER than guessing.",
      "HARD RULES:",
      "1. Answer in Simplified Chinese, at most 2 sentences, at most 120 characters total.",
      "2. NEVER use grammar jargon. Forbidden words: 主语 谓语 宾语 表语 定语 状语 单数 复数 三单 原形 时态 一般过去时 一般现在时 现在进行时 过去进行时 现在完成时 情态动词 比较级 最高级 从句 语序 可数 疑问句 否定句 被动语态 第三人称 形容词 副词 介词.",
      "3. Never judge the learner (no 你错了 / 不对). Explain, don't scold.",
      "4. Any English in your answer must appear VERBATIM in the cited source snippet.",
      "5. You MUST return citedSource: the ref (e.g. \"contrast:2:why\") of the snippet you based the answer on. declined=true时可为空.",
      "Return JSON only: {\"answer\": string, \"citedSource\": string|null, \"declined\": boolean}.",
      "The first character of your reply is { and the last is }.",
      "If the learner already asked something earlier in this lesson (previousQuestions), do not repeat that explanation — build on it instead."
    ].join(" ")
  },
  {
    role: "user" as const,
    content: JSON.stringify({
      question: input.question,
      currentStep: input.anchorText,
      allowedSources: input.allowedSources,
      ...(input.previousQuestions && input.previousQuestions.length > 0
        ? { previousQuestions: input.previousQuestions }
        : {})
    })
  }
];

// ── 结果类型 ─────────────────────────────────────────────

export type ExplainDegradeReason = "not_configured" | "timeout" | "error" | "invalid";

export interface ExplainOutcome {
  ok: boolean;
  answer?: ExplainAnswer;
  cached: boolean;
  degraded: boolean;
  degradeReason: ExplainDegradeReason | null;
  /** 校验失败的具体原因（invalid 时有值）。 */
  validationFailure?: ExplainValidationFailure;
  latencyMs: number;
}

// ── 主入口 ───────────────────────────────────────────────

/**
 * 问一句（一次一问一答）。
 *
 * 成功路径：缓存命中（过校验）→ 直接返回；否则发请求 → 解析 → 三道校验 → 缓存 → 返回。
 * 失败路径：全部返回 degraded 结果（不抛错）——页面据此静默回退静态讲解。
 */
export const requestLessonExplain = async (
  provider: AiProviderSettings,
  input: {
    question: string;
    anchorRef: string;
    anchorText: string;
    context: LessonExplainContext;
    /** C3：本课此前问过的问题（只进 prompt，不进白名单）。 */
    previousQuestions?: string[];
  }
): Promise<ExplainOutcome> => {
  const startedAt = Date.now();
  const base = { cached: false, latencyMs: 0 };
  const { context } = input;

  if (!isAiProviderConfigured(provider)) {
    return { ...base, ok: false, degraded: true, degradeReason: "not_configured" };
  }

  // 缓存命中（同样过三道校验——缓存不是绕过校验的后门）
  const key = explainCacheKey(
    context.lessonId,
    input.anchorRef,
    // C3：记忆上下文参与缓存键——否则「第一次问」与「第二次问」会命中同一条缓存，
    // 记忆等于没生效（而内容 hash 刻意不含 attempt/记忆，保持课级缓存可复用）
    `${input.question}|prev:${(input.previousQuestions ?? []).join("~")}`,
    provider.model,
    context.contentHash
  );
  const cache = readCache();
  const cachedEntry = cache[key];
  if (cachedEntry && Date.now() - cachedEntry.at < CACHE_TTL_MS) {
    const cachedCheck = validateExplainAnswer(cachedEntry.answer, context);
    if (cachedCheck.ok) {
      return { ...base, ok: true, answer: cachedEntry.answer, cached: true, degraded: false, degradeReason: null };
    }
    // 缓存里的答案校验不过（如词表更新了）：丢弃该条继续走网络
    delete cache[key];
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), EXPLAIN_TIMEOUT_MS);
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
        max_tokens: 300,
        ...(withOptionalFields ? buildAiThinkingParams() : {}),
        messages: buildExplainMessages({
          question: input.question,
          anchorText: input.anchorText,
          // 注意：这里只传 allowedSources（+ attempt 白名单），previousQuestions 走 input 独立通道——
          // 白名单与"上下文记忆"必须物理分离，否则校验边界被记忆污染。
          allowedSources: [...context.allowedSources, ...(context.attemptSources ?? [])],
          previousQuestions: input.previousQuestions
        })
      }),
      controller.signal
    );
    if (!response.ok) {
      return { ...base, ok: false, degraded: true, degradeReason: "error", latencyMs: Date.now() - startedAt };
    }

    const content = payload.choices?.[0]?.message?.content ?? "";
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      return { ...base, ok: false, degraded: true, degradeReason: "invalid", latencyMs: Date.now() - startedAt };
    }
    const parsed = JSON.parse(content.slice(start, end + 1)) as Record<string, unknown>;

    // 弃权：素材不足（这是设计成功，不是失败）
    if (parsed.declined === true) {
      const declinedAnswer: ExplainAnswer = { answer: DECLINED_ANSWER, citedSource: null, declined: true };
      return { ...base, ok: true, answer: declinedAnswer, degraded: false, degradeReason: null, latencyMs: Date.now() - startedAt };
    }

    const answerText = typeof parsed.answer === "string" ? parsed.answer.trim() : "";
    const citedSource = typeof parsed.citedSource === "string" ? parsed.citedSource.trim() : "";
    if (!answerText) {
      return { ...base, ok: false, degraded: true, degradeReason: "invalid", latencyMs: Date.now() - startedAt };
    }

    const answer: ExplainAnswer = {
      answer: answerText,
      citedSource: citedSource || null,
      declined: false,
      ...(typeof parsed.errorTag === "string" ? { errorTag: parsed.errorTag } : {})
    };

    // 三道校验：任一不过整条丢弃（绝不直接下发）
    const check = validateExplainAnswer(answer, context);
    if (!check.ok) {
      return {
        ...base,
        ok: false,
        degraded: true,
        degradeReason: "invalid",
        validationFailure: check.failure,
        latencyMs: Date.now() - startedAt
      };
    }

    // 过检 → 缓存 → 返回
    writeCache({ ...cache, [key]: { at: Date.now(), answer } });
    return { ...base, ok: true, answer, degraded: false, degradeReason: null, latencyMs: Date.now() - startedAt };
  } catch {
    return { ...base, ok: false, degraded: true, degradeReason: "timeout", latencyMs: Date.now() - startedAt };
  } finally {
    window.clearTimeout(timer);
  }
};
