import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";
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
      if (g.kind === "spot") { const j = (g.tokens ?? []).join(" ");
        if (hit(f, j) || hit(f, g.wrongToken) || hit(f, g.answer)) out.push({ tier: "W", lesson: l.number, slot: "guided[spot]（折叠为1）", text: j }); }
      else { if (hit(f, g.answer)) out.push({ tier: "A2", lesson: l.number, slot: "guided[].answer", text: g.answer });
        if (g.replaceBase && hit(f, g.replaceBase)) out.push({ tier: "A3", lesson: l.number, slot: "guided[].replaceBase", text: g.replaceBase });
        for (const o of g.options ?? []) if (hit(f, o)) out.push({ tier: o === g.answer ? "A2" : "W", lesson: l.number, slot: o === g.answer ? "guided[].options[](==answer)" : "guided[].options[](!=answer)", text: o });
        for (const t of g.tokens ?? []) if (hit(f, t)) out.push({ tier: "M", lesson: l.number, slot: "guided[arrange].tokens[]（歧义）", text: t }); }
    }
    const C = (slot: string, t?: string) => { if (hit(f, t)) out.push({ tier: "C", lesson: l.number, slot, text: t! }); };
    C("oneLineRule", l.oneLineRule); C("summary.rule", l.summary?.rule);
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
console.log("=== say 家族权威计数（课字段，口径 V3）===");
console.log("form".padEnd(12) + "A1".padStart(5) + "A2".padStart(5) + "A3".padStart(5) + "A4".padStart(5) + "A合计".padStart(7) + "W错侧".padStart(7) + "M".padStart(5) + "C讲解".padStart(7));
for (const f of ["say","says","said","saying","tell","tells","told","telling","ask","asks","asked","speak","speaks","spoke","talk","talks","talked","answer","answered"]) {
  const r = scan(f); const g = (t: string) => r.filter(x => x.tier === t).length;
  console.log(f.padEnd(12) + String(g("A1")).padStart(5) + String(g("A2")).padStart(5) + String(g("A3")).padStart(5) + String(g("A4")).padStart(5) + String(g("A1")+g("A2")+g("A3")+g("A4")).padStart(7) + String(g("W")).padStart(7) + String(g("M")).padStart(5) + String(g("C")).padStart(7));
}
console.log("\n=== said 逐条落点 ===");
for (const x of scan("said")) console.log(`  L${x.lesson} [${x.tier}] ${x.slot}: ${JSON.stringify(x.text.slice(0,130))}`);
console.log("\n=== say/says 逐条落点 ===");
for (const f of ["say","says"]) { console.log(`--- ${f} ---`);
  for (const x of scan(f)) console.log(`  L${x.lesson} [${x.tier}] ${x.slot}: ${JSON.stringify(x.text.slice(0,130))}`); }
console.log("\n=== 案件里 say 家族 ===");
for (const f of ["tell","tells","told","say","says","said"]) {
  const inTok: string[] = [], asErr: string[] = [], asCorr: string[] = [];
  for (const c of huntCases) { if (hit(f, c.tokens.join(" "))) inTok.push(`${c.id}(n=${c.number})`);
    for (const e of c.errors) { if (hit(f, e.original)) asErr.push(`${c.id}: "${e.original}"→"${e.correction}"`); if (hit(f, e.correction)) asCorr.push(`${c.id}: "${e.correction}"`); } }
  console.log(`  ${f.padEnd(8)} tokens=${inTok.length} [${inTok.slice(0,6).join(",")}] 错词=${asErr.length} [${asErr.slice(0,4).join(" | ")}] 纠正=${asCorr.length} [${asCorr.slice(0,4).join(" | ")}]`);
}
