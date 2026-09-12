import { ArrowRight, BookOpen, Clock3, Keyboard, Languages, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import BrandMark from "../components/BrandMark";
import { useAppData } from "../AppContext";

export default function EntryPage() {
  const { data } = useAppData();
  const totalCards = data.cards.length;
  const dueCards = data.schedules.filter((schedule) => new Date(schedule.nextReviewAt) <= new Date()).length;

  return (
    <div className="entry-page">
      <div className="entry-shell">
        <div className="entry-brand">
          <BrandMark size={48} />
          <div>
            <h1>听写工坊</h1>
            <p>个人单词与句子训练工作台，先进训练台清完今日到期，再推进新词。</p>
          </div>
        </div>

        <div className="entry-stats">
          <div>
            <span className="entry-stat-icon" aria-hidden="true">
              <Layers size={17} />
            </span>
            <span>卡片总数</span>
            <strong>{totalCards}</strong>
          </div>
          <div className={dueCards > 0 ? "due-today" : undefined}>
            <span className="entry-stat-icon" aria-hidden="true">
              <Clock3 size={17} />
            </span>
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
