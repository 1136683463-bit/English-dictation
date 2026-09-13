import { nowIso } from "./storage";

/**
 * 词书板块遥测（PRD-wordbook-v2 P0-1）。
 *
 * 设计要点（复刻 grammarTelemetry 模式）：
 * - 独立 localStorage 键空间，不进入 AppData / 迁移 / 导出流程，旁路记录零侵入；
 * - 只追加（append-only），主键上限 3000 条，超出挪入归档键（R16 同款，防峰值期截断基线）；
 * - 环境无 localStorage（单测 / node）时退化为内存数组，接口不变；
 * - 遥测失败静默，绝不影响学习主流程。
 *
 * 事件清单（PRD §6 P0-1）：
 * - unit_created / import_started / import_previewed / import_confirmed —— 建书与导入漏斗；
 * - first_learning_after_create{lagHours} —— 首学转化时长（G1 验收口径）；
 * - review_session_started / review_session_completed —— 复习会话中途退出率；
 * - library_view{filter} / unit_detail_open —— 书架/词库浏览行为基线；
 * - daily_directive_started —— 指令卡 → 开学转化（P0-4）。
 */

const TELEMETRY_KEY = "vocab-telemetry-events-v1";
const MAX_EVENTS = 3000;
const TELEMETRY_ARCHIVE_KEY = "vocab-telemetry-archive-v1";
const ARCHIVE_MAX_EVENTS = 12000;

/** 词书来源：文件导入 / 自定义词书（批量粘贴）/ 手动新建。 */
export type UnitCreateSource = "file_import" | "custom_book" | "manual" | "builtin";

/** 复习会话模式（与 SpellingPage 队列模式对齐）。 */
export type VocabSessionMode = "standard" | "mistakes";

/** 建书事件：unit_created。 */
export interface UnitCreatedEvent {
  kind: "unit_created";
  unitId: string;
  source: UnitCreateSource;
  /** 本次建书批次的书名（用户输入的词书标题）。 */
  bookTitle: string;
  /** 同批次共创建几本（分章时 >1）。 */
  batchSize: number;
  wordCount: number;
  ts: string;
}

/** 导入漏斗起点：选中文件开始解析。 */
export interface ImportStartedEvent {
  kind: "import_started";
  fileName: string;
  format: "txt" | "csv" | "xlsx";
  ts: string;
}

/** 导入漏斗中段：解析完成、预览可见（含失败行数）。 */
export interface ImportPreviewedEvent {
  kind: "import_previewed";
  fileName: string;
  chapters: number;
  words: number;
  failRows: number;
  ts: string;
}

/** 导入漏斗终点：确认导入成功。 */
export interface ImportConfirmedEvent {
  kind: "import_confirmed";
  fileName: string;
  chapters: number;
  words: number;
  failRows: number;
  ts: string;
}

/** 首学转化：词书创建后第一次开始学习（G1 验收口径，lagHours ≤72 为达标）。 */
export interface FirstLearningAfterCreateEvent {
  kind: "first_learning_after_create";
  unitId: string;
  /** 创建 → 首次学习的小时数。 */
  lagHours: number;
  ts: string;
}

/** 复习会话开始：队列建成且非空。cardsPlanned = 初始队列长度。 */
export interface ReviewSessionStartedEvent {
  kind: "review_session_started";
  sessionId: string;
  mode: VocabSessionMode;
  unitId: string | null;
  cardsPlanned: number;
  ts: string;
}

/** 复习会话完成：队列全部练完。与 started 配对算中途退出率。 */
export interface ReviewSessionCompletedEvent {
  kind: "review_session_completed";
  sessionId: string;
  mode: VocabSessionMode;
  unitId: string | null;
  cardsPlanned: number;
  /** 实际完成的判题次数（含错词重练的重复判题）。 */
  cardsDone: number;
  /** 中途退出的对偶字段——正常完成为 false，预留显式中止标记。 */
  abandoned: boolean;
  durationMs: number;
  ts: string;
}

/** 词库浏览：LibraryPage 筛选条件曝光（浏览行为基线）。 */
export interface LibraryViewEvent {
  kind: "library_view";
  filter: string;
  ts: string;
}

/** 词书详情弹窗打开（选词/浏览漏斗中段）。 */
export interface UnitDetailOpenEvent {
  kind: "unit_detail_open";
  unitId: string;
  ts: string;
}

/** 每日指令卡点击「开始今日学习」（P0-4 验收：指令 → 开学转化）。 */
export interface DailyDirectiveStartedEvent {
  kind: "daily_directive_started";
  directiveKind: "backlog" | "wake" | "speedrun" | "normal";
  unitId: string | null;
  cardsPlanned: number;
  ts: string;
}

export type VocabTelemetryEvent =
  | UnitCreatedEvent
  | ImportStartedEvent
  | ImportPreviewedEvent
  | ImportConfirmedEvent
  | FirstLearningAfterCreateEvent
  | ReviewSessionStartedEvent
  | ReviewSessionCompletedEvent
  | LibraryViewEvent
  | UnitDetailOpenEvent
  | DailyDirectiveStartedEvent;

const memoryEvents: VocabTelemetryEvent[] = [];

const hasLocalStorage = (): boolean => {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
};

const readEvents = (): VocabTelemetryEvent[] => {
  if (!hasLocalStorage()) return memoryEvents;
  try {
    const raw = window.localStorage.getItem(TELEMETRY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { events?: unknown };
    return Array.isArray(parsed.events) ? (parsed.events as VocabTelemetryEvent[]) : [];
  } catch {
    return [];
  }
};

const writeEvents = (events: VocabTelemetryEvent[]) => {
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

/** 读取归档事件：主键溢出后长期留存的历史。 */
const readArchivedEvents = (): VocabTelemetryEvent[] => {
  if (!hasLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(TELEMETRY_ARCHIVE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { events?: unknown };
    return Array.isArray(parsed.events) ? (parsed.events as VocabTelemetryEvent[]) : [];
  } catch {
    return [];
  }
};

/** 把被挤出的旧事件追加进归档键（归档自身也有上限，滚动丢弃最旧）。 */
const archiveEvents = (overflow: VocabTelemetryEvent[]): void => {
  if (overflow.length === 0) return;
  if (!hasLocalStorage()) return;
  try {
    const archived = [...readArchivedEvents(), ...overflow];
    const kept = archived.length > ARCHIVE_MAX_EVENTS ? archived.slice(archived.length - ARCHIVE_MAX_EVENTS) : archived;
    window.localStorage.setItem(TELEMETRY_ARCHIVE_KEY, JSON.stringify({ version: 1, events: kept }));
  } catch {
    // 归档失败静默，不影响主流程。
  }
};

/** 追加一条遥测事件（超出主键上限时，最旧的事件移入归档键，不丢数据）。 */
export const appendVocabEvent = (event: VocabTelemetryEvent): void => {
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

export const listVocabEvents = (): VocabTelemetryEvent[] => [...readEvents()];

export const listVocabEventsByKind = <K extends VocabTelemetryEvent["kind"]>(
  kind: K
): Extract<VocabTelemetryEvent, { kind: K }>[] =>
  listVocabEvents().filter((event): event is Extract<VocabTelemetryEvent, { kind: K }> => event.kind === kind);

export const clearVocabTelemetry = (): void => {
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

/** 遥测存量统计——与 grammarTelemetry 同口径，供导出与上限预警。 */
export interface VocabTelemetryStats {
  activeEvents: number;
  maxEvents: number;
  archivedEvents: number;
  archiveMax: number;
  nearCapacity: boolean;
}

export const getVocabTelemetryStats = (): VocabTelemetryStats => {
  const activeEvents = listVocabEvents().length;
  const archivedEvents = readArchivedEvents().length;
  return {
    activeEvents,
    maxEvents: MAX_EVENTS,
    archivedEvents,
    archiveMax: ARCHIVE_MAX_EVENTS,
    nearCapacity: activeEvents >= MAX_EVENTS * 0.8
  };
};

/** P1-7（前移 W2）：导出快照（JSON 字符串）——含归档，供 30 天复盘使用。 */
export const buildVocabTelemetryExport = (): string => {
  const events = listVocabEvents();
  const archived = readArchivedEvents();
  const lastEventAt = events.length > 0 ? (events[events.length - 1] as { ts?: string }).ts ?? null : null;
  return JSON.stringify(
    {
      version: 1,
      exportedAt: nowIso(),
      stats: { ...getVocabTelemetryStats(), lastEventAt },
      events,
      archivedEvents: archived
    },
    null,
    2
  );
};

export interface VocabTelemetrySummary {
  totalEvents: number;
  unitsCreated: number;
  /** 按来源分的建书数。 */
  unitsCreatedBySource: Partial<Record<UnitCreateSource, number>>;
  /** 导入漏斗：开始 → 预览 → 确认。 */
  importFunnel: { started: number; previewed: number; confirmed: number };
  /** 首学转化：有 lagHours 记录的书数、72h 内转化率、平均滞后小时。 */
  firstLearning: { units: number; within72h: number; within72hRate: number; avgLagHours: number };
  /** 复习会话：开始数、完成数、中途退出率（started 无配对 completed）。 */
  reviewSessions: { started: number; completed: number; abandonmentRate: number };
  libraryViews: number;
  unitDetailOpens: number;
  /** 指令卡点击次数（按指令类型分）。 */
  directiveStarts: Partial<Record<DailyDirectiveStartedEvent["directiveKind"], number>>;
}

/** 汇总遥测：30 天复盘的验收指标都从这里读。 */
export const summarizeVocabTelemetry = (): VocabTelemetrySummary => {
  const events = listVocabEvents();

  const created = events.filter((event): event is UnitCreatedEvent => event.kind === "unit_created");
  const unitsCreatedBySource: Partial<Record<UnitCreateSource, number>> = {};
  for (const event of created) {
    unitsCreatedBySource[event.source] = (unitsCreatedBySource[event.source] ?? 0) + 1;
  }

  const importFunnel = { started: 0, previewed: 0, confirmed: 0 };
  for (const event of events) {
    if (event.kind === "import_started") importFunnel.started += 1;
    else if (event.kind === "import_previewed") importFunnel.previewed += 1;
    else if (event.kind === "import_confirmed") importFunnel.confirmed += 1;
  }

  const firstLearningEvents = events.filter(
    (event): event is FirstLearningAfterCreateEvent => event.kind === "first_learning_after_create"
  );
  const within72h = firstLearningEvents.filter((event) => event.lagHours <= 72).length;
  const totalLag = firstLearningEvents.reduce((sum, event) => sum + event.lagHours, 0);

  const sessionsStarted = events.filter(
    (event): event is ReviewSessionStartedEvent => event.kind === "review_session_started"
  );
  const sessionsCompleted = events.filter(
    (event): event is ReviewSessionCompletedEvent => event.kind === "review_session_completed"
  );
  const completedIds = new Set(sessionsCompleted.map((event) => event.sessionId));
  const abandoned = sessionsStarted.filter((event) => !completedIds.has(event.sessionId)).length;

  return {
    totalEvents: events.length,
    unitsCreated: created.length,
    unitsCreatedBySource,
    importFunnel,
    firstLearning: {
      units: firstLearningEvents.length,
      within72h,
      within72hRate: firstLearningEvents.length === 0 ? 0 : within72h / firstLearningEvents.length,
      avgLagHours: firstLearningEvents.length === 0 ? 0 : totalLag / firstLearningEvents.length
    },
    reviewSessions: {
      started: sessionsStarted.length,
      completed: sessionsCompleted.length,
      abandonmentRate: sessionsStarted.length === 0 ? 0 : abandoned / sessionsStarted.length
    },
    libraryViews: events.filter((event) => event.kind === "library_view").length,
    unitDetailOpens: events.filter((event) => event.kind === "unit_detail_open").length,
    directiveStarts: events
      .filter((event): event is DailyDirectiveStartedEvent => event.kind === "daily_directive_started")
      .reduce<Partial<Record<DailyDirectiveStartedEvent["directiveKind"], number>>>((acc, event) => {
        acc[event.directiveKind] = (acc[event.directiveKind] ?? 0) + 1;
        return acc;
      }, {})
  };
};
