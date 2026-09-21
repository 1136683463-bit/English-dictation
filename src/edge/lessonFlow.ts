/**
 * 边界验证用的「课程页操作」helper（2026-09-21）。
 *
 * 只做两件事：
 * 1) 把 DOM 操作补齐（打字、点指定容器里的按钮）——harness 的 click 按可见文本找按钮，
 *    而 arrange 题里「拼装区」和「词块库」会同时出现同名词块，必须按容器点。
 * 2) 用课程数据算出「正确答案序列」，让测试可以确定地答对 / 答错第 N 次。
 *
 * 纪律：这里不复制页面判题逻辑，只按答案把词块点进去；判多少、怎么判由页面自己决定。
 */
import { act } from "react";
import type { Mounted } from "./harness";
import { getGrammarLesson, guidedDisplayOrder } from "../services/lessonService";
import type { GrammarLesson, LessonGuidedStep } from "../types";

export type { Mounted };

/** 归一化：与页面判分同口径（小写、去标点、压空白）。 */
export const norm = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[.,!?;:'"’‘（），。？！、]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const lower = (value: string): string => value.trim().toLowerCase();

/** 直接派发 click（harness 的 click 按文本找，arrange 里会撞名）。 */
export const clickEl = (el: Element | undefined | null) => {
  if (!el) throw new Error("clickEl: 元素不存在");
  act(() => {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
};

/** 往受控 textarea / input 里输入（React 需要 native setter + input 事件）。 */
export const typeInto = (page: Mounted, value: string, selector = "textarea.large-textarea") => {
  const el = page.container.querySelector<HTMLTextAreaElement>(selector);
  if (!el) throw new Error(`typeInto: 找不到 ${selector}`);
  const proto = selector.startsWith("input") ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  act(() => {
    setter?.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

/** 在受控输入区敲一下键盘（React 的 keydown 也要包 act 才会同步冲渲染）。 */
export const pressKey = (
  page: Mounted,
  key: string,
  options: { shiftKey?: boolean; isComposing?: boolean; selector?: string } = {}
) => {
  const selector = options.selector ?? "textarea.large-textarea";
  const el = page.container.querySelector<HTMLTextAreaElement>(selector);
  if (!el) throw new Error(`pressKey: 找不到 ${selector}`);
  act(() => {
    el.dispatchEvent(
      new KeyboardEvent("keydown", {
        key,
        shiftKey: options.shiftKey ?? false,
        bubbles: true,
        cancelable: true
      })
    );
  });
};

export const textareaValue = (page: Mounted, selector = "textarea.large-textarea"): string =>
  page.container.querySelector<HTMLTextAreaElement>(selector)?.value ?? "";

/** 当前处于哪个段（按 section 的 aria-label 判定，比文本匹配稳）。 */
export const sectionLabels = (page: Mounted): string[] =>
  Array.from(page.container.querySelectorAll<HTMLElement>("section.lesson-stage[aria-label]")).map(
    (el) => el.getAttribute("aria-label") ?? ""
  );

export const inSection = (page: Mounted, label: string): boolean => sectionLabels(page).includes(label);

/** 拼装区（已选）词块按钮。 */
export const builtChips = (page: Mounted): HTMLButtonElement[] =>
  Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-build-area button.lesson-chip"));

/** 词块库（待选）词块按钮，按展示顺序。 */
export const bankChips = (page: Mounted): HTMLButtonElement[] =>
  Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-bank button.lesson-chip"));

export const bankWords = (page: Mounted): string[] => bankChips(page).map((el) => (el.textContent ?? "").trim());

export const builtWords = (page: Mounted): string[] => builtChips(page).map((el) => (el.textContent ?? "").trim());

/** 清空拼装区（点已选词块 = 移除）。 */
export const clearBuild = (page: Mounted) => {
  for (let guard = 0; guard < 40 && builtChips(page).length > 0; guard += 1) {
    clickEl(builtChips(page)[0]);
  }
};

/** 按归一化词从词块库点一个还没被用过的词块；返回是否点到。 */
const clickBankWord = (page: Mounted, word: string, used: Set<number>): boolean => {
  const chips = bankChips(page);
  const at = chips.findIndex((el, index) => !used.has(index) && norm(el.textContent ?? "") === norm(word));
  if (at < 0) return false;
  used.add(at);
  clickEl(chips[at]);
  return true;
};

/** 按答案顺序把词块点进拼装区（词块库里一定找得到——已由数据扫描保证）。 */
export const answerArrangeCorrectly = (page: Mounted, answer: string): boolean => {
  clearBuild(page);
  const used = new Set<number>();
  const words = norm(answer).split(" ").filter(Boolean);
  for (const word of words) {
    if (!clickBankWord(page, word, used)) return false;
  }
  return true;
};

/**
 * 制造一次「必然答错」的拼装：
 * - 词块库有干扰项时，用干扰项顶掉第一个答案词（词数与答案一致 → 一定触发判题）；
 * - 没有干扰项时，用「逆序」；逆序恰好等于答案就轮转一位。
 */
export const answerArrangeWrongly = (page: Mounted, answer: string): string[] => {
  clearBuild(page);
  const words = norm(answer).split(" ").filter(Boolean);
  const bank = bankWords(page).map(norm);
  const answerSet = new Set(words);
  const distractor = bank.find((word) => !answerSet.has(word) && word.length > 0);

  let sequence: string[];
  if (distractor && words.length > 1) {
    sequence = [distractor, ...words.slice(1)];
  } else if (distractor) {
    sequence = [distractor];
  } else {
    const reversed = [...words].reverse();
    sequence = reversed.join(" ") === words.join(" ") ? [...words.slice(1), words[0]] : reversed;
  }
  const used = new Set<number>();
  for (const word of sequence) {
    if (!clickBankWord(page, word, used)) break;
  }
  return sequence;
};

export interface GuidedEntry {
  step: LessonGuidedStep;
  /** 原数据下标。 */
  sourceIndex: number;
  /** 展示中的第几题（0 起）。 */
  displayIndex: number;
}

/** 某课 guided 的展示顺序（与页面 guidedDisplayOrderMemo 同源）。 */
export const guidedEntries = (lessonId: string): GuidedEntry[] => {
  const lesson = getGrammarLesson(lessonId);
  if (!lesson) throw new Error(`没有这一课：${lessonId}`);
  const order = guidedDisplayOrder(lesson.guided, lesson.id);
  return order.map((sourceIndex, displayIndex) => ({
    step: lesson.guided[sourceIndex],
    sourceIndex,
    displayIndex
  }));
};

export const lessonOf = (lessonId: string): GrammarLesson => {
  const lesson = getGrammarLesson(lessonId);
  if (!lesson) throw new Error(`没有这一课：${lessonId}`);
  return lesson;
};

/** 答对当前 guided 题（choose/replace/spot 点选项，arrange 按答案点词块）。 */
export const answerGuidedCorrectly = (page: Mounted, entry: GuidedEntry): boolean => {
  const step = entry.step;
  if (step.kind === "arrange") return answerArrangeCorrectly(page, step.answer);
  if (step.kind === "spot") {
    const target = step.wrongToken ?? step.answer;
    const chip = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-spot button.lesson-chip")).find(
      (el) => (el.textContent ?? "").trim() === target
    );
    clickEl(chip);
    return Boolean(chip);
  }
  const option = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-option")).find(
    (el) => norm(el.textContent ?? "") === norm(step.answer)
  );
  clickEl(option);
  return Boolean(option);
};

/** 答错当前 guided 题。 */
export const answerGuidedWrongly = (page: Mounted, entry: GuidedEntry): boolean => {
  const step = entry.step;
  if (step.kind === "arrange") {
    answerArrangeWrongly(page, step.answer);
    return true;
  }
  if (step.kind === "spot") {
    const target = step.wrongToken ?? step.answer;
    const chip = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-spot button.lesson-chip")).find(
      (el) => (el.textContent ?? "").trim() !== target
    );
    clickEl(chip);
    return true;
  }
  const option = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-option")).find(
    (el) => norm(el.textContent ?? "") !== norm(step.answer)
  );
  clickEl(option);
  return true;
};

/** 前测：答完两题（choose + contrast）。correct=false 时两题都答错。 */
export const answerPretest = (page: Mounted, lessonId: string, correct: boolean) => {
  const lesson = lessonOf(lessonId);
  const choose = lesson.guided.find((step) => step.kind === "choose");
  const contrast = (lesson.contrast ?? []).find((item) => !item.bothRight) ?? lesson.contrast?.[0];

  // 第 1 题：choose
  if (choose?.options?.length) {
    const pick = correct
      ? choose.options.find((option) => norm(option) === norm(choose.answer))
      : choose.options.find((option) => norm(option) !== norm(choose.answer));
    page.click(pick ?? choose.options[0]);
    page.clickMatch(/^(下一题|看看结果)$/);
  }
  // 第 2 题：contrast
  if (contrast) {
    const hasProblem = !contrast.bothRight;
    const wantProblem = correct ? hasProblem : !hasProblem;
    page.click(wantProblem ? "有问题" : "没问题");
    page.clickMatch(/^(下一题|看看结果)$/);
  }
};

/** 从「看」段走到 guided：点三次下一步/看懂了。 */
export const watchToGuided = (page: Mounted) => {
  page.click("下一步：搭装与对错");
  page.click("下一步：变奏");
  page.click("看懂了，试一试");
};

/** 做完一整段 guided（每题第一次答对）。答完最后题会跳到 recall 或 practice。 */
export const finishGuided = (page: Mounted, lessonId: string) => {
  const entries = guidedEntries(lessonId);
  for (const entry of entries) {
    answerGuidedCorrectly(page, entry);
    // 末题的按钮文案是「下面自己来」
    const next = page.buttons().includes("下一题") ? "下一题" : "下面自己来";
    page.click(next);
  }
};

/**
 * 做完一整段 practice（每题第一次答对）。
 * 末题后若本课对比组 >2，页面会先插一段「再看两组对错」，这里一并走完，
 * 停在产出段（outputActive=true）之前的「最后一步：说出来」按钮上。
 */
export const finishPractice = (page: Mounted, lessonId: string) => {
  const lesson = lessonOf(lessonId);
  for (let index = 0; index < lesson.practice.length; index += 1) {
    const answer = lesson.practice[index].answer;
    if (!answerArrangeCorrectly(page, answer)) throw new Error(`第 ${index + 1} 题词块点不齐：${answer}`);
    const last = index + 1 >= lesson.practice.length;
    page.click(last ? "最后一步：说出来" : "下一题");
  }
  // 中段对比（aria-label="再看两组对错"）：判完每张卡才会出现通往产出段的按钮
  const midContrast = page.container.querySelector('[aria-label="再看两组对错"]');
  if (midContrast) {
    const cards = Array.from(midContrast.querySelectorAll<HTMLElement>(".lesson-contrast-card"));
    for (const card of cards) {
      const options = Array.from(card.querySelectorAll<HTMLButtonElement>("button.lesson-option"));
      if (options.length > 0) clickEl(options[0]);
    }
    page.click("最后一步：说出来");
  }
};

/**
 * 做完 output 段（两档产出）。策略：每题先用提示阶梯跳到 level 3 拿到「正确答案」，
 * 再照着打进去提交（等于「看答案后自己打」的正规路径），最后点「完成这一课」。
 */
export const finishOutput = (page: Mounted) => {
  for (let guard = 0; guard < 12; guard += 1) {
    if (page.buttons().includes("完成这一课")) {
      page.click("完成这一课");
      return;
    }
    if (page.buttons().includes("下一句（这次没有提示）")) {
      page.click("下一句（这次没有提示）");
      continue;
    }
    if (page.buttons().includes("想不起来？给我一点提示")) {
      page.click("想不起来？给我一点提示");
      continue;
    }
    if (page.buttons().includes("还是想不起来，再看一点")) {
      page.click("还是想不起来，再看一点");
      continue;
    }
    if (page.buttons().includes("还是想不起来，直接看答案")) {
      page.click("还是想不起来，直接看答案");
      continue;
    }
    if (page.buttons().includes("想不起来了，看答案")) {
      page.click("想不起来了，看答案");
      continue;
    }
    if (page.buttons().includes("照着打一遍（会排进复习队列）")) {
      page.click("照着打一遍（会排进复习队列）");
      continue;
    }
    // level 3 已显示「正确答案：X」——照抄提交
    const cardText = page.container.querySelector(".lesson-quiz-card")?.textContent ?? "";
    const revealed = /正确答案：([^。]+?)(?=想不起来|$)/.exec(cardText)?.[1]?.trim();
    if (revealed) {
      typeInto(page, revealed);
      const submit = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button.primary-button")).find(
        (el) => (el.textContent ?? "").trim() === "提交"
      );
      if (submit && !submit.disabled) {
        clickEl(submit);
        continue;
      }
    }
    throw new Error(`finishOutput 卡住，当前按钮：${page.buttons().filter(Boolean).join(" | ")}`);
  }
  throw new Error("finishOutput 轮次用尽");
};

/** 读取卡片数据（完课复习队列）。 */
export const readAppData = (): {
  grammarLessonsDone: string[];
  grammarLessonStagesDone: Record<string, number[]>;
  cards: Array<{ type: string; front: string; sourceId?: string; tags?: string[] }>;
} => {
  const raw = window.localStorage.getItem("personal-vocab-app-data-v1");
  if (!raw) return { grammarLessonsDone: [], grammarLessonStagesDone: {}, cards: [] };
  const parsed = JSON.parse(raw) as Record<string, unknown>;
  return {
    grammarLessonsDone: (parsed.grammarLessonsDone as string[]) ?? [],
    grammarLessonStagesDone: (parsed.grammarLessonStagesDone as Record<string, number[]>) ?? {},
    cards: (parsed.cards as Array<{ type: string; front: string; sourceId?: string; tags?: string[] }>) ?? []
  };
};

/** 句子卡（SM-2 复习队列）——完课/答错时入队。 */
export const sentenceCards = () => readAppData().cards.filter((card) => card.type === "sentence");

/**
 * AppContext 的 updateData 是「微任务队列 + 写盘」，点击后立刻读 localStorage 会读到旧值。
 * 冲两轮微任务再读，才能看到已提交的完成态与入队卡片。
 */
export const flushData = async () => {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
};

/** 预置「已完成的课」，用来关掉首课导览化（isFirstEverLesson）。 */
export const markLessonsDoneInStorage = (lessonIds: string[]) => {
  const raw = window.localStorage.getItem("personal-vocab-app-data-v1");
  if (!raw) throw new Error("存储里还没有数据，先挂载一次页面");
  const parsed = JSON.parse(raw) as Record<string, unknown>;
  parsed.grammarLessonsDone = lessonIds;
  window.localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(parsed));
};

export const storeFirst = (lessonId: string, data: Record<string, unknown>) => {
  window.localStorage.setItem(`grammar:resume:${lessonId}`, JSON.stringify(data));
};
