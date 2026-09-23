/**
 * 第 51 批 · 主题一复核（二）：语义 vs 形态——「移动」藏在几种外壳里？
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit51-move.mts
 *
 * 关键区分：
 *   「形态」= correction 的字面长相（单词/多词/去掉X/括号式）
 *   「语义」= correction 真正要求的操作（替换/删除/移动/补大小写…）
 * 本脚本按【语义】判定，看移动跨了几种形态外壳。
 */
import { huntCases } from "../../src/data/huntCases";
import type { HuntError } from "../../src/types";

type Shape = "单词替换" | "多词" | "去掉X" | "括号式";
function shape(e: HuntError): Shape {
  const c = (e.correction ?? "").trim();
  if (/^[（(]/.test(c) && /[）)]$/.test(c)) return "括号式";
  if (/^(去掉|删除)/.test(c)) return "去掉X";
  if (c.split(/\s+/).filter(Boolean).length >= 2) return "多词";
  return "单词替换";
}

// 语义：移动/换位的判据——文案里出现「位次迁移」类动词
const MOVE_RE = /放到|移到|挪到|对调|调换|互换|搬|顺序调整|跟在.{0,6}(前|后)|(前|后)面去/;
type Intent = "移动" | "删除" | "纯大小写标点" | "替换/其他";
function intent(e: HuntError): Intent {
  const c = (e.correction ?? "").trim();
  const o = (e.original ?? "").trim();
  if (MOVE_RE.test(c)) return "移动";
  if (/^(去掉|删除)/.test(c) || /^[（(]\s*(去掉|删除)/.test(c)) return "删除";
  const norm = (s: string) => s.replace(/[^A-Za-z0-9']/g, "").toLowerCase();
  if (norm(c) === norm(o) && c !== o) return "纯大小写标点";
  return "替换/其他";
}

const crossTab: Record<string, Record<string, number>> = {};
const moveList: string[] = [];
const csList: string[] = [];
let total = 0;
for (const hc of huntCases) for (const e of hc.errors) {
  total += 1;
  const s = shape(e), i = intent(e);
  crossTab[i] = crossTab[i] ?? {};
  crossTab[i][s] = (crossTab[i][s] ?? 0) + 1;
  if (i === "移动") moveList.push(`${hc.id}#${e.tokenIndex} [${s}] tag=${e.tag} orig="${e.original}" corr="${e.correction}"`);
  if (i === "纯大小写标点") csList.push(`${hc.id}#${e.tokenIndex} [${s}] tag=${e.tag} orig="${e.original}" corr="${e.correction}"`);
}
console.log(`总数 ${total}`);
console.log("\n════ 语义 × 形态 交叉表 ════");
const intents = Object.keys(crossTab);
const shapes = ["单词替换", "多词", "去掉X", "括号式"];
console.log("语义".padEnd(14) + shapes.map((s) => s.padStart(10)).join("") + "    合计");
for (const i of intents) {
  const row = shapes.map((s) => crossTab[i][s] ?? 0);
  console.log(i.padEnd(14) + row.map((n) => String(n).padStart(10)).join("") + String(row.reduce((a, b) => a + b, 0)).padStart(8));
}
const colTot = shapes.map((s) => intents.reduce((a, i) => a + (crossTab[i][s] ?? 0), 0));
console.log("形态合计".padEnd(12) + colTot.map((n) => String(n).padStart(10)).join("") + String(colTot.reduce((a, b) => a + b, 0)).padStart(8));

console.log(`\n\n════ 语义=移动 的全部条目（${moveList.length} 条）════`);
moveList.forEach((s, i) => console.log(`${String(i + 1).padStart(2)}. ${s}`));
const byShape: Record<string, number> = {};
for (const s of moveList) { const sh = s.match(/\[(.+?)\]/)?.[1] ?? "?"; byShape[sh] = (byShape[sh] ?? 0) + 1; }
console.log("  按外壳分布：" + JSON.stringify(byShape));

console.log(`\n\n════ 语义=纯大小写/标点（${csList.length} 条）════`);
csList.forEach((s, i) => console.log(`${String(i + 1).padStart(2)}. ${s}`));

// 「去掉X」里 tag=word_order 的（word_order 罪名 + 去掉措辞 = 天然矛盾信号）
console.log("\n\n════ tag=word_order 但措辞是「去掉」（罪名与文案的交叉信号）════");
let woDel = 0;
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim();
  if (e.tag === "word_order" && /去掉/.test(c)) { woDel += 1; console.log(`  ${hc.id}#${e.tokenIndex} orig="${e.original}" corr="${c}"`); }
}
console.log(`共 ${woDel} 条`);
