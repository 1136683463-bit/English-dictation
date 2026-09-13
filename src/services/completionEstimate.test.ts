import { describe, expect, it } from "vitest";
import { MASTER_INTERVALS, estimateDaysToMaster } from "./completionEstimate";

describe("completionEstimate", () => {
  it("returns 0 for empty input", () => {
    expect(estimateDaysToMaster(0, 10, 30)).toBe(0);
  });

  it("a single card finishes after its full review tail", () => {
    // d1 投放 → 复习 d2(+1) d5(+3) d12(+7) d27(+15) → 第 27 天掌握。
    expect(estimateDaysToMaster(1, 10, 30)).toBe(27);
    expect(MASTER_INTERVALS).toEqual([1, 3, 7, 15]);
  });

  it("defers reviews beyond the daily review capacity", () => {
    // 2 张卡、每日复习上限 1：第二张的每次复习都被顺延一天 → 28 天。
    expect(estimateDaysToMaster(2, 10, 1)).toBe(28);
  });

  it("matches the analysis estimate for 115 words at 10 new / 30 reviews per day", () => {
    // 数析测算 ≈42 天；模拟口径落在 35~45 天区间。
    const days = estimateDaysToMaster(115, 10, 30);
    expect(days).toBeGreaterThanOrEqual(35);
    expect(days).toBeLessThanOrEqual(45);
  });

  it("grows with workload and shrinks with capacity", () => {
    expect(estimateDaysToMaster(300, 10, 30)).toBeGreaterThan(estimateDaysToMaster(115, 10, 30));
    expect(estimateDaysToMaster(115, 10, 100)).toBeLessThanOrEqual(estimateDaysToMaster(115, 10, 30));
    expect(estimateDaysToMaster(115, 20, 30)).toBeLessThan(estimateDaysToMaster(115, 10, 30));
  });

  it("clamps unsafe parameters", () => {
    expect(estimateDaysToMaster(1, 0, 0)).toBe(27); // 0 视作默认值 10/30
    expect(estimateDaysToMaster(10, -5, 30)).toBeGreaterThan(0);
  });
});
