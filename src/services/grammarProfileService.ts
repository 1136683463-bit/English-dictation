import type { AppData, GrammarErrorTag } from "../types";
import { grammarLessons } from "../data/grammarLessons";
import { GRAMMAR_ERROR_TAG_LABELS, GRAMMAR_ERROR_TAG_PLAIN, GRAMMAR_ERROR_TAGS } from "./huntService";
import { listGrammarEventsByKind } from "./grammarTelemetry";
import { computeWeakSpotsReport } from "./grammarWeakSpotsService";
import { summarizeGrammarMastery } from "./grammarReviewService";
import { LESSON_GROUPS } from "../data/grammarSeasons";

/**
 * ④ 语法能力画像（2026-09-22）。
 *
 * 与既有模块的分工（避免「同一件事说第四遍」）：
 * - 弱点卡（Top3）：只讲**当前最该修的**负面问题 + 下一步动作
 * - 本画像：讲**全貌与进展**——课程覆盖、按罪名的状态分布、时间趋势、已战胜的
 *   （`healed` 数据此前只在弱点卡里以一行小字出现，从未被正面呈现）
 *
 * 三个维度：
 * 1. **覆盖面**：课程进度（几课/几季）+ 复习队列掌握度
 * 2. **罪名状态谱**：每个罪名处于「已战胜 / 稳定 / 需关注」哪一档
 *    （不是只列弱点——把好的也说出来，这是动机来源）
 * 3. **时间趋势**：近 4 周每周的犯错次数（看出「在变好还是变糟」）
 *
 * 纪律：纯本地计算，零 AI；不新增事件（复用既有遥测）；零术语守门。
 */

/** 单个罪名的状态档。 */
export type TagStatus = "healed" | "stable" | "attention";

export interface TagProfile {
  tag: GrammarErrorTag;
  label: string;
  plain: string;
  status: TagStatus;
  /** 近 7 天犯错次数。 */
  recentCount: number;
  /** 累计次数。 */
  totalCount: number;
  /** 确证治愈时间（status === "healed" 时）。 */
  healedAt?: string;
  /** 最近一次复盘练习后的新增犯错（沿用弱点卡的成效信号）。 */
  mistakesSinceReplay?: number;
}

export interface WeeklyTrendPoint {
  /** 窗口起始日（本地，YYYY-MM-DD）。 */
  weekStart: string;
  /** 该窗口内的犯错次数（滚动 7 天；与 summary.weekOverWeek 同源口径）。 */
  mistakes: number;
  /** 展示标签（「最近 7 天」/「N 周前」）——由服务算好，避免页面各算一套。 */
  label: string;
}

export interface GrammarProfile {
  /** 课程覆盖：已完课 / 总课数。 */
  lessonsDone: number;
  lessonsTotal: number;
  /** 季覆盖：已完整学完的季数 / 总季数。 */
  seasonsDone: number;
  seasonsTotal: number;
  /** 复习队列掌握度。 */
  mastery: { mastered: number; inProgress: number; notStarted: number; total: number };
  /** 罪名状态谱（按「需关注 → 稳定 → 已战胜」排序，全罪名覆盖）。 */
  tags: TagProfile[];
  /** 近 4 周趋势（旧的在前）。 */
  trend: WeeklyTrendPoint[];
  /** 汇总数字（一句话概括用）。 */
  summary: {
    healedCount: number;
    attentionCount: number;
    /** 近 7 天犯错总数。 */
    recentMistakes: number;
    /** 与前 7 天相比的变化（负数 = 减少 = 变好）。 */
    weekOverWeek: number | null;
  };
  /** 是否数据太少、不值得展示画像（少于阈值时调用方应隐藏入口）。 */
  isEmpty: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const RECENT_WINDOW_MS = 7 * DAY_MS;
/** 画像至少要有的数据量（否则不展示，避免"空报表"）。 */
const MIN_DATA_POINTS = 3;

/** 本地周起始（周一）的 YYYY-MM-DD。 */
const weekStartOf = (time: number): string => {
  const date = new Date(time);
  const day = date.getDay(); // 0=周日
  const offset = day === 0 ? 6 : day - 1; // 回退到周一
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - offset);
  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, "0");
  const d = String(monday.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/** 收集所有「犯错类」事件的时间戳（与弱点档案的口径一致：真实犯错，不含复盘练习）。 */
const collectMistakeTimes = (): number[] => {
  const times: number[] = [];
  const pushAll = (events: Array<{ ts?: string }>) => {
    for (const event of events) {
      const at = event.ts ? new Date(event.ts).getTime() : NaN;
      if (Number.isFinite(at)) times.push(at);
    }
  };
  pushAll(listGrammarEventsByKind("diary_issue_tag"));
  pushAll(listGrammarEventsByKind("practice_why_wrong_result"));
  // 复习失败（lapse）也算一次真实暴露
  for (const event of listGrammarEventsByKind("grammar_review_result")) {
    const review = event as { passed?: boolean; attempts?: number; ts?: string };
    if (review.passed && (review.attempts ?? 1) <= 1) continue;
    const at = review.ts ? new Date(review.ts).getTime() : NaN;
    if (Number.isFinite(at)) times.push(at);
  }
  return times;
};

/**
 * 构建能力画像。数据太少时 `isEmpty = true`（调用方据此隐藏，不给空报表）。
 */
export const buildGrammarProfile = (data: AppData, now = Date.now()): GrammarProfile => {
  // ── 课程覆盖 ──
  const lessonsTotal = grammarLessons.length;
  const lessonsDone = data.grammarLessonsDone?.length ?? 0;
  const seasonBuckets = new Map<string, { total: number; done: number }>();
  for (const lesson of grammarLessons) {
    const group = LESSON_GROUPS.find((item) => lesson.number >= item.min && lesson.number <= item.max);
    if (group) {
      const bucket = seasonBuckets.get(group.id) ?? { total: 0, done: 0 };
      bucket.total += 1;
      if (data.grammarLessonsDone?.includes(lesson.id)) bucket.done += 1;
      seasonBuckets.set(group.id, bucket);
    }
  }
  const seasonsTotal = seasonBuckets.size;
  let seasonsDone = 0;
  for (const bucket of seasonBuckets.values()) {
    if (bucket.total > 0 && bucket.done === bucket.total) seasonsDone += 1;
  }

  // ── 复习掌握度 ──
  const mastery = summarizeGrammarMastery(data);

  // ── 罪名状态谱 ──
  // 画像要全貌：传 Infinity 取全部活跃弱点（默认 TOP_LIMIT=3 会让 Top3 之外的问题消失）
  const report = computeWeakSpotsReport(data, now, Number.POSITIVE_INFINITY);
  const activeByTag = new Map(report.active.map((spot) => [spot.tag, spot]));
  const healedByTag = new Map(report.healed.map((spot) => [spot.tag, spot]));
  const tags: TagProfile[] = [];
  for (const tag of GRAMMAR_ERROR_TAGS) {
    const active = activeByTag.get(tag);
    const healed = healedByTag.get(tag);
    if (!active && !healed) continue; // 从未出现过的罪名不进画像（不制造焦虑）
    const status: TagStatus = healed && !healed.relapsed ? "healed" : active && active.recentCount > 0 ? "attention" : "stable";
    tags.push({
      tag,
      label: GRAMMAR_ERROR_TAG_LABELS[tag],
      plain: GRAMMAR_ERROR_TAG_PLAIN[tag],
      status,
      recentCount: active?.recentCount ?? 0,
      totalCount: active?.totalCount ?? 0,
      ...(healed ? { healedAt: healed.healedAt } : {}),
      ...(active && typeof active.mistakesSinceReplay === "number"
        ? { mistakesSinceReplay: active.mistakesSinceReplay }
        : {})
    });
  }
  // 排序：需关注优先（按近 7 天次数降序）→ 稳定 → 已战胜（按治愈时间倒序）
  const statusRank: Record<TagStatus, number> = { attention: 0, stable: 1, healed: 2 };
  tags.sort((a, b) => {
    if (statusRank[a.status] !== statusRank[b.status]) return statusRank[a.status] - statusRank[b.status];
    if (a.status === "healed" && b.status === "healed") {
      return (b.healedAt ?? "").localeCompare(a.healedAt ?? "");
    }
    return b.recentCount - a.recentCount || b.totalCount - a.totalCount;
  });

  // ── 近 4 周趋势 ──
  // ④ 口径修复（2026-09-22）：原用自然周（周一为界），导致「本周」是不完整的当前周
  // （例如今天周一则本周只统计了 1 天），与「最近 7 天 vs 前 7 天」的 weekOverWeek
  // 结论互相矛盾（hero 说「多了 2 次」、趋势区说「在减少」）。
  // 改为**滚动 7 天窗口**：每根柱 = 从该时刻往前 7 天的犯错数，与 hero 同源可比。
  const mistakeTimes = collectMistakeTimes();
  const trend: WeeklyTrendPoint[] = [];
  for (let back = 3; back >= 0; back -= 1) {
    const windowEnd = now - back * 7 * DAY_MS;
    const windowStart = windowEnd - 7 * DAY_MS;
    const isLatest = back === 0;
    trend.push({
      // 标签锚点：最新一根是「最近 7 天」，其余标注为「N 周前」
      weekStart: weekStartOf(windowStart),
      mistakes: mistakeTimes.filter((at) => at > windowStart && at <= windowEnd).length,
      ...(isLatest ? { label: "最近 7 天" } : { label: `${back} 周前` })
    } as WeeklyTrendPoint);
  }

  // ── 汇总 ──
  const recentMistakes = mistakeTimes.filter((at) => now - at <= RECENT_WINDOW_MS).length;
  const prevWindow = mistakeTimes.filter((at) => now - at > RECENT_WINDOW_MS && now - at <= 2 * RECENT_WINDOW_MS).length;
  const weekOverWeek = prevWindow === 0 && recentMistakes === 0 ? null : recentMistakes - prevWindow;

  return {
    lessonsDone,
    lessonsTotal,
    seasonsDone,
    seasonsTotal,
    mastery,
    tags,
    trend,
    summary: {
      healedCount: tags.filter((item) => item.status === "healed").length,
      attentionCount: tags.filter((item) => item.status === "attention").length,
      recentMistakes,
      weekOverWeek
    },
    isEmpty: lessonsDone < MIN_DATA_POINTS && mistakeTimes.length < MIN_DATA_POINTS
  };
};

