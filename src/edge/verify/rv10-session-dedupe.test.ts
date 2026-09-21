// @vitest-environment node
/**
 * RV10 · 复习会话里同一句话只出现一次（2026-09-21 加）
 *
 * 同一个找错案件会为每个错点各建一张卡，而它们的正面都是同一句完整正确句
 * （见 huntService.correctedSentenceOf）。实测 745 张 hunt 卡里 543 张与同案其它卡
 * 正面重复——一个 4 错点的案子能吃掉 10 张会话里的 7 个槽位。
 */
import { describe, expect, it } from "vitest";
import { huntCases } from "../../data/huntCases";
import { addHuntGapSentences } from "../../services/huntService";
import { buildGrammarReviewSession } from "../../services/grammarReviewService";
import { makeAppData } from "./fixtures";
import type { AppData } from "../../types";

const norm = (value: string): string => value.toLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim();

/** 把卡设为「已复习过两次、已到期」——新建卡 status="new" 不进复习队列。 */
const makeDue = (data: AppData): AppData => ({
  ...data,
  cards: data.cards.map((card) => ({ ...card, status: "review" as const })),
  schedules: data.schedules.map((schedule) => ({
    ...schedule,
    intervalDays: 5,
    reviewCount: 2,
    nextReviewAt: "2024-01-01T00:00:00.000Z"
  }))
});

describe("RV10 会话去重", () => {
  it("同一案件的 4 张卡（同一句）在会话里只占 1 个槽位", () => {
    // 挑一个 4 错点的案子
    const caseItem = huntCases.find((item) => item.errors.length >= 4);
    expect(caseItem, "库里应有 4 错点案件").toBeTruthy();
    let data = makeAppData({ cards: [], schedules: [], sentenceDetails: [] }) as AppData;
    data = addHuntGapSentences(data, caseItem!, caseItem!.errors.map((error) => error.tokenIndex)).data;
    expect(data.cards.length, "该案应生成多张卡").toBeGreaterThan(1);
    // 让这些卡都到期（新建卡 status="new" 不进队列，这里模拟「已复习过两次」）
    data = makeDue(data);
    const session = buildGrammarReviewSession(data, 10);
    expect(session.length, "同一句话只应出现一次").toBe(1);
  });

  it("不同句子的卡不受影响（去重不误伤）", () => {
    const withGaps = huntCases.filter((item) => item.errors.length >= 2).slice(0, 3);
    let data = makeAppData({ cards: [], schedules: [], sentenceDetails: [] }) as AppData;
    for (const caseItem of withGaps) {
      data = addHuntGapSentences(data, caseItem, caseItem.errors.map((error) => error.tokenIndex)).data;
    }
    const distinctSentences = new Set(data.cards.map((card) => norm(card.front))).size;
    data = makeDue(data);
    const session = buildGrammarReviewSession(data, 10);
    expect(session.length, "不同句子的卡都应保留").toBe(Math.min(distinctSentences, 10));
  });

  it("会话内确实没有重复句子（全案扫描）", () => {
    let data = makeAppData({ cards: [], schedules: [], sentenceDetails: [] }) as AppData;
    for (const caseItem of huntCases) {
      data = addHuntGapSentences(data, caseItem, caseItem.errors.map((error) => error.tokenIndex)).data;
    }
    data = makeDue(data);
    const session = buildGrammarReviewSession(data, 10);
    const keys = session.map((item) => norm(item.card.front));
    expect(new Set(keys).size, "会话里不应有重复句子").toBe(keys.length);
  });
});
