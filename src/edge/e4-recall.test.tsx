// @vitest-environment jsdom
/**
 * E4 · 「忆」段（recall）的边界
 *
 * L13 起所有课都有 recall（192/192）。关注：空输入、乱输入、正确输入、看答案、
 * 以及「回车提交」在空串下的行为。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "./harness";
import GrammarLessonPage from "../pages/GrammarLessonPage";
import {
  answerPretest,
  clickEl,
  finishGuided,
  inSection,
  lessonOf,
  markLessonsDoneInStorage,
  sectionLabels,
  textareaValue,
  typeInto,
  type Mounted
} from "./lessonFlow";

/** L13 起有 recall；取一课 guided 较短、练习较短的。 */
const LESSON = "lesson-13-now";

const mount = (lessonId = LESSON) =>
  mountPage(<GrammarLessonPage />, `/grammar/lesson/${lessonId}`, "/grammar/lesson/:lessonId");

const warmStorage = () => {
  const warm = mount("lesson-01-am");
  warm.unmount();
  markLessonsDoneInStorage(["lesson-01-am"]);
};

/** 走到 recall 段。 */
const enterRecall = (page: Mounted) => {
  answerPretest(page, LESSON, true);
  page.click("直接去练习");
  // 从练习段退到 recall 需要走 guided 正路：这里改走讲解 → 试一试
  page.click("回去再看一遍讲解");
  page.click("下一步：搭装与对错");
  page.click("下一步：变奏");
  page.click("看懂了，试一试");
  finishGuided(page, LESSON);
  expect(inSection(page, "凭记忆写"), `应进入忆段，实际: ${sectionLabels(page).join(",")}`).toBe(true);
};

const submitButton = (page: Mounted): HTMLButtonElement | null =>
  Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find(
    (el) => (el.textContent ?? "").trim() === "提交"
  ) ?? null;

const submitViaEnter = (page: Mounted) => {
  const area = page.container.querySelector<HTMLTextAreaElement>("textarea.large-textarea");
  if (!area) throw new Error("找不到输入区");
  const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
  area.dispatchEvent(event);
};

describe("E4 · 忆段边界", () => {
  beforeEach(() => resetStorage());

  it("E4-1 空输入：提交按钮 disabled，回车不提交，无错误提示", () => {
    warmStorage();
    const page = mount();
    enterRecall(page);

    expect(submitButton(page)?.disabled, "空输入时提交按钮应 disabled").toBe(true);
    // 回车：受控逻辑里 `if (recallValue.trim()) submitRecall()` → 空串时不提交
    submitViaEnter(page);
    // 用段内反馈卡判定，而不是文本 contains（题干里本来就有「凭记忆写出来」四个字）
    expect(page.container.querySelector(".lesson-feedback.pass"), "空回车不应判通过").toBeNull();
    expect(page.container.querySelector(".lesson-feedback.retry"), "空回车不应有错误反馈").toBeNull();
    expect(page.has("提交")).toBe(true);
    expect(page.buttons().length).toBeGreaterThan(0);
    page.unmount();
  });

  it("E4-2 只输入空格：同样不提交、不崩溃", () => {
    warmStorage();
    const page = mount();
    enterRecall(page);

    typeInto(page, "   ");
    expect(textareaValue(page)).toBe("   ");
    expect(submitButton(page)?.disabled, "纯空格应视为空").toBe(true);
    submitViaEnter(page);
    expect(page.container.querySelector(".lesson-feedback.retry")).toBeNull();
    expect(page.buttons().length).toBeGreaterThan(0);
    page.unmount();
  });

  it("E4-3 完全错误的答案：给温和提示且不清空输入、不崩溃", () => {
    warmStorage();
    const page = mount();
    enterRecall(page);

    typeInto(page, "zzz qqq www");
    clickEl(submitButton(page));
    const retry = page.container.querySelector(".lesson-feedback.retry");
    expect(retry, "错答应给提示").not.toBeNull();
    const text = (retry?.textContent ?? "").trim();
    expect(text).not.toMatch(/错误|失败|不对哦$/);
    // eslint-disable-next-line no-console
    console.log("E4-3 乱答提示:", text.slice(0, 120));
    // 错一次不给「看答案」出口（需 ≥2 次）
    expect(page.buttons().includes("想不起来，看答案"), "错 1 次不应给看答案").toBe(false);
    expect(page.buttons().length).toBeGreaterThan(0);
    page.unmount();
  });

  it("E4-4 错 2 次后出现「想不起来，看答案」；看答案后进入已揭示态并提示入队", () => {
    warmStorage();
    const page = mount();
    enterRecall(page);

    typeInto(page, "zzz qqq");
    clickEl(submitButton(page));
    typeInto(page, "aaa bbb");
    clickEl(submitButton(page));
    expect(page.buttons().includes("想不起来，看答案"), "错 2 次后应给看答案").toBe(true);

    page.click("想不起来，看答案");
    expect(page.has("正确说法")).toBe(true);
    expect(page.has(lessonOf(LESSON).recall?.answer ?? "___")).toBe(true);
    expect(page.has("这句已排进明天的复习队列")).toBe(true);
    expect(page.buttons().includes("进入练习"), "看答案后应能继续").toBe(true);
    page.unmount();
  });

  it("E4-5 正确答案（含大小写/标点差异）判通过并能继续", () => {
    warmStorage();
    const page = mount();
    enterRecall(page);
    const answer = lessonOf(LESSON).recall?.answer ?? "";
    expect(answer).not.toBe("");

    // 故意用小写 + 去掉句末标点：判分应宽容
    typeInto(page, answer.toLowerCase().replace(/[.!?]$/, ""));
    clickEl(submitButton(page));
    expect(page.has("凭记忆写出来了"), "宽容口径下应判通过").toBe(true);
    expect(page.buttons().includes("进入练习")).toBe(true);
    page.unmount();
  });

  it("E4-6 错 1 次后改对：能通过（不会因错过一次就被锁死）", () => {
    warmStorage();
    const page = mount();
    enterRecall(page);
    const answer = lessonOf(LESSON).recall?.answer ?? "";

    typeInto(page, "wrong wrong wrong");
    clickEl(submitButton(page));
    expect(page.container.querySelector(".lesson-feedback.retry")).not.toBeNull();

    typeInto(page, answer);
    clickEl(submitButton(page));
    expect(page.has("凭记忆写出来了")).toBe(true);
    page.unmount();
  });

  it("E4-7 通过后输入区不再可编辑（防线：不能改答案再提交）", () => {
    warmStorage();
    const page = mount();
    enterRecall(page);
    const answer = lessonOf(LESSON).recall?.answer ?? "";

    typeInto(page, answer);
    clickEl(submitButton(page));
    expect(page.container.querySelector("textarea.large-textarea"), "通过后应撤下输入区").toBeNull();
    expect(page.buttons().includes("提交")).toBe(false);
    page.unmount();
  });

  /**
   * E4-9【2026-09-24 新增】忆段答错必须给「问 AI 为什么不对」入口。
   *
   * 与 E1-8（跟段）同源：这个面板原先每个段各抄一份，忆段被漏掉了——
   * 答错只有「想不起来，看答案」，用户想问「我写的为什么不对」时无处可问。
   * 本闸锁忆段这一份不回退。
   */
  it("E4-9 忆段答错：出现「为什么我写的不对？」入口，点击后解答面板打开", () => {
    warmStorage();
    const page = mount();
    enterRecall(page);

    typeInto(page, "totally wrong sentence here");
    clickEl(submitButton(page));
    expect(page.container.querySelector(".lesson-feedback.retry"), "应先进入答错态").not.toBeNull();
    expect(page.buttons().includes("为什么我写的不对？"), "忆段答错应给错因入口").toBe(true);

    page.click("为什么我写的不对？");
    expect(page.container.querySelector(".lesson-whywrong-panel"), "点击后应打开解答面板").not.toBeNull();
    page.unmount();
  });

  it("E4-8 超长乱输入（500 字符）不崩溃", () => {
    warmStorage();
    const page = mount();
    enterRecall(page);

    typeInto(page, "abc ".repeat(120));
    clickEl(submitButton(page));
    expect(page.buttons().length).toBeGreaterThan(0);
    expect(page.container.querySelector(".lesson-feedback.retry")).not.toBeNull();
    page.unmount();
  });
});
