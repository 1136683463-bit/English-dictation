/**
 * 第 51 批 · correctedSentenceOf 的两类机械缺陷（全库 213 案扫描）
 *  机制 A「跨度错位」：original 跨多 token，但只有 tokenIndex 一个插入位 →
 *                     把整段新文本塞进一个 token 位，旧 span 的其余词留在原地 → 重复/残句
 *  机制 B「相邻错点相互污染」：两个 error 的位置相邻且 correction 互为包含/补偿 →
 *                     前一处的修正结果又被后一处覆盖，产生 "went went" / "forward to to"
 */
import { huntCases } from "../../src/data/huntCases";
import { correctedSentenceOf } from "../../src/services/huntService";
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const mechA: string[] = [], mechB: string[] = [];
for (const hc of huntCases) {
  // 机制 A
  const spans = hc.errors.filter((e) => words(e.original).length > 1);
  if (spans.length) mechA.push(`${hc.id}: ${spans.map((e) => `#${e.tokenIndex} "${e.original}"→"${e.correction}"`).join("; ")}`);
  // 机制 B：相邻 tokenIndex 且 correction 含 original 之外还含邻词
  for (const e of hc.errors) {
    const nb = hc.errors.find((o) => Math.abs(o.tokenIndex - e.tokenIndex) === 1);
    if (!nb) continue;
    const cw = words(e.correction).map((w) => w.toLowerCase());
    const nbTok = (hc.tokens[nb.tokenIndex] ?? "").replace(/[.,!?;:]+$/, "").toLowerCase();
    if (nbTok && cw.includes(nbTok) && cw.length > 1) {
      mechB.push(`${hc.id}: #${e.tokenIndex} "${e.original}"→"${e.correction}" 覆盖了邻位 #${nb.tokenIndex} "${nb.original}"`);
    }
  }
}
const setA = new Set(mechA.map((s) => s.split(":")[0])), setB = new Set(mechB.map((s) => s.split(":")[0]));
console.log(`机制 A（跨度错位）命中 ${mechA.length} 处 / ${setA.size} 案：`); mechA.forEach((s) => console.log("   " + s));
console.log(`\n机制 B（相邻污染）命中 ${mechB.length} 处 / ${setB.size} 案：`); mechB.forEach((s) => console.log("   " + s));
const union = new Set([...setA, ...setB]);
console.log(`\n并集：${union.size} 案受影响（全库 ${huntCases.length} 案，占 ${(union.size / huntCases.length * 100).toFixed(1)}%）`);
console.log(`   案 id: ${Array.from(union).join(", ")}`);
