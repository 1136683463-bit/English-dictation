// @vitest-environment node
/**
 * MG1 · 卡片字段在迁移管线中的存活（2026-09-22）
 *
 * `migrateData` 走的是**白名单**：字段不在 normalizeXxx 的返回对象里就会被丢弃。
 * `Card` 类型声明了三个可选字段，但 `normalizeCard` 的返回对象没列它们：
 *   - `prioritySource`（"manual" | "system"）：区分「用户手动标星」与「算法自动置位」，
 *     决定能否被康复逻辑自动摘星（上一轮审计确认过它的语义）。
 *   - `suspendedFrom`：暂停前的状态，恢复时要还原。
 *   - `mistakeGraduatedAt`：错题毕业时间。
 *
 * 而 `AppContext.commitData` 每次更新都会 `saveData`，也就是**每次操作都可能触发一次
 * 完整的迁移**（读 → migrateData → 写回）。所以这些字段不是「迁移时丢一次」，
 * 而是「任何一次操作都会丢」。
 */
import { describe, expect, it } from "vitest";
import { migrateData, parseBackupJson } from "../../services/storage";

const cardWith = (extra: Record<string, unknown>) => ({
  cards: [
    {
      id: "c1",
      type: "word",
      front: "approach",
      back: "方法",
      note: "",
      tags: [],
      status: "review",
      priority: true,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      ...extra
    }
  ],
  schemaVersion: 8
});

describe("MG1 卡片字段存活", () => {
  it("prioritySource 必须存活（它决定能否被自动摘星）", () => {
    const out = migrateData(cardWith({ prioritySource: "manual" }));
    expect(
      out.cards[0].prioritySource,
      "手动标星的来源标记不能被迁移丢掉——丢了就会被当成 legacy 系统卡而自动摘星"
    ).toBe("manual");
  });

  it("suspendedFrom 必须存活（恢复暂停卡时要还原状态）", () => {
    const out = migrateData(cardWith({ status: "suspended", suspendedFrom: "mastered" }));
    expect(out.cards[0].suspendedFrom, "暂停前的状态不能被丢掉").toBe("mastered");
  });

  it("mistakeGraduatedAt 必须存活（错题毕业时间）", () => {
    const out = migrateData(cardWith({ mistakeGraduatedAt: "2024-06-01T00:00:00.000Z" }));
    expect(out.cards[0].mistakeGraduatedAt, "错题毕业时间不能被丢掉").toBe("2024-06-01T00:00:00.000Z");
  });

  it("完整往返（parseBackupJson）：三个字段都不丢", () => {
    const json = JSON.stringify(
      cardWith({
        prioritySource: "manual",
        status: "suspended",
        suspendedFrom: "review",
        mistakeGraduatedAt: "2024-06-01T00:00:00.000Z"
      })
    );
    const out = parseBackupJson(json);
    expect({
      prioritySource: out.cards[0].prioritySource,
      suspendedFrom: out.cards[0].suspendedFrom,
      mistakeGraduatedAt: out.cards[0].mistakeGraduatedAt
    }).toEqual({
      prioritySource: "manual",
      suspendedFrom: "review",
      mistakeGraduatedAt: "2024-06-01T00:00:00.000Z"
    });
  });

  it("取值非法时不写入（保持类型契约）", () => {
    const out = migrateData(cardWith({ prioritySource: "bogus", suspendedFrom: 42, mistakeGraduatedAt: 123 }));
    expect(out.cards[0].prioritySource ?? null, "非法 prioritySource 应为 undefined").toBeNull();
    expect(out.cards[0].suspendedFrom ?? null, "非法 suspendedFrom 应为 undefined").toBeNull();
    expect(out.cards[0].mistakeGraduatedAt ?? null, "非法 mistakeGraduatedAt 应为 undefined").toBeNull();
  });
});
