/**
 * 第 50 批 · 字段语义未文档化扫描：guided.answer 按 kind 的实际语义，
 * 以及 GrammarLesson / HuntCase 全字段的注释覆盖。
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit50-fields.mts
 */
import { grammarLessons } from "../../src/data/grammarLessons";
import { huntCases } from "../../src/data/huntCases";

const clean = (t: string) => t.replace(/[.,!?;:'"“”]/g, "").toLowerCase();
const toks = (s: string) => s.split(/\s+/).filter(Boolean);
const wb = (w: string) => new RegExp(`(?<![A-Za-z-])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z-])`, "i");

console.log("════ 1. guided.answer 按 kind 的实际语义（第 44 批缺陷 1 是否已文档化）════");
const byKind: Record<string, { n: number; pos: number; neg: number; samples: string[] }> = {};
for (const l of grammarLessons) {
  for (const g of l.guided ?? []) {
    const k = g.kind;
    byKind[k] ??= { n: 0, pos: 0, neg: 0, samples: [] };
    const b = byKind[k];
    b.n += 1;
    const a = (g.answer ?? "").trim();
    if (k === "spot") {
      // 负面：answer 是错词 ⇒ 出现在含错句子 tokens 里，且不等于任何正确句
      const toksS = (g.tokens ?? []).join(" ");
      const inWrong = toksS ? wb(a).test(toksS) : false;
      if (inWrong) b.neg += 1;
    } else if (k === "arrange") {
      // 正侧：answer 应等于 tokens 的一个合法排列
      const ts = (g.tokens ?? []).map(clean).sort().join(" ");
      const as = toks(a).map(clean).sort().join(" ");
      if (ts && ts === as) b.pos += 1;
    } else if (k === "choose") {
      if ((g.options ?? []).some((o) => clean(o) === clean(a))) b.pos += 1;
    } else if (k === "replace") {
      if ((g.options ?? []).some((o) => clean(o) === clean(a))) b.pos += 1;
    }
    if (b.samples.length < 3) b.samples.push(`${l.id}(L${l.number}) answer="${a}" options=${JSON.stringify(g.options ?? null)} tokens=${JSON.stringify(g.tokens ?? null)} replaceBase=${JSON.stringify(g.replaceBase ?? null)} wrongToken=${JSON.stringify(g.wrongToken ?? null)}`);
  }
}
for (const [k, v] of Object.entries(byKind)) {
  console.log(`  kind=${k}: 共 ${v.n} 道；判定为「正面槽」${v.pos} 道；判定为「负面槽（错词）」${v.neg} 道`);
  v.samples.forEach((s) => console.log("      " + s));
}

console.log("\n  ⇒ spot 的 answer 语义（202/204 与 wrongToken 相同）:");
for (const l of grammarLessons.slice(0, 3)) {
  for (const g of l.guided ?? []) if (g.kind === "spot") console.log(`      L${l.number} answer="${g.answer}" wrongToken="${g.wrongToken}" correctionZh="${g.correctionZh}"`);
}
const diffAns = grammarLessons.flatMap((l) => (l.guided ?? []).filter((g) => g.kind === "spot" && clean(g.answer) !== clean(g.wrongToken ?? "")).map((g) => ({ id: l.id, n: l.number, g })));
console.log(`\n  answer !== wrongToken 的 spot 题（${diffAns.length} 道）:`);
diffAns.forEach(({ id, n, g }) => console.log(`      ${id}(L${n}) answer="${g.answer}" wrongToken="${g.wrongToken}" tokens=${JSON.stringify(g.tokens)} correctionZh="${g.correctionZh}"`));

console.log("\n\n════ 2. GrammarLesson 字段注释覆盖（对照 src/types.ts）════");
const GL_DOC: Record<string, string | null> = {
  id: null, number: null, title: null,
  grammarLabel: "这一课学的语法点（卡片与课程页展示），如「be 动词 · I am」。",
  episode: null, scene: "场景插画 ID（AdventureSceneId），用于图文小剧场。",
  cover: "课程地图卡片封面（AI 生成的剧情插画，缺省时回退 scene SVG）。",
  sceneSetupZh: null, dialogueEn: null, dialogueZh: null, intentZh: null, targetSentence: null,
  blocks: null, oneLineRule: null, examples: null, guided: null, practice: null,
  huntCaseIds: "第④段侦探挑战关联的找错案件。", dialogue: "多句小对话；不填则回退 dialogueEn/dialogueZh 单句。",
  contrast: "正误对比揭示卡。", variants: "肯定 / 否定 / 疑问变体。", sceneSwings: "场景变奏列表。",
  deepDive: "「想知道为什么？」深挖折叠卡。", summary: "完课页迷你小结卡。",
  recall: "R5「忆」段（新增六段式第③段）：缺省＝该课跳过忆段，向后兼容。"
};
const gl = Object.entries(GL_DOC);
console.log(`  GrammarLesson 字段 ${gl.length} 个：有注释 ${gl.filter(([, v]) => v).length}，无注释 ${gl.filter(([, v]) => !v).length}`);
console.log("  无注释字段：" + gl.filter(([, v]) => !v).map(([k]) => k).join(", "));

console.log("\n════ 3. LessonContrast / LessonGuidedStep / LessonPracticeStep / LessonRecall 注释覆盖 ════");
const LC_DOC: Record<string, string | null> = {
  wrong: null,
  wrongMark: "需要标出的问题词（含 2026-09-22 批四十七修正的三类口径说明）",
  correct: null, whyZh: null,
  bothRight: "双正解条（L36 that 可选件）：两句都对——选哪句都判对，揭示时两句并排展示。"
};
console.log("  LessonContrast：");
for (const [k, v] of Object.entries(LC_DOC)) console.log(`     ${v ? "✅" : "❌"} ${k}${v ? " — " + v.slice(0, 60) : "  ← 无注释"}`);
const LG_DOC: Record<string, string | null> = {
  kind: "引导练习（第②段「试一试」）：几乎不会错的点选 / 拼装 / 找茬题。",
  promptZh: null, before: "choose 题干：空位前的部分。", after: "choose 题干：空位后的部分。",
  options: "choose / replace 的选项。",
  tokens: "arrange / spot 的词块（arrange 含干扰项；spot 是含错的完整词块序列）。",
  wrongToken: "spot：藏了问题的那个词块（命中即通过）。",
  correctionZh: "spot：点对之后给出的纠正说法。",
  replaceBase: "R9：给出的正确原句", replaceTarget: "R9：要换成的成分提示",
  answer: null, explain: null
};
console.log("  LessonGuidedStep：");
for (const [k, v] of Object.entries(LG_DOC)) console.log(`     ${v ? "✅" : "❌"} ${k}${v ? " — " + v.slice(0, 60) : "  ← 无注释"}`);
const LP_DOC: Record<string, string | null> = { promptZh: null, tokens: null, distractors: "R4：干扰项词块…缺省＝无干扰项，向后兼容。", answer: null };
console.log("  LessonPracticeStep：");
for (const [k, v] of Object.entries(LP_DOC)) console.log(`     ${v ? "✅" : "❌"} ${k}${v ? " — " + v.slice(0, 60) : "  ← 无注释"}`);
const LR_DOC: Record<string, string | null> = { promptZh: null, intentZh: "D8：中文意图句（你要说的话）…", answer: null, noteZh: "答错/看答案时给的一句人话解释（缺省回退 oneLineRule）。" };
console.log("  LessonRecall：");
for (const [k, v] of Object.entries(LR_DOC)) console.log(`     ${v ? "✅" : "❌"} ${k}${v ? " — " + v.slice(0, 60) : "  ← 无注释"}`);

console.log("\n════ 4. HuntError 字段注释与 correction 语义 ════");
let deletionLike = 0; const delEx: string[] = [];
for (const hc of huntCases) {
  for (const e of hc.errors) {
    const c = (e.correction ?? "").trim();
    if (/^去掉|^删|^删除|^去掉/.test(c) || c === "") { deletionLike += 1; if (delEx.length < 8) delEx.push(`${hc.id} idx=${e.tokenIndex} original="${e.original}" correction="${c}"`); }
  }
}
console.log(`  errors[].correction 以「去掉/删」开头的（删除型，不是替换）= ${deletionLike}`);
delEx.forEach((s) => console.log("      " + s));
console.log(`  ⇒ correction 里混着「替换词」与「删除指令」两种语义，接口无注释说明。`);
console.log(`  HuntError.tokenIndex / tag / original / correction / explanation 均无逐字段注释（仅接口头一句「案件里植入的一处错误。tokenIndex 指向 HuntCase.tokens 的下标。」）`);
