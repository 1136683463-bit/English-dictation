import type { AppData, GrammarLesson, LessonGuidedStep, LessonPracticeStep } from "../types";
import { GRAMMAR_LESSON_BY_ID, grammarLessons } from "../data/grammarLessons";
import { addSentence } from "./cardService";
import { expandWithSource, tokenSequencesEquivalent } from "./diffService";
import { nowIso } from "./storage";

/** 英文句子判分用的归一化：小写、去掉标点、压缩空白。 */
export const normalizeLessonSentence = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[.,!?;:'"’‘（），。？！、]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * 句面哈希（FNV-1a，32 位）：北极星「周有效输出句数」按句去重的稳定标识。
 * 用归一化文本做输入——同句的大小写/标点差异不影响去重结果。
 */
export const hashGrammarSentence = (sentence: string): string => {
  const text = normalizeLessonSentence(sentence);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
};

/**
 * 点词成句判分：顺序与内容都对才算通过（标点与大小写宽容）。
 *
 * 缩写与全称互通——选 [It, is, ...] 拼出 "It is cold today." 与选 [It's, ...] 一样算对；
 * 但选干扰项 Its（丢了一小撇）仍然判错，正是 L87/L88 要教的差别。
 */
export const checkLessonTokens = (selected: string[], answer: string): boolean =>
  tokenSequencesEquivalent(selected, answer);

/** 点选题判分。 */
export const checkLessonChoice = (picked: string, answer: string): boolean =>
  picked.trim().toLowerCase() === answer.trim().toLowerCase();

/**
 * 点词成句答错时，找出第一个对不上的**词块**位置（0 起）。
 * 用于温和提示「从第 N 个词开始有点不对」，全部对上返回 -1。
 *
 * 比较在展开口径下进行（用户选的 It's 与答案的 It is 是同一个词，不该算不同），
 * 但返回的位置要落回用户看得见的词块——答案写 It's、用户选了 It is 时，
 * 展开后多出的 is 不能把后面所有位置都推后一位。
 */
export const firstMismatchIndex = (selected: string[], answer: string): number => {
  const answerWords = expandWithSource([answer]);
  const pickedWords = expandWithSource(selected);
  const length = Math.max(answerWords.length, pickedWords.length);
  for (let index = 0; index < length; index += 1) {
    if (pickedWords[index]?.token !== answerWords[index]?.token) {
      // 落回词块口径：用户侧能定位就定位，否则用答案侧的位置。
      return pickedWords[index]?.chunkIndex ?? answerWords[index]?.chunkIndex ?? index;
    }
  }
  return -1;
};

export const listGrammarLessons = (): GrammarLesson[] => grammarLessons;

export const getGrammarLesson = (lessonId: string): GrammarLesson | undefined =>
  GRAMMAR_LESSON_BY_ID.get(lessonId);

export const getCompletedLessonIds = (data: AppData): Set<string> =>
  new Set(data.grammarLessonsDone ?? []);

export const isLessonDone = (data: AppData, lessonId: string): boolean =>
  getCompletedLessonIds(data).has(lessonId);

// ── F1 三关卡粒度完成态（2026-09-13 PRD）────────────────────────────────
// 关卡序号口径：1 = 本课正课 / 2 = 次日回访关 / 3 = 旧案重审关。
// 双写原则：关 1 完成时 grammarLessonsDone 与 grammarLessonStagesDone 同步写；
// 读口径上，所有存量消费方（路径页点亮、hunt 解锁、进度汇总）继续读 grammarLessonsDone（= 关 1），
// 只有三关卡 UI/回访逻辑读新字段——旧数据经 backfillLessonStages 补 [1]，老用户不丢进度。

export type LessonStageIndex = 1 | 2 | 3;

/** 读取某课已完成的关卡序号集合（含旧字段回填视角：grammarLessonsDone 有值即视为关 1 完成）。 */
export const getLessonStagesDone = (data: AppData, lessonId: string): Set<number> => {
  const stages = new Set(data.grammarLessonStagesDone?.[lessonId] ?? []);
  if (data.grammarLessonsDone?.includes(lessonId)) stages.add(1);
  return stages;
};

export const isLessonStageDone = (data: AppData, lessonId: string, stage: LessonStageIndex): boolean =>
  getLessonStagesDone(data, lessonId).has(stage);

/** 完成某关（幂等，不可变）。关 1 完成时同步写旧字段（双写），保持存量消费方口径不变。 */
export const markLessonStageDone = (data: AppData, lessonId: string, stage: LessonStageIndex): AppData => {
  if (!GRAMMAR_LESSON_BY_ID.has(lessonId)) return data;
  const current = getLessonStagesDone(data, lessonId);
  if (current.has(stage)) return data;
  const nextStages = { ...(data.grammarLessonStagesDone ?? {}) };
  nextStages[lessonId] = [...current, stage].sort((a, b) => a - b);
  const withStages: AppData = { ...data, grammarLessonStagesDone: nextStages };
  // 关 1 = 旧字段口径的「完课」：走既有 markLessonDone 链路（含核心句入 SM-2），保证双写一致。
  return stage === 1 ? markLessonDone(withStages, lessonId) : withStages;
};

/**
 * F1 旧数据回填（幂等）：把 grammarLessonsDone 里已完成、但新字段缺关 1 记录的课程补 [1]。
 * 双写上线前的存量进度 = 关 1 完成。返回 { data, backfilled } 供 dry-run 对账。
 */
export const backfillLessonStages = (data: AppData): { data: AppData; backfilled: number } => {
  const done = data.grammarLessonsDone ?? [];
  const stages = { ...(data.grammarLessonStagesDone ?? {}) };
  let backfilled = 0;
  for (const lessonId of done) {
    const existing = new Set(stages[lessonId] ?? []);
    if (existing.has(1)) continue;
    existing.add(1);
    stages[lessonId] = [...existing].sort((a, b) => a - b);
    backfilled += 1;
  }
  return { data: { ...data, grammarLessonStagesDone: stages }, backfilled };
};

// ── F1 三关卡解锁判定（2026-09-13 PRD §6.1）──────────────────────────────
// 关 2（次日回访）：关 1 完成 且 SM-2 到期（v1 严格次日 20h，SM-2 内部仍弹性——决策点⑤已拍板）。
// 关 3（旧案重审）：关 2 完成即解锁（柔性入口，不阻塞——决策点①已拍板）。
// 关 1 完成时间取自遥测 grammar_lesson_completed.completedAt（最近一次），无事件时回退「已完成即可解锁」
// （老用户回填进度无时间戳，按「已满次日窗」处理，避免老课永久锁关 2）。

const STAGE2_UNLOCK_DELAY_MS = 20 * 60 * 60 * 1000; // 次日 20h（严格次日窗下界）

export type LessonStageLockState = "locked" | "unlocked" | "done";

export interface LessonStageLockInfo {
  stage: LessonStageIndex;
  state: LessonStageLockState;
  /** 关 2 未解锁时的预计解锁时刻（ISO），供路径页显示「明早 8 点解锁」。 */
  unlockAt?: string;
}

/** 关 1 完成时间（遥测最近一次 completed 事件；无则 null）。由调用方注入事件读取，避免反向依赖遥测。 */
export type LessonCompletedAtReader = (lessonId: string) => string | null;

export const getLessonStageLock = (
  data: AppData,
  lessonId: string,
  stage: LessonStageIndex,
  readCompletedAt: LessonCompletedAtReader,
  now = Date.now()
): LessonStageLockInfo => {
  const done = getLessonStagesDone(data, lessonId);
  if (done.has(stage)) return { stage, state: "done" };

  if (stage === 1) {
    // 关 1 线性解锁：前一课关 1 完成即可（第 1 课恒解锁）。
    const lesson = GRAMMAR_LESSON_BY_ID.get(lessonId);
    if (!lesson) return { stage, state: "locked" };
    if (lesson.number === 1) return { stage, state: "unlocked" };
    const prev = grammarLessons.find((item) => item.number === lesson.number - 1);
    const prevDone = prev ? getLessonStagesDone(data, prev.id).has(1) : false;
    return { stage, state: prevDone ? "unlocked" : "locked" };
  }

  if (stage === 2) {
    if (!done.has(1)) return { stage, state: "locked" };
    const completedAt = readCompletedAt(lessonId);
    // 老用户回填进度无时间戳：按已满次日窗处理，直接解锁（不永久锁关 2）。
    if (!completedAt) return { stage, state: "unlocked" };
    const doneTime = Date.parse(completedAt);
    if (!Number.isFinite(doneTime)) return { stage, state: "unlocked" };
    if (now - doneTime >= STAGE2_UNLOCK_DELAY_MS) return { stage, state: "unlocked" };
    return { stage, state: "locked", unlockAt: new Date(doneTime + STAGE2_UNLOCK_DELAY_MS).toISOString() };
  }

  // stage === 3：关 2 完成即解锁
  return { stage, state: done.has(2) ? "unlocked" : "locked" };
};

/** 下一节待学课程：按编号找第一个未完成的。全部完成则返回 null。 */
export const getNextLesson = (data: AppData): GrammarLesson | null => {
  const done = getCompletedLessonIds(data);
  return grammarLessons.find((lesson) => !done.has(lesson.id)) ?? null;
};

/**
 * 紧接某课之后的下一节（按编号，不要求未完成）。
 *
 * 与 getNextLesson 的区别：那个返回「全局第一个未完成的课」，用于地图主 CTA；
 * 这个用于**完课后的「下一课」按钮**——用户刚学完 L13，就该去 L14，
 * 而不是因为中间有跳着没学的课被弹回地图（此前两个按钮都只跳 /grammar，动线不闭合）。
 */
export const getFollowingLesson = (lessonId: string): GrammarLesson | null => {
  const current = GRAMMAR_LESSON_BY_ID.get(lessonId);
  if (!current) return null;
  return grammarLessons.find((lesson) => lesson.number === current.number + 1) ?? null;
};

/** 完成一课（幂等，不可变返回新 AppData）。完课时把本课核心句型一并送入复习队列（R03：核心句型+错句均入队）。 */
export const markLessonDone = (data: AppData, lessonId: string): AppData => {
  if (!GRAMMAR_LESSON_BY_ID.has(lessonId)) return data;
  if ((data.grammarLessonsDone ?? []).includes(lessonId)) return data;
  const lesson = GRAMMAR_LESSON_BY_ID.get(lessonId);
  const withDone: AppData = { ...data, grammarLessonsDone: [...(data.grammarLessonsDone ?? []), lessonId] };
  return lesson ? addLessonCoreSentence(withDone, lesson) : withDone;
};

/**
 * 本课核心句型进入 SM-2 复习队列（R03）。与错句同一个来源约定：sourceId = lesson:<id>。
 * 幂等：同一句子 + 同一课程只收一次。
 */
export const addLessonCoreSentence = (data: AppData, lesson: GrammarLesson): AppData => {
  const sentence = lesson.targetSentence.trim();
  if (!sentence) return data;
  const duplicated = data.cards.some(
    (card) => card.type === "sentence" && card.front.trim() === sentence && card.sourceId === `lesson:${lesson.id}`
  );
  if (duplicated) return data;
  return addSentence(data, {
    sentence,
    /**
     * 中文意思（2026-09-21 修）。
     *
     * 此前写死 `translation: ""`，导致两个真实缺陷：
     * ① 通用复习页（/review）对句子卡的题面取 `back || front`（ReviewPage.tsx:223），
     *    back 为空时**题面 = 答案本身**——用户照着屏幕抄一遍就算满分，这道题零检验力；
     * ② 该页写回 `review.answer` 后，错题本会把「答案」当成「用户写的答案」展示。
     * 课的 `intentZh` 本来就是这句话的中文意图（全库 193 课都齐全），直接用它。
     */
    translation: lesson.intentZh?.trim() ?? "",
    keywords: "",
    grammarNote: lesson.oneLineRule,
    sourceId: `lesson:${lesson.id}`,
    note: `语法课核心句：${lesson.episode} ${lesson.title}`,
    tags: "语法"
  });
};

/**
 * 补写存量核心句卡的中文意思（2026-09-21）。
 *
 * 上面那处修复只对**新建**的卡生效：此前已入队的核心句卡 back 仍是空串，
 * 它们在 /review 里的题面依旧等于答案本身。这里按 `sourceId = lesson:<id>`
 * 找回对应课程，把空 back 补成 intentZh。
 * 幂等且克制：只补 back 为空白的卡，已有中文的一律不动（用户可能自己编辑过）。
 */
export const repairLessonCoreSentenceTranslations = (data: AppData): { data: AppData; repaired: number } => {
  let repaired = 0;
  const cards = data.cards.map((card) => {
    if (card.type !== "sentence" || card.back.trim()) return card;
    const lessonId = card.sourceId?.startsWith("lesson:") ? card.sourceId.slice("lesson:".length) : "";
    const lesson = lessonId ? GRAMMAR_LESSON_BY_ID.get(lessonId) : undefined;
    const meaning = lesson?.intentZh?.trim();
    if (!meaning) return card;
    repaired += 1;
    return { ...card, back: meaning };
  });
  return repaired > 0 ? { data: { ...data, cards }, repaired } : { data, repaired: 0 };
};

/**
 * R04 存量回填：遍历已完成课程，把核心句没入队的课补进 SM-2 复习队列。
 * 背景：核心句入队只挂在 markLessonDone（完课时刻）一条链路上——
 * 在此功能上线前已完成、或经测试/导入写入 grammarLessonsDone 的课程，核心句从未进过队列。
 * 幂等：addLessonCoreSentence 自带去重，重复执行不会产生重复卡。返回 { data, backfilled }。
 */
export const backfillLessonCoreSentences = (data: AppData): { data: AppData; backfilled: number } => {
  const done = getCompletedLessonIds(data);
  let next = data;
  let backfilled = 0;
  for (const lesson of grammarLessons) {
    if (!done.has(lesson.id)) continue;
    const before = next.cards.length;
    next = addLessonCoreSentence(next, lesson);
    if (next.cards.length > before) backfilled += 1;
  }
  return { data: next, backfilled };
};

export interface LessonGuidedState {
  index: number;
  /** choose 已选选项；arrange 已拼词块。 */
  picked: string[];
  checked: boolean;
  passed: boolean;
}

export const createGuidedState = (): LessonGuidedState => ({ index: 0, picked: [], checked: false, passed: false });

/**
 * 跟段（guided）题型顺序的模板轮换（2026-09-20 阶段二）。
 *
 * 背景：原先 151/158 课的 6 题顺序完全相同（choose→arrange→arrange→spot→arrange→replace），
 * 第 1 题 100% 是 choose、第 4 题 97% 是 spot、末题 99% 是 replace——
 * 学习者在点开下一题之前就能猜出题型，注意力因此松懈
 * （问题不是「答不出来」，而是「不用集中」）。
 *
 * 做法：按 lessonId 哈希确定性选取一套顺序模板。同一课每次进入顺序一致（可复习、可重做），
 * 不同课之间顺序不同。模板只重排**题位**，不改题目内容与题量，也不改判题逻辑
 * （judgeGuidedStep 只看 step.kind）。
 *
 * 模板设计约束（保证每课覆盖完整的四种交互）：
 * - 四种题型各至少出现一次；
 * - arrange 出现 ≥2 次（它是本段主力形态）；
 * - spot 不固定在同一个题位（原设计恒为第 4 题）。
 */
const GUIDED_ORDER_TEMPLATES: string[][] = [
  // 模板 A（原顺序，作为基准之一）
  ["choose", "arrange", "arrange", "spot", "arrange", "replace"],
  // 模板 B：spot 提前到第 2 位，choose 挪到中段
  ["arrange", "spot", "choose", "arrange", "replace", "arrange"],
  // 模板 C：replace 提前，spot 落在第 5 位
  ["arrange", "arrange", "replace", "choose", "spot", "arrange"],
  // 模板 D：choose 开场但 spot 落在第 3 位，末题是 arrange
  ["choose", "arrange", "spot", "replace", "arrange", "arrange"]
];

/** 与 shuffleTokenOrder 同款的稳定字符串哈希（无依赖、可复现）。 */
const hashGuidedSeed = (text: string): number => {
  let hash = 2_166_136_261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16_777_619);
  }
  return hash >>> 0;
};

/**
 * 返回该课跟段题目的取题顺序（原数组下标序列）。
 *
 * - 题量与模板不符时（如 L1 只有 5 题、部分课有 2 个 spot）回退原顺序，保证向后兼容；
 * - 用 lessonId 作种子，同一课恒定，不随重进/重做变化。
 */
export const guidedDisplayOrder = (steps: LessonGuidedStep[], lessonId: string): number[] => {
  const identity = steps.map((_step, index) => index);
  if (steps.length < 4) return identity;

  const template = GUIDED_ORDER_TEMPLATES[hashGuidedSeed(lessonId) % GUIDED_ORDER_TEMPLATES.length];
  // 按模板给出的题型顺序，依次从原数组里取「下一个该类型的题」
  const used = new Set<number>();
  const order: number[] = [];
  for (const kind of template) {
    const found = steps.findIndex((step, index) => !used.has(index) && step.kind === kind);
    if (found === -1) return identity; // 模板要求的题型本课没有 → 整体回退
    used.add(found);
    order.push(found);
  }
  // 模板未覆盖的题（本课题型更多时）按原顺序追加到末尾，保证不漏题
  for (const index of identity) if (!used.has(index)) order.push(index);
  return order;
};

/** 判当前引导题：全部词块用上后调用（spot 为单选命中制；replace 复用 choose 单选内核）。 */
export const judgeGuidedStep = (step: LessonGuidedStep, picked: string[]): boolean => {
  if (step.kind === "choose" || step.kind === "replace") {
    return checkLessonChoice(picked[picked.length - 1] ?? "", step.answer);
  }
  if (step.kind === "spot") return checkLessonChoice(picked[picked.length - 1] ?? "", step.wrongToken ?? step.answer);
  return checkLessonTokens(picked, step.answer);
};

/** 判当前自由练习题。 */
export const judgePracticeStep = (step: LessonPracticeStep, picked: string[]): boolean =>
  checkLessonTokens(picked, step.answer);

/**
 * 词块库展示顺序（点词成句的防作弊打乱）：
 * 数据里的 tokens 常常是顺手按答案顺序写的，若直接渲染，「点词成句」就退化成「顺着点一遍」。
 * 这里用种子化 PRNG 做确定性打乱——同一题每次进入顺序一致（可回放、不跳变），但一定不等于原顺序。
 * 返回的是 token 下标排列；点击/拖拽仍以原始下标记录，不影响判题与既有状态。
 */
const mulberry32 = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const hashText = (text: string): number => {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export const shuffleTokenOrder = (tokens: string[], seedText: string): number[] => {  const indexes = tokens.map((_token, index) => index);
  if (indexes.length <= 2) return indexes;
  const random = mulberry32(hashText(seedText));
  for (let i = indexes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  // 极小概率打乱后仍是原顺序：首尾互换，保证一定不是「顺着点就行」。
  if (indexes.every((value, position) => value === position)) {
    [indexes[0], indexes[indexes.length - 1]] = [indexes[indexes.length - 1], indexes[0]];
  }
  return indexes;
};

/**
 * 三单常驻检查（R04）：he / she / it 后面跟动词原形时温和提醒（不算错，只提示）。
 * 中文动词不变形，漏 -s 是初学者最高频的顽固错，所以在所有输出场景常驻。
 */
const THIRD_PERSON_BASE_VERBS =
  "go|like|have|do|does|want|need|work|live|come|comes|make|take|play|watch|eat|speak|study|read|write|walk|run|sing|know|think";

export const detectThirdPersonMiss = (input: string): string | null => {
  const pattern = new RegExp(`\\b(he|she|it)\\s+(${THIRD_PERSON_BASE_VERBS})\\b`, "i");
  return pattern.test(input) ? "他 / 她 / 它做事，动词要加 s——检查一下动词有没有小尾巴。" : null;
};

/**
 * 差异说明用的分词：在判分口径（缩写展成全称）下取词。
 *
 * 不能直接用字面分词——用户写长版 "It is cold today."、核心句是短版 "It's cold today." 时，
 * 字面上看是 4 词对 3 词，提示就会说「多了 it、is 一个词」，
 * 可这恰恰是课程自己承认的另一种正确写法。展开口径下两者词数相同，不会出现这句假指控。
 */
const outputWords = (value: string): string[] =>
  expandWithSource(value.split(/\s+/).filter(Boolean)).map((item) => item.token);

/**
 * R04 输出题的差异说明：告诉用户「多了哪个词 / 少了词 / 哪个位置不一样」，
 * 而不是只给红绿颜色让用户自己猜（2026-09-13 试玩发现后新增）。
 * 返回 null 表示无明显词集差异（如仅标点大小写差异）。
 */
export const describeOutputGap = (userText: string, target: string): string | null => {
  const userWords = outputWords(userText);
  const targetWords = outputWords(target);
  if (userWords.length === 0 || targetWords.length === 0) return null;
  if (userWords.join(" ") === targetWords.join(" ")) return null;

  if (userWords.length > targetWords.length) {
    const counts = new Map<string, number>();
    for (const word of targetWords) counts.set(word, (counts.get(word) ?? 0) + 1);
    const extras: string[] = [];
    for (const word of userWords) {
      const left = counts.get(word) ?? 0;
      if (left > 0) counts.set(word, left - 1);
      else extras.push(word);
    }
    if (extras.length > 0) {
      const shown = extras.slice(0, 2).map((word) => `「${word}」`).join("、");
      const countZh = extras.length === 1 ? "一个词" : `${extras.length} 个词`;
      return `多了${countZh} ${shown}——这一课的核心句是 ${targetWords.length} 个词。`;
    }
    const extraCount = userWords.length - targetWords.length;
    return `比核心句多了 ${extraCount} 个词——对比一下多出的位置。`;
  }

  if (userWords.length < targetWords.length) {
    const missing = targetWords.length - userWords.length;
    const countZh = missing === 1 ? "一个词" : `${missing} 个词`;
    return `少了${countZh}——这一课的核心句是 ${targetWords.length} 个词，再补上试试。`;
  }

  return "词的个数对上了，但顺序或个别词和核心句不太一样——看下面的对照。";
};

export interface LessonProgressSummary {
  done: number;
  total: number;
  nextLesson: GrammarLesson | null;
  percent: number;
}

export const summarizeLessonProgress = (data: AppData): LessonProgressSummary => {
  const done = getCompletedLessonIds(data);
  const completed = grammarLessons.filter((lesson) => done.has(lesson.id)).length;
  return {
    done: completed,
    total: grammarLessons.length,
    nextLesson: getNextLesson(data),
    percent: grammarLessons.length === 0 ? 0 : Math.round((completed / grammarLessons.length) * 100)
  };
};

/** 课程完成时间戳（用于以后做「我的英文变化」对比，先存起来）。 */
export const lessonCompletionMark = (): string => nowIso();

/**
 * 课程里练错过一次以上的句子，回流成句子卡，进入现有 SM-2 复习队列。
 * 同一句子 + 同一课程只收一次，避免反复刷课产生重复卡片。
 */
export const addLessonMistakeSentence = (
  data: AppData,
  lesson: GrammarLesson,
  sentence: string,
  grammarNote: string
): AppData => {
  const trimmed = sentence.trim();
  if (!trimmed) return data;
  const duplicated = data.cards.some(
    (card) => card.type === "sentence" && card.front.trim() === trimmed && card.sourceId === `lesson:${lesson.id}`
  );
  if (duplicated) return data;

  return addSentence(data, {
    sentence: trimmed,
    translation: "",
    keywords: "",
    grammarNote,
    sourceId: `lesson:${lesson.id}`,
    note: `语法课：${lesson.episode} ${lesson.title}`,
    tags: "语法"
  });
};
