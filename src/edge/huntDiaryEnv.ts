/**
 * 侦探找错 / 英文日记 边界验证的共用夹具（2026-09-21）
 *
 * 两个页面的边界验证共用：
 * - jsdom 没有 ResizeObserver，而 GrammarDiaryPage 在挂载时 new ResizeObserver(sync)
 *   （src/pages/GrammarDiaryPage.tsx:114），缺桩会让整页抛错、测试全红；
 * - 日记页的 AI 走 postChatCompletion → globalThis.fetch，测试里用 stub fetch 喂固定 JSON；
 * - 两页的「已解锁案 / 已写完日记」都只由 localStorage 决定，这里给造数工具。
 */
import { defaultSettings, parseBackupJson } from "../services/storage";
import type { AppData, DiaryEntry, HuntAttempt, HuntResult, Settings } from "../types";
import { STORAGE_KEY, seedAppData } from "./verify/fixtures";

/** 安装 jsdom 缺失的 ResizeObserver 桩（幂等）。返回卸载函数。 */
export const installResizeObserverStub = (): (() => void) => {
  const scope = globalThis as { ResizeObserver?: unknown };
  if (scope.ResizeObserver) return () => undefined;
  class StubResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  scope.ResizeObserver = StubResizeObserver;
  return () => {
    delete scope.ResizeObserver;
  };
};

/** 从当前 localStorage 读迁移后的 AppData（与页面同一条管线）。 */
export const currentData = (): AppData => parseBackupJson(window.localStorage.getItem(STORAGE_KEY) ?? "{}");

/** 造一份带自定义设置的 AppData。 */
export const seedWithSettings = (
  patch: Partial<AppData> = {},
  settingsPatch: Partial<Settings> = {}
): AppData => seedAppData({ ...patch, settings: { ...defaultSettings, ...settingsPatch } });

export interface AiStubOptions {
  /** 返回体（OpenAI 兼容结构）。传 null 表示返回空 200。 */
  content?: string | null;
  /** 直接让 fetch 抛出（模拟网络/CORS 失败）。 */
  throwError?: string;
  /** 非 200 响应。 */
  status?: number;
  /** 响应体不是 JSON（模拟中转站回 HTML）。 */
  rawText?: string;
}

/** 把 globalThis.fetch 换成固定应答的桩；返回恢复函数。 */
export const stubFetch = (options: AiStubOptions): (() => void) => {
  const original = (globalThis as { fetch?: unknown }).fetch;
  (globalThis as { fetch: unknown }).fetch = async () => {
    if (options.throwError) throw new Error(options.throwError);
    if (options.rawText !== undefined) {
      return {
        ok: options.status ? options.status < 400 : true,
        status: options.status ?? 200,
        text: async () => options.rawText
      } as unknown as Response;
    }
    const body = { choices: [{ message: { content: options.content ?? "" } }] };
    return {
      ok: options.status ? options.status < 400 : true,
      status: options.status ?? 200,
      text: async () => JSON.stringify(body)
    } as unknown as Response;
  };
  return () => {
    (globalThis as { fetch: unknown }).fetch = original;
  };
};

/** 已配置 AI 的设置块。 */
export const aiSettings = (patch: Partial<Settings["aiProvider"]> = {}): Partial<Settings> => ({
  aiProvider: {
    enabled: true,
    baseUrl: "https://relay.invalid/v1",
    apiKey: "test-key",
    model: "test-model",
    temperature: 0.7,
    timeoutMs: 120000,
    fallbackToLocal: true,
    ...patch
  }
});

/** 本地日期键（与 diaryService.localDateKey 同口径）。 */
export const todayKey = (date = new Date()): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const makeDiaryEntry = (patch: Partial<DiaryEntry> & { id: string }): DiaryEntry => ({
  dateKey: todayKey(),
  questionId: "d-today-feel",
  questionZh: "你现在的心情怎么样？",
  answerEn: "I am happy.",
  correctedEn: "",
  issues: [],
  status: "pending",
  createdAt: "2024-01-01T00:00:00.000Z",
  ...patch
});

export const makeHuntResult = (patch: Partial<HuntResult> & { caseId: string }): HuntResult => ({
  id: `hunt_result_${patch.caseId}`,
  found: 0,
  total: 0,
  misses: 0,
  stars: 3,
  durationMs: 1000,
  finishedAt: "2024-01-01T00:00:00.000Z",
  ...patch
});

export const makeHuntAttempt = (patch: Partial<HuntAttempt> & { caseId: string; tokenIndex: number }): HuntAttempt => ({
  id: `hunt_attempt_${patch.caseId}_${patch.tokenIndex}`,
  guessedTag: null,
  hit: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  ...patch
});

export { seedAppData };
