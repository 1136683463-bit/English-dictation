import { grammarLessons } from "../../../../src/data/grammarLessons";
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
const words = (s: string) => norm(s).split(" ").filter(Boolean);
const sorted = [...(grammarLessons as any[])].sort((a, b) => a.number - b.number);

// 累计"学生到这一课为止见过的全部教学材料词"
const cumulative = new Set<string>();
const trueD: string[] = [];
const reviewD: string[] = [];
let cLayer = 0, aLayer = 0, bLayer = 0, total = 0;
const noNewSentence: number[] = [];

for (const l of sorted) {
  const lessonVocab = new Set<string>();
  const addTo = (set: Set<string>, t?: string) => { if (t) for (const w of words(t)) set.add(w); };
  // 本课教学材料（不含 practice 自身 tokens）
  addTo(lessonVocab, l.targetSentence);
  for (const e of l.examples || []) addTo(lessonVocab, e.en);
  for (const b of l.blocks || []) addTo(lessonVocab, b.text);
  for (const d of l.dialogue || []) addTo(lessonVocab, d.en);
  for (const c of l.contrast || []) { addTo(lessonVocab, c.correct); addTo(lessonVocab, c.wrong); }
  for (const v of l.variants || []) addTo(lessonVocab, v.en);
  for (const s of l.sceneSwings || []) addTo(lessonVocab, s.en);
  for (const g of l.guided || []) { if (g.answer) addTo(lessonVocab, g.answer); for (const t of g.tokens || []) addTo(lessonVocab, t); }
  if (l.recall?.answer) addTo(lessonVocab, l.recall.answer);
  lessonVocab.delete("");

  // 展示句集合（用于 A/B/C 分层）
  const sentences = new Set<string>();
  const addS = (t?: string) => { if (t) sentences.add(norm(t)); };
  addS(l.targetSentence);
  for (const e of l.examples || []) addS(e.en);
  for (const d of l.dialogue || []) addS(d.en);
  addS(l.dialogueEn);
  for (const c of l.contrast || []) { addS(c.correct); addS(c.wrong); }
  for (const v of l.variants || []) addS(v.en);
  for (const s of l.sceneSwings || []) addS(s.en);
  if (l.recall?.answer) addS(l.recall.answer);
  for (const g of l.guided || []) if (g.answer) addS(g.answer);
  sentences.delete("");

  // 合并进累计词表（先判本课，后累加——保证"本课已教"包含本课材料）
  const seenBefore = new Set([...cumulative, ...lessonVocab]);

  let hasC = false;
  for (const p of l.practice || []) {
    total++;
    const missLocal = words(p.answer).filter((w) => !lessonVocab.has(w));
    const missCum = words(p.answer).filter((w) => !seenBefore.has(w));
    if (norm(p.answer) === norm(l.targetSentence)) aLayer++;
    else if (sentences.has(norm(p.answer))) bLayer++;
    else if (missCum.length === 0) { cLayer++; hasC = true; }
    if (missLocal.length > 0) {
      const tag = `L${l.number}「${p.answer}」缺[${[...new Set(missLocal)].join(",")}]`;
      if (missCum.length > 0) trueD.push(tag + `  ←累计也缺[${[...new Set(missCum)].join(",")}]`);
      else reviewD.push(tag);
    }
  }
  if (!hasC) noNewSentence.push(l.number);
  for (const w of lessonVocab) cumulative.add(w);
}

console.log(`总题 ${total} | A=${aLayer} B=${bLayer} C=${cLayer}`);
console.log(`\n【真缺】累计到本课都没教过的词: ${trueD.length} 题`);
trueD.forEach((t) => console.log("  " + t));
console.log(`\n【复习缺】本课没出现但前课教过（复习题，非缺陷）: ${reviewD.length} 题`);
reviewD.forEach((t) => console.log("  " + t));
console.log(`\n【无新句】整课练习都没有 C 层的课: ${noNewSentence.length} 课`);
console.log("  " + noNewSentence.join(","));
