/**
 * 第 51 批 · 全库 213 案：correctedSentenceOf 产物质量扫描
 * 两类缺陷：
 *   D1 残留：某个 error 的 original 仍以同形词出现在修正句中（该处没被改掉）
 *   D2 残句：出现相邻重复词 / 缺失空格拼接（机械修正把整段 span 塞进单 token 位）
 */
import { huntCases } from "../../src/data/huntCases";
import { correctedSentenceOf } from "../../src/services/huntService";
const CJK = /[\u4e00-\u9fff]/;
const norm = (s: string) => s.replace(/[^A-Za-z0-9']/g, "").toLowerCase();
let d1 = 0, d2 = 0;
const R1: string[] = [], R2: string[] = [];
for (const hc of huntCases) {
  const out = correctedSentenceOf(hc);
  const outWords = out.split(/\s+/).map(norm).filter(Boolean);
  for (const e of hc.errors) {
    const c = (e.correction ?? "").trim();
    if (CJK.test(c)) continue;                     // 中文说明型：函数按设计不改（另计）
    const ow = norm(e.original);
    if (!ow) continue;
    // 该 original 是单 token 且 correction 是多词跨度 → 检查是否重复
    const corrWords = c.split(/\s+/).map(norm).filter(Boolean);
    if (corrWords.length >= 2 && corrWords.includes(ow) && e.original.split(/\s+/).length === 1) {
      // 期望：该 token 位被替换成 corrWords；若句中同时保留旧词 + 新词 → 重复
      const idx = hc.tokens.findIndex((t, i) => i === e.tokenIndex);
      if (idx >= 0) { /* 继续用整句判据 */ }
    }
  }
  // D2 判据：相邻重复词（机械修正把原词与新串并列）
  const dup = /\b([A-Za-z']+)\s+\1\b/i.exec(out);
  if (dup) { d2 += 1; R2.push(`${hc.id}: …${out.slice(Math.max(0, dup.index - 25), dup.index + 45)}…`); }
}
console.log(`D2 修正句含「相邻重复词」的案件：${d2} / ${huntCases.length}`);
R2.forEach((r) => console.log("   " + r));
