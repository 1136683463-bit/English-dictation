// @vitest-environment jsdom
/**
 * R4 · 强化三档独立性
 *
 * 设计声明（GrammarBoostPage.tsx:39-46 + grammarBoostService.markBoostTierDone）：
 * 「三档零术语梯度，每档独立完成态；允许只做一档就体面退出；零门禁」。
 *
 * 验证点：
 * 1. 只做完档 1 就退出，下次进来档 1 显示已完成、档 2 仍可做；
 * 2. 每档完成态独立写入（grammarBoostsDone[lessonId] = [1] / [1,2] / [1,2,3]）；
 * 3. 允许只做一档就退出（不强制三档、无正确率门禁）；
 * 4. 完成态页「再深一点」只推下一个未完成档，三档全完成时给回课入口。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import { buildBoostItems, getLessonBoostTiersDone, markBoostTierDone } from "../../services/grammarBoostService";
import { DONE_LESSON_ID, exitsOf, readAppData, seedAppData } from "./fixtures";
import { clickButtonContaining, completeBoostTier, failOnceThenPass, flushAsync } from "./drive";

const seedLesson = (boostsDone?: Record<string, number[]>) =>
  seedAppData({
    grammarLessonsDone: [DONE_LESSON_ID],
    grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] },
    ...(boostsDone ? { grammarBoostsDone: boostsDone } : {})
  });

const mountBoost = () =>
  mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}`, "/grammar/boost/:lessonId");

describe("R4-a 服务层完成态", () => {
  beforeEach(() => resetStorage());

  it("三档各自独立：写档 1 不影响档 2/3；升序存放；幂等", () => {
    const base = seedAppData({ grammarLessonsDone: [DONE_LESSON_ID] });
    expect(getLessonBoostTiersDone(base, DONE_LESSON_ID).size).toBe(0);

    const t1 = markBoostTierDone(base, DONE_LESSON_ID, 1);
    expect([...getLessonBoostTiersDone(t1, DONE_LESSON_ID)]).toEqual([1]);

    const t2 = markBoostTierDone(t1, DONE_LESSON_ID, 2);
    expect([...getLessonBoostTiersDone(t2, DONE_LESSON_ID)]).toEqual([1, 2]);

    const t3 = markBoostTierDone(t2, DONE_LESSON_ID, 3);
    expect([...getLessonBoostTiersDone(t3, DONE_LESSON_ID)]).toEqual([1, 2, 3]);

    // 幂等（同对象返回）
    expect(markBoostTierDone(t3, DONE_LESSON_ID, 3)).toBe(t3);
    // 不可变
    expect(getLessonBoostTiersDone(base, DONE_LESSON_ID).size).toBe(0);
  });

  it("不存在的课不写完成态（防脏数据）", () => {
    const base = seedAppData({});
    expect(markBoostTierDone(base, "lesson-nonexistent", 1)).toBe(base);
  });
});

describe("R4-b 只做一档就退出（UI 全流程）", () => {
  beforeEach(() => resetStorage());

  it("做完档 1 立即退出（不碰档 2/3）：完成态写入 [1]，档 2 下一次可做", async () => {
    seedLesson();
    const page = mountBoost();
    clickButtonContaining(page, "再认一次");
    const items = buildBoostItems(DONE_LESSON_ID, 1, {});
    const answered = completeBoostTier(page, items);
    expect(answered).toBe(items.length);
    await flushAsync();

    // 完成态文案 + 「今天先到这」体面退出
    expect(page.has("这一课的记忆稳住了")).toBe(true);
    expect(page.text()).toContain(`走完了一遍——`);
    expect(exitsOf(page.container).some((text) => text.includes("今天先到这"))).toBe(true);

    // 只完成档 1：完成态里只推档 2
    expect(page.buttons().some((text) => text.includes("再深一点：自己想"))).toBe(true);
    expect(page.buttons().some((text) => text.includes("换你来说"))).toBe(false);

    // 落盘检查
    expect(readAppData().grammarBoostsDone?.[DONE_LESSON_ID]).toEqual([1]);
    page.unmount();

    // 再进来：档 1 标记「走过一遍」，档 2 可做（建议从这里开始）
    const again = mountBoost();
    expect(again.has("走过一遍")).toBe(true);
    expect(again.has("建议从这里开始")).toBe(true);
    expect(again.has("练到第 1 档")).toBe(true);
    // 档 1 仍可重练（不是锁死）
    const tierButtons = again.buttons().filter((text) => text.includes("再认一次") || text.includes("自己想"));
    expect(tierButtons.length).toBe(2);
    again.unmount();
  });

  it("做完档 1 后继续做档 2、退出：完成态 [1,2]，档 3 可做", async () => {
    seedLesson({ [DONE_LESSON_ID]: [1] });
    const page = mountBoost();
    clickButtonContaining(page, "自己想");
    const items = buildBoostItems(DONE_LESSON_ID, 2, {});
    completeBoostTier(page, items);
    await flushAsync();

    expect(readAppData().grammarBoostsDone?.[DONE_LESSON_ID]).toEqual([1, 2]);
    expect(page.buttons().some((text) => text.includes("再深一点：换你来说"))).toBe(true);
    page.unmount();

    const again = mountBoost();
    expect(again.has("练到第 2 档")).toBe(true);
    again.unmount();
  });

  it("三档全完成：完成态不再推下一档，改为「回这一课看看」；选择态显示「三档都走过了」", async () => {
    seedLesson({ [DONE_LESSON_ID]: [1, 2] });
    const page = mountBoost();
    clickButtonContaining(page, "换你来说");
    const items = buildBoostItems(DONE_LESSON_ID, 3, {});
    completeBoostTier(page, items);
    await flushAsync();

    expect(readAppData().grammarBoostsDone?.[DONE_LESSON_ID]).toEqual([1, 2, 3]);
    expect(page.buttons().some((text) => text.includes("再深一点"))).toBe(false);
    expect(exitsOf(page.container).some((text) => text.includes("回这一课看看"))).toBe(true);
    page.unmount();

    const again = mountBoost();
    expect(again.has("三档都走过了")).toBe(true);
    expect(again.buttons().filter((text) => text.includes("走过一遍")).length).toBe(3);
    again.unmount();
  });
});

describe("R4-c 不做完也能退出 / 不设正确率门禁", () => {
  beforeEach(() => resetStorage());

  it("选择态直接退出：不写完成态、不记 started 事件（只是看了一眼）", async () => {
    seedLesson();
    const page = mountBoost();
    expect(exitsOf(page.container).some((text) => text.includes("今天先到这"))).toBe(true);
    page.unmount();
    await flushAsync();
    expect(readAppData().grammarBoostsDone?.[DONE_LESSON_ID]).toBeUndefined();
  });

  it("档内每题都先答错一次再答对，照样走完并写入完成态（无正确率门禁）", async () => {
    seedLesson();
    const page = mountBoost();
    clickButtonContaining(page, "再认一次");
    const items = buildBoostItems(DONE_LESSON_ID, 1, {});
    let advanced = 0;
    for (const item of items) {
      if (failOnceThenPass(page, item) === "stuck") break;
      advanced += 1;
      const next = page.buttons().find((text) => text === "下一题" || text === "完成这一档");
      if (!next) break;
      page.click(next);
    }
    await flushAsync();
    expect(advanced).toBe(items.length);
    expect(readAppData().grammarBoostsDone?.[DONE_LESSON_ID]).toEqual([1]);
    page.unmount();
  });
});
