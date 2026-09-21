/**
 * SM-2 审计 · 交叉缺陷。
 *
 * 审计过程中（同一工作树被并发编辑）此处原记录的一个 P1 已被修：
 * `listDueGrammarReviewCards` 曾用单字段 `intervalDays === 0` 判「从未进过复习队列」，
 * 与 `applyReview` 的 rating=1 分支（也把 intervalDays 归零，语义是「10 分钟后再来」）撞车，
 * 导致刚看答案的语法卡被永久排除。现判据已收紧为三字段合取（`neverQueuedSchedule`）。
 * 本文件保留回归保护，并记录仍然成立的缺陷。
 */
import { describe, expect, it } from "vitest";
import { applyReview } from "../../services/reviewService";
import { listDueGrammarReviewCards } from "../../services/grammarReviewService";
import { scheduleCardsForToday } from "../../services/grammarWeakSpotsService";
import { makeCard, makeSchedule, makeTestData } from "../../services/testUtils";
import type { AppData, Card } from "../../types";

const grammarCard = (): Card =>
  makeCard({ id: "g1", type: "sentence", front: "I am happy.", tags: ["语法"], status: "review" });

const dataWith = (schedule: Record<string, unknown>): AppData =>
  makeTestData({
    cards: [grammarCard()],
    schedules: [makeSchedule({ cardId: "g1", ...schedule }) as never]
  });

describe("SMX-a 【回归保护】语法卡 rating=1 后必须仍能回来（曾被永久排除）", () => {
  it("rating=1 → intervalDays 归 0、nextReviewAt = +10min；三字段判据下仍进队列", () => {
    const data = dataWith({ easeFactor: 2.5, intervalDays: 3, reviewCount: 2, lapseCount: 0, nextReviewAt: "2020-01-01T00:00:00.000Z" });
    const after = applyReview(data, data.cards[0], "cloze", 1);

    const schedule = after.schedules[0];
    const minutes = (new Date(schedule.nextReviewAt).getTime() - Date.now()) / 60000;
    console.log("SMX-a rating=1 后:", JSON.stringify({
      intervalDays: schedule.intervalDays,
      reviewCount: schedule.reviewCount,
      lapseCount: schedule.lapseCount,
      nextReviewAtInMinutes: Math.round(minutes)
    }));

    expect(schedule.intervalDays).toBe(0);
    expect(schedule.reviewCount).toBe(3); // >0 → 不再被当成「从未排期」
    expect(minutes).toBeGreaterThan(9);

    // 11 分钟后确实回到队列（承诺的「很快会再来见你」被兑现）
    const later = new Date(Date.now() + 11 * 60 * 1000);
    const due = listDueGrammarReviewCards(after, later);
    console.log("SMX-a 11 分钟后的复习队列长度:", due.length);
    expect(due.map((item) => item.card.id)).toEqual(["g1"]);

    // 但 10 分钟之内仍不到期（rating1 的「10 分钟后」语义）
    expect(listDueGrammarReviewCards(after, new Date(Date.now() + 60 * 1000))).toHaveLength(0);
  });

  it("连续多张语法卡全部看答案 → 10 分钟后都能回来", () => {
    const cards = ["g1", "g2", "g3"].map((id) =>
      makeCard({ id, type: "sentence", front: `Sentence ${id}.`, tags: ["语法"], status: "review" })
    );
    let data: AppData = makeTestData({
      cards,
      schedules: cards.map((card) => makeSchedule({ cardId: card.id, intervalDays: 5, reviewCount: 2 }))
    });
    for (const card of cards) {
      const current = data.cards.find((item) => item.id === card.id)!;
      data = applyReview(data, current, "cloze", 1);
    }
    const later = new Date(Date.now() + 11 * 60 * 1000);
    console.log("SMX-a 三张全看答案后 11 分钟的队列长度:", listDueGrammarReviewCards(data, later).length);
    expect(listDueGrammarReviewCards(data, later)).toHaveLength(3);
  });

  it("真正「从未排期」的卡（三字段全 0）仍被排除 —— 空态文案与队列一致", () => {
    const data = dataWith({ easeFactor: 2.5, intervalDays: 0, reviewCount: 0, lapseCount: 0, nextReviewAt: "2020-01-01T00:00:00.000Z" });
    expect(listDueGrammarReviewCards(data)).toHaveLength(0);
    // 逃生通道：scheduleCardsForToday 把 intervalDays 抬到 1
    const rescued = scheduleCardsForToday(data, ["g1"]);
    expect(listDueGrammarReviewCards(rescued)).toHaveLength(1);
  });
});

describe("SMX-b 【确认的缺陷 · P2】mastered 语法卡仍会重新出现在复习会话里", () => {
  it("mastered + 到期 + 已排期 → 进队列（getDueCards 会排除 mastered，两处口径相反）", () => {
    const data = dataWith({ easeFactor: 3.2, intervalDays: 30, reviewCount: 6, nextReviewAt: "2020-01-01T00:00:00.000Z" });
    const mastered: AppData = {
      ...data,
      cards: data.cards.map((card) => ({ ...card, status: "mastered" as const, masteredAt: "2024-01-01T00:00:00.000Z" }))
    };
    const due = listDueGrammarReviewCards(mastered);
    console.log("SMX-b mastered 语法卡进队数:", due.length);
    expect(due).toHaveLength(1);

    // 用户在语法复习页会再看到这张「已掌握」的卡，掌握度进度条却仍算它 mastered
    // （summarizeGrammarMastery 先判 mastered 再 continue）
  });
});
