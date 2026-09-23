// @vitest-environment jsdom
/**
 * LG3 · 配额耗尽时的降级行为（2026-09-22）
 *
 * 长期使用（约 14~18 个月）会撞到 localStorage 的 5MB 上限。
 * 这是**必然会发生**的状态，不是异常——所以真正要验证的是：
 * 撞上之后用户还能不能继续用、数据会不会丢、有没有被告知。
 *
 * 已确认的三条保证（本文件固定下来）：
 *  ① 写入失败不抛错、不白屏（应用仍可用；上一轮加的 `saveError` 通道 + catch 兜底）
 *  ② 失败时**不破坏已有数据**（磁盘上仍是上一个好版本，不会写坏）
 *  ③ 遥测写入失败不波及主数据（遥测失败是静默的，绝不能挤压学习数据）
 */
import { beforeEach, describe, expect, it } from "vitest";
import { resetStorage } from "../harness";
import { loadData, saveData, nowIso } from "../../services/storage";
import { appendGrammarEvent } from "../../services/grammarTelemetry";
import { makeAppData, makeSentenceCard, cardsToData } from "./fixtures";

/** 占满配额：写入一个接近上限的大字符串。 */
const fillQuota = () => {
  const chunk = "x".repeat(256 * 1024);
  let written = 0;
  for (let i = 0; i < 40; i += 1) {
    try {
      window.localStorage.setItem(`fill-${i}`, chunk);
      written += 1;
    } catch {
      break;
    }
  }
  return written;
};

describe("LG3 配额耗尽时的降级", () => {
  beforeEach(() => resetStorage());

  it("已有数据在写入失败时保持完好（不会写坏）", () => {
    const good = makeAppData({
      ...cardsToData([makeSentenceCard({ id: "keep", sentence: "Keep me.", schedule: { reviewCount: 2, intervalDays: 3, nextReviewAt: "2024-01-01T00:00:00.000Z" } })])
    });
    saveData(good);
    const before = window.localStorage.getItem("personal-vocab-app-data-v1");
    expect(before, "前置：数据已写入").toBeTruthy();

    fillQuota();
    // 再存一份更大的数据 —— 应失败，但**不能破坏**已有内容
    const bigger = makeAppData({
      ...cardsToData(Array.from({ length: 400 }, (_, i) => makeSentenceCard({ id: `c${i}`, sentence: `Long sentence number ${i} padded with more words to consume space.`, schedule: { reviewCount: 2, intervalDays: 3, nextReviewAt: "2024-01-01T00:00:00.000Z" } })))
    });
    expect(() => saveData(bigger), "写入失败应是可捕获的异常（由 commitData 捕获并提示）").toThrow();

    const after = window.localStorage.getItem("personal-vocab-app-data-v1");
    expect(after, "写入失败后，磁盘上仍是上一个好版本").toBe(before);
  });

  it("写入失败后 loadData 仍能读回完好数据（应用可继续用）", () => {
    const good = makeAppData({
      ...cardsToData([makeSentenceCard({ id: "keep", sentence: "Keep me.", schedule: { reviewCount: 2, intervalDays: 3, nextReviewAt: "2024-01-01T00:00:00.000Z" } })])
    });
    saveData(good);
    fillQuota();
    const loaded = loadData();
    expect(loaded.cards.length, "应能读回数据").toBeGreaterThan(0);
    expect(loaded.cards[0].front, "内容完好").toBe("Keep me.");
  });

  it("遥测写入失败不挤压主数据", () => {
    const good = makeAppData({
      ...cardsToData([makeSentenceCard({ id: "keep", sentence: "Keep me.", schedule: { reviewCount: 2, intervalDays: 3, nextReviewAt: "2024-01-01T00:00:00.000Z" } })])
    });
    saveData(good);
    const before = window.localStorage.getItem("personal-vocab-app-data-v1");
    fillQuota();

    // 灌遥测直到失败（失败是静默的，不抛）
    for (let i = 0; i < 3200; i += 1) {
      appendGrammarEvent({
        kind: "lesson_step_result", lessonId: "x", section: "guided", stepKind: "choose",
        stepIndex: i % 6, misses: 0, passed: true, ts: nowIso()
      } as never);
    }
    expect(
      window.localStorage.getItem("personal-vocab-app-data-v1"),
      "遥测写满也不应影响主数据"
    ).toBe(before);
  }, 120000);

  it("配额满时页面仍能挂载（不白屏）", async () => {
    const { mountPage } = await import("../harness");
    const GrammarPathPage = (await import("../../pages/GrammarPathPage")).default;
    const good = makeAppData({
      ...cardsToData([makeSentenceCard({ id: "keep", sentence: "Keep me.", schedule: { reviewCount: 2, intervalDays: 3, nextReviewAt: "2024-01-01T00:00:00.000Z" } })])
    });
    saveData(good);
    fillQuota();
    expect(() => mountPage(<GrammarPathPage />, "/grammar", "/grammar"), "配额满不应导致白屏").not.toThrow();
  });
});
