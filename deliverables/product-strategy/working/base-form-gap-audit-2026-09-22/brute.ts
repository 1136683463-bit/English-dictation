import { grammarLessons } from "../../../../src/data/grammarLessons";
const hit=(f:string,t?:string)=>!!t && new RegExp(`\\b${f}\\b`,"i").test(t);

// 拆到最细的槽位层，然后穷举子集找 (lost, broke) 的目标组合
const SLOTS = ["targetSentence","dialogueEn","dialogue.en","examples.en","variants.en","sceneSwings.en","blocks.text","practice.answer","recall.answer","contrast.correct","guided.answer","guided.replaceBase","guided.tokens.(非spot,歧义)","guided.options(==ans)","guided.options(!=ans)","guided.spot(折叠)","contrast.wrong","contrast.wrongMark","practice.distractors","C(讲解)"] as const;
type S = typeof SLOTS[number];
const store: Record<S, Record<string, number>> = {} as any;
for (const s of SLOTS) store[s] = {};

for (const l of grammarLessons) {
  const bump=(s:S,f:string,t?:string)=>{ if(t&&hit(f,t)) store[s][f]=(store[s][f]??0)+1; };
  for (const f of ["lost","broke","broken","wear","lose","break"]) {
    bump("targetSentence",f,l.targetSentence); bump("dialogueEn",f,l.dialogueEn);
    for (const d of l.dialogue??[]) bump("dialogue.en",f,d.en);
    for (const e of l.examples) bump("examples.en",f,e.en);
    for (const v of l.variants??[]) bump("variants.en",f,v.en);
    for (const w of l.sceneSwings??[]) bump("sceneSwings.en",f,w.en);
    for (const b of l.blocks) bump("blocks.text",f,b.text);
    for (const p of l.practice) bump("practice.answer",f,p.answer);
    if(l.recall) bump("recall.answer",f,l.recall.answer);
    for (const c of l.contrast??[]) { bump("contrast.correct",f,c.correct); bump("contrast.wrong",f,c.wrong); if(c.wrongMark) bump("contrast.wrongMark",f,c.wrongMark); }
    for (const p of l.practice) for (const d of p.distractors??[]) bump("practice.distractors",f,d);
    for (const g of l.guided) {
      if (g.kind==="spot") { const j=(g.tokens??[]).join(" "); if(hit(f,j)||hit(f,g.wrongToken)||hit(f,g.answer)) bump("guided.spot(折叠)",f,j); }
      else { bump("guided.answer",f,g.answer); bump("guided.replaceBase",f,g.replaceBase); bump("guided.tokens.(非spot,歧义)",f,(g.tokens??[]).join(" | "));
             for (const o of g.options??[]) bump(o===g.answer?"guided.options(==ans)":"guided.options(!=ans)",f,o); }
    }
    const C=[l.oneLineRule,l.summary?.rule,...(l.summary?.points??[]),...(l.deepDive?.paragraphs??[]),
      ...l.guided.flatMap(g=>[g.explain,g.correctionZh,g.promptZh,g.replaceTarget]),
      ...(l.contrast??[]).map(c=>c.whyZh),...(l.variants??[]).map(v=>v.noteZh),l.recall?.noteZh,
      ...(l.dialogue??[]).map(d=>d.zh),...(l.sceneSwings??[]).map(s=>s.zh),...l.examples.map(e=>e.zh),
      ...l.practice.map(p=>p.promptZh),l.title,l.grammarLabel,l.episode,l.intentZh,l.dialogueZh,l.sceneSetupZh,
      l.recall?.intentZh,l.recall?.promptZh];
    for (const t of C) bump("C(讲解)",f,t);
  }
}
console.log("=== 细槽位矩阵 ===");
console.log("slot".padEnd(32)+["lost","broke","broken","wear","lose","break"].map(s=>s.padStart(7)).join(""));
for (const s of SLOTS) console.log(s.padEnd(32)+["lost","broke","broken","wear","lose","break"].map(f=>String(store[s][f]??0).padStart(7)).join(""));

console.log("\n=== 穷举子集：找 (lost=50, broke=25) 的组合 ===");
const found: {mask:number,total:{[k:string]:number}}[] = [];
const n = SLOTS.length;
for (let mask=0; mask < (1<<n); mask++) {
  let L=0,B=0;
  for (let i=0;i<n;i++) if (mask & (1<<i)) { L+=store[SLOTS[i]]["lost"]??0; B+=store[SLOTS[i]]["broke"]??0; }
  if (L===50 && B===25) found.push({mask, total:{}});
}
console.log("精确命中 (50,25) 的组合数:", found.length);
for (const x of found.slice(0,12)) {
  const names = SLOTS.filter((_,i)=>x.mask & (1<<i));
  const other = ["lost","broke","broken","wear","lose","break"].map(f=>`${f}=${names.reduce((a,s)=>a+(store[s][f]??0),0)}`).join(" ");
  console.log("   [" + names.join(" + ") + "]  →  " + other);
}
// 也找接近的
console.log("\n=== 接近 (50±1, 25) 的组合 ===");
let cnt=0;
for (let mask=0; mask<(1<<n) && cnt<8; mask++) {
  let L=0,B=0;
  for (let i=0;i<n;i++) if (mask & (1<<i)) { L+=store[SLOTS[i]]["lost"]??0; B+=store[SLOTS[i]]["broke"]??0; }
  if (Math.abs(L-50)<=1 && B===25) cnt++;
}
console.log("计数:", cnt);
