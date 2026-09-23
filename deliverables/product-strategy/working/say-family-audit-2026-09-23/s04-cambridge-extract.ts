/**
 * s04：从 curl 下来的 Cambridge 页面 HTML 里提取逐字原文（避免 WebFetch 的转述误差）
 */
import { readFileSync } from "node:fs";

const html = readFileSync("/tmp/cambridge-say-tell.html", "utf8");
// 去 script/style，再剥标签
const body = html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, "\n")
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
  .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
  .replace(/&pound;/g, "£")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .split("\n")
  .map((s) => s.replace(/\s+/g, " ").trim())
  .filter(Boolean);

const text = body.join("\n");
const lines = body;

function grep(label: string, needles: string[]) {
  console.log(`\n── ${label} ──`);
  for (const n of needles) {
    let found = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(n.toLowerCase())) {
        const ctx = lines.slice(Math.max(0, i - 2), i + 4).join(" ‖ ");
        console.log(`  ✅ "${n}"`);
        console.log(`     上下文：${ctx.slice(0, 420)}`);
        found = true;
        break;
      }
    }
    if (!found) console.log(`  ⚠️ 未找到："${n}"`);
  }
}

console.log("════════════════════════════════════════════════════════════════");
console.log("s04 · Cambridge 《Say or tell》逐字摘取（源：curl 200 的 HTML）");
console.log("URL: https://dictionary.cambridge.org/grammar/british-grammar/say-or-tell");
console.log("HTML 字节 =", html.length);
console.log("════════════════════════════════════════════════════════════════");

grep("① 不规则 + 过去式", [
  "The past simple of say is said",
  "past simple of say is said",
]);
grep("② say 不带间接宾语 / 用 to", [
  "Say does not take an indirect object",
  "say does not take an indirect object",
  "we use a phrase with to",
]);
grep("③ Typical errors：he said to me", [
  "he said to me",
  "Not: … he said me",
  "he said me",
]);
grep("④ say 后面直接跟从句/直接引语", [
  "We use say with direct speech",
  "say with direct speech",
]);
grep("⑤ say 聚焦「说的话」", [
  "Say focuses on the words someone said",
]);
grep("⑥ tell 间接宾语", ["indirect object"]);

console.log("\n── 【全文关键段落】含 said / say 的正文行（前 60 行）──");
let c = 0;
for (const l of lines) {
  if (/\b(said|say|says)\b/i.test(l) && l.length > 20 && !/cookie|advert|Cambridge Dictionary|©|Sign up|More meanings|Browse|Word of the Day|Dictionaries|Translations|Follow us|Free word lists/i.test(l)) {
    console.log(`  ${l.slice(0, 300)}`);
    if (++c >= 60) break;
  }
}

console.log("\n\n── 【页面标题与小标题结构】──");
for (const l of lines.slice(0, 400)) {
  if (/^(Say|Tell|Typical errors|say +|tell +)/.test(l) && l.length < 90) console.log(`  ${l}`);
}
