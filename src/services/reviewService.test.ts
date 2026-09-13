import { describe, expect, it } from "vitest";
import {
  applyReviewWithUndo,
  getDueCards,
  getLearningStats,
  getNewCardsForToday,
  getWeakCards,
  getWeakStats,
  markCardsPriority,
  undoReview
} from "./reviewService";
import { makeCard, makeReview, makeSchedule, makeTestData, makeWordCard } from "./testUtils";

describe("reviewService", () => {
  it("applies a review and can undo it", () => {
    const card = makeWordCard("card_1");
    const data = makeTestData({
      cards: [card],
      schedules: [
        {
          cardId: card.id,
          easeFactor: 2.5,
          intervalDays: 0,
          reviewCount: 0,
          lapseCount: 0,
          nextReviewAt: "2026-01-01T00:00:00.000Z"
        }
      ]
    });

    const reviewed = applyReviewWithUndo(data, card, "spelling", 1, "aproach", "[]");
    expect(reviewed.data.reviews).toHaveLength(1);
    expect(reviewed.data.schedules[0].lapseCount).toBe(1);

    const restored = undoReview(reviewed.data, reviewed.undo);
    expect(restored.reviews).toHaveLength(0);
    expect(restored.cards[0]).toEqual(card);
    expect(restored.schedules[0].reviewCount).toBe(0);
  });

  it("R13：进入 mastered 瞬间写入 masteredAt；保持/退出/撤销行为正确", () => {
    const card = { ...makeWordCard("card_1"), status: "review" as const };
    const data = makeTestData({
      cards: [card],
      schedules: [
        { cardId: card.id, easeFactor: 2.5, intervalDays: 3, reviewCount: 3, lapseCount: 0, nextReviewAt: "2026-01-01T00:00:00.000Z" }
      ]
    });

    // reviewCount 3+1=4 且 rating=4 → 转换 mastered，打点 masteredAt
    const mastered = applyReviewWithUndo(data, data.cards[0], "spelling", 4, "approach", "[]");
    const masteredCard = mastered.data.cards[0];
    expect(masteredCard.status).toBe("mastered");
    expect(masteredCard.masteredAt).toBeTruthy();

    // mastered 期间再复评：masteredAt 保持不变
    const again = applyReviewWithUndo(mastered.data, masteredCard, "spelling", 4, "approach", "[]");
    expect(again.data.cards[0].masteredAt).toBe(masteredCard.masteredAt);

    // 低分退出 mastered：masteredAt 清空
    const lapsed = applyReviewWithUndo(mastered.data, masteredCard, "spelling", 1, "wrong", "[]");
    expect(lapsed.data.cards[0].status).toBe("review");
    expect(lapsed.data.cards[0].masteredAt).toBeNull();

    // 撤销回到转换前：masteredAt 一并回滚
    const restored = undoReview(mastered.data, mastered.undo);
    expect(restored.cards[0].masteredAt ?? null).toBeNull();
  });

  it("R09 Step1：语法句子卡 rating3 间隔不放大；cloze 词卡口径不变（回归保护）", () => {
    // 语法句子卡：intervalDays=3, ease=2.5 → rating3 旧逻辑会放大到 8，新逻辑维持 3
    const grammarCard = makeCard({ id: "g1", type: "sentence", front: "Yesterday I went.", tags: ["语法"], status: "review" });
    const grammarData = makeTestData({
      cards: [grammarCard],
      schedules: [{ cardId: "g1", easeFactor: 2.5, intervalDays: 3, reviewCount: 2, lapseCount: 0, nextReviewAt: "2026-01-01T00:00:00.000Z" }]
    });
    const grammarResult = applyReviewWithUndo(grammarData, grammarCard, "cloze", 3, "went", "[]");
    expect(grammarResult.data.schedules[0].intervalDays).toBe(3); // 不放大，维持原间隔
    expect(grammarResult.data.schedules[0].easeFactor).toBe(2.5); // ease 不动

    // 同参数的 cloze 词卡（词汇）：维持旧的放大逻辑 3*2.5=7.5→8
    const wordCard = { ...makeWordCard("w1", "went", "去"), status: "review" as const };
    const wordData = makeTestData({
      cards: [wordCard],
      schedules: [{ cardId: "w1", easeFactor: 2.5, intervalDays: 3, reviewCount: 2, lapseCount: 0, nextReviewAt: "2026-01-01T00:00:00.000Z" }]
    });
    const wordResult = applyReviewWithUndo(wordData, wordCard, "spelling", 3, "went", "[]");
    expect(wordResult.data.schedules[0].intervalDays).toBe(8); // 旧逻辑不变

    // 语法卡 intervalDays=0 边界：不放大但也不小于 1
    const freshCard = makeCard({ id: "g2", type: "sentence", front: "I am happy.", tags: ["语法"], status: "review" });
    const freshData = makeTestData({
      cards: [freshCard],
      schedules: [{ cardId: "g2", easeFactor: 2.5, intervalDays: 0, reviewCount: 0, lapseCount: 1, nextReviewAt: "2026-01-01T00:00:00.000Z" }]
    });
    const freshResult = applyReviewWithUndo(freshData, freshCard, "cloze", 3, "happy", "[]");
    expect(freshResult.data.schedules[0].intervalDays).toBe(1);
  });

  it("returns due cards and marks priority in batches", () => {
    // R1 新口径：夹具使用 review 状态卡（新卡不再算到期）
    const data = makeTestData({
      cards: [
        makeWordCard("due"),
        makeWordCard("future", "future", "未来")
      ].map((card) => ({ ...card, status: "review" as const })),
      schedules: [
        { cardId: "due", easeFactor: 2.5, intervalDays: 0, reviewCount: 0, lapseCount: 0, nextReviewAt: "2020-01-01T00:00:00.000Z" },
        { cardId: "future", easeFactor: 2.5, intervalDays: 0, reviewCount: 0, lapseCount: 0, nextReviewAt: "2999-01-01T00:00:00.000Z" }
      ]
    });

    expect(getDueCards(data).map((card) => card.id)).toEqual(["due"]);
    expect(markCardsPriority(data, ["due"]).cards.find((card) => card.id === "due")?.priority).toBe(true);
  });

  it("excludes new and mastered cards from due cards even when their schedule is overdue", () => {
    const data = makeTestData({
      cards: [
        makeWordCard("new_card", "alpha", "甲"), // status: new（makeCard 默认）
        { ...makeWordCard("mastered_card", "beta", "乙"), status: "mastered" as const },
        { ...makeWordCard("review_card", "gamma", "丙"), status: "review" as const },
        { ...makeWordCard("learning_card", "delta", "丁"), status: "learning" as const },
        { ...makeWordCard("suspended_card", "epsilon", "戊"), status: "suspended" as const }
      ],
      schedules: ["new_card", "mastered_card", "review_card", "learning_card", "suspended_card"].map((cardId) =>
        makeSchedule({ cardId, nextReviewAt: "2020-01-01T00:00:00.000Z" })
      )
    });

    expect(getDueCards(data).map((card) => card.id)).toEqual(["review_card", "learning_card"]);
  });

  it("orders due cards by nextReviewAt ascending", () => {
    const data = makeTestData({
      cards: [
        { ...makeWordCard("later", "later", "后"), status: "review" as const },
        { ...makeWordCard("earlier", "earlier", "先"), status: "review" as const }
      ],
      schedules: [
        makeSchedule({ cardId: "later", nextReviewAt: "2020-06-01T00:00:00.000Z" }),
        makeSchedule({ cardId: "earlier", nextReviewAt: "2020-01-01T00:00:00.000Z" })
      ]
    });

    expect(getDueCards(data).map((card) => card.id)).toEqual(["earlier", "later"]);
  });

  it("returns new cards for today sorted by createdAt ascending and filtered by type", () => {
    const data = makeTestData({
      cards: [
        makeCard({ id: "newer", type: "word", front: "newer", createdAt: "2024-01-02T00:00:00.000Z" }),
        makeCard({ id: "older", type: "word", front: "older", createdAt: "2024-01-01T00:00:00.000Z" }),
        makeCard({ id: "sentence", type: "sentence", front: "A sentence.", createdAt: "2023-12-31T00:00:00.000Z" }),
        { ...makeWordCard("review_card", "gamma", "丙"), status: "review" as const, createdAt: "2023-01-01T00:00:00.000Z" }
      ]
    });

    expect(getNewCardsForToday(data, { type: "word" }).map((card) => card.id)).toEqual(["older", "newer"]);
    expect(getNewCardsForToday(data, { type: "sentence" }).map((card) => card.id)).toEqual(["sentence"]);
  });

  it("caps new cards by dailyNewWords minus words first-reviewed today", () => {
    const today = new Date().toISOString();
    const data = makeTestData({
      settings: { dailyNewWords: 3 },
      cards: [
        makeCard({ id: "n1", front: "n1", createdAt: "2024-01-01T00:00:00.000Z" }),
        makeCard({ id: "n2", front: "n2", createdAt: "2024-01-02T00:00:00.000Z" }),
        makeCard({ id: "n3", front: "n3", createdAt: "2024-01-03T00:00:00.000Z" }),
        // 今日已首评的单词（学完后进入 review 状态），应占掉 1 个新词配额
        { ...makeWordCard("learned", "learned", "已学"), status: "review" as const }
      ],
      reviews: [makeReview({ id: "r1", cardId: "learned", reviewedAt: today })]
    });

    // dailyNewWords=3，今日已学 1 个新词 → 今日还可混入 2 张新卡
    expect(getNewCardsForToday(data, { type: "word" }).map((card) => card.id)).toEqual(["n1", "n2"]);
  });

  it("returns no new cards when today's new-word quota is exhausted", () => {
    const today = new Date().toISOString();
    const data = makeTestData({
      settings: { dailyNewWords: 1 },
      cards: [
        makeCard({ id: "n1", front: "n1" }),
        { ...makeWordCard("learned", "learned", "已学"), status: "review" as const }
      ],
      reviews: [makeReview({ id: "r1", cardId: "learned", reviewedAt: today })]
    });

    expect(getNewCardsForToday(data, { type: "word" })).toEqual([]);
  });

  it("honors an explicit limit and caps sentence new cards by dailySentences", () => {
    const data = makeTestData({
      settings: { dailyNewWords: 10, dailySentences: 2 },
      cards: [
        makeCard({ id: "n1", front: "n1", createdAt: "2024-01-01T00:00:00.000Z" }),
        makeCard({ id: "n2", front: "n2", createdAt: "2024-01-02T00:00:00.000Z" }),
        makeCard({ id: "n3", front: "n3", createdAt: "2024-01-03T00:00:00.000Z" }),
        makeCard({ id: "s1", type: "sentence", front: "S1.", createdAt: "2024-01-01T00:00:00.000Z" }),
        makeCard({ id: "s2", type: "sentence", front: "S2.", createdAt: "2024-01-02T00:00:00.000Z" }),
        makeCard({ id: "s3", type: "sentence", front: "S3.", createdAt: "2024-01-03T00:00:00.000Z" })
      ]
    });

    expect(getNewCardsForToday(data, { type: "word", limit: 1 }).map((card) => card.id)).toEqual(["n1"]);
    expect(getNewCardsForToday(data, { type: "sentence" }).map((card) => card.id)).toEqual(["s1", "s2"]);
  });
});

describe("getLearningStats 薄弱词滑动口径（R2）", () => {
  const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const reviewCard = (id: string) => ({ ...makeWordCard(id, id, id), status: "review" as const });

  it("30 天前错一次、此后连续正确的词不再计入薄弱词", () => {
    const data = makeTestData({
      cards: [reviewCard("card_1")],
      schedules: [makeSchedule({ cardId: "card_1", lapseCount: 1 })], // 历史 lapse 不参与滑动口径
      reviews: [
        makeReview({ id: "r_wrong", cardId: "card_1", rating: 1, reviewedAt: daysAgo(30) }),
        ...Array.from({ length: 10 }, (_, index) =>
          makeReview({ id: `r_ok_${index}`, cardId: "card_1", rating: 4, reviewedAt: daysAgo(13 - index) })
        )
      ]
    });

    expect(getLearningStats(data).weakWords).toBe(0);
  });

  it("最近一次复习为低分的词计入薄弱词", () => {
    const data = makeTestData({
      cards: [reviewCard("card_1")],
      schedules: [makeSchedule({ cardId: "card_1" })],
      reviews: [
        makeReview({ id: "r_ok", cardId: "card_1", rating: 4, reviewedAt: daysAgo(2) }),
        makeReview({ id: "r_wrong", cardId: "card_1", rating: 2, reviewedAt: daysAgo(1) })
      ]
    });

    expect(getLearningStats(data).weakWords).toBe(1);
  });

  it("近 14 天内有低分（即使最近一次已答对）仍计入薄弱词", () => {
    const data = makeTestData({
      cards: [reviewCard("card_1")],
      schedules: [makeSchedule({ cardId: "card_1" })],
      reviews: [
        makeReview({ id: "r_wrong", cardId: "card_1", rating: 2, reviewedAt: daysAgo(3) }),
        makeReview({ id: "r_ok", cardId: "card_1", rating: 4, reviewedAt: daysAgo(1) })
      ]
    });

    expect(getLearningStats(data).weakWords).toBe(1);
  });

  it("priority 标记的卡始终计入薄弱词； suspended 卡不计入", () => {
    const data = makeTestData({
      cards: [
        { ...reviewCard("priority_card"), priority: true },
        { ...makeWordCard("suspended_card", "sus", "停"), status: "suspended" as const }
      ],
      schedules: [
        makeSchedule({ cardId: "priority_card" }),
        makeSchedule({ cardId: "suspended_card" })
      ],
      reviews: [
        makeReview({ id: "r1", cardId: "priority_card", rating: 4, reviewedAt: daysAgo(1) }),
        makeReview({ id: "r2", cardId: "suspended_card", rating: 1, reviewedAt: daysAgo(1) })
      ]
    });

    const stats = getLearningStats(data);
    expect(stats.weakCards).toBe(1);
    expect(stats.weakWords).toBe(1);
  });
});

describe("R6/R12 口径：wrongCards 窗口与 prioritySource 拆分", () => {
  const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const reviewCard = (id: string) => ({ ...makeWordCard(id, id, id), status: "review" as const });

  it("wrongCards 只计近 14 天低分卡，终身累计保留在 wrongCardsLifetime", () => {
    const data = makeTestData({
      cards: [reviewCard("old_wrong"), reviewCard("recent_wrong")],
      schedules: [makeSchedule({ cardId: "old_wrong" }), makeSchedule({ cardId: "recent_wrong" })],
      reviews: [
        makeReview({ id: "r1", cardId: "old_wrong", rating: 1, reviewedAt: daysAgo(30) }),
        makeReview({ id: "r2", cardId: "recent_wrong", rating: 2, reviewedAt: daysAgo(2) })
      ]
    });

    const stats = getLearningStats(data);
    expect(stats.wrongCards).toBe(1);
    expect(stats.wrongCardsLifetime).toBe(2);
  });

  it("lapseCount 达到 3 时算法自动置位 prioritySource=system", () => {
    const card = { ...makeWordCard("card_1"), status: "review" as const };
    let data = makeTestData({
      cards: [card],
      schedules: [makeSchedule({ cardId: "card_1", lapseCount: 2 })]
    });

    const reviewed = applyReviewWithUndo(data, data.cards[0], "spelling", 1, "wrong", "[]");
    const next = reviewed.data.cards[0];
    expect(next.priority).toBe(true);
    expect(next.prioritySource).toBe("system");
  });

  it("手动标星（manual）在 lapseCount 增长时不被覆盖为 system", () => {
    const card = {
      ...makeWordCard("card_1"),
      status: "review" as const,
      priority: true,
      prioritySource: "manual" as const
    };
    const data = makeTestData({
      cards: [card],
      schedules: [makeSchedule({ cardId: "card_1", lapseCount: 2 })]
    });

    const reviewed = applyReviewWithUndo(data, data.cards[0], "spelling", 1, "wrong", "[]");
    const next = reviewed.data.cards[0];
    expect(next.priority).toBe(true);
    expect(next.prioritySource).toBe("manual");
  });

  it("priorityManual / prioritySystem 计数拆分", () => {
    const data = makeTestData({
      cards: [
        { ...reviewCard("manual"), priority: true, prioritySource: "manual" as const },
        { ...reviewCard("system"), priority: true, prioritySource: "system" as const },
        { ...reviewCard("lapsed"), priority: false },
        reviewCard("plain")
      ],
      schedules: [
        makeSchedule({ cardId: "manual" }),
        makeSchedule({ cardId: "system" }),
        makeSchedule({ cardId: "lapsed", lapseCount: 5 }),
        makeSchedule({ cardId: "plain" })
      ]
    });

    const stats = getLearningStats(data);
    expect(stats.priorityManual).toBe(1);
    // R2 口径修正：prioritySystem = priority 且非 manual；历史 lapse≥3 但未置位的卡（lapsed）不再兜底计入。
    expect(stats.prioritySystem).toBe(1);
  });
});

describe("getWeakCards 权威口径（R2）", () => {
  const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const reviewCard = (id: string) => ({ ...makeWordCard(id, id, id), status: "review" as const });

  it("getLearningStats.weakWords 与 getWeakCards 过滤 word 后数量一致（同源回归）", () => {
    const data = makeTestData({
      cards: [
        { ...reviewCard("priority_card"), priority: true },
        reviewCard("wrong_word"),
        { ...makeCard({ id: "wrong_sentence", type: "sentence", front: "I has a pen.", status: "review" }) },
        reviewCard("plain")
      ],
      schedules: [
        makeSchedule({ cardId: "priority_card" }),
        makeSchedule({ cardId: "wrong_word" }),
        makeSchedule({ cardId: "wrong_sentence" }),
        makeSchedule({ cardId: "plain" })
      ],
      reviews: [
        makeReview({ id: "r1", cardId: "wrong_word", rating: 2, reviewedAt: daysAgo(1) }),
        makeReview({ id: "r2", cardId: "wrong_sentence", rating: 1, reviewedAt: daysAgo(1) }),
        makeReview({ id: "r3", cardId: "plain", rating: 4, reviewedAt: daysAgo(1) })
      ]
    });

    const weakCards = getWeakCards(data);
    expect(weakCards.map((card) => card.id).sort()).toEqual(["priority_card", "wrong_sentence", "wrong_word"]);
    expect(getLearningStats(data).weakCards).toBe(weakCards.length);
    expect(getLearningStats(data).weakWords).toBe(weakCards.filter((card) => card.type === "word").length);
  });

  it("getWeakStats.weakWords 委托权威口径，与 getLearningStats 一致", () => {
    const data = makeTestData({
      cards: [{ ...reviewCard("priority_card"), priority: true }, reviewCard("recent_wrong")],
      schedules: [makeSchedule({ cardId: "priority_card" }), makeSchedule({ cardId: "recent_wrong" })],
      reviews: [makeReview({ id: "r1", cardId: "recent_wrong", rating: 2, reviewedAt: daysAgo(2) })]
    });

    expect(getWeakStats(data).weakWords).toBe(getLearningStats(data).weakWords);
  });
});

describe("priority 康复摘星（R2）", () => {
  const systemPriorityCard = () => ({
    ...makeWordCard("card_1"),
    status: "review" as const,
    priority: true,
    prioritySource: "system" as const
  });
  const makeDataWith = (
    card: Omit<ReturnType<typeof systemPriorityCard>, "prioritySource"> & { prioritySource?: "system" | "manual" },
    lapseCount = 3
  ) => makeTestData({ cards: [card], schedules: [makeSchedule({ cardId: card.id, lapseCount })] });

  it("系统置位 priority 连续 2 次 rating>=3 后自动摘除且清 prioritySource（undo 可回滚）", () => {
    const data = makeDataWith(systemPriorityCard());

    const first = applyReviewWithUndo(data, data.cards[0], "spelling", 3, "approach", "[]");
    expect(first.data.cards[0].priority).toBe(true); // 第 1 次不摘
    expect(first.data.schedules[0].recoveryCount).toBe(1);

    const second = applyReviewWithUndo(first.data, first.data.cards[0], "spelling", 3, "approach", "[]");
    expect(second.data.cards[0].priority).toBe(false);
    expect(second.data.cards[0].prioritySource).toBeUndefined();
    expect(second.data.schedules[0].recoveryCount).toBe(0);

    // undo 回归：previousSchedule 整体恢复，recoveryCount 快照一并回滚
    const restored = undoReview(second.data, second.undo);
    expect(restored.cards[0].priority).toBe(true);
    expect(restored.cards[0].prioritySource).toBe("system");
    expect(restored.schedules[0].recoveryCount).toBe(1);
  });

  it("仅 1 次 rating>=3 不摘除（recoveryCount=1）", () => {
    const data = makeDataWith(systemPriorityCard());

    const reviewed = applyReviewWithUndo(data, data.cards[0], "spelling", 4, "approach", "[]");
    expect(reviewed.data.cards[0].priority).toBe(true);
    expect(reviewed.data.cards[0].prioritySource).toBe("system");
    expect(reviewed.data.schedules[0].recoveryCount).toBe(1);
  });

  it("两次正确中间夹一次 rating<=2，计数清零重新累计", () => {
    const data = makeDataWith(systemPriorityCard());

    const ok1 = applyReviewWithUndo(data, data.cards[0], "spelling", 3, "approach", "[]");
    expect(ok1.data.schedules[0].recoveryCount).toBe(1);

    const wrong = applyReviewWithUndo(ok1.data, ok1.data.cards[0], "spelling", 2, "aprach", "[]");
    expect(wrong.data.cards[0].priority).toBe(true);
    expect(wrong.data.schedules[0].recoveryCount).toBe(0); // 清零重来

    const ok2 = applyReviewWithUndo(wrong.data, wrong.data.cards[0], "spelling", 3, "approach", "[]");
    expect(ok2.data.schedules[0].recoveryCount).toBe(1); // 重新累计，不是 3
    expect(ok2.data.cards[0].priority).toBe(true);
  });

  it("manual 标星连续正确也不摘除", () => {
    const card = { ...systemPriorityCard(), prioritySource: "manual" as const };
    const data = makeDataWith(card, 0);

    const first = applyReviewWithUndo(data, data.cards[0], "spelling", 4, "approach", "[]");
    const second = applyReviewWithUndo(first.data, first.data.cards[0], "spelling", 4, "approach", "[]");

    expect(second.data.cards[0].priority).toBe(true);
    expect(second.data.cards[0].prioritySource).toBe("manual");
    expect(second.data.schedules[0].recoveryCount).toBeUndefined(); // manual 卡不维护该字段
  });

  it("legacy 无 prioritySource 的系统卡参与康复（与 ?? \"system\" 语义一致）", () => {
    const card = { ...systemPriorityCard(), prioritySource: undefined };
    const data = makeDataWith(card, 0);

    const first = applyReviewWithUndo(data, data.cards[0], "spelling", 3, "approach", "[]");
    const second = applyReviewWithUndo(first.data, first.data.cards[0], "spelling", 3, "approach", "[]");

    expect(second.data.cards[0].priority).toBe(false);
  });

  it("康复摘星后该词（无近期低分）退出 getWeakCards", () => {
    const data = makeDataWith(systemPriorityCard(), 0);
    expect(getWeakCards(data).map((card) => card.id)).toEqual(["card_1"]); // priority 计入

    const first = applyReviewWithUndo(data, data.cards[0], "spelling", 3, "approach", "[]");
    const second = applyReviewWithUndo(first.data, first.data.cards[0], "spelling", 3, "approach", "[]");

    // 摘星且无近期低分/最近低分 → 不再是薄弱词
    expect(getWeakCards(second.data)).toEqual([]);
    expect(getLearningStats(second.data).weakWords).toBe(0);
  });

  it("摘星后再次答对不被历史 lapseCount 重新置位（R2 回归）", () => {
    // lapseCount=3（终身累计保留），两次 rating=3 摘星后，第三次答对不得复位
    const data = makeDataWith(systemPriorityCard(), 3);
    const first = applyReviewWithUndo(data, data.cards[0], "spelling", 3, "approach", "[]");
    const second = applyReviewWithUndo(first.data, first.data.cards[0], "spelling", 3, "approach", "[]");
    expect(second.data.cards[0].priority).toBe(false); // 已摘星

    const third = applyReviewWithUndo(second.data, second.data.cards[0], "spelling", 3, "approach", "[]");
    expect(third.data.cards[0].priority).toBe(false); // 不被历史 lapse 算回
    expect(third.data.cards[0].prioritySource).toBeUndefined(); // 不出现 priority=false + source 脏数据
  });

  it("摘星后新的 lapse（rating=1 且累计≥3）重新置位且 source=system（R2 回归）", () => {
    const data = makeDataWith(systemPriorityCard(), 3);
    const first = applyReviewWithUndo(data, data.cards[0], "spelling", 3, "approach", "[]");
    const second = applyReviewWithUndo(first.data, first.data.cards[0], "spelling", 3, "approach", "[]");
    expect(second.data.cards[0].priority).toBe(false);

    const lapsed = applyReviewWithUndo(second.data, second.data.cards[0], "spelling", 1, "aprach", "[]");
    expect(lapsed.data.cards[0].priority).toBe(true); // 新 lapse 重新进系统关注
    expect(lapsed.data.cards[0].prioritySource).toBe("system");
    expect(lapsed.data.schedules[0].lapseCount).toBe(4);
  });
});
