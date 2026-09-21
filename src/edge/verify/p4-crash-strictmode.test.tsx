// @vitest-environment jsdom
/**
 * 缺陷复现（生产同构）：在主应用相同的 React.StrictMode 下确认重访页关 2 完关崩溃。
 * main.tsx 用 <React.StrictMode><BrowserRouter><App/> 包裹，本文件用 StrictMode + MemoryRouter 对齐。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { StrictMode } from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "../../AppContext";
import GrammarRevisitPage from "../../pages/GrammarRevisitPage";
import { resetStorage } from "../harness";
import { clickElement, flushAsync } from "./drive";
import { seedAppData } from "./fixtures";
import { buildRevisitQuiz, buildAmbushQuestions } from "../../services/grammarAmbushService";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("缺陷复现 · StrictMode", () => {
  beforeEach(() => resetStorage());

  it("StrictMode 下完成关 2（答对回马枪）页面是否白屏", async () => {
    seedAppData({ grammarLessonsDone: ["lesson-06-it"] });
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    act(() => {
      root.render(
        <StrictMode>
          <AppProvider>
            <MemoryRouter initialEntries={["/grammar/lesson/lesson-06-it/revisit"]}>
              <Routes>
                <Route path="/grammar/lesson/:lessonId/revisit" element={<GrammarRevisitPage />} />
              </Routes>
            </MemoryRouter>
          </AppProvider>
        </StrictMode>
      );
    });
    const quiz = buildRevisitQuiz("lesson-06-it");
    for (const q of quiz) {
      if (q.kind === "cloze") {
        const input = container.querySelector("input") as HTMLInputElement;
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, q.clozeAnswer ?? "");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        clickElement(Array.from(container.querySelectorAll("button")).find((b) => (b.textContent ?? "").trim() === "提交")!);
      } else {
        for (const token of q.answer.split(/\s+/).filter(Boolean)) {
          clickElement(
            Array.from(container.querySelectorAll(".lesson-spot-row button")).find(
              (b) => (b.textContent ?? "").trim() === token && !(b as HTMLButtonElement).disabled
            )!
          );
        }
      }
      clickElement(
        Array.from(container.querySelectorAll("button")).find((b) => /下一题|完成回访|最后一题/.test((b.textContent ?? "").trim()))!
      );
    }
    console.log("StrictMode · 进入回马枪:", container.textContent?.replace(/\s+/g, " ").slice(0, 90));
    const ambush = buildAmbushQuestions(seedAppData({ grammarLessonsDone: ["lesson-06-it"] }), "lesson-06-it", 1, [])[0];
    let crash: string | null = null;
    try {
      clickElement((Array.from(container.querySelectorAll(".lesson-spot-row button")) as HTMLButtonElement[])[ambush.error.tokenIndex]);
    } catch (e) {
      crash = (e as Error).message;
    }
    await flushAsync();
    console.log("StrictMode · 崩溃:", crash ?? "未崩");
    console.log("StrictMode · DOM 长度:", container.innerHTML.length);
    console.log("StrictMode · 文本:", container.textContent?.replace(/\s+/g, " ").slice(0, 200));
    act(() => root.unmount());
    container.remove();
    expect(true).toBe(true);
  });
});
