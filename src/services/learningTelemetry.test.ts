import { describe, expect, it } from "vitest";
import {
  collectLearningDateKeys,
  computeDeadCards,
  computeImportQuality,
  computeStreakStats,
  localDateKey,
  syncUnitCompletion
} from "./learningTelemetry";
import { makeCard, makeReview, makeUnit, makeTestData } from "./testUtils";

const DAY_MS = 24 * 60 * 60 * 1000;
// 本地时区固定「今天」：2024-01-15 12:00（localDateKey 按本地时区计算）。
const NOW = new Date(2024, 0, 15, 12, 0, 0);
/** 相对 NOW 偏移 dayOffset 天的 ISO 时间（固定上午 10 点，避免跨日歧义）。 */
const at = (dayOffset: number) => new Date(NOW.getTime() + dayOffset * DAY_MS - 2 * 60 * 60 * 1000).toISOString();

describe("learningTelemetry", () => {
  describe("localDateKey / collectLearningDateKeys", () => {
    it("formats local date keys and dedupes review days", () => {
      expect(localDateKey(new Date(2024, 0, 5, 23, 30))).toBe("2024-01-05");

      const data = makeTestData({
        reviews: [
          makeReview({ id: "r1", reviewedAt: at(0) }),
          makeReview({ id: "r2", reviewedAt: at(0) }),
          makeReview({ id: "r3", reviewedAt: at(-1) })
        ]
      });
      expect(collectLearningDateKeys(data)).toHaveLength(2);
    });
  });

  describe("computeStreakStats", () => {
    it("returns zeros when there are no reviews", () => {
      expect(computeStreakStats(makeTestData(), NOW)).toEqual({
        currentStreak: 0,
        learningDaysLast7: 0,
        lastLearningDateKey: "",
        totalLearningDays: 0
      });
    });

    it("counts consecutive days ending today or yesterday", () => {
      const data = makeTestData({
        reviews: [
          makeReview({ id: "r_today", reviewedAt: at(0) }),
          makeReview({ id: "r_yesterday", reviewedAt: at(-1) })
        ]
      });
      expect(computeStreakStats(data, NOW).currentStreak).toBe(2);
    });

    it("does not break the streak when today has no review yet", () => {
      const data = makeTestData({
        reviews: [
          makeReview({ id: "r_yesterday", reviewedAt: at(-1) }),
          makeReview({ id: "r_before", reviewedAt: at(-2) })
        ]
      });
      expect(computeStreakStats(data, NOW).currentStreak).toBe(2);
    });

    it("resets the streak after a gap day", () => {
      const data = makeTestData({
        reviews: [
          makeReview({ id: "r_today", reviewedAt: at(0) }),
          makeReview({ id: "r_gap", reviewedAt: at(-3) })
        ]
      });
      const stats = computeStreakStats(data, NOW);
      expect(stats.currentStreak).toBe(1);
      expect(stats.learningDaysLast7).toBe(2);
      expect(stats.totalLearningDays).toBe(2);
    });
  });

  describe("computeDeadCards", () => {
    it("flags word cards older than 72h with no review, grouped by unit", () => {
      const unit = makeUnit({ id: "unit_a", title: "高频核心" });
      const data = makeTestData({
        units: [unit],
        cards: [
          makeCard({ id: "dead", unitId: "unit_a", createdAt: at(-5), tags: ["文件导入"] }),
          makeCard({ id: "started", unitId: "unit_a", createdAt: at(-5) }),
          makeCard({ id: "fresh", unitId: "unit_a", createdAt: at(-1) }),
          makeCard({ id: "orphan", createdAt: at(-4) })
        ],
        reviews: [makeReview({ id: "r", cardId: "started", reviewedAt: at(-4) })]
      });

      const stats = computeDeadCards(data, NOW);
      expect(stats.totalDead).toBe(2);
      expect(stats.importedDead).toBe(1);
      // 按最早建卡时间升序：unit_a 的死卡（-5 天）排在未分组（-4 天）之前。
      expect(stats.groups.map((group) => group.unitTitle)).toEqual(["高频核心", "未分组单词"]);
      expect(stats.groups[0]).toMatchObject({ unitId: "unit_a", deadCount: 1 });
    });

    it("ignores non-word cards and non-new cards", () => {
      const data = makeTestData({
        cards: [
          makeCard({ id: "sentence", type: "sentence", createdAt: at(-5) }),
          makeCard({ id: "mastered", status: "mastered", createdAt: at(-5) }),
          makeCard({ id: "suspended", status: "suspended", createdAt: at(-5) })
        ]
      });
      expect(computeDeadCards(data, NOW).totalDead).toBe(0);
    });
  });

  describe("computeImportQuality", () => {
    it("splits started / dead stats by the import tag", () => {
      const data = makeTestData({
        cards: [
          makeCard({ id: "import_new", createdAt: at(-5), tags: ["文件导入"] }),
          makeCard({ id: "import_started", createdAt: at(-5), tags: ["文件导入"] }),
          makeCard({ id: "import_fresh", createdAt: at(0), tags: ["文件导入"] }),
          makeCard({ id: "manual_new", createdAt: at(-5) }),
          makeCard({ id: "manual_started", createdAt: at(-5) })
        ],
        reviews: [
          makeReview({ id: "r1", cardId: "import_started", reviewedAt: at(-4) }),
          makeReview({ id: "r2", cardId: "manual_started", reviewedAt: at(-4) })
        ]
      });

      expect(computeImportQuality(data, NOW)).toEqual({
        importedTotal: 3,
        importedStarted: 1,
        importedDead72h: 1,
        otherTotal: 2,
        otherStarted: 1
      });
    });
  });

  describe("syncUnitCompletion", () => {
    it("sets completedAt when every word card of the unit is mastered", () => {
      const unit = makeUnit({ id: "unit_a" });
      const data = makeTestData({
        units: [unit],
        cards: [
          makeCard({ id: "c1", unitId: "unit_a", status: "mastered" }),
          makeCard({ id: "c2", unitId: "unit_a", status: "mastered" })
        ]
      });

      const next = syncUnitCompletion(data, "2024-01-15T00:00:00.000Z");
      expect(next.units[0].completedAt).toBe("2024-01-15T00:00:00.000Z");
      expect(next).not.toBe(data);
    });

    it("clears completedAt when any card falls back to learning", () => {
      const unit = makeUnit({ id: "unit_a", completedAt: "2024-01-10T00:00:00.000Z" });
      const data = makeTestData({
        units: [unit],
        cards: [
          makeCard({ id: "c1", unitId: "unit_a", status: "mastered" }),
          makeCard({ id: "c2", unitId: "unit_a", status: "learning" })
        ]
      });

      const next = syncUnitCompletion(data);
      expect(next.units[0].completedAt).toBeUndefined();
    });

    it("leaves empty units and already-synced data untouched", () => {
      const unit = makeUnit({ id: "unit_a", completedAt: "2024-01-10T00:00:00.000Z" });
      const data = makeTestData({
        units: [unit, makeUnit({ id: "unit_empty" })],
        cards: [makeCard({ id: "c1", unitId: "unit_a", status: "mastered" })]
      });

      expect(syncUnitCompletion(data)).toBe(data);
    });
  });
});
