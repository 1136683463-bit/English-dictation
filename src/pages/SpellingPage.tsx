import { FormEvent, KeyboardEvent as ReactKeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, ChevronLeft, Headphones, Home, RotateCcw, Star, Undo2, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useAppData } from "../AppContext";
import EmptyState from "../components/EmptyState";
import SpeakButton from "../components/SpeakButton";
import { getWordDetails } from "../services/cardService";
import { compareLetters, normalizeSpelling } from "../services/diffService";
import {
  applyReviewWithUndo,
  getDueCards,
  getMistakeCards,
  markCardsPriority,
  ReviewUndoSnapshot,
  undoReview
} from "../services/reviewService";
import { getMistakesByDate } from "../services/mistakeBookService";
import { preloadSpeechAudio, speakText } from "../services/speechService";
import { AppData, Card, LetterDiffToken } from "../types";

interface SpellingResult {
  card: Card;
  answer: string;
  isCorrect: boolean;
  diff: LetterDiffToken[];
}

// WebKit（Safari / WKWebView）会忽略 autoComplete="off"，按“域名 + 字段名”记住用户历史输入并弹出补全建议。
// 每次启动生成一个随机字段名，让内核的历史记录永远匹配不上这个输入框，从根源上禁止单词补齐。
const SPELLING_INPUT_NAME = `dictation-${Math.random().toString(36).slice(2, 10)}`;

interface SpellingAttempt {
  result: SpellingResult;
  undo: ReviewUndoSnapshot;
  index: number;
  appendedCount: number;
}

type SpellingQueueMode = "standard" | "mistakes";

const CORRECT_AUTO_ADVANCE_MS = 850;
const WRONG_AUTO_ADVANCE_MS = 120;
const WRONG_REPEAT_GAPS = [3, 6];

const parsePositiveLimit = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.max(1, Math.floor(parsed)) : fallback;
};

const parseCardIds = (value: string | null) =>
  value
    ?.split(",")
    .map((id) => id.trim())
    .filter(Boolean) ?? [];

const PreviousWordTitle = ({ result }: { result: SpellingResult }) => {
  if (result.isCorrect) return <strong>{result.card.front}</strong>;

  const wordTokens = result.diff.filter((token) => token.status !== "extra");
  return (
    <strong className="previous-word-title-trace" aria-label={`上一个词 ${result.card.front} 的输入命中情况`}>
      {wordTokens.map((token, index) => (
        <span key={`${token.expected ?? token.char}-${index}`} className={token.status === "match" ? "hit" : "miss"}>
          {token.expected ?? token.char}
        </span>
      ))}
    </strong>
  );
};

const reinsertWrongCardSoon = (queue: Card[], currentIndex: number, card: Card) => {
  const nextQueue = [...queue];
  WRONG_REPEAT_GAPS.forEach((gap, offset) => {
    const insertIndex = Math.min(nextQueue.length, currentIndex + gap + offset);
    nextQueue.splice(insertIndex, 0, card);
  });
  return nextQueue;
};

const buildQueue = (
  data: AppData,
  unitId: string | null,
  queueMode: SpellingQueueMode,
  limit = 30,
  mistakeDate?: string | null,
  cardIds: string[] = []
) => {
  const normalizedLimit = Math.max(1, limit);
  const cardIdSet = new Set(cardIds);
  const filterRequestedCards = (cards: Card[]) =>
    cardIds.length === 0 ? cards : cards.filter((card) => cardIdSet.has(card.id));

  if (queueMode === "mistakes") {
    if (mistakeDate) {
      return filterRequestedCards(getMistakesByDate(data, mistakeDate)
        .filter((entry) => !unitId || entry.card.unitId === unitId)
        .map((entry) => entry.card))
        .slice(0, normalizedLimit);
    }
    return filterRequestedCards(getMistakeCards(data, { unitId, limit: normalizedLimit })).slice(0, normalizedLimit);
  }
  const dataCards = getDueCards(data);
  const allCards = data.cards;
  if (unitId) {
    return allCards
      .filter((card) => card.type === "word" && card.status !== "suspended" && card.unitId === unitId)
      .slice(0, normalizedLimit);
  }
  const dueWords = dataCards.filter((card) => card.type === "word");
  if (dueWords.length > 0) return dueWords.slice(0, normalizedLimit);
  return allCards.filter((card) => card.type === "word" && card.status !== "suspended").slice(0, normalizedLimit);
};

export default function SpellingPage() {
  const { data, setData, updateData } = useAppData();
  const [searchParams] = useSearchParams();
  const unitId = searchParams.get("unit");
  const queueMode: SpellingQueueMode = searchParams.get("mode") === "mistakes" ? "mistakes" : "standard";
  const mistakeDate = searchParams.get("date");
  const cardIds = parseCardIds(searchParams.get("cards"));
  const isTodayPlan = searchParams.get("plan") === "today";
  const planLimit = parsePositiveLimit(searchParams.get("limit"), 30);
  const queueKey = `${unitId ?? "all"}:${queueMode}:${mistakeDate ?? "any-date"}:${cardIds.join("|") || "any-card"}:${planLimit}:${isTodayPlan ? "today" : "normal"}`;
  const activeUnit = unitId ? data.units.find((unit) => unit.id === unitId) : undefined;
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 挂载时先设为只读（WebKit 不会对只读输入框弹出自动补全），聚焦瞬间再解锁。
  // 用稳定的 useCallback 引用避免每次渲染重复触发。
  const attachInput = useCallback((element: HTMLInputElement | null) => {
    inputRef.current = element;
    if (element) element.setAttribute("readonly", "");
  }, []);
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const [queue, setQueue] = useState<Card[]>(() => buildQueue(data, unitId, queueMode, planLimit, mistakeDate, cardIds));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<SpellingResult | null>(null);
  const [attempts, setAttempts] = useState<SpellingAttempt[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isPreviousDetailOpen, setIsPreviousDetailOpen] = useState(false);
  const [finished, setFinished] = useState(false);
  const [priorityNotice, setPriorityNotice] = useState("");

  const card = queue[index];
  const details = card ? getWordDetails(data, card.id) : undefined;
  const nextCard = queue[index + 1];
  const nextDetails = nextCard ? getWordDetails(data, nextCard.id) : undefined;
  const progress = queue.length === 0 ? 0 : Math.min(100, ((index + (finished ? 1 : 0)) / queue.length) * 100);
  const results = attempts.map((attempt) => attempt.result);
  const wrongResults = results.filter((result) => !result.isCorrect);
  const correctCount = results.filter((result) => result.isCorrect).length;
  const previousResult = feedback ? results[results.length - 2] : results[results.length - 1];
  const previousDetails = previousResult ? getWordDetails(data, previousResult.card.id) : undefined;
  const wrongCardIds = Array.from(new Set(wrongResults.map((result) => result.card.id)));
  const unprioritizedWrongCardIds = wrongCardIds.filter(
    (cardId) => !data.cards.find((item) => item.id === cardId)?.priority
  );
  const totalCount = results.length;
  const accuracy = Math.round((correctCount / Math.max(1, totalCount)) * 100);
  const remainingCount = finished ? 0 : Math.max(queue.length - index, 0);
  const phase = feedback
    ? feedback.isCorrect
      ? {
          eyebrow: "Checked",
          title: "拼写正确",
          description: "这张卡会按熟练结果进入下一次复习。"
        }
      : {
          eyebrow: "Repair",
          title: "看清差异，稍后重练",
          description: "错词已回到本轮队列，系统会加密复现。"
        }
    : showHint
      ? {
          eyebrow: "Hint",
          title: "提示已展开",
          description: "先听发音，再用首字母定位拼写。"
        }
      : {
          eyebrow: "Listen",
          title: "听音拼写",
          description: "先听发音，在输入区写出完整英文。"
        };
  const wrongGroups = Array.from(
    wrongResults.reduce<
      Map<string, { card: Card; count: number; answers: string[] }>
    >((groups, result) => {
      const current = groups.get(result.card.id) ?? { card: result.card, count: 0, answers: [] };
      const displayAnswer = result.answer.trim() || "未填写";
      return groups.set(result.card.id, {
        ...current,
        count: current.count + 1,
        answers: [...current.answers, displayAnswer]
      });
    }, new Map()).values()
  ).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.card.front.localeCompare(b.card.front);
  });
  const mostWrong = wrongGroups[0];
  const pageTitle =
    isTodayPlan
      ? "今日计划 · 错词拼写"
      : queueMode === "mistakes" && mistakeDate
      ? `${mistakeDate} · 错词重练`
      : queueMode === "mistakes"
      ? `${activeUnit?.title ?? "全部词库"} · 错词专项`
      : `${activeUnit?.title ?? "核心词库"} · 拼写模式`;
  const emptyTitle = queueMode === "mistakes" && mistakeDate ? "这一天没有可重练的错词" : queueMode === "mistakes" ? "暂时没有可专项训练的错词" : "没有可拼写的单词";
  const emptyDescription =
    queueMode === "mistakes" && mistakeDate
      ? "这一天的错词可能已经被删除、停用，或者日期参数不在错词本记录里。"
      : queueMode === "mistakes"
      ? "拼写或复习中出现错误后，这里会按最近和连续错误自动生成队列。"
      : "先去单词本添加单词，或者导入材料收集生词。";

  useEffect(() => {
    if (autoAdvanceTimerRef.current) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setQueue(buildQueue(data, unitId, queueMode, planLimit, mistakeDate, cardIds));
    setIndex(0);
    setAnswer("");
    setFeedback(null);
    setAttempts([]);
    setShowHint(false);
    setIsPreviousDetailOpen(false);
    setFinished(false);
    setPriorityNotice("");
  }, [queueKey]);

  useEffect(() => {
    inputRef.current?.focus();
    if (card && data.settings.autoSpeakInSpelling && !feedback && !finished) {
      speak(card.front, details?.audioUrl);
    }
  }, [index, feedback]);

  useEffect(() => {
    if (!card || finished) return;

    void preloadSpeechAudio(card.front, {
      audioUrl: details?.audioUrl,
      lang: data.settings.speechLang
    });

    if (nextCard) {
      void preloadSpeechAudio(nextCard.front, {
        audioUrl: nextDetails?.audioUrl,
        lang: data.settings.speechLang
      });
    }
  }, [card?.id, details?.audioUrl, nextCard?.id, nextDetails?.audioUrl, data.settings.speechLang, finished]);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!card) return;
      if (event.code === "Space" && event.target === document.body) {
        event.preventDefault();
        speak(card.front, details?.audioUrl);
      }
      if (event.key === "Tab") {
        event.preventDefault();
        if (!event.repeat) {
          speak(card.front, details?.audioUrl);
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [card, details?.audioUrl, data.settings.speechLang, data.settings.speechRate, data.settings.speechVoice]);

  const speak = (text: string, audioUrl?: string) => {
    void speakText(text, {
      audioUrl,
      lang: data.settings.speechLang,
      rate: data.settings.speechRate,
      voiceURI: data.settings.speechVoice
    });
  };

  const playTone = (isCorrect: boolean) => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const gain = context.createGain();
    gain.connect(context.destination);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);

    const tones = isCorrect ? [660, 880] : [220, 160];
    tones.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = isCorrect ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      oscillator.connect(gain);
      oscillator.start(context.currentTime + index * 0.11);
      oscillator.stop(context.currentTime + index * 0.11 + 0.16);
    });

    window.setTimeout(() => context.close(), 500);
  };

  const scheduleAutoAdvance = (nextQueueLength: number, isCorrect: boolean) => {
    if (autoAdvanceTimerRef.current) {
      window.clearTimeout(autoAdvanceTimerRef.current);
    }

    autoAdvanceTimerRef.current = window.setTimeout(() => {
      setAnswer("");
      setFeedback(null);
      setShowHint(false);
      setIsPreviousDetailOpen(false);

      if (index >= nextQueueLength - 1) {
        setFinished(true);
      } else {
        setIndex((current) => Math.min(current + 1, nextQueueLength - 1));
      }

      autoAdvanceTimerRef.current = null;
    }, isCorrect ? CORRECT_AUTO_ADVANCE_MS : WRONG_AUTO_ADVANCE_MS);
  };

  const submitAnswer = () => {
    if (!card || feedback || autoAdvanceTimerRef.current) return;

    const currentAnswer = inputRef.current?.value ?? answer;
    const diff = compareLetters(card.front, currentAnswer);
    const isCorrect = normalizeSpelling(card.front) === normalizeSpelling(currentAnswer);
    const result: SpellingResult = { card, answer: currentAnswer, isCorrect, diff };
    const repeatCount = isCorrect ? 0 : 2;
    const nextQueue = isCorrect ? queue : reinsertWrongCardSoon(queue, index, card);
    const nextQueueLength = nextQueue.length;
    const latestCard = data.cards.find((item) => item.id === card.id) ?? card;
    const reviewed = applyReviewWithUndo(
      data,
      latestCard,
      "spelling",
      isCorrect ? 4 : 1,
      currentAnswer,
      JSON.stringify(diff)
    );

    setIsPreviousDetailOpen(false);
    setPriorityNotice("");
    playTone(isCorrect);
    if (isCorrect) {
      setFeedback(result);
    }
    setAttempts((current) => [
      ...current,
      {
        result,
        undo: reviewed.undo,
        index,
        appendedCount: repeatCount
      }
    ]);
    setData(reviewed.data);

    if (!isCorrect) {
      setQueue(nextQueue);
    }

    scheduleAutoAdvance(nextQueueLength, isCorrect);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    submitAnswer();
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitAnswer();
    }
  };

  const undoLastAttempt = () => {
    const attempt = attempts[attempts.length - 1];
    if (!attempt) return;

    if (autoAdvanceTimerRef.current) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    updateData((current) => undoReview(current, attempt.undo));
    setQueue((current) => {
      if (attempt.appendedCount === 0) return current;

      const nextQueue = [...current];
      let removed = 0;
      for (let queueIndex = nextQueue.length - 1; queueIndex >= 0 && removed < attempt.appendedCount; queueIndex -= 1) {
        if (nextQueue[queueIndex].id === attempt.result.card.id) {
          nextQueue.splice(queueIndex, 1);
          removed += 1;
        }
      }
      return nextQueue;
    });
    setAttempts((current) => current.slice(0, -1));
    setIndex(attempt.index);
    setAnswer(attempt.result.answer);
    setFeedback(null);
    setShowHint(false);
    setIsPreviousDetailOpen(false);
    setFinished(false);
    setPriorityNotice("");
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const addWrongWordsToPriority = () => {
    if (wrongCardIds.length === 0) return;

    const newlyMarkedCount = unprioritizedWrongCardIds.length;
    updateData((current) => markCardsPriority(current, wrongCardIds));
    setPriorityNotice(
      newlyMarkedCount > 0
        ? `已将 ${newlyMarkedCount} 个本轮错词加入重点。`
        : "本轮错词已经都在重点里。"
    );
  };

  const retryWrong = () => {
    if (autoAdvanceTimerRef.current) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    const wrongCards = wrongResults.map((result) => result.card);
    setQueue(wrongCards);
    setIndex(0);
    setAnswer("");
    setFeedback(null);
    setAttempts([]);
    setShowHint(false);
    setIsPreviousDetailOpen(false);
    setFinished(false);
    setPriorityNotice("");
  };

  if (queue.length === 0) {
    return (
      <div className="spelling-page">
        <div className="spelling-topbar">
          <Link to={mistakeDate ? "/mistakes" : "/review"} className="icon-button" title={mistakeDate ? "返回错词本" : "返回复习"}>
            <ArrowLeft size={17} />
          </Link>
          <strong>{pageTitle}</strong>
          <Link to="/today" className="icon-button" title="今日">
            <Home size={17} />
          </Link>
        </div>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  if (finished) {
    return (
      <div className="spelling-page">
        <div className="spelling-topbar">
          <Link to="/today" className="icon-button" title="返回今日">
            <Home size={17} />
          </Link>
          <strong>拼写总结</strong>
          <span>{isTodayPlan ? "今日计划" : queueMode === "mistakes" ? "错词专项" : "拼写模式"} · {totalCount} 题</span>
        </div>

        <section className="spelling-summary">
          <CheckCircle2 size={34} />
          <h1>本轮完成</h1>
          <p>评分已写入复习历史，错词专项会继续从记录和排期里自动生成。</p>
          <div className="spelling-summary-stats">
            <div>
              <span>总题数</span>
              <strong>{totalCount}</strong>
            </div>
            <div>
              <span>正确</span>
              <strong>{correctCount}</strong>
            </div>
            <div>
              <span>错误</span>
              <strong>{wrongResults.length}</strong>
            </div>
            <div>
              <span>正确率</span>
              <strong>{accuracy}%</strong>
            </div>
            <div className="wide">
              <span>最常错词</span>
              <strong>{mostWrong?.card.front ?? "无"}</strong>
              <em>{mostWrong ? `错 ${mostWrong.count} 次` : "本轮没有错误"}</em>
            </div>
          </div>
          <div className="button-row">
            {wrongResults.length > 0 && (
              <button
                className="warning-button"
                type="button"
                onClick={addWrongWordsToPriority}
                disabled={unprioritizedWrongCardIds.length === 0}
              >
                <Star size={17} />
                {unprioritizedWrongCardIds.length === 0 ? "已加入重点" : "错词加入重点"}
              </button>
            )}
            {wrongResults.length > 0 && (
              <button className="primary-button" onClick={retryWrong}>
                <RotateCcw size={17} />
                重练错词
              </button>
            )}
            {attempts.length > 0 && (
              <button className="secondary-button" type="button" onClick={undoLastAttempt}>
                <Undo2 size={17} />
                撤销上一题评分
              </button>
            )}
            <Link to={mistakeDate ? "/mistakes" : isTodayPlan ? "/stats" : queueMode === "mistakes" ? "/review" : "/today"} className="secondary-button">
              {mistakeDate ? "回到错词本" : isTodayPlan ? "回到计划" : queueMode === "mistakes" ? "回到复习" : "回到今日"}
            </Link>
          </div>
          {priorityNotice && <p className="spelling-priority-notice" role="status">{priorityNotice}</p>}
        </section>

        {wrongGroups.length > 0 && (
          <section className="panel spelling-wrong-list">
            <div className="panel-header">
              <h2>本轮错词</h2>
              <span className="panel-count">{wrongCardIds.length} 个词</span>
            </div>
            {wrongGroups.map((group) => {
              const answers = Array.from(new Set(group.answers));

              return (
                <div className="spelling-wrong-item" key={group.card.id}>
                  <div>
                    <strong>{group.card.front}</strong>
                    <em>错 {group.count} 次</em>
                  </div>
                  <span>
                    错误答案：{answers.slice(0, 4).join(" / ")}
                    {answers.length > 4 ? ` 等 ${answers.length} 个` : ""}
                  </span>
                </div>
              );
            })}
          </section>
        )}
      </div>
    );
  }

  return (
    <div className={`spelling-page ${feedback ? (feedback.isCorrect ? "is-correct" : "is-wrong") : ""}`}>
      <div className="spelling-topbar">
        <Link to={mistakeDate ? "/mistakes" : queueMode === "mistakes" ? "/review" : "/today"} className="icon-button" title={mistakeDate ? "返回错词本" : queueMode === "mistakes" ? "返回复习" : "返回今日"}>
          <ArrowLeft size={17} />
        </Link>
          <strong>{pageTitle}</strong>
        <div className="spelling-top-actions">
          {queueMode !== "mistakes" && (
            <Link to={unitId ? `/spelling?unit=${unitId}&mode=mistakes` : "/spelling?mode=mistakes"} className="secondary-button">
              错词专项
            </Link>
          )}
          <button className="secondary-button" onClick={() => setShowHint((current) => !current)}>
            提示
          </button>
          <Link to="/" className="icon-button" title="首页">
            <Home size={17} />
          </Link>
        </div>
      </div>

      {isTodayPlan && (
        <section className="plan-context-strip spelling-plan-context" aria-label="今日计划上下文">
          <span>Today Plan</span>
          <strong>错词拼写</strong>
          <p>本段初始 {Math.min(planLimit, queue.length)} 题；拼错的词会自动回到本轮稍后重练。</p>
          <Link to="/stats" className="secondary-button">回到计划</Link>
        </section>
      )}

      <section className={`spelling-session-panel ${feedback ? (feedback.isCorrect ? "correct" : "wrong") : ""}`} aria-label="拼写训练状态">
        <div className="spelling-session-copy">
          <Headphones size={20} />
          <span>{phase.eyebrow}</span>
          <div>
            <strong>{phase.title}</strong>
            <p>{phase.description}</p>
          </div>
        </div>
        <div className="spelling-session-metrics">
          <div>
            <span>本轮剩余</span>
            <strong>{remainingCount}</strong>
          </div>
          <div>
            <span>已完成</span>
            <strong>{totalCount}</strong>
          </div>
          <div>
            <span>错误</span>
            <strong>{wrongResults.length}</strong>
          </div>
          <div>
            <span>正确率</span>
            <strong>{totalCount > 0 ? `${accuracy}%` : "—"}</strong>
          </div>
        </div>
      </section>

      {previousResult && (
        <aside className={`previous-word-card ${previousResult.isCorrect ? "correct" : "wrong"}`}>
          <>
            <div className="previous-word-controls">
              <button
                className="previous-word-toggle"
                type="button"
                title={isPreviousDetailOpen ? "收起上一个词解析" : "展开上一个词解析"}
                aria-expanded={isPreviousDetailOpen}
                onClick={() => setIsPreviousDetailOpen((current) => !current)}
              >
                <ChevronLeft size={28} />
                <span>{previousResult.card.front}</span>
                <em>{previousResult.isCorrect ? "正确" : "错误"}</em>
              </button>
              <button
                className="previous-word-undo"
                type="button"
                title="撤销上一题评分"
                onClick={undoLastAttempt}
              >
                <Undo2 size={15} />
                <span>撤销</span>
              </button>
            </div>
            <div className="previous-word-detail">
              <PreviousWordTitle result={previousResult} />
              <span>{[previousDetails?.phonetic, previousDetails?.partOfSpeech].filter(Boolean).join(" · ") || "无音标"}</span>
              <p>{previousResult.card.back}</p>
              {isPreviousDetailOpen && previousDetails?.collocations && <small>搭配：{previousDetails.collocations}</small>}
              {isPreviousDetailOpen && previousDetails?.sourceSentence && <small>{previousDetails.sourceSentence}</small>}
            </div>
          </>
        </aside>
      )}

      <section className="spelling-stage" key={`${card.id}-${index}-${feedback ? "checked" : "pending"}`}>
        <div className="spelling-word-preview">
          <span>{details?.phonetic || "无音标 · 听音拼写"}</span>
          {showHint && (
            <strong>
              {card.front[0]}
              {"_".repeat(Math.max(0, card.front.length - 1))}
            </strong>
          )}
        </div>

        <form className="spelling-form" onSubmit={submit} autoComplete="off">
          <input
            ref={attachInput}
            name={SPELLING_INPUT_NAME}
            aria-label="输入英文拼写"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={handleInputKeyDown}
            onFocus={(event) => event.currentTarget.removeAttribute("readonly")}
            disabled={Boolean(feedback)}
            placeholder="输入英文拼写"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            data-form-type="other"
          />
        </form>

        <div className="spelling-definition">
          <p>{details?.partOfSpeech} {card.back}</p>
          <button type="button" className="spelling-sound" onClick={() => speak(card.front, details?.audioUrl)} title="播放发音">
            <Volume2 size={40} />
          </button>
        </div>

        <div className="spelling-actions">
          <button className="primary-button" type="button" onClick={submitAnswer} disabled={Boolean(feedback) || Boolean(autoAdvanceTimerRef.current)}>
            {feedback ? "自动进入下一题..." : "提交"}
          </button>
          <SpeakButton text={card.front} audioUrl={details?.audioUrl} />
        </div>
      </section>

      <div className="spelling-progress">
        <div>
          <span style={{ width: `${progress}%` }} />
        </div>
        <strong>{Math.min(index + 1, queue.length)}/{queue.length}</strong>
      </div>
    </div>
  );
}
