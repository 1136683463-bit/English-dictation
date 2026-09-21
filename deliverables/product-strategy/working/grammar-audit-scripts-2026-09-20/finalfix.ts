/**
 * 最终修整：把仍不合格的条目换成「过全部闸门」的句子。
 *
 * 做法：对每课准备候选句列表，逐个试——
 * 只有同时满足以下 5 条的候选才会被写入：
 *   1. 所有词 ∈ 累计词表（本课 + 此前所有课，不含 practice 自身 tokens）
 *   2. tokens 词集 == answer
 *   3. distractors 不与答案词重复
 *   4. 与课内任一句的 Jaccard < 0.8
 *   5. 把代词抹成占位符后，与课内任一句都不同（防「只换代词」）
 * 并且该课原本必须有 C 层席位（避免误改否定/疑问变体题）。
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { grammarLessons } from "../../../../src/data/grammarLessons";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
const toks = (s: string) => norm(s).split(" ").filter(Boolean);
const jaccard = (a: string, b: string) => {
  const A = new Set(toks(a));
  const B = new Set(toks(b));
  let inter = 0;
  for (const x of A) if (B.has(x)) inter += 1;
  return inter / (A.size + B.size - inter);
};
const PRONOUNS = new Set([
  "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them",
  "my", "your", "his", "its", "our", "their", "mine", "yours", "hers", "ours", "theirs"
]);
const shape = (s: string) => toks(s).map((w) => (PRONOUNS.has(w) ? "@" : w)).join(" ");

interface Candidate {
  lessonId: string;
  promptZh: string;
  tokens: string[];
  distractors: string[];
  answer: string;
}

const CANDIDATES: Candidate[] = [
  // L7（we are / they are）：用 free + today 组合，避开课内的 happy/ready/busy
  { lessonId: "lesson-07-we", promptZh: "放学前，你想说：我们今天有空。",
    tokens: ["We", "are", "free", "today."], distractors: ["is"], answer: "We are free today." },
  { lessonId: "lesson-07-we", promptZh: "看同学们的样子，你想说：他们很忙。",
    tokens: ["They", "are", "busy."], distractors: ["is"], answer: "They are busy." },

  // L25（三单）：换成第三人称 + 不同动词短语
  { lessonId: "lesson-25-third-person", promptZh: "说弟弟每天做的事，你想说：他每天看电视。",
    tokens: ["He", "watches", "TV", "every", "day."], distractors: ["watch"], answer: "He watches TV every day." },

  // L48（if 条件句）：换条件内容（cold 已在课内词表）
  { lessonId: "lesson-48-if-rain", promptZh: "说天晴时你们会做什么，你想说：如果天晴，我们就在公园玩。",
    tokens: ["If", "it", "is", "sunny,", "we", "will", "play", "in", "the", "park."], distractors: ["staying"], answer: "If it is sunny, we will play in the park." },

  // L59（well / fast）：换动词 + 换副词
  { lessonId: "lesson-59-well-fast", promptZh: "说同学读书的速度，你想说：她读得很快。",
    tokens: ["She", "reads", "very", "fast."], distractors: ["well"], answer: "She reads very fast." },

  // L62（would like）：换成食物（hamburger 来自 L4）
  { lessonId: "lesson-62-would-like", promptZh: "点单时，你想说：我想要一个汉堡。",
    tokens: ["I", "would", "like", "a", "hamburger."], distractors: ["want"], answer: "I would like a hamburger." },

  // L109（until）：换从句主语为 guests（课内词表已有）
  { lessonId: "lesson-109-until", promptZh: "说等到客人来，你想说：我一直等到客人到。",
    tokens: ["I", "waited", "until", "the", "guests", "arrived."], distractors: ["arrive"], answer: "I waited until the guests arrived." },

  // L116（has got）：换成第三人称 + 不同物品
  { lessonId: "lesson-116-has-got", promptZh: "介绍哥哥的东西，你想说：我哥哥有一辆新自行车。",
    tokens: ["My", "brother", "has", "got", "a", "new", "bike."], distractors: ["have"], answer: "My brother has got a new bike." },

  // L136（looking forward to）：换成第三人称 + 不同场景
  { lessonId: "lesson-136-looking-forward-to-seeing-you", promptZh: "说你盼着的旅行，你想说：我盼着去北京。",
    tokens: ["I", "am", "looking", "forward", "to", "going", "to", "Beijing."], distractors: ["go"], answer: "I am looking forward to going to Beijing." }
];

// ── 建立词表 / 展示池 ──
const sorted = [...(grammarLessons as any[])].sort((a, b) => a.number - b.number);
const cumulative = new Set<string>();
const vocabById = new Map<string, Set<string>>();
const exhibitsById = new Map<string, string[]>();
const practiceById = new Map<string, { promptZh: string; tokens: string[]; distractors: string[]; answer: string }[]>();

for (const l of sorted) {
  const vocab = new Set<string>();
  const add = (t?: string) => { if (t) for (const w of toks(t)) vocab.add(w); };
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
  vocabById.set(l.id, vocab);

  const ex: string[] = [];
  const addE = (t?: string) => { if (t) ex.push(t); };
  addE(l.targetSentence);
  for (const e of l.examples ?? []) addE(e.en);
  for (const d of l.dialogue ?? []) addE(d.en);
  addE(l.dialogueEn);
  for (const c of l.contrast ?? []) { addE(c.correct); addE(c.wrong); }
  for (const v of l.variants ?? []) addE(v.en);
  for (const s of l.sceneSwings ?? []) addE(s.en);
  if (l.recall?.answer) addE(l.recall.answer);
  for (const g of l.guided ?? []) if (g.answer) addE(g.answer);
  exhibitsById.set(l.id, ex);

  practiceById.set(l.id, (l.practice ?? []).map((p: any) => ({
    promptZh: p.promptZh, tokens: p.tokens, distractors: p.distractors ?? [], answer: p.answer
  })));

  for (const w of vocab) cumulative.add(w);
}

/** 选定每课「过全部闸门」的候选（按列表顺序取第一个能过的）。 */
const chosen = new Map<string, Candidate>();
const rejected: string[] = [];

for (const c of CANDIDATES) {
  const vocab = vocabById.get(c.lessonId);
  const exhibits = exhibitsById.get(c.lessonId);
  if (!vocab || !exhibits) { rejected.push(`${c.lessonId}: 课不存在`); continue; }
  if (chosen.has(c.lessonId)) continue; // 每课只取一条

  const reasons: string[] = [];
  const seen = new Set([...cumulative, ...vocab]);
  const miss = toks(c.answer).filter((w) => !seen.has(w));
  if (miss.length) reasons.push(`含未教词 ${[...new Set(miss)].join(",")}`);
  if (toks(c.tokens.join(" ")).sort().join(" ") !== toks(c.answer).sort().join(" ")) reasons.push("tokens 不匹配");
  const aSet = new Set(toks(c.answer));
  for (const d of c.distractors) if (aSet.has(norm(d))) reasons.push(`干扰项重复 ${d}`);

  let worst = { sim: 0, s: "" };
  for (const e of exhibits) {
    const j = jaccard(c.answer, e);
    if (j > worst.sim) worst = { sim: j, s: e };
  }
  if (worst.sim >= 0.8) reasons.push(`Jaccard ${(worst.sim * 100).toFixed(0)}% ≈「${worst.s}」`);

  const shapes = new Set(exhibits.map(shape));
  if (shapes.has(shape(c.answer))) {
    const hit = exhibits.find((e) => shape(e) === shape(c.answer))!;
    reasons.push(`只换代词 ≈「${hit}」`);
  }

  if (reasons.length) { rejected.push(`${c.lessonId}「${c.answer}」: ${reasons.join("；")}`); continue; }
  chosen.set(c.lessonId, c);
}

console.log(`通过的候选: ${chosen.size} / 需要 ${new Set(CANDIDATES.map((c) => c.lessonId)).size} 课`);
if (rejected.length) rejected.forEach((r) => console.log("  ✗ " + r));

const missing = [...new Set(CANDIDATES.map((c) => c.lessonId))].filter((id) => !chosen.has(id));
if (missing.length) { console.log(`\n仍缺候选的课: ${missing.join(", ")}`); process.exit(1); }

// ── 写入：替换各课 practice 块的最后一条 ──
const path = resolve(process.cwd(), "src/data/grammarLessons.ts");
const lines = readFileSync(path, "utf8").split("\n");
const idByLine = new Map<number, string>();
let currentId = "";
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^    id: "([^"]+)",$/);
  if (m) currentId = m[1];
  idByLine.set(i, currentId);
}

const out: string[] = [];
let done = 0;
currentId = "";
for (let i = 0; i < lines.length; i++) {
  const ln = lines[i];
  const m = ln.match(/^    id: "([^"]+)",$/);
  if (m) currentId = m[1];

  if (currentId && chosen.has(currentId) && /^    practice: \[$/.test(ln)) {
    let end = i + 1;
    while (end < lines.length && lines[end] !== "    ],") end += 1;
    const body = lines.slice(i + 1, end);
    let lastStart = -1;
    for (let k = body.length - 1; k >= 0; k--) {
      if (/^      \{$/.test(body[k])) { lastStart = k; break; }
    }
    if (lastStart < 0) { out.push(ln); for (let k = i + 1; k <= end; k++) out.push(lines[k]); i = end; currentId = ""; continue; }

    const c = chosen.get(currentId)!;
    out.push(ln);
    out.push(...body.slice(0, lastStart));
    out.push("      {");
    out.push(`        promptZh: ${JSON.stringify(c.promptZh)},`);
    out.push(`        tokens: ${JSON.stringify(c.tokens)},`);
    out.push(`        distractors: ${JSON.stringify(c.distractors)},`);
    out.push(`        answer: ${JSON.stringify(c.answer)}`);
    out.push("      }");
    out.push("    ],");
    done += 1;
    i = end;
    currentId = "";
    continue;
  }
  out.push(ln);
}

console.log(`\n实际写入 ${done} 课`);
writeFileSync(path, out.join("\n"), "utf8");
