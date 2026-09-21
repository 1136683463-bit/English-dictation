import { grammarLessons } from "../../../../src/data/grammarLessons";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();

let guidedTotal = 0, guidedEmpty = 0, guidedShort10 = 0, guidedShort14 = 0;
const explainTexts = new Map<string, number>();
const shortList: string[] = [];
for (const l of grammarLessons as any[]) {
  for (const g of l.guided || []) {
    guidedTotal++;
    const ex = (g.explain || "").trim();
    if (!ex) { guidedEmpty++; continue; }
    if (ex.length < 10) guidedShort10++;
    if (ex.length < 14) guidedShort14++;
    if (ex.length < 20) shortList.push(`L${l.number}[${g.kind}] ${ex.length}字: ${ex}`);
    explainTexts.set(ex, (explainTexts.get(ex) || 0) + 1);
  }
}
console.log(`guided 总步数: ${guidedTotal}`);
console.log(`explain 为空: ${guidedEmpty}`);
console.log(`explain <10字: ${guidedShort10}`);
console.log(`explain <14字: ${guidedShort14}`);
console.log(`explain <20字: ${guidedShortList(shortList)}`);
function guidedShortList(a: string[]) { return a.length; }
const repeated = [...explainTexts.entries()].filter(([, c]) => c > 1);
console.log(`重复出现的 explain 文案数: ${repeated.length}, 涉及步数: ${repeated.reduce((s, [, c]) => s + c, 0)}`);

// D 层：practice 答案含本课从未出现的词
console.log("\n--- D 层（practice 答案含本课未出现的词）---");
const results: Record<string, any> = {};
for (const l of grammarLessons as any[]) {
  const pool = new Set<string>();
  const addText = (t: string) => { for (const w of norm(t).split(" ")) if (w) pool.add(w); };
  addText(l.targetSentence);
  for (const e of l.examples || []) addText(e.en);
  for (const d of l.dialogue || []) addText(d.en);
  for (const c of l.contrast || []) { addText(c.correct); addText(c.wrong); }
  for (const v of l.variants || []) addText(v.en);
  for (const s of l.sceneSwings || []) addText(s.en);
  if (l.recall?.answer) addText(l.recall.answer);
  for (const g of l.guided || []) { if (g.answer) addText(g.answer); for (const t of g.tokens || []) addText(t); }
  for (const b of l.blocks || []) addText(b.text);
  // 也把本课 practice 的 tokens 算进"本课出现的词"（公平口径：先看后练）
  for (const p of l.practice || []) for (const t of p.tokens || []) addText(t);
  let dCount = 0;
  for (const p of l.practice || []) {
    const words = norm(p.answer).split(" ").filter(Boolean);
    const missing = words.filter((w) => !pool.has(w));
    if (missing.length > 0) { dCount++; results[l.number] = (results[l.number] || []); results[l.number].push(`${p.answer} → 缺: ${missing.join(",")}`); }
  }
  if (dCount > 0) { /* collect */ }
}
const dLessons = Object.keys(results).map(Number);
console.log(`D 层题数（含 tokens 口径）: ${Object.values(results).flat().length} 题 / ${dLessons.length} 课`);
console.log(`课号: ${dLessons.sort((a,b)=>a-b).join(",")}`);
