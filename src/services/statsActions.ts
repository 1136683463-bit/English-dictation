import { AlertTriangle, BookOpen, CalendarClock, Flame, ListChecks, LucideIcon } from "lucide-react";
import { HEALTH_SCORE_THRESHOLDS } from "./statsService";

// R5/R6：周报页全部行动入口的唯一构建处。入口收敛（同 destination 去重、
// 总数 ≤8）在这里以纯函数保证，视图层只渲染不决策。
// 输入为已算好的 stats/weekly 派生值，函数内不读 AppData 全量。

export type RiskTone = "red" | "blue" | "green";

export interface RiskBand {
  title: string;
  detail: string;
  metric: number;
  unit: string;
  to: string;
  icon: LucideIcon;
  tone: RiskTone;
}

export interface TodayPlanStep {
  label: string;
  detail: string;
  estimate: string;
  amount: string;
  status: string;
  to: string;
  icon: LucideIcon;
  active: boolean;
  // R6：false 时降级为非链接展示行（与主行动同 destination，保留计划信息不可点击）。
  isLink: boolean;
}

export interface StatsActionsInput {
  healthScore: number;
  dueTotal: number;
  dueReviewGoal: number;
  weakWords: number;
  activeSentences: number;
  dailySentences: number;
  consecutiveRiskCount: number;
  recentWrongTotal: number;
}

export interface StatsActions {
  reportStatus: string;
  primaryAction: { label: string; to: string };
  todayPlan: TodayPlanStep[];
  riskBands: RiskBand[];
  topRisk: RiskBand;
  // R6：风险条 tone === "green"（无风险）时不渲染为 Link。
  topRiskIsLink: boolean;
}

// 状态词统一为行动指令取向（PRD-R6/Q1）
const getReportStatus = (score: number, dueTotal: number, weakWords: number) => {
  if (dueTotal > 0) return "先清到期";
  if (weakWords > 0) return "先稳错词";
  if (score >= HEALTH_SCORE_THRESHOLDS.good) return "节奏健康";
  if (score >= HEALTH_SCORE_THRESHOLDS.steady) return "节奏可控";
  return "需要收尾";
};

// R6 入口去重的 destination 归一化：忽略 plan/limit/cardId 等训练参数；
// /review 缺省 step 视为 due（清到期），/spelling 缺省 mode 视为 default。
// 由此 /review ≡ /review?step=due（撞主行动，降级），而 /review?step=sentences ≠ /review（句子复盘保留）。
export const destinationKey = (to: string): string => {
  const [path, query = ""] = to.split("?");
  const params = new URLSearchParams(query);
  if (path === "/review") return `/review?step=${params.get("step") ?? "due"}`;
  if (path === "/spelling") return `/spelling?mode=${params.get("mode") ?? "default"}`;
  return path;
};

export const buildStatsActions = (input: StatsActionsInput): StatsActions => {
  const {
    healthScore,
    dueTotal,
    dueReviewGoal,
    weakWords,
    activeSentences,
    dailySentences,
    consecutiveRiskCount,
    recentWrongTotal
  } = input;

  const reportStatus = getReportStatus(healthScore, dueTotal, weakWords);
  const primaryAction =
    dueTotal > 0
      ? { label: "清到期复习", to: "/review" }
      : weakWords > 0
        ? { label: "练错词", to: "/spelling?mode=mistakes" }
        : { label: "继续训练", to: "/training" };

  const reviewDebtRatio = dueTotal / Math.max(1, dueReviewGoal);
  const riskBands: RiskBand[] = [
    {
      title: "连续错误",
      detail:
        consecutiveRiskCount > 0
          ? `${consecutiveRiskCount} 个词连续错 2 次以上，先做错词拼写。`
          : "没有明显连续错误，错词压力可控。",
      metric: consecutiveRiskCount,
      unit: "连错",
      to: "/spelling?mode=mistakes",
      icon: Flame,
      tone: consecutiveRiskCount > 0 ? "red" : "green"
    },
    {
      title: "近期错词趋势",
      detail:
        recentWrongTotal > 0
          ? `最近 14 天累计 ${recentWrongTotal} 次低分，到词库看来源句再巩固。`
          : "最近两周没有新的低分记录。",
      metric: recentWrongTotal,
      unit: "低分",
      to: "/library",
      icon: AlertTriangle,
      tone: recentWrongTotal >= 6 ? "red" : recentWrongTotal > 0 ? "blue" : "green"
    },
    {
      title: "复习负债",
      detail:
        dueTotal > 0
          ? `按你的每日目标，约需 ${Math.max(1, Math.ceil(dueTotal / Math.max(1, dueReviewGoal)))} 天清完。`
          : "今天没有到期负债，可以安排轻量补练。",
      metric: dueTotal,
      unit: "到期",
      to: "/review",
      icon: CalendarClock,
      tone: reviewDebtRatio >= 1.5 ? "red" : dueTotal > 0 ? "blue" : "green"
    }
  ];
  const topRisk = riskBands.find((risk) => risk.tone === "red") ?? riskBands.find((risk) => risk.tone === "blue") ?? riskBands[0];
  // R6：无风险（green）时风险条不产出链接。
  const topRiskIsLink = topRisk.tone !== "green";

  // 训练量上限（链接 limit 参数）：与展示数分离——展示数必须反映真实总量（R5）。
  const duePlanCount = Math.min(dueTotal, dueReviewGoal, 12);
  const weakPlanCount = Math.min(weakWords, 10);
  const sentencePlanCount = Math.min(activeSentences, Math.max(1, dailySentences || 5));
  // R6：队列行 4「材料补练」已删除（/library 主导航可达，与训练行动语义弱相关）。
  // 与主行动同 destination 的行降级为非链接展示行（isLink=false），保证同 destination 仅 1 个权威入口。
  const primaryKey = destinationKey(primaryAction.to);
  const withLinkFlag = (step: Omit<TodayPlanStep, "isLink">): TodayPlanStep => ({
    ...step,
    isLink: destinationKey(step.to) !== primaryKey
  });
  const todayPlan: TodayPlanStep[] = [
    withLinkFlag({
      label: "清到期复习",
      detail: dueTotal > 0 ? "先把复习负债压住，避免明天滚雪球。" : "暂无到期卡，保留轻量热身即可。",
      estimate: dueTotal > 0 ? "3-4 分钟" : "可跳过",
      // R5：amount 展示真实 dueTotal（不再被 cap 12 截断）；limit 参数仍是训练量上限。
      amount: dueTotal > 0 ? `${dueTotal} 张` : "0 张",
      status: dueTotal > 0 ? "优先" : "跳过",
      to: dueTotal > 0 ? `/review?plan=today&step=due&limit=${duePlanCount}` : "/training",
      icon: CalendarClock,
      active: dueTotal > 0
    }),
    withLinkFlag({
      label: "错词拼写",
      detail: weakWords > 0 ? "只练薄弱词，优先修复最近容易错的声音和拼写。" : "暂无明显错词，不强行加练。",
      estimate: weakWords > 0 ? "3 分钟" : "可跳过",
      amount: weakWords > 0 ? `${weakPlanCount} 个` : "0 个",
      status: weakWords > 0 ? "专项" : "跳过",
      to: weakWords > 0 ? `/spelling?mode=mistakes&plan=today&limit=${weakPlanCount}` : "/spelling",
      icon: Flame,
      active: weakWords > 0
    }),
    withLinkFlag({
      label: "句子复盘",
      detail: activeSentences > 0 ? "用句子卡把词放回语境，补一点语感。" : "还没有句子卡，先加一条真实句子。",
      estimate: activeSentences > 0 ? "2 分钟" : "1 分钟",
      amount: activeSentences > 0 ? `${sentencePlanCount} 句` : "待添加",
      status: activeSentences > 0 ? "语境" : "补素材",
      to: activeSentences > 0 ? `/review?plan=today&step=sentences&limit=${sentencePlanCount}` : "/add",
      icon: ListChecks,
      active: activeSentences > 0
    })
  ];

  return { reportStatus, primaryAction, todayPlan, riskBands, topRisk, topRiskIsLink };
};
