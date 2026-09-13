import { describe, expect, it } from "vitest";
import {
  buildDueForecastAdvice,
  buildMasteredMilestone,
  computeHealthScore,
  computeHealthScoreBreakdown,
  computeStreak,
  computeStreakWithGrace,
  getDueForecast,
  getHealthTone,
  getMaturityBucket,
  getMaturityDistribution,
  getWeeklyStatsReport,
  HEALTH_SCORE_THRESHOLDS,
  WEAK_WORD_PENALTY
} from "./statsService";
import { makeCard, makeReview, makeTestData, makeWordCard } from "./testUtils";

describe("statsService", () => {
  it("builds weekly trends and suggestions from review history", () => {
    const card = { ...makeWordCard("card_1"), status: "review" as const };
    const data = makeTestData({
      cards: [card],
      schedules: [
        {
          cardId: "card_1",
          easeFactor: 2.5,
          intervalDays: 1,
          reviewCount: 2,
          lapseCount: 1,
          nextReviewAt: "2026-06-20T00:00:00.000Z"
        }
      ],
      reviews: [
        {
          id: "review_1",
          cardId: "card_1",
          mode: "spelling",
          rating: 1,
          answer: "aproach",
          diffJson: "[]",
          reviewedAt: "2026-06-18T08:00:00.000Z"
        },
        {
          id: "review_2",
          cardId: "card_1",
          mode: "spelling",
          rating: 4,
          answer: "approach",
          diffJson: "[]",
          reviewedAt: "2026-06-18T09:00:00.000Z"
        }
      ]
    });

    const report = getWeeklyStatsReport(data, new Date("2026-06-18T12:00:00.000Z"));

    expect(report.weekReviewCount).toBe(2);
    expect(report.spellingAccuracy).toBe(50);
    expect(report.mostWrongWords[0].card.id).toBe("card_1");
    expect(report.sevenDayTrend.some((day) => day.reviews === 2)).toBe(true);
  });
});

describe("computeHealthScore", () => {
  const baseInput = {
    hasActivity: true,
    goalCompletionPercent: 100,
    spellingAccuracy: 100,
    dueTotal: 0,
    dueReviewGoal: 30,
    weakWords: 0
  };

  it("全维度满分时返回 100", () => {
    expect(computeHealthScore(baseInput)).toBe(100);
  });

  it("无学习活动时返回 null（0 数据用户不产出分数）", () => {
    expect(computeHealthScore({ ...baseInput, hasActivity: false })).toBeNull();
  });

  it("拼写无数据（null）时该维度剔除，不按 100 分兜底", () => {
    // 其余维度全 0 分、拼写无数据：旧版按 100 兜底会得 25 分，新版应为 0
    expect(
      computeHealthScore({
        hasActivity: true,
        goalCompletionPercent: 0,
        spellingAccuracy: null,
        dueTotal: 30,
        dueReviewGoal: 30,
        weakWords: 13
      })
    ).toBe(0);
  });

  it("拼写无数据且其余维度满分时返回 100（重归一化）", () => {
    expect(computeHealthScore({ ...baseInput, spellingAccuracy: null })).toBe(100);
  });

  it("dueReviewGoal 未配置（0）时到期维度剔除，任何到期量不影响得分", () => {
    expect(
      computeHealthScore({ ...baseInput, dueReviewGoal: 0, dueTotal: 50 })
    ).toBe(100);
  });

  it("到期量达到每日上限时到期维度得 0 分", () => {
    // 到期维度 0 分：100*0.35 + 100*0.25 + 0*0.25 + 100*0.15 = 75
    expect(computeHealthScore({ ...baseInput, dueTotal: 30 })).toBe(75);
  });

  it("薄弱词按每词 8 分惩罚，13 个即清零该维度", () => {
    const penaltyUnit = Math.ceil(100 / WEAK_WORD_PENALTY); // 13
    // 薄弱维度 0 分：100*0.35 + 100*0.25 + 100*0.25 + 0*0.15 = 85
    expect(computeHealthScore({ ...baseInput, weakWords: penaltyUnit })).toBe(85);
  });

  it("各维度极值混合时按权重加权并取整", () => {
    // 目标 50*0.35=17.5 + 拼写 80*0.25=20 + 到期(1-15/30)*100=50*0.25=12.5 + 薄弱(100-5*8)=60*0.15=9 → 59
    expect(
      computeHealthScore({
        hasActivity: true,
        goalCompletionPercent: 50,
        spellingAccuracy: 80,
        dueTotal: 15,
        dueReviewGoal: 30,
        weakWords: 5
      })
    ).toBe(59);
  });
});

describe("getHealthTone", () => {
  it("按 82/62 阈值分档", () => {
    expect(getHealthTone(HEALTH_SCORE_THRESHOLDS.good)).toBe("good");
    expect(getHealthTone(HEALTH_SCORE_THRESHOLDS.good - 1)).toBe("steady");
    expect(getHealthTone(HEALTH_SCORE_THRESHOLDS.steady)).toBe("steady");
    expect(getHealthTone(HEALTH_SCORE_THRESHOLDS.steady - 1)).toBe("attention");
  });
});

describe("getWeeklyStatsReport 口径统一（R4）", () => {
  // 2026-06-15 是周一，2026-06-21 是周日（自然周 6/15-6/21）
  const monday = new Date("2026-06-15T10:00:00");
  const sunday = new Date("2026-06-21T10:00:00");

  it("周报口径为自然周：周一与周日看到同一 weekRangeLabel", () => {
    const data = makeTestData();
    expect(getWeeklyStatsReport(data, monday).weekRangeLabel).toBe("6/15-6/21");
    expect(getWeeklyStatsReport(data, sunday).weekRangeLabel).toBe("6/15-6/21");
  });

  it("目标量按本周已过天数累计：周一=1 天，周日=7 天", () => {
    const data = makeTestData({ settings: { dailyReviewLimit: 30 } });
    const mondayReport = getWeeklyStatsReport(data, monday);
    const sundayReport = getWeeklyStatsReport(data, sunday);
    expect(mondayReport.goalProgress[0].target).toBe(30);
    expect(sundayReport.goalProgress[0].target).toBe(210);
  });

  it("句子目标按 cardId 去重：同一张句卡一天练 2 次只计 1", () => {
    const sentence = makeCard({ id: "s1", type: "sentence", front: "A sentence.", status: "review" });
    const data = makeTestData({
      cards: [sentence],
      reviews: [
        makeReview({ id: "r1", cardId: "s1", mode: "recall", reviewedAt: "2026-06-15T09:00:00" }),
        makeReview({ id: "r2", cardId: "s1", mode: "recall", reviewedAt: "2026-06-15T18:00:00" })
      ]
    });

    const report = getWeeklyStatsReport(data, monday);
    expect(report.goalProgress.find((goal) => goal.label === "句子")?.current).toBe(1);
  });

  it("未配置（target=0）的子目标不参与目标完成度平均", () => {
    // dailySentences=0 → 句子目标剔除；复习 30/30=100%，新词 1/10=10% → 平均 55（旧版会被句子 0% 拖成 37）
    const word = { ...makeWordCard("w1"), status: "review" as const };
    const data = makeTestData({
      settings: { dailyReviewLimit: 30, dailyNewWords: 10, dailySentences: 0 },
      cards: [word],
      reviews: Array.from({ length: 30 }, (_, index) =>
        makeReview({ id: `r${index}`, cardId: "w1", mode: "recall", reviewedAt: "2026-06-15T09:00:00" })
      )
    });

    expect(getWeeklyStatsReport(data, monday).goalCompletionPercent).toBe(55);
  });

  it("新词口径统一为首次复习时间：上周创建的卡本周首评计入本周新词", () => {
    const word = { ...makeWordCard("w1"), status: "review" as const, createdAt: "2026-06-08T09:00:00" };
    const data = makeTestData({
      cards: [word],
      reviews: [makeReview({ id: "r1", cardId: "w1", reviewedAt: "2026-06-16T09:00:00" })]
    });

    expect(getWeeklyStatsReport(data, monday).weekFirstReviewedWords).toBe(1);
  });

  it("无效日期的复习记录不会让该卡永远算不了新词", () => {
    const word = { ...makeWordCard("w1"), status: "review" as const };
    const data = makeTestData({
      cards: [word],
      reviews: [
        makeReview({ id: "r_bad", cardId: "w1", reviewedAt: "not-a-date" }),
        makeReview({ id: "r_ok", cardId: "w1", reviewedAt: "2026-06-16T09:00:00" })
      ]
    });

    expect(getWeeklyStatsReport(data, monday).weekFirstReviewedWords).toBe(1);
  });
});

describe("computeStreak 边界（R8）", () => {
  const at = (iso: string) => ({ reviewedAt: iso });

  it("无复习记录返回 0", () => {
    expect(computeStreak([], new Date("2026-09-13T12:00:00"))).toBe(0);
  });

  it("仅今天有记录返回 1", () => {
    expect(
      computeStreak([at("2026-09-13T08:00:00")], new Date("2026-09-13T12:00:00"))
    ).toBe(1);
  });

  it("今天+昨天连续，前天断档返回 2", () => {
    expect(
      computeStreak(
        [at("2026-09-13T08:00:00"), at("2026-09-12T09:00:00"), at("2026-09-10T09:00:00")],
        new Date("2026-09-13T12:00:00")
      )
    ).toBe(2);
  });

  it("今天没学但从昨天起连续，宽限计入返回 2", () => {
    expect(
      computeStreak(
        [at("2026-09-12T09:00:00"), at("2026-09-11T09:00:00")],
        new Date("2026-09-13T12:00:00")
      )
    ).toBe(2);
  });

  it("今天没学且昨天也没学，streak 清零", () => {
    expect(
      computeStreak(
        [at("2026-09-11T09:00:00"), at("2026-09-10T09:00:00")],
        new Date("2026-09-13T12:00:00")
      )
    ).toBe(0);
  });

  it("跨月连续正确累计（8/30 - 9/1 → 3）", () => {
    expect(
      computeStreak(
        [at("2026-09-01T08:00:00"), at("2026-08-31T09:00:00"), at("2026-08-30T09:00:00")],
        new Date("2026-09-01T12:00:00")
      )
    ).toBe(3);
  });

  it("同一天多条记录只算一天", () => {
    expect(
      computeStreak(
        [at("2026-09-13T08:00:00"), at("2026-09-13T20:00:00"), at("2026-09-12T09:00:00")],
        new Date("2026-09-13T22:00:00")
      )
    ).toBe(2);
  });
});

describe("computeStreakWithGrace 每周宽限（R7 逻辑层）", () => {
  const at = (iso: string) => ({ reviewedAt: iso });
  // 2026-09-13 是周日；当前自然周 = 9/7(周一) ~ 9/13(周日)
  const NOW = new Date("2026-09-13T12:00:00");

  it("streak 只计学习日；历史起点自然终止不耗宽限", () => {
    // 9/13-9/11 学习 = 3 天；更早无任何记录 → 起点自然结束，不消耗本周宽限
    expect(
      computeStreakWithGrace(
        [at("2026-09-13T08:00:00"), at("2026-09-12T09:00:00"), at("2026-09-11T09:00:00")],
        NOW
      )
    ).toEqual({ streak: 3, graceUsedThisWeek: false });
  });

  it("本周漏 1 天不断签：宽限桥接，streak 为实际学习天数", () => {
    // 9/11 漏学消耗宽限；学习日为 13/12/10 共 3 天
    expect(
      computeStreakWithGrace(
        [at("2026-09-13T08:00:00"), at("2026-09-12T09:00:00"), at("2026-09-10T09:00:00")],
        NOW
      )
    ).toEqual({ streak: 3, graceUsedThisWeek: true });
  });

  it("同周漏第 2 天断签：只剩断签点之后的学习日", () => {
    // 9/13 学习；9/12 宽限；9/11 第 2 漏 → 断签，9/10 及以前不计
    expect(
      computeStreakWithGrace(
        [at("2026-09-13T08:00:00"), at("2026-09-10T09:00:00")],
        NOW
      )
    ).toEqual({ streak: 1, graceUsedThisWeek: true });
  });

  it("上周宽限不影响本周状态（跨周重置）", () => {
    // 本周 9/7-9/13 全勤 7 天；上周 9/6 漏学消耗上周宽限；9/5、9/4 学习
    // 9/3 与 9/6 同属周 8/31-9/6，是该周第 2 个漏学日 → 断签
    const reviews = [
      "2026-09-13", "2026-09-12", "2026-09-11", "2026-09-10",
      "2026-09-09", "2026-09-08", "2026-09-07",
      "2026-09-05", "2026-09-04"
    ].map((d) => at(`${d}T09:00:00`));
    expect(computeStreakWithGrace(reviews, NOW)).toEqual({ streak: 9, graceUsedThisWeek: false });
  });

  it("今天在途不算漏学：从昨天起算且不耗本周宽限", () => {
    // 今天(9/13)没学；9/7-9/12 全勤 6 天；9/6 消耗上周宽限；9/5 学习；9/4 是上周第 2 漏 → 断签
    const reviews = [
      "2026-09-12", "2026-09-11", "2026-09-10",
      "2026-09-09", "2026-09-08", "2026-09-07",
      "2026-09-05"
    ].map((d) => at(`${d}T09:00:00`));
    expect(computeStreakWithGrace(reviews, NOW)).toEqual({ streak: 7, graceUsedThisWeek: false });
  });

  it("今天昨天都没学直接归零（宽限救不了两天以上的空窗）", () => {
    expect(
      computeStreakWithGrace([at("2026-09-11T09:00:00")], NOW)
    ).toEqual({ streak: 0, graceUsedThisWeek: false });
  });

  it("跨月连续：月初视角回退到上月末，历史周宽限正常消耗", () => {
    // now = 9/1(周二)，当前周 = 8/31-9/6；8/29 漏学属上周(8/24-8/30)，消耗上周宽限
    // 学习日 9/1、8/31、8/30 共 3 天；8/28 是上周第 2 漏 → 断签
    expect(
      computeStreakWithGrace(
        [at("2026-09-01T08:00:00"), at("2026-08-31T09:00:00"), at("2026-08-30T09:00:00")],
        new Date("2026-09-01T12:00:00")
      )
    ).toEqual({ streak: 3, graceUsedThisWeek: false });
  });

  it("无记录返回 0", () => {
    expect(computeStreakWithGrace([], NOW)).toEqual({ streak: 0, graceUsedThisWeek: false });
  });
});

describe("computeHealthScoreBreakdown 可解释化（R11）", () => {
  // 各维度得分：目标 80 / 拼写 60 / 到期负载 100-50=50 / 薄弱词 100-16=84
  const baseInput = {
    hasActivity: true,
    goalCompletionPercent: 80,
    spellingAccuracy: 60,
    dueTotal: 5,
    dueReviewGoal: 10,
    weakWords: 2
  };

  it("各维度贡献加权和与总分一致，且与 computeHealthScore 同源", () => {
    const breakdown = computeHealthScoreBreakdown(baseInput)!;
    const contributionSum = breakdown.dimensions.reduce((sum, d) => sum + d.contribution, 0);
    expect(Math.round(contributionSum)).toBe(breakdown.total);
    expect(breakdown.total).toBe(computeHealthScore(baseInput));
    // 28 + 15 + 12.5 + 12.6 = 68.1 → 68
    expect(breakdown.total).toBe(68);
  });

  it("无数据维度标记未参与计算，有效权重重归一", () => {
    const input = { ...baseInput, spellingAccuracy: null, dueReviewGoal: 0 };
    const breakdown = computeHealthScoreBreakdown(input)!;
    const spelling = breakdown.dimensions.find((d) => d.key === "spelling")!;
    expect(spelling.available).toBe(false);
    expect(spelling.score).toBeNull();
    expect(spelling.contribution).toBe(0);
    expect(spelling.effectiveWeight).toBe(0);
    const dueLoad = breakdown.dimensions.find((d) => d.key === "dueLoad")!;
    expect(dueLoad.available).toBe(false);
    const goal = breakdown.dimensions.find((d) => d.key === "goalCompletion")!;
    // 剩余权重 0.35 + 0.15 = 0.5 → 目标完成有效权重 0.7
    expect(goal.effectiveWeight).toBeCloseTo(0.7, 5);
    expect(breakdown.total).toBe(computeHealthScore(input));
  });

  it("topLever 指向得分最低的可用维度（到期负载 50 分）", () => {
    const breakdown = computeHealthScoreBreakdown(baseInput)!;
    expect(breakdown.topLever).toContain("到期");
  });

  it("hasActivity 为 false 返回 null", () => {
    expect(computeHealthScoreBreakdown({ ...baseInput, hasActivity: false })).toBeNull();
  });
});

describe("getDueForecast 到期负载预测（R9）", () => {
  const NOW = new Date("2026-09-13T12:00:00"); // 周日
  const at = (offsetDays: number, hour = 9) => {
    const d = new Date("2026-09-13T00:00:00");
    d.setDate(d.getDate() + offsetDays);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };
  const scheduleFor = (cardId: string, nextReviewAt: string) => ({
    cardId,
    nextReviewAt,
    dueAt: nextReviewAt,
    intervalDays: 3,
    easeFactor: 2.5,
    repetitions: 2,
    lapseCount: 0,
    reviewCount: 2,
    lastReviewedAt: at(-1)
  });

  it("逐日计数与 schedules 手工核对一致（验收①）", () => {
    const cards = [makeWordCard("c1"), makeWordCard("c2"), makeWordCard("c3"), makeWordCard("c4"), makeWordCard("c5")];
    cards[4] = { ...cards[4], status: "suspended" as const };
    const data = makeTestData({
      cards,
      schedules: [
        scheduleFor("c1", at(1)),        // 明天
        scheduleFor("c2", at(1, 18)),    // 明天（晚间，同天）
        scheduleFor("c3", at(5)),        // +5 天
        scheduleFor("c4", at(0, 8)),     // 今天（已到期，不进预测窗）
        scheduleFor("c5", at(2)),        // suspended 不计
        scheduleFor("c1", at(20))        // 窗口外（会被 c1 覆盖？不——同一卡两条 schedule 属异常数据，但窗口外应过滤）
      ],
      reviews: []
    });
    const forecast = getDueForecast(data, 14, NOW);
    expect(forecast).toHaveLength(14);
    expect(forecast[0].count).toBe(2);  // 明天：c1 + c2（c1 的 +20 天那条在窗外）
    expect(forecast[0].label).toBe("周一");
    expect(forecast[4].count).toBe(1);  // +5 天：c3
    expect(forecast[1].count).toBe(0);  // +2 天：只有 suspended 的 c5
    expect(forecast.reduce((sum, d) => sum + d.count, 0)).toBe(3);
  });

  it("窗口边界：明天 00:00 计入，第 15 天 00:00 不计", () => {
    const cards = [makeWordCard("c1"), makeWordCard("c2")];
    const data = makeTestData({
      cards,
      schedules: [
        scheduleFor("c1", at(1, 0)),
        scheduleFor("c2", at(15, 0))
      ],
      reviews: []
    });
    const forecast = getDueForecast(data, 14, NOW);
    expect(forecast[0].count).toBe(1);
    expect(forecast.reduce((sum, d) => sum + d.count, 0)).toBe(1);
  });

  it("无效日期防御：不抛错且不计数", () => {
    const data = makeTestData({
      cards: [makeWordCard("c1")],
      schedules: [scheduleFor("c1", "not-a-date")],
      reviews: []
    });
    const forecast = getDueForecast(data, 14, NOW);
    expect(forecast.reduce((sum, d) => sum + d.count, 0)).toBe(0);
  });
});

describe("buildDueForecastAdvice（R9 验收②③）", () => {
  const day = (label: string, shortDate: string, count: number) => ({
    dateKey: shortDate,
    label,
    shortDate,
    count
  });

  it("峰值日超过每日目标 → 行动建议含日期与提前清理量", () => {
    const forecast = [day("周一", "9/14", 5), day("周三", "9/16", 32), day("周四", "9/17", 3)];
    const advice = buildDueForecastAdvice(forecast, 20)!;
    expect(advice).toContain("周三");
    expect(advice).toContain("32");
    expect(advice).toContain("12"); // 32 - 20
  });

  it("空到期 → 正向文案", () => {
    const forecast = [day("周一", "9/14", 0), day("周二", "9/15", 0)];
    expect(buildDueForecastAdvice(forecast, 20)).toContain("没有到期压力");
  });

  it("未超目标且非空 → 不打扰（null）", () => {
    const forecast = [day("周一", "9/14", 10), day("周二", "9/15", 20)];
    expect(buildDueForecastAdvice(forecast, 20)).toBeNull();
  });

  it("未配置每日目标（goal=0）且非空 → null", () => {
    const forecast = [day("周一", "9/14", 99)];
    expect(buildDueForecastAdvice(forecast, 0)).toBeNull();
  });
});

describe("getMaturityDistribution 记忆成熟度分布（R12）", () => {
  const scheduleFor = (cardId: string, intervalDays: number) => ({
    cardId,
    nextReviewAt: "2026-09-20T09:00:00",
    dueAt: "2026-09-20T09:00:00",
    intervalDays,
    easeFactor: 2.5,
    repetitions: 2,
    lapseCount: 0,
    reviewCount: 2,
    lastReviewedAt: "2026-09-12T09:00:00"
  });

  it("分桶边界：0/1 新学、2/6 巩固中、7/20 稳定、≥21 掌握", () => {
    expect(getMaturityBucket(0)).toBe("new");
    expect(getMaturityBucket(1)).toBe("new");
    expect(getMaturityBucket(2)).toBe("learning");
    expect(getMaturityBucket(6)).toBe("learning");
    expect(getMaturityBucket(7)).toBe("stable");
    expect(getMaturityBucket(20)).toBe("stable");
    expect(getMaturityBucket(21)).toBe("mastered");
    expect(getMaturityBucket(365)).toBe("mastered");
  });

  it("四桶之和 = 非 suspended 卡总数（验收①），无 schedule 落入新学", () => {
    const cards = [
      makeWordCard("c1"), // interval 0 → new（无 schedule）
      makeWordCard("c2"), // 3 → learning
      makeWordCard("c3"), // 10 → stable
      makeWordCard("c4"), // 30 → mastered
      { ...makeWordCard("c5"), status: "suspended" as const } // 不计
    ];
    const data = makeTestData({
      cards,
      schedules: [scheduleFor("c2", 3), scheduleFor("c3", 10), scheduleFor("c4", 30), scheduleFor("c5", 99)],
      reviews: []
    });
    const distribution = getMaturityDistribution(data);
    expect(distribution.total).toBe(4);
    const countOf = (key: string) => distribution.buckets.find((b) => b.key === key)!.count;
    expect(countOf("new")).toBe(1);
    expect(countOf("learning")).toBe(1);
    expect(countOf("stable")).toBe(1);
    expect(countOf("mastered")).toBe(1);
    expect(distribution.buckets.reduce((sum, b) => sum + b.count, 0)).toBe(distribution.total);
  });

  it("空库：total 为 0，四桶全 0（验收③，由视图层渲染空态）", () => {
    const distribution = getMaturityDistribution(makeTestData({ cards: [], schedules: [], reviews: [] }));
    expect(distribution.total).toBe(0);
    expect(distribution.buckets.every((b) => b.count === 0)).toBe(true);
  });
});

describe("全模式正确率（R14）", () => {
  const monday = new Date("2026-06-15T10:00:00");

  it("仅做过 dictation 的用户：全模式正确率不再「暂无」，拼写单项仍为 null（验收①）", () => {
    const word = { ...makeWordCard("w1"), status: "review" as const };
    const data = makeTestData({
      cards: [word],
      reviews: [
        makeReview({ id: "d1", cardId: "w1", mode: "dictation", rating: 4, reviewedAt: "2026-06-16T09:00:00" }),
        makeReview({ id: "d2", cardId: "w1", mode: "dictation", rating: 1, reviewedAt: "2026-06-16T10:00:00" })
      ]
    });
    const report = getWeeklyStatsReport(data, monday);
    expect(report.overallAccuracy).toBe(50);
    expect(report.overallTotal).toBe(2);
    expect(report.spellingAccuracy).toBeNull();
  });

  it("混合模式：拼写单项与原口径一致（验收②回归），全模式含所有模式", () => {
    const word = { ...makeWordCard("w1"), status: "review" as const };
    const data = makeTestData({
      cards: [word],
      reviews: [
        makeReview({ id: "s1", cardId: "w1", mode: "spelling", rating: 4, reviewedAt: "2026-06-16T09:00:00" }),
        makeReview({ id: "s2", cardId: "w1", mode: "spelling", rating: 1, reviewedAt: "2026-06-16T10:00:00" }),
        makeReview({ id: "d1", cardId: "w1", mode: "dictation", rating: 4, reviewedAt: "2026-06-16T11:00:00" }),
        makeReview({ id: "r1", cardId: "w1", mode: "recall", rating: 2, reviewedAt: "2026-06-16T12:00:00" })
      ]
    });
    const report = getWeeklyStatsReport(data, monday);
    expect(report.spellingAccuracy).toBe(50); // 拼写 1/2，与 R14 前口径一致
    expect(report.spellingTotal).toBe(2);
    expect(report.overallAccuracy).toBe(50); // 全模式 2/4（rating>=3 为对）
    expect(report.overallTotal).toBe(4);
  });

  it("previousWeek 同口径产出 overallAccuracy", () => {
    const word = { ...makeWordCard("w1"), status: "review" as const };
    const data = makeTestData({
      cards: [word],
      reviews: [
        makeReview({ id: "p1", cardId: "w1", mode: "dictation", rating: 4, reviewedAt: "2026-06-10T09:00:00" }),
        makeReview({ id: "c1", cardId: "w1", mode: "dictation", rating: 4, reviewedAt: "2026-06-16T09:00:00" })
      ]
    });
    const report = getWeeklyStatsReport(data, monday);
    expect(report.previousWeek.overallAccuracy).toBe(100);
    expect(report.previousWeek.spellingAccuracy).toBeNull();
  });

  it("本周零复习：overallAccuracy 为 null（视图层显示暂无）", () => {
    const report = getWeeklyStatsReport(makeTestData(), monday);
    expect(report.overallAccuracy).toBeNull();
    expect(report.overallTotal).toBe(0);
  });
});

describe("零成本次级指标（R18）", () => {
  // 本周 = 6/15-6/21，上周 = 6/8-6/14
  const monday = new Date("2026-06-15T10:00:00");

  it("weekActiveDays：按自然日去重，同日多次只计 1，非法时间戳不计", () => {
    const word = { ...makeWordCard("w1"), status: "review" as const };
    const data = makeTestData({
      cards: [word],
      reviews: [
        makeReview({ id: "r1", cardId: "w1", reviewedAt: "2026-06-15T09:00:00" }),
        makeReview({ id: "r2", cardId: "w1", reviewedAt: "2026-06-15T20:00:00" }), // 同日
        makeReview({ id: "r3", cardId: "w1", reviewedAt: "2026-06-17T09:00:00" }),
        makeReview({ id: "r_bad", cardId: "w1", reviewedAt: "not-a-date" })
      ]
    });
    const report = getWeeklyStatsReport(data, monday);
    expect(report.weekActiveDays).toBe(2);
    expect(report.elapsedWeekDays).toBe(1); // 周一 = 本周已过 1 天
  });

  it("weekFixedWords：本周前错过 + 本周对过 = 修复；其余组合不计", () => {
    const fixed = { ...makeWordCard("w_fixed"), status: "review" as const };
    const wrongOnlyThisWeek = { ...makeWordCard("w_wrong"), status: "review" as const };
    const correctNoPriorWrong = { ...makeWordCard("w_clean"), status: "review" as const };
    const sentenceCard = makeCard({ id: "s1", type: "sentence", front: "A sentence.", status: "review" });
    const data = makeTestData({
      cards: [fixed, wrongOnlyThisWeek, correctNoPriorWrong, sentenceCard],
      reviews: [
        // fixed：上周错，本周对 → 修复
        makeReview({ id: "p1", cardId: "w_fixed", rating: 1, reviewedAt: "2026-06-10T09:00:00" }),
        makeReview({ id: "c1", cardId: "w_fixed", rating: 4, reviewedAt: "2026-06-16T09:00:00" }),
        // wrongOnlyThisWeek：本周才错 → 不算修复
        makeReview({ id: "c2", cardId: "w_wrong", rating: 1, reviewedAt: "2026-06-16T10:00:00" }),
        // correctNoPriorWrong：本周对但之前没错 → 不算
        makeReview({ id: "c3", cardId: "w_clean", rating: 4, reviewedAt: "2026-06-16T11:00:00" }),
        // 句卡同样前后对错 → 口径限 word，不计
        makeReview({ id: "p2", cardId: "s1", rating: 1, reviewedAt: "2026-06-10T10:00:00" }),
        makeReview({ id: "c4", cardId: "s1", rating: 4, reviewedAt: "2026-06-16T12:00:00" })
      ]
    });
    expect(getWeeklyStatsReport(data, monday).weekFixedWords).toBe(1);
  });
});

describe("周环比 + 北极星里程碑（R13）", () => {
  // 本周 = 6/15-6/21，上周 = 6/8-6/14
  const monday = new Date("2026-06-15T10:00:00");

  it("weekMasteredCards 用 masteredAt 而非 updatedAt：updatedAt 在周外也计入", () => {
    const card = makeCard({
      id: "w1",
      status: "mastered",
      masteredAt: "2026-06-16T09:00:00", // 本周掌握
      updatedAt: "2026-06-25T09:00:00" // 后续编辑推到下周，不影响掌握口径
    });
    const report = getWeeklyStatsReport(makeTestData({ cards: [card] }), monday);
    expect(report.weekMasteredCards).toBe(1);
    expect(report.masteredWordsTotal).toBe(1);
  });

  it("masteredAt 在上周的卡，即使 updatedAt 在本周也不算本周掌握（口径修复核心）", () => {
    const card = makeCard({
      id: "w1",
      status: "mastered",
      masteredAt: "2026-06-10T09:00:00",
      updatedAt: "2026-06-16T09:00:00"
    });
    expect(getWeeklyStatsReport(makeTestData({ cards: [card] }), monday).weekMasteredCards).toBe(0);
  });

  it("masteredAt 缺失时回退 updatedAt（历史数据兼容）", () => {
    const card = makeCard({ id: "w1", status: "mastered", updatedAt: "2026-06-16T09:00:00" });
    expect(getWeeklyStatsReport(makeTestData({ cards: [card] }), monday).weekMasteredCards).toBe(1);
  });

  it("previousWeek：上周有复习时产出同口径对照（验收①有基线）", () => {
    const word = { ...makeWordCard("w1"), status: "review" as const };
    const data = makeTestData({
      cards: [word],
      reviews: [
        makeReview({ id: "p1", cardId: "w1", mode: "spelling", rating: 4, reviewedAt: "2026-06-09T09:00:00" }),
        makeReview({ id: "p2", cardId: "w1", mode: "spelling", rating: 1, reviewedAt: "2026-06-10T09:00:00" }),
        makeReview({ id: "c1", cardId: "w1", mode: "spelling", rating: 4, reviewedAt: "2026-06-16T09:00:00" })
      ]
    });
    const report = getWeeklyStatsReport(data, monday);
    expect(report.previousWeek.hasBaseline).toBe(true);
    expect(report.previousWeek.reviewCount).toBe(2);
    expect(report.previousWeek.spellingAccuracy).toBe(50);
    expect(report.previousWeek.firstReviewedWords).toBe(1);
    expect(report.weekFirstReviewedWords).toBe(0); // 首评在上周，本周不再计新词
  });

  it("previousWeek：上周零复习时 hasBaseline=false（UI 显示「—」）", () => {
    const data = makeTestData({
      cards: [makeWordCard("w1")],
      reviews: [makeReview({ id: "c1", cardId: "w1", reviewedAt: "2026-06-16T09:00:00" })]
    });
    const report = getWeeklyStatsReport(data, monday);
    expect(report.previousWeek.hasBaseline).toBe(false);
    expect(report.previousWeek.reviewCount).toBe(0);
  });

  it("markCardsPriority 后累计掌握数不变（验收②）：标星不制造假掌握", () => {
    const before = makeCard({
      id: "w1",
      status: "mastered",
      masteredAt: "2026-06-10T09:00:00",
      updatedAt: "2026-06-10T09:00:00",
      priority: false
    });
    // 模拟标星：priority/updatedAt 变化，masteredAt 不动
    const after = { ...before, priority: true, updatedAt: "2026-06-16T09:00:00" };
    const reportBefore = getWeeklyStatsReport(makeTestData({ cards: [before] }), monday);
    const reportAfter = getWeeklyStatsReport(makeTestData({ cards: [after] }), monday);
    expect(reportAfter.masteredWordsTotal).toBe(reportBefore.masteredWordsTotal);
    expect(reportAfter.weekMasteredCards).toBe(reportBefore.weekMasteredCards);
  });

  it("buildMasteredMilestone 文案：0 词引导 / 途中报差额 / 跨里程碑换目标 / 全部达成（验收③）", () => {
    expect(buildMasteredMilestone(0).text).toBe("还没有掌握单词，向 100 词里程碑进发");
    const mid = buildMasteredMilestone(320);
    expect(mid.next).toBe(500);
    expect(mid.remaining).toBe(180);
    expect(mid.lastPassed).toBe(200);
    expect(mid.text).toBe("距 500 词里程碑还差 180 词");
    const crossed = buildMasteredMilestone(500);
    expect(crossed.lastPassed).toBe(500);
    expect(crossed.next).toBe(1000);
    expect(crossed.text).toBe("距 1000 词里程碑还差 500 词");
    const done = buildMasteredMilestone(5200);
    expect(done.next).toBeNull();
    expect(done.remaining).toBe(0);
    expect(done.text).toBe("已突破 5000 词，全部里程碑达成");
  });
});
