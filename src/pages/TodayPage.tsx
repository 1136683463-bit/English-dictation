import {
  AlertTriangle,
  ArrowRight,
  BookMarked,
  CalendarDays,
  ChevronRight,
  Clock,
  Target,
  Zap
} from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import { getLearningStats, getRecentErrorReviews } from "../services/reviewService";
import { getUnitStats } from "../services/unitService";
import { computeStreak } from "../services/statsService";
import { CardType, ReviewMode } from "../types";
import BannerHero from "../components/BannerHero";
import todayBanner from "../assets/today-banner.jpg";
import unitIllust1 from "../assets/today-unit-1.png";
import unitIllust2 from "../assets/today-unit-2.png";
import unitIllust3 from "../assets/today-unit-3.png";
import unitIllust4 from "../assets/today-unit-4.png";

const modeLabel: Record<ReviewMode, string> = {
  recognize: "识别",
  recall: "回忆",
  spelling: "拼写",
  cloze: "挖空",
  dictation: "听写",
  rebuild: "拼句"
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

const estimateMinutes = (dueTotal: number, weakWords: number) => {
  if (dueTotal === 0 && weakWords === 0) return 6;
  return Math.max(8, Math.min(28, Math.ceil(dueTotal * 0.1 + weakWords * 0.5)));
};

const greetingByHour = () => {
  const hour = new Date().getHours();
  if (hour < 11) return "早上好";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  return "晚上好";
};

export default function TodayPage() {
  const { data } = useAppData();
  const stats = getLearningStats(data);
  const recentErrors = getRecentErrorReviews(data, 4);
  const units = data.units.slice().sort((a, b) => a.order - b.order).slice(0, 4);
  const minutes = estimateMinutes(stats.dueTotal, stats.weakWords);
  const streak = computeStreak(data.reviews);
  const primaryTask =
    stats.dueTotal > 0
      ? "先清到期复习"
      : stats.weakWords > 0
        ? "先处理错词"
        : stats.availableNewWords > 0
          ? "可以推进新词"
          : "今天轻量保持";
  const today = new Date();
  const dateLabel = [
    new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric" }).format(today),
    new Intl.DateTimeFormat("zh-CN", { weekday: "long" }).format(today)
  ].join(" ");

  const stripStats = [
    { label: "到期复习", value: stats.dueTotal, unit: "词 · 句" },
    { label: "已练习", value: stats.reviewedCardsToday, unit: "张卡片" },
    { label: "薄弱词", value: stats.weakWords, unit: "词卡" },
    { label: "连续打卡", value: streak, unit: "天" }
  ];

  const tasks = [
    {
      key: "due",
      to: "/review",
      tone: "orange",
      icon: Clock,
      title: "到期复习",
      desc: `${stats.dueWords} 个单词 · ${stats.dueSentences} 个句子到期`,
      value: stats.reviewedToday,
      target: stats.dueReviewGoal,
      arc: Math.min(100, Math.round((stats.reviewedToday / Math.max(1, stats.dueReviewGoal)) * 100)),
      highlight: true
    },
    {
      key: "mistakes",
      to: "/mistakes",
      tone: "red",
      icon: AlertTriangle,
      title: "错词专项",
      desc: `${stats.weakWords} 个薄弱词 · 今日错 ${stats.wrongToday}`,
      value: stats.wrongCards,
      target: 0,
      arc: 0,
      highlight: false
    },
    {
      key: "new",
      to: "/training",
      tone: "blue",
      icon: Target,
      title: "新词目标",
      desc: `${stats.availableNewWords} 个新词还在队列里`,
      value: stats.newWordsToday,
      target: stats.newWordGoal,
      arc: Math.min(100, Math.round((stats.newWordsToday / Math.max(1, stats.newWordGoal)) * 100)),
      highlight: false
    },
    {
      key: "sentence",
      to: "/sentences",
      tone: "green",
      icon: BookMarked,
      title: "句子目标",
      desc: `今天已碰到 ${stats.reviewedSentencesToday} 个句子`,
      value: stats.reviewedSentencesToday,
      target: stats.sentenceGoal,
      arc: Math.min(100, Math.round((stats.reviewedSentencesToday / Math.max(1, stats.sentenceGoal)) * 100)),
      highlight: false
    }
  ];

  return (
    <div className="today-v2">
      <BannerHero
        eyebrow="Next Best Action"
        title={`${greetingByHour()}，继续今天的练习 👋`}
        description={`${dateLabel} · 建议${primaryTask}，先练 ${minutes} 分钟`}
        image={todayBanner}
        position="68% 30%"
      />

      <div className="today-v2-inner">
        <section className="today-strip" aria-label="今日摘要">
          <span className="today-strip-icon" aria-hidden="true">
            <CalendarDays size={26} />
          </span>
          {stripStats.map((item) => (
            <div className="today-strip-stat" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.unit}</small>
            </div>
          ))}
          <div className="today-strip-actions">
            <Link to="/training" className="primary-button">
              开始今日训练
              <ArrowRight size={18} />
            </Link>
            <Link to="/mistakes" className="secondary-button">
              <Zap size={16} />
              错词本
            </Link>
          </div>
        </section>

        <section className="today-columns">
          <div className="today-panel">
            <div className="today-panel-head">
              <span className="today-panel-icon" aria-hidden="true">
                <Target size={19} />
              </span>
              <h2>今日任务队列</h2>
            </div>
            <div className="today-task-list">
              {tasks.map((task) => {
                const Icon = task.icon;
                return (
                  <Link
                    key={task.key}
                    to={task.to}
                    className={`today-task-row${task.highlight ? " highlight" : ""}`}
                  >
                    <span
                      className={`today-task-icon tone-${task.tone}`}
                      style={task.target > 0 ? ({ "--arc": task.arc } as CSSProperties) : undefined}
                      aria-hidden="true"
                    >
                      <Icon size={21} />
                    </span>
                    <span className="today-task-main">
                      <strong>{task.title}</strong>
                      <span>{task.desc}</span>
                    </span>
                    <span className="today-task-value">
                      <strong>{task.value}</strong>
                      {task.target > 0 && <small>/{task.target}</small>}
                    </span>
                    <ChevronRight size={18} className="today-task-chevron" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="today-panel">
            <div className="today-panel-head">
              <span className="today-panel-emoji" aria-hidden="true">🐷</span>
              <h2>最近错误</h2>
              <Link to="/mistakes" className="today-panel-link">
                查看全部
                <ChevronRight size={15} />
              </Link>
            </div>
            {recentErrors.length === 0 ? (
              <p className="today-errors-empty">还没有错误记录。今天的错题会留在这里，方便下一轮优先处理。</p>
            ) : (
              <div className="today-error-list">
                {recentErrors.map((item) => (
                  <Link to="/mistakes" className="today-error-row" key={item.review.id}>
                    <span className="today-error-avatar" aria-hidden="true">
                      {(item.title[0] ?? "?").toUpperCase()}
                    </span>
                    <span className="today-error-main">
                      <strong>{item.title}</strong>
                      <span>
                        {item.description ? `${item.description} · ` : ""}
                        {cardTypeLabel[item.type]} · {modeLabel[item.review.mode]} · 评分 {item.review.rating}
                      </span>
                    </span>
                    <span className="today-error-time">{formatDateTime(item.review.reviewedAt)}</span>
                    <ChevronRight size={16} className="today-task-chevron" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="today-panel today-units">
          <div className="today-panel-head">
            <span className="today-panel-icon" aria-hidden="true">
              <BookMarked size={19} />
            </span>
            <h2>继续词书练习</h2>
            <Link to="/units" className="today-panel-link">
              查看词书
              <ChevronRight size={15} />
            </Link>
          </div>
          {units.length === 0 ? (
            <p className="today-errors-empty">还没有词书，先去「添加」里创建内容吧。</p>
          ) : (
            <div className="today-unit-grid">
              {units.map((unit, index) => {
                const unitStats = getUnitStats(data, unit);
                const percent = unitStats.total > 0
                  ? Math.max(0, Math.min(100, Math.round(((unitStats.total - unitStats.due) / unitStats.total) * 100)))
                  : 0;
                return (
                  <Link
                    key={unit.id}
                    to={`/spelling?unit=${unit.id}`}
                    className={`today-unit-card tint-${(index % 4) + 1}`}
                  >
                    <strong>{unit.title}</strong>
                    <span>{unitStats.total} 词 · 到期 {unitStats.due}</span>
                    <span className="today-unit-progress" aria-label={`完成度 ${percent}%`}>
                      <span style={{ width: `${percent}%` }} />
                    </span>
                    <img
                      src={[unitIllust1, unitIllust2, unitIllust3, unitIllust4][index % 4]}
                      alt=""
                      aria-hidden="true"
                      className="today-unit-illust"
                      loading="lazy"
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
