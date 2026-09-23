// @vitest-environment jsdom
/**
 * P1 · 路径页渲染完整性（静默过滤护栏的**实际渲染**验证）
 *
 * 护栏声明（src/data/grammarSeasons.ts 顶部注释）：
 *   「课程号不落在任何季区间内会被路径页静默过滤（整课不显示、无报错）」
 * 已有守门测试只断言「数据层区间覆盖」，本文件断言「路径页 DOM 里每课真的渲染出来了」。
 *
 * 方法：逐个展开 28 个季卡（季卡是二级导航，默认只展开「下一课」所在季），
 * 统计每个季实际渲染的 `.lesson-path-card` 数量与课号，与 LESSON_GROUPS 区间、
 * grammarLessons 全量逐一对照。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "../harness";
import { clickElement } from "./drive";
import GrammarPathPage from "../../pages/GrammarPathPage";
import { grammarLessons } from "../../data/grammarLessons";
import { LESSON_GROUPS } from "../../data/grammarSeasons";

const ALL_LESSON_NUMBERS = grammarLessons.map((lesson) => lesson.number).sort((a, b) => a - b);

/** 展开第 index 个季卡（点击季卡标题按钮），返回该季渲染出的课号列表。 */
const openSeasonAndReadNumbers = (page: ReturnType<typeof mountPage>, index: number): number[] => {
  const cards = Array.from(page.container.querySelectorAll(".season-card"));
  const card = cards[index];
  if (!card) throw new Error(`没有第 ${index} 个季卡（共 ${cards.length} 个）`);
  const head = card.querySelector(".season-card-head") as HTMLButtonElement | null;
  if (!head) throw new Error(`第 ${index} 个季卡没有标题按钮`);
  // 默认已展开的季（首页展开「下一课」所在季）不能再点，否则是把该季收起。
  if (!card.className.includes("is-open")) clickElement(head);
  const refreshed = Array.from(page.container.querySelectorAll(".season-card"))[index];
  const lessonCards = Array.from(refreshed?.querySelectorAll(".lesson-path-card") ?? []);
  return lessonCards.map((node) => {
    const match = (node.querySelector("strong")?.textContent ?? "").match(/第\s*(\d+)\s*课/);
    if (!match) throw new Error(`课卡标题里没有课号：「${node.querySelector("strong")?.textContent}」`);
    return Number(match[1]);
  });
};

describe("P1 · 路径页渲染完整性（28 季 / 205 课一课不漏）", () => {
  beforeEach(() => resetStorage());

  it("首页渲染出 28 个季卡，且展开下一课所在季（第 1 季）", () => {
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const cards = page.container.querySelectorAll(".season-card");
    expect(cards.length, "季卡数量应等于 LESSON_GROUPS 长度").toBe(LESSON_GROUPS.length);
    expect(LESSON_GROUPS.length).toBe(28);

    const openCards = Array.from(cards).filter((card) => card.className.includes("is-open"));
    expect(openCards.length, "默认只展开一个季").toBe(1);
    expect(openCards[0].getAttribute("aria-label")).toBe(LESSON_GROUPS[0].label);
    // 零进度时「下一课」= 第 1 课 → 默认展开第一季
    expect(openCards[0].querySelector(".season-card-meta")?.textContent).toBe("进行中");
    page.unmount();
  });

  it("逐个展开全部 28 季：渲染出的课号集合 === 205 课全量（无静默过滤）", () => {
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const seen: number[] = [];
    const perSeason: Array<{ id: string; numbers: number[] }> = [];

    for (let i = 0; i < LESSON_GROUPS.length; i += 1) {
      const numbers = openSeasonAndReadNumbers(page, i);
      perSeason.push({ id: LESSON_GROUPS[i].id, numbers });
      seen.push(...numbers);
    }

    const unique = [...new Set(seen)].sort((a, b) => a - b);
    const missing = ALL_LESSON_NUMBERS.filter((number) => !unique.includes(number));
    const extra = unique.filter((number) => !ALL_LESSON_NUMBERS.includes(number));

    expect(
      missing,
      `被静默过滤的课号（数据里有、路径页不显示）：${missing.join(", ")}`
    ).toEqual([]);
    expect(extra, `路径页显示了数据里不存在的课号：${extra.join(", ")}`).toEqual([]);
    expect(unique.length, "路径页渲染出的课总数应为 205").toBe(205);
    expect(grammarLessons.length).toBe(205);

    // 每季显示的课数 === 该季区间内实际存在的课数（区间长度）
    for (let i = 0; i < LESSON_GROUPS.length; i += 1) {
      const group = LESSON_GROUPS[i];
      const expected = ALL_LESSON_NUMBERS.filter((n) => n >= group.min && n <= group.max);
      const actual = perSeason[i].numbers;
      expect(
        actual.length,
        `${group.label}（${group.min}-${group.max}）显示 ${actual.length} 课，期望 ${expected.length} 课；实际课号 ${actual.join(",")}`
      ).toBe(expected.length);
      // 且都落在本季区间内（没有课被塞进错误的季）
      const outOfRange = actual.filter((n) => n < group.min || n > group.max);
      expect(outOfRange, `${group.label} 显示了区间外的课：${outOfRange.join(",")}`).toEqual([]);
    }
    page.unmount();
  });

  it("每张课卡指向的详情链接可解析到真实课程 id（无死链）", () => {
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const ids = new Set(grammarLessons.map((lesson) => lesson.id));
    const dead: string[] = [];
    let cardLinks = 0;

    for (let i = 0; i < LESSON_GROUPS.length; i += 1) {
      const cards = Array.from(page.container.querySelectorAll(".season-card"));
      if (!cards[i].className.includes("is-open")) {
        clickElement(cards[i].querySelector(".season-card-head") as HTMLButtonElement);
      }
      const refreshed = Array.from(page.container.querySelectorAll(".season-card"))[i];
      for (const anchor of Array.from(refreshed.querySelectorAll("a.lesson-path-card"))) {
        const href = anchor.getAttribute("href") ?? "";
        cardLinks += 1;
        const id = href.replace("/grammar/lesson/", "");
        if (!ids.has(id)) dead.push(href);
      }
    }
    expect(cardLinks, "应收集到 205 张课卡的链接").toBe(205);
    expect(dead, `指向不存在课程的链接：${dead.slice(0, 5).join(", ")}`).toEqual([]);
    page.unmount();
  });

  it("季卡区间与数据完全对齐（渲染层复核 grammarSeasons 守门）", () => {
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    const cardCount = page.container.querySelectorAll(".season-card").length;
    // 若某季区间内一课都不存在，页面会 return null（整季不渲染）→ 季卡数会少于 28
    expect(
      cardCount,
      "有空季（区间内无课）被静默跳过——季卡数量少于 LESSON_GROUPS"
    ).toBe(LESSON_GROUPS.length);
    page.unmount();
  });

  /**
   * 负向对照（证明上面的检测不是空断言）：
   * 检测逻辑 = 「数据里的课号集合 − 路径页渲染出的课号集合」。
   * 这里用一个人为丢课号的场景喂给同一段检测逻辑，确认它确实能报出被过滤的课
   * ——否则主断言即使页面真的漏课也可能假绿。
   */
  it("负向对照：检测逻辑对「人为漏一课」确实会报警", () => {
    // 复刻主断言用的检测逻辑（同一口径）
    const detect = (renderedNumbers: number[]) => {
      const unique = [...new Set(renderedNumbers)].sort((a, b) => a - b);
      return ALL_LESSON_NUMBERS.filter((number) => !unique.includes(number));
    };
    // 1874 是真实课号之外的注入号：模拟「第 204 课被季区间过滤」
    expect(detect(ALL_LESSON_NUMBERS.filter((n) => n !== 192)), "漏第 192 课应被抓到").toEqual([192]);
    expect(detect(ALL_LESSON_NUMBERS), "一课不漏时不该报错").toEqual([]);
    // 并确认课号是连续的 1..192（任何空洞都会被上面那条抓到）
    expect(ALL_LESSON_NUMBERS[0]).toBe(1);
    expect(ALL_LESSON_NUMBERS[ALL_LESSON_NUMBERS.length - 1]).toBe(205);
    expect(ALL_LESSON_NUMBERS.length).toBe(205);
  });
});
