import type { AppData, GrammarErrorTag, GrammarLesson } from "../types";
import { GRAMMAR_LESSON_BY_ID, grammarLessons } from "../data/grammarLessons";
import { compareText, diffScore } from "./diffService";
import { computeWeakSpots } from "./grammarWeakSpotsService";
import { normalizeLessonSentence } from "./lessonService";
import { listGrammarEventsByKind, type GrammarBoostStepResultEvent } from "./grammarTelemetry";

/**
 * 「趁热练」课后强化训练 · 题目派生与判题（2026-09-18 PRD §4.2/§4.8）。
 *
 * 定位：完课后的即时可选强化层——补「关 1 完成 → 关 2 次日 20h」之间唯一没有出口的空窗。
 * 三档零术语梯度（每档独立完成态、允许只做一档退出、不设正确率门禁）：
 *   ① 再认一次（辨识/回忆，4–5 题，2–3 分钟）
 *   ② 自己想（回忆/构造，5–6 题，4–5 分钟）
 *   ③ 换你来说（产出/迁移，3–4 题，4–5 分钟）
 *
 * 内容策略：优先从课程已有数据派生（65–80% 本地化）；档 3 锚点不足时由 AI 生成变式题
 * （答案先由确定性规则定，AI 只做措辞与解释，且必须过校验——见 grammarBoostAiService）。
 */

export type BoostTier = 1 | 2 | 3;

export const BOOST_TIERS: BoostTier[] = [1, 2, 3];

export interface BoostTierMeta {
  tier: BoostTier;
  /** 档位名（零术语，动作导向）。 */
  name: string;
  /** 一句话说明（做什么、多久）。 */
  summaryZh: string;
  /** 认知目标（内部口径，不进 UI 文案）。 */
  cognitiveGoal: string;
  questionCount: number;
  minutes: number;
}

/** 档位元信息——UI 与埋点共用同一来源（时长必须标出来，这是「允许只做一档」的前提）。 */
export const BOOST_TIER_META: Record<BoostTier, BoostTierMeta> = {
  1: {
    tier: 1,
    name: "再认一次",
    summaryZh: "看看还认得出来吗——4 题，约 2 分钟",
    cognitiveGoal: "辨识 / 回忆",
    questionCount: 4,
    minutes: 2
  },
  2: {
    tier: 2,
    name: "自己想",
    summaryZh: "给中文，自己把句子想出来——5 题，约 4 分钟",
    cognitiveGoal: "回忆 / 构造",
    questionCount: 5,
    minutes: 4
  },
  3: {
    tier: 3,
    name: "换你来说",
    summaryZh: "不给提示，自己说一遍——3 题，约 4 分钟",
    cognitiveGoal: "产出 / 迁移",
    questionCount: 3,
    minutes: 4
  }
};

/** 整句产出通过线（与课内 output 段同口径）。 */
export const BOOST_PRODUCE_PASS_SCORE = 90;
/** 中文→整句（有阶梯提示）的通过线（与课内 recall 段同口径）。 */
export const BOOST_RECALL_PASS_SCORE = 70;

export type BoostItemKind =
  | "contrast"
  | "cloze"
  | "spot"
  | "choose"
  | "recall"
  | "rebuild"
  | "arrange"
  | "replace"
  | "produce"
  /** 变式产出：说同一件事的另一个版本（否定 / 疑问）——任务与「中文→整句」不同。 */
  | "variant"
  /** 自己改错：给错句，自己写出正确句（产出形态的改错，比点词识别难）。 */
  | "fix"
  | "free";

export interface BoostContrast {
  sentence: string;
  /** true = 这句有问题（用户应选「有点问题」）。 */
  isWrong: boolean;
  correct: string;
  whyZh: string;
  wrongMark?: string | null;
}

export interface BoostItem {
  id: string;
  kind: BoostItemKind;
  /** 题干引导语（零术语）。 */
  promptZh: string;
  /** 中文意图（产出类题必给；缺了不知道要说什么）。 */
  intentZh: string;
  /** 完整正确句（判题基准；cloze 为题面句）。 */
  answer: string;
  /**
   * 答对之后的一句「为什么」（零术语）。
   * 用户反馈：只给正确答案不够——讲清楚为什么用这个，才知道下次怎么用。
   * 全部题型都必填（来源见各 buildXxx：contrast.whyZh / guided.explain / oneLineRule / recall.noteZh）。
   */
  explainZh: string;
  /** cloze：挖空后的题面 + 答案词 + 选项。 */
  clozeText?: string;
  clozeAnswer?: string;
  clozeOptions?: string[];
  /** contrast：正误对照。 */
  contrast?: BoostContrast;
  /** spot（改错）：含错的词块序列 + 藏在哪个下标 + 点对后的纠正说法。 */
  spotTokens?: string[];
  spotWrongIndex?: number;
  /** 多词标注时命中的全部下标（点中任一即算对）。 */
  spotWrongIndexes?: number[];
  spotCorrectionZh?: string;
  /** rebuild / arrange：打乱后的词块（arrange 含干扰项）。 */
  tokens?: string[];
  /** choose / replace：选项与替换说明。 */
  options?: string[];
  chooseBefore?: string;
  chooseAfter?: string;
  replaceBase?: string;
  replaceTarget?: string;
  /** recall：阶梯提示（首字母 → 首字母序列 → 完整句）。 */
  hints?: string[];
  /**
   * variant / fix 用的样例句：
   * - variant（变式产出）：给一个已知版本的句子，要求写出另一版本（answer 是要写的那句）；
   * - fix（自己改错）：给错句，要求写出正确句（answer 是正确句）。
   */
  shapedFrom?: string;
  /** variant / fix：样例句的角色说明（如「已知：肯定句」「这句写错了」）。 */
  shapedLabel?: string;
  /** 来源引用（去重、埋点、复练换池）。 */
  sourceRef: string;
  itemKind: "derived" | "ai";
  /** 是否旧课点混题（螺旋 30–50%）。 */
  fromReview: boolean;
  /**
   * 该题是否命中用户当前弱点（R-B15）。用于在题面上给一句提示——
   * 让用户看得见「这道题是冲我的短板来的」，而不是感觉随机复习。
   */
  targetsWeakSpot?: boolean;
}

// ── 确定性工具（与课内同款思路，保证可回放、不跳变）────────────────────

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

/**
 * 在句子的词块里定位「被标注为有问题的词」的下标。
 * 支持多词标注（如 wrongMark="you are" 表示语序问题）——返回命中的全部下标。
 * 返回空数组表示标注在句子里找不到（数据异常），该对比组不用于出改错题。
 */
const locateMarkedTokens = (tokens: string[], mark: string | null | undefined): number[] => {
  if (!mark || !mark.trim()) return [];
  const markWords = mark.trim().toLowerCase().split(/\s+/).filter(Boolean).map(cleanWord);
  if (markWords.length === 0) return [];
  const cleaned = tokens.map((token) => cleanWord(token).toLowerCase());
  // 单词语标注：直接找同形词
  if (markWords.length === 1) {
    const index = cleaned.indexOf(markWords[0]);
    return index >= 0 ? [index] : [];
  }
  // 多词标注：找连续片段（允许中间夹着别的词时退化为逐个命中）
  const start = cleaned.findIndex((_token, index) =>
    markWords.every((word, offset) => cleaned[index + offset] === word)
  );
  if (start >= 0) return markWords.map((_word, offset) => start + offset);
  return cleaned
    .map((token, index) => (markWords.includes(token) ? index : -1))
    .filter((index) => index >= 0);
};

/** 确定性打乱：种子化 PRNG，同一题每次进入顺序一致，但一定不等于原顺序。 */
const shuffleWithSeed = (tokens: string[], seed: string): string[] => {
  const random = mulberry32(hashText(seed));
  const arr = [...tokens];
  for (let index = arr.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [arr[index], arr[swap]] = [arr[swap], arr[index]];
  }
  if (arr.length > 1 && arr.every((value, index) => value === tokens[index])) {
    [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]];
  }
  return arr;
};

const splitWords = (sentence: string): string[] => sentence.split(/\s+/).filter(Boolean);

const cleanWord = (token: string): string => token.replace(/[.,!?;:]$/g, "");

/** 句子的「关键词」判定：长度 ≥3 且不是功能词（cloze 与干扰项都靠它）。 */
const FUNCTION_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "of", "to", "for", "with", "my", "your", "his", "her",
  "our", "their", "this", "that", "these", "those", "i", "you", "he", "she", "it", "we", "they", "is", "am", "are"
]);

const keywordIndexes = (sentence: string): number[] => {
  const words = splitWords(sentence);
  const indexes: number[] = [];
  words.forEach((word, index) => {
    const clean = cleanWord(word);
    if (clean.length >= 3 && !FUNCTION_WORDS.has(clean.toLowerCase())) indexes.push(index);
  });
  if (indexes.length === 0) indexes.push(Math.min(1, words.length - 1));
  return indexes;
};

/** 单空 cloze（选词填空）：优先抽本课语法承载词，退实词，最后回退第 2 词。 */
const buildCloze = (
  sentence: string,
  seed: string
): { clozeText: string; clozeAnswer: string; clozeOptions: string[] } => {
  const words = splitWords(sentence);
  const indexes = keywordIndexes(sentence);
  const random = mulberry32(hashText(`cloze:${seed}`));
  const pickedIndex = indexes[Math.floor(random() * indexes.length)] ?? Math.min(1, words.length - 1);
  const answer = cleanWord(words[pickedIndex] ?? "");
  const clozeWords = [...words];
  const lastChar = words[pickedIndex]?.slice(-1) ?? "";
  clozeWords[pickedIndex] = /[.?!]/.test(lastChar) ? `___${lastChar}` : "___";
  // 干扰项：同词族变形优先（-s/-es/-ed/-ing），不足用句内其他词，再不足用固定小词库。
  const lower = answer.toLowerCase();
  const candidates: string[] = [];
  for (const suffix of ["s", "es", "ed", "ing", "d"]) {
    const variant = `${lower}${suffix}`;
    if (variant !== lower && !candidates.includes(variant)) candidates.push(variant);
  }
  for (const word of words) {
    const clean = cleanWord(word);
    if (clean && clean.toLowerCase() !== lower && !candidates.includes(clean.toLowerCase())) {
      candidates.push(clean.toLowerCase());
    }
  }
  const options = [answer, ...candidates.slice(0, 3)];
  const optionRandom = mulberry32(hashText(`cloze-options:${seed}:${answer}`));
  for (let index = options.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(optionRandom() * (index + 1));
    [options[index], options[swap]] = [options[swap], options[index]];
  }
  return { clozeText: clozeWords.join(" "), clozeAnswer: answer, clozeOptions: options };
};

/** 阶梯提示：① 词数 + 首字母 ② 首字母序列 ③ 完整句。 */
export const buildRecallHints = (sentence: string): string[] => {
  const words = splitWords(sentence);
  const firstLetters = words.map((word) => cleanWord(word).charAt(0).toUpperCase() || "?").join(" ");
  const skeleton = words.map((word) => {
    const clean = cleanWord(word);
    const tail = word.slice(clean.length);
    return clean ? `${clean.charAt(0)}${"_".repeat(Math.max(0, clean.length - 1))}${tail}` : word;
  }).join(" ");
  return [
    `这句有 ${words.length} 个词，开头是「${cleanWord(words[0] ?? "").charAt(0)}」。`,
    `每个词的开头：${firstLetters}`,
    `差不多了，完整看一下：${skeleton}`
  ];
};

// ── 素材池：去重后的课程句子（档 1/2 的本地派生基础）──────────────────

type SentenceSource =
  | "target"
  | "variants"
  | "sceneSwings"
  | "practice"
  | "examples"
  | "dialogue"
  | "recall"
  | "blocks"
  /** 引导题（改错 / 选择 / 变形）——档 1 的题型多样性来源。 */
  | "guided"
  /** 由对比卡标注（wrongMark）派生的改错题——与 contrast 判断题区分命名空间，避免题源撞号。 */
  | "contrastSpot";

interface PooledSentence {
  en: string;
  zh: string;
  source: SentenceSource;
  index: number;
}

const poolOf = (lesson: GrammarLesson): PooledSentence[] => {
  const pool: PooledSentence[] = [];
  const push = (en: string | undefined, zh: string, source: SentenceSource, index: number) => {
    const sentence = (en ?? "").trim();
    if (!sentence || splitWords(sentence).length < 3) return;
    pool.push({ en: sentence, zh, source, index });
  };
  push(lesson.targetSentence, lesson.intentZh, "target", 0);
  (lesson.variants ?? []).forEach((variant, index) => push(variant.en, variant.zh, "variants", index));
  (lesson.sceneSwings ?? []).forEach((swing, index) => push(swing.en, swing.zh, "sceneSwings", index));
  lesson.practice.forEach((step, index) => push(step.answer, step.promptZh, "practice", index));
  lesson.examples.forEach((example, index) => push(example.en, example.zh, "examples", index));
  (lesson.dialogue ?? []).forEach((line, index) => push(line.en, line.zh, "dialogue", index));
  if (lesson.recall) push(lesson.recall.answer, lesson.recall.intentZh, "recall", 0);
  lesson.blocks.forEach((block, index) => push(block.text, "", "blocks", index));
  return pool;
};

/** 池内按来源去重（同一句只留首次出现的那条）。 */
const dedupePool = (pool: PooledSentence[]): PooledSentence[] => {
  const seen = new Set<string>();
  const result: PooledSentence[] = [];
  for (const sentence of pool) {
    const key = normalizeLessonSentence(sentence.en);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(sentence);
  }
  return result;
};

export const boostSourceRef = (lessonId: string, source: SentenceSource, index: number, tier: BoostTier): string =>
  `${lessonId}:t${tier}:${source}:${index}`;

/**
 * 未练优先排序（R-B17 复练换池的核心）：把「近 7 天没练过」的句子排在前面。
 *
 * 用排序而非硬过滤——池子被练完时题目仍然出得出来（复练不能因为「都练过」而空掉），
 * 但池子充足时选中的一定都是新句（PRD「第 2 次起换一批句」）。
 */
const unseenFirst = <T>(items: T[], refOf: (item: T) => string, seen: Set<string>): T[] => {
  const fresh: T[] = [];
  const repeated: T[] = [];
  for (const item of items) {
    (seen.has(refOf(item)) ? repeated : fresh).push(item);
  }
  return [...fresh, ...repeated];
};

// ── 复练换池：近 7 天已练句集合（R-B17）──────────────────────────────

const SEEN_WINDOW_DAYS = 7;

/** 近 7 天已练过的题源引用集合：复练时优先排除，避免同一课每次重进都是同一批题。 */
export const buildBoostSeenIndex = (data: AppData, days = SEEN_WINDOW_DAYS, now = Date.now()): Set<string> => {
  void data;
  const cutoff = now - days * 24 * 60 * 60 * 1000;
  const seen = new Set<string>();
  for (const event of listGrammarEventsByKind("grammar_boost_step_result") as GrammarBoostStepResultEvent[]) {
    const time = Date.parse(event.ts);
    if (!Number.isFinite(time) || time < cutoff) continue;
    seen.add(event.sourceRef);
  }
  return seen;
};

// ── 旧课点混题（螺旋 30–50%）────────────────────────────────────────

/**
 * 抽一个旧课的正误对比做混题（螺旋复习）。
 *
 * R-B15 弱点驱动：传入 weakSpotTag 时，**优先从旧课里找该罪名相关的错句**——
 * 让"混进来的旧课点"落在用户真实薄弱的语法点上，而不是随机回顾。
 * 找不到相关的再退回「最近 3 课」的通用策略（保证任何进度下都有题可出）。
 */
const pickReviewContrast = (
  lesson: GrammarLesson,
  seen: Set<string>,
  weakSpotTag: GrammarErrorTag | null = null
): BoostItem | null => {
  const olderLessons = grammarLessons
    .filter((item) => item.number < lesson.number && (item.contrast?.length ?? 0) > 0)
    .sort((a, b) => b.number - a.number);

  // ① 弱点优先：给每课算一个「与弱点相关度」分，相关度高的排前
  if (weakSpotTag) {
    const related = olderLessons
      .map((old) => ({ old, score: weakSpotRelevance(old, weakSpotTag) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || b.old.number - a.old.number);
    for (const { old } of related) {
      const picked = pickFirstUnseenContrast(old, lesson, seen, true);
      if (picked) return picked;
    }
  }

  // ② 通用降级：最近 3 课的可用对比组
  for (const old of olderLessons.slice(0, 3)) {
    const picked = pickFirstUnseenContrast(old, lesson, seen, false);
    if (picked) return picked;
  }
  return null;
};

/** 某课的旧课点与目标罪名的相关度：本课语法点命中 + 对比组里出现相关关键词。 */
const weakSpotRelevance = (lesson: GrammarLesson, tag: GrammarErrorTag): number => {
  const keywords = WEAK_SPOT_KEYWORDS[tag] ?? [];
  const haystack = [
    lesson.grammarLabel,
    lesson.title,
    lesson.oneLineRule,
    ...(lesson.contrast ?? []).map((contrast) => `${contrast.wrong} ${contrast.whyZh ?? ""}`)
  ].join(" ").toLowerCase();
  return keywords.filter((keyword) => haystack.includes(keyword)).length;
};

/**
 * 罪名的零术语关键词（用于把弱点映射到具体课程/错句）。
 * 词表刻意用「用户看得见的话」而不是术语——课程正文本身就是零术语写的。
 */
const WEAK_SPOT_KEYWORDS: Partial<Record<GrammarErrorTag, string[]>> = {
  tense: ["过去式", "昨天版", "过去", "yesterday", "was", "were", "went", "did"],
  sv_agreement: ["搭档", "他、她", "加 s", "he ", "she ", "it ", "has", "does"],
  missing_be: ["be 动词", "am", "is", "are", "丢", "少了一个"],
  article: ["a / an", "the", "冠词", "前面要有"],
  plural: ["复数", "两个以上", "加 s", "s 尾巴"],
  preposition: ["搭配", "介词", "in ", "on ", "at "],
  word_order: ["语序", "位置", "站错", "顺序"],
  verb_form: ["穿", "外套", "ing", "原样", "做过版"],
  fragment: ["缺", "句子塌", "没有动词", "主语"],
  run_on: ["because", "so", "连词"],
  comparison: ["比较", "更", "-er", "more"]
};

/** 取某课里第一个未练过的对比组（related=true 时标为弱点命中）。 */
const pickFirstUnseenContrast = (
  old: GrammarLesson,
  current: GrammarLesson,
  seen: Set<string>,
  related: boolean
): BoostItem | null => {
  for (const [index, contrast] of (old.contrast ?? []).entries()) {
    const sourceRef = `${old.id}:review:contrast:${index}`;
    if (seen.has(sourceRef)) continue;
    return {
      id: `boost-${current.id}-review-${old.id}-${index}`,
      kind: "contrast",
      promptZh: related
        ? "回头看一句你以前容易错的地方——这次还认得出来吗？"
        : "这一句，回头看还认得出来吗？",
      intentZh: "",
      answer: contrast.correct,
      explainZh: contrast.whyZh || old.oneLineRule,
      contrast: {
        sentence: contrast.wrong,
        isWrong: true,
        correct: contrast.correct,
        whyZh: contrast.whyZh,
        wrongMark: contrast.wrongMark ?? null
      },
      sourceRef,
      itemKind: "derived",
      fromReview: true,
      targetsWeakSpot: related
    };
  }
  return null;
};

// ── 档 1：再认一次（对比判断 ×3 + 单空填空 ×1–2，含 1 题旧课点）────────

/**
 * 档 1：再认一次——**题型轮转**，避免"连着四道都是这句有问题吗"的重复感。
 *
 * 做法：按题型各备一批候选（改错 / 正误对比 / 选词填空 / 选择·变形），
 * 然后按题型轮转取题（spot → contrast → cloze → choice），每种题型内部「未练过的排前」。
 * 这样既保证一次练习里题型不重样，复练时也能换到新题——而不是固定第一个槽位永远是同一道改错题。
 * （用户反馈：流程太重复——所以题型多样性是显式设计目标，不是顺带的。）
 */
const buildTierOne = (
  lesson: GrammarLesson,
  seen: Set<string>,
  round = 0,
  weakSpotTag: GrammarErrorTag | null = null
): BoostItem[] => {
  const candidates: Record<"spot" | "contrast" | "cloze" | "choice", BoostItem[]> = {
    spot: [],
    contrast: [],
    cloze: [],
    choice: []
  };

  // ── 改错候选（两类来源，合计每课平均 4.7 道，替代原先只有 1 道）──
  // ① guided.spot：课程自带的找错题（每课 1 道，自带 correctionZh 与 explain）
  const spotStep = lesson.guided?.find((step) => step.kind === "spot");
  if (spotStep?.tokens?.length && spotStep.wrongToken) {
    const wrongIndex = spotStep.tokens.findIndex((token) => token === spotStep.wrongToken);
    if (wrongIndex >= 0) {
      candidates.spot.push({
        id: `boost-${lesson.id}-t1-spot`,
        kind: "spot",
        promptZh: spotStep.promptZh || "这句里有一个词用错了——点出来。",
        intentZh: "",
        answer: spotStep.tokens.join(" "),
        explainZh: spotStep.explain || lesson.oneLineRule,
        spotTokens: spotStep.tokens,
        spotWrongIndex: wrongIndex,
        spotCorrectionZh: spotStep.correctionZh,
        sourceRef: boostSourceRef(lesson.id, "guided", 0, 1),
        itemKind: "derived",
        fromReview: false
      });
    }
  }
  // ② contrast + wrongMark：对比卡里已标注「哪个词/词组有问题」——
  //    直接就是改错题（全库 289 道可用，平均每课 3.7 道），比只用 guided.spot 丰富得多。
  (lesson.contrast ?? []).forEach((contrast, index) => {
    if (contrast.bothRight) return; // 双正解条没有"错"，不能出改错题
    const tokens = splitWords(contrast.wrong);
    const wrongIndexes = locateMarkedTokens(tokens, contrast.wrongMark);
    if (wrongIndexes.length === 0) return;
    candidates.spot.push({
      id: `boost-${lesson.id}-t1-spot-contrast-${index}`,
      kind: "spot",
      promptZh: "这句写错了——点出有问题的那个词。",
      intentZh: "",
      answer: contrast.correct,
      explainZh: contrast.whyZh?.trim() || lesson.oneLineRule,
      spotTokens: tokens,
      spotWrongIndex: wrongIndexes[0],
      /** 多词标注（如 "you are" 语序问题）时，点中任一组成词都算对。 */
      spotWrongIndexes: wrongIndexes,
      spotCorrectionZh: `这句应该是：${contrast.correct}`,
      sourceRef: boostSourceRef(lesson.id, "contrastSpot", index, 1),
      itemKind: "derived",
      fromReview: false
    });
  });

  // ── 正误对比候选：至多 4 组 ──
  (lesson.contrast ?? []).slice(0, 4).forEach((contrast, index) => {
    candidates.contrast.push({
      id: `boost-${lesson.id}-t1-contrast-${index}`,
      kind: "contrast",
      promptZh: index === 0 ? "这句话，你觉得有问题吗？" : "再看一句——这句呢？",
      intentZh: "",
      answer: contrast.correct,
      explainZh: contrast.whyZh || lesson.oneLineRule,
      contrast: {
        sentence: contrast.wrong,
        isWrong: true,
        correct: contrast.correct,
        whyZh: contrast.whyZh,
        wrongMark: contrast.wrongMark ?? null
      },
      sourceRef: boostSourceRef(lesson.id, "target", index, 1),
      itemKind: "derived",
      fromReview: false
    });
  });

  // ── 选词填空候选：变体/例句/实践句/场景变奏 ──
  const pool = dedupePool(poolOf(lesson)).filter(
    (sentence) => sentence.source !== "target" && sentence.source !== "blocks"
  );
  for (const sentence of pool) {
    const sourceRef = boostSourceRef(lesson.id, sentence.source, sentence.index, 1);
    const cloze = buildCloze(sentence.en, sourceRef);
    candidates.cloze.push({
      id: `boost-${lesson.id}-t1-cloze-${sentence.source}-${sentence.index}`,
      kind: "cloze",
      promptZh: "补上这句话缺的那个词。",
      intentZh: sentence.zh,
      answer: sentence.en,
      explainZh: sentenceExplanationFor(lesson, sentence),
      clozeText: cloze.clozeText,
      clozeAnswer: cloze.clozeAnswer,
      clozeOptions: cloze.clozeOptions,
      sourceRef,
      itemKind: "derived",
      fromReview: false
    });
  }

  // ── 选择 / 变形候选：变形（换主语后动词怎么变）更接近真实使用，优先 ──
  const replaceStep = lesson.guided?.find((step) => step.kind === "replace" && step.options?.length);
  if (replaceStep) {
    candidates.choice.push({
      id: `boost-${lesson.id}-t1-replace`,
      kind: "replace",
      promptZh: replaceStep.promptZh,
      intentZh: replaceStep.replaceTarget ?? "",
      answer: replaceStep.answer,
      explainZh: replaceStep.explain || lesson.oneLineRule,
      options: replaceStep.options,
      replaceBase: replaceStep.replaceBase,
      replaceTarget: replaceStep.replaceTarget,
      sourceRef: boostSourceRef(lesson.id, "guided", 1, 1),
      itemKind: "derived",
      fromReview: false
    });
  }
  const chooseStep = lesson.guided?.find((step) => step.kind === "choose" && step.options?.length);
  if (chooseStep) {
    candidates.choice.push({
      id: `boost-${lesson.id}-t1-choose`,
      kind: "choose",
      promptZh: chooseStep.promptZh,
      intentZh: "",
      answer: chooseStep.answer,
      explainZh: chooseStep.explain || lesson.oneLineRule,
      options: chooseStep.options,
      chooseBefore: chooseStep.before,
      chooseAfter: chooseStep.after,
      sourceRef: boostSourceRef(lesson.id, "guided", 2, 1),
      itemKind: "derived",
      fromReview: false
    });
  }

  // ── 按题型轮转取题；题型内「未练过的排前」，已被练过的留在队尾（池子练完仍出得来题）──
  // 复练时把题型顺序整体轮转，避免每次都从同一题型开头（重复感）。
  const baseSlots: Array<keyof typeof candidates> = ["spot", "contrast", "cloze", "choice"];
  const rotation = ((round % baseSlots.length) + baseSlots.length) % baseSlots.length;
  const slots = [...baseSlots.slice(rotation), ...baseSlots.slice(0, rotation)];
  const items: BoostItem[] = [];
  const usedIds = new Set<string>();
  for (const slot of slots) {
    if (items.length >= 4) break;
    const ordered = unseenFirst(candidates[slot], (item) => item.sourceRef, seen);
    const picked = ordered.find((item) => !usedIds.has(item.id));
    if (!picked) continue;
    usedIds.add(picked.id);
    items.push(picked);
  }
  // 题型交错重排：保证相邻题不同型（改错 ×2、对比、填空、选择 混排）
  const interleaved: BoostItem[] = [];
  const remaining = [...items];
  while (remaining.length > 0) {
    const previousKind = interleaved[interleaved.length - 1]?.kind;
    const pickIndex = remaining.findIndex((item) => item.kind !== previousKind);
    const [picked] = remaining.splice(pickIndex >= 0 ? pickIndex : 0, 1);
    interleaved.push(picked);
  }
  // 槽位不足（某课缺某类素材）时，用剩余候选补满
  if (interleaved.length < 4) {
    const rest = unseenFirst(
      slots.flatMap((slot) => candidates[slot]).filter((item) => !usedIds.has(item.id)),
      (item) => item.sourceRef,
      seen
    );
    for (const item of rest) {
      if (interleaved.length >= 4) break;
      usedIds.add(item.id);
      interleaved.push(item);
    }
  }
  // 弱点混题（R-B15）：命中弱点时**替换最后一道**（而不是只在缺题时补位）——
  // 只在补位时才出现的话，素材齐备的课永远轮不到弱点题，弱点驱动就形同虚设。
  const weakReview = pickReviewContrast(lesson, seen, weakSpotTag);
  if (weakReview && weakReview.targetsWeakSpot && interleaved.length >= 4) {
    interleaved[interleaved.length - 1] = weakReview;
  } else if (weakReview && interleaved.length < 4) {
    interleaved.push(weakReview);
  }

  return interleaved.slice(0, 4);
};

/**
 * 句子级讲解来源：只有「对比卡的正确句 == 这一句」时，才认为该讲解与这句相关。
 *
 * 曾用关键词包含匹配（wrongMark 出现在句子里就算命中），结果把无关讲解配到了别的句子
 * （例：答案是 "What are you doing?" 却配上「he 是单数，搭档是 is」）——
 * 讲错比不讲更糟，所以这里改成严格相等；配不上就退回本课一句话规则（永远正确、只是更泛）。
 */
const sentenceExplanationFor = (lesson: GrammarLesson, sentence: PooledSentence): string => {
  const normalized = normalizeLessonSentence(sentence.en);
  const exact = (lesson.contrast ?? []).find((contrast) => normalizeLessonSentence(contrast.correct) === normalized);
  return exact?.whyZh?.trim() || lesson.oneLineRule;
};

/** recall 的讲解来源：本课「忆」段自带的 noteZh 最贴题，退回一句话规则。 */
const recallExplanationFor = (lesson: GrammarLesson, sentence: PooledSentence): string => {
  if (sentence.source === "recall" && lesson.recall?.noteZh?.trim()) return lesson.recall.noteZh.trim();
  return lesson.oneLineRule;
};

// ── 档 2：自己想（题型交错：中文→整句 / 词块重组 / 点词成句）──────────────
//
// 交错而不是同类堆在一起（用户反馈「流程太重复」；交错练习本身也比成块练习更利于保持）。
// 取题顺序固定为 recall → rebuild → recall → rebuild → arrange，每类内部「未练过的排前」。

const buildTierTwo = (
  lesson: GrammarLesson,
  seen: Set<string>,
  weakSpotTag: GrammarErrorTag | null = null
): BoostItem[] => {
  const pool = dedupePool(poolOf(lesson));
  const candidates: Record<"recall" | "rebuild" | "arrange", BoostItem[]> = { recall: [], rebuild: [], arrange: [] };

  // ── 中文 → 整句（阶梯提示）：核心句 + recall 句（本课要能说出来的两个锚点）──
  const recallPool = pool.filter(
    (sentence) => (sentence.source === "target" || sentence.source === "recall") && sentence.zh.trim()
  );
  for (const sentence of recallPool) {
    candidates.recall.push({
      id: `boost-${lesson.id}-t2-recall-${sentence.source}-${sentence.index}`,
      kind: "recall",
      promptZh: "看着中文，把这句话写出来（想不起来可以要提示）。",
      intentZh: sentence.zh,
      answer: sentence.en,
      explainZh: recallExplanationFor(lesson, sentence),
      hints: buildRecallHints(sentence.en),
      sourceRef: boostSourceRef(lesson.id, sentence.source, sentence.index, 2),
      itemKind: "derived",
      fromReview: false
    });
  }

  // ── 词块重组：变体 → 场景变奏 → 实践句 → 例句 ──
  const rebuildPool = pool.filter((sentence) => sentence.source !== "target" && sentence.source !== "recall");
  for (const sentence of rebuildPool) {
    const sourceRef = boostSourceRef(lesson.id, sentence.source, sentence.index, 2);
    candidates.rebuild.push({
      id: `boost-${lesson.id}-t2-rebuild-${sentence.source}-${sentence.index}`,
      kind: "rebuild",
      promptZh: "把这些词块按顺序点回去。",
      intentZh: sentence.zh,
      answer: sentence.en,
      explainZh: sentenceExplanationFor(lesson, sentence),
      tokens: shuffleWithSeed(splitWords(sentence.en), sourceRef),
      sourceRef,
      itemKind: "derived",
      fromReview: false
    });
  }

  // ── 点词成句（带干扰项）：用**全部**带干扰项的 practice 题 ──
  // 原先只取 .find() 的第一道，浪费了每课平均 2.9 道的素材（档 2 是复练深度最薄的一档）。
  lesson.practice.forEach((practiceStep, index) => {
    if ((practiceStep.distractors?.length ?? 0) === 0) return;
    const sourceRef = boostSourceRef(lesson.id, "practice", index, 2);
    const tokens = [...practiceStep.tokens];
    const answerWords = new Set(tokens.map((token) => cleanWord(token).toLowerCase()));
    const distractors = (practiceStep.distractors ?? [])
      .filter((token) => !answerWords.has(cleanWord(token).toLowerCase()))
      .slice(0, 2);
    candidates.arrange.push({
      id: `boost-${lesson.id}-t2-arrange-${index}`,
      kind: "arrange",
      promptZh: "这一题多了两个没用的词块，别被它们骗了。",
      intentZh: practiceStep.promptZh,
      answer: practiceStep.answer,
      explainZh: lesson.oneLineRule,
      tokens: shuffleWithSeed([...tokens, ...distractors], sourceRef),
      sourceRef,
      itemKind: "derived",
      fromReview: false
    });
  });

  // ── 动态交错取题：每步都挑「与上一题不同、且还有余量」的题型（每类内部未练过的排前）──
  // 不用固定槽位表——某课某类素材只有 1 条时会空槽，固定表会留下相邻同类题（重复感回归）。
  const ordered: Record<keyof typeof candidates, BoostItem[]> = {
    recall: unseenFirst(candidates.recall, (item) => item.sourceRef, seen),
    rebuild: unseenFirst(candidates.rebuild, (item) => item.sourceRef, seen),
    arrange: unseenFirst(candidates.arrange, (item) => item.sourceRef, seen)
  };
  const cursors: Record<keyof typeof candidates, number> = { recall: 0, rebuild: 0, arrange: 0 };
  const items: BoostItem[] = [];
  const usedIds = new Set<string>();
  const nextOf = (kind: keyof typeof candidates): BoostItem | null => {
    while (cursors[kind] < ordered[kind].length) {
      const candidate = ordered[kind][cursors[kind]];
      cursors[kind] += 1;
      if (usedIds.has(candidate.id)) continue;
      return candidate;
    }
    return null;
  };
  // ① 先保证三种题型各出现一次（跑一遍覆盖）：否则素材多的题型会吃满所有槽位，
  //    把「中文→整句」这类题挤掉——它恰恰是档 2 的起点题（回归：扩 arrange 素材后 recall 曾完全消失）。
  for (const kind of ["recall", "rebuild", "arrange"] as Array<keyof typeof candidates>) {
    if (items.length >= 5) break;
    const picked = nextOf(kind);
    if (!picked) continue;
    usedIds.add(picked.id);
    items.push(picked);
  }
  // ② 余下槽位按「与上一题不同 → 素材多的优先消耗」逐题补
  while (items.length < 5) {
    const previousKind = items[items.length - 1]?.kind as keyof typeof candidates | undefined;
    const remaining = (kind: keyof typeof candidates) => ordered[kind].length - cursors[kind];
    const kinds = (Object.keys(candidates) as Array<keyof typeof candidates>).sort((a, b) => {
      // 相邻同类题是「重复感」的主要来源，优先避开
      if (a === previousKind && b !== previousKind) return 1;
      if (b === previousKind && a !== previousKind) return -1;
      // 素材多的优先消耗，避免尾巴连续同型
      return remaining(b) - remaining(a);
    });
    let picked: BoostItem | null = null;
    for (const kind of kinds) {
      picked = nextOf(kind);
      if (picked) break;
    }
    if (!picked) break;
    usedIds.add(picked.id);
    items.push(picked);
  }
  // 弱点混题（R-B15）：命中弱点时替换最后一道，否则仅在缺题时补位
  const weakReview = pickReviewContrast(lesson, seen, weakSpotTag);
  const tagged = weakReview ? { ...weakReview, id: `${weakReview.id}-t2` } : null;
  if (tagged && tagged.targetsWeakSpot && items.length >= 5) {
    items[items.length - 1] = tagged;
  } else if (tagged && items.length < 5) {
    items.push(tagged);
  }

  return items.slice(0, 5);
};

// ── 档 3：换你来说（三种任务：无提示产出 / 变式产出 / 自己改错）────────────
//
// 三种任务的认知目标一致（都得自己完整写出句子），但**任务形态不同**——
// 用户反馈「档 3 三题都是同一件事」。素材全部来自课程数据：
//   produce = targetSentence / recall 句；variant = variants（否定/疑问，自带 noteZh 讲法）；
//   fix = contrast（给错句让用户写正确句，是「改错」的产出形态）。
// 题型按 produce → variant → fix 交错，缺哪类就用其余补齐。

const buildTierThree = (
  lesson: GrammarLesson,
  seen: Set<string>,
  weakSpotTag: GrammarErrorTag | null = null
): BoostItem[] => {
  const pool = dedupePool(poolOf(lesson));
  const candidates: Record<"produce" | "variant" | "fix", BoostItem[]> = { produce: [], variant: [], fix: [] };

  // ── 无提示产出：核心句 + recall 句（本课「必须能自己说出来」的锚点）──
  const anchorPool = pool.filter(
    (sentence) => (sentence.source === "target" || sentence.source === "recall") && sentence.zh.trim()
  );
  for (const sentence of anchorPool) {
    candidates.produce.push({
      id: `boost-${lesson.id}-t3-produce-${sentence.source}-${sentence.index}`,
      kind: "produce",
      promptZh: "不给提示了——照着中文，把这句话自己写出来。",
      intentZh: sentence.zh,
      answer: sentence.en,
      explainZh: sentence.source === "recall" ? (lesson.recall?.noteZh ?? lesson.oneLineRule) : lesson.oneLineRule,
      sourceRef: boostSourceRef(lesson.id, sentence.source, sentence.index, 3),
      itemKind: "derived",
      fromReview: false
    });
  }

  // ── 变式产出：给一个已知版本，要用户写出另一个版本（否定 / 疑问）──
  // 讲法用 variants 自带的 noteZh（课内已写好的「怎么变」说明），比 oneLineRule 更贴题。
  const variants = lesson.variants ?? [];
  const shapedVersions = variants.filter((variant) => variant.label !== "肯定" && variant.en.trim() && variant.zh.trim());
  for (const target of shapedVersions) {
    // 样例句：优先用肯定句（说同一件事的另一面），没有就用核心句
    const known = variants.find((variant) => variant.label === "肯定")?.en?.trim() || lesson.targetSentence;
    if (!known || normalizeLessonSentence(known) === normalizeLessonSentence(target.en)) continue;
    candidates.variant.push({
      id: `boost-${lesson.id}-t3-variant-${target.label}`,
      kind: "variant",
      promptZh: `这句话还能换个说法——把它说成「${target.label}」的样子。`,
      intentZh: target.zh,
      answer: target.en,
      explainZh: target.noteZh?.trim() || lesson.oneLineRule,
      shapedFrom: known,
      shapedLabel: `已知：肯定句「${known}」`,
      sourceRef: boostSourceRef(lesson.id, "variants", variants.indexOf(target), 3),
      itemKind: "derived",
      fromReview: false
    });
  }

  // ── 自己改错：给错句，让用户写出正确句（产出形态的改错）──
  // 与档 1 的 spot（点出哪个词错）不同：这里要用户从零写出整句，难度更高、也更接近真实修改。
  for (const [index, contrast] of (lesson.contrast ?? []).entries()) {
    if (!contrast.wrong.trim() || !contrast.correct.trim()) continue;
    if (normalizeLessonSentence(contrast.wrong) === normalizeLessonSentence(contrast.correct)) continue;
    candidates.fix.push({
      id: `boost-${lesson.id}-t3-fix-${index}`,
      kind: "fix",
      promptZh: "这句写错了——请你把它改对，整句写出来。",
      intentZh: "",
      answer: contrast.correct,
      explainZh: contrast.whyZh?.trim() || lesson.oneLineRule,
      shapedFrom: contrast.wrong,
      shapedLabel: "这句有问题",
      sourceRef: boostSourceRef(lesson.id, "target", index, 3),
      itemKind: "derived",
      fromReview: false
    });
  }

  // ── 交错取题：produce → variant → fix 顺序轮转（各类内部未练过的排前）──
  const ordered: Record<keyof typeof candidates, BoostItem[]> = {
    produce: unseenFirst(candidates.produce, (item) => item.sourceRef, seen),
    variant: unseenFirst(candidates.variant, (item) => item.sourceRef, seen),
    fix: unseenFirst(candidates.fix, (item) => item.sourceRef, seen)
  };
  const cursors: Record<keyof typeof candidates, number> = { produce: 0, variant: 0, fix: 0 };
  const items: BoostItem[] = [];
  const usedIds = new Set<string>();
  const nextOf = (kind: keyof typeof candidates): BoostItem | null => {
    while (cursors[kind] < ordered[kind].length) {
      const candidate = ordered[kind][cursors[kind]];
      cursors[kind] += 1;
      if (usedIds.has(candidate.id)) continue;
      return candidate;
    }
    return null;
  };
  // 首选顺序：produce（最基础）→ variant（换口气）→ fix（改错）；缺位时按剩余素材补
  for (const kind of ["produce", "variant", "fix"] as Array<keyof typeof candidates>) {
    if (items.length >= 3) break;
    const picked = nextOf(kind);
    if (!picked) continue;
    usedIds.add(picked.id);
    items.push(picked);
  }
  while (items.length < 3) {
    const kinds = Object.keys(candidates) as Array<keyof typeof candidates>;
    const previousKind = items[items.length - 1]?.kind as keyof typeof candidates | undefined;
    kinds.sort((a, b) => {
      if (a === previousKind && b !== previousKind) return 1;
      if (b === previousKind && a !== previousKind) return -1;
      return (ordered[b].length - cursors[b]) - (ordered[a].length - cursors[a]);
    });
    let picked: BoostItem | null = null;
    for (const kind of kinds) {
      picked = nextOf(kind);
      if (picked) break;
    }
    if (!picked) break;
    usedIds.add(picked.id);
    items.push(picked);
  }

  return items.slice(0, 3);
};


// ── 对外：按档出题 ─────────────────────────────────────────────────

export interface BuildBoostOptions {
  /** 近 7 天已练题源（复练换池用）；不传则不改池。 */
  seen?: Set<string>;
  /** 这一档已练过几轮（复练时轮转题型顺序；不传按 0 轮）。 */
  round?: number;
  /**
   * 弱点驱动的混题（R-B15）：用户当前最弱的罪名。
   * 传入后，旧课点混题会**优先抽该罪名相关的错句**——让练习针对真实短板，而不是随机回顾。
   */
  weakSpotTag?: GrammarErrorTag | null;
}

export const buildBoostItems = (
  lessonId: string,
  tier: BoostTier,
  options: BuildBoostOptions = {}
): BoostItem[] => {
  const lesson = GRAMMAR_LESSON_BY_ID.get(lessonId);
  if (!lesson) return [];
  const seen = options.seen ?? new Set<string>();
  const round = Math.max(0, options.round ?? 0);
  const weakSpotTag = options.weakSpotTag ?? null;
  if (tier === 1) return buildTierOne(lesson, seen, round, weakSpotTag);
  if (tier === 2) return buildTierTwo(lesson, seen, weakSpotTag);
  return buildTierThree(lesson, seen, weakSpotTag);
};

// ── 判题（确定性规则；AI 不参与判分——PRD Non-goal 5）────────────────

/** 对比判断：用户选「有问题 / 没问题」是否与该句的真实状态一致。 */
export const judgeBoostContrast = (item: BoostItem, pickedProblem: boolean): boolean => {
  if (!item.contrast) return false;
  return pickedProblem === item.contrast.isWrong;
};

/** 单空填空：大小写宽容。 */
export const judgeBoostCloze = (item: BoostItem, picked: string): boolean =>
  picked.trim().toLowerCase() === (item.clozeAnswer ?? "").trim().toLowerCase();

/**
 * 改错：点中的词块是否为那一处错（与课内 spot 同口径——点中下标即通过）。
 * 多词标注（wrongMark="you are" 这类语序问题）时，点中组成词的任一都算对。
 */
export const judgeBoostSpot = (item: BoostItem, pickedTokenIndex: number): boolean => {
  const accepted = item.spotWrongIndexes?.length ? item.spotWrongIndexes : item.spotWrongIndex !== undefined ? [item.spotWrongIndex] : [];
  return accepted.includes(pickedTokenIndex);
};

/** 选择 / 变形：选项文字比对（大小写宽容）。 */
export const judgeBoostChoice = (item: BoostItem, picked: string): boolean =>
  picked.trim().toLowerCase() === item.answer.trim().toLowerCase();

/** 词块排序（rebuild / arrange）：顺序与内容都对，标点大小写宽容。 */
export const judgeBoostTokens = (item: BoostItem, built: string[]): boolean =>
  normalizeLessonSentence(built.join(" ")) === normalizeLessonSentence(item.answer);

/**
 * 点词成句的判题门槛：摆满「答案词数」就该判题——**不是词块库总数**。
 * 带干扰项的题（arrange）两者不等：等总数会让用户拼对正确答案也永远不结算。
 * 与课内点词成句同口径（GrammarLessonPage 的 answerWordCount）。
 */
export const boostArrangeAnswerLength = (item: BoostItem): number =>
  item.answer.split(/\s+/).filter(Boolean).length;

/** 中文→整句（有提示）：通过线 70，返回分数供提示梯度使用。 */
export const judgeBoostRecall = (item: BoostItem, input: string): { passed: boolean; score: number } => {
  const score = diffScore(compareText(item.answer, input, false));
  return { passed: score >= BOOST_RECALL_PASS_SCORE, score };
};

/** 无提示整句产出：通过线 90。 */
export const judgeBoostProduce = (item: BoostItem, input: string): { passed: boolean; score: number } => {
  const score = diffScore(compareText(item.answer, input, false));
  return { passed: score >= BOOST_PRODUCE_PASS_SCORE, score };
};

export const judgeBoostItem = (
  item: BoostItem,
  answer: { pickedProblem?: boolean; text?: string; tokens?: string[]; tokenIndex?: number }
): { passed: boolean; score?: number } => {
  switch (item.kind) {
    case "contrast":
      return { passed: judgeBoostContrast(item, Boolean(answer.pickedProblem)) };
    case "spot":
      return { passed: judgeBoostSpot(item, answer.tokenIndex ?? -1) };
    case "cloze":
      return { passed: judgeBoostCloze(item, answer.text ?? "") };
    case "choose":
    case "replace":
      return { passed: judgeBoostChoice(item, answer.text ?? "") };
    case "rebuild":
    case "arrange":
      return { passed: judgeBoostTokens(item, answer.tokens ?? []) };
    case "recall":
      return judgeBoostRecall(item, answer.text ?? "");
    case "produce":
    case "variant":
    case "fix":
    case "free":
      // 三类产出任务共用 90 分线：都得自己完整写出句子
      return judgeBoostProduce(item, answer.text ?? "");
    default:
      return { passed: false };
  }
};

// ── 完成态（R-B1 读写）──────────────────────────────────────────────

/** 读取某课已完成的档位集合。 */
export const getLessonBoostTiersDone = (data: AppData, lessonId: string): Set<number> =>
  new Set(data.grammarBoostsDone?.[lessonId] ?? []);

export const isLessonBoostTierDone = (data: AppData, lessonId: string, tier: BoostTier): boolean =>
  getLessonBoostTiersDone(data, lessonId).has(tier);

/** 标记某档完成（幂等，不可变）。语义 = 至少完成过一次；复练不改写。 */
export const markBoostTierDone = (data: AppData, lessonId: string, tier: BoostTier): AppData => {
  if (!GRAMMAR_LESSON_BY_ID.has(lessonId)) return data;
  const current = getLessonBoostTiersDone(data, lessonId);
  if (current.has(tier)) return data;
  const next = { ...(data.grammarBoostsDone ?? {}) };
  next[lessonId] = [...current, tier].sort((a, b) => a - b);
  return { ...data, grammarBoostsDone: next };
};

/** 某一课下一档建议（未完成的最小档；三档都完成则回到档 1 做复练）。 */
export const suggestBoostTier = (data: AppData, lessonId: string): BoostTier => {
  const done = getLessonBoostTiersDone(data, lessonId);
  for (const tier of BOOST_TIERS) {
    if (!done.has(tier)) return tier;
  }
  return 1;
};

/** 档位完成的微进度文案（"练到第 2 档"）——制造未完成张力，但不用红色/徽章施压。 */
export const boostProgressLabel = (data: AppData, lessonId: string): string | null => {
  const done = getLessonBoostTiersDone(data, lessonId);
  if (done.size === 0) return null;
  if (done.size >= 3) return "三档都走过了";
  const maxDone = Math.max(...done);
  return `练到第 ${maxDone} 档`;
};

// ── 弱点驱动选题（R-B15）：档 2/3 优先取弱点罪名相关的旧课点 ──────────────

/** 弱点点相关：当前活跃弱点 Top1 的罪名（供 AI 变式题与提示语使用）。 */
export const currentWeakSpotTag = (data: AppData) => computeWeakSpots(data)[0]?.tag ?? null;

/**
 * 是否为「某课可练」：关 1 完成即可（强化训练不设额外解锁——PRD §4.2）。
 * 未学完的课不给入口（否则等于绕开正课）。
 */
export const canBoostLesson = (data: AppData, lessonId: string): boolean =>
  (data.grammarLessonsDone ?? []).includes(lessonId);
