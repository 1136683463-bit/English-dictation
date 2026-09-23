// @vitest-environment jsdom
/**
 * SV6 · `review.answer` 必须是「用户写的」，不是「正确答案」（2026-09-22 修）
 *
 * 错词本的矩阵把两栏并列展示：
 *   「正确拼写」= `card.front`
 *   「你的答案」= `review.answer`
 * 而语法复习页此前硬把 `task.sentence`（正确句）写进 `answer`，
 * 于是两栏内容完全一样 —— 用户看不到自己当时究竟写了什么，
 * 字母级差异对照（`compareLetters`）也就永远显示「零差异」。
 *
 * 这个文件从**真实 UI 路径**验证四个入口各自写入什么。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import { cardsToData, makeSentenceCard, PAST_ISO, seedAppData } from "./fixtures";
import { clickElement, flushAsync, setInputValue } from "./drive";
import { buildGrammarReviewSession, buildGrammarReviewTask, diversifyReviewModes } from "../../services/grammarReviewService";
import type { AppData } from "../../types";

const SENTENCE = "I went to the park yesterday.";

/** 造一张可控 reviewCount 的到期卡（决定出哪种题型）。 */
const dueCard = (reviewCount: number) =>
  cardsToData([
    makeSentenceCard({
      id: "card-ans",
      sentence: SENTENCE,
      note: "语法课核心句：第 10 课",
      schedule: { reviewCount, intervalDays: 5, nextReviewAt: PAST_ISO }
    })
  ]);

const reviewsOf = () => {
  const data = JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}");
  return (data.reviews ?? []) as Array<{ mode: string; answer: string; rating: number }>;
};

const mountReview = () => mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");

const taskOf = (data: AppData) => {
  const session = diversifyReviewModes(buildGrammarReviewSession(data), data.sentenceDetails);
  return buildGrammarReviewTask(session[0], data.sentenceDetails);
};

describe("SV6 review.answer 的语义", () => {
  beforeEach(() => resetStorage());

  it("cloze：写入用户点选的**选项**", async () => {
    const data = seedAppData(dueCard(0));
    const task = taskOf(data);
    expect(task.mode, "reviewCount=0 应出 cloze").toBe("cloze");

    const page = mountReview();
    const buttons = Array.from(page.container.querySelectorAll(".lesson-option")) as HTMLButtonElement[];
    const right = buttons.find((button) => (button.textContent ?? "").trim() === task.answer)!;
    expect(right, "应找到正确选项").toBeTruthy();
    clickElement(right);
    await flushAsync();

    const [review] = reviewsOf();
    expect(review.answer, "应记录用户点的那个词，而不是整句正确答案").toBe(task.answer);
    expect(review.answer, "绝不能是完整正确句").not.toBe(SENTENCE);
    page.unmount();
  });

  it("free_type：写入用户**自己写下的句子**（即使与答案有差异也通过时）", async () => {
    const data = seedAppData(dueCard(2));
    const task = taskOf(data);
    expect(task.mode, "reviewCount=2 应出 free_type").toBe("free_type");

    const page = mountReview();
    const area = page.container.querySelector("textarea") as HTMLTextAreaElement;
    // 一次通过线是 90 分，允许细微差异（少一个句号）——这正是要记录的「用户的版本」
    const typed = "I went to the park yesterday";
    setInputValue(area, typed);
    await flushAsync();
    const submit = Array.from(page.container.querySelectorAll("button")).find(
      (button) => (button.textContent ?? "").trim() === "提交"
    ) as HTMLButtonElement;
    clickElement(submit);
    await flushAsync();

    const [review] = reviewsOf();
    expect(review.answer, "应记录用户实际写的文本（含其细微差异）").toBe(typed);
    expect(review.answer, "不应被替换成标准答案").not.toBe(SENTENCE);
    page.unmount();
  });

  it("rebuild：写入用户拼出的**顺序**（通过时即正确顺序）", async () => {
    const data = seedAppData(dueCard(1));
    const task = taskOf(data);
    expect(task.mode, "reviewCount=1 应出 rebuild").toBe("rebuild");

    const page = mountReview();
    for (const token of task.sentence.split(/\s+/).filter(Boolean)) {
      const chip = (Array.from(page.container.querySelectorAll(".lesson-bank button")) as HTMLButtonElement[]).find(
        (button) => !button.disabled && (button.textContent ?? "").trim() === token
      );
      expect(chip, `应找到词块「${token}」`).toBeTruthy();
      clickElement(chip);
      await flushAsync();
    }
    const [review] = reviewsOf();
    expect(review.answer, "应记录用户拼出的句子").toBe(SENTENCE);
    page.unmount();
  });

  it("★ 看答案：写入用户**已经写下的内容**，没写就是空串（不伪装成正确答案）", async () => {
    const data = seedAppData(dueCard(2));
    const task = taskOf(data);
    expect(task.mode).toBe("free_type");

    const page = mountReview();
    const area = page.container.querySelector("textarea") as HTMLTextAreaElement;
    // 故意写一个错句，然后「看答案」
    setInputValue(area, "I go to park.");
    await flushAsync();
    // 先提交一次（不通过）让「看答案」出现
    const submit = () => Array.from(page.container.querySelectorAll("button")).find(
      (button) => (button.textContent ?? "").trim() === "提交"
    ) as HTMLButtonElement | undefined;
    clickElement(submit()!);
    await flushAsync();
    const reveal = Array.from(page.container.querySelectorAll("button")).find((button) =>
      (button.textContent ?? "").includes("看答案")
    ) as HTMLButtonElement | undefined;
    expect(reveal, "答错后应出现「看答案」").toBeTruthy();
    clickElement(reveal!);
    await flushAsync();

    const [review] = reviewsOf();
    expect(review.rating, "看答案应记为「忘了」（rating 1）").toBe(1);
    expect(review.answer, "应记录用户写的错句，而不是正确答案").toBe("I go to park.");
    page.unmount();
  });
});
