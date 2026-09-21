import { grammarLessons } from "../../../../src/data/grammarLessons";
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
const words = (s: string) => norm(s).split(" ").filter(Boolean);

let A = 0, B = 0, C = 0, D = 0, total = 0;
const sorted = [...(grammarLessons as any[])].sort((a, b) => a.number - b.number);
const cumulative = new Set<string>();
const dLessons = new Set<number>();
const dlExamples: string[] = [];
const bLessons = new Set<number>();

for (const l of sorted) {
  // 展示池句子（整句比对用）
  const sentences = new Set<string>();
  const add = (t?: string) => { if (t) sentences.add(norm(t)); };
  add(l.targetSentence);
  for (const e of l.examples || []) add(e.en);
  for (const d of l.dialogue || []) add(d.en);
  add(l.dialogueEn);
  for (const c of l.contrast || []) { add(c.correct); add(c.wrong); }
  for (const v of l.variants || []) add(v.en);
  for (const s of l.sceneSwings || []) add(s.en);
  if (l.recall?.answer) add(l.recall.answer);
  for (const g of l.guided || []) if (g.answer) add(g.answer);
  sentences.delete("");
  // 展示池词汇
  const vocab = new Set<string>();
  for (const s of sentences) for (const w of words(s)) vocab.add(w);
  for (const b of l.blocks || []) for (const w of words(b.text)) vocab.add(w);
  for (const g of l.guided || []) for (const t of g.tokens || []) for (const w of words(t)) vocab.add(w);
  vocab.delete("");

  for (const p of l.practice || []) {
    total++;
    const a = norm(p.answer);
    if (a === norm(l.targetSentence)) { A++; continue; }
    if (sentences.has(a)) { B++; bLessons.add(l.number); continue; }
    const cumulativePool = new Set([...cumulative, ...vocab]);
    const miss = words(p.answer).filter((w) => !cumulativePool.has(w));
    if (miss.length === 0) C++;
    else { D++; dLessons.add(l.number); if (dlExamples.length < 12) dlExamples.push(`L${l.number}「${p.answer}」缺[${[...new Set(miss)].join(",")}]`); }
  }
  for (const w of vocab) cumulative.add(w);
}
console.log(`总题: ${total}`);
console.log(`A 纯重复目标句:      ${A} (${(A/total*100).toFixed(1)}%)`);
console.log(`B 课内原句再现:      ${B} (${(B/total*100).toFixed(1)}%)  → 涉及 ${bLessons.size} 课`);
console.log(`C 新句·词全学过:     ${C} (${(C/total*100).toFixed(1)}%)`);
console.log(`D 新句·含未教词:     ${D} (${(D/total*100).toFixed(1)}%)  → 涉及 ${dLessons.size} 课`);
console.log(`\n可抄 A+B = ${A+B} (${((A+B)/total*100).toFixed(1)}%)`);
console.log(`真检索 C+D = ${C+D} (${((C+D)/total*100).toFixed(1)}%)`);
console.log(`\nD 层课号: ${[...dLessons].sort((x,y)=>x-y).join(",")}`);
console.log("\nD 层样例:"); dlExamples.forEach((e) => console.log("  " + e));
