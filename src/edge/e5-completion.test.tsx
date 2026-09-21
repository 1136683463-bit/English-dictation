// @vitest-environment jsdom
/**
 * E5 · 完课后的收据页
 *
 * 用 L13（有 recall + huntCaseIds）走完整课：前测 → 讲解 → 跟 → 忆 → 练 → 产 → 收据。
 * 关注：收据内容、下一课入口、完成态与复习队列写入、重复完课的幂等。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "./harness";
import GrammarLessonPage from "../pages/GrammarLessonPage";
import {
  answerPretest,
  clickEl,
  finishGuided,
  finishOutput,
  finishPractice,
  flushData,
  inSection,
  lessonOf,
  markLessonsDoneInStorage,
  readAppData,
  sectionLabels,
  sentenceCards,
  textareaValue,
  typeInto,
  type Mounted
} from "./lessonFlow";
import { getFollowingLesson, markLessonDone, addLessonCoreSentence } from "../services/lessonService";
import { loadData, saveData } from "../services/storage";

const LESSON = "lesson-13-now";

const mount = (lessonId = LESSON) =>
  mountPage(<GrammarLessonPage />, `/grammar/lesson/${lessonId}`, "/grammar/lesson/:lessonId");

const warmStorage = () => {
  const warm = mount("lesson-01-am");
  warm.unmount();
  markLessonsDoneInStorage(["lesson-01-am"]);
};

/** 从课前测一路做完整课，停在收据页。 */
const completeLesson = (page: Mounted) => {
  answerPretest(page, LESSON, true);
  page.click("直接去练习");
  // 从练习段折回讲解（练习第 1 题未答，不产生续学快照）
  page.click("回去再看一遍讲解");
  page.click("下一步：搭装与对错");
  page.click("下一步：变奏");
  page.click("看懂了，试一试");
  finishGuided(page, LESSON);

  const lesson = lessonOf(LESSON);
  if (lesson.recall) {
    typeInto(page, lesson.recall.answer);
    page.click("提交");
    page.click("进入练习");
  }
  finishPractice(page, LESSON);
  finishOutput(page);
};

describe("E5 · 完课后的收据页", () => {
  beforeEach(() => resetStorage());

  it("E5-1 走完整课：收据页出现，含三块内容与「还差什么/复习队列」提示", async () => {
    warmStorage();
    const page = mount();
    completeLesson(page);
    await flushData();

    expect(inSection(page, "课程完成"), `应有完课收据，实际段: ${sectionLabels(page).join(",")}`).toBe(true);
    expect(page.has(`第 ${lessonOf(LESSON).number} 课完成`)).toBe(true);
    expect(page.has("这一课掌握了什么"), "收据应有「掌握了什么」").toBe(true);
    expect(page.has("你现在能说出这些新句子"), "收据应有「能说出的句子」").toBe(true);
    expect(page.has("还差什么"), "收据应有「还差什么」").toBe(true);
    expect(page.has("上面这些句子已排进复习队列"), "收据应说明入队").toBe(true);
    // 收据里的句子与课程数据一致
    expect(page.has(lessonOf(LESSON).targetSentence)).toBe(true);
    page.unmount();
  });

  it("E5-2 收据页有「下一课」入口，指向按编号的下一课（L14）", () => {
    warmStorage();
    const page = mount();
    completeLesson(page);

    const following = getFollowingLesson(LESSON);
    expect(following, "L13 之后应有 L14").not.toBeNull();
    const label = `下一课：第 ${following?.number} 课 · ${following?.title}`;
    // 收据页的「下一课」是 <a>（Link），不在 buttons() 里
    const links = Array.from(page.container.querySelectorAll<HTMLAnchorElement>("a"));
    const nextLink = links.find((a) => (a.textContent ?? "").trim() === label);
    expect(nextLink, `收据页应有「${label}」入口；实际链接：${links
      .map((a) => (a.textContent ?? "").trim())
      .join(" | ")}`).toBeTruthy();
    expect(nextLink?.getAttribute("href")).toBe(`/grammar/lesson/${following?.id}`);
    page.unmount();
  });

  it("E5-3 完课写入 grammarLessonsDone 与 grammarLessonStagesDone（双写），核心句入队", async () => {
    warmStorage();
    const page = mount();
    completeLesson(page);
    await flushData();

    const data = readAppData();
    expect(data.grammarLessonsDone.includes(LESSON), "完课应写入 grammarLessonsDone").toBe(true);
    expect(data.grammarLessonStagesDone[LESSON], "完课应同时写关 1").toEqual([1]);

    const cards = sentenceCards().filter((card) => card.sourceId === `lesson:${LESSON}`);
    expect(cards.length, "核心句应进入句子卡队列").toBeGreaterThan(0);
    expect(cards.some((card) => card.front === lessonOf(LESSON).targetSentence), "本课核心句应在队列里").toBe(true);
    expect(cards[0].tags).toContain("语法");
    page.unmount();
  });

  it("E5-4 完课即清续学快照（这课不再问「继续刚才」）", async () => {
    warmStorage();
    const page = mount();
    completeLesson(page);
    await flushData();

    expect(window.localStorage.getItem(`grammar:resume:${LESSON}`), "完课应清快照").toBeNull();
    page.unmount();

    const again = mount();
    expect(again.has("继续刚才的进度"), "完课后重进不应再问续学").toBe(false);
    // 顶栏只在离开课前测后才换文案（课前测分支优先显示「课前试一试」）
    expect(again.has("趁热练"), "已完课重进应显示趁热练条").toBe(true);
    answerPretest(again, LESSON, true);
    expect(again.buttons().includes("直接去练习")).toBe(true);
    again.click("直接去练习");
    expect(again.has("已完成，可再学一遍"), "离开课前测后顶栏应显示已完成").toBe(true);
    again.unmount();
  });

  it("E5-5 已完课的课重进：显示「趁热练」档位，顶栏在练习段标「已完成」", () => {
    warmStorage();
    markLessonsDoneInStorage(["lesson-01-am", LESSON]);
    const page = mount();
    expect(page.has("趁热练")).toBe(true);
    expect(page.has("再认一次"), "趁热练应列出档位").toBe(true);
    answerPretest(page, LESSON, true);
    page.click("直接去练习");
    expect(page.has("已完成，可再学一遍")).toBe(true);
    page.unmount();
  });

  it("E5-6 markLessonDone 幂等：重复完课不重复写完成态、不重复入队", () => {
    warmStorage();
    const base = loadData();
    const once = markLessonDone(base, LESSON);
    const twice = markLessonDone(once, LESSON);
    expect(twice.grammarLessonsDone.filter((id) => id === LESSON).length, "不应重复写入").toBe(1);
    const cards = twice.cards.filter((card) => card.type === "sentence" && card.sourceId === `lesson:${LESSON}`);
    expect(cards.length, "核心句只应入队一次").toBe(1);

    // 未知课程 id：原样返回（不抛）
    const unknown = markLessonDone(twice, "lesson-does-not-exist");
    expect(unknown.grammarLessonsDone).toEqual(twice.grammarLessonsDone);

    // addLessonCoreSentence 幂等
    const again = addLessonCoreSentence(twice, lessonOf(LESSON));
    expect(again.cards.filter((card) => card.sourceId === `lesson:${LESSON}`).length).toBe(1);
    saveData(base);
  });

  it("E5-7 收据页「趁热再练」指向 boost 页（按课 id + tier=1）", () => {
    warmStorage();
    const page = mount();
    completeLesson(page);
    const links = Array.from(page.container.querySelectorAll<HTMLAnchorElement>("a"));
    const boost = links.find((a) => (a.textContent ?? "").includes("趁热再练"));
    expect(boost, "应有趁热再练入口").toBeTruthy();
    expect(boost?.getAttribute("href")).toContain(`/grammar/boost/${LESSON}`);
    page.unmount();
  });

  it("E5-8 完课后「去挑战」跳转 hunt（带本课 caseId）", () => {
    warmStorage();
    const page = mount();
    completeLesson(page);
    const lesson = lessonOf(LESSON);
    expect(lesson.huntCaseIds.length, "L13 应绑定侦探案件").toBeGreaterThan(0);

    const links = Array.from(page.container.querySelectorAll<HTMLAnchorElement>("a"));
    const hunt = links.find((a) => (a.getAttribute("href")?.includes("/grammar/hunt?case=")));
    expect(hunt?.getAttribute("href")).toBe(`/grammar/hunt?case=${lesson.huntCaseIds[0]}`);

    // 收据页先展示「去挑战」按钮；点它进入挑战段
    if (page.buttons().includes("去挑战：找一找漏洞")) {
      page.click("去挑战：找一找漏洞");
      expect(inSection(page, "侦探挑战"), "应进入挑战段").toBe(true);
      expect(page.has("学下一课：第 14 课"), "挑战段应给下一课入口").toBe(true);
    }
    page.unmount();
  });

  it("E5-9 产出段的空提交被拦：不写完成态", async () => {
    warmStorage();
    const page = mount();
    answerPretest(page, LESSON, true);
    page.click("直接去练习");
    page.click("回去再看一遍讲解");
    page.click("下一步：搭装与对错");
    page.click("下一步：变奏");
    page.click("看懂了，试一试");
    finishGuided(page, LESSON);
    typeInto(page, lessonOf(LESSON).recall?.answer ?? "");
    page.click("提交");
    page.click("进入练习");
    finishPractice(page, LESSON);
    expect(inSection(page, "说出来")).toBe(true);

    // 空提交：按钮 disabled
    const submit = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button.primary-button")).find(
      (el) => (el.textContent ?? "").trim() === "提交"
    );
    expect(submit?.disabled, "空输入时提交应 disabled").toBe(true);
    clickEl(submit);
    expect(textareaValue(page)).toBe("");
    await flushData();
    expect(readAppData().grammarLessonsDone.includes(LESSON), "空提交不应写完成态").toBe(false);
    page.unmount();
  });
});
