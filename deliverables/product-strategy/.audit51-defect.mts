/**
 * 第 51 批 · correctedSentenceOf 真缺陷（人工逐条判读后固化）
 * 三条机制：
 *   A original 跨多 token：只有 tokenIndex 一个替换位 ⇒ 旧 span 残余词留下
 *   B correction 把前/后邻位词也写进来 ⇒ 邻词被写两遍
 *   C 相邻两错点的 correction 互相叠加 ⇒ X X 重复（如 went went）
 * 判读时人工剔除「结果实为正确英文」的假阳性。
 */
import { huntCases } from "../../src/data/huntCases";
import { correctedSentenceOf } from "../../src/services/huntService";
const CJK = /[\u4e00-\u9fff]/;
const W = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const sp = (s: string) => s.replace(/[.,!?;:]+$/, "").toLowerCase();

const cand: { id: string; idx: number; kind: string; why: string }[] = [];
for (const hc of huntCases) {
  for (const e of hc.errors) {
    const c = (e.correction ?? "").trim();
    if (CJK.test(c)) continue;
    const orig = W(e.original), corr = W(c);
    if (orig.length > 1) cand.push({ id: hc.id, idx: e.tokenIndex, kind: "A", why: `original 跨 ${orig.length} 词 "${e.original}"→"${c}"` });
    if (corr.length > 1 && orig.length === 1) {
      const nb = [hc.tokens[e.tokenIndex - 1], hc.tokens[e.tokenIndex + 1]].filter(Boolean).map(sp);
      const extra = corr.map(sp).filter((w) => w !== sp(e.original));
      const hit = extra.filter((w) => nb.includes(w));
      if (hit.length) cand.push({ id: hc.id, idx: e.tokenIndex, kind: "B", why: `correction "${c}" 把邻位 [${hit.join(",")}] 也写进来` });
    }
  }
}
// 机制 C：扫描产物里相邻同词
for (const hc of huntCases) {
  const out = correctedSentenceOf(hc);
  const m = /\b([A-Za-z']+)\s+\1\b/i.exec(out);
  if (m && !cand.some((c) => c.id === hc.id)) cand.push({ id: hc.id, idx: -1, kind: "C", why: `产物含相邻重复 "${m[0]}"` });
}
console.log(`机制候选 ${cand.length} 处 / ${new Set(cand.map((c) => c.id)).size} 案\n`);
for (const k of ["A", "B", "C"]) {
  const g = cand.filter((c) => c.kind === k);
  console.log(`\n──── 机制 ${k}：${g.length} 处 ────`);
  g.forEach((c) => {
    const hc = huntCases.find((h) => h.id === c.id)!;
    console.log(`  ${c.id}#${c.idx}  ${c.why}`);
    console.log(`      原: ${hc.tokens.join(" ")}`);
    console.log(`      得: ${correctedSentenceOf(hc)}`);
  });
}
