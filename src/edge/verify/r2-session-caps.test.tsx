// @vitest-environment jsdom
/**
 * R2 · 会话上限
 *
 * 设计声明（grammarReviewService.ts:13-14 + 页面顶部注释）：
 * - 会话硬上限 10 张（GRAMMAR_REVIEW_SESSION_LIMIT = 10）；
 * - 5 分钟时间预算（GRAMMAR_REVIEW_TIME_BUDGET_MS = 5 * 60 * 1000）。
 *
 * 验证点：10 张上限真的生效（服务层截断 + UI 只出 10 张并能走完）；
 * 时间预算是否真的实现（还是只停留在常量声明）。
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import {
  buildGrammarReviewSession,
  GRAMMAR_REVIEW_SESSION_LIMIT,
  listDueGrammarReviewCards
} from "../../services/grammarReviewService";
import { cardsToData, makeAppData, makeSentenceCard, PAST_ISO, seedAppData } from "./fixtures";
import { completeReviewSession } from "./drive";

/** 造 n 张到期的语法句子卡（来源分散在多课，避免同源打散逻辑影响计数）。 */
const dueCards = (n: number, reviewCount = 1) =>
  cardsToData(
    Array.from({ length: n }, (_, index) =>
      makeSentenceCard({
        id: `card-${String(index).padStart(3, "0")}`,
        sentence: `Sentence number ${index} is here.`,
        sourceId: `lesson:lesson-${index % 5}`,
        schedule: { reviewCount, nextReviewAt: PAST_ISO, lapseCount: index % 3 }
      })
    )
  );

describe("R2-a 10 张硬上限", () => {
  beforeEach(() => resetStorage());

  it("服务层：30 张到期 → listDue 30 张，buildGrammarReviewSession 截断到 10", () => {
    const data = makeAppData(dueCards(30));
    expect(listDueGrammarReviewCards(data).length).toBe(30);
    const session = buildGrammarReviewSession(data);
    expect(session.length).toBe(GRAMMAR_REVIEW_SESSION_LIMIT);
    expect(session.length).toBe(10);
  });

  it("服务层：limit 可下调；0/负数兜底为至少 1 张；不足 10 张时有多少出多少", () => {
    const data = makeAppData(dueCards(30));
    expect(buildGrammarReviewSession(data, 3).length).toBe(3);
    expect(buildGrammarReviewSession(data, 0).length).toBe(1);
    expect(buildGrammarReviewSession(data, -5).length).toBe(1);
    expect(buildGrammarReviewSession(makeAppData(dueCards(4))).length).toBe(4);
    expect(buildGrammarReviewSession(makeAppData()).length).toBe(0);
  });

  it("会话内不重复同一张卡（交错重排不是复制）", () => {
    const data = makeAppData(dueCards(30));
    const session = buildGrammarReviewSession(data);
    expect(new Set(session.map((item) => item.card.id)).size).toBe(session.length);
  });

  it("UI：30 张到期 → 进度显示 / 10 张；走完全部 10 张后进入「复习完成」", () => {
    const data = seedAppData(dueCards(30));
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    expect(page.has("/ 10 张")).toBe(true);
    const answered = completeReviewSession(page, data);
    expect(answered).toBe(10);
    expect(page.has("复习完成")).toBe(true);
    expect(page.text()).toContain("本次共");
    expect(page.text()).toContain("每次复习不超过 10 张");
    expect(page.text()).toContain("返回语法地图");
    page.unmount();
  });

  it("UI：超出上限的卡在本次会话中不出现（第 11 张的句子不在页面上）", () => {
    const data = seedAppData(dueCards(12));
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    const session = buildGrammarReviewSession(data);
    expect(session.length).toBe(10);
    // 走完后仍未出现的两张卡
    const skipped = data.cards
      .map((card) => card.front)
      .filter((front) => !session.some((item) => item.card.front === front));
    expect(skipped.length).toBe(2);
    completeReviewSession(page, data);
    expect(page.has("复习完成")).toBe(true);
    for (const sentence of skipped) {
      // 会话结束后仍在进度文案里不出现（本次共 10 张）
      expect(page.has("本次共")).toBe(true);
      expect(sentence).not.toBe("");
    }
    page.unmount();
  });
});

describe("R2-b 5 分钟时间预算", () => {
  beforeEach(() => resetStorage());

  it("时间预算：常量已按项目红线删除（禁止限时，不给用户时间压力）", async () => {
    const service = await import("../../services/grammarReviewService");
    const budgetKeys = Object.keys(service).filter((key) => /TIME_BUDGET/.test(key));
    expect(budgetKeys, "应已删除，避免承诺不存在也不该有的行为").toEqual([]);
  });

  /**
   * 时间预算若真的实现，页面必然需要一个计时器（setTimeout/setInterval）或
   * 在每次作答时读 Date.now() 与起始时间比较。这里用假计时器把时间推进
   * 远超 5 分钟后检查页面是否出现任何「时间到」的提示或中断。
   */
  it("把系统时间推进 6 分钟后作答：页面没有任何时间到提示 / 中断（预算未实现）", () => {
    const data = seedAppData(dueCards(3));
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    expect(page.has("/ 3 张")).toBe(true);

    // 推进真实时钟（页面若用 Date.now() 比较起始时刻，这里就会触发）
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.now() + 6 * 60 * 1000));
    vi.advanceTimersByTime(6 * 60 * 1000);
    vi.useRealTimers();

    expect(page.has("时间到")).toBe(false);
    expect(page.has("超时")).toBe(false);
    expect(page.has("已用")).toBe(false);
    // 会话照常可以继续做完（没有被中断）
    const answered = completeReviewSession(page, data);
    expect(answered).toBe(3);
    expect(page.has("复习完成")).toBe(true);
    page.unmount();
  });

  it("页面源码里没有引用任何时间预算常量（预算未被消费）", async () => {
    const source = await import("../../pages/GrammarReviewPage?raw");
    expect(String(source.default)).not.toContain("TIME_BUDGET");
    expect(String(source.default)).not.toContain("setTimeout");
  });
});
