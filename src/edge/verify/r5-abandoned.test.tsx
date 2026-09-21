// @vitest-environment jsdom
/**
 * R5 · 放弃事件
 *
 * 设计声明（GrammarBoostPage.tsx:173-191 注释）：
 * 「中途离开：未完成且已答过题 → 记 abandoned（唯一能算放弃率的事件）。
 *   依赖只留 phase/tier——answered 用 ref 读，否则每次答题都会重挂清理函数、记出一条假放弃。」
 *
 * 验证点：
 * 1. 中途离开（答过题）是否记录 grammar_boost_abandoned；
 * 2. 答 0 题就离开是否**不**记录（避免假放弃）；
 * 3. 完成一档后离开是否**不**记录；
 * 4. 事件字段（lessonId/tier/answered/total/dwellMs）是否正确；
 * 5. 只进选择态（不进档）是否不记录。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "../../AppContext";
import { mountPage, resetStorage } from "../harness";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import { buildBoostItems } from "../../services/grammarBoostService";
import { summarizeGrammarTelemetry } from "../../services/grammarTelemetry";
import { DONE_LESSON_ID, readTelemetry, seedAppData, telemetryOfKind } from "./fixtures";
import { answerBoostItem, clickButtonContaining, completeBoostTier, flushAsync } from "./drive";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const seedLesson = (boostsDone?: Record<string, number[]>) =>
  seedAppData({
    grammarLessonsDone: [DONE_LESSON_ID],
    grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] },
    ...(boostsDone ? { grammarBoostsDone: boostsDone } : {})
  });

const mountBoost = (search = "") =>
  mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}${search}`, "/grammar/boost/:lessonId");

describe("R5 放弃事件", () => {
  beforeEach(() => resetStorage());

  it("只进选择态（不进任何档）后离开：不记 started，也不记 abandoned", async () => {
    seedLesson();
    const page = mountBoost();
    page.unmount();
    await flushAsync();
    expect(telemetryOfKind("grammar_boost_started").length).toBe(0);
    expect(telemetryOfKind("grammar_boost_abandoned").length).toBe(0);
  });

  it("答过题后中途离开：记 1 条 abandoned，字段完整（lessonId/tier/total）", async () => {
    seedLesson();
    const items = buildBoostItems(DONE_LESSON_ID, 1, {});
    const page = mountBoost();
    clickButtonContaining(page, "再认一次");
    answerBoostItem(page, items[0]);
    // 点「下一题」推进（answered 计数在 advance 中递增）
    page.click("下一题");
    answerBoostItem(page, items[1]);
    page.unmount();
    await flushAsync();

    const abandoned = telemetryOfKind("grammar_boost_abandoned");
    expect(abandoned.length).toBe(1);
    expect(abandoned[0].lessonId).toBe(DONE_LESSON_ID);
    expect(abandoned[0].tier).toBe(1);
    expect(abandoned[0].total).toBe(items.length);
    expect(typeof abandoned[0].dwellMs).toBe("number");
    expect(telemetryOfKind("grammar_boost_started").length).toBe(1);
  });

  /**
   * ✅ 已修（2026-09-20）：守卫条件原为
   * `answeredRef.current <= 0 && itemsCountRef.current === 0`，
   * 但 itemsCountRef 在出题 effect 里就被写成题目总数（4/5/3），第二条件恒 false，
   * 守卫生效不了 → 「点进来看一眼就走」也记 abandoned，抬高放弃率。
   * 现在只按「是否真的答过题」判定。
   */
  it("进入档位后 0 题就离开：不记 abandoned（避免假放弃）", async () => {
    seedLesson();
    const page = mountBoost();
    clickButtonContaining(page, "再认一次");
    // 确认确实一题未答
    expect(telemetryOfKind("grammar_boost_step_result").length).toBe(0);
    page.unmount();
    await flushAsync();

    expect(telemetryOfKind("grammar_boost_abandoned").length).toBe(0);
    // started 照记——这才能让「进入后没答就走」与「答了几题才走」区分开
    expect(telemetryOfKind("grammar_boost_started").length).toBe(1);
  });

  it("?tier=2 直链进档后 0 题离开：不记 abandoned", async () => {
    seedLesson();
    const page = mountBoost("?tier=2");
    expect(page.has("/ 5 题")).toBe(true);
    page.unmount();
    await flushAsync();
    const abandoned = telemetryOfKind("grammar_boost_abandoned");
    expect(abandoned.length).toBe(0);
  });

  it("完成整档后离开：不记 abandoned（completedRef 守卫有效）", async () => {
    seedLesson();
    const items = buildBoostItems(DONE_LESSON_ID, 1, {});
    const page = mountBoost();
    clickButtonContaining(page, "再认一次");
    expect(completeBoostTier(page, items)).toBe(items.length);
    expect(page.has("这一课的记忆稳住了")).toBe(true);
    page.unmount();
    await flushAsync();

    expect(telemetryOfKind("grammar_boost_completed").length).toBe(1);
    expect(telemetryOfKind("grammar_boost_abandoned").length).toBe(0);
  });

  it("完成档 1 后进入档 2 再离开：两档都是 0 题 → 都不记（避免假放弃）", async () => {
    seedLesson();
    const t1Items = buildBoostItems(DONE_LESSON_ID, 1, {});
    const page = mountBoost();
    clickButtonContaining(page, "再认一次");
    completeBoostTier(page, t1Items);
    await flushAsync();
    // 从完成态继续做档 2
    clickButtonContaining(page, "再深一点");
    expect(page.has("/ 5 题")).toBe(true);
    page.unmount();
    await flushAsync();

    // 档 2 一题未答 → 不记 abandoned（档 1 已完成，本来就不该记）
    expect(telemetryOfKind("grammar_boost_abandoned").length).toBe(0);
    expect(telemetryOfKind("grammar_boost_completed").length).toBe(1);
    expect(telemetryOfKind("grammar_boost_completed")[0].tier).toBe(1);
  });

  it("放弃率汇总：abandoned / started 口径可算（只统计真答过题的离开）", async () => {
    seedLesson();
    const items = buildBoostItems(DONE_LESSON_ID, 1, {});
    const page = mountBoost();
    clickButtonContaining(page, "再认一次");
    answerBoostItem(page, items[0]);
    page.click("下一题");
    page.unmount();
    await flushAsync();

    const summary = summarizeGrammarTelemetry().boost;
    expect(summary.started).toBe(1);
    expect(summary.abandoned).toBe(1);
    expect(summary.abandonRate).toBe(1);
    expect(summary.completedByTier[1]).toBe(0);
    // 口径提示：一次通过率的样本只来自 completed 事件（不是 step_result），
    // 所以「答了 1 题就走」的会话在通过率里完全没有痕迹——放弃的题不算难度数据。
    expect(summary.firstTryRateByTier[1]).toBe(0);
    expect(telemetryOfKind("grammar_boost_step_result").length).toBe(1);
  });

  it("遥测写入独立键空间：不污染 AppData（grammarBoostAbandoned 不进 localStorage 的 app-data 键）", async () => {
    seedLesson();
    const page = mountBoost();
    clickButtonContaining(page, "再认一次");
    page.unmount();
    await flushAsync();
    const appRaw = window.localStorage.getItem("personal-vocab-app-data-v1") ?? "";
    expect(appRaw).not.toContain("grammar_boost_abandoned");
    expect(readTelemetry().length).toBeGreaterThan(0);
  });

  /**
   * 最贴近真实使用的复现：不是 unmount，而是点页面自己的
   * 「先回去，晚点再来」<Link> 导航离开 —— 组件卸载同样触发 cleanup，结论一致。
   */
  it("走页面内「先回去，晚点再来」链接离开（0 题）：不记 abandoned", async () => {
    seedLesson();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    act(() => {
      root.render(
        <AppProvider>
          <MemoryRouter initialEntries={[`/grammar/boost/${DONE_LESSON_ID}`]}>
            <Routes>
              <Route path="/grammar/boost/:lessonId" element={<GrammarBoostPage />} />
              <Route path="/grammar" element={<div>语法地图占位</div>} />
            </Routes>
          </MemoryRouter>
        </AppProvider>
      );
    });
    const enter = Array.from(container.querySelectorAll("button")).find((button) =>
      (button.textContent ?? "").includes("再认一次")
    )!;
    act(() => enter.click());
    const back = Array.from(container.querySelectorAll("a")).find((anchor) =>
      (anchor.textContent ?? "").includes("先回去")
    ) as HTMLAnchorElement;
    act(() => back.click());
    await flushAsync();

    expect(telemetryOfKind("grammar_boost_abandoned").length).toBe(0);
    act(() => root.unmount());
    container.remove();
  });
});
