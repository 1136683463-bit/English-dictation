// @vitest-environment node
/**
 * PF7 · 词书统计（getUnitStats）的性能与正确性（2026-09-22 修，P1）
 *
 * 这个函数**在 UnitsPage 的渲染循环里**对每个词书各调一次
 * （`{section.units.map((unit) => { const stats = getUnitStats(data, unit); …})}`），
 * 内部却有两处全量扫描：`data.reviews.filter(...)` 与「每张卡 `schedules.find`」。
 * 实测 20 词书 × 100 卡 = 22.3ms → 索引化后 7.9ms。
 */
import { describe, expect, it } from "vitest";
import { getUnitStats } from "../../services/unitService";
import { makeAppData } from "./fixtures";
import type { Card, Review, Schedule, Unit } from "../../types";

const unit = (id: string): Unit => ({
  id,
  title: `U${id}`,
  description: "",
  order: 1,
  color: "#000",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
});

const card = (id: string, unitId: string, status: Card["status"]): Card =>
  ({
    id,
    type: "word",
    front: `w${id}`,
    back: "x",
    note: "",
    tags: [],
    unitId,
    status,
    priority: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  }) as Card;

const schedule = (cardId: string, due: boolean): Schedule => ({
  cardId,
  easeFactor: 2.5,
  intervalDays: 3,
  reviewCount: 2,
  lapseCount: 0,
  nextReviewAt: due ? "2024-01-01T00:00:00.000Z" : "2099-01-01T00:00:00.000Z"
});

const review = (id: string, cardId: string, rating: 1 | 2 | 3 | 4): Review => ({
  id,
  cardId,
  mode: "spelling",
  rating,
  answer: "x",
  diffJson: "[]",
  reviewedAt: "2024-01-01T00:00:00.000Z"
});

describe("PF7 词书统计", () => {
  it("结果不因索引化而改变（抽样核对每个数字）", () => {
    const data = makeAppData({
      units: [unit("u1"), unit("u2")],
      cards: [card("a", "u1", "mastered"), card("b", "u1", "review"), card("c", "u2", "new")],
      schedules: [schedule("a", true), schedule("b", false), schedule("c", true)],
      reviews: [review("r1", "a", 4), review("r2", "a", 3), review("r3", "b", 1)]
    });

    const s1 = getUnitStats(data, data.units[0]);
    expect(s1.total, "u1 有 2 张卡").toBe(2);
    expect(s1.mastered, "u1 已掌握 1 张").toBe(1);
    expect(s1.learning, "u1 进行中 1 张").toBe(1);
    expect(s1.newWords, "u1 无新卡").toBe(0);
    expect(s1.due, "u1 到期的只有 a").toBe(1);
    // 拼写记录：a 有 2 条（4、3 都对），b 有 1 条（1 错）→ 正确率 2/3 = 67%
    expect(s1.accuracy, "u1 正确率应为 67%").toBe(67);

    const s2 = getUnitStats(data, data.units[1]);
    expect(s2.total, "u2 有 1 张卡").toBe(1);
    expect(s2.newWords, "u2 是新卡").toBe(1);
    expect(s2.due, "u2 到期").toBe(1);
    expect(s2.accuracy, "u2 无拼写记录 → 0").toBe(0);
  });

  it("空词书不崩（分母为 0 的边界）", () => {
    const data = makeAppData({ units: [unit("empty")], cards: [], schedules: [], reviews: [] });
    const stats = getUnitStats(data, data.units[0]);
    expect(stats.total).toBe(0);
    expect(stats.accuracy).toBe(0);
    expect(stats.completionPercent).toBe(0);
    expect(Number.isFinite(stats.estimatedDays), "预计天数不应是 NaN/Infinity").toBe(true);
  });

  it("多词书场景：耗时不应随「复习记录数」线性膨胀到不可接受", () => {
    const units = Array.from({ length: 20 }, (_, i) => unit(`u${i}`));
    const cards: Card[] = [];
    const schedules: Schedule[] = [];
    const reviews: Review[] = [];
    for (const u of units) {
      for (let k = 0; k < 100; k += 1) {
        const id = `${u.id}-c${k}`;
        cards.push(card(id, u.id, "review"));
        schedules.push(schedule(id, true));
        for (let j = 0; j < 5; j += 1) reviews.push(review(`r${id}-${j}`, id, 3));
      }
    }
    const data = makeAppData({ units, cards, schedules, reviews });
    const run = () => {
      for (const u of data.units) getUnitStats(data, u);
    };
    run();
    const t0 = performance.now();
    run();
    const cost = performance.now() - t0;
    /**
     * 判据用宽松上限：整屏 20 个词书应在「一帧多一点」内算完。
     * 修复前实测 22.3ms（超一帧预算 16.7ms），修复后 7.9ms。
     */
    expect(cost, `20 词书 × 100 卡共 ${20 * 100 * 5} 条复习，整屏统计 ${cost.toFixed(1)}ms`).toBeLessThan(40);
  });
});
