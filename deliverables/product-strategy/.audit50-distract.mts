import { grammarLessons } from "../../src/data/grammarLessons";
const toks = (s: unknown): string[] => (Array.isArray(s) ? s.map((x) => String(x)) : String(s ?? "").split(/\s+/)).filter(Boolean);
const clean = (t: unknown): string => String(t ?? "").replace(/[.,!?;:'"]/g, "").toLowerCase();
let gArr=0,gArrDist=0,gArrOver=0,pArr=0,pArrDist=0,pArrOver=0;
let typeDistractorsInGuided=0, typeDistractorsInPractice=0;
// practice 的 distractors 与 guided 的 tokens 内含干扰项两种机制
for(const l of grammarLessons){
  for(const g of l.guided??[]){ if(g.kind!=="arrange")continue; gArr++; const t=(g.tokens??[]).length; const a=toks(g.answer).length; if(t>a)gArrOver++; if(g.distractors)gArrDist++; }
  for(const p of l.practice??[]){ pArr++; const t=(p.tokens??[]).length; const a=toks(p.answer).length; if(t>a)pArrOver++; if(p.distractors)pArrDist++; }
}
console.log(`guided.arrange: ${gArr} 道；词块数>答案词数(超载/含干扰) ${gArrOver} 道；显式 distractors ${gArrDist} 道`);
console.log(`practice.arrange 类: ${pArr} 道；词块数>答案词数 ${pArrOver} 道；显式 distractors ${pArrDist} 道`);
// practice 是否全是 arrange 形态（无 kind 字段）
const withKind = grammarLessons.flatMap(l=>(l.practice??[]).filter(p=>(p as unknown as {kind?:string}).kind).map(()=>1));
console.log(`practice 带 kind 字段的题数: ${withKind.length}（LessonPracticeStep 无 kind ⇒ 一律 arrange 形态）`);
// practice answer 是否总等于 tokens 的排列（超载时 tokens 含干扰，answer 是干净句）
let ansEqTokens=0, ansSubset=0, ansNeither=0; const bad:string[]=[];
for(const l of grammarLessons) for(const p of l.practice??[]){
  const ts=toks(p.tokens).map(clean).sort().join(" ");
  const as=toks(p.answer).map(clean).sort().join(" ");
  if(ts===as) ansEqTokens++;
  else { const t=toks(p.tokens).map(clean); const a=toks(p.answer).map(clean); const ok=a.every(x=>t.includes(x)); if(ok)ansSubset++; else {ansNeither++; if(bad.length<8)bad.push(`${l.id} answer="${p.answer}" tokens=${JSON.stringify(p.tokens)} distractors=${JSON.stringify(p.distractors??null)}`);} }
}
console.log(`practice：answer 与 tokens 多重集相等 ${ansEqTokens}；answer 是 tokens 子集（tokens 超载）${ansSubset}；都不是 ${ansNeither}`);
bad.forEach(s=>console.log("   "+s));
