// @vitest-environment jsdom
/**
 * RV4 · 掌握（mastered）判定走真实 UI 路径（清单项 4）
 *
 * 已知问题（本次复核时源码刚被修，见 GrammarReviewPage.tsx:25-34）：
 * `reviewModeForTask` 曾把 rebuild 与 free_type 都映射成 `mode: "recall"`，
 * 而 `isMasteredByOutput` 按 `mode === "recall"` 过滤「输出」记录——
 * 于是「拼词块通过 + 自己写通过」被当成两次输出，用户只独立写出过 1 次就被判已掌握。
 *
 * 本文件不改产品代码，只做两件事：
 * ① 客户端复现原缺陷的判定逻辑，证明「污染路径」确实会误判（缺陷成立性）；
 * ② 在**当前源码**上重跑真实 UI 三步（cloze 通过 → rebuild 通过 → free_type 首通过），
 *    检查卡片是否被错误置为 mastered / 界面「已掌握 N」是否 +1（回归守门）。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import { isMasteredByOutput } from "../../services/grammarReviewService";
import { parseBackupJson } from "../../services/storage";
import { cardsToData, makeSentenceCard, PAST_ISO, readAppData, seedAppData } from "./fixtures";
import { flushAsync, planReviewSession } from "./drive";
import type { Mounted } from "../harness";
import type { Review } from "../../types";

const SENTENCE = "I am drawing a picture.";

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
    buttonsOf(page).find((item) => !item.disabled && item.textContent?.trim() === "提交")?.click();
  }
  await flushAsync();
  buttonsOf(page)
    .find((item) => !item.disabled && /^(下一张|完成复习)$/.test((item.textContent ?? "").trim()))
    ?.click();
  await flushAsync();
};

const statusOf = (cardId: string) => readAppData().cards.find((item) => item.id === cardId)?.status;
const reviewsOf = (cardId: string) => readAppData().reviews.filter((item) => item.cardId === cardId);

/** 「已掌握 N / 共 Y 句」里的 N（界面可见口径）。 */
const masteredCountOnScreen = (page: Mounted): number | null => {
  const match = page.text().match(/已掌握\s*(\d+)/);
  return match ? Number(match[1]) : null;
};

describe("RV4-a 缺陷成立性：rebuild 冒充 recall 会误判掌握（合成证明）", () => {
  it("若 rebuild 也记 recall，则「拼词块 + 自己写」两次 rating4 即被判定已掌握", () => {
    const polluted: Array<Pick<Review, "cardId" | "mode" | "rating">> = [
      { cardId: "c1", mode: "recall", rating: 4 }, // 实为 rebuild（旧映射）
      { cardId: "c1", mode: "recall", rating: 4 } // 实为 free_type 首通过
    ];
    expect(isMasteredByOutput(polluted as Review[], "c1")).toBe(true);

    // 正确口径：rebuild 不参与输出判定
    const correct: Array<Pick<Review, "cardId" | "mode" | "rating">> = [
      { cardId: "c1", mode: "rebuild", rating: 4 },
      { cardId: "c1", mode: "recall", rating: 4 }
    ];
    expect(isMasteredByOutput(correct as Review[], "c1")).toBe(false);
  });

  it("cloze 与 rebuild 无论多少条 rating4，都不足以单独判定输出掌握", () => {
    const nonOutput: Array<Pick<Review, "cardId" | "mode" | "rating">> = [
      { cardId: "c1", mode: "cloze", rating: 4 },
      { cardId: "c1", mode: "cloze", rating: 4 },
      { cardId: "c1", mode: "cloze", rating: 4 }
    ];
    expect(isMasteredByOutput(nonOutput as Review[], "c1")).toBe(false);
  });
});

describe("RV4-b 真实 UI 三步：cloze 通过 → rebuild 通过 → free_type 首次通过", () => {
  beforeEach(() => resetStorage());

  /**
   * 造三张卡：cloze 卡（reviewCount 0）、rebuild 卡（reviewCount 1）、free_type 卡（reviewCount 2）
   * ——等价于「同一张卡被复习到第 3 次」的三段历史。
   * 但掌握判定按 cardId 过滤，所以必须让三步落在**同一张卡**上。
   * 做法：先以 reviewCount 0 入队走 cloze，退出后改 schedule 再进 rebuild，再改再进 free_type。
   */
  const seedAt = (reviewCount: number) =>
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "mastery-card",
          sentence: SENTENCE,
          note: "语法课核心句：小美的一天 ① 我是谁",
          schedule: { reviewCount, nextReviewAt: PAST_ISO, intervalDays: 1 }
        })
      ])
    );

  /**
   * 走一次真实 UI 复习：把 schedule.reviewCount 设为 reviewCount（模拟「这张卡已复习过 N 次」），
   * **保留已积累的 reviews**，然后挂载页面作答当前题型。返回实际出示的题型。
   *
   * 为什么要在挂载前改 reviewCount：题型由 reviewCount 决定，而掌握判定读的是累计 reviews
   * ——两者必须同时到位才能复现「同一张卡的第 1/2/3 次复习」。
   */
  const stepThrough = async (reviewCount: number) => {
    const raw = JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}");
    const schedules = (raw.schedules ?? []).map((item: { cardId: string }) =>
      item.cardId === "mastery-card"
        ? { ...item, reviewCount, intervalDays: 1, nextReviewAt: PAST_ISO }
        : item
    );
    const patched = JSON.stringify({ ...raw, schedules });
    window.localStorage.setItem("personal-vocab-app-data-v1", patched);
    // 与页面同源的数据（走同一条迁移管线，normalizeSchedules 会补计划）
    const data = parseBackupJson(patched);
    const plan = planReviewSession(data);
    const page = mountReview();
    const mode = plan.steps[0]?.mode ?? null;
    if (plan.steps[0]) await answer(page, plan.steps[0]);
    page.unmount();
    await flushAsync();
    return mode;
  };

  it("rebuild 通过后卡片**不**被置为 mastered；free_type 首通过后也不被置为 mastered", async () => {
    // 第 1 步：cloze 通过（rating 4，mode=cloze）
    seedAt(0);
    const firstMode = await stepThrough(0);
    expect(firstMode).toBe("cloze");
    expect(reviewsOf("mastery-card").map((item) => item.mode)).toEqual(["cloze"]);
    expect(statusOf("mastery-card")).not.toBe("mastered");

    // 第 2 步：rebuild 通过（rating 4，mode=rebuild）——旧缺陷在这里污染输出判定
    const secondMode = await stepThrough(1);
    expect(secondMode).toBe("rebuild");
    expect(reviewsOf("mastery-card").map((item) => item.mode)).toEqual(["cloze", "rebuild"]);
    expect(
      statusOf("mastery-card"),
      "rebuild（拼词块）通过后卡片被置为 mastered——拼词块不算独立输出"
    ).not.toBe("mastered");

    // 第 3 步：free_type 首次通过（rating 4，mode=recall）——输出只有 1 次
    const thirdMode = await stepThrough(2);
    expect(thirdMode).toBe("free_type");
    expect(reviewsOf("mastery-card").map((item) => item.mode)).toEqual(["cloze", "rebuild", "recall"]);
    expect(
      statusOf("mastery-card"),
      "free_type 仅通过 1 次就被置为 mastered——口径要求「连续 2 次一次通过」"
    ).not.toBe("mastered");
  });

  it("界面上「已掌握 N」在 rebuild / free_type 首通过后都不 +1", async () => {
    // 先记录基线
    seedAt(0);
    const baseline = mountReview();
    const before = masteredCountOnScreen(baseline);
    baseline.unmount();
    await flushAsync();
    expect(before).toBe(0);

    seedAt(0);
    await stepThrough(0); // cloze
    await stepThrough(1); // rebuild
    await stepThrough(2); // free_type 首次

    const after = mountReview();
    expect(masteredCountOnScreen(after)).toBe(0);
    expect(after.text()).toContain("已掌握 0");
    after.unmount();
  });

  it("第二次 free_type 也一次通过 → 才置为 mastered，「已掌握」+1（正向路径完好）", async () => {
    // 先把前两步历史写实（cloze / rebuild / free_type 首次）
    seedAt(0);
    await stepThrough(0);
    await stepThrough(1);
    await stepThrough(2);
    expect(statusOf("mastery-card")).not.toBe("mastered");

    // 第 4 次复习：free_type 第二次一次通过 → 应达「输出连续 2 次」
    const mode = await stepThrough(2);
    expect(mode).toBe("free_type");
    expect(reviewsOf("mastery-card").filter((item) => item.mode === "recall").length).toBe(2);
    expect(statusOf("mastery-card")).toBe("mastered");

    const page = mountReview();
    expect(masteredCountOnScreen(page)).toBe(1);
    page.unmount();
  });

  it("free_type 第二次是「看答案」通过 → 不算输出连续，不置 mastered", async () => {
    seedAt(0);
    await stepThrough(0);
    await stepThrough(1);
    await stepThrough(2);
    expect(statusOf("mastery-card")).not.toBe("mastered");

    // 第 4 次：先写错再点看答案（rating 1）。
    // 上一步答对后 nextReviewAt 被排到未来，先把它拉回「已到期」才会再进队。
    const raw = JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}");
    const schedules = (raw.schedules ?? []).map((item: { cardId: string }) =>
      item.cardId === "mastery-card" ? { ...item, intervalDays: 1, nextReviewAt: PAST_ISO } : item
    );
    window.localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify({ ...raw, schedules }));
    const page = mountReview();
    expect(page.has("自己把句子写出来")).toBe(true); // 确认确实进了 free_type
    const field = page.container.querySelector("textarea") as HTMLTextAreaElement;
    expect(field).not.toBeNull();
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    setter?.call(field, "totally wrong");
    field.dispatchEvent(new Event("input", { bubbles: true }));
    await flushAsync();
    buttonsOf(page).find((item) => item.textContent?.trim() === "提交")?.click();
    await flushAsync();
    buttonsOf(page).find((item) => (item.textContent ?? "").includes("看答案"))?.click();
    await flushAsync();
    buttonsOf(page).find((item) => /^(下一张|完成复习)$/.test((item.textContent ?? "").trim()))?.click();
    await flushAsync();

    const outputReviews = reviewsOf("mastery-card").filter((item) => item.mode === "recall");
    // cloze/rebuild 各一条（都不算输出），recall 两条：首次通过 4 + 本次看答案 1
    expect(reviewsOf("mastery-card").map((item) => item.mode)).toEqual(["cloze", "rebuild", "recall", "recall"]);
    expect(outputReviews.map((item) => item.rating)).toEqual([4, 1]);
    expect(
      statusOf("mastery-card"),
      "最近两次输出里有一次是「看答案」（rating 1），不该判已掌握"
    ).not.toBe("mastered");
    page.unmount();
  });
});
