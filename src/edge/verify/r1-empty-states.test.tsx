// @vitest-environment jsdom
/**
 * R1 · 空态处理
 *
 * 验证目标：复习队列为空时复习页给出清晰引导；某课从未学过时强化页给出清晰引导。
 * 判据：不出现空白页/报错，且给出「下一步该做什么」的出口。
 *
 * 注意：页面上的出口大多是 <Link>（不是 <button>），所以用 exitsOf()（按钮 + 链接）。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import { cardsToData, DONE_LESSON_ID, exitsOf, makeSentenceCard, seedAppData, PAST_ISO } from "./fixtures";

const FUTURE_ISO = "2099-01-01T00:00:00.000Z";

const mountReview = () => mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
const mountBoost = (lessonId: string) =>
  mountPage(<GrammarBoostPage />, `/grammar/boost/${lessonId}`, "/grammar/boost/:lessonId");

describe("R1-a 复习页空态", () => {
  beforeEach(() => resetStorage());

  it("完全没有语法卡：空态文案 + 返回语法地图出口，且不露出答题区", () => {
    seedAppData({});
    const page = mountReview();
    expect(page.has("今天没有到期的语法复习")).toBe(true);
    expect(page.has("上完新课，错过的句子和核心句型明天会排进这里")).toBe(true);
    expect(exitsOf(page.container)).toContain("返回语法地图");
    expect(page.has("选词补全句子")).toBe(false);
    expect(page.has("把句子拼回去")).toBe(false);
    expect(page.has("自己把句子写出来")).toBe(false);
    page.unmount();
  });

  it("有卡但都没到期（nextReviewAt 在未来）：空态，不露出题目", () => {
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "card-future",
          sentence: "I am drawing a picture.",
          schedule: { reviewCount: 1, nextReviewAt: FUTURE_ISO }
        })
      ])
    );
    const page = mountReview();
    expect(page.has("今天没有到期的语法复习")).toBe(true);
    expect(page.has("I am drawing a picture")).toBe(false);
    page.unmount();
  });

  it("suspended 与非语法标签的句子卡都不进队列（即使到期）", () => {
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "card-susp",
          sentence: "He is my brother.",
          status: "suspended",
          schedule: { nextReviewAt: PAST_ISO }
        }),
        makeSentenceCard({
          id: "card-tag",
          sentence: "They are playing football.",
          tags: ["日常"],
          schedule: { nextReviewAt: PAST_ISO }
        }),
        makeSentenceCard({
          id: "card-word",
          sentence: "I am drawing a picture.",
          tags: ["语法"],
          // 已复习过（reviewCount ≥ 1）才算「到期」——未开始的卡不立即到期
          schedule: { reviewCount: 1, nextReviewAt: PAST_ISO }
        })
      ])
    );
    const page = mountReview();
    // 只有第三张（语法 + sentence）该进队列 → 总量 1
    expect(page.has("/ 1 张")).toBe(true);
    expect(page.has("They are playing football")).toBe(false);
    expect(page.has("He is my brother")).toBe(false);
    page.unmount();
  });

  /**
   * ✅ 已修（2026-09-20）：此前 normalizeSchedules 会给每张缺计划的卡补一条
   * nextReviewAt = nowIso() 的计划，于是「从未复习过的新语法卡」（reviewCount = 0）
   * 一入库就立刻到期，与空态文案「上完新课，错过的句子和核心句型**明天**会排进这里」
   * 自相矛盾，也让同一页面同时显示「未开始 1」和「第 1 / 1 张」。
   * 现在：未开始的卡不立即到期（与 reviewService 的 new 卡口径对齐）。
   */
  it("未复习过的新语法卡不立即到期（与空态文案「明天排进这里」一致）", () => {
    seedAppData(cardsToData([makeSentenceCard({ id: "card-nosched", sentence: "She is a nurse.", schedule: null })]));
    const page = mountReview();
    // 新卡不进队列 → 显示空态（而不是「未开始 1」与「第 1 / 1 张」自相矛盾）
    expect(page.has("今天没有到期的语法复习")).toBe(true);
    expect(page.has("____ is a nurse."), "未开始的卡不该立刻出题").toBe(false);
    expect(page.has("/ 1 张"), "不该显示会话进度").toBe(false);
    page.unmount();
  });

  it("累计掌握视图只在有语法卡时出现；空库时不渲染掌握条", () => {
    seedAppData({});
    const empty = mountReview();
    expect(empty.has("已掌握")).toBe(false);
    empty.unmount();

    seedAppData(
      cardsToData([
        makeSentenceCard({ id: "card-due", sentence: "I am drawing a picture.", schedule: { nextReviewAt: PAST_ISO } })
      ])
    );
    const withCard = mountReview();
    expect(withCard.has("语法句型")).toBe(true);
    expect(withCard.has("已掌握 0")).toBe(true);
    expect(withCard.has("共 1 句")).toBe(true);
    withCard.unmount();
  });
});

describe("R1-b 强化页空态 / 准入态", () => {
  beforeEach(() => resetStorage());

  it("不存在这一课：显示「课程不存在」+ 返回课程地图", () => {
    seedAppData({});
    const page = mountBoost("lesson-does-not-exist");
    expect(page.has("找不到这一课")).toBe(true);
    expect(page.has("课程不存在")).toBe(true);
    expect(exitsOf(page.container)).toContain("返回课程地图");
    page.unmount();
  });

  it("课存在但从未学过：显示「先上完这一课」+ 去上课入口，不露出档位选择", () => {
    seedAppData({ grammarLessonsDone: [], grammarLessonStagesDone: {} });
    const page = mountBoost(DONE_LESSON_ID);
    expect(page.has("先上完这一课")).toBe(true);
    expect(page.has("趁热练是学完一节课之后的加练")).toBe(true);
    expect(exitsOf(page.container)).toContain("去上这一课");
    expect(page.has("再认一次")).toBe(false);
    page.unmount();
  });

  it("已学完的课：三档选择，每档带题量与时长（允许只做一档的前提）", () => {
    seedAppData({
      grammarLessonsDone: [DONE_LESSON_ID],
      grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] }
    });
    const page = mountBoost(DONE_LESSON_ID);
    expect(page.has("再认一次")).toBe(true);
    expect(page.has("自己想")).toBe(true);
    expect(page.has("换你来说")).toBe(true);
    expect(page.has("4 题，约 2 分钟")).toBe(true);
    expect(page.has("5 题，约 4 分钟")).toBe(true);
    expect(page.has("3 题，约 4 分钟")).toBe(true);
    expect(page.has("做一档就够，不想做也可以直接走")).toBe(true);
    expect(exitsOf(page.container)).toContain("今天先到这");
    page.unmount();
  });
});
