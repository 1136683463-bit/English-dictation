/** 多词跨度错点：tokenIndex 指向单个 token，但 original/correction 是多词——证据 */
import { huntCases } from "../../src/data/huntCases";
const SPAN = (e: { original: string }) => (e.original ?? "").trim().split(/\s+/).filter(Boolean).length > 1;
for (const hc of huntCases) {
  if (!hc.errors.some(SPAN)) continue;
  console.log(`\n════ ${hc.id} 「${hc.title}」 ════`);
  console.log(`tokens[${hc.tokens.length}]: ${hc.tokens.map((t, i) => `${i}:${t}`).join("  ")}`);
  for (const e of hc.errors) {
    const mark = SPAN(e) ? " ★跨度" : "";
    console.log(`  #${e.tokenIndex} tokens[${e.tokenIndex}]=${JSON.stringify(hc.tokens[e.tokenIndex])} tag=${e.tag}${mark}`);
    console.log(`       original="${e.original}"  (${e.original.split(/\s+/).length} 词)`);
    console.log(`       correction="${e.correction}"`);
  }
}
