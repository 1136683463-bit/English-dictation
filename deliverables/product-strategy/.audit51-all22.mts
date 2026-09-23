/** 22 处移动 全部走 correctedSentenceOf 的哪个分支 */
import { huntCases } from "../../src/data/huntCases";
import { correctedSentenceOf } from "../../src/services/huntService";
const CJK = /[\u4e00-\u9fff]/;
const W = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const N = (s: string) => s.replace(/[^A-Za-z0-9']/g, "").toLowerCase();
const MOVEtxt = /放到|移到|挪到|对调|调换|互换|搬|顺序调整/;
const isRe = (o: string, c: string) => { const cw = W(c), ow = W(o); return !CJK.test(c) && cw.length >= 2 && ow.length >= 2 && [...cw.map(N)].sort().join("|") === [...ow.map(N)].sort().join("|"); };
let del = 0, keep = 0, rep = 0, n = 0;
const rows: string[] = [];
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim();
  const move = MOVEtxt.test(c) || isRe((e.original ?? "").trim(), c);
  if (!move) continue;
  n += 1;
  let br: string;
  if (/^（?去掉|去掉/.test(c)) { del += 1; br = "①删词（误）"; }
  else if (CJK.test(c)) { keep += 1; br = "③保持原样"; }
  else { rep += 1; br = "④替换"; }
  rows.push(`${hc.id}#${e.tokenIndex} [${br}] "${e.original}"→"${c}"`);
}
console.log(`移动总数 ${n}：${"\n"}  ①删词分支 ${del}\n  ③中文保持原样 ${keep}\n  ④替换分支 ${rep}\n`);
rows.forEach((r) => console.log("  " + r));
