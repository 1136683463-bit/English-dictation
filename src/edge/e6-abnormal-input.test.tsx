// @vitest-environment jsdom
/**
 * E6 · 异常输入
 *
 * 关注点：重复点击同一词块、超载摆块、未作答就找「下一题」、空/超长提交、
 * 通关后反复点击 —— 任何操作都不应崩溃或永久卡住。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "./harness";
import GrammarLessonPage from "../pages/GrammarLessonPage";
import {
  answerArrangeCorrectly,
  answerGuidedCorrectly,
  answerPretest,
  guidedEntries,
  bankChips,
  bankWords,
  builtChips,
  builtWords,
  clickEl,
  finishGuided,
  inSection,
  lessonOf,
  markLessonsDoneInStorage,
  pressKey,
  sectionLabels,
  textareaValue,
  typeInto,
  type Mounted
} from "./lessonFlow";

const LESSON = "lesson-13-now"; // 有 recall；practice 带干扰项

const mount = (lessonId = LESSON) =>
  mountPage(<GrammarLessonPage />, `/grammar/lesson/${lessonId}`, "/grammar/lesson/:lessonId");

const warmStorage = () => {
  const warm = mount("lesson-01-am");
  warm.unmount();
  markLessonsDoneInStorage(["lesson-01-am"]);
};

const enterPractice = (page: Mounted) => {
  answerPretest(page, LESSON, true);
  page.click("直接去练习");
  expect(inSection(page, "自己来"), `应在练习段，实际: ${sectionLabels(page).join(",")}`).toBe(true);
};

const feedbackKind = (page: Mounted): "pass" | "retry" | "none" => {
  if (page.container.querySelector(".lesson-feedback.pass")) return "pass";
  if (page.container.querySelector(".lesson-feedback.retry")) return "retry";
  return "none";
};

describe("E6 · 异常输入", () => {
  beforeEach(() => resetStorage());

  it("E6-1 同一词块连点两次：不重复添加，已选词块变 disabled", () => {
    warmStorage();
    const page = mount();
    enterPractice(page);

    const chips = bankChips(page);
    clickEl(chips[0]);
    expect(builtWords(page).length, "第一次点击应加入拼装区").toBe(1);
    const added = builtWords(page)[0];

    // 再点同一个（此时已 disabled）——用原生 click 与 dispatchEvent 两种方式
    const same = bankChips(page).find((el) => (el.textContent ?? "").trim() === added);
    expect(same?.disabled, "已选词块应变灰 disabled").toBe(true);
    same?.click();
    clickEl(same);
    expect(builtWords(page).length, "连点同一词块不应重复添加").toBe(1);
    expect(builtWords(page).filter((word) => word === added).length).toBe(1);

    // 直接调用 React 的 onClick 也走 order.includes 守卫：这里用「点第二个不同词块」验证仍能正常添加
    const others = bankChips(page).filter((el) => !el.disabled);
    clickEl(others[0]);
    expect(builtWords(page).length).toBe(2);
    page.unmount();
  });

  it("E6-2 点拼装区词块可移除；移除后词块回到可点状态，重拼正解仍能判过（去抖不卡）", () => {
    warmStorage();
    const page = mount();
    enterPractice(page);
    const answer = lessonOf(LESSON).practice[0].answer;

    // 先摆错：用干扰项顶掉第一个词（词数与答案一致 → 触发判题）
    const words = answer.replace(/[.,!?;:]/g, "").split(/\s+/);
    const distractor = bankWords(page).map((w) => w.replace(/[.,!?;:]/g, "")).find((w) => !words.includes(w));
    expect(distractor, "本题应带干扰项").toBeTruthy();
    clickEl(bankChips(page).find((el) => (el.textContent ?? "").replace(/[.,!?;:]/g, "") === distractor));
    for (const word of words.slice(1)) {
      clickEl(bankChips(page).find((el) => (el.textContent ?? "").replace(/[.,!?;:]/g, "") === word && !el.disabled));
    }
    expect(feedbackKind(page), "摆满错误答案应判错").toBe("retry");

    // 移除第一个（干扰项）：反馈清空、该词块回到可点状态
    clickEl(builtChips(page)[0]);
    expect(feedbackKind(page), "移除后反馈应清空").toBe("none");
    const freed = bankChips(page).find((el) => (el.textContent ?? "").replace(/[.,!?;:]/g, "") === distractor);
    expect(freed?.disabled, "移除后干扰项应恢复可点").toBe(false);
    // 重新点它 → 能再次加入（词块不会被永久吃掉）
    clickEl(freed);
    expect(builtWords(page).length, "移除后再点应能重新加入").toBe(words.length);
    expect(feedbackKind(page), "重新加入同样错序应重新判错").toBe("retry");

    // 清空后按正解顺序重拼 → 去抖不卡，应能判过
    for (let guard = 0; guard < words.length + 4 && builtChips(page).length > 0; guard += 1) {
      clickEl(builtChips(page)[0]);
    }
    expect(builtWords(page).length).toBe(0);
    expect(answerArrangeCorrectly(page, answer)).toBe(true);
    expect(feedbackKind(page), "重拼正解应判过").toBe("pass");
    expect(page.buttons().includes("下一题")).toBe(true);
    page.unmount();
  });

  it("E6-3 超载摆块（把带干扰项的词块全摆上）：有反馈、不崩溃、可继续修正", () => {
    warmStorage();
    const page = mount();
    enterPractice(page);
    const step = lessonOf(LESSON).practice[0];
    const answerLen = step.answer.replace(/[.,!?;:]/g, "").split(/\s+/).length;
    const bankLen = bankWords(page).length;
    expect(bankLen, "本题应带干扰项").toBeGreaterThan(answerLen);

    // 全部摆上（超过答案词数）
    for (let guard = 0; guard < bankLen + 2; guard += 1) {
      const next = bankChips(page).find((el) => !el.disabled);
      if (!next) break;
      clickEl(next);
    }
    expect(builtWords(page).length, "应能摆满整个词块库").toBe(bankLen);
    expect(feedbackKind(page), "超载状态也应有反馈（不为空）").not.toBe("none");
    expect(page.buttons().length).toBeGreaterThan(0);

    // 清空后重拼正解 → 应能通过（不卡死）
    for (let guard = 0; guard < bankLen + 2 && builtChips(page).length > 0; guard += 1) {
      clickEl(builtChips(page)[0]);
    }
    expect(builtWords(page).length).toBe(0);
    expect(answerArrangeCorrectly(page, step.answer)).toBe(true);
    expect(feedbackKind(page)).toBe("pass");
    page.unmount();
  });

  it("E6-4 未作答时不存在「下一题」（guided 与 practice 一致）", () => {
    warmStorage();
    const page = mount();
    answerPretest(page, LESSON, true);
    page.click("直接去练习");
    expect(page.buttons().includes("下一题"), "practice 未作答不应有下一题").toBe(false);

    // guided 段：从讲解进入后同样没有下一题
    const second = mount();
    answerPretest(second, LESSON, true);
    second.click("先过一遍讲解");
    second.click("下一步：搭装与对错");
    second.click("下一步：变奏");
    second.click("看懂了，试一试");
    expect(second.buttons().includes("下一题"), "guided 未作答不应有下一题").toBe(false);
    expect(second.buttons().includes("下面自己来"), "guided 未作答不应有「下面自己来」").toBe(false);
    page.unmount();
    second.unmount();
  });

  it("E6-5 通关后再次点击已选选项/词块：状态不变、不重复计数", () => {
    warmStorage();
    const page = mount();
    answerPretest(page, LESSON, true);
    page.click("先过一遍讲解");
    page.click("下一步：搭装与对错");
    page.click("下一步：变奏");
    page.click("看懂了，试一试");

      const entry = guidedEntries(LESSON)[0];
    const first = entry.sourceIndex;
    const step = entry.step;

    if (step.kind === "arrange") {
      answerArrangeCorrectly(page, step.answer);
      const before = builtWords(page).length;
      // 通关后点拼装区词块：仍可移除（会重置反馈）
      clickEl(builtChips(page)[0]);
      expect(builtWords(page).length).toBe(before - 1);
      expect(feedbackKind(page), "移除后反馈清空（未作答）").toBe("none");
    } else {
      answerGuidedCorrectly(page, { step, sourceIndex: first, displayIndex: 0 });
      expect(feedbackKind(page)).toBe("pass");
      // 通关后选项应 disabled，再点不改变状态
      const options = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-option"));
      const other = options.find((el) => (el.textContent ?? "").trim() !== step.answer);
      expect(other?.disabled, "pass 后非选中项也应 disabled").toBe(true);
      other?.click();
      expect(feedbackKind(page), "重复点击不应改变反馈").toBe("pass");
      expect(page.buttons().includes("下一题")).toBe(true);
    }
    page.unmount();
  });

  it("E6-6 产出段：纯空格的输入被拦（提交 disabled、不写完成态）", () => {
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
    finishPracticeHook(page);
    expect(inSection(page, "说出来")).toBe(true);

    const submit = () =>
      Array.from(page.container.querySelectorAll<HTMLButtonElement>("button.primary-button")).find(
        (el) => (el.textContent ?? "").trim() === "提交"
      );
    typeInto(page, "   ");
    expect(submit()?.disabled, "纯空格应视为空，提交 disabled").toBe(true);
    clickEl(submit());
    expect(inSection(page, "说出来"), "空提交后仍在产出段").toBe(true);
    expect(page.has("没关系，先看正确说法"), "空提交不应揭示答案").toBe(false);
    page.unmount();
  });

  it("E6-7 产出段：2000 字超长输入不崩溃，判错并给差异说明", () => {
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
    finishPracticeHook(page);

    typeInto(page, "hello ".repeat(340));
    expect(textareaValue(page).length).toBeGreaterThan(1800);
    const submit = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button.primary-button")).find(
      (el) => (el.textContent ?? "").trim() === "提交"
    );
    expect(submit?.disabled).toBe(false);
    clickEl(submit);
    expect(page.buttons().length).toBeGreaterThan(0);
    expect(page.container.querySelector(".lesson-feedback.retry"), "长输入应判错并给提示").not.toBeNull();
    page.unmount();
  });

  it("E6-8 产出段：回车提交（非空）与 Shift+Enter 换行区分正确", () => {
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
    finishPracticeHook(page);

    const area = page.container.querySelector<HTMLTextAreaElement>("textarea.large-textarea");
    expect(area).not.toBeNull();
    typeInto(page, "zzz");
    // Shift+Enter 不应提交
    pressKey(page, "Enter", { shiftKey: true });
    expect(page.container.querySelector(".lesson-feedback.retry"), "Shift+Enter 不应提交").toBeNull();
    // 普通 Enter 应提交
    pressKey(page, "Enter");
    expect(page.container.querySelector(".lesson-feedback.retry"), "Enter 应提交").not.toBeNull();
    page.unmount();
  });

  it("E6-9 快速连点「下一题」：不会跳过错过的题（不越过产出段）", () => {
    warmStorage();
    const page = mount();
    enterPractice(page);
    const lesson = lessonOf(LESSON);

    answerArrangeCorrectly(page, lesson.practice[0].answer);
    const next = page.buttons().includes("下一题") ? "下一题" : "最后一步：说出来";
    for (let index = 0; index < 6; index += 1) {
      if (!page.buttons().includes(next)) break;
      page.click(next);
    }
    // 连点后必须仍在练习/产出/对比三段之内，且始终有可点按钮
    const labels = sectionLabels(page);
    expect(
      labels.some((label) => ["自己来", "说出来", "再看两组对错"].includes(label)),
      `连点后不应跳出练习流程，实际段: ${labels.join(",")}`
    ).toBe(true);
    expect(page.buttons().filter(Boolean).length).toBeGreaterThan(0);
    page.unmount();
  });

  it("E6-10 不存在的课 id：渲染「找不到这一课」而非崩溃", () => {
    const page = mountPage(
      <GrammarLessonPage />,
      "/grammar/lesson/lesson-does-not-exist",
      "/grammar/lesson/:lessonId"
    );
    expect(page.has("找不到这一课")).toBe(true);
    expect(page.has("课程不存在")).toBe(true);
    expect(page.buttons().length + page.container.querySelectorAll("a").length).toBeGreaterThan(0);
    page.unmount();
  });
});

/** 与 lessonFlow.finishPractice 等价（避免循环依赖，直接内联）。 */
function finishPracticeHook(page: Mounted) {
  const lesson = lessonOf(LESSON);
  for (let index = 0; index < lesson.practice.length; index += 1) {
    const answer = lesson.practice[index].answer;
    expect(answerArrangeCorrectly(page, answer), `第 ${index + 1} 题应能拼出 ${answer}`).toBe(true);
    page.click(index + 1 >= lesson.practice.length ? "最后一步：说出来" : "下一题");
  }
  const mid = page.container.querySelector('[aria-label="再看两组对错"]');
  if (mid) {
    for (const card of Array.from(mid.querySelectorAll<HTMLElement>(".lesson-contrast-card"))) {
      const options = Array.from(card.querySelectorAll<HTMLButtonElement>("button.lesson-option"));
      if (options.length) clickEl(options[0]);
    }
    page.click("最后一步：说出来");
  }
}
