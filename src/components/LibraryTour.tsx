import { useEffect, useState } from "react";
import { Search, Filter, MousePointerClick, X } from "lucide-react";

/**
 * 词库页首次进入的轻量功能导览。
 * 只显示一次（localStorage 标记），主任务（搜索/筛选/查看）三步完成。
 * 与全局 OnboardingGuide 独立：那个是"设置语音/目标/备份"，这个是"词库怎么用"。
 */

const LIBRARY_TOUR_FLAG_KEY = "library-tour-done-v1";

export const shouldShowLibraryTour = (): boolean => {
  try {
    return !window.localStorage.getItem(LIBRARY_TOUR_FLAG_KEY);
  } catch {
    return false;
  }
};

export const markLibraryTourDone = (): void => {
  try {
    window.localStorage.setItem(LIBRARY_TOUR_FLAG_KEY, new Date().toISOString());
  } catch {
    // 存储不可用时静默
  }
};

interface LibraryTourProps {
  /** 是否有数据：有数据才显示导览；空库已有空状态引导 */
  hasData: boolean;
}

export default function LibraryTour({ hasData }: LibraryTourProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 延迟一帧，等首屏渲染稳定再判断是否显示，避免闪烁
    if (!hasData) return;
    if (!shouldShowLibraryTour()) return;
    const timer = window.setTimeout(() => setVisible(true), 300);
    return () => window.clearTimeout(timer);
  }, [hasData]);

  if (!visible) return null;

  const finish = () => {
    markLibraryTourDone();
    setVisible(false);
  };

  return (
    <div className="library-tour" role="dialog" aria-modal="false" aria-label="词库功能导览">
      <button
        type="button"
        className="library-tour-close"
        aria-label="关闭导览"
        onClick={finish}
      >
        <X size={14} />
      </button>
      <strong>词库三步用法</strong>
      <ol>
        <li>
          <Search size={15} aria-hidden="true" />
          <div>
            <strong>搜索</strong>
            <span>按 <kbd>/</kbd> 快速聚焦搜索框，输入单词或标签</span>
          </div>
        </li>
        <li>
          <Filter size={15} aria-hidden="true" />
          <div>
            <strong>筛选</strong>
            <span>类型 + 状态两行 chip 组合，找到目标卡片</span>
          </div>
        </li>
        <li>
          <MousePointerClick size={15} aria-hidden="true" />
          <div>
            <strong>查看</strong>
            <span>点卡片看详情；↑↓ 键在列表内移动</span>
          </div>
        </li>
      </ol>
      <button type="button" className="primary-button library-tour-done" onClick={finish}>
        知道了
      </button>
    </div>
  );
}
