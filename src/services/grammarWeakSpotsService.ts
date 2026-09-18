import type { AppData, GrammarErrorTag } from "../types";
import {
  listGrammarEventsByKind,
  type CardMasteredEvent,
  type DiaryIssueTagEvent,
  type GrammarReviewResultEvent,
  type HuntVerdictEvent
} from "./grammarTelemetry";
import { GRAMMAR_ERROR_TAG_LABELS, GRAMMAR_ERROR_TAG_PLAIN, findErrorAt, GRAMMAR_ERROR_TAGS } from "./huntService";
import { huntCases } from "../data/huntCases";
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
  huntNotError: 0.5
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

export const computeWeakSpotsReport = (data: AppData, now = Date.now()): WeakSpotsReport => {
  const stats = new Map<GrammarErrorTag, TagStat>();
  const statFor = (tag: GrammarErrorTag): TagStat => {
    let stat = stats.get(tag);
    if (!stat) {
      stat = { score: 0, recentCount: 0, totalCount: 0, lastTs: 0, examples: [], relatedCardIds: new Set() };
      stats.set(tag, stat);
    }
    return stat;
  };
  const bump = (tag: GrammarErrorTag, weight: number, ts: string, example?: string, cardId?: string) => {
    const stat = statFor(tag);
    const time = new Date(ts).getTime();
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
      relatedCardIds: [...stat.relatedCardIds]
    });
  }

  active.sort((a, b) => b.score - a.score || b.recentCount - a.recentCount);
  healed.sort((a, b) => b.healedAt.localeCompare(a.healedAt));
  return { active: active.slice(0, TOP_LIMIT), healed };
};

/** 日记句子卡在复习队列里的定位方式与 addDiarySentenceToReview 一致：sourceId = diary:<entryId>。 */
const cardIdForDiary = (data: AppData, entryId: string): string | undefined =>
  data.cards.find((card) => card.type === "sentence" && card.sourceId === `diary:${entryId}`)?.id;

/** 把弱点关联的卡片全部排到今天到期：一键「今天复习它」。 */
export const scheduleCardsForToday = (data: AppData, cardIds: string[]): AppData => {
  const ids = new Set(cardIds.filter(Boolean));
  if (ids.size === 0) return data;
  const stamp = nowIso();
  return {
    ...data,
    schedules: data.schedules.map((schedule) =>
      ids.has(schedule.cardId) ? { ...schedule, nextReviewAt: stamp } : schedule
    )
  };
};
