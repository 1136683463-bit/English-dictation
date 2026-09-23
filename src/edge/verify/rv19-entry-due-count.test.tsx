// @vitest-environment jsdom
/**
 * RV19 · 首页的「今日到期」必须与权威口径一致（2026-09-24 批七十新增）
 *
 * ## 为什么要这道闸
 *
 * `EntryPage` 的「今日到期」此前是**就地数排期**：
 * ```ts
 * data.schedules.filter((schedule) => new Date(schedule.nextReviewAt) <= new Date()).length
 * ```
 * 而全站其它地方的到期判定都走 `reviewService.getDueCards`。
 * 两者在**三种卡状态上不一致**（每个状态独立实测）：
 *
 * | status | 排期已过 | 就地数 | getDueCards |
 * |---|---|---|---|
 * | `new` | 是 | **1** | 0 |
 * | `mastered` | 是 | **1** | 0 |
 * | `suspended` | 是 | **1** | 0 |
 *
 * **后果是用户可见的自相矛盾**：用户真实数据（115 张卡全是 `new`、排期已过）下，
 * 首页显示「今日到期 **115**」，点进 `/today` 却显示「到期复习 **0**」。
 * 对一个刚导入词卡的用户，这是「数字明显不对」的第一印象。
 *
 * **为什么此前没被发现**：`EntryPage` **一个测试都没有**——
 * 全库搜 `EntryPage` 只在 `src/App.tsx` 的路由里出现一次。
 * 本闸同时补上「这个页面有测试」这件事。
 *
 * ## 判据纪律
 *
 * ⚠️ **必须用 `PAST_ISO` 而不是写死日期**：本闸第一版写死了
 * 一个「距今天 14 天」的 ISO 字面量（此处不重复写出，免得又被扫到），被仓库自己的时间炸弹扫描器
 *（`lg4-time-bomb-tests.test.ts`）抓出——**写死「近期日期」的测试会随真实日期流逝失效**：
 * 今天它距现在 14 天（算「排期已过」），几个月后它仍算过期、但已不是「近期」，
 * 而判据的本意是「排期已过」，与「近期」无关。用 `PAST_ISO`（2024-01-01）
 * 既表达「已过期」又不触发时间衰减风险。
 *
 * 只查**数字口径**（首页显示值 === `getDueCards().length`），
 * 不查文案、不查样式——那些会随产品调整，写死会让闸变成噪声源。
 */
import { describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import EntryPage from "../../pages/EntryPage";
import { getDueCards } from "../../services/reviewService";
import { PAST_ISO, makeAppData, seedAppData } from "./fixtures";
import type { AppData, Card, Schedule } from "../../types";

/**
 * 造一批指定状态的卡 + 已过期的排期。
 * 刻意让 `nextReviewAt` 落在过去——那正是「就地数排期」会误判的场景。
 */
const stateOf = (status: Card["status"], count: number): AppData => {
  const cards: Card[] = Array.from({ length: count }, (_, i) => ({
    id: `c-${status}-${i}`,
    type: "word",
    front: `word-${status}-${i}`,
    back: "释义",
    note: "",
    sourceId: "",
    tags: [],
    status,
    priority: false,
    createdAt: PAST_ISO,
    updatedAt: PAST_ISO
  }));
  const schedules: Schedule[] = cards.map((card) => ({
    cardId: card.id,
    easeFactor: 2.5,
    intervalDays: 1,
    reviewCount: 1,
    lapseCount: 0,
    nextReviewAt: PAST_ISO // 已过期
  }));
  return makeAppData({ cards, schedules }) as AppData;
};

/** 读出首页「今日到期」那个大数字。 */
const dueNumberOnPage = (data: AppData): number => {
  resetStorage();
  seedAppData(data);
  const page = mountPage(<EntryPage />, "/", "/");
  const text = page.text();
  page.unmount();
  // 页面结构：…<span>今日到期</span><strong>N</strong>
  const match = /今日到期\s*(\d+)/.exec(text.replace(/\s+/g, " "));
  expect(match, `首页应显示「今日到期 N」，实际文本：${text.slice(0, 120)}`).toBeTruthy();
  return Number(match![1]);
};

describe("RV19 首页的到期数字口径", () => {
  it("① 全是 new 卡且排期已过时：首页显示 0（不是 115）", () => {
    const data = stateOf("new", 115);
    expect(getDueCards(data).length, "权威口径：new 卡不算到期").toBe(0);
    expect(dueNumberOnPage(data), "首页必须与权威口径一致").toBe(0);
  });

  it("② mastered 卡排期已过：首页显示 0", () => {
    const data = stateOf("mastered", 20);
    expect(getDueCards(data).length).toBe(0);
    expect(dueNumberOnPage(data)).toBe(0);
  });

  it("③ suspended 卡排期已过：首页显示 0", () => {
    const data = stateOf("suspended", 5);
    expect(getDueCards(data).length).toBe(0);
    expect(dueNumberOnPage(data)).toBe(0);
  });

  it("④ review 卡排期已过：首页显示实际数量（这是真的到期）", () => {
    const data = stateOf("review", 7);
    expect(getDueCards(data).length).toBe(7);
    expect(dueNumberOnPage(data)).toBe(7);
  });

  it("⑤ 闸自检：判据能真的区分（new 与 review 的数字必须不同）", () => {
    const newOnly = dueNumberOnPage(stateOf("new", 10));
    const reviewOnly = dueNumberOnPage(stateOf("review", 10));
    // 同样是「10 张排期已过的卡」，只因状态不同，数字就该不同——
    // 若两者相等，说明口径又退回了「只数排期」
    expect(newOnly, "new 卡不该计入到期").toBe(0);
    expect(reviewOnly, "review 卡应计入到期").toBe(10);
    expect(newOnly, "两种状态的数字必须能区分").not.toBe(reviewOnly);
  });
});
