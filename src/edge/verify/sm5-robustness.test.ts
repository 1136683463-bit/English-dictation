/**
 * SM-2 审计 · 第 5 条：数据健壮性。
 *
 * 覆盖：schedule 字段缺失 / 为 0 / 为负 / 为 NaN / 为 Infinity / 超界大数，
 * 以及 normalizeSchedules 的补齐与清洗是否覆盖全部缺失形态。
 */
import { describe, expect, it } from "vitest";
import { applyReview, createInitialSchedule, getDueCards } from "../../services/reviewService";
import { listDueGrammarReviewCards } from "../../services/grammarReviewService";
import { migrateData, parseBackupJson } from "../../services/storage";
import { makeAppData, makeSentenceCard, PAST_ISO } from "./fixtures";
import { makeWordCard } from "../../services/testUtils";
import type { AppData, Card, Schedule } from "../../types";

/**
 * normalizeSchedules 未导出，只能经 migrateData 管线触达。
 * 这里用 makeAppData 保证顶层键可识别，再把 schedules 换成待测原始值。
 * 注意 normalizeCard 会丢掉 front/back 都为空的卡，所以探针卡必须给 front。
 */
const probeCard = (id: string) => ({
  id,
  type: "word",
  front: `word-${id}`,
  back: `释义-${id}`,
  note: "",
  tags: [],
  status: "review",
  priority: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
});

const normalizeSchedulesProbe = (rawSchedules: unknown, cards: Array<{ id: string }>): Schedule[] => {
  const shaped = makeAppData({
    cards: cards.map((card) => probeCard(card.id)) as never,
    schedules: rawSchedules as never
  });
  return parseBackupJson(JSON.stringify(shaped)).schedules;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const wordCard = (id: string): Card => ({ ...makeWordCard(id, id, id), status: "review" });

const scheduleRaw = (patch: Record<string, unknown>) =>
  ({ cardId: "c1", easeFactor: 2.5, intervalDays: 1, reviewCount: 1, lapseCount: 0, nextReviewAt: PAST_ISO, ...patch }) as unknown as Schedule;

const applyOn = (schedule: Schedule | undefined, rating: 1 | 2 | 3 | 4, card?: Card) => {
  const target = card ?? wordCard("c1");
  const data: AppData = {
    ...makeAppData({
      cards: [target],
      schedules: schedule ? [schedule] : [],
      seededWordVersions: ["core-100-v1"]
    })
  };
  return applyReview(data, target, "spelling", rating);
};

describe("SM5-a createInitialSchedule 的初始值", () => {
  it("ease=2.5 / interval=0 / reviewCount=0 / lapseCount=0 / nextReviewAt=now（立即可排期）", () => {
    const schedule = createInitialSchedule("c1");
    expect(schedule.easeFactor).toBe(2.5);
    expect(schedule.intervalDays).toBe(0);
    expect(schedule.reviewCount).toBe(0);
    expect(schedule.lapseCount).toBe(0);
    expect(Math.abs(new Date(schedule.nextReviewAt).getTime() - Date.now())).toBeLessThan(1000);
    expect(schedule.recoveryCount).toBeUndefined();
  });
});

describe("SM5-b applyReview 在缺失/异常 schedule 上的行为", () => {
  it("完全没有 schedule 时用 createInitialSchedule 兜底，不抛错", () => {
    const out = applyOn(undefined, 4);
    expect(out.schedules).toHaveLength(1);
    expect(out.schedules[0].reviewCount).toBe(1);
    // intervalDays 初始 0 → (0||1)*2.62*1.3 = 3.406 → round 3
    expect(out.schedules[0].intervalDays).toBe(3);
  });

  it("intervalDays = NaN：`|| 1` 兜住，四个分支都不产生 NaN", () => {
    for (const rating of [1, 2, 3, 4] as const) {
      const out = applyOn(scheduleRaw({ intervalDays: NaN }), rating);
      expect(Number.isFinite(out.schedules[0].intervalDays), `rating=${rating}`).toBe(true);
      expect(Number.isNaN(new Date(out.schedules[0].nextReviewAt).getTime()), `rating=${rating}`).toBe(false);
    }
  });

  it("intervalDays 为负：Math.max 兜住，不产生负间隔", () => {
    for (const rating of [1, 2, 3, 4] as const) {
      const out = applyOn(scheduleRaw({ intervalDays: -100 }), rating);
      expect(out.schedules[0].intervalDays, `rating=${rating}`).toBeGreaterThanOrEqual(0);
    }
  });

  /**
   * 【已修 2026-09-21】easeFactor = NaN：`Math.max(1.3, NaN - 0.25)` 仍是 NaN，
   * 会把 NaN 传进 intervalDays，rating3/4 的 addDays 随即抛 RangeError。
   * 现在 applyReview 入口对 easeFactor / lapseCount 各做一次有限性校验
   * （非有限值落到默认 2.5 / 0），与 normalizeSchedules 的持久化路径口径一致。
   */
  it("[已修] easeFactor = NaN：四个分支全部安全，且 NaN 被清掉不留毒", () => {
    for (const rating of [1, 2, 3, 4] as const) {
      let out: AppData | undefined;
      expect(() => {
        out = applyOn(scheduleRaw({ easeFactor: NaN }), rating);
      }, `rating=${rating} 不应抛错`).not.toThrow();
      const schedule = out!.schedules[0];
      expect(Number.isFinite(schedule.easeFactor), `rating=${rating} 的 ease 应为有限数`).toBe(true);
      expect(Number.isFinite(schedule.intervalDays), `rating=${rating} 的间隔应为有限数`).toBe(true);
      expect(
        Number.isNaN(new Date(schedule.nextReviewAt).getTime()),
        `rating=${rating} 的到期时间应可解析`
      ).toBe(false);
    }
  });

  /**
   * 【已修 2026-09-21】easeFactor = 1e308 这类「有限但荒谬」的值：
   * `round(5 * 1e308)` 溢出成 Infinity，clampIntervalDays 把非有限数按 0 处理后
   * 再被 Math.max(1, …) 抬到 1 天——不再抛 RangeError。
   */
  it("[已修] easeFactor = 1e308（有限但荒谬）→ 不再抛错，间隔被拉回合理范围", () => {
    const out = scheduleRaw({ easeFactor: 1e308, intervalDays: 5 });
    expect(() => applyOn(out, 3)).not.toThrow();
    const after = applyOn(out, 3);
    expect(Number.isFinite(after.schedules[0].intervalDays)).toBe(true);
    expect(after.schedules[0].intervalDays).toBeLessThanOrEqual(3650);
    // rating4 仍安全（min(3.2,...) 先夹住）
    const safe = applyOn(out, 4);
    expect(Number.isFinite(safe.schedules[0].intervalDays)).toBe(true);
  });

  it("lapseCount = NaN：现在会被清洗成 0 并正常累加（不再留 NaN）", () => {
    /**
     * 修复前：`NaN + 1 = NaN` 原样落盘，且 NaN >= 3 为 false 使自动置位失效。
     * 现在 applyReview 入口对 lapseCount 也做有限性校验（非有限 → 0）。
     */
    const out = applyOn(scheduleRaw({ lapseCount: NaN }), 1);
    expect(out.cards[0].priority).toBe(false);
    expect(out.schedules[0].lapseCount, "应被清洗为 0 再加 1").toBe(1);
  });

  it("reviewCount = NaN → 不误判 mastered（NaN >= 4 为 false）", () => {
    const out = applyOn(scheduleRaw({ reviewCount: NaN }), 4);
    expect(out.cards[0].status).toBe("review");
    expect(Number.isNaN(out.schedules[0].reviewCount)).toBe(true);
  });
});

describe("SM5-c normalizeSchedules 的清洗覆盖面", () => {
  it("补齐：缺 schedule 的卡自动获得一条（intervalDays=0、nextReviewAt=now）", () => {
    const migrated = normalizeSchedulesProbe([], [{ id: "c1" }]);
    expect(migrated).toHaveLength(1);
    expect(migrated[0]).toMatchObject({ cardId: "c1", easeFactor: 2.5, intervalDays: 0, reviewCount: 0, lapseCount: 0 });
  });

  it("清洗：NaN / Infinity / 负值 / 非法日期 全部被替换为安全值（对象直传路径 = 真实 saveData 路径）", () => {
    // saveData() 传的是**对象**（不是 JSON 字符串），NaN/Infinity 是真实数值，不会被 JSON 转成 null。
    const migrated = migrateData(
      makeAppData({
        cards: [probeCard("c1"), probeCard("c2"), probeCard("c3")] as never,
        schedules: [
          { cardId: "c1", easeFactor: NaN, intervalDays: NaN, reviewCount: NaN, lapseCount: NaN, nextReviewAt: "not-a-date" },
          { cardId: "c2", easeFactor: Infinity, intervalDays: -5, reviewCount: -3, lapseCount: -1, nextReviewAt: "" },
          { cardId: "c3", easeFactor: "2.5", intervalDays: "3", reviewCount: "2", lapseCount: "1", nextReviewAt: PAST_ISO }
        ] as never
      })
    );
    const byId = new Map(migrated.schedules.map((item) => [item.cardId, item]));
    console.log("SM5-c 对象直传清洗结果:", JSON.stringify(migrated.schedules));

    // NaN / Infinity 都走 asNumber 的 fallback 2.5（不是 1.3）
    expect(byId.get("c1")).toMatchObject({ easeFactor: 2.5, intervalDays: 0, reviewCount: 0, lapseCount: 0 });
    expect(Number.isNaN(new Date(byId.get("c1")!.nextReviewAt).getTime())).toBe(false);
    expect(byId.get("c2")).toMatchObject({ easeFactor: 2.5, intervalDays: 0, reviewCount: 0, lapseCount: 0 });
    expect(Number.isNaN(new Date(byId.get("c2")!.nextReviewAt).getTime())).toBe(false);
    expect(byId.get("c3")).toMatchObject({ easeFactor: 2.5, intervalDays: 3, reviewCount: 2, lapseCount: 1 });
  });

  /**
   * 补充发现：JSON 备份路径下 NaN/Infinity 在序列化时变 null，
   * 而 asNumber(null, 2.5) → Number(null) = 0（有限）→ 返回 0，再被 Math.max(1.3, 0) 抬到 1.3。
   * 同一份「坏 ease」在两条路径上得到不同修复值（2.5 vs 1.3），
   * 但都落在合法区间内，无功能后果 —— 属「口径不齐但无害」。
   */
  it("[信息性] JSON 路径下 NaN/Infinity 序列化为 null → 被修成 1.3（与对象路径的 2.5 不同但都合法）", () => {
    const cleaned = normalizeSchedulesProbe(
      [
        { cardId: "c1", easeFactor: NaN, intervalDays: 0, reviewCount: 0, lapseCount: 0, nextReviewAt: PAST_ISO },
        { cardId: "c2", easeFactor: Infinity, intervalDays: 0, reviewCount: 0, lapseCount: 0, nextReviewAt: PAST_ISO }
      ],
      [{ id: "c1" }, { id: "c2" }]
    );
    const byId = new Map(cleaned.map((item) => [item.cardId, item]));
    console.log("SM5-c JSON 路径清洗结果:", JSON.stringify(cleaned));
    expect(byId.get("c1")!.easeFactor).toBe(1.3);
    expect(byId.get("c2")!.easeFactor).toBe(1.3);
  });

  /**
   * 【确认的缺口 · P2】normalizeSchedules 有下限（1.3 / 0）但**没有上限**。
   * 手工改坏的 JSON（或未来某个 bug 产生的）intervalDays=1e9 会被原样保留，
   * 下一次 rating3/4 直接 RangeError；easeFactor=1e308 同理。
   */
  it("[P2] 清洗缺口：intervalDays / easeFactor 无上限，超界值原样通过", () => {
    const cleaned = normalizeSchedulesProbe(
      [
        { cardId: "c1", easeFactor: 1e308, intervalDays: 1e9, reviewCount: 1, lapseCount: 0, nextReviewAt: PAST_ISO },
        { cardId: "c2", easeFactor: 999, intervalDays: 5, reviewCount: 1, lapseCount: 0, nextReviewAt: PAST_ISO }
      ],
      [{ id: "c1" }, { id: "c2" }]
    );
    const byId = new Map(cleaned.map((item) => [item.cardId, item]));
    console.log(
      "SM5-c 超界值通过情况: c1.intervalDays =", byId.get("c1")!.intervalDays,
      " c1.easeFactor =", byId.get("c1")!.easeFactor,
      " c2.easeFactor =", byId.get("c2")!.easeFactor
    );
    expect(byId.get("c1")!.intervalDays).toBe(1e9);
    expect(byId.get("c1")!.easeFactor).toBe(1e308);
    expect(byId.get("c2")!.easeFactor).toBe(999); // > 3.2 也未被夹住
  });

  it("duplicate cardId 只保留第一条；孤儿 schedule 被丢弃", () => {
    const cleaned = normalizeSchedulesProbe(
      [
        { cardId: "c1", intervalDays: 5, nextReviewAt: PAST_ISO },
        { cardId: "c1", intervalDays: 99, nextReviewAt: PAST_ISO },
        { cardId: "ghost", intervalDays: 1, nextReviewAt: PAST_ISO }
      ],
      [{ id: "c1" }]
    );
    expect(cleaned).toHaveLength(1);
    expect(cleaned[0].intervalDays).toBe(5);
  });

  it("非数组 / 非对象元素：不炸，转为补齐默认", () => {
    expect(normalizeSchedulesProbe(null, [{ id: "c1" }])).toHaveLength(1);
    expect(normalizeSchedulesProbe("garbage", [{ id: "c1" }])).toHaveLength(1);
    expect(normalizeSchedulesProbe([1, "x", null], [{ id: "c1" }])).toHaveLength(1);
  });
});

describe("SM5-d 异常排期对到期队列的影响（静默隐身 vs 崩溃）", () => {
  it("nextReviewAt 非法字符串（未归一化路径）→ 卡永久不出现在到期队列（静默隐身）", () => {
    const data = makeAppData({
      cards: [wordCard("c1")],
      schedules: [scheduleRaw({ nextReviewAt: "not-a-date" })]
    });
    const due = getDueCards(data);
    console.log("SM5-d 非法 nextReviewAt 的到期数:", due.length);
    expect(due).toHaveLength(0); // NaN 比较恒 false → 永不"到期"
  });

  it("nextReviewAt 为空串同样永不「到期」", () => {
    const data = makeAppData({ cards: [wordCard("c1")], schedules: [scheduleRaw({ nextReviewAt: "" })] });
    expect(getDueCards(data)).toHaveLength(0);
  });

  it("经迁移管线（parseBackupJson）后非法日期被改为 now → 恢复为到期", () => {
    const raw = makeAppData({
      cards: [wordCard("c1")],
      schedules: [scheduleRaw({ nextReviewAt: "not-a-date" })]
    });
    const migrated = parseBackupJson(JSON.stringify(raw));
    const due = getDueCards(migrated);
    console.log("SM5-d 迁移后到期数:", due.length, " nextReviewAt:", migrated.schedules[0].nextReviewAt);
    expect(due).toHaveLength(1);
  });

  it("语法复习：intervalDays=0 即使已到期也不出题（设计口径）", () => {
    const fixture = makeSentenceCard({ id: "g1", sentence: "I am happy.", schedule: { intervalDays: 0 } });
    const data = makeAppData({ cards: [fixture.card], schedules: [fixture.schedule!] });
    expect(listDueGrammarReviewCards(data)).toHaveLength(0);
  });

  it("语法复习：intervalDays 缺失（undefined）走 `?? 0` → 不出题，不抛错", () => {
    const fixture = makeSentenceCard({ id: "g1", sentence: "I am happy." });
    const broken = { ...fixture.schedule!, intervalDays: undefined as unknown as number };
    const data = makeAppData({ cards: [fixture.card], schedules: [broken] });
    expect(() => listDueGrammarReviewCards(data)).not.toThrow();
    expect(listDueGrammarReviewCards(data)).toHaveLength(0);
  });

  it("语法复习：lapseCount 为 NaN → 排序把 NaN 当「不小于」处理，可能压过真实大 lapse", () => {
    const a = makeSentenceCard({ id: "a", sentence: "A.", sourceId: "s1", schedule: { lapseCount: NaN } });
    const b = makeSentenceCard({ id: "b", sentence: "B.", sourceId: "s2", schedule: { lapseCount: 5 } });
    const data = makeAppData({ cards: [a.card, b.card], schedules: [a.schedule!, b.schedule!] });
    const order = listDueGrammarReviewCards(data).map((item) => item.card.id);
    console.log("SM5-d lapseCount=NaN 时的排序:", JSON.stringify(order));
    // NaN 参与减法的结果是 NaN，`lapseDelta !== 0` 为 true → 直接返回 NaN；
    // 依赖 V8 的 TimSort 实现，NaN 会被当作「不小于」— 5 张卡的卡被排到 NaN 卡之前。
    expect(order).toEqual(["a", "b"]);
  });
});
