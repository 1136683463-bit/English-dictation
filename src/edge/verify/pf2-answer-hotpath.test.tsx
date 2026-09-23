// @vitest-environment jsdom
/**
 * PF2 · 答题热路径：一次作答触发多少次全库计算
 *
 * 四个页面（正课 / 复习 / 趁热练 / 侦探）各挂载一次，作答 N 次，
 * 用 vi.mock 给服务层插桩计数，量化「每答一题重算几次、每次扫多少数据」。
 *
 * 特别关注 O(全库) 与 O(n²)：
 *   - huntService.findUnlockLesson：每个案件线性 find 197 课 → listHuntCasesWithLock 是 O(206×197)
 *   - huntService.summarizeHuntProgress：每个案件对 huntResults 做 some → O(206×结果数)
 *   - reviewService.getLearningStats / getWeakStats：多次全库扫 reviews + cards
 */
import { describe, expect, it, vi, beforeEach } from "vitest";

const calls: Record<string, number> = {};
const bump = (key: string) => {
  calls[key] = (calls[key] ?? 0) + 1;
};
const resetCalls = () => {
  for (const key of Object.keys(calls)) delete calls[key];
};

vi.mock("../../services/huntService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/huntService")>();
  return {
    ...actual,
    listHuntCasesWithLock: (...args: Parameters<typeof actual.listHuntCasesWithLock>) => {
      bump("listHuntCasesWithLock");
      return actual.listHuntCasesWithLock(...args);
    },
    summarizeHuntProgress: (...args: Parameters<typeof actual.summarizeHuntProgress>) => {
      bump("summarizeHuntProgress");
      return actual.summarizeHuntProgress(...args);
    },
    appendHuntAttempt: (...args: Parameters<typeof actual.appendHuntAttempt>) => {
      bump("appendHuntAttempt");
      return actual.appendHuntAttempt(...args);
    }
  };
});

vi.mock("../../services/reviewService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/reviewService")>();
  return {
    ...actual,
    getDueCards: (...args: Parameters<typeof actual.getDueCards>) => {
      bump("getDueCards");
      return actual.getDueCards(...args);
    },
    getLearningStats: (...args: Parameters<typeof actual.getLearningStats>) => {
      bump("getLearningStats");
      return actual.getLearningStats(...args);
    },
    getWeakStats: (...args: Parameters<typeof actual.getWeakStats>) => {
      bump("getWeakStats");
      return actual.getWeakStats(...args);
    },
    getWeakCardInsights: (...args: Parameters<typeof actual.getWeakCardInsights>) => {
      bump("getWeakCardInsights");
      return actual.getWeakCardInsights(...args);
    },
    applyReview: (...args: Parameters<typeof actual.applyReview>) => {
      bump("applyReview");
      return actual.applyReview(...args);
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
    },
    buildGrammarReviewTask: (...args: Parameters<typeof actual.buildGrammarReviewTask>) => {
      bump("buildGrammarReviewTask");
      return actual.buildGrammarReviewTask(...args);
    },
    summarizeGrammarMastery: (...args: Parameters<typeof actual.summarizeGrammarMastery>) => {
      bump("summarizeGrammarMastery");
      return actual.summarizeGrammarMastery(...args);
    }
  };
});

vi.mock("../../services/grammarBoostService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/grammarBoostService")>();
  return {
    ...actual,
    buildBoostItems: (...args: Parameters<typeof actual.buildBoostItems>) => {
      bump("buildBoostItems");
      return actual.buildBoostItems(...args);
    },
    buildBoostSeenIndex: (...args: Parameters<typeof actual.buildBoostSeenIndex>) => {
      bump("buildBoostSeenIndex");
      return actual.buildBoostSeenIndex(...args);
    },
    getLessonBoostTiersDone: (...args: Parameters<typeof actual.getLessonBoostTiersDone>) => {
      bump("getLessonBoostTiersDone");
      return actual.getLessonBoostTiersDone(...args);
    },
    boostProgressLabel: (...args: Parameters<typeof actual.boostProgressLabel>) => {
      bump("boostProgressLabel");
      return actual.boostProgressLabel(...args);
    },
    suggestBoostTier: (...args: Parameters<typeof actual.suggestBoostTier>) => {
      bump("suggestBoostTier");
      return actual.suggestBoostTier(...args);
    }
  };
});

vi.mock("../../services/grammarWeakSpotsService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/grammarWeakSpotsService")>();
  return {
    ...actual,
    computeWeakSpots: (...args: Parameters<typeof actual.computeWeakSpots>) => {
      bump("computeWeakSpots");
      return actual.computeWeakSpots(...args);
    }
  };
});

vi.mock("../../services/lessonService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/lessonService")>();
  return {
    ...actual,
    markLessonDone: (...args: Parameters<typeof actual.markLessonDone>) => {
      bump("markLessonDone");
      return actual.markLessonDone(...args);
    },
    addLessonMistakeSentence: (...args: Parameters<typeof actual.addLessonMistakeSentence>) => {
      bump("addLessonMistakeSentence");
      return actual.addLessonMistakeSentence(...args);
    },
    getLessonStageLock: (...args: Parameters<typeof actual.getLessonStageLock>) => {
      bump("getLessonStageLock");
      return actual.getLessonStageLock(...args);
    }
  };
});

import { act } from "react";
import { mountPage, resetStorage } from "../harness";
import { clickElement, setInputValue, flushAsync } from "./drive";
import { seedAppData, makeSentenceCard, cardsToData, DONE_LESSON_ID, PAST_ISO } from "./fixtures";
import GrammarHuntPage from "../../pages/GrammarHuntPage";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import ReviewPage from "../../pages/ReviewPage";
import { grammarLessons } from "../../data/grammarLessons";
import { huntCases } from "../../data/huntCases";
import type { HuntResult } from "../../types";

const settle = async (): Promise<void> => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

/** 直接测量被测纯函数一次调用的耗时（jsdom 环境，仅用于相对比较）。 */
const timeOnce = (label: string, fn: () => unknown, iterations = 5): number => {
  // 预热
  fn();
  const start = performance.now();
  for (let index = 0; index < iterations; index += 1) fn();
  const ms = (performance.now() - start) / iterations;
  console.log(`  ⏱ ${label}: ${ms.toFixed(2)}ms/次（jsdom，${iterations} 次均值）`);
  return ms;
};

/** 造一份「有真实体量」的数据：N 课完成 + N 句卡 + 历史作答记录。 */
const seedScale = (options: { doneLessons: number; sentenceCards: number; huntAttempts: number; huntResults: number }) => {
  const done = grammarLessons.slice(0, options.doneLessons).map((lesson) => lesson.id);
  const fixtures = Array.from({ length: options.sentenceCards }, (_, index) =>
    makeSentenceCard({
      id: `card-${index}`,
      sentence: `I am learning sentence number ${index}.`,
      schedule: { nextReviewAt: PAST_ISO }
    })
  );
  const huntAttempts = Array.from({ length: options.huntAttempts }, (_, index) => ({
    id: `attempt-${index}`,
    caseId: huntCases[index % huntCases.length].id,
    tokenIndex: 0,
    guessedTag: "sv_agreement" as const,
    hit: index % 2 === 0,
    createdAt: new Date(Date.now() - index * 60_000).toISOString()
  }));
  const huntResults: HuntResult[] = Array.from({ length: options.huntResults }, (_, index) => ({
    id: `result-${index}`,
    caseId: huntCases[index % huntCases.length].id,
    found: 0,
    total: huntCases[index % huntCases.length].errors.length,
    misses: index % 3,
    stars: 1,
    durationMs: 30_000,
    finishedAt: new Date(Date.now() - index * 60_000).toISOString()
  }));
  return seedAppData({
    grammarLessonsDone: done,
    huntAttempts,
    huntResults,
    ...cardsToData(fixtures)
  });
};

describe("PF2 · 答题热路径", () => {
  beforeEach(() => {
    resetStorage();
    resetCalls();
  });

  it("基线：单次全库计算的耗时（jsdom 观测，仅作相对比较）", async () => {
    const data = seedScale({ doneLessons: 100, sentenceCards: 150, huntAttempts: 800, huntResults: 300 });
    const huntService = await import("../../services/huntService");
    const reviewService = await import("../../services/reviewService");
    const grammarReview = await import("../../services/grammarReviewService");
    const boostService = await import("../../services/grammarBoostService");

    console.log(
      `【数据规模】课 ${grammarLessons.length} 完成 ${data.grammarLessonsDone.length} / 卡 ${data.cards.length} / 案件 ${huntCases.length} / huntAttempts ${data.huntAttempts.length} / huntResults ${data.huntResults.length} / 计划 ${data.schedules.length}`
    );
    timeOnce("listHuntCasesWithLock（O(案×课)）", () => huntService.listHuntCasesWithLock(data));
    timeOnce("summarizeHuntProgress（O(案×结果)）", () => huntService.summarizeHuntProgress(data));
    timeOnce("getDueCards（全计划+全卡）", () => reviewService.getDueCards(data));
    timeOnce("getLearningStats", () => reviewService.getLearningStats(data));
    timeOnce("getWeakStats", () => reviewService.getWeakStats(data));
    timeOnce("getWeakCardInsights(全部)", () => reviewService.getWeakCardInsights(data, { type: "word", limit: data.cards.length }));
    timeOnce("buildGrammarReviewSession（复习页会话）", () => grammarReview.buildGrammarReviewSession(data));
    timeOnce("summarizeGrammarMastery", () => grammarReview.summarizeGrammarMastery(data));
    timeOnce("buildBoostItems(档1)", () => boostService.buildBoostItems(DONE_LESSON_ID, 1));
    expect(true).toBe(true);
  });

  it("侦探页：一次「选罪名」触发多少次全库计算", async () => {
    seedScale({ doneLessons: 197, sentenceCards: 150, huntAttempts: 800, huntResults: 300 });
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt");
    await settle();

    const closed = { ...calls };
    console.log("【侦探页挂载】", JSON.stringify(closed));

    // 打开第一个可玩的案件
    const caseCard = page.container.querySelector(".hunt-case-card:not([disabled])") as HTMLButtonElement | null;
    clickElement(caseCard);
    resetCalls();

    // 点一个词 → 选一个罪名（无论对错都会 updateData）
    // 注意：词块是 <span role="button" class="hunt-token">，罪名是 <button class="hunt-tag-btn">
    const tokenNodes = Array.from(page.container.querySelectorAll(".hunt-token")) as HTMLElement[];
    console.log(`【案内可点词块】${tokenNodes.length} 个`);
    clickElement(tokenNodes[0]);
    await flushAsync();

    const tagButton = page.container.querySelector(".hunt-tag-btn") as HTMLButtonElement | null;
    resetCalls();
    clickElement(tagButton);
    await flushAsync();

    console.log("【选罪名一次后】", JSON.stringify(calls));
    page.unmount();

    // 结论断言：一次作答后 listHuntCasesWithLock + summarizeHuntProgress 各重算 1 次
    expect((calls.listHuntCasesWithLock ?? 0) + (calls.summarizeHuntProgress ?? 0)).toBeGreaterThan(0);
  });

  it("侦探页：连续答 3 次，累计重算次数（每次 data 变 → 两个全库 memo 失效）", async () => {
    seedScale({ doneLessons: 197, sentenceCards: 150, huntAttempts: 800, huntResults: 300 });
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt");
    await settle();
    const caseCard = page.container.querySelector(".hunt-case-card:not([disabled])") as HTMLButtonElement | null;
    clickElement(caseCard);
    await flushAsync();
    resetCalls();

    let answered = 0;
    for (let round = 0; round < 60 && answered < 3; round += 1) {
      const tokens = Array.from(page.container.querySelectorAll(".hunt-token")) as HTMLElement[];
      const token = tokens.find((node) => node.className.includes("idle"));
      if (!token) break;
      clickElement(token);
      await flushAsync();
      const tag = page.container.querySelector(".hunt-tag-btn") as HTMLButtonElement | null;
      if (!tag) break;
      clickElement(tag);
      await flushAsync();
      answered += 1;
    }
    console.log(`【侦探页连续作答 ${answered} 次】`, JSON.stringify(calls));
    console.log(
      `  → 每次作答：listHuntCasesWithLock ${((calls.listHuntCasesWithLock ?? 0) / Math.max(1, answered)).toFixed(1)} 次，summarizeHuntProgress ${((calls.summarizeHuntProgress ?? 0) / Math.max(1, answered)).toFixed(1)} 次`
    );
    page.unmount();
  });

  it("复习页：每答一张卡触发多少次全库计算", async () => {
    const data = seedScale({ doneLessons: 60, sentenceCards: 150, huntAttempts: 0, huntResults: 0 });
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    await settle();
    console.log("【复习页挂载】", JSON.stringify(calls));

    // 注意：planReviewSession 属于测试侧调用，先规划再清零，避免污染页面侧计数
    const plan = await import("./drive");
    const sessionPlan = plan.planReviewSession(data);
    console.log(`【复习会话】共 ${sessionPlan.total} 张，首张题型 ${sessionPlan.steps[0]?.mode}`);
    resetCalls();
    const step = sessionPlan.steps[0];
    if (step) plan.answerReviewStep(page, step);
    await flushAsync();

    console.log("【答 1 张卡后（页面侧）】", JSON.stringify(calls));
    const next = Array.from(page.container.querySelectorAll("button")).find((node) =>
      /^(下一张|完成复习)$/.test((node.textContent ?? "").trim())
    );
    resetCalls();
    clickElement(next);
    await flushAsync();
    console.log("【点下一张后（页面侧）】", JSON.stringify(calls));
    page.unmount();
  });

  it("复习页：连答 5 张，累计全库计算次数", async () => {
    const data = seedScale({ doneLessons: 60, sentenceCards: 150, huntAttempts: 0, huntResults: 0 });
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    await settle();
    const planModule = await import("./drive");
    const sessionPlan = planModule.planReviewSession(data);
    resetCalls();

    let answered = 0;
    for (const step of sessionPlan.steps) {
      if (answered >= 5) break;
      if (page.has("复习完成")) break;
      planModule.answerReviewStep(page, step);
      await flushAsync();
      answered += 1;
      const next = Array.from(page.container.querySelectorAll("button")).find((node) =>
        /^(下一张|完成复习)$/.test((node.textContent ?? "").trim())
      ) as HTMLButtonElement | undefined;
      if (!next) break;
      clickElement(next);
      await flushAsync();
    }
    console.log(`【复习页连答 ${answered} 张（页面侧）】`, JSON.stringify(calls));
    for (const key of ["getDueCards", "getLearningStats", "getWeakStats", "getWeakCardInsights", "summarizeGrammarMastery"]) {
      console.log(`  ${key}: ${((calls[key] ?? 0) / Math.max(1, answered)).toFixed(1)} 次/张`);
    }
    page.unmount();
  });

  it("通用复习页(/review)：每答一词触发多少次全库计算", async () => {
    seedScale({ doneLessons: 60, sentenceCards: 150, huntAttempts: 0, huntResults: 0 });
    const page = mountPage(<ReviewPage />, "/review", "/review");
    await settle();
    console.log("【/review 挂载】", JSON.stringify(calls));
    resetCalls();

    // 点「显示答案」类按钮 → 评分
    const reveal = Array.from(page.container.querySelectorAll("button")).find((node) =>
      /显示答案|查看答案|看答案/.test(node.textContent ?? "")
    ) as HTMLButtonElement | undefined;
    clickElement(reveal);
    await flushAsync();
    const beforeRating = { ...calls };
    console.log("【点显示答案后】", JSON.stringify(beforeRating));

    const rating = Array.from(page.container.querySelectorAll(".review-rating")).find((node) =>
      /记得/.test(node.textContent ?? "")
    ) as HTMLButtonElement | undefined;
    resetCalls();
    clickElement(rating);
    await flushAsync();
    console.log("【提交评分后】", JSON.stringify(calls));
    for (const key of ["getDueCards", "getLearningStats", "getWeakStats", "getWeakCardInsights"]) {
      console.log(`  ${key}: ${calls[key] ?? 0} 次/评分`);
    }
    page.unmount();
  });

  it("复习页：会话只在挂载时组一次吗（答 5 张后 rebuild session 次数）", async () => {
    const data = seedScale({ doneLessons: 60, sentenceCards: 150, huntAttempts: 0, huntResults: 0 });
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    await settle();
    const planModule = await import("./drive");
    const sessionPlan = planModule.planReviewSession(data);
    resetCalls();
    let answered = 0;
    for (const step of sessionPlan.steps) {
      if (answered >= 5) break;
      if (page.has("复习完成")) break;
      planModule.answerReviewStep(page, step);
      await flushAsync();
      answered += 1;
      const next = Array.from(page.container.querySelectorAll("button")).find((node) =>
        /^(下一张|完成复习)$/.test((node.textContent ?? "").trim())
      ) as HTMLButtonElement | undefined;
      if (!next) break;
      clickElement(next);
      await flushAsync();
    }
    console.log(`【答 ${answered} 张后】buildGrammarReviewSession=${calls.buildGrammarReviewSession ?? 0} 次，buildGrammarReviewTask=${calls.buildGrammarReviewTask ?? 0} 次（应为 $1 次会话 + ${answered} 次出题）`);
    page.unmount();
  });

  it("趁热练：每答一题触发多少次全库计算（含 buildBoostItems 是否重复出题）", async () => {
    seedScale({ doneLessons: 60, sentenceCards: 100, huntAttempts: 0, huntResults: 0 });
    const page = mountPage(
      <GrammarBoostPage />,
      `/grammar/boost/${DONE_LESSON_ID}?tier=1&from=card`,
      "/grammar/boost/:lessonId"
    );
    await settle();
    console.log("【趁热练进档后】", JSON.stringify(calls));
    resetCalls();

    const boost = await import("../../services/grammarBoostService");
    const items = boost.buildBoostItems(DONE_LESSON_ID, 1);
    resetCalls();
    let answered = 0;
    for (const item of items) {
      if (page.has("这一课的记忆稳住了") || page.has("又稳了一层")) break;
      const drive = await import("./drive");
      const result = drive.answerBoostItem(page, item);
      await flushAsync();
      if (result === "stuck") break;
      answered += 1;
      const next = Array.from(page.container.querySelectorAll("button")).find((node) =>
        /^(下一题|完成这一档)$/.test((node.textContent ?? "").trim())
      ) as HTMLButtonElement | undefined;
      if (!next) break;
      clickElement(next);
      await flushAsync();
    }
    console.log(`【趁热练连答 ${answered} 题】`, JSON.stringify(calls));
    for (const key of ["buildBoostItems", "buildBoostSeenIndex", "getLessonBoostTiersDone", "boostProgressLabel", "suggestBoostTier", "computeWeakSpots"]) {
      console.log(`  ${key}: ${((calls[key] ?? 0) / Math.max(1, answered)).toFixed(1)} 次/题`);
    }
    page.unmount();
  });

  it("正课：guided 段答一题触发多少次全库计算", async () => {
    seedScale({ doneLessons: 60, sentenceCards: 100, huntAttempts: 0, huntResults: 0 });
    const page = mountPage(
      <GrammarLessonPage />,
      "/grammar/lesson/lesson-13-now",
      "/grammar/lesson/:lessonId"
    );
    await settle();
    resetCalls();
    // 走到 guided 段：点「开始学习」类按钮若干次
    for (let round = 0; round < 6; round += 1) {
      const buttons = Array.from(page.container.querySelectorAll("button"));
      const advance = buttons.find((node) =>
        /^(开始这一课|开始|跳过|继续|下一步|看完了|去试试|开始练|进入)/.test((node.textContent ?? "").trim())
      ) as HTMLButtonElement | undefined;
      if (!advance) break;
      clickElement(advance);
      await flushAsync();
    }
    console.log("【正课走到当前段】", JSON.stringify(calls));
    console.log("  当前按钮：", page.buttons().slice(0, 10).join(" | "));
    page.unmount();
  });
});
