import { ArrowLeft, CheckCircle2, Lightbulb, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import { useReturnFocus } from "../components/useReturnFocus";
import { appendGrammarEvent, summarizeGrammarTelemetry, type CardMasteredEvent } from "../services/grammarTelemetry";
import { nowIso } from "../services/storage";
import {
  buildGrammarReviewSession,
  buildGrammarReviewTask,
  diversifyReviewModes,
  GRAMMAR_REVIEW_SESSION_LIMIT,
  isMasteredByOutput,
  judgeGrammarCloze,
  judgeGrammarFreeType,
  judgeGrammarRebuild,
  summarizeGrammarMastery,
  type GrammarReviewCard,
  type GrammarReviewTask
} from "../services/grammarReviewService";
import { applyMasteredStatus, applyReview } from "../services/reviewService";
import type { Card, ReviewMode } from "../types";

/**
 * 复习形态 → 记录用的 review.mode。
 *
 * `rebuild` 单独记（2026-09-21 修）：此前 rebuild 和 free_type 都记成 "recall"，
 * 而 isMasteredByOutput 按 `mode === "recall"` 过滤「输出」记录——
 * 于是「拼词块通过 + 自己写通过」被当成输出两次，用户只独立写出过 1 次就被判已掌握。
 * 拼词块有全套词块可点，难度远低于自由输出，不能算一次输出。
 */
const reviewModeForTask = (task: GrammarReviewTask): ReviewMode =>
  task.mode === "cloze" ? "cloze" : task.mode === "rebuild" ? "rebuild" : "recall";

/** 一次复习的评分映射：一次通过=4（轻松），中途卡过=3（正常），看答案才过=1（忘了，10 分钟后再来）。 */
const ratingForOutcome = (attempts: number, revealed: boolean): 1 | 2 | 3 | 4 => {
  if (revealed) return 1;
  return attempts <= 1 ? 4 : 3;
};

export default function GrammarReviewPage() {
  const { data, updateData } = useAppData();

  // R06：累计掌握视图（成长曲线视角）——随复习动作实时刷新
  const mastery = useMemo(() => summarizeGrammarMastery(data), [data]);

  // 会话只在进入页面时组一次：复习过程中 data 变化不会重排队列。
  // R-UX9：组会话后做同型打散——相邻两张卡题型尽量不同（此前同天入队的卡会连出同型题）。
  const [session] = useState<GrammarReviewCard[]>(() =>
    diversifyReviewModes(buildGrammarReviewSession(data), data.sentenceDetails)
  );
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(session.length === 0);
  const [passedCount, setPassedCount] = useState(0);
  const [stumbledCount, setStumbledCount] = useState(0);

  const current = session[index];
  const [task, setTask] = useState<GrammarReviewTask | null>(() =>
    session.length > 0 ? buildGrammarReviewTask(session[0], data.sentenceDetails) : null
  );

  // 作答状态（每张卡重置）
  const [built, setBuilt] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [outcome, setOutcome] = useState<"idle" | "pass" | "revealed">("idle");
  const [usedClozeOption, setUsedClozeOption] = useState<string | null>(null);

  /**
   * 判题 / 换卡后把焦点交回题目卡（2026-09-21 新增）。
   * 依赖键把「第几张 + 当前判定结果」并进去：换卡与出反馈都会触发一次落焦。
   */
  const quizCardRef = useReturnFocus<HTMLDivElement>(Boolean(task), `${index}:${outcome}`);
  // R09 Step2：free_type 自由输出态
  const [freeTypeValue, setFreeTypeValue] = useState("");
  const [freeTypeHint, setFreeTypeHint] = useState<string | null>(null);

  const total = session.length;
  /** 结算页也要落焦（最后一卡点「完成复习」后被点按钮卸载）。 */
  const completeRef = useReturnFocus<HTMLDivElement>(finished, `done:${finished}:${total}`);
  const card: Card | undefined = current?.card;

  const resetCardState = () => {
    setBuilt([]);
    setAttempts(0);
    setOutcome("idle");
    setUsedClozeOption(null);
    setFreeTypeValue("");
    setFreeTypeHint(null);
  };

  /**
   * 结束一张卡并写复习记录。
   *
   * `userAnswer` 必须是**用户真正写下的内容**（2026-09-22 修）。
   *
   * 此前这里硬传 `task.sentence`（正确句），于是 `review.answer` 存的是正确答案。
   * 而错词本把它当「你的答案」展示（`MistakeBookPage` 的「正确拼写 / 你的答案」两栏
   * 并列显示）——两栏内容完全一样，等于把用户写错的那句**伪装成正确答案**，
   * 用户看不到自己当时究竟写了什么，也就无从对照。
   * 字母级差异对照（`compareLetters`）同样建立在它之上。
   */
  const finishCard = (finalAttempts: number, revealed: boolean, userAnswer: string) => {
    if (!current || !task) return;
    const rating = ratingForOutcome(finalAttempts, revealed);
    const wasMastered = current.card.status === "mastered";
    updateData((latest) => {
      let next = applyReview(latest, current.card, reviewModeForTask(task), rating, userAnswer);
      // R09 Step2 新掌握口径：free_type 复习后，检查是否达「输出连续 2 次一次通过」——
      // 旧的「rating4 且 reviewCount≥4」口径对 cloze/rebuild 仍生效；free_type 卡在连续 2 次输出通过时也置 mastered。
      // W0：写入统一走 applyMasteredStatus（掌握判定与写入的唯一权威，此前这里自己写了一遍 status/masteredAt）。
      if (task.mode === "free_type" && !revealed && isMasteredByOutput(next.reviews, current.card.id)) {
        next = applyMasteredStatus(next, current.card.id);
      }
      // R06：卡首次跃迁 mastered 时上报 card_mastered——「我学会了」的正向确证（仅跃迁瞬间一次）
      const nextCard = next.cards.find((item) => item.id === current.card.id);
      if (!wasMastered && nextCard?.status === "mastered") {
        const details = next.sentenceDetails.find((item) => item.cardId === current.card.id);
        const tagMatch = details?.grammarNote.match(/^\[([a-z_]+)(?::[^\]]+)?\]/);
        appendGrammarEvent({
          kind: "card_mastered",
          cardId: current.card.id,
          sourceId: current.card.sourceId,
          tag: (tagMatch?.[1] as CardMasteredEvent["tag"]) ?? null,
          ts: nowIso()
        });
      }
      return next;
    });
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
      // 写用户实际选的词（不是正确答案）——错词本要展示「你的答案」
      finishCard(nextAttempts, false, option);
    }
    // 选错不判负：换一个再试，最终按尝试次数评分；「看答案」才判「忘了」
  };

  const handleRebuildComplete = (order: string[]) => {
    if (!task || outcome !== "idle") return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (judgeGrammarRebuild(order, task.sentence)) {
      finishCard(nextAttempts, false, order.join(" "));
    }
  };

  /** R09 Step2：free_type 提交——通过即 finishCard；未过给差异提示，可再试或看答案。 */
  const handleFreeTypeSubmit = () => {
    if (!task || outcome !== "idle" || !freeTypeValue.trim()) return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const { passed, score } = judgeGrammarFreeType(freeTypeValue, task.sentence);
    if (passed) {
      setFreeTypeHint(null);
      finishCard(nextAttempts, false, freeTypeValue.trim());
    } else {
      setFreeTypeHint(
        score === 0
          ? "还没对上——回忆一下卡片来源的那句话，或者点「看答案」。"
          : `已经对了一部分（${score}%）——再调整一下，或点「看答案」。`
      );
    }
  };

  const handleReveal = () => {
    if (!task || outcome !== "idle") return;
    /**
     * 「看答案」时把用户已经写下的内容记下来（可能为空）。
     * 空串是**真实信息**——那代表用户没写出来，比写上正确答案诚实。
     * free_type 与 rebuild 有输入框/拼装区可回填，cloze 没有输入态（只有点选）。
     */
    const typed = freeTypeValue.trim() || built.join(" ") || usedClozeOption || "";
    finishCard(attempts, true, typed);
  };

  const goNext = () => {
    if (index + 1 >= total) {
      setFinished(true);
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setTask(buildGrammarReviewTask(session[nextIndex], data.sentenceDetails));
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

      {/* R06 累计掌握视图：把「本次 X 张」放进「已掌握 N / 共 Y 句」的成长曲线里 */}
      {mastery.total > 0 && (
        <section className="grammar-mastery-bar" aria-label="语法句型掌握进度">
          <div className="grammar-mastery-track" aria-hidden="true">
            <i
              className="grammar-mastery-fill"
              style={{ width: `${mastery.total ? (mastery.mastered / mastery.total) * 100 : 0}%` }}
            />
          </div>
          <p className="grammar-mastery-text">
            语法句型 <strong>已掌握 {mastery.mastered}</strong> / 共 {mastery.total} 句
            {mastery.inProgress > 0 && <span> · 进行中 {mastery.inProgress}</span>}
            {mastery.notStarted > 0 && <span> · 未开始 {mastery.notStarted}</span>}
          </p>
        </section>
      )}

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
          <div className="lesson-complete" ref={completeRef} tabIndex={-1}>
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
            <div className="lesson-quiz-card" ref={quizCardRef} tabIndex={-1}>
              <div className="lesson-quiz-head">
                <span className="lesson-quiz-step">第 {index + 1} / {total} 张</span>
                <span className="lesson-quiz-note">
                  {task.mode === "cloze" ? "选词补全句子" : task.mode === "rebuild" ? "把句子拼回去" : "自己把句子写出来"}
                </span>
              </div>

              {task.mode === "free_type" ? (
                <>
                  <p className="lesson-quiz-prompt">{task.promptText}</p>
                  <div className="answer-box">
                    <textarea
                      className="large-textarea"
                      value={freeTypeValue}
                      onChange={(event) => setFreeTypeValue(event.target.value)}
                      onKeyDown={(event) => {
                        // 回车提交（Shift+Enter 换行；输入法组词态不触发）
                        if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                          event.preventDefault();
                          if (freeTypeValue.trim()) handleFreeTypeSubmit();
                        }
                      }}
                      placeholder="凭记忆写出整句…（回车提交）"
                      rows={2}
                      disabled={outcome !== "idle"}
                      aria-label="自由输出复习"
                    />
                  </div>
                  {freeTypeHint && outcome === "idle" && (
                    <p className="lesson-saved-hint" role="status">{freeTypeHint}</p>
                  )}
                  {outcome === "idle" && (
                    <div className="lesson-stage-actions center">
                      <button type="button" className="primary-button" onClick={handleFreeTypeSubmit} disabled={!freeTypeValue.trim()}>
                        提交
                      </button>
                    </div>
                  )}
                </>
              ) : task.mode === "cloze" ? (
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
