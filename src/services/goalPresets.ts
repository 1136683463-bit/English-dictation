/**
 * 学习目标档位预设（R06 首次引导定稿，R05 设置页档位化将复用同一份定义）。
 *
 * 数值口径：每日新词 / 复习上限 / 每日句子。
 * 「标准」= 长期以来的默认值（10/30/5），轻松与强化围绕它向两侧拉开。
 */

export interface GoalPreset {
  id: "relaxed" | "standard" | "intense";
  label: string;
  dailyNewWords: number;
  dailyReviewLimit: number;
  dailySentences: number;
  /** 一句话说明预计每日投入，给首次引导的选择卡片用。 */
  description: string;
}

export const GOAL_PRESETS: GoalPreset[] = [
  {
    id: "relaxed",
    label: "轻松",
    dailyNewWords: 5,
    dailyReviewLimit: 20,
    dailySentences: 3,
    description: "每天约 10 分钟，细水长流"
  },
  {
    id: "standard",
    label: "标准",
    dailyNewWords: 10,
    dailyReviewLimit: 30,
    dailySentences: 5,
    description: "每天约 20 分钟，稳步积累"
  },
  {
    id: "intense",
    label: "强化",
    dailyNewWords: 20,
    dailyReviewLimit: 50,
    dailySentences: 10,
    description: "每天约 40 分钟，备考冲刺"
  }
];

export const DEFAULT_GOAL_PRESET_ID: GoalPreset["id"] = "standard";
