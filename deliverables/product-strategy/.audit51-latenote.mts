/** late-note#25「去掉 Because，并入上一句」在 correctedSentenceOf 下变成什么 */
import { huntCases } from "../../src/data/huntCases";
import { correctedSentenceOf } from "../../src/services/huntService";
const hc = huntCases.find((h) => h.id === "hunt-late-note")!;
console.log("原句:", hc.tokens.join(" "));
console.log("实得:", correctedSentenceOf(hc));
const hc2 = huntCases.find((h) => h.id === "hunt-why-dont-you-rest")!;
console.log("\n原句:", hc2.tokens.join(" "));
console.log("实得:", correctedSentenceOf(hc2));
// 所有「含中文且不是删词」的 -> 在 correctedSentenceOf 下保持原样，检查是否留下错句
const CJK = /[\u4e00-\u9fff]/;
console.log("\n\n════ 含中文且非「去掉」开头的 correction → correctedSentenceOf 保持原样（错句残留）════");
for (const c of huntCases) {
  const hits = c.errors.filter((e) => CJK.test(e.correction ?? "") && !/^（?去掉|^去掉/.test((e.correction ?? "").trim()));
  if (!hits.length) continue;
  const out = correctedSentenceOf(c);
  console.log(`\n${c.id}`);
  hits.forEach((e) => console.log(`   #${e.tokenIndex} "${e.original}" corr="${e.correction}"`));
  console.log(`   原: ${c.tokens.join(" ")}`);
  console.log(`   得: ${out}`);
}
