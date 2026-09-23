/**
 * s04c：正确做法——**先把整页 HTML 转成纯文本**，再在纯文本里做字符定位与摘取。
 * （s04/s04b 直接在 HTML 上 indexOf 会被内联标签/实体打断，因此漏检。）
 */
import { writeFileSync } from "node:fs";
import { readFileSync } from "node:fs";

function htmlToText(html: string): string {
  // 块级标签转成换行，保住段落边界
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h1|h2|h3|h4|td|tr|blockquote|section)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;|&lsquo;|&apos;|&#x27;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;|&#34;/g, '"')
    .replace(/&pound;/g, "£")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&hellip;/g, "…")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .join("\n");
}

const raw = readFileSync("/tmp/cambridge-say-tell.html", "utf8");
const text = htmlToText(raw);
writeFileSync("/tmp/cambridge-say-tell.txt", text);

console.log("════════════════════════════════════════════════════════════════");
console.log("s04c · Cambridge《Say or tell》纯文本逐字摘取");
console.log("URL  : https://dictionary.cambridge.org/grammar/british-grammar/say-or-tell");
console.log("curl : HTTP=200，HTML 450,391 字节 → 纯文本", text.length, "字符");
console.log("抓取日期：2026-09-22");
console.log("════════════════════════════════════════════════════════════════");

function show(needle: string, label: string, before = 0, after = 700) {
  const i = text.indexOf(needle);
  if (i === -1) { console.log(`\n⚠️ [${label}] 纯文本里也未找到：${JSON.stringify(needle)}`); return; }
  const seg = text.slice(Math.max(0, i - before), Math.min(text.length, i + after)).replace(/\n+/g, " ⏎ ");
  console.log(`\n✅ [${label}]`);
  console.log(`   ${seg}`);
}

console.log("\n【逐字 1 · 首句：不规则 + 过去式】");
show("Say and tell are irregular verbs", "首句", 0, 380);
console.log("\n【逐字 2 · say 聚焦「说的话」/ tell 聚焦内容】");
show("focuses on the words someone said", "聚焦", 120, 420);
console.log("\n【逐字 3 · 直接引语用 say】");
show("direct speech", "直接引语", 200, 380);
console.log("\n【逐字 4 · say + to + 人（L38 新卡的正源）】");
show("Does not take an indirect object", "say 不带间接宾语", 60, 420);
console.log("\n【逐字 5 · Typical errors：he said to me / Not: he said me】");
show("We don’t use an indirect object with say", "Typical errors", 0, 480);
console.log("\n【逐字 6 · tell 的间接宾语结构】");
show("Tell normally takes an indirect object", "tell", 0, 360);
console.log("\n【逐字 7 · said to me 例句】");
show("said to me", "said to me", 300, 260);
console.log("\n【逐字 8 · 本页对 says 的覆盖】");
const nSays = (text.match(/says/g) ?? []).length;
console.log(`   "says" 在纯文本中出现 ${nSays} 次`);
if (nSays) { const i = text.indexOf("says"); console.log("   首处：…" + text.slice(Math.max(0, i - 300), i + 300).replace(/\n+/g, " ⏎ ") + "…"); }
console.log("\n【逐字 9 · CEFR 等级是否出现在正文】");
for (const lvl of ["A1", "A2", "B1", "B2", "Beginner", "Elementary", "Intermediate"]) {
  const n = (text.match(new RegExp(`\\b${lvl}\\b`, "g")) ?? []).length;
  console.log(`   ${lvl}: ${n} 次`);
}
console.log("\n【逐字 10 · 目录小标题（页面结构）】");
const heads = text.split("\n").filter((l) => l.length < 45 && /^(Say|Tell|Typical|See also|More|Reported|Direct|Indirect)/i.test(l));
console.log("   " + heads.slice(0, 20).join("  |  "));

console.log("\n\n【says 的权威出处转向：Cambridge 词典 says 条目】");
console.log("   （下一支脚本 s05 用 curl 抓 /dictionary/english/says）");
