import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";
const WB=(f:string)=>new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`,"i");
const H=(f:string,t?:string)=>!!t&&WB(f).test(t);
console.log("=== 报告最终数字总复核 ===");
console.log(`课数 = ${grammarLessons.length}（应 204）`);
console.log(`案数 = ${huntCases.length}（应 213）`);
// tell 家族 C1
function C1(f:string){let n=0;const A=(t?:string)=>{if(H(f,t))n++;};
 for(const l of grammarLessons){A(l.targetSentence);A(l.dialogueEn);
  for(const d of l.dialogue??[])A(d.en);for(const e of l.examples)A(e.en);
  for(const v of l.variants??[])A(v.en);for(const s of l.sceneSwings??[])A(s.en);
  for(const b of l.blocks)A(b.text);for(const p of l.practice)A(p.answer);
  if(l.recall)A(l.recall.answer);
  for(const c of l.contrast??[]){A(c.correct);if(c.bothRight)A(c.wrong);}
  for(const g of l.guided)if(g.kind!=="spot"){A(g.answer);A(g.replaceBase);}}
 return n;}
for(const f of ["tell","tells","told","telling"]) console.log(`  ${f.padEnd(9)} C1 = ${C1(f)}`);
// 去重句数
{const set=new Set<string>();for(const l of grammarLessons){const P=(t?:string)=>{if(H("tell",t))set.add(t!);};
 P(l.targetSentence);P(l.dialogueEn);for(const d of l.dialogue??[])P(d.en);for(const e of l.examples)P(e.en);
 for(const v of l.variants??[])P(v.en);for(const s of l.sceneSwings??[])P(s.en);for(const b of l.blocks)P(b.text);
 for(const p of l.practice)P(p.answer);if(l.recall)P(l.recall.answer);
 for(const c of l.contrast??[]){P(c.correct);if(c.bothRight)P(c.wrong);}
 for(const g of l.guided)if(g.kind!=="spot"){P(g.answer);P(g.replaceBase);}}
 console.log(`  tell 去重句数 = ${set.size}（应 5）`);}
// me/npc
let npc=0,me=0,meT=0,npcT=0;
for(const l of grammarLessons) for(const d of l.dialogue??[]){
 if(d.who==="npc"){npc++;if(H("tell",d.en)||H("tells",d.en)||H("told",d.en))npcT++;}
 else if(d.who==="me"){me++;if(H("tell",d.en)||H("tells",d.en)||H("told",d.en))meT++;}}
console.log(`  npc=${npc} 含 tell ${npcT}  |  me=${me} 含 tell ${meT}`);
// says / wears
console.log(`  says C1 = ${C1("says")}  wears C1 = ${C1("wears")}`);
// targetSentence 主角
for(const f of ["tell","tells","told","say","says","said","ask","wear","wears"]) 
 console.log(`  targetSentence 含 ${f.padEnd(7)}: ${grammarLessons.filter(l=>H(f,l.targetSentence)).length} 课`);
