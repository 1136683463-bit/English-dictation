/**
 * 第 51 批 · 上批成果复核 ①：渲染侧「14 张卡删除线归位」
 * 独立复现口径：对全库 contrast 卡，分别用
 *   旧法 = 裸 indexOf 子串匹配（在整句里找 mark，取第一个字符位置 → 落在哪个 token）
 *   新法 = locateMarkedTokens(wordList, mark, correct)
 * 定位，统计两者落点不同的卡数。只读，不改源码。
 */
import { grammarLessons } from "../../src/data/grammarLessons";
import { locateMarkedTokens } from "../../src/services/grammarBoostService";

const cleanWord = (w: string) => w.replace(/[^\p{L}\p{N}'’-]/gu, "");

/** 旧法：在整句字符串里 indexOf(mark)，再把字符位置换算成 token 下标 */
function oldLocate(sentence: string, mark: string): number | null {
  const charAt = sentence.indexOf(mark);           // 区分大小写的裸子串匹配
  if (charAt < 0) return null;
  // 把句子按「词 + 非词」切分，定位字符落在哪个词 token
  const tokens = sentence.split(/(\s+)/);
  let cursor = 0;
  for (let i = 0; i < tokens.length; i++) {
    const next = cursor + tokens[i].length;
    if (charAt >= cursor && charAt < next) return /^\s+$/.test(tokens[i]) ? null : i;
    cursor = next;
  }
  return null;
}
function newLocate(sentence: string, mark: string, correct: string): number | null {
  const tokens = sentence.split(/(\s+)/);
  const wordIndexes: number[] = [];
  tokens.forEach((t, i) => { if (!/^\s+$/.test(t) && t) wordIndexes.push(i); });
  const wordList = wordIndexes.map((i) => tokens[i]);
  const hits = locateMarkedTokens(wordList, mark, correct);
  if (hits.length === 0) return null;
  return wordIndexes[hits[0]];
}

let cards = 0, withMark = 0, skippedBothRight = 0, noMark = 0;
const mismatches: string[] = [];
const markInWordInterior: string[] = [];
for (const lesson of grammarLessons) {
  (lesson.contrast ?? []).forEach((c, index) => {
    cards += 1;
    if (c.bothRight) { skippedBothRight += 1; return; }
    const mark = (c.wrongMark ?? "").trim();
    if (!mark) { noMark += 1; return; }
    withMark += 1;
    const o = oldLocate(c.wrong, mark);
    const n = newLocate(c.wrong, mark, c.correct);
    if (o !== n) {
      const tokens = c.wrong.split(/(\s+)/);
      mismatches.push(
        `L${lesson.number} ${lesson.id}[${index}] mark="${mark}"\n` +
        `      错句: ${c.wrong}\n      正确: ${c.correct}\n` +
        `      旧法 token[${o}]=${o === null ? "未命中" : JSON.stringify(tokens[o])}  →  新法 token[${n}]=${n === null ? "未命中" : JSON.stringify(tokens[n])}`
      );
    }
    // 旧法落在「词内部」的证据：indexOf 命中的字符前后是字母（子串而非整词）
    const at = c.wrong.indexOf(mark);
    if (at >= 0) {
      const before = c.wrong[at - 1] ?? "", after = c.wrong[at + mark.length] ?? "";
      if (/[A-Za-z]/.test(before) || /[A-Za-z]/.test(after)) {
        markInWordInterior.push(`L${lesson.number} ${lesson.id}[${index}] mark="${mark}" in "${c.wrong}" (前='${before}' 后='${after}')`);
      }
    }
  });
}
console.log(`contrast 卡总数 ${cards}`);
console.log(`  有 wrongMark ${withMark}，bothRight 跳过 ${skippedBothRight}，无 mark ${noMark}`);
console.log(`\n════ 新旧定位落点不同的卡：${mismatches.length} 张 ════`);
mismatches.forEach((m) => console.log("  • " + m));
console.log(`\n════ 旧法命中「词内部」的（子串匹配证据）：${markInWordInterior.length} 张 ════`);
markInWordInterior.forEach((m) => console.log("  • " + m));
