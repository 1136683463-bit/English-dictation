import { AppData, DataSyncSettings } from "../types";
import { parseBackupJson, restoreDataFromJson } from "./storage";
import { requestFetch } from "./aiHttpClient";

/**
 * Personal-server data sync.
 *
 * The full AppData snapshot is mirrored to a tiny user-run endpoint (see
 * scripts/sync-server.mjs). Last-write-wins: the side with the newer
 * timestamp wins, so switching browsers or devices just works as long as
 * every client points at the same sync URL and token.
 */

export interface RemoteSnapshotInfo {
  savedAt: string;
}

const normalizeSyncUrl = (baseUrl: string) => {
  const base = baseUrl.trim().replace(/\/+$/, "");
  try {
    const parsed = new URL(base);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("协议不支持");
  } catch {
    throw new Error("云同步地址无效，请填写 http(s):// 开头的服务地址。");
  }
  return base.endsWith("/sync") ? base : `${base}/sync`;
};

export const isDataSyncConfigured = (sync: DataSyncSettings) =>
  Boolean(sync.enabled && sync.baseUrl.trim());

const authHeaders = (sync: DataSyncSettings): Record<string, string> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (sync.token.trim()) headers.Authorization = `Bearer ${sync.token.trim()}`;
  return headers;
};

/**
 * The freshest entity timestamp in local data. Every mutable collection item
 * carries an ISO updatedAt, so the maximum is a cheap proxy for "when did
 * local data change last".
 */
export const latestLocalUpdatedAt = (data: AppData): string => {
  const collections = [
    data.unitGroups,
    data.units,
    data.cards,
    data.wordDetails,
    data.sentenceDetails,
    data.materials,
    data.materialSegments,
    data.reviews,
    data.adventures,
    data.schedules
  ];
  let latest = "";
  for (const collection of collections) {
    for (const item of collection ?? []) {
      const updatedAt = (item as { updatedAt?: unknown }).updatedAt;
      if (typeof updatedAt === "string" && updatedAt > latest) latest = updatedAt;
    }
  }
  return latest;
};

export const isLocalDataEmpty = (data: AppData) =>
  !data.cards.length
  && !data.adventures.length
  && !data.materials.length
  && !data.sentenceDetails.length;

/**
 * Decide which side should win before overwriting anything. A fresh browser
 * (empty local data) always pulls; otherwise the newer timestamp wins.
 */
export const resolveSyncDirection = (data: AppData, remoteSavedAt: string): "pull" | "push" => {
  if (!remoteSavedAt) return "push";
  if (isLocalDataEmpty(data)) return "pull";
  return remoteSavedAt > latestLocalUpdatedAt(data) ? "pull" : "push";
};

export const pushDataSnapshot = async (sync: DataSyncSettings, data: AppData): Promise<string> => {
  if (!isDataSyncConfigured(sync)) throw new Error("云同步没有配置或未启用。");
  const response = await requestFetch(normalizeSyncUrl(sync.baseUrl), {
    method: "POST",
    headers: authHeaders(sync),
    body: JSON.stringify({ payload: data })
  });
  const text = await response.text();
  let json: { savedAt?: unknown; error?: { message?: string } } = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("云同步服务返回了无法解析的响应，请检查同步服务是否正常。");
  }
  if (!response.ok) throw new Error(json.error?.message || `云同步上传失败：${response.status}`);
  return typeof json.savedAt === "string" ? json.savedAt : "";
};

/**
 * R02：只拉取并解析云端快照，不写 localStorage——供设置页"从云端恢复"
 * 先展示预览、用户确认后再提交。要直接落盘请用 pullDataSnapshot。
 */
export const fetchRemoteSnapshot = async (
  sync: DataSyncSettings
): Promise<{ savedAt: string; data: AppData } | null> => {
  if (!isDataSyncConfigured(sync)) throw new Error("云同步没有配置或未启用。");
  const response = await requestFetch(normalizeSyncUrl(sync.baseUrl), {
    method: "GET",
    headers: authHeaders(sync)
  });
  if (response.status === 404) return null;
  const text = await response.text();
  let json: { savedAt?: unknown; payload?: unknown; error?: { message?: string } } = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("云同步服务返回了无法解析的响应，请检查同步服务是否正常。");
  }
  if (!response.ok) throw new Error(json.error?.message || `云同步下载失败：${response.status}`);
  if (!json.payload || typeof json.payload !== "object") return null;
  // 与手动 JSON 备份同一条迁移管线，但不持久化。
  const parsed = parseBackupJson(JSON.stringify(json.payload));
  return { savedAt: typeof json.savedAt === "string" ? json.savedAt : "", data: parsed };
};

export const pullDataSnapshot = async (
  sync: DataSyncSettings
): Promise<{ savedAt: string; data: AppData } | null> => {
  if (!isDataSyncConfigured(sync)) throw new Error("云同步没有配置或未启用。");
  const response = await requestFetch(normalizeSyncUrl(sync.baseUrl), {
    method: "GET",
    headers: authHeaders(sync)
  });
  if (response.status === 404) return null;
  const text = await response.text();
  let json: { savedAt?: unknown; payload?: unknown; error?: { message?: string } } = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("云同步服务返回了无法解析的响应，请检查同步服务是否正常。");
  }
  if (!response.ok) throw new Error(json.error?.message || `云同步下载失败：${response.status}`);
  if (!json.payload || typeof json.payload !== "object") return null;
  // restoreDataFromJson migrates and normalizes the payload through the same
  // pipeline used by manual JSON backups, then persists it to localStorage.
  const restored = restoreDataFromJson(JSON.stringify(json.payload));
  return { savedAt: typeof json.savedAt === "string" ? json.savedAt : "", data: restored };
};

export const describeSyncError = (error: unknown) => {
  if (error instanceof Error) {
    if (/load failed|failed to fetch|networkerror|network request failed/i.test(error.message)) {
      return "无法连接云同步服务（可能是网络、CORS 或地址不可达）。请确认服务已启动并在设置中检查地址。";
    }
    return error.message;
  }
  return "云同步失败，请检查网络和服务地址。";
};
