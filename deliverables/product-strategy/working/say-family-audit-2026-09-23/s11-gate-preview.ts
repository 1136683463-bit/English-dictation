/**
 * s11：若选 (b) 挂靠 L38，加卡/加题的**守门影响**预演（纯静态模拟，不改数据）
 *
 * 逐个检查 8 项守门对「L38 新增一张卡 / 一道题」的反应：
 *   ① 星号 ② 语义守门 ③ 题干-答案一致 ④ 重放题 ⑤ C 层新句 ⑥ 新句微调
 *   ⑦ 难度闸门 ⑧ 零术语
 * 另外检查对照卡数量、copy-rate（A/B/C 层）、以及 L38 距 L39 的难度余量。
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";
import { findZeroTermHits } from "../../../../src/data/grammarZeroTerms";

const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
const words = (v: string) => norm(v).split(" ").filter(Boolean);
const longestClause = (s: string) => Math.max(...s.split(/[.!?]\s*/).filter((c) => c.trim()).map((c) => c.trim().split(/\s+/).length));

const l38 = grammarLessons.find((l) => l.number === 38)!;
const l39 = grammarLessons.find((l) => l.number === 39)!;

console.log("════════════════════════════════════════════════════════════════");
console.log("s11-A · L38 现状基线");
console.log("════════════════════════════════════════════════════════════════");
console.log(`  对照卡 ${l38.contrast!.length} 张（全库最多；并列次高：${grammarLessons.filter((l) => l.number !== 38 && (l.contrast?.length ?? 0) >= 7).map((l) => `L${l.number}(${l.contrast!.length})`).join(", ")}）`);
const cardCounts = grammarLessons.map((l) => l.contrast?.length ?? 0);
console.log(`  全库卡数分布：${[...new Set(cardCounts)].sort((a, b) => a - b).join("/")}；平均 ${(cardCounts.reduce((a, b) => a + b, 0) / cardCounts.length).toFixed(2)} 张/课`);
console.log(`  guided ${l38.guided.length} 题（全库 ${[...new Set(grammarLessons.map((l) => l.guided.length))].sort((a, b) => a - b).join("/")}）`);
console.log(`  practice ${l38.practice.length} 题（全库 ${[...new Set(grammarLessons.map((l) => l.practice.length))].sort((a, b) => a - b).join("/")}）`);
console.log(`  examples ${l38.examples.length} 条（全库中位 ${grammarLessons.map((l) => l.examples.length).sort((a, b) => a - b)[102]}）`);
console.log(`  sceneSwings ${(l38.sceneSwings ?? []).length} 条`);
console.log(`  variants ${(l38.variants ?? []).length} 条`);
console.log(`  target = ${JSON.stringify(l38.targetSentence)}（最长分句 ${longestClause(l38.targetSentence)} 词）`);
console.log(`  L39 target = ${JSON.stringify(l39.targetSentence)}（最长分句 ${longestClause(l39.targetSentence)} 词）`);
console.log(`  L37→L38→L39 难度：${longestClause(grammarLessons.find((l) => l.number === 37)!.targetSentence)} → ${longestClause(l38.targetSentence)} → ${longestClause(l39.targetSentence)}`);

console.log("\n════════════════════════════════════════════════════════════════");
console.log("s11-B · 守门④ 重放题现状（L38 的 practice 是否有重放）");
console.log("════════════════════════════════════════════════════════════════");
const exhibit = new Set<string>();
const E = (t?: string | null) => { if (t) exhibit.add(norm(t)); };
E(l38.targetSentence); E(l38.dialogueEn);
for (const e of l38.examples) E(e.en);
for (const s of l38.sceneSwings ?? []) E(s.en);
for (const d of l38.dialogue ?? []) E(d.en);
for (const c of l38.contrast ?? []) { E(c.correct); E(c.wrong); }
for (const v of l38.variants ?? []) E(v.en);
for (const g of l38.guided) if (g.answer) E(g.answer);
E(l38.recall?.answer);
for (const [i, p] of l38.practice.entries()) {
  const a = norm(p.answer);
  const layer = a === norm(l38.targetSentence) ? "A(纯重复目标句)" : exhibit.has(a) ? "B(课内已出现)" : "C(新句)";
  console.log(`  practice[${i}] ${layer.padEnd(18)} ${JSON.stringify(p.answer)}`);
}
console.log(`  exhibitCount（例句+场景变奏+1）= ${(l38.examples?.length ?? 0) + (l38.sceneSwings ?? []).length + 1}（≥10 则豁免 C 层守门）`);

console.log("\n════════════════════════════════════════════════════════════════");
console.log("s11-C · 若加一张对照卡：卡数是否越界？");
console.log("════════════════════════════════════════════════════════════════");
console.log(`  现行卡数分布：${[...new Set(cardCounts)].sort((a, b) => a - b).map((n) => `${n}张×${cardCounts.filter((x) => x === n).length}课`).join("  ")}`);
console.log(`  L38 现有 8 张 = 全库唯一；再加 = 9 张，将进一步拉开与次高的距离`);
console.log(`  → 是否有「卡数上限」守门？`);
console.log(`     grammarLessons.test.ts 的 35 条断言里**没有卡数上限**——只守内容质量（星号/术语/一致性/可抄率/难度）`);
console.log(`     所以「加卡」不被机械守门拦下，只受教学判断约束`);

console.log("\n════════════════════════════════════════════════════════════════");
console.log("s11-D · 若给 L38 加一道 practice 题（C 层）需要同时满足的约束");
console.log("════════════════════════════════════════════════════════════════");
const cumulative = new Set<string>();
for (const l of [...grammarLessons].sort((a, b) => a.number - b.number)) {
  const v = new Set<string>();
  const add = (t?: string | null) => { if (t) for (const w of words(t)) v.add(w); };
  add(l.targetSentence); for (const e of l.examples) add(e.en); for (const b of l.blocks) add(b.text);
  for (const d of l.dialogue ?? []) add(d.en);
  for (const c of l.contrast ?? []) { add(c.correct); add(c.wrong); }
  for (const vv of l.variants ?? []) add(vv.en);
  for (const s of l.sceneSwings ?? []) add(s.en);
  for (const g of l.guided) { add(g.answer); for (const t of g.tokens ?? []) add(t); }
  add(l.recall?.answer); v.delete("");
  if (l.number === 38) {
    const seen = new Set([...cumulative, ...v]);
    console.log(`  L38 时点「已教过的词」共 ${seen.size} 个`);
    console.log(`  含 said? ${seen.has("said")}   含 says? ${seen.has("says")}   含 say? ${seen.has("say")}`);
    console.log(`  含 to? ${seen.has("to")}  含 me? ${seen.has("me")}  含 she? ${seen.has("she")}`);
    console.log(`  ⇒ 加题时：said 已在 L38 的 contrast[6]/[7] 里出现，因此**词表检查会通过**`);
    console.log(`     （D 层守门只看「本课或此前出现过」，不看「出现过几次 / 是不是只当错词」）`);
  }
  for (const w of v) cumulative.add(w);
}

console.log("\n════════════════════════════════════════════════════════════════");
console.log("s11-E · 守门⑧ 零术语：候选文案预检（用项目自己的 findZeroTermHits）");
console.log("════════════════════════════════════════════════════════════════");
const candidates = [
  // (b) 挂靠 L38 的候选文案草稿
  "say 后面跟的话，就是「昨天版」那一族：昨天他说过 → he said。",
  "She said she will come. —— said 是 say 的昨天版，和 went、wore 一个道理。",
  "昨天说的话用 said：He said he was tired.",
  "「昨天他说」用 said——say 的昨天版要单独记，和 went、ate、wore 一样。",
  "She said she will come. —— 说昨天的事，say 要换昨天版 said。",
];
for (const t of candidates) {
  const hits = findZeroTermHits(t);
  console.log(`  ${hits.length ? "❌ 命中 " + hits.join("/") : "✅ 干净"}  ${JSON.stringify(t)}`);
}

console.log("\n════════════════════════════════════════════════════════════════");
console.log("s11-F · 守门① 星号 + 守门③ 题干-答案一致的候选预检");
console.log("════════════════════════════════════════════════════════════════");
for (const t of candidates) {
  console.log(`  星号(**) ${/\*\*/.test(t) ? "❌ 有" : "✅ 无"}   ${JSON.stringify(t.slice(0, 40))}`);
}
console.log("\n  L38 现有 practice 干扰项与答案词是否重复（加题时的硬约束）：");
for (const [i, p] of l38.practice.entries()) {
  const ansWords = new Set(words(p.answer).map((w) => w.replace(/[^a-z0-9']/g, "")));
  for (const d of p.distractors ?? []) {
    const w = d.replace(/[.,!?;:]/g, "").toLowerCase();
    console.log(`    practice[${i}] 干扰项 ${JSON.stringify(d)} 与答案词重复？ ${ansWords.has(w) ? "❌ 是" : "✅ 否"}`);
  }
}

console.log("\n════════════════════════════════════════════════════════════════");
console.log("s11-G · L38 对话/例句池里 `said` 与 `says` 的共存状况");
console.log("════════════════════════════════════════════════════════════════");
console.log("  L38 里所有含 say 家族形状的槽位（V3 口径，含正错两侧）：");
const rxFamily = /(?<![A-Za-z-])(say|says|said|saying)(?![A-Za-z-])/i;
const slots: string[] = [];
const S = (slot: string, t?: string | null) => { if (t && rxFamily.test(t)) slots.push(`${slot} = ${JSON.stringify(t)}`); };
S("targetSentence", l38.targetSentence);
for (const [i, e] of l38.examples.entries()) S(`examples[${i}]`, e.en);
for (const [i, d] of (l38.dialogue ?? []).entries()) S(`dialogue[${i}](${d.who})`, d.en);
for (const [i, c] of l38.contrast!.entries()) { S(`contrast[${i}].wrong`, c.wrong); S(`contrast[${i}].correct`, c.correct); }
for (const [i, v] of (l38.variants ?? []).entries()) S(`variants[${i}]`, v.en);
for (const [i, g] of l38.guided.entries()) { S(`guided[${i}].answer`, g.answer); for (const o of g.options ?? []) S(`guided[${i}].options[]`, o); }
for (const [i, p] of l38.practice.entries()) { S(`practice[${i}].answer`, p.answer); for (const d of p.distractors ?? []) S(`practice[${i}].distractors[]`, d); }
S("recall.answer", l38.recall?.answer);
for (const s of slots) console.log(`    ${s}`);
