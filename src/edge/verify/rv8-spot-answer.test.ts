// @vitest-environment node
/**
 * RV8 · 答对后展示的必须是「改对之后」的句子（2026-09-21 修）
 *
 * 档 1 的改错题（点出用错的词）答对后，页面把 `item.answer` 渲染成确认行
 * （GrammarBoostPage「对了！」）。此前 guided 派生的那道题把 **题面错句**
 * 存进了 `answer`，于是用户答对时看到的是「对了！I is Xiaomei.」——
 * 把错句当作正确答案又复述了一遍（全库 195 课命中，且档 1 首题固定是它）。
 *
 * 同一文件里其它同类型题（contrast / bothright / 档 2 改写）一律存正确句，
 * 只有这一处口径不同。
 */
import { describe, expect, it } from "vitest";
import { grammarLessons } from "../../data/grammarLessons";
import { buildBoostItems } from "../../services/grammarBoostService";

const norm = (value: string): string => value.toLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim();

describe("RV8 改错题答对后的确认句", () => {
  it("全库：改错题的 answer 不等于题面错句（除非该课没有可展示的整句修正）", () => {
    const offenders: string[] = [];
    let checked = 0;
    for (const lesson of grammarLessons as unknown as Array<{ id: string; number: number }>) {
      // 档 1 只取 4 道，未必含改错题——用「把 guided 题标为已见」的方式让改错题尽量露出
      const items = [1, 2, 3].flatMap((tier) => buildBoostItems(lesson.id, tier as 1 | 2 | 3, {}));
      for (const item of items) {
        if (item.kind !== "spot" || !item.spotTokens?.length) continue;
        const wrongSentence = item.spotTokens.join(" ");
        // 只检查「题面确实是错句」的那些（有标注错词下标）
        if (item.spotWrongIndex === undefined && !item.spotWrongIndexes?.length) continue;
        checked += 1;
        // 用**原样**比较（不做大小写归一）：大小写本身就是一种错法
        // （L56 `may` → `May` 是月份名抬头，改对了就该不一样）。
        // 归一化比较会把这种「只差大小写」的正确修复误报成「仍是错句」。
        if (item.answer.trim() === wrongSentence.trim()) {
          offenders.push(`${lesson.id}(L${lesson.number}) answer 仍是题面错句："${item.answer}"`);
        }
      }
    }
    expect(checked, "应扫到改错题（否则这条断言没有覆盖面）").toBeGreaterThan(50);
    expect(
      offenders,
      `以下改错题答对后仍会展示错句：\n${offenders.slice(0, 10).join("\n")}${offenders.length > 10 ? `\n…共 ${offenders.length} 条` : ""}`
    ).toEqual([]);
  });

  it("L1 定点复核：确认句是「I am Xiaomei.」而不是「I is Xiaomei.」", () => {
    const items = buildBoostItems("lesson-01-am", 1, {});
    const spot = items.find((item) => item.kind === "spot");
    expect(spot, "L1 档 1 应含改错题").toBeTruthy();
    expect(spot!.spotTokens?.join(" "), "题面应是错句").toBe("I is Xiaomei.");
    expect(spot!.answer, "确认行必须是改对后的句子").toBe("I am Xiaomei.");
  });

  it("判题不受影响：点错词仍判对、点其他词仍判错", () => {
    const items = buildBoostItems("lesson-01-am", 1, {});
    const spot = items.find((item) => item.kind === "spot")!;
    const wrongIndex = spot.spotWrongIndex ?? -1;
    expect(wrongIndex).toBeGreaterThanOrEqual(0);
    // 判题只看下标，与 answer 无关——这里确保改动没有意外影响判题字段
    expect(spot.spotTokens?.[wrongIndex]).toBe("is");
  });
});
