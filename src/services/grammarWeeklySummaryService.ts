import type { AiProviderSettings, AppData, GrammarErrorTag } from "../types";
import { buildAiThinkingParams, isAiProviderConfigured, normalizeChatCompletionsUrl, postChatCompletion } from "./aiHttpClient";
import { GRAMMAR_ERROR_TAG_PLAIN } from "./huntService";
import { computeWeakSpots } from "./grammarWeakSpotsService";
import { weeklyErrorTagCounts, type DiaryCorrectionResultEvent, listGrammarEventsByKind } from "./grammarTelemetry";
import { computeWeeklyEffectiveOutput, type WeeklyReport } from "./grammarOutputService";

/**
 * AI 周报小结（2026-09-19）。
 *
 * 定位：把「每周有效输出 N 句 / 错误比前周少 X 次」这类**数字**，升级为一段有人味的结论 +
 * 一条下一步建议。模板版周报（grammarOutputService.buildLastWeekReport）继续作为无 AI 降级，
 * 数字部分完全由本地算出——AI 只负责组织语言与给建议，不参与统计（避免编数字）。
 *
 * 成本与频率：每周只调用一次（按周缓存），输入 <0.5k token、输出 <200 token，属低频调用。
 */

const CACHE_KEY = "grammar-weekly-summary-v1";
/** 一周内的缓存有效；跨周自然失效（缓存键里带周起始日，换周即 miss）。 */
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

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
    // 存储满 / 隐私模式：缓存失败静默，不影响主流程。
  }
};

/** 周报的事实底稿：全部由本地统计得出，AI 只能基于这些数字组织语言。 */
export interface WeeklySummaryFacts {
  weekStart: string;
  outputCount: number;
  /** 上周各罪名错误次数（已按次数降序）。 */
  errorCounts: Array<{ tag: GrammarErrorTag; label: string; plain: string; count: number }>;
  /** 错误总数与前周的差值（正数=变少；null=缺前周数据）。 */
  errorDeltaVsPrevWeek: number | null;
  /** 当前活跃弱点 Top3（频率×新近加权）。 */
  weakSpots: Array<{ label: string; plain: string; recentCount: number }>;
  /** 上周批改调用次数与失败数（有数据时用于判断"是不是没怎么练"）。 */
  diaryCalls: number;
}

/** 统计周报事实（纯本地，无网络）。 */
export const buildWeeklySummaryFacts = (data: AppData, referenceDate = new Date()): WeeklySummaryFacts | null => {
  const report = buildWeeklyReportForSummary(data, referenceDate);
  if (!report) return null;

  const lastWeekTags = weeklyErrorTagCounts(-1, referenceDate);
  const prevWeekTags = weeklyErrorTagCounts(-2, referenceDate);
  const sum = (counts: Partial<Record<GrammarErrorTag, number>>) =>
    Object.values(counts).reduce((total, value) => total + (value ?? 0), 0);
  const lastTotal = sum(lastWeekTags);
  const prevTotal = sum(prevWeekTags);

  const errorCounts = (Object.entries(lastWeekTags) as Array<[GrammarErrorTag, number]>)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({
      tag,
      label: tag,
      plain: GRAMMAR_ERROR_TAG_PLAIN[tag] ?? tag,
      count
    }));

  const weakSpots = computeWeakSpots(data)
    .slice(0, 3)
    .map((spot) => ({ label: spot.label, plain: spot.plain, recentCount: spot.recentCount }));

  const diaryEvents = listGrammarEventsByKind("diary_correction_result") as DiaryCorrectionResultEvent[];
  const weekStartMs = Date.parse(`${report.weekStart}T00:00:00`);
  const diaryCalls = Number.isFinite(weekStartMs)
    ? diaryEvents.filter((event) => Date.parse(event.ts) >= weekStartMs).length
    : diaryEvents.length;

  return {
    weekStart: report.weekStart,
    outputCount: report.outputCount,
    errorCounts,
    errorDeltaVsPrevWeek: lastTotal > 0 || prevTotal > 0 ? prevTotal - lastTotal : null,
    weakSpots,
    diaryCalls
  };
};

/** 复用现有的模板版周报（只取周起始日与输出句数，避免重复实现周计算）。 */
const buildWeeklyReportForSummary = (data: AppData, referenceDate: Date): WeeklyReport | null => {
  const weeks = computeWeeklyEffectiveOutput(data);
  const DAY_MS = 24 * 60 * 60 * 1000;
  const local = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const thisMonday = new Date(local.getTime() - ((local.getDay() + 6) % 7) * DAY_MS);
  const lastMonday = new Date(thisMonday.getTime() - 7 * DAY_MS);
  const weekStart = `${lastMonday.getFullYear()}-${String(lastMonday.getMonth() + 1).padStart(2, "0")}-${String(lastMonday.getDate()).padStart(2, "0")}`;
  const count = weeks.find((week) => week.weekStart === weekStart)?.count ?? 0;
  // 上周什么都没发生就不出周报（避免"你上周什么都没做"的挫败感）
  const facts = weeklyErrorTagCounts(-1, referenceDate);
  const hasAny = count > 0 || Object.values(facts).some((value) => (value ?? 0) > 0);
  return hasAny ? { weekStart, sentence: "", outputCount: count } : null;
};

export const buildWeeklySummaryMessages = (facts: WeeklySummaryFacts) => [
  {
    role: "system" as const,
    content: [
      "You write a short weekly recap for a Chinese beginner learning English (CEFR A1-A2), in Simplified Chinese.",
      "You are given FACTS computed locally. Never invent numbers — only rephrase the facts you receive.",
      "Tone: warm, concrete, never scolding. No grammar jargon (the learner is a total beginner).",
      "Structure: 2 short sentences. First: what went well or what the week looked like. Second: ONE specific next step.",
      "If outputCount is 0, do not scold — gently suggest one small action instead.",
      "If a weakSpot is given, the next step should target it, phrased in plain words (use its 'plain' field).",
      "Never use words like 错误率/不及格/退步. Never use the words 主语/谓语/复数/时态/从句.",
      "Return plain text only (no JSON, no markdown), at most 80 Chinese characters total."
    ].join(" ")
  },
  {
    role: "user" as const,
    content: JSON.stringify({
      weekStart: facts.weekStart,
      effectiveOutputSentences: facts.outputCount,
      errorCountsByType: facts.errorCounts.map((entry) => ({ plain: entry.plain, count: entry.count })),
      errorDeltaVsPrevWeek: facts.errorDeltaVsPrevWeek,
      weakSpots: facts.weakSpots.map((spot) => ({ plain: spot.plain, recentCount: spot.recentCount })),
      diaryCorrectionCalls: facts.diaryCalls
    })
  }
];

export interface WeeklySummaryOutcome {
  ok: boolean;
  /** 一段中文小结（成功时）。 */
  text?: string;
  /** 是否命中缓存（一周内只调一次模型）。 */
  cached: boolean;
  degraded: boolean;
  degradeReason: "not_configured" | "timeout" | "error" | "invalid" | null;
  latencyMs: number;
  /** 本地事实底稿——即使 AI 失败，调用方也能用它与模板版周报降级展示。 */
  facts: WeeklySummaryFacts;
}

/** AI 超时：周报属后台任务，给 10s 足够；不占用交互等待。 */
const WEEKLY_TIMEOUT_MS = 10_000;

export const requestWeeklySummary = async (
  provider: AiProviderSettings,
  facts: WeeklySummaryFacts
): Promise<WeeklySummaryOutcome> => {
  const startedAt = Date.now();
  const base = { facts, cached: false, latencyMs: 0 };

  // 一周只调一次：命中缓存直接返回
  const cache = readCache();
  const cachedEntry = cache[facts.weekStart];
  if (cachedEntry && Date.now() - cachedEntry.at < CACHE_TTL_MS) {
    return { ...base, ok: true, text: cachedEntry.text, cached: true, degraded: false, degradeReason: null };
  }

  if (!isAiProviderConfigured(provider)) {
    return { ...base, ok: false, degraded: true, degradeReason: "not_configured", latencyMs: Date.now() - startedAt };
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), WEEKLY_TIMEOUT_MS);
  try {
    const { response, json: payload } = await postChatCompletion<{
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    }>(
      normalizeChatCompletionsUrl(provider.baseUrl),
      provider.apiKey,
      (withOptionalFields) => ({
        model: provider.model,
        temperature: Math.min(provider.temperature, 0.5),
        max_tokens: 300,
        ...(withOptionalFields ? buildAiThinkingParams() : {}),
        messages: buildWeeklySummaryMessages(facts)
      }),
      controller.signal
    );
    if (!response.ok) {
      return { ...base, ok: false, degraded: true, degradeReason: "error", latencyMs: Date.now() - startedAt };
    }
    const text = (payload.choices?.[0]?.message?.content ?? "").trim();
    // 校验：非空、长度合理（防止模型跑题写长篇）
    if (!text || text.length > 200) {
      return { ...base, ok: false, degraded: true, degradeReason: "invalid", latencyMs: Date.now() - startedAt };
    }
    writeCache({ ...cache, [facts.weekStart]: { at: Date.now(), text } });
    return { ...base, ok: true, text, cached: false, degraded: false, degradeReason: null, latencyMs: Date.now() - startedAt };
  } catch {
    return { ...base, ok: false, degraded: true, degradeReason: "timeout", latencyMs: Date.now() - startedAt };
  } finally {
    window.clearTimeout(timer);
  }
};

/** 清空周报缓存（换模型或想看新版本时用）。 */
export const clearWeeklySummaryCache = (): void => {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.removeItem(CACHE_KEY);
  } catch {
    // 忽略
  }
};
