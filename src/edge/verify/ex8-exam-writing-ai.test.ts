// @vitest-environment jsdom
/**
 * EX8 · 写作题的 AI 批改（P0-7）
 *
 * 规格：PRD §4.6 AI 白名单/黑名单 ｜ §12.1 G8/G-A3 ｜ §14 Non-goal 13
 *
 * 四条硬边界（每条都有断言，不靠约定）：
 *   ① **AI 绝不出分**（G8）：连「模型返回了分数」都要被拦下并整条降级——
 *      宁可说「这次没能给出批改」，也不能把「7.5 分」送到屏幕上。
 *   ② **AI 不判对错**（红线⑤）：写作结果里没有判分字段；客观题判分链不碰 AI（见 ex1 的 G7）。
 *   ③ **零术语**：输出过共享术语表，带术语一律丢弃。
 *   ④ **降级不伪造**（G-A3）：未配置 / 超时 / 非 JSON / HTTP 错误 → `ok:false`，不产出任何评语。
 */
import { describe, expect, it, beforeEach, vi } from "vitest";
import { stubFetch, aiSettings } from "../huntDiaryEnv";
import {
  buildExamWritingMessages,
  examAiTimeoutMs,
  requestExamWritingCorrection
} from "../../services/grammarExamAiService";

const provider = aiSettings().aiProvider!;
const input = {
  paperId: "season-1-v1",
  promptZh: "写 3 到 5 句话，说说你的星期天。",
  points: ["星期天天气怎么样", "你和谁在一起", "你做了什么"],
  text: "Sunday was sunny. I go to the park with my brother."
};

const reply = (value: unknown) => JSON.stringify({ choices: [{ message: { content: JSON.stringify(value) } }] });

describe("EX8 写作 AI 批改", () => {
  beforeEach(() => window.localStorage.clear());

  it("正常批改：返回 corrected / recast / issues / comment，且**不含任何判分字段**", async () => {
    const restore = stubFetch({
      content: JSON.stringify({
        corrected: "Sunday was sunny. I went to the park with my brother.",
        recast: "It was sunny on Sunday. I went to the park with my brother.",
        issues: [{ original: "I go", correction: "I went", explanation: "说的是星期天，已经过去了。", tag: "tense" }],
        comment: "星期天写得清楚，你和哥哥去公园这句很好。"
      })
    });
    const outcome = await requestExamWritingCorrection(provider, input);
    restore();

    expect(outcome.ok).toBe(true);
    expect(outcome.correction?.corrected).toContain("I went to the park");
    expect(outcome.correction?.issues?.[0].tag).toBe("tense");
    expect(outcome.correction?.comment).toContain("很好");
    // G8：结果对象里不许有判分类字段
    const keys = Object.keys(outcome.correction ?? {});
    for (const banned of ["score", "grade", "level", "band", "points", "percentage"]) {
      expect(keys.includes(banned), `批改结果不得含字段 ${banned}`).toBe(false);
    }
  });

  it("G8：模型返回分数 → 整条降级（不显示任何分数）", async () => {
    const restore = stubFetch({
      content: JSON.stringify({ corrected: "Sunday was sunny.", recast: "", issues: [], comment: "你得了 7.5 分。" })
    });
    const outcome = await requestExamWritingCorrection(provider, input);
    restore();
    expect(outcome.ok, "带分数的输出必须被拦下").toBe(false);
    expect(outcome.degradeReason).toBe("invalid");
    expect(outcome.correction, "降级时不得产出评语").toBeUndefined();
  });

  it("G8：模型返回 CEFR 档位 / 百分制也算出分，同样降级", async () => {
    for (const comment of ["Your level is B1.", "得分 85/100", "You got 90 points"]) {
      const restore = stubFetch({
        content: JSON.stringify({ corrected: "Sunday was sunny.", issues: [], comment })
      });
      const outcome = await requestExamWritingCorrection(provider, input);
      restore();
      expect(outcome.ok, `「${comment}」应被拦下`).toBe(false);
    }
  });

  it("零术语：批改里带语法术语一律丢弃（与课程守门同源）", async () => {
    const restore = stubFetch({
      content: JSON.stringify({
        corrected: "Sunday was sunny.",
        issues: [{ original: "I go", correction: "I went", explanation: "一般过去时的时态用错了。" }],
        comment: "不错。"
      })
    });
    const outcome = await requestExamWritingCorrection(provider, input);
    restore();
    expect(outcome.ok).toBe(false);
    expect(outcome.degradeReason).toBe("invalid");
  });

  it("裁决词同样拦下（界面口径只有「稳住 / 还漏」）", async () => {
    const restore = stubFetch({
      content: JSON.stringify({ corrected: "Sunday was sunny.", issues: [], comment: "这句是正确的。" })
    });
    const outcome = await requestExamWritingCorrection(provider, input);
    restore();
    expect(outcome.ok).toBe(false);
  });

  it("G-A3 降级四态：未配置 / 抛错 / 非 JSON / HTTP 500 —— 都不产出伪造评语", async () => {
    const notConfigured = await requestExamWritingCorrection(
      { ...provider, enabled: false },
      input
    );
    expect(notConfigured.ok).toBe(false);
    expect(notConfigured.degradeReason).toBe("not_configured");

    let restore = stubFetch({ throwError: "network down" });
    let outcome = await requestExamWritingCorrection(provider, input);
    restore();
    expect(outcome.ok).toBe(false);
    expect(outcome.degradeReason).toBe("error");
    expect(outcome.correction).toBeUndefined();

    restore = stubFetch({ rawText: "<html>502 Bad Gateway</html>" });
    outcome = await requestExamWritingCorrection(provider, input);
    restore();
    expect(outcome.ok).toBe(false);
    expect(outcome.correction).toBeUndefined();

    restore = stubFetch({ content: "{}", status: 500 });
    outcome = await requestExamWritingCorrection(provider, input);
    restore();
    expect(outcome.ok).toBe(false);
    expect(outcome.correction).toBeUndefined();
  });

  it("空写作不发请求（直接 invalid）", async () => {
    const spy = vi.fn();
    const original = globalThis.fetch;
    globalThis.fetch = spy as never;
    const outcome = await requestExamWritingCorrection(provider, { ...input, text: "   " });
    globalThis.fetch = original;
    expect(outcome.ok).toBe(false);
    expect(spy, "空文本不该发起请求").not.toHaveBeenCalled();
  });

  it("超时钳制在 8–10 秒（不吃 provider 默认的 120s）", () => {
    expect(examAiTimeoutMs({ ...provider, timeoutMs: 120000 })).toBe(10000);
    expect(examAiTimeoutMs({ ...provider, timeoutMs: 500 })).toBe(8000);
    expect(examAiTimeoutMs({ ...provider, timeoutMs: 9000 })).toBe(9000);
  });

  it("prompt 里明确写了「不许给分」（G8 的源头约束，不只是事后拦截）", () => {
    const messages = buildExamWritingMessages(input);
    const system = messages[0].content;
    expect(system).toMatch(/Do NOT give any score/i);
    expect(system).toMatch(/not grading/i);
    // 复用共享批改规则，而不是自建一套
    expect(system).toContain("gentle English tutor for Chinese beginners");
    // 明确要求 JSON 契约与日记/趁热练同形
    for (const field of ["corrected", "recast", "issues", "comment"]) {
      expect(system.includes(field), `prompt 应声明字段 ${field}`).toBe(true);
    }
  });

  it("命中缓存：同一段文字第二次调用不再发请求（零延迟）", async () => {
    let calls = 0;
    const original = globalThis.fetch;
    globalThis.fetch = (async () => {
      calls += 1;
      return {
        ok: true,
        status: 200,
        text: async () => reply({ corrected: "Sunday was sunny.", issues: [], comment: "写得好。" })
      } as unknown as Response;
    }) as never;
    const first = await requestExamWritingCorrection(provider, input);
    const second = await requestExamWritingCorrection(provider, input);
    globalThis.fetch = original;
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(second.cached, "第二次应命中缓存").toBe(true);
    expect(calls, "第二次不应再发请求").toBe(1);
  });
});
