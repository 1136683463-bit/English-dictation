import { CheckCircle2, Lightbulb, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { getGrammarLesson, normalizeLessonSentence } from "../services/lessonService";
import { computeWeakSpotsReport } from "../services/grammarWeakSpotsService";
import { buildReplayLesson, resolveReplayRound, REPLAY_MIN_ITEMS } from "../services/grammarReplayService";
import { appendGrammarEvent, listGrammarEventsByKind } from "../services/grammarTelemetry";
import { GRAMMAR_ERROR_TAG_LABELS } from "../services/huntService";
import { nowIso } from "../services/storage";
import { buildGrammarReviewSession, GRAMMAR_REVIEW_SESSION_LIMIT } from "../services/grammarReviewService";

/**
 * C4（M3，2026-09-21）「你的三句话」复盘课。
 *
 * 竞析建议（对齐 Speak Premium Plus 的「由你的错误构建的定制复习」〔已核实〕）：
 * 把弱点档案的输出**变成一门真课**——从 Top3 弱点自动拼 3–5 题，几分钟走完。
 *
 * 纪律：
 * - 素材 100% 可溯源（每题显示「出自第 N 课」），不生成新结论
 * - 判题用确定性词块校验（点出那个错词），AI 不参与判分
 * - 不写盘、不进 SM-2（即时提取练习，不是新知识点）
 * - 完成即记一次 grammar_replay_completed（供后续读数）
 */
export default function GrammarReplayPage() {
  const { data } = useAppData();

  // 弱点榜 → 复盘课（进页一次性拼好，稳定不跳变）
  const lesson = useMemo(() => {
    const { active } = computeWeakSpotsReport(data);
    const tags = active.map((spot) => spot.tag);
    // 换一批：同一组弱点练过 N 次 → 用第 N+1 轮素材（同轮内进出保持同一套题）
    const completed = listGrammarEventsByKind("grammar_replay_completed");
    const round = resolveReplayRound(tags, completed);
    return buildReplayLesson(tags, round);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [index, setIndex] = useState(0);
  const [pickedToken, setPickedToken] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<"idle" | "pass" | "retry">("idle");
  const [firstTryCount, setFirstTryCount] = useState(0);
  // C4 闭环：按罪名拆分表现（供弱点档案消费——练得顺则该弱点权重减轻）
  const [perTag, setPerTag] = useState<Record<string, { total: number; firstTry: number }>>({});
  // 到期卡数量：决定「去复习」是否出现（避免空页面）
  const dueReviewCount = useMemo(
    () => buildGrammarReviewSession(data, GRAMMAR_REVIEW_SESSION_LIMIT).length,
    [data]
  );
  const [attempts, setAttempts] = useState(0);
  const [done, setDone] = useState(false);
  const [startedAt] = useState(() => Date.now());

  const current = lesson.items[index];

  if (lesson.isEmpty) {
    return (
      <div className="page lesson-page">
        <PageHeader eyebrow="语法 · 错题重练" title="还没有攒够素材" />
        <EmptyState
          title="弱点还不够明确"
          description="等你练几课、或者在侦探里找过几处错，这里会自动拼出一节属于你的复盘课。"
        />
        <div className="lesson-stage-actions">
          <Link to="/grammar" className="primary-button">返回课程地图</Link>
        </div>
      </div>
    );
  }

  if (done) {
    const total = lesson.items.length;
    return (
      <div className="page lesson-page">
        <PageHeader eyebrow="语法 · 错题重练" title="复盘完成" />
        <section className="lesson-stage" aria-label="复盘完成">
          <div className="lesson-complete">
            <CheckCircle2 size={28} />
            <h2>这几处毛病过了一遍</h2>
            <p className="lesson-summary-rule">
              一共 {total} 题，其中 {firstTryCount} 题一次就点对了。这些坑已经记下，下次它们再出现你会认得更快。
            </p>
            <div className="lesson-stage-actions">
              <Link to="/grammar" className="primary-button">返回课程地图</Link>
              {/* 走查修复：无到期卡时「去复习」会落到 0/0 的空页面——改为只在真有卡时出现 */}
              {dueReviewCount > 0 && (
                <Link to="/grammar/review" className="secondary-button">去复习 · {dueReviewCount} 张</Link>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  /** 点选词块：命中即通过（判题是确定性词块相等，不用 AI）。 */
  const pickToken = (tokenIndex: number) => {
    if (!current || outcome === "pass") return;
    setPickedToken(tokenIndex);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const picked = current.tokens?.[tokenIndex] ?? "";
    const passed = normalizeLessonSentence(picked) === normalizeLessonSentence(current.answer);
    if (passed && nextAttempts === 1) setFirstTryCount((count) => count + 1);
    // 按罪名累计（无论对错都计一次尝试；一次通过的才计 firstTry）
    const tagOfCurrent = current.tag;
    setPerTag((byTag) => {
      const bucket = byTag[tagOfCurrent] ?? { total: 0, firstTry: 0 };
      return {
        ...byTag,
        [tagOfCurrent]: {
          total: bucket.total + 1,
          firstTry: bucket.firstTry + (passed && nextAttempts === 1 ? 1 : 0)
        }
      };
    });
    setOutcome(passed ? "pass" : "retry");
  };

  const advance = () => {
    if (!current) return;
    if (index + 1 >= lesson.items.length) {
      appendGrammarEvent({
        kind: "grammar_replay_completed",
        itemCount: lesson.items.length,
        firstTryCount,
        tags: lesson.tags,
        perTag: Object.entries(perTag).map(([tag, entry]) => ({
          tag,
          total: entry.total,
          firstTry: entry.firstTry
        })),
        durationMs: Date.now() - startedAt,
        ts: nowIso()
      });
      setDone(true);
      return;
    }
    setIndex((current) => current + 1);
    setPickedToken(null);
    setOutcome("idle");
    setAttempts(0);
  };

  const sourceLesson = current?.sourceLessonId ? getGrammarLesson(current.sourceLessonId) : undefined;

  return (
    <div className="page lesson-page">
      <PageHeader
        eyebrow="语法 · 错题重练"
        title="你的三句话"
        description="从最近反复摔的地方拼出来的一节课——每题都出自你学过的课。"
      />
      <section className="lesson-stage" aria-label="错题重练">
        <div className="lesson-quiz-card">
          <div className="lesson-quiz-head">
            <span className="lesson-quiz-step">第 {index + 1} / {lesson.items.length} 题</span>
            <span className="lesson-quiz-note">
              {current && GRAMMAR_ERROR_TAG_LABELS[current.tag]}
            </span>
          </div>

          <p className="lesson-quiz-prompt">{current?.promptZh}</p>

          <div className="lesson-spot-row">
            {(current?.tokens ?? []).map((token, tokenIndex) => {
              const isPicked = pickedToken === tokenIndex;
              const isAnswer = outcome === "pass" && isPicked;
              return (
                <button
                  type="button"
                  className={`lesson-chip${isAnswer ? " static" : ""}`}
                  key={`${token}-${tokenIndex}`}
                  onClick={() => pickToken(tokenIndex)}
                  disabled={outcome === "pass"}
                >
                  {token}
                </button>
              );
            })}
          </div>

          {outcome === "pass" && (
            <div className="lesson-feedback pass" aria-live="polite">
              <p>
                <CheckCircle2 size={16} /> 找到了！<strong>{current?.correctionZh}</strong>
              </p>
              <p className="lesson-why-line">
                <Lightbulb size={13} aria-hidden="true" /> {current?.explainZh}
              </p>
              {sourceLesson && (
                <p className="lesson-ask-source">
                  出自：第 {sourceLesson.number} 课 · {sourceLesson.title}
                </p>
              )}
              <button type="button" className="primary-button" onClick={advance}>
                {index + 1 >= lesson.items.length ? "完成复盘" : "下一题"}
              </button>
            </div>
          )}

          {outcome === "retry" && (
            <div className="lesson-feedback retry" aria-live="polite">
              <p>{attempts >= 2 ? "再想想——这处毛病和你最近摔的是同一类。" : "不是这个词块，再看看别的。"}</p>
              <button
                type="button"
                className="ghost-link"
                onClick={() => {
                  setPickedToken(null);
                  setOutcome("idle");
                }}
              >
                重选
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
