import { grammarLessons } from "../../../../src/data/grammarLessons";
const W = (f: string, t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
const REL = ["say","said","says","telling","told","tells","ask","asked","asks","speak","spoke","talk","talked","answer","call","call me","show","show me"];
console.log("=== 相关动词原形/过去式在 targetSentence 里当主角的课（全 204 课）===");
for (const f of REL) {
  const ls = grammarLessons.filter(l => W(f, l.targetSentence));
  console.log(`  ${f.padEnd(10)} ${ls.length ? ls.map(l => `L${l.number}`).join(",") : "❌ 0 课"}`);
}
console.log("\n=== dialogue[0] 里出现的祈使/请求式（全课扫描）===");
const starts = new Map<string, string[]>();
for (const l of grammarLessons) {
  const d0 = (l.dialogue ?? [])[0];
  if (!d0) continue;
  const first = d0.en.split(/\s+/).slice(0, 3).join(" ");
  if (!starts.has(first)) starts.set(first, []);
  starts.get(first)!.push(`L${l.number}`);
}
for (const [k, v] of [...starts.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 40))
  console.log(`  ${JSON.stringify(k).padEnd(38)} ×${String(v.length).padStart(3)}  ${v.slice(0, 12).join(",")}${v.length > 12 ? "…" : ""}`);
console.log("\n=== dialogue 里 who 的取值分布 ===");
const who = new Map<string, number>();
for (const l of grammarLessons) for (const d of l.dialogue ?? []) who.set(d.who, (who.get(d.who) ?? 0) + 1);
console.log("  " + [...who.entries()].map(([k, v]) => `${k}=${v}`).join(", "));
console.log("\n=== 每课 dialogue[0].who 分布（tell 是否只出现在 npc 行）===");
let npcFirst = 0, meFirst = 0, other = 0;
for (const l of grammarLessons) { const d0 = (l.dialogue ?? [])[0]; if (!d0) continue;
  if (d0.who === "npc") npcFirst++; else if (d0.who === "me") meFirst++; else other++; }
console.log(`  dialogue[0].who=npc: ${npcFirst} 课, =me: ${meFirst} 课, 其他: ${other} 课`);
console.log("\n=== 那 5 课是第几句（索引）===");
for (const l of grammarLessons) {
  (l.dialogue ?? []).forEach((d, i) => { if (W("tell", d.en)) console.log(`  L${l.number} dialogue[${i}] who=${d.who} :: ${JSON.stringify(d.en)}`); });
}
