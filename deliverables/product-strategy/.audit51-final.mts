/**
 * 第 51 批 · 最终口径固化：形态五类 + 语义四类 + 移动三层 + 跨度缺陷
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit51-final.mts
 */
import { huntCases } from "../../src/data/huntCases";
import { correctedSentenceOf, pickCorrectionWord } from "../../src/services/huntService";
import { addHuntGapSentences } from "../../src/services/huntService";
import { makeAppData } from "../../src/edge/verify/fixtures";
import type { AppData } from "../../src/types";

const CJK = /[\u4e00-\u9fff]/;
const N = (s: string) => s.replace(/[^A-Za-z0-9']/g, "").toLowerCase();
type E = { id: string; idx: number; o: string; c: string; tag: string; exp: string };
const all: E[] = [];
for (const hc of huntCases) for (const e of hc.errors) all.push({ id: hc.id, idx: e.tokenIndex, o: (e.original ?? "").trim(), c: (e.correction ?? "").trim(), tag: e.tag, exp: e.explanation ?? "" });
console.log(`【基数】案件 ${huntCases.length}，errors 条目 ${all.length}\n`);

// ── 形态五类（只看 correction 字面）──
const shape = (c: string, o: string): string => {
  if (/^[（(]/.test(c) && /[）)]$/.test(c)) return "括号式";
  if (/^(去掉|删除)/.test(c)) return "去掉X";
  if (c.split(/\s+/).filter(Boolean).length >= 2) return "多词";
  if (N(c) === N(o)) return "与原词同(仅大小写/标点)";
  return "单词替换";
};
const sc: Record<string, number> = {};
all.forEach((x) => { const k = shape(x.c, x.o); sc[k] = (sc[k] ?? 0) + 1; });
console.log("【形态五类】");
["单词替换", "多词", "去掉X", "括号式", "与原词同(仅大小写/标点)"].forEach((k) => console.log(`   ${k.padEnd(24)} ${sc[k] ?? 0}`));
console.log(`   合计 ${Object.values(sc).reduce((a, b) => a + b, 0)}`);
console.log(`   注：严格 trim 后逐字相同 = ${all.filter((x) => x.c === x.o).length}；忽略大小写相同 = ${all.filter((x) => x.c.toLowerCase() === x.o.toLowerCase()).length}；仅大小写/标点（去标点归一后同）= ${all.filter((x) => N(x.c) === N(x.o) && x.c !== x.o).length}（其中含「去掉 X」因为归一后只剩 X）`);

// ── 移动三层 ──
const M1 = /^去掉（[^）]*放到[^）]*[前后][^）]*）$/;                              // 字面
const M2 = /^去掉（[^）]*(放到|移到|挪到|搬|顺序调整)[^）]*）$|^去掉 [A-Za-z]+（[^）]*(搬|放到|移到)[^）]*）$/;  // 去掉（…位移…）
const M3 = /对调|调换|互换/;                                                     // 对调类
const l1 = all.filter((x) => M1.test(x.c));
const l2 = all.filter((x) => M2.test(x.c));
const l3 = all.filter((x) => M2.test(x.c) || (/^[（(]/.test(x.c) && M3.test(x.c)));
console.log(`\n【移动三层】`);
console.log(`   L1 字面「去掉（X 放到 Y 前/后）」           ${l1.length}`);
console.log(`   L2 = L1 + 其它「去掉（…位移说明…）」        ${l2.length}   新增: ${l2.filter((x) => !l1.includes(x)).map((x) => `${x.id}#${x.idx}`).join(", ")}`);
console.log(`   L3 = L2 + 括号式「对调」                   ${l3.length}   新增: ${l3.filter((x) => !l2.includes(x)).map((x) => `${x.id}#${x.idx}`).join(", ")}`);
// 纯英文同词集重排
const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
const reorder = all.filter((x) => !CJK.test(x.c) && words(x.c).length >= 2 && (() => { const a = words(x.c), b = words(x.o); return a.length === b.length && [...a].sort().join("|") === [...b].sort().join("|"); })());
console.log(`   L4 = L3 + 纯英文「同词集重排」（无中文提示） ${l3.length + reorder.length}   新增: ${reorder.map((x) => `${x.id}#${x.idx}`).join(", ")}`);

// ── 跨度错点 ──
const span = all.filter((x) => x.o.split(/\s+/).filter(Boolean).length > 1);
const spanCases = Array.from(new Set(span.map((x) => x.id)));
console.log(`\n【跨度错点】original 跨多 token：${span.length} 处 / ${spanCases.length} 案`);
span.forEach((x) => console.log(`   ${x.id}#${x.idx} tag=${x.tag} "${x.o}" → "${x.c}"`));

// ── 下游实测 ──
console.log(`\n【下游实测 · correctedSentenceOf】`);
const moveIds = Array.from(new Set(l3.map((x) => x.id)));
let wrongLoss = 0, stillWrong = 0, ok = 0; const rows: string[] = [];
for (const id of moveIds) {
  const hc = huntCases.find((h) => h.id === id)!;
  const out = correctedSentenceOf(hc);
  const errs = hc.errors.filter((e) => l3.some((x) => x.id === id && x.idx === e.tokenIndex));
  const bad = errs.some((e) => !out.split(/\s+/).some((t) => t.replace(/[.,!?;:]+$/, "").toLowerCase() === e.original.replace(/[.,!?;:]+$/, "").toLowerCase()));
  // 该词是否在正确句里应保留？（移动 = 应保留）→ 丢失即错
  if (bad) { wrongLoss += 1; rows.push(`   ✗ 丢词  ${id}: ${out}`); }
  else { stillWrong += 1; rows.push(`   ✗ 残留  ${id}: ${out}`); }
}
console.log(`   移动类案件 ${moveIds.length} 个，其中：目标词被误删 ${wrongLoss}，目标词保留但句子仍错 ${stillWrong}`);
rows.forEach((r) => console.log(r));

console.log(`\n【下游实测 · 跨度错点的卡正面】`);
let spanCards = 0; const garble: string[] = [];
for (const id of spanCases) {
  const hc = huntCases.find((h) => h.id === id)!;
  const d = addHuntGapSentences(makeAppData({ cards: [], schedules: [], sentenceDetails: [] }) as AppData, hc, hc.errors.map((e) => e.tokenIndex)).data;
  spanCards += d.cards.length;
  const front = d.cards[0]?.front ?? "";
  garble.push(`   ${id}: ${front}`);
}
console.log(`   ${spanCases.length} 案共生成 ${spanCards} 张卡，卡正面均为机械修正结果：`);
garble.forEach((g) => console.log(g));

console.log(`\n【下游实测 · pickCorrectionWord】`);
const pick = all.filter((x) => l3.some((y) => y.id === x.id && y.idx === x.idx));
console.log(`   移动类 ${pick.length} 处，返回非空的 ${pick.filter((x) => pickCorrectionWord(x.c) !== "").length} 处（应为 0）`);
