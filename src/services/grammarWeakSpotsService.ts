import type { AppData, GrammarErrorTag } from "../types";
import {
  listGrammarEventsByKind,
  type DiaryIssueTagEvent,
  type GrammarReviewResultEvent,
  type HuntVerdictEvent
} from "./grammarTelemetry";
import { GRAMMAR_ERROR_TAG_LABELS, GRAMMAR_ERROR_TAG_PLAIN, findErrorAt } from "./huntService";
import { huntCases } from "../data/huntCases";
import { nowIso } from "./storage";

/**
 * 语法弱点档案（R08）：错误事件的「频率 × 新近」加权排序，参照 GrammarLab 的 weak spots 思路。
 * 数据源全部来自 R01 遥测：
 * - diary_issue_tag：自由输出里真实犯的错，权重最高（1.5）
 * - hunt_verdict：wrongTag=1.0（罪名归错），notError=0.5（对语法点困惑）
 * - grammar_review_result：复习失败=1.5，反复尝试后通过=0.5
 * 新近度按半衰期 7 天衰减：越久远的错越不像「当前弱点」。
 */

const HALF_LIFE_DAYS = 7;
const TOP_LIMIT = 3;

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

export const computeWeakSpots = (data: AppData, now = Date.now()): WeakSpot[] => {
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
    const weight = event.verdictKind === "wrongTag" ? 1.0 : 0.5;
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
    bump(event.tag, 1.5, event.ts, example, entry ? cardIdForDiary(data, entry.id) : undefined);
  }

  for (const event of listGrammarEventsByKind("grammar_review_result") as GrammarReviewResultEvent[]) {
    if (event.passed && event.attempts <= 1) continue;
    const card = data.cards.find((item) => item.id === event.cardId);
    // 复习卡没有结构化罪名；只有日记来源的卡片能通过 entry 的 issues 回溯到 tag——诚实归因，推不出的不计入
    if (event.sourceId?.startsWith("diary:")) {
      const entryId = event.sourceId.slice("diary:".length);
      const entry = data.diaryEntries?.find((item) => item.id === entryId);
      for (const issue of entry?.issues ?? []) {
        if (!issue.tag) continue;
        const example = issue.correction ? `${issue.original} → ${issue.correction}` : issue.original;
        bump(issue.tag, 1.0, event.ts, example, event.cardId);
      }
    }
    void card;
  }

  return [...stats.entries()]
    .map(([tag, stat]) => ({
      tag,
      label: GRAMMAR_ERROR_TAG_LABELS[tag],
      plain: GRAMMAR_ERROR_TAG_PLAIN[tag],
      score: Math.round(stat.score * 100) / 100,
      recentCount: stat.recentCount,
      totalCount: stat.totalCount,
      example: stat.examples[stat.examples.length - 1],
      relatedCardIds: [...stat.relatedCardIds]
    }))
    .sort((a, b) => b.score - a.score || b.recentCount - a.recentCount)
    .slice(0, TOP_LIMIT);
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
