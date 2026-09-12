import { beforeEach, describe, expect, it } from "vitest";
import { appendGrammarEvent, clearGrammarTelemetry } from "./grammarTelemetry";
import { computeWeakSpots, scheduleCardsForToday } from "./grammarWeakSpotsService";
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
  ({ cards: [], schedules: [], diaryEntries: [], ...overrides }) as unknown as AppData;

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
});
