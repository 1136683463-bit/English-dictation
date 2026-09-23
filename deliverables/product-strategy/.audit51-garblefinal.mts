/** 最终：correctedSentenceOf 产物里「机械修正留下的痕迹」全库扫描 */
import { huntCases } from "../../src/data/huntCases";
import { correctedSentenceOf } from "../../src/services/huntService";
const patterns: { name: string; re: RegExp }[] = [
  { name: "相邻重复词 (X X)", re: /\b([A-Za-z']+)\s+\1\b/i },
  { name: "隔词重复 (X Y X)", re: /\b([A-Za-z']+)\s+([A-Za-z']+)\s+\1\b/i },
];
const hits: { id: string; out: string; kind: string; ex: string }[] = [];
for (const hc of huntCases) {
  const out = correctedSentenceOf(hc);
  for (const p of patterns) {
    const m = p.re.exec(out);
    if (m) { hits.push({ id: hc.id, out, kind: p.name, ex: m[0] }); break; }
  }
}
console.log(`修正句含重复痕迹的案件：${hits.length} / ${huntCases.length}（${(hits.length / huntCases.length * 100).toFixed(1)}%）\n`);
hits.forEach((h) => console.log(`  • ${h.id}  [${h.kind}] "${h.ex}"\n      ${h.out}`));

// 另：修正句仍含错形（某个 error 的 original 同形词仍在句里，且该案不是中文 correction）
const CJK = /[\u4e00-\u9fff]/;
let resident = 0; const res: string[] = [];
for (const hc of huntCases) {
  const out = correctedSentenceOf(hc);
  const norm = (s: string) => s.replace(/[^A-Za-z0-9']/g, "").toLowerCase();
  for (const e of hc.errors) {
    if (CJK.test(e.correction ?? "")) continue;
    const ow = norm(e.original);
    if (!ow || norm(e.correction) === ow) continue;
    // 该 original 是否仍是「该 tokenIndex 位」的词？（删词型会前移，逐位比对不适用）
    if (/^（?去掉/.test((e.correction ?? "").trim())) continue;
    const outToks = out.split(/\s+/);
    if (outToks[e.tokenIndex] && norm(outToks[e.tokenIndex]) === ow) { resident += 1; res.push(`${hc.id}#${e.tokenIndex} "${e.original}"→"${e.correction}" 未生效 | ${out}`); }
  }
}
console.log(`\n\n修正句在【原位】仍是错形的：${resident} 处`);
res.forEach((r) => console.log("  • " + r));
