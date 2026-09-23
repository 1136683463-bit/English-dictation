import { grammarLessons } from "../../../../src/data/grammarLessons";
const W = (f: string, t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
const ts = (f: string) => grammarLessons.filter(l => W(f, l.targetSentence)).map(l => `L${l.number}`);
const hasTs = (f: string) => ts(f).length > 0;
function scanPos(f: string) {
  const H = (t?: string) => W(f, t);
  let n = 0;
  for (const l of grammarLessons) {
    const A = (t?: string) => { if (H(t)) n++; };
    A(l.targetSentence); A(l.dialogueEn); for (const d of l.dialogue ?? []) A(d.en);
    for (const e of l.examples) A(e.en); for (const v of l.variants ?? []) A(v.en);
    for (const s of l.sceneSwings ?? []) A(s.en); for (const b of l.blocks) A(b.text);
    for (const p of l.practice) A(p.answer); if (l.recall) A(l.recall.answer);
    for (const c of l.contrast ?? []) { A(c.correct); if (c.bothRight) A(c.wrong); }
    for (const g of l.guided) if (g.kind !== "spot") { A(g.answer); A(g.replaceBase); }
  }
  return n;
}
// -s 形生成（覆盖 s/es/ies/oes/ves 常规）
function sForm(b: string) {
  if (/[^aeiou]y$/.test(b)) return b.slice(0,-1) + "ies";
  if (/(s|x|z|ch|sh|o)$/.test(b)) return b + "es";
  return b + "s";
}
const PAIRS: [string,string][] = [
  ["say","said"],["tell","told"],["see","saw"],["write","wrote"],["buy","bought"],["find","found"],
  ["leave","left"],["come","came"],["make","made"],["get","got"],["know","knew"],["go","went"],
  ["take","took"],["think","thought"],["draw","drew"],["give","gave"],["sleep","slept"],["feel","felt"],
  ["keep","kept"],["sit","sat"],["catch","caught"],["swim","swam"],["sing","sang"],["wear","wore"],
  ["hear","heard"],["meet","met"],["run","ran"],["win","won"],["drink","drank"],["ring","rang"],
  ["fall","fell"],["eat","ate"],["do","did"],["put","put"],["read","read"],["lose","lost"],["break","broke"],
  ["speak","spoke"],["fly","flew"],["ride","rode"],["stand","stood"],["pay","paid"],["understand","understood"],
  ["teach","taught"],["sell","sold"],["send","sent"],["tell","told"],
];
console.log("=== 判据检验：两条口径 × 「过去式是否有正侧」 ===");
console.log("原形".padEnd(13)+"过去式".padEnd(11)+"原形TS".padStart(7)+"-s形TS".padStart(8)+"过去式正侧".padStart(10)+"   C-严格预测 / 实际");
let okStrict=0, badStrict=0, okFam=0, badFam=0;
const badList: string[] = [], badFamList: string[] = [];
for (const [b,p] of PAIRS) {
  const bTs = hasTs(b), sTs = hasTs(sForm(b)), np = scanPos(p);
  const strictPred = bTs ? "立课" : "不立课";
  const famPred = (bTs || sTs) ? "立课" : "不立课";
  const actual = np > 0 ? "立课" : "不立课";
  if (np === 0) { if (strictPred === actual) okStrict++; else badStrict++, badList.push(`${b}→${p}`); }
  else { if (strictPred === "立课") okStrict++; else badStrict++, badList.push(`${b}→${p}(过去式正侧${np})`); }
  if (np === 0) { if (famPred === actual) okFam++; else badFam++, badFamList.push(`${b}→${p}`); }
  else { if (famPred === "立课") okFam++; else badFam++, badFamList.push(`${b}→${p}(正侧${np})`); }
  console.log(b.padEnd(13)+p.padEnd(11)+String(ts(b).length).padStart(7)+String(ts(sForm(b)).length).padStart(8)+String(np).padStart(10)+"   "+strictPred+" / "+actual+(strictPred!==actual?"  ❌":"  ✓")+"   | 族口径 "+famPred+(famPred!==actual?"  ❌":"  ✓"));
}
console.log(`\n  C-严格（只看原形TS）  命中 ${okStrict} / 反例 ${badStrict}  → 反例: ${badList.join(", ")}`);
console.log(`  C-族（原形 或 -s 形 TS）命中 ${okFam} / 反例 ${badFam}  → 反例: ${badFamList.join(", ")}`);
