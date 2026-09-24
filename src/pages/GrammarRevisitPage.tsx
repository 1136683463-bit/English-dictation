import { CheckCircle2, Clock, Lightbulb } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { isSubmitKey } from "../components/imeGuard";
import { useAppData } from "../AppContext";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { getGrammarLesson, getLessonStageLock, isLessonStageDone, markLessonStageDone } from "../services/lessonService";
import { buildAmbushQuestions, buildRevisitQuiz, judgeAmbushPick, type AmbushQuestion, type RevisitQuestion } from "../services/grammarAmbushService";
import { appendGrammarEvent, listGrammarEventsByKind } from "../services/grammarTelemetry";
import { nowIso } from "../services/storage";
import { checkLessonTokens } from "../services/lessonService";
import { spellingMatches } from "../services/diffService";
import { explainForSentence } from "../services/grammarExplainService";
import WhyWrongPanel from "../components/WhyWrongPanel";
import { useWhyWrong } from "../components/useWhyWrong";

/**
 * F1 关 2 · 次日回访关（2026-09-13 PRD §6.1）。
 * 内容：本课句型 cloze/rebuild 提取题 3–5 题（buildRevisitQuiz）+ 回马枪 1 题（buildAmbushQuestions）。
 * 完成制（无正确率门槛）：题做完即 markLessonStageDone(2)；错题回流 SM-2 由 cloze/rebuild 判题侧记。
 * 埋点：grammar_revisit_started / grammar_revisit_completed + grammar_ambush_result（F4 口径已冻结）。
 */

/** 关 1 完成时间读取器（lessonService 注入模式的实现：取遥测最近一次 completed 事件）。 */
const readCompletedAt = (lessonId: string): string | null => {
  const events = listGrammarEventsByKind("grammar_lesson_completed").filter((e) => e.lessonId === lessonId);
  return events.length > 0 ? events[events.length - 1].completedAt : null;
};

export default function GrammarRevisitPage() {
  const { lessonId = "" } = useParams();
  const { data, updateData } = useAppData();
  const lesson = getGrammarLesson(lessonId);

  // 关 2 题目（回访 quiz + 回马枪 1 题），进页一次性出好（稳定不跳变）
  const quiz = useMemo(() => buildRevisitQuiz(lessonId), [lessonId]);
  const ambush = useMemo(
    () => buildAmbushQuestions(data, lessonId, 1, lesson?.huntCaseIds ?? [])[0] ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lessonId]
  );


  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"quiz" | "ambush" | "done">("quiz");
  const [clozeValue, setClozeValue] = useState("");
  const [rebuildPicked, setRebuildPicked] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "pass" | "retry">("idle");
  const [firstTryCount, setFirstTryCount] = useState(0);
  const [attemptsThisQ, setAttemptsThisQ] = useState(0);
  const [ambushAttempts, setAmbushAttempts] = useState(0);
  const [ambushDone, setAmbushDone] = useState(false);
  const [startedAt] = useState(() => Date.now());
  /** started 埋点去重（同一次挂载内只记一次；重新进入是新挂载，会照记）。 */
  const startedLoggedRef = useRef(false);

  /**
   * 「为什么我写的不对」追问层（2026-09-24 补）。
   *
   * 缺口：本页答错只有「再试一次 / 重来这题」——**既不看答案、也不能问为什么**，
   * 卡住时唯一出路是离开页面。答对时反倒给解释（`revisitWhy`），
   * 形成「成功者得到解释、失败者什么都没有」的反向不对称。
   *
   * 与课程页共用同一套实现（`useWhyWrong` + `WhyWrongPanel`）——
   * 这套逻辑此前在每个段各抄一份，已导致用户三次报告「AI 按钮又没有了」，
   * 故新落点一律走共享实现，不再复制。
   */
  const whyWrong = useWhyWrong({ lessonId, provider: data.settings.aiProvider });

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

  // 解锁判定：关 2 未解锁则提示（柔性入口，不硬阻塞——但直接访问 URL 时给明确引导）
  const lock = getLessonStageLock(data, lessonId, 2, readCompletedAt);
  const stage1DoneAt = readCompletedAt(lessonId);

  /**
   * 首次进入记 grammar_revisit_started（只记一次）。
   *
   * 2026-09-23 修（ST4 的 FAIL-2）：原判据是 `useState` 的 `startedLogged`，
   * 而 StrictMode 下组件会「挂载 → 卸载 → 重挂载」，state 随之重置 →
   * **一次进入记 2 条 started**，参与率分母翻倍。
   * 改用 **已落库事件反查**作为去重键：只要本课已有一条 started 就不再记，
   * 这与挂载次数无关（ref 也不行——重挂载会重建 ref）。
   * 口径与重审页的 `listGrammarEventsByKind("grammar_lesson_completed")` 反查一致。
   */
  useEffect(() => {
    /**
     * 进入即记（**每次进入都记一条**，用于统计到达率——PASS-3 明确了这个口径）。
     *
     * 2026-09-23 修（ST4 的 FAIL-2）：
     *  ① 原实现在**渲染期**写遥测（渲染期的副作用），这正是 StrictMode 要暴露的反模式；
     *  ② 原守卫用 `useState`，双重渲染下失效 → 一次进入记 2 条，分母翻倍。
     * 改为 `useEffect` + `useRef` 守卫：React 18 的 StrictMode 是
     * 「跑 effect → 清理 → 再跑 effect」，**ref 在同一次挂载内保留**，
     * 所以第二次不会重复记；而真正重新进入是新挂载、新 ref，照记一条——
     * 恰好同时满足「进入即记」与「不重复」。
     */
    if (lock.state === "locked") return;
    if (startedLoggedRef.current) return;
    startedLoggedRef.current = true;
    const hours = stage1DoneAt ? Math.max(0, (Date.now() - Date.parse(stage1DoneAt)) / 3600000) : 0;
    appendGrammarEvent({ kind: "grammar_revisit_started", lessonId, hoursSinceStage1: Math.round(hours * 10) / 10, ts: nowIso() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, lock.state]);

  if (lock.state === "locked") {
    const unlockText = lock.unlockAt ? new Date(lock.unlockAt).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "numeric", minute: "2-digit" }) : "明天";
    return (
      <div className="page lesson-page">
        <PageHeader eyebrow="语法 · 案件回访" title={`第 ${lesson.number} 课 · 次日回访`} />
        <EmptyState
          title="回访关还没解锁"
          description={lock.unlockAt ? `在快忘记的时候回来破案，记得最牢。本关将于 ${unlockText} 解锁。` : "先完成本课正课，明天回来回访。"}
        />
        <div className="lesson-stage-actions">
          <Link to={`/grammar/lesson/${lesson.id}`} className="primary-button"><Clock size={15} /> 回到正课</Link>
          <Link to="/grammar" className="secondary-button">返回课程地图</Link>
        </div>
      </div>
    );
  }

  /**
   * 答对也讲「为什么」：回访是提取练习，提取成功后的解释把「碰对了」固化成「知道为什么」。
   * 讲解来自本课素材的句子级匹配（contrast/variants/sceneSwings），不含新结论。
   *
   * ⚠️ 必须写在任何提前 return 之前（2026-09-20 修）：此前它位于下方「回访完成」的
   * 提前 return 之后，完关瞬间 phase 变为 "done" 触发重渲染时，该次渲染命中早退分支
   * → 少调用一个 hook → React 抛「Rendered fewer hooks than expected」并整树卸载（白屏）。
   */
  const revisitWhy = useMemo(
    () => (quiz[index] && lesson ? explainForSentence(lesson, quiz[index].answer) : ""),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quiz[index]?.answer, lessonId]
  );

  /**
   * 完成页显示的「N / M 题一次提取成功」。
   *
   * 2026-09-23 修（ST4 的 FAIL-1）：本页的 `firstTryCount` 是**本次会话的 state**，
   * 重进（已完成关 2）时它被重置为 0，于是完成页把「0 / 4 题一次提取成功」
   * 回显给用户——而上一轮的真实成绩是 4/4，遥测里也明明记着 4。
   * 已完结的课要回显**历史事实**，故这里优先读最近一条 `grammar_revisit_completed`；
   * 只有本次会话刚做完（还没落库）时才用 state。
   */
  const completedEvents = listGrammarEventsByKind("grammar_revisit_completed").filter(
    (event) => event.lessonId === lessonId
  );
  // 不用 Array.at(-1)：本项目的 TS lib 目标低于 es2022（见 tsconfig 的 target）
  const lastCompleted = completedEvents[completedEvents.length - 1];
  const displayedFirstTry =
    phase === "done" || firstTryCount > 0 ? firstTryCount : (lastCompleted?.firstTryCount ?? 0);

  if (isLessonStageDone(data, lessonId, 2) || phase === "done") {
    return (
      <div className="page lesson-page">
        <PageHeader eyebrow="语法 · 案件回访" title={`第 ${lesson.number} 课 · 回访完成`} />
        <section className="lesson-stage" aria-label="回访完成">
          <div className="lesson-complete">
            <CheckCircle2 size={28} />
            <h2>回访完成</h2>
            <p className="lesson-summary-rule">
              在快忘记的时候回来提取了一次——这一课的记忆刚被加固了一遍。{displayedFirstTry} / {quiz.length} 题一次提取成功。
            </p>
            <div className="lesson-stage-actions">
              <Link to={`/grammar/lesson/${lesson.id}/reaudit`} className="primary-button">
                下一关：旧案重审
              </Link>
              <Link to="/grammar" className="secondary-button">返回课程地图</Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const currentQuiz: RevisitQuestion | undefined = quiz[index];

  /** 本页用户产出的那句：cloze 是输入框原文，rebuild 是已拼的词块序列。 */
  const revisitWrongSentence = (() => {
    if (!currentQuiz) return "";
    if (currentQuiz.kind === "cloze") return clozeValue.trim();
    return rebuildPicked.join(" ").trim();
  })();

  /**
   * 完成制：题做完即完成关 2。埋点记一次提取成功数与回马枪结果。
   *
   * ⚠️ 2026-09-23 修（MG3b/st4 的 FAIL-3/3b）：`ambushFirstTry` 必须由调用方**显式传入**，
   * 不能读 state。
   *
   * 原实现是 `ambush ? ambushAttempts <= 1 && ambushDone : null`。
   * 回马枪答对时调用顺序是 `setAmbushDone(true)` → `finishRevisit()`——
   * 而 state 更新是异步的，`finishRevisit` 的闭包里 `ambushDone` 仍是 `false`，
   * 于是**一次命中的回马枪永远记成 `ambushFirstTry: false`**，
   * 与同路径的 `grammar_ambush_result`（`attempts=1, passed=true`）自相矛盾。
   *
   * 现在由 `pickAmbushToken` 把实际结果传进来（它手里就有判定结果），
   * 不依赖任何尚未提交的 state。
   */
  const finishRevisit = (ambushFirstTry?: boolean) => {
    appendGrammarEvent({
      kind: "grammar_revisit_completed",
      lessonId,
      firstTryCount,
      totalCount: quiz.length,
      // 无回马枪时为 null；有则由调用方给出本次是否一次命中
      ambushFirstTry: ambush ? Boolean(ambushFirstTry) : null,
      durationMs: Date.now() - startedAt,
      ts: nowIso()
    });
    updateData((latest) => markLessonStageDone(latest, lessonId, 2));
    setPhase("done");
  };

  const advanceQuiz = () => {
    if (index + 1 >= quiz.length) {
      // 回访题做完 → 有回马枪进回马枪，否则直接完关
      if (ambush) setPhase("ambush");
      else finishRevisit();
      return;
    }
    setIndex((i) => i + 1);
    setClozeValue("");
    setRebuildPicked([]);
    setFeedback("idle");
    setAttemptsThisQ(0);
  };

  const submitCloze = () => {
    if (!currentQuiz || currentQuiz.kind !== "cloze" || !clozeValue.trim()) return;
    const attempts = attemptsThisQ + 1;
    setAttemptsThisQ(attempts);
    /**
     * 2026-09-24 修：改用 `spellingMatches`（diffService 的**词级判分权威实现**）。
     *
     * 原实现是裸 `clozeValue.trim().toLowerCase() === 答案.toLowerCase()`——
     * **没有全角折叠**，于是中文输入法打出的全角字母（`ｐｉｃｔｕｒｅ`）
     * 或弯撇号（`don’t`）一律判错（实测确认）。
     *
     * 更说明问题的是**同一页面口径不一致**：本页的 rebuild 题走
     * `checkLessonTokens`（含全角折叠），cloze 题却用裸比较——
     * 用户在两种题型间来回时，同一个词一个判对一个判错。
     */
    const passed = spellingMatches(currentQuiz.clozeAnswer ?? "", clozeValue);
    if (passed && attempts === 1) setFirstTryCount((c) => c + 1);
    setFeedback(passed ? "pass" : "retry");
  };

  const pickRebuildToken = (token: string) => {
    if (!currentQuiz || currentQuiz.kind !== "rebuild" || feedback === "pass") return;
    const next = [...rebuildPicked, token];
    setRebuildPicked(next);
    const tokens = currentQuiz.rebuildTokens ?? [];
    if (next.length === tokens.length) {
      const attempts = attemptsThisQ + 1;
      setAttemptsThisQ(attempts);
      const passed = checkLessonTokens(next, currentQuiz.answer);
      if (passed && attempts === 1) setFirstTryCount((c) => c + 1);
      setFeedback(passed ? "pass" : "retry");
    }
  };

  const pickAmbushToken = (tokenIndex: number) => {
    if (!ambush || ambushDone) return;
    const attempts = ambushAttempts + 1;
    setAmbushAttempts(attempts);
    const passed = judgeAmbushPick(ambush, tokenIndex);
    appendGrammarEvent({
      kind: "grammar_ambush_result",
      hostId: `${lessonId}#2`,
      sourceLessonId: ambush.sourceLessonId ?? "",
      weakSpotTag: ambush.weakSpotTag,
      caseId: ambush.caseItem.id,
      passed,
      attempts,
      ts: nowIso()
    });
    if (passed) {
      setAmbushDone(true);
      /**
       * 回马枪答对即完关。`firstTry` 以**本次**的 attempts 判定：
       * 一次就命中 = 首次尝试即通过（attempts === 1）。
       * 显式传值，避免读到尚未提交的 `ambushDone`（见 finishRevisit 的注释）。
       */
      finishRevisit(attempts <= 1);
    }
  };

  // ── 回马枪阶段 ──
  if (phase === "ambush" && ambush) {
    return (
      <div className="page lesson-page">
        <PageHeader eyebrow="语法 · 案件回访" title={`第 ${lesson.number} 课 · 回马一枪`} description={ambush.promptZh} />
        <section className="lesson-stage" aria-label="回马一枪">
          <div className="lesson-quiz-card">
            <div className="lesson-quiz-head">
              <span className="lesson-quiz-step">回马一枪</span>
              <span className="lesson-quiz-note">{ambush.weakSpotTag ? "这是你的薄弱点" : "前几课的旧知识"}</span>
            </div>
            <div className="lesson-contrast-block">
              <p className="lesson-section-label">{ambush.caseItem.title}</p>
              <div className="lesson-spot-row">
                {ambush.caseItem.tokens.map((token, ti) => (
                  <button type="button" className="lesson-chip" key={ti} onClick={() => pickAmbushToken(ti)} disabled={ambushDone}>
                    {token}
                  </button>
                ))}
              </div>
              {ambushAttempts > 0 && !ambushDone && (
                <p className="lesson-spot-hint">这个词块看起来没问题，再找找别的。</p>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── 回访 quiz 阶段 ──
  return (
    <div className="page lesson-page">
      <PageHeader
        eyebrow="语法 · 案件回访"
        title={`第 ${lesson.number} 课 · ${lesson.title}`}
        description="在快忘记的时候回来提取一次——没有讲解，全凭记忆，错了也没关系。"
      />
      <section className="lesson-stage" aria-label="次日回访">
        <div className="lesson-quiz-card">
          <div className="lesson-quiz-head">
            <span className="lesson-quiz-step">第 {index + 1} / {quiz.length} 题</span>
            <span className="lesson-quiz-note">{currentQuiz?.kind === "cloze" ? "凭记忆补全这句话" : "凭记忆重建这句话"}</span>
          </div>
          <p className="lesson-quiz-prompt">这句要说的是：<strong>{currentQuiz?.intentZh}</strong></p>

          {currentQuiz?.kind === "cloze" ? (
            <div className="lesson-choose" style={{ display: "grid", gap: 20 }}>
              <p className="lesson-choose-sentence">{currentQuiz.clozeText}</p>
              <div className="answer-box">
                <input
                  className="large-textarea"
                  value={clozeValue}
                  onChange={(e) => setClozeValue(e.target.value)}
                  onKeyDown={(e) => {
                    /**
                     * 组词态与 Shift+Enter 的守卫（2026-09-21 修，P1）。
                     *
                     * 此前只判断 `key === "Enter"`，与课内输入框口径不一致：
                     * 中文输入法组词结束的回车会给 `key=Enter + isComposing=true`，
                     * 于是**把没写完的答案直接交上去判 retry**；
                     * Shift+Enter 也被当成提交（用户没有换行的余地）。
                     * 课内（GrammarLessonPage）与复习页都有这两行守卫，这里漏了。
                     */
                    /**
                     * 2026-09-24：统一改用 `isSubmitKey`——内联版漏了组词态的
                     * `keyCode === 229` 信号（部分输入法只给这个、不上报 isComposing）。
                     */
                    if (isSubmitKey(e) && clozeValue.trim()) {
                      submitCloze();
                    }
                  }}
                  placeholder="填出空缺的词（回车提交）"
                  aria-label="填空答案"
                />
              </div>
              <div className="lesson-stage-actions center">
                <button type="button" className="primary-button" onClick={submitCloze} disabled={!clozeValue.trim() || feedback === "pass"}>提交</button>
              </div>
            </div>
          ) : (
            <div className="lesson-arrange">
              <div className="lesson-build-area lit" aria-label="重建句子">
                {rebuildPicked.map((token, i) => (
                  <span className="lesson-chip static" key={`${token}-${i}`}>{token}</span>
                ))}
              </div>
              <div className="lesson-spot-row">
                {(currentQuiz?.rebuildTokens ?? []).map((token, i) => {
                  const usedCount = rebuildPicked.filter((t) => t === token).length;
                  const totalCount = (currentQuiz?.rebuildTokens ?? []).filter((t) => t === token).length;
                  const disabled = usedCount >= totalCount || feedback === "pass";
                  return (
                    <button type="button" className="lesson-chip" key={`${token}-${i}`} onClick={() => pickRebuildToken(token)} disabled={disabled}>
                      {token}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {feedback === "pass" && (
            <div className="lesson-feedback pass" aria-live="polite">
              <p><CheckCircle2 size={16} /> 提取成功！<strong>{currentQuiz?.answer}</strong></p>
              {currentQuiz && revisitWhy && (
                <p className="lesson-why-line">
                  <Lightbulb size={13} aria-hidden="true" /> {revisitWhy}
                </p>
              )}
              <button type="button" className="primary-button" onClick={advanceQuiz}>
                {index + 1 >= quiz.length ? (ambush ? "最后一题：回马一枪" : "完成回访") : "下一题"}
              </button>
            </div>
          )}
          {feedback === "retry" && (
            <div className="lesson-feedback retry" aria-live="polite">
              <p>想不起来了，再试一次——忘了很正常，这正是要回访的原因。</p>
              <button type="button" className="ghost-link" onClick={() => { setRebuildPicked([]); setClozeValue(""); setFeedback("idle"); }}>重来这题</button>
              {/**
                * 答错态下恒给追问入口（判据是**当前反馈态**，不是累计错次——
                * 那是课程页上一轮修过的坑：用累计态会让入口时有时无）。
                */}
              {!whyWrong.open && revisitWrongSentence && (
                <div className="lesson-stage-actions center">
                  <button
                    type="button"
                    className="lesson-whywrong-entry"
                    onClick={() =>
                      whyWrong.ask(index, revisitWrongSentence, {
                        correctSentence: currentQuiz?.answer ?? "",
                        promptZh: lesson?.title,
                        section: "recall",
                        anchorPrefix: "revisit.step",
                        anchorText: lesson?.oneLineRule
                      })
                    }
                  >
                    <Lightbulb size={13} aria-hidden="true" /> 为什么我写的不对？
                  </button>
                </div>
              )}
              {whyWrong.open && whyWrong.stepKey === index && (
                <WhyWrongPanel
                  {...whyWrong.panelProps}
                  mineLabel={currentQuiz?.kind === "cloze" ? "你写的" : "你拼的"}
                />
              )}
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
