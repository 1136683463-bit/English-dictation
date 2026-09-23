/**
 * 第 51 批 · correction 的【语义】分类（终版口径）
 * 互斥优先级（修正）：移动/换位 > 删除 > 只改标点大小写 > 插入 > 替换 > 其它指令型
 * 理由：`去掉（white 放到 cat 前面）` 字面以「去掉」开头，但真实操作是换位——
 *       若按字面优先级先判删除，就会被归错（这正是本批要收口的语义混淆）。
 */
import { huntCases } from "../../src/data/huntCases";
const CJK = /[\u4e00-\u9fff]/;
const W = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const N = (s: string) => s.replace(/[^A-Za-z0-9']/g, "").toLowerCase();
const DEL = /^（?去掉|^删除/;
const MOVE = /放到|移到|挪到|对调|调换|互换|搬|顺序调整/;
const all: { id: string; idx: number; o: string; c: string; tag: string }[] = [];
for (const hc of huntCases) for (const e of hc.errors) all.push({ id: hc.id, idx: e.tokenIndex, o: (e.original ?? "").trim(), c: (e.correction ?? "").trim(), tag: e.tag });
const sem = (x: { o: string; c: string }): string => {
  if (MOVE.test(x.c)) return "移动/换位";
  if (DEL.test(x.c)) return "删除";
  if (!CJK.test(x.c) && N(x.c) === N(x.o) && x.c !== x.o) return "只改标点/大小写";
  const cw = W(x.c), ow = W(x.o);
  if (ow.length && cw.length > ow.length && ow.every((w) => cw.map(N).includes(N(w)))) return "插入(补词)";
  if (!CJK.test(x.c)) return "替换";
  return "其它指令型";
};
const t: Record<string, number> = {}; const ex: Record<string, string[]> = {};
all.forEach((x) => { const k = sem(x); t[k] = (t[k] ?? 0) + 1; (ex[k] ??= []).length < 6 && ex[k].push(`${x.id}#${x.idx} "${x.o}"→"${x.c}"`); });
console.log("【语义分类（终版）】");
Object.entries(t).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
  console.log(`\n  ${k}：${v}`);
  ex[k].forEach((s) => console.log(`      ${s}`));
});
console.log(`\n  合计 ${Object.values(t).reduce((a, b) => a + b, 0)} / ${all.length}`);
// 交叉：语义 × 形态
const shape = (c: string, o: string) => DEL.test(c) ? "去掉X" : (/^[（(]/.test(c) && /[）)]$/.test(c) ? "括号式" : (W(c).length >= 2 ? "多词" : "单词"));
console.log("\n【语义 × 形态】");
const tab: Record<string, Record<string, number>> = {};
all.forEach((x) => { const s = sem(x), h = shape(x.c, x.o); (tab[s] ??= {}); tab[s][h] = (tab[s][h] ?? 0) + 1; });
const hs = ["单词", "多词", "去掉X", "括号式"];
console.log("  语义".padEnd(18) + hs.map((h) => h.padStart(9)).join("") + "    合计");
for (const [s, row] of Object.entries(tab)) {
  const v = hs.map((h) => row[h] ?? 0);
  console.log("  " + s.padEnd(16) + v.map((n) => String(n).padStart(9)).join("") + String(v.reduce((a, b) => a + b, 0)).padStart(8));
}
