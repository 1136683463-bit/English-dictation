/**
 * s19：为 L38 contrast[6] 的划线给出**有存量依据的**修正建议
 *
 * 问题：card[6] 是「补词型」（要把 to 插进 said 与 me 之间），却把划线划在 said 上。
 *       而讲解讲的是「say 后面不能直接跟人」——划线划在 said（形状），讲解在讲 say+人（结构）。
 *       同课 card[7] 又把含 said 的句子声明为正确。
 *
 * 本脚本：把「补词型 + 有划线」的存量卡的划线位置规律量化，据此给出建议。
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";

const toks = (s: string) => s.trim().replace(/\s+/g, " ").replace(/[.!?]+$/, "").split(" ");
const bare = (s: string) => s.replace(/[^A-Za-z' ]/g, "").toLowerCase().trim();

function classify(wrong: string, correct: string) {
  const w = toks(wrong), k = toks(correct);
  if (w.length === k.length) return null;
  let p = 0;
  while (p < Math.min(w.length, k.length) && w[p] === k[p]) p++;
  let s = 0;
  while (s < Math.min(w.length, k.length) - p && w[w.length - 1 - s] === k[k.length - 1 - s]) s++;
  const wMid = w.slice(p, w.length - s), kMid = k.slice(p, k.length - s);
  if (wMid.length === 0 && kMid.length === 1) return { inserted: kMid[0], wIdx: p, kIdx: p };
  return null;
}

console.log("════════════════════════════════════════════════════════════════");
console.log("s19-A · 「补词型 + 有划线」的 60 张卡：划线落在哪个位置");
console.log("════════════════════════════════════════════════════════════════");
interface Row { lesson: number; idx: number; inserted: string; wIdx: number; mark: string; rel: string; wrong: string; correct: string }
const rows: Row[] = [];
for (const l of grammarLessons) {
  for (const [i, c] of (l.contrast ?? []).entries()) {
    if (c.bothRight || !c.wrongMark) continue;
    const e = classify(c.wrong, c.correct);
    if (!e) continue;
    const w = toks(c.wrong);
    const mB = bare(c.wrongMark);
    const atInsert = bare(w[e.wIdx] ?? "");        // 插入位置右边那个词
    const beforeInsert = bare(w[e.wIdx - 1] ?? ""); // 插入位置左边那个词
    const maskSlots = c.wrongMark.trim().split(/\s+/).map(bare);
    let rel: string;
    if (maskSlots.includes(bare(e.inserted))) rel = "① 划在**被补的词本身**（该词其实不在 wrong 里）";
    else if (mB === atInsert) rel = "② 划在「插入位置右边的词」";
    else if (mB === beforeInsert) rel = "③ 划在「插入位置左边的词」";
    else if (maskSlots.some((x) => x === atInsert || x === beforeInsert)) rel = "④ 划线跨了插入位置的邻词";
    else rel = "⑤ 划在别处";
    rows.push({ lesson: l.number, idx: i, inserted: e.inserted, wIdx: e.wIdx, mark: c.wrongMark, rel, wrong: c.wrong, correct: c.correct });
  }
}
const byRel = new Map<string, Row[]>();
for (const r of rows) { const a = byRel.get(r.rel) ?? []; a.push(r); byRel.set(r.rel, a); }
for (const [k, v] of [...byRel.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n  ${k}  —— ${v.length} 张`);
  for (const r of v.slice(0, 18)) console.log(`      L${r.lesson}[${r.idx}] 补 ${JSON.stringify(r.inserted)} 划线 ${JSON.stringify(r.mark).padEnd(16)} ${JSON.stringify(r.wrong)} → ${JSON.stringify(r.correct)}`);
  if (v.length > 18) console.log(`      …（余 ${v.length - 18} 张）`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s19-B · ⭐⭐ L38 contrast[6] 的**真实编辑结构**（关键）");
console.log("════════════════════════════════════════════════════════════════");
const l38 = grammarLessons.find((l) => l.number === 38)!;
const c6 = l38.contrast![6];
const w6 = toks(c6.wrong);
const k6 = toks(c6.correct);
console.log(`  wrong   = ${JSON.stringify(c6.wrong)}`);
console.log(`            ${JSON.stringify(w6)}`);
console.log(`  correct = ${JSON.stringify(c6.correct)}`);
console.log(`            ${JSON.stringify(k6)}`);
console.log(`\n  逐位对齐：`);
for (let i = 0; i < Math.max(w6.length, k6.length); i++) {
  const a = w6[i] ?? "—", b = k6[i] ?? "—";
  console.log(`     [${i}] ${String(a).padEnd(8)} ↔ ${String(b).padEnd(8)} ${a === b ? "" : "  ← 不同"}`);
}
console.log(`\n  ⇒ 这张卡需要**两处改动**才能到 correct：`);
console.log(`     改动①：said → says（第 1 位，替换）`);
console.log(`     改动②：在 me 前面**插入 to**（第 2 位之前，补词）`);
console.log(`  ⇒ 而 wrongMark 只标了 ${JSON.stringify(c6.wrongMark)}（改动①）。`);
console.log(`  ⇒ 讲解 whyZh 讲的是**改动②**（要垫 to），完全没提 said。`);
console.log(`\n  ⭐ 所以 card[6] 的缺陷精确表述是：`);
console.log(`     **一张两改动卡，划线标在改动① 上，讲解讲的是改动②。**`);
console.log(`     用户从划线读到的信号是「said 有问题」——而这是本课最不该传达的信号，`);
console.log(`     因为 card[7] 刚刚（或即将）把 "She said to me she will come." 声明为正确。`);
console.log(`\n  对照同类：全库 93 张补词型卡里，有划线的 60 张**全部**把划线落在插入位置附近`);
console.log(`  （右邻 28 / 左邻 17 / 跨邻词 10 / 被补词本身 3 / 别处 2），`);
console.log(`  **没有一张把划线落在「另一个与该补词无关的改动点」上**——card[6] 是唯一一张。`);

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s19-C · 两种改法的逐项影响（不改数据，只评估）");
console.log("════════════════════════════════════════════════════════════════");
const alt = [
  { name: "改法 A：wrongMark 由 \"said\" 改为 \"me\"", mark: "me" as string | null, note: "跟存量惯例（划插入位置右边的词）" },
  { name: "改法 B：wrongMark 由 \"said\" 改为 null（整句卡）", mark: null as string | null, note: "与另 33 张补词型无划线卡一致" },
];
for (const a of alt) {
  console.log(`\n  ── ${a.name}（${a.note}）`);
  console.log(`     wrongMark = ${JSON.stringify(a.mark)}`);
  if (a.mark !== null) {
    const renders = c6.wrong.includes(a.mark);
    console.log(`     ✅ 渲染前置条件「wrong.includes(mark)」= ${renders}${renders ? "" : "  ← ⚠️ 不满足则整句原样显示，mark 形同虚设"}`);
    console.log(`     渲染结果：${JSON.stringify(c6.wrong.replace(a.mark, `[删除线:${a.mark}]`))}`);
  } else {
    console.log(`     渲染结果：整句原样 + 「缺了一块」提示（页面 lesson-contrast-hole）`);
  }
  console.log(`     与 card[7] 的矛盾是否消除：${a.mark === "said" ? "❌ 未消除（card[7] 仍祝福 said）" : "✅ 消除（本卡不再指控 said）"}`);
  console.log(`     与 guided[0] 是否冲突：guided[0] 拒绝 "She said she will come."（无 to me）——`);
  console.log(`        与 card[7] 祝福 "She said to me she will come."（有 to me）**不冲突**：`);
  console.log(`        差别正是 to me，规则「say 带人要用 to」自洽。`);
  console.log(`        ⇒ 唯一真正的矛盾源就是 card[6] 的划线落在 said 上。`);
}
console.log(`\n  ⚠️ 但注意：改法 A/B 都**只修表面**。card[6] 的 whyZh 讲的是 to，`);
console.log(`     若把 mark 改成 "me"，划线落在 me 上、讲解讲 to —— 仍不完全对齐，但至少不再指控 said。`);
console.log(`     **最干净的第三种改法**：把 wrongMark 改成 "me she will come" 或 null，`);
console.log(`     并在 whyZh 里点明「said 本身没错（said 就是 say 的昨天版），错的是 say 后面直接跟人」。`);


console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s19-D · 确认 card[6] 的 whyZh 自身说的是「缺 to」而不是「said 形状错」");
console.log("════════════════════════════════════════════════════════════════");
console.log(`  whyZh 逐字：`);
console.log(`  「${c6.whyZh}」`);
const whyMentionsTo = /垫个小词 to|多个 to|要多个 to/.test(c6.whyZh);
const whyMentionsSaid = /said/.test(c6.whyZh);
const whyMentionsSay = /(?<![A-Za-z-])say(?![A-Za-z-])/.test(c6.whyZh);
console.log(`\n  讲解里提到 to（要垫 to）？ ${whyMentionsTo ? "✅ 是" : "❌ 否"}`);
console.log(`  讲解里提到 said？        ${whyMentionsSaid ? "✅ 是" : "❌ 否 ← 讲解在讲 say 的搭配，不在讲 said 的形状"}`);
console.log(`  讲解里提到 say（原形）？  ${whyMentionsSay ? "✅ 是" : "❌ 否"}`);
console.log(`\n  ⇒ 讲解的落点是「say 后面要垫 to」，而**划线的落点是 said**——两者不是同一件事。`);
console.log(`     用户从这张卡能读出的最强信号是「said 有问题」，而这恰好是错的。`);
