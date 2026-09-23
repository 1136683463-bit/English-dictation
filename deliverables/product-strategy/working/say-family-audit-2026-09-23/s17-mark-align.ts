/**
 * s17：① 精确定位任务书口径（says=21 / say=2 / said=1）
 *      ② 系统性核查：错卡「划线词」与「讲解所指的问题」是否对齐
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";

const rx = (f: string) => new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i");

// ── ① 精确口径 ─────────────────────────────────────────────
console.log("════════════════════════════════════════════════════════════════");
console.log("s17-A · ⭐ 任务书口径的精确定位");
console.log("════════════════════════════════════════════════════════════════");
console.log("  假设：只算**课侧**，只算**正侧**，且排除 blocks / guided.tokens / guided.options");
console.log("        （这三类不是「完整正句」，options 里的答案只是词块、blocks 只是句子零件）\n");
const FIELDS = [
  "targetSentence", "dialogueEn", "dialogue", "examples", "variants", "sceneSwings",
  "contrast.correct", "contrast.bothRightWrong",
  "guided.answer", "guided.replaceBase", "guided.tokens", "guided.optionsEq",
  "practice.answer", "recall.answer", "blocks",
];
function tally(form: string) {
  const r = rx(form);
  const t: Record<string, number> = Object.fromEntries(FIELDS.map((f) => [f, 0]));
  for (const l of grammarLessons) {
    const A = (k: string, v?: string | null) => { if (v && r.test(v)) t[k]++; };
    A("targetSentence", l.targetSentence); A("dialogueEn", l.dialogueEn);
    for (const d of l.dialogue ?? []) A("dialogue", d.en);
    for (const e of l.examples) A("examples", e.en);
    for (const v of l.variants ?? []) A("variants", v.en);
    for (const s of l.sceneSwings ?? []) A("sceneSwings", s.en);
    for (const b of l.blocks) A("blocks", b.text);
    for (const c of l.contrast ?? []) { A("contrast.correct", c.correct); if (c.bothRight) A("contrast.bothRightWrong", c.wrong); }
    for (const g of l.guided) { if (g.kind === "spot") continue; A("guided.answer", g.answer); A("guided.replaceBase", g.replaceBase); A("guided.tokens", (g.tokens ?? []).join(" ")); for (const o of g.options ?? []) if (o === g.answer) A("guided.optionsEq", o); }
    for (const p of l.practice) A("practice.answer", p.answer);
    A("recall.answer", l.recall?.answer);
  }
  return t;
}
for (const f of ["say", "says", "said"]) {
  const t = tally(f);
  const total = FIELDS.reduce((s, k) => s + t[k], 0);
  const excl = total - t["blocks"] - t["guided.tokens"] - t["guided.optionsEq"] - t["contrast.bothRightWrong"];
  console.log(`  ${f}：`);
  console.log(`     逐槽位：${FIELDS.filter((k) => t[k]).map((k) => `${k}=${t[k]}`).join("  ")}`);
  console.log(`     槽位合计 ${total}`);
  console.log(`     排除 blocks(${t["blocks"]}) + guided.tokens(${t["guided.tokens"]}) + guided.optionsEq(${t["guided.optionsEq"]}) + bothRightWrong(${t["contrast.bothRightWrong"]})→ **${excl}**`);
  console.log(`     （若只排除前三项、保留 bothRightWrong → ${excl + t["contrast.bothRightWrong"]}）`);
}

console.log("\n════════════════════════════════════════════════════════════════");
console.log("s17-B · ✅ 对账结论");
console.log("════════════════════════════════════════════════════════════════");
const s = tally("say"), ss = tally("says"), sd = tally("said");
const ex = (t: Record<string, number>, keepBoth = false) => FIELDS.reduce((acc, k) => acc + t[k], 0) - t["blocks"] - t["guided.tokens"] - t["guided.optionsEq"] - (keepBoth ? 0 : t["contrast.bothRightWrong"]);
console.log(`  我的口径（排 blocks/guided.tokens/guided.optionsEq/bothRightWrong）：say=${ex(s)}  says=${ex(ss)}  said=${ex(sd)}`);
console.log(`  任务书：                                                       say=2  says=21  said=1`);
console.log(`  ⇒ ${ex(s) === 2 && ex(ss) === 21 && ex(sd) === 1 ? "✅ **完全一致**——口径已复现" : "⚠️ 不完全一致"}`);

// ── ② 划线词 vs 讲解所指 ────────────────────────────────────
console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s17-C · 错卡「划线词」与「讲解所指问题」的对齐核查");
console.log("════════════════════════════════════════════════════════════════");
/**
 * 判据：一张标词错卡，划线词 M 应当在讲解里被提到（讲解要解释「为什么 M 不对」）。
 *   若讲解里根本没提 M，说明划线位置与讲解内容脱节。
 *   进一步：若讲解里提到了另一个词 W（而 M 没被提），说明讲解在说 W 的问题。
 */
const toks = (s: string) => s.toLowerCase().replace(/[^a-z' ]/g, " ").split(/\s+/).filter(Boolean);
interface Row { lesson: number; idx: number; mark: string; why: string; markMentioned: boolean; otherWordsInWhy: string[]; wrong: string; correct: string }
const rows: Row[] = [];
for (const l of grammarLessons) {
  for (const [i, c] of (l.contrast ?? []).entries()) {
    if (!c.wrongMark || c.bothRight) continue;
    const markB = c.wrongMark.replace(/[^A-Za-z' ]/g, "").toLowerCase().trim();
    if (!markB) continue;
    const why = c.whyZh;
    // 讲解里是否提到划线词（英文形式，词边界）
    const mentioned = new RegExp(`(?<![A-Za-z-])${markB.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z-])`, "i").test(why);
    // 讲解里出现的其它英文词（来自本卡 wrong/correct，且不是划线词）
    const pool = [...new Set([...toks(c.wrong), ...toks(c.correct)])].filter((w) => w !== markB && !markB.split(" ").includes(w));
    const inWhy = pool.filter((w) => new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`, "i").test(why));
    rows.push({ lesson: l.number, idx: i, mark: c.wrongMark, why, markMentioned: mentioned, otherWordsInWhy: inWhy, wrong: c.wrong, correct: c.correct });
  }
}
const notMentioned = rows.filter((r) => !r.markMentioned);
console.log(`  标词错卡 ${rows.length} 张；划线词在讲解里**未被提到**的 ${notMentioned.length} 张（${(notMentioned.length / rows.length * 100).toFixed(1)}%）`);
console.log("\n  ── 划线词未被讲解提到的卡，逐张（这是划线位置与讲解脱节的候选）──");
for (const r of notMentioned) {
  console.log(`\n  L${r.lesson} contrast[${r.idx}]  划线 = ${JSON.stringify(r.mark)}  ← 讲解没提它`);
  console.log(`       wrong  = ${JSON.stringify(r.wrong)}`);
  console.log(`       correct= ${JSON.stringify(r.correct)}`);
  console.log(`       whyZh  = ${r.why}`);
  console.log(`       讲解里提到的本卡其它词：${r.otherWordsInWhy.length ? r.otherWordsInWhy.join(", ") : "（无）"}`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s17-D · L38 的 8 张卡在该判据下的表现");
console.log("════════════════════════════════════════════════════════════════");
const l38 = grammarLessons.find((l) => l.number === 38)!;
for (const [i, c] of l38.contrast!.entries()) {
  if (c.bothRight) { console.log(`  [${i}] 双正解（无划线，不适用本判据）  ${JSON.stringify(c.wrong)}`); continue; }
  const r = rows.find((x) => x.lesson === 38 && x.idx === i)!;
  if (!c.wrongMark) { console.log(`  [${i}] 整句卡（无划线）  ${JSON.stringify(c.wrong)} → ${JSON.stringify(c.correct)}`); continue; }
  console.log(`  [${i}] 划线 ${JSON.stringify(c.wrongMark).padEnd(10)} 讲解提到划线词？ ${r.markMentioned ? "✅ 是" : "❌ 否"}`);
  if (!r.markMentioned) console.log(`        讲解里提的词：${r.otherWordsInWhy.join(", ") || "（无）"}`);
}
