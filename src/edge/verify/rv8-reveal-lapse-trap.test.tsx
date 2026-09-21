// @vitest-environment jsdom
/**
 * RV8 · 已掌握卡与「看答案」失败的卡能否正确进出复习队列
 *
 * 两个口径碰撞点：
 * ① mastered 卡：`isGrammarSentenceCard` 只排除 suspended，**不排除 mastered**——
 *    已掌握的语法句到期后会重新出现在复习会话里，与同屏「已掌握 N」自相矛盾。
 * ② 「看答案」（rating 1）会把 intervalDays 归零，而 due 过滤器曾用
 *    「intervalDays === 0」当「从未进过队列」的判据——两者撞车会把刚失败的卡永久排除。
 *    （此项由另一路修复改为三字段判定 neverQueuedSchedule，本文件做**回归守门**。）
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import {
  buildGrammarReviewSession,
  listDueGrammarReviewCards,
  summarizeGrammarMastery
} from "../../services/grammarReviewService";
import { cardsToData, makeSentenceCard, PAST_ISO, readAppData, seedAppData } from "./fixtures";
import { flushAsync, planReviewSession } from "./drive";
import type { Mounted } from "../harness";

const SENTENCE = "I am drawing a picture.";
const WORKING = "I am sad.";

const mountReview = () => mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
const buttonsOf = (page: Mounted) => Array.from(page.container.querySelectorAll("button")) as HTMLButtonElement[];

const seed = (reviewCount: number) =>
  seedAppData(
    cardsToData([
      makeSentenceCard({
        id: "lapse-card",
        sentence: SENTENCE,
        note: "语法课核心句：小美的一天 ① 我是谁",
        schedule: { reviewCount, nextReviewAt: PAST_ISO, intervalDays: 1 }
      })
    ])
  );

/** 作一次错误尝试 → 点「看答案」→ 点「完成复习 / 下一张」。 */
const revealPath = async (page: Mounted, step: ReturnType<typeof planReviewSession>["steps"][number]) => {
  if (step.mode === "cloze") {
    buttonsOf(page).find((item) => !item.disabled && item.textContent?.trim() !== step.answer)?.click();
  } else if (step.mode === "rebuild") {
    // rebuild 的 attempts 只在拼满时 +1：把词块库全部点一遍（打乱顺序 = 错误词序）
    const bank = () =>
      Array.from(page.container.querySelectorAll(".lesson-bank button")) as HTMLButtonElement[];
    for (let guard = 0; guard < 40; guard += 1) {
      const chip = bank().find((item) => !item.disabled);
      if (!chip) break;
      chip.click();
      await flushAsync();
    }
  } else {
    const field = page.container.querySelector("textarea") as HTMLTextAreaElement;
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    setter?.call(field, "zzz");
    field.dispatchEvent(new Event("input", { bubbles: true }));
    await flushAsync();
    buttonsOf(page).find((item) => item.textContent?.trim() === "提交")?.click();
  }
  await flushAsync();
  buttonsOf(page).find((item) => (item.textContent ?? "").includes("看答案"))?.click();
  await flushAsync();
  buttonsOf(page).find((item) => /^(下一张|完成复习)$/.test((item.textContent ?? "").trim()))?.click();
  await flushAsync();
};

/** 把某张卡的 nextReviewAt 拨回过去（模拟时间流逝）。 */
const makeDueAgain = (cardId: string) => {
  const raw = JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}");
  raw.schedules = raw.schedules.map((item: { cardId: string; nextReviewAt: string }) =>
    item.cardId === cardId ? { ...item, nextReviewAt: PAST_ISO } : item
  );
  window.localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(raw));
};

describe("RV8-a 「看答案」后卡片仍能回来（回归守门）", () => {
  beforeEach(() => resetStorage());

  it("看答案写入 intervalDays=0 + lapseCount+1 + 10 分钟后的 nextReviewAt", async () => {
    const data = seed(0);
    const plan = planReviewSession(data);
    const page = mountReview();
    await revealPath(page, plan.steps[0]);
    page.unmount();
    await flushAsync();

    const schedule = readAppData().schedules.find((item) => item.cardId === "lapse-card")!;
    expect(schedule.intervalDays).toBe(0);
    expect(schedule.lapseCount).toBe(1);
    expect(schedule.reviewCount).toBe(1);
    const deltaMs = new Date(schedule.nextReviewAt).getTime() - Date.now();
    expect(deltaMs).toBeGreaterThan(9 * 60 * 1000);
    expect(deltaMs).toBeLessThan(11 * 60 * 1000);
    expect(readAppData().reviews[0].rating).toBe(1);
  });

  it("10 分钟过后（nextReviewAt 到期）这张卡重新回到复习会话——「很快会再来见你」成立", async () => {
    const data = seed(0);
    const plan = planReviewSession(data);
    const page = mountReview();
    await revealPath(page, plan.steps[0]);
    page.unmount();
    await flushAsync();
    makeDueAgain("lapse-card");

    const due = listDueGrammarReviewCards(readAppData());
    expect(due.map((item) => item.card.id)).toContain("lapse-card");

    const page2 = mountReview();
    expect(page2.has("/ 1 张")).toBe(true);
    expect(page2.has(SENTENCE) || page2.has("____") || page2.has("把句子拼回去")).toBe(true);
    page2.unmount();
  });

  it("从未复习的新卡（三字段全初始值）不立即到期——与空态文案「明天会排进这里」一致", () => {
    const fresh = seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "brand-new",
          sentence: SENTENCE,
          schedule: { intervalDays: 0, reviewCount: 0, lapseCount: 0, nextReviewAt: PAST_ISO }
        })
      ])
    );
    expect(listDueGrammarReviewCards(fresh)).toEqual([]);
    const page = mountReview();
    expect(page.has("今天没有到期的语法复习")).toBe(true);
    page.unmount();
  });

  it("一次通过（rating 4）的卡不会掉出队列（对照）", async () => {
    const data = seed(0);
    const plan = planReviewSession(data);
    const page = mountReview();
    buttonsOf(page)
      .find((item) => item.textContent?.trim() === (plan.steps[0] as { answer: string }).answer)
      ?.click();
    await flushAsync();
    page.unmount();
    await flushAsync();
    makeDueAgain("lapse-card");
    expect(listDueGrammarReviewCards(readAppData()).map((item) => item.card.id)).toContain("lapse-card");
  });
});

describe("RV8-b 已掌握（mastered）的语法卡仍会进复习队列（口径碰撞）", () => {
  beforeEach(() => resetStorage());

  it("status=mastered 且到期的卡出现在复习会话里，与同屏「已掌握 N」矛盾", () => {
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "m1",
          sentence: SENTENCE,
          note: "语法课核心句：小美的一天 ① 我是谁",
          status: "mastered",
          schedule: { reviewCount: 6, nextReviewAt: PAST_ISO, intervalDays: 5 }
        }),
        makeSentenceCard({
          id: "p1",
          sentence: WORKING,
          note: "语法课核心句：小美的一天 ② 你是谁",
          schedule: { reviewCount: 2, nextReviewAt: PAST_ISO, intervalDays: 1 }
        })
      ])
    );
    const after = readAppData();
    expect(after.cards.find((item) => item.id === "m1")?.status).toBe("mastered");

    const session = buildGrammarReviewSession(after);
    // 缺陷证据：isGrammarSentenceCard 只排除 suspended，不排除 mastered
    // → 已掌握的卡仍进复习队列。期望是「掌握后不再需要复习」，实际却排第 1 张。
    expect(session.map((item) => item.card.id)).toEqual(["m1", "p1"]);
    expect(session[0].card.status).toBe("mastered");
    // 对照：通用复习轨（getDueCards）是排除 mastered 的
    expect(session[0].card.status).not.toBe("review");

    const page = mountReview();
    // 同屏两句话自相矛盾：进度说 2 张（其中第 1 张是已掌握的）、掌握栏说「已掌握 1」
    expect(page.has("已掌握 1")).toBe(true);
    expect(page.has("/ 2 张")).toBe(true);
    expect(page.has("第 1 / 2 张")).toBe(true);
    page.unmount();
  });

  it("「进行中」计数不含 mastered，但 mastered 卡仍占复习张数（口径不一致的直接证据）", () => {
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "m1",
          sentence: SENTENCE,
          note: "n",
          status: "mastered",
          schedule: { reviewCount: 6, nextReviewAt: PAST_ISO, intervalDays: 5 }
        })
      ])
    );
    const after = readAppData();
    const mastery = summarizeGrammarMastery(after);
    expect(mastery).toEqual({ mastered: 1, inProgress: 0, notStarted: 0, total: 1 });
    // 会话却有 1 张
    expect(buildGrammarReviewSession(after).length).toBe(1);
  });

  it("mastered 卡被复习一次（rating 1）后仍保持 mastered（不降级，但会写一条 review）", async () => {
    const data = seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "m1",
          sentence: SENTENCE,
          note: "n",
          status: "mastered",
          schedule: { reviewCount: 6, nextReviewAt: PAST_ISO, intervalDays: 5 }
        })
      ])
    );
    const plan = planReviewSession(data);
    const page = mountReview();
    await revealPath(page, plan.steps[0]);
    page.unmount();
    await flushAsync();

    const after = readAppData();
    expect(after.cards[0].status).toBe("mastered");
    expect(after.reviews.length).toBe(1);
    expect(after.reviews[0].rating).toBe(1);
    // masteredAt 保留原值（不重置）
    expect(after.cards[0].masteredAt).toBeTruthy();
  });
});
