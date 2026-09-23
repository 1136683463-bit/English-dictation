/**
 * s23：⭐ 收窄 s22-A —— 只保留**真正有问题**的那一类
 *
 * s22-A 把两类混在一起了，必须分开：
 *   类型甲（无害）：wrong **多**了 to，correct 去掉 to。
 *        → 「不要垫 to」的课。correct 不含 to 正是**正确教学**。
 *   类型乙（可疑）：wrong **少**了 to，correct 应当补上 to。
 *        → 「要垫 to」的课。若 correct 也不含 to，则本卡**无法展示它要教的特征**。
 *
 * 只有类型乙才是 s22 想找的。本脚本分离两类。
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";

const rx = (f: string) => new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i");

/** 讲解里「要求补 to」的措辞 */
const DEMANDS_TO = /垫个小词\s*to|要带上人[^。]*to|多个\s*to|要带\s*to|to\s*不能丢|漏了\s*to|少了\s*to|垫\s*to|垫一下|垫一块|垫上\s*to|不垫\s*to|别垫\s*to/;

const rows: { lesson: number; idx: number; bothRight: boolean; toInWrong: boolean; toInCorrect: boolean; why: string; wrong: string; correct: string }[] = [];
for (const l of grammarLessons) {
  for (const [i, c] of (l.contrast ?? []).entries()) {
    if (!DEMANDS_TO.test(c.whyZh)) continue;
    rows.push({ lesson: l.number, idx: i, bothRight: !!c.bothRight, toInWrong: rx("to").test(c.wrong), toInCorrect: rx("to").test(c.correct), why: c.whyZh, wrong: c.wrong, correct: c.correct });
  }
}
console.log("════════════════════════════════════════════════════════════════");
console.log("s23-A · 分离两类");
console.log("════════════════════════════════════════════════════════════════");
const typeA = rows.filter((r) => r.toInWrong && !r.toInCorrect);   // 去掉 to（正确教学）
const typeB = rows.filter((r) => !r.toInWrong && !r.toInCorrect);  // 该补 to，但 correct 也没有
console.log(`  讲解含 to 相关措辞的对照卡：${rows.length} 张`);
console.log(`    类型甲「去掉 to」：${typeA.length} 张 → correct 不含 to 是**正确教学**，非缺陷`);
console.log(`    类型乙「该补 to 但 correct 也没 to」：${typeB.length} 张 ← 这才可疑`);
console.log(`    其它（wrong/correct 都含 to 或都判不出）：${rows.length - typeA.length - typeB.length} 张`);

console.log("\n  ── 类型乙逐张 ──");
for (const r of typeB) {
  console.log(`\n  ${r.bothRight ? "★双正解" : "  错卡  "} L${r.lesson} contrast[${r.idx}]`);
  console.log(`       wrong  = ${JSON.stringify(r.wrong)}   （含 to？ ${r.toInWrong}）`);
  console.log(`       correct= ${JSON.stringify(r.correct)}   （含 to？ ${r.toInCorrect}）`);
  console.log(`       whyZh  = ${JSON.stringify(r.why.slice(0, 130))}`);
  console.log(`       ⇒ 讲解要求补 to，但正确侧是「${r.correct}」——**不含 to**，用户看不到补上 to 之后长什么样。`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s23-B · L38 两张卡的类型归属");
console.log("════════════════════════════════════════════════════════════════");
for (const idx of [6, 7]) {
  const r = typeB.find((x) => x.lesson === 38 && x.idx === idx);
  const a = typeA.find((x) => x.lesson === 38 && x.idx === idx);
  console.log(`  L38 contrast[${idx}]：${r ? "⚠️ **类型乙**（该补 to，correct 也没 to）" : a ? "类型甲" : "未归类"}`);
}
console.log(`\n  类型乙全库共 ${typeB.length} 张，其中 L38 占 ${typeB.filter((r) => r.lesson === 38).length} 张：`);
console.log(`     ${typeB.filter((r) => r.lesson === 38).map((r) => `contrast[${r.idx}]`).join(", ")}`);
console.log(`\n  ⇒ **全库只有 L38 一课有这个问题**（类型乙里的其它课：${[...new Set(typeB.filter((r) => r.lesson !== 38).map((r) => `L${r.lesson}`))].join(", ") || "无"}）`);

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s23-C · 对照：L38 的「同族」课是怎么做的（有正确侧展示的范例）");
console.log("════════════════════════════════════════════════════════════════");
console.log("  范例：L79「next to」（补词型，划线在补词位置、正确侧展示了 to）");
const l79 = grammarLessons.find((l) => l.number === 79)!;
for (const [i, c] of l79.contrast!.entries()) {
  if (!rx("to").test(c.correct) && !rx("to").test(c.wrong)) continue;
  console.log(`     contrast[${i}]  wrong=${JSON.stringify(c.wrong)}`);
  console.log(`                    correct=${JSON.stringify(c.correct)}   ← 正确侧**含 to**，用户能看到补上后的样子`);
  console.log(`                    划线=${JSON.stringify(c.wrongMark ?? null)}`);
}
console.log("\n  范例：L44「go to the shop to buy milk」");
const l44 = grammarLessons.find((l) => l.number === 44)!;
for (const [i, c] of l44.contrast!.entries()) {
  if (!/to/.test(c.correct)) continue;
  console.log(`     contrast[${i}]  wrong=${JSON.stringify(c.wrong)}`);
  console.log(`                    correct=${JSON.stringify(c.correct)}`);
  console.log(`                    划线=${JSON.stringify(c.wrongMark ?? null)}`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s23-D · 类型甲的样例（说明 correct 不含 to 不必然是缺陷）");
console.log("════════════════════════════════════════════════════════════════");
for (const r of typeA.slice(0, 8)) {
  console.log(`  L${r.lesson} contrast[${r.idx}]  wrong=${JSON.stringify(r.wrong)} → correct=${JSON.stringify(r.correct)}`);
  console.log(`       whyZh=${JSON.stringify(r.why.slice(0, 90))}`);
}
console.log(`  ⇒ 类型甲讲的是「不要垫 to」，correct 去掉 to 是**正确的教学呈现**，不是缺陷。`);
