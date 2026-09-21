import type { AiProviderSettings, AppData, GrammarLesson } from "../types";
import { buildAiThinkingParams, isAiProviderConfigured, normalizeChatCompletionsUrl, postChatCompletion } from "./aiHttpClient";
import { listGrammarEventsByKind, type LessonStepResultEvent } from "./grammarTelemetry";

/**
 * 完课收据的 AI 错因小结（2026-09-19）。
 *
 * 定位：收据页「还差什么」目前只是回放 `reviewNotes`（本课进复习队列的知识点），
 * 说不出「这一课你的坑在哪一类」。这正好补上审计指出的能力不对称——
 * 日记有归因、课程没有（`prd-grammar-boost-2026-09-18.md:48` 自证）。
 *
 * 边界（守住正课红线）：
 * - **只在完课后调用一次**，且**后台加载不阻塞收据展示**（六段时长预算不被侵犯）；
 * - 无 AI / 失败时静默隐藏这一句，收据原有的三块内容照常；
 * - AI 只做「依据本地统计组织一句话」，不参与判分、不编数字（事实由本地算出）。
 */

const CACHE_KEY = "grammar-lesson-summary-v1";
/** 同一课的小结复用 30 天（课内表现几天内不会变，且课程内容也基本静态）。 */
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const TIMEOUT_MS = 10_000;

const hasLocalStorage = (): boolean => {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
};

const readCache = (): Record<string, { at: number; text: string }> => {
  if (!hasLocalStorage()) return {};
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { entries?: unknown };
    return parsed && typeof parsed.entries === "object" && parsed.entries !== null
      ? (parsed.entries as Record<string, { at: number; text: string }>)
      : {};
  } catch {
    return {};
  }
};

const writeCache = (entries: Record<string, { at: number; text: string }>): void => {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ version: 1, entries }));
  } catch {
    // 存储满 / 隐私模式：静默
  }
};

export interface LessonSummaryFacts {
  lessonId: string;
  lessonTitle: string;
  grammarPoint: string;
  /** 各段一次通过情况（本地从遥测算出）。 */
  sections: Array<{ section: string; attempts: number; total: number; passedFirstTry: number }>;
  /** 本课里需要进复习队列的句子数（reviewNotes 的长度）。 */
  queuedSentenceCount: number;
  /** 前测拿不准的题数。 */
  pretestWrongCount: number;
}

/** 段名 → 用户看得懂的说法（零术语，与课程风格一致）。 */
const SECTION_LABELS: Record<string, string> = {
  pretest: "课前试一试",
  watch: "看",
  guided: "跟",
  recall: "忆",
  practice: "练",
  output: "说出来",
  challenge: "破·侦探挑战"
};

/** 统计本课的关键事实（纯本地）。 */
export const buildLessonSummaryFacts = (
  data: AppData,
  lesson: GrammarLesson,
  extras: { queuedSentenceCount: number; pretestWrongCount: number }
): LessonSummaryFacts => {
  const steps = listGrammarEventsByKind("lesson_step_result").filter((event) => event.lessonId === lesson.id);
  const bySection = new Map<string, LessonStepResultEvent[]>();
  for (const step of steps) {
    const bucket = bySection.get(step.section) ?? [];
    bucket.push(step);
    bySection.set(step.section, bucket);
  }
  const sections = [...bySection.entries()].map(([section, events]) => ({
    section: SECTION_LABELS[section] ?? section,
    attempts: events.reduce((sum, event) => sum + event.attempts, 0),
    total: events.length,
    passedFirstTry: events.filter((event) => event.passed && event.attempts <= 1).length
  }));
  void data;
  return {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    grammarPoint: lesson.grammarLabel,
    sections,
    queuedSentenceCount: extras.queuedSentenceCount,
    pretestWrongCount: extras.pretestWrongCount
  };
};

export const buildLessonSummaryMessages = (facts: LessonSummaryFacts) => [
  {
    role: "system" as const,
    content: [
      "You write ONE short Chinese sentence (max 40 characters) summarizing where a beginner just struggled in a grammar lesson.",
      "You are given locally-computed facts. Never invent numbers beyond them.",
      "No grammar jargon (no 主语/谓语/复数/时态/从句/原形). Warm and concrete, never scolding.",
      "If they did well (few retries, nothing queued), say so warmly instead of inventing a problem.",
      "Do not use markdown. Return plain text only.",
      "Examples of the tone: 「这一课卡在「忆」那一步，多试了两次——明天复习会再来一遍。」"
    ].join(" ")
  },
  {
    role: "user" as const,
    content: JSON.stringify({
      lesson: facts.lessonTitle,
      grammarPoint: facts.grammarPoint,
      stepResultsBySection: facts.sections,
      sentencesQueuedForReview: facts.queuedSentenceCount,
      pretestUnsure: facts.pretestWrongCount
    })
  }
];

export interface LessonSummaryOutcome {
  ok: boolean;
  text?: string;
  cached: boolean;
  degraded: boolean;
  degradeReason: "not_configured" | "timeout" | "error" | "invalid" | null;
  latencyMs: number;
}

export const requestLessonSummary = async (
  provider: AiProviderSettings,
  facts: LessonSummaryFacts
): Promise<LessonSummaryOutcome> => {
  const startedAt = Date.now();
  const base = { cached: false, latencyMs: 0 };

  const cache = readCache();
  const cachedEntry = cache[facts.lessonId];
  if (cachedEntry && Date.now() - cachedEntry.at < CACHE_TTL_MS) {
    return { ...base, ok: true, text: cachedEntry.text, cached: true, degraded: false, degradeReason: null };
  }
  if (!isAiProviderConfigured(provider)) {
    return { ...base, ok: false, degraded: true, degradeReason: "not_configured", latencyMs: Date.now() - startedAt };
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const { response, json: payload } = await postChatCompletion<{
      choices?: Array<{ message?: { content?: string } }>;
    }>(
      normalizeChatCompletionsUrl(provider.baseUrl),
      provider.apiKey,
      (withOptionalFields) => ({
        model: provider.model,
        temperature: Math.min(provider.temperature, 0.5),
        max_tokens: 200,
        ...(withOptionalFields ? buildAiThinkingParams() : {}),
        messages: buildLessonSummaryMessages(facts)
      }),
      controller.signal
    );
    if (!response.ok) {
      return { ...base, ok: false, degraded: true, degradeReason: "error", latencyMs: Date.now() - startedAt };
    }
    const text = (payload.choices?.[0]?.message?.content ?? "").trim();
    // 校验：非空、短（一句话），否则丢弃——收据页不该被长篇撑爆
    if (!text || text.length > 120) {
      return { ...base, ok: false, degraded: true, degradeReason: "invalid", latencyMs: Date.now() - startedAt };
    }
    writeCache({ ...cache, [facts.lessonId]: { at: Date.now(), text } });
    return { ...base, ok: true, text, cached: false, degraded: false, degradeReason: null, latencyMs: Date.now() - startedAt };
  } catch {
    return { ...base, ok: false, degraded: true, degradeReason: "timeout", latencyMs: Date.now() - startedAt };
  } finally {
    window.clearTimeout(timer);
  }
};

/** 清空缓存（换模型或想重算时用）。 */
export const clearLessonSummaryCache = (): void => {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.removeItem(CACHE_KEY);
  } catch {
    // 忽略
  }
};
