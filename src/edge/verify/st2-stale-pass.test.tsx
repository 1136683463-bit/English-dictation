// @vitest-environment jsdom
/**
 * ST2 · 答对后拆掉重拼，「答对」横幅必须诚实（用户实测报告）。
 *
 * 用户流程：guided arrange 答对（7 块全对）→ 把词块点掉再乱点回去（始终不满 7 块）
 * → 因为「已通过的题保留通关态」（ST1/FAIL-4 的修法），判题不再触发，
 * 但绿色「答对」横幅一直挂着——用户视角：「我乱选也判断正确了」。
 *
 * 期望：通过后可以自由摆弄（出口不丢），但**横幅必须如实**——
 * 摆弄中的排列不再等于答案时，显示中性提示而不是「答对」。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import {
  answerGuidedCorrectly,
  answerPretest,
  bankWords,
  builtWords,
  clearBuild,
  clickEl,
  guidedEntries,
  markLessonsDoneInStorage,
  norm,
  type GuidedEntry
} from "../lessonFlow";

const LESSON = "lesson-12-will"; // 用户正在上的课；guided 里有 7 词 arrange

const mount = () => {
  const warm = mountPage(<GrammarLessonPage />, "/grammar/lesson/lesson-01-am", "/grammar/lesson/:lessonId");
  warm.unmount();
  markLessonsDoneInStorage(["lesson-01-am"]);
  return mountPage(<GrammarLessonPage />, `/grammar/lesson/${LESSON}`, "/grammar/lesson/:lessonId");
};

const enterGuided = (page: ReturnType<typeof mount>) => {
  answerPretest(page, LESSON, true);
  page.clickMatch(/^(开始上课|先过一遍讲解)$/);
  page.click("下一步：搭装与对错");
  page.click("下一步：变奏");
  page.click("看懂了，试一试");
  expect(page.has("试一试"), "应已进入 guided 段").toBe(true);
  return guidedEntries(LESSON);
};

const advanceTo = (page: ReturnType<typeof mount>, entries: GuidedEntry[], at: number) => {
  for (let index = 0; index < at; index += 1) {
    answerGuidedCorrectly(page, entries[index]);
    page.click("下一题");
  }
};

describe("ST2 · 答对后摆弄，横幅要诚实", () => {
  beforeEach(() => resetStorage());

  it("答对 → 拆掉 → 乱拼（不满词数）→ 不得仍显示「答对」", async () => {
    const page = mount();
    const entries = enterGuided(page);
    const at = entries.findIndex((e) => e.step.kind === "arrange" && e.step.answer.includes("park"));
    expect(at, "本课应有一道含 park 的 arrange 题").toBeGreaterThanOrEqual(0);
    advanceTo(page, entries, at);
    const entry = entries[at];

    // 1) 正解 → 判对
    const words = norm(entry.step.answer).split(" ").filter(Boolean);
    expect(answerGuidedCorrectly(page, entry)).toBe(true);
    expect(page.container.querySelector(".lesson-feedback.pass"), "正解后应显示答对").toBeTruthy();

    // 2) 全部拆掉（通关态按设计保留）
    clearBuild(page);
    expect(builtWords(page)).toEqual([]);

    // 3) 乱拼 6 块：漏掉最后一个词，其余乱序（复刻用户截图的 the park We will to go）
    const scrambled = [...words.slice(0, -1)].reverse();
    const used = new Set<number>();
    for (const word of scrambled) {
      const chips = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-bank button.lesson-chip"));
      const chip = chips.find((el, index) => !used.has(index) && norm(el.textContent ?? "") === norm(word));
      expect(chip, `词块库里应还有「${word}」`).toBeTruthy();
      if (chip) { used.add(chips.indexOf(chip)); clickEl(chip); }
    }
    expect(builtWords(page).length, "应处于不满词数的摆弄状态").toBe(words.length - 1);

    // 4) 横幅必须诚实：不得仍是「答对」
    const passBox = page.container.querySelector(".lesson-feedback.pass");
    expect(passBox, "拆掉乱拼后不得仍显示答对横幅（用户报告的缺陷）").toBeNull();
    page.unmount();
  });
});
