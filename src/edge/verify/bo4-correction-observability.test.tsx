// @vitest-environment jsdom
/**
 * BO4 · 档 3 收尾批改的可观测性与顺序性（清单项 4）
 *
 * 设计声明：
 * - GrammarBoostPage.tsx:96 `aiUsedRef`「本次会话是否用过 AI（写入 completed 事件，用于 AI 使用率）」；
 * - grammarTelemetry.ts:827 `aiUsedRate = 带 aiUsed 的完成 / 档 3 完成`。
 *
 * 因此 completed 事件的 `aiUsed` 是「AI 批改使用率」这个指标的**唯一**分子来源。
 * 本文件核验：AI 真的返回了批改结果时，completed 事件里的 aiUsed 是否被如实记账。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { mountPage, resetStorage } from "../harness";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import { buildBoostItems } from "../../services/grammarBoostService";
import { defaultSettings } from "../../services/storage";
import { summarizeGrammarTelemetry } from "../../services/grammarTelemetry";
import { DONE_LESSON_ID, seedAppData, telemetryOfKind } from "./fixtures";
import { aiSettings, stubFetch } from "../huntDiaryEnv";
import { clickElement, flushAsync } from "./drive";
import type { Mounted } from "../harness";

const seedTier3 = () =>
  seedAppData({
    grammarLessonsDone: [DONE_LESSON_ID],
    grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] },
    grammarBoostsDone: { [DONE_LESSON_ID]: [1, 2] },
    settings: { ...defaultSettings, ...aiSettings() }
  });

const mountBoost = (search = "") =>
  mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}${search}`, "/grammar/boost/:lessonId");

const writeAndSubmit = (page: Mounted, value: string) => {
  const field = page.container.querySelector("input.large-textarea") as HTMLInputElement | null;
  if (!field) throw new Error(`当前没有产出输入框；按钮：${page.buttons().join(" | ")}`);
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  act(() => {
    setter?.call(field, value);
    field.dispatchEvent(new Event("input", { bubbles: true }));
  });
  const submit = Array.from(page.container.querySelectorAll("button")).find(
    (button) => (button.textContent ?? "").trim() === "提交"
  ) as HTMLButtonElement | undefined;
  if (!submit) throw new Error(`没有提交按钮；按钮：${page.buttons().join(" | ")}`);
  clickElement(submit);
};

const advance = (page: Mounted) => {
  const button = Array.from(page.container.querySelectorAll("button")).find((item) =>
    ["下一题", "完成这一档"].includes((item.textContent ?? "").trim())
  ) as HTMLButtonElement | undefined;
  if (!button) throw new Error(`当前没有推进按钮；按钮：${page.buttons().join(" | ")}`);
  clickElement(button);
};

/** 走完档 3（每题写不同句子，用「看答案」收尾以保证用户原话被记入本档产出）。 */
const runTier3 = (page: Mounted, writes: string[]) => {
  const items = buildBoostItems(DONE_LESSON_ID, 3, {});
  items.forEach((_item, index) => {
    writeAndSubmit(page, writes[index] ?? `sentence number ${index}`);
    const reveal = Array.from(page.container.querySelectorAll("button")).find((button) =>
      (button.textContent ?? "").includes("看答案")
    ) as HTMLButtonElement | undefined;
    if (!reveal) throw new Error(`第 ${index + 1} 题没有看答案入口；按钮：${page.buttons().join(" | ")}`);
    clickElement(reveal);
    advance(page);
  });
  return items;
};

const OK_CORRECTION = JSON.stringify({
  items: [
    { corrected: "I am a student.", issues: [{ original: "I", correction: "I am", explanation: "加个 am 就顺了。" }], comment: "意思都在。" },
    { corrected: "She goes to school.", issues: [], comment: "这句可以。" },
    { corrected: "They are happy.", issues: [], comment: "挺好。" }
  ]
});

describe("BO4-a AI 批改成功后，completed.aiUsed 是否如实记账", () => {
  beforeEach(() => resetStorage());

  it("AI 返回批改并渲染到页面 → completed 事件的 aiUsed 应为 true", async () => {
    seedTier3();
    const restore = stubFetch({ content: OK_CORRECTION });
    try {
      const page = mountBoost("?tier=3");
      runTier3(page, ["I a student.", "She go to school.", "They is happy."]);
      await flushAsync();
      await flushAsync();

      // 前提：AI 确实成功返回并渲染（不是降级）
      const aiEvents = telemetryOfKind("grammar_boost_ai_result").filter((event) => event.questionIndex === 0);
      expect(aiEvents.length).toBe(1);
      expect(aiEvents[0].ok, "AI 调用未成功，本用例前提不成立").toBe(true);
      expect(aiEvents[0].degraded).toBe(false);
      expect(page.has("AI 看了看你写的这几句"), "AI 批改结果没有渲染出来").toBe(true);

      // 断言：既然用户真的看到了 AI 批改，aiUsed 就该是 true
      const completed = telemetryOfKind("grammar_boost_completed") as Array<Record<string, unknown>>;
      expect(completed.length).toBe(1);
      expect(completed[0].tier).toBe(3);
      expect(completed[0].aiUsed, "用户确实用上了 AI 批改，但 completed.aiUsed 记成了 false").toBe(true);
      page.unmount();
    } finally {
      restore();
    }
  });

  it("AI 降级（未配置）→ completed 事件的 aiUsed 应为 false（对照组）", async () => {
    seedAppData({
      grammarLessonsDone: [DONE_LESSON_ID],
      grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] },
      grammarBoostsDone: { [DONE_LESSON_ID]: [1, 2] }
    });
    const page = mountBoost("?tier=3");
    runTier3(page, ["I a student.", "She go to school.", "They is happy."]);
    await flushAsync();
    const completed = telemetryOfKind("grammar_boost_completed") as Array<Record<string, unknown>>;
    expect(completed[0].aiUsed).toBe(false);
    page.unmount();
  });

  it("汇总口径：aiUsedRate 在 AI 成功批改后应 > 0", async () => {
    seedTier3();
    const restore = stubFetch({ content: OK_CORRECTION });
    try {
      const page = mountBoost("?tier=3");
      runTier3(page, ["I a student.", "She go to school.", "They is happy."]);
      await flushAsync();
      await flushAsync();
      const summary = summarizeGrammarTelemetry().boost;
      expect(summary.completedByTier[3]).toBe(1);
      expect(summary.aiUsedRate, "AI 使用率恒为 0（分子永远记不上）").toBeGreaterThan(0);
      page.unmount();
    } finally {
      restore();
    }
  });
});

describe("BO4-b 批改结果的渲染完整性", () => {
  beforeEach(() => resetStorage());

  it("recast / comment / issues 三类字段都按设计渲染，缺字段不渲染空行", async () => {
    seedTier3();
    const restore = stubFetch({
      content: JSON.stringify({
        items: [
          {
            corrected: "I am a student.",
            recast: "I'm a student.",
            comment: "这句很顺。",
            issues: [
              { original: "I", correction: "I am", explanation: "加个 am 就顺了。" },
              { original: "a", correction: "a", explanation: "这里不用改。" }
            ]
          },
          { corrected: "She goes to school.", issues: [] },
          { corrected: "They are happy.", issues: [] }
        ]
      })
    });
    try {
      const page = mountBoost("?tier=3");
      runTier3(page, ["I a student.", "She go to school.", "They is happy."]);
      await flushAsync();
      await flushAsync();

      const card = page.container.querySelector(".boost-ai-card")!;
      expect(card).not.toBeNull();
      const text = card.textContent ?? "";
      expect(text).toContain("你这句：");
      expect(text).toContain("改顺一点：");
      expect(text).toContain("也可以这样说：");
      expect(text).toContain("I'm a student.");
      expect(text).toContain("这句很顺。");
      expect(text).toContain("加个 am 就顺了。");
      expect(text).toContain("这里不用改。");
      // 三条都有回显
      expect((text.match(/你这句：/g) ?? []).length).toBe(3);
      page.unmount();
    } finally {
      restore();
    }
  });

  it("批改结果按输入顺序与用户原句一一对应（不会串句）", async () => {
    seedTier3();
    const writes = ["alpha wrong one", "beta wrong two", "gamma wrong three"];
    const restore = stubFetch({ content: OK_CORRECTION });
    try {
      const page = mountBoost("?tier=3");
      runTier3(page, writes);
      await flushAsync();
      await flushAsync();
      const card = page.container.querySelector(".boost-ai-card")!;
      const text = card.textContent ?? "";
      for (const write of writes) {
        expect(text, `用户原句「${write}」没有回显`).toContain(write);
      }
      // 顺序：alpha 在 beta 前，beta 在 gamma 前
      expect(text.indexOf("alpha wrong one")).toBeLessThan(text.indexOf("beta wrong two"));
      expect(text.indexOf("beta wrong two")).toBeLessThan(text.indexOf("gamma wrong three"));
      page.unmount();
    } finally {
      restore();
    }
  });
});
