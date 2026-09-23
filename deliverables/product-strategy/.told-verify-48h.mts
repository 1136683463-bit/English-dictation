/** 竞析 · 第48批 · 脚本 H：核对交付文档里写下的 L38 与测试行号等硬断言 */
import { grammarLessons } from "../../src/data/grammarLessons";
const hr = (t: string) => console.log(`\n${"=".repeat(78)}\n${t}\n${"=".repeat(78)}`);

hr("A · L38 完整档案（验证文档 4.1③ 的逐字引用）");
const L38 = grammarLessons.find((L) => L.number === 38);
if (L38) {
  console.log(`  id=${L38.id}  标题=${L38.title}`);
  console.log(`  grammarLabel = ${L38.grammarLabel}`);
  console.log(`  targetSentence = ${JSON.stringify(L38.targetSentence)}`);
  console.log(`  oneLineRule = ${L38.oneLineRule}`);
  console.log(`  dialogueEn = ${JSON.stringify(L38.dialogueEn)}`);
  console.log(`  contrast ${(L38.contrast ?? []).length} 张：`);
  for (const c of L38.contrast ?? []) {
    console.log(`     wrong=${JSON.stringify(c.wrong)}  correct=${JSON.stringify(c.correct)}  wrongMark=${JSON.stringify(c.wrongMark)}  bothRight=${c.bothRight ?? "(无)"}`);
    console.log(`        whyZh: ${c.whyZh}`);
  }
}

hr("B · L38 错侧的全部错误点（验证「4 种错型全在从句动词上」）");
const wb = (w: string) => new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`, "gi");
if (L38) {
  const wrongs = (L38.contrast ?? []).filter((c) => !c.bothRight).map((c) => c.wrong);
  console.log(`  真错卡 wrong 字段共 ${wrongs.length} 条：`);
  for (const w of wrongs) console.log(`     ${w}`);
  const sa = wrongs.filter((w) => wb("say").test(w) || wb("says").test(w));
  console.log(`  含 say/says 的：${sa.length} 条`);
  const me = wrongs.filter((w) => /(?:say|says|said)\s+(?:me|him|her|us|them|you)/i.test(w));
  console.log(`  ⚠️ 含「say + 人宾语」错型（*say me 类）的：${me.length} 条 → ${me.length ? "有" : "❌ 无"}`);
}

hr("C · 全库扫：有没有任何一处「say + 人」或「said + 人」的错型（*say me 类）？");
type S = { L: number; k: string; side: string; text: string };
const S: S[] = [];
for (const L of grammarLessons) {
  const n = L.number;
  for (const c of L.contrast ?? []) {
    if (c.bothRight) continue;
    S.push({ L: n, k: "contrast.wrong.real", side: "wrong", text: c.wrong });
  }
  for (const g of L.guided ?? []) { for (const o of g.options ?? []) S.push({ L: n, k: "guided.options", side: "wrong", text: o }); }
  for (const p of L.practice ?? []) { for (const d of p.distractors ?? []) S.push({ L: n, k: "practice.distractors", side: "wrong", text: d }); }
}
const pat = /\b(?:say|says|said)\s+(?:me|him|her|us|them|you|Tom|Amy)\b/gi;
let hits = 0;
for (const s of S) {
  const m = s.text.match(pat);
  if (m) { hits += m.length; console.log(`  L${s.L} [${s.k}] ${JSON.stringify(s.text)}  ⟵ ${m.join(", ")}`); }
}
console.log(`  ⇒ 全库 `+"*say + 人"+` 类错型共 ${hits} 处`);

hr("D · 反向扫：有没有「tell/to 多余」的错型（*told to him 类）？");
const pat2 = /\b(?:tell|tells|told|telling)\s+to\s+(?:me|him|her|us|them|you)\b/gi;
let hits2 = 0;
for (const s of S) { const m = s.text.match(pat2); if (m) { hits2 += m.length; console.log(`  L${s.L} ${JSON.stringify(s.text)}`); } }
console.log(`  ⇒ 全库 `+"*tell to + 人"+` 类错型共 ${hits2} 处`);

hr("E · 交付文档里写的测试行号核对");
console.log("  h1-hunt-data-integrity.test.tsx : it(\"[已知问题] comparison 罪名按钮存在但无任何案件使用…\") 在 212 行");
console.log("                                    expect(used.has(\"comparison\"…)).toBe(false)           在 214 行");
console.log("                                    expect(Object.keys(LABELS)).toContain(\"comparison\")      在 216 行");
console.log("  h2-hunt-judging.test.tsx        : it(\"罪名面板提供全部 11 个罪名按钮（含全库未使用的「比一比」）\") 在 95 行");
console.log("                                    expect(labels.length).toBe(11)                          在 101 行");
console.log("                                    expect(labels).toContain(TAG_LABEL.comparison)          在 102 行");
console.log("                                    it(\"[已知问题] 选「比一比」这个无案使用的罪名…\")          在 107 行");
console.log("                                    expect(text).toContain(`这里确实有问题，但不是…`)         在 111 行");
console.log("  h3-hunt-hint-retry.test.tsx     : comparison: \"比一比\" 本地标签表                       在 29 行");
console.log("  gq2-boost-items.test.ts         : 本地 tag 清单含 comparison                            在 37 行");

hr("F · L204 的 gave 命中数（核对文档 §2.7）");
const L204 = grammarLessons.find((L) => L.number === 204);
if (L204) {
  const occ = (w: string, s: string) => (s.match(wb(w)) ?? []).length;
  console.log(`  targetSentence: ${occ("gave", L204.targetSentence)}`);
  console.log(`  examples:       ${(L204.examples ?? []).reduce((a, e) => a + occ("gave", e.en), 0)}`);
  console.log(`  dialogue:       ${(L204.dialogue ?? []).reduce((a, d) => a + occ("gave", d.en), 0)}`);
  console.log(`  contrast.correct: ${(L204.contrast ?? []).reduce((a, c) => a + occ("gave", c.correct), 0)}`);
  console.log(`  ⇒ 正侧合计应为 36（文档所写）`);
}
