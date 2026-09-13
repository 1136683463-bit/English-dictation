import { describe, expect, it } from "vitest";
import { applyReviewWithUndo } from "./reviewService";
import { makeSchedule, makeTestData, makeWordCard } from "./testUtils";

// QA 对抗补充测试（T2/R2 康复摘星）——不改业务源码，只固定行为。
// 场景：系统置位卡（lapseCount=3）连续 2 次 rating>=3 摘星后，继续复习会发生什么。
// 关注点是 reviewService.ts:457 的 `lapseCount >= 3 || card.priority` 终身累计兜底
// 是否会让刚摘的星在下一次复习时被立即算回。

const makeRecoveredState = () => {
  const card = {
    ...makeWordCard("card_1"),
    status: "review" as const,
    priority: true,
    prioritySource: "system" as const
  };
  const data = makeTestData({
    cards: [card],
    schedules: [makeSchedule({ cardId: card.id, lapseCount: 3 })]
  });
  const first = applyReviewWithUndo(data, data.cards[0], "spelling", 3, "approach", "[]");
  const second = applyReviewWithUndo(first.data, first.data.cards[0], "spelling", 3, "approach", "[]");
  // 前置条件：此刻已摘星
  expect(second.data.cards[0].priority).toBe(false);
  expect(second.data.cards[0].prioritySource).toBeUndefined();
  expect(second.data.schedules[0].lapseCount).toBe(3); // 终身累计保留
  return second.data;
};

describe("QA 对抗：摘星后的再置位行为（R2）", () => {
  it("摘星后再次 rating=3（答对）不应立即重新置位 priority", () => {
    const recovered = makeRecoveredState();

    const third = applyReviewWithUndo(recovered, recovered.cards[0], "spelling", 3, "approach", "[]");

    // 期望：答对不应让刚康复的卡重新进系统关注
    expect(third.data.cards[0].priority).toBe(false);
    expect(third.data.cards[0].prioritySource).toBeUndefined();
  });

  it("摘星后 rating=1（新 lapse）重新置位 prioritySource=system", () => {
    const recovered = makeRecoveredState();

    const lapsed = applyReviewWithUndo(recovered, recovered.cards[0], "spelling", 1, "aprach", "[]");

    // 新 lapse（lapseCount 3→4）重新进系统关注是设计明确保留的行为
    expect(lapsed.data.schedules[0].lapseCount).toBe(4);
    expect(lapsed.data.cards[0].priority).toBe(true);
    expect(lapsed.data.cards[0].prioritySource).toBe("system");
  });
});
