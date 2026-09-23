import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";
const H = (t?: string) => !!t && /告诉/.test(t);
console.log("=== 「中文提示里说『告诉』，但英文答案里从不出现 tell」的全部落点 ===");
for (const l of grammarLessons) {
  const slots: [string, string][] = [];
  const P = (s: string, t?: string) => { if (H(t)) slots.push([s, t!]); };
  P("intentZh", l.intentZh); P("sceneSetupZh", l.sceneSetupZh);
  l.examples.forEach((e, i) => P(`examples[${i}].zh`, e.zh));
  (l.contrast ?? []).forEach((c, i) => P(`contrast[${i}].whyZh`, c.whyZh));
  l.guided.forEach((g, i) => { P(`guided[${i}].promptZh`, g.promptZh); P(`guided[${i}].explain`, g.explain); });
  l.practice.forEach((p, i) => P(`practice[${i}].promptZh`, p.promptZh));
  if (l.recall) { P("recall.promptZh", l.recall.promptZh); P("recall.noteZh", l.recall.noteZh); }
  P("title", l.title);
  if (!slots.length) continue;
  console.log(`\n--- L${l.number} ${l.title} [${l.grammarLabel}] ---`);
  for (const [s, t] of slots) console.log(`   ${s}: ${JSON.stringify(t.slice(0,150))}`);
  console.log(`   本课 target: ${JSON.stringify(l.targetSentence)}`);
  console.log(`   本课答案里出现 tell? ${/tell|told|tells/i.test([l.targetSentence, ...l.guided.map(g=>g.answer), ...l.practice.map(p=>p.answer), l.recall?.answer??""].join(" ")) ? "✓" : "✗ 从不"}`);
}
console.log("\n\n=== write / wrote 的落点（判据第二条样本） ===");
for (const f of ["write","writes","writing","wrote","written"]) {
  const hits: string[] = [];
  for (const l of grammarLessons) {
    const H2 = (t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
    if (H2(l.targetSentence)) hits.push(`L${l.number}.targetSentence`);
    (l.dialogue ?? []).forEach((d, i) => { if (H2(d.en)) hits.push(`L${l.number}.dialogue[${i}]`); });
    l.examples.forEach((e, i) => { if (H2(e.en)) hits.push(`L${l.number}.examples[${i}]`); });
    l.practice.forEach((p, i) => { if (H2(p.answer)) hits.push(`L${l.number}.practice[${i}].answer`); });
    (l.contrast ?? []).forEach((c, i) => { if (H2(c.correct)) hits.push(`L${l.number}.contrast[${i}].correct`); });
  }
  console.log(`  ${f.padEnd(9)} ${hits.length} 处: ${hits.join(", ") || "（0）"}`);
}
