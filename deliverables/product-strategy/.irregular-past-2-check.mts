/**
 * 瑞思 · 第 43 批核查脚本（只读，不改任何数据）。
 * 运行：./node_modules/.bin/vite-node <此文件>
 * 口径：一律用「解析后的数据对象」逐字段判定，不用 grep、不看源码文本行。
 */
import { grammarLessons } from "../../src/data/grammarLessons";
import { huntCases } from "../../src/data/huntCases";
import { GRAMMAR_ZERO_TERMS, findZeroTermHits } from "../../src/data/grammarZeroTerms";

/** 词边界：排除连字符与字母相邻（`(?<![A-Za-z-])w(?![A-Za-z-])`）。 */
const wb = (w: string, flags = "") => new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`, flags);

function strings(v: unknown, path = "", out: { p: string; s: string }[] = []) {
  if (typeof v === "string") out.push({ p: path, s: v });
  else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${path}[${i}]`, out));
  else if (v && typeof v === "object")
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) strings(x, path ? `${path}.${k}` : k, out);
  return out;
}

type Row = { L: number; p: string; s: string };
const LESSON_FIELDS: Row[] = [];
for (const L of grammarLessons) for (const { p, s } of strings(L)) LESSON_FIELDS.push({ L: L.number, p, s });

/** 错侧字段（被明确标为「这样说不对」或充作干扰项）。 */
const WRONG_SIDE = /\.(wrong|wrongMark)$|distractors\[\d+\]$|\.wrongToken$/;
/** 展示槽：用户被明确告知「照这样说」的位置。 */
const MODEL_SLOT =
  /(^|\.)(targetSentence|dialogueEn|oneLineRule|grammarLabel|title)$|(^|\.)examples\[\d+\]\.(en|zh)$|(^|\.)contrast\[\d+\]\.(correct|whyZh)$|(^|\.)variants\[\d+\]\.(en|noteZh)$|(^|\.)sceneSwings\[\d+\]\.(en|zh)$|(^|\.)dialogue\[\d+\]\.(en|zh)$|(^|\.)blocks\[\d+\]\.(text|role)$|(^|\.)summary\.(rule|points\[\d+\])$|(^|\.)deepDive\.(title|paragraphs\[\d+\])$|(^|\.)guided\[\d+\]\.(answer|explain|promptZh|correctionZh|before|after|replaceBase|replaceTarget)$|(^|\.)practice\[\d+\]\.(answer|promptZh)$|(^|\.)recall\.(promptZh|intentZh|answer|noteZh)$|(^|\.)sceneSetupZh$/;
/** 句子槽（真正被当成「一句话」呈现的位置，不含讲解散文）。 */
const SENTENCE_SLOT =
  /(^|\.)(targetSentence|dialogueEn)$|(^|\.)examples\[\d+\]\.en$|(^|\.)contrast\[\d+\]\.correct$|(^|\.)variants\[\d+\]\.en$|(^|\.)sceneSwings\[\d+\]\.en$|(^|\.)dialogue\[\d+\]\.en$|(^|\.)blocks\[\d+\]\.text$|(^|\.)guided\[\d+\]\.(answer|replaceBase)$|(^|\.)practice\[\d+\]\.answer$|(^|\.)recall\.answer$/;

const tally = (w: string, keep: (r: Row) => boolean) => {
  const re = wb(w, "g");
  let n = 0;
  const lessons = new Set<number>();
  for (const r of LESSON_FIELDS) {
    if (!keep(r)) continue;
    const k = (r.s.match(re) ?? []).length;
    if (k) { n += k; lessons.add(r.L); }
  }
  return { n, lessons: [...lessons].sort((a, b) => a - b) };
};
const huntTally = (w: string) => {
  const re = wb(w);
  const hits: string[] = [];
  for (const c of huntCases) {
    const slots: [string, string][] = [
      ...c.tokens.map((t, i) => [`token[${i}]`, t] as [string, string]),
      ...(c.errors ?? []).flatMap((e, i) =>
        [
          [`errors[${i}].original`, e.original],
          [`errors[${i}].correction`, e.correction],
          [`errors[${i}].explanation`, e.explanation],
        ] as [string, string][]
      ),
      ...(c.notes ?? []).map((x, i) => [`notes[${i}].zh`, x.zh] as [string, string]),
    ];
    for (const [p, t] of slots) if (re.test(t)) hits.push(`#${c.number} ${c.id} ${p}`);
  }
  return hits;
};

// ── 累计词表（与 D 层守门同口径） ──
const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
const words = (v: string) => norm(v).split(" ").filter(Boolean);
function cumulativeUpTo(n: number) {
  const cum = new Set<string>();
  for (const L of [...grammarLessons].sort((a, b) => a.number - b.number)) {
    const vocab = new Set<string>();
    const add = (t?: string) => { if (t) for (const w of words(t)) vocab.add(w); };
    add(L.targetSentence);
    for (const e of L.examples ?? []) add(e.en);
    for (const b of L.blocks ?? []) add(b.text);
    for (const l of L.dialogue ?? []) add(l.en);
    for (const c of L.contrast ?? []) { add(c.correct); add(c.wrong); }
    for (const v of L.variants ?? []) add(v.en);
    for (const s of L.sceneSwings ?? []) add(s.en);
    for (const g of L.guided ?? []) { if (g.answer) add(g.answer); for (const t of g.tokens ?? []) add(t); }
    if (L.recall?.answer) add(L.recall.answer);
    vocab.delete("");
    for (const w of vocab) cum.add(w);
    if (L.number === n) break;
  }
  return cum;
}
const longestClause = (s: string) =>
  Math.max(...s.split(/[.!?]\s*/).filter((c) => c.trim()).map((c) => c.trim().split(/\s+/).length));

const NEW_PAST = ["swam", "sang", "kept", "felt", "gave", "caught", "sat"];
const BASE = ["swim", "sing", "keep", "feel", "give", "catch", "sit"];

const hr = (t: string) => console.log(`\n${"=".repeat(72)}\n${t}\n${"=".repeat(72)}`);

hr("核查 0 · 数据基线");
console.log(`grammarLessons: ${grammarLessons.length} 课（末课 ${grammarLessons[grammarLessons.length - 1].id}）`);
console.log(`huntCases:      ${huntCases.length} 案（末案 #${huntCases[huntCases.length - 1].number}）`);
console.log(`零术语词表:     ${GRAMMAR_ZERO_TERMS.length} 个 —— ${GRAMMAR_ZERO_TERMS.join(" ")}`);

hr("核查 1 · 7 个目标过去式：全库出现情况（期望：从未作为展示句出现）");
console.log("词".padEnd(10) + "总字段  句子槽  展示槽  错侧   huntCases");
for (const w of NEW_PAST) {
  const all = tally(w, () => true);
  const sent = tally(w, (r) => SENTENCE_SLOT.test(r.p) && !WRONG_SIDE.test(r.p));
  const model = tally(w, (r) => MODEL_SLOT.test(r.p) && !WRONG_SIDE.test(r.p));
  const wrong = tally(w, (r) => WRONG_SIDE.test(r.p));
  console.log(
    w.padEnd(10) +
      String(all.n).padStart(4) + String(sent.n).padStart(8) + String(model.n).padStart(8) +
      String(wrong.n).padStart(6) + "   " + (huntTally(w).length || "—")
  );
}
console.log("\n⚠️ kept / felt / gave 各 1 处的唯一来源（用户不会被教到这句）：");
for (const w of ["kept", "felt", "gave"]) {
  for (const r of LESSON_FIELDS) if (wb(w).test(r.s)) console.log(`   ${w}  L${r.L} ${r.p}  ::  ${r.s.slice(0, 90)}…`);
}
console.log("\ngave 在 huntCases 里的身份（是「正确 token」，不是被纠错的词）：");
for (const h of huntTally("gave")) console.log(`   ${h}`);

hr("核查 2 · 7 个原词：全库出现情况（证明「原词早就教过很多次」）");
console.log("词".padEnd(10) + "总字段  句子槽  展示槽  错侧   huntCases");
for (const w of BASE) {
  const all = tally(w, () => true);
  const sent = tally(w, (r) => SENTENCE_SLOT.test(r.p) && !WRONG_SIDE.test(r.p));
  const model = tally(w, (r) => MODEL_SLOT.test(r.p) && !WRONG_SIDE.test(r.p));
  const wrong = tally(w, (r) => WRONG_SIDE.test(r.p));
  console.log(
    w.padEnd(10) + String(all.n).padStart(4) + String(sent.n).padStart(8) + String(model.n).padStart(8) +
      String(wrong.n).padStart(6) + "   " + (huntTally(w).length || "—")
  );
}
console.log("\n⚠️ 本报告的计数口径与批四十二简报给的数字不同（简报 swim=36 / sing=41 / keep=33…）。");
console.log("   简报数字在下列任何口径下都不复现（我的机器实测，见核查 9）；本报告一律采自报实测值。");

hr("核查 3 · L197 的 deepDive 承诺了哪些词，实际又给了哪些");
const PROMISED = ["went", "ate", "saw", "bought", "thought", "knew", "gave", "told", "felt", "kept"];
for (const w of PROMISED) {
  const sent = tally(w, (r) => SENTENCE_SLOT.test(r.p) && !WRONG_SIDE.test(r.p));
  const all = tally(w, () => true);
  const onlyList = all.n > 0 && sent.n === 0;
  console.log(
    `  ${w.padEnd(8)} 句子槽=${String(sent.n).padStart(3)}  全库=${String(all.n).padStart(4)}` +
      (onlyList ? "   ⚠️ 只出现在 L197 deepDive 的「点名清单」里，从未作为句子出现过" : "")
  );
}

hr("核查 4 · 这四个「变化方式」本身有没有被教过（决定能不能按规律分组）");
const probe = (label: string, re: RegExp) => {
  const hits = LESSON_FIELDS.filter((r) => re.test(r.s));
  const ls = [...new Set(hits.map((h) => h.L))];
  console.log(`  ${label.padEnd(34)} 命中 ${String(hits.length).padStart(3)} 字段  课=[${ls.join(",") || "—"}]`);
  for (const h of hits.slice(0, 3)) console.log(`      L${h.L} ${h.p} :: ${h.s.replace(/\n/g, " ").slice(0, 100)}`);
};
probe("「i 换成 a」这类讲法", /i\s*(换成|变)\s*a/);
probe("「-ought／-aught」这类讲法", /ought|aught/);
probe("「两个 ee 变短／尾巴换 t」这类讲法", /(ee|双写|尾巴).{0,12}(变|换)/);

hr("核查 5 · 拆课方案：四个 targetSentence 的全部守门");
console.log(`  L197 基线 longestClause = ${longestClause(grammarLessons.find((l) => l.number === 197)!.targetSentence)} → L198 上限 = 13（跳 ≤5）\n`);
const PLAN: { id: string; pts: string; scene: string; s: string; zh: string }[] = [
  { id: "L198", pts: "swam + sang", scene: "ocean", s: "We swam in the water and sang together.", zh: "我们在水里游了泳，还一起唱了歌。" },
  { id: "L199", pts: "sat + gave", scene: "train", s: "I sat next to her and gave her the book.", zh: "我坐在她旁边，把书递给了她。" },
  { id: "L200", pts: "kept + felt", scene: "snow", s: "I felt cold in the snow, but I kept reading.", zh: "雪地里我觉得冷，可还是一直往下看。" },
  { id: "L201", pts: "caught", scene: "city", s: "I got up early and caught the bus.", zh: "我起得很早，赶上了那班车。" },
];
const cum197 = cumulativeUpTo(197);
let prev = longestClause(grammarLessons.find((l) => l.number === 197)!.targetSentence);
for (const p of PLAN) {
  const lc = longestClause(p.s);
  const ws = words(p.s);
  const miss = [...new Set(ws.filter((w) => !cum197.has(w)))];
  const jump = lc - prev;
  const ok = jump <= 5 && miss.length <= 2;
  console.log(`  ${ok ? "✅" : "❌"} ${p.id} [${p.pts}] scene=${p.scene}`);
  console.log(`       "${p.s}"  （${lc} 词，跳 ${jump > 0 ? "+" + jump : jump}）`);
  console.log(`       未教过的词：${miss.length ? miss.join("、") : "（无）"}   ← 必须恰好是本课新点`);
  prev = lc;
}

hr("核查 6 · 四个 targetSentence 的场景选择依据（末次使用课号）");
const lastUse = new Map<string, number>();
for (const L of grammarLessons) lastUse.set(L.scene, L.number);
const counts = new Map<string, number>();
for (const L of grammarLessons) counts.set(L.scene, (counts.get(L.scene) ?? 0) + 1);
for (const sc of ["island", "train", "snow", "city", "mansion", "space", "ocean", "forest", "campus", "lighthouse", "desert", "magic", "mystery", "sparkle"]) {
  console.log(`  ${sc.padEnd(11)} 共 ${String(counts.get(sc) ?? 0).padStart(3)} 课   末次 L${lastUse.get(sc) ?? "—"}`);
}

hr("核查 7 · 计划文案的零术语与星号守门");
const ZH = [
  "中间的字母 i 换成 a，别的字母一个都不动：swim→swam、sing→sang。",
  "昨天在水里游了一圈，就说 swam；昨天唱了歌，就说 sang。",
  "加 -ed 那套规矩管不住它们——它们是英语里最老的词，各留各的样子。",
  "说「不」和问句里它们反而变回原来的样子：didn't swim、Did you sing?",
  "同一个换法再吃两个：sit→sat、give→gave——i 换成 a，别的字母都不动。",
  "昨天坐在谁的旁边、昨天把书递给了谁，都用这一套。",
  "两个 ee 变短成一个 e，尾巴上再加一个 t：keep→kept、feel→felt。",
  "昨天觉得冷、昨天一直看下去——这两句里的词尾巴上都多一个 t。",
  "注意别和第 193 课那个 fell 弄混：fell 是 fall 的昨天版，felt 是 feel 的昨天版。",
  "尾巴都是同一串：-ought／-aught——bought、thought、caught 是一家。",
  "昨天赶上了那一班车就说 caught，不加 -ed。",
  "第 173 课那句是「为了赶上」，catch 前面有 to；今天这句是「赶上了」，说 caught。",
  "它是「抓、接住、赶上」那个词的昨天版。",
];
let zt = 0, st = 0;
for (const t of ZH) {
  const h = findZeroTermHits(t);
  if (h.length) { zt++; console.log(`  ❌ 零术语命中 ${JSON.stringify(h)} :: ${t}`); }
  if (t.includes("**")) { st++; console.log(`  ❌ 星号 :: ${t}`); }
}
console.log(`  零术语违规 ${zt} 处／星号违规 ${st} 处（chinese copy ${ZH.length} 条）`);
for (const p of PLAN) {
  if (findZeroTermHits(p.s).length) console.log(`  ❌ 英文句命中术语 :: ${p.s}`);
  if (p.s.includes("**")) console.log(`  ❌ 星号 :: ${p.s}`);
}

hr("核查 8 · 对照卡引用的每一句都真实存在（字符串精确匹配）");
const CITED = [
  "Yesterday I went to the park.",
  "I ate two sandwiches.",
  "I drank tea.",
  "I met my friend.",
  "I bought two notebooks.",
  "I was reading when the phone rang.",
  "I am learning to swim.",
  "Please give me the book.",
  "He sits next to me.",
  "I sit between Tom and Amy.",
  "The water feels cold.",
  "I keep reading at night.",
  "I feel much better today.",
  "I got up early in order to catch the bus.",
  "I put my bag next to the door.",
  "I thought about it and knew the answer.",
  "My desk is next to the window.",
  "The song was sung by her.",
  "He was so tired that he fell asleep.",
];
for (const c of CITED) {
  const ls = [...new Set(LESSON_FIELDS.filter((r) => r.s.trim() === c).map((r) => r.L))].sort((a, b) => a - b);
  console.log(`  ${ls.length ? "✅" : "❌"} "${c}"  →  ${ls.length ? "L" + ls.join(", L") : "未找到"}`);
}

hr("核查 9 · 对批四十二简报数字的复现尝试（结论：不复现）");
const BRIEF: Record<string, number> = { swim: 36, sing: 41, keep: 33, feel: 24, give: 22, catch: 20, sit: 23 };
const recipes: [string, (r: Row) => boolean][] = [
  ["全部字段", () => true],
  ["非错侧全部字段", (r) => !WRONG_SIDE.test(r.p)],
  ["句子槽（非错侧）", (r) => SENTENCE_SLOT.test(r.p) && !WRONG_SIDE.test(r.p)],
  ["展示槽（非错侧）", (r) => MODEL_SLOT.test(r.p) && !WRONG_SIDE.test(r.p)],
  ["仅 examples[].en", (r) => /(^|\.)examples\[\d+\]\.en$/.test(r.p)],
  ["仅 en 结尾字段", (r) => /(^|\.)en$/.test(r.p) && !WRONG_SIDE.test(r.p)],
];
console.log("口径".padEnd(20) + BASE.map((w) => w.padStart(7)).join(""));
for (const [name, f] of recipes) {
  console.log(name.padEnd(20) + BASE.map((w) => String(tally(w, f).n).padStart(7)).join(""));
}
console.log("简报".padEnd(20) + BASE.map((w) => String(BRIEF[w]).padStart(7)).join(""));
console.log("→ 任一单一口径都对不上；简报数字疑为混合口径或旧基线，本报告不采用。");

hr("核查 10 · huntCases 零术语（用户可见字段）现状");
const HUNT_TERM = new Map<string, number>();
let huntViol = 0;
for (const c of huntCases) {
  const slots: [string, string][] = [
    ...c.tokens.map((t, i) => [`token[${i}]`, t] as [string, string]),
    ...(c.errors ?? []).flatMap((e, i) =>
      [
        [`errors[${i}].original`, e.original],
        [`errors[${i}].correction`, e.correction],
        [`errors[${i}].explanation`, e.explanation],
      ] as [string, string][]
    ),
    ...(c.notes ?? []).map((x, i) => [`notes[${i}].zh`, x.zh] as [string, string]),
  ];
  for (const [, t] of slots) for (const h of findZeroTermHits(t)) { huntViol++; HUNT_TERM.set(h, (HUNT_TERM.get(h) ?? 0) + 1); }
}
console.log(`  huntCases 用户可见字段零术语命中：${huntViol} 处`);
for (const [t, n] of [...HUNT_TERM].sort((a, b) => b[1] - a[1])) console.log(`      ${t.padEnd(8)} ${n}`);
console.log("  ↳ grammarLessons 有遍历式零术语守门，huntCases **没有**——这是同一条红线的缺口。");
