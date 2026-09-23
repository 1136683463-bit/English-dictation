/**
 * 第 50 批 · 渲染层核查：GrammarLessonPage 的 markedWrongNode 用
 *   item.wrong.includes(mark) / indexOf(mark)
 * 做「题面划词」——这是**子串**语义，不是词边界语义。
 * 若 mark 是短词（a / is / to），indexOf 可能落在别的单词内部 ⇒ 划错位置。
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit50-render.mts
 */
import { grammarLessons } from "../../src/data/grammarLessons";

let total = 0, ok = 0, substringHit = 0, notFound = 0;
const subHits: string[] = [], notFounds: string[] = [];

for (const l of grammarLessons) {
  (l.contrast ?? []).forEach((c, i) => {
    const mark = (c.wrongMark ?? "").trim();
    if (!mark) return;
    total += 1;
    const wrong = c.wrong;
    // 复刻 UI 逻辑
    if (!wrong.includes(mark)) { notFound += 1; notFounds.push(`${l.id}(L${l.number})[${i}] mark="${mark}" wrong="${wrong}"`); return; }
    const at = wrong.indexOf(mark);
    // 该位置是否是「整词」？前后字符不应是字母
    const before = at > 0 ? wrong[at - 1] : "";
    const after = wrong[at + mark.length] ?? "";
    const isLetter = (ch: string) => /[A-Za-z]/.test(ch);
    if (isLetter(before) || isLetter(after)) {
      substringHit += 1;
      const shown = wrong.slice(at, at + mark.length);
      subHits.push(`${l.id}(L${l.number})[${i}] mark="${mark}" → 划在 "${shown}"（第 ${at} 位），上下文 "…${wrong.slice(Math.max(0, at - 8), at + mark.length + 8)}…"\n      ❌ "${wrong}"\n      ✅ "${c.correct}"`);
    } else ok += 1;
  });
}

console.log(`有 wrongMark 的对照卡: ${total}`);
console.log(`  UI 会划在正确词位（前后非字母）: ${ok}`);
console.log(`  UI 会划在单词内部（子串误命中）: ${substringHit}`);
console.log(`  mark 在 wrong 里完全找不到（该卡不会划任何线）: ${notFound}`);
console.log("\n子串误命中明细：");
subHits.forEach((s) => console.log("  " + s));
console.log("\n找不到明细：");
notFounds.forEach((s) => console.log("  " + s));

/* 顺带核对：wrongMark 是「正确句里的词」时，UI 在 wrong 里照样能找到（多出来的位置） */
console.log("\n\n════ 补充：mark 在 wrong 里是「缺失位」时 UI 的呈现 ════");
let markInWrong = 0, markNotInWrong = 0;
const notIn: string[] = [];
for (const l of grammarLessons) {
  (l.contrast ?? []).forEach((c, i) => {
    const mark = (c.wrongMark ?? "").trim();
    if (!mark || c.bothRight) return;
    if (c.wrong.includes(mark)) markInWrong += 1;
    else { markNotInWrong += 1; notIn.push(`${l.id}(L${l.number})[${i}] mark="${mark}" wrong="${c.wrong}" correct="${c.correct}"`); }
  });
}
console.log(`真错卡：mark 字面出现在 wrong 里 = ${markInWrong}；不出现 = ${markNotInWrong}`);
console.log("不出现的（UI 分支 markedWrongNode 会退回整句不划线，但仍渲染「缺了一块」）：");
notIn.slice(0, 15).forEach((s) => console.log("  " + s));
