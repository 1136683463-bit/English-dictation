/**
 * s20：诚实核查 —— L38 contrast[6] 到底算不算「异常」？
 *
 * s19-A 的分类只覆盖**纯补词型**（等长前后缀 + 单插入），card[6] 是「替换+补词」两改动，
 * 不在那个集合里。为避免过度断言，本脚本专门检查**多改动卡**的划线惯例：
 *   ① 多改动卡共有多少张？其中有划线的多少张？
 *   ② 有划线的多改动卡里，划线是否落在**第一个改动点**上？还是落在讲解所指的那个点？
 *   ③ 由此判定 card[6] 是「遵守惯例」还是「偏离惯例」。
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";

const toks = (s: string) => s.trim().replace(/\s+/g, " ").replace(/[.!?]+$/, "").split(" ");
const bare = (s: string) => s.replace(/[^A-Za-z' ]/g, "").toLowerCase().trim();

/** 用编辑距离回溯，找出全部改动点（替换/插入/删除），返回改动位置（在 wrong 的坐标里） */
function diffPoints(w: string[], k: string[]): { wIdx: number; kind: string; from: string; to: string }[] {
  // DP 编辑距离 + 回溯
  const n = w.length, m = k.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (w[i - 1] === k[j - 1] ? 0 : 1));
  }
  const out: { wIdx: number; kind: string; from: string; to: string }[] = [];
  let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + (w[i - 1] === k[j - 1] ? 0 : 1)) {
      if (w[i - 1] !== k[j - 1]) out.push({ wIdx: i - 1, kind: "替换", from: w[i - 1], to: k[j - 1] });
      i--; j--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) { out.push({ wIdx: i, kind: "插入", from: "∅", to: k[j - 1] }); j--; }
    else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) { out.push({ wIdx: i - 1, kind: "删除", from: w[i - 1], to: "∅" }); i--; }
    else break;
  }
  return out.reverse();
}

interface Row { lesson: number; idx: number; nChanges: number; points: ReturnType<typeof diffPoints>; mark: string; wrong: string; correct: string; why: string; hitPoints: string[] }
const rows: Row[] = [];
for (const l of grammarLessons) {
  for (const [i, c] of (l.contrast ?? []).entries()) {
    if (c.bothRight || !c.wrongMark) continue;
    const w = toks(c.wrong), k = toks(c.correct);
    const pts = diffPoints(w, k);
    if (pts.length < 2) continue;
    const mB = bare(c.wrongMark);
    // 划线是否命中了某个改动点（改动的 from/to，或插入点的邻词）
    const hit: string[] = [];
    for (const p of pts) {
      const label = p.kind === "插入" ? `插入"${p.to}"@${p.wIdx}` : `${p.from}→${p.to}@${p.wIdx}`;
      if (bare(p.from) === mB || bare(p.to) === mB) { hit.push(label); continue; }
      if (p.kind === "插入") {
        const left = bare(w[p.wIdx - 1] ?? ""), right = bare(w[p.wIdx] ?? "");
        if (mB === left || mB === right || mB.split(" ").includes(left) || mB.split(" ").includes(right)) hit.push(label);
      }
    }
    rows.push({ lesson: l.number, idx: i, nChanges: pts.length, points: pts, mark: c.wrongMark, wrong: c.wrong, correct: c.correct, why: c.whyZh, hitPoints: hit });
  }
}
console.log("════════════════════════════════════════════════════════════════");
console.log("s20-A · 多改动（≥2 处）且有划线的错卡");
console.log("════════════════════════════════════════════════════════════════");
console.log(`  共 ${rows.length} 张`);
const noHit = rows.filter((r) => r.hitPoints.length === 0);
console.log(`  划线**落在某改动点上**：${rows.length - noHit.length} 张`);
console.log(`  划线**不落在任何改动点上**：${noHit.length} 张`);
console.log("\n  ── 划线不落在任何改动点上的（+ L38[6] 若是其中之一即为同类）──");
for (const r of noHit) {
  console.log(`\n  L${r.lesson} contrast[${r.idx}]  划线=${JSON.stringify(r.mark)}  改动数=${r.nChanges}`);
  console.log(`       wrong  = ${JSON.stringify(r.wrong)}`);
  console.log(`       correct= ${JSON.stringify(r.correct)}`);
  console.log(`       改动点 = ${r.points.map((p) => p.kind === "插入" ? `插入"${p.to}"@${p.wIdx}` : `${p.from}→${p.to}@${p.wIdx}`).join(" , ")}`);
  console.log(`       whyZh  = ${r.why.slice(0, 110)}`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s20-B · L38 contrast[6] 在这张表里的定位");
console.log("════════════════════════════════════════════════════════════════");
const l38row = rows.find((r) => r.lesson === 38 && r.idx === 6);
if (l38row) {
  console.log(`  ✅ L38 contrast[6] 属于「多改动 + 有划线」集合（改动数 ${l38row.nChanges}）`);
  console.log(`     划线 = ${JSON.stringify(l38row.mark)}`);
  console.log(`     改动点 = ${l38row.points.map((p) => p.kind === "插入" ? `插入"${p.to}"@${p.wIdx}` : `${p.from}→${p.to}@${p.wIdx}`).join(" , ")}`);
  console.log(`     划线命中的改动点：${l38row.hitPoints.length ? l38row.hitPoints.join(", ") : "❌ 无"}`);
  console.log(`     ⇒ 判定：${l38row.hitPoints.length === 0 ? "⚠️ **偏离惯例**（划线不在任何改动点上）" : "✅ 遵守惯例"}`);
} else {
  console.log("  L38 contrast[6] 不在多改动集合里（说明我的 diff 把它算成单改动）");
  const c = grammarLessons.find((l) => l.number === 38)!.contrast![6];
  console.log(`      wrong=${JSON.stringify(c.wrong)}  correct=${JSON.stringify(c.correct)}`);
  console.log(`      diff = ${JSON.stringify(diffPoints(toks(c.wrong), toks(c.correct)))}`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s20-C · 结论汇总");
console.log("════════════════════════════════════════════════════════════════");
console.log(`  多改动+有划线的错卡共 ${rows.length} 张。`);
console.log(`  其中划线确实落在某改动点上的 ${rows.length - noHit.length} 张（${((rows.length - noHit.length) / rows.length * 100).toFixed(0)}%）；`);
console.log(`  不落在任何改动点上的 ${noHit.length} 张：${noHit.map((r) => `L${r.lesson}[${r.idx}]`).join(", ") || "（无）"}`);
if (l38row) {
  const pct = (rows.length - noHit.length) / rows.length * 100;
  console.log(`\n  ⇒ L38 contrast[6] 落在这 ${noHit.length} 张少数派里。`);
  console.log(`     与它同类的：${noHit.filter((r) => !(r.lesson === 38 && r.idx === 6)).map((r) => `L${r.lesson}[${r.idx}]`).join(", ") || "（只有它自己）"}`);
}
