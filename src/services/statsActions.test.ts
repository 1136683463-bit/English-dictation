import { describe, expect, it } from "vitest";
import { buildStatsActions, StatsActionsInput } from "./statsActions";

const makeInput = (patch: Partial<StatsActionsInput> = {}): StatsActionsInput => ({
  healthScore: 80,
  dueTotal: 0,
  dueReviewGoal: 20,
  weakWords: 0,
  activeSentences: 0,
  dailySentences: 5,
  consecutiveRiskCount: 0,
  recentWrongTotal: 0,
  ...patch
});

describe("buildStatsActions（R5/R6）", () => {
  it("有到期时主行动为清到期复习（/review）", () => {
    const actions = buildStatsActions(makeInput({ dueTotal: 5, weakWords: 3 }));
    expect(actions.primaryAction).toEqual({ label: "清到期复习", to: "/review" });
  });

  it("无到期有薄弱词时主行动为练错词（/spelling?mode=mistakes）", () => {
    const actions = buildStatsActions(makeInput({ weakWords: 4 }));
    expect(actions.primaryAction).toEqual({ label: "练错词", to: "/spelling?mode=mistakes" });
  });

  it("无负债时主行动为继续训练（/training）", () => {
    const actions = buildStatsActions(makeInput());
    expect(actions.primaryAction).toEqual({ label: "继续训练", to: "/training" });
  });

  it("队列行 1 amount 展示真实 dueTotal（不被 cap 12 截断）", () => {
    const actions = buildStatsActions(makeInput({ dueTotal: 30, dueReviewGoal: 20 }));
    const row = actions.todayPlan[0];
    expect(row.amount).toBe("30 张"); // 展示真实总量
    expect(row.to).toBe("/review?plan=today&step=due&limit=12"); // limit 仍是训练量上限
  });

  it("topRisk 选择优先级：red > blue > 首项", () => {
    // red（复习负债 ratio>=1.5）胜过 blue（近期错词趋势）
    const redWins = buildStatsActions(makeInput({ dueTotal: 30, dueReviewGoal: 20, recentWrongTotal: 3 }));
    expect(redWins.topRisk.title).toBe("复习负债");
    expect(redWins.topRisk.tone).toBe("red");

    // 无 red 时取首个 blue
    const blueWins = buildStatsActions(makeInput({ recentWrongTotal: 3 }));
    expect(blueWins.topRisk.title).toBe("近期错词趋势");
    expect(blueWins.topRisk.tone).toBe("blue");

    // 全 green 时回退首项
    const allGreen = buildStatsActions(makeInput());
    expect(allGreen.topRisk).toBe(allGreen.riskBands[0]);
    expect(allGreen.topRisk.tone).toBe("green");
  });

  it("reportStatus：due>0 先清到期 / weak>0 先稳错词 / 阈值分档", () => {
    expect(buildStatsActions(makeInput({ dueTotal: 1, weakWords: 9, healthScore: 95 })).reportStatus).toBe("先清到期");
    expect(buildStatsActions(makeInput({ weakWords: 1, healthScore: 95 })).reportStatus).toBe("先稳错词");
    expect(buildStatsActions(makeInput({ healthScore: 82 })).reportStatus).toBe("节奏健康");
    expect(buildStatsActions(makeInput({ healthScore: 62 })).reportStatus).toBe("节奏可控");
    expect(buildStatsActions(makeInput({ healthScore: 61 })).reportStatus).toBe("需要收尾");
  });

  it("R6：队列行与主行动同 destination 时降级为非链接（各主行动分支）", () => {
    // 主行动 /review：行 1（step=due）撞 destination 降级；行 2/3 保留
    const duePrimary = buildStatsActions(makeInput({ dueTotal: 5, weakWords: 3, activeSentences: 2 }));
    expect(duePrimary.primaryAction.to).toBe("/review");
    expect(duePrimary.todayPlan.map((step) => step.isLink)).toEqual([false, true, true]);

    // 主行动 mistakes：行 2 撞 destination 降级；行 1（/training 热身）与行 3 保留
    const mistakesPrimary = buildStatsActions(makeInput({ weakWords: 3, activeSentences: 2 }));
    expect(mistakesPrimary.primaryAction.to).toBe("/spelling?mode=mistakes");
    expect(mistakesPrimary.todayPlan.map((step) => step.isLink)).toEqual([true, false, true]);

    // 主行动 /training：行 1（/training）撞 destination 降级
    const trainingPrimary = buildStatsActions(makeInput());
    expect(trainingPrimary.primaryAction.to).toBe("/training");
    expect(trainingPrimary.todayPlan.map((step) => step.isLink)).toEqual([false, true, true]);

    // 句子复盘（step=sentences）与主行动 /review 不算同 destination
    expect(duePrimary.todayPlan[2].to).toContain("step=sentences");
    expect(duePrimary.todayPlan[2].isLink).toBe(true);
  });

  it("R6：全数据状态组合下可点击入口数 ≤8", () => {
    // 可点击入口 = 主行动(1) + 队列链接行 + 风险条(link 时) + 错词榜 Top3 + 查看全部(>3 时)
    const scenarios: Array<{ name: string; input: StatsActionsInput; wrongWords: number }> = [
      { name: "全健康态", input: makeInput(), wrongWords: 0 },
      { name: "有负债典型态", input: makeInput({ dueTotal: 8, weakWords: 5, activeSentences: 3, recentWrongTotal: 3 }), wrongWords: 5 },
      { name: "重负债报警态", input: makeInput({ dueTotal: 40, dueReviewGoal: 20, weakWords: 12, activeSentences: 6, consecutiveRiskCount: 4, recentWrongTotal: 9 }), wrongWords: 10 },
      { name: "仅错词态", input: makeInput({ weakWords: 7, consecutiveRiskCount: 2, recentWrongTotal: 2 }), wrongWords: 4 }
    ];

    for (const scenario of scenarios) {
      const actions = buildStatsActions(scenario.input);
      const clickable =
        1 +
        actions.todayPlan.filter((step) => step.isLink).length +
        (actions.topRiskIsLink ? 1 : 0) +
        Math.min(3, scenario.wrongWords) +
        (scenario.wrongWords > 3 ? 1 : 0);
      expect(clickable, scenario.name).toBeLessThanOrEqual(8);
    }
  });

  it("R6：风险条 green 时不产出链接", () => {
    const allGreen = buildStatsActions(makeInput());
    expect(allGreen.topRisk.tone).toBe("green");
    expect(allGreen.topRiskIsLink).toBe(false);

    const red = buildStatsActions(makeInput({ consecutiveRiskCount: 2 }));
    expect(red.topRisk.tone).toBe("red");
    expect(red.topRiskIsLink).toBe(true);

    const blue = buildStatsActions(makeInput({ recentWrongTotal: 2 }));
    expect(blue.topRisk.tone).toBe("blue");
    expect(blue.topRiskIsLink).toBe(true);
  });
});
