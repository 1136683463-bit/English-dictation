// @vitest-environment jsdom
/**
 * PF4 · 保存成本不随数据规模失控（2026-09-22 修，P1 性能）
 *
 * `saveData` 曾无条件 `migrateData(data)` 再写盘，而传给它的数据**已经归一化过**
 * （`loadData` 的产物，之后 AppContext 的所有不可变更新都基于它）。
 * 实测 5000 卡 + 5000 复习记录时：迁移 83ms、序列化仅 8.6ms —— 迁移占了 90%，
 * 而 `commitData` 每次操作都调它：用户每答一题就付一次。
 *
 * 修法：按「数据是否已归一化」跳过重复迁移；schemaVersion 或关键数组不对时
 * 退回完整迁移（保证外部塞进来的裸数据仍被归一化）。
 *
 * ⚠️ 断言用相对判据（跳过迁移 vs 完整迁移的成本比），不用绝对毫秒。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { resetStorage } from "../harness";
import { APP_SCHEMA_VERSION, migrateData, saveData } from "../../services/storage";
import { cardsToData, makeAppData, makeSentenceCard } from "./fixtures";

const bigData = (n: number) =>
  makeAppData({
    ...cardsToData(
      Array.from({ length: n }, (_, i) =>
        makeSentenceCard({
          id: `c${i}`,
          sentence: `Sentence number ${i} is here.`,
          schedule: { reviewCount: 2, intervalDays: 3, nextReviewAt: "2024-01-01T00:00:00.000Z" }
        })
      )
    ),
    reviews: Array.from({ length: n }, (_, i) => ({
      id: `r${i}`,
      cardId: `c${i % n}`,
      mode: "cloze" as const,
      rating: 3 as const,
      answer: "x",
      diffJson: "[]",
      reviewedAt: "2024-01-01T00:00:00.000Z"
    }))
  });

describe("PF4 保存成本", () => {
  beforeEach(() => resetStorage());

  it("已归一化的数据：保存不再重复迁移（成本应远低于完整迁移）", () => {
    const normalized = migrateData(JSON.stringify(bigData(3000)));
    saveData(normalized); // 预热

    const t0 = performance.now();
    saveData(normalized);
    const saveCost = performance.now() - t0;

    const t1 = performance.now();
    migrateData(JSON.stringify(normalized));
    const migrateCost = performance.now() - t1;

    expect(
      saveCost,
      `已归一化数据的保存（${saveCost.toFixed(1)}ms）应远低于完整迁移（${migrateCost.toFixed(1)}ms）——` +
        `若接近说明又退回了「每次保存都全量归一化」`
    ).toBeLessThan(migrateCost / 2);
  });

  it("未归一化的数据仍会被迁移（安全网不被绕过）", () => {
    // schemaVersion 不对 → 必须走完整迁移
    const raw = { ...bigData(50), schemaVersion: APP_SCHEMA_VERSION - 1 } as never;
    saveData(raw);
    const onDisk = JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}");
    expect(onDisk.schemaVersion, "旧版本号应被升到当前版本").toBe(APP_SCHEMA_VERSION);
  });

  it("缺关键数组的数据仍会被迁移", () => {
    const broken = { ...bigData(20), schedules: undefined } as never;
    saveData(broken);
    const onDisk = JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}");
    expect(Array.isArray(onDisk.schedules), "归一化器应补回缺失的数组").toBe(true);
  });

  it("规模不改变「跳过迁移」这一性质（1000 与 4000 卡的比值稳定）", () => {
    const measureRatio = (n: number) => {
      const normalized = migrateData(JSON.stringify(bigData(n)));
      saveData(normalized);
      const t0 = performance.now();
      saveData(normalized);
      const saveCost = performance.now() - t0;
      const t1 = performance.now();
      migrateData(JSON.stringify(normalized));
      const migrateCost = performance.now() - t1;
      return saveCost / migrateCost;
    };
    expect(measureRatio(1000), "小规模也应跳过迁移").toBeLessThan(0.6);
    expect(measureRatio(4000), "大规模同样跳过迁移").toBeLessThan(0.6);
  });
});
