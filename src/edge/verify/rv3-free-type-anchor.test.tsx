// @vitest-environment jsdom
/**
 * RV3 · free_type 的「来源锚点」是否可作答（清单项 3）
 *
 * 设计声明：promptText 用 `card.note` 做锚点（`${note}——把那句话自己写出来`），
 * note 为空则退化为「把那句 N 个词的句子自己写出来」。
 *
 * 真实场景的 note 长什么样（全库核对，见每个用例的断言）：
 * - lesson 卡（lessonService.ts:222）：`语法课核心句：${episode} ${title}` → 不含句子，不泄题
 * - hunt 卡（huntService.ts:305）：`找错案件：${title}（${罪名}）` → 不含句子，但**句子本身是错的**
 * - diary 卡（diaryService.ts:364）：`我的英文日记 · ${dateKey}` → 不含句子
 * - boost 卡（GrammarBoostPage.tsx:370）：`趁热练：${episode} ${title}` → 不含句子
 *
 * 所以「照抄泄题」不成立；真正的问题是 hunt 卡的**答案语义**：
 * 卡面（front）是案件原文（含植错），改对后的句子反而不通过判分。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import { huntCases } from "../../data/huntCases";
import { grammarLessons } from "../../data/grammarLessons";
import { addLessonCoreSentence } from "../../services/lessonService";
import { addHuntGapSentences } from "../../services/huntService";
import { buildGrammarReviewTask, judgeGrammarFreeType, type GrammarReviewCard } from "../../services/grammarReviewService";
import { cardsToData, makeAppData, makeSentenceCard, PAST_ISO, seedAppData } from "./fixtures";
import { flushAsync, planReviewSession } from "./drive";
import type { Mounted } from "../harness";
import type { Card, Schedule } from "../../types";

const FREE_TYPE_CARD = (id: string, front: string, note: string, sourceId: string): GrammarReviewCard => ({
  card: {
    id,
    type: "sentence",
    front,
    back: "",
    note,
    sourceId,
    tags: ["语法"],
    status: "review",
    priority: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  } as Card,
  schedule: {
    cardId: id,
    easeFactor: 2.5,
    intervalDays: 1,
    reviewCount: 2,
    lapseCount: 0,
    nextReviewAt: PAST_ISO
  } as Schedule
});

const mountReview = () => mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");

const promptOf = (page: Mounted) =>
  (page.container.querySelector(".lesson-quiz-prompt")?.textContent ?? "").trim();

describe("RV3-a note 锚点不泄题（全库口径核对）", () => {
  beforeEach(() => resetStorage());

  it("lesson 卡的 note 是「课号 + 课名」，不含句子本身", () => {
    const lesson = grammarLessons[0];
    const task = buildGrammarReviewTask(
      FREE_TYPE_CARD("l1", lesson.targetSentence, `语法课核心句：${lesson.episode} ${lesson.title}`, `lesson:${lesson.id}`)
    );
    expect(task.mode).toBe("free_type");
    expect(task.promptText).toContain(lesson.episode);
    // 关键：题面里不能出现答案句
    expect(task.promptText).not.toContain(lesson.targetSentence);
    expect(task.promptText).toContain("把那句话自己写出来");
  });

  it("diary / boost 卡的 note 同样只有来源标签，不含句子", () => {
    const sentence = "Yesterday I went to the park.";
    const diary = buildGrammarReviewTask(FREE_TYPE_CARD("d1", sentence, "我的英文日记 · 2026-09-21", "diary:e1"));
    expect(diary.promptText).not.toContain(sentence);
    const boost = buildGrammarReviewTask(FREE_TYPE_CARD("b1", sentence, "趁热练：小美的一天 ① 我是谁", "boost:lesson-01-am"));
    expect(boost.promptText).not.toContain(sentence);
  });

  it("note 为空时退化成词数提示（不给出任何答案线索）", () => {
    const task = buildGrammarReviewTask(FREE_TYPE_CARD("n1", "I am drawing a picture.", "", "lesson:x"));
    expect(task.promptText).toBe("把那句 5 个词的句子自己写出来");
  });

  it("note 为纯空白（空格）时也退化成词数提示，不产生「——把那句话自己写出来」的空锚点", () => {
    const task = buildGrammarReviewTask(FREE_TYPE_CARD("n2", "I am drawing a picture.", "   ", "lesson:x"));
    expect(task.promptText).toBe("把那句 5 个词的句子自己写出来");
  });

  it("界面上看到的题面与 note 一致，且输入框在（真作答入口存在）", () => {
    const note = "语法课核心句：小美的一天 ① 我是谁";
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "ft",
          sentence: "I am Xiaomei.",
          note,
          schedule: { reviewCount: 2, nextReviewAt: PAST_ISO, intervalDays: 1 }
        })
      ])
    );
    const page = mountReview();
    expect(page.has("自己把句子写出来")).toBe(true);
    expect(promptOf(page)).toBe(`${note}——把那句话自己写出来`);
    expect(page.container.querySelector("textarea")).not.toBeNull();
    page.unmount();
  });
});

describe("RV3-b hunt 卡的答案语义（front 已修为正确句，2026-09-21）", () => {
  beforeEach(() => resetStorage());

  it("hunt 卡 front 已是改正后的句子（2026-09-21 修；grammarNote 记录针对哪个错点）", () => {
    const caseItem = huntCases[0];
    const { data } = addHuntGapSentences(makeAppData(), caseItem, caseItem.errors.map((error) => error.tokenIndex));
    const card = data.cards[0];
    // 修复前这里是 `caseItem.tokens.join(" ")`（含错原文）——与函数文档「正面 = 完整正确句」相反
    expect(card.front, "正面不应再等于含错原文").not.toBe(caseItem.tokens.join(" "));
    /**
     * 逐**位置**核对：不能只查「句子含不含这个字符串」——
     * `was` 之类的高频词在句中别处可能合法出现（如 `We was tired` 里的 was 是错的，
     * 但同句若还有一处正确的 was，全串匹配会误报）。
     * 这里按错点的下标逐位比对，只要求「该位置不再是原来的错形」。
     */
    const before = caseItem.tokens;
    const after = card.front.split(/\s+/);
    for (const error of caseItem.errors) {
      const wrongAt = before[error.tokenIndex];
      // 删词型会让后续下标整体前移，这种情形不在逐位比对的适用范围（单独由 RV9 覆盖）
      if (error.editOp === "delete") continue;
      expect(after[error.tokenIndex], `下标 ${error.tokenIndex} 处应已被改正`).not.toBe(wrongAt);
    }
    const details = data.sentenceDetails.find((item) => item.cardId === card.id);
    expect(details?.grammarNote, "grammarNote 仍记录本卡针对的错点与改正").toContain("→");
  });

  it("free_type 判分方向已正：改对后的句子通过、含错原文不通过", () => {
    const caseItem = huntCases[0];
    const raw = caseItem.tokens.join(" ");
    const { data } = addHuntGapSentences(makeAppData(), caseItem, caseItem.errors.map((error) => error.tokenIndex));
    const corrected = data.cards[0].front;

    // 修复前：照抄含错原文得 100 分通过，而改对后只有 88 分不通过（方向完全反了）
    expect(judgeGrammarFreeType(corrected, corrected), "改对后的句子应判通过").toEqual({
      passed: true,
      score: 100
    });
    const asRaw = judgeGrammarFreeType(raw, corrected);
    expect(asRaw.passed, "含错原文不应判通过").toBe(false);
    expect(asRaw.score, "含错原文得分应低于阈值").toBeLessThan(90);
  });
});

describe("RV3-c lesson 卡的 free_type 可作答性", () => {
  beforeEach(() => resetStorage());

  it("课程核心句入队后，free_type 用原句作答可以通过（正常路径无阻碍）", () => {
    const lesson = grammarLessons[0];
    const data = addLessonCoreSentence(makeAppData(), lesson);
    const card = data.cards.find((item) => item.sourceId === `lesson:${lesson.id}`)!;
    const schedule = data.schedules.find((item) => item.cardId === card.id)!;
    // 新入队卡 intervalDays=0 → 不立即到期（见 RV4-c），这里手工模拟「已复习两次」
    const task = buildGrammarReviewTask({ card, schedule: { ...schedule, reviewCount: 2, intervalDays: 1 } }, data.sentenceDetails);
    expect(task.mode).toBe("free_type");
    expect(task.promptText).not.toContain(lesson.targetSentence);
    expect(judgeGrammarFreeType(lesson.targetSentence, task.sentence).passed).toBe(true);
  });

  it("长句（53 词）漏 5 个词仍算通过——判分尺度随句长放松（体验项）", () => {
    const longest = huntCases.slice().sort((a, b) => b.tokens.length - a.tokens.length)[0];
    const sentence = longest.tokens.join(" ");
    const task = buildGrammarReviewTask(FREE_TYPE_CARD("long", sentence, `找错案件：${longest.title}`, `hunt:${longest.id}`));
    expect(task.sentence.split(/\s+/).length).toBe(longest.tokens.length);

    // 阈值是固定 90%，但 diffScore 的分母是「对齐后的 token 数」——
    // 长句里漏掉 5 个词（词块成组缺失）只损失约 9 分，仍在阈值之上。
    const dropped5 = longest.tokens.slice(0, longest.tokens.length - 5).join(" ");
    expect(judgeGrammarFreeType(dropped5, sentence)).toEqual({ passed: true, score: 91 });
    const dropped6 = longest.tokens.slice(0, longest.tokens.length - 6).join(" ");
    expect(judgeGrammarFreeType(dropped6, sentence).passed).toBe(false);
    // 短句同一口径则很严：5 词句换掉一个词就只有 80 分
    expect(judgeGrammarFreeType("I am drawing the picture.", "I am drawing a picture.")).toEqual({
      passed: false,
      score: 80
    });
  });
});
