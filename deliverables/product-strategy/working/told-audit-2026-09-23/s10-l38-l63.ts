import { grammarLessons } from "../../../../src/data/grammarLessons";
const W = (f: string, t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
const pick = (n: number) => grammarLessons.find(l => l.number === n)!;
console.log("=== 全部含「告诉」的课程字段 ===");
for (const l of grammarLessons) {
  const blob: [string, string][] = [];
  const push = (s: string, t?: string) => { if (t && t.includes("告诉")) blob.push([s, t]); };
  push("targetSentence", l.targetSentence); push("oneLineRule", l.oneLineRule); push("intentZh", l.intentZh);
  push("title", l.title); push("grammarLabel", l.grammarLabel); push("sceneSetupZh", l.sceneSetupZh);
  l.examples.forEach((e, i) => { push(`examples[${i}].zh`, e.zh); push(`examples[${i}].en`, e.en); });
  (l.contrast ?? []).forEach((c, i) => { push(`contrast[${i}].whyZh`, c.whyZh); push(`contrast[${i}].correct`, c.correct); push(`contrast[${i}].wrong`, c.wrong); });
  l.guided.forEach((g, i) => { push(`guided[${i}].promptZh`, g.promptZh); push(`guided[${i}].explain`, g.explain); push(`guided[${i}].correctionZh`, g.correctionZh); push(`guided[${i}].answer`, g.answer); });
  l.practice.forEach((p, i) => { push(`practice[${i}].promptZh`, p.promptZh); push(`practice[${i}].answer`, p.answer); });
  (l.variants ?? []).forEach((v, i) => push(`variants[${i}].noteZh`, v.noteZh));
  (l.variants ?? []).forEach((v, i) => push(`variants[${i}].en`, v.en));
  (l.sceneSwings ?? []).forEach((s, i) => { push(`sceneSwings[${i}].en`, s.en); push(`sceneSwings[${i}].zh`, s.zh); });
  (l.dialogue ?? []).forEach((d, i) => { push(`dialogue[${i}].en`, d.en); push(`dialogue[${i}].zh`, d.zh); });
  if (l.recall) { push("recall.answer", l.recall.answer); push("recall.noteZh", l.recall.noteZh); push("recall.promptZh", l.recall.promptZh); }
  (l.summary?.points ?? []).forEach((p, i) => push(`summary.points[${i}]`, p));
  push("summary.rule", l.summary?.rule);
  (l.deepDive?.paragraphs ?? []).forEach((p, i) => push(`deepDive[${i}]`, p));
  push("deepDive.title", l.deepDive?.title);
  if (blob.length) {
    console.log(`\n--- L${l.number} ${l.title} [${l.grammarLabel}] ---`);
    for (const [s, t] of blob) console.log(`   ${s}: ${JSON.stringify(t.slice(0, 200))}`);
  }
}
console.log("\n\n=== L38 全貌（转述别人的话）===");
{ const l = pick(38);
  console.log(`target: ${JSON.stringify(l.targetSentence)}`);
  console.log(`oneLineRule: ${JSON.stringify(l.oneLineRule)}`);
  console.log(`intentZh: ${JSON.stringify(l.intentZh)}`);
  console.log(`blocks: ` + l.blocks.map(b=>`{${b.role}}${b.text}`).join(" | "));
  console.log(`examples: ` + l.examples.map(e=>`${e.en} [${e.zh}]`).join(" | "));
  console.log(`variants: ` + (l.variants??[]).map(v=>`${v.en} [${v.noteZh}]`).join(" | "));
  console.log(`sceneSwings: ` + (l.sceneSwings??[]).map(s=>`${s.en} [${s.zh}]`).join(" | "));
  (l.contrast??[]).forEach((c,i)=>console.log(`  contrast[${i}] bothRight=${c.bothRight} mark=${JSON.stringify(c.wrongMark)}\n     wrong=${JSON.stringify(c.wrong)}\n     correct=${JSON.stringify(c.correct)}\n     whyZh=${JSON.stringify(c.whyZh)}`));
  l.guided.forEach((g,i)=>console.log(`  guided[${i}] ${g.kind} ans=${JSON.stringify(g.answer)} wrongToken=${JSON.stringify(g.wrongToken)} opts=${JSON.stringify(g.options)} tokens=${JSON.stringify(g.tokens)}\n     prompt=${JSON.stringify(g.promptZh)}\n     explain=${JSON.stringify(g.explain)}`));
  l.practice.forEach((p,i)=>console.log(`  practice[${i}] prompt=${JSON.stringify(p.promptZh)}\n     tokens=${JSON.stringify(p.tokens)} distr=${JSON.stringify(p.distractors)}\n     answer=${JSON.stringify(p.answer)}`));
  console.log(`recall: ${JSON.stringify(l.recall)}`);
  console.log(`deepDive: ${JSON.stringify(l.deepDive)}`);
}
