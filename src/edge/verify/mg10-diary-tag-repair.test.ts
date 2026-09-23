// @vitest-environment node
/**
 * MG10 · 存量日记卡补「语法」标签（2026-09-22 修，P1）
 *
 * 背景：`addDiarySentenceToReview` 早期写入的 tags 只有 `"日记"`，
 * 而语法复习队列的筛选条件是 `card.tags.includes("语法")`。
 * 于是那段时间从日记入队的句子卡**从未进过语法复习队列**，
 * 且标签不会自己长出来——用户的「已掌握 N / 共 M 句」分母偏小、掌握度偏乐观。
 * （用 git 可确证：该标签在 af1b9f1 之前一直是 `"日记"`。）
 */
import { describe, expect, it } from "vitest";
import { repairDiaryCardTags } from "../../services/lessonService";
import { listDueGrammarReviewCards, summarizeGrammarMastery } from "../../services/grammarReviewService";
import type { AppData, Card } from "../../types";

const diaryCard = (id: string, tags: string[]): Card =>
  ({
    id,
    type: "sentence",
    front: "I am happy today.",
    back: "",
    note: "我的英文日记 · 2024-01-01",
    sourceId: `diary:${id}`,
    tags,
    status: "review",
    priority: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  }) as Card;

const dataWith = (cards: Card[]): AppData =>
  ({
    cards,
    schedules: cards.map((card) => ({
      cardId: card.id,
      easeFactor: 2.5,
      intervalDays: 3,
      reviewCount: 2,
      lapseCount: 0,
      nextReviewAt: "2024-01-01T00:00:00.000Z"
    })),
    reviews: [],
    sentenceDetails: []
  }) as unknown as AppData;

describe("MG10 日记卡标签补全", () => {
  it("只有「日记」标签的存量卡会被补上「语法」", () => {
    const before = dataWith([diaryCard("d1", ["日记"])]);
    expect(listDueGrammarReviewCards(before), "补之前：语法队列看不到它").toHaveLength(0);
    expect(summarizeGrammarMastery(before).total, "补之前：不在掌握统计的分母里").toBe(0);

    const { data: after, repaired } = repairDiaryCardTags(before);
    expect(repaired).toBe(1);
    expect(after.cards[0].tags).toContain("语法");
    expect(after.cards[0].tags, "原有标签要保留").toContain("日记");
    expect(listDueGrammarReviewCards(after), "补之后：进入语法队列").toHaveLength(1);
    expect(summarizeGrammarMastery(after).total, "补之后：进入掌握统计").toBe(1);
  });

  it("幂等：已有「语法」标签的不动，重复执行不重复补", () => {
    const already = dataWith([diaryCard("d2", ["语法", "日记"])]);
    const once = repairDiaryCardTags(already);
    expect(once.repaired, "已合规的卡不应被改动").toBe(0);
    // 连跑三次仍为 0
    expect(repairDiaryCardTags(repairDiaryCardTags(once.data).data).repaired).toBe(0);
  });

  it("不误伤：非 diary 来源的句子卡不补标签", () => {
    const hunt = { ...diaryCard("h1", ["日记"]), sourceId: "hunt:case-1" } as Card;
    const lesson = { ...diaryCard("l1", []), sourceId: "lesson:lesson-01-am" } as Card;
    const { repaired } = repairDiaryCardTags(dataWith([hunt, lesson]));
    expect(repaired, "只有 diary: 来源才补").toBe(0);
  });

  it("不误伤：词卡即使 sourceId 像日记也不补", () => {
    const word = { ...diaryCard("w1", []), type: "word", sourceId: "diary:x" } as Card;
    const { repaired } = repairDiaryCardTags(dataWith([word]));
    expect(repaired, "只处理句子卡").toBe(0);
  });

  it("用户自己加过的其它标签不受影响", () => {
    const card = { ...diaryCard("d3", ["日记", "旅行"]), sourceId: "diary:d3" } as Card;
    const { data } = repairDiaryCardTags(dataWith([card]));
    expect(data.cards[0].tags, "「语法」前置，其余保持").toEqual(["语法", "日记", "旅行"]);
  });
});
