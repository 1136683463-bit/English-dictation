// @vitest-environment jsdom
/**
 * IX2 · 单题耗时的覆盖完整性（2026-09-21 修）
 *
 * `stepDwellBySection.guided` 的「单题平均耗时」= 该段所有带 `stepDwellMs` 的事件
 * 之和 ÷ 样本数。此前 guided 段的 **spot（找茬）分支漏传 `settleStepTiming`**，
 * 于是 spot 题永远不进样本——而 spot 占 guided 题量的 16.7%（194/1163 道）。
 * 缺失并非随机（找茬题的耗时结构与选择题不同），均值因此系统性偏移。
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { grammarLessons } from "../../data/grammarLessons";
import { mountPage, resetStorage } from "../harness";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import { summarizeGrammarTelemetry } from "../../services/grammarTelemetry";
import { answerGuidedCorrectly, answerPretest, guidedEntries, markLessonsDoneInStorage } from "../lessonFlow";
import { clickElement, flushAsync } from "./drive";

/** 找一门 guided 段含 spot 题的课。 */
const lessonWithSpot = (): { id: string; spotAt: number } => {
  for (const lesson of grammarLessons) {
    const spotAt = (lesson.guided ?? []).findIndex((step) => step.kind === "spot");
    if (spotAt >= 0) return { id: lesson.id, spotAt };
  }
  throw new Error("题库里应有含 spot 题的课");
};

const readEvents = (): Array<Record<string, unknown>> =>
  ((JSON.parse(window.localStorage.getItem("grammar-telemetry-events-v1") ?? "{}") as { events?: unknown[] })
    .events as Array<Record<string, unknown>> | undefined) ?? [];

describe("IX2 单题耗时覆盖完整性", () => {
  beforeEach(() => resetStorage());
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("归纳逻辑自检：只把带 stepDwellMs 的事件计入样本", () => {
    window.localStorage.setItem(
      "grammar-telemetry-events-v1",
      JSON.stringify({
        version: 1,
        events: [
          { kind: "lesson_step_result", lessonId: "x", section: "guided", stepKind: "choose", stepIndex: 0, misses: 0, passed: true, stepDwellMs: 5000, ts: new Date().toISOString() },
          { kind: "lesson_step_result", lessonId: "x", section: "guided", stepKind: "spot", stepIndex: 1, misses: 0, passed: true, ts: new Date().toISOString() },
          { kind: "lesson_step_result", lessonId: "x", section: "guided", stepKind: "arrange", stepIndex: 2, misses: 0, passed: true, stepDwellMs: 7000, ts: new Date().toISOString() }
        ]
      })
    );
    const bucket = summarizeGrammarTelemetry().stepDwellBySection.guided;
    expect(bucket?.samples, "只应统计带 stepDwellMs 的两条").toBe(2);
    expect(bucket?.totalMs).toBe(12000);
  });

  it("题库事实：spot 占 guided 题量的可观比例（让下面的覆盖检查有意义）", () => {
    let spot = 0;
    let total = 0;
    for (const lesson of grammarLessons) {
      for (const step of lesson.guided ?? []) {
        total += 1;
        if (step.kind === "spot") spot += 1;
      }
    }
    expect(total).toBeGreaterThan(1000);
    expect(spot / total, "spot 不应是可忽略的少数").toBeGreaterThan(0.1);
  });

  it("真实 UI：guided 段的 spot 题答对后也带 stepDwellMs（与其它题型同口径）", async () => {
    const { id, spotAt } = lessonWithSpot();
    const warm = mountPage(<GrammarLessonPage />, "/grammar/lesson/lesson-01-am", "/grammar/lesson/:lessonId");
    warm.unmount();
    markLessonsDoneInStorage(["lesson-01-am"]);
    const page = mountPage(<GrammarLessonPage />, `/grammar/lesson/${id}`, "/grammar/lesson/:lessonId");

    answerPretest(page, id, true);
    page.clickMatch(/^(开始上课|先过一遍讲解)$/);
    page.click("下一步：搭装与对错");
    page.click("下一步：变奏");
    page.click("看懂了，试一试");
    await flushAsync();

    const entries = guidedEntries(id);
    expect(entries.length, "应有 guided 题").toBeGreaterThan(0);
    /**
     * `settleStepTiming` 有 300ms 门槛（<300ms 视为误触不记）。
     * 测试默认在毫秒内跑完，真机耗时永远 <300ms —— 每题作答前**真实等待** 320ms，
     * 让耗时能被结算（否则这条断言测不到任何东西）。
     * 不用假时钟：`flushAsync` 依赖真实 setTimeout，假时钟会把它挂死。
     */
    const crossDwellFloor = () => new Promise((resolve) => setTimeout(resolve, 320));
    /**
     * 第 1 题特殊：它的计时起点是「组件挂载 / 进入 guided 段」那一刻，
     * 而不是我第一次等待之后。所以先给初次渲染留出时间，再开始逐题计时，
     * 否则第 1 题的实际停留会小于 300ms 门槛而被合理地丢弃（不是缺陷）。
     */
    await crossDwellFloor();
    for (let index = 0; index <= spotAt; index += 1) {
      await crossDwellFloor();
      const answered = answerGuidedCorrectly(page, entries[index]);
      expect(answered, `第 ${index + 1} 题（${entries[index].step.kind}）应能作答`).toBe(true);
      await flushAsync();
      if (index < spotAt) page.clickMatch(/^下一题$/);
      await flushAsync();
    }

    const guidedEvents = readEvents().filter(
      (event) => event.kind === "lesson_step_result" && event.section === "guided"
    );
    expect(guidedEvents.length, "应产生 guided 段事件").toBeGreaterThan(0);
    /**
     * 断言范围刻意覆盖**全部题型**而不是只查 spot：
     * 根因是「单槽 ref 被 render 期的第二次 begin 覆盖」，它让 guided 的**每一种**题型都丢耗时
     * （spot 只是我最初以为的那一个）。只查 spot 会漏掉 83% 的受影响样本。
     */
    const missing = guidedEvents.filter((event) => typeof event.stepDwellMs !== "number");
    expect(
      missing.map((event) => `${event.stepKind}#${event.stepIndex}`),
      "guided 段每一题的 stepDwellMs 都应被结算（>300ms 时）"
    ).toEqual([]);
    page.unmount();
  });
});
