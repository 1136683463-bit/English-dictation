import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";
const WB = (f: string) => new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i");
const H = (f: string, t?: string) => !!t && WB(f).test(t);
console.log("=== 【最终】tell 的 6 处正侧（逐条，含课号+字段路径+原文）===");
let i = 0;
for (const l of grammarLessons) {
  const A = (slot: string, t?: string) => { if (H("tell", t)) console.log(`  ${++i}. L${l.number} ${slot}\n       ${JSON.stringify(t)}`); };
  A("targetSentence", l.targetSentence); A("dialogueEn", l.dialogueEn);
  (l.dialogue ?? []).forEach((d, k) => A(`dialogue[${k}].en`, d.en));
  l.examples.forEach((e, k) => A(`examples[${k}].en`, e.en));
  (l.variants ?? []).forEach((v, k) => A(`variants[${k}].en`, v.en));
  (l.sceneSwings ?? []).forEach((s, k) => A(`sceneSwings[${k}].en`, s.en));
  l.blocks.forEach((b, k) => A(`blocks[${k}].text`, b.text));
  l.practice.forEach((p, k) => A(`practice[${k}].answer`, p.answer));
  if (l.recall) A("recall.answer", l.recall.answer);
  (l.contrast ?? []).forEach((c, k) => { A(`contrast[${k}].correct`, c.correct); if (c.bothRight) A(`contrast[${k}].wrong(bothRight→正确句)`, c.wrong); });
  l.guided.forEach((g, k) => { if (g.kind !== "spot") { A(`guided[${k}].answer`, g.answer); A(`guided[${k}].replaceBase`, g.replaceBase); } });
}
console.log(`\n  合计 ${i} 处 —— 全部位于 dialogue[]（其中 5 处在 dialogue[0]，1 处在 dialogueEn 与 dialogue[0] 同一句）`);
console.log(`  注：L41 的 dialogueEn 与 dialogue[0].en 是同一句，故 A1 计 6 = 5 个对话行 + 1 个 dialogueEn 重复计。`);
console.log(`  ★ 去重后的「物理句子数」= 5 句（L41 那一句被 dialogueEn 与 dialogue[0] 各计一次）`);

console.log("\n=== 【最终】tells / told / telling 的全库落点 ===");
for (const f of ["tells","told","telling"]) {
  let n = 0;
  const rec = (o: any, d = 0) => { if (d > 9 || o == null) return; if (typeof o === "string") { if (H(f, o)) n++; return; } if (Array.isArray(o)) { o.forEach(v => rec(v, d+1)); return; } if (typeof o === "object") for (const k of Object.keys(o)) rec(o[k], d+1); };
  rec(grammarLessons); rec(huntCases);
  console.log(`  ${f.padEnd(9)} 课+案全字段递归 = ${n} 处`);
}

console.log("\n=== L205 若立课：难度闸门检验 ===");
const L204 = grammarLessons.find(l => l.number === 204)!;
const lc = (s: string) => Math.max(...s.split(/[.!?]\s*/).filter(c => c.trim()).map(c => c.trim().split(/\s+/).length));
console.log(`  L204 target: ${JSON.stringify(L204.targetSentence)}  最长分句=${lc(L204.targetSentence)} 词`);
console.log(`  闸门：相邻课最长分句不得跳 +5 词 ⇒ L205 最长分句上限 = ${lc(L204.targetSentence) + 5} 词`);
const cand = ["I told her the news, and she told me a story.", "She told me a story last night."];
for (const c of cand) console.log(`  候选 ${JSON.stringify(c)} → 最长分句 ${lc(c)} 词（${lc(c) <= lc(L204.targetSentence)+5 ? "✓ 通过" : "✗ 越闸"}）`);
console.log(`\n  季分组：season-28 现为 min:182 max:204 ⇒ 新增 L205 必须把 max 改成 205（否则路径页静默过滤）`);
