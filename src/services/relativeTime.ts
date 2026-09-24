/**
 * 相对时间格式化（2026-09-24 从 `AdventurePage` 提取为共享函数）。
 *
 * 为什么提取：冒险页、首页三线状态行、首页主推荐的「为什么是它」说明行都要用它。
 * 提之前它只活在 `AdventurePage` 里，首页要用就得再写一份——
 * 而本仓库已经吃过「同一语义散落多份实现、给出不同结论」的亏（见 `rv19` 前车之鉴与
 * `IMPLEMENTATION_NOTES.md` 里「推广『权威实现 vs 散落简化版』排查」一节）。
 *
 * `now` 可注入，便于测试与守门断言「2 天前」这类文案而不依赖真实时钟。
 */
export const formatRelativeTime = (value: string | null | undefined, now: number = Date.now()): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "刚刚";
  const diffDays = Math.floor((now - date.getTime()) / 86_400_000);
  if (diffDays <= 0) {
    const time = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit" }).format(date);
    return `今天 ${time}`;
  }
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays} 天前`;
  if (diffDays < 14) return "上周";
  return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(date);
};
