import { ArrowRight, BookOpen, Keyboard, Languages, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";

export default function EntryPage() {
  const { data } = useAppData();
  const totalCards = data.cards.length;
  const dueCards = data.schedules.filter((schedule) => new Date(schedule.nextReviewAt) <= new Date()).length;

  return (
    <div className="entry-page">
      <div className="entry-shell">
        <div className="entry-brand">
          <div className="brand-icon large">
            <Sparkles size={24} />
          </div>
          <div>
            <span className="eyebrow">Open</span>
            <h1>听写工坊</h1>
            <p>个人背单词和句子的入口页，先进去，再开始今天的复习。</p>
          </div>
        </div>

        <div className="entry-stats">
          <div>
            <span>卡片总数</span>
            <strong>{totalCards}</strong>
          </div>
          <div>
            <span>今日到期</span>
            <strong>{dueCards}</strong>
          </div>
        </div>

        <div className="entry-actions">
          <Link to="/today" className="primary-button entry-primary">
            打开学习入口
            <ArrowRight size={18} />
          </Link>
          <Link to="/review" className="secondary-button">
            <Languages size={17} />
            直接复习
          </Link>
          <Link to="/spelling" className="secondary-button">
            <Keyboard size={17} />
            拼写模式
          </Link>
          <Link to="/words" className="secondary-button">
            <BookOpen size={17} />
            去单词本
          </Link>
        </div>
      </div>
    </div>
  );
}
