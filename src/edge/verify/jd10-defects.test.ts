/**
 * JD10 · 判题/复习区域的缺陷复现（willing-to-fail 边界断言）
 *
 * 这组用例记录的是**当前真实行为**，其中若干条是缺陷：断言写成「缺陷仍然存在」，
 * 修好之后这些用例会失败，正好提醒把断言翻过来。
 *
 * 命名约定：FAIL-<编号> 前缀 = 已确认缺陷；PASS-<编号> = 验证过没问题的方向。
 */
import { describe, expect, it, vi } from "vitest";
import { applyReview } from "../../services/reviewService";
import {
  buildGrammarReviewSession,
  isMasteredByOutput,
  listDueGrammarReviewCards,
  judgeGrammarFreeType
} from "../../services/grammarReviewService";
import { buildBoostItems } from "../../services/grammarBoostService";
import { diffScore, compareText } from "../../services/diffService";
import { grammarLessons } from "../../data/grammarLessons";
import { huntCases } from "../../data/huntCases";
import { getMistakeGroupsByDate } from "../../services/mistakeBookService";
import { cardsToData, makeAppData, makeSentenceCard, PAST_ISO } from "./fixtures";

const grammarCard = (id: string, intervalDays = 5, reviewCount = 2) =>
  cardsToData([
    makeSentenceCard({
      id,
      sentence: "I am drawing a picture.",
      schedule: { reviewCount, intervalDays, nextReviewAt: PAST_ISO }
    })
  ]);

describe("JD10 · FAIL-1（已修 2026-09-21）看答案的卡必须能回到复习会话", () => {
  it("看答案后 10 分钟，卡回到语法复习会话（兑现「这张卡很快会再来见你」）", () => {
    const base = makeAppData(grammarCard("c1"));
    expect(listDueGrammarReviewCards(base)).toHaveLength(1);

    const after = applyReview(base, base.cards[0], "recall", 1, "I am drawing a picture.");
    // applyReview 的 rating=1 分支把 intervalDays 归零（语义是「10 分钟后再来」，不是「从未复习」）
    expect(after.schedules[0].intervalDays, "rating=1 → intervalDays=0").toBe(0);
    // 修复前：listDueGrammarReviewCards 单看 intervalDays === 0 当哨兵，卡被永久排除。
    // 现在哨兵是「三字段都还是初始值」，失败过的卡（reviewCount/lapseCount 已 +1）照常回来。
    expect(listDueGrammarReviewCards(after), "刚失败还没到 10 分钟，先不出来").toHaveLength(0);

    const in11min = new Date(Date.now() + 11 * 60 * 1000);
    const in2days = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    expect(listDueGrammarReviewCards(after, in11min), "10 分钟后应回来").toHaveLength(1);
    expect(listDueGrammarReviewCards(after, in2days), "再往后仍在队列里").toHaveLength(1);
    // 真到 10 分钟后组会话时也应出现（组会话用真实 now，这里用假时钟推进）
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.now() + 11 * 60 * 1000));
    expect(buildGrammarReviewSession(after, 10), "会话里应出现").toHaveLength(1);
    vi.useRealTimers();
  });

  it("对照：从未复习过的新卡仍不立即到期（上一轮修的行为不能被破坏）", () => {
    const fresh = makeAppData(
      cardsToData([
        makeSentenceCard({
          id: "fresh",
          sentence: "I am drawing a picture.",
          schedule: { reviewCount: 0, intervalDays: 0, nextReviewAt: PAST_ISO }
        })
      ])
    );
    expect(listDueGrammarReviewCards(fresh), "刚入队、从未复习的卡不该立刻到期").toHaveLength(0);
  });

  it("对照：词卡（非语法句子卡）不受影响——到期队列只按 nextReviewAt", () => {
    const data = makeAppData(
      cardsToData([
        makeSentenceCard({
          id: "s1",
          sentence: "I am drawing a picture.",
          tags: ["其他"],
          schedule: { reviewCount: 2, intervalDays: 5, nextReviewAt: PAST_ISO }
        })
      ])
    );
    const after = applyReview(data, data.cards[0], "recall", 1, "x");
    expect(after.schedules[0].intervalDays).toBe(0);
    // 非语法卡走的是 reviewService.getDueCards（不筛 intervalDays）
    expect(listDueGrammarReviewCards(after)).toHaveLength(0); // 不是语法卡，本来就不进语法队列
  });
});

describe("JD10 · FAIL-2 通用复习页把「背题面」写成两次自由输出", () => {
  it("lesson 核心句在 /review 的题面就是答案本身（back 为空 → 回退 front）", () => {
    // addLessonCoreSentence 写入 back: input.translation = ""
    const data = makeAppData(
      cardsToData([
        makeSentenceCard({
          id: "g-core",
          sentence: "I think she is tired.",
          sourceId: "lesson:lesson-36-think-that",
          schedule: { reviewCount: 0, intervalDays: 1, nextReviewAt: PAST_ISO }
        })
      ])
    );
    // 复刻写入口径
    const withBack = { ...data, cards: data.cards.map((card) => ({ ...card, back: "" })) };
    const card = withBack.cards[0];
    // ReviewPage: promptText = mode === "recognize" ? front : back || front
    const promptText = card.back || card.front;
    expect(promptText, "题面 = 答案").toBe(card.front);

    // 用户照着题面抄一遍 → 与答案逐字相同 → 满分
    expect(judgeGrammarFreeType(promptText, card.front).passed).toBe(true);
    expect(judgeGrammarFreeType(promptText, card.front).score).toBe(100);
  });

  it("/review 写 recall+rating4，两条就够 isMasteredByOutput 判定为「两次输出」", () => {
    let data = makeAppData(grammarCard("g2", 1, 0));
    // ReviewPage.chooseMode(sentence card) === "recall"；用户点「熟练」= rating 4
    data = applyReview(data, data.cards[0], "recall", 4, "");
    data = applyReview(data, data.cards[0], "recall", 4, "");
    expect(data.reviews.map((review) => [review.mode, review.rating])).toEqual([
      ["recall", 4],
      ["recall", 4]
    ]);
    // 缺陷：零次自由输出，却被判「输出连续 2 次一次通过」
    expect(isMasteredByOutput(data.reviews, "g2"), "缺陷：无自由输出也算输出两次").toBe(true);

    // 之后任何一次 free_type 通过都会让页面把卡置 mastered（applyMasteredStatus）
    // —— 即「零自由输出」+「一次自由输出」= 被判定为「输出连续两次一次通过」
    expect(isMasteredByOutput([...data.reviews, { cardId: "g2", mode: "recall", rating: 4 }], "g2")).toBe(true);
  });
});

describe("JD10 · FAIL-3 rating=3 分支把间隔锁死在 1 天（语法句子卡的死亡螺旋）", () => {
  it("连续 6 次 rating=3，intervalDays 恒为 1、easeFactor 恒为 2.5", () => {
    let data = makeAppData(grammarCard("g3", 1, 0));
    const trail: number[] = [];
    for (let index = 0; index < 6; index += 1) {
      data = applyReview(data, data.cards[0], "recall", 3, "I am drawing a picture.");
      trail.push(data.schedules[0].intervalDays);
    }
    expect(trail, "缺陷：rating=3 的语法卡间隔永远停在 1 天").toEqual([1, 1, 1, 1, 1, 1]);
    expect(data.schedules[0].easeFactor).toBe(2.5);
    // 永远不会成为 mastered（要求 rating=4）
    expect(data.cards[0].status).toBe("review");
  });

  it("对照：非语法句子卡 rating=3 会放大间隔（同一函数、不同分支口径）", () => {
    let data = makeAppData(
      cardsToData([
        makeSentenceCard({
          id: "w3",
          sentence: "I am drawing a picture.",
          tags: ["其他"],
          schedule: { reviewCount: 0, intervalDays: 1, nextReviewAt: PAST_ISO }
        })
      ])
    );
    data = applyReview(data, data.cards[0], "recall", 3, "x");
    expect(data.schedules[0].intervalDays).toBe(3); // round(1 * 2.5) = 3
  });
});

describe("JD10 · FAIL-4 语法句子卡 rating=4 的间隔指数爆炸（1→3→11→41→159 天）", () => {
  it("四次「一次答对」就把复习间隔推到 159 天，第 4 次直接 mastered", () => {
    let data = makeAppData(grammarCard("g4", 1, 0));
    const trail: Array<{ interval: number; status: string }> = [];
    for (let index = 0; index < 4; index += 1) {
      data = applyReview(data, data.cards[0], "recall", 4, "I am drawing a picture.");
      trail.push({ interval: data.schedules[0].intervalDays, status: data.cards[0].status });
    }
    expect(trail).toEqual([
      { interval: 3, status: "review" },
      { interval: 11, status: "review" },
      { interval: 41, status: "review" },
      { interval: 159, status: "mastered" }
    ]);
    // 与「语法卡不放大间隔」的设计声明（rating=3 特判）口径不一致：
    // 同一张卡走 rating=4 时，反而比普通词卡跑得还快（多乘 1.3）。
    expect(
      grammarLessons.length,
      "设计声明：多次尝试后通过不放大间隔，防止未掌握卡被排远"
    ).toBeGreaterThan(0);
  });
});

describe("JD10 · FAIL-5 spot 题标注在句中出现多次时只认第一个，点真正的错处判错", () => {
  const cleanWord = (token: string): string => token.replace(/[.,!?;:]$/g, "");
  const locate = (tokens: string[], mark: string): number => {
    const cleaned = tokens.map((token) => cleanWord(token).toLowerCase());
    return cleaned.indexOf(cleanWord(mark).toLowerCase());
  };

  it("lesson-142：句里有 2 个 will，标注命中第一个，但真正的错处是第 5 个词", () => {
    const lesson = grammarLessons.find((item) => item.id === "lesson-142-as-soon-as")!;
    const contrast = (lesson.contrast ?? []).find((item) => item.wrongMark === "will")!;
    const tokens = contrast.wrong.split(/\s+/).filter(Boolean);
    const hitIndex = locate(tokens, contrast.wrongMark!);
    const hitIndexes = tokens
      .map((token, index) => (cleanWord(token).toLowerCase() === "will" ? index : -1))
      .filter((index) => index >= 0);

    expect(contrast.wrong).toBe("As soon as I will finish, I will eat.");
    expect(contrast.correct).toBe("As soon as I finish, I will eat.");
    expect(hitIndexes, "句里有两个 will").toEqual([4, 7]);
    // locateMarkedTokens 用 indexOf → 只拿到第 4 个（"I will"）——那正是要删掉的那个，
    // 但保留的 "I will eat" 也是 will；两处都判对，题目区分度被抹平。
    expect(hitIndex).toBe(4);
    // 判定「点中任一 will 都算对」意味着用户不需要理解「as soon as 后不用 will」
    expect(tokens[hitIndex]).toBe("will");
    expect(tokens[hitIndexes[1]]).toBe("will");
  });

  it("全库共 7 组标注在句中重复出现（判分容错被放大）", () => {
    const ambiguous: string[] = [];
    for (const lesson of grammarLessons) {
      for (const [index, contrast] of (lesson.contrast ?? []).entries()) {
        if (!contrast.wrongMark || contrast.bothRight) continue;
        const cleaned = contrast.wrong.split(/\s+/).filter(Boolean).map((token) => cleanWord(token).toLowerCase());
        const mark = cleanWord(contrast.wrongMark).toLowerCase();
        const hits = cleaned.map((token, at) => (token === mark ? at : -1)).filter((at) => at >= 0);
        if (hits.length > 1) ambiguous.push(`${lesson.id}[${index}] "${contrast.wrongMark}" → ${hits.join(",")}`);
      }
    }
    expect(ambiguous.length, "标注重复出现的对比组").toBe(7);
  });

  it("其中 2 组「标注带句末标点」是硬错：标注指向句末词，判分只认句中第一个同形词", () => {
    const hardErrors = [
      {
        lessonId: "lesson-66-too-to",
        wrong: "It is too heavy to carry it.",
        mark: "it.",
        acceptedWord: "It", // 下标 0（capital It，正确句里本来就有的那个）
        realErrorWord: "it." // 下标 6（句末多余的那个 —— 标注用 "it." 明确指向它）
      },
      {
        lessonId: "lesson-170-both-and",
        wrong: "She can both sing and dance both.",
        mark: "both.",
        acceptedWord: "both", // 下标 2（正确句中保留的那个）
        realErrorWord: "both." // 下标 6（句末多余的那个）
      }
    ];
    for (const entry of hardErrors) {
      const lesson = grammarLessons.find((item) => item.id === entry.lessonId)!;
      const cleaned = entry.wrong.split(/\s+/).filter(Boolean).map((token) => cleanWord(token).toLowerCase());
      const mark = cleanWord(entry.mark).toLowerCase();
      const hits = cleaned.map((token, at) => (token === mark ? at : -1)).filter((at) => at >= 0);
      // locateMarkedTokens 用 indexOf → 命中第一个；标注带 "." 说明作者指的是句末那个
      expect(hits.length, `${entry.lessonId} 句中有多个 ${entry.mark}`).toBe(2);
      expect(cleaned[hits[0]], "接受的是第一个同形词（正确句里也有的那个）").toBe(entry.acceptedWord.toLowerCase());
      expect(entry.wrong.split(/\s+/)[entry.wrong.split(/\s+/).length - 1], "真正的错处在句末").toBe(entry.realErrorWord);
      expect(lesson.contrast?.some((item) => item.wrongMark === entry.mark)).toBe(true);
    }
  });
});

describe("JD10 · FAIL-6（已修 2026-09-21）双正解句不再被当错句出题", () => {
  /**
   * 修复前：`contrast.bothRight === true` 的条目里 `wrong` 字段其实**也是正确说法**，
   * 但同课对比池与旧课点混题两条通道都无条件写 `isWrong: true`，
   * 于是练习里拿一句正确的话问「这句话有问题吗」，用户答「没问题」被判错。
   * 现在两条通道都跳过 bothRight 条，且 L114/117/118 的三处数据本身已改成双正解。
   */
  it("全库扫一轮：没有任何双正解句以「有点问题」的形态出题", () => {
    const bothRightSentences = new Set(
      grammarLessons.flatMap((lesson) =>
        (lesson.contrast ?? []).filter((item) => item.bothRight).map((item) => item.wrong)
      )
    );
    expect(bothRightSentences.size).toBeGreaterThan(0);
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      for (let round = 0; round < 5; round += 1) {
        for (const item of buildBoostItems(lesson.id, 1, { round })) {
          if (item.kind !== "contrast") continue;
          if (bothRightSentences.has(item.contrast?.sentence ?? "")) {
            offenders.push(`${lesson.id} round=${round}: "${item.contrast?.sentence}"`);
          }
        }
      }
    }
    expect(offenders, `双正解句被当错句出题：\n${offenders.slice(0, 6).join("\n")}`).toEqual([]);
  });
});

describe("JD10 · FAIL-7 90 分通过线随句长单调放宽（长句上 free_type 形同虚设）", () => {
  it("10 词以上句子错一个词仍 ≥90 分；hunt 案件句 100% ≥10 词", () => {
    const score = (wordCount: number) => {
      const expected = Array.from({ length: wordCount }, (_, index) => `w${index}`).join(" ");
      const answer = ["zzz", ...expected.split(" ").slice(1)].join(" ");
      return diffScore(compareText(expected, answer, false));
    };
    expect(score(5)).toBe(80);
    expect(score(10)).toBe(90);
    expect(score(15)).toBe(93);
    expect(score(53)).toBe(98);

    const huntLengths = huntCases.map((item) => item.tokens.length);
    const ge10 = huntLengths.filter((count) => count >= 10).length;
    expect(ge10, "hunt 案件句全部 ≥10 词").toBe(huntCases.length);

    // 漏写一个词仍通过的 hunt 句占比
    let passed = 0;
    for (const huntCase of huntCases) {
      const sentence = huntCase.tokens.join(" ");
      const words = sentence.split(/\s+/);
      const dropped = [words[1] ?? "", ...words.slice(2)].filter(Boolean).join(" ");
      if (judgeGrammarFreeType(dropped, sentence).passed) passed += 1;
    }
    expect(passed / huntCases.length, "漏 1 词仍判通过的 hunt 句占比").toBeGreaterThan(0.9);
  });
});

describe("JD10 · FAIL-8 语法复习写的 review.answer 是正确句而非用户输入", () => {
  it("看答案（rating 1）时 answer 字段写的是 task.sentence，错词书里显示成「用户写了正确句」", () => {
    const base = makeAppData(grammarCard("c8"));
    // GrammarReviewPage.finishCard: applyReview(..., task.sentence)
    const after = applyReview(base, base.cards[0], "recall", 1, "I am drawing a picture.");
    expect(after.reviews[0].answer).toBe("I am drawing a picture.");

    // mistakeBookService 把 review.answer 当用户的错误答案展示
    const entries = getMistakeGroupsByDate(after).flatMap((group) => group.entries);
    expect(entries).toHaveLength(1);
    expect(entries[0].answers, "缺陷：错词书显示用户「写了正确答案」").toEqual(["I am drawing a picture."]);
    expect(entries[0].card.type).toBe("sentence");
  });
});

describe("JD10 · PASS-A diffService 的缩写等价与撇号保护方向正确", () => {
  it("It's ↔ It is 互通；its / lets 不互通", () => {
    const score = (expected: string, answer: string) => diffScore(compareText(expected, answer, false));
    expect(score("It's cold today.", "It is cold today.")).toBe(100);
    expect(score("It's cold today.", "Its cold today.")).toBeLessThan(100);
    expect(score("Let's go to the park.", "Lets go to the park.")).toBeLessThan(100);
  });
});

describe("JD10 · PASS-B rating 1/2/4 分支的 nextReviewAt 与文案一致", () => {
  it("rating=1 → 10 分钟；rating=2 → 1 天；rating=4 → 拉长", () => {
    const base = makeAppData(grammarCard("c9", 5, 2));

    const r1 = applyReview(base, base.cards[0], "recall", 1, "x");
    const delta1 = (Date.parse(r1.schedules[0].nextReviewAt) - Date.now()) / 60000;
    expect(delta1).toBeGreaterThan(9);
    expect(delta1).toBeLessThan(11);
    expect(r1.schedules[0].lapseCount).toBe(1);

    const r2 = applyReview(base, base.cards[0], "recall", 2, "x");
    const delta2 = (Date.parse(r2.schedules[0].nextReviewAt) - Date.now()) / 86400000;
    expect(delta2).toBeGreaterThan(0.99);
    expect(delta2).toBeLessThan(1.01);
    expect(r2.schedules[0].lapseCount).toBe(0);

    const r4 = applyReview(base, base.cards[0], "recall", 4, "x");
    expect(r4.schedules[0].intervalDays).toBeGreaterThan(5);
  });
});

describe("JD10 · PASS-C 通用页与语法页对 rating 的语义一致（4=最熟练）", () => {
  it("两页都把「一次通过/熟练」映射为 4，把「看答案」映射为 1", () => {
    expect(isMasteredByOutput).toBeTypeOf("function");
    // GrammarReviewPage.ratingForOutcome：revealed → 1；attempts<=1 → 4；否则 3
    const ratingForOutcome = (attempts: number, revealed: boolean): 1 | 2 | 3 | 4 =>
      revealed ? 1 : attempts <= 1 ? 4 : 3;
    expect(ratingForOutcome(1, false)).toBe(4);
    expect(ratingForOutcome(5, false)).toBe(3);
    expect(ratingForOutcome(0, true)).toBe(1);
    // ReviewPage 的按钮语义：1 忘记 / 2 模糊 / 3 记得 / 4 熟练 —— 与上表一致
  });
});
