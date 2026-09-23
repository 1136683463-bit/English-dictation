// @vitest-environment node
/**
 * R12a · 「归档救不了」与「常驻体积」的构成（2026-09-23 第 12 轮）
 *
 * ## 本文件推翻了上一轮的建议方向
 *
 * 第 11 轮我发现「桌面端约 8 个月撞墙」并建议「把归档建议做得更醒目」。
 * 本轮动手前先验证「归档是否真的能一直解决问题」，结果发现**不能**：
 *
 * 归档只压 `reviews`，压完**恒定在 ~0.9MB**（它按天汇总，与用了多久无关）。
 * 而 `cards` / `schedules` / `sentenceDetails` **随使用无上限增长**。
 * 于是归档后的总体积一路涨：
 *
 * | 使用时长 | 归档后体积 | 能否写入 WebKit |
 * |---|---|---|
 * | 6 个月 | 3.65MB | ✅ |
 * | 8 个月 | 4.35MB | ✅ |
 * | **10 个月** | **5.03MB** | **❌ 已经写不下** |
 * | 24 个月 | 9.82MB | ❌ |
 *
 * **也就是说归档只把墙从 8 个月推到 10 个月**，之后无论归档多少次都没用——
 * 因为可压的那部分已经压到极限（~0.9MB），剩下的全是不可压的常驻数据。
 *
 * ## 那常驻体积里有没有能摘的
 *
 * 12 个月归档后按**字符**归属（合计 100%）：
 *
 * | 字段 | 占比 | 性质 |
 * |---|---|---|
 * | `cards` | 38.7% | 用户的学习对象本身，不可摘 |
 * | `reviews` | 23.9% | 归档后剩余（每天一条汇总） |
 * | `sentenceDetails` | 20.8% | 含一处**真冗余**（见下） |
 * | `schedules` | 16.6% | 排期状态，每卡一条 |
 *
 * `sentenceDetails.sentence` **恒等于 `card.front`**（同一个字段存两遍），
 * 且全库没有任何消费方读它。但实测它只占**总体的 3.4%**——
 * 摘掉省 0.18MB，对「10 个月写不下」毫无帮助。
 *
 * **结论：没有一处「一行改动就能解决」的冗余。** 墙的本质是
 * 「每张卡的常驻数据 × 卡片数量」超出了 WebKit 给的约 5MB。
 * 真正的出路只能是**减少常驻数据**（缩字段）或**换存储**（IndexedDB），
 * 两者都是产品级决策，不是清理技巧。
 *
 * 记录这个结论，是为了避免后人（包括我自己）再去试「摘冗余字段」这条路。
 */
import { describe, expect, it } from "vitest";
import { compactReviewHistory } from "../../services/reviewArchiveService";
import { storageCostBytes } from "../../services/storage";
import { makeAppData, cardsToData, makeSentenceCard } from "./fixtures";
import type { AppData, Review } from "../../types";

/** WebKit 实测可用量（字节）：2.6M 字符 × 2（含汉字整串翻倍）。 */
const WEBKIT_QUOTA_BYTES = 2_600_000 * 2;
const DAY_MS = 86_400_000;

/** 按「每天 20 分钟」的密度铺 months 个月的数据。 */
const buildAtMonth = (months: number, now: Date): AppData => {
  const days = Math.round(months * 30);
  const cardCount = months * 300;
  const cards = Array.from({ length: cardCount }, (_, index) =>
    makeSentenceCard({
      id: `c-${index}`,
      sentence: `I have been learning sentence number ${index} for quite a while now.`,
      note: `第 ${index} 句：中文笔记。`,
      tags: ["语法"],
      schedule: { reviewCount: 3, intervalDays: 5, nextReviewAt: "2024-01-01T00:00:00.000Z" },
      sourceId: `imported:${index}`
    })
  );
  const reviews: Review[] = [];
  for (let day = 0; day < days; day += 1) {
    for (let n = 0; n < 30; n += 1) {
      reviews.push({
        id: `r-${day}-${n}`,
        cardId: cards[(day * 30 + n) % cardCount].card.id,
        mode: (["recognize", "recall", "spelling", "cloze"] as const)[n % 4],
        rating: (n % 4 === 0 ? 2 : 4) as Review["rating"],
        answer: "I have been learning this sentence for a while.",
        reviewedAt: new Date(now.getTime() - day * DAY_MS + n * 1000).toISOString()
      });
    }
  }
  return makeAppData({ ...cardsToData(cards), reviews });
};

const NOW = new Date("2026-09-23T00:00:00.000Z");

describe("R12a 归档的极限", () => {
  it("★ 归档只把墙从 8 个月推到 10 个月——之后归档多少次都没用", () => {
    const rows = [6, 8, 10, 12, 18, 24].map((months) => {
      const raw = buildAtMonth(months, NOW);
      const archived = compactReviewHistory(raw, { retentionDays: 180, now: NOW }).data;
      return {
        months,
        rawCost: storageCostBytes(JSON.stringify(raw)),
        archivedCost: storageCostBytes(JSON.stringify(archived)),
        archivedReviewsCost: storageCostBytes(JSON.stringify(archived.reviews))
      };
    });

    console.log("\n[R12a] 归档前后（WebKit 计费口径，可用 %.2fMB）：".replace("%.2f", (WEBKIT_QUOTA_BYTES / 1024 / 1024).toFixed(2)));
    for (const row of rows) {
      console.log(
        `  ${String(row.months).padStart(2)} 个月：原始 ${(row.rawCost / 1024 / 1024).toFixed(2)}MB ` +
          `→ 归档后 ${(row.archivedCost / 1024 / 1024).toFixed(2)}MB ` +
          `（其中 reviews 已压到 ${(row.archivedReviewsCost / 1024 / 1024).toFixed(2)}MB）` +
          `  ${row.archivedCost > WEBKIT_QUOTA_BYTES ? "❌ 写不下" : "✅"}`
      );
    }

    const at6 = rows.find((row) => row.months === 6)!;
    const at10 = rows.find((row) => row.months === 10)!;
    const at24 = rows.find((row) => row.months === 24)!;

    /**
     * 归档**确实有效**：8 个月时原始 5.12MB（已接近额度），
     * 若不归档，10 个月就会写不下；归档后 8 个月只有 4.35MB，还留有余量。
     */
    const at8 = rows.find((row) => row.months === 8)!;
    expect(at8.archivedCost, "归档后 8 个月仍有余量").toBeLessThan(WEBKIT_QUOTA_BYTES);
    expect(at8.rawCost, "不归档时 8 个月已接近额度").toBeGreaterThan(at8.archivedCost);
    expect(at6.archivedCost, "6 个月归档后当然也能写").toBeLessThan(WEBKIT_QUOTA_BYTES);

    // 但 10 个月归档后依然写不下 —— 这就是「救不了」的证据
    expect(at10.archivedCost, "10 个月归档后仍然写不下").toBeGreaterThan(WEBKIT_QUOTA_BYTES);
    expect(at24.archivedCost, "24 个月更写不下").toBeGreaterThan(WEBKIT_QUOTA_BYTES);

    /**
     * 关键不变量：**归档后的 reviews 恒定在 0.8~0.95MB**（按天汇总，与时长无关）。
     * 于是增长全部来自不可压的常驻数据 —— 这条是「再归档也没用」的机械成因。
     */
    const reviewsFlat = rows.map((row) => row.archivedReviewsCost);
    const spreadMb = (Math.max(...reviewsFlat) - Math.min(...reviewsFlat)) / 1024 / 1024;
    console.log(
      `\n[R12a] 归档后 reviews 恒定在 ` +
        `${(Math.min(...reviewsFlat) / 1024 / 1024).toFixed(2)}~${(Math.max(...reviewsFlat) / 1024 / 1024).toFixed(2)}MB ` +
        `（跨度仅 ${spreadMb.toFixed(2)}MB，与用了多久无关）\n` +
        `  → 体积增长全部来自 cards/schedules/sentenceDetails 这些不可压的常驻数据`
    );
    expect(spreadMb, "归档后的 reviews 基本不随时长增长").toBeLessThan(0.2);
  });

  it("★ 常驻体积的构成：没有一处「一行改动就能解决」的冗余", () => {
    const archived = compactReviewHistory(buildAtMonth(12, NOW), { retentionDays: 180, now: NOW }).data;
    const json = JSON.stringify(archived);
    const totalChars = json.length;

    const parts = [
      ["cards", archived.cards],
      ["reviews", archived.reviews],
      ["sentenceDetails", archived.sentenceDetails],
      ["schedules", archived.schedules]
    ] as const;
    const rows = parts
      .map(([name, value]) => ({ name, chars: JSON.stringify(value).length }))
      .sort((a, b) => b.chars - a.chars);

    console.log(`\n[R12a] 12 个月归档后的常驻体积构成（字符 ${(totalChars / 1024 / 1024).toFixed(2)}MB）：`);
    for (const row of rows) {
      console.log(`  ${row.name.padEnd(18)} ${(row.chars / 1024 / 1024).toFixed(2)}MB  ${((row.chars / totalChars) * 100).toFixed(1)}%`);
    }

    // 四大项应覆盖绝大多数体积（其余是键名与小字段）
    const covered = rows.reduce((sum, row) => sum + row.chars, 0) / totalChars;
    expect(covered, "四大项覆盖绝大部分体积").toBeGreaterThan(0.95);
    // cards 是最大项，且它是用户的学习对象本身——不可摘
    expect(rows[0].name, "最大项是 cards").toBe("cards");
    expect(rows[0].chars / totalChars, "cards 占比在 35%~45%").toBeGreaterThan(0.35);
    expect(rows[0].chars / totalChars, "cards 占比在 35%~45%").toBeLessThan(0.45);
  });

  it("冗余确实存在，但幅度不足以改变结论", () => {
    const archived = compactReviewHistory(buildAtMonth(12, NOW), { retentionDays: 180, now: NOW }).data;
    const detailsChars = JSON.stringify(archived.sentenceDetails).length;
    const sentenceChars = JSON.stringify(archived.sentenceDetails.map((item) => item.sentence)).length;
    const totalChars = JSON.stringify(archived).length;

    const share = sentenceChars / totalChars;
    console.log(
      `\n[R12a] sentenceDetails.sentence 与 card.front 完全重复：\n` +
        `  它占细节记录的 ${((sentenceChars / detailsChars) * 100).toFixed(1)}%，` +
        `但**只占总体的 ${(share * 100).toFixed(1)}%**\n` +
        `  → 摘掉省 ${((sentenceChars * 2) / 1024 / 1024).toFixed(2)}MB（计费），` +
        `对「10 个月写不下」毫无帮助`
    );

    // 冗余是真的
    expect(sentenceChars / detailsChars, "冗余确实存在").toBeGreaterThan(0.1);
    // 但不够大：占总体的比例必须低于 10%（否则值得单独处理）
    expect(share, "幅度不足以成为优化重点").toBeLessThan(0.1);
  });
});
