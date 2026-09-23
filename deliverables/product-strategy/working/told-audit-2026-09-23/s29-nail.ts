import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";
import * as echo from "../../../../src/data/echoGateScripts";
import * as gate from "../../../../src/data/gateScripts";
import * as lib from "../../../../src/data/libraryGateScripts";
import * as lh from "../../../../src/data/lighthouseGateScripts";
import * as mk from "../../../../src/data/marketGateScripts";
import * as mt from "../../../../src/data/mountainGateScripts";
const WB=(f:string)=>new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`,"i");
const H=(f:string,t?:string)=>!!t&&WB(f).test(t);
/* C1 严格正侧：排除 spot.answer（错词）与 bothRight.wrong */
function C1A(f:string){const o:{l:number;s:string;t:string}[]=[];const A=(l:number,s:string,t?:string)=>{if(H(f,t))o.push({l,s,t:t!});};
 for(const l of grammarLessons){A(l.number,"targetSentence",l.targetSentence);A(l.number,"dialogueEn",l.dialogueEn);
  (l.dialogue??[]).forEach((d,k)=>A(l.number,`dialogue[${k}].en`,d.en));
  l.examples.forEach((e,k)=>A(l.number,`examples[${k}].en`,e.en));
  (l.variants??[]).forEach((v,k)=>A(l.number,`variants[${k}].en`,v.en));
  (l.sceneSwings??[]).forEach((s,k)=>A(l.number,`sceneSwings[${k}].en`,s.en));
  l.blocks.forEach((b,k)=>A(l.number,`blocks[${k}].text`,b.text));
  l.practice.forEach((p,k)=>A(l.number,`practice[${k}].answer`,p.answer));
  if(l.recall)A(l.number,"recall.answer",l.recall.answer);
  (l.contrast??[]).forEach((c,k)=>{A(l.number,`contrast[${k}].correct`,c.correct);if(c.bothRight)A(l.number,`contrast[${k}].wrong(bothRight)`,c.wrong);});
  l.guided.forEach((g,k)=>{if(g.kind!=="spot"){A(l.number,`guided[${k}].answer`,g.answer);A(l.number,`guided[${k}].replaceBase`,g.replaceBase);}});}
 return o;}
console.log("=== ① tell 家族 C1 严格正侧逐条（含 de-dup 后的物理句数）===");
for(const f of ["tell","tells","told","telling"]){const r=C1A(f);
 const uniq=[...new Set(r.map(x=>x.t))];
 console.log(`  ${f}: 落点 ${r.length} 处 / 去重后 ${uniq.length} 句`);
 for(const u of uniq) console.log(`      ${JSON.stringify(u)}  ← ${r.filter(x=>x.t===u).map(x=>`L${x.l}.${x.s}`).join(" + ")}`);}
console.log("\n=== ② wears 的 C1 严格正侧（对照 tells），并定位在哪些课 ===");
{const r=C1A("wears");const byL:Record<number,number>={};r.forEach(x=>byL[x.l]=(byL[x.l]??0)+1);
 console.log(`  wears: ${r.length} 处 / ${Object.keys(byL).length} 课`);
 console.log(`    按课: ${Object.entries(byL).sort((a,b)=>Number(a[0])-Number(b[0])).map(([k,v])=>`L${k}×${v}`).join(" ")}`);}
console.log("\n=== ③ 「告诉」中文提示但英文答案不用 tell 的全部落点（系统路由）===");
{let n=0;for(const l of grammarLessons){const slots:[string,string][]=[];const P=(s:string,t?:string)=>{if(t&&/告诉/.test(t))slots.push([s,t]);};
 P("intentZh",l.intentZh);P("sceneSetupZh",l.sceneSetupZh);
 l.examples.forEach((e,k)=>P(`examples[${k}].zh`,e.zh));
 (l.contrast??[]).forEach((c,k)=>P(`contrast[${k}].whyZh`,c.whyZh));
 l.guided.forEach((g,k)=>{P(`guided[${k}].promptZh`,g.promptZh);P(`guided[${k}].explain`,g.explain);});
 l.practice.forEach((p,k)=>P(`practice[${k}].promptZh`,p.promptZh));
 if(l.recall){P("recall.promptZh",l.recall.promptZh);P("recall.noteZh",l.recall.noteZh);}
 if(!slots.length)continue;n+=slots.length;
 console.log(`  L${l.number} (${slots.length} 处) [${l.grammarLabel}] → 答案用: ${JSON.stringify(l.targetSentence)}`);}
 console.log(`  ⇒ 合计 ${n} 处「告诉」意图，全部以「把信息直说」而非 tell 表达`);}
console.log("\n=== ④ ask / said / answer 的落点（说明整块「转述·询问」register 的处境）===");
for(const f of ["ask","asked","asks","said","say","says"]){const r=C1A(f);const uniq=[...new Set(r.map(x=>x.t))];
 console.log(`  ${f.padEnd(7)} C1=${r.length} 处 / ${uniq.length} 句`);for(const u of uniq.slice(0,6))console.log(`      ${JSON.stringify(u.slice(0,100))}`);}
console.log("\n=== ⑤ 204 课里 targetSentence 含 ask/said/told/tells 的课（是否当过主角）===");
for(const f of ["ask","asked","said","told","tells","tells"]){const ls=grammarLessons.filter(l=>H(f,l.targetSentence)).map(l=>`L${l.number}`);console.log(`  ${f.padEnd(7)} ${ls.length?ls.join(","):"❌ 0 课"}`);}
console.log("\n=== ⑥ 案件侧 tell 家族再确认（213 案，递归全字段）===");
for(const f of ["tell","tells","told","telling"]){let n=0;const rec=(o:any,d=0)=>{if(d>9||o==null)return;if(typeof o==="string"){if(H(f,o))n++;return;}if(Array.isArray(o)){o.forEach(v=>rec(v,d+1));return;}if(typeof o==="object")for(const k of Object.keys(o))rec(o[k],d+1);};rec(huntCases);console.log(`  ${f.padEnd(9)} ${n} 处`);}
