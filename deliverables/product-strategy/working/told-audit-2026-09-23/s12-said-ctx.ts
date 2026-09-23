import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";
const W = (f: string, t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
console.log("=== L105 全貌（said 唯一一处 A1）===");
{ const l = grammarLessons.find(x => x.number === 105)!;
  console.log(`title=${l.title} [${l.grammarLabel}] scene=${l.scene}`);
  console.log(`target: ${JSON.stringify(l.targetSentence)}`);
  console.log(`dialogueEn: ${JSON.stringify(l.dialogueEn)}`);
  (l.dialogue??[]).forEach((d,i)=>console.log(`  dialogue[${i}] ${d.who}: ${JSON.stringify(d.en)} / ${JSON.stringify(d.zh)}`));
  console.log(`examples: ` + l.examples.map(e=>`${e.en} [${e.zh}]`).join(" | "));
  console.log(`oneLineRule: ${JSON.stringify(l.oneLineRule)}`);
}
console.log("\n=== 案件 hunt-homework-note（said 出现处）===");
{ const c = huntCases.find(x => x.id === "hunt-homework-note")!;
  console.log(`n=${c.number} title=${c.title} scene=${c.scene}`);
  console.log(`tokens: ${c.tokens.join(" ")}`);
  c.errors.forEach((e,i)=>console.log(`  errors[${i}] idx=${e.tokenIndex} "${e.original}"→"${e.correction}" tag=${e.tag}\n     ${e.explanation}`));
  console.log(`notes: ${JSON.stringify(c.notes)}`);
  const hosts = grammarLessons.filter(l => l.huntCaseIds.includes("hunt-homework-note")).map(l=>`L${l.number}`);
  console.log(`宿主课: ${hosts.join(",")}`);
}
console.log("\n=== 案件 hunt-team-message（says 出现处）===");
{ const c = huntCases.find(x => x.id === "hunt-team-message")!;
  console.log(`n=${c.number} title=${c.title}`);
  console.log(`tokens: ${c.tokens.join(" ")}`);
  c.errors.forEach((e,i)=>console.log(`  errors[${i}] idx=${e.tokenIndex} "${e.original}"→"${e.correction}" tag=${e.tag}\n     ${e.explanation}`));
  const hosts = grammarLessons.filter(l => l.huntCaseIds.includes("hunt-team-message")).map(l=>`L${l.number}`);
  console.log(`宿主课: ${hosts.join(",")}`);
}
console.log("\n=== 案件 hunt-weekend-note / hunt-question-words / hunt-swim-day ===");
for (const id of ["hunt-weekend-note","hunt-question-words","hunt-swim-day"]) {
  const c = huntCases.find(x => x.id === id)!;
  console.log(`\n--- ${id} (n=${c.number}) ${c.title} ---`);
  console.log(`tokens: ${c.tokens.join(" ")}`);
  c.errors.forEach((e,i)=>console.log(`  errors[${i}] idx=${e.tokenIndex} "${e.original}"→"${e.correction}" tag=${e.tag}`));
  console.log(`宿主课: ` + grammarLessons.filter(l => l.huntCaseIds.includes(id)).map(l=>`L${l.number}`).join(","));
}
