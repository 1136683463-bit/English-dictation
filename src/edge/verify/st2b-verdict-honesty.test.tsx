// @vitest-environment jsdom
/**
 * ST2b · 判定必须与「当前的作答」一致（用户报告「我乱选也判断正确了」的同类排查，2026-09-24）
 *
 * 排查范围＝全库所有「会给出判定 + 作答仍可改」的组合。已逐处核对为**干净**的有：
 *   课程页 前测（选后 disabled）/ choose·replace（pass 后 disabled）/ spot（处理器 pass 后早退）/
 *   忆·产出（判定后输入区被替换）/ 对比卡（`if (picked) return`）/ 破段（只是链接）/
 *   语法复习页 三题型（判定后所有控件 `disabled={outcome !== "idle"}`）/
 *   错题重练（pass 后 disabled，retry 可改且重判）/ 侦探页（按设计可继续找）/
 *   语言之门（判定后输入区被替换）/ 听写页（`disabled={Boolean(feedback)}`）/
 *   语法日记（`settled = done && !isDirty`——改了文本批改立刻隐藏，正是正确模式）。
 *
 * 本文件锁住的**两处不诚实**：
 *   ① 趁热练：点「看答案」后，对比题/填空题的选项仍可点（判定已给出，作答却还能改）；
 *   ② 词汇复习页：点「检查答案」后继续改文本，批改面板仍以「当前答案」的口径展示旧对照与分数。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import ReviewPage from "../../pages/ReviewPage";
import { buildBoostItems } from "../../services/grammarBoostService";
import { cardsToData, makeSentenceCard, PAST_ISO, seedAppData } from "./fixtures";
import { answerBoostItem, clickButtonContaining, clickElement, flushAsync, setInputValue } from "./drive";
import type { Mounted } from "../harness";

const enabledButtons = (page: Mounted, selector: string): HTMLButtonElement[] =>
  Array.from(page.container.querySelectorAll<HTMLButtonElement>(selector)).filter((el) => !el.disabled);

const doneLessonSeed = (lessonId: string) =>
  seedAppData({ grammarLessonsDone: [lessonId], grammarLessonStagesDone: { [lessonId]: [1] } });

describe("ST2b-① 趁热练：看答案后作答控件必须锁死", () => {
  beforeEach(() => resetStorage());

  /**
   * 档 1（spot/listen/cloze/replace/bothright）**故意不提供**「看答案」（retry 面板的排除表），
   * 所以能走到 revealed 的只有档 2/3 的产出类与拼句类——本用例锁的正是这两条可达路径。
   */
  it("档 2：产出题与拼句题点「看答案」后，文本框与词块必须全部锁死", async () => {
    const lessonId = "lesson-01-am";
    const items = buildBoostItems(lessonId, 2, {});
    const textKindAt = items.findIndex((item) => ["recall", "translate", "produce", "variant", "fix", "free"].includes(item.kind));
    const chipKindAt = items.findIndex((item) => item.kind === "rebuild" || item.kind === "arrange");
    expect(textKindAt, "档 2 应含产出类题").toBeGreaterThanOrEqual(0);
    expect(chipKindAt, "档 2 应含拼句类题").toBeGreaterThanOrEqual(0);

    doneLessonSeed(lessonId);
    const page = mountPage(<GrammarBoostPage />, `/grammar/boost/${lessonId}?tier=2`, "/grammar/boost/:lessonId");

    const lockCheck = (label: string) => {
      const field = page.container.querySelector<HTMLInputElement | HTMLTextAreaElement>("input.large-textarea, textarea");
      if (field) expect(field.disabled, `${label}：看答案后文本框必须锁死`).toBe(true);
      const alive = enabledButtons(page, "button.boost-choice, .lesson-spot-row button, button.lesson-option");
      expect(alive.map((button) => (button.textContent ?? "").trim()), `${label}：看答案后不得还有可点的作答控件`).toEqual([]);
      expect(page.buttons().includes("提交"), `${label}：看答案后不应还有提交按钮`).toBe(false);
    };

    // 走到第一个产出题：写一句错的 → 提交 → 再点「看答案」
    for (let index = 0; index < textKindAt; index += 1) {
      expect(answerBoostItem(page, items[index])).toBe("passed");
      page.click("下一题");
      await flushAsync();
    }
    const field = page.container.querySelector<HTMLInputElement | HTMLTextAreaElement>("input.large-textarea, textarea");
    expect(field, "产出题应有输入框").toBeTruthy();
    setInputValue(field!, "zzz");
    clickButtonContaining(page, "提交");
    await flushAsync();
    clickButtonContaining(page, "看答案");
    await flushAsync();
    expect(page.has("没关系，先看一眼"), "产出题应能走到看答案态").toBe(true);
    lockCheck("产出题");

    // 继续走到拼句题（先从看答案态进入下一题）
    clickButtonContaining(page, "下一题");
    await flushAsync();
    for (let index = textKindAt + 1; index < chipKindAt; index += 1) {
      expect(answerBoostItem(page, items[index])).toBe("passed");
      page.click("下一题");
      await flushAsync();
    }
    // 乱拼一次：把所有词块按词块库顺序点进去（判题门槛＝答案词数，必然触发）
    const bank = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-spot-row button"));
    expect(bank.length, "拼句题应有词块").toBeGreaterThan(1);
    for (const chip of bank) clickElement(chip);
    await flushAsync();
    expect(page.has("再试一次"), "乱拼后应进入 retry（否则本用例失去了「看答案」的前置）").toBe(true);
    clickButtonContaining(page, "看答案");
    await flushAsync();
    expect(page.has("没关系，先看一眼"), "拼句题应能走到看答案态").toBe(true);
    lockCheck("拼句题");
    page.unmount();
  });
});

describe("ST2b-② 词汇复习：批改面板必须与当前答案一致", () => {
  beforeEach(() => resetStorage());

  const seedSentenceCard = () =>
    seedAppData(
      cardsToData([
        makeSentenceCard({
          id: "s1",
          sentence: "I went to the park yesterday.",
          note: "语法课核心句：第 10 课",
          schedule: { reviewCount: 1, intervalDays: 5, nextReviewAt: PAST_ISO }
        })
      ])
    );

  it("检查答案后改动文本：批改面板不得仍以「当前答案」的口径展示旧对照", async () => {
    seedSentenceCard();
    const page = mountPage(<ReviewPage />, "/review?cards=s1", "/review");
    await flushAsync();
    const textarea = page.container.querySelector<HTMLTextAreaElement>("textarea#review-answer");
    expect(textarea, "句子卡应处于带文本框的模式").toBeTruthy();

    setInputValue(textarea!, "I go to the park yesterday.");
    clickButtonContaining(page, "检查答案");
    await flushAsync();
    expect(page.container.querySelector(".review-result-panel"), "检查后应出现批改面板").toBeTruthy();

    // 改动文本，但不重新检查
    setInputValue(textarea!, "I went to the park yesterday.");
    await flushAsync();

    const panel = page.container.querySelector(".review-result-panel");
    const honest = !panel || /上一版|重新批改/.test(panel.textContent ?? "");
    expect(honest, "改动后批改面板必须消失或明确标注为旧批改").toBe(true);
    page.unmount();
  });
});
