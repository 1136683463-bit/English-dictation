import type {
  AppData,
  GrammarErrorTag,
  GrammarLesson,
  HuntAttempt,
  HuntCase,
  HuntEditOp,
  HuntError,
  HuntResult
} from "../types";
import { huntCases } from "../data/huntCases";
import { grammarLessons } from "../data/grammarLessons";
import { addSentence } from "./cardService";
import { nowIso, uid } from "./storage";

/**
 * 罪名的短名（显示在罪名按钮、结算卡、错词本、日记批改的 tag 处）。
 *
 * 2026-09-22 零术语清理：此前 11 个短名里有 5 个含术语——
 *   时态变形（时态）／单复数（复数）／介词（介词）／语序（语序）／比较级（比较级）。
 * 它们**直接渲染给用户**（罪名按钮的粗体行、复盘课的标签、日记批改的标签），
 * 且被写进 `grammarNote` 持久化字符串——全库 776 处讲解里有 376 处因此命中术语红线（48.5%）。
 * 现在改成同义的大白话（与 `GRAMMAR_ERROR_TAG_PLAIN` 同一口径，但更短，适合当标签用）。
 * 内部代码与埋点仍用 `GrammarErrorTag` 的英文键（tense / plural…），不受影响。
 */
export const GRAMMAR_ERROR_TAG_LABELS: Record<GrammarErrorTag, string> = {
  tense: "说过去的事",
  sv_agreement: "谁做要看谁",
  missing_be: "少了那个是",
  article: "东西前面那个小词",
  plural: "两个以上",
  preposition: "固定搭配",
  fragment: "句子没说完",
  run_on: "两个连词打架",
  word_order: "词的先后",
  verb_form: "动词的形式",
  comparison: "比一比"
};

/** 罪名的人话版解释，零基础也能看懂，展示在罪名按钮的小字里。 */
export const GRAMMAR_ERROR_TAG_PLAIN: Record<GrammarErrorTag, string> = {
  tense: "事情发生在过去，动词要换成过去式",
  sv_agreement: "他 / 她 / 它做事，动词要加 s",
  // 2026-09-21 术语清理：以下 6 条原含术语（主语/形容词/单数/可数/语序/原形），
  // 违反零术语红线。改写为同义的大白话——含义不变、更好懂，且不再挡住
  // 「你的三句话」复盘课对这些高频错因的取用（此前 6 个罪名因术语被排除在外）。
  missing_be: "句子里少了个『是』（am/is/are）——比如「我很累」不能说 I very tired",
  article: "一个东西前面要有 a / an / the——不能光着出场",
  plural: "两个以上要加 s，有些词永远不加",
  preposition: "固定搭配记整块，不能按中文直译",
  run_on: "because 和 so 不能同时用，留一个",
  word_order: "词语站错了位置——英语里谁先说谁后说，和中文不太一样",
  verb_form: "动词要穿对衣服——看它站在哪个位置，决定穿哪件",
  fragment: "一句话得说完整——谁 + 做了什么，缺一块就不成句",
  comparison: "两个里比一个，后面的词要带上 -er 或 more"
};

/** 每个案件的线索额度：误判达到这个数后只是不再提示，不会阻塞游戏。 */
export const HUNT_CLUE_BUDGET = 5;

/** 挑选收进错词本的词时要跳过的功能词。 */
const NON_CONTENT_WORDS = new Set(["a", "an", "the", "is", "are", "to"]);

/**
 * 从改正结果里挑一个值得收进错词本的词（如 "moved"；短语取第一个实词）。
 *
 * 判据走 `editOp`（2026-09-23 批五十三）：`delete` / `move` / `explain` 三类没有
 * 「可以背的一个词」，一律返回空串让调用方跳过。旧写法靠字面猜
 * （`startsWith("去掉")` + 括注 + 含汉字 + 冠词 + 剥标点），已在
 * `hunt-umbrella-owner#5`（`去掉（…顺序调整…）`）这类混合修正上分叉出错。
 */
export const pickCorrectionWord = (correction: string, editOp: HuntEditOp): string => {
  const trimmed = correction.trim();
  if (!trimmed) return "";
  // 三类修正没有可入库的词：删词（去掉 so）/ 移动（把 white 移到 cat 前面）/ 纯说明
  if (editOp === "delete" || editOp === "move" || editOp === "explain") return "";
  // 含中文的修正是说明性文案，不是可背的英文词
  if (/[\u4e00-\u9fa5]/.test(trimmed)) return "";

  const words = trimmed.split(/\s+/).filter(Boolean);
  const meaningful = words.find((word) => !NON_CONTENT_WORDS.has(word));
  if (!meaningful) return "";
  // 剥掉词尾标点：改正结果常带原句的句末标点（"first." / "go."），
  // 直接入库会得到「first.」这种词。2026-09-21 批三十九补：全库实测 102 处。
  return meaningful.replace(/[.,!?;:]+$/, "");
};

export const listHuntCases = (): HuntCase[] => huntCases;

// ── R01 课程锁：学会之后才解锁对应破案挑战 ──────────────────

/** 案件 → 引用它的课程（huntCaseIds 反查）。 */
const findUnlockLesson = (caseId: string): GrammarLesson | undefined =>
  grammarLessons.find((lesson) => lesson.huntCaseIds.includes(caseId));

export interface HuntCaseLockInfo {
  caseItem: HuntCase;
  unlocked: boolean;
  /** 未解锁时，引用该案的课程（用于「学完第 X 课就来破案」提示）。 */
  unlockLesson: GrammarLesson | null;
}

/** 番外案（未被任何课 huntCaseIds 引用）的解锁档位：完成第一季（前 12 课）即整体解锁（决策①，2026-09-14 拍板）。 */
const EXTRA_CASES_UNLOCK_LESSON_NUMBER = 12;

/**
 * R01 课程锁：
 * - 被课程引用的案件：该课完成后解锁；
 * - 番外案（未被任何课引用）：完成第 12 课（第一季收官）后整体解锁——
 *   番外案是综合复习性质，错误类型混合，需要第一季的知识点打底才不会越级撞墙。
 */
export const listHuntCasesWithLock = (data: AppData): HuntCaseLockInfo[] => {
  const done = new Set(data.grammarLessonsDone ?? []);
  const seasonOneDone =
    grammarLessons.filter((lesson) => lesson.number <= EXTRA_CASES_UNLOCK_LESSON_NUMBER)
      .every((lesson) => done.has(lesson.id)) &&
    grammarLessons.some((lesson) => lesson.number <= EXTRA_CASES_UNLOCK_LESSON_NUMBER);
  return huntCases.map((caseItem) => {
    const unlockLesson = findUnlockLesson(caseItem.id) ?? null;
    const unlocked = unlockLesson ? done.has(unlockLesson.id) : seasonOneDone;
    return { caseItem, unlocked, unlockLesson };
  });
};

/** 是否有任一案件已解锁（路径页判断「去侦探找错」入口是否可用）。 */
export const hasUnlockedHuntCase = (data: AppData): boolean =>
  listHuntCasesWithLock(data).some((info) => info.unlocked);

/** 找出落在某个词上的错误；该词没问题则返回 undefined。 */
export const findErrorAt = (caseItem: HuntCase, tokenIndex: number): HuntError | undefined =>
  caseItem.errors.find((error) => error.tokenIndex === tokenIndex);

export type HuntVerdictKind = "hit" | "wrongTag" | "notError" | "alreadyFound";

export interface HuntVerdict {
  kind: HuntVerdictKind;
  error?: HuntError;
  message: string;
}

/** 命中失败时按真正的错误类型给一条针对性的线索，把误判变成教学机会。 */
const tagHintForWrongGuess: Record<GrammarErrorTag, string> = {
  tense: "再看看句子里的事件发生在什么时候。",
  sv_agreement: "再看看主语是一个人还是几个人。",
  missing_be: "把这个句子慢慢读一遍，看看是不是少了一个动词。",
  article: "看看名词前面的帽子（a / an / the）戴对了吗。",
  plural: "数一数数量，再想想该不该加 -s。",
  preposition: "这个小词是固定搭配，试着整块记住它。",
  fragment: "这个句子还缺一块，看看缺的是主语还是动词。",
  run_on: "两个连接词不能同时出现，留一个就够。",
  word_order: "看看这句里哪个词站错了位置。",
  verb_form: "再想想这里需要动词的哪种形式。",
  comparison: "两个东西比一比，看看形容词要不要加 -er 或 more。"
};

/**
 * 对一次「选罪名」做裁决：
 * - alreadyFound：这个词之前已经找到过；
 * - notError：这个词没有问题（语气温和，不挫败）；
 * - wrongTag：这里确实有错但罪名选错了，给出按 tag 定制的线索；
 * - hit：命中。
 */
export const judgeGuess = (
  caseItem: HuntCase,
  tokenIndex: number,
  guessedTag: GrammarErrorTag | null,
  foundIndexes: number[]
): HuntVerdict => {
  if (foundIndexes.includes(tokenIndex)) {
    return {
      kind: "alreadyFound",
      message: "这个词你已经找到过了，看看别的地方吧。"
    };
  }

  const error = findErrorAt(caseItem, tokenIndex);
  if (!error) {
    return {
      kind: "notError",
      message: "这个词没有问题，放心。继续侦查别的线索吧。"
    };
  }

  if (guessedTag === error.tag) {
    return {
      kind: "hit",
      error,
      message: "找到了！这个证据收进案卷。"
    };
  }

  const guessedLabel = guessedTag ? GRAMMAR_ERROR_TAG_LABELS[guessedTag] : "";
  const hint = tagHintForWrongGuess[error.tag];
  return {
    kind: "wrongTag",
    error,
    message: guessedLabel
      ? `这里确实有问题，但不是${guessedLabel}。${hint}`
      : `这里确实有问题。${hint}`
  };
};

/** 星级：0 次误判 3 星，1-2 次 2 星，3 次及以上 1 星。 */
export const computeStars = (misses: number): number => {
  if (misses <= 0) return 3;
  if (misses <= 2) return 2;
  return 1;
};

/**
 * 提示目标（用户请求提示时）：按词序返回第一个尚未找到的错误；全部找到返回 undefined。
 * 只提示「罪名 + 大概位置」，不直接给词——方向由我们指，答案让玩家自己找。
 */
export const pickHintTarget = (
  caseItem: HuntCase,
  foundIndexes: number[]
): HuntError | undefined =>
  caseItem.errors.find((error) => !foundIndexes.includes(error.tokenIndex));

/** 提示文案：罪名 + 前半段 / 后半段的大致方位。 */
export const buildHintMessage = (caseItem: HuntCase, error: HuntError): string => {
  const position = error.tokenIndex < caseItem.tokens.length / 2 ? "前半段" : "后半段";
  return `还藏着一处「${GRAMMAR_ERROR_TAG_LABELS[error.tag]}」漏洞，就在这段话的${position}附近——再仔细读读看。`;
};

export interface HuntResultInput {
  caseId: string;
  found: number;
  total: number;
  misses: number;
  durationMs: number;
}

/** 由一局的结果构造 HuntResult（星级自动计算，finishedAt 取当前时间）。 */
export const buildHuntResult = (
  caseItem: HuntCase,
  misses: number,
  durationMs: number,
  startedAt: string
): HuntResult => {
  const elapsedFromStartedAt = Date.now() - new Date(startedAt).getTime();
  const safeDurationMs = Number.isFinite(durationMs) && durationMs >= 0
    ? Math.round(durationMs)
    : Math.max(0, Math.round(elapsedFromStartedAt));

  return {
    id: uid("hunt_result"),
    caseId: caseItem.id,
    found: caseItem.errors.length,
    total: caseItem.errors.length,
    misses: Math.max(0, Math.round(misses)),
    stars: computeStars(Math.max(0, Math.round(misses))),
    durationMs: safeDurationMs,
    finishedAt: nowIso()
  };
};

export interface HuntAttemptInput {
  caseId: string;
  tokenIndex: number;
  guessedTag: GrammarErrorTag | null;
  hit: boolean;
}

/** 追加一次点选记录（不可变）。 */
export const appendHuntAttempt = (data: AppData, input: HuntAttemptInput): AppData => {
  const attempt: HuntAttempt = {
    id: uid("hunt_attempt"),
    caseId: input.caseId,
    tokenIndex: Math.max(0, Math.round(input.tokenIndex)),
    guessedTag: input.guessedTag,
    hit: input.hit,
    createdAt: nowIso()
  };

  return { ...data, huntAttempts: [...data.huntAttempts, attempt] };
};

/** 追加一条破案结算（不可变）。 */
export const appendHuntResult = (data: AppData, result: HuntResult): AppData => ({
  ...data,
  huntResults: [...data.huntResults, result]
});

// ── R02 找错知识缺口 → SM-2 复习队列 ─────────────────────────

/**
 * 由案件原文构造「完整正确句」：把该案的**全部**植错都改正后返回。
 *
 * 2026-09-21 修（P1）：此前直接返回 `caseItem.tokens.join(" ")`，即**含错原文**——
 * 与函数自己的文档（「正面 = 完整正确句」）以及调用方的意图都相反。后果有两层：
 * ① 语法复习页把它当答案判分：用户照抄含错原文得 100 分通过，
 *    而把错处改对反而判不通过（改对越多分越低），判分与题面语义完全相反；
 * ② 通用复习页（/review）对句子卡展示 `back || front`，back 为空时题面就是含错句。
 *
 * 注意修的是**全句**（不只是这张卡针对的那一处）：同一案件会为每个错点各建一张卡，
 * 而每张卡的正面都该是这句完整正确的英文——否则用户复习时会看到、并可能记住
 * 句中残留的其它错形（实测 hunt-birthday-list 的卡里就留着 3 处未改的错）。
 * 「这张卡针对哪个错点」由 grammarNote 记录，不影响正面文本。
 *
 * correction 的几种数据形态都要处理：
 *   - 常规替换："move" → "moved"
 *   - 补词（correction 含原词再加词）："happy" → "is happy"
 *   - 删词型："（去掉 to）" 等 —— 移除该词块。
 *     原实现遇到这类直接返回空串「不成卡」，结果是删词型错法**永远进不了复习队列**；
 *     现在能正确处理，不再漏。
 */
/**
 * 把案件题面的**错句**按 errors 修正成正确句（错词本例句用）。
 * 2026-09-21 批四十导出：此前页面拿不到它，只能退化成 Tokens.join(" ")，
 * 导致错词本里 631/631 张卡的例句都是**含错的原文**——用户为 happy 建卡，
 * 看到的例句正是要改的那句错。
 */
/**
 * 找出一处错点覆盖的 token 跨度 `[起, 止]`。
 *
 * `original` 有两种形态（见 HuntError 文档）：**单词**（`move`，跨度就是它自己）
 * 与**跨 token 短语**（`a dress beautiful`，8 处，`tokenIndex` 只指向其中一个词）。
 *
 * 为什么必须算跨度：旧实现对短语型只替换 `tokenIndex` 那**一个** token，
 * 于是 `She bought a dress beautiful.` 被改成
 * `She bought a dress a beautiful dress.`（原词没删、修正硬贴上去），
 * `I don't know where is it.` 被改成 `where it is it.`——全库实测 **8 处短语型里 7 处**
 * 生成这类粘连病句（2026-09-23 批五十三发现并修）。
 *
 * 定位纪律：先按标点切成句子，只在**本句内**找连续片段，且跨度必须覆盖 `tokenIndex`
 * ——否则 `is he` 这类短语会在别的句子里误命中（`hunt-lost-dog` 与 `hunt-class-intro`
 * 就各有一处 `is he`，跨句找会张冠李戴）。
 */
const spanForError = (tokens: string[], error: HuntError): [number, number] => {
  const words = (error.original ?? "").trim().split(/\s+/).filter(Boolean);
  const fallback: [number, number] = [error.tokenIndex, error.tokenIndex];
  if (words.length < 2) return fallback;
  const index = error.tokenIndex;
  if (index < 0 || index >= tokens.length) return fallback;
  const [lo, hi] = sentenceBounds(tokens, index);
  const normalize = (value: string) => value.replace(/[.,!?;:]+$/, "").toLowerCase();
  const target = words.map(normalize);
  for (let start = lo; start + target.length - 1 <= hi; start += 1) {
    const hit = target.every((word, offset) => normalize(tokens[start + offset]) === word);
    if (hit && index >= start && index <= start + target.length - 1) {
      return [start, start + target.length - 1];
    }
  }
  return fallback;
};

/** 取 index 所在句子的 `[起, 止]`（含句末标点的那个词）。 */
const sentenceBounds = (tokens: string[], index: number): [number, number] => {
  let lo = 0;
  for (let i = index - 1; i >= 0; i -= 1) {
    if (/[.!?]$/.test(tokens[i])) {
      lo = i + 1;
      break;
    }
  }
  let hi = tokens.length - 1;
  for (let i = index; i < tokens.length; i += 1) {
    if (/[.!?]$/.test(tokens[i])) {
      hi = i;
      break;
    }
  }
  return [lo, hi];
};

const CORE_OF = (token: string): string => token.replace(/[.,!?;:]+$/, "");
const PUNCT_OF = (token: string): string => /([.,!?;:]+)$/.exec(token)?.[1] ?? "";

/**
 * 执行一处显式声明的词序移动（批五十四新增）。
 *
 * **为什么不能用中文文案解析**：`move` 的 correction 写的是
 * `把 white 移到 cat 前面` 这种给人看的话，机械解析它做移动，三种实现实测全部产出病句
 * （详见 `HuntEditOp` 文档）。所以移动走**显式下标**：数据里写清
 * `moveFromIndex`（真正搬哪个）/ `moveToIndex`（锚点）/ `movePosition`（前或后）。
 *
 * ⚠️ `moveFromIndex` 可以**不等于** `tokenIndex`——前者是「机器搬哪个」，
 * 后者是「玩家点哪」。样本 `hunt-so-do-i`：用户点 `So`（错处入口），
 * 但机械上要搬 `I` 才能从 `So I do.` 得到 `So do I.`。
 *
 * 搬完之后连带修两件事（**通用规则**，不是逐案的补丁）：
 *   ① **尾标点归位**——句末的 `.` / `?` 属于句子、不属于词。`My friend has a cat white.`
 *      搬完若让 `white` 带着句号走到中间，就得到 `a white. cat`（批五十三实测的第一个病句）。
 *      故：整句先脱标点，再把原句末标点给**新的句末词**。
 *   ② **句首大小写**——搬到句首的词要大写；被挤离句首的词要回到小写。
 *      `Are you used to the noise?`（`You` 让位后变小写）、`Both books are good.`
 *      （`Books` 让位后变小写）都靠这条。
 *
 * **调用前提**（rv11 守门）：本句内**没有**别的错点。否则搬动会挪走尚未处理的错点位置。
 * 全库 18 处均已核对满足；`correctedSentenceOf` 按跨度起点降序处理，故本句在原数组里的
 * 下标此时仍然有效。
 */
const applyMove = (tokens: string[], error: HuntError): boolean => {
  const from = error.moveFromIndex;
  const to = error.moveToIndex;
  const position = error.movePosition;
  if (from === undefined || to === undefined || !position) return false;
  if (from < 0 || from >= tokens.length || to < 0 || to >= tokens.length) return false;

  const [lo, hi] = sentenceBounds(tokens, from);
  const sentenceEnd = PUNCT_OF(tokens[hi]);
  const headWord = CORE_OF(tokens[lo]);

  const moving = CORE_OF(tokens[from]);
  tokens.splice(from, 1);
  const anchor = to > from ? to - 1 : to;
  tokens.splice(position === "before" ? anchor : anchor + 1, 0, moving);

  // ① 整句脱标点 → 原句末标点归给新的句末词
  const length = hi - lo + 1;
  for (let i = lo; i < lo + length && i < tokens.length; i += 1) {
    tokens[i] = CORE_OF(tokens[i]);
  }
  const last = Math.min(lo + length - 1, tokens.length - 1);
  tokens[last] = `${tokens[last]}${sentenceEnd}`;

  // ② 句首大小写：搬到句首的大写；原先在句首、现被挤走的回到小写
  const head = tokens[lo];
  if (head) tokens[lo] = head.charAt(0).toUpperCase() + head.slice(1);
  if (CORE_OF(tokens[lo]) !== headWord) {
    // 原来的句首词还在本句里 → 找出来降为小写（只降它一个，不动专有名词）
    for (let i = lo + 1; i < lo + length && i < tokens.length; i += 1) {
      if (CORE_OF(tokens[i]) === headWord) {
        tokens[i] = tokens[i].charAt(0).toLowerCase() + tokens[i].slice(1);
        break;
      }
    }
  }
  return true;
};

export const correctedSentenceOf = (caseItem: HuntCase): string => {
  const tokens = [...caseItem.tokens];
  /**
   * 先把每处错点的跨度算好（基于原始下标），再按**跨度起点从后往前**改。
   *
   * 从后往前是必须的：删除/整段替换会改变后面 token 的下标，
   * 先处理高下标才不会打乱尚未处理的低下标。按跨度起点（而非 tokenIndex）
   * 排序，是因为短语型的起点可能小于 tokenIndex。
   */
  const edits = caseItem.errors
    .map((error) => ({ error, span: spanForError(tokens, error) }))
    .sort((a, b) => b.span[0] - a.span[0]);
  for (const { error, span } of edits) {
    const [lo, hi] = span;
    if (lo < 0 || hi >= tokens.length) continue;
    const index = lo;
    const correction = error.correction.trim();
    /**
     * 修正文案有时是**中文括注**而非可直接替换的英文（2026-09-21 修，我自己上一版引入的回归）：
     *   「（去掉 to）」          → 删掉该词
     *   「（与 don't 对调）」    → 语序调整，不是替换
     *   「（rather 跟在 would 后）」→ 位置说明
     *   「（drink → drinking 或去掉）」→ 给了两个选项
     * 上一版只认「去掉」开头，于是「（rather 跟在 would 后）」这类被**整段写回句子**，
     * 生成出 `I would （rather 跟在 would 后） walk...` 这样的垃圾句子。
     *
     * 处理原则：这类括注不能直接当替换文本。分三种情况——
     *   ① 含「去掉」→ 删词；
     *   ② 形如「X → Y」→ 取 Y；
     *   ③ 其它纯说明（对调 / 位置说明）→ **不改这一处**（保持原词），
     *      因为句子层没有可靠的机械改法，硬改反而制造病句；该错点仍由 grammarNote 讲清楚。
     */
    /**
     * 操作类型**读 editOp 字段**，不再猜 correction 的字面（2026-09-23 批五十三）。
     *
     * 旧写法用 `/^（?去掉|去掉/` 判删词——`hunt-umbrella-owner#5` 的 correction 恰是
     * `去掉（this book 顺序调整：…）`，字面像删除、实际是移动，于是把它 splice 掉、
     * 卡面变成病句 `Whose book is?`（批五十一修数据、批五十三把判据换成字段）。
     * 现在：`editOp` 是数据自带的类型，`move` / `explain` 一律不动句子层。
     */
    if (error.editOp === "delete") {
      // 跨度内全部删掉（短语型 original 也是整段删）
      tokens.splice(index, hi - lo + 1);
      continue;
    }
    /**
     * 移动型：走**显式下标**执行（2026-09-23 批五十四）。
     *
     * 批五十三时这里是 `continue`（完全不动句子层），因为解析中文文案做移动实测产病句。
     * 批五十四给 `move` 补了 `moveFromIndex` / `moveToIndex` / `movePosition` 三个显式字段，
     * 移动不再需要猜——18 处逐案人工裁定后由 `applyMove` 落地。
     *
     * `explain` 仍保持原样：它连「搬到哪」都没有明确目标（纯位置说明），
     * 句子层没有可执行的动作。
     */
    if (error.editOp === "move") {
      applyMove(tokens, error);
      continue;
    }
    if (error.editOp === "explain") continue;
    if (!correction) continue;

    // 括注里的「X → Y」取 Y（如「（drink → drinking 或去掉）」→ drinking）
    const arrowMatch = /→\s*([A-Za-z][A-Za-z'’\- ]*)/.exec(correction);
    if (arrowMatch) {
      const trailing = /([.,!?;:]+)$/.exec(tokens[hi])?.[1] ?? "";
      tokens.splice(lo, hi - lo + 1, `${arrowMatch[1].trim().replace(/[.,!?;:]+$/, "")}${trailing}`);
      continue;
    }
    // 纯中文说明（含汉字且不是可替换的英文）→ 这一处保持原样，不做机械改动
    if (/[\u4e00-\u9fa5]/.test(correction)) continue;

    /**
     * 尾标点：**correction 自己带的优先，没有才沿用原词的**（2026-09-23 批五十三修）。
     *
     * 原逻辑是「剥掉 correction 的尾标点、一律贴原词的」——于是
     * `sunny` → `correction: "sunny,"` 时逗号被剥掉、再贴回原词的无标点版本，
     * **标点凭空消失**（全库实测 7 处，其中 `reading,` / `test.` 这类是断句修正，
     * 丢了标点整条修正就失效）。
     *
     * 新逻辑：correction 自带尾标点就用它自己的（那是作者的明确意图）；
     * 没带才沿用原 token 的（`rain,` → `rains,` 不吞逗号）。
     */
    const ownTrailing = /([.,!?;:]+)$/.exec(correction)?.[1] ?? "";
    const trailing = ownTrailing || (/([.,!?;:]+)$/.exec(tokens[hi])?.[1] ?? "");
    // 整段替换：短语型 original 会用修正文本换掉整个跨度，不留下原词
    tokens.splice(lo, hi - lo + 1, `${correction.replace(/[.,!?;:]+$/, "")}${trailing}`);
  }
  return tokens.join(" ");
};

/**
 * R02：结案后把本局暴露的知识缺口生成句子卡进入 SM-2 复习队列（tags「语法」，sourceId=hunt:<caseId>）。
 * 缺口判定：hintedTokens（看过提示才找到）∪ wrongTagTokens（罪名归错）——
 * 这两处都是「知道有错但没真正掌握」的信号；一次到位的错误说明本就敏锐，不必重复进队列。
 * 幂等：同一案件 + 同一罪名只收一次（重玩同案不会重复建卡）。
 */
export const addHuntGapSentences = (
  data: AppData,
  caseItem: HuntCase,
  gapTokenIndexes: number[]
): { data: AppData; added: number } => {
  const gapSet = new Set(gapTokenIndexes);
  let next = data;
  let added = 0;
  // 同一案件的每张卡正面都是这句「完整正确句」（见 correctedSentenceOf 说明），
  // 对同案只算一次，避免在每个错点里重复做同样的替换。
  const correctedSentence = correctedSentenceOf(caseItem);
  if (!correctedSentence) return { data: next, added };
  for (const error of caseItem.errors) {
    if (!gapSet.has(error.tokenIndex)) continue;
    const sentence = correctedSentence;
    // 幂等键 = 案件 + 罪名 + 原错词（同案同罪名可能有多处不同错词，如两个不同的过去式，需各自成卡）
    const gapKey = `[${error.tag}:${error.original}]`;
    const duplicated = next.cards.some((card) => {
      if (card.type !== "sentence" || card.sourceId !== `hunt:${caseItem.id}`) return false;
      const details = next.sentenceDetails.find((item) => item.cardId === card.id);
      return details?.grammarNote.includes(gapKey) ?? false;
    });
    if (duplicated) continue;
    next = addSentence(next, {
      sentence,
      translation: "",
      keywords: "",
      grammarNote: `[${error.tag}:${error.original}] ${GRAMMAR_ERROR_TAG_LABELS[error.tag]}：${error.original} → ${error.correction}。${error.explanation}`,
      sourceId: `hunt:${caseItem.id}`,
      note: `找错案件：${caseItem.title}（${GRAMMAR_ERROR_TAG_LABELS[error.tag]}）`,
      tags: "语法"
    });
    added += 1;
  }
  return { data: next, added };
};

export interface HuntTagStat {
  tag: GrammarErrorTag;
  /** 选了这个罪名且命中的次数。 */
  found: number;
  /** 选了这个罪名但没有命中的次数（含误判与选错罪名）。 */
  wrong: number;
}

export interface HuntProgressSummary {
  solvedCaseIds: string[];
  totalCases: number;
  totalMisses: number;
  hitCount: number;
  guessCount: number;
  tagStats: HuntTagStat[];
}

/** 全部罪名枚举：遥测、日记归因、指标统计共用同一份词表（R01 硬依赖：tag 词表唯一来源）。 */
/**
 * ⚠️ 唯一来源声明（2026-09-20 修）：此前这里是手写的 10 项数组，
 * 而 GRAMMAR_ERROR_TAG_LABELS 有 11 项（多一个 comparison）——
 * 两处不一致导致：页面罪名面板出现「比较级」按钮，但点它永远只能得到
 * 「这里确实有问题，但不是比较级」；且日记批改的 tag 白名单按此表过滤，
 * AI 若返回 comparison 会被静默丢弃。
 *
 * 现在从 LABELS 派生：LABELS 是唯一来源，增删罪名只需改一处。
 */
export const GRAMMAR_ERROR_TAGS: GrammarErrorTag[] = Object.keys(
  GRAMMAR_ERROR_TAG_LABELS
) as GrammarErrorTag[];

/**
 * 汇总找错进度：
 * - solved 判定：某个案件的结算里 found === total（total 以案件实际错误数为准）；
 * - totalMisses：所有结算里的误判次数之和；
 * - tagStats：只按「选了某罪名是否命中」统计。
 */
export const summarizeHuntProgress = (data: AppData): HuntProgressSummary => {
  const totalByCaseId = new Map(huntCases.map((caseItem) => [caseItem.id, caseItem.errors.length]));
  const solvedCaseIds = huntCases
    .filter((caseItem) => {
      const total = totalByCaseId.get(caseItem.id) ?? 0;
      return data.huntResults.some((result) => result.caseId === caseItem.id && result.found === total);
    })
    .map((caseItem) => caseItem.id);

  const foundByTag = new Map<GrammarErrorTag, number>();
  const wrongByTag = new Map<GrammarErrorTag, number>();
  let hitCount = 0;

  for (const attempt of data.huntAttempts) {
    if (attempt.hit) hitCount += 1;
    if (!attempt.guessedTag) continue;
    const bucket = attempt.hit ? foundByTag : wrongByTag;
    bucket.set(attempt.guessedTag, (bucket.get(attempt.guessedTag) ?? 0) + 1);
  }

  const tagStats: HuntTagStat[] = GRAMMAR_ERROR_TAGS.map((tag) => ({
    tag,
    found: foundByTag.get(tag) ?? 0,
    wrong: wrongByTag.get(tag) ?? 0
  }));

  return {
    solvedCaseIds,
    totalCases: huntCases.length,
    totalMisses: data.huntResults.reduce((sum, result) => sum + result.misses, 0),
    hitCount,
    guessCount: data.huntAttempts.length,
    tagStats
  };
};
