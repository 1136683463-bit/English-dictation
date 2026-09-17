import { Check, GraduationCap, PlayCircle, RotateCcw, Sparkles, TrendingDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import AdventureScene from "../components/AdventureScene";
import PageHeader from "../components/PageHeader";
import type { AdventureSceneId } from "../components/AdventureScene";
import type { GrammarLesson } from "../types";
import { backfillLessonCoreSentences, getLessonStageLock, listGrammarLessons, summarizeLessonProgress, type LessonStageIndex } from "../services/lessonService";
import { buildGrammarReviewSession, GRAMMAR_REVIEW_SESSION_LIMIT } from "../services/grammarReviewService";
import { computeWeakSpotsReport, scheduleCardsForToday, type HealedSpot, type WeakSpot } from "../services/grammarWeakSpotsService";
import { appendGrammarEvent, buildGrammarTelemetryExport, getGrammarTelemetryStats, listGrammarEventsByKind } from "../services/grammarTelemetry";
import { buildLastWeekReport, type WeeklyReport } from "../services/grammarOutputService";
import { downloadTextFile, nowIso } from "../services/storage";

/** R06：已战胜的弱点——确证治愈（不是 7 天没犯被遗忘，而是有卡跃迁 mastered 且此后未再犯）。 */
function HealedSpotsRow({ spots }: { spots: HealedSpot[] }) {
  if (spots.length === 0) return null;
  return (
    <div className="healed-spots-row" aria-label="已战胜的弱点">
      <Check size={15} aria-hidden="true" />
      <p>
        已战胜：{spots.map((spot) => spot.label).join("、")}
        <span className="healed-spots-hint">——这些错你有卡片真正练会了，不是最近没遇到。</span>
      </p>
    </div>
  );
}

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

/** R07：can-do 锚点与 24 课对齐——12（第一季收口）/ 18（进阶过半）/ 24（全剧终）。 */
const CAN_DO_MILESTONES: CanDoMilestone[] = [
  {
    id: "can-do-m1",
    afterLesson: 12,
    title: "我能把昨天和明天都说清楚",
    zh: "从现在到过去再到打算——第一季收官，你的句子已经能办日常的正事了。",
    samples: ["I went to the park yesterday.", "I will call my mom tonight.", "I like reading because it is fun."]
  },
  {
    id: "can-do-m2",
    afterLesson: 18,
    title: "我能说出我想要什么、我必须做什么",
    zh: "点餐、请假、开口求助——进阶过半，情态和比较让你的句子更灵活。",
    samples: ["Can I have a milk tea?", "I want to travel.", "This one is better than that one."]
  },
  {
    id: "can-do-m3",
    afterLesson: 24,
    title: "我能讲清楚已经发生和刚刚发生的事",
    zh: "完成时把「经历」和「影响」说清了——这就是进阶篇的收口。",
    samples: ["I have finished my homework.", "I have been to Beijing.", "I have lost my key."]
  },
  {
    id: "can-do-m4",
    afterLesson: 27,
    title: "我能说清楚他和她每天做什么",
    zh: "三单、存在句、疑问词全拿下——最顽固的小毛病都改掉了，你的日常表达已经又稳又准。",
    samples: ["He drinks milk every day.", "There is a book on the desk.", "Where is my key?"]
  },
  {
    id: "can-do-m5",
    afterLesson: 34,
    title: "我能把时间和数量都说利索",
    zh: "频率、打算、数量、最、命令、远近、过去进行——巩固篇全通关，日常对话里你几乎不会再卡壳。",
    samples: ["I am going to watch a movie this weekend.", "How many books do you have?", "I was drawing at three."]
  },
  {
    id: "can-do-m6",
    afterLesson: 41,
    title: "我能一句话说两件事",
    zh: "话中话（我知道他在哪）+ 挂尾巴（戴眼镜的男生）——第四季收官，你的句子能装下别人的话和事物的样子了。",
    samples: ["I know where he is.", "The boy who wears glasses is my brother.", "This is the book which I read."]
  },
  {
    id: "can-do-m7",
    afterLesson: 46,
    title: "我能说清喜欢做的事和想做的事",
    zh: "名字版（like/enjoy + reading）+ 小垫板（want to travel）——动词后面跟什么，你已经有手感了。",
    samples: ["I like reading.", "I enjoy reading.", "I want to travel."]
  },
  {
    id: "can-do-m8",
    afterLesson: 49,
    title: "我能给人建议、说条件",
    zh: "三兄弟（能/必须/应该）+ 条件句（如果下雨就…）——给建议、说打算，日常对话里的语用工具齐了。",
    samples: ["You should sleep early.", "If it rains, I will stay at home.", "You should take an umbrella if it rains."]
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

/** R14 周报卡：每周首次进入时展示上周一句话结论（不催不焦虑，看完即收起）。 */
const WEEKLY_REPORT_KEY = "grammar-weekly-report-v1";

function WeeklyReportCard({ report, onDismiss }: { report: WeeklyReport; onDismiss: () => void }) {
  return (
    <section className="can-do-card weekly-report-card" aria-label="上周小结">
      <header className="can-do-head">
        <span className="can-do-icon" aria-hidden="true">
          <Sparkles size={17} />
        </span>
        <div className="can-do-heading">
          <h2>上周小结</h2>
          <p>{report.sentence}</p>
        </div>
      </header>
      <button type="button" className="can-do-confirm" onClick={onDismiss}>
        知道了，继续
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

/** R20：课程分组——按季划分（2026-09-14 第四批上线：season-3 收口至 34，新增 season-4 从句篇）。 */
const LESSON_GROUPS: Array<{ id: string; label: string; hint: string; min: number; max: number }> = [
  { id: "season-1", label: "第一季 · 初级篇", hint: "从第一句英语，到把昨天和明天说清楚", min: 1, max: 12 },
  { id: "season-2", label: "第二季 · 进阶篇", hint: "从「报句子」到「讲事情」：进行时、情态、比较、连句", min: 13, max: 24 },
  // F5 第三季 · 巩固篇（2026-09-13）：补 A2 高频缺口——三单 -s、there be、疑问词系统
  { id: "season-3", label: "第三季 · 巩固篇", hint: "把最顽固的小毛病改掉：三单、存在句、疑问词、频率、打算、数量……全部拿下", min: 25, max: 34 },
  // 第四批 · 句子变长（2026-09-14）：宾从「话中话」+ 定从「挂尾巴」
  { id: "season-4", label: "第四季 · 句子变长", hint: "从一句一件事，到一句话说两件事：话中话、给名词挂尾巴", min: 35, max: 41 },
  // 第五批 · 动词的两件新搭档（2026-09-16）：-ing 名字版 + 目的 to 小垫板
  { id: "season-5", label: "第五季 · 动词的两件新搭档", hint: "喜欢做、享受做、去做、想做：like/enjoy + reading；go … to buy", min: 42, max: 46 },
  // 第六批 · 语用入门（2026-09-17）：S5 首兑——should 建议 + if 条件句
  { id: "season-6", label: "第六季 · 建议与条件", hint: "给人建议、说条件：should 应该 / if 如果……就……", min: 47, max: 49 }
];

export default function GrammarPathPage() {
  const { data, updateData } = useAppData();
  const lessons = useMemo(() => listGrammarLessons(), []);

  // R05：漏斗第一环埋点——每次进入语法页记一条（lessonsDone 区分首访/继续态）。
  // StrictMode 下 effect 会双跑，用 ref 保证一次挂载只记一条。
  const pathViewTracked = useRef(false);
  useEffect(() => {
    if (pathViewTracked.current) return;
    pathViewTracked.current = true;
    appendGrammarEvent({
      kind: "grammar_path_viewed",
      lessonsDone: (data.grammarLessonsDone ?? []).length,
      ts: nowIso()
    });
    // lessonsDone 取进入时的快照即可，不随完成动作重复上报
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // R04 存量回填：核心句没入队的已完成课，进语法页时静默补齐（幂等，空跑零成本）。
  const backfillRan = useRef(false);
  useEffect(() => {
    if (backfillRan.current) return;
    backfillRan.current = true;
    updateData((latest) => backfillLessonCoreSentences(latest).data);
  }, [updateData]);

  const summary = useMemo(() => summarizeLessonProgress(data), [data]);
  const nextId = summary.nextLesson?.id ?? null;
  const dueReviewCount = useMemo(() => buildGrammarReviewSession(data, GRAMMAR_REVIEW_SESSION_LIMIT).length, [data]);
  const weakSpotsReport = useMemo(() => computeWeakSpotsReport(data), [data]);
  const weakSpots = weakSpotsReport.active;
  const healedSpots = weakSpotsReport.healed;

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

  // R14 周报：每周首次进入且上周有可说的内容时展示一次；已展示过的周不再出现。
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(() => {
    const report = buildLastWeekReport(data);
    if (!report) return null;
    try {
      const shown = window.localStorage.getItem(WEEKLY_REPORT_KEY);
      if (shown === report.weekStart) return null;
    } catch {
      // 忽略
    }
    return report;
  });
  const dismissWeeklyReport = () => {
    if (weeklyReport) {
      try {
        window.localStorage.setItem(WEEKLY_REPORT_KEY, weeklyReport.weekStart);
      } catch {
        // 忽略
      }
    }
    setWeeklyReport(null);
  };

  // F1 三关卡：关 1 完成时间读取器（取遥测最近一次 completed 事件，用于关 2 次日窗判定）。
  const readCompletedAt = (lessonId: string): string | null => {
    const events = listGrammarEventsByKind("grammar_lesson_completed").filter((e) => e.lessonId === lessonId);
    return events.length > 0 ? events[events.length - 1].completedAt : null;
  };

  /** F1 三节点链：正课 → 次日回访 → 旧案重审（内嵌卡片下方，24 卡不膨胀为 72 平铺卡）。 */
  const renderStageChain = (lesson: GrammarLesson) => {
    const stage1Done = data.grammarLessonsDone.includes(lesson.id);
    // 仅关 1 完成的课才显示后续两关（未学课只显示正课节点，保持路径简洁）
    if (!stage1Done) return null;
    const stages: Array<{ stage: LessonStageIndex; label: string; to: string }> = [
      { stage: 1, label: "正课", to: `/grammar/lesson/${lesson.id}` },
      { stage: 2, label: "回访", to: `/grammar/lesson/${lesson.id}/revisit` },
      { stage: 3, label: "重审", to: `/grammar/lesson/${lesson.id}/reaudit` }
    ];
    return (
      <div className="lesson-stage-chain" aria-label={`第 ${lesson.number} 课三关卡`}>
        {stages.map(({ stage, label, to }, i) => {
          const lock = getLessonStageLock(data, lesson.id, stage, readCompletedAt);
          const stateClass = lock.state === "done" ? "done" : lock.state === "unlocked" ? "open" : "locked";
          const node = (
            <span className={`lesson-stage-node ${stateClass}`} key={stage}>
              {lock.state === "done" ? "●" : lock.state === "unlocked" ? "○" : "🔒"} {label}
            </span>
          );
          return (
            <span className="lesson-stage-chain-item" key={stage}>
              {i > 0 && <span className="lesson-stage-chain-sep" aria-hidden="true">─</span>}
              {lock.state === "locked" ? node : <Link to={to} className="lesson-stage-link">{node}</Link>}
            </span>
          );
        })}
      </div>
    );
  };

  const renderLessonCard = (lesson: GrammarLesson) => {
    const isDone = data.grammarLessonsDone.includes(lesson.id);
    const isNext = lesson.id === nextId;
    return (
      <div key={lesson.id} className={`lesson-path-card-wrap${isDone ? " done" : ""}${isNext ? " next" : ""}`}>
        <Link
          to={`/grammar/lesson/${lesson.id}`}
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
        {renderStageChain(lesson)}
      </div>
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

      {/* R03 首访引导分态：零进度时主线「第 1 课」是唯一主 CTA，日记/找错降级；
          有进度后主 CTA 是「继续第 N 课」。文案随进度出现，不对零基础说「已经学过的」。 */}
      {summary.done === 0 ? (
        <div className="lesson-path-entry">
          <p>一切从这 6 分钟开始：先看小美怎么说，再跟着试一试。</p>
          <div className="lesson-path-entry-actions">
            {summary.nextLesson && (
              <Link to={`/grammar/lesson/${summary.nextLesson.id}`} className="primary-button">
                <PlayCircle size={16} /> 从第 1 课开始 · 小美的一天
              </Link>
            )}
          </div>
          {/* P2-1：两个次级入口拆成独立小卡，避免「写日记和侦探找错」被误读为一件事 */}
          <div className="lesson-path-entry-secondary">
            <span className="lesson-path-entry-secondary-lead">学完第 1 课后，这两个会更轻松：</span>
            <Link to="/grammar/diary" className="lesson-path-mini-card">写日记</Link>
            <Link to="/grammar/hunt" className="lesson-path-mini-card">侦探找错</Link>
          </div>
        </div>
      ) : (
        <div className="lesson-path-entry">
          {/* P2-3：1-3 课进度时引导语口语化（「已经学过的语法点」对刚学一两课的人偏文绉绉） */}
          <p>{summary.done <= 3 ? "学过的地方，可以去侦探那里找找漏洞来复习。" : "已经学过的语法点，可以去侦探那里找一找漏洞来复习。"}</p>
          <div className="lesson-path-entry-actions">
            {summary.nextLesson ? (
              <Link to={`/grammar/lesson/${summary.nextLesson.id}`} className="primary-button">
                <PlayCircle size={16} /> 继续第 {summary.nextLesson.number} 课 · {summary.nextLesson.title}
              </Link>
            ) : (
              <Link to="/grammar/review" className="primary-button">
                <RotateCcw size={15} /> 全部课程已完成 · 去复习巩固
              </Link>
            )}
            <Link to="/grammar/diary" className="secondary-button">
              写今日日记
            </Link>
            <Link to="/grammar/hunt" className="secondary-button">
              去侦探找错
            </Link>
            {dueReviewCount > 0 && summary.nextLesson && (
              <Link to="/grammar/review" className="secondary-button">
                <RotateCcw size={14} /> 语法复习 · {dueReviewCount} 张到期
              </Link>
            )}
          </div>
        </div>
      )}

      {weakSpots.length > 0 && <WeakSpotsCard spots={weakSpots} />}

      {/* R06：确证治愈列表——独立于活跃弱点榜，活跃榜为空也展示「已战胜」 */}
      {healedSpots.length > 0 && <HealedSpotsRow spots={healedSpots} />}

      {/* R14：每周首次进入的上周小结（一句话，看完即收起） */}
      {weeklyReport && <WeeklyReportCard report={weeklyReport} onDismiss={dismissWeeklyReport} />}

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

      {/* R03：导出卡偏技术化，首访（零进度）不展示，避免稀释主线 */}
      {summary.done > 0 && <TelemetryExportCard />}
    </div>
  );
}
