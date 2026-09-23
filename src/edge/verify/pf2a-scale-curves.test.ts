// @vitest-environment node
/**
 * PF2a · 复习 / 组队 / 统计关键路径的规模曲线（2026-09-22 数据规模专项）
 *
 * 变量：卡片数（= schedules 数 ≈ reviews 数）100 / 1000 / 5000 / 20000。
 * 每条路径都给出「规模 × 函数 × 毫秒」，并判明线性还是超线性。
 *
 * 判据用**超线性比**（相邻规模耗时比 vs 规模比），不依赖绝对毫秒——
 * 但绝对毫秒也一并打印，因为「超过一帧（16ms）」这个结论是用户可感知的。
 */
import { describe, expect, it } from "vitest";
import { scaleData, timeMedian, type ScaleOptions } from "./pf2Scale";
import {
  buildGrammarReviewSession,
  diversifyReviewModes,
  listDueGrammarReviewCards,
  summarizeGrammarMastery
} from "../../services/grammarReviewService";
import { buildSpellingQueue } from "../../services/spellingQueueService";
import { buildDailyDirective } from "../../services/dailyDirectiveService";
import { getLearningStats, getDueCards, getNewCardsForToday, getWeakCardInsights, getWeakCards } from "../../services/reviewService";
import { getUnitStats, getVocabularyGoalStats } from "../../services/unitService";
import { getMistakeGroupsByDate } from "../../services/mistakeBookService";
import { computeStreak, getDueForecast, getWeeklyStatsReport } from "../../services/statsService";
import { computeWeakSpotsReport } from "../../services/grammarWeakSpotsService";

/** 一帧预算：超过即用户可感知的掉帧。 */
const FRAME_MS = 16;
const SCALES = [100, 1000, 5000, 20000];

/** 每个规模测一条路径，返回 规模 → 毫秒 的曲线。 */
const curve = <T>(label: string, run: (data: ReturnType<typeof scaleData>) => T, options: Partial<ScaleOptions> = {}) => {
  const rows: Array<{ n: number; ms: number }> = [];
  for (const n of SCALES) {
    const data = scaleData({ cards: n, ...options });
    const ms = timeMedian(() => run(data), 5);
    rows.push({ n, ms });
  }
  const linearity = rows.map((row, index) => {
    if (index === 0) return "—";
    const prev = rows[index - 1];
    const scaleRatio = row.n / prev.n;
    const timeRatio = row.ms / Math.max(prev.ms, 0.0001);
    return `${timeRatio.toFixed(2)}x (规模 ${scaleRatio}x)`;
  });
  console.log(
    `\n[PF2a] ${label}\n` +
      rows.map((row, index) => `  n=${String(row.n).padStart(6)}  ${row.ms.toFixed(2).padStart(9)}ms   ${linearity[index]}`).join("\n")
  );
  return rows;
};

const overFrameAt = (rows: Array<{ n: number; ms: number }>) => rows.find((row) => row.ms > FRAME_MS)?.n ?? null;

describe("PF2a · 关键路径规模曲线", () => {
  it("复习页组会话：listDueGrammarReviewCards / buildGrammarReviewSession / diversifyReviewModes / 掌握统计", () => {
    // 语法卡占比 0.4；n(语法卡) 在 20000 总卡时 = 8000
    const due = curve("listDueGrammarReviewCards", (data) => listDueGrammarReviewCards(data), { grammarRatio: 0.4 });
    const session = curve("buildGrammarReviewSession", (data) => buildGrammarReviewSession(data), { grammarRatio: 0.4 });
    const mastery = curve("summarizeGrammarMastery", (data) => summarizeGrammarMastery(data), { grammarRatio: 0.4 });
    /**
     * ⚠️ 测量口径修正（重要）：
     * diversifyReviewModes 的**真实调用形状**是 `diversifyReviewModes(buildGrammarReviewSession(data))`
     * （GrammarReviewPage.tsx:52 / drive.ts:97），输入永远是 ≤10 张的已截断会话。
     * 若直接喂 listDueGrammarReviewCards 的**未截断**结果（几千张），会量到一个
     * 产品里不存在的 O(session²) 曲线——那是我的测量构造错误，不是缺陷。
     * 因此这里按真实形状测两种输入，并显式对照。
     */
    const diversifyRealShape = curve(
      "diversifyReviewModes(真实形状：≤10 张会话)",
      (data) => diversifyReviewModes(buildGrammarReviewSession(data), data.sentenceDetails),
      { grammarRatio: 0.4 }
    );
    // 对照：未截断输入（产品里不存在这条路径，仅用于确认会话上限是唯一保护）
    const diversifyUncapped = curve(
      "diversifyReviewModes(对照：未截断全量会话)",
      (data) => diversifyReviewModes(listDueGrammarReviewCards(data), data.sentenceDetails),
      { grammarRatio: 0.4 }
    );
    /** 只计 diversify 自身：会话在计时外先组好（否则量到的是 buildGrammarReviewSession 的成本）。 */
    const diversifyIsolated: Array<{ n: number; ms: number }> = [];
    for (const n of SCALES) {
      const data = scaleData({ cards: n, grammarRatio: 0.4 });
      const session = buildGrammarReviewSession(data);
      const ms = timeMedian(() => diversifyReviewModes(session, data.sentenceDetails), 5);
      diversifyIsolated.push({ n, ms });
    }
    console.log(
      `\n[PF2a] diversifyReviewModes 单独成本（输入 = 已截断的 ${buildGrammarReviewSession(scaleData({ cards: 20000 })).length} 张会话）\n` +
        diversifyIsolated.map((row) => `  n=${String(row.n).padStart(6)}  ${row.ms.toFixed(3).padStart(8)}ms`).join("\n") +
        `\n  → 与规模无关（输入恒为 ≤10 张），会话上限 10 是这条路径唯一的保护。`
    );

    console.log(
      `[PF2a] 超过一帧(16ms)的规模：listDue=${overFrameAt(due)} buildSession=${overFrameAt(session)} ` +
        `diversify(真实形状链)=${overFrameAt(diversifyRealShape)} diversify(未截断对照)=${overFrameAt(diversifyUncapped)} mastery=${overFrameAt(mastery)}`
    );
    expect(due.length).toBeGreaterThan(0);
    expect(session.length).toBeGreaterThan(0);
    // 会话硬上限 10 张，不随规模增长 —— 断言其确实被截断（这是唯一的保护）
    const big = scaleData({ cards: 20000 });
    expect(buildGrammarReviewSession(big).length).toBeLessThanOrEqual(10);
    // 真实输入下 diversify 自身的成本必须与规模无关
    expect(
      diversifyIsolated[3].ms,
      `diversify 自身应与规模无关：n=20000 时 ${diversifyIsolated[3].ms.toFixed(3)}ms` +
        `（未截断对照 ${diversifyUncapped[3].ms.toFixed(2)}ms）`
    ).toBeLessThan(2);
  });

  it("拼写页组队列：buildSpellingQueue（全局 / 单本 smart / 单本 all / mistakes）", () => {
    const globalQueue = curve("buildSpellingQueue(global)", (data) => buildSpellingQueue(data, null, "standard", 30));
    const smart = curve("buildSpellingQueue(unit, smart)", (data) => buildSpellingQueue(data, "unit-1", "standard", 30));
    const all = curve("buildSpellingQueue(unit, all)", (data) => buildSpellingQueue(data, "unit-1", "standard", 30), {});
    const mistakes = curve("buildSpellingQueue(mistakes)", (data) => buildSpellingQueue(data, null, "mistakes", 30));
    console.log(
      `[PF2a] 超过一帧(16ms)：global=${overFrameAt(globalQueue)} smart=${overFrameAt(smart)} all=${overFrameAt(all)} mistakes=${overFrameAt(mistakes)}`
    );
    expect(globalQueue[0].ms).toBeGreaterThanOrEqual(0);
  });

  it("每日指令：buildDailyDirective（含 getDeadUnits + 每本一次 buildSpellingQueue + 每本一次全库扫描）", () => {
    const rows = curve("buildDailyDirective", (data) => buildDailyDirective(data));
    console.log(`[PF2a] 超过一帧(16ms)的规模：${overFrameAt(rows)}`);
    expect(rows.length).toBe(SCALES.length);
  });

  it("统计/首页：getLearningStats / getDueCards / getNewCardsForToday / getWeakCards / getWeakCardInsights / 词书统计", () => {
    const stats = curve("getLearningStats", (data) => getLearningStats(data));
    const dueCards = curve("getDueCards", (data) => getDueCards(data));
    const newCards = curve("getNewCardsForToday(word)", (data) => getNewCardsForToday(data, { type: "word" }));
    const weak = curve("getWeakCards", (data) => getWeakCards(data));
    const insights = curve("getWeakCardInsights(words, limit30)", (data) => getWeakCardInsights(data, { type: "word", limit: 30 }));
    const unitStats = curve("getUnitStats(单本)", (data) => getUnitStats(data, data.units[0]));
    const goalStats = curve("getVocabularyGoalStats", (data) => getVocabularyGoalStats(data));
    console.log(
      `[PF2a] 超过一帧(16ms)：stats=${overFrameAt(stats)} due=${overFrameAt(dueCards)} new=${overFrameAt(newCards)} ` +
        `weak=${overFrameAt(weak)} insights=${overFrameAt(insights)} unit=${overFrameAt(unitStats)} goal=${overFrameAt(goalStats)}`
    );
    expect(stats.length).toBe(SCALES.length);
  });

  it("错词本 / 周报 / 弱点档案：getMistakeGroupsByDate / getWeeklyStatsReport / computeWeakSpotsReport", () => {
    const mistakeGroups = curve("getMistakeGroupsByDate", (data) => getMistakeGroupsByDate(data));
    const weekly = curve("getWeeklyStatsReport", (data) => getWeeklyStatsReport(data));
    const weakSpots = curve("computeWeakSpotsReport", (data) => computeWeakSpotsReport(data));
    const streak = curve("computeStreak", (data) => computeStreak(data.reviews));
    const forecast = curve("getDueForecast", (data) => getDueForecast(data));
    console.log(
      `[PF2a] 超过一帧(16ms)：mistake=${overFrameAt(mistakeGroups)} weekly=${overFrameAt(weekly)} ` +
        `weakSpots=${overFrameAt(weakSpots)} streak=${overFrameAt(streak)} forecast=${overFrameAt(forecast)}`
    );
    expect(mistakeGroups.length).toBe(SCALES.length);
  });

  it("复习记录数量对 getWeakCardInsights 的影响（卡片数固定 5000，reviews 1x / 4x / 10x）", () => {
    const rows: Array<{ reviewsPerCard: number; ms: number }> = [];
    for (const reviewsPerCard of [1, 4, 10]) {
      const data = scaleData({ cards: 5000, reviewsPerCard });
      const ms = timeMedian(() => getWeakCardInsights(data, { type: "word", limit: 30 }), 5);
      rows.push({ reviewsPerCard, ms });
    }
    console.log(
      `\n[PF2a] getWeakCardInsights(5000 卡) 随复习记录倍率：\n` +
        rows.map((row) => `  reviewsPerCard=${row.reviewsPerCard}  总 reviews=${5000 * row.reviewsPerCard}  ${row.ms.toFixed(2)}ms`).join("\n")
    );
    expect(rows.length).toBe(3);
  });
});
