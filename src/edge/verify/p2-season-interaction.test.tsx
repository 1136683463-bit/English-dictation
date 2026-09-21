// @vitest-environment jsdom
/**
 * P2 · 季卡片交互（两级导航的折叠/展开语义）
 *
 * 设计声明（GrammarPathPage.tsx:536-566）：
 *   「R-UX-IA（2026-09-19）：两级导航——首页总览季卡，点卡片展开该季课表。」
 *   「单选语义：openSeasonId = null（全部收起）/ 季 id；默认展开「下一课」所在季
 *    （全部学完时展开最后一季）。此前 override 表 + 默认值回退的组合会让默认季
 *    绕过互斥（点别的卡后旧季仍开），改为显式单值状态机。」
 *
 * 本文件验证：默认态、点击展开、再点收起、互斥（同时只开一季）、
 * 「用户手动动过折叠后不再自动跟随下一课」。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "../harness";
import { clickElement, flushAsync } from "./drive";
import { seedAppData } from "./fixtures";
import GrammarPathPage from "../../pages/GrammarPathPage";
import { grammarLessons } from "../../data/grammarLessons";
import { LESSON_GROUPS } from "../../data/grammarSeasons";

const openIds = (page: ReturnType<typeof mountPage>): string[] =>
  Array.from(page.container.querySelectorAll(".season-card"))
    .filter((card) => card.className.includes("is-open"))
    .map((card) => card.getAttribute("aria-label") ?? "");

const headOf = (page: ReturnType<typeof mountPage>, index: number): HTMLButtonElement =>
  Array.from(page.container.querySelectorAll(".season-card"))[index].querySelector(
    ".season-card-head"
  ) as HTMLButtonElement;

const lessonNumbersOf = (page: ReturnType<typeof mountPage>, index: number): number[] => {
  const card = Array.from(page.container.querySelectorAll(".season-card"))[index];
  return Array.from(card.querySelectorAll(".lesson-path-card")).map((node) =>
    Number((node.querySelector("strong")?.textContent ?? "").match(/第\s*(\d+)\s*课/)?.[1] ?? -1)
  );
};

describe("P2 · 季卡片折叠/展开交互", () => {
  beforeEach(() => resetStorage());

  it("默认只展开「下一课」所在季，其余 27 季全部折叠（无课卡渲染）", () => {
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const cards = Array.from(page.container.querySelectorAll(".season-card"));
    expect(openIds(page)).toEqual([LESSON_GROUPS[0].label]);
    // 折叠季内部不渲染课卡（条件渲染 {open && ...}）——这是「两级导航」的实质
    const collapsedWithoutGrid = cards.filter(
      (card, index) =>
        index !== 0 && !card.className.includes("is-open") && card.querySelectorAll(".lesson-path-card").length === 0
    );
    expect(collapsedWithoutGrid.length, "折叠季不应渲染课卡").toBe(27);
    expect(page.container.querySelectorAll(".lesson-path-card").length, "首屏只该有第 1 季的 12 课").toBe(12);
    page.unmount();
  });

  it("点击折叠季标题 → 展开该季课表；再点同一标题 → 收起回到总览", () => {
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const second = LESSON_GROUPS[1];

    expect(headOf(page, 1).getAttribute("aria-expanded")).toBe("false");
    clickElement(headOf(page, 1));
    expect(openIds(page)).toEqual([second.label]);
    expect(headOf(page, 1).getAttribute("aria-expanded")).toBe("true");
    expect(lessonNumbersOf(page, 1)).toEqual([13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);
    // aria-controls 指向的容器真的存在
    const bodyId = headOf(page, 1).getAttribute("aria-controls") ?? "";
    expect(page.container.querySelector(`#${bodyId}`), "aria-controls 指向的季课表容器不存在").not.toBeNull();

    clickElement(headOf(page, 1));
    expect(headOf(page, 1).getAttribute("aria-expanded")).toBe("false");
    expect(openIds(page)).toEqual([]);
    expect(page.container.querySelectorAll(".lesson-path-card").length, "收起后应无课卡").toBe(0);
    page.unmount();
  });

  it("互斥单选：点别的季卡会关掉上一个季（同时只开一季）", () => {
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    clickElement(headOf(page, 5));
    expect(openIds(page)).toEqual([LESSON_GROUPS[5].label]);

    clickElement(headOf(page, 20));
    expect(openIds(page), "打开新季后旧季必须关闭（设计声明的单选语义）").toEqual([LESSON_GROUPS[20].label]);

    // 全量扫描：任意时刻展开数恒为 0 或 1
    let maxOpen = 0;
    for (let i = 0; i < LESSON_GROUPS.length; i += 1) {
      clickElement(headOf(page, i));
      maxOpen = Math.max(maxOpen, openIds(page).length);
    }
    expect(maxOpen, "逐个点遍 28 季后，展开数曾超过 1").toBeLessThanOrEqual(1);
    page.unmount();
  });

  it("用户手动收起后，换课不再自动跟随展开（openSeasonTouchedRef 生效）", async () => {
    const data = seedAppData({ grammarLessonsDone: grammarLessons.slice(0, 0).map((l) => l.id) });
    void data;
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    // 手动把默认展开的第一季收起：此后自动跟随失效，页面保持全收起
    clickElement(headOf(page, 0));
    expect(openIds(page)).toEqual([]);
    await flushAsync();
    // 页面重渲染（updateData 回填核心句）后仍应保持收起
    expect(openIds(page), "用户手动收起后不应被自动跟随重新展开").toEqual([]);
    expect(page.container.querySelectorAll(".lesson-path-card").length).toBe(0);
    page.unmount();
  });

  it("切入另一季后，标题与课表的 aria 关联仍然正确（无重复 id）", () => {
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    clickElement(headOf(page, 3));
    const grids = Array.from(page.container.querySelectorAll(".lesson-path-grid"));
    expect(grids.length, "同时只该有一个季课表容器渲染").toBe(1);
    const ids = grids.map((grid) => grid.id);
    expect(new Set(ids).size, `季课表容器 id 重复：${ids.join(",")}`).toBe(ids.length);
    page.unmount();
  });
});
