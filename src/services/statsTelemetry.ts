import { nowIso } from "./storage";

/**
 * 统计模块遥测（PRD-stats R15，schema v1）。
 *
 * 复刻 grammarTelemetry 模式：
 * - 独立 localStorage 键空间，不进入 AppData / 迁移 / 导出流程，旁路记录零侵入；
 * - 只追加（append-only），上限 1000 条，超出丢弃最旧的（统计事件频率低，不设归档）；
 * - 环境无 localStorage（单测 / node）时退化为内存数组，接口不变；
 * - 写失败静默，绝不影响页面主流程；
 * - 事件字段口径若变更，升级 schemaVersion（v1 → v2），历史数据可区分。
 *
 * 一期只采集 2 个事件，回答两个最根本的问题：
 * 周报页有没有人看（stats_page_viewed）、看完有没有去练（stats_action_clicked）。
 */

const TELEMETRY_KEY = "stats-telemetry-events-v1";
const MAX_EVENTS = 1000;

/** 周报页曝光：附上下文快照，便于按健康度/负债分层分析。 */
export interface StatsPageViewedEvent {
  kind: "stats_page_viewed";
  schemaVersion: 1;
  ts: string;
  healthScore: number;
  dueTotal: number;
  weakWords: number;
  streak: number;
}

/** 行动点击：验证"建议→行动"转化的核心事件。 */
export interface StatsActionClickedEvent {
  kind: "stats_action_clicked";
  schemaVersion: 1;
  ts: string;
  /** 入口标识：primary / plan / risk / wrong_word / wrong_all（R6 入口收敛后集合；schema 不变，仍 v1）。 */
  actionId: string;
  /** 跳转目标路由。 */
  target: string;
  /** 在所属列表中的位置（0 起）。 */
  position?: number;
  healthScore: number;
  dueTotal: number;
}

export type StatsTelemetryEvent = StatsPageViewedEvent | StatsActionClickedEvent;

const memoryEvents: StatsTelemetryEvent[] = [];

const hasLocalStorage = (): boolean => {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
};

const readEvents = (): StatsTelemetryEvent[] => {
  if (!hasLocalStorage()) return memoryEvents;
  try {
    const raw = window.localStorage.getItem(TELEMETRY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { events?: unknown };
    return Array.isArray(parsed.events) ? (parsed.events as StatsTelemetryEvent[]) : [];
  } catch {
    return [];
  }
};

const writeEvents = (events: StatsTelemetryEvent[]) => {
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

const appendStatsEvent = (event: StatsTelemetryEvent): void => {
  const events = readEvents();
  events.push(event);
  writeEvents(events.length > MAX_EVENTS ? events.slice(events.length - MAX_EVENTS) : events);
};

export const trackStatsPageViewed = (
  snapshot: Omit<StatsPageViewedEvent, "kind" | "schemaVersion" | "ts">
): void => {
  appendStatsEvent({ kind: "stats_page_viewed", schemaVersion: 1, ts: nowIso(), ...snapshot });
};

export const trackStatsActionClicked = (
  input: Omit<StatsActionClickedEvent, "kind" | "schemaVersion" | "ts">
): void => {
  appendStatsEvent({ kind: "stats_action_clicked", schemaVersion: 1, ts: nowIso(), ...input });
};

export const listStatsEvents = (): StatsTelemetryEvent[] => [...readEvents()];

export const clearStatsTelemetry = (): void => {
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

/** 导出快照（JSON 字符串）——供转化率复盘与阈值标定使用。 */
export const buildStatsTelemetryExport = (): string => {
  const events = listStatsEvents();
  return JSON.stringify(
    {
      version: 1,
      exportedAt: nowIso(),
      totalEvents: events.length,
      events
    },
    null,
    2
  );
};
