import { beforeEach, describe, expect, it } from "vitest";
import { appendGrammarEvent, clearGrammarTelemetry } from "./grammarTelemetry";
import { buildWeakSpotNarrative, computeWeakSpots, computeWeakSpotsReport, findActiveIntervention, scheduleCardsForToday } from "./grammarWeakSpotsService";
import { findZeroTermHits } from "../data/grammarZeroTerms";
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
  // C2 的介入冷却记在独立 localStorage 键，与遥测分开清理（否则跨用例污染）
  window.localStorage.removeItem("grammar-intervention-dismissed-v1");
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

  describe("C1/C2 · 弱点叙事与主动介入（M3，2026-09-21）", () => {
    it("弱点叙事把加权排序讲成人话，并指向具体课", () => {
      appendGrammarEvent({ kind: "diary_issue_tag", entryId: "d1", issueIndex: 0, tag: "sv_agreement", ts: new Date().toISOString() });
      appendGrammarEvent({ kind: "diary_issue_tag", entryId: "d2", issueIndex: 0, tag: "sv_agreement", ts: new Date().toISOString() });

      const narrative = buildWeakSpotNarrative(baseData({
        diaryEntries: [
          makeDiaryEntry("d1", "sv_agreement", "I go", "I goes"),
          makeDiaryEntry("d2", "sv_agreement", "She go", "She goes")
        ]
      }));
      expect(narrative).not.toBeNull();
      expect(narrative!.text).toContain("你最近总在同一个地方摔");
      expect(narrative!.text).toContain("近 7 天");
      // 叙事句必须零术语（面向用户文本红线）
      expect(findZeroTermHits(narrative!.text)).toEqual([]);
    });

    it("介入卡在场时叙事换视角（走查修复：同屏不重复同一句话）", () => {
      appendGrammarEvent({ kind: "diary_issue_tag", entryId: "d1", issueIndex: 0, tag: "sv_agreement", ts: new Date().toISOString() });
      const data = baseData({
        diaryEntries: [makeDiaryEntry("d1", "sv_agreement", "I go", "I goes")]
      });
      const withCard = buildWeakSpotNarrative(data, Date.now(), { interventionPresent: true });
      const withoutCard = buildWeakSpotNarrative(data, Date.now(), { interventionPresent: false });
      expect(withCard).not.toBeNull();
      expect(withoutCard).not.toBeNull();
      // 无介入卡时用完整叙事；有介入卡时不再重复「总在同一个地方摔」
      expect(withoutCard!.text).toContain("总在同一个地方摔");
      expect(withCard!.text).not.toContain("总在同一个地方摔");
      expect(withCard!.text).toContain("近 7 天");
      expect(findZeroTermHits(withCard!.text)).toEqual([]);
    });

    it("无数据时不叙事（不硬凑，宁可不说）", () => {
      expect(buildWeakSpotNarrative(baseData({}))).toBeNull();
    });

    it("主动介入：48 小时内同错因 ≥2 次才触发（门槛可控）", () => {
      const now = Date.now();
      const recent = new Date(now - 60 * 60 * 1000).toISOString();
      // 只有 1 次 → 不触发
      appendGrammarEvent({ kind: "practice_why_wrong_result", lessonId: "L", stepIndex: 0, sentenceHash: "h", ok: true, source: "ai", errorTag: "sv_agreement", latencyMs: 1, cached: false, ts: recent });
      expect(findActiveIntervention(baseData({}))).toBeNull();

      // 第 2 次（同一错因）→ 触发
      appendGrammarEvent({ kind: "practice_why_wrong_result", lessonId: "L", stepIndex: 1, sentenceHash: "h2", ok: true, source: "ai", errorTag: "sv_agreement", latencyMs: 1, cached: false, ts: recent });
      const intervention = findActiveIntervention(baseData({}));
      expect(intervention).not.toBeNull();
      expect(intervention!.tag).toBe("sv_agreement");
      expect(intervention!.count).toBe(2);
      expect(findZeroTermHits(intervention!.text)).toEqual([]);
    });

    it("主动介入：窗口外的旧记录不计入（48 小时窗口）", () => {
      const old = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();
      appendGrammarEvent({ kind: "practice_why_wrong_result", lessonId: "L", stepIndex: 0, sentenceHash: "h", ok: true, source: "ai", errorTag: "tense", latencyMs: 1, cached: false, ts: old });
      appendGrammarEvent({ kind: "practice_why_wrong_result", lessonId: "L", stepIndex: 1, sentenceHash: "h2", ok: true, source: "ai", errorTag: "tense", latencyMs: 1, cached: false, ts: old });
      expect(findActiveIntervention(baseData({}))).toBeNull();
    });
  });

  describe("C4 闭环 · 复盘课反哺弱点权重（2026-09-22）", () => {
    it("复盘课一次通过 → 该弱点权重减轻（闭环接通）", () => {
      // 先有一次真实犯错（权重 1.5）
      appendGrammarEvent({ kind: "diary_issue_tag", entryId: "d1", issueIndex: 0, tag: "sv_agreement", ts: new Date().toISOString() });
      const before = computeWeakSpots(baseData({
        diaryEntries: [makeDiaryEntry("d1", "sv_agreement", "I go", "I goes")]
      })).find((spot) => spot.tag === "sv_agreement");
      expect(before).toBeTruthy();

      // 复盘课一次通过 → 负权重
      appendGrammarEvent({
        kind: "grammar_replay_completed",
        itemCount: 3,
        firstTryCount: 3,
        tags: ["sv_agreement"],
        perTag: [{ tag: "sv_agreement", total: 1, firstTry: 1 }],
        durationMs: 60000,
        ts: new Date().toISOString()
      });
      const after = computeWeakSpots(baseData({
        diaryEntries: [makeDiaryEntry("d1", "sv_agreement", "I go", "I goes")]
      })).find((spot) => spot.tag === "sv_agreement");
      expect(after!.score, "练过之后权重应减轻").toBeLessThan(before!.score);
      expect(after!.lastReplayedAt, "应记录最近练习时间").toBeTruthy();
    });

    it("② 练习成效：练完之后没再摔 → mistakesSinceReplay = 0（最好的信号）", () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 3600e3).toISOString();
      const yesterday = new Date(Date.now() - 24 * 3600e3).toISOString();
      // 先犯错，再练（一次通过），之后没再摔
      appendGrammarEvent({ kind: "diary_issue_tag", entryId: "e1", issueIndex: 0, tag: "sv_agreement", ts: twoDaysAgo });
      appendGrammarEvent({
        kind: "grammar_replay_completed", itemCount: 3, firstTryCount: 3, tags: ["sv_agreement"],
        perTag: [{ tag: "sv_agreement", total: 1, firstTry: 1 }], durationMs: 60000, ts: yesterday
      });
      const spot = computeWeakSpots(baseData({
        diaryEntries: [makeDiaryEntry("e1", "sv_agreement", "I go", "I goes")]
      })).find((entry) => entry.tag === "sv_agreement");
      expect(spot!.mistakesSinceReplay).toBe(0);
    });

    it("② 练习成效：练完之后又摔 → 计数（诚实的负反馈）", () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 3600e3).toISOString();
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 3600e3).toISOString();
      const today = new Date().toISOString();
      appendGrammarEvent({ kind: "diary_issue_tag", entryId: "e1", issueIndex: 0, tag: "sv_agreement", ts: threeDaysAgo });
      appendGrammarEvent({
        kind: "grammar_replay_completed", itemCount: 3, firstTryCount: 3, tags: ["sv_agreement"],
        perTag: [{ tag: "sv_agreement", total: 1, firstTry: 1 }], durationMs: 60000, ts: twoDaysAgo
      });
      appendGrammarEvent({ kind: "diary_issue_tag", entryId: "e2", issueIndex: 0, tag: "sv_agreement", ts: today });
      const spot = computeWeakSpots(baseData({
        diaryEntries: [
          makeDiaryEntry("e1", "sv_agreement", "I go", "I goes"),
          makeDiaryEntry("e2", "sv_agreement", "She go", "She goes")
        ]
      })).find((entry) => entry.tag === "sv_agreement");
      expect(spot!.mistakesSinceReplay).toBe(1);
    });

    it("复盘课多次才过 → 记一次摩擦（正权重）", () => {
      appendGrammarEvent({
        kind: "grammar_replay_completed",
        itemCount: 3,
        firstTryCount: 1,
        tags: ["article"],
        perTag: [{ tag: "article", total: 2, firstTry: 1 }],
        durationMs: 90000,
        ts: new Date().toISOString()
      });
      const spot = computeWeakSpots(baseData({})).find((entry) => entry.tag === "article");
      expect(spot).toBeTruthy();
      expect(spot!.score).toBeGreaterThan(0);
    });
  });

  describe("B3 · AI 讲解反馈接入弱点档案（M2，2026-09-21）", () => {
    /**
     * 时间戳用「刚刚」而不是硬编码日期。
     *
     * 弱点评分含「半衰期 7 天」的时间衰减，而它是对着**真实当下时间**算的。
     * 此前这里写死 `2026-09-21T10:00:00Z`，于是随着真实日期流逝，
     * 事件越来越旧、权重越来越小，断言 `> 1.2` 就会在某一天突然开始失败
     * （实测 2026-09-22 时已衰减到 1.17）——一条会自己坏掉的测试。
     */
    const justNow = (offsetMinutes = 0) => new Date(Date.now() - offsetMinutes * 60 * 1000).toISOString();
    it("用户点「讲错了」会计入该罪名权重（此前 ai_explain_feedback 消费方 0 个）", () => {
      const data = baseData({});
      // 先有答错追问的 AI 归因（带 errorTag），再有点「讲错了」的反馈
      appendGrammarEvent({
        kind: "practice_why_wrong_result",
        lessonId: "lesson-01-am",
        stepIndex: 3,
        sentenceHash: "h1",
        ok: true,
        source: "ai",
        layer: "ai",
        errorTag: "sv_agreement",
        latencyMs: 3000,
        cached: false,
        ts: justNow(2)
      });
      appendGrammarEvent({
        kind: "practice_why_wrong_feedback",
        lessonId: "lesson-01-am",
        stepIndex: 3,
        verdict: "wrong",
        ts: justNow(1)
      });

      const spots = computeWeakSpots(data);
      const target = spots.find((spot) => spot.tag === "sv_agreement");
      expect(target, "讲错了应把该罪名带进弱点榜").toBeTruthy();
      // 0.5（追问）+ 0.8（讲错了）= 1.3；事件是「刚刚」发生的，衰减可忽略
      expect(target!.score, "刚发生的事件应基本不衰减").toBeGreaterThan(1.29);
      expect(target!.score).toBeLessThanOrEqual(1.3);
    });

    it("「有用」票不产生权重（只有 wrong 票计入，避免语义混乱）", () => {
      const data = baseData({});
      appendGrammarEvent({
        kind: "practice_why_wrong_result",
        lessonId: "lesson-01-am",
        stepIndex: 5,
        sentenceHash: "h2",
        ok: true,
        source: "ai",
        errorTag: "article",
        latencyMs: 2000,
        cached: false,
        ts: justNow(2)
      });
      appendGrammarEvent({
        kind: "practice_why_wrong_feedback",
        lessonId: "lesson-01-am",
        stepIndex: 5,
        verdict: "helpful",
        ts: justNow(1)
      });

      const target = computeWeakSpots(data).find((spot) => spot.tag === "article");
      // 仅追问那一份（0.5）；同样按「刚刚」计，衰减可忽略
      expect(target!.score, "刚发生的事件应基本不衰减").toBeGreaterThan(0.49);
      expect(target!.score).toBeLessThanOrEqual(0.5);
    });
  });
});
