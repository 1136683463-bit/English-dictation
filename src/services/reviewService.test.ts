import { describe, expect, it } from "vitest";
import { applyReviewWithUndo, getDueCards, markCardsPriority, undoReview } from "./reviewService";
import { makeTestData, makeWordCard } from "./testUtils";

describe("reviewService", () => {
  it("applies a review and can undo it", () => {
    const card = makeWordCard("card_1");
    const data = makeTestData({
      cards: [card],
      schedules: [
        {
          cardId: card.id,
          easeFactor: 2.5,
          intervalDays: 0,
          reviewCount: 0,
          lapseCount: 0,
          nextReviewAt: "2026-01-01T00:00:00.000Z"
        }
      ]
    });

    const reviewed = applyReviewWithUndo(data, card, "spelling", 1, "aproach", "[]");
    expect(reviewed.data.reviews).toHaveLength(1);
    expect(reviewed.data.schedules[0].lapseCount).toBe(1);

    const restored = undoReview(reviewed.data, reviewed.undo);
    expect(restored.reviews).toHaveLength(0);
    expect(restored.cards[0]).toEqual(card);
    expect(restored.schedules[0].reviewCount).toBe(0);
  });

  it("returns due cards and marks priority in batches", () => {
    const data = makeTestData({
      cards: [makeWordCard("due"), makeWordCard("future", "future", "未来")],
      schedules: [
        { cardId: "due", easeFactor: 2.5, intervalDays: 0, reviewCount: 0, lapseCount: 0, nextReviewAt: "2020-01-01T00:00:00.000Z" },
        { cardId: "future", easeFactor: 2.5, intervalDays: 0, reviewCount: 0, lapseCount: 0, nextReviewAt: "2999-01-01T00:00:00.000Z" }
      ]
    });

    expect(getDueCards(data).map((card) => card.id)).toEqual(["due"]);
    expect(markCardsPriority(data, ["due"]).cards.find((card) => card.id === "due")?.priority).toBe(true);
  });
});
