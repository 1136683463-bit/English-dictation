/**
 * s05：从 curl 下来的词典页 HTML 抽逐字原文
 *   - Cambridge /dictionary/english/say  (HTTP 200)
 *   - Cambridge /dictionary/english/said (HTTP 200)
 *   - Oxford    /definition/english/say_1 (HTTP 200)
 *   - British Council irregular-verbs     (HTTP 000 —— 记录「抓不到」)
 */
import { readFileSync, existsSync } from "node:fs";

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h1|h2|h3|h4|td|tr|th|blockquote|section|span)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;|&lsquo;|&apos;|&#x27;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;|&#34;/g, '"')
    .replace(/&pound;/g, "£")
    .replace(/&hellip;/g, "…")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/[ \t]+/g, " ")
    .split("\n").map((s) => s.trim()).filter(Boolean).join("\n");
}

function report(file: string, label: string, url: string) {
  console.log("\n" + "═".repeat(72));
  console.log(`${label}`);
  console.log(`URL: ${url}`);
  if (!existsSync(file)) { console.log("⚠️ 文件不存在（抓不到）"); return null; }
  const raw = readFileSync(file, "utf8");
  if (raw.length < 2000) { console.log(`⚠️ 文件仅 ${raw.length} 字节，疑似被拒（抓不到）`); return null; }
  const text = htmlToText(raw);
  console.log(`HTML ${raw.length} 字节 → 纯文本 ${text.length} 字符`);
  return text;
}

function find(text: string, needle: string, label: string, before = 0, after = 600, required = true) {
  const i = text.indexOf(needle);
  if (i === -1) {
    if (required) console.log(`\n  ⚠️ [${label}] 未找到：${JSON.stringify(needle)}`);
    return false;
  }
  console.log(`\n  ✅ [${label}]`);
  console.log(`     ${text.slice(Math.max(0, i - before), Math.min(text.length, i + after)).replace(/\n+/g, " ⏎ ")}`);
  return true;
}

// ── Cambridge: say ──────────────────────────────────────────
const camSay = report("/tmp/cam-say.html", "Cambridge Dictionary · say", "https://dictionary.cambridge.org/dictionary/english/say");
if (camSay) {
  console.log("\n  ── 关键片段 ──");
  for (const n of ["A1", "A2", "B1", "B2", "said | said", "says", "say something to somebody", "said to", "irregular"]) {
    const c = (camSay.match(new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length;
    console.log(`     "${n}"：${c} 次`);
  }
  find(camSay, "A1", "A1 等级标注", 200, 300, false);
  find(camSay, "say something to somebody", "⭐ say something to somebody 句型", 220, 380, false);
  find(camSay, "said", "过去式", 260, 300, false);
  find(camSay, "Be quiet, I have something to say", "首例句", 120, 260, false);
}

// ── Cambridge: said ─────────────────────────────────────────
const camSaid = report("/tmp/cam-said.html", "Cambridge Dictionary · said", "https://dictionary.cambridge.org/dictionary/english/said");
if (camSaid) {
  console.log("\n  ── 关键片段 ──");
  find(camSaid, "said", "词条开头", 100, 500, false);
}

// ── Oxford: say ─────────────────────────────────────────────
const oxSay = report("/tmp/ox-say.html", "Oxford Learner's Dictionaries · say", "https://www.oxfordlearnersdictionaries.com/definition/english/say_1");
if (oxSay) {
  console.log("\n  ── 关键片段 ──");
  for (const n of ["A1", "A2", "B1", "B2", "say something to somebody", "said", "says", "past simple"]) {
    const c = (oxSay.match(new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length;
    console.log(`     "${n}"：${c} 次`);
  }
  find(oxSay, "say something to somebody", "⭐ say something to somebody 句型", 260, 400, false);
  find(oxSay, "past simple", "过去式", 260, 300, false);
  find(oxSay, "She said nothing to me about it", "带 to 的例句", 160, 240, false);
  find(oxSay, "He said (that) his name was Sam", "say that 例句", 160, 240, false);
  find(oxSay, "A1", "A1 标注", 240, 260, false);
}

// ── British Council ─────────────────────────────────────────
report("/tmp/bc-irregular.html", "British Council · irregular verbs", "https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/irregular-verbs");
console.log("\n  ⇒ 本机 curl 得 HTTP=000（连接被拒）——**抓不到**。");
console.log("     但同一 URL 经 WebFetch（服务端代取）可读，见 s06 记录。");
