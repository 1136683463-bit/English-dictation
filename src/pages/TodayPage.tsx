import {
  AlertTriangle,
  ArrowRight,
  BookMarked,
  CheckCircle2,
  Clock,
  Keyboard,
  Layers,
  Plus,
  Target,
  Volume2,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import PageHeader from "../components/PageHeader";
import { getLearningStats, getRecentErrorReviews } from "../services/reviewService";
import { getUnitStats } from "../services/unitService";
import { CardType, ReviewMode } from "../types";

const modeLabel: Record<ReviewMode, string> = {
  recognize: "识别",
  recall: "回忆",
  spelling: "拼写",
  cloze: "挖空",
  dictation: "听写"
};

const cardTypeLabel: Record<CardType, string> = {
  word: "单词",
  phrase: "短语",
  sentence: "句子"
};

const formatDateTime = (value: string | null) => {
  if (!value) return "暂无安排";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "时间未知";

  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
};

const goalPercent = (current: number, target: number) => {
  if (target <= 0) return current > 0 ? 100 : 0;
  return Math.min(100, Math.round((current / target) * 100));
};

const estimateMinutes = (dueTotal: number, weakWords: number) => {
  if (dueTotal === 0 && weakWords === 0) return 6;
  return Math.max(8, Math.min(28, Math.ceil(dueTotal * 0.1 + weakWords * 0.5)));
};

export default function TodayPage() {
  const { data } = useAppData();
  const stats = getLearningStats(data);
  const recentErrors = getRecentErrorReviews(data, 5);
  const units = data.units.slice().sort((a, b) => a.order - b.order).slice(0, 4);
  const minutes = estimateMinutes(stats.dueTotal, stats.weakWords);
  const goalRows = [
    {
      label: "新词目标",
      detail: `${stats.availableNewWords} 个新词还在队列里`,
      current: stats.newWordsToday,
      target: stats.newWordGoal,
      icon: Target,
      tone: "teal"
    },
    {
      label: "句子目标",
      detail: `今天已碰到 ${stats.reviewedSentencesToday} 个句子`,
      current: stats.reviewedSentencesToday,
      target: stats.sentenceGoal,
      icon: BookMarked,
      tone: "blue"
    }
  ];
  const primaryTask =
    stats.dueTotal > 0
      ? "先清到期复习"
      : stats.weakWords > 0
        ? "先处理错词"
        : stats.availableNewWords > 0
          ? "可以推进新词"
          : "今天轻量保持";

  return (
    <div className="page today-page">
      <PageHeader
        eyebrow="Today"
        title={`今天建议先练 ${minutes} 分钟`}
        description={`${primaryTask}。单词是入口，句子是核心，错误会自动变成下一轮训练。`}
      />

      <section className="action-hero">
        <div className="action-hero-main">
          <span className="eyebrow">Next Best Action</span>
          <h2>{primaryTask}</h2>
          <p>
            到期 {stats.dueTotal} 个 · 错词 {stats.weakWords} 个 · 今日已练 {stats.reviewedToday} 次。
          </p>
          <div className="action-hero-actions">
            <Link to="/training" className="primary-button">
              开始今日训练
              <ArrowRight size={18} />
            </Link>
            <Link to="/mistakes" className="secondary-button">
              <Zap size={17} />
              错词本
            </Link>
          </div>
        </div>
        <div className="action-hero-stats" aria-label="今日摘要">
          <div className="blue">
            <Clock size={18} />
            <span>到期</span>
            <strong>{stats.dueTotal}</strong>
            <small>{stats.dueWords} 词 · {stats.dueSentences} 句</small>
          </div>
          <div className="green">
            <CheckCircle2 size={18} />
            <span>已练</span>
            <strong>{stats.reviewedToday}</strong>
            <small>{stats.reviewedCardsToday} 张卡</small>
          </div>
          <div className="red">
            <AlertTriangle size={18} />
            <span>薄弱</span>
            <strong>{stats.weakWords}</strong>
            <small>错卡 {stats.wrongCards}</small>
          </div>
        </div>
      </section>

      <section className="two-column today-workbench">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Queue</span>
              <h2>今日任务队列</h2>
            </div>
            <Link to="/training" className="secondary-button compact-button">选择模式</Link>
          </div>
          <div className="task-queue">
            <Link to="/review" className="task-row priority">
              <span className="goal-icon accent"><Clock size={18} /></span>
              <div>
                <strong>到期复习</strong>
                <span>{stats.dueWords} 个单词 · {stats.dueSentences} 个句子到期</span>
              </div>
              <em>{stats.reviewedToday} / {stats.dueReviewGoal}</em>
            </Link>
            <Link to="/mistakes" className="task-row warning">
              <span className="goal-icon danger"><AlertTriangle size={18} /></span>
              <div>
                <strong>错词专项</strong>
                <span>{stats.weakWords} 个薄弱词 · 今日错 {stats.wrongToday}</span>
              </div>
              <em>{stats.wrongCards}</em>
            </Link>
            {goalRows.map((goal) => {
              const Icon = goal.icon;
              const percent = goalPercent(goal.current, goal.target);

              return (
                <div className="task-row" key={goal.label}>
                  <span className={`goal-icon ${goal.tone}`}><Icon size={18} /></span>
                  <div>
                    <strong>{goal.label}</strong>
                    <span>{goal.detail}</span>
                    <div className="goal-progress" aria-label={`${goal.label}完成度 ${percent}%`}>
                      <span style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                  <em>{goal.current} / {goal.target}</em>
                </div>
              );
            })}
          </div>
          <div className="quick-action-row">
            <Link to="/training" className="primary-button">
              开始今日训练
              <ArrowRight size={18} />
            </Link>
            <Link to="/spelling" className="secondary-button">
              <Volume2 size={17} />
              听音拼写
            </Link>
            <Link to="/add" className="secondary-button">
              <Plus size={17} />
              添加内容
            </Link>
            <Link to="/library" className="secondary-button compact-action">
              <Layers size={17} />
              词库
            </Link>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Mistakes</span>
              <h2>最近错误</h2>
            </div>
            <span className="panel-count">{stats.wrongCards} 张错卡</span>
          </div>
          {recentErrors.length === 0 ? (
            <p className="muted">还没有错误记录。今天的错题会留在这里，方便下一轮优先处理。</p>
          ) : (
            <div className="recent-error-feed">
              {recentErrors.map((item) => (
                <div className="recent-error-item" key={item.review.id}>
                  <div className="recent-error-main">
                    <strong>{item.title}</strong>
                    {item.description && <span>{item.description}</span>}
                  </div>
                  <div className="recent-error-meta">
                    <span>{cardTypeLabel[item.type]} · {modeLabel[item.review.mode]} · 评分 {item.review.rating}</span>
                    <span>{formatDateTime(item.review.reviewedAt)}</span>
                    <span>下次 {formatDateTime(item.nextReviewAt)}</span>
                  </div>
                  <div className="recent-error-actions">
                    <Link to="/mistakes" className="secondary-button compact-button">错词本</Link>
                    <Link to="/library" className="secondary-button compact-button">查看词库</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="panel unit-overview-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Units</span>
            <h2>继续单元练习</h2>
          </div>
          <Link to="/library" className="secondary-button">查看词库</Link>
        </div>
        <div className="unit-strip">
          {units.map((unit) => {
            const unitStats = getUnitStats(data, unit);
            return (
              <Link key={unit.id} to={`/spelling?unit=${unit.id}`} className="unit-strip-card">
                <strong>{unit.title}</strong>
                <span>{unitStats.total} 词 · 到期 {unitStats.due}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
