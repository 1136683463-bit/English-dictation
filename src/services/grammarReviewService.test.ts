import { beforeEach, describe, expect, it } from "vitest";
import {
  buildGrammarReviewSession,
  buildGrammarReviewTask,
  FREE_TYPE_MIN_REVIEW_COUNT,
  isMasteredByOutput,
  judgeGrammarCloze,
  judgeGrammarFreeType,
  judgeGrammarRebuild,
  listDueGrammarReviewCards,
  summarizeGrammarMastery
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

  it("R02：反馈讲解优先取 SentenceDetails.grammarNote（hunt 卡的罪名讲解），缺失时退回 card.note", () => {
    const item = {
      card: makeCard("c1", "Yesterday I went to the park.", "hunt:hunt-tense-jump"),
      schedule: makeSchedule("c1", iso(-1), 0, 0)
    };
    const withDetails = buildGrammarReviewTask(item, [
      {
        cardId: "c1",
        sentence: "Yesterday I went to the park.",
        translation: "",
        keywords: [],
        grammarNote: "[tense] 时态变形：go → went。过去的时间要用过去式。",
        audioUrl: ""
      }
    ]);
    expect(withDetails.note).toContain("[tense]");
    expect(withDetails.note).toContain("go → went");

    // 无 sentenceDetails 时退回 card.note（原有行为不变）
    const fallback = buildGrammarReviewTask(item, []);
    expect(fallback.note).toBe("语法课：第一课");
  });
});

describe("R06 summarizeGrammarMastery（累计掌握视图）", () => {  const masteryData = (cards: Card[], schedules: Schedule[]): AppData =>
    ({ cards, schedules }) as unknown as AppData;

  it("已掌握 / 进行中 / 未开始 三态统计正确", () => {
    const masteredCard = { ...makeCard("c1", "I am happy.", "lesson:lesson-01-am"), status: "mastered" as const };
    const inProgressCard = makeCard("c2", "She goes.", "lesson:lesson-07");
    const notStartedCard = makeCard("c3", "I went.", "lesson:lesson-10");
    data = masteryData(
      [masteredCard, inProgressCard, notStartedCard],
      [
        makeSchedule("c1", iso(5), 0, 5),
        makeSchedule("c2", iso(-1), 0, 2), // 复习过 2 次 → 进行中
        makeSchedule("c3", iso(-1), 0, 0) // 从未复习 → 未开始
      ]
    );

    const summary = summarizeGrammarMastery(data);
    expect(summary.total).toBe(3);
    expect(summary.mastered).toBe(1);
    expect(summary.inProgress).toBe(1);
    expect(summary.notStarted).toBe(1);
  });

  it("非语法卡、suspended 卡、无 schedule 的新卡口径正确", () => {
    const grammarCard = makeCard("g1", "I am happy.", "lesson:lesson-01-am");
    const wordCard: Card = { ...makeCard("w1", "happy", "import:x"), type: "word" };
    const suspendedCard = { ...makeCard("g2", "She is nice.", "lesson:lesson-02-is"), status: "suspended" as const };
    data = masteryData(
      [grammarCard, wordCard, suspendedCard],
      [makeSchedule("g1", iso(-1), 0, 0)]
    );

    const summary = summarizeGrammarMastery(data);
    expect(summary.total).toBe(1); // 只有 g1 计入
    expect(summary.notStarted).toBe(1);
  });

  it("空数据返回全零", () => {
    expect(summarizeGrammarMastery(masteryData([], []))).toEqual({
      mastered: 0,
      inProgress: 0,
      notStarted: 0,
      total: 0
    });
  });
});

describe("R09 Step2 free_type 转换与新掌握口径", () => {
  it("reviewCount < 2 时维持 cloze/rebuild；≥ 2 后转 free_type", () => {
    const item = (reviewCount: number) => ({
      card: makeCard("c1", "Yesterday I went to the park.", "hunt:x"),
      schedule: makeSchedule("c1", iso(-1), 0, reviewCount)
    });
    expect(buildGrammarReviewTask(item(0)).mode).toBe("cloze");
    expect(buildGrammarReviewTask(item(1)).mode).toBe("rebuild");
    expect(buildGrammarReviewTask(item(FREE_TYPE_MIN_REVIEW_COUNT)).mode).toBe("free_type");
    expect(buildGrammarReviewTask(item(5)).mode).toBe("free_type"); // 之后一直保持
  });

  it("P1-2：free_type 带来源锚点——有 card.note 用来源，无 note 给词数提示", () => {
    const item = (note: string) => ({
      card: { ...makeCard("c1", "My mother is happy.", "hunt:x"), note },
      schedule: makeSchedule("c1", iso(-1), 0, FREE_TYPE_MIN_REVIEW_COUNT)
    });
    // hunt 卡：note 带案件名
    expect(buildGrammarReviewTask(item("找错案件：车站的一通电话（缺 be 动词）")).promptText).toContain(
      "找错案件：车站的一通电话"
    );
    expect(buildGrammarReviewTask(item("找错案件：车站的一通电话（缺 be 动词）")).promptText).toContain(
      "把那句话自己写出来"
    );
    // 空 note：退化为词数提示（"My mother is happy." = 4 个词）
    expect(buildGrammarReviewTask(item("")).promptText).toBe("把那句 4 个词的句子自己写出来");
  });

  it("judgeGrammarFreeType：完全一致通过；拼写接近按半对计分；空句不通过", () => {
    const sentence = "Yesterday I went to the park.";
    expect(judgeGrammarFreeType("Yesterday I went to the park.", sentence).passed).toBe(true);
    expect(judgeGrammarFreeType("yesterday i went to the park", sentence).passed).toBe(true); // 大小写标点宽容
    expect(judgeGrammarFreeType("I went.", sentence).passed).toBe(false);
    expect(judgeGrammarFreeType("", sentence).passed).toBe(false);
    const close = judgeGrammarFreeType("Yesterday I go to the park.", sentence);
    expect(close.score).toBeGreaterThan(0);
    expect(close.score).toBeLessThan(100);
  });

  it("isMasteredByOutput：最近两次 recall 均 rating4 才算掌握", () => {
    const reviews = (ratings: number[]) =>
      ratings.map((rating, index) => ({ cardId: "c1", mode: "recall", rating, id: `r${index}` }));
    expect(isMasteredByOutput(reviews([4, 4]), "c1")).toBe(true);
    expect(isMasteredByOutput(reviews([4, 3, 4, 4]), "c1")).toBe(true); // 最近两次连续
    expect(isMasteredByOutput(reviews([4, 3]), "c1")).toBe(false);
    expect(isMasteredByOutput(reviews([4]), "c1")).toBe(false); // 不足两次
    expect(isMasteredByOutput([], "c1")).toBe(false);
    // cloze 模式不算输出复习
    const clozeReviews = [
      { cardId: "c1", mode: "cloze", rating: 4, id: "r1" },
      { cardId: "c1", mode: "cloze", rating: 4, id: "r2" }
    ];
    expect(isMasteredByOutput(clozeReviews, "c1")).toBe(false);
  });
});
