import { grammarLessons } from "../../../../src/data/grammarLessons";
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();

let unsolvable: string[] = [];
let tot = 0;
for (const l of grammarLessons as any[]) {
  for (const p of l.practice || []) {
    tot++;
    const ansWords = norm(p.answer).split(" ").filter(Boolean);
    const pool: string[] = [];
    for (const t of p.tokens || []) pool.push(...norm(t).split(" ").filter(Boolean));
    for (const d of p.distractors || []) pool.push(...norm(d).split(" ").filter(Boolean));
    // 逐词多集比较
    const count: Record<string, number> = {};
    for (const w of pool) count[w] = (count[w] || 0) + 1;
    const missing: string[] = [];
    for (const w of ansWords) {
      if ((count[w] || 0) > 0) count[w]--;
      else missing.push(w);
    }
    if (missing.length > 0) unsolvable.push(`L${l.number} "${p.answer}" 缺词: ${missing.join(",")}`);
  }
}
console.log(`practice 总题: ${tot}`);
console.log(`tokens+distractors 拼不出答案的题: ${unsolvable.length}`);
unsolvable.slice(0, 25).forEach((s) => console.log("  " + s));

// guided arrange/spot 同类检查
let gbad: string[] = [], gtot = 0;
for (const l of grammarLessons as any[]) {
  for (const g of l.guided || []) {
    if (!g.tokens) continue;
    gtot++;
    const ans = norm(g.kind === "spot" ? g.answer.replace(/\.$/, "") : g.answer);
    const ansWords = ans.split(" ").filter(Boolean);
    const count: Record<string, number> = {};
    for (const t of g.tokens) { const w = norm(t); if (w) count[w] = (count[w] || 0) + 1; }
    const missing: string[] = [];
    for (const w of ansWords) { if ((count[w] || 0) > 0) count[w]--; else missing.push(w); }
    if (missing.length > 0) gbad.push(`L${l.number}[${g.kind}] "${g.answer}" 缺: ${missing.join(",")}`);
  }
}
console.log(`\nguided(tokens 类) 共 ${gtot} 题, 拼不出的: ${gbad.length}`);
gbad.slice(0, 15).forEach((s) => console.log("  " + s));

// 干扰项本身是否错误（干扰项是否为合法词）
console.log("\n--- 干扰项抽样 ---");
const dist = new Set<string>();
for (const l of grammarLessons as any[]) for (const p of l.practice || []) for (const d of p.distractors || []) dist.add(d);
console.log(`不同干扰项总数: ${dist.size}`);
console.log([...dist].slice(0, 60).join(" | "));
