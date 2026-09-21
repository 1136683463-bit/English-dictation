import { describe, expect, it } from "vitest";
import { CAN_DO_MILESTONES } from "./GrammarPathPage";
import { GRAMMAR_ZERO_TERMS } from "../data/grammarZeroTerms";
import { grammarLessons } from "../data/grammarLessons";

/**
 * 里程碑文案零术语守门（2026-09-21 批三十三补）。
 *
 * 缺口：路径页的「我能说…」里程碑卡（title / zh / samples）是**用户可见的成就文案**，
 * 但此前不在任何零术语断言范围内。同批审计发现 `variants[].noteZh` 也是同类漏网字段
 * （25 处泄漏，已修并守门）——本文件补上里程碑这一处。
 * 实测当时 m4 的 zh 含「三单」+ 两个术语词，已改写。
 */
describe("里程碑文案零术语守门（路径页成就卡）", () => {
  it("title 与 zh 不得含语法术语", () => {
    const offenders: string[] = [];
    for (const milestone of CAN_DO_MILESTONES) {
      for (const [field, text] of [
        ["title", milestone.title],
        ["zh", milestone.zh]
      ] as const) {
        const hits = GRAMMAR_ZERO_TERMS.filter((term) => text.includes(term));
        if (hits.length > 0) {
          offenders.push(`${milestone.id} ${field}→${hits.join("/")}：${text.slice(0, 40)}`);
        }
      }
    }
    expect(offenders, `里程碑文案含术语：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("里程碑按课号递增且 id 唯一（展示顺序与解锁判定的前提）", () => {
    const ids = CAN_DO_MILESTONES.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    const sorted = [...CAN_DO_MILESTONES].sort((a, b) => a.afterLesson - b.afterLesson);
    for (let i = 1; i < sorted.length; i += 1) {
      expect(
        sorted[i].afterLesson,
        `${sorted[i].id} 的 afterLesson 应大于 ${sorted[i - 1].id}`
      ).toBeGreaterThan(sorted[i - 1].afterLesson);
    }
  });
});

/**
 * 里程碑覆盖面守门（2026-09-21 批三十五补）。
 *
 * 缺口：**新增课程可能没有对应里程碑而无人发现**——里程碑只覆盖「每章末尾」，
 * 本就不是每课一个，所以「这课没里程碑」绝大多数是正常的；
 * 但**最后一批课**如果漏掉里程碑，用户的章末成就感会凭空断在末章。
 * 实测批三十二就发生过：L180／L181 交付后 `can-do-m34` 因避让并发写入而未加，
 * 直到批三十三才发现并补上（本批同型：m36 的插入脚本连续两批漏花括号 → 解析失败）。
 *
 * 本断言只锁一条**硬线**：**里程碑的 afterLesson 必须覆盖到全库最大课号**
 * （即最后一课之后必须有里程碑）——防止「末章无收口」静默上线。
 */
describe("里程碑覆盖面守门（末章不得无收口）", () => {
  it("里程碑最大 afterLesson 必须 ≥ 全库最大课号", () => {
    const maxMilestone = Math.max(...CAN_DO_MILESTONES.map((m) => m.afterLesson));
    const maxLesson = Math.max(...grammarLessons.map((l) => l.number));
    expect(
      maxMilestone,
      `里程碑最大 afterLesson=${maxMilestone}，但全库最大课号=${maxLesson}——末章缺收口里程碑（新增课请补 can-do-mN）`
    ).toBeGreaterThanOrEqual(maxLesson);
  });
});
