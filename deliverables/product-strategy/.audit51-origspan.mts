/**
 * 第 51 批 · 潜在第六类：original 本身是**多词跨度**（跨多个 token）的条目
 * 这类无法被「单 tokenIndex 替换」正确执行——按形态分类（只看 correction）会漏掉它。
 */
import { huntCases } from "../../src/data/huntCases";
import { correctedSentenceOf } from "../../src/services/huntService";
const span: string[] = [];
for (const hc of huntCases) for (const e of hc.errors) {
  if ((e.original ?? "").trim().split(/\s+/).filter(Boolean).length > 1)
    span.push(`${hc.id}#${e.tokenIndex} tag=${e.tag} orig="${e.original}" corr="${e.correction}"`);
}
console.log(`original 是多词跨度的：${span.length} 条`); span.forEach((s) => console.log("  " + s));

console.log("\n\n════ 这些案件经 correctedSentenceOf 后的句子（看是否产生重复/残缺）════");
const ids = Array.from(new Set(span.map((s) => s.split("#")[0])));
for (const id of ids) {
  const hc = huntCases.find((h) => h.id === id)!;
  console.log(`\n── ${hc.id}`);
  console.log(`   原: ${hc.tokens.join(" ")}`);
  console.log(`   得: ${correctedSentenceOf(hc)}`);
}

console.log("\n\n════ 空串/仅标点 correction 复核 ════");
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim();
  if (!c || /^[.,!?;:]+$/.test(c)) console.log(`  ${hc.id}#${e.tokenIndex} corr=${JSON.stringify(c)}`);
}
console.log("  （以上为空则无）");
