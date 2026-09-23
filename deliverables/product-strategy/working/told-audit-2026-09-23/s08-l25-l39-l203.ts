import { grammarLessons } from "../../../../src/data/grammarLessons";
const pick = (n: number) => grammarLessons.find(l => l.number === n)!;
for (const n of [25, 39, 203]) {
  const l = pick(n);
  console.log("\n" + "=".repeat(78));
  console.log(`L${l.number} ${l.title} [${l.grammarLabel}] scene=${l.scene}`);
  console.log(`targetSentence: ${JSON.stringify(l.targetSentence)}`);
  console.log(`oneLineRule: ${JSON.stringify(l.oneLineRule)}`);
  console.log(`intentZh: ${JSON.stringify(l.intentZh)}`);
  console.log(`blocks: ` + l.blocks.map(b => `{${b.role}}${b.text}`).join(" | "));
  console.log(`examples: ` + l.examples.map(e => `${e.en} [${e.zh}]`).join(" | "));
  console.log(`contrast (${(l.contrast ?? []).length}):`);
  (l.contrast ?? []).forEach((c, i) => console.log(`   [${i}] bothRight=${c.bothRight} wrongMark=${JSON.stringify(c.wrongMark)}\n        wrong  : ${JSON.stringify(c.wrong)}\n        correct: ${JSON.stringify(c.correct)}\n        whyZh  : ${JSON.stringify(c.whyZh)}`));
  console.log(`variants: ` + (l.variants ?? []).map(v => `${v.en} [${v.noteZh}]`).join(" | "));
  console.log(`guided:`);
  l.guided.forEach((g, i) => console.log(`   [${i}] ${g.kind} ans=${JSON.stringify(g.answer)} opts=${JSON.stringify(g.options)} tokens=${JSON.stringify(g.tokens)} wrongToken=${JSON.stringify(g.wrongToken)} | ${g.explain}`));
  console.log(`practice: ` + l.practice.map(p => `${JSON.stringify(p.answer)} distr=${JSON.stringify(p.distractors)}`).join(" | "));
  console.log(`recall: ` + JSON.stringify(l.recall));
  console.log(`deepDive: ` + (l.deepDive ? JSON.stringify(l.deepDive).slice(0, 400) : "（无）"));
  console.log(`summary: ` + (l.summary ? JSON.stringify(l.summary) : "（无）"));
  console.log(`sceneSwings: ` + (l.sceneSwings ?? []).map(s => s.en).join(" | "));
  console.log(`huntCaseIds: ` + JSON.stringify(l.huntCaseIds));
}
