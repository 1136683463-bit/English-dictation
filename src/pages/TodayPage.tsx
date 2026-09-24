import {
  AlertTriangle,
  ArrowRight,
  BookMarked,
  CalendarDays,
  ChevronRight,
  Clock,
  Compass,
  GraduationCap,
  Layers,
  Target,
  Zap
} from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import { getRecentErrorReviews } from "../services/reviewService";
import { getUnitStats } from "../services/unitService";
import { computeStreak } from "../services/statsService";
import {
  HOME_LINE_LABEL,
  buildHomeDirective,
  buildHomeLineRows,
  buildHomeSnapshot,
  type HomeLine
} from "../services/homeDirectiveService";
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

/** 「9月24日 星期四」。抽出来是为了让决策服务拿到日期标签后能拼出完整的 Hero 描述句。 */
const dateLabelFor = (date: Date) =>
  [
    new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric" }).format(date),
    new Intl.DateTimeFormat("zh-CN", { weekday: "long" }).format(date)
  ].join(" ");

/** 三线状态行的线别图标（线别同时有文字标签，不只靠颜色/图形区分）。 */
const lineIcon: Record<HomeLine, typeof Layers> = {
  vocab: Layers,
  grammar: GraduationCap,
  adventure: Compass
};

export default function TodayPage() {
  const { data } = useAppData();
  /**
   * 三线派生数据**只算一次**（见 `buildHomeSnapshot` 的注释）：
   * `getLearningStats` / `summarizeLessonProgress` / `listDueGrammarReviewCards` 各一次。
   *
   * 页面自己也用 `snapshot.stats`，而**不是**另调一次 `getLearningStats`：
   * 既少一次全量扫描，也让「Hero 文案 / 主 CTA / 摘要条 / 任务队列」四处
   * 在结构上共用**同一个** stats 对象——它们不可能对同一状态给出不同数字。
   * （本仓库有专门的闸在盯这类重复计算：`pf2e-cache-candidates` / `pf2f-page-call-counts`。）
   */
  const snapshot = buildHomeSnapshot(data);
  const stats = snapshot.stats;
  const recentErrors = getRecentErrorReviews(data, 4);
  const units = data.units.slice().sort((a, b) => a.order - b.order).slice(0, 4);
  const minutes = estimateMinutes(stats.dueTotal, stats.weakWords);
  const streak = computeStreak(data.reviews);
  const today = new Date();
  const dateLabel = dateLabelFor(today);

  /**
   * 首屏决策（2026-09-24 首页重规划 P1）：**文案、主 CTA 文案、主 CTA 落点、
   * 「为什么是它」说明行**全部来自这一个返回值 —— 结构上不可能再不同源。
   *
   * 改造前的缺陷（瑞思实测 + 代码必然）：`primaryTask` 只看词汇三数、`grammarTarget`
   * 只看语法，两个口径写在同一块 Hero 里。真实数据下（0 到期 / 0 薄弱 / 115 新词 / 0 课）
   * 必然渲染成「建议可以推进新词」+ 按钮「继续第 1 课」——推荐词汇、按钮开语法。
   * 这不是文案瑕疵，是两套口径：修法是让它们读同一个变量，而不是改措辞。
   *
   * 决策规则见 `homeDirectiveService.buildHomeDirective`（R1 续上优先 / R2 回退链 / R3 兜底）。
   */
  const directive = buildHomeDirective({ snapshot, minutes, dateLabel });
  /**
   * 三线状态行（改造前首页对 `adventure` 的引用数为 0，而冒险线是三条线里
   * **唯一有真实消费行为**的那条：6 段故事 17 个节点、3 段被真读、11 次选择）。
   * 每行 = 线名 + 上次位置 + 上次时间 + 下一步，按最近活动倒序；空态也给一个具体的第一步，
   * 不显示裸 `0/N`（裸 0 仪表盘是既有反馈「有时候有按钮有时候没有」的同一族问题）。
   */
  const lineRows = buildHomeLineRows(snapshot);

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
    /**
     * ⚠️ 第 5 行「语法阶梯」已于 2026-09-24 移出本列表，改为上面「三线状态行」里的语法行
     * （`buildHomeLineRows` 的 grammar 行）。**文字「语法阶梯」与分母 `/205` 都保留在那一行**——
     * rv15 ③ 正是靠这两点判定「进度数字与 lessonService 同源」，不是靠它在本列表里。
     * 移出的原因是范围管理原则：本期每新增一块都要配一处移除或延后，
     * 而语法线已经在首屏有主 CTA，再占一行任务队列就是把「进度位置」讲两遍。
     */
  ];

  return (
    <div className="today-v2">
      <BannerHero
        eyebrow="今天做什么"
        title={`${greetingByHour()}，继续今天的练习 👋`}
        description={directive.heroDesc}
        image={todayBanner}
        position="68% 30%"
        /**
         * 首屏主 CTA + 「为什么是它」说明行。
         *
         * 三处（描述句 / CTA 文案 / CTA 落点）与 note 都来自**同一个 `directive`**，
         * `data-line` 是给守门测试的机器可读归属——rv15 的闸自检靠它判定
         * 「文案与按钮是否同源」（改造前它们来自两套口径，且必然自相矛盾）。
         * eyebrow 也顺带从英文 "Next Best Action" 改为中文：首屏最显眼的字不该是术语。
         */
        action={
          <Link
            to={directive.to}
            className="primary-button"
            data-testid="today-primary-cta"
            data-line={directive.line}
          >
            <GraduationCap size={18} />
            {directive.ctaLabel}
            <ArrowRight size={18} />
          </Link>
        }
        note={
          <span data-testid="today-cta-note" data-line={directive.line}>
            {directive.reason}
          </span>
        }
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

        {/**
         * 三线状态行（2026-09-24 首页重规划新增）。
         *
         * 为什么必须有：改造前 `TodayPage` 对 `adventure` 的引用数为 **0**，
         * 而冒险线是三条线里唯一有真实消费行为的那条（6 段 17 节点、3 段被真读、11 次选择）。
         * 语法线拿了主 CTA，冒险线连一行都没有——曝光与真实消费完全反向。
         *
         * 形态是**细行**不是等权大卡：并列等权大卡会让每次会话都付一次「今天做哪条」的
         * 排序决策，而三条线的进度语言互不相同（`12 个到期` / `3/205` / `第 8 章`）无法比较；
         * 移动端可用高度也只有 454px（667 − 底栏 213），放不下三个等权区块。
         * 发现性的最小充分形式是「常驻可见」，不是「抢占主按钮」。
         *
         * 每行都常驻（含空态），因为既有反馈里出现过三次「有时候有按钮有时候没有」。
         */}
        <section className="today-panel today-lines" aria-label="三条线走到哪了">
          <div className="today-panel-head">
            <span className="today-panel-icon" aria-hidden="true">
              <Compass size={19} />
            </span>
            <h2>三条线走到哪了</h2>
          </div>
          <div className="today-line-list">
            {lineRows.map((row) => {
              const Icon = lineIcon[row.line];
              return (
                <Link
                  key={row.line}
                  to={row.to}
                  className="today-line-row"
                  data-line={row.line}
                  /**
                   * 语法行**继承**原 Hero 主 CTA 的 `today-grammar-cta` 测试锚点：那条闸
                   * （rv15 ①②③④）原本查 Hero 上名为 `today-grammar-cta` 的元素，
                   * 而重规划后 Hero 的主 CTA 允许指向任意一条线，所以语法线的固定入口锚点
                   * 移到这一行。**这是位置移动，不是判据放宽**——四条断言一字未改：
                   * 仍要求指向第 N 课、文本含「语法阶梯」与 `/205`、空态落点在语法线内。
                   * 新位置（strip 之后）比原先的任务队列第 5 行**更靠前**。
                   * 不把这条锚点改成 `home-line-row`，正是为了不改动那条既有闸。
                   */
                  {...(row.line === "grammar" ? { "data-testid": "today-grammar-cta" } : {})}
                >
                  <span
                    className={`today-task-icon tone-${row.line === "adventure" ? "blue" : row.line === "grammar" ? "orange" : "green"}`}
                    aria-hidden="true"
                  >
                    <Icon size={21} />
                  </span>
                  <span className="today-line-main">
                    <strong>{HOME_LINE_LABEL[row.line]}</strong>
                    <span>
                      {row.position}
                      {row.action ? ` · ${row.action}` : ""}
                    </span>
                  </span>
                  <span className="today-line-tail">
                    {row.value && <strong className="today-line-value">{row.value}</strong>}
                    {row.timeLabel && <small>{row.timeLabel}</small>}
                  </span>
                  <ChevronRight size={18} className="today-task-chevron" aria-hidden="true" />
                </Link>
              );
            })}
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
