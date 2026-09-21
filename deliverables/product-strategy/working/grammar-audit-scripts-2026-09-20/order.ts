import { grammarLessons } from "../../../../src/data/grammarLessons";
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
const words = (s: string) => norm(s).split(" ").filter(Boolean);

let inOrder = 0, total = 0, oneSwap = 0;
const examples: string[] = [];
for (const l of grammarLessons as any[]) {
  for (const p of l.practice || []) {
    total++;
    const ans = words(p.answer);
    const tok = (p.tokens || []).map((t: string) => norm(t));
    if (JSON.stringify(ans) === JSON.stringify(tok)) { inOrder++; if (examples.length < 6) examples.push(`L${l.number} 「${p.answer}」tokens=${JSON.stringify(p.tokens)}`); continue; }
    // 计算最少交换次数（答案与 tokens 的排列距离）：用逆序对近似
    const idx = tok.map((w: string) => ans.indexOf(w));
    let inv = 0;
    for (let i = 0; i < idx.length; i++) for (let j = i + 1; j < idx.length; j++) if (idx[i] > idx[j]) inv++;
    if (inv === 1) oneSwap++;
  }
}
console.log(`practice 总题: ${total}`);
console.log(`tokens 已按正确顺序给出（零思考，直接确认）: ${inOrder} 题 = ${(inOrder/total*100).toFixed(1)}%`);
console.log(`只需 1 次交换（难度≈无）: ${oneSwap} 题 = ${(oneSwap/total*100).toFixed(1)}%`);
console.log(`两者合计: ${inOrder+oneSwap} 题 = ${((inOrder+oneSwap)/total*100).toFixed(1)}%`);
console.log("\n零思考样例:");
examples.forEach((e) => console.log("  " + e));

// guided arrange 同类检查
let gIn = 0, gTot = 0;
for (const l of grammarLessons as any[]) {
  for (const g of l.guided || []) {
    if (g.kind !== "arrange") continue;
    gTot++;
    if (JSON.stringify(words(g.answer)) === JSON.stringify((g.tokens || []).map((t: string) => norm(t)))) gIn++;
  }
}
console.log(`\nguided arrange 已按序给出: ${gIn}/${gTot} = ${(gIn/gTot*100).toFixed(1)}%`);
