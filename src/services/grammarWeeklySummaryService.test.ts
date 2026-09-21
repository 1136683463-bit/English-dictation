import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildWeeklySummaryFacts,
  buildWeeklySummaryMessages,
  clearWeeklySummaryCache,
  requestWeeklySummary
} from "./grammarWeeklySummaryService";
import { appendGrammarEvent, clearGrammarTelemetry } from "./grammarTelemetry";
import { makeTestData } from "./testUtils";
import type { AiProviderSettings } from "../types";

const provider = (overrides: Partial<AiProviderSettings> = {}): AiProviderSettings => ({
  enabled: true,
  baseUrl: "https://api.example.com/v1",
  apiKey: "sk-test",
  model: "m",
  temperature: 0.7,
  timeoutMs: 120000,
  fallbackToLocal: true,
  ...overrides
});

beforeEach(() => {
  clearGrammarTelemetry();
  clearWeeklySummaryCache();
  vi.restoreAllMocks();
});

describe("grammarWeeklySummaryService · 事实底稿（纯本地）", () => {
  it("上周无任何活动时不出周报（避免「你上周什么都没做」的挫败感）", () => {
    expect(buildWeeklySummaryFacts(makeTestData())).toBeNull();
  });

  it("有输出时产出事实底稿，且错误按次数降序", () => {
    // 构造上周（相对当前参考日的 -1 周）的两类错误
    const reference = new Date("2026-09-19T10:00:00");
    const lastWeek = new Date(reference.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    appendGrammarEvent({ kind: "diary_issue_tag", entryId: "d1", issueIndex: 0, tag: "tense", ts: lastWeek });
    appendGrammarEvent({ kind: "diary_issue_tag", entryId: "d2", issueIndex: 0, tag: "tense", ts: lastWeek });
    appendGrammarEvent({ kind: "diary_issue_tag", entryId: "d3", issueIndex: 0, tag: "article", ts: lastWeek });

    const data = makeTestData({
      diaryEntries: [
        {
          id: "d1",
          dateKey: "2026-09-10",
          questionId: "q",
          questionZh: "q",
          answerEn: "I go yesterday.",
          correctedEn: "I went yesterday.",
          issues: [{ original: "go", correction: "went", explanation: "过去的事。", tag: "tense" }],
          status: "done",
          createdAt: lastWeek
        }
      ]
    });
    const facts = buildWeeklySummaryFacts(data, reference);
    expect(facts).not.toBeNull();
    expect(facts!.errorCounts[0].tag).toBe("tense");
    expect(facts!.errorCounts[0].count).toBe(2);
    // 每条错误都带零术语人话说明（供 AI 与降级展示使用）
    expect(facts!.errorCounts[0].plain.trim()).not.toBe("");
  });
});

describe("grammarWeeklySummaryService · AI 小结", () => {
  const facts = {
    weekStart: "2026-09-14",
    outputCount: 12,
    errorCounts: [{ tag: "tense" as const, label: "tense", plain: "事情发生在过去，动词要换成过去式", count: 3 }],
    errorDeltaVsPrevWeek: 2,
    weakSpots: [{ label: "tense", plain: "事情发生在过去，动词要换成过去式", recentCount: 3 }],
    diaryCalls: 4
  };

  it("prompt 要求只用给定事实、零术语、两句以内", () => {
    const system = buildWeeklySummaryMessages(facts)[0].content;
    expect(system).toContain("Never invent numbers");
    expect(system).toContain("No grammar jargon");
    expect(system).toContain("2 short sentences");
    expect(system).toContain("Return plain text only");
    // 请求体带全部事实
    expect(buildWeeklySummaryMessages(facts)[1].content).toContain("2026-09-14");
  });

  it("未配置 AI 时降级（但仍返回事实底稿供模板周报使用）", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const outcome = await requestWeeklySummary(provider({ enabled: false }), facts);
    expect(outcome.ok).toBe(false);
    expect(outcome.degradeReason).toBe("not_configured");
    expect(outcome.facts.weekStart).toBe("2026-09-14");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("成功时返回文本并按周缓存（一周只调一次模型）", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ choices: [{ message: { content: "上周你说了 12 句，挺稳。下周试着把过去的事说清楚一点。" } }] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    const first = await requestWeeklySummary(provider(), facts);
    expect(first.ok).toBe(true);
    expect(first.text).toContain("12 句");
    expect(first.cached).toBe(false);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // 同周第二次：命中缓存，不再发请求
    const second = await requestWeeklySummary(provider(), facts);
    expect(second.cached).toBe(true);
    expect(second.text).toBe(first.text);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("模型跑题写长篇时按 invalid 降级（防止周报卡被撑爆）", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: "长".repeat(500) } }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );
    const outcome = await requestWeeklySummary(provider(), facts);
    expect(outcome.ok).toBe(false);
    expect(outcome.degradeReason).toBe("invalid");
  });

  it("请求失败时降级且不抛出（周报卡照常用模板句展示）", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Load failed"));
    const outcome = await requestWeeklySummary(provider(), facts);
    expect(outcome.ok).toBe(false);
    expect(outcome.degraded).toBe(true);
    expect(outcome.text).toBeUndefined();
  });
});
