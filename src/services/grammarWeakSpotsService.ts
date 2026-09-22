import type { AppData, GrammarErrorTag } from "../types";
import {
  listGrammarEventsByKind,
  type CardMasteredEvent,
  type DiaryIssueTagEvent,
  type GrammarReviewResultEvent,
  type HuntVerdictEvent
} from "./grammarTelemetry";
import type { GrammarReplayCompletedEvent, PracticeWhyWrongResultEvent } from "./grammarTelemetry";
import { GRAMMAR_ERROR_TAG_LABELS, GRAMMAR_ERROR_TAG_PLAIN, findErrorAt, GRAMMAR_ERROR_TAGS } from "./huntService";
import { findZeroTermHits } from "../data/grammarZeroTerms";
import { huntCases } from "../data/huntCases";
import { grammarLessons } from "../data/grammarLessons";
import { nowIso } from "./storage";

/**
 * 语法弱点档案（R08）：错误事件的「频率 × 新近」加权排序，参照 GrammarLab 的 weak spots 思路。
 * 数据源全部来自 R01 遥测：
 * - diary_issue_tag：自由输出里真实犯的错，权重最高（1.5）
 * - hunt_verdict：wrongTag=1.0（罪名归错），notError=0.5（对语法点困惑）
 * - grammar_review_result：复习失败=1.5，反复尝试后通过=0.5
 * 新近度按半衰期 7 天衰减：越久远的错越不像「当前弱点」。
 *
 * W0 修正（2026-09-18）：注释声明的权重此前与代码不符（复习失败按 1.0 计入）；
 * 现按声明落地——复习失败 1.5 / 反复通过 0.5，hunt wrongTag 1.0 / notError 0.5。
 */

const HALF_LIFE_DAYS = 7;
const TOP_LIMIT = 3;

/** 权重表（唯一来源，注释与代码共用同一组常量，防止再次漂移）。 */
export const WEAK_SPOT_WEIGHTS = {
  /** 自由输出犯错：最接近「真实使用中的短板」，权重最高。 */
  diaryIssue: 1.5,
  /** 复习失败（卡壳或看过答案）——说明尚未内化。 */
  reviewLapse: 1.5,
  /** 复习多次尝试后通过——有摩擦但最终取出。 */
  reviewStruggle: 0.5,
  /** 侦探里罪名归错。 */
  huntWrongTag: 1.0,
  /** 侦探里把没问题的词当成错（对语法点的困惑）。 */
  huntNotError: 0.5,
  /**
   * B3（M2，2026-09-21）：用户对 AI 讲解点「讲错了」。
   * 高信号——用户明确说这个罪名下面的解释对不上，比「追问」（0.5）更硬，
   * 但仍低于真实犯错（diary 1.5）——避免一条错反馈把某罪名顶到榜首。
   */
  aiExplainWrong: 0.8,
  /**
   * C4（M3）复盘课：一次通过 =「这个弱点确实在好转」，是**负权重**信号。
   * 弱点档案本质是权重累加模型，此前复盘课练完不写任何信号——
   * 用户练了，系统不知道，弱点权重照旧。这条把闭环接上。
   */
  replayFirstTry: -0.6,
  /** 复盘课里多次才过：仍需巩固（正权重，低于真实犯错）。 */
  replayStruggle: 0.4
} as const;

const decay = (ts: string, now: number): number => {
  const time = new Date(ts).getTime();
  if (!Number.isFinite(time)) return 0.25;
  const ageDays = Math.max(0, (now - time) / (24 * 60 * 60 * 1000));
  return Math.pow(0.5, ageDays / HALF_LIFE_DAYS);
};

const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

interface TagStat {
  score: number;
  recentCount: number;
  totalCount: number;
  lastTs: number;
  examples: string[];
  relatedCardIds: Set<string>;
  lastReplayedAt?: string;
  /** 该罪名下的犯错事件时间戳（仅用于算「练后新增」，不含复盘事件本身）。 */
  mistakeTimes: number[];
}

export interface WeakSpot {
  tag: GrammarErrorTag;
  label: string;
  plain: string;
  score: number;
  recentCount: number;
  totalCount: number;
  /** 最近的一条例证（如 "go → goes" 或原句）。 */
  example?: string;
  /** 可一键排进今日复习的关联卡片（来自复习失败记录 / 日记句子卡）。 */
  relatedCardIds: string[];
  /** C4 闭环：最近一次复盘课练习该弱点的时间（用于显示「已练过」）。 */
  lastReplayedAt?: string;
  /**
   * ② 练习成效：上次复盘练习**之后**的新增犯错次数。
   * 0 = 练完之后没再摔过（最好的信号）；undefined = 还没练过。
   * 这是「练了有没有用」的直接答案——此前只有「最近练过：今天」，看不到成效。
   */
  mistakesSinceReplay?: number;
}

/** R06 确证治愈：某罪名下有卡首次跃迁 mastered，且此后未再犯——是「确证」，不是「遗忘」。 */
export interface HealedSpot {
  tag: GrammarErrorTag;
  label: string;
  plain: string;
  /** 确证治愈时间（该罪名下最近一次 card_mastered）。 */
  healedAt: string;
  /** 治愈后该罪名是否又犯过（false = 已战胜；true = 回潮，回到活跃榜）。 */
  relapsed: boolean;
}

export interface WeakSpotsReport {
  /** 活跃弱点 Top N（当前反复犯的）。 */
  active: WeakSpot[];
  /** 已战胜的罪名（确证治愈且未回潮）——「我会了」的正向确证列表。 */
  healed: HealedSpot[];
}

export const computeWeakSpots = (data: AppData, now = Date.now()): WeakSpot[] => computeWeakSpotsReport(data, now).active;

/**
 * C1（M3，2026-09-21）弱点叙事：把已算好的加权排序讲成一句人话。
 *
 * 背景（竞析/瑞思交叉结论）：智能体缺的不是"再多一个问答框"，而是**把已有的确定性决策
 * 用语言表达出来**——弱点档案（频率×7天半衰期）已在跑、回马枪已按它抽题，
 * 但没有任何一句话告诉用户"你最近总在这摔"。
 *
 * 纪律：**纯本地模板、零 AI、零延迟**。事实（次数/趋势）本地算，不让 AI 编数字。
 * 无基线（首几周没有上一周数据）时降级为绝对陈述，不硬凑趋势。
 */
export interface WeakSpotNarrative {
  /** 叙事句（面向用户的一段人话）。 */
  text: string;
  /** 指向的课（按罪名反查第一门含该罪名的课）——"去练一遍"的落点。 */
  lessonId?: string;
  lessonTitle?: string;
  lessonNumber?: number;
}

/** 趋势对比的观察窗（天）：本周 vs 上一周。 */
const NARRATIVE_WINDOW_DAYS = 7;

/**
 * 生成弱点叙事。取 Top1 弱点，比较「近 7 天」与「上一个 7 天」的次数：
 * - 有基线且上升 → 「比上上周多了 N 次」
 * - 有基线且下降 → 「比上上周少了 N 次，在好转」
 * - 无基线 → 绝对陈述（不硬凑趋势）
 */
export const buildWeakSpotNarrative = (
  data: AppData,
  now = Date.now(),
  options?: { interventionPresent?: boolean }
): WeakSpotNarrative | null => {
  const interventionPresent = options?.interventionPresent ?? false;
  const { active } = computeWeakSpotsReport(data, now);
  const top = active[0];
  if (!top || top.totalCount === 0) return null;

  // 前一窗口次数：复用同一套事件源，只换时间窗
  const dayMs = 24 * 60 * 60 * 1000;
  const prevWindowStart = now - NARRATIVE_WINDOW_DAYS * 2 * dayMs;
  const prevWindowEnd = now - NARRATIVE_WINDOW_DAYS * dayMs;
  let prevCount = 0;
  for (const event of listGrammarEventsByKind("practice_why_wrong_result") as PracticeWhyWrongResultEvent[]) {
    if (event.errorTag !== top.tag) continue;
    const at = new Date(event.ts).getTime();
    if (Number.isFinite(at) && at >= prevWindowStart && at < prevWindowEnd) prevCount += 1;
  }
  for (const event of listGrammarEventsByKind("diary_issue_tag") as DiaryIssueTagEvent[]) {
    if (event.tag !== top.tag) continue;
    const at = new Date(event.ts).getTime();
    if (Number.isFinite(at) && at >= prevWindowStart && at < prevWindowEnd) prevCount += 1;
  }

  // 指向具体课：按罪名反查第一门含该罪名的课（huntCaseIds → huntCases → errors[].tag）
  let lessonId: string | undefined;
  let lessonTitle: string | undefined;
  let lessonNumber: number | undefined;
  const lessonOfTag = (tag: GrammarErrorTag) => {
    for (const lesson of grammarLessons) {
      for (const caseId of lesson.huntCaseIds ?? []) {
        const huntCase = huntCases.find((item) => item.id === caseId);
        if (huntCase && huntCase.errors.some((error) => error.tag === tag)) return lesson;
      }
    }
    return undefined;
  };
  const lesson = lessonOfTag(top.tag);
  if (lesson) {
    lessonId = lesson.id;
    lessonTitle = lesson.title;
    lessonNumber = lesson.number;
  }

  const trend =
    prevCount === 0
      ? ""
      : top.recentCount > prevCount
        ? `，比上上周多了 ${top.recentCount - prevCount} 次`
        : top.recentCount < prevCount
          ? `，比上上周少了 ${prevCount - top.recentCount} 次——在好转`
          : "，和上上周持平";

  const where = lesson ? `第 ${lesson.number} 课就是讲这个的，去练一遍？` : "点下面的「排进今日复习」练一轮。";
  // P2 走查修复：顶部介入卡（C2）已说过「你这两天都在这摔」，
  // 叙事句若原样重复会出现同屏两遍。改为在介入卡存在时换一个视角（趋势 + 下一步）。
  const text = interventionPresent
    ? `这个弱点近 7 天出现 ${top.recentCount} 次${trend}。${where}`
    : `你最近总在同一个地方摔：「${top.plain}」——近 7 天 ${top.recentCount} 次${trend}。${where}`;
  // 零术语红线优先于覆盖率：plain 文案里若带术语（如「可数名词单数」），宁可不出这句叙事
  if (findZeroTermHits(text).length > 0) return null;
  return { text, lessonId, lessonTitle, lessonNumber };
};

/**
 * C2（M3，2026-09-21）主动介入：连续 2 次同错因 → 次日推一张「你这两天都在这摔」的卡。
 *
 * 竞析核查：行业里**没有一家**公开宣称"AI 主动发现问题并介入"（最接近的 Speak 定制复习
 * 仍属被动组织）。这是唯一能领先而大厂因规模难以模仿的形态——因为我们的判定是
 * **确定性规则**（本地计数），不需要云端模型反复扫描。
 *
 * 纪律：
 * - 触发条件完全确定性：同一 errorTag 在 48 小时内出现 ≥2 次
 * - 强度拿捏：每 48 小时最多 1 张（避免"系统比我更急"的抗拒）
 * - 冷却记录在 localStorage（不进 AppData，避免污染导出数据）
 */
export interface ActiveIntervention {
  tag: GrammarErrorTag;
  label: string;
  /** 48 小时内的出现次数。 */
  count: number;
  /** 指向的课（按罪名反查）。 */
  lessonId?: string;
  lessonTitle?: string;
  lessonNumber?: number;
  /** 叙事句。 */
  text: string;
}

const INTERVENTION_WINDOW_HOURS = 48;
const INTERVENTION_MIN_COUNT = 2;
const INTERVENTION_COOLDOWN_KEY = "grammar-intervention-dismissed-v1";
const INTERVENTION_COOLDOWN_MS = 48 * 60 * 60 * 1000;

const readInterventionCooldown = (): Record<string, number> => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return {};
    const raw = window.localStorage.getItem(INTERVENTION_COOLDOWN_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
};

/** 静默本周（用户主动关掉这张卡时的冷却记录）。 */
export const dismissIntervention = (tag: GrammarErrorTag): void => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    const cooldown = readInterventionCooldown();
    cooldown[tag] = Date.now();
    window.localStorage.setItem(INTERVENTION_COOLDOWN_KEY, JSON.stringify(cooldown));
  } catch {
    // 忽略：冷却失败只是可能重复推荐，不阻断
  }
};

/**
 * 找出应该主动介入的错因。返回 null 表示当前不该打扰。
 * 冷却按 tag 维度：同一个错因 48 小时内只推一次。
 */
export const findActiveIntervention = (
  data: AppData,
  now = Date.now()
): ActiveIntervention | null => {
  const windowStart = now - INTERVENTION_WINDOW_HOURS * 60 * 60 * 1000;
  const cooldown = readInterventionCooldown();
  const counts = new Map<GrammarErrorTag, number>();

  for (const event of listGrammarEventsByKind("practice_why_wrong_result") as PracticeWhyWrongResultEvent[]) {
    const tag = event.errorTag as GrammarErrorTag | undefined;
    if (!tag || !GRAMMAR_ERROR_TAGS.includes(tag)) continue;
    const at = new Date(event.ts).getTime();
    if (!Number.isFinite(at) || at < windowStart) continue;
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  for (const event of listGrammarEventsByKind("diary_issue_tag") as DiaryIssueTagEvent[]) {
    const tag = event.tag;
    if (!GRAMMAR_ERROR_TAGS.includes(tag)) continue;
    const at = new Date(event.ts).getTime();
    if (!Number.isFinite(at) || at < windowStart) continue;
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }

  // 取窗口内次数最多的那个（并过滤冷却与门槛）
  const candidates = [...counts.entries()]
    .filter(([tag, count]) => count >= INTERVENTION_MIN_COUNT && !(cooldown[tag] && now - cooldown[tag] < INTERVENTION_COOLDOWN_MS))
    .sort((a, b) => b[1] - a[1]);
  const picked = candidates[0];
  if (!picked) return null;

  const [tag, count] = picked;
  // 指向具体课（与 C1 同一套反查）
  let lessonId: string | undefined;
  let lessonTitle: string | undefined;
  let lessonNumber: number | undefined;
  for (const lesson of grammarLessons) {
    for (const caseId of lesson.huntCaseIds ?? []) {
      const huntCase = huntCases.find((item) => item.id === caseId);
      if (huntCase && huntCase.errors.some((error) => error.tag === tag)) {
        lessonId = lesson.id;
        lessonTitle = lesson.title;
        lessonNumber = lesson.number;
        break;
      }
    }
    if (lessonId) break;
  }

  const label = GRAMMAR_ERROR_TAG_LABELS[tag];
  const plain = GRAMMAR_ERROR_TAG_PLAIN[tag] ?? label;
  const text = lessonNumber
    ? `你这两天都在这摔：「${plain}」(${count} 次)——第 ${lessonNumber} 课的重练档，几分钟就够。`
    : `你这两天都在这摔：「${plain}」(${count} 次)——先去复习里练一轮？`;
  // 零术语红线优先于推荐覆盖率：带术语的标签文案（如「可数名词单数」）不推这张卡
  if (findZeroTermHits(text).length > 0) return null;
  return { tag, label, count, lessonId, lessonTitle, lessonNumber, text };
};

export const computeWeakSpotsReport = (data: AppData, now = Date.now()): WeakSpotsReport => {
  const stats = new Map<GrammarErrorTag, TagStat>();
  const statFor = (tag: GrammarErrorTag): TagStat => {
    let stat = stats.get(tag);
    if (!stat) {
      stat = { score: 0, recentCount: 0, totalCount: 0, lastTs: 0, examples: [], relatedCardIds: new Set(), mistakeTimes: [] };
      stats.set(tag, stat);
    }
    return stat;
  };
  const bump = (tag: GrammarErrorTag, weight: number, ts: string, example?: string, cardId?: string) => {
    const stat = statFor(tag);
    const time = new Date(ts).getTime();
    // 记下犯错时刻（正权重才算犯错；复盘负权重不是犯错，另行处理）
    if (weight > 0 && Number.isFinite(time)) stat.mistakeTimes.push(time);
    stat.score += weight * decay(ts, now);
    stat.totalCount += 1;
    if (Number.isFinite(time) && now - time <= RECENT_WINDOW_MS) stat.recentCount += 1;
    if (Number.isFinite(time)) stat.lastTs = Math.max(stat.lastTs, time);
    if (example && stat.examples.length < 3) stat.examples.push(example);
    if (cardId) stat.relatedCardIds.add(cardId);
  };

  for (const event of listGrammarEventsByKind("hunt_verdict") as HuntVerdictEvent[]) {
    if (event.verdictKind === "hit" || event.verdictKind === "alreadyFound") continue;
    const weight =
      event.verdictKind === "wrongTag" ? WEAK_SPOT_WEIGHTS.huntWrongTag : WEAK_SPOT_WEIGHTS.huntNotError;
    let example: string | undefined;
    if (event.guessedTag) {
      const huntCase = huntCases.find((item) => item.id === event.caseId);
      const error = huntCase ? findErrorAt(huntCase, event.tokenIndex) : undefined;
      if (error) example = `${error.original} → ${error.correction}`;
    }
    if (event.guessedTag) bump(event.guessedTag, weight, event.ts, example);
  }

  for (const event of listGrammarEventsByKind("diary_issue_tag") as DiaryIssueTagEvent[]) {
    const entry = data.diaryEntries?.find((item) => item.id === event.entryId);
    const issue = entry?.issues[event.issueIndex];
    const example = issue ? `${issue.original} → ${issue.correction}` : undefined;
    bump(event.tag, WEAK_SPOT_WEIGHTS.diaryIssue, event.ts, example, entry ? cardIdForDiary(data, entry.id) : undefined);
  }

  // 「为什么错了」追问归因（R-WW11）：用户对某罪名反复追问 = 高信号短板。
  // 权重 0.5 保守——追问是「不懂 / 好奇」混合信号，不能与真实犯错（diary 1.5）同级。
  for (const event of listGrammarEventsByKind("practice_why_wrong_result") as PracticeWhyWrongResultEvent[]) {
    const errorTag = event.errorTag;
    if (!event.ok || !errorTag || !GRAMMAR_ERROR_TAGS.includes(errorTag as GrammarErrorTag)) continue;
    const lesson = grammarLessons.find((item) => item.id === event.lessonId);
    bump(errorTag as GrammarErrorTag, 0.5, event.ts, lesson ? `追问：${lesson.title}` : undefined);
  }

  // C4 闭环：复盘课的表现反哺弱点权重（练得顺 → 减轻；多次才过 → 记录摩擦）。
  // 此前复盘课完成后不写任何弱点信号，用户练了系统也不知道。
  for (const event of listGrammarEventsByKind("grammar_replay_completed") as GrammarReplayCompletedEvent[]) {
    for (const entry of event.perTag ?? []) {
      const tag = entry.tag as GrammarErrorTag;
      if (!GRAMMAR_ERROR_TAGS.includes(tag)) continue;
      // 一次通过 = 这个弱点在好转（负权重）；否则记一次摩擦
      const allFirstTry = entry.total > 0 && entry.firstTry === entry.total;
      const weight = allFirstTry ? WEAK_SPOT_WEIGHTS.replayFirstTry : WEAK_SPOT_WEIGHTS.replayStruggle;
      // 注意：不给 example ——那是给用户看的**真实错句**（如「I go → I goes」），
      // 复盘信号只影响权重，不该把例句覆盖成「复盘课一次通过」这类元信息。
      bump(tag, weight, event.ts);
      const stat = statFor(tag);
      // 只记最近一次（事件流按时间追加，后者覆盖前者）
      stat.lastReplayedAt = event.ts;
    }
  }

  // B3：用户点过的「讲错了」终于被听见——此前 ai_explain_feedback 全库消费方 0 个。
  // 只消费 wrong 票（helpful 不降权：降权会让已掌握的罪名迟迟不消退，语义混乱）。
  // 归因路径：反馈事件只带 lessonId/stepIndex，用同课同步的 result 事件找回 errorTag。
  const tagByStep = new Map<string, string>();
  for (const event of listGrammarEventsByKind("practice_why_wrong_result") as PracticeWhyWrongResultEvent[]) {
    if (event.errorTag) tagByStep.set(`${event.lessonId}#${event.stepIndex}`, event.errorTag);
  }
  for (const event of listGrammarEventsByKind("practice_why_wrong_feedback")) {
    const feedback = event as { lessonId: string; stepIndex: number; verdict: string; ts: string };
    if (feedback.verdict !== "wrong") continue;
    const tag = tagByStep.get(`${feedback.lessonId}#${feedback.stepIndex}`);
    if (!tag || !GRAMMAR_ERROR_TAGS.includes(tag as GrammarErrorTag)) continue;
    const lesson = grammarLessons.find((item) => item.id === feedback.lessonId);
    bump(tag as GrammarErrorTag, WEAK_SPOT_WEIGHTS.aiExplainWrong, feedback.ts, lesson ? `讲错了：${lesson.title}` : undefined);
  }

  for (const event of listGrammarEventsByKind("grammar_review_result") as GrammarReviewResultEvent[]) {
    if (event.passed && event.attempts <= 1) continue;
    // 复习没一次过：看过答案 = 尚未内化（1.5）；试几次才通过 = 有摩擦（0.5）。
    const reviewWeight = event.passed ? WEAK_SPOT_WEIGHTS.reviewStruggle : WEAK_SPOT_WEIGHTS.reviewLapse;
    // 复习卡没有结构化罪名；可回溯来源：① diary: 卡片能通过 entry 的 issues 回溯 tag；
    // ② hunt: 卡片（R02 起）在 grammarNote 里嵌入了稳定罪名 token [tag]。推不出的不计入（诚实归因）。
    if (event.sourceId?.startsWith("diary:")) {
      const entryId = event.sourceId.slice("diary:".length);
      const entry = data.diaryEntries?.find((item) => item.id === entryId);
      for (const issue of entry?.issues ?? []) {
        if (!issue.tag) continue;
        const example = issue.correction ? `${issue.original} → ${issue.correction}` : issue.original;
        bump(issue.tag, reviewWeight, event.ts, example, event.cardId);
      }
    } else if (event.sourceId?.startsWith("hunt:")) {
      const card = data.cards.find((item) => item.id === event.cardId);
      const details = card ? data.sentenceDetails.find((item) => item.cardId === card.id) : undefined;
      // R02 罪名 token 形如 [tag] 或 [tag:原错词]（后者区分同案同罪名的多处错词）
      const match = details?.grammarNote.match(/^\[([a-z_]+)(?::[^\]]+)?\]/);
      const tag = match?.[1] as GrammarErrorTag | undefined;
      if (tag && GRAMMAR_ERROR_TAGS.includes(tag)) {
        const example = card?.front ?? undefined;
        bump(tag, reviewWeight, event.ts, example, event.cardId);
      }
    }
  }

  // R06 确证治愈：按罪名归集 card_mastered 的最新时间；治愈后未再犯（该罪名最后犯错时间 < 治愈时间）才算「已战胜」。
  const masteredEvents = listGrammarEventsByKind("card_mastered") as CardMasteredEvent[];
  const healedAtByTag = new Map<GrammarErrorTag, number>();
  for (const event of masteredEvents) {
    if (!event.tag || !GRAMMAR_ERROR_TAGS.includes(event.tag)) continue;
    const time = new Date(event.ts).getTime();
    if (!Number.isFinite(time)) continue;
    healedAtByTag.set(event.tag, Math.max(healedAtByTag.get(event.tag) ?? 0, time));
  }

  const active: WeakSpot[] = [];
  const healed: HealedSpot[] = [];
  for (const [tag, stat] of stats.entries()) {
    const healedAt = healedAtByTag.get(tag);
    // 治愈时间晚于该罪名最后一次犯错 → 确证治愈；之后又犯了（lastTs > healedAt）→ 回潮，回到活跃榜
    const isHealed = healedAt !== undefined && stat.lastTs <= healedAt;
    if (isHealed) {
      healed.push({
        tag,
        label: GRAMMAR_ERROR_TAG_LABELS[tag],
        plain: GRAMMAR_ERROR_TAG_PLAIN[tag],
        healedAt: new Date(healedAt).toISOString(),
        relapsed: false
      });
      continue;
    }
    active.push({
      tag,
      label: GRAMMAR_ERROR_TAG_LABELS[tag],
      plain: GRAMMAR_ERROR_TAG_PLAIN[tag],
      score: Math.round(stat.score * 100) / 100,
      recentCount: stat.recentCount,
      totalCount: stat.totalCount,
      example: stat.examples[stat.examples.length - 1],
      relatedCardIds: [...stat.relatedCardIds],
      ...(stat.lastReplayedAt ? { lastReplayedAt: stat.lastReplayedAt } : {}),
      // ② 练习成效：练完之后又摔了几次（0 = 没再摔，最好的信号）
      ...(stat.lastReplayedAt
        ? {
            mistakesSinceReplay: stat.mistakeTimes.filter(
              (at) => at > new Date(stat.lastReplayedAt!).getTime()
            ).length
          }
        : {})
    });
  }

  active.sort((a, b) => b.score - a.score || b.recentCount - a.recentCount);
  healed.sort((a, b) => b.healedAt.localeCompare(a.healedAt));
  return { active: active.slice(0, TOP_LIMIT), healed };
};

/** 日记句子卡在复习队列里的定位方式与 addDiarySentenceToReview 一致：sourceId = diary:<entryId>。 */
const cardIdForDiary = (data: AppData, entryId: string): string | undefined =>
  data.cards.find((card) => card.type === "sentence" && card.sourceId === `diary:${entryId}`)?.id;

/**
 * 把弱点关联的卡片全部排到今天到期：一键「今天复习它」。
 *
 * 2026-09-21 修：此前只改 nextReviewAt，但**语法复习会话排除 intervalDays === 0 的卡**
 * （那是「从未进过复习队列」的标记，见 listDueGrammarReviewCards）。于是对一张
 * 刚入队、还没复习过的新卡点「排进今日复习」，按钮变灰显示「已排进今日复习」，
 * 复习页却一张都不出——用户被承诺了今天能复习到，实际什么都没有。
 *
 * 这里同时把 intervalDays 抬到 1（一个最小的真实间隔），让它成为队内卡；
 * 只对「本来就是 0」的卡动，已有正常间隔的卡不改（避免把 20 天间隔的卡压回 1 天）。
 */
export const scheduleCardsForToday = (data: AppData, cardIds: string[]): AppData => {
  const ids = new Set(cardIds.filter(Boolean));
  if (ids.size === 0) return data;
  const stamp = nowIso();
  return {
    ...data,
    schedules: data.schedules.map((schedule) =>
      ids.has(schedule.cardId)
        ? {
            ...schedule,
            nextReviewAt: stamp,
            intervalDays: (schedule.intervalDays ?? 0) === 0 ? 1 : schedule.intervalDays
          }
        : schedule
    )
  };
};
