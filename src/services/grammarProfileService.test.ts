import { beforeEach, describe, expect, it } from "vitest";
import { appendGrammarEvent, clearGrammarTelemetry } from "./grammarTelemetry";
import { buildGrammarProfile } from "./grammarProfileService";
import { findZeroTermHits } from "../data/grammarZeroTerms";
import type { AppData, GrammarErrorTag } from "../types";

/** ④ 语法能力画像：全貌 + 趋势 + 已战胜。与弱点卡分工（弱点卡只讲 Top3 待修）。 */
describe("grammarProfileService（能力画像）", () => {
  const baseData = (done: string[] = []): AppData =>
    ({ cards: [], schedules: [], diaryEntries: [], sentenceDetails: [], grammarLessonsDone: done }) as unknown as AppData;

  beforeEach(() => clearGrammarTelemetry());

  const hoursAgo = (h: number) => new Date(Date.now() - h * 3600e3).toISOString();

  it("课程覆盖与季覆盖算得对", () => {
    const profile = buildGrammarProfile(baseData(["lesson-01-am", "lesson-02-is"]));
    expect(profile.lessonsDone).toBe(2);
    expect(profile.lessonsTotal).toBeGreaterThan(190);
    expect(profile.seasonsTotal).toBeGreaterThan(20);
    expect(profile.seasonsDone).toBe(0); // 两课不足以走完任何一季
  });

  it("数据太少时 isEmpty=true（不展示空报表）", () => {
    expect(buildGrammarProfile(baseData()).isEmpty).toBe(true);
  });

  it("趋势用滚动 7 天窗口，且带可读标签（修「23 周前」「1本周」标签错乱）", () => {
    appendGrammarEvent({ kind: "diary_issue_tag", entryId: "e1", issueIndex: 0, tag: "tense", ts: hoursAgo(2) });
    const profile = buildGrammarProfile(baseData(["a", "b", "c"]));
    expect(profile.trend.length).toBe(4);
    // 标签必须是人话，且最后一根是「最近 7 天」
    expect(profile.trend[3].label).toBe("最近 7 天");
    expect(profile.trend[2].label).toBe("1 周前");
    expect(profile.trend[0].label).toBe("3 周前");
    // 最近的犯错必须落在最新窗口里
    expect(profile.trend[3].mistakes).toBeGreaterThanOrEqual(1);
  });

  it("趋势与 weekOverWeek 同源（两处结论不得矛盾）", () => {
    // 前 7 天 3 次、最近 7 天 1 次 → weekOverWeek 应为 -2（变好）
    for (let i = 0; i < 3; i += 1) {
      appendGrammarEvent({ kind: "diary_issue_tag", entryId: `p${i}`, issueIndex: 0, tag: "tense", ts: hoursAgo(24 * 8 + i) });
    }
    appendGrammarEvent({ kind: "diary_issue_tag", entryId: "r1", issueIndex: 0, tag: "tense", ts: hoursAgo(3) });
    const profile = buildGrammarProfile(baseData(["a", "b", "c"]));
    expect(profile.summary.weekOverWeek).toBe(-2);
    // 趋势最新窗口的次数 == summary.recentMistakes（同源）
    expect(profile.trend[3].mistakes).toBe(profile.summary.recentMistakes);
    expect(profile.trend[2].mistakes).toBe(3);
  });

  it("画像取全量弱点（不受弱点卡 Top3 截断影响）", () => {
    // 注入 5 个不同罪名，其中 4 个是近期活跃
    for (const tag of ["tense", "plural", "article", "preposition", "run_on"] as GrammarErrorTag[]) {
      appendGrammarEvent({ kind: "diary_issue_tag", entryId: `x-${tag}`, issueIndex: 0, tag, ts: hoursAgo(4) });
    }
    const profile = buildGrammarProfile(baseData(["a", "b", "c"]));
    const attention = profile.tags.filter((item) => item.status === "attention");
    // 弱点卡只显示 3 个，画像必须显示全部 5 个
    expect(attention.length).toBe(5);
  });

  it("从未出现过的罪名不进画像（不制造焦虑）", () => {
    appendGrammarEvent({ kind: "diary_issue_tag", entryId: "e1", issueIndex: 0, tag: "tense", ts: hoursAgo(1) });
    const profile = buildGrammarProfile(baseData(["a", "b", "c"]));
    expect(profile.tags.length).toBe(1);
    expect(profile.tags[0].tag).toBe("tense");
  });

  it("罪名文案与画像文本零术语（红线守门）", () => {
    for (const tag of ["tense", "plural", "article", "missing_be", "fragment", "word_order", "verb_form", "comparison"] as GrammarErrorTag[]) {
      appendGrammarEvent({ kind: "diary_issue_tag", entryId: `z-${tag}`, issueIndex: 0, tag, ts: hoursAgo(2) });
    }
    const profile = buildGrammarProfile(baseData(["a", "b", "c"]));
    for (const item of profile.tags) {
      expect(findZeroTermHits(item.label), `${item.tag} label`).toEqual([]);
      expect(findZeroTermHits(item.plain), `${item.tag} plain`).toEqual([]);
    }
  });

  it("已出现过的按状态分组：需关注的排在前", () => {
    appendGrammarEvent({ kind: "diary_issue_tag", entryId: "e1", issueIndex: 0, tag: "tense", ts: hoursAgo(2) });
    appendGrammarEvent({ kind: "diary_issue_tag", entryId: "e2", issueIndex: 0, tag: "plural", ts: hoursAgo(24 * 10) });
    const profile = buildGrammarProfile(baseData(["a", "b", "c"]));
    expect(profile.tags[0].status).toBe("attention"); // 近期犯的排前
    expect(profile.tags[0].tag).toBe("tense");
  });
});
