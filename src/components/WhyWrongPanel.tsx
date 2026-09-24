import type { ExplainAnswer, WhyWrongMatch } from "../services/grammarExplainService";
import { describeExplainSource, explainStructuralWhy } from "../services/grammarExplainService";

/**
 * 「为什么我写的不对」解答面板（从 GrammarLessonPage 抽出，2026-09-24）。
 *
 * ## 为什么抽成组件
 *
 * 这个面板原先在**每个段各抄一份**（练习段、产出段），于是「加一段就要记得抄一份」
 * ——用户已因此**三次**报告「问 AI 的按钮又没有了」：
 *   ① 「有时候有询问 AI 的按钮，有时候又没有」
 *   ② 「第一个问题有询问 AI，第二个问题又没有了」
 *   ③ 「现在问 AI 为什么不对的按钮又没有了」（跟段）
 *
 * 共同根因不是某处条件写错，而是**同一件事被复制了 N 份**：
 * 每份都要独立维护「入口条件 / 面板结构 / 兜底逻辑」，
 * 漏一份就少一段。抽成一个组件后，**新增段位只需接线，不再需要抄面板**。
 *
 * ## 面板的三种结果（互斥）
 *
 * | 状态 | 来源 | 展示 |
 * |---|---|---|
 * | `match` | 课内素材本地命中（零延迟） | 人工写好的 whyZh + 「来自：这一课的辨析」 |
 * | `ai` | AI 增量（异步） | AI 回答 + 引用来源 |
 * | `fallback` | 本地/远端都没命中 | **结构解释器**确定性说清（多词/缺词/换序/用错词） |
 *
 * 三档都保留「你写的 / 正确说法」对照，且**都不自动揭示答案**（用户自己拼出来才算）。
 */

export interface WhyWrongPanelProps {
  /** 用户写/拼出来的那句（对照左侧）。 */
  wrongSentence: string;
  /** 本题的正确说法（对照右侧 + 兜底结构解释的参照）。 */
  correctSentence: string;
  /** 对照左侧的标签：拼装类写「你拼的」，自由书写类写「你写的」。 */
  mineLabel?: string;
  loading: boolean;
  match: WhyWrongMatch | null;
  ai: ExplainAnswer | null;
  fallback: boolean;
  rated: "helpful" | "unclear" | "wrong" | null;
  onRate: (verdict: "helpful" | "unclear" | "wrong") => void;
  onClose: () => void;
}

const VERDICT_LABEL: Record<"helpful" | "unclear" | "wrong", string> = {
  helpful: "有用",
  unclear: "没讲清",
  wrong: "讲错了"
};

export default function WhyWrongPanel({
  wrongSentence,
  correctSentence,
  mineLabel = "你拼的",
  loading,
  match,
  ai,
  fallback,
  rated,
  onRate,
  onClose
}: WhyWrongPanelProps) {
  /** 对照块：三种结果都要显示「我写的 / 正确的」。 */
  const compare = (
    <div className="lesson-whywrong-compare">
      <p className="lesson-whywrong-mine">{mineLabel}：<strong>{wrongSentence}</strong></p>
      <p className="lesson-whywrong-right">正确说法：<strong>{correctSentence}</strong></p>
    </div>
  );

  /** 评价行：三档共用（「这句讲得：有用 / 没讲清 / 讲错了」）。 */
  const rating = (
    <div className="lesson-ask-rating">
      <span>这句讲得：</span>
      {(["helpful", "unclear", "wrong"] as const).map((verdict) => (
        <button
          type="button"
          key={verdict}
          className={`lesson-ask-rate${rated === verdict ? " rated" : ""}`}
          onClick={() => onRate(verdict)}
        >
          {VERDICT_LABEL[verdict]}
        </button>
      ))}
      {rated && <span className="lesson-ask-rated-note">收到，谢谢反馈</span>}
    </div>
  );

  /**
   * 兜底的结构解释：AI 不可用时**也不让用户空手猜**。
   *
   * 错句与答案都是已知词块，多词/缺词/换序/用错词在本地就能确定性说出来
   * （`explainStructuralWhy` 对换序覆盖 100%）。返回 null 才是真的说不出来，
   * 那时给「先照着拼一遍」的出口。
   */
  const structural = fallback ? explainStructuralWhy(wrongSentence, correctSentence) : null;

  return (
    <div className="lesson-whywrong-panel" aria-live="polite">
      {loading && <p className="lesson-ask-loading">想一想你这句错在哪一类……</p>}

      {match && (
        <div className="lesson-whywrong-answer">
          {wrongSentence && compare}
          <p>{match.whyZh}</p>
          <p className="lesson-ask-source">来自：这一课的辨析</p>
          {rating}
          {match.correctSentence && (
            <p className="lesson-whywrong-correct">
              正确说法（不自动揭示，自己拼出来才算）：<strong>{match.correctSentence}</strong>
            </p>
          )}
          <button type="button" className="lesson-ask-close" onClick={onClose}>
            收起，再试一遍
          </button>
        </div>
      )}

      {ai && (
        <div className="lesson-whywrong-answer">
          {wrongSentence && compare}
          <p>{ai.answer}</p>
          <p className="lesson-ask-source">来自：{describeExplainSource(ai.citedSource)}</p>
          {rating}
          <button type="button" className="lesson-ask-close" onClick={onClose}>
            收起{fallback ? "" : "，再试一遍"}
          </button>
        </div>
      )}

      {fallback && !ai && (
        <div className="lesson-whywrong-fallback">
          {wrongSentence && compare}
          <p>{structural ? structural.whyZh : "答案不对哦——再检查一下。"}</p>
          {structural ? (
            <p className="lesson-whywrong-fallback-hint">
              照着这个拼：<strong>{structural.answer}</strong>
            </p>
          ) : (
            <p className="lesson-whywrong-fallback-hint">先照着拼一遍，明天复习会再见到它。</p>
          )}
          <button type="button" className="lesson-ask-close" onClick={onClose}>
            收起
          </button>
        </div>
      )}
    </div>
  );
}
