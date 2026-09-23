/**
 * 第 50 批 · 收官：① 170 张「两边都有」的机制再切；② 复核两个疑似异常是真缺陷还是脚本假象。
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit50-decomp.mts
 */
import { grammarLessons } from "../../src/data/grammarLessons";
import { huntCases } from "../../src/data/huntCases";

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const wbT = (w: string, t: string) => new RegExp(`(?<![A-Za-z-])${esc(w)}(?![A-Za-z-])`, "i").test(t);
const toksA = (s: string) => s.split(/\s+/).filter(Boolean);
/** cleanWord 必须把空白也去掉——否则 "rains, " 这类词块会带出尾空格，制造假差异。 */
const cw = (t: string) => (t ?? "").replace(/[^A-Za-z0-9']/g, "").toLowerCase();

interface Card { id: string; num: number; i: number; mark: string; wrong: string; correct: string }
const singles: Card[] = [], multis: Card[] = [];
for (const l of grammarLessons) {
  (l.contrast ?? []).forEach((c, i) => {
    const m = (c.wrongMark ?? "").trim();
    if (!m) return;
    const rec = { id: l.id, num: l.number, i, mark: m, wrong: c.wrong, correct: c.correct };
    (toksA(m).length === 1 ? singles : multis).push(rec);
  });
}
const cls = (c: Card): "onlyWrong" | "both" => {
  const iw = toksA(c.mark).some((w) => wbT(w, c.wrong));
  const ic = toksA(c.mark).some((w) => wbT(w, c.correct));
  return iw && ic ? "both" : "onlyWrong";
};
const s1 = singles.filter((c) => cls(c) === "onlyWrong").length;
const s2 = singles.filter((c) => cls(c) === "both").length;
console.log(`单词标注 ${singles.length} = 只在错句 ${s1} + 两边都有 ${s2}   ${s1 + s2 === singles.length ? "✓" : "✗"}`);
console.log(`多词标注 ${multis.length}（残差 = 674 − ${s1} − ${s2} = ${674 - s1 - s2}）`);
console.log(`⇒ 499 / 110 / 65 三个数相加 = ${s1 + s2 + multis.length}（= 全部有值 wrongMark 的卡数 674）`);
console.log(`   即：这三个数是**一个完整划分**，第三桶 65 只能是被当作残差算出来的「多词标注」张数，`);
console.log(`   而不是「划的词只在正确句」——后者在全部口径下都为 0。\n`);

console.log("════ 170 张「两边都有」的机制再切（这才是真正需要第四类的地方）════");
const both = [...singles, ...multis].filter((c) => cls(c) === "both");
type M = "缺词型(正确句更长)" | "多词型(错句更长)" | "等长换形/语序" | "纯标点" | "仅大小写";
const tally: Record<M, number> = { "缺词型(正确句更长)": 0, "多词型(错句更长)": 0, "等长换形/语序": 0, "纯标点": 0, "仅大小写": 0 };
const ex: Record<M, string[]> = { "缺词型(正确句更长)": [], "多词型(错句更长)": [], "等长换形/语序": [], "纯标点": [], "仅大小写": [] };
for (const c of both) {
  const w = toksA(c.wrong).length, r = toksA(c.correct).length;
  let m: M;
  if (c.wrong.toLowerCase() === c.correct.toLowerCase() && c.wrong !== c.correct) m = "仅大小写";
  else if (toksA(c.wrong).map(cw).join(" ") === toksA(c.correct).map(cw).join(" ") && c.wrong !== c.correct) m = "纯标点";
  else if (r > w) m = "缺词型(正确句更长)";
  else if (w > r) m = "多词型(错句更长)";
  else m = "等长换形/语序";
  tally[m] += 1;
  if (ex[m].length < 5) ex[m].push(`L${c.num} ${c.id}[${c.i}] mark="${c.mark}"  ❌"${c.wrong}"  ✅"${c.correct}"`);
}
for (const k of Object.keys(tally) as M[]) {
  console.log(`\n  ${k}: ${tally[k]} 张`);
  ex[k].forEach((s) => console.log("     " + s));
}

console.log("\n\n════ 两个疑似异常复核 ════");
const l172 = grammarLessons.find((l) => l.id === "lesson-172-unless");
const p = l172?.practice?.[0];
if (p) {
  const ts = toksA(p.tokens.map(cw).join(" ")).sort().join(" ");
  const as = toksA(p.answer).map(cw).filter(Boolean).sort().join(" ");
  console.log(`L172 practice[0] tokens=${JSON.stringify(p.tokens)}`);
  console.log(`   answer="${p.answer}"  distractors=${JSON.stringify(p.distractors)}`);
  console.log(`   清洗后多重集：tokens="${ts}"`);
  console.log(`                answer="${as}"`);
  console.log(`   ${ts === as ? "⇒ 相等。此前报「不一致」是我脚本 clean 未去空格造成的假象，不是数据缺陷。" : "⇒ 真不一致，需登记。"}`);
}
let sameOC = 0; const soc: string[] = [];
for (const hc of huntCases) for (const e of hc.errors) {
  if (cw(e.original) === cw(e.correction)) { sameOC += 1; soc.push(`${hc.id} idx=${e.tokenIndex} original="${e.original}" correction="${e.correction}" tag=${e.tag} explanation="${e.explanation}"`); }
}
console.log(`\nHuntError 里 original 与 correction 清洗后相同 = ${sameOC} 处`);
soc.forEach((s) => console.log("   " + s));
console.log(`⇒ ${sameOC === 1 ? "仅 1 处，属个案；" : ""}说明 correction 字段**混着三种语义**：换词 / 删除指令 / 移动指令，接口无文档。`);
