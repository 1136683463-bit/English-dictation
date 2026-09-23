/** 复核：口径对账——为什么是 613 而不是 600，以及那 14 条大小写/标点修正的细分 */
import { huntCases } from "../../src/data/huntCases";
const N = (s: string) => s.replace(/[^A-Za-z0-9']/g, "").toLowerCase();
const CJK = /[\u4e00-\u9fff]/;
const all: { id: string; idx: number; o: string; c: string; tag: string }[] = [];
for (const hc of huntCases) for (const e of hc.errors) all.push({ id: hc.id, idx: e.tokenIndex, o: (e.original ?? "").trim(), c: (e.correction ?? "").trim(), tag: e.tag });

console.log("════ 口径对账 ════");
const singleWord = all.filter((x) => !CJK.test(x.c) && !/^[（(]/.test(x.c) && x.c.split(/\s+/).filter(Boolean).length === 1);
console.log(`A. 纯英文单词形态（不含中文、非括号式、单段）           ${singleWord.length}`);
const caseOnly = all.filter((x) => x.c.toLowerCase() === x.o.toLowerCase() && x.c !== x.o);
console.log(`B. 其中「忽略大小写与原词同」（协调者口径的『与原词同』）  ${caseOnly.length}  → 那么单词替换 = ${singleWord.length} - ${caseOnly.length} = ${singleWord.length - caseOnly.length}`);
console.log(`   协调者报的 613 = ${singleWord.length} - 1，即【只把这 1 条剔除】、另 13 条留在「单词替换」里`);
console.log(`   ⇒ 613 成立的前提是「与原词同」用【忽略大小写】判据；用【去标点归一】判据则会得到 14 条、单词替换降到 600。`);

console.log("\n════ 那 14 条「大小写/标点」修正的细分 ════");
const norm = (x: { c: string; o: string }) => N(x.c) === N(x.o) && x.c !== x.o;
const punct = all.filter((x) => norm(x) && !CJK.test(x.c));
const caseChg = punct.filter((x) => x.c.toLowerCase() !== x.o.toLowerCase());
const punctChg = punct.filter((x) => x.c.toLowerCase() === x.o.toLowerCase());
console.log(`① 纯大小写：${caseChg.length} 条`); caseChg.forEach((x) => console.log(`     ${x.id}#${x.idx} tag=${x.tag} "${x.o}" → "${x.c}"`));
console.log(`\n② 纯标点（补逗号 / 改句号）：${punctChg.length} 条`); punctChg.forEach((x) => console.log(`     ${x.id}#${x.idx} tag=${x.tag} "${x.o}" → "${x.c}"`));
// 细分：加逗号 vs 改句末标点
const comma = punctChg.filter((x) => x.c.replace(/[.,!?;:]+$/, "") === x.o.replace(/[.,!?;:]+$/, "") && /,$/.test(x.c));
const endMark = punctChg.filter((x) => /[.!?]$/.test(x.c) && !/,$/.test(x.c));
console.log(`\n   ②a 补句内逗号（run_on 型）：${comma.length} 条`);
console.log(`   ②b 改/补句末标点：${endMark.length} 条`);
endMark.forEach((x) => console.log(`        ${x.id}#${x.idx} tag=${x.tag} "${x.o}" → "${x.c}"`));
