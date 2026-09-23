import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";
const W = (f: string, t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
const TARGET = [41, 101, 110, 117, 185];
console.log("=== 5 课：npc 那句话是否会成为练习/回忆/案件的作答内容？===");
for (const l of grammarLessons) {
  if (!TARGET.includes(l.number)) continue;
  const npcLine = (l.dialogue ?? [])[0]?.en ?? "";
  console.log("\n" + "=".repeat(70));
  console.log(`L${l.number} ${l.title}`);
  console.log(`npc 句 = ${JSON.stringify(npcLine)}`);
  console.log(`me 句 / targetSentence = ${JSON.stringify(l.targetSentence)}`);
  console.log(`两者相同? ${npcLine === l.targetSentence}`);
  console.log("guided:");
  l.guided.forEach((g, i) => console.log(`  [${i}] kind=${g.kind} prompt=${JSON.stringify(g.promptZh)}\n       before=${JSON.stringify(g.before)} after=${JSON.stringify(g.after)}\n       options=${JSON.stringify(g.options)} answer=${JSON.stringify(g.answer)}\n       tokens=${JSON.stringify(g.tokens)} wrongToken=${JSON.stringify(g.wrongToken)}\n       replaceBase=${JSON.stringify(g.replaceBase)} replaceTarget=${JSON.stringify(g.replaceTarget)}`));
  console.log("practice:");
  l.practice.forEach((p, i) => console.log(`  [${i}] prompt=${JSON.stringify(p.promptZh)}\n       tokens=${JSON.stringify(p.tokens)} distractors=${JSON.stringify(p.distractors)}\n       answer=${JSON.stringify(p.answer)}`));
  console.log("recall: " + (l.recall ? JSON.stringify(l.recall) : "（无）"));
  console.log("huntCaseIds: " + JSON.stringify(l.huntCaseIds));
  for (const cid of l.huntCaseIds) {
    const c = huntCases.find(x => x.id === cid);
    if (c) console.log(`  案件 ${cid} (n=${c.number}) tokens: ${c.tokens.join(" ")}`);
  }
  // npc 句是否出现在任何作答字段
  const inAnswer: string[] = [];
  l.guided.forEach((g, i) => { if (W("tell", g.answer)) inAnswer.push(`guided[${i}].answer`); if (W("tell", g.replaceBase)) inAnswer.push(`guided[${i}].replaceBase`); });
  l.receallDummy;
  if (l.recall && W("tell", l.recall.answer)) inAnswer.push("recall.answer");
  l.practice.forEach((p, i) => { if (W("tell", p.answer)) inAnswer.push(`practice[${i}].answer`); });
  console.log(`>>> tell 出现在「用户要作答的字段」里: ${inAnswer.length ? inAnswer.join(", ") : "❌ 无"}`);
}
