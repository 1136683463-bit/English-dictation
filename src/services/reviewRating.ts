import { Rating, Review } from "../types";

// R8：rating 判定的唯一权威来源。statsService / reviewService / mistakeBookService
// 一律从这里 import，禁止再写本地副本（此前 3 处定义，口径漂移测试无法发现）。
export const isValidRating = (value: unknown): value is Rating =>
  Number.isInteger(value) && (value as number) >= 1 && (value as number) <= 4;

// R8：非法 rating 的上报去重——同一 review.id 只 warn 一次，避免聚合循环刷屏。
// warn 是唯一副作用，判定函数保持引用透明（同输入同输出）。
const warnedInvalidRatingIds = new Set<string>();

const warnInvalidRating = (review: Review) => {
  if (warnedInvalidRatingIds.has(review.id)) return;
  warnedInvalidRatingIds.add(review.id);
  console.warn("[R8] 非法 rating，已按错误侧归类：", {
    id: review.id,
    rating: review.rating,
    mode: review.mode,
    reviewedAt: review.reviewedAt
  });
};

export const isCorrectReview = (review: Review) =>
  isValidRating(review.rating) ? review.rating >= 3 : false;

export const isWrongReview = (review: Review) => {
  if (!isValidRating(review.rating)) {
    // 非法值（非整数 / 0 / 5 / NaN）一律计入错误侧：宁多报错不漏错，
    // 保证 isCorrect 与 isWrong 互斥且对所有值完备（每个 review 恰好落入一侧）。
    warnInvalidRating(review);
    return true;
  }
  return review.rating <= 2;
};
