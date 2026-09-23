/**
 * s08：修正 s06 的口径 bug，做**决定性的时序审计**
 *
 * s06 的 bug：我把「案件自己的 errors[].correction」也算进了「见过」——
 * 那正是「被要求」本身，不能当曝光。本脚本把两者严格分开：
 *
 *   见过 (exposure) = 该形式以**正确用法**出现的时点
 *                     · 课程：正侧槽位（含 bothRight.wrong，不含 spot/干扰项/错句）
 *                     · 案件：tokens 里**未被 errors 指向**的该形式（即案文本身的正确用法）
 *                     ⚠️ 不含 errors[].correction（那是答案，不是曝光）
 *
 *   被要求 (demand) = errors[].correction 含该形式（= 用户被要求找出/改出这个形式）
 *
 *   时点 = 解锁课号（案件按引用课的最小课号；番外案按 12）
 *
 *   判据：demand.at < exposure.at → **时序倒挂**（用户在被要求时还没见过正确答案）
 *        demand.at == exposure.at → 同课/同案，需人工看先后（案文 itself 可能先给正确用法）
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";

const rx = (f: string) => new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i");

const unlockOf = new Map<string, number>();
for (const c of huntCases) {
  const ls = grammarLessons.filter((l) => l.huntCaseIds.includes(c.id));
  unlockOf.set(c.id, ls.length ? Math.min(...ls.map((l) => l.number)) : 12);
}

const UNLOCK_LESSON_OF_EXTRA = 12;

interface Expo { at: number; kind: "课" | "案"; detail: string; sentence: string }

/** 某形式以正确用法出现过的全部时点 */
function exposures(form: string): Expo[] {
  const r = rx(form);
  const out: Expo[] = [];
  for (const l of grammarLessons) {
    const hits: string[] = [];
    const pos = (t: string | null | undefined, slot: string) => { if (t && r.test(t)) hits.push(slot); };
    pos(l.targetSentence, "targetSentence"); pos(l.dialogueEn, "dialogueEn");
    for (const d of l.dialogue ?? []) pos(d.en, `dialogue(${d.who})`);
    for (const e of l.examples) pos(e.en, "examples");
    for (const v of l.variants ?? []) pos(v.en, `variants(${v.label})`);
    for (const s of l.sceneSwings ?? []) pos(s.en, "sceneSwings");
    for (const b of l.blocks) pos(b.text, "blocks");
    for (const c of l.contrast ?? []) { pos(c.correct, "contrast.correct"); if (c.bothRight) pos(c.wrong, "contrast.wrong(bothRight→正确句)"); }
    for (const g of l.guided) { if (g.kind !== "spot") { pos(g.answer, `guided(${g.kind}).answer`); pos((g.tokens ?? []).join(" "), "guided.tokens"); } }
    for (const p of l.practice) pos(p.answer, "practice.answer");
    pos(l.recall?.answer, "recall.answer");
    if (hits.length) out.push({ at: l.number, kind: "课", detail: `L${l.number}「${l.title}」${l.grammarLabel} · ${hits[0]}`, sentence: l.targetSentence });
  }
  for (const c of huntCases) {
    const errIdx = new Set(c.errors.map((e) => e.tokenIndex));
    const hits: string[] = [];
    for (const [i, t] of c.tokens.entries()) if (r.test(t) && !errIdx.has(i)) hits.push(`tokens[${i}]="${t}"`);
    if (hits.length) out.push({ at: unlockOf.get(c.id)!, kind: "案", detail: `案 ${c.id}(#${c.number}) @解锁L${unlockOf.get(c.id)} · ${hits[0]}`, sentence: c.tokens.join(" ") });
  }
  return out.sort((a, b) => a.at - b.at);
}

/** 某形式被要求产出的全部时点（errors[].correction） */
function demands(form: string) {
  const r = rx(form);
  const out: { at: number; caseId: string; n: number; detail: string; explanation: string }[] = [];
  for (const c of huntCases) {
    for (const e of c.errors) {
      if (r.test(e.correction)) out.push({ at: unlockOf.get(c.id)!, caseId: c.id, n: c.number, detail: `${e.original} → ${e.correction}`, explanation: e.explanation });
    }
  }
  return out.sort((a, b) => a.at - b.at || a.n - b.n);
}

/** 某形式「被要求点出为错词」的时点（errors[].original） */
function demandsAsError(form: string) {
  const r = rx(form);
  const out: { at: number; caseId: string; n: number; detail: string; explanation: string }[] = [];
  for (const c of huntCases) {
    for (const e of c.errors) {
      if (r.test(e.original)) out.push({ at: unlockOf.get(c.id)!, caseId: c.id, n: c.number, detail: `${e.original} → ${e.correction}`, explanation: e.explanation });
    }
  }
  return out.sort((a, b) => a.at - b.at || a.n - b.n);
}

console.log("════════════════════════════════════════════════════════════════");
console.log("s08-A · ⭐ 时序审计（修正口径）：见过 vs 被要求");
console.log("  见过 = 以正确用法出现；⚠️ 不含 errors[].correction（那是答案）");
console.log("════════════════════════════════════════════════════════════════");

const PASTS: [string, string][] = [
  ["go","went"],["have","had"],["do","did"],["be","was"],["eat","ate"],["see","saw"],["make","made"],
  ["take","took"],["come","came"],["get","got"],["run","ran"],["think","thought"],["know","knew"],
  ["swim","swam"],["sing","sang"],["sit","sat"],["catch","caught"],["feel","felt"],["keep","kept"],
  ["sleep","slept"],["draw","drew"],["wear","wore"],["give","gave"],["say","said"],["tell","told"],
  ["buy","bought"],["find","found"],["leave","left"],["meet","met"],["win","won"],["lose","lost"],
  ["put","put"],["read","read"],["fall","fell"],["break","broke"],["ring","rang"],["write","wrote"],
  ["speak","spoke"],["teach","taught"],["bring","brought"],["send","sent"],["spend","spent"],
  ["pay","paid"],["stand","stood"],["build","built"],["hold","held"],["ride","rode"],["drive","drove"],
  ["fly","flew"],["grow","grew"],["begin","began"],["choose","chose"],["wake","woke"],["cut","cut"],
];

const inversions: string[] = [];
const sameTime: string[] = [];
console.log("\n  过去形".padEnd(16) + "首次见过(正确用法)".padStart(22) + "   首次被要求".padStart(14) + "  判定");
for (const [base, past] of PASTS) {
  const ex = exposures(past);
  const dm = demands(past);
  const e0 = ex[0];
  const d0 = dm[0];
  let verdict = "";
  if (d0 && (!e0 || d0.at < e0.at)) { verdict = "⚠️ 时序倒挂"; inversions.push(`${base} → ${past}：被要求 @L${d0.at}（${d0.caseId}）＜ 见过 ${e0 ? `@L${e0.at}` : "从未"}`); }
  else if (d0 && e0 && d0.at === e0.at) { verdict = "同课(看先后)"; sameTime.push(`${base} → ${past} @L${d0.at}`); }
  else if (!d0) verdict = "从未被要求";
  else verdict = "✅ 先见过";
  console.log(
    `  ${(base + " → " + past).padEnd(16)}${String(e0 ? `L${e0.at}` : "从未").padStart(10)} ${(e0?.kind ?? "").padEnd(2)} ${(e0 ? e0.detail.slice(0, 40) : "——").padEnd(44)}| ${String(d0 ? `L${d0.at}` : "—").padStart(6)}  ${verdict}`,
  );
}
console.log(`\n  ⇒ 时序倒挂 ${inversions.length} 条：`);
for (const s of inversions) console.log(`     • ${s}`);
console.log(`  ⇒ 同课/同案同时刻 ${sameTime.length} 条（需人工看案文里是否先给了正确用法）：`);
for (const s of sameTime) console.log(`     • ${s}`);

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s08-B · ⭐⭐ 三条「语法形状缺口」的逐条对照（wore / said / told）");
console.log("════════════════════════════════════════════════════════════════");
for (const [base, past] of [["wear","wore"],["say","said"],["tell","told"]] as [string,string][]) {
  const ex = exposures(past);
  const dm = demands(past);
  const exB = exposures(base);
  const dmAsErr = demandsAsError(base);
  console.log(`\n  ╔══ ${base} → ${past} ══`);
  console.log(`  ║ ① ${past} 以正确用法出现 ${ex.length} 处：`);
  for (const e of ex) console.log(`  ║      ${e.kind} @${String(e.at).padStart(3)}  ${e.detail}`);
  if (!ex.length) console.log("  ║      （全库 0 处——从未以正确用法出现）");
  console.log(`  ║ ② ${past} 被要求产出（errors[].correction）${dm.length} 处：`);
  for (const d of dm) console.log(`  ║      案 @${String(d.at).padStart(3)}  ${d.caseId}(#${d.n})：${d.detail}`);
  if (!dm.length) console.log("  ║      （全库 0 处——从不要求用户产出）");
  console.log(`  ║ ③ ${base}（原形）以正确用法出现 ${exB.length} 处，首次 = ${exB[0] ? `@${exB[0].at} ${exB[0].detail}` : "从未"}`);
  console.log(`  ║ ④ ${base}（原形）被要求点出为错词 ${dmAsErr.length} 处：${dmAsErr.map((x) => `@${x.at}(${x.caseId})`).join(", ") || "无"}`);
  console.log(`  ╚══`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s08-C · 把「见过」拆到课时序：said 在 L21 之前到底教了什么");
console.log("════════════════════════════════════════════════════════════════");
console.log("  L10-L21 之间，课程教过的不规则昨天版（正侧）逐课：");
for (const l of grammarLessons.filter((x) => x.number >= 10 && x.number <= 21)) {
  const found: string[] = [];
  for (const [, past] of PASTS) {
    const r = rx(past);
    let hit = false;
    const pos = (t?: string | null) => { if (t && r.test(t)) hit = true; };
    pos(l.targetSentence); for (const e of l.examples) pos(e.en); for (const v of l.variants ?? []) pos(v.en);
    for (const s of l.sceneSwings ?? []) pos(s.en); for (const c of l.contrast ?? []) pos(c.correct);
    for (const g of l.guided) if (g.kind !== "spot") pos(g.answer);
    for (const p of l.practice) pos(p.answer); pos(l.recall?.answer);
    if (hit) found.push(past);
  }
  console.log(`  L${String(l.number).padStart(3)}「${l.title}」${l.grammarLabel}`);
  console.log(`        教过的昨天版：${found.length ? found.join(", ") : "（无）"}`);
}
console.log("\n  ⇒ said 在 L21 被要求时，库内已教的不规则昨天版清单里**没有 said**。");

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s08-D · L21 案件的错点全貌与它的「回流」设计意图");
console.log("════════════════════════════════════════════════════════════════");
const hw = huntCases.find((c) => c.id === "hunt-homework-note")!;
console.log(`  案 ${hw.id}(#${hw.number})《${hw.title}》 解锁课 = L${unlockOf.get(hw.id)}`);
console.log(`  tokens: ${JSON.stringify(hw.tokens.join(" "))}`);
for (const e of hw.errors) {
  console.log(`  ── errors[${e.tokenIndex}] tag=${e.tag}  ${e.original} → ${e.correction}`);
  console.log(`     ${e.explanation}`);
  // 该修正形式在 L21 之前是否以正确用法出现过
  const corr = e.correction.replace(/[.,!?;:]/g, "").split(/\s+/).filter(Boolean);
  for (const w of corr) {
    if (w.length < 2) continue;
    const ex = exposures(w).filter((x) => x.at < unlockOf.get(hw.id)!);
    console.log(`     · 形式「${w}」在 L${unlockOf.get(hw.id)} 之前的正确用法曝光：${ex.length ? ex.map((x) => `${x.kind}@${x.at}`).join(", ") : "❌ 0 处"}`);
  }
}
