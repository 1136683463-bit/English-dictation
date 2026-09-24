import { compareText, diffScore, spellingMatches } from "./diffService";
import { isFreeOutputPassed } from "./lessonService";

/**
 * 语法季末综合卷 · 判分层（第一季试点）。
 *
 * 规格来源：`deliverables/product-strategy/prd-grammar-season-final-exam-2026-09-24.md`
 *   §4.5 判分口径（P0-0）｜§4.6 AI 边界｜§14 Non-goal 3
 *
 * 三条不可退让的口径：
 *
 * 1. **客观题判分一律走确定性规则，AI 零参与**（PRD §4.6 黑名单①、验收 G7）。
 *    本文件因此**不得**引入 `aiHttpClient` 或任何 AI 模块——G7 用代码层断言锁这一点。
 *    AI 只出现在两处：写作的批改与讲解、错题的「为什么」。那两处也不出分（G8）。
 *
 * 2. **考试专用通过线独立于存量**（P0-0c）。
 *    存量三条线互不相同：`BOOST_RECALL_PASS_SCORE = 70`、`BOOST_PRODUCE_PASS_SCORE = 90`、
 *    `FREE_TYPE_PASS_SCORE = 90`。同一个答案在 70 线通过、在 90 线不通过，正是 L112 暴露的问题。
 *    考试不沿用其中任何一条，而是新增并冻结 `EXAM_ZH2EN_PASS_SCORE`——
 *    理由是「不改存量行为属红线⑩ Non-goal 8」，统一存量线是另一个待裁决策（PRD Q11）。
 *
 * 3. **不许把同一句中文的另一正确说法判错**。
 *    判定基准取 `answer` 与 `acceptAlso` 中「说得更近」的那一条（与 boost 的 `bestProduceMatch` 同款），
 *    这是 L68 / L54 / L175 三次误判换来的修法。
 *    注意：`acceptAlso` 的填/不填有既定裁定（见 `types.ts` 的 `acceptAlso` 文档，含 L112 明确「不填」），
 *    考试侧**只消费、不扩大**这个集合。
 */

/**
 * 考试的中译英通过线（P0-0c，新增并冻结）。
 *
 * 取 90 与「无提示整句产出」（`BOOST_PRODUCE_PASS_SCORE`）和复习自由输出
 * （`FREE_TYPE_PASS_SCORE`）对齐：考试是凭记忆产出整句，没有提示梯子可用。
 *
 * 状语移位（`I went yesterday to school.`）不靠这条线兜底——那由 `isFreeOutputPassed`
 * 的 `isAdverbOrderEquivalent` 直接判等价，与线无关。
 */
export const EXAM_ZH2EN_PASS_SCORE = 90;

/** 一道题的判分结果。字段名刻意避开「正确/错误」，与 UI 的「稳住 / 还漏」对齐（PRD §4.5 呈现口径）。 */
export interface ExamJudgeResult {
  /** 是否算作「稳住」。**这是权威判定**，不是由 `score` 推出来的。 */
  passed: boolean;
  /**
   * 逐词相似度（0–100），仅供诊断。
   * **不变量（三种题型统一）：`passed === (score >= EXAM_ZH2EN_PASS_SCORE)`**。
   * 选择/阅读小题为 100 / 0，填空为 100 / 0，中译英为过线放行后抬到线上的分数。
   * 这条不变量让「判定」与「分数」永远不会互相矛盾——消费者按哪个读都得到同一个结论。
   */
  score: number;
  /** 实际命中的基准说法（多解时用于结果页展示「也可以这样说」）。 */
  reference: string;
}

/** 中译英：从 `answer` 与 `acceptAlso` 里挑最接近的一条作基准。 */
const bestZh2EnMatch = (
  input: string,
  accepted: string[]
): { score: number; reference: string } => {
  let best = { score: -1, reference: accepted[0] ?? "" };
  for (const reference of accepted) {
    const score = diffScore(compareText(reference, input, false));
    if (score > best.score) best = { score, reference };
  }
  return best;
};

/**
 * 中译英整句判分。
 *
 * @param input    用户输入
 * @param answer   本卷基准答案句
 * @param acceptAlso 同一句中文的其它正确说法（来自课内既有 `acceptAlso`，考试不新增）
 *
 * **为什么要把过线答案的分数抬到线上**：`isFreeOutputPassed` 有两条放行通道——
 * 分数过线，**或** `isAdverbOrderEquivalent` 判定为「同一批词、仅首尾状语换了位置」。
 * 后者与相似度无关，实测 `Every day I go to school.`（基准 `I go to school every day.`）
 * 逐词对齐后相似度为 **0**，但它是完全正确的英语。若原样存进 `score`，就会产出
 * `{ passed: true, score: 0 }` 这种自相矛盾的记录——任何按分数阈值的消费者都会读错。
 * 这里把等价放行的分数抬到通过线，使 `passed === (score >= EXAM_ZH2EN_PASS_SCORE)` 恒成立。
 */
export const judgeExamZh2En = (
  input: string,
  answer: string,
  acceptAlso: string[] = []
): ExamJudgeResult => {
  const accepted = [answer, ...acceptAlso].map((item) => item.trim()).filter(Boolean);
  if (accepted.length === 0) return { passed: false, score: 0, reference: "" };
  const { score, reference } = bestZh2EnMatch(input, accepted);
  const passed = isFreeOutputPassed(input, reference, score, EXAM_ZH2EN_PASS_SCORE);
  return {
    passed,
    score: passed ? Math.max(score, EXAM_ZH2EN_PASS_SCORE) : score,
    reference
  };
};

/**
 * 选择题 / 阅读理解小题：选项 id 精确比对。
 *
 * 不做「近似选项」容错——选择题的干扰项本来就是按易混设计的，容错会把干扰项放过。
 */
export const judgeExamChoice = (pickedId: string, correctId: string): ExamJudgeResult => {
  const passed = Boolean(pickedId) && pickedId === correctId;
  return { passed, score: passed ? 100 : 0, reference: correctId };
};

/**
 * 填空题：只填一个词，允拼写层面的宽容（`spellingMatches` 口径：去标点、保留撇号）。
 *
 * 走 `spellingMatches` 而不是自己写比对——同一个口径已被复习页与课内复用，
 * 另起一套只会制造第二个真源。
 */
export const judgeExamCloze = (input: string, answer: string): ExamJudgeResult => {
  const passed = spellingMatches(answer, input);
  return { passed, score: passed ? 100 : 0, reference: answer };
};
