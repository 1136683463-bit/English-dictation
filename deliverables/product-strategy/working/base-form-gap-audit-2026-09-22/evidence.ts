import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";
const r=(f:string,t?:string)=>!!t && new RegExp(`\\b${f}\\b`,"i").test(t);
const FORMS=["lose","lost","break","broke","broken","wear","wears","wore","worn","losing","breaking","wearing"];

console.log("############ 错侧原文（逐条，带课号/槽位）############");
for (const l of grammarLessons) {
  for (const c of l.contrast ?? []) {
    for (const f of FORMS) if (r(f,c.wrong)) console.log(`L${l.number} [${l.id}] contrast.wrong  ${JSON.stringify(c.wrong)}\n        wrongMark=${JSON.stringify(c.wrongMark)}  correct=${JSON.stringify(c.correct)}\n        whyZh=${JSON.stringify(c.whyZh)}`);
  }
  for (const p of l.practice) for (const d of p.distractors ?? []) for (const f of FORMS) if (r(f,d))
    console.log(`L${l.number} practice.distractor  ${JSON.stringify(d)}  (answer=${JSON.stringify(p.answer)} | ${p.promptZh})`);
  for (const g of l.guided) {
    if (g.kind==="spot") { const j=(g.tokens??[]).join(" ");
      for (const f of FORMS) if (r(f,j)) console.log(`L${l.number} guided[spot]  tokens=${JSON.stringify(g.tokens)} wrongToken=${JSON.stringify(g.wrongToken)} correctionZh=${JSON.stringify(g.correctionZh)}`);
    } else {
      for (const o of g.options ?? []) if (o!==g.answer) for (const f of FORMS) if (r(f,o))
        console.log(`L${l.number} guided[${g.kind}].option(错项)  ${JSON.stringify(o)}  options=${JSON.stringify(g.options)} answer=${JSON.stringify(g.answer)} promptZh=${JSON.stringify(g.promptZh)}`);
    }
  }
}

console.log("\n############ 正确侧原文（lose/break/wear 原形 —— 应为空）############");
let n=0;
for (const l of grammarLessons) {
  const slots: [string,string|undefined][] = [
    ["targetSentence",l.targetSentence],["dialogueEn",l.dialogueEn],
    ...(l.dialogue??[]).map(d=>["dialogue.en",d.en] as [string,string]),
    ...l.examples.map(e=>["examples.en",e.en] as [string,string]),
    ...(l.variants??[]).map(v=>["variants.en",v.en] as [string,string]),
    ...(l.sceneSwings??[]).map(s=>["sceneSwings.en",s.en] as [string,string]),
    ...l.blocks.map(b=>["blocks.text",b.text] as [string,string]),
    ...l.practice.map(p=>["practice.answer",p.answer] as [string,string]),
    ...(l.recall?[["recall.answer",l.recall.answer] as [string,string]]:[]),
    ...(l.contrast??[]).map(c=>["contrast.correct",c.correct] as [string,string]),
  ];
  for (const [s,t] of slots) for (const f of ["lose","break","wear"]) if (r(f,t)) { console.log(`L${l.number} ${s}: ${JSON.stringify(t)}`); n++; }
}
console.log(n===0 ? "  >>> 确认为 0：正确句中 lose/break/wear 原形零出现 <<<" : `  >>> 共 ${n} 处 <<<`);

console.log("\n############ huntCases 命中明细 ############");
for (const c of huntCases) {
  for (const f of FORMS) if (r(f,c.tokens.join(" "))) {
    const errs = c.errors.filter(e=>r(f,e.original)||r(f,e.correction));
    console.log(`${c.id} (案${c.number}): ${JSON.stringify(c.tokens.join(" "))}`);
    console.log(`    错词: ${JSON.stringify(errs.map(e=>({tokenIndex:e.tokenIndex,tag:e.tag,original:e.original,correction:e.correction})))}`);
  }
}
