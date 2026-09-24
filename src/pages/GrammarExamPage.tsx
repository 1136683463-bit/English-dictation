import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Lightbulb } from "lucide-react";
import { useAppData } from "../AppContext";
import PageHeader from "../components/PageHeader";
import EmphasisText from "../components/EmphasisText";
import { grammarLessons } from "../data/grammarLessons";
import { LESSON_GROUPS } from "../data/grammarSeasons";
import { getLessonStagesDone } from "../services/lessonService";
import { buildExamPaper } from "../services/grammarExamPaperService";
import {
  examDiagnosis,
  getExamSession,
  itemsOfSection,
  recordExamDispute,
  recordExamItem,
  recordExamWriting,
  revealExamSection,
  startExamSession,
  submitExamSession
} from "../services/grammarExamSessionService";
import { judgeExamChoice, judgeExamCloze, judgeExamZh2En } from "../services/grammarExamService";
import { requestExamWritingCorrection } from "../services/grammarExamAiService";
import { appendGrammarEvent } from "../services/grammarTelemetry";
import { nowIso } from "../services/storage";
import type { ExamPaperItem } from "../services/grammarExamPaperService";

/**
 * 语法季末综合卷（P0-3 三节作答 + 中断续做 ｜ P0-4 诊断结果）
 *
 * 规格：`deliverables/product-strategy/prd-grammar-season-final-exam-2026-09-24.md`
 *   §4.7 中断续做 ｜ §4.8 结果页 ｜ §4.9 解锁 ｜ §4.10 不变量 ｜ §12 验收
 *
 * 纪律（全部可机检，见 `src/edge/verify/ex6-exam-page.test.tsx`）：
 * - **不出现倒计时/剩余时间**（G4）。只标注「本节约 X 分钟」「预计约 30 分钟」。
 *   限时是与 Affective Filter 冲突的红线，不是「没做」而是「不许做」。
 * - **不出现「正确/错误/得分/分数/通过」**（G5）。单题只有「稳住 / 还漏」两态。
 * - **不出总分**（默认处置，PRD Q1）：结果是「稳住了哪几件事 / 哪几处还漏」的清单。
 * - 每题都能回溯到课（G6）。
 * - AI 不参与客观题判分、不给分数（G7/G8）；写作只做批改与讲解。
 * - 全程只写 `examSessions` / `examDisputes`，不碰掌握度、弱点、进度、复习调度（§4.10 不变量 7）。
 */

type Phase = "intro" | "answer" | "reveal" | "result";

const VARIANT_COUNT = 5;

export default function GrammarExamPage() {
  const { seasonId = "" } = useParams();
  const { data, updateData } = useAppData();

  const season = LESSON_GROUPS.find((group) => group.id === seasonId);
  // 变体由已完成次数决定：第一次考用第 1 套，重考换下一套（Q7 默认换卷）
  const completedCount = useMemo(() => {
    const sessions = Object.values(data.examSessions ?? {});
    return sessions.filter((session) => session.seasonId === seasonId && session.submittedAt).length;
  }, [data.examSessions, seasonId]);

  /**
   * 变体号**在挂载时冻结一次**，之后不再随 `completedCount` 变化。
   *
   * 为什么必须冻结（整卷走查抓出的真 bug）：交卷会写 `submittedAt`，`completedCount` 随即 +1，
   * 若变体号跟着变，`paper` 会被重建成**另一张卷**（paperId 从 season-1-v1 变成 season-1-v2），
   * 于是诊断屏去读 `examSessions[season-1-v2]` —— 那还是空的，
   * 表现为「全对走完却说稳住了 0 件事」。冻结后纸面在整个页面会话内不变；
   * 关闭重进时按已交卷数重算，重考自然换到下一套（Q7）。
   *
   * 优先沿用「已存在但未交卷」的那套：中断过的会话必须回到同一张卷，
   * 否则续做会落到另一套题上（与 §4.7 中断续做冲突）。
   */
  const [variantIndex] = useState(() => {
    const resumed = Object.values(data.examSessions ?? {}).find(
      (session) => session.seasonId === seasonId && !session.submittedAt
    );
    return resumed ? resumed.variantIndex : completedCount % VARIANT_COUNT;
  });

  const paper = useMemo(
    () => buildExamPaper({ seasonId, variantIndex, variantCount: VARIANT_COUNT }),
    [seasonId, variantIndex]
  );

  const [phase, setPhase] = useState<Phase>("intro");
  const [draft, setDraft] = useState("");
  const [disputeFor, setDisputeFor] = useState<string | null>(null);
  const [disputeClaim, setDisputeClaim] = useState("");
  const [startedAt] = useState(() => Date.now());
  /** 写作 AI 批改的状态：idle / loading / done / degraded（降级时不伪造评语，G-A3）。 */
  const [aiState, setAiState] = useState<"idle" | "loading" | "done" | "degraded">("idle");

  const session = getExamSession(data, paper.paperId);
  const seasonLessons = useMemo(
    () => grammarLessons.filter((lesson) => lesson.number >= (season?.min ?? 0) && lesson.number <= (season?.max ?? 0)),
    [season]
  );
  const remainingLessons = seasonLessons.filter((lesson) => !getLessonStagesDone(data, lesson.id).has(1));

  // ── 守卫态①：本季还有课没学完（§4.9，无配额/次数/分数门禁字样） ──
  if (!season) {
    return (
      <Shell title="季末收束">
        <p className="lesson-why-line">这一季还没有卷子。</p>
        <Link to="/grammar">回到语法地图</Link>
      </Shell>
    );
  }
  if (remainingLessons.length > 0) {
    return (
      <Shell title={`${season.label} · 季末收束`}>
        <p data-testid="exam-locked">
          这一季还有 {remainingLessons.length} 课没开始。学完再回来——那时这套卷子才是为你会的东西出的。
        </p>
        <p>
          <Link to={`/grammar/lesson/${remainingLessons[0].id}`}>去第 {remainingLessons[0].number} 课</Link>
        </p>
      </Shell>
    );
  }
  // ── 守卫态②：卷面自身有问题就不发卷（宁可不发，不发了坏的） ──
  if (paper.diagnostics.length > 0) {
    return (
      <Shell title={`${season.label} · 季末收束`}>
        <p data-testid="exam-unavailable">这一季的卷子还在准备。</p>
      </Shell>
    );
  }

  const sectionItems = phase === "answer" ? itemsOfSection(paper, session?.cursor.section ?? 1) : [];
  const currentIndex = session?.cursor.index ?? 0;
  const currentItem: ExamPaperItem | undefined = sectionItems[currentIndex];

  const beginOrResume = () => {
    if (!session) {
      updateData((latest) => startExamSession(latest, paper));
      appendGrammarEvent({
        kind: "exam_started",
        paperId: paper.paperId,
        seasonId: paper.seasonId,
        itemCount: paper.items.length,
        ts: nowIso()
      });
      appendGrammarEvent({
        kind: "exam_paper_generated",
        paperId: paper.paperId,
        seasonId: paper.seasonId,
        itemCount: paper.items.length,
        shape: paper.shape,
        sourceItemIds: paper.items.map((item) => item.id),
        diagnostics: paper.diagnostics,
        variantIndex: paper.variantIndex,
        ts: nowIso()
      });
    }
    setDraft("");
    setPhase("answer");
  };

  const submitAnswer = () => {
    if (!currentItem || !session) return;
    /**
     * 选择题/填空/阅读都是「点选项」，所以 `draft` 存的是**选项 id**。
     * 判分前必须换成选项**文本**：填空题的判分器比的是词本身
     * （`judgeExamCloze` → `spellingMatches`），拿 `o0` 去比必然判错——
     * 这个 bug 让整卷所有填空题都判「还漏」，是整卷走查才抓出来的
     * （之前的用例只测到「揭晓屏出现」，没测「判得对不对」）。
     */
    const pickedText =
      currentItem.options?.find((option) => option.id === draft)?.en ?? draft;
    const judged =
      currentItem.kind === "mcq" || currentItem.kind === "read"
        ? judgeExamChoice(draft, currentItem.answerId ?? "")
        : currentItem.kind === "cloze"
          ? judgeExamCloze(pickedText, currentItem.answer)
          : judgeExamZh2En(pickedText, currentItem.answer, currentItem.acceptAlso ?? []);
    updateData((latest) =>
      recordExamItem(latest, paper, currentItem, {
        answer: pickedText,
        passed: judged.passed,
        score: judged.score,
        durationMs: Date.now() - startedAt
      })
    );
    appendGrammarEvent({
      kind: "exam_item_result",
      paperId: paper.paperId,
      itemId: currentItem.id,
      section: currentItem.section,
      kind2: currentItem.kind,
      passed: judged.passed,
      score: judged.score,
      durationMs: Date.now() - startedAt,
      ts: nowIso()
    });
    setDraft("");
    // 本节的最后一题答完 → 进揭晓
    const answeredNow = new Set([...(session.results.map((r) => r.itemId) ?? []), currentItem.id]);
    const sectionDone = itemsOfSection(paper, currentItem.section).every((item) => answeredNow.has(item.id));
    if (sectionDone) {
      updateData((latest) => revealExamSection(latest, paper.paperId, currentItem.section));
      const passedCount = (session.results ?? []).filter((r) => r.passed).length;
      appendGrammarEvent({
        kind: "exam_section_reveal",
        paperId: paper.paperId,
        section: currentItem.section,
        stabilizedCount: passedCount,
        missingCount: (session.results?.length ?? 0) - passedCount,
        ts: nowIso()
      });
      setPhase("reveal");
    }
  };

  /** 提交写作：先把原文落盘（AI 拿不到文本就什么都批不了），再异步请 AI 批改。 */
  const finishWriting = async () => {
    if (!session) return;
    const text = draft;
    updateData((latest) => recordExamWriting(latest, paper.paperId, { text }));
    // **必须同时揭晓第 3 节**：揭晓屏靠 `revealedSections` 里的最大值判断「这是第几节的揭晓」，
    // 少了这一步就会把第 3 节当成第 2 节，点「看这一季的收束」反而退回作答屏。
    updateData((latest) => revealExamSection(latest, paper.paperId, 3));
    // 第 3 节同样要埋一条揭晓（前两节在 submitAnswer 里发）。写作不进判分，故计数为 0。
    appendGrammarEvent({
      kind: "exam_section_reveal",
      paperId: paper.paperId,
      section: 3,
      stabilizedCount: 0,
      missingCount: 0,
      ts: nowIso()
    });
    setDraft("");
    setPhase("reveal");
    await runWritingCorrection(text);
  };

  /**
   * 请 AI 批改写作（P0-7）。
   *
   * 三条纪律：① 不阻塞揭晓——批改在后台跑，用户先看到「这一段写完了」；
   * ② 降级不伪造（G-A3）：`ok:false` 时只显示「这次没能给出批改」+ 保留原文 + 重试入口；
   * ③ 不出分（G8）：批改结果里没有分数，服务层连「模型回了分数」都拦掉了。
   */
  const runWritingCorrection = async (text: string) => {
    if (!text.trim()) return;
    setAiState("loading");
    const outcome = await requestExamWritingCorrection(data.settings.aiProvider, {
      paperId: paper.paperId,
      promptZh: paper.items.find((item) => item.kind === "write")?.promptZh ?? "",
      points: [],
      text
    });
    appendGrammarEvent({
      kind: "exam_graded",
      paperId: paper.paperId,
      writingIssuesCount: outcome.correction?.issues.length ?? 0,
      byAI: outcome.ok,
      degraded: outcome.degraded,
      degradeReason: outcome.degradeReason,
      latencyMs: outcome.latencyMs,
      cached: outcome.cached,
      ts: nowIso()
    });
    if (outcome.ok && outcome.correction) {
      updateData((latest) =>
        recordExamWriting(latest, paper.paperId, { text, ...outcome.correction })
      );
      setAiState("done");
      return;
    }
    // 降级：只保留原文，不产出任何伪造评语
    updateData((latest) =>
      recordExamWriting(latest, paper.paperId, {
        text,
        degraded: true,
        degradeReason: outcome.degradeReason ?? "error"
      })
    );
    setAiState("degraded");
  };

  const revealNext = (answeredSection: 1 | 2 | 3) => {
    if (answeredSection === 3) {
      updateData((latest) => submitExamSession(latest, paper.paperId));
      appendGrammarEvent({
        kind: "exam_submitted",
        paperId: paper.paperId,
        totalMs: Date.now() - startedAt,
        answered: session?.results.length ?? 0,
        blank: 0,
        ts: nowIso()
      });
      setPhase("result");
      return;
    }
    setPhase("answer");
  };

  // ── 卷首 ──
  if (phase === "intro") {
    const resumed = Boolean(session && session.results.length > 0 && !session.submittedAt);
    return (
      <Shell title={`${season.label} · 季末收束`}>
        <p data-testid="exam-intro">
          这一季 {seasonLessons.length} 课学完了。这套卷子只考这一季的东西——{paper.items.length} 道题，分三节，
          预计约 {paper.estimateMinutes} 分钟。
        </p>
        <p>随时可以退出，下次接着答。</p>
        <ul>
          {paper.sections.map((section) => (
            <li key={section.index}>
              {section.titleZh}：{section.itemIds.length} 道题，本节约 {section.estimateMinutes} 分钟
            </li>
          ))}
        </ul>
        <button type="button" className="primary-button"
                data-testid="exam-begin" onClick={beginOrResume}>
          {resumed ? "继续上次" : "开始"}
        </button>
      </Shell>
    );
  }

  // ── 作答（选择/填空/翻译/阅读） ──
  // 必须把写作题排除出去：写作没有 options，若不排除会落进本分支，
  // 被 zh2en 判分器判一次、且原文进不了 `session.writing`（AI 批改拿不到文本）。
  if (phase === "answer" && currentItem && currentItem.kind !== "write") {
    const section = currentItem.section;
    const total = itemsOfSection(paper, section).length;
    const done = itemsOfSection(paper, section).filter((item) =>
      session?.results.some((result) => result.itemId === item.id)
    ).length;
    return (
      <Shell title={`${season.label} · ${paper.sections.find((s) => s.index === section)?.titleZh ?? ""}`}>
        <p data-testid="exam-progress">
          第 {done + 1} / {total} 题
        </p>
        <p data-testid="exam-prompt">
          <EmphasisText text={currentItem.promptZh} />
        </p>
        {currentItem.options && currentItem.options.length > 0 ? (
          <div data-testid="exam-options">
            {currentItem.options.map((option) => (
              <button
                key={option.id}
                type="button"
                className="secondary-button"
                data-testid={`exam-option-${option.id}`}
                aria-pressed={draft === option.id}
                onClick={() => setDraft(option.id)}
              >
                {option.en}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            data-testid="exam-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="写下你的答案"
          />
        )}
        <div>
          <button type="button" className="primary-button"
                data-testid="exam-next" onClick={submitAnswer} disabled={!draft.trim()}>
            下一题
          </button>
        </div>
      </Shell>
    );
  }

  // ── 写作（节 3） ──
  // 写作**不判分**（PRD §4.6：AI 只批改与讲解、不出分），因此不走 submitAnswer，
  // 只把原文写进 `session.writing` 供 AI 批改。
  if (phase === "answer" && currentItem?.kind === "write") {
    const writingItem = currentItem;
    return (
      <Shell title={`${season.label} · ${paper.sections[2].titleZh}`}>
        <p data-testid="exam-writing-prompt">
          <EmphasisText text={writingItem?.promptZh ?? ""} />
        </p>
        <textarea
          data-testid="exam-writing-input"
          value={draft || session?.writing?.text || ""}
          onChange={(event) => setDraft(event.target.value)}
          aria-label="写下你的三到五句话"
        />
        <button type="button" className="primary-button"
                data-testid="exam-writing-submit" onClick={finishWriting} disabled={!draft.trim()}>
          写完
        </button>
      </Shell>
    );
  }

  // ── 逐节揭晓 ──
  if (phase === "reveal") {
    const lastRevealed = Math.max(...(session?.revealedSections ?? [1])) as 1 | 2 | 3;
    const sectionResult = (session?.results ?? []).filter((result) => result.section === lastRevealed);
    const stabilized = sectionResult.filter((result) => result.passed).length;
    const missing = sectionResult.length - stabilized;
    return (
      <Shell title={`${season.label} · 第 ${lastRevealed} 节`}>
        <p data-testid="exam-section-reveal">
          {lastRevealed === 3
            ? "最后这一段写完了。"
            : `这一节稳住了 ${stabilized} 处，还有 ${missing} 处要再看一眼。`}
        </p>
        <button type="button" className="primary-button"
                data-testid="exam-reveal-next" onClick={() => revealNext(lastRevealed)}>
          {lastRevealed === 3 ? "看这一季的收束" : "下一节"}
        </button>
      </Shell>
    );
  }

  // ── 结果：诊断清单（不出总分） ──
  const diagnosis = examDiagnosis(paper, session);
  return (
    <Shell title={`${season.label} · 这一季的收束`}>
      <p data-testid="exam-summary">{season.hint}</p>
      <p data-testid="exam-stabilized">这一季你稳住了 {diagnosis.stabilizedCount} 件事。</p>
      {diagnosis.missingCount > 0 ? (
        <>
          <p data-testid="exam-missing">还有 {diagnosis.missingCount} 处要再看一眼：</p>
          <ul data-testid="exam-missing-list">
            {diagnosis.missingItems.map((entry) => {
              const lesson = grammarLessons.find((item) => item.id === entry.sourceLessonId);
              return (
                <li key={entry.itemId}>
                  <span>{entry.promptZh}</span>
                  <span> —— 可以这样说：{entry.answer}</span>
                  {lesson ? (
                    <Link to={`/grammar/lesson/${lesson.id}`}>出自第 {lesson.number} 课</Link>
                  ) : null}
                  <button
                    type="button"
                    data-testid={`exam-dispute-${entry.itemId}`}
                    onClick={() => {
                      setDisputeFor(entry.itemId);
                      setDisputeClaim("");
                    }}
                  >
                    我觉得这句没错
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p data-testid="exam-all-stable">这一季的考点你都稳住了。</p>
      )}
      {diagnosis.missingCount > 0 ? (
        <p className="lesson-why-line">
          {/*
            ⚠️ 文案纪律：这里**不许**写「已经排进复习队列 / 明天会再见到」——
            错题回流 SM-2 是 P1-2，本批（M2）边界明确写了不做（PRD §13）。
            文案不许承诺尚未实现的行为：用户按承诺去复习页找不到这几句，信任就没了。
            P1-2 落地后，再把「会回来」这句加回来，并同步 ex2 的守门。
          */}
          <Lightbulb size={13} /> 先回课里看一眼最省事——点上面每条的「出自第 N 课」就能跳过去。
        </p>
      ) : null}

      {disputeFor ? (
        <div data-testid="exam-dispute-box">
          <textarea
            data-testid="exam-dispute-input"
            value={disputeClaim}
            onChange={(event) => setDisputeClaim(event.target.value)}
            aria-label="说说你觉得哪里没问题"
          />
          <button
            type="button"
            className="secondary-button"
                data-testid="exam-dispute-send"
            onClick={() => {
              updateData((latest) =>
                recordExamDispute(latest, {
                  paperId: paper.paperId,
                  itemId: disputeFor,
                  claim: disputeClaim
                })
              );
              appendGrammarEvent({
                kind: "exam_dispute",
                paperId: paper.paperId,
                itemId: disputeFor,
                claimLength: disputeClaim.length,
                ts: nowIso()
              });
              setDisputeFor(null);
            }}
          >
            记下来
          </button>
        </div>
      ) : null}

      {/* 写作批改：只给「可以这样说 / 可以改的地方 / 一句人话」，**不给分数**（G8）。
          降级时不伪造评语，只保留原文 + 重试入口（G-A3）。 */}
      {session?.writing?.text ? (
        <section data-testid="exam-writing-result">
          <p data-testid="exam-writing-mine">你写的：{session.writing.text}</p>
          {aiState === "loading" ? <p data-testid="exam-writing-loading">正在看你的这一段……</p> : null}
          {session.writing.corrected ? (
            <p data-testid="exam-writing-corrected">可以这样说：{session.writing.corrected}</p>
          ) : null}
          {session.writing.recast ? (
            <p data-testid="exam-writing-recast">更自然一点：{session.writing.recast}</p>
          ) : null}
          {session.writing.issues && session.writing.issues.length > 0 ? (
            <ul data-testid="exam-writing-issues">
              {session.writing.issues.map((issue, index) => (
                <li key={`${issue.original}-${index}`}>
                  {issue.original} → {issue.correction}：{issue.explanation}
                </li>
              ))}
            </ul>
          ) : null}
          {session.writing.comment ? <p data-testid="exam-writing-comment">{session.writing.comment}</p> : null}
          {session.writing.degraded ? (
            <>
              <p data-testid="exam-writing-degraded">这次没能给出批改。</p>
              <button
                type="button"
                className="secondary-button"
                data-testid="exam-writing-retry"
                onClick={() => void runWritingCorrection(session.writing?.text ?? "")}
              >
                再试一次
              </button>
            </>
          ) : null}
        </section>
      ) : null}

      <p>
        <Link to="/grammar">回到语法地图</Link>
      </p>
    </Shell>
  );
}

/** 页面外壳：统一标题 + 移动端友好的单列结构。 */
const Shell = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="page">
    <PageHeader title={title} />
    <main>{children}</main>
  </div>
);
