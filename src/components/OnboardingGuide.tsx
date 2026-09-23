import { useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, Download, Gauge, PartyPopper, Volume2 } from "lucide-react";
import { useAppData } from "../AppContext";
import AppSelect from "./AppSelect";
import { GOAL_PRESETS } from "../services/goalPresets";
import { speakText } from "../services/speechService";
import { downloadTextFile, markDataExported } from "../services/storage";
import { exportJson } from "../services/exportService";

/**
 * R06 首次启动三步引导：试听语音 → 目标档位 → 备份说明。
 *
 * - 每步可跳过；完成或跳过后写 localStorage 标记，不再出现（按设备计，不随云同步走）。
 * - 所有选择直接写入全局 settings（即改即存，与设置页同一条 updateData 链路）。
 */

const ONBOARDING_FLAG_KEY = "onboarding-done-v1";

export const shouldShowOnboarding = (): boolean => {
  try {
    return !window.localStorage.getItem(ONBOARDING_FLAG_KEY);
  } catch {
    return false;
  }
};

export const markOnboardingDone = (): void => {
  try {
    window.localStorage.setItem(ONBOARDING_FLAG_KEY, new Date().toISOString());
  } catch {
    // 存储不可用时静默：下次启动会再出现一次，可接受。
  }
};

const PREVIEW_SENTENCE = "This is your English pronunciation preview.";

export default function OnboardingGuide() {
  const { data, setData, updateData } = useAppData();
  const [visible, setVisible] = useState(shouldShowOnboarding);
  const [step, setStep] = useState(0);
  const [previewStatus, setPreviewStatus] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  // P1-1：语法板块有自己的首访引导（R03「从第 1 课开始」），
  // 全产品听写语音引导在 /grammar/* 路由下不遮挡——不消费标记，用户进听写页时仍会看到。
  const { pathname } = useLocation();
  const isGrammarRoute = pathname.startsWith("/grammar");

  if (!visible || isGrammarRoute) return null;

  const finish = () => {
    markOnboardingDone();
    setVisible(false);
  };

  const previewVoice = async () => {
    setPreviewStatus("正在试听...");
    const played = await speakText(PREVIEW_SENTENCE, {
      lang: data.settings.speechLang,
      rate: data.settings.speechRate,
      voiceURI: data.settings.speechVoice
    });
    setPreviewStatus(played ? "试听已播放，语速和口音可以随时在设置里调整。" : "当前没有可用语音，稍后可到设置里检查系统声音。");
  };

  const applyPreset = (presetId: string) => {
    const preset = GOAL_PRESETS.find((item) => item.id === presetId);
    if (!preset) return;
    updateData((current) => ({
      ...current,
      settings: {
        ...current.settings,
        dailyNewWords: preset.dailyNewWords,
        dailyReviewLimit: preset.dailyReviewLimit,
        dailySentences: preset.dailySentences
      }
    }));
  };

  const exportBackup = () => {
    const exportedData = markDataExported(data);
    // R09：导出失败不可谎报成功——这是首启引导里唯一的数据出口。
    if (!downloadTextFile("vocab-backup.json", exportJson(exportedData), "application/json")) {
      setExportStatus("这次导出没能生成文件（可能是存储被限制或浏览器策略拦截）。可以稍后在设置页重试，或改用网页版打开。");
      return;
    }
    setData(exportedData);
    setExportStatus("已导出 JSON 备份，妥善保存这份文件即可随时恢复。");
  };

  const isPresetActive = (presetId: string) => {
    const preset = GOAL_PRESETS.find((item) => item.id === presetId);
    return Boolean(
      preset &&
        data.settings.dailyNewWords === preset.dailyNewWords &&
        data.settings.dailyReviewLimit === preset.dailyReviewLimit &&
        data.settings.dailySentences === preset.dailySentences
    );
  };

  return (
    <div className="confirm-overlay onboarding-overlay" role="presentation">
      <div
        className="confirm-dialog onboarding-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="新手引导"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="onboarding-steps" aria-label={`第 ${step + 1} 步，共 3 步`}>
          {[0, 1, 2].map((index) => (
            <span key={index} className={index === step ? "onboarding-dot active" : "onboarding-dot"} />
          ))}
        </div>

        {step === 0 && (
          <>
            <div className="confirm-dialog-icon onboarding-icon">
              <Volume2 size={20} />
            </div>
            <h2>先听听发音</h2>
            <p>听写和拼写训练都会用这个声音。选好口音和语速，点试听确认效果。</p>
            <div className="onboarding-field-row">
              <label>
                口音
                <AppSelect
                  ariaLabel="口音"
                  options={[
                    { value: "en-US", label: "美音" },
                    { value: "en-GB", label: "英音" }
                  ]}
                  value={data.settings.speechLang}
                  onChange={(value) =>
                    updateData((current) => ({
                      ...current,
                      settings: { ...current.settings, speechLang: value as typeof current.settings.speechLang }
                    }))
                  }
                />
              </label>
              <label>
                语速 {data.settings.speechRate.toFixed(1)}x
                <input
                  type="range"
                  min={0.6}
                  max={1.2}
                  step={0.1}
                  value={data.settings.speechRate}
                  onChange={(event) =>
                    updateData((current) => ({
                      ...current,
                      settings: { ...current.settings, speechRate: Number(event.target.value) }
                    }))
                  }
                />
              </label>
            </div>
            <button className="secondary-button" type="button" onClick={previewVoice}>
              <Volume2 size={16} />
              试听
            </button>
            {previewStatus && <p className="onboarding-note">{previewStatus}</p>}
          </>
        )}

        {step === 1 && (
          <>
            <div className="confirm-dialog-icon onboarding-icon">
              <Gauge size={20} />
            </div>
            <h2>定个每日目标</h2>
            <p>目标只是节奏参考，多学少学都不会被限制，之后可以随时调整。</p>
            <div className="onboarding-presets">
              {GOAL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={isPresetActive(preset.id) ? "onboarding-preset active" : "onboarding-preset"}
                  onClick={() => applyPreset(preset.id)}
                >
                  <strong>{preset.label}</strong>
                  <span>
                    {preset.dailyNewWords} 新词 · {preset.dailyReviewLimit} 复习 · {preset.dailySentences} 句子
                  </span>
                  <small>{preset.description}</small>
                  {isPresetActive(preset.id) && <CheckCircle2 size={16} className="onboarding-preset-check" />}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="confirm-dialog-icon onboarding-icon">
              <PartyPopper size={20} />
            </div>
            <h2>你的数据属于你</h2>
            <p>
              所有学习数据只保存在这台设备上。建议现在导出一份 JSON 备份；换设备或清理浏览器前，有了它就能完整恢复。
            </p>
            <button className="secondary-button" type="button" onClick={exportBackup}>
              <Download size={16} />
              立即导出 JSON 备份
            </button>
            {exportStatus && <p className="onboarding-note">{exportStatus}</p>}
          </>
        )}

        <div className="confirm-dialog-actions onboarding-actions">
          <button className="secondary-button" type="button" onClick={finish}>
            跳过引导
          </button>
          {step < 2 ? (
            <button className="primary-button" type="button" onClick={() => setStep(step + 1)}>
              下一步
            </button>
          ) : (
            <button className="primary-button" type="button" onClick={finish}>
              开始学习
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
