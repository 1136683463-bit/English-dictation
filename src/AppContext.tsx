import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppData } from "./types";
import { loadData, markDataSyncedBackup, resetData, saveData } from "./services/storage";
import {
  describeSyncError,
  isDataSyncConfigured,
  pullDataSnapshot,
  pushDataSnapshot,
  resolveSyncDirection
} from "./services/syncService";

export interface DataSyncStatus {
  state: "idle" | "syncing" | "ok" | "error";
  message: string;
}

interface AppContextValue {
  data: AppData;
  setData: (next: AppData) => void;
  updateData: (updater: (data: AppData) => AppData) => void;
  updateDataAsync: <Result extends { data: AppData }>(
    updater: (data: AppData) => Promise<Result>
  ) => Promise<Result>;
  reset: () => void;
  dataSyncStatus: DataSyncStatus;
  setDataSyncStatus: (status: DataSyncStatus) => void;
  markDataSynced: (data: AppData) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const AUTO_PUSH_DELAY_MS = 3000;

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setDataState] = useState<AppData>(() => loadData());
  const dataRef = useRef(data);
  const asyncUpdateQueueRef = useRef<Promise<void>>(Promise.resolve());
  const lastSyncedJsonRef = useRef<string | null>(null);
  const autoPushTimerRef = useRef<number | null>(null);
  const [dataSyncStatus, setDataSyncStatus] = useState<DataSyncStatus>({ state: "idle", message: "" });

  const commitData = (next: AppData) => {
    dataRef.current = next;
    setDataState(next);
    saveData(next);
  };

  // R03：一次成功的云同步 = 一次有效备份。提交时写入 lastSyncedAt，
  // 并把 lastSyncedJsonRef 对齐到写入后的快照，防止自动推送死循环。
  const commitSyncedData = (synced: AppData, syncedAt?: string) => {
    const marked = markDataSyncedBackup(synced, syncedAt);
    commitData(marked);
    lastSyncedJsonRef.current = JSON.stringify(marked);
  };

  const waitForQueuedUpdates = () => asyncUpdateQueueRef.current.catch(() => undefined);

  const value = useMemo<AppContextValue>(
    () => ({
      data,
      setData(next) {
        commitData(next);
      },
      updateData(updater) {
        const run = waitForQueuedUpdates().then(() => {
          const next = updater(dataRef.current);
          commitData(next);
        });
        asyncUpdateQueueRef.current = run.then(
          () => undefined,
          () => undefined
        );
      },
      updateDataAsync(updater) {
        const run = waitForQueuedUpdates().then(async () => {
          const result = await updater(dataRef.current);
          commitData(result.data);
          return result;
        });
        asyncUpdateQueueRef.current = run.then(
          () => undefined,
          () => undefined
        );
        return run;
      },
      reset() {
        commitData(resetData());
      },
      dataSyncStatus,
      setDataSyncStatus,
      markDataSynced(next) {
        lastSyncedJsonRef.current = JSON.stringify(next);
      }
    }),
    [data, dataSyncStatus]
  );

  // Startup reconciliation: compare the cloud snapshot with local data and
  // let the newer side win. A fresh browser (empty local data) always pulls,
  // so opening the app in a new browser restores everything automatically.
  useEffect(() => {
    const sync = dataRef.current.settings.dataSync;
    if (!isDataSyncConfigured(sync)) return;
    let cancelled = false;
    setDataSyncStatus({ state: "syncing", message: "正在检查云端数据..." });
    (async () => {
      try {
        const remote = await pullDataSnapshot(sync);
        if (cancelled) return;
        if (!remote) {
          const savedAt = await pushDataSnapshot(sync, dataRef.current);
          if (cancelled) return;
          commitSyncedData(dataRef.current, savedAt || undefined);
          setDataSyncStatus({ state: "ok", message: "云端还没有数据，已把本地数据上传到云端。" });
          return;
        }
        if (resolveSyncDirection(dataRef.current, remote.savedAt) === "pull") {
          commitSyncedData(remote.data, remote.savedAt || undefined);
          if (cancelled) return;
          setDataSyncStatus({ state: "ok", message: "已从云端恢复最新数据。" });
        } else {
          const savedAt = await pushDataSnapshot(sync, dataRef.current);
          if (cancelled) return;
          commitSyncedData(dataRef.current, savedAt || undefined);
          setDataSyncStatus({ state: "ok", message: "本地数据较新，已上传到云端。" });
        }
      } catch (error) {
        if (!cancelled) setDataSyncStatus({ state: "error", message: describeSyncError(error) });
      }
    })();
    return () => {
      cancelled = true;
    };
    // Run once on mount; later configuration changes go through the push
    // effect below and the settings page's manual buttons.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced auto-push: every local change reaches the cloud a few seconds
  // after it settles. Changes that came back from the cloud are marked as
  // synced and skipped, so the loop terminates.
  useEffect(() => {
    const sync = data.settings.dataSync;
    if (!isDataSyncConfigured(sync)) return;
    const json = JSON.stringify(data);
    if (lastSyncedJsonRef.current === json) return;
    if (autoPushTimerRef.current) window.clearTimeout(autoPushTimerRef.current);
    autoPushTimerRef.current = window.setTimeout(() => {
      setDataSyncStatus({ state: "syncing", message: "正在同步到云端..." });
      pushDataSnapshot(sync, dataRef.current)
        .then((savedAt) => {
          commitSyncedData(dataRef.current, savedAt || undefined);
          setDataSyncStatus({ state: "ok", message: "已自动同步到云端。" });
        })
        .catch((error) => {
          setDataSyncStatus({ state: "error", message: describeSyncError(error) });
        });
    }, AUTO_PUSH_DELAY_MS);
    return () => {
      if (autoPushTimerRef.current) window.clearTimeout(autoPushTimerRef.current);
    };
  }, [data]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppData = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppData must be used inside AppProvider");
  return context;
};
