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

export type LessonSection = "watch" | "pretest" | "guided" | "recall" | "practice" | "output";

/** 进课事件（R21）：漏斗的起点——没有它无法计算「进入 → 完课」流失。每次进入课程记一条。 */
export interface GrammarLessonStartedEvent {
  kind: "grammar_lesson_started";
  lessonId: string;
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
  mode: "cloze" | "rebuild";
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
  | HuntHintUsedEvent;

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
  diaryTagCounts: Partial<Record<GrammarErrorTag, number>>;
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
    diaryTagCounts
  };
};
