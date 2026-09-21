// @vitest-environment jsdom
/**
 * RV5 · 会话边界（清单项 5）
 *
 * 覆盖：0 张到期（空态）、1 张、恰好 10 张、超过 10 张（截断与留到下次）、
 * 中途点「今天先到这里」离开后重进（未完成的卡还在不在队列、已评分的卡有没有排到未来）。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import {
  buildGrammarReviewSession,
  GRAMMAR_REVIEW_SESSION_LIMIT,
  listDueGrammarReviewCards
} from "../../services/grammarReviewService";
import { cardsToData, exitsOf, makeSentenceCard, PAST_ISO, readAppData, seedAppData } from "./fixtures";
import { flushAsync, planReviewSession } from "./drive";
import type { Mounted } from "../harness";

const SENTENCE = (index: number) => `Sentence number ${index} is here.`;

/** 造 n 张到期语法卡（来源分散，避免交错逻辑影响计数）；reviewCount 交替 0/1 保证题型多样。 */
const expectedReviewCount = (index: number) => index % 2;

const dueCards = (n: number) =>
  cardsToData(
    Array.from({ length: n }, (_, index) =>
      makeSentenceCard({
        id: `bd-${String(index).padStart(3, "0")}`,
        sentence: SENTENCE(index),
        note: `语法课核心句：小美的一天 ① 我是谁`,
        sourceId: `lesson:lesson-${index % 5}`,
        schedule: { reviewCount: expectedReviewCount(index), nextReviewAt: PAST_ISO, intervalDays: 1 }
      })
    )
  );

/** bd-013 → 13 */
const indexOfCardId = (id: string) => Number(id.slice(3));

const mountReview = () => mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
const buttonsOf = (page: Mounted) => Array.from(page.container.querySelectorAll("button")) as HTMLButtonElement[];

const answer = async (page: Mounted, step: ReturnType<typeof planReviewSession>["steps"][number]) => {
  if (step.mode === "cloze") {
    buttonsOf(page).find((item) => !item.disabled && item.textContent?.trim() === step.answer)?.click();
  } else if (step.mode === "rebuild") {
    for (const token of step.tokens) {
      buttonsOf(page).find((item) => !item.disabled && (item.textContent ?? "").trim() === token)?.click();
      await flushAsync();
    }
  } else {
    const field = page.container.querySelector("textarea") as HTMLTextAreaElement;
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    setter?.call(field, step.sentence);
    field.dispatchEvent(new Event("input", { bubbles: true }));
    await flushAsync();
    buttonsOf(page).find((item) => item.textContent?.trim() === "提交")?.click();
  }
  await flushAsync();
};

const goNext = async (page: Mounted) => {
  buttonsOf(page).find((item) => /^(下一张|完成复习)$/.test((item.textContent ?? "").trim()))?.click();
  await flushAsync();
};

describe("RV5-a 会话边界：0 / 1 / 10 / >10", () => {
  beforeEach(() => resetStorage());

  it("0 张到期：空态文案 + 出口；不出现任何题目", () => {
    seedAppData({});
    const page = mountReview();
    expect(page.has("今天没有到期的语法复习")).toBe(true);
    expect(page.has("上完新课，错过的句子和核心句型明天会排进这里")).toBe(true);
    expect(exitsOf(page.container)).toContain("返回语法地图");
    expect(page.has("选词补全句子")).toBe(false);
    expect(page.has("把句子拼回去")).toBe(false);
    expect(page.has("自己把句子写出来")).toBe(false);
    // 可疑项（P2）：空态仍挂着「0 / 0 张」进度胶囊——一个「本次 0 张」的进度标签
    // 与同屏的空态文案语义重复，且是零分母。记录当前行为。
    expect(page.text()).toContain("0 / 0 张");
    page.unmount();
  });

  it("1 张：进度显示 / 1 张，答完后反馈按钮是「完成复习」而非「下一张」", async () => {
    const data = seedAppData(dueCards(1));
    const plan = planReviewSession(data);
    const page = mountReview();
    expect(page.has("/ 1 张")).toBe(true);
    await answer(page, plan.steps[0]);
    expect(page.has("下一张")).toBe(false);
    expect(page.has("完成复习")).toBe(true);
    await goNext(page);
    expect(page.has("复习完成")).toBe(true);
    page.unmount();
  });

  it("恰好 10 张：全部出完，完成页统计「本次共 10 张」", async () => {
    const data = seedAppData(dueCards(10));
    expect(listDueGrammarReviewCards(data).length).toBe(10);
    const plan = planReviewSession(data);
    expect(plan.total).toBe(10);

    const page = mountReview();
    expect(page.has("/ 10 张")).toBe(true);
    for (const step of plan.steps) await answer(page, step).then(() => goNext(page));
    expect(page.has("复习完成")).toBe(true);
    expect(page.text()).toContain("本次共");
    expect(page.text()).toContain("10 张一次到位");
    page.unmount();
  });

  it("超过 10 张（23 张）：截断到 10 张，未截断的卡留在队列里且到期时间未被动过", async () => {
    const data = seedAppData(dueCards(23));
    expect(listDueGrammarReviewCards(data).length).toBe(23);
    const session = buildGrammarReviewSession(data);
    expect(session.length).toBe(GRAMMAR_REVIEW_SESSION_LIMIT);

    const sessionIds = new Set(session.map((item) => item.card.id));
    const leftBehind = data.cards.filter((card) => !sessionIds.has(card.id));
    expect(leftBehind.length).toBe(13);

    const plan = planReviewSession(data);
    const page = mountReview();
    for (const step of plan.steps) await answer(page, step).then(() => goNext(page));
    expect(page.has("复习完成")).toBe(true);
    expect(page.text()).toContain("10 张一次到位");

    // 未进本次会话的卡：schedule 完全没变（还是当初的 PAST_ISO、reviewCount 未增）
    const after = readAppData();
    for (const card of leftBehind) {
      const schedule = after.schedules.find((item) => item.cardId === card.id)!;
      expect(schedule.nextReviewAt, `${card.id} 的到期时间被无故改动`).toBe(PAST_ISO);
      expect(schedule.reviewCount, `${card.id} 的复习次数被无故增加`).toBe(
        expectedReviewCount(indexOfCardId(card.id))
      );
      expect(after.reviews.some((item) => item.cardId === card.id)).toBe(false);
    }
    page.unmount();
  });

  it("截断后剩下的是「最旧错题优先」里排在后面的那批（lapse 多的仍在前 10）", () => {
    const fixtures = Array.from({ length: 15 }, (_, index) =>
      makeSentenceCard({
        id: `lap-${index}`,
        sentence: SENTENCE(index),
        sourceId: `lesson:l-${index % 4}`,
        schedule: { reviewCount: 1, nextReviewAt: PAST_ISO, intervalDays: 1, lapseCount: index < 4 ? 5 : 0 }
      })
    );
    const data = seedAppData(cardsToData(fixtures));
    const session = buildGrammarReviewSession(data);
    // lapse=5 的 4 张必须全部在会话里（最高优先）
    const lapseIds = new Set(["lap-0", "lap-1", "lap-2", "lap-3"]);
    const inSession = new Set(session.map((item) => item.card.id));
    expect([...lapseIds].every((id) => inSession.has(id))).toBe(true);
  });
});

describe("RV5-b 中途离开后重进", () => {
  beforeEach(() => resetStorage());

  it("答了 2 张后点「今天先到这里」离开：已评分的卡排到未来、未答的卡仍在队列", async () => {
    const data = seedAppData(dueCards(5));
    const plan = planReviewSession(data);
    const answeredIds = plan.steps.slice(0, 2).map((_, index) => plan.steps[index]);

    const page = mountReview();
    expect(page.has("/ 5 张")).toBe(true);
    for (const step of answeredIds) await answer(page, step).then(() => goNext(page));

    // 离开（页面内的出口是 <Link>）
    const link = Array.from(page.container.querySelectorAll("a")).find((anchor) =>
      (anchor.textContent ?? "").includes("今天先到这里")
    );
    expect(link, "页面没有「今天先到这里」出口").toBeTruthy();
    page.unmount();
    await flushAsync();

    const after = readAppData();
    const reviewed = after.reviews.map((item) => item.cardId);
    expect(reviewed.length).toBe(2);
    // 已评分的卡：排到未来
    for (const cardId of reviewed) {
      const schedule = after.schedules.find((item) => item.cardId === cardId)!;
      expect(new Date(schedule.nextReviewAt).getTime()).toBeGreaterThan(Date.now());
      expect(schedule.reviewCount).toBeGreaterThan(0);
    }
    // 未答的卡：仍在到期集合里
    const remainingDue = listDueGrammarReviewCards(after).map((item) => item.card.id);
    expect(remainingDue.length).toBe(3);
    for (const cardId of reviewed) {
      expect(remainingDue, `已答的 ${cardId} 不该还在到期队列`).not.toContain(cardId);
    }

    // 重进：只剩 3 张
    const page2 = mountReview();
    expect(page2.has("/ 3 张")).toBe(true);
    expect(page2.has("第 1 / 3 张")).toBe(true);
    page2.unmount();
  });

  it("中途离开不产生任何「放弃 / 未完成」的界面话术或数据痕迹（无打卡压力）", async () => {
    const data = seedAppData(dueCards(4));
    const plan = planReviewSession(data);
    const page = mountReview();
    await answer(page, plan.steps[0]);
    await goNext(page);
    const text = page.text();
    page.unmount();
    await flushAsync();

    for (const word of ["放弃", "未完成", "中断", "失败", "打卡"]) {
      expect(text, `复习页出现「${word}」`).not.toContain(word);
    }
    // 也没有倒计时 / 体力值
    for (const word of ["倒计时", "剩余时间", "体力", "排名"]) {
      expect(text).not.toContain(word);
    }
  });

  it("离开页面（unmount）后重进：会话重新组队，不含已答卡，计数从 1 重新开始", async () => {
    const data = seedAppData(dueCards(3));
    const plan = planReviewSession(data);
    const page = mountReview();
    await answer(page, plan.steps[0]);
    await goNext(page);
    expect(page.has("第 2 / 3 张")).toBe(true);
    page.unmount();
    await flushAsync();

    const page2 = mountReview();
    expect(page2.has("第 1 / 2 张")).toBe(true);
    expect(page2.has("/ 2 张")).toBe(true);
    page2.unmount();
  });

  it("重复挂载/卸载（StrictMode 般的重入）不产生重复 review", async () => {
    const data = seedAppData(dueCards(3));
    const plan = planReviewSession(data);
    for (let round = 0; round < 3; round += 1) {
      const page = mountReview();
      page.unmount();
      await flushAsync();
    }
    expect(readAppData().reviews.length).toBe(0);

    const page = mountReview();
    await answer(page, plan.steps[0]);
    await goNext(page);
    page.unmount();
    await flushAsync();
    expect(readAppData().reviews.length).toBe(1);
  });
});

describe("RV5-c 会话组队时机（进页面时定一次）", () => {
  beforeEach(() => resetStorage());

  it("会话中途 data 变化不会重排队列：进度总数始终是进场时的 5", async () => {
    const data = seedAppData(dueCards(5));
    const plan = planReviewSession(data);
    const page = mountReview();
    expect(page.has("/ 5 张")).toBe(true);
    for (let index = 0; index < 3; index += 1) {
      await answer(page, plan.steps[index]);
      await goNext(page);
      expect(page.has("/ 5 张"), `第 ${index + 1} 张之后总数变了`).toBe(true);
    }
    page.unmount();
  });
});
