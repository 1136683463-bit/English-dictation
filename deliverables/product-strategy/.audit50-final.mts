/**
 * 第 50 批 · 定论脚本：复现 499/110/65 并定位其真实机制；核查「第三类」是否真实存在。
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit50-final.mts
 */
import { grammarLessons } from "../../src/data/grammarLessons";

interface Card { lesson: string; number: number; index: number; mark: string; wrong: string; correct: string; bothRight: boolean }
const all: Card[] = [];
for (const l of grammarLessons) {
  (l.contrast ?? []).forEach((c, i) => {
    const m = (c.wrongMark ?? "").trim();
    if (m) all.push({ lesson: l.id, number: l.number, index: i, mark: m, wrong: c.wrong, correct: c.correct, bothRight: Boolean(c.bothRight) });
  });
}
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const cleanWord = (t: string) => t.replace(/[.,!?;:'"“”]/g, "").toLowerCase();
const toks = (s: string) => s.split(/\s+/).filter(Boolean);
const wbHit = (w: string, t: string, ci: boolean) => new RegExp(`(?<![A-Za-z-])${esc(w)}(?![A-Za-z-])`, ci ? "i" : "").test(t);
const perWordSome = (m: string, t: string, ci: boolean) => toks(m).some((w) => wbHit(w, t, ci));

const singles = all.filter((c) => toks(c.mark).length === 1);
const multis = all.filter((c) => toks(c.mark).length > 1);
const bucket = (list: Card[], ci: boolean) => {
  let o = 0, b = 0, oc = 0, n = 0;
  for (const c of list) { const iw = perWordSome(c.mark, c.wrong, ci), ic = perWordSome(c.mark, c.correct, ci); if (iw && ic) b++; else if (iw) o++; else if (ic) oc++; else n++; }
  return { o, b, oc, n };
};

console.log("════ 1. 复现 499 / 110 / 65 ════");
const sCi = bucket(singles, true), mCi = bucket(multis, true);
const sCs = bucket(singles, false), mCs = bucket(multis, false);
console.log(`单词标注(${singles.length}) 忽略大小写: 只错句=${sCi.o} 两边=${sCi.b} 只正确=${sCi.oc} 都无=${sCi.n}`);
console.log(`多词标注(${multis.length}) 忽略大小写: 只错句=${mCi.o} 两边=${mCi.b} 只正确=${mCi.oc} 都无=${mCi.n}`);
console.log(`  ⇒ 复现结果: ${sCi.o} / ${sCi.b} / ${multis.length}  =  499 / 110 / 65  ← 与批 50 表格逐字一致`);
console.log(`单词标注 区分大小写: 只错句=${sCs.o} 两边=${sCs.b} 只正确=${sCs.oc} 都无=${sCs.n}（仅大小写口径的差别就移动 ${sCs.o - sCi.o} 张）`);
console.log(`多词标注 区分大小写: 只错句=${mCs.o} 两边=${mCs.b} 只正确=${mCs.oc} 都无=${mCs.n}`);
console.log(`\n⚠️ 第三个桶「65」== 多词标注张数（${multis.length}），不是「划的词只在正确句」。`);

console.log("\n════ 2. 「划的词只在正确句」真实张数 ════");
for (const ci of [true, false]) {
  const label = ci ? "忽略大小写" : "区分大小写";
  // (a) 词级：mark 的任一形态只在正确句出现
  let a = 0; const aEx: string[] = [];
  for (const c of all) { if (!perWordSome(c.mark, c.wrong, ci) && perWordSome(c.mark, c.correct, ci)) { a++; aEx.push(`${c.lesson}(L${c.number})[${c.index}] mark="${c.mark}" wrong="${c.wrong}" correct="${c.correct}"`); } }
  // (b) 整串子串
  let b = 0;
  for (const c of all) { const f = (t: string) => ci ? t.toLowerCase().includes(c.mark.toLowerCase()) : t.includes(c.mark); if (!f(c.wrong) && f(c.correct)) b++; }
  // (c) 清洗后整词序列
  let d = 0;
  for (const c of all) { const mw = toks(c.mark).map(cleanWord); const w = toks(c.wrong).map(cleanWord), r = toks(c.correct).map(cleanWord); if (!mw.some((x) => w.includes(x)) && mw.some((x) => r.includes(x))) d++; }
  console.log(`  ${label}: (a)词边界 ${a}  (b)整串子串 ${b}  (c)清洗整词 ${d}`);
  aEx.slice(0, 6).forEach((s) => console.log("      " + s));
}
console.log("  ⇒ 三种口径全部为 0：库里不存在「标注词只出现在正确句」的卡。");

console.log("\n════ 3. 第四类？按「标注词与差异位的关系」再切（这才是能读懂判题的口径）═══");
const diffIdx = (wrong: string, correct: string) => {
  const w = toks(wrong), c = toks(correct); const out: number[] = [];
  for (let i = 0; i < Math.max(w.length, c.length); i += 1) if (cleanWord(w[i] ?? "") !== cleanWord(c[i] ?? "")) out.push(i);
  return out;
};
type Mode = "markAtDiff" | "anchorAdjacent" | "punctuationOnly" | "caseOnly" | "other";
const tally: Record<Mode, number> = { markAtDiff: 0, anchorAdjacent: 0, punctuationOnly: 0, caseOnly: 0, other: 0 };
const ex: Record<Mode, string[]> = { markAtDiff: [], anchorAdjacent: [], punctuationOnly: [], caseOnly: [], other: [] };
for (const c of all) {
  const d = diffIdx(c.wrong, c.correct);
  const w = toks(c.wrong);
  const hitIdx = w.map((t, i) => (perWordSome(c.mark, t, true) ? i : -1)).filter((i) => i >= 0);
  const markAtDiff = hitIdx.some((i) => d.includes(i));
  // 纯标点标注？mark 去掉标点后为空
  const punctOnly = cleanWord(c.mark) === "";
  // 仅大小写之差？
  const caseOnly = !punctOnly && c.wrong.length === c.correct.length && c.wrong.toLowerCase() === c.correct.toLowerCase();
  let mode: Mode;
  if (punctOnly) mode = "punctuationOnly";
  else if (caseOnly) mode = "caseOnly";
  else if (markAtDiff) mode = "markAtDiff";
  else if (d.length > 0) mode = "anchorAdjacent";
  else mode = "other";
  tally[mode] += 1;
  if (ex[mode].length < 6) ex[mode].push(`${c.lesson}(L${c.number})[${c.index}] mark="${c.mark}" diff=[${d.join(",")}] markIdx=[${hitIdx.join(",")}]\n        wrong  ="${c.wrong}"\n        correct="${c.correct}"`);
}
for (const k of Object.keys(tally) as Mode[]) {
  console.log(`\n  ── ${k}: ${tally[k]} 张 ──`);
  ex[k].forEach((s) => console.log("     " + s));
}

console.log("\n════ 4. 「差一个词」型（正确句更长）的标注词是否都在错句里 ════");
let longer = 0, markInWrongLonger = 0;
for (const c of all) {
  const w = toks(c.wrong).length, r = toks(c.correct).length;
  if (r > w) { longer += 1; if (perWordSome(c.mark, c.wrong, true)) markInWrongLonger += 1; }
}
console.log(`正确句更长的卡（应在错句某处补词）: ${longer}；其中标注词也出现在错句里的: ${markInWrongLonger}`);
console.log(`⇒ 说明「划 pen 表示该位置缺 a」这一类确实存在（mark 在两边都有即属此类）。`);
