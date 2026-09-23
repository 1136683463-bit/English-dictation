// @vitest-environment node
/**
 * SV1 · 复习历史归档（2026-09-22）
 *
 * 背景：按「每天 20 分钟」模拟，约 14~18 个月撞 5MB 上限，
 * 而 `reviews` 占体积 37% 且无上限增长；届时用户唯一的清理入口是
 * 「清空全部学习数据」。这个归档提供「保留进度、只压缩久远明细」的路径。
 *
 * 核心不变量（本文件逐条固定）：
 *  ① 保留窗口内的明细一条不动
 *  ② 连胜（streak）在归档前后**完全一致**——这是最容易被压缩破坏的用户可见数字
 *  ③ 「有活动的日子」集合不变（学习日历/里程碑依赖它）
 *  ④ 幂等：重复归档不再产生新的汇总、不重复计数
 *  ⑤ 汇总记录结构合法（引用的 cardId 仍存在、时间戳可解析）
 */
import { describe, expect, it } from "vitest";
import {
  compactReviewHistory,
  isReviewSummary,
  REVIEW_DETAIL_RETENTION_DAYS,
  REVIEW_SUMMARY_ID_PREFIX
} from "../../services/reviewArchiveService";
import { computeStreakWithGrace } from "../../services/statsService";
import { makeAppData } from "./fixtures";
import type { AppData, Card, Review } from "../../types";

const card = (id: string): Card =>
  ({
    id,
    type: "word",
    front: `w${id}`,
    back: "x",
    note: "",
    tags: [],
    status: "review",
    priority: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  }) as Card;

/** 造 days 天、每天 perDay 条复习记录（最近一天是今天）。 */
const history = (days: number, perDay: number, idPrefix = "c"): AppData => {
  const cards = [card(`${idPrefix}1`), card(`${idPrefix}2`)];
  const reviews: Review[] = [];
  const base = new Date();
  base.setHours(9, 0, 0, 0);
  for (let d = 0; d < days; d += 1) {
    for (let i = 0; i < perDay; i += 1) {
      reviews.push({
        id: `r-${d}-${i}`,
        cardId: cards[i % 2].id,
        mode: "spelling",
        rating: (i % 5 === 0 ? 2 : 4) as 2 | 4,
        answer: `answer-${d}-${i}`,
        reviewedAt: new Date(base.getTime() - d * 86400000 + i * 60000).toISOString()
      });
    }
  }
  reviews.sort((a, b) => a.reviewedAt.localeCompare(b.reviewedAt));
  return makeAppData({ cards, reviews, schedules: [] });
};

describe("SV1 复习历史归档", () => {
  it("窗口内的明细一条不动", () => {
    const data = history(REVIEW_DETAIL_RETENTION_DAYS + 60, 5);
    const result = compactReviewHistory(data);
    const cutoff = Date.now() - REVIEW_DETAIL_RETENTION_DAYS * 86400000;
    const keptDetailed = result.data.reviews.filter(
      (review) => !isReviewSummary(review) && new Date(review.reviewedAt).getTime() >= cutoff
    );
    const originalDetailed = data.reviews.filter(
      (review) => new Date(review.reviewedAt).getTime() >= cutoff
    );
    expect(keptDetailed.length, "窗口内明细应原样保留").toBe(originalDetailed.length);
    expect(
      keptDetailed.map((review) => review.id).sort(),
      "且是同一批记录"
    ).toEqual(originalDetailed.map((review) => review.id).sort());
  });

  it("★ 连胜在归档前后完全一致（最容易被压坏的可见数字）", () => {
    const data = history(300, 8);
    const before = computeStreakWithGrace(data.reviews).streak;
    const result = compactReviewHistory(data);
    const after = computeStreakWithGrace(result.data.reviews).streak;
    expect(before, "前置：应有连续记录").toBeGreaterThan(200);
    expect(after, "归档后连胜必须完全相同").toBe(before);
  });

  it("★ 「有活动的日子」集合不变（学习日历/里程碑依赖）", () => {
    const data = history(300, 8);
    const daySet = (reviews: Review[]) =>
      new Set(reviews.map((review) => review.reviewedAt.slice(0, 10))).size;
    const before = daySet(data.reviews);
    const after = daySet(compactReviewHistory(data).data.reviews);
    expect(after, "活动日数量不应减少").toBe(before);
  });

  it("确实压缩了体积，且条数显著下降", () => {
    const data = history(300, 30);
    const result = compactReviewHistory(data);
    expect(result.beforeCount, "前置：应有大量记录").toBe(9000);
    expect(result.compactedCount, "应有被压缩的明细").toBeGreaterThan(0);
    /**
     * 算术：300 天 × 30 条 = 9000 条；
     * 最近 180 天（5400 条）原样保留，之前 120 天各留 1 条汇总（120 条）
     * → 约 5520 条。压缩的是「窗口外那 120 天的 3600 条明细」。
     */
    expect(result.data.reviews.length, "归档后应只剩窗口内明细 + 每天一条汇总").toBeLessThan(5700);
    expect(result.data.reviews.length, "但窗口内明细一条不少").toBeGreaterThan(5400);
    expect(result.freedBytes, "应释放可观体积").toBeGreaterThan(100_000);
  });

  it("幂等：重复归档不再产生新汇总、不重复计数", () => {
    const data = history(300, 10);
    const once = compactReviewHistory(data);
    const twice = compactReviewHistory(once.data);
    expect(twice.compactedCount, "第二次应无可压缩的明细").toBe(0);
    expect(twice.summaryCount, "不应新增汇总").toBe(0);
    expect(twice.data.reviews.length, "条数应保持").toBe(once.data.reviews.length);
    // 第三次同样
    expect(compactReviewHistory(twice.data).data.reviews.length).toBe(once.data.reviews.length);
  });

  it("汇总记录结构合法：引用的卡片仍在、时间戳可解析、id 带前缀", () => {
    const data = history(300, 6);
    const result = compactReviewHistory(data);
    const summaries = result.data.reviews.filter(isReviewSummary);
    expect(summaries.length, "应有汇总记录").toBeGreaterThan(0);
    const cardIds = new Set(result.data.cards.map((item) => item.id));
    for (const summary of summaries) {
      expect(summary.id.startsWith(REVIEW_SUMMARY_ID_PREFIX), "id 应带前缀以便识别").toBe(true);
      expect(cardIds.has(summary.cardId), "引用的卡片必须仍存在").toBe(true);
      expect(Number.isNaN(new Date(summary.reviewedAt).getTime()), "时间戳应可解析").toBe(false);
    }
  });

  it("一天只有一条明细时不压（压了反而没省，还会丢掉那条明细）", () => {
    const data = history(300, 1); // 每天恰好 1 条
    const result = compactReviewHistory(data);
    expect(result.compactedCount, "每天仅 1 条时不应压缩").toBe(0);
    expect(result.data.reviews.length).toBe(data.reviews.length);
  });

  it("短期数据完全不动（新用户无感）", () => {
    const data = history(30, 10);
    const result = compactReviewHistory(data);
    expect(result.compactedCount).toBe(0);
    expect(result.data.reviews.length).toBe(data.reviews.length);
  });

  it("空数据与非法时间戳都不崩", () => {
    expect(compactReviewHistory(makeAppData({ reviews: [] })).compactedCount).toBe(0);
    const broken = makeAppData({
      cards: [card("c1")],
      reviews: [
        { id: "bad1", cardId: "c1", mode: "spelling", rating: 3, answer: "", reviewedAt: "不是日期" },
        { id: "bad2", cardId: "c1", mode: "spelling", rating: 3, answer: "", reviewedAt: "也不是" }
      ]
    });
    expect(() => compactReviewHistory(broken), "非法时间戳不应抛错").not.toThrow();
  });
});
