/**
 * 第 50 批 · 交叉表核对：① 标注词命中删除集？ × ② 是否有插入？
 * 两个划分都得到 580 / 89，需确认是真巧合还是脚本把两个量算成了同一个。
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit50-cross.mts
 */
import { grammarLessons } from "../../src/data/grammarLessons";

const norm = (s: unknown) => String(s ?? "").toLowerCase().replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
const toks = (s: unknown) => norm(s).split(" ").filter(Boolean);
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

const cross: Record<string, number> = {};
const ex: Record<string, string[]> = {};
let total = 0;
for (const l of grammarLessons) {
  (l.contrast ?? []).forEach((c, i) => {
    const mark = (c.wrongMark ?? "").trim();
    if (!mark) return;
    total += 1;
    const { D, I } = editScript(toks(c.wrong), toks(c.correct));
    const pool = [...D];
    let hitD = 0;
    for (const mw of toks(mark)) { const at = pool.indexOf(mw); if (at >= 0) { hitD += 1; pool.splice(at, 1); } }
    const role = hitD > 0 ? "命中删除集" : "位置锚点";
    const ins = I.length > 0 ? "有插入" : "无插入(纯删除)";
    const k = `${role} × ${ins}`;
    cross[k] = (cross[k] ?? 0) + 1;
    (ex[k] ??= []).push(`L${l.number} ${l.id}[${i}] mark="${mark}" D=[${D.join(" ")}] I=[${I.join(" ")}]  ❌"${c.wrong}"  ✅"${c.correct}"`);
  });
}
console.log(`有值 wrongMark 对照卡 = ${total}\n`);
console.log("══ 交叉表：标注词角色 × 是否有插入 ══");
for (const [k, v] of Object.entries(cross).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(30)} ${v}`);
console.log("\n⇒ 若「命中删除集 × 无插入」= 0，说明两个划分正好重合（都是 580/89）——");
console.log("   原因是：只要标注词命中删除集，LCS 回溯就把该卡判成「替换型」（D 与 I 同时非空）；");
console.log("   而纯删除卡（D 非空、I 空）的标注词全部落在**保留下来的那个词**上（成对冲突的另一半）。");
console.log("   两个划分数值相同，但**判据不同源**：一个看「词在句里出现几次」，一个看「词在编辑里干什么」。\n");
for (const [k, v] of Object.entries(cross).sort((a, b) => b[1] - a[1])) {
  console.log(`── ${k}（${v}）样例 ──`);
  ex[k].slice(0, 4).forEach((s) => console.log("   " + s));
}
