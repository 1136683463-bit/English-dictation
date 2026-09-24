import type { AiProviderSettings, GrammarErrorTag } from "../types";
import { isAiProviderConfigured, normalizeChatCompletionsUrl, postChatCompletion } from "./aiHttpClient";
import { GRAMMAR_CORRECTION_RULES, type BoostDegradeReason } from "./grammarBoostAiService";
import { findZeroTermHits } from "../data/grammarZeroTerms";

/**
 * 语法季末综合卷 · 写作题的 AI 批改（P0-7）
 *
 * 规格：PRD §4.6 AI 白名单/黑名单 ｜ §12.1 G8/G-A3 ｜ §14 Non-goal 13
 *
 * ── 三条不可退让的边界 ──
 *
 * 1. **复用而非新建**（红线⑩ Non-goal 11「不建第二套 AI 管线」）：
 *    prompt 复用 `GRAMMAR_CORRECTION_RULES`，解析契约复用日记/趁热练的
 *    `{corrected, recast, issues[tag], comment}`，降级枚举复用 `BoostDegradeReason`。
 *    本文件因此**没有**自己的 prompt 规则，也没有自己的降级类型。
 *
 * 2. **AI 绝不出分**（G8 / 红线⑤）。prompt 明确禁止给分数与等级，
 *    且**解析后还要再校验一遍**：只要输出里出现分数、百分比、CEFR 档位或裁决词，
 *    就整条按 `invalid` 降级丢弃——宁可告诉用户「这次没能给出批改」，
 *    也不能把「AI 给了 7.5 分」这种东西送到屏幕上
 *    （PRD §4.8：模型肯定用户行为的比例比人类高 49%，那个 7.5 更像奉承数而非测量值）。
 *
 * 3. **零术语**：输出过 `GRAMMAR_ZERO_TERMS`（与课程守门同源）。带术语的批改一律丢弃——
 *    这是零基础用户的硬门槛，宁可降级。
 *
 * 另：**不做流式、不做并发、不做自动重试**（Non-goal 13）。
 */

/** 单次调用的超时钳制（与趁热练同一口径：延迟而非成本才是瓶颈）。 */
const EXAM_AI_TIMEOUT_MIN_MS = 8_000;
const EXAM_AI_TIMEOUT_MAX_MS = 10_000;

export const examAiTimeoutMs = (provider: AiProviderSettings): number =>
  Math.min(Math.max(provider.timeoutMs, EXAM_AI_TIMEOUT_MIN_MS), EXAM_AI_TIMEOUT_MAX_MS);

const CACHE_KEY = "grammar-exam-writing-ai-v1";
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const examHashText = (text: string): number => {
  let hash = 5381;
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) + hash + text.charCodeAt(index)) >>> 0;
  }
  return hash;
};

const readCache = (): Record<string, { at?: number; value?: ExamWritingCorrection }> => {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as Record<string, { at?: number; value?: ExamWritingCorrection }>) : {};
  } catch {
    return {};
  }
};

const writeCache = (cache: Record<string, { at?: number; value?: ExamWritingCorrection }>): void => {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // 缓存写不进去不影响主流程（配额满时静默跳过）
  }
};

export interface ExamWritingIssue {
  original: string;
  correction: string;
  explanation: string;
  tag?: GrammarErrorTag;
}

export interface ExamWritingCorrection {
  /** 只修语法后的版本。 */
  corrected: string;
  /** 更地道的同义重述（仍限 A2 词汇）。 */
  recast?: string;
  issues: ExamWritingIssue[];
  /** 一句中文点评。**注意：不是分数，也不许是分数。** */
  comment?: string;
}

export interface ExamWritingCorrectionOutcome {
  ok: boolean;
  /** 失败时为 undefined —— 页面据此显示「这次没能给出批改」并保留用户原文（G-A3）。 */
  correction?: ExamWritingCorrection;
  degraded: boolean;
  degradeReason: BoostDegradeReason | null;
  latencyMs: number;
  cached: boolean;
}

/** 明确禁止出分的指令（G8）。与 `GRAMMAR_CORRECTION_RULES` 一起下发。 */
const NO_SCORE_RULES = [
  "IMPORTANT: Do NOT give any score, grade, mark, percentage, level, or CEFR band.",
  "Never write numbers like 7.5, 85/100, or words like A2, B1, band, score, points.",
  "You are not grading. You are only helping the learner say it better.",
  "Do NOT use any Chinese grammar jargon (no words like 主语/谓语/宾语/时态/语态/从句/复数).",
  "Explain in everyday words a beginner can understand."
].join(" ");

export const buildExamWritingMessages = (input: {
  promptZh: string;
  points: string[];
  text: string;
}) => [
  {
    role: "system" as const,
    content: [
      "The learner finished one season of a beginner English course and wrote a short paragraph (3-5 sentences) for a writing task.",
      "Below is the task in Chinese, its required points, and the paragraph the learner wrote.",
      GRAMMAR_CORRECTION_RULES,
      NO_SCORE_RULES,
      `The writing task (Chinese): ${input.promptZh}`,
      `Required points: ${input.points.join(" / ")}.`,
      "Respond with a JSON object: {\"corrected\": string, \"recast\": string, \"issues\": [{\"original\": string, \"correction\": string, \"explanation\": string, \"tag\": string}], \"comment\": string}.",
      "\"corrected\" keeps the learner's own words and fixes only clear grammar issues.",
      "\"comment\" is one short warm Chinese sentence — what they already did well.",
      "The first character of your reply is { and the last is }. Never write notes before or after."
    ].join(" ")
  },
  { role: "user" as const, content: input.text }
];

const extractJsonObject = (text: string): Record<string, unknown> => {
  const trimmed = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("模型没有返回可解析的 JSON。");
  return JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>;
};

/** 分数/等级/裁决词的样态（G8 + 零术语 + §4.5 呈现口径）。命中即整条丢弃。 */
const SCORE_PATTERN = /\d+(\.\d+)?\s*(分|points?|score|%|\/100|\/10)|\b(A1|A2|B1|B2|C1|C2)\b|\bband\b/i;
const VERDICT_WORDS = ["正确", "错误", "得分", "分数", "通过", "及格"];

/**
 * 输出三校验（照既有纪律：AI 产物未经校验不得下发）。
 * 返回 null 表示通过；否则返回不合格的原因。原文一并检查，避免评语里夹带。
 */
const validateCorrection = (correction: ExamWritingCorrection): string | null => {
  const allText = [correction.corrected, correction.recast ?? "", correction.comment ?? "", ...correction.issues.flatMap((issue) => [issue.original, issue.correction, issue.explanation])].join("\n");
  if (SCORE_PATTERN.test(allText)) return "输出里出现分数/等级";
  for (const word of VERDICT_WORDS) {
    if (allText.includes(word)) return `输出里出现裁决词「${word}」`;
  }
  const terms = findZeroTermHits(allText);
  if (terms.length > 0) return `输出里出现语法术语「${terms[0]}」`;
  return null;
};

/**
 * 批改一次写作。未配置 AI / 超时 / 解析失败 / 校验不过 → 一律降级（`ok: false`），
 * **绝不产出伪造评语**（G-A3）。命中缓存时零延迟返回。
 */
export const requestExamWritingCorrection = async (
  provider: AiProviderSettings,
  input: { paperId: string; promptZh: string; points: string[]; text: string }
): Promise<ExamWritingCorrectionOutcome> => {
  const startedAt = Date.now();
  if (!isAiProviderConfigured(provider)) {
    return { ok: false, degraded: true, degradeReason: "not_configured", latencyMs: 0, cached: false };
  }
  if (!input.text.trim()) {
    return { ok: false, degraded: true, degradeReason: "invalid", latencyMs: 0, cached: false };
  }

  const key = `${input.paperId}:${provider.model}:${examHashText(input.text.trim())}`;
  const cache = readCache();
  const cachedRaw = cache[key];
  if (cachedRaw?.value && typeof cachedRaw.at === "number" && Date.now() - cachedRaw.at < CACHE_TTL_MS) {
    return { ok: true, correction: cachedRaw.value, degraded: false, degradeReason: null, latencyMs: 0, cached: true };
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), examAiTimeoutMs(provider));
  try {
    const { response, json: payload } = await postChatCompletion<{
      choices?: Array<{ message?: { content?: string } }>;
      content?: string;
      error?: { message?: string };
    }>(
      normalizeChatCompletionsUrl(provider.baseUrl),
      provider.apiKey,
      (withOptionalFields) => ({
        model: provider.model,
        temperature: Math.min(provider.temperature, 0.4),
        max_tokens: 900,
        ...(withOptionalFields ? { response_format: { type: "json_object" } } : {}),
        messages: buildExamWritingMessages({ promptZh: input.promptZh, points: input.points, text: input.text })
      }),
      controller.signal
    );
    if (!response.ok) {
      return { ok: false, degraded: true, degradeReason: "error", latencyMs: Date.now() - startedAt, cached: false };
    }
    const content = payload.choices?.[0]?.message?.content ?? payload.content ?? "";
    if (!content) {
      return { ok: false, degraded: true, degradeReason: "invalid", latencyMs: Date.now() - startedAt, cached: false };
    }
    const parsed = extractJsonObject(content);
    const corrected = typeof parsed.corrected === "string" ? parsed.corrected.trim() : "";
    if (!corrected) {
      return { ok: false, degraded: true, degradeReason: "invalid", latencyMs: Date.now() - startedAt, cached: false };
    }
    const correction: ExamWritingCorrection = {
      corrected,
      ...(typeof parsed.recast === "string" && parsed.recast.trim() ? { recast: parsed.recast.trim() } : {}),
      issues: Array.isArray(parsed.issues)
        ? (parsed.issues as Record<string, unknown>[]).slice(0, 20).map((issue) => ({
            original: typeof issue.original === "string" ? issue.original : "",
            correction: typeof issue.correction === "string" ? issue.correction : "",
            explanation: typeof issue.explanation === "string" ? issue.explanation : "",
            ...(typeof issue.tag === "string" ? { tag: issue.tag as GrammarErrorTag } : {})
          }))
        : [],
      ...(typeof parsed.comment === "string" && parsed.comment.trim() ? { comment: parsed.comment.trim() } : {})
    };
    const invalidReason = validateCorrection(correction);
    if (invalidReason) {
      // 校验不过就整条丢弃：宁可说「这次没能给出批改」，也不能把违规内容送到屏幕上
      return { ok: false, degraded: true, degradeReason: "invalid", latencyMs: Date.now() - startedAt, cached: false };
    }
    writeCache({ ...cache, [key]: { at: Date.now(), value: correction } });
    return { ok: true, correction, degraded: false, degradeReason: null, latencyMs: Date.now() - startedAt, cached: false };
  } catch (error) {
    const aborted = error instanceof DOMException && error.name === "AbortError";
    return {
      ok: false,
      degraded: true,
      degradeReason: aborted ? "timeout" : "error",
      latencyMs: Date.now() - startedAt,
      cached: false
    };
  } finally {
    window.clearTimeout(timer);
  }
};
