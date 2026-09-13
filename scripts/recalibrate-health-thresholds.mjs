#!/usr/bin/env node
/**
 * W6 健康度阈值重标定回放（PRD-stats Q5 / R1 后续）
 *
 * 用法：
 *   node scripts/recalibrate-health-thresholds.mjs <telemetry-export.json>
 *
 * 输入 JSON 来自页面内 buildStatsTelemetryExport() 的导出（localStorage: stats-telemetry-events-v1）。
 * 浏览器控制台一键导出：
 *   copy(JSON.parse(localStorage.getItem("stats-telemetry-events-v1")))
 *
 * 判定逻辑（PRD 降级条款）：
 *   - 数据跨度 < 4 周或 stats_page_viewed 样本 < 20 → 输出「数据不足，沿用默认阈值 82/62」
 *   - 否则对候选阈值对做网格回放，按三档分布均衡度打分，输出推荐
 *
 * 注意：阈值语义 = 全量用户（此处为单用户多日快照）的长期分布应避免退化——
 * 任一档占比 >60%（区分度不足）或 <10%（档位形同虚设）都视为不健康。
 */

import { readFileSync } from "node:fs";

const CURRENT = { good: 82, steady: 62 };
const MIN_SPAN_DAYS = 28;
const MIN_SAMPLES = 20;
// 目标分布（产品判断：多数人处于 steady，两端有区分度）
const TARGET = { good: 0.3, steady: 0.4, attention: 0.3 };
const BAND_LIMITS = { max: 0.6, min: 0.1 };

const file = process.argv[2];
if (!file) {
  console.error("用法: node scripts/recalibrate-health-thresholds.mjs <telemetry-export.json>");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(file, "utf8"));
const events = Array.isArray(raw.events) ? raw.events : [];
const views = events
  .filter((e) => e.kind === "stats_page_viewed" && Number.isFinite(e.healthScore))
  .map((e) => ({ ts: new Date(e.ts), score: e.healthScore }))
  .filter((e) => !Number.isNaN(e.ts.getTime()))
  .sort((a, b) => a.ts - b.ts);

console.log(`# W6 健康度阈值重标定回放报告`);
console.log(`导出文件: ${file}`);
console.log(`stats_page_viewed 样本: ${views.length}`);

if (views.length === 0) {
  console.log(`\n**结论：无样本，沿用默认阈值 good=${CURRENT.good} / steady=${CURRENT.steady}。**`);
  process.exit(0);
}

const spanDays = (views[views.length - 1].ts - views[0].ts) / 86400000;
console.log(`数据跨度: ${spanDays.toFixed(1)} 天（要求 ≥${MIN_SPAN_DAYS}）`);

if (spanDays < MIN_SPAN_DAYS || views.length < MIN_SAMPLES) {
  console.log(
    `\n**结论：数据不足（跨度 ${spanDays.toFixed(1)}/${MIN_SPAN_DAYS} 天，样本 ${views.length}/${MIN_SAMPLES}），` +
      `按 PRD 降级条款沿用默认阈值 good=${CURRENT.good} / steady=${CURRENT.steady}。**`
  );
  process.exit(0);
}

const bandOf = (score, good, steady) => (score >= good ? "good" : score >= steady ? "steady" : "attention");
const distribution = (good, steady) => {
  const counts = { good: 0, steady: 0, attention: 0 };
  views.forEach((v) => { counts[bandOf(v.score, good, steady)] += 1; });
  const total = views.length;
  return { good: counts.good / total, steady: counts.steady / total, attention: counts.attention / total };
};
const deviation = (dist) =>
  Math.abs(dist.good - TARGET.good) + Math.abs(dist.steady - TARGET.steady) + Math.abs(dist.attention - TARGET.attention);
const degenerate = (dist) =>
  Object.values(dist).some((p) => p > BAND_LIMITS.max || p < BAND_LIMITS.min);

const percentile = (sorted, p) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
const scores = views.map((v) => v.score).sort((a, b) => a - b);
console.log(
  `分数分布: min=${scores[0]} p25=${percentile(scores, 0.25)} p50=${percentile(scores, 0.5)} ` +
    `p75=${percentile(scores, 0.75)} max=${scores[scores.length - 1]}`
);

const currentDist = distribution(CURRENT.good, CURRENT.steady);
const pct = (v) => `${(v * 100).toFixed(1)}%`;
console.log(
  `\n当前阈值 ${CURRENT.good}/${CURRENT.steady} → good ${pct(currentDist.good)} / steady ${pct(currentDist.steady)} / attention ${pct(currentDist.attention)}`
);

// 网格回放：good ∈ [78,88] step2，steady ∈ [56,68] step2，good > steady+8 保证档距
const candidates = [];
for (let good = 78; good <= 88; good += 2) {
  for (let steady = 56; steady <= 68; steady += 2) {
    if (good - steady < 8) continue;
    const dist = distribution(good, steady);
    candidates.push({ good, steady, dist, dev: deviation(dist), degenerate: degenerate(dist) });
  }
}
candidates.sort((a, b) => Number(a.degenerate) - Number(b.degenerate) || a.dev - b.dev);

console.log(`\n| 排名 | good/steady | good% | steady% | attention% | 与目标偏差 | 退化 |`);
console.log(`|---|---|---|---|---|---|---|`);
candidates.slice(0, 5).forEach((c, i) => {
  console.log(
    `| ${i + 1} | ${c.good}/${c.steady} | ${pct(c.dist.good)} | ${pct(c.dist.steady)} | ${pct(c.dist.attention)} | ${c.dev.toFixed(2)} | ${c.degenerate ? "是" : "否"} |`
  );
});

const best = candidates[0];
const currentDev = deviation(currentDist);
const currentDegenerate = degenerate(currentDist);
if (best.degenerate && currentDegenerate) {
  console.log(`\n**结论：所有候选均退化，沿用默认阈值 ${CURRENT.good}/${CURRENT.steady}，下个周期再标。**`);
} else if (best.good === CURRENT.good && best.steady === CURRENT.steady) {
  console.log(`\n**结论：当前阈值 ${CURRENT.good}/${CURRENT.steady} 即最优，无需调整。**`);
} else if (currentDev - best.dev < 0.1 && !currentDegenerate) {
  console.log(
    `\n**结论：最优候选 ${best.good}/${best.steady} 相对当前阈值改善有限（偏差 ${currentDev.toFixed(2)}→${best.dev.toFixed(2)}），` +
      `建议沿用默认避免口径抖动。**`
  );
} else {
  console.log(
    `\n**结论：推荐调整为 good=${best.good} / steady=${best.steady}**（偏差 ${currentDev.toFixed(2)}→${best.dev.toFixed(2)}）。` +
      `改动点：src/services/statsService.ts HEALTH_SCORE_THRESHOLDS，并回归 statsService.test.ts 阈值用例。`
  );
}
