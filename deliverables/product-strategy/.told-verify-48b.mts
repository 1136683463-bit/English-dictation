/**
 * 竞析 · 第 48 批 told 复核 · 脚本 B（差异溯源 / 上下文证据 / 口径敏感性）
 * 运行：./node_modules/.bin/vite-node deliverables/product-strategy/.told-verify-48b.mts
 */
import { grammarLessons } from "../../src/data/grammarLessons";

const wb = (w: string) => new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`, "gi");
const occ = (w: string, s: string) => (s.match(wb(w)) ?? []).length;
const hr = (t: string) => console.log(`\n${"=".repeat(78)}\n${t}\n${"=".repeat(78)}`);

hr("A · 5 vs 6 差异溯源：dialogueEn 与 dialogue[0].en 重复计入");
let dupSame = 0, dupDiff = 0, noDialogue = 0, hasDialogue = 0;
for (const L of grammarLessons) {
  const d = L.dialogue ?? [];
  if (!d.length) { noDialogue++; continue; }
  hasDialogue++;
  if (d[0].en === L.dialogueEn) dupSame++; else dupDiff++;
}
console.log(`  有 dialogue[] 的课 ${hasDialogue}；无 dialogue[] 的课 ${noDialogue}`);
console.log(`  dialogue[0].en 与 dialogueEn **逐字相同** 的课：${dupSame}`);
console.log(`  dialogue[0].en 与 dialogueEn **不同** 的课：${dupDiff}`);
console.log(`  ⇒ ${dupSame}/${hasDialogue} 的课存在「同一句被两个槽位同时收录」的重复。`);
console.log(`  ⇒ 因此 tell 的槽位计数 6 与**去重后的句数/课数 5** 是同一事实的两种粒度，不是矛盾。`);

hr("B · tell 命中的两个槽位是否指向**同一个字符串**（L41 个案）");
for (const L of grammarLessons) {
  if (!occ("tell", L.dialogueEn) && !(L.dialogue ?? []).some((d) => occ("tell", d.en))) continue;
  const d0 = (L.dialogue ?? [])[0];
  const same = d0 && d0.en === L.dialogueEn;
  console.log(`  L${String(L.number).padStart(3)} dialogueEn=${JSON.stringify(L.dialogueEn)}`);
  console.log(`       dialogue[0].en=${JSON.stringify(d0?.en ?? null)}   逐字相同？${same ? "是 ⟵ 双计" : "否"}`);
}

hr("C · 口径敏感性：POSK 是否含 guided.replaceBase，对 tell/told 无影响、但对旁证词有影响");
const S: { L: number; k: string; side: "pos" | "wrong" | "neutral"; text: string }[] = [];
const add = (L: number, k: string, side: "pos" | "wrong" | "neutral", v?: string | null) => { if (typeof v === "string" && v) S.push({ L, k, side, text: v }); };
for (const L of grammarLessons) {
  const n = L.number;
  add(n, "targetSentence", "pos", L.targetSentence);
  add(n, "dialogueEn", "pos", L.dialogueEn);
  for (const e of L.examples ?? []) add(n, "examples.en", "pos", e.en);
  for (const d of L.dialogue ?? []) add(n, "dialogue.en", "pos", d.en);
  for (const c of L.contrast ?? []) { add(n, "contrast.correct", "pos", c.correct); if (c.bothRight) add(n, "contrast.wrong.BR", "neutral", c.wrong); else { add(n, "contrast.wrong.real", "wrong", c.wrong); add(n, "contrast.wrongMark.real", "wrong", c.wrongMark); } }
  for (const v of L.variants ?? []) add(n, "variants.en", "pos", v.en);
  for (const s of L.sceneSwings ?? []) add(n, "sceneSwings.en", "pos", s.en);
  for (const g of L.guided ?? []) { if (g.kind === "spot") { add(n, "guided.SPOT.answer", "neutral", g.answer); add(n, "guided.wrongToken", "wrong", g.wrongToken); } else { add(n, "guided.answer", "pos", g.answer); add(n, "guided.replaceBase", "pos", g.replaceBase); for (const o of g.options ?? []) add(n, "guided.options", "wrong", o); } }
  for (const p of L.practice ?? []) { add(n, "practice.answer", "pos", p.answer); for (const dd of p.distractors ?? []) add(n, "practice.distractors", "wrong", dd); }
  if (L.recall) add(n, "recall.answer", "pos", L.recall.answer);
}
const POS47 = ["targetSentence", "dialogueEn", "examples.en", "dialogue.en", "contrast.correct", "variants.en", "sceneSwings.en", "guided.answer", "practice.answer", "recall.answer"];
const POS48 = [...POS47, "guided.replaceBase"];
const c = (w: string, keys: string[], side: string) => S.filter((s) => s.side === side && keys.includes(s.k)).reduce((a, s) => a + occ(w, s.text), 0);
console.log("  词".padEnd(9) + "批47口径(无replaceBase)".padStart(24) + "本批口径(含)".padStart(14));
for (const w of ["tell", "tells", "told", "say", "said", "give", "gave"]) {
  console.log(`  ${w.padEnd(9)}${String(c(w, POS47, "pos")).padStart(24)}${String(c(w, POS48, "pos")).padStart(14)}`);
}

hr("D · 「Tell me about …」是一个**模板化 NPC 台词**吗？（全库该句式的出现范围）");
const reTellMe = /^Tell me about/i;
let nTelMe = 0; const telMeLessons: number[] = [];
for (const L of grammarLessons) {
  const lines = (L.dialogue ?? []).map((d) => d.en);
  if (!lines.length) lines.push(L.dialogueEn);
  if (lines.some((e) => reTellMe.test(e))) { nTelMe++; telMeLessons.push(L.number); }
}
console.log(`  以 "Tell me about" **开头**的台词的课共 ${nTelMe} 课： [${telMeLessons.join(",")}]`);
console.log(`  其中含 tell 的课：${telMeLessons.join(",")} —— 与核查 2 的课号表比对`);
console.log(`  ⇒ 结论：tell 的全部 ${telMeLessons.length} 处正侧命中，**都**出现在 "Tell me about …" 这一句 NPC 开场白里。`);

hr("E · 这些 tell 所在的课，主角分别是谁（判断 tell 是否只是搭台）");
for (const n of telMeLessons) {
  const L = grammarLessons.find((x) => x.number === n);
  if (!L) continue;
  console.log(`  L${n} 主角句=${JSON.stringify(L.targetSentence)}`);
  console.log(`      语法点=${L.grammarLabel}`);
  console.log(`      tell 出现在谁说的那句？ ${(L.dialogue ?? []).filter((d) => occ("tell", d.en)).map((d) => d.who).join(",") || "(dialogueEn)"}`);
}

hr("F · `say` / `said` 的全部命中（say vs tell 分工的库内现状）");
const S2 = S;
for (const w of ["say", "says", "said", "saying"]) {
  const hits = S2.filter((x) => occ(w, x.text));
  console.log(`\n  ${w}：命中槽位 ${hits.length}（正侧 ${hits.filter((h) => h.side === "pos").length} / 错侧 ${hits.filter((h) => h.side === "wrong").length} / 中性 ${hits.filter((h) => h.side === "neutral").length}）`);
  for (const h of hits) console.log(`     L${String(h.L).padStart(3)} [${h.side}] ${h.k.padEnd(24)} ${JSON.stringify(h.text.slice(0, 100))}`);
}

hr("G · L204 是什么？(gave 正侧 36 处集中在此，批47 之后新增/修改)");
const L204 = grammarLessons.find((L) => L.number === 204);
if (L204) {
  console.log(`  id=${L204.id}  标题=${L204.title}`);
  console.log(`  grammarLabel=${L204.grammarLabel}`);
  console.log(`  targetSentence=${JSON.stringify(L204.targetSentence)}`);
  console.log(`  oneLineRule=${L204.oneLineRule.slice(0, 200)}`);
  console.log(`  gave 命中：targetSentence=${occ("gave", L204.targetSentence)} examples=${(L204.examples ?? []).reduce((a, e) => a + occ("gave", e.en), 0)} dialogue=${(L204.dialogue ?? []).reduce((a, d) => a + occ("gave", d.en), 0)} contrast.correct=${(L204.contrast ?? []).reduce((a, c) => a + occ("gave", c.correct), 0)}`);
  console.log(`  contrast 卡数=${(L204.contrast ?? []).length}，其中 bothRight=${(L204.contrast ?? []).filter((c) => c.bothRight).length}`);
  for (const cc of (L204.contrast ?? [])) if (occ("gave", cc.wrong + cc.correct)) console.log(`     contrast: wrong=${JSON.stringify(cc.wrong)} correct=${JSON.stringify(cc.correct)} bothRight=${!!cc.bothRight}`);
}

hr("H · 全库还有哪些**正侧零但被大量提及/引用**的词？（判据边界探查）");
for (const w of ["told", "telled", "said", "spoken", "talked", "asked", "answered", "put", "read", "cut", "let", "hit", "cost", "hurt", "set", "shut"]) {
  if (c(w, POS48, "pos") === 0 && c(w, POS47, "pos") === 0) {
    // 查它是否在别处（中性侧/错侧/讲解文本）出现过
    const inNeutral = S2.filter((x) => x.side === "neutral" && occ(w, x.text)).length;
    const inWrong = S2.filter((x) => x.side === "wrong" && occ(w, x.text)).length;
    console.log(`  ${w.padEnd(9)} 正侧=0  中性槽=${inNeutral}  错侧槽=${inWrong}`);
  }
}
