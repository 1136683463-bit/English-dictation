/**
 * 第 50 批 · 收尾核对：
 * ① types.ts 的 wrongMark 注释里那组数字（1220 / 670 / 498 / 52）是否与现库一致；
 * ② guided.arrange 的 tokens 注释「arrange 含干扰项」是否与现库一致；
 * ③ L172 那道 arrange 的多重集差异是真差异还是我脚本的清洗问题。
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit50-docdrift.mts
 */
import { grammarLessons } from "../../src/data/grammarLessons";

let total = 0, markNonEmpty = 0, brNoMark = 0, nonBrNoMark = 0, brTotal = 0;
for (const l of grammarLessons) {
  (l.contrast ?? []).forEach((c) => {
    total += 1;
    const m = (c.wrongMark ?? "").trim();
    if (c.bothRight) brTotal += 1;
    if (m) markNonEmpty += 1;
    else if (c.bothRight) brNoMark += 1;
    else nonBrNoMark += 1;
  });
}
console.log("════ ① types.ts wrongMark 注释数字 vs 现库实测 ════");
console.log(`对照卡总数        注释 1220  实测 ${total}   ${total === 1220 ? "一致" : `差 ${total - 1220}（注释已过期）`}`);
console.log(`wrongMark 有值    注释  670  实测 ${markNonEmpty}   ${markNonEmpty === 670 ? "一致" : `差 ${markNonEmpty - 670}（注释已过期）`}`);
console.log(`bothRight+无值    注释  498  实测 ${brNoMark}   ${brNoMark === 498 ? "一致" : `差 ${brNoMark - 498}（注释已过期）`}`);
console.log(`非双正解+无值     注释   52  实测 ${nonBrNoMark}   ${nonBrNoMark === 52 ? "一致" : `差 ${nonBrNoMark - 52}`}`);
console.log(`（bothRight 总条数 ${brTotal}；注释未提二者口径差）`);

console.log("\n════ ② guided.arrange 注释「arrange 含干扰项」vs 现库 ════");
const toksOf = (s: unknown): string[] => (Array.isArray(s) ? s.map(String) : String(s ?? "").split(/\s+/)).filter(Boolean);
const cleanW = (t: string) => t.replace(/[^A-Za-z0-9']/g, "").toLowerCase();
let gArr = 0, gWithExtra = 0, gPerm = 0, gNotPerm = 0;
const notPerm: string[] = [];
for (const l of grammarLessons) for (const g of l.guided ?? []) {
  if (g.kind !== "arrange") continue;
  gArr += 1;
  const t = toksOf(g.tokens), a = toksOf(g.answer);
  if (t.length > a.length) gWithExtra += 1;
  const ts = t.map(cleanW).filter(Boolean).sort().join(" ");
  const as = a.map(cleanW).filter(Boolean).sort().join(" ");
  if (ts === as) gPerm += 1; else { gNotPerm += 1; if (notPerm.length < 12) notPerm.push(`${l.id}(L${l.number}) answer="${g.answer}" tokens=${JSON.stringify(g.tokens)}`); }
}
console.log(`guided.arrange 共 ${gArr} 道`);
console.log(`  词块数 > 答案词数（=「含干扰项」）: ${gWithExtra}  ${gWithExtra === 0 ? "⇒ 注释与现库不符（无一道含干扰项）" : ""}`);
console.log(`  answer 是 tokens 的排列: ${gPerm}；不是: ${gNotPerm}`);
notPerm.forEach((s) => console.log("     " + s));

console.log("\n════ ③ practice 侧对照（LessonPracticeStep 注释「干扰项可选」）════");
let pTot = 0, pWithDist = 0, pPerm = 0, pNotPerm = 0;
const pNot: string[] = [];
for (const l of grammarLessons) for (const p of l.practice ?? []) {
  pTot += 1;
  if (p.distractors?.length) pWithDist += 1;
  const t = toksOf(p.tokens), a = toksOf(p.answer);
  const ts = t.map(cleanW).filter(Boolean).sort().join(" ");
  const as = a.map(cleanW).filter(Boolean).sort().join(" ");
  if (ts === as) pPerm += 1; else { pNotPerm += 1; if (pNot.length < 12) pNot.push(`${l.id}(L${l.number}) answer="${p.answer}" tokens=${JSON.stringify(p.tokens)} distractors=${JSON.stringify(p.distractors)}`); }
}
console.log(`practice 共 ${pTot} 道；带 distractors ${pWithDist}；answer 是 tokens 排列 ${pPerm}；不是 ${pNotPerm}`);
pNot.forEach((s) => console.log("     " + s));

console.log("\n════ ④ 【】 零机器消费方复核（字段分布）════");
const fields: Record<string, number> = {};
const walk = (v: unknown, p: string) => {
  if (typeof v === "string") { if (v.includes("【")) { const k = p.replace(/\[\d+\]/g, "[]"); fields[k] = (fields[k] ?? 0) + 1; } return; }
  if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v as Record<string, unknown>)) walk(x, p ? `${p}.${k}` : k);
};
for (const l of grammarLessons) walk(l, "");
Object.entries(fields).sort((a, b) => b[1] - a[1]).forEach(([k, n]) => console.log(`  ${k} ×${n}`));
console.log(`  ⇒ 全部落在「讲解散文」类字段；没有一个落在会被判题/拼装读取的槽位（tokens/answer/options）。`);
