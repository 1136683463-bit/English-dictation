import { afterEach, describe, expect, it, vi } from "vitest";
import { Rating, Review } from "../types";
import { isCorrectReview, isValidRating, isWrongReview } from "./reviewRating";
import { makeReview } from "./testUtils";

// 构造非法 rating 的 review（绕过 Rating 类型，模拟内存态/同步/测试构造的异常对象）
const makeReviewWithRating = (rating: unknown, id = "review_bad"): Review =>
  makeReview({ id, rating: rating as Rating });

describe("reviewRating 值域与对错判定（R8）", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("合法 rating：1/2 为错，3/4 为对", () => {
    expect(isWrongReview(makeReview({ rating: 1 }))).toBe(true);
    expect(isWrongReview(makeReview({ rating: 2 }))).toBe(true);
    expect(isCorrectReview(makeReview({ rating: 1 }))).toBe(false);
    expect(isCorrectReview(makeReview({ rating: 2 }))).toBe(false);
    expect(isCorrectReview(makeReview({ rating: 3 }))).toBe(true);
    expect(isCorrectReview(makeReview({ rating: 4 }))).toBe(true);
    expect(isWrongReview(makeReview({ rating: 3 }))).toBe(false);
    expect(isWrongReview(makeReview({ rating: 4 }))).toBe(false);
  });

  it("非法 rating（0/5/2.5/NaN/undefined）一律计入错误侧", () => {
    for (const bad of [0, 5, 2.5, Number.NaN, undefined]) {
      expect(isValidRating(bad)).toBe(false);
      expect(isWrongReview(makeReviewWithRating(bad))).toBe(true);
    }
  });

  it("非法 rating 不计入正确侧（isCorrect=false）", () => {
    for (const bad of [0, 5, 2.5, Number.NaN, undefined]) {
      expect(isCorrectReview(makeReviewWithRating(bad))).toBe(false);
    }
  });

  it("每个 review 恰好落入一侧（isCorrect 与 isWrong 互斥且完备）", () => {
    const samples: unknown[] = [1, 2, 3, 4, 0, 5, 2.5, Number.NaN, undefined];
    for (const rating of samples) {
      const review = makeReviewWithRating(rating);
      const correct = isCorrectReview(review);
      const wrong = isWrongReview(review);
      expect(correct).not.toBe(wrong); // 互斥
      expect(correct || wrong).toBe(true); // 完备
    }
  });

  it("非法值首次触发 console.warn 且同 id 不重复", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const review = makeReviewWithRating(5, "review_warn_once");

    isWrongReview(review);
    isWrongReview(review);
    isWrongReview(review);

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][1]).toMatchObject({ id: "review_warn_once", rating: 5 });
  });

  it("合法值不触发 warn", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    for (const rating of [1, 2, 3, 4] as Rating[]) {
      const review = makeReview({ id: `review_ok_${rating}`, rating });
      isCorrectReview(review);
      isWrongReview(review);
    }

    expect(warn).not.toHaveBeenCalled();
  });
});
