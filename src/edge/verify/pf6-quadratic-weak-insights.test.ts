// @vitest-environment node
/**
 * PF6 · 弱项分析不得是二次复杂度（2026-09-22 修，P0 性能）
 *
 * `getWeakCardInsights` 此前每张卡都 `data.reviews.filter(cardId)` +
 * `data.schedules.find(cardId)` —— O(卡片数 × 复习记录数)。
 * 而它挂在 `ReviewPage` / `UnitsPage` 的 `useMemo(..., [data])` 上，
 * **每次数据变化都重算**（答一题、改设置都触发）。
 *
 * 实测（词卡）修复前 → 修复后：
 *   500 × 10 = 26ms   → 1.1ms
 *   2000 × 10 = 475ms → 3.9ms
 *   2000 × 50 = 1836ms → 23ms
 *   5000 × 50 = 12075ms（12 秒） → 49.8ms
 *
 * 断言用**增长趋势**而非绝对毫秒：二次复杂度在规模翻倍时约 4 倍，
 * 线性则在 2 倍附近。用「4 倍规模 → 耗时不超过 8 倍」把二次曲线排除掉。
 */
import { describe, expect, it } from "vitest";
import { getWeakCardInsights } from "../../services/reviewService";
import { makeAppData } from "./fixtures";
import type { Card, Review, Schedule } from "../../types";

const build = (cards: number, reviewsPerCard: number) => {
  const cardList: Card[] = Array.from({ length: cards }, (_, i) => ({
    id: `w${i}`,
    type: "word" as const,
    front: `word${i}`,
    back: "含义",
    note: "",
    tags: [],
    status: "review" as const,
    priority: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  }));
  const schedules: Schedule[] = cardList.map((card) => ({
    cardId: card.id,
    easeFactor: 2.5,
    intervalDays: 3,
    reviewCount: reviewsPerCard,
    lapseCount: 1,
    nextReviewAt: "2024-01-01T00:00:00.000Z"
  }));
  const reviews: Review[] = [];
  for (let i = 0; i < cards; i += 1) {
    for (let j = 0; j < reviewsPerCard; j += 1) {
      reviews.push({
        id: `r${i}-${j}`,
        cardId: `w${i}`,
        mode: "spelling",
        rating: (j % 4 === 0 ? 2 : 4) as 2 | 4,
        answer: "x",
        diffJson: "[]",
        reviewedAt: `2024-0${(j % 9) + 1}-01T00:00:00.000Z`
      });
    }
  }
  return makeAppData({ cards: cardList, schedules, reviews });
};

/**
 * 取「多轮中的最小值」作为耗时估计。
 *
 * 为什么不用单次或平均：整套测试是并行跑的，其他用例的 CPU 占用会污染单次测量
 * （实测同一个用例单独跑 88ms 通过、在全量并行下偶发失败）。
 * 最小值最接近「没有外界干扰时的真实成本」，也最稳定。
 */
const measure = (cards: number, reviewsPerCard: number, rounds = 5): number => {
  const data = build(cards, reviewsPerCard);
  getWeakCardInsights(data, { type: "word", limit: 3 }); // 预热
  let best = Number.POSITIVE_INFINITY;
  for (let i = 0; i < rounds; i += 1) {
    const t0 = performance.now();
    getWeakCardInsights(data, { type: "word", limit: 3 });
    best = Math.min(best, performance.now() - t0);
  }
  return best;
};

describe("PF6 弱项分析复杂度", () => {
  it("规模翻 4 倍时耗时不超过 8 倍（排除二次复杂度）", () => {
    const small = measure(1000, 10);
    const large = measure(4000, 10);
    /**
     * 二次复杂度在 4 倍规模下约 16 倍；线性约 4 倍。
     * 阈值取 8 倍：留出缓存/GC 抖动余量，同时能挡住二次曲线。
     */
    expect(
      large,
      `4000 卡（${large.toFixed(1)}ms）相对 1000 卡（${small.toFixed(1)}ms）不应超过 8 倍——` +
        `若超了说明又退回了 O(卡片 × 复习记录)`
    ).toBeLessThan(Math.max(small * 8, 60));
  });

  it("复习记录翻 5 倍（卡片数不变）时耗时不超过 10 倍", () => {
    const few = measure(1500, 10);
    const many = measure(1500, 50);
    expect(
      many,
      `同样 1500 卡、复习记录 5 倍（${many.toFixed(1)}ms vs ${few.toFixed(1)}ms）不应超过 10 倍`
    ).toBeLessThan(Math.max(few * 10, 80));
  });

  it("结果正确性不因索引化而改变（抽样核对）", () => {
    const data = build(50, 4);
    const insights = getWeakCardInsights(data, { type: "word", limit: 3 });
    /**
     * 构造：每张卡 4 条复习，rating 依次为 [2,4,4,4]（j%4===0 时给 2），
     * 时间戳按月份升序 → 最新一条是 rating=4（对）。
     * 所以：wrongCount=1、consecutiveWrongCount=0（最近一条是对的）。
     */
    expect(insights.length, "应有弱项").toBeGreaterThan(0);
    for (const insight of insights) {
      expect(insight.wrongCount, "错题数应与构造一致").toBe(1);
      expect(insight.consecutiveWrongCount, "最近一条是对，连续错题数应为 0").toBe(0);
      expect(insight.lapseCount, "lapseCount 取自计划").toBe(1);
      // 索引化后 latestWrongReview 仍应指向那条唯一的错题
      expect(insight.latestWrongReview?.rating, "最新的错题应是 rating=2 那条").toBe(2);
    }
    // limit 生效
    expect(getWeakCardInsights(data, { type: "word", limit: 2 }).length).toBe(2);
  });
});
