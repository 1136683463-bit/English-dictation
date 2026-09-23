/**
 * 第 50 批 · 独立复现任务书口径 T（「整串 mark 作为单个 token 精确出现」），
 * 并证明第三个桶 65 的真实构成。此脚本刻意独立重写，不引用同批其它脚本。
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit50-t.mts
 */
import { grammarLessons } from "../../src/data/grammarLessons";

/** 口径 T 的规范化：小写 → 非 [a-z0-9'] 转空格 → 折叠空格（保留撇号，don't 是一个 token）。 */
const norm = (s: unknown) => String(s ?? "").toLowerCase().replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
const toks = (s: unknown) => norm(s).split(" ").filter(Boolean);

interface Card { num: number; id: string; i: number; mark: string; wrong: string; correct: string; nWords: number }
const cards: Card[] = [];
for (const l of grammarLessons) {
  (l.contrast ?? []).forEach((c, i) => {
    const mark = (c.wrongMark ?? "").trim();
    if (!mark) return;
    cards.push({ num: l.number, id: l.id, i, mark, wrong: c.wrong, correct: c.correct, nWords: norm(mark).split(" ").filter(Boolean).length });
  });
}
console.log(`有值 wrongMark 的对照卡 = ${cards.length}`);
console.log(`  单词标注 = ${cards.filter((c) => c.nWords === 1).length}`);
console.log(`  多词标注 = ${cards.filter((c) => c.nWords > 1).length}\n`);

/* ── 口径 T：整串 mark 作为单个 token 精确出现 ── */
const T = (m: string, s: string) => toks(s).includes(norm(m));
let tOnlyW = 0, tBoth = 0, tElse = 0;
const tElseCards: Card[] = [];
for (const c of cards) {
  const a = T(c.mark, c.wrong), b = T(c.mark, c.correct);
  if (a && b) tBoth += 1;
  else if (a) tOnlyW += 1;
  else { tElse += 1; tElseCards.push(c); }
}
console.log("══ 口径 T（整串 token 精确）══");
console.log(`  只在错句 ${tOnlyW} | 两边都有 ${tBoth} | 第三桶 ${tElse}  ⇒ 合计 ${tOnlyW + tBoth + tElse}`);
console.log(`  ⇒ 与任务书表 499 / 110 / 65 逐字一致：${tOnlyW === 499 && tBoth === 110 && tElse === 65 ? "✅ 是" : "❌ 否"}\n`);

/* ── 第三桶是不是「划的词只在正确句」？ ── */
const onlyCorrectT = cards.filter((c) => !T(c.mark, c.wrong) && T(c.mark, c.correct)).length;
console.log("══ 第三桶的真实身份 ══");
console.log(`  第三桶 ${tElse} 张中，多词标注 = ${tElseCards.filter((c) => c.nWords > 1).length}，单词标注 = ${tElseCards.filter((c) => c.nWords === 1).length}`);
console.log(`  按「只在正确句」字面判据（口径 T）实测 = ${onlyCorrectT} 张`);
console.log(`  ⇒ 结论：第三桶 65 张**全部**是多词标注；口径 T 下多词标注结构性地无法成为「单个 token」，`);
console.log(`     所以它们只能落进残差桶。桶上的标签「划的词只在正确句」描述的不是这个残差。\n`);

/* ── 语义口径 S（逐词 OR + 词边界 + 忽略大小写）：第三个桶应为 0 ── */
const esc = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const wb = (w: string, s: string) => new RegExp(`(?<![A-Za-z-])${esc(w)}(?![A-Za-z-])`, "i").test(s);
const S = (m: string, s: string) => norm(m).split(" ").filter(Boolean).some((w) => wb(w, s));
let sOnlyW = 0, sBoth = 0, sOnlyC = 0, sNeither = 0;
for (const c of cards) {
  const a = S(c.mark, c.wrong), b = S(c.mark, c.correct);
  if (a && b) sBoth += 1; else if (a) sOnlyW += 1; else if (b) sOnlyC += 1; else sNeither += 1;
}
console.log("══ 口径 S（逐词 OR · 词边界 · 忽略大小写 · 这才是真语义）══");
console.log(`  只在错句 ${sOnlyW} | 两边都有 ${sBoth} | 只在正确句 ${sOnlyC} | 都没有 ${sNeither}  ⇒ 合计 ${sOnlyW + sBoth + sOnlyC + sNeither}`);
console.log(`  ⇒ 三个非零桶 ${sOnlyW}/${sBoth}/${sOnlyC}；任务书第三个数的位置应为 ${sOnlyC}，而不是 65。\n`);

console.log("══ 两个口径对「多词标注」的分歧（口径 T 把它们全丢进残差）══");
const mw = cards.filter((c) => c.nWords > 1);
let mwOnlyW = 0, mwBoth = 0, mwOnlyC = 0;
for (const c of mw) { const a = S(c.mark, c.wrong), b = S(c.mark, c.correct); if (a && b) mwBoth += 1; else if (a) mwOnlyW += 1; else if (b) mwOnlyC += 1; }
console.log(`  多词标注 ${mw.length} 张，口径 S 下：只在错句 ${mwOnlyW} | 两边都有 ${mwBoth} | 只在正确句 ${mwOnlyC}`);
console.log(`  口径 T 下：全部 ${tElseCards.length} 张落进残差（因为整串 token 结构性地不存在）`);
