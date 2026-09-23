import { grammarLessons } from "../../../../src/data/grammarLessons";
const WB=(f:string)=>new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`,"i");
const H=(f:string,t?:string)=>!!t&&WB(f).test(t);
// 复刻 s15 的口径（A1 含 dialogueEn 与 dialogue[].en）
const out:string[]=[];
for(const l of grammarLessons){
  const A=(s:string,t?:string)=>{if(H("says",t))out.push(`A1 L${l.number}.${s} :: ${JSON.stringify(t)}`);};
  A("targetSentence",l.targetSentence);A("dialogueEn",l.dialogueEn);
  for(const d of l.dialogue??[])A("dialogue[].en",d.en);
  for(const e of l.examples)A("examples[].en",e.en);
  for(const v of l.variants??[])A("variants[].en",v.en);
  for(const s of l.sceneSwings??[])A("sceneSwings[].en",s.en);
  for(const b of l.blocks)A("blocks[].text",b.text);
  for(const p of l.practice)A("practice[].answer",p.answer);
  if(l.recall)A("recall.answer",l.recall.answer);
  for(const c of l.contrast??[]){A("contrast[].correct",c.correct);if(c.bothRight)A("contrast[].wrong(bothRight)",c.wrong);}
  for(const g of l.guided){if(g.kind==="spot"){const j=(g.tokens??[]).join(" ");if(H("says",j)||H("says",g.wrongToken)||H("says",g.answer))out.push(`W L${l.number}.guided[spot] :: ${JSON.stringify(j)}`);}
    else{if(H("says",g.answer))out.push(`A2 L${l.number}.guided[].answer :: ${JSON.stringify(g.answer)}`);
      if(g.replaceBase&&H("says",g.replaceBase))out.push(`A3 L${l.number}.replaceBase :: ${JSON.stringify(g.replaceBase)}`);
      for(const o of g.options??[])if(H("says",o))out.push(`${o===g.answer?"A2":"W"} L${l.number}.options :: ${JSON.stringify(o)}`);
      for(const t of g.tokens??[])if(H("says",t))out.push(`M L${l.number}.arrange.tokens :: ${JSON.stringify(t)}`);}}
}
console.log("=== says 全部落点（区分 tier）===");
for(const o of out) console.log("  "+o);
const pos=out.filter(o=>o.startsWith("A1")||o.startsWith("A2")||o.startsWith("A3")).length;
console.log(`\n  正侧（A1+A2+A3，不含 A4/A3 重复计）= ${pos}`);
console.log(`  A1 = ${out.filter(o=>o.startsWith("A1")).length}`);
console.log(`  A2 = ${out.filter(o=>o.startsWith("A2")).length}`);
console.log(`  W  = ${out.filter(o=>o.startsWith("W")).length}`);
console.log(`  M  = ${out.filter(o=>o.startsWith("M")).length}`);
console.log("\n=== 去重后物理句数 ===");
const uniq=[...new Set(out.filter(o=>o.startsWith("A1")||o.startsWith("A2")||o.startsWith("A3")).map(o=>o.split(":: ")[1]))];
console.log(`  ${uniq.length} 句`);
uniq.forEach(u=>console.log(`    ${u}`));
