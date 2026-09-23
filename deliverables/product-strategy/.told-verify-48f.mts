/** 竞析 · 第48批 · 脚本 F：comparison 零使用的真因（错标而非无案）+ L17 的配案 */
import { grammarLessons } from "../../src/data/grammarLessons";
import { huntCases } from "../../src/data/huntCases";
const hr = (t: string) => console.log(`\n${"=".repeat(78)}\n${t}\n${"=".repeat(78)}`);

hr("A · L17「比一比」这一课的配案与它引用的案件罪名");
for (const n of [17, 76, 40, 25, 74, 80, 85, 87, 171, 186, 194]) {
  const L = grammarLessons.find((x) => x.number === n);
  if (!L) continue;
  console.log(`\n  ── L${n} 「${L.title}」 ${L.grammarLabel}`);
  console.log(`     主角句：${JSON.stringify(L.targetSentence)}`);
  console.log(`     huntCaseIds=[${L.huntCaseIds.join(", ")}]`);
  for (const id of L.huntCaseIds) {
    const c = huntCases.find((x) => x.id === id);
    if (!c) { console.log(`        ⚠️ ${id} 不存在`); continue; }
    console.log(`        ${id} 「${c.title}」 错点：${c.errors.map((e) => `${e.tag}:${e.original}→${e.correction}`).join(" | ")}`);
  }
}

hr("B · 逐案列出「比较范畴」的错点及其现有 tag（人工判定 vs 现有标注）");
const SUSPECT: Array<{ id: string; want: string }> = [];
const TARGETS = ["hunt-photo-compare", "hunt-superlative-market", "hunt-height-chart", "hunt-enough-bag", "hunt-feel-better", "hunt-full-day", "hunt-most-of-students", "hunt-prefer-tea", "hunt-had-better-go", "hunt-term-review", "hunt-close-27-row"];
for (const id of TARGETS) {
  const c = huntCases.find((x) => x.id === id);
  if (!c) { console.log(`  ⚠️ ${id} 不存在`); continue; }
  console.log(`\n  ── ${id} #${c.number} 「${c.title}」（${c.errors.length} 个错点）`);
  console.log(`     英文：${JSON.stringify(c.tokens.join(" "))}`);
  for (const e of c.errors) {
    const hay = `${e.original} ${e.correction} ${e.explanation}`;
    const looksCompar = /(-er\b|more|most|better|best|than|比较|更…|最…|一样)/.test(hay);
    console.log(`     tokenIndex=${String(e.tokenIndex).padStart(2)} tag=${e.tag.padEnd(13)} ${e.original.padEnd(12)} → ${e.correction.padEnd(14)} ${looksCompar ? "★比较范畴？" : ""}`);
    console.log(`        讲解：${e.explanation}`);
  }
}

hr("C · 罪名归属对照：如果把「比较范畴」的错点改判 comparison，全库分布会变成什么样");
const ALL = ["tense", "sv_agreement", "missing_be", "article", "plural", "preposition", "fragment", "run_on", "word_order", "verb_form", "comparison"];
const now = new Map<string, number>();
for (const c of huntCases) for (const e of c.errors) now.set(e.tag, (now.get(e.tag) ?? 0) + 1);
// 人工判定为「比较」的错点（strict：只算主题就是比较的案子里、错误本身就是比较形态的）
const RECLASSIFY: Array<[string, number, string]> = [
  ["hunt-photo-compare", 0, "hoter → hotter（更热，-er 形状）"],
  ["hunt-photo-compare", 1, "more good → better（good 的『更』）"],
  ["hunt-superlative-market", 0, "most → 去掉 most（most 和 -est 只能一个）"],
  ["hunt-superlative-market", 1, "goodest → best（good 的『最』）"],
  ["hunt-superlative-market", 2, "than → in（『最…』用 in，『更…』才用 than）"],
  ["hunt-height-chart", 0, "taller → tall（as tall as：『一样』家不穿 -er）"],
  ["hunt-height-chart", 1, "than → as（『一样』家不认 than）"],
  ["hunt-enough-bag", 0, "heavy → heavier（-er）"],
  ["hunt-term-review", 2, "best → the best（『最…』前面要 the）"],
];
console.log(`  我人工判定应归 comparison 的错点 ${RECLASSIFY.length} 处：`);
for (const [id, idx, why] of RECLASSIFY) {
  const c = huntCases.find((x) => x.id === id);
  const e = c?.errors[idx];
  if (!e) { console.log(`     ⚠️ ${id}[${idx}] 越界`); continue; }
  console.log(`     ${id}[${idx}] 现 tag=${e.tag.padEnd(13)} ${e.original} → ${e.correction}   ｜ ${why}`);
}
const after = new Map(now);
for (const [id, idx] of RECLASSIFY) {
  const c = huntCases.find((x) => x.id === id);
  const e = c?.errors[idx];
  if (!e) continue;
  after.set(e.tag, (after.get(e.tag) ?? 0) - 1);
  after.set("comparison", (after.get("comparison") ?? 0) + 1);
}
console.log(`\n  tag".padEnd(16)+"改判前→改判后"`);
for (const t of ALL) {
  const a = now.get(t) ?? 0, b = after.get(t) ?? 0;
  console.log(`  ${t.padEnd(16)}${String(a).padStart(5)} → ${String(b).padStart(5)}${b - a ? `   (${b - a > 0 ? "+" : ""}${b - a})` : ""}`);
}

hr("D · 这 9 处改判会碰到哪几课（配课影响面）");
const touched = new Set<string>();
for (const [id] of RECLASSIFY) touched.add(id);
for (const id of touched) {
  const lessons = grammarLessons.filter((L) => L.huntCaseIds.includes(id)).map((L) => `L${L.number}`);
  const c = huntCases.find((x) => x.id === id);
  console.log(`  ${id.padEnd(26)} 被 ${lessons.join(",") || "(无)"} 引用`);
}
console.log(`  ⇒ 若改判，这些课的「本案覆盖罪名」会变：需同时检查课程的 grammarLabel 是否讲比较。`);

hr("E · 断言对比：h1/h2 里已存在的 comparison 相关断言逐字");
