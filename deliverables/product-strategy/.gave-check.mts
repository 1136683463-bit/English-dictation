/**
 * 瑞思 · 第 47 批核查脚本（gave）—— 只读，不改任何数据。
 * 运行：./node_modules/.bin/vite-node deliverables/product-strategy/.gave-check.mts
 *
 * 口径声明（严格）：
 *  - 一律用「解析后的数据对象」逐字段判定，**不用 grep**（本地 grep 是 ugrep，会假返回 0）。
 *  - 词边界：`(?<![A-Za-z-])w(?![A-Za-z-])` —— 排除连字符与字母相邻（gives 不命中 give）。
 *  - 路径键一律用 `L<number>|<path>`（路径本身不含课号，必须配对课号才唯一）。
 *  - **必须排除两类**（否则计数虚高）：
 *      ① spot 题的 `answer`（= wrongToken，是要用户点出的**错词**）
 *      ② `bothRight: true` 卡的 `wrong` 字段（那里装的是**正确句**）
 */
import { grammarLessons } from "../../src/data/grammarLessons";
import { huntCases } from "../../src/data/huntCases";

const wb = (w: string, flags = "") => new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`, flags);

function strings(v: unknown, path = "", out: { p: string; s: string }[] = []): { p: string; s: string }[] {
  if (typeof v === "string") out.push({ p: path, s: v });
  else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${path}[${i}]`, out));
  else if (v && typeof v === "object")
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) strings(x, path ? `${path}.${k}` : k, out);
  return out;
}

type Row = { L: number; p: string; s: string };
const LESSON_FIELDS: Row[] = [];
for (const L of grammarLessons) for (const { p, s } of strings(L)) LESSON_FIELDS.push({ L: L.number, p, s });
const key = (r: { L: number; p: string }) => `${r.L}|${r.p}`;

/** 错侧字段名（被明确标为「这样说不对」或充作干扰项）。 */
const WRONG_SIDE_NAME = /\.(wrong|wrongMark)$|distractors\[\d+\]$|\.wrongToken$|\.options\[\d+\]$/;

/** 排除 ①：spot 题的 answer（= wrongToken，用户要点出的**错词**）。 */
const SPOT_ANSWER_KEYS = new Set<string>();
/** 排除 ②：bothRight 卡的 wrong 字段（装的是**正确句**）。 */
const BOTHRIGHT_WRONG_KEYS = new Set<string>();
for (const L of grammarLessons) {
  (L.guided ?? []).forEach((g, i) => {
    if (g.kind === "spot") SPOT_ANSWER_KEYS.add(`${L.number}|guided[${i}].answer`);
  });
  (L.contrast ?? []).forEach((c, i) => {
    if (c.bothRight) BOTHRIGHT_WRONG_KEYS.add(`${L.number}|contrast[${i}].wrong`);
  });
}

/**
 * 真·错侧：字段名是错侧，**且不是** bothRight 卡里那句正确句；
 * 或者它是 spot 题的 answer（answer 这个名字看着像正侧，其实是错词）。
 */
const isTrueWrong = (r: Row) =>
  (WRONG_SIDE_NAME.test(r.p) && !BOTHRIGHT_WRONG_KEYS.has(key(r))) || SPOT_ANSWER_KEYS.has(key(r));
/** 正侧：既不是错侧字段名，也不是 spot 的 answer。 */
const isPositive = (r: Row) => !isTrueWrong(r);

const tally = (w: string, keep: (r: Row) => boolean) => {
  const re = wb(w, "g");
  let occ = 0; // 出现次数
  let fields = 0; // 含该词的字段数
  const ls = new Set<number>();
  for (const r of LESSON_FIELDS) {
    if (!keep(r)) continue;
    const k = (r.s.match(re) ?? []).length;
    if (k) { occ += k; fields++; ls.add(r.L); }
  }
  return { occ, fields, lessons: [...ls].sort((a, b) => a - b) };
};

function huntSlots(c: (typeof huntCases)[number]): [string, string][] {
  return [
    ...c.tokens.map((t, i) => [`token[${i}]`, t] as [string, string]),
    ...(c.errors ?? []).flatMap((e, i) =>
      [
        [`errors[${i}].original`, e.original],
        [`errors[${i}].correction`, e.correction],
        [`errors[${i}].explanation`, e.explanation],
      ] as [string, string][]
    ),
    ...(c.notes ?? []).map((x, i) => [`notes[${i}].zh`, x.zh] as [string, string][]),
  ];
}

const hr = (t: string) => console.log(`\n${"=".repeat(78)}\n${t}\n${"=".repeat(78)}`);

hr("核查 0 · 数据基线 / 排除集");
console.log(`grammarLessons: ${grammarLessons.length} 课（末课 ${grammarLessons[grammarLessons.length - 1].id} / number ${grammarLessons[grammarLessons.length - 1].number}）`);
console.log(`huntCases:      ${huntCases.length} 案（末案 #${huntCases[huntCases.length - 1].number}）`);
console.log(`排除 ① spot.answer: ${SPOT_ANSWER_KEYS.size} 条 → ${[...SPOT_ANSWER_KEYS].join("  ")}`);
console.log(`排除 ② bothRight.wrong: ${BOTHRIGHT_WRONG_KEYS.size} 条 → ${[...BOTHRIGHT_WRONG_KEYS].sort().join("  ")}`);

hr("核查 1 · 五个形式：正侧 / 真错侧（本报告的正式口径 = 口径 F）");
const FORMS = ["give", "gives", "gave", "given", "giving"];
console.log("词".padEnd(9) + "正侧字段  正侧出现  正侧课   |  错侧字段  错侧出现  错侧位置");
for (const w of FORMS) {
  const pos = tally(w, isPositive);
  const neg = tally(w, isTrueWrong);
  const negWhere = LESSON_FIELDS.filter((r) => isTrueWrong(r) && wb(w).test(r.s))
    .map((r) => `L${r.L}/${r.p}`).join(" ");
  console.log(
    w.padEnd(11) + String(pos.fields).padStart(7) + String(pos.occ).padStart(10) +
      String("[" + pos.lessons.join(",") + "]").padStart(12) + "   |" +
      String(neg.fields).padStart(9) + String(neg.occ).padStart(10) + "   " + (negWhere || "—")
  );
}

hr("核查 1b · 对简报数字（give 25/5、gives 0/1、gave 0/1、given 0/0）的复现尝试");
type Recipe = [string, (r: Row) => boolean];
const SENT_SLOT = /(^|\.)(targetSentence|dialogueEn|oneLineRule|grammarLabel|title)$|(^|\.)examples\[\d+\]\.en$|(^|\.)contrast\[\d+\]\.(correct|whyZh)$|(^|\.)variants\[\d+\]\.en$|(^|\.)sceneSwings\[\d+\]\.en$|(^|\.)dialogue\[\d+\]\.en$|(^|\.)blocks\[\d+\]\.text$|(^|\.)summary\.(rule|points\[\d+\])$|(^|\.)deepDive\.paragraphs\[\d+\]$|(^|\.)guided\[\d+\]\.(answer|explain|promptZh|correctionZh|before|after|replaceBase|replaceTarget|tokens\[\d+\])$|(^|\.)practice\[\d+\]\.(answer|promptZh|tokens\[\d+\]|distractors\[\d+\])$|(^|\.)recall\.(promptZh|intentZh|answer|noteZh)$/;
const recipes: Recipe[] = [
  ["A 全字段·真错侧口径", isPositive],
  ["B 全字段·旧错侧口径（照抄会给假数）", (r) => !(WRONG_SIDE_NAME.test(r.p) || SPOT_ANSWER_KEYS.has(key(r)))],
  ["C 句子槽（真错侧口径）", (r) => isPositive(r) && SENT_SLOT.test(r.p)],
  ["D 只 examples[].en + targetSentence + dialogueEn", (r) => isPositive(r) && /(^|\.)(targetSentence|dialogueEn|examples\[\d+\]\.en)$/.test(r.p)],
  ["E 排除讲解散文（whyZh/explain/noteZh/oneLineRule/deepDive）", (r) => isPositive(r) && !/(\.(whyZh|explain|noteZh|oneLineRule|correctionZh))$|deepDive\.(title|paragraphs\[\d+\])$/.test(r.p)],
];
console.log("口径".padEnd(46) + FORMS.map((w) => w.padStart(8)).join(""));
for (const [name, f] of recipes) {
  console.log(name.padEnd(46) + FORMS.map((w) => String(tally(w, f).occ).padStart(8)).join(""));
}
console.log("简报（第 47 批）".padEnd(40) + ["25", "0", "0", "0", "—"].map((x) => x.padStart(8)).join(""));
console.log("简报错侧（第 47 批）".padEnd(38) + ["5", "1", "1", "0", "—"].map((x) => x.padStart(8)).join(""));
console.log("\n  ↳ 逐条核对每个口径下的错侧数：");
for (const [name, f] of recipes) {
  console.log(
    "    " + name.padEnd(46) +
      FORMS.map((w) => String(tally(w, (r) => f(r) && isTrueWrong(r)).occ).padStart(8)).join("")
  );
}

hr("核查 1c · 正侧逐条：give（本报告口径 F：全字段 · 真错侧）");
const givePos = LESSON_FIELDS.filter((r) => isPositive(r) && wb("give").test(r.s));
console.log(`  共 ${givePos.length} 字段`);
for (const r of givePos) console.log(`   L${r.L} ${r.p}  ::  ${r.s.replace(/\n/g, " ").slice(0, 128)}`);

hr("核查 1d · 真错侧逐条：give / gives / gave / given（这就是「排除两类」的实证）");
for (const w of ["give", "gives", "gave", "given"]) {
  const hits = LESSON_FIELDS.filter((r) => isTrueWrong(r) && wb(w).test(r.s));
  console.log(`\n  ── ${w}  真错侧 ${hits.length} 字段`);
  for (const h of hits) {
    const why = BOTHRIGHT_WRONG_KEYS.has(key(h)) ? "（bothRight 卡：这句其实是**正确句**）" : SPOT_ANSWER_KEYS.has(key(h)) ? "（spot 题 answer：这是要用户点出的**错词**）" : "（真错句）";
    console.log(`     L${h.L} ${h.p}  ::  ${h.s.replace(/\n/g, " ").slice(0, 110)}  ${why}`);
  }
}

hr("核查 1e · 被排除的两类，逐条列出（如果照抄简报会算错的地方）");
console.log("  ① spot 题的 answer（全库，含 non-give 的对照组）：");
for (const L of grammarLessons) {
  (L.guided ?? []).forEach((g, i) => {
    if (g.kind === "spot") {
      console.log(`     L${L.number} guided[${i}] answer="${g.answer}"  wrongToken="${g.wrongToken ?? ""}"  correctionZh="${g.correctionZh ?? ""}"`);
      console.log(`         tokens=${JSON.stringify(g.tokens)}`);
    }
  });
}
console.log("\n  ② bothRight 卡的 wrong（全库，这些 wrong 里装的是正确句）：");
for (const L of grammarLessons) {
  (L.contrast ?? []).forEach((c, i) => {
    if (c.bothRight) console.log(`     L${L.number} contrast[${i}] wrong="${c.wrong}"  correct="${c.correct}"`);
  });
}

hr("核查 2 · L199 对 gave 的「点名承诺」与实际交付");
const L199 = grammarLessons.find((l) => l.number === 199)!;
const gaveAll = LESSON_FIELDS.filter((r) => wb("gave").test(r.s));
console.log(`  gave 在全库（课时）出现 ${gaveAll.length} 字段：`);
for (const r of gaveAll) {
  console.log(`   L${r.L} ${r.p} [${isTrueWrong(r) ? "错侧" : "正侧"}]  ::  ${r.s.replace(/\n/g, " ").slice(0, 200)}`);
}
console.log(`\n  L199 contrast[5] 全文：`);
const c199 = L199.contrast![5];
console.log(`   bothRight=${c199.bothRight} wrong="${c199.wrong}" correct="${c199.correct}"`);
console.log(`   whyZh=「${c199.whyZh}」`);
console.log(`\n  ↳ 判定：gave 在**句子位置**上出现 0 处；唯一的 1 处是讲解散文里的「点名」。`);
console.log(`     即：用户读到「give 变 gave」，但从没见过 gave 真正用在句子里。`);
console.log(`\n  L199 practice[2]（gave 作为干扰项的那题）：`);
console.log(`   ${JSON.stringify(L199.practice![2], null, 2)}`);

hr("核查 3 · L63（give 的主课）全字段");
const L63 = grammarLessons.find((l) => l.number === 63)!;
console.log(`  id=${L63.id} title="${L63.title}" label="${L63.grammarLabel}" scene=${L63.scene}`);
console.log(`  target="${L63.targetSentence}" (${L63.targetSentence.trim().split(/\s+/).length} 词) intent="${L63.intentZh}"`);
console.log(`  blocks=${L63.blocks?.length} contrast=${L63.contrast?.length} guided=${L63.guided?.length} practice=${L63.practice?.length} examples=${L63.examples?.length} swings=${L63.sceneSwings?.length} variants=${L63.variants?.length} recall=${L63.recall ? "y" : "n"} deepDive=${L63.deepDive ? "y" : "n"}`);
console.log("\n  对照卡（6 张）：");
(L63.contrast ?? []).forEach((c, i) =>
  console.log(`   ${i + 1}) [${c.bothRight ? "双正解" : "纠错"}] wrong="${c.wrong}"  mark=${JSON.stringify(c.wrongMark ?? null)}\n      correct="${c.correct}"\n      whyZh="${c.whyZh}"`)
);
console.log("\n  practice（5 题）：");
(L63.practice ?? []).forEach((p, i) => console.log(`   ${i + 1}) promptZh="${p.promptZh}"\n      tokens=${JSON.stringify(p.tokens)} distractors=${JSON.stringify(p.distractors ?? [])}\n      answer="${p.answer}"`));

hr("核查 4 · 近 12 课结构（时序对齐）");
const longestClause = (s: string) =>
  Math.max(...s.split(/[.!?]\s*/).filter((c) => c.trim()).map((c) => c.trim().split(/\s+/).length));
const recent = [...grammarLessons].sort((a, b) => a.number - b.number).slice(-12);
for (const L of recent) {
  console.log(
    `  L${L.number} [${String(L.scene).padEnd(10)}] lc=${String(longestClause(L.targetSentence)).padStart(2)} ` +
      `blocks=${L.blocks?.length} contrast=${L.contrast?.length} guided=${L.guided?.length} practice=${L.practice?.length} ` +
      `examples=${L.examples?.length} swings=${L.sceneSwings?.length} deepDive=${L.deepDive ? "y" : "n"} recall=${L.recall ? "y" : "n"}`
  );
  console.log(`        label="${L.grammarLabel}"`);
  console.log(`        target="${L.targetSentence}"`);
  console.log(`        oneLine="${L.oneLineRule}"`);
}

hr("核查 5 · scene 分布（space 是否从未用过）");
const counts = new Map<string, number>();
const lastUse = new Map<string, number>();
for (const L of [...grammarLessons].sort((a, b) => a.number - b.number)) { counts.set(L.scene, (counts.get(L.scene) ?? 0) + 1); lastUse.set(L.scene, L.number); }
const ALL_SCENES = ["campus", "city", "train", "lighthouse", "desert", "space", "ocean", "island", "mansion", "forest", "snow", "magic", "mystery", "sparkle"];
for (const sc of ALL_SCENES) console.log(`  ${sc.padEnd(11)} 共 ${String(counts.get(sc) ?? 0).padStart(3)} 课   末次 L${lastUse.get(sc) ?? "—"}`);
console.log("  非 14 场景的值:", [...counts.keys()].filter((k) => !ALL_SCENES.includes(k)).join(" ") || "—");

hr("核查 6 · 全库检索：已存在的 give/gave 错句（防重复）");
const PATTERNS: [string, RegExp][] = [
  ["gived（加 -ed）", wb("gived")],
  ["gived / gaved", /giv(e|ed)?d$/i],
  ["gave ... to（位置：gave the X to Y）", /gave\s+(the|a|my|his|her)\s+\w+\s+to/i],
  ["give + 昨天时间词（原样当昨天版）", /give\b[^.]{0,40}(yesterday|last night|last week|this morning)/i],
  ["gave 后接 it 的位置问题", /gave\s+it\s+(me|her|him|us|them)/i],
  ["give it me / give me it", /give\s+it\s+me|give\s+me\s+it/i],
  ["I give her / give her a（原样）", /give\s+her\s+a/i],
  ["give me the book", /give\s+me\s+the\s+book/i],
  ["give it to me", /give\s+it\s+to\s+me/i],
  ["give the book to me", /give\s+the\s+book\s+to\s+me/i],
  ["被动/完成 given", wb("given", "i")],
];
for (const [label, re] of PATTERNS) {
  const hits = LESSON_FIELDS.filter((r) => re.test(r.s));
  console.log(`\n  ── ${label}  命中 ${hits.length} 字段`);
  for (const h of hits.slice(0, 14)) console.log(`     L${h.L} ${h.p} [${isTrueWrong(h) ? "错侧" : "正侧"}] :: ${h.s.replace(/\n/g, " ").slice(0, 120)}`);
  const hs = huntCases.filter((c) => huntSlots(c).some(([, t]) => re.test(t)));
  if (hs.length) console.log(`     huntCases: ${hs.map((c) => `#${c.number}(${c.id})`).join(" ")}`);
}

hr("核查 7 · huntCases 里 give/gave/gives/given 的全出现（逐槽）");
for (const w of ["give", "gives", "gave", "given", "gived"]) {
  const hits: string[] = [];
  for (const c of huntCases) for (const [p, t] of huntSlots(c)) if (wb(w).test(t)) hits.push(`#${c.number} ${c.id} ${p} :: ${t.slice(0, 110)}`);
  console.log(`\n  ── ${w}  ${hits.length} 处`);
  for (const h of hits) console.log(`     ${h}`);
}

hr("核查 8 · i→a 同族 + 全部已教不规则过去式的分布（定位 gave 的同伴）");
for (const w of ["sat", "swam", "sang", "began", "drank", "ran", "ate", "saw", "wore", "drew", "slept", "felt", "kept", "caught", "gave", "give"]) {
  const pos = tally(w, isPositive);
  const neg = tally(w, isTrueWrong);
  console.log(`  ${w.padEnd(8)} 正侧字段 ${String(pos.fields).padStart(3)} 出现 ${String(pos.occ).padStart(3)}  课[${pos.lessons.join(",") || "—"}]   错侧 ${String(neg.fields).padStart(2)}`);
}

hr("核查 9 · L199 的「i→a」讲法逐字（新课要接这条线）");
const law = LESSON_FIELDS.filter((r) => /i\s*(换成|变)\s*a/.test(r.s));
console.log(`  含「i 换成 a / i 变 a」的字段 ${law.length} 处：`);
for (const r of law) console.log(`   L${r.L} ${r.p} :: ${r.s.replace(/\n/g, " ").slice(0, 250)}`);
console.log("\n  含「元音换一下/尾巴不动」这类讲法：");
for (const r of LESSON_FIELDS.filter((x) => /元音|尾巴不动|两条线|这条线/.test(x.s))) {
  console.log(`   L${r.L} ${r.p} :: ${r.s.replace(/\n/g, " ").slice(0, 200)}`);
}

hr("核查 10 · L199 的完整 targetSentence 家族（供新课时序参考）");
for (const n of [196, 197, 198, 199, 200, 201, 202, 203]) {
  const L = grammarLessons.find((l) => l.number === n)!;
  console.log(`  L${n} [${L.scene}] "${L.targetSentence}"  (lc=${longestClause(L.targetSentence)})  contrast=${L.contrast?.length} practice=${L.practice?.length}`);
}
