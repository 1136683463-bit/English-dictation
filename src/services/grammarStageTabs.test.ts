import { describe, expect, it } from "vitest";
import { grammarLessons } from "../data/grammarLessons";
import { huntCases } from "../data/huntCases";
import { getStageTabs, postCompletionStage, preChallengeContrastLabel } from "./grammarStageTabs";

/**
 * 「空侦探页」回归测试（2026-09-23）。
 *
 * 实测确认的 P0：全库 5 课（第 2/3/5/6/8 课）`huntCaseIds: []`，但页面侧
 * 段标恒为「④/⑤ 破」、完课即无条件 `gotoStage("challenge")`、挑战段无条件
 * 渲染「正好用它去帮侦探找到对应的语法漏洞」——用户按顺序学到第 2 课，
 * 完课那一刻就被送进一个承诺了挑战、列表却是空的页面。
 *
 * 数据侧的「不配案」是刻意的（huntCases.ts 决策⑤：番外案越级撞墙），
 * 所以修法必须在展示侧：段标与出口都从「本课到底有没有案」推导。
 */
describe("grammarStageTabs · 段标与完课出口", () => {
  it("有案的课保留「破」段，段位序号与改动前一致", () => {
    expect(getStageTabs(true, true).map((tab) => tab.label)).toEqual(["① 看", "② 跟", "③ 忆", "④ 练", "⑤ 破"]);
    expect(getStageTabs(false, true).map((tab) => tab.label)).toEqual(["① 看", "② 跟", "③ 练", "④ 破"]);
  });

  it("无案的课摘掉「破」段，后续序号不跳号", () => {
    expect(getStageTabs(true, false).map((tab) => tab.label)).toEqual(["① 看", "② 跟", "③ 忆", "④ 练"]);
    // 无 recall 也无案（向后兼容的四段回退）：③ 练 之后直接结束，不出现 ④ 破
    expect(getStageTabs(false, false).map((tab) => tab.label)).toEqual(["① 看", "② 跟", "③ 练"]);
    expect(getStageTabs(true, false).some((tab) => tab.id === "challenge")).toBe(false);
  });

  it("段标里出现「破」当且仅当本课有案", () => {
    for (const hasRecall of [true, false]) {
      for (const hasHunt of [true, false]) {
        const hasBreakTab = getStageTabs(hasRecall, hasHunt).some((tab) => tab.id === "challenge");
        expect(hasBreakTab, `hasRecall=${hasRecall} hasHunt=${hasHunt}`).toBe(hasHunt);
      }
    }
  });

  it("完课出口：只有有案的课才去「破」", () => {
    expect(postCompletionStage(true)).toBe("challenge");
    // 无案时留在 practice——收据（practiceDone）在 practice 段同样渲染，
    // 若退回更早的段，收据会连同「这一课完成」一起消失。
    expect(postCompletionStage(false)).toBe("practice");
  });

  it("收据页中段标题不向无案的课许诺「去破案」", () => {
    expect(preChallengeContrastLabel(true)).toContain("去破案");
    expect(preChallengeContrastLabel(false)).not.toContain("破案");
  });
});

describe("grammarStageTabs · 全库数据契约", () => {
  it("每课都能推出一个「要不要显示破段」的确定答案", () => {
    for (const lesson of grammarLessons) {
      expect(Array.isArray(lesson.huntCaseIds), `L${lesson.number} huntCaseIds 应为数组`).toBe(true);
      expect(typeof ((lesson.huntCaseIds?.length ?? 0) > 0)).toBe("boolean");
    }
  });

  it("无案的课就是决策⑤点名的那 5 课——数量不再增长（增长即需重新评估）", () => {
    const noCase = grammarLessons.filter((lesson) => (lesson.huntCaseIds?.length ?? 0) === 0);
    expect(noCase.map((lesson) => lesson.number).sort((a, b) => a - b)).toEqual([2, 3, 5, 6, 8]);
  });

  it("课程引用的案件 id 都在案件池里（防悬空引用）", () => {
    const known = new Set(huntCases.map((item) => item.id));
    const dangling: string[] = [];
    for (const lesson of grammarLessons) {
      for (const caseId of lesson.huntCaseIds ?? []) {
        if (!known.has(caseId)) dangling.push(`L${lesson.number} → ${caseId}`);
      }
    }
    expect(dangling, `课程引用了不存在的案件：\n${dangling.join("\n")}`).toEqual([]);
  });
});
