import type { GrammarErrorTag } from "../types";
import { grammarLessons } from "../data/grammarLessons";
import { huntCases } from "../data/huntCases";
import { GRAMMAR_ERROR_TAG_PLAIN } from "./huntService";
import { findZeroTermHits } from "../data/grammarZeroTerms";

/**
 * C4（M3，2026-09-21）「你的三句话」复盘课：从 Top3 弱点自动拼一节可走通的复盘课。
 *
 * 竞析建议（对齐 Speak Premium Plus 的「由你的错误构建的定制复习」，〔已核实〕）：
 * 把弱点档案的输出**变成一门真课**，而不是只给一张列表。
 *
 * 硬约束（PRD §4 C4）：
 * - **素材 100% 可溯源**：全部来自已写好的 huntCases.errors 与课程 practice，不生成新结论
 * - **零术语守门**：题面/讲解命中术语则跳过该素材（红线优先于覆盖率）
 * - 复用现有判题内核（checkLessonTokens / 词块校验），不引入新判分逻辑
 * - 不写盘、不进 SM-2（复盘课是即时提取练习，不是新知识点）
 */

/** 复盘课的单道题：来源全部可追溯（sourceLessonId / sourceCaseId 二者至少其一）。 */
export interface ReplayItem {
  kind: "spot" | "arrange";
  /** 罪名（用于归因与展示）。 */
  tag: GrammarErrorTag;
  /** 罪名的人话说明（过零术语守门）。 */
  plain: string;
  /** 题面提示（中文）。 */
  promptZh: string;
  /** spot：含错的词块序列（点出那个错词）。 */
  tokens?: string[];
  /** spot：藏了问题的词块（命中即通过）。 */
  wrongToken?: string;
  /** spot：点对后的纠正说法。 */
  correctionZh?: string;
  /** arrange：正确答案句。 */
  answer: string;
  /** 讲解（来自案件的 explanation，已过零术语守门）。 */
  explainZh: string;
  /** 溯源：来源课 id。 */
  sourceLessonId: string;
  /** 溯源：来源案件 id（spot 题来自案件）。 */
  sourceCaseId?: string;
}

export interface ReplayLesson {
  /** 标题用的罪名清单（Top N）。 */
  tags: GrammarErrorTag[];
  items: ReplayItem[];
  /** 若素材不足则为空——调用方据此隐藏入口（宁可不给，不给残缺的课）。 */
  isEmpty: boolean;
}

/** 复盘课题量上限：3–5 题，几分钟可走完（对齐「趁热练」的轻量定位）。 */
export const REPLAY_MAX_ITEMS = 5;
/** 至少要有这么多题才值得成课。 */
export const REPLAY_MIN_ITEMS = 3;

const cleanToken = (token: string): string => token.replace(/[.,!?;:]+$/, "").trim();

/**
 * 可点的答案必须是真的英文词块——案件 explanation 的 correction 字段有时是
 * 中文动作描述（如「去掉 so」），那不是词块、点不了。含中文一律跳过该素材。
 */
const isEnglishToken = (token: string): boolean =>
  token.trim().length > 0 && !/[\u4e00-\u9fff]/.test(token);

/**
 * 从 Top3 弱点拼一节复盘课。
 *
 * @param topTags 按权重排序的罪名（来自 computeWeakSpotsReport().active）
 */
export const buildReplayLesson = (topTags: GrammarErrorTag[]): ReplayLesson => {
  const tags = topTags.slice(0, 3);
  if (tags.length === 0) return { tags, items: [], isEmpty: true };

  const items: ReplayItem[] = [];
  const usedCases = new Set<string>();
  const usedAnswers = new Set<string>();

  /**
   * 第一轮：**每个 Top 罪名各出一题**（保证覆盖——否则会被素材多的罪名淹没，
   * 实测「missing_be + fragment + run_on」会退化成 5 题全是 run_on）。
   * 第二轮再补同罪名的额外素材。
   */
  for (const tag of tags) {
    const plain = GRAMMAR_ERROR_TAG_PLAIN[tag] ?? "";
    // 罪名说明带术语则跳过（题面与讲解都要干净）
    if (!plain || findZeroTermHits(plain).length > 0) continue;

    // ① spot 题：从含该罪名的案件里选题（素材 100% 可溯源到 huntCases）
    const candidateCases = (huntCases as Array<{
      id: string;
      tokens: string[];
      errors: Array<{ tokenIndex: number; tag: GrammarErrorTag; original: string; correction: string; explanation: string }>;
    }>).filter((item) => item.errors.some((error) => error.tag === tag));

    for (const huntCase of candidateCases) {
      if (items.length >= REPLAY_MAX_ITEMS) break;
      if (usedCases.has(huntCase.id)) continue;
      const error = huntCase.errors.find((entry) => entry.tag === tag);
      if (!error) continue;
      // 讲解必须零术语（案件 explanation 是预写素材，仍要过红线）
      if (findZeroTermHits(error.explanation).length > 0) continue;
      const wrongToken = huntCase.tokens[error.tokenIndex];
      if (!wrongToken || cleanToken(wrongToken).length === 0) continue;
      // 答案词 = 被点出的那个词块本身（tokens[tokenIndex] 必定是题面里的真实词块）。
      // 注意 correction 是「改成什么」的说明，常含中文（「去掉 so,」），不能当答案。
      if (!isEnglishToken(wrongToken)) continue;
      // 溯源：找到引用了该案件的课（用于「出自第 N 课」）
      const sourceLesson = (grammarLessons as Array<{ id: string; huntCaseIds?: string[] }>)
        .find((lesson) => (lesson.huntCaseIds ?? []).includes(huntCase.id));
      if (!sourceLesson) continue;

      usedCases.add(huntCase.id);
      items.push({
        kind: "spot",
        tag,
        plain,
        promptZh: `这句里藏着一个「${plain}」的毛病——点出来。`,
        tokens: huntCase.tokens,
        wrongToken,
        correctionZh: `${error.original} → ${error.correction}`,
        answer: cleanToken(wrongToken),
        explainZh: error.explanation,
        sourceLessonId: sourceLesson.id,
        sourceCaseId: huntCase.id
      });
      break; // 每个罪名先给一题
    }
  }

  // ② 题量不足时，从同一罪名池继续补题（第二梯队素材：案件里的其他错误）
  //    不从课程 practice 抽句——那是「再练一遍学过的句子」，与复盘课「修自己的毛病」定位不同。
  if (items.length < REPLAY_MAX_ITEMS) {
    // 优先补「还没出过题」的罪名，再补已出过的
    const covered = new Set(items.map((item) => item.tag));
    const orderedTags = [...tags.filter((tag) => !covered.has(tag)), ...tags];
    for (const tag of orderedTags) {
      if (items.length >= REPLAY_MAX_ITEMS) break;
      const plain = GRAMMAR_ERROR_TAG_PLAIN[tag] ?? "";
      if (!plain || findZeroTermHits(plain).length > 0) continue;
      const candidateCases = (huntCases as Array<{
        id: string;
        tokens: string[];
        errors: Array<{ tokenIndex: number; tag: GrammarErrorTag; original: string; correction: string; explanation: string }>;
      }>).filter((item) => item.errors.some((error) => error.tag === tag));
      for (const huntCase of candidateCases) {
        if (items.length >= REPLAY_MAX_ITEMS) break;
        if (usedCases.has(huntCase.id)) continue;
        const error = huntCase.errors.find((entry) => entry.tag === tag);
        if (!error || findZeroTermHits(error.explanation).length > 0) continue;
        const wrongToken = huntCase.tokens[error.tokenIndex];
        if (!wrongToken || cleanToken(wrongToken).length === 0) continue;
        if (!isEnglishToken(wrongToken)) continue;
        const sourceLesson = (grammarLessons as Array<{ id: string; huntCaseIds?: string[] }>)
          .find((lesson) => (lesson.huntCaseIds ?? []).includes(huntCase.id));
        if (!sourceLesson) continue;
        usedCases.add(huntCase.id);
        items.push({
          kind: "spot",
          tag,
          plain,
          promptZh: `再来一句——找出「${plain}」这处毛病。`,
          tokens: huntCase.tokens,
          wrongToken,
          correctionZh: `${error.original} → ${error.correction}`,
          answer: cleanToken(wrongToken),
          explainZh: error.explanation,
          sourceLessonId: sourceLesson.id,
          sourceCaseId: huntCase.id
        });
      }
    }
  }

  return {
    tags,
    items,
    isEmpty: items.length < REPLAY_MIN_ITEMS
  };
};

/** 复盘课是否值得开（素材够且有弱点）。 */
export const hasReplayLesson = (topTags: GrammarErrorTag[]): boolean =>
  !buildReplayLesson(topTags).isEmpty;
