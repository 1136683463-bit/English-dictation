/**
 * 正课「段标」构建（从 GrammarLessonPage 抽出，2026-09-23）。
 *
 * 为什么单独成文件：React Fast Refresh 要求页面文件**只导出组件**——
 * 页面里多一个非组件 export 会让整文件 HMR 失效，开发时的修改不会热更新到
 * 已打开的页面（用户曾因此看到过期代码）。与 parseContrastParagraph 同一处理。
 *
 * ── 这个模块存在的第二个理由：空侦探页 ──────────────────────────────
 *
 * 2026-09-23 实测确认的 P0：全库 205 课里有 5 课（第 2/3/5/6/8 课）
 * `huntCaseIds: []`——`huntCases.ts` 的决策⑤（2026-09-13）**故意**不给它们配案
 * （那 5 个未被引用的番外案是综合复习性质，配给第一季基础课会越级撞墙），
 * 但**页面侧从来没为此设过出口**：
 *
 *   1. 段标恒为「④/⑤ 破」，与其余 200 课毫无区别；
 *   2. 完课即 `gotoStage("challenge")`，无条件把用户送进挑战段；
 *   3. 挑战段无条件渲染「这一课学会了，正好用它去帮侦探找到对应的语法漏洞」
 *      +「挑战不计时、不扣分」，然后 `huntCaseIds.map()` 对空数组渲染出**空列表**，
 *      动作区只剩「学下一课」。
 *
 * 于是按顺序学的用户，在第 2 课完课那一刻就被送到一个**承诺了挑战、却什么都没有**
 * 的页面——这是「空侦探页」的完整成因。
 *
 * 修法：段标与出口都从「本课到底有没有案」推导，而不是恒真。
 */

export type LessonStage = "pretest" | "watch" | "guided" | "recall" | "practice" | "challenge";

export interface StageTab {
  id: LessonStage;
  label: string;
  hint: string;
}

/**
 * 段标构建：有 recall 数据的课显示「③ 忆」，否则回退四段（向后兼容）。
 *
 * `hasHuntCase` 为假（本课无关联案件，全库 5 课）时**摘掉「破」段**：
 * 段标是「这一课要走完哪几步」的承诺，不能承诺一个不存在的段——
 * 否则用户看到「⑤ 破」，等真正走到那一步却什么都没有。
 */
export const getStageTabs = (hasRecall: boolean, hasHuntCase: boolean): StageTab[] => {
  const tabs: StageTab[] = [
    { id: "watch", label: "① 看", hint: "情景讲解" },
    { id: "guided", label: "② 跟", hint: "试一试" }
  ];
  if (hasRecall) tabs.push({ id: "recall", label: "③ 忆", hint: "凭记忆写" });
  tabs.push({ id: "practice", label: hasRecall ? "④ 练" : "③ 练", hint: "自己来" });
  if (hasHuntCase) {
    tabs.push({ id: "challenge", label: hasRecall ? "⑤ 破" : "④ 破", hint: "侦探挑战" });
  }
  return tabs;
};

/**
 * 完课后该去哪一段：有案去「破」，无案**留在练习段**（收据页同屏）。
 *
 * 为什么无案时不能回 pretest 之类的早段：完课收据（`practiceDone`）只在
 * `stage === "practice" || stage === "challenge"` 时渲染，退回早段会让收据消失，
 * 用户看不到「这一课完成」这个唯一的收束仪式。
 */
export const postCompletionStage = (hasHuntCase: boolean): LessonStage =>
  hasHuntCase ? "challenge" : "practice";

/**
 * 收据页中段那一轮「挑战前最后一轮对错」的标题。
 *
 * 无案的课不该出现「去破案之前」——没有破案这件事，文案就是假承诺。
 */
export const preChallengeContrastLabel = (hasHuntCase: boolean): string =>
  hasHuntCase ? "去破案之前，最后再帮他看两句" : "这一课收尾，最后再帮他看两句";
