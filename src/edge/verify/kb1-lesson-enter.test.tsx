// @vitest-environment jsdom
/**
 * KB1 · 课程页（GrammarLessonPage）文本输入框的键盘路径
 *
 * 两个处理点同构：:2784（忆段 recall）与 :3129（产出段 output）。
 * 两者都写了 `key === "Enter" && !shiftKey && !nativeEvent.isComposing`。
 *
 * 重点验证：组词态回车不该提交、Shift+Enter 该换行、判题后焦点在哪。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import { fireKey } from "./kbd";
import { flushAsync } from "./drive";
import {
  answerPretest,
  finishGuided,
  finishPractice,
  inSection,
  lessonOf,
  markLessonsDoneInStorage,
  sectionLabels,
  typeInto,
  type Mounted
} from "../lessonFlow";

const LESSON = "lesson-13-now";

const mount = (lessonId = LESSON) =>
  mountPage(<GrammarLessonPage />, `/grammar/lesson/${lessonId}`, "/grammar/lesson/:lessonId");

/** 预置「已完成过别的课」，关掉首课导览化。 */
const warmStorage = () => {
  const warm = mount("lesson-01-am");
  warm.unmount();
  markLessonsDoneInStorage(["lesson-01-am"]);
};

/** 走到「忆」段。 */
const enterRecall = (page: Mounted): void => {
  answerPretest(page, LESSON, true);
  page.click("直接去练习");
  page.click("回去再看一遍讲解");
  page.click("下一步：搭装与对错");
  page.click("下一步：变奏");
  page.click("看懂了，试一试");
  finishGuided(page, LESSON);
};

const textareaOf = (page: Mounted) =>
  page.container.querySelector<HTMLTextAreaElement>("textarea.large-textarea");

const inFeedback = (page: Mounted): boolean =>
  Boolean(page.container.querySelector(".lesson-feedback.pass, .lesson-feedback.retry"));

const hasPass = (page: Mounted): boolean => Boolean(page.container.querySelector(".lesson-feedback.pass"));

describe("KB1 课程页输入框键盘路径", () => {
  beforeEach(() => resetStorage());

  it("KB1-0 前置：能走到忆段并找到输入框", async () => {
    warmStorage();
    const page = mount();
    enterRecall(page);
    expect(inSection(page, "凭记忆写"), `段位：${sectionLabels(page).join(",")}`).toBe(true);
    expect(textareaOf(page), "忆段应有输入框").toBeTruthy();
    page.unmount();
  });

  it("KB1-1 忆段：回车提交（等价于点「提交」按钮）", async () => {
    warmStorage();
    const page = mount();
    enterRecall(page);
    const answer = lessonOf(LESSON).recall?.answer ?? "";
    expect(answer, "这一课应有 recall 答案").not.toBe("");
    typeInto(page, answer);
    await flushAsync();
    const field = textareaOf(page)!;
    const event = fireKey(field, "Enter");
    await flushAsync();
    expect(event.defaultPrevented, "回车应被处理（preventDefault 阻止 textarea 换行）").toBe(true);
    expect(hasPass(page), "回车应等价于点提交（出现通过反馈）").toBe(true);
    page.unmount();
  });

  it("KB1-2 忆段：组词态回车（isComposing=true）不提交（守护中文输入法）", async () => {
    warmStorage();
    const page = mount();
    enterRecall(page);
    typeInto(page, lessonOf(LESSON).recall?.answer ?? "");
    await flushAsync();
    const field = textareaOf(page)!;
    const composing = fireKey(field, "Enter", { isComposing: true, keyCode: 229 });
    await flushAsync();
    expect(composing.defaultPrevented, "组词态回车不应被 preventDefault").toBe(false);
    expect(inFeedback(page), "组词态回车不应产生任何判定反馈").toBe(false);
    // 严格版（Chrome 实际派发的 key=Process/keyCode 229）同样不提交
    fireKey(field, "Process", { isComposing: true, keyCode: 229 });
    await flushAsync();
    expect(inFeedback(page), "key=Process 组词态不应产生反馈").toBe(false);
    page.unmount();
  });

  it("KB1-3 忆段：Shift+Enter 换行而非提交", async () => {
    warmStorage();
    const page = mount();
    enterRecall(page);
    typeInto(page, lessonOf(LESSON).recall?.answer ?? "");
    await flushAsync();
    const field = textareaOf(page)!;
    const event = fireKey(field, "Enter", { shiftKey: true });
    await flushAsync();
    expect(event.defaultPrevented, "Shift+Enter 不应被 preventDefault（要留给换行）").toBe(false);
    expect(inFeedback(page), "Shift+Enter 不应提交").toBe(false);
    page.unmount();
  });

  it("KB1-4 忆段：空输入回车不提交、不进入反馈态", async () => {
    warmStorage();
    const page = mount();
    enterRecall(page);
    const field = textareaOf(page)!;
    fireKey(field, "Enter");
    await flushAsync();
    expect(inFeedback(page), "空串回车不应有反馈").toBe(false);
    page.unmount();
  });

  it("KB1-5 忆段：连按回车只判一次（反馈态下不重复提交）", async () => {
    warmStorage();
    const page = mount();
    enterRecall(page);
    typeInto(page, lessonOf(LESSON).recall?.answer ?? "");
    await flushAsync();
    const field = textareaOf(page)!;
    fireKey(field, "Enter");
    await flushAsync();
    const events = () =>
      (JSON.parse(window.localStorage.getItem("grammar-telemetry-events-v1") ?? "{}") as {
        events?: Array<Record<string, unknown>>;
      }).events ?? [];
    const recallSteps = () => events().filter((e) => e.kind === "lesson_step_result" && e.section === "recall").length;
    const after1 = recallSteps();
    fireKey(field, "Enter");
    fireKey(field, "Enter");
    await flushAsync();
    expect(recallSteps(), "连按回车不应重复记分/重复提交").toBe(after1);
    page.unmount();
  });

  it("KB1-6 产出段：回车提交 + 组词态/Shift 边界与忆段一致", async () => {
    warmStorage();
    const page = mount();
    enterRecall(page);
    // 忆段通过 → 进练习段
    typeInto(page, lessonOf(LESSON).recall?.answer ?? "");
    await flushAsync();
    fireKey(textareaOf(page)!, "Enter");
    await flushAsync();
    page.clickMatch(/进入练习/);
    await flushAsync();
    expect(inSection(page, "自己来"), `段位：${sectionLabels(page).join(",")}`).toBe(true);
    finishPractice(page, LESSON);
    await flushAsync();
    // 现在应停在产出段（说出来）
    expect(inSection(page, "说出来"), `段位：${sectionLabels(page).join(",")}`).toBe(true);
    const field = textareaOf(page);
    expect(field, "产出段应有输入框").toBeTruthy();
    // Shift+Enter 不提交
    typeInto(page, "I am drawing");
    await flushAsync();
    const shift = fireKey(field!, "Enter", { shiftKey: true });
    expect(shift.defaultPrevented, "产出段 Shift+Enter 不应被 preventDefault").toBe(false);
    expect(inFeedback(page), "产出段 Shift+Enter 不应提交").toBe(false);
    // 组词态不提交
    const composing = fireKey(field!, "Enter", { isComposing: true, keyCode: 229 });
    expect(composing.defaultPrevented, "产出段组词态回车不应被 preventDefault").toBe(false);
    expect(inFeedback(page), "产出段组词态回车不应提交").toBe(false);
    // 正常回车提交
    typeInto(page, "I am drawing");
    await flushAsync();
    const normal = fireKey(textareaOf(page)!, "Enter");
    await flushAsync();
    expect(normal.defaultPrevented, "产出段回车应被处理").toBe(true);
    page.unmount();
  });

  it("KB1-7【已修 2026-09-21】忆段判题后焦点交回内容区", async () => {
    warmStorage();
    const page = mount();
    enterRecall(page);
    typeInto(page, lessonOf(LESSON).recall?.answer ?? "");
    await flushAsync();
    const field = textareaOf(page)!;
    field.focus();
    expect(document.activeElement, "前置：焦点应在输入框").toBe(field);
    fireKey(field, "Enter");
    await flushAsync();
    // 通过后输入框整体被替换成反馈卡（元素被卸载）
    const stillThere = page.container.contains(field);
    expect(stillThere, "通过后输入框应被卸载").toBe(false);
    /**
     * 修复后：判题后焦点被交回内容区（`useReturnFocus` + 依赖键含 recallOutcome）。
     * 修复前这里恒为 false——被点/被卸载的元素把焦点退回 body，无任何补偿。
     */
    const active = document.activeElement as HTMLElement | null;
    const landedInPage = active ? page.container.contains(active) : false;
    expect(
      landedInPage,
      "判题后焦点应仍在页面内（实际 activeElement=" +
        (active ? `${active.tagName}.${active.className}` : "null") + "）"
    ).toBe(true);
    // 落点就是反馈卡里的可继续按钮
    expect(
      page.container.querySelector(".lesson-feedback.pass .primary-button"),
      "反馈卡里应有可继续的按钮"
    ).toBeTruthy();
    page.unmount();
  });
});
