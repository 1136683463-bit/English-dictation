// @vitest-environment jsdom
/**
 * A11Y-1 · 焦点管理专项：答题 / 换题 / 换段 / 结算之后，焦点落在哪里？
 *
 * 为什么这么测：
 * jsdom 里 `element.click()` **不会**移动焦点（真实浏览器里点击按钮会让按钮获得焦点）。
 * 所以本文件统一用「先 .focus() 再 .click()」模拟键盘用户的真实动线
 * ——Tab 到按钮 → Enter/Space 触发。jsdom 的 .focus() 会真实更新
 * document.activeElement；被聚焦的元素从 DOM 移除后 jsdom 把 activeElement
 * 退回 <body>（与浏览器一致）。
 *
 * 判据：动作完成后若 activeElement === document.body，说明焦点被丢弃
 * ——键盘用户必须从页面开头重新 Tab 一遍才能继续。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage, type Mounted } from "../harness";
import { cardsToData, DONE_LESSON_ID, makeSentenceCard, seedAppData } from "./fixtures";
import { clickElement, flushAsync } from "./drive";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import GrammarHuntPage from "../../pages/GrammarHuntPage";
import GrammarDiaryPage from "../../pages/GrammarDiaryPage";
import { buildGrammarReviewSession, buildGrammarReviewTask, diversifyReviewModes } from "../../services/grammarReviewService";
import { buildBoostItems } from "../../services/grammarBoostService";
import { clickEl } from "../lessonFlow";

const LESSON_ID = "lesson-13-now";

// jsdom 不实现 ResizeObserver（GrammarDiaryPage / Segmented 用它量宽度）；补一个 no-op。
if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
  class NoopResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = NoopResizeObserver;
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = NoopResizeObserver;
}

const buttonsOf = (page: Mounted): HTMLButtonElement[] =>
  Array.from(page.container.querySelectorAll<HTMLButtonElement>("button"));

const enabledByText = (page: Mounted, re: RegExp): HTMLButtonElement | undefined =>
  buttonsOf(page).find((b) => !b.disabled && re.test((b.textContent ?? "").trim()));

/** 焦点落点的可读快照。 */
const focusLabel = (): string => {
  const el = document.activeElement as HTMLElement | null;
  if (!el || el === document.body) return "BODY(焦点丢失)";
  const text = (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 24);
  return `${el.tagName}.${(el.className || "").toString().split(" ").slice(0, 2).join(".")}["${text}"]`;
};

const focusIsLost = (): boolean => {
  const el = document.activeElement;
  return !el || el === document.body || el === document.documentElement;
};

/** 模拟键盘用户：聚焦 → Enter/Space 触发。 */
const keyboardActivate = (el: Element): void => {
  (el as HTMLElement).focus();
  clickElement(el);
};

/** 走完前测两题（choose + contrast），停在「开始上课」。 */
const passPretest = async (page: Mounted, chooseAnswer: string): Promise<void> => {
  const opt = buttonsOf(page).find((b) => (b.textContent ?? "").trim() === chooseAnswer);
  if (opt) clickEl(opt);
  await flushAsync();
  const n1 = enabledByText(page, /^(下一题|看看结果)$/);
  if (n1) clickEl(n1);
  await flushAsync();
  const contrast = enabledByText(page, /^(没问题|有问题|有点问题)$/);
  if (contrast) clickEl(contrast);
  await flushAsync();
  const n2 = enabledByText(page, /^(下一题|看看结果)$/);
  if (n2) clickEl(n2);
  await flushAsync();
  const begin = enabledByText(page, /^开始上课$/);
  if (begin) clickEl(begin);
  await flushAsync();
};

/** 从「看」段走到 guided 段。 */
const watchToGuided = async (page: Mounted): Promise<void> => {
  for (const label of ["下一步：搭装与对错", "下一步：变奏", "看懂了，试一试"]) {
    const b = enabledByText(page, new RegExp(`^${label}$`));
    if (b) clickEl(b);
    await flushAsync();
  }
};

describe("A11Y-1 焦点丢失", () => {
  beforeEach(() => {
    resetStorage();
    seedAppData();
  });

  it("课程页 · 前测答题 →「下一题」：换题后焦点落在哪", async () => {
    const page = mountPage(<GrammarLessonPage />, `/grammar/lesson/${LESSON_ID}`, "/grammar/lesson/:lessonId");
    await flushAsync();

    const opt = buttonsOf(page).find((b) => (b.textContent ?? "").trim() === "is");
    expect(opt, "应能定位到前测正确选项 is").toBeTruthy();
    keyboardActivate(opt!);
    await flushAsync();
    const afterAnswer = focusLabel();

    const next = enabledByText(page, /^(下一题|看看结果)$/);
    expect(next, "答题后应出现「下一题」").toBeTruthy();
    keyboardActivate(next!);
    await flushAsync();
    const afterNext = focusLabel();

    // eslint-disable-next-line no-console
    console.log(`[课程页/前测] 判题后=${afterAnswer} → 点下一题后=${afterNext}`);
    expect(focusIsLost(), `前测换题后焦点丢失（落点=${afterNext}）`).toBe(false);
    page.unmount();
  });

  it("课程页 · 前测第 2 题（对比）答题 →「看看结果」：换题后焦点落在哪", async () => {
    const page = mountPage(<GrammarLessonPage />, `/grammar/lesson/${LESSON_ID}`, "/grammar/lesson/:lessonId");
    await flushAsync();
    const opt = buttonsOf(page).find((b) => (b.textContent ?? "").trim() === "is");
    keyboardActivate(opt!);
    await flushAsync();
    const n1 = enabledByText(page, /^(下一题|看看结果)$/);
    if (n1) clickEl(n1);
    await flushAsync();

    const verdict = enabledByText(page, /^(没问题|有问题|有点问题)$/);
    expect(verdict, "前测第 2 题应出现「没问题 / 有问题」").toBeTruthy();
    keyboardActivate(verdict!);
    await flushAsync();
    const next = enabledByText(page, /^(看看结果|下一题)$/);
    expect(next).toBeTruthy();
    keyboardActivate(next!);
    await flushAsync();
    const after = focusLabel();
    // eslint-disable-next-line no-console
    console.log(`[课程页/前测对比] 点看看结果后=${after}`);
    expect(focusIsLost(), `前测结算后焦点丢失（落点=${after}）`).toBe(false);
    page.unmount();
  });

  it("课程页 · 看段「下一步」推进：换段后焦点落在哪", async () => {
    const page = mountPage(<GrammarLessonPage />, `/grammar/lesson/${LESSON_ID}`, "/grammar/lesson/:lessonId");
    await flushAsync();
    await passPretest(page, "is");
    const step = enabledByText(page, /^下一步：搭装与对错$/);
    expect(step, "看段应有「下一步：搭装与对错」").toBeTruthy();
    keyboardActivate(step!);
    await flushAsync();
    const after = focusLabel();
    // eslint-disable-next-line no-console
    console.log(`[课程页/看段] 点下一步后=${after}`);
    expect(focusIsLost(), `看段换步后焦点丢失（落点=${after}）`).toBe(false);
    page.unmount();
  });

  it("课程页 · guided 拼装答题（判题通过）→「下一题」：换题后焦点落在哪", async () => {
    const page = mountPage(<GrammarLessonPage />, `/grammar/lesson/${LESSON_ID}`, "/grammar/lesson/:lessonId");
    await flushAsync();
    await passPretest(page, "is");
    await watchToGuided(page);

    // guided 第 1 题是 arrange：按答案点词块
    const bank = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-bank button"));
    expect(bank.length, "guided 段应有词块库").toBeGreaterThan(0);
    const words = ["I", "am", "drawing", "a", "picture."];
    const used = new Set<number>();
    for (const word of words) {
      const chip = bank.find((b, i) => !used.has(i) && !b.disabled && (b.textContent ?? "").trim() === word);
      if (!chip) break;
      used.add(bank.indexOf(chip));
      keyboardActivate(chip);
      await flushAsync();
    }
    const afterJudge = focusLabel();
    const next = enabledByText(page, /^(下一题|下面自己来)$/);
    expect(next, `拼装判题后应出现「下一题」（当前按钮：${page.buttons().join("|")}）`).toBeTruthy();
    keyboardActivate(next!);
    await flushAsync();
    const afterNext = focusLabel();
    // eslint-disable-next-line no-console
    console.log(`[课程页/guided] 判题后=${afterJudge} → 点下一题后=${afterNext}`);
    expect(focusIsLost(), `guided 换题后焦点丢失（落点=${afterNext}）`).toBe(false);
    page.unmount();
  });

  it("课程页 · guided 拼装答错（进 retry）→ 焦点落在哪", async () => {
    const page = mountPage(<GrammarLessonPage />, `/grammar/lesson/${LESSON_ID}`, "/grammar/lesson/:lessonId");
    await flushAsync();
    await passPretest(page, "is");
    await watchToGuided(page);

    const bank = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-bank button"));
    // 故意错序：am 先于 I
    const order = ["am", "I", "drawing", "a", "picture."];
    const used = new Set<number>();
    for (const word of order) {
      const chip = bank.find((b, i) => !used.has(i) && !b.disabled && (b.textContent ?? "").trim() === word);
      if (!chip) break;
      used.add(bank.indexOf(chip));
      keyboardActivate(chip);
      await flushAsync();
    }
    const after = focusLabel();
    // eslint-disable-next-line no-console
    console.log(`[课程页/guided 答错] 判题后=${after} | 按钮=${page.buttons().join("|")}`);
    expect(page.text().length).toBeGreaterThan(0);
    page.unmount();
  });

  it("复习页 · 填空答对 →「下一张」：换卡后焦点落在哪", async () => {
    resetStorage();
    const data = seedAppData(
      cardsToData([
        makeSentenceCard({ id: "c1", sentence: "I am drawing a picture." }),
        makeSentenceCard({ id: "c2", sentence: "She is reading a book." })
      ])
    );
    const task = buildGrammarReviewTask(diversifyReviewModes(buildGrammarReviewSession(data))[0], data.sentenceDetails);
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    await flushAsync();

    const answerBtn = buttonsOf(page).find((b) => (b.textContent ?? "").trim() === task.answer);
    expect(answerBtn, `应能定位到正确答案「${task.answer}」`).toBeTruthy();
    keyboardActivate(answerBtn!);
    await flushAsync();
    const next = enabledByText(page, /^(下一张|完成复习)$/);
    expect(next).toBeTruthy();
    keyboardActivate(next!);
    await flushAsync();
    const after = focusLabel();
    // eslint-disable-next-line no-console
    console.log(`[复习页] 点下一张后=${after}`);
    expect(focusIsLost(), `复习页换卡后焦点丢失（落点=${after}）`).toBe(false);
    page.unmount();
  });

  it("复习页 · 走完最后一卡进入结算：焦点落在哪", async () => {
    resetStorage();
    const data = seedAppData(cardsToData([makeSentenceCard({ id: "c1", sentence: "I am drawing a picture." })]));
    const task = buildGrammarReviewTask(diversifyReviewModes(buildGrammarReviewSession(data))[0], data.sentenceDetails);
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    await flushAsync();
    keyboardActivate(buttonsOf(page).find((b) => (b.textContent ?? "").trim() === task.answer)!);
    await flushAsync();
    const finish = enabledByText(page, /^(完成复习|下一张)$/);
    expect(finish).toBeTruthy();
    keyboardActivate(finish!);
    await flushAsync();
    const after = focusLabel();
    // eslint-disable-next-line no-console
    console.log(`[复习页/结算] 完成后=${after} | 结算页=${page.has("复习完成")}`);
    expect(focusIsLost(), `复习结算后焦点丢失（落点=${after}）`).toBe(false);
    page.unmount();
  });

  it("复习页 · 自由输出提交（textarea）→ 判题后焦点落在哪", async () => {
    resetStorage();
    const data = seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "c-free",
          sentence: "I am drawing a picture.",
          // reviewCount≥2 → diversifyReviewModes 判定为 free_type（自由输出）
          schedule: { reviewCount: 2, intervalDays: 3, easeFactor: 2.5 }
        })
      ])
    );
    const session = diversifyReviewModes(buildGrammarReviewSession(data));
    const task = buildGrammarReviewTask(session[0], data.sentenceDetails);
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    await flushAsync();
    if (task.mode !== "free_type") {
      // eslint-disable-next-line no-console
      console.log(`[复习页/自由输出] 首题模式为 ${task.mode}，非 free_type，跳过`);
      page.unmount();
      return;
    }
    const field = page.container.querySelector<HTMLTextAreaElement>("textarea");
    expect(field, "free_type 应有 textarea").toBeTruthy();
    field!.focus();
    const { setInputValue } = await import("./drive");
    setInputValue(field!, task.sentence);
    await flushAsync();
    const submit = enabledByText(page, /^提交$/);
    expect(submit, "应有提交按钮").toBeTruthy();
    keyboardActivate(submit!);
    await flushAsync();
    const after = focusLabel();
    // eslint-disable-next-line no-console
    console.log(`[复习页/自由输出] 提交后=${after}`);
    expect(focusIsLost(), `自由输出判题后焦点丢失（落点=${after}）`).toBe(false);
    page.unmount();
  });

  it("强化页 · 答对 →「下一题」：换题后焦点落在哪", async () => {
    resetStorage();
    seedAppData({ grammarLessonsDone: [DONE_LESSON_ID] });
    const page = mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}?tier=1`, "/grammar/boost/:lessonId");
    await flushAsync();
    const items = buildBoostItems(DONE_LESSON_ID, 1, {});
    const first = items[0];
    expect(first, "应能算出强化题").toBeTruthy();

    if (first.kind === "spot") {
      const idx = first.spotWrongIndexes?.length ? first.spotWrongIndexes[0] : (first.spotWrongIndex ?? -1);
      const chips = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-spot-row button"));
      expect(chips[idx], "应能定位到错误词块").toBeTruthy();
      keyboardActivate(chips[idx]);
      await flushAsync();
    } else {
      const opt = buttonsOf(page).find((b) => (b.textContent ?? "").trim() === (first.clozeAnswer ?? first.answer));
      if (opt) {
        keyboardActivate(opt);
        await flushAsync();
      }
      const confirm = enabledByText(page, /^确认$/);
      if (confirm) {
        clickEl(confirm);
        await flushAsync();
      }
    }
    const next = enabledByText(page, /^(下一题|完成这一档|再试一次)$/);
    expect(next, `答题后应出现推进按钮（当前：${page.buttons().join("|")}）`).toBeTruthy();
    keyboardActivate(next!);
    await flushAsync();
    const after = focusLabel();
    // eslint-disable-next-line no-console
    console.log(`[强化页] 点下一题后=${after}`);
    expect(focusIsLost(), `强化页换题后焦点丢失（落点=${after}）`).toBe(false);
    page.unmount();
  });

  it("强化页 · 自由产出提交（textarea）→ 判题后焦点落在哪", async () => {
    resetStorage();
    seedAppData({ grammarLessonsDone: [DONE_LESSON_ID] });
    // 三档挨个试，找出首题是 textarea（产出类）的那一档
    let page: Mounted | null = null;
    let tierUsed = 0;
    for (const tier of [3, 2, 1]) {
      const candidate = mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}?tier=${tier}`, "/grammar/boost/:lessonId");
      await flushAsync();
      if (candidate.container.querySelector<HTMLInputElement>("input.large-textarea")) {
        page = candidate;
        tierUsed = tier;
        break;
      }
      candidate.unmount();
    }
    if (!page) {
      // eslint-disable-next-line no-console
      console.log("[强化页/自由产出] 三档首题都不是 textarea 题型，跳过");
      return;
    }
    // eslint-disable-next-line no-console
    console.log(`[强化页/自由产出] 使用 tier=${tierUsed}`);
    const field = page.container.querySelector<HTMLInputElement>("input.large-textarea")!;
    field.focus();
    const { setInputValue } = await import("./drive");
    setInputValue(field, "I am drawing a picture.");
    await flushAsync();
    const submit = enabledByText(page, /^提交$/);
    if (!submit) {
      // eslint-disable-next-line no-console
      console.log("[强化页/自由产出] 无提交按钮，跳过");
      page.unmount();
      return;
    }
    keyboardActivate(submit);
    await flushAsync();
    const after = focusLabel();
    // eslint-disable-next-line no-console
    console.log(`[强化页/自由产出] 提交后=${after}`);
    expect(focusIsLost(), `强化页自由产出判题后焦点丢失（落点=${after}）`).toBe(false);
    page.unmount();
  });

  it("侦探页 · 点词块选中 → 选罪名结算：焦点落在哪", async () => {
    resetStorage();
    seedAppData({
      grammarLessonsDone: ["lesson-01-am", "lesson-04-want", "lesson-07-we", "lesson-09-go", "lesson-10-went", "lesson-11-plural", "lesson-12-will"]
    });
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt");
    await flushAsync();
    const card = buttonsOf(page).find((b) => /案件 02昨天的公园/.test(b.textContent ?? ""));
    expect(card, "应能定位到已解锁的案件卡").toBeTruthy();
    keyboardActivate(card!);
    await flushAsync();
    expect(page.container.querySelector(".hunt-token"), "应进入案件详情").toBeTruthy();

    // 点一个确实有问题的词块（Yesterday → got）
    const tokens = Array.from(page.container.querySelectorAll<HTMLElement>(".hunt-token"));
    const wrongToken = tokens.find((t) => (t.textContent ?? "").trim() === "go");
    expect(wrongToken, "应能定位到错误词 go").toBeTruthy();
    keyboardActivate(wrongToken!);
    await flushAsync();
    const afterToken = focusLabel();

    const tagSection = page.container.querySelector('[aria-label="选择罪名"]');
    expect(tagSection, "点词后应出现「选择罪名」区").toBeTruthy();
    const tag = Array.from(tagSection!.querySelectorAll<HTMLButtonElement>("button")).find((b) => !b.disabled);
    expect(tag, "罪名区应有可选按钮").toBeTruthy();
    keyboardActivate(tag!);
    await flushAsync();
    const after = focusLabel();
    // eslint-disable-next-line no-console
    console.log(`[侦探页] 点词后=${afterToken} → 选罪名后=${after}`);
    expect(focusIsLost(), `侦探页选罪名后焦点丢失（落点=${after}）`).toBe(false);
    page.unmount();
  });

  it("侦探页 · 破案结算（全部命中）：焦点落在哪", async () => {
    resetStorage();
    seedAppData({
      grammarLessonsDone: ["lesson-01-am", "lesson-04-want", "lesson-07-we", "lesson-09-go", "lesson-10-went", "lesson-11-plural", "lesson-12-will"]
    });
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt");
    await flushAsync();
    keyboardActivate(buttonsOf(page).find((b) => /案件 02昨天的公园/.test(b.textContent ?? ""))!);
    await flushAsync();
    const { huntCases } = await import("../../data/huntCases");
    const caseItem = huntCases.find((c) => c.id === "hunt-yesterday-park")!;
    const { GRAMMAR_ERROR_TAG_LABELS } = await import("../../services/huntService");
    for (const error of caseItem.errors) {
      const tokens = Array.from(page.container.querySelectorAll<HTMLElement>(".hunt-token"));
      const el = tokens[error.tokenIndex];
      if (!el) break;
      keyboardActivate(el);
      await flushAsync();
      const label = GRAMMAR_ERROR_TAG_LABELS[error.tag];
      const section = page.container.querySelector('[aria-label="选择罪名"]')!;
      const tag = Array.from(section.querySelectorAll<HTMLButtonElement>("button")).find(
        (b) => (b.querySelector("strong")?.textContent ?? "").trim() === label
      );
      if (!tag) break;
      keyboardActivate(tag);
      await flushAsync();
    }
    const after = focusLabel();
    const settled = Boolean(page.container.querySelector('[aria-label="破案结算"]'));
    // eslint-disable-next-line no-console
    console.log(`[侦探页/结算] 破案=${settled} 焦点=${after}`);
    expect(settled, "应走到破案结算").toBe(true);
    expect(focusIsLost(), `侦探结算后焦点丢失（落点=${after}）`).toBe(false);
    page.unmount();
  });

  it("侦探页 · 误判（点一个没问题的词）后焦点落在哪", async () => {
    resetStorage();
    seedAppData({
      grammarLessonsDone: ["lesson-01-am", "lesson-04-want", "lesson-07-we", "lesson-09-go", "lesson-10-went", "lesson-11-plural", "lesson-12-will"]
    });
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt");
    await flushAsync();
    keyboardActivate(buttonsOf(page).find((b) => /案件 02昨天的公园/.test(b.textContent ?? ""))!);
    await flushAsync();
    const tokens = Array.from(page.container.querySelectorAll<HTMLElement>(".hunt-token"));
    const okToken = tokens.find((t) => (t.textContent ?? "").trim() === "the");
    keyboardActivate(okToken!);
    await flushAsync();
    const section = page.container.querySelector('[aria-label="选择罪名"]')!;
    const tag = Array.from(section.querySelectorAll<HTMLButtonElement>("button")).find((b) => !b.disabled)!;
    keyboardActivate(tag);
    await flushAsync();
    const after = focusLabel();
    const card = page.container.querySelector(".hunt-verdict-card");
    // eslint-disable-next-line no-console
    console.log(`[侦探页/误判] 反馈卡=${Boolean(card)} 焦点=${after}`);
    expect(focusIsLost(), `侦探误判后焦点丢失（落点=${after}）`).toBe(false);
    page.unmount();
  });

  it("日记页 · 切换题组（重建输入区）后焦点落在哪", async () => {
    resetStorage();
    seedAppData();
    const page = mountPage(<GrammarDiaryPage />, "/grammar/diary", "/grammar/diary");
    await flushAsync();
    const field = page.container.querySelector<HTMLTextAreaElement>("textarea");
    expect(field, "日记页应有输入框").toBeTruthy();
    field!.focus();
    const before = focusLabel();
    const groupBtn = enabledByText(page, /^10 句$/);
    expect(groupBtn, "应有切组按钮").toBeTruthy();
    groupBtn!.focus();
    clickElement(groupBtn!);
    await flushAsync();
    const after = focusLabel();
    // eslint-disable-next-line no-console
    console.log(`[日记页] 切组前=${before} → 切组后=${after}`);
    expect(focusIsLost(), `日记页切组后焦点丢失（落点=${after}）`).toBe(false);
    page.unmount();
  });

  it("日记页 · 提交批改后焦点落在哪", async () => {
    resetStorage();
    seedAppData();
    const page = mountPage(<GrammarDiaryPage />, "/grammar/diary", "/grammar/diary");
    await flushAsync();
    const fields = Array.from(page.container.querySelectorAll<HTMLTextAreaElement>("textarea"));
    const { setInputValue } = await import("./drive");
    for (const field of fields) {
      setInputValue(field, "I like tea.");
    }
    await flushAsync();
    const submit = enabledByText(page, /写完了，一次性批改/);
    expect(submit, `应有批改按钮（当前：${page.buttons().join("|")}）`).toBeTruthy();
    keyboardActivate(submit!);
    await flushAsync();
    const after = focusLabel();
    // eslint-disable-next-line no-console
    console.log(`[日记页/批改] 提交后=${after}`);
    expect(focusIsLost(), `日记页批改后焦点丢失（落点=${after}）`).toBe(false);
    page.unmount();
  });
/**
 * 元验证：证明上面的「焦点丢失」不是 jsdom 的假象。
 *  - jsdom 实现了规范行为：被聚焦元素从 DOM 移除 → activeElement 退回 <body>
 *  - 而且这些「下一题 / 下一张」按钮**确实**在判题后被卸载（不是仍在 DOM 里只是失焦）
 * 两条合起来，浏览器里发生的也是同一件事：焦点丢失。
 */
describe("A11Y-1 元验证（证明焦点丢失不是 jsdom 假象）", () => {
  it("被聚焦元素从 DOM 移除时，activeElement 退回 body（规范行为，jsdom 已实现）", () => {
    const a = document.createElement("button");
    a.textContent = "A";
    document.body.appendChild(a);
    a.focus();
    expect(document.activeElement).toBe(a);
    a.remove();
    expect(document.activeElement, "移除被聚焦元素后 activeElement 应退回 body").toBe(document.body);
  });

  it("复习页「下一张」按钮在判题后确实被卸载（不是仍在 DOM）", async () => {
    resetStorage();
    const data = seedAppData(
      cardsToData([
        makeSentenceCard({ id: "c1", sentence: "I am drawing a picture." }),
        makeSentenceCard({ id: "c2", sentence: "She is reading a book." })
      ])
    );
    const task = buildGrammarReviewTask(diversifyReviewModes(buildGrammarReviewSession(data))[0], data.sentenceDetails);
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    await flushAsync();
    keyboardActivate(buttonsOf(page).find((b) => (b.textContent ?? "").trim() === task.answer)!);
    await flushAsync();
    const next = enabledByText(page, /^(下一张|完成复习)$/)!;
    next.focus();
    clickElement(next);
    await flushAsync();
    const stillMounted = buttonsOf(page).includes(next);
    // eslint-disable-next-line no-console
    console.log(`[元验证] 「${(next.textContent ?? "").trim()}」判题后仍在 DOM = ${stillMounted}`);
    expect(stillMounted, "该按钮被卸载，浏览器因此把焦点退回 body").toBe(false);
    page.unmount();
  });
});

});
