/**
 * 第 51 批 · correctedSentenceOf 缺陷机制（全库 213 案）
 *  机制 A「original 跨多 token」：tokenIndex 只给一个插入位，旧 span 其余词留在原地
 *  机制 C「correction 跨多 token 且含句中已有的词」：单 token 替换把邻词重写一遍 → 重复
 *  机制 D「correction 为中文说明」：函数按设计保持原样（错形残留）
 */
import { huntCases } from "../../src/data/huntCases";
import { correctedSentenceOf } from "../../src/services/huntService";
const CJK = /[\u4e00-\u9fff]/;
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const strip = (s: string) => s.replace(/[.,!?;:]+$/, "").toLowerCase();
const A: string[] = [], C: string[] = [], D: string[] = [];
for (const hc of huntCases) {
  for (const e of hc.errors) {
    const orig = words(e.original), corr = words(e.correction);
    if (orig.length > 1) A.push(`${hc.id}#${e.tokenIndex} "${e.original}"→"${e.correction}"`);
    if (CJK.test(e.correction ?? "")) { D.push(`${hc.id}#${e.tokenIndex} "${e.original}"→"${e.correction}"`); continue; }
    if (corr.length > 1 && orig.length === 1) {
      // correction 里除 original 自己以外的词，是否已出现在句子中（紧跟该 token 前后）？
      const extra = corr.map(strip).filter((w) => w !== strip(e.original));
      const near = hc.tokens.slice(Math.max(0, e.tokenIndex - 2), e.tokenIndex + 3).map(strip);
      const dup = extra.some((w) => near.includes(w));
      if (dup) C.push(`${hc.id}#${e.tokenIndex} tokens[${e.tokenIndex}]="${e.tokens === undefined ? "" : hc.tokens[e.tokenIndex]}" "→${e.correction}"  邻域=[${hc.tokens.slice(Math.max(0, e.tokenIndex - 2), e.tokenIndex + 3).join(" ")}]`);
    }
  }
}
const setOf = (a: string[]) => new Set(a.map((s) => s.split("#")[0]));
console.log(`机制 A「original 跨多 token」：${A.length} 处 / ${setOf(A).size} 案`); A.forEach((s) => console.log("   " + s));
console.log(`\n机制 C「correction 含句中已有的词（重复风险）」：${C.length} 处 / ${setOf(C).size} 案`); C.forEach((s) => console.log("   " + s));
console.log(`\n机制 D「correction 是中文说明（函数按设计不改）」：${D.length} 处 / ${setOf(D).size} 案`);
D.forEach((s) => console.log("   " + s));
const U = new Set([...setOf(A), ...setOf(C), ...setOf(D)]);
console.log(`\n并集 ${U.size} 案 / 全库 ${huntCases.length} 案 = ${(U.size / huntCases.length * 100).toFixed(1)}%`);
