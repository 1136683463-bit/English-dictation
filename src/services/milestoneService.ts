import { computeStreakWithGrace } from "./statsService";
import { AppData } from "../types";

/**
 * 里程碑激励（PRD-wordbook-v2 P2-2，v1 P1-3 遗留）。
 *
 * 规格：streak 里程碑（连续 7/30/100 天）+ 首本词书完成；达成时 toast 庆祝一次，
 * 并在统计页「成就与概览」里沉淀为记录列表（已达成 / 进度）。
 *
 * 口径说明：
 * - 连续天数复用 computeStreakWithGrace（与指令卡 streak 同口径，含每周 1 天宽限）；
 *   断学后恢复当天 streak 从 1 重新计数（验收标准），是否再次达成由
 *   settings.reachedMilestoneIds 决定——同一里程碑只庆祝一次。
 * - 首本完成 = 任意 unit.completedAt 非空（与 P0-3 完成态同字段）。
 */

export type MilestoneKind = "streak" | "first-book";

export interface MilestoneDefinition {
  id: string;
  kind: MilestoneKind;
  /** streak：连续天数阈值；first-book：完成本数阈值（1）。 */
  threshold: number;
  title: string;
  description: string;
}

export const MILESTONES: MilestoneDefinition[] = [
  {
    id: "streak-7",
    kind: "streak",
    threshold: 7,
    title: "连续学习 7 天",
    description: "一整周不间断，学习习惯开始成形。"
  },
  {
    id: "streak-30",
    kind: "streak",
    threshold: 30,
    title: "连续学习 30 天",
    description: "一个月坚持每天见面，这已经不只是打卡了。"
  },
  {
    id: "streak-100",
    kind: "streak",
    threshold: 100,
    title: "连续学习 100 天",
    description: "三位数的坚持，词汇量只是附带奖品。"
  },
  {
    id: "first-book-complete",
    kind: "first-book",
    threshold: 1,
    title: "首本词书完成",
    description: "第一本词书全部掌握，书架上的下本在等你。"
  }
];

export interface MilestoneState {
  definition: MilestoneDefinition;
  /** 当前值：streak = 连续天数；first-book = 已完成本数。 */
  current: number;
  reached: boolean;
  /** 0-1 进度（未达成时用于记录页进度条）。 */
  progress: number;
}

export const computeMilestoneStates = (data: AppData, now = new Date()): MilestoneState[] => {
  const streak = computeStreakWithGrace(data.reviews, now).streak;
  const completedBooks = data.units.filter((unit) => Boolean(unit.completedAt)).length;
  return MILESTONES.map((definition) => {
    const current = definition.kind === "streak" ? streak : completedBooks;
    return {
      definition,
      current,
      reached: current >= definition.threshold,
      progress: Math.min(1, current / definition.threshold)
    };
  });
};

/** 已达成但还没庆祝过的里程碑（= 需要弹 toast 的集合）。 */
export const findNewlyReachedMilestones = (data: AppData, now = new Date()): MilestoneState[] => {
  const recorded = new Set(data.settings.reachedMilestoneIds ?? []);
  return computeMilestoneStates(data, now).filter((state) => state.reached && !recorded.has(state.definition.id));
};

/** 把里程碑 id 并入 settings.reachedMilestoneIds（幂等）。 */
export const markMilestonesReached = (data: AppData, milestoneIds: string[]): AppData => {
  if (milestoneIds.length === 0) return data;
  const recorded = new Set(data.settings.reachedMilestoneIds ?? []);
  milestoneIds.forEach((id) => recorded.add(id));
  return {
    ...data,
    settings: { ...data.settings, reachedMilestoneIds: [...recorded] }
  };
};
