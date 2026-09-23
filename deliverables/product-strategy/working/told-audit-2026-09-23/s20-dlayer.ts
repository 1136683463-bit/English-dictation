import { grammarLessons } from "../../../../src/data/grammarLessons";
const w = (v: string) => v.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
// 复刻 grammarLessons.test.ts 的 buildPools（D 层守门的「已教词」口径）
function buildPools(l: any) {
  const vocab = new Set<string>();
  const add = (t?: string) => { if (t) for (const x of w(t)) vocab.add(x); };
  add(l.targetSentence);
  for (const e of l.examples ?? []) add(e.en);
  for (const b of l.blocks ?? []) add(b.text);
  for (const d of l.dialogue ?? []) add(d.en);
  for (const c of l.contrast ?? []) { add(c.correct); add(c.wrong); }
  for (const v of l.variants ?? []) add(v.en);
  for (const s of l.sceneSwings ?? []) add(s.en);
  for (const g of l.guided ?? []) { if (g.answer) add(g.answer); for (const t of g.tokens ?? []) add(t); }
  if (l.recall?.answer) add(l.recall.answer);
  vocab.delete("");
  return vocab;
}
const sorted = [...grammarLessons].sort((a, b) => a.number - b.number);
const cum = new Set<string>();
console.log("=== `tell` 何时进入 D 层守门的「已教词」集合 ===");
const watch = ["tell","tells","told","telling","me","about","your","class","week","family","cousin"];
const firstSeen: Record<string, number[]> = {};
for (const l of sorted) {
  const v = buildPools(l);
  for (const k of watch) if (v.has(k) || cum.has(k)) { (firstSeen[k] ??= []).push(l.number); }
  for (const x of v) cum.add(x);
}
for (const k of watch) console.log(`  ${k.padEnd(10)} 首次被判「已教」= L${firstSeen[k]?.[0] ?? "（从未）"}`);
console.log(`\n  ⇒ 累计到 L204 后，D 层「已教词」总量 = ${cum.size}`);
console.log(`  ⇒ tell 在「已教词」里? ${cum.has("tell")}   told 在? ${cum.has("told")}   tells 在? ${cum.has("tells")}`);
console.log("\n=== 含义：D 层守门是否会把含 tell/told 的练习答案判红？===");
const test = ["I told him the news.","Can you tell me the way?","She tells a story."];
for (const s of test) {
  const missing = w(s).filter(x => !cum.has(x));
  console.log(`  「${s}」 未教词 = ${missing.length ? missing.join("、") : "无 → D 层通过 ✓"}`);
}
console.log("\n=== 未立课的常见不规则过去式盘点（原形A≥1 但过去式0正侧）===");
function scanPos(f: string) {
  const H = (t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
  let n = 0;
  for (const l of grammarLessons) {
    const A = (t?: string) => { if (H(t)) n++; };
    A(l.targetSentence); A(l.dialogueEn); for (const d of l.dialogue ?? []) A(d.en);
    for (const e of l.examples) A(e.en); for (const v of l.variants ?? []) A(v.en);
    for (const s of l.sceneSwings ?? []) A(s.en); for (const b of l.blocks) A(b.text);
    for (const p of l.practice) A(p.answer); if (l.recall) A(l.recall.answer);
    for (const c of l.contrast ?? []) { A(c.correct); if (c.bothRight) A(c.wrong); }
    for (const g of l.guided) { if (g.kind !== "spot") { A(g.answer); A(g.replaceBase); } }
  }
  return n;
}
const PAIRS: [string,string][] = [["say","said"],["tell","told"],["see","saw"],["write","wrote"],["buy","bought"],["find","found"],["leave","left"],["come","came"],["make","made"],["get","got"],["know","knew"],["go","went"],["take","took"],["think","thought"],["draw","drew"],["give","gave"],["sleep","slept"],["feel","felt"],["keep","kept"],["sit","sat"],["catch","caught"],["swim","swam"],["sing","sang"],["wear","wore"],["speak","spoke"],["hear","heard"],["meet","met"],["run","ran"],["win","won"],["fly","flew"],["drink","drank"],["ring","rang"],["ride","rode"],["fall","fell"],["stand","stood"],["pay","paid"],["understand","understood"],["take","took"]];
console.log("原形".padEnd(13)+"过去式".padEnd(13)+"原形正侧".padStart(9)+"过去式正侧".padStart(11)+" 判定");
let taught=0, untaught=0;
for (const [b,p] of PAIRS) {
  const nb=scanPos(b), np=scanPos(p);
  const verdict = np>0 ? "已立课/已覆盖" : (nb>=1 ? "★原形有素材·过去式0" : "原形也0");
  if (np>0) taught++; else untaught++;
  console.log(b.padEnd(13)+p.padEnd(13)+String(nb).padStart(9)+String(np).padStart(11)+" "+verdict);
}
console.log(`\n  过去式已有正侧: ${taught} 个；过去式0正侧: ${untaught} 个`);
