import {
  AlertTriangle,
  ArrowRight,
  Award,
  CalendarClock,
  CalendarDays,
  ChevronRight,
  Flame,
  GraduationCap,
  Layers,
  Lightbulb,
  Minus,
  RotateCcw,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import CollapsibleSection from "../components/CollapsibleSection";
import { useAppData } from "../AppContext";
import { getLearningStats, getWeakCardInsights } from "../services/reviewService";
import { buildDueForecastAdvice, buildMasteredMilestone, computeHealthScoreBreakdown, computeStreakWithGrace, getDueForecast, getHealthTone, getMaturityDistribution, getWeeklyStatsReport } from "../services/statsService";
// R5/R6：行动入口（主行动/队列/风险条）统一由纯函数构建，视图层只渲染不决策。
import { buildStatsActions } from "../services/statsActions";
import { computeMilestoneStates } from "../services/milestoneService";
import { trackStatsActionClicked, trackStatsPageViewed } from "../services/statsTelemetry";
/**
 * 语法线统计（2026-09-23 批六十六新增）。
 *
 * 为什么加：本页此前**只有词汇**——`statsService` 里 `grammar` 出现 0 次，
 * 页面上六个区块（复习趋势 / 记忆成熟度 / 累计掌握单词 / 里程碑 …）全是词汇。
 * 而语法线是内容投入最大的一条（205 课 / 52 里程碑 / 214 案件）。
 *
 * 数据一律**复用已有服务**，不另造指标：
 *   - `summarizeLessonProgress`（与路径页、今日页同一套，三处不许各算一份）
 *   - `buildGrammarProfile`（含 `isEmpty` 阈值，数据太少时由它决定隐藏，不给空报表）
 */
import { summarizeLessonProgress } from "../services/lessonService";
import { buildGrammarProfile } from "../services/grammarProfileService";

const formatPercent = (value: number | null) => (value === null ? "暂无" : `${value}%`);

const formatDateTime = (value: string | null) => {
  if (!value) return "暂无";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "时间未知";

  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
};

// R13：周环比箭头（验收①：上周无基线显示"—"，不出误导性 +100%）。unit 用于正确率的 pp（百分点）。
const WeekDelta = ({ current, prev, hasBaseline, unit = "" }: { current: number | null; prev: number | null; hasBaseline: boolean; unit?: string }) => {
  if (!hasBaseline || current === null || prev === null) {
    return <small className="stats-delta is-na">— 上周无对照</small>;
  }
  const delta = current - prev;
  if (delta === 0) {
    return (
      <small className="stats-delta is-flat">
        <Minus size={12} /> 持平上周
      </small>
    );
  }
  const up = delta > 0;
  return (
    <small className={`stats-delta ${up ? "is-up" : "is-down"}`}>
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {up ? "+" : ""}
      {delta}
      {unit} vs 上周
    </small>
  );
};

// 健康度环形进度（SVG 圆环，半径 28，周长 ≈ 176）
const HealthRing = ({ score, tone, onClick, expanded }: { score: number; tone: string; onClick: () => void; expanded: boolean }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const filled = Math.max(0, Math.min(100, score));
  const dashOffset = circumference * (1 - filled / 100);
  return (
    <button
      type="button"
      className={`stats-health-ring ${tone}`}
      onClick={onClick}
      aria-expanded={expanded}
      aria-label={`学习健康度 ${score}%，点击查看构成`}
    >
      <svg viewBox="0 0 72 72" aria-hidden="true">
        <circle className="ring-track" cx="36" cy="36" r={radius} />
        <circle
          className="ring-fill"
          cx="36"
          cy="36"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 36 36)"
        />
      </svg>
      <span className="stats-health-ring-text">
        <strong>{score}</strong>
        <small>健康度</small>
      </span>
    </button>
  );
};

export default function StatsPage() {
  const { data } = useAppData();
  const stats = getLearningStats(data);
  const weekly = getWeeklyStatsReport(data);
  /** 语法线进度与画像（复用服务，见文件头注释）。 */
  const lessonProgress = summarizeLessonProgress(data);
  const grammarProfile = buildGrammarProfile(data);

  // 健康度唯一来源：statsService.computeHealthScoreBreakdown（无数据维度剔除重归一化，视图层不写公式）。
  // 提到早退之前计算：hooks 顺序约束 + 埋点快照需要。
  const healthInput = {
    hasActivity: weekly.hasLearningActivity,
    goalCompletionPercent: weekly.goalCompletionPercent,
    spellingAccuracy: weekly.spellingAccuracy,
    dueTotal: stats.dueTotal,
    dueReviewGoal: stats.dueReviewGoal,
    weakWords: stats.weakWords
  };
  const healthBreakdown = computeHealthScoreBreakdown(healthInput);
  const healthScore = healthBreakdown?.total ?? 0;

  // R15 埋点 v1：周报页曝光（每次挂载记一次，附健康度/负债/连续天数快照）。
  const viewTrackedRef = useRef(false);
  useEffect(() => {
    if (viewTrackedRef.current) return;
    viewTrackedRef.current = true;
    if (data.reviews.length === 0) return; // 新手态不算有效周报曝光
    trackStatsPageViewed({
      healthScore,
      dueTotal: stats.dueTotal,
      weakWords: stats.weakWords,
      streak: computeStreakWithGrace(data.reviews).streak
    });
    // 快照语义：只在挂载时记录一次，不随数据刷新重复上报。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // R11 健康度可解释化：分数块点击展开构成分解。
  const [showHealthBreakdown, setShowHealthBreakdown] = useState(false);

  // R6：移动端（≤860px，与 styles.css 861px 桌面断点对齐）首屏纯 coach 卡、队列与 A–D 区默认折叠。
  // 取舍：只在 mount 时取一次断点初值、不订阅变化——local-first 单页、窗口拖拽跨断点是极少数场景，
  // 订阅会引入受控状态同步复杂度，收益不成比例；刷新即恢复。
  const [isMobile] = useState(() => window.matchMedia("(max-width: 860px)").matches);

  const trackAction = (actionId: string, target: string, position?: number) => {
    trackStatsActionClicked({
      actionId,
      target,
      position,
      healthScore,
      dueTotal: stats.dueTotal
    });
  };

  if (data.reviews.length === 0) {
    return (
      <div className="page stats-page">
        <PageHeader
          eyebrow="Weekly Report"
          title="学习周报"
          description="看趋势，更要知道下一步怎么练。"
        />
        <section className="panel">
          <EmptyState
            title="完成 3 天学习后，这里会生成你的第一份周报"
            description="先添加一些单词或导入一段材料，每天完成一小段复习。周报会帮你追踪趋势、错词和下一步该练什么。"
            action={
              <div className="button-row">
                <Link to="/import" className="primary-button">
                  导入材料
                  <ArrowRight size={17} />
                </Link>
                <Link to="/add" className="secondary-button">添加单词</Link>
              </div>
            }
          />
        </section>
      </div>
    );
  }

  const maxTrendReviews = Math.max(1, ...weekly.sevenDayTrend.map((day) => day.reviews));
  // R9：未来 14 天到期预测（口径与 dueNextWeek 同源）
  const dueForecast = getDueForecast(data);
  const maxForecastCount = Math.max(1, ...dueForecast.map((day) => day.count));
  const forecastAdvice = buildDueForecastAdvice(dueForecast, stats.dueReviewGoal);
  const nextWeekSuggestions =
    weekly.nextWeekSuggestions.length > 0
      ? weekly.nextWeekSuggestions
      : ["当前节奏很平稳，下周继续按到期复习优先，再补少量新词。"];
  const activeSentences = stats.cardsByType.sentences;
  const hasTrainingDebt = stats.dueTotal > 0 || stats.weakWords > 0 || activeSentences > 0;
  const weakInsights = getWeakCardInsights(data, { limit: 30 });
  const consecutiveRiskCount = weakInsights.filter((insight) => insight.consecutiveWrongCount >= 2).length;
  const recentWrongTotal = weakInsights.reduce((sum, insight) => sum + insight.recentWrongCount, 0);
  // R5/R6：行动逻辑一次调用、纯函数决策；视图层不再内联任何行动分支。
  const { reportStatus, primaryAction, todayPlan, topRisk, topRiskIsLink } = buildStatsActions({
    healthScore,
    dueTotal: stats.dueTotal,
    dueReviewGoal: stats.dueReviewGoal,
    weakWords: stats.weakWords,
    activeSentences,
    dailySentences: data.settings.dailySentences,
    consecutiveRiskCount,
    recentWrongTotal
  });
  const planStepTones = ["orange", "red", "green"] as const;
  const TopRiskIcon = topRisk.icon;
  const healthTone = getHealthTone(healthScore);
  const streakInfo = computeStreakWithGrace(data.reviews);
  // R12：记忆成熟度分布（替代「卡片构成」；分数报警、分布解释）
  const maturity = getMaturityDistribution(data);
  // R13：北极星——累计掌握单词数 + 里程碑叙事。
  const milestone = buildMasteredMilestone(weekly.masteredWordsTotal);
  const milestoneBase = milestone.lastPassed ?? 0;
  const milestoneProgress =
    milestone.next === null
      ? 100
      : Math.min(100, Math.round(((milestone.total - milestoneBase) / (milestone.next - milestoneBase)) * 100));
  // P2-2 学习里程碑记录（连续 7/30/100 天 + 首本完成），已达成置顶。
  const learningMilestones = computeMilestoneStates(data);
  const cnRangeDate = (shortDate: string) => {
    const [month, day] = shortDate.split("/");
    if (!month || !day) return shortDate;
    return `${parseInt(month, 10)}月${parseInt(day, 10)}日`;
  };
  // R4：页头日期范围与"本周指标"同口径（自然周，周一~周日），不再用滚动 7 天。
  const [weekStartRaw, weekEndRaw] = weekly.weekRangeLabel.split("-");
  const weekRangeText =
    weekStartRaw && weekEndRaw ? `${cnRangeDate(weekStartRaw)} - ${cnRangeDate(weekEndRaw)}` : "";

  // R6：今日行动队列——与主行动同 destination 的行降级为非链接展示行（保留计划信息，不可点击）。
  // 桌面端渲染在 hero 第二卡；移动端整体降级为第一个 CollapsibleSection（见下方条件渲染）。
  const planList = (
    <div className="stats-plan-list">
      {todayPlan.map((step, index) => {
        const Icon = step.icon;
        const tone = planStepTones[index] ?? "neutral";
        const rowClass = `stats-plan-row${step.active ? "" : " is-muted"}${step.isLink ? "" : " is-static"}`;
        const rowBody = (
          <>
            <span className={`stats-plan-icon is-${tone}`}>
              <Icon size={16} />
            </span>
            <div className="stats-plan-body">
              <strong>{step.label}</strong>
              <span>{step.detail}</span>
            </div>
            <div className="stats-plan-meta">
              <strong>{step.amount}</strong>
              <small>{step.estimate}</small>
            </div>
            <ChevronRight size={16} className="stats-plan-arrow" aria-hidden="true" />
          </>
        );
        return step.isLink ? (
          <Link key={step.label} to={step.to} className={rowClass} onClick={() => trackAction("plan", step.to, index)}>
            {rowBody}
          </Link>
        ) : (
          <div key={step.label} className={rowClass}>
            {rowBody}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="page stats-page">
      <PageHeader
        eyebrow="Weekly Report"
        title="学习周报"
        description="看趋势，更要知道下一步怎么练。"
        action={
          weekRangeText ? (
            <span className="stats-header-chip">
              <CalendarDays size={15} />
              {weekRangeText}
            </span>
          ) : undefined
        }
      />

      {/* ① Hero 区：Coach 状态 + 今日行动（移动端首屏纯 coach 卡，R6 条件渲染而非 CSS 隐藏——
          display:none 的队列仍含可聚焦 Link，且双卡 DOM 与移动端单卡语义顺序冲突） */}
      <section className="stats-hero">
        <div className="stats-card stats-coach" aria-label="学习教练">
          <div className="stats-coach-head">
            <div className="stats-coach-info">
              <span className="eyebrow">Coach</span>
              <h2>{reportStatus}</h2>
              <p>
                {hasTrainingDebt
                  ? "先处理最影响节奏的任务，再按队列往下练。"
                  : "今天负债很轻，保持一次短训练就够。"}
              </p>
              {streakInfo.streak > 0 && (
                <div className="stats-coach-streak" aria-label={`连续学习 ${streakInfo.streak} 天`}>
                  <Flame size={14} />
                  <strong>连续 {streakInfo.streak} 天</strong>
                  <em className={streakInfo.graceUsedThisWeek ? "is-used" : ""}>
                    {streakInfo.graceUsedThisWeek ? "本周宽限已用" : "本周宽限可用"}
                  </em>
                </div>
              )}
            </div>
            <HealthRing
              score={healthScore}
              tone={healthTone}
              expanded={showHealthBreakdown}
              onClick={() => setShowHealthBreakdown((value) => !value)}
            />
          </div>
          {showHealthBreakdown && healthBreakdown && (
            <div className="stats-health-breakdown" aria-label="健康度构成分解">
              {healthBreakdown.dimensions.map((dimension) => (
                <div className="stats-health-row" key={dimension.key}>
                  <span>
                    {dimension.label}
                    {dimension.available && <small>权重 {Math.round(dimension.effectiveWeight * 100)}%</small>}
                  </span>
                  {dimension.available ? (
                    <em>
                      {dimension.score} 分 · 贡献 {Math.round(dimension.contribution)}
                      {/* R5：薄弱词数权威位置之一——weakWords 维度行补词数（另一处是行动队列行 2 amount） */}
                      {dimension.key === "weakWords" && `（${healthInput.weakWords} 个）`}
                    </em>
                  ) : (
                    <em className="is-na">暂无数据，未参与计算</em>
                  )}
                </div>
              ))}
              {healthBreakdown.topLever && (
                <p className="stats-health-lever">
                  <Lightbulb size={14} />
                  {healthBreakdown.topLever}
                </p>
              )}
            </div>
          )}
          <Link
            to={primaryAction.to}
            className="primary-button stats-coach-action"
            onClick={() => trackAction("primary", primaryAction.to)}
          >
            {primaryAction.label}
            <ArrowRight size={17} />
          </Link>
        </div>

        {!isMobile && (
          <div className="stats-card stats-queue" aria-label="今日行动队列">
            <header className="stats-card-head">
              <div>
                <span className="eyebrow">Today Plan</span>
                <h3>今日行动队列</h3>
              </div>
              <div className="stats-queue-eta">
                <strong>{hasTrainingDebt ? "约 10 分钟" : "约 6 分钟"}</strong>
                <span>{hasTrainingDebt ? "先压到期，再修错词" : "保持手感"}</span>
              </div>
            </header>
            {planList}
          </div>
        )}
      </section>

      {/* R6：移动端「今日行动队列」整体降级为第一个折叠区（默认折叠） */}
      {isMobile && (
        <CollapsibleSection
          eyebrow="Today Plan"
          title="今日行动队列"
          summary={hasTrainingDebt ? "约 10 分钟 · 先压到期" : "保持手感"}
          defaultOpen={false}
        >
          {planList}
        </CollapsibleSection>
      )}

      {/* ② A 数据报告（R6 折叠区，桌面默认展开）：KPI 行 + 趋势/14 天预测 */}
      <CollapsibleSection
        eyebrow="Report"
        title={
          <>
            <TrendingUp size={16} /> 数据报告
          </>
        }
        summary={`本周复习 ${weekly.weekReviewCount} 次 · 正确率 ${formatPercent(weekly.overallAccuracy)}`}
        defaultOpen={!isMobile}
      >
      <section className="stats-kpi-grid" aria-label="本周核心指标">
        <div className="stats-kpi">
          <span className="stats-kpi-label">本周复习</span>
          <strong className="stats-kpi-value">{weekly.weekReviewCount}</strong>
          <span className="stats-kpi-sub">{weekly.weekReviewedCards} 张卡</span>
          <WeekDelta
            current={weekly.weekReviewCount}
            prev={weekly.previousWeek.reviewCount}
            hasBaseline={weekly.previousWeek.hasBaseline}
          />
        </div>
        <div className="stats-kpi">
          <span className="stats-kpi-label">全模式正确率</span>
          <strong className="stats-kpi-value">{formatPercent(weekly.overallAccuracy)}</strong>
          <span className="stats-kpi-sub">
            {weekly.overallCorrect} / {weekly.overallTotal} 次 · 拼写 {formatPercent(weekly.spellingAccuracy)}
          </span>
          <WeekDelta
            current={weekly.overallAccuracy}
            prev={weekly.previousWeek.overallAccuracy}
            hasBaseline={weekly.previousWeek.hasBaseline}
            unit="pp"
          />
        </div>
        <div className="stats-kpi">
          <span className="stats-kpi-label">本周新词 / 掌握</span>
          <strong className="stats-kpi-value">{weekly.weekFirstReviewedWords} / {weekly.weekMasteredWords}</strong>
          <span className="stats-kpi-sub">新词按首次进入复习统计</span>
          <WeekDelta
            current={weekly.weekFirstReviewedWords}
            prev={weekly.previousWeek.firstReviewedWords}
            hasBaseline={weekly.previousWeek.hasBaseline}
          />
        </div>
        <div className="stats-kpi">
          <span className="stats-kpi-label">本周活跃</span>
          <strong className="stats-kpi-value">{weekly.weekActiveDays} / {weekly.elapsedWeekDays}</strong>
          <span className="stats-kpi-sub">天 · 每天至少 1 次复习点亮</span>
          <span className="stats-delta is-flat">错词修复 {weekly.weekFixedWords} 个</span>
        </div>
      </section>

      <div className="stats-card">
          <header className="stats-card-head">
            <div>
              <span className="eyebrow">Trend</span>
              <h3><TrendingUp size={16} /> 最近 7 天复习趋势</h3>
            </div>
            <div className="stats-trend-legend" aria-label="趋势图图例">
              <span><i className="stats-dot is-correct" /> 正确</span>
              <span><i className="stats-dot is-wrong" /> 错误</span>
            </div>
          </header>
          <div className="trend-chart" aria-label="最近 7 天复习趋势">
            {weekly.sevenDayTrend.map((day) => {
              // R16：与 wrongHeight 对齐——correct=0 时不画最小高度残影，避免"全错日看似有 1 个正确"。
              const correctHeight = day.reviews === 0 || day.correct === 0 ? 0 : Math.max(4, Math.round((day.correct / maxTrendReviews) * 100));
              const wrongHeight = day.reviews === 0 || day.wrong === 0 ? 0 : Math.max(4, Math.round((day.wrong / maxTrendReviews) * 100));

              return (
                <div className={day.reviews === 0 ? "trend-day is-empty" : "trend-day"} key={day.dateKey}>
                  <div
                    className="trend-bars"
                    title={`${day.shortDate}：复习 ${day.reviews}，正确 ${day.correct}，错误 ${day.wrong}`}
                  >
                    <span className="trend-bar-correct" style={{ height: `${correctHeight}%` }} />
                    <span className="trend-bar-wrong" style={{ height: `${wrongHeight}%` }} />
                  </div>
                  <strong>{day.reviews}</strong>
                  <span>{day.label}</span>
                  <small>{day.shortDate}</small>
                </div>
              );
            })}
          </div>

          <div className="stats-forecast">
            <h4><CalendarClock size={15} /> 未来 14 天到期预测</h4>
            <div className="forecast-chart" aria-label="未来 14 天到期负载">
              {dueForecast.map((day) => (
                <div key={day.dateKey} className={day.count === 0 ? "forecast-day is-empty" : "forecast-day"}>
                  <div
                    className="forecast-bar-wrap"
                    title={`${day.label} ${day.shortDate}：到期 ${day.count} 张`}
                  >
                    <span
                      className="forecast-bar"
                      style={{ height: `${day.count === 0 ? 0 : Math.max(6, Math.round((day.count / maxForecastCount) * 100))}%` }}
                    />
                  </div>
                  <strong>{day.count}</strong>
                  <small>{day.label}</small>
                </div>
              ))}
            </div>
            <p className="stats-hint">
              {forecastAdvice ?? "逐日到期与调度记录同口径；峰值日超过每日目标时会给出提前清理建议。"}
            </p>
          </div>
        </div>
      </CollapsibleSection>

      {/* ③ B 错词与风险（R6 折叠区）：风险条 + 错词榜 Top 3 + 查看全部 */}
      <CollapsibleSection
        eyebrow="Risk"
        title={
          <>
            <AlertTriangle size={16} /> 错词与风险
          </>
        }
        summary={`连错 ${consecutiveRiskCount} · 近期低分 ${recentWrongTotal}`}
        defaultOpen={false}
      >
        <div className="stats-card">
          {/* R6：风险条 tone === "green"（无风险）时不渲染为 Link */}
          {topRiskIsLink ? (
            <Link
              to={topRisk.to}
              className={`stats-risk-banner is-${topRisk.tone}`}
              onClick={() => trackAction("risk", topRisk.to, 0)}
            >
              <span className="stats-risk-icon"><TopRiskIcon size={16} /></span>
              <div className="stats-risk-body">
                <strong>{topRisk.title}</strong>
                <p>{topRisk.detail}</p>
              </div>
              <div className="stats-risk-metric">
                <strong>{topRisk.metric}</strong>
                <small>{topRisk.unit}</small>
              </div>
              <ChevronRight size={15} aria-hidden="true" />
            </Link>
          ) : (
            <div className={`stats-risk-banner is-${topRisk.tone}`}>
              <span className="stats-risk-icon"><TopRiskIcon size={16} /></span>
              <div className="stats-risk-body">
                <strong>{topRisk.title}</strong>
                <p>{topRisk.detail}</p>
              </div>
              <div className="stats-risk-metric">
                <strong>{topRisk.metric}</strong>
                <small>{topRisk.unit}</small>
              </div>
            </div>
          )}

          {weekly.mostWrongWords.length === 0 ? (
            <EmptyState title="暂时没有常错词" description="拼写或复习评分较低的单词会自动进入这里。" />
          ) : (
            <div className="stats-wrong-list">
              {/* R6 入口收敛：错词榜 Top 5 收为 Top 3 + 查看全部（榜内导航，不计独立行动入口） */}
              <div className="stats-wrong-list-head">
                <span>Top {Math.min(3, weekly.mostWrongWords.length)} 常错词</span>
                <span>正确率</span>
              </div>
              {weekly.mostWrongWords.slice(0, 3).map((item, index) => {
                // R10 错词深链：cardId 定位起练，训练端队列置顶该卡
                const target = `/spelling?mode=mistakes&cardId=${encodeURIComponent(item.card.id)}`;
                return (
                  <Link to={target} key={item.card.id} className="stats-wrong-row" onClick={() => trackAction("wrong_word", target, index)}>
                    <span className="stats-wrong-rank">{index + 1}</span>
                    <div className="stats-wrong-body">
                      <strong>{item.card.front}</strong>
                      <span>
                        错 {item.wrongCount} 次 · 拼写 {item.spellingWrongCount} · 14 天 {item.recentWrongCount}
                      </span>
                    </div>
                    <em className="stats-wrong-acc">{item.accuracy === null ? "暂无" : `${item.accuracy}%`}</em>
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                );
              })}
              {weekly.mostWrongWords.length > 3 && (
                <Link to="/mistakes" className="stats-wrong-all" onClick={() => trackAction("wrong_all", "/mistakes")}>
                  查看全部 {weekly.mostWrongWords.length} 个常错词
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              )}
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* ④ C 目标与建议（R6 折叠区）：本周目标 + 下周建议 */}
      <CollapsibleSection
        eyebrow="Goals"
        title={
          <>
            <Target size={16} /> 目标与建议
          </>
        }
        summary={`本周目标完成 ${weekly.goalCompletionPercent}%`}
        defaultOpen={false}
      >
        <div className="stats-card">
          <div className="stats-goal-list">
            {weekly.goalProgress.map((goal) => (
              <div className="stats-goal-row" key={goal.label}>
                <div className="stats-goal-row-head">
                  <strong>{goal.label}</strong>
                  <em>{goal.target > 0 ? `${goal.current} / ${goal.target}` : "未设置"}</em>
                </div>
                <span className="stats-goal-row-detail">{goal.detail}</span>
                <div className="stats-goal-progress" aria-label={`${goal.label}目标完成度 ${goal.percent}%`}>
                  <span style={{ width: `${goal.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="stats-next-week">
            <h4><Lightbulb size={14} /> 下周建议</h4>
            <ol>
              {nextWeekSuggestions.slice(0, 3).map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ol>
          </div>
        </div>
      </CollapsibleSection>

      {/* ⑤ D 成就与概览（R6 折叠区）：记忆成熟度 + 复习概览 + 北极星 */}
        {lessonProgress.done > 0 && (
          <div className="stats-card stats-grammar-card">
            <header className="stats-card-head">
              <div>
                <span className="eyebrow">Grammar</span>
                <h3><GraduationCap size={16} /> 语法阶梯</h3>
              </div>
              <Link to="/grammar" className="ghost-link">
                去语法路径 <ChevronRight size={14} />
              </Link>
            </header>
            <div className="stats-review-list">
              <div>
                <span>已完成课程</span>
                <strong>{lessonProgress.done} / {lessonProgress.total}</strong>
              </div>
              <div>
                <span>走完的季</span>
                <strong>{grammarProfile.seasonsDone} / {grammarProfile.seasonsTotal}</strong>
              </div>
              <div>
                <span>语法句掌握</span>
                <strong>{grammarProfile.mastery.mastered} / {grammarProfile.mastery.total}</strong>
              </div>
              {grammarProfile.summary.weekOverWeek !== null && (
                <div>
                  <span>近 7 天犯错</span>
                  <strong>
                    {grammarProfile.summary.recentMistakes} 次
                    {grammarProfile.summary.weekOverWeek < 0
                      ? `（比前周少 ${Math.abs(grammarProfile.summary.weekOverWeek)} 次）`
                      : grammarProfile.summary.weekOverWeek > 0
                        ? `（比前周多 ${grammarProfile.summary.weekOverWeek} 次）`
                        : "（与前周持平）"}
                  </strong>
                </div>
              )}
            </div>
            {lessonProgress.nextLesson && (
              <p className="stats-grammar-next">
                下一课：第 {lessonProgress.nextLesson.number} 课「{lessonProgress.nextLesson.title}」
              </p>
            )}
          </div>
        )}

      <CollapsibleSection
        eyebrow="Overview"
        title={
          <>
            <Award size={16} /> 成就与概览
          </>
        }
        summary={`已掌握 ${milestone.total} 词`}
        defaultOpen={false}
      >
        <div className="stats-card">
          <header className="stats-card-head">
            <div>
              <span className="eyebrow">Maturity</span>
              <h3><Layers size={16} /> 记忆成熟度</h3>
            </div>
          </header>
          {maturity.total === 0 ? (
            <p className="stats-hint">还没有卡片，先添加单词或导入材料。</p>
          ) : (
            <>
              <div className="maturity-bar" aria-label="记忆成熟度分布条">
                {maturity.buckets.map((bucket) =>
                  bucket.count > 0 ? (
                    <span
                      key={bucket.key}
                      className={`maturity-segment is-${bucket.key}`}
                      style={{ width: `${(bucket.count / maturity.total) * 100}%` }}
                      title={`${bucket.label}（${bucket.rangeLabel}）：${bucket.count} 张`}
                    />
                  ) : null
                )}
              </div>
              <div className="maturity-legend">
                {maturity.buckets.map((bucket) => (
                  <div key={bucket.key} className="maturity-row">
                    <span className={`maturity-dot is-${bucket.key}`} />
                    <div className="maturity-row-label">
                      <strong>{bucket.label}</strong>
                      <small>{bucket.rangeLabel}</small>
                    </div>
                    <em>{bucket.count}</em>
                  </div>
                ))}
              </div>
              <div className="stats-review-overview">
                <h4><RotateCcw size={14} /> 复习概览</h4>
                <div className="stats-review-list">
                  <div><span>全部复习记录</span><strong>{data.reviews.length}</strong></div>
                  {/* R5：到期数/薄弱词数在此删除——到期数权威位置 = 行动队列行 1 + 风险条复习负债；
                      薄弱词权威位置 = 行动队列行 2 + 健康度展开层 weakWords 维度行 */}
                  <div><span>最近错误</span><strong>{formatDateTime(weekly.mostWrongWords[0]?.latestWrongAt ?? null)}</strong></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/**
         * 语法线区块（2026-09-23 批六十六新增）。
         *
         * 放在词汇区块之后：本页的主体仍是词汇（那是用户每天在做的事），
         * 语法是「另一条线走到哪了」的补充视角，不喧宾夺主。
         *
         * 隐藏规则用**两个已有信号的并集**，而非新造阈值：
         *   - 一课都没学 ⇒ 完全不显示（不打扰新用户）
         *   - 学过但画像 `isEmpty`（数据点 <3）⇒ 也不显示（沿用画像服务自己的阈值，
         *     避免统计页另立一套「多少算够」的标准）
         */}

        <div className="stats-card stats-north-star-card">
          <header className="stats-card-head">
            <div>
              <span className="eyebrow">Milestone</span>
              <h3><Award size={16} /> 累计掌握单词</h3>
            </div>
          </header>
          <div className="stats-north-star">
            <strong className="stats-north-star-value">{milestone.total}</strong>
            <div
              className="stats-north-star-track"
              role="img"
              aria-label={milestone.next === null ? "全部里程碑已达成" : `距 ${milestone.next} 词里程碑进度 ${milestoneProgress}%`}
            >
              <span style={{ width: `${milestoneProgress}%` }} />
            </div>
            <p>{milestone.text}</p>
            {milestone.next !== null && (
              <small className="stats-north-star-next">
                距 {milestone.next} 词里程碑还差 <strong>{milestone.next - milestone.total}</strong> 个
              </small>
            )}
          </div>
        </div>

        <div className="stats-card stats-milestones-card">
          <header className="stats-card-head">
            <div>
              <span className="eyebrow">Milestones</span>
              <h3><Trophy size={16} /> 学习里程碑</h3>
            </div>
          </header>
          <ul className="stats-milestone-list">
            {learningMilestones.map((state) => (
              <li key={state.definition.id} className={`stats-milestone-row ${state.reached ? "is-reached" : ""}`}>
                <span className="stats-milestone-badge" aria-hidden="true">
                  <Trophy size={14} />
                </span>
                <div className="stats-milestone-info">
                  <strong>{state.definition.title}</strong>
                  <small>{state.definition.description}</small>
                  {!state.reached && (
                    <span
                      className="stats-milestone-track"
                      role="img"
                      aria-label={`${state.definition.title}进度 ${Math.round(state.progress * 100)}%`}
                    >
                      <span style={{ width: `${Math.round(state.progress * 100)}%` }} />
                    </span>
                  )}
                </div>
                <em className="stats-milestone-state">
                  {state.reached
                    ? "已达成"
                    : state.definition.kind === "streak"
                      ? `${state.current} / ${state.definition.threshold} 天`
                      : `${state.current} / ${state.definition.threshold} 本`}
                </em>
              </li>
            ))}
          </ul>
        </div>
      </CollapsibleSection>
    </div>
  );
}
