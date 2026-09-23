/**
 * s04b：从 Cambridge HTML 里取逐字原文（正确做法——先在原始 HTML 里做字符级
 * 定位，再局部剥标签，避免整页 split("\n") 把同一段的行切开）。
 */
import { readFileSync } from "node:fs";

const html = readFileSync("/tmp/cambridge-say-tell.html", "utf8");

/** 把一段 HTML 片段转成干净文本 */
const clean = (s: string) =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;|&lsquo;|&apos;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&pound;/g, "£")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&hellip;/g, "…")
    .replace(/\s+/g, " ")
    .trim();

/** 在原始 HTML 里找 needle，返回局部剥标签后的窗口 */
function window(needle: string, before = 260, after = 520, label = "") {
  const i = html.indexOf(needle);
  if (i === -1) {
    console.log(`\n⚠️ 未找到 "${needle}"${label ? `（${label}）` : ""}`);
    return;
  }
  const seg = clean(html.slice(Math.max(0, i - before), i + after));
  console.log(`\n✅ "${needle}"${label ? `（${label}）` : ""}`);
  console.log(`   …${seg}…`);
}

console.log("════════════════════════════════════════════════════════════════");
console.log("s04b · Cambridge《Say or tell》逐字原文（curl HTTP=200，450,391 字节）");
console.log("URL: https://dictionary.cambridge.org/grammar/british-grammar/say-or-tell");
console.log("抓取时间：2026-09-22（本机 curl，UA 为桌面 Chrome）");
console.log("════════════════════════════════════════════════════════════════");

console.log("\n【逐字片段 1 · 不规则 + 过去式】");
window("Say and tell are irregular verbs", 60, 420, "首句");

console.log("\n【逐字片段 2 · say 聚焦「说的话】");
window("Say focuses on the words someone said", 120, 420);

console.log("\n【逐字片段 3 · say 与直接引语】");
window("We use say with direct speech", 160, 420);

console.log("\n【逐字片段 4 · 两者都带直接宾语】");
window("take a direct object", 220, 460);

console.log("\n【逐字片段 5 · tell 的间接宾语】");
window("normally takes an indirect object", 120, 420);

console.log("\n【逐字片段 6 · ⭐ say 不带间接宾语、要用 to（与本项目 L38 批四十八新卡直接对应）】");
window("Say does not take an indirect object", 200, 480);

console.log("\n【逐字片段 7 · ⭐ Typical errors：he said to me（not he said me）】");
window("Not: And then she said me", 420, 120, "错例");

console.log("\n【逐字片段 8 · Typical errors 标题段】");
window("Typical errors", 60, 700);

console.log("\n【逐字片段 9 · 带 to 的例子】");
window("she said to me", 200, 260);

console.log("\n【逐字片段 10 · say a lie → tell a lie 的对比】");
window("say a lie", 260, 120);

console.log("\n【逐字片段 11 · say + to-不定式（非正式）】");
window("said to leave it till tomorrow", 360, 160);

console.log("\n【逐字片段 12 · 页内是否有 CEFR 等级标注】");
for (const lvl of ["A1", "A2", "B1", "Beginner", "Elementary", "level"]) {
  const n = (html.match(new RegExp(lvl, "g")) ?? []).length;
  console.log(`  "${lvl}" 出现 ${n} 次`);
}

console.log("\n【逐字片段 13 · 本页是否提到 says（第三人称）】");
const saysIdx = html.indexOf("says");
console.log(saysIdx === -1 ? "  ⚠️ 本页完全未出现 \"says\"" : `  首处上下文：…${clean(html.slice(Math.max(0, saysIdx - 200), saysIdx + 300))}…`);
const count = (html.match(/says/g) ?? []).length;
console.log(`  "says" 出现 ${count} 次`);
