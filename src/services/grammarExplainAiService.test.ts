import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildExplainMessages,
  clearExplainCache,
  requestLessonExplain
} from "./grammarExplainAiService";
import { buildLessonExplainContext } from "./grammarExplainService";
import { grammarLessons } from "../data/grammarLessons";
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

const lesson = grammarLessons[0];
const context = buildLessonExplainContext(lesson.id)!;

beforeEach(() => {
  clearExplainCache();
  vi.restoreAllMocks();
});

describe("grammarExplainAiService · prompt 契约", () => {
  it("系统提示含全部硬规则：只用素材/零术语表/长度/回指/弃权", () => {
    const messages = buildExplainMessages({
      question: "为什么是 am？",
      anchorText: "深挖卡首段",
      allowedSources: context.allowedSources
    });
    const system = messages[0].content;
    expect(system).toContain("Use ONLY these");
    expect(system).toContain("declined=true");
    // 零术语表进 prompt（主语/谓语/…与运行时校验同一张表）
    expect(system).toContain("主语");
    expect(system).toContain("介词");
    expect(system).toContain("at most 120 characters");
    expect(system).toContain("citedSource");
    // 请求体带素材与问题
    expect(messages[1].content).toContain("为什么是 am？");
    expect(messages[1].content).toContain("allowedSources");
  });
});

describe("grammarExplainAiService · 降级路径（全部静默不抛错）", () => {
  it("未配置 AI：立即降级，不发请求", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const outcome = await requestLessonExplain(provider({ enabled: false }), {
      question: "为什么？",
      anchorRef: "watch.deepDive",
      anchorText: "…",
      context
    });
    expect(outcome.ok).toBe(false);
    expect(outcome.degradeReason).toBe("not_configured");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("网络失败：降级 timeout/error，不抛出", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Load failed"));
    const outcome = await requestLessonExplain(provider(), {
      question: "为什么？",
      anchorRef: "watch.deepDive",
      anchorText: "…",
      context
    });
    expect(outcome.ok).toBe(false);
    expect(outcome.degraded).toBe(true);
  });

  it("模型跑题（含术语）：校验丢弃，degradeReason=invalid", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: JSON.stringify({ answer: "因为主语是 I，所以用 am。", citedSource: "oneLineRule", declined: false }) } }]
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    const outcome = await requestLessonExplain(provider(), {
      question: "为什么是 am？",
      anchorRef: "watch.deepDive",
      anchorText: "…",
      context
    });
    expect(outcome.ok).toBe(false);
    expect(outcome.degradeReason).toBe("invalid");
    expect(outcome.validationFailure).toBe("term");
  });

  it("引用不存在的素材：校验丢弃 citation", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: JSON.stringify({ answer: "因为搭档是 am。", citedSource: "made:up:ref", declined: false }) } }]
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    const outcome = await requestLessonExplain(provider(), {
      question: "为什么是 am？",
      anchorRef: "watch.deepDive",
      anchorText: "…",
      context
    });
    expect(outcome.ok).toBe(false);
    expect(outcome.validationFailure).toBe("citation");
  });

  it("AI 造新英文句（不在素材里）：校验丢弃 foreign", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: JSON.stringify({ answer: "应该说 We are happily dancing now.", citedSource: "oneLineRule", declined: false }) } }]
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    const outcome = await requestLessonExplain(provider(), {
      question: "怎么说？",
      anchorRef: "watch.deepDive",
      anchorText: "…",
      context
    });
    expect(outcome.ok).toBe(false);
    expect(outcome.validationFailure).toBe("foreign");
  });
});

describe("grammarExplainAiService · 成功路径", () => {
  it("合法回答：返回并通过校验、按课+问+模型缓存", async () => {
    // 用本课 oneLineRule 里真实存在的词构造合法回答（过 foreign 校验）
    const rule = context.allowedSources.find((entry) => entry.ref === "oneLineRule")!;
    const answerText = "因为" + rule.text.slice(0, 40);
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: JSON.stringify({ answer: answerText, citedSource: "oneLineRule", declined: false }) } }]
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    const input = { question: "为什么是 am？", anchorRef: "watch.deepDive", anchorText: "…", context };
    const first = await requestLessonExplain(provider(), input);
    expect(first.ok).toBe(true);
    expect(first.answer?.citedSource).toBe("oneLineRule");
    expect(first.cached).toBe(false);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // 同问第二次：命中缓存
    const second = await requestLessonExplain(provider(), input);
    expect(second.cached).toBe(true);
    expect(second.answer?.answer).toBe(answerText);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("弃权：素材不足时 declined=true（设计成功，不是失败）", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ choices: [{ message: { content: JSON.stringify({ declined: true }) } }] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    const outcome = await requestLessonExplain(provider(), {
      question: "什么是虚拟语气？",
      anchorRef: "watch.deepDive",
      anchorText: "…",
      context
    });
    expect(outcome.ok).toBe(true);
    expect(outcome.answer?.declined).toBe(true);
    expect(outcome.answer?.answer).toContain("没讲到");
  });
});

describe("C3 · 追问记忆（M3，2026-09-21）", () => {
  it("previousQuestions 只进 prompt 上下文，绝不进 allowedSources（白名单纪律）", () => {
    const messages = buildExplainMessages({
      question: "那否定怎么说？",
      anchorText: "一句话规则",
      allowedSources: [{ ref: "oneLineRule", text: "I like music." }],
      previousQuestions: ["为什么用 am 而不是 is？"]
    });
    const userPayload = JSON.parse(messages[1].content as string);
    // 记忆在 prompt 里
    expect(userPayload.previousQuestions).toEqual(["为什么用 am 而不是 is？"]);
    // 但白名单里只有素材本身，记忆不得混入
    expect(userPayload.allowedSources).toEqual([{ ref: "oneLineRule", text: "I like music." }]);
    expect(JSON.stringify(userPayload.allowedSources)).not.toContain("为什么用 am");
  });

  it("无记忆时不传 previousQuestions 字段（保持请求体干净）", () => {
    const messages = buildExplainMessages({
      question: "问一句",
      anchorText: "规则",
      allowedSources: [{ ref: "oneLineRule", text: "I am here." }]
    });
    const userPayload = JSON.parse(messages[1].content as string);
    expect(userPayload.previousQuestions).toBeUndefined();
  });
});
