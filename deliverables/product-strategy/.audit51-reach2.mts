/** 移动类（22 处 / 21 案，扩展口径）的可达性 */
import { huntCases } from "../../src/data/huntCases";
import { pickCorrectionWord } from "../../src/services/huntService";
const CJK = /[\u4e00-\u9fff]/;
const W = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const N = (s: string) => s.replace(/[^A-Za-z0-9']/g, "").toLowerCase();
const MOVEtxt = /放到|移到|挪到|对调|调换|互换|搬|顺序调整/;
const isRe = (o: string, c: string) => { const cw = W(c), ow = W(o); return !CJK.test(c) && cw.length >= 2 && ow.length >= 2 && [...cw.map(N)].sort().join("|") === [...ow.map(N)].sort().join("|"); };
let cases = 0, reach = 0;
const unreach: string[] = [];
for (const hc of huntCases) {
  if (!hc.errors.some((e) => MOVEtxt.test((e.correction ?? "").trim()) || isRe((e.original ?? "").trim(), (e.correction ?? "").trim()))) continue;
  cases += 1;
  const ok = hc.errors.some((e) => pickCorrectionWord(e.correction ?? "") !== "");
  if (ok) reach += 1; else unreach.push(hc.id);
}
console.log(`移动类案件 ${cases}，其中可达（案内有可入库词）${reach}，不可达 ${unreach.length}`);
if (unreach.length) console.log(`  不可达：${unreach.join(", ")}`);
