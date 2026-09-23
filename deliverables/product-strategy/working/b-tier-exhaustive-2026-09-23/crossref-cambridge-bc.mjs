/**
 * 交叉参照：Cambridge 554 条 ←→ BC 68 课（带档位）
 *
 * 目的：Cambridge 语法页**不标 CEFR**，256 条结构候选无法直接判档。
 * BC 的 68 课**按 A1-A2 / B1-B2 / C1 分好了档**。
 * ⇒ 凡能在 BC 找到对应课的 Cambridge 条目，**继承 BC 的档位**；
 *    找不到对应的，才是「所有带档位的源都没覆盖」的真盲区。
 *
 * 判据：实词重叠，score >= 2 视为对应（粗筛，用于缩小人工复核范围，不是最终裁定）。
 *
 * 用法（仓库根目录）：node deliverables/.../crossref-cambridge-bc.mjs
 */
import fs from "node:fs";

const HERE = "deliverables/product-strategy/working/b-tier-exhaustive-2026-09-23";
const STOP = new Set(["and", "or", "the", "a", "an", "of", "to", "in", "for", "with", "as", "at", "on", "be", "is", "are", "that", "this", "it", "its", "use", "uses", "using", "used"]);

function words(s) {
  return s.toLowerCase().replace(/[^a-z\s-]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
}

const cambridge = JSON.parse(fs.readFileSync(HERE + "/cambridge-topics.json", "utf8"));
const bc = JSON.parse(fs.readFileSync(HERE + "/bc-lessons.json", "utf8"));
const bcIndex = bc.map((b) => ({ level: b.level, title: b.title, ws: new Set(words(b.title)) }));

const results = cambridge.map((c) => {
  const cw = words(c.label);
  let best = null;
  for (const b of bcIndex) {
    let score = 0;
    for (const w of cw) {
      if (b.ws.has(w)) score += 1;
      else if (w.length >= 5 && [...b.ws].some((x) => x.startsWith(w.slice(0, 5)))) score += 0.5;
    }
    if (!best || score > best.score) best = { level: b.level, title: b.title, score };
  }
  const matched = Boolean(best) && best.score >= 2;
  return {
    slug: c.slug,
    label: c.label,
    inheritedLevel: matched ? best.level : null,
    matchedWith: matched ? best.title : null,
    score: best ? best.score : 0,
  };
});

fs.writeFileSync(HERE + "/crossref-report.json", JSON.stringify(results, null, 1));

const tally = { "A1-A2": 0, "B1-B2": 0, C1: 0, UNMATCHED: 0 };
for (const r of results) tally[r.inheritedLevel === null ? "UNMATCHED" : r.inheritedLevel] += 1;
console.log("Cambridge " + results.length + " x BC level inheritance:");
console.log(JSON.stringify(tally, null, 1));

const a1a2 = results.filter((r) => r.inheritedLevel === "A1-A2");
console.log("\n=== Cambridge topics inheriting A1-A2 (" + a1a2.length + ") ===");
for (const r of a1a2) console.log("  " + r.label + "   <- " + r.matchedWith);

const un = results.filter((r) => r.inheritedLevel === null);
console.log("\n=== UNMATCHED (" + un.length + ") — 所有带档位的源都没覆盖，须人工判 ===");
for (const r of un.slice(0, 60)) console.log("  " + r.label);
if (un.length > 60) console.log("  ...(" + (un.length - 60) + " more in crossref-report.json)");
