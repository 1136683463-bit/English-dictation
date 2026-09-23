/**
 * 第 49 批 · s02：关键课的结构 + 不规则昨天版家族（L197-L204 + 更早）全景
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";

console.log("════════════════════════════════════════════════════════════════");
console.log("s02-A · 含 say 家族命中的课，逐课结构");
console.log("════════════════════════════════════════════════════════════════");
for (const n of [7, 38, 41, 105, 136, 137, 138, 140, 181]) {
  const l = grammarLessons.find((x) => x.number === n)!;
  console.log(`\n── L${l.number} ${l.id}`);
  console.log(`   grammarLabel : ${l.grammarLabel}`);
  console.log(`   scene        : ${l.scene}`);
  console.log(`   target       : ${JSON.stringify(l.targetSentence)}（${l.targetSentence.replace(/[.!?]$/, "").split(/\s+/).length} 词）`);
  console.log(`   对照卡       : ${l.contrast?.length ?? 0} 张（bothRight ${(l.contrast ?? []).filter((c) => c.bothRight).length}）`);
  console.log(`   guided       : ${l.guided.length} 题；practice ${l.practice.length} 题；recall ${l.recall ? "有" : "无"}`);
  console.log(`   huntCaseIds  : ${JSON.stringify(l.huntCaseIds)}`);
  console.log(`   variants     : ${(l.variants ?? []).map((v) => `${v.label}=${JSON.stringify(v.en)}`).join(" ; ")}`);
  if (l.contrast?.length) {
    console.log("   对照卡逐张：");
    for (const [i, c] of l.contrast.entries()) {
      const tag = c.bothRight ? "双正解" : c.wrongMark ? `错(${c.wrongMark})` : "错(整句)";
      console.log(`     [${i}] ${tag.padEnd(12)} wrong=${JSON.stringify(c.wrong)}  correct=${JSON.stringify(c.correct)}`);
    }
  }
  console.log("   guided 答案：");
  for (const [i, g] of l.guided.entries()) console.log(`     [${i}] ${g.kind.padEnd(8)} answer=${JSON.stringify(g.answer)}  options=${JSON.stringify(g.options ?? [])}`);
  console.log("   practice 答案：");
  for (const [i, p] of l.practice.entries()) console.log(`     [${i}] answer=${JSON.stringify(p.answer)}  distr=${JSON.stringify(p.distractors ?? [])}`);
  if (l.recall) console.log(`   recall       : ${JSON.stringify(l.recall.answer)}`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s02-B · 全库「昨天版」课族全景（grammarLabel 含 昨天版 / 过去 / 不规则）");
console.log("════════════════════════════════════════════════════════════════");
const PAST_RX = /昨天版|过去|不规则|那个词换|变了样/;
for (const l of grammarLessons) {
  if (PAST_RX.test(l.grammarLabel) || PAST_RX.test(l.title)) {
    console.log(`  L${String(l.number).padStart(3)} ${l.grammarLabel.padEnd(34)} | ${l.title.padEnd(18)} | target=${JSON.stringify(l.targetSentence.slice(0, 70))} | 卡${l.contrast?.length ?? 0}`);
  }
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s02-C · L182-L204（season-28）逐课教学点");
console.log("════════════════════════════════════════════════════════════════");
for (const l of grammarLessons.filter((x) => x.number >= 182 && x.number <= 204)) {
  const words = l.targetSentence.replace(/[.!?]$/, "").split(/\s+/).length;
  console.log(`  L${l.number} [${words}词] ${l.grammarLabel.padEnd(40)} ${JSON.stringify(l.targetSentence)}`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s02-D · 任务书点名的 12 个不规则昨天版，逐词全库正/错侧");
console.log("  口径 V3（node 词边界正则；正侧排除 spot.answer 与 bothRight.wrong）");
console.log("════════════════════════════════════════════════════════════════");
const FORM_PAIRS: [string, string, string][] = [
  ["think", "thought", "想"],
  ["know", "knew", "知道"],
  ["swim", "swam", "游泳"],
  ["sing", "sang", "唱歌"],
  ["sit", "sat", "坐"],
  ["catch", "caught", "抓/赶"],
  ["feel", "felt", "感觉"],
  ["keep", "kept", "保持"],
  ["sleep", "slept", "睡"],
  ["draw", "drew", "画"],
  ["wear", "wore", "穿戴"],
  ["give", "gave", "给"],
  ["say", "said", "说"],
];
function rx(f: string) {
  return new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i");
}
function counts(form: string) {
  let pos = 0, neg = 0, cme = 0, posLessons = new Set<number>(), negLessons = new Set<number>();
  const r = rx(form);
  for (const l of grammarLessons) {
    let lp = 0, ln = 0;
    const pos1 = (t?: string | null) => { if (t && r.test(t)) { pos++; lp++; } };
    const neg1 = (t?: string | null) => { if (t && r.test(t)) { neg++; ln++; } };
    pos1(l.targetSentence); pos1(l.dialogueEn);
    for (const d of l.dialogue ?? []) d.who === "me" ? (pos1(d.en), cme++) : pos1(d.en);
    for (const e of l.examples) pos1(e.en);
    for (const v of l.variants ?? []) pos1(v.en);
    for (const s of l.sceneSwings ?? []) pos1(s.en);
    for (const b of l.blocks) pos1(b.text);
    for (const c of l.contrast ?? []) { pos1(c.correct); c.bothRight ? pos1(c.wrong) : neg1(c.wrong); }
    for (const g of l.guided) {
      if (g.kind !== "spot") { pos1(g.answer); pos1(g.replaceBase); pos1((g.tokens ?? []).join(" ")); for (const o of g.options ?? []) o === g.answer ? pos1(o) : neg1(o); }
      else neg1((g.tokens ?? []).join(" "));
    }
    for (const p of l.practice) { pos1(p.answer); for (const d of p.distractors ?? []) neg1(d); }
    pos1(l.recall?.answer);
    if (lp) posLessons.add(l.number);
    if (ln) negLessons.add(l.number);
  }
  return { pos, neg, posLessons: [...posLessons], negLessons: [...negLessons] };
}
console.log("  base".padEnd(10) + "base正".padStart(7) + "base错".padStart(7) + "base正/错落课".padStart(24) + " | " + "过去".padEnd(10) + "过去正".padStart(7) + "过去错".padStart(7) + "过去正/错落课".padStart(24));
for (const [b, p] of FORM_PAIRS) {
  const cb = counts(b);
  const cp = counts(p);
  console.log(
    `  ${b.padEnd(8)}${String(cb.pos).padStart(7)}${String(cb.neg).padStart(7)}${("  " + cb.posLessons.slice(0, 5).join(",")).padEnd(24)} | ` +
      `${p.padEnd(8)}${String(cp.pos).padStart(7)}${String(cp.neg).padStart(7)}${("  " + cp.posLessons.slice(0, 5).join(",")).padEnd(24)}`,
  );
}
console.log("\n  注：say 一行的过去列 = said（本批主角）；think/know/… 为 L197-L204 家族");
console.log("\n  全库 say 家族形态覆盖（正侧落课）：");
for (const f of ["say", "says", "said", "saying"]) console.log(`    ${f.padEnd(8)} 正 ${counts(f).pos} 处，落课 ${JSON.stringify(counts(f).posLessons)}`);

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s02-E · 全库不规则昨天版：哪些有专属课、哪些只在错侧");
console.log("════════════════════════════════════════════════════════════════");
const IRREG: [string, string][] = [
  ["go", "went"], ["have", "had"], ["do", "did"], ["be", "was"], ["be", "were"],
  ["eat", "ate"], ["see", "saw"], ["make", "made"], ["take", "took"], ["come", "came"],
  ["get", "got"], ["run", "ran"], ["write", "wrote"], ["read", "read"],
  ["think", "thought"], ["know", "knew"], ["swim", "swam"], ["sing", "sang"], ["sit", "sat"],
  ["catch", "caught"], ["feel", "felt"], ["keep", "kept"], ["sleep", "slept"], ["draw", "drew"],
  ["wear", "wore"], ["give", "gave"], ["say", "said"], ["tell", "told"], ["buy", "bought"],
  ["bring", "brought"], ["teach", "taught"], ["find", "found"], ["leave", "left"], ["meet", "met"],
  ["send", "sent"], ["spend", "spent"], ["win", "won"], ["lose", "lost"], ["put", "put"], ["cut", "cut"],
];
console.log("  过去形".padEnd(12) + "正".padStart(5) + "错".padStart(5) + "  正侧落课（前 12）");
for (const [b, p] of IRREG) {
  const c = counts(p);
  const flag = c.pos === 0 ? "  ← 正侧 0" : "";
  console.log(`  ${(b + " → " + p).padEnd(11)}${String(c.pos).padStart(5)}${String(c.neg).padStart(5)}   [${c.posLessons.slice(0, 12).join(",")}]${flag}`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s02-F · 找错案件：say 家族相关案全文");
console.log("════════════════════════════════════════════════════════════════");
const ids = ["hunt-homework-note", "hunt-team-message", "hunt-weekend-note", "hunt-swim-day", "hunt-question-words", "hunt-are-you-looking-forward", "hunt-frequency-habit"];
for (const id of ids) {
  const c = huntCases.find((x) => x.id === id);
  if (!c) { console.log(`\n  ⚠️ ${id} 不存在`); continue; }
  console.log(`\n── ${c.id} (#${c.number}) 《${c.title}》 reviewed=${c.reviewed}`);
  console.log(`   scene : ${c.scene}`);
  console.log(`   tokens: ${JSON.stringify(c.tokens.join(" "))}`);
  for (const e of c.errors) {
    console.log(`   error[${e.tokenIndex}] tag=${e.tag}  ${JSON.stringify(e.original)} → ${JSON.stringify(e.correction)}`);
    console.log(`        ${e.explanation}`);
  }
  const refs = grammarLessons.filter((l) => l.huntCaseIds.includes(c.id)).map((l) => `L${l.number}`);
  console.log(`   被引用  : ${refs.join(", ") || "（无课引用）"}`);
}
// 全局：哪些案被哪些课引用
console.log("\n  全库案件引用统计：");
console.log(`    案件总数 ${huntCases.length}；被引用案数 ${new Set(grammarLessons.flatMap((l) => l.huntCaseIds)).size}`);
const unreferenced = huntCases.filter((c) => !grammarLessons.some((l) => l.huntCaseIds.includes(c.id)));
console.log(`    未被引用 ${unreferenced.length} 案：${unreferenced.map((c) => c.id).join(", ")}`);
