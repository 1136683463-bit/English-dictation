import { grammarLessons } from "../../../../src/data/grammarLessons";
const hit = (f: string, t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
const SRC = process.cwd() + "/src/data/grammarLessons.ts";
const fs = await import("node:fs");
const raw = fs.readFileSync(SRC, "utf8");

console.log("=== 5 课的 tell 上下文 ===");
for (const l of grammarLessons) {
  if (!hit("tell", l.dialogueEn) && !(l.dialogue ?? []).some(d => hit("tell", d.en))) continue;
  console.log("\n" + "=".repeat(78));
  console.log(`L${l.number}  id=${l.id}  title=${JSON.stringify(l.title)}  scene=${l.scene}`);
  console.log(`grammarLabel: ${JSON.stringify(l.grammarLabel)}`);
  console.log(`episode    : ${JSON.stringify(l.episode)}`);
  console.log(`intentZh   : ${JSON.stringify(l.intentZh)}`);
  console.log(`oneLineRule: ${JSON.stringify(l.oneLineRule)}`);
  console.log(`sceneSetupZh: ${JSON.stringify(l.sceneSetupZh)}`);
  console.log(`targetSentence: ${JSON.stringify(l.targetSentence)}  (词数=${l.targetSentence.split(/\s+/).length})`);
  console.log(`dialogueEn : ${JSON.stringify(l.dialogueEn)}`);
  console.log(`dialogueZh : ${JSON.stringify(l.dialogueZh)}`);
  if (l.dialogue) {
    console.log(`dialogue[] (${l.dialogue.length} 行):`);
    l.dialogue.forEach((d, i) => console.log(`   [${i}] ${d.who}: ${JSON.stringify(d.en)}\n        zh: ${JSON.stringify(d.zh)}`));
  }
  console.log(`blocks(${l.blocks.length}): ` + l.blocks.map(b => `{${b.role}}${b.text}`).join(" | "));
  console.log(`examples(${l.examples.length}): ` + l.examples.map(e => e.en).join(" | "));
  if (l.variants) console.log(`variants(${l.variants.length}): ` + l.variants.map(v => `${v.en} [${v.noteZh}]`).join(" | "));
  if (l.sceneSwings) console.log(`sceneSwings(${l.sceneSwings.length}): ` + l.sceneSwings.map(s => s.en).join(" | "));
  console.log(`recall: ${l.recall ? JSON.stringify(l.recall.answer) + " / " + JSON.stringify(l.recall.promptZh) : "（无）"}`);
  console.log(`huntCaseIds: ${JSON.stringify(l.huntCaseIds)}`);
  console.log(`grammarLabel / title 是否含 tell 家族: tell=${hit("tell", l.title + l.grammarLabel)}`);
}
