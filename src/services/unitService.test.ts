import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  assignCardIdsToUnit,
  createUnit,
  createUnitGroup,
  deleteUnitGroup,
  deleteUnit,
  getCardsForUnit,
  getUnassignedWordCards,
  getUnitStats,
  getVocabularyGoalStats,
  moveUnitToGroup,
  removeUnitFromGroup,
  restoreUnitFromSnapshot,
  snapshotUnitForDelete,
  removeCardFromUnit,
  updateUnitGroup,
  updateUnit
} from "./unitService";
import { createTestData, makeCard, makeReview, makeSchedule, makeUnit, makeUnitGroup, TEST_NOW } from "./testUtils";

describe("unitService", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(TEST_NOW));
  });

  it("returns only word cards for a unit and sorts them alphabetically", () => {
    const data = createTestData({
      cards: [
        makeCard({ id: "card_beta", front: "beta", unitId: "unit_one" }),
        makeCard({ id: "card_sentence", type: "sentence", front: "A sentence.", unitId: "unit_one" }),
        makeCard({ id: "card_alpha", front: "alpha", unitId: "unit_one" }),
        makeCard({ id: "card_other", front: "other", unitId: "unit_two" }),
        makeCard({ id: "card_free", front: "free", unitId: undefined })
      ]
    });

    expect(getCardsForUnit(data, "unit_one").map((card) => card.front)).toEqual(["alpha", "beta"]);
    expect(getUnassignedWordCards(data).map((card) => card.front)).toEqual(["free"]);
  });

  it("calculates unit stats from word cards, schedules, and spelling reviews", () => {
    const unit = makeUnit({ id: "unit_one" });
    const data = createTestData({
      units: [unit],
      cards: [
        makeCard({ id: "card_alpha", front: "alpha", unitId: unit.id, status: "review" }),
        makeCard({ id: "card_beta", front: "beta", unitId: unit.id, status: "mastered" }),
        makeCard({ id: "card_gamma", front: "gamma", unitId: unit.id, status: "new" }),
        makeCard({ id: "card_sentence", type: "sentence", unitId: unit.id, status: "review" })
      ],
      schedules: [
        makeSchedule({ cardId: "card_alpha", nextReviewAt: "2024-01-15T08:00:00.000Z" }),
        makeSchedule({ cardId: "card_beta", nextReviewAt: "2024-01-16T09:00:00.000Z" }),
        makeSchedule({ cardId: "card_gamma", nextReviewAt: "2024-01-15T07:00:00.000Z" })
      ],
      reviews: [
        makeReview({ id: "review_alpha_right", cardId: "card_alpha", mode: "spelling", rating: 4 }),
        makeReview({ id: "review_alpha_wrong", cardId: "card_alpha", mode: "spelling", rating: 2 }),
        makeReview({ id: "review_beta_ignore", cardId: "card_beta", mode: "recognize", rating: 4 })
      ],
      settings: {
        dailyNewWords: 2
      }
    });

    expect(getUnitStats(data, unit)).toEqual({
      total: 3,
      newWords: 1,
      learning: 1,
      mastered: 1,
      due: 2,
      reviewed: 2,
      accuracy: 50,
      completionPercent: 33,
      // 新口径（含复习尾巴）：剩余 2 词、日新 2 → d1 投放，复习 2/5/12/27 天完成。
      estimatedDays: 27
    });
  });

  it("summarizes the overall vocabulary goal without suspended cards", () => {
    const data = createTestData({
      cards: [
        makeCard({ id: "card_new", status: "new" }),
        makeCard({ id: "card_review", status: "review" }),
        makeCard({ id: "card_mastered", status: "mastered" }),
        makeCard({ id: "card_suspended", status: "suspended" }),
        makeCard({ id: "card_sentence", type: "sentence", status: "new" })
      ],
      schedules: [
        makeSchedule({ cardId: "card_new", nextReviewAt: "2024-01-15T08:00:00.000Z" }),
        makeSchedule({ cardId: "card_review", nextReviewAt: "2024-01-16T09:00:00.000Z" }),
        makeSchedule({ cardId: "card_mastered", nextReviewAt: "2024-01-15T07:00:00.000Z" }),
        makeSchedule({ cardId: "card_suspended", nextReviewAt: "2024-01-15T06:00:00.000Z" })
      ],
      settings: {
        dailyNewWords: 2
      }
    });

    expect(getVocabularyGoalStats(data)).toEqual({
      total: 3,
      newWords: 1,
      learning: 1,
      mastered: 1,
      dueToday: 2,
      completionPercent: 33,
      // 新口径（含复习尾巴）：剩余 2 词、日新 2 → d1 投放，复习 2/5/12/27 天完成。
      estimatedDays: 27
    });
  });

  it("creates, updates, deletes, assigns, and removes units immutably", () => {
    const initial = createTestData({
      units: [makeUnit({ id: "unit_old", order: 2 })],
      cards: [
        makeCard({ id: "card_a", unitId: "unit_old" }),
        makeCard({ id: "card_b", front: "beta", unitId: undefined })
      ]
    });

    const withUnit = createUnit(initial, "  New Unit  ", "  Words to learn  ", "#059669", "group_one");
    const newUnit = withUnit.units.find((unit) => unit.title === "New Unit");

    expect(newUnit).toMatchObject({
      description: "Words to learn",
      order: 3,
      color: "#059669",
      groupId: "group_one",
      createdAt: TEST_NOW,
      updatedAt: TEST_NOW
    });

    const updated = updateUnit(withUnit, newUnit?.id ?? "", {
      title: "  Renamed  ",
      description: "  Updated description  ",
      color: "#f97316",
      groupId: ""
    });
    expect(updated.units.find((unit) => unit.id === newUnit?.id)).toMatchObject({
      title: "Renamed",
      description: "Updated description",
      color: "#f97316",
      groupId: undefined,
      updatedAt: TEST_NOW
    });

    const assigned = assignCardIdsToUnit(updated, ["card_b"], newUnit?.id ?? "");
    expect(assigned.cards.find((card) => card.id === "card_b")).toMatchObject({
      unitId: newUnit?.id,
      updatedAt: TEST_NOW
    });

    const removed = removeCardFromUnit(assigned, "card_b");
    expect(removed.cards.find((card) => card.id === "card_b")?.unitId).toBeUndefined();

    const deleted = deleteUnit(removed, "unit_old");
    expect(deleted.units.some((unit) => unit.id === "unit_old")).toBe(false);
    expect(deleted.cards.find((card) => card.id === "card_a")).toMatchObject({
      unitId: undefined,
      updatedAt: TEST_NOW
    });
  });

  it("creates, updates, recolors, and deletes unit groups", () => {
    const initial = createTestData({
      unitGroups: [makeUnitGroup({ id: "group_old", title: "Old Group", color: "#465366" })],
      units: [
        makeUnit({ id: "unit_a", title: "A", color: "#465366", groupId: "group_old" }),
        makeUnit({ id: "unit_b", title: "B", color: "#465366", groupId: "group_old" }),
        makeUnit({ id: "unit_free", title: "Free", color: "#177e78", groupId: undefined })
      ]
    });

    const withGroup = createUnitGroup(initial, "  New Shelf  ", "#f06423");
    const createdGroup = withGroup.unitGroups.find((group) => group.title === "New Shelf");

    expect(createdGroup).toMatchObject({
      title: "New Shelf",
      color: "#f06423",
      order: 2,
      createdAt: TEST_NOW,
      updatedAt: TEST_NOW
    });

    const recolored = updateUnitGroup(
      withGroup,
      "group_old",
      {
        title: "  Core Shelf  ",
        color: "#177e78"
      },
      { applyColorToUnits: true }
    );

    expect(recolored.unitGroups.find((group) => group.id === "group_old")).toMatchObject({
      title: "Core Shelf",
      color: "#177e78",
      updatedAt: TEST_NOW
    });
    expect(recolored.units.filter((unit) => unit.groupId === "group_old").map((unit) => unit.color)).toEqual([
      "#177e78",
      "#177e78"
    ]);
    expect(recolored.units.find((unit) => unit.id === "unit_free")?.color).toBe("#177e78");

    const deleted = deleteUnitGroup(recolored, "group_old");
    expect(deleted.unitGroups.some((group) => group.id === "group_old")).toBe(false);
    expect(deleted.units.find((unit) => unit.id === "unit_a")).toMatchObject({
      groupId: undefined,
      updatedAt: TEST_NOW
    });
    expect(deleted.units.find((unit) => unit.id === "unit_b")?.groupId).toBeUndefined();
  });

  it("moves an ungrouped unit into a group and applies the group color", () => {
    const initial = createTestData({
      unitGroups: [makeUnitGroup({ id: "group_target", title: "Target Group", color: "#f06423" })],
      units: [makeUnit({ id: "unit_free", title: "Free Unit", color: "#7a8493", groupId: undefined })]
    });

    const moved = moveUnitToGroup(initial, "unit_free", "group_target");
    expect(moved.units.find((unit) => unit.id === "unit_free")).toMatchObject({
      groupId: "group_target",
      color: "#f06423",
      updatedAt: TEST_NOW
    });

    expect(moveUnitToGroup(initial, "unit_free", "missing_group")).toBe(initial);
  });

  it("removes a grouped unit back to ungrouped, keeping its current color", () => {
    const initial = createTestData({
      unitGroups: [makeUnitGroup({ id: "group_a", title: "Group A" })],
      units: [
        makeUnit({ id: "unit_grouped", title: "Grouped", groupId: "group_a", color: "#f06423" }),
        makeUnit({ id: "unit_free", title: "Free", groupId: undefined })
      ]
    });

    const removed = removeUnitFromGroup(initial, "unit_grouped");
    const target = removed.units.find((unit) => unit.id === "unit_grouped");
    expect(target?.groupId).toBeUndefined();
    expect(target?.color).toBe("#f06423");
    expect(target?.updatedAt).toBe(TEST_NOW);

    // 已是未分组 / 不存在的词书：原样返回
    expect(removeUnitFromGroup(initial, "unit_free")).toBe(initial);
    expect(removeUnitFromGroup(initial, "missing_unit")).toBe(initial);
  });

  it("P2-5 删除撤销：快照 → 删除 → 还原后词书与卡片归属完整恢复", () => {
    const initial = createTestData({
      units: [
        makeUnit({ id: "unit_a", title: "A 书", order: 2 }),
        makeUnit({ id: "unit_b", title: "B 书", order: 1 })
      ],
      cards: [
        makeCard({ id: "c1", unitId: "unit_a", front: "a1" }),
        makeCard({ id: "c2", unitId: "unit_a", front: "a2" }),
        makeCard({ id: "c3", unitId: "unit_b", front: "b1" })
      ]
    });

    const snapshot = snapshotUnitForDelete(initial, "unit_a");
    expect(snapshot?.unit.title).toBe("A 书");
    expect(snapshot?.cardIds.sort()).toEqual(["c1", "c2"]);
    expect(snapshotUnitForDelete(initial, "missing")).toBeNull();

    const deleted = deleteUnit(initial, "unit_a");
    expect(deleted.units.some((unit) => unit.id === "unit_a")).toBe(false);
    expect(deleted.cards.find((card) => card.id === "c1")?.unitId).toBeUndefined();

    const restored = restoreUnitFromSnapshot(deleted, snapshot!);
    expect(restored.units.some((unit) => unit.id === "unit_a")).toBe(true);
    // 按 order 归位（unit_b order 1 在前）
    expect(restored.units.map((unit) => unit.id)).toEqual(["unit_b", "unit_a"]);
    expect(restored.cards.find((card) => card.id === "c1")?.unitId).toBe("unit_a");
    expect(restored.cards.find((card) => card.id === "c2")?.unitId).toBe("unit_a");
    // 别的词书的卡不受影响
    expect(restored.cards.find((card) => card.id === "c3")?.unitId).toBe("unit_b");
  });

  it("P2-5 还原保护：词书 id 已存在不重复添加；窗口内被挪走的卡不拽回", () => {
    const initial = createTestData({
      units: [makeUnit({ id: "unit_a", title: "A 书" }), makeUnit({ id: "unit_b", title: "B 书" })],
      cards: [makeCard({ id: "c1", unitId: "unit_a", front: "a1" })]
    });
    const snapshot = snapshotUnitForDelete(initial, "unit_a")!;
    const deleted = deleteUnit(initial, "unit_a");

    // 窗口内用户把 c1 挪进了 B 书，并同名重建了 A 书
    const rebuilt = {
      ...deleted,
      units: [...deleted.units, makeUnit({ id: "unit_a", title: "A 书（重建）" })],
      cards: deleted.cards.map((card) => (card.id === "c1" ? { ...card, unitId: "unit_b" } : card))
    };
    const restored = restoreUnitFromSnapshot(rebuilt, snapshot);

    expect(restored.units.filter((unit) => unit.id === "unit_a")).toHaveLength(1);
    expect(restored.units.find((unit) => unit.id === "unit_a")?.title).toBe("A 书（重建）");
    expect(restored.cards.find((card) => card.id === "c1")?.unitId).toBe("unit_b");
  });
});
