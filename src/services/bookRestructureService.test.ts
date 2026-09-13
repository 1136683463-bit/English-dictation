import { describe, expect, it } from "vitest";
import {
  ACCUMULATION_UNIT_IDS,
  applySpeedRunMarks,
  chunkCards,
  MAX_WORDS_PER_UNIT,
  restructureOversizedUnits
} from "./bookRestructureService";
import { makeCard, makeUnit, makeTestData } from "./testUtils";

const T = "2024-01-15T00:00:00.000Z";
const makeWords = (unitId: string, count: number, status = "new" as const) =>
  Array.from({ length: count }, (_, index) =>
    makeCard({ id: `${unitId}_card_${index + 1}`, front: `w${index + 1}`, unitId, status })
  );

describe("bookRestructureService", () => {
  describe("chunkCards", () => {
    it("splits into balanced chunks that all respect the max size", () => {
      expect(chunkCards(makeWords("u", 35), 25).map((chunk) => chunk.length)).toEqual([18, 17]);
      expect(chunkCards(makeWords("u", 50), 25).map((chunk) => chunk.length)).toEqual([25, 25]);
      expect(chunkCards(makeWords("u", 51), 25).map((chunk) => chunk.length)).toEqual([17, 17, 17]);
      expect(chunkCards(makeWords("u", 10), 25)).toHaveLength(1);
    });
  });

  describe("restructureOversizedUnits", () => {
    it("splits a 450-word book into three books and migrates progress with the cards", () => {
      const unit = makeUnit({ id: "unit_big", title: "高频核心", order: 1, color: "#f06423" });
      const cards = makeWords("unit_big", 450).map((card, index) =>
        index < 5 ? { ...card, status: "review" as const } : card
      );
      const data = makeTestData({ units: [unit], cards });

      const result = restructureOversizedUnits(data, { timestamp: T });

      expect(result.splitUnitCount).toBe(1);
      expect(result.createdUnitCount).toBe(2);
      expect(result.data.units).toHaveLength(3);
      expect(result.data.units.map((item) => item.title)).toEqual(["高频核心 · 1", "高频核心 · 2", "高频核心 · 3"]);

      const counts = result.data.units.map(
        (item) => result.data.cards.filter((card) => card.unitId === item.id).length
      );
      expect(counts).toEqual([150, 150, 150]);
      // 已学进度跟随迁移：卡片只换 unitId，status / schedules 原样保留。
      const reviewed = result.data.cards.filter((card) => card.status === "review");
      expect(reviewed).toHaveLength(5);
      reviewed.forEach((card) => expect(card.front).toBe(result.data.cards.find((c) => c.id === card.id)?.front));
      // 原书 id 保留在第一块上（外部引用 / createdAt 不丢）。
      expect(result.data.units[0].id).toBe("unit_big");
    });

    it("leaves compliant books and accumulation units untouched, and is idempotent", () => {
      const accumulationId = ACCUMULATION_UNIT_IDS[0];
      const data = makeTestData({
        units: [
          makeUnit({ id: "unit_ok", order: 1 }),
          makeUnit({ id: accumulationId, title: "冒险积累", order: 2 })
        ],
        cards: [...makeWords("unit_ok", 20), ...makeWords(accumulationId, 40)]
      });

      const first = restructureOversizedUnits(data, { timestamp: T });
      expect(first.splitUnitCount).toBe(0);
      expect(first.data.cards.filter((card) => card.unitId === accumulationId)).toHaveLength(40);

      const second = restructureOversizedUnits(first.data, { timestamp: T });
      expect(second.data.units).toEqual(first.data.units);
      expect(second.data.cards).toEqual(first.data.cards);
    });

    it("marks the first two untouched books as speed-run books", () => {
      const data = makeTestData({
        units: [
          makeUnit({ id: "unit_1", order: 1 }),
          makeUnit({ id: "unit_2", order: 2 }),
          makeUnit({ id: "unit_3", order: 3 })
        ],
        cards: [...makeWords("unit_1", 20), ...makeWords("unit_2", 20), ...makeWords("unit_3", 20)]
      });

      const result = restructureOversizedUnits(data, { timestamp: T });
      expect(result.speedRunUnitIds).toEqual(["unit_1", "unit_2"]);
      expect(result.data.units.find((unit) => unit.id === "unit_1")?.speedRun).toBe(true);
      expect(result.data.units.find((unit) => unit.id === "unit_2")?.speedRun).toBe(true);
      expect(result.data.units.find((unit) => unit.id === "unit_3")?.speedRun).toBeUndefined();
    });
  });

  describe("applySpeedRunMarks", () => {
    it("keeps the badge on started books and clears it from untouched non-eligible books", () => {
      const data = makeTestData({
        units: [
          makeUnit({ id: "unit_started", order: 1, speedRun: true }),
          makeUnit({ id: "unit_next", order: 2 }),
          makeUnit({ id: "unit_untouched_marked", order: 3, speedRun: true })
        ],
        cards: [
          ...makeWords("unit_started", 10).map((card) => ({ ...card, status: "review" as const })),
          ...makeWords("unit_untouched_marked", 10),
          ...makeWords("unit_next", 10)
        ]
      });

      // 只保留 1 个速通名额：order 靠前的 unit_next 入选，原来挂了徽标但排在后面的被清除。
      const { data: next } = applySpeedRunMarks(data, 1, T);
      // 已启动的速通本保留徽标；未启动但被挤出名单的清除；新入选的打上标记。
      expect(next.units.find((unit) => unit.id === "unit_started")?.speedRun).toBe(true);
      expect(next.units.find((unit) => unit.id === "unit_untouched_marked")?.speedRun).toBeUndefined();
      expect(next.units.find((unit) => unit.id === "unit_next")?.speedRun).toBe(true);
    });
  });

  it("exposes the 200-word granularity target", () => {
    expect(MAX_WORDS_PER_UNIT).toBe(200);
  });
});
