/**
 * 第 50 批 · 精确复刻 UI 的划线逻辑（GrammarLessonPage.tsx:241-255），
 * 逐张输出「用户实际看到的划线文本」。
 *
 *   const at = item.wrong.indexOf(mark);
 *   <span line-through>{mark}</span>  放在 wrong.slice(0,at) 与 wrong.slice(at+mark.length) 之间
 *
 * 关键：indexOf 是**子串**语义。mark="a" 在 "I have a apple." 里第一次出现是
 * "have" 中间那个 a ⇒ 删除线会划在 have 里面。
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit50-uirender.mts
 */
import { grammarLessons } from "../../src/data/grammarLessons";

const render = (wrong: string, mark: string): string => {
  const at = wrong.indexOf(mark);
  if (at < 0) return wrong;
  return `${wrong.slice(0, at)}〔${mark}〕${wrong.slice(at + mark.length)}`;
};
const wordOf = (s: string, at: number, len: number): string => {
  let a = at, b = at + len;
  while (a > 0 && /[A-Za-z']/.test(s[a - 1])) a -= 1;
  while (b < s.length && /[A-Za-z']/.test(s[b])) b += 1;
  return s.slice(a, b);
};

interface Bad { id: string; num: number; i: number; mark: string; wrong: string; correct: string; rendered: string; destroyedWord: string }
const bad: Bad[] = [];
let total = 0;

for (const l of grammarLessons) {
  (l.contrast ?? []).forEach((c, i) => {
    const mark = (c.wrongMark ?? "").trim();
    if (!mark) return;
    total += 1;
    const at = c.wrong.indexOf(mark);
    if (at < 0) return;
    const before = at > 0 ? c.wrong[at - 1] : "";
    const after = c.wrong[at + mark.length] ?? "";
    const isLetter = (ch: string) => /[A-Za-z']/.test(ch);
    if (isLetter(before) || isLetter(after)) {
      bad.push({ id: l.id, num: l.number, i, mark, wrong: c.wrong, correct: c.correct, rendered: render(c.wrong, mark), destroyedWord: wordOf(c.wrong, at, mark.length) });
    }
  });
}

console.log(`════ UI 划线错位（删除线落在单词内部）════`);
console.log(`有 wrongMark 的对照卡 ${total} 张；其中 UI 划线错位 ${bad.length} 张\n`);
for (const b of bad) {
  console.log(`L${b.num} ${b.id}[${b.i}]  mark="${b.mark}"`);
  console.log(`   用户看到：${b.rendered}`);
  console.log(`   正确句　：${b.correct}`);
  console.log(`   被划掉的是「${b.destroyedWord}」这个完整词里的一段（不是标注想指的那个词）\n`);
}
console.log(`⇒ ${bad.length} 张卡的删除线落在别的单词内部；这 ${bad.length} 张全部是「a / an / is / he / go」这类\n   会出现在其他单词里的短词。`);

/* 反向：正确的那些，删除线是否落在标注想指的位置 */
console.log("\n\n════ 对照：正确的划线（前 6 例）════");
let good = 0; const goodEx: string[] = [];
for (const l of grammarLessons) {
  (l.contrast ?? []).forEach((c, i) => {
    const mark = (c.wrongMark ?? "").trim();
    if (!mark) return;
    const at = c.wrong.indexOf(mark);
    if (at < 0) return;
    const before = at > 0 ? c.wrong[at - 1] : "";
    const after = c.wrong[at + mark.length] ?? "";
    if (/[A-Za-z']/.test(before) || /[A-Za-z']/.test(after)) return;
    good += 1;
    if (goodEx.length < 6) goodEx.push(`L${l.number} ${l.id}[${i}] ${render(c.wrong, mark)}  →  ✅ ${c.correct}`);
  });
}
console.log(`划线位置正确的 ${good} 张。样例：`);
goodEx.forEach((s) => console.log("   " + s));
