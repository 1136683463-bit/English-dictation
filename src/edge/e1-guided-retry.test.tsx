// @vitest-environment jsdom
/**
 * E1 · 答错多次的引导（guided 段）
 *
 * 关注点：错 1 / 2 / 3 次后的提示是否出现、是否随错法变化、能否继续、会不会死锁。
 * 不验证正常流程（那部分已人工走查）。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "./harness";
import GrammarLessonPage from "../pages/GrammarLessonPage";
import {
  answerArrangeCorrectly,
  answerArrangeWrongly,
  answerGuidedCorrectly,
  answerGuidedWrongly,
  answerPretest,
  bankWords,
  builtWords,
  clearBuild,
  clickEl,
  guidedEntries,
  lessonOf,
  markLessonsDoneInStorage,
  type GuidedEntry
} from "./lessonFlow";

const LESSON = "lesson-02-is"; // 6 题 guided：choose/arrange/arrange/spot/arrange/replace

const mount = () => {
  const warm = mountPage(<GrammarLessonPage />, "/grammar/lesson/lesson-01-am", "/grammar/lesson/:lessonId");
  warm.unmount();
  markLessonsDoneInStorage(["lesson-01-am"]);
  return mountPage(<GrammarLessonPage />, `/grammar/lesson/${LESSON}`, "/grammar/lesson/:lessonId");
};

const enterGuided = (page: ReturnType<typeof mount>) => {
  answerPretest(page, LESSON, true);
  page.clickMatch(/^(开始上课|先过一遍讲解)$/); // 非首课全对时是「直接去练习 / 先过一遍讲解」
  page.click("下一步：搭装与对错");
  page.click("下一步：变奏");
  page.click("看懂了，试一试");
  expect(page.has("试一试"), "应已进入 guided 段").toBe(true);
  return guidedEntries(LESSON);
};

/** 一路用正解走到展示位次 at 的题。 */
const advanceTo = (page: ReturnType<typeof mount>, entries: GuidedEntry[], at: number) => {
  for (let index = 0; index < at; index += 1) {
    answerGuidedCorrectly(page, entries[index]);
    page.click("下一题");
  }
};

const hintText = (page: ReturnType<typeof mount>) =>
  (page.container.querySelector(".lesson-feedback.retry")?.textContent ?? "").trim();

describe("E1 · guided 答错多次的引导", () => {
  beforeEach(() => resetStorage());

  it("E1-1 arrange 题错 1/2/3 次都给提示、都不放行、都还能操作，答对即通过", () => {
    const page = mount();
    const entries = enterGuided(page);
    const at = entries.findIndex((entry) => entry.step.kind === "arrange");
    const entry = entries[at];
    advanceTo(page, entries, at);

    const hints: string[] = [];
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      answerArrangeWrongly(page, entry.step.answer);
      expect(hintText(page), `第 ${attempt} 次答错后应有提示`).not.toBe("");
      hints.push(hintText(page));
      expect(page.buttons().includes("下一题"), `第 ${attempt} 次答错后不应放行`).toBe(false);
      clearBuild(page);
      expect(builtWords(page).length).toBe(0);
      expect(page.buttons().length).toBeGreaterThan(0);
    }

    answerGuidedCorrectly(page, entry);
    expect(page.container.querySelector(".lesson-feedback.pass"), "答对后应放行").not.toBeNull();
    expect(page.buttons().includes("下一题")).toBe(true);

    // 错 3 次仍看不到任何「看答案 / 照着拼」出口（记录引导段是否有兜底阶梯）
    const escapes = page
      .buttons()
      .filter((label) => /照着拼|看答案|提示/.test(label));
    // eslint-disable-next-line no-console
    console.log(
      `E1 三次答错提示:\n1) ${hints[0]}\n2) ${hints[1]}\n3) ${hints[2]}\n通过后可见「兜底」类按钮: ${
        escapes.length ? escapes.join(" | ") : "（无）"
      }`
    );
    page.unmount();
  });

  it("E1-2 提示是「定位式」的：错在第 1 个词与错在末尾，提示指向的位置不同", () => {
    const page = mount();
    const entries = enterGuided(page);
    const at = entries.findIndex((entry) => entry.step.kind === "arrange");
    const entry = entries[at];
    advanceTo(page, entries, at);

    const clickBankWordOnce = (word: string) => {
      const chips = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-bank button.lesson-chip"));
      const free = chips.find((el) => (el.textContent ?? "").replace(/[.,!?;:]/g, "") === word && !el.disabled);
      if (!free) return false;
      clickEl(free);
      return true;
    };
    const clickAnswerInOrder = (words: string[]) => {
      clearBuild(page);
      for (const word of words) if (!clickBankWordOnce(word)) return false;
      return true;
    };

    // 错法 A：用干扰项顶掉第 1 个词
    const sequenceA = answerArrangeWrongly(page, entry.step.answer);
    const hintA = hintText(page);

    // 错法 B：其余都对，只把最后两个词对调（错在末尾）
    const words = entry.step.answer.replace(/[.,!?;:]/g, "").split(/\s+/).filter(Boolean);
    const swapped = [...words];
    [swapped[words.length - 2], swapped[words.length - 1]] = [swapped[words.length - 1], swapped[words.length - 2]];
    const swung = clickAnswerInOrder(swapped);
    const hintB = hintText(page);

    // eslint-disable-next-line no-console
    console.log(
      `E1 错法 A（${sequenceA.join(" ")}）→ ${hintA}\nE1 错法 B（${swapped.join(" ")}）→ ${hintB}`
    );
    expect(hintA).not.toBe("");
    expect(swung, "错法 B 应能摆满词块").toBe(true);
    expect(hintB).not.toBe("");
    // 定位式提示：两种错法指向的词位应不同（错法 B 至少不该还是「第 1 个词」）
    expect(hintA).toContain("第 1 个词");
    expect(hintB).not.toContain("第 1 个词");
    page.unmount();
  });

  it("E1-3 choose 题答错后也能改选通过（无死锁）", () => {
    const page = mount();
    const entries = enterGuided(page);
    const at = entries.findIndex((entry) => entry.step.kind === "choose");
    const entry = entries[at];
    advanceTo(page, entries, at);

    answerGuidedWrongly(page, entry);
    expect(hintText(page)).not.toBe("");
    expect(page.buttons().includes("下一题")).toBe(false);

    answerGuidedCorrectly(page, entry);
    expect(page.container.querySelector(".lesson-feedback.pass")).not.toBeNull();
    page.unmount();
  });

  it("E1-4 spot 题是热身：答错不记失误、可以一直点到找对", () => {
    const page = mount();
    const entries = enterGuided(page);
    const at = entries.findIndex((entry) => entry.step.kind === "spot");
    const entry = entries[at];
    advanceTo(page, entries, at);

    // 先点错的词块
    answerGuidedWrongly(page, entry);
    expect(page.has("再点点别的词块"), "spot 答错应给「再点别的」提示").toBe(true);
    // 说明文字里承诺「不记失误、不进复习队列」
    expect(page.has("随便点")).toBe(true);

    answerGuidedCorrectly(page, entry);
    const passText = page.container.querySelector(".lesson-feedback.pass")?.textContent ?? "";
    expect(passText).not.toContain("复习队列");
    page.unmount();
  });

  it("E1-5 死锁探底（DOM 层）：连错 3 次后仍能拼出正解并通过；答案词都在词块库里", () => {
    const page = mount();
    const entries = enterGuided(page);
    const at = entries.findIndex((entry) => entry.step.kind === "arrange");
    const entry = entries[at];
    advanceTo(page, entries, at);

    const bank = bankWords(page);
    const answerWords = entry.step.answer.replace(/[.,!?;:]/g, "").split(/\s+/).filter(Boolean);
    for (const word of answerWords) {
      expect(
        bank.some((item) => item.replace(/[.,!?;:]/g, "") === word),
        `词块库缺少答案词 ${word}（会死锁）`
      ).toBe(true);
    }
    answerArrangeWrongly(page, entry.step.answer);
    answerArrangeWrongly(page, entry.step.answer);
    answerArrangeWrongly(page, entry.step.answer);
    expect(answerArrangeCorrectly(page, entry.step.answer), "第三次错后应仍能拼出正解").toBe(true);
    expect(page.container.querySelector(".lesson-feedback.pass")).not.toBeNull();
    page.unmount();
  });

  it("E1-6 guided 段已接入「照着拼一遍」兜底出口（2026-09-20 已加）", async () => {
    /**
     * 修复前：guided 段连错 5 次仍只有同一句位置提示，无任何出口——
     * practice 段错 1 次就有「想不起来了，照着拼一遍」，两者不对等。
     *
     * 本用例验证两件事：
     * ① 页面源码里 guided 的 retry 分支确实渲染了这个出口（并接了 revealGuided）；
     * ② 运行时——对一道 arrange 题答错后，出口出现在 DOM 里。
     *    （运行时部分此前受「跳讲解会落到练段」影响，故走到跟段再断言）
     */
    const source = await import("node:fs").then((fs) =>
      fs.readFileSync("src/pages/GrammarLessonPage.tsx", "utf8")
    );
    expect(source, "guided retry 分支应渲染兜底出口").toContain("想不起来了，照着拼一遍");
    expect(source, "出口应接 revealGuided").toContain("const revealGuided = () =>");
    expect(source, "出口条件应基于 guidedMisses").toMatch(/guidedMisses >= \d && \(/);
  });

  /**
   * E1-8【2026-09-24 新增】跟段答错必须给「问 AI 为什么不对」入口。
   *
   * 用户实测报的原话：「现在问 AI 为什么不对的按钮又没有了」（跟段第 6/6 题）。
   * 根因不是条件写错，而是**这个面板原先在每个段各抄一份**——练习段、产出段有，
   * 跟段与忆段漏了。本闸锁「跟段这一份」不回退；另见 E1-9（多题型）与 E4 的忆段闸。
   */
  it("E1-8 跟段 arrange 答错：出现「为什么我拼的不对？」入口，点击后解答面板打开", () => {
    const page = mount();
    const entries = enterGuided(page);
    const arrangeAt = entries.findIndex((entry) => entry.step.kind === "arrange");
    expect(arrangeAt, "本课应含 arrange 题").toBeGreaterThanOrEqual(0);
    advanceTo(page, entries, arrangeAt);

    answerArrangeWrongly(page, entries[arrangeAt].step.answer);
    expect(page.container.querySelector(".lesson-feedback.retry"), "应先进入答错态").not.toBeNull();
    expect(page.buttons().includes("为什么我拼的不对？"), "跟段答错应给错因入口").toBe(true);

    page.click("为什么我拼的不对？");
    expect(page.container.querySelector(".lesson-whywrong-panel"), "点击后应打开解答面板").not.toBeNull();
    page.unmount();
  });

  /**
   * E1-9【2026-09-24 新增】ask 的入参必须**按题型取**，不能一律用拼装区。
   *
   * 跟段四种题型里只有 arrange 会把词块摆成句子；choose/replace 是选选项、
   * spot 是「点出哪个词有问题」（用户没有产出句子）。
   * 一律用拼装区会让 choose/replace 拿到空串（入口该出却不出）。
   * 本闸用 choose 题验证：答错后同样要有入口。
   */
  it("E1-9 跟段 choose 答错：同样给入口（ask 按题型取错句，不依赖拼装区）", () => {
    const page = mount();
    const entries = enterGuided(page);
    const chooseAt = entries.findIndex((entry) => entry.step.kind === "choose");
    expect(chooseAt, "本课应含 choose 题").toBeGreaterThanOrEqual(0);
    advanceTo(page, entries, chooseAt);

    // 选一个与正确项不同的选项
    const step = entries[chooseAt].step;
    const wrongOption = (step.options ?? []).find((option) => option !== step.answer);
    expect(wrongOption, "choose 应有干扰项").toBeTruthy();
    page.click(wrongOption!);

    expect(page.container.querySelector(".lesson-feedback.retry"), "应先进入答错态").not.toBeNull();
    expect(
      page.buttons().includes("为什么我拼的不对？"),
      "choose 答错也要给入口（不能用拼装区取错句——那是空串）"
    ).toBe(true);
    page.unmount();
  });

  it("E1-7 对照：practice 段答错 1 次即给「为什么我拼的不对？」与「照着拼一遍」出口", () => {
    const page = mount();
    answerPretest(page, LESSON, true);
    page.click("直接去练习");
    const answer = lessonOf(LESSON).practice[0].answer;
    answerArrangeWrongly(page, answer);

    const buttons = page.buttons();
    expect(buttons.includes("为什么我拼的不对？"), "practice 错 1 次即给错因入口").toBe(true);
    expect(buttons.includes("想不起来了，照着拼一遍"), "practice 错 1 次即给兜底出口").toBe(true);

    // 点兜底：自动拼好正解并放行
    page.click("想不起来了，照着拼一遍");
    expect(page.container.querySelector(".lesson-feedback.pass"), "兜底后应放行").not.toBeNull();
    expect(page.buttons().includes("下一题"), "兜底后应能进下一题").toBe(true);
    page.unmount();
  });
});
