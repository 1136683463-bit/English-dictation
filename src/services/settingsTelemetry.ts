import { nowIso } from "./storage";

/**
 * 设置板块遥测（PRD-settings-ux R01 配套埋点）。
 *
 * 复刻 grammarTelemetry 的本地优先模式：
 * - 独立 localStorage 键空间，不进 AppData / 迁移 / 导出流程；
 * - 只追加，上限 1000 条，超出丢弃最旧的；
 * - 无 localStorage 环境（单测 / node）退化为内存数组；
 * - 只记录字段名，绝不记录字段值（API Key、令牌等敏感值不上报）。
 */

const TELEMETRY_KEY = "settings-telemetry-events-v1";
const MAX_EVENTS = 1000;

/** 设置页被打开。 */
export interface SettingsViewEvent {
  kind: "settings_view";
  ts: string;
}

/** 某个顶层设置字段被修改（只记字段名，不记值）。 */
export interface SettingsFieldChangeEvent {
  kind: "settings_field_change";
  field: string;
  ts: string;
}

/** 一次自动保存落盘结果——G1「保存成功率」的分子分母来源。 */
export interface SettingsAutosaveEvent {
  kind: "settings_autosave";
  fields: string[];
  success: boolean;
  ts: string;
}

export type SettingsTelemetryEvent =
  | SettingsViewEvent
  | SettingsFieldChangeEvent
  | SettingsAutosaveEvent
  | SettingsDangerOpEvent;

/** R02：危险操作（恢复 JSON / 云端恢复 / 重置）的确认与取消——取消率即防呆有效性。 */
export interface SettingsDangerOpEvent {
  kind: "settings_danger_op";
  op: "restore_json" | "pull_cloud" | "reset_local";
  confirmed: boolean;
  ts: string;
}

const memoryEvents: SettingsTelemetryEvent[] = [];

const hasLocalStorage = (): boolean => {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
};

const readEvents = (): SettingsTelemetryEvent[] => {
  if (!hasLocalStorage()) return memoryEvents;
  try {
    const raw = window.localStorage.getItem(TELEMETRY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { events?: unknown };
    return Array.isArray(parsed.events) ? (parsed.events as SettingsTelemetryEvent[]) : [];
  } catch {
    return [];
  }
};

const writeEvents = (events: SettingsTelemetryEvent[]) => {
  if (!hasLocalStorage()) {
    memoryEvents.length = 0;
    memoryEvents.push(...events);
    return;
  }
  try {
    window.localStorage.setItem(TELEMETRY_KEY, JSON.stringify({ version: 1, events }));
  } catch {
    // 存储满 / 隐私模式：遥测失败静默，绝不影响设置主流程。
  }
};

export const appendSettingsEvent = (event: SettingsTelemetryEvent): void => {
  const events = readEvents();
  events.push(event);
  writeEvents(events.length > MAX_EVENTS ? events.slice(events.length - MAX_EVENTS) : events);
};

export const trackSettingsView = (): void => {
  appendSettingsEvent({ kind: "settings_view", ts: nowIso() });
};

export const trackSettingsFieldChange = (field: string): void => {
  appendSettingsEvent({ kind: "settings_field_change", field, ts: nowIso() });
};

export const trackSettingsAutosave = (fields: string[], success: boolean): void => {
  appendSettingsEvent({ kind: "settings_autosave", fields, success, ts: nowIso() });
};

export const trackSettingsDangerOp = (
  op: "restore_json" | "pull_cloud" | "reset_local",
  confirmed: boolean
): void => {
  appendSettingsEvent({ kind: "settings_danger_op", op, confirmed, ts: nowIso() });
};

export const listSettingsEvents = (): SettingsTelemetryEvent[] => [...readEvents()];

export const clearSettingsTelemetry = (): void => {
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

/** P1-7：导出快照（JSON 字符串）——含时间戳与事件全字段，与 grammar/vocab 遥测导出同构。 */
export const buildSettingsTelemetryExport = (): string => {
  const events = listSettingsEvents();
  const lastEventAt = events.length > 0 ? events[events.length - 1].ts ?? null : null;
  return JSON.stringify(
    {
      version: 1,
      exportedAt: nowIso(),
      stats: { activeEvents: events.length, maxEvents: MAX_EVENTS, lastEventAt },
      events
    },
    null,
    2
  );
};

/** 汇总：保存成功率与字段修改分布，供 G1/G2 复盘读取。 */
export const summarizeSettingsTelemetry = () => {
  const events = listSettingsEvents();
  const autosaves = events.filter((event) => event.kind === "settings_autosave");
  const succeeded = autosaves.filter((event) => event.success).length;
  const fieldCounts: Record<string, number> = {};
  for (const event of events) {
    if (event.kind === "settings_field_change") {
      fieldCounts[event.field] = (fieldCounts[event.field] ?? 0) + 1;
    }
  }
  return {
    views: events.filter((event) => event.kind === "settings_view").length,
    autosaveAttempts: autosaves.length,
    autosaveSuccessRate: autosaves.length === 0 ? 1 : succeeded / autosaves.length,
    fieldChangeCounts: fieldCounts
  };
};
