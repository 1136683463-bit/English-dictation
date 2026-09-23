/**
 * s10：把判据收窄到**真正有意义**的那一种自相矛盾
 *
 * s09-A 太宽：一张错卡把 is 划线（"You is my friend."→"You are my friend."），
 * 同课别处当然会有 is 出现在正确句里——那不是缺陷，那正是对照卡的教学设计。
 *
 * 收窄后的判据 C（同课「同词两判」）：
 *   同一课内，词 M 同时满足：
 *     ① 被某张**错卡**划线（wrongMark = M，且该卡不是 bothRight）
 *     ② 出现在某张**双正解卡**被祝福的那一句里（bothRight=true 卡的 wrong 字段）
 *   判据①+② 同时成立时，用户在同一课内看到「M 被划掉」与「含 M 的句子是对的」。
 *
 * 判据 D（划线位置 ≠ 差异位置）：
 *   错卡划线词 M，但把 M 换成 correct 对应位置的词后**得不到 correct**，
 *   且差异类型是**纯替换**（两串长度相同、只有一处不同）。
 *   此时「划了 M」与「要改成什么」指向不同位置，划线是误导。
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";

function bare(s: string) { return s.replace(/[^A-Za-z']/g, "").toLowerCase(); }
const wb = (w: string) => new RegExp(`(?<![A-Za-z-])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z-])`, "i");
const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

console.log("════════════════════════════════════════════════════════════════");
console.log("s10-A · 判据 C：同课内「同词两判」（错卡划线 + 双正解卡祝福）");
console.log("════════════════════════════════════════════════════════════════");
const hitsC: string[] = [];
for (const l of grammarLessons) {
  const blessedByBothRight: { cardIdx: number; text: string }[] = [];
  for (const [i, c] of (l.contrast ?? []).entries()) if (c.bothRight) blessedByBothRight.push({ cardIdx: i, text: c.wrong });
  if (!blessedByBothRight.length) continue;
  for (const [i, c] of (l.contrast ?? []).entries()) {
    if (!c.wrongMark || c.bothRight) continue;
    const mBare = c.wrongMark.replace(/[^A-Za-z']/g, "");
    if (!mBare) continue;
    const rx = wb(mBare);
    for (const b of blessedByBothRight) {
      if (i === b.cardIdx) continue;
      if (rx.test(b.text)) {
        hitsC.push(
          `L${l.number}「${l.title}」：错卡 contrast[${i}] 划线 ${JSON.stringify(c.wrongMark)}（wrong=${JSON.stringify(c.wrong)}）` +
            `，同课双正解卡 contrast[${b.cardIdx}] 祝福了含该词的句子 ${JSON.stringify(b.text)}`,
        );
      }
    }
  }
}
console.log(`  命中 ${hitsC.length} 处：`);
for (const s of hitsC) console.log(`  ${s}`);
if (!hitsC.length) console.log("  （0 处——这类矛盾在全库只有 L38 那一例，见 s09-B）");

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s10-B · 判据 D：划线位置 ≠ 差异位置（纯替换型错卡中）");
console.log("════════════════════════════════════════════════════════════════");
interface HitD { lesson: number; idx: number; mark: string; wrong: string; correct: string; diffAt: string; why: string }
const hitsD: HitD[] = [];
let substitutionCards = 0;
for (const l of grammarLessons) {
  for (const [i, c] of (l.contrast ?? []).entries()) {
    if (!c.wrongMark || c.bothRight) continue;
    const w = norm(c.wrong).replace(/[.!?]+$/, "").split(" ");
    const k = norm(c.correct).replace(/[.!?]+$/, "").split(" ");
    if (w.length !== k.length) continue; // 只看等长的纯替换
    const diffs: number[] = [];
    for (let j = 0; j < w.length; j++) if (w[j] !== k[j]) diffs.push(j);
    if (diffs.length !== 1) continue; // 只错一处的才叫「单点错卡」
    substitutionCards++;
    const diffWord = k[diffs[0]].replace(/[^A-Za-z']/g, "");
    const markBare = bare(c.wrongMark);
    if (markBare !== diffWord) {
      hitsD.push({ lesson: l.number, idx: i, mark: c.wrongMark, wrong: c.wrong, correct: c.correct, diffAt: `${w[diffs[0]]} → ${k[diffs[0]]}`, why: c.whyZh });
    }
  }
}
console.log(`  全库「等长 + 只错一处」的单点错卡 ${substitutionCards} 张；其中划线词 ≠ 实际差异词的 ${hitsD.length} 张：`);
for (const x of hitsD) {
  console.log(`\n  L${x.lesson} contrast[${x.idx}]  划线 = ${JSON.stringify(x.mark)}  但实际差异 = ${JSON.stringify(x.diffAt)}`);
  console.log(`       wrong  = ${JSON.stringify(x.wrong)}`);
  console.log(`       correct= ${JSON.stringify(x.correct)}`);
  console.log(`       whyZh  = ${x.why.slice(0, 150)}`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s10-C · L38 contrast[6] 属于哪种情形");
console.log("════════════════════════════════════════════════════════════════");
const l38 = grammarLessons.find((l) => l.number === 38)!;
const c6 = l38.contrast![6];
const w6 = norm(c6.wrong).replace(/[.!?]+$/, "").split(" ");
const k6 = norm(c6.correct).replace(/[.!?]+$/, "").split(" ");
console.log(`  wrong   = ${JSON.stringify(c6.wrong)}  (${w6.length} 词)`);
console.log(`  correct = ${JSON.stringify(c6.correct)}  (${k6.length} 词)`);
console.log(`  长度相同？ ${w6.length === k6.length}`);
console.log(`  ⇒ 差异是**少一个词 to**：不是替换型，是**添加/删除型**。`);
const w6withTo = [...w6]; w6withTo.splice(3, 0, "to");
console.log(`     给 wrong 补上 to → ${JSON.stringify(w6withTo.join(" "))}  = correct？ ${norm(w6withTo.join(" ")) === norm(k6.join(" "))}`);
console.log(`     把划线词换成 correct 对应词 → "She says me she will come."  = correct？ false`);
console.log(`\n  ⇒ 这张卡的划线标在 ${JSON.stringify(c6.wrongMark)} 上，但要说的是「少了 to」。`);
console.log(`     用户看到的是「said 被划掉」（删除线），而讲解在讲 to。`);
console.log(`     更麻烦的是：L38 的 contrast[7] 恰好把 ${JSON.stringify(l38.contrast![7].wrong)} 声明为正确——`);
console.log(`     两张卡在同一屏对同一个词给出相反判定（s09-B 已核）。`);

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s10-D · 全库「划线词也在本卡 correct 里」的卡（更窄的误导信号）");
console.log("════════════════════════════════════════════════════════════════");
const inSelfCorrect: string[] = [];
for (const l of grammarLessons) {
  for (const [i, c] of (l.contrast ?? []).entries()) {
    if (!c.wrongMark || c.bothRight) continue;
    const rx = wb(bare(c.wrongMark));
    if (rx.test(c.correct)) inSelfCorrect.push(`L${l.number} contrast[${i}]：划线 ${JSON.stringify(c.wrongMark)} 也出现在本卡 correct ${JSON.stringify(c.correct)} —— whyZh="${c.whyZh.slice(0, 80)}"`);
  }
}
console.log(`  命中 ${inSelfCorrect.length} 张 / 674：`);
for (const s of inSelfCorrect.slice(0, 40)) console.log(`  • ${s}`);
if (inSelfCorrect.length > 40) console.log(`  …（余 ${inSelfCorrect.length - 40} 张）`);
