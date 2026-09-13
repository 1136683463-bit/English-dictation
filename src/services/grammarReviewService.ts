import type { AppData, Card, Schedule, SentenceDetails } from "../types";
import { compareText, diffScore } from "./diffService";
import { normalizeLessonSentence } from "./lessonService";

/**
 * 语法点复习会话（R03）：把进入 SM-2 队列的语法句子卡变成「产出型小任务」。
 * - 会话硬上限 10 张（复习不成为负担，瑞思风险④）；
 * - 最旧错题优先（lapse 多的排前），再按到期时间排；
 * - 相邻卡不同来源（混题：新错 + 旧错交替出现）；
 * - 题型按 reviewCount 轮换（填空 / 重组），同一张卡每次复习形态不同，防背答案。
 */

export const GRAMMAR_REVIEW_SESSION_LIMIT = 10;
export const GRAMMAR_REVIEW_TIME_BUDGET_MS = 5 * 60 * 1000;

/** R09 Step2 feature flag：语法卡第 3 次出现转自由输出（free_type）。默认开；
 *  出问题时在 console 执行 localStorage.setItem("grammar-review-free-type","off") 即可回滚到 cloze/rebuild 两形态。 */
const FREE_TYPE_FLAG_KEY = "grammar-review-free-type";

export const isFreeTypeReviewEnabled = (): boolean => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return true;
    return window.localStorage.getItem(FREE_TYPE_FLAG_KEY) !== "off";
  } catch {
    return true;
  }
};

/** R09 Step2：reviewCount≥2 的语法卡第 3 次（含）以后出现转自由输出——「输出才算会用」。 */
export const FREE_TYPE_MIN_REVIEW_COUNT = 2;

const isGrammarSentenceCard = (card: Card): boolean =>
  card.type === "sentence" && card.status !== "suspended" && card.tags.includes("语法");

export interface GrammarReviewCard {
  card: Card;
  schedule: Schedule;
}

/** 到期的语法复习卡：最旧错题优先，其次按到期时间升序。 */
export const listDueGrammarReviewCards = (data: AppData, now = new Date()): GrammarReviewCard[] => {
  const scheduleByCardId = new Map(data.schedules.map((schedule) => [schedule.cardId, schedule]));
  return data.cards
    .filter(isGrammarSentenceCard)
    .map((card) => {
      const schedule = scheduleByCardId.get(card.id);
      return schedule ? { card, schedule } : null;
    })
    .filter((item): item is GrammarReviewCard =>
      Boolean(item && new Date(item.schedule.nextReviewAt) <= now)
    )
    .sort((a, b) => {
      const lapseDelta = b.schedule.lapseCount - a.schedule.lapseCount;
      if (lapseDelta !== 0) return lapseDelta;
      return a.schedule.nextReviewAt.localeCompare(b.schedule.nextReviewAt);
    });
};

/** 按来源轮转交错：相邻卡片尽量来自不同课程/来源（混题 30–50% 的实现载体）。 */
export const interleaveBySource = <T extends { card: Card }>(items: T[]): T[] => {
  const buckets = new Map<string, T[]>();
  for (const item of items) {
    const key = item.card.sourceId ?? "";
    const bucket = buckets.get(key);
    if (bucket) bucket.push(item);
    else buckets.set(key, [item]);
  }
  const queues = [...buckets.values()];
  const result: T[] = [];
  let index = 0;
  while (result.length < items.length && index < items.length * queues.length + queues.length) {
    const queue = queues[index % queues.length];
    const next = queue.shift();
    if (next) result.push(next);
    index += 1;
  }
  return result;
};

/** 组一次复习会话：交错混题后按上限截断。 */
export const buildGrammarReviewSession = (
  data: AppData,
  limit = GRAMMAR_REVIEW_SESSION_LIMIT
): GrammarReviewCard[] => interleaveBySource(listDueGrammarReviewCards(data)).slice(0, Math.max(1, limit));

// ── R06 累计掌握视图 ─────────────────────────────────────────

export interface GrammarMasterySummary {
  /** 已掌握（card.status === "mastered"）。 */
  mastered: number;
  /** 进行中（在复习队列里，尚未 mastered）。 */
  inProgress: number;
  /** 未开始（新卡，还没复习过）。 */
  notStarted: number;
  /** 语法句子卡总数（含 suspended 之外的全部）。 */
  total: number;
}

/**
 * R06 累计掌握视图：把复习页从「本次会话视角」升级为「成长曲线视角」。
 * 口径：已掌握 = mastered；未开始 = 从未复习（schedule.reviewCount === 0）；其余为进行中。
 */
export const summarizeGrammarMastery = (data: AppData): GrammarMasterySummary => {
  const scheduleByCardId = new Map(data.schedules.map((schedule) => [schedule.cardId, schedule]));
  let mastered = 0;
  let inProgress = 0;
  let notStarted = 0;
  let total = 0;
  for (const card of data.cards) {
    if (card.type !== "sentence" || card.status === "suspended" || !card.tags.includes("语法")) continue;
    total += 1;
    if (card.status === "mastered") {
      mastered += 1;
      continue;
    }
    const reviewCount = scheduleByCardId.get(card.id)?.reviewCount ?? 0;
    if (reviewCount === 0) notStarted += 1;
    else inProgress += 1;
  }
  return { mastered, inProgress, notStarted, total };
};

// ── 任务生成 ───────────────────────────────────────────────

export type GrammarReviewMode = "cloze" | "rebuild" | "free_type";

export interface GrammarReviewTask {
  card: Card;
  mode: GrammarReviewMode;
  /** cloze：挖空后的句子（空位为 ____）；rebuild：给操作提示；free_type：中文意图/提示。 */
  promptText: string;
  /** cloze 的正确答案词。 */
  answer: string;
  /** cloze 的四个选项（正确答案 + 3 个干扰项）。 */
  options: string[];
  /** rebuild 的打乱词块。 */
  scrambled: string[];
  /** 完整正确句。 */
  sentence: string;
  /** 反馈时展示的语法解释。 */
  note: string;
}

const STOP_WORDS = new Set(["the", "and", "but", "because", "so", "a", "an"]);

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

const cleanToken = (token: string): string => token.replace(/[.,!?;:]/g, "");

/** 语法承载词的候选下标：实词优先（长度 > 2 且非常见功能词）。 */
const contentTokenIndexes = (sentence: string): number[] => {
  const raw = sentence.split(/\s+/).filter(Boolean);
  const indexes: number[] = [];
  raw.forEach((token, index) => {
    const clean = cleanToken(token);
    if (clean.length > 2 && !STOP_WORDS.has(clean.toLowerCase())) indexes.push(index);
  });
  if (indexes.length === 0) indexes.push(0);
  return indexes;
};

/** 造 3 个干扰项：同词族变形优先（-s/-es/-ed/-ing），不足则取句内其他实词。 */
const buildClozeOptions = (answer: string, tokens: string[]): string[] => {
  const lower = answer.toLowerCase();
  const candidates: string[] = [];
  for (const suffix of ["s", "es", "ed", "ing", "d"]) {
    const variant = `${lower}${suffix}`;
    if (variant !== lower && !candidates.includes(variant)) candidates.push(variant);
  }
  for (const token of tokens) {
    const clean = cleanToken(token);
    if (clean && clean.toLowerCase() !== lower && !candidates.includes(clean.toLowerCase())) {
      candidates.push(clean.toLowerCase());
    }
  }
  const random = mulberry32(hashText(answer));
  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [candidates[index], candidates[swap]] = [candidates[swap], candidates[index]];
  }
  const options = [answer, ...candidates.slice(0, 3)];
  const optionRandom = mulberry32(hashText(`${answer}:options`));
  for (let index = options.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(optionRandom() * (index + 1));
    [options[index], options[swap]] = [options[swap], options[index]];
  }
  return options;
};

/** 由一张卡生成一道产出型复习题。reviewCount 决定题型轮换与挖空位置（确定性，可回放）。 */
export const buildGrammarReviewTask = (
  item: GrammarReviewCard,
  sentenceDetailsList: SentenceDetails[] = []
): GrammarReviewTask => {
  const { card, schedule } = item;
  const sentence = card.front.trim();
  const tokens = sentence.split(/\s+/).filter(Boolean);
  // R02：反馈讲解优先取 SentenceDetails.grammarNote（hunt 来源卡的罪名讲解在这里），退回 card.note。
  const details = sentenceDetailsList.find((item) => item.cardId === card.id);
  const note = details?.grammarNote || card.note || "";
  // R09 Step2：flag 开启且复习满 2 次后，第 3 次（含）以后出现转自由输出——复习的终点是「不用提示自己写出来」。
  const mode: GrammarReviewMode =
    isFreeTypeReviewEnabled() && (schedule.reviewCount ?? 0) >= FREE_TYPE_MIN_REVIEW_COUNT
      ? "free_type"
      : (schedule.reviewCount ?? 0) % 2 === 0
        ? "cloze"
        : "rebuild";

  if (mode === "free_type") {
    // P1-2：free_type 给「来源锚点」——cloze 有挖空句、rebuild 有词块，free_type 至少要让用户知道写哪句。
    // 优先用 card.note（hunt 卡="找错案件：xxx"、lesson 卡="语法课核心句：xxx"、日记卡="我的英文日记·日期"），
    // 没有 note 时给词数提示（比光秃秃的空白输入框多一个抓手）。
    const sourceHint = card.note.trim()
      ? `${card.note.trim()}——把那句话自己写出来`
      : `把那句 ${tokens.length} 个词的句子自己写出来`;
    return {
      card,
      mode,
      promptText: sourceHint,
      answer: "",
      options: [],
      scrambled: [],
      sentence,
      note
    };
  }

  if (mode === "rebuild") {
    const random = mulberry32(hashText(`${card.id}:${schedule.reviewCount}`));
    const scrambled = [...tokens];
    for (let index = scrambled.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(random() * (index + 1));
      [scrambled[index], scrambled[swap]] = [scrambled[swap], scrambled[index]];
    }
    if (scrambled.length > 1 && scrambled.join(" ") === tokens.join(" ")) {
      [scrambled[0], scrambled[scrambled.length - 1]] = [scrambled[scrambled.length - 1], scrambled[0]];
    }
    return {
      card,
      mode,
      promptText: "把这些词块按顺序点回去，拼出正确的句子",
      answer: "",
      options: [],
      scrambled,
      sentence,
      note
    };
  }

  const indexes = contentTokenIndexes(sentence);
  const pickedIndex = indexes[(schedule.reviewCount ?? 0) % indexes.length];
  const answer = cleanToken(tokens[pickedIndex] ?? "");
  const promptTokens = tokens.map((token, index) => (index === pickedIndex ? "____" : token));
  return {
    card,
    mode,
    promptText: promptTokens.join(" "),
    answer,
    options: buildClozeOptions(answer, tokens),
    scrambled: [],
    sentence,
    note
  };
};

/** 填空判分（大小写宽容）。 */
export const judgeGrammarCloze = (picked: string, answer: string): boolean =>
  picked.trim().toLowerCase() === answer.trim().toLowerCase();

/** 重组判分（顺序与内容都对，标点与大小写宽容）。 */
export const judgeGrammarRebuild = (built: string[], sentence: string): boolean =>
  normalizeLessonSentence(built.join(" ")) === normalizeLessonSentence(sentence);

/** R09 Step2 free_type 判分：diffScore ≥ 90（与课内 output 段同口径，拼写接近算半对，非严格等值）。 */
export const FREE_TYPE_PASS_SCORE = 90;

export const judgeGrammarFreeType = (input: string, sentence: string): { passed: boolean; score: number } => {
  const score = diffScore(compareText(sentence, input, false));
  return { passed: score >= FREE_TYPE_PASS_SCORE, score };
};

/**
 * R09 Step2 新掌握口径：自由输出「连续 2 次一次通过」才算掌握。
 * 判定依据本卡历史 review 事件流（reviews 里 mode="recall" 的记录即 free_type 复习——
 * reviewModeForTask 把 free_type 映射为 recall），取最近两条 free_type 结果。
 * 返回 true 表示已达「输出连续 2 次通过」。
 */
export const isMasteredByOutput = (reviews: { cardId: string; mode: string; rating: number }[], cardId: string): boolean => {
  const outputReviews = reviews.filter((review) => review.cardId === cardId && review.mode === "recall");
  if (outputReviews.length < 2) return false;
  const lastTwo = outputReviews.slice(-2);
  return lastTwo.every((review) => review.rating === 4);
};
