/**
 * 键盘专项验证的派发工具（2026-09-21）。
 *
 * jsdom 没有真实键盘事件：所有按键都要自己 new KeyboardEvent 再 dispatch。
 * React 18 的合成事件委托挂在**挂载容器**上（不是 document），
 * 所以事件必须 bubbles: true 才能被 React 的 onKeyDown 收到。
 *
 * 注意两点（这两点正是本轮要验证的缺陷所在）：
 * - `isComposing`：中文输入法组词态。Chrome 在 composition 期间派的 keydown
 *   `keyCode` 是 229、`key === "Process"`；部分环境/老浏览器只给 `isComposing: true`。
 * - `keyCode` 是只读的 getter，必须用 Object.defineProperty 覆盖。
 */
import { act } from "react";

export type KeyTarget = Element | Document | Window | null | undefined;

export interface KeyOptions {
  shiftKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  /** 输入法组词态（CompositionEvent 期间为 true）。 */
  isComposing?: boolean;
  /** 覆写 keyCode（Chrome 组词态下是 229）。 */
  keyCode?: number;
  bubbles?: boolean;
  cancelable?: boolean;
}

/** 造一个键盘事件（不派发），便于断言 defaultPrevented。 */
export const makeKeyEvent = (type: string, key: string, options: KeyOptions = {}): KeyboardEvent => {
  const event = new KeyboardEvent(type, {
    key,
    code: key.length === 1 ? `Key${key.toUpperCase()}` : key,
    bubbles: options.bubbles ?? true,
    cancelable: options.cancelable ?? true,
    shiftKey: options.shiftKey ?? false,
    ctrlKey: options.ctrlKey ?? false,
    metaKey: options.metaKey ?? false,
    altKey: options.altKey ?? false,
    isComposing: options.isComposing ?? false
  });
  if (options.keyCode != null) {
    Object.defineProperty(event, "keyCode", { get: () => options.keyCode, configurable: true });
    Object.defineProperty(event, "which", { get: () => options.keyCode, configurable: true });
  }
  return event;
};

/** 派发一个键盘事件，返回它（读 defaultPrevented 判断是否被处理）。 */
export const fireKey = (target: KeyTarget, key: string, options: KeyOptions = {}): KeyboardEvent => {
  const event = makeKeyEvent("keydown", key, options);
  act(() => {
    (target as EventTarget).dispatchEvent(event);
  });
  return event;
};

export const keyup = (target: KeyTarget, key: string, options: KeyOptions = {}): KeyboardEvent => {
  const event = makeKeyEvent("keyup", key, options);
  act(() => {
    (target as EventTarget).dispatchEvent(event);
  });
  return event;
};

/** 在 window 上派发（验证全局 keydown 监听，如趁热练的「回车进下一题」）。 */
export const fireWindowKey = (key: string, options: KeyOptions = {}): KeyboardEvent => fireKey(window, key, options);

/** 在 document.body 上派发（模拟焦点在不可拦截的宿主元素上）。 */
export const fireBodyKey = (key: string, options: KeyOptions = {}): KeyboardEvent => fireKey(document.body, key, options);

/**
 * 模拟中文输入法组词态的一次回车：
 * Chrome 在组词中派的是 `key: "Process"` + `keyCode: 229` + `isComposing: true`。
 * 这里同时给出 `key: "Enter"` + `isComposing: true` 的「宽松」版本，
 * 只有 `isComposing` 判断守住才算真正安全。
 */
export const fireComposingEnter = (target: KeyTarget, strict = false): KeyboardEvent =>
  strict
    ? fireKey(target, "Process", { isComposing: true, keyCode: 229 })
    : fireKey(target, "Enter", { isComposing: true, keyCode: 229 });

/** 从某元素开始按 DOM 顺序（tabindex / 原生可聚焦）算出可 Tab 到的元素序列。 */
export const focusableIn = (root: HTMLElement): HTMLElement[] => {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "area[href]",
    "iframe",
    "audio[controls]",
    "video[controls]",
    "[contenteditable]:not([contenteditable='false'])",
    "[tabindex]"
  ].join(",");
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((el) => {
    if (el.hasAttribute("tabindex")) return Number(el.getAttribute("tabindex")) >= 0;
    return !el.hasAttribute("disabled");
  });
};

/** 元素的可访问名（aria-label → aria-labelledby → 文本内容），用于「图标按钮有没有可读名」。 */
export const accessibleName = (el: Element): string => {
  const label = el.getAttribute("aria-label");
  if (label && label.trim()) return label.trim();
  const labelledBy = el.getAttribute("aria-labelledby");
  if (labelledBy) {
    const parts = labelledBy
      .split(/\s+/)
      .map((id) => el.ownerDocument.getElementById(id)?.textContent ?? "")
      .join(" ");
    if (parts.trim()) return parts.trim();
  }
  const title = el.getAttribute("title");
  const text = (el.textContent ?? "").trim();
  if (text) return text;
  return (title ?? "").trim();
};

export interface A11yFinding {
  tag: string;
  selector: string;
  issue: "no-name" | "no-role" | "no-keyboard-handler";
  text: string;
}

/** 检查容器内所有原生 button / a 是否都有可访问名；返回有问题的清单。 */
export const buttonsWithoutName = (root: HTMLElement): A11yFinding[] => {
  const findings: A11yFinding[] = [];
  for (const el of Array.from(root.querySelectorAll<HTMLElement>("button, a[href]"))) {
    if (!accessibleName(el)) {
      findings.push({
        tag: el.tagName.toLowerCase(),
        selector: el.className || el.tagName.toLowerCase(),
        issue: "no-name",
        text: (el.textContent ?? "").trim().slice(0, 40)
      });
    }
  }
  return findings;
};
