import { beforeEach, describe, expect, it } from "vitest";
import { appendGrammarEvent, clearGrammarTelemetry } from "./grammarTelemetry";
import { computeWeakSpots, computeWeakSpotsReport, scheduleCardsForToday } from "./grammarWeakSpotsService";
import type { AppData, Card, DiaryEntry, Schedule } from "../types";

const iso = (offsetDays: number) =>
  new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000).toISOString();

const makeCard = (id: string, front: string, sourceId: string): Card => ({
  id,
  type: "sentence",
  front,
  back: "",
  note: "",
  sourceId,
  unitId: undefined,
  tags: ["语法"],
  status: "review",
  priority: false,
  createdAt: iso(-5),
  updatedAt: iso(-1)
});

const makeSchedule = (cardId: string, nextReviewAt: string): Schedule => ({
  cardId,
  easeFactor: 2.5,
  intervalDays: 3,
  reviewCount: 2,
  lapseCount: 0,
  nextReviewAt
});

const makeDiaryEntry = (id: string, tag: "tense" | "sv_agreement", original: string, correction: string): DiaryEntry => ({
  id,
  dateKey: "2026-09-12",
  questionId: "q1",
  questionZh: "今天做了什么？",
  answerEn: "test",
  correctedEn: "test",
  issues: [{ original, correction, explanation: "", tag }],
  status: "done",
  createdAt: iso(-1)
});

const baseData = (overrides: Partial<AppData>): AppData =>
  ({ cards: [], schedules: [], diaryEntries: [], sentenceDetails: [], ...overrides }) as unknown as AppData;

beforeEach(() => {
  clearGrammarTelemetry();
});

describe("grammarWeakSpotsService（R08 弱点档案）", () => {
  it("日记问题按权重计入，近 7 天计数与例句回溯正确", () => {
    appendGrammarEvent({ kind: "diary_issue_tag", entryId: "d1", issueIndex: 0, tag: "tense", ts: iso(0) });
    appendGrammarEvent({ kind: "diary_issue_tag", entryId: "d2", issueIndex: 0, tag: "tense", ts: iso(-2) });
    appendGrammarEvent({ kind: "diary_issue_tag", entryId: "d3", issueIndex: 0, tag: "sv_agreement", ts: iso(-1) });

    const data = baseData({
      diaryEntries: [
        makeDiaryEntry("d1", "tense", "Yesterday I go", "Yesterday I went"),
        makeDiaryEntry("d2", "tense", "I see him yesterday", "I saw him yesterday"),
        makeDiaryEntry("d3", "sv_agreement", "He like it", "He likes it")
      ]
    });

    const spots = computeWeakSpots(data);
    expect(spots[0].tag).toBe("tense");
    expect(spots[0].recentCount).toBe(2);
    expect(spots[0].totalCount).toBe(2);
    expect(spots[0].example).toContain("saw");
    expect(spots[1].tag).toBe("sv_agreement");
  });

  it("侦探裁决 wrongTag 计入、hit 不计入；复习失败经日记来源回溯罪名", () => {
    appendGrammarEvent({
      kind: "hunt_verdict",
      caseId: "case-1",
      tokenIndex: 0,
      verdictKind: "wrongTag",
      guessedTag: "article",
      ts: iso(0)
    });
    appendGrammarEvent({
      kind: "hunt_verdict",
      caseId: "case-1",
      tokenIndex: 1,
      verdictKind: "hit",
      guessedTag: "tense",
      ts: iso(0)
    });
    appendGrammarEvent({
      kind: "grammar_review_result",
      cardId: "c-diary",
      mode: "cloze",
      attempts: 1,
      passed: false,
      sourceId: "diary:d1",
      ts: iso(-1)
    });

    const data = baseData({
      diaryEntries: [makeDiaryEntry("d1", "tense", "I go yesterday", "I went yesterday")],
      cards: [makeCard("c-diary", "I went yesterday.", "diary:d1")]
    });

    const spots = computeWeakSpots(data);
    const tags = spots.map((spot) => spot.tag);
    expect(tags).toContain("article");
    expect(tags).toContain("tense");
    const tenseSpot = spots.find((spot) => spot.tag === "tense");
    expect(tenseSpot?.relatedCardIds).toContain("c-diary");
  });

  it("一键排进今日复习：指定卡片 nextReviewAt 置为现在", () => {
    const data = baseData({
      cards: [makeCard("c1", "A", "diary:d1"), makeCard("c2", "B", "diary:d2")],
      schedules: [makeSchedule("c1", iso(5)), makeSchedule("c2", iso(10))]
    });
    const next = scheduleCardsForToday(data, ["c1"]);
    const c1 = next.schedules.find((schedule) => schedule.cardId === "c1");
    const c2 = next.schedules.find((schedule) => schedule.cardId === "c2");
    expect(new Date(c1!.nextReviewAt).getTime()).toBeLessThanOrEqual(Date.now());
    expect(new Date(c2!.nextReviewAt).getTime()).toBeGreaterThan(Date.now());
  });

  it("R02：复习失败经 hunt 来源卡的 [tag] token 回溯罪名，且关联卡可一键复习", () => {
    appendGrammarEvent({
      kind: "grammar_review_result",
      cardId: "c-hunt",
      mode: "cloze",
      attempts: 2,
      passed: false,
      sourceId: "hunt:hunt-tense-jump",
      ts: iso(0)
    });

    const data = baseData({
      cards: [makeCard("c-hunt", "Yesterday I went to the park.", "hunt:hunt-tense-jump")],
      sentenceDetails: [
        {
          cardId: "c-hunt",
          sentence: "Yesterday I went to the park.",
          translation: "",
          keywords: [],
          grammarNote: "[tense:go] 时态变形：go → went。过去的时间要用过去式。",
          audioUrl: ""
        }
      ]
    });

    const spots = computeWeakSpots(data);
    const tenseSpot = spots.find((spot) => spot.tag === "tense");
    expect(tenseSpot).toBeDefined();
    expect(tenseSpot?.relatedCardIds).toContain("c-hunt");
    expect(tenseSpot?.totalCount).toBe(1);
  });

  it("R02：lesson 来源卡无结构化罪名 token，诚实不计入（回归保护）", () => {
    appendGrammarEvent({
      kind: "grammar_review_result",
      cardId: "c-lesson",
      mode: "cloze",
      attempts: 1,
      passed: false,
      sourceId: "lesson:lesson-01-am",
      ts: iso(0)
    });

    const data = baseData({
      cards: [makeCard("c-lesson", "I am Xiaomei.", "lesson:lesson-01-am")],
      sentenceDetails: [
        {
          cardId: "c-lesson",
          sentence: "I am Xiaomei.",
          translation: "",
          keywords: [],
          grammarNote: "I am 是一对固定搭档。",
          audioUrl: ""
        }
      ]
    });

    expect(computeWeakSpots(data)).toEqual([]);
  });

  it("R06：罪名下有卡跃迁 mastered 且此后未再犯 → 进「已战胜」而非活跃榜", () => {
    // 先犯错（-3 天），后治愈（-1 天 mastered）
    appendGrammarEvent({ kind: "diary_issue_tag", entryId: "d1", issueIndex: 0, tag: "tense", ts: iso(-3) });
    appendGrammarEvent({ kind: "card_mastered", cardId: "c1", sourceId: "diary:d1", tag: "tense", ts: iso(-1) });

    const data = baseData({
      diaryEntries: [makeDiaryEntry("d1", "tense", "I go yesterday", "I went yesterday")]
    });

    const report = computeWeakSpotsReport(data);
    expect(report.active).toEqual([]);
    expect(report.healed).toHaveLength(1);
    expect(report.healed[0].tag).toBe("tense");
    expect(report.healed[0].relapsed).toBe(false);
  });

  it("R06：治愈后又犯同一罪名 → 回潮回到活跃榜，不算已战胜", () => {
    // 先治愈（-3 天 mastered），后又犯（-1 天）
    appendGrammarEvent({ kind: "card_mastered", cardId: "c1", sourceId: "diary:d1", tag: "tense", ts: iso(-3) });
    appendGrammarEvent({ kind: "diary_issue_tag", entryId: "d2", issueIndex: 0, tag: "tense", ts: iso(-1) });

    const data = baseData({
      diaryEntries: [makeDiaryEntry("d2", "tense", "I see him yesterday", "I saw him yesterday")]
    });

    const report = computeWeakSpotsReport(data);
    expect(report.healed).toEqual([]);
    expect(report.active).toHaveLength(1);
    expect(report.active[0].tag).toBe("tense");
  });

  it("R06：活跃榜与已战胜并存时各就各位；computeWeakSpots 向后兼容只返回活跃榜", () => {
    // tense 治愈（mastered 在最后），article 仍活跃
    appendGrammarEvent({ kind: "diary_issue_tag", entryId: "d1", issueIndex: 0, tag: "tense", ts: iso(-3) });
    appendGrammarEvent({ kind: "card_mastered", cardId: "c1", sourceId: "diary:d1", tag: "tense", ts: iso(-1) });
    appendGrammarEvent({
      kind: "hunt_verdict",
      caseId: "case-1",
      tokenIndex: 0,
      verdictKind: "wrongTag",
      guessedTag: "article",
      ts: iso(0)
    });

    const data = baseData({
      diaryEntries: [makeDiaryEntry("d1", "tense", "I go", "I went")]
    });

    const report = computeWeakSpotsReport(data);
    expect(report.healed.map((spot) => spot.tag)).toEqual(["tense"]);
    expect(report.active.map((spot) => spot.tag)).toEqual(["article"]);
    // 向后兼容：computeWeakSpots 只返回活跃榜
    expect(computeWeakSpots(data).map((spot) => spot.tag)).toEqual(["article"]);
  });
});
