import { useCallback, useRef, useState } from "react";
import type { ExplainAnswer, WhyWrongMatch } from "../services/grammarExplainService";
import {
  appendWhyWrongLog,
  buildLessonExplainContext,
  explainStructuralWhy,
  matchWhyWrong
} from "../services/grammarExplainService";
import { requestLessonExplain } from "../services/grammarExplainAiService";
import { appendGrammarEvent, type LessonSection } from "../services/grammarTelemetry";
import type { AiProviderSettings } from "../types";
import { hashGrammarSentence } from "../services/lessonService";
import { nowIso } from "../services/storage";

/**
 * 「为什么我写的不对」追问层的共享实现（2026-09-24 抽出）。
 *
 * ## 为什么必须共享
 *
 * 这套逻辑（本地命中 → 结构解释 → AI 增量 → 兜底）原先在每个段各写一份，
 * 用户已因此**三次**报告「问 AI 的按钮又没有了」：
 *   ① 「有时候有询问 AI 的按钮，有时候又没有」
 *   ② 「第一个问题有询问 AI，第二个问题又没有了」
 *   ③ 「现在问 AI 为什么不对的按钮又没有了」（跟段）
 *
 * 根因不是条件写错，是**同一件事被复制了 N 份**：每份都要独立维护
 * 「入口条件 / 状态机 / 遥测 / 兜底」。抽成 hook 后，新页面/新段位只需接线。
 *
 * ## 三层结果（本地优先，AI 兜底）
 *
 * | 层 | 条件 | 结果 |
 * |---|---|---|
 * | ① 本地精确/近似命中 | `matchWhyWrong` 命中课内素材 | 零延迟给 `whyZh` |
 * | ② 结构解释器 | 换序形（fuzzySwap）| 确定性解释，**不问 AI** |
 * | ③ AI 增量 | 前两层都没命中 | 异步；失败则兜底 |
 *
 * ⚠️ 兜底由面板负责（`WhyWrongPanel` 会用 `explainStructuralWhy` 说清结构错因），
 * 所以这里失败时只置 `fallback=true`，不需要自己拼话术。
 */

export interface WhyWrongOpenRef {
  /** 正确说法（对照右侧 + 结构解释的参照）。**必传**——错句单独无法判定对错。 */
  correctSentence: string;
  /** 题目问的是什么（进 AI 提问上下文；缺省用课程意图）。 */
  promptZh?: string;
  /** 遥测分段（practice / guided / recall / output / revisit…）。 */
  section?: LessonSection;
  /** 遥测锚点前缀（如 `guided.step`），与 stepKey 拼成 `prefix:key`。 */
  anchorPrefix?: string;
  /** 兜底提问用的课程一句话规则（AI 的 anchorText）。 */
  anchorText?: string;
}

export interface UseWhyWrongResult {
  open: boolean;
  sentence: string;
  stepKey: number | null;
  loading: boolean;
  match: WhyWrongMatch | null;
  ai: ExplainAnswer | null;
  fallback: boolean;
  rated: "helpful" | "unclear" | "wrong" | null;
  /** 打开追问层。`stepKey` 是**带命名空间的步骤键**（同页多段必须各占一段号，防撞车）。 */
  ask: (stepKey: number, wrongSentence: string, ref: WhyWrongOpenRef) => void;
  rate: (verdict: "helpful" | "unclear" | "wrong") => void;
  close: () => void;
  /** 面板所需的全部状态（spread 进 `<WhyWrongPanel {...whyWrong.panelProps} />`）。 */
  panelProps: {
    wrongSentence: string;
    correctSentence: string;
    loading: boolean;
    match: WhyWrongMatch | null;
    ai: ExplainAnswer | null;
    fallback: boolean;
    rated: "helpful" | "unclear" | "wrong" | null;
    onRate: (verdict: "helpful" | "unclear" | "wrong") => void;
    onClose: () => void;
  };
}

/**
 * `lessonId` 用于本地素材命中与遥测；`explainContext` 由调用方在
 * `buildLessonExplainContext` 里备好（课程页复用已有那份，避免重复构造）。
 */
export const useWhyWrong = (options: {
  lessonId: string;
  /** AI 网关配置（第三层增量用）。缺省/未启用时第三层必弃权 → 面板走兜底。 */
  provider?: AiProviderSettings;
  /** AI 提问时的课程上下文；缺省时由本 hook 自行构造。 */
  explainContext?: ReturnType<typeof buildLessonExplainContext>;
}): UseWhyWrongResult => {
  const { lessonId, provider, explainContext } = options;
  const [open, setOpen] = useState(false);
  const [sentence, setSentence] = useState("");
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState<WhyWrongMatch | null>(null);
  const [ai, setAi] = useState<ExplainAnswer | null>(null);
  const [fallback, setFallback] = useState(false);
  const [rated, setRated] = useState<"helpful" | "unclear" | "wrong" | null>(null);
  const stepKeyRef = useRef<number | null>(null);
  /** 当前这一问的参照（rate/关闭时遥测要用）。 */
  const refRef = useRef<WhyWrongOpenRef | null>(null);

  const close = useCallback(() => setOpen(false), []);

  const rate = useCallback(
    (verdict: "helpful" | "unclear" | "wrong") => {
      if (stepKeyRef.current === null) return;
      // 已评过：防重复提交（埋点口径每卡一票）
      setRated((current) => {
        if (current) return current;
        appendGrammarEvent({
          kind: "practice_why_wrong_feedback",
          lessonId,
          stepIndex: stepKeyRef.current ?? 0,
          verdict,
          ts: nowIso()
        });
        return verdict;
      });
    },
    [lessonId]
  );

  const ask = useCallback(
    (stepKey: number, wrongSentence: string, ref: WhyWrongOpenRef) => {
      const section = ref.section ?? "practice";
      const anchorPrefix = ref.anchorPrefix ?? "practice.step";
      stepKeyRef.current = stepKey;
      refRef.current = ref;
      setSentence(wrongSentence);
      setRated(null);
      setOpen(true);
      setAi(null);
      setMatch(null);
      setFallback(false);

      const sentenceHash = hashGrammarSentence(wrongSentence);
      const localMatch = matchWhyWrong(lessonId, wrongSentence);
      appendWhyWrongLog({
        lessonId,
        stepIndex: stepKey,
        wrongSentence,
        matchSource: localMatch?.source ?? "fallback",
        ts: nowIso()
      });
      appendGrammarEvent({
        kind: "practice_why_wrong_requested",
        lessonId,
        stepIndex: stepKey,
        section,
        sentenceHash,
        matchSource: localMatch?.source ?? "fallback",
        ...(localMatch?.diffScoreAtMatch ? { diffScoreAtMatch: localMatch.diffScoreAtMatch } : {}),
        // 无配额（2026-09-22）：恒 available，保留字段供历史数据对比
        quotaState: "available",
        ts: nowIso()
      });

      /**
       * 换序形（同词不同序）走**确定性**结构解释，绝不问 AI。
       *
       * 实测相邻换序样本 348 命中里 138 条（39.7%）讲解完全不提「顺序」——
       * 而 `explainStructuralWhy` 对换序覆盖 100%，讲错比不讲更糟。
       */
      const structural = explainStructuralWhy(wrongSentence, ref.correctSentence);
      const fuzzySwap = localMatch?.source === "local_fuzzy" && structural?.kind === "swap";

      if (localMatch && !fuzzySwap) {
        setMatch(localMatch);
        setLoading(false);
        appendGrammarEvent({
          kind: "practice_why_wrong_result",
          lessonId,
          stepIndex: stepKey,
          sentenceHash,
          ok: true,
          source: localMatch.source,
          layer: localMatch.source === "local_exact" ? "local_exact" : "local_fuzzy",
          latencyMs: 0,
          cached: false,
          citedRef: localMatch.citedRef,
          ts: nowIso()
        });
        return;
      }

      if (fuzzySwap) {
        setFallback(true);
        appendGrammarEvent({
          kind: "practice_why_wrong_result",
          lessonId,
          stepIndex: stepKey,
          sentenceHash,
          ok: true,
          source: "structural",
          layer: "structural",
          latencyMs: 0,
          cached: false,
          ts: nowIso()
        });
        return;
      }

      /**
       * 第三层：AI 增量。
       *
       * 前置条件不满足（没配 provider、或本课构造不出上下文）时**直接进兜底**——
       * 不做一次注定失败的请求（那只会让用户白等一个 loading）。
       */
      const context =
        buildLessonExplainContext(lessonId, {
          userSentence: wrongSentence,
          correctSentence: ref.correctSentence
        }) ?? explainContext;
      if (!provider?.enabled || !context) {
        setFallback(true);
        setLoading(false);
        appendGrammarEvent({
          kind: "practice_why_wrong_result",
          lessonId,
          stepIndex: stepKey,
          sentenceHash,
          ok: false,
          source: "fallback",
          layer: "fallback",
          latencyMs: 0,
          cached: false,
          ts: nowIso()
        });
        return;
      }

      setLoading(true);
      void requestLessonExplain(provider, {
          question: [
            `用户想说的是「${ref.promptZh ?? ""}」。`,
            `他写成了「${wrongSentence}」，而正确说法是「${ref.correctSentence}」。`,
            "请逐词对照这两个句子，指出他这句具体哪个词放错了/多用了/漏掉了，以及那个位置为什么该用正确说法里的词。",
            "必须贴着他写的词讲，不要复述课内通用规则。"
          ].join(""),
          anchorRef: `${anchorPrefix}:${stepKey}`,
          anchorText: ref.anchorText ?? "",
          context
      }).then((outcome) => {
        appendGrammarEvent({
          kind: "practice_why_wrong_result",
          lessonId,
          stepIndex: stepKey,
          sentenceHash,
          ok: outcome.ok,
          source: outcome.ok ? "ai" : "fallback",
          layer: "ai",
          latencyMs: outcome.latencyMs ?? 0,
          cached: outcome.cached ?? false,
          ...(outcome.answer?.citedSource ? { citedRef: outcome.answer.citedSource } : {}),
          ...(outcome.answer?.errorTag ? { errorTag: outcome.answer.errorTag } : {}),
          ts: nowIso()
        });
        if (outcome.ok && outcome.answer && !outcome.answer.declined) {
          setAi(outcome.answer);
        } else {
          setFallback(true);
        }
        setLoading(false);
      });
    },
    [lessonId, provider, explainContext]
  );

  return {
    open,
    sentence,
    stepKey: stepKeyRef.current,
    loading,
    match,
    ai,
    fallback,
    rated,
    ask,
    rate,
    close,
    panelProps: {
      wrongSentence: sentence,
      correctSentence: refRef.current?.correctSentence ?? "",
      loading,
      match,
      ai,
      fallback,
      rated,
      onRate: rate,
      onClose: close
    }
  };
};
