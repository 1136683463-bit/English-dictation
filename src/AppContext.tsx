import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppData } from "./types";
import {
  loadData,
  markDataSyncedBackup,
  parseStoredSnapshot,
  readStoredSnapshot,
  resetData,
  saveData,
  serializeForSave,
  storageCostBytes,
  STORAGE_SOFT_LIMIT_BYTES
} from "./services/storage";
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
  /**
   * 落盘失败的提示（null = 正常）。由 `commitData` 的 try/catch 设置，
   * 界面据此显示醒目告警——否则配额满时用户会以为改动已生效。
   */
  saveError: string | null;
  /**
   * 检测到**另一个窗口**改动过同一份数据（null = 无冲突）。
   *
   * R10 多窗口修复：localStorage 是同源的，两个窗口（Tauri 多窗口 / 浏览器多标签）
   * 各持一份内存态。函数式更新会自动与对方的数据**合并**，所以正常情况下
   * 用户什么都不用做；只有「整份替换」类操作（导入/重置/恢复备份）无法合并时，
   * 才用这条提示说明「本次以你为准，对方那一份没被合并」。
   */
  crossWindowNotice: string | null;
  dismissCrossWindowNotice: () => void;
  /**
   * 接近存储上限的提示（null = 正常）。
   *
   * R11：此前这个判断只在设置页算，而设置页用户很少去——
   * 从软上限到真正写不下只有约 43 天。现在每次保存后顺带更新，
   * 由 `App` 以全局横幅展示，用户在任何页面都能看到。
   */
  storagePressure: string | null;
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

  /**
   * 落盘失败必须让用户知道（2026-09-22 修，P0）。
   *
   * 此前 `commitData` 直接 `saveData(next)` 且**没有 try/catch**：
   * 存储写不下（配额满）时，`setDataState` 已经把新数据放进内存、界面显示「已生效」，
   * 而磁盘上还是旧的——**内存与磁盘永久分叉**，此后每次操作都同样静默失败，
   * 用户直到下次重启才会发现数据回退了，还不知道原因。
   *
   * 现在把失败暴露成状态（界面以醒目样式展示），并给出可执行的建议
   * （先导出备份、再清理空间），而不是只进 console。
   */
  const [saveError, setSaveError] = useState<string | null>(null);

  /**
   * R10 多窗口一致性：记住「我上次写进磁盘的是什么」。
   *
   * localStorage 是同源的——Tauri 的多个窗口、浏览器的多个标签，各自持有一份内存态，
   * 但共用同一份存储。此前每次写入都是「整份覆盖」，于是后写的一方**整体胜出**：
   * 实测一个窗口导入 50 张卡后，另一个窗口只改一个设置，那 50 张卡就被整份抹掉，
   * 且磁盘上只留最后一份赢家的快照，**不可恢复**。
   *
   * 初值取「刚启动时磁盘上的实际内容」（`loadData` 已经写过一次），
   * 这样第一次提交就能识别「加载之后有别人写过」。
   *
   * 注意用 `useState` 的惰性初值而不是 `useRef(readStoredSnapshot())`：
   * 后者每次渲染都会执行一次读取（只是丢掉了结果），是白白付出的
   * localStorage 同步读开销。
   */
  const [initialWrittenJson] = useState<string | null>(() => readStoredSnapshot());
  const lastWrittenJsonRef = useRef<string | null>(initialWrittenJson);
  const [crossWindowNotice, setCrossWindowNotice] = useState<string | null>(null);

  /**
   * 磁盘内容是否已被**另一个窗口**改过。
   * 返回对方写入的 JSON；认定「不是别人写的」时返回 null。
   *
   * 三种情况不算冲突：
   *  ① 读不到（存储被禁用/清空）——无从判断，按自己的写。
   *  ② 与我上次写入的逐字相同——没人动过。
   *  ③ **与本次即将写入的内容相同**——`resetData()` / `restoreDataFromJson()`
   *     这类函数**自己就会写盘**，所以 `commitData(resetData())` 走到这里时，
   *     磁盘上已经是本次要写的内容了。若不排除，单窗口点一次「重置」就会弹出
   *     「另一个窗口改过数据」的假告警（实测确认过）。
   *
   * `baseline` 是「本次操作开始前的磁盘快照」。整份替换类入口必须先采集它：
   * `resetData()` 内部会先写一份初始数据，那份写入会**盖掉别人留下的证据**，
   * 事后无法再判断有没有过冲突。传 undefined 表示「不需要，直接读当前值」。
   *
   * `intendedJson` 用**惰性函数**传入（R11 性能修正）：`serializeForSave` 要
   * `JSON.stringify` 整份数据，而绝大多数提交根本没有别的窗口在写——
   * 那种情况下前两道判定就已经返回 null，不该白付一次序列化。
   * 改成函数后，只有真需要比对第③条时才求值。
   */
  const otherWindowSnapshot = (intendedJson: () => string, baseline?: string | null): string | null => {
    const current = baseline === undefined ? readStoredSnapshot() : baseline;
    if (current === null) return null;
    if (current === lastWrittenJsonRef.current) return null;
    if (current === intendedJson()) return null;
    return current;
  };

  /** 采集磁盘快照——给会在内部写盘的入口用（必须在副作用之前调用）。 */
  const snapshotBeforeSideEffects = (): string | null => readStoredSnapshot();

  const [storagePressure, setStoragePressure] = useState<string | null>(null);

  /**
   * 由**存储中的 JSON 字符串**换算存储压力（R11）。
   *
   * `refreshStoragePressure(readStoredSnapshot())` 在挂载时跑一次很重要：
   * 用户可能在**上次会话**里就已经接近上限，然后关掉应用；
   * 若只在「保存之后」才会更新，那本次打开到第一次操作之间是没有任何提示的，
   * 而用户完全可能先看到「答完这题没保存成功」才发现问题。
   *
   * 传字符串而不是自己在函数里读 localStorage，是为了让调用方决定何时读：
   * 保存路径复用 `saveData` 的返回值（零额外序列化、零额外读盘），
   * 挂载路径才真的读一次。
   *
   * 阈值用 `STORAGE_SOFT_LIMIT_BYTES`（4MB，最坏情况账单），
   * 即在 WebKit 上约等于真实容量（4.96MB）的 81%，留出约 43 天缓冲。
   */
  const refreshStoragePressure = (writtenJson: string | null) => {
    const overLimit = writtenJson !== null && storageCostBytes(writtenJson) > STORAGE_SOFT_LIMIT_BYTES;
    setStoragePressure((current) => {
      // 只在状态真的翻转时更新，避免每次保存都触发一次重渲染。
      if (overLimit && current === null) {
        return "本地数据已经接近存储上限。建议导出备份，并到「数据与安全」用「归档久远明细腾空间」——它保留进度，只是把久远明细压成每日汇总。";
      }
      if (!overLimit && current !== null) return null;
      return current;
    });
  };

  /**
   * 落盘。
   *
   * `replay` 是 R10 的关键：函数式更新（`updateData`）的 updater 是纯函数，
   * 所以当发现「另一个窗口在中间写过」时，我们**把同一个 updater 重新应用到对方的数据上**，
   * 而不是覆盖掉——两边的改动都保留。这正是「两个窗口交替学习」不再丢进度的原因。
   *
   * 整份替换类操作（导入备份 / 重置 / 从云端恢复）无法合并，此时以本次为准，
   * 并通过 `crossWindowNotice` 如实告知用户对方的改动没被合并（不静默吞掉）。
   */
  const commitData = (
    next: AppData,
    replay?: (base: AppData) => AppData,
    baseline?: string | null,
    options?: { silent?: boolean }
  ) => {
    let toWrite = next;
    const otherJson = otherWindowSnapshot(() => serializeForSave(next), baseline);
    if (otherJson !== null) {
      const otherData = parseStoredSnapshot(otherJson);
      if (otherData) {
        if (replay) {
          // 在对方的最新数据上重放本次意图 → 双方都保留
          toWrite = replay(otherData);
        } else if (!options?.silent) {
          setCrossWindowNotice(
            "另一个窗口刚改过数据。这次的导入/重置以当前窗口为准，对方那部分改动没有合并进来。"
          );
        }
      }
    }

    dataRef.current = toWrite;
    setDataState(toWrite);
    try {
      lastWrittenJsonRef.current = saveData(toWrite);
      setSaveError((current) => (current === null ? current : null));
      /*
       * R11：落盘成功后顺手更新「还剩多少空间」。
       *
       * 这个数字此前只在设置页算（`diagnoseStoredData`），而设置页用户很少去——
       * 实测：软上限（4MB）到真正写不下（WebKit 约 4.96MB）之间只有约 **43 天**缓冲，
       * 指望用户在这 43 天里主动进设置页看到告警，是会踩空的。
       * 放在这里等于「每次保存都顺带更新」，成本是复用刚写出的字符串（零额外序列化）。
       */
      refreshStoragePressure(lastWrittenJsonRef.current);
    } catch (error) {
      const message =
        error instanceof Error && /quota|exceeded/i.test(`${error.name} ${error.message}`)
          /*
           * R11：文案指向「保留进度」的选项。
           *
           * 此前只建议「清理浏览器存储或删掉部分卡片」——两条都会丢东西。
           * 而设置页有一个**不丢进度**的选择：归档久远复习明细
           *（`compactReviewHistory`，把旧明细压成每日汇总，连胜与已掌握数量都不变）。
           * 用户在「存不下了」这一刻最需要知道它存在。
           */
          ? "存储空间已满，这次的改动没能保存到本机。请先导出备份；到「数据与安全」里用「归档久远明细腾空间」可以在保留进度的前提下腾出空间。"
          : "这次的改动没能保存到本机。请先导出备份再继续，以免数据丢失。";
      setSaveError(message);
    }
  };

  // R03：一次成功的云同步 = 一次有效备份。提交时写入 lastSyncedAt，
  // 并把 lastSyncedJsonRef 对齐到写入后的快照，防止自动推送死循环。
  /**
   * 云同步的落盘。
   *
   * R10：整份替换但**静默**——云同步是后台自动跑的，
   * 它本来就会「从云端覆盖本地」，这不是用户此刻的意图冲突，
   * 弹「另一个窗口改过数据」只会让人困惑。用户能看到的同步状态
   * 由 `dataSyncStatus` 单独表达。
   */
  const commitSyncedData = (synced: AppData, syncedAt?: string) => {
    const marked = markDataSyncedBackup(synced, syncedAt);
    commitData(marked, undefined, undefined, { silent: true });
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
          // R10：把 updater 一并交给 commitData —— 发现另一窗口写过时，
          // 它会把这个纯函数重放到对方的数据上，两边的改动都保留。
          commitData(updater(dataRef.current), updater);
        });
        asyncUpdateQueueRef.current = run.then(
          () => undefined,
          () => undefined
        );
      },
      updateDataAsync(updater) {
        const run = waitForQueuedUpdates().then(async () => {
          const result = await updater(dataRef.current);
          /*
           * R10：异步 updater **不**参与重放合并。
           *
           * 它们内部往往带副作用（AI 批改、网络请求、按 id 分配），
           * 把同一个函数再跑一遍会重复请求、并可能与第一次的结果冲突；
           * 而且 `result`（调用方要用的返回值）无法在重放后保持有效。
           * 所以这条路径仍以本次结果为准——但若检测到另一窗口写过，
           * commitData 会如实告知，不静默吞掉对方改动。
           */
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
        /*
         * 整份替换：重置的语义就是「清空」，不参与合并。
         *
         * 但必须**先**采集快照：`resetData()` 内部会立刻写一份初始数据到磁盘，
         * 那份写入会把「另一个窗口留下的内容」冲掉——事后再读就只是自己刚写的，
         * 判不出曾经有过冲突（实测：不采集时这条提示永远不会出现）。
         */
        const baseline = snapshotBeforeSideEffects();
        commitData(resetData(), undefined, baseline);
      },
      dataSyncStatus,
      setDataSyncStatus,
      markDataSynced(next) {
        lastSyncedJsonRef.current = JSON.stringify(next);
      },
      saveError,
      crossWindowNotice,
      dismissCrossWindowNotice() {
        setCrossWindowNotice(null);
      },
      storagePressure
    }),
    [data, dataSyncStatus, saveError, crossWindowNotice, storagePressure]
  );

  /**
   * 挂载时先算一次存储压力（R11）。
   *
   * 用户可能在上次会话里就已经接近上限然后关掉应用；若只在保存后更新，
   * 本次打开到第一次操作之间不会有任何提示，而用户完全可能先看到
   * 「答完这题没保存成功」才发现问题——那已经太晚了。
   */
  useEffect(() => {
    refreshStoragePressure(readStoredSnapshot());
    // 只在挂载时跑一次：后续由 commitData 复用 saveData 的返回值更新（零额外读盘）。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
