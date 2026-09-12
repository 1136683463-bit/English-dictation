import { GraduationCap, PlayCircle, RotateCcw, TrendingDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import AdventureScene from "../components/AdventureScene";
import PageHeader from "../components/PageHeader";
import type { AdventureSceneId } from "../components/AdventureScene";
import { listGrammarLessons, summarizeLessonProgress } from "../services/lessonService";
import { buildGrammarReviewSession, GRAMMAR_REVIEW_SESSION_LIMIT } from "../services/grammarReviewService";
import { computeWeakSpots, scheduleCardsForToday, type WeakSpot } from "../services/grammarWeakSpotsService";

/** R08：本周反复犯的语法错 Top 3——频率×新近加权，一键排进今日复习。 */
function WeakSpotsCard({ spots }: { spots: WeakSpot[] }) {
  const { updateData } = useAppData();
  const [queuedTags, setQueuedTags] = useState<Record<string, boolean>>({});

  const queueToday = (spot: WeakSpot) => {
    updateData((latest) => scheduleCardsForToday(latest, spot.relatedCardIds));
    setQueuedTags((current) => ({ ...current, [spot.tag]: true }));
  };

  return (
    <div className="lesson-path-entry" aria-label="本周语法弱点">
      <p>
        <TrendingDown size={14} style={{ verticalAlign: -2, marginRight: 4 }} />
        本周反复出现的语法弱点 Top {spots.length}——每次复习都算数，弱项会越来越小。
      </p>
      <div style={{ display: "grid", gap: 8 }}>
        {spots.map((spot, rank) => (
          <div
            key={spot.tag}
            style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
          >
            <span className="lesson-path-episode">{rank + 1}</span>
            <div style={{ flex: 1, minWidth: 200 }}>
              <strong>{spot.label}</strong>
              <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.75 }}>
                近 7 天 {spot.recentCount} 次 · 累计 {spot.totalCount} 次
              </span>
              <div style={{ fontSize: 12, opacity: 0.75 }}>
                {spot.plain}
                {spot.example && ` · 例：${spot.example}`}
              </div>
            </div>
            {spot.relatedCardIds.length > 0 ? (
              <button
                type="button"
                className="secondary-button"
                onClick={() => queueToday(spot)}
                disabled={queuedTags[spot.tag]}
              >
                {queuedTags[spot.tag] ? "已排进今日复习" : "今天复习它"}
              </button>
            ) : (
              <Link to="/grammar/review" className="secondary-button">
                去复习
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GrammarPathPage() {
  const { data } = useAppData();
  const lessons = useMemo(() => listGrammarLessons(), []);
  const summary = useMemo(() => summarizeLessonProgress(data), [data]);
  const nextId = summary.nextLesson?.id ?? null;
  const dueReviewCount = useMemo(() => buildGrammarReviewSession(data, GRAMMAR_REVIEW_SESSION_LIMIT).length, [data]);
  const weakSpots = useMemo(() => computeWeakSpots(data), [data]);

  return (
    <div className="page lesson-page">
      <PageHeader
        eyebrow="语法"
        title="小美的一天"
        description={`跟着小美，从第一句英语开始。先看句子怎么搭出来，再动手试，每课 3–5 分钟。`}
        action={
          <div className="lesson-progress-pill" aria-label="课程进度">
            <GraduationCap size={16} />
            <span>
              {summary.done} / {summary.total} 课
            </span>
          </div>
        }
      />

      <div className="lesson-path-entry">
        <p>已经学过的语法点，可以去侦探那里找一找漏洞来复习。</p>
        <div className="lesson-path-entry-actions">
          <Link to="/grammar/diary" className="primary-button">
            写今日日记
          </Link>
          <Link to="/grammar/hunt" className="secondary-button">
            去侦探找错
          </Link>
          {dueReviewCount > 0 && (
            <Link to="/grammar/review" className="secondary-button">
              <RotateCcw size={14} /> 语法复习 · {dueReviewCount} 张到期
            </Link>
          )}
        </div>
      </div>

      {weakSpots.length > 0 && <WeakSpotsCard spots={weakSpots} />}

      <div className="lesson-path-grid">
        {lessons.map((lesson) => {
          const isDone = data.grammarLessonsDone.includes(lesson.id);
          const isNext = lesson.id === nextId;
          return (
            <Link
              to={`/grammar/lesson/${lesson.id}`}
              key={lesson.id}
              className={`lesson-path-card${isDone ? " done" : ""}${isNext ? " next" : ""}`}
            >
              <div className="lesson-path-art" aria-hidden="true">
                <AdventureScene scene={lesson.scene as AdventureSceneId} />
              </div>
              <div className="lesson-path-body">
                <div className="lesson-path-head">
                  <span className="lesson-path-episode">{lesson.episode}</span>
                  <span className="lesson-path-grammar">{lesson.grammarLabel}</span>
                  {isDone && <span className="lesson-path-done">已完成</span>}
                  {isNext && !isDone && <span className="lesson-path-next">下一课</span>}
                </div>
                <strong>第 {lesson.number} 课 · {lesson.title}</strong>
                <p>{lesson.sceneSetupZh}</p>
                <span className="lesson-path-cta">
                  {isDone ? "再学一遍" : isNext ? (
                    <>
                      <PlayCircle size={14} /> 开始这一课
                    </>
                  ) : "去学习"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
