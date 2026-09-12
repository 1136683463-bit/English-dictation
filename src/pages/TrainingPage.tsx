import {
  ArrowRight,
  BookMarked,
  BookOpenCheck,
  Flame,
  Import,
  Keyboard,
  ListChecks,
  Map,
  RotateCcw,
  Sparkles,
  Volume2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import PageHeader from "../components/PageHeader";
import { getLearningStats, getWeakStats } from "../services/reviewService";

const estimateMinutes = (dueTotal: number, weakWords: number) => {
  if (dueTotal === 0 && weakWords === 0) return 6;
  return Math.max(8, Math.min(28, Math.ceil(dueTotal * 0.1 + weakWords * 0.5)));
};

export default function TrainingPage() {
  const { data } = useAppData();
  const stats = getLearningStats(data);
  const weakStats = getWeakStats(data);
  const minutes = estimateMinutes(stats.dueTotal, weakStats.weakWords);

  const modes = [
    {
      title: "听音拼写",
      description: "听发音写单词，适合把认识的词练到能拼出来。",
      meta: `${stats.dueWords || stats.availableNewWords} 个可练单词`,
      to: "/spelling",
      icon: Volume2,
      tone: "blue"
    },
    {
      title: "错词专项",
      description: "只处理最近错过、连续错过或标记重点的词。",
      meta: `${weakStats.weakWords} 个薄弱词`,
      to: "/spelling?mode=mistakes",
      icon: Flame,
      tone: "red"
    },
    {
      title: "错词本",
      description: "按日期查看错词，生成例句或把当天错词串成小故事。",
      meta: `${stats.wrongToday} 个今日错词`,
      to: "/mistakes",
      icon: BookMarked,
      tone: "neutral"
    },
    {
      title: "冒险学习",
      description: "读分支故事、做选择，并把愿意复习的词保存到词库。",
      meta: `${data.adventures.length} 段已保存路线`,
      to: "/adventure",
      icon: Map,
      tone: "teal"
    },
    {
      title: "单元训练",
      description: "按词书或单元进入拼写，适合集中推进一组词。",
      meta: `${data.units.length} 个词书单元`,
      to: "/units",
      icon: BookOpenCheck,
      tone: "green"
    },
    {
      title: "句子回译",
      description: "看中文提示或释义，回忆英文句子和表达。",
      meta: `${stats.cardsByType.sentences} 个句子`,
      to: "/review",
      icon: RotateCcw,
      tone: "neutral"
    },
    {
      title: "材料听写",
      description: "下一版重点：从材料逐句播放、输入、批改、回流错词。",
      meta: `${data.materials.length} 份材料`,
      to: "/import",
      icon: Import,
      tone: "teal"
    }
  ];

  return (
    <div className="page training-page">
      <PageHeader
        eyebrow="Training"
        title="选择今天的训练方式"
        description="复习、拼写、错词和材料训练都从这里开始；先完成今日训练，再按需要专项加练。"
        action={
          <Link to="/today" className="secondary-button">
            回到今日
          </Link>
        }
      />

      <section className="mode-hero">
        <div className="mode-hero-copy">
          <span className="eyebrow">Recommended</span>
          <h2>今日训练</h2>
          <p>
            预计 {minutes} 分钟，优先处理 {stats.dueTotal} 个到期复习和 {weakStats.weakWords} 个薄弱词。
          </p>
        </div>
        <div className="mode-hero-stats" aria-label="今日训练摘要">
          <div>
            <span>到期</span>
            <strong>{stats.dueTotal}</strong>
          </div>
          <div>
            <span>错词</span>
            <strong>{weakStats.weakWords}</strong>
          </div>
          <div>
            <span>今日已练</span>
            <strong>{stats.reviewedToday}</strong>
          </div>
        </div>
        <div className="mode-hero-actions">
          <Link to="/review" className="primary-button">
            开始今日训练
            <ArrowRight size={18} />
          </Link>
          <Link to="/spelling" className="secondary-button">
            <Volume2 size={17} />
            听音拼写
          </Link>
        </div>
      </section>

      <section className="mode-grid" aria-label="训练模式">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <Link key={mode.title} to={mode.to} className={`mode-card ${mode.tone}`}>
              <span className="mode-card-icon">
                <Icon size={20} />
              </span>
              <div>
                <strong>{mode.title}</strong>
                <p>{mode.description}</p>
              </div>
              <em>{mode.meta}</em>
              <ArrowRight size={17} />
            </Link>
          );
        })}
      </section>

      <section className="panel training-note-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Flow</span>
            <h2>推荐节奏</h2>
          </div>
          <Sparkles size={20} />
        </div>
        <div className="training-flow">
          <div>
            <ListChecks size={18} />
            <strong>先清到期</strong>
            <span>让复习负债别滚大。</span>
          </div>
          <div>
            <Flame size={18} />
            <strong>再练错词</strong>
            <span>当天错过的词，尽快回炉。</span>
          </div>
          <div>
            <Keyboard size={18} />
            <strong>最后补新词</strong>
            <span>时间够，再推进新材料。</span>
          </div>
        </div>
      </section>
    </div>
  );
}
