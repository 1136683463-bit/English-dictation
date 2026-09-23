// @vitest-environment jsdom
import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppProvider } from "../AppContext";
import GrammarLessonPage from "./GrammarLessonPage";

// R24：前测答错后必须一眼看出「我选的是错的」——此前「你的选择 / 正确选择」同色同重并排，
// 用户会把错选当正确答案读过去。这里锁住三条可见性契约：错选标红单元格、正确项标绿单元格、
// 以及卡片头部的「选错了 / 判断错了」结论标签。
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("R24 前测结果页对错可见性", () => {
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

  /** 渲染第 88 课（含 choose + contrast 两题前测）并停在初始前测界面。 */
  const renderLesson = async () => {
    await act(async () => {
      root = createRoot(container);
      root.render(
        <AppProvider>
          <MemoryRouter initialEntries={["/grammar/lesson/lesson-88-its-windy"]}>
            <Routes>
              <Route path="/grammar/lesson/:lessonId" element={<GrammarLessonPage />} />
            </Routes>
          </MemoryRouter>
        </AppProvider>
      );
    });
  };

  const clickButtonByText = async (text: string) => {
    const button = [...container.querySelectorAll("button")].find((item) => item.textContent?.trim() === text);
    if (!button) throw new Error(`未找到按钮：${text}`);
    // 答错时会经 updateData 写回 AppProvider（额外一次跨组件状态更新），
    // 用 async act 把它一起冲干净，否则测试输出会刷一屏 act 警告。
    await act(async () => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
  };

  it("choose 与 contrast 都答错时，错选与正确项分色呈现并带结论标签", async () => {
    await renderLesson();

    // 第 1 题（choose）：故意选错 wind（正确是 windy）
    await clickButtonByText("wind");
    await clickButtonByText("下一题");
    // 第 2 题（contrast）：原句有问题，故意选「没问题」
    await clickButtonByText("没问题");
    await clickButtonByText("看看结果");

    const cards = container.querySelectorAll(".lesson-summary-card");
    expect(cards.length).toBe(2);

    // 两题都要有明确的「答错」结论标签，而不是只靠用户自己比对措辞
    const chips = [...container.querySelectorAll(".lesson-verdict-chip")];
    expect(chips.map((chip) => chip.textContent)).toEqual(["选错了", "判断错了"]);
    chips.forEach((chip) => expect(chip.className).toContain("is-miss"));

    // 每题都是「你的选择（红）vs 正确选择（绿）」两格对照
    const mine = [...container.querySelectorAll(".lesson-pick-cell.is-mine")];
    const correct = [...container.querySelectorAll(".lesson-pick-cell.is-correct")];
    expect(mine.length).toBe(2);
    expect(correct.length).toBe(2);

    expect(mine[0].textContent).toContain("你的选择");
    expect(mine[0].textContent).toContain("wind");
    expect(correct[0].textContent).toContain("正确选择");
    expect(correct[0].textContent).toContain("windy");

    expect(mine[1].textContent).toContain("你的判断");
    expect(mine[1].textContent).toContain("没问题");
    expect(correct[1].textContent).toContain("正确判断");
    expect(correct[1].textContent).toContain("有问题");

    // 每题都要给出「为什么」，而不是只报一个对错结论
    const whys = [...container.querySelectorAll(".lesson-pretest-why")];
    expect(whys.length).toBe(2);
    expect(whys[0].textContent).toContain("windy");

    // 旧口径的一致性风险：错选与正确项不能再落在同一个无标记列表里
    expect(container.querySelector(".lesson-summary-points")).toBeNull();
  });

  // R25：全对时此前只有一句「全对」+ 一条规则，用户没法回看每题为什么。
  it("全对时仍逐题给出解析，让用户确认自己不是猜中的", async () => {
    await renderLesson();

    // 第 1 题（choose）：选对 windy
    await clickButtonByText("windy");
    await clickButtonByText("下一题");
    // 第 2 题（contrast）：原句有问题，选对「有问题」
    await clickButtonByText("有问题");
    await clickButtonByText("看看结果");

    // 停在「全对」页，而不是答错页
    expect(container.textContent).toContain("全对！你已经找到感觉了");

    const cards = container.querySelectorAll(".lesson-summary-card");
    expect(cards.length).toBe(2);

    const chips = [...container.querySelectorAll(".lesson-verdict-chip")];
    expect(chips.map((chip) => chip.textContent)).toEqual(["选对了", "判断对了"]);
    chips.forEach((chip) => expect(chip.className).toContain("is-pass"));

    // 答对版式：只展示用户选中的那一格（绿色），不再重复摆一遍「正确选择」
    const compare = [...container.querySelectorAll(".lesson-pick-compare")];
    expect(compare.length).toBe(2);
    compare.forEach((node) => expect(node.className).toContain("is-single"));
    expect(container.querySelectorAll(".lesson-pick-cell.is-mine").length).toBe(0);
    expect(container.querySelectorAll(".lesson-pick-cell.is-correct").length).toBe(2);

    // 关键回归点：全对也必须逐题给出「为什么」
    const whys = [...container.querySelectorAll(".lesson-pretest-why")];
    expect(whys.length).toBe(2);
    expect(whys[0].textContent).toContain("刮风的要说 windy");
    expect(whys[1].textContent).toContain("外套");

    // 全对的课不应因此进入复习队列
    expect(container.querySelector(".lesson-saved-hint")).toBeNull();
  });

  // 对错混合：答错页只展开答错的题（本课落点），答对的题不占版面
  it("对错混合时只展开答错的题，且始终给出解析", async () => {
    await renderLesson();

    // 第 1 题答对，第 2 题答错
    await clickButtonByText("windy");
    await clickButtonByText("下一题");
    await clickButtonByText("没问题");
    await clickButtonByText("看看结果");

    expect(container.textContent).toContain("直觉不准？正好");

    const cards = container.querySelectorAll(".lesson-summary-card");
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain("判断错了");
    expect(cards[0].textContent).not.toContain("选对了");

    // 答错的那题仍要解释「为什么」
    const whys = [...container.querySelectorAll(".lesson-pretest-why")];
    expect(whys.length).toBe(1);
    expect(whys[0].textContent).toContain("外套");
  });
});
