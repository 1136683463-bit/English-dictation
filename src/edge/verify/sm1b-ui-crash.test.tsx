// @vitest-environment jsdom
/**
 * SM-2 审计 · 第 1 条补充：P0 崩溃的**用户可达性**验证。
 *
 * sm1 已证明纯函数层面连续 rating4 到第 14 次会抛 RangeError。
 * 这里验证用户真的能走到那一步：ReviewPage 的 4 个评分按钮（键盘 1/2/3/4 亦可），
 * 点「熟练」14 次即触发；项目无 ErrorBoundary（见 p4-revisit.test.tsx:197），
 * 抛错会打断整个 React 渲染。
 *
 * 走定向训练 `?cards=<id>` 入口，一张卡可以反复评分（spell 队列在 limit 内不会耗尽）。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import ReviewPage from "../../pages/ReviewPage";
import { makeAppData, readAppData, seedAppData } from "./fixtures";
import { clickButtonContaining, flushAsync } from "./drive";

describe("SM1-g [P0 已修 2026-09-21] ReviewPage 连点「熟练」20 次不再崩溃", () => {
  beforeEach(() => resetStorage());

  it("单卡定向训练：连续 20 次 rating=4 每次都生效、无异常、间隔停在上限", async () => {
    seedAppData(
      makeAppData({
        cards: [
          {
            id: "card-hot",
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
            cardId: "card-hot",
            easeFactor: 2.5,
            intervalDays: 0,
            reviewCount: 0,
            lapseCount: 0,
            nextReviewAt: "2024-01-01T00:00:00.000Z"
          }
        ]
      })
    );

    // React 18 在事件回调里抛出的错误经 reportError 上报，不会回传给调用 click() 的代码，
    // 所以用 window error 监听捕获（jsdom 会派发 error 事件）。
    const uncaught: Error[] = [];
    const onError = (event: ErrorEvent) => uncaught.push(event.error ?? new Error(event.message));
    window.addEventListener("error", onError);

    const page = mountPage(<ReviewPage />, "/review?cards=card-hot", "/review");
    const trail: Array<{ round: number; intervalDays: number; reviewCount: number }> = [];

    for (let attempt = 1; attempt <= 20; attempt += 1) {
      clickButtonContaining(page, "熟练");
      await flushAsync();
      const schedule = readAppData().schedules[0];
      trail.push({ round: attempt, intervalDays: schedule.intervalDays, reviewCount: schedule.reviewCount });
    }
    window.removeEventListener("error", onError);

    console.log(
      "SM1-g 每次点击后的落盘状态:",
      trail.map((item) => `#${item.round} i=${item.intervalDays} rc=${item.reviewCount}`).join("  ")
    );
    console.log("SM1-g 捕获到的未处理异常:", uncaught.map((error) => `${error.constructor.name}: ${error.message}`).join(" | "));

    const schedule = readAppData().schedules[0];
    /**
     * 修复前：第 14 次 `addDays` 溢出 Date 范围抛 RangeError，
     * 该次评分完全没生效，而且后续 7 次点击都被同一个错误吞掉（卡死在复习页）——
     * 表现为 reviewCount 停在 13、intervalDays 定格 57502407 天。
     * 现在间隔被夹在 MAX_INTERVAL_DAYS（10 年）内，20 次点击全部生效。
     */
    expect(uncaught, `不应有未捕获异常：${uncaught.map((error) => error.message).join(" | ")}`).toEqual([]);
    expect(schedule.reviewCount, "20 次评分都应生效").toBe(20);
    expect(schedule.intervalDays, "间隔停在上限内").toBeLessThanOrEqual(3650);
    expect(Number.isNaN(new Date(schedule.nextReviewAt).getTime()), "到期时间有效").toBe(false);
    // 后半程不再变化（已到上限），但每次点击都仍然记了一次复习
    expect(trail.slice(19).every((item) => item.reviewCount === 20)).toBe(true);
  });
});
