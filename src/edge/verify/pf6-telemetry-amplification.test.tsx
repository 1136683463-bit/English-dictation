// @vitest-environment jsdom
/**
 * PF6 · 遥测重解析放大（GrammarPathPage / GrammarBoostPage）
 *
 * 关键嫌疑（读源码得出）：
 *   GrammarPathPage.tsx:742 `readCompletedAt(lessonId)` 内部调
 *   `listGrammarEventsByKind("grammar_lesson_completed")` —— 而
 *   grammarTelemetry.listGrammarEvents() 每次都 `JSON.parse` 整个遥测 blob（无缓存，上限 3000 条）。
 *   该函数被 `renderStageChain` 对**每张已完成课卡**调用（3 个 stage 各一次 getLessonStageLock）。
 *   ⇒ 每渲染一张已完成课卡 = 至少一次全量遥测 JSON.parse。
 *
 * 本文件把「遥测解析次数」与「渲染的课卡数」直接对照，给出放大系数。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { act } from "react";
import { mountPage, resetStorage } from "../harness";
import { clickElement } from "./drive";
import { seedAppData, cardsToData, makeSentenceCard, PAST_ISO } from "./fixtures";
import GrammarPathPage from "../../pages/GrammarPathPage";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import { grammarLessons } from "../../data/grammarLessons";
import { LESSON_GROUPS } from "../../data/grammarSeasons";
import { DONE_LESSON_ID } from "./fixtures";

const settle = async (): Promise<void> => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

const TELEMETRY_KEY = "grammar-telemetry-events-v1";

/** 装一个计数器，统计遥测 key 被 getItem 读了多少次、读取了多少字节。 */
const countTelemetryReads = () => {
  const state = { count: 0, bytes: 0, parseMs: 0 };
  const originalGetItem = Storage.prototype.getItem;
  Storage.prototype.getItem = function patched(key: string) {
    const value = originalGetItem.call(this, key);
    if (key === TELEMETRY_KEY && value) {
      state.count += 1;
      state.bytes += value.length;
      const start = performance.now();
      JSON.parse(value);
      state.parseMs += performance.now() - start;
    }
    return value;
  };
  return {
    state,
    restore: () => {
      Storage.prototype.getItem = originalGetItem;
    },
    reset: () => {
      state.count = 0;
      state.bytes = 0;
      state.parseMs = 0;
    }
  };
};

const seedTelemetry = (eventCount: number, doneLessonIds: string[] = []) => {
  const events: Array<Record<string, unknown>> = [];
  for (let index = 0; index < eventCount; index += 1) {
    events.push({
      kind: "grammar_lesson_completed",
      lessonId: doneLessonIds[index % Math.max(1, doneLessonIds.length)] ?? "lesson-1",
      completedAt: new Date(Date.now() - index * 600_000).toISOString(),
      ts: new Date(Date.now() - index * 600_000).toISOString()
    });
    events.push({
      kind: "hunt_verdict",
      caseId: `case-${index % 206}`,
      tokenIndex: index % 10,
      verdictKind: "wrongTag",
      guessedTag: "sv_agreement",
      ts: new Date(Date.now() - index * 600_000).toISOString()
    });
  }
  const json = JSON.stringify({ version: 1, events });
  window.localStorage.setItem(TELEMETRY_KEY, json);
  return { bytes: json.length, events: events.length };
};

const richCards = (count: number) =>
  cardsToData(
    Array.from({ length: count }, (_, index) =>
      makeSentenceCard({
        id: `card-${index}`,
        sentence: `I am learning sentence number ${index}.`,
        schedule: { nextReviewAt: PAST_ISO }
      })
    )
  );

describe("PF6 · 遥测重解析放大", () => {
  beforeEach(() => resetStorage());

  it("语法地图：已完成的课卡数 vs 遥测 JSON.parse 次数", async () => {
    const done = grammarLessons.map((lesson) => lesson.id);
    seedAppData({ grammarLessonsDone: done, ...richCards(120) });
    const telemetry = seedTelemetry(1500, done);
    console.log(
      `【遥测体量】${(telemetry.bytes / 1024).toFixed(0)}KB / ${telemetry.events} 条（主键上限 3000 条，约 ${(telemetry.bytes * 2 / 1024).toFixed(0)}KB）`
    );

    const counter = countTelemetryReads();
    try {
      const start = performance.now();
      const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
      const mountMs = performance.now() - start;
      const afterMount = { ...counter.state };
      await settle();
      const afterSettle = { ...counter.state };

      const lessonCards = page.container.querySelectorAll(".lesson-path-card").length;
      const stageChains = page.container.querySelectorAll(".lesson-stage-chain").length;

      console.log("【语法地图】197 课全完成 + 1500 条遥测");
      console.log(`  挂载 ${mountMs.toFixed(1)}ms（jsdom，含模块冷启动，单次观测）`);
      console.log(`  挂载时渲染：课卡 ${lessonCards} 张，三关卡链 ${stageChains} 条`);
      console.log(
        `  挂载期间遥测 getItem ${afterMount.count} 次 → 等价 JSON.parse ${(afterMount.bytes / 1024).toFixed(0)}KB（纯解析 ${afterMount.parseMs.toFixed(1)}ms）`
      );
      console.log(
        `  回填落定后累计 ${afterSettle.count} 次 → ${(afterSettle.bytes / 1024).toFixed(0)}KB（纯解析 ${afterSettle.parseMs.toFixed(1)}ms）`
      );
      console.log(
        `  → 放大系数：每张课卡 ${(afterSettle.count / Math.max(1, lessonCards)).toFixed(1)} 次遥测解析`
      );

      // 展开最大的一季（课卡更多）
      const seasonCards = Array.from(page.container.querySelectorAll(".season-card"));
      let targetIndex = 0;
      let best = 0;
      for (let index = 0; index < seasonCards.length; index += 1) {
        const all = Array.from(page.container.querySelectorAll(".season-card"));
        if (!all[index]?.className.includes("is-open")) clickElement(all[index]?.querySelector(".season-card-head"));
        const refreshed = Array.from(page.container.querySelectorAll(".season-card"))[index];
        const count = refreshed?.querySelectorAll(".lesson-path-card").length ?? 0;
        if (count > best) {
          best = count;
          targetIndex = index;
        }
      }
      counter.reset();
      const all = Array.from(page.container.querySelectorAll(".season-card"));
      if (!all[targetIndex]?.className.includes("is-open")) {
        clickElement(all[targetIndex]?.querySelector(".season-card-head"));
      }
      // 再切一次，确保目标季是「刚展开」的那一次
      counter.reset();
      const current = Array.from(page.container.querySelectorAll(".season-card"))[targetIndex];
      if (current?.className.includes("is-open")) {
        clickElement(current.querySelector(".season-card-head"));
      }
      const reopened = Array.from(page.container.querySelectorAll(".season-card"))[targetIndex];
      if (!reopened?.className.includes("is-open")) {
        clickElement(reopened?.querySelector(".season-card-head"));
      }
      const expand = { ...counter.state };
      const expandedCards = page.container.querySelectorAll(".lesson-path-card").length;
      console.log(
        `  展开含 ${expandedCards} 张课卡的那一季：遥测重解析 ${expand.count} 次（${(expand.bytes / 1024).toFixed(0)}KB，纯解析 ${expand.parseMs.toFixed(1)}ms）`
      );
      console.log(
        `  → 该次交互的解析放大：${(expand.count / Math.max(1, expandedCards)).toFixed(1)} 次/课卡`
      );

      page.unmount();
    } finally {
      counter.restore();
    }
    expect(true).toBe(true);
  });

  it("语法地图：点「排进今日复习」（data 变化）后重算规模", async () => {
    const done = grammarLessons.map((lesson) => lesson.id);
    seedAppData({ grammarLessonsDone: done, ...richCards(120) });
    seedTelemetry(1500, done);
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    await settle();

    const counter = countTelemetryReads();
    try {
      const start = performance.now();
      // 点季卡（纯 UI 状态）对照
      counter.reset();
      const heads = Array.from(page.container.querySelectorAll(".season-card-head")) as HTMLButtonElement[];
      clickElement(heads[3]);
      const uiStateOnly = { ...counter.state };

      // 找「排进今日复习」按钮（需要弱点榜存在）；没有则用「导出学习数据」触发一次 data 读取
      const queueButton = Array.from(page.container.querySelectorAll("button")).find((node) =>
        (node.textContent ?? "").includes("排进今日复习")
      ) as HTMLButtonElement | undefined;
      counter.reset();
      if (queueButton) {
        clickElement(queueButton);
        await settle();
        console.log("【点了「排进今日复习」】遥测重解析", counter.state.count, "次");
      } else {
        console.log("【没有弱点榜按钮】（无遥测弱点数据）");
      }
      const afterAction = { ...counter.state };
      console.log("【语法地图 · 交互对照】");
      console.log(
        `  点季卡（仅 UI 状态）→ 遥测重解析 ${uiStateOnly.count} 次（${(uiStateOnly.bytes / 1024).toFixed(0)}KB）`
      );
      console.log(
        `  点「排进今日复习」（data 变）→ 遥测重解析 ${afterAction.count} 次（${(afterAction.bytes / 1024).toFixed(0)}KB，纯解析 ${afterAction.parseMs.toFixed(1)}ms）`
      );
      console.log(`  动作总耗时（jsdom，单次观测，含 React 渲染）${(performance.now() - start).toFixed(1)}ms`);
      page.unmount();
    } finally {
      counter.restore();
    }
    expect(true).toBe(true);
  });

  it("趁热练：进档时出题路径的遥测重解析次数", async () => {
    const done = grammarLessons.map((lesson) => lesson.id);
    seedAppData({ grammarLessonsDone: done, ...richCards(120) });
    seedTelemetry(1500, done);

    const counter = countTelemetryReads();
    try {
      const start = performance.now();
      const page = mountPage(
        <GrammarBoostPage />,
        `/grammar/boost/${DONE_LESSON_ID}?tier=1&from=card`,
        "/grammar/boost/:lessonId"
      );
      await settle();
      const state = { ...counter.state };
      console.log("【趁热练进档 + 出题】");
      console.log(`  总耗时 ${(performance.now() - start).toFixed(1)}ms（jsdom，含模块冷启动，单次观测）`);
      console.log(`  遥测 getItem ${state.count} 次（${(state.bytes / 1024).toFixed(0)}KB，纯解析 ${state.parseMs.toFixed(1)}ms）`);
      console.log(`  题目数 ${page.container.querySelectorAll(".lesson-spot-row button").length} 个词块（DOM 观测）`);
      page.unmount();
    } finally {
      counter.restore();
    }
    expect(true).toBe(true);
  });

  it("遥测容量上限下的最坏情况：3000 条（主键满）时的单次解析成本", async () => {
    const done = grammarLessons.map((lesson) => lesson.id);
    seedAppData({ grammarLessonsDone: done, ...richCards(120) });
    const full = seedTelemetry(1500, done); // 1500×2 = 3000 条 = 主键上限
    console.log(`【满容量遥测】${(full.bytes / 1024).toFixed(0)}KB / ${full.events} 条（= 主键上限）`);

    const raw = window.localStorage.getItem(TELEMETRY_KEY)!;
    const iterations = 20;
    JSON.parse(raw);
    const start = performance.now();
    for (let index = 0; index < iterations; index += 1) JSON.parse(raw);
    const perParse = (performance.now() - start) / iterations;
    console.log(`  单次 JSON.parse ${perParse.toFixed(2)}ms（jsdom，${iterations} 次均值）`);

    const counter = countTelemetryReads();
    try {
      const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
      await settle();
      console.log(
        `  满容量下首次挂载 + 落定：遥测解析 ${counter.state.count} 次 → 合计约 ${(counter.state.count * perParse).toFixed(0)}ms 纯解析（jsdom）`
      );
      page.unmount();
      // 一次挂载就把 3000 条 × N 次解析
      console.log(
        `  → 单次挂载解析文本总量 ${(counter.state.bytes / 1024 / 1024).toFixed(1)}MB（= ${(counter.state.bytes / full.bytes).toFixed(0)} × 完整遥测）`
      );
    } finally {
      counter.restore();
    }
    expect(LESSON_GROUPS.length).toBe(28);
  });
});
