import { describe, expect, it } from "vitest";
import { buildDailyDirective, getDeadUnits, BACKLOG_MIN_CARDS } from "./dailyDirectiveService";
import { buildSpellingQueue } from "./spellingQueueService";
import { dayKey } from "./statsService";
import { makeCard, makeReview, makeSchedule, makeTestData, makeUnit } from "./testUtils";

const dayMs = 24 * 60 * 60 * 1000;
const NOW = new Date("2026-09-13T09:00:00");
const iso = (offsetDays: number) => new Date(NOW.getTime() + offsetDays * dayMs).toISOString();

describe("buildDailyDirective（PRD-wordbook-v2 P0-4 书架每日指令卡）", () => {
  it("empty：书架无词书 → 引导态", () => {
    const directive = buildDailyDirective(makeTestData({}), NOW);
    expect(directive.kind).toBe("empty");
    expect(directive.totalCards).toBe(0);
  });

  it("backlog：到期 >48h 且 ≥10 张 → 指向积压最多的词书，数字 = 实际队列", () => {
    const unitA = makeUnit({ id: "uA", title: "A 书" });
    const unitB = makeUnit({ id: "uB", title: "B 书" });
    // uA 积压 11 张（到期 3 天前），uB 积压 2 张
    const cardsA = Array.from({ length: 11 }, (_, i) =>
      makeCard({ id: `a${i}`, unitId: "uA", status: "review", front: `a${i}` })
    );
    const cardsB = Array.from({ length: 2 }, (_, i) =>
      makeCard({ id: `b${i}`, unitId: "uB", status: "review", front: `b${i}` })
    );
    const data = makeTestData({
      units: [unitA, unitB],
      cards: [...cardsA, ...cardsB],
      schedules: [
        ...cardsA.map((card) => makeSchedule({ cardId: card.id, nextReviewAt: iso(-3) })),
        ...cardsB.map((card) => makeSchedule({ cardId: card.id, nextReviewAt: iso(-3) }))
      ]
    });

    const directive = buildDailyDirective(data, NOW);
    expect(directive.kind).toBe("backlog");
    expect(directive.unitId).toBe("uA");
    expect(directive.backlogCount).toBe(13);
    expect(directive.backlogOldestDays).toBe(3);
    // 硬口径：指令卡数字 = buildSpellingQueue 实际队列数字
    const queue = buildSpellingQueue(data, "uA", "standard", 30, null, [], "smart");
    expect(directive.totalCards).toBe(queue.length);
    expect(directive.reviewCount).toBe(queue.filter((c) => c.status !== "new").length);
  });

  it("backlog 不触发：积压 <10 张时落入常规分支", () => {
    const unit = makeUnit({ id: "u1", createdAt: iso(-30) });
    const cards = Array.from({ length: BACKLOG_MIN_CARDS - 1 }, (_, i) =>
      makeCard({ id: `c${i}`, unitId: "u1", status: "review", front: `c${i}` })
    );
    const data = makeTestData({
      units: [unit],
      cards,
      schedules: cards.map((card) => makeSchedule({ cardId: card.id, nextReviewAt: iso(-3) })),
      // 有一条复习记录 → 不是死卡书，避免落入 wake 分支
      reviews: [makeReview({ cardId: "c0", reviewedAt: iso(-4) })]
    });

    const directive = buildDailyDirective(data, NOW);
    expect(directive.kind).toBe("normal");
    expect(directive.unitId).toBe("u1");
    expect(directive.totalCards).toBe(BACKLOG_MIN_CARDS - 1);
    expect(directive.newCount).toBe(0);
  });

  it("wake：建书 ≥72h 且零复习 → 唤醒最早未学书", () => {
    const deadOld = makeUnit({ id: "u_dead_old", title: "旧书", createdAt: iso(-10) });
    const deadNew = makeUnit({ id: "u_dead_new", title: "新书", createdAt: iso(-4) });
    // 有复习记录的书不算死卡
    const alive = makeUnit({ id: "u_alive", createdAt: iso(-20) });
    const data = makeTestData({
      units: [deadNew, alive, deadOld],
      cards: [
        makeCard({ id: "c_do", unitId: "u_dead_old", status: "new", front: "do" }),
        makeCard({ id: "c_dn", unitId: "u_dead_new", status: "new", front: "dn" }),
        makeCard({ id: "c_a", unitId: "u_alive", status: "review", front: "a" })
      ],
      schedules: [makeSchedule({ cardId: "c_a", nextReviewAt: iso(3) })],
      reviews: [makeReview({ cardId: "c_a", reviewedAt: iso(-2) })]
    });

    const directive = buildDailyDirective(data, NOW);
    expect(directive.kind).toBe("wake");
    expect(directive.unitId).toBe("u_dead_old");
    expect(directive.waitedDays).toBe(10);
    expect(directive.totalCards).toBe(1);
    expect(directive.newCount).toBe(1);
  });

  it("wake 让位：积压达标时优先积压预警", () => {
    const unit = makeUnit({ id: "u1", createdAt: iso(-10) });
    const cards = Array.from({ length: 12 }, (_, i) =>
      makeCard({ id: `c${i}`, unitId: "u1", status: "review", front: `c${i}` })
    );
    const data = makeTestData({
      units: [unit],
      cards,
      // 有复习记录（非死卡）+ 到期 3 天 → 积压分支
      schedules: cards.map((card) => makeSchedule({ cardId: card.id, nextReviewAt: iso(-3) })),
      reviews: cards.map((card) => makeReview({ id: `r_${card.id}`, cardId: card.id, reviewedAt: iso(-4) }))
    });

    const directive = buildDailyDirective(data, NOW);
    expect(directive.kind).toBe("backlog");
  });

  it("speedrun：速通本未完成且无积压无死卡 → 速通指令", () => {
    const speed = makeUnit({ id: "u_speed", title: "速通本", createdAt: iso(-1), speedRun: true });
    const normal = makeUnit({ id: "u_normal", createdAt: iso(-2) });
    const data = makeTestData({
      units: [normal, speed],
      cards: [
        makeCard({ id: "c_s", unitId: "u_speed", status: "new", front: "s" }),
        makeCard({ id: "c_n", unitId: "u_normal", status: "new", front: "n" })
      ]
    });

    const directive = buildDailyDirective(data, NOW);
    expect(directive.kind).toBe("speedrun");
    expect(directive.unitId).toBe("u_speed");
  });

  it("normal：到期最多的词书优先；新词数 = 队列内 status=new 计数", () => {
    const unitA = makeUnit({ id: "uA", createdAt: iso(-5) });
    const unitB = makeUnit({ id: "uB", createdAt: iso(-1) });
    const data = makeTestData({
      units: [unitA, unitB],
      cards: [
        makeCard({ id: "c_due", unitId: "uB", status: "review", front: "due" }),
        makeCard({ id: "c_new", unitId: "uB", status: "new", front: "new" }),
        makeCard({ id: "c_a", unitId: "uA", status: "new", front: "a" })
      ],
      schedules: [makeSchedule({ cardId: "c_due", nextReviewAt: iso(-1) })],
      // uA 有复习记录 → 不是死卡书，避免落入 wake 分支
      reviews: [makeReview({ cardId: "c_a", reviewedAt: iso(-2) })]
    });

    const directive = buildDailyDirective(data, NOW);
    expect(directive.kind).toBe("normal");
    expect(directive.unitId).toBe("uB");
    const queue = buildSpellingQueue(data, "uB", "standard", 30, null, [], "smart");
    expect(directive.totalCards).toBe(queue.length);
    expect(directive.newCount).toBe(queue.filter((c) => c.status === "new").length);
    expect(directive.minutes).toBe(Math.max(1, Math.round((queue.length * 20) / 60)));
  });

  it("celebrate：全部词书队列清空 → 庆祝态", () => {
    const unit = makeUnit({ id: "u1", createdAt: iso(-30), completedAt: iso(-1) });
    const data = makeTestData({
      units: [unit],
      cards: [makeCard({ id: "c1", unitId: "u1", status: "mastered", front: "m" })],
      schedules: [makeSchedule({ cardId: "c1", nextReviewAt: iso(30) })]
    });

    const directive = buildDailyDirective(data, NOW);
    expect(directive.kind).toBe("celebrate");
    expect(directive.totalCards).toBe(0);
  });

  it("P1-4 纯复习日：指令数字同步剔除新词（reviewOnly 下数字=队列）", () => {
    const unit = makeUnit({ id: "u1", createdAt: iso(-30) });
    const data = makeTestData({
      units: [unit],
      cards: [
        makeCard({ id: "c_due", unitId: "u1", status: "review", front: "due" }),
        makeCard({ id: "c_new", unitId: "u1", status: "new", front: "new" })
      ],
      schedules: [makeSchedule({ cardId: "c_due", nextReviewAt: iso(-1) })],
      // 有复习记录避免落入 wake；开启当天纯复习日
      reviews: [makeReview({ cardId: "c_due", reviewedAt: iso(-2) })],
      settings: { reviewOnlyDayKey: dayKey(NOW) }
    });

    const directive = buildDailyDirective(data, NOW);
    expect(directive.kind).toBe("normal");
    expect(directive.reviewOnly).toBe(true);
    expect(directive.newCount).toBe(0);
    const queue = buildSpellingQueue(data, "u1", "standard", 30, null, [], "smart", true);
    expect(directive.totalCards).toBe(queue.length);
    expect(directive.totalCards).toBe(1);
  });

  it("weekLearnDays + streak：本周学习日按自然日去重，streak 连续计数", () => {
    const unit = makeUnit({ id: "u1", createdAt: iso(-30) });
    // NOW = 2026-09-13 周日；本周一 = 09-07。周一、周六各学 1 天，昨天+今天连学 → streak 2
    const data = makeTestData({
      units: [unit],
      cards: [makeCard({ id: "c1", unitId: "u1", status: "new", front: "n" })],
      reviews: [
        makeReview({ id: "r1", cardId: "c1", reviewedAt: "2026-09-07T10:00:00" }),
        makeReview({ id: "r2", cardId: "c1", reviewedAt: "2026-09-07T18:00:00" }),
        makeReview({ id: "r3", cardId: "c1", reviewedAt: "2026-09-12T10:00:00" }),
        makeReview({ id: "r4", cardId: "c1", reviewedAt: "2026-09-13T08:00:00" })
      ]
    });

    const directive = buildDailyDirective(data, NOW);
    expect(directive.weekLearnDays).toBe(3);
    expect(directive.streak).toBe(2);
  });
});

describe("getDeadUnits（PRD-wordbook-v2 P1-5 死卡唤醒条，与指令卡 wake 同口径）", () => {
  it("返回全部死卡书：按创建时间升序、waitedDays 按整天计算且下限 3", () => {
    const older = makeUnit({ id: "u_old", createdAt: iso(-10) });
    const newer = makeUnit({ id: "u_new", createdAt: iso(-4) });
    const data = makeTestData({
      units: [newer, older],
      cards: [
        makeCard({ id: "c1", unitId: "u_old", status: "new", front: "a" }),
        makeCard({ id: "c2", unitId: "u_new", status: "new", front: "b" })
      ]
    });

    const dead = getDeadUnits(data, NOW);
    expect(dead.map((entry) => entry.unit.id)).toEqual(["u_old", "u_new"]);
    expect(dead[0].waitedDays).toBe(10);
    expect(dead[1].waitedDays).toBe(4);
  });

  it("排除：建书 <72h / 有任意复习记录 / 无词卡 / 全书 suspended", () => {
    const young = makeUnit({ id: "u_young", createdAt: iso(-2) });
    const reviewed = makeUnit({ id: "u_rev", createdAt: iso(-9) });
    const noCards = makeUnit({ id: "u_empty", createdAt: iso(-9) });
    const allSuspended = makeUnit({ id: "u_sus", createdAt: iso(-9) });
    const data = makeTestData({
      units: [young, reviewed, noCards, allSuspended],
      cards: [
        makeCard({ id: "c_y", unitId: "u_young", status: "new", front: "y" }),
        makeCard({ id: "c_r", unitId: "u_rev", status: "review", front: "r" }),
        makeCard({ id: "c_s", unitId: "u_sus", status: "suspended", front: "s" })
      ],
      reviews: [makeReview({ cardId: "c_r", reviewedAt: iso(-1) })]
    });

    expect(getDeadUnits(data, NOW)).toEqual([]);
  });

  it("72h 边界：恰好 72h 计入，waitedDays 下限 3", () => {
    const edge = makeUnit({ id: "u_edge", createdAt: new Date(NOW.getTime() - 72 * 60 * 60 * 1000).toISOString() });
    const data = makeTestData({
      units: [edge],
      cards: [makeCard({ id: "c_e", unitId: "u_edge", status: "new", front: "e" })]
    });

    const dead = getDeadUnits(data, NOW);
    expect(dead).toHaveLength(1);
    expect(dead[0].waitedDays).toBe(3);
  });

  it("与指令卡 wake 分支同口径：多本死卡书时两者都取最早创建", () => {
    const older = makeUnit({ id: "u_old", title: "旧书", createdAt: iso(-10) });
    const newer = makeUnit({ id: "u_new", title: "新书", createdAt: iso(-4) });
    const data = makeTestData({
      units: [newer, older],
      cards: [
        makeCard({ id: "c1", unitId: "u_old", status: "new", front: "a" }),
        makeCard({ id: "c2", unitId: "u_new", status: "new", front: "b" })
      ]
    });

    const directive = buildDailyDirective(data, NOW);
    expect(directive.kind).toBe("wake");
    expect(directive.unitId).toBe(getDeadUnits(data, NOW)[0].unit.id);
    expect(directive.waitedDays).toBe(getDeadUnits(data, NOW)[0].waitedDays);
  });
});

describe("P2-1 学习范围锁定（指令卡候选只取范围内词书）", () => {
  it("normal 分支：范围外词书即使到期更多也不入选", () => {
    const inScope = makeUnit({ id: "u_in", createdAt: iso(-30) });
    const outScope = makeUnit({ id: "u_out", createdAt: iso(-5) });
    const data = makeTestData({
      units: [outScope, inScope],
      cards: [
        makeCard({ id: "c_in", unitId: "u_in", status: "new", front: "in" }),
        makeCard({ id: "c_out1", unitId: "u_out", status: "review", front: "o1" }),
        makeCard({ id: "c_out2", unitId: "u_out", status: "review", front: "o2" })
      ],
      schedules: [
        makeSchedule({ cardId: "c_out1", nextReviewAt: iso(-1) }),
        makeSchedule({ cardId: "c_out2", nextReviewAt: iso(-1) })
      ],
      // u_in 有复习记录 → 不是死卡书，避免落入 wake 分支
      reviews: [makeReview({ cardId: "c_in", reviewedAt: iso(-2) })],
      settings: { studyScopeUnitIds: ["u_in"] }
    });

    const directive = buildDailyDirective(data, NOW);
    expect(directive.kind).toBe("normal");
    expect(directive.unitId).toBe("u_in");
  });

  it("backlog 分支：范围外积压不计入阈值", () => {
    const inScope = makeUnit({ id: "u_in", createdAt: iso(-30) });
    const outScope = makeUnit({ id: "u_out", createdAt: iso(-6) });
    const outCards = Array.from({ length: 12 }, (_, i) =>
      makeCard({ id: `o${i}`, unitId: "u_out", status: "review", front: `o${i}` })
    );
    const data = makeTestData({
      units: [outScope, inScope],
      cards: [makeCard({ id: "c_in", unitId: "u_in", status: "new", front: "in" }), ...outCards],
      schedules: outCards.map((card) => makeSchedule({ cardId: card.id, nextReviewAt: iso(-3) })),
      // u_out / u_in 都复习过 → 不是死卡书；范围外 12 张积压因锁定不计入 → 回落 normal
      reviews: [
        makeReview({ cardId: "o0", reviewedAt: iso(-4) }),
        makeReview({ id: "r_in", cardId: "c_in", reviewedAt: iso(-2) })
      ],
      settings: { studyScopeUnitIds: ["u_in"] }
    });

    const directive = buildDailyDirective(data, NOW);
    expect(directive.kind).toBe("normal");
    expect(directive.unitId).toBe("u_in");
  });

  it("wake 分支：范围外死卡书被跳过，指向范围内死卡书", () => {
    const deadOut = makeUnit({ id: "u_dead_out", createdAt: iso(-10) });
    const deadIn = makeUnit({ id: "u_dead_in", createdAt: iso(-4) });
    const data = makeTestData({
      units: [deadOut, deadIn],
      cards: [
        makeCard({ id: "c_do", unitId: "u_dead_out", status: "new", front: "do" }),
        makeCard({ id: "c_di", unitId: "u_dead_in", status: "new", front: "di" })
      ],
      settings: { studyScopeUnitIds: ["u_dead_in"] }
    });

    const directive = buildDailyDirective(data, NOW);
    expect(directive.kind).toBe("wake");
    expect(directive.unitId).toBe("u_dead_in");
  });

  it("speedrun 分支：范围外速通本被跳过", () => {
    const speedOut = makeUnit({ id: "u_speed_out", createdAt: iso(-1), speedRun: true, order: 1 });
    const normal = makeUnit({ id: "u_in", createdAt: iso(-2), order: 2 });
    const data = makeTestData({
      units: [speedOut, normal],
      cards: [
        makeCard({ id: "c_s", unitId: "u_speed_out", status: "new", front: "s" }),
        makeCard({ id: "c_n", unitId: "u_in", status: "new", front: "n" })
      ],
      // u_in 复习过 → 不走 wake；两本都 <72h → 无死卡
      reviews: [makeReview({ cardId: "c_n", reviewedAt: iso(-1) })],
      settings: { studyScopeUnitIds: ["u_in"] }
    });

    const directive = buildDailyDirective(data, NOW);
    expect(directive.kind).toBe("normal");
    expect(directive.unitId).toBe("u_in");
  });
});
