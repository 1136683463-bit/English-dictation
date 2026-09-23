import { grammarLessons } from "../../../../src/data/grammarLessons";
import { readFileSync } from "node:fs";
const src=readFileSync("src/data/grammarLessons.ts","utf8");
console.log("=== lesson.id 里的假命中（连字符是 \\b 边界，所以 id 会命中）===");
for(const w of ["lost","broke","broken","lose","break","wear","wears"]){
  const ids=grammarLessons.filter(l=>new RegExp(`\\b${w}\\b`,"i").test(l.id)).map(l=>l.id);
  const aliases = [...src.matchAll(/^\s*aliases?:\s*\[(.*)\]/gm)].length;
  console.log(`  ${w}: id 命中 ${ids.length} 个 ${JSON.stringify(ids)}`);
}
console.log("\n=== 原始文本里 'lost' 的 \b 命中行 ===");
const lines=src.split("\n");
lines.forEach((l,i)=>{ if(/^\s*id:\s*".*lost.*"/.test(l)) console.log(`  L${i+1}: ${l.trim()}`); });
console.log("\n=== 对照：V2 口径 49 + id 假命中 1 = 50？ ===");
console.log("  V2(lost)=49；id 假命中数 =", grammarLessons.filter(l=>/\blost\b/i.test(l.id)).length);
console.log("  V2(broke)=25；id 假命中数 =", grammarLessons.filter(l=>/\bbroke\b/i.test(l.id)).length);
console.log("\n=== huntCaseIds 里的假命中 ===");
for(const w of ["dog","id"]) {
  const r=grammarLessons.filter(l=>l.huntCaseIds.some(h=>new RegExp(`\\b${w}\\b`,"i").test(h))).map(l=>`L${l.number}:${l.huntCaseIds.filter(h=>new RegExp(`\\b${w}\\b`,"i").test(h)).join(",")}`);
  console.log(`  ${w}: ${r.length} 课  ${JSON.stringify(r.slice(0,6))}`);
}
