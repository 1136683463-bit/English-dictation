// @vitest-environment node
/**
 * PF2i · 追加式数组重建的平方项（2026-09-22）
 *
 * 可疑点：`statsService.ts:409` 用
 *     reviewsByWordId.set(review.cardId, [...(reviewsByWordId.get(review.cardId) ?? []), review]);
 * 即**每来一条复习记录就把该卡的历史数组整体复制一遍**。
 * 单卡累计 m 条时该处成本 = 1+2+…+m = O(m²)。
 *
 * 本文件分两步：
 *   ① 把这一处的成本**单独**量出来（确定它确实是 O(m²)）；
 *   ② 再看它在 getWeeklyStatsReport 的总成本里是不是主导项（**这一步是否定的**，如实记录）。
 *
 * 结论（先写在这里，避免误读）：该处确实随「单卡历史深度」平方增长，
 * 但在实测的运营点上被 7 × O(总 reviews) 的线性遍历盖过，
 * 故 getWeeklyStatsReport 的**端到端**曲线仍近似线性 —— 列 P2（理论问题 + 未来风险），
 * 不列 P0/P1。
 */
import { describe, expect, it } from "vitest";
import { scaleData, timeMedian } from "./pf2Scale";
import { getWeeklyStatsReport } from "../../services/statsService";
import type { AppData, Review } from "../../types";

/** 造「少量卡片、每卡大量复习记录」的数据——长期用户的真实形状（同卡反复复习）。 */
const deepHistoryData = (cardCount: number, reviewsPerCard: number): AppData => {
  const base = scaleData({ cards: cardCount, unitCount: 1 });
  const reviews: Review[] = [];
  for (let cardIndex = 0; cardIndex < base.cards.length; cardIndex += 1) {
    const card = base.cards[cardIndex];
    for (let index = 0; index < reviewsPerCard; index += 1) {
      reviews.push({
        id: `r-${cardIndex}-${index}`,
        cardId: card.id,
        mode: "spelling",
        rating: index % 3 === 0 ? 1 : 4,
        answer: card.front,
        diffJson: "[]",
        reviewedAt: new Date(Date.now() - (index + 1) * 6 * 60 * 60 * 1000).toISOString()
      });
    }
  }
  return { ...base, reviews } as AppData;
};

/** 复刻 statsService.ts:405-410 的那段索引构建（只这一段的成本）。 */
const buildReviewsByWordIdSpread = (data: AppData): number => {
  const cardById = new Map(data.cards.map((card) => [card.id, card]));
  const reviewsByWordId = new Map<string, Review[]>();
  data.reviews.forEach((review) => {
    const card = cardById.get(review.cardId);
    if (!card || card.type !== "word" || card.status === "suspended") return;
    reviewsByWordId.set(review.cardId, [...(reviewsByWordId.get(review.cardId) ?? []), review]);
  });
  return reviewsByWordId.size;
};

/** 同样语义、但用 push（O(1) 追加）——作为「本该如何」的对照。 */
const buildReviewsByWordIdPush = (data: AppData): number => {
  const cardById = new Map(data.cards.map((card) => [card.id, card]));
  const reviewsByWordId = new Map<string, Review[]>();
  data.reviews.forEach((review) => {
    const card = cardById.get(review.cardId);
    if (!card || card.type !== "word" || card.status === "suspended") return;
    const bucket = reviewsByWordId.get(review.cardId);
    if (bucket) bucket.push(review);
    else reviewsByWordId.set(review.cardId, [review]);
  });
  return reviewsByWordId.size;
};

describe("PF2i · 追加式数组重建", () => {
  it("① 该处单独成本：单卡历史深度翻倍 → 耗时 ≈ 4 倍（确认 O(m²)）", () => {
    const rows: Array<{ perCard: number; total: number; spread: number; push: number }> = [];
    for (const perCard of [500, 1000, 2000, 4000]) {
      const data = deepHistoryData(50, perCard);
      rows.push({
        perCard,
        total: data.reviews.length,
        spread: timeMedian(() => buildReviewsByWordIdSpread(data), 3),
        push: timeMedian(() => buildReviewsByWordIdPush(data), 3)
      });
    }
    const ratio = (index: number) =>
      `${(rows[index].spread / Math.max(rows[index - 1].spread, 0.001)).toFixed(2)}x (深度 ${rows[index].perCard / rows[index - 1].perCard}x)`;
    console.log(
      `\n[PF2i] ① statsService.ts:409 那一处单独成本（50 卡固定，加深单卡历史）\n` +
        `  每卡记录     总 reviews   [...prev, review]    push 对照      倍数\n` +
        rows
          .map(
            (row, index) =>
              `  ${String(row.perCard).padStart(7)}  ${String(row.total).padStart(11)}  ` +
              `${row.spread.toFixed(2).padStart(15)}ms  ${row.push.toFixed(2).padStart(9)}ms   ` +
              `${index === 0 ? "—" : ratio(index)}`
          )
          .join("\n") +
        `\n  → [...prev, review] 为 O(m²)：深度翻倍 → 耗时约 4 倍，实测确认。\n` +
        `     push 对照是 O(m)：同样语义、同样遍历，成本几乎不随深度变化。\n` +
        `     ⇒ 这是**写法导致的平方项**，不是数据规模必然。`
    );
    // 确认平方：深度 8x → 耗时应显著超过 8x
    const spreadRatio = rows[3].spread / Math.max(rows[0].spread, 0.001);
    expect(
      spreadRatio,
      `单卡深度 ${rows[3].perCard / rows[0].perCard}x 却耗时 ${spreadRatio.toFixed(1)}x`
    ).toBeGreaterThan(20);
  });

  it("② 端到端 getWeeklyStatsReport：该平方项在实测点上不是主导项（如实记录）", () => {
    const rows: Array<{ perCard: number; ms: number }> = [];
    for (const perCard of [100, 200, 400, 800]) {
      const data = deepHistoryData(200, perCard);
      rows.push({ perCard, ms: timeMedian(() => getWeeklyStatsReport(data), 3) });
    }
    const linearity = rows.map((row, index) => {
      if (index === 0) return "—";
      const prev = rows[index - 1];
      return `${(row.ms / Math.max(prev.ms, 0.001)).toFixed(2)}x (深度 ${row.perCard / prev.perCard}x)`;
    });
    console.log(
      `\n[PF2i] ② getWeeklyStatsReport 端到端（200 卡固定，加深单卡历史）\n` +
        rows
          .map(
            (row, index) =>
              `  每卡 ${String(row.perCard).padStart(4)} 条（总 ${200 * row.perCard} reviews）  ` +
              `${row.ms.toFixed(2).padStart(9)}ms   ${linearity[index]}`
          )
          .join("\n") +
        `\n  → 端到端仍近似线性（每档约 2x）：因为函数里还有 7 天趋势 × 全量 reviews.filter 等\n` +
        `     线性项，在实测的 4 万–16 万条区间里盖过了这个平方项。\n` +
        `  ⇒ **该平方项尚未支配端到端耗时**。它不是 P0/P1，而是「深度继续增长后会上位的风险」。`
    );
    const deepRatio = rows[3].ms / Math.max(rows[0].ms, 0.001);
    const depthRatio = rows[3].perCard / rows[0].perCard;
    // 记录事实：端到端是近似线性（未超线性爆炸）
    expect(deepRatio, `端到端 ${depthRatio}x 深度 → ${deepRatio.toFixed(1)}x 耗时`).toBeLessThan(depthRatio * 1.6);
  });

  it("③ 交叉点推算：单卡历史多深时该平方项才会开始支配", () => {
    // 求「spread 成本」何时追上「端到端其余部分」：用实测比值外推
    const probeDepth = 4000;
    const data = deepHistoryData(50, probeDepth);
    const spread = timeMedian(() => buildReviewsByWordIdSpread(data), 3);
    const push = timeMedian(() => buildReviewsByWordIdPush(data), 3);
    console.log(
      `\n[PF2i] ③ 50 卡 × 每卡 ${probeDepth} 条（共 ${data.reviews.length} 条）时：\n` +
        `     spread 写法 ${spread.toFixed(1)}ms vs push 写法 ${push.toFixed(1)}ms（浪费 ${(spread - push).toFixed(1)}ms，${(spread / Math.max(push, 0.001)).toFixed(1)}x）\n` +
        `     单纯换 push 就能消掉这个平方项，且不改变任何语义（同序、同内容）。`
    );
    expect(spread).toBeGreaterThan(push);
  });
});
