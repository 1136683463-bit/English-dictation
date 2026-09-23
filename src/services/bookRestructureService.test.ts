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
    /**
     * 2026-09-23 语义收紧：徽标「**只加不摘**」。
     *
     * 原断言是「未启动但被挤出前 N 名的书要清除徽标」。实测这条规则会造成
     * **徽标蔓延**（MG3b 的 FAIL-4）：用户每开始学一本，它就从「未启动」集合退出、
     * 后面的书立刻补位带徽标，最终 5 本内置词书全部标着「3天速通」——
     * 「推荐你从这本开始」在每本书上都成立时，等于没有推荐。
     *
     * 现在：已发出的徽标一律保留（含被挤出前 N 名的、含已启动的）；
     * 只有当**已发出的不足 count** 时，才从未发过徽标的未启动书里补足。
     */
    it("keeps badges already issued and supplements only when short of count", () => {
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

      /**
       * 名额调成 1：已发出的两枚徽标（unit_started 已启动、unit_untouched_marked 未启动）
       * **都保留**——它们已经推荐给用户了，不该因为名额收紧而中途撤回；
       * 已发出的（2）≥ 名额（1），所以**不需要补位**，unit_next 不获得徽标。
       */
      const { data: next } = applySpeedRunMarks(data, 1, T);
      expect(next.units.find((unit) => unit.id === "unit_started")?.speedRun, "已启动的徽标保留").toBe(true);
      expect(
        next.units.find((unit) => unit.id === "unit_untouched_marked")?.speedRun,
        "未启动但已发过徽标 → 保留（不再因被挤出前 N 而撤回）"
      ).toBe(true);
      expect(
        next.units.find((unit) => unit.id === "unit_next")?.speedRun,
        "已发出的已够名额 → 不补位"
      ).toBeUndefined();
    });
  });

  it("exposes the 200-word granularity target", () => {
    expect(MAX_WORDS_PER_UNIT).toBe(200);
  });
});
