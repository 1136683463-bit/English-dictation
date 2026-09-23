// @vitest-environment jsdom
/**
 * PF8 · 「依赖整个 data 的 memo」重算放大 —— 无关字段变更也全量重算
 *
 * 机制（AppContext.tsx:60-73 / :85-124）：
 *   `commitData(next)` → `dataRef.current = next` + `setDataState(next)`。
 *   每次 updateData 都产出**新的 data 对象引用**，于是页面里所有 `[data]` 依赖的
 *   useMemo 一律失效——即便这次改动与它们全无关系。
 *
 * 做法：把一个页面挂起来，然后用 `useAppData().updateData` 做两类变更：
 *   ① irrelevant：只改 `cards[0].note`（任何统计都不读）
 *   ② relevant  ：改 `grammarLessonsDone`（summarizeLessonProgress 读）
 * 用服务层插桩对照两者的重算规模。
 */
import { describe, expect, it, vi, beforeEach } from "vitest";

const calls: Record<string, number> = {};
const bump = (key: string) => {
  calls[key] = (calls[key] ?? 0) + 1;
};
const resetCalls = () => {
  for (const key of Object.keys(calls)) delete calls[key];
};

vi.mock("../../services/lessonService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/lessonService")>();
  return {
    ...actual,
    summarizeLessonProgress: (...args: Parameters<typeof actual.summarizeLessonProgress>) => {
      bump("summarizeLessonProgress");
      return actual.summarizeLessonProgress(...args);
    },
    backfillLessonCoreSentences: (...args: Parameters<typeof actual.backfillLessonCoreSentences>) => {
      bump("backfillLessonCoreSentences");
      return actual.backfillLessonCoreSentences(...args);
    },
    repairLessonCoreSentenceTranslations: (
      ...args: Parameters<typeof actual.repairLessonCoreSentenceTranslations>
    ) => {
      bump("repairLessonCoreSentenceTranslations");
      return actual.repairLessonCoreSentenceTranslations(...args);
    },
    repairDiaryCardTags: (...args: Parameters<typeof actual.repairDiaryCardTags>) => {
      bump("repairDiaryCardTags");
      return actual.repairDiaryCardTags(...args);
    },
    getLessonStageLock: (...args: Parameters<typeof actual.getLessonStageLock>) => {
      bump("getLessonStageLock");
      return actual.getLessonStageLock(...args);
    }
  };
});

vi.mock("../../services/grammarWeakSpotsService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/grammarWeakSpotsService")>();
  return {
    ...actual,
    computeWeakSpotsReport: (...args: Parameters<typeof actual.computeWeakSpotsReport>) => {
      bump("computeWeakSpotsReport");
      return actual.computeWeakSpotsReport(...args);
    },
    buildWeakSpotNarrative: (...args: Parameters<typeof actual.buildWeakSpotNarrative>) => {
      bump("buildWeakSpotNarrative");
      return actual.buildWeakSpotNarrative(...args);
    },
    findActiveIntervention: (...args: Parameters<typeof actual.findActiveIntervention>) => {
      bump("findActiveIntervention");
      return actual.findActiveIntervention(...args);
    }
  };
});

vi.mock("../../services/grammarTelemetry", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/grammarTelemetry")>();
  return {
    ...actual,
    listGrammarEvents: () => {
      bump("listGrammarEvents");
      return actual.listGrammarEvents();
    },
    listGrammarEventsByKind: (...args: Parameters<typeof actual.listGrammarEventsByKind>) => {
      bump("listGrammarEventsByKind");
      return actual.listGrammarEventsByKind(...args);
    }
  };
});

vi.mock("../../services/grammarReviewService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/grammarReviewService")>();
  return {
    ...actual,
    buildGrammarReviewSession: (...args: Parameters<typeof actual.buildGrammarReviewSession>) => {
      bump("buildGrammarReviewSession");
      return actual.buildGrammarReviewSession(...args);
    }
  };
});

vi.mock("../../services/grammarReplayService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/grammarReplayService")>();
  return {
    ...actual,
    buildReplayLesson: (...args: Parameters<typeof actual.buildReplayLesson>) => {
      bump("buildReplayLesson");
      return actual.buildReplayLesson(...args);
    }
  };
});

vi.mock("../../services/grammarOutputService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/grammarOutputService")>();
  return {
    ...actual,
    buildLastWeekReport: (...args: Parameters<typeof actual.buildLastWeekReport>) => {
      bump("buildLastWeekReport");
      return actual.buildLastWeekReport(...args);
    }
  };
});

vi.mock("../../services/huntService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/huntService")>();
  return {
    ...actual,
    listHuntCasesWithLock: (...args: Parameters<typeof actual.listHuntCasesWithLock>) => {
      bump("listHuntCasesWithLock（O(案×课)）");
      return actual.listHuntCasesWithLock(...args);
    },
    summarizeHuntProgress: (...args: Parameters<typeof actual.summarizeHuntProgress>) => {
      bump("summarizeHuntProgress（O(案×案)）");
      return actual.summarizeHuntProgress(...args);
    }
  };
});

import { act } from "react";
import { mountPage, resetStorage } from "../harness";
import { clickElement, flushAsync } from "./drive";
import { seedAppData, cardsToData, makeSentenceCard, PAST_ISO, readAppData } from "./fixtures";
import { useAppData } from "../../AppContext";
import GrammarPathPage from "../../pages/GrammarPathPage";
import GrammarHuntPage from "../../pages/GrammarHuntPage";
import { grammarLessons } from "../../data/grammarLessons";
import { huntCases } from "../../data/huntCases";

const settle = async (): Promise<void> => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

const TELEMETRY_KEY = "grammar-telemetry-events-v1";

/** 造一份「有弱点数据」的遥测：hunt_verdict 的 wrongTag 事件会被 computeWeakSpotsReport 计入。 */
const seedTelemetryWithWeakSpots = (count = 600) => {
  const events = Array.from({ length: count }, (_, index) => ({
    kind: "hunt_verdict",
    caseId: huntCases[index % huntCases.length].id,
    tokenIndex: 0,
    verdictKind: "wrongTag",
    guessedTag: "sv_agreement",
    ts: new Date(Date.now() - (index % 100) * 3_600_000).toISOString()
  }));
  window.localStorage.setItem(TELEMETRY_KEY, JSON.stringify({ version: 1, events }));
};

const seedAll = () => {
  const fixtures = Array.from({ length: 200 }, (_, index) =>
    makeSentenceCard({
      id: `card-${index}`,
      sentence: `I am learning sentence number ${index}.`,
      tags: ["语法"],
      schedule: { nextReviewAt: PAST_ISO, reviewCount: index % 4 }
    })
  );
  seedTelemetryWithWeakSpots();
  return seedAppData({
    grammarLessonsDone: grammarLessons.slice(0, 120).map((lesson) => lesson.id),
    ...cardsToData(fixtures)
  });
};

/**
 * 触发一次指定类型的 updateData。
 * 通过一个挂进 Provider 内部的小组件暴露，避免跨 Provider 直接改 state。
 */
const makeUpdater = (kind: "irrelevant" | "relevant") => {
  const holder: { run: (() => void) | null } = { run: null };
  const Probe = () => {
    const { updateData } = useAppData();
    holder.run = () => {
      if (kind === "irrelevant") {
        updateData((latest) => ({
          ...latest,
          cards: latest.cards.map((card, index) => (index === 0 ? { ...card, note: `perf-probe-${Date.now()}` } : card))
        }));
      } else {
        updateData((latest) => ({
          ...latest,
          grammarLessonsDone: latest.grammarLessonsDone.slice(0, 121)
        }));
      }
    };
    return null;
  };
  return { Probe, holder };
};

/** 把页面 + 探针一起挂进 mountPage 的 Provider/Router 里。 */
const mountWithProbe = async (element: React.ReactElement, kind: "irrelevant" | "relevant") => {
  const { Probe, holder } = makeUpdater(kind);
  // mountPage 只接受单个 element：用 wrapper 把探针和页面并排放进一个 fragment
  const page = mountPage(
    <>
      <Probe />
      {element}
    </>,
    "/grammar",
    "/grammar"
  );
  await settle();
  return { page, holder };
};

describe("PF8 · 依赖整个 data 的 memo 重算放大", () => {
  beforeEach(() => {
    resetStorage();
    resetCalls();
  });

  it("语法地图挂载：一遍渲染的服务层调用清单", async () => {
    seedAll();
    resetCalls();
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    await settle();
    const first = { ...calls };
    console.log("【语法地图首次渲染（含回填 updateData 引发的一轮）】");
    let sum = 0;
    for (const [key, value] of Object.entries(first).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${key}: ${value}`);
      sum += value;
    }
    console.log(`  合计 ${sum} 次服务层调用`);
    console.log(
      `  注意 listGrammarEventsByKind = ${first.listGrammarEventsByKind} 次 vs listGrammarEvents = ${first.listGrammarEvents} 次：`
    );
    console.log("    → 前者每次内部都调一次后者，而 listGrammarEvents 每次都 JSON.parse 整个遥测 blob（grammarTelemetry.ts:621 readEvents，无缓存）");
    page.unmount();
    expect(first.listGrammarEvents).toBeGreaterThan(0);
  });

  it("对照：只改 card.note（统计不关心）vs 改 grammarLessonsDone（统计关心）", async () => {
    const results: Record<string, Record<string, number>> = {};

    for (const kind of ["irrelevant", "relevant"] as const) {
      resetStorage();
      resetCalls();
      seedAll();
      const { Probe } = makeUpdater(kind);
      const page = mountPage(
        <>
          <Probe />
          <GrammarPathPage />
        </>,
        "/grammar",
        "/grammar"
      );
      await settle();
      // 只计量「进入稳定后的一次 updateData」
      const { holder } = { holder: null as null | { run: (() => void) | null } };
      void holder;
      page.unmount();
      await settle();
      // 重新挂载，这次在 updateData 前后清零
      const fresh = makeUpdater(kind);
      resetStorage();
      seedAll();
      const page2 = mountPage(
        <>
          <fresh.Probe />
          <GrammarPathPage />
        </>,
        "/grammar",
        "/grammar"
      );
      await settle();
      resetCalls();
      act(() => {
        fresh.holder.run?.();
      });
      await settle();
      results[kind] = { ...calls };
      page2.unmount();
    }

    console.log("【对照：一次 data 变更引发的重算规模】");
    console.log("  ① 只改 cards[0].note（任何统计都不读该字段）:");
    for (const [key, value] of Object.entries(results.irrelevant).sort((a, b) => b[1] - a[1])) {
      console.log(`      ${key}: ${value}`);
    }
    console.log("  ② 改 grammarLessonsDone（summarizeLessonProgress 真正关心）:");
    for (const [key, value] of Object.entries(results.relevant).sort((a, b) => b[1] - a[1])) {
      console.log(`      ${key}: ${value}`);
    }
    const irr = Object.values(results.irrelevant).reduce((s, v) => s + v, 0);
    const rel = Object.values(results.relevant).reduce((s, v) => s + v, 0);
    console.log(`  合计：无关变更 ${irr} 次调用，关心变更 ${rel} 次调用 → 比值 ${(irr / Math.max(1, rel)).toFixed(2)}`);
    page_unmount_all();
    expect(true).toBe(true);
  });

  it("侦探页：答一次题触发的两个 O(案×N) 全库扫描", async () => {
    seedAll();
    resetCalls();
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt");
    await settle();
    console.log("【侦探页挂载】", JSON.stringify(calls));

    const caseCard = page.container.querySelector(".hunt-case-card:not([disabled])") as HTMLButtonElement | null;
    clickElement(caseCard);
    await settle();
    const token = page.container.querySelector(".hunt-token") as HTMLElement | null;
    clickElement(token);
    await settle();
    const tag = page.container.querySelector(".hunt-tag-btn") as HTMLButtonElement | null;
    resetCalls();
    clickElement(tag);
    await settle();
    console.log("【侦探页答一次（选罪名）】", JSON.stringify(calls));
    console.log(
      "  源码：huntService.ts:99 listHuntCasesWithLock → :105 huntCases.map(...) 内 :80 findUnlockLesson 逐案 grammarLessons.find ⇒ O(206 案 × 197 课)"
    );
    console.log(
      "  源码：huntService.ts:427 summarizeHuntProgress → :429 每案对 huntResults.some ⇒ O(206 案 × 结果数)"
    );
    page.unmount();
    expect(true).toBe(true);
  });

  it("重复计算：buildWeakSpotNarrative 内部再算一遍 computeWeakSpotsReport", async () => {
    seedAll();
    const weakSpots = await import("../../services/grammarWeakSpotsService");
    const data = readAppData();
    const bench = (label: string, fn: () => unknown, n = 5) => {
      fn();
      const t = performance.now();
      for (let i = 0; i < n; i += 1) fn();
      const ms = (performance.now() - t) / n;
      console.log(`  ⏱ ${label}: ${ms.toFixed(2)}ms（jsdom，${n} 次均值）`);
      return ms;
    };
    console.log("【同一次渲染内的重复计算】grammarWeakSpotsService.ts:134 buildWeakSpotNarrative 第一行就是 computeWeakSpotsReport(data, now)");
    const report = bench("computeWeakSpotsReport", () => weakSpots.computeWeakSpotsReport(data));
    const narrative = bench("buildWeakSpotNarrative", () => weakSpots.buildWeakSpotNarrative(data));
    console.log(
      `  → 语法地图同时有 memo computeWeakSpotsReport(:637) 与 memo buildWeakSpotNarrative(:639)；后者内部又算一遍 ⇒ 每次 data 变化算 2 遍弱点报告`
    );
    console.log(`  未受益于 memo 的重复部分 ≈ ${report.toFixed(2)}ms（jsdom）`);
    expect(narrative).toBeGreaterThan(0);
  });
});

/** 收尾：清掉本文件创建的所有挂载点，避免用例间 DOM 串场。 */
const page_unmount_all = () => {
  document.body.innerHTML = "";
};
