/**
 * s18：最后三个数字 —— 报告的核心量化
 *   ① 任务书「says = 21」里，有多少个槽位其实是**同一句话**？
 *   ② `said` 是否在任何地方被要求**产出/拼装**（而不只是「点出错词 + 被告知答案」）？
 *   ③ 若立课，`said` 会落在哪里（课号/季）？
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";

const rx = (f: string) => new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i");

/** 与 s17 完全相同的口径（已与任务书对账一致） */
const FIELDS = [
  "targetSentence", "dialogueEn", "dialogue", "examples", "variants", "sceneSwings",
  "contrast.correct", "guided.answer", "guided.replaceBase", "practice.answer", "recall.answer",
];
function posSlots(form: string) {
  const r = rx(form);
  const out: { slot: string; text: string }[] = [];
  for (const l of grammarLessons) {
    const A = (k: string, v?: string | null) => { if (v && r.test(v)) out.push({ slot: `L${l.number}.${k}`, text: v }); };
    A("targetSentence", l.targetSentence); A("dialogueEn", l.dialogueEn);
    for (const [i, d] of (l.dialogue ?? []).entries()) A(`dialogue[${i}](${d.who})`, d.en);
    for (const [i, e] of l.examples.entries()) A(`examples[${i}]`, e.en);
    for (const [i, v] of (l.variants ?? []).entries()) A(`variants[${i}]`, v.en);
    for (const [i, s] of (l.sceneSwings ?? []).entries()) A(`sceneSwings[${i}]`, s.en);
    for (const [i, c] of (l.contrast ?? []).entries()) A(`contrast[${i}].correct`, c.correct);
    for (const [i, g] of l.guided.entries()) { if (g.kind === "spot") continue; A(`guided[${i}](${g.kind}).answer`, g.answer); A(`guided[${i}].replaceBase`, g.replaceBase); }
    for (const [i, p] of l.practice.entries()) A(`practice[${i}].answer`, p.answer);
    A("recall.answer", l.recall?.answer);
  }
  return out;
}

console.log("════════════════════════════════════════════════════════════════");
console.log("s18-A · 对账：本口径的正侧槽位数");
console.log("════════════════════════════════════════════════════════════════");
for (const f of ["say", "says", "said"]) console.log(`  ${f.padEnd(6)} = ${posSlots(f).length}   （任务书：say=2 / says=21 / said=1）`);

console.log("\n════════════════════════════════════════════════════════════════");
console.log("s18-B · ⭐⭐ 「says = 21」的构成拆解：多少个槽位是同一句话");
console.log("════════════════════════════════════════════════════════════════");
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.!?]+$/, "");
const says = posSlots("says");
const grouped = new Map<string, string[]>();
for (const s of says) { const k = norm(s.text); const a = grouped.get(k) ?? []; a.push(s.slot); grouped.set(k, a); }
const sorted = [...grouped.entries()].sort((a, b) => b[1].length - a[1].length);
console.log(`  21 个正侧槽位 = ${grouped.size} 句不同的话：`);
for (const [k, slots] of sorted) console.log(`     ${String(slots.length).padStart(2)} × ${JSON.stringify(k)}`);
const top = sorted[0];
console.log(`\n  ⇒ 排第一的那句「${top[0]}」一个就占了 ${top[1].length} / 21 = ${(top[1].length / 21 * 100).toFixed(0)}%。`);
const within38 = says.filter((s) => s.slot.startsWith("L38.")).length;
console.log(`  ⇒ 其中落在 L38 一课的：${within38} / 21 = ${(within38 / 21 * 100).toFixed(0)}%`);
console.log(`  ⇒ 落在 L38 之外的：${21 - within38} 处（${says.filter((s) => !s.slot.startsWith("L38.")).map((s) => `${s.slot}=${JSON.stringify(s.text)}`).join(" ; ")}）`);

console.log("\n  对照：say / said 的构成");
for (const f of ["say", "said"]) {
  const g = new Map<string, string[]>();
  for (const s of posSlots(f)) { const k = norm(s.text); const a = g.get(k) ?? []; a.push(s.slot); g.set(k, a); }
  console.log(`     ${f}：${posSlots(f).length} 槽位 = ${g.size} 句 → ${[...g.entries()].map(([k, v]) => `${v.length}×"${k}"`).join("  ")}`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s18-C · ⭐ `said` 是否被要求「产出/拼装」（vs 只是「点出错词 + 被告知答案」）");
console.log("════════════════════════════════════════════════════════════════");
let produce = 0;
console.log("  ── 课程内：任何 guided/practice/recall 的 answer 含 said？──");
for (const l of grammarLessons) {
  for (const [i, g] of l.guided.entries()) if (rx("said").test(g.answer)) { production.push(`L${l.number}.guided[${i}].answer=${JSON.stringify(g.answer)}`); produce++; }
  for (const [i, p] of l.practice.entries()) if (rx("said").test(p.answer)) { production.push(`L${l.number}.practice[${i}].answer=${JSON.stringify(p.answer)}`); produce++; }
  if (l.recall && rx("said").test(l.recall.answer)) { production.push(`L${l.number}.recall.answer=${JSON.stringify(l.recall.answer)}`); produce++; }
}
console.log(`     ${produce === 0 ? "❌ 0 处——课程里从不要求用户产出 said" : production.join("\n     ")}`);
console.log("  ── 课程内：引导句（promptZh/intentZh）要求说「昨天说」的？──");
const promptHits: string[] = [];
for (const l of grammarLessons) {
  for (const [i, g] of l.guided.entries()) if (/昨天.*说|说了|说过/.test(g.promptZh)) promptHits.push(`L${l.number}.guided[${i}].promptZh=${JSON.stringify(g.promptZh)}`);
  for (const [i, p] of l.practice.entries()) if (/昨天.*说|说了|说过/.test(p.promptZh)) promptHits.push(`L${l.number}.practice[${i}].promptZh=${JSON.stringify(p.promptZh)}`);
  if (l.recall && /昨天.*说|说了|说过/.test(l.recall.promptZh)) promptHits.push(`L${l.number}.recall.promptZh=${JSON.stringify(l.recall.promptZh)}`);
  if (l.recall && /说/.test(l.recall.intentZh)) promptHits.push(`L${l.number}.recall.intentZh=${JSON.stringify(l.recall.intentZh)}`);
}
console.log(`     命中 ${promptHits.length} 处：`);
for (const s of promptHits.slice(0, 20)) console.log(`     ${s}`);
console.log("  ── 案件内：said 作为 errors[].correction（用户被要求找出并被告知答案）──");
const caseDemand: string[] = [];
for (const c of huntCases) for (const e of c.errors) if (rx("said").test(e.correction)) caseDemand.push(`${c.id}(#${c.number})：${e.original} → ${e.correction}  「${e.explanation}」`);
console.log(`     命中 ${caseDemand.length} 处：`);
for (const s of caseDemand) console.log(`     ${s}`);
console.log("\n  ⇒ 玩法核查（读 src/pages/GrammarHuntPage.tsx + huntService.judgeGuess）：");
console.log("     用户点 token + 选罪名 → 结算页显示「原词 → 改正」与讲解。");
console.log("     **用户不需要手写/拼装改正词**——它是被展示的，不是被产出的。");
console.log("     ⇒ `said` 在全库属于「认出即可 / 答案被展示」，不属于「必须产出」。");

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s18-D · 若为 said 立课，它会落在哪");
console.log("════════════════════════════════════════════════════════════════");
const sortedLessons = [...grammarLessons].sort((a, b) => a.number - b.number);
const last = sortedLessons[sortedLessons.length - 1];
console.log(`  当前末课 = L${last.number}「${last.title}」${last.grammarLabel}`);
console.log(`  新立一课 = L${last.number + 1}，需要新开一季（season-28 范围 182-204）`);
const longestClause = (s: string) => Math.max(...s.split(/[.!?]\s*/).filter((c) => c.trim()).map((c) => c.trim().split(/\s+/).length));
console.log(`  难度闸门：L${last.number} 最长分句 ${longestClause(last.targetSentence)} 词，新课可到 ${longestClause(last.targetSentence) + 5} 词`);
console.log(`  L197-L204 家族逐课的「学的新词对数」：`);
for (const l of sortedLessons.filter((x) => x.number >= 197)) console.log(`     L${l.number} ${l.grammarLabel}`);

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s18-E · `said` 与 L197-L204 家族成员的**结构同类性**核查");
console.log("════════════════════════════════════════════════════════════════");
const FAMILY: [string, string][] = [["think","thought"],["know","knew"],["swim","swam"],["sing","sang"],["sit","sat"],["catch","caught"],["feel","felt"],["keep","kept"],["sleep","slept"],["draw","drew"],["wear","wore"],["give","gave"],["say","said"]];
console.log("  词对".padEnd(18) + "过去正侧槽位".padStart(13) + "首次课时点".padStart(11) + "曾有专属课?".padStart(11) + "  课程正侧句数");
for (const [base, past] of FAMILY) {
  const slots = posSlots(past);
  const first = slots.length ? Math.min(...slots.map((s) => parseInt(s.slot.match(/L(\d+)/)![1], 10))) : null;
  // 是否有以该过去式命名的专属课
  const ownerLesson = grammarLessons.find((l) => new RegExp(`(?<![A-Za-z-])${past}(?![A-Za-z-])`, "i").test(l.grammarLabel));
  const distinct = new Set(slots.map((s) => norm(s.text))).size;
  console.log(`  ${(base + " → " + past).padEnd(16)}${String(slots.length).padStart(13)}${String(first ?? "—").padStart(11)}${String(ownerLesson ? `是(L${ownerLesson.number})` : "否").padStart(11)}  ${distinct}`);
}
