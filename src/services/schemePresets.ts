import type { Settings } from "../types";

/**
 * R09 学习方案 preset：跨字段的一键组合（目标档位 + 行为开关），
 * 与 R05 单字段档位 chips 互补——方案面向"备考/积累"两种典型场景。
 */
export interface StudyScheme {
  id: string;
  label: string;
  description: string;
  settings: Partial<Settings>;
}

export const STUDY_SCHEMES: StudyScheme[] = [
  {
    id: "exam-sprint",
    label: "备考冲刺",
    description: "短期高强度：20 新词 / 50 复习 / 10 句子，严格标点，语速 1.0x 贴近考试节奏。",
    settings: {
      dailyNewWords: 20,
      dailyReviewLimit: 50,
      dailySentences: 10,
      strictPunctuation: true,
      autoSpeakInSpelling: true,
      speechRate: 1.0
    }
  },
  {
    id: "daily-accum",
    label: "日常积累",
    description: "长期轻负担：10 新词 / 30 复习 / 5 句子，宽松标点，语速 0.9x 便于跟读。",
    settings: {
      dailyNewWords: 10,
      dailyReviewLimit: 30,
      dailySentences: 5,
      strictPunctuation: false,
      autoSpeakInSpelling: true,
      speechRate: 0.9
    }
  }
];

/** 当前设置与某套方案完全一致时返回其 id，否则 null（显示为未选中/自定义状态）。 */
export const matchStudyScheme = (settings: Settings): string | null => {
  const hit = STUDY_SCHEMES.find((scheme) =>
    Object.entries(scheme.settings).every(
      ([key, value]) => settings[key as keyof Settings] === value
    )
  );
  return hit ? hit.id : null;
};
