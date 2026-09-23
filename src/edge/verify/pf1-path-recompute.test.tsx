// @vitest-environment jsdom
/**
 * PF1 · 语法地图页（GrammarPathPage）重复计算计数
 *
 * 目的：量化「依赖整个 data 的 memo」在一次渲染里各被调用几次、每次多贵。
 * 方法：用 vi.mock 包住服务模块，给被测函数插桩计数（不改产品代码）。
 *
 * 判据（按任务要求）：只做相对比较与数量级判断，绝对毫秒数仅标注为 jsdom 观测值。
 */
import { describe, expect, it, vi, beforeEach } from "vitest";

const calls = {
  summarizeLessonProgress: 0,
  computeWeakSpotsReport: 0,
  computeWeakSpots: 0,
  buildWeakSpotNarrative: 0,
  findActiveIntervention: 0,
  buildGrammarReviewSession: 0,
  buildReplayLesson: 0,
  buildGrammarReviewSessionLimit: 0,
  listGrammarEventsByKind: 0,
  getGrammarTelemetryStats: 0,
  buildLastWeekReport: 0,
  listGrammarEvents: 0,
  getLessonStageLock: 0,
  listGrammarLessons: 0
};

vi.mock("../../services/lessonService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/lessonService")>();
  return {
    ...actual,
    listGrammarLessons: () => {
      calls.listGrammarLessons += 1;
      return actual.listGrammarLessons();
    },
    summarizeLessonProgress: (...args: Parameters<typeof actual.summarizeLessonProgress>) => {
      calls.summarizeLessonProgress += 1;
      return actual.summarizeLessonProgress(...args);
    },
    getLessonStageLock: (...args: Parameters<typeof actual.getLessonStageLock>) => {
      calls.getLessonStageLock += 1;
      return actual.getLessonStageLock(...args);
    }
  };
});

vi.mock("../../services/grammarWeakSpotsService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/grammarWeakSpotsService")>();
  return {
    ...actual,
    computeWeakSpots: (...args: Parameters<typeof actual.computeWeakSpots>) => {
      calls.computeWeakSpots += 1;
      return actual.computeWeakSpots(...args);
    },
    computeWeakSpotsReport: (...args: Parameters<typeof actual.computeWeakSpotsReport>) => {
      calls.computeWeakSpotsReport += 1;
      return actual.computeWeakSpotsReport(...args);
    },
    buildWeakSpotNarrative: (...args: Parameters<typeof actual.buildWeakSpotNarrative>) => {
      calls.buildWeakSpotNarrative += 1;
      return actual.buildWeakSpotNarrative(...args);
    },
    findActiveIntervention: (...args: Parameters<typeof actual.findActiveIntervention>) => {
      calls.findActiveIntervention += 1;
      return actual.findActiveIntervention(...args);
    }
  };
});

vi.mock("../../services/grammarReviewService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/grammarReviewService")>();
  return {
    ...actual,
    buildGrammarReviewSession: (...args: Parameters<typeof actual.buildGrammarReviewSession>) => {
      calls.buildGrammarReviewSession += 1;
      return actual.buildGrammarReviewSession(...args);
    }
  };
});

vi.mock("../../services/grammarReplayService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/grammarReplayService")>();
  return {
    ...actual,
    buildReplayLesson: (...args: Parameters<typeof actual.buildReplayLesson>) => {
      calls.buildReplayLesson += 1;
      return actual.buildReplayLesson(...args);
    }
  };
});

vi.mock("../../services/grammarTelemetry", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/grammarTelemetry")>();
  return {
    ...actual,
    listGrammarEvents: () => {
      calls.listGrammarEvents += 1;
      return actual.listGrammarEvents();
    },
    listGrammarEventsByKind: (...args: Parameters<typeof actual.listGrammarEventsByKind>) => {
      calls.listGrammarEventsByKind += 1;
      return actual.listGrammarEventsByKind(...args);
    },
    getGrammarTelemetryStats: () => {
      calls.getGrammarTelemetryStats += 1;
      return actual.getGrammarTelemetryStats();
    }
  };
});

vi.mock("../../services/grammarOutputService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/grammarOutputService")>();
  return {
    ...actual,
    buildLastWeekReport: (...args: Parameters<typeof actual.buildLastWeekReport>) => {
      calls.buildLastWeekReport += 1;
      return actual.buildLastWeekReport(...args);
    }
  };
});

import { act } from "react";
import { mountPage, resetStorage } from "../harness";
import { clickElement } from "./drive";
import { seedAppData, makeSentenceCard, cardsToData, PAST_ISO } from "./fixtures";
import GrammarPathPage from "../../pages/GrammarPathPage";
import { grammarLessons } from "../../data/grammarLessons";

const resetCalls = () => {
  for (const key of Object.keys(calls) as Array<keyof typeof calls>) calls[key] = 0;
};

/** 造一批「已完成课 + 到期句子卡 + 遥测事件」的数据，让路径页的每块统计都有真实工作量。 */
const seedRich = (doneLessons: string[], cardCount: number) => {
  const fixtures = Array.from({ length: cardCount }, (_, index) =>
    makeSentenceCard({
      id: `card-${index}`,
      sentence: `I am learning sentence number ${index}.`,
      schedule: { nextReviewAt: PAST_ISO }
    })
  );
  return seedAppData({
    grammarLessonsDone: doneLessons,
    ...cardsToData(fixtures)
  });
};

describe("PF1 · 语法地图页重复计算计数", () => {
  beforeEach(() => {
    resetStorage();
    resetCalls();
  });

  it("首次挂载：全库统计各算几次", () => {
    const done = grammarLessons.slice(0, 60).map((lesson) => lesson.id);
    seedRich(done, 120);
    resetCalls();
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    // 回填 effect 会触发一次 updateData → 再渲染一轮，等它落定
    const snapshot = { ...calls };
    console.log("【挂载后计数】", JSON.stringify(snapshot, null, 2));
    console.log(
      "【每个数据条数】课",
      grammarLessons.length,
      "卡",
      page.container.querySelectorAll(".lesson-path-card").length
    );
    page.unmount();
    expect(snapshot.summarizeLessonProgress).toBeGreaterThan(0);
  });

  it("挂载 + 落定回填后：慢函数累计调用次数（含 data 变更触发的重算）", async () => {
    const done = grammarLessons.slice(0, 60).map((lesson) => lesson.id);
    seedRich(done, 120);
    resetCalls();
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const afterMount = { ...calls };
    console.log("【挂载+回填落定】", JSON.stringify(afterMount, null, 2));
    page.unmount();
    expect(afterMount.summarizeLessonProgress).toBeGreaterThanOrEqual(2);
  });

  it("扇出成本：每个二次调用被放大几次（buildWeakSpotNarrative 内部再算一次 report）", async () => {
    const done = grammarLessons.slice(0, 60).map((lesson) => lesson.id);
    seedRich(done, 120);
    // 预置一批遥测事件，让 computeWeakSpotsReport 的每个分支都有真实遍历成本
    const events = Array.from({ length: 500 }, (_, index) => ({
      kind: index % 3 === 0 ? "diary_issue_tag" : index % 3 === 1 ? "hunt_verdict" : "grammar_review_result",
      ts: new Date(Date.now() - index * 60_000).toISOString(),
      tag: "sv_agreement",
      entryId: `entry-${index}`,
      issueIndex: 0,
      caseId: `case-${index}`,
      verdictKind: "wrongTag",
      guessedTag: "sv_agreement",
      tokenIndex: 0,
      cardId: `card-${index % 120}`,
      sourceId: `diary:entry-${index}`,
      passed: false,
      attempts: 2,
      mode: "cloze",
      lessonId: grammarLessons[0].id
    }));
    window.localStorage.setItem(
      "grammar-telemetry-events-v1",
      JSON.stringify({ version: 1, events })
    );
    resetCalls();
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    console.log("【含 500 条遥测】", JSON.stringify(calls, null, 2));
    // 一次渲染的三块统计里，report 被算了几次（computeWeakSpotsReport 直接 + narrative 内部 + …）
    expect(calls.computeWeakSpotsReport).toBeGreaterThan(1);
    page.unmount();
  });

  it("点开季卡（纯本地 UI 状态变化，不改 data）：慢函数是否重算", async () => {
    const done = grammarLessons.slice(0, 60).map((lesson) => lesson.id);
    seedRich(done, 120);
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    resetCalls();
    // 点第 5 个季卡（展开/收起）——只改 openSeasonId 这个 useState
    const heads = Array.from(page.container.querySelectorAll(".season-card-head")) as HTMLButtonElement[];
    clickElement(heads[4]);
    clickElement(heads[5]);
    console.log("【点季卡 2 次后】", JSON.stringify(calls, null, 2));
    expect(calls.summarizeLessonProgress).toBe(0);
    page.unmount();
  });
});
