import { grammarLessons } from "../data/grammarLessons";
import type { ExamComprehensionQuestion, ExamPassage, ExamWritingTask } from "../data/grammarExamPapers";

/**
 * 语法季末综合卷 · 内容守门（P0-8，三条守门）
 *
 * 规格：`deliverables/product-strategy/prd-grammar-season-final-exam-2026-09-24.md` §8.2
 *
 * 守门存在的理由：短文与题目是**新写的**，而它面向的是零基础（第 1 季 L1–L12）学习者。
 * 只要混进一个没教过的词或没教过的句型，用户就会把「看不懂」归因为「语法难」
 * （`GRAMMAR_PEDAGOGY_REVIEW.md:88`），季末收束就变成一次劝退。
 *
 * 三条守门（任一失败 = 构建失败，与 `grammarLessons.test.ts` / `jargonGuard.test.ts` 同范式）：
 *   ① 用词 ⊆ 本季已教词
 *   ② 句型 ⊆ 本季已教句型
 *   ③ 短文不得逐字包含本卷任何中译英答案句（否则读短文就能抄答案）
 *
 * ── 关于守门① 与 `core100Words` 的重要更正 ──
 * PRD §8.2 原写「守门词表 = taughtWords ∪ core100Words」。**实测后作废**：
 * `src/data/seedWords.ts` 的 `core100Words` 是一份**学术词表**（achieve / adapt / analyze /
 * assume / benefit / clarify / constitute / distinguish …，共 115 条），
 * 不是零基础高频词。若取并集，会把 analyze 这类词合法化进第 1 季短文。
 * 因此守门① 只用 `taughtWords`，另留**生词预算 ≤2 且必须带注释**作为唯一出口。
 *
 * ── 关于「已教词」的口径 ──
 * 只读**保证正确**的字段：`targetSentence` / `dialogueEn` / `examples[].en` / `dialogue[].en` /
 * `variants[].en` / `sceneSwings[].en` / `blocks[].text` / `practice[].answer` /
 * `recall[].answer` / `contrast[].correct` / `guided` 的 answer·before·after·replaceBase。
 *
 * 刻意**不读**三类含错字段（实测各课的「正误对比卡」与找错题里装着故意写错的形式）：
 *   - `contrast[].wrong`：实测含 `haves` / `eated` / `sandwichs` / `buyed` / `wills` 等
 *   - `guided[].tokens`：`arrange` 含干扰项、`spot` 是含错完整序列
 *   - `guided[].wrongToken` / `practice[].distractors`
 * 读了它们，就会把「故意写错的形式」当成已教词，反过来破坏守门。
 */

/** 把一段英文拆成小写词形（去首尾标点、保留撇号，如 didn't / o'clock）。 */
export const tokenizeEnglish = (text: string): string[] =>
  text
    .toLowerCase()
    .split(/\s+/)
    .map((raw) => raw.replace(/^[^a-z']+|[^a-z']+$/g, ""))
    .filter(Boolean);

/** 从严口径取「第 N 课以前教过的词」（只读保证正确的字段，见文件头）。 */
export const buildTaughtWords = (maxLessonNumber: number): Set<string> => {
  const words = new Set<string>();
  const add = (text: string | undefined) => {
    if (!text) return;
    for (const word of tokenizeEnglish(text)) words.add(word);
  };
  for (const lesson of grammarLessons) {
    if (lesson.number > maxLessonNumber) continue;
    add(lesson.targetSentence);
    add(lesson.dialogueEn);
    for (const example of lesson.examples) add(example.en);
    for (const line of lesson.dialogue ?? []) add(line.en);
    for (const variant of lesson.variants ?? []) add(variant.en);
    for (const swing of lesson.sceneSwings ?? []) add(swing.en);
    for (const block of lesson.blocks) add(block.text);
    for (const card of lesson.contrast ?? []) add(card.correct);
    for (const step of lesson.guided) {
      add(step.answer);
      add(step.before);
      add(step.after);
      add(step.replaceBase);
    }
    for (const step of lesson.practice) add(step.answer);
    add(lesson.recall?.answer);
  }
  return words;
};

/**
 * 第 1 季允许出现在 `be` 后面的「表语形容词」白名单。
 *
 * 为什么需要它：守门② 要禁止 `be + 动词形式`（进行时、被动都在第 1 季没教），
 * 但 `-ed` 结尾的形容词（tired）和过去分词同形，没有白名单就会把
 * 「Xiaomei was tired.」这种**正确且已教**的句子误判成越界。
 * 白名单只收本季课内确实当形容词用过的词——误杀比漏放更伤（用户会看到假报警）。
 */
export const BE_COMPLEMENT_ADJECTIVES = new Set([
  "happy", "hungry", "tired", "hot", "cold", "sunny", "nice", "good", "great",
  "free", "busy", "ready", "big", "small", "tall", "strong", "new", "red", "sad", "old"
]);

/** 本季教过的动词形态（原形 / 三单 / -ing / 过去式），用于识别 `be + 动词形式` 这类越界。 */
export const VERB_SURFACE_FORMS = new Set([
  "am", "is", "are", "was", "be",
  "have", "has", "want", "wants", "like", "likes", "go", "goes", "come", "comes",
  "draw", "draws", "eat", "eats", "drink", "drinks", "watch", "watches", "play", "plays",
  "walk", "walks", "swim", "swims", "see", "sees", "say", "says", "buy", "buys",
  "going", "coming", "drawing", "eating", "drinking", "watching", "playing",
  "walking", "swimming", "seeing", "saying", "buying", "reading", "raining",
  "went", "ate", "drank", "watched", "played", "walked", "saw", "met", "drew",
  "bought", "started", "wanted", "liked", "cleaned", "cooked"
]);

const BE_FORMS = new Set(["am", "is", "are", "was", "were", "be"]);
const PERFECT_AUX = new Set(["have", "has"]);

/** 归一化：小写、去标点（保留撇号）、压空格。守门③ 用。 */
const normalizeForContainment = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * 词序列包含判定（**按词边界**，不是按字符子串）。
 *
 * 为什么不直接用 `String.includes`：会把跨词边界的巧合当成命中。
 * 实测假报警例：答案句 `I drank milk.` 与短文 `Xiaomei drank milk tea, ...`——
 * 字符子串 `i drank milk` 确实出现在 `xiaomei| drank milk` 里（`xiaomei` 的结尾正好是 `i`），
 * 但两者毫无关系。按词序列比对即可消除这类假阳性。
 */
const containsWordSequence = (haystack: string[], needle: string[]): boolean => {
  if (needle.length === 0 || needle.length > haystack.length) return false;
  for (let start = 0; start + needle.length <= haystack.length; start += 1) {
    if (needle.every((word, offset) => haystack[start + offset] === word)) return true;
  }
  return false;
};

export interface ExamContentViolations {
  /** 守门①：超出本季已教词、且未登记进 `notes` 的词。 */
  wordsOutOfSeason: { where: string; word: string; sentence: string }[];
  /** 守门②：本季未教的句型（be + 动词形式 / have·has + 过去分词）。 */
  untaughSyntax: { where: string; pattern: string; sentence: string }[];
  /** 守门③：短文逐字包含的本卷中译英答案句。 */
  answerLeaks: { answer: string; passageSentence: string }[];
  /** 结构性问题：中英句数不匹配、选项数不为 4、答案 id 不在选项里等。 */
  shapeProblems: string[];
}

/**
 * 本季中译英题的答案句来源：`practice[].answer` 与 `recall[].answer`。
 * 与 PRD §4.2③ 的题源一致（翻译题取自这两处；`practice` 必须抽掉 `tokens`）。
 */
export const zh2EnAnswerPool = (seasonMaxLessonNumber: number, seasonMinLessonNumber = 1): string[] => {
  const pool: string[] = [];
  for (const lesson of grammarLessons) {
    if (lesson.number > seasonMaxLessonNumber || lesson.number < seasonMinLessonNumber) continue;
    for (const step of lesson.practice) if (step.answer.trim()) pool.push(step.answer.trim());
    if (lesson.recall?.answer.trim()) pool.push(lesson.recall.answer.trim());
  }
  return pool;
};

export const examContentViolations = (input: {
  passage: ExamPassage;
  comprehension: ExamComprehensionQuestion[];
  writing: ExamWritingTask;
  seasonMinLessonNumber: number;
  seasonMaxLessonNumber: number;
}): ExamContentViolations => {
  const { passage, comprehension, writing, seasonMinLessonNumber, seasonMaxLessonNumber } = input;
  const taught = buildTaughtWords(seasonMaxLessonNumber);
  const allowedExtras = new Set(passage.notes.map((note) => note.word.toLowerCase()));

  const wordsOutOfSeason: ExamContentViolations["wordsOutOfSeason"] = [];
  const untaughSyntax: ExamContentViolations["untaughSyntax"] = [];
  const shapeProblems: string[] = [];

  // ── 结构 ──
  if (passage.sentences.length !== passage.zhSentences.length) {
    shapeProblems.push(`逐句中文对照数量不符：英文 ${passage.sentences.length} 句 / 中文 ${passage.zhSentences.length} 句`);
  }
  for (const sentence of passage.sentences) {
    if (!/^[A-Z]/.test(sentence.trim())) shapeProblems.push(`短文句首未大写：${sentence}`);
    if (!/[.!?]$/.test(sentence.trim())) shapeProblems.push(`短文句末缺标点：${sentence}`);
  }
  if (passage.notes.length > 2) shapeProblems.push(`生词注释 ${passage.notes.length} 条，上限 2 条`);
  for (const question of comprehension) {
    if (question.options.length !== 4) shapeProblems.push(`${question.id} 选项数 ${question.options.length}，应为 4`);
    if (!question.options.some((option) => option.id === question.answerId)) {
      shapeProblems.push(`${question.id} 的 answerId="${question.answerId}" 不在选项里`);
    }
    if (new Set(question.options.map((option) => option.id)).size !== question.options.length) {
      shapeProblems.push(`${question.id} 选项 id 重复`);
    }
  }
  const kinds = new Set(comprehension.map((q) => q.kind));
  if (!kinds.has("detail") || !kinds.has("mainIdea")) {
    shapeProblems.push(`阅读理解缺少必要题型（detail / mainIdea）：现有 ${[...kinds].join(",")}`);
  }
  const writingWords = tokenizeEnglish(writing.points.join(" ")).length;
  if (writing.points.length !== 3) shapeProblems.push(`写作必答要点 ${writing.points.length} 条，应为 3 条`);
  if (writingWords > 0) shapeProblems.push("写作要点不应含英文（提示骨架只用中文，防止直接给出句子）");
  if (writing.minWords > writing.maxWords) shapeProblems.push("写作词数区间颠倒");
  if (writing.maxWords > 40) shapeProblems.push(`写作上限 ${writing.maxWords} 词过高（KET 档应 ≤35）`);

  // ── 守门①②：逐句检查短文、题目选项、写作提示里的英文 ──
  const checkEnglish = (where: string, text: string, sentence: string) => {
    const tokens = tokenizeEnglish(text);
    for (const word of tokens) {
      if (!taught.has(word) && !allowedExtras.has(word)) {
        wordsOutOfSeason.push({ where, word, sentence });
      }
    }
    // 守门②：be + 动词形式（含 -ing 进行时与 -ed 被动）、have/has + 过去分词
    for (let i = 0; i < tokens.length - 1; i += 1) {
      const current = tokens[i];
      const next = tokens[i + 1];
      if (BE_FORMS.has(current) && VERB_SURFACE_FORMS.has(next) && !BE_COMPLEMENT_ADJECTIVES.has(next)) {
        untaughSyntax.push({ where, pattern: `${current} + ${next}`, sentence });
      }
      if (PERFECT_AUX.has(current) && VERB_SURFACE_FORMS.has(next) && !BE_COMPLEMENT_ADJECTIVES.has(next)) {
        untaughSyntax.push({ where, pattern: `${current} + ${next}`, sentence });
      }
    }
  };

  passage.sentences.forEach((sentence, index) => checkEnglish(`passage[${index}]`, sentence, sentence));
  for (const question of comprehension) {
    for (const option of question.options) {
      checkEnglish(`${question.id}/${option.id}`, option.en, option.en);
    }
  }

  // ── 守门③：短文不得逐字包含本卷中译英答案句（按词边界判定，见 containsWordSequence） ──
  const passageWords = passage.sentences.flatMap((sentence) => tokenizeEnglish(sentence));
  const answerLeaks: ExamContentViolations["answerLeaks"] = [];
  for (const answer of zh2EnAnswerPool(seasonMaxLessonNumber, seasonMinLessonNumber)) {
    const answerWords = tokenizeEnglish(answer);
    if (answerWords.length < 3) continue; // 单字/双字答案无判别力，不参与包含判定
    if (containsWordSequence(passageWords, answerWords)) {
      const hit = passage.sentences.find((sentence) =>
        containsWordSequence(tokenizeEnglish(sentence), answerWords)
      );
      answerLeaks.push({ answer, passageSentence: hit ?? "" });
    }
  }

  return { wordsOutOfSeason, untaughSyntax, answerLeaks, shapeProblems };
};
