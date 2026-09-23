import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";
const W = (f: string, t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
// 口径 C1「正侧」= A1+A2+A3+A4（排除 spot.answer 与 bothRight.wrong）
type Tier = "A1"|"A2"|"A3"|"A4"|"W"|"M"|"C";
function scan(f: string) {
  const out: {tier:Tier;lesson:number;slot:string;text:string}[] = [];
  for (const l of grammarLessons) {
    const A=(slot:string,t?:string)=>{if(hit(f,t))out.push({tier:"A1",lesson:l.number,slot,text:t!});};
    A("targetSentence",l.targetSentence);A("dialogueEn",l.dialogueEn);
    for(const d of l.dialogue??[])A("dialogue[].en",d.en);
    for(const e of l.examples)A("examples[].en",e.en);
    for(const v of l.variants??[])A("variants[].en",v.en);
    for(const s of l.sceneSwings??[])A("sceneSwings[].en",s.en);
    for(const b of l.blocks)A("blocks[].text",b.text);
    for(const p of l.practice)A("practice[].answer",p.answer);
    if(l.recall)A("recall.answer",l.recall.answer);
    for(const c of l.contrast??[]){A("contrast[].correct",c.correct);
      if(c.bothRight){if(hit(f,c.wrong))out.push({tier:"A4",lesson:l.number,slot:"contrast[].wrong(bothRight)",text:c.wrong});}
      else if(hit(f,c.wrong))out.push({tier:"W",lesson:l.number,slot:"contrast[].wrong",text:c.wrong});
      if(c.wrongMark&&hit(f,c.wrongMark))out.push({tier:"W",lesson:l.number,slot:"contrast[].wrongMark",text:c.wrongMark});}
    for(const p of l.practice)for(const d of p.distractors??[])if(hit(f,d))out.push({tier:"W",lesson:l.number,slot:"practice[].distractors[]",text:d});
    for(const g of l.guided){
      if(g.kind==="spot"){const j=(g.tokens??[]).join(" ");if(hit(f,j)||hit(f,g.wrongToken)||hit(f,g.answer))out.push({tier:"W",lesson:l.number,slot:"guided[spot]",text:j});}
      else{if(hit(f,g.answer))out.push({tier:"A2",lesson:l.number,slot:"guided[].answer",text:g.answer});
        if(g.replaceBase&&hit(f,g.replaceBase))out.push({tier:"A3",lesson:l.number,slot:"guided[].replaceBase",text:g.replaceBase});
        for(const o of g.options??[])if(hit(f,o))out.push({tier:o===g.answer?"A2":"W",lesson:l.number,slot:o===g.answer?"options==ans":"options!=ans",text:o});
        for(const t of g.tokens??[])if(hit(f,t))out.push({tier:"M",lesson:l.number,slot:"arrange.tokens",text:t});}}
    const C=(slot:string,t?:string)=>{if(hit(f,t))out.push({tier:"C",lesson:l.number,slot,text:t!});};
    for(const d of l.dialogue??[])C("dialogue[].zh",d.zh);
    for(const e of l.examples)C("examples[].zh",e.zh);
    C("oneLineRule",l.oneLineRule);
    for(const g of l.guided){C("guided.explain",g.explain);C("guided.promptZh",g.promptZh);}
    for(const c of l.contrast??[])C("contrast.whyZh",c.whyZh);
    if(l.recall)C("recall.noteZh",l.recall.noteZh);
  }
  return out;
}
function hit(f:string,t?:string){return !!t&&new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`,"i").test(t);}
const cnt=(f:string)=>{const r=scan(f);const g=(t:string)=>r.filter(x=>x.tier===t).length;
  return {A:g("A1")+g("A2")+g("A3")+g("A4"),A1:g("A1"),A2:g("A2"),A3:g("A3"),A4:g("A4"),W:g("W"),M:g("M"),C:g("C"),raw:r};};
console.log("=== 表 A · 本批最终口径（C1 正侧 = A1+A2+A3+A4；排除 spot.answer 与 bothRight.wrong）===");
console.log("form".padEnd(10)+"A1".padStart(5)+"A2".padStart(5)+"A3".padStart(5)+"A4".padStart(5)+"正侧A".padStart(7)+"错侧W".padStart(7)+"歧义M".padStart(7)+"讲解C".padStart(7));
for(const f of ["tell","tells","told","telling","say","says","said","ask","asks","asked"]){
  const c=cnt(f);
  console.log(f.padEnd(10)+String(c.A1).padStart(5)+String(c.A2).padStart(5)+String(c.A3).padStart(5)+String(c.A4).padStart(5)+String(c.A).padStart(7)+String(c.W).padStart(7)+String(c.M).padStart(7)+String(c.C).padStart(7));
}
console.log("\n=== 表 B · 全库任意字段（含中文讲解、含 id/注释的原始文本）===");
import fs from "node:fs";
for(const f of ["src/data/grammarLessons.ts","src/data/huntCases.ts","src/data/grammarZeroTerms.ts"]){
  const s=fs.readFileSync(f,"utf8");
  const o:string[]=[];
  for(const w of ["tell","tells","told","telling"]){const re=new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`,"gi");const m=s.match(re)??[];if(m.length)o.push(`${w}=${m.length}`);}
  console.log(`  ${f.padEnd(34)} ${o.length?o.join("  "):"（0）"}`);
}
console.log("\n=== 表 C · tells 的「如果立课」素材盘点（L25 三单课可提供的模板）===");
{const l25=grammarLessons.find(l=>l.number===25)!;
 console.log(`  L25 target: ${l25.targetSentence}`);
 console.log(`  L25 「他/她/它加 -s」的动词例：drinks / likes / plays / watches / studies / rains / has`);
 console.log(`  tell 的 -s 形在 L25 里出现? ${W("tells",l25.targetSentence+l25.examples.map(e=>e.en).join(" "))}`);
 console.log(`  全库 tells 出现次数: ${cnt("tells").A} （正侧）`);
}
console.log("\n=== 表 D · 5 处 tell 所在课的 npc 首句句式模板 ===");
console.log("  'Tell me about your X.' 出现 4 次: L101(X=last night) L110(week) L117(family) L185(cousin)");
console.log("  'Can you tell me about your X?' 出现 1 次: L41(X=class)");
console.log("  对照：'What did you ...' 3 次 (L10,L11,L198)；'What do you ...' 5 次");
console.log("\n=== 表 E · 那 5 课的 npc 行是否又被引导/练习/回忆复用 ===");
for(const n of [41,101,110,117,185]){
  const l=grammarLessons.find(x=>x.number===n)!;
  const npc=(l.dialogue??[])[0]?.en??"";
  const inAns=[...l.guided.map(g=>g.answer),...(l.guided.map(g=>g.replaceBase)??[]),...l.practice.map(p=>p.answer),l.recall?.answer??""].filter(Boolean);
  const reused=inAns.some(a=>a===npc);
  console.log(`  L${n}: npc 句被复用作答案? ${reused?"✓":"✗ 从未"}  |  intentZh=${JSON.stringify(l.intentZh)}`);
}
