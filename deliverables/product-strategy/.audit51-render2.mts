/** 上批复核①（精化）：把 27 张「新旧落点不同」按原因分两类 */
import { grammarLessons } from "../../src/data/grammarLessons";
import { locateMarkedTokens } from "../../src/services/grammarBoostService";
const cleanWord = (w: string) => w.replace(/[^\p{L}\p{N}'’-]/gu, "");
function splitTokens(s: string) {
  const parts = s.split(/(\s+)/);
  const idx: number[] = [];
  parts.forEach((t, i) => { if (!/^\s+$/.test(t) && t) idx.push(i); });
  return { parts, idx };
}
let insideWord = 0, wrongWord = 0, sameWord = 0;
const A: string[] = [], B: string[] = [];
for (const lesson of grammarLessons) {
  (lesson.contrast ?? []).forEach((c, index) => {
    if (c.bothRight) return;
    const mark = (c.wrongMark ?? "").trim();
    if (!mark) return;
    const { parts, idx } = splitTokens(c.wrong);
    const wordList = idx.map((i) => parts[i]);
    const newHits = locateMarkedTokens(wordList, mark, c.correct);
    const newTok = newHits.length ? idx[newHits[0]] : null;
    // 旧法：整串 indexOf + 字符位置 → token
    const at = c.wrong.indexOf(mark);
    if (at < 0) return;                       // 旧法未命中，不算「错位」
    let cursor = 0, oldTok: number | null = null;
    for (let i = 0; i < parts.length; i++) {
      const next = cursor + parts[i].length;
      if (at >= cursor && at < next) { oldTok = /^\s+$/.test(parts[i]) ? null : i; break; }
      cursor = next;
    }
    if (oldTok === newTok) return;            // 落点一致
    const label = `L${lesson.number} ${lesson.id}[${index}] mark="${mark}" | 错句: ${c.wrong} | 正确: ${c.correct}`;
    // 分类：旧法命中串是否恰好等于某个完整词？
    const oldText = oldTok === null ? "" : parts[oldTok];
    const wholeWord = cleanWord(oldText).toLowerCase() === cleanWord(mark).toLowerCase();
    if (wholeWord) { wrongWord += 1; B.push(`${label}\n     旧 ${JSON.stringify(oldText)} → 新 ${newTok === null ? "未命中" : JSON.stringify(parts[newTok])}`); }
    else { insideWord += 1; A.push(`${label}\n     旧 ${JSON.stringify(oldText)}（命中串 "${mark}" 落在词内部）→ 新 ${newTok === null ? "未命中" : JSON.stringify(parts[newTok])}`); }
  });
}
console.log(`A. 旧法把划线划进「别的单词内部」（mark 不是整词）: ${insideWord} 张`);
A.forEach((s) => console.log("   • " + s));
console.log(`\nB. 旧法落在整词，但落错了词（mark 是整词 / 多词标注取错位置）: ${wrongWord} 张`);
B.forEach((s) => console.log("   • " + s));
console.log(`\nA+B = ${insideWord + wrongWord} 张；A 单独 = ${insideWord} 张（对应「14 张删除线错位」口径）`);
