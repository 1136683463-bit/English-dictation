import type { AppData, ExamItemResult, ExamSession } from "../types";
import { nowIso } from "./storage";
import { GRAMMAR_LESSON_BY_ID } from "../data/grammarLessons";
import { addLessonMistakeSentence } from "./lessonService";
import type { ExamPaper, ExamPaperItem } from "./grammarExamPaperService";

/**
 * 语法季末综合卷 · 作答会话（P0-3 的中断续做内核）
 *
 * 规格：PRD §4.7 中断续做（P0）｜§4.8 逐节揭晓 ｜§12.1 G2/G3 ｜§13 M2「三处断点任一失败即不许发布」
 *
 * 为什么把会话逻辑抽成纯函数而不是写在页面里：
 * 「随时退出、原样恢复」是本功能**能否成立**的前提（产品负责人的原话顾虑就是
 * 「题目过多、时间过长，可能导致用户没有耐心继续做」）。写在页面 state 里，
 * 只能靠人点着试；抽成纯函数后，「节 1 第 3 题 / 节 2 第 3 题 / 节 3 提交前」
 * 三处断点可以在测试里**真的走一遍 JSON 往返**来证明，而不是靠肉眼。
 *
 * 写盘纪律：一切改动都经 `updateData`（由 AppContext 落 localStorage），
 * 本模块只做纯变换，不碰 storage。
 */

const SECTION_ORDER: Array<1 | 2 | 3> = [1, 2, 3];

export const itemsOfSection = (paper: ExamPaper, section: 1 | 2 | 3): ExamPaperItem[] =>
  paper.items.filter((item) => item.section === section);

export const getExamSession = (data: AppData, paperId: string): ExamSession | undefined =>
  data.examSessions?.[paperId];

/** 某题是否已作答。 */
const isAnswered = (session: ExamSession, itemId: string): boolean =>
  session.results.some((result) => result.itemId === itemId);

/**
 * 下一个未作答的位置（从 `from` 起按节顺序找第一个未答题）。
 * 找不到（全卷答完）时返回最后一节末题位置——`submitted` 由页面流程决定，不由这里推断。
 */
export const nextUnanswered = (
  paper: ExamPaper,
  session: ExamSession,
  from: { section: 1 | 2 | 3; index: number }
): { section: 1 | 2 | 3; index: number } => {
  let section = from.section;
  let index = from.index;
  while (section <= 3) {
    const items = itemsOfSection(paper, section);
    while (index < items.length) {
      if (!isAnswered(session, items[index].id)) return { section, index };
      index += 1;
    }
    if (section === 3) break;
    section = (section + 1) as 2 | 3;
    index = 0;
  }
  const lastItems = itemsOfSection(paper, 3);
  return { section: 3, index: Math.max(0, lastItems.length - 1) };
};

/** 开始（或继续）一次考试。幂等：已有会话时只刷新 updatedAt，绝不重置进度。 */
export const startExamSession = (data: AppData, paper: ExamPaper): AppData => {
  const existing = getExamSession(data, paper.paperId);
  if (existing) {
    return {
      ...data,
      examSessions: {
        ...(data.examSessions ?? {}),
        [paper.paperId]: { ...existing, updatedAt: nowIso() }
      }
    };
  }
  const session: ExamSession = {
    paperId: paper.paperId,
    seasonId: paper.seasonId,
    variantIndex: paper.variantIndex,
    startedAt: nowIso(),
    updatedAt: nowIso(),
    cursor: { section: 1, index: 0 },
    results: [],
    revealedSections: []
  };
  return { ...data, examSessions: { ...(data.examSessions ?? {}), [paper.paperId]: session } };
};

/**
 * 记录一道题的作答并推进 cursor（每答一题即写，把丢失粒度降到 1 题）。
 *
 * 重复作答同一题：覆盖原记录（而不是追加），否则 results 会长出重复 itemId，
 * 诊断页的「稳住 N 件」会被重复计数。
 */
export const recordExamItem = (
  data: AppData,
  paper: ExamPaper,
  item: ExamPaperItem,
  outcome: { answer: string; passed: boolean; score: number; durationMs: number }
): AppData => {
  const session = getExamSession(data, paper.paperId);
  if (!session) return data;
  const result: ExamItemResult = {
    itemId: item.id,
    section: item.section,
    kind: item.kind,
    answer: outcome.answer,
    passed: outcome.passed,
    score: outcome.score,
    durationMs: Math.max(0, Math.round(outcome.durationMs)),
    sourceLessonId: item.sourceLessonId,
    answeredAt: nowIso()
  };
  const results = [...session.results.filter((entry) => entry.itemId !== item.id), result];
  const afterRecord: ExamSession = { ...session, results, updatedAt: nowIso() };
  const next = nextUnanswered(paper, afterRecord, { section: item.section, index: 0 });
  return {
    ...data,
    examSessions: {
      ...(data.examSessions ?? {}),
      [paper.paperId]: { ...afterRecord, cursor: next }
    }
  };
};

/**
 * 记录写作作答（不判分：AI 只批改与讲解，不出分——PRD §4.6）。
 * 与 `recordExamItem` 分开：写作的结果由 AI 批改异步补写，且不进 `results` 的判分口径。
 */
export const recordExamWriting = (
  data: AppData,
  paperId: string,
  writing: NonNullable<ExamSession["writing"]>
): AppData => {
  const session = getExamSession(data, paperId);
  if (!session) return data;
  return {
    ...data,
    examSessions: {
      ...(data.examSessions ?? {}),
      [paperId]: { ...session, writing, updatedAt: nowIso() }
    }
  };
};

/** 逐节揭晓（PRD §4.8）：把某一节标记为已揭晓。 */
export const revealExamSection = (data: AppData, paperId: string, section: 1 | 2 | 3): AppData => {
  const session = getExamSession(data, paperId);
  if (!session) return data;
  const revealedSections = [...new Set([...session.revealedSections, section])].sort((a, b) => a - b);
  return {
    ...data,
    examSessions: {
      ...(data.examSessions ?? {}),
      [paperId]: { ...session, revealedSections, updatedAt: nowIso() }
    }
  };
};

/** 某一节是否所有题都已作答。 */
export const isSectionComplete = (paper: ExamPaper, session: ExamSession, section: 1 | 2 | 3): boolean =>
  itemsOfSection(paper, section).every((item) => isAnswered(session, item.id));

/** 是否全卷答完（写作只要留下文本即算答过；空文本也算「提交了」，只是没内容可批）。 */
export const isPaperComplete = (paper: ExamPaper, session: ExamSession): boolean =>
  SECTION_ORDER.every((section) => isSectionComplete(paper, session, section));

/** 交卷：写 submittedAt。**不写分数结论**（分数形态见 PRD Q1）。 */
export const submitExamSession = (data: AppData, paperId: string): AppData => {
  const session = getExamSession(data, paperId);
  if (!session) return data;
  return {
    ...data,
    examSessions: {
      ...(data.examSessions ?? {}),
      [paperId]: { ...session, submittedAt: nowIso(), updatedAt: nowIso() }
    }
  };
};

/**
 * 记录一次异议（「我觉得这句没错」）。
 * **只记录、不即时改判、不重评**——既有架构红线是「AI 一旦沾判分，用户一辩它就翻供」
 * （`prd-grammar-ai-tutor-2026-09-19.md:285`）。claim 落原文，长度由归一化器截断。
 */
export const recordExamDispute = (
  data: AppData,
  input: { paperId: string; itemId: string; claim: string }
): AppData => ({
  ...data,
  examDisputes: [
    ...(data.examDisputes ?? []),
    {
      id: `exam_dispute_${data.examDisputes?.length ?? 0}_${input.itemId}`,
      paperId: input.paperId,
      itemId: input.itemId,
      claim: input.claim,
      createdAt: nowIso()
    }
  ]
});

export interface ExamDiagnosis {
  /** 已稳住的 grammarLabel（去重）。 */
  stabilizedLabels: string[];
  /** 还漏的 grammarLabel（去重）。 */
  missingLabels: string[];
  /** 逐题诊断条目：结果页的「还漏」清单直接用。 */
  missingItems: { itemId: string; promptZh: string; answer: string; sourceLessonId: string; sourceLessonNumber: number }[];
  stabilizedCount: number;
  missingCount: number;
}

/**
 * 诊断清单（PRD §4.8 主形态）：按 grammarLabel 归并成一件事，而不是按题。
 *
 * 为什么按 label 而不是按题：用户想看的是「这一季我稳住了哪几件事」，
 * 不是「25 道题对了 17 道」——后者正是 PRD Q1 明确要避免的百分制口径。
 */
export const examDiagnosis = (paper: ExamPaper, session: ExamSession | undefined): ExamDiagnosis => {
  const byItemId = new Map(paper.items.map((item) => [item.id, item]));
  const stabilized = new Set<string>();
  const missing = new Set<string>();
  const missingItems: ExamDiagnosis["missingItems"] = [];
  for (const result of session?.results ?? []) {
    const item = byItemId.get(result.itemId);
    if (!item || !item.grammarLabel) continue;
    if (result.passed) stabilized.add(item.grammarLabel);
    else {
      missing.add(item.grammarLabel);
      missingItems.push({
        itemId: item.id,
        promptZh: item.promptZh,
        answer: item.answer,
        sourceLessonId: item.sourceLessonId,
        sourceLessonNumber: item.sourceLessonNumber
      });
    }
  }
  // 已稳住的不再出现在「还漏」里：同一个 label 两种题型一对一错时，按「稳住」算——
  // 因为标签粒度就是「这件事会不会」，会了就不该再报漏（避免同一件事两头都算）。
  for (const label of stabilized) missing.delete(label);
  const missingLabels = [...missing];
  /**
   * 还漏清单**按 grammarLabel 去重**：一个 label 只出一行（取第一个答错的那题做代表）。
   *
   * 为什么必须去重（整卷走查抓出的不一致）：界面上写的是「还有 M 处要再看一眼」，
   * 而 M 是 label 数；若清单按题列，就会变成「写着 12 处、列出 20 行」，
   * 计数与清单对不上。**不变量：`missingItems.length === missingCount`**，
   * 由 `ex7` 的整卷走查锁住。
   */
  const missingByLabel = new Map<string, ExamDiagnosis["missingItems"][number]>();
  for (const entry of missingItems) {
    const item = byItemId.get(entry.itemId);
    if (!item) continue;
    if (!missing.has(item.grammarLabel)) continue; // 已稳住的 label 不出现在清单里
    if (!missingByLabel.has(item.grammarLabel)) missingByLabel.set(item.grammarLabel, entry);
  }
  const dedupedMissing = [...missingByLabel.values()];
  return {
    stabilizedLabels: [...stabilized],
    missingLabels,
    missingItems: dedupedMissing,
    stabilizedCount: stabilized.size,
    missingCount: missingLabels.length
  };
};

/**
 * 错题回流（P1-2）：把「还漏」且能指回某一课的题，还原成**整句**喂给既有 SM-2 队列。
 *
 * 规格：PRD §4.8（结果页的「错题回流入口」）｜裁决 14「考试错题只做**新增入口**，
 * 把题源 id 喂给既有队列，不改算法」｜§4.10 不变量 1。
 *
 * 三件事必须守住：
 * 1. **不改 SM-2**：只调用既有的 `addLessonMistakeSentence`（它内部走 `addSentence`，
 *    与课内答错、日记批改进的是同一条队列、同一套参数）。
 * 2. **只回流「整句」**：队列是句子级的，塞一个 `am` 进去只会产出一道废题
 *    （这正是入队侧修过的 `rebuildTooFewChunks`）。所以按题型还原：
 *      - `zh2en`：答案本身就是完整句 → 直接用
 *      - `cloze` / `mcq(choose)`：题面是「选一个填进空位：I ____ happy.」→ 把空位换回答案
 *      - `read` / `write`：阅读选项是短语、写作无判分 → **不回流**
 * 3. **只回流错题**：已稳住的句子不进队列（避免把会的东西再排一遍）。
 */
export const reviewableSentenceOf = (item: ExamPaperItem): string => {
  if (!item || item.kind === "read" || item.kind === "write") return "";
  const answer = (item.answer ?? "").trim();
  if (!answer) return "";
  // 题面里带空位：把空位换回答案即可还原整句（选择题与填空题都是这个形态）
  const prompt = item.promptZh ?? "";
  const blankAt = prompt.indexOf("____");
  if (blankAt >= 0) {
    const sentence = prompt
      .slice(blankAt - 200) // 防题面异常长
      .replace(/^[\s\S]*?：/, "") // 去掉「选一个填进空位：」这类中文前缀
      .replace("____", answer)
      .trim();
    return sentence.split(/\s+/).filter(Boolean).length >= 3 ? sentence : "";
  }
  // 无空位：只有「答案本身就是句子」时才可用（对比题的正确答案、中译英的答案句）
  const looksLikeSentence = answer.includes(" ") && /[.!?]$/.test(answer);
  return looksLikeSentence && answer.split(/\s+/).filter(Boolean).length >= 3 ? answer : "";
};

/** 本卷里「还漏」且可回流的句子（去重、可溯源到课）。 */
export const examMistakeSentences = (
  paper: ExamPaper,
  session: ExamSession | undefined
): Array<{ lessonId: string; sentence: string; grammarNote: string }> => {
  const byId = new Map(paper.items.map((item) => [item.id, item]));
  const seen = new Set<string>();
  const out: Array<{ lessonId: string; sentence: string; grammarNote: string }> = [];
  for (const result of session?.results ?? []) {
    if (result.passed) continue;
    const item = byId.get(result.itemId);
    if (!item || !item.sourceLessonId) continue;
    const sentence = reviewableSentenceOf(item);
    if (!sentence || seen.has(sentence)) continue;
    seen.add(sentence);
    out.push({
      lessonId: item.sourceLessonId,
      sentence,
      grammarNote: `第 ${item.sourceLessonNumber} 课：${item.grammarLabel}`
    });
  }
  return out;
};

/**
 * 交卷后把错题喂进既有队列。**幂等**（`addLessonMistakeSentence` 按句子+来源去重），
 * 所以重复交卷/重看结果屏都不会重复入队。
 */
export const queueExamMistakes = (data: AppData, paper: ExamPaper, session: ExamSession | undefined): AppData => {
  let next = data;
  for (const mistake of examMistakeSentences(paper, session)) {
    const lesson = GRAMMAR_LESSON_BY_ID.get(mistake.lessonId);
    if (!lesson) continue;
    next = addLessonMistakeSentence(next, lesson, mistake.sentence, mistake.grammarNote);
  }
  return next;
};
