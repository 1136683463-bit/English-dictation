import { describe, expect, it } from "vitest";
import {
  addLessonCoreSentence,
  addLessonMistakeSentence,
  backfillLessonCoreSentences,
  backfillLessonStages,
  checkLessonChoice,
  checkLessonTokens,
  createGuidedState,
  describeOutputGap,
  detectThirdPersonMiss,
  firstMismatchIndex,
  getCompletedLessonIds,
  getGrammarLesson,
  getLessonStageLock,
  getLessonStagesDone,
  getNextLesson,
  isLessonDone,
  isLessonStageDone,
  judgeGuidedStep,
  judgePracticeStep,
  listGrammarLessons,
  markLessonDone,
  markLessonStageDone,
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

  it("R04 backfillLessonCoreSentences：只回填已完成课，幂等", () => {
    const done = baseData({ grammarLessonsDone: ["lesson-01-am", "lesson-02-is"] });
    const { data: once, backfilled } = backfillLessonCoreSentences(done);
    expect(backfilled).toBe(2);
    expect(once.cards.filter((card) => card.sourceId === "lesson:lesson-01-am")).toHaveLength(1);
    expect(once.cards.filter((card) => card.sourceId === "lesson:lesson-02-is")).toHaveLength(1);
    expect(once.cards.every((card) => card.tags.includes("语法"))).toBe(true);

    // 幂等：第二次执行零新增
    const { data: twice, backfilled: again } = backfillLessonCoreSentences(once);
    expect(again).toBe(0);
    expect(twice.cards).toHaveLength(once.cards.length);
  });

  it("R04 backfillLessonCoreSentences：未完成课不回填，空进度零回填", () => {
    const { data, backfilled } = backfillLessonCoreSentences(baseData());
    expect(backfilled).toBe(0);
    expect(data.cards).toHaveLength(0);

    const partial = baseData({ grammarLessonsDone: ["lesson-01-am"] });
    const { data: result, backfilled: count } = backfillLessonCoreSentences(partial);
    expect(count).toBe(1);
    expect(result.cards.some((card) => card.sourceId === "lesson:lesson-02-is")).toBe(false);
  });

  it("R04 backfillLessonCoreSentences：已有核心句卡的课（markLessonDone 正常路径）不重复回填", () => {
    const done = markLessonDone(baseData(), "lesson-01-am");
    const { data: result, backfilled } = backfillLessonCoreSentences(done);
    expect(backfilled).toBe(0);
    expect(result.cards).toHaveLength(done.cards.length);
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

// ── F1 三关卡粒度完成态（2026-09-13 PRD）────────────────────────────────
describe("F1 三关卡完成态", () => {
  it("markLessonStageDone 关 1：双写新旧字段 + 核心句入队", () => {
    const next = markLessonStageDone(baseData(), "lesson-01-am", 1);
    expect(next.grammarLessonsDone).toContain("lesson-01-am");
    expect(next.grammarLessonStagesDone?.["lesson-01-am"]).toEqual([1]);
    // 核心句入 SM-2（走既有 markLessonDone 链路）
    expect(next.cards.some((card) => card.sourceId === "lesson:lesson-01-am")).toBe(true);
  });

  it("markLessonStageDone 关 2/3：只写新字段，不碰旧字段、不入队", () => {
    const after1 = markLessonStageDone(baseData(), "lesson-01-am", 1);
    const cardsAfter1 = after1.cards.length;
    const after2 = markLessonStageDone(after1, "lesson-01-am", 2);
    expect(after2.grammarLessonStagesDone?.["lesson-01-am"]).toEqual([1, 2]);
    expect(after2.cards.length).toBe(cardsAfter1); // 关 2 不再入队
    const after3 = markLessonStageDone(after2, "lesson-01-am", 3);
    expect(after3.grammarLessonStagesDone?.["lesson-01-am"]).toEqual([1, 2, 3]);
  });

  it("markLessonStageDone 幂等：重复标同一关不产生变化", () => {
    const once = markLessonStageDone(baseData(), "lesson-01-am", 1);
    const twice = markLessonStageDone(once, "lesson-01-am", 1);
    expect(twice).toBe(once); // 不可变且幂等：直接返回原引用
    expect(twice.grammarLessonStagesDone?.["lesson-01-am"]).toEqual([1]);
  });

  it("markLessonStageDone 未知课程：安全返回原数据", () => {
    const data = baseData();
    expect(markLessonStageDone(data, "lesson-99-nope", 1)).toBe(data);
  });

  it("getLessonStagesDone 兼容视角：旧字段有值即视为关 1 完成（未回填也能读对）", () => {
    const legacy = baseData({ grammarLessonsDone: ["lesson-01-am"] }); // 无新字段
    expect(getLessonStagesDone(legacy, "lesson-01-am").has(1)).toBe(true);
    expect(isLessonStageDone(legacy, "lesson-01-am", 1)).toBe(true);
    expect(isLessonStageDone(legacy, "lesson-01-am", 2)).toBe(false);
  });

  it("backfillLessonStages：旧进度补 [1]，已有关卡不动", () => {
    const data = baseData({
      grammarLessonsDone: ["lesson-01-am", "lesson-02-is"],
      grammarLessonStagesDone: { "lesson-01-am": [1, 2] } // L1 已有 1、2
    });
    const { data: next, backfilled } = backfillLessonStages(data);
    expect(backfilled).toBe(1); // 只有 L2 需要补
    expect(next.grammarLessonStagesDone?.["lesson-01-am"]).toEqual([1, 2]); // 不动
    expect(next.grammarLessonStagesDone?.["lesson-02-is"]).toEqual([1]); // 补上
  });

  it("backfillLessonStages 幂等：重复执行 backfilled=0", () => {
    const data = baseData({ grammarLessonsDone: ["lesson-01-am"] });
    const once = backfillLessonStages(data);
    expect(once.backfilled).toBe(1);
    const twice = backfillLessonStages(once.data);
    expect(twice.backfilled).toBe(0);
  });

  it("isLessonStageDone 从未学课：全部 false", () => {
    const data = baseData();
    expect(isLessonStageDone(data, "lesson-01-am", 1)).toBe(false);
    expect(isLessonStageDone(data, "lesson-01-am", 2)).toBe(false);
    expect(isLessonStageDone(data, "lesson-01-am", 3)).toBe(false);
  });
});

// ── R9 replace 变形题判题（复用 choose 内核）─────────────────────────
describe("R9 replace 变形题", () => {
  const replaceStep: LessonGuidedStep = {
    kind: "replace",
    promptZh: "句子变身：「I am drawing.」把主语 I 换成 She，动词要怎么变？",
    replaceBase: "I am drawing.",
    replaceTarget: "把 I 换成 She",
    options: ["is", "am", "are"],
    answer: "is",
    explain: "She 的搭档是 is：She is drawing."
  };

  it("选对变形结果：通过", () => {
    expect(judgeGuidedStep(replaceStep, ["is"])).toBe(true);
  });

  it("选原形的搭档（未跟着变）：不通过", () => {
    expect(judgeGuidedStep(replaceStep, ["am"])).toBe(false);
  });

  it("选错搭档：不通过", () => {
    expect(judgeGuidedStep(replaceStep, ["are"])).toBe(false);
  });
});

// ── F1 三关卡解锁判定（2026-09-13 PRD §6.1）─────────────────────────────
describe("F1 三关卡解锁判定", () => {
  const NOW = Date.parse("2026-09-13T20:00:00.000Z");
  const hoursAgo = (h: number) => new Date(NOW - h * 3600 * 1000).toISOString();

  it("关 1：第 1 课恒解锁；后续课需前一课关 1 完成", () => {
    const data = baseData();
    const noRead = () => null;
    expect(getLessonStageLock(data, "lesson-01-am", 1, noRead, NOW).state).toBe("unlocked");
    expect(getLessonStageLock(data, "lesson-02-is", 1, noRead, NOW).state).toBe("locked");
    const done1 = markLessonStageDone(data, "lesson-01-am", 1);
    expect(getLessonStageLock(done1, "lesson-02-is", 1, noRead, NOW).state).toBe("unlocked");
    expect(getLessonStageLock(done1, "lesson-01-am", 1, noRead, NOW).state).toBe("done");
  });

  it("关 2：关 1 完成 + 次日 20h 后解锁；未满 20h 锁定并给 unlockAt", () => {
    const data = markLessonStageDone(baseData(), "lesson-13-now", 1);
    // 关 1 完成于 5 小时前（<20h）→ 锁定
    const lock5h = getLessonStageLock(data, "lesson-13-now", 2, () => hoursAgo(5), NOW);
    expect(lock5h.state).toBe("locked");
    expect(lock5h.unlockAt).toBeDefined();
    // 关 1 完成于 25 小时前（>20h）→ 解锁
    expect(getLessonStageLock(data, "lesson-13-now", 2, () => hoursAgo(25), NOW).state).toBe("unlocked");
  });

  it("关 2：关 1 未完成 → 锁定", () => {
    const data = baseData();
    expect(getLessonStageLock(data, "lesson-13-now", 2, () => null, NOW).state).toBe("locked");
  });

  it("关 2：老用户回填进度无时间戳 → 按满窗处理直接解锁", () => {
    const legacy = baseData({ grammarLessonsDone: ["lesson-13-now"] }); // 旧字段有值、无遥测时间
    expect(getLessonStageLock(legacy, "lesson-13-now", 2, () => null, NOW).state).toBe("unlocked");
  });

  it("关 3：关 2 完成即解锁；关 2 未完 → 锁定", () => {
    const d1 = markLessonStageDone(baseData(), "lesson-13-now", 1);
    expect(getLessonStageLock(d1, "lesson-13-now", 3, () => null, NOW).state).toBe("locked");
    const d2 = markLessonStageDone(d1, "lesson-13-now", 2);
    expect(getLessonStageLock(d2, "lesson-13-now", 3, () => null, NOW).state).toBe("unlocked");
    const d3 = markLessonStageDone(d2, "lesson-13-now", 3);
    expect(getLessonStageLock(d3, "lesson-13-now", 3, () => null, NOW).state).toBe("done");
  });
});
