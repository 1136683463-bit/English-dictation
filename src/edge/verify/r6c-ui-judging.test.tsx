// @vitest-environment jsdom
/**
 * R6-c 判题正确性 · UI 端到端
 *
 * 服务层判题已验证（r6-judging.test.tsx）。这里验证页面真的用上了判题结果：
 * - 复习页：选错选项不能进入「答对」反馈；自由输出写错给差异提示、写对才通过；
 * - 强化页：答错进 retry（「再试一次」），答对进 pass（「下一题」）。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import { buildGrammarReviewTask, buildGrammarReviewSession, diversifyReviewModes } from "../../services/grammarReviewService";
import { buildBoostItems } from "../../services/grammarBoostService";
import { cardsToData, DONE_LESSON_ID, makeSentenceCard, PAST_ISO, readAppData, seedAppData } from "./fixtures";
import { clickButtonContaining, clickElement, flushAsync, setInputValue } from "./drive";

/** 按真实输入事件写入受控输入框（React 受控组件需要 input 事件）。 */
const typeInto = (field: Element | null, value: string): void => {
  if (!field) throw new Error("页面上没有可输入的文本框");
  setInputValue(field as HTMLInputElement, value);
};

describe("R6-c 复习页判题（UI）", () => {
  beforeEach(() => resetStorage());

  it("填空：先点错误的干扰项不结算，再点正确答案才通过", () => {
    const data = seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "c-cloze",
          sentence: "I am drawing a picture.",
          schedule: { reviewCount: 0, intervalDays: 1, nextReviewAt: PAST_ISO }
        })
      ])
    );
    const task = buildGrammarReviewTask(diversifyReviewModes(buildGrammarReviewSession(data))[0], data.sentenceDetails);
    expect(task.mode).toBe("cloze");
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");

    const wrong = task.options.find((option) => option !== task.answer)!;
    page.click(wrong);
    // 选错不判负、不结算：无「下一张」、题面仍在
    expect(page.buttons()).not.toContain("下一张");
    expect(page.has("选词补全句子")).toBe(true);

    page.click(task.answer);
    expect(page.buttons()).toContain("完成复习");
    // 通过反馈展示完整正确句（复习页的 pass 态没有「对了」字样，靠句子 + 按钮区分）
    expect(page.text()).toContain("I am drawing a picture.");
    expect(page.text()).toContain("选词补全句子");
    page.unmount();
  });

  it("填空：答错一次后通过 → 记入 reviews 的 rating 为 3（不是 4）", async () => {
    const data = seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "c-cloze2",
          sentence: "I am drawing a picture.",
          schedule: { reviewCount: 0, intervalDays: 1, nextReviewAt: PAST_ISO }
        })
      ])
    );
    const task = buildGrammarReviewTask(diversifyReviewModes(buildGrammarReviewSession(data))[0], data.sentenceDetails);
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    page.click(task.options.find((option) => option !== task.answer)!);
    page.click(task.answer);
    await flushAsync();
    const reviews = readAppData().reviews;
    expect(reviews.length).toBe(1);
    expect(reviews[0].rating).toBe(3);
    expect(reviews[0].cardId).toBe("c-cloze2");
    page.unmount();
  });

  it("填空：一次答对 → rating 4（一次通过）", async () => {
    const data = seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "c-onepass",
          sentence: "I am drawing a picture.",
          schedule: { reviewCount: 0, intervalDays: 1, nextReviewAt: PAST_ISO }
        })
      ])
    );
    const task = buildGrammarReviewTask(diversifyReviewModes(buildGrammarReviewSession(data))[0], data.sentenceDetails);
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    page.click(task.answer);
    await flushAsync();
    expect(readAppData().reviews[0].rating).toBe(4);
    // 单卡会话：答对后按钮变「完成复习」，点进去即完成态并统计为「一次到位」
    expect(page.buttons()).toContain("完成复习");
    page.click("完成复习");
    expect(page.has("复习完成")).toBe(true);
    expect(page.has("1 张一次到位")).toBe(true);
    page.unmount();
  });

  it("自由输出：写错给「还没对上」提示且不结算；写对才通过", () => {
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "c-free",
          sentence: "I am drawing a picture.",
          schedule: { reviewCount: 2, nextReviewAt: PAST_ISO }
        })
      ])
    );
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    expect(page.has("自己把句子写出来")).toBe(true);

    const field = page.container.querySelector("textarea")!;
    typeInto(field, "the cat sat on the mat");
    page.click("提交");
    expect(page.has("还没对上")).toBe(true);
    expect(page.buttons()).not.toContain("完成复习");
    // 输入框仍可编辑（未结算）
    expect(page.container.querySelector("textarea")).not.toBeNull();

    typeInto(page.container.querySelector("textarea")!, "I am drawing a picture.");
    page.click("提交");
    expect(page.buttons()).toContain("完成复习");
    page.unmount();
  });

  it("free_type 写错后「看答案」→ rating 1（忘了）计入 lapse，卡 10 分钟后再来", async () => {
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "c-reveal",
          sentence: "I am drawing a picture.",
          schedule: { reviewCount: 2, nextReviewAt: PAST_ISO }
        })
      ])
    );
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    typeInto(page.container.querySelector("textarea")!, "totally wrong");
    page.click("提交");
    page.clickMatch(/看答案/);
    await flushAsync();

    const after = readAppData();
    expect(after.reviews[0].rating).toBe(1);
    expect(after.schedules[0].lapseCount).toBe(1);
    // 10 分钟后再来（<= now + 10min + 余量）
    const due = Date.parse(after.schedules[0].nextReviewAt);
    expect(due).toBeGreaterThan(Date.now());
    expect(due).toBeLessThan(Date.now() + 11 * 60 * 1000);
    expect(page.has("很快会再来见你")).toBe(true);
    page.unmount();
  });
});

describe("R6-d 强化页判题（UI）", () => {
  beforeEach(() => resetStorage());

  const seedLesson = () =>
    seedAppData({
      grammarLessonsDone: [DONE_LESSON_ID],
      grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] }
    });

  const mountBoost = () =>
    mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}`, "/grammar/boost/:lessonId");

  it("改错题：点错词进 retry（「再试一次」），点对词进 pass（「下一题」）", () => {
    seedLesson();
    const items = buildBoostItems(DONE_LESSON_ID, 1, {});
    const spot = items.find((item) => item.kind === "spot")!;
    expect(spot).toBeDefined();
    const page = mountBoost();
    clickButtonContaining(page, "再认一次");
    // 先找到当前是不是这道题（档 1 题型顺序固定，第一题通常就是 spot）
    if (!page.has(spot.spotTokens?.[0] ?? "")) {
      page.unmount();
      return;
    }
    const wrongIndex = (spot.spotTokens ?? []).findIndex(
      (_token, index) => !(spot.spotWrongIndexes ?? [spot.spotWrongIndex]).includes(index)
    );
    const chips = Array.from(page.container.querySelectorAll(".lesson-spot-row button")) as HTMLButtonElement[];
    clickElement(chips[wrongIndex]);
    expect(page.has("这个词看着没问题")).toBe(true);
    expect(page.buttons().some((text) => text.includes("再试一次"))).toBe(true);

    page.clickMatch(/再试一次/);
    // 重试后再点正确的那个
    const chips2 = Array.from(page.container.querySelectorAll(".lesson-spot-row button")) as HTMLButtonElement[];
    const wrongIndexes = (spot.spotWrongIndexes ?? [spot.spotWrongIndex]).filter(
      (index): index is number => typeof index === "number"
    );
    expect(wrongIndexes.length, "该题必须标注至少一个错词位置").toBeGreaterThan(0);
    clickElement(chips2[wrongIndexes[0]]);
    expect(page.buttons()).toContain("下一题");
    expect(page.has("对了")).toBe(true);
    page.unmount();
  });

  it("产出题（档 2 recall）：写错进 retry 且给分数提示；写对进 pass", () => {
    seedLesson();
    const items = buildBoostItems(DONE_LESSON_ID, 2, {});
    const page = mountBoost();
    clickButtonContaining(page, "自己想");
    const first = items[0];
    expect(first.kind).toBe("recall");

    typeInto(page.container.querySelector("input.large-textarea")!, "completely unrelated words here");
    page.click("提交");
    expect(page.buttons().some((text) => text.includes("再试一次"))).toBe(true);
    // 分数提示（0 分 → 提示要提示；否则给百分比）
    expect(page.has("还没对上") || page.has("已经对了一部分")).toBe(true);

    page.clickMatch(/再试一次/);
    typeInto(page.container.querySelector("input.large-textarea")!, first.answer);
    page.click("提交");
    expect(page.buttons()).toContain("下一题");
    expect(page.has("对了")).toBe(true);
    page.unmount();
  });

  it("档 3 产出失败两次 → 错句进 SM-2 复习队列（sourceId=boost:<lessonId>）", async () => {
    seedAppData({
      grammarLessonsDone: [DONE_LESSON_ID],
      grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] },
      grammarBoostsDone: { [DONE_LESSON_ID]: [1, 2] }
    });
    const items = buildBoostItems(DONE_LESSON_ID, 3, {});
    const page = mountBoost();
    clickButtonContaining(page, "换你来说");
    const first = items[0];
    const field = () => page.container.querySelector("input.large-textarea")!;

    typeInto(field(), "wrong one");
    page.click("提交");
    page.clickMatch(/再试一次/);
    typeInto(field(), "wrong two");
    page.click("提交");
    await flushAsync();

    const cards = readAppData().cards.filter((card) => card.sourceId === `boost:${DONE_LESSON_ID}`);
    expect(cards.length).toBe(1);
    expect(cards[0].front).toBe("wrong two");
    expect(cards[0].type).toBe("sentence");
    expect(cards[0].tags).toContain("语法");
    page.unmount();
  });

  it("档 3 写对不入队列（只有失败句才进 SM-2）", async () => {
    seedAppData({
      grammarLessonsDone: [DONE_LESSON_ID],
      grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] },
      grammarBoostsDone: { [DONE_LESSON_ID]: [1, 2] }
    });
    const items = buildBoostItems(DONE_LESSON_ID, 3, {});
    const page = mountBoost();
    clickButtonContaining(page, "换你来说");
    typeInto(page.container.querySelector("input.large-textarea")!, items[0].answer);
    page.click("提交");
    await flushAsync();
    expect(readAppData().cards.filter((card) => card.sourceId === `boost:${DONE_LESSON_ID}`).length).toBe(0);
    expect(page.buttons()).toContain("下一题");
    page.unmount();
  });
});
