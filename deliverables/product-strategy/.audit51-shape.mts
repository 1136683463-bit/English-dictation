/**
 * 第 51 批 · 主题一复核：HuntError.correction 的形态分类
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit51-shape.mts
 *
 * 口径声明（本脚本的判据，全部可复现）：
 *  - 数据源：src/data/huntCases.ts 的 huntCases[].errors[]（唯一含 HuntError.correction 的集合）
 *  - 不掺入 spot 的 answer、不掺入 bothRight 的 wrong（它们不是 HuntError.correction，
 *    形态口径不同，混在一起会把「单句」当成「单catch」）
 *  - 分类互斥，按下列优先级逐个判断，命中即停：
 *      P1 与原词同   ：trim 后 === original.trim()（无操作）
 *      P2 括号式     ：以「（」或「(」开头且以「）」或「)」结尾
 *      P3 去掉X      ：以「去掉」或「删除」开头（不带括号，带括号的已被 P2 拿走）
 *      P4 多词       ：按空格切 ≥ 2 段
 *      P5 单词替换   ：其余（单段）
 */
import { huntCases } from "../../src/data/huntCases";
import type { HuntError } from "../../src/types";

type Shape = "P5-单词替换" | "P4-多词" | "P3-去掉X" | "P2-括号式" | "P1-与原词同";
const ORDER: Shape[] = ["P5-单词替换", "P4-多词", "P3-去掉X", "P2-括号式", "P1-与原词同"];

function classify(e: HuntError): Shape {
  const c = (e.correction ?? "").trim();
  const o = (e.original ?? "").trim();
  if (c === o) return "P1-与原词同";
  if (/^[（(]/.test(c) && /[）)]$/.test(c)) return "P2-括号式";
  if (/^(去掉|删除)/.test(c)) return "P3-去掉X";
  if (c.split(/\s+/).filter(Boolean).length >= 2) return "P4-多词";
  return "P5-单词替换";
}

const tally: Record<Shape, number> = { "P5-单词替换": 0, "P4-多词": 0, "P3-去掉X": 0, "P2-括号式": 0, "P1-与原词同": 0 };
const samples: Record<Shape, string[]> = { "P5-单词替换": [], "P4-多词": [], "P3-去掉X": [], "P2-括号式": [], "P1-与原词同": [] };
let total = 0, caseCount = huntCases.length;
const perCase: number[] = [];

for (const hc of huntCases) {
  let n = 0;
  for (const e of hc.errors) {
    total += 1; n += 1;
    const s = classify(e);
    tally[s] += 1;
    if (samples[s].length < 8) samples[s].push(`${hc.id}#${e.tokenIndex} tag=${e.tag} orig="${e.original}" corr="${e.correction}"`);
  }
  perCase.push(n);
}
console.log(`案件数 ${caseCount}，错误条目总数 ${total}，平均每案 ${(total / caseCount).toFixed(2)}`);
console.log(`每案错误数分布：min=${Math.min(...perCase)} max=${Math.max(...perCase)}`);
console.log("\n════ 形态分类 ════");
for (const s of ORDER) {
  console.log(`\n[${s}] ${tally[s]}  (${((tally[s] / total) * 100).toFixed(1)}%)`);
  samples[s].forEach((x) => console.log("    " + x));
}
const sum = ORDER.reduce((a, s) => a + tally[s], 0);
console.log(`\n互斥性自检：五类合计 ${sum} / 总数 ${total} → ${sum === total ? "✓ 全域覆盖且互斥" : "✗ 有重叠或遗漏"}`);

// 单独看：括号式的全部取值（只有 13 条，全列）
console.log("\n\n════ 括号式 13 条全列 ════");
let bi = 0;
for (const hc of huntCases) for (const e of hc.errors) {
  if (classify(e) !== "P2-括号式") continue;
  bi += 1;
  console.log(`${String(bi).padStart(2)}. ${hc.id}#${e.tokenIndex} tag=${e.tag} orig="${e.original}" corr="${e.correction}"`);
}

// 去掉X 的全部取值
console.log("\n\n════ 去掉X 全列 ════");
let ri = 0;
for (const hc of huntCases) for (const e of hc.errors) {
  if (classify(e) !== "P3-去掉X") continue;
  ri += 1;
  console.log(`${String(ri).padStart(2)}. ${hc.id}#${e.tokenIndex} tag=${e.tag} orig="${e.original}" corr="${e.correction}"`);
}
