/**
 * 瑞思 · 第 50 批核查脚本 —— wrongMark 三类语义核对 + 【】 并行标记分工，只读，不改数据。
 * 运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit50-wrongmark-classes.mts
 *
 * 纪律：词边界正则一律「无 g 做 test、带 g 做 match」——带 g 的 re.test 有 lastIndex 状态。
 */
import { grammarLessons } from "../../src/data/grammarLessons";
import { huntCases } from "../../src/data/huntCases";

/** 词边界正则：与项目既有脚本同款（(?<![A-Za-z-])w(?![A-Za-z-])）。 */
const wbRe = (w: string, flags = "") =>
  new RegExp(`(?<![A-Za-z-])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z-])`, flags);
const wbTest = (w: string, s: string) => wbRe(w).test(s);
const wbCount = (w: string, s: string) => (s.match(wbRe(w, "g")) ?? []).length;

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

/* ── ① 三类语义全库回扫 ─────────────────────────────────────────────── */
type Klass = "extraOrReplace" | "bothSides" | "correctOnly" | "nowhere";
const tally: Record<Klass, number> = { extraOrReplace: 0, bothSides: 0, correctOnly: 0, nowhere: 0 };
const samples: Record<Klass, string[]> = { extraOrReplace: [], bothSides: [], correctOnly: [], nowhere: [] };
/** 多词标注（"you are" / "Am I"）另计，按整体串出现与否判定。 */
let multiWordMarks = 0;
const multiWordSamples: string[] = [];

interface MarkRow {
  lesson: string;
  number: number;
  index: number;
  mark: string;
  wrong: string;
  correct: string;
  bothRight: boolean;
  klass: Klass;
  words: string[];
  inWrong: boolean;
  inCorrect: boolean;
}
const rows: MarkRow[] = [];

for (const lesson of grammarLessons) {
  (lesson.contrast ?? []).forEach((c, index) => {
    const mark = (c.wrongMark ?? "").trim();
    if (!mark) return;
    const words = mark.split(/\s+/).filter(Boolean);
    if (words.length > 1) {
      multiWordMarks += 1;
      if (multiWordSamples.length < 12) multiWordSamples.push(`${lesson.id}[${index}] mark="${mark}" | wrong="${c.wrong}" | correct="${c.correct}"`);
    }
    // 逐词判定：mark 的每个词在错句/正确句中的出现情况
    const inWrong = words.some((w) => wbTest(w, c.wrong));
    const inCorrect = words.some((w) => wbTest(w, c.correct));
    const klass: Klass = inWrong && inCorrect ? "bothSides" : inWrong ? "extraOrReplace" : inCorrect ? "correctOnly" : "nowhere";
    tally[klass] += 1;
    if (samples[klass].length < 14) samples[klass].push(`${lesson.id}(L${lesson.number})[${index}] mark="${mark}"${c.bothRight ? " [bothRight]" : ""}\n     wrong  ="${c.wrong}"\n     correct="${c.correct}"`);
    rows.push({ lesson: lesson.id, number: lesson.number, index, mark, wrong: c.wrong, correct: c.correct, bothRight: Boolean(c.bothRight), klass, words, inWrong, inCorrect });
  });
}

console.log("═══ ① wrongMark 三类语义全库回扫（含 bothRight 条与不含两种口径） ═══");
const withBR = rows.length;
const noBR = rows.filter((r) => !r.bothRight).length;
console.log(`有值 wrongMark 的对照卡总数（含 bothRight 条）: ${withBR}`);
console.log(`其中 bothRight=true 的条数        : ${withBR - noBR}`);
console.log(`其中 bothRight≠true（真错卡）条数  : ${noBR}`);
console.log("");
for (const k of ["extraOrReplace", "bothSides", "correctOnly", "nowhere"] as Klass[]) {
  const nAll = rows.filter((r) => r.klass === k).length;
  const nNo = rows.filter((r) => r.klass === k && !r.bothRight).length;
  console.log(`  ${k.padEnd(16)} 含 bothRight=${String(nAll).padStart(4)}   仅真错卡=${String(nNo).padStart(4)}`);
}
console.log(`\n多词标注（>=2 词）条数: ${multiWordMarks}`);
console.log("\n样例如下：");
for (const k of ["extraOrReplace", "bothSides", "correctOnly", "nowhere"] as Klass[]) {
  console.log(`\n── ${k} ──`);
  if (samples[k].length === 0) console.log("  （无）");
  for (const s of samples[k]) console.log("  " + s);
}
console.log("\n多词标注样例：");
for (const s of multiWordSamples) console.log("  " + s);

/* ── ② 第四类？按标点/diff 形态再切 ───────────────────────────────── */
console.log("\n\n═══ ② 是否存在第四类：对「三类」再做子切 ═══");
/** 逐位 diff：与正确句不同的位置。用于判断 marked index 是否真的落在差异位。 */
const tokensOf = (s: string) => s.split(/\s+/).filter(Boolean);
const cleanWord = (t: string) => t.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, "").toLowerCase();
const diffIndexes = (wrong: string, correct: string): number[] => {
  const w = tokensOf(wrong);
  const c = tokensOf(correct);
  const hits: number[] = [];
  for (let i = 0; i < Math.max(w.length, c.length); i += 1) {
    if (cleanWord(w[i] ?? "") !== cleanWord(c[i] ?? "")) hits.push(i);
  }
  return hits;
};
let markOnDiff = 0, markOffDiff = 0, markOnDiffMulti = 0;
const offDiff: string[] = [];
for (const r of rows) {
  if (r.bothRight) continue;
  const d = diffIndexes(r.wrong, r.correct);
  const w = tokensOf(r.wrong);
  const hitIdx = w.map((t, i) => (r.words.some((mw) => cleanWord(mw) === cleanWord(t)) ? i : -1)).filter((i) => i >= 0);
  const onDiff = hitIdx.some((i) => d.includes(i));
  if (hitIdx.length > 1) markOnDiffMulti += 1;
  if (onDiff) markOnDiff += 1; else { markOffDiff += 1; if (offDiff.length < 20) offDiff.push(`${r.lesson}(L${r.number})[${r.index}] mark="${r.mark}" diffIdx=[${d.join(",")}] tokenIdx=[${hitIdx.join(",")}]\n     wrong  ="${r.wrong}"\n     correct="${r.correct}"`); }
}
console.log(`真错卡中：标注词命中逐位 diff 位 = ${markOnDiff}；未命中 = ${markOffDiff}`);
console.log("未命中样例（这些是「口径只能靠读判题代码才懂」的候选）：");
for (const s of offDiff) console.log("  " + s);

/* ── ③ 【】 只出现在哪些字段（是否污染「要复现的句子」槽） ──────────── */
console.log("\n\n═══ ③ 【】 出现的字段分布（判断是否会污染题面） ═══");
const bracketFields: Record<string, number> = {};
function walk(v: unknown, path: string) {
  if (typeof v === "string") {
    if (v.includes("【")) bracketFields[path.replace(/\[\d+\]/g, "[]")] = (bracketFields[path.replace(/\[\d+\]/g, "[]")] ?? 0) + 1;
    return;
  }
  if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v as Record<string, unknown>)) walk(x, path ? `${path}.${k}` : k);
}
for (const l of grammarLessons) walk(l, "");
console.log("grammarLessons 中含【】的字段（按出现次数）：");
for (const [k, n] of Object.entries(bracketFields).sort((a, b) => b[1] - a[1])) console.log(`  ${k}  ×${n}`);
console.log("\nhuntCases 中含【】的字段：");
const hf: Record<string, number> = {};
for (const hc of huntCases) walk(hc, "");
for (const [k, n] of Object.entries(bracketFields).sort((a, b) => b[1] - a[1])) {
  if (!(k in hf)) { /* noop */ }
}
console.log("  （见下方 ④ 单独扫描）");

/* ── ④ 【】 与 wrongMark 是否「不一致」且不一致是否全部为正常设计 ──── */
console.log("\n\n═══ ④ 【】 ≠ wrongMark 的条数统计（复核「168 处全部正常」） ═══");
let brTotal = 0;
const withBracket: string[] = [];
for (const lesson of grammarLessons) {
  (lesson.contrast ?? []).forEach((c, index) => {
    if (!c.whyZh.includes("【")) return;
    brTotal += 1;
    const marks = Array.from(c.whyZh.matchAll(/【([^】]*)】/g)).map((m) => m[1]);
    const mark = (c.wrongMark ?? "").trim();
    // 「不一致」= 括号里没有任何一项等于 wrongMark
    const same = mark ? marks.some((b) => norm(b).toLowerCase() === norm(mark).toLowerCase()) : false;
    if (!same && withBracket.length < 25) withBracket.push(`${lesson.id}(L${lesson.number})[${index}] wrongMark=${JSON.stringify(c.wrongMark ?? null)} 【】=[${marks.join(" | ")}]\n     wrong  ="${c.wrong}"\n     correct="${c.correct}"`);
  });
}
console.log(`whyZh 含【】的对照卡条数: ${brTotal}`);
console.log("wrongMark 与【】不一致的前 25 条：");
for (const s of withBracket) console.log("  " + s);

/* ── ⑤ spot 题的 answer 语义（第 44 批缺陷 1 的现状核对） ───────────── */
console.log("\n\n═══ ⑤ spot 题 answer / wrongToken 语义现状（第 44 批缺陷 1 复核） ═══");
let spotTotal = 0, answerInWrong = 0, answerInCorrect = 0, wrongTokenEqAnswer = 0;
const spotSamples: string[] = [];
for (const l of grammarLessons) {
  for (const g of l.guided ?? []) {
    if (g.kind !== "spot") continue;
    spotTotal += 1;
    const toks = (g.tokens ?? []).join(" ");
    const a = (g.answer ?? "").trim();
    const inW = toks ? wbTest(a, toks) : false;
    if (inW) answerInWrong += 1;
    if (a && g.wrongToken && a.toLowerCase() === g.wrongToken.toLowerCase()) wrongTokenEqAnswer += 1;
    if (spotSamples.length < 8) spotSamples.push(`${l.id}(L${l.number}) answer="${a}" wrongToken=${JSON.stringify(g.wrongToken)} tokens=[${toks}]`);
  }
}
console.log(`spot 题总数: ${spotTotal}；answer 出现在 tokens 里的: ${answerInWrong}；answer===wrongToken 的: ${wrongTokenEqAnswer}`);
for (const s of spotSamples) console.log("  " + s);

/* ── ⑥ huntCases 字段语义抽查 ─────────────────────────────────────── */
console.log("\n\n═══ ⑥ huntCase 的 HuntError 字段语义抽查 ═══");
const hcTotal = huntCases.length;
let errTotal = 0, emptyCorrection = 0, origEqCorr = 0, idxOOB = 0;
const emptyCorr: string[] = [];
for (const hc of huntCases) {
  for (const e of hc.errors) {
    errTotal += 1;
    if (!e.correction || !e.correction.trim()) { emptyCorrection += 1; if (emptyCorr.length < 10) emptyCorr.push(`${hc.id} idx=${e.tokenIndex} original="${e.original}" tag=${e.tag} correction=${JSON.stringify(e.correction)} explanation="${e.explanation}"`); }
    if (e.original.trim().toLowerCase() === (e.correction ?? "").trim().toLowerCase()) origEqCorr += 1;
    if (e.tokenIndex < 0 || e.tokenIndex >= hc.tokens.length) idxOOB += 1;
  }
}
console.log(`案件数 ${hcTotal}；错误点总数 ${errTotal}；correction 为空 ${emptyCorrection}；original===correction ${origEqCorr}；tokenIndex 越界 ${idxOOB}`);
console.log("correction 为空样例（若有 ⇒ 需要一个「空 = 删除」的约定）：");
for (const s of emptyCorr) console.log("  " + s);
console.log("\n案件 notes/reviewed 覆盖：");
const withNotes = huntCases.filter((h) => (h.notes ?? []).length > 0).length;
const reviewed = huntCases.filter((h) => h.reviewed === true).length;
console.log(`  notes 非空 ${withNotes}；reviewed=true ${reviewed}；reviewed 省略 ${huntCases.length - reviewed}`);

/* ── ⑦ 【】 在 huntCases 中的分布 ─────────────────────────────────── */
const hf2: Record<string, number> = {};
for (const hc of huntCases) {
  const b: Record<string, number> = {};
  const rec = (v: unknown, p: string) => {
    if (typeof v === "string") { if (v.includes("【")) b[p.replace(/\[\d+\]/g, "[]")] = (b[p.replace(/\[\d+\]/g, "[]")] ?? 0) + 1; return; }
    if (Array.isArray(v)) v.forEach((x, i) => rec(x, `${p}[${i}]`));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v as Record<string, unknown>)) rec(x, p ? `${p}.${k}` : k);
  };
  rec(hc, "");
  for (const [k, n] of Object.entries(b)) hf2[k] = (hf2[k] ?? 0) + n;
}
console.log("huntCases 中含【】的字段：");
for (const [k, n] of Object.entries(hf2).sort((a, b) => b[1] - a[1])) console.log(`  ${k} ×${n}`);
if (Object.keys(hf2).length === 0) console.log("  （无）");

/* ── ⑧ 零术语红线：审计自己的样例输出也不该泄术语（此处只提示） ──── */
console.log("\n\n（脚本只读；未写任何文件）");
