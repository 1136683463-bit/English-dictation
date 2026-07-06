import { describe, expect, it } from "vitest";
import { getWeeklyStatsReport } from "./statsService";
import { makeTestData, makeWordCard } from "./testUtils";

describe("statsService", () => {
  it("builds weekly trends and suggestions from review history", () => {
    const card = { ...makeWordCard("card_1"), status: "review" as const };
    const data = makeTestData({
      cards: [card],
      schedules: [
        {
          cardId: "card_1",
          easeFactor: 2.5,
          intervalDays: 1,
          reviewCount: 2,
          lapseCount: 1,
          nextReviewAt: "2026-06-20T00:00:00.000Z"
        }
      ],
      reviews: [
        {
          id: "review_1",
          cardId: "card_1",
          mode: "spelling",
          rating: 1,
          answer: "aproach",
          diffJson: "[]",
          reviewedAt: "2026-06-18T08:00:00.000Z"
        },
        {
          id: "review_2",
          cardId: "card_1",
          mode: "spelling",
          rating: 4,
          answer: "approach",
          diffJson: "[]",
          reviewedAt: "2026-06-18T09:00:00.000Z"
        }
      ]
    });

    const report = getWeeklyStatsReport(data, new Date("2026-06-18T12:00:00.000Z"));

    expect(report.weekReviewCount).toBe(2);
    expect(report.spellingAccuracy).toBe(50);
    expect(report.mostWrongWords[0].card.id).toBe("card_1");
    expect(report.sevenDayTrend.some((day) => day.reviews === 2)).toBe(true);
  });
});
