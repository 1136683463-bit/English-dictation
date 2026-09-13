import { describe, expect, it } from "vitest";
import { buildSpellingQueue, getStudyScopeUnitIds, isReviewOnlyDay } from "./spellingQueueService";
import { dayKey } from "./statsService";
import { makeCard, makeSchedule, makeTestData, makeUnit } from "./testUtils";

const dayMs = 24 * 60 * 60 * 1000;
const iso = (offsetDays: number) => new Date(Date.now() + offsetDays * dayMs).toISOString();

describe("buildSpellingQueue（PRD-wordbook-v2 P0-2 队列过滤）", () => {
  it("unit smart 队列：mastered 不入场，到期词优先，新词补足", () => {
    const unit = makeUnit({ id: "u1" });
    const dueCard = makeCard({ id: "c_due", unitId: "u1", status: "review", front: "due" });
    const upcomingCard = makeCard({ id: "c_upcoming", unitId: "u1", status: "learning", front: "upcoming" });
    const masteredCard = makeCard({ id: "c_mastered", unitId: "u1", status: "mastered", front: "mastered" });
    const newCard = makeCard({ id: "c_new", unitId: "u1", status: "new", front: "new" });
    const data = makeTestData({
      units: [unit],
      cards: [masteredCard, newCard, upcomingCard, dueCard],
      schedules: [
        makeSchedule({ cardId: "c_due", nextReviewAt: iso(-1) }),
        makeSchedule({ cardId: "c_upcoming", nextReviewAt: iso(3) }),
        makeSchedule({ cardId: "c_mastered", nextReviewAt: iso(30) })
      ]
    });

    const queue = buildSpellingQueue(data, "u1", "standard");
    expect(queue.map((card) => card.id)).toEqual(["c_due", "c_upcoming", "c_new"]);
    expect(queue.some((card) => card.status === "mastered")).toBe(false);
  });

  it("unit smart 队列：新词受全局日配额限制（多本共享，#2 拍板）", () => {
    const unit = makeUnit({ id: "u1" });
    const newCards = Array.from({ length: 15 }, (_, index) =>
      makeCard({ id: `c_new_${index}`, unitId: "u1", status: "new", front: `w${index}`, createdAt: iso(-2 + index / 100) })
    );
    const data = makeTestData({
      units: [unit],
      cards: newCards,
      settings: { dailyNewWords: 10 }
    });

    const queue = buildSpellingQueue(data, "u1", "standard", 30);
    expect(queue).toHaveLength(10);
    expect(queue.every((card) => card.status === "new")).toBe(true);
    // 先建先学
    expect(queue[0].id).toBe("c_new_0");
  });

  it("unit scope=all 全量复刷：mastered 入场，保持词书原始顺序（与旧行为一致）", () => {
    const unit = makeUnit({ id: "u1" });
    const mastered = makeCard({ id: "c_m", unitId: "u1", status: "mastered", front: "m", createdAt: iso(-10) });
    const learning = makeCard({ id: "c_l", unitId: "u1", status: "learning", front: "l", createdAt: iso(-5) });
    const data = makeTestData({
      units: [unit],
      cards: [learning, mastered]
    });

    const queue = buildSpellingQueue(data, "u1", "standard", 30, null, [], "all");
    expect(queue.map((card) => card.id)).toEqual(["c_l", "c_m"]);
  });

  it("unit smart 队列：到期词按 nextReviewAt 升序", () => {
    const unit = makeUnit({ id: "u1" });
    const older = makeCard({ id: "c_old", unitId: "u1", status: "review", front: "old" });
    const newer = makeCard({ id: "c_new", unitId: "u1", status: "learning", front: "new" });
    const data = makeTestData({
      units: [unit],
      cards: [newer, older],
      schedules: [
        makeSchedule({ cardId: "c_old", nextReviewAt: iso(-3) }),
        makeSchedule({ cardId: "c_new", nextReviewAt: iso(-1) })
      ]
    });

    const queue = buildSpellingQueue(data, "u1", "standard");
    expect(queue.map((card) => card.id)).toEqual(["c_old", "c_new"]);
  });

  it("unit smart 队列：suspended 与其他 unit 的卡不入场", () => {
    const unit = makeUnit({ id: "u1" });
    const mine = makeCard({ id: "c_mine", unitId: "u1", status: "new", front: "mine" });
    const suspended = makeCard({ id: "c_sus", unitId: "u1", status: "suspended", front: "sus" });
    const otherUnit = makeCard({ id: "c_other", unitId: "u2", status: "new", front: "other" });
    const data = makeTestData({
      units: [unit],
      cards: [mine, suspended, otherUnit]
    });

    const queue = buildSpellingQueue(data, "u1", "standard");
    expect(queue.map((card) => card.id)).toEqual(["c_mine"]);
  });

  it("无 unit 回退行为保持不变：到期优先 + 新词补足", () => {
    const due = makeCard({ id: "c_due", status: "review", front: "due" });
    const fresh = makeCard({ id: "c_fresh", status: "new", front: "fresh" });
    const data = makeTestData({
      cards: [fresh, due],
      schedules: [makeSchedule({ cardId: "c_due", nextReviewAt: iso(-1) })]
    });

    const queue = buildSpellingQueue(data, null, "standard");
    expect(queue.map((card) => card.id)).toEqual(["c_due", "c_fresh"]);
  });

  it("P1-4 纯复习日：unit smart 队列不安排新词，只出复习轨道", () => {
    const unit = makeUnit({ id: "u1" });
    const dueCard = makeCard({ id: "c_due", unitId: "u1", status: "review", front: "due" });
    const newCard = makeCard({ id: "c_new", unitId: "u1", status: "new", front: "new" });
    const data = makeTestData({
      units: [unit],
      cards: [newCard, dueCard],
      schedules: [makeSchedule({ cardId: "c_due", nextReviewAt: iso(-1) })]
    });

    const queue = buildSpellingQueue(data, "u1", "standard", 30, null, [], "smart", true);
    expect(queue.map((card) => card.id)).toEqual(["c_due"]);
    expect(queue.some((card) => card.status === "new")).toBe(false);
  });

  it("P1-4 纯复习日：全局队列只出到期词，无到期则空队列（不回退全量）", () => {
    const due = makeCard({ id: "c_due", status: "review", front: "due" });
    const fresh = makeCard({ id: "c_fresh", status: "new", front: "fresh" });
    const data = makeTestData({
      cards: [fresh, due],
      schedules: [makeSchedule({ cardId: "c_due", nextReviewAt: iso(-1) })]
    });

    expect(buildSpellingQueue(data, null, "standard", 30, null, [], "smart", true).map((card) => card.id)).toEqual(["c_due"]);

    const noDue = makeTestData({ cards: [fresh] });
    expect(buildSpellingQueue(noDue, null, "standard", 30, null, [], "smart", true)).toEqual([]);
  });

  it("isReviewOnlyDay：当天 dayKey 生效，其他日期/缺省不生效", () => {
    const now = new Date("2026-09-13T09:00:00");
    const settings = makeTestData({ settings: { reviewOnlyDayKey: dayKey(now) } }).settings;
    expect(isReviewOnlyDay(settings, now)).toBe(true);

    const yesterday = makeTestData({ settings: { reviewOnlyDayKey: dayKey(new Date(now.getTime() - 86400000)) } }).settings;
    expect(isReviewOnlyDay(yesterday, now)).toBe(false);

    expect(isReviewOnlyDay(makeTestData({}).settings, now)).toBe(false);
  });
});

describe("P2-1 学习范围锁定（settings.studyScopeUnitIds）", () => {
  it("getStudyScopeUnitIds：undefined/空数组 = 未锁定（null），非空 = Set", () => {
    expect(getStudyScopeUnitIds(makeTestData({}).settings)).toBeNull();
    expect(getStudyScopeUnitIds(makeTestData({ settings: { studyScopeUnitIds: [] } }).settings)).toBeNull();
    expect(getStudyScopeUnitIds(makeTestData({ settings: { studyScopeUnitIds: ["u1", "u2"] } }).settings)).toEqual(new Set(["u1", "u2"]));
  });

  it("全局队列：只出范围内词书的到期词与新词；未分配词在锁定时视为范围外", () => {
    const data = makeTestData({
      units: [makeUnit({ id: "u1" }), makeUnit({ id: "u2" })],
      cards: [
        makeCard({ id: "c_in_due", unitId: "u1", status: "review", front: "in" }),
        makeCard({ id: "c_in_new", unitId: "u1", status: "new", front: "innew" }),
        makeCard({ id: "c_out_due", unitId: "u2", status: "review", front: "out" }),
        makeCard({ id: "c_out_new", unitId: "u2", status: "new", front: "outnew" }),
        makeCard({ id: "c_unassigned", status: "review", front: "un" })
      ],
      schedules: [
        makeSchedule({ cardId: "c_in_due", nextReviewAt: iso(-1) }),
        makeSchedule({ cardId: "c_out_due", nextReviewAt: iso(-1) }),
        makeSchedule({ cardId: "c_unassigned", nextReviewAt: iso(-1) })
      ],
      settings: { studyScopeUnitIds: ["u1"] }
    });

    expect(buildSpellingQueue(data, null, "standard").map((card) => card.id)).toEqual(["c_in_due", "c_in_new"]);
  });

  it("全局队列全量回退：无到期无新词时，回退也只在范围内取词", () => {
    const data = makeTestData({
      units: [makeUnit({ id: "u1" }), makeUnit({ id: "u2" })],
      cards: [
        makeCard({ id: "c_in", unitId: "u1", status: "review", front: "in" }),
        makeCard({ id: "c_out", unitId: "u2", status: "review", front: "out" })
      ],
      schedules: [
        makeSchedule({ cardId: "c_in", nextReviewAt: iso(3) }),
        makeSchedule({ cardId: "c_out", nextReviewAt: iso(3) })
      ],
      settings: { studyScopeUnitIds: ["u1"] }
    });

    expect(buildSpellingQueue(data, null, "standard").map((card) => card.id)).toEqual(["c_in"]);
  });

  it("纯复习日全局队列同样遵守锁定", () => {
    const data = makeTestData({
      units: [makeUnit({ id: "u1" }), makeUnit({ id: "u2" })],
      cards: [
        makeCard({ id: "c_in", unitId: "u1", status: "review", front: "in" }),
        makeCard({ id: "c_out", unitId: "u2", status: "review", front: "out" })
      ],
      schedules: [
        makeSchedule({ cardId: "c_in", nextReviewAt: iso(-1) }),
        makeSchedule({ cardId: "c_out", nextReviewAt: iso(-1) })
      ],
      settings: { studyScopeUnitIds: ["u1"] }
    });

    expect(buildSpellingQueue(data, null, "standard", 30, null, [], "smart", true).map((card) => card.id)).toEqual(["c_in"]);
  });

  it("unit 单队列不受锁定影响：显式进入词书 = 用户主动覆盖", () => {
    const data = makeTestData({
      units: [makeUnit({ id: "u1" }), makeUnit({ id: "u2" })],
      cards: [makeCard({ id: "c_out", unitId: "u2", status: "new", front: "out" })],
      settings: { studyScopeUnitIds: ["u1"] }
    });

    expect(buildSpellingQueue(data, "u2", "standard").map((card) => card.id)).toEqual(["c_out"]);
  });

  it("未锁定（undefined）时行为不变：所有词书的词都入场", () => {
    const data = makeTestData({
      units: [makeUnit({ id: "u1" }), makeUnit({ id: "u2" })],
      cards: [
        makeCard({ id: "c1", unitId: "u1", status: "review", front: "a" }),
        makeCard({ id: "c2", unitId: "u2", status: "review", front: "b" })
      ],
      schedules: [
        makeSchedule({ cardId: "c1", nextReviewAt: iso(-2) }),
        makeSchedule({ cardId: "c2", nextReviewAt: iso(-1) })
      ]
    });

    expect(buildSpellingQueue(data, null, "standard").map((card) => card.id)).toEqual(["c1", "c2"]);
  });
});
