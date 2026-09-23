/**
 * s12：决定性核查 —— 「补词型」错卡（correct = wrong 里**插入**一个词）应该把划线划在哪？
 *   用全库存量卡的态度来判定 L38 card[6] 是否异常（而不是靠我个人的规范判断）。
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";

const toks = (s: string) => s.trim().replace(/\s+/g, " ").replace(/[.!?]+$/, "").split(" ");
const norm = (s: string) => s.trim().replace(/\s+/g, " ").replace(/[.!?]+$/, "").toLowerCase();
const bare = (s: string) => s.replace(/[^A-Za-z']/g, "").toLowerCase();

/** 判定 wrong → correct 的编辑类型 */
type Edit =
  | { kind: "替换"; from: string; to: string; at: number }
  | { kind: "补词"; inserted: string; at: number }
  | { kind: "删词"; deleted: string; at: number }
  | { kind: "多改"; n: number }
  | { kind: "等长多改"; n: number };
function classify(wrong: string, correct: string): Edit {
  const w = toks(wrong), k = toks(correct);
  if (w.length === k.length) {
    const diffs: number[] = [];
    for (let i = 0; i < w.length; i++) if (w[i] !== k[i]) diffs.push(i);
    if (diffs.length === 1) return { kind: "替换", from: w[diffs[0]], to: k[diffs[0]], at: diffs[0] };
    return { kind: "等长多改", n: diffs.length };
  }
  // 找最长公共前后缀，判断是插入还是删除
  let p = 0;
  while (p < Math.min(w.length, k.length) && w[p] === k[p]) p++;
  let s = 0;
  while (s < Math.min(w.length, k.length) - p && w[w.length - 1 - s] === k[k.length - 1 - s]) s++;
  const wMid = w.slice(p, w.length - s), kMid = k.slice(p, k.length - s);
  if (wMid.length === 0 && kMid.length === 1) return { kind: "补词", inserted: kMid[0], at: p };
  if (wMid.length === 1 && kMid.length === 0) return { kind: "删词", deleted: wMid[0], at: p };
  return { kind: "多改", n: Math.max(wMid.length, kMid.length) };
}

console.log("════════════════════════════════════════════════════════════════");
console.log("s12-A · 全库错卡按编辑类型分布（含两类：标词卡 / 整句卡）");
console.log("════════════════════════════════════════════════════════════════");
const rows: { lesson: number; idx: number; edit: Edit; mark: string | null; bothRight: boolean; wrong: string; correct: string; why: string }[] = [];
for (const l of grammarLessons) {
  for (const [i, c] of (l.contrast ?? []).entries()) {
    rows.push({ lesson: l.number, idx: i, edit: classify(c.wrong, c.correct), mark: c.wrongMark ?? null, bothRight: !!c.bothRight, wrong: c.wrong, correct: c.correct, why: c.whyZh });
  }
}
const errCards = rows.filter((r) => !r.bothRight);
const byEdit = new Map<string, number>();
for (const r of errCards) byEdit.set(r.edit.kind, (byEdit.get(r.edit.kind) ?? 0) + 1);
console.log(`  错卡（非双正解）共 ${errCards.length} 张：`);
for (const [k, v] of [...byEdit.entries()].sort((a, b) => b[1] - a[1])) console.log(`     ${k.padEnd(10)} ${v}`);

console.log("\n════════════════════════════════════════════════════════════════");
console.log("s12-B · ⭐「补词型」错卡的划线落点分布（这是 L38 card[6] 的同类）");
console.log("════════════════════════════════════════════════════════════════");
const insertions = errCards.filter((r) => r.edit.kind === "补词");
console.log(`  补词型错卡共 ${insertions.length} 张`);
const whereMark: Record<string, number> = { 无划线: 0, 划在被补词本身: 0, 划在补词位置的左右邻词: 0, 划在别处: 0 };
const examples: Record<string, string[]> = { 无划线: [], 划在被补词本身: [], 划在补词位置的左右邻词: [], 划在别处: [] };
for (const r of insertions) {
  if (!r.mark) { whereMark["无划线"]++; examples["无划线"].push(`L${r.lesson}[${r.idx}] wrong=${JSON.stringify(r.wrong)} correct=${JSON.stringify(r.correct)}`); continue; }
  const e = r.edit as { kind: "补词"; inserted: string; at: number };
  const w = toks(r.wrong);
  const markB = bare(r.mark);
  const lastBefore = e.at - 1 >= 0 ? bare(w[e.at - 1]) : "";
  const firstAfter = e.at < w.length ? bare(w[e.at]) : "";
  const insertedB = bare(e.inserted);
  const slotsInMark = r.mark.trim().split(/\s+/).map(bare);
  if (slotsInMark.includes(insertedB)) { whereMark["划在被补词本身"]++; examples["划在被补词本身"].push(`L${r.lesson}[${r.idx}] 补词=${JSON.stringify(e.inserted)} 划线=${JSON.stringify(r.mark)}`); }
  else if (markB === lastBefore || markB === firstAfter) { whereMark["划在补词位置的左右邻词"]++; examples["划在补词位置的左右邻词"].push(`L${r.lesson}[${r.idx}] 补词=${JSON.stringify(e.inserted)} 划线=${JSON.stringify(r.mark)} | ${JSON.stringify(r.wrong)} → ${JSON.stringify(r.correct)} | why="${r.why.slice(0, 70)}"`); }
  else { whereMark["划在别处"]++; examples["划在别处"].push(`L${r.lesson}[${r.idx}] 补词=${JSON.stringify(e.inserted)} 划线=${JSON.stringify(r.mark)} | ${JSON.stringify(r.wrong)} → ${JSON.stringify(r.correct)} | why="${r.why.slice(0, 70)}"`); }
}
for (const [k, v] of Object.entries(whereMark)) {
  console.log(`     ${k.padEnd(22)} ${v}`);
  for (const s of examples[k].slice(0, 12)) console.log(`        · ${s}`);
  if (examples[k].length > 12) console.log(`        …（余 ${examples[k].length - 12} 条）`);
}

console.log("\n════════════════════════════════════════════════════════════════");
console.log("s12-C · L38 card[6] 在该分布里的位置");
console.log("════════════════════════════════════════════════════════════════");
const l38 = grammarLessons.find((l) => l.number === 38)!;
for (const idx of [6, 7]) {
  const c = l38.contrast![idx];
  const e = classify(c.wrong, c.correct);
  console.log(`  contrast[${idx}]  bothRight=${!!c.bothRight}  编辑类型=${e.kind}  ${JSON.stringify(e)}`);
  console.log(`       wrong   = ${JSON.stringify(c.wrong)}`);
  console.log(`       correct = ${JSON.stringify(c.correct)}`);
  console.log(`       wrongMark = ${JSON.stringify(c.wrongMark ?? null)}`);
}
console.log(`\n  ⇒ card[6] 是「补词型」（要把 to 插进 said 与 me 之间），却把划线划在了 ${JSON.stringify(l38.contrast![6].wrongMark)}；`);
console.log(`     按上面 s12-B 的存量态度，补词型要么不划线（整句卡），要么划在补词位置周围；`);
console.log(`     划在「被改动的动词」上会让用户以为问题在动词的**形状**。`);

console.log("\n════════════════════════════════════════════════════════════════");
console.log("s12-D · ⭐⭐ L38 内部：同一中文意图「她说她会来」的两种待遇");
console.log("════════════════════════════════════════════════════════════════");
const g0 = l38.guided![0];
const c7 = l38.contrast![7];
console.log(`  guided[0]（${g0.kind}）：题干「${g0.promptZh}」`);
console.log(`       渲染成：[ ___ ] ${g0.after}  选项 ${JSON.stringify(g0.options)}  答案 ${JSON.stringify(g0.answer)}`);
console.log(`       ⇒ 选 ${JSON.stringify(g0.options![2])} 会被判**错**，得到的句子是 "${g0.options![2]} ${g0.after}"`);
console.log(`\n  contrast[7]（双正解）：${JSON.stringify(c7.wrong)} 与 ${JSON.stringify(c7.correct)} 都被判**对**`);
console.log(`       提示语（页面渲染用）：挑一句你更顺眼的——今天这组有惊喜`);
console.log(`\n  ⇒ 同一个过去形状 said，在 guided[0] 里被拒、在 contrast[7] 里被祝福。`);
console.log(`     两处的差别只有「to me」：`);
console.log(`       guided[0] 拒绝  →  "She said she will come."`);
console.log(`       contrast[7] 接受 →  "She said to me she will come."`);
console.log(`     而 card[6] 又把 said 划掉（wrongMark="said"），它要说的是「少了 to」。`);
console.log(`\n  ⇒ 三处叠加后，用户对 said 收到三条互相拉扯的信号：`);
console.log(`       ①（card 6）said 被划掉 = 这个地方有问题`);
console.log(`       ②（card 7）said 出现的句子对 = 可以用`);
console.log(`       ③（guided 0）said 当选项被判错 = 不可以用`);

console.log("\n════════════════════════════════════════════════════════════════");
console.log("s12-E · 全库还有没有别的课，对同一形状同时给出「拒/允许」？");
console.log("════════════════════════════════════════════════════════════════");
const conflicts: string[] = [];
for (const l of grammarLessons) {
  const blessed = new Set<string>();
  const B = (t?: string | null) => { if (t) blessed.add(norm(t)); };
  B(l.targetSentence); B(l.dialogueEn);
  for (const d of l.dialogue ?? []) B(d.en);
  for (const e of l.examples) B(e.en);
  for (const v of l.variants ?? []) B(v.en);
  for (const s of l.sceneSwings ?? []) B(s.en);
  for (const c of l.contrast ?? []) { B(c.correct); if (c.bothRight) B(c.wrong); }
  for (const g of l.guided) if (g.kind !== "spot") B(g.answer);
  for (const p of l.practice) B(p.answer);
  B(l.recall?.answer);
  for (const [i, g] of l.guided.entries()) {
    if (g.kind !== "choose" || !g.options) continue;
    for (const o of g.options) {
      if (o === g.answer) continue;
      // 该干扰项与课内某个「被祝福句」只差一个后缀词（如 +to me / -to me）
      for (const b of blessed) {
        const oFull = norm(`${o} ${g.after ?? ""}`).replace(/[.!?]+$/, "");
        if (!oFull || oFull === b) continue;
        const ow = oFull.split(" "), bw = b.split(" ");
        // 只关心：干扰项句子与祝福句词数差 ≤2 且除新增词外一致
        if (Math.abs(ow.length - bw.length) <= 2 && (b.includes(...ow) || ow.every((x) => b.split(" ").includes(x)))) {
          const extra = bw.filter((x) => !ow.includes(x));
          if (extra.length <= 2 && extra.length > 0 && extra.every((x) => /^(to|me|to me)$/.test(x) || x.length <= 3)) {
            conflicts.push(`L${l.number}「${l.title}」guided[${i}] 干扰项「${oFull}」被判错，但课内祝福句「${b}」只多出 ${JSON.stringify(extra)}`);
          }
        }
      }
    }
  }
}
console.log(`  命中 ${conflicts.length} 处：`);
for (const s of [...new Set(conflicts)]) console.log(`  • ${s}`);
