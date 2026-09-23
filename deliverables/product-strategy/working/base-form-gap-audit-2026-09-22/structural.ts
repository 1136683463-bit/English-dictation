import { grammarLessons } from "../../../../src/data/grammarLessons";
const hit=(f:string,t?:string)=>!!t && new RegExp(`\\b${f}\\b`,"i").test(t);

console.log("=== 1) 原形 lose/break/wear 出现的唯一场合（逐条，含所属课）===");
for (const f of ["lose","break","wear"]) {
  console.log(`\n--- ${f} ---`);
  for (const l of grammarLessons) {
    const scan=(slot:string,t?:string)=>{ if(hit(f,t)) console.log(`  L${l.number} ${slot}: ${JSON.stringify(t!.slice(0,120))}`); };
    scan("contrast.wrong", ...([] as any));
    for (const c of l.contrast??[]) { scan("contrast.wrong",c.wrong); if(c.wrongMark) scan("contrast.wrongMark",c.wrongMark); }
    for (const p of l.practice) for (const d of p.distractors??[]) scan("practice.distractor",d);
    for (const g of l.guided) { scan("guided.answer",g.answer); for(const o of g.options??[]) scan("guided.option",o); scan("guided.tokens",(g.tokens??[]).join(" ")); }
  }
}

console.log("\n=== 2) 被动/不及物的 break：正确侧有没有 ===");
for (const l of grammarLessons) {
  const A=[l.targetSentence,l.dialogueEn,...(l.dialogue??[]).map(d=>d.en),...l.examples.map(e=>e.en),
    ...(l.variants??[]).map(v=>v.en),...(l.sceneSwings??[]).map(s=>s.en),...l.blocks.map(b=>b.text),
    ...l.practice.map(p=>p.answer),l.recall?.answer,...(l.contrast??[]).map(c=>c.correct)];
  for (const t of A) if (/\bbroke\b/i.test(t!) && /window|cup|glass|vase/i.test(t!)) console.log(`  L${l.number}: ${JSON.stringify(t)}`);
}

console.log("\n=== 3) L39 / L41 的 wears 场景：是否教过复数主语 who wear ===");
for (const n of [39,41]) {
  const l = grammarLessons.find(x=>x.number===n)!;
  console.log(`\n--- L${n} [${l.id}] ${l.title} ---`);
  console.log("  targetSentence:", JSON.stringify(l.targetSentence));
  console.log("  oneLineRule:", JSON.stringify(l.oneLineRule));
  console.log("  contrast 所有 wrong:", JSON.stringify(l.contrast?.map(c=>c.wrong)));
  console.log("  是否有复数 who wear 的正确句:", /who wear\b/i.test(JSON.stringify(l)) ? "有" : "无");
}

console.log("\n=== 4) 全库：'who wear'（复数原形）在任何槽位出现过吗 ===");
{
  const all=JSON.stringify(grammarLessons);
  console.log("  /who wear\\b/i :", /who wear\b/i.test(all));
  console.log("  /who wear(s)?/gi 匹配:", (all.match(/who wear/gi)??[]).length);
  console.log("  /boys? who|children who|they wear/gi:", (all.match(/boys? who|children who|they wear/gi)??[]).length);
}

console.log("\n=== 5) hunt-question-words：did you lose 是正确答案吗 ===");
import { huntCases } from "../../../../src/data/huntCases";
const c = huntCases.find(x=>x.id==="hunt-question-words")!;
console.log("  tokens:", JSON.stringify(c.tokens.join(" ")));
console.log("  errors:", JSON.stringify(c.errors.map(e=>({i:e.tokenIndex,t:e.tag,o:e.original,c:e.correction})), null, 1));
console.log("  notes:", JSON.stringify(c.notes));
