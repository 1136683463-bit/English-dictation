/**
 * SM-2 审计 · 补充（并发编辑后新增逻辑）：`keepsMasteredStatus` 与
 * 「mastered 语法卡仍进复习队列」组合出的**不可降级循环**。
 *
 * 两个事实（各自已验证）：
 *  A. reviewService.keepsMasteredStatus（审计期间并发落地）：
 *     语法句子卡只要当前 status==="mastered"，任何 rating（含 1）都不再降级。
 *  B. grammarReviewService.listDueGrammarReviewCards 不排除 mastered：
 *     已掌握语法卡只要到期就会重新出现在复习会话里。
 *
 * 组合后果：一张 mastered 语法卡会**反复出现**（答对间隔变长，但答错也不再降级），
 * 而每次答错（rating=1）都把 intervalDays 归零 —— 它又变成「随时到期」的活跃卡。
 * 用户会反复看到一张系统标记为「已掌握」的卡，且无法把它退回未掌握。
 */
import { describe, expect, it } from "vitest";
import { applyReview, getDueCards } from "../../services/reviewService";
import { listDueGrammarReviewCards, summarizeGrammarMastery } from "../../services/grammarReviewService";
import { makeCard, makeSchedule, makeTestData } from "../../services/testUtils";
import type { AppData } from "../../types";

const masteredGrammar = () =>
  makeCard({
    id: "g1", type: "sentence", front: "I am happy.", tags: ["语法"],
    status: "mastered", masteredAt: "2024-01-01T00:00:00.000Z"
  });

const dataWith = (patch: Record<string, unknown>): AppData =>
  makeTestData({
    cards: [masteredGrammar()],
    schedules: [makeSchedule({ cardId: "g1", easeFactor: 3.2, intervalDays: 30, reviewCount: 6, nextReviewAt: "2020-01-01T00:00:00.000Z" }) as never]
  });

describe("SM8 mastered 语法卡：可反复出现但不可降级", () => {
  it("mastered 语法卡进复习队列，且看答案（rating1）后仍是 mastered", () => {
    const before = dataWith({});
    expect(listDueGrammarReviewCards(before)).toHaveLength(1); // 会出现在复习会话
    expect(getDueCards(before)).toHaveLength(0); // 但词卡到期口径排除 mastered

    const after = applyReview(before, before.cards[0], "cloze", 1);
    console.log("SM8 rating1 后:", JSON.stringify({
      status: after.cards[0].status,
      masteredAt: after.cards[0].masteredAt,
      intervalDays: after.schedules[0].intervalDays,
      lapseCount: after.schedules[0].lapseCount
    }));

    // 掌握状态保持不变（keepsMasteredStatus）
    expect(after.cards[0].status).toBe("mastered");
    // 但排期被归零 → 10 分钟后立刻又会到期、又出现
    expect(after.schedules[0].intervalDays).toBe(0);
    expect(after.schedules[0].lapseCount).toBe(1);
  });

  it("循环成立：反复「看答案」不会脱离 mastered，卡持续到期", () => {
    let data = dataWith({});
    const trail: Array<{ round: number; status: string; intervalDays: number; lapseCount: number; dueInQueue: number }> = [];
    for (let round = 1; round <= 5; round += 1) {
      data = applyReview(data, data.cards[0], "cloze", 1);
      trail.push({
        round,
        status: data.cards[0].status,
        intervalDays: data.schedules[0].intervalDays,
        lapseCount: data.schedules[0].lapseCount,
        dueInQueue: listDueGrammarReviewCards(data, new Date(Date.now() + 11 * 60 * 1000)).length
      });
    }
    console.log("SM8 五轮看答案:", JSON.stringify(trail, null, 0));
    expect(trail.every((item) => item.status === "mastered")).toBe(true);
    expect(trail.every((item) => item.dueInQueue === 1)).toBe(true);
    expect(data.schedules[0].lapseCount).toBe(5);
  });

  it("对照：词卡 mastered 被 rating1 正常降级回 review（两类型行为分叉）", () => {
    const word = { ...makeCard({ id: "w1" }), status: "mastered" as const, masteredAt: "2024-01-01T00:00:00.000Z" };
    const data = makeTestData({
      cards: [word],
      schedules: [makeSchedule({ cardId: "w1", intervalDays: 30, reviewCount: 6 })]
    });
    const after = applyReview(data, word, "spelling", 1);
    expect(after.cards[0].status).toBe("review");
    expect(after.cards[0].masteredAt).toBeNull();
  });

  it("掌握度进度条：反复出现的卡仍被算作「已掌握」（读数不因复习而变动）", () => {
    const data = dataWith({});
    expect(summarizeGrammarMastery(data)).toEqual({ mastered: 1, inProgress: 0, notStarted: 0, total: 1 });
  });
});

describe("SM8-b 不可降级循环的次生效应", () => {
  it("反复看答案到第 3 轮时 lapseCount 触线 → 被自动置位 priority=system", () => {
    let data = dataWith({});
    const priorities: Array<{ round: number; lapseCount: number; priority: boolean; source?: string }> = [];
    for (let round = 1; round <= 4; round += 1) {
      data = applyReview(data, data.cards[0], "cloze", 1);
      priorities.push({
        round,
        lapseCount: data.schedules[0].lapseCount,
        priority: data.cards[0].priority,
        source: data.cards[0].prioritySource
      });
    }
    console.log("SM8-b 优先级轨迹:", JSON.stringify(priorities));
    // 第 3 轮 lapseCount=3 → 自动进「系统关注」，而卡的状态仍是 mastered
    expect(priorities[2].priority).toBe(true);
    expect(priorities[2].source).toBe("system");
    expect(data.cards[0].status).toBe("mastered");
  });
});
