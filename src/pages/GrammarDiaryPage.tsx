import { BookOpen, CalendarDays, PencilLine, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import {
  addDiarySentenceToReview,
  applyDiaryCorrection,
  getTodayDiaryQuestions,
  listDiaryEntries,
  listRecentDiaryQuestionIds,
  markDiaryCorrectionFailed,
  pickDailyDiaryQuestions,
  requestDiaryCorrection,
  saveDiaryEntry,
  summarizeDiaryProgress
} from "../services/diaryService";
import { appendGrammarEvent } from "../services/grammarTelemetry";
import { nowIso } from "../services/storage";
import { GRAMMAR_ERROR_TAG_LABELS, GRAMMAR_ERROR_TAG_PLAIN } from "../services/huntService";
import type { DiaryEntry, DiaryIssue } from "../types";
import type { PoolQuestion } from "../services/diaryService";

type DraftStatus = "idle" | "correcting" | "done" | "failed";

interface DraftState {
  value: string;
  entryId?: string;
  savedValue?: string;
  status: DraftStatus;
  correctedEn?: string;
  issues?: DiaryIssue[];
  /** R11：更地道的重述（recast）。 */
  recast?: string;
  message?: string;
}

const emptyDraft = (): DraftState => ({ value: "", status: "idle" });

const COUNT_OPTIONS = [3, 5, 10];

/** R09：一条批改问题——带语法点归因时展示罪名 chip（悬停看人话版解释）。 */
function DiaryIssueRow({ issue }: { issue: DiaryIssue }) {
  return (
    <li>
      <strong>{issue.original}</strong> → {issue.correction}
      {issue.explanation && <span className="diary-issue-note">{issue.explanation}</span>}
      {issue.tag && (
        <span
          className="diary-issue-tag"
          title={GRAMMAR_ERROR_TAG_PLAIN[issue.tag]}
          style={{
            marginLeft: 6,
            padding: "1px 8px",
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.14)",
            fontSize: 11,
            whiteSpace: "nowrap"
          }}
        >
          {GRAMMAR_ERROR_TAG_LABELS[issue.tag]}
        </span>
      )}
    </li>
  );
}

export default function GrammarDiaryPage() {
  const { data, updateData, updateDataAsync } = useAppData();
  const dailyCount = data.settings.diaryDailyCount;
  const todayKey = useMemo(() => summarizeDiaryProgress(data).todayDateKey, [data]);
  // R10：今日抽题带跨天回避——近 7 天写过的题优先不再出现（题池有限，新鲜度优先）
  const [groupQuestions, setGroupQuestions] = useState<PoolQuestion[]>(() =>
    pickDailyDiaryQuestions(
      new Date().toISOString().slice(0, 10),
      data.settings.diaryDailyCount,
      listRecentDiaryQuestionIds(data)
    )
  );
  const [drafts, setDrafts] = useState<Record<string, DraftState>>({});
  const [batch, setBatch] = useState<{ running: boolean; done: number; total: number } | null>(null);
  const [batchSummary, setBatchSummary] = useState<string | null>(null);
  const [moreHint, setMoreHint] = useState<string | null>(null);
  const [reviewAdded, setReviewAdded] = useState<Record<string, boolean>>({});

  const entries = useMemo(() => listDiaryEntries(data), [data]);
  const summary = useMemo(() => summarizeDiaryProgress(data), [data]);
  const aiReady = data.settings.aiProvider.enabled;

  // 2026-09-17 排版优化（二）：历史列表由「整页向下堆叠」改为「定高滚动区」——
  // 条目再多页面高度恒定，列表在框内滚动（照错词本侧栏 mb-date-list 的既有先例）。
  // 可见条数仍按 20 递增做渲染护栏，滚动到列表底部可「加载更多」。
  const historyListRef = useRef<HTMLDivElement | null>(null);
  const [historyEdges, setHistoryEdges] = useState({ top: false, bottom: false });
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(20);

  useEffect(() => {
    const list = historyListRef.current;
    if (!list) return;
    const sync = () => {
      const scrollable = list.scrollHeight > list.clientHeight + 2;
      const next = {
        top: scrollable && list.scrollTop > 4,
        bottom: scrollable && list.scrollTop + list.clientHeight < list.scrollHeight - 4
      };
      setHistoryEdges((prev) => (prev.top === next.top && prev.bottom === next.bottom ? prev : next));
    };
    sync();
    list.addEventListener("scroll", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(list);
    return () => {
      list.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [entries.length, visibleHistoryCount]);

  const updateDraft = (questionId: string, patch: Partial<DraftState>) => {
    setDrafts((current) => ({
      ...current,
      [questionId]: { ...emptyDraft(), ...(current[questionId] ?? {}), ...patch }
    }));
  };

  const isDirty = (draft: DraftState | undefined) =>
    Boolean(draft?.value.trim()) && draft!.value.trim() !== (draft?.savedValue ?? "");

  const pendingCount = groupQuestions.filter((question) => isDirty(drafts[question.id])).length;

  /** 整组写完后一次性批改：先全部落库（离线也安全），再逐句请求批改。 */
  const handleBatch = async () => {
    if (batch?.running) return;
    const pending = groupQuestions.filter((question) => isDirty(drafts[question.id]));
    if (pending.length === 0) return;

    setBatchSummary(null);
    setBatch({ running: true, done: 0, total: pending.length });

    let issueTotal = 0;
    let perfect = 0;
    let failed = 0;

    for (const question of pending) {
      const draft = drafts[question.id];
      const saved = await updateDataAsync(async (latest) =>
        saveDiaryEntry(latest, {
          dateKey: summary.todayDateKey,
          question: { id: question.id, zh: question.zh },
          answerEn: draft.value
        })
      );
      const entry = saved.entry;
      updateDraft(question.id, { entryId: entry.id, savedValue: draft.value.trim() });

      if (!aiReady) {
        updateDraft(question.id, {
          status: "done",
          message: "已保存。去设置里配置 AI 后，写下即可自动批改。"
        });
        continue;
      }

      updateDraft(question.id, { status: "correcting" });
      try {
        // R11：按设置传入批改强度（温柔/标准/严格），默认 standard
        const correction = await requestDiaryCorrection(
          data.settings.aiProvider,
          question.zh,
          entry.answerEn,
          data.settings.diaryCorrectionStyle ?? "standard"
        );
        await updateDataAsync(async (latest) => ({
          // R09：批改写回 + 带 tag 问题的句子自动进入复习队列（R03 规则）
          data: addDiarySentenceToReview(
            applyDiaryCorrection(latest, entry.id, correction.correctedEn, correction.issues),
            { ...entry, correctedEn: correction.correctedEn, issues: correction.issues }
          )
        }));
        setReviewAdded((current) => ({ ...current, [entry.id]: true }));
        // R01⑤：日记问题 → 语法点归因事件（自由输出 → 错因统计的桥）
        correction.issues.forEach((issue, issueIndex) => {
          if (!issue.tag) return;
          appendGrammarEvent({
            kind: "diary_issue_tag",
            entryId: entry.id,
            issueIndex,
            tag: issue.tag,
            ts: nowIso()
          });
        });
        updateDraft(question.id, {
          status: "done",
          correctedEn: correction.correctedEn,
          issues: correction.issues,
          recast: correction.recast,
          message:
            correction.issues.length > 0 ? "批改完成——这句和它的问题点已排进复习队列。" : undefined
        });
        issueTotal += correction.issues.length;
        if (correction.issues.length === 0) perfect += 1;
      } catch (error) {
        failed += 1;
        const message = error instanceof Error ? error.message : "批改暂时没有成功，句子已经保存。";
        await updateDataAsync(async (latest) => ({
          data: markDiaryCorrectionFailed(latest, entry.id, message)
        }));
        updateDraft(question.id, { status: "failed", message });
      }

      setBatch((current) => (current ? { ...current, done: current.done + 1 } : current));
    }

    const parts: string[] = [];
    if (failed > 0) parts.push(`${failed} 句暂未批改成功（句子已保存，可以再试一次）`);
    if (perfect > 0 && perfect === pending.length) parts.push("全部一次到位，太厉害了");
    else if (issueTotal > 0) parts.push(`共 ${issueTotal} 处小调整`);
    if (parts.length === 0) parts.push("都写下来了");
    setBatchSummary(parts.join("；") + "。");
    setBatch({ running: false, done: pending.length, total: pending.length });
  };

  /** 再来一组：避开今天已出的题；题库抽完时允许重复并提示。 */
  const handleMore = () => {
    const askedIds = groupQuestions.map((question) => question.id);
    const more = pickDailyDiaryQuestions(todayKey, dailyCount, askedIds);
    if (more.length === 0) {
      setMoreHint("今天的题目都做完了，明天再来。也可以去侦探那里破几个案子。");
      return;
    }
    setGroupQuestions((current) => [...current, ...more]);
    setMoreHint(`新加了 ${more.length} 个问题，继续。`);
  };

  /** 调整每日数量：立即把当前组补齐到目标数量（已写的和草稿都保留）。 */
  const handleCountChange = (count: number) => {
    if (count === dailyCount) return;
    updateData((latest) => ({
      ...latest,
      settings: { ...latest.settings, diaryDailyCount: count }
    }));
    setGroupQuestions((current) => {
      if (current.length >= count) return current;
      const more = pickDailyDiaryQuestions(
        todayKey,
        count - current.length,
        current.map((question) => question.id)
      );
      return [...current, ...more];
    });
    setMoreHint(`目标调整为每天 ${count} 句。`);
  };

  const handleAddToReview = (entry: DiaryEntry) => {
    if (reviewAdded[entry.id]) return;
    updateData((latest) => addDiarySentenceToReview(latest, entry));
    setReviewAdded((current) => ({ ...current, [entry.id]: true }));
  };

  const savedToday = groupQuestions.filter((question) => drafts[question.id]?.entryId).length;
  const canBatch = pendingCount > 0 && !(batch?.running ?? false);

  return (
    <div className="page diary-page">
      <PageHeader
        eyebrow="日记"
        title="我的英文日记"
        description="回答几个真实的小问题，写下你自己的英文。全部写完一次性批改。"
      />

      <section className="diary-stat-bar" aria-label="日记进度">
        <div className="diary-stat">
          <strong>{summary.totalEntries}</strong>
          <span>已写条数</span>
        </div>
        <div className="diary-stat">
          <strong>{summary.days}</strong>
          <span>覆盖天数</span>
        </div>
        <div className="diary-stat">
          <strong>{summary.correctedCount}</strong>
          <span>已批改</span>
        </div>
      </section>

      <section className="diary-today" aria-label="今日问题">
        <div className="ui-section-head">
          <div>
            <span className="eyebrow">Today</span>
            <h2>今天的句子</h2>
          </div>
          <span className="diary-saved-count">
            {savedToday > 0 ? `已保存 ${savedToday} / ${groupQuestions.length}` : "写完一起批改"}
          </span>
        </div>

        <div className="diary-count-row" role="group" aria-label="每天挑战数量">
          <span>今天挑战</span>
          {COUNT_OPTIONS.map((count) => (
            <button
              type="button"
              key={count}
              className={`diary-count-btn${count === dailyCount ? " on" : ""}`}
              onClick={() => handleCountChange(count)}
            >
              {count} 句
            </button>
          ))}
        </div>

        {groupQuestions.map((question, index) => {
          const draft = drafts[question.id] ?? emptyDraft();
          const settled = draft.status === "done" && !isDirty(draft);
          return (
            <article className="diary-question-card" key={question.id}>
              <p className="diary-question">
                <span className="diary-question-index">{index + 1}</span>
                {question.zh}
              </p>
              {question.hint && <p className="diary-hint">可以照着搭：{question.hint}</p>}
              <textarea
                className="diary-input"
                value={draft.value}
                rows={2}
                placeholder="用你会的词写一句英文，三个词也算数。"
                onChange={(event) => updateDraft(question.id, { value: event.target.value, message: undefined })}
                aria-label={question.zh}
              />
              {draft.status === "correcting" && <p className="diary-note">正在批改这一句…</p>}
              {settled && draft.message && <p className="diary-note">{draft.message}</p>}
              {settled && draft.correctedEn && draft.correctedEn !== draft.savedValue && (
                <p className="diary-entry-corrected">{draft.correctedEn}</p>
              )}
              {/* R11 recast：更地道的写法（与用户原句并排，只在地道版与修正版不同且存在时展示） */}
              {settled && draft.recast && draft.recast !== draft.correctedEn && (
                <p className="diary-entry-recast">
                  <span className="diary-recast-label">更地道的写法</span>
                  {draft.recast}
                </p>
              )}
              {settled && draft.issues && draft.issues.length > 0 && (
                <ul className="diary-issue-list">
                  {draft.issues.map((issue, issueIndex) => (
                    <DiaryIssueRow key={`${issue.original}-${issueIndex}`} issue={issue} />
                  ))}
                </ul>
              )}
              {draft.status === "failed" && draft.message && <p className="diary-note">{draft.message}</p>}
            </article>
          );
        })}

        <div className="diary-batch-bar">
          <button type="button" className="primary-button" onClick={() => void handleBatch()} disabled={!canBatch}>
            <PencilLine size={16} />
            {batch?.running
              ? `批改中 ${batch.done} / ${batch.total}…`
              : pendingCount > 0
                ? `写完了，一次性批改（${pendingCount} 句）`
                : "写完了一起批改"}
          </button>
          <button type="button" className="secondary-button" onClick={handleMore} disabled={batch?.running ?? false}>
            <Sparkles size={15} />
            再来一组（{dailyCount} 题）
          </button>
        </div>
        {batchSummary && <p className="diary-batch-summary">{batchSummary}</p>}
        {moreHint && <p className="diary-note">{moreHint}</p>}
        {/* P2-4：无 AI 用户的第一个动作入口升级为引导卡（不再是一行小字链接） */}
        {!aiReady && (
          <section className="diary-ai-guide" aria-label="开启自动批改">
            <div className="diary-ai-guide-copy">
              <strong>写下就会自动批改</strong>
              <p>配置一次 AI，之后每写完一句就会收到批改和讲解。现在写下的句子都会先保留。</p>
            </div>
            <Link to="/settings" className="primary-button diary-ai-guide-cta">
              去设置里配置 AI
            </Link>
          </section>
        )}
      </section>

      <section className="diary-history" aria-label="以前的日记">
        <div className="ui-section-head">
          <div>
            <span className="eyebrow">History</span>
            <h2>以前写下的句子</h2>
          </div>
          {/* 2026-09-17 排版优化：显式计数——不再静默丢弃 20 条以外的日记 */}
          {entries.length > 0 && (
            <span className="diary-history-count">
              {entries.length > visibleHistoryCount
                ? `共 ${entries.length} 条 · 显示最近 ${visibleHistoryCount} 条`
                : `共 ${entries.length} 条`}
            </span>
          )}
        </div>

        {entries.length === 0 ? (
          <EmptyState
            title="第一句还没写下来"
            description="上面挑一个你最有感觉的问题，写三个词也可以。30 天后回头看，你会吓一跳。"
          />
        ) : (
          <div className="diary-entry-list" ref={historyListRef}>
            {/* 定高滚动区：两端渐隐提示（照错词本 mb-date-fade 先例，仅可滚动且未到端时出现） */}
            <span className={`diary-history-fade top${historyEdges.top ? " on" : ""}`} aria-hidden="true" />
            {entries.slice(0, visibleHistoryCount).map((entry: DiaryEntry) => (
              <article className="diary-entry-card" key={entry.id}>
                <div className="diary-entry-head">
                  <span className="diary-entry-date">
                    <CalendarDays size={13} /> {entry.dateKey}
                  </span>
                  <span className="diary-entry-status">{entry.status === "done" ? "已批改" : "待批改"}</span>
                </div>
                <p className="diary-entry-question">{entry.questionZh}</p>
                <p className="diary-entry-answer">{entry.answerEn}</p>
                {entry.status === "done" && entry.correctedEn && entry.correctedEn !== entry.answerEn && (
                  <p className="diary-entry-corrected">{entry.correctedEn}</p>
                )}
                {entry.issues.length > 0 && (
                  <ul className="diary-issue-list">
                    {entry.issues.map((issue, issueIndex) => (
                      <DiaryIssueRow key={`${issue.original}-${issueIndex}`} issue={issue} />
                    ))}
                  </ul>
                )}
                {entry.note && <p className="diary-entry-note">{entry.note}</p>}
                <div className="diary-entry-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => handleAddToReview(entry)}
                    disabled={reviewAdded[entry.id]}
                  >
                    <BookOpen size={15} />
                    {reviewAdded[entry.id] ? "已在复习队列" : "加入复习队列"}
                  </button>
                </div>
              </article>
            ))}
            {/* 加载更多：渲染护栏（列表已在定高框内滚动，追加不改变页面高度） */}
            {entries.length > visibleHistoryCount && (
              <button
                type="button"
                className="diary-history-more"
                onClick={() => setVisibleHistoryCount((count) => count + 20)}
              >
                加载更多（还有 {entries.length - visibleHistoryCount} 条）
              </button>
            )}
            <span className={`diary-history-fade bottom${historyEdges.bottom ? " on" : ""}`} aria-hidden="true" />
          </div>
        )}
      </section>
    </div>
  );
}
