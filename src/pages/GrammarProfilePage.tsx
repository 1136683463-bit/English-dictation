import { ArrowLeft, CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { buildGrammarProfile } from "../services/grammarProfileService";

/**
 * ④ 语法能力画像（2026-09-22）。
 *
 * 与弱点卡的分工：弱点卡只说「当前最该修的 Top3 + 下一步」；
 * 本页讲**全貌与进展**——覆盖了多少、各罪名处于什么状态、最近在变好还是变糟、
 * 已经战胜了哪些（`healed` 数据此前从未被正面呈现）。
 *
 * 设计纪律：
 * - **不制造焦虑**：从未出现过的罪名不进列表；趋势用「变化量」而非绝对数
 * - **正面与负面并重**：已战胜的罪名单独成组，且排在显眼位置
 * - 纯本地计算，零 AI；零术语（数据层已守门）
 */
export default function GrammarProfilePage() {
  const { data } = useAppData();
  const profile = useMemo(() => buildGrammarProfile(data), [data]);

  if (profile.isEmpty) {
    return (
      <div className="page lesson-page">
        <PageHeader eyebrow="语法 · 我的画像" title="数据还太少" />
        <EmptyState
          title="再练几课就能看到画像了"
          description="画像会根据你的学习记录算出各语法点的状态与趋势——先学几课，或者去侦探里找几处错。"
        />
        <div className="lesson-stage-actions">
          <Link to="/grammar" className="primary-button">返回课程地图</Link>
        </div>
      </div>
    );
  }

  const { summary, trend } = profile;
  const trendMax = Math.max(1, ...trend.map((point) => point.mistakes));
  const lastWeek = trend[trend.length - 1]?.mistakes ?? 0;
  const prevWeek = trend[trend.length - 2]?.mistakes ?? 0;

  const healed = profile.tags.filter((item) => item.status === "healed");
  const attention = profile.tags.filter((item) => item.status === "attention");
  const stable = profile.tags.filter((item) => item.status === "stable");
  const lessonPercent = profile.lessonsTotal > 0 ? Math.round((profile.lessonsDone / profile.lessonsTotal) * 100) : 0;

  return (
    <div className="page lesson-page">
      <PageHeader
        eyebrow="语法 · 我的画像"
        title="我现在什么水平"
        description="按你的学习与练习记录算出来的——不是分数，是「哪些已经稳了、哪些还在晃」。"
        action={
          <Link to="/grammar" className="secondary-button">
            <ArrowLeft size={15} /> 返回课程地图
          </Link>
        }
      />

      {/* 一句话概括：先给结论 */}
      <section className="profile-hero" aria-label="总体情况">
        <p className="profile-hero-line">
          {summary.healedCount > 0
            ? `已经拿下 ${summary.healedCount} 个语法点`
            : "还在打基础"}
          {summary.attentionCount > 0 && `，还有 ${summary.attentionCount} 个在修`}
          {profile.lessonsDone > 0 && `。课程走过 ${profile.lessonsDone} / ${profile.lessonsTotal} 课。`}
        </p>
        {/* ④ 修复口径矛盾：hero 原先用 weekOverWeek（含「本周进行中」→ 天然偏少），
            而趋势区用 lastWeek/prevWeek，两处结论会打架。统一为同一对数字。 */}
        {summary.weekOverWeek !== null && (
          <p className={`profile-hero-trend${summary.weekOverWeek < 0 ? " good" : ""}`}>
            {summary.weekOverWeek < 0 ? (
              <>
                <TrendingDown size={15} aria-hidden="true" />
                最近 7 天比前 7 天少了 <strong>{Math.abs(summary.weekOverWeek)}</strong> 次——在变好
              </>
            ) : summary.weekOverWeek === 0 ? (
              <>最近 7 天和前 7 天持平（各 {lastWeek} 次）</>
            ) : (
              <>
                <TrendingUp size={15} aria-hidden="true" />
                最近 7 天比前 7 天多了 <strong>{summary.weekOverWeek}</strong> 次——正常波动，保持练习就好
              </>
            )}
          </p>
        )}
      </section>

      {/* ① 覆盖面 */}
      <section className="profile-block" aria-label="覆盖面">
        <h2 className="profile-block-title">走过的地方</h2>
        <div className="profile-stats">
          <div className="profile-stat">
            <b>{profile.lessonsDone}</b>
            <span>课已学完 / 共 {profile.lessonsTotal}</span>
          </div>
          <div className="profile-stat">
            <b>{profile.seasonsDone}</b>
            <span>季已走完 / 共 {profile.seasonsTotal}</span>
          </div>
          <div className="profile-stat">
            <b>{profile.mastery.mastered}</b>
            <span>句子已掌握 / 共 {profile.mastery.total}</span>
          </div>
        </div>
        <div className="profile-bar" aria-hidden="true">
          <i style={{ width: `${lessonPercent}%` }} />
        </div>
        <p className="profile-bar-note">课程进度 {lessonPercent}%</p>
      </section>

      {/* ② 时间趋势 */}
      <section className="profile-block" aria-label="最近四周">
        <h2 className="profile-block-title">最近四周</h2>
        <div className="profile-trend" role="img" aria-label={`近四周犯错次数：${trend.map((p) => p.mistakes).join("、")}`}>
          {trend.map((point) => (
            <div className="profile-trend-col" key={point.weekStart}>
              <span className="profile-trend-count">{point.mistakes}</span>
              <span
                className="profile-trend-bar"
                style={{ height: `${Math.max(4, (point.mistakes / trendMax) * 100)}%` }}
              />
              {/* ④ 标签由服务端算好（此前页面自算成「23 周前」「1本周」） */}
              <span className="profile-trend-label">{point.label}</span>
            </div>
          ))}
        </div>
        <p className="profile-bar-note">
          柱高 = 那 7 天里犯错的次数。
          {summary.weekOverWeek === null
            ? ""
            : summary.weekOverWeek < 0
              ? `最近 7 天比前 7 天少 ${Math.abs(summary.weekOverWeek)} 次。`
              : summary.weekOverWeek === 0
                ? "最近 7 天和前 7 天持平。"
                : `最近 7 天比前 7 天多 ${summary.weekOverWeek} 次——正常波动，保持练习即可。`}
        </p>
      </section>

      {/* ③ 已战胜（正面优先——动机来源） */}
      {healed.length > 0 && (
        <section className="profile-block healed" aria-label="已拿下的语法点">
          <h2 className="profile-block-title">
            <CheckCircle2 size={16} aria-hidden="true" /> 已经拿下的
          </h2>
          <ul className="profile-tag-list">
            {healed.map((item) => (
              <li className="profile-tag healed" key={item.tag}>
                <strong>{item.label}</strong>
                <span>{item.plain}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ④ 在修的 */}
      {attention.length > 0 && (
        <section className="profile-block" aria-label="还在修的语法点">
          <h2 className="profile-block-title">还在修的</h2>
          <ul className="profile-tag-list">
            {attention.map((item) => (
              <li className="profile-tag attention" key={item.tag}>
                <strong>{item.label}</strong>
                <span>{item.plain}</span>
                <em className="profile-tag-meta">
                  近 7 天 {item.recentCount} 次
                  {typeof item.mistakesSinceReplay === "number"
                    ? item.mistakesSinceReplay === 0
                      ? " · 练过后没再摔"
                      : ` · 练过后又摔 ${item.mistakesSinceReplay} 次`
                    : ""}
                </em>
              </li>
            ))}
          </ul>
          <div className="lesson-stage-actions">
            <Link to="/grammar/replay" className="primary-button">针对这些练几题</Link>
          </div>
        </section>
      )}

      {/* ⑤ 已经稳了的（有过错、近期没再犯） */}
      {stable.length > 0 && (
        <section className="profile-block" aria-label="已经稳了的语法点">
          <h2 className="profile-block-title">已经稳了的</h2>
          <ul className="profile-tag-list compact">
            {stable.map((item) => (
              <li className="profile-tag stable" key={item.tag}>
                <strong>{item.label}</strong>
                <span>累计犯过 {item.totalCount} 次，近 7 天没再出现</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
