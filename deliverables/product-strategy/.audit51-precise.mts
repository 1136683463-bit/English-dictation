/**
 * 第 51 批 · 精确判定 correctedSentenceOf 的真缺陷
 * 判据（机制级，不是「重复词」表面判据）：
 *   A 跨度：某 error 的 original 跨 >1 token，但只有 tokenIndex 一个替换位
 *          ⇒ 修正后句中同时出现 correction 全文 与 original 的残余词
 *   C 邻词重写：correction 是多词，且其词集包含该 token 的**邻位**词（该邻位不是同一个 error）
 *          ⇒ 邻词被写了两遍
 * 假阳性剔除：跨句边界的重复（句号之后）不算。
 */
import { huntCases } from "../../src/data/huntCases";
import { correctedSentenceOf } from "../../src/services/huntService";
const CJK = /[\u4e00-\u9fff]/;
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const strip = (s: string) => s.replace(/[.,!?;:]+$/, "").toLowerCase();
const A: string[] = [], C: string[] = [];
for (const hc of huntCases) {
  for (const e of hc.errors) {
    const c = (e.correction ?? "").trim();
    if (CJK.test(c)) continue;
    const orig = words(e.original), corr = words(c);
    // 机制 A
    if (orig.length > 1 && corr.length > 1) {
      // 修正后，original 里除 tokenIndex 位的词，是否仍留在句中？
      const rest = orig.map(strip).filter((w) => w !== strip(hc.tokens[e.tokenIndex] ?? ""));
      if (rest.length) A.push(`${hc.id}#${e.tokenIndex} "${e.original}"→"${e.correction}"  残余词 [${rest.join(",")}]`);
    }
    // 机制 C：correction 含邻位词（邻位不是同一 error）
    if (corr.length > 1 && orig.length === 1) {
      const nb = [...hc.tokens.slice(Math.max(0, e.tokenIndex - 1), e.tokenIndex), ...hc.tokens.slice(e.tokenIndex + 1, e.tokenIndex + 2)].map(strip);
      const extra = corr.map(strip).filter((w) => w !== strip(e.original));
      const hit = extra.filter((w) => nb.includes(w));
      if (hit.length) C.push(`${hc.id}#${e.tokenIndex} "${e.original}"→"${e.correction}"  邻位含 [${hit.join(",")}]  邻域=[${hc.tokens.slice(Math.max(0, e.tokenIndex - 1), e.tokenIndex + 2).join(" ")}]`);
    }
  }
}
const ids = (a: string[]) => new Set(a.map((s) => s.split("#")[0]));
console.log(`机制 A（original 跨 token，残余词留在句里）：${A.length} 处 / ${ids(A).size} 案`);
A.forEach((s) => console.log("   " + s));
console.log(`\n机制 C（correction 含邻位词，邻词被写两遍）：${C.length} 处 / ${ids(C).size} 案`);
C.forEach((s) => console.log("   " + s));
const U = new Set([...ids(A), ...ids(C)]);
console.log(`\n并集 ${U.size} 案 / ${huntCases.length} = ${(U.size / huntCases.length * 100).toFixed(1)}%`);
console.log(`\n逐案实得句（人工确认）：`);
for (const id of U) {
  const hc = huntCases.find((h) => h.id === id)!;
  console.log(`\n  ── ${id}`);
  console.log(`     原: ${hc.tokens.join(" ")}`);
  console.log(`     得: ${correctedSentenceOf(hc)}`);
}
