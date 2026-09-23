// @vitest-environment node
/**
 * MG2 · Unit.dynamicKind 与 Settings 三个可选标记的存活（2026-09-22）
 *
 * `migrateData` 是白名单：不在 normalizer 返回对象里的字段一律被丢弃，
 * 而 `AppContext.commitData` 每次更新都会 `saveData`（读 → migrateData → 写回），
 * 所以这些字段不是「升级时丢一次」，而是**任何一次操作都会丢**。
 *
 * 两组字段的共性：**类型上可选，业务上当必需**。
 *   - `Unit.dynamicKind`：错词书的身份标识。丢了之后 `getMistakeBookUnit` 恒返回 undefined，
 *     `syncMistakeBookUnit` 便每次都**新建**一本《我的错词书》——重复累积。
 *   - `Settings.reviewOnlyDayKey` / `studyScopeUnitIds` / `reachedMilestoneIds`：
 *     分别是「纯复习日」「学习范围锁定」「已达里程碑」的持久化标记。
 *     丢了之后对应机制静默失效（重新排新词 / 范围解锁 / 里程碑反复弹）。
 */
import { describe, expect, it } from "vitest";
import { parseBackupJson } from "../../services/storage";
import { getMistakeBookUnit, syncMistakeBookUnit } from "../../services/dynamicBookService";

const base = (extra: Record<string, unknown>) => ({
  schemaVersion: 8,
  cards: [],
  seededWordVersions: ["core-100-v1"],
  ...extra
});

describe("MG2 Unit.dynamicKind 存活", () => {
  it("迁移后不丢（错词书靠它认身份）", () => {
    const out = parseBackupJson(
      JSON.stringify(
        base({
          units: [
            {
              id: "unit-mistakes",
              title: "我的错词书",
              description: "x",
              order: 1,
              color: "#dc2626",
              dynamicKind: "mistakes",
              createdAt: "2024-01-01T00:00:00.000Z",
              updatedAt: "2024-01-01T00:00:00.000Z"
            }
          ]
        })
      )
    );
    expect(out.units[0].dynamicKind, "dynamicKind 丢了会让错词书失去身份").toBe("mistakes");
  });

  it("反复同步不产生重复的《我的错词书》（幂等的关键前提）", () => {
    const withUnit = parseBackupJson(
      JSON.stringify(
        base({
          units: [
            {
              id: "unit-mistakes",
              title: "我的错词书",
              description: "x",
              order: 1,
              color: "#dc2626",
              dynamicKind: "mistakes",
              createdAt: "2024-01-01T00:00:00.000Z",
              updatedAt: "2024-01-01T00:00:00.000Z"
            }
          ]
        })
      )
    );
    // 连续同步 3 次（每次都经过一次真实的迁移写回）
    let data = withUnit;
    for (let round = 0; round < 3; round += 1) {
      data = parseBackupJson(JSON.stringify(syncMistakeBookUnit(data).data));
    }
    const books = data.units.filter((unit) => unit.title === "我的错词书");
    expect(books.length, "重复同步不应累积出第二本错词书").toBe(1);
    expect(getMistakeBookUnit(data), "错词书应能被认出来").toBeTruthy();
  });
});

describe("MG2 Settings 三个可选标记存活", () => {
  it("reviewOnlyDayKey / studyScopeUnitIds / reachedMilestoneIds 都要保留", () => {
    const out = parseBackupJson(
      JSON.stringify(
        base({
          settings: {
            reviewOnlyDayKey: 20240601,
            studyScopeUnitIds: ["unit-1", "unit-2"],
            reachedMilestoneIds: ["m-first-100", "m-streak-7"]
          }
        })
      )
    );
    expect(out.settings.reviewOnlyDayKey, "纯复习日标记（YYYYMMDD 数字）").toBe(20240601);
    expect(out.settings.studyScopeUnitIds, "学习范围锁定").toEqual(["unit-1", "unit-2"]);
    expect(out.settings.reachedMilestoneIds, "已达里程碑").toEqual(["m-first-100", "m-streak-7"]);
  });

  it("缺失时不写入（保持清理语义），非法值降级为安全值", () => {
    const out = parseBackupJson(JSON.stringify(base({ settings: {} })));
    expect(out.settings.reviewOnlyDayKey ?? null).toBeNull();
    expect(out.settings.studyScopeUnitIds ?? null).toBeNull();
    expect(out.settings.reachedMilestoneIds ?? null).toBeNull();

    const dirty = parseBackupJson(
      JSON.stringify(base({ settings: { reviewOnlyDayKey: "20240601", studyScopeUnitIds: "nope", reachedMilestoneIds: { a: 1 } } }))
    );
    expect(dirty.settings.reviewOnlyDayKey ?? null, "非数字应丢弃").toBeNull();
    expect(dirty.settings.studyScopeUnitIds ?? null, "非数组应丢弃").toBeNull();
    expect(dirty.settings.reachedMilestoneIds ?? null, "非数组应丢弃").toBeNull();
  });
});
