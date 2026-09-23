// @vitest-environment node
/**
 * PF2d · 超线性路径归因：把 n² 拆到具体的那一行（2026-09-22）
 *
 * PF2a 已经量到 getWeakCardInsights 在 20000 卡时 ~1.5 秒、且增长明显超线性。
 * 本文件把它的内部两个可疑项分别放大，确定谁是 n² 项：
 *   (a) getCardReviews（reviewService.ts:292）—— 每张卡都 `data.reviews.filter(...)`
 *   (b) data.schedules.find（reviewService.ts:320）—— 每张卡都线性查一次计划表
 *
 * 方法：造三组数据，只改其中一个变量（复习记录数 / 计划表长度），看耗时如何变。
 * 判据用相对比值，不依赖绝对毫秒。
 */
import { describe, expect, it } from "vitest";
import { scaleData, timeMedian } from "./pf2Scale";
import { getWeakCardInsights, getLearningStats } from "../../services/reviewService";
import { getUnitStats } from "../../services/unitService";
import { getMistakeGroupsByDate } from "../../services/mistakeBookService";

const ROUNDS = 3;

const measure = (label: string, run: () => unknown) => {
  const ms = timeMedian(run, ROUNDS);
  console.log(`  ${label.padEnd(52)} ${ms.toFixed(2).padStart(9)}ms`);
  return ms;
};

describe("PF2d · 超线性归因", () => {
  it("getWeakCardInsights：卡片数固定，复习记录翻倍 → 耗时是否翻倍（(a) 项）", () => {
    console.log("\n[PF2d] getWeakCardInsights：卡片数固定 2000，只增加复习记录数");
    const rows: Array<{ reviews: number; ms: number }> = [];
    for (const reviewsPerCard of [1, 2, 4, 8]) {
      const data = scaleData({ cards: 2000, reviewsPerCard });
      const ms = measure(`2000 卡 / ${data.reviews.length} 复习`, () =>
        getWeakCardInsights(data, { type: "word", limit: 30 })
      );
      rows.push({ reviews: data.reviews.length, ms });
    }
    console.log(
      `  → 复习记录 2000→16000（8x），耗时 ${rows[0].ms.toFixed(1)}→${rows[3].ms.toFixed(1)}ms（${(rows[3].ms / Math.max(rows[0].ms, 0.001)).toFixed(1)}x）\n` +
        `     接近线性 → (a) getCardReviews 的「每卡 filter 全部 reviews」合计是 O(cards × reviews)\n` +
        `     （卡片固定时表现为对 reviews 线性，但卡片与 reviews 同时增长时是乘积）`
    );
    expect(rows.length).toBe(4);
  });

  it("getWeakCardInsights：复习记录固定，卡片数翻倍 → 耗时是否翻倍（(a)+(b) 共同作用）", () => {
    /**
     * ⚠️ 基线变动记录（2026-09-22 09:00）：本用例原先是「O(cards × reviews) 的归因证据」，
     * 断言 `耗时比 > 规模比 × 2`。当轮并行修复把 `getWeakCardInsights` 改成
     * 「一次遍历建 reviews / schedules 索引（`reviewService.ts:307-330`）」→ 降为 O(n + m)，
     * 该断言随即失败（8x 规模只产生 3.6x 耗时 ≈ 线性）——**这正是修复生效的证据**。
     *
     * 因此这里改为「确认它已经线性」：断言耗时比不超过规模比的 2.5 倍。
     * 历史数据（修复前）：500→4000 卡为 2.4→144.0ms（60.4x，平方）；
     * 修复后见下方打印。
     */
    console.log("\n[PF2d] getWeakCardInsights：每卡复习数固定 4，卡片数递增（修复后应线性）");
    const rows: Array<{ cards: number; reviews: number; ms: number }> = [];
    for (const cards of [500, 1000, 2000, 4000]) {
      const data = scaleData({ cards, reviewsPerCard: 4 });
      const ms = measure(`${cards} 卡 / ${data.reviews.length} 复习`, () =>
        getWeakCardInsights(data, { type: "word", limit: 30 })
      );
      rows.push({ cards, reviews: data.reviews.length, ms });
    }
    const ratio = rows[3].ms / Math.max(rows[0].ms, 0.001);
    const scale = rows[3].cards / rows[0].cards;
    console.log(
      `  → 卡片 500→4000（${scale}x），耗时 ${rows[0].ms.toFixed(1)}→${rows[3].ms.toFixed(1)}ms（${ratio.toFixed(1)}x）\n` +
        `     修复前为 60.4x（平方）；现在 ${ratio.toFixed(1)}x ≈ 线性 ⇒ 索引化生效。`
    );
    expect(
      ratio,
      `卡片 ${scale}x → 耗时 ${ratio.toFixed(1)}x（线性应 ≈${scale}x，允许 2.5 倍余量）`
    ).toBeLessThan(scale * 2.5);
  });

  it("getUnitStats：计划表用 find 而非 Map → 与卡数平方相关", () => {
    console.log("\n[PF2d] getUnitStats(单本)：只改卡片数，schedules.find 每卡一次线性查找");
    const rows: Array<{ unitCards: number; ms: number }> = [];
    for (const unitCount of [1, 10, 40]) {
      const cards = 4000;
      const data = scaleData({ cards, unitCount });
      const unitCards = Math.round(data.cards.filter((card) => card.unitId === data.units[0].id).length);
      const ms = measure(`${unitCards} 卡的词书（总卡 ${cards}）`, () => getUnitStats(data, data.units[0]));
      rows.push({ unitCards, ms });
    }
    console.log(
      `  → getUnitStats 内部：getCardsForUnit 全库 filter + reviews.filter(cardIds) 全库 + ` +
        `每张卡 data.schedules.find（unitService.ts:26）\n` +
        `     后者的理论成本 = 本卡数 × schedules 总数，本卡数随「总卡数/词书数」变化，\n` +
        `     故总成本 ≈ 本卡数 × 总卡数。实测 ${rows.map((row) => `${row.unitCards}卡 ${row.ms.toFixed(1)}ms`).join(" / ")}`
    );
    expect(rows.length).toBe(3);
  });

  it("getMistakeGroupsByDate + 页面侧 getMistakeInsight：条目数 × 复习记录数", () => {
    console.log("\n[PF2d] 错词本页数据准备（5000 卡，低分占比 50%）");
    const data = scaleData({ cards: 5000, reviewsPerCard: 1, wrongRatio: 0.5 });
    const groups = getMistakeGroupsByDate(data);
    const entries = groups.reduce((sum, group) => sum + group.entries.length, 0);
    const indexMs = measure(
      `getMistakeGroupsByDate 建索引（${entries} 条目）`,
      () => getMistakeGroupsByDate(data)
    );
    // 页面侧：每个条目一次 getMistakeInsight（内部 reviews.filter）—— 复刻其成本模型
    const reviewCount = data.reviews.length;
    const insightMs = measure(
      `页面侧 getMistakeInsight × ${entries} 条目（每条 filter ${reviewCount} 复习）`,
      () => {
        for (const group of groups) {
          for (const entry of group.entries) {
            data.reviews.filter((review) => review.cardId === entry.card.id);
          }
        }
      }
    );
    // 页面还有第二处：groupProgress 对每天每组各算一轮（MistakeBookPage.tsx:408-417）
    const groupProgressMs = measure(
      `页面侧 groupProgress 再算一轮（同形，MistakeBookPage.tsx:408）`,
      () => {
        for (const group of groups) {
          for (const entry of group.entries) {
            data.reviews.filter((review) => review.cardId === entry.card.id);
          }
        }
      }
    );
    console.log(
      `  → 一次性页面数据准备合计 ≈ ${(indexMs + insightMs + groupProgressMs).toFixed(1)}ms\n` +
        `     其中「条目数 × 复习记录数」两项（entryInsights + groupProgress）占 ${(insightMs + groupProgressMs).toFixed(1)}ms，` +
        `是建索引本身的 ${((insightMs + groupProgressMs) / Math.max(indexMs, 0.001)).toFixed(1)} 倍\n` +
        `     两处形状完全相同的计算（都是「每条目 → filter 全部 reviews」），未共用索引。`
    );
    expect(entries).toBeGreaterThan(0);
  });

  it("getLearningStats：单次调用的内部遍历成本随规模（对照基线）", () => {
    console.log("\n[PF2d] getLearningStats 规模曲线（作为「线性」的对照基线）");
    const rows: Array<{ n: number; ms: number }> = [];
    for (const n of [1000, 2000, 4000, 8000]) {
      const data = scaleData({ cards: n });
      const ms = measure(`${n} 卡 / ${data.reviews.length} 复习`, () => getLearningStats(data));
      rows.push({ n, ms });
    }
    const ratio = rows[3].ms / Math.max(rows[0].ms, 0.001);
    const scale = rows[3].n / rows[0].n;
    console.log(
      `  → 规模 ${scale}x，耗时 ${ratio.toFixed(1)}x（≈线性，因为内部全是单遍 filter，无嵌套 find）`
    );
    expect(ratio).toBeLessThan(scale * 3);
  });
});
