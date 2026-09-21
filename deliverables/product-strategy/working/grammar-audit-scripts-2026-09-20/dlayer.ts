import { grammarLessons } from "../../../../src/data/grammarLessons";
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
const words = (s: string) => norm(s).split(" ").filter(Boolean);

// 口径 P-A（严格）：本课②跟段之前的教学材料 = 看段（target/examples/blocks/dialogue/contrast）+ 变体 + 场景变奏
// 不含 guided 与 recall（那是学生的作答），不含 practice 自身 tokens
// 口径 P-B（宽松）：P-A + guided 答案与 tokens + recall 答案（= 学生在本课"见过/碰过"的全部）
const buildPool = (l: any, includeGuided: boolean) => {
  const p = new Set<string>();
  const add = (t: string) => { for (const w of words(t)) p.add(w); };
  add(l.targetSentence);
  for (const e of l.examples || []) add(e.en);
  for (const b of l.blocks || []) add(b.text);
  for (const d of l.dialogue || []) add(d.en);
  for (const c of l.contrast || []) { add(c.correct); add(c.wrong); }
  for (const v of l.variants || []) add(v.en);
  for (const s of l.sceneSwings || []) add(s.en);
  if (includeGuided) {
    for (const g of l.guided || []) { if (g.answer) add(g.answer); for (const t of g.tokens || []) add(t); }
    if (l.recall?.answer) add(l.recall.answer);
  }
  return p;
};

for (const strict of [true, false]) {
  const label = strict ? "口径P-A 严格(仅看段材料)" : "口径P-B 宽松(看段+跟段+忆段)";
  const bad: Record<number, string[]> = {};
  let tot = 0;
  for (const l of grammarLessons as any[]) {
    const pool = buildPool(l, !strict);
    for (const p of l.practice || []) {
      tot++;
      const miss = words(p.answer).filter((w) => !pool.has(w));
      if (miss.length) { (bad[l.number] ||= []).push(`"${p.answer}" 缺[${[...new Set(miss)].join(",")}]`); }
    }
  }
  const items = Object.values(bad).flat().length;
  console.log(`\n=== ${label} ===`);
  console.log(`D 层: ${items} 题 / ${Object.keys(bad).length} 课  (占 684 题的 ${(items/684*100).toFixed(1)}%)`);
  console.log("课号: " + Object.keys(bad).map(Number).sort((a,b)=>a-b).join(","));
  Object.entries(bad).slice(0,8).forEach(([n, arr]) => console.log(`  L${n}: ${arr.slice(0,2).join(" ; ")}`));
}
