/** 缺陷案件并集（剔除 5 处人工判读后的假阳性） */
import { huntCases } from "../../src/data/huntCases";
const CJK = /[\u4e00-\u9fff]/;
const W = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const N = (s: string) => s.replace(/[^A-Za-z0-9']/g, "").toLowerCase();
const sp = (s: string) => s.replace(/[.,!?;:]+$/, "").toLowerCase();
const MOVEtxt = /放到|移到|挪到|对调|调换|互换|搬|顺序调整/;
const isRe = (o: string, c: string) => { const cw = W(c), ow = W(o); return !CJK.test(c) && cw.length >= 2 && ow.length >= 2 && [...cw.map(N)].sort().join("|") === [...ow.map(N)].sort().join("|"); };
const FALSE_B = new Set(["hunt-height-chart", "hunt-before-dinner", "hunt-two-faces", "hunt-as-soon-as-comes", "hunt-as-long-as-forest"]);
const M = new Set<string>(), A = new Set<string>(), B = new Set<string>();
let mCnt = 0, aCnt = 0, bCnt = 0;
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim(), o = (e.original ?? "").trim();
  if (MOVEtxt.test(c) || isRe(o, c)) { M.add(hc.id); mCnt += 1; }
  if (W(o).length > 1) { A.add(hc.id); aCnt += 1; }
  if (!CJK.test(c) && W(c).length > 1 && W(o).length === 1) {
    const nb = [hc.tokens[e.tokenIndex - 1], hc.tokens[e.tokenIndex + 1]].filter(Boolean).map(sp);
    if (W(c).map(sp).filter((w) => w !== sp(o)).some((w) => nb.includes(w))) { B.add(hc.id); bCnt += 1; }
  }
}
const Btrue = new Set([...B].filter((x) => !FALSE_B.has(x)));
const Uraw = new Set([...M, ...A, ...B]);
const Utrue = new Set([...M, ...A, ...Btrue]);
console.log(`移动       ${mCnt} 处 / ${M.size} 案`);
console.log(`机制 A     ${aCnt} 处 / ${A.size} 案`);
console.log(`机制 B     ${bCnt} 处候选 / ${B.size} 案（含 5 处假阳性 → 真 ${bCnt - 5} 处 / ${Btrue.size} 案）`);
console.log(`\n并集（含假阳性）${Uraw.size} 案 / 213 = ${(Uraw.size / 213 * 100).toFixed(1)}%`);
console.log(`并集（剔除假阳性）${Utrue.size} 案 / 213 = ${(Utrue.size / 213 * 100).toFixed(1)}%  ← 报告应采用此数`);
console.log(`\n缺陷条目总数（去重后，按处）：移动 ${mCnt} + A ${aCnt} + B真 ${bCnt - 5} = ${mCnt + aCnt + bCnt - 5} 处（含跨类重叠）`);
