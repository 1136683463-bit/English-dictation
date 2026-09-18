import type { GrammarErrorTag } from "../types";
import type { HuntVerdictKind } from "./huntService";
import { nowIso } from "./storage";

/**
 * 语法模块遥测（R01 数据基建）。
 *
 * 设计要点（见 PRD-grammar-mastery §6 R01）：
 * - 独立 localStorage 键空间，不进入 AppData / 迁移 / 导出流程，旁路记录零侵入；
 * - 只追加（append-only），上限 3000 条，超出丢弃最旧的；
 * - 环境无 localStorage（单测 / node）时退化为内存数组，接口不变。
 */

const TELEMETRY_KEY = "grammar-telemetry-events-v1";
const MAX_EVENTS = 3000;
/** R16：溢出归档键——主键写满后，被挤出的旧事件挪到这里长期留存（导出复盘用）。 */
const TELEMETRY_ARCHIVE_KEY = "grammar-telemetry-archive-v1";
const ARCHIVE_MAX_EVENTS = 12000;

export type LessonSection =
  | "watch"
  | "pretest"
  | "guided"
  | "recall"
  | "practice"
  | "output"
  | "challenge";

/** 进课事件（R21）：漏斗的起点——没有它无法计算「进入 → 完课」流失。每次进入课程记一条。 */
export interface GrammarLessonStartedEvent {
  kind: "grammar_lesson_started";
  lessonId: string;
  ts: string;
}

/** F1 关 2 回访关进入事件（F4 口径）：次日回访率的核心分子。hoursSinceStage1 衡量回访时效性。 */
export interface GrammarRevisitStartedEvent {
  kind: "grammar_revisit_started";
  lessonId: string;
  /** 距关 1 完成的小时数（严格次日窗 20–28h 为有效回访）。 */
  hoursSinceStage1: number;
  ts: string;
}

/** F1 关 2 回访关完成事件（F4 口径）：G1 提取摩擦指标——一次通过率目标 50–70%。 */
export interface GrammarRevisitCompletedEvent {
  kind: "grammar_revisit_completed";
  lessonId: string;
  /** 一次提取成功题数（无提示凭记忆即对）。 */
  firstTryCount: number;
  totalCount: number;
  /** 回马枪题一次是否通过（无回马枪时为 null）。 */
  ambushFirstTry: boolean | null;
  durationMs: number;
  ts: string;
}

/** can-do 能力里程碑确证（R23）：完整感收口的记录，验收「确证仪式」被使用。 */
export interface CanDoConfirmedEvent {
  kind: "can_do_confirmed";
  milestoneId: string;
  ts: string;
}

/** 完课事件：北极星与漏斗的分子来源。 */
export interface GrammarLessonCompletedEvent {
  kind: "grammar_lesson_completed";
  lessonId: string;
  completedAt: string;
  /** 本次学习中，引导题是否全部一次通过（spot 热身题不计入）。 */
  guidedFirstTry: boolean;
  /** 本次学习中，练习题是否全部一次通过。 */
  practiceFirstTry: boolean;
  durationMs: number;
}

/** 单步判题结果：练习/引导的通过率与重试深度。 */
export interface LessonStepResultEvent {
  kind: "lesson_step_result";
  lessonId: string;
  section: LessonSection;
  stepKind: string;
  stepIndex: number;
  /** 到通过为止的判题次数（首次通过 = 1）。 */
  attempts: number;
  passed: boolean;
  /**
   * 产出句的归一化文本哈希（仅 output/recall 段填写）。
   * 北极星「周有效输出句数」按句去重需要句面标识——此前用 lessonId+stepIndex+时间戳（分钟）近似，
   * 同一句隔天重练会被重复计数。写入侧带上哈希后，去重键优先用它。
   */
  sentenceHash?: string;
  ts: string;
}

/** 深挖折叠卡展开事件：衡量「讲透」内容被消化的程度。 */
export interface DeepDiveExpandedEvent {
  kind: "deep_dive_expanded";
  lessonId: string;
  ts: string;
}

/** 侦探找错一次裁决记录：误报率（notError 占比）与罪名命中率的来源。 */
export interface HuntVerdictEvent {
  kind: "hunt_verdict";
  caseId: string;
  tokenIndex: number;
  verdictKind: HuntVerdictKind;
  guessedTag: GrammarErrorTag | null;
  ts: string;
}

/** 日记批改问题的语法点归因：自由输出 → 错因统计的桥。 */
export interface DiaryIssueTagEvent {
  kind: "diary_issue_tag";
  entryId: string;
  issueIndex: number;
  tag: GrammarErrorTag;
  ts: string;
}

/** 语法复习卡一次结算（R03）：错误复发率与复习通过率的来源。sourceId 用于弱点归因（diary: 来源可回溯罪名）。 */
export interface GrammarReviewResultEvent {
  kind: "grammar_review_result";
  cardId: string;
  /** R09 Step2 起含 free_type（自由输出轮）。 */
  mode: "cloze" | "rebuild" | "free_type";
  attempts: number;
  passed: boolean;
  sourceId?: string;
  ts: string;
}

/** 侦探案件结算事件（R19）：破案率与单案耗时的来源——此前只有逐次 verdict，破案率无法计算。 */
export interface HuntCaseSettledEvent {
  kind: "hunt_case_settled";
  caseId: string;
  found: number;
  total: number;
  misses: number;
  stars: number;
  durationMs: number;
  /** 是否破案（找齐全部错误）。 */
  solved: boolean;
  ts: string;
}

/** 找错案件使用一次提示：衡量「卡壳点」，未来可用于内容难度校准。 */
export interface HuntHintUsedEvent {
  kind: "hunt_hint_used";
  caseId: string;
  tag: GrammarErrorTag;
  tokenIndex: number;
  ts: string;
}

/** 段级停留事件（R20）：六段预算核验（PRD §7）的来源——进入下一段时结算上一段的停留时长。 */
export interface SectionDwellEvent {
  kind: "section_dwell";
  lessonId: string;
  section: LessonSection;
  dwellMs: number;
  ts: string;
}

/** 进入语法路径页事件（R05）：核心漏斗第一环——此前「进入语法页 → 进首课」的流失完全不可测。 */
export interface GrammarPathViewedEvent {
  kind: "grammar_path_viewed";
  /** 进入时的课程完成数（分态依据：0 = 首访态，>0 = 继续态）。 */
  lessonsDone: number;
  ts: string;
}

/** 复习卡首次跃迁到 mastered（R06）：「我学会了」的正向确证——此前只有单次复习结果，没有状态跃迁。 */
export interface CardMasteredEvent {
  kind: "card_mastered";
  cardId: string;
  /** 卡片来源（lesson:xxx / hunt:xxx / diary:xxx），弱点归因用。 */
  sourceId?: string;
  /** hunt 来源卡的罪名（从 grammarNote [tag:原错词] token 解析），其他来源为 null。 */
  tag: GrammarErrorTag | null;
  ts: string;
}

/**
 * F3 回马枪题结果（2026-09-13 PRD）：关 2/关 3 头部 1–2 题弱点加权旧点变式。
 * weakSpotTag 非空 = 命中弱点档案的题；null = 无弱点时的降级（最近 3 课随机旧点）。
 */
export interface GrammarAmbushResultEvent {
  kind: "grammar_ambush_result";
  /** 宿主关卡（lessonId#stageIndex，如 lesson-13#2）。 */
  hostId: string;
  /** 被回顾的旧课（huntCase 来源课）。 */
  sourceLessonId: string;
  /** 命中的弱点罪名（降级随机时为 null）。 */
  weakSpotTag: GrammarErrorTag | null;
  /** 被抽中的植错点所在案件。 */
  caseId: string;
  passed: boolean;
  attempts: number;
  ts: string;
}

/** 关 3 重审关进入事件（W0 补齐）：此前关 3 只有完成态、没有进入事件——到达率不可算。 */
export interface GrammarReauditStartedEvent {
  kind: "grammar_reaudit_started";
  lessonId: string;
  ts: string;
}

// ── 「趁热练」课后强化训练（2026-09-18 PRD R-B7）────────────────────────
// 口径：仅可选层，全部事件带 lessonId + tier 以支撑分层漏斗与「强化 vs 非强化」配对分析。

/** 强化入口曝光：参与率的分母（按 lessonId + entryPoint 去重，防止渲染次数污染）。 */
export interface GrammarBoostOfferedEvent {
  kind: "grammar_boost_offered";
  lessonId: string;
  entryPoint: "settlement" | "card" | "reaudit";
  /** 建议档位（结算页推第 1 档；卡片按未完成档位推）。 */
  recommendedTier: 1 | 2 | 3;
  ts: string;
}

/** 进入某一档：参与率的分子。 */
export interface GrammarBoostStartedEvent {
  kind: "grammar_boost_started";
  lessonId: string;
  tier: 1 | 2 | 3;
  questionCount: number;
  entryPoint: "settlement" | "card" | "reaudit" | "direct";
  ts: string;
}

/** 单题结果：难度落位（一次通过率）与素材重复率的原料。 */
export interface GrammarBoostStepResultEvent {
  kind: "grammar_boost_step_result";
  lessonId: string;
  tier: 1 | 2 | 3;
  itemKind: "derived" | "ai";
  /** 题目来源引用（lesson:<id>:<field>:<index>），复练换池与重复率统计用。 */
  sourceRef: string;
  /** 到通过为止的判题次数（首次通过 = 1）。 */
  attempts: number;
  passed: boolean;
  ts: string;
}

/** 单档中途退出：唯一能算放弃率的事件（现全库缺失）。 */
export interface GrammarBoostAbandonedEvent {
  kind: "grammar_boost_abandoned";
  lessonId: string;
  tier: 1 | 2 | 3;
  answered: number;
  total: number;
  dwellMs: number;
  ts: string;
}

/** 单档完成：与 grammar_revisit_completed 同构，支撑强化 vs 关 2 的配对比较。 */
export interface GrammarBoostCompletedEvent {
  kind: "grammar_boost_completed";
  lessonId: string;
  tier: 1 | 2 | 3;
  total: number;
  firstTryCount: number;
  durationMs: number;
  aiUsed: boolean;
  /** 距关 1 完成的小时数——20h 冷却窗内的强化会天然拉高关 2 表现，配对分析需排除该干扰。 */
  hoursSinceStage1: number | null;
  ts: string;
}

/** AI 批改/生成一次调用结果：降级率与延迟的来源。 */
export interface GrammarBoostAiResultEvent {
  kind: "grammar_boost_ai_result";
  lessonId: string;
  tier: 1 | 2 | 3;
  /** 0 = 单档收尾的批改调用；>0 = 变式题生成（第 N 题）。 */
  questionIndex: number;
  ok: boolean;
  latencyMs: number;
  degraded: boolean;
  degradeReason: "not_configured" | "timeout" | "error" | "invalid" | null;
  ts: string;
}

/** 命中近 7 天已练句：素材重复率的先行信号。 */
export interface GrammarBoostItemRepeatEvent {
  kind: "grammar_boost_item_repeat";
  lessonId: string;
  sourceRef: string;
  seenCount7d: number;
  ts: string;
}

export type GrammarTelemetryEvent =
  | GrammarLessonStartedEvent
  | GrammarLessonCompletedEvent
  | CanDoConfirmedEvent
  | LessonStepResultEvent
  | DeepDiveExpandedEvent
  | HuntVerdictEvent
  | HuntCaseSettledEvent
  | DiaryIssueTagEvent
  | GrammarReviewResultEvent
  | HuntHintUsedEvent
  | SectionDwellEvent
  | GrammarPathViewedEvent
  | CardMasteredEvent
  | GrammarAmbushResultEvent
  | GrammarRevisitStartedEvent
  | GrammarRevisitCompletedEvent
  | GrammarReauditStartedEvent
  | GrammarBoostOfferedEvent
  | GrammarBoostStartedEvent
  | GrammarBoostStepResultEvent
  | GrammarBoostAbandonedEvent
  | GrammarBoostCompletedEvent
  | GrammarBoostAiResultEvent
  | GrammarBoostItemRepeatEvent;

const memoryEvents: GrammarTelemetryEvent[] = [];

const hasLocalStorage = (): boolean => {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
};

const readEvents = (): GrammarTelemetryEvent[] => {
  if (!hasLocalStorage()) return memoryEvents;
  try {
    const raw = window.localStorage.getItem(TELEMETRY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { events?: unknown };
    return Array.isArray(parsed.events) ? (parsed.events as GrammarTelemetryEvent[]) : [];
  } catch {
    return [];
  }
};

const writeEvents = (events: GrammarTelemetryEvent[]) => {
  if (!hasLocalStorage()) {
    memoryEvents.length = 0;
    memoryEvents.push(...events);
    return;
  }
  try {
    window.localStorage.setItem(TELEMETRY_KEY, JSON.stringify({ version: 1, events }));
  } catch {
    // 存储满 / 隐私模式：遥测失败静默，绝不影响学习主流程。
  }
};

/** 读取归档事件（R16）：主键溢出后长期留存的历史。 */
const readArchivedEvents = (): GrammarTelemetryEvent[] => {
  if (!hasLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(TELEMETRY_ARCHIVE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { events?: unknown };
    return Array.isArray(parsed.events) ? (parsed.events as GrammarTelemetryEvent[]) : [];
  } catch {
    return [];
  }
};

/** 把被挤出的旧事件追加进归档键（归档自身也有上限，滚动丢弃最旧，防止存储无限增长）。 */
const archiveEvents = (overflow: GrammarTelemetryEvent[]): void => {
  if (overflow.length === 0) return;
  if (!hasLocalStorage()) return;
  try {
    const archived = [...readArchivedEvents(), ...overflow];
    const kept = archived.length > ARCHIVE_MAX_EVENTS ? archived.slice(archived.length - ARCHIVE_MAX_EVENTS) : archived;
    window.localStorage.setItem(TELEMETRY_ARCHIVE_KEY, JSON.stringify({ version: 1, events: kept }));
  } catch {
    // 存储满 / 隐私模式：归档失败静默，不影响主流程。
  }
};

/** 追加一条遥测事件（超出主键上限时，最旧的事件移入归档键，不丢数据）。 */
export const appendGrammarEvent = (event: GrammarTelemetryEvent): void => {
  const events = readEvents();
  events.push(event);
  if (events.length > MAX_EVENTS) {
    const overflow = events.slice(0, events.length - MAX_EVENTS);
    const kept = events.slice(events.length - MAX_EVENTS);
    archiveEvents(overflow);
    writeEvents(kept);
    return;
  }
  writeEvents(events);
};

export const listGrammarEvents = (): GrammarTelemetryEvent[] => [...readEvents()];

/** R14 周聚合：错误 tag 按自然周（周一为起点）统计——周环比的原料。
 *  referenceDate 决定「当前周」的锚点（默认真实当前时间；周报场景传与 buildLastWeekReport 相同的参考日，避免周日边界错位）。 */
export const weeklyErrorTagCounts = (weekOffset = 0, referenceDate = new Date()): Partial<Record<GrammarErrorTag, number>> => {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const local = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const monday = new Date(local.getTime() - ((local.getDay() + 6) % 7) * DAY_MS + weekOffset * 7 * DAY_MS);
  const nextMonday = new Date(monday.getTime() + 7 * DAY_MS);
  const counts: Partial<Record<GrammarErrorTag, number>> = {};
  for (const event of listGrammarEvents()) {
    const rawTs = "ts" in event ? (event.ts as string) : "";
    const parsed = new Date(rawTs);
    const ts = Number.isFinite(parsed.getTime()) ? parsed.getTime() : NaN;
    if (!Number.isFinite(ts) || ts < monday.getTime() || ts >= nextMonday.getTime()) continue;
    if (event.kind === "diary_issue_tag") {
      counts[event.tag] = (counts[event.tag] ?? 0) + 1;
    } else if (event.kind === "hunt_verdict" && (event.verdictKind === "wrongTag" || event.verdictKind === "notError")) {
      // hunt 里的误判/归错罪名：guessedTag 才是玩家困惑的语法点
      if (event.guessedTag) counts[event.guessedTag] = (counts[event.guessedTag] ?? 0) + 1;
    }
  }
  return counts;
};

export const listGrammarEventsByKind = <K extends GrammarTelemetryEvent["kind"]>(
  kind: K
): Extract<GrammarTelemetryEvent, { kind: K }>[] =>
  listGrammarEvents().filter((event): event is Extract<GrammarTelemetryEvent, { kind: K }> => event.kind === kind);

export const clearGrammarTelemetry = (): void => {
  if (!hasLocalStorage()) {
    memoryEvents.length = 0;
    return;
  }
  try {
    window.localStorage.removeItem(TELEMETRY_KEY);
    window.localStorage.removeItem(TELEMETRY_ARCHIVE_KEY);
  } catch {
    // 忽略
  }
};

/** R16：遥测存量统计——语法地图展示「可导出」状态，也为上限策略提供依据。 */
export interface GrammarTelemetryStats {
  activeEvents: number;
  maxEvents: number;
  archivedEvents: number;
  archiveMax: number;
  /** 当前主键是否已接近上限（≥80%），提示先导出归档。 */
  nearCapacity: boolean;
}

export const getGrammarTelemetryStats = (): GrammarTelemetryStats => {
  const activeEvents = listGrammarEvents().length;
  const archivedEvents = readArchivedEvents().length;
  return {
    activeEvents,
    maxEvents: MAX_EVENTS,
    archivedEvents,
    archiveMax: ARCHIVE_MAX_EVENTS,
    nearCapacity: activeEvents >= MAX_EVENTS * 0.8
  };
};

/** R16：导出快照（JSON 字符串）——含归档，供基线与 W4/D1 复盘使用。 */
export const buildGrammarTelemetryExport = (): string => {
  const events = listGrammarEvents();
  const archived = readArchivedEvents();
  const lastEventAt = events.length > 0 ? (events[events.length - 1] as { ts?: string }).ts ?? null : null;
  return JSON.stringify(
    {
      version: 1,
      exportedAt: nowIso(),
      stats: { ...getGrammarTelemetryStats(), lastEventAt },
      events,
      archivedEvents: archived
    },
    null,
    2
  );
};

export interface GrammarTelemetrySummary {
  totalEvents: number;
  completions: number;
  /** 完课中引导题全一次通过的比例（0-1）。 */
  guidedFirstTryRate: number;
  /** 完课中练习题全一次通过的比例（0-1）。 */
  practiceFirstTryRate: number;
  expandedDeepDiveLessonIds: string[];
  huntVerdicts: { hit: number; wrongTag: number; notError: number; alreadyFound: number };
  /** 误报率：点在没问题的词上的比例（分母 = hit + wrongTag + notError）。 */
  huntFalsePositiveRate: number;
  /** R19：侦探结算汇总——破案率终于可算（此前只有 verdict，无结算）。 */
  huntSettled: { cases: number; solved: number; solveRate: number };
  /** R20：段级停留汇总——各段累计停留与样本数（均值 = totalMs / samples），对照六段预算表。 */
  sectionDwell: Partial<Record<LessonSection, { totalMs: number; samples: number }>>;
  diaryTagCounts: Partial<Record<GrammarErrorTag, number>>;
  /** R05：漏斗第一环——进入路径页 → 7 天内进课。 */
  pathFunnel: { views: number; firstVisitViews: number; pathToLessonWithin7d: number; pathToLessonRate7d: number };
  /** 「趁热练」参与率与分层漏斗（2026-09-18 PRD §3）；样本未积累时各率为 0。 */
  boost: GrammarBoostSummary;
}

/** 「趁热练」汇总口径：参与率 / 分层漏斗 / 放弃率 / 难度落位 / AI 使用与降级。 */
export interface GrammarBoostSummary {
  /** 曝光次数（按 lessonId+entryPoint 去重后的事件条数）。 */
  offered: number;
  /** 入口拆分：结算页 / 卡片档位条 / 重审完成页。 */
  offeredByEntry: Record<GrammarBoostOfferedEvent["entryPoint"], number>;
  started: number;
  /** 参与率 = started / offered（曝光为 0 时为 0）。 */
  startRate: number;
  /** 参与率分子按入口拆分——判断哪个入口真的带来进入。 */
  startedByEntry: Record<GrammarBoostStartedEvent["entryPoint"], number>;
  /** 各档完成数（tier → 次数）。 */
  completedByTier: Record<1 | 2 | 3, number>;
  /** 各档一次通过率（tier → 0-1；无样本为 0）。 */
  firstTryRateByTier: Record<1 | 2 | 3, number>;
  /** 档 1 完成 → 档 2 进入 / 档 2 完成 → 档 3 进入（PRD 漏斗门：≥80% / ≥50%）。 */
  funnel: { tier1ToTier2: number; tier2ToTier3: number };
  abandoned: number;
  /** 放弃率 = abandoned / started。 */
  abandonRate: number;
  /** AI 批改使用率 = 带 aiUsed 的完成 / 档 3 完成。 */
  aiUsedRate: number;
  /** AI 降级率 = degraded / ai_result（无样本为 0）。 */
  aiDegradedRate: number;
  /** 素材重复率 = item_repeat / step_result。 */
  itemRepeatRate: number;
}


/** 汇总遥测：M1 决策门指标（完成率/一次通过率/展开率/误报率）都从这里读。 */
export const summarizeGrammarTelemetry = (): GrammarTelemetrySummary => {
  const events = listGrammarEvents();
  const completions = events.filter(
    (event): event is GrammarLessonCompletedEvent => event.kind === "grammar_lesson_completed"
  );
  const guidedFirstTryCount = completions.filter((event) => event.guidedFirstTry).length;
  const practiceFirstTryCount = completions.filter((event) => event.practiceFirstTry).length;

  const expandedLessonIds = new Set(
    events
      .filter((event): event is DeepDiveExpandedEvent => event.kind === "deep_dive_expanded")
      .map((event) => event.lessonId)
  );

  const huntVerdicts = { hit: 0, wrongTag: 0, notError: 0, alreadyFound: 0 };
  for (const event of events) {
    if (event.kind === "hunt_verdict") huntVerdicts[event.verdictKind] += 1;
  }
  const judged = huntVerdicts.hit + huntVerdicts.wrongTag + huntVerdicts.notError;

  const diaryTagCounts: Partial<Record<GrammarErrorTag, number>> = {};
  for (const event of events) {
    if (event.kind === "diary_issue_tag") {
      diaryTagCounts[event.tag] = (diaryTagCounts[event.tag] ?? 0) + 1;
    }
  }

  const settled = events.filter((event): event is HuntCaseSettledEvent => event.kind === "hunt_case_settled");
  const solvedCount = settled.filter((event) => event.solved).length;

  // R05：漏斗第一环聚合——进入路径页次数、首访态（lessonsDone=0）次数、以及进入后 7 天内进首课的次数。
  const pathViews = events.filter((event): event is GrammarPathViewedEvent => event.kind === "grammar_path_viewed");
  const firstVisitViews = pathViews.filter((event) => event.lessonsDone === 0);
  const lessonStarts = events.filter(
    (event): event is GrammarLessonStartedEvent => event.kind === "grammar_lesson_started"
  );
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  let pathToLesson7d = 0;
  for (const view of pathViews) {
    const viewTs = Date.parse(view.ts);
    if (!Number.isFinite(viewTs)) continue;
    const started = lessonStarts.some((start) => {
      const startTs = Date.parse(start.ts);
      return Number.isFinite(startTs) && startTs >= viewTs && startTs - viewTs <= SEVEN_DAYS_MS;
    });
    if (started) pathToLesson7d += 1;
  }

  // R20：段级停留聚合——总停留与样本数，供六段预算核验（均值 = totalMs / samples）
  const sectionDwell: Partial<Record<LessonSection, { totalMs: number; samples: number }>> = {};
  for (const event of events) {
    if (event.kind === "section_dwell") {
      const bucket = sectionDwell[event.section] ?? { totalMs: 0, samples: 0 };
      bucket.totalMs += event.dwellMs;
      bucket.samples += 1;
      sectionDwell[event.section] = bucket;
    }
  }

  return {
    totalEvents: events.length,
    completions: completions.length,
    guidedFirstTryRate: completions.length === 0 ? 0 : guidedFirstTryCount / completions.length,
    practiceFirstTryRate: completions.length === 0 ? 0 : practiceFirstTryCount / completions.length,
    expandedDeepDiveLessonIds: [...expandedLessonIds],
    huntVerdicts,
    huntFalsePositiveRate: judged === 0 ? 0 : huntVerdicts.notError / judged,
    huntSettled: {
      cases: settled.length,
      solved: solvedCount,
      solveRate: settled.length === 0 ? 0 : solvedCount / settled.length
    },
    sectionDwell,
    diaryTagCounts,
    pathFunnel: {
      views: pathViews.length,
      firstVisitViews: firstVisitViews.length,
      pathToLessonWithin7d: pathToLesson7d,
      pathToLessonRate7d: pathViews.length === 0 ? 0 : pathToLesson7d / pathViews.length
    },
    boost: summarizeBoost(events)
  };
};

/**
 * 「趁热练」汇总（2026-09-18 PRD §3 指标口径）。
 * 关键设计：offered 已按 lessonId+entryPoint 去重（写入侧防抖），started 按 tier 归集，
 * 一次通过率按 grammar_boost_step_result.passed && attempts<=1 计算。
 */
const summarizeBoost = (events: GrammarTelemetryEvent[]): GrammarBoostSummary => {
  const offeredEvents = events.filter(
    (event): event is GrammarBoostOfferedEvent => event.kind === "grammar_boost_offered"
  );
  const startedEvents = events.filter(
    (event): event is GrammarBoostStartedEvent => event.kind === "grammar_boost_started"
  );
  const completedEvents = events.filter(
    (event): event is GrammarBoostCompletedEvent => event.kind === "grammar_boost_completed"
  );
  const stepEvents = events.filter(
    (event): event is GrammarBoostStepResultEvent =>
      event.kind === "grammar_boost_step_result" && !event.sourceRef.startsWith("self-eval:")
  );
  const aiEvents = events.filter(
    (event): event is GrammarBoostAiResultEvent => event.kind === "grammar_boost_ai_result"
  );

  const offeredByEntry: Record<GrammarBoostOfferedEvent["entryPoint"], number> = { settlement: 0, card: 0, reaudit: 0 };
  for (const event of offeredEvents) offeredByEntry[event.entryPoint] += 1;

  const startedByEntry: Record<GrammarBoostStartedEvent["entryPoint"], number> = {
    settlement: 0,
    card: 0,
    reaudit: 0,
    direct: 0
  };
  for (const event of startedEvents) startedByEntry[event.entryPoint] += 1;

  const completedByTier: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
  const firstTryByTier: Record<1 | 2 | 3, { passed: number; total: number }> = {
    1: { passed: 0, total: 0 },
    2: { passed: 0, total: 0 },
    3: { passed: 0, total: 0 }
  };
  for (const event of completedEvents) {
    completedByTier[event.tier] += 1;
    firstTryByTier[event.tier].passed += event.firstTryCount;
    firstTryByTier[event.tier].total += event.total;
  }

  const abandonedEvents = events.filter(
    (event): event is GrammarBoostAbandonedEvent => event.kind === "grammar_boost_abandoned"
  );
  const repeatEvents = events.filter(
    (event): event is GrammarBoostItemRepeatEvent => event.kind === "grammar_boost_item_repeat"
  );

  const tier3Completed = completedEvents.filter((event) => event.tier === 3);
  const tier3WithAi = tier3Completed.filter((event) => event.aiUsed).length;
  const aiDegraded = aiEvents.filter((event) => event.degraded).length;

  const rate = (numerator: number, denominator: number) => (denominator === 0 ? 0 : numerator / denominator);

  return {
    offered: offeredEvents.length,
    offeredByEntry,
    started: startedEvents.length,
    startRate: rate(startedEvents.length, offeredEvents.length),
    startedByEntry,
    completedByTier,
    firstTryRateByTier: {
      1: rate(firstTryByTier[1].passed, firstTryByTier[1].total),
      2: rate(firstTryByTier[2].passed, firstTryByTier[2].total),
      3: rate(firstTryByTier[3].passed, firstTryByTier[3].total)
    },
    funnel: {
      tier1ToTier2: rate(
        startedEvents.filter((event) => event.tier === 2).length,
        completedByTier[1]
      ),
      tier2ToTier3: rate(
        startedEvents.filter((event) => event.tier === 3).length,
        completedByTier[2]
      )
    },
    abandoned: abandonedEvents.length,
    abandonRate: rate(abandonedEvents.length, startedEvents.length),
    aiUsedRate: rate(tier3WithAi, tier3Completed.length),
    aiDegradedRate: rate(aiDegraded, aiEvents.length),
    itemRepeatRate: rate(repeatEvents.length, stepEvents.length)
  };
};
