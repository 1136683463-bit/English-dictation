import { grammarLessons } from "../../../../src/data/grammarLessons";
const hit=(f:string,t?:string)=>!!t && new RegExp(`\\b${f}\\b`,"i").test(t);
type R={tier:string;n:number;slot:string;text:string};
function scan(f:string):R[]{
  const o:R[]=[];
  for(const l of grammarLessons){
    const A=(slot:string,t?:string)=>{ if(hit(f,t)) o.push({tier:"A1",n:l.number,slot,text:t!}); };
    A("targetSentence",l.targetSentence); A("dialogueEn",l.dialogueEn);
    for(const d of l.dialogue??[]) A("dialogue.en",d.en);
    for(const e of l.examples) A("examples.en",e.en);
    for(const v of l.variants??[]) A("variants.en",v.en);
    for(const s of l.sceneSwings??[]) A("sceneSwings.en",s.en);
    for(const b of l.blocks) A("blocks.text",b.text);
    for(const p of l.practice) A("practice.answer",p.answer);
    if(l.recall) A("recall.answer",l.recall.answer);
    for(const c of l.contrast??[]){
      A("contrast.correct",c.correct);
      if(c.bothRight){ if(hit(f,c.wrong)) o.push({tier:"A4",n:l.number,slot:"contrast.wrong(bothRight)",text:c.wrong}); }
      else if(hit(f,c.wrong)) o.push({tier:"W",n:l.number,slot:"contrast.wrong",text:c.wrong});
      if(c.wrongMark&&hit(f,c.wrongMark)) o.push({tier:"W",n:l.number,slot:"contrast.wrongMark",text:c.wrongMark});
    }
    for(const p of l.practice) for(const d of p.distractors??[]) if(hit(f,d)) o.push({tier:"W",n:l.number,slot:"practice.distractor",text:d});
    for(const g of l.guided){
      if(g.kind==="spot"){ const j=(g.tokens??[]).join(" "); if(hit(f,j)||hit(f,g.wrongToken)||hit(f,g.answer)) o.push({tier:"W",n:l.number,slot:"guided.spot(折叠)",text:j}); }
      else { if(hit(f,g.answer)) o.push({tier:"A2",n:l.number,slot:"guided.answer",text:g.answer});
             if(g.replaceBase&&hit(f,g.replaceBase)) o.push({tier:"A3",n:l.number,slot:"guided.replaceBase",text:g.replaceBase});
             for(const x of g.options??[]) if(hit(f,x)) o.push({tier:x===g.answer?"A2":"W",n:l.number,slot:x===g.answer?"option(==ans)":"option(!=ans)",text:x});
             for(const t of g.tokens??[]) if(hit(f,t)) o.push({tier:"M",n:l.number,slot:"arrange.tokens(歧义)",text:t}); }
    }
    const C=(slot:string,t?:string)=>{ if(hit(f,t)) o.push({tier:"C",n:l.number,slot,text:t!}); };
    C("oneLineRule",l.oneLineRule); C("summary.rule",l.summary?.rule);
    for(const p of l.summary?.points??[]) C("summary.points",p);
    for(const p of l.deepDive?.paragraphs??[]) C("deepDive",p);
    for(const g of l.guided){C("guided.explain",g.explain);C("guided.correctionZh",g.correctionZh);C("guided.promptZh",g.promptZh);C("guided.replaceTarget",g.replaceTarget);}
    for(const c of l.contrast??[]) C("contrast.whyZh",c.whyZh);
    for(const v of l.variants??[]) C("variants.noteZh",v.noteZh);
    if(l.recall) C("recall.noteZh",l.recall.noteZh);
    for(const d of l.dialogue??[]) C("dialogue.zh",d.zh);
    for(const s of l.sceneSwings??[]) C("sceneSwings.zh",s.zh);
    for(const e of l.examples) C("examples.zh",e.zh);
    for(const p of l.practice) C("practice.promptZh",p.promptZh);
  }
  return o;
}
const W=["id","dog","careful","grandpa","loud","august","knock","blackboard","end","bore","gave","gave","give","carefully","loudly","dogs"];
console.log("word".padEnd(12)+"A1".padStart(5)+"A2".padStart(5)+"A4".padStart(5)+"A合计".padStart(7)+"W错侧".padStart(7)+"M".padStart(4)+"C讲解".padStart(7));
for(const f of [...new Set(W)]){ const r=scan(f);
  const g=(t:string)=>r.filter(x=>x.tier===t).length;
  console.log(f.padEnd(12)+String(g("A1")).padStart(5)+String(g("A2")).padStart(5)+String(g("A4")).padStart(5)+String(g("A1")+g("A2")+g("A3")+g("A4")).padStart(7)+String(g("W")).padStart(7)+String(g("M")).padStart(4)+String(g("C")).padStart(7));
}
console.log("\n=== gave / give 逐条 ===");
for(const f of ["gave","give"]){ console.log(`\n--- ${f} ---`);
  for(const r of scan(f)) console.log(`  L${r.n} [${r.tier}] ${r.slot}: ${JSON.stringify(r.text.slice(0,100))}`); }
console.log("\n=== dog 逐条 ===");
for(const r of scan("dog")) console.log(`  L${r.n} [${r.tier}] ${r.slot}: ${JSON.stringify(r.text.slice(0,100))}`);
console.log("\n=== grandpa 逐条（验证所有格假命中）===");
for(const r of scan("grandpa")) console.log(`  L${r.n} [${r.tier}] ${r.slot}: ${JSON.stringify(r.text.slice(0,90))}`);
console.log("\n=== careful / loud 逐条 ===");
for(const f of ["careful","loud"]){ console.log(`--- ${f} ---`);
  for(const r of scan(f)) console.log(`  L${r.n} [${r.tier}] ${r.slot}: ${JSON.stringify(r.text.slice(0,100))}`); }
