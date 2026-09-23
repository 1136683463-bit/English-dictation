/** 复核：tag=word_order 但 correction 是「去掉X」的 25 条——逐条读原句判断究竟是删还是移 */
import { huntCases } from "../../src/data/huntCases";
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim();
  if (e.tag !== "word_order" || !/去掉/.test(c)) continue;
  const toks = hc.tokens;
  console.log(`── ${hc.id}#${e.tokenIndex} orig="${e.original}" corr="${c}"`);
  console.log(`   句: ${toks.join(" ")}`);
  console.log(`   讲: ${e.explanation}`);
  console.log("");
}
