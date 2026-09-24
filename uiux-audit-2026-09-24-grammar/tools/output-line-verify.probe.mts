// 核实：output 档 2（核心句 targetSentence）是否真是小美的台词（dialogue 里 who="me"）。
// 决定「写出她要说的那句话」这句文案能不能对档 2 沿用（只读）。
import { grammarLessons } from "../../src/data/grammarLessons.ts";

const L = grammarLessons as any[];
const norm = (s: string) => s.toLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim();

let hasDialogue = 0, isHerLine = 0, isNotHerLine = 0, noDialogue = 0;
const mismatches: string[] = [];
for (const lesson of L) {
  const dlg: any[] = lesson.dialogue ?? [];
  if (!dlg.length) { noDialogue += 1; continue; }
  hasDialogue += 1;
  const target = norm(lesson.targetSentence ?? "");
  const herLines = dlg.filter((d) => d.who === "me").map((d) => norm(d.en));
  const others = dlg.filter((d) => d.who !== "me").map((d) => norm(d.en));
  if (herLines.includes(target)) isHerLine += 1;
  else {
    isNotHerLine += 1;
    mismatches.push(`${lesson.id} target="${lesson.targetSentence}" me=${JSON.stringify(dlg.filter(d=>d.who==='me').map(d=>d.en))} others=${JSON.stringify(others.slice(0,2))}`);
  }
}
console.log("课程总数:", L.length);
console.log("有 dialogue 的:", hasDialogue, " 无 dialogue 的:", noDialogue);
console.log("targetSentence 是小美台词（who=me）:", isHerLine);
console.log("targetSentence **不是**小美台词:", isNotHerLine);
console.log();
for (const m of mismatches.slice(0, 8)) console.log("  " + m);
