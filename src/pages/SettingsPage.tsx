import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Database,
  Download,
  FileJson,
  Gauge,
  PlugZap,
  RotateCcw,
  Save,
  ShieldCheck,
  Upload,
  Volume2
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAppData } from "../AppContext";
import PageHeader from "../components/PageHeader";
import { getDictionaryStats } from "../services/dictionaryService";
import { exportAnkiCsv, exportJson, exportMarkdown } from "../services/exportService";
import { testAiProviderConnection } from "../services/modelService";
import { getSpeechVoices, speakText } from "../services/speechService";
import {
  downloadTextFile,
  markDataExported,
  needsBackupReminder,
  restoreDataFromJson
} from "../services/storage";

export default function SettingsPage() {
  const { data, setData, updateData, reset } = useAppData();
  const [settings, setSettings] = useState(data.settings);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [restoreMessage, setRestoreMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [voicePreviewStatus, setVoicePreviewStatus] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [aiTestStatus, setAiTestStatus] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [resetArmed, setResetArmed] = useState(false);
  const dictionaryStats = getDictionaryStats(data);
  const showBackupReminder = needsBackupReminder(data);
  const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(data.settings);
  const dataScope = {
    cards: data.cards.length,
    reviews: data.reviews.length,
    materials: data.materials.length,
    segments: data.materialSegments.length,
    dictionaryEntries: dictionaryStats.searchableCount
  };

  useEffect(() => {
    setSettings(data.settings);
  }, [data.settings]);

  useEffect(() => {
    const loadVoices = () => setVoices(getSpeechVoices().filter((voice) => voice.lang.startsWith("en")));
    loadVoices();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
      return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    }
  }, []);

  const saveSettings = () => {
    updateData((current) => ({ ...current, settings }));
    setSaveMessage("已保存到本机。");
    window.setTimeout(() => setSaveMessage(""), 2200);
  };

  const previewVoice = async () => {
    setVoicePreviewStatus({ tone: "success", text: "正在试听当前语音设置..." });
    const played = await speakText("This is your English pronunciation preview.", {
      lang: settings.speechLang,
      rate: settings.speechRate,
      voiceURI: settings.speechVoice
    });
    setVoicePreviewStatus(
      played
        ? { tone: "success", text: "试听已播放。当前设置会用于听写和发音按钮。" }
        : { tone: "error", text: "当前浏览器没有可用语音，请检查系统语音或换一个声音。" }
    );
  };

  const testAiConnection = async () => {
    setIsTestingAi(true);
    setAiTestStatus({ tone: "success", text: "正在测试中转站连接..." });
    try {
      await testAiProviderConnection(settings.aiProvider);
      setAiTestStatus({ tone: "success", text: "连接成功，模型已返回结构化故事。" });
    } catch (error) {
      setAiTestStatus({ tone: "error", text: error instanceof Error ? error.message : "连接测试失败。" });
    } finally {
      setIsTestingAi(false);
    }
  };

  const exportBackupJson = () => {
    const exportedData = markDataExported(data);
    setData(exportedData);
    downloadTextFile("vocab-backup.json", exportJson(exportedData), "application/json");
    setRestoreMessage({ tone: "success", text: "已导出 JSON 备份，数据范围见下方摘要。" });
  };

  const restoreBackup = (file: File | undefined) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const restored = restoreDataFromJson(String(reader.result ?? ""));
        setData(restored);
        setResetArmed(false);
        setRestoreMessage({
          tone: "success",
          text: `已恢复 ${restored.cards.length} 张卡片、${restored.reviews.length} 条复习记录。`
        });
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

  const confirmReset = () => {
    if (!resetArmed) {
      setResetArmed(true);
      setRestoreMessage({ tone: "error", text: "请再次点击“确认重置”才会清空本机数据。" });
      return;
    }
    reset();
    setResetArmed(false);
    setRestoreMessage({ tone: "success", text: "本机数据已重置为初始状态。" });
  };

  const lastExportLabel = data.settings.lastExportedAt
    ? new Intl.DateTimeFormat("zh-CN", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(data.settings.lastExportedAt))
    : "尚未备份";

  return (
    <div className="page settings-page">
      <PageHeader
        eyebrow="Settings"
        title="设置与导出"
        description="把每日目标、听写语音和本地数据备份放在同一个可信工作台里。"
        action={
          <button className="primary-button" type="button" onClick={saveSettings} disabled={!hasUnsavedChanges}>
            <Save size={17} />
            {hasUnsavedChanges ? "保存更改" : "已保存"}
          </button>
        }
      />
      {(saveMessage || hasUnsavedChanges) && (
        <div className={hasUnsavedChanges ? "settings-save-status pending" : "settings-save-status"} role="status">
          {saveMessage || "有未保存的设置更改。"}
        </div>
      )}

      <section className="settings-grid">
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

        <div className="panel form-panel settings-goals-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Learning Goals</span>
              <h2>学习目标</h2>
            </div>
            <Gauge size={20} />
          </div>
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
          <div className="settings-impact-note">
            <CheckCircle2 size={17} />
            <span>这些数值会影响今日任务、周报目标和复习负载判断。</span>
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
            <select
              value={settings.speechLang}
              onChange={(event) => setSettings({ ...settings, speechLang: event.target.value as typeof settings.speechLang })}
            >
              <option value="en-US">美音</option>
              <option value="en-GB">英音</option>
            </select>
          </label>
          <label>
            系统声音
            <select
              value={settings.speechVoice}
              onChange={(event) => setSettings({ ...settings, speechVoice: event.target.value })}
            >
              <option value="">自动选择</option>
              {voices.map((voice) => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} · {voice.lang}
                </option>
              ))}
            </select>
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
          </label>
          {voicePreviewStatus && (
            <div className={`audio-message ${voicePreviewStatus.tone}`} role="status">
              {voicePreviewStatus.text}
            </div>
          )}
        </div>

        <div className="panel form-panel settings-ai-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">AI Story</span>
              <h2>AI 中转站</h2>
            </div>
            <button className="secondary-button" type="button" onClick={testAiConnection} disabled={isTestingAi}>
              <PlugZap size={17} />
              {isTestingAi ? "测试中" : "测试连接"}
            </button>
          </div>
          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={settings.aiProvider.enabled}
              onChange={(event) => setSettings({
                ...settings,
                aiProvider: { ...settings.aiProvider, enabled: event.target.checked }
              })}
            />
            使用真实模型生成错词故事
          </label>
          <label>
            中转站 Base URL
            <input
              type="url"
              placeholder="https://your-proxy.example.com/v1"
              value={settings.aiProvider.baseUrl}
              onChange={(event) => setSettings({
                ...settings,
                aiProvider: { ...settings.aiProvider, baseUrl: event.target.value }
              })}
            />
          </label>
          <label>
            API Key
            <input
              type="password"
              placeholder="sk-..."
              value={settings.aiProvider.apiKey}
              onChange={(event) => setSettings({
                ...settings,
                aiProvider: { ...settings.aiProvider, apiKey: event.target.value }
              })}
            />
          </label>
          <label>
            模型名称
            <input
              placeholder="gpt-4o-mini / deepseek-chat / ..."
              value={settings.aiProvider.model}
              onChange={(event) => setSettings({
                ...settings,
                aiProvider: { ...settings.aiProvider, model: event.target.value }
              })}
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
                onChange={(event) => setSettings({
                  ...settings,
                  aiProvider: { ...settings.aiProvider, temperature: Number(event.target.value) }
                })}
              />
            </label>
            <label>
              超时秒数
              <input
                type="number"
                min={5}
                max={300}
                value={Math.round(settings.aiProvider.timeoutMs / 1000)}
                onChange={(event) => setSettings({
                  ...settings,
                  aiProvider: { ...settings.aiProvider, timeoutMs: Number(event.target.value) * 1000 }
                })}
              />
            </label>
          </div>
          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={settings.aiProvider.fallbackToLocal}
              onChange={(event) => setSettings({
                ...settings,
                aiProvider: { ...settings.aiProvider, fallbackToLocal: event.target.checked }
              })}
            />
            模型失败时使用本地模板兜底
          </label>
          <p className="field-hint">兼容 OpenAI Chat Completions 格式的中转站。API Key 会保存在本机设置中；如果模型较慢，建议把超时调到 120-180 秒。</p>
          {aiTestStatus && (
            <div className={`audio-message ${aiTestStatus.tone}`} role="status">
              {aiTestStatus.text}
            </div>
          )}
        </div>

        <div className="panel settings-data-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Data & Export</span>
              <h2>数据与导出</h2>
              <span className="settings-subtitle">最近 JSON 备份：{lastExportLabel}</span>
            </div>
            <FileJson size={20} />
          </div>
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
            <button className="secondary-button" type="button" onClick={() => downloadTextFile("anki-cards.csv", exportAnkiCsv(data), "text/csv")}>
              <Download size={17} />
              Anki CSV
            </button>
            <button className="secondary-button" type="button" onClick={() => downloadTextFile("vocab-notes.md", exportMarkdown(data), "text/markdown")}>
              <Download size={17} />
              Markdown 笔记
            </button>
          </div>
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
              <button className="danger-button" type="button" onClick={confirmReset}>
                <RotateCcw size={17} />
                {resetArmed ? "确认重置" : "重置本地数据"}
              </button>
            </div>
          </div>
          {restoreMessage && (
            <div className={`restore-message ${restoreMessage.tone}`} role="status">
              {restoreMessage.text}
            </div>
          )}
        </div>

        <div className="panel dictionary-panel settings-system-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">System Status</span>
              <h2>系统状态</h2>
            </div>
            <ShieldCheck size={20} />
          </div>
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
        </div>
      </section>
    </div>
  );
}
