/** 附加核查：14 条「大小写/标点」型的 tag 是否贴切（tag 是唯一的结构化修正类型信号） */
import { huntCases } from "../../src/data/huntCases";
const N = (s: string) => s.replace(/[^A-Za-z0-9']/g, "").toLowerCase();
const CJK = /[\u4e00-\u9fff]/;
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim(), o = (e.original ?? "").trim();
  if (CJK.test(c) || N(c) !== N(o) || c === o) continue;
  const kind = c.toLowerCase() === o.toLowerCase() ? "大小写" : "标点";
  console.log(`${kind}  ${hc.id}#${e.tokenIndex} tag=${e.tag.padEnd(13)} "${o}" → "${c}"`);
  console.log(`        讲: ${e.explanation}`);
}
console.log("\n════ tag 是唯一的结构化类型信号：全库 tag 分布 ════");
const t: Record<string, number> = {}; let n = 0;
for (const hc of huntCases) for (const e of hc.errors) { t[e.tag] = (t[e.tag] ?? 0) + 1; n += 1; }
Object.entries(t).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`   ${k.padEnd(14)} ${v}`));
console.log(`   合计 ${n}`);
