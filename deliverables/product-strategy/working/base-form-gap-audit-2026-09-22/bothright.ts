import { grammarLessons } from "../../../../src/data/grammarLessons";
console.log("=== A) contrast.bothRight：『错侧』槽里其实是正确句 ===");
let total=0, br=0;
for (const l of grammarLessons) for (const c of l.contrast??[]) { total++; if (c.bothRight) br++; }
console.log(`  contrast 共 ${total} 条；bothRight=true 的 ${br} 条`);
console.log("\n  bothRight 的样本（wrong 字段其实是正确句）:");
let k=0;
for (const l of grammarLessons) for (const c of l.contrast??[]) if (c.bothRight && k++<8)
  console.log(`   L${l.number}: wrong=${JSON.stringify(c.wrong)}\n            correct=${JSON.stringify(c.correct)}  wrongMark=${JSON.stringify(c.wrongMark)}`);
console.log("\n  ⚠️ wrongMark===null 且 bothRight 的条数（= 纯粹「两句都对」）:");
let n2=0; for (const l of grammarLessons) for (const c of l.contrast??[]) if (c.bothRight && (c.wrongMark===null||c.wrongMark===undefined)) n2++;
console.log("   ", n2);

console.log("\n=== B) contrast.wrongMark === null 的条数（整句缺一块 / 两句都对）===");
let nn=0, tot2=0;
for (const l of grammarLessons) for (const c of l.contrast??[]) { tot2++; if (c.wrongMark===null) nn++; }
console.log(`  wrongMark===null: ${nn} / ${tot2}`);

console.log("\n=== C) arrange 题是否真的含干扰项 ===");
let arr=0, withExtra=0;
for (const l of grammarLessons) for (const g of l.guided??[]) {
  if (g.kind!=="arrange") continue;
  arr++;
  const ans=g.answer.replace(/[.,?!、]/g,"").split(/\s+/).filter(Boolean);
  const toks=(g.tokens??[]).map(t=>t.replace(/[.,?!]/g,""));
  const extra=toks.filter(t=>!ans.includes(t));
  if (extra.length) { withExtra++; if (withExtra<=10) console.log(`   L${l.number}: answer=${JSON.stringify(g.answer)} tokens=${JSON.stringify(g.tokens)} 多余=${JSON.stringify(extra)}`); }
}
console.log(`  arrange 共 ${arr} 题，含额外词块（真干扰项）的 ${withExtra} 题`);

console.log("\n=== D) 原形被错判的『整句缺一块』类型 ===");
for (const l of grammarLessons) for (const c of l.contrast??[])
  if (c.wrongMark===null && /\b(lose|break|wear)\b/i.test(c.wrong))
    console.log(`   L${l.number}: ${JSON.stringify(c.wrong)} | ${JSON.stringify(c.correct)}`);
