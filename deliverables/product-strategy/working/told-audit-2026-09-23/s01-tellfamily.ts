import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";

/* 权威口径 V3（沿用批 46 AUTHORITATIVE.ts）——node 词边界正则，不用 grep
   正侧 A1：无歧义正确句槽
   正侧 A2：guided 非 spot 的 answer（== options 中正确项）
   正侧 A3：replaceBase
   正侧 A4：contrast.wrong 但 bothRight=true（该字段其实装的是正确句）
   错侧 W：contrast.wrong(!bothRight) / wrongMark / practice.distractors /
           guided.options(!=answer) / guided[spot]（tokens+wrongToken+answer 折叠为1）
   歧义 M：guided[arrange].tokens[]
   讲解 C：中英混排讲解字段
*/
const hit = (f: string, t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
type Tier = "A1" | "A2" | "A3" | "A4" | "W" | "M" | "C";
interface Rec { tier: Tier; lesson: number; slot: string; text: string }
function scan(f: string): Rec[] {
  const out: Rec[] = [];
  for (const l of grammarLessons) {
    const A = (slot: string, t?: string) => { if (hit(f, t)) out.push({ tier: "A1", lesson: l.number, slot, text: t! }); };
    A("targetSentence", l.targetSentence); A("dialogueEn", l.dialogueEn);
    for (const d of l.dialogue ?? []) A("dialogue[].en", d.en);
    for (const e of l.examples) A("examples[].en", e.en);
    for (const v of l.variants ?? []) A("variants[].en", v.en);
    for (const s of l.sceneSwings ?? []) A("sceneSwings[].en", s.en);
    for (const b of l.blocks) A("blocks[].text", b.text);
    for (const p of l.practice) A("practice[].answer", p.answer);
    if (l.recall) A("recall.answer", l.recall.answer);
    for (const c of l.contrast ?? []) {
      A("contrast[].correct", c.correct);
      if (c.bothRight) { if (hit(f, c.wrong)) out.push({ tier: "A4", lesson: l.number, slot: "contrast[].wrong(bothRight=true→正确句)", text: c.wrong }); }
      else if (hit(f, c.wrong)) out.push({ tier: "W", lesson: l.number, slot: "contrast[].wrong", text: c.wrong });
      if (c.wrongMark && hit(f, c.wrongMark)) out.push({ tier: "W", lesson: l.number, slot: "contrast[].wrongMark", text: c.wrongMark });
    }
    for (const p of l.practice) for (const d of p.distractors ?? []) if (hit(f, d)) out.push({ tier: "W", lesson: l.number, slot: "practice[].distractors[]", text: d });
    for (const g of l.guided) {
      if (g.kind === "spot") {
        const j = (g.tokens ?? []).join(" ");
        if (hit(f, j) || hit(f, g.wrongToken) || hit(f, g.answer)) out.push({ tier: "W", lesson: l.number, slot: "guided[spot]（折叠为1）", text: j + " || wrongToken=" + g.wrongToken + " || answer=" + g.answer });
      } else {
        if (hit(f, g.answer)) out.push({ tier: "A2", lesson: l.number, slot: "guided[].answer", text: g.answer });
        if (g.replaceBase && hit(f, g.replaceBase)) out.push({ tier: "A3", lesson: l.number, slot: "guided[].replaceBase", text: g.replaceBase });
        for (const o of g.options ?? []) if (hit(f, o)) out.push({ tier: o === g.answer ? "A2" : "W", lesson: l.number, slot: o === g.answer ? "guided[].options[](==answer)" : "guided[].options[](!=answer)", text: o });
        for (const t of g.tokens ?? []) if (hit(f, t)) out.push({ tier: "M", lesson: l.number, slot: "guided[arrange].tokens[]（歧义）", text: t });
      }
    }
    const C = (slot: string, t?: string) => { if (hit(f, t)) out.push({ tier: "C", lesson: l.number, slot, text: t! }); };
    C("oneLineRule", l.oneLineRule); C("summary?.rule", l.summary?.rule);
    for (const p of l.summary?.points ?? []) C("summary.points[]", p);
    for (const p of l.deepDive?.paragraphs ?? []) C("deepDive.paragraphs[]", p);
    for (const g of l.guided) { C("guided[].explain", g.explain); C("guided[].correctionZh", g.correctionZh); C("guided[].promptZh", g.promptZh); C("guided[].replaceTarget", g.replaceTarget); }
    for (const c of l.contrast ?? []) C("contrast[].whyZh", c.whyZh);
    for (const v of l.variants ?? []) C("variants[].noteZh", v.noteZh);
    if (l.recall) C("recall.noteZh", l.recall.noteZh);
    for (const d of l.dialogue ?? []) C("dialogue[].zh", d.zh);
    for (const s of l.sceneSwings ?? []) C("sceneSwings[].zh", s.zh);
    for (const e of l.examples) C("examples[].zh", e.zh);
    for (const p of l.practice) C("practice[].promptZh", p.promptZh);
    C("title", l.title); C("grammarLabel", l.grammarLabel); C("episode", l.episode);
    C("intentZh", l.intentZh); C("dialogueZh", l.dialogueZh); C("sceneSetupZh", l.sceneSetupZh);
    if (l.recall) { C("recall.intentZh", l.recall.intentZh); C("recall.promptZh", l.recall.promptZh); }
  }
  return out;
}
// huntCases：tokens（原文）/ errors.original（被点出的错词）/ errors.correction（纠正）
function hunt(f: string) {
  const inTok: string[] = [], asErr: string[] = [], asCorr: string[] = [], asExp: string[] = [], asNote: string[] = [];
  for (const c of huntCases) {
    if (hit(f, c.tokens.join(" "))) inTok.push(`${c.id}(n=${c.number})`);
    for (const e of c.errors) {
      if (hit(f, e.original)) asErr.push(`${c.id}(n=${c.number}) "${e.original}"→"${e.correction}"`);
      if (hit(f, e.correction)) asCorr.push(`${c.id}(n=${c.number}) "${e.correction}"`);
      if (hit(f, e.explanation)) asExp.push(`${c.id}(n=${c.number}) ${e.explanation}`);
    }
    for (const n of c.notes ?? []) if (hit(f, n.word)) asNote.push(`${c.id}(n=${c.number}) note=${n.word}`);
  }
  return { inTok, asErr, asCorr, asExp, asNote };
}
const FORMS = ["tell", "tells", "told", "telling", "tell me", "tell the truth"];
const rows: { form: string; A1: number; A2: number; A3: number; A4: number; A: number; W: number; M: number; C: number }[] = [];
for (const f of FORMS) {
  const r = scan(f); const g = (t: string) => r.filter(x => x.tier === t).length;
  rows.push({ form: f, A1: g("A1"), A2: g("A2"), A3: g("A3"), A4: g("A4"), A: g("A1") + g("A2") + g("A3") + g("A4"), W: g("W"), M: g("M"), C: g("C") });
}
console.log("=== 表 1 · tell 家族权威计数（课字段，口径 V3）===");
console.log("form".padEnd(14) + "A1".padStart(5) + "A2".padStart(5) + "A3".padStart(5) + "A4".padStart(5) + "A合计".padStart(7) + "W错侧".padStart(7) + "M".padStart(5) + "C讲解".padStart(7));
for (const r of rows) console.log(r.form.padEnd(14) + String(r.A1).padStart(5) + String(r.A2).padStart(5) + String(r.A3).padStart(5) + String(r.A4).padStart(5) + String(r.A).padStart(7) + String(r.W).padStart(7) + String(r.M).padStart(5) + String(r.C).padStart(7));

console.log("\n=== 表 2 · tell/tells/told 逐条落点（课）===");
for (const f of ["tell", "tells", "told", "telling"]) {
  console.log(`\n--- ${f} ---`);
  const r = scan(f);
  if (!r.length) { console.log("  （0 处）"); continue; }
  for (const x of r) console.log(`  L${x.lesson} [${x.tier}] ${x.slot}: ${JSON.stringify(x.text.slice(0, 130))}`);
}
console.log("\n=== 表 3 · tell/tells/told 逐条落点（案件 213）===");
for (const f of ["tell", "tells", "told", "telling"]) {
  const h = hunt(f);
  const n = h.inTok.length + h.asErr.length + h.asCorr.length + h.asExp.length + h.asNote.length;
  console.log(`\n--- ${f} （共 ${n} 处）---`);
  if (!n) { console.log("  （0 处）"); continue; }
  if (h.inTok.length) console.log("  tokens 原文: " + h.inTok.join(", "));
  if (h.asErr.length) console.log("  作为被点出的错词: " + h.asErr.join(" | "));
  if (h.asCorr.length) console.log("  出现在纠正里: " + h.asCorr.join(", "));
  if (h.asExp.length) console.log("  出现在讲解里: " + h.asExp.join(" | "));
  if (h.asNote.length) console.log("  notes: " + h.asNote.join(", "));
}
