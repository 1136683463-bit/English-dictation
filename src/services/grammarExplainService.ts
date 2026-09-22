import type { GrammarLesson } from "../types";
import { GRAMMAR_LESSON_BY_ID } from "../data/grammarLessons";
import { GRAMMAR_ERROR_TAGS } from "./huntService";
import { findZeroTermHits } from "../data/grammarZeroTerms";
import { normalizeLessonSentence } from "./lessonService";
import { compareText, diffScore } from "./diffService";

/**
 * 「问一句」本地服务（2026-09-19 PRD R-AI3/R-AI5 本地部分）。
 *
 * 职责（全部纯本地、零网络、可单测）：
 * - 本课素材目录（`allowedSources` + `contentHash`）：AI 只许引用这里的文本
 * - 预设追问生成（确定性、种子化、零 AI——治「不知道该问什么」的冷启动）
 * - 三道校验（零术语 / 长度与形态 / 回指）：AI 输出与缓存命中都要过
 * - 课内配额（≤2 次/课，延迟预算推出来的硬约束）
 *
 * 架构原则（PRD §1）：**预写资产 + AI 增量**——AI 只做选择与改写，
 * 不生成新语法结论；素材不足必须弃权（优于编造）。
 */

// ── 素材目录 ─────────────────────────────────────────────

export interface ExplainSourceEntry {
  /** 素材引用（AI 输出 citedSource 必须回到这里的某个 ref）。 */
  ref: string;
  /** 可引用的文本（面向用户的讲解原文）。 */
  text: string;
}

export interface LessonExplainContext {
  lessonId: string;
  /** 本课可引用素材（deepDive 段落 / contrast.whyZh / guided.explain / oneLineRule / recall.noteZh）。 */
  allowedSources: ExplainSourceEntry[];
  /**
   * 当前作答的运行时素材（attempt:user 用户拼的原句 / attempt:correct 正确句）。
   * 只作校验白名单的补充，**不进 contentHash**——否则每条错句都会 miss 课级缓存，
   * 退化成每次都发请求（课内延迟回升）。缓存区分交给 explainCacheKey 的 question 段。
   */
  attemptSources?: ExplainSourceEntry[];
  /** 素材指纹：课程内容变化即失效缓存。 */
  contentHash: string;
}

/** FNV-1a 32 位哈希（缓存键与 contentHash 用，无需加密强度）。 */
const hashText = (text: string): string => {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
};

/**
 * 构建某课的「可引用素材目录」。
 *
 * deepDive 按段落拆分引用（AI 引用时能指到具体段）；
 * 各字段缺省时安静跳过（旧课部分字段可为空）。
 * 每段文本若含术语，这里**不**删改（清理归 R-AI2 内容工程）——
 * 但 `hasTerms` 会标出，供校验层在引用该条时降权/提示。
 */
export const buildLessonExplainContext = (
  lessonId: string,
  attempt?: { userSentence?: string; correctSentence?: string }
): LessonExplainContext | null => {
  const lesson = GRAMMAR_LESSON_BY_ID.get(lessonId);
  if (!lesson) return null;

  const sources: ExplainSourceEntry[] = [];
  const push = (ref: string, text: string) => {
    const trimmed = text.trim();
    if (trimmed) sources.push({ ref, text: trimmed });
  };

  (lesson.deepDive?.paragraphs ?? []).forEach((paragraph, index) => {
    push(`deepDive:${index}`, paragraph);
  });
  (lesson.contrast ?? []).forEach((contrast, index) => {
    push(`contrast:${index}:why`, contrast.whyZh);
  });
  (lesson.guided ?? []).forEach((step, index) => {
    push(`guided:${index}:explain`, step.explain);
  });
  push("oneLineRule", lesson.oneLineRule);
  if (lesson.recall?.noteZh) push("recall:noteZh", lesson.recall.noteZh);

  if (sources.length === 0) {
    // 连一句话规则都没有的课（理论不存在，防御）：仍给 oneLineRule 兜底
    push("oneLineRule", lesson.oneLineRule);
  }

  const contentHash = hashText(`${lessonId}|${sources.map((entry) => entry.text).join("⟨⟩")}`);

  // M1 术语守门搬家（数析 R4）：术语清理是快照式的、白名单是动态的，
  // 每逢内容批次就会漏。改为构建时过滤——带术语的素材不进白名单，AI 就无法引用它。
  const termClean = (entry: ExplainSourceEntry): boolean => findZeroTermHits(entry.text).length === 0;
  const attemptSources: ExplainSourceEntry[] = [];
  const pushAttempt = (ref: string, text?: string) => {
    const trimmed = (text ?? "").trim();
    // attempt 素材来自用户输入/答案句，若含术语同样不进白名单（红线优先）
    if (trimmed && termClean({ ref, text: trimmed })) attemptSources.push({ ref, text: trimmed });
  };
  pushAttempt("attempt:user", attempt?.userSentence);
  pushAttempt("attempt:correct", attempt?.correctSentence);

  return {
    lessonId,
    allowedSources: sources.filter(termClean),
    attemptSources,
    contentHash
  };
};

/**
 * B2（M2）：把 citedSource 的 ref 翻译成人话来源标签，供回答卡上屏。
 * 此前卡片永远只显示「来自：这一课的讲解」——可追溯性是我们对外的核心差异化
 * （AI 每条讲解都能回指课内素材），不上屏等于把差异化藏起来。
 */
export const describeExplainSource = (ref: string | null | undefined): string => {
  if (!ref) return "这一课的讲解";
  if (ref === "attempt:user") return "你自己拼的那句";
  if (ref === "attempt:correct") return "这句的正确说法";
  if (ref === "oneLineRule") return "这一课的一句话规则";
  if (ref === "recall:noteZh") return "这一课的「忆」讲解";
  if (ref.startsWith("deepDive:")) return "这一课的深挖卡";
  const contrastMatch = /^contrast:(\d+):why$/.exec(ref);
  if (contrastMatch) return `这一课的第 ${Number(contrastMatch[1]) + 1} 组对比`;
  const guidedMatch = /^guided:(\d+):explain$/.exec(ref);
  if (guidedMatch) return `这一课的第 ${Number(guidedMatch[1]) + 1} 道引导题`;
  return "这一课的讲解";
};

// ── 预设追问（确定性生成，零 AI）──────────────────────────────

export interface PresetQuestion {
  /** 问题文本（展示给用户的 chip）。 */
  text: string;
  /** 生成依据（素材引用，校验「每条都能在本课找到出处」）。 */
  basedOnRef: string;
}

/**
 * 预设追问生成器：从本课素材按优先级取，种子化保证同课一致（可回放）。
 *
 * 治「不知道该问什么」的冷启动——用户点击即问，不需要打字。
 * 优先级（Shape of AI follow-up 模式：锚在刚看过的内容上、短而可扫）：
 * ① contrast 差异组 → 「为什么这句说 X 不是 Y？」（wrongMark 非空优先）
 * ② variants 形态差 → 「换个人说 / 说成没做，怎么变？」
 * ③ oneLineRule 边界 → 「什么时候不能这么说？」
 * ④ deepDive 首段 → 「和上一课有什么区别？」（兜底）
 */
export const buildPresetQuestions = (lessonId: string, limit = 3): PresetQuestion[] => {
  const lesson = GRAMMAR_LESSON_BY_ID.get(lessonId);
  if (!lesson) return [];

  const questions: PresetQuestion[] = [];

  // ① contrast 差异（优先取带 wrongMark 的：差异明确、问题具体）
  const markedContrast = (lesson.contrast ?? []).find((contrast) => contrast.wrongMark?.trim() && !contrast.bothRight);
  const fallbackContrast = (lesson.contrast ?? []).find((contrast) => !contrast.bothRight);
  const contrastPick = markedContrast ?? fallbackContrast;
  if (contrastPick) {
    const shortWrong = contrastPick.wrong.replace(/[.?!]+$/, "");
    const shortCorrect = contrastPick.correct.replace(/[.?!]+$/, "");
    if (normalizeLessonSentence(shortWrong) !== normalizeLessonSentence(shortCorrect)) {
      questions.push({
        text: `为什么是「${shortCorrect}」，不是「${shortWrong}」？`,
        basedOnRef: `contrast:${(lesson.contrast ?? []).indexOf(contrastPick)}:why`
      });
    }
  }

  // ② variants 形态差
  const nonAffirmVariant = (lesson.variants ?? []).find((variant) => variant.label !== "肯定" && variant.en.trim());
  if (nonAffirmVariant) {
    questions.push({
      text: `「${nonAffirmVariant.label}」的说法，整句要怎么变？`,
      basedOnRef: "oneLineRule"
    });
  }

  // ③ oneLineRule 边界
  if (lesson.oneLineRule.trim()) {
    questions.push({
      text: "什么时候不能这么说？",
      basedOnRef: "oneLineRule"
    });
  }

  // ④ deepDive 首段（兜底，仅当上面不足）
  if (questions.length < 2 && (lesson.deepDive?.paragraphs?.length ?? 0) > 0) {
    questions.push({
      text: `这一课讲的这个，和之前学的有什么区别？`,
      basedOnRef: "deepDive:0"
    });
  }

  return questions.slice(0, limit);
};

// ── 三道校验（AI 输出与缓存命中都要过）────────────────────────

export type ExplainValidationFailure = "term" | "length" | "foreign" | "citation";

export interface ExplainAnswer {
  /** 回答正文（≤120 字，≤2 句）。 */
  answer: string;
  /** 引用的素材 ref（必须 ∈ allowedSources）。 */
  citedSource: string | null;
  /** 罪名归因（可选，11 类之一）。 */
  errorTag?: string;
  /** 弃权标记：素材不足时 true，answer 为固定话术。 */
  declined: boolean;
}

export const DECLINED_ANSWER = "这一课没讲到这个，我不瞎猜。";

/** 校验失败原因的结构化结果。 */
export interface ValidationResult {
  ok: boolean;
  failure?: ExplainValidationFailure;
  hits?: string[];
}

/**
 * 三道校验（PRD §4.4）：任一不过即整条丢弃，绝不直接下发。
 * ① 零术语：与课程正文同一张表（GRAMMAR_ZERO_TERMS）
 * ② 长度与形态：≤120 字、无 markdown、英文片段逐字存在于被引素材
 * ③ 回指：citedSource ∈ allowedSources；declined=false 时不得为空
 */
export const validateExplainAnswer = (
  answer: ExplainAnswer,
  context: LessonExplainContext
): ValidationResult => {
  // ① 零术语
  const termHits = findZeroTermHits(answer.answer);
  if (termHits.length > 0) return { ok: false, failure: "term", hits: termHits };

  // ② 长度与形态
  if (answer.answer.length > 120) return { ok: false, failure: "length" };
  if (/```|^\s*[-*#>]/m.test(answer.answer)) return { ok: false, failure: "length" };

  // 弃权：话术固定，无需后续校验
  if (answer.declined) return { ok: true };

  // ③ 回指
  if (!answer.citedSource) return { ok: false, failure: "citation" };
  const cited = [...context.allowedSources, ...(context.attemptSources ?? [])]
    .find((entry) => entry.ref === answer.citedSource);
  if (!cited) return { ok: false, failure: "citation" };

  // 英文片段必须逐字存在于**白名单内某条素材**（防 AI 造新例句）。
  // 不再要求限定在被引的那一条：讲对比时必须同时提正误两句
  // （答案引 attempt:correct、句中含 attempt:user 的原句），限定单条会把这类
  // 贴题回答一律打回——这正是「AI 只会说通用话术」的机械成因。
  const englishChunks = answer.answer.match(/[A-Za-z][A-Za-z'\s-]{2,}/g) ?? [];
  const whitelistTexts = [...context.allowedSources, ...(context.attemptSources ?? [])]
    .map((entry) => entry.text);
  for (const chunk of englishChunks) {
    const clean = chunk.trim().replace(/[.,!?;:]+$/, "");
    if (clean.length >= 3 && !whitelistTexts.some((text) => text.includes(clean))) {
      return { ok: false, failure: "foreign" };
    }
  }

  // errorTag 合法性（11 类之一；非法丢弃字段不阻断——对齐日记契约）
  if (answer.errorTag && !GRAMMAR_ERROR_TAGS.includes(answer.errorTag as never)) {
    // 视为无 tag，不阻断
  }

  return { ok: true };
};

// ── 课内配额（≤2 次/课）────────────────────────────────────

/** 课内交互式 AI 配额：单课 6–10min 预算已贴顶，最坏 +16s ≈ +2.7% 是上限。 */
/**
 * 课内 AI 配额（2026-09-22 改为**不限次**）。
 *
 * 变更史：曾经是 ≤2 次/课（按延迟预算推出来的硬约束），后来因为「问一句」与
 * 「答错追问」共用这一个配额，用户实测「问了一次之后再也问不了」。
 * 产品负责人拍板：**这是自学工具，不是考试——不设配额，想问几次问几次**。
 *
 * 保留 createExplainQuota 的意义：它仍是**语义计数器**（记录本课用了多少次，
 * 供遥测与 UI 显示），只是 canAsk() 恒为真；`refund()` 仍在失败时回退计数，
 * 让「实际成功次数」准确。
 */
export const EXPLAIN_QUOTA_PER_LESSON = Number.POSITIVE_INFINITY;

/**
 * 配额计数器（组件会话内）。
 * 用法：const quota = createExplainQuota(); quota.canAsk(); quota.consume();
 */
export const createExplainQuota = () => {
  let used = 0;
  return {
    /** 不设配额：恒为真（保留方法以兼容既有调用点与语义）。 */
    canAsk: () => true,
    consume: () => {
      used += 1;
      return used;
    },
    /**
     * A2 退还配额（M1，2026-09-21）：失败/降级不该消耗用户的提问机会。
     * 此前 consume() 在发请求前执行，两次失败后入口永久消失而用户从未得到解释——
     * 这正是用户反馈「有时候有按钮有时候没有」的机械成因。
     */
    refund: () => {
      if (used > 0) used -= 1;
      return used;
    },
    /** 本课已用次数（无配额后不再有「剩余」概念；保留供遥测/展示）。 */
    usedCount: () => used,
    remaining: () => Number.POSITIVE_INFINITY
  };
};

// ── 缓存键 ───────────────────────────────────────────────

/** 问题归一化（去空白标点、小写）——同义提问能命中同一缓存。 */
export const normalizeQuestion = (question: string): string =>
  question
    .toLowerCase()
    // 半角 + 全角标点（？ ！ ， 。 、 等）都剥——中文输入法的标点不该让缓存 miss
    .replace(/[.,!?;:'"()\s，。？！、；：""''（）]/g, "")
    .trim();

/** 缓存键：同课同锚点同问题同模型同内容指纹才命中。 */
export const explainCacheKey = (
  lessonId: string,
  anchorRef: string,
  question: string,
  model: string,
  contentHash: string
): string => `${lessonId}:${anchorRef}:${hashText(normalizeQuestion(question))}:${model}:${contentHash}`;


// ── 「为什么错了」本地匹配器（R-WW1，2026-09-19 PRD）──────────────────
//
// 三级解答链的本地层：用户错句 → 本课 contrast.wrong 的错因（whyZh）。
// 纪律（PRD §4.3）：精确优先；近似 diffScore ≥85 且只同课内检索；
// 换序形（词多重集相等而顺序不同）短路跳过近似层（模拟 85 线 0 命中，绝不硬接）；
// 70–84 一律不命中；匹配不上宁可走 AI/兜底，绝不给错误错因。

export type WhyWrongMatchSource = "local_exact" | "local_fuzzy";

export interface WhyWrongMatch {
  source: WhyWrongMatchSource;
  /** 命中的错因讲解（人工写好的 whyZh）。 */
  whyZh: string;
  /** 命中的素材引用（供解答卡「来自」行与遥测 citedRef）。 */
  citedRef: string;
  /** 近似命中时的相似度（精确命中无此字段）。 */
  diffScoreAtMatch?: number;
  /** 近似命中：正确句（供「照着拼」对照，不自动揭示）。 */
  correctSentence?: string;
}

/** 词多重集相等（换序形判定）：同词不同序。 */
const wordMultisetsEqual = (a: string, b: string): boolean => {
  const wordsA = normalizeLessonSentence(a).split(" ").filter(Boolean).sort().join("|");
  const wordsB = normalizeLessonSentence(b).split(" ").filter(Boolean).sort().join("|");
  return wordsA === wordsB;
};

/** 按组抽取本课可匹配的错句三元组（wrong → whyZh，排除 bothRight）。 */
const wrongTriplesOf = (lesson: GrammarLesson): Array<{ wrong: string; whyZh: string; correct: string; index: number }> =>
  (lesson.contrast ?? [])
    .map((contrast, index) => ({ contrast, index }))
    .filter(({ contrast }) => !contrast.bothRight && contrast.wrong.trim() && contrast.whyZh.trim())
    .map(({ contrast, index }) => ({
      wrong: contrast.wrong.trim(),
      whyZh: contrast.whyZh.trim(),
      correct: contrast.correct.trim(),
      index
    }));

/** wrongMark 非空优先的比较器（同课多组命中时的确定性排序）。 */
const byMarkPriority = (a: { marked: boolean; order: number }, b: { marked: boolean; order: number }): number =>
  a.marked === b.marked ? a.order - b.order : a.marked ? -1 : 1;

/**
 * 本地匹配器：用户错句 → 错因讲解。
 *
 * 两级检索（都只限同课）：
 * ① 精确：normalizeLessonSentence 全等（归一化剥标点大小写）——零风险
 * ② 近似：diffScore ≥85（数析模拟：85 线同课冲突 3/1864、全库 0）；
 *    换序形短路（词多重集相等→顺序不同 → 不走近似层）
 *
 * 返回 null = 本地没把握（调用方落 AI 层或兜底话术，绝不编造）。
 */
export const matchWhyWrong = (
  lessonId: string,
  userWrongSentence: string
): WhyWrongMatch | null => {
  const lesson = GRAMMAR_LESSON_BY_ID.get(lessonId);
  if (!lesson) return null;
  const userNormalized = normalizeLessonSentence(userWrongSentence);
  if (!userNormalized) return null;

  const triples = wrongTriplesOf(lesson);
  if (triples.length === 0) return null;

  // ① 精确匹配：归一化全等
  const exact = triples
    .map((triple, order) => ({
      triple,
      marked: (lesson.contrast?.[triple.index]?.wrongMark ?? "").trim().length > 0,
      order
    }))
    .filter(({ triple }) => normalizeLessonSentence(triple.wrong) === userNormalized)
    .sort((a, b) => byMarkPriority(a, b))[0];
  if (exact) {
    return {
      source: "local_exact",
      whyZh: exact.triple.whyZh,
      citedRef: `contrast:${exact.triple.index}:why`,
      correctSentence: exact.triple.correct
    };
  }

  // 换序形短路：用户错句的词与某组 wrong 的词完全相同但顺序不同 →
  // diffScore 的逐词对位不认顺序交换（85 线 0 命中），近似层绝不硬接
  for (const triple of triples) {
    if (wordMultisetsEqual(userWrongSentence, triple.wrong)) return null;
  }

  // ② 近似匹配：diffScore ≥85，同课内检索，取最高分（同分取 wrongMark 优先）
  const scored = triples
    .map((triple) => ({
      triple,
      score: diffScore(compareText(triple.wrong, userWrongSentence, false))
    }))
    .filter((entry) => entry.score >= 85)
    .sort((a, b) => b.score - a.score);
  if (scored.length === 0) return null;
  const top = scored[0];
  const topMarked = (lesson.contrast?.[top.triple.index]?.wrongMark ?? "").trim().length > 0;
  const tied = scored.filter((entry) => entry.score === top.score);
  const picked = tied.length > 1
    ? tied
        .map((entry, order) => ({
          entry,
          marked: (lesson.contrast?.[entry.triple.index]?.wrongMark ?? "").trim().length > 0,
          order
        }))
        .sort((a, b) => byMarkPriority(a, b))[0].entry
    : top;

  return {
    source: "local_fuzzy",
    whyZh: picked.triple.whyZh,
    citedRef: `contrast:${picked.triple.index}:why`,
    diffScoreAtMatch: picked.score,
    correctSentence: picked.triple.correct
  };
};


// ── 结构错因解释器（兜底层不再只说「不对」，2026-09-19 用户反馈）──────
//
// 背景：三级解答链的 L3 兜底原本只有一句「答案不对哦——再检查一下」。
// 但点词成句题里用户拼的词块和正确答案都是已知的词序列，多词/缺词/换序/
// 用错词这些结构性错因可以在本地零风险地确定性讲出来——AI 不可用时也
// 应该告诉用户「为什么不对」，而不是让他自己猜。

/** 结构错因解释（compareText 逐词对比的可读版）。 */
export interface StructuralWhy {
  /** 一句话错因（零术语、贴着用户拼的词说）。 */
  whyZh: string;
  /** 正确答案（供「照着拼」对照）。 */
  answer: string;
  /** 错法类别（遥测用）。 */
  kind: "swap" | "extra" | "missing" | "wrong-word" | "mixed";
}

/**
 * 对比用户拼的句子与正确答案，给出确定性的结构错因。
 * 只陈述可从词块序列直接推出的事实，不猜测语法意图——所以零风险。
 * 完全一致时返回 null（调用方不该在答对时调这个）。
 */
export const explainStructuralWhy = (userSentence: string, answer: string): StructuralWhy | null => {
  const wordsOf = (value: string): string[] =>
    normalizeLessonSentence(value).split(" ").filter(Boolean);
  const userWords = wordsOf(userSentence);
  const answerWords = wordsOf(answer);
  if (userWords.length === 0 || answerWords.length === 0) return null;
  if (userWords.join(" ") === answerWords.join(" ")) return null;

  // 换序形：词完全相同、顺序不同 → 指出第一个错位，讲「英语的语序」
  if (userWords.length === answerWords.length) {
    const wrongAt = userWords.findIndex((word, index) => word !== answerWords[index]);
    if (wrongAt >= 0 && [...userWords].sort().join("|") === [...answerWords].sort().join("|")) {
      const rightHere = answerWords[wrongAt];
      return {
        whyZh: `词都用对了，但顺序不对：第 ${wrongAt + 1} 个位置应该是「${rightHere}」，你放了「${userWords[wrongAt]}」。英语靠词的先后表达意思，先说谁、再说谁不能换。`,
        answer,
        kind: "swap"
      };
    }
  }

  // 多余词：找出答案里没有的那些词
  const answerPool = new Map<string, number>();
  for (const word of answerWords) answerPool.set(word, (answerPool.get(word) ?? 0) + 1);
  const extras = userWords.filter((word) => {
    const left = answerPool.get(word) ?? 0;
    if (left > 0) {
      answerPool.set(word, left - 1);
      return false;
    }
    return true;
  });
  // 缺失词：排除多余后，答案里还剩的就是用户没用上的
  const userPool = new Map<string, number>();
  for (const word of userWords) userPool.set(word, (userPool.get(word) ?? 0) + 1);
  const missing = answerWords.filter((word) => {
    const left = userPool.get(word) ?? 0;
    if (left > 0) {
      userPool.set(word, left - 1);
      return false;
    }
    return true;
  });

  const quote = (list: string[]): string =>
    list.slice(0, 3).map((word) => `「${word}」`).join("、") + (list.length > 3 ? " 等" : "");

  if (extras.length > 0 && missing.length === 0) {
    return {
      whyZh: `「${quote(extras)}」在这句里用不上——这句要说的意思不需要它，去掉再读一遍。`,
      answer,
      kind: "extra"
    };
  }
  if (extras.length === 0 && missing.length > 0) {
    return {
      whyZh: `还差「${quote(missing)}」没放进去——缺了它意思就不完整了。`,
      answer,
      kind: "missing"
    };
  }
  if (extras.length > 0 && missing.length > 0) {
    // 一对一换词：明确说「这个位置该用那个词」；否则两边都报
    if (extras.length === missing.length && extras.length === 1) {
      return {
        whyZh: `这里该用「${missing[0]}」而不是「${extras[0]}」——意思差在这个词上。`,
        answer,
        kind: "wrong-word"
      };
    }
    return {
      whyZh: `「${quote(extras)}」用不上，而且「${quote(missing)}」还没放进去——对照正确答案的词再看一遍。`,
      answer,
      kind: "mixed"
    };
  }
  // 词都对、个数也对但不换序就不成立的情况只会是换序形（上面已返回），
  // 走到这里说明词集相同但 findIndex 没找到——不可能；保守给混合描述。
  return {
    whyZh: "词都对，但顺序和正确答案不一样——对照答案调整先后。",
    answer,
    kind: "mixed"
  };
};


// ── 错句本地留痕（R-WW8）──────────────────────────────────────
//
// 背景：用户实际拼出的错句此前不落盘（saveMistakeIfNeeded 只存正确答案句），
// 导致「458 组素材对真实错法的命中率」只能靠模拟推断。单人自用无隐私顾虑，
// 一条旁路追加即可解锁实测——它是 Gate-1 之后所有覆盖面决策的数据地基。

const WHY_WRONG_LOG_KEY = "grammar-why-wrong-log-v1";
const WHY_WRONG_LOG_MAX = 500;

export interface WhyWrongLogEntry {
  lessonId: string;
  stepIndex: number;
  /** 错句原文（本地单人自用，无隐私顾虑）。 */
  wrongSentence: string;
  /** 匹配来源（local_exact / local_fuzzy / ai / fallback）。 */
  matchSource: string;
  ts: string;
}

const hasLocalStorage = (): boolean => {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
};

/** 追加一条错句留痕（≤500 条滚动淘汰；失败静默，不影响主流程）。 */
export const appendWhyWrongLog = (entry: WhyWrongLogEntry): void => {
  if (!hasLocalStorage()) return;
  try {
    const raw = window.localStorage.getItem(WHY_WRONG_LOG_KEY);
    const parsed = raw ? (JSON.parse(raw) as { entries?: WhyWrongLogEntry[] }) : {};
    const entries = Array.isArray(parsed.entries) ? parsed.entries : [];
    entries.push(entry);
    const kept = entries.length > WHY_WRONG_LOG_MAX ? entries.slice(entries.length - WHY_WRONG_LOG_MAX) : entries;
    window.localStorage.setItem(WHY_WRONG_LOG_KEY, JSON.stringify({ version: 1, entries: kept }));
  } catch {
    // 静默
  }
};

/** 读取留痕（命中率实测与内容侧补素材决策用）。 */
export const listWhyWrongLog = (): WhyWrongLogEntry[] => {
  if (!hasLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(WHY_WRONG_LOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { entries?: WhyWrongLogEntry[] };
    return Array.isArray(parsed.entries) ? parsed.entries : [];
  } catch {
    return [];
  }
};

/** 清空错句留痕（测试与排查用）。 */
export const clearWhyWrongLog = (): void => {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.removeItem(WHY_WRONG_LOG_KEY);
  } catch {
    // 忽略
  }
};

/** 本地命中率实测：命中素材的错句 / 全部错句（Gate-1 后读数用）。 */
export const whyWrongHitRate = (): { total: number; matched: number; rate: number } => {
  const entries = listWhyWrongLog();
  const matched = entries.filter((entry) => entry.matchSource === "local_exact" || entry.matchSource === "local_fuzzy").length;
  return { total: entries.length, matched, rate: entries.length === 0 ? 0 : matched / entries.length };
};

// ── 讲解质量升级层（2026-09-19「吃透规则」改造）──────────────────────────
//
// 背景（用户实测反馈）：guided.explain 有 147/761 条是「复述答案」或过短
// （如 L96 choose 的「动作穿 -ing 外套：It was raining。」只是把答案念一遍），
// practice 答对讲解 66% 落到整课通用规则（对具体句子答非所问）。
//
// 原则：**只升级、不降级**——本课素材里能找到更贴题的就用素材，找不到就保留
// 原文；所有匹配都是严格相等/精确字段匹配，绝不关键词猜配（曾把「he 是单数」
// 配到 "What are you doing?"，讲错比不讲更糟）。deepDive 借句必须过零术语表。

/**
 * 判断一条 explain 是否「薄」：过短（<20 字符），或只是把答案句复述一遍。
 * 复述阈值：剥掉答案句后剩的独立内容 ≤26 字符——这些条目只是「把答案换个说法再念一次」
 * （「动作穿 -ing 外套：It was raining。」「问句把 Is 搬到句首。」），
 * 分布实测在 4–26 字符间密集出现、27+ 才开始有真正的补充内容（33/26 是分界样本）。
 */
export const isThinExplain = (explain: string, answerSentence: string): boolean => {
  const trimmed = explain.trim();
  if (!trimmed) return true;
  if (trimmed.length < 20) return true;
  const normSelf = normalizeLessonSentence(trimmed);
  const normAnswer = normalizeLessonSentence(answerSentence);
  if (!normSelf || !normAnswer) return false;
  if (!normSelf.includes(normAnswer)) return false;
  const rest = normSelf.replace(normAnswer, "").trim();
  return rest.length <= 26;
};

/** 句子级素材查找（严格相等）：contrast 正确句 → whyZh；variants 同句 → noteZh；sceneSwings 同句 → zh。 */
const findSentenceMaterial = (lesson: GrammarLesson, sentence: string): string => {
  const normalized = normalizeLessonSentence(sentence);
  if (!normalized) return "";
  const contrast = (lesson.contrast ?? []).find(
    (item) => normalizeLessonSentence(item.correct) === normalized
      && item.whyZh?.trim() && findZeroTermHits(item.whyZh).length === 0
  );
  if (contrast?.whyZh?.trim()) return contrast.whyZh.trim();
  const variant = (lesson.variants ?? []).find(
    (item) => normalizeLessonSentence(item.en) === normalized
      && item.noteZh?.trim() && findZeroTermHits(item.noteZh).length === 0
  );
  if (variant?.noteZh?.trim()) return variant.noteZh.trim();
  // sceneSwings.zh 是场景译文不是讲解体（配过去等于答非所问），不作为讲解源。
  return "";
};

/**
 * guided 题的最终讲解：thin/复述 explain 自动从本课素材升级。
 *
 * 升级源优先级（都是「与本题直接相关」的解释）：
 * ① contrast.wrongMark == answer 的对比卡 whyZh（spot 题最高置信：wrongMark 就是那个错词）
 * ② 本题完整句的句子级素材（contrast 正确句 / variants.noteZh / sceneSwings）
 * ③ deepDive 段落里同时含答案词、零术语、长度合适的单句（借课内正文，不新造结论）
 * ④ 原文保留（可能薄，但绝不比猜配的更错）
 */
export const resolveGuidedExplain = (step: { kind: string; answer: string; before?: string; after?: string; replaceBase?: string; explain: string }, lesson: GrammarLesson): string => {
  const original = step.explain?.trim() ?? "";
  // 借来的素材若自带术语（第 26/30 课等早于清理批次的 whyZh），宁可保留原文也不越过红线。
  const usable = (text: string): boolean => text.trim().length > 0 && findZeroTermHits(text).length === 0;
  const fullSentence = step.replaceBase?.trim()
    || [step.before?.trim() ?? "", step.answer.trim(), step.after?.trim() ?? ""].join(" ").replace(/\s+/g, " ").trim()
    || step.answer.trim();
  if (!isThinExplain(original, fullSentence)) return original;

  const answerWord = step.answer.trim().toLowerCase().replace(/[.,!?]/g, "");
  // ① 仅 spot：wrongMark 精确 == 错词 → 该对比卡的 whyZh。
  // spot 的 answer 本来就是那个错词，解释「这个词错在哪」正中靶心；
  // choose/arrange 的 answer 是**用对了**的词——「have 要换成 has」那类解释配上去是反的，
  // 曾把「说她的用 has」配到答案为 have 的题上。
  if (step.kind === "spot" && answerWord) {
    const byMark = (lesson.contrast ?? []).find(
      (item) => !item.bothRight && item.wrongMark
        && item.wrongMark.toLowerCase().replace(/[.,!?]/g, "") === answerWord
        && item.whyZh?.trim()
    );
    if (byMark?.whyZh?.trim() && usable(byMark.whyZh)) return byMark.whyZh.trim();
  }
  // ② 本题完整句的句子级素材
  // 借来的素材自己也不能是复述/过短句（「It was + 穿 -ing。」换汤不换药）。
  const rich = (text: string): boolean => usable(text) && !isThinExplain(text, fullSentence);
  // choose/replace 考的就是空位上那个词——讲解必须提到它，讲句子里别的零件等于答非所问。
  const mentionsAnswer = (text: string): boolean =>
    step.kind !== "choose" && step.kind !== "replace" || answerWord.length > 2 && text.toLowerCase().includes(answerWord);

  // ② 本题完整句的句子级素材
  const sentenceMaterial = findSentenceMaterial(lesson, fullSentence);
  if (sentenceMaterial && rich(sentenceMaterial) && mentionsAnswer(sentenceMaterial)) return sentenceMaterial;

  // ③ deepDive 借句：含答案词 + 零术语 + 18~90 字符的单句
  const paragraphs = lesson.deepDive?.paragraphs ?? [];
  for (const paragraph of paragraphs) {
    const hit = paragraph
      .split(/(?<=[。！？])/)
      .map((piece) => piece.trim())
      .find((piece) => piece.length >= 18 && piece.length <= 110
        && findZeroTermHits(piece).length === 0
        && answerWord.length > 2 && piece.toLowerCase().includes(answerWord));
    if (hit && rich(hit) && mentionsAnswer(hit)) return hit;
  }
  return original;
};

/**
 * 任意句子在某一课内的「为什么」讲解（practice/boost/回访通用）：
 * ① contrast 精确正确句 → whyZh ② variants 同句 → noteZh ③ sceneSwings 同句 → zh
 * ④ recall.noteZh（该句出自忆段时） ⑤ oneLineRule 兜底。
 * 与 practiceWhy 的页面内实现同一优先序；这里是给 boost/回访等服务用的共享版。
 */
export const explainForSentence = (lesson: GrammarLesson, sentence: string): string => {
  const sentenceMaterial = findSentenceMaterial(lesson, sentence);
  if (sentenceMaterial) return sentenceMaterial;
  if (lesson.recall?.noteZh?.trim()) return lesson.recall.noteZh.trim();
  return lesson.oneLineRule;
};
