// @vitest-environment jsdom
/**
 * RV1 · 掌握判定的真实写入路径（2026-09-21 修）
 *
 * 背景：`isMasteredByOutput` 的口径是「自由输出连续 2 次一次通过才算掌握」。
 * 它按 `review.mode === "recall"` 过滤——但页面里的 `reviewModeForTask` 曾把
 * **rebuild（点词块拼句）也记成 recall**，于是：
 *
 *   拼词块通过(rating4, recall) + 自己写通过(rating4, recall) → 判定为「已掌握」
 *
 * 用户其实只独立写出过 1 次。拼词块有全套词块可点，难度远低于自由输出。
 *
 * 既有单测 `grammarReviewService.test.ts` 是**合成直参**（自己构造 {mode:"recall"} 数组），
 * 于是永远发现不了「字段被赋错值」。这里改为**驱动真实页面**：
 * 让页面自己写 reviews，再检查卡片是否被置为 mastered。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import { buildGrammarReviewTask, buildGrammarReviewSession, diversifyReviewModes } from "../../services/grammarReviewService";
import { cardsToData, makeSentenceCard, PAST_ISO, seedAppData } from "./fixtures";
import { clickElement, flushAsync, setInputValue } from "./drive";
import type { AppData } from "../../types";

/** 造一张到期、reviewCount 可控的语法句子卡。 */
const dueCard = (reviewCount: number, id = "card-gate-1") =>
  cardsToData([
    makeSentenceCard({
      id,
      sentence: "I went to the park yesterday.",
      note: "",
      schedule: { reviewCount, intervalDays: 5, nextReviewAt: PAST_ISO }
    })
  ]);

const cardOf = () => {
  const raw = window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}";
  const data = JSON.parse(raw);
  return data.cards.find((item: { id: string }) => item.id === "card-gate-1");
};

const reviewsOf = () => {
  const raw = window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}";
  const data = JSON.parse(raw);
  return data.reviews.filter((item: { cardId: string }) => item.cardId === "card-gate-1");
};

const mountReview = () => mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");

/** 按「正确答案」作答当前这张卡（依题型自动选择操作方式）。 */
const answerCurrent = async (page: ReturnType<typeof mountReview>, data: AppData) => {
  const session = diversifyReviewModes(buildGrammarReviewSession(data), data.sentenceDetails);
  const task = buildGrammarReviewTask(session[0], data.sentenceDetails);
  if (task.mode === "cloze") {
    const button = Array.from(page.container.querySelectorAll("button")).find(
      (item) => (item.textContent ?? "").trim() === task.answer
    ) as HTMLButtonElement;
    clickElement(button);
  } else if (task.mode === "rebuild") {
    for (const token of task.sentence.split(/\s+/).filter(Boolean)) {
      const chip = Array.from(page.container.querySelectorAll(".lesson-bank button")).find(
        (item) => !(item as HTMLButtonElement).disabled && (item.textContent ?? "").trim() === token
      );
      if (!chip) throw new Error(`找不到词块「${token}」`);
      clickElement(chip);
    }
  } else {
    const area = page.container.querySelector("textarea") as HTMLTextAreaElement;
    setInputValue(area, task.sentence);
    const submit = Array.from(page.container.querySelectorAll("button")).find(
      (item) => (item.textContent ?? "").trim() === "提交"
    ) as HTMLButtonElement;
    clickElement(submit);
  }
  await flushAsync();
  return task.mode;
};

describe("RV1 掌握判定必须走真实写入路径", () => {
  beforeEach(() => resetStorage());

  it("拼词块（rebuild）不能算作一次「自由输出」——写进 reviews 的 mode 必须是 rebuild", async () => {
    const data = seedAppData(dueCard(1));
    const page = mountReview();
    const mode = await answerCurrent(page, data);
    expect(mode, "reviewCount=1 的卡应出 rebuild（拼词块）").toBe("rebuild");

    const reviews = reviewsOf();
    expect(reviews.length, "应写入一条复习记录").toBe(1);
    expect(reviews[0].mode, "拼词块必须单独记为 rebuild，不能冒充自由输出").toBe("rebuild");
    page.unmount();
  });

  it("「拼词块通过 + 自己写通过」不构成掌握（端到端：两次真实复习）", async () => {
    /**
     * 这是修复前真正会发生的序列：
     *   第 1 次复习（reviewCount=1 → 拼词块）通过
     *   第 2 次复习（reviewCount=2 → 自己写）通过
     * 修复前两次都写 mode="recall"，凑成「连续两次输出」→ 误判已掌握。
     *
     * 两次都走真实页面写入，中间只把排期改回「已到期、reviewCount=2」
     * （否则第一次复习后卡片会被排到未来，第二次进不了会话）。
     */
    const seeded = seedAppData(dueCard(1));
    const first = mountReview();
    await answerCurrent(first, seeded);
    expect(reviewsOf()[0].mode, "第 1 次是拼词块，必须记为 rebuild").toBe("rebuild");
    first.unmount();
    await flushAsync();

    // 把排期改回「已到期、reviewCount=2」（保留页面写入的 reviews）
    const mid = JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}");
    mid.schedules = mid.schedules.map((item: { cardId: string }) =>
      item.cardId === "card-gate-1" ? { ...item, reviewCount: 2, intervalDays: 5, nextReviewAt: PAST_ISO } : item
    );
    window.localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(mid));

    // 第 2 次：自己写（free_type）
    const second = mountReview();
    const mode = await answerCurrent(second, JSON.parse(JSON.stringify(mid)));
    expect(mode, "reviewCount=2 的卡应出 free_type").toBe("free_type");
    second.unmount();

    const written = reviewsOf();
    expect(written.length, "两次复习应各写一条记录").toBe(2);
    expect(
      written.map((item: { mode: string }) => item.mode),
      "只有一次是自由输出"
    ).toEqual(["rebuild", "recall"]);
    expect(cardOf().status, "只独立写出过 1 次，不应判为已掌握").not.toBe("mastered");
  });

  it("正例：连续两次自由输出一次通过后，确实判为已掌握（避免误伤真掌握）", async () => {
    const data = seedAppData({
      ...dueCard(2),
      reviews: [
        {
          id: "r-recall-past",
          cardId: "card-gate-1",
          mode: "recall", // 上一次是真的自己写通过
          rating: 4,
          answer: "I went to the park yesterday.",
          diffJson: "[]",
          reviewedAt: PAST_ISO
        }
      ]
    });
    const page = mountReview();
    const mode = await answerCurrent(page, data);
    expect(mode).toBe("free_type");

    expect(cardOf().status, "连续两次输出一次通过 → 已掌握").toBe("mastered");
  });
});
