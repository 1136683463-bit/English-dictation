import { AppData, Card, Unit, UnitGroup } from "../types";
import { estimateDaysToMaster } from "./completionEstimate";
import { nowIso, uid } from "./storage";

export const getCardsForUnit = (data: AppData, unitId: string) =>
  data.cards
    .filter((card) => card.type === "word" && card.unitId === unitId)
    .sort((a, b) => a.front.localeCompare(b.front));

export const getUnassignedWordCards = (data: AppData) =>
  data.cards
    .filter((card) => card.type === "word" && !card.unitId)
    .sort((a, b) => a.front.localeCompare(b.front));

export const getUnitStats = (data: AppData, unit: Unit) => {
  const cards = getCardsForUnit(data, unit.id);
  const cardIds = new Set(cards.map((card) => card.id));
  const reviews = data.reviews.filter((review) => cardIds.has(review.cardId));
  const spellingReviews = reviews.filter((review) => review.mode === "spelling");
  const correct = spellingReviews.filter((review) => review.rating >= 3).length;
  const accuracy = spellingReviews.length === 0 ? 0 : Math.round((correct / spellingReviews.length) * 100);
  const mastered = cards.filter((card) => card.status === "mastered").length;
  const newWords = cards.filter((card) => card.status === "new").length;
  const learning = cards.filter((card) => card.status === "learning" || card.status === "review").length;
  const due = cards.filter((card) => {
    const schedule = data.schedules.find((item) => item.cardId === card.id);
    return schedule ? new Date(schedule.nextReviewAt) <= new Date() : false;
  }).length;
  const total = cards.length;
  const completionPercent = total === 0 ? 0 : Math.round((mastered / total) * 100);
  const remaining = Math.max(0, total - mastered);
  const dailyNewWords = Math.max(1, data.settings.dailyNewWords || 10);
  // 新口径：纳入 SM-2 复习尾巴与每日复习容量（旧口径 remaining/dailyNew 严重低估）。
  const estimatedDays = estimateDaysToMaster(remaining, dailyNewWords, data.settings.dailyReviewLimit);

  return {
    total,
    newWords,
    learning,
    mastered,
    due,
    reviewed: spellingReviews.length,
    accuracy,
    completionPercent,
    estimatedDays
  };
};

export const getVocabularyGoalStats = (data: AppData) => {
  const wordCards = data.cards.filter((card) => card.type === "word" && card.status !== "suspended");
  const now = new Date();
  const dueIds = new Set(
    data.schedules
      .filter((schedule) => new Date(schedule.nextReviewAt) <= now)
      .map((schedule) => schedule.cardId)
  );
  const total = wordCards.length;
  const mastered = wordCards.filter((card) => card.status === "mastered").length;
  const newWords = wordCards.filter((card) => card.status === "new").length;
  const learning = wordCards.filter((card) => card.status === "learning" || card.status === "review").length;
  const dueToday = wordCards.filter((card) => dueIds.has(card.id)).length;
  const completionPercent = total === 0 ? 0 : Math.round((mastered / total) * 100);
  const remaining = Math.max(0, total - mastered);
  const dailyNewWords = Math.max(1, data.settings.dailyNewWords || 10);

  return {
    total,
    newWords,
    learning,
    mastered,
    dueToday,
    completionPercent,
    estimatedDays: estimateDaysToMaster(remaining, dailyNewWords, data.settings.dailyReviewLimit)
  };
};

export const createUnit = (data: AppData, title: string, description = "", color = "#2563eb", groupId = ""): AppData => {
  const timestamp = nowIso();
  const maxOrder = data.units.reduce((max, unit) => Math.max(max, unit.order), 0);
  const unit: Unit = {
    id: uid("unit"),
    title: title.trim(),
    description: description.trim(),
    order: maxOrder + 1,
    color,
    groupId: groupId || undefined,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  return { ...data, units: [...data.units, unit] };
};

export const updateUnit = (
  data: AppData,
  unitId: string,
  patch: Pick<Unit, "title" | "description" | "color"> & Partial<Pick<Unit, "groupId">>
): AppData => ({
  ...data,
  units: data.units.map((unit) =>
    unit.id === unitId
      ? {
          ...unit,
          title: patch.title.trim(),
          description: patch.description.trim(),
          color: patch.color,
          groupId: patch.groupId || undefined,
          updatedAt: nowIso()
        }
      : unit
  )
});

export const moveUnitToGroup = (data: AppData, unitId: string, groupId: string): AppData => {
  const group = data.unitGroups.find((item) => item.id === groupId);
  if (!group) return data;
  const timestamp = nowIso();

  return {
    ...data,
    units: data.units.map((unit) =>
      unit.id === unitId ? { ...unit, groupId: group.id, color: group.color, updatedAt: timestamp } : unit
    )
  };
};

/** P2-6：把词书移出分组回到「未分组」（保留当前颜色，已是未分组时原样返回）。 */
export const removeUnitFromGroup = (data: AppData, unitId: string): AppData => {
  const target = data.units.find((unit) => unit.id === unitId);
  if (!target || !target.groupId) return data;
  const timestamp = nowIso();

  return {
    ...data,
    units: data.units.map((unit) =>
      unit.id === unitId ? { ...unit, groupId: undefined, updatedAt: timestamp } : unit
    )
  };
};

export const createUnitGroup = (data: AppData, title: string, color = "#f06423"): AppData => {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return data;
  const timestamp = nowIso();
  const maxOrder = data.unitGroups.reduce((max, group) => Math.max(max, group.order), 0);
  const group: UnitGroup = {
    id: uid("unit_group"),
    title: trimmedTitle,
    color,
    order: maxOrder + 1,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  return { ...data, unitGroups: [...data.unitGroups, group] };
};

export const updateUnitGroup = (
  data: AppData,
  groupId: string,
  patch: Pick<UnitGroup, "title" | "color">,
  options: { applyColorToUnits?: boolean } = {}
): AppData => {
  const timestamp = nowIso();
  const color = patch.color;

  return {
    ...data,
    unitGroups: data.unitGroups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            title: patch.title.trim() || group.title,
            color,
            updatedAt: timestamp
          }
        : group
    ),
    units: options.applyColorToUnits
      ? data.units.map((unit) => (unit.groupId === groupId ? { ...unit, color, updatedAt: timestamp } : unit))
      : data.units
  };
};

export const deleteUnitGroup = (data: AppData, groupId: string): AppData => ({
  ...data,
  unitGroups: data.unitGroups.filter((group) => group.id !== groupId),
  units: data.units.map((unit) => (unit.groupId === groupId ? { ...unit, groupId: undefined, updatedAt: nowIso() } : unit))
});

export const deleteUnit = (data: AppData, unitId: string): AppData => ({
  ...data,
  units: data.units.filter((unit) => unit.id !== unitId),
  cards: data.cards.map((card) => (card.unitId === unitId ? { ...card, unitId: undefined, updatedAt: nowIso() } : card))
});

/** P2-5 删除撤销：词书删除前的快照（词书本体 + 指向它的卡 id 列表）。 */
export interface UnitDeleteSnapshot {
  unit: Unit;
  cardIds: string[];
}

export const snapshotUnitForDelete = (data: AppData, unitId: string): UnitDeleteSnapshot | null => {
  const unit = data.units.find((item) => item.id === unitId);
  if (!unit) return null;
  return {
    unit,
    cardIds: data.cards.filter((card) => card.unitId === unitId).map((card) => card.id)
  };
};

/**
 * P2-5 删除撤销：按快照还原词书与卡片归属。
 * 词书 id 已存在时不重复添加；撤销窗口内已被挪到别处的卡不强行拽回。
 */
export const restoreUnitFromSnapshot = (data: AppData, snapshot: UnitDeleteSnapshot): AppData => {
  const units = data.units.some((unit) => unit.id === snapshot.unit.id)
    ? data.units
    : [...data.units, snapshot.unit].sort((a, b) => a.order - b.order);
  const cardIdSet = new Set(snapshot.cardIds);
  return {
    ...data,
    units,
    cards: data.cards.map((card) =>
      cardIdSet.has(card.id) && !card.unitId ? { ...card, unitId: snapshot.unit.id, updatedAt: nowIso() } : card
    )
  };
};

export const assignCardsToUnit = (data: AppData, cards: Card[], unitId: string): AppData => {
  const ids = new Set(cards.map((card) => card.id));
  return {
    ...data,
    cards: data.cards.map((card) => (ids.has(card.id) ? { ...card, unitId, updatedAt: nowIso() } : card))
  };
};

export const assignCardIdsToUnit = (data: AppData, cardIds: string[], unitId: string): AppData => {
  const ids = new Set(cardIds);
  return {
    ...data,
    cards: data.cards.map((card) => (ids.has(card.id) ? { ...card, unitId, updatedAt: nowIso() } : card))
  };
};

export const removeCardFromUnit = (data: AppData, cardId: string): AppData => ({
  ...data,
  cards: data.cards.map((card) => (card.id === cardId ? { ...card, unitId: undefined, updatedAt: nowIso() } : card))
});
