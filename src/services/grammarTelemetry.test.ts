import { beforeEach, describe, expect, it } from "vitest";
import {
  appendGrammarEvent,
  clearGrammarTelemetry,
  listGrammarEvents,
  listGrammarEventsByKind,
  MAX_TELEMETRY_EVENTS_FOR_TEST,
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

  it("阶段三：lesson_exit 按段聚合 + 单题耗时按段聚合", () => {
    appendGrammarEvent({
      kind: "lesson_exit",
      lessonId: "lesson-21-have-done",
      section: "recall",
      stepIndex: 0,
      dwellMs: 300000,
      ts: "2026-09-20T00:00:00.000Z"
    });
    appendGrammarEvent({
      kind: "lesson_exit",
      lessonId: "lesson-22-been-to",
      section: "recall",
      stepIndex: 0,
      dwellMs: 280000,
      ts: "2026-09-20T00:10:00.000Z"
    });
    appendGrammarEvent({
      kind: "lesson_exit",
      lessonId: "lesson-23-lost",
      section: "practice",
      stepIndex: 2,
      dwellMs: 400000,
      ts: "2026-09-20T00:20:00.000Z"
    });
    appendGrammarEvent({
      kind: "lesson_step_result",
      lessonId: "lesson-21-have-done",
      section: "practice",
      stepKind: "arrange",
      stepIndex: 0,
      attempts: 1,
      passed: true,
      stepDwellMs: 4200,
      ts: "2026-09-20T00:30:00.000Z"
    });
    appendGrammarEvent({
      kind: "lesson_step_result",
      lessonId: "lesson-21-have-done",
      section: "practice",
      stepKind: "arrange",
      stepIndex: 1,
      attempts: 2,
      passed: true,
      stepDwellMs: 12800,
      ts: "2026-09-20T00:31:00.000Z"
    });

    const summary = summarizeGrammarTelemetry();
    // 退出集中在忆段 2 次、练段 1 次 —— 这正是「哪一段最难」的读数
    expect(summary.lessonExitBySection.recall).toBe(2);
    expect(summary.lessonExitBySection.practice).toBe(1);
    expect(summary.lessonExitBySection.watch).toBeUndefined();
    // 单题耗时：均 8500ms（(4200+12800)/2），旧事件无 stepDwellMs 时不计入
    expect(summary.stepDwellBySection.practice).toEqual({ totalMs: 17000, samples: 2 });
    expect(summary.stepDwellBySection.guided).toBeUndefined();
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

  it("AI 可观测性：缓存命中率 / 真实延迟 / 模型拆分可算", () => {
    // 一次真实调用（2.4s，成功）+ 一次缓存命中 + 一次降级
    appendGrammarEvent({ kind: "grammar_boost_ai_result", lessonId: "lesson-13-now", tier: 3, questionIndex: 0, ok: true, latencyMs: 2400, degraded: false, degradeReason: null, cached: false, model: "model-a", ts: "2026-09-19T10:00:00.000Z" });
    appendGrammarEvent({ kind: "grammar_boost_ai_result", lessonId: "lesson-13-now", tier: 3, questionIndex: 0, ok: true, latencyMs: 0, degraded: false, degradeReason: null, cached: true, model: "model-a", ts: "2026-09-19T10:05:00.000Z" });
    appendGrammarEvent({ kind: "grammar_boost_ai_result", lessonId: "lesson-14-can", tier: 3, questionIndex: 1, ok: false, latencyMs: 9000, degraded: true, degradeReason: "timeout", cached: false, model: "model-b", ts: "2026-09-19T10:10:00.000Z" });

    const ai = summarizeGrammarTelemetry().ai;
    expect(ai.boostCalls).toBe(3);
    expect(ai.boostCached).toBe(1);
    expect(ai.boostCacheHitRate).toBeCloseTo(1 / 3);
    // 真实请求 = 排除缓存命中（延迟 0）；两次真实调用延迟 2400 与 9000 → 均值 5700
    expect(ai.boostAvgLatencyMs).toBe(5700);
    expect(ai.byModel["model-a"].calls).toBe(2);
    expect(ai.byModel["model-b"].degraded).toBe(1);
  });

  it("AI 可观测性：未配置导致的降级不计入真实延迟（本地短路）", () => {
    appendGrammarEvent({ kind: "grammar_boost_ai_result", lessonId: "lesson-13-now", tier: 3, questionIndex: 0, ok: false, latencyMs: 0, degraded: true, degradeReason: "not_configured", cached: false, model: "m", ts: "2026-09-19T10:00:00.000Z" });
    const ai = summarizeGrammarTelemetry().ai;
    expect(ai.boostCalls).toBe(1);
    expect(ai.boostAvgLatencyMs).toBe(0);
  });

  it("AI 可观测性：日记批改成败与失败原因可算", () => {
    appendGrammarEvent({ kind: "diary_correction_result", entryId: "e1", ok: true, latencyMs: 3000, issueCount: 2, taggedIssueCount: 2, errorKind: null, style: "standard", ts: "2026-09-19T10:00:00.000Z" });
    appendGrammarEvent({ kind: "diary_correction_result", entryId: "e2", ok: false, latencyMs: 900, issueCount: 0, taggedIssueCount: 0, errorKind: "not_configured", style: "gentle", ts: "2026-09-19T10:01:00.000Z" });
    appendGrammarEvent({ kind: "diary_correction_result", entryId: "e3", ok: false, latencyMs: 8000, issueCount: 0, taggedIssueCount: 0, errorKind: "timeout", style: "gentle", ts: "2026-09-19T10:02:00.000Z" });

    const ai = summarizeGrammarTelemetry().ai;
    expect(ai.diaryCalls).toBe(3);
    expect(ai.diaryFailures).toBe(2);
    expect(ai.diaryFailureKinds).toEqual({ not_configured: 1, timeout: 1 });
    expect(ai.diaryAvgLatencyMs).toBe(Math.round((3000 + 900 + 8000) / 3));
  });

  it("W0：关 3 进入事件可读回（补上关 3 的到达率缺口）", () => {
    appendGrammarEvent({ kind: "grammar_reaudit_started", lessonId: "lesson-13-now", ts: "2026-09-18T10:00:00.000Z" });
    expect(listGrammarEventsByKind("grammar_reaudit_started")).toHaveLength(1);
  });

  describe("A5a · 课内追问与答错追问汇总段（M2，2026-09-21）", () => {
    it("「问一句」触发/成功/弃权/降级/校验丢弃/P90 可算", () => {
      appendGrammarEvent({ kind: "ai_explain_requested", lessonId: "L", section: "watch", anchorRef: "watch.deepDive", trigger: "preset", questionChars: 12, quotaUsed: 0, ts: "2026-09-21T10:00:00.000Z" });
      appendGrammarEvent({ kind: "ai_explain_result", lessonId: "L", section: "watch", anchorRef: "watch.deepDive", model: "m1", ok: true, latencyMs: 2500, degraded: false, degradeReason: null, cached: false, ts: "2026-09-21T10:00:02.000Z" });
      appendGrammarEvent({ kind: "ai_explain_result", lessonId: "L", section: "watch", anchorRef: "watch.deepDive", model: "m1", ok: false, latencyMs: 9000, degraded: true, degradeReason: "timeout", cached: false, ts: "2026-09-21T10:01:00.000Z" });
      appendGrammarEvent({ kind: "ai_explain_result", lessonId: "L", section: "watch", anchorRef: "watch.deepDive", model: "m1", ok: false, latencyMs: 1200, degraded: true, degradeReason: "invalid", cached: false, validationFailure: "foreign", ts: "2026-09-21T10:02:00.000Z" });
      appendGrammarEvent({ kind: "ai_explain_result", lessonId: "L", section: "watch", anchorRef: "watch.deepDive", model: "m1", ok: true, latencyMs: 0, degraded: false, degradeReason: null, cached: true, declined: true, ts: "2026-09-21T10:03:00.000Z" });
      appendGrammarEvent({ kind: "ai_explain_feedback", lessonId: "L", section: "watch", anchorRef: "watch.deepDive", verdict: "helpful", ts: "2026-09-21T10:04:00.000Z" });
      appendGrammarEvent({ kind: "ai_explain_feedback", lessonId: "L", section: "watch", anchorRef: "watch.deepDive", verdict: "wrong", ts: "2026-09-21T10:05:00.000Z" });

      const explain = summarizeGrammarTelemetry().explain;
      expect(explain.askRequested).toBe(1);
      expect(explain.askResults).toBe(4);
      expect(explain.askOk).toBe(1); // 只有第一条 ok 且非弃权
      expect(explain.askDeclined).toBe(1);
      expect(explain.askDegradeReasons).toEqual({ timeout: 1, invalid: 1 });
      expect(explain.askValidationFailures).toEqual({ foreign: 1 });
      expect(explain.askCached).toBe(1);
      expect(explain.askFeedback).toEqual({ helpful: 1, wrong: 1 });
      expect(explain.byModel).toEqual({ m1: { calls: 4, degraded: 2 } });
      // P90：真实请求 = 未命中缓存、非未配置短路、延迟 >0 → 2500/9000/1200
      expect(explain.askP90LatencyMs).toBe(9000);
    });

    it("答错追问按归因层分布（AI 有没有比本地多给东西，必须能按层回答）", () => {
      const base = { kind: "practice_why_wrong_result" as const, lessonId: "L", stepIndex: 0, sentenceHash: "h", ok: true, latencyMs: 0, cached: false, ts: "2026-09-21T11:00:00.000Z" };
      appendGrammarEvent({ ...base, source: "local_exact", layer: "local_exact" });
      appendGrammarEvent({ ...base, stepIndex: 1, source: "local_fuzzy", layer: "local_fuzzy" });
      appendGrammarEvent({ ...base, stepIndex: 2, source: "structural", layer: "structural" });
      appendGrammarEvent({ ...base, stepIndex: 3, source: "ai", layer: "ai", latencyMs: 3000, model: "m1" });
      appendGrammarEvent({ ...base, stepIndex: 4, source: "fallback", layer: "fallback" });

      const explain = summarizeGrammarTelemetry().explain;
      expect(explain.whyWrongByLayer).toEqual({
        local_exact: 1, local_fuzzy: 1, structural: 1, ai: 1, fallback: 1
      });
    });

    it("旧事件无 layer 字段时回退到 source（向后兼容历史数据）", () => {
      appendGrammarEvent({ kind: "practice_why_wrong_result", lessonId: "L", stepIndex: 9, sentenceHash: "h", ok: true, source: "local_fuzzy", latencyMs: 0, cached: false, ts: "2026-09-21T12:00:00.000Z" });
      expect(summarizeGrammarTelemetry().explain.whyWrongByLayer).toEqual({ local_fuzzy: 1 });
    });
  });
});

describe("遥测归档可读（2026-09-24 修数析实测的 P0 静默故障）", () => {
  it("主键溢出后，归档事件仍能被分析读到（此前永久消失）", () => {
    // 模拟数析的实测：写 3500 条（前 500 条 tense、后 3000 条 article）
    const total = MAX_TELEMETRY_EVENTS_FOR_TEST + 500;
    for (let i = 0; i < total; i += 1) {
      appendGrammarEvent({
        kind: "diary_issue_tag",
        entryId: `e${i}`,
        issueIndex: 0,
        tag: i < 500 ? "tense" : "article",
        ts: new Date(Date.now() - (total - i) * 1000).toISOString()
      } as never);
    }
    const visible = listGrammarEventsByKind("diary_issue_tag");
    // 修复前：只读主键 3000 条 → 前 500 条（tense）里的绝大部分不可见
    // 修复后：主键 + 归档合并，全部可见
    expect(visible.length).toBe(total);
    const tenseCount = visible.filter((event) => event.tag === "tense").length;
    expect(tenseCount, "前 500 条（被挤进归档的）必须可读").toBe(500);
  });

  it("合并后按时间升序（事件流语义）", () => {
    for (let i = 0; i < 10; i += 1) {
      appendGrammarEvent({
        kind: "diary_issue_tag",
        entryId: `t${i}`,
        issueIndex: 0,
        tag: "tense",
        ts: new Date(Date.now() - (10 - i) * 60000).toISOString()
      } as never);
    }
    const events = listGrammarEventsByKind("diary_issue_tag");
    const times = events.map((event) => Date.parse(event.ts));
    for (let i = 1; i < times.length; i += 1) {
      expect(times[i], `第 ${i} 条应不早于前一条`).toBeGreaterThanOrEqual(times[i - 1]);
    }
  });

  it("无归档时行为不变（向后兼容）", () => {
    clearGrammarTelemetry(); // 本块无 beforeEach，手动清（前两个用例会写大量事件）
    appendGrammarEvent({ kind: "diary_issue_tag", entryId: "x", issueIndex: 0, tag: "tense", ts: new Date().toISOString() } as never);
    expect(listGrammarEventsByKind("diary_issue_tag")).toHaveLength(1);
  });
});
