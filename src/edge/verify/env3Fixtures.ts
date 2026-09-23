/**
 * 输入法专项验证的共用数据构造（2026-09-22）。
 *
 * 与 fixtures.ts 同思路：直接写 localStorage 造数据，比走 UI 快得多。
 * 这里只补「一个到期单词卡」这一种最小会话，供拼写页 / 复习页挂载即可出题。
 */
import type { Card, Schedule, WordDetails } from "../../types";
import { seedAppData } from "./fixtures";

export interface WordFixture {
  card: Card;
  schedule: Schedule;
  details: WordDetails;
}

/** 造一张到期的单词卡（front = 要拼的英文词）。 */
export const makeWordCard = (id: string, front: string, back: string): WordFixture => ({
  card: {
    id,
    type: "word",
    front,
    back,
    note: "",
    sourceId: "unit:x",
    tags: ["核心"],
    status: "review",
    priority: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  schedule: {
    cardId: id,
    easeFactor: 2.5,
    intervalDays: 1,
    reviewCount: 0,
    lapseCount: 0,
    nextReviewAt: "2024-01-01T00:00:00.000Z"
  },
  details: {
    cardId: id,
    word: front,
    phonetic: "",
    partOfSpeech: "n.",
    chineseDefinition: back,
    englishDefinition: "",
    collocations: "",
    audioUrl: "",
    sourceSentence: ""
  }
});

/** 写入 localStorage 并返回迁移后的数据。 */
export const seedWordFixture = (front = "picture", back = "画"): WordFixture => {
  const fixture = makeWordCard("env3-word-1", front, back);
  seedAppData({
    cards: [fixture.card],
    schedules: [fixture.schedule],
    wordDetails: [fixture.details]
  } as never);
  return fixture;
};
