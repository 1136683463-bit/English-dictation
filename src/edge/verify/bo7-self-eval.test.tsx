// @vitest-environment jsdom
/**
 * BO7 · 「换你来说」/ 每档完成后的自评（清单项 7）
 *
 * 设计声明：
 * - GrammarBoostPage.tsx:770 注释「每档完成后 1 题自评（R-B16）：**只记录，不再追加任何动作**」；
 * - PRD R-B16 验收：「Given 档 1 完成，When 提交自评，Then **记录且不再追加任何动作**」。
 *
 * 所以「选了自评之后 schedule / 卡片状态变化」**不是**设计要求——设计要求正好相反。
 * 本文件的核验目标是：
 * ① 三个选项都能点、点后有视觉选中态（不是假按钮）；
 * ② 每次点击写一条 `grammar_boost_step_result`（sourceRef=self-eval:<key>）；
 * ③ 自评**不影响**通过率/难度等聚合口径（self-eval 被显式排除）；
 * ④ 自评**确实**不触发任何后续动作（不写卡、不改 schedule、不加事件）；
 * ⑤ 重复点不同选项的行为（是否可改、是否重复记账）。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import { buildBoostItems } from "../../services/grammarBoostService";
import { summarizeGrammarTelemetry } from "../../services/grammarTelemetry";
import { DONE_LESSON_ID, readAppData, seedAppData, telemetryOfKind } from "./fixtures";
import { answerBoostItem, flushAsync } from "./drive";
import type { Mounted } from "../harness";

const seedLesson = () =>
  seedAppData({
    grammarLessonsDone: [DONE_LESSON_ID],
    grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] }
  });

const mountBoost = (search = "") =>
  mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}${search}`, "/grammar/boost/:lessonId");

/** 做完档 1，停在完成态。 */
const finishTier1 = (page: Mounted) => {
  const items = buildBoostItems(DONE_LESSON_ID, 1, {});
  for (const [index, item] of items.entries()) {
    expect(answerBoostItem(page, item)).toBe("passed");
    if (index + 1 < items.length) page.click("下一题");
    else page.click("完成这一档");
  }
  return items;
};

const selfEvalScores = () =>
  telemetryOfKind("grammar_boost_step_result").filter((event) =>
    String(event.sourceRef ?? "").startsWith("self-eval:")
  );

describe("BO7-a 自评 UI 与记录", () => {
  beforeEach(() => resetStorage());

  it("完成态出现自评三选项，且文案是零术语的自我感受（不是对错判断）", () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    finishTier1(page);
    expect(page.has("这一档的感觉如何？")).toBe(true);
    const labels = page.buttons().filter((text) => ["挺顺利", "有点想", "还不太顺"].includes(text));
    expect(labels).toEqual(["挺顺利", "有点想", "还不太顺"]);
    page.unmount();
  });

  it("点「挺顺利」→ 选中态 + 记一条 self-eval:easy（passed=true）", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    finishTier1(page);
    page.click("挺顺利");
    await flushAsync();

    const picked = page.container.querySelectorAll(".boost-self-eval-btn.picked");
    expect(picked.length, "点击后没有视觉选中态（假按钮）").toBe(1);
    expect((picked[0].textContent ?? "").trim()).toBe("挺顺利");

    const scores = selfEvalScores();
    expect(scores.length).toBe(1);
    expect(scores[0].sourceRef).toBe("self-eval:easy");
    expect(scores[0].passed).toBe(true);
    expect(scores[0].lessonId).toBe(DONE_LESSON_ID);
    expect(scores[0].tier).toBe(1);
    page.unmount();
  });

  it("点「还不太顺」→ 记 self-eval:hard（passed=false），但页面不给任何负面反馈", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    finishTier1(page);
    page.click("还不太顺");
    await flushAsync();

    const scores = selfEvalScores();
    expect(scores.length).toBe(1);
    expect(scores[0].sourceRef).toBe("self-eval:hard");
    expect(scores[0].passed).toBe(false);
    // Affective Filter：不出现任何评价性文案
    for (const banned of ["不对", "错了", "要加油", "退步", "正确率"]) {
      expect(page.text().includes(banned), `自评后出现评价性文案「${banned}」`).toBe(false);
    }
    page.unmount();
  });

  it("点「有点想」→ 记 self-eval:ok（passed=false），与 hard 同口径", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    finishTier1(page);
    page.click("有点想");
    await flushAsync();
    const scores = selfEvalScores();
    expect(scores[0].sourceRef).toBe("self-eval:ok");
    expect(scores[0].passed).toBe(false);
    page.unmount();
  });

  it("自评不打断完成态：完成态仍在、出口仍在、档位完成态不受影响", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    finishTier1(page);
    page.click("挺顺利");
    await flushAsync();
    expect(page.has("这一课的记忆稳住了")).toBe(true);
    expect(page.buttons().some((text) => text.includes("再深一点"))).toBe(true);
    expect(readAppData().grammarBoostsDone?.[DONE_LESSON_ID]).toEqual([1]);
    page.unmount();
  });
});

describe("BO7-b 自评是否真的「只记录，不再追加任何动作」", () => {
  beforeEach(() => resetStorage());

  it("点自评前后：卡片数 / schedule / 完成态 / 事件种类都不变", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    finishTier1(page);
    await flushAsync();

    const before = readAppData();
    const beforeKinds = telemetryOfKind("grammar_boost_completed").length;
    const beforeStarted = telemetryOfKind("grammar_boost_started").length;

    page.click("挺顺利");
    await flushAsync();

    const after = readAppData();
    expect(after.cards.length, "自评写道了卡片（设计要求不追加动作）").toBe(before.cards.length);
    expect(after.schedules.length, "自评改动了复习计划").toBe(before.schedules.length);
    expect(JSON.stringify(after.schedules)).toBe(JSON.stringify(before.schedules));
    expect(after.grammarBoostsDone).toEqual(before.grammarBoostsDone);
    expect(telemetryOfKind("grammar_boost_completed").length).toBe(beforeKinds);
    expect(telemetryOfKind("grammar_boost_started").length).toBe(beforeStarted);
    // 不产生 AI 调用、不产生入队事件
    expect(telemetryOfKind("grammar_boost_ai_result").length).toBe(0);
    expect(telemetryOfKind("sentence_card_enqueued").length).toBe(0);
    page.unmount();
  });

  it("自评被排除在「一次通过率」口径之外（sourceRef 前缀过滤有效）", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    finishTier1(page);
    page.click("还不太顺");
    await flushAsync();

    const summary = summarizeGrammarTelemetry().boost;
    expect(summary.completedByTier[1]).toBe(1);
    // 4 题全对 → 一次通过率 1；若自评（passed=false）被计入，这里会 < 1
    expect(summary.firstTryRateByTier[1], "自评污染了一次通过率").toBe(1);
    // 素材重复率的分母也排除了自评
    expect(summary.itemRepeatRate).toBe(0);
    page.unmount();
  });

  it("重复点不同选项：两条都记录，选中态跟随最后一次", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    finishTier1(page);
    page.click("挺顺利");
    page.click("还不太顺");
    await flushAsync();

    const scores = selfEvalScores();
    expect(scores.length, `自评可改选，但记录应为 2 条：${JSON.stringify(scores.map((s) => s.sourceRef))}`).toBe(2);
    expect(scores.map((event) => event.sourceRef)).toEqual(["self-eval:easy", "self-eval:hard"]);
    const picked = page.container.querySelectorAll(".boost-self-eval-btn.picked");
    expect(picked.length).toBe(1);
    expect((picked[0].textContent ?? "").trim()).toBe("还不太顺");
    page.unmount();
  });

  it("重复点同一选项：每次都记一条（无幂等守卫）", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    finishTier1(page);
    page.click("挺顺利");
    page.click("挺顺利");
    page.click("挺顺利");
    await flushAsync();
    const scores = selfEvalScores();
    expect(scores.length, "同一选项被点 3 次记了 " + scores.length + " 条").toBe(3);
    page.unmount();
  });
});

describe("BO7-c 每档都有自评（三档一致）", () => {
  beforeEach(() => resetStorage());

  it("档 2 / 档 3 完成后同样出现自评，且 tier 字段正确", async () => {
    for (const tier of [2, 3] as const) {
      resetStorage();
      seedAppData({
        grammarLessonsDone: [DONE_LESSON_ID],
        grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] },
        ...(tier === 3 ? { grammarBoostsDone: { [DONE_LESSON_ID]: [1, 2] } } : {})
      });
      const page = mountBoost(`?tier=${tier}`);
      const items = buildBoostItems(DONE_LESSON_ID, tier, {});
      for (const [index, item] of items.entries()) {
        expect(answerBoostItem(page, item), `档 ${tier} 第 ${index + 1} 题`).toBe("passed");
        if (index + 1 < items.length) page.click("下一题");
        else page.click("完成这一档");
      }
      await flushAsync();
      expect(page.has("这一档的感觉如何？"), `档 ${tier} 完成态没有自评`).toBe(true);
      page.click("有点想");
      await flushAsync();
      const scores = selfEvalScores();
      expect(scores.length, `档 ${tier}`).toBe(1);
      expect(scores[0].tier, `档 ${tier} 的自评 tier 字段`).toBe(tier);
      page.unmount();
    }
  });
});
