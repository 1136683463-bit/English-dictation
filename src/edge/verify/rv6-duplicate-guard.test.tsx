// @vitest-environment jsdom
/**
 * RV6 · 重复作答防护与计数真实性（清单项 6）
 *
 * 风险点：一张卡答完后按钮是否真的不可再点；重复点击会不会多写 review、
 * 让 passedCount / stumbledCount 虚高（完成页「X 张一次到位」说假话）。
 *
 * 做法：答完一张卡后，在同一个 DOM 上强行再点所有历史按钮（含 disabled 的也直接
 * 派发 click 事件绕过浏览器默认拦截），检查：
 * ① reviews 只增一条；② schedule 只推进一次；③ 完成页计数与真实行为一致。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import { cardsToData, makeSentenceCard, PAST_ISO, readAppData, seedAppData } from "./fixtures";
import { flushAsync, planReviewSession } from "./drive";
import type { Mounted } from "../harness";

const SENTENCE = "I am drawing a picture.";

const seed = (reviewCount = 0) =>
  seedAppData(
    cardsToData([
      makeSentenceCard({
        id: "dup-card",
        sentence: SENTENCE,
        note: "语法课核心句：小美的一天 ① 我是谁",
        schedule: { reviewCount, nextReviewAt: PAST_ISO, intervalDays: 1 }
      })
    ])
  );

const mountReview = () => mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
const allButtons = (page: Mounted) => Array.from(page.container.querySelectorAll("button")) as HTMLButtonElement[];
const reviewsOf = (cardId: string) => readAppData().reviews.filter((item) => item.cardId === cardId);
const scheduleOf = (cardId: string) => readAppData().schedules.find((item) => item.cardId === cardId)!;

/** 不理会 disabled，直接派发 click（模拟连点 / 键盘连按 / 事件重放）。 */
const forceClickAll = async (page: Mounted) => {
  for (const button of allButtons(page)) {
    button.click();
    await flushAsync();
  }
};

describe("RV6-a cloze：答完后重复点击不重复计数", () => {
  beforeEach(() => resetStorage());

  it("点对之后所有选项都 disabled，再强行连点 5 次仍只有 1 条 review", async () => {
    const data = seed(0);
    const plan = planReviewSession(data);
    const page = mountReview();
    allButtons(page).find((item) => item.textContent?.trim() === (plan.steps[0] as { answer: string }).answer)?.click();
    await flushAsync();

    expect(reviewsOf("dup-card").length).toBe(1);
    const afterFirst = scheduleOf("dup-card").reviewCount;

    for (let round = 0; round < 5; round += 1) await forceClickAll(page);

    expect(reviewsOf("dup-card").length).toBe(1);
    expect(scheduleOf("dup-card").reviewCount).toBe(afterFirst);
    page.unmount();
  });

  it("选错后连点同一个错选项不会累加 attempts（按钮自身 disabled）", async () => {
    const data = seed(0);
    const plan = planReviewSession(data);
    const page = mountReview();
    const wrong = allButtons(page).find(
      (item) => item.textContent?.trim() !== (plan.steps[0] as { answer: string }).answer && !item.disabled
    ) as HTMLButtonElement;
    wrong.click();
    await flushAsync();
    expect(wrong.disabled).toBe(true);
    // 强行再点 3 次
    for (let round = 0; round < 3; round += 1) {
      wrong.click();
      await flushAsync();
    }
    // 只该记 1 次尝试：按正确答案提交时 rating 仍是 3（attempts=2），不是 4（attempts>=5 也还是 3）
    allButtons(page).find((item) => item.textContent?.trim() === (plan.steps[0] as { answer: string }).answer)?.click();
    await flushAsync();
    expect(reviewsOf("dup-card").length).toBe(1);
    expect(reviewsOf("dup-card")[0].rating).toBe(3);
    page.unmount();
  });
});

describe("RV6-b rebuild：答完后重复点击不重复计数", () => {
  beforeEach(() => resetStorage());

  it("拼对之后连点词块 10 次仍只有 1 条 review", async () => {
    const data = seed(1);
    const plan = planReviewSession(data);
    expect(plan.steps[0].mode).toBe("rebuild");
    const page = mountReview();
    for (const token of (plan.steps[0] as { tokens: string[] }).tokens) {
      allButtons(page).find((item) => !item.disabled && item.textContent?.trim() === token)?.click();
      await flushAsync();
    }
    expect(reviewsOf("dup-card").length).toBe(1);
    const afterFirst = scheduleOf("dup-card").reviewCount;

    for (let round = 0; round < 10; round += 1) await forceClickAll(page);

    expect(reviewsOf("dup-card").length).toBe(1);
    expect(scheduleOf("dup-card").reviewCount).toBe(afterFirst);
    page.unmount();
  });

  it("拼装区没有「一键清空」：拼错后只能逐个点掉（体验项）", async () => {
    const data = seed(1);
    const plan = planReviewSession(data);
    const page = mountReview();
    // 全部点上
    for (const token of (plan.steps[0] as { tokens: string[] }).tokens) {
      allButtons(page).find((item) => !item.disabled && item.textContent?.trim() === token)?.click();
      await flushAsync();
    }
    const labels = allButtons(page).map((item) => (item.textContent ?? "").trim());
    expect(labels.some((label) => /清空|重来|重置/.test(label))).toBe(false);
    page.unmount();
  });
});

describe("RV6-c free_type：回车 + 点击双触发不重复计数", () => {
  beforeEach(() => resetStorage());

  it("回车提交后立刻再按回车 / 再点提交，仍只有 1 条 review", async () => {
    const data = seed(2);
    const plan = planReviewSession(data);
    expect(plan.steps[0].mode).toBe("free_type");
    const page = mountReview();
    const field = page.container.querySelector("textarea") as HTMLTextAreaElement;
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    setter?.call(field, SENTENCE);
    field.dispatchEvent(new Event("input", { bubbles: true }));
    await flushAsync();

    // 回车提交
    field.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await flushAsync();
    expect(reviewsOf("dup-card").length).toBe(1);

    // 再按回车 + 再点提交 + 连点所有按钮
    field.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await flushAsync();
    await forceClickAll(page);

    expect(reviewsOf("dup-card").length).toBe(1);
    expect(scheduleOf("dup-card").reviewCount).toBe(3); // 种子 2 + 本次 1
    page.unmount();
  });

  it("输入空白（纯空格）不触发提交：「提交」按钮保持 disabled", async () => {
    const data = seed(2);
    void data;
    const page = mountReview();
    const field = page.container.querySelector("textarea") as HTMLTextAreaElement;
    const submit = allButtons(page).find((item) => item.textContent?.trim() === "提交") as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    setter?.call(field, "   ");
    field.dispatchEvent(new Event("input", { bubbles: true }));
    await flushAsync();
    expect(submit.disabled).toBe(true);
    expect(reviewsOf("dup-card").length).toBe(0);
    page.unmount();
  });

  it("中文输入法组词态回车不提交（isComposing 守卫）", async () => {
    seed(2);
    const page = mountReview();
    const field = page.container.querySelector("textarea") as HTMLTextAreaElement;
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    setter?.call(field, SENTENCE);
    field.dispatchEvent(new Event("input", { bubbles: true }));
    await flushAsync();
    field.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, isComposing: true }));
    await flushAsync();
    expect(reviewsOf("dup-card").length).toBe(0);
    page.unmount();
  });
});

describe("RV6-d 完成页计数与真实行为一致", () => {
  beforeEach(() => resetStorage());

  it("2 张卡都一次答对：完成页说「2 张一次到位，0 张还需要再见几次」", async () => {
    const data = seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "c0",
          sentence: "I am Xiaomei.",
          sourceId: "lesson:a",
          schedule: { reviewCount: 0, nextReviewAt: PAST_ISO, intervalDays: 1 }
        }),
        makeSentenceCard({
          id: "c1",
          sentence: "He is my brother.",
          sourceId: "lesson:b",
          schedule: { reviewCount: 1, nextReviewAt: PAST_ISO, intervalDays: 1 }
        })
      ])
    );
    const plan = planReviewSession(data);
    const page = mountReview();
    for (const step of plan.steps) {
      if (step.mode === "cloze") {
        allButtons(page).find((item) => item.textContent?.trim() === step.answer)?.click();
      } else if (step.mode === "rebuild") {
        for (const token of step.tokens) {
          allButtons(page).find((item) => !item.disabled && item.textContent?.trim() === token)?.click();
          await flushAsync();
        }
      }
      await flushAsync();
      allButtons(page).find((item) => /^(下一张|完成复习)$/.test((item.textContent ?? "").trim()))?.click();
      await flushAsync();
    }
    expect(page.has("复习完成")).toBe(true);
    expect(page.text()).toContain("2 张一次到位");
    expect(page.text()).toContain("0 张还需要再见几次");
    // 数据侧一致：2 条 review，都是 rating 4
    const reviews = readAppData().reviews;
    expect(reviews.length).toBe(2);
    expect(reviews.every((item) => item.rating === 4)).toBe(true);
    page.unmount();
  });

  it("先错后对 + 看答案：完成页计数与落库 rating 一致（1 张一次到位 / 1 张还需再见）", async () => {
    const data = seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "c0",
          sentence: "I am Xiaomei.",
          sourceId: "lesson:a",
          schedule: { reviewCount: 0, nextReviewAt: PAST_ISO, intervalDays: 1 }
        }),
        makeSentenceCard({
          id: "c1",
          sentence: "He is my brother.",
          sourceId: "lesson:b",
          schedule: { reviewCount: 1, nextReviewAt: PAST_ISO, intervalDays: 1 }
        })
      ])
    );
    const plan = planReviewSession(data);
    const page = mountReview();

    // 第 1 张：直接答对
    const first = plan.steps[0];
    if (first.mode === "cloze") {
      allButtons(page).find((item) => item.textContent?.trim() === first.answer)?.click();
    } else {
      for (const token of (first as { tokens: string[] }).tokens) {
        allButtons(page).find((item) => !item.disabled && item.textContent?.trim() === token)?.click();
        await flushAsync();
      }
    }
    await flushAsync();
    allButtons(page).find((item) => /^(下一张|完成复习)$/.test((item.textContent ?? "").trim()))?.click();
    await flushAsync();

    // 第 2 张：先按打乱顺序拼满（错误作答）再点看答案。
    // 注意：rebuild 的 attempts 只在「拼满一整句」时 +1，点单个词块不产生作答记录，
    // 所以「看答案」按钮也要拼满后才出现（这一点本身是合理的，记录为验证结论）。
    const second = plan.steps[1];
    if (second.mode === "cloze") {
      allButtons(page)
        .find((item) => !item.disabled && item.textContent?.trim() !== second.answer)?.click();
      await flushAsync();
    } else {
      // 拼满：按词块库当前顺序全部点一遍（打乱顺序 = 错误词序）
      const bankTexts = allButtons(page)
        .filter((item) => !item.disabled && item.className.includes("lesson-chip"))
        .map((item) => (item.textContent ?? "").trim());
      for (const token of bankTexts) {
        allButtons(page)
          .filter((item) => !item.disabled && item.className.includes("lesson-chip"))
          .find((item) => (item.textContent ?? "").trim() === token)
          ?.click();
        await flushAsync();
      }
      // 若打乱顺序恰好正确（极小概率），点掉重建区再乱序一次
      if (!allButtons(page).some((item) => (item.textContent ?? "").includes("看答案"))) {
        for (let guard = 0; guard < 20; guard += 1) {
          const chip = allButtons(page).find(
            (item) => !item.disabled && item.className.includes("lesson-chip built")
          );
          if (!chip) break;
          chip.click();
          await flushAsync();
        }
        for (const token of bankTexts.slice().reverse()) {
          allButtons(page)
            .filter((item) => !item.disabled && item.className.includes("lesson-chip"))
            .find((item) => (item.textContent ?? "").trim() === token)
            ?.click();
          await flushAsync();
        }
      }
    }
    await flushAsync();
    allButtons(page).find((item) => (item.textContent ?? "").includes("看答案"))?.click();
    await flushAsync();

    expect(page.has("复习完成") || page.has("完成复习")).toBe(true);
    allButtons(page).find((item) => /完成复习/.test((item.textContent ?? "").trim()))?.click();
    await flushAsync();

    expect(page.text()).toContain("1 张一次到位");
    expect(page.text()).toContain("1 张还需要再见几次");
    const reviews = readAppData().reviews;
    expect(reviews.map((item) => item.rating).sort()).toEqual([1, 4]);
    page.unmount();
  });
});
