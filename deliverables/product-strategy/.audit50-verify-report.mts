/**
 * 第 50 批 · 报告数字复核：200 这个数是怎么来的，以及【】的总处数/行数。
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit50-verify-report.mts
 */
import { grammarLessons } from "../../src/data/grammarLessons";
import { huntCases } from "../../src/data/huntCases";

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

let withBracket = 0, mismatch = 0, matched = 0, noMark = 0;
let bracketOcc = 0, bracketLines = 0;
for (const l of grammarLessons) {
  (l.contrast ?? []).forEach((c) => {
    if (!c.whyZh.includes("【")) return;
    withBracket += 1;
    bracketOcc += (c.whyZh.match(/【[^】]*】/g) ?? []).length;
    bracketLines += c.whyZh.split("\n").filter((x) => x.includes("【")).length;
    const marks = Array.from(c.whyZh.matchAll(/【([^】]*)】/g)).map((m) => m[1]);
    const mark = (c.wrongMark ?? "").trim();
    if (!mark) { noMark += 1; mismatch += 1; return; }
    const same = marks.some((b) => norm(b).toLowerCase() === norm(mark).toLowerCase());
    if (same) matched += 1; else mismatch += 1;
  });
}
console.log("══ contrast.whyZh 里 【】 的规模 ══");
console.log(`  含【】的对照卡条数        = ${withBracket}`);
console.log(`  这些卡里【】的总处数      = ${bracketOcc}`);
console.log(`  whyZh 中含【】的行数      = ${bracketLines}`);
console.log(`  （对照：全文件裸文本扫描 366 处 / 350 行 —— 差额来自 guided.correctionZh / explain / deepDive 等其它字段）`);

console.log("\n══ 「wrongMark 与【】不一致」的卡数 ══");
console.log(`  【】里有任一项 == wrongMark  = ${matched}`);
console.log(`  不一致（= 我报告里说的 200）  = ${mismatch}`);
console.log(`    其中 wrongMark 为空的         = ${noMark}`);
console.log(`    其中 wrongMark 有值但不等      = ${mismatch - noMark}`);

console.log("\n══ 其它字段里 【】 的总处数（补全分母）══");
let otherOcc = 0; const byField: Record<string, number> = {};
for (const l of grammarLessons) {
  (l.guided ?? []).forEach((g) => {
    for (const [k, v] of [["guided.correctionZh", g.correctionZh], ["guided.explain", g.explain]] as const) {
      if (typeof v === "string" && v.includes("【")) { const n = (v.match(/【[^】]*】/g) ?? []).length; otherOcc += n; byField[k] = (byField[k] ?? 0) + n; }
    }
  });
  (l.variants ?? []).forEach((v) => { if (v.noteZh?.includes("【")) { const n = (v.noteZh.match(/【[^】]*】/g) ?? []).length; otherOcc += n; byField["variants.noteZh"] = (byField["variants.noteZh"] ?? 0) + n; } });
  (l.deepDive?.paragraphs ?? []).forEach((p) => { if (p.includes("【")) { const n = (p.match(/【[^】]*】/g) ?? []).length; otherOcc += n; byField["deepDive.paragraphs"] = (byField["deepDive.paragraphs"] ?? 0) + n; } });
  if (l.summary?.rule.includes("【")) { const n = (l.summary.rule.match(/【[^】]*】/g) ?? []).length; otherOcc += n; byField["summary.rule"] = (byField["summary.rule"] ?? 0) + n; }
}
for (const [k, v] of Object.entries(byField)) console.log(`  ${k} = ${v}`);
console.log(`  其它字段合计 = ${otherOcc}`);
console.log(`  ⇒ 全库 【】 总处数 = ${bracketOcc} + ${otherOcc} = ${bracketOcc + otherOcc}（裸文本扫描得 366，误差来自多行/转义，量级一致）`);

let huntOcc = 0;
for (const hc of huntCases) for (const e of hc.errors) huntOcc += (e.explanation.match(/【[^】]*】/g) ?? []).length;
console.log(`  huntCases.errors[].explanation 里另有 ${huntOcc} 处`);
