// @vitest-environment jsdom
/**
 * KB3 · 复习页（GrammarReviewPage）与侦探页（GrammarHuntPage）的键盘路径
 *
 * - GrammarReviewPage:268 自由输出回车提交
 * - GrammarHuntPage:608-620 role=button + tabIndex + Enter/Space（"只有 tabIndex 没有 role" 的反例，验证它是否配齐）
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import GrammarHuntPage from "../../pages/GrammarHuntPage";
import { grammarLessons } from "../../data/grammarLessons";
import { huntCases } from "../../data/huntCases";
import { cardsToData, makeSentenceCard, seedAppData } from "./fixtures";
import { clickElement, flushAsync, planReviewSession, setInputValue } from "./drive";
import type { ReviewSessionPlan } from "./drive";
import { fireKey, focusableIn, accessibleName, fireBodyKey } from "./kbd";
import type { Mounted } from "../harness";

const mountReview = (): Mounted => mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");

/** 造若干张到期句子卡，保证会话里出现 free_type / rebuild / cloze。 */
const seedReviewCards = () => {
  const sentences = [
    "I am drawing a picture of my sister.",
    "She is reading a book in the living room.",
    "They are playing football in the park.",
    "He is not watching TV right now.",
    "Are you listening to me carefully?",
    "We are having dinner at seven.",
    "It is raining outside today.",
    "My brother is doing his homework."
  ];
  const fixtures = sentences.map((sentence, index) =>
    makeSentenceCard({
      id: `kb-card-${index}`,
      sentence,
      note: `语法课核心句：第 ${index + 1} 课`,
      sourceId: `lesson:lesson-13-now`,
      // reviewCount ≥ FREE_TYPE_MIN_REVIEW_COUNT（2）→ 题型轮换到 free_type（有输入框）
      schedule: { reviewCount: 3 }
    })
  );
  return seedAppData(cardsToData(fixtures));
};

/** 逐张答对，推进到第 target 张。 */
const advanceTo = async (page: Mounted, plan: ReviewSessionPlan, target: number): Promise<void> => {
  for (let i = 0; i < target; i += 1) {
    const step = plan.steps[i];
    if (step.mode === "cloze") {
      const btn = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button.lesson-option")).find(
        (b) => (b.textContent ?? "").trim() === step.answer
      );
      if (btn) clickElement(btn);
    } else if (step.mode === "rebuild") {
      for (const token of step.tokens) {
        const chip = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-bank button")).find(
          (b) => !b.disabled && (b.textContent ?? "").trim() === token
        );
        if (chip) clickElement(chip);
      }
    }
    await flushAsync();
    const next = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find((b) =>
      /^(下一张|完成复习)$/.test((b.textContent ?? "").trim())
    );
    if (next) clickElement(next);
    await flushAsync();
  }
};

describe("KB3 复习页 / 侦探页键盘路径", () => {
  beforeEach(() => resetStorage());

  it("KB3-1 复习页 free_type：回车提交等价于点「提交」", async () => {
    const data = seedReviewCards();
    const plan = planReviewSession(data);
    const freeStepIndex = plan.steps.findIndex((step) => step.mode === "free_type");
    const page = mountReview();
    await flushAsync();
    await advanceTo(page, plan, freeStepIndex);
    const field = page.container.querySelector<HTMLTextAreaElement>("textarea.large-textarea");
    expect(field, `第 ${freeStepIndex + 1} 张应是 free_type（实际题面：${page.text().slice(0, 80)}）`).toBeTruthy();
    const answer = plan.steps[freeStepIndex].mode === "free_type" ? (plan.steps[freeStepIndex] as { sentence: string }).sentence : "";
    setInputValue(field!, answer);
    await flushAsync();
    const event = fireKey(field, "Enter");
    await flushAsync();
    expect(event.defaultPrevented, "回车应被处理").toBe(true);
    expect(
      page.container.querySelector(".lesson-feedback.pass, .lesson-feedback.retry"),
      "回车应产生反馈"
    ).toBeTruthy();
    page.unmount();
  });

  it("KB3-2 复习页 free_type：组词态回车不提交、Shift+Enter 不提交", async () => {
    const data = seedReviewCards();
    const plan = planReviewSession(data);
    const freeIndex = plan.steps.findIndex((step) => step.mode === "free_type");
    const page = mountReview();
    await flushAsync();
    await advanceTo(page, plan, freeIndex);
    const field = page.container.querySelector<HTMLTextAreaElement>("textarea.large-textarea");
    if (!field) {
      page.unmount();
      return;
    }
    setInputValue(field, "I am drawing a picture");
    await flushAsync();
    const composing = fireKey(field, "Enter", { isComposing: true, keyCode: 229 });
    await flushAsync();
    expect(composing.defaultPrevented, "复习页组词态回车不应被 preventDefault").toBe(false);
    expect(page.container.querySelector(".lesson-feedback"), "组词态回车不应产生反馈").toBeNull();
    const shift = fireKey(field, "Enter", { shiftKey: true });
    expect(shift.defaultPrevented, "复习页 Shift+Enter 不应被 preventDefault").toBe(false);
    expect(page.container.querySelector(".lesson-feedback"), "Shift+Enter 不应提交").toBeNull();
    page.unmount();
  });

  it("KB3-3 复习页：所有可点元素都在 Tab 序列内（拼装/选项/入口链接）", async () => {
    seedReviewCards();
    const page = mountReview();
    await flushAsync();
    const buttons = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).filter((b) => !b.disabled);
    const focusables = focusableIn(page.container);
    const missing = buttons.filter((b) => !focusables.includes(b));
    expect(
      missing.map((b) => (b.textContent ?? "").trim()),
      "有按钮不在 Tab 序列内 = 键盘到不了"
    ).toEqual([]);
    const links = Array.from(page.container.querySelectorAll<HTMLAnchorElement>("a[href]"));
    const missingLinks = links.filter((a) => !focusables.includes(a));
    expect(missingLinks.map((a) => (a.textContent ?? "").trim())).toEqual([]);
    page.unmount();
  });

  it("KB3-4 复习页：不可用（disabled）的选项被排除，键盘不会掉进死元素", async () => {
    seedReviewCards();
    const page = mountReview();
    await flushAsync();
    const disabled = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button[disabled]"));
    for (const button of disabled) {
      expect(focusableIn(page.container).includes(button), "disabled 按钮不应可聚焦").toBe(false);
    }
    page.unmount();
  });

  it("KB3-5 侦探页词块：span[role=button][tabIndex=0] 有 role 且有 Enter/Space handler", async () => {
    const caseId = "hunt-call-mother";
    const lessons = grammarLessons.filter((lesson) => lesson.huntCaseIds.includes(caseId)).map((l) => l.id);
    seedAppData({ grammarLessonsDone: lessons });
    const page = mountPage(<GrammarHuntPage />, `/grammar/hunt?case=${caseId}`, "/grammar/hunt");
    await flushAsync();
    const tokens = Array.from(page.container.querySelectorAll<HTMLElement>(".hunt-token"));
    expect(tokens.length, "案件原文应有词块").toBeGreaterThan(0);
    for (const token of tokens) {
      expect(token.getAttribute("role"), "每个词块都应有 role=button").toBe("button");
      expect(token.getAttribute("tabindex"), "每个词块都应在 Tab 序列内").toBe("0");
      expect(accessibleName(token).length, "每个词块都应有可读名").toBeGreaterThan(0);
    }
    // Enter 与 Space 都应打开罪名选择（等价于点击）
    const first = tokens[0];
    const enter = fireKey(first, "Enter");
    await flushAsync();
    expect(enter.defaultPrevented, "Enter 应被处理（preventDefault 阻止滚动/提交）").toBe(true);
    expect(
      page.container.querySelector(".hunt-tag-grid"),
      "Enter 后应出现罪名选择（等价于点击）"
    ).toBeTruthy();
    page.unmount();
  });

  it("KB3-6 侦探页词块：Space 也能触发（与 Enter 等价）", async () => {
    const caseId = "hunt-call-mother";
    const lessons = grammarLessons.filter((lesson) => lesson.huntCaseIds.includes(caseId)).map((l) => l.id);
    seedAppData({ grammarLessonsDone: lessons });
    const page = mountPage(<GrammarHuntPage />, `/grammar/hunt?case=${caseId}`, "/grammar/hunt");
    await flushAsync();
    const tokens = Array.from(page.container.querySelectorAll<HTMLElement>(".hunt-token"));
    const space = fireKey(tokens[1] ?? tokens[0], " ");
    await flushAsync();
    expect(space.defaultPrevented, "Space 应被处理（阻止页面滚动）").toBe(true);
    expect(page.container.querySelector(".hunt-tag-grid"), "Space 后应出现罪名选择").toBeTruthy();
    page.unmount();
  });

  it("KB3-7 侦探页：罪名按钮都在 Tab 序列内且都有可读名", async () => {
    const caseId = "hunt-call-mother";
    const lessons = grammarLessons.filter((lesson) => lesson.huntCaseIds.includes(caseId)).map((l) => l.id);
    seedAppData({ grammarLessonsDone: lessons });
    const page = mountPage(<GrammarHuntPage />, `/grammar/hunt?case=${caseId}`, "/grammar/hunt");
    await flushAsync();
    const tokens = Array.from(page.container.querySelectorAll<HTMLElement>(".hunt-token"));
    fireKey(tokens[0], "Enter");
    await flushAsync();
    const tagButtons = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".hunt-tag-btn"));
    expect(tagButtons.length, "应出现罪名按钮").toBeGreaterThan(0);
    const focusables = focusableIn(page.container);
    for (const button of tagButtons) {
      expect(focusables.includes(button), "罪名按钮应可 Tab 到").toBe(true);
      expect(accessibleName(button).length, "罪名按钮应有可读名").toBeGreaterThan(0);
    }
    page.unmount();
  });

  it("KB3-8 侦探页：Escape 不改变任何状态（无关闭行为，也不误伤）", async () => {
    const caseId = "hunt-call-mother";
    const lessons = grammarLessons.filter((lesson) => lesson.huntCaseIds.includes(caseId)).map((l) => l.id);
    seedAppData({ grammarLessonsDone: lessons });
    const page = mountPage(<GrammarHuntPage />, `/grammar/hunt?case=${caseId}`, "/grammar/hunt");
    await flushAsync();
    const tokens = Array.from(page.container.querySelectorAll<HTMLElement>(".hunt-token"));
    fireKey(tokens[0], "Enter");
    await flushAsync();
    const before = page.text();
    fireKey(document.body, "Escape");
    await flushAsync();
    expect(page.text(), "Escape 不应误伤页面状态").toBe(before);
    // 事实记录：罪名选择面板没有 Escape 关闭（用户必须再点一次词块）
    expect(
      page.container.querySelector(".hunt-tag-grid"),
      "事实：罪名选择面板对 Escape 无响应（仍然展开）"
    ).toBeTruthy();
    page.unmount();
  });
});

void huntCases;
void fireBodyKey;
