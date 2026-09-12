import { ArrowLeft, CheckCircle2, Lightbulb, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import { appendGrammarEvent, summarizeGrammarTelemetry } from "../services/grammarTelemetry";
import { nowIso } from "../services/storage";
import {
  buildGrammarReviewSession,
  buildGrammarReviewTask,
  GRAMMAR_REVIEW_SESSION_LIMIT,
  judgeGrammarCloze,
  judgeGrammarRebuild,
  type GrammarReviewCard,
  type GrammarReviewTask
} from "../services/grammarReviewService";
import { applyReview } from "../services/reviewService";
import type { Card, ReviewMode } from "../types";

const reviewModeForTask = (task: GrammarReviewTask): ReviewMode =>
  task.mode === "cloze" ? "cloze" : "recall";

/** 一次复习的评分映射：一次通过=4（轻松），中途卡过=3（正常），看答案才过=1（忘了，10 分钟后再来）。 */
const ratingForOutcome = (attempts: number, revealed: boolean): 1 | 2 | 3 | 4 => {
  if (revealed) return 1;
  return attempts <= 1 ? 4 : 3;
};

export default function GrammarReviewPage() {
  const { data, updateData } = useAppData();

  // 会话只在进入页面时组一次：复习过程中 data 变化不会重排队列
  const [session] = useState<GrammarReviewCard[]>(() => buildGrammarReviewSession(data));
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(session.length === 0);
  const [passedCount, setPassedCount] = useState(0);
  const [stumbledCount, setStumbledCount] = useState(0);

  const current = session[index];
  const [task, setTask] = useState<GrammarReviewTask | null>(() =>
    session.length > 0 ? buildGrammarReviewTask(session[0]) : null
  );

  // 作答状态（每张卡重置）
  const [built, setBuilt] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [outcome, setOutcome] = useState<"idle" | "pass" | "revealed">("idle");
  const [usedClozeOption, setUsedClozeOption] = useState<string | null>(null);

  const total = session.length;
  const card: Card | undefined = current?.card;

  const resetCardState = () => {
    setBuilt([]);
    setAttempts(0);
    setOutcome("idle");
    setUsedClozeOption(null);
  };

  const finishCard = (finalAttempts: number, revealed: boolean) => {
    if (!current || !task) return;
    const rating = ratingForOutcome(finalAttempts, revealed);
    updateData((latest) => applyReview(latest, current.card, reviewModeForTask(task), rating, task.sentence));
    appendGrammarEvent({
      kind: "grammar_review_result",
      cardId: current.card.id,
      mode: task.mode,
      attempts: finalAttempts,
      passed: !revealed,
      sourceId: current.card.sourceId,
      ts: nowIso()
    });
    if (revealed) setStumbledCount((value) => value + 1);
    else if (finalAttempts <= 1) setPassedCount((value) => value + 1);
    else setStumbledCount((value) => value + 1);
    setOutcome(revealed ? "revealed" : "pass");
  };

  const handleClozePick = (option: string) => {
    if (!task || outcome !== "idle") return;
    setUsedClozeOption(option);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (judgeGrammarCloze(option, task.answer)) {
      finishCard(nextAttempts, false);
    }
    // 选错不判负：换一个再试，最终按尝试次数评分；「看答案」才判「忘了」
  };

  const handleRebuildComplete = (order: string[]) => {
    if (!task || outcome !== "idle") return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (judgeGrammarRebuild(order, task.sentence)) {
      finishCard(nextAttempts, false);
    }
  };

  const handleReveal = () => {
    if (!task || outcome !== "idle") return;
    finishCard(attempts, true);
  };

  const goNext = () => {
    if (index + 1 >= total) {
      setFinished(true);
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setTask(buildGrammarReviewTask(session[nextIndex]));
    resetCardState();
    window.scrollTo({ top: 0 });
  };

  const summary = useMemo(
    () => (finished ? summarizeGrammarTelemetry() : null),
    [finished]
  );

  return (
    <div className="page lesson-page">
      <PageHeader
        eyebrow="语法"
        title="语法复习"
        description="到期句子变成改一改、拼一拼的小任务——产出一次，才算真的会。"
        action={
          <div className="lesson-progress-pill" aria-label="本次复习进度">
            <Lightbulb size={16} />
            <span>
              {Math.min(index + (outcome === "idle" ? 0 : 1), total)} / {total} 张
            </span>
          </div>
        }
      />

      {finished || total === 0 ? (
        total === 0 ? (
          <>
            <EmptyState title="今天没有到期的语法复习" description="上完新课，错过的句子和核心句型明天会排进这里。" />
            <div className="lesson-stage-actions center">
              <Link to="/grammar" className="primary-button">
                返回语法地图
              </Link>
            </div>
          </>
        ) : (
          <div className="lesson-complete">
            <CheckCircle2 size={28} />
            <h2>复习完成</h2>
            <p>
              本次共 <strong>{total}</strong> 张卡：{passedCount} 张一次到位，{stumbledCount} 张还需要再见几次。
              {summary && summary.totalEvents > 0 && (
                <span className="lesson-saved-hint">（已记入本周复习数据）</span>
              )}
            </p>
            <p className="lesson-complete-sub">
              每次复习不超过 {GRAMMAR_REVIEW_SESSION_LIMIT} 张——少而准，比多而杂更记得住。
            </p>
            <div className="lesson-stage-actions">
              <Link to="/grammar" className="primary-button">
                返回语法地图
              </Link>
            </div>
          </div>
        )
      ) : (
        task && card && (
          <section className="lesson-stage" aria-label="语法复习">
            <div className="lesson-quiz-card">
              <div className="lesson-quiz-head">
                <span className="lesson-quiz-step">第 {index + 1} / {total} 张</span>
                <span className="lesson-quiz-note">{task.mode === "cloze" ? "选词补全句子" : "把句子拼回去"}</span>
              </div>

              {task.mode === "cloze" ? (
                <>
                  <p className="lesson-quiz-prompt">{task.promptText}</p>
                  <div className="lesson-option-row">
                    {task.options.map((option) => (
                      <button
                        type="button"
                        className="lesson-option"
                        key={option}
                        onClick={() => handleClozePick(option)}
                        disabled={outcome !== "idle" || usedClozeOption === option}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="lesson-quiz-prompt">{task.promptText}</p>
                  <div className="lesson-build-area" aria-label="拼装区">
                    {built.length === 0 && <span className="lesson-build-placeholder">点下面的词块，按顺序拼回句子</span>}
                    {built.map((token, pos) => (
                      <button
                        type="button"
                        className="lesson-chip built"
                        key={`${token}-${pos}`}
                        disabled={outcome !== "idle"}
                        onClick={() => setBuilt((current) => current.filter((_, at) => at !== pos))}
                      >
                        {token}
                      </button>
                    ))}
                  </div>
                  <div className="lesson-bank" aria-label="词块库">
                    {task.scrambled.map((token, tokenIndex) => {
                      const used = built.filter((item) => item === token).length;
                      const totalSame = task.scrambled.filter((item) => item === token).length;
                      const disabled = used >= totalSame || outcome !== "idle";
                      return (
                        <button
                          type="button"
                          className="lesson-chip"
                          key={`${token}-${tokenIndex}`}
                          disabled={disabled}
                          onClick={() => {
                            const next = [...built, token];
                            setBuilt(next);
                            if (next.length === task.scrambled.length) handleRebuildComplete(next);
                          }}
                        >
                          {token}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {outcome === "idle" && attempts > 0 && (
                <div className="lesson-stage-actions center">
                  <button type="button" className="ghost-link" onClick={handleReveal}>
                    <RotateCcw size={14} /> 想不起来了，看答案
                  </button>
                </div>
              )}

              {outcome === "pass" && (
                <div className="lesson-feedback pass" aria-live="polite">
                  <p>
                    <CheckCircle2 size={16} /> <strong>{task.sentence}</strong>
                    {task.note && <span className="lesson-saved-hint">（{task.note}）</span>}
                  </p>
                  <button type="button" className="primary-button" onClick={goNext}>
                    {index + 1 >= total ? "完成复习" : "下一张"}
                  </button>
                </div>
              )}

              {outcome === "revealed" && (
                <div className="lesson-feedback retry" aria-live="polite">
                  <p>
                    正确的说法是：<strong>{task.sentence}</strong>
                    {task.note && <>（{task.note}）</>}。这张卡很快会再来见你。
                  </p>
                  <button type="button" className="primary-button" onClick={goNext}>
                    {index + 1 >= total ? "完成复习" : "下一张"}
                  </button>
                </div>
              )}
            </div>

            <div className="lesson-stage-actions center">
              <Link to="/grammar" className="ghost-link">
                <ArrowLeft size={14} /> 今天先到这里
              </Link>
            </div>
          </section>
        )
      )}
    </div>
  );
}
