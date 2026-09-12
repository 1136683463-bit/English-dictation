import type { GrammarErrorTag } from "../types";
import type { HuntVerdictKind } from "./huntService";

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

export type LessonSection = "watch" | "pretest" | "guided" | "practice" | "output";

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

export type GrammarTelemetryEvent =
  | GrammarLessonCompletedEvent
  | LessonStepResultEvent
  | DeepDiveExpandedEvent
  | HuntVerdictEvent
  | DiaryIssueTagEvent
  | GrammarReviewResultEvent;

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

/** 追加一条遥测事件（超出上限丢弃最旧的）。 */
export const appendGrammarEvent = (event: GrammarTelemetryEvent): void => {
  const events = readEvents();
  events.push(event);
  writeEvents(events.length > MAX_EVENTS ? events.slice(events.length - MAX_EVENTS) : events);
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
  } catch {
    // 忽略
  }
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

  return {
    totalEvents: events.length,
    completions: completions.length,
    guidedFirstTryRate: completions.length === 0 ? 0 : guidedFirstTryCount / completions.length,
    practiceFirstTryRate: completions.length === 0 ? 0 : practiceFirstTryCount / completions.length,
    expandedDeepDiveLessonIds: [...expandedLessonIds],
    huntVerdicts,
    huntFalsePositiveRate: judged === 0 ? 0 : huntVerdicts.notError / judged,
    diaryTagCounts
  };
};
