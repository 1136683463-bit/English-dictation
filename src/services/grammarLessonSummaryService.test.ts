import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildLessonSummaryFacts,
  buildLessonSummaryMessages,
  clearLessonSummaryCache,
  requestLessonSummary
} from "./grammarLessonSummaryService";
import { appendGrammarEvent, clearGrammarTelemetry } from "./grammarTelemetry";
import { grammarLessons } from "../data/grammarLessons";
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

const lesson = grammarLessons[12];

beforeEach(() => {
  clearGrammarTelemetry();
  clearLessonSummaryCache();
  vi.restoreAllMocks();
});

describe("grammarLessonSummaryService · 事实统计（纯本地）", () => {
  it("按段汇总一步通过情况，段名用用户看得懂的说法", () => {
    appendGrammarEvent({ kind: "lesson_step_result", lessonId: lesson.id, section: "recall", stepKind: "free_recall", stepIndex: 0, attempts: 3, passed: false, ts: "2026-09-19T10:00:00.000Z" });
    appendGrammarEvent({ kind: "lesson_step_result", lessonId: lesson.id, section: "practice", stepKind: "arrange", stepIndex: 0, attempts: 1, passed: true, ts: "2026-09-19T10:01:00.000Z" });

    const facts = buildLessonSummaryFacts(makeTestData(), lesson, { queuedSentenceCount: 2, pretestWrongCount: 1 });
    expect(facts.lessonId).toBe(lesson.id);
    const recall = facts.sections.find((section) => section.section === "忆");
    expect(recall?.total).toBe(1);
    expect(recall?.passedFirstTry).toBe(0);
    // 段名不得是内部英文 key
    expect(facts.sections.every((section) => !/^[a-z_]+$/.test(section.section))).toBe(true);
  });

  it("无遥测时 sections 为空但不报错（新课后备场景）", () => {
    const facts = buildLessonSummaryFacts(makeTestData(), lesson, { queuedSentenceCount: 0, pretestWrongCount: 0 });
    expect(facts.sections).toEqual([]);
  });
});

describe("grammarLessonSummaryService · AI 小结", () => {
  const facts = {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    grammarPoint: lesson.grammarLabel,
    sections: [{ section: "忆", attempts: 3, total: 1, passedFirstTry: 0 }],
    queuedSentenceCount: 2,
    pretestWrongCount: 1
  };

  it("prompt 约束：一句话、零术语、不许编数字、做得好就别硬找问题", () => {
    const system = buildLessonSummaryMessages(facts)[0].content;
    expect(system).toContain("max 40 characters");
    expect(system).toContain("Never invent numbers");
    expect(system).toContain("No grammar jargon");
    expect(system).toContain("instead of inventing a problem");
    expect(system).toContain("Return plain text only");
  });

  it("未配置 AI 时降级（收据页照常展示，不弹错）", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const outcome = await requestLessonSummary(provider({ enabled: false }), facts);
    expect(outcome.ok).toBe(false);
    expect(outcome.degradeReason).toBe("not_configured");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("成功时返回文本并按课缓存（同课不重复调用）", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: "这一课卡在「忆」那一步，多试了两次——明天复习会再来一遍。" } }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );
    const first = await requestLessonSummary(provider(), facts);
    expect(first.ok).toBe(true);
    expect(first.text).toContain("忆");
    expect(first.cached).toBe(false);

    const second = await requestLessonSummary(provider(), facts);
    expect(second.cached).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("模型写太长时丢弃（收据页只容一句话）", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: "长".repeat(300) } }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );
    const outcome = await requestLessonSummary(provider(), facts);
    expect(outcome.ok).toBe(false);
    expect(outcome.degradeReason).toBe("invalid");
  });

  it("请求失败时降级且不抛出", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Load failed"));
    const outcome = await requestLessonSummary(provider(), facts);
    expect(outcome.ok).toBe(false);
    expect(outcome.degraded).toBe(true);
  });
});
