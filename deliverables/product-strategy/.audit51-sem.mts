/**
 * 第 51 批 · correction 的【语义】分类（建议口径）
 * 互斥优先级：删除 > 移动 > 标点/大小写 > 插入 > 替换
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
  if (DEL.test(x.c)) return "删除";
  if (MOVE.test(x.c)) return "移动/换位";
  if (!CJK.test(x.c) && N(x.c) === N(x.o) && x.c !== x.o) return "只改标点/大小写";
  const cw = W(x.c), ow = W(x.o);
  if (ow.length && cw.length > ow.length && ow.every((w) => cw.map(N).includes(N(w)))) return "插入(补词)";
  if (!CJK.test(x.c)) return "替换";
  return "其它指令型";
};
const t: Record<string, number> = {};
const ex: Record<string, string[]> = {};
all.forEach((x) => { const k = sem(x); t[k] = (t[k] ?? 0) + 1; (ex[k] ??= []).length < 5 && ex[k].push(`${x.id}#${x.idx} "${x.o}"→"${x.c}"`); });
console.log("【语义分类（建议口径）】");
Object.entries(t).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
  console.log(`\n  ${k}：${v}`);
  ex[k].forEach((s) => console.log(`      ${s}`));
});
console.log(`\n  合计 ${Object.values(t).reduce((a, b) => a + b, 0)} / 796`);
