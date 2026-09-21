// @vitest-environment jsdom
/**
 * BO1 · 趁热练三档「真实 UI 作答链路」
 *
 * 清单项 1：档 1「再认一次」4 题 / 档 2「自己想」5 题 / 档 3「换你来说」3 题。
 * 逐题型走「答对 / 答错 / 看答案 / 提示」，核对：
 * - UI 实际出了几道题（.lesson-quiz-step 的「第 n / N 题」）；
 * - 标题里的档位声明（BOOST_TIER_META）与实到题数是否一致；
 * - 判分：答对进 pass（「对了！」），答错进 retry（「再试一次」）；
 * - 反馈文案与进度 pill；
 * - 完成事件字段与页面文案是否同源（firstTryCount 口径）。
 *
 * 与既有测试的分工：r7-invariants 只断言服务层题量 ≥ 声明值，
 * 这里断言**页面里真的渲染出几道题、能不能一题一题走完**。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import { BOOST_TIER_META, buildBoostItems, type BoostItem } from "../../services/grammarBoostService";
import { DONE_LESSON_ID, readAppData, seedAppData, telemetryOfKind } from "./fixtures";
import { answerBoostItem, clickButtonContaining, clickElement, flushAsync, setInputValue } from "./drive";
import type { Mounted } from "../harness";

const seedLesson = (boostsDone?: Record<string, number[]>) =>
  seedAppData({
    grammarLessonsDone: [DONE_LESSON_ID],
    grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] },
    ...(boostsDone ? { grammarBoostsDone: boostsDone } : {})
  });

const mountBoost = (search = "") =>
  mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}${search}`, "/grammar/boost/:lessonId");

/** 页面当前展示的题号——形如 "第 2 / 4 题"。 */
const stepLabel = (page: Mounted): string =>
  (page.container.querySelector(".lesson-quiz-step")?.textContent ?? "").trim();

/** 页面当前题型标签（零术语引导语）。 */
const kindLabel = (page: Mounted): string =>
  (page.container.querySelector(".lesson-quiz-note")?.textContent ?? "").trim();

const pillText = (page: Mounted): string =>
  (page.container.querySelector('[aria-label="本档进度"]')?.textContent ?? "").trim();

const feedbackText = (page: Mounted): string =>
  (page.container.querySelector(".lesson-feedback")?.textContent ?? "").trim();

const typeAnswer = (page: Mounted, value: string) => {
  const field = page.container.querySelector("input.large-textarea");
  if (!field) throw new Error(`当前没有产出输入框；按钮：${page.buttons().join(" | ")}`);
  setInputValue(field as HTMLInputElement, value);
};

/** 走完一档（全部按正确答案作答），含最后一次「完成这一档」。返回实际作答题数。 */
const runTier = (page: Mounted, items: BoostItem[]): number => {
  let answered = 0;
  for (const [index, item] of items.entries()) {
    if (answerBoostItem(page, item) !== "passed") break;
    answered += 1;
    if (index + 1 < items.length) {
      const next = page.buttons().find((text) => text === "下一题");
      if (!next) break;
      page.click("下一题");
    } else {
      page.click("完成这一档");
    }
  }
  return answered;
};

describe("BO1-a 档位声明与实到题数一致（UI 层）", () => {
  beforeEach(() => resetStorage());

  it("三档直链进入：题号分母 = BOOST_TIER_META 声明值（4 / 5 / 3）", () => {
    for (const tier of [1, 2, 3] as const) {
      seedLesson();
      const page = mountBoost(`?tier=${tier}`);
      const meta = BOOST_TIER_META[tier];
      expect(stepLabel(page), `档 ${tier}`).toBe(`第 1 / ${meta.questionCount} 题`);
      // 档位名与时长预告出现在页头（时长是预告，不是倒计时）
      expect(page.text()).toContain(meta.name);
      expect(page.text()).toContain(meta.summaryZh);
      expect(pillText(page)).toBe(`0 / ${meta.questionCount} 题`);
      page.unmount();
    }
  });

  it("档 1 四道题逐题推进：题号、引导语、进度与实到题数一致", () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    const items = buildBoostItems(DONE_LESSON_ID, 1, {});
    expect(items.length).toBe(4);
    for (const [index, item] of items.entries()) {
      expect(stepLabel(page)).toBe(`第 ${index + 1} / 4 题`);
      expect(kindLabel(page).length, `第 ${index + 1} 题（${item.kind}）没有引导语`).toBeGreaterThan(0);
      expect(answerBoostItem(page, item)).toBe("passed");
      expect(pillText(page)).toBe(`${index + 1} / 4 题`);
      if (index + 1 < items.length) page.click("下一题");
    }
    page.click("完成这一档");
    expect(page.has("这一课的记忆稳住了")).toBe(true);
    page.unmount();
  });
});

describe("BO1-b 档 1「再认一次」逐题型：答对 / 答错 / 看答案", () => {
  beforeEach(() => resetStorage());

  it("答对：每道题都进入 pass 反馈（「对了！」+ 反馈里能看到该题答案）", () => {
    seedLesson();
    const items = buildBoostItems(DONE_LESSON_ID, 1, {});
    const page = mountBoost();
    clickButtonContaining(page, "再认一次");
    for (const [index, item] of items.entries()) {
      expect(answerBoostItem(page, item)).toBe("passed");
      const feedback = feedbackText(page);
      expect(feedback, `第 ${index + 1} 题（${item.kind}）的反馈：${feedback}`).toContain("对了！");
      expect(feedback, `第 ${index + 1} 题（${item.kind}）的反馈里应含 answer`).toContain(item.answer);
      if (index + 1 < items.length) page.click("下一题");
    }
    page.click("完成这一档");
    expect(page.has("这一课的记忆稳住了")).toBe(true);
    page.unmount();
  });

  it("答错：进入 retry（「再试一次」），题号不前进、可重试到通过", () => {
    seedLesson();
    const items = buildBoostItems(DONE_LESSON_ID, 1, {});
    const page = mountBoost();
    clickButtonContaining(page, "再认一次");
    for (const [index, item] of items.entries()) {
      expect(wrongAction(page, item), `第 ${index + 1} 题（${item.kind}）无法造出错误作答`).toBe(true);
      expect(page.buttons(), `第 ${index + 1} 题（${item.kind}）答错后没有「再试一次」`).toContain("再试一次");
      expect(stepLabel(page), `第 ${index + 1} 题答错后题号不该前进`).toBe(`第 ${index + 1} / ${items.length} 题`);
      page.click("再试一次");
      expect(answerBoostItem(page, item)).toBe("passed");
      if (index + 1 < items.length) page.click("下一题");
    }
    page.click("完成这一档");
    expect(page.has("这一课的记忆稳住了")).toBe(true);
    page.unmount();
  });

  it("「看答案」的可用范围：档 1 的判断/填空/改错/选择类一律没有该入口", () => {
    seedLesson();
    const items = buildBoostItems(DONE_LESSON_ID, 1, {});
    const page = mountBoost();
    clickButtonContaining(page, "再认一次");
    const observed: Record<string, boolean> = {};
    for (const [index, item] of items.entries()) {
      wrongAction(page, item);
      observed[item.kind] = page.buttons().some((text) => text.includes("看答案"));
      page.click("再试一次");
      answerBoostItem(page, item);
      if (index + 1 < items.length) page.click("下一题");
    }
    // 页面在 retry 分支显式排除了这些题型（选项少，再试一次即可）
    for (const kind of ["contrast", "cloze", "spot", "choose", "replace"]) {
      if (kind in observed) {
        expect(observed[kind], `${kind} 不该出现「看答案」`).toBe(false);
      }
    }
    page.unmount();
  });
});

describe("BO1-c 档 2「自己想」：提示梯度 / 判分 / 走完", () => {
  beforeEach(() => resetStorage());

  it("recall 首题的提示逐级展开：三级用完入口消失，题目仍可提交", () => {
    seedLesson();
    const first = buildBoostItems(DONE_LESSON_ID, 2, {})[0];
    expect(first.kind).toBe("recall");
    const page = mountBoost();
    clickButtonContaining(page, "自己想");
    expect(page.has("看着中文，把这句话写出来")).toBe(true);
    expect(page.has(first.intentZh)).toBe(true);
    expect(page.buttons().some((text) => text.includes("想不起来，要一级提示"))).toBe(true);

    for (const hint of first.hints ?? []) {
      page.clickMatch(/想不起来，要一级提示/);
      expect(page.has(hint), `提示「${hint}」没有渲染`).toBe(true);
    }
    expect(page.buttons().some((text) => text.includes("要一级提示"))).toBe(false);

    typeAnswer(page, first.answer);
    page.click("提交");
    expect(feedbackText(page)).toContain("对了！");
    page.unmount();
  });

  it("五题全部答对可走完（题型交错、题号连续）", () => {
    seedLesson();
    const items = buildBoostItems(DONE_LESSON_ID, 2, {});
    expect(items.length).toBe(5);
    const page = mountBoost();
    clickButtonContaining(page, "自己想");
    expect(runTier(page, items)).toBe(5);
    expect(page.has("又稳了一层")).toBe(true);
    page.unmount();
  });

  it("答错给「还没对上 / 已经对了一部分」，且不结算、可重试", () => {
    seedLesson();
    const page = mountBoost();
    clickButtonContaining(page, "自己想");
    typeAnswer(page, "totally unrelated words");
    page.click("提交");
    const feedback = feedbackText(page);
    expect(feedback.includes("还没对上") || feedback.includes("已经对了一部分"), feedback).toBe(true);
    expect(page.buttons()).toContain("再试一次");
    expect(page.buttons()).not.toContain("下一题");
    page.unmount();
  });
});

describe("BO1-d 档 3「换你来说」：三题型形态 + 3 题走完", () => {
  beforeEach(() => resetStorage());

  it("produce / variant / fix 三题都能作答并走完；variant/fix 必先给样例句", () => {
    seedAppData({
      grammarLessonsDone: [DONE_LESSON_ID],
      grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] },
      grammarBoostsDone: { [DONE_LESSON_ID]: [1, 2] }
    });
    const items = buildBoostItems(DONE_LESSON_ID, 3, {});
    expect(items.length).toBe(3);
    expect(items.map((item) => item.kind)).toEqual(["produce", "variant", "fix"]);
    const page = mountBoost();
    clickButtonContaining(page, "换你来说");
    for (const [index, item] of items.entries()) {
      expect(stepLabel(page)).toBe(`第 ${index + 1} / 3 题`);
      if (item.kind === "variant" || item.kind === "fix") {
        expect(page.has(item.shapedFrom!), `${item.kind} 缺样例句`).toBe(true);
        expect(page.has(item.shapedLabel!), `${item.kind} 缺样例句标签`).toBe(true);
      } else {
        expect(page.has(item.intentZh)).toBe(true);
      }
      expect(kindLabel(page).length).toBeGreaterThan(0);
      expect(answerBoostItem(page, item), `第 ${index + 1} 题（${item.kind}）作答失败`).toBe("passed");
      if (index + 1 < 3) page.click("下一题");
    }
    page.click("完成这一档");
    expect(page.has("又稳了一层")).toBe(true);
    page.unmount();
  });
});

describe("BO1-e 完成事件与页面文案同源核验", () => {
  beforeEach(() => resetStorage());

  it("档 1 全对：页面显示「4 / 4 题一次就对」，completed 事件的 firstTryCount 也应为 4", async () => {
    seedLesson();
    const items = buildBoostItems(DONE_LESSON_ID, 1, {});
    const page = mountBoost();
    clickButtonContaining(page, "再认一次");
    expect(runTier(page, items)).toBe(4);
    await flushAsync();

    const heroSub = (page.container.querySelector(".complete-hero-sub")?.textContent ?? "").trim();
    expect(heroSub).toContain("4 / 4 题一次就对");

    const completed = telemetryOfKind("grammar_boost_completed");
    expect(completed.length).toBe(1);
    expect(completed[0].total).toBe(4);
    // 页面显示 4/4（用户看得到的事实），埋点必须同口径
    expect(completed[0].firstTryCount, "完成事件的 firstTryCount 与页面文案不一致").toBe(4);
    expect(readAppData().grammarBoostsDone?.[DONE_LESSON_ID]).toEqual([1]);
    page.unmount();
  });

  it("档 2 / 档 3 全对：同理，firstTryCount 应等于总题数", async () => {
    for (const tier of [2, 3] as const) {
      resetStorage();
      seedLesson(tier === 3 ? { [DONE_LESSON_ID]: [1, 2] } : undefined);
      const items = buildBoostItems(DONE_LESSON_ID, tier, {});
      const page = mountBoost(`?tier=${tier}`);
      expect(runTier(page, items)).toBe(items.length);
      await flushAsync();
      const completed = telemetryOfKind("grammar_boost_completed");
      expect(completed[0].total, `档 ${tier}`).toBe(items.length);
      expect(completed[0].firstTryCount, `档 ${tier} 全对时 firstTryCount 应等于 ${items.length}`).toBe(items.length);
      page.unmount();
    }
  });
});

/** 对当前题造一次「错误作答」。返回是否成功造出。 */
const wrongAction = (page: Mounted, item: BoostItem): boolean => {
  const clickFirst = (selector: string, exclude: string[]) => {
    const buttons = Array.from(page.container.querySelectorAll(selector)) as HTMLButtonElement[];
    const target = buttons.find(
      (button) => !button.disabled && button.textContent !== null && !exclude.includes((button.textContent ?? "").trim())
    );
    if (!target) return false;
    clickElement(target);
    return true;
  };
  switch (item.kind) {
    case "contrast":
      clickElement(
        Array.from(page.container.querySelectorAll(".boost-choice")).find(
          (button) => (button.textContent ?? "").trim() === (item.contrast?.isWrong ? "没问题" : "有点问题")
        ) as Element
      );
      clickElement(
        Array.from(page.container.querySelectorAll("button")).find((b) => (b.textContent ?? "").trim() === "确认") as Element
      );
      return true;
    case "bothright":
      return clickFirst(".boost-choice", ["两句都对"]);
    case "listen":
      return clickFirst(".boost-listen-option", [item.listenText ?? ""]);
    case "spot": {
      const accepted = item.spotWrongIndexes?.length ? item.spotWrongIndexes : [item.spotWrongIndex ?? -1];
      const wrongIndex = (item.spotTokens ?? []).findIndex((_token, index) => !accepted.includes(index));
      const chips = Array.from(page.container.querySelectorAll(".lesson-spot-row button")) as HTMLButtonElement[];
      if (wrongIndex < 0 || !chips[wrongIndex]) return false;
      clickElement(chips[wrongIndex]);
      return true;
    }
    case "cloze": {
      if (!clickFirst(".boost-choice", [item.clozeAnswer ?? ""])) return false;
      clickElement(
        Array.from(page.container.querySelectorAll("button")).find((b) => (b.textContent ?? "").trim() === "确认") as Element
      );
      return true;
    }
    case "choose":
    case "replace":
      return clickFirst(".boost-choice", [item.answer]);
    case "rebuild":
    case "arrange": {
      const answerWords = item.answer.split(/\s+/).filter(Boolean);
      const bank = Array.from(page.container.querySelectorAll(".lesson-spot-row button")) as HTMLButtonElement[];
      for (let step = 0; step < answerWords.length; step += 1) {
        const chip = [...bank].reverse().find((button) => !button.disabled);
        if (!chip) break;
        clickElement(chip);
      }
      return true;
    }
    default:
      typeAnswer(page, "zzz qqq");
      const submit = Array.from(page.container.querySelectorAll("button")).find(
        (b) => (b.textContent ?? "").trim() === "提交"
      ) as HTMLButtonElement | undefined;
      if (!submit) return false;
      clickElement(submit);
      return true;
  }
};
