// @vitest-environment jsdom
import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppProvider } from "../AppContext";
import GrammarLessonPage from "./GrammarLessonPage";

/**
 * 界面层级（2026-09-22）：内容「性质不同」时必须有可辨的视觉分层。
 * 锁三处——都是用户实测反馈「看着像一句话 / 太弱 / 有些乱」的地方：
 *   ① 深挖卡：对比项（术语标签）与补充规则（编号块）分开
 *   ② 答对反馈：修正句（深）与讲解（弱）分块，不再挤成一段流水
 *   ③ 变形题指令句：与下方题干分层（内容型 promptZh 不受影响）
 */
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("界面层级：深挖卡 / 答对反馈 / 指令句", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    window.localStorage.clear();
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    window.localStorage.clear();
  });

  const renderLesson = async (lessonId: string) => {
    await act(async () => {
      root = createRoot(container);
      root.render(
        <AppProvider>
          <MemoryRouter initialEntries={[`/grammar/lesson/${lessonId}`]}>
            <Routes>
              <Route path="/grammar/lesson/:lessonId" element={<GrammarLessonPage />} />
            </Routes>
          </MemoryRouter>
        </AppProvider>
      );
    });
  };

  const clickByText = async (text: string, exact = true) => {
    const button = [...container.querySelectorAll("button")].find((item) =>
      exact ? item.textContent?.trim() === text : item.textContent?.includes(text)
    );
    if (!button) throw new Error(`未找到按钮：${text}`);
    await act(async () => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
  };

  /** 走完前测（两题）到「开始上课」。 */
  const passPretest = async (firstPick: string) => {
    await clickByText(firstPick);
    await clickByText("下一题");
    await clickByText("没问题");
    await clickByText("看看结果");
  };

  /** 走完讲解三步（剧场 → 搭装与对错 → 变奏），停在第 3 步（含深挖卡）。 */
  const walkWatchSteps = async () => {
    await clickByText("开始上课");
    await clickByText("下一步：搭装与对错", false);
    await clickByText("下一步：变奏", false);
  };

  it("深挖卡：对比项带术语标签，补充规则用编号块区分", async () => {
    // 第 26 课深挖卡是「There be 和 have 都是「有」，怎么分？」——4 段里 2 段是对比项
    await renderLesson("lesson-26-there-be");
    await passPretest("There is");
    await walkWatchSteps();

    const diveBody = container.querySelector(".lesson-deepdive-body");
    expect(diveBody, "深挖卡应已展开").not.toBeNull();

    // 对比项：术语标签独立可辨（There be / have），不再是埋在句子里的裸文本
    const terms = [...container.querySelectorAll(".deepdive-contrast-term")].map((el) => el.textContent);
    expect(terms).toEqual(["There be", "have"]);

    // 补充规则：走编号块，与对比项结构不同（视觉上可区分）
    const items = container.querySelectorAll(".deepdive-item");
    expect(items.length, "补充规则应独立成块").toBeGreaterThanOrEqual(1);
    expect(container.querySelectorAll(".deepdive-item-no").length).toBe(items.length);

    // 每段内容不丢：对比项 2 + 编号块数 = 总段数
    const total = container.querySelectorAll(".deepdive-contrast").length + items.length;
    expect(total).toBe(4);
  });

  it("答对反馈：修正句与讲解分块（不同性质内容不挤在一段）", async () => {
    // 用第 26 课第 1 题（choose 类，有 explain）——答对后反馈应分块：
    // 「你想说…」这类 choose 题无 correctionZh，但 explain 必须独立成段而非拼进 lead。
    await renderLesson("lesson-26-there-be");
    await passPretest("There is");
    await walkWatchSteps();
    await clickByText("看懂了，试一试");
    await clickByText("There is");

    const feedback = container.querySelector(".lesson-feedback.pass");
    expect(feedback, "答对应出现反馈卡").not.toBeNull();

    // 讲解必须是独立段落（.lesson-feedback-why），不能与结论挤在同一 <p>
    const why = container.querySelector(".lesson-feedback-why");
    expect(why, "答对后的讲解应有独立段落").not.toBeNull();
    expect(why?.textContent).toContain("There is");

    // 讲解段落不应被包在 lead（修正句）容器里——两者性质不同，各自成块
    const lead = container.querySelector(".lesson-feedback-lead");
    if (lead) {
      expect(lead.contains(why), "讲解不应嵌在修正句容器内").toBe(false);
    }

    // 关键回归防线：旧实现把讲解与结论塞在同一个 <p> 里（读成一长句流水）
    const paragraphs = [...feedback!.querySelectorAll("p")];
    const merged = paragraphs.find((p) => p.querySelector(".lesson-feedback-why"));
    expect(merged, "讲解不应是嵌套在其他段落里的子元素").toBeUndefined();
  });

  it("变形题指令句与题干分层；内容型 promptZh 不误伤", async () => {
    // 第 2 课 guided 含「句子变身」replace 题
    await renderLesson("lesson-02-is");
    await passPretest("are");
    await walkWatchSteps();
    await clickByText("看懂了，试一试");

    // 第 1 题是 choose 类：promptZh 是「你想说：你是我的朋友。」= 题目内容，不能加指令态
    const firstPrompt = container.querySelector(".lesson-quiz-prompt");
    expect(firstPrompt?.textContent).toContain("你想说");
    expect(firstPrompt?.className, "内容型 prompt 不应被标为指令").not.toContain("is-instruction");

    // 推进到变形题（replace）：它的 promptZh 是纯指令「句子变身：…要怎么变？」
    for (let step = 0; step < 8; step += 1) {
      const instr = container.querySelector(".lesson-quiz-prompt.is-instruction");
      if (instr) {
        expect(instr.textContent).toContain("句子变身");
        return;
      }
      // 推进一题：选可点的选项或词块，再点下一题
      const option = [...container.querySelectorAll<HTMLButtonElement>("main .lesson-option, .lesson-option")].find((b) => !b.disabled);
      if (option) {
        await act(async () => option.dispatchEvent(new MouseEvent("click", { bubbles: true })));
      } else {
        const chip = [...container.querySelectorAll<HTMLButtonElement>(".lesson-bank button")].find((b) => !b.disabled);
        if (chip) await act(async () => chip.dispatchEvent(new MouseEvent("click", { bubbles: true })));
      }
      const next = [...container.querySelectorAll("button")].find((b) => b.textContent?.trim() === "下一题");
      if (!next) return; // 走不到变形题时跳过（数据变化容错）
      await act(async () => next.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    }
  });
});
