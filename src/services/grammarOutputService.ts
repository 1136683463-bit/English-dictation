import type { AppData, GrammarErrorTag } from "../types";
import { listGrammarEvents, weeklyErrorTagCounts, type LessonStepResultEvent } from "./grammarTelemetry";
import { GRAMMAR_ERROR_TAG_LABELS } from "./huntService";
import { normalizeLessonSentence } from "./lessonService";

/**
 * 每周有效输出句数（R05，北极星口径实现）。
 *
 * 口径（2026-09-13 决策④：按句去重，保守口径）：
 * - 句子来源 = ① 课程产出段（output）通过的整句产出事件（telemetry，含无提示/半提示两档）
 *   + ② 日记完成条目（AppData.diaryEntries，status=done，一条=一句产出）；
 * - 每句按「来源 + 归一化文本」去重（同句多次产出只计一次）；
 * - 按 ISO 自然周（周一为一周起点）聚合，返回每周去重后的句数。
 *
 * 注意：日记条目的 answerEn 是用户原句；复习段的 free_type 产出在 R09 落地后也会接入本口径
 * （届时 grammar_review_result 会带 free_type mode，可在 sources 中再加一项）。
 */

export interface WeeklyEffectiveOutput {
  /** 该周周一的 YYYY-MM-DD。 */
  weekStart: string;
  /** 去重后的有效输出句数。 */
  count: number;
  /** 来源拆分（调试与复盘用）。 */
  lessonOutput: number;
  diaryOutput: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** ISO 自然周的周一（本地时区），返回 YYYY-MM-DD。 */
export const weekStartKeyOf = (date: Date): string => {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = local.getDay(); // 0=周日 … 6=周六
  const offsetToMonday = (day + 6) % 7; // 周一→0，周日→6
  const monday = new Date(local.getTime() - offsetToMonday * DAY_MS);
  const yyyy = monday.getFullYear();
  const mm = String(monday.getMonth() + 1).padStart(2, "0");
  const dd = String(monday.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const parseTs = (ts: string): Date | null => {
  const ms = Date.parse(ts);
  return Number.isFinite(ms) ? new Date(ms) : null;
};

/** 课程产出段通过事件：stepKind 为自由输出形态（free_type / free_type_hint）且 passed。 */
const isLessonOutputPass = (event: LessonStepResultEvent): boolean =>
  event.section === "output" && event.passed && event.stepKind.startsWith("free_type");

/**
 * W0 口径修复：去重键优先用事件携带的句面哈希（sentenceHash）。
 * 此前只用「课 + 题序 + 时间戳（分钟）」近似，同一句隔天重练会被重复计数；
 * 老事件没有哈希时回退旧键，历史数据不被追溯改写。
 */
const lessonOutputKey = (event: LessonStepResultEvent): string =>
  event.sentenceHash
    ? `lesson:#${event.sentenceHash}`
    : `lesson:${event.lessonId}:${event.stepIndex}:${event.ts.slice(0, 16)}`;

/**
 * 计算每周有效输出句数（含空周省略——只返回有产出的周）。
 * weeks 上限参数用于看板（如最近 8 周）；不传返回全部。
 */
export const computeWeeklyEffectiveOutput = (
  data: AppData,
  options?: { referenceDate?: Date; weeks?: number }
): WeeklyEffectiveOutput[] => {
  // 按周收集去重句集：weekStart -> Set<来源|归一化句>
  const buckets = new Map<string, Set<string>>();

  // ① 课程产出段：按句面哈希去重（新的写入侧已带 sentenceHash）。
  for (const event of listGrammarEvents()) {
    if (event.kind !== "lesson_step_result") continue;
    if (!isLessonOutputPass(event)) continue;
    const ts = parseTs(event.ts);
    if (!ts) continue;
    const weekStart = weekStartKeyOf(ts);
    const bucket = buckets.get(weekStart) ?? new Set<string>();
    bucket.add(lessonOutputKey(event));
    buckets.set(weekStart, bucket);
  }

  // ② 日记完成条目：一条 = 一句真实产出，按归一化文本去重（同一句写两次只计一次）。
  for (const entry of data.diaryEntries ?? []) {
    if (entry.status !== "done") continue;
    const text = normalizeLessonSentence(entry.answerEn ?? "");
    if (!text) continue;
    const ts = parseTs(entry.createdAt);
    if (!ts) continue;
    const weekStart = weekStartKeyOf(ts);
    const bucket = buckets.get(weekStart) ?? new Set<string>();
    bucket.add(`diary:${text}`);
    buckets.set(weekStart, bucket);
  }

  const result: WeeklyEffectiveOutput[] = [...buckets.entries()].map(([weekStart, sentences]) => {
    let lessonOutput = 0;
    let diaryOutput = 0;
    for (const key of sentences) {
      if (key.startsWith("diary:")) diaryOutput += 1;
      else lessonOutput += 1;
    }
    return { weekStart, count: sentences.size, lessonOutput, diaryOutput };
  });
  result.sort((a, b) => a.weekStart.localeCompare(b.weekStart));

  if (options?.weeks && options.weeks > 0) {
    return result.slice(-options.weeks);
  }
  return result;
};

/** 最近一周的有效输出句数（看板摘要用）。 */
export const latestWeeklyEffectiveOutput = (data: AppData): WeeklyEffectiveOutput | null => {
  const weeks = computeWeeklyEffectiveOutput(data, { weeks: 1 });
  return weeks.length > 0 ? weeks[0] : null;
};

// ── R14 周报：上周一句话结论 ──────────────────────────────────

export interface WeeklyReport {
  /** 结论对应的周（上周一的 YYYY-MM-DD）。 */
  weekStart: string;
  /** 一句话结论（"上周有效输出 23 句，三单错误比前周少 2 次"）。 */
  sentence: string;
  /** 该周有效输出句数。 */
  outputCount: number;
}

const sumTags = (counts: Partial<Record<GrammarErrorTag, number>>): number =>
  Object.values(counts).reduce((sum, value) => sum + (value ?? 0), 0);

const topTagLabel = (counts: Partial<Record<GrammarErrorTag, number>>): string | null => {
  let top: GrammarErrorTag | null = null;
  let topCount = 0;
  for (const [tag, count] of Object.entries(counts) as [GrammarErrorTag, number][]) {
    if (count > topCount) {
      top = tag;
      topCount = count;
    }
  }
  return top ? GRAMMAR_ERROR_TAG_LABELS[top] : null;
};

/**
 * R14 生成上周的一句话结论。
 * 口径：输出句数取「上周」有效输出；错误环比取「上周 vs 前周」的最高频 tag 变化。
 * 数据不足时返回 null（如上周零产出且无错误记录——没什么可说的）。
 */
export const buildLastWeekReport = (data: AppData, referenceDate = new Date()): WeeklyReport | null => {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const local = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const thisMonday = new Date(local.getTime() - ((local.getDay() + 6) % 7) * DAY_MS);
  const lastMonday = new Date(thisMonday.getTime() - 7 * DAY_MS);
  const weekStart = `${lastMonday.getFullYear()}-${String(lastMonday.getMonth() + 1).padStart(2, "0")}-${String(lastMonday.getDate()).padStart(2, "0")}`;

  // 上周有效输出句数
  const lastWeekOutput = computeWeeklyEffectiveOutput(data).find((week) => week.weekStart === weekStart)?.count ?? 0;

  // 上周 vs 前周错误环比（周偏移：-1=上周，-2=前周；锚点与本周一一致，避免周日边界错位）
  const lastWeekTags = weeklyErrorTagCounts(-1, referenceDate);
  const prevWeekTags = weeklyErrorTagCounts(-2, referenceDate);
  const lastTotal = sumTags(lastWeekTags);
  const prevTotal = sumTags(prevWeekTags);
  const topTag = topTagLabel(lastWeekTags);

  if (lastWeekOutput === 0 && lastTotal === 0 && prevTotal === 0) return null;

  const parts: string[] = [];
  parts.push(lastWeekOutput > 0 ? `上周有效输出 ${lastWeekOutput} 句` : "上周没有输出记录");
  if (lastTotal > 0 && prevTotal > 0) {
    const delta = prevTotal - lastTotal;
    if (delta > 0) parts.push(topTag ? `错误比前周少 ${delta} 次（最多的是${topTag}）` : `错误比前周少 ${delta} 次`);
    else if (delta < 0) parts.push(topTag ? `错误比前周多 ${-delta} 次（最多的是${topTag}）` : `错误比前周多 ${-delta} 次`);
    else parts.push("错误数与前周持平");
  } else if (lastTotal > 0) {
    parts.push(topTag ? `记录了 ${lastTotal} 处错误（最多的是${topTag}）` : `记录了 ${lastTotal} 处错误`);
  } else if (lastWeekOutput > 0) {
    parts.push("一处错误都没有——保持住");
  }

  return { weekStart, sentence: parts.join("，") + "。", outputCount: lastWeekOutput };
};
