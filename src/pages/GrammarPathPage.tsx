import { Check, Flame, GraduationCap, PlayCircle, RotateCcw, Sparkles, TrendingDown, Target } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import AdventureScene from "../components/AdventureScene";
import PageHeader from "../components/PageHeader";
import type { AdventureSceneId } from "../components/AdventureScene";
import type { GrammarLesson } from "../types";
import { backfillLessonCoreSentences, getLessonStageLock, repairDiaryCardTags, repairLessonCoreSentenceTranslations, listGrammarLessons, summarizeLessonProgress, type LessonStageIndex } from "../services/lessonService";
import { loadLessonResume } from "../services/grammarLessonResumeService";
import { buildGrammarReviewSession, GRAMMAR_REVIEW_SESSION_LIMIT } from "../services/grammarReviewService";
import { buildWeakSpotNarrative, computeWeakSpotsReport, dismissIntervention, findActiveIntervention, scheduleCardsForToday, type ActiveIntervention, type HealedSpot, type WeakSpot, type WeakSpotNarrative } from "../services/grammarWeakSpotsService";
import { buildReplayLesson } from "../services/grammarReplayService";
import { recommendPractice } from "../services/grammarWeakSpotsService";
import { appendGrammarEvent, buildGrammarTelemetryExport, getGrammarTelemetryStats, listGrammarEventsByKind } from "../services/grammarTelemetry";
import { buildLastWeekReport, type WeeklyReport } from "../services/grammarOutputService";
import {
  BOOST_TIER_META,
  BOOST_TIERS,
  boostProgressLabel,
  getLessonBoostTiersDone
} from "../services/grammarBoostService";
import { downloadTextFile, nowIso } from "../services/storage";
// R20：课程分组——按季划分（2026-09-14 第四批上线：season-3 收口至 34，新增 season-4 从句篇）。
// 2026-09-17 排版优化：分组表迁至 src/data/grammarSeasons.ts（路径页 + 侦探页共用），
// 并有 grammarSeasons.test.ts 守门「课号必须落区间」（静默过滤是登记过的头号展示层风险）。
import { buildDisplaySeasons, LESSON_GROUPS } from "../data/grammarSeasons";
// 兼容再导出：数据已移至 data/grammarCanDoMilestones（页面只导出组件，Fast Refresh 才生效）
import { CAN_DO_MILESTONES, type CanDoMilestone } from "../data/grammarCanDoMilestones";
export { CAN_DO_MILESTONES, type CanDoMilestone } from "../data/grammarCanDoMilestones";
import { buildWeeklySummaryFacts, requestWeeklySummary } from "../services/grammarWeeklySummaryService";

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

/** C4：把「最近练过」的时间显示成人话（今天 / 昨天 / N 天前）。 */
const formatReplayDate = (iso: string): string => {
  const at = new Date(iso).getTime();
  if (!Number.isFinite(at)) return "最近";
  const days = Math.floor((Date.now() - at) / (24 * 60 * 60 * 1000));
  if (days <= 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days} 天前`;
  return `${Math.floor(days / 7)} 周前`;
};

/** R08：本周反复犯的语法错 Top 3——频率×新近加权，一键排进今日复习。 */
function WeakSpotsCard({ spots, narrative, replayAvailable }: { spots: WeakSpot[]; narrative: WeakSpotNarrative | null; replayAvailable: boolean }) {
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
                {/* C4 闭环：练过之后让用户看到「练过了」，而不是练完没回声 */}
                {spot.lastReplayedAt && (
                  <p className="weak-spots-replayed">
                    <Check size={12} aria-hidden="true" />
                    最近练过：{formatReplayDate(spot.lastReplayedAt)}
                    {/* ② 成效可见：练完之后有没有再摔——这是「练了有没有用」的直接答案 */}
                    {typeof spot.mistakesSinceReplay === "number" && (
                      <span className="weak-spots-effect">
                        {spot.mistakesSinceReplay === 0
                          ? "· 之后没再摔过 👍"
                          : `· 之后又摔了 ${spot.mistakesSinceReplay} 次`}
                      </span>
                    )}
                  </p>
                )}
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
                /* P1 走查修复：无关联卡时原先是「去复习」→ 但复习队列为空（0/0 张），
                   用户点进去无事可做。改为直达能立刻练这个弱点的错题重练课。 */
                <Link to="/grammar/replay" className="weak-spots-cta">
                  练这个弱点
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      {/* C1（M3）：把已算好的加权排序讲成一句人话——此前只有数字，没有人告诉你"你总在这摔"。
          纯本地模板，零 AI 零延迟；有课可指向时给直达入口（放在榜后作收口，不打乱列表的既有阅读顺序）。 */}
      {narrative && (
        <div className="weak-spots-narrative">
          <p>{narrative.text}</p>
          {narrative.lessonId && (
            <Link to={`/grammar/lesson/${narrative.lessonId}`} className="weak-spots-narrative-cta">
              去第 {narrative.lessonNumber} 课
            </Link>
          )}
          {/* C4：把弱点拼成一节可走完的复盘课（3–5 题，每题可溯源） */}
          {replayAvailable && (
            <Link to="/grammar/replay" className="weak-spots-narrative-cta secondary">
              拼一节错题重练
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

/**
 * C2（M3）：主动介入卡——连续 2 次同错因时，课程地图顶部推一张直达重练的卡。
 * 竞析核查：行业没有一家做到"AI 主动发现问题并介入"。判定完全本地确定性，零 AI 调用。
 */
function ActiveInterventionCard({ intervention }: { intervention: ActiveIntervention }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <section className="active-intervention" aria-label="主动介入推荐">
      <span className="active-intervention-icon" aria-hidden="true">
        <Sparkles size={16} />
      </span>
      <div className="active-intervention-body">
        <p>{intervention.text}</p>
      </div>
      <div className="active-intervention-actions">
        {intervention.lessonId && (
          <Link to={`/grammar/lesson/${intervention.lessonId}`} className="primary-button">
            去重练第 {intervention.lessonNumber} 课
          </Link>
        )}
        {/* C4：也可以直接拼一节针对性的复盘课 */}
        <Link to="/grammar/replay" className="secondary-button">拼错题重练</Link>
        <button
          type="button"
          className="ghost-link"
          onClick={() => {
            dismissIntervention(intervention.tag);
            setDismissed(true);
          }}
        >
          先不用
        </button>
      </div>
    </section>
  );
}

/** R23：can-do 能力里程碑（纯剧情确证）——达成即出现，确认后收起，无进度条无焦虑。 */
const CAN_DO_KEY = "grammar-can-do-v1";

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
  const { data } = useAppData();
  /**
   * AI 小结（可选增强）：模板句已经给出数字结论，AI 再补一句"下一步建议"。
   * 每周只调一次（按周缓存），且失败/未配置时静默保留模板句——绝不阻塞或弹错。
   */
  const [aiText, setAiText] = useState<string | null>(null);
  const requestedRef = useRef(false);
  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;
    const facts = buildWeeklySummaryFacts(data);
    if (!facts) return;
    void requestWeeklySummary(data.settings.aiProvider, facts).then((outcome) => {
      if (outcome.ok && outcome.text) setAiText(outcome.text);
    });
    // 只在挂载时请求一次（周报卡每周只出现一次）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="can-do-card weekly-report-card" aria-label="上周小结">
      <header className="can-do-head">
        <span className="can-do-icon" aria-hidden="true">
          <Sparkles size={17} />
        </span>
        <div className="can-do-heading">
          <h2>上周小结</h2>
          <p>{report.sentence}</p>
          {aiText && <p className="weekly-report-ai">{aiText}</p>}
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
  /** R09：导出失败要说出来，不能照样翻成「已导出」。 */
  const [exportFailed, setExportFailed] = useState(false);

  const exportData = () => {
    const stamp = nowIso().slice(0, 10);
    // R09：依 downloadTextFile 的返回值决定文案——此前忽略返回值，
    // 文件其实没生成也照样显示「已导出」。
    if (!downloadTextFile(`grammar-telemetry-${stamp}.json`, buildGrammarTelemetryExport(), "application/json")) {
      setExportFailed(true);
      setExported(false);
      return;
    }
    setExportFailed(false);
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
      {exportFailed && (
        <p className="can-do-note" role="alert">
          这次导出没能生成文件，可以稍后再试，或改用打开网页版导出。
        </p>
      )}
    </section>
  );
}

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
  // 顺带补写存量核心句卡缺失的中文意思——back 为空会让 /review 的题面等于答案本身。
  const backfillRan = useRef(false);
  useEffect(() => {
    if (backfillRan.current) return;
    backfillRan.current = true;
    updateData(
      (latest) =>
        repairDiaryCardTags(
          repairLessonCoreSentenceTranslations(backfillLessonCoreSentences(latest).data).data
        ).data
    );
  }, [updateData]);

  const summary = useMemo(() => summarizeLessonProgress(data), [data]);
  const nextId = summary.nextLesson?.id ?? null;
  const dueReviewCount = useMemo(() => buildGrammarReviewSession(data, GRAMMAR_REVIEW_SESSION_LIMIT).length, [data]);
  const weakSpotsReport = useMemo(() => computeWeakSpotsReport(data), [data]);
  // C2：主动介入（连续 2 次同错因 → 顶部推荐卡，48 小时冷却）
  const activeIntervention = useMemo(() => findActiveIntervention(data), [data]);
  // C1：弱点叙事（纯本地模板，零 AI）——P2：介入卡在场时换视角，避免同屏重复同一句话
  const weakSpotNarrative = useMemo(
    () => buildWeakSpotNarrative(data, Date.now(), { interventionPresent: Boolean(activeIntervention) }),
    [data, activeIntervention]
  );
  /**
   * ③ 显示用季列表：未归季的课进「新章节」兜底分组，而不是被区间过滤静默丢弃。
   * （内容进程一天内从 158 加到 200 课，只要一次忘记同步季分组，课就会凭空消失。）
   */
  const displaySeasons = useMemo(
    () => buildDisplaySeasons(lessons.map((lesson) => lesson.number)),
    [lessons]
  );

  /**
   * ④ 统一练习推荐：四类练习并存时选「最该做的那一个」，缓解「7 种说法 4 类练习」的混乱。
   * 优先级：到期复习（错过遗忘临界）> 明确弱点（练了立刻见效）> 不推。
   */
  const practicePick = useMemo(
    () => recommendPractice({
      dueReviewCount,
      weakSpots: weakSpotsReport.active.map((spot) => ({ tag: spot.tag, recentCount: spot.recentCount }))
    }),
    [dueReviewCount, weakSpotsReport]
  );

  // C4：弱点素材是否够拼一节复盘课（不够则不显示入口，不给残缺的课）
  const replayAvailable = useMemo(
    () => !buildReplayLesson(weakSpotsReport.active.map((spot) => spot.tag)).isEmpty,
    [weakSpotsReport]
  );
  const weakSpots = weakSpotsReport.active;
  const healedSpots = weakSpotsReport.healed;

  // 2026-09-17 排版优化：季分组折叠——长页的方位治理。
  // R-UX-IA（2026-09-19）：两级导航——首页总览季卡，点卡片展开该季课表。
  // 2026-09-20 季合并后为 27 季（原 38 季，末段 17 个小季合并为 6 个大季）。
  // 单选语义：openSeasonId = null（全部收起）/ 季 id；默认展开「下一课」所在季
  //（全部学完时展开最后一季）。此前 override 表 + 默认值回退的组合会让默认季
  // 绕过互斥（点别的卡后旧季仍开），改为显式单值状态机。
  const [openSeasonId, setOpenSeasonId] = useState<string | null>(() => {
    const nextLesson = summary.nextLesson;
    if (nextLesson) {
      const group = LESSON_GROUPS.find(
        (item) => nextLesson.number >= item.min && nextLesson.number <= item.max
      );
      if (group) return group.id;
    }
    return LESSON_GROUPS[LESSON_GROUPS.length - 1]?.id ?? null;
  });
  // 换课（下一课推进）且用户未手动动过折叠时，展开态跟随当前季
  const openSeasonTouchedRef = useRef(false);
  useEffect(() => {
    const nextLesson = summary.nextLesson;
    if (openSeasonTouchedRef.current || !nextLesson) return;
    const group = LESSON_GROUPS.find(
      (item) => nextLesson.number >= item.min && nextLesson.number <= item.max
    );
    if (group) setOpenSeasonId(group.id);
  }, [summary.nextLesson]);
  const isGroupOpen = (groupId: string) => openSeasonId === groupId;
  const toggleGroup = (groupId: string) => {
    openSeasonTouchedRef.current = true;
    // 单选：点别的卡切换过去；点已开的卡收起（回到总览）
    setOpenSeasonId((current) => (current === groupId ? null : groupId));
  };

  // R23：里程碑达成 = 截至该课号的所有课都完成；已确认的存在独立 localStorage 键，不进 AppData。
  const [confirmedCanDos, setConfirmedCanDos] = useState<string[]>(readConfirmedCanDos);
  const achievedCanDos = useMemo(() => {
    const doneIds = new Set(data.grammarLessonsDone);
    return CAN_DO_MILESTONES.filter((milestone) =>
      lessons.filter((lesson) => lesson.number <= milestone.afterLesson).every((lesson) => doneIds.has(lesson.id))
    );
  }, [data.grammarLessonsDone, lessons]);
  const pendingCanDo = achievedCanDos.find((milestone) => !confirmedCanDos.includes(milestone.id)) ?? null;

  // R-UX7：路径页恢复锚点——找「有续学快照且未完课」的课（快照 24h 过期由 service 保证）
  const resumeHint = useMemo(() => {
    const doneIds = new Set(data.grammarLessonsDone);
    // 只扫快照语义上的「最近在学」：从下一课往前找几课 + 已解锁未完课，量小直接线性
    for (const lesson of lessons) {
      if (doneIds.has(lesson.id)) continue;
      const snapshot = loadLessonResume(lesson.id);
      if (snapshot && (snapshot.practiceIndex > 0 || snapshot.outputStep >= 0)) {
        return { lessonId: lesson.id, lessonNumber: lesson.number, step: snapshot.practiceIndex };
      }
    }
    return null;
  }, [data.grammarLessonsDone, lessons]);

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

  /**
   * R-B6「趁热练」档位条：追加在三节点链**下一行**，渲染在卡片 `<Link>` 之外
   * （天然无冒泡问题，不需要 stopPropagation；每个档位是可聚焦的 `<Link>`，键盘可单独激活）。
   * 不新增第 4 个平级节点——避免与「正课/回访/重审」混淆、24 卡视觉膨胀。
   */
  const renderBoostBar = (lesson: GrammarLesson) => {
    if (!data.grammarLessonsDone.includes(lesson.id)) return null;
    const doneTiers = getLessonBoostTiersDone(data, lesson.id);
    const progress = boostProgressLabel(data, lesson.id);
    return (
      <div className="lesson-boost-bar" aria-label={`第 ${lesson.number} 课趁热练档位`}>
        <span className="lesson-boost-bar-label">
          <Flame size={13} aria-hidden="true" /> 趁热练
        </span>
        {BOOST_TIERS.map((tier) => {
          const tierMeta = BOOST_TIER_META[tier];
          const isDone = doneTiers.has(tier);
          return (
            <Link
              key={tier}
              to={`/grammar/boost/${lesson.id}?tier=${tier}&from=card`}
              className={`lesson-boost-tier${isDone ? " done" : ""}`}
              aria-label={`第 ${lesson.number} 课 趁热练 ${tierMeta.name}（${tierMeta.summaryZh}）`}
              onClick={() => {
                appendGrammarEvent({
                  kind: "grammar_boost_offered",
                  lessonId: lesson.id,
                  entryPoint: "card",
                  recommendedTier: tier,
                  ts: nowIso()
                });
              }}
            >
              {isDone ? "●" : "○"} {tierMeta.name}
            </Link>
          );
        })}
        {progress && <span className="lesson-boost-progress">{progress}</span>}
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
        {renderBoostBar(lesson)}
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
          <div className="grammar-path-actions">
            <div className="lesson-progress-pill" aria-label="课程进度">
              <GraduationCap size={16} />
              <span>
                {summary.done} / {summary.total} 课
              </span>
            </div>
            {/* ④ 画像入口：全貌与趋势（弱点卡只讲 Top3 待修） */}
            <Link to="/grammar/profile" className="lesson-progress-pill ghost" aria-label="我的语法画像">
              <Sparkles size={15} />
              <span>我的画像</span>
            </Link>
          </div>
        }
      />

      {activeIntervention && <ActiveInterventionCard intervention={activeIntervention} />}

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
              <>
                <Link to={`/grammar/lesson/${summary.nextLesson.id}`} className="primary-button">
                  <PlayCircle size={16} /> 继续第 {summary.nextLesson.number} 课 · {summary.nextLesson.title}
                </Link>
                {/* R-UX7：恢复锚点——上次中途离开的课置顶可续（联动 R-UX3 快照，24h 内有效） */}
                {resumeHint && resumeHint.lessonId !== summary.nextLesson.id && (
                  <Link to={`/grammar/lesson/${resumeHint.lessonId}`} className="secondary-button">
                    上次学到第 {resumeHint.lessonNumber} 课 · 第 {resumeHint.step + 1} 步，去接着练
                  </Link>
                )}
              </>
            ) : (
              <Link to="/grammar/review" className="primary-button">
                <RotateCcw size={15} /> 全部课程已完成 · 去复习巩固
              </Link>
            )}
            {/* ④ 统一练习推荐位：只在有明确该做的事时出现，避免入口堆叠 */}
            {practicePick?.kind === "review" && (
              <Link to="/grammar/review" className="secondary-button">
                <RotateCcw size={14} /> 复习 · {practicePick.dueCount} 句到期
              </Link>
            )}
            {practicePick?.kind === "replay" && (
              <Link to="/grammar/replay" className="secondary-button">
                <Target size={14} /> 针对弱点练几题
              </Link>
            )}
            <Link to="/grammar/diary" className="secondary-button">
              写今日日记
            </Link>
            <Link to="/grammar/hunt" className="secondary-button">
              去侦探找错
            </Link>
          </div>
        </div>
      )}

      {/* ④ 推荐理由：让用户知道「为什么系统让我现在做这个」 */}
      {practicePick && (
        <p className="practice-pick-reason">
          <Target size={13} aria-hidden="true" />
          {practicePick.reason}
        </p>
      )}

      {weakSpots.length > 0 && (
        <WeakSpotsCard spots={weakSpots} narrative={weakSpotNarrative} replayAvailable={replayAvailable} />
      )}

      {/* R06：确证治愈列表——独立于活跃弱点榜，活跃榜为空也展示「已战胜」 */}
      {healedSpots.length > 0 && <HealedSpotsRow spots={healedSpots} />}

      {/* R14：每周首次进入的上周小结（一句话，看完即收起） */}
      {weeklyReport && <WeeklyReportCard report={weeklyReport} onDismiss={dismissWeeklyReport} />}

      {pendingCanDo && <CanDoCard milestone={pendingCanDo} onConfirm={confirmCanDo} />}

      {/* R-UX-IA：季卡片两级导航——首页只见季卡总览（进度+状态一目了然），
          点卡片才展开该季课表（同时只开一季，方位置焦）。
          此前是 20 个折叠行全部平铺，滚动长、季与季的进度要逐行扫。 */}
      <div className="season-map">
        {displaySeasons.map((group) => {
          const groupLessons = lessons.filter((lesson) => lesson.number >= group.min && lesson.number <= group.max);
          if (groupLessons.length === 0) return null;
          const groupDone = groupLessons.filter((lesson) => data.grammarLessonsDone.includes(lesson.id)).length;
          const open = isGroupOpen(group.id);
          const groupComplete = groupDone === groupLessons.length;
          const isCurrent = summary.nextLesson != null && summary.nextLesson.number >= group.min && summary.nextLesson.number <= group.max;
          const bodyId = `grammar-season-${group.id}`;
          const percent = Math.round((groupDone / groupLessons.length) * 100);
          // 进度环：conic-gradient，空进度与满进度都由 --p 驱动（无 JS 绘图）
          const ringStyle = { ["--p" as string]: String(percent) };
          return (
            <section
              key={group.id}
              className={`season-card${open ? " is-open" : ""}${groupComplete ? " is-complete" : ""}${isCurrent ? " is-current" : ""}`}
              aria-label={group.label}
            >
              <button
                type="button"
                className="season-card-head"
                aria-expanded={open}
                aria-controls={bodyId}
                onClick={() => toggleGroup(group.id)}
              >
                <span className="season-ring" style={ringStyle} aria-hidden="true">
                  <span className="season-ring-num">{groupComplete ? "✓" : `${groupDone}`}</span>
                </span>
                {/* R-UX-IA 修复：两行布局——首行标题+徽章，次行简介独占整宽。
                    此前三块挤一行，窄卡时标题折行、简介只剩省略号。 */}
                <span className="season-card-text">
                  <span className="season-card-title-row">
                    <span className="season-card-title">{group.label}</span>
                    <span className="season-card-meta">
                      {groupComplete ? "已完成" : isCurrent ? "进行中" : `${groupDone} / ${groupLessons.length} 课`}
                    </span>
                  </span>
                  <span className="season-card-hint">{group.hint}</span>
                </span>
              </button>
              {open && (
                <div className="lesson-path-grid" id={bodyId}>
                  {groupLessons.map(renderLessonCard)}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* R03：导出卡偏技术化，首访（零进度）不展示，避免稀释主线 */}
      {summary.done > 0 && <TelemetryExportCard />}
    </div>
  );
}
