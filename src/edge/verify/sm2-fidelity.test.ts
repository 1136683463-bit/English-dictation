/**
 * SM-2 审计 · 第 2 条：移植保真度（本项目的 SM-2 vs 标准 SM-2 / 本项目自订规格）。
 *
 * 参照物有两个：
 * A. 本项目自订规格 —— PERSONAL_VOCAB_PRODUCT_PLAN.md §9「复习算法」：
 *      | 反馈 | 分数 | 下次间隔 |
 *      | 忘记 | 1 | 10 分钟后或明天 |
 *      | 模糊 | 2 | 1 天 |
 *      | 记得 | 3 | 当前间隔 * ease_factor |
 *      | 熟练 | 4 | 当前间隔 * ease_factor * 1.3 |
 *    （初始 ease 2.5，字段名 ease_factor/interval_days/...）
 * B. 标准 SM-2（Piotr Woźniak）：
 *      - 质量 q ∈ 0..5，q >= 3 才算通过；
 *      - 通过：EF' = EF + (0.1 - (5-q)*(0.08 + (5-q)*0.02))，EF 下限 1.3（无上限）；
 *              n=1 → I=1；n=2 → I=6；n>=3 → I(n) = round(I(n-1) * EF')
 *      - 失败：n 归零，I 归 1（同一天内重复）
 *
 * 本项目把 4 档 rating 压缩映射到 SM-2 的 6 档质量，并做了若干改造。
 * 下面逐条标注「有意偏离」与「非故意偏离」。
 */
import { describe, expect, it } from "vitest";
import { MAX_INTERVAL_DAYS, applyReview } from "../../services/reviewService";
import { makeCard, makeSchedule, makeTestData, makeWordCard } from "../../services/testUtils";
import type { AppData, Card, Rating, Schedule } from "../../types";

const wordAt = (schedule: Partial<Schedule>) => {
  const card: Card = { ...makeWordCard("w1", "approach", "方法"), status: "review" };
  const data: AppData = makeTestData({
    cards: [card],
    schedules: [makeSchedule({ cardId: "w1", ...schedule })]
  });
  return { data, card };
};

const grammarAt = (schedule: Partial<Schedule>) => {
  const card = makeCard({ id: "g1", type: "sentence", front: "I am happy.", tags: ["语法"], status: "review" });
  const data = makeTestData({ cards: [card], schedules: [makeSchedule({ cardId: "g1", ...schedule })] });
  return { data, card };
};

const next = (fixture: { data: AppData; card: Card }, rating: Rating) =>
  applyReview(fixture.data, fixture.card, "spelling", rating).schedules[0];

/** 标准 SM-2 的 EF 递推（q 为 0..5 质量） */
const standardEf = (ef: number, q: number) => Math.max(1.3, ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

describe("SM2-a rating=3：「记得」的间隔公式与自订规格完全一致", () => {
  /**
   * 规格：记得 → 当前间隔 * ease_factor（不乘 1.3，不改 ease）
   * 实现：Math.max(1, Math.round((intervalDays || 1) * easeFactor))
   * → 公式一致。差异只在 round()（规格未规定取整）与 `|| 1`（interval=0 时用 1 当基数）。
   */
  it("word 卡：3 * 2.5 = 7.5 → round 8（规格未规定取整，四舍五入是实现选择）", () => {
    expect(next(wordAt({ easeFactor: 2.5, intervalDays: 3 }), 3).intervalDays).toBe(8);
  });

  it("intervalDays=0 时以 1 为基数（`|| 1`），得 3 而非 0 —— 兜底避免 ×0 锁死", () => {
    expect(next(wordAt({ easeFactor: 2.5, intervalDays: 0 }), 3).intervalDays).toBe(3);
    expect(Math.max(1, Math.round((0 || 1) * 2.5))).toBe(3);
  });

  it("rating=3 不改 ease（与规格一致）", () => {
    expect(next(wordAt({ easeFactor: 2.5, intervalDays: 3 }), 3).easeFactor).toBe(2.5);
    expect(next(wordAt({ easeFactor: 1.7, intervalDays: 3 }), 3).easeFactor).toBe(1.7);
  });
});

describe("SM2-b rating=4：「熟练」的间隔公式与自订规格一致，但 ease 更新顺序是自有选择", () => {
  /**
   * 规格：熟练 → 当前间隔 * ease_factor * 1.3
   * 实现：ease = min(3.2, ease+0.12) 先执行，再用**新** ease 相乘。
   * 若按规格字面（用「当前」ease，即旧值），3 * 2.5 * 1.3 = 9.75 → 10；
   * 实现给 3 * 2.62 * 1.3 = 10.218 → 10 —— 本例巧合同值。
   * 但区间大时会分叉：interval=7 时旧值 22.75→23，新值 23.842→24。
   */
  it("interval=3 时：旧 ease 与实现结果巧合相同（都是 10）", () => {
    expect(next(wordAt({ easeFactor: 2.5, intervalDays: 3 }), 4).intervalDays).toBe(10);
    expect(Math.round(3 * 2.5 * 1.3)).toBe(10);
    expect(Math.round(3 * 2.62 * 1.3)).toBe(10);
  });

  it("[确认的小偏离] interval 较大时「先更新 ease 再相乘」产生 1 天级差异", () => {
    const impl = next(wordAt({ easeFactor: 2.5, intervalDays: 7 }), 4).intervalDays;
    const literalSpec = Math.max(3, Math.round(7 * 2.5 * 1.3));
    const withNewEase = Math.max(3, Math.round(7 * 2.62 * 1.3));
    console.log("SM2-b interval=7 rating=4:", { impl, literalSpec, withNewEase });
    expect(impl).toBe(withNewEase);
    expect(impl).not.toBe(literalSpec);
  });

  it("rating=4 的 ease 增量 +0.12、上限 3.2（标准 SM-2 无上限，且增量是 q 的函数）", () => {
    expect(next(wordAt({ easeFactor: 2.5, intervalDays: 3 }), 4).easeFactor).toBeCloseTo(2.62, 10);
    expect(next(wordAt({ easeFactor: 3.2, intervalDays: 3 }), 4).easeFactor).toBe(3.2);
    // 标准 SM-2 对 q=5 的增量是 +0.1（且无 3.2 上限）
    expect(standardEf(2.5, 5)).toBeCloseTo(2.6, 10);
    expect(standardEf(3.2, 5)).toBeCloseTo(3.3, 10);
  });

  it("rating=4 的最小间隔硬下限是 3 天（标准 SM-2 的 n=1 → I=1、n=2 → I=6）", () => {
    expect(next(wordAt({ easeFactor: 2.5, intervalDays: 0 }), 4).intervalDays).toBe(3);
    expect(next(wordAt({ easeFactor: 2.5, intervalDays: 1 }), 4).intervalDays).toBe(3);
    expect(next(wordAt({ easeFactor: 1.3, intervalDays: 1 }), 4).intervalDays).toBe(3);
  });
});

describe("SM2-c rating=1 / 2：与规格一致，但 lapse 不是「回到 1 天」", () => {
  /**
   * 规格：忘记 → 10 分钟后或明天；模糊 → 1 天。
   * 实现：rating1 → intervalDays 归 0、nextReviewAt = +10min（规格的「10 分钟后」）；lapseCount+1。
   *       rating2 → intervalDays = 1、+1 天；**不动 lapseCount**。
   * 标准 SM-2：两者都算失败（q<3），n 归零、I 归 1，且 EF 都下降。
   */
  it("rating=1：intervalDays 归 0（不是 1），靠 +10min 的 nextReviewAt 立即重来", () => {
    const out = next(wordAt({ easeFactor: 2.5, intervalDays: 30 }), 1);
    expect(out.intervalDays).toBe(0);
    expect(out.lapseCount).toBe(1);
    const deltaMinutes = (new Date(out.nextReviewAt).getTime() - Date.now()) / 60000;
    expect(deltaMinutes).toBeGreaterThan(9);
    expect(deltaMinutes).toBeLessThanOrEqual(10);
  });

  it("rating=2：intervalDays=1、+1 天，且**不计 lapse、不归零**（比标准 SM-2 宽松）", () => {
    const out = next(wordAt({ easeFactor: 2.5, intervalDays: 30, lapseCount: 5 }), 2);
    expect(out.intervalDays).toBe(1);
    expect(out.lapseCount).toBe(5); // 不变
  });

  it("[非故意偏离] rating=1 与 rating=2 对 ease 的惩罚是「差量」而非标准 SM-2 的「距离」", () => {
    // 本项目：-0.25 / -0.10（常数差量）
    expect(next(wordAt({ easeFactor: 2.5 }), 1).easeFactor).toBeCloseTo(2.25, 10);
    expect(next(wordAt({ easeFactor: 2.5 }), 2).easeFactor).toBeCloseTo(2.4, 10);
    // 标准 SM-2：q=0 → -0.8；q=1 → -0.54；q=2 → -0.32；q=3 → -0.14
    expect(standardEf(2.5, 0)).toBeCloseTo(1.7, 10);
    expect(standardEf(2.5, 1)).toBeCloseTo(1.96, 10);
    expect(standardEf(2.5, 2)).toBeCloseTo(2.18, 10);
    // 本项目把 4 档映射到质量 0/1/2/5（ease 的增量为 +0.12 而非 +0.1）—— 4 档对 6 档的压缩
  });
});

describe("SM2-d 有意偏离汇总（逐条对照）", () => {
  it("偏离 1：语法句卡 rating=3 不放大间隔（R09 Step1，代码注释明确声明）", () => {
    // 非语法：3 * 2.5 = 8
    expect(next(wordAt({ easeFactor: 2.5, intervalDays: 3 }), 3).intervalDays).toBe(8);
    // 语法：维持 3
    expect(next(grammarAt({ easeFactor: 2.5, intervalDays: 3 }), 3).intervalDays).toBe(3);
  });

  it("偏离 2：ease 上限 3.2（标准 SM-2 无上限）", () => {
    let data = makeTestData({
      cards: [{ ...makeWordCard("w1"), status: "review" as const }],
      schedules: [makeSchedule({ cardId: "w1", easeFactor: 2.5, intervalDays: 3 })]
    });
    for (let i = 0; i < 10; i += 1) data = applyReview(data, data.cards[0], "spelling", 4);
    expect(data.schedules[0].easeFactor).toBe(3.2);
  });

  it("偏离 3：所有分支都用 Math.max 设了硬下限（1 天 / 3 天），不出现标准 SM-2 的「重置到 1 天」", () => {
    // 标准 SM-2 失败后 I=1；本项目 rating1 是 10 分钟、rating2 是 1 天、rating3 最少 1 天、rating4 最少 3 天
    for (const rating of [1, 2, 3, 4] as const) {
      const out = next(wordAt({ easeFactor: 2.5, intervalDays: 0 }), rating);
      expect(out.intervalDays, `rating=${rating}`).toBeGreaterThanOrEqual(0);
    }
    expect((["1", "2", "3", "4"] as const).map((r) => next(wordAt({ easeFactor: 2.5, intervalDays: 0 }), Number(r) as Rating).intervalDays))
      .toEqual([0, 1, 3, 3]);
  });

  it("偏离 4：没有标准 SM-2 的「n=1 → 1 天、n=2 → 6 天」固定阶梯，全靠乘法", () => {
    const first = next(wordAt({ easeFactor: 2.5, intervalDays: 0 }), 4).intervalDays;
    const second = applyReview(
      makeTestData({
        cards: [{ ...makeWordCard("w1"), status: "review" as const }],
        schedules: [makeSchedule({ cardId: "w1", easeFactor: 2.62, intervalDays: first })]
      }),
      { ...makeWordCard("w1"), status: "review" } as Card,
      "spelling",
      4
    ).schedules[0].intervalDays;
    console.log("SM2-d 阶梯: 第1次 =", first, " 第2次 =", second);
    expect([first, second]).toEqual([3, 11]);
    // 标准 SM-2 的前两步固定是 1、6
  });

  it("偏离 5：mastered 的判据是「rating=4 且 reviewCount>=4」，标准 SM-2 无此概念", () => {
    const card = { ...makeWordCard("w1"), status: "review" as const };
    const at = (reviewCount: number) =>
      applyReview(
        makeTestData({ cards: [card], schedules: [makeSchedule({ cardId: "w1", reviewCount })] }),
        card,
        "spelling",
        4
      );
    expect(at(3).cards[0].status).toBe("mastered");
    expect(at(2).cards[0].status).toBe("review");
  });
});

describe("SM2-e 【已修 2026-09-21】乘法链现在有上限", () => {
  /**
   * 标准 SM-2 的 I(n) = round(I(n-1) * EF) 无上限，Anki 用「最大间隔」兜底。
   * 本项目此前也没有上限，于是「连续 rating4 十四次」直接撞 Date 的合法范围
   * （see sm1 的 P0：第 14 次抛 RangeError，卡死在复习页）。
   * 现在 reviewService 加了 MAX_INTERVAL_DAYS = 3650（10 年），
   * `addDays` 与两个放大分支都过 clamp。
   */
  it("连续 rating4：间隔在第 6 次起被夹在上限，序列不再指数爆炸", () => {
    let data = makeTestData({
      cards: [{ ...makeWordCard("w1"), status: "review" as const }],
      schedules: [makeSchedule({ cardId: "w1", easeFactor: 2.5, intervalDays: 0 })]
    });
    const intervals: number[] = [];
    for (let i = 0; i < 13; i += 1) {
      data = applyReview(data, data.cards[0], "spelling", 4);
      intervals.push(data.schedules[0].intervalDays);
    }
    // 前 6 次仍按几何增长（2667 仍在上限内），第 7 次起被夹住
    expect(intervals.slice(0, 6)).toEqual([3, 11, 41, 159, 641, 2667]);
    expect(intervals.slice(6), "第 7 次起全部停在上限").toEqual(Array(7).fill(MAX_INTERVAL_DAYS));
    // 到期年份也必须落在合理范围内（修复前是公元 159462 年）
    const year = new Date(data.schedules[0].nextReviewAt).getUTCFullYear();
    expect(year, "到期年份应在 10 年上限内").toBeLessThan(new Date().getUTCFullYear() + 11);
  });

  it("Anki 式「最大间隔 36500 天（100 年）」若存在，则第 13 次应被夹到 36500", () => {
    // 仅作为修复建议的对照计算，不依赖产品代码
    const capped = Math.min(57502407, 36500);
    expect(capped).toBe(36500);
  });
});
