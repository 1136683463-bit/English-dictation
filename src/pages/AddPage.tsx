import { ArrowRight, BookOpen, FilePlus, Import, Languages, Plus, Rows3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import PageHeader from "../components/PageHeader";
import { getLearningStats } from "../services/reviewService";

export default function AddPage() {
  const { data } = useAppData();
  const stats = getLearningStats(data);
  const wordCount = data.cards.filter((card) => card.type === "word").length;
  const sentenceCount = data.cards.filter((card) => card.type === "sentence").length;

  const actions = [
    {
      title: "快速加词",
      description: "输入一个单词，自动补全释义、音标、搭配和发音。",
      meta: `${wordCount} 个单词`,
      to: "/words",
      icon: Languages,
      tone: "blue"
    },
    {
      title: "快速加句",
      description: "收藏值得背的表达，后续用回译、挖空和听写反复训练。",
      meta: `${sentenceCount} 个句子`,
      to: "/sentences",
      icon: BookOpen,
      tone: "green"
    },
    {
      title: "导入材料",
      description: "粘贴文章或转写稿，先拆句，再挑真正值得长期复习的词句。",
      meta: `${data.materials.length} 份材料`,
      to: "/import",
      icon: Import,
      tone: "teal"
    },
    {
      title: "批量导入单词",
      description: "粘贴文本或 CSV，一次导入、合并、跳过重复项。",
      meta: `${stats.availableNewWords} 个新词待练`,
      to: "/import",
      icon: Rows3,
      tone: "neutral"
    }
  ];

  return (
    <div className="page add-page">
      <PageHeader
        eyebrow="Add"
        title="把今天遇到的材料放进来"
        description="先收集，再筛选，最后进入训练；避免把词库变成没有复习出口的收藏夹。"
      />

      <section className="hub-hero">
        <div>
          <span className="eyebrow">Capture Loop</span>
          <h2>材料进来，训练出去</h2>
          <p>新增内容应该尽快变成可复习的单词、句子或听写材料。</p>
        </div>
        <Link to="/import" className="primary-button">
          导入一段材料
          <FilePlus size={17} />
        </Link>
      </section>

      <section className="hub-grid" aria-label="添加入口">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} to={action.to} className={`hub-card ${action.tone}`}>
              <span className="hub-card-icon">
                <Icon size={20} />
              </span>
              <div>
                <strong>{action.title}</strong>
                <p>{action.description}</p>
              </div>
              <em>{action.meta}</em>
              <ArrowRight size={17} />
            </Link>
          );
        })}
      </section>

      <section className="panel add-flow-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Suggested Flow</span>
            <h2>建议的添加顺序</h2>
          </div>
          <Plus size={20} />
        </div>
        <div className="process-steps">
          <div><strong>1</strong><span>导入材料</span></div>
          <div><strong>2</strong><span>挑词和句子</span></div>
          <div><strong>3</strong><span>加入今日训练</span></div>
          <div><strong>4</strong><span>错题自动回流</span></div>
        </div>
      </section>
    </div>
  );
}
