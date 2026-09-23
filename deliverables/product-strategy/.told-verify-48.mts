/**
 * 竞析 · 第 48 批 told 独立复核（只读，不改任何数据）
 *
 * 口径（与批四十七 gave 口径一致，逐条列出以便他人复现）：
 *   1. 匹配：词边界正则 `(?<![A-Za-z-])W(?![A-Za-z-])`，**忽略大小写**（gi）。
 *      —— 必须忽略大小写：正句常大写开头（如 "Tell me..."），且句首 Tell 同样是教学信号。
 *   2. 正侧（pos，10 个「答案键」槽位）：
 *      targetSentence / dialogueEn / examples[].en / dialogue[].en / contrast[].correct /
 *      variants[].en / sceneSwings[].en / guided(非spot).answer / practice[].answer / recall.answer
 *      外加 guided(kind=replace).replaceBase（同属答案键）
 *   3. 错侧（wrong）：contrast[].wrong（仅 bothRight≠true 的真错卡）/ contrast[].wrongMark（同）/
 *      guided[].options / guided[].wrongToken / practice[].distractors
 *   4. 中性（两侧都不计）：
 *      · spot 题的 answer 与 tokens —— answer 就是那个错词块，计正侧会把错误算成正确用法
 *      · bothRight 卡的 wrong —— 该字段装的是**正确句**（见 types.ts L586-593 注释）
 *      · blocks[].text / guided[].tokens（非spot）/ practice[].tokens（拼装素材，正误混合）
 *
 * 运行：./node_modules/.bin/vite-node deliverables/product-strategy/.told-verify-48.mts
 */
import { grammarLessons } from "../../src/data/grammarLessons";
import { huntCases } from "../../src/data/huntCases";

const wb = (w: string) => new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`, "gi");
const occ = (w: string, s: string) => (s.match(wb(w)) ?? []).length;
const hr = (t: string) => console.log(`\n${"=".repeat(78)}\n${t}\n${"=".repeat(78)}`);

type Slot = { L: number; k: string; side: "pos" | "wrong" | "neutral"; text: string };
const S: Slot[] = [];
const add = (L: number, k: string, side: Slot["side"], v?: string | null) => {
  if (typeof v === "string" && v) S.push({ L, k, side, text: v });
};

for (const L of grammarLessons) {
  const n = L.number;
  add(n, "targetSentence", "pos", L.targetSentence);
  add(n, "dialogueEn", "pos", L.dialogueEn);
  for (const e of L.examples ?? []) add(n, "examples.en", "pos", e.en);
  for (const d of L.dialogue ?? []) add(n, "dialogue.en", "pos", d.en);
  for (const c of L.contrast ?? []) {
    add(n, "contrast.correct", "pos", c.correct);
    if (c.bothRight) {
      add(n, "contrast.wrong.BOTHRIGHT", "neutral", c.wrong);
    } else {
      add(n, "contrast.wrong.real", "wrong", c.wrong);
      add(n, "contrast.wrongMark.real", "wrong", c.wrongMark);
    }
  }
  for (const v of L.variants ?? []) add(n, "variants.en", "pos", v.en);
  for (const s of L.sceneSwings ?? []) add(n, "sceneSwings.en", "pos", s.en);
  for (const g of L.guided ?? []) {
    if (g.kind === "spot") {
      add(n, "guided.SPOT.answer", "neutral", g.answer);
      add(n, "guided.SPOT.tokens", "neutral", (g.tokens ?? []).join(" "));
      add(n, "guided.wrongToken", "wrong", g.wrongToken);
    } else {
      add(n, "guided.answer", "pos", g.answer);
      add(n, "guided.replaceBase", "pos", g.replaceBase);
      for (const o of g.options ?? []) add(n, "guided.options", "wrong", o);
      for (const t of g.tokens ?? []) add(n, "guided.tokens", "neutral", t);
    }
  }
  for (const p of L.practice ?? []) {
    add(n, "practice.answer", "pos", p.answer);
    for (const t of p.tokens) add(n, "practice.tokens", "neutral", t);
    for (const d of p.distractors ?? []) add(n, "practice.distractors", "wrong", d);
  }
  if (L.recall) add(n, "recall.answer", "pos", L.recall.answer);
  for (const b of L.blocks ?? []) add(n, "blocks.text", "neutral", b.text);
}

const POSK = [
  "targetSentence", "dialogueEn", "examples.en", "dialogue.en", "contrast.correct",
  "variants.en", "sceneSwings.en", "guided.answer", "guided.replaceBase",
  "practice.answer", "recall.answer",
];
const WRONGK = [
  "contrast.wrong.real", "contrast.wrongMark.real", "guided.options",
  "guided.wrongToken", "practice.distractors",
];
const cnt = (w: string, keys: string[], side: Slot["side"]) =>
  S.filter((s) => s.side === side && keys.includes(s.k)).reduce((a, s) => a + occ(w, s.text), 0);

hr("核查 0 · 基线");
console.log(`  grammarLessons  ${grammarLessons.length} 课`);
console.log(`  contrast 卡     ${grammarLessons.reduce((a, L) => a + (L.contrast ?? []).length, 0)} 张`);
console.log(`    ├ 真错卡(wrongMark 有值或 bothRight 缺省) ${S.filter((s) => s.k === "contrast.wrong.real").length}`);
console.log(`    └ bothRight 双正解卡                      ${S.filter((s) => s.k === "contrast.wrong.BOTHRIGHT").length}`);
console.log(`  guided 题       ${grammarLessons.reduce((a, L) => a + (L.guided ?? []).length, 0)} 题（其中 spot ${S.filter((s) => s.k === "guided.SPOT.answer").length}）`);
console.log(`  practice 题     ${grammarLessons.reduce((a, L) => a + (L.practice ?? []).length, 0)} 题`);
console.log(`  槽位：正侧 ${S.filter((s) => s.side === "pos").length} / 错侧 ${S.filter((s) => s.side === "wrong").length} / 中性 ${S.filter((s) => s.side === "neutral").length}`);
console.log(`  huntCases       ${huntCases.length} 案`);

hr("核查 1 · 主表：tell / tells / told 正侧 × 错侧");
console.log("形式".padEnd(10) + "正侧".padStart(6) + "错侧".padStart(6) + "   任务书".padStart(12));
const BRIEF: Record<string, [number, number]> = { tell: [5, 0], tells: [0, 0], told: [0, 0] };
for (const w of ["tell", "tells", "told"]) {
  const p = cnt(w, POSK, "pos"), g = cnt(w, WRONGK, "wrong");
  const [bp, bg] = BRIEF[w];
  console.log(
    w.padEnd(10) + String(p).padStart(6) + String(g).padStart(6) +
    `   ${bp}/${bg}`.padStart(12) + (p === bp && g === bg ? "  ✅ 一致" : "  ❌ 不一致")
  );
}

hr("核查 2 · 全库「tell 家族」所有形态命中（含中性侧，防漏）");
const FORMS = ["tell", "tells", "told", "telling", "telled"];
for (const w of FORMS) {
  const hits = S.filter((s) => occ(w, s.text));
  const p = hits.filter((s) => s.side === "pos").length;
  const g = hits.filter((s) => s.side === "wrong").length;
  const nu = hits.filter((s) => s.side === "neutral").length;
  const lessons = [...new Set(hits.filter((s) => s.side !== "neutral").map((s) => s.L))].sort((a, b) => a - b);
  console.log(`  ${w.padEnd(9)} 命中槽位 ${String(hits.length).padStart(2)}  正侧槽=${p} 错侧槽=${g} 中性槽=${nu}  课=[${lessons.join(",")}]`);
}

hr("核查 3 · 正侧逐槽位（tell）");
let tot = 0;
for (const k of POSK) {
  const v = cnt("tell", [k], "pos");
  tot += v;
  if (v) console.log(`  ${k.padEnd(24)} ${String(v).padStart(3)}`);
}
console.log(`  ${"合计".padEnd(24)} ${String(tot).padStart(3)}`);

hr("核查 4 · tell 正侧逐处明细（课号 / 槽位 / 原文）");
for (const s of S.filter((x) => x.side === "pos" && POSK.includes(x.k) && occ("tell", x.text)))
  console.log(`  L${String(s.L).padStart(3)} ${s.k.padEnd(18)}  ${JSON.stringify(s.text)}`);

hr("核查 5 · tell 在中性槽位的命中明细（这些**不是**教学样本）");
for (const s of S.filter((x) => x.side === "neutral" && occ("tell", x.text)))
  console.log(`  L${String(s.L).padStart(3)} ${s.k.padEnd(22)}  ${JSON.stringify(s.text.slice(0, 100))}`);

hr("核查 6 · told 全库任何一侧的任何命中（含中性；应为 0）");
const toldHits = S.filter((x) => occ("told", x.text));
if (!toldHits.length) console.log("  （空）—— told 在 grammarLessons 的所有槽位中零命中");
else for (const s of toldHits) console.log(`  L${s.L} [${s.side}] ${s.k} :: ${JSON.stringify(s.text.slice(0, 120))}`);

hr("核查 7 · tell 是否当过「主角」（判据 = targetSentence 含原形）");
const starTS = grammarLessons.filter((L) => occ("tell", L.targetSentence)).map((L) => L.number);
const starLB = grammarLessons.filter((L) => occ("tell", L.grammarLabel)).map((L) => L.number);
console.log(`  targetSentence 含 tell 的课 = [${starTS.join(",")}]  → ${starTS.length ? "当过主角" : "❌ 从未当过主角"}`);
console.log(`  grammarLabel   含 tell 的课 = [${starLB.join(",")}]`);
console.log(`  ⇒ 判据结论：tell ${starTS.length || starLB.length ? "有" : "无"}主角课 ⇒ told ${starTS.length || starLB.length ? "具备立课资格" : "无立课资格（只能挂靠/不处理）"}`);

hr("核查 8 · 那 5 处 tell 的完整上下文（槽位 + 同课谁是主角 + 是否对话第一句）");
for (const L of grammarLessons) {
  const hits: string[] = [];
  if (occ("tell", L.targetSentence)) hits.push("targetSentence");
  if (occ("tell", L.dialogueEn)) hits.push("dialogueEn");
  if ((L.dialogue ?? []).some((d) => occ("tell", d.en))) hits.push("dialogue");
  if (!hits.length) continue;
  console.log(`\n  ── L${L.number} ${L.id} 「${L.title}」`);
  console.log(`     grammarLabel : ${L.grammarLabel}`);
  console.log(`     targetSentence: ${JSON.stringify(L.targetSentence)}`);
  console.log(`     oneLineRule  : ${L.oneLineRule.slice(0, 110)}`);
  console.log(`     dialogueEn   : ${JSON.stringify(L.dialogueEn)}`);
  const dlg = L.dialogue ?? [];
  dlg.forEach((d, i) => {
    const mark = occ("tell", d.en) ? " ⟵ tell" : "";
    console.log(`     dialogue[${i}] who=${d.who.padEnd(3)} en=${JSON.stringify(d.en)}${mark}`);
  });
  const idx = dlg.findIndex((d) => occ("tell", d.en));
  console.log(`     ⇒ tell 出现在 dialogue 第 ${idx + 1} 句 / 共 ${dlg.length} 句；句首？${/^tell/i.test(dlg[idx]?.en ?? L.dialogueEn)}`);
}

hr("核查 9 · 对照：批四十七 14 词 + tell 在同一口径下的正侧基数与主角课");
const WORDS = ["felt", "kept", "sat", "caught", "swam", "sang", "slept", "drew", "wore", "lost", "broke", "gave", "told", "went", "ate", "said"];
for (const w of WORDS) {
  const p = cnt(w, POSK, "pos");
  const g = cnt(w, WRONGK, "wrong");
  const ls = [...new Set(S.filter((s) => s.side === "pos" && POSK.includes(s.k) && occ(w, s.text)).map((s) => s.L))].sort((a, b) => a - b);
  console.log(`  ${w.padEnd(9)} 正侧=${String(p).padStart(3)} 错侧=${String(g).padStart(3)}  课=[${ls.join(",")}]`);
}

hr("核查 10 · 原形主角表：tell / say / give / lose / break（判据的横向对照）");
for (const base of ["tell", "say", "give", "lose", "break", "speak", "talk", "ask", "answer"]) {
  const ts = grammarLessons.filter((L) => occ(base, L.targetSentence)).map((L) => L.number);
  const lb = grammarLessons.filter((L) => occ(base, L.grammarLabel)).map((L) => L.number);
  const pos = cnt(base, POSK, "pos");
  console.log(`  ${base.padEnd(8)} targetSentence=[${ts.join(",")}]  grammarLabel=[${lb.join(",")}]  正侧基数=${pos}`);
}

hr("核查 11 · huntCases 侧 tell / tells / told 命中（对话/讲解里是否出现过）");
for (const w of ["tell", "tells", "told", "said", "say"]) {
  let n = 0;
  const where: string[] = [];
  for (const c of huntCases) {
    let k = 0;
    k += occ(w, c.tokens.join(" "));
    for (const e of c.errors) { k += occ(w, e.original); k += occ(w, e.correction); k += occ(w, e.explanation); }
    for (const nt of c.notes ?? []) k += occ(w, nt.word) + occ(w, nt.zh);
    if (k) { n += k; where.push(`${c.id}×${k}`); }
  }
  console.log(`  ${w.padEnd(7)} 共 ${String(n).padStart(3)} 处  ${where.slice(0, 8).join(" ")}${where.length > 8 ? " …" : ""}`);
}
