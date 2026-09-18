import { describe, expect, it } from "vitest";
import { grammarLessons } from "./grammarLessons";
import { LESSON_GROUPS, findSeasonByLessonNumber } from "./grammarSeasons";

/**
 * 季分组守门测试（2026-09-17 排版优化随附）：
 * 「课程号不落在任何季区间内会被路径页静默过滤（整课不显示、无报错）」
 * 是路线图登记的头号展示层风险——本测试把「区间覆盖」从纪律升级为断言。
 * 新增课程批次（如批七 L50–54）时若忘记追加 season-N，这里会先红。
 */
describe("grammarSeasons 季分组覆盖（静默过滤守门）", () => {
  it("每课号都落在某个季区间内", () => {
    for (const lesson of grammarLessons) {
      const season = findSeasonByLessonNumber(lesson.number);
      expect(
        season,
        `第 ${lesson.number} 课（${lesson.id}）不在任何季区间内——会被路径页静默过滤；请追加 season-N 分组`
      ).toBeDefined();
    }
  });

  it("季区间互不重叠且 min ≤ max", () => {
    const sorted = [...LESSON_GROUPS].sort((a, b) => a.min - b.min);
    for (let i = 0; i < sorted.length; i += 1) {
      const group = sorted[i];
      expect(group.min, `${group.id} 的 min 应 ≤ max`).toBeLessThanOrEqual(group.max);
      if (i > 0) {
        expect(
          group.min,
          `${group.id} 与 ${sorted[i - 1].id} 区间重叠或倒序`
        ).toBeGreaterThan(sorted[i - 1].max);
      }
    }
  });

  it("分组头显示用字段齐全（label/hint 非空）", () => {
    for (const group of LESSON_GROUPS) {
      expect(group.label.trim().length, `${group.id} label 为空`).toBeGreaterThan(0);
      expect(group.hint.trim().length, `${group.id} hint 为空`).toBeGreaterThan(0);
    }
  });

  it("最高季区间的 max 覆盖全部课程（新批课不被尾部截断）", () => {
    const maxNumber = Math.max(...grammarLessons.map((lesson) => lesson.number));
    const covered = findSeasonByLessonNumber(maxNumber);
    expect(covered, `最高课号 ${maxNumber} 超出所有季区间——新批课的季分组未上线`).toBeDefined();
  });
});
