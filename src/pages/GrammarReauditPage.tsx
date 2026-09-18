import { CheckCircle2, Lock } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppData } from "../AppContext";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SpeakButton from "../components/SpeakButton";
import { getGrammarLesson, getLessonStageLock, isLessonStageDone, markLessonStageDone } from "../services/lessonService";
import { buildAmbushQuestions, buildStage3CasePlan, judgeAmbushPick, type AmbushQuestion } from "../services/grammarAmbushService";
import { GRAMMAR_ERROR_TAG_LABELS, judgeGuess, findErrorAt } from "../services/huntService";
import { appendGrammarEvent, listGrammarEventsByKind } from "../services/grammarTelemetry";
import { nowIso } from "../services/storage";
import type { GrammarErrorTag, HuntCase } from "../types";

/**
 * F1 关 3 · 旧案重审关（2026-09-13 PRD §6.1）。
 * 内容：本课新案 + 30–50% 旧罪名变式（buildStage3CasePlan）+ 回马枪 1 题（buildAmbushQuestions）。
 * 交互复用侦探找错的成熟机制：点可疑词 → 选罪名 → 命中即找齐。完成制（无正确率门槛）。
 * 叙事：「旧案重审：真凶换了个马甲」——同一罪名、不同案情，是间隔提取 + 变式迁移。
 */

const ALL_TAGS = Object.keys(GRAMMAR_ERROR_TAG_LABELS) as GrammarErrorTag[];

const readCompletedAt = (lessonId: string): string | null => {
  const events = listGrammarEventsByKind("grammar_lesson_completed").filter((e) => e.lessonId === lessonId);
  return events.length > 0 ? events[events.length - 1].completedAt : null;
};

interface CasePlayState {
  found: number[];
  misses: number;
  settled: boolean;
}

export default function GrammarReauditPage() {
  const { lessonId = "" } = useParams();
  const { data, updateData } = useAppData();
  const lesson = getGrammarLesson(lessonId);

  const plan = useMemo(() => buildStage3CasePlan(lessonId), [lessonId]);
  const allCases = useMemo(() => [...plan.newCases, ...plan.revisitCases], [plan]);
  const ambush = useMemo(
    () => buildAmbushQuestions(data, lessonId, 1, allCases.map((c) => c.id))[0] ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lessonId]
  );

  const [caseIndex, setCaseIndex] = useState(0);
  const [phase, setPhase] = useState<"cases" | "ambush" | "done">("cases");
  const [playState, setPlayState] = useState<CasePlayState>({ found: [], misses: 0, settled: false });
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const [ambushAttempts, setAmbushAttempts] = useState(0);
  const [ambushDone, setAmbushDone] = useState(false);
  const [startedAt] = useState(() => Date.now());
  /** W0 补齐：关 3 进入事件——此前关 3 只有完成态、没有进入事件，到达率在数据上不可见。 */
  const startedLoggedRef = useRef(false);

  if (!lesson) {
    return (
      <div className="page lesson-page">
        <PageHeader eyebrow="语法" title="找不到这一课" />
        <EmptyState title="课程不存在" description="回到课程地图，挑一课开始吧。" />
        <div className="lesson-stage-actions">
          <Link to="/grammar" className="primary-button">返回课程地图</Link>
        </div>
      </div>
    );
  }

  const lock = getLessonStageLock(data, lessonId, 3, readCompletedAt);

  // 关 3 进入埋点（W0）：未锁且未完成时记一条（StrictMode 双跑保护）。
  if (lock.state === "unlocked" && !startedLoggedRef.current) {
    startedLoggedRef.current = true;
    appendGrammarEvent({ kind: "grammar_reaudit_started", lessonId, ts: nowIso() });
  }

  if (lock.state === "locked") {
    return (
      <div className="page lesson-page">
        <PageHeader eyebrow="语法 · 旧案重审" title={`第 ${lesson.number} 课 · 旧案重审`} />
        <EmptyState title="重审关还没解锁" description="先完成本课的次日回访关，再来重审旧案。" />
        <div className="lesson-stage-actions">
          <Link to={`/grammar/lesson/${lesson.id}/revisit`} className="primary-button"><Lock size={15} /> 去做回访关</Link>
          <Link to="/grammar" className="secondary-button">返回课程地图</Link>
        </div>
      </div>
    );
  }

  if (isLessonStageDone(data, lessonId, 3) || phase === "done") {
    return (
      <div className="page lesson-page">
        <PageHeader eyebrow="语法 · 旧案重审" title={`第 ${lesson.number} 课 · 三关全过`} />
        <section className="lesson-stage" aria-label="三关全过">
          <div className="lesson-complete">
            <CheckCircle2 size={28} />
            <h2>本课三关全过</h2>
            <p className="lesson-summary-rule">
              正课 → 次日回访 → 旧案重审，这一课你提取了三次——它已经不只是「看过」，而是真的长在身上了一部分。
            </p>
            <div className="lesson-stage-actions">
              <Link to="/grammar" className="primary-button">返回课程地图</Link>
              {/* R-B5 软入口：承接「关 3 做完然后呢」——不做按钮，只一行文本链。 */}
              <Link
                to={`/grammar/boost/${lesson.id}?from=reaudit`}
                className="ghost-link"
                onClick={() =>
                  appendGrammarEvent({
                    kind: "grammar_boost_offered",
                    lessonId: lesson.id,
                    entryPoint: "reaudit",
                    recommendedTier: 3,
                    ts: nowIso()
                  })
                }
              >
                这一课还能：趁热练一遍
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const activeCase: HuntCase | undefined = allCases[caseIndex];
  const isRevisitCase = activeCase ? plan.revisitCases.some((c) => c.id === activeCase.id) : false;

  const finishReaudit = () => {
    updateData((latest) => markLessonStageDone(latest, lessonId, 3));
    setPhase("done");
  };

  const advanceCase = () => {
    if (caseIndex + 1 >= allCases.length) {
      if (ambush && !ambushDone) setPhase("ambush");
      else finishReaudit();
      return;
    }
    setCaseIndex((i) => i + 1);
    setPlayState({ found: [], misses: 0, settled: false });
    setSelectedToken(null);
  };

  const pickToken = (tokenIndex: number) => {
    if (!activeCase || playState.settled) return;
    if (playState.found.includes(tokenIndex)) return;
    setSelectedToken(tokenIndex === selectedToken ? null : tokenIndex);
  };

  const pickTag = (tag: GrammarErrorTag) => {
    if (!activeCase || selectedToken === null || playState.settled) return;
    const verdict = judgeGuess(activeCase, selectedToken, tag, playState.found);
    appendGrammarEvent({
      kind: "hunt_verdict",
      caseId: activeCase.id,
      tokenIndex: selectedToken,
      verdictKind: verdict.kind,
      guessedTag: tag,
      ts: nowIso()
    });
    if (verdict.kind === "hit") {
      const nextFound = [...playState.found, selectedToken];
      const settled = nextFound.length >= activeCase.errors.length;
      setPlayState({ found: nextFound, misses: playState.misses, settled });
      if (settled) {
        appendGrammarEvent({
          kind: "hunt_case_settled",
          caseId: activeCase.id,
          found: nextFound.length,
          total: activeCase.errors.length,
          misses: playState.misses,
          stars: playState.misses === 0 ? 3 : playState.misses <= 2 ? 2 : 1,
          durationMs: Date.now() - startedAt,
          solved: true,
          ts: nowIso()
        });
      }
    } else {
      setPlayState({ ...playState, misses: playState.misses + 1 });
    }
    setSelectedToken(null);
  };

  const pickAmbushToken = (tokenIndex: number) => {
    if (!ambush || ambushDone) return;
    const attempts = ambushAttempts + 1;
    setAmbushAttempts(attempts);
    const passed = judgeAmbushPick(ambush, tokenIndex);
    appendGrammarEvent({
      kind: "grammar_ambush_result",
      hostId: `${lessonId}#3`,
      sourceLessonId: ambush.sourceLessonId ?? "",
      weakSpotTag: ambush.weakSpotTag,
      caseId: ambush.caseItem.id,
      passed,
      attempts,
      ts: nowIso()
    });
    if (passed) {
      setAmbushDone(true);
      finishReaudit();
    }
  };

  // ── 回马枪阶段 ──
  if (phase === "ambush" && ambush) {
    return (
      <div className="page lesson-page">
        <PageHeader eyebrow="语法 · 旧案重审" title={`第 ${lesson.number} 课 · 回马一枪`} description={ambush.promptZh} />
        <section className="lesson-stage" aria-label="回马一枪">
          <div className="lesson-quiz-card">
            <div className="lesson-contrast-block">
              <p className="lesson-section-label">{ambush.caseItem.title}</p>
              <div className="lesson-spot-row">
                {ambush.caseItem.tokens.map((token, ti) => (
                  <button type="button" className="lesson-chip" key={ti} onClick={() => pickAmbushToken(ti)} disabled={ambushDone}>
                    {token}
                  </button>
                ))}
              </div>
              {ambushAttempts > 0 && !ambushDone && <p className="lesson-spot-hint">这个词块看起来没问题，再找找别的。</p>}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── 案件重审阶段 ──
  if (!activeCase) {
    return (
      <div className="page lesson-page">
        <PageHeader eyebrow="语法 · 旧案重审" title={`第 ${lesson.number} 课`} />
        <EmptyState title="本课暂无可重审的案件" description="这一课还没有关联的侦探案件，先去别的课看看。" />
        <div className="lesson-stage-actions">
          <button type="button" className="primary-button" onClick={finishReaudit}>跳过此关</button>
          <Link to="/grammar" className="secondary-button">返回课程地图</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page lesson-page">
      <PageHeader
        eyebrow="语法 · 旧案重审"
        title={`第 ${lesson.number} 课 · ${activeCase.title}`}
        description={isRevisitCase ? "旧案重审：真凶换了个马甲——同一罪名、不同案情。指出有问题的词，选对罪名。" : "本课新案：指出有问题的词，选对罪名。"}
      />
      <section className="lesson-stage" aria-label="旧案重审">
        <div className="lesson-quiz-card">
          <div className="lesson-quiz-head">
            <span className="lesson-quiz-step">案件 {caseIndex + 1} / {allCases.length}{isRevisitCase ? " · 旧案变式" : " · 本课新案"}</span>
            <span className="lesson-quiz-note">已找到 {playState.found.length} / {activeCase.errors.length} 处</span>
          </div>

          <div className="hunt-tokens" aria-label="案件原文">
            {activeCase.tokens.map((token, ti) => {
              const isFound = playState.found.includes(ti);
              const isSelected = selectedToken === ti;
              // 2026-09-17 排版修复：类名对齐侦探页词块三态（found / inspecting / idle），
              // 样式见 styles.css 的 .hunt-token 强化规则（原先 selected 类无对应规则）。
              return (
                <button
                  type="button"
                  key={ti}
                  className={isFound ? "hunt-token found" : isSelected ? "hunt-token inspecting" : "hunt-token idle"}
                  onClick={() => pickToken(ti)}
                  disabled={playState.settled}
                >
                  {token}
                </button>
              );
            })}
          </div>

          {selectedToken !== null && !playState.settled && (
            <div className="hunt-tag-picker" aria-label="选罪名">
              <p className="lesson-section-label">这处是什么问题？</p>
              <div className="hunt-tag-row">
                {ALL_TAGS.map((tag) => (
                  <button type="button" className="hunt-tag" key={tag} onClick={() => pickTag(tag)}>
                    {GRAMMAR_ERROR_TAG_LABELS[tag]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {playState.settled && (
            <div className="lesson-feedback pass" aria-live="polite">
              <p><CheckCircle2 size={16} /> 案件审完！找出 {playState.found.length} 处问题{playState.misses > 0 ? `，误判 ${playState.misses} 次` : "，零误判"}。</p>
              <div className="hunt-settle-detail">
                {activeCase.errors.map((error) => (
                  <p key={error.tokenIndex} className="hunt-settle-line">
                    <strong>{error.original}</strong> → {error.correction}（{GRAMMAR_ERROR_TAG_LABELS[error.tag]}）：{error.explanation}
                    <SpeakButton text={activeCase.tokens.join(" ")} />
                  </p>
                ))}
              </div>
              <button type="button" className="primary-button" onClick={advanceCase}>
                {caseIndex + 1 >= allCases.length ? (ambush && !ambushDone ? "最后一题：回马一枪" : "完成重审") : "下一案"}
              </button>
            </div>
          )}
        </div>
        <div className="lesson-stage-actions center">
          <Link to="/grammar" className="ghost-link">先回去，晚点再来</Link>
        </div>
      </section>
    </div>
  );
}
