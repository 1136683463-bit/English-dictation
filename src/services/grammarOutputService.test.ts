import { beforeEach, describe, expect, it } from "vitest";
import type { AppData, DiaryEntry } from "../types";
import { appendGrammarEvent, clearGrammarTelemetry } from "./grammarTelemetry";
import { buildLastWeekReport, computeWeeklyEffectiveOutput, weekStartKeyOf } from "./grammarOutputService";
import { makeTestData } from "./testUtils";

const diaryEntry = (overrides: Partial<DiaryEntry>): DiaryEntry => ({
  id: overrides.id ?? "entry-1",
  dateKey: overrides.dateKey ?? "2026-09-07",
  questionId: overrides.questionId ?? "q-1",
  questionZh: overrides.questionZh ?? "今天喝了什么？",
  answerEn: overrides.answerEn ?? "I drank tea.",
  correctedEn: overrides.correctedEn ?? "",
  issues: overrides.issues ?? [],
  status: overrides.status ?? "done",
  createdAt: overrides.createdAt ?? "2026-09-07T10:00:00.000Z"
});

describe("weekStartKeyOf（ISO 自然周，周一为起点）", () => {
  it("周一当天归属本周一", () => {
    // 2026-09-07 是周一
    expect(weekStartKeyOf(new Date(2026, 8, 7, 10, 0, 0))).toBe("2026-09-07");
  });

  it("周日归属本周一（不滚到下周）", () => {
    // 2026-09-13 是周日
    expect(weekStartKeyOf(new Date(2026, 8, 13, 23, 59, 0))).toBe("2026-09-07");
  });

  it("下周一开始新的一周", () => {
    expect(weekStartKeyOf(new Date(2026, 8, 14, 0, 0, 0))).toBe("2026-09-14");
  });
});

describe("computeWeeklyEffectiveOutput（R05 北极星口径）", () => {
  let data: AppData;

  beforeEach(() => {
    clearGrammarTelemetry();
    data = makeTestData();
  });

  it("空数据返回空数组", () => {
    expect(computeWeeklyEffectiveOutput(data)).toEqual([]);
  });

  it("日记完成条目按周聚合并按句去重", () => {
    const entries: DiaryEntry[] = [
      diaryEntry({ id: "e1", answerEn: "I drank tea.", createdAt: "2026-09-07T10:00:00.000Z" }),
      diaryEntry({ id: "e2", answerEn: "I drank tea.", createdAt: "2026-09-08T10:00:00.000Z" }), // 同句重复
      diaryEntry({ id: "e3", answerEn: "I went to the park.", createdAt: "2026-09-09T10:00:00.000Z" }),
      diaryEntry({ id: "e4", answerEn: "I am happy.", createdAt: "2026-09-15T10:00:00.000Z" }) // 下周
    ];
    data = { ...data, diaryEntries: entries };

    const weeks = computeWeeklyEffectiveOutput(data);
    expect(weeks).toHaveLength(2);
    expect(weeks[0]).toEqual({ weekStart: "2026-09-07", count: 2, lessonOutput: 0, diaryOutput: 2 });
    expect(weeks[1]).toEqual({ weekStart: "2026-09-14", count: 1, lessonOutput: 0, diaryOutput: 1 });
  });

  it("pending 状态的日记不计入", () => {
    data = {
      ...data,
      diaryEntries: [diaryEntry({ id: "e1", status: "pending", createdAt: "2026-09-07T10:00:00.000Z" })]
    };
    expect(computeWeeklyEffectiveOutput(data)).toEqual([]);
  });

  it("课程产出段通过事件计入且与日记同周合并", () => {
    appendGrammarEvent({
      kind: "lesson_step_result",
      lessonId: "lesson-01-am",
      section: "output",
      stepKind: "free_type",
      stepIndex: 0,
      attempts: 1,
      passed: true,
      ts: "2026-09-08T09:00:00.000Z"
    });
    appendGrammarEvent({
      kind: "lesson_step_result",
      lessonId: "lesson-01-am",
      section: "output",
      stepKind: "free_type_hint",
      stepIndex: 1,
      attempts: 2,
      passed: true,
      ts: "2026-09-08T09:05:00.000Z"
    });
    appendGrammarEvent({
      kind: "lesson_step_result",
      lessonId: "lesson-01-am",
      section: "practice",
      stepKind: "arrange",
      stepIndex: 0,
      attempts: 1,
      passed: true,
      ts: "2026-09-08T09:10:00.000Z" // practice 段不计入
    });
    appendGrammarEvent({
      kind: "lesson_step_result",
      lessonId: "lesson-01-am",
      section: "output",
      stepKind: "free_type",
      stepIndex: 0,
      attempts: 3,
      passed: false,
      ts: "2026-09-08T09:15:00.000Z" // 未通过不计入
    });
    data = {
      ...data,
      diaryEntries: [diaryEntry({ id: "e1", answerEn: "I drank tea.", createdAt: "2026-09-07T10:00:00.000Z" })]
    };

    const weeks = computeWeeklyEffectiveOutput(data);
    expect(weeks).toHaveLength(1);
    expect(weeks[0].weekStart).toBe("2026-09-07");
    expect(weeks[0].lessonOutput).toBe(2); // free_type + free_type_hint 两条通过
    expect(weeks[0].diaryOutput).toBe(1);
    expect(weeks[0].count).toBe(3);
  });

  it("weeks 参数只返回最近 N 周", () => {
    data = {
      ...data,
      diaryEntries: [
        diaryEntry({ id: "e1", createdAt: "2026-08-31T10:00:00.000Z" }),
        diaryEntry({ id: "e2", answerEn: "I went home.", createdAt: "2026-09-07T10:00:00.000Z" }),
        diaryEntry({ id: "e3", answerEn: "I am busy.", createdAt: "2026-09-14T10:00:00.000Z" })
      ]
    };
    const all = computeWeeklyEffectiveOutput(data);
    expect(all).toHaveLength(3);
    const last2 = computeWeeklyEffectiveOutput(data, { weeks: 2 });
    expect(last2).toHaveLength(2);
    expect(last2[0].weekStart).toBe("2026-09-07");
    expect(last2[1].weekStart).toBe("2026-09-14");
  });
});

describe("R14 buildLastWeekReport（上周一句话结论）", () => {
  // 以 2026-09-16（周三）为参考日：上周=9/7 周，前周=8/31 周
  const REF = new Date(2026, 8, 16, 12, 0, 0);
  let data: AppData;

  beforeEach(() => {
    clearGrammarTelemetry();
    data = makeTestData();
  });

  it("数据全无时返回 null（没什么可说的）", () => {
    expect(buildLastWeekReport(data, REF)).toBeNull();
  });

  it("上周有输出且有错误环比：生成含句数与环比的一句话", () => {
    // 本地时间戳（生产数据 nowIso 均为本地时间）：上周（9/7 周）2 句日记产出
    data = {
      ...data,
      diaryEntries: [
        diaryEntry({ id: "e1", answerEn: "I drank tea.", createdAt: "2026-09-08T10:00:00" }),
        diaryEntry({ id: "e2", answerEn: "I went home.", createdAt: "2026-09-09T10:00:00" })
      ]
    };
    // 前周（8/31 周）3 处时态错，上周（9/7 周）1 处 → 环比少 2 次
    for (const [entryId, ts] of [["p1", "2026-09-01T10:00:00"], ["p2", "2026-09-02T10:00:00"], ["p3", "2026-09-03T10:00:00"]] as const) {
      appendGrammarEvent({ kind: "diary_issue_tag", entryId, issueIndex: 0, tag: "tense", ts });
    }
    appendGrammarEvent({ kind: "diary_issue_tag", entryId: "e1", issueIndex: 0, tag: "tense", ts: "2026-09-08T10:00:00" });

    const report = buildLastWeekReport(data, REF);
    expect(report).not.toBeNull();
    expect(report!.weekStart).toBe("2026-09-07");
    expect(report!.outputCount).toBe(2);
    expect(report!.sentence).toContain("上周有效输出 2 句");
    expect(report!.sentence).toContain("比前周少 2 次");
    expect(report!.sentence).toContain("时态变形");
  });

  it("上周有输出但零错误：正向收尾（保持住）", () => {
    data = {
      ...data,
      diaryEntries: [diaryEntry({ id: "e1", answerEn: "I am happy.", createdAt: "2026-09-08T10:00:00" })]
    };
    const report = buildLastWeekReport(data, REF);
    expect(report!.sentence).toContain("一处错误都没有");
  });

  it("只有错误记录没有输出：也能生成结论（不返回 null）", () => {
    appendGrammarEvent({ kind: "diary_issue_tag", entryId: "e1", issueIndex: 0, tag: "article", ts: "2026-09-08T10:00:00" });
    const report = buildLastWeekReport(data, REF);
    expect(report).not.toBeNull();
    expect(report!.sentence).toContain("上周没有输出记录");
    expect(report!.sentence).toContain("冠词");
  });
});
