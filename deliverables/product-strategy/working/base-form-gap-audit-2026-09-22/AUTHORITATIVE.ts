import { readFileSync } from "node:fs";
import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";

/* ============================== 权威口径 V3 ==============================
   词边界正则（node），排除 lesson.id / cover / scene / 源码注释
   正侧 A：用户看到的「正确英文句子」
      A1 无歧义正确句槽（targetSentence/dialogue/en/examples/variants/sceneSwings/blocks/
                          practice.answer/recall.answer/contrast.correct）
      A2 正确答案字段（guided 非 spot 的 answer；spot 的 answer 是错词，排除）
      A3 替换基句 replaceBase
      A4 contrast.wrong 但 bothRight=true（该字段其实是正确句）
   错侧 W：contrast.wrong(!bothRight) / wrongMark / practice.distractors[] /
           guided.options(!=answer) / guided[spot](tokens+wrongToken+answer 折叠为 1)
   歧义 M：guided[arrange].tokens[]（类型注释明说「arrange 含干扰项」，无法定性）
   讲解 C：中英混排讲解字段
   ======================================================================== */
const hit=(f:string,t?:string)=>!!t && new RegExp(`\\b${f}\\b`,"i").test(t);
type Tier="A1"|"A2"|"A3"|"A4"|"W"|"M"|"C";
function scan(f:string){
  const out:{tier:Tier;lesson:number;slot:string;text:string}[]=[];
  const P=(tier:Tier,slot:string,t?:string)=>{ if(hit(f,t)) out.push({tier,lesson:0,slot,text:t!}); };
  for (const l of grammarLessons) {
    const A=(slot:string,t?:string)=>{ if(hit(f,t)) out.push({tier:"A1",lesson:l.number,slot,text:t!}); };
    A("targetSentence",l.targetSentence); A("dialogueEn",l.dialogueEn);
    for(const d of l.dialogue??[]) A("dialogue[].en",d.en);
    for(const e of l.examples) A("examples[].en",e.en);
    for(const v of l.variants??[]) A("variants[].en",v.en);
    for(const s of l.sceneSwings??[]) A("sceneSwings[].en",s.en);
    for(const b of l.blocks) A("blocks[].text",b.text);
    for(const p of l.practice) A("practice[].answer",p.answer);
    if(l.recall) A("recall.answer",l.recall.answer);
    for(const c of l.contrast??[]){
      A("contrast[].correct",c.correct);
      if(c.bothRight){ if(hit(f,c.wrong)) out.push({tier:"A4",lesson:l.number,slot:"contrast[].wrong(bothRight=true→其实是正确句)",text:c.wrong}); }
      else { if(hit(f,c.wrong)) out.push({tier:"W",lesson:l.number,slot:"contrast[].wrong",text:c.wrong}); }
      if(c.wrongMark&&hit(f,c.wrongMark)) out.push({tier:"W",lesson:l.number,slot:"contrast[].wrongMark",text:c.wrongMark});
    }
    for(const p of l.practice) for(const d of p.distractors??[]) if(hit(f,d)) out.push({tier:"W",lesson:l.number,slot:"practice[].distractors[]",text:d});
    for(const g of l.guided){
      if(g.kind==="spot"){ const j=(g.tokens??[]).join(" "); if(hit(f,j)||hit(f,g.wrongToken)||hit(f,g.answer))
        out.push({tier:"W",lesson:l.number,slot:"guided[spot]（tokens+wrongToken+answer 折叠为1）",text:j}); }
      else { if(hit(f,g.answer)) out.push({tier:"A2",lesson:l.number,slot:"guided[].answer",text:g.answer});
             if(g.replaceBase&&hit(f,g.replaceBase)) out.push({tier:"A3",lesson:l.number,slot:"guided[].replaceBase",text:g.replaceBase});
             for(const o of g.options??[]) if(hit(f,o)) out.push({tier:o===g.answer?"A2":"W",lesson:l.number,slot:o===g.answer?"guided[].options[](==answer)":"guided[].options[](!=answer)",text:o});
             for(const t of g.tokens??[]) if(hit(f,t)) out.push({tier:"M",lesson:l.number,slot:"guided[arrange].tokens[]（歧义）",text:t}); }
    }
    const C=(slot:string,t?:string)=>{ if(hit(f,t)) out.push({tier:"C",lesson:l.number,slot,text:t!}); };
    C("oneLineRule",l.oneLineRule); C("summary.rule",l.summary?.rule);
    for(const p of l.summary?.points??[]) C("summary.points[]",p);
    for(const p of l.deepDive?.paragraphs??[]) C("deepDive.paragraphs[]",p);
    for(const g of l.guided){C("guided[].explain",g.explain);C("guided[].correctionZh",g.correctionZh);C("guided[].promptZh",g.promptZh);C("guided[].replaceTarget",g.replaceTarget);}
    for(const c of l.contrast??[]) C("contrast[].whyZh",c.whyZh);
    for(const v of l.variants??[]) C("variants[].noteZh",v.noteZh);
    if(l.recall) C("recall.noteZh",l.recall.noteZh);
    for(const d of l.dialogue??[]) C("dialogue[].zh",d.zh);
    for(const s of l.sceneSwings??[]) C("sceneSwings[].zh",s.zh);
    for(const e of l.examples) C("examples[].zh",e.zh);
    for(const p of l.practice) C("practice[].promptZh",p.promptZh);
    C("title",l.title); C("grammarLabel",l.grammarLabel); C("episode",l.episode);
    C("intentZh",l.intentZh); C("dialogueZh",l.dialogueZh); C("sceneSetupZh",l.sceneSetupZh);
    if(l.recall){C("recall.intentZh",l.recall.intentZh);C("recall.promptZh",l.recall.promptZh);}
  }
  return out;
}
const FORMS=["lose","loses","losing","lost","break","breaks","breaking","broke","broken",
             "wear","wears","wearing","wore","worn","sleep","slept","draw","drew","drawn"];
console.log("=== 权威计数 V3（课字段）===");
console.log("form".padEnd(9)+["A1","A2","A3","A4","A=A1+A2+A3+A4","W错侧","M歧义","C讲解"].map(s=>s.padStart(14)).join(""));
const T:Record<string,Record<string,number>>={};
for(const f of FORMS){ const r=scan(f); const c:Record<string,number>={};
  for(const k of ["A1","A2","A3","A4","W","M","C"]) c[k]=r.filter(x=>x.tier===k).length;
  c.A=c.A1+c.A2+c.A3+c.A4; T[f]=c;
  console.log(f.padEnd(9)+["A1","A2","A3","A4","A","W","M","C"].map(k=>String(c[k]).padStart(14)).join(""));
}
console.log("\n=== 与简报对照 ===");
const BRIEF:Record<string,number|string>={lose:0,lost:50,break:0,broke:25,wear:0,wore:0,wears:"—"};
console.log("form".padEnd(9)+"简报值".padStart(9)+"本批 V3(A1)".padStart(14)+"本批 V3(A)".padStart(13)+"错侧W".padStart(8));
for(const f of Object.keys(BRIEF)) console.log(f.padEnd(9)+String(BRIEF[f]).padStart(9)+String(T[f].A1).padStart(14)+String(T[f].A).padStart(13)+String(T[f].W).padStart(8));
console.log("\n=== huntCases（211 案）===");
for(const f of ["lose","lost","break","broke","broken","wear","wears","wore","worn","worn"]) {
  const asErr:string[]=[], asCorr:string[]=[], inTok:string[]=[];
  for(const c of huntCases){ if(hit(f,c.tokens.join(" "))) inTok.push(c.id);
    for(const e of c.errors){ if(hit(f,e.original)) asErr.push(`${c.id}(${e.original}→${e.correction})`); if(hit(f,e.correction)) asCorr.push(`${c.id}(${e.correction})`); } }
  console.log(`  ${f.padEnd(9)} tokens=${inTok.length} 作为错词=${asErr.length} 出现在纠正=${asCorr.length}   ${asErr.join(", ")}`);
}
console.log("\n=== 原始文本词边界计数（对照，含 id/注释）===");
const src=readFileSync("src/data/grammarLessons.ts","utf8");
for(const f of ["lose","break","wear","wore","worn","lost","broke","broken","wears"])
  console.log(`  ${f.padEnd(9)} ${(src.match(new RegExp(`\\b${f}\\b`,"gi"))??[]).length}`);
