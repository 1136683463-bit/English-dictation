// @vitest-environment jsdom
/**
 * E7 · 无案课（空侦探页回归）
 *
 * 2026-09-23 实测确认的 P0：全库 5 课（第 2/3/5/6/8 课）`huntCaseIds: []`。
 * 数据侧的「不配案」是刻意的（huntCases.ts 决策⑤：番外案配给第一季基础课会越级撞墙），
 * 但页面侧从来没有为此设出口：
 *
 *   1. 段标恒为「④/⑤ 破」，与其余 200 课毫无区别；
 *   2. 完课即无条件 `gotoStage("challenge")`；
 *   3. 挑战段无条件渲染「这一课学会了，正好用它去帮侦探找到对应的语法漏洞」
 *      +「挑战不计时、不扣分」，然后 `huntCaseIds.map()` 对空数组渲染空列表。
 *
 * 于是按顺序学的用户在第 2 课完课那一刻，被送到一个**承诺了挑战、却什么都没有**的页面。
 *
 * 本文件用 L2（`lesson-02-is`，无案 + 有 recall）走完整课，验证：
 * 段标无「破」、完课后不落到挑战段、收据仍在（不能被修得连收据都没了）、
 * 挑战段的假承诺文案一句都不出现。
 *
 * 对照：L13（`lesson-13-now`，有案）走同一路径时必须**仍然**进挑战段——
 * 防止「修空态」把有案的 200 课一起改坏。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "./harness";
import GrammarLessonPage from "../pages/GrammarLessonPage";
import {
  answerPretest,
  finishGuided,
  finishOutput,
  finishPractice,
  flushData,
  inSection,
  lessonOf,
  markLessonsDoneInStorage,
  sectionLabels,
  typeInto,
  type Mounted
} from "./lessonFlow";
import { grammarLessons } from "../data/grammarLessons";

/** 决策⑤点名的 5 课——全部走一遍，不只样本。 */
const NO_CASE_LESSON_IDS = ["lesson-02-is", "lesson-03-have", "lesson-05-like", "lesson-06-it", "lesson-08-my"];
/** 对照组：有案课的样本。 */
const WITH_CASE_LESSON = "lesson-13-now";

const mount = (lessonId: string) =>
  mountPage(<GrammarLessonPage />, `/grammar/lesson/${lessonId}`, "/grammar/lesson/:lessonId");

const warmStorage = () => {
  const warm = mount("lesson-01-am");
  warm.unmount();
  markLessonsDoneInStorage(["lesson-01-am"]);
};

/** 从课前测一路做完整课，停在收据页。 */
const completeLesson = (page: Mounted, lessonId: string) => {
  answerPretest(page, lessonId, true);
  page.click("直接去练习");
  // 从练习段折回讲解（练习第 1 题未答，不产生续学快照）
  page.click("回去再看一遍讲解");
  page.click("下一步：搭装与对错");
  page.click("下一步：变奏");
  page.click("看懂了，试一试");
  finishGuided(page, lessonId);

  const lesson = lessonOf(lessonId);
  if (lesson.recall) {
    typeInto(page, lesson.recall.answer);
    page.click("提交");
    page.click("进入练习");
  }
  finishPractice(page, lessonId);
  finishOutput(page);
};

/** 段标圆点数量（顶栏 .lesson-stage-dots 里的 span）。 */
const stageDotCount = (page: Mounted): number =>
  page.container.querySelectorAll(".lesson-stage-dots span").length;

describe("E7 · 无案课不该出现「空侦探页」", () => {
  beforeEach(() => resetStorage());

  it("E7-1 前提：5 课确实没有关联案件（若数据补齐，本文件需重写）", () => {
    for (const lessonId of NO_CASE_LESSON_IDS) {
      expect(lessonOf(lessonId).huntCaseIds, `${lessonId} 应无案（决策⑤）`).toEqual([]);
    }
    expect(lessonOf(WITH_CASE_LESSON).huntCaseIds.length, "L13 应有案（对照组）").toBeGreaterThan(0);
  });

  it("E7-2 无案课的段标摘掉「破」段，有案课保留", () => {
    for (const lessonId of NO_CASE_LESSON_IDS) {
      const lesson = lessonOf(lessonId);
      const page = mount(lessonId);
      // 这 5 课都有 recall：应为 4 段（看/跟/忆/练），而非有案时的 5 段
      expect(stageDotCount(page), `${lessonId}（L${lesson.number}）应为 4 段（无破段）`).toBe(4);
      page.unmount();
    }

    const withCase = mount(WITH_CASE_LESSON);
    expect(stageDotCount(withCase), "L13 应为 5 段（含破段）").toBe(5);
    withCase.unmount();
  });

  it("E7-3 无案课走完整课：收据出现，且不落到挑战段", async () => {
    warmStorage();
    // 用 L2 走全流程（L2 之后各课的完课路径与它同构，段标已由 E7-2 逐课验证）
    const lessonId = NO_CASE_LESSON_IDS[0];
    const page = mount(lessonId);
    completeLesson(page, lessonId);
    await flushData();

    expect(inSection(page, "侦探挑战"), `不该进挑战段，实际段位：${sectionLabels(page).join(",")}`).toBe(false);
    expect(page.has(`第 ${lessonOf(lessonId).number} 课完成`), "收据必须仍在（修空态不能把收据也修没）").toBe(true);
    // 收据页的「下一课」链接文案带课名：`下一课：第 3 课 · 我有一个背包`
    expect(page.has("下一课：第 3 课"), "无案时「下一课」应直接出现在收据页").toBe(true);
    page.unmount();
  });

  it("E7-4 无案课全程不出现挑战段的假承诺文案", async () => {
    warmStorage();
    const lessonId = NO_CASE_LESSON_IDS[0];
    const page = mount(lessonId);
    completeLesson(page, lessonId);
    await flushData();

    const html = page.container.textContent ?? "";
    for (const promise of [
      "这一课学会了，正好用它去帮侦探找到对应的语法漏洞",
      "挑战不计时、不扣分",
      "去破这一案",
      "去破案之前"
    ]) {
      expect(html, `不该出现假承诺文案「${promise}」`).not.toContain(promise);
    }
    page.unmount();
  });

  it("E7-5 无案课完课后不留「继续刚才」（完课即不可续学）", async () => {
    warmStorage();
    const lessonId = NO_CASE_LESSON_IDS[0];
    const page = mount(lessonId);
    completeLesson(page, lessonId);
    await flushData();

    expect(
      window.localStorage.getItem(`grammar:resume:${lessonId}`),
      "完课应清快照，且完课那一刻不能再写回一份"
    ).toBeNull();
    page.unmount();
  });

  it("E7-6 对照组：有案课走同一路径仍然进挑战段（修空态没有误伤 200 课）", async () => {
    warmStorage();
    const page = mount(WITH_CASE_LESSON);
    completeLesson(page, WITH_CASE_LESSON);
    await flushData();

    expect(inSection(page, "侦探挑战"), `L13 应进挑战段，实际段位：${sectionLabels(page).join(",")}`).toBe(true);
    expect(page.has("去破这一案"), "有案课应给出案件入口").toBe(true);
    page.unmount();
  });

  it("E7-7 数据契约：无案课恰好是决策⑤点名的 5 课（数量增长即需重新评估展示侧）", () => {
    const noCase = grammarLessons
      .filter((lesson) => (lesson.huntCaseIds?.length ?? 0) === 0)
      .map((lesson) => lesson.number)
      .sort((a, b) => a - b);
    expect(noCase).toEqual([2, 3, 5, 6, 8]);
  });
});
