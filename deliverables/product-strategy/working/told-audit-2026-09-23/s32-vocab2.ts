import { grammarLessons } from "../../../../src/data/grammarLessons";
import { LESSON_GROUPS } from "../../../../src/data/grammarSeasons";
const W=(f:string,t?:string)=>!!t&&new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`,"i").test(t);
// 全字段文本（用户可见的所有中文文案）
function allZh(l:any){const S:string[]=[];const P=(t?:string)=>{if(t)S.push(t);};
 P(l.title);P(l.grammarLabel);P(l.oneLineRule);P(l.intentZh);P(l.sceneSetupZh);P(l.dialogueZh);
 P(l.summary?.rule);(l.summary?.points??[]).forEach(P);
 (l.deepDive?.paragraphs??[]).forEach(P);P(l.deepDive?.title);
 l.guided.forEach((g:any)=>{P(g.explain);P(g.promptZh);P(g.correctionZh);P(g.replaceTarget);});
 (l.contrast??[]).forEach((c:any)=>P(c.whyZh));
 (l.variants??[]).forEach((v:any)=>P(v.noteZh));
 if(l.recall){P(l.recall.noteZh);P(l.recall.promptZh);P(l.recall.intentZh);}
 (l.dialogue??[]).forEach((d:any)=>P(d.zh));
 (l.sceneSwings??[]).forEach((s:any)=>P(s.zh));
 l.examples.forEach((e:any)=>P(e.zh));
 l.practice.forEach((p:any)=>P(p.promptZh));
 return S.join(" || ");}
const VOCAB=["告诉","昨天版","穿回原样","换零件","领一整句","垫板","名字版","小标签","先给谁后给什么","原样","他/她/它版","做过版","换人换形"];
console.log("=== 项目自建词汇在 204 课「用户可见中文文案」里的使用（全字段口径）===");
for(const v of VOCAB){const ls=grammarLessons.filter(l=>allZh(l).includes(v)).map(l=>l.number);
 console.log(`  ${v.padEnd(14)} ${String(ls.length).padStart(3)} 课  ${ls.slice(0,12).map(n=>`L${n}`).join(",")}${ls.length>12?"…":""}`);}
console.log("\n=== season-28 区间（末季）===");
const s28=LESSON_GROUPS.find(g=>g.id==="season-28");
console.log(`  ${JSON.stringify(s28)}`);
console.log(`  小季（≤3 课）数量: ${LESSON_GROUPS.filter(g=>g.max-g.min+1<=3).length} 个（测试上限 3）`);
console.log(`  测试断言：tiny.length ≤ 3，当前恰好 3 ⇒ 新增 2 课小季会红`);
console.log("\n=== 我草稿里用到的中文词，逐个查是否在项目已用词汇内 ===");
const DRAFT="两句都对，差在什么时候说的。says 是现在说给你听——她的话此刻转给你；told 是跟你说过了——话已经交到你手上。同一个「告诉」，一个正在交，一个交完了。";
for(const t of ["告诉","转给","交到","手上","正在交","交完了"]) console.log(`  「${t}」 草稿包含=${DRAFT.includes(t)}  库内使用课数=${grammarLessons.filter(l=>allZh(l).includes(t)).length}`);
