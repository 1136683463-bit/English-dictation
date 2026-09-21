/**
 * C 层新句注入（2026-09-20）
 *
 * 做法：用一个纯函数式脚本读取 grammarLessons.ts，定位每课 practice 块的结束位置，
 * 在末尾插入一条新题（JSON.stringify 负责转义，绝不手写引号）。
 *
 * 校验四条红线后才写入：
 *   1. 新句所有词 ∈ 累计词表（本课 + 此前所有课的教学材料，不含 practice 自身 tokens）
 *   2. tokens 词集 == answer
 *   3. distractors 不与答案词重复
 *   4. 新句不在本课展示池中（否则退化成 B 层，白加）
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { grammarLessons } from "../../../../src/data/grammarLessons";
import { C_LAYER_ADDITIONS } from "./c-layer";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
const words = (s: string) => norm(s).split(" ").filter(Boolean);

const sorted = [...(grammarLessons as any[])].sort((a, b) => a.number - b.number);
const cumulative = new Set<string>();
const lessonVocab = new Map<number, Set<string>>();
const displayPool = new Map<number, Set<string>>();
const lessonById = new Map<number, any>();

for (const l of sorted) {
  lessonById.set(l.number, l);
  const vocab = new Set<string>();
  const add = (t?: string) => { if (t) for (const w of words(t)) vocab.add(w); };
  add(l.targetSentence);
  for (const e of l.examples || []) add(e.en);
  for (const b of l.blocks || []) add(b.text);
  for (const d of l.dialogue || []) add(d.en);
  for (const c of l.contrast || []) { add(c.correct); add(c.wrong); }
  for (const v of l.variants || []) add(v.en);
  for (const s of l.sceneSwings || []) add(s.en);
  for (const g of l.guided || []) { if (g.answer) add(g.answer); for (const t of g.tokens || []) add(t); }
  if (l.recall?.answer) add(l.recall.answer);
  vocab.delete("");
  lessonVocab.set(l.number, vocab);

  const pool = new Set<string>();
  const addS = (t?: string) => { if (t) pool.add(norm(t)); };
  addS(l.targetSentence);
  for (const e of l.examples || []) addS(e.en);
  for (const d of l.dialogue || []) addS(d.en);
  addS(l.dialogueEn);
  for (const c of l.contrast || []) { addS(c.correct); addS(c.wrong); }
  for (const v of l.variants || []) addS(v.en);
  for (const s of l.sceneSwings || []) addS(s.en);
  if (l.recall?.answer) addS(l.recall.answer);
  for (const g of l.guided || []) if (g.answer) addS(g.answer);
  pool.delete("");
  displayPool.set(l.number, pool);

  for (const w of vocab) cumulative.add(w);
}

// ── 校验 ──
const problems: string[] = [];
for (const item of C_LAYER_ADDITIONS) {
  const { number, tokens, distractors, answer } = item;
  const vocab = lessonVocab.get(number);
  const pool = displayPool.get(number);
  const lesson = lessonById.get(number);
  if (!vocab || !pool || !lesson) { problems.push(`L${number}: 找不到该课`); continue; }

  const seen = new Set([...cumulative, ...vocab]);
  const miss = words(answer).filter((w) => !seen.has(w));
  if (miss.length) problems.push(`L${number}「${answer}」词未教过: ${[...new Set(miss)].join(",")}`);

  if (words(tokens.join(" ")).sort().join(" ") !== words(answer).sort().join(" "))
    problems.push(`L${number}「${answer}」tokens 不匹配`);

  const aSet = new Set(words(answer));
  for (const d of distractors) if (aSet.has(norm(d))) problems.push(`L${number}「${answer}」干扰项重复: ${d}`);

  if (pool.has(norm(answer))) problems.push(`L${number}「${answer}」已在展示池中`);

  if ((lesson.practice || []).some((p: any) => !pool.has(norm(p.answer))))
    problems.push(`L${number} 本课已有 C 层席位`);
}

if (problems.length) {
  console.log(`校验未通过（${problems.length} 条）：`);
  problems.forEach((p) => console.log("  ✗ " + p));
  process.exit(1);
}
console.log(`校验通过：${C_LAYER_ADDITIONS.length} 条全部合格`);

// ── 注入：行级定位 practice 块的结束行 ──
const path = resolve(process.cwd(), "src/data/grammarLessons.ts");
const lines = readFileSync(path, "utf8").split("\n");
const byNumber = new Map(C_LAYER_ADDITIONS.map((i) => [i.number, i]));

const out: string[] = [];
let currentLesson = -1;
let inserted = 0;
const insertedNumbers: number[] = [];

for (let i = 0; i < lines.length; i++) {
  const ln = lines[i];
  const nm = ln.match(/^    number: (\d+),$/);
  if (nm) currentLesson = Number(nm[1]);

  if (currentLesson >= 0 && byNumber.has(currentLesson) && /^    practice: \[$/.test(ln)) {
    // 找到该 practice 块的结束行
    let end = i + 1;
    while (end < lines.length && lines[end] !== "    ],") end += 1;
    // 复制原块内容（i+1 .. end-1 是题目，end 是 "    ],"）
    out.push(ln);
    for (let k = i + 1; k < end; k++) out.push(lines[k]);
    // 最后一个题目补逗号（若原本没有）
    const lastIdx = out.length - 1;
    if (out[lastIdx].trim() === "}") out[lastIdx] = out[lastIdx] + ",";
    else if (out[lastIdx].trim() === "},") { /* 已有逗号 */ }
    // 插入新题（JSON.stringify 负责转义）
    const item = byNumber.get(currentLesson)!;
    out.push("      {");
    out.push(`        promptZh: ${JSON.stringify(item.promptZh)},`);
    out.push(`        tokens: ${JSON.stringify(item.tokens)},`);
    out.push(`        distractors: ${JSON.stringify(item.distractors)},`);
    out.push(`        answer: ${JSON.stringify(item.answer)}`);
    out.push("      }");
    out.push("    ],");
    inserted++;
    insertedNumbers.push(currentLesson);
    i = end;
    currentLesson = -1;
    continue;
  }
  out.push(ln);
}

console.log(`实际注入 ${inserted} 课：${insertedNumbers.slice(0, 10).join(",")}...`);
writeFileSync(path, out.join("\n"), "utf8");
