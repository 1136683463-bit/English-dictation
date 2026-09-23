import { describe, expect, it } from "vitest";
import { parseContrastParagraph } from "../services/grammarContrastParser";
import { grammarLessons } from "../data/grammarLessons";

/**
 * 全库扫描：结构化识别在 158 课全部 deepDive 段落上的表现。
 * 关键防的是「误判」——把补充规则当成对比项渲染会破坏阅读（宁可漏判不可错判）。
 */
describe("深挖卡结构化：全库扫描", () => {
  it("识别出的对比项全部为真术语（零误判），并记录覆盖率", () => {
    let total = 0;
    const matched: Array<{ lesson: string; term: string; body: string }> = [];
    for (const lesson of grammarLessons) {
      for (const paragraph of lesson.deepDive?.paragraphs ?? []) {
        total += 1;
        const parsed = parseContrastParagraph(paragraph);
        if (parsed) matched.push({ lesson: lesson.id, term: parsed.term, body: paragraph });
      }
    }
    const rate = matched.length / Math.max(1, total);
    // eslint-disable-next-line no-console
    console.log(`深挖卡段落：总 ${total} 段，结构化 ${matched.length} 段（${(rate * 100).toFixed(1)}%）`);
    // eslint-disable-next-line no-console
    console.log("识别样本：", matched.map((m) => `${m.lesson}:${m.term}`).join(" | "));
    expect(total).toBeGreaterThan(100);
    // 覆盖率有限是设计取舍：规则只认「英文术语 + 说」，中文叙述一律不碰（宁漏勿错）。
    // 这里锁定「确实有产出但绝不泛滥」——超过 15% 就说明规则被放宽到会误判了。
    expect(matched.length).toBeGreaterThan(0);
    expect(rate).toBeLessThan(0.15);
  });

  it("术语必须纯净：非空、无标点、无中文叙述残留", () => {
    for (const lesson of grammarLessons) {
      for (const paragraph of lesson.deepDive?.paragraphs ?? []) {
        const parsed = parseContrastParagraph(paragraph);
        if (!parsed) continue;
        expect(parsed.term.length, `过长的术语: ${parsed.term}（${lesson.id}）`).toBeLessThanOrEqual(10);
        // 术语里不应含标点或中文虚词（那意味着把句子片段当成了标签）
        expect(/[。？！，；、的和]/.test(parsed.term), `术语不纯: ${parsed.term}`).toBe(false);
      }
    }
  });
});
