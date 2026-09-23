// @vitest-environment jsdom
/**
 * SV2 · 归档把「配额墙」推迟到什么时候（2026-09-22）
 *
 * LG1 测出：不治理的话，约 **14~18 个月**撞 localStorage 的 5MB 上限。
 * 这个文件量化归档能把它推多远——这是决定「值不值得做这个功能」的关键数字。
 *
 * 实测（每天 20 分钟模型）：
 *   18 个月 4.03MB → 归档后 2.90MB ✅
 *   24 个月 5.38MB → 归档后 3.68MB ✅   ← 不归档时这里已经写不下
 *   30 个月 6.74MB → 归档后 4.46MB ✅   ← 不归档时远超上限
 *   36 个月 8.10MB → 归档后 5.25MB ❌
 *
 * 即：**墙从 14~18 个月推到约 30 个月（2.5 年）。**
 */
import { beforeEach, describe, expect, it } from "vitest";
import { resetStorage } from "../harness";
import { compactReviewHistory } from "../../services/reviewArchiveService";
import { makeAppData } from "./fixtures";

/** 造 months 个月的完整数据（与 LG1 的一年模型同构）。 */
const monthsOfData = (months: number) => {
  const days = months * 30;
  const cardCount = days * 14;
  return makeAppData({
    cards: Array.from({ length: cardCount }, (_, i) => ({
      id: `c${i}`, type: "word" as const, front: `w${i}`, back: "释义", note: "", tags: [],
      status: "review" as const, priority: false,
      createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z"
    })),
    schedules: Array.from({ length: cardCount }, (_, i) => ({
      cardId: `c${i}`, easeFactor: 2.5, intervalDays: 3, reviewCount: 3, lapseCount: 0,
      nextReviewAt: "2024-01-01T00:00:00.000Z"
    })),
    reviews: Array.from({ length: days * 30 }, (_, i) => ({
      id: `r${i}`, cardId: `c${i % cardCount}`, mode: "spelling" as const, rating: 3 as const,
      answer: "x",
      reviewedAt: new Date(Date.now() - Math.floor(i / 30) * 86400000).toISOString()
    }))
  });
};

/** 能否把数据写进 localStorage（真实配额判断，不靠估算）。 */
const canPersist = (payload: string): boolean => {
  try {
    window.localStorage.setItem("sv2-probe", payload);
    window.localStorage.removeItem("sv2-probe");
    return true;
  } catch {
    return false;
  }
};

describe("SV2 归档对配额墙的推迟效果", () => {
  beforeEach(() => resetStorage());

  it("★ 24 个月的数据：不归档写不下，归档后能写（这就是功能的价值）", () => {
    const data = monthsOfData(24);
    const raw = JSON.stringify(data);
    const compacted = JSON.stringify(compactReviewHistory(data).data);

    expect(canPersist(raw), "前置：24 个月原始数据应已超出上限").toBe(false);
    expect(canPersist(compacted), "归档后应能写下（墙被推后）").toBe(true);
  }, 300_000);

  it("★ 30 个月的数据：归档后仍能写（墙推到约 2.5 年）", () => {
    const data = monthsOfData(30);
    const compacted = JSON.stringify(compactReviewHistory(data).data);
    expect(canPersist(compacted), "归档后 30 个月仍应可写").toBe(true);
  }, 300_000);

  it("归档释放的比例稳定在 30% 上下（与使用时长无关，因为窗口是固定的）", () => {
    for (const months of [18, 24]) {
      resetStorage();
      const data = monthsOfData(months);
      const before = JSON.stringify(data).length;
      const after = JSON.stringify(compactReviewHistory(data).data).length;
      const ratio = 1 - after / before;
      expect(ratio, `${months} 个月：释放 ${(ratio * 100).toFixed(0)}%`).toBeGreaterThan(0.2);
      expect(ratio, `${months} 个月：释放比例不应异常高（说明窗口内明细被误删）`).toBeLessThan(0.45);
    }
  }, 300_000);
});
