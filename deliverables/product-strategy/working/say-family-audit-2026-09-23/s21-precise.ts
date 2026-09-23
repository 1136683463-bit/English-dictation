/**
 * s21：⭐ 精确定罪 —— 把「划线指控 A，讲解却在讲 B」这一条机械化
 *
 * 背景修正（诚实起见）：
 *   s20 发现 card[6] 的划线 "said" **确实**落在改动点 said→says 上，
 *   所以不能笼统说「划线不在改动点上」。真正的缺陷更精确：
 *
 *   一张多改动卡，划线落在**改动点 X** 上，但讲解 whyZh **一个字都没讲 X**，
 *   讲的是**另一个改动点 Y**。
 *   ⇒ 用户被划线指向 X，却只被告知 Y 的道理；X 甚至可能是对的。
 *
 * 判据：对每张多改动 + 有划线的错卡——
 *   X = 划线所落的那个改动点（用编辑距离取，要求唯一命中）
 *   Y = 讲解里被**明确引用**的改动点（讲解中出现的英文词，与改动点的 from/to 匹配）
 *   若 Y 非空且 X ∉ Y → 指控与讲解错位，记为一条「错位」。
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";

const toks = (s: string) => s.trim().replace(/\s+/g, " ").replace(/[.!?]+$/, "").split(" ");
const bare = (s: string) => s.replace(/[^A-Za-z' ]/g, "").toLowerCase().trim();

interface Pt { wIdx: number; kind: "替换" | "插入" | "删除"; from: string; to: string; label: string }
function diffPoints(w: string[], k: string[]): Pt[] {
  const n = w.length, m = k.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++)
    dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (w[i - 1] === k[j - 1] ? 0 : 1));
  const out: Pt[] = [];
  let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + (w[i - 1] === k[j - 1] ? 0 : 1)) {
      if (w[i - 1] !== k[j - 1]) out.push({ wIdx: i - 1, kind: "替换", from: w[i - 1], to: k[j - 1], label: `${w[i - 1]}→${k[j - 1]}` });
      i--; j--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) { out.push({ wIdx: i, kind: "插入", from: "∅", to: k[j - 1], label: `+${k[j - 1]}` }); j--; }
    else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) { out.push({ wIdx: i - 1, kind: "删除", from: w[i - 1], to: "∅", label: `−${w[i - 1]}` }); i--; }
    else break;
  }
  return out.reverse();
}

interface Out { lesson: number; idx: number; mark: string; X: number; Y: number; pts: Pt[]; wrong: string; correct: string; why: string; markHits: number[]; whyMentions: number[] }
const out: Out[] = [];
let multiMarked = 0;
for (const l of grammarLessons) {
  for (const [i, c] of (l.contrast ?? []).entries()) {
    if (c.bothRight || !c.wrongMark) continue;
    const w = toks(c.wrong), k = toks(c.correct);
    const pts = diffPoints(w, k);
    if (pts.length < 2) continue;
    multiMarked++;
    const mB = bare(c.wrongMark);
    const mSlots = c.wrongMark.trim().split(/\s+/).map(bare);
    // X：划线命中的改动点（含插入点的左右邻词）
    const markHits: number[] = [];
    pts.forEach((p, pi) => {
      const cands: string[] = [bare(p.from), bare(p.to)];
      if (p.kind === "插入") { cands.push(bare(w[p.wIdx - 1] ?? ""), bare(w[p.wIdx] ?? "")); }
      if (cands.some((x) => x && (x === mB || mSlots.includes(x)))) markHits.push(pi);
    });
    // Y：讲解里明确引用的改动点（from 或 to 出现在 whyZh 里，词边界）
    const whyMentions: number[] = [];
    pts.forEach((p, pi) => {
      const cands: string[] = [];
      if (p.kind !== "插入") cands.push(bare(p.from));
      if (p.kind !== "删除") cands.push(bare(p.to));
      if (cands.some((x) => x && new RegExp(`(?<![A-Za-z-])${x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z-])`, "i").test(c.whyZh))) whyMentions.push(pi);
    });
    out.push({ lesson: l.number, idx: i, mark: c.wrongMark, X: markHits.length, Y: whyMentions.length, pts, wrong: c.wrong, correct: c.correct, why: c.whyZh, markHits, whyMentions });
  }
}

console.log("════════════════════════════════════════════════════════════════");
console.log("s21-A · 多改动 + 有划线 的错卡：X（划线所落改动点）vs Y（讲解所讲改动点）");
console.log("════════════════════════════════════════════════════════════════");
console.log(`  多改动有划线卡共 ${multiMarked} 张`);
const mismatch = out.filter((r) => r.markHits.length > 0 && r.whyMentions.length > 0 && !r.markHits.some((x) => r.whyMentions.includes(x)));
console.log(`  其中「划线落在改动点 A、讲解只讲改动点 B（A≠B）」的：**${mismatch.length} 张**（${(mismatch.length / multiMarked * 100).toFixed(1)}%）`);
console.log(`  划线命中多个改动点（歧义，不判）：${out.filter((r) => r.markHits.length > 1).length} 张`);
console.log(`  划线不命中任何改动点：${out.filter((r) => r.markHits.length === 0).length} 张`);
console.log(`  讲解没引用任何改动点：${out.filter((r) => r.whyMentions.length === 0).length} 张`);

console.log("\n  ── 「错位」逐张（按课号）──");
for (const r of mismatch.sort((a, b) => a.lesson - b.lesson)) {
  console.log(`\n  L${r.lesson} contrast[${r.idx}]`);
  console.log(`       划线 = ${JSON.stringify(r.mark)}  → 落在改动点 ${r.markHits.map((i) => r.pts[i].label).join(", ")}`);
  console.log(`       讲解只讲改动点 ${r.whyMentions.map((i) => r.pts[i].label).join(", ")}`);
  console.log(`       全部改动点：${r.pts.map((p) => `${p.label}@${p.wIdx}`).join(" , ")}`);
  console.log(`       wrong  = ${JSON.stringify(r.wrong)}`);
  console.log(`       correct= ${JSON.stringify(r.correct)}`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s21-B · ⭐ L38 contrast[6] 的定位");
console.log("════════════════════════════════════════════════════════════════");
const r38 = out.find((r) => r.lesson === 38 && r.idx === 6);
if (r38) {
  console.log(`  划线 = ${JSON.stringify(r38.mark)}`);
  console.log(`  改动点 = ${r38.pts.map((p) => `${p.label}@${p.wIdx}`).join(" , ")}`);
  console.log(`  划线落在：${r38.markHits.map((i) => r38.pts[i].label).join(", ")}`);
  console.log(`  讲解只讲：${r38.whyMentions.length ? r38.whyMentions.map((i) => r38.pts[i].label).join(", ") : "（没引用任何改动点）"}`);
  const isMismatch = mismatch.some((r) => r.lesson === 38 && r.idx === 6);
  console.log(`  ⇒ 判定：${isMismatch ? "⚠️ **属于「错位」**——划线指控 said→says，讲解只讲 +to" : "✅ 不算错位"}`);
  console.log(`\n  为什么这一处比别的错位更值得修（三条叠加）：`);
  console.log(`     ① 全课只有这张卡把 said 划掉；`);
  console.log(`     ② 同课 contrast[7]（双正解）把 "She said to me she will come." 声明为**正确**；`);
  console.log(`     ③ 本课主题是「转述」，而 said 是 say 的**合法昨天版**（Cambridge 逐字：`);
  console.log(`        "The past simple of say is said, the past simple of tell is told"）`);
  console.log(`     ⇒ 用户拿到的最强信号是「said 这个词有问题」，而这与事实相反。`);
} else {
  console.log("  L38 contrast[6] 不在该集合（ps.length<2?）——列出它的 diff：");
  const c = grammarLessons.find((l) => l.number === 38)!.contrast![6];
  console.log(JSON.stringify(diffPoints(toks(c.wrong), toks(c.correct)), null, 2));
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s21-C · 全库「划线词」是**动词过去形**且该形在同课被祝福 的课（最窄的判据）");
console.log("════════════════════════════════════════════════════════════════");
const PASTISH = /(ed|ght|ought|aught|ew|ore|ade|oke|ote|ang|ung|am|an|at|et|elt|ept|ent|old|elt|aid|old|slept|sat|met|got|gave|knew|grew|flew|drew|wore|tore|bore|swore|woke|broke|spoke|stole|chose|rose|drove|wrote|rode|hid|bit|hung|dug|won|ran|began|sang|swam|drank|shrank|sank|rang|clung|flung|stung|swung|wrung|hung)$/i;
const narrow: string[] = [];
for (const l of grammarLessons) {
  const blessedForms = new Set<string>();
  for (const c of l.contrast ?? []) {
    if (c.bothRight) for (const t of toks(c.wrong)) blessedForms.add(bare(t));
    for (const t of toks(c.correct)) blessedForms.add(bare(t));
  }
  for (const t of toks(l.targetSentence)) blessedForms.add(bare(t));
  for (const e of l.examples) for (const t of toks(e.en)) blessedForms.add(bare(t));
  for (const [i, c] of (l.contrast ?? []).entries()) {
    if (c.bothRight || !c.wrongMark) continue;
    const m = bare(c.wrongMark);
    if (!m || m.includes(" ")) continue;
    if (!PASTISH.test(m)) continue;                       // 只看「像过去形」的划线词
    if (blessedForms.has(m)) narrow.push(`L${l.number}「${l.title}」contrast[${i}] 划线 ${JSON.stringify(c.wrongMark)}（像过去形）而同课另有句子含同一形式被声明为正确｜wrong=${JSON.stringify(c.wrong)}｜why="${c.whyZh.slice(0, 80)}"`);
  }
}
console.log(`  命中 ${narrow.length} 处：`);
for (const s of narrow) console.log(`  • ${s}`);
