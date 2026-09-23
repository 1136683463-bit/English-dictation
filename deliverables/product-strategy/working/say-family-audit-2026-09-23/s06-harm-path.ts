/**
 * s06：决定性核查 —— 「找错案件要求用户产出某个不规则昨天版，而该形式此前从未
 *      以正确用法出现过」是不是**系统性问题**，还是 `said` 独有？
 *
 * 这是本批判定的核心。做法：
 *   ① 把「用户首次能见到某形式 F 的正确用法」的最早时点算出来
 *      （课程：该形式首次出现在**正确侧**的课号；案件：该形式作为正确用法出现的案号）
 *   ② 把「用户首次被要求产出/识别 F」的最早时点算出来
 *      （案件：errors[].correction 含 F 且该案的解锁课 ≤ 某课）
 *   ③ 比较两者 → 若「被要求」早于「见过」，就是一条时序倒挂（harm path）
 *
 * 关键概念：**解锁课**（案件由哪一课引用 → R01 课程锁决定何时可见）。
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";

const rx = (f: string) => new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i");

// ── 案件 → 解锁课 ──
const unlockOf = new Map<string, number | "extra">();
for (const c of huntCases) {
  const ls = grammarLessons.filter((l) => l.huntCaseIds.includes(c.id));
  unlockOf.set(c.id, ls.length ? Math.min(...ls.map((l) => l.number)) : "extra");
}
console.log("════════════════════════════════════════════════════════════════");
console.log("s06-A · 案件解锁时点核对（R01 课程锁）");
console.log("════════════════════════════════════════════════════════════════");
console.log(`  案件总数 ${huntCases.length}`);
const extra = huntCases.filter((c) => unlockOf.get(c.id) === "extra");
console.log(`  番外案（无课引用，第 12 课后整体解锁）${extra.length} 案：${extra.map((c) => c.id).join(", ")}`);
console.log(`  其余 ${huntCases.length - extra.length} 案按引用课解锁`);

// ── ① 每个形式的「首次以正确用法出现」时点 ──
interface First {
  form: string;
  firstLesson: number | null; // 最早出现在正确侧的课号
  firstLessonDetail: string;
  firstCase: number | null; // 最早作为正确用法出现的案号（且在该案的解锁课）
  firstCaseDetail: string;
  /** 首次「可被用户看到」的全局时序值：课按 number、案按解锁课 number 混排，取最小值 */
  firstSeen: { at: number; kind: string; detail: string } | null;
}

function firstAppearance(form: string): First {
  const r = rx(form);
  let firstLesson: number | null = null;
  let firstLessonDetail = "";
  let firstCase: number | null = null;
  let firstCaseDetail = "";
  const seen: { at: number; kind: string; detail: string }[] = [];

  for (const l of grammarLessons) {
    const hit: string[] = [];
    const pos = (t: string | null | undefined, slot: string) => { if (t && r.test(t)) hit.push(`${slot}=${JSON.stringify(t.slice(0, 60))}`); };
    pos(l.targetSentence, "targetSentence");
    pos(l.dialogueEn, "dialogueEn");
    for (const d of l.dialogue ?? []) pos(d.en, `dialogue(${d.who})`);
    for (const e of l.examples) pos(e.en, "examples");
    for (const v of l.variants ?? []) pos(v.en, `variants(${v.label})`);
    for (const s of l.sceneSwings ?? []) pos(s.en, "sceneSwings");
    for (const b of l.blocks) pos(b.text, "blocks");
    for (const c of l.contrast ?? []) { pos(c.correct, "contrast.correct"); if (c.bothRight) pos(c.wrong, "contrast.wrong(bothRight=正确)"); }
    for (const g of l.guided) { if (g.kind !== "spot") { pos(g.answer, `guided(${g.kind}).answer`); pos((g.tokens ?? []).join(" "), "guided.tokens"); } }
    for (const p of l.practice) pos(p.answer, "practice.answer");
    pos(l.recall?.answer, "recall.answer");
    if (hit.length) {
      seen.push({ at: l.number, kind: "课", detail: `L${l.number} ${l.grammarLabel} · ${hit[0]}` });
      if (firstLesson === null) { firstLesson = l.number; firstLessonDetail = `L${l.number} ${l.grammarLabel} · ${hit.slice(0, 2).join(" / ")}`; }
    }
  }
  for (const c of huntCases) {
    const errIdx = new Set(c.errors.map((e) => e.tokenIndex));
    const hits: string[] = [];
    for (const [i, t] of c.tokens.entries()) if (r.test(t) && !errIdx.has(i)) hits.push(`tokens[${i}]="${t}"`);
    for (const e of c.errors) if (r.test(e.correction)) hits.push(`correction="${e.correction}"`);
    if (hits.length) {
      const u = unlockOf.get(c.id)!;
      const at = u === "extra" ? 12 : u;
      seen.push({ at, kind: "案", detail: `${c.id}(#${c.number})@L${u} · ${hits[0]}` });
      if (firstCase === null) { firstCase = c.number; firstCaseDetail = `${c.id}(#${c.number})@解锁L${u} · ${hits[0]}`; }
    }
  }
  seen.sort((a, b) => a.at - b.at);
  return { form, firstLesson, firstLessonDetail, firstCase, firstCaseDetail, firstSeen: seen[0] ?? null };
}

// ── ② 每个形式的「首次被要求产出」时点 ──
interface Demand { form: string; caseId: string; caseNumber: number; unlockLesson: number | "extra"; detail: string; at: number }
function firstDemand(form: string): Demand | null {
  const r = rx(form);
  const out: Demand[] = [];
  for (const c of huntCases) {
    const u = unlockOf.get(c.id)!;
    for (const e of c.errors) {
      if (r.test(e.correction)) {
        out.push({ form, caseId: c.id, caseNumber: c.number, unlockLesson: u, detail: `${c.id}(#${c.number}) @解锁L${u}：${e.original} → ${e.correction}（${e.explanation.slice(0, 50)}）`, at: u === "extra" ? 12 : u });
      }
    }
  }
  out.sort((a, b) => a.at - b.at || a.caseNumber - b.caseNumber);
  return out[0] ?? null;
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s06-B · 全库不规则昨天版：首次「见过」(正确用法) vs 首次「被要求产出」");
console.log("════════════════════════════════════════════════════════════════");
console.log("  ⚠️ 判据：若「被要求」的时点 < 「见过」的时点 → 时序倒挂 = 一条真实伤害路径");

const PASTS: [string, string][] = [
  ["go", "went"], ["have", "had"], ["do", "did"], ["be", "was"], ["eat", "ate"], ["see", "saw"],
  ["make", "made"], ["take", "took"], ["come", "came"], ["get", "got"], ["run", "ran"],
  ["think", "thought"], ["know", "knew"], ["swim", "swam"], ["sing", "sang"], ["sit", "sat"],
  ["catch", "caught"], ["feel", "felt"], ["keep", "kept"], ["sleep", "slept"], ["draw", "drew"],
  ["wear", "wore"], ["give", "gave"], ["say", "said"], ["tell", "told"], ["buy", "bought"],
  ["bring", "brought"], ["teach", "taught"], ["find", "found"], ["leave", "left"], ["meet", "met"],
  ["send", "sent"], ["spend", "spent"], ["win", "won"], ["lose", "lost"], ["write", "wrote"],
  ["read", "read"], ["cut", "cut"], ["put", "put"], ["stand", "stood"], ["speak", "spoke"],
  ["hold", "held"], ["build", "built"], ["pay", "paid"], ["sell", "sold"], ["ride", "rode"],
  ["drive", "drove"], ["fly", "flew"], ["grow", "grew"], ["begin", "began"], ["choose", "chose"],
  ["wake", "woke"], ["fall", "fell"], ["break", "broke"], ["ring", "rang"], ["sit", "sat"],
];

const inverted: string[] = [];
for (const [base, past] of PASTS) {
  const f = firstAppearance(past);
  const d = firstDemand(past);
  const seenAt = f.firstSeen?.at ?? null;
  const demandAt = d?.at ?? null;
  let verdict = "";
  if (demandAt !== null && (seenAt === null || demandAt < seenAt)) { verdict = "  ⚠️ 时序倒挂"; inverted.push(`${past}：首次被要求 L${demandAt} < 首次见过 ${seenAt === null ? "从未" : `L${seenAt}`}`); }
  else if (demandAt !== null && seenAt !== null && demandAt === seenAt) verdict = "  （同课，先后需人工看）";
  console.log(
    `  ${(base + " → " + past).padEnd(16)} 首次见过 ${String(seenAt ?? "从未").padStart(4)}  ${(f.firstSeen?.kind ?? "").padEnd(2)} ${(f.firstSeen?.detail ?? "——").slice(0, 44).padEnd(46)} | 首次被要求 ${String(demandAt ?? "从未").padStart(4)}  ${verdict}`,
  );
}
console.log(`\n  ⇒ 时序倒挂共 ${inverted.length} 条：`);
for (const s of inverted) console.log(`     • ${s}`);

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s06-C · `said` 与 `wore` 逐项对照（批四十六把 wore 判为「有真实伤害」）");
console.log("════════════════════════════════════════════════════════════════");
for (const [base, past, blame] of [["wear", "wore", "批四十六"], ["say", "said", "本批（任务书口径：said 正侧仅 1–2 处）"], ["tell", "told", "批四十八判「不做」"]]) {
  const f = firstAppearance(past);
  const d = firstDemand(past);
  console.log(`\n  ── ${base} → ${past} （${blame}）`);
  console.log(`     ${past} 首次以正确用法出现：${f.firstSeen ? `${f.firstSeen.kind} @ ${f.firstSeen.at} —— ${f.firstSeen.detail}` : "全库从未"}`);
  console.log(`     ${base} 基础形首次以正确用法出现（仅课程侧）：`);
  const fb = firstAppearance(base);
  console.log(`        ${fb.firstLesson !== null ? fb.firstLessonDetail : "课程里从未"}  （案侧：${fb.firstCaseDetail || "从未"}）`);
  console.log(`     ${past} 首次被要求产出/识别：${d ? `案 ${d.caseId} @解锁L${d.unlockLesson}` : "全库从未"}`);
  if (d) console.log(`        ${d.detail}`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s06-D · `say` 家族五个形状，逐形状的「首次见过 / 首次被要求」");
console.log("════════════════════════════════════════════════════════════════");
for (const form of ["say", "says", "said", "saying", "told", "tell"]) {
  const f = firstAppearance(form);
  const d = firstDemand(form);
  console.log(`\n  ── ${form}`);
  console.log(`     首次以正确用法出现：${f.firstSeen ? `${f.firstSeen.kind} @ ${f.firstSeen.at} —— ${f.firstSeen.detail}` : "全库从未"}`);
  const all: string[] = [];
  for (const l of grammarLessons) {
    const r = rx(form);
    const hit: string[] = [];
    const pos = (t: string | null | undefined, slot: string) => { if (t && r.test(t)) hit.push(`${slot}=${JSON.stringify(t.slice(0, 50))}`); };
    pos(l.targetSentence, "targetSentence");
    for (const d2 of l.dialogue ?? []) pos(d2.en, `dialogue(${d2.who})`);
    for (const e of l.examples) pos(e.en, "examples");
    for (const v of l.variants ?? []) pos(v.en, "variants");
    for (const s of l.sceneSwings ?? []) pos(s.en, "sceneSwings");
    for (const b of l.blocks) pos(b.text, "blocks");
    for (const c of l.contrast ?? []) { pos(c.correct, "contrast.correct"); if (c.bothRight) pos(c.wrong, "contrast.wrong(bothRight)"); }
    for (const g of l.guided) if (g.kind !== "spot") pos(g.answer, `guided(${g.kind})`);
    for (const p of l.practice) pos(p.answer, "practice");
    pos(l.recall?.answer, "recall");
    if (hit.length) all.push(`L${l.number}[${hit.length}]`);
  }
  console.log(`     正侧落课：${all.join(" ") || "（无）"}`);
  console.log(`     首次被要求：${d ? `${d.detail}` : "全库从未"}`);
}
