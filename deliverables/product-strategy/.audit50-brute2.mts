/**
 * 第 50 批 · 更宽的约定网格 + 反解 499/110/65 的第三种可能。
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit50-brute2.mts
 */
import { grammarLessons } from "../../src/data/grammarLessons";

interface Card { lesson: string; number: number; index: number; mark: string; wrong: string; correct: string; bothRight: boolean }
const cards: Card[] = [];
for (const l of grammarLessons) {
  (l.contrast ?? []).forEach((c, i) => {
    const m = (c.wrongMark ?? "").trim();
    if (m) cards.push({ lesson: l.id, number: l.number, index: i, mark: m, wrong: c.wrong, correct: c.correct, bothRight: Boolean(c.bothRight) });
  });
}
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const cleanWord = (t: string) => t.replace(/[.,!?;:'"]/g, "").toLowerCase();
const words = (s: string) => s.split(/\s+/).filter(Boolean);
/** 逐位 diff 命中：mark 的任一「形态」是否落在与正确句不同的位。 */
const diffIdx = (wrong: string, correct: string) => {
  const w = words(wrong), c = words(correct);
  const out: number[] = [];
  for (let i = 0; i < Math.max(w.length, c.length); i += 1) if (cleanWord(w[i] ?? "") !== cleanWord(c[i] ?? "")) out.push(i);
  return out;
};

const total = cards.length;
const singles = cards.filter((c) => words(c.mark).length === 1);
const multis = cards.filter((c) => words(c.mark).length > 1);
console.log(`非空 wrongMark 卡总数 = ${total}；单词标注 = ${singles.length}；多词标注 = ${multis.length}`);
console.log(`单词/多词 合计校验：${singles.length + multis.length} === ${total}\n`);

type Cls = "onlyWrong" | "both" | "onlyCorrect" | "neither";
const run = (name: string, inW: (m: string, w: string) => boolean, inC: (m: string, c: string) => boolean) => {
  const t: Record<Cls, number> = { onlyWrong: 0, both: 0, onlyCorrect: 0, neither: 0 };
  for (const c of cards) {
    const iw = inW(c.mark, c.wrong), ic = inC(c.mark, c.correct);
    if (iw && ic) t.both += 1; else if (iw) t.onlyWrong += 1; else if (ic) t.onlyCorrect += 1; else t.neither += 1;
  }
  console.log(`${name.padEnd(52)} onlyWrong=${String(t.onlyWrong).padStart(4)} both=${String(t.both).padStart(4)} onlyCorrect=${String(t.onlyCorrect).padStart(4)} neither=${String(t.neither).padStart(4)}`);
  return t;
};
const wbWhole = (ci: boolean) => (m: string, t: string) => new RegExp(`(?<![A-Za-z-])${esc(m)}(?![A-Za-z-])`, ci ? "i" : "").test(t);
const subWhole = (ci: boolean) => (m: string, t: string) => ci ? t.toLowerCase().includes(m.toLowerCase()) : t.includes(m);
const wbPerWord = (agg: "some" | "every", ci: boolean) => (m: string, t: string) => {
  const ws = words(m);
  const f = (w: string) => new RegExp(`(?<![A-Za-z-])${esc(w)}(?![A-Za-z-])`, ci ? "i" : "").test(t);
  return agg === "some" ? ws.some(f) : ws.every(f);
};
const subPerWordCleaned = (agg: "some" | "every", ci: boolean) => (m: string, t: string) => {
  const ws = words(m).map(cleanWord);
  const tt = words(t).map(cleanWord);
  const f = (w: string) => tt.some((x) => (ci ? x === w : x === w));
  return agg === "some" ? ws.some(f) : ws.every(f);
};
/** 逐位 diff：mark 是否作为整体命中差异位。 */
const diffWhole = (m: string, wrong: string, correct: string) => {
  const d = diffIdx(wrong, correct);
  const w = words(wrong);
  const mw = words(m).map(cleanWord);
  return w.some((tk, i) => d.includes(i) && mw.includes(cleanWord(tk)));
};

console.log("── A 组：整串匹配 ────────────────────────────────────────────────");
run("整串·词边界·区分大小写", wbWhole(false), wbWhole(false));
run("整串·词边界·忽略大小写", wbWhole(true), wbWhole(true));
run("整串·子串·区分大小写", subWhole(false), subWhole(false));
run("整串·子串·忽略大小写", subWhole(true), subWhole(true));
console.log("\n── B 组：逐词匹配 ────────────────────────────────────────────────");
run("逐词 some·词边界·区分大小写", wbPerWord("some", false), wbPerWord("some", false));
run("逐词 some·词边界·忽略大小写", wbPerWord("some", true), wbPerWord("some", true));
run("逐词 every·词边界·区分大小写", wbPerWord("every", false), wbPerWord("every", false));
run("逐词 every·词边界·忽略大小写", wbPerWord("every", true), wbPerWord("every", true));
run("逐词 some·清洗后整词相等", subPerWordCleaned("some", true), subPerWordCleaned("some", true));
run("逐词 every·清洗后整词相等", subPerWordCleaned("every", true), subPerWordCleaned("every", true));
console.log("\n── C 组：混合（左侧 some / 右侧 every 等） ──────────────────────");
run("左 some / 右 every·词边界·忽略大小写", wbPerWord("some", true), wbPerWord("every", true));
run("左 every / 右 some·词边界·忽略大小写", wbPerWord("every", true), wbPerWord("some", true));
run("左 逐词some / 右 整串·忽略大小写", wbPerWord("some", true), wbWhole(true));
run("左 整串 / 右 逐词some·忽略大小写", wbWhole(true), wbPerWord("some", true));
console.log("\n── D 组：只统计「单词标注」子集（这就是 499/110 的来源） ──────");
const t1 = run("【仅单词标注】逐词·词边界·区分大小写", wbPerWord("some", false), wbPerWord("some", false));
const t2 = run("【仅单词标注】整串·词边界·区分大小写", wbWhole(false), wbWhole(false));

/* 分单/多词各自计数，验证 499 + 110 + 65 分解 */
const wbs = wbPerWord("some", false);
let sOnly = 0, sBoth = 0, sOnlyC = 0, sNone = 0, mOnly = 0, mBoth = 0, mOnlyC = 0, mNone = 0;
for (const c of singles) { const iw = wbs(c.mark, c.wrong), ic = wbs(c.mark, c.correct); if (iw && ic) sBoth++; else if (iw) sOnly++; else if (ic) sOnlyC++; else sNone++; }
for (const c of multis) { const iw = wbs(c.mark, c.wrong), ic = wbs(c.mark, c.correct); if (iw && ic) mBoth++; else if (iw) mOnly++; else if (ic) mOnlyC++; else mNone++; }
console.log(`\n【分解】单词标注: 只错句=${sOnly} 两边=${sBoth} 只正确=${sOnlyC} 都无=${sNone}（合计 ${sOnly + sBoth + sOnlyC + sNone}）`);
console.log(`【分解】多词标注: 只错句=${mOnly} 两边=${mBoth} 只正确=${mOnlyC} 都无=${mNone}（合计 ${mOnly + mBoth + mOnlyC + mNone}）`);
console.log(`\n⇒ 若把「多词标注」整体当作第三个桶：${sOnly} / ${sBoth} / ${mOnly + mBoth}  =  499 / 110 / ${mOnly + mBoth}`);
console.log(`⇒ 三个桶相加 = ${sOnly + sBoth + mOnly + mBoth}（应等于 ${total}）`);

console.log("\n── E 组：diff 口径（真正的「该换掉/该补」判据） ────────────────");
let dHit = 0, dMiss = 0;
for (const c of cards) { if (diffWhole(c.mark, c.wrong, c.correct)) dHit += 1; else dMiss += 1; }
console.log(`mark 命中逐位差异位的卡: ${dHit}；未命中: ${dMiss}`);

/* 未命中的多词标注里，mark 是否「只出现在正确句」 */
console.log("\n── F 组：多词标注中「整串只出现在正确句」的卡（第 65 桶的真实归属核查） ──");
let multiOnlyC = 0;
const mo: string[] = [];
for (const c of multis) { if (wbWhole(true)(c.mark, c.correct) && !wbWhole(true)(c.mark, c.wrong)) { multiOnlyC += 1; mo.push(`${c.lesson}(L${c.number})[${c.index}] mark="${c.mark}" wrong="${c.wrong}" correct="${c.correct}"`); } }
console.log(`多词标注中整串只在正确句出现的: ${multiOnlyC}`);
mo.slice(0, 12).forEach((s) => console.log("   " + s));
console.log("\n── G 组：全库「任何词的任何形态都只在正确句」的卡（真·第三类） ──");
let trueOnlyC = 0;
const toc: string[] = [];
const cleaned = (s: string) => words(s).map(cleanWord);
for (const c of cards) {
  const mw = words(c.mark).map(cleanWord);
  const w = cleaned(c.wrong), r = cleaned(c.correct);
  const inW = mw.some((x) => w.includes(x)), inC = mw.some((x) => r.includes(x));
  if (!inW && inC) { trueOnlyC += 1; toc.push(`${c.lesson}(L${c.number})[${c.index}] mark="${c.mark}" wrong="${c.wrong}" correct="${c.correct}"`); }
}
console.log(`真·第三类（划的词只在正确句）= ${trueOnlyC}`);
toc.slice(0, 10).forEach((s) => console.log("   " + s));
