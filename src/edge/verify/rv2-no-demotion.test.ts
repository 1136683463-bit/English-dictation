// @vitest-environment node
/**
 * RV2 · 「已掌握」只增不减（R09 Step2 验收项，2026-09-21 修）
 *
 * PRD `prd-grammar-progress-visible-2026-09-13.md:101` 的 R09 验收项明文写着
 * 「已 mastered 卡不降级」，但实现里 SM-2 分支每次复习都重算
 * `rating === 4 && reviewCount >= 4`，于是一次「想不起来了，看答案」（rating 1）
 * 就把语法句子卡打回 review——复习页顶部的「已掌握 N」当场倒退。
 * 这与同一份 PRD 的目标「作为坚持复习的用户，我希望看到『已掌握 N』在增长」直接冲突。
 *
 * 词卡的降级行为刻意保持不变（词卡的掌握判据就是 SM-2 本身，答错收回是自洽的）。
 */
import { describe, expect, it } from "vitest";
import { applyReview } from "../../services/reviewService";
import type { AppData, Card, Schedule } from "../../types";

const card = (status: Card["status"], type: Card["type"] = "sentence", tags: string[] = ["语法"]): Card =>
  ({
    id: "c1",
    type,
    front: "I went to the park yesterday.",
    back: "我昨天去了公园。",
    note: "",
    tags,
    status,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  }) as Card;

const data = (target: Card): AppData =>
  ({
    cards: [target],
    schedules: [
      {
        cardId: target.id,
        easeFactor: 2.5,
        intervalDays: 20,
        reviewCount: 6, // 早已越过掌握线
        lapseCount: 0,
        nextReviewAt: "2024-01-01T00:00:00.000Z"
      } as Schedule
    ],
    reviews: [],
    sentenceDetails: []
  }) as unknown as AppData;

const reviewWith = (target: Card, rating: 1 | 2 | 3 | 4) => {
  const seeded = data(target);
  return applyReview(seeded, seeded.cards[0], "recall", rating, "");
};

describe("RV2 已掌握的语法句子卡不被单次失误降级", () => {
  it("看答案（rating 1）后仍是已掌握", () => {
    const next = reviewWith(card("mastered"), 1);
    expect(next.cards[0].status).toBe("mastered");
    expect(next.cards[0].masteredAt, "masteredAt 不能因降级被清空").toBeTruthy();
  });

  it("完全忘了（rating 2）后仍是已掌握", () => {
    expect(reviewWith(card("mastered"), 2).cards[0].status).toBe("mastered");
  });

  it("卡了一下（rating 3）后仍是已掌握", () => {
    expect(reviewWith(card("mastered"), 3).cards[0].status).toBe("mastered");
  });

  it("未掌握的卡不会因此被误升为已掌握", () => {
    const next = reviewWith(card("review"), 1);
    expect(next.cards[0].status).toBe("review");
  });

  it("词卡仍按 SM-2 降级（避免误伤既有 R13 行为）", () => {
    const wordCard = card("mastered", "word", ["核心"]);
    expect(reviewWith(wordCard, 1).cards[0].status).toBe("review");
  });

  it("非语法句子卡仍按 SM-2 降级（只有语法句卡走复合判据）", () => {
    const plainSentence = card("mastered", "sentence", ["日常"]);
    expect(reviewWith(plainSentence, 1).cards[0].status).toBe("review");
  });

  it("降级路径未被整体封死：未掌握卡答错仍是 review/learning", () => {
    const next = reviewWith(card("learning"), 2);
    expect(next.cards[0].status).toBe("review");
  });
});
