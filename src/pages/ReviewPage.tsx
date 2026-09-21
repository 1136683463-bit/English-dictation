import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Edit3, Eye, Flame, Keyboard, Target, Undo2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAppData } from "../AppContext";
import DiffView from "../components/DiffView";
import PageHeader from "../components/PageHeader";
import SpeakButton from "../components/SpeakButton";
import { getSentenceDetails, getWordDetails, togglePriority } from "../services/cardService";
import { compareText, diffScore } from "../services/diffService";
import {
  applyReviewWithUndo,
  getDueCards,
  getLearningStats,
  getNewCardsForToday,
  getWeakCardInsights,
  getWeakStats,
  ReviewUndoSnapshot,
  undoReview
} from "../services/reviewService";
import { AppData, Card, Rating, ReviewMode } from "../types";

const modeLabel: Record<ReviewMode, string> = {
  recognize: "识别",
  recall: "回忆",
  spelling: "拼写",
  cloze: "挖空",
  dictation: "听写",
  rebuild: "拼句"
};

const chooseMode = (card: Card): ReviewMode => {
  if (card.type === "sentence") return "recall";
  return card.status === "new" ? "recognize" : "spelling";
};

const formatDateTime = (value: string | null) => {
  if (!value) return "暂无安排";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "时间未知";

  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
};

interface ReviewAttempt {
  undo: ReviewUndoSnapshot;
  cardId: string;
  cardFront: string;
  rating: Rating;
  answer: string;
  diff: ReturnType<typeof compareText>;
  revealed: boolean;
  index: number;
}

const parsePositiveLimit = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.max(1, Math.floor(parsed)) : fallback;
};

// 与 SpellingPage 一致：`?cards=id1,id2` 指定定向训练的卡集。
const parseCardIds = (value: string | null) =>
  value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const buildReviewQueue = (data: AppData, step: string | null, limit: number, cardIds: string[] = []) => {
  // R5 定向训练：指定卡集时只练这些卡（按请求顺序，排除已暂停），不做到期/新卡混入。
  if (cardIds.length > 0) {
    const cardById = new Map(data.cards.map((card) => [card.id, card]));
    return cardIds
      .map((id) => cardById.get(id))
      .filter((card): card is Card => Boolean(card) && card!.status !== "suspended")
      .slice(0, limit);
  }

  const dueCards = getDueCards(data);
  const activeCards = data.cards.filter((card) => card.status !== "suspended");

  // R1 到期口径拆分：真到期卡在前，今日新卡（New cards/day）混入在后，再截到 limit。
  if (step === "sentences") {
    const dueSentences = dueCards.filter((card) => card.type === "sentence");
    const sentenceQueue = [...dueSentences, ...getNewCardsForToday(data, { type: "sentence" })];
    // 保留现有回退：到期与新句子都为空时，回退到全部 active 句子卡。
    const queue = sentenceQueue.length > 0 ? sentenceQueue : activeCards.filter((card) => card.type === "sentence");
    return queue.slice(0, limit);
  }

  return [...dueCards, ...getNewCardsForToday(data)].slice(0, limit);
};

export default function ReviewPage() {
  const { data, setData, updateData } = useAppData();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");
  const planStep = searchParams.get("step");
  const planLimit = parsePositiveLimit(searchParams.get("limit"), 999);
  const targetedCardsParam = searchParams.get("cards") ?? "";
  const isTargeted = targetedCardsParam.length > 0;
  const fromLibrary = searchParams.get("from") === "library";
  const isTodayPlan = plan === "today";
  const queue = useMemo(
    () => buildReviewQueue(data, planStep, planLimit, parseCardIds(targetedCardsParam)),
    [data, planLimit, planStep, targetedCardsParam]
  );
  const queueSignature = queue.map((item) => item.id).join(":");
  const learningStats = useMemo(() => getLearningStats(data), [data]);
  const weakStats = useMemo(() => getWeakStats(data), [data]);
  const weakInsights = useMemo(() => getWeakCardInsights(data, { type: "word", limit: 3 }), [data]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState("");
  const [diff, setDiff] = useState<ReturnType<typeof compareText>>([]);
  const [lastAttempt, setLastAttempt] = useState<ReviewAttempt | null>(null);
  const [pendingLowRating, setPendingLowRating] = useState<1 | 2 | null>(null);
  // R10：达 dailyReviewLimit 后的软劝导条，本次访问内可关闭。
  const [limitNudgeDismissed, setLimitNudgeDismissed] = useState(false);
  const card = queue[index];
  const mode = card ? chooseMode(card) : "recognize";

  useEffect(() => {
    setIndex(0);
  }, [queueSignature]);

  useEffect(() => {
    setPendingLowRating(null);
  }, [card?.id]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!card) return;
      if (event.key === " " && event.target === document.body) {
        event.preventDefault();
        setRevealed((current) => !current);
      }
      if (["1", "2", "3", "4"].includes(event.key)) {
        handleRatingClick(Number(event.key) as Rating);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const expected = (() => {
    if (!card) return "";
    if (mode === "spelling") return card.front;
    if (card.type === "sentence") return card.front;
    return card.back;
  })();

  const checkAnswer = () => {
    const tokens = compareText(expected, answer, data.settings.strictPunctuation);
    setDiff(tokens);
    setRevealed(true);
  };

  const submitRating = (rating: Rating) => {
    if (!card) return;
    const tokens = answer ? compareText(expected, answer, data.settings.strictPunctuation) : diff;
    const latestCard = data.cards.find((item) => item.id === card.id) ?? card;
    const reviewed = applyReviewWithUndo(data, latestCard, mode, rating, answer, JSON.stringify(tokens));

    setPendingLowRating(null);
    setData(reviewed.data);
    setLastAttempt({
      undo: reviewed.undo,
      cardId: card.id,
      cardFront: card.front,
      rating,
      answer,
      diff: tokens,
      revealed,
      index
    });
    setAnswer("");
    setDiff([]);
    setRevealed(false);
    setIndex((current) => Math.min(current, Math.max(0, queue.length - 2)));
  };

  const handleRatingClick = (rating: Rating) => {
    if (rating <= 2) {
      if (pendingLowRating === rating) {
        submitRating(rating);
        return;
      }
      setPendingLowRating(rating as 1 | 2);
      setRevealed(true);
      return;
    }

    submitRating(rating);
  };

  const undoLastRating = () => {
    if (!lastAttempt) return;

    updateData((current) => undoReview(current, lastAttempt.undo));
    setLastAttempt(null);
    setAnswer(lastAttempt.answer);
    setDiff(lastAttempt.diff);
    setRevealed(lastAttempt.revealed || lastAttempt.diff.length > 0);
    setPendingLowRating(null);
    setIndex(lastAttempt.index);
  };

  const markPriority = () => {
    if (!card) return;
    updateData((current) => togglePriority(current, card.id));
  };

  const details = card?.type === "word" ? getWordDetails(data, card.id) : card ? getSentenceDetails(data, card.id) : null;
  const audioUrl = details && "audioUrl" in details ? details.audioUrl : undefined;
  const score = diff.length > 0 ? diffScore(diff) : null;
  const progressPercent = queue.length > 0 ? ((index + 1) / queue.length) * 100 : 0;
  const promptText = mode === "recognize" ? card?.front : card?.back || card?.front;
  const remainingCount = card ? Math.max(queue.length - index, 0) : 0;
  const hasCheckedAnswer = diff.length > 0;
  const phase = pendingLowRating
    ? {
        eyebrow: "Review",
        title: `确认${pendingLowRating === 1 ? "忘记" : "模糊"}`,
        description: "答案已展开，低分会让这张卡更快回到复习队列。"
      }
    : revealed || hasCheckedAnswer
      ? {
          eyebrow: "Rating",
          title: "根据回忆质量评分",
          description: "选择最贴近刚才回忆状态的结果。"
        }
      : mode === "recognize"
        ? {
            eyebrow: "Recall",
            title: "先回忆含义",
            description: "确认自己想出的释义后再展开答案。"
          }
        : {
            eyebrow: "Answer",
            title: "先写出英文",
            description: "提交检查后再根据差异评分。"
          };

  return (
    <div className="page review-page">
      <PageHeader
        eyebrow="Review"
        title={isTargeted ? "定向训练" : isTodayPlan ? "今日计划 · 复习段" : "复习训练"}
        description={
          isTargeted
            ? `只练从词库选出的 ${queue.length} 张卡，完成后可返回词库。`
            : isTodayPlan
              ? planStep === "sentences"
                ? `本段聚焦句子复盘，最多 ${queue.length} 题。`
                : `本段清理到期复习，最多 ${queue.length} 题。`
              : "先回忆，再看答案；错误会自动影响下一次出现时间。"
        }
        action={
          <div className="header-actions">
            <Link to="/spelling" className="secondary-button">
              <Keyboard size={17} />
              听音拼写
            </Link>
            <Link to="/spelling?mode=mistakes" className="primary-button">
              <Flame size={17} />
              错词专项
            </Link>
          </div>
        }
      />

      {isTodayPlan && (
        <section className="plan-context-strip" aria-label="今日计划上下文">
          <span>Today Plan</span>
          <strong>{planStep === "sentences" ? "句子复盘" : "清到期复习"}</strong>
          <p>{queue.length > 0 ? `本段 ${queue.length} 题，完成后回到统计页继续下一步。` : "这一段暂时没有可练内容，可以跳到下一步。"}</p>
          <Link to="/stats" className="secondary-button">回到计划</Link>
        </section>
      )}

      <section className="review-focus-panel">
        <div className="review-focus-summary">
          <Target size={20} />
          <div>
            <span>薄弱项</span>
            {/* R2：错词数迁移到权威源 learningStats.weakWords（与 StatsPage/TrainingPage 同源）；
                连续错误是另一指标（insights 口径），保留 getWeakStats 不动。 */}
            <strong>{learningStats.weakWords} 个错词 · {weakStats.consecutiveErrorWords} 个连续错误</strong>
          </div>
        </div>
        <div className="review-focus-list" aria-label="最近薄弱词">
          {weakInsights.length === 0 ? (
            <span className="muted">完成几轮拼写或复习后，这里会自动出现最近错词。</span>
          ) : (
            weakInsights.map((insight) => (
              <span key={insight.card.id}>
                {insight.card.front}
                <em>{insight.consecutiveWrongCount > 1 ? `连续 ${insight.consecutiveWrongCount}` : `错 ${insight.wrongCount}`}</em>
              </span>
            ))
          )}
        </div>
      </section>

      {/* R10：达到每日复习上限时软劝导——不截断、不阻拦，只提示可以到此为止 */}
      {card &&
        !isTargeted &&
        !limitNudgeDismissed &&
        data.settings.dailyReviewLimit > 0 &&
        learningStats.reviewedToday >= data.settings.dailyReviewLimit && (
          <div className="review-limit-nudge" role="status">
            <span>
              已达今日复习上限（{data.settings.dailyReviewLimit} 次）。上限只是节奏参考——状态好可以继续，今天到这里也很好。
            </span>
            <div className="review-limit-nudge-actions">
              <Link to={isTodayPlan ? "/stats" : "/today"} className="secondary-button">
                今天到此为止
              </Link>
              <button type="button" className="secondary-button" onClick={() => setLimitNudgeDismissed(true)}>
                继续复习
              </button>
            </div>
          </div>
        )}

      {!card ? (
        <section className="review-complete-panel" aria-live="polite">          <CheckCircle2 size={38} />
          <div>
            <span className="eyebrow">Done</span>
            <h2>今日复习已清空</h2>
            <p>
              今天已完成 {learningStats.reviewedToday} 次复习，覆盖 {learningStats.reviewedCardsToday} 张卡；
              今日错误 {learningStats.wrongToday} 张。
            </p>
          </div>
          <div className="review-complete-stats">
            <div>
              <span>剩余到期</span>
              <strong>{learningStats.dueTotal}</strong>
            </div>
            <div>
              <span>下次到期</span>
              <strong>{formatDateTime(learningStats.nextDueAt)}</strong>
            </div>
          </div>
          <div className="button-row">
            {lastAttempt && (
              <button type="button" className="secondary-button" onClick={undoLastRating}>
                <Undo2 size={17} />
                撤销上一题评分
              </button>
            )}
            <Link to="/spelling?mode=mistakes" className="primary-button">
              <Flame size={17} />
              练错词
            </Link>
            {fromLibrary && (
              <Link to="/library" className="secondary-button">
                返回词库
              </Link>
            )}
            <Link to="/today" className="secondary-button">
              回到今日
            </Link>
          </div>
        </section>
      ) : (
        <section
          className={`review-card ${revealed || mode !== "recognize" || diff.length > 0 || pendingLowRating ? "with-detail" : ""}`}
          aria-labelledby="review-prompt-title"
        >
          <div className="review-session-bar">
            <div className="review-session-copy">
              <span>{phase.eyebrow}</span>
              <div>
                <strong>{phase.title}</strong>
                <p>{phase.description}</p>
              </div>
              {mode === "recognize" && !revealed && (
                <button type="button" className="secondary-button review-session-action" onClick={() => setRevealed(true)}>
                  <Eye size={16} />
                  看答案
                </button>
              )}
            </div>
            <div className="review-session-metrics" aria-label="本轮复习概况">
              <div>
                <span>本轮剩余</span>
                <strong>{remainingCount}</strong>
              </div>
              <div>
                <span>今日已练</span>
                <strong>{learningStats.reviewedToday}</strong>
              </div>
              <div>
                <span>薄弱词</span>
                <strong>{learningStats.weakWords}</strong>
              </div>
              <div>
                <span>下次到期</span>
                <strong>{formatDateTime(learningStats.nextDueAt)}</strong>
              </div>
            </div>
          </div>

          <div className="review-top">
            <div>
              <span className="review-counter">{index + 1} / {queue.length}</span>
              <span className="review-mode">{card.type === "word" ? "单词" : "句子"} · {modeLabel[mode]}</span>
              {card.priority && <span className="review-priority-chip">重点</span>}
            </div>
            <div className="review-progress" aria-label={`复习进度 ${Math.round(progressPercent)}%`}>
              <span style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="review-workbench">
            <div className="review-prompt">
              <div className="prompt-actions">
                <SpeakButton text={card.front} audioUrl={audioUrl} />
                <button
                  type="button"
                  className={`icon-button ${card.priority ? "selected" : ""}`}
                  onClick={markPriority}
                  title={card.priority ? "取消重点" : "标记重点"}
                  aria-label={card.priority ? "取消重点" : "标记重点"}
                  aria-pressed={card.priority}
                >
                  <Edit3 size={17} />
                </button>
              </div>
              <span className="prompt-kicker">{mode === "recognize" ? "看英文，想含义" : "看提示，回忆英文"}</span>
              <h2 id="review-prompt-title">{promptText}</h2>
              {details && "sourceSentence" in details && details.sourceSentence && (
                <p className="source-sentence">{details.sourceSentence}</p>
              )}
              {mode === "recognize" && !revealed && (
                <div className="review-prompt-footer">
                  <span>回忆完成后展开答案</span>
                  <button type="button" className="primary-button" onClick={() => setRevealed(true)}>
                    <Eye size={17} />
                    看答案
                  </button>
                </div>
              )}
            </div>

            {(mode !== "recognize" || diff.length > 0 || revealed || pendingLowRating) && (
              <div className="review-detail-stack">
                {mode !== "recognize" && (
                  <div className="answer-box">
                    <label htmlFor="review-answer">
                      你的答案
                      <span>{card.type === "sentence" ? "尽量完整写出英文句子" : "输入英文拼写后检查"}</span>
                    </label>
                    <textarea
                      id="review-answer"
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      placeholder={card.type === "sentence" ? "输入你回译或听写出的英文句子" : "输入英文拼写"}
                    />
                    <div className="answer-actions">
                      <button type="button" className="primary-button" onClick={checkAnswer} disabled={!answer.trim()}>
                        <CheckCircle2 size={17} />
                        检查答案
                      </button>
                    </div>
                  </div>
                )}

                {diff.length > 0 && (
                  <div className="review-result-panel">
                    <div className="panel-header">
                      <h2>批改结果</h2>
                      <strong>{score} 分</strong>
                    </div>
                    <DiffView tokens={diff} />
                  </div>
                )}

                {revealed && (
                  <div className="answer-panel">
                    <span className="eyebrow">Answer</span>
                    <h3>{card.front}</h3>
                    {card.back && <p className="answer-meaning">{card.back}</p>}
                    {details && "phonetic" in details && details.phonetic && <p className="answer-meta">{details.phonetic}</p>}
                    {details && "partOfSpeech" in details && details.partOfSpeech && <p className="answer-meta">词性：{details.partOfSpeech}</p>}
                    {details && "englishDefinition" in details && details.englishDefinition && <p className="answer-meta">英文释义：{details.englishDefinition}</p>}
                    {details && "collocations" in details && details.collocations && <p className="answer-meta">搭配：{details.collocations}</p>}
                    {details && "sourceSentence" in details && details.sourceSentence && <p className="answer-example">{details.sourceSentence}</p>}
                    {details && "keywords" in details && details.keywords.length > 0 && (
                      <p className="answer-meta">关键词：{details.keywords.join(", ")}</p>
                    )}
                    {details && "grammarNote" in details && details.grammarNote && <p className="answer-meta">语法：{details.grammarNote}</p>}
                  </div>
                )}

                {pendingLowRating && (
                  <div className="review-study-strip" role="status" aria-live="polite">
                    <div>
                      <span className="eyebrow">Review</span>
                      <strong>先看资料，再确认{pendingLowRating === 1 ? "忘记" : "模糊"}</strong>
                      <p>看完后再点一次对应评分，或直接改选「记得 / 熟练」。</p>
                    </div>
                    <button type="button" className="secondary-button" onClick={() => submitRating(pendingLowRating)}>
                      确认{pendingLowRating === 1 ? "忘记" : "模糊"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={`review-decision-panel ${pendingLowRating ? "needs-confirm" : ""}`}>
            <div className="review-decision-copy">
              <span>{pendingLowRating ? "二次确认" : "评分"}</span>
              <strong>{pendingLowRating ? "低分会缩短复习间隔" : "记录这一次的真实状态"}</strong>
            </div>
            <div className="rating-row" aria-label="复习评分">
              <button
                type="button"
                onClick={() => handleRatingClick(1)}
                className={`review-rating review-rating-low ${pendingLowRating === 1 ? "is-pending" : ""}`}
              >
                <span>1</span>
                忘记
              </button>
              <button
                type="button"
                onClick={() => handleRatingClick(2)}
                className={`review-rating review-rating-mid ${pendingLowRating === 2 ? "is-pending" : ""}`}
              >
                <span>2</span>
                模糊
              </button>
              <button type="button" onClick={() => handleRatingClick(3)} className="review-rating review-rating-good">
                <span>3</span>
                记得
              </button>
              <button type="button" onClick={() => handleRatingClick(4)} className="review-rating review-rating-strong">
                <span>4</span>
                熟练
              </button>
            </div>
          </div>
          {lastAttempt && (
            <div className="review-undo-bar" role="status">
              <span>
                已记录 {lastAttempt.cardFront} · 评分 {lastAttempt.rating}
              </span>
              <button type="button" className="secondary-button" onClick={undoLastRating}>
                <Undo2 size={16} />
                撤销上一题评分
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
