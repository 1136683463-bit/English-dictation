/**
 * 第 49 批 · say 家族形状不均衡核查 · s01
 *
 * 口径阶梯（每一级都单独输出，报告里必须写清用的是哪一级）：
 *   V0 原始扫描   —— 课程对象里每一个字符串字段，含 id / scene / cover / episode 等元数据
 *   V1 内容字段   —— 剔除元数据（id / scene / cover / episode / grammarLabel / title 之外的 id 类）
 *   V2 正错二分   —— 把 V1 的命中分成「正侧（正确的英文）」与「错侧（错误的英文）」
 *   V3 权威口径   —— V2 再排除两类污染：
 *                   ① guided[kind=spot].answer  （= wrongToken，是让用户点出的错词，不是正例）
 *                   ② contrast[].wrong 且 bothRight===true （该字段装的是正确句，已计入 A4 正侧）
 *
 * 词边界正则：`(?<![A-Za-z-])FORM(?![A-Za-z-])` + i 旗标（大小写不敏感）
 * 注意：本文件用 node 直跑（vite-node），不用 grep。
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";

// ── 词边界命中 ────────────────────────────────────────────────
const RX = new Map<string, RegExp>();
function hit(form: string, text?: string | null): boolean {
  if (!text) return false;
  let rx = RX.get(form);
  if (!rx) {
    rx = new RegExp(`(?<![A-Za-z-])${form}(?![A-Za-z-])`, "i");
    RX.set(form, rx);
  }
  return rx.test(text);
}

type Side = "正" | "错" | "讲";
interface Rec {
  form: string;
  side: Side;
  /** V2 细分：A1 正句字段 / A2 答案与选项 / A3 replaceBase / A4 bothRight.wrong / W 错句 / C 中文讲解里引用的英文 */
  tier: string;
  lesson: number;
  lessonId: string;
  slot: string;
  text: string;
  /** V3 是否被判为污染而剔除 */
  v3Excluded: "" | "spot.answer(=wrongToken)" | "bothRight.wrong(已入A4)" | "元数据";
}

const META_SLOTS = new Set([
  "id",
  "scene",
  "cover",
  "episode",
  "grammarLabel",
  "title",
]);

function scanLesson(form: string): Rec[] {
  const out: Rec[] = [];
  const L = (lesson: (typeof grammarLessons)[number], slot: string, text: string | null | undefined, tier: string, side: Side, v3: Rec["v3Excluded"] = "") => {
    if (!hit(form, text)) return;
    out.push({ form, side, tier, lesson: lesson.number, lessonId: lesson.id, slot, text: text as string, v3Excluded: v3 });
  };

  for (const l of grammarLessons) {
    // ── 元数据（V0 计入，V1 起剔除）──
    L(l, "id", l.id, "meta", "讲", "元数据");
    L(l, "scene", l.scene, "meta", "讲", "元数据");
    L(l, "cover", l.cover, "meta", "讲", "元数据");
    L(l, "episode", l.episode, "meta", "讲", "元数据");
    L(l, "grammarLabel", l.grammarLabel, "meta", "讲", "元数据");
    L(l, "title", l.title, "meta", "讲", "元数据");

    // ── A1：正确的整句字段 ──
    L(l, "targetSentence", l.targetSentence, "A1", "正");
    L(l, "dialogueEn", l.dialogueEn, "A1", "正");
    for (const [i, d] of (l.dialogue ?? []).entries()) {
      // dialogue 拆两级：me 行 = 用户角色台词（关键：判断「用户是否拥有这个动词」）
      L(l, `dialogue[${i}].en(who=${d.who})`, d.en, d.who === "me" ? "A1-me" : "A1-npc", "正");
    }
    for (const [i, e] of l.examples.entries()) L(l, `examples[${i}].en`, e.en, "A1", "正");
    for (const [i, v] of (l.variants ?? []).entries()) L(l, `variants[${i}].en(${v.label})`, v.en, "A1", "正");
    for (const [i, s] of (l.sceneSwings ?? []).entries()) L(l, `sceneSwings[${i}].en`, s.en, "A1", "正");
    for (const [i, b] of l.blocks.entries()) L(l, `blocks[${i}].text`, b.text, "A1", "正");

    // ── A2：答案 / 选项 / 干扰项 ──
    for (const [i, g] of l.guided.entries()) {
      if (g.kind === "spot") {
        // ⚠️ 污染源①：spot 的 answer === wrongToken，是要用户点出的错词
        L(l, `guided[${i}](spot).answer`, g.answer, "W", "错", "spot.answer(=wrongToken)");
        L(l, `guided[${i}](spot).wrongToken`, g.wrongToken, "W", "错");
        L(l, `guided[${i}](spot).tokens[]`, (g.tokens ?? []).join(" "), "W", "错");
      } else {
        L(l, `guided[${i}](${g.kind}).answer`, g.answer, "A2", "正");
        for (const o of g.options ?? [])
          L(l, `guided[${i}].options[]${o === g.answer ? "" : "(!=answer→干扰项)"}`, o, o === g.answer ? "A2" : "W", o === g.answer ? "正" : "错");
        L(l, `guided[${i}].replaceBase`, g.replaceBase, "A3", "正");
        // arrange 的 tokens[] 是正确句拆块，也算正侧
        L(l, `guided[${i}](${g.kind}).tokens[](拼装块)`, (g.tokens ?? []).join(" "), "A1", "正");
      }
    }
    for (const [i, p] of l.practice.entries()) {
      L(l, `practice[${i}].answer`, p.answer, "A2", "正");
      for (const dt of p.distractors ?? []) L(l, `practice[${i}].distractors[]`, dt, "W", "错");
    }
    if (l.recall) L(l, "recall.answer", l.recall.answer, "A2", "正");

    // ── 对照卡：三类（见 types.ts 批四十七注释）──
    for (const [i, c] of (l.contrast ?? []).entries()) {
      L(l, `contrast[${i}].correct`, c.correct, "A2", "正");
      if (c.bothRight) {
        // ⚠️ 污染源②：bothRight 卡的 wrong 字段装的是「正确句」，计入正侧 A4
        L(l, `contrast[${i}].wrong(bothRight=true→正确句)`, c.wrong, "A4", "正", "bothRight.wrong(已入A4)");
      } else {
        L(l, `contrast[${i}].wrong`, c.wrong, "W", "错");
      }
      L(l, `contrast[${i}].wrongMark`, c.wrongMark, "W", "错");
    }

    // ── C：中文讲解里引用的英文（不是教学内容本体，单独一档）──
    L(l, "oneLineRule", l.oneLineRule, "C", "讲");
    L(l, "summary.rule", l.summary?.rule, "C", "讲");
    for (const [i, p] of (l.summary?.points ?? []).entries()) L(l, `summary.points[${i}]`, p, "C", "讲");
    for (const [i, p] of (l.deepDive?.paragraphs ?? []).entries()) L(l, `deepDive.paragraphs[${i}]`, p, "C", "讲");
    for (const [i, g] of l.guided.entries()) {
      L(l, `guided[${i}].explain`, g.explain, "C", "讲");
      L(l, `guided[${i}].correctionZh`, g.correctionZh, "C", "讲");
      L(l, `guided[${i}].promptZh`, g.promptZh, "C", "讲");
      L(l, `guided[${i}].replaceTarget`, g.replaceTarget, "C", "讲");
    }
    for (const [i, c] of (l.contrast ?? []).entries()) L(l, `contrast[${i}].whyZh`, c.whyZh, "C", "讲");
    for (const [i, v] of (l.variants ?? []).entries()) L(l, `variants[${i}].noteZh`, v.noteZh, "C", "讲");
    if (l.recall) {
      L(l, "recall.noteZh", l.recall.noteZh, "C", "讲");
      L(l, "recall.intentZh", l.recall.intentZh, "C", "讲");
    }
    for (const [i, p] of l.practice.entries()) L(l, `practice[${i}].promptZh`, p.promptZh, "C", "讲");
    for (const [i, d] of (l.dialogue ?? []).entries()) L(l, `dialogue[${i}].zh`, d.zh, "C", "讲");
    for (const [i, s] of (l.sceneSwings ?? []).entries()) L(l, `sceneSwings[${i}].zh`, s.zh, "C", "讲");
    for (const [i, e] of l.examples.entries()) L(l, `examples[${i}].zh`, e.zh, "C", "讲");
    L(l, "intentZh", l.intentZh, "C", "讲");
    L(l, "dialogueZh", l.dialogueZh, "C", "讲");
    L(l, "sceneSetupZh", l.sceneSetupZh, "C", "讲");
    if (l.recall) L(l, "recall.promptZh", l.recall.promptZh, "C", "讲");
  }
  return out;
}

const FORMS = [
  "say", "says", "said", "saying",
  "tell", "tells", "told", "telling",
  "ask", "asks", "asked", "asking",
  "speak", "speaks", "spoke", "spoken", "speaking",
  "talk", "talks", "talked", "talking",
];

const ALL: Record<string, Rec[]> = {};
for (const f of FORMS) ALL[f] = scanLesson(f);

function count(recs: Rec[], pred: (r: Rec) => boolean) {
  return recs.filter(pred).length;
}

console.log("════════════════════════════════════════════════════════════════");
console.log("say 家族形状核查 · V0–V3 四口径");
console.log("════════════════════════════════════════════════════════════════");
console.log("\n【口径定义】");
console.log("  V0 原始扫描 = 课程对象所有字符串字段（含 id/scene/cover/episode/grammarLabel/title）");
console.log("  V1 内容字段 = V0 剔除上述 6 个元数据槽");
console.log("  V2 正错二分 = V1 拆成正侧(A1+A2+A3+A4) 与 错侧(W)");
console.log("  V3 权威口径 = V2 剔除 ①spot.answer(===wrongToken) ②bothRight.wrong(该字段装正确句)");

console.log("\n【表 1 · 四口径计数】");
console.log(
  "form".padEnd(10) +
    "V0".padStart(6) +
    "V1".padStart(6) +
    "V2正".padStart(7) +
    "V2错".padStart(7) +
    "V2讲".padStart(7) +
    "V3正".padStart(7) +
    "V3错".padStart(7) +
    "V2正∩V3正".padStart(11),
);
for (const f of FORMS) {
  const r = ALL[f];
  const v0 = r.length;
  const v1 = count(r, (x) => x.v3Excluded !== "元数据");
  const c1 = r.filter((x) => x.v3Excluded !== "元数据");
  const v2正 = count(c1, (x) => x.side === "正");
  const v2错 = count(c1, (x) => x.side === "错");
  const v2讲 = count(c1, (x) => x.side === "讲");
  const v3正 = count(c1, (x) => x.side === "正" && x.v3Excluded === "");
  const v3错 = count(c1, (x) => x.side === "错" && x.v3Excluded === "");
  console.log(
    f.padEnd(10) +
      String(v0).padStart(6) +
      String(v1).padStart(6) +
      String(v2正).padStart(7) +
      String(v2错).padStart(7) +
      String(v2讲).padStart(7) +
      String(v3正).padStart(7) +
      String(v3错).padStart(7) +
      String(v3正).padStart(11),
  );
}

// ── 正侧细分（按 tier）──
console.log("\n【表 2 · 正侧按 tier 细分（V3，已剔除污染）】");
const TIERS = ["A1", "A1-me", "A1-npc", "A2", "A3", "A4"];
console.log("form".padEnd(10) + TIERS.map((t) => t.padStart(8)).join("") + "正合计".padStart(9));
for (const f of ["say", "says", "said", "saying"]) {
  const r = ALL[f].filter((x) => x.v3Excluded === "" && x.side === "正");
  console.log(
    f.padEnd(10) +
      TIERS.map((t) => String(r.filter((x) => x.tier === t).length).padStart(8)).join("") +
      String(r.length).padStart(9),
  );
}

// ── 逐条落点 ──
for (const f of ["say", "says", "said", "saying"]) {
  console.log(`\n【表 3 · ${f} 逐条落点（V3，按课号排序）】`);
  const r = ALL[f].filter((x) => x.v3Excluded === "");
  const sorted = [...r].sort((a, b) => a.lesson - b.lesson || a.slot.localeCompare(b.slot));
  for (const x of sorted) {
    console.log(`  [${x.side}${x.tier}] L${String(x.lesson).padStart(3)} ${x.slot.padEnd(46)} ${JSON.stringify(x.text.slice(0, 110))}`);
  }
  console.log(`  ── 小计：${r.length} 条（正 ${r.filter((x) => x.side === "正").length} / 错 ${r.filter((x) => x.side === "错").length} / 讲 ${r.filter((x) => x.side === "讲").length}）`);
}

// ── 被剔除的污染条目（必须能看到剔了什么）──
console.log("\n【表 4 · V3 剔除的污染条目（原样列出，供复核）】");
for (const f of ["say", "says", "said"]) {
  const ex = ALL[f].filter((x) => x.v3Excluded !== "" && x.v3Excluded !== "元数据");
  console.log(`  ${f}: ${ex.length} 条`);
  for (const x of ex) console.log(`    L${x.lesson} [${x.tier}/${x.side}] ${x.slot} = ${JSON.stringify(x.text.slice(0, 130))}`);
  const meta = ALL[f].filter((x) => x.v3Excluded === "元数据");
  if (meta.length) console.log(`    （另有元数据命中 ${meta.length} 条：${meta.map((m) => `L${m.lesson}.${m.slot}`).join(", ")}）`);
}

// ── 按课聚合：哪些课出现 say 家族 ──
console.log("\n【表 5 · 按课聚合（V3，任一 say 家族形状）】");
const byLesson = new Map<number, number[]>();
for (const f of ["say", "says", "said", "saying"]) {
  for (const x of ALL[f].filter((y) => y.v3Excluded === "")) {
    const a = byLesson.get(x.lesson) ?? [];
    a.push(x.lesson);
    byLesson.set(x.lesson, a);
  }
}
const lessonsTouched = [...byLesson.keys()].sort((a, b) => a - b);
for (const n of lessonsTouched) {
  const l = grammarLessons.find((x) => x.number === n)!;
  const detail = ["say", "says", "said"].map((f) => {
    const r = ALL[f].filter((x) => x.v3Excluded === "" && x.lesson === n);
    const p = r.filter((x) => x.side === "正").length;
    const w = r.filter((x) => x.side === "错").length;
    const c = r.filter((x) => x.side === "讲").length;
    return r.length ? `${f}:正${p}/错${w}/讲${c}` : "";
  }).filter(Boolean).join("  ");
  console.log(`  L${String(n).padStart(3)} ${l.grammarLabel.padEnd(30)} ${detail}`);
}
console.log(`  ── 共 ${lessonsTouched.length} 课出现 say 家族形状（全库 ${grammarLessons.length} 课）`);

// ── huntCases ──
console.log("\n【表 6 · 找错案件里的 say 家族（含 spot 等价物：errors[].original 是要点出的错词）】");
for (const f of ["say", "says", "said", "saying", "tell", "tells", "told", "ask", "asked"]) {
  const inTok: string[] = [];
  const asErr: string[] = [];
  const asCorr: string[] = [];
  for (const c of huntCases) {
    if (hit(f, c.tokens.join(" "))) inTok.push(`${c.id}(#${c.number})`);
    for (const e of c.errors) {
      if (hit(f, e.original)) asErr.push(`${c.id}: "${e.original}"→"${e.correction}"`);
      if (hit(f, e.correction)) asCorr.push(`${c.id}: "${e.correction}"`);
    }
  }
  console.log(
    `  ${f.padEnd(9)} tokens命中=${String(inTok.length).padStart(3)} [${inTok.slice(0, 8).join(",")}]`,
  );
  console.log(`  ${"".padEnd(9)}   错词=${String(asErr.length).padStart(3)} [${asErr.slice(0, 5).join(" | ")}]`);
  console.log(`  ${"".padEnd(9)}   纠正=${String(asCorr.length).padStart(3)} [${asCorr.slice(0, 5).join(" | ")}]`);
}

console.log("\n【表 7 · 全库规模基线】");
console.log(`  grammarLessons = ${grammarLessons.length} 课`);
console.log(`  huntCases      = ${huntCases.length} 案`);
console.log(`  对照卡总数      = ${grammarLessons.reduce((s, l) => s + (l.contrast?.length ?? 0), 0)}`);
console.log(`  其中 bothRight = ${grammarLessons.reduce((s, l) => s + (l.contrast ?? []).filter((c) => c.bothRight).length, 0)}`);
console.log(`  对照卡 ≥7 张的课 = ${grammarLessons.filter((l) => (l.contrast?.length ?? 0) >= 7).map((l) => `L${l.number}(${l.contrast!.length})`).join(", ")}`);
console.log(`  dialogue me 行总数   = ${grammarLessons.reduce((s, l) => s + (l.dialogue ?? []).filter((d) => d.who === "me").length, 0)}`);
console.log(`  dialogue npc 行总数  = ${grammarLessons.reduce((s, l) => s + (l.dialogue ?? []).filter((d) => d.who !== "me").length, 0)}`);
