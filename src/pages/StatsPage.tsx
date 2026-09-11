import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Flame,
  Lightbulb,
  ListChecks,
  Target,
  TrendingUp
} from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { useAppData } from "../AppContext";
import { getLearningStats, getWeakCardInsights } from "../services/reviewService";
import { getWeeklyStatsReport } from "../services/statsService";

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

const clampPercent = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const getReportStatus = (score: number, dueTotal: number, weakWords: number) => {
  if (dueTotal > 0) return "先清到期";
  if (weakWords > 0) return "先稳错词";
  if (score >= 82) return "节奏健康";
  if (score >= 62) return "节奏可控";
  return "需要收尾";
};

export default function StatsPage() {
  const { data } = useAppData();
  const stats = getLearningStats(data);
  const weekly = getWeeklyStatsReport(data);
  const maxTrendReviews = Math.max(1, ...weekly.sevenDayTrend.map((day) => day.reviews));
  const hasTrendData = weekly.sevenDayTrend.some(
    (day) => day.reviews > 0 || day.newCards > 0 || day.masteredCards > 0
  );
  const weeklyGoalTotal = weekly.goalProgress.reduce((sum, goal) => sum + goal.target, 0);
  const weeklyGoalDone = weekly.goalProgress.reduce((sum, goal) => sum + Math.min(goal.current, goal.target), 0);
  const nextWeekSuggestions =
    weekly.nextWeekSuggestions.length > 0
      ? weekly.nextWeekSuggestions
      : ["当前节奏很平稳，下周继续按到期复习优先，再补少量新词。"];
  const dueLoadScore = 100 - clampPercent((stats.dueTotal / Math.max(1, stats.dueReviewGoal)) * 100);
  const weakWordScore = 100 - clampPercent(stats.weakWords * 8);
  const spellingScore = weekly.spellingAccuracy ?? (weekly.spellingTotal === 0 ? 100 : 0);
  const healthScore = clampPercent(
    weekly.goalCompletionPercent * 0.35 +
      spellingScore * 0.25 +
      dueLoadScore * 0.25 +
      weakWordScore * 0.15
  );
  const reportStatus = getReportStatus(healthScore, stats.dueTotal, stats.weakWords);
  const primaryAction =
    stats.dueTotal > 0
      ? { label: "清到期复习", to: "/review" }
      : stats.weakWords > 0
        ? { label: "练错词", to: "/spelling?mode=mistakes" }
        : { label: "继续训练", to: "/training" };
  const activeWords = stats.cardsByType.words;
  const activePhrases = stats.cardsByType.phrases;
  const activeSentences = stats.cardsByType.sentences;
  const focusActions = [
    {
      title: "今日收尾",
      detail:
        stats.dueTotal > 0
          ? `${stats.dueTotal} 张卡到期，先把复习负债压住。`
          : "没有到期负债，可以轻量保持节奏。",
      metric: stats.dueTotal,
      unit: "到期",
      to: "/review",
      icon: CalendarClock,
      tone: stats.dueTotal > 0 ? "red" : "green"
    },
    {
      title: "错词专项",
      detail:
        stats.weakWords > 0
          ? `${stats.weakWords} 个薄弱词需要重新巩固。`
          : "暂时没有明显薄弱词，保持即可。",
      metric: stats.weakWords,
      unit: "薄弱",
      to: "/spelling?mode=mistakes",
      icon: Flame,
      tone: stats.weakWords > 0 ? "red" : "green"
    },
    {
      title: "下周负载",
      detail:
        weekly.dueNextWeek > 0
          ? `预计 ${weekly.dueNextWeek} 张卡到期，适合拆成短复习。`
          : "下周到期压力很轻，可以补一点新材料。",
      metric: weekly.dueNextWeek,
      unit: "下周",
      to: "/training",
      icon: BarChart3,
      tone: weekly.dueNextWeek > stats.dueReviewGoal * 2 ? "red" : "blue"
    }
  ];
  const weakInsights = getWeakCardInsights(data, { limit: 30 });
  const consecutiveRiskCount = weakInsights.filter((insight) => insight.consecutiveWrongCount >= 2).length;
  const recentWrongTotal = weakInsights.reduce((sum, insight) => sum + insight.recentWrongCount, 0);
  const reviewDebtRatio = stats.dueTotal / Math.max(1, stats.dueReviewGoal);
  const riskBands = [
    {
      title: "连续错误",
      detail:
        consecutiveRiskCount > 0
          ? `${consecutiveRiskCount} 个词连续错 2 次以上，先做错词拼写。`
          : "没有明显连续错误，错词压力可控。",
      metric: consecutiveRiskCount,
      unit: "连错",
      to: "/spelling?mode=mistakes",
      icon: Flame,
      tone: consecutiveRiskCount > 0 ? "red" : "green"
    },
    {
      title: "近期错词趋势",
      detail:
        recentWrongTotal > 0
          ? `最近 14 天累计 ${recentWrongTotal} 次低分，复习前先看来源句。`
          : "最近两周没有新的低分记录。",
      metric: recentWrongTotal,
      unit: "低分",
      to: "/library",
      icon: AlertTriangle,
      tone: recentWrongTotal >= 6 ? "red" : recentWrongTotal > 0 ? "blue" : "green"
    },
    {
      title: "复习负债",
      detail:
        stats.dueTotal > 0
          ? `当前到期量约为每日上限的 ${reviewDebtRatio.toFixed(1)} 倍。`
          : "今天没有到期负债，可以安排轻量补练。",
      metric: stats.dueTotal,
      unit: "到期",
      to: "/review",
      icon: CalendarClock,
      tone: reviewDebtRatio >= 1.5 ? "red" : stats.dueTotal > 0 ? "blue" : "green"
    }
  ];
  const topRisk = riskBands.find((risk) => risk.tone === "red") ?? riskBands.find((risk) => risk.tone === "blue") ?? riskBands[0];
  const latestMaterial = data.materials.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const duePlanCount = Math.min(stats.dueTotal, stats.dueReviewGoal, 12);
  const weakPlanCount = Math.min(stats.weakWords, 10);
  const sentencePlanCount = Math.min(activeSentences, Math.max(1, data.settings.dailySentences || 5));
  const todayPlan = [
    {
      label: "清到期复习",
      detail: stats.dueTotal > 0 ? "先把复习负债压住，避免明天滚雪球。" : "暂无到期卡，保留轻量热身即可。",
      estimate: stats.dueTotal > 0 ? "3-4 分钟" : "可跳过",
      amount: stats.dueTotal > 0 ? `${duePlanCount} 张` : "0 张",
      status: stats.dueTotal > 0 ? "优先" : "跳过",
      to: stats.dueTotal > 0 ? `/review?plan=today&step=due&limit=${duePlanCount}` : "/training",
      icon: CalendarClock,
      active: stats.dueTotal > 0
    },
    {
      label: "错词拼写",
      detail: stats.weakWords > 0 ? "只练薄弱词，优先修复最近容易错的声音和拼写。" : "暂无明显错词，不强行加练。",
      estimate: stats.weakWords > 0 ? "3 分钟" : "可跳过",
      amount: stats.weakWords > 0 ? `${weakPlanCount} 个` : "0 个",
      status: stats.weakWords > 0 ? "专项" : "跳过",
      to: stats.weakWords > 0 ? `/spelling?mode=mistakes&plan=today&limit=${weakPlanCount}` : "/spelling",
      icon: Flame,
      active: stats.weakWords > 0
    },
    {
      label: "句子复盘",
      detail: activeSentences > 0 ? "用句子卡把词放回语境，补一点语感。" : "还没有句子卡，先加一条真实句子。",
      estimate: activeSentences > 0 ? "2 分钟" : "1 分钟",
      amount: activeSentences > 0 ? `${sentencePlanCount} 句` : "待添加",
      status: activeSentences > 0 ? "语境" : "补素材",
      to: activeSentences > 0 ? `/review?plan=today&step=sentences&limit=${sentencePlanCount}` : "/add",
      icon: ListChecks,
      active: activeSentences > 0
    },
    {
      label: "材料补练",
      detail: latestMaterial ? `回到「${latestMaterial.title}」继续补上下文。` : "导入一段真实材料，建立新词来源。",
      estimate: latestMaterial ? "1-2 分钟" : "3 分钟",
      amount: latestMaterial ? "1 份材料" : "待导入",
      status: latestMaterial ? "延续" : "新建",
      to: latestMaterial ? `/library?material=${encodeURIComponent(latestMaterial.id)}` : "/import",
      icon: BookOpen,
      active: Boolean(latestMaterial)
    }
  ];
  const firstPlanStep = todayPlan.find((step) => step.active) ?? todayPlan[0];
  const FirstPlanIcon = firstPlanStep.icon;
  const TopRiskIcon = topRisk.icon;
  const mobilePlanPreview = todayPlan.filter((step) => step.active).slice(0, 3);
  const previewSteps = mobilePlanPreview.length > 0 ? mobilePlanPreview : [firstPlanStep];
  const healthTone = healthScore >= 82 ? "good" : healthScore >= 62 ? "steady" : "attention";
  const hasTrainingDebt = stats.dueTotal > 0 || stats.weakWords > 0 || activeSentences > 0;

  return (
    <div className="page stats-page">
      <PageHeader
        eyebrow="Weekly Report"
        title="学习周报"
        description="看趋势，更要知道下一步怎么练。"
        action={
          <Link to={primaryAction.to} className="primary-button">
            {primaryAction.label}
            <ArrowRight size={17} />
          </Link>
        }
      />

      <section className="stats-mobile-coach" aria-label="今日学习建议">
        <div className="stats-mobile-coach-head">
          <div>
            <span className="eyebrow">Next Action</span>
            <h2>{reportStatus}</h2>
            <p>
              {hasTrainingDebt
                ? "先处理最影响节奏的任务，再看完整周报。"
                : "今天负债很轻，保持一次短训练就够。"}
            </p>
          </div>
          <div className={`stats-mobile-score ${healthTone}`} aria-label={`学习健康度 ${healthScore}%`}>
            <strong>{healthScore}</strong>
            <span>健康度</span>
          </div>
        </div>

        <div className="stats-mobile-next-card">
          <span className="stats-mobile-next-icon"><FirstPlanIcon size={20} /></span>
          <div>
            <span>下一步 · {firstPlanStep.estimate} · {firstPlanStep.amount}</span>
            <strong>{firstPlanStep.label}</strong>
            <p>{firstPlanStep.detail}</p>
          </div>
          <Link to={firstPlanStep.to} className="primary-button">
            开始
            <ArrowRight size={17} />
          </Link>
        </div>

        <Link to={topRisk.to} className={`stats-mobile-risk ${topRisk.tone}`}>
          <span><TopRiskIcon size={17} /></span>
          <div>
            <strong>{topRisk.title}</strong>
            <p>{topRisk.detail}</p>
          </div>
          <ArrowRight size={16} />
        </Link>

        <div className="stats-mobile-plan-strip" aria-label="今日计划概览">
          {previewSteps.map((step, index) => (
            <Link key={step.label} to={step.to} className="stats-mobile-plan-pill">
              <span>{index + 1}</span>
              <strong>{step.label}</strong>
              <em>{step.amount}</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="stats-brief">
        <div className="stats-brief-main">
          <span className="eyebrow">Learning Health</span>
          <h2>{reportStatus}</h2>
          <p>
            本周复习 {weekly.weekReviewCount} 次，目标完成 {weekly.goalCompletionPercent}%。
            {weekly.spellingAccuracy === null
              ? " 还没有拼写正确率数据。"
              : ` 拼写正确率 ${weekly.spellingAccuracy}%。`}
          </p>
          <div className="button-row">
            <Link to={primaryAction.to} className="primary-button">
              {primaryAction.label}
              <ArrowRight size={17} />
            </Link>
            <Link to="/library" className="secondary-button">查看词库</Link>
          </div>
        </div>
        <div className="stats-health-meter" aria-label={`学习健康度 ${healthScore}%`}>
          <strong>{healthScore}</strong>
          <span>健康度</span>
          <div className="health-ring" style={{ "--score": `${healthScore}%` } as CSSProperties} />
        </div>
        <div className="stats-brief-grid" aria-label="当前学习摘要">
          <div><span>当前到期</span><strong>{stats.dueTotal}</strong></div>
          <div><span>薄弱词</span><strong>{stats.weakWords}</strong></div>
          <div><span>下周到期</span><strong>{weekly.dueNextWeek}</strong></div>
          <div><span>目标完成</span><strong>{weekly.goalCompletionPercent}%</strong></div>
        </div>
      </section>

      <section className="stats-focus-grid" aria-label="建议行动">
        {focusActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} to={action.to} className={`stats-focus-card ${action.tone}`}>
              <span className="stats-focus-icon"><Icon size={18} /></span>
              <div>
                <strong>{action.title}</strong>
                <p>{action.detail}</p>
              </div>
              <em>{action.metric}<span>{action.unit}</span></em>
            </Link>
          );
        })}
      </section>

      <section className="stats-action-workbench" aria-label="风险分层与训练组合">
        <div className="panel stats-risk-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Risk Layers</span>
              <h2>风险分层</h2>
            </div>
            <AlertTriangle size={20} />
          </div>
          <div className="stats-risk-list">
            {riskBands.map((risk) => {
              const Icon = risk.icon;
              return (
                <Link key={risk.title} to={risk.to} className={`stats-risk-card ${risk.tone}`}>
                  <span><Icon size={17} /></span>
                  <div>
                    <strong>{risk.title}</strong>
                    <p>{risk.detail}</p>
                  </div>
                  <em>{risk.metric}<small>{risk.unit}</small></em>
                </Link>
              );
            })}
          </div>
        </div>

        <section className="metric-grid stats-metric-grid" aria-label="本周学习指标">
          <div className="metric-card blue">
            <ListChecks size={20} />
            <span>本周复习次数</span>
            <strong>{weekly.weekReviewCount}</strong>
            <small>{weekly.weekRangeLabel} · {weekly.weekReviewedCards} 张卡</small>
          </div>
          <div className="metric-card green">
            <CheckCircle2 size={20} />
            <span>本周新增 / 掌握</span>
            <strong>{weekly.weekNewCards} / {weekly.weekMasteredCards}</strong>
            <small>{weekly.weekNewWords} 个新词 · {weekly.weekMasteredWords} 个词掌握</small>
          </div>
          <div className="metric-card">
            <Activity size={20} />
            <span>拼写正确率</span>
            <strong>{formatPercent(weekly.spellingAccuracy)}</strong>
            <small>{weekly.spellingCorrect} / {weekly.spellingTotal} 次拼写正确</small>
          </div>
          <div className="metric-card red">
            <Target size={20} />
            <span>目标完成度</span>
            <strong>{weekly.goalCompletionPercent}%</strong>
            <small>{weeklyGoalDone} / {weeklyGoalTotal} 个本周目标量</small>
          </div>
        </section>

        <div className="panel stats-combo-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Today Plan</span>
              <h2>今日 10 分钟计划</h2>
            </div>
            <Lightbulb size={20} />
          </div>
          <div className="stats-plan-summary">
            <div>
              <strong>{hasTrainingDebt ? "约 10 分钟" : "约 6 分钟"}</strong>
              <span>{hasTrainingDebt ? "先压到期，再修错词，最后补一点上下文。" : "今天没有明显负债，用短训练保持手感。"}</span>
            </div>
            <div className="stats-plan-actions">
              <Link to={firstPlanStep.to} className="primary-button">
                开始第 1 步
                <ArrowRight size={17} />
              </Link>
              <Link to="/training" className="secondary-button">训练中心</Link>
            </div>
          </div>
          <div className="stats-combo-list">
            {todayPlan.map((step, index) => {
              const Icon = step.icon;
              return (
                <Link key={step.label} to={step.to} className={step.active ? "stats-combo-step active" : "stats-combo-step"}>
                  <span className="combo-index">{index + 1}</span>
                  <Icon size={18} />
                  <div>
                    <strong>{step.label}</strong>
                    <p>{step.detail}</p>
                    <span className="stats-plan-meta">
                      <em>{step.estimate}</em>
                      <em>{step.amount}</em>
                      <em className={step.active ? "stats-plan-chip active" : "stats-plan-chip"}>{step.status}</em>
                    </span>
                  </div>
                  <ArrowRight size={16} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="stats-report-grid">
        <div className="panel stats-trend-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">7-Day Trend</span>
              <h2>最近 7 天趋势</h2>
            </div>
            <TrendingUp size={20} />
          </div>
          {!hasTrendData ? (
            <EmptyState title="暂无趋势数据" description="完成一次复习或添加新词后，这里会出现最近 7 天的变化。" />
          ) : (
            <div className="trend-chart" aria-label="最近 7 天复习趋势">
              {weekly.sevenDayTrend.map((day) => {
                const correctHeight = Math.max(4, Math.round((day.correct / maxTrendReviews) * 100));
                const wrongHeight = Math.max(day.wrong > 0 ? 4 : 0, Math.round((day.wrong / maxTrendReviews) * 100));

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
          )}
        </div>

        <div className="panel stats-goal-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Goals</span>
              <h2>目标完成度</h2>
            </div>
            <Target size={20} />
          </div>
          <div className="stats-goal-list">
            {weekly.goalProgress.map((goal) => (
              <div className="stats-goal-row" key={goal.label}>
                <div>
                  <strong>{goal.label}</strong>
                  <span>{goal.detail}</span>
                </div>
                <em>{goal.current} / {goal.target}</em>
                <div className="goal-progress" aria-label={`${goal.label}目标完成度 ${goal.percent}%`}>
                  <span style={{ width: `${goal.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-report-grid secondary">
        <div className="panel stats-wrong-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Mistakes</span>
              <h2>最常错 10 词</h2>
            </div>
            <AlertTriangle size={20} />
          </div>
          {weekly.mostWrongWords.length === 0 ? (
            <EmptyState title="暂时没有常错词" description="拼写或复习评分较低的单词会自动进入这里。" />
          ) : (
            <div className="stats-wrong-list">
              {weekly.mostWrongWords.map((item, index) => (
                <Link to="/spelling?mode=mistakes" key={item.card.id} className="stats-wrong-card">
                  <span className="wrong-rank">{index + 1}</span>
                  <div>
                    <strong>{item.card.front}</strong>
                    <span>
                      错 {item.wrongCount} 次 · 拼写错 {item.spellingWrongCount} · 最近 14 天错 {item.recentWrongCount}
                    </span>
                  </div>
                  <em>{item.accuracy === null ? "暂无正确率" : `${item.accuracy}%`}</em>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="panel stats-advice-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Next Week</span>
              <h2>下周建议</h2>
            </div>
            <Lightbulb size={20} />
          </div>
          <ol className="suggestion-list">
            {nextWeekSuggestions.map((suggestion) => (
              <li key={suggestion}>{suggestion}</li>
            ))}
          </ol>
          <div className="stats-next-due">
            <BarChart3 size={18} />
            <span>下周预计到期</span>
            <strong>{weekly.dueNextWeek}</strong>
          </div>
        </div>
      </section>

      <section className="two-column stats-detail-grid">
        <div className="panel">
          <div className="panel-header"><h2>卡片构成</h2></div>
          <div className="task-list">
            <div><span>全部卡片</span><strong>{stats.totalCards}</strong></div>
            <div><span>单词</span><strong>{activeWords}</strong></div>
            <div><span>短语</span><strong>{activePhrases}</strong></div>
            <div><span>句子</span><strong>{activeSentences}</strong></div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h2>复习概览</h2></div>
          <div className="task-list">
            <div><span>全部复习记录</span><strong>{data.reviews.length}</strong></div>
            <div><span>当前到期</span><strong>{stats.dueTotal}</strong></div>
            <div><span>薄弱词</span><strong>{stats.weakWords}</strong></div>
            <div><span>最近错误时间</span><strong>{formatDateTime(weekly.mostWrongWords[0]?.latestWrongAt ?? null)}</strong></div>
          </div>
        </div>
      </section>
    </div>
  );
}
