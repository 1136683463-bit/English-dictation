/**
 * 瑞思 · 第 47 批核查脚本 2（gave）—— 计数口径穷举，只读，不改数据。
 * 运行：./node_modules/.bin/vite-node deliverables/product-strategy/.gave-count.mts
 *
 * ⚠️ 关键实现纪律：**绝不在 `.test()` 上用带 `g` 标志的正则**（lastIndex 有状态，
 *    会把计数少算；上一版脚本就踩了这个坑：give 正侧被算成 51 而不是 70）。
 *    本脚本统一用「无 g 的 re 做 test、带 g 的 re 做 match 计数」。
 */
import { grammarLessons } from "../../src/data/grammarLessons";
import { huntCases } from "../../src/data/huntCases";

const wb = (w: string, flags = "") => new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`, flags);
const wbTest = (w: string) => (s: string) => new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`).test(s);
const wbCount = (w: string, s: string) => (s.match(new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`, "g")) ?? []).length;

function strings(v: unknown, path = "", out: { p: string; s: string }[] = []): { p: string; s: string }[] {
  if (typeof v === "string") out.push({ p: path, s: v });
  else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${path}[${i}]`, out));
  else if (v && typeof v === "object")
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) strings(x, path ? `${path}.${k}` : k, out);
  return out;
}
type Row = { L: number; p: string; s: string };
const F: Row[] = [];
for (const L of grammarLessons) for (const { p, s } of strings(L)) F.push({ L: L.number, p, s });
const key = (r: { L: number; p: string }) => `${r.L}|${r.p}`;

const WRONG_NAME = /\.(wrong|wrongMark)$|distractors\[\d+\]$|\.wrongToken$/;
const OPTION_NAME = /\.options\[\d+\]$/;
const SPOT = new Set<string>();
const BR = new Set<string>();
for (const L of grammarLessons) {
  (L.guided ?? []).forEach((g, i) => { if (g.kind === "spot") SPOT.add(`${L.number}|guided[${i}].answer`); });
  (L.contrast ?? []).forEach((c, i) => { if (c.bothRight) BR.add(`${L.number}|contrast[${i}].wrong`); });
}

/** 句子槽：用户会被要求「照这句说/写」的真正句子位置。 */
const SENT = new RegExp(
  [
    "(^|\\.)(targetSentence|dialogueEn)$",
    "(^|\\.)examples\\[\\d+\\]\\.en$",
    "(^|\\.)contrast\\[\\d+\\]\\.correct$",
    "(^|\\.)variants\\[\\d+\\]\\.en$",
    "(^|\\.)sceneSwings\\[\\d+\\]\\.en$",
    "(^|\\.)dialogue\\[\\d+\\]\\.en$",
    "(^|\\.)blocks\\[\\d+\\]\\.text$",
    "(^|\\.)guided\\[\\d+\\]\\.(answer|replaceBase)$",
    "(^|\\.)practice\\[\\d+\\]\\.answer$",
    "(^|\\.)recall\\.answer$",
  ].join("|")
);
/** 展示槽（含讲解散文、题干、词块）。 */
const SHOW = new RegExp(
  [
    "(^|\\.)(targetSentence|dialogueEn|oneLineRule|grammarLabel|title|sceneSetupZh)$",
    "(^|\\.)examples\\[\\d+\\]\\.(en|zh)$",
    "(^|\\.)contrast\\[\\d+\\]\\.(correct|whyZh)$",
    "(^|\\.)variants\\[\\d+\\]\\.(en|noteZh)$",
    "(^|\\.)sceneSwings\\[\\d+\\]\\.(en|zh)$",
    "(^|\\.)dialogue\\[\\d+\\]\\.(en|zh)$",
    "(^|\\.)blocks\\[\\d+\\]\\.(text|role)$",
    "(^|\\.)summary\\.(rule|points\\[\\d+\\])$",
    "(^|\\.)deepDive\\.(title|paragraphs\\[\\d+\\])$",
    "(^|\\.)guided\\[\\d+\\]\\.(answer|explain|promptZh|correctionZh|before|after|replaceBase|replaceTarget|tokens\\[\\d+\\])$",
    "(^|\\.)practice\\[\\d+\\]\\.(answer|promptZh|tokens\\[\\d+\\]|distractors\\[\\d+\\])$",
    "(^|\\.)recall\\.(promptZh|intentZh|answer|noteZh)$",
  ].join("|")
);
/** 英文句字段（只认英文槽，排除 tokens/文字散文/中文）。 */
const EN_SLOT = new RegExp(
  [
    "(^|\\.)(targetSentence|dialogueEn)$",
    "(^|\\.)examples\\[\\d+\\]\\.en$",
    "(^|\\.)contrast\\[\\d+\\]\\.correct$",
    "(^|\\.)variants\\[\\d+\\]\\.en$",
    "(^|\\.)sceneSwings\\[\\d+\\]\\.en$",
    "(^|\\.)dialogue\\[\\d+\\]\\.en$",
    "(^|\\.)guided\\[\\d+\\]\\.(answer|replaceBase)$",
    "(^|\\.)practice\\[\\d+\\]\\.answer$",
    "(^|\\.)recall\\.answer$",
  ].join("|")
);
/** 词块/选项槽。 */
const TOKEN_SLOT = new RegExp("(^|\\.)(options|tokens|distractors)\\[\\d+\\]$|(^|\\.)blocks\\[\\d+\\]\\.text$");

type Recipe = { name: string; keep: (r: Row) => boolean; note: string };
const posRecipes: Recipe[] = [
  { name: "P1 全字段 · 排除 spot.answer+bothRight.wrong", note: "最宽的「正侧」", keep: (r) => !WRONG_NAME.test(r.p) && !OPTION_NAME.test(r.p) && !SPOT.has(key(r)) && !BR.has(key(r)) },
  { name: "P2 全字段 · 只排 spot.answer", keep: (r) => !WRONG_NAME.test(r.p) && !OPTION_NAME.test(r.p) && !SPOT.has(key(r)) },
  { name: "P3 展示槽(SHOW) · 排除两类", keep: (r) => SHOW.test(r.p) && !WRONG_NAME.test(r.p) && !OPTION_NAME.test(r.p) && !SPOT.has(key(r)) && !BR.has(key(r)) },
  { name: "P4 英文句槽(EN_SLOT) · 排除两类", keep: (r) => EN_SLOT.test(r.p) && !WRONG_NAME.test(r.p) && !OPTION_NAME.test(r.p) && !SPOT.has(key(r)) && !BR.has(key(r)) },
  { name: "P5 句子槽(SENT) · 排除两类", keep: (r) => SENT.test(r.p) && !WRONG_NAME.test(r.p) && !OPTION_NAME.test(r.p) && !SPOT.has(key(r)) && !BR.has(key(r)) },
  { name: "P6 剔掉纯词块槽(tokens/options/distractors/blocks.text)", keep: (r) => !WRONG_NAME.test(r.p) && !OPTION_NAME.test(r.p) && !TOKEN_SLOT.test(r.p) && !SPOT.has(key(r)) && !BR.has(key(r)) },
  { name: "P7 剔掉讲解散文(whyZh/explain/noteZh/correctionZh/oneLineRule/deepDive)", keep: (r) => !WRONG_NAME.test(r.p) && !OPTION_NAME.test(r.p) && !/(\.(whyZh|explain|noteZh|correctionZh|oneLineRule))$|deepDive\.(title|paragraphs\[\d+\])$/.test(r.p) && !SPOT.has(key(r)) && !BR.has(key(r)) },
  { name: "P8 剔掉讲解散文 + 纯词块槽", keep: (r) => !WRONG_NAME.test(r.p) && !OPTION_NAME.test(r.p) && !TOKEN_SLOT.test(r.p) && !/(\.(whyZh|explain|noteZh|correctionZh|oneLineRule))$|deepDive\.(title|paragraphs\[\d+\])$/.test(r.p) && !SPOT.has(key(r)) && !BR.has(key(r)) },
];
const negRecipes: Recipe[] = [
  { name: "N1 旧错侧名(wrong/wrongMark/distractors/wrongToken) · 不排 bothRight", note: "会把 bothRight 卡里的正确句算成错句", keep: (r) => WRONG_NAME.test(r.p) },
  { name: "N2 旧错侧名 + options[] · 不排 bothRight", note: "还会把 choose/replace 的**正确**选项算成错句", keep: (r) => (WRONG_NAME.test(r.p) || OPTION_NAME.test(r.p)) },
  { name: "N3 真错侧 = 旧错侧名 − bothRight.wrong + options[]里非 answer 的那些", keep: (r) => (WRONG_NAME.test(r.p) && !BR.has(key(r))) || (OPTION_NAME.test(r.p) && !isCorrectOption(r)) },
  { name: "N4 真错侧 = 旧错侧名 − bothRight.wrong（不含 options）", keep: (r) => (WRONG_NAME.test(r.p) && !BR.has(key(r))) || SPOT.has(key(r)) },
];
/** options[i] 是否就是该题的 answer（= 正确选项）。 */
function isCorrectOption(r: Row): boolean {
  const m = /options\[(\d+)\]$/.exec(r.p);
  if (!m) return false;
  const gi = /^guided\[(\d+)\]/.exec(r.p);
  const L = grammarLessons.find((x) => x.number === r.L);
  if (!L || !gi) return false;
  const g = (L.guided ?? [])[Number(gi[1])];
  return !!g && g.answer === r.s;
}

const forms = ["give", "gives", "gave", "given", "giving"];
const stat = (w: string, keep: (r: Row) => boolean) => {
  const t = wbTest(w);
  const rows = F.filter((r) => keep(r) && t(r.s));
  const occ = rows.reduce((a, r) => a + wbCount(w, r.s), 0);
  const uniq = new Set(rows.map((r) => r.s.trim())).size;
  return { fields: rows.length, occ, uniq };
};
const hr = (t: string) => console.log(`\n${"=".repeat(104)}\n${t}\n${"=".repeat(104)}`);
const pad = (s: string, n: number) => s.padStart(n);

hr("A · 正侧口径穷举（字段数 / 出现次数 / 去重整句数）");
console.log("口径".padEnd(58) + forms.map((w) => (w + "  f/o/u").padStart(18)).join(""));
for (const rc of posRecipes) {
  console.log(rc.name.padEnd(58) + forms.map((w) => { const s = stat(w, rc.keep); return `${pad(String(s.fields), 5)}/${pad(String(s.occ), 3)}/${pad(String(s.uniq), 3)}`.padStart(18); }).join(""));
}
console.log("\n简报（第 47 批）正侧:".padEnd(54) + forms.map((w, i) => pad(["25", "0", "0", "0", "—"][i], 18)).join(""));

hr("B · 错侧口径穷举（字段数 / 出现次数 / 去重整句数）");
console.log("口径".padEnd(58) + forms.map((w) => (w + "  f/o/u").padStart(18)).join(""));
for (const rc of negRecipes) {
  console.log(rc.name.padEnd(58) + forms.map((w) => { const s = stat(w, rc.keep); return `${pad(String(s.fields), 5)}/${pad(String(s.occ), 3)}/${pad(String(s.uniq), 3)}`.padStart(18); }).join(""));
}
console.log("\n简报（第 47 批）错侧:".padEnd(54) + forms.map((w, i) => pad(["5", "1", "1", "0", "—"][i], 18)).join(""));

hr("C · 结构诊断：N1 / N2 各自到底命中了哪几处（用来验证简报「错侧 give=5」的来历）");
for (const rc of [negRecipes[0], negRecipes[1], negRecipes[3]]) {
  const rows = F.filter((r) => rc.keep(r) && wbTest("give")(r.s));
  console.log(`\n  ── ${rc.name}  → give 命中 ${rows.length} 处`);
  for (const r of rows) {
    const flag = BR.has(key(r)) ? "bothRight卡里的正确句" : isCorrectOption(r) ? "options里等于answer的正确项" : "真错句";
    console.log(`     L${r.L}/${r.p}  ::  "${r.s.slice(0, 70)}"   ← ${flag}`);
  }
}

hr("D · give 的正侧去重整句（P1 口径，供对照卡避重）");
const p1 = posRecipes[0].keep;
const giveRows = F.filter((r) => p1(r) && wbTest("give")(r.s));
const bySent = new Map<string, string[]>();
for (const r of giveRows) { const k = r.s.trim(); if (!bySent.has(k)) bySent.set(k, []); bySent.get(k)!.push(`L${r.L}/${r.p}`); }
console.log(`  P1 口径 ${giveRows.length} 字段 → ${bySent.size} 个不同字符串`);
[...bySent.entries()].sort((a, b) => b[1].length - a[1].length).forEach(([s, w]) =>
  console.log(`   [${String(w.length).padStart(2)}处] "${s.replace(/\n/g, " ").slice(0, 92)}"  ← ${w.map((x) => x.split("/")[0]).filter((v, i, a) => a.indexOf(v) === i).join(",")}`)
);

hr("E · 句子槽去重（P5 口径）：用户真正会读到/写到的 give 句");
const p5 = posRecipes[4].keep;
const sRows = F.filter((r) => p5(r) && wbTest("give")(r.s));
console.log(`  ${sRows.length} 字段 → ${new Set(sRows.map((r) => r.s.trim())).size} 个不同整句`);
for (const s of [...new Set(sRows.map((r) => r.s.trim()))].sort()) {
  const where = sRows.filter((r) => r.s.trim() === s).map((r) => `L${r.L}/${r.p}`);
  console.log(`   "${s}"  ← ${where.length} 处 ${where.join(" ")}`);
}

hr("F · gave 逐个口径的明细（关键：它在「句子」里出现几次）");
for (const rc of [...posRecipes, ...negRecipes]) {
  const rows = F.filter((r) => rc.keep(r) && wbTest("gave")(r.s));
  console.log(`  ${rc.name.padEnd(58)} → ${rows.length} 处`);
  for (const r of rows) console.log(`        L${r.L}/${r.p} :: ${r.s.replace(/\n/g, " ").slice(0, 100)}`);
}

hr("G · 全库最终记账（课时 + 案件）");
const huntSlots = (c: (typeof huntCases)[number]): [string, string][] => [
  ...c.tokens.map((t, i) => [`tokens[${i}]`, t] as [string, string]),
  ...(c.errors ?? []).flatMap((e, i) => [[`errors[${i}].original`, e.original], [`errors[${i}].correction`, e.correction], [`errors[${i}].explanation`, e.explanation]] as [string, string][]),
  ...(c.notes ?? []).map((x, i) => [`notes[${i}].zh`, x.zh] as [string, string][]),
];
const H: { id: string; p: string; s: string }[] = [];
for (const c of huntCases) for (const [p, t] of huntSlots(c)) H.push({ id: `#${c.number}`, p, s: t });
for (const w of [...forms, "gived", "gaved"]) {
  const lh = F.filter((r) => wbTest(w)(r.s));
  const hh = H.filter((r) => wbTest(w)(r.s));
  console.log(`  ${w.padEnd(8)} 课时字段 ${pad(String(lh.length), 3)}  案件字段 ${pad(String(hh.length), 2)}  ${hh.map((r) => `${r.id}/${r.p}`).join(" ")}`);
}

hr("H · huntCases 里 give-family 的逐槽");
for (const w of [...forms, "gived", "gaved"]) {
  const hits = H.filter((r) => wbTest(w)(r.s));
  console.log(`\n  ── ${w}  ${hits.length} 处`);
  for (const h of hits) console.log(`     ${h.id} ${h.p} :: ${h.s.slice(0, 140)}`);
}
