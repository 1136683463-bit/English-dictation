/**
 * s13：⭐ 决定性指标 —— 「被要求后，多久才第一次见到正确用法」（缺口跨度 / gap）
 *
 * 定义：
 *   demandAt(F)   = 用户**第一次被要求处理** F 的时点（案件 errors[].correction 含 F，取解锁课）
 *   nextSeenAt(F) = 在 demandAt 之后，F 第一次以**正确用法**出现的时点
 *   gap(F)        = nextSeenAt - demandAt   （若其后从未出现 → Infinity）
 *
 * 用法：这是对批四十六「wore 有真实伤害」那条论证的**量化**。
 *   批四十六的论证（逐字）：「用户在 L20 被要求答出 wore，却要到 19 课之后才第一次见到 wear，
 *   而 wore 从未在任何一课的正确句里出现过」——这就是 gap 极大 + 一个前缀条件。
 *   本指标把它变成全库可比的数字。
 *
 * 口径：正侧曝光 = 课程正侧槽位（含 bothRight.wrong）+ 案件 tokens 里未被 errors 指向的该形式
 *       ⚠️ 不含 errors[].correction（那是「被要求」本身，不是曝光）
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";

const rx = (f: string) => new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i");

const unlockOf = new Map<string, number>();
for (const c of huntCases) {
  const ls = grammarLessons.filter((l) => l.huntCaseIds.includes(c.id));
  unlockOf.set(c.id, ls.length ? Math.min(...ls.map((l) => l.number)) : 12);
}

/** 所有「以正确用法出现」的时点（课按课号、案按解锁课号） */
function seenTimeline(form: string): { at: number; where: string }[] {
  const r = rx(form);
  const out: { at: number; where: string }[] = [];
  for (const l of grammarLessons) {
    const hits: string[] = [];
    const pos = (t: string | null | undefined, slot: string) => { if (t && r.test(t)) hits.push(slot); };
    pos(l.targetSentence, "targetSentence"); pos(l.dialogueEn, "dialogueEn");
    for (const d of l.dialogue ?? []) pos(d.en, `dialogue(${d.who})`);
    for (const e of l.examples) pos(e.en, "examples");
    for (const v of l.variants ?? []) pos(v.en, `variants(${v.label})`);
    for (const s of l.sceneSwings ?? []) pos(s.en, "sceneSwings");
    for (const b of l.blocks) pos(b.text, "blocks");
    for (const c of l.contrast ?? []) { pos(c.correct, "contrast.correct"); if (c.bothRight) pos(c.wrong, "contrast.wrong(bothRight→正确)"); }
    for (const g of l.guided) { if (g.kind !== "spot") { pos(g.answer, `guided(${g.kind}).answer`); pos((g.tokens ?? []).join(" "), "guided.tokens"); } }
    for (const p of l.practice) pos(p.answer, `practice[].answer`);
    pos(l.recall?.answer, "recall.answer");
    if (hits.length) out.push({ at: l.number, where: `L${l.number}「${l.title}」·${hits[0]}` });
  }
  for (const c of huntCases) {
    const errIdx = new Set(c.errors.map((e) => e.tokenIndex));
    const hits: string[] = [];
    for (const [i, t] of c.tokens.entries()) if (r.test(t) && !errIdx.has(i)) hits.push(`tokens[${i}]="${t}"`);
    if (hits.length) out.push({ at: unlockOf.get(c.id)!, where: `案${c.id}(#${c.number})@L${unlockOf.get(c.id)}·${hits[0]}` });
  }
  return out.sort((a, b) => a.at - b.at);
}

/** 所有「被要求」的时点 */
function demandTimeline(form: string) {
  const r = rx(form);
  const out: { at: number; where: string }[] = [];
  for (const c of huntCases) for (const e of c.errors) if (r.test(e.correction)) out.push({ at: unlockOf.get(c.id)!, where: `${c.id}(#${c.number})@L${unlockOf.get(c.id)}：${e.original}→${e.correction}` });
  return out.sort((a, b) => a.at - b.at);
}

const FORMS: [string, string][] = [
  ["go","went"],["have","had"],["do","did"],["be","was"],["eat","ate"],["see","saw"],["make","made"],
  ["take","took"],["come","came"],["get","got"],["run","ran"],["lose","lost"],["walk","walked"],
  ["finish","finished"],["play","played"],["help","helped"],["call","called"],["stay","stayed"],
  ["think","thought"],["know","knew"],["swim","swam"],["sing","sang"],["sit","sat"],["catch","caught"],
  ["feel","felt"],["keep","kept"],["sleep","slept"],["draw","drew"],["wear","wore"],["give","gave"],
  ["say","said"],["tell","told"],["buy","bought"],["find","found"],["leave","left"],["meet","met"],
  ["win","won"],["put","put"],["read","read"],["fall","fell"],["break","broke"],["ring","rang"],
  ["write","wrote"],["speak","spoke"],["teach","taught"],["bring","brought"],["send","sent"],
  ["spend","spent"],["pay","paid"],["stand","stood"],["build","built"],["hold","held"],
  ["ride","rode"],["drive","drove"],["fly","flew"],["grow","grew"],["begin","began"],
  ["choose","chose"],["wake","woke"],["cut","cut"],["go","gone"],["see","seen"],["do","done"],
  ["eat","eaten"],["break","broken"],["take","taken"],["wear","worn"],["write","written"],
  ["lose","lost"],["says","says"],["said","said"],["say","say"],["saying","saying"],
];

console.log("════════════════════════════════════════════════════════════════");
console.log("s13-A · ⭐ 缺口跨度 gap = 「首次被要求」到「其后首次见到正确用法」的距离");
console.log("════════════════════════════════════════════════════════════════");
console.log("  gap = nextSeen - demandAt；gap=∞ 表示被要求后**再也没有**以正确用法出现过");
console.log("  判读：gap 越小越好；批四十六把 wore 的 gap=183 判为「真实的用户伤害路径」\n");
console.log("  形式".padEnd(14) + "被要求@".padStart(9) + "  其后首次见到".padStart(16) + "  gap".padStart(7) + "  条目");

interface Row { form: string; demandAt: number; nextSeen: number | null; gap: number | null; nDemands: number; where: string }
const rows: Row[] = [];
for (const [base, form] of FORMS) {
  const dm = demandTimeline(form);
  if (!dm.length) continue;
  const tl = seenTimeline(form);
  const d0 = dm[0];
  const after = tl.find((x) => x.at > d0.at) ?? null;
  rows.push({ form: `${base}→${form}`, demandAt: d0.at, nextSeen: after?.at ?? null, gap: after ? after.at - d0.at : null, nDemands: dm.length, where: `${d0.where} ⇒ ${after ? after.where : "（其后从未以正确用法出现）"}` });
}
rows.sort((a, b) => (b.gap ?? 99999) - (a.gap ?? 99999));
for (const r of rows) {
  console.log(
    `  ${r.form.padEnd(12)}${String(r.demandAt).padStart(9)}  ${String(r.nextSeen ?? "从未").padStart(16)}  ${String(r.gap ?? "∞").padStart(7)}  ${r.where}`,
  );
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s13-B · 排序：gore 单独看 —— `wear→wore` 与 `say→said` 的差距");
console.log("════════════════════════════════════════════════════════════════");
for (const f of ["wore", "said"]) {
  const r = rows.find((x) => x.form.endsWith(`→${f}`))!;
  console.log(`  ${r.form}：被要求 @L${r.demandAt}，其后首次见到 @${r.nextSeen ?? "从未"}，gap=${r.gap ?? "∞"}，共被要求 ${r.nDemands} 次`);
}
const woreRow = rows.find((x) => x.form.endsWith("→wore"))!;
const saidRow = rows.find((x) => x.form.endsWith("→said"))!;
console.log(`\n  ⇒ wore 的 gap = ${woreRow.gap}；said 的 gap = ${saidRow.gap}`);
console.log(`     said 的 gap 只有 wore 的 1/${Math.round((woreRow.gap ?? 1) / (saidRow.gap ?? 1))}——**量级不同**。`);

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s13-C · `said` 的完整曝光时间线（正侧，逐条）");
console.log("════════════════════════════════════════════════════════════════");
for (const x of seenTimeline("said")) console.log(`  @${String(x.at).padStart(3)}  ${x.where}`);
console.log("  ── 被要求 ──");
for (const x of demandTimeline("said")) console.log(`  @${String(x.at).padStart(3)}  ${x.where}`);

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s13-D · `say` / `says` 的完整曝光时间线");
console.log("════════════════════════════════════════════════════════════════");
for (const f of ["say", "says"]) {
  console.log(`\n  ── ${f} 正侧 ──`);
  for (const x of seenTimeline(f)) console.log(`  @${String(x.at).padStart(3)}  ${x.where}`);
  console.log(`  ── ${f} 被要求 ──`);
  const dm = demandTimeline(f);
  if (!dm.length) console.log("  （从未被要求）");
  for (const x of dm) console.log(`  @${String(x.at).padStart(3)}  ${x.where}`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s13-E · `said` 全库的正/错/讲 分布（最终口径表）");
console.log("════════════════════════════════════════════════════════════════");
const r = rx("said");
const tally = { 正: [] as string[], 错: [] as string[], 讲: [] as string[], 被要求: [] as string[] };
for (const l of grammarLessons) {
  const L = (slot: string, t: string | null | undefined, side: keyof typeof tally) => { if (t && r.test(t)) tally[side].push(`L${l.number}.${slot}=${JSON.stringify(t.slice(0, 60))}`); };
  L("targetSentence", l.targetSentence, "正"); L("dialogueEn", l.dialogueEn, "正");
  for (const [i, d] of (l.dialogue ?? []).entries()) L(`dialogue[${i}](${d.who})`, d.en, "正");
  for (const [i, e] of l.examples.entries()) L(`examples[${i}]`, e.en, "正");
  for (const [i, v] of (l.variants ?? []).entries()) L(`variants[${i}]`, v.en, "正");
  for (const [i, s] of (l.sceneSwings ?? []).entries()) L(`sceneSwings[${i}]`, s.en, "正");
  for (const [i, b] of l.blocks.entries()) L(`blocks[${i}]`, b.text, "正");
  for (const [i, c] of (l.contrast ?? []).entries()) {
    L(`contrast[${i}].correct`, c.correct, "正");
    if (c.bothRight) L(`contrast[${i}].wrong(bothRight→正确)`, c.wrong, "正");
    else L(`contrast[${i}].wrong`, c.wrong, "错");
    if (c.wrongMark && rx("said").test(c.wrongMark)) L(`contrast[${i}].wrongMark(被划线)`, c.wrongMark, "错");
  }
  for (const [i, g] of l.guided.entries()) {
    if (g.kind !== "spot") { L(`guided[${i}].answer`, g.answer, "正"); L(`guided[${i}].replaceBase`, g.replaceBase, "正"); L(`guided[${i}].tokens`, (g.tokens ?? []).join(" "), "正"); }
    for (const o of g.options ?? []) L(`guided[${i}].options${o === g.answer ? "(=答案)" : "(!=答案)"}`, o, o === g.answer ? "正" : "错");
  }
  for (const [i, p] of l.practice.entries()) { L(`practice[${i}].answer`, p.answer, "正"); for (const d of p.distractors ?? []) L(`practice[${i}].distractors[]`, d, "错"); }
  L("recall.answer", l.recall?.answer, "正");
}
for (const c of huntCases) {
  const errIdx = new Set(c.errors.map((e) => e.tokenIndex));
  for (const [i, t] of c.tokens.entries()) if (r.test(t)) tally[errIdx.has(i) ? "错" : "正"].push(`案${c.id}(#${c.number}).tokens[${i}]=${JSON.stringify(t)}${errIdx.has(i) ? "（被判错）" : "（正确用法）"}`);
  for (const e of c.errors) { if (r.test(e.original)) tally.错.push(`案${c.id}.original=${JSON.stringify(e.original)}`); if (r.test(e.correction)) tally.被要求.push(`案${c.id}(#${c.number})@L${unlockOf.get(c.id)}.correction=${JSON.stringify(e.correction)}`); }
}
for (const k of ["正", "错", "讲", "被要求"] as const) {
  console.log(`\n  【${k}】${tally[k].length} 处`);
  for (const s of tally[k]) console.log(`    ${s}`);
}
