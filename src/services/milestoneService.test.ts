import { describe, expect, it } from "vitest";
import {
  MILESTONES,
  computeMilestoneStates,
  findNewlyReachedMilestones,
  markMilestonesReached
} from "./milestoneService";
import { dayKey } from "./statsService";
import { makeReview, makeTestData, makeUnit } from "./testUtils";

const dayMs = 24 * 60 * 60 * 1000;
const NOW = new Date("2026-09-13T09:00:00");
const iso = (offsetDays: number) => new Date(NOW.getTime() + offsetDays * dayMs).toISOString();

/** 连续 N 天复习记录（含今天，从 0 到 -(n-1)）。 */
const streakReviews = (days: number) =>
  Array.from({ length: days }, (_, index) =>
    makeReview({ id: `r${index}`, cardId: `c${index}`, reviewedAt: iso(-index) })
  );

describe("computeMilestoneStates（PRD-wordbook-v2 P2-2 里程碑激励）", () => {
  it("streak 里程碑：连续 6 天未达成 streak-7，进度 6/7", () => {
    const data = makeTestData({ reviews: streakReviews(6) });
    const states = computeMilestoneStates(data, NOW);
    const streak7 = states.find((state) => state.definition.id === "streak-7")!;
    expect(streak7.reached).toBe(false);
    expect(streak7.current).toBe(6);
    expect(streak7.progress).toBeCloseTo(6 / 7);
  });

  it("streak 里程碑：连续 7 天达成 streak-7，30/100 未达成", () => {
    const data = makeTestData({ reviews: streakReviews(7) });
    const states = computeMilestoneStates(data, NOW);
    const byId = new Map(states.map((state) => [state.definition.id, state]));
    expect(byId.get("streak-7")!.reached).toBe(true);
    expect(byId.get("streak-30")!.reached).toBe(false);
    expect(byId.get("streak-100")!.reached).toBe(false);
  });

  it("streak 里程碑：连续 100 天三个 streak 里程碑全部达成", () => {
    const data = makeTestData({ reviews: streakReviews(100) });
    const states = computeMilestoneStates(data, NOW);
    expect(states.filter((state) => state.definition.kind === "streak").every((state) => state.reached)).toBe(true);
  });

  it("首本完成：有 unit.completedAt 即达成，完成本数累计", () => {
    const data = makeTestData({
      units: [makeUnit({ id: "u1", completedAt: iso(-1) }), makeUnit({ id: "u2" })]
    });
    const states = computeMilestoneStates(data, NOW);
    const firstBook = states.find((state) => state.definition.id === "first-book-complete")!;
    expect(firstBook.reached).toBe(true);
    expect(firstBook.current).toBe(1);
  });

  it("零复习零词书：全部未达成，进度 0", () => {
    const states = computeMilestoneStates(makeTestData({}), NOW);
    expect(states).toHaveLength(MILESTONES.length);
    expect(states.every((state) => !state.reached && state.current === 0 && state.progress === 0)).toBe(true);
  });

  it("断学后恢复：streak 重新计数（验收标准）—— 断 3 天后只学 2 天，streak-7 未达成", () => {
    const data = makeTestData({
      reviews: [
        // 历史上的 10 天连续（-13 到 -4 之前有记录也无妨，-3/-2/-1 断档即重置）
        ...Array.from({ length: 10 }, (_, index) =>
          makeReview({ id: `old${index}`, cardId: `old${index}`, reviewedAt: iso(-4 - index) })
        ),
        // 昨天 + 今天恢复学习
        makeReview({ id: "new1", cardId: "n1", reviewedAt: iso(-1) }),
        makeReview({ id: "new2", cardId: "n2", reviewedAt: iso(0) })
      ]
    });
    const states = computeMilestoneStates(data, NOW);
    const streak7 = states.find((state) => state.definition.id === "streak-7")!;
    expect(streak7.current).toBe(2);
    expect(streak7.reached).toBe(false);
  });
});

describe("findNewlyReachedMilestones / markMilestonesReached", () => {
  it("新达成 = 已达成了但还没记录的；记录后不再返回", () => {
    const data = makeTestData({ reviews: streakReviews(7) });
    const fresh = findNewlyReachedMilestones(data, NOW);
    expect(fresh.map((state) => state.definition.id)).toEqual(["streak-7"]);

    const marked = markMilestonesReached(data, fresh.map((state) => state.definition.id));
    expect(marked.settings.reachedMilestoneIds).toEqual(["streak-7"]);
    expect(findNewlyReachedMilestones(marked, NOW)).toEqual([]);
    // 原数据不被修改
    expect(data.settings.reachedMilestoneIds).toBeUndefined();
  });

  it("markMilestonesReached 幂等：重复标记不重复记录，空列表原样返回", () => {
    const data = makeTestData({ settings: { reachedMilestoneIds: ["streak-7"] } });
    const again = markMilestonesReached(data, ["streak-7", "first-book-complete"]);
    expect(again.settings.reachedMilestoneIds).toEqual(["streak-7", "first-book-complete"]);
    expect(markMilestonesReached(again, [])).toBe(again);
  });

  it("断学重计后再次达成不重复庆祝：streak-7 已记录，streak 重置再满 7 天也不返回", () => {
    const data = makeTestData({
      reviews: streakReviews(7),
      settings: { reachedMilestoneIds: ["streak-7"] }
    });
    expect(findNewlyReachedMilestones(data, NOW)).toEqual([]);
  });

  it("部分记录：streak-7 已庆祝过，达成 streak-30 时只返回 30", () => {
    const data = makeTestData({
      reviews: streakReviews(30),
      settings: { reachedMilestoneIds: ["streak-7"] }
    });
    const fresh = findNewlyReachedMilestones(data, NOW);
    expect(fresh.map((state) => state.definition.id)).toEqual(["streak-30"]);
  });

  it("dayKey 对齐：今天的复习计入连续天数（用 dayKey 口径兜底验证）", () => {
    const data = makeTestData({ reviews: streakReviews(7) });
    const reviewDays = new Set(data.reviews.map((review) => dayKey(new Date(review.reviewedAt))));
    expect(reviewDays.size).toBe(7);
    expect(findNewlyReachedMilestones(data, NOW)).toHaveLength(1);
  });
});
