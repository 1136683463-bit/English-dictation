/**
 * 页面驱动工具（2026-09-21）：把「按正确答案作答」这件事封装起来，
 * 让边界验证用例可以走完整会话而不必手写每种题型的点击序列。
 *
 * 只用 DOM + React act，不依赖任何测试库（项目没有 @testing-library）。
 */
import { act } from "react";
import { diversifyReviewModes, buildGrammarReviewSession, buildGrammarReviewTask } from "../../services/grammarReviewService";
import { boostArrangeAnswerLength, type BoostItem } from "../../services/grammarBoostService";
import type { AppData } from "../../types";
import type { Mounted } from "../harness";

/**
 * 点一个元素。
 *
 * 参数放宽为 `Element | null | undefined`（2026-09-21）：调用方普遍写成
 * `clickElement(find(...))`，而 `find` / `querySelector` 的类型本身就含 undefined。
 * 此前每个调用点都得写一次非空断言（实测 20+ 处 tsc 报错，噪声掩盖真实问题）。
 * 找不到元素时**静默跳过**在测试里是可接受的行为——真正的断言会在随后的
 * `expect(...)` 上失败，那条信息比这里抛 TypeError 更清楚。
 */
export const clickElement = (element: Element | null | undefined): void => {
  if (!element) return;
  act(() => {
    (element as HTMLElement).click();
  });
};

export const setInputValue = (field: HTMLInputElement | HTMLTextAreaElement, value: string): void => {
  const prototype = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
  act(() => {
    setter?.call(field, value);
    field.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

const buttonsMatching = (container: HTMLElement, selector: string): HTMLButtonElement[] =>
  Array.from(container.querySelectorAll(selector)) as HTMLButtonElement[];

/** 所有可用按钮中，文本包含子串的第一个（档位卡等按钮文本含多行说明）。 */
export const clickButtonContaining = (page: Mounted, needle: string): void => {
  const button = buttonsMatching(page.container, "button").find(
    (item) => !item.disabled && (item.textContent ?? "").includes(needle)
  );
  if (!button) throw new Error(`找不到包含「${needle}」的按钮；当前按钮：${page.buttons().join(" | ")}`);
  clickElement(button);
};

/** 所有按钮（排除 disabled）中，文本精确等于 label 的第一个。 */
const enabledButtonByText = (container: HTMLElement, label: string): HTMLButtonElement | undefined =>
  buttonsMatching(container, "button").find((button) => !button.disabled && (button.textContent ?? "").trim() === label);

const anyButtonByText = (container: HTMLElement, label: RegExp): HTMLButtonElement | undefined =>
  buttonsMatching(container, "button").find((button) => !button.disabled && label.test((button.textContent ?? "").trim()));

export const typeText = (page: Mounted, value: string): void => {
  const field = page.container.querySelector("textarea, input.large-textarea, input");
  if (!field) throw new Error("页面上没有可输入的文本框");
  setInputValue(field as HTMLInputElement, value);
};

export const clickText = (page: Mounted, label: string): void => {
  const button = enabledButtonByText(page.container, label);
  if (!button) throw new Error(`找不到可用按钮「${label}」；当前按钮：${page.buttons().join(" | ")}`);
  clickElement(button);
};

/**
 * 让 AppContext 的异步 updateData 队列落盘。
 * updateData 走的是 promise 链（waitForQueuedUpdates().then(...)），
 * 同步的 act() 不保证微任务已冲洗完，所以这里显式 await 一个宏任务。
 */
export const flushAsync = async (): Promise<void> => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

// ── 复习页 ─────────────────────────────────────────────────

export interface ReviewSessionPlan {
  total: number;
  /** 每一步该怎么做（不含具体元素定位，只有题型与答案）。 */
  steps: Array<
    | { mode: "cloze"; answer: string }
    | { mode: "rebuild"; tokens: string[] }
    | { mode: "free_type"; sentence: string }
  >;
}

/**
 * 复现页面会组出的会话（同一份纯函数 + 同一份 data），得到每张卡的题型与答案。
 * 页面在挂载时组一次会话、之后不再重排，所以这里的结果与页面内一致。
 */
export const planReviewSession = (data: AppData): ReviewSessionPlan => {
  const session = diversifyReviewModes(buildGrammarReviewSession(data), data.sentenceDetails);
  const steps = session.map((item) => {
    const task = buildGrammarReviewTask(item, data.sentenceDetails);
    if (task.mode === "cloze") return { mode: "cloze" as const, answer: task.answer };
    if (task.mode === "rebuild") return { mode: "rebuild" as const, tokens: task.sentence.split(/\s+/).filter(Boolean) };
    return { mode: "free_type" as const, sentence: task.sentence };
  });
  return { total: session.length, steps };
};

/**
 * 作答当前这一张复习卡（按 plan 的第 index 步）。
 * @returns "passed" | "stuck"
 */
export const answerReviewStep = (page: Mounted, step: ReviewSessionPlan["steps"][number]): "passed" | "stuck" => {
  if (step.mode === "cloze") {
    const button = enabledButtonByText(page.container, step.answer);
    if (!button) return "stuck";
    clickElement(button);
    return "passed";
  }
  if (step.mode === "rebuild") {
    for (const token of step.tokens) {
      const chip = buttonsMatching(page.container, ".lesson-bank button").find(
        (button) => !button.disabled && (button.textContent ?? "").trim() === token
      );
      if (!chip) return "stuck";
      clickElement(chip);
    }
    return "passed";
  }
  typeText(page, step.sentence);
  const submit = enabledButtonByText(page.container, "提交");
  if (!submit) return "stuck";
  clickElement(submit);
  return "passed";
};

/** 走完整个复习会话（全部答对）。返回实际作答的卡片数。 */
export const completeReviewSession = (page: Mounted, data: AppData, options: { revealEvery?: number } = {}): number => {
  const plan = planReviewSession(data);
  let answered = 0;
  for (const step of plan.steps) {
    if (page.has("复习完成")) break;
    const result = answerReviewStep(page, step);
    if (result === "stuck") break;
    answered += 1;
    if (options.revealEvery && answered % options.revealEvery === 0) {
      // 偶尔走「看答案」路径（需要先错一次才会出现该按钮）
      const reveal = anyButtonByText(page.container, /看答案/);
      if (reveal) clickElement(reveal);
    }
    const next = anyButtonByText(page.container, /^(下一张|完成复习)$/);
    if (!next) break;
    clickElement(next);
  }
  return answered;
};

// ── 强化页 ─────────────────────────────────────────────────

/** 按正确答案作答当前这一道强化题（不点「下一题」）。 */
export const answerBoostItem = (page: Mounted, item: BoostItem): "passed" | "stuck" => {
  switch (item.kind) {
    case "contrast": {
      // contrast 题的 answer 是「正确句」，isWrong 恒为 true → 应选「有点问题」
      const pick = enabledButtonByText(page.container, item.contrast?.isWrong ? "有点问题" : "没问题");
      if (!pick) return "stuck";
      clickElement(pick);
      const confirm = enabledButtonByText(page.container, "确认");
      if (!confirm) return "stuck";
      clickElement(confirm);
      return "passed";
    }
    case "bothright": {
      const pick = enabledButtonByText(page.container, "两句都对");
      if (!pick) return "stuck";
      clickElement(pick);
      return "passed";
    }
    case "listen": {
      const option = enabledButtonByText(page.container, item.listenText ?? item.answer);
      if (!option) return "stuck";
      clickElement(option);
      return "passed";
    }
    case "spot": {
      const index = item.spotWrongIndexes?.length ? item.spotWrongIndexes[0] : (item.spotWrongIndex ?? -1);
      const tokens = buttonsMatching(page.container, ".lesson-spot-row button");
      const chip = tokens[index];
      if (!chip) return "stuck";
      clickElement(chip);
      return "passed";
    }
    case "cloze": {
      const option = enabledButtonByText(page.container, item.clozeAnswer ?? "");
      if (!option) return "stuck";
      clickElement(option);
      const confirm = enabledButtonByText(page.container, "确认");
      if (!confirm) return "stuck";
      clickElement(confirm);
      return "passed";
    }
    case "choose":
    case "replace": {
      const option = enabledButtonByText(page.container, item.answer);
      if (!option) return "stuck";
      clickElement(option);
      return "passed";
    }
    case "rebuild":
    case "arrange": {
      const answerTokens = item.answer.split(/\s+/).filter(Boolean);
      const bank = buttonsMatching(page.container, ".lesson-spot-row button");
      const used = new Set<number>();
      for (let step = 0; step < boostArrangeAnswerLength(item); step += 1) {
        const token = answerTokens[step];
        const chipIndex = bank.findIndex(
          (button, position) => !used.has(position) && !button.disabled && (button.textContent ?? "").trim() === token
        );
        if (chipIndex < 0) return "stuck";
        used.add(chipIndex);
        clickElement(bank[chipIndex]);
      }
      return "passed";
    }
    default: {
      typeText(page, item.answer);
      const submit = enabledButtonByText(page.container, "提交");
      if (!submit) return "stuck";
      clickElement(submit);
      return "passed";
    }
  }
};

/** 点掉反馈区的「下一题 / 完成这一档」。 */
export const advanceBoost = (page: Mounted): void => {
  const next = anyButtonByText(page.container, /^(下一题|完成这一档)$/);
  if (!next) throw new Error(`反馈区没有下一题按钮；当前按钮：${page.buttons().join(" | ")}`);
  clickElement(next);
};

/** 走完当前档的全部题目（全部答对）。返回实际作答题数。 */
export const completeBoostTier = (page: Mounted, items: BoostItem[]): number => {
  let answered = 0;
  for (const item of items) {
    if (page.has("这一课的记忆稳住了") || page.has("又稳了一层")) break;
    const result = answerBoostItem(page, item);
    if (result === "stuck") break;
    answered += 1;
    if (!anyButtonByText(page.container, /^(下一题|完成这一档)$/)) break;
    advanceBoost(page);
  }
  return answered;
};

/**
 * 先故意答错一次、再答对（验证「先错后对」也能推进，即无正确率门禁）。
 * 只有部分题型提供「看答案」；这里走「再试一次 → 答对」的通用路径。
 */
export const failOnceThenPass = (page: Mounted, item: BoostItem): "passed" | "stuck" => {
  const wrongChoice = (labels: string[]): boolean => {
    const button = enabledButtonByText(page.container, labels[0] ?? "");
    if (!button) return false;
    clickElement(button);
    return true;
  };
  switch (item.kind) {
    case "contrast":
      wrongChoice([item.contrast?.isWrong ? "没问题" : "有点问题"]);
      clickText(page, "确认");
      break;
    case "bothright":
      wrongChoice(["只有一句对"]);
      break;
    case "spot": {
      const wrongIndex = item.spotWrongIndexes?.length ? item.spotWrongIndexes[0] : (item.spotWrongIndex ?? -1);
      const chips = buttonsMatching(page.container, ".lesson-spot-row button");
      const target = chips.find((chip, position) => position !== wrongIndex && !chip.disabled);
      if (target) clickElement(target);
      break;
    }
    case "cloze":
    case "choose":
    case "replace": {
      const wrong = buttonsMatching(page.container, "button").find(
        (button) =>
          !button.disabled &&
          (button.textContent ?? "").trim() !== "" &&
          ![item.answer, item.clozeAnswer ?? ""].includes((button.textContent ?? "").trim()) &&
          button.className.includes("boost-choice")
      );
      if (wrong) clickElement(wrong);
      if (item.kind === "cloze") clickText(page, "确认");
      break;
    }
    case "listen": {
      const wrong = buttonsMatching(page.container, "button").find(
        (button) =>
          !button.disabled &&
          button.className.includes("boost-listen-option") &&
          (button.textContent ?? "").trim() !== (item.listenText ?? "")
      );
      if (wrong) clickElement(wrong);
      break;
    }
    default: {
      typeText(page, "completely wrong answer");
      const submit = enabledButtonByText(page.container, "提交");
      if (submit) clickElement(submit);
      break;
    }
  }
  // 进入 retry 态 → 点「再试一次」回到 idle
  const retry = anyButtonByText(page.container, /再试一次/);
  if (!retry) return "stuck";
  clickElement(retry);
  return answerBoostItem(page, item);
};
