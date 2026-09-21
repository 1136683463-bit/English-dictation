// @vitest-environment node
/**
 * RV3 · 「排进今日复习」必须真的排得进去（2026-09-21 修）
 *
 * 弱点卡片的「排进今日复习」按钮只写 nextReviewAt，但语法复习会话排除
 * intervalDays === 0 的卡（「从未进过复习队列」的标记）。对一张刚入队、
 * 还没复习过的新卡点击后，按钮显示「已排进今日复习」，复习页却一张都不出——
 * 承诺与实现相反。
 */
import { describe, expect, it } from "vitest";
import { createInitialSchedule } from "../../services/reviewService";
import { scheduleCardsForToday } from "../../services/grammarWeakSpotsService";
import { buildGrammarReviewSession } from "../../services/grammarReviewService";
import type { AppData, Card } from "../../types";

const card = (id: string): Card =>
  ({
    id,
    type: "sentence",
    front: `Sentence ${id}.`,
    back: "x",
    note: "",
    tags: ["语法"],
    status: "review",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  }) as Card;

const base = (schedules: AppData["schedules"]) =>
  ({ cards: schedules.map((item) => card(item.cardId)), schedules, reviews: [], sentenceDetails: [] }) as unknown as AppData;

describe("RV3 排进今日复习的兑现", () => {
  it("刚入队（intervalDays=0）的卡：点击后必须出现在复习会话里", () => {
    const data = base([createInitialSchedule("c1")]);
    const queued = scheduleCardsForToday(data, ["c1"]);
    expect(buildGrammarReviewSession(queued).length, "承诺了今日复习就要出得来").toBe(1);
  });

  it("已有正常间隔（20 天）的卡：排到今日，且不被压回 1 天", () => {
    const data = base([{ ...createInitialSchedule("c2"), intervalDays: 20 }]);
    const queued = scheduleCardsForToday(data, ["c2"]);
    expect(queued.schedules[0].intervalDays, "不应把已排远的卡压回 1 天").toBe(20);
    expect(buildGrammarReviewSession(queued).length).toBe(1);
  });

  it("未指定的卡不受影响", () => {
    const data = base([createInitialSchedule("c1"), createInitialSchedule("c3")]);
    const queued = scheduleCardsForToday(data, ["c1"]);
    expect(queued.schedules.find((item) => item.cardId === "c3")?.intervalDays).toBe(0);
  });

  it("空 id 列表不产生任何改动", () => {
    const data = base([createInitialSchedule("c1")]);
    expect(scheduleCardsForToday(data, [])).toBe(data);
    expect(scheduleCardsForToday(data, ["", ""])).toBe(data);
  });
});
