// 全库逐课验证 reviewSentenceOfGuidedStep 的还原结果（只读）。
import { grammarLessons } from "../../src/data/grammarLessons.ts";
import { reviewSentenceOfGuidedStep } from "../../src/services/lessonService.ts";

const L = grammarLessons as any[];
const stat = { choose: 0, arrange: 0, skipped: 0, blankLeft: 0, tooShort: 0, missingAnswer: 0, spaceBeforePunct: 0 };
const problems: string[] = [];
for (const lesson of L) {
  for (const [i, step] of (lesson.guided ?? []).entries()) {
    const s = reviewSentenceOfGuidedStep(step);
    if (step.kind === "arrange") stat.arrange += 1;
    else if (step.kind === "choose") stat.choose += 1;
    else stat.skipped += 1;
    if (step.kind === "choose") {
      if (!s) { stat.tooShort += 1; problems.push(`${lesson.id} guided[${i}] 还原为空`); continue; }
      if (s.includes("___")) { stat.blankLeft += 1; problems.push(`${lesson.id} guided[${i}] 残留占位符：${s}`); }
      if (/\s[.,!?;:]$/.test(s) || /\s[.,!?;:]\s/.test(s)) { stat.spaceBeforePunct += 1; problems.push(`${lesson.id} guided[${i}] 标点前有空格：${s}`); }
      if (!s.toLowerCase().includes(String(step.answer).toLowerCase())) {
        stat.missingAnswer += 1; problems.push(`${lesson.id} guided[${i}] 还原句里没有答案词「${step.answer}」：${s}`);
      }
    }
  }
}
console.log("guided 各 kind 数量:", JSON.stringify(stat));
console.log();
console.log("问题条数:", problems.length);
for (const p of problems.slice(0, 20)) console.log("  " + p);
console.log();
console.log("=== 抽样 6 条 choose 的还原结果 ===");
let n = 0;
for (const lesson of L) {
  for (const step of (lesson.guided ?? [])) {
    if (step.kind !== "choose" || n >= 6) continue;
    console.log(`  ${lesson.id}  before=${JSON.stringify(step.before)} after=${JSON.stringify(step.after)} answer=${JSON.stringify(step.answer)}`);
    console.log(`      → ${JSON.stringify(reviewSentenceOfGuidedStep(step))}`);
    n += 1;
  }
}
