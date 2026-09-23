/**
 * 竞析 · 第 47 批核查脚本（只读，不改任何数据）。
 * 运行：./node_modules/.bin/vite-node <此文件>
 *
 * 口径（本脚本自定，事后逐条打印可核）：
 *   A. 一律用「解析后的数据对象」逐字段判定，不用 grep、不看源码文本行。
 *   B. 词边界：`(?<![A-Za-z-])w(?![A-Za-z-])`，与 D 层守门同口径（排除连字符与相邻字母）。
 *   C. **正侧（positive / model side）** = 用户被明确告知「照这样说」的槽位。
 *   D. **错侧（wrong side）** = 用户被明确告知「这样说不对」或充作干扰项/错误答案的槽位。
 *   E. 两处特例排除（批四十七简报指定的口径）：
 *        ① `guided[k].kind === "spot"` 时，`answer` 装的是**错的那个词块**（不是正确答案）
 *           —— 必须归错侧，不能算正侧。
 *        ② `contrast[k].bothRight === true` 时，`wrong` 装的是**正确的第二句**
 *           —— 必须归正侧（或至少不算错侧）。
 */
import { grammarLessons } from "../../src/data/grammarLessons";
import { huntCases } from "../../src/data/huntCases";

/** 词边界：排除连字符与相邻字母。 */
const wb = (w: string, flags = "") => new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`, flags);
const countIn = (w: string, s: string) => (s.match(wb(w, "g")) ?? []).length;

type Slot = { L: number; side: "pos" | "wrong"; path: string; text: string };

const SLOTS: Slot[] = [];
const push = (L: number, side: "pos" | "wrong", path: string, text?: string | null) => {
  if (typeof text === "string" && text.length) SLOTS.push({ L, side, path, text });
};

for (const L of grammarLessons) {
  const n = L.number;
  // ── 正侧 ──
  push(n, "pos", "targetSentence", L.targetSentence);
  push(n, "pos", "dialogueEn", L.dialogueEn);
  push(n, "pos", "oneLineRule", L.oneLineRule);
  push(n, "pos", "grammarLabel", L.grammarLabel);
  push(n, "pos", "title", L.title);
  push(n, "pos", "sceneSetupZh", L.sceneSetupZh);
  push(n, "pos", "intentZh", L.intentZh);
  push(n, "pos", "dialogueZh", L.dialogueZh);
  L.blocks?.forEach((b, i) => {
    push(n, "pos", `blocks[${i}].text`, b.text);
    push(n, "pos", `blocks[${i}].role`, b.role);
  });
  L.examples?.forEach((e, i) => {
    push(n, "pos", `examples[${i}].en`, e.en);
    push(n, "pos", `examples[${i}].zh`, e.zh);
  });
  (L.dialogue ?? []).forEach((d, i) => {
    push(n, "pos", `dialogue[${i}].en`, d.en);
    push(n, "pos", `dialogue[${i}].zh`, d.zh);
  });
  (L.contrast ?? []).forEach((c, i) => {
    // 特例②：bothRight=true 的 wrong 装的是正确的第二句 → 归正侧
    push(n, c.bothRight ? "pos" : "wrong", `contrast[${i}].wrong`, c.wrong);
    push(n, "pos", `contrast[${i}].correct`, c.correct);
    push(n, "pos", `contrast[${i}].whyZh`, c.whyZh);
    push(n, c.bothRight ? "pos" : "wrong", `contrast[${i}].wrongMark`, c.wrongMark);
  });
  (L.variants ?? []).forEach((v, i) => {
    push(n, "pos", `variants[${i}].en`, v.en);
    push(n, "pos", `variants[${i}].zh`, v.zh);
    push(n, "pos", `variants[${i}].noteZh`, v.noteZh);
    push(n, "pos", `variants[${i}].label`, v.label);
  });
  (L.sceneSwings ?? []).forEach((s, i) => {
    push(n, "pos", `sceneSwings[${i}].en`, s.en);
    push(n, "pos", `sceneSwings[${i}].zh`, s.zh);
    push(n, "pos", `sceneSwings[${i}].sceneZh`, s.sceneZh);
  });
  if (L.deepDive) {
    push(n, "pos", "deepDive.title", L.deepDive.title);
    L.deepDive.paragraphs.forEach((p, i) => push(n, "pos", `deepDive.paragraphs[${i}]`, p));
  }
  if (L.summary) {
    push(n, "pos", "summary.rule", L.summary.rule);
    L.summary.points.forEach((p, i) => push(n, "pos", `summary.points[${i}]`, p));
  }
  L.guided?.forEach((g, i) => {
    push(n, "pos", `guided[${i}].promptZh`, g.promptZh);
    // 特例①：spot 题的 answer 是「错的那个词块」
    push(n, g.kind === "spot" ? "wrong" : "pos", `guided[${i}].answer`, g.answer);
    push(n, "pos", `guided[${i}].explain`, g.explain);
    push(n, "pos", `guided[${i}].before`, g.before);
    push(n, "pos", `guided[${i}].after`, g.after);
    push(n, "pos", `guided[${i}].replaceBase`, g.replaceBase);
    push(n, "pos", `guided[${i}].replaceTarget`, g.replaceTarget);
    push(n, "pos", `guided[${i}].correctionZh`, g.correctionZh);
    // spot 的 wrongToken 一定是错侧；非 spot 的 options 是候选池（含正确项，归中性→不计）
    if (g.kind === "spot") push(n, "wrong", `guided[${i}].wrongToken`, g.wrongToken);
    // arrange/spot 的 tokens 对 spot 是「含错的整句」，对 arrange 是正确词块
    (g.tokens ?? []).forEach((t, j) => push(n, g.kind === "spot" && t === g.wrongToken ? "wrong" : "pos", `guided[${i}].tokens[${j}]`, t));
    push(n, "wrong", `guided[${i}].options`, g.options?.join(" "));
  });
  L.practice?.forEach((p, i) => {
    push(n, "pos", `practice[${i}].promptZh`, p.promptZh);
    push(n, "pos", `practice[${i}].answer`, p.answer);
    push(n, "pos", `practice[${i}].tokens`, p.tokens.join(" "));
    (p.distractors ?? []).forEach((d, j) => push(n, "wrong", `practice[${i}].distractors[${j}]`, d));
  });
  if (L.recall) {
    push(n, "pos", "recall.promptZh", L.recall.promptZh);
    push(n, "pos", "recall.intentZh", L.recall.intentZh);
    push(n, "pos", "recall.answer", L.recall.answer);
    push(n, "pos", "recall.noteZh", L.recall.noteZh);
  }
}

const hits = (w: string, side?: "pos" | "wrong") =>
  SLOTS.filter((s) => (side ? s.side === side : true) && countIn(w, s.text) > 0)
    .map((s) => ({ ...s, k: countIn(w, s.text) }));

const total = (w: string, side?: "pos" | "wrong") => hits(w, side).reduce((a, b) => a + b.k, 0);

const hr = (t: string) => console.log(`\n${"=".repeat(78)}\n${t}\n${"=".repeat(78)}`);

hr("核查 0 · 数据基线");
console.log(`grammarLessons: ${grammarLessons.length} 课（末课 L${grammarLessons[grammarLessons.length - 1].number} ${grammarLessons[grammarLessons.length - 1].id}）`);
console.log(`huntCases:      ${huntCases.length} 案（末案 #${huntCases[huntCases.length - 1].number}）`);
console.log(`正侧槽位总数:   ${SLOTS.filter((s) => s.side === "pos").length}`);
console.log(`错侧槽位总数:   ${SLOTS.filter((s) => s.side === "wrong").length}`);

hr("核查 1 · 复核批四十七简报的四行表");
const WORDS = ["give", "gives", "gave", "given", "given"];
const FORMS = ["give", "gives", "gave", "given"];
console.log("形式".padEnd(10) + "正侧".padStart(6) + "错侧".padStart(6) + "全库".padStart(6) + "   hit 课（正侧）");
for (const w of FORMS) {
  const p = total(w, "pos");
  const g = total(w, "wrong");
  const ls = [...new Set(hits(w, "pos").map((h) => h.L))].sort((a, b) => a - b);
  console.log(w.padEnd(10) + String(p).padStart(6) + String(g).padStart(6) + String(p + g).padStart(6) + "   [" + ls.join(",") + "]");
}

hr("核查 2 · give 的 25 处正侧逐条明细（课号 / 字段路径 / 计数）");
{
  const h = hits("give", "pos").sort((a, b) => a.L - b.L || a.path.localeCompare(b.path));
  for (const r of h) console.log(`  L${String(r.L).padStart(3)}  ${r.path.padEnd(34)} ×${r.k}  ::  ${r.text.replace(/\n/g, " ").slice(0, 82)}`);
}

hr("核查 3 · give 的 5 处错侧逐条明细");
{
  const h = hits("give", "wrong").sort((a, b) => a.L - b.L);
  for (const r of h) console.log(`  L${String(r.L).padStart(3)}  ${r.path.padEnd(34)} ×${r.k}  ::  ${r.text.replace(/\n/g, " ").slice(0, 82)}`);
}

hr("核查 4 · gives / gave / given 的每一处（含错侧）");
for (const w of ["gives", "gave", "given"]) {
  console.log(`\n── ${w} ──`);
  const all = hits(w);
  if (!all.length) console.log("   （全库 0 处）");
  for (const r of all.sort((a, b) => a.L - b.L)) {
    console.log(`  L${String(r.L).padStart(3)}  [${r.side === "pos" ? "正侧" : "错侧"}]  ${r.path.padEnd(32)} ×${r.k}  ::  ${r.text.replace(/\n/g, " ").slice(0, 150)}`);
  }
}

hr("核查 5 · L199 whyZh 的 give→gave 承诺（逐字）");
{
  const L199 = grammarLessons.find((l) => l.number === 199)!;
  const idx = (L199.contrast ?? []).findIndex((c) => /gave/.test(c.whyZh));
  console.log(`  L199 ${L199.id} / ${L199.title}`);
  console.log(`  contrast[${idx}]:`);
  console.log(`     wrong   = ${JSON.stringify((L199.contrast ?? [])[idx].wrong)}`);
  console.log(`     correct = ${JSON.stringify((L199.contrast ?? [])[idx].correct)}`);
  console.log(`     bothRight = ${String((L199.contrast ?? [])[idx].bothRight)}`);
  console.log(`     whyZh   = ${JSON.stringify((L199.contrast ?? [])[idx].whyZh)}`);
}

hr("核查 6 · gave 的「唯一正侧来源」判定");
{
  const posHits = hits("gave", "pos");
  console.log(`  gave 正侧 ${total("gave", "pos")} 处 → ${posHits.length ? "有来源" : "**完全没有来源**"}`);
  console.log(`  → 若 0，则 L199 那句「give 变 gave」是【已承诺未交付】：被点名却没有可点开的句子。`);
}

hr("核查 7 · 反事实对照：其它已立课/已挂靠过去式的正侧基数");
for (const w of ["felt", "kept", "sat", "caught", "swam", "sang", "slept", "drew", "wore", "went", "ate", "saw", "bought", "thought", "knew", "told", "lost", "broke", "put", "read"]) {
  const p = total(w, "pos");
  const ls = [...new Set(hits(w, "pos").map((h) => h.L))].sort((a, b) => a - b);
  console.log(`  ${w.padEnd(9)} 正侧=${String(p).padStart(3)}   课=[${ls.join(",")}]`);
}

hr("核查 8 · give 的两种句型在库内的覆盖（give sb sth / give sth to sb）");
{
  const reA = /give\s+\w+\s+(the|a|an|it|his|her|my)\s+\w+/i;         // give sb sth
  const reB = /give\s+(the|a|an|it|his|her|my)\s+\w+\s+to\s+\w+/i;   // give sth to sb
  for (const [name, re] of [["give sb sth", reA], ["give sth to sb", reB]] as [string, RegExp][]) {
    const ls: number[] = [];
    for (const L of grammarLessons) {
      const texts = [
        L.targetSentence, ...(L.examples ?? []).map((e) => e.en), ...(L.dialogue ?? []).map((d) => d.en),
        ...(L.contrast ?? []).flatMap((c) => [c.wrong, c.correct]), ...(L.variants ?? []).map((v) => v.en),
        ...(L.sceneSwings ?? []).map((s) => s.en), ...(L.practice ?? []).map((p) => p.answer),
        ...(L.guided ?? []).map((g) => g.answer),
      ];
      if (texts.some((t) => t && re.test(t))) ls.push(L.number);
    }
    console.log(`  ${name.padEnd(16)} 课=[${ls.join(",")}]  共 ${ls.length} 课`);
  }
}

hr("核查 9 · L63 的 give 教学面（本课全部字段里 give 的分布）");
{
  const L63 = grammarLessons.find((l) => l.number === 63)!;
  const c63 = SLOTS.filter((s) => s.L === 63 && countIn("give", s.text) > 0);
  console.log(`  L63 ${L63.id} / ${L63.title} / ${L63.grammarLabel}`);
  console.log(`  give 在本课出现 ${c63.reduce((a, b) => a + b.k, 0)} 次，分布：`);
  for (const r of c63) console.log(`     [${r.side === "pos" ? "正" : "错"}] ${r.path.padEnd(30)} ×${r.k}`);
  console.log(`  本课 guided 的 spot 题：`);
  for (const g of L63.guided ?? []) if (g.kind === "spot") console.log(`     tokens=${JSON.stringify(g.tokens)} wrongToken=${JSON.stringify(g.wrongToken)} answer=${JSON.stringify(g.answer)}`);
}

hr("核查 10 · huntCases 里的 give / gave（词边界，只看用户可见字段）");
{
  for (const w of ["give", "gives", "gave", "given"]) {
    const found: string[] = [];
    for (const c of huntCases) {
      const slots: [string, string][] = [
        ...c.tokens.map((t, i) => [`token[${i}]`, t] as [string, string]),
        ...(c.errors ?? []).flatMap((e, i) => [
          [`errors[${i}].original`, e.original], [`errors[${i}].correction`, e.correction], [`errors[${i}].explanation`, e.explanation],
        ] as [string, string][]),
        ...(c.notes ?? []).map((x, i) => [`notes[${i}].zh`, x.zh] as [string, string]),
      ];
      for (const [p, t] of slots) if (countIn(w, t)) found.push(`#${c.number} ${c.id} ${p}`);
    }
    console.log(`  ${w.padEnd(8)} ${found.length} 处  ${found.join(" | ") || "—"}`);
  }
}
