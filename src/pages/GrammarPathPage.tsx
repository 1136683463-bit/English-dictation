import { Check, ChevronDown, Flame, GraduationCap, PlayCircle, RotateCcw, Sparkles, TrendingDown } from "lucide-react";
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
import { LESSON_GROUPS } from "../data/grammarSeasons";

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
  },
  {
    id: "can-do-m9",
    afterLesson: 54,
    title: "我能让事当主角",
    zh: "幕后句（谁做的不重要）+ by（想说谁就垫）+ has been（已经做过了）——谁重要谁上台，你的句子能挑焦点了。",
    samples: ["My cup was broken.", "The cake was eaten by my brother.", "The window has been cleaned."]
  },
  {
    id: "can-do-m10",
    afterLesson: 60,
    title: "我能说清日期和日常细节",
    zh: "日期链（第几个、哪个月、几月几号）+ 做事的样子（跑得快、唱得好）+ 回忆昨天（那天有…）——日常里的小事，你能说利索了。",
    samples: ["My birthday is in May.", "She runs quickly.", "There was a bird in the park."]
  },
  {
    id: "can-do-m11",
    afterLesson: 66,
    title: "我能客气地请人帮忙、说清一样和太过",
    zh: "客气请求（Could you…?）+ 给东西（先给谁、后给什么）+ 一样与太过（as…as / too…to）——话说得体面，也说得精确。",
    samples: ["Could you help me?", "He is as tall as me.", "It is too heavy to carry."]
  },
  {
    id: "can-do-m12",
    afterLesson: 71,
    title: "我能说清擅长的、买给谁的、够不够",
    zh: "擅长（good at）+ 买给你（for 家族）+ 婉转请（Would you mind）+ 招待（Would you like）+ 够（enough）——本领说得出口，心意送得到位。",
    samples: ["I am good at drawing.", "I bought a gift for my mom.", "The bag is light enough to carry."]
  },
  {
    id: "can-do-m13",
    afterLesson: 75,
    title: "我能问频率、问时长、搭把手、约起来",
    zh: "多久一次（How often）+ 要花多久（How long）+ 让我来帮（Let me）+ 咱们去吧（Let's）——问得清楚，约得起来。",
    samples: ["How often do you run?", "It takes ten minutes.", "Let's go to the park."]
  },
  {
    id: "can-do-m14",
    afterLesson: 78,
    title: "我能给「更」加力、说清一直在做的事",
    zh: "好多了（much + 更）+ 一直在做（keep + 名字版）+ 把一天串成一条线（跨季大团圆）——说得更有劲，也说得更连贯。",
    samples: ["I feel much better today.", "I keep doing my homework.", "I run every day, and I keep reading."]
  },
  {
    id: "can-do-m15",
    afterLesson: 86,
    title: "我能把身边的东西说清楚",
    zh: "东西在哪（next to／前后／中间）+ 怎么放（put）+ 说不清是什么（something／nothing）+ 这是谁的（whose）——指哪儿说哪儿，一件件都说明白。",
    samples: ["My desk is next to the window.", "I put my bag next to the door.", "Whose bag is this? It is next to the door."]
  },
  {
    id: "can-do-m16",
    afterLesson: 94,
    title: "我能和人聊两句，也能说说从前的事",
    zh: "说天气（It's cold／windy）+ 感叹（What a…!）+ 说先后（after／before／when）+ 说从前（used to）——校门口聊两句，话越说越长。",
    samples: ["It's cold today.", "After I do my homework, I watch TV.", "I used to play here."]
  },
  {
    id: "can-do-m17",
    afterLesson: 102,
    title: "我能把昨天的事讲成一段故事",
    zh: "那时正做着（was reading）+ 被什么打断（when／the phone rang）+ 两件同时在（while）+ 从前的习惯（used to）——昨天那个电话，你能从头讲到尾。",
    samples: ["I was reading at eight.", "When you called, I was reading.", "I was reading when the phone rang."]
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

  // 2026-09-17 排版优化：季分组折叠——长页（当时 49 课 6.8 屏，现 75 课 11 季）的方位治理。
  // 默认只展开「下一课」所在季（全部学完时展开最后一季）；手动开合在本次会话内保持。
  // 不持久化：这是定位功能而非偏好，也避免 localStorage 键膨胀。
  const [groupOverrides, setGroupOverrides] = useState<Record<string, boolean>>({});
  const defaultOpenGroupId = useMemo(() => {
    if (summary.nextLesson) {
      const group = LESSON_GROUPS.find(
        (item) => summary.nextLesson!.number >= item.min && summary.nextLesson!.number <= item.max
      );
      if (group) return group.id;
    }
    return LESSON_GROUPS[LESSON_GROUPS.length - 1]?.id ?? null;
  }, [summary.nextLesson]);
  const isGroupOpen = (groupId: string) => groupOverrides[groupId] ?? groupId === defaultOpenGroupId;
  const toggleGroup = (groupId: string) =>
    setGroupOverrides((current) => ({ ...current, [groupId]: !(current[groupId] ?? groupId === defaultOpenGroupId) }));

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
        const open = isGroupOpen(group.id);
        const groupComplete = groupDone === groupLessons.length;
        const bodyId = `grammar-season-${group.id}`;
        return (
          <section
            key={group.id}
            className={`lesson-path-section${open ? " is-open" : " is-closed"}${groupComplete ? " is-complete" : ""}`}
            aria-label={group.label}
          >
            {/* 2026-09-17 排版优化：整行可点的折叠头（button + aria-expanded/aria-controls，
                与 CollapsibleSection 同一套无障碍模式）；展开时吸顶做长滚动中的方位锚点。 */}
            <button
              type="button"
              className="lesson-path-section-head"
              aria-expanded={open}
              aria-controls={bodyId}
              onClick={() => toggleGroup(group.id)}
            >
              <ChevronDown size={16} className="lesson-path-section-chevron" aria-hidden="true" />
              <h2>{group.label}</h2>
              <span className="lesson-path-section-hint" title={group.hint}>
                {group.hint}
              </span>
              <span className={`lesson-path-section-count${groupComplete ? " is-complete" : ""}`}>
                {groupComplete ? `✓ ${groupDone} / ${groupLessons.length} 课` : `${groupDone} / ${groupLessons.length} 课`}
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

      {/* R03：导出卡偏技术化，首访（零进度）不展示，避免稀释主线 */}
      {summary.done > 0 && <TelemetryExportCard />}
    </div>
  );
}
