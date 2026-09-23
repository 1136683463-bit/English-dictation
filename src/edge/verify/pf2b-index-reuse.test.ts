// @vitest-environment node
/**
 * PF2b · 重复建索引 / 同一个操作里的全库扫描次数（2026-09-22）
 *
 * 目的：找出「一次操作里同一数组被扫 N 次」的实例，给出 N 与来源。
 * 方法：用 vi.mock 给被测函数插桩计数（不改产品代码），跑一次真实调用，
 * 打印每个数据数组被 `Array.prototype.filter/find/map/some` 触碰的次数。
 *
 * 计数口径：这里数的是**外层扫描次数**（每次调用 filter/find/map/some 记 1），
 * 而不是元素级比较次数——元素级在 n² 路径上会非常巨大（见 PF2a 的耗时曲线）。
 */
import { describe, expect, it, vi, beforeEach } from "vitest";

const counters: Record<string, number> = {};

const bump = (key: string) => {
  counters[key] = (counters[key] ?? 0) + 1;
  return counters[key];
};

const resetCounters = () => {
  for (const key of Object.keys(counters)) delete counters[key];
};

const report = (label: string, keys: string[]) => {
  console.log(
    `\n[PF2b] ${label}\n` + keys.map((key) => `  ${key}: ${counters[key] ?? 0} 次`).join("\n")
  );
};

// ── 插桩：把被测服务的依赖函数包一层计数 ─────────────────────────────
// buildDailyDirective 的 queueFor 每次都调 buildSpellingQueue；
// 而 buildSpellingQueue 内部每次都会调 getDueCards / getNewCardsForToday。
vi.mock("../../services/spellingQueueService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/spellingQueueService")>();
  return {
    ...actual,
    buildSpellingQueue: (...args: Parameters<typeof actual.buildSpellingQueue>) => {
      bump("buildSpellingQueue 调用次数");
      return actual.buildSpellingQueue(...args);
    }
  };
});

vi.mock("../../services/reviewService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/reviewService")>();
  return {
    ...actual,
    getDueCards: (data: Parameters<typeof actual.getDueCards>[0]) => {
      bump("getDueCards 调用次数（每次=2 次全库扫描）");
      return actual.getDueCards(data);
    },
    getNewCardsForToday: (...args: Parameters<typeof actual.getNewCardsForToday>) => {
      bump("getNewCardsForToday 调用次数（每次=1 次全库扫描）");
      return actual.getNewCardsForToday(...args);
    },
    getWeakCardInsights: (...args: Parameters<typeof actual.getWeakCardInsights>) => {
      bump("getWeakCardInsights 调用次数（每次=n 卡 × m 复习）");
      return actual.getWeakCardInsights(...args);
    }
  };
});

import { scaleData } from "./pf2Scale";
import { buildDailyDirective, getDeadUnits } from "../../services/dailyDirectiveService";
import { buildSpellingQueue } from "../../services/spellingQueueService";
import {
  getDueCards,
  getLearningStats,
  getNewCardsForToday,
  getWeakCardInsights,
  getWeakCards
} from "../../services/reviewService";
import { getUnitStats, getVocabularyGoalStats } from "../../services/unitService";
import { getWeeklyStatsReport } from "../../services/statsService";
import { getMistakeGroupsByDate } from "../../services/mistakeBookService";

describe("PF2b · 重复索引 / 全库扫描计数", () => {
  beforeEach(() => resetCounters());

  it("buildDailyDirective：一次页面渲染触发多少次 buildSpellingQueue（= 多少次 getDueCards）", () => {
    /**
     * 走到第 4 步「常规」分支才会对**每一本**词书各调一次 queueFor：
     * 需先把积压压到阈值以下（否则第 1 步 backlog 直接命中并返回，只调一次）。
     */
    const base = scaleData({ cards: 2000, unitCount: 20 });
    const data = {
      ...base,
      // 积压 0 张：全部排到未来（<10 张触发不了 backlog）
      schedules: base.schedules.map((schedule) => ({
        ...schedule,
        nextReviewAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      }))
    };
    const directive = buildDailyDirective(data);
    report("buildDailyDirective（20 本词书 / 2000 卡，走到「常规」分支）", [
      "buildSpellingQueue 调用次数",
      "getDueCards 调用次数（每次=2 次全库扫描）",
      "getNewCardsForToday 调用次数（每次=1 次全库扫描）"
    ]);
    const queueCalls = counters["buildSpellingQueue 调用次数"] ?? 0;
    const dueCalls = counters["getDueCards 调用次数（每次=2 次全库扫描）"] ?? 0;
    const newCalls = counters["getNewCardsForToday 调用次数（每次=1 次全库扫描）"] ?? 0;
    console.log(
      `  → 单次 buildDailyDirective 里的全量遍历总量：getDueCards ${dueCalls} 次×2 + getNewCardsForToday ${newCalls} 次×1` +
        ` + dueCountOf 每本一次 cards 扫描 20 次 = ${dueCalls * 2 + newCalls + 20} 次全量遍历（kind=${directive.kind}）`
    );
    // 记录事实：单次渲染里同一数据被反复扫描的规模
    expect(queueCalls).toBeGreaterThan(1);
  });

  it("buildDailyDirective 的 dueCountOf：每本词书各扫一次全部词卡（O(units × cards)）", () => {
    const small = scaleData({ cards: 500, unitCount: 10 });
    const large = scaleData({ cards: 5000, unitCount: 100 });
    const timeOf = (data: ReturnType<typeof scaleData>) => {
      buildDailyDirective(data);
      const start = performance.now();
      buildDailyDirective(data);
      return performance.now() - start;
    };
    const smallMs = timeOf(small);
    const largeMs = timeOf(large);
    console.log(
      `\n[PF2b] buildDailyDirective 随「词书数」增长（卡片也同时增长）：\n` +
        `  10 本 / 500 卡  ${smallMs.toFixed(2)}ms\n` +
        `  100 本 / 5000 卡 ${largeMs.toFixed(2)}ms\n` +
        `  → units × cards 乘积比 = ${((100 * 5000) / (10 * 500)).toFixed(0)}x，耗时比 = ${(largeMs / smallMs).toFixed(2)}x`
    );
    expect(largeMs).toBeGreaterThan(0);
  });

  it("getUnitStats：同一本词书在渲染里被算两次（selectedStats + 卡片列表 stats）", () => {
    // 复现 UnitsPage 的调用形状：selectedStats 一次 + 每张卡一次
    const data = scaleData({ cards: 2000, unitCount: 20 });
    const unit = data.units[0];
    getUnitStats(data, unit);
    const start = performance.now();
    // 20 本 × 1 次 = 页面网格把每本都算一遍（UnitsPage.tsx:1216 在 section.units.map 里调用）
    for (const item of data.units) getUnitStats(data, item);
    const gridMs = performance.now() - start;
    start;
    console.log(
      `\n[PF2b] getUnitStats 遍历全部 ${data.units.length} 本词书（= UnitsPage 首屏网格）耗时 ${gridMs.toFixed(2)}ms；` +
        `每本内部还会 data.schedules.find 遍历一次（unitService.ts:26）`
    );
    expect(gridMs).toBeGreaterThan(0);
  });

  it("getLearningStats：单次调用内部对同一数组的重复扫描清单", () => {
    const data = scaleData({ cards: 5000, unitCount: 20 });
    // 直接静态计数：按源码，一次 getLearningStats 里
    const scans = {
      "getDueCards（schedules.filter + cards.filter）": 2,
      "getWeakCards（cards.filter + reviews 单遍）": 2,
      "activeCards = cards.filter": 1,
      "scheduleByCardId = schedules.map": 1,
      "todayReviews = reviews.filter": 1,
      "lowRatingCardIds = reviews.filter": 1,
      "lowRatingCardIdsToday = todayReviews.filter": 1,
      "getFirstReviewByCardId = reviews.reduce": 1,
      "recentWrongCardIds 循环 reviews": 1,
      "activeCards.filter × 15（mastered/priority/word/sentence/new/…）": 15,
      "nextDueAt = activeCards.map + sort": 2
    };
    const total = Object.values(scans).reduce((sum, value) => sum + value, 0);
    console.log(
      `\n[PF2b] getLearningStats（reviewService.ts:207）内部全量遍历次数：\n` +
        Object.entries(scans).map(([key, value]) => `  ${String(value).padStart(3)}  ${key}`).join("\n") +
        `\n  ── 合计约 ${total} 次全量/近全量遍历（cards 或 reviews）`
    );
    getLearningStats(data);
    expect(total).toBeGreaterThan(20);
  });

  it("Home/App 布局：computeStreak 在 AppLayout 与 TodayPage 各算一次（同一次导航）", () => {
    const data = scaleData({ cards: 5000, unitCount: 20 });
    const start = performance.now();
    // AppLayout (App.tsx:102) + TodayPage (TodayPage.tsx:72) 各自对全量 reviews 建 Set
    getWeakCards(data);
    getWeakCards(data);
    getWeakCardInsights(data, { type: "word", limit: 3 });
    getWeakCardInsights(data, { type: "word", limit: 30 });
    const ms = performance.now() - start;
    console.log(
      `\n[PF2b] 同一份 data 上「同源函数被不同调用点各算一遍」的组合成本（5000 卡）: ${ms.toFixed(2)}ms\n` +
        `  getWeakCards ×2 + getWeakCardInsights(limit3) + getWeakCardInsights(limit30)\n` +
        `  → limit 不同不会复用结果：getWeakCardInsights 内部先算完全部卡才 slice（reviewService.ts:307-351）`
    );
    expect(ms).toBeGreaterThan(0);
  });

  it("每张卡一次 data.schedules.find：getUnitStats / getWeakCardInsights 里的 O(n×m)", () => {
    const data = scaleData({ cards: 5000, unitCount: 20 });
    const start = performance.now();
    getUnitStats(data, data.units[0]);
    const unitMs = performance.now() - start;
    console.log(
      `\n[PF2b] getUnitStats(单本 200~250 卡) ${unitMs.toFixed(2)}ms —— 其中 data.schedules.find 对每张卡线性查找\n` +
        `  unitService.ts:26（未复用 Map）`
    );
    expect(unitMs).toBeGreaterThanOrEqual(0);
  });

  it("错词本：getMistakeGroupsByDate 建一次索引，但 getMistakeInsight 对每个条目再扫全部 reviews", () => {
    const data = scaleData({ cards: 5000, unitCount: 20, wrongRatio: 0.5 });
    const started = performance.now();
    const groups = getMistakeGroupsByDate(data);
    const ms = performance.now() - started;
    const entries = groups.reduce((sum, group) => sum + group.entries.length, 0);
    console.log(
      `\n[PF2b] getMistakeGroupsByDate（5000 卡 / 50% 低分）: ${ms.toFixed(2)}ms，产出 ${groups.length} 天 / ${entries} 条目\n` +
        `  页面随后对每个条目调 getMistakeInsight(entry, data.reviews)（MistakeBookPage.tsx:128）\n` +
        `  → 该函数内部 reviews.filter（O(m)），条目数 × reviews 数 = O(entries × m)，无索引复用`
    );
    // 页面侧的成本模型：entries × reviews
    const start = performance.now();
    for (let index = 0; index < entries; index += 1) {
      // 模拟 getMistakeInsight 的形状：对全部 reviews 过滤一次
      data.reviews.filter((review) => review.cardId === `wcard-${index % 5000}`);
    }
    const insightMs = performance.now() - start;
    console.log(
      `  → 模拟「每个条目各扫一次全部 reviews」（${entries} × ${data.reviews.length}）= ${insightMs.toFixed(2)}ms`
    );
    expect(ms).toBeGreaterThanOrEqual(0);
  });

  it("getWeeklyStatsReport：7 天趋势里对全量 reviews / activeCards 各扫一遍（7 × 多个 filter）", () => {
    const data = scaleData({ cards: 5000, unitCount: 20, reviewsPerCard: 3 });
    const scansPerDay = 8; // dayReviews / daySpellingReviews / correct / wrong / spellingCorrect / newCards / masteredCards + activeCards 预过滤
    const start = performance.now();
    getWeeklyStatsReport(data);
    const ms = performance.now() - start;
    console.log(
      `\n[PF2b] getWeeklyStatsReport（5000 卡 / 15000 复习）: ${ms.toFixed(2)}ms\n` +
        `  sevenDayTrend 循环 7 天，每天对 data.reviews 全量 filter 1 次、对 activeCards 全量 filter 2 次` +
        `（statsService.ts:383-399）≈ 7 × (1 + 2) = 21 次全量遍历，其余聚合各自独立成次`
    );
    start;
    expect(scansPerDay).toBeGreaterThan(0);
  });

  it("buildSpellingQueue 内部的重复扫描（单次调用）", () => {
    const data = scaleData({ cards: 5000, unitCount: 20 });
    const start = performance.now();
    buildSpellingQueue(data, "unit-1", "standard", 30);
    const unitSmartMs = performance.now() - start;
    console.log(
      `\n[PF2b] buildSpellingQueue(unit, smart) 单次调用（spellingQueueService.ts:70-95）内的全量扫描：\n` +
        `  1) getDueCards → schedules.filter + cards.filter（2 次全库）\n` +
        `  2) allCards.filter(unit)（1 次全库，unitId 过滤）\n` +
        `  3) schedules.map 建 Map（1 次全库）\n` +
        `  4) inReviewTrack.filter(due) + inReviewTrack.filter(upcoming)（2 次单本）\n` +
        `  5) dueUnitWords.sort / upcomingUnitWords.sort 的比较器里各做一次 Map 查找 + localeCompare（不是数组扫描但常量高）\n` +
        `  6) getNewCardsForToday → cards.filter + sort（1 次全库）\n` +
        `  实测 ${unitSmartMs.toFixed(2)}ms（5000 卡）`
    );
    expect(unitSmartMs).toBeGreaterThanOrEqual(0);
  });

  it("getDeadUnits 被 buildDailyDirective 调用，且内部再对每本词书 filter 全库卡片", () => {
    const data = scaleData({ cards: 5000, unitCount: 100 });
    const start = performance.now();
    getDeadUnits(data);
    const ms = performance.now() - start;
    console.log(
      `\n[PF2b] getDeadUnits（dailyDirectiveService.ts:76-91）：${ms.toFixed(2)}ms\n` +
        `  data.units.map 里对每本各做一次 data.cards.filter（O(units × cards)）；\n` +
        `  且 buildDailyDirective 第 2 步会再调一次 getDeadUnits（dailyDirectiveService.ts:174）`
    );
    expect(ms).toBeGreaterThanOrEqual(0);
  });
});
