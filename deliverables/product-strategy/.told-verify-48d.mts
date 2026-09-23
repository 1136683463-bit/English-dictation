/** 竞析 · 第48批 · 脚本 D：判据的「字面 vs 词元」两读 + comparison 相关课程 + tag UI 定位 */
import { grammarLessons } from "../../src/data/grammarLessons";
import { huntCases } from "../../src/data/huntCases";
const hr = (t: string) => console.log(`\n${"=".repeat(78)}\n${t}\n${"=".repeat(78)}`);
const wb = (w: string) => new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`, "gi");
const occ = (w: string, s: string) => (s.match(wb(w)) ?? []).length;

hr("A · 判据的两种读法：①字面（原形表面形）②词元（该词的任一形态）");
const FAMILIES: Record<string, string[]> = {
  tell: ["tell", "tells", "told", "telling"],
  say: ["say", "says", "said", "saying"],
  give: ["give", "gives", "gave", "given", "giving"],
  lose: ["lose", "loses", "lost", "losing"],
  break: ["break", "breaks", "broke", "broken", "breaking"],
  draw: ["draw", "draws", "drew", "drawn", "drawing"],
  wear: ["wear", "wears", "wore", "worn", "wearing"],
  feel: ["feel", "feels", "felt", "feeling"],
  keep: ["keep", "keeps", "kept", "keeping"],
  sleep: ["sleep", "sleeps", "slept", "sleeping"],
  sit: ["sit", "sits", "sat", "sitting"],
  catch: ["catch", "catches", "caught", "catching"],
  swim: ["swim", "swims", "swam", "swum", "swimming"],
  sing: ["sing", "sings", "sang", "sung", "singing"],
  think: ["think", "thinks", "thought", "thinking"],
  know: ["know", "knows", "knew", "known", "knowing"],
  speak: ["speak", "speaks", "spoke", "spoken", "speaking"],
  talk: ["talk", "talks", "talked", "talking"],
  ask: ["ask", "asks", "asked", "asking"],
};
console.log("  词".padEnd(8) + "①字面：原形在主角句".padStart(22) + "②词元：任一族形态在主角句".padStart(28) + "  分歧");
for (const [base, forms] of Object.entries(FAMILIES)) {
  const lit = grammarLessons.filter((L) => occ(base, L.targetSentence)).map((L) => L.number);
  const lem = grammarLessons.filter((L) => forms.some((f) => occ(f, L.targetSentence))).map((L) => L.number);
  const diverge = lit.length === 0 && lem.length > 0;
  console.log(
    `  ${base.padEnd(8)}${(`[${lit.join(",")}]`).padStart(22)}${(`[${lem.join(",")}]`).padStart(28)}` +
    (diverge ? `  ⚠️ 字面=0 但词元≠0（${lem.length} 课）` : "")
  );
}

hr("B · 分歧个案的逐课证据（这些课的 targetSentence 用的是哪个形态）");
for (const [base, forms] of Object.entries(FAMILIES)) {
  const lit = grammarLessons.filter((L) => occ(base, L.targetSentence)).map((L) => L.number);
  const lem = grammarLessons.filter((L) => forms.some((f) => occ(f, L.targetSentence))).map((L) => L.number);
  if (!(lit.length === 0 && lem.length > 0)) continue;
  console.log(`\n  ── ${base}（字面 0 课，词元 ${lem.length} 课）`);
  for (const n of lem) {
    const L = grammarLessons.find((x) => x.number === n);
    if (!L) continue;
    const hit = forms.filter((f) => occ(f, L.targetSentence));
    console.log(`     L${n} ${L.grammarLabel} :: ${JSON.stringify(L.targetSentence)}  ← 命中形态 ${hit.join("/")}`);
  }
}

hr("C · 这两读对批四十七结论的影响（lose / break / speak / talk / ask 是重灾区）");
const PASTFORMS = ["told", "said", "gave", "lost", "broke", "drew", "wore", "felt", "kept", "slept", "sat", "caught", "swam", "sang", "thought", "knew", "spoke", "talked", "asked"];
const POSK = ["targetSentence", "dialogueEn", "examples.en", "dialogue.en", "contrast.correct", "variants.en", "sceneSwings.en", "guided.answer", "guided.replaceBase", "practice.answer", "recall.answer"];
const WRONGK = ["contrast.wrong.real", "contrast.wrongMark.real", "guided.options", "guided.wrongToken", "practice.distractors"];
const S: { L: number; k: string; side: string; text: string }[] = [];
const add = (L: number, k: string, side: string, v?: string | null) => { if (typeof v === "string" && v) S.push({ L, k, side, text: v }); };
for (const L of grammarLessons) {
  const n = L.number;
  add(n, "targetSentence", "pos", L.targetSentence); add(n, "dialogueEn", "pos", L.dialogueEn);
  for (const e of L.examples ?? []) add(n, "examples.en", "pos", e.en);
  for (const d of L.dialogue ?? []) add(n, "dialogue.en", "pos", d.en);
  for (const c of L.contrast ?? []) { add(n, "contrast.correct", "pos", c.correct); if (c.bothRight) add(n, "contrast.wrong.BR", "neutral", c.wrong); else { add(n, "contrast.wrong.real", "wrong", c.wrong); add(n, "contrast.wrongMark.real", "wrong", c.wrongMark); } }
  for (const v of L.variants ?? []) add(n, "variants.en", "pos", v.en);
  for (const s of L.sceneSwings ?? []) add(n, "sceneSwings.en", "pos", s.en);
  for (const g of L.guided ?? []) { if (g.kind === "spot") { add(n, "guided.SPOT.answer", "neutral", g.answer); add(n, "guided.wrongToken", "wrong", g.wrongToken); } else { add(n, "guided.answer", "pos", g.answer); add(n, "guided.replaceBase", "pos", g.replaceBase); for (const o of g.options ?? []) add(n, "guided.options", "wrong", o); } }
  for (const p of L.practice ?? []) { add(n, "practice.answer", "pos", p.answer); for (const dd of p.distractors ?? []) add(n, "practice.distractors", "wrong", dd); }
  if (L.recall) add(n, "recall.answer", "pos", L.recall.answer);
}
const c = (w: string, keys: string[], side: string) => S.filter((s) => s.side === side && keys.includes(s.k)).reduce((a, s) => a + occ(w, s.text), 0);
console.log("  过去式".padEnd(10) + "正侧".padStart(6) + "错侧".padStart(6) + "  原形字面主角课".padStart(16) + "  词元主角课".padStart(14) + "  立课/挂靠结论");
for (const p of PASTFORMS) {
  const base = Object.entries(FAMILIES).find(([, fs]) => fs.includes(p))?.[0];
  const lit = base ? grammarLessons.filter((L) => occ(base, L.targetSentence)).map((L) => L.number) : [];
  const lem = base ? grammarLessons.filter((L) => FAMILIES[base].some((f) => occ(f, L.targetSentence))).map((L) => L.number) : [];
  const verdict = lit.length ? "立课资格(字面也过)" : lem.length ? "⚠️ 字面不过/词元过 → 结论随读法翻转" : "仅挂靠/不处理";
  console.log(`  ${p.padEnd(10)}${String(c(p, POSK, "pos")).padStart(6)}${String(c(p, WRONGK, "wrong")).padStart(6)}${(`[${lit.join(",")}]`).padStart(16)}${(`[${lem.join(",")}]`).padStart(14)}  ${verdict}`);
}

hr("D · comparison（比一比）相关课程：这个罪名本来该挂在哪");
for (const L of [...grammarLessons].sort((a, b) => a.number - b.number)) {
  const hay = `${L.grammarLabel} ${L.title} ${L.oneLineRule} ${L.targetSentence}`;
  if (/比较级|最高级|比一比|more .* than|the most|better|best/.test(hay)) {
    console.log(`  L${String(L.number).padStart(3)} ${L.grammarLabel.padEnd(36)} 主角句=${JSON.stringify(L.targetSentence).slice(0, 62)}`);
  }
}

hr("E · huntCases 里有没有「比一比」性质的错误（人工判断 comparison 是否本该有案）");
let n = 0;
for (const cse of huntCases) {
  for (const e of cse.errors) {
    const hay = `${e.original} ${e.correction} ${e.explanation}`;
    if (/比较级|最高级|more|most|better|best|than|-er\b/.test(hay)) {
      n++;
      if (n <= 25) console.log(`  ${cse.id} #${cse.number} tag=${e.tag.padEnd(13)} ${e.original} → ${e.correction}  ｜ ${e.explanation.slice(0, 60)}`);
    }
  }
}
console.log(`  ⇒ 可能属比较范畴的错误点共 ${n} 处（人工判断，非脚本归类）`);
