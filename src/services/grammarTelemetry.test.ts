import { beforeEach, describe, expect, it } from "vitest";
import {
  appendGrammarEvent,
  clearGrammarTelemetry,
  listGrammarEvents,
  listGrammarEventsByKind,
  summarizeGrammarTelemetry
} from "./grammarTelemetry";

describe("grammarTelemetry（R01 数据基建）", () => {
  beforeEach(() => {
    clearGrammarTelemetry();
  });

  it("追加后可按类型读回事件", () => {
    appendGrammarEvent({
      kind: "grammar_lesson_completed",
      lessonId: "lesson-01-am",
      completedAt: "2026-09-12T00:00:00.000Z",
      guidedFirstTry: true,
      practiceFirstTry: false,
      durationMs: 300000
    });
    appendGrammarEvent({
      kind: "lesson_step_result",
      lessonId: "lesson-01-am",
      section: "practice",
      stepKind: "arrange",
      stepIndex: 0,
      attempts: 2,
      passed: true,
      ts: "2026-09-12T00:00:01.000Z"
    });

    expect(listGrammarEvents()).toHaveLength(2);
    const completions = listGrammarEventsByKind("grammar_lesson_completed");
    expect(completions).toHaveLength(1);
    expect(completions[0].lessonId).toBe("lesson-01-am");
    expect(completions[0].practiceFirstTry).toBe(false);
    expect(listGrammarEventsByKind("deep_dive_expanded")).toHaveLength(0);
  });

  it("汇总：一次通过率、展开课数、误报率、日记 tag 分布", () => {
    appendGrammarEvent({
      kind: "grammar_lesson_completed",
      lessonId: "lesson-01-am",
      completedAt: "2026-09-12T00:00:00.000Z",
      guidedFirstTry: true,
      practiceFirstTry: true,
      durationMs: 1000
    });
    appendGrammarEvent({
      kind: "grammar_lesson_completed",
      lessonId: "lesson-02-is",
      completedAt: "2026-09-12T00:01:00.000Z",
      guidedFirstTry: false,
      practiceFirstTry: true,
      durationMs: 2000
    });
    appendGrammarEvent({ kind: "deep_dive_expanded", lessonId: "lesson-01-am", ts: "2026-09-12T00:00:02.000Z" });
    appendGrammarEvent({
      kind: "hunt_verdict",
      caseId: "case-1",
      tokenIndex: 0,
      verdictKind: "notError",
      guessedTag: "tense",
      ts: "2026-09-12T00:00:03.000Z"
    });
    appendGrammarEvent({
      kind: "hunt_verdict",
      caseId: "case-1",
      tokenIndex: 2,
      verdictKind: "hit",
      guessedTag: "tense",
      ts: "2026-09-12T00:00:04.000Z"
    });
    appendGrammarEvent({
      kind: "diary_issue_tag",
      entryId: "diary-1",
      issueIndex: 0,
      tag: "tense",
      ts: "2026-09-12T00:00:05.000Z"
    });

    const summary = summarizeGrammarTelemetry();
    expect(summary.totalEvents).toBe(6);
    expect(summary.completions).toBe(2);
    expect(summary.guidedFirstTryRate).toBeCloseTo(0.5);
    expect(summary.practiceFirstTryRate).toBe(1);
    expect(summary.expandedDeepDiveLessonIds).toEqual(["lesson-01-am"]);
    expect(summary.huntVerdicts).toEqual({ hit: 1, wrongTag: 0, notError: 1, alreadyFound: 0 });
    expect(summary.huntFalsePositiveRate).toBeCloseTo(0.5);
    expect(summary.diaryTagCounts.tense).toBe(1);
  });

  it("R20：段级停留事件按段聚合（totalMs + samples）", () => {
    appendGrammarEvent({
      kind: "section_dwell",
      lessonId: "lesson-21-have-done",
      section: "watch",
      dwellMs: 120000,
      ts: "2026-09-13T00:00:00.000Z"
    });
    appendGrammarEvent({
      kind: "section_dwell",
      lessonId: "lesson-21-have-done",
      section: "watch",
      dwellMs: 30000,
      ts: "2026-09-13T00:01:00.000Z"
    });
    appendGrammarEvent({
      kind: "section_dwell",
      lessonId: "lesson-21-have-done",
      section: "challenge",
      dwellMs: 95000,
      ts: "2026-09-13T00:02:00.000Z"
    });

    const summary = summarizeGrammarTelemetry();
    expect(summary.sectionDwell.watch).toEqual({ totalMs: 150000, samples: 2 });
    expect(summary.sectionDwell.challenge).toEqual({ totalMs: 95000, samples: 1 });
    expect(summary.sectionDwell.practice).toBeUndefined();
  });

  it("清空后回到空态", () => {
    appendGrammarEvent({ kind: "deep_dive_expanded", lessonId: "lesson-01-am", ts: "2026-09-12T00:00:00.000Z" });
    expect(listGrammarEvents()).toHaveLength(1);
    clearGrammarTelemetry();
    expect(listGrammarEvents()).toHaveLength(0);
    const summary = summarizeGrammarTelemetry();
    expect(summary.totalEvents).toBe(0);
    expect(summary.huntFalsePositiveRate).toBe(0);
  });

  it("R05：漏斗第一环——进入路径页后 7 天内进课才计入转化", () => {
    // 首访进入（lessonsDone=0），3 天后进首课 → 计入
    appendGrammarEvent({ kind: "grammar_path_viewed", lessonsDone: 0, ts: "2026-09-07T10:00:00.000Z" });
    appendGrammarEvent({ kind: "grammar_lesson_started", lessonId: "lesson-01-am", ts: "2026-09-10T10:00:00.000Z" });
    // 再次进入（已有进度），之后没进课 → 不计入
    appendGrammarEvent({ kind: "grammar_path_viewed", lessonsDone: 3, ts: "2026-09-12T10:00:00.000Z" });

    const summary = summarizeGrammarTelemetry();
    expect(summary.pathFunnel.views).toBe(2);
    expect(summary.pathFunnel.firstVisitViews).toBe(1);
    expect(summary.pathFunnel.pathToLessonWithin7d).toBe(1);
    expect(summary.pathFunnel.pathToLessonRate7d).toBeCloseTo(0.5);
  });

  it("R05：进课发生在进入路径页之前或超过 7 天，都不算转化", () => {
    appendGrammarEvent({ kind: "grammar_lesson_started", lessonId: "lesson-01-am", ts: "2026-09-01T10:00:00.000Z" });
    appendGrammarEvent({ kind: "grammar_path_viewed", lessonsDone: 0, ts: "2026-09-10T10:00:00.000Z" });

    const summary = summarizeGrammarTelemetry();
    expect(summary.pathFunnel.pathToLessonWithin7d).toBe(0);
    expect(summary.pathFunnel.pathToLessonRate7d).toBe(0);
  });

  it("R-B7：趁热练参与率 / 入口拆分 / 分层漏斗可算", () => {
    appendGrammarEvent({ kind: "grammar_boost_offered", lessonId: "lesson-13-now", entryPoint: "settlement", recommendedTier: 1, ts: "2026-09-18T10:00:00.000Z" });
    appendGrammarEvent({ kind: "grammar_boost_offered", lessonId: "lesson-13-now", entryPoint: "settlement", recommendedTier: 1, ts: "2026-09-18T11:00:00.000Z" });
    appendGrammarEvent({ kind: "grammar_boost_offered", lessonId: "lesson-14-is", entryPoint: "card", recommendedTier: 1, ts: "2026-09-18T12:00:00.000Z" });
    appendGrammarEvent({ kind: "grammar_boost_started", lessonId: "lesson-13-now", tier: 1, questionCount: 4, entryPoint: "settlement", ts: "2026-09-18T10:01:00.000Z" });
    appendGrammarEvent({ kind: "grammar_boost_started", lessonId: "lesson-13-now", tier: 2, questionCount: 5, entryPoint: "settlement", ts: "2026-09-18T10:10:00.000Z" });
    appendGrammarEvent({ kind: "grammar_boost_completed", lessonId: "lesson-13-now", tier: 1, total: 4, firstTryCount: 4, durationMs: 120000, aiUsed: false, hoursSinceStage1: 0.2, ts: "2026-09-18T10:05:00.000Z" });

    const summary = summarizeGrammarTelemetry().boost;
    expect(summary.offered).toBe(3);
    expect(summary.offeredByEntry.settlement).toBe(2);
    expect(summary.offeredByEntry.card).toBe(1);
    expect(summary.started).toBe(2);
    expect(summary.startRate).toBeCloseTo(2 / 3);
    // 两次进入都从结算页发起（档 2 是完成档 1 后在同一会话里继续，入口不变）
    expect(summary.startedByEntry.settlement).toBe(2);
    expect(summary.startedByEntry.card).toBe(0);
    expect(summary.completedByTier[1]).toBe(1);
    // 档 1 完成 1 次 → 档 2 进入率 = 1/1
    expect(summary.funnel.tier1ToTier2).toBe(1);
    // 档 1 一次通过率 = 4/4
    expect(summary.firstTryRateByTier[1]).toBe(1);
  });

  it("R-B7：放弃率 / AI 使用率 / 降级率 / 素材重复率口径正确", () => {
    appendGrammarEvent({ kind: "grammar_boost_started", lessonId: "lesson-13-now", tier: 3, questionCount: 3, entryPoint: "card", ts: "2026-09-18T10:00:00.000Z" });
    appendGrammarEvent({ kind: "grammar_boost_started", lessonId: "lesson-14-is", tier: 1, questionCount: 4, entryPoint: "card", ts: "2026-09-18T10:00:00.000Z" });
    appendGrammarEvent({ kind: "grammar_boost_abandoned", lessonId: "lesson-13-now", tier: 3, answered: 1, total: 3, dwellMs: 40000, ts: "2026-09-18T10:02:00.000Z" });
    appendGrammarEvent({ kind: "grammar_boost_completed", lessonId: "lesson-13-now", tier: 3, total: 3, firstTryCount: 2, durationMs: 200000, aiUsed: true, hoursSinceStage1: 24, ts: "2026-09-18T10:20:00.000Z" });
    appendGrammarEvent({ kind: "grammar_boost_ai_result", lessonId: "lesson-13-now", tier: 3, questionIndex: 0, ok: true, latencyMs: 3200, degraded: false, degradeReason: null, ts: "2026-09-18T10:19:00.000Z" });
    appendGrammarEvent({ kind: "grammar_boost_ai_result", lessonId: "lesson-14-is", tier: 3, questionIndex: 1, ok: false, latencyMs: 9000, degraded: true, degradeReason: "timeout", ts: "2026-09-18T10:19:30.000Z" });
    appendGrammarEvent({ kind: "grammar_boost_step_result", lessonId: "lesson-13-now", tier: 1, itemKind: "derived", sourceRef: "lesson-13-now:t1:variants:0", attempts: 1, passed: true, ts: "2026-09-18T10:00:30.000Z" });
    appendGrammarEvent({ kind: "grammar_boost_item_repeat", lessonId: "lesson-13-now", sourceRef: "lesson-13-now:t1:variants:0", seenCount7d: 2, ts: "2026-09-18T10:00:31.000Z" });

    const summary = summarizeGrammarTelemetry().boost;
    expect(summary.abandoned).toBe(1);
    expect(summary.abandonRate).toBeCloseTo(0.5);
    expect(summary.aiUsedRate).toBe(1);
    expect(summary.aiDegradedRate).toBeCloseTo(0.5);
    expect(summary.itemRepeatRate).toBe(1);
  });

  it("R-B7：自评事件不污染题级漏斗（按 sourceRef 前缀排除）", () => {
    appendGrammarEvent({ kind: "grammar_boost_step_result", lessonId: "lesson-13-now", tier: 1, itemKind: "derived", sourceRef: "self-eval:easy", attempts: 1, passed: true, ts: "2026-09-18T10:00:00.000Z" });
    const summary = summarizeGrammarTelemetry().boost;
    expect(summary.itemRepeatRate).toBe(0);
  });

  it("W0：关 3 进入事件可读回（补上关 3 的到达率缺口）", () => {
    appendGrammarEvent({ kind: "grammar_reaudit_started", lessonId: "lesson-13-now", ts: "2026-09-18T10:00:00.000Z" });
    expect(listGrammarEventsByKind("grammar_reaudit_started")).toHaveLength(1);
  });
});
