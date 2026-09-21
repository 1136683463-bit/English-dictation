// @vitest-environment node
/**
 * RV7 · 复习间隔必须有上限（2026-09-21 修，P0）
 *
 * `rating === 4` 分支是 `intervalDays = round(intervalDays × easeFactor × 1.3)`，
 * easeFactor 第 6 次触顶 3.2 后乘数固定 4.16。连续「一次答对」十几次以后：
 *   第 13 次 → intervalDays ≈ 5.75e7 天（到期年份 159462）
 *   第 14 次 → 超出 Date 的 ±8.64e15 ms 上限，`addDays` 抛 RangeError
 * 项目没有 ErrorBoundary，该次评分不生效且之后每次点击都抛同一错——用户卡死在复习页。
 */
import { describe, expect, it } from "vitest";
import { applyReview, createInitialSchedule } from "../../services/reviewService";
import { compareText } from "../../services/diffService";
import type { AppData, Card } from "../../types";

const card = (): Card =>
  ({
    id: "c1",
    type: "word",
    front: "approach",
    back: "方法",
    note: "",
    tags: [],
    status: "review",
    priority: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  } satisfies Card);

const seed = (): AppData =>
  ({
    cards: [card()],
    schedules: [{ ...createInitialSchedule("c1"), intervalDays: 1, reviewCount: 1 }],
    reviews: [],
    sentenceDetails: [],
    wordDetails: []
  }) as unknown as AppData;

describe("RV7 间隔上限", () => {
  it("连续 30 次「一次答对」不抛错，间隔停在合理上限内", () => {
    let data = seed();
    const trail: number[] = [];
    for (let round = 0; round < 30; round += 1) {
      expect(
        () => {
          data = applyReview(data, data.cards[0], "spelling", 4, "approach");
        },
        `第 ${round + 1} 次评分不应抛错`
      ).not.toThrow();
      const days = data.schedules[0].intervalDays;
      trail.push(days);
      expect(Number.isFinite(days), `第 ${round + 1} 次的 intervalDays 必须是有限数`).toBe(true);
      expect(days, `第 ${round + 1} 次不应超过 10 年`).toBeLessThanOrEqual(3650);
    }
    expect(trail[trail.length - 1], "最终应停在上限").toBe(3650);
  });

  it("到期时间始终是可解析的有效日期", () => {
    let data = seed();
    for (let round = 0; round < 30; round += 1) {
      data = applyReview(data, data.cards[0], "spelling", 4, "approach");
      const at = data.schedules[0].nextReviewAt;
      expect(Number.isNaN(new Date(at).getTime()), `第 ${round + 1} 次的到期时间应可解析：${at}`).toBe(false);
    }
  });

  it("上限不破坏既有档位关系：rating 4 的间隔仍 ≥ rating 3 的结果", () => {
    const base = seed();
    const four = applyReview(base, base.cards[0], "spelling", 4, "approach");
    const three = applyReview(base, base.cards[0], "spelling", 3, "approach");
    expect(four.schedules[0].intervalDays).toBeGreaterThanOrEqual(three.schedules[0].intervalDays);
  });

  it("存量异常数据（超大 intervalDays）经一次复习后被拉回上限内", () => {
    const broken = seed();
    broken.schedules[0] = { ...broken.schedules[0], intervalDays: 1e9 };
    const fixed = applyReview(broken, broken.cards[0], "spelling", 4, "approach");
    expect(fixed.schedules[0].intervalDays).toBeLessThanOrEqual(3650);
    expect(Number.isNaN(new Date(fixed.schedules[0].nextReviewAt).getTime())).toBe(false);
  });

  it("diffService 仍可正常工作（回归保护，不涉及本次改动）", () => {
    expect(compareText("approach", "approach", false).length).toBeGreaterThan(0);
  });
});
