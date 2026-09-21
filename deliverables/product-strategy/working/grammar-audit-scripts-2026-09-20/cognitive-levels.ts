import { grammarLessons } from "../../../../src/data/grammarLessons";
const norm=(s:string)=>s.toLowerCase().replace(/[^a-z0-9' ]/g,'').replace(/\s+/g,' ').trim();
const sorted=[...(grammarLessons as any[])].sort((a,b)=>a.number-b.number);

// 核心问题：练习题的「看段复现」是否真的有害？看它们在做题时的可见性
// 关键区别：答案句是否在【同一课的看段】出现 —— 用户做练段时刚看过
console.log("=== 练习顺序分析：复现题在题组中的位置 ===");
const posDist:Record<string,number>={};
let firstIsRepro=0, midIsRepro=0, lastIsRepro=0, tot=0;
for(const l of sorted){
  const pool=new Set<string>();
  const add=(t?:string)=>{if(t)pool.add(norm(t));};
  add(l.targetSentence);
  for(const e of l.examples||[])add(e.en);
  for(const d of l.dialogue||[])add(d.en); add(l.dialogueEn);
  for(const c of l.contrast||[])add(c.correct);
  for(const v of l.variants||[])add(v.en);
  for(const s of l.sceneSwings||[])add(s.en);
  if(l.recall?.answer)add(l.recall.answer);
  for(const g of l.guided||[])if(g.answer)add(g.answer);
  pool.delete("");
  const vs=new Set((l.variants??[]).map((v:any)=>norm(v.en)));
  const items=(l.practice??[]);
  items.forEach((p:any,i:number)=>{
    tot++;
    const a=norm(p.answer);
    const isRepro=pool.has(a)&&!vs.has(a)&&!/(复习第|先复习|学过的老句子)/.test(p.promptZh)&&a!==norm(l.targetSentence);
    if(!isRepro)return;
    const where=i===0?"首题":i===items.length-1?"末题":"中间";
    posDist[where]=(posDist[where]||0)+1;
    if(i===0)firstIsRepro++;
  });
}
console.log("  复现题位置分布:", posDist, `(共 ${firstIsRepro+midIsRepro+lastIsRepro} 题)`);
console.log();

console.log("=== 关键：练段首题是否为「刚看过的句子」（最影响体感）===");
let firstRepro=0, firstVariant=0, firstC=0, firstA=0, firstReview=0;
for(const l of sorted){
  const pool=new Set<string>();
  const add=(t?:string)=>{if(t)pool.add(norm(t));};
  add(l.targetSentence);
  for(const e of l.examples||[])add(e.en);
  for(const d of l.dialogue||[])add(d.en); add(l.dialogueEn);
  for(const c of l.contrast||[])add(c.correct);
  for(const v of l.variants||[])add(v.en);
  for(const s of l.sceneSwings||[])add(s.en);
  if(l.recall?.answer)add(l.recall.answer);
  for(const g of l.guided||[])if(g.answer)add(g.answer);
  pool.delete("");
  const vs=new Set((l.variants??[]).map((v:any)=>norm(v.en)));
  const p=(l.practice??[])[0]; if(!p)continue;
  const a=norm(p.answer);
  if(/(复习第|先复习|学过的老句子)/.test(p.promptZh))firstReview++;
  else if(vs.has(a))firstVariant++;
  else if(a===norm(l.targetSentence))firstA++;
  else if(pool.has(a))firstRepro++;
  else firstC++;
}
console.log(`  首题类型: 复现 ${firstRepro} | 变体 ${firstVariant} | 纯目标句 ${firstA} | 复习 ${firstReview} | 新句 ${firstC}`);
console.log(`  → 首题是「复现/纯目标句」的课共 ${firstRepro+firstA} 课（用户第一题就是抄写）`);

console.log("\n=== 记忆提取强度分级（按题目要求的心智操作）===");
let lv1=0,lv2=0,lv3=0;
for(const l of sorted){
  const pool=new Set<string>();
  const add=(t?:string)=>{if(t)pool.add(norm(t));};
  add(l.targetSentence);
  for(const e of l.examples||[])add(e.en);
  for(const d of l.dialogue||[])add(d.en); add(l.dialogueEn);
  for(const c of l.contrast||[])add(c.correct);
  for(const v of l.variants||[])add(v.en);
  for(const s of l.sceneSwings||[])add(s.en);
  if(l.recall?.answer)add(l.recall.answer);
  for(const g of l.guided||[])if(g.answer)add(g.answer);
  pool.delete("");
  const vs=new Set((l.variants??[]).map((v:any)=>norm(v.en)));
  for(const p of l.practice??[]){
    const a=norm(p.answer);
    if(a===norm(l.targetSentence))lv1++;        // 识字级：照抄刚看过的核心句
    else if(pool.has(a)&&!vs.has(a))lv1++;      // 识字级：照抄课内句子
    else if(vs.has(a))lv2++;                    // 变换级：变体（否定/疑问）
    else lv3++;                                 // 组织级：新句
  }
}
console.log(`  识字级（照抄）: ${lv1} (${(lv1/795*100).toFixed(1)}%)`);
console.log(`  变换级（变体）: ${lv2} (${(lv2/795*100).toFixed(1)}%)`);
console.log(`  组织级（新句）: ${lv3} (${(lv3/795*100).toFixed(1)}%)`);
