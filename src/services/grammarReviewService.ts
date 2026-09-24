import type { AppData, Card, Schedule, SentenceDetails } from "../types";
import { compareText, diffScore, tokenSequencesEquivalent, spellingMatches } from "./diffService";
import { courseVocabulary, isFreeOutputPassed, normalizeLessonSentence, stripNoteMarkers } from "./lessonService";

/**
 * 语法点复习会话（R03）：把进入 SM-2 队列的语法句子卡变成「产出型小任务」。
 * - 会话硬上限 10 张（复习不成为负担，瑞思风险④）；
 * - 最旧错题优先（lapse 多的排前），再按到期时间排；
 * - 相邻卡不同来源（混题：新错 + 旧错交替出现）；
 * - 题型按 reviewCount 轮换（填空 / 重组），同一张卡每次复习形态不同，防背答案。
 */

export const GRAMMAR_REVIEW_SESSION_LIMIT = 10;
/**
 * 注（2026-09-20）：此处原有 `GRAMMAR_REVIEW_TIME_BUDGET_MS = 5 * 60 * 1000`，
 * 但**全库零引用**（从未实现），且与项目红线冲突——
 * GRAMMAR_PEDAGOGY_REVIEW.md 明确把「任何形式的限时 / 排名 / 体力值」列为 Non-goals
 * （与 Affective Filter 原则冲突）。会话长度只由 SESSION_LIMIT 间接约束，
 * 不给用户时间压力。故删除该死常量，避免承诺一个不存在也不该有的行为。
 */

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

/**
 * 「从未进过复习队列」的判定。
 *
 * 2026-09-21 修（P0，我自己上一轮引入的回归）：此前这里单看 `intervalDays === 0`，
 * 但 `applyReview` 的 **rating=1（看答案）分支也会把 intervalDays 归零**
 * （语义是「10 分钟后再来」）。两者撞车后，用户刚看答案的那张卡被当成「从未排过」
 * 而**永久排除**出复习会话——页面还写着「这张卡很快会再来见你」，实际再也不会来。
 *
 * 判据改成「三个字段都还是初始值」：任何一次真实复习都会让 reviewCount +1，
 * 其中看答案还会让 lapseCount +1，所以「刚失败的卡」与「刚入队的新卡」可以干净分开。
 * 存量/测试数据里 reviewCount: 0 但已排期（intervalDays > 0）的卡也照常到期。
 */
const neverQueuedSchedule = (schedule: Schedule): boolean =>
  (schedule.intervalDays ?? 0) === 0 && (schedule.reviewCount ?? 0) === 0 && (schedule.lapseCount ?? 0) === 0;

/** 到期的语法复习卡：最旧错题优先，其次按到期时间升序。 */
export const listDueGrammarReviewCards = (data: AppData, now = new Date()): GrammarReviewCard[] => {
  const scheduleByCardId = new Map(data.schedules.map((schedule) => [schedule.cardId, schedule]));
  return data.cards
    .filter(isGrammarSentenceCard)
    .map((card) => {
      const schedule = scheduleByCardId.get(card.id);
      return schedule ? { card, schedule } : null;
    })
    .filter((item): item is GrammarReviewCard => {
      if (!item) return false;
      /**
       * 「从未排过复习」的卡不立即到期（2026-09-20 修）：
       * normalizeSchedules 会给缺计划的卡补一条默认计划（intervalDays: 0、nextReviewAt: now），
       * 于是刚入队的新句子立刻出现在复习会话里——与空态文案「上完新课，错过的句子
       * 和核心句型**明天**会排进这里」自相矛盾，也让同一页面同时显示「未开始 1」和「第 1 / 1 张」。
       */
      if (item.card.status === "new" || neverQueuedSchedule(item.schedule)) return false;
      return new Date(item.schedule.nextReviewAt) <= now;
    })
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

/**
 * 会话内同一句话只出现一次（2026-09-21 加）。
 *
 * 为什么需要：同一个找错案件会为**每个错点**各建一张卡，而这些卡的正面都是
 * 同一句完整正确句（见 huntService.correctedSentenceOf）——实测 745 张 hunt 卡里
 * 有 543 张与同案其它卡正面重复，一个 4 错点的案子就能吃掉 10 张会话里的 7 个槽位，
 * 用户在同一句话上反复做 7 道不同形态的题。
 * 判据用归一化后的句子（忽略大小写与标点）：同一句话的 cloze/rebuild/free_type
 * 变体也算重复。保留先出现的那个（已按 lapse / 到期时间排好序）。
 */
const dedupeBySentence = (items: GrammarReviewCard[]): GrammarReviewCard[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = normalizeLessonSentence(item.card.front) || item.card.front.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/**
 * 组一次复习会话：去同句重复 → 交错混题 → 按上限截断。
 *
 * 去重放在交错**之前**：交错会把同案卡分散到会话各处，先交错再去重会让
 * 「保留哪一张」取决于交错结果，不如先去重（保留排序最靠前的那个）来得稳定可回放。
 */
export const buildGrammarReviewSession = (
  data: AppData,
  limit = GRAMMAR_REVIEW_SESSION_LIMIT
): GrammarReviewCard[] =>
  interleaveBySource(dedupeBySentence(listDueGrammarReviewCards(data))).slice(0, Math.max(1, limit));

/**
 * R-UX9 同型不连出（2026-09-19）：会话内相邻两张卡的题型（cloze/rebuild/free_type）
 * 尽量不同——此前题型由 reviewCount 奇偶决定，同一天入队的卡 reviewCount 相近，
 * 会连续出同型题（亲测连续 2 张选词填空），「轮换」名存实亡。
 * 贪心重排：逐张扫描，若与前一张同型则向后找第一个异型的交换（找不到就保持原位）。
 * 确定性：同输入同输出，可回放。
 */
export const diversifyReviewModes = (
  session: GrammarReviewCard[],
  sentenceDetailsList: SentenceDetails[] = []
): GrammarReviewCard[] => {
  if (session.length <= 2) return session;
  const modeOf = (item: GrammarReviewCard): GrammarReviewMode => {
    const schedule = item.schedule;
    return isFreeTypeReviewEnabled() && (schedule.reviewCount ?? 0) >= FREE_TYPE_MIN_REVIEW_COUNT
      ? "free_type"
      : (schedule.reviewCount ?? 0) % 2 === 0
        ? "cloze"
        : "rebuild";
  };
  const result = [...session];
  for (let index = 1; index < result.length; index += 1) {
    if (modeOf(result[index]) !== modeOf(result[index - 1])) continue;
    // 同型：向后找第一个异型的换过来
    let swapAt = -1;
    for (let probe = index + 1; probe < result.length; probe += 1) {
      if (modeOf(result[probe]) !== modeOf(result[index - 1]) && modeOf(result[probe]) !== modeOf(result[index])) {
        swapAt = probe;
        break;
      }
    }
    if (swapAt > index) {
      [result[index], result[swapAt]] = [result[swapAt], result[index]];
    }
  }
  return result;
};

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

/**
 * 造 3 个干扰项：同族变形优先，不足则取句内其他实词。
 *
 * 修正（2026-09-20）：此前对**所有**答案无条件加 `-s/-es/-ed/-ing/-d` 后缀，会造出
 * `forwardes`、`lookinged`、`coldes` 这类不是英语的「词」——三个干扰项里至少两个
 * 一眼可排除，题目失去意义。与 `grammarBoostService` 2026-09-19 的同款修正对齐：
 *   ① 功能词/缩略语（含撇号或 am/is/are/do/does/have/has…）：走同族替换表
 *   ② 只有**已知规则动词**才允许变形（不规则动词变异会造出 `drinked`、`wents`）
 *   ③ 兜底取句内其他词（真实存在的词，不用造的）
 */
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

/** 允许做 -s/-ed/-ing 变形的规则动词（与 boost 侧同一份口径）。 */
const KNOWN_VERBS = new Set([
  "go", "have", "do", "want", "like", "need", "take", "make", "come", "get", "give", "see",
  "eat", "drink", "read", "write", "play", "watch", "study", "work", "live", "help",
  "sleep", "rest", "open", "close", "buy", "cook", "clean", "put", "draw", "speak", "listen",
  "walk", "run", "know", "think", "start", "finish", "swim", "find", "lose", "break", "enjoy"
]);

/** 不规则动词不做 -ed/-ing 变形（会造出 `drinked`、`wents` 这类不存在的词）。 */
const IRREGULAR_VERBS = new Set([
  "go", "went", "have", "has", "had", "do", "does", "did", "get", "got", "give", "gave",
  "see", "saw", "eat", "ate", "drink", "drank", "read", "write", "wrote", "make", "made",
  "take", "took", "come", "came", "run", "ran", "know", "knew", "think", "thought",
  "find", "found", "lose", "lost", "break", "broke", "speak", "spoke", "draw", "drew",
  "swim", "swam", "sleep", "slept", "buy", "bought", "put", "let", "sit", "sat"
]);

const buildClozeOptions = (answer: string, tokens: string[]): string[] => {
  const lower = answer.toLowerCase();
  const candidates: string[] = [];
  const push = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && trimmed !== lower && !candidates.includes(trimmed)) candidates.push(trimmed);
  };
  // ① 功能词同族替换（这些才是真会混的）
  const family = FUNCTION_FAMILIES.find((group) => group.includes(lower));
  if (family) for (const member of family) if (member !== lower) push(member);
  // ② 只有已知规则动词才变形
  else if (KNOWN_VERBS.has(lower) && !IRREGULAR_VERBS.has(lower)) {
    for (const suffix of ["s", "ed", "ing"]) {
      if (lower.endsWith("y")) push(`${lower.slice(0, -1)}ies`);
      else if (/e$/.test(lower)) push(`${lower}d`);
      else push(`${lower}${suffix}`);
    }
  }
  /**
   * ③ 同类别替换：从**课程词汇池**里取长度相近的词（用户学过的词，难度相当）。
   *    这是最重要的一类干扰项——不是句内词（那种太容易被语法位置排除），
   *    也不是生词，而是「同学过、但是另一个意思」的词。
   *
   *    2026-09-24 补：此前 review 侧**缺这一类**，内容词（Xiaomei / happy / tired /
   *    dogs / Monday / friends）在 ① ② 都不适用时直接掉到 ④ 句内其他词，
   *    于是 `am` / `i` / `they` 被拿来填需要形容词的槽位——按词性一眼可排除，
   *    题目近似白送（gq1 weakDistractors 1282 条的主因）。
   */
  const pool = courseVocabulary().filter(
    (word) => word !== lower && Math.abs(word.length - lower.length) <= 2
  );
  /**
   * ⚠️ 2026-09-25：记下 ① ② 产出的**优先干扰项**（同族词 / 同源变形）。
   *
   * 为什么必须分开：③ 的池子会 push 进**整池**词，而下面那句 `candidates` 整体打乱 + 取前 3
   * 会把优先项随机挤出去。实测后果（真机，reviewCount=0 的单词语卡）：
   *   `am`  → ["wow", "new", "fast", "am"]      ← is / are 没了
   *   `the` → ["best", "face", "time", "the"]   ← 冠词同族没了
   * 而 `am` 的辨析点**就是** is / are（L1「I am happy.」的全部教学内容）——
   * 换成 wow/new/fast 之后这道题不再考任何东西，用户按语感随手就能排除。
   * ③ 的引入本意是修**内容词**（此前 am/i/they 被拿去填形容词槽，一眼可排除），
   * 但它对**功能词**起了反作用：功能词要的正是同族替换，不是「同学过的别的词」。
   * 所以：优先项保持在最前，只打乱池子部分。
   */
  const priorityCandidates = [...candidates];
  const poolRandom = mulberry32(hashText(`cloze-pool:${answer}`));
  const shuffledPool = [...pool];
  for (let index = shuffledPool.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(poolRandom() * (index + 1));
    [shuffledPool[index], shuffledPool[swap]] = [shuffledPool[swap], shuffledPool[index]];
  }
  for (const word of shuffledPool) push(word);
  // ④ 最后兜底：句内其他真实词（③ 一般已凑够，这里是池子不够用时的保底）
  for (const token of tokens) {
    const clean = cleanToken(token);
    if (clean) push(clean);
  }
  const random = mulberry32(hashText(answer));
  // 只打乱「池子 + 句内兜底」这一段；优先项（同族 / 变形）保持在前，
  // 否则它们会被随机挤出前三 —— 见上面 priorityCandidates 的说明。
  const tail = candidates.slice(priorityCandidates.length);
  for (let index = tail.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [tail[index], tail[swap]] = [tail[swap], tail[index]];
  }
  // 优先项内部也打乱一次（保留「同一张卡每次形态不同」的设计目标，但不与池子混排）
  const priorityRandom = mulberry32(hashText(`${answer}:priority`));
  const priority = [...priorityCandidates];
  for (let index = priority.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(priorityRandom() * (index + 1));
    [priority[index], priority[swap]] = [priority[swap], priority[index]];
  }
  const ordered = [...priority, ...tail];
  const options = [answer, ...ordered.slice(0, 3)];
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
  // 展示前剥掉内部标记（[tense:move] 这类），存储里保留供弱点归因使用
  const note = stripNoteMarkers(details?.grammarNote || card.note || "");
  // R09 Step2：flag 开启且复习满 2 次后，第 3 次（含）以后出现转自由输出——复习的终点是「不用提示自己写出来」。
  const flaggedFreeType =
    isFreeTypeReviewEnabled() && (schedule.reviewCount ?? 0) >= FREE_TYPE_MIN_REVIEW_COUNT;
  /**
   * 单词语卡（词块 < 2）的分流——2026-09-24 收窄。
   *
   * 这类卡的根因在**入队侧**：原先把 `choose` 的 `answer` 直接入队，产出 `front="am"` 这种词块数 1 的卡
   * （全库 145 例）。入队侧已修（`lessonService.reviewSentenceOfGuidedStep` 按 before/after 还原整句，
   * 还原不出的 replace/spot 则不入队），本分支只兜存量与旁路入队。
   *
   * 为什么不再一律转 free_type：
   * - `rebuild` 只剩 1 个词块确实是「点一下就过」的废题（gq1 的 rebuildTooFewChunks）→ 单词卡一律不走 rebuild。
   * - 但 `cloze` 对**功能词**并不退化：`buildClozeOptions` 有功能词同族替换，实测 `front="am"` 的选项是
   *   `["am","is","are"]` 三条，配上来源锚点题面仍是可作答的题（rv5 的原始设计，2026-09-21，
   *   此前被本守卫遮蔽成死代码）。
   * - 只有连同族都凑不出时（`dogs` / `went` / `to` 这类），cloze 才塌成单选项（gq1 的 clozeSingleOption），
   *   那才该退 free_type。
   *
   * 判据因此可测：cloze 选项 ≥2 就用 cloze，否则 free_type。
   */
  const singleToken = tokens.length < 2;
  const singleTokenClozeOptions = singleToken ? buildClozeOptions(cleanToken(tokens[0] ?? ""), tokens) : [];
  const degenerate = singleToken && singleTokenClozeOptions.length < 2;
  const mode: GrammarReviewMode =
    flaggedFreeType || degenerate
      ? "free_type"
      : singleToken || (schedule.reviewCount ?? 0) % 2 === 0
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
  /**
   * 挖空只能挖「这一句里只出现一次」的词（2026-09-21 修）。
   *
   * 反例：`I was late because the bus was late.` 挖掉第一个 late，
   * 题面 `I was ____ because the bus was late.` 里第二个 late 还在——
   * 答案直接写在题干上，题目失去意义（全库实测 13 例）。
   * 优先在「唯一出现」的词里选；整句确实只有一个候选词时退回原候选集。
   */
  const uniqueIndexes = indexes.filter((index) => {
    const word = cleanToken(tokens[index] ?? "").toLowerCase();
    return tokens.filter((token) => cleanToken(token).toLowerCase() === word).length === 1;
  });
  const candidates = uniqueIndexes.length > 0 ? uniqueIndexes : indexes;
  /**
   * 挖空位置轮换（2026-09-20 修）：此前种子只用 reviewCount，
   * 但默认 flag 下 cloze 只在 reviewCount === 0 出现（≥2 转 free_type、1 转 rebuild），
   * 于是下标恒为 indexes[0]——同一张卡每次复习都挖同一个位置，
   * 设计目标「同一张卡每次形态不同，防背答案」在挖空位置层不成立。
   * 加上 card.id 一起做种子：同一张卡稳定、不同卡分散，且同卡多次复习也会换位置。
   */
  const pickSeed = hashText(`${card.id}:cloze:${schedule.reviewCount ?? 0}`);
  const pickedIndex = candidates[pickSeed % candidates.length];
  const answer = cleanToken(tokens[pickedIndex] ?? "");
  /**
   * 单词卡（如 front="am"）挖空后题面会变成光秃秃的 `____`——
   * 用户看不到任何上下文，无从判断填什么（全库实测 12 例）。
   * 这种情况改用**给出中文/来源提示**的题面（与 free_type 同款锚点），
   * 至少让用户知道要写哪句话。
   */
  if (tokens.length <= 1) {
    const sourceHint = card.note.trim()
      ? `${card.note.trim()}——这句里的词是什么？`
      : "把这句话里缺的那个词写出来";
    return {
      card,
      mode,
      promptText: sourceHint,
      answer,
      options: buildClozeOptions(answer, tokens),
      scrambled: [],
      sentence,
      note
    };
  }
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

/**
 * 填空判分（大小写宽容 + **全角折叠**）。
 *
 * 2026-09-24 修：原为裸 `toLowerCase` 比较，没有全角折叠——用户用中文输入法打出
 * 全角字母（`ｐｉｃｔｕｒｅ`）或弯撇号（`don’t`）会被判错（实测确认）。
 * 填空是**用户手打**的题型，必须走 diffService 的权威词级判分。
 * 同文件的 `judgeGrammarRebuild` 早已走 `tokenSequencesEquivalent`（含折叠），
 * 两处题型口径原本不一致。
 */
export const judgeGrammarCloze = (picked: string, answer: string): boolean =>
  spellingMatches(answer, picked);

/** 重组判分（顺序与内容都对，标点与大小写宽容；缩写与全称互通，见 checkLessonTokens）。 */
export const judgeGrammarRebuild = (built: string[], sentence: string): boolean =>
  tokenSequencesEquivalent(built, sentence);

/** R09 Step2 free_type 判分：diffScore ≥ 90（与课内 output 段同口径，拼写接近算半对，非严格等值）。 */
export const FREE_TYPE_PASS_SCORE = 90;

export const judgeGrammarFreeType = (input: string, sentence: string): { passed: boolean; score: number } => {
  const score = diffScore(compareText(sentence, input, false));
  // 状语移位算对（与课内产出段同口径）
  return { passed: isFreeOutputPassed(input, sentence, score, FREE_TYPE_PASS_SCORE), score };
};

/**
 * R09 Step2 新掌握口径：自由输出「连续 2 次一次通过」才算掌握。
 * 判定依据本卡历史 review 事件流，取最近两条**自由输出**（mode="recall"）的结果。
 *
 * 2026-09-21 修：`rebuild`（点词块拼句）此前与 free_type 共用 mode="recall"，
 * 于是「拼词块通过 + 自己写通过」被算成输出两次，用户只独立写出过 1 次就被判已掌握。
 * 现 GrammarReviewPage 把 rebuild 单独记为 mode="rebuild"，这里因此只需认 recall。
 * 历史数据里已混入的 rebuild 记录无法追溯区分（当时就记成了 recall），
 * 但那时点词块确实通了关——按宽口径保留，不追溯撤销已有掌握状态。
 */
export const isMasteredByOutput = (reviews: { cardId: string; mode: string; rating: number }[], cardId: string): boolean => {
  const outputReviews = reviews.filter((review) => review.cardId === cardId && review.mode === "recall");
  if (outputReviews.length < 2) return false;
  const lastTwo = outputReviews.slice(-2);
  return lastTwo.every((review) => review.rating === 4);
};
