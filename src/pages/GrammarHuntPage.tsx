import { ArrowLeft, BookPlus, CheckCircle2, ChevronDown, Lightbulb, Lock, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppData } from "../AppContext";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SpeakButton from "../components/SpeakButton";
import { LESSON_GROUPS } from "../data/grammarSeasons";
import { addOrUpdateWordWithResult } from "../services/cardService";
import { findDictionaryEntryAsync } from "../services/dictionaryService";
import { appendGrammarEvent } from "../services/grammarTelemetry";
import { nowIso } from "../services/storage";
import {
  addHuntGapSentences,
  appendHuntAttempt,
  appendHuntResult,
  buildHintMessage,
  buildHuntResult,
  GRAMMAR_ERROR_TAG_LABELS,
  GRAMMAR_ERROR_TAG_PLAIN,
  HUNT_CLUE_BUDGET,
  judgeGuess,
  listHuntCasesWithLock,
  pickCorrectionWord,
  pickHintTarget,
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
  // R01 课程锁：案件随课程进度解锁；未解锁案置灰，不可进入。
  const lockInfos = useMemo(() => listHuntCasesWithLock(data), [data]);
  const lockInfoById = useMemo(() => new Map(lockInfos.map((info) => [info.caseItem.id, info])), [lockInfos]);
  const summary = useMemo(() => summarizeHuntProgress(data), [data]);
  const solvedIds = useMemo(() => new Set(summary.solvedCaseIds), [summary.solvedCaseIds]);

  // R12 按课筛选：全部 / 第 N 课 / 番外（未被课程引用的案）。筛选状态不进存储。
  const [lessonFilter, setLessonFilter] = useState<string>("all");
  const lessonOptions = useMemo(() => {
    const seen = new Map<number, { number: number; title: string; anyUnlocked: boolean }>();
    for (const info of lockInfos) {
      if (info.unlockLesson) {
        const existing = seen.get(info.unlockLesson.number);
        seen.set(info.unlockLesson.number, {
          number: info.unlockLesson.number,
          title: info.unlockLesson.title,
          // P2-2：该课有可玩案件才标 anyUnlocked（chip 据此加锁标）
          anyUnlocked: (existing?.anyUnlocked ?? false) || info.unlocked
        });
      }
    }
    return [...seen.values()].sort((a, b) => a.number - b.number);
  }, [lockInfos]);
  const hasExtraCases = useMemo(() => lockInfos.some((info) => !info.unlockLesson), [lockInfos]);
  // P2-2：番外案整体是否解锁（第 12 课完成后解锁）
  const extraUnlocked = useMemo(() => lockInfos.some((info) => !info.unlockLesson && info.unlocked), [lockInfos]);
  const cases = useMemo(() => {
    const filtered = lockInfos.filter((info) => {
      if (lessonFilter === "all") return true;
      if (lessonFilter === "extra") return !info.unlockLesson;
      return info.unlockLesson?.number === Number(lessonFilter);
    });
    return filtered.map((info) => info.caseItem);
  }, [lockInfos, lessonFilter]);

  const [activeCase, setActiveCase] = useState<HuntCase | null>(null);
  const [found, setFound] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<HuntVerdict | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [settledResult, setSettledResult] = useState<HuntResult | null>(null);
  const [highlightCaseId, setHighlightCaseId] = useState<string | null>(null);
  const [wordsAdded, setWordsAdded] = useState(false);
  // 提示与复盘：提示消耗线索额度；wrongTag / 提示过的词在复盘里如实标注
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [hintedTokens, setHintedTokens] = useState<number[]>([]);
  const [wrongTagTokens, setWrongTagTokens] = useState<number[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [deepLinkHandled, setDeepLinkHandled] = useState(false);

  // 2026-09-17 排版优化：46 个课程 chip 收折——默认只露「全部 + 已解锁课 + 番外」，
  // 其余进「更多课程」抽屉。学习路径越深，可见 chip 越多（未解锁课不再抢占首屏）。
  const [moreFilterOpen, setMoreFilterOpen] = useState(false);
  const primaryLessonOptions = useMemo(
    () => lessonOptions.filter((option) => option.anyUnlocked),
    [lessonOptions]
  );
  const hiddenLessonOptions = useMemo(
    () => lessonOptions.filter((option) => !option.anyUnlocked),
    [lessonOptions]
  );
  // 从「更多」里选中后按钮收起但保留可见（否则选中态会消失在抽屉里）
  const visibleLessonOptions = useMemo(() => {
    const selectedHidden = hiddenLessonOptions.find((option) => String(option.number) === lessonFilter);
    return moreFilterOpen
      ? [...primaryLessonOptions, ...hiddenLessonOptions]
      : selectedHidden
        ? [...primaryLessonOptions, selectedHidden]
        : primaryLessonOptions;
  }, [moreFilterOpen, primaryLessonOptions, hiddenLessonOptions, lessonFilter]);

  // 2026-09-17 排版优化：案件按季分组（58 案 5.1 屏 → 折叠后的章节化列表）。
  // 分组依据与路径页共用 LESSON_GROUPS；番外案（无 unlockLesson）单独一组。
  const [caseGroupOverrides, setCaseGroupOverrides] = useState<Record<string, boolean>>({});
  const caseGroups = useMemo(() => {
    const groups = LESSON_GROUPS.map((season) => {
      const groupCases = cases.filter((item) => {
        const unlockLesson = lockInfoById.get(item.id)?.unlockLesson;
        return unlockLesson ? unlockLesson.number >= season.min && unlockLesson.number <= season.max : false;
      });
      return { id: season.id, label: season.label, cases: groupCases };
    }).filter((group) => group.cases.length > 0);
    const extraCases = cases.filter((item) => !lockInfoById.get(item.id)?.unlockLesson);
    if (extraCases.length > 0) {
      groups.push({ id: "extra", label: "番外 · 综合复习", cases: extraCases });
    }
    return groups;
  }, [cases, lockInfoById]);

  // 默认展开规则：优先包含「下一案」（高亮案）的组；否则展开第一个还有未破案的组；
  // 课程筛选激活时组内就是筛选结果，直接展开该组；全部锁定/全部破完时回落第一组。
  const defaultOpenCaseGroupId = useMemo(() => {
    if (caseGroups.length === 0) return null;
    if (lessonFilter !== "all") return caseGroups[0].id;
    if (highlightCaseId) {
      const highlighted = caseGroups.find((group) => group.cases.some((item) => item.id === highlightCaseId));
      if (highlighted) return highlighted.id;
    }
    const firstUnsolved = caseGroups.find((group) =>
      group.cases.some((item) => !solvedIds.has(item.id) && lockInfoById.get(item.id)?.unlocked)
    );
    return firstUnsolved?.id ?? caseGroups[0].id;
  }, [caseGroups, highlightCaseId, lessonFilter, solvedIds, lockInfoById]);
  const isCaseGroupOpen = (groupId: string) => caseGroupOverrides[groupId] ?? groupId === defaultOpenCaseGroupId;
  const toggleCaseGroup = (groupId: string) =>
    setCaseGroupOverrides((current) => ({
      ...current,
      [groupId]: !(current[groupId] ?? groupId === defaultOpenCaseGroupId)
    }));

  // 课程页第④段跳转进来：/grammar/hunt?case=<caseId> 直接进入该案。
  // R01：深链也过锁——理论上课程页只链已解锁案，此处兜底防止手工拼 URL 越级。
  useEffect(() => {
    if (deepLinkHandled) return;
    const caseId = searchParams.get("case");
    const target = caseId ? cases.find((item) => item.id === caseId) : undefined;
    if (target && lockInfoById.get(target.id)?.unlocked) openCase(target);
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
    setHintsUsed(0);
    setHintMessage(null);
    setHintedTokens([]);
    setWrongTagTokens([]);
  };

  const backToList = () => {
    if (activeCase) {
      // R01：「下一案」只在已解锁案里挑，避免高亮一个还进不去的案件。
      const unlockedUnsolved = (item: HuntCase) =>
        !solvedIds.has(item.id) && (lockInfoById.get(item.id)?.unlocked ?? false);
      const nextUnsolved =
        cases.find((item) => item.number > activeCase.number && unlockedUnsolved(item)) ??
        cases.find((item) => item.id !== activeCase.id && unlockedUnsolved(item)) ??
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
    setHintMessage(null);
  };

  /** 用户主动请求提示：消耗 1 条线索额度，只给「罪名 + 大概位置」，不给答案。 */
  const handleHint = () => {
    if (!activeCase || settledResult) return;
    const target = pickHintTarget(activeCase, found);
    if (!target) return;
    if (HUNT_CLUE_BUDGET - misses - hintsUsed <= 0) return;
    setHintsUsed((current) => current + 1);
    setHintedTokens((current) =>
      current.includes(target.tokenIndex) ? current : [...current, target.tokenIndex]
    );
    setHintMessage(buildHintMessage(activeCase, target));
    setFeedback(null);
    appendGrammarEvent({
      kind: "hunt_hint_used",
      caseId: activeCase.id,
      tag: target.tag,
      tokenIndex: target.tokenIndex,
      ts: nowIso()
    });
  };

  const settleCase = (caseItem: HuntCase, currentMisses: number) => {
    const result = buildHuntResult(caseItem, currentMisses, Date.now() - startedAt, new Date(startedAt).toISOString());
    setSettledResult(result);
    // R02：结案时把本局的知识缺口（看过提示/罪名绕弯的植错点）生成句子卡进 SM-2 复习队列（幂等）
    const gapTokens = [...new Set([...hintedTokens, ...wrongTagTokens])];
    updateData((latest) => addHuntGapSentences(appendHuntResult(latest, result), caseItem, gapTokens).data);
    // R19：结算埋点——破案率与单案耗时的唯一来源（此前不可测）
    appendGrammarEvent({
      kind: "hunt_case_settled",
      caseId: result.caseId,
      found: result.found,
      total: result.total,
      misses: result.misses,
      stars: result.stars,
      durationMs: result.durationMs,
      solved: result.found >= result.total,
      ts: nowIso()
    });
  };

  const handleTagPick = (tag: GrammarErrorTag) => {
    if (!activeCase || selectedToken === null || settledResult) return;

    const verdict = judgeGuess(activeCase, selectedToken, tag, found);
    setFeedback(verdict);
    setHintMessage(null);
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
      setWrongTagTokens((current) =>
        current.includes(selectedToken) ? current : [...current, selectedToken]
      );
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

        {/* R12 按课筛选：学完→即用的闭环（只刷某课关联的案）。
            2026-09-17 排版优化：46 个 chip 收折——默认只露「全部 + 已解锁课 + 番外」，
            未解锁课收进「更多课程」，首屏不再被筛选条吃掉。 */}
        <div className="hunt-filter-bar" aria-label="按课程筛选案件">
          <button
            type="button"
            className={`hunt-filter-chip${lessonFilter === "all" ? " on" : ""}`}
            onClick={() => setLessonFilter("all")}
          >
            全部案件
          </button>
          {visibleLessonOptions.map((option) => (
            <button
              type="button"
              key={option.number}
              className={`hunt-filter-chip${lessonFilter === String(option.number) ? " on" : ""}${option.anyUnlocked ? "" : " locked"}`}
              onClick={() => setLessonFilter(String(option.number))}
              title={option.anyUnlocked ? option.title : `${option.title}（还没学到）`}
            >
              {!option.anyUnlocked && <Lock size={11} aria-hidden="true" />}
              第 {option.number} 课
            </button>
          ))}
          {hasExtraCases && (
            <button
              type="button"
              className={`hunt-filter-chip${lessonFilter === "extra" ? " on" : ""}${extraUnlocked ? "" : " locked"}`}
              onClick={() => setLessonFilter("extra")}
              title={extraUnlocked ? "综合复习" : "完成第 12 课后解锁"}
            >
              {!extraUnlocked && <Lock size={11} aria-hidden="true" />}
              番外 · 综合复习
            </button>
          )}
          {hiddenLessonOptions.length > 0 && (
            <button
              type="button"
              className="hunt-filter-chip hunt-filter-more"
              aria-expanded={moreFilterOpen}
              onClick={() => setMoreFilterOpen((open) => !open)}
            >
              {moreFilterOpen ? "收起到已解锁" : `更多课程 (${hiddenLessonOptions.length})`}
              <ChevronDown size={12} className={`hunt-filter-more-chevron${moreFilterOpen ? " is-open" : ""}`} aria-hidden="true" />
            </button>
          )}
        </div>

        {caseGroups.map((group) => {
          const groupSolved = group.cases.filter((item) => solvedIds.has(item.id)).length;
          const open = isCaseGroupOpen(group.id);
          const bodyId = `hunt-case-group-${group.id}`;
          return (
            <section
              key={group.id}
              className={`hunt-case-group${open ? " is-open" : " is-closed"}`}
              aria-label={group.label}
            >
              <button
                type="button"
                className="hunt-case-group-head"
                aria-expanded={open}
                aria-controls={bodyId}
                onClick={() => toggleCaseGroup(group.id)}
              >
                <ChevronDown size={15} className="hunt-case-group-chevron" aria-hidden="true" />
                <h2>{group.label}</h2>
                <span className="hunt-case-group-count">
                  {groupSolved > 0 ? `已破 ${groupSolved} / ${group.cases.length} 案` : `${group.cases.length} 案`}
                </span>
              </button>
              {open && (
                <div className="hunt-case-list" id={bodyId}>
                  {group.cases.map((caseItem) => {
                    const isSolved = solvedIds.has(caseItem.id);
                    const lockInfo = lockInfoById.get(caseItem.id);
                    const isLocked = lockInfo ? !lockInfo.unlocked : false;
                    const isNext = highlightCaseId === caseItem.id && !isSolved && !isLocked;
                    return (
                      <button
                        type="button"
                        key={caseItem.id}
                        className={`hunt-case-card${isSolved ? " solved" : ""}${isNext ? " next" : ""}${isLocked ? " locked" : ""}`}
                        onClick={() => {
                          if (!isLocked) openCase(caseItem);
                        }}
                        disabled={isLocked}
                        aria-disabled={isLocked}
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
                          {isLocked && <span className="hunt-case-lock-badge">未解锁</span>}
                        </div>
                        <p className="hunt-case-scene">{caseItem.scene}</p>
                        {isLocked && lockInfo?.unlockLesson ? (
                          <p className="hunt-case-lock-hint">
                            学完第 {lockInfo.unlockLesson.number} 课「{lockInfo.unlockLesson.title}」就来破案
                          </p>
                        ) : (
                          <span className="hunt-case-meta">{caseItem.errors.length} 处线索</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    );
  }

  const remainingClues = Math.max(0, HUNT_CLUE_BUDGET - misses - hintsUsed);
  const isSolvedNow = found.length === activeCase.errors.length;
  const cleanSolves = activeCase.errors.length - new Set([...hintedTokens, ...wrongTagTokens]).size;

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
          <button
            type="button"
            className="secondary-button"
            onClick={handleHint}
            disabled={remainingClues <= 0 || settledResult !== null || found.length >= activeCase.errors.length}
          >
            <Lightbulb size={15} /> 用 1 条线索提示一处
          </button>
          <span className="hunt-token-tools-hint">
            觉得哪个词有问题，就点它。注意：也有些词看着可疑，其实没有问题。
          </span>
        </div>
      </section>

      {hintMessage && !settledResult && (
        <section className="hunt-verdict-card info" aria-live="polite">
          <p className="hunt-verdict-message">💡 {hintMessage}</p>
        </section>
      )}

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

          {/* 案件复盘：逐条解析每个修改的原因（含本局绕弯/用提示的地方，如实标注） */}
          <div className="hunt-review" aria-label="案件复盘" style={{ textAlign: "left", display: "grid", gap: 10, marginTop: 16 }}>
            <p style={{ margin: 0, fontWeight: 650 }}>案件复盘 · 每个修改背后的原因</p>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.75 }}>
              本局 {cleanSolves} 处一次到位
              {hintedTokens.length > 0 && ` · ${hintedTokens.length} 处看过提示`}
              {wrongTagTokens.length > 0 && ` · ${wrongTagTokens.length} 处罪名绕了弯`}
              。复盘看懂原因，比一次找全更重要。
            </p>
            {activeCase.errors.map((error, index) => {
              const usedHint = hintedTokens.includes(error.tokenIndex);
              const wrongTagged = wrongTagTokens.includes(error.tokenIndex);
              return (
                <div key={error.tokenIndex} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      width: 22,
                      height: 22,
                      borderRadius: 999,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      border: "1px solid rgba(0,0,0,0.14)"
                    }}
                  >
                    {index + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                      <strong>{error.original}</strong>
                      <span>→</span>
                      <strong>{error.correction}</strong>
                      <span
                        title={GRAMMAR_ERROR_TAG_PLAIN[error.tag]}
                        style={{
                          padding: "1px 8px",
                          borderRadius: 999,
                          border: "1px solid rgba(0,0,0,0.14)",
                          fontSize: 11,
                          whiteSpace: "nowrap"
                        }}
                      >
                        {GRAMMAR_ERROR_TAG_LABELS[error.tag]}
                      </span>
                      {usedHint && (
                        <span style={{ fontSize: 11, opacity: 0.7, whiteSpace: "nowrap" }}>看过提示</span>
                      )}
                      {wrongTagged && (
                        <span style={{ fontSize: 11, opacity: 0.7, whiteSpace: "nowrap" }}>罪名绕了弯</span>
                      )}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>{error.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>

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
