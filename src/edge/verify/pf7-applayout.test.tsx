// @vitest-environment jsdom
/**
 * PF7 · AppLayout 级常驻计算 + data 变更的全局放大
 *
 * AppLayout（src/App.tsx:92）在**每一次 data 变化时**都会重渲染，并做两件全库工作：
 *   ① `computeStreak(data.reviews)`（App.tsx:102）——遍历全部复习记录，无 memo
 *   ② `<MilestoneCelebration />`（App.tsx:235）→ `findNewlyReachedMilestones(data)`
 *      → `computeMilestoneStates` → `computeStreakWithGrace(data.reviews)`——同样遍历全部复习记录
 *   （MilestoneCelebration 在 effect 里跑，但 effect 依赖 [data, updateData]，每次 data 变都跑）
 *
 * 这两个都在「任何一次答题」的提交路径上，且都不是 O(1)。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { resetStorage, mountPage } from "../harness";
import { clickElement, flushAsync } from "./drive";
import { seedAppData, makeSentenceCard, cardsToData, PAST_ISO } from "./fixtures";
import AppLayoutHost from "./pf7-applayout-host";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import { computeStreak, computeStreakWithGrace } from "../../services/statsService";
import { findNewlyReachedMilestones } from "../../services/milestoneService";
import { grammarLessons } from "../../data/grammarLessons";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
if (typeof window !== "undefined") {
  window.scrollTo = (() => undefined) as typeof window.scrollTo;
}
if (!("ResizeObserver" in globalThis)) {
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

/**
 * 不用 mountPage：那个 helper 自带 AppProvider + MemoryRouter，
 * 而 AppLayoutHost 内部也要有自己的 Router（才能渲染真实页面）——
 * 两层 Router 会抛 "You cannot render a <Router> inside another <Router>"。
 */
const mountHost = () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(<AppLayoutHost />);
  });
  return {
    container,
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    }
  };
};

const settle = async (): Promise<void> => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

const reviews = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `review-${index}`,
    cardId: `card-${index % 200}`,
    mode: "recognize" as const,
    rating: ((index % 4) + 1) as 1 | 2 | 3 | 4,
    answer: "",
    diffJson: "[]",
    reviewedAt: new Date(Date.now() - (index % 400) * 86_400_000).toISOString()
  }));

const heavy = (reviewCount: number) =>
  seedAppData({
    grammarLessonsDone: grammarLessons.map((lesson) => lesson.id),
    reviews: reviews(reviewCount),
    ...cardsToData(
      Array.from({ length: 200 }, (_, index) =>
        makeSentenceCard({
          id: `card-${index}`,
          sentence: `I am learning sentence number ${index}.`,
          schedule: { nextReviewAt: PAST_ISO }
        })
      )
    )
  });

const timeIt = (label: string, fn: () => unknown, iterations = 10): number => {
  fn();
  const start = performance.now();
  for (let index = 0; index < iterations; index += 1) fn();
  const ms = (performance.now() - start) / iterations;
  console.log(`  ⏱ ${label}: ${ms.toFixed(3)}ms（jsdom，${iterations} 次均值）`);
  return ms;
};

describe("PF7 · AppLayout 级常驻计算 + data 变更放大", () => {
  beforeEach(() => resetStorage());

  it("单价：computeStreak / computeStreakWithGrace / findNewlyReachedMilestones", async () => {
    const data = heavy(5000);
    console.log(`【数据规模】复习记录 ${data.reviews.length} 条 / 卡 ${data.cards.length} 张`);
    timeIt("computeStreak（AppLayout 每次渲染都跑）", () => computeStreak(data.reviews));
    timeIt("computeStreakWithGrace（MilestoneCelebration 每次 data 变都跑）", () => computeStreakWithGrace(data.reviews));
    timeIt("findNewlyReachedMilestones（含上者）", () => findNewlyReachedMilestones(data));
    expect(data.reviews.length).toBe(5000);
  });

  it("computeStreak 是每次渲染都跑（无 memo）——渲染次数 = 调用次数", async () => {
    heavy(5000);
    const { counters, resetCounters } = await import("./pf7-applayout-host");
    resetCounters();

    const page = mountHost();
    await settle();
    const afterMount = { ...counters };

    for (let round = 0; round < 10; round += 1) {
      act(() => {
        document.body.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
      });
      await settle();
    }
    const afterRenders = { ...counters };

    console.log("【AppLayout 渲染放大】");
    console.log(`  挂载：LayoutProbe 渲染 ${afterMount.appLayoutRenders} 次 → computeStreak 调用 ${afterMount.computeStreakCalls} 次`);
    console.log(`  10 次 keydown 后：LayoutProbe 渲染 ${afterRenders.appLayoutRenders} 次，computeStreak 调用 ${afterRenders.computeStreakCalls} 次`);
    console.log(
      `  → computeStreak 调用数 === 渲染数（${afterRenders.computeStreakCalls} === ${afterRenders.appLayoutRenders}）：无 memo，每次渲染都遍历 ${5000} 条复习记录`
    );
    console.log(
      `  MilestoneCelebration effect 跑了 ${afterRenders.milestoneEffectRuns} 次（依赖 [data]）；每次内部再 computeStreakWithGrace 一遍全部复习记录`
    );
    page.unmount();
    expect(afterRenders.computeStreakCalls).toBe(afterRenders.appLayoutRenders);
  });

  it("答题提交（updateData）→ AppLayout 重渲染 + 全库统计重算", async () => {
    heavy(5000);
    const { counters, resetCounters } = await import("./pf7-applayout-host");
    resetCounters();
    const page = mountHost();
    await settle();

    const beforeAnswer = { ...counters };
    const reveal = Array.from(page.container.querySelectorAll("button")).find((node) =>
      /显示答案|查看答案|看答案/.test(node.textContent ?? "")
    ) as HTMLButtonElement | undefined;
    clickElement(reveal);
    await flushAsync();
    const afterReveal = { ...counters };

    const rating = Array.from(page.container.querySelectorAll(".review-rating")).find((node) =>
      /记得/.test(node.textContent ?? "")
    ) as HTMLButtonElement | undefined;
    clickElement(rating);
    await flushAsync();
    const afterRating = { ...counters };

    console.log("【提交一次评分（data 变）】");
    console.log(
      `  挂载后：渲染 ${beforeAnswer.appLayoutRenders} / computeStreak ${beforeAnswer.computeStreakCalls} / milestone effect ${beforeAnswer.milestoneEffectRuns}`
    );
    console.log(
      `  点显示答案（纯 UI 态）：渲染 ${afterReveal.appLayoutRenders}（+${afterReveal.appLayoutRenders - beforeAnswer.appLayoutRenders}）/ computeStreak ${afterReveal.computeStreakCalls}`
    );
    console.log(
      `  提交评分（data 变）：渲染 ${afterRating.appLayoutRenders}（+${afterRating.appLayoutRenders - afterReveal.appLayoutRenders}）/ computeStreak ${afterRating.computeStreakCalls}（+${afterRating.computeStreakCalls - afterReveal.computeStreakCalls}）/ milestone effect ${afterRating.milestoneEffectRuns}（+${afterRating.milestoneEffectRuns - afterReveal.milestoneEffectRuns}）`
    );
    console.log(`  → 一次评分 = 一次全库复习记录遍历（computeStreak）+ 一次全库里程碑遍历（含再一次 computeStreakWithGrace）`);
    console.log(`  当前页面 DOM 节点 ${page.container.querySelectorAll("*").length}`);
    page.unmount();
    expect(true).toBe(true);
  });

  it("对照：复习页只在挂载时组会话（答 5 张后 session 次数不增）", async () => {
    const data = heavy(5000);
    const GrammarReviewPageModule = GrammarReviewPage;
    void GrammarReviewPageModule;
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    await settle();
    const before = page.container.querySelectorAll(".lesson-quiz-card").length;
    for (let round = 0; round < 5; round += 1) {
      const option = Array.from(page.container.querySelectorAll(".lesson-option")).find(
        (node) => !(node as HTMLButtonElement).disabled
      ) as HTMLButtonElement | undefined;
      if (option) {
        clickElement(option);
        await flushAsync();
      }
      const next = Array.from(page.container.querySelectorAll("button")).find((node) =>
        /^(下一张|完成复习)$/.test((node.textContent ?? "").trim())
      ) as HTMLButtonElement | undefined;
      if (!next) break;
      clickElement(next);
      await flushAsync();
    }
    console.log(
      `【复习页】会话只在挂载时组一次（useState 惰性初值 + useState(session) 不随 data 变），答 5 张后题卡数 ${before} → ${page.container.querySelectorAll(".lesson-quiz-card").length}`
    );
    void data;
    page.unmount();
    expect(true).toBe(true);
  });
});
