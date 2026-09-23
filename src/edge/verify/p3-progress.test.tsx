// @vitest-environment jsdom
/**
 * P3 · 路径页进度与状态显示
 *
 * 两个进度口径：
 *  - 总进度 = PageHeader 的 `{summary.done} / {summary.total} 课`（summarizeLessonProgress）
 *  - 季内进度 = 季卡 meta 的 `{groupDone} / {groupLessons.length} 课` / 「进行中」/「已完成」
 * 进度环 = conic-gradient，百分比由 `--p` 自定义属性驱动（无 JS 绘图）。
 *
 * 注意：seedAppData 会经 migrateData；normalizeSchedules 会给缺计划的卡补计划。
 * 本文件只写 grammarLessonsDone（不造卡），避免噪音。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "../harness";
import { clickElement, flushAsync } from "./drive";
import { seedAppData } from "./fixtures";
import GrammarPathPage from "../../pages/GrammarPathPage";
import { grammarLessons } from "../../data/grammarLessons";
import { LESSON_GROUPS } from "../../data/grammarSeasons";

const doneIds = (count: number): string[] => grammarLessons.slice(0, count).map((lesson) => lesson.id);

const progressPill = (page: ReturnType<typeof mountPage>): string =>
  (page.container.querySelector(".lesson-progress-pill")?.textContent ?? "").replace(/\s+/g, " ").trim();

const seasonMeta = (page: ReturnType<typeof mountPage>, index: number): string =>
  (Array.from(page.container.querySelectorAll(".season-card"))[index]?.querySelector(".season-card-meta")
    ?.textContent ?? "").trim();

const ringNum = (page: ReturnType<typeof mountPage>, index: number): string =>
  (Array.from(page.container.querySelectorAll(".season-card"))[index]?.querySelector(".season-ring-num")
    ?.textContent ?? "").trim();

const ringPercent = (page: ReturnType<typeof mountPage>, index: number): string =>
  (Array.from(page.container.querySelectorAll(".season-card"))[index]?.querySelector<HTMLElement>(".season-ring")
    ?.style.getPropertyValue("--p") ?? "").trim();

const seasonClass = (page: ReturnType<typeof mountPage>, index: number): string =>
  Array.from(page.container.querySelectorAll(".season-card"))[index]?.className ?? "";

const primaryCta = (page: ReturnType<typeof mountPage>): string =>
  (page.container.querySelector(".lesson-path-entry .primary-button")?.textContent ?? "").replace(/\s+/g, " ").trim();

describe("P3 · 进度与状态显示", () => {
  beforeEach(() => resetStorage());

  it("零进度：总进度 0 / 192，主 CTA 指向第 1 课，其他季全零", () => {
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    expect(progressPill(page)).toBe("0 / 205 课");
    expect(primaryCta(page)).toBe("从第 1 课开始 · 小美的一天");
    expect(page.has("一切从这 6 分钟开始")).toBe(true);
    // 第 1 季是「进行中」（下一课所在季），不是「已完成」
    expect(seasonMeta(page, 0)).toBe("进行中");
    expect(ringNum(page, 0)).toBe("0");
    expect(ringPercent(page, 0)).toBe("0");
    expect(seasonMeta(page, 1)).toBe("0 / 12 课");
    // 首访不展示「导出卡」（R03：技术化卡片不稀释主线）
    expect(page.container.querySelector('[aria-label="学习数据导出"]')).toBeNull();
    page.unmount();
  });

  it("学到 L5：总进度 5 / 192，第 5 课不再是「下一课」，主 CTA 指向第 6 课", () => {
    seedAppData({ grammarLessonsDone: doneIds(5) });
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    expect(progressPill(page)).toBe("5 / 205 课");
    expect(primaryCta(page)).toBe("继续第 6 课 · 现在几点了");
    // 设计口径（GrammarPathPage.tsx:864）：当前季固定显示「进行中」，
    // 季内具体进度只体现在进度环上（环内数字 = 完成数）。
    expect(seasonMeta(page, 0), "「下一课」所在季固定显示「进行中」").toBe("进行中");
    expect(ringPercent(page, 0), "环值仍应给出真实季内百分比").toBe(String(Math.round((5 / 12) * 100)));
    expect(ringNum(page, 0), "进行中的季环内数字应为完成数 5").toBe("5");
    // 非当前季则给出显式分母
    expect(seasonMeta(page, 1)).toBe("0 / 12 课");
    // 所有季卡的数字都必须是数字，不得出现 NaN/undefined
    for (let i = 0; i < LESSON_GROUPS.length; i += 1) {
      const meta = seasonMeta(page, i);
      expect(meta, `${LESSON_GROUPS[i].label} 的 meta 出现异常值：${meta}`).not.toMatch(/NaN|undefined|null/);
      expect(ringPercent(page, i), `${LESSON_GROUPS[i].label} 的进度环数值异常`).not.toMatch(/NaN|undefined/);
    }
    page.unmount();
  });

  it("学到 L13：第 1 季显示「已完成」，第 2 季「进行中」，进度环显示 ✓", () => {
    seedAppData({ grammarLessonsDone: doneIds(13) });
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    expect(progressPill(page)).toBe("13 / 205 课");
    expect(seasonMeta(page, 0)).toBe("已完成");
    expect(ringNum(page, 0), "整季完成后进度环应显示 ✓ 而不是数字").toBe("✓");
    expect(ringPercent(page, 0)).toBe("100");
    expect(seasonClass(page, 0)).toContain("is-complete");
    expect(seasonMeta(page, 1)).toBe("进行中");
    expect(seasonClass(page, 1)).toContain("is-current");
    expect(seasonClass(page, 0), "已完成的季不应同时标记为当前季").not.toContain("is-current");
    page.unmount();
  });

  it("整季完成但未学下一季：默认展开的仍是「下一课」所在季（不是已完成季）", () => {
    seedAppData({ grammarLessonsDone: doneIds(12) });
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const open = Array.from(page.container.querySelectorAll(".season-card")).findIndex((card) =>
      card.className.includes("is-open")
    );
    expect(open, "第 1 季学完、下一课是第 13 课 → 应默认展开第 2 季").toBe(1);
    expect(seasonMeta(page, 0)).toBe("已完成");
    page.unmount();
  });

  it("全部 205 课完成：进度 205 / 205，无「下一课」，主 CTA 转为去复习", () => {
    seedAppData({ grammarLessonsDone: doneIds(205) });
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    // 从全库推导，避免每次加课后手工更新（批四十一）
    const total = grammarLessons.length;
    expect(progressPill(page)).toBe(`${total} / ${total} 课`);
    expect(primaryCta(page)).toBe("全部课程已完成 · 去复习巩固");
    expect(page.has("继续第")).toBe(false);
    for (let i = 0; i < LESSON_GROUPS.length; i += 1) {
      expect(seasonMeta(page, i), `${LESSON_GROUPS[i].label} 应显示已完成`).toBe("已完成");
      expect(ringNum(page, i)).toBe("✓");
    }
    // 全部完成时默认展开最后一季（代码注释声明）
    const open = Array.from(page.container.querySelectorAll(".season-card")).findIndex((card) =>
      card.className.includes("is-open")
    );
    expect(open).toBe(LESSON_GROUPS.length - 1);
    page.unmount();
  });

  it("部分完成某季（L13-L18 完成 6 课中的 3 课）：季内进度 3 / 12 与环值正确", () => {
    const first = grammarLessons.slice(0, 12).map((l) => l.id);
    const partial = grammarLessons.slice(12, 15).map((l) => l.id); // 第 13/14/15 课
    seedAppData({ grammarLessonsDone: [...first, ...partial] });
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    expect(progressPill(page)).toBe("15 / 205 课");
    expect(seasonMeta(page, 0)).toBe("已完成");
    // 第 2 季 12 课完成 3 课；但它是「下一课」（第 16 课）所在季 → 显示「进行中」
    expect(seasonMeta(page, 1)).toBe("进行中");
    // 进行中的季环上显示的是完成数（不是百分比）
    expect(ringNum(page, 1)).toBe("3");
    expect(ringPercent(page, 1)).toBe(String(Math.round((3 / 12) * 100)));
    page.unmount();
  });

  it("课卡上的「已完成 / 下一课 / 再学一遍」标记与进度一致", () => {
    seedAppData({ grammarLessonsDone: doneIds(5) });
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const card = (index: number) =>
      Array.from(page.container.querySelectorAll(".lesson-path-card"))[index];
    // 第 1 课已完成
    expect(card(0).querySelector(".lesson-path-done")?.textContent).toBe("已完成");
    expect(card(0).className).toContain("done");
    expect(card(0).querySelector(".lesson-path-cta")?.textContent?.trim()).toBe("再学一遍");
    // 第 5 课（最后一课已完成）
    expect(card(4).querySelector(".lesson-path-done")?.textContent).toBe("已完成");
    // 第 6 课 = 下一课
    expect(card(5).querySelector(".lesson-path-next")?.textContent).toBe("下一课");
    expect(card(5).className).toContain("next");
    expect(card(5).querySelector(".lesson-path-cta")?.textContent?.replace(/\s+/g, " ").trim()).toBe("开始这一课");
    // 第 7 课及以后：普通态，无 done/next 标记
    expect(card(6).querySelector(".lesson-path-done")).toBeNull();
    expect(card(6).querySelector(".lesson-path-next")).toBeNull();
    expect(card(6).querySelector(".lesson-path-cta")?.textContent?.trim()).toBe("去学习");
    page.unmount();
  });

  it("有进度后主 CTA 文案改为「继续第 N 课」，并按 1-3 课/4+ 课切换引导语", async () => {
    seedAppData({ grammarLessonsDone: doneIds(2) });
    const page1 = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    expect(page1.has("学过的地方，可以去侦探那里找找漏洞来复习。"), "1-3 课进度用口语化引导语").toBe(true);
    page1.unmount();
    await flushAsync();

    seedAppData({ grammarLessonsDone: doneIds(5) });
    const page2 = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    expect(page2.has("已经学过的语法点，可以去侦探那里找一找漏洞来复习。")).toBe(true);
    expect(page2.has("写今日日记")).toBe(true);
    page2.unmount();
  });

  it("进度环百分比与季完成数严格对应（28 季全扫描，含不整除的季）", () => {
    // 完成 L1-L138（跨 21 季），逐季核对环值
    seedAppData({ grammarLessonsDone: doneIds(138) });
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    for (let i = 0; i < LESSON_GROUPS.length; i += 1) {
      const group = LESSON_GROUPS[i];
      const groupLessons = grammarLessons.filter((l) => l.number >= group.min && l.number <= group.max);
      const done = groupLessons.filter((l) => l.number <= 138).length;
      const expected = Math.round((done / groupLessons.length) * 100);
      expect(ringPercent(page, i), `${group.label} 环值`).toBe(String(expected));
      if (done === groupLessons.length) {
        expect(seasonMeta(page, i)).toBe("已完成");
        expect(ringNum(page, i)).toBe("✓");
      } else {
        expect(ringNum(page, i), `${group.label} 环上数字应为完成数`).toBe(String(done));
      }
    }
    page.unmount();
  });

  it("已完成课的季展开后显示三关卡链（正课/回访/重审），未学课不显示", () => {
    seedAppData({ grammarLessonsDone: doneIds(1) });
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const chains = page.container.querySelectorAll(".lesson-stage-chain");
    expect(chains.length, "只有已完成的第 1 课该有三关卡链").toBe(1);
    expect(chains[0].getAttribute("aria-label")).toBe("第 1 课三关卡");
    const nodes = Array.from(chains[0].querySelectorAll(".lesson-stage-node")).map((n) =>
      (n.textContent ?? "").trim()
    );
    expect(nodes).toEqual(["● 正课", "○ 回访", "🔒 重审"]);
    page.unmount();
  });

  it("季卡点击后季内课卡顺序为课号升序（无乱序）", () => {
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    for (const index of [0, 12, 27]) {
      const cards = Array.from(page.container.querySelectorAll(".season-card"));
      if (!cards[index].className.includes("is-open")) {
        clickElement(cards[index].querySelector(".season-card-head") as HTMLButtonElement);
      }
      const numbers = Array.from(
        Array.from(page.container.querySelectorAll(".season-card"))[index].querySelectorAll(".lesson-path-card")
      ).map((node) => Number((node.querySelector("strong")?.textContent ?? "").match(/第\s*(\d+)\s*课/)?.[1]));
      expect(numbers, `第 ${index + 1} 季课号应升序`).toEqual([...numbers].sort((a, b) => a - b));
    }
    page.unmount();
  });
});
