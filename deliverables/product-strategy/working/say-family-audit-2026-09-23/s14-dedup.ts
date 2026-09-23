/**
 * s14：⭐ 关键重构 —— 「21 : 2 : 1」是**槽位计数**的产物，还是**句子**层面的真实不均衡？
 *
 * 槽位计数的问题：同一个句子会被写进十几个字段（targetSentence / blocks / examples /
 * variants / sceneSwings / summary.points / guided.answer / practice.answer / recall.answer /
 * contrast.correct …），于是「一个句子」被记成「十几处」。
 *
 * 本脚本给出三张表：
 *   表 1 槽位计数（任务书口径）
 *   表 2 **去重句子**计数（用户真正见到几句不同的话）
 *   表 3 去重后的句子清单（逐句，可人工核对）
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";

const rx = (f: string) => new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i");
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.!?,，。]+$/g, "");
const unlockOf = new Map<string, number>();
for (const c of huntCases) {
  const ls = grammarLessons.filter((l) => l.huntCaseIds.includes(c.id));
  unlockOf.set(c.id, ls.length ? Math.min(...ls.map((l) => l.number)) : 12);
}

interface Hit { side: "正" | "错"; where: string; sentence: string }
function collect(form: string) {
  const r = rx(form);
  const slots: Hit[] = [];
  const S = (side: "正" | "错", where: string, t?: string | null, isPos = true) => {
    if (t && r.test(t)) slots.push({ side: isPos ? side : "错", where, sentence: t });
  };
  for (const l of grammarLessons) {
    const P = (w: string, t?: string | null) => S("正", `L${l.number}.${w}`, t, true);
    P("targetSentence", l.targetSentence); P("dialogueEn", l.dialogueEn);
    for (const [i, d] of (l.dialogue ?? []).entries()) P(`dialogue[${i}](${d.who})`, d.en);
    for (const [i, e] of l.examples.entries()) P(`examples[${i}]`, e.en);
    for (const [i, v] of (l.variants ?? []).entries()) P(`variants[${i}](${v.label})`, v.en);
    for (const [i, s] of (l.sceneSwings ?? []).entries()) P(`sceneSwings[${i}]`, s.en);
    for (const [i, b] of l.blocks.entries()) P(`blocks[${i}]`, b.text);
    for (const [i, c] of (l.contrast ?? []).entries()) {
      P(`contrast[${i}].correct`, c.correct);
      if (c.bothRight) P(`contrast[${i}].wrong(bothRight→正确)`, c.wrong);
      else S("错", `L${l.number}.contrast[${i}].wrong`, c.wrong, false);
      if (c.wrongMark) S("错", `L${l.number}.contrast[${i}].wrongMark`, c.wrongMark, false);
    }
    for (const [i, g] of l.guided.entries()) {
      if (g.kind === "spot") { S("错", `L${l.number}.guided[${i}](spot).tokens`, (g.tokens ?? []).join(" "), false); continue; }
      P(`guided[${i}](${g.kind}).answer`, g.answer);
      P(`guided[${i}].replaceBase`, g.replaceBase);
      P(`guided[${i}].tokens`, (g.tokens ?? []).join(" "));
      for (const o of g.options ?? []) if (o !== g.answer) S("错", `L${l.number}.guided[${i}].options(干扰项)`, o, false);
    }
    for (const [i, p] of l.practice.entries()) { P(`practice[${i}].answer`, p.answer); for (const d of p.distractors ?? []) S("错", `L${l.number}.practice[${i}].distractors`, d, false); }
    P("recall.answer", l.recall?.answer);
  }
  for (const c of huntCases) {
    const errIdx = new Set(c.errors.map((e) => e.tokenIndex));
    for (const [i, t] of c.tokens.entries()) {
      if (!r.test(t)) continue;
      if (errIdx.has(i)) S("错", `案${c.id}.tokens[${i}](被判错)`, t, false);
      else S("正", `案${c.id}.tokens[${i}](正确用法)`, t, true);
    }
    for (const e of c.errors) { if (r.test(e.original)) S("错", `案${c.id}.errors.original`, e.original, false); if (r.test(e.correction)) S("正", `案${c.id}.errors.correction(用户要答出的)`, e.correction, true); }
  }
  return slots;
}

const FORMS = ["say", "says", "said", "saying", "tell", "tells", "told", "thought", "wore"];

console.log("════════════════════════════════════════════════════════════════");
console.log("s14-A · 表 1：槽位计数（任务书口径 · 与任务书核对）");
console.log("════════════════════════════════════════════════════════════════");
console.log("  形式".padEnd(10) + "正侧槽位".padStart(10) + "错侧槽位".padStart(10) + "  正:错");
for (const f of FORMS) {
  const s = collect(f);
  const p = s.filter((x) => x.side === "正").length, n = s.filter((x) => x.side === "错").length;
  console.log(`  ${f.padEnd(8)}${String(p).padStart(10)}${String(n).padStart(10)}   ${p}:${n}`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s14-B · ⭐ 表 2：**去重句子**计数（用户真正见到几句不同的话）");
console.log("════════════════════════════════════════════════════════════════");
console.log("  形式".padEnd(10) + "正句".padStart(7) + "错句".padStart(7) + "  正:错   槽位/句 倍率");
for (const f of FORMS) {
  const s = collect(f);
  const posSet = new Map<string, Hit>(), negSet = new Map<string, Hit>();
  for (const x of s) {
    if (x.side === "正") { const k = norm(x.sentence); const prev = posSet.get(k); if (prev) prev.where += " ‖ " + x.where; else posSet.set(k, { ...x }); }
    else { const k = norm(x.sentence); const prev = negSet.get(k); if (prev) prev.where += " ‖ " + x.where; else negSet.set(k, { ...x }); }
  }
  const ps = s.filter((x) => x.side === "正").length, ns = s.filter((x) => x.side === "错").length;
  console.log(`  ${f.padEnd(8)}${String(posSet.size).padStart(7)}${String(negSet.size).padStart(7)}   ${posSet.size}:${negSet.size}`.padEnd(24) + `${(ps / Math.max(1, posSet.size)).toFixed(1)}x / ${(ns / Math.max(1, negSet.size)).toFixed(1)}x`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s14-C · 表 3：say / says / said 去重后的**逐句清单**");
console.log("════════════════════════════════════════════════════════════════");
for (const f of ["say", "says", "said"]) {
  const s = collect(f);
  const posSet = new Map<string, Hit>(), negSet = new Map<string, Hit>();
  for (const x of s) {
    const m = x.side === "正" ? posSet : negSet;
    const k = norm(x.sentence); const prev = m.get(k); if (prev) prev.where += " ‖ " + x.where; else m.set(k, { ...x });
  }
  console.log(`\n  ╔══ ${f}：正句 ${posSet.size} 个 / 错句 ${negSet.size} 个 ══`);
  console.log(`  ║ 【正句】`);
  for (const [k, v] of posSet) {
    const n = v.where.split(" ‖ ").length;
    console.log(`  ║   ${JSON.stringify(k)}`);
    console.log(`  ║      出现在 ${n} 个槽位：${v.where.split(" ‖ ").slice(0, 6).join(" , ")}${n > 6 ? ` …(+${n - 6})` : ""}`);
  }
  console.log(`  ║ 【错句】`);
  for (const [k, v] of negSet) {
    const n = v.where.split(" ‖ ").length;
    console.log(`  ║   ${JSON.stringify(k)}  （${n} 个槽位：${v.where.split(" ‖ ").slice(0, 4).join(" , ")}${n > 4 ? ` …(+${n - 4})` : ""}）`);
  }
  console.log(`  ╚══`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s14-D · 全库课程/季度结构（立课(c) 需要什么代价）");
console.log("════════════════════════════════════════════════════════════════");
const maxN = Math.max(...grammarLessons.map((l) => l.number));
const minN = Math.min(...grammarLessons.map((l) => l.number));
console.log(`  课程号范围 ${minN}–${maxN}，共 ${grammarLessons.length} 课`);
console.log(`  最后一课 L${maxN}：${JSON.stringify(grammarLessons.find((l) => l.number === maxN)!.targetSentence)}  ${grammarLessons.find((l) => l.number === maxN)!.grammarLabel}`);
console.log(`  ⇒ 新增一课 = L${maxN + 1}，需新开一季（末季 season-28 已收纳 182-204）`);
const lastLessons = grammarLessons.filter((l) => l.number >= 197);
console.log(`  L197–L${maxN} 这一族（昨天版）共 ${lastLessons.length} 课，逐课教学点：`);
for (const l of lastLessons) console.log(`     L${l.number} ${l.grammarLabel.padEnd(34)} ${JSON.stringify(l.targetSentence.slice(0, 60))}`);

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s14-E · 「转述」register 的完整盘点（say 家族的真实生态位）");
console.log("════════════════════════════════════════════════════════════════");
const rTrans = /转述/;
console.log("  全库 grammarLabel / title / oneLineRule / deepDive 含「转述」的课：");
for (const l of grammarLessons) {
  const hits: string[] = [];
  if (rTrans.test(l.grammarLabel)) hits.push("grammarLabel");
  if (rTrans.test(l.title)) hits.push("title");
  if (rTrans.test(l.oneLineRule)) hits.push("oneLineRule");
  for (const [i, p] of (l.deepDive?.paragraphs ?? []).entries()) if (rTrans.test(p)) hits.push(`deepDive[${i}]`);
  for (const [i, s] of (l.summary?.points ?? []).entries()) if (rTrans.test(s)) hits.push(`summary[${i}]`);
  for (const [i, c] of (l.contrast ?? []).entries()) if (rTrans.test(c.whyZh)) hits.push(`contrast[${i}].whyZh`);
  if (hits.length) console.log(`     L${l.number}「${l.title}」${l.grammarLabel} → ${hits.join(", ")}`);
}
console.log(`\n  ⇒ 「转述」在全库只出现在 L38（及 L41 的复现）——**这是一条只有一课的 register**。`);
console.log(`     所以「教 said」若为了转述，会绑在一条单课 register 上；`);
console.log(`     若为了「昨天版」，则属 L197-L204 那一族。两条路都不指向「加在 L38」。`);
