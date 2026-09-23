/**
 * s09：同一课内的**自相矛盾**机械核查
 *
 * 判据 A（标记自我矛盾）：一张错卡把词 M 划线（wrongMark=M），
 *   但同一课里存在另一张卡/句把含 M 的句子声明为**正确**
 *   （contrast.correct / bothRight.wrong / targetSentence / examples / variants / …）。
 *   → 用户在同一课内看到「M 是错的」与「M 是对的」并存。
 *
 * 判据 B（干扰项其实是正确答案）：choose/replace 题的 options 里某个**非答案**选项
 *   与课内某正确句逐字相同（或与 targetSentence 相同）
 *   → 用户选了它被判错，但它其实是课内承认的正确句。
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";

const norm = (s: string) => s.trim().replace(/\s+/g, " ").replace(/[.!?]+$/, "").toLowerCase();
const bare = (s: string) => s.replace(/[^A-Za-z']/g, "").toLowerCase();
const wb = (w: string) => new RegExp(`(?<![A-Za-z-])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z-])`, "i");

interface SelfContra {
  lesson: number;
  cardIdx: number;
  mark: string;
  /** 该课内把含 mark 的句子声明为正确的槽位 */
  blessedAt: string[];
  wrong: string;
  correct: string;
}
const selfContra: SelfContra[] = [];

for (const l of grammarLessons) {
  // 该课的「被声明为正确」的句子池（含 bothRight 的 wrong 字段）
  const blessed: { slot: string; text: string }[] = [];
  const B = (slot: string, t?: string | null) => { if (t && t.trim()) blessed.push({ slot, text: t }); };
  B("targetSentence", l.targetSentence);
  B("dialogueEn", l.dialogueEn);
  for (const [i, d] of (l.dialogue ?? []).entries()) B(`dialogue[${i}](${d.who})`, d.en);
  for (const [i, e] of l.examples.entries()) B(`examples[${i}]`, e.en);
  for (const [i, v] of (l.variants ?? []).entries()) B(`variants[${i}](${v.label})`, v.en);
  for (const [i, s] of (l.sceneSwings ?? []).entries()) B(`sceneSwings[${i}]`, s.en);
  for (const [i, b] of l.blocks.entries()) B(`blocks[${i}]`, b.text);
  for (const [i, c] of (l.contrast ?? []).entries()) {
    B(`contrast[${i}].correct`, c.correct);
    if (c.bothRight) B(`contrast[${i}].wrong(bothRight→正确句)`, c.wrong);
  }
  for (const [i, g] of l.guided.entries()) {
    if (g.kind === "spot") continue;
    B(`guided[${i}](${g.kind}).answer`, g.answer);
    B(`guided[${i}].replaceBase`, g.replaceBase);
  }
  for (const [i, p] of l.practice.entries()) B(`practice[${i}].answer`, p.answer);
  B("recall.answer", l.recall?.answer);

  for (const [i, c] of (l.contrast ?? []).entries()) {
    if (!c.wrongMark || c.bothRight) continue;
    const m = c.wrongMark;
    // 去掉标点，取「词」级
    const mBare = bare(m);
    if (!mBare) continue;
    const rx = wb(mBare);
    const hits = blessed.filter((b) => rx.test(b.text)).map((b) => `${b.slot}=${JSON.stringify(b.text)}`);
    // 同卡自己的 correct 里也含 mark → 单独标注（这是更弱的一种）
    if (hits.length) selfContra.push({ lesson: l.number, cardIdx: i, mark: m, blessedAt: hits, wrong: c.wrong, correct: c.correct });
  }
}

console.log("════════════════════════════════════════════════════════════════");
console.log("s09-A · 判据 A：把词 M 划为错，但同课别处把含 M 的句子声明为正确");
console.log("════════════════════════════════════════════════════════════════");
console.log(`  命中课数 ${new Set(selfContra.map((x) => x.lesson)).size}；命中卡数 ${selfContra.length} / 全库标词错卡 674`);

// 按「是否同课自相矛盾」分级：若 blessedAt 里含本课 targetSentence 或 contrast.correct（非本卡），最严重
const severe = selfContra.filter((x) => {
  const l = grammarLessons.find((y) => y.number === x.lesson)!;
  const mBare = bare(x.mark);
  const rx = wb(mBare);
  const others: string[] = [];
  if (rx.test(l.targetSentence)) others.push("targetSentence");
  for (const [i, c] of (l.contrast ?? []).entries()) {
    if (i === x.cardIdx) continue;
    if (c.bothRight) { if (rx.test(c.wrong)) others.push(`contrast[${i}].wrong(bothRight→正确)`); }
    if (rx.test(c.correct)) others.push(`contrast[${i}].correct`);
  }
  for (const [i, p] of l.practice.entries()) if (rx.test(p.answer)) others.push(`practice[${i}].answer`);
  for (const [i, g] of l.guided.entries()) if (g.kind !== "spot" && rx.test(g.answer)) others.push(`guided[${i}].answer`);
  (x as SelfContra & { others: string[] }).others = others;
  return others.length > 0 && !(others.length === 1 && others[0] === `contrast[${x.cardIdx}].correct`);
});
console.log(`  其中「同课**另一处**（非本卡 correct）也含该词且被判正确」的严重项：${severe.length} 张`);

if (severe.length) {
  console.log("\n  ── 严重项逐张 ──");
  for (const x of severe as (SelfContra & { others: string[] })[]) {
    const l = grammarLessons.find((y) => y.number === x.lesson)!;
    console.log(`\n  L${x.lesson}「${l.title}」contrast[${x.cardIdx}]  划线词 = ${JSON.stringify(x.mark)}`);
    console.log(`       这张卡：wrong = ${JSON.stringify(x.wrong)}`);
    console.log(`                correct = ${JSON.stringify(x.correct)}`);
    console.log(`       同课别处把该词判为正确：${x.others.join(", ")}`);
    console.log(`       whyZh = ${l.contrast![x.cardIdx].whyZh.slice(0, 130)}`);
  }
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s09-B · ⭐ L38 专项：全课「said 的两种待遇」");
console.log("════════════════════════════════════════════════════════════════");
const l38 = grammarLessons.find((l) => l.number === 38)!;
const rxSaid = wb("said");
console.log("  含 said 的槽位及其「待遇」：");
const slotLines: string[] = [];
for (const [i, c] of l38.contrast!.entries()) {
  if (rxSaid.test(c.wrong)) slotLines.push(`  contrast[${i}].wrong  → ${c.bothRight ? "✅ 声明为正确句（双正解卡）" : `❌ 声明为错句（划线 ${JSON.stringify(c.wrongMark)}）`}  ${JSON.stringify(c.wrong)}`);
  if (rxSaid.test(c.correct)) slotLines.push(`  contrast[${i}].correct → ✅ 正确句  ${JSON.stringify(c.correct)}`);
  if (c.wrongMark && rxSaid.test(c.wrongMark)) slotLines.push(`  contrast[${i}].wrongMark → ⚠️ **被划线** ${JSON.stringify(c.wrongMark)}`);
}
for (const [i, g] of l38.guided.entries()) {
  for (const o of g.options ?? []) if (rxSaid.test(o)) slotLines.push(`  guided[${i}].options → ${o === g.answer ? "✅ 答案" : "❌ 干扰项（选了判错）"}  ${JSON.stringify(o)}`);
}
for (const d of l38.dialogue ?? []) if (rxSaid.test(d.en)) slotLines.push(`  dialogue(${d.who}).en → ✅ 正确句  ${JSON.stringify(d.en)}`);
for (const s of slotLines) console.log(s);

console.log("\n  ⇒ 结论：");
console.log("     · contrast[7]（双正解卡）把 " + JSON.stringify(l38.contrast![7].wrong) + " 声明为正确");
console.log("     · contrast[6]（错卡）却把 " + JSON.stringify(l38.contrast![6].wrongMark) + " 划掉");
console.log("     · 这两张卡在同一个屏幕上对同一个词给出相反的判定");

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s09-C · contrast[6] 的划线词是否真是「那处错」？外部权威 vs 卡面");
console.log("════════════════════════════════════════════════════════════════");
const c6 = l38.contrast![6];
console.log(`  卡面：wrong = ${JSON.stringify(c6.wrong)}  划线 = ${JSON.stringify(c6.wrongMark)}`);
console.log(`        correct = ${JSON.stringify(c6.correct)}`);
console.log(`        讲解 = "${c6.whyZh}"`);
console.log(`\n  讲解自己说的问题 =「不能直接跟在 say 后面，要垫 to」= 缺少 to`);
console.log(`  但划线划在了 ${JSON.stringify(c6.wrongMark)} 上 —— 划线位置与讲解所指的问题不是同一处。`);
console.log(`\n  机械验证：把划线词 said 换成 correct 里的对应词 says：`);
console.log(`     "She says me she will come." —— 仍不等于 correct "${c6.correct}"`);
console.log(`     ⇒ 修好划线处也到不了正确句；真正要加的是 to。`);
console.log(`\n  Cambridge《Say or tell》逐字：`);
console.log(`     "Say does not take an indirect object. Instead, we use a phrase with to:"`);
console.log(`     "And then she said to me, 'I'm your cousin. We've never met before.'"`);
console.log(`     "Not: And then she said me …"`);
console.log(`     ⇒ 权威说的是「say 不带间接宾语、要用 to」，said 本身并不被否定。`);

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s09-D · 判据 B：干扰项其实是课内承认的正确句");
console.log("════════════════════════════════════════════════════════════════");
const clash: string[] = [];
for (const l of grammarLessons) {
  const good = new Set<string>();
  const G = (t?: string | null) => { if (t && t.trim()) good.add(norm(t)); };
  G(l.targetSentence); G(l.dialogueEn);
  for (const d of l.dialogue ?? []) G(d.en);
  for (const e of l.examples) G(e.en);
  for (const v of l.variants ?? []) G(v.en);
  for (const s of l.sceneSwings ?? []) G(s.en);
  for (const c of l.contrast ?? []) { G(c.correct); if (c.bothRight) G(c.wrong); }
  for (const g of l.guided) if (g.kind !== "spot") G(g.answer);
  for (const p of l.practice) G(p.answer);
  G(l.recall?.answer);
  for (const [i, g] of l.guided.entries()) {
    if (g.kind === "spot") continue;
    for (const o of g.options ?? []) {
      if (o === g.answer) continue;
      if (good.has(norm(o))) clash.push(`L${l.number}「${l.title}」guided[${i}]：干扰项 ${JSON.stringify(o)} 与课内某正确句逐字相同（答案=${JSON.stringify(g.answer)}）`);
    }
  }
}
console.log(`  命中 ${clash.length} 处：`);
for (const s of clash) console.log(`  ⚠️ ${s}`);
console.log("\n  （注：若为 0，说明项目的干扰项设计在这一点上是干净的）");
