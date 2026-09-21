/**
 * SM-2 审计 · 第 1 条：算法自洽性（状态迁移 / 单调性 / 收敛 / ease 上下限）。
 *
 * 复现脚本，不改产品代码。所有断言都直接打在 reviewService.applyReview 的产物上。
 *
 * 关键常量（reviewService.ts）：
 *   rating=1 → ease = max(1.3, ease-0.25)；intervalDays = 0；lapseCount+1；nextReviewAt = now+10min
 *   rating=2 → ease = max(1.3, ease-0.10)；intervalDays = 1；           nextReviewAt = now+1d
 *   rating=3 → 语法句卡 intervalDays = max(1, intervalDays || 1)（不放大、ease 不动）
 *              其他卡     intervalDays = max(1, round((intervalDays||1) * ease))
 *   rating=4 → ease = min(3.2, ease+0.12)；intervalDays = max(3, round((intervalDays||1) * ease * 1.3))
 *              （注意：先更新 ease，再拿新 ease 去乘 —— 与标准 SM-2 的顺序不同）
 */
import { describe, expect, it } from "vitest";
import { MAX_INTERVAL_DAYS, applyReview, applyReviewWithUndo, undoReview } from "../../services/reviewService";
import { makeCard, makeSchedule, makeTestData, makeWordCard } from "../../services/testUtils";
import type { AppData, Card, Rating, Schedule } from "../../types";

const DAY_MS = 24 * 60 * 60 * 1000;

const wordAt = (schedule: Partial<Schedule>): { data: AppData; card: Card } => {
  const card = { ...makeWordCard("w1", "approach", "方法"), status: "review" as const };
  return {
    card,
    data: makeTestData({ cards: [card], schedules: [makeSchedule({ cardId: "w1", ...schedule })] })
  };
};

const grammarAt = (schedule: Partial<Schedule>): { data: AppData; card: Card } => {
  const card = makeCard({ id: "g1", type: "sentence", front: "I am happy.", tags: ["语法"], status: "review" });
  return {
    card,
    data: makeTestData({ cards: [card], schedules: [makeSchedule({ cardId: "g1", ...schedule })] })
  };
};

const step = (fixture: { data: AppData; card: Card }, rating: Rating) => {
  const next = applyReview(fixture.data, fixture.card, "spelling", rating);
  const schedule = next.schedules[0];
  const days = Math.round((new Date(schedule.nextReviewAt).getTime() - Date.now()) / DAY_MS);
  return { schedule, days, totalDays: schedule.intervalDays };
};

describe("SM1-a 状态迁移表（word 卡）", () => {
  it("起始 intervalDays = 0 时的四条迁移（ease=2.5）", () => {
    expect(step(wordAt({ easeFactor: 2.5, intervalDays: 0 }), 1).schedule).toMatchObject({
      easeFactor: 2.25,
      intervalDays: 0,
      lapseCount: 1,
      reviewCount: 1
    });
    expect(step(wordAt({ easeFactor: 2.5, intervalDays: 0 }), 2).schedule).toMatchObject({
      easeFactor: 2.4,
      intervalDays: 1,
      lapseCount: 0
    });
    expect(step(wordAt({ easeFactor: 2.5, intervalDays: 0 }), 3).schedule).toMatchObject({
      easeFactor: 2.5,
      intervalDays: 3
    });
    expect(step(wordAt({ easeFactor: 2.5, intervalDays: 0 }), 4).schedule).toMatchObject({
      easeFactor: 2.62,
      intervalDays: 3
    });
  });

  it("rating=1 的 nextReviewAt 是 +10 分钟（不是 +10 天、也不是今天）", () => {
    const { days } = step(wordAt({ easeFactor: 2.5, intervalDays: 30 }), 1);
    expect(days).toBe(0);
    const next = applyReview(wordAt({ easeFactor: 2.5, intervalDays: 30 }).data, {
      ...makeWordCard("w1"), status: "review"
    } as Card, "spelling", 1);
    const deltaMs = new Date(next.schedules[0].nextReviewAt).getTime() - Date.now();
    expect(deltaMs).toBeGreaterThan(9 * 60 * 1000);
    expect(deltaMs).toBeLessThanOrEqual(10 * 60 * 1000);
  });

  /**
   * rating 4 与 rating 3 在 intervalDays=3 时给出 10d vs 8d —— 单调（4 比 3 长）。
   * 但在 intervalDays=0/1（刚 lapsed 过的卡）两者都是 3d —— 平局，仍不违反单调。
   */
  it("在相同的起始 intervalDays 上，rating4 的间隔 >= rating3 的间隔（单调性）", () => {
    for (const intervalDays of [0, 1, 2, 3, 7, 30, 100]) {
      const three = step(wordAt({ easeFactor: 2.5, intervalDays }), 3).totalDays;
      const four = step(wordAt({ easeFactor: 2.5, intervalDays }), 4).totalDays;
      expect(four, `intervalDays=${intervalDays}`).toBeGreaterThanOrEqual(three);
    }
  });
});

describe("SM1-b easeFactor 上下限", () => {
  it("下限 1.3：在 rating1 / rating2 分支守住", () => {
    const card = { ...makeWordCard("w1"), status: "review" as const };
    let ease = 2.5;
    for (let i = 0; i < 20; i += 1) {
      const data = makeTestData({
        cards: [card],
        schedules: [makeSchedule({ cardId: "w1", easeFactor: ease, intervalDays: 5 })]
      });
      ease = applyReview(data, card, "spelling", 1).schedules[0].easeFactor;
    }
    expect(ease).toBe(1.3);

    let ease2 = 2.5;
    for (let i = 0; i < 40; i += 1) {
      const data = makeTestData({
        cards: [card],
        schedules: [makeSchedule({ cardId: "w1", easeFactor: ease2, intervalDays: 5 })]
      });
      ease2 = applyReview(data, card, "spelling", 2).schedules[0].easeFactor;
    }
    expect(ease2).toBe(1.3);
  });

  it("下限 1.3：rating 4 分支不下探（只加不减）", () => {
    const out = applyReview(wordAt({ easeFactor: 1.3, intervalDays: 5 }).data, wordAt({}).card, "spelling", 4).schedules[0];
    expect(out.easeFactor).toBeCloseTo(1.42, 10);
  });

  /**
   * 【缺陷候选】ease 是从 localStorage 直读的存量字段；storage.normalizeSchedules 只做
   * `Math.max(1.3, ...)`，但若数据来自 storage 之外的路径（测试夹具 / 老版本 / 手工改的
   * JSON 恢复了但没走 migrate 的极小窗口），ease < 1.3 时 rating4 分支不会把它抬回 1.3 ——
   * 它只做 min(3.2, ease+0.12)，于是 0.5 → 0.62。rating3 分支也不触碰 ease。
   * 后果：< 1.3 的 ease 会被 rating4 逐步逼近 3.2（20 次后回到 >1.3），不是永久陷落，
   * 但期间 interval 增长被压低。属低危（normalizeSchedules 已挡住主线）。
   */
  it("[信息性] ease < 1.3 时 rating4 不抬回下限（只有 rating1/2 分支兜底）", () => {
    const out = applyReview(wordAt({ easeFactor: 0.5, intervalDays: 5 }).data, wordAt({}).card, "spelling", 4).schedules[0];
    expect(out.easeFactor).toBeCloseTo(0.62, 10);
    expect(out.easeFactor).toBeLessThan(1.3);
  });

  it("上限 3.2 生效：连续 rating4 不溢出 ease（在 interval 爆炸前先量吃 ease）", () => {
    // 注意：连续 rating4 到第 14 次会抛 RangeError（见下一条），所以这里只跑 8 轮。
    let data = makeTestData({
      cards: [{ ...makeWordCard("w1"), status: "review" as const }],
      schedules: [makeSchedule({ cardId: "w1", easeFactor: 2.5, intervalDays: 3 })]
    });
    const easeTrail: number[] = [];
    for (let i = 0; i < 8; i += 1) {
      data = applyReview(data, data.cards[0], "spelling", 4);
      easeTrail.push(data.schedules[0].easeFactor);
    }
    console.log("SM1-b ease 轨迹:", easeTrail.map((v) => v.toFixed(2)).join(" "));
    expect(easeTrail[0]).toBeCloseTo(2.62, 10);
    expect(easeTrail[5]).toBe(3.2); // 第 6 次触顶
    expect(easeTrail[7]).toBe(3.2);
    expect(Number.isFinite(data.schedules[0].easeFactor)).toBe(true);
  });
});

describe("SM1-c 收敛 / 爆炸", () => {
  /**
   * 【确认的缺陷 · P0】连续 rating4 下 intervalDays 指数增长，
   * 第 14 次起 addDays() 产生超出 Date 范围的毫秒数 → new Date(ms).toISOString() 抛 RangeError。
   * addDays 见 reviewService.ts:41；rating4 分支见 reviewService.ts:445-447。
   */
  it("[P0 已修 2026-09-21] 连续 rating4：间隔被夹在上限内，永不抛出 RangeError", () => {
    /**
     * 修复前：rating4 分支 `interval × ease × 1.3` 无上界，第 14 次
     * `Date.now() + days * DAY_MS` 溢出 Date 的 ±8.64e15 ms 范围 →
     * `toISOString()` 抛 RangeError，该次评分不生效且之后每次点击都抛同一错。
     * 现在 `addDays` 与两个放大分支都过 clampIntervalDays（上限 MAX_INTERVAL_DAYS = 10 年）。
     */
    let fixture = wordAt({ intervalDays: 1, reviewCount: 1 });
    let lastInterval = 0;
    for (let round = 0; round < 20; round += 1) {
      expect(() => {
        fixture = { ...fixture, data: applyReview(fixture.data, fixture.data.cards[0], "spelling", 4, "approach") };
      }, `第 ${round + 1} 次不应抛错`).not.toThrow();
      lastInterval = fixture.data.schedules[0].intervalDays;
      expect(lastInterval, `第 ${round + 1} 次不得超过上限`).toBeLessThanOrEqual(MAX_INTERVAL_DAYS);
      expect(Number.isNaN(new Date(fixture.data.schedules[0].nextReviewAt).getTime())).toBe(false);
    }
    expect(lastInterval, "最终应停在上限").toBe(MAX_INTERVAL_DAYS);
  });

  it("[P0] 复现：直接调用 addDays 等价的超界时间戳 → RangeError", () => {
    const overflowDays = 239210013;
    const ms = Date.now() + overflowDays * DAY_MS;
    expect(Number.isFinite(ms)).toBe(true); // 只是超出 ±8.64e15 的 Date 合法区间
    expect(() => new Date(ms).toISOString()).toThrow(RangeError);
  });

  it("rating3 语法卡：任何起始值都不放大，恒 <= max(1, intervalDays)", () => {
    for (const intervalDays of [0, 1, 5, 100, 400]) {
      const out = applyReview(grammarAt({ easeFactor: 2.5, intervalDays }).data, grammarAt({}).card, "cloze", 3).schedules[0];
      expect(out.intervalDays, `intervalDays=${intervalDays}`).toBe(Math.max(1, intervalDays));
    }
  });

  it("rating3 语法卡：反复答对永远停在 1 天（不收敛到长间隔）", () => {
    const card = makeCard({ id: "g1", type: "sentence", front: "I am happy.", tags: ["语法"], status: "review" });
    let data = makeTestData({ cards: [card], schedules: [makeSchedule({ cardId: "g1", easeFactor: 2.5, intervalDays: 1 })] });
    for (let i = 0; i < 10; i += 1) data = applyReview(data, data.cards[0], "cloze", 3);
    expect(data.schedules[0].intervalDays).toBe(1);
    expect(data.schedules[0].reviewCount).toBe(10);
  });
});

describe("SM1-d 摘星/掌握状态的迁移", () => {
  it("rating4 且 reviewCount>=4 → mastered；rating1/2/3 → review", () => {
    const base = { ...makeWordCard("w1"), status: "review" as const };
    const at = (reviewCount: number) =>
      makeTestData({ cards: [base], schedules: [makeSchedule({ cardId: "w1", reviewCount })] });

    expect(applyReview(at(3), base, "spelling", 4).cards[0].status).toBe("mastered");
    expect(applyReview(at(2), base, "spelling", 4).cards[0].status).toBe("review");
    expect(applyReview(at(9), base, "spelling", 3).cards[0].status).toBe("review");
    expect(applyReview(at(9), base, "spelling", 2).cards[0].status).toBe("review");
    expect(applyReview(at(9), base, "spelling", 1).cards[0].status).toBe("review");
  });

  it("mastered 卡被 rating2 打回 review 时 masteredAt 清空", () => {
    const card = { ...makeWordCard("w1"), status: "mastered" as const, masteredAt: "2024-01-01T00:00:00.000Z" };
    const data = makeTestData({ cards: [card], schedules: [makeSchedule({ cardId: "w1", reviewCount: 5 })] });
    const out = applyReview(data, card, "spelling", 2);
    expect(out.cards[0].status).toBe("review");
    expect(out.cards[0].masteredAt).toBeNull();
  });
});

describe("SM1-e rating 3/4 组合：'试一次答对' vs '试多次答对'", () => {
  /**
   * 语法句卡的 rating 由 GrammarReviewPage.ratingForOutcome 给出：
   *   一次通过 → 4；多次尝试后通过 → 3；看答案 → 1。
   * 审计问题：3 与 4 的间隔差异是否「不成比例」。
   */
  it("同一张语法卡：一次过(4) vs 三次试过(3) 的后续间隔轨迹", () => {
    const card = makeCard({ id: "g1", type: "sentence", front: "I am happy.", tags: ["语法"], status: "review" });
    const run = (ratings: Rating[]) => {
      let data = makeTestData({ cards: [card], schedules: [makeSchedule({ cardId: "g1", easeFactor: 2.5, intervalDays: 0 })] });
      for (const rating of ratings) data = applyReview(data, data.cards[0], "cloze", rating);
      return data.schedules[0];
    };

    const oncePerfect = run([4, 4, 4]);
    const stumbled = run([3, 3, 3]);
    console.log(
      "SM1-e 一次过 [4,4,4]:",
      JSON.stringify({ ease: oncePerfect.easeFactor, interval: oncePerfect.intervalDays }),
      " 试多次 [3,3,3]:",
      JSON.stringify({ ease: stumbled.easeFactor, interval: stumbled.intervalDays })
    );

    // 一次过一次的卡 interval 递增；试多次的卡永远 1 天 —— 这是设计意图（R09 Step1）
    expect(oncePerfect.intervalDays).toBeGreaterThan(1);
    expect(stumbled.intervalDays).toBe(1);
  });

  it("[可疑·已证实] 语法卡一旦落入 rating3 分支，ease 永不变化 → 唯一的逃生通道是 rating4", () => {
    const out = applyReview(grammarAt({ easeFactor: 2.5, intervalDays: 3 }).data, grammarAt({}).card, "cloze", 3).schedules[0];
    expect(out.easeFactor).toBe(2.5);
  });

  it("[可疑·已证实] 非语法卡 rating3 用旧 ease 相乘，而 rating4 用新 ease 相乘（顺序不一致）", () => {
    // rating3：round(3 * 2.5) = 8；rating4：round(3 * 2.62 * 1.3) = round(10.218) = 10
    const three = step(wordAt({ easeFactor: 2.5, intervalDays: 3 }), 3).schedule;
    const four = step(wordAt({ easeFactor: 2.5, intervalDays: 3 }), 4).schedule;
    expect(three.intervalDays).toBe(8);
    expect(four.intervalDays).toBe(10);
    // 若 rating3 也先更新 ease（standard 顺序），应是 round(3*2.5)=8 —— 该分支本就不改 ease
    expect(three.easeFactor).toBe(2.5);
  });
});

describe("SM1-f reviewCount / lapseCount 语义", () => {
  it("每次复习两者恰好各自 +1（rating1）或 lapseCount 不动（rating>=2）", () => {
    const card = { ...makeWordCard("w1"), status: "review" as const };
    let data = makeTestData({
      cards: [card],
      schedules: [makeSchedule({ cardId: "w1", reviewCount: 7, lapseCount: 2 })]
    });
    data = applyReview(data, data.cards[0], "spelling", 1);
    expect(data.schedules[0]).toMatchObject({ reviewCount: 8, lapseCount: 3 });
    data = applyReview(data, data.cards[0], "spelling", 4);
    expect(data.schedules[0]).toMatchObject({ reviewCount: 9, lapseCount: 3 });
  });

  it("undo 快照完整回滚 ease/interval/lapse/recovery（含 nextReviewAt）", () => {
    const card = { ...makeWordCard("w1"), status: "review" as const };
    const data = makeTestData({
      cards: [card],
      schedules: [makeSchedule({ cardId: "w1", easeFactor: 2.5, intervalDays: 7, lapseCount: 1, reviewCount: 3 })]
    });
    const { data: next, undo } = applyReviewWithUndo(data, card, "spelling", 1, "", "[]");
    const restored = undoReview(next, undo);
    expect(restored.schedules[0]).toEqual(data.schedules[0]);
  });
});
