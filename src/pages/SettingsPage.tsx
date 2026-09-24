import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  CloudDownload,
  CloudUpload,
  Database,
  Download,
  FileJson,
  Gauge,
  PlugZap,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Sparkles,
  Upload,
  Volume2,
  Archive
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppData } from "../AppContext";
import PageHeader from "../components/PageHeader";
import ConfirmDialog from "../components/ConfirmDialog";
import AppSelect from "../components/AppSelect";
import VoicePicker from "../components/VoicePicker";
import { getDictionaryStats } from "../services/dictionaryService";
import { exportAnkiCsv, exportJson, exportMarkdown } from "../services/exportService";
import { clearBoostAiCache } from "../services/grammarBoostAiService";
import { testAdventureProviderConnection } from "../services/adventureModelService";
import { describeSyncError, fetchRemoteSnapshot, pushDataSnapshot } from "../services/syncService";
import { GOAL_PRESETS } from "../services/goalPresets";
import { estimateDaysToMaster } from "../services/completionEstimate";
import { STUDY_SCHEMES, matchStudyScheme } from "../services/schemePresets";
import { getSpeechVoices, pickSpeechPreviewText, selectPreferredSpeechVoice, speakText } from "../services/speechService";
import {
  clearStartupRepairReport,
  diagnoseStoredData,
  downloadTextFile,
  markDataExported,
  markDataSyncedBackup,
  needsBackupReminder,
  nowIso,
  parseBackupJson
} from "../services/storage";
import {
  trackSettingsAutosave,
  trackSettingsDangerOp,
  trackSettingsView,
  buildSettingsTelemetryExport
} from "../services/settingsTelemetry";
import { Link } from "react-router-dom";
import { compactReviewHistory } from "../services/reviewArchiveService";
import { buildVocabTelemetryExport, getVocabTelemetryStats } from "../services/vocabTelemetry";
import { buildGrammarTelemetryExport, getGrammarTelemetryStats } from "../services/grammarTelemetry";
import { buildAdventureTelemetryExport, getAdventureTelemetryStats } from "../services/adventureTelemetry";
import type { AiProviderSettings, AppData, DataSyncSettings, Settings } from "../types";

const AUTOSAVE_DELAY_MS = 500;

/** 顶层字段级 diff（埋点只记字段名，不记值）。 */
const changedTopLevelFields = (next: Settings, prev: Settings): string[] =>
  (Object.keys(next) as (keyof Settings)[]).filter(
    (key) => JSON.stringify(next[key]) !== JSON.stringify(prev[key])
  );

/** R04：AI 中转站预设模板——选中即填 Base URL 与默认模型，用户只需补 API Key。 */
const AI_PROVIDER_PRESETS = [
  { id: "openai", label: "OpenAI 官方", baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini" },
  { id: "deepseek", label: "DeepSeek 官方", baseUrl: "https://api.deepseek.com/v1", model: "deepseek-chat" },
  { id: "ollama", label: "Ollama 本地模型", baseUrl: "http://localhost:11434/v1", model: "llama3.1" }
] as const;

/** R04：把连接测试的原始异常翻译成非技术用户能行动的三类文案。 */
const describeAiTestError = (error: unknown): string => {
  const message = error instanceof Error ? error.message : "";
  if (/401|403|unauthorized|invalid[_\s]?(api[_\s]?)?key|incorrect api key/i.test(message)) {
    return "API Key 无效，请检查 Key 是否填错或已过期。";
  }
  if (/timeout|超时|timed? ?out|abort/i.test(message)) {
    return "连接超时：模型响应太慢，可以把超时秒数调大（建议 120-180 秒）再试。";
  }
  if (/load failed|failed to fetch|networkerror|network request failed|econnrefused|dns/i.test(message)) {
    return "地址连不通：请检查 Base URL 是否填对、服务是否已启动、网络是否正常。";
  }
  return message ? `连接失败：${message}` : "连接测试失败，请检查配置后重试。";
};

type SettingsTab = "preferences" | "ai" | "data" | "system";

const SETTINGS_TABS: Array<{ id: SettingsTab; label: string; icon: typeof Settings2; description: string }> = [
  { id: "preferences", label: "学习偏好", icon: Settings2, description: "目标节奏与听写语音" },
  { id: "ai", label: "AI 与集成", icon: Sparkles, description: "模型中转站与故事生成" },
  { id: "data", label: "数据与安全", icon: FileJson, description: "备份、同步与恢复" },
  { id: "system", label: "系统状态", icon: Gauge, description: "存储与词典运行状况" }
];

export default function SettingsPage() {
  const { data, setData, updateData, reset, dataSyncStatus, setDataSyncStatus, markDataSynced, saveError } = useAppData();
  const [settings, setSettings] = useState(data.settings);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [activeTab, setActiveTab] = useState<SettingsTab>("preferences");
  const [restoreMessage, setRestoreMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  // R01 即改即存：不再有"保存更改"按钮。本地 settings 是输入受控状态，
  // 与已保存快照出现差异后 500ms debounce 自动落盘；页头只展示保存状态。
  const [saveState, setSaveState] = useState<{ tone: "idle" | "saving" | "saved"; at: string }>({ tone: "idle", at: "" });
  const [voicePreviewStatus, setVoicePreviewStatus] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [aiTestStatus, setAiTestStatus] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [isTestingAi, setIsTestingAi] = useState(false);
  // R02：危险操作先预览影响范围再确认。source 为待覆盖上来的数据（备份文件/云端快照）。
  const [dangerPreview, setDangerPreview] = useState<
    | { kind: "restore_json"; source: AppData }
    | { kind: "pull_cloud"; source: AppData; savedAt: string }
    | { kind: "reset_local" }
    /** 归档久远复习明细（保留进度与连胜）。 */
    | { kind: "archive_history" }
    | null
  >(null);
  const dictionaryStats = getDictionaryStats(data);
  const showBackupReminder = needsBackupReminder(data);
  const dataScope = {
    cards: data.cards.length,
    reviews: data.reviews.length,
    materials: data.materials.length,
    segments: data.materialSegments.length,
    dictionaryEntries: dictionaryStats.searchableCount
  };

  /** 一段式的数据范围摘要，用于危险操作预览的"本地 vs 源"对比。 */
  const scopeSummary = (target: AppData) =>
    `${target.cards.length} 张卡片 / ${target.reviews.length} 条复习 / ${target.materials.length} 份材料 / ${target.materialSegments.length} 个句段`;

  // R05：当前值命中哪个档位（都不命中即"自定义"），以及联动预览的预计掌握天数。
  const activeGoalPreset =
    GOAL_PRESETS.find(
      (preset) =>
        preset.dailyNewWords === settings.dailyNewWords &&
        preset.dailyReviewLimit === settings.dailyReviewLimit &&
        preset.dailySentences === settings.dailySentences
    )?.id ?? "custom";
  const unmasteredCards = data.cards.filter((card) => card.status !== "mastered" && card.status !== "suspended").length;
  const estimatedDays = estimateDaysToMaster(unmasteredCards, settings.dailyNewWords, settings.dailyReviewLimit);
  const activeScheme = matchStudyScheme(settings);
  // R12：存储健康诊断（只读），异常时提供导出/重置入口；diagnosisTick 用于"知道了"后强制重算。
  const [diagnosisTick, setDiagnosisTick] = useState(0);
  void diagnosisTick;
  const storageDiagnosis = diagnoseStoredData(data);
  // P1-7：遥测存量统计（useState 初始化只读一次，避免每次渲染重复解析 localStorage）。
  const [vocabTelemetryStats] = useState(() => getVocabTelemetryStats());
  const [grammarTelemetryStats] = useState(() => getGrammarTelemetryStats());
  /**
   * 冒险遥测（2026-09-24 首页重规划 P0a 新增）。
   *
   * 为什么加：`adventureTelemetry` 的读侧导出此前**只有测试引用**——生产 UI 里
   * 既不计入总数也不可导出，于是那 15 条真实事件（最后一条 2026-09-16）
   * 在「冒险线是唯一有真实消费的线」这个判断上**无法被产品自身证实**。
   * 补上它，是「给冒险加首页入口」这类改动能被验证的前置条件。
   */
  const [adventureTelemetryStats] = useState(() => getAdventureTelemetryStats());
  /** 三线遥测总量（主键 + 归档）。口径见各 telemetry 模块的 stats 注释：三线一律同形。 */
  const telemetryTotal =
    vocabTelemetryStats.totalEvents + grammarTelemetryStats.totalEvents + adventureTelemetryStats.totalEvents;

  // R04：当前 AI 配置命中哪个预设（Base URL 或模型名被手动改过即"自定义"）。
  const activeAiPreset =
    AI_PROVIDER_PRESETS.find(
      (preset) => preset.baseUrl === settings.aiProvider.baseUrl.trim() && preset.model === settings.aiProvider.model.trim()
    )?.id ?? "custom";

  const cancelDangerOp = () => {
    if (dangerPreview) trackSettingsDangerOp(dangerPreview.kind, false);
    setDangerPreview(null);
  };

  const confirmDangerOp = () => {
    if (!dangerPreview) return;
    trackSettingsDangerOp(dangerPreview.kind, true);
    if (dangerPreview.kind === "archive_history") {
      /**
       * 归档久远复习明细（2026-09-22）。
       *
       * 与「重置」的区别是它**保留全部学习进度**——只把超过保留窗口的
       * 逐条明细压成「一天一条」的汇总，于是连胜、「有活动的日子」、
       * 已掌握数、卡片与排期全部不变，释放的是纯体积。
       */
      const result = compactReviewHistory(data);
      setData(result.data);
      setRestoreMessage({
        tone: "success",
        text:
          result.compactedCount > 0
            ? `已归档 ${result.compactedCount} 条久远复习明细（压成 ${result.summaryCount} 条每日汇总），释放约 ${Math.round(result.freedBytes / 1024)}KB。进度与连胜不变。`
            : "没有需要归档的久远明细——最近的复习记录都会被完整保留。"
      });
      setDangerPreview(null);
      return;
    }
    if (dangerPreview.kind === "restore_json") {
      setData(dangerPreview.source);
      setRestoreMessage({
        tone: "success",
        text: `已恢复 ${dangerPreview.source.cards.length} 张卡片、${dangerPreview.source.reviews.length} 条复习记录。`
      });
    } else if (dangerPreview.kind === "pull_cloud") {
      const marked = markDataSyncedBackup(dangerPreview.source, dangerPreview.savedAt || undefined);
      setData(marked);
      markDataSynced(marked);
      setDataSyncStatus({ state: "ok", message: "已从云端恢复数据。" });
      setSyncManualStatus({ tone: "success", text: "已从云端恢复数据。" });
    } else {
      reset();
      setRestoreMessage({ tone: "success", text: "本机数据已重置为初始状态。" });
    }
    setDangerPreview(null);
  };

  const settingsRef = useRef(settings);
  const dataSettingsRef = useRef(data.settings);
  // 最近一次由本页写入的 settings 快照：区分"自己保存的回声"与
  // "外部变更"（云端恢复 / 重置 / 恢复 JSON），防止回声覆盖正在输入的内容。
  const lastSavedJsonRef = useRef<string>(JSON.stringify(data.settings));
  const saveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    dataSettingsRef.current = data.settings;
  }, [data.settings]);

  const flushSave = useCallback(() => {
    const current = settingsRef.current;
    const json = JSON.stringify(current);
    if (json === lastSavedJsonRef.current) return;
    const fields = changedTopLevelFields(current, dataSettingsRef.current);
    // 先占位再提交：updateData 是排队异步提交，占位可防回声 effect 误判外部变更。
    lastSavedJsonRef.current = json;
    updateData((latest) => ({ ...latest, settings: current }));
    setSaveState({ tone: "saved", at: nowIso() });
    trackSettingsAutosave(fields.length > 0 ? fields : ["settings"], true);
  }, [updateData]);

  const flushSaveRef = useRef(flushSave);
  useEffect(() => {
    flushSaveRef.current = flushSave;
  }, [flushSave]);

  // 外部变更（云端恢复 / 重置 / 恢复 JSON）→ 采纳新设置；自己保存的回声 → 忽略。
  useEffect(() => {
    const json = JSON.stringify(data.settings);
    if (json === lastSavedJsonRef.current) return;
    lastSavedJsonRef.current = json;
    setSettings(data.settings);
  }, [data.settings]);

  // 自动保存：本地设置与已保存快照出现差异后 debounce 落盘。
  useEffect(() => {
    if (JSON.stringify(settings) === lastSavedJsonRef.current) return;
    setSaveState((current) => ({ tone: "saving", at: current.at }));
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => flushSaveRef.current(), AUTOSAVE_DELAY_MS);
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [settings]);

  // 离开页面 / 关闭窗口前兜底 flush，debounce 窗口内的修改不丢。
  useEffect(() => {
    const handlePageHide = () => flushSaveRef.current();
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") flushSaveRef.current();
    };
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibility);
      flushSaveRef.current();
    };
  }, []);

  useEffect(() => {
    trackSettingsView();
  }, []);

  // R07：抽成回调供排障卡「重新加载声音列表」复用（voiceschanged 监听也走这里）。
  const loadVoices = useCallback(() => {
    const availableVoices = getSpeechVoices().filter((voice) =>
      voice.lang.replace(/_/g, "-").toLowerCase().startsWith("en")
    );
    const preferred = selectPreferredSpeechVoice(availableVoices, settingsRef.current.speechLang);
    setVoices([
      ...availableVoices.filter((voice) => voice.voiceURI === preferred?.voiceURI),
      ...availableVoices.filter((voice) => voice.voiceURI !== preferred?.voiceURI)
    ]);
  }, []);

  useEffect(() => {
    loadVoices();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
      return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    }
  }, [settings.speechLang, loadVoices]);

  /** 手动操作（同步/导出）前取包含未落盘设置的最新数据。 */
  const dataWithPendingSettings = (): AppData => {
    const pending = settingsRef.current;
    if (JSON.stringify(pending) === lastSavedJsonRef.current) return data;
    return { ...data, settings: pending };
  };

  /** R11：试听文本对齐真实听写场景——从词库句段取句；systemOnly 让预览测的是语音引擎本身，而非网络。 */
  const previewVoice = async () => {
    const preview = pickSpeechPreviewText(data.materialSegments.map((segment) => segment.text));
    setVoicePreviewStatus({ tone: "success", text: "正在试听当前语音设置..." });
    const played = await speakText(preview.text, {
      lang: settings.speechLang,
      rate: settings.speechRate,
      voiceURI: settings.speechVoice,
      systemOnly: true
    });
    setVoicePreviewStatus(
      played
        ? {
            tone: "success",
            text: preview.fromLibrary
              ? `试听已播放（句子取自你的词库：${preview.text.length > 40 ? `${preview.text.slice(0, 40)}…` : preview.text}）。当前设置会用于听写和发音按钮。`
              : "试听已播放。当前设置会用于听写和发音按钮。"
          }
        : { tone: "error", text: "当前浏览器没有可用语音，请检查系统语音或换一个声音。" }
    );
  };

  const testAiConnection = async () => {
    setIsTestingAi(true);
    setAiTestStatus({ tone: "success", text: "正在测试中转站连接..." });
    try {
      await testAdventureProviderConnection(settings.aiProvider);
      setAiTestStatus({ tone: "success", text: "连接成功，冒险续章接口已返回有效内容。" });
    } catch (error) {
      setAiTestStatus({ tone: "error", text: describeAiTestError(error) });
    } finally {
      setIsTestingAi(false);
    }
  };

  // Editing any relay field invalidates the previous test verdict. Leaving the
  // old result on screen makes it look like the new settings were tested.
  const updateAiProvider = (patch: Partial<AiProviderSettings>) => {
    setSettings((current) => ({ ...current, aiProvider: { ...current.aiProvider, ...patch } }));
    setAiTestStatus(null);
  };

  const [syncManualStatus, setSyncManualStatus] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [isSyncingManually, setIsSyncingManually] = useState(false);

  const updateDataSync = (patch: Partial<DataSyncSettings>) => {
    setSettings((current) => ({ ...current, dataSync: { ...current.dataSync, ...patch } }));
    setSyncManualStatus(null);
  };

  const formatSyncTime = (iso: string) => {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("zh-CN", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  const pushToCloudNow = async () => {
    setIsSyncingManually(true);
    setSyncManualStatus({ tone: "success", text: "正在上传到云端..." });
    try {
      flushSaveRef.current();
      const payload = dataWithPendingSettings();
      const savedAt = await pushDataSnapshot(settings.dataSync, payload);
      // R03：上传成功即一次有效备份，回写 lastSyncedAt 止住"未备份"误报。
      const marked = markDataSyncedBackup(payload, savedAt || undefined);
      setData(marked);
      markDataSynced(marked);
      setDataSyncStatus({ state: "ok", message: "已上传到云端。" });
      setSyncManualStatus({ tone: "success", text: `已上传到云端${savedAt ? `（${formatSyncTime(savedAt)}）` : ""}。` });
    } catch (error) {
      setSyncManualStatus({ tone: "error", text: describeSyncError(error) });
    } finally {
      setIsSyncingManually(false);
    }
  };

  const pullFromCloudNow = async () => {
    setIsSyncingManually(true);
    setSyncManualStatus({ tone: "success", text: "正在读取云端数据..." });
    try {
      // R02：只拉取不写盘，先展示"本地 vs 云端"预览，用户确认后才覆盖。
      const remote = await fetchRemoteSnapshot(settings.dataSync);
      if (!remote) {
        setSyncManualStatus({ tone: "error", text: "云端还没有数据，先在旧浏览器里上传一次。" });
        return;
      }
      setSyncManualStatus(null);
      setDangerPreview({ kind: "pull_cloud", source: remote.data, savedAt: remote.savedAt });
    } catch (error) {
      setSyncManualStatus({ tone: "error", text: describeSyncError(error) });
    } finally {
      setIsSyncingManually(false);
    }
  };

  /**
   * R09：所有导出按钮共用的一层——把 `downloadTextFile` 的返回值翻成用户可见反馈。
   *
   * 此前除 JSON 备份外的 5 个按钮都**忽略返回值**：文件没生成也照样什么都不说，
   * 用户以为导出了、去文件夹里找不到。
   */
  const exportFile = (filename: string, content: string, type: string) => {
    if (downloadTextFile(filename, content, type)) {
      setRestoreMessage({ tone: "success", text: `已导出 ${filename}。` });
      return;
    }
    setRestoreMessage({
      tone: "error",
      text: `${filename} 没能生成（可能是存储被限制或浏览器策略拦截）。可以改用打开网页版导出。`
    });
  };

  const exportBackupJson = () => {
    flushSaveRef.current();
    const exportedData = markDataExported(dataWithPendingSettings());
    // R09：先确认文件真的交出去了，再记「已备份」——否则会谎报成功，
    // 而这是用户唯一的数据出口（storage.ts 的 downloadTextFile 已改为返回结果）。
    if (!downloadTextFile("vocab-backup.json", exportJson(exportedData), "application/json")) {
      setRestoreMessage({
        tone: "error",
        text: "这次导出没能生成文件（可能是存储被限制或浏览器策略拦截）。请换用打开网页版导出，或先在下方复制数据。"
      });
      return;
    }
    setData(exportedData);
    setRestoreMessage({ tone: "success", text: "已导出 JSON 备份，数据范围见下方摘要。" });
  };

  const restoreBackup = (file: File | undefined) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        // R02：只解析不写盘，先预览影响范围，确认后才 setData 覆盖。
        const parsed = parseBackupJson(String(reader.result ?? ""));
        setRestoreMessage(null);
        setDangerPreview({ kind: "restore_json", source: parsed });
      } catch (error) {
        setRestoreMessage({
          tone: "error",
          text: error instanceof Error ? error.message : "JSON 备份无法读取。"
        });
      }
    };
    reader.onerror = () => {
      setRestoreMessage({ tone: "error", text: "文件读取失败，请重新选择 JSON 备份。" });
    };
    reader.readAsText(file);
  };

  const lastExportLabel = data.settings.lastExportedAt
    ? new Intl.DateTimeFormat("zh-CN", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(data.settings.lastExportedAt))
    : "尚未备份";

  // R08 数据保险箱状态行：备份取「导出/云同步」较近者并标注来源；同步状态一眼可见。
  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return Number.isNaN(date.getTime())
      ? ""
      : new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
  };
  const exportedAtMs = new Date(data.settings.lastExportedAt).getTime();
  const syncedAtMs = new Date(data.settings.lastSyncedAt).getTime();
  const lastBackupLabel =
    Number.isFinite(exportedAtMs) || Number.isFinite(syncedAtMs)
      ? Number.isFinite(syncedAtMs) && syncedAtMs >= (Number.isFinite(exportedAtMs) ? exportedAtMs : 0)
        ? `${formatDateTime(data.settings.lastSyncedAt)}（云同步）`
        : `${formatDateTime(data.settings.lastExportedAt)}（JSON 导出）`
      : "尚未备份";
  const lastSyncLabel = Number.isFinite(syncedAtMs) ? formatDateTime(data.settings.lastSyncedAt) : "尚未同步";
  const syncStateLabel = !settings.dataSync.enabled
    ? "未开启"
    : dataSyncStatus.state === "syncing"
      ? "同步中…"
      : dataSyncStatus.state === "error"
        ? "同步失败"
        : dataSyncStatus.state === "ok"
          ? "正常"
          : "待同步";

  const formatClock = (iso: string) => {
    const date = new Date(iso);
    return Number.isNaN(date.getTime())
      ? ""
      : new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit" }).format(date);
  };

  const autosaveStatusText =
    saveState.tone === "saving"
      ? "正在自动保存…"
      : saveState.tone === "saved"
        ? `已自动保存 · ${formatClock(saveState.at)}`
        : "所有更改都会自动保存";

  return (
    <div className="page settings-page">
      <PageHeader
        eyebrow="Settings"
        title="设置与导出"
        description="把每日目标、听写语音和本地数据备份放在同一个可信工作台里。"
        action={
          <span className={`settings-autosave-status ${saveState.tone}`} role="status">
            <CheckCircle2 size={15} />
            {autosaveStatusText}
          </span>
        }
      />

      {showBackupReminder && (
        <div className="panel backup-reminder">
          <AlertTriangle size={20} />
          <div>
            <strong>建议现在导出一次 JSON 备份</strong>
            <span>上次备份：{lastExportLabel}。恢复、换浏览器或清理缓存前先留一份更稳。</span>
          </div>
          <button className="primary-button" type="button" onClick={exportBackupJson}>
            <Download size={17} />
            立即备份
          </button>
        </div>
      )}

      <div className="settings-shell">
        <nav className="settings-nav" aria-label="设置分类">
          {SETTINGS_TABS.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                className={activeTab === tab.id ? "settings-nav-item active" : "settings-nav-item"}
                aria-current={activeTab === tab.id ? "page" : undefined}
                onClick={() => setActiveTab(tab.id)}
              >
                <TabIcon size={17} />
                <span className="settings-nav-text">
                  <strong>{tab.label}</strong>
                  <span>{tab.description}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="settings-content">
          {activeTab === "preferences" && (
        <section className="settings-group" aria-label="学习偏好">
          <div className="settings-group-grid">
            <div className="panel form-panel settings-goals-panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">Learning Goals</span>
                  <h2>学习目标</h2>
                </div>
                <Gauge size={20} />
              </div>
              {/* R09：一键学习方案——跨字段组合（目标档位 + 行为开关），应用后下方各控件即时反映新值 */}
              <div className="scheme-presets" role="group" aria-label="学习方案">
                {STUDY_SCHEMES.map((scheme) => (
                  <button
                    key={scheme.id}
                    type="button"
                    className={activeScheme === scheme.id ? "scheme-card active" : "scheme-card"}
                    aria-pressed={activeScheme === scheme.id}
                    onClick={() => setSettings({ ...settings, ...scheme.settings })}
                  >
                    <strong>{scheme.label}</strong>
                    <span>{scheme.description}</span>
                  </button>
                ))}
              </div>
              {/* R05：档位化 + 自定义兜底；手动改任意数字即自动落回"自定义" */}
              <div className="goal-presets" role="group" aria-label="目标档位">
                {GOAL_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={activeGoalPreset === preset.id ? "goal-preset-chip active" : "goal-preset-chip"}
                    title={`${preset.dailyNewWords} 新词 / ${preset.dailyReviewLimit} 复习 / ${preset.dailySentences} 句子 · ${preset.description}`}
                    onClick={() =>
                      setSettings({
                        ...settings,
                        dailyNewWords: preset.dailyNewWords,
                        dailyReviewLimit: preset.dailyReviewLimit,
                        dailySentences: preset.dailySentences
                      })
                    }
                  >
                    {preset.label}
                  </button>
                ))}
                <span className={activeGoalPreset === "custom" ? "goal-preset-chip custom active" : "goal-preset-chip custom"}>
                  自定义
                </span>
              </div>
              <div className="goal-number-row">
                <label>
                  每日新词
                  <input
                    type="number"
                    min={0}
                    value={settings.dailyNewWords}
                    onChange={(event) => setSettings({ ...settings, dailyNewWords: Number(event.target.value) })}
                  />
                </label>
                <label>
                  复习上限
                  <input
                    type="number"
                    min={1}
                    value={settings.dailyReviewLimit}
                    onChange={(event) => setSettings({ ...settings, dailyReviewLimit: Number(event.target.value) })}
                  />
                </label>
                <label>
                  每日句子
                  <input
                    type="number"
                    min={0}
                    value={settings.dailySentences}
                    onChange={(event) => setSettings({ ...settings, dailySentences: Number(event.target.value) })}
                  />
                </label>
              </div>
              {/* R05 联动预览：改目标立即刷新预计掌握天数（含 SM-2 复习尾巴口径） */}
              <div className="settings-impact-note">
                <CheckCircle2 size={17} />
                <span>
                  {unmasteredCards > 0
                    ? `当前还有 ${unmasteredCards} 张卡未掌握，按这个目标预计约 ${estimatedDays} 天掌握。`
                    : "当前词库已全部掌握，新增单词后这里会显示预计掌握天数。"}
                  目标是节奏参考，不会限制你多学或少学。
                </span>
              </div>
            </div>

            <div className="panel form-panel settings-voice-panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">Voice & Dictation</span>
                  <h2>语音与听写</h2>
                </div>
                <button className="secondary-button" type="button" onClick={previewVoice}>
                  <Volume2 size={17} />
                  试听
                </button>
              </div>
              <label>
                口音
                <AppSelect
                  ariaLabel="口音"
                  options={[
                    { value: "en-US", label: "美音" },
                    { value: "en-GB", label: "英音" }
                  ]}
                  value={settings.speechLang}
                  onChange={(value) => setSettings({ ...settings, speechLang: value as typeof settings.speechLang })}
                />
              </label>
              <label htmlFor="voice-picker-trigger">
                系统声音
                <VoicePicker
                  id="voice-picker-trigger"
                  options={[{ value: "", label: "自动选择（优先自然音色）" }, ...voices.map((voice) => ({ value: voice.voiceURI, label: `${voice.name} · ${voice.lang}` }))]}
                  value={settings.speechVoice}
                  onChange={(value) => setSettings({ ...settings, speechVoice: value })}
                />
                <span className="field-hint">自动选择会避开效果音，优先使用 Samantha、Alex、增强或自然英文音色。</span>
              </label>
              <label>
                语速 {settings.speechRate.toFixed(1)}x
                <input
                  type="range"
                  min={0.6}
                  max={1.2}
                  step={0.1}
                  value={settings.speechRate}
                  onChange={(event) => setSettings({ ...settings, speechRate: Number(event.target.value) })}
                />
              </label>
              <label className="checkbox-line">
                <input
                  type="checkbox"
                  checked={settings.autoSpeakInSpelling}
                  onChange={(event) => setSettings({ ...settings, autoSpeakInSpelling: event.target.checked })}
                />
                拼写训练自动播放发音
              </label>
              <label className="checkbox-line">
                <input
                  type="checkbox"
                  checked={settings.strictPunctuation}
                  onChange={(event) => setSettings({ ...settings, strictPunctuation: event.target.checked })}
                />
                严格检查标点
                <span className="field-hint">开启后标点错误也判为错误，会影响听写正确率统计与错词本收录。</span>
              </label>
              {voicePreviewStatus?.tone === "success" && (
                <div className="audio-message success" role="status">
                  {voicePreviewStatus.text}
                </div>
              )}
              {/* R07 语音排障卡：失败不只报错，给出可执行的逐项诊断与修复动作 */}
              {voicePreviewStatus?.tone === "error" && (
                <div className="voice-troubleshoot" role="status">
                  <strong>试听失败，按下面逐项检查：</strong>
                  <ul>
                    <li>
                      浏览器语音引擎：{"speechSynthesis" in window ? "可用" : "不可用（当前环境不支持系统语音）"}
                    </li>
                    <li>
                      可用英语声音：
                      {voices.length > 0
                        ? `${voices.length} 个`
                        : "0 个——请先在系统设置中安装英文语音（macOS：系统设置 → 辅助功能 → 朗读内容），再点下方「重新加载」"}
                    </li>
                    <li>
                      当前选择：{settings.speechLang === "en-US" ? "美音" : "英音"} · {settings.speechRate.toFixed(1)}x ·{" "}
                      {settings.speechVoice ? "指定声音（可试自动选择）" : "自动选择"}
                    </li>
                  </ul>
                  <div className="voice-troubleshoot-actions">
                    <button className="secondary-button" type="button" onClick={loadVoices}>
                      重新加载声音列表
                    </button>
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => setSettings({ ...settings, speechVoice: "", speechRate: 0.9 })}
                    >
                      恢复推荐设置
                    </button>
                    <button className="secondary-button" type="button" onClick={previewVoice}>
                      再试一次
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
          )}

          {activeTab === "ai" && (
        <section className="settings-group" aria-label="AI 与集成">
          <div className="settings-group-grid single">
            <div className="panel form-panel settings-ai-panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">AI Story</span>
                  <h2>AI 中转站</h2>
                </div>
                <div className="panel-header-actions">
                  <button className="secondary-button" type="button" onClick={testAiConnection} disabled={isTestingAi}>
                    <PlugZap size={17} />
                    {isTestingAi ? "测试中" : "测试连接"}
                  </button>
                </div>
              </div>
              <div className="settings-ai-primary">
                <label className="checkbox-line">
                  <input
                    type="checkbox"
                    checked={settings.aiProvider.enabled}
                    onChange={(event) => updateAiProvider({ enabled: event.target.checked })}
                  />
                  使用真实模型生成冒险和错词故事
                </label>
                {/* R04：预设模板一键填 Base URL 与模型名，只留 API Key 必填；手动改动即落回"自定义" */}
                <label>
                  快速配置
                  <AppSelect
                    ariaLabel="AI 中转站快速配置"
                    options={[
                      { value: "custom", label: "自定义（手动填写）" },
                      ...AI_PROVIDER_PRESETS.map((preset) => ({ value: preset.id, label: preset.label }))
                    ]}
                    value={activeAiPreset}
                    onChange={(value) => {
                      const preset = AI_PROVIDER_PRESETS.find((item) => item.id === value);
                      if (preset) updateAiProvider({ baseUrl: preset.baseUrl, model: preset.model });
                    }}
                  />
                  <span className="field-hint">选预设后只需填 API Key；Base URL 和模型名会自动填好，仍可手动修改。</span>
                </label>
                <label>
                  API Key
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={settings.aiProvider.apiKey}
                    onChange={(event) => updateAiProvider({ apiKey: event.target.value })}
                  />
                </label>
              </div>
              <details className="settings-advanced">
                <summary>
                  <span>高级设置（Base URL、模型、温度与超时）</span>
                </summary>
                <div className="settings-advanced-body">
                  <label>
                    中转站 Base URL
                    <input
                      type="url"
                      placeholder="https://your-proxy.example.com/v1"
                      value={settings.aiProvider.baseUrl}
                      onChange={(event) => updateAiProvider({ baseUrl: event.target.value })}
                    />
                  </label>
                  <label>
                    模型名称
                    <input
                      placeholder="gpt-4o-mini / deepseek-chat / ..."
                      value={settings.aiProvider.model}
                      onChange={(event) => updateAiProvider({ model: event.target.value })}
                    />
                  </label>
                  <div className="settings-ai-grid">
                    <label>
                      温度 {settings.aiProvider.temperature.toFixed(1)}
                      <input
                        type="range"
                        min={0}
                        max={1.5}
                        step={0.1}
                        value={settings.aiProvider.temperature}
                        onChange={(event) => updateAiProvider({ temperature: Number(event.target.value) })}
                      />
                    </label>
                    <label>
                      超时秒数
                      <input
                        type="number"
                        min={5}
                        max={300}
                        value={Math.round(settings.aiProvider.timeoutMs / 1000)}
                        onChange={(event) => updateAiProvider({ timeoutMs: Number(event.target.value) * 1000 })}
                      />
                    </label>
                  </div>
                  <label className="checkbox-line">
                    <input
                      type="checkbox"
                      checked={settings.aiProvider.fallbackToLocal}
                      onChange={(event) => updateAiProvider({ fallbackToLocal: event.target.checked })}
                    />
                    模型失败时使用本地模板兜底
                  </label>
                </div>
              </details>
              <p className="field-hint">兼容 OpenAI Chat Completions 格式的中转站。开启后冒险续章和错词故事都会请求真实模型；API Key 只保存在本机。如果模型较慢，建议在高级设置里把超时调到 120-180 秒。更改会自动保存。</p>
              {/* 「趁热练」的 AI 批改与生成题缓存在本机（30 天或课程内容变化即失效）。
                  换模型会自动失效；想立即重算时用这个按钮。 */}
              <div className="settings-ai-cache-row">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => {
                    clearBoostAiCache();
                    setAiTestStatus({ tone: "success", text: "已清除「趁热练」的 AI 批改与生成题缓存，下次进入会重新请求。" });
                  }}
                >
                  清除趁热练 AI 缓存
                </button>
                <span className="field-hint">批改结果与生成的题会缓存复用；清掉后下次重新生成。</span>
              </div>
              {aiTestStatus && (
                <div className={`audio-message ${aiTestStatus.tone}`} role="status">
                  {aiTestStatus.text}
                </div>
              )}
            </div>
          </div>
        </section>
          )}

          {activeTab === "data" && (
        /* R08 数据保险箱：备份状态 / 导出 / 云同步 / 恢复与重置 收进同一个面板 */
        <section className="settings-group" aria-label="数据与安全">
          <div className="settings-group-grid single">
        <div className="panel settings-data-panel settings-vault-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Data Vault</span>
              <h2>数据保险箱</h2>
              <span className="settings-subtitle">你的数据只属于你，本地优先、可导出、可恢复。</span>
            </div>
            <FileJson size={20} />
          </div>

          <div className="vault-status-row">
            <div>
              <span>最近备份</span>
              <strong>{lastBackupLabel}</strong>
            </div>
            <div>
              <span>最近同步</span>
              <strong>{lastSyncLabel}</strong>
            </div>
            <div>
              <span>云同步状态</span>
              <strong className={dataSyncStatus.state === "error" ? "vault-sync-badge error" : "vault-sync-badge"}>
                {syncStateLabel}
              </strong>
            </div>
          </div>

          {/* R12 存储健康：正常一行摘要；启动自动修复提示一次；当前异常给出修复动作 */}
          {storageDiagnosis.ok ? (
            <div className="vault-health ok" role="status">
              <ShieldCheck size={16} />
              <span>
                存储健康 · 数据结构 v{storageDiagnosis.schemaVersion} · 本地占用约{" "}
                {storageDiagnosis.storageCostKb >= 1024
                  ? `${(storageDiagnosis.storageCostKb / 1024).toFixed(1)}MB`
                  : `${storageDiagnosis.storageCostKb}KB`}
              </span>
            </div>
          ) : (
            <div className="vault-health warning" role="alert">
              {storageDiagnosis.repaired.length > 0 && (
                <>
                  <div className="vault-health-head">
                    <AlertTriangle size={16} />
                    <strong>
                      {storageDiagnosis.repairedAt
                        ? `${storageDiagnosis.repairedAt.slice(0, 10)} 启动时自动修复了 ${storageDiagnosis.repaired.length} 类历史问题`
                        : `启动时自动修复了 ${storageDiagnosis.repaired.length} 类历史问题`}
                    </strong>
                  </div>
                  <ul>
                    {storageDiagnosis.repaired.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="vault-health-actions">
                    <button className="secondary-button" type="button" onClick={exportBackupJson}>
                      <Download size={16} />
                      导出一次备份
                    </button>
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => {
                        clearStartupRepairReport();
                        setDiagnosisTick((tick) => tick + 1);
                      }}
                    >
                      知道了
                    </button>
                  </div>
                </>
              )}
              {storageDiagnosis.issues.length > 0 && (
                <>
                  <div className="vault-health-head">
                    <AlertTriangle size={16} />
                    <strong>检测到 {storageDiagnosis.issues.length} 个存储异常</strong>
                  </div>
                  <ul>
                    {storageDiagnosis.issues.map((issue) => (
                      <li key={issue}>{issue}</li>
                    ))}
                  </ul>
                  <div className="vault-health-actions">
                    <button className="secondary-button" type="button" onClick={exportBackupJson}>
                      <Download size={16} />
                      先导出备份
                    </button>
                    {/*
                      R11：存储告警下**先**给「归档」这个安全选项。
                      它保留全部进度与连胜，只把久远明细压成每日汇总——
                      而此前这个面板只有「导出备份」与「导出后重置」（清空一切）。
                      用户在「空间不够」时最需要的正是前者：不丢东西地把空间腾出来。
                    */}
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => setDangerPreview({ kind: "archive_history" })}
                    >
                      <Archive size={16} />
                      归档久远明细腾空间
                    </button>
                    <button className="danger-button" type="button" onClick={() => setDangerPreview({ kind: "reset_local" })}>
                      <RotateCcw size={16} />
                      导出后重置
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="settings-data-scope">
            <div><span>卡片</span><strong>{dataScope.cards}</strong></div>
            <div><span>复习记录</span><strong>{dataScope.reviews}</strong></div>
            <div><span>材料</span><strong>{dataScope.materials}</strong></div>
            <div><span>句段</span><strong>{dataScope.segments}</strong></div>
          </div>
          <div className="export-actions">
            <button className="primary-button" type="button" onClick={exportBackupJson}>
              <Download size={17} />
              JSON 备份
            </button>
            <button className="secondary-button" type="button" onClick={() => exportFile("anki-cards.csv", exportAnkiCsv(data), "text/csv")}>
              <Download size={17} />
              Anki CSV
            </button>
            <button className="secondary-button" type="button" onClick={() => exportFile("vocab-notes.md", exportMarkdown(data), "text/markdown")}>
              <Download size={17} />
              Markdown 笔记
            </button>
          </div>

          {/* P1-7 遥测导出通道：词书/语法/冒险三类本地事件完整快照（含时间戳与全字段；三类均含归档，突破上限丢旧数据问题）。 */}
          <details className="settings-advanced telemetry-export-section">
            <summary>
              <span>遥测数据（产品复盘用） · {telemetryTotal} 条</span>
            </summary>
            <div className="settings-advanced-body">
              <span className="telemetry-export-hint">
                本地学习行为事件，含时间戳与事件全字段；词书/语法/冒险快照含归档，导出即为完整数据。
              </span>
              <div className="export-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => exportFile(`vocab-telemetry-${nowIso().slice(0, 10)}.json`, buildVocabTelemetryExport(), "application/json")}
                >
                  <Download size={16} />
                  词书遥测（{vocabTelemetryStats.totalEvents} 条）
                </button>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => exportFile(`grammar-telemetry-${nowIso().slice(0, 10)}.json`, buildGrammarTelemetryExport(), "application/json")}
                >
                  <Download size={16} />
                  语法遥测（{grammarTelemetryStats.totalEvents} 条）
                </button>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => exportFile(`adventure-telemetry-${nowIso().slice(0, 10)}.json`, buildAdventureTelemetryExport(), "application/json")}
                >
                  <Download size={16} />
                  冒险遥测（{adventureTelemetryStats.totalEvents} 条）
                </button>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => exportFile(`settings-telemetry-${nowIso().slice(0, 10)}.json`, buildSettingsTelemetryExport(), "application/json")}
                >
                  <Download size={16} />
                  设置遥测
                </button>
              </div>
            </div>
          </details>

          <details className="settings-advanced vault-sync-section">
            <summary>
              <span>云同步（高级）{settings.dataSync.enabled ? " · 已启用" : ""}</span>
            </summary>
            <div className="settings-advanced-body">
              <div className="panel-header-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={pushToCloudNow}
                  disabled={isSyncingManually || !settings.dataSync.enabled}
                >
                  <CloudUpload size={17} />
                  立即上传
                </button>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={pullFromCloudNow}
                  disabled={isSyncingManually || !settings.dataSync.enabled}
                >
                  <CloudDownload size={17} />
                  从云端恢复
                </button>
              </div>
              <label className="checkbox-line">
                <input
                  type="checkbox"
                  checked={settings.dataSync.enabled}
                  onChange={(event) => updateDataSync({ enabled: event.target.checked })}
                />
                启用自动云同步（数据自动备份，换浏览器自动恢复）
              </label>
              <label>
                同步服务地址
                <input
                  type="url"
                  placeholder="https://your-server.com（服务端运行 scripts/sync-server.mjs）"
                  value={settings.dataSync.baseUrl}
                  onChange={(event) => updateDataSync({ baseUrl: event.target.value })}
                />
              </label>
              <label>
                访问令牌
                <input
                  type="password"
                  placeholder="与服务器 TOKEN 保持一致"
                  value={settings.dataSync.token}
                  onChange={(event) => updateDataSync({ token: event.target.value })}
                />
              </label>
              <p className="field-hint">启用后数据会自动备份到你自己的服务器；换浏览器或换设备打开时，会自动恢复云端最新数据。服务端运行项目里的 scripts/sync-server.mjs，并让服务器 TOKEN 与这里的访问令牌一致。AI Key 等设置也会同步，请只使用自己信任的服务器。</p>
              {syncManualStatus && (
                <div className={`audio-message ${syncManualStatus.tone}`} role="status">
                  {syncManualStatus.text}
                </div>
              )}
              {dataSyncStatus.state !== "idle" && (
                <div className={`audio-message ${dataSyncStatus.state === "error" ? "error" : "success"}`} role="status">
                  {dataSyncStatus.message}
                </div>
              )}
            </div>
          </details>

          <div className="settings-danger-zone">
            <strong>恢复与重置</strong>
            <div className="export-actions">
              <label className="secondary-button file-action-button">
                <Upload size={17} />
                恢复 JSON
                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={(event) => {
                    restoreBackup(event.target.files?.[0]);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
              {/*
                归档入口刻意排在「重置」**之前**：它是安全的那个选项。
                长期使用（约 1.5 年后）会撞到浏览器存储上限，此前用户唯一的选择
                是把所有学习数据清零——有了这个入口就能只压缩久远明细、保住进度。
              */}
              <button
                className="secondary-button"
                type="button"
                onClick={() => setDangerPreview({ kind: "archive_history" })}
              >
                <Archive size={17} />
                归档久远复习明细
              </button>
              <button className="danger-button" type="button" onClick={() => setDangerPreview({ kind: "reset_local" })}>
                <RotateCcw size={17} />
                重置本地数据
              </button>
            </div>
            <p className="field-hint">
              归档只压缩较早的逐条复习记录（保留最近半年的明细），学习进度、连胜天数、已掌握数量都不变。数据接近浏览器上限时用它腾出空间。
            </p>
          </div>
          {/*
            落盘失败优先于普通提示（2026-09-22）：saveError 由 AppContext.commitData 的
            try/catch 设置。此前失败只进 console，页面照样显示「已恢复 N 张卡片」——
            用户以为成功了，实际磁盘没变。这里把失败摊到最显眼的位置。
          */}
          {saveError ? (
            <div className="restore-message error" role="status">
              {saveError}
            </div>
          ) : (
            restoreMessage && (
              <div className={`restore-message ${restoreMessage.tone}`} role="status">
                {restoreMessage.text}
              </div>
            )
          )}
        </div>
          </div>
        </section>
          )}

          {activeTab === "system" && (
        <section className="settings-group" aria-label="系统状态">
          <div className="settings-group-grid single">
            <div className="panel dictionary-panel settings-system-panel">
              <div className="settings-status-grid">
                <div>
                  <Database size={17} />
                  <span>本地存储</span>
                  <strong>可用</strong>
                </div>
                <div>
                  <ShieldCheck size={17} />
                  <span>Schema</span>
                  <strong>v{data.schemaVersion}</strong>
                </div>
                <div>
                  <Volume2 size={17} />
                  <span>系统声音</span>
                  <strong>{voices.length > 0 ? `${voices.length} 个` : "待加载"}</strong>
                </div>
                <div>
                  <BookOpen size={17} />
                  <span>可查词条</span>
                  <strong>{dataScope.dictionaryEntries.toLocaleString()}</strong>
                </div>
              </div>
              <div className="dictionary-stats">
                <div>
                  <span>内置词条</span>
                  <strong>{dictionaryStats.bundledCount.toLocaleString()}</strong>
                </div>
                <div>
                  <span>个人词库</span>
                  <strong>{dictionaryStats.savedWordCount.toLocaleString()}</strong>
                </div>
                <div>
                  <span>最近备份</span>
                  <strong>{lastExportLabel}</strong>
                </div>
              </div>
              <p className="dictionary-note">
                添加单词时会先匹配个人词库，再匹配内置离线词典；没有命中也可以手填，保存后会成为你的个人词典数据。
              </p>
              {/*
                「关于 / 欢迎页」入口（2026-09-24 首页重规划）。
                首页收敛后 `/` 重定向到 `/today`，原来的品牌门页挂到了 `/welcome`——
                没有入口的页面等于死代码（顺手也会让 rv19 那条仍然有效的判据失去被测对象），
                所以在这里给一个可达入口。门页内容本身本期不改（改不改是开放问题 Q7）。
              */}
              <p className="dictionary-note">
                <Link className="ghost-link" to="/welcome">
                  关于这个工具 / 欢迎页
                </Link>
              </p>
            </div>
          </div>
        </section>
          )}
        </div>
      </div>

      {/* R02：危险操作统一预览弹窗——展示"本地 vs 源"影响范围，确认才执行 */}
      <ConfirmDialog
        open={dangerPreview !== null}
        title={
          dangerPreview?.kind === "restore_json"
            ? "恢复 JSON 备份"
            : dangerPreview?.kind === "pull_cloud"
              ? "从云端恢复"
              : "重置本地数据"
        }
        message={
          dangerPreview?.kind === "restore_json"
            ? "恢复后，本机当前数据将被备份文件完全覆盖，此操作不可撤销。"
            : dangerPreview?.kind === "pull_cloud"
              ? "恢复后，本机当前数据将被云端快照完全覆盖，此操作不可撤销。"
              : "将清空本机全部学习数据并恢复初始词库，此操作不可撤销。建议先导出 JSON 备份。"
        }
        details={
          dangerPreview && (dangerPreview.kind === "restore_json" || dangerPreview.kind === "pull_cloud") ? (
            <div className="danger-preview-scope">
              <div>
                <span>本机当前</span>
                <strong>{scopeSummary(data)}</strong>
              </div>
              <div>
                <span>
                  {dangerPreview.kind === "restore_json"
                    ? "备份文件"
                    : dangerPreview.kind === "pull_cloud"
                      ? `云端快照${dangerPreview.savedAt ? `（${formatSyncTime(dangerPreview.savedAt)}）` : ""}`
                      : "归档后"}
                </span>
                <strong>{scopeSummary(dangerPreview.source)}</strong>
              </div>
            </div>
          ) : dangerPreview?.kind === "reset_local" ? (
            <div className="danger-preview-scope">
              <div>
                <span>将被清除</span>
                <strong>{scopeSummary(data)}</strong>
              </div>
            </div>
          ) : undefined
        }
        confirmLabel={dangerPreview?.kind === "reset_local" ? "确认重置" : "确认覆盖"}
        onConfirm={confirmDangerOp}
        onCancel={cancelDangerOp}
      />
    </div>
  );
}
