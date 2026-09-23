import { huntCases } from "../../src/data/huntCases";
const DEL = /^（?去掉|^删除/;
const MOVE = /放到|移到|挪到|对调|调换|互换|搬|顺序调整/;
let woDel = 0, woDelMove = 0, woDelPure = 0;
const pure: string[] = [];
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim();
  if (e.tag !== "word_order" || !DEL.test(c)) continue;
  woDel += 1;
  if (MOVE.test(c)) woDelMove += 1; else { woDelPure += 1; pure.push(`${hc.id}#${e.tokenIndex} "${e.original}"→"${c}"`); }
}
console.log(`tag=word_order 且 correction 以「去掉」开头：${woDel}`);
console.log(`  其中真移动：${woDelMove}   真删除：${woDelPure}`);
console.log(`  真删除清单：`); pure.forEach((s) => console.log("     " + s));
// 全库 MOVE 总数复查（含纯英文同词集重排）
const CJK = /[\u4e00-\u9fff]/;
const W = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const N = (s: string) => s.replace(/[^A-Za-z0-9']/g, "").toLowerCase();
const reord: string[] = [];
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim(), o = (e.original ?? "").trim();
  if (CJK.test(c)) continue;
  const cw = W(c), ow = W(o);
  if (cw.length < 2 || ow.length < 2) continue;
  const a = [...cw.map(N)].sort().join("|"), b = [...ow.map(N)].sort().join("|");
  if (a === b) reord.push(`${hc.id}#${e.tokenIndex} "${o}"→"${c}"`);
}
console.log(`\n纯英文「同词集重排」（无中文提示的移动）：${reord.length}`);
reord.forEach((s) => console.log("   " + s));
const moveAll = new Set<string>();
for (const hc of huntCases) for (const e of hc.errors) if (MOVE.test((e.correction ?? "").trim())) moveAll.add(`${hc.id}#${e.tokenIndex}`);
console.log(`\n移动/换位 总数 = 中文提示 ${moveAll.size} + 纯英文重排 ${reord.length} = ${moveAll.size + reord.length}`);
