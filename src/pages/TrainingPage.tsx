import {
  ArrowRight,
  BookMarked,
  BookOpenCheck,
  ChevronRight,
  Flame,
  Import,
  Map,
  RotateCcw,
  Volume2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import BannerHero from "../components/BannerHero";
import { getLearningStats } from "../services/reviewService";
import trainingHero from "../assets/training-hero.jpg";

const estimateMinutes = (dueTotal: number, weakWords: number) => {
  if (dueTotal === 0 && weakWords === 0) return 6;
  return Math.max(8, Math.min(28, Math.ceil(dueTotal * 0.1 + weakWords * 0.5)));
};

export default function TrainingPage() {
  const { data } = useAppData();
  // R2：薄弱词数字统一走权威源 getLearningStats（getWeakCards 口径），不再单独调 getWeakStats。
  const stats = getLearningStats(data);
  const minutes = estimateMinutes(stats.dueTotal, stats.weakWords);

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
      meta: `${stats.weakWords} 个薄弱词`,
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
      tone: "orange"
    },
    {
      title: "词书训练",
      description: "按词书进入拼写，适合集中推进一组词。",
      meta: `${data.units.length} 本词书`,
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
      tone: "blue"
    }
  ];

  const steps = [
    {
      no: "01",
      title: "先清到期",
      desc: "让复习负债别滚大。到期的词是记忆曲线最紧的一段，先处理性价比最高。"
    },
    {
      no: "02",
      title: "再练错词",
      desc: "当天错过的词尽快回炉。刚犯过的错误在几小时内纠正，留存率最高。"
    },
    {
      no: "03",
      title: "最后补新词",
      desc: "时间够再推进新材料。把新词留到精力最后，避免挤压复习。"
    }
  ];

  return (
    <div className="page training-page">
      <BannerHero
        eyebrow="Training"
        title="选择今天的训练方式"
        description="复习、拼写、错词和材料训练都从这里开始；先完成今日训练，再按需要专项加练。"
        image={trainingHero}
        position="42% 45%"
        action={
          <Link to="/today" className="secondary-button">
            回到今日
          </Link>
        }
      />

      <div className="training-content">
      <section className="ui-surface training-recommend">
        <div>
          <span className="eyebrow">Recommended</span>
          <h2>今日训练</h2>
          <p>
            预计 {minutes} 分钟，优先处理 {stats.dueTotal} 个到期复习和 {stats.weakWords} 个薄弱词。
          </p>
        </div>
        <div className="training-recommend-side">
          <div className="ui-figures" aria-label="今日训练摘要">
            <div className="ui-figure">
              <span>到期</span>
              <strong>{stats.dueTotal}</strong>
            </div>
            <div className="ui-figure">
              <span>错词</span>
              <strong>{stats.weakWords}</strong>
            </div>
            <div className="ui-figure">
              <span>今日已练</span>
              <strong>{stats.reviewedToday}</strong>
            </div>
          </div>
          <div className="training-recommend-actions">
            <Link to="/review" className="primary-button">
              开始今日训练
              <ArrowRight size={18} />
            </Link>
            <Link to="/spelling" className="secondary-button">
              <Volume2 size={17} />
              听音拼写
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="训练模式">
        <div className="ui-section-head">
          <div>
            <span className="eyebrow">Modes</span>
            <h2>训练方式</h2>
          </div>
        </div>
        <div className="ui-grid-2">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Link key={mode.title} to={mode.to} className="ui-row">
                <span className={`ui-icon ui-icon--${mode.tone}`}>
                  <Icon size={20} />
                </span>
                <div>
                  <span className="ui-row-title">{mode.title}</span>
                  <span className="ui-row-desc">{mode.description}</span>
                </div>
                <span className="ui-row-tail">
                  <span>{mode.meta}</span>
                  <ChevronRight size={16} className="ui-arrow" />
                </span>
              </Link>
            );
          })}
          {modes.length % 2 === 1 && <div className="ui-grid-filler" aria-hidden="true" />}
        </div>
      </section>

      <section aria-label="推荐节奏">
        <div className="ui-section-head">
          <div>
            <span className="eyebrow">Flow</span>
            <h2>推荐节奏</h2>
          </div>
        </div>
        <div className="ui-steps">
          {steps.map((step) => (
            <div className="ui-step" key={step.no}>
              <span className="ui-step-no" aria-hidden="true">{step.no}</span>
              <div>
                <span className="ui-step-title">{step.title}</span>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}
