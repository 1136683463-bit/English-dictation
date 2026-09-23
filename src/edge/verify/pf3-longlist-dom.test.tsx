// @vitest-environment jsdom
/**
 * PF3 · 长列表渲染量：数据条数 vs 实际 DOM 节点数
 *
 * 数据基线（题目已实测）：课程 197 课 / 28 季、侦探案件 206 个。
 * 本文件只测「渲染出来的节点数」，判断有没有一次性铺满、有没有虚拟化/分页。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { act } from "react";
import { mountPage, resetStorage } from "../harness";
import { clickElement } from "./drive";
import { seedAppData } from "./fixtures";
import GrammarPathPage from "../../pages/GrammarPathPage";
import GrammarHuntPage from "../../pages/GrammarHuntPage";
import { grammarLessons } from "../../data/grammarLessons";
import { huntCases } from "../../data/huntCases";
import { LESSON_GROUPS } from "../../data/grammarSeasons";

const countAll = (root: HTMLElement): number => root.querySelectorAll("*").length;
const count = (root: HTMLElement, selector: string): number => root.querySelectorAll(selector).length;

const settle = async (): Promise<void> => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

describe("PF3 · 长列表渲染量", () => {
  beforeEach(() => resetStorage());

  it("语法地图：默认只展开 1 季，逐季展开的最大节点数（单选取值，无法同时全开）", async () => {
    // 全部课完成 → 所有季卡都已有进度
    seedAppData({ grammarLessonsDone: grammarLessons.map((lesson) => lesson.id) });
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    await settle();

    const seasonCards = count(page.container, ".season-card");
    const defaultLessonCards = count(page.container, ".lesson-path-card");
    const defaultNodes = countAll(page.container);
    const defaultLinks = count(page.container, "a");
    const defaultButtons = count(page.container, "button");

    // 单选取值：逐个展开每一季，记录该季的课卡与总节点数（互斥，无法同时全开）
    let maxNodes = 0;
    let maxLessonCards = 0;
    let maxSeasonLabel = "";
    let sumLessonCards = 0;
    for (let index = 0; index < seasonCards; index += 1) {
      const cards = Array.from(page.container.querySelectorAll(".season-card"));
      const card = cards[index];
      if (!card?.className.includes("is-open")) clickElement(card?.querySelector(".season-card-head"));
      const refreshed = Array.from(page.container.querySelectorAll(".season-card"))[index];
      const lessonCards = refreshed?.querySelectorAll(".lesson-path-card").length ?? 0;
      const nodes = countAll(page.container);
      sumLessonCards += lessonCards;
      if (nodes > maxNodes) {
        maxNodes = nodes;
        maxLessonCards = lessonCards;
        maxSeasonLabel = refreshed?.getAttribute("aria-label") ?? "";
      }
    }

    console.log(`【语法地图】数据：课 ${grammarLessons.length} / 季 ${LESSON_GROUPS.length}`);
    console.log(
      `  默认（1 季展开）：季卡 ${seasonCards}，课卡 ${defaultLessonCards}，总节点 ${defaultNodes}，<a> ${defaultLinks}，<button> ${defaultButtons}`
    );
    console.log(
      `  逐季展开的最大值：${maxSeasonLabel} 课卡 ${maxLessonCards}，总节点 ${maxNodes}（默认的 ${(maxNodes / defaultNodes).toFixed(1)}×）；全 28 季课卡累计 ${sumLessonCards}`
    );
    console.log(
      `  假设无单选限制（全 28 季同开）的线性外推节点数 ≈ ${Math.round((maxNodes / Math.max(1, maxLessonCards)) * grammarLessons.length)}`
    );

    expect(sumLessonCards).toBe(grammarLessons.length);
    page.unmount();
  });

  it("语法地图：每张课卡展开出的三节点链 + 档位条，节点放大系数", async () => {
    const done = grammarLessons.map((lesson) => lesson.id);
    seedAppData({ grammarLessonsDone: done });
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    await settle();
    // 找课卡最多的那一季（单选取值，逐季比较）
    const seasonCount = count(page.container, ".season-card");
    let best = 0;
    for (let index = 0; index < seasonCount; index += 1) {
      const cards = Array.from(page.container.querySelectorAll(".season-card"));
      if (!cards[index]?.className.includes("is-open")) {
        clickElement(cards[index]?.querySelector(".season-card-head"));
      }
      const refreshed = Array.from(page.container.querySelectorAll(".season-card"))[index];
      best = Math.max(best, refreshed?.querySelectorAll(".lesson-path-card").length ?? 0);
    }
    // 停在课卡最多的那一季
    for (let index = 0; index < seasonCount; index += 1) {
      const cards = Array.from(page.container.querySelectorAll(".season-card"));
      if (!cards[index]?.className.includes("is-open")) {
        clickElement(cards[index]?.querySelector(".season-card-head"));
      }
      const refreshed = Array.from(page.container.querySelectorAll(".season-card"))[index];
      if ((refreshed?.querySelectorAll(".lesson-path-card").length ?? 0) === best) break;
    }
    const nodes = countAll(page.container);
    const lessonCards = count(page.container, ".lesson-path-card");
    const stageNodes = count(page.container, ".lesson-stage-node");
    const boostLinks = count(page.container, ".lesson-boost-tier");
    console.log(
      `【最大季展开】课卡 ${lessonCards} → 总节点 ${nodes}，三关卡节点 ${stageNodes}，档位链接 ${boostLinks}，每课约 ${(nodes / lessonCards).toFixed(1)} 节点`
    );
    expect(nodes).toBeGreaterThan(lessonCards * 10);
    page.unmount();
  });

  it("侦探页：案件列表分组折叠后渲染多少案件卡", async () => {
    seedAppData({ grammarLessonsDone: grammarLessons.map((lesson) => lesson.id) });
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt");
    await settle();

    const groups = count(page.container, ".hunt-case-group");
    const defaultCases = count(page.container, ".hunt-case-card");
    const defaultNodes = countAll(page.container);

    // 展开所有分组
    for (let index = 0; index < groups; index += 1) {
      const all = Array.from(page.container.querySelectorAll(".hunt-case-group"));
      if (!all[index]?.className.includes("is-open")) {
        clickElement(all[index]?.querySelector(".hunt-case-group-head"));
      }
    }
    const expandedCases = count(page.container, ".hunt-case-card");
    const expandedNodes = countAll(page.container);

    console.log(`【侦探页】数据：案件 ${huntCases.length}`);
    console.log(`  默认：分组 ${groups}，案件卡 ${defaultCases}，总节点 ${defaultNodes}`);
    console.log(`  展开全部分组：案件卡 ${expandedCases}，总节点 ${expandedNodes}`);

    expect(expandedCases).toBeGreaterThan(0);
    page.unmount();
  });

  it("侦探页：单案打开时的节点量（判题热路径的 DOM 规模）", async () => {
    seedAppData({ grammarLessonsDone: grammarLessons.map((lesson) => lesson.id) });
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt");
    await settle();
    const closedNodes = countAll(page.container);
    const firstCase = page.container.querySelector(".hunt-case-card:not([disabled])") as HTMLButtonElement | null;
    clickElement(firstCase);
    const openNodes = countAll(page.container);
    const tokenButtons = count(page.container, "button");
    console.log(`【单案打开】关列表 ${closedNodes} 节点 → 开了案 ${openNodes} 节点；案内按钮 ${tokenButtons}`);
    page.unmount();
  });
});
