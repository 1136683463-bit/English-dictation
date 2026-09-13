import { Check, GraduationCap, PlayCircle, RotateCcw, Sparkles, TrendingDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import AdventureScene from "../components/AdventureScene";
import PageHeader from "../components/PageHeader";
import type { AdventureSceneId } from "../components/AdventureScene";
import type { GrammarLesson } from "../types";
import { listGrammarLessons, summarizeLessonProgress } from "../services/lessonService";
import { buildGrammarReviewSession, GRAMMAR_REVIEW_SESSION_LIMIT } from "../services/grammarReviewService";
import { computeWeakSpots, scheduleCardsForToday, type WeakSpot } from "../services/grammarWeakSpotsService";
import { appendGrammarEvent, buildGrammarTelemetryExport, getGrammarTelemetryStats } from "../services/grammarTelemetry";
import { downloadTextFile, nowIso } from "../services/storage";

/** R08：本周反复犯的语法错 Top 3——频率×新近加权，一键排进今日复习。 */
function WeakSpotsCard({ spots }: { spots: WeakSpot[] }) {
  const { updateData } = useAppData();
  const [queuedTags, setQueuedTags] = useState<Record<string, boolean>>({});

  const queueToday = (spot: WeakSpot) => {
    updateData((latest) => scheduleCardsForToday(latest, spot.relatedCardIds));
    setQueuedTags((current) => ({ ...current, [spot.tag]: true }));
  };

  return (
    <section className="weak-spots-card" aria-label="本周语法弱点">
      <header className="weak-spots-head">
        <span className="weak-spots-icon" aria-hidden="true">
          <TrendingDown size={17} />
        </span>
        <div className="weak-spots-heading">
          <h2>本周语法弱点 Top {spots.length}</h2>
          <p>反复出现的薄弱点，每次复习都算数，弱项会越来越小。</p>
        </div>
      </header>
      <ol className="weak-spots-list">
        {spots.map((spot, rank) => {
          const queued = Boolean(queuedTags[spot.tag]);
          return (
            <li key={spot.tag} className="weak-spots-item">
              <span className={`weak-spots-rank${rank === 0 ? " top" : ""}`} aria-hidden="true">
                {rank + 1}
              </span>
              <div className="weak-spots-info">
                <div className="weak-spots-title">
                  <strong>{spot.label}</strong>
                  <span className="weak-spots-stat">近 7 天 {spot.recentCount} 次</span>
                  <span className="weak-spots-stat">累计 {spot.totalCount} 次</span>
                </div>
                <p className="weak-spots-plain">{spot.plain}</p>
                {spot.example && <p className="weak-spots-example">{spot.example}</p>}
              </div>
              {spot.relatedCardIds.length > 0 ? (
                <button
                  type="button"
                  className={`weak-spots-cta${queued ? " queued" : ""}`}
                  onClick={() => queueToday(spot)}
                  disabled={queued}
                >
                  {queued ? (
                    <>
                      <Check size={14} /> 已排进今日复习
                    </>
                  ) : (
                    "排进今日复习"
                  )}
                </button>
              ) : (
                <Link to="/grammar/review" className="weak-spots-cta">
                  去复习
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** R23：can-do 能力里程碑（纯剧情确证）——达成即出现，确认后收起，无进度条无焦虑。 */
const CAN_DO_KEY = "grammar-can-do-v1";

interface CanDoMilestone {
  id: string;
  afterLesson: number;
  title: string;
  zh: string;
  samples: string[];
}

const CAN_DO_MILESTONES: CanDoMilestone[] = [
  {
    id: "can-do-m1",
    afterLesson: 16,
    title: "我能说出我想要什么、我必须做什么",
    zh: "小美替你数了数：点餐、请假、开口求助——你的句子开始办正事了。",
    samples: ["Can I have a milk tea?", "I want to travel.", "I must finish it today."]
  },
  {
    id: "can-do-m2",
    afterLesson: 20,
    title: "我能讲清楚今天发生了什么",
    zh: "把一天连成一段话，不再是一串孤零零的句子——这就是进阶篇的收口。",
    samples: ["I was busy and happy.", "It rained, so I stayed at home.", "I was late because the bus was late."]
  }
];

const readConfirmedCanDos = (): string[] => {
  try {
    const raw = window.localStorage.getItem(CAN_DO_KEY);
    const parsed = raw ? (JSON.parse(raw) as { confirmed?: string[] }) : null;
    return Array.isArray(parsed?.confirmed) ? parsed.confirmed : [];
  } catch {
    return [];
  }
};

function CanDoCard({ milestone, onConfirm }: { milestone: CanDoMilestone; onConfirm: (id: string) => void }) {
  return (
    <section className="can-do-card" aria-label="能力里程碑">
      <header className="can-do-head">
        <span className="can-do-icon" aria-hidden="true">
          <Sparkles size={17} />
        </span>
        <div className="can-do-heading">
          <h2>{milestone.title}</h2>
          <p>{milestone.zh}</p>
        </div>
      </header>
      <div className="can-do-samples">
        {milestone.samples.map((sample) => (
          <span key={sample} className="can-do-sample">
            {sample}
          </span>
        ))}
      </div>
      <button type="button" className="can-do-confirm" onClick={() => onConfirm(milestone.id)}>
        <Sparkles size={14} /> 小美替你盖章：我做到了
      </button>
    </section>
  );
}

/** R16：学习数据导出卡——把语法遥测（含归档）导出为 JSON，供基线与复盘使用。 */
function TelemetryExportCard() {
  const [stats, setStats] = useState(() => getGrammarTelemetryStats());
  const [exported, setExported] = useState(false);

  const exportData = () => {
    const stamp = nowIso().slice(0, 10);
    downloadTextFile(`grammar-telemetry-${stamp}.json`, buildGrammarTelemetryExport(), "application/json");
    setStats(getGrammarTelemetryStats());
    setExported(true);
  };

  return (
    <section className="can-do-card" aria-label="学习数据导出">
      <header className="can-do-head">
        <span className="can-do-icon" aria-hidden="true">
          <RotateCcw size={17} />
        </span>
        <div className="can-do-heading">
          <h2>学习数据</h2>
          <p>
            本地记录 {stats.activeEvents} / {stats.maxEvents} 条
            {stats.archivedEvents > 0 ? `（另有归档 ${stats.archivedEvents} 条）` : ""}
            ——导出后可以复盘学到哪、错在哪。
          </p>
        </div>
      </header>
      <button type="button" className="weak-spots-cta" onClick={exportData} style={{ marginTop: 12 }}>
        {exported ? "已导出，可再次导出" : "导出学习数据（JSON）"}
      </button>
    </section>
  );
}

/** R20：课程分组——第一季初级篇（1–12）/ 第二季进阶篇（13+），按课号自动划分。 */
const LESSON_GROUPS: Array<{ id: string; label: string; hint: string; min: number; max: number }> = [
  { id: "season-1", label: "第一季 · 初级篇", hint: "从第一句英语，到把昨天和明天说清楚", min: 1, max: 12 },
  { id: "season-2", label: "第二季 · 进阶篇", hint: "从「报句子」到「讲事情」：进行时、情态、比较、连句", min: 13, max: 999 }
];

export default function GrammarPathPage() {
  const { data } = useAppData();
  const lessons = useMemo(() => listGrammarLessons(), []);
  const summary = useMemo(() => summarizeLessonProgress(data), [data]);
  const nextId = summary.nextLesson?.id ?? null;
  const dueReviewCount = useMemo(() => buildGrammarReviewSession(data, GRAMMAR_REVIEW_SESSION_LIMIT).length, [data]);
  const weakSpots = useMemo(() => computeWeakSpots(data), [data]);

  // R23：里程碑达成 = 截至该课号的所有课都完成；已确认的存在独立 localStorage 键，不进 AppData。
  const [confirmedCanDos, setConfirmedCanDos] = useState<string[]>(readConfirmedCanDos);
  const achievedCanDos = useMemo(() => {
    const doneIds = new Set(data.grammarLessonsDone);
    return CAN_DO_MILESTONES.filter((milestone) =>
      lessons.filter((lesson) => lesson.number <= milestone.afterLesson).every((lesson) => doneIds.has(lesson.id))
    );
  }, [data.grammarLessonsDone, lessons]);
  const pendingCanDo = achievedCanDos.find((milestone) => !confirmedCanDos.includes(milestone.id)) ?? null;

  const confirmCanDo = (milestoneId: string) => {
    const next = [...confirmedCanDos, milestoneId];
    setConfirmedCanDos(next);
    try {
      window.localStorage.setItem(CAN_DO_KEY, JSON.stringify({ version: 1, confirmed: next }));
    } catch {
      // 存储满 / 隐私模式：确证状态写不进就下次再确认，不影响页面。
    }
    appendGrammarEvent({ kind: "can_do_confirmed", milestoneId, ts: nowIso() });
  };

  const renderLessonCard = (lesson: GrammarLesson) => {
    const isDone = data.grammarLessonsDone.includes(lesson.id);
    const isNext = lesson.id === nextId;
    return (
      <Link
        to={`/grammar/lesson/${lesson.id}`}
        key={lesson.id}
        className={`lesson-path-card${isDone ? " done" : ""}${isNext ? " next" : ""}`}
      >
        <div className="lesson-path-art" aria-hidden="true">
          {lesson.cover ? (
            <img src={lesson.cover} alt="" loading="lazy" />
          ) : (
            <AdventureScene scene={lesson.scene as AdventureSceneId} />
          )}
        </div>
        <div className="lesson-path-body">
          <div className="lesson-path-head">
            <span className="lesson-path-episode">{lesson.episode}</span>
            <span className="lesson-path-grammar" title={lesson.grammarLabel}>{lesson.grammarLabel}</span>
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
  };

  return (
    <div className="page lesson-page">
      <PageHeader
        eyebrow="语法"
        title="小美的一天"
        description={`跟着小美，从第一句英语到讲清楚一天的事。先看句子怎么搭出来，再动手试，每课 6–10 分钟。`}
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

      {pendingCanDo && <CanDoCard milestone={pendingCanDo} onConfirm={confirmCanDo} />}

      {LESSON_GROUPS.map((group) => {
        const groupLessons = lessons.filter((lesson) => lesson.number >= group.min && lesson.number <= group.max);
        if (groupLessons.length === 0) return null;
        const groupDone = groupLessons.filter((lesson) => data.grammarLessonsDone.includes(lesson.id)).length;
        return (
          <section key={group.id} className="lesson-path-section" aria-label={group.label}>
            <header className="lesson-path-section-head">
              <h2>{group.label}</h2>
              <p>
                {group.hint} · {groupDone} / {groupLessons.length} 课
              </p>
            </header>
            <div className="lesson-path-grid">{groupLessons.map(renderLessonCard)}</div>
          </section>
        );
      })}

      <TelemetryExportCard />
    </div>
  );
}
