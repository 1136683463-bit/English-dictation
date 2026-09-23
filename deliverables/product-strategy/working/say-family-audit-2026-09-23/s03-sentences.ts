/**
 * 第 49 批 · s03：句子级去重计数 + 找错案件里的 say 家族真实曝光路径
 *
 * 为什么需要句子级去重：同一个句子在 targetSentence / blocks / examples / variants /
 * sceneSwings / summary.points / guided.answer / practice.answer / recall.answer 里
 * 会被重复写很多遍（如 L38 的 "She says she will come." 出现 20+ 次）。
 * 槽位计数（s01）回答「有多少个字段用到它」；句子级去重回答「用户实际见到几句不同的话」。
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";

const rx = (f: string) => new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i");

/** 归一化后再去重：小写 + 去首尾空白 + 收标点 */
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.!?,]+$/g, "");

interface Sent { form: string; side: "正" | "错"; lesson: number; where: string[]; sentence: string; who?: string }
function sentences(form: string): Sent[] {
  const r = rx(form);
  const map = new Map<string, Sent>();
  const add = (lesson: number, side: "正" | "错", sentence: string, where: string, who?: string) => {
    if (!r.test(sentence)) return;
    const key = `${side}::${norm(sentence)}`;
    const prev = map.get(key);
    if (prev) { prev.where.push(`L${lesson}.${where}`); return; }
    map.set(key, { form, side, lesson, where: [`L${lesson}.${where}`], sentence, who });
  };
  for (const l of grammarLessons) {
    add(l.number, "正", l.targetSentence, "targetSentence");
    add(l.number, "正", l.dialogueEn, "dialogueEn");
    for (const d of l.dialogue ?? []) add(l.number, "正", d.en, `dialogue(${d.who})`, d.who);
    for (const e of l.examples) add(l.number, "正", e.en, "examples");
    for (const v of l.variants ?? []) add(l.number, "正", v.en, `variants(${v.label})`);
    for (const s of l.sceneSwings ?? []) add(l.number, "正", s.en, "sceneSwings");
    for (const b of l.blocks) add(l.number, "正", b.text, "blocks");
    for (const c of l.contrast ?? []) {
      add(l.number, "正", c.correct, "contrast[].correct");
      if (c.bothRight) add(l.number, "正", c.wrong, "contrast[].wrong(bothRight=true→正确)");
      else add(l.number, "错", c.wrong, "contrast[].wrong");
    }
    for (const g of l.guided) {
      if (g.kind === "spot") { add(l.number, "错", (g.tokens ?? []).join(" "), "guided[spot].tokens"); }
      else {
        add(l.number, "正", g.answer, `guided[${g.kind}].answer`);
        add(l.number, "正", g.replaceBase ?? "", "guided.replaceBase");
        add(l.number, "正", (g.tokens ?? []).join(" "), "guided.tokens");
        for (const o of g.options ?? []) if (o !== g.answer) add(l.number, "错", o, "guided.options(干扰项)");
      }
    }
    for (const p of l.practice) { add(l.number, "正", p.answer, "practice[].answer"); for (const d of p.distractors ?? []) add(l.number, "错", d, "practice.distractors"); }
    add(l.number, "正", l.recall?.answer ?? "", "recall.answer");
  }
  return [...map.values()];
}

console.log("════════════════════════════════════════════════════════════════");
console.log("s03-A · 句子级去重计数（V3 口径，正侧排除 spot 与 bothRight 污染）");
console.log("════════════════════════════════════════════════════════════════");
console.log("  form".padEnd(10) + "正句".padStart(6) + "错句".padStart(6) + "  正句落课");
for (const f of ["say", "says", "said", "saying", "tell", "tells", "told", "thought", "knew", "swam", "sang", "sat", "caught", "felt", "kept", "slept", "drew", "wore", "gave"]) {
  const s = sentences(f);
  const pos = s.filter((x) => x.side === "正");
  const neg = s.filter((x) => x.side === "错");
  console.log(`  ${f.padEnd(8)}${String(pos.length).padStart(6)}${String(neg.length).padStart(6)}   [${[...new Set(pos.map((x) => x.lesson))].join(",")}]`);
}

for (const f of ["say", "said"]) {
  console.log(`\n【${f} 的全部正侧句子（去重后逐句）】`);
  for (const s of sentences(f).filter((x) => x.side === "正")) {
    console.log(`  L${String(s.lesson).padStart(3)} ${(s.who ? `who=${s.who}` : "        ")} ${JSON.stringify(s.sentence)}`);
    console.log(`        出现在 ${s.where.length} 个字段：${s.where.join(" ‖ ")}`);
  }
  console.log(`【${f} 的全部错侧句子（去重后逐句）】`);
  for (const s of sentences(f).filter((x) => x.side === "错")) {
    console.log(`  L${String(s.lesson).padStart(3)} ${JSON.stringify(s.sentence)}`);
    console.log(`        出现在 ${s.where.length} 个字段：${s.where.join(" ‖ ")}`);
  }
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s03-B · 找错案件：say/says/said 的**正确用法** vs **错误用法**");
console.log("    判据：case.tokens 里未被 errors[].tokenIndex 指向的含该形式的词 = 正确用法");
console.log("════════════════════════════════════════════════════════════════");
for (const f of ["say", "says", "said", "saying"]) {
  const r = rx(f);
  console.log(`\n── ${f} ──`);
  let n = 0;
  for (const c of huntCases) {
    const errIdx = new Set(c.errors.map((e) => e.tokenIndex));
    const corrIdx = new Set<number>();
    for (const e of c.errors) if (r.test(e.correction)) {
      // 找到被修正后落在哪个下标（近似：同一 tokenIndex）
      corrIdx.add(e.tokenIndex);
    }
    const clean: string[] = [];
    const dirty: string[] = [];
    for (const [i, t] of c.tokens.entries()) {
      if (!r.test(t)) continue;
      if (errIdx.has(i)) dirty.push(`[${i}]"${t}"`);
      else clean.push(`[${i}]"${t}"`);
    }
    if (!clean.length && !dirty.length) continue;
    n++;
    const refs = grammarLessons.filter((l) => l.huntCaseIds.includes(c.id)).map((l) => `L${l.number}`);
    console.log(`  ${c.id}(#${c.number}) 解锁=L${refs.join(",") || "番外(第12课后)"}  ${clean.length ? `✅正确用法 ${clean.join(" ")}` : "（无正确用法）"}  ${dirty.length ? `❌错误用法 ${dirty.join(" ")}` : ""}`);
  }
  if (!n) console.log("  （全库 0 案）");
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s03-C · said 在库内的**首次出现**（按时序）");
console.log("════════════════════════════════════════════════════════════════");
const rSaid = rx("said");
interface Occ { kind: string; at: number; detail: string; side: string }
const occ: Occ[] = [];
for (const l of grammarLessons) {
  // 课程本体
  if (rSaid.test(l.targetSentence)) occ.push({ kind: "课", at: l.number, detail: `targetSentence = ${JSON.stringify(l.targetSentence)}`, side: "正" });
  for (const [i, c] of (l.contrast ?? []).entries()) {
    if (rSaid.test(c.wrong)) occ.push({ kind: "课", at: l.number, detail: `contrast[${i}].wrong = ${JSON.stringify(c.wrong)}${c.bothRight ? "（bothRight=正确句）" : "（错句）"}`, side: c.bothRight ? "正" : "错" });
    if (rSaid.test(c.correct)) occ.push({ kind: "课", at: l.number, detail: `contrast[${i}].correct`, side: "正" });
  }
  for (const [i, g] of l.guided.entries()) {
    if (rSaid.test(g.answer)) occ.push({ kind: "课", at: l.number, detail: `guided[${i}].answer = ${JSON.stringify(g.answer)}`, side: "正" });
    for (const o of g.options ?? []) if (rSaid.test(o)) occ.push({ kind: "课", at: l.number, detail: `guided[${i}].options 含 ${JSON.stringify(o)}${o === g.answer ? "（=答案）" : "（干扰项）"}`, side: o === g.answer ? "正" : "错" });
  }
  for (const [i, p] of l.practice.entries()) if (rSaid.test(p.answer)) occ.push({ kind: "课", at: l.number, detail: `practice[${i}].answer = ${JSON.stringify(p.answer)}`, side: "正" });
  for (const d of l.dialogue ?? []) if (rSaid.test(d.en)) occ.push({ kind: "课", at: l.number, detail: `dialogue(${d.who}) = ${JSON.stringify(d.en)}`, side: "正" });
  for (const e of l.examples) if (rSaid.test(e.en)) occ.push({ kind: "课", at: l.number, detail: `examples = ${JSON.stringify(e.en)}`, side: "正" });
}
for (const c of huntCases) {
  const errIdx = new Set(c.errors.map((e) => e.tokenIndex));
  for (const [i, t] of c.tokens.entries()) if (rSaid.test(t) && !errIdx.has(i)) occ.push({ kind: "案", at: c.number, detail: `${c.id} tokens[${i}] = ${JSON.stringify(t)}（正确用法）`, side: "正" });
  for (const e of c.errors) if (rSaid.test(e.correction)) occ.push({ kind: "案", at: c.number, detail: `${c.id} 更正结果 = ${JSON.stringify(e.correction)}（用户被要求找出的错处）`, side: "正" });
  for (const e of c.errors) if (rSaid.test(e.original)) occ.push({ kind: "案", at: c.number, detail: `${c.id} 错词 = ${JSON.stringify(e.original)}`, side: "错" });
}
// 打印：课序 intermix 用「课号」/「案号」分开排序
console.log("  ── 按 n 排序（课号与案号混排，看整体时序）──");
for (const o of occ.sort((a, b) => a.at - b.at)) {
  console.log(`  [${o.kind}#${String(o.at).padStart(3)}][${o.side}] ${o.detail}`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s03-D · 找错玩法：用户是否需要**答出**正确形式？（读源码，非猜测）");
console.log("════════════════════════════════════════════════════════════════");
console.log(`  hunt-homework-note 的解锁课 = ${JSON.stringify(grammarLessons.filter((l) => l.huntCaseIds.includes("hunt-homework-note")).map((l) => ({ n: l.number, label: l.grammarLabel, title: l.title })))}`);
console.log(`  hunt-weekend-note  的解锁课 = ${JSON.stringify(grammarLessons.filter((l) => l.huntCaseIds.includes("hunt-weekend-note")).map((l) => ({ n: l.number, label: l.grammarLabel, title: l.title })))}`);
console.log(`  hunt-team-message  的解锁课 = ${JSON.stringify(grammarLessons.filter((l) => l.huntCaseIds.includes("hunt-team-message")).map((l) => ({ n: l.number, label: l.grammarLabel, title: l.title })))}`);
console.log("\n  s03-D2 · 案件是否进「错词本」——`pickCorrectionWord(correction)` 会把改正词收进错词本：");
console.log("    hunt-homework-note errors[].correction 逐个过 pickCorrectionWord 的等价逻辑：");
for (const c of huntCases.filter((x) => ["hunt-homework-note", "hunt-team-message", "hunt-weekend-note"].includes(x.id))) {
  for (const e of c.errors) {
    const NON_CONTENT = new Set(["a", "an", "the", "is", "are", "to"]);
    const t = e.correction.trim();
    let picked = "";
    if (!t || t.startsWith("去掉")) picked = "";
    else if (t.startsWith("（") && t.endsWith("）")) picked = "";
    else { const w = t.split(/\s+/).filter(Boolean).find((x) => !NON_CONTENT.has(x)); picked = w ? w.replace(/[.,!?;:]+$/, "") : ""; }
    console.log(`      ${c.id}  ${JSON.stringify(e.original)} → ${JSON.stringify(e.correction)}   ⇒ 错词本收录 = ${JSON.stringify(picked)}${picked === "said" ? "   ⚠️ 收进错词本" : ""}`);
  }
}
