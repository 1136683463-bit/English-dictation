import type { AppData, GrammarErrorTag, GrammarLesson } from "../types";
import { GRAMMAR_LESSON_BY_ID, grammarLessons } from "../data/grammarLessons";
import { compareText, diffScore, tokenSequencesEquivalent } from "./diffService";
import { computeWeakSpots } from "./grammarWeakSpotsService";
import { normalizeLessonSentence } from "./lessonService";
import { explainForSentence, resolveGuidedExplain } from "./grammarExplainService";
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
  /** 双正解判断：给两句都对的说法（如 that 可省/不可省），问用户「这两句都对吗」。
   *  素材是 contrast 里的 bothRight 条（全库 221 条，此前完全没进过任何练习）。 */
  | "bothright"
  /**
   * 听力：播放一句（本课的正确句），让用户选出「听到的是哪句」。
   * 干扰项是同一对比卡里的错误句——两句只在**本课语法点**上不同，
   * 所以答对必须听出那个特征（这是此前全库完全缺失的能力维度：
   * 有 TTS 基础设施与 660 组句对素材，却一道听力题都没有）。
   */
  | "listen"
  /**
   * 翻译：给中文意思，写出英文整句。
   * 素材优先取**从未用于任何练习**的 examples / sceneSwings 句（全库约 300 句），
   * 所以它是真正的新题，而不是把课内练过的句子再问一遍。
   */
  | "translate"
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
  /**
   * bothright：一对都成立的说法（对照，用于「两句都对吗」题）。
   * 与 contrast 的区别：contrast 是「一对一错」，bothright 是「两句都对」。
   */
  correctPair?: { first: string; second: string };
  /**
   * listen：要播放的音频文本 + 供选择的两个文本（其一为正确答案）。
   * `answer` 与 listenOptions 中的正确项一致。
   */
  listenText?: string;
  listenOptions?: string[];
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
 *
 * `correctSentence`（可选但出改错题时必传，2026-09-21 加）：
 * 标注词在句中出现多次时，「第一个同形词」往往**不是**真正的错处——
 *   L66 `It is too heavy to carry it.` 标注 `it.`：句首 `It` 与句尾多余的 `it.` 同形，
 *   取首个会指向并无问题的 `It`，用户点真正该删的句尾 `it.` 反被判错；
 *   L170 `She can both sing and dance both.` 标注 `both.` 同款（真错处是句尾那个）。
 * 传了正确句就按「与正确句逐位不同的位置」筛候选，命中的直接就是真实错处。
 */
export const locateMarkedTokens = (
  tokens: string[],
  mark: string | null | undefined,
  correctSentence?: string
): number[] => {
  if (!mark || !mark.trim()) return [];
  const markWords = mark.trim().toLowerCase().split(/\s+/).filter(Boolean).map(cleanWord);
  if (markWords.length === 0) return [];
  const cleaned = tokens.map((token) => cleanWord(token).toLowerCase());
  /** 多个同形候选时，用正确句消歧；无法消歧（或只有一个候选）时原样返回。 */
  const disambiguate = (hits: number[]): number[] => {
    if (hits.length <= 1 || !correctSentence) return hits;
    // 必须与 cleaned 同口径（去标点 + 转小写）：否则句首大写会把「It」与「it」
    // 判成不同，消歧结果里混进本没有问题的那个词。
    const correctTokens = correctSentence.split(/\s+/).filter(Boolean).map((token) => cleanWord(token).toLowerCase());
    /**
     * 判定某个下标是否为「真实错处」。两种错法都要覆盖：
     *   ① 替换型（同长度）：该位词形与正确句不同。
     *   ② 增删型（长度不同）：正确句在该下标处**没有对应词**（多出来/少了一个词）——
     *      例 L170 `... and dance both.` 的正确句到 `dance` 就结束了，
     *      句尾多出的 `both.` 在正确句里没有对应位，正是要删的那个。
     *      若只比词形，这种「多出来的词」会因为拿不到 counterpart 而被漏掉，
     *      于是退回首个同形词（句中那个正常的 both），判题又错了。
     */
    const isErrorIndex = (index: number): boolean => {
      const right = correctTokens[index];
      // 正确句在该位没有词 ⇒ 这是「多出来/少掉」的那处（增删型错误）
      if (right === undefined) return true;
      return right !== cleaned[index];
    };
    const differing = hits.filter(isErrorIndex);
    return differing.length > 0 ? differing : hits;
  };
  // 单词语标注：直接找同形词（可能有多个）
  // 导出此函数供回归测试直测：歧义句未必被档位取样选中，只有直测才能稳定覆盖。
  if (markWords.length === 1) {
    const hits = cleaned
      .map((token, index) => (token === markWords[0] ? index : -1))
      .filter((index) => index >= 0);
    // 没有正确句可消歧时，保持原行为（只认首个同形词）——
    // 否则「点任意一个同形词都算对」，判题会比修复前更松。
    if (!correctSentence) return hits.length > 0 ? [hits[0]] : [];
    return disambiguate(hits);
  }
  // 多词标注：找连续片段（允许中间夹着别的词时退化为逐个命中）
  const start = cleaned.findIndex((_token, index) =>
    markWords.every((word, offset) => cleaned[index + offset] === word)
  );
  if (start >= 0) return disambiguate(markWords.map((_word, offset) => start + offset));
  return disambiguate(
    cleaned.map((token, index) => (markWords.includes(token) ? index : -1)).filter((index) => index >= 0)
  );
};

/**
 * 从「点对之后给出的纠正说法」里取出改对后的整句（2026-09-21 加）。
 *
 * 数据格式多样：「把 is 换成 am：I am Xiaomei。」「在 school 前面垫一个 to：I go to school。」
 * 「because 和 so 只留一个：Because it was cold, I stayed at home。」——
 * 共同点是**末段冒号后是英文整句**。
 *
 * 收尾标点：数据常用中文顿号收尾（`。`），英文句自己的 `.` 会被一并剥掉。
 * `fallbackEnding` 传入原句的收尾标点，剥掉后按它补回——
 * 否则确认行会显示「I am Xiaomei」（少一个句号），与课内其它位置展示的同一句不一致。
 * 取不到整句（单字答案，如「月份名字要抬头：May。」）时返回 null，由调用方决定退回什么。
 */
const correctedSentenceOf = (
  correctionZh: string | undefined,
  fallbackEnding = "."
): string | null => {
  if (!correctionZh) return null;
  const segments = correctionZh.split(/[：:]/).map((part) => part.trim()).filter(Boolean);
  const raw = (segments[segments.length - 1] ?? "").replace(/[。！？]+$/, "").trim();
  // 「英文整句」的判据：至少两个含字母的词（单词答案不是句子，句层没有可展示的修正版）
  const words = raw.split(/\s+/).filter((word) => /[a-zA-Z]/.test(word));
  if (words.length < 2) return null;
  return /[.!?]$/.test(raw) ? raw : `${raw}${fallbackEnding}`;
};

/** 取句子的收尾标点（给 correctedSentenceOf 还原英文句号用）。 */
const endingOf = (tokens: string[] | undefined): string =>
  /([.!?])$/.exec(tokens?.[tokens.length - 1] ?? "")?.[1] ?? ".";

/**
 * 从同课对比卡里找「题面这句话的正确版本」（2026-09-21 加）。
 *
 * 少数课的 `correctionZh` 只写了一个词（「月份名字要抬头：May。」），
 * 从它取不出整句；但同一课的 `contrast` 里往往正好有「错句 → 正确句」这一对
 * （如 L56 的 `My birthday is in may.` → `My birthday is in May.`）。
 * 用归一化文本比对（忽略大小写与标点）来认这一对，命中即返回正确句。
 */
const correctedFromContrast = (
  lesson: GrammarLesson,
  tokens: string[]
): string | null => {
  const target = normalizeLessonSentence(tokens.join(" "));
  if (!target) return null;
  const hit = (lesson.contrast ?? []).find(
    (item) => !item.bothRight && normalizeLessonSentence(item.wrong) === target && item.correct.trim()
  );
  return hit ? hit.correct.trim() : null;
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
  /**
   * 挖空时保留该词自带的标点（2026-09-21 修）。
   *
   * 此前只保留 `[.?!]`：被挖的词后面若跟着逗号（`After I do my homework, I don't watch TV.`
   * 挖 homework），逗号会被整块吞掉，题面回填后变成
   * 「After I do my homework I don't watch TV.」——与判分基准 answer 不一致，
   * 用户按题面拼出的句子和反馈里展示的标准句差一个逗号。
   * 现在把「词尾标点」整体带上（`,` `;` `:` 等与 `.?!` 同口径）。
   */
  const trailingMarks = /([.,;:!?]+)$/.exec(words[pickedIndex] ?? "")?.[1] ?? "";
  clozeWords[pickedIndex] = trailingMarks ? `___${trailingMarks}` : "___";
  // 干扰项：必须是**学习者真会混淆的**错选，而不是乱造的词。
  //
  // 修正（2026-09-19）：此前对所有答案无条件加 -s/-es/-ed/-ing 后缀，
  // 结果产出 `don'ted`、`shouldn'tes`、`haven'ted` 这类不是英语的"词"——
  // 实测 22% 的 cloze 题有 ≥2 个这种干扰项，用户不懂语法也能一眼排除，题目失去意义。
  // 现在分三类处理：
  //   ① 缩略/功能词（含撇号，或 am/is/are/do/does/have/has…）：同族替换（don't ↔ doesn't ↔ didn't）
  //   ② 普通实词（无撇号的动词/名词）：才允许 -s/-es/-ed/-ing 变形
  //   ③ 兜底：句内其他词（用真实存在的词，不用造的）
  const lower = answer.toLowerCase();
  const candidates: string[] = [];
  const push = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && trimmed !== lower && !candidates.includes(trimmed)) candidates.push(trimmed);
  };
  const isContraction = /['’]/.test(answer);
  // ① 功能词的同族替换表（这些才是真正会混的）
  const FUNCTION_FAMILIES: string[][] = [
    ["don't", "doesn't", "didn't"],
    ["isn't", "aren't", "wasn't"],
    ["aren't", "weren't", "isn't"],
    ["weren't", "wasn't", "aren't"],
    ["haven't", "hasn't", "hadn't"],
    ["hasn't", "haven't", "hadn't"],
    ["shouldn't", "mustn't", "can't"],
    ["wouldn't", "shouldn't", "couldn't"],
    ["can't", "couldn't", "won't"],
    ["won't", "wouldn't", "can't"],
    ["couldn't", "can't", "wouldn't"],
    ["didn't", "don't", "doesn't"],
    ["am", "is", "are"],
    ["was", "were", "is"],
    ["do", "does", "did"],
    ["have", "has", "had"],
    ["can", "could", "should"],
    ["must", "should", "may"],
    ["will", "would", "shall"],
    ["in", "on", "at"],
    ["a", "an", "the"],
    ["this", "that", "these"],
    ["my", "your", "his"]
  ];
  const family = FUNCTION_FAMILIES.find((group) => group.includes(lower));
  if (family) {
    // 同族里的其他词优先（最像人话的干扰项）
    for (const member of family) if (member !== lower) push(member);
  }
  if (!isContraction && !family) {
    // ② 只对**动词**做变形（-s/-ed/-ing 是动词才有的形态）。
    //    形容词/名词加这些后缀会造出 `coldes`、`nurseed` 这类不存在的词，
    //    用户一眼就能排除、题目等于白送（实测修正前 22% 的题如此）。
    //    判定依据：答案在原句里是否处于动词位置（前面是主语/助动词）——这里用保守近似：
    //    该词不在本课的「形容词/名词常见位」且能通过已知动词表命中，或句子中它紧跟
    //    I/you/he/she/it/we/they/do/does/don't/doesn't/can/will 等。
    const KNOWN_VERBS = new Set([
      "go","goes","went","have","has","had","do","does","did","want","wants","wanted",
      "like","likes","liked","need","needs","needed","take","takes","took","make","makes","made",
      "come","comes","came","get","gets","got","give","gives","gave","see","sees","saw",
      "eat","eats","ate","drink","drinks","drank","read","reads","write","writes","wrote",
      "play","plays","played","watch","watches","watched","study","studies","studied",
      "work","works","worked","live","lives","lived","help","helps","helped",
      "sleep","sleeps","slept","rest","rests","open","opens","opened","close","closes","closed",
      "buy","buys","bought","cook","cooks","cooked","clean","cleans","cleaned","put","puts",
      "draw","draws","drew","speak","speaks","spoke","listen","listens","listened",
      "walk","walks","walked","run","runs","ran","know","knows","knew","think","thinks","thought",
      "start","starts","started","finish","finishes","finished","swim","swims","swam",
      "find","finds","found","lose","loses","lost","break","breaks","broke","enjoy","enjoys","enjoyed"
    ]);
    // 不规则动词不做 -ed/-ing 变形——否则会造出 `drinked`、`swimed`、`wents`、`thinked`
    // 这类不存在的词（实测残留 17 道题如此）。它们改走「功能词同族 / 句内词 / 词池」兜底。
    const IRREGULAR_VERBS = new Set([
      "go", "went", "have", "has", "had", "do", "does", "did", "get", "got", "give", "gave",
      "see", "saw", "eat", "ate", "drink", "drank", "read", "write", "wrote", "make", "made",
      "take", "took", "come", "came", "run", "ran", "know", "knew", "think", "thought",
      "find", "found", "lose", "lost", "break", "broke", "speak", "spoke", "draw", "drew",
      "swim", "swam", "sleep", "slept", "buy", "bought", "put", "let", "sit", "sat"
    ]);
    if (KNOWN_VERBS.has(lower) && !IRREGULAR_VERBS.has(lower)) {
      // 修正（2026-09-20，第二次）：此前只修了「加后缀造词」的两个缝，实测仍残留一类——
      //   `KNOWN_VERBS` 表里混入了 **44 个第三人称单数形**（`takes`／`wants`／`plays`…），
      //   对它们再加后缀会产出 `takesed`／`takess`／`takesing`（实测 lesson-73 如此）。
      //   `contains` 判断「是否已变形」会误伤 `pass`／`focus` 这类真基础形，
      //   故改为：**先把 lower 还原成基础形，再只对基础形生成变体**。
      //   `cleaned` → `clean`（+ed 的还原）→ 产出 `cleans`／`cleaned`／`cleaning`（全是真词）；
      //   `takes` → `take` → 产出 `takes`／`taked`? 否——`take` 在 IRREGULAR_VERBS 里，整支跳过。
      const base = lower.replace(/ies$/, "y").replace(/ing$/, "").replace(/ed$/, "").replace(/s$/, "");
      if (base && !IRREGULAR_VERBS.has(base) && !IRREGULAR_VERBS.has(lower)) {
        for (const suffix of ["s", "ed", "ing"]) {
          // 辅音 + y 才变 ies（study→studies；play→plays）
          if (/[^aeiou]y$/.test(base)) push(`${base.slice(0, -1)}ies`);
          else if (/e$/.test(base)) push(`${base}d`);
          else push(`${base}${suffix}`);
        }
      }
    }
  }
  // ③ 同类别替换：从课程词汇池里取**长度相近**的词（用户学过的词，且难度相当）。
  //    这是最重要的一类干扰项——它不是句内词（那种太容易被语法位置排除），
  //    也不是生词，而是"同学过、但是另一个意思"的词。
  const pool = courseVocabulary().filter(
    (word) => word !== lower && Math.abs(word.length - lower.length) <= 2
  );
  // 用确定性随机取，保证同题每次一致（可回放）
  const poolRandom = mulberry32(hashText(`cloze-pool:${seed}:${answer}`));
  const shuffledPool = [...pool];
  for (let index = shuffledPool.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(poolRandom() * (index + 1));
    [shuffledPool[index], shuffledPool[swap]] = [shuffledPool[swap], shuffledPool[index]];
  }
  for (const word of shuffledPool) push(word);
  // ④ 最后兜底：句内其他词（真实的词）
  for (const word of words) {
    const clean = cleanWord(word);
    if (clean) push(clean);
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

/**
 * 课程词汇池（用于 cloze 的同类别干扰项）。
 *
 * 为什么不用 bundledDictionary：那本词典有 3.3MB / 数万词，远超出课程的 500 词门槛——
 * 拿它当干扰项会出现用户从没学过的词，反而是"超纲干扰"。
 * 这里只用**全部课程文本里出现过的词**（约 430 个），保证干扰项也在用户的学习范围内。
 */
let courseVocabularyCache: string[] | null = null;
const courseVocabulary = (): string[] => {
  if (courseVocabularyCache) return courseVocabularyCache;
  const words = new Set<string>();
  for (const lesson of grammarLessons) {
    const texts: string[] = [
      lesson.targetSentence,
      ...(lesson.examples ?? []).map((example) => example.en),
      ...(lesson.practice ?? []).map((step) => step.answer),
      ...(lesson.variants ?? []).map((variant) => variant.en),
      ...(lesson.dialogue ?? []).map((line) => line.en)
    ];
    for (const text of texts) {
      for (const raw of (text ?? "").split(/\s+/)) {
        // 保留词内撇号（don't / shouldn't 是完整词；剥掉会变成 didnt 这种不存在的写法），
        // 只剥词首尾的标点。
        const clean = raw
          .replace(/^[.,!?;:'"\u2019(\[]+/, "")
          .replace(/[.,!?;:'"\u2019)\]]+$/, "")
          .replace(/\u2019/g, "'")
          .toLowerCase();
        if (clean.length < 3) continue;
        if (!/^[a-z]+('[a-z]+)?$/.test(clean)) continue;
        // 只收**基础形式**：屈折形式（-ed/-ing/-est/-ly）不作为干扰项候选，
        // 否则会出现 "It is ___ today." 的选项里混进 written/taller 这类不匹配的词形。
        if (/(ed|ing|est|ly)$/.test(clean) && clean.length > 4) continue;
        words.add(clean);
      }
    }
  }
  courseVocabularyCache = [...words];
  return courseVocabularyCache;
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
  | "contrastSpot"
  /** 双正解条（bothRight）派生的「两句都对吗」题。 */
  | "bothRight"
  /** contrast 句对派生的听力题（播放正确句，二选一）。 */
  | "listen"
  /**
   * 翻译：给中文意思，写出英文整句。
   * 素材优先取**从未用于任何练习**的 examples / sceneSwings 句（全库约 300 句），
   * 所以它是真正的新题，而不是把课内练过的句子再问一遍。
   */
  | "translate";

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
    /**
     * 双正解条（bothRight）不能当正误对比题（2026-09-21 修）。
     *
     * 这类条的 `wrong` 字段其实**也是正确说法**（如 L87 的 `It's cold today.`，
     * 课程正文自己写着「两句都对」）。此前这里无条件写 `isWrong: true`，
     * 于是页面把一句正确的话当作「这句有问题吗」的题面，
     * 用户选「没问题」反被判错，而紧接着的讲解又说他是对的
     * （全库实测 9 道：L76 / L87 / L114 等）。
     * 本文件其它通道（改错 / 听辨 / 双正解）都已过滤 bothRight，只有这一处漏了。
     */
    if (contrast.bothRight) continue;
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
  const candidates: Record<"spot" | "contrast" | "bothright" | "listen" | "cloze" | "choice", BoostItem[]> = {
    spot: [],
    contrast: [],
    bothright: [],
    listen: [],
    cloze: [],
    choice: []
  };

  // ── 改错候选（两类来源，合计每课平均 4.7 道，替代原先只有 1 道）──
  // ① guided.spot：课程自带的找错题（每课 1 道，自带 correctionZh 与 explain）
  const spotStep = lesson.guided?.find((step) => step.kind === "spot");
  if (spotStep?.tokens?.length && spotStep.wrongToken) {
    // 先按原样严格匹配；不中再按「去尾标点」匹配——数据里存在 wrongToken 不带尾标点而
    // tokens 末项带标点的情况（L96/L102 的 "rain" vs "rain."），严格匹配失败会让这道题
    // 静默消失（不报错、只是少一道题）。这里兜住，数据侧另有守门测试。
    const wrongIndex = spotStep.tokens.findIndex(
      (token) => token === spotStep.wrongToken || cleanWord(token) === cleanWord(spotStep.wrongToken ?? "")
    );
    if (wrongIndex >= 0) {
      candidates.spot.push({
        id: `boost-${lesson.id}-t1-spot`,
        kind: "spot",
        promptZh: spotStep.promptZh || "这句里有一个词用错了——点出来。",
        intentZh: "",
        /**
         * 答对后展示的句子必须是**改对之后**的那句（2026-09-21 修）。
         *
         * 此前这里存的是题面错句（`tokens.join(" ")`），而页面把 `answer` 直接渲染
         * 成「对了！」的确认行——于是全库 193 课的第一道题都会在用户答对时显示
         * 「对了！I is Xiaomei.」（把错句当正确答案复述一遍）。
         * 对照：本文件里其它同类型题（contrast / bothright / 档 2 改写）一律存 `contrast.correct`，
         * 只有 guided 派生的这道存了错句——同题型两种口径。
         *
         * 正确句的取法（逐级回退）：
         *   ① `correctionZh` 末段（「把 is 换成 am：I am Xiaomei。」）——覆盖 188/193；
         *   ② 同课「把题面错句换成正确句」的那张对比卡——覆盖剩余 5 课
         *      （它们的 correctionZh 只给了一个词，如「月份名字要抬头：May。」）；
         *   ③ 都取不到时退回题面句（保底，不让字段为空）。
         */
        answer:
          correctedSentenceOf(spotStep.correctionZh, endingOf(spotStep.tokens)) ??
          correctedFromContrast(lesson, spotStep.tokens) ??
          spotStep.tokens.join(" "),
        explainZh: resolveGuidedExplain(spotStep, lesson) || lesson.oneLineRule,
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
    const wrongIndexes = locateMarkedTokens(tokens, contrast.wrongMark, contrast.correct);
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
    /**
     * 双正解条不能当正误对比题（2026-09-21 修）。
     *
     * 这类条的 `wrong` 字段其实**也是正确说法**（如 L87 的 `It's cold today.`，
     * whyZh 自己写着「两句都对」）。此前这里无条件写 `isWrong: true`，
     * 页面拿一句正确的话问「这句话，你觉得有问题吗？」，用户选「没问题」反被判错，
     * 紧接着的讲解又说他对。
     * 这类条目的教学价值是「两种说法都能用」，由下面专门的 bothRight 通道（`kind: "bothright"`）承载。
     */
    if (contrast.bothRight) return;
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

  // ── 双正解候选：contrast 里 bothRight 的条目（如「that 可省」）——
  //    这类条目的教学价值是"两种说法都能用"，此前只在课内展示、从未进过练习。
  //    只取两句差异足够大的（diff < 90），差异太小的（如只差标点）做不成判断题。
  (lesson.contrast ?? []).forEach((contrast, index) => {
    if (!contrast.bothRight) return;
    if (!contrast.wrong.trim() || !contrast.correct.trim()) return;
    const similarity = diffScore(compareText(contrast.correct, contrast.wrong, false));
    if (similarity >= 90) return; // 两句几乎相同，问"都对吗"没有意义
    candidates.bothright.push({
      id: `boost-${lesson.id}-t1-bothright-${index}`,
      kind: "bothright",
      promptZh: "这两句说法，你怎么看？",
      intentZh: "",
      answer: contrast.correct,
      explainZh: contrast.whyZh?.trim() || lesson.oneLineRule,
      correctPair: { first: contrast.wrong, second: contrast.correct },
      sourceRef: boostSourceRef(lesson.id, "bothRight", index, 1),
      itemKind: "derived",
      fromReview: false
    });
  });

  // ── 听力候选：播放本课正确句，从「正确句 vs 该语法点的典型错句」里选出听到的那句 ──
  //    素材来自 contrast（全库 660 组句对），两组只在**本课语法点**上不同，
  //    所以答对必须真的听出那个特征（不是靠常识猜）。
  (lesson.contrast ?? []).forEach((contrast, index) => {
    if (contrast.bothRight) return; // 双正解条两句都对，做听辨没有唯一答案
    const correct = contrast.correct.trim();
    const wrong = contrast.wrong.trim();
    if (!correct || !wrong) return;
    if (normalizeLessonSentence(correct) === normalizeLessonSentence(wrong)) return;
    // 太短的句子听辨信息不足（<3 词容易靠节奏猜）
    if (splitWords(correct).length < 3 || splitWords(wrong).length < 3) return;
    candidates.listen.push({
      id: `boost-${lesson.id}-t1-listen-${index}`,
      kind: "listen",
      promptZh: "听一遍，选出你听到的那句。",
      intentZh: "",
      answer: correct,
      explainZh: contrast.whyZh?.trim() || lesson.oneLineRule,
      listenText: correct,
      // 选项顺序固定为「先正确后错误」没有意义，用种子化打乱（确定性可回放）
      listenOptions: shuffleWithSeed([correct, wrong], `listen:${lesson.id}:${index}`),
      sourceRef: boostSourceRef(lesson.id, "listen", index, 1),
      itemKind: "derived",
      fromReview: false
    });
  });

  // ── 选词填空候选：变体/例句/实践句/场景变奏 ──
  //
  // 修正（2026-09-20，批三十）：**排除「借用老句」的肯定变体**。
  // 背景：部分课（实测 23 课）的 `variants[0]`（肯定）不是本课目标句，而是
  // **别的课的老句子**——这是有意的教学对照（如 L146 的肯定态用 L145 的
  // "I like tea too." 来摆「两张脸」）。但 tier-1 的 cloze 会从 variants 里
  // 抽一句出题，抽中它时就变成**在考上一课的词**（实测 L157 抽中
  // "All the books are good." 的 `All`、L158 抽中 "Someone is at home." 的
  // `home`），本课考点落空。批二十六～二十九连续四次登记此现象。
  // 现在把这类句子从 cloze 候选池剔除——否定/疑问变体不受影响（那是本课
  // 自己造出来的句子），且池里还有 examples／practice／sceneSwings／dialogue
  // 兜底，不会出现「某课抽不出 cloze」。
  const variantList = lesson.variants ?? [];
  const isBorrowedAffirmative = (sentence: { source: string; index: number }): boolean => {
    if (sentence.source !== "variants") return false;
    const variant = variantList[sentence.index];
    if (!variant || variant.label !== "肯定") return false;
    const en = normalizeLessonSentence(variant.en ?? "");
    return Boolean(en) && en !== normalizeLessonSentence(lesson.targetSentence);
  };
  const pool = dedupePool(poolOf(lesson)).filter(
    (sentence) =>
      sentence.source !== "target" &&
      sentence.source !== "blocks" &&
      !isBorrowedAffirmative(sentence)
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
      explainZh: resolveGuidedExplain(replaceStep, lesson) || lesson.oneLineRule,
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
      explainZh: resolveGuidedExplain(chooseStep, lesson) || lesson.oneLineRule,
      options: chooseStep.options,
      chooseBefore: chooseStep.before,
      chooseAfter: chooseStep.after,
      sourceRef: boostSourceRef(lesson.id, "guided", 2, 1),
      itemKind: "derived",
      fromReview: false
    });
  }

  // ── 取题：题型轮转 + 按「本轮各题型已抽数」动态补位 ──
  //
  // 设计约束：题量固定 4，题型有 5 类，每轮必有一类轮空。
  // 直接用「轮转偏移 + 前 4 个槽位」会让同一类**每轮都轮空**——实测 L13 复练 10 轮
  // 只能抽到 1 道改错题（改错池明明有 6 道）。所以改为：
  //   ① 先按轮转顺序各取一道（保证一次练习里题型不重样）
  //   ② 剩余槽位给「本轮还没抽过、且池子里还有货」的题型，最后才允许同型第二道
  // 这样既保持题型多样性，又不会让某个题型被永久饿死。
  // 改错（spot）是训练价值最高的一类（辨识 + 修正），池子也通常最厚（全库平均 5 道/课）——
  // 固定占一个槽位，不参与轮空；其余四类轮转占剩下的槽位。
  // 理由：4 题 5 类必有一类轮空，若让 spot 参与轮转，它会周期性整轮消失（实测 L36 第 1、6 轮无改错题）。
  const rotatingSlots: Array<keyof typeof candidates> = ["bothright", "listen", "cloze", "choice", "contrast"];
  const rotation = ((round % rotatingSlots.length) + rotatingSlots.length) % rotatingSlots.length;
  const slots: Array<keyof typeof candidates> = [
    "spot",
    ...rotatingSlots.slice(rotation),
    ...rotatingSlots.slice(0, rotation)
  ];
  const items: BoostItem[] = [];
  const usedIds = new Set<string>();
  /** 从某题型取一道未用过的（未练过的优先）。 */
  const drawFrom = (slot: keyof typeof candidates): BoostItem | null =>
    unseenFirst(candidates[slot], (item) => item.sourceRef, seen).find((item) => !usedIds.has(item.id)) ?? null;

  // ① 轮转顺序各取一道（最多 4 道，题型优先不重样）
  for (const slot of slots) {
    if (items.length >= 4) break;
    const picked = drawFrom(slot);
    if (!picked) continue;
    usedIds.add(picked.id);
    items.push(picked);
  }
  // ② 还有空位时：先补轮空的题型（避免被永久饿死），再允许池子厚的题型出第二道
  while (items.length < 4) {
    const presentKinds = new Set(items.map((item) => item.kind));
    const missingSlot = slots.find((slot) => {
      const sample = candidates[slot][0];
      return sample && !presentKinds.has(sample.kind);
    });
    if (missingSlot) {
      const picked = drawFrom(missingSlot);
      if (picked) {
        usedIds.add(picked.id);
        items.push(picked);
        continue;
      }
    }
    // 没有轮空题型可补：让池子最大的题型出第二道（改错池通常最厚，且训练价值最高）。
    // 这一步是「复练能一直换新题」的关键——否则改错池有 5 道却每轮只出 1 道。
    const richest = [...slots]
      .map((slot) => ({ slot, count: unseenFirst(candidates[slot], (item) => item.sourceRef, seen).filter((item) => !usedIds.has(item.id)).length }))
      .filter((entry) => entry.count > 0)
      .sort((a, b) => b.count - a.count)[0];
    if (!richest) break;
    const picked = drawFrom(richest.slot);
    if (!picked) break;
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
const sentenceExplanationFor = (lesson: GrammarLesson, sentence: PooledSentence): string =>
  explainForSentence(lesson, sentence.en);

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
  const candidates: Record<"recall" | "translate" | "rebuild" | "arrange", BoostItem[]> = {
    recall: [],
    translate: [],
    rebuild: [],
    arrange: []
  };

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

  // ── 翻译候选：中文意思 → 英文整句（素材取未用于练习的 examples / sceneSwings）──
  //    与 recall（核心句）的区别：这里用的是**课内没练过的句子**，考迁移而非记忆。
  {
    const usedInPractice = new Set([
      ...(lesson.practice ?? []).map((step) => normalizeLessonSentence(step.answer)),
      ...(lesson.guided ?? []).filter((step) => step.answer).map((step) => normalizeLessonSentence(step.answer)),
      normalizeLessonSentence(lesson.targetSentence)
    ]);
    const SCENE_LIKE_ZH = /问|说|补|回答|指着|喊|笑|递|看看|轮到/;
    const translationPool: Array<{ en: string; zh: string; source: SentenceSource; index: number }> = [
      ...(lesson.examples ?? []).map((example, index) => ({
        en: example.en,
        zh: example.zh,
        source: "examples" as SentenceSource,
        index
      })),
      ...(lesson.sceneSwings ?? []).map((swing, index) => ({
        en: swing.en,
        zh: swing.zh,
        source: "sceneSwings" as SentenceSource,
        index
      }))
    ];
    for (const sentence of translationPool) {
      const normalized = normalizeLessonSentence(sentence.en);
      if (!normalized || usedInPractice.has(normalized)) continue;
      // 中文必须是"意思"而不是"场景描述"（对话行的 zh 多为场景描述，不能出翻译题）
      if (!sentence.zh.trim() || SCENE_LIKE_ZH.test(sentence.zh)) continue;
      const words = splitWords(sentence.en).length;
      if (words < 3 || words > 10) continue; // 太短没训练量、太长超出 A2 负荷
      candidates.translate.push({
        id: `boost-${lesson.id}-t2-translate-${sentence.source}-${sentence.index}`,
        kind: "translate",
        promptZh: "照着中文，把整句写出来。",
        intentZh: sentence.zh,
        answer: sentence.en,
        explainZh: sentenceExplanationFor(lesson, { en: sentence.en, zh: sentence.zh, source: sentence.source, index: sentence.index }),
        sourceRef: boostSourceRef(lesson.id, sentence.source, sentence.index, 2),
        itemKind: "derived",
        fromReview: false
      });
    }
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
    translate: unseenFirst(candidates.translate, (item) => item.sourceRef, seen),
    rebuild: unseenFirst(candidates.rebuild, (item) => item.sourceRef, seen),
    arrange: unseenFirst(candidates.arrange, (item) => item.sourceRef, seen)
  };
  const cursors: Record<keyof typeof candidates, number> = { recall: 0, translate: 0, rebuild: 0, arrange: 0 };
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
  // ① 先保证四类题型各出现一次（跑一遍覆盖）：否则素材多的题型会吃满所有槽位，
  //    把「中文→整句」这类题挤掉——它恰恰是档 2 的起点题（回归：扩 arrange 素材后 recall 曾完全消失）。
  for (const kind of ["recall", "translate", "rebuild", "arrange"] as Array<keyof typeof candidates>) {
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

/**
 * 双正解判断：用户选「两句都对」才算对。
 *
 * 设计理由：这类题的考点是「英语里不止一种说法」，所以正确答案恒为"都对"。
 * 之所以仍做成判断题（而不是直接告诉用户），是因为**先猜再揭晓**才有 noticing 效果——
 * 用户需要先意识到"我以为只有一种说法"这个预设，讲解才打得进去。
 */
export const judgeBoostBothRight = (item: BoostItem, pickedBothCorrect: boolean): boolean =>
  Boolean(item.correctPair) && pickedBothCorrect;

/**
 * 听力：选中的文本是否与播放的一致（按归一化文本比对，忽略大小写标点）。
 * 干扰项与本课语法点只差一处，所以答对意味着真的听出了那个特征。
 */
export const judgeBoostListen = (item: BoostItem, picked: string): boolean =>
  Boolean(item.listenText) &&
  normalizeLessonSentence(picked) === normalizeLessonSentence(item.listenText ?? "");

/** 选择 / 变形：选项文字比对（大小写宽容）。 */
export const judgeBoostChoice = (item: BoostItem, picked: string): boolean =>
  picked.trim().toLowerCase() === item.answer.trim().toLowerCase();

/** 词块排序（rebuild / arrange）：顺序与内容都对，标点大小写宽容；缩写与全称互通。 */
export const judgeBoostTokens = (item: BoostItem, built: string[]): boolean =>
  tokenSequencesEquivalent(built, item.answer);

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
    case "bothright":
      return { passed: judgeBoostBothRight(item, Boolean(answer.pickedProblem)) };
    case "listen":
      return { passed: judgeBoostListen(item, answer.text ?? "") };
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
    case "translate":
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
