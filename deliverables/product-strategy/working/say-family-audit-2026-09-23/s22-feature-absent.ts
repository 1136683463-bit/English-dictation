/**
 * s22：⭐ 最终核查 —— L38 contrast[6]/[7] 的「正确侧」是否真的展示了它们教的那个特征
 *
 * 发现线索：card[6].whyZh 教的是「say 带人要用 to」，但 card[6].correct
 *          = "She says she will come." **里面根本没有 to**。
 *          card[7].correct 同样是 targetSentence，也没有 to。
 *          ⇒ 两张卡教「to」，两张卡的正确侧都不含 to。
 *
 * 机械化核查：whyZh 里出现「垫 to / 多个 to / 垫个小词 to」这类**要求补 to** 的断言时，
 *            该卡的 correct 是否含 to？
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";

const rx = (f: string) => new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i");
const toks = (s: string) => s.trim().replace(/\s+/g, " ").replace(/[.!?]+$/, "").split(" ");

console.log("════════════════════════════════════════════════════════════════");
console.log("s22-A · 全库对照卡：讲解要求「补 to」，但本卡 correct 不含 to");
console.log("════════════════════════════════════════════════════════════════");
/** 讲解里「要求补 to」的措辞（本项目的说法） */
const DEMANDS_TO = /垫个小词\s*to|垫\s*to|多个\s*to|要带\s*to|to\s*不能丢|漏了\s*to|少了\s*to|垫一下|垫一块|垫上\s*to|不能丢\s*to/i;
const hits: string[] = [];
let checked = 0;
for (const l of grammarLessons) {
  for (const [i, c] of (l.contrast ?? []).entries()) {
    if (!DEMANDS_TO.test(c.whyZh)) continue;
    checked++;
    const hasToInCorrect = rx("to").test(c.correct);
    const hasToInWrong = rx("to").test(c.wrong);
    if (!hasToInCorrect) {
      hits.push(
        `L${l.number}「${l.title}」contrast[${i}]${c.bothRight ? "（双正解）" : ""}\n` +
          `        讲解要求补 to：「${c.whyZh.slice(0, 100)}」\n` +
          `        wrong  = ${JSON.stringify(c.wrong)}  含 to？ ${hasToInWrong}\n` +
          `        correct= ${JSON.stringify(c.correct)}  含 to？ **${hasToInCorrect}**  ← 正确侧没展示 to`,
      );
    }
  }
}
console.log(`  讲解里出现「要求补 to」措辞的对照卡共 ${checked} 张；其中 correct 不含 to 的 **${hits.length}** 张：`);
for (const h of hits) console.log(`  • ${h}`);
console.log(`\n  ⇒ 若 ${hits.length} 张里包含 L38 contrast[6] 与 [7]，说明这是**同一处缺陷的两个面**。`);

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s22-B · L38 两张「say + 人」卡的完整分解");
console.log("════════════════════════════════════════════════════════════════");
const l38 = grammarLessons.find((l) => l.number === 38)!;
for (const idx of [6, 7]) {
  const c = l38.contrast![idx];
  console.log(`\n  ╔═ contrast[${idx}]${c.bothRight ? "（双正解卡）" : "（错卡）"} ══`);
  console.log(`  ║ wrong   = ${JSON.stringify(c.wrong)}`);
  console.log(`  ║ wrongMark = ${JSON.stringify(c.wrongMark ?? null)}  ${c.wrongMark ? "← 渲染为删除线（页面 textDecoration: line-through）" : ""}`);
  console.log(`  ║ correct = ${JSON.stringify(c.correct)}`);
  console.log(`  ║ whyZh   = ${JSON.stringify(c.whyZh)}`);
  console.log(`  ║`);
  console.log(`  ║ 这张卡想教的特征 = 「say 后面带人，要垫 to」`);
  console.log(`  ║     wrong 里人（me）直接跟在 said 后面？ ${/said me|say me|says me/i.test(c.wrong) ? "✅ 是（正是要教的错）" : "否"}`);
  console.log(`  ║     correct 里有 to 吗？                  ${rx("to").test(c.correct) ? "✅ 有" : "❌ **没有** ← 正确侧没展示这个特征"}`);
  console.log(`  ║     本课其它地方展示了「said to me」吗？   → contrast[${idx === 6 ? 7 : 6}].wrong = ${JSON.stringify(l38.contrast![idx === 6 ? 7 : 6].wrong)}`);
  console.log(`  ╚═`);
}
console.log(`\n  ⭐ 结论：这两张卡教「say 带人要用 to」，但**两卡的正确侧都用的是 targetSentence（不含 to）**。`);
console.log(`     「to」这个特征在本课唯一的正面展示，出现在 **contrast[7] 的 wrong 字段**里`);
console.log(`     （而那个字段名会让任何按名字读数据的工具/人以为它是错句）。`);
console.log(`     这就是批四十八新卡的结构性缺陷：`);
console.log(`       · 教的特征（to）在正确侧缺席；`);
console.log(`       · 反而把要教的正确句放在名为 wrong 的字段里；`);
console.log(`       · 错卡的划线（said）指向的又不是那个特征。`);

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s22-C · 该缺陷是否只此一处（在「say + 人」主题上）");
console.log("════════════════════════════════════════════════════════════════");
const sayPerson = /(?<![A-Za-z-])(say|says|said|saying)\s+(me|you|him|her|us|them|Tom|Lily|Xiaomei)(?![A-Za-z-])/i;
console.log("  全库含「say/says/said + 人」（人直接跟在后面，缺 to）的字符串：");
const found: string[] = [];
for (const l of grammarLessons) {
  const C = (slot: string, t?: string | null) => { if (t && sayPerson.test(t)) found.push(`L${l.number}.${slot} = ${JSON.stringify(t)}`); };
  C("targetSentence", l.targetSentence); C("dialogueEn", l.dialogueEn);
  for (const [i, d] of (l.dialogue ?? []).entries()) C(`dialogue[${i}]`, d.en);
  for (const [i, e] of l.examples.entries()) C(`examples[${i}]`, e.en);
  for (const [i, v] of (l.variants ?? []).entries()) C(`variants[${i}]`, v.en);
  for (const [i, s] of (l.sceneSwings ?? []).entries()) C(`sceneSwings[${i}]`, s.en);
  for (const [i, c] of (l.contrast ?? []).entries()) { C(`contrast[${i}].wrong`, c.wrong); if (c.bothRight) C(`contrast[${i}].wrong(bothRight→正确句!)`, c.wrong); C(`contrast[${i}].correct`, c.correct); }
  for (const [i, g] of l.guided.entries()) { C(`guided[${i}].answer`, g.answer); for (const o of g.options ?? []) C(`guided[${i}].options[]`, o); }
  for (const [i, p] of l.practice.entries()) { C(`practice[${i}].answer`, p.answer); for (const d of p.distractors ?? []) C(`practice[${i}].distractors[]`, d); }
  C("recall.answer", l.recall?.answer);
}
for (const f of found) console.log(`  ${f}`);
console.log(`  （共 ${found.length} 处）`);
const blessed = found.filter((f) => !/\.wrong =/.test(f) || /bothRight/.test(f));
console.log(`\n  ⇒ 其中处于「正确句」位置的：${blessed.length} 处：`);
for (const b of blessed) console.log(`     ${b}`);

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s22-D · 而 `said` 在案件层的**正确用法**（说明它并非无家可归）");
console.log("════════════════════════════════════════════════════════════════");
import { huntCases } from "../../../../src/data/huntCases";
for (const c of huntCases) {
  const errIdx = new Set(c.errors.map((e) => e.tokenIndex));
  for (const [i, t] of c.tokens.entries()) {
    if (!rx("said").test(t)) continue;
    const owner = grammarLessons.filter((l) => l.huntCaseIds.includes(c.id)).map((l) => `L${l.number}`);
    console.log(`  案 ${c.id}(#${c.number}) 解锁=${owner.join(",") || "番外"} tokens[${i}]="${t}" ${errIdx.has(i) ? "（被判错）" : "✅ 正确用法"}`);
    console.log(`       整句：${JSON.stringify(c.tokens.join(" "))}`);
  }
}
