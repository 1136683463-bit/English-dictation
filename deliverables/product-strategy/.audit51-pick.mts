/** 复核：pickCorrectionWord 对 17 处「移动」的实际返回 */
import { huntCases } from "../../src/data/huntCases";
import { pickCorrectionWord } from "../../src/services/huntService";
const MOVE_RE = /放到|移到|挪到|对调|调换|互换|搬|顺序调整/;
let bad = 0;
console.log("════ 移动 17 处 → pickCorrectionWord 返回 ════");
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim();
  if (!MOVE_RE.test(c)) continue;
  const r = pickCorrectionWord(c);
  const ok = r === "";
  if (!ok) bad += 1;
  console.log(`${ok ? "✓空" : "✗非空"}  ${hc.id}#${e.tokenIndex} corr="${c}" → ${JSON.stringify(r)}`);
}
console.log(`\n非空（应空而未空）= ${bad}`);
// 全库：pickCorrectionWord 的返回分布
let empty = 0, nonEmpty = 0; const ne: string[] = [];
for (const hc of huntCases) for (const e of hc.errors) {
  const r = pickCorrectionWord(e.correction ?? "");
  if (r === "") empty += 1; else { nonEmpty += 1; if (ne.length < 25) ne.push(`${hc.id}#${e.tokenIndex} "${e.original}" → "${e.correction}" → 入库词 "${r}"`); }
}
console.log(`\n全库 796 条：返回空串 ${empty}，非空 ${nonEmpty}`);
console.log("\n非空样例（前 25）："); ne.forEach((s) => console.log("   " + s));
