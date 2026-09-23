/**
 * 第 50 批 · 「65」的两种可能所指是否同一批卡（决定我能否断定第三个桶到底是什么）。
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit50-65.mts
 */
import { grammarLessons } from "../../src/data/grammarLessons";

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const wbT = (w: string, t: string) => new RegExp(`(?<![A-Za-z-])${esc(w)}(?![A-Za-z-])`, "i").test(t);
const toksA = (s: string) => s.split(/\s+/).filter(Boolean);
const cw = (t: string) => (t ?? "").replace(/[^A-Za-z0-9']/g, "").toLowerCase();

interface Card { key: string; id: string; num: number; i: number; mark: string; wrong: string; correct: string }
const all: Card[] = [];
for (const l of grammarLessons) (l.contrast ?? []).forEach((c, i) => {
  const m = (c.wrongMark ?? "").trim();
  if (m) all.push({ key: `${l.id}[${i}]`, id: l.id, num: l.number, i, mark: m, wrong: c.wrong, correct: c.correct });
});

// 集合 A：多词标注（>=2 词）
const A = new Set(all.filter((c) => toksA(c.mark).length > 1).map((c) => c.key));
// 集合 B：等长换形/语序（两侧都有该词、长度相同、非纯标点、非仅大小写）
const B = new Set<string>();
for (const c of all) {
  const iw = toksA(c.mark).some((w) => wbT(w, c.wrong));
  const ic = toksA(c.mark).some((w) => wbT(w, c.correct));
  if (!(iw && ic)) continue;
  const w = toksA(c.wrong).length, r = toksA(c.correct).length;
  if (w !== r) continue;
  if (cw(c.wrong) === cw(c.correct) && c.wrong !== c.correct) continue; // 仅标点
  if (c.wrong.toLowerCase() === c.correct.toLowerCase() && c.wrong !== c.correct) continue; // 仅大小写
  B.add(c.key);
}
// 集合 C：逐位 diff 有差异、但标注词不在差异位上（anchorAdjacent）
const C = new Set<string>();
for (const c of all) {
  const w = toksA(c.wrong), r = toksA(c.correct);
  const d: number[] = [];
  for (let i = 0; i < Math.max(w.length, r.length); i += 1) if (cw(w[i] ?? "") !== cw(r[i] ?? "")) d.push(i);
  const hit = w.map((t, i) => (toksA(c.mark).some((m) => cw(m) === cw(t)) ? i : -1)).filter((i) => i >= 0);
  if (d.length > 0 && !hit.some((i) => d.includes(i))) C.add(c.key);
}

console.log(`集合 A「多词标注」            = ${A.size}`);
console.log(`集合 B「等长换形/语序」        = ${B.size}`);
console.log(`集合 C「标注词不在差异位上」    = ${C.size}`);
const inter = (x: Set<string>, y: Set<string>) => [...x].filter((k) => y.has(k));
console.log(`\nA ∩ B = ${inter(A, B).length}   （若为 0 ⇒ 两个 65 是两批不同的卡）`);
console.log(`A ∩ C = ${inter(A, C).length}`);
console.log(`B ∩ C = ${inter(B, C).length}`);
console.log(`A ∪ B = ${new Set([...A, ...B]).size}`);
const exB = [...B].filter((k) => !A.has(k)).slice(0, 6);
const exA = [...A].filter((k) => !B.has(k)).slice(0, 6);
console.log(`\n只在 B 不在 A（等长换形但单词标注）样例：`);
exB.forEach((k) => { const c = all.find((x) => x.key === k)!; console.log(`   L${c.num} ${c.key} mark="${c.mark}"  ❌"${c.wrong}"  ✅"${c.correct}"`); });
console.log(`只在 A 不在 B（多词标注但非等长）样例：`);
exA.forEach((k) => { const c = all.find((x) => x.key === k)!; console.log(`   L${c.num} ${c.key} mark="${c.mark}"  ❌"${c.wrong}"  ✅"${c.correct}"`); });

console.log(`\n⇒ 任务书第三个桶标为「划的词只在正确句」（实测 0 张）。`);
console.log(`   库内恰好有两个量都等于 65（A 与 B），且 A∩B=${inter(A, B).length}——`);
console.log(`   从这三个数字本身无法判定当初算的是哪一个；但**两个都不是**任务书写的那个语义。`);
