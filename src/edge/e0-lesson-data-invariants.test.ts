// @vitest-environment jsdom
/**
 * E0 · 课程数据不变量（E1「会不会死锁」的根因扫描，服务层，无 DOM）
 *
 * 结论先行：192 课的 guided / practice 都在「可点词块数 ≥ 答案词数」范围内，
 * 因此页面判题条件 `next.length >= answerWordCount(answer)` 恒可满足——
 * 只要用户肯点，就一定能摆出正解，不存在「怎么点都判不出题」的结构性死锁。
 */
import { describe, expect, it } from "vitest";
import { grammarLessons } from "../data/grammarLessons";
import { checkLessonTokens, guidedDisplayOrder, judgeGuidedStep } from "../services/lessonService";
import type { LessonPracticeStep } from "../types";

/** 与页面同口径的归一化（小写、去标点、压空白）。 */
const norm = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[.,!?;:'"’‘]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** 页面同款：展示词块 = tokens + distractors。 */
const arrangeTokensOf = (step: { tokens?: string[]; distractors?: string[] }): string[] => [
  ...(step.tokens ?? []),
  ...(step.distractors ?? [])
];

/** 页面同款：答案词数（去标点）。 */
const answerWordCount = (answer: string): number =>
  answer.replace(/[.,!?;:]/g, "").split(/\s+/).filter(Boolean).length;

/** 按答案词序在词块库里挑词（归一化匹配）；挑不齐说明词块库缺词。 */
const pickByAnswer = (tokens: string[], answer: string): string[] => {
  const used = new Set<number>();
  const picked: string[] = [];
  for (const word of norm(answer).split(" ").filter(Boolean)) {
    const at = tokens.findIndex((token, index) => !used.has(index) && norm(token) === word);
    if (at < 0) continue;
    used.add(at);
    picked.push(tokens[at]);
  }
  return picked;
};

const practiceArranges = (): Array<{ lessonId: string; index: number; step: LessonPracticeStep }> =>
  grammarLessons.flatMap((lesson) =>
    lesson.practice.map((step, index) => ({ lessonId: lesson.id, index, step }))
  );

describe("E0 · 课程数据不变量", () => {
  it("E0-1 全库 195 课：arrange 题的可点词块数 ≥ 答案词数（不会判不出题）", () => {
    const bad: string[] = [];
    for (const lesson of grammarLessons) {
      for (const [index, step] of lesson.guided.entries()) {
        if (step.kind !== "arrange") continue;
        const bank = arrangeTokensOf(step).length;
        const need = answerWordCount(step.answer);
        if (bank < need) bad.push(`${lesson.id} guided#${index} bank=${bank} need=${need}`);
      }
    }
    for (const { lessonId, index, step } of practiceArranges()) {
      const bank = arrangeTokensOf(step).length;
      const need = answerWordCount(step.answer);
      if (bank < need) bad.push(`${lessonId} practice#${index} bank=${bank} need=${need}`);
    }
    expect(bad, `词块库凑不出答案的题（结构性死锁）：${bad.slice(0, 8).join(" ;; ")}`).toEqual([]);
  });

  it("E0-2 全库：按答案摆词块，判题函数必须判过（正解不会被误判）", () => {
    const bad: string[] = [];
    for (const lesson of grammarLessons) {
      for (const [index, step] of lesson.guided.entries()) {
        if (step.kind === "choose" || step.kind === "replace" || step.kind === "spot") {
          // 选择题的 answer 是选项文本（可多词），按选项整体提交
          const picked = [step.kind === "spot" ? step.wrongToken ?? step.answer : step.answer];
          if (!judgeGuidedStep(step, picked)) bad.push(`${lesson.id} guided#${index} ${step.kind}`);
          continue;
        }
        const picked = pickByAnswer(arrangeTokensOf(step), step.answer);
        if (picked.length !== answerWordCount(step.answer) || !judgeGuidedStep(step, picked)) {
          bad.push(`${lesson.id} guided#${index} arrange`);
        }
      }
      for (const { lessonId, index, step } of practiceArranges().filter((item) => item.lessonId === lesson.id)) {
        const picked = pickByAnswer(arrangeTokensOf(step), step.answer);
        if (picked.length !== answerWordCount(step.answer) || !checkLessonTokens(picked, step.answer)) {
          bad.push(`${lessonId} practice#${index}`);
        }
      }
    }
    expect(bad, `正解判不过的题：${bad.slice(0, 8).join(" ;; ")}`).toEqual([]);
  });

  it("E0-3 choose/replace 选项必含答案；spot 的命中词必在题干词块里", () => {
    const bad: string[] = [];
    for (const lesson of grammarLessons) {
      for (const [index, step] of lesson.guided.entries()) {
        if (step.kind === "choose" || step.kind === "replace") {
          const options = step.options ?? [];
          if (!options.some((option) => norm(option) === norm(step.answer))) {
            bad.push(`${lesson.id} guided#${index} 选项无答案 ans=${step.answer}`);
          }
        }
        if (step.kind === "spot") {
          const target = step.wrongToken ?? step.answer;
          if (!(step.tokens ?? []).includes(target)) bad.push(`${lesson.id} guided#${index} spot 命中词不在题干`);
        }
      }
    }
    expect(bad, `选项缺陷：${bad.slice(0, 8).join(" ;; ")}`).toEqual([]);
  });

  it("E0-4 guidedDisplayOrder 恒为完整排列（题型轮换不重不漏）", () => {
    const bad: string[] = [];
    for (const lesson of grammarLessons) {
      const order = guidedDisplayOrder(lesson.guided, lesson.id);
      const sorted = [...order].sort((a, b) => a - b).join(",");
      if (sorted !== lesson.guided.map((_step, index) => index).join(",")) bad.push(lesson.id);
    }
    expect(bad, `展示顺序异常的课：${bad.slice(0, 8).join(" ;; ")}`).toEqual([]);
  });

  it("E0-5 有 recall 段的课，答案非空（空答案会让「忆」段无题可判）", () => {
    const withoutRecall = grammarLessons.filter((lesson) => !lesson.recall).map((lesson) => lesson.id);
    const emptyAnswer = grammarLessons
      .filter((lesson) => lesson.recall && !(lesson.recall.answer ?? "").trim())
      .map((lesson) => lesson.id);
    // eslint-disable-next-line no-console
    console.log(`E0-5 有 recall: ${grammarLessons.length - withoutRecall.length} / ${grammarLessons.length}`);
    expect(emptyAnswer, `recall 答案为空：${emptyAnswer.join(" ;; ")}`).toEqual([]);
  });
});
