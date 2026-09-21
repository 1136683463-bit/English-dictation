// @vitest-environment node
/**
 * BO10 · 双正解句不得被当成「这句有问题吗」的题面（2026-09-21 修）
 *
 * `contrast.bothRight === true` 的条目里，`wrong` 字段其实**也是正确说法**
 * （如 L87 的 `It's cold today.`，课程正文自己写着「两句都对」）。
 * `pickFirstUnseenContrast`（旧课点混题通道）此前无条件写 `isWrong: true`，
 * 于是页面拿一句正确的话问「这句有问题吗」，用户选「没问题」反被判错，
 * 紧接着的讲解又说他对。
 * 本文件其它通道（改错 / 听辨 / 双正解）都已过滤 bothRight，只有这一处漏了。
 */
import { describe, expect, it } from "vitest";
import { grammarLessons } from "../../data/grammarLessons";
import { buildBoostItems, judgeBoostItem } from "../../services/grammarBoostService";

/** 全库所有 bothRight 条的 wrong 文本（这些句子都是正确说法）。 */
const bothRightSentences = new Set(
  grammarLessons.flatMap((lesson) =>
    (lesson.contrast ?? []).filter((item) => item.bothRight).map((item) => item.wrong)
  )
);

describe("BO10 双正解句不得当错句出题", () => {
  it("全库三档 × 多轮：没有任何 contrast 题拿双正解句当「有问题」的题面", () => {
    expect(bothRightSentences.size, "库里应有双正解条").toBeGreaterThan(0);
    const offenders: string[] = [];
    let checked = 0;
    for (const lesson of grammarLessons) {
      for (const tier of [1, 2, 3] as const) {
        for (let round = 0; round < 5; round += 1) {
          for (const item of buildBoostItems(lesson.id, tier, { round })) {
            if (item.kind !== "contrast") continue;
            checked += 1;
            const sentence = item.contrast?.sentence ?? "";
            if (!bothRightSentences.has(sentence)) continue;
            // 该句是正确的，选「没问题」必须判对
            const noProblemPasses = judgeBoostItem(item, { pickedProblem: false }).passed;
            if (!noProblemPasses) {
              offenders.push(`${lesson.id} t${tier} r${round}: "${sentence}" 选「没问题」被判错`);
            }
          }
        }
      }
    }
    expect(checked, "应扫到对比题（否则断言无覆盖面）").toBeGreaterThan(100);
    expect(
      offenders,
      `以下对比题把正确句当错句：\n${offenders.slice(0, 8).join("\n")}${offenders.length > 8 ? `\n…共 ${offenders.length} 条` : ""}`
    ).toEqual([]);
  });

  it("定点：L87 的 It's cold today. 不再以「有问题」形态出现", () => {
    const lesson = grammarLessons.find((item) => item.id === "lesson-87-its-cold");
    expect(lesson, "L87 应存在").toBeTruthy();
    const hits: string[] = [];
    for (let round = 0; round < 6; round += 1) {
      for (const item of buildBoostItems("lesson-87-its-cold", 1, { round })) {
        if (item.kind === "contrast" && item.contrast?.sentence === "It's cold today.") {
          hits.push(`round ${round}: isWrong=${item.contrast.isWrong}`);
        }
      }
    }
    expect(hits, `不应把「两句都对」的句子当错句出题，命中：${hits.join(", ")}`).toEqual([]);
  });
});
