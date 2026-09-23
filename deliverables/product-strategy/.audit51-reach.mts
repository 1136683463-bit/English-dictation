/** 可达性：移动类案件里，其它错点是否有可入库词 → 错词本例句 = correctedSentenceOf(整案) 会带上删词缺陷 */
import { huntCases } from "../../src/data/huntCases";
import { correctedSentenceOf, pickCorrectionWord } from "../../src/services/huntService";
const MOVE = /^去掉（[^）]*(放到|移到|挪到|搬|顺序调整)[^）]*）$|^去掉 [A-Za-z]+（[^）]*(搬|放到|移到)[^）]*）$|^[（(][^）)]*(对调|调换|互换)[^）)]*[）)]$/;
let total = 0, reachable = 0;
for (const hc of huntCases) {
  const moves = hc.errors.filter((e) => MOVE.test((e.correction ?? "").trim()));
  if (!moves.length) continue;
  total += 1;
  const addable = hc.errors.map((e) => ({ w: pickCorrectionWord(e.correction ?? ""), o: e.original, idx: e.tokenIndex })).filter((x) => x.w);
  const out = correctedSentenceOf(hc);
  const isReachable = addable.length > 0;
  if (isReachable) reachable += 1;
  console.log(`\n── ${hc.id}  移动 ${moves.length} 处 / 可入库词 ${addable.length} 个 ${isReachable ? "★可达（错词本例句会带缺陷）" : "不可达"}`);
  console.log(`   可入库: ${addable.map((a) => `${a.o}→${a.w}`).join(", ") || "（无）"}`);
  console.log(`   例句  : ${out}`);
  const bad = moves.some((e) => !out.split(/\s+/).some((t) => t.replace(/[.,!?;:]+$/, "").toLowerCase() === e.original.replace(/[.,!?;:]+$/, "").toLowerCase()));
  console.log(`   缺陷  : ${bad ? "目标词被删除（应为换位）" : "目标词保留（未改动）"}`);
}
console.log(`\n\n移动类案件 ${total} 个，其中「可达」（案内有可入库词 ⇒ 用户可把例句存进错词本）${reachable} 个`);
