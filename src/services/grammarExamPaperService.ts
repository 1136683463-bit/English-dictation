import { grammarLessons } from "../data/grammarLessons";
import { LESSON_GROUPS } from "../data/grammarSeasons";
import { SEASON_1_COMPREHENSION, SEASON_1_PASSAGE, SEASON_1_WRITING } from "../data/grammarExamPapers";
import type { ExamComprehensionQuestion, ExamPassage, ExamWritingTask } from "../data/grammarExamPapers";
import type { GrammarLesson } from "../types";

/**
 * 语法季末综合卷 · 试卷生成（P0-2）
 *
 * 规格：`deliverables/product-strategy/prd-grammar-season-final-exam-2026-09-24.md`
 *   §4.1 卷面配比 ｜ §4.3 覆盖闸与轮转 ｜ §4.4 卷面缩放 ｜ §12.1 G11/G12
 *
 * ── 实施期发现并更正的规格（原文见 PRD §4.2①） ──
 * PRD 原写「同课同 `grammarLabel` 在一张卷内最多 1 条」。**实测证明这条与卷面配比互相矛盾**：
 * 第 1 季 12 课恰好有 12 个互不相同的 `grammarLabel`（1 课 1 个，实测 12/12），
 * 于是「每课最多 1 条」= 整张卷最多 12 道客观题，而 §4.1 要求 20 道（10 选择 + 6 填空 + 4 翻译）。
 * 真实考试也不是「一个考点只考一次」——同一个考点用选择/填空/翻译三种题型各考一次才是常态。
 * 因此更正为：
 *   - **同课同 `grammarLabel` 的同一题型**在单卷内不重复；
 *   - **本季全部 `grammarLabel` 必须 100% 覆盖**（这条没变，G11 仍锁它）。
 *
 * ── 覆盖闸口径（PRD §4.3 新口径） ──
 * 不设「每课 ≥1 题」。理由（数析洞察 3）：对第 28 季 24 课，「1 题/课」即占卷面 89%，
 * 不可满足；对小季则反向过剩。改为「覆盖全部 grammarLabel + 抽 8–10 课代表」，
 * 大季小季同一套规则。本生成器实现的是「覆盖全部 label」，代表课数由结果自然给出。
 *
 * ── 跨卷去重（G12） ──
 * 每个题源按「稳定序」分桶：`stableIndex % variantCount === variantIndex`。
 * 桶之间互斥，所以**同一 itemId 绝不会出现在两张卷里**，且生成完全可回放
 * （排序键与随机种子都由内容决定，不含时间戳）。
 */

export type ExamItemKind = "mcq" | "cloze" | "zh2en" | "read" | "write";
export type ExamSectionIndex = 1 | 2 | 3;

export interface ExamPaperItem {
  /** 稳定 id：同一题源在任何一次生成里都是同一个 id（跨卷去重的依据）。 */
  id: string;
  kind: ExamItemKind;
  section: ExamSectionIndex;
  /** 中文题干。 */
  promptZh: string;
  answer: string;
  acceptAlso?: string[];
  /** 选择题与阅读小题的选项。 */
  options?: { id: string; en: string; zh: string }[];
  answerId?: string;
  /** 阅读小题所属的短文 id。 */
  passageId?: string;
  /** 课内出处（G6 可追溯）：题目必须能指回某一课。 */
  sourceLessonId: string;
  sourceLessonNumber: number;
  grammarLabel: string;
}

export interface ExamPaperSection {
  index: ExamSectionIndex;
  titleZh: string;
  itemIds: string[];
  /** 预计耗时（分钟），用于「本节约 X 分钟」标注——**不是倒计时**（G4）。 */
  estimateMinutes: number;
}

export interface ExamPaper {
  paperId: string;
  seasonId: string;
  seasonLabel: string;
  variantIndex: number;
  variantCount: number;
  items: ExamPaperItem[];
  sections: ExamPaperSection[];
  shape: Record<ExamItemKind, number>;
  coverage: { lessonIds: string[]; grammarLabels: string[]; representativeLessons: number };
  /** 全卷预计耗时（分钟），用于卷首「预计约 30 分钟」。 */
  estimateMinutes: number;
  /** 生成期诊断：空缺、池不足、覆盖缺口。**非空即视为构建失败**（调用方必须拦）。 */
  diagnostics: string[];
}

/** 每张卷的目标配比（PRD §4.1）。 */
export const STANDARD_SHAPE: Record<"mcq" | "cloze" | "zh2en" | "read" | "write", number> = {
  mcq: 10,
  cloze: 6,
  zh2en: 4,
  read: 4,
  write: 1
};

/** 单题耗时假设（PRD §4.1，**假设值**，待 M3 实测校准）。 */
const MINUTES_PER_ITEM: Record<ExamItemKind, number> = {
  mcq: 20 / 60,
  cloze: 25 / 60,
  zh2en: 50 / 60,
  read: 7 / 4,
  write: 6
};

/** 各题的节归属（PRD §4.1 三节）。 */
const SECTION_OF_KIND: Record<ExamItemKind, ExamSectionIndex> = {
  mcq: 1,
  cloze: 1,
  zh2en: 2,
  read: 2,
  write: 3
};

const SECTION_TITLES: Record<ExamSectionIndex, string> = {
  1: "第 1 节 · 认得出来",
  2: "第 2 节 · 写得出来",
  3: "第 3 节 · 连成一段"
};

const hashText = (text: string): number => {
  let hash = 5381;
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) + hash + text.charCodeAt(index)) >>> 0;
  }
  return hash;
};

const mulberry32 = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** 与复习页同口径的「不是内容词」清单：挖空只挖实词。 */
const STOP_WORDS = new Set([
  "a", "an", "the", "is", "am", "are", "was", "were", "be",
  "i", "you", "he", "she", "it", "we", "they", "my", "your", "his", "her",
  "and", "or", "to", "of", "in", "on", "at", "for", "with", "from",
  "this", "that", "these", "those", "not", "no", "yes", "do", "does", "did"
]);

const cleanToken = (token: string): string => token.replace(/[.,!?;:'"]/g, "");

const contentTokenIndexes = (sentence: string): number[] => {
  const raw = sentence.split(/\s+/).filter(Boolean);
  const indexes: number[] = [];
  raw.forEach((token, index) => {
    const clean = cleanToken(token);
    if (clean.length > 2 && !STOP_WORDS.has(clean.toLowerCase())) indexes.push(index);
  });
  return indexes;
};

interface Candidate {
  id: string;
  kind: "mcq" | "cloze" | "zh2en";
  lesson: GrammarLesson;
  promptZh: string;
  answer: string;
  acceptAlso?: string[];
  options?: { id: string; en: string; zh: string }[];
  answerId?: string;
}

/** 从一课派生 MCQ 候选：`choose`（带空位）与 `contrast` 的「哪句对」（排除 bothRight）。 */
const mcqCandidatesOf = (lesson: GrammarLesson): Candidate[] => {
  const out: Candidate[] = [];
  for (const [index, step] of lesson.guided.entries()) {
    if (step.kind !== "choose" || !step.answer) continue;
    /**
     * 空位两侧必须**补空格**再拼（2026-09-25 真机走查抓出）。
     *
     * 原先直接 `${before}____${after}`：`before` 不以空格结尾时（"I want"）会拼成
     * `I want____apple.`。两个后果：
     *   ① 题面难看（空位粘在前一个词上）；
     *   ② 更严重——错题回流时把空位换回答案会得到 `I wantanapple.`，
     *      被「必须是整句」的守门判为 2 个词而**静默丢弃**，于是选择题的错题一条都没进复习队列。
     */
    const sentence = [step.before ?? "", "____", step.after ?? ""]
      .map((part) => part.trim())
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ");
    const options = (step.options ?? []).map((text, optionIndex) => ({
      id: `o${optionIndex}`,
      en: text,
      zh: ""
    }));
    const answerIndex = (step.options ?? []).findIndex((text) => text === step.answer);
    if (options.length < 2 || answerIndex < 0) continue; // 不能作答的题源直接丢
    out.push({
      id: `exam-mcq-choose-${lesson.id}-${index}`,
      kind: "mcq",
      lesson,
      promptZh: `选一个填进空位：${sentence}`,
      answer: step.answer,
      options,
      answerId: `o${answerIndex}`
    });
  }
  (lesson.contrast ?? []).forEach((card, index) => {
    // bothRight 的句子两句都对，做「哪句对」会变成两个正确答案 → 不可作题（gq2 的 bothRightAsWrong 同一坑）
    if (card.bothRight) return;
    if (!card.wrong.trim() || !card.correct.trim()) return;
    out.push({
      id: `exam-mcq-contrast-${lesson.id}-${index}`,
      kind: "mcq",
      lesson,
      promptZh: "下面哪一句是对的？",
      answer: card.correct,
      options: [
        { id: "o0", en: card.wrong, zh: "" },
        { id: "o1", en: card.correct, zh: "" }
      ],
      answerId: "o1"
    });
  });
  return out;
};

/** 从一课派生填空题候选：在含唯一实词的句子上挖那一个词，干扰项全部取自同一课。 */
const clozeCandidatesOf = (lesson: GrammarLesson): Candidate[] => {
  const sentences = [
    lesson.targetSentence,
    ...lesson.examples.map((example) => example.en),
    ...(lesson.sceneSwings ?? []).map((swing) => swing.en)
  ].filter((sentence) => sentence && sentence.trim().split(/\s+/).length >= 3);

  // 干扰项来源：本课全部句子里的实词（**不新造词** —— 内容审计的伪造干扰项 `ned` 就是这么来的）
  const lessonContentWords = new Set<string>();
  for (const sentence of sentences) {
    for (const index of contentTokenIndexes(sentence)) {
      lessonContentWords.add(cleanToken(sentence.split(/\s+/)[index] ?? ""));
    }
  }

  const out: Candidate[] = [];
  sentences.forEach((sentence, index) => {
    const tokens = sentence.split(/\s+/).filter(Boolean);
    // 只挖「句内只出现一次」的实词：同句挖重复词会留下第二个同形词，等于把答案写在题干上
    const uniqueIdx = contentTokenIndexes(sentence).filter((tokenIndex) => {
      const clean = cleanToken(tokens[tokenIndex] ?? "").toLowerCase();
      return tokens.filter((token) => cleanToken(token).toLowerCase() === clean).length === 1;
    });
    const picked = uniqueIdx[0];
    if (picked === undefined) return;
    const answer = cleanToken(tokens[picked] ?? "");
    const distractorPool = [...lessonContentWords]
      .filter((word) => word.toLowerCase() !== answer.toLowerCase())
      .sort();
    if (distractorPool.length < 3) return; // 干扰项不足，不出题
    const random = mulberry32(hashText(`${lesson.id}:cloze:${index}`));
    const shuffled = [...distractorPool];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const swap = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[swap]] = [shuffled[swap], shuffled[i]];
    }
    const options = [
      { id: "o0", en: answer, zh: "" },
      ...[...shuffled.slice(0, 3)].sort().map((word, i) => ({ id: `o${i + 1}`, en: word, zh: "" }))
    ];
    const promptTokens = tokens.map((token, tokenIndex) => (tokenIndex === picked ? "____" : token));
    out.push({
      id: `exam-cloze-${lesson.id}-${index}`,
      kind: "cloze",
      lesson,
      promptZh: `选一个填进空位：${promptTokens.join(" ")}`,
      answer,
      options,
      answerId: "o0"
    });
  });
  return out;
};

/**
 * 从一课派生中译英候选：`practice[].answer` 与 `recall[].answer`。
 *
 * **必须抽掉 `tokens`**：数析实测 `practice` 的 1052/1052 条答案恰好是题面 `tokens` 的重排，
 * 词块摊在屏幕上等于把答案发给考生。候选对象里因此**根本不带 tokens 字段**。
 */
const zh2EnCandidatesOf = (lesson: GrammarLesson): Candidate[] => {
  const out: Candidate[] = [];
  lesson.practice.forEach((step, index) => {
    const answer = step.answer.trim();
    if (answer.split(/\s+/).filter(Boolean).length < 3) return; // 太短的「句子」不适合作翻译题
    out.push({
      id: `exam-zh2en-practice-${lesson.id}-${index}`,
      kind: "zh2en",
      lesson,
      promptZh: `把这句话写成英语：${step.promptZh}`,
      answer
    });
  });
  if (lesson.recall?.answer?.trim()) {
    const answer = lesson.recall.answer.trim();
    if (answer.split(/\s+/).filter(Boolean).length >= 3) {
      out.push({
        id: `exam-zh2en-recall-${lesson.id}`,
        kind: "zh2en",
        lesson,
        // recall 的 promptZh 是场景邀请语，中文意图在 intentZh（D8 口径）
        promptZh: `把这句话写成英语：${lesson.recall.intentZh?.trim() || lesson.recall.promptZh}`,
        answer
      });
    }
  }
  return out;
};

const lessonsOfSeason = (min: number, max: number): GrammarLesson[] =>
  grammarLessons.filter((lesson) => lesson.number >= min && lesson.number <= max);

export const examPassageForSeason = (seasonId: string): ExamPassage | undefined =>
  seasonId === "season-1" ? SEASON_1_PASSAGE : undefined;

export const examComprehensionForSeason = (seasonId: string): ExamComprehensionQuestion[] =>
  seasonId === "season-1" ? SEASON_1_COMPREHENSION : [];

export const examWritingForSeason = (seasonId: string): ExamWritingTask | undefined =>
  seasonId === "season-1" ? SEASON_1_WRITING : undefined;

/**
 * 生成一张卷。完全确定性：同样的 (seasonId, variantIndex, variantCount) 永远得到同一张卷。
 */
export const buildExamPaper = (input: {
  seasonId: string;
  variantIndex: number;
  variantCount: number;
}): ExamPaper => {
  const { seasonId, variantIndex, variantCount } = input;
  const diagnostics: string[] = [];
  const season = LESSON_GROUPS.find((group) => group.id === seasonId);
  const min = season?.min ?? 1;
  const max = season?.max ?? 0;
  const lessons = lessonsOfSeason(min, max);
  if (lessons.length === 0) {
    diagnostics.push(`seasonId=${seasonId} 解析不出课号区间（min=${min} max=${max}）`);
  }

  // ── 候选池 + 稳定序（排序键与种子都只看内容，不看时间） ──
  const pool: Candidate[] = [];
  for (const lesson of lessons) {
    pool.push(...mcqCandidatesOf(lesson), ...clozeCandidatesOf(lesson), ...zh2EnCandidatesOf(lesson));
  }
  const stableSort = (list: Candidate[]): Candidate[] =>
    [...list].sort((left, right) => (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));
  pool.sort((left, right) => (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));

  // ── 分桶：桶间互斥 ⇒ 同一 itemId 不会跨卷出现（G12） ──
  let bucket = pool.filter((_, index) => index % variantCount === variantIndex);
  if (bucket.length === 0) {
    diagnostics.push(
      `variantIndex=${variantIndex} 分桶为空（池 ${pool.length} 条 / ${variantCount} 套）`
    );
    bucket = [];
  }

  const picked: Candidate[] = [];
  const usedIds = new Set<string>();
  const usedLessonKind = new Set<string>(); // 同课同题型只出一条
  const take = (candidate: Candidate): boolean => {
    const key = `${candidate.lesson.id}:${candidate.kind}`;
    if (usedIds.has(candidate.id) || usedLessonKind.has(key)) return false;
    usedIds.add(candidate.id);
    usedLessonKind.add(key);
    picked.push(candidate);
    return true;
  };

  const byKind = (kind: Candidate["kind"]): Candidate[] =>
    bucket.filter((candidate) => candidate.kind === kind);

  // ── 阶段 A：先保证本季每个 grammarLabel 都被覆盖（G11） ──
  const remaining: Record<"mcq" | "cloze" | "zh2en", number> = {
    mcq: STANDARD_SHAPE.mcq,
    cloze: STANDARD_SHAPE.cloze,
    zh2en: STANDARD_SHAPE.zh2en
  };
  for (const lesson of lessons) {
    const options = (["mcq", "cloze", "zh2en"] as const)
      .filter((kind) => remaining[kind] > 0)
      .filter((kind) => byKind(kind).some((candidate) => candidate.lesson.id === lesson.id && !usedLessonKind.has(`${lesson.id}:${kind}`)))
      .sort((left, right) => remaining[right] - remaining[left]);
    const kind = options[0];
    if (!kind) {
      diagnostics.push(`第 ${lesson.number} 课无可用题源，grammarLabel「${lesson.grammarLabel}」将无法覆盖`);
      continue;
    }
    const candidate = byKind(kind).find(
      (item) => item.lesson.id === lesson.id && !usedLessonKind.has(`${item.lesson.id}:${item.kind}`)
    );
    if (candidate && take(candidate)) remaining[kind] -= 1;
  }

  // ── 阶段 B：按配比补齐 ──
  for (const kind of ["mcq", "cloze", "zh2en"] as const) {
    for (const candidate of stableSort(byKind(kind))) {
      if (remaining[kind] <= 0) break;
      if (take(candidate)) remaining[kind] -= 1;
    }
  }
  for (const kind of ["mcq", "cloze", "zh2en"] as const) {
    if (remaining[kind] > 0) {
      diagnostics.push(`${kind} 缺 ${remaining[kind]} 条：分桶内题源不足以满足配比`);
    }
  }

  const items: ExamPaperItem[] = picked.map((candidate) => ({
    id: candidate.id,
    kind: candidate.kind,
    section: SECTION_OF_KIND[candidate.kind],
    promptZh: candidate.promptZh,
    answer: candidate.answer,
    acceptAlso: candidate.acceptAlso,
    options: candidate.options,
    answerId: candidate.answerId,
    sourceLessonId: candidate.lesson.id,
    sourceLessonNumber: candidate.lesson.number,
    grammarLabel: candidate.lesson.grammarLabel
  }));

  // ── 阅读与写作（每卷固定，来自内容资产；未来多套时用按套轮换的短文池） ──
  const passage = examPassageForSeason(seasonId);
  const comprehension = examComprehensionForSeason(seasonId);
  const writing = examWritingForSeason(seasonId);
  if (!passage || comprehension.length === 0 || !writing) {
    diagnostics.push(`seasonId=${seasonId} 缺阅读/写作内容资产（当前只有 season-1 试点）`);
  }
  comprehension.forEach((question) => {
    items.push({
      id: `exam-read-${question.id}`,
      kind: "read",
      section: SECTION_OF_KIND.read,
      promptZh: question.promptZh,
      answer: question.options.find((option) => option.id === question.answerId)?.en ?? "",
      options: question.options,
      answerId: question.answerId,
      passageId: passage?.id,
      sourceLessonId: "",
      sourceLessonNumber: 0,
      grammarLabel: ""
    });
  });
  if (writing) {
    items.push({
      id: `exam-write-${writing.id}`,
      kind: "write",
      section: SECTION_OF_KIND.write,
      promptZh: writing.promptZh,
      answer: "",
      sourceLessonId: "",
      sourceLessonNumber: 0,
      grammarLabel: ""
    });
  }

  // ── 覆盖核查 ──
  const coveredLabels = new Set(items.map((item) => item.grammarLabel).filter(Boolean));
  const allLabels = lessons.map((lesson) => lesson.grammarLabel);
  const missing = allLabels.filter((label) => !coveredLabels.has(label));
  if (missing.length > 0) {
    diagnostics.push(`grammarLabel 未全覆盖，缺：${missing.slice(0, 3).join(" / ")}`);
  }

  const shape: Record<ExamItemKind, number> = { mcq: 0, cloze: 0, zh2en: 0, read: 0, write: 0 };
  for (const item of items) shape[item.kind] += 1;

  const sections: ExamPaperSection[] = ([1, 2, 3] as ExamSectionIndex[]).map((index) => {
    const sectionItems = items.filter((item) => item.section === index);
    return {
      index,
      titleZh: SECTION_TITLES[index],
      itemIds: sectionItems.map((item) => item.id),
      estimateMinutes: Math.round(
        sectionItems.reduce((sum, item) => sum + MINUTES_PER_ITEM[item.kind], 0)
      )
    };
  });

  const lessonIds = [...new Set(items.map((item) => item.sourceLessonId).filter(Boolean))];
  return {
    paperId: `${seasonId}-v${variantIndex + 1}`,
    seasonId,
    seasonLabel: season?.label ?? seasonId,
    variantIndex,
    variantCount,
    items,
    sections,
    shape,
    coverage: {
      lessonIds,
      grammarLabels: [...coveredLabels],
      representativeLessons: lessonIds.length
    },
    estimateMinutes: Math.round(items.reduce((sum, item) => sum + MINUTES_PER_ITEM[item.kind], 0)),
    diagnostics
  };
};
