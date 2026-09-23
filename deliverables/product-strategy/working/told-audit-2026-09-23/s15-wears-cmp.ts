import { grammarLessons } from "../../../../src/data/grammarLessons";
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
      if (c.bothRight) { if (hit(f, c.wrong)) out.push({ tier: "A4", lesson: l.number, slot: "contrast[].wrong(bothRight)", text: c.wrong }); }
      else if (hit(f, c.wrong)) out.push({ tier: "W", lesson: l.number, slot: "contrast[].wrong", text: c.wrong });
      if (c.wrongMark && hit(f, c.wrongMark)) out.push({ tier: "W", lesson: l.number, slot: "contrast[].wrongMark", text: c.wrongMark });
    }
    for (const p of l.practice) for (const d of p.distractors ?? []) if (hit(f, d)) out.push({ tier: "W", lesson: l.number, slot: "practice[].distractors[]", text: d });
    for (const g of l.guided) {
      if (g.kind === "spot") { const j = (g.tokens ?? []).join(" ");
        if (hit(f, j) || hit(f, g.wrongToken) || hit(f, g.answer)) out.push({ tier: "W", lesson: l.number, slot: "guided[spot]折叠", text: j }); }
      else { if (hit(f, g.answer)) out.push({ tier: "A2", lesson: l.number, slot: "guided[].answer", text: g.answer });
        if (g.replaceBase && hit(f, g.replaceBase)) out.push({ tier: "A3", lesson: l.number, slot: "guided[].replaceBase", text: g.replaceBase });
        for (const o of g.options ?? []) if (hit(f, o)) out.push({ tier: o === g.answer ? "A2" : "W", lesson: l.number, slot: o === g.answer ? "options==ans" : "options!=ans", text: o });
        for (const t of g.tokens ?? []) if (hit(f, t)) out.push({ tier: "M", lesson: l.number, slot: "arrange.tokens", text: t }); }
    }
    const C = (slot: string, t?: string) => { if (hit(f, t)) out.push({ tier: "C", lesson: l.number, slot, text: t! }); };
    C("oneLineRule", l.oneLineRule); C("summary.rule", l.summary?.rule);
    for (const p of l.summary?.points ?? []) C("summary.points[]", p);
    for (const p of l.deepDive?.paragraphs ?? []) C("deepDive.paragraphs[]", p);
    for (const g of l.guided) { C("guided[].explain", g.explain); C("guided[].correctionZh", g.correctionZh); C("guided[].promptZh", g.promptZh); }
    for (const c of l.contrast ?? []) C("contrast[].whyZh", c.whyZh);
    for (const v of l.variants ?? []) C("variants[].noteZh", v.noteZh);
    if (l.recall) C("recall.noteZh", l.recall.noteZh);
    for (const d of l.dialogue ?? []) C("dialogue[].zh", d.zh);
    for (const s of l.sceneSwings ?? []) C("sceneSwings[].zh", s.zh);
    for (const e of l.examples) C("examples[].zh", e.zh);
    for (const p of l.practice) C("practice[].promptZh", p.promptZh);
    C("title", l.title); C("grammarLabel", l.grammarLabel);
    C("intentZh", l.intentZh); C("dialogueZh", l.dialogueZh); C("sceneSetupZh", l.sceneSetupZh);
    if (l.recall) { C("recall.intentZh", l.recall.intentZh); C("recall.promptZh", l.recall.promptZh); }
  }
  return out;
}
console.log("=== 「原形当主角(TS) / 三单正侧 / 过去式正侧」对照（用于 tells 判定）===");
console.log("词族".padEnd(16) + "原形TS".padStart(8) + "原形A合计".padStart(11) + "三单A合计".padStart(11) + "过去A合计".padStart(11) + "原形W".padStart(8) + "三单W".padStart(8) + "过去W".padStart(8));
const fams: [string,string,string][] = [
  ["wear/wears/wore","wear","wears","wore"],
  ["tell/tells/told","tell","tells","told"],
  ["say/says/said","say","says","said"],
  ["drink/drinks/drank","drink","drinks","drank"],
  ["draw/draws/drew","draw","draws","drew"],
  ["give/gives/gave","give","gives","gave"],
  ["sleep/sleeps/slept","sleep","sleeps","slept"],
  ["feel/feels/felt","feel","feels","felt"],
  ["keep/keeps/kept","keep","keeps","kept"],
  ["know/knows/knew","know","knows","knew"],
  ["think/thinks/thought","think","thinks","thought"],
  ["go/goes/went","go","goes","went"],
  ["get/gets/got","get","gets","got"],
  ["swim/swims/swam","swim","swims","swam"],
  ["sing/sings/sang","sing","sings","sang"],
];
for (const [label,b,s,p] of fams) {
  const g=(f:string,tier?:string)=>{const r=scan(f); return tier? r.filter(x=>x.tier===tier).length : r.filter(x=>["A1","A2","A3","A4"].includes(x.tier)).length;};
  const ts = grammarLessons.filter(l=>hit(b,l.targetSentence)).length;
  console.log(label.padEnd(16)+String(ts).padStart(8)+String(g(b)).padStart(11)+String(g(s)).padStart(11)+String(g(p)).padStart(11)+String(g(b,"W")).padStart(8)+String(g(s,"W")).padStart(8)+String(g(p,"W")).padStart(8));
}
