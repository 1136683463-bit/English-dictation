import {
  AlertTriangle,
  ArrowRight,
  BookMarked,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Target,
  Zap
} from "lucide-react";
import type { CSSProperties } from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import BannerHero from "../components/BannerHero";
import { getLearningStats, getRecentErrorReviews } from "../services/reviewService";
import { summarizeLessonProgress } from "../services/lessonService";
import { getUnitStats } from "../services/unitService";
import { CardType, ReviewMode } from "../types";
import todayHero from "../assets/today-hero.jpg";

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

const dayKey = (date: Date) => date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

const computeStreak = (reviews: { reviewedAt: string }[]) => {
  const days = new Set(reviews.map((review) => dayKey(new Date(review.reviewedAt))));
  const offsetKey = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    return dayKey(date);
  };

  let cursor = days.has(offsetKey(0)) ? 0 : days.has(offsetKey(1)) ? 1 : -1;
  if (cursor === -1) return 0;

  let streak = 0;
  while (days.has(offsetKey(cursor))) {
    streak += 1;
    cursor += 1;
  }
  return streak;
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
  const primaryTask =
    stats.dueTotal > 0
      ? "先清到期复习"
      : stats.weakWords > 0
        ? "先处理错词"
        : stats.availableNewWords > 0
          ? "可以推进新词"
          : "今天轻量保持";
  const streak = computeStreak(data.reviews);
  const lessonSummary = useMemo(() => summarizeLessonProgress(data), [data]);
  const todayPercent = Math.min(100, Math.round((stats.reviewedToday / Math.max(1, stats.dueReviewGoal)) * 100));
  const today = new Date();
  const dateLabel = [
    new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric" }).format(today),
    new Intl.DateTimeFormat("zh-CN", { weekday: "long" }).format(today)
  ].join(" ");

  const tasks = [
    {
      key: "due",
      to: "/review",
      tone: "orange",
      icon: Clock,
      title: "到期复习",
      desc: `${stats.dueWords} 个单词 · ${stats.dueSentences} 个句子到期`,
      current: stats.reviewedToday,
      target: stats.dueReviewGoal,
      percent: todayPercent,
      active: true
    },
    {
      key: "mistakes",
      to: "/mistakes",
      tone: "red",
      icon: AlertTriangle,
      title: "错词专项",
      desc: `${stats.weakWords} 个薄弱词 · 今日错 ${stats.wrongToday}`,
      current: stats.wrongCards,
      target: null,
      percent: null,
      active: false
    },
    {
      key: "new",
      to: "/spelling",
      tone: "blue",
      icon: Target,
      title: "新词目标",
      desc: `${stats.availableNewWords} 个新词还在队列里`,
      current: stats.newWordsToday,
      target: stats.newWordGoal,
      percent: goalPercent(stats.newWordsToday, stats.newWordGoal),
      active: false
    },
    {
      key: "grammar",
      to: "/grammar",
      tone: "amber",
      icon: GraduationCap,
      title: "语法 10 分钟",
      desc:
        lessonSummary.nextLesson != null
          ? `已完成 ${lessonSummary.done}/${lessonSummary.total} 课 · 下一课：${lessonSummary.nextLesson.title}`
          : `12 课全部完成，去侦探找错巩固一下`,
      current: lessonSummary.done,
      target: lessonSummary.total,
      percent: lessonSummary.percent,
      active: false
    },
    {
      key: "sentences",
      to: null,
      tone: "green",
      icon: BookMarked,
      title: "句子目标",
      desc: `今天已碰到 ${stats.reviewedSentencesToday} 个句子`,
      current: stats.reviewedSentencesToday,
      target: stats.sentenceGoal,
      percent: goalPercent(stats.reviewedSentencesToday, stats.sentenceGoal),
      active: false
    }
  ];

  return (
    <div className="page today-page">
      <BannerHero
        eyebrow="Next Best Action"
        title={`${greetingByHour()}，继续今天的练习`}
        description={`${dateLabel} · 建议${primaryTask}，先练 ${minutes} 分钟`}
        image={todayHero}
        position="72% 10%"
        action={
          <>
            <Link to="/training" className="primary-button">
              开始今日训练
              <ArrowRight size={18} />
            </Link>
            <Link to="/mistakes" className="secondary-button">
              <Zap size={17} />
              错词本
            </Link>
          </>
        }
      />

      <div className="today-content">
      <section className="ui-surface ui-figures" aria-label="今日摘要">
        <div className="ui-figure">
          <span>到期</span>
          <strong>{stats.dueTotal}</strong>
          <small>{stats.dueWords} 词 · {stats.dueSentences} 句</small>
        </div>
        <div className="ui-figure">
          <span>已练</span>
          <strong>{stats.reviewedToday}</strong>
          <small>{stats.reviewedCardsToday} 张卡</small>
        </div>
        <div className="ui-figure">
          <span>薄弱</span>
          <strong>{stats.weakWords}</strong>
          <small>错卡 {stats.wrongCards}</small>
        </div>
        {streak > 0 && (
          <div className="ui-figure">
            <span>连续打卡</span>
            <strong>{streak}</strong>
            <small>天</small>
          </div>
        )}
      </section>

      <section className="today-cols">
        <div>
          <div className="ui-section-head">
            <div>
              <span className="eyebrow">Queue</span>
              <h2>今日任务队列</h2>
            </div>
            <Link to="/training" className="ui-quiet">
              选择模式 ›
            </Link>
          </div>
          <div className="ui-surface">
            {tasks.map((task) => {
              const Icon = task.icon;
              const hasGoal = typeof task.percent === "number";
              const row = (
                <>
                  {hasGoal ? (
                    <span
                      className={`ui-ring ui-ring--${task.tone}`}
                      style={{ "--pct": task.percent } as CSSProperties}
                      role="img"
                      aria-label={`${task.title}完成度 ${task.percent}%`}
                    >
                      <Icon size={18} />
                    </span>
                  ) : (
                    <span className={`ui-icon ui-icon--${task.tone}`}>
                      <Icon size={20} />
                    </span>
                  )}
                  <div>
                    <span className="ui-row-title">{task.title}</span>
                    <span className="ui-row-desc">{task.desc}</span>
                  </div>
                  <span className="ui-row-metric">
                    <span className="ui-row-metric-num">
                      <b>{task.current}</b>
                      {task.target != null && <i>/{task.target}</i>}
                    </span>
                  </span>
                  <span className="ui-row-arrow" aria-hidden="true">
                    <ChevronRight size={17} />
                  </span>
                </>
              );

              return task.to ? (
                <Link key={task.key} to={task.to} className={`ui-row${task.active ? " on" : ""}`}>
                  {row}
                </Link>
              ) : (
                <div key={task.key} className="ui-row">
                  {row}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="ui-section-head">
            <div>
              <span className="eyebrow">Mistakes</span>
              <h2>最近错误</h2>
            </div>
            <Link to="/mistakes" className="ui-quiet">
              全部 ›
            </Link>
          </div>
          {recentErrors.length === 0 ? (
            <div className="ui-empty">
              <span className="ui-empty-icon">
                <CheckCircle2 size={24} />
              </span>
              <span className="ui-empty-title">还没有错误记录</span>
              <p>今天练错的词会自动留在这里，方便下一轮优先攻克。</p>
            </div>
          ) : (
            <div className="ui-surface">
              {recentErrors.map((item) => {
                const meta = [
                  item.description,
                  `${cardTypeLabel[item.type]} · ${modeLabel[item.review.mode]} · 评分 ${item.review.rating}`,
                  `下次 ${formatDateTime(item.nextReviewAt)}`
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <Link key={item.review.id} to="/mistakes" className="ui-row">
                    <span className="ui-icon ui-icon--red ui-icon--letter" aria-hidden="true">
                      {item.title.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <span className="ui-row-title">{item.title}</span>
                      <span className="ui-row-desc">{meta}</span>
                    </div>
                    <span className="ui-row-tail">
                      <span>{formatDateTime(item.review.reviewedAt)}</span>
                    </span>
                    <span className="ui-row-arrow" aria-hidden="true">
                      <ChevronRight size={17} />
                    </span>
                  </Link>
                );
              })}
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
    </div>
  );
}
