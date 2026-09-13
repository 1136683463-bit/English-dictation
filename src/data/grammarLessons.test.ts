import { describe, expect, it } from "vitest";
import { grammarLessons } from "./grammarLessons";

/**
 * R06 内容扩量的数据完整性守卫：
 * - 每课练习 4 题，其中必含一道与 variants 卡一致的否定或疑问变体题；
 * - 每道练习题的 tokens 词集与 answer 一致（点词成句一定有解）。
 */
describe("grammarLessons 数据完整性（R06 变体扩量）", () => {
  it("每课练习 ≥4 题且含否定/疑问变体题", () => {
    for (const lesson of grammarLessons) {
      const variantSentences = (lesson.variants ?? [])
        .filter((variant) => variant.label !== "肯定")
        .map((variant) => variant.en);

      expect(
        lesson.practice.length,
        `${lesson.id} 练习应至少 4 题（R4 训练密度：可增补复现/替换题）`
      ).toBeGreaterThanOrEqual(4);

      const answers = lesson.practice.map((step) => step.answer);
      const variantHits = variantSentences.filter((sentence) => answers.includes(sentence));
      expect(
        variantHits.length,
        `${lesson.id} 练习应至少覆盖一道否定/疑问变体（现有变体：${variantSentences.join(" / ")}）`
      ).toBeGreaterThanOrEqual(1);
    }
  });

  it("所有练习题的 tokens 词集与 answer 一致（干扰项单独存放，不混入 tokens）", () => {
    for (const lesson of grammarLessons) {
      for (const step of lesson.practice) {
        const normalizedTokens = step.tokens
          .map((token) => token.replace(/[.,!?]/g, ""))
          .filter(Boolean)
          .map((token) => token.toLowerCase())
          .sort()
          .join(" ");
        const answerWords = step.answer
          .replace(/[.,!?]/g, "")
          .split(/\s+/)
          .filter(Boolean)
          .map((word) => word.toLowerCase())
          .sort()
          .join(" ");
        expect(normalizedTokens, `${lesson.id}「${step.answer}」的词块与答案不一致`).toBe(answerWords);
      }
    }
  });

  it("干扰项不得与答案词重复（否则题目出现多解）", () => {
    const clean = (value: string) => value.replace(/[.,!?;:]/g, "").toLowerCase();
    for (const lesson of grammarLessons) {
      for (const step of lesson.practice) {
        const answerWords = new Set(
          step.answer.replace(/[.,!?;:]/g, "").split(/\s+/).filter(Boolean).map(clean)
        );
        for (const distractor of step.distractors ?? []) {
          expect(
            answerWords.has(clean(distractor)),
            `${lesson.id}「${step.answer}」的干扰项「${distractor}」与答案词重复`
          ).toBe(false);
        }
      }
    }
  });

  it("第二季新课（L13–L20）必须配「忆」段 recall（R5）", () => {
    for (const lesson of grammarLessons) {
      if (lesson.number >= 13) {
        expect(lesson.recall, `${lesson.id} 缺少 recall（R5 忆段）`).toBeDefined();
        expect(lesson.recall?.answer.trim()).not.toBe("");
        expect(lesson.recall?.promptZh.trim()).not.toBe("");
        // D8：意图句必须给——缺了它用户不知道要回忆哪一句，必然卡关
        expect(lesson.recall?.intentZh.trim()).not.toBe("");
      }
    }
  });
});
