// @vitest-environment jsdom
/**
 * PF2f · 页面级计数：真实挂载时，全库扫描类函数各被调用几次（2026-09-22）
 *
 * PF2e 是按源码读出的调用点清单；本文件用 vi.mock 插桩 + 真实挂载 **证实**它：
 * 每一次渲染里那些「无 memo 的全库函数」到底被调了几次、累计多少毫秒。
 *
 * 规模：5000 卡 / 5000 复习（≈ 1.5 MiB 数据，接近真实重度用户）。
 * 判据：JS 侧计数（确定），耗时仅作量级参考（jsdom + CI 机器抖动）。
 */
import { describe, expect, it, vi, beforeEach } from "vitest";

const calls: Record<string, number> = {};
const bump = (key: string) => {
  calls[key] = (calls[key] ?? 0) + 1;
};
const resetCalls = () => {
  for (const key of Object.keys(calls)) delete calls[key];
};

vi.mock("../../services/reviewService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/reviewService")>();
  return {
    ...actual,
    getLearningStats: (...args: Parameters<typeof actual.getLearningStats>) => {
      bump("getLearningStats");
      return actual.getLearningStats(...args);
    },
    getWeakCards: (...args: Parameters<typeof actual.getWeakCards>) => {
      bump("getWeakCards");
      return actual.getWeakCards(...args);
    },
    getWeakCardInsights: (...args: Parameters<typeof actual.getWeakCardInsights>) => {
      bump("getWeakCardInsights");
      return actual.getWeakCardInsights(...args);
    },
    getWeakStats: (...args: Parameters<typeof actual.getWeakStats>) => {
      bump("getWeakStats");
      return actual.getWeakStats(...args);
    },
    getDueCards: (...args: Parameters<typeof actual.getDueCards>) => {
      bump("getDueCards");
      return actual.getDueCards(...args);
    },
    getNewCardsForToday: (...args: Parameters<typeof actual.getNewCardsForToday>) => {
      bump("getNewCardsForToday");
      return actual.getNewCardsForToday(...args);
    }
  };
});

vi.mock("../../services/statsService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/statsService")>();
  return {
    ...actual,
    computeStreak: (...args: Parameters<typeof actual.computeStreak>) => {
      bump("computeStreak");
      return actual.computeStreak(...args);
    },
    computeStreakWithGrace: (...args: Parameters<typeof actual.computeStreakWithGrace>) => {
      bump("computeStreakWithGrace");
      return actual.computeStreakWithGrace(...args);
    },
    getWeeklyStatsReport: (...args: Parameters<typeof actual.getWeeklyStatsReport>) => {
      bump("getWeeklyStatsReport");
      return actual.getWeeklyStatsReport(...args);
    },
    getDueForecast: (...args: Parameters<typeof actual.getDueForecast>) => {
      bump("getDueForecast");
      return actual.getDueForecast(...args);
    }
  };
});

vi.mock("../../services/unitService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/unitService")>();
  return {
    ...actual,
    getUnitStats: (...args: Parameters<typeof actual.getUnitStats>) => {
      bump("getUnitStats");
      return actual.getUnitStats(...args);
    },
    getVocabularyGoalStats: (...args: Parameters<typeof actual.getVocabularyGoalStats>) => {
      bump("getVocabularyGoalStats");
      return actual.getVocabularyGoalStats(...args);
    }
  };
});

vi.mock("../../services/dailyDirectiveService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/dailyDirectiveService")>();
  return {
    ...actual,
    buildDailyDirective: (...args: Parameters<typeof actual.buildDailyDirective>) => {
      bump("buildDailyDirective");
      return actual.buildDailyDirective(...args);
    },
    getDeadUnits: (...args: Parameters<typeof actual.getDeadUnits>) => {
      bump("getDeadUnits");
      return actual.getDeadUnits(...args);
    }
  };
});

vi.mock("../../services/mistakeBookService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/mistakeBookService")>();
  return {
    ...actual,
    getMistakeGroupsByDate: (...args: Parameters<typeof actual.getMistakeGroupsByDate>) => {
      bump("getMistakeGroupsByDate");
      return actual.getMistakeGroupsByDate(...args);
    }
  };
});

import { act } from "react";
import { mountPage, resetStorage } from "../harness";
import { seedAppData } from "./fixtures";
import { scaleData } from "./pf2Scale";
import ReviewPage from "../../pages/ReviewPage";
import StatsPage from "../../pages/StatsPage";
import TodayPage from "../../pages/TodayPage";
import UnitsPage from "../../pages/UnitsPage";
import MistakeBookPage from "../../pages/MistakeBookPage";

/**
 * jsdom 缺这两个浏览器 API，而有页面在 useState 初值 / useLayoutEffect 里就用它们
 * （StatsPage.tsx:144 matchMedia、MistakeBookPage.tsx:383 ResizeObserver）。
 * 本文件自补，不改 `src/edge/harness.tsx`（那是共享基建，改动可能影响既有套件）。
 */
if (typeof window !== "undefined") {
  if (typeof window.matchMedia !== "function") {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false
    })) as unknown as typeof window.matchMedia;
  }
  if (typeof (globalThis as { ResizeObserver?: unknown }).ResizeObserver !== "function") {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
}

const SCALE = { cards: 5000, unitCount: 20, reviewsPerCard: 1, wrongRatio: 0.4 };

const settle = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

const dump = (label: string, startedAt: number) => {
  const ms = performance.now() - startedAt;
  console.log(
    `\n[PF2f] ${label}（${SCALE.cards} 卡）挂载+落定耗时 ${ms.toFixed(0)}ms\n` +
      Object.entries(calls)
        .sort((a, b) => b[1] - a[1])
        .map(([key, value]) => `  ${String(value).padStart(4)} × ${key}`)
        .join("\n")
  );
};

describe("PF2f · 页面级调用计数（5000 卡）", () => {
  beforeEach(() => {
    resetStorage();
    resetCalls();
  });

  it("TodayPage：布局 streak + 页面 streak 各一次，getLearningStats 与 getUnitStats 的调用量", async () => {
    const data = scaleData(SCALE);
    seedAppData(data);
    resetCalls();
    const started = performance.now();
    const page = mountPage(<TodayPage />, "/today", "/today");
    await settle();
    dump("TodayPage", started);
    page.unmount();
    // TodayPage.tsx:72 与 App.tsx:102 是同一次渲染里的两次 computeStreak
    expect(calls.getLearningStats ?? 0).toBeGreaterThanOrEqual(1);
    expect(calls.getUnitStats ?? 0, "TodayPage 对每本词书各调一次 getUnitStats").toBeGreaterThan(1);
  });

  it("StatsPage：weekly / forecast / streak 无 memo → 单次挂载各几次", async () => {
    const data = scaleData(SCALE);
    seedAppData(data);
    resetCalls();
    const started = performance.now();
    const page = mountPage(<StatsPage />, "/stats", "/stats");
    await settle();
    dump("StatsPage", started);
    page.unmount();
    expect(calls.getWeeklyStatsReport ?? 0).toBeGreaterThanOrEqual(1);
    // StatsPage 内 computeStreakWithGrace 有 2 个调用点（:132 埋点 + :211 视图）
    expect(calls.computeStreakWithGrace ?? 0, "同一页面内两个调用点").toBeGreaterThanOrEqual(2);
  });

  it("ReviewPage：getWeakCardInsights / getWeakStats 的重复计算", async () => {
    const data = scaleData(SCALE);
    seedAppData(data);
    resetCalls();
    const started = performance.now();
    const page = mountPage(<ReviewPage />, "/review", "/review");
    await settle();
    dump("ReviewPage", started);
    page.unmount();
    /**
     * ⚠️ 计数口径说明：`vi.mock` 只能拦截**跨模块导入**的调用。
     * reviewService 内部 `getWeakStats` 调同模块的 `getWeakCardInsights`（:365）走的是
     * 模块内绑定，**不会**经过 mock 的命名空间对象，因此这里的计数只反映页面直接发起的调用。
     * 「getWeakStats 内部再算一遍」这一条由 PF2e 的静态读取 + 单函数耗时给出，不在此断言。
     */
    expect(calls.getWeakCardInsights ?? 0, "页面直接调用").toBeGreaterThanOrEqual(1);
    expect(calls.getWeakStats ?? 0, "ReviewPage.tsx:115 另一条同源口径").toBeGreaterThanOrEqual(1);
    console.log(
      `\n[PF2f] ReviewPage 事实：getWeakCardInsights(直接) ${calls.getWeakCardInsights ?? 0} 次、` +
        `getWeakStats ${calls.getWeakStats ?? 0} 次、getLearningStats ${calls.getLearningStats ?? 0} 次\n` +
        `  （getWeakStats 内部还会各调一次 getWeakCardInsights(limit=全部卡) 与 getWeakCards —— 模块内调用，\n` +
        `    见 reviewService.ts:365/368；成本见 PF2e 候选 4）`
    );
  });

  it("UnitsPage：buildDailyDirective 与逐本 getUnitStats 的调用量", async () => {
    const data = scaleData(SCALE);
    seedAppData(data);
    resetCalls();
    const started = performance.now();
    const page = mountPage(<UnitsPage />, "/units", "/units");
    await settle();
    dump("UnitsPage", started);
    page.unmount();
    expect(calls.buildDailyDirective ?? 0).toBeGreaterThanOrEqual(1);
    expect(calls.getUnitStats ?? 0, "网格里每本词书一次").toBeGreaterThan(1);
    console.log(
      `\n[PF2f] UnitsPage 事实：buildDailyDirective ${calls.buildDailyDirective ?? 0} 次、` +
        `getUnitStats ${calls.getUnitStats ?? 0} 次、getVocabularyGoalStats ${calls.getVocabularyGoalStats ?? 0} 次、` +
        `getDeadUnits ${calls.getDeadUnits ?? 0} 次`
    );
  });

  it("MistakeBookPage：getMistakeGroupsByDate 是否被页面与选择逻辑各算一次", async () => {
    const data = scaleData(SCALE);
    seedAppData(data);
    resetCalls();
    const started = performance.now();
    const page = mountPage(<MistakeBookPage />, "/mistakes", "/mistakes");
    await settle();
    dump("MistakeBookPage", started);
    page.unmount();
    expect(calls.getMistakeGroupsByDate ?? 0).toBeGreaterThanOrEqual(1);
  });
});
