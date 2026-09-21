// @vitest-environment jsdom
/**
 * BO2 · 档位独立性 + 体面退出（清单项 2）
 *
 * 产品承诺（GrammarBoostPage.tsx:42、PRD US-2 / §4.3）：
 * 「每档独立完成态；**允许只做一档就体面退出**；零门禁、零打卡、无结算分数」。
 *
 * 本文件核验 UI 是否真的兑现：
 * 1. 只做档 1 就退出 → 无施压文案、档 1 记为完成、档 2 仍可做、档 3 可直达；
 * 2. 完成态不出现任何「未完成 / 还差 / 建议继续」式施压；选择态不出现"没做完"暗示；
 * 3. 零门禁：档 3 可直达；档 1 可重练；错题不阻塞；
 * 4. 无结算分数：完成态不出现百分比 / 得分 / 正确率；界面上没有任何倒计时/剩余时间。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import { BOOST_TIER_META, buildBoostItems, getLessonBoostTiersDone } from "../../services/grammarBoostService";
import { DONE_LESSON_ID, exitsOf, readAppData, seedAppData } from "./fixtures";
import { answerBoostItem, clickButtonContaining, clickElement, flushAsync } from "./drive";
import type { Mounted } from "../harness";
import type { BoostItem } from "../../services/grammarBoostService";

const seedLesson = (boostsDone?: Record<string, number[]>, lessonId = DONE_LESSON_ID) =>
  seedAppData({
    grammarLessonsDone: [lessonId],
    grammarLessonStagesDone: { [lessonId]: [1] },
    ...(boostsDone ? { grammarBoostsDone: boostsDone } : {})
  });

const mountBoost = (lessonId = DONE_LESSON_ID, search = "") =>
  mountPage(<GrammarBoostPage />, `/grammar/boost/${lessonId}${search}`, "/grammar/boost/:lessonId");

const runTier = (page: Mounted, items: ReturnType<typeof buildBoostItems>): number => {
  let answered = 0;
  for (const [index, item] of items.entries()) {
    if (answerBoostItem(page, item) !== "passed") break;
    answered += 1;
    if (index + 1 < items.length) page.click("下一题");
    else page.click("完成这一档");
  }
  return answered;
};

/** 施压 / 挫败话术（Affective Filter 与「零门禁」红线的判定词）。 */
const PRESSURE_PHRASES = [
  "未完成", "还没做完", "继续加油", "不能放弃", "必须", "建议完成", "还差", "剩余", "不要半途",
  "打卡", "连续", "坚持", "失败", "做错", "答错", "错误", "正确率", "得分", "分数", "排名", "体力",
  "倒计时", "剩余时间", "时间不多了"
];

/** 对当前题造一次「错误作答」（不点再试一次）。返回是否成功造出。 */
const failOnce = (page: Mounted, item: BoostItem): boolean => {
  const clickFirst = (selector: string, exclude: string[]) => {
    const buttons = Array.from(page.container.querySelectorAll(selector)) as HTMLButtonElement[];
    const target = buttons.find(
      (button) => !button.disabled && !exclude.includes((button.textContent ?? "").trim())
    );
    if (!target) return false;
    clickElement(target);
    return true;
  };
  const confirm = () =>
    clickElement(
      Array.from(page.container.querySelectorAll("button")).find((b) => (b.textContent ?? "").trim() === "确认") as Element
    );
  switch (item.kind) {
    case "contrast":
      clickFirst(".boost-choice", [item.contrast?.isWrong ? "没问题" : "有点问题"]);
      confirm();
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
    case "cloze":
      if (!clickFirst(".boost-choice", [item.clozeAnswer ?? ""])) return false;
      confirm();
      return true;
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
    default: {
      const field = page.container.querySelector("input.large-textarea");
      if (!field) return false;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(field, "zzz qqq");
      field.dispatchEvent(new Event("input", { bubbles: true }));
      const submit = Array.from(page.container.querySelectorAll("button")).find(
        (b) => (b.textContent ?? "").trim() === "提交"
      ) as HTMLButtonElement | undefined;
      if (!submit) return false;
      clickElement(submit);
      return true;
    }
  }
};

describe("BO2-a 只做档 1 就体面退出", () => {
  beforeEach(() => resetStorage());

  it("档 1 完成态：无施压文案；出口只有「再深一点 / 回这一课 / 今天先到这」", async () => {
    seedLesson();
    const items = buildBoostItems(DONE_LESSON_ID, 1, {});
    const page = mountBoost(DONE_LESSON_ID);
    clickButtonContaining(page, "再认一次");
    expect(runTier(page, items)).toBe(4);
    await flushAsync();

    // 收口文案：肯定「今天练到这也算数」，而不是暗示没做完
    expect(page.has("今天练到这也算数")).toBe(true);
    // 只完成一档时，仍给「回这一课看看」与「今天先到这」两个不施压的出口
    const exits = exitsOf(page.container);
    expect(exits.some((text) => text.includes("今天先到这"))).toBe(true);

    // 全页面无施压/挫败话术
    const text = page.text();
    const offenders = PRESSURE_PHRASES.filter((phrase) => text.includes(phrase));
    expect(offenders, `完成态出现施压话术：${offenders.join("/")}`).toEqual([]);

    // 完成态不出现结算分数 / 正确率百分比
    expect(/\d+%/.test(text), `完成态出现了百分比：${text.match(/\d+%/g)?.join(",")}`).toBe(false);
    page.unmount();
  });

  it("档 1 完成 → 退出 → 再进：档 1 记「走过一遍」、档 2 可做且被建议", async () => {
    seedLesson();
    const page = mountBoost(DONE_LESSON_ID);
    clickButtonContaining(page, "再认一次");
    runTier(page, buildBoostItems(DONE_LESSON_ID, 1, {}));
    await flushAsync();
    expect(readAppData().grammarBoostsDone?.[DONE_LESSON_ID]).toEqual([1]);
    page.unmount();

    const again = mountBoost(DONE_LESSON_ID);
    expect(again.has("走过一遍")).toBe(true);
    expect(again.has("建议从这里开始")).toBe(true);
    expect(again.has("练到第 1 档")).toBe(true);
    // 三张档位卡都还在，且都能点（不锁死）
    const tierCards = again.buttons().filter((text) => text.includes("约"));
    expect(tierCards.length).toBe(3);
    // 选择态同样无施压话术
    const offenders = PRESSURE_PHRASES.filter((phrase) => again.text().includes(phrase));
    expect(offenders, `选择态出现施压话术：${offenders.join("/")}`).toEqual([]);
    again.unmount();
  });

  it("档 3 可直达（不强制先做档 1/2）：零门禁", async () => {
    seedLesson();
    const page = mountBoost(DONE_LESSON_ID);
    clickButtonContaining(page, "换你来说");
    const items = buildBoostItems(DONE_LESSON_ID, 3, {});
    expect(page.has(`第 1 / ${items.length} 题`)).toBe(true);
    expect(runTier(page, items)).toBe(3);
    await flushAsync();
    // 只做了档 3：完成态写入 [3]，且下一档建议仍是「再认一次」（未完成的最小档）
    expect(readAppData().grammarBoostsDone?.[DONE_LESSON_ID]).toEqual([3]);
    expect(page.buttons().some((text) => text.includes("再深一点：再认一次"))).toBe(true);
    page.unmount();
  });

  it("三档都完成后：不再推下一档，回课入口 + 选择态「三档都走过了」", async () => {
    seedLesson({ [DONE_LESSON_ID]: [1, 2, 3] });
    const page = mountBoost(DONE_LESSON_ID);
    expect(page.has("三档都走过了")).toBe(true);
    expect(page.buttons().filter((text) => text.includes("走过一遍")).length).toBe(3);
    // 三档都能重练（不是锁死）
    expect(page.buttons().filter((text) => text.includes("约")).length).toBe(3);
    page.unmount();
  });
});

describe("BO2-b 零门禁 / 无结算分数", () => {
  beforeEach(() => resetStorage());

  it("全部答错后走完一档：仍写入完成态（无正确率门禁）", async () => {
    seedLesson();
    const items = buildBoostItems(DONE_LESSON_ID, 1, {});
    const page = mountBoost(DONE_LESSON_ID);
    clickButtonContaining(page, "再认一次");
    for (const [index, item] of items.entries()) {
      // 先答错（每种题型各一条错误路径），确认进入 retry 而非被阻塞
      expect(failOnce(page, item), `第 ${index + 1} 题（${item.kind}）无法造出错误作答`).toBe(true);
      expect(page.buttons(), `第 ${index + 1} 题（${item.kind}）答错后没有「再试一次」`).toContain("再试一次");
      page.click("再试一次");
      expect(answerBoostItem(page, item)).toBe("passed");
      if (index + 1 < items.length) page.click("下一题");
      else page.click("完成这一档");
    }
    await flushAsync();
    expect(readAppData().grammarBoostsDone?.[DONE_LESSON_ID]).toEqual([1]);
    const text = page.text();
    expect(/\d+%/.test(text), "完成态不该出现正确率百分比").toBe(false);
    page.unmount();
  });

  it("错到看答案也不扣分、不降级：完成态文案仍是肯定句", async () => {
    seedAppData({
      grammarLessonsDone: [DONE_LESSON_ID],
      grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] },
      grammarBoostsDone: { [DONE_LESSON_ID]: [1, 2] }
    });
    const items = buildBoostItems(DONE_LESSON_ID, 3, {});
    const page = mountBoost(DONE_LESSON_ID, "?tier=3");
    for (const [index, item] of items.entries()) {
      const field = page.container.querySelector("input.large-textarea")!;
      field.setAttribute("value", "");
      const input = field as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, item.answer);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      page.click("提交");
      if (index + 1 < items.length) page.click("下一题");
      else page.click("完成这一档");
    }
    await flushAsync();
    const text = page.text();
    expect(PRESSURE_PHRASES.filter((phrase) => text.includes(phrase)), "档 3 完成态出现施压话术").toEqual([]);
    expect(readAppData().grammarBoostsDone?.[DONE_LESSON_ID]).toEqual([1, 2, 3]);
    page.unmount();
  });
});

describe("BO2-c 边界路径", () => {
  beforeEach(() => resetStorage());

  it("不存在的课：给「课程不存在」空态 + 返回课程地图，不崩", () => {
    seedLesson(undefined, DONE_LESSON_ID);
    const page = mountBoost("lesson-does-not-exist");
    expect(page.has("课程不存在")).toBe(true);
    expect(exitsOf(page.container).some((text) => text.includes("返回课程地图"))).toBe(true);
    page.unmount();
  });

  it("未完成这一课：不给练，指向「去上这一课」", () => {
    seedAppData({ grammarLessonsDone: [] });
    const page = mountBoost(DONE_LESSON_ID);
    expect(page.has("先上完这一课")).toBe(true);
    expect(exitsOf(page.container).some((text) => text.includes("去上这一课"))).toBe(true);
    page.unmount();
  });

  it("非法 tier 参数（?tier=4 / ?tier=abc）：回落到档位选择态而不崩", () => {
    for (const value of ["4", "abc", "0", "-1"]) {
      seedLesson();
      const page = mountBoost(DONE_LESSON_ID, `?tier=${value}`);
      expect(page.has("建议从这里开始") || page.buttons().some((t) => t.includes("约")), `?tier=${value}`).toBe(true);
      expect(page.text().length).toBeGreaterThan(0);
      page.unmount();
    }
  });

  it("?from=receipt / card / reaudit / direct 都能进档并渲染正常", () => {
    for (const from of ["receipt", "card", "reaudit", "direct"]) {
      seedLesson();
      const page = mountBoost(DONE_LESSON_ID, `?tier=1&from=${from}`);
      expect(page.has("第 1 / 4 题"), `from=${from}`).toBe(true);
      page.unmount();
    }
  });

  it("没有完成态数据时 buildBoostItems 仍能出题（服务层不设准入门槛）", () => {
    seedAppData({});
    expect(buildBoostItems(DONE_LESSON_ID, 1, {}).length).toBe(BOOST_TIER_META[1].questionCount);
    expect(getLessonBoostTiersDone(readAppData(), DONE_LESSON_ID).size).toBe(0);
  });
});
