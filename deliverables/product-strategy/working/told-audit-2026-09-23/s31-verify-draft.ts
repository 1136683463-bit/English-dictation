import { GRAMMAR_ZERO_TERMS, findZeroTermHits, isZeroTermClean } from "../../../../src/data/grammarZeroTerms";
import { grammarLessons } from "../../../../src/data/grammarLessons";
const W=(f:string,t?:string)=>!!t&&new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`,"i").test(t);
console.log(`零术语词表（${GRAMMAR_ZERO_TERMS.length} 个）: ${GRAMMAR_ZERO_TERMS.join("、")}`);
const DRAFT = [
  "两句都对，差在什么时候说的。says 是现在说给你听——她的话此刻转给你；told 是跟你说过了——话已经交到你手上。同一个「告诉」，一个正在交，一个交完了。",
  "话已经交到你手上",
  "她的话此刻转给你",
  "同一件事，前面站谁就穿哪件",
  "她昨天告诉我一个故事。",
  "他想告诉同桌一件事。"
];
console.log("\n=== 草稿文案零术语自查 ===");
for (const d of DRAFT) console.log(`  ${isZeroTermClean(d)?"✓ 干净":"✗ 命中: "+findZeroTermHits(d).join("、")}  ${JSON.stringify(d.slice(0,60))}`);
console.log("\n=== 草稿里出现的项目自建词汇（确认合规）===");
for (const v of ["昨天版","穿回原样","换零件","领一整句","垫板","名字版","小标签","先给谁后给什么","原样","他/她/它版"]) {
  const inDraft = DRAFT.some(d => d.includes(v));
  console.log(`  ${v.padEnd(14)} 草稿里使用了? ${inDraft?"是":"否"}  （库内 ${grammarLessons.filter(l=>W(v,l.oneLineRule)).length} 课用过）`);
}
console.log("\n=== 复核：dialogue[0].zh 的 median ===");
{const L=grammarLessons.map(l=>(l.dialogue??[])[0]?.zh?.length??0).sort((a,b)=>a-b);
 console.log(`  n=${L.length} min=${L[0]} p25=${L[Math.floor(L.length*0.25)]} median=${L[Math.floor(L.length*0.5)]} p75=${L[Math.floor(L.length*0.75)]} max=${L[L.length-1]}`);}
console.log("\n=== 复核：who 分布 + me 行总数 ===");
let npc=0,me=0; for(const l of grammarLessons) for(const d of l.dialogue??[]) { if(d.who==="npc")npc++; else if(d.who==="me")me++; }
console.log(`  npc=${npc} me=${me} 合计=${npc+me}  （204 课 × 3 行 = 612）`);
console.log("\n=== 复核：「告诉」出现处数 ===");
{let n=0,cnt=0;for(const l of grammarLessons){const S:(string|undefined)[]=[l.intentZh,l.sceneSetupZh,l.title];
 l.examples.forEach(e=>S.push(e.zh)); (l.contrast??[]).forEach(c=>S.push(c.whyZh));
 l.guided.forEach(g=>{S.push(g.promptZh);S.push(g.explain);}); l.practice.forEach(p=>S.push(p.promptZh));
 if(l.recall){S.push(l.recall.promptZh);S.push(l.recall.noteZh);}
 const h=S.filter(x=>x&&x.includes("告诉")).length; if(h){n+=h;cnt++;}}
 console.log(`  含「告诉」的课 ${cnt} 课 / 共 ${n} 处`);}
console.log("\n=== 复核：bundledDictionary 的 tell 词条 ===");
console.log(`  已在 s14 输出：definition 首句 = "n. a Swiss patriot who lived in the early 14th century..."`);
console.log("\n=== 复核：season-28 区间 ===");
