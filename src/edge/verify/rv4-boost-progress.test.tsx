// @vitest-environment jsdom
/**
 * RV4 · 趁热练的进度与结算必须自洽（2026-09-21 修，两处）
 *
 * ① 进度胶囊在答错时也前进：
 *    `index + (outcome === "idle" ? 0 : 1)` 对复习页是对的（那边答错只有 pass/revealed 两种终态），
 *    但趁热练有 **retry 非终态**——用户还停在同一题重试，进度却已 +1，
 *    与同屏的「第 X / N 题」自相矛盾。
 *
 * ② 最后一道题一次答对时，完成页说「4 / 4 题一次就对」，埋点只记 3：
 *    `advance` 里 setFirstTryCount 是异步的，finishTier 读的是旧值。
 *    用户看得到的事实（4/4）与上报口径（3）不一致，AI 使用率/通过率一条链都偏。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import { BOOST_TIER_META, boostArrangeAnswerLength, buildBoostItems, type BoostItem } from "../../services/grammarBoostService";
import { clickButtonContaining, clickElement, flushAsync, setInputValue } from "./drive";
import { makeAppData } from "./fixtures";

const LESSON_ID = "lesson-13-now";

const seed = (): void => {
  window.localStorage.setItem(
    "personal-vocab-app-data-v1",
    JSON.stringify(
      makeAppData({
        grammarLessonsDone: [LESSON_ID],
        settings: { ...makeAppData().settings, aiProvider: { ...makeAppData().settings.aiProvider, enabled: false } }
      } as never)
    )
  );
};

const mountBoost = (tier: number) =>
  mountPage(
    <GrammarBoostPage />,
    `/grammar/boost/${LESSON_ID}?tier=${tier}&from=card`,
    "/grammar/boost/:lessonId"
  );

/** 读埋点事件（存储是 { version, events } 包裹，不是裸数组）。 */
const telemetry = (): Array<Record<string, unknown>> =>
  (JSON.parse(window.localStorage.getItem("grammar-telemetry-events-v1") ?? "{}") as { events?: unknown }).events as
    | Array<Record<string, unknown>>
    | undefined ?? [];

const completedEvent = () => telemetry().find((event) => event.kind === "grammar_boost_completed");

/** 按「正确答案」作答当前这道题（依题型自动选择操作）。 */
const answerCorrectly = (page: ReturnType<typeof mountBoost>, item: BoostItem): boolean => {
  switch (item.kind) {
    case "cloze":
      // cloze 的 `answer` 是整句，真正要选的是挖空那个词；选完还要点「确认」
      clickButtonContaining(page, item.clozeAnswer ?? "");
      clickConfirm(page);
      return true;
    case "choose":
    case "replace":
      clickButtonContaining(page, item.answer ?? "");
      clickConfirm(page);
      return true;
    case "listen":
      clickButtonContaining(page, item.answer ?? "");
      return true;
    case "contrast":
      clickElement(mustFind(page, "有点问题"));
      clickConfirm(page);
      return true;
    case "bothright":
      clickElement(mustFind(page, "两句都对"));
      clickConfirm(page);
      return true;
    case "spot": {
      const index = (item.spotWrongIndexes ?? [item.spotWrongIndex]).filter(
        (value): value is number => typeof value === "number"
      )[0];
      const chips = Array.from(page.container.querySelectorAll(".lesson-spot-row button")) as HTMLButtonElement[];
      clickElement(chips[index]);
      return true;
    }
    case "rebuild":
    case "arrange": {
      /**
       * 排序题的词块库是**打乱后**的（arrange 还含干扰项），所以不能按 item.answer 的词序点，
       * 只能按库里实际存在的词块去找——按 answer 的顺序在库里逐个点，点得到就能拼对。
       */
      const need = boostArrangeAnswerLength(item);
      const bank = (): HTMLButtonElement[] =>
        Array.from(page.container.querySelectorAll(".lesson-bank button")) as HTMLButtonElement[];
      let placed = 0;
      for (const token of (item.answer ?? "").split(/\s+/).filter(Boolean)) {
        const chip = bank().find((button) => !button.disabled && (button.textContent ?? "").trim() === token);
        if (!chip) return false;
        clickElement(chip);
        placed += 1;
      }
      expect(placed).toBe(need);
      // 摆满「答案词数」即自动判题，不需要再点确认
      const confirm = findButton(page, "确认");
      if (confirm && !page.has("对了")) clickElement(confirm);
      return true;
    }
    default: {
      const area = page.container.querySelector("textarea, input.large-textarea") as HTMLTextAreaElement | null;
      if (!area) return false;
      setInputValue(area, item.answer ?? "");
      const submit = findButton(page, "检查") ?? findButton(page, "提交");
      if (!submit) return false;
      clickElement(submit);
      return true;
    }
  }
};

const findButton = (page: ReturnType<typeof mountBoost>, needle: string): HTMLButtonElement | undefined =>
  (Array.from(page.container.querySelectorAll("button")) as HTMLButtonElement[]).find(
    (button) => !button.disabled && (button.textContent ?? "").includes(needle)
  );

/** 部分题型（cloze / choose / replace / contrast / bothright）选完要点「确认」才判题。 */
const clickConfirm = (page: ReturnType<typeof mountBoost>): void => {
  const confirm = findButton(page, "确认");
  if (confirm) clickElement(confirm);
};

/** 必须找到的按钮（找不到就抛错，便于定位）。 */
const mustFind = (page: ReturnType<typeof mountBoost>, needle: string): HTMLButtonElement => {
  const button = findButton(page, needle);
  if (!button) throw new Error(`找不到按钮「${needle}」；当前：${page.buttons().join(" | ")}`);
  return button;
};

describe("RV4 趁热练进度与结算自洽", () => {
  beforeEach(() => resetStorage());

  it("答错进入 retry 时，进度胶囊不前进（与「第 X / N 题」一致）", async () => {
    seed();
    const page = mountBoost(1);
    const items = buildBoostItems(LESSON_ID, 1, {});
    await flushAsync();

    // 故意答错第一题
    if (items[0].kind === "cloze" || items[0].kind === "choose") {
      const wrong = (items[0].options ?? []).find((option) => option !== items[0].answer);
      if (wrong) clickButtonContaining(page, wrong);
    } else if (items[0].kind === "contrast") {
      clickElement(mustFind(page, "没问题"));
    } else if (items[0].kind === "spot") {
      const chips = Array.from(page.container.querySelectorAll(".lesson-spot-row button")) as HTMLButtonElement[];
      const wrongIndex = chips.findIndex((_chip, index) => !(items[0].spotWrongIndexes ?? []).includes(index));
      if (wrongIndex >= 0) clickElement(chips[wrongIndex]);
    } else {
      const area = page.container.querySelector("textarea, input.large-textarea") as HTMLTextAreaElement | null;
      if (area) {
        setInputValue(area, "zzz");
        const submit = findButton(page, "检查") ?? findButton(page, "提交");
        if (submit) clickElement(submit);
      }
    }
    await flushAsync();

    expect(page.has("再试一次"), "答错应进入 retry").toBe(true);
    expect(
      page.container.querySelector(".lesson-progress-pill span")?.textContent,
      "答错还停在同一题，进度不该前进"
    ).toBe(`0 / ${items.length} 题`);
    page.unmount();
  });

  it("最后一道题一次答对：页面文案与 completed 事件的 firstTryCount 同口径", async () => {
    seed();
    const page = mountBoost(1);
    const items = buildBoostItems(LESSON_ID, 1, {});
    await flushAsync();

    for (let index = 0; index < items.length; index += 1) {
      const ok = answerCorrectly(page, items[index]);
      expect(ok, `第 ${index + 1} 题应能作答（kind=${items[index].kind}）`).toBe(true);
      await flushAsync();
      if (index + 1 < items.length) {
        const next = findButton(page, "下一题");
        if (next) clickElement(next);
        await flushAsync();
      }
    }
    const finish = findButton(page, "完成这一档");
    if (finish) clickElement(finish);
    await flushAsync();

    const total = BOOST_TIER_META[1].questionCount;
    expect(page.text(), "完成页应说全部一次就对").toContain(`${total} / ${total} 题一次就对`);
    expect(completedEvent()?.firstTryCount, "埋点必须与页面文案一致").toBe(total);
    page.unmount();
  });
});
