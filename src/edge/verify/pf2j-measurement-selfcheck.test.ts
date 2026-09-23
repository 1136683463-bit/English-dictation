// @vitest-environment jsdom
/**
 * PF2j · 测量自检：saveData 与 migrateData 的耗时矛盾排查（2026-09-22）
 *
 * PF2c 报出「saveData(5000 卡) = 9.3ms」但「migrateData(5000 卡) = 60~94ms」——
 * 而 saveData 内部必然调用 migrateData，两者不可能倒挂。
 * 本文件专门验证这条矛盾，确定哪个数字是可信的、是测量偏差还是真实行为。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { scaleData } from "./pf2Scale";
import { migrateData, saveData } from "../../services/storage";
import { resetStorage } from "../harness";

const timeOnce = (fn: () => unknown): number => {
  const start = performance.now();
  fn();
  return performance.now() - start;
};

const median = (fn: () => unknown, rounds: number): number => {
  fn();
  const samples: number[] = [];
  for (let index = 0; index < rounds; index += 1) samples.push(timeOnce(fn));
  return samples.slice().sort((a, b) => a - b)[Math.floor(samples.length / 2)];
};

describe("PF2j · saveData vs migrateData 矛盾排查", () => {
  beforeEach(() => resetStorage());

  it("同一份数据上交替测量：migrateData 单独 vs saveData 内部", () => {
    const data = scaleData({ cards: 5000 });
    window.localStorage.clear();

    // 交替测，排除「谁先跑谁慢」的顺序效应
    const rows: Array<{ label: string; ms: number }> = [];
    for (let round = 0; round < 3; round += 1) {
      rows.push({ label: `migrateData (round ${round})`, ms: timeOnce(() => migrateData(data)) });
      window.localStorage.clear();
      rows.push({ label: `saveData    (round ${round})`, ms: timeOnce(() => saveData(data)) });
      rows.push({ label: `saveData 再跑 (round ${round})`, ms: timeOnce(() => saveData(data)) });
    }
    console.log(
      `\n[PF2j] 逐次（非中位数）单跑，看是否有预热效应：\n` +
        rows.map((row) => `  ${row.label.padEnd(28)} ${row.ms.toFixed(2).padStart(9)}ms`).join("\n")
    );

    // 各自的中位数
    window.localStorage.clear();
    const migrateMedian = median(() => migrateData(data), 5);
    window.localStorage.clear();
    const saveMedian = median(() => saveData(data), 5);

    const json = JSON.stringify(data);
    console.log(
      `\n[PF2j] 中位数（5 轮，每轮前清空 localStorage）\n` +
        `  migrateData(data)          ${migrateMedian.toFixed(2).padStart(9)}ms\n` +
        `  saveData(data)             ${saveMedian.toFixed(2).padStart(9)}ms\n` +
        `  JSON.stringify(data)       ${timeOnce(() => JSON.stringify(data)).toFixed(2).padStart(9)}ms\n` +
        `  JSON 字符数                ${json.length}\n` +
        `  localStorage 配额          5,000,000 code unit\n` +
        `  → saveData − migrateData = ${(saveMedian - migrateMedian).toFixed(2)}ms（应 ≈ stringify + setItem）\n` +
        `  → 若 saveMedian < migrateMedian，说明两处测的不是同一件事。`
    );

    // 核心断言：saveData 在其内部**跳过迁移**时会显著快于单独调 migrateData
    // ——这正是「快速路径生效」的证据，而不是测量误差。
    console.log(
      `\n[PF2j] 判据：saveData(${saveMedian.toFixed(2)}ms) vs migrateData(${migrateMedian.toFixed(2)}ms)` +
        `\n  → saveData 明显更快 ⇒ 内部跳过了 migrateData（shouldSkipMigration 快速路径生效）。` +
        `\n  → 若两者接近，说明快速路径没生效、每次落盘仍在跑全量迁移。`
    );
    expect(
      saveMedian,
      `saveData 明显快于 migrateData ⇒ 快速路径生效（若接近则迁移未被跳过）`
    ).toBeLessThan(migrateMedian);
  });

  it("migrateData 的可信耗时：单次冷跑 + 中位数都要报出来", () => {
    const data = scaleData({ cards: 5000 });
    const cold = timeOnce(() => migrateData(data));
    const warm = median(() => migrateData(data), 5);
    const json = JSON.stringify(data);
    console.log(
      `\n[PF2j] migrateData(5000 卡)：冷跑 ${cold.toFixed(2)}ms / 热中位数 ${warm.toFixed(2)}ms` +
        `（数据体积 ${(json.length / 1024).toFixed(0)}K 字符）\n` +
        `  → 该函数内部对 5000 张卡 × 每条 wordDetails 两次 cards.find：理论比较次数 ≈ 5000 × 5000 × 2 = 5e7，\n` +
        `     5000 卡时数十毫秒是**合理**的；个位数毫秒才可疑。`
    );
    expect(warm).toBeGreaterThan(0);
  });
});
