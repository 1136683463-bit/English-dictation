/**
 * s24：修正 s09-D 的测量瑕疵 —— 重测「干扰项 = 课内已承认的正确句」
 *
 * s09-D 的瑕疵：它的「被祝福句池」把 guided[].answer 也收了进去，
 * 而 guided 的 answer 常是**词块碎片**（如 L41 的 "who" / "which"），
 * 于是「另一道题的答案是 which」被误判成「which 是一句正确句」。
 * ⇒ 产生了 28 处大量伪命中。
 *
 * 本脚本把句池限定为**完整句**（含 ≥2 个词且以句末标点或长词收尾），重测。
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.!?]+$/, "").trim();

console.log("════════════════════════════════════════════════════════════════");
console.log("s24-A · 只有 guided[].answer 碎片造成的伪命中：先看原始池的问题");
console.log("════════════════════════════════════════════════════════════════");
// 展示 guided.answer 里的碎片（单词或两词的）
const frags: string[] = [];
for (const l of grammarLessons) for (const [i, g] of l.guided.entries()) {
  if (g.kind === "spot") continue;
  const w = norm(g.answer).split(" ").length;
  if (w <= 2) frags.push(`L${l.number}.guided[${i}]="${g.answer}"`);
}
console.log(`  guided[].answer 中「≤2 词」的碎片：${frags.length} 处（示例 ${frags.slice(0, 12).join(", ")}）`);
console.log(`  ⇒ 这些碎片被 s09-D 当成「正确句」收进池子，制造了伪命中。`);

console.log("\n════════════════════════════════════════════════════════════════");
console.log("s24-B · 重测：句池只收【完整句】（≥3 词）");
console.log("════════════════════════════════════════════════════════════════");
interface Clash { lesson: number; idx: number; option: string; answer: string; matchedSlot: string; matchedText: string }
const clashes: Clash[] = [];
for (const l of grammarLessons) {
  /** 只收完整句（≥3 词）——排除词块碎片 */
  const pool = new Map<string, string>();
  const G = (slot: string, t?: string | null) => {
    if (!t || !t.trim()) return;
    if (norm(t).split(" ").length < 3) return;   // ← 只收完整句
    pool.set(norm(t), `${slot}="${t}"`);
  };
  G("targetSentence", l.targetSentence);
  G("dialogueEn", l.dialogueEn);
  for (const [i, d] of (l.dialogue ?? []).entries()) G(`dialogue[${i}](${d.who})`, d.en);
  for (const [i, e] of l.examples.entries()) G(`examples[${i}]`, e.en);
  for (const [i, v] of (l.variants ?? []).entries()) G(`variants[${i}](${v.label})`, v.en);
  for (const [i, s] of (l.sceneSwings ?? []).entries()) G(`sceneSwings[${i}]`, s.en);
  for (const [i, c] of (l.contrast ?? []).entries()) { G(`contrast[${i}].correct`, c.correct); if (c.bothRight) G(`contrast[${i}].wrong(bothRight→正确)`, c.wrong); }
  for (const [i, g] of l.guided.entries()) if (g.kind !== "spot") G(`guided[${i}].answer`, g.answer);
  for (const [i, p] of l.practice.entries()) G(`practice[${i}].answer`, p.answer);
  G("recall.answer", l.recall?.answer);

  for (const [i, g] of l.guided.entries()) {
    if (g.kind === "spot") continue;
    for (const o of g.options ?? []) {
      if (o === g.answer) continue;
      const n = norm(o);
      if (n.split(" ").length < 3) continue;      // 干扰项也须是完整句才值得比较
      const hit = pool.get(n);
      if (hit) clashes.push({ lesson: l.number, idx: i, option: o, answer: g.answer, matchedSlot: hit.split("=")[0], matchedText: hit });
    }
  }
}
console.log(`  命中 ${clashes.length} 处：`);
for (const c of clashes) {
  const l = grammarLessons.find((x) => x.number === c.lesson)!;
  console.log(`  ⚠️ L${c.lesson}「${l.title}」guided[${c.idx}]`);
  console.log(`       干扰项（选了判错） = ${JSON.stringify(c.option)}`);
  console.log(`       本题答案           = ${JSON.stringify(c.answer)}`);
  console.log(`       但课内 ${c.matchedSlot} 承认它是对的：${c.matchedText}`);
}
if (!clashes.length) console.log("  （0 处——把碎片排除后，项目的干扰项设计在这一点上是干净的）");

console.log("\n════════════════════════════════════════════════════════════════");
console.log("s24-C · L38 的 guided[0] 在这个干净判据下的表现");
console.log("════════════════════════════════════════════════════════════════");
const l38 = grammarLessons.find((l) => l.number === 38)!;
const g0 = l38.guided[0];
console.log(`  guided[0] before=${JSON.stringify(g0.before)} after=${JSON.stringify(g0.after)}`);
console.log(`  选项 = ${JSON.stringify(g0.options)}  答案 = ${JSON.stringify(g0.answer)}`);
console.log(`  ⇒ 选项都是 2 词词块（"She says"/"She say"/"She said"），不构成完整句；`);
console.log(`     干扰项 "She said" 拼出的句子「She said she will come.」**不在本课任何被祝福槽位里**——`);
console.log(`     本课被祝福的含 said 的完整句只有 "She said to me she will come."（contrast[7].wrong）。`);
console.log(`     所以按 s24-B 的干净判据，guided[0] **不算**「干扰项与正确句撞车」。`);
console.log(`\n  ⚠️ 但 s24-B 的判据是「逐字相同」，它抓不到 guided[0] 的问题——`);
console.log(`     因为「She said she will come.」在自己那一课里根本不是任何一句的文本，`);
console.log(`     它是**两个字段拼出来的句子**（option + after）。`);
console.log(`     ⇒ 这是一条 s24-B 抓不到、但确实存在的观察：`);
console.log(`        英语里 "She said she will come." 是**完全合法**的（OALD: say (that)…）；`);
console.log(`        L38 判它错，是因为本课的教学点是「必须带转述引子 She says」。`);
console.log(`        这是**有意的教学设计**，不是缺陷——但它确实让「said」在本课又多了一处负面信号。`);
console.log(`        我把它登记为【观察项】，不建议在本批改动。`);
