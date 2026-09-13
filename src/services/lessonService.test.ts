import { describe, expect, it } from "vitest";
import {
  addLessonCoreSentence,
  addLessonMistakeSentence,
  checkLessonChoice,
  checkLessonTokens,
  createGuidedState,
  describeOutputGap,
  detectThirdPersonMiss,
  firstMismatchIndex,
  getCompletedLessonIds,
  getGrammarLesson,
  getNextLesson,
  isLessonDone,
  judgeGuidedStep,
  judgePracticeStep,
  listGrammarLessons,
  markLessonDone,
  normalizeLessonSentence,
  shuffleTokenOrder,
  summarizeLessonProgress
} from "./lessonService";
import type { AppData, GrammarLesson, LessonGuidedStep } from "../types";

const baseData = (overrides: Partial<AppData> = {}): AppData =>
  ({
    schemaVersion: 8,
    cards: [],
    schedules: [],
    wordDetails: [],
    sentenceDetails: [],
    grammarLessonsDone: [],
    ...overrides
  }) as unknown as AppData;

const makeLesson = (overrides: Partial<GrammarLesson> = {}): GrammarLesson =>
  ({
    id: "lesson-01-am",
    number: 1,
    title: "I am",
    grammarLabel: "be 动词 · I am",
    episode: "第 1 集",
    scene: "campus",
    sceneSetupZh: "开学第一天",
    dialogueEn: "Who are you?",
    dialogueZh: "你是谁？",
    intentZh: "介绍自己",
    targetSentence: "I am Xiaomei.",
    blocks: [],
    oneLineRule: "I am 是一对固定搭档。",
    examples: [],
    guided: [],
    practice: [],
    huntCaseIds: [],
    ...overrides
  }) as unknown as GrammarLesson;

describe("lessonService · 判分", () => {
  it("normalizeLessonSentence：小写、去标点、压空白", () => {
    expect(normalizeLessonSentence("  I  am HAPPY! ")).toBe("i am happy");
  });

  it("checkLessonTokens：顺序内容都对才算过，大小写与标点宽容", () => {
    expect(checkLessonTokens(["I", "am", "happy"], "I am happy.")).toBe(true);
    expect(checkLessonTokens(["am", "I", "happy"], "I am happy.")).toBe(false);
    expect(checkLessonTokens(["I", "am", "happy"], "I am happy")).toBe(true);
  });

  it("checkLessonChoice：大小写宽容的单选判分", () => {
    expect(checkLessonChoice(" AM ", "am")).toBe(true);
    expect(checkLessonChoice("is", "am")).toBe(false);
  });

  it("firstMismatchIndex：定位第一个对不上的位置，全对返回 -1", () => {
    expect(firstMismatchIndex(["I", "is"], "I am happy.")).toBe(1);
    expect(firstMismatchIndex(["I", "am", "happy"], "I am happy")).toBe(-1);
    expect(firstMismatchIndex([], "I am")).toBe(0);
  });

  it("judgeGuidedStep：choose / spot / arrange 三种判分", () => {
    const choose: LessonGuidedStep = { kind: "choose", promptZh: "", before: "I", after: "happy.", options: ["am", "is"], answer: "am", explain: "" };
    const spot: LessonGuidedStep = { kind: "spot", promptZh: "", tokens: ["She", "goes"], wrongToken: "goes", answer: "goes", explain: "" };
    const arrange: LessonGuidedStep = { kind: "arrange", promptZh: "", tokens: ["I", "am", "OK"], answer: "I am OK", explain: "" };

    expect(judgeGuidedStep(choose, ["am"])).toBe(true);
    expect(judgeGuidedStep(choose, ["is"])).toBe(false);
    expect(judgeGuidedStep(spot, ["goes"])).toBe(true);
    expect(judgeGuidedStep(spot, ["She"])).toBe(false);
    expect(judgeGuidedStep(arrange, ["I", "am", "OK"])).toBe(true);
  });

  it("judgePracticeStep：点词成句判分", () => {
    const step = { promptZh: "", tokens: ["I", "am", "OK"], answer: "I am OK" };
    expect(judgePracticeStep(step, ["I", "am", "OK"])).toBe(true);
    expect(judgePracticeStep(step, ["I", "am"])).toBe(false);
  });
});

describe("lessonService · 课程与进度", () => {
  it("课程清单与查询", () => {
    expect(listGrammarLessons().length).toBeGreaterThan(0);
    expect(getGrammarLesson("lesson-01-am")?.id).toBe("lesson-01-am");
    expect(getGrammarLesson("nope")).toBeUndefined();
  });

  it("完成状态与下一课定位", () => {
    const data = baseData({ grammarLessonsDone: ["lesson-01-am"] });
    expect(getCompletedLessonIds(data).has("lesson-01-am")).toBe(true);
    expect(isLessonDone(data, "lesson-01-am")).toBe(true);
    expect(isLessonDone(data, "lesson-02-is")).toBe(false);
    expect(getNextLesson(data)?.id).toBe("lesson-02-is");

    const allDone = baseData({ grammarLessonsDone: listGrammarLessons().map((lesson) => lesson.id) });
    expect(getNextLesson(allDone)).toBeNull();
  });

  it("markLessonDone：幂等，完课时核心句型自动入复习队列（R03）", () => {
    const data = baseData();
    const once = markLessonDone(data, "lesson-01-am");
    expect(once.grammarLessonsDone).toEqual(["lesson-01-am"]);
    const coreCards = once.cards.filter((card) => card.sourceId === "lesson:lesson-01-am");
    expect(coreCards).toHaveLength(1);
    expect(coreCards[0].front).toBe("I am Xiaomei.");

    const twice = markLessonDone(once, "lesson-01-am");
    expect(twice.cards).toHaveLength(once.cards.length);
  });

  it("summarizeLessonProgress：完成数 / 总数 / 百分比", () => {
    const summary = summarizeLessonProgress(baseData());
    expect(summary.total).toBe(listGrammarLessons().length);
    expect(summary.done).toBe(0);
    const doneOne = summarizeLessonProgress(baseData({ grammarLessonsDone: ["lesson-01-am"] }));
    expect(doneOne.done).toBe(1);
    expect(doneOne.percent).toBe(Math.round((1 / summary.total) * 100));
  });
});

describe("lessonService · 错句与核心句回流 SM-2", () => {
  it("addLessonMistakeSentence：同一句 + 同一课只收一次", () => {
    const lesson = makeLesson();
    const data = baseData();
    const once = addLessonMistakeSentence(data, lesson, "I is Xiaomei.", "I 只跟 am 一起出场");
    expect(once.cards).toHaveLength(1);
    expect(once.cards[0].type).toBe("sentence");
    expect(once.cards[0].sourceId).toBe("lesson:lesson-01-am");
    const twice = addLessonMistakeSentence(once, lesson, "I is Xiaomei.", "I 只跟 am 一起出场");
    expect(twice.cards).toHaveLength(1);
  });

  it("addLessonMistakeSentence：空句子直接原样返回", () => {
    const data = baseData();
    expect(addLessonMistakeSentence(data, makeLesson(), "   ", "note")).toBe(data);
  });

  it("addLessonCoreSentence：核心句幂等入队", () => {
    const lesson = makeLesson();
    const data = baseData();
    const once = addLessonCoreSentence(data, lesson);
    expect(once.cards).toHaveLength(1);
    expect(once.cards[0].front).toBe("I am Xiaomei.");
    expect(addLessonCoreSentence(once, lesson).cards).toHaveLength(1);
  });
});

describe("lessonService · 三单常驻检查（R04）", () => {
  it("he/she/it + 动词原形给提醒，正确形式不提醒", () => {
    expect(detectThirdPersonMiss("he go to school")).not.toBeNull();
    expect(detectThirdPersonMiss("She like reading.")).not.toBeNull();
    expect(detectThirdPersonMiss("It work fine")).not.toBeNull();
    expect(detectThirdPersonMiss("He goes to school.")).toBeNull();
    expect(detectThirdPersonMiss("I like reading.")).toBeNull();
    expect(detectThirdPersonMiss("They go to school.")).toBeNull();
  });
});

describe("lessonService · 词块库防作弊打乱（点词成句）", () => {
  const identity = (length: number) => Array.from({ length }, (_value, index) => index);

  it("同一 seed 结果确定（可回放、不跳变）", () => {
    const tokens = ["She", "can", "sing", "very", "well."];
    expect(shuffleTokenOrder(tokens, "lesson-14-can:guided:2")).toEqual(
      shuffleTokenOrder(tokens, "lesson-14-can:guided:2")
    );
  });

  it("返回的是合法排列（不增不减、不重不漏）", () => {
    const tokens = ["I", "am", "drawing", "a", "picture."];
    const shuffled = shuffleTokenOrder(tokens, "lesson-13-now:practice:0");
    expect([...shuffled].sort((a, b) => a - b)).toEqual(identity(tokens.length));
  });

  it("词块 ≤2 个时保持原样（无可打乱空间）", () => {
    expect(shuffleTokenOrder(["It", "rained."], "seed")).toEqual([0, 1]);
    expect(shuffleTokenOrder(["rain."], "seed")).toEqual([0]);
  });

  it("所有课程的 arrange 题：展示顺序一定不等于答案顺序", () => {
    let checked = 0;
    for (const lesson of listGrammarLessons()) {
      const steps: Array<{ tokens: string[]; seed: string }> = [];
      lesson.guided.forEach((step: LessonGuidedStep, index: number) => {
        if (step.kind === "arrange" && step.tokens) {
          steps.push({ tokens: step.tokens, seed: `${lesson.id}:guided:${index}` });
        }
      });
      lesson.practice.forEach((step, index) => {
        steps.push({ tokens: step.tokens, seed: `${lesson.id}:practice:${index}` });
      });
      for (const { tokens, seed } of steps) {
        if (tokens.length <= 2) continue;
        const shuffled = shuffleTokenOrder(tokens, seed);
        expect(
          shuffled,
          `${lesson.id}（${seed}）的词块顺序与答案一致——「点词成句」会退化成顺序点选`
        ).not.toEqual(identity(tokens.length));
        checked += 1;
      }
    }
    // 全部 20 课都应被扫描到（防止课程数据被清空后测试变成空转）
    expect(checked).toBeGreaterThan(100);
  });
});

describe("lessonService · 输出题差异说明（R04 反馈说人话）", () => {
  const target = "I want to travel.";

  it("多了一个词：点名是哪个词，并给出核心句词数", () => {
    const message = describeOutputGap("I want to go travel", target);
    expect(message).toContain("go");
    expect(message).toContain("4 个词");
  });

  it("少了一个词：提示补齐方向", () => {
    expect(describeOutputGap("I want travel", target)).toContain("少了一个词");
  });

  it("词数相同但不一样：指向顺序或个别词", () => {
    expect(describeOutputGap("I want to walk.", target)).toContain("顺序或个别词");
  });

  it("完全一致或仅标点/大小写差异：不产生干扰说明", () => {
    expect(describeOutputGap("I want to travel.", target)).toBeNull();
    expect(describeOutputGap("i want to travel", target)).toBeNull();
  });

  it("空输入安全返回", () => {
    expect(describeOutputGap("   ", target)).toBeNull();
  });
});
