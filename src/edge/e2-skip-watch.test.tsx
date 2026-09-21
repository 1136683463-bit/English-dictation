// @vitest-environment jsdom
/**
 * E2 · 跳过讲解
 *
 * 课程页的「跳过」类出口：
 * - 前测全对（且非首课）→ 结果页的「直接去练习」
 * - 「看」段第 3 步（变奏）底部 →「已会，直接去练习」
 * 首课（isFirstEverLesson：L1 且未完成任何课）走「去讲解里揭晓」导览，不给快进。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "./harness";
import GrammarLessonPage from "../pages/GrammarLessonPage";
import {
  answerArrangeCorrectly,
  answerPretest,
  builtWords,
  clickEl,
  finishPractice,
  inSection,
  lessonOf,
  sectionLabels,
  markLessonsDoneInStorage,
  readAppData
} from "./lessonFlow";

const LESSON = "lesson-03-have";

const mount = (lessonId = LESSON) =>
  mountPage(<GrammarLessonPage />, `/grammar/lesson/${lessonId}`, "/grammar/lesson/:lessonId");

/** 预置「已完成 L1」，让本课不是首课。 */
const warmStorage = () => {
  const warm = mount("lesson-01-am");
  warm.unmount();
  markLessonsDoneInStorage(["lesson-01-am"]);
};

describe("E2 · 跳过讲解", () => {
  beforeEach(() => resetStorage());

  it("E2-1 前测全对后出现「直接去练习」，点击后练习段立即可做且判分正常", () => {
    warmStorage();
    const page = mount();
    answerPretest(page, LESSON, true);

    expect(page.buttons().includes("直接去练习"), "前测全对应有跳过出口").toBe(true);
    page.click("直接去练习");

    expect(page.has("第 1 / "), "应停在练习段第 1 题").toBe(true);
    expect(page.container.querySelector(".lesson-bank")).not.toBeNull();

    const answer = lessonOf(LESSON).practice[0].answer;

    // 反例先行：只摆一个词 → 一定判不出（不放行）
    const chips = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-bank button.lesson-chip"));
    clickEl(chips[0]);
    expect(builtWords(page).length).toBe(1);
    expect(page.container.querySelector(".lesson-feedback.pass"), "未答完不应放行").toBeNull();

    // 正解 → 判分正常放行
    expect(answerArrangeCorrectly(page, answer), "跳过讲解后仍应能拼出正解").toBe(true);
    expect(page.container.querySelector(".lesson-feedback.pass"), "跳过讲解后判分应正常").not.toBeNull();
    page.unmount();
  });

  it("E2-2 「看」段底部的「已会，直接去练习」仅在非首课 + 前测全对 + 第 3 步出现", () => {
    warmStorage();
    const page = mount();
    answerPretest(page, LESSON, true);
    page.click("先过一遍讲解");
    expect(page.has("情景讲解")).toBe(true);

    // 第 1 步（剧场）不应有快进出口
    expect(page.buttons().includes("已会，直接去练习"), "第 1 步不该有快进出口").toBe(false);
    page.click("下一步：搭装与对错");
    expect(page.buttons().includes("已会，直接去练习"), "第 2 步不该有快进出口").toBe(false);
    page.click("下一步：变奏");
    expect(page.buttons().includes("已会，直接去练习"), "第 3 步应给快进出口").toBe(true);

    page.click("已会，直接去练习");
    expect(page.has("第 1 / ")).toBe(true);
    page.unmount();
  });

  it("E2-3 前测答错时不给任何跳过出口（跳过以「已会」为前提）", () => {
    warmStorage();
    const page = mount();
    answerPretest(page, LESSON, false);

    expect(page.buttons().includes("直接去练习"), "答错时不应出现跳过出口").toBe(false);
    expect(page.buttons().includes("开始上课"), "答错时应走「开始上课」").toBe(true);

    page.click("开始上课");
    page.click("下一步：搭装与对错");
    page.click("下一步：变奏");
    expect(page.buttons().includes("已会，直接去练习"), "答错后讲解段不应给快进出口").toBe(false);
    page.unmount();
  });

  it("E2-4 首课（零基础）不给「直接去练习」，走「去讲解里揭晓」导览", () => {
    const page = mount("lesson-01-am"); // 未完成任何课 = 首课导览态
    expect(page.has("先看看今天要避免的误读")).toBe(true);
    expect(page.buttons().includes("直接去练习")).toBe(false);
    expect(page.buttons().includes("去讲解里揭晓")).toBe(true);

    page.click("去讲解里揭晓");
    expect(page.has("情景讲解")).toBe(true);
    page.click("下一步：搭装与对错");
    page.click("下一步：变奏");
    expect(page.buttons().includes("已会，直接去练习"), "首课即使前测全对也不给快进").toBe(false);
    page.unmount();
  });

  it("E2-5 跳过讲解后一路做对：练习段可完成，产出前不写完成态", () => {
    warmStorage();
    const page = mount();
    answerPretest(page, LESSON, true);
    page.click("直接去练习");

    finishPractice(page, LESSON);
    expect(inSection(page, "说出来"), `应进入产出段，实际段: ${sectionLabels(page).join(",")}`).toBe(true);
    expect(readAppData().grammarLessonsDone.includes(LESSON), "产出未完成不应写完成态").toBe(false);
    page.unmount();
  });
});
