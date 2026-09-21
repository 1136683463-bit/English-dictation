/**
 * 拖拽专项验证的驱动工具（2026-09-21）。
 *
 * ## 为什么需要它：jsdom 没有 HTML5 拖拽
 * 实测（见 dg1 首个用例的 PROBE 输出）：
 * - `globalThis.DragEvent` === undefined，`globalThis.DataTransfer` === undefined；
 * - 因此 `new DragEvent(...)` 抛 TypeError，只能用 `new MouseEvent(type, {bubbles:true})` 顶替
 *   （事件类型字符串仍是 "dragstart" / "dragover" / "drop" / "dragend"，React 按其注册的
 *    SimpleEventPlugin 照常派发到 onDragStart / onDragOver / onDrop / onDragEnd）。
 * - `MouseEvent` 实例上没有 `dataTransfer`，页面 onDragStart 里的
 *   `event.dataTransfer.setData(...)` 会读到 undefined → 抛错。所以这里用一个最小桩对象，
 *   挂在事件上（`Object.defineProperty(event, "dataTransfer", ...)`）。
 *
 * ## 桩了什么（真实浏览器里由谁提供）
 * | 桩的部分 | 真实浏览器 |
 * | --- | --- |
 * | `dataTransfer.setData/getData` 的内存 Map | 浏览器实现的 DataTransfer，drop 时携带 |
 * | 事件对象本身（MouseEvent + 手挂 dataTransfer） | 浏览器合成 DragEvent，自动带 dataTransfer |
 * | `draggable=false` 不产生 dragstart | 浏览器**真的不会**为 draggable=false 的元素发起拖拽 |
 *
 * 也就是说：本文件测的是**页面的事件处理逻辑与状态机**；「浏览器是否会为这个元素发起
 * 拖拽」（draggable 属性的拦截）在 jsdom 里无法由浏览器自己保证，只能测「即使发起了，
 * 页面是否守得住」。真实浏览器差异在报告里逐条标注。
 *
 * 纪律：不复制页面判题/排序逻辑，只派发事件 + 读 DOM。
 */
import { act } from "react";
import type { Mounted } from "../harness";
import { clickElement, flushAsync } from "./drive";
import { makeAppData } from "./fixtures";
import { getGrammarLesson, guidedDisplayOrder } from "../../services/lessonService";
import type { LessonGuidedStep } from "../../types";

export const DRAG_LESSON_ID = "lesson-13-now";
export const DRAG_LESSON_PATH = `/grammar/lesson/${DRAG_LESSON_ID}`;
export const DRAG_ROUTE = "/grammar/lesson/:lessonId";

/** 造数据：一份干净的 AppData（不预置任何已完成课程 → 首课导览化只影响第 1 课）。 */
export const seedDragStorage = (patch: Record<string, unknown> = {}): void => {
  window.localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(makeAppData(patch)));
};

/** 所有可用（未禁用）按钮里，文本匹配正则的第一个。 */
export const enabledButton = (page: Mounted, pattern: RegExp): HTMLButtonElement | undefined =>
  (Array.from(page.container.querySelectorAll("button")) as HTMLButtonElement[]).find(
    (button) => !button.disabled && pattern.test((button.textContent ?? "").trim())
  );

const clickAndFlush = async (page: Mounted, pattern: RegExp): Promise<boolean> => {
  const button = enabledButton(page, pattern);
  if (!button) return false;
  clickElement(button);
  await flushAsync();
  return true;
};

/**
 * 走到 guided 段第一题（本课是 arrange）。
 * 路径：前测（choose → 对比）→ 开始上课 → 讲解三步 → 试一试。
 * 首课（lesson-01）是导览化的，本 helper 只用于非首课。
 */
export const reachGuided = async (page: Mounted): Promise<void> => {
  await clickAndFlush(page, /^is$/); // 前测第 1 题：She ___ reading.（答案是 is）
  await clickAndFlush(page, /^(下一题|看看结果)$/);
  await clickAndFlush(page, /^(有问题|没问题|有点问题)$/); // 前测第 2 题：看出问题
  await clickAndFlush(page, /^(看看结果|下一题)$/);
  await clickAndFlush(page, /^开始上课$/);
  await clickAndFlush(page, /^下一步：搭装与对错$/);
  await clickAndFlush(page, /^下一步：变奏$/);
  await clickAndFlush(page, /^看懂了，试一试$/);
};

/**
 * 直接落到「练」段第 index 题：写一份续学快照，挂载后点「继续刚才」。
 * 这是产品的正规入口（跨会话续学），比从头走完 guided 快得多。
 */
export const reachPractice = async (page: Mounted, index = 0): Promise<void> => {
  window.localStorage.setItem(
    `grammar:resume:${DRAG_LESSON_ID}`,
    JSON.stringify({
      lessonId: DRAG_LESSON_ID,
      savedAt: new Date().toISOString(),
      stage: "practice",
      step: index,
      practiceIndex: index,
      outputStep: -1,
      guidedIndex: -1
    })
  );
  // 挂载是在写快照之前发生的，所以这里手动触发一次「进课读数」——重新挂载由调用方负责。
  await flushAsync();
};

/** 本课 guided 第 displayIndex 题的 arrange 步骤（用于核对答案与词块）。 */
export const guidedArrangeStep = (displayIndex: number): LessonGuidedStep => {
  const lesson = getGrammarLesson(DRAG_LESSON_ID);
  if (!lesson) throw new Error("本课不存在");
  const order = guidedDisplayOrder(lesson.guided, lesson.id);
  const step = lesson.guided[order[displayIndex] ?? displayIndex];
  if (!step || step.kind !== "arrange") throw new Error(`第 ${displayIndex} 题不是 arrange`);
  return step;
};

/** practice 第 index 题的 arrange 步骤（数据里 practice 恒有 tokens/distractors）。 */
export const practiceArrangeStep = (index: number) => {
  const lesson = getGrammarLesson(DRAG_LESSON_ID);
  const step = lesson?.practice[index];
  if (!step) throw new Error(`practice 第 ${index} 题不存在`);
  return step;
};

/** DataTransfer 的最小桩：setData / getData / clearData / 常用只读字段。 */
export interface DataTransferStub {
  dropEffect: string;
  effectAllowed: string;
  readonly types: string[];
  setData: (type: string, value: string) => void;
  getData: (type: string) => string;
  clearData: (type?: string) => void;
  setDragImage: () => void;
}

export const makeDataTransfer = (): DataTransferStub => {
  const store = new Map<string, string>();
  return {
    dropEffect: "none",
    effectAllowed: "all",
    get types() {
      return [...store.keys()];
    },
    setData: (type, value) => {
      store.set(type, String(value));
    },
    getData: (type) => store.get(type) ?? "",
    clearData: (type) => {
      if (type === undefined) store.clear();
      else store.delete(type);
    },
    setDragImage: () => undefined
  };
};

export type DragType = "dragstart" | "dragover" | "dragenter" | "dragleave" | "drop" | "dragend";

/**
 * 造一个带 dataTransfer 的拖拽事件。
 * jsdom 没有 DragEvent，用 MouseEvent 顶替（React 只按 type 分发）。
 */
export const makeDragEvent = (type: DragType, dataTransfer: DataTransferStub): Event => {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, "dataTransfer", { value: dataTransfer, configurable: true });
  return event;
};

export const fireDrag = (element: Element, type: DragType, dataTransfer: DataTransferStub): void => {
  act(() => {
    element.dispatchEvent(makeDragEvent(type, dataTransfer));
  });
};

export interface DragOptions {
  /** 不派发 dragend（模拟「拖到区外后浏览器没有回报 dragend」这一异常路径）。 */
  skipDragEnd?: boolean;
  dataTransfer?: DataTransferStub;
}

/**
 * 一次完整拖拽：dragstart(源) → dragover(靶) → drop(靶) → dragend(源)。
 * 真实浏览器里这条序列是最常见的「拖到靶上松手」。
 */
export const dragTo = (source: Element, target: Element, options: DragOptions = {}): DataTransferStub => {
  const dataTransfer = options.dataTransfer ?? makeDataTransfer();
  fireDrag(source, "dragstart", dataTransfer);
  fireDrag(target, "dragover", dataTransfer);
  fireDrag(target, "drop", dataTransfer);
  if (!options.skipDragEnd) fireDrag(source, "dragend", dataTransfer);
  return dataTransfer;
};

/** 拖到区外松手：真实浏览器行为是「不派发 drop，只在源上派发 dragend」。 */
export const dragOutside = (source: Element, options: DragOptions = {}): DataTransferStub => {
  const dataTransfer = options.dataTransfer ?? makeDataTransfer();
  fireDrag(source, "dragstart", dataTransfer);
  if (!options.skipDragEnd) fireDrag(source, "dragend", dataTransfer);
  return dataTransfer;
};

// ── DOM 读取 ────────────────────────────────────────────────

export const buildArea = (page: Mounted): HTMLElement | null =>
  page.container.querySelector<HTMLElement>(".lesson-build-area");

export const bankArea = (page: Mounted): HTMLElement | null =>
  page.container.querySelector<HTMLElement>(".lesson-bank");

/** 拼装区（已摆）词块，按位置上。 */
export const builtChips = (page: Mounted): HTMLButtonElement[] =>
  Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-build-area button.lesson-chip"));

/** 词块库词块，按展示顺序。 */
export const bankChips = (page: Mounted): HTMLButtonElement[] =>
  Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-bank button.lesson-chip"));

export const builtWords = (page: Mounted): string[] =>
  builtChips(page).map((chip) => (chip.textContent ?? "").trim());

export const bankWords = (page: Mounted): string[] =>
  bankChips(page).map((chip) => (chip.textContent ?? "").trim());

/** 词块库某个词对应的按钮（按展示顺序第一个未禁用的）。 */
export const bankChipOf = (page: Mounted, word: string): HTMLButtonElement | null =>
  bankChips(page).find((chip) => !chip.disabled && (chip.textContent ?? "").trim() === word) ?? null;

/** 词块库里第一块还没被摆进拼装区的（未禁用）词块。 */
export const firstFreeBankChip = (page: Mounted): HTMLButtonElement | null =>
  bankChips(page).find((chip) => !chip.disabled) ?? null;

/** 点词块库里的某一块（走页面原生点击 = 追加到拼装区末尾）。 */
export const clickBankWord = (page: Mounted, word: string): HTMLButtonElement => {
  const chip = bankChipOf(page, word);
  if (!chip) throw new Error(`词块库里没有可用词块「${word}」（当前：${bankWords(page).join(" | ")}）`);
  act(() => {
    chip.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
  return chip;
};

/** 点拼装区第 pos 块（页面语义：移除该块）。 */
export const clickBuiltAt = (page: Mounted, pos: number): void => {
  const chip = builtChips(page)[pos];
  if (!chip) throw new Error(`拼装区没有第 ${pos} 块（当前：${builtWords(page).join(" | ")}）`);
  act(() => {
    chip.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
};

/** 依次点词块库里的词（重复词按出现顺序各取一块）。 */
export const clickBankWords = (page: Mounted, words: string[]): void => {
  const used = new Set<number>();
  for (const word of words) {
    const chips = bankChips(page);
    const at = chips.findIndex(
      (chip, index) => !used.has(index) && !chip.disabled && (chip.textContent ?? "").trim() === word
    );
    if (at < 0) throw new Error(`词块库里点不到「${word}」（当前：${bankWords(page).join(" | ")}）`);
    used.add(at);
    act(() => {
      chips[at].dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    });
  }
};

/** 当前反馈态（读 aria-live 区域；idle = 页面上没有反馈面板）。 */
export const feedbackState = (page: Mounted): "pass" | "retry" | "idle" => {
  if (page.container.querySelector(".lesson-feedback.pass")) return "pass";
  if (page.container.querySelector(".lesson-feedback.retry")) return "retry";
  return "idle";
};

/** 反馈面板上的文字（没有面板时为空串）。 */
export const feedbackText = (page: Mounted): string =>
  (page.container.querySelector(".lesson-feedback")?.textContent ?? "").trim();

/** 拼装区是否被标记为拖拽悬浮态。 */
export const isDragOver = (page: Mounted): boolean =>
  Boolean(buildArea(page)?.className.includes("drag-over"));

/** 拼装区里是否有"拖动中"的词块。 */
export const draggingChips = (page: Mounted): number =>
  page.container.querySelectorAll(".lesson-build-area button.lesson-chip.dragging").length;
