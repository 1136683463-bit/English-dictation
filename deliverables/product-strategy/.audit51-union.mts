/** 三类缺陷的案件并集（复核报告里的「≈20 案 / 9.4%」） */
import { huntCases } from "../../src/data/huntCases";
const CJK = /[\u4e00-\u9fff]/;
const W = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const N = (s: string) => s.replace(/[^A-Za-z0-9']/g, "").toLowerCase();
const sp = (s: string) => s.replace(/[.,!?;:]+$/, "").toLowerCase();
const MOVEtxt = /放到|移到|挪到|对调|调换|互换|搬|顺序调整/;
const isReorder = (e: { o: string; c: string }) => {
  if (CJK.test(e.c)) return false;
  const cw = W(e.c), ow = W(e.o);
  if (cw.length < 2 || ow.length < 2) return false;
  return [...cw.map(N)].sort().join("|") === [...ow.map(N)].sort().join("|");
};
const M = new Set<string>(), A = new Set<string>(), B = new Set<string>();
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim(), o = (e.original ?? "").trim();
  if (MOVEtxt.test(c) || isReorder({ o, c })) M.add(hc.id);
  if (W(o).length > 1) A.add(hc.id);
  if (!CJK.test(c) && W(c).length > 1 && W(o).length === 1) {
    const nb = [hc.tokens[e.tokenIndex - 1], hc.tokens[e.tokenIndex + 1]].filter(Boolean).map(sp);
    if (W(c).map(sp).filter((w) => w !== sp(o)).some((w) => nb.includes(w))) B.add(hc.id);
  }
}
const U = new Set([...M, ...A, ...B]);
console.log(`移动类案件       ${M.size}`);
console.log(`机制A 跨度案件   ${A.size}`);
console.log(`机制B 邻词案件   ${B.size}`);
console.log(`并集             ${U.size}  / ${huntCases.length} = ${(U.size / huntCases.length * 100).toFixed(1)}%`);
console.log(`\n重叠：（A∩M）${[...A].filter((x) => M.has(x)).join(",")}`);
console.log(`B 全部：${[...B].join(",")}`);
console.log(`\n并集全部：${[...U].join(", ")}`);
// 报告里说「机制 B 真缺陷 6 处」——列出这 6 案
console.log(`\n机制B 候选 ${B.size} 案（报告称 11 处候选、其中 6 真 5 假）`);
