/**
 * 第 50 批 · 第四类：按「标注词在编辑里的角色」切（不是按「出现在哪一侧」切）。
 *
 * 判据（LCS 编辑脚本，自行实现，不引用其它脚本）：
 *   把 wrong 与 correct 各自规整成 token 序列，求 LCS，得到
 *     D = 从 wrong 里删掉才能变成 correct 的词
 *     I = 为了得到 correct 需要补进去的词
 *   然后看 wrongMark 落在哪一边：
 *     · mark 全部落在 D ⇒ 「划词=被删/被换的那个词」——用户点它、划它都成立
 *     · mark 与 D 无交集 ⇒ 「划词=位置锚点」——被划的词自己没错，问题是这个位置缺东西
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit50-axis.mts
 */
import { grammarLessons } from "../../src/data/grammarLessons";

const norm = (s: unknown) =>
  String(s ?? "").toLowerCase().replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
const toks = (s: unknown) => norm(s).split(" ").filter(Boolean);

/** 最长公共子序列 + 回溯，得到删除集与插入集。 */
const editScript = (a: string[], b: string[]) => {
  const n = a.length, m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i -= 1)
    for (let j = m - 1; j >= 0; j -= 1)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const D: string[] = [], I: string[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { i += 1; j += 1; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { D.push(a[i]); i += 1; }
    else { I.push(b[j]); j += 1; }
  }
  while (i < n) { D.push(a[i]); i += 1; }
  while (j < m) { I.push(b[j]); j += 1; }
  return { D, I };
};

interface Card { num: number; id: string; i: number; mark: string; wrong: string; correct: string }
const cards: Card[] = [];
for (const l of grammarLessons) {
  (l.contrast ?? []).forEach((c, i) => {
    const mark = (c.wrongMark ?? "").trim();
    if (!mark) return;
    cards.push({ num: l.number, id: l.id, i, mark, wrong: c.wrong, correct: c.correct });
  });
}

type Role = "被删/被换的词" | "位置锚点";
let rDelWord = 0, rAnchor = 0;
const byInsert: Record<string, number> = { "有插入": 0, "纯删除": 0 };
let noDiff = 0;
const exAnchor: string[] = [], exDel: string[] = [];

for (const c of cards) {
  const w = toks(c.wrong), r = toks(c.correct);
  const { D, I } = editScript(w, r);
  if (D.length === 0 && I.length === 0) { noDiff += 1; continue; }
  const markWords = toks(c.mark);
  // 标注词是否命中「删除集」——按多重集计数，避免同形词重复时误判
  const dPool = [...D];
  let hitD = 0;
  for (const mw of markWords) {
    const at = dPool.indexOf(mw);
    if (at >= 0) { hitD += 1; dPool.splice(at, 1); }
  }
  const role: Role = hitD > 0 ? "被删/被换的词" : "位置锚点";
  if (role === "被删/被换的词") rDelWord += 1; else rAnchor += 1;
  byInsert[I.length > 0 ? "有插入" : "纯删除"] += 1;
  if (role === "位置锚点" && exAnchor.length < 10)
    exAnchor.push(`L${c.num} ${c.id}[${c.i}] mark="${c.mark}"  D=[${D.join(" ")}] I=[${I.join(" ")}]\n        ❌"${c.wrong}"\n        ✅"${c.correct}"`);
  if (role === "被删/被换的词" && exDel.length < 5)
    exDel.push(`L${c.num} ${c.id}[${c.i}] mark="${c.mark}"  D=[${D.join(" ")}] I=[${I.join(" ")}]\n        ❌"${c.wrong}"\n        ✅"${c.correct}"`);
}

console.log(`有值 wrongMark 的对照卡 = ${cards.length}（无差异 ${noDiff} 张，不计入）\n`);
console.log("══ 第四类（真正的结构性轴）：标注词在编辑里演什么角色 ══");
console.log(`  ① 被删/被换的词（划它就是划错处本身）: ${rDelWord} 张`);
console.log(`  ② 位置锚点（划它只是指出「这儿缺东西」）: ${rAnchor} 张`);
console.log(`  ⇒ 合计 ${rDelWord + rAnchor}\n`);
console.log(`  再按「是否有插入」交叉：${JSON.stringify(byInsert)}`);

console.log("\n════ ② 位置锚点类的全部样例（这才是「三类」漏掉的那一类）════");
exAnchor.forEach((s) => console.log("  " + s));
console.log("\n════ ① 被删/被换的词 样例 ════");
exDel.forEach((s) => console.log("  " + s));

console.log("\n════ 与任务书三类的交叉核对 ════");
console.log("  任务书三类（按「词出现在哪一侧」切）与上面两类（按「词演什么角色」切）");
console.log("  是**两个不同的轴**，不可互相还原：");
console.log("   · 「只在错句」的卡里也有位置锚点（如 L79 mark=\"next\"：C=I 是 next to，next 两边都有）");
console.log("   · 「两边都有」的卡里也有被删/被换的词（同形词恰好也出现在正确句里）");
console.log("  ⇒ 所以任务书的三类**不足以**描述语义；补上「角色」这一轴后才闭合。");
