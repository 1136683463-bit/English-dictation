/**
 * 第 50 批 · HuntError.correction 的语义家族（未文档化字段的证据）。
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit50-hunt.mts
 */
import { huntCases } from "../../src/data/huntCases";

const cw = (t: string) => (t ?? "").replace(/[^A-Za-z0-9']/g, "").toLowerCase();
type Fam = "换词(给替换词)" | "删除指令" | "移动指令" | "只补标点" | "矛盾(说没问题)" | "删除指令带括号";
const tally: Record<Fam, number> = { "换词(给替换词)": 0, "删除指令": 0, "移动指令": 0, "只补标点": 0, "矛盾(说没问题)": 0, "删除指令带括号": 0 };
const ex: Record<Fam, string[]> = { "换词(给替换词)": [], "删除指令": [], "移动指令": [], "只补标点": [], "矛盾(说没问题)": [], "删除指令带括号": [] };
let total = 0;
for (const hc of huntCases) for (const e of hc.errors) {
  total += 1;
  const c = (e.correction ?? "").trim();
  let f: Fam;
  if (/没问题|这句对|本身没错/.test(e.explanation ?? "")) f = "矛盾(说没问题)";
  else if (/^（?去掉/.test(c)) f = /（/.test(c) ? "删除指令带括号" : "删除指令";
  else if (/^去掉/.test(c)) f = "删除指令";
  else if (/{.*}/.test(c) || /放到|移到|挪到|并入/.test(c)) f = "移动指令";
  else if (cw(c) === cw(e.original) && c !== e.original) f = "只补标点";
  else if (c.length > 0 && !/[。，、；：]/.test(c) && c.split(/\s+/).length <= 2) f = "换词(给替换词)";
  else f = "换词(给替换词)";
  tally[f] += 1;
  if (ex[f].length < 6) ex[f].push(`${hc.id} idx=${e.tokenIndex} tag=${e.tag} original="${e.original}" correction="${c}"`);
}
console.log(`HuntError 总数 ${total}`);
for (const k of Object.keys(tally) as Fam[]) {
  console.log(`\n  ${k}: ${tally[k]}`);
  ex[k].forEach((s) => console.log("     " + s));
}

console.log("\n\n════ 删除指令里带「放到…前面」的（名为删除、实为移动）════");
const moveLike: string[] = [];
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim();
  if (/去掉/.test(c) && /放到|移到|挪到/.test(c)) moveLike.push(`${hc.id} idx=${e.tokenIndex} original="${e.original}" correction="${c}"`);
}
console.log(`共 ${moveLike.length} 处：`);
moveLike.slice(0, 10).forEach((s) => console.log("   " + s));

console.log("\n\n════ 真正「correction 与 original 完全一致」的（无操作）════");
let noop = 0; const noopEx: string[] = [];
for (const hc of huntCases) for (const e of hc.errors) {
  if ((e.correction ?? "").trim() === (e.original ?? "").trim()) { noop += 1; noopEx.push(`${hc.id} idx=${e.tokenIndex} original="${e.original}" correction="${e.correction}"`); }
}
console.log(`共 ${noop} 处`);

console.log("\n\n════ 「陷阱词」被登记为错误的（explanation 与 errors 登记矛盾）════");
const traps: string[] = [];
for (const hc of huntCases) for (const e of hc.errors) {
  if (/这句没问题|本身没错|这里的陷阱/.test(e.explanation ?? "")) traps.push(`${hc.id} idx=${e.tokenIndex} tag=${e.tag} original="${e.original}" correction="${e.correction}"\n        explanation="${e.explanation}"`);
}
console.log(`共 ${traps.length} 处：`);
traps.forEach((s) => console.log("   " + s));
