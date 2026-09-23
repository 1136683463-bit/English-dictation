// @vitest-environment node
/**
 * PF2e · 幂等/缓存缺失：纯函数在同一次渲染里被重复计算的实际代价（2026-09-22）
 *
 * 只找「同输入同输出、调用频繁、且没有被任何 memo/缓存覆盖」的候选，并量化：
 *   ① 每次调用多少钱（按规模）
 *   ② 同一次页面数据准备里被算几次（多调用点各算一遍 / 同一函数内部重复算）
 *
 * 判据：一个函数若在同一次渲染中被调用 ≥2 次且当前无缓存，就是「本可共享」的浪费。
 */
import { describe, expect, it } from "vitest";
import { scaleData, timeMedian } from "./pf2Scale";
import { getLearningStats, getWeakCards, getWeakCardInsights } from "../../services/reviewService";
import { buildSpellingQueue } from "../../services/spellingQueueService";
import { buildDailyDirective } from "../../services/dailyDirectiveService";
import { computeStreak, computeStreakWithGrace, getDueForecast, getWeeklyStatsReport } from "../../services/statsService";
import { summarizeLessonProgress } from "../../services/lessonService";
import { getUnitStats } from "../../services/unitService";

const report = (label: string, ms: number) => console.log(`  ${label.padEnd(58)} ${ms.toFixed(2).padStart(9)}ms`);

describe("PF2e · 缓存候选的实际代价", () => {
  it("候选 1：getLearningStats —— 5 个页面各自直接调用（无 memo）", () => {
    const data = scaleData({ cards: 5000, unitCount: 20 });
    const ms = timeMedian(() => getLearningStats(data), 3);
    console.log(`\n[PF2e] getLearningStats（5000 卡）单次 ${ms.toFixed(2)}ms`);
    report("ReviewPage.tsx:114 (useMemo ✅)", ms);
    report("StatsPage.tsx:106 (直接调用，无 memo ✗)", ms);
    report("TodayPage.tsx:68 (直接调用，无 memo ✗)", ms);
    report("LibraryPage.tsx:233 (直接调用，无 memo ✗)", ms);
    report("AddPage.tsx:9 (直接调用，无 memo ✗)", ms);
    report("TrainingPage.tsx:26 (直接调用，无 memo ✗)", ms);
    console.log(
      `  → 有 5 个页面在**每次渲染**都直接调用它（ReadPage 之外的页面都没有 memo）。\n` +
        `     每个页面各算一次；一次导航只挂载一个路由，所以是「每次渲染 N 次」而非「N 个页面同时」。\n` +
        `     但每次渲染重算 1 次 × 内部 ~28 次全量遍历 = 每次渲染约 ${(ms * 1).toFixed(1)}ms 的固定开销。`
    );
    expect(ms).toBeGreaterThan(0);
  });

  it("候选 2：computeStreak / computeStreakWithGrace —— 同一份 reviews 在布局与页面各算一次", () => {
    const data = scaleData({ cards: 5000, unitCount: 20, reviewsPerCard: 3 });
    const raw = timeMedian(() => computeStreak(data.reviews), 3);
    const grace = timeMedian(() => computeStreakWithGrace(data.reviews), 3);
    console.log(`\n[PF2e] 连续天数（15000 条复习记录）`);
    report("computeStreak(data.reviews) 单次", raw);
    report("computeStreakWithGrace(data.reviews) 单次", grace);
    console.log(
      `  → 调用点（同一次渲染可能出现多个）：\n` +
        `     App.tsx:102  computeStreak          （AppLayout 每次渲染）\n` +
        `     TodayPage.tsx:72 computeStreak      （与布局同时存在 → 同一次渲染 2 次）\n` +
        `     StatsPage.tsx:132/211 computeStreakWithGrace（同一页面内 2 次，见下）\n` +
        `     UnitsPage/dailyDirectiveService.ts:106 computeStreakWithGrace\n` +
        `     两者都是「reviewedAt → Set<dayKey>」的纯函数：同一次渲染里布局 + 页面各算一遍，无共享。`
    );
    expect(raw).toBeGreaterThan(0);
  });

  it("候选 3：StatsPage 同一页面内 computeStreakWithGrace 被算 2 次", () => {
    const data = scaleData({ cards: 5000, unitCount: 20, reviewsPerCard: 3 });
    const one = timeMedian(() => computeStreakWithGrace(data.reviews), 3);
    console.log(
      `\n[PF2e] StatsPage 单次渲染内的重复：computeStreakWithGrace 在 :132（埋点 effect）与 :211（视图）各一次\n` +
        `  → 每渲染浪费 ${one.toFixed(2)}ms；且 statsService.ts:211 之后还有 getDueForecast / getMaturityDistribution 等\n` +
        `  → StatsPage 全部这些都是**直接调用、无 memo**（stats/weekly/forecast/streak 四份都在渲染体内）。`
    );
    expect(one).toBeGreaterThan(0);
  });

  it("候选 4：getWeakCards 内部被 getLearningStats 再算一遍；getWeakCardInsights 与它口径不同但同源", () => {
    const data = scaleData({ cards: 5000, unitCount: 20 });
    const weak = timeMedian(() => getWeakCards(data), 3);
    const insights = timeMedian(() => getWeakCardInsights(data, { type: "word", limit: 30 }), 3);
    console.log(`\n[PF2e] 薄弱词两条口径（5000 卡）`);
    report("getWeakCards（reviewService.ts:182）", weak);
    report("getWeakCardInsights（reviewService.ts:297）", insights);
    console.log(
      `  → getLearningStats 内部调 getWeakCards（reviewService.ts:225）；\n` +
        `     ReviewPage 同时调 getLearningStats + getWeakStats + getWeakCardInsights（3 份，:114/:115/:116）；\n` +
        `     getWeakStats 内部又调一次 getWeakCardInsights（limit=全部卡）+ getWeakCards（reviewService.ts:365/368）。\n` +
        `     ⇒ ReviewPage 一次渲染里 getWeakCardInsights 被算 2 遍（limit=3 与 limit=全部），\n` +
        `        且 **limit 不影响内部成本**（先算完全部卡再 slice，:342-351）。\n` +
        `        实测两份合计 ≈ ${(insights * 2).toFixed(1)}ms（5000 卡）。`
    );
    expect(insights).toBeGreaterThan(0);
  });

  it("候选 5：buildSpellingQueue —— 单本队列与全量队列在同一页面各算一次", () => {
    const data = scaleData({ cards: 5000, unitCount: 20 });
    const global = timeMedian(() => buildSpellingQueue(data, null, "standard", 30), 3);
    const unit = timeMedian(() => buildSpellingQueue(data, "unit-1", "standard", 30), 3);
    console.log(`\n[PF2e] buildSpellingQueue（5000 卡 / 20 本）`);
    report("全局队列 buildSpellingQueue(null, standard, 30)", global);
    report("单本队列 buildSpellingQueue(unit-1, standard, 30)", unit);
    console.log(
      `  → 两者内部都会跑一遍 getDueCards（2 次全库遍历）+ getNewCardsForToday（1 次全库）——\n` +
        `     即 getDueCards 在同一个页面里被判两次，结果只差一个 unitId 过滤。\n` +
        `     SpellingPage.tsx:119/236 用 useState 初值 + useEffect([queueKey]) 缓存了队列本身（✅ 这条有缓存）;\n` +
        `     但 UnitsPage.tsx:214 的 buildDailyDirective 内部又会对**每本词书**各调一次（见 PF2b）。`
    );
    expect(global).toBeGreaterThan(0);
  });

  it("候选 6：summarizeLessonProgress / getUnitStats —— 与卡片规模无关 vs 相关", () => {
    const data = scaleData({ cards: 5000, unitCount: 20 });
    const lesson = timeMedian(() => summarizeLessonProgress(data), 5);
    const oneUnit = timeMedian(() => getUnitStats(data, data.units[0]), 3);
    console.log(`\n[PF2e] 两类纯函数的规模敏感性`);
    report("summarizeLessonProgress（197 课，与卡数无关）", lesson);
    report("getUnitStats（单本 250 卡，随卡数变化）", oneUnit);
    console.log(
      `  → summarizeLessonProgress 的成本由课程数（197）决定，**不随用户卡片增长**；\n` +
        `     它在 GrammarPathPage 的 useMemo 里（:634），重复调用已被 memo 收住（PF1 已量）。\n` +
        `  → getUnitStats 随卡数变化，且被 UnitsPage.tsx:1216 在 section.units.map 里**每本各调一次**（无 memo），\n` +
        `     每次内部又有 data.schedules.find 的嵌套查找（unitService.ts:26）。`
    );
    expect(lesson).toBeGreaterThanOrEqual(0);
  });

  it("候选 7：getDueForecast / getWeeklyStatsReport 在 StatsPage 内均无 memo", () => {
    const data = scaleData({ cards: 5000, unitCount: 20, reviewsPerCard: 3 });
    const weekly = timeMedian(() => getWeeklyStatsReport(data), 3);
    const forecast = timeMedian(() => getDueForecast(data), 3);
    console.log(`\n[PF2e] StatsPage（StatsPage.tsx）每次渲染的固定开销（5000 卡 / 15000 复习）`);
    report("getWeeklyStatsReport（:107，无 memo）", weekly);
    report("getDueForecast（:185，无 memo）", forecast);
    console.log(
      `  → 两者都在组件函数体内直接调用、没有 useMemo → 每次渲染重算。\n` +
        `     StatsPage 一次渲染的「全库重算」合计 ≥ ${(weekly + forecast).toFixed(1)}ms（还不含 stats/streak/weakInsights/maturity）。`
    );
    expect(weekly).toBeGreaterThan(0);
  });
});
