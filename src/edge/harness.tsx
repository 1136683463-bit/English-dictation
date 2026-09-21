/**
 * 边界情况验证的共用工具（2026-09-20）
 *
 * 项目没有 @testing-library，既有页面测试（GrammarLessonPage.pretestVerdict.test.tsx）
 * 用 jsdom + createRoot 直接挂载。本文件把这套做法抽出来，
 * 让边界验证的测试可以少写样板。
 *
 * 用法：
 *   // @vitest-environment jsdom
 *   import { mountPage, clickButton, findText } from "../../.edge/harness";
 */
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "../AppContext";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom 的 window.scrollTo 存在但抛 "Not implemented"，页面每次换段都会调用，会刷一屏噪音。
if (typeof window !== "undefined") {
  window.scrollTo = (() => undefined) as typeof window.scrollTo;
}

export interface Mounted {
  container: HTMLDivElement;
  root: Root;
  /** 重新读取当前 DOM 文本（每次调用都取最新状态） */
  text: () => string;
  /** 按可见文本点按钮（精确匹配 trim 后的文本） */
  click: (label: string) => void;
  /** 按正则匹配点按钮 */
  clickMatch: (pattern: RegExp) => void;
  /** 某个文本是否出现在页面上 */
  has: (needle: string) => boolean;
  /** 所有按钮的可见文本 */
  buttons: () => string[];
  unmount: () => void;
}

/**
 * 挂载一个页面组件。
 * @param element 页面元素（如 <GrammarLessonPage />）
 * @param path 路由路径（用于 useParams 等）
 * @param routePath 路由模板（如 "/grammar/lesson/:lessonId"）
 */
export const mountPage = (
  element: React.ReactElement,
  path: string,
  routePath: string
): Mounted => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(
      <AppProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path={routePath} element={element} />
          </Routes>
        </MemoryRouter>
      </AppProvider>
    );
  });

  const text = () => container.textContent ?? "";
  const allButtons = () => Array.from(container.querySelectorAll("button"));

  const click = (label: string) => {
    const target = allButtons().find((b) => (b.textContent ?? "").trim() === label);
    if (!target) {
      throw new Error(
        `找不到按钮「${label}」。当前按钮：${allButtons()
          .map((b) => (b.textContent ?? "").trim())
          .join(" | ")}`
      );
    }
    act(() => {
      target.click();
    });
  };

  const clickMatch = (pattern: RegExp) => {
    const target = allButtons().find((b) => pattern.test((b.textContent ?? "").trim()));
    if (!target) {
      throw new Error(
        `找不到匹配 ${pattern} 的按钮。当前按钮：${allButtons()
          .map((b) => (b.textContent ?? "").trim())
          .join(" | ")}`
      );
    }
    act(() => {
      target.click();
    });
  };

  return {
    container,
    root,
    text,
    click,
    clickMatch,
    has: (needle: string) => text().includes(needle),
    buttons: () => allButtons().map((b) => (b.textContent ?? "").trim()),
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    }
  };
};

/** 清空本地存储（每个测试前调用，避免上一个用例的进度串场） */
export const resetStorage = () => {
  window.localStorage.clear();
};
