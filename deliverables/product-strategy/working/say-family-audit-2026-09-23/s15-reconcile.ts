/**
 * s15：⭐ 与任务书数字的**逐项对账**（任务书说 say=2 / says=21 / said=1）
 *   以及「回流」设计意图核查（hunt-weekend-note 是否为 L21 案件的有意配对）
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";

const rx = (f: string) => new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i");
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.!?,]+$/, "");

type Opt = { excludeSpotAnswer: boolean; excludeBothRightWrong: boolean; includeCases: boolean; includeMeta: boolean };

function count(form: string, o: Opt) {
  const r = rx(form);
  const pos: string[] = [];
  const neg: string[] = [];
  if (o.includeMeta) {
    for (const l of grammarLessons) {
      if (r.test(l.id)) pos.push(`L${l.number}.id`);
      if (r.test(l.grammarLabel)) pos.push(`L${l.number}.grammarLabel`);
      if (r.test(l.title)) pos.push(`L${l.number}.title`);
      if (r.test(l.episode)) pos.push(`L${l.number}.episode`);
      if (r.test(l.scene)) pos.push(`L${l.number}.scene`);
      if (l.cover && r.test(l.cover)) pos.push(`L${l.number}.cover`);
    }
  }
  for (const l of grammarLessons) {
    const P = (s: string, t?: string | null) => { if (t && r.test(t)) pos.push(`L${l.number}.${s}`); };
    const N = (s: string, t?: string | null) => { if (t && r.test(t)) neg.push(`L${l.number}.${s}`); };
    P("targetSentence", l.targetSentence); P("dialogueEn", l.dialogueEn);
    for (const [i, d] of (l.dialogue ?? []).entries()) P(`dialogue[${i}](${d.who})`, d.en);
    for (const [i, e] of l.examples.entries()) P(`examples[${i}]`, e.en);
    for (const [i, v] of (l.variants ?? []).entries()) P(`variants[${i}]`, v.en);
    for (const [i, s] of (l.sceneSwings ?? []).entries()) P(`sceneSwings[${i}]`, s.en);
    for (const [i, b] of l.blocks.entries()) P(`blocks[${i}]`, b.text);
    for (const [i, c] of (l.contrast ?? []).entries()) {
      P(`contrast[${i}].correct`, c.correct);
      if (c.bothRight) { if (!o.excludeBothRightWrong) P(`contrast[${i}].wrong(bothRight→正确)`, c.wrong); }
      else N(`contrast[${i}].wrong`, c.wrong);
      if (c.wrongMark) N(`contrast[${i}].wrongMark`, c.wrongMark);
    }
    for (const [i, g] of l.guided.entries()) {
      if (g.kind === "spot") { if (!o.excludeSpotAnswer) N(`guided[${i}](spot).answer/wrongToken`, g.answer); N(`guided[${i}](spot).tokens`, (g.tokens ?? []).join(" ")); continue; }
      P(`guided[${i}].answer`, g.answer); P(`guided[${i}].replaceBase`, g.replaceBase); P(`guided[${i}].tokens`, (g.tokens ?? []).join(" "));
      for (const op of g.options ?? []) { if (op === g.answer) P(`guided[${i}].options(=答案)`, op); else N(`guided[${i}].options(干扰项)`, op); }
    }
    for (const [i, p] of l.practice.entries()) { P(`practice[${i}].answer`, p.answer); for (const d of p.distractors ?? []) N(`practice[${i}].distractors`, d); }
    P("recall.answer", l.recall?.answer);
  }
  const casePos: string[] = [], caseNeg: string[] = [];
  if (o.includeCases) {
    for (const c of huntCases) {
      const errIdx = new Set(c.errors.map((e) => e.tokenIndex));
      for (const [i, t] of c.tokens.entries()) if (r.test(t)) (errIdx.has(i) ? caseNeg : casePos).push(`案${c.id}.tokens[${i}]`);
      for (const e of c.errors) { if (r.test(e.original)) caseNeg.push(`案${c.id}.original`); if (r.test(e.correction)) casePos.push(`案${c.id}.correction`); }
    }
  }
  return { pos: [...pos, ...casePos], neg: [...neg, ...caseNeg] };
}

console.log("════════════════════════════════════════════════════════════════");
console.log("s15-A · ⭐ 与任务书对账（任务书：say 2 / says 21 / said 1）");
console.log("════════════════════════════════════════════════════════════════");
const OPTS: [string, Opt][] = [
  ["① 课+案，排除 spot.answer 与 bothRight.wrong（任务书口径猜测）", { excludeSpotAnswer: true, excludeBothRightWrong: true, includeCases: true, includeMeta: false }],
  ["② 课+案，排除 spot.answer，**含** bothRight.wrong", { excludeSpotAnswer: true, excludeBothRightWrong: false, includeCases: true, includeMeta: false }],
  ["③ **只课**，排除 spot.answer 与 bothRight.wrong", { excludeSpotAnswer: true, excludeBothRightWrong: true, includeCases: false, includeMeta: false }],
  ["④ **只课**，排除 spot.answer，含 bothRight.wrong", { excludeSpotAnswer: true, excludeBothRightWrong: false, includeCases: false, includeMeta: false }],
  ["⑤ 只课，不排除 spot.answer，含 bothRight（最宽）", { excludeSpotAnswer: false, excludeBothRightWrong: false, includeCases: false, includeMeta: false }],
  ["⑥ 只课+案+元数据，全不排除", { excludeSpotAnswer: false, excludeBothRightWrong: false, includeCases: true, includeMeta: true }],
];
console.log("  口径".padEnd(52) + "say正".padStart(7) + "says正".padStart(8) + "said正".padStart(8));
for (const [label, o] of OPTS) {
  const a = count("say", o).pos.length, b = count("says", o).pos.length, c = count("said", o).pos.length;
  const mark = b === 21 && a === 2 && c === 1 ? "  ← ✅ 与任务书完全一致" : "";
  console.log(`  ${label.padEnd(50)}${String(a).padStart(7)}${String(b).padStart(8)}${String(c).padStart(8)}${mark}`);
}
console.log("\n  ⇒ 任务书的 says=21 / say=2 / said=1 落在哪个口径：见上表带 ✅ 的那一行");

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s15-B · ⭐ 「回流」配对核查：L21 案件与 L24 案件是不是有意配对");
console.log("════════════════════════════════════════════════════════════════");
for (const id of ["hunt-homework-note", "hunt-weekend-note"]) {
  const c = huntCases.find((x) => x.id === id)!;
  const host = grammarLessons.filter((l) => l.huntCaseIds.includes(id)).map((l) => `L${l.number}「${l.title}」${l.grammarLabel}`);
  console.log(`\n  ── ${c.id}(#${c.number})《${c.title}》`);
  console.log(`     宿主课：${host.join(" / ")}`);
  console.log(`     tokens：${JSON.stringify(c.tokens.join(" "))}`);
  for (const e of c.errors) console.log(`     errors[${e.tokenIndex}] ${e.tag}：${e.original} → ${e.correction}  「${e.explanation}」`);
}
console.log(`\n  ⇒ hunt-homework-note 在 L21 要求把 say 改成 said；`);
console.log(`     hunt-weekend-note 在 L24 的案文里**本来就正确使用** said（Dad said we must…）——`);
console.log(`     用户被要求产出 said 之后 3 课，就在另一个案件里见到它的正确用法。`);

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s15-C · 全库「被要求产出」的案件配对：每个 demand 都被其后 5 课内的案件/课程接住吗？");
console.log("════════════════════════════════════════════════════════════════");
const unlockOf = new Map<string, number>();
for (const c of huntCases) {
  const ls = grammarLessons.filter((l) => l.huntCaseIds.includes(c.id));
  unlockOf.set(c.id, ls.length ? Math.min(...ls.map((l) => l.number)) : 12);
}
const FORMS: [string, string][] = [["go","went"],["have","had"],["do","did"],["be","was"],["eat","ate"],["see","saw"],["make","made"],["take","took"],["get","got"],["think","thought"],["know","knew"],["swim","swam"],["sit","sat"],["catch","caught"],["feel","felt"],["keep","kept"],["sleep","slept"],["draw","drew"],["wear","wore"],["give","gave"],["say","said"],["buy","bought"],["bring","brought"],["find","found"],["take","taken"],["do","done"],["eat","eaten"],["see","seen"],["break","broken"],["play","played"],["help","helped"],["stay","stayed"],["finish","finished"],["call","called"],["put","put"],["ring","ring"],["lose","lost"],["fall","fell"],["walk","walked"],["work","worked"],["clean","cleaned"],["visit","visited"]];
interface GapRow { form: string; demandAt: number; nextAt: number | null; gap: number | null; n: number; detail: string }
const gapRows: GapRow[] = [];
for (const [base, f] of FORMS) {
  const r = rx(f);
  // 正侧时间线
  const seen: { at: number; where: string }[] = [];
  for (const l of grammarLessons) {
    const hit: string[] = [];
    const P = (s: string, t?: string | null) => { if (t && r.test(t)) hit.push(s); };
    P("target", l.targetSentence); P("dialogueEn", l.dialogueEn);
    for (const [i, d] of (l.dialogue ?? []).entries()) P(`dialogue[${i}]`, d.en);
    for (const [i, e] of l.examples.entries()) P(`examples[${i}]`, e.en);
    for (const [i, v] of (l.variants ?? []).entries()) P(`variants[${i}]`, v.en);
    for (const [i, s] of (l.sceneSwings ?? []).entries()) P(`sceneSwings[${i}]`, s.en);
    for (const [i, b] of l.blocks.entries()) P(`blocks[${i}]`, b.text);
    for (const [i, c] of (l.contrast ?? []).entries()) { P(`contrast[${i}].correct`, c.correct); if (c.bothRight) P(`contrast[${i}].wrong(bothRight)`, c.wrong); }
    for (const [i, g] of l.guided.entries()) if (g.kind !== "spot") { P(`guided[${i}].answer`, g.answer); P(`guided[${i}].tokens`, (g.tokens ?? []).join(" ")); }
    for (const [i, p] of l.practice.entries()) P(`practice[${i}].answer`, p.answer);
    P("recall.answer", l.recall?.answer);
    if (hit.length) seen.push({ at: l.number, where: `L${l.number}「${l.title}」·${hit[0]}` });
  }
  for (const c of huntCases) {
    const errIdx = new Set(c.errors.map((e) => e.tokenIndex));
    const hit: string[] = [];
    for (const [i, t] of c.tokens.entries()) if (r.test(t) && !errIdx.has(i)) hit.push(`tokens[${i}]`);
    if (hit.length) seen.push({ at: unlockOf.get(c.id)!, where: `案${c.id}(#${c.number})@L${unlockOf.get(c.id)}·${hit[0]}` });
  }
  seen.sort((a, b) => a.at - b.at);
  const demands: { at: number; where: string }[] = [];
  for (const c of huntCases) for (const e of c.errors) if (r.test(e.correction)) demands.push({ at: unlockOf.get(c.id)!, where: `${c.id}(#${c.number})@L${unlockOf.get(c.id)}` });
  demands.sort((a, b) => a.at - b.at);
  if (!demands.length) continue;
  const d0 = demands[0];
  const after = seen.find((x) => x.at > d0.at);
  gapRows.push({ form: `${base}→${f}`, demandAt: d0.at, nextAt: after?.at ?? null, gap: after ? after.at - d0.at : null, n: demands.length, detail: `${d0.where} ⇒ ${after?.where ?? "（从未）"}` });
}
gapRows.sort((a, b) => (a.gap ?? 99999) - (b.gap ?? 99999));
console.log("  gap 由小到大（小的=被要求后很快见到正确用法 = 已经有承接）：");
for (const r of gapRows) console.log(`  ${String(r.gap ?? "∞").padStart(6)}  ${r.form.padEnd(18)} 被要求@L${String(r.demandAt).padStart(3)} ${r.detail}`);
const saidG = gapRows.find((r) => r.form === "say→said")!;
const woreG = gapRows.find((r) => r.form === "wear→wore")!;
const finite = gapRows.filter((r) => r.gap !== null).map((r) => r.gap!) as number[];
finite.sort((a, b) => a - b);
console.log(`\n  有限 gap 共 ${finite.length} 条：最小 ${finite[0]}，中位 ${finite[Math.floor(finite.length / 2)]}，最大 ${finite[finite.length - 1]}`);
console.log(`  said 的 gap = ${saidG.gap}（位次 ${finite.indexOf(saidG.gap!) + 1} / ${finite.length}，越小越好）`);
console.log(`  wore 的 gap = ${woreG.gap}（位次 ${finite.indexOf(woreG.gap!) + 1} / ${finite.length}）`);
console.log(`  ∞（被要求后从未再见）共 ${gapRows.filter((r) => r.gap === null).length} 条：${gapRows.filter((r) => r.gap === null).map((r) => r.form).join(", ")}`);
