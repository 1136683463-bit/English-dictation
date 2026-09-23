import { ArrowRight, BookOpen, Clock3, Keyboard, Languages, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import BrandMark from "../components/BrandMark";
import { useAppData } from "../AppContext";
import { getDueCards } from "../services/reviewService";

export default function EntryPage() {
  const { data } = useAppData();
  const totalCards = data.cards.length;
  /**
   * 「今日到期」必须走**权威口径** `getDueCards`（2026-09-24 批七十修）。
   *
   * 原实现是就地数排期：`data.schedules.filter(nextReviewAt <= now).length`。
   * 它与 `getDueCards` **在三种卡状态上不一致**（实测）：
   *
   * | status | 排期已过时 | 原实现 | getDueCards |
   * |---|---|---|---|
   * | `new` | 是 | **算 1** | 0（新卡走每日新卡队列，见 reviewService:107-109）|
   * | `mastered` | 是 | **算 1** | 0 |
   * | `suspended` | 是 | **算 1** | 0 |
   *
   * 后果是**用户可见的自相矛盾**：用户真实数据（115 张卡全是 `new`）下，
   * 首页显示「今日到期 **115**」，点进今日页却显示「到期复习 **0**」。
   * 对一个刚导入词卡的用户，这是「数字明显不对」的第一印象。
   *
   * ⇒ 与今日页/统计页统一读同一套服务，三处不许各算一份。
   */
  const dueCards = getDueCards(data).length;

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
