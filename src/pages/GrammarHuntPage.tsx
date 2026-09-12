import { ArrowLeft, BookPlus, CheckCircle2, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppData } from "../AppContext";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SpeakButton from "../components/SpeakButton";
import { addOrUpdateWordWithResult } from "../services/cardService";
import { findDictionaryEntryAsync } from "../services/dictionaryService";
import { appendGrammarEvent } from "../services/grammarTelemetry";
import { nowIso } from "../services/storage";
import {
  appendHuntAttempt,
  appendHuntResult,
  buildHuntResult,
  GRAMMAR_ERROR_TAG_LABELS,
  GRAMMAR_ERROR_TAG_PLAIN,
  HUNT_CLUE_BUDGET,
  judgeGuess,
  listHuntCases,
  pickCorrectionWord,
  summarizeHuntProgress
} from "../services/huntService";
import type { HuntVerdict } from "../services/huntService";
import type { AppData, GrammarErrorTag, HuntCase, HuntResult } from "../types";

const ALL_TAGS = Object.keys(GRAMMAR_ERROR_TAG_LABELS) as GrammarErrorTag[];

const formatDuration = (durationMs: number): string => {
  const seconds = Math.max(1, Math.round(durationMs / 1000));
  return seconds >= 60 ? `${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒` : `${seconds} 秒`;
};

export default function GrammarHuntPage() {
  const { data, updateData } = useAppData();
  const cases = useMemo(() => listHuntCases(), []);
  const summary = useMemo(() => summarizeHuntProgress(data), [data]);
  const solvedIds = useMemo(() => new Set(summary.solvedCaseIds), [summary.solvedCaseIds]);

  const [activeCase, setActiveCase] = useState<HuntCase | null>(null);
  const [found, setFound] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<HuntVerdict | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [settledResult, setSettledResult] = useState<HuntResult | null>(null);
  const [highlightCaseId, setHighlightCaseId] = useState<string | null>(null);
  const [wordsAdded, setWordsAdded] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [deepLinkHandled, setDeepLinkHandled] = useState(false);

  // 课程页第④段跳转进来：/grammar/hunt?case=<caseId> 直接进入该案。
  useEffect(() => {
    if (deepLinkHandled) return;
    const caseId = searchParams.get("case");
    const target = caseId ? cases.find((item) => item.id === caseId) : undefined;
    if (target) openCase(target);
    setDeepLinkHandled(true);
    if (caseId) setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLinkHandled, searchParams]);

  const openCase = (caseItem: HuntCase) => {
    setActiveCase(caseItem);
    setFound([]);
    setMisses(0);
    setSelectedToken(null);
    setFeedback(null);
    setStartedAt(Date.now());
    setSettledResult(null);
    setWordsAdded(false);
  };

  const backToList = () => {
    if (activeCase) {
      const nextUnsolved =
        cases.find((item) => item.number > activeCase.number && !solvedIds.has(item.id)) ??
        cases.find((item) => item.id !== activeCase.id && !solvedIds.has(item.id)) ??
        null;
      setHighlightCaseId(nextUnsolved?.id ?? null);
    }
    setActiveCase(null);
    setSelectedToken(null);
    setFeedback(null);
  };

  const handleTokenClick = (tokenIndex: number) => {
    if (settledResult) return;
    if (found.includes(tokenIndex)) return;
    setSelectedToken(tokenIndex);
    setFeedback(null);
  };

  const settleCase = (caseItem: HuntCase, currentMisses: number) => {
    const result = buildHuntResult(caseItem, currentMisses, Date.now() - startedAt, new Date(startedAt).toISOString());
    setSettledResult(result);
    updateData((latest) => appendHuntResult(latest, result));
  };

  const handleTagPick = (tag: GrammarErrorTag) => {
    if (!activeCase || selectedToken === null || settledResult) return;

    const verdict = judgeGuess(activeCase, selectedToken, tag, found);
    setFeedback(verdict);
    // R01④：一次裁决记录（verdictKind 用于误报率与罪名命中率统计）
    appendGrammarEvent({
      kind: "hunt_verdict",
      caseId: activeCase.id,
      tokenIndex: selectedToken,
      verdictKind: verdict.kind,
      guessedTag: tag,
      ts: nowIso()
    });

    if (verdict.kind === "hit" && verdict.error) {
      const nextFound = [...found, selectedToken];
      setFound(nextFound);
      updateData((latest) =>
        appendHuntAttempt(latest, { caseId: activeCase.id, tokenIndex: selectedToken, guessedTag: tag, hit: true })
      );
      setSelectedToken(null);

      if (nextFound.length === activeCase.errors.length) {
        settleCase(activeCase, misses);
      }
      return;
    }

    if (verdict.kind === "wrongTag") {
      updateData((latest) =>
        appendHuntAttempt(latest, { caseId: activeCase.id, tokenIndex: selectedToken, guessedTag: tag, hit: false })
      );
      return;
    }

    if (verdict.kind === "notError") {
      updateData((latest) =>
        appendHuntAttempt(latest, { caseId: activeCase.id, tokenIndex: selectedToken, guessedTag: tag, hit: false })
      );
      setMisses((current) => current + 1);
      setSelectedToken(null);
    }
  };

  const addCorrectionsToMistakeBook = () => {
    if (!activeCase || wordsAdded) return;
    const sentence = activeCase.tokens.join(" ");
    const corrections = activeCase.errors
      .map((error) => ({ word: pickCorrectionWord(error.correction), original: error.original }))
      .filter((item) => item.word);

    // 释义走异步词典查询（含内置大词典），查不到就留空，不阻塞加入动作。
    void (async () => {
      const inputs = await Promise.all(
        corrections.map(async ({ word, original }) => ({
          word,
          original,
          translation: (await findDictionaryEntryAsync(data, word))?.translation ?? ""
        }))
      );

      updateData((latest) => {
        let next: AppData = latest;
        for (const { word, original, translation } of inputs) {
          next = addOrUpdateWordWithResult(next, {
            word,
            translation,
            phonetic: "",
            partOfSpeech: "",
            englishDefinition: "",
            collocations: "",
            sourceSentence: sentence,
            sourceId: `hunt:${activeCase.id}`,
            unitId: "",
            note: `找错案件：${activeCase.title}（原文 ${original}）`,
            tags: "找错"
          }).data;
        }
        return next;
      });
      setWordsAdded(true);
    })();
  };

  if (cases.length === 0) {
    return (
      <div className="page hunt-page">
        <PageHeader eyebrow="找错" title="侦探找错" description="点击可疑的词，选对罪名，把段落里的语法漏洞全部找出来。" />
        <EmptyState title="案件卷宗还在整理中" description="暂时没有可侦查的案件，稍后再来看看。" />
      </div>
    );
  }

  if (!activeCase) {
    return (
      <div className="page hunt-page">
        <PageHeader
          eyebrow="找错"
          title="侦探找错"
          description="每段文字里都藏着几处语法漏洞，点中可疑词再选对罪名才算破案。"
        />

        <section className="hunt-stat-bar" aria-label="找错进度">
          <div className="hunt-stat">
            <strong>{solvedIds.size} / {summary.totalCases}</strong>
            <span>已破案</span>
          </div>
          <div className="hunt-stat">
            <strong>{summary.totalMisses}</strong>
            <span>累计误判</span>
          </div>
          <div className="hunt-stat">
            <strong>{summary.hitCount}</strong>
            <span>命中数</span>
          </div>
        </section>

        <div className="hunt-case-list">
          {cases.map((caseItem) => {
            const isSolved = solvedIds.has(caseItem.id);
            const isNext = highlightCaseId === caseItem.id && !isSolved;
            return (
              <button
                type="button"
                key={caseItem.id}
                className={`hunt-case-card${isSolved ? " solved" : ""}${isNext ? " next" : ""}`}
                onClick={() => openCase(caseItem)}
              >
                <div className="hunt-case-card-head">
                  <span className="hunt-case-number">案件 {String(caseItem.number).padStart(2, "0")}</span>
                  <strong>{caseItem.title}</strong>
                  {isSolved && (
                    <span className="hunt-case-stars" aria-label="已破案">
                      {"★".repeat(3)}
                    </span>
                  )}
                  {isNext && <span className="hunt-case-next-badge">下一案</span>}
                </div>
                <p className="hunt-case-scene">{caseItem.scene}</p>
                <span className="hunt-case-meta">{caseItem.errors.length} 处线索</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const remainingClues = Math.max(0, HUNT_CLUE_BUDGET - misses);
  const isSolvedNow = found.length === activeCase.errors.length;

  return (
    <div className="page hunt-page">
      <div className="hunt-investigate-topbar">
        <button type="button" className="icon-button" onClick={backToList} aria-label="返回案件列表" title="返回案件列表">
          <ArrowLeft size={17} />
        </button>
        <div className="hunt-investigate-title">
          <strong>{activeCase.title}</strong>
          <span>已找到 {found.length} / {activeCase.errors.length}</span>
        </div>
        <div className="hunt-clue-meter" aria-label="剩余线索额度">
          线索额度 {remainingClues} / {HUNT_CLUE_BUDGET}
        </div>
      </div>

      <section className="hunt-brief" aria-label="任务说明">
        <div className="hunt-brief-main">
          <span className="hunt-brief-icon" aria-hidden="true">
            <Search size={18} />
          </span>
          <div>
            <strong>你的任务</strong>
            <p>
              下面这段话里藏着 <b>{activeCase.errors.length}</b> 处语法漏洞。把它们全部找出来，就破案了。
            </p>
          </div>
        </div>
        <div className="hunt-brief-steps">
          <span className="hunt-step">
            <i>1</i>点出觉得有问题的词
          </span>
          <span className="hunt-step">
            <i>2</i>给它选一个「罪名」
          </span>
          <span className="hunt-step">
            <i>3</i>全部命中即破案
          </span>
        </div>
        <div className="hunt-progress" aria-label={`已找到 ${found.length} / ${activeCase.errors.length}`}>
          <div className="hunt-progress-bar">
            <i
              style={{
                width: `${activeCase.errors.length ? (found.length / activeCase.errors.length) * 100 : 0}%`
              }}
            />
          </div>
          <span>
            {found.length} / {activeCase.errors.length}
          </span>
        </div>
      </section>

      {remainingClues === 0 && (
        <p className="hunt-clue-exhausted">线索额度用完了，不过没关系，照样可以继续找错，只是要多靠自己判断。</p>
      )}

      {activeCase.notes && activeCase.notes.length > 0 && (
        <section className="hunt-notes" aria-label="生词提示">
          <span className="hunt-notes-label">生词提示</span>
          {activeCase.notes.map((note) => (
            <span className="hunt-note-chip" key={note.word}>
              <strong>{note.word}</strong> {note.zh}
            </span>
          ))}
        </section>
      )}

      <section className="hunt-token-panel" aria-label="案件原文">
        <p className="hunt-token-flow">
          {activeCase.tokens.map((token, index) => {
            const className = found.includes(index)
              ? "hunt-token found"
              : selectedToken === index
                ? "hunt-token inspecting"
                : "hunt-token idle";
            return (
              <span
                key={`${token}-${index}`}
                className={className}
                role="button"
                tabIndex={0}
                onClick={() => handleTokenClick(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleTokenClick(index);
                  }
                }}
              >
                {token}
              </span>
            );
          })}
        </p>
        <div className="hunt-token-tools">
          <SpeakButton text={activeCase.tokens.join(" ")} />
          <span className="hunt-token-tools-hint">
            觉得哪个词有问题，就点它。注意：也有些词看着可疑，其实没有问题。
          </span>
        </div>
      </section>

      {feedback && !settledResult && (
        <section
          className={`hunt-verdict-card ${
            feedback.kind === "hit" ? "hit" : feedback.kind === "wrongTag" ? "warn" : "info"
          }`}
          aria-live="polite"
        >
          <p className="hunt-verdict-message">{feedback.message}</p>
          {feedback.kind === "hit" && feedback.error && (
            <>
              <p className="hunt-verdict-correction">
                {feedback.error.original} → <strong>{feedback.error.correction}</strong>
              </p>
              <p className="hunt-verdict-explanation">{feedback.error.explanation}</p>
            </>
          )}
          {feedback.kind === "wrongTag" && <p className="hunt-verdict-hint">罪名可以先放一放，也可以换个罪名再试一次。</p>}
        </section>
      )}

      {selectedToken !== null && !settledResult && (
        <section className="hunt-verdict-card picking" aria-label="选择罪名">
          <p className="hunt-verdict-question">
            「{activeCase.tokens[selectedToken]}」的罪名是？
          </p>
          <div className="hunt-tag-grid">
            {ALL_TAGS.map((tag) => (
              <button type="button" key={tag} className="hunt-tag-btn" onClick={() => handleTagPick(tag)}>
                <strong>{GRAMMAR_ERROR_TAG_LABELS[tag]}</strong>
                <span>{GRAMMAR_ERROR_TAG_PLAIN[tag]}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {settledResult && (
        <section className="hunt-settle" aria-label="破案结算">
          <h2>
            <CheckCircle2 size={20} /> 破案！
          </h2>
          <div className="hunt-settle-stars" aria-label={`${settledResult.stars} 星`}>
            {"★".repeat(settledResult.stars)}
            {"☆".repeat(3 - settledResult.stars)}
          </div>
          <dl className="hunt-settle-stats">
            <div>
              <dt>找到线索</dt>
              <dd>{settledResult.found} / {settledResult.total}</dd>
            </div>
            <div>
              <dt>误判次数</dt>
              <dd>{settledResult.misses}</dd>
            </div>
            <div>
              <dt>耗时</dt>
              <dd>{formatDuration(settledResult.durationMs)}</dd>
            </div>
          </dl>
          <div className="hunt-settle-actions">
            <button type="button" className="secondary-button" onClick={addCorrectionsToMistakeBook} disabled={wordsAdded}>
              <BookPlus size={16} />
              {wordsAdded ? "已加入错词本" : `把 ${activeCase.errors.length} 个改正词加入错词本`}
            </button>
            <button type="button" className="primary-button" onClick={backToList}>
              <RotateCcw size={16} />
              再来一案
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
