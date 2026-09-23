/** 逐案核对 17 处「移动」的真实语义（读 tokens 还原原句与目标句） */
import { huntCases } from "../../src/data/huntCases";
const MOVE_RE = /放到|移到|挪到|对调|调换|互换|搬|顺序调整/;
const byId = new Map(huntCases.map((h) => [h.id, h]));
const hits: { id: string; idx: number; orig: string; corr: string; tag: string }[] = [];
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim();
  if (MOVE_RE.test(c)) hits.push({ id: hc.id, idx: e.tokenIndex, orig: e.original, corr: c, tag: e.tag });
}
console.log(`共 ${hits.length} 处含「位移」动词\n`);
for (const h of hits) {
  const hc = byId.get(h.id);
  if (!hc) continue;
  const toks = hc.tokens;
  const orig = toks.map((t) => t).join(" ");
  // 去掉该 token 后的句子
  const without = toks.filter((_, i) => i !== h.idx).join(" ");
  console.log(`── ${h.id}#${h.idx} tag=${h.tag}`);
  console.log(`   原句   : ${orig}`);
  console.log(`   原 token: "${h.orig}" → correction "${h.corr}"`);
  console.log(`   若真删除后: ${without}`);
  const e = hc.errors.find((x) => x.tokenIndex === h.idx);
  console.log(`   讲解   : ${e?.explanation}`);
  console.log("");
}
