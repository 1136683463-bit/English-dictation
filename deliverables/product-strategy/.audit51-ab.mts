/** 机制 A ∪ B 的案件数与重叠（复核报告里「12 案」） */
import { huntCases } from "../../src/data/huntCases";
const CJK = /[\u4e00-\u9fff]/;
const W = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const sp = (s: string) => s.replace(/[.,!?;:]+$/, "").toLowerCase();
const FALSE_B = new Set(["hunt-height-chart", "hunt-before-dinner", "hunt-two-faces", "hunt-as-soon-as-comes", "hunt-as-long-as-forest"]);
const A = new Set<string>(), B = new Set<string>();
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim(), o = (e.original ?? "").trim();
  if (W(o).length > 1) A.add(hc.id);
  if (!CJK.test(c) && W(c).length > 1 && W(o).length === 1) {
    const nb = [hc.tokens[e.tokenIndex - 1], hc.tokens[e.tokenIndex + 1]].filter(Boolean).map(sp);
    if (W(c).map(sp).filter((w) => w !== sp(o)).some((w) => nb.includes(w))) B.add(hc.id);
  }
}
const Btrue = new Set([...B].filter((x) => !FALSE_B.has(x)));
const AB = new Set([...A, ...Btrue]);
console.log(`A（跨度）${A.size} 案: ${[...A].sort().join(", ")}`);
console.log(`B真（邻词）${Btrue.size} 案: ${[...Btrue].sort().join(", ")}`);
console.log(`A∩Btrue 重叠 ${[...A].filter((x) => Btrue.has(x)).length} 个: ${[...A].filter((x) => Btrue.has(x)).join(", ") || "（无）"}`);
console.log(`A∪Btrue = ${AB.size} 案  ← 报告称「12 案」${AB.size === 12 ? " ✅" : " ✗"}`);
