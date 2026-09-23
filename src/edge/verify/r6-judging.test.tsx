// @vitest-environment jsdom
/**
 * R6 · 判题正确性
 *
 * 验证目标：复习卡的产出型任务与强化页各档的判题，都不能把对的判错、把错的判对。
 * 方式：服务层纯函数（覆盖全部题型 × 正/误答案 × 边界输入）+ UI 端到端
 * （用真实课程素材，按正确答案作答必须通过；按错误答案作答必须被识别）。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import {
  buildGrammarReviewTask,
  FREE_TYPE_PASS_SCORE,
  judgeGrammarCloze,
  judgeGrammarFreeType,
  judgeGrammarRebuild,
  type GrammarReviewCard
} from "../../services/grammarReviewService";
import {
  buildBoostItems,
  BOOST_RECALL_PASS_SCORE,
  judgeBoostItem,
  judgeBoostListen,
  judgeBoostTokens,
  type BoostItem
} from "../../services/grammarBoostService";
import { grammarLessons } from "../../data/grammarLessons";
import { cardsToData, DONE_LESSON_ID, makeSentenceCard, PAST_ISO, seedAppData } from "./fixtures";
import { answerBoostItem, clickButtonContaining, planReviewSession, answerReviewStep } from "./drive";

const reviewCard = (sentence: string, reviewCount = 0): GrammarReviewCard => {
  const fixture = makeSentenceCard({
    id: `c-${reviewCount}`,
    sentence,
    schedule: { reviewCount, nextReviewAt: PAST_ISO }
  });
  return { card: fixture.card, schedule: fixture.schedule! };
};

describe("R6-a 复习卡判题（服务层）", () => {
  beforeEach(() => resetStorage());

  it("填空：正确答案通过；大小写/首尾空格宽容；错误答案与空串被判错", () => {
    const task = buildGrammarReviewTask(reviewCard("I am drawing a picture.", 0));
    expect(task.mode).toBe("cloze");
    expect(judgeGrammarCloze(task.answer, task.answer)).toBe(true);
    expect(judgeGrammarCloze(`  ${task.answer.toUpperCase()}  `, task.answer)).toBe(true);
    expect(judgeGrammarCloze("wrong", task.answer)).toBe(false);
    expect(judgeGrammarCloze("", task.answer)).toBe(false);
    // 干扰项必须都不是答案
    for (const option of task.options.filter((item) => item !== task.answer)) {
      expect(judgeGrammarCloze(option, task.answer)).toBe(false);
    }
    expect(task.options.filter((item) => judgeGrammarCloze(item, task.answer)).length).toBe(1);
  });

  it("重组：正确词序通过；交换两词/少一词/多一词/空数组都被判错", () => {
    const sentence = "I am drawing a picture.";
    const tokens = ["I", "am", "drawing", "a", "picture."];
    expect(judgeGrammarRebuild(tokens, sentence)).toBe(true);
    expect(judgeGrammarRebuild(["am", "I", "drawing", "a", "picture."], sentence)).toBe(false);
    expect(judgeGrammarRebuild(["I", "am", "drawing", "a"], sentence)).toBe(false);
    expect(judgeGrammarRebuild([...tokens, "again"], sentence)).toBe(false);
    expect(judgeGrammarRebuild([], sentence)).toBe(false);
    // 标点/大小写宽容
    expect(judgeGrammarRebuild(["i", "am", "drawing", "a", "picture"], sentence)).toBe(true);
  });

  it("自由输出：完全正确通过（100 分）；差一个词不通过；阈值 = 90", () => {
    const sentence = "I am drawing a picture.";
    expect(FREE_TYPE_PASS_SCORE).toBe(90);
    const perfect = judgeGrammarFreeType(sentence, sentence);
    expect(perfect.passed).toBe(true);
    expect(perfect.score).toBe(100);
    // 大小写与标点宽容
    expect(judgeGrammarFreeType("i am drawing a picture", sentence).passed).toBe(true);
    // 漏掉 be 动词（本课考点）→ 必须判错
    expect(judgeGrammarFreeType("I drawing a picture.", sentence).passed).toBe(false);
    // 完全无关 → 0 分且不通过
    const unrelated = judgeGrammarFreeType("the cat sat on the mat", sentence);
    expect(unrelated.passed).toBe(false);
    expect(unrelated.score).toBe(0);
    // 空串不通过
    expect(judgeGrammarFreeType("", sentence).passed).toBe(false);
  });

  it("自由输出的通过线是「宽容」的：只错一个虚词仍可能通过（记录当前口径）", () => {
    const sentence = "I am drawing a picture.";
    // "I am drawing picture."（丢 a）→ 4/5 match = 80 → 不通过
    expect(judgeGrammarFreeType("I am drawing picture.", sentence).passed).toBe(false);
    // "I am drawing a nice picture."（多一个词）→ 多词会被计 extra
    const extra = judgeGrammarFreeType("I am drawing a nice picture.", sentence);
    expect(extra.score).toBeLessThan(100);
    // 6 个词里 5 个 match → 83，仍不通过（口径：多写也算错）
    expect(extra.passed).toBe(false);
  });

  it("整库扫描：204 课 × 三档，按正确答案作答都必须判对", () => {
    const failures: string[] = [];
    for (const lesson of grammarLessons) {
      for (const tier of [1, 2, 3] as const) {
        for (const item of buildBoostItems(lesson.id, tier, {})) {
          const verdict = judgeBoostItem(item, answerPayload(item));
          if (!verdict.passed) failures.push(`${lesson.id} t${tier} ${item.kind} "${item.answer}"`);
        }
      }
    }
    expect(failures).toEqual([]);
  });
});

describe("R6-b 强化页判题（服务层 · 逐题型正误）", () => {
  beforeEach(() => resetStorage());



  /**
   * 「这句有问题吗」（contrast）题型的可达性：档 1 有 5 类候选
   * （bothright/listen/cloze/choice/contrast）却只有 4 个槽位，每轮必有一类轮空。
   * 实测 round=0（用户首次趁热练）全库 204 课一道 contrast 都不出，
   * 只有 round=2/3/4 才出现。这里在会产出 contrast 的轮次上取真实题目验证判题。
   */
  it("对比判断（contrast）在 round 2-4 可达；判题：选「有点问题」通过、选「没问题」判错", () => {
    const items = [2, 3, 4]
      .flatMap((round) => grammarLessons.flatMap((lesson) => buildBoostItems(lesson.id, 1, { round })))
      .filter((item) => item.kind === "contrast")
      .slice(0, 30);
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      // 档 1 的 contrast 全部来自 lesson.contrast 的 wrong 句，isWrong 恒为 true
      expect(item.contrast?.isWrong).toBe(true);
      expect(judgeBoostItem(item, { pickedProblem: true }).passed).toBe(true);
      expect(judgeBoostItem(item, { pickedProblem: false }).passed).toBe(false);
      // 反例：把 isWrong 翻成 false 时，选「有点问题」必须判错
      const flipped: BoostItem = { ...item, contrast: { ...item.contrast!, isWrong: false } };
      expect(judgeBoostItem(flipped, { pickedProblem: true }).passed).toBe(false);
      expect(judgeBoostItem(flipped, { pickedProblem: false }).passed).toBe(true);
      // 无 contrast 的数据异常 → 判错（不送分）
      expect(judgeBoostItem({ ...item, contrast: undefined }, { pickedProblem: true }).passed).toBe(false);
    }
  });

  it("【可达性】round=0（用户首次趁热练）全库不出 contrast 题型", () => {
    const firstRound = grammarLessons.flatMap((lesson) => buildBoostItems(lesson.id, 1, { round: 0 }));
    expect(firstRound.some((item) => item.kind === "contrast")).toBe(false);
    const laterRounds = [2, 3, 4].flatMap((round) =>
      grammarLessons.flatMap((lesson) => buildBoostItems(lesson.id, 1, { round }))
    );
    expect(laterRounds.some((item) => item.kind === "contrast")).toBe(true);
  });

  it("改错（spot）：点中标注的错词通过；点其他词判错；无标注时一律判错", () => {
    const items = grammarLessons.flatMap((lesson) => buildBoostItems(lesson.id, 1, {}).filter((item) => item.kind === "spot"));
    expect(items.length).toBeGreaterThan(0);
    for (const item of items.slice(0, 60)) {
      const correct = answerPayload(item).tokenIndex!;
      expect(judgeBoostItem(item, { tokenIndex: correct }).passed).toBe(true);
      const tokenCount = item.spotTokens?.length ?? 0;
      for (let index = 0; index < tokenCount; index += 1) {
        if ((item.spotWrongIndexes ?? [item.spotWrongIndex]).includes(index)) continue;
        expect(judgeBoostItem(item, { tokenIndex: index }).passed).toBe(false);
      }
      expect(judgeBoostItem(item, { tokenIndex: -1 }).passed).toBe(false);
      // 无标注的数据异常 → 判错（不能因为缺失就送分）
      expect(judgeBoostItem({ ...item, spotWrongIndex: undefined, spotWrongIndexes: undefined }, { tokenIndex: 0 }).passed).toBe(false);
    }
  });

  it("双正解：选「两句都对」通过，选「只有一句对」判错；无 correctPair 时恒判错", () => {
    const items = grammarLessons
      .flatMap((lesson) => buildBoostItems(lesson.id, 1, {}))
      .filter((item) => item.kind === "bothright")
      .slice(0, 20);
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(judgeBoostItem(item, { pickedProblem: true }).passed).toBe(true);
      expect(judgeBoostItem(item, { pickedProblem: false }).passed).toBe(false);
      expect(judgeBoostItem({ ...item, correctPair: undefined }, { pickedProblem: true }).passed).toBe(false);
    }
  });

  it("听力：选听播放句通过、选干扰句判错（归一化忽略大小写标点）", () => {
    const items = grammarLessons
      .flatMap((lesson) => buildBoostItems(lesson.id, 1, {}))
      .filter((item) => item.kind === "listen")
      .slice(0, 20);
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(judgeBoostListen(item, item.listenText ?? "")).toBe(true);
      expect(judgeBoostItem(item, { text: item.listenText }).passed).toBe(true);
      expect(judgeBoostListen(item, (item.listenText ?? "").toLowerCase().replace(/[.?]/g, ""))).toBe(true);
      for (const option of item.listenOptions ?? []) {
        if (option === item.listenText) continue;
        expect(judgeBoostListen(item, option)).toBe(false);
      }
      expect(judgeBoostListen(item, "")).toBe(false);
    }
  });

  it("填空/选择：正确答案通过，其余选项判错；空串判错", () => {
    const all = grammarLessons.flatMap((lesson) => [1, 2, 3].flatMap((tier) => buildBoostItems(lesson.id, tier as 1 | 2 | 3, {})));
    const cloze = all.filter((item) => item.kind === "cloze");
    expect(cloze.length).toBeGreaterThan(0);
    for (const item of cloze) {
      expect(judgeBoostItem(item, { text: item.clozeAnswer ?? "" }).passed).toBe(true);
      expect(judgeBoostItem(item, { text: (item.clozeAnswer ?? "").toUpperCase() }).passed).toBe(true);
      expect(judgeBoostItem(item, { text: "" }).passed).toBe(false);
      for (const option of item.clozeOptions ?? []) {
        if (option === item.clozeAnswer) continue;
        expect(judgeBoostItem(item, { text: option }).passed).toBe(false);
      }
    }
    const choice = all.filter((item) => item.kind === "choose" || item.kind === "replace");
    expect(choice.length).toBeGreaterThan(0);
    for (const item of choice) {
      expect(judgeBoostItem(item, { text: item.answer }).passed).toBe(true);
      for (const option of item.options ?? []) {
        if (option.trim().toLowerCase() === item.answer.trim().toLowerCase()) continue;
        expect(judgeBoostItem(item, { text: option }).passed).toBe(false);
      }
    }
  });

  it("词块排序（rebuild/arrange）：正确顺序通过；乱序判错；arrange 的干扰项不能当答案", () => {
    const all = grammarLessons.flatMap((lesson) => [1, 2, 3].flatMap((tier) => buildBoostItems(lesson.id, tier as 1 | 2 | 3, {})));
    const arrange = all.filter((item) => item.kind === "rebuild" || item.kind === "arrange");
    expect(arrange.length).toBeGreaterThan(0);
    for (const item of arrange) {
      const tokens = item.answer.split(/\s+/).filter(Boolean);
      expect(judgeBoostTokens(item, tokens)).toBe(true);
      if (tokens.length >= 2) {
        const swapped = [...tokens];
        [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
        expect(judgeBoostTokens(item, swapped)).toBe(false);
      }
      expect(judgeBoostTokens(item, [])).toBe(false);
      // 干扰项不该出现在答案里（否则「拼对」与「拼错」无法区分）
      const answerWords = new Set(tokens.map((token) => token.replace(/[.,!?;:]$/, "").toLowerCase()));
      const distractors = (item.tokens ?? []).filter(
        (token) => !answerWords.has(token.replace(/[.,!?;:]$/, "").toLowerCase())
      );
      for (const distractor of distractors) {
        expect(answerWords.has(distractor.toLowerCase())).toBe(false);
      }
    }
  });

  it("产出类（recall / translate / produce / variant / fix / free）：正确通过、错误判错，且两档线不同", () => {
    expect(BOOST_RECALL_PASS_SCORE).toBe(70);
    const all = grammarLessons.flatMap((lesson) => [1, 2, 3].flatMap((tier) => buildBoostItems(lesson.id, tier as 1 | 2 | 3, {})));
    const recall = all.filter((item) => item.kind === "recall");
    const produce = all.filter((item) => ["translate", "produce", "variant", "fix", "free"].includes(item.kind));
    expect(recall.length).toBeGreaterThan(0);
    expect(produce.length).toBeGreaterThan(0);

    for (const item of recall.slice(0, 60)) {
      expect(judgeBoostItem(item, { text: item.answer }).passed).toBe(true);
      expect(judgeBoostItem(item, { text: item.answer.toLowerCase().replace(/[.?]/g, "") }).passed).toBe(true);
      expect(judgeBoostItem(item, { text: "totally unrelated sentence here" }).passed).toBe(false);
      expect(judgeBoostItem(item, { text: "" }).passed).toBe(false);
    }
    for (const item of produce.slice(0, 60)) {
      expect(judgeBoostItem(item, { text: item.answer }).passed).toBe(true);
      expect(judgeBoostItem(item, { text: "totally unrelated sentence here" }).passed).toBe(false);
      expect(judgeBoostItem(item, { text: "" }).passed).toBe(false);
    }

    // 分数口径：同一份输入，recall 线（70）比 produce 线（90）宽松
    const sample = recall[0];
    const typo = sample.answer.split(/\s+/).slice(0, -1).join(" ") + " xyzzy";
    const boosted: BoostItem = { ...sample, kind: "translate" };
    const asRecall = judgeBoostItem(sample, { text: typo });
    const asProduce = judgeBoostItem(boosted, { text: typo });
    if (asRecall.score !== undefined && asProduce.score !== undefined) {
      expect(asRecall.score).toBe(asProduce.score);
      expect(asRecall.passed).toBe(asRecall.score! >= 70);
      expect(asProduce.passed).toBe(asProduce.score! >= 90);
    }
  });
});

/** 由题目本身推出「正确答案的作答载荷」（与服务层 judgeBoostItem 的入参口径一致）。 */
const answerPayload = (item: BoostItem): { pickedProblem?: boolean; text?: string; tokens?: string[]; tokenIndex?: number } => {
  switch (item.kind) {
    case "contrast":
      return { pickedProblem: Boolean(item.contrast?.isWrong) };
    case "spot":
      return { tokenIndex: (item.spotWrongIndexes?.length ? item.spotWrongIndexes[0] : item.spotWrongIndex) ?? -1 };
    case "bothright":
      return { pickedProblem: true };
    case "listen":
      return { text: item.listenText ?? "" };
    case "cloze":
      return { text: item.clozeAnswer ?? "" };
    case "rebuild":
    case "arrange":
      return { tokens: item.answer.split(/\s+/).filter(Boolean) };
    default:
      return { text: item.answer };
  }
};
