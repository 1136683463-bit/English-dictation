/**
 * 交叉表精确重算（终版）——语义（含扩展的纯英文重排） × 形态（严格五类互斥）
 */
import { huntCases } from "../../src/data/huntCases";
const CJK = /[\u4e00-\u9fff]/;
const W = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const N = (s: string) => s.replace(/[^A-Za-z0-9']/g, "").toLowerCase();
const DELtxt = /^（?去掉|^删除/;
const MOVEtxt = /放到|移到|挪到|对调|调换|互换|搬|顺序调整/;

type E = { id: string; idx: number; o: string; c: string; tag: string };
const all: E[] = [];
for (const hc of huntCases) for (const e of hc.errors) all.push({ id: hc.id, idx: e.tokenIndex, o: (e.original ?? "").trim(), c: (e.correction ?? "").trim(), tag: e.tag });

// 形态（严格五类，与 .audit51-shape.mts 完全一致 → 应得 614/101/68/13/0；此处把「与原词同」并入单词）
const shape = (x: E): string => {
  if (/^[（(]/.test(x.c) && /[）)]$/.test(x.c)) return "括号式";
  if (/^(去掉|删除)/.test(x.c)) return "去掉X";
  if (W(x.c).length >= 2) return "多词";
  return "单词";
};
// 语义（扩展版：先移动文案，再纯英文同词集重排，再删除…）
const isReorder = (x: E): boolean => {
  if (CJK.test(x.c)) return false;
  const cw = W(x.c), ow = W(x.o);
  if (cw.length < 2 || ow.length < 2) return false;
  return [...cw.map(N)].sort().join("|") === [...ow.map(N)].sort().join("|");
};
const sem = (x: E): string => {
  if (MOVEtxt.test(x.c) || isReorder(x)) return "移动/换位";
  if (DELtxt.test(x.c)) return "删除";
  if (!CJK.test(x.c) && N(x.c) === N(x.o) && x.c !== x.o) return "只改标点/大小写";
  const cw = W(x.c), ow = W(x.o);
  if (ow.length && cw.length > ow.length && ow.every((w) => cw.map(N).includes(N(w)))) return "插入(补词)";
  if (!CJK.test(x.c)) return "替换";
  return "其它指令型";
};
const SH = ["单词", "多词", "去掉X", "括号式"];
const tab: Record<string, Record<string, number>> = {};
all.forEach((x) => { const s = sem(x), h = shape(x); (tab[s] ??= {}); tab[s][h] = (tab[s][h] ?? 0) + 1; });
const SEM = ["替换", "插入(补词)", "删除", "移动/换位", "只改标点/大小写", "其它指令型"].filter((s) => tab[s]);
console.log("语义 ＼ 形态".padEnd(20) + SH.map((h) => h.padStart(9)).join("") + "     合计");
for (const s of SEM) {
  const v = SH.map((h) => tab[s][h] ?? 0);
  console.log(s.padEnd(18) + v.map((n) => String(n).padStart(9)).join("") + String(v.reduce((a, b) => a + b, 0)).padStart(9));
}
const col = SH.map((h) => SEM.reduce((a, s) => a + (tab[s][h] ?? 0), 0));
console.log("形态合计".padEnd(16) + col.map((n) => String(n).padStart(9)).join("") + String(col.reduce((a, b) => a + b, 0)).padStart(9));
console.log(`\n语义合计 ${SEM.reduce((a, s) => a + SH.reduce((b, h) => b + (tab[s][h] ?? 0), 0), 0)} / 全库 ${all.length}`);
console.log(`形态合计 ${col.reduce((a, b) => a + b, 0)} / 全库 ${all.length}`);
console.log(`\n形态五类（本口径下）：${SH.map((h, i) => `${h}=${col[i]}`).join("  ")}`);
console.log(`语义六类（扩展口径）：${SEM.map((s) => `${s}=${SH.reduce((a, h) => a + (tab[s][h] ?? 0), 0)}`).join("  ")}`);
// 单列：5 条纯英文重排
console.log(`\n纯英文重排（归入移动）：`);
all.filter(isReorder).forEach((x) => console.log(`   ${x.id}#${x.idx} "${x.o}"→"${x.c}"`));
