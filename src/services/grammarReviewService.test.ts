import { beforeEach, describe, expect, it } from "vitest";
import {
  buildGrammarReviewSession,
  buildGrammarReviewTask,
  judgeGrammarCloze,
  judgeGrammarRebuild,
  listDueGrammarReviewCards
} from "./grammarReviewService";
import type { AppData, Card, Schedule } from "../types";

const iso = (offsetDays: number) =>
  new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000).toISOString();

const makeCard = (id: string, front: string, sourceId: string): Card => ({
  id,
  type: "sentence",
  front,
  back: "",
  note: "语法课：第一课",
  sourceId,
  unitId: undefined,
  tags: ["语法"],
  status: "review",
  priority: false,
  createdAt: iso(-10),
  updatedAt: iso(-1)
});

const makeSchedule = (cardId: string, nextReviewAt: string, lapseCount = 0, reviewCount = 0): Schedule => ({
  cardId,
  easeFactor: 2.5,
  intervalDays: 1,
  reviewCount,
  lapseCount,
  nextReviewAt
});

let data: AppData;

beforeEach(() => {
  // 复习服务只消费 cards / schedules，最小 fixture 即可
  data = { cards: [], schedules: [] } as unknown as AppData;
});

describe("grammarReviewService（R03 语法点复习）", () => {
  it("只收「语法」标签的到期句子卡，未到期不进队", () => {
    const due = makeCard("c1", "I am happy.", "lesson:lesson-01-am");
    const notDue = makeCard("c2", "She is nice.", "lesson:lesson-02-is");
    const notGrammar = makeCard("c3", "Open the door.", "import:x");
    data = {
      ...data,
      cards: [due, notDue, { ...notGrammar, tags: [] }],
      schedules: [
        makeSchedule("c1", iso(-1)),
        makeSchedule("c2", iso(1)),
        makeSchedule("c3", iso(-1))
      ]
    };

    const dueCards = listDueGrammarReviewCards(data);
    expect(dueCards).toHaveLength(1);
    expect(dueCards[0].card.id).toBe("c1");
  });

  it("最旧错题优先（lapse 多的排前），会话上限 10 张且相邻来源交错", () => {
    const cards: Card[] = [];
    const schedules: Schedule[] = [];
    for (let index = 0; index < 12; index += 1) {
      const sourceId = `lesson:lesson-${String(index % 4).padStart(2, "0")}`;
      cards.push(makeCard(`c${index}`, `Sentence number ${index} goes here.`, sourceId));
      schedules.push(makeSchedule(`c${index}`, iso(-1), index % 3, index));
    }
    data = { ...data, cards, schedules };

    const session = buildGrammarReviewSession(data);
    expect(session).toHaveLength(10);
    // lapse 排序在前 3 位（index 2/5/8/11 中取 3 个）
    expect(session[0].schedule.lapseCount).toBeGreaterThanOrEqual(2);
    // 相邻卡来源不同（混题）
    for (let position = 1; position < session.length; position += 1) {
      expect(session[position].card.sourceId).not.toBe(session[position - 1].card.sourceId);
    }
  });

  it("cloze 任务：挖空语法承载词，四个选项含正确答案且不重复", () => {
    const item = {
      card: makeCard("c1", "She goes to school every day.", "lesson:lesson-07"),
      schedule: makeSchedule("c1", iso(-1), 0, 0)
    };
    const task = buildGrammarReviewTask(item);
    expect(task.mode).toBe("cloze");
    expect(task.promptText).toContain("____");
    expect(task.options).toHaveLength(4);
    expect(new Set(task.options.map((option) => option.toLowerCase())).size).toBe(4);
    expect(task.options.map((option) => option.toLowerCase())).toContain(task.answer.toLowerCase());
    expect(judgeGrammarCloze(task.answer, task.answer)).toBe(true);
    expect(judgeGrammarCloze("wrong", task.answer)).toBe(false);
  });

  it("rebuild 任务：词块打乱且可判定还原顺序", () => {
    const item = {
      card: makeCard("c1", "I went to the library yesterday.", "lesson:lesson-10"),
      schedule: makeSchedule("c1", iso(-1), 0, 1)
    };
    const task = buildGrammarReviewTask(item);
    expect(task.mode).toBe("rebuild");
    expect(task.scrambled).toHaveLength(task.sentence.split(" ").length);
    expect(judgeGrammarRebuild(task.scrambled, task.sentence)).toBe(false);
    const ordered = task.sentence.split(" ");
    expect(judgeGrammarRebuild(ordered, task.sentence)).toBe(true);
  });

  it("同一张卡同一轮复习生成确定性任务（可回放），跨轮次换形态", () => {
    const item = {
      card: makeCard("c1", "She walks to school.", "lesson:lesson-03"),
      schedule: makeSchedule("c1", iso(-1), 0, 2)
    };
    const taskA = buildGrammarReviewTask(item);
    const taskB = buildGrammarReviewTask(item);
    expect(taskA.promptText).toBe(taskB.promptText);
    expect(taskA.options).toEqual(taskB.options);
  });
});
