// @vitest-environment jsdom
/**
 * R7 · 库级不变量与 StrictMode 埋点守卫（补充验证）
 *
 * 1. 全库 195 课 × 三档都出得满题（题量达标，不出「这一档暂时没有题」空态）；
 * 2. StrictMode（真实 app 的包裹方式）下 offered / started / abandoned 不重复记账
 *    —— 页面注释声明用 ref 守卫正是为了防 StrictMode 双跑；
 * 3. 复习页中途离开时的埋点现状（对照强化页的 abandoned）。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { StrictMode } from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "../../AppContext";
import { mountPage, resetStorage } from "../harness";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import { BOOST_TIER_META, buildBoostItems } from "../../services/grammarBoostService";
import { grammarLessons } from "../../data/grammarLessons";
import { cardsToData, DONE_LESSON_ID, makeSentenceCard, PAST_ISO, readTelemetry, seedAppData, telemetryOfKind } from "./fixtures";
import { clickButtonContaining, flushAsync } from "./drive";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const mountStrictBoost = (path: string) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      <StrictMode>
        <AppProvider>
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route path="/grammar/boost/:lessonId" element={<GrammarBoostPage />} />
            </Routes>
          </MemoryRouter>
        </AppProvider>
      </StrictMode>
    );
  });
  return {
    container,
    buttons: () => Array.from(container.querySelectorAll("button")).map((b) => (b.textContent ?? "").trim()),
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    }
  };
};

describe("R7-a 全库题量不变量", () => {
  beforeEach(() => resetStorage());

  it("195 课 × 三档：题量都达到 BOOST_TIER_META 声明值（不会出现空态）", () => {
    const shortfalls: string[] = [];
    for (const lesson of grammarLessons) {
      for (const tier of [1, 2, 3] as const) {
        const items = buildBoostItems(lesson.id, tier, {});
        if (items.length < BOOST_TIER_META[tier].questionCount) {
          shortfalls.push(`${lesson.id} t${tier}: ${items.length}/${BOOST_TIER_META[tier].questionCount}`);
        }
      }
    }
    expect(shortfalls).toEqual([]);
    expect(grammarLessons.length).toBe(195);
  });

  it("三档总题量 ≤ 15（不构成题海）且每题都有 answer 与 explainZh", () => {
    const total = BOOST_TIER_META[1].questionCount + BOOST_TIER_META[2].questionCount + BOOST_TIER_META[3].questionCount;
    expect(total).toBeLessThanOrEqual(15);

    const incomplete: string[] = [];
    for (const lesson of grammarLessons.slice(0, 40)) {
      for (const tier of [1, 2, 3] as const) {
        for (const item of buildBoostItems(lesson.id, tier, {})) {
          if (!item.answer.trim()) incomplete.push(`${lesson.id} t${tier} ${item.kind} 缺 answer`);
          if (!item.explainZh.trim()) incomplete.push(`${lesson.id} t${tier} ${item.kind} 缺 explainZh`);
        }
      }
    }
    expect(incomplete).toEqual([]);
  });

  it("空库（未学过任何课）下 buildBoostItems 仍能出题（准入由 canBoostLesson 把关）", () => {
    // 服务层不检查学习进度，页面才检查 —— 记录这一分工
    expect(buildBoostItems(DONE_LESSON_ID, 1, {}).length).toBeGreaterThan(0);
  });
});

describe("R7-b StrictMode 埋点守卫", () => {
  beforeEach(() => resetStorage());

  it("StrictMode 下进档再离开：started 只记 1 条；0 题离开不记 abandoned", async () => {
    seedAppData({
      grammarLessonsDone: [DONE_LESSON_ID],
      grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] }
    });
    const page = mountStrictBoost(`/grammar/boost/${DONE_LESSON_ID}`);
    expect(telemetryOfKind("grammar_boost_offered").length).toBe(0); // entryPoint=direct 不记曝光
    clickButtonContaining(page as never, "再认一次");
    expect(telemetryOfKind("grammar_boost_started").length).toBe(1);
    page.unmount();
    await flushAsync();
    expect(telemetryOfKind("grammar_boost_started").length).toBe(1);
    // 一题未答 → 不记 abandoned（2026-09-20 修：避免「点进来看一眼」抬高放弃率）
    expect(telemetryOfKind("grammar_boost_abandoned").length).toBe(0);
  });

  it("从结算页入口进入（?from=receipt）：StrictMode 下 offered 只记 1 条", async () => {
    seedAppData({
      grammarLessonsDone: [DONE_LESSON_ID],
      grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] }
    });
    const page = mountStrictBoost(`/grammar/boost/${DONE_LESSON_ID}?from=receipt`);
    const offered = telemetryOfKind("grammar_boost_offered");
    expect(offered.length).toBe(1);
    expect(offered[0].entryPoint).toBe("settlement");
    page.unmount();
    await flushAsync();
  });
});

describe("R7-c 复习页中途离开的埋点现状", () => {
  beforeEach(() => resetStorage());

  it("答 1 张后离开（未完成会话）：只有 review_result，没有会话级退出/放弃事件", async () => {
    const data = seedAppData(
      cardsToData([
        makeSentenceCard({ id: "c1", sentence: "I am drawing a picture.", schedule: { reviewCount: 0, nextReviewAt: PAST_ISO } }),
        makeSentenceCard({ id: "c2", sentence: "She is a nurse.", schedule: { reviewCount: 0, nextReviewAt: PAST_ISO } })
      ])
    );
    void data;
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    // 第一题：cloze，点对
    const option = page.buttons().find((text) => text === "drawing");
    expect(option).toBe("drawing");
    page.click("drawing");
    page.unmount();
    await flushAsync();

    const kinds = readTelemetry().map((event) => event.kind);
    expect(kinds).toContain("grammar_review_result");
    // 复习页没有 abandoned / exit 类事件——中途放弃不可观测
    expect(kinds).not.toContain("grammar_boost_abandoned");
    expect(kinds).not.toContain("lesson_exit");
    expect(kinds).not.toContain("grammar_review_exit");
    expect(readTelemetry().filter((event) => event.kind === "grammar_review_result").length).toBe(1);
  });
});
