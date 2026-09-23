import { grammarLessons } from "../../../../src/data/grammarLessons";
const WB=(f:string)=>new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`,"i");
const H=(f:string,t?:string)=>!!t&&WB(f).test(t);
// 精确复刻 s23 的 C1
function C1(f:string){let n=0;const A=(t?:string)=>{if(H(f,t))n++;};
 for(const l of grammarLessons){
  A(l.targetSentence);A(l.dialogueEn);
  for(const d of l.dialogue??[])A(d.en);
  for(const e of l.examples)A(e.en);
  for(const v of l.variants??[])A(v.en);
  for(const s of l.sceneSwings??[])A(s.en);
  for(const b of l.blocks)A(b.text);
  for(const p of l.practice)A(p.answer);
  if(l.recall)A(l.recall.answer);
  for(const c of l.contrast??[]){A(c.correct);if(c.bothRight)A(c.wrong);}
  for(const g of l.guided)if(g.kind!=="spot"){A(g.answer);A(g.replaceBase);}}
 return n;}
// 精确复刻 s15 的 A 合计（A1+A2+A3+A4）
type Tier="A1"|"A2"|"A3"|"A4"|"W"|"M";
function S15(f:string){const o:{t:Tier;slot:string;text:string}[]=[];const P=(t:Tier,s:string,x?:string)=>{if(H(f,x))o.push({t,s,text:x!});};
 for(const l of grammarLessons){
  const A=(s:string,t?:string)=>P("A1",s,t);
  A("targetSentence",l.targetSentence);A("dialogueEn",l.dialogueEn);
  for(const d of l.dialogue??[])A("dialogue[].en",d.en);
  for(const e of l.examples)A("examples[].en",e.en);
  for(const v of l.variants??[])A("variants[].en",v.en);
  for(const s of l.sceneSwings??[])A("sceneSwings[].en",s.en);
  for(const b of l.blocks)A("blocks[].text",b.text);
  for(const p of l.practice)A("practice[].answer",p.answer);
  if(l.recall)A("recall.answer",l.recall.answer);
  for(const c of l.contrast??[]){A("contrast[].correct",c.correct);
   if(c.bothRight){if(H(f,c.wrong))o.push({t:"A4",s:"contrast[].wrong(bothRight)",text:c.wrong});}
   else if(H(f,c.wrong))o.push({t:"W",s:"contrast[].wrong",text:c.wrong});
   if(c.wrongMark&&H(f,c.wrongMark))o.push({t:"W",s:"wrongMark",text:c.wrongMark});}
  for(const p of l.practice)for(const d of p.distractors??[])if(H(f,d))o.push({t:"W",s:"distractors",text:d});
  for(const g of l.guided){
   if(g.kind==="spot"){const j=(g.tokens??[]).join(" ");if(H(f,j)||H(f,g.wrongToken)||H(f,g.answer))o.push({t:"W",s:"spot",text:j});}
   else{if(H(f,g.answer))o.push({t:"A2",s:"guided.answer",text:g.answer});
    if(g.replaceBase&&H(f,g.replaceBase))o.push({t:"A3",s:"replaceBase",text:g.replaceBase});
    for(const x of g.options??[])if(H(f,x))o.push({t:x===g.answer?"A2":"W",s:"option",text:x});
    for(const t of g.tokens??[])if(H(f,t))o.push({t:"M",s:"arrange",text:t});}}}
 return o;}
const c1=C1("says"); const s15=S15("says");
const cnt=(t:Tier)=>s15.filter(x=>x.t===t).length;
console.log(`s23 的 C1 计数 = ${c1}`);
console.log(`s15 的 A 合计 = ${s15.filter(x=>["A1","A2","A3","A4"].includes(x.t)).length}  (A1=${cnt("A1")} A2=${cnt("A2")} A3=${cnt("A3")} A4=${cnt("A4")})`);
console.log("\n=== 两边差异定位 ===");
// s15 里有多少 A1
const s15A1=s15.filter(x=>x.t==="A1").length;
console.log(`  s15 的 A1 = ${s15A1}；s23 的 C1 把 A1/A2/A3/A4 合并计 = ${c1}`);
console.log(`  ⇒ s15 A合计 = ${s15A1+cnt("A2")+cnt("A3")+cnt("A4")}`);
console.log(`  ⇒ 若 C1 也应等于 A合计，则差异 = ${s15A1+cnt("A2")+cnt("A3")+cnt("A4") - c1}`);
console.log("\n=== 逐条找 C1 漏掉的 ===");
const s15pos=s15.filter(x=>["A1","A2","A3","A4"].includes(x.t));
console.log(`  s15 正侧条目 ${s15pos.length} 条，C1 ${c1} ⇒ 差 ${s15pos.length-c1} 条（即 s15 有一处多计）`);
// s15 的 blocks 与 dialogueEn 是否重复计
for(const l of grammarLessons){ if(!l.blocks.some(b=>H("says",b.text)))continue;
  const b=l.blocks.filter(b=>H("says",b.text)).length;
  const de=H("says",l.dialogueEn)?1:0;
  const dl=(l.dialogue??[]).filter(d=>H("says",d.en)).length;
  console.log(`  L${l.number}: blocks含says=${b} dialogueEn=${de} dialogue[]=${dl}  target=${H("says",l.targetSentence)?1:0}`);
}
