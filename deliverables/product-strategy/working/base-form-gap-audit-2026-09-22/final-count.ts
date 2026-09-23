import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";
const hit=(f:string,t?:string)=>!!t && new RegExp(`\\b${f}\\b`,"i").test(t);

type Row = { lesson:number; tier:string; slot:string; text:string };
function tier(f:string, includeBothRightAsCorrect:boolean): Row[] {
  const out:Row[]=[];
  for (const l of grammarLessons) {
    const A=(slot:string,t?:string)=>{ if(hit(f,t)) out.push({lesson:l.number,tier:"A",slot,text:t!}); };
    const B=(slot:string,t?:string)=>{ if(hit(f,t)) out.push({lesson:l.number,tier:"B",slot,text:t!}); };
    A("targetSentence",l.targetSentence); A("dialogueEn",l.dialogueEn);
    for (const d of l.dialogue??[]) A("dialogue[].en",d.en);
    for (const e of l.examples) A("examples[].en",e.en);
    for (const v of l.variants??[]) A("variants[].en",v.en);
    for (const s of l.sceneSwings??[]) A("sceneSwings[].en",s.en);
    for (const b of l.blocks) A("blocks[].text",b.text);
    for (const p of l.practice) A("practice[].answer",p.answer);
    if(l.recall) A("recall.answer",l.recall.answer);
    for (const c of l.contrast??[]) {
      A("contrast[].correct",c.correct);
      // bothRight=true ⇒ wrong 字段其实也是正确句
      if (c.bothRight && includeBothRightAsCorrect) A("contrast[].wrong(bothRight=true)",c.wrong);
      else B("contrast[].wrong",c.wrong);
      if (c.wrongMark) B("contrast[].wrongMark",c.wrongMark);
    }
    for (const p of l.practice) for (const d of p.distractors??[]) B("practice[].distractors[]",d);
    for (const g of l.guided) {
      if (g.kind==="spot") { const j=(g.tokens??[]).join(" "); if(hit(f,j)||hit(f,g.wrongToken)||hit(f,g.answer)) B("guided[spot](折叠)",j); }
      else { A("guided[].answer",g.answer); A("guided[].replaceBase",g.replaceBase);
             for (const o of g.options??[]) (o===g.answer?A:B)(o===g.answer?"guided[].options[](==ans)":"guided[].options[](!=ans)",o);
             for (const t of g.tokens??[]) { if(hit(f,t)) out.push({lesson:l.number,tier:"M",slot:"guided[arrange].tokens(歧义)",text:t}); } }
    }
  }
  return out;
}

console.log("=== 最终计数（A=正确句含 bothRight 的 wrong 字段 / B=纯错侧 / M=歧义）===");
console.log("form".padEnd(9)+"A正确".padStart(8)+"A(不含bothRight)".padStart(17)+"B错侧".padStart(8)+"M歧义".padStart(8));
for (const f of ["lose","loses","losing","lost","break","breaks","breaking","broke","broken","wear","wears","wearing","wore","worn"]) {
  const withBR = tier(f,true), without = tier(f,false);
  const A1=withBR.filter(x=>x.tier==="A").length, A2=without.filter(x=>x.tier==="A").length;
  const B=withBR.filter(x=>x.tier==="B").length, M=withBR.filter(x=>x.tier==="M").length;
  console.log(f.padEnd(9)+String(A1).padStart(8)+String(A2).padStart(17)+String(B).padStart(8)+String(M).padStart(8));
}

console.log("\n=== 原形的『错侧』逐条（B 档，含课号与槽位）===");
for (const f of ["lose","break","wear"]) {
  console.log(`\n--- ${f} ---`);
  const rows = tier(f,true).filter(x=>x.tier==="B");
  const seen=new Set<string>();
  for (const r of rows) { const k=`${r.lesson}|${r.text}`; if(seen.has(k))continue; seen.add(k);
    console.log(`  L${r.lesson} [${r.slot}] ${JSON.stringify(r.text.slice(0,110))}`); }
  console.log(`  小计（去重后）: ${seen.size}`);
}

console.log("\n=== huntCases 里原形作为『要改的错词』===");
for (const c of huntCases) {
  for (const f of ["lose","break","wear"]) {
    const e = c.errors.find(x=>hit(f,x.original));
    if (e) console.log(`  ${c.id} [案${c.number}]: ${JSON.stringify(e.original)} → ${JSON.stringify(e.correction)} (tag=${e.tag})`);
  }
}
