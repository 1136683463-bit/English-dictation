/**
 * 第 50 批 · 补充脚本：52 张「无 wrongMark 且非 bothRight」的卡到底是不是「缺了一块」？
 * 以及 L38 contrast[6] 是否已修（批四十九 指出的缺陷）。
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit50-nomark.mts
 */
import { grammarLessons } from "../../src/data/grammarLessons";

const clean = (t: string) => t.replace(/[.,!?;:'"“”]/g, "").toLowerCase();
const toks = (s: string) => s.split(/\s+/).filter(Boolean);

interface Row { id: string; num: number; i: number; wrong: string; correct: string; why: string }
const noMark: Row[] = [];
for (const l of grammarLessons) {
  (l.contrast ?? []).forEach((c, i) => {
    const m = (c.wrongMark ?? "").trim();
    if (!m && !c.bothRight) noMark.push({ id: l.id, num: l.number, i, wrong: c.wrong, correct: c.correct, why: c.whyZh });
  });
}
console.log(`「无 wrongMark 且非 bothRight」卡数: ${noMark.length}\n`);

// UI 在 !mark 时无条件渲染「缺了一块」——检查每张卡的真实机制
type Mech = "insertion" | "deletion" | "substitution" | "reorder" | "punct" | "case" | "semantic" | "other";
const count: Record<Mech, number> = { insertion: 0, deletion: 0, substitution: 0, reorder: 0, punct: 0, case: 0, semantic: 0, other: 0 };
const ex: Record<Mech, string[]> = { insertion: [], deletion: [], substitution: [], reorder: [], punct: [], case: [], semantic: [], other: [] };
for (const r of noMark) {
  const w = toks(r.wrong), c = toks(r.correct);
  const dw = w.map(clean), dc = c.map(clean);
  let mech: Mech;
  if (r.wrong.toLowerCase() === r.correct.toLowerCase() && r.wrong !== r.correct) mech = "case";
  else if (dw.join(" ") === dc.join(" ") && r.wrong !== r.correct) mech = "punct";
  else if (c.length > w.length) {
    // 全是插入？看错句是否为正确句的子序列
    const isSub = (() => { let j = 0; for (const t of dw) { while (j < dc.length && dc[j] !== t) j += 1; if (j >= dc.length) return false; j += 1; } return true; })();
    mech = isSub ? "insertion" : "substitution";
  } else if (w.length > c.length) {
    const isSub = (() => { let j = 0; for (const t of dc) { while (j < dw.length && dw[j] !== t) j += 1; if (j >= dw.length) return false; j += 1; } return true; })();
    mech = isSub ? "deletion" : "substitution";
  } else {
    const sameMultiset = [...dw].sort().join(" ") === [...dc].sort().join(" ");
    const diff = dw.filter((t, i) => t !== dc[i]).length;
    if (sameMultiset && diff > 0) mech = "reorder";
    else if (diff > 0) mech = "substitution";
    else mech = "other";
  }
  // 语序翻转？（否定搬家 / 语义反向）单独标出
  count[mech] += 1;
  if (ex[mech].length < 7) ex[mech].push(`L${r.num} ${r.id}[${r.i}]\n      ❌ "${r.wrong}"\n      ✅ "${r.correct}"\n      why "${r.why.slice(0, 110)}…"`);
}
console.log("按「机制」分类（UI 对这 52 张全部渲染「缺了一块」）：");
for (const k of Object.keys(count) as Mech[]) console.log(`  ${k.padEnd(14)} ${count[k]}`);
for (const k of Object.keys(count) as Mech[]) {
  if (count[k] === 0) continue;
  console.log(`\n── ${k} (${count[k]}) ──`);
  ex[k].forEach((s) => console.log("   " + s));
}

console.log("\n\n════ 语义反向 / 语序类专项（不是「缺」而是「多了」或「位置不对」）════");
const neg: Row[] = noMark.filter((r) => /\bnot\b|\bno\b|n't/i.test(r.wrong) && !/\bnot\b|\bno\b|n't/i.test(r.correct));
console.log(`错句含否定、正确句不含（多了一个「不」）: ${neg.length}`);
neg.slice(0, 8).forEach((r) => console.log(`   L${r.num} ${r.id}[${r.i}] ❌"${r.wrong}" ✅"${r.correct}"`));
const extraNeg = noMark.filter((r) => !/\bnot\b|\bno\b|n't/i.test(r.wrong) && toks(r.correct).length < toks(r.wrong).length);
console.log(`正确句更短的（错句「多了东西」而非「缺」）: ${extraNeg.length}`);
extraNeg.slice(0, 8).forEach((r) => console.log(`   L${r.num} ${r.id}[${r.i}] ❌"${r.wrong}" ✅"${r.correct}"`));

console.log("\n\n════ L38 contrast[6] 现状（批四十九 指出的缺陷）════");
const l38 = grammarLessons.find((l) => l.id === "lesson-38-she-says");
(l38?.contrast ?? []).forEach((c, i) => {
  if (i >= 6) console.log(`  [${i}] wrongMark=${JSON.stringify(c.wrongMark ?? null)} bothRight=${Boolean(c.bothRight)}\n      ❌"${c.wrong}"\n      ✅"${c.correct}"\n      why "${c.whyZh}"`);
});
