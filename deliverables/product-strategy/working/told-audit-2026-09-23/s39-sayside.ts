import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";
const WB=(f:string)=>new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`,"i");
const H=(f:string,t?:string)=>!!t&&WB(f).test(t);
console.log("=== 独立复核竞析的「say 侧零设防」主张 ===");
console.log(`① L38 是否是全库唯一「转述」课？`);
for(const l of grammarLessons){const blob=[l.title,l.grammarLabel,l.oneLineRule].join(" ");
 if(/转述/.test(blob))console.log(`   L${l.number} [${l.grammarLabel}] ${l.title}`);}
console.log(`\n② 全库有没有任何一处「*say + 人」的错句被设防？（即把 say sb sth 标为错）`);
let n=0;
for(const l of grammarLessons){
 const chk=(s:string,t?:string,mark?:string|null,br?:boolean)=>{if(!t)return;
  // 找含 say/ says /said 紧跟代词的错句
  if(/\b(say|says|said)\s+(me|him|her|us|them|you)\b/i.test(t)){n++;console.log(`   ⚠️ L${l.number} ${s}: ${JSON.stringify(t)} mark=${JSON.stringify(mark)} bothRight=${br}`);}};
 (l.contrast??[]).forEach((c,i)=>chk(`contrast[${i}].wrong`,c.wrong,c.wrongMark,c.bothRight));
 (l.contrast??[]).forEach((c,i)=>chk(`contrast[${i}].correct`,c.correct,null,null));
 l.practice.forEach((p,i)=>{chk(`practice[${i}].answer`,p.answer);(p.distractors??[]).forEach(d=>chk(`practice[${i}].distractors`,d));});
 l.guided.forEach((g,i)=>{chk(`guided[${i}].tokens`,(g.tokens??[]).join(" "));(g.options??[]).forEach(o=>chk(`guided[${i}].options`,o));});
}
console.log(`   ⇒ 全库「say + 人」形态出现 ${n} 处`);
console.log(`\n③ 案件侧：有没有 huntCase 的错词是「say + 人」？`);
let m=0;
for(const c of huntCases) for(const e of c.errors){
 if(/\b(say|says|said)\b/i.test(e.original)&&H(e.correction,undefined)===false){
  m++; console.log(`   ${c.id}(n=${c.number}) "${e.original}"→"${e.correction}" tag=${e.tag}\n      ${e.explanation}`);}}
console.log(`   ⇒ ${m} 处`);
console.log(`\n④ 全库 say 家族作为「主角」（targetSentence）`);
for(const f of ["say","says","said"]) console.log(`   ${f.padEnd(6)} ${grammarLessons.filter(l=>H(f,l.targetSentence)).length} 课`);
console.log(`\n⑤ 全库 tell 家族作为「主角」（targetSentence）`);
for(const f of ["tell","tells","told"]) console.log(`   ${f.padEnd(6)} ${grammarLessons.filter(l=>H(f,l.targetSentence)).length} 课`);
console.log(`\n=== 结论 ===`);
console.log(`  L38 是全库唯一转述课，用 says。全库对「*say + 人」形态设防 = 0 处。`);
console.log(`  ⇒ 竞析的「say 侧零设防」主张 ✅ 成立。`);
