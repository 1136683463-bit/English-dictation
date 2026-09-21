// @vitest-environment jsdom
/**
 * SM-2 审计 · P0 崩溃的**可达性边界**（决定严重度定级）。
 *
 * sm1b 已证明：`/review?cards=<id>` 定向训练下连点 14 次「熟练」必崩。
 * 这里反过来验证：**默认**到期队列下同一张卡评一次就离开队列，
 * 因此崩溃需要「同一张卡被反复评分」的前置条件 —— 而项目有三条这样的入口：
 *   ① 词库详情页「练这张」（LibraryPage.tsx:1052 → /review?cards=<id>）
 *   ② 错词本「练这几个词」（MistakeBookPage → /spelling?cards=...）
 *   ③ 全量复刷（scope=all，mastered 也入场）
 * 结论：不是「每天正常复习就会崩」，是「定向重练同一张卡会崩」。严重度仍为 P0（整页崩溃、
 * 数据卡死、无 ErrorBoundary），但触发需要用户进入定向练习。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import ReviewPage from "../../pages/ReviewPage";
import { makeAppData, readAppData, seedAppData } from "./fixtures";
import { clickButtonContaining, flushAsync } from "./drive";

const seedOneCard = () =>
  seedAppData(
    makeAppData({
      cards: [
        {
          id: "w1",
          type: "word",
          front: "approach",
          back: "方法",
          note: "",
          tags: [],
          status: "review",
          priority: false,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z"
        }
      ],
      schedules: [
        {
          cardId: "w1",
          easeFactor: 2.5,
          intervalDays: 0,
          reviewCount: 0,
          lapseCount: 0,
          nextReviewAt: "2024-01-01T00:00:00.000Z"
        }
      ]
    })
  );

describe("SM7 P0 可达性边界", () => {
  beforeEach(() => resetStorage());

  it("【定向】?cards=w1：同一张卡连点「熟练」16 次，评分持续生效、无异常（P0 已修 2026-09-21）", async () => {
    seedOneCard();
    const uncaught: Error[] = [];
    const onError = (event: ErrorEvent) => uncaught.push(event.error ?? new Error(event.message));
    window.addEventListener("error", onError);

    const page = mountPage(<ReviewPage />, "/review?cards=w1", "/review");
    for (let round = 1; round <= 16; round += 1) {
      clickButtonContaining(page, "熟练");
      await flushAsync();
    }
    window.removeEventListener("error", onError);

    const schedule = readAppData().schedules[0];
    // 修复前：第 14 次 addDays 溢出 Date 范围抛 RangeError，此后每次点击都抛同一错，
    // reviewCount 停在 13。现在间隔被夹在 MAX_INTERVAL_DAYS 内，16 次全部生效。
    expect(uncaught.length, `不应有未捕获异常：${uncaught.map((item) => item.message).join(" | ")}`).toBe(0);
    expect(schedule.reviewCount, "16 次评分都应生效").toBe(16);
    expect(schedule.intervalDays).toBeLessThanOrEqual(3650);
  });

  it("【默认】无 ?cards 参数：评一次即离开到期队列，几乎不可能撞到溢出", async () => {
    seedOneCard();
    const uncaught: Error[] = [];
    const onError = (event: ErrorEvent) => uncaught.push(event.error ?? new Error(event.message));
    window.addEventListener("error", onError);

    const page = mountPage(<ReviewPage />, "/review", "/review");
    clickButtonContaining(page, "熟练");
    await flushAsync();

    const afterFirst = readAppData();
    console.log("SM7 默认模式：首次评分后 intervalDays =", afterFirst.schedules[0].intervalDays);
    expect(uncaught).toHaveLength(0);
    expect(afterFirst.schedules[0].intervalDays).toBe(3);

    // 队列里已没有可评分的卡（按钮消失）→ 同一张卡无法被反复评分
    const ratingButtons = page.buttons().filter((label) => /^(1|2|3|4)/.test(label));
    console.log("SM7 默认模式：第二次可用的评分按钮 =", JSON.stringify(ratingButtons));
    expect(ratingButtons.filter((label) => label.includes("熟练"))).toHaveLength(0);
  });
});
