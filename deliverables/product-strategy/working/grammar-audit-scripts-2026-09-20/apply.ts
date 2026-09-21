/**
 * B1 批次 A 注入（L170–L175）
 * 六道闸校验 + 追加到 grammarLessons.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { grammarLessons } from "../../../../src/data/grammarLessons";
import { B1_LESSONS_A } from "./batch-a";
import { B1_LESSONS_A2 } from "./batch-a2";
import type { NewLesson } from "./types";

const ALL: NewLesson[] = [...B1_LESSONS_A, ...B1_LESSONS_A2];
const COVER_COUNT = 117;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
const toks = (s: string) => norm(s).split(" ").filter(Boolean);
const jac = (a: string, b: string) => {
  const A = new Set(toks(a)), B = new Set(toks(b));
  let i = 0; for (const x of A) if (B.has(x)) i += 1;
  return i / (A.size + B.size - i);
};
const PRON = new Set(["i","you","he","she","it","we","they","me","him","her","us","them",
  "my","your","his","its","our","their","mine","yours","hers","ours","theirs"]);
const shape = (s: string) => toks(s).map((w) => (PRON.has(w) ? "@" : w)).join(" ");
const ZERO_TERMS = ["主语","谓语","宾语","表语","定语","状语","单数","复数","三单","原形","时态",
  "一般过去时","一般现在时","现在进行时","过去进行时","现在完成时","情态动词","比较级","最高级",
  "从句","语序","可数","疑问句","否定句","被动语态","第三人称","形容词","副词","介词"];
const BAD_GRAMMAR: [RegExp, string][] = [
  [/^(am|is|are|was|were)\s+(want|like|go|have|has|make|play|read|eat|do|does|draw|sing|run|sleep|watch|come|get|help|keep|let|put|take|give|pass|finish|enjoy|look|sound|smell|taste|feel|seem|be able)\b/i, "be 后直接跟动词"],
  [/\b(is|are|am|was|were)\s+(is|are|am|was|were)\b/i, "两个 be 连用"],
  [/^i\s+(is|are|were)\b/i, "I 后应跟 am/was"],
  [/^(he|she|it)\s+(am|are|were)\b/i, "三单后应跟 is/was"],
  [/\b(do|does|did|don't|doesn't|didn't)\s+(is|are|am|goes|went|likes|wants)\b/i, "助动词后应跟原形"],
  [/\b(will|can|must|should|could|would)\s+(is|are|am|goes|went|likes|wants)\b/i, "情态动词后应跟原形"],
  [/\b(a|an)\s+[a-z]+s\b/i, "a/an 后跟复数"],
];
const grammarCheck = (s: string) => { for (const [re, r] of BAD_GRAMMAR) if (re.test(s)) return r; return null; };

// ── 建立现有课程的词表与展示池 ──
const sorted = [...(grammarLessons as any[])].sort((a, b) => a.number - b.number);
const cumulative = new Set<string>();
for (const l of sorted) {
  const add = (t?: string) => { if (t) for (const w of toks(t)) cumulative.add(w); };
  add(l.targetSentence);
  for (const e of l.examples ?? []) add(e.en);
  for (const b of l.blocks ?? []) add(b.text);
  for (const d of l.dialogue ?? []) add(d.en);
  for (const c of l.contrast ?? []) { add(c.correct); add(c.wrong); }
  for (const v of l.variants ?? []) add(v.en);
  for (const s of l.sceneSwings ?? []) add(s.en);
  for (const g of l.guided ?? []) { if (g.answer) add(g.answer); for (const t of g.tokens ?? []) add(t); }
  if (l.recall?.answer) add(l.recall.answer);
}
cumulative.delete("");

const problems: string[] = [];
const seenIds = new Set(sorted.map((l) => l.id));
const seenNumbers = new Set(sorted.map((l) => l.number));
let expectedNumber = Math.max(...sorted.map((l) => l.number)) + 1;

for (const lesson of ALL) {
  // 基础唯一性
  if (seenIds.has(lesson.id)) problems.push(`${lesson.id}: id 重复`);
  if (seenNumbers.has(lesson.number)) problems.push(`L${lesson.number}: 课号重复`);
  if (lesson.number !== expectedNumber) problems.push(`L${lesson.number}: 课号应为 ${expectedNumber}`);
  expectedNumber += 1;

  // 结构完整性
  if ((lesson.examples ?? []).length < 4) problems.push(`L${lesson.number}: examples < 4`);
  if ((lesson.guided ?? []).length < 6) problems.push(`L${lesson.number}: guided < 6`);
  if ((lesson.practice ?? []).length < 4) problems.push(`L${lesson.number}: practice < 4`);
  if ((lesson.contrast ?? []).length < 4) problems.push(`L${lesson.number}: contrast < 4`);
  if ((lesson.dialogue ?? []).length < 3) problems.push(`L${lesson.number}: dialogue < 3`);
  if ((lesson.variants ?? []).length < 3) problems.push(`L${lesson.number}: variants < 3`);
  if ((lesson.sceneSwings ?? []).length < 3) problems.push(`L${lesson.number}: sceneSwings < 3`);
  if (!lesson.deepDive) problems.push(`L${lesson.number}: 缺 deepDive`);
  if (!lesson.summary) problems.push(`L${lesson.number}: 缺 summary`);
  if (!lesson.recall) problems.push(`L${lesson.number}: 缺 recall`);

  // guided 题型齐备
  const kinds = new Set((lesson.guided ?? []).map((g: any) => g.kind));
  for (const need of ["choose", "arrange", "spot", "replace"]) {
    if (!kinds.has(need)) problems.push(`L${lesson.number}: guided 缺 ${need} 题`);
  }

  // practice 含否定或疑问变体
  const variantAnswers = (lesson.variants ?? [])
    .filter((v) => v.label !== "肯定")
    .map((v) => norm(v.en));
  const practiceAnswers = (lesson.practice ?? []).map((p) => norm(p.answer));
  if (!variantAnswers.some((a) => practiceAnswers.includes(a)))
    problems.push(`L${lesson.number}: practice 未覆盖否定/疑问变体`);

  // 零术语（首屏 + 讲解源字段）
  const texts = [
    lesson.grammarLabel, lesson.oneLineRule, lesson.summary.rule,
    ...(lesson.contrast ?? []).map((c) => c.whyZh),
    ...(lesson.guided ?? []).map((g: any) => g.explain ?? ""),
    lesson.recall.noteZh
  ];
  for (const text of texts) {
    const hit = ZERO_TERMS.filter((t) => text.includes(t));
    if (hit.length) problems.push(`L${lesson.number}: 术语「${hit.join("/")}」 in ${text.slice(0, 30)}`);
  }

  // 练习题：词表 / tokens / 干扰项 / 语法
  // 本课自己的全部英文材料 = 旧课词表 + 本课各字段
  const lessonVocab = new Set(cumulative);
  const addLesson = (t?: string) => { if (t) for (const w of toks(t)) lessonVocab.add(w); };
  addLesson(lesson.targetSentence);
  for (const e of lesson.examples) addLesson(e.en);
  for (const b of lesson.blocks) addLesson(b.text);
  for (const d of lesson.dialogue) addLesson(d.en);
  for (const c of lesson.contrast) { addLesson(c.correct); addLesson(c.wrong); }
  for (const v of lesson.variants) addLesson(v.en);
  for (const s of lesson.sceneSwings) addLesson(s.en);
  for (const g of lesson.guided) { if (g.answer) addLesson(g.answer); for (const t of g.tokens ?? []) addLesson(t); }
  addLesson(lesson.recall.answer);

  for (const p of lesson.practice ?? []) {
    const miss = toks(p.answer).filter((w) => !lessonVocab.has(w));
    if (miss.length) problems.push(`L${lesson.number}「${p.answer}」未教词: ${[...new Set(miss)].join(",")}`);
    if (toks(p.tokens.join(" ")).sort().join(" ") !== toks(p.answer).sort().join(" "))
      problems.push(`L${lesson.number}「${p.answer}」tokens 不匹配`);
    const aSet = new Set(toks(p.answer));
    for (const d of p.distractors ?? []) if (aSet.has(norm(d))) problems.push(`L${lesson.number} 干扰项重复: ${d}`);
    const g = grammarCheck(p.answer);
    if (g) problems.push(`L${lesson.number}「${p.answer}」语法: ${g}`);
  }

  // guided 里的 arrange/spot 也要过词表
  for (const g of lesson.guided ?? []) {
    if (g.answer && g.kind !== "choose" && g.kind !== "replace") {
      const miss = toks(g.answer.replace(/[.]$/, "")).filter((w) => !lessonVocab.has(w));
      if (miss.length) problems.push(`L${lesson.number} guided「${g.answer}」未教词: ${[...new Set(miss)].join(",")}`);
    }
    if (g.kind === "choose" || g.kind === "replace") {
      for (const opt of g.options ?? []) {
        const miss = toks(opt).filter((w) => !lessonVocab.has(w));
        if (miss.length) problems.push(`L${lesson.number} guided 选项「${opt}」未教词: ${[...new Set(miss)].join(",")}`);
      }
    }
  }

  // 新课自身的展示池（互查：练习答案不得与自身例句重复到 80%+）
  const selfExhibits = [
    lesson.targetSentence,
    ...lesson.examples.map((e) => e.en),
    ...lesson.sceneSwings.map((s) => s.en),
    ...lesson.variants.map((v) => v.en),
    ...lesson.contrast.map((c) => c.correct)
  ];
  const selfShapes = new Set(selfExhibits.map(shape));
  const selfExact = new Set(selfExhibits.map(norm));
  for (const p of lesson.practice ?? []) {
    const a = p.answer;
    // A 层（答案==目标句）与 B 层（与课内某句相同）放行——那是刻意设计的脚手架
    if (selfExact.has(norm(a))) continue;
    for (const e of selfExhibits) {
      const j = jac(a, e);
      if (j >= 0.8) problems.push(`L${lesson.number}「${a}」与自身展示句「${e}」重叠 ${(j * 100).toFixed(0)}%`);
    }
    if (selfShapes.has(shape(a))) {
      const hit = selfExhibits.find((e) => shape(e) === shape(a))!;
      problems.push(`L${lesson.number}「${a}」只换代词 ≈「${hit}」`);
    }
  }
}

console.log(`待注入 ${ALL.length} 课；校验问题 ${problems.length}`);
if (problems.length) {
  problems.slice(0, 25).forEach((p) => console.log("  ✗ " + p));
  if (problems.length > 25) console.log(`  ...另有 ${problems.length - 25} 条`);
  process.exit(1);
}
console.log("六道闸全部通过");

// ── 序列化写入 ──
const literal = (v: any, indent: number): string => {
  const pad = " ".repeat(indent), padIn = " ".repeat(indent + 2);
  if (Array.isArray(v)) {
    if (!v.length) return "[]";
    if (v.every((x) => typeof x === "string" && x.length <= 24) && JSON.stringify(v).length <= 88)
      return JSON.stringify(v).replace(/,/g, ", ");
    return "[\n" + v.map((x) => padIn + literal(x, indent + 2)).join(",\n") + "\n" + pad + "]";
  }
  if (v && typeof v === "object")
    return "{\n" + Object.entries(v).map(([k, x]) => `${padIn}${k}: ${literal(x, indent + 2)}`).join(",\n") + "\n" + pad + "}";
  return typeof v === "string" ? JSON.stringify(v) : String(v);
};

const path = resolve(process.cwd(), "src/data/grammarLessons.ts");
let source = readFileSync(path, "utf8");
const lastBracket = source.lastIndexOf("\n];");
const blocks = ALL.map((lesson, index) => {
  const coverIndex = ((162 + index) % COVER_COUNT) + 1;
  const withCover = { ...lesson, cover: `__COVER_${coverIndex}__` };
  return literal(withCover, 2).replace(`"__COVER_${coverIndex}__"`, `cover${coverIndex}`);
});
source = source.slice(0, lastBracket) + ",\n  " + blocks.join(",\n  ") + source.slice(lastBracket);
writeFileSync(path, source, "utf8");
console.log(`已写入 ${ALL.length} 课（L170–L175）`);
