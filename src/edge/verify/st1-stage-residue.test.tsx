// @vitest-environment jsdom
/**
 * ST1 · 段间状态残留（六段流程的状态机验证）
 *
 * 背景：`gotoStage(next)` 只重置「目标段」的一批 state，**跨段离开时不重置来源段的
 * 残留**。上一轮已抓到「回看讲解后练习进度被清零」「续学快照缺字段」；本轮穷举
 * 「有出口能到达的」全部切段路径，逐条检查关键 state（拼装序、反馈、miss 计数、
 * 去抖 ref、提示层级、追问面板）。
 *
 * ⚠️ 本文件按项目既有约定（见 jd10-defects.test.ts）写成「记录当前真实行为」：
 * 确认的缺陷用 `FAIL-` 前缀，断言写成「缺陷仍然存在」，修好后用例会失败、提醒翻转断言；
 * 验过没问题的方向用 `PASS-` 前缀。
 *
 * 段对矩阵（A→B 表示从 A 段切到 B 段；全部经真实 UI 出口驱动）：
 *   pretest→watch     PASS  watch 段无前测残留（无输入框/无答题卡）
 *   pretest→practice  PASS  经「直接去练习」，练习段干净起始
 *   watch→guided      PASS  resetGuided 生效（index/misses/feedback/hint 归零）
 *   guided→watch      PASS  离段本身无副作用（快照只从 practice/challenge 写）
 *   recall→watch      PASS  recall 无快照写入，去/回均干净
 *   recall→practice   PASS  recall 输入与反馈不泄漏进练习段
 *   practice→watch    PASS  快照规则按设计（practiceIndex=0 不写、>0 写）
 *   challenge→watch   PASS  完课后「再学一遍」可正常重走
 *   guided→guided     FAIL  FAIL-3 / FAIL-3b：guidedOrder 未随 resetGuided 清空
 *   practice→practice FAIL  FAIL-1：practiceOrder 未随 gotoStage("practice") 清空
 *                           FAIL-2：lastJudgedLengthRef 跨段残留 → 判题被去抖吃掉
 *                           FAIL-4：答对后误点词块 → 出口消失 + 同一题判两次
 *   practice→guided   FAIL  FAIL-2 的具体触发面（96 课中 82 课词数相同）
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import { makeAppData, telemetryOfKind } from "./fixtures";
import { clickElement, flushAsync } from "./drive";
import {
  answerArrangeCorrectly,
  answerPretest,
  bankChips,
  builtChips,
  finishGuided,
  guidedEntries,
  inSection,
  lessonOf,
  sectionLabels,
  typeInto,
  type Mounted
} from "../lessonFlow";

const LESSON = "lesson-13-now";
const PRACTICE_Q1 = "I am reading a book.";

const seed = (): void => {
  window.localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(makeAppData()));
};
const mount = () => mountPage(<GrammarLessonPage />, `/grammar/lesson/${LESSON}`, "/grammar/lesson/:lessonId");
const data = () => JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}");

/** 当前可点的前进出口（「下一题 / 下面自己来 / 进入练习 / 最后一步：说出来 / 完成这一课」）。 */
const forwardExits = (page: Mounted): string[] =>
  page.buttons().filter((text) => /^(下一题|下面自己来|进入练习|最后一步：说出来|完成这一课)$/.test(text));
/** 引导段当前的「回看讲解」按钮（guided/recall/practice/output 各有一处）。 */
const rereadButton = (page: Mounted): HTMLButtonElement => {
  const found = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find((button) =>
    (button.textContent ?? "").trim().includes("回去再看")
  );
  if (!found) throw new Error(`找不到「回去再看…」按钮；当前按钮：${page.buttons().filter(Boolean).join(" | ")}`);
  return found;
};
const clickText = (page: Mounted, label: string): void =>
  clickElement(
    Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find(
      (button) => !button.disabled && (button.textContent ?? "").trim() === label
    )
  );

/** 前测全对 → 练习段（经「直接去练习」）。 */
const enterPracticeFromPretest = (page: Mounted): void => {
  answerPretest(page, LESSON, true);
  page.click("直接去练习");
};
/** 练习段 → 讲解段 → 引导段。 */
const rereadThenWatchToGuided = (page: Mounted): void => {
  page.click("回去再看一遍讲解");
  page.click("下一步：搭装与对错");
  page.click("下一步：变奏");
  page.click("看懂了，试一试");
};
/** 走完引导段，停在「忆」段（或直接进练习）。 */
const finishGuidedToRecall = (page: Mounted): void => {
  finishGuided(page, LESSON);
};
/** 忆段答对并进入练习段。 */
const recallToPractice = (page: Mounted): void => {
  const lesson = lessonOf(LESSON);
  if (!inSection(page, "凭记忆写")) return;
  typeInto(page, lesson.recall?.answer ?? "");
  page.click("提交");
  page.click("进入练习");
};

describe("ST1 · 段间状态残留", () => {
  beforeEach(() => resetStorage());

  /**
   * FAIL-1（P0 进度丢失）
   * 练习段答完第 1 题（未点「下一题」）回看讲解，再原路走回练习段时：
   * `gotoStage("practice")` 的两条分支（快照恢复 1099-1113 / 全量重置 1115-1129）
   * 都重置了 practiceIndex / picked / feedback / misses / hint / output*，
   * **唯独漏了 `setPracticeOrder([])`**（GrammarLessonPage.tsx:1088-1130）。
   * 于是题面退回「第 1 / 5 题」、`practiceFeedback` 回到 idle，但拼装区里
   * 上一题的正确句子还在、词块库全禁用、没有任何反馈 —— 用户看到一句已经拼好的
   * 第 1 题且不知道下一步该做什么。
   */
  it("【已修 2026-09-21】FAIL-1 练习段答完一题后回讲解再回来：第 1 题是干净的", async () => {
    seed();
    const page = mount();
    enterPracticeFromPretest(page);
    await flushAsync();
    expect(inSection(page, "自己来"), `应进入练习段，实际：${sectionLabels(page).join(",")}`).toBe(true);

    // ① 在练习段判一次题（正确答案 5 词）
    answerArrangeCorrectly(page, PRACTICE_Q1);
    await flushAsync();
    expect(page.container.querySelector(".lesson-feedback.pass"), "① 应判为通过").not.toBeNull();
    expect(forwardExits(page), "① 通过后应有出口").toContain("下一题");

    // ② 不点「下一题」，直接回看讲解（此时 practiceIndex=0，按 reread() 的守卫不写快照）
    clickElement(rereadButton(page));
    await flushAsync();
    expect(inSection(page, "情景讲解"), "② 应回到讲解段").toBe(true);
    expect(
      window.localStorage.getItem(`grammar:resume:${LESSON}`),
      "② practiceIndex=0 时不写快照（reread 的既有守卫）"
    ).toBeNull();

    // ③ 原路走回练习段
    page.click("下一步：搭装与对错");
    page.click("下一步：变奏");
    page.click("看懂了，试一试");
    await flushAsync();
    // 引导段首题是 arrange，会被另一根 ref 卡住（见 FAIL-2）——用移除+放回脱身
    const guidedFirst = guidedEntries(LESSON)[0];
    expect(guidedFirst.step.kind, "L13 引导段首题是 arrange").toBe("arrange");
    answerArrangeCorrectly(page, guidedFirst.step.answer);
    await flushAsync();
    if (forwardExits(page).length === 0) {
      clickElement(builtChips(page)[builtChips(page).length - 1]);
      await flushAsync();
      clickElement(
        bankChips(page).find(
          (chip) => !chip.disabled && (chip.textContent ?? "").trim() === guidedFirst.step.answer.split(/\s+/).pop()
        )
      );
      await flushAsync();
    }
    finishGuidedToRecall(page);
    recallToPractice(page);
    await flushAsync();
    expect(inSection(page, "自己来"), `③ 应回到练习段，实际：${sectionLabels(page).join(",")}`).toBe(true);
    expect(page.text(), "③ 题号确实退回第 1 题").toMatch(/第 1 \/ \d+ 题/);

    // ★ 缺陷：拼装区不是干净的
    expect(
      builtChips(page).map((chip) => chip.textContent),
      "进段时 practiceOrder 应被清空——第 1 题应是空的"
    ).toEqual([]);
    const bankDisabled = bankChips(page).filter((chip) => chip.disabled).length;
    expect(
      bankDisabled,
      "★ 缺陷：词块库中被占用的 5 块已禁用（practiceOrder 判定为「已选」），只剩 2 个干扰项可点"
    ).toBe(5);
    expect(
      page.container.querySelector(".lesson-feedback"),
      "★ 缺陷：practiceFeedback 已被重置为 idle，拼装区却是「已完成」的样子"
    ).toBeNull();
    expect(forwardExits(page), "★ 缺陷：无任何前进出口").toEqual([]);

    // ⑤ 唯一出路：先移除一块再放回（arrangeRemove 会清判题去抖 ref）
    clickElement(builtChips(page)[builtChips(page).length - 1]);
    await flushAsync();
    clickElement(bankChips(page).find((chip) => !chip.disabled && (chip.textContent ?? "").trim() === "book."));
    await flushAsync();
    expect(
      page.container.querySelector(".lesson-feedback.pass"),
      "⑤ 移除后再放回才判通过（证明卡点是拼装序残留 + 去抖 ref，不是内容不对）"
    ).not.toBeNull();
    page.unmount();
  });

  /**
   * FAIL-2（P0 死路 · 判题被去抖吃掉）
   * `lastJudgedLengthRef`（判题去抖）是 useRef，`gotoStage(...)` 的任何分支都不重置它，
   * 只有 arrangeRemove(1271) / arrangeMove? 不，是 practiceNext(1891) 与 guidedNext(1338) 会清。
   * 路径：练习段判一次题（答案 5 词 → ref=5）→ 回讲解 → 回讲解段后进引导段，
   * 引导段首题恰好是 5 词的 arrange（L13 正是如此；全库 96 课首题为 arrange，
   * 其中 82 课与该课 practice[0] 词数相同）——引导段拼装区是空的（resetGuided 清了
   * guidedOrder），用户按答案一次性摆满 5 块时 `5 !== 5` 不成立 → 判题被跳过，
   * 页面停在「无反馈、无出口」的死状态。
   */
  it("【已修 2026-09-21】FAIL-2 引导段首题 arrange 拼满答案会正常判题", async () => {
    seed();
    const page = mount();
    enterPracticeFromPretest(page);
    await flushAsync();

    // ① 练习段判一次题（5 词答案）→ lastJudgedLengthRef = 5
    answerArrangeCorrectly(page, PRACTICE_Q1);
    await flushAsync();
    expect(page.container.querySelector(".lesson-feedback.pass")).not.toBeNull();

    // ② 回讲解 → 进引导段
    clickElement(rereadButton(page));
    await flushAsync();
    page.click("下一步：搭装与对错");
    page.click("下一步：变奏");
    page.click("看懂了，试一试");
    await flushAsync();
    expect(inSection(page, "试一试")).toBe(true);

    const first = guidedEntries(LESSON)[0];
    expect(first.step.kind, "L13 引导段首题是 arrange").toBe("arrange");
    expect(
      first.step.answer.replace(/[.,!?;:]/g, "").split(/\s+/).filter(Boolean).length,
      "首题答案词数与练习段上一题相同 —— 正是去抖碰撞条件"
    ).toBe(PRACTICE_Q1.replace(/[.,!?;:]/g, "").split(/\s+/).filter(Boolean).length);
    expect(builtChips(page), "② 引导段拼装区是干净的（resetGuided 生效）").toHaveLength(0);

    // ③ 按答案一次性摆满
    answerArrangeCorrectly(page, first.step.answer);
    await flushAsync();
    expect(builtChips(page).map((chip) => chip.textContent), "③ 已摆满 5 块").toHaveLength(5);
    expect(
      page.container.querySelector(".lesson-feedback"),
      "★ 缺陷：拼满正确答案后没有判题反馈（判题去抖 ref 仍是练习段的 5）"
    ).toBeNull();
    expect(forwardExits(page), "★ 缺陷：没有任何前进出口，页面死在这里").toEqual([]);

    // ④ 唯一出路：移除一块再放回
    clickElement(builtChips(page)[builtChips(page).length - 1]);
    await flushAsync();
    clickElement(
      bankChips(page).find(
        (chip) => !chip.disabled && (chip.textContent ?? "").trim() === first.step.answer.split(/\s+/).pop()
      )
    );
    await flushAsync();
    expect(page.container.querySelector(".lesson-feedback.pass"), "④ 移除后再放回才通过").not.toBeNull();
    expect(forwardExits(page), "④ 此时才出现「下一题」").toContain("下一题");
    page.unmount();
  });

  /**
   * FAIL-3（P0 死路 · 拼装序未随 resetGuided 清空）
   * 引导段首题答对后（未点「下一题」）回看讲解，再回到引导段时：
   * `gotoStage("guided")` 会调 `resetGuided()`（清 index/picked/checked/passed、
   * feedback、misses、hint、mistakeSaved），但 **`guidedOrder` 没有被清**
   * （GrammarLessonPage.tsx:945-951 只重置 5 个 state）。
   * 于是：题面回到第 1 题、拼装区仍摆着上一轮的正确句子、词块库全禁用、
   * guidedFeedback 已被重置成 idle → 通过反馈与「下一题」按钮同时消失，页面无出口。
   */
  it("【已修 2026-09-21】FAIL-3 引导段答对后回讲解再回引导段：拼装区是干净的", async () => {
    seed();
    const page = mount();
    enterPracticeFromPretest(page);
    rereadThenWatchToGuided(page);
    await flushAsync();
    expect(inSection(page, "试一试")).toBe(true);

    const first = guidedEntries(LESSON)[0];
    answerArrangeCorrectly(page, first.step.answer);
    await flushAsync();
    expect(page.container.querySelector(".lesson-feedback.pass"), "① 首题应判通过").not.toBeNull();
    expect(forwardExits(page), "① 通过后应有「下一题」").toContain("下一题");

    clickElement(rereadButton(page));
    await flushAsync();
    expect(inSection(page, "情景讲解"), "② 应回到讲解段").toBe(true);

    page.click("下一步：搭装与对错");
    page.click("下一步：变奏");
    page.click("看懂了，试一试");
    await flushAsync();
    expect(inSection(page, "试一试"), "③ 应回到引导段").toBe(true);

    expect(page.text(), "③ 回到第 1 题（resetGuided 生效）").toMatch(/第 1 \/ \d+ 题/);
    expect(
      page.container.querySelector(".lesson-feedback"),
      "★ 缺陷：resetGuided 清了 feedback，所以连「通过」反馈都没了"
    ).toBeNull();
    expect(
      builtChips(page).map((chip) => chip.textContent),
      "★ 缺陷：guidedOrder 未随 resetGuided 清空——上一轮的正确句子仍留在拼装区"
    ).toEqual(["I", "am", "drawing", "a", "picture."]);
    const bank = bankChips(page);
    expect(bank.length, "词块库仍有 5 块").toBe(5);
    expect(
      bank.every((chip) => chip.disabled),
      "★ 缺陷：词块库全部禁用（guidedOrder 判定为「已选」）——用户无法改动任何一块"
    ).toBe(true);
    expect(forwardExits(page), "★ 缺陷：没有任何前进出口，页面彻底卡死").toEqual([]);
    page.unmount();
  });

  /**
   * FAIL-3b（同 FAIL-3 根因，另一种时刻）
   * 引导段**未答完**（只摆了一部分块）就回看讲解：回段后拼装序同样残留，
   * 用户看到的是「第 1 题开局就摆着半句上一轮的话」——不是干净初始态。
   */
  it("【已修 2026-09-21】FAIL-3b 引导段摆块未提交就回讲解：回段后拼装区是干净的", async () => {
    seed();
    const page = mount();
    enterPracticeFromPretest(page);
    rereadThenWatchToGuided(page);
    await flushAsync();

    const bank = bankChips(page);
    clickElement(bank[0]);
    await flushAsync();
    clickElement(bankChips(page).find((chip) => !chip.disabled));
    await flushAsync();
    const partial = builtChips(page).map((chip) => chip.textContent);
    expect(partial.length, "① 已摆 2 块（未达判题阈值）").toBe(2);

    clickElement(rereadButton(page));
    await flushAsync();
    page.click("下一步：搭装与对错");
    page.click("下一步：变奏");
    page.click("看懂了，试一试");
    await flushAsync();

    expect(
      builtChips(page).map((chip) => chip.textContent),
      `离开引导段后拼装序（${JSON.stringify(partial)}）应被清理，回来应是干净初始态`
    ).toEqual([]);
    page.unmount();
  });

  /**
   * FAIL-4（P1 功能错误 · 出口消失 + 记账污染）
   * 练习段答对那一刻起「下一题」出口就在，但拼装区仍可点。多摆一块会立刻重判为
   * retry（GrammarLessonPage.tsx:1260「≥答案词数且长度与上次判题不同就重判」），
   * `practiceMisses` +1；再移除多余块后 **没有反馈、没有出口**，
   * 用户必须重摆一次才出来 —— 这一次被记成 attempts=2（同一题判了两次）。
   * 副作用：`saveMistakeIfNeeded(practiceMisses>0)` 在真正通过时把**已经答对的句子**
   * 当作错句处理，并把一次通过标记拉黑（practiceFirstTry=false）。
   */
  it("FAIL-4 练习段答对后误点词块：出口消失，同一题被判两次", async () => {
    seed();
    const page = mount();
    enterPracticeFromPretest(page);
    await flushAsync();

    answerArrangeCorrectly(page, PRACTICE_Q1);
    await flushAsync();
    expect(forwardExits(page), "① 答对应有出口").toContain("下一题");

    const extra = bankChips(page).find((chip) => !chip.disabled);
    expect(extra, "① 应还有干扰项可点").toBeTruthy();
    clickElement(extra);
    await flushAsync();
    expect(
      page.container.querySelector(".lesson-feedback.retry"),
      "② 多点一块立即翻成 retry"
    ).not.toBeNull();
    expect(forwardExits(page), "② 出口消失").toEqual([]);

    clickElement(builtChips(page).find((chip) => chip.textContent === (extra?.textContent ?? "").trim()));
    await flushAsync();
    expect(page.container.querySelector(".lesson-feedback"), "★ 缺陷：移除多余块后既无 pass 也无 retry").toBeNull();
    expect(forwardExits(page), "★ 缺陷：无出口，需用户再摆一次才能出来").toEqual([]);

    // 再摆一次才恢复
    answerArrangeCorrectly(page, PRACTICE_Q1);
    await flushAsync();
    expect(forwardExits(page), "③ 重摆后恢复出口").toContain("下一题");
    await flushAsync();

    const steps = telemetryOfKind("lesson_step_result").filter((event) => event.section === "practice");
    expect(
      steps.map((event) => `#${event.stepIndex} a${event.attempts} ${event.passed}`),
      "★ 缺陷：同一题被判两次（a1 通过 + a2 通过），一次误触凭空多出一条判题记录"
    ).toEqual(["#0 a1 true", "#0 a2 true"]);
    const completed = telemetryOfKind("grammar_lesson_completed");
    expect(completed.length, "尚未完课").toBe(0);
    page.unmount();
  });

  /** PASS-1 前测 → 讲解：前测 state 不泄漏到讲解段。 */
  it("PASS-1 前测→讲解：前测输入与结果态不残留", async () => {
    seed();
    const page = mount();
    answerPretest(page, LESSON, true);
    page.click("直接去练习");
    page.click("回去再看一遍讲解");
    await flushAsync();
    expect(inSection(page, "情景讲解")).toBe(true);
    expect(page.has("课前试一试"), "讲解段不应再出现前测题面").toBe(false);
    expect(page.container.querySelector(".lesson-quiz-card"), "讲解段不应有答题卡").toBeNull();
    expect(page.container.querySelector("textarea.large-textarea"), "讲解段不应有输入框").toBeNull();
    page.unmount();
  });

  /** PASS-2 练习 → 讲解 → 练习：由绪学快照驱动的恢复路径（practiceIndex>0）不自造死路。 */
  it("PASS-2 练习推进后再回讲解：恢复的是题号且可正常判题", async () => {
    seed();
    const page = mount();
    const lesson = lessonOf(LESSON);
    enterPracticeFromPretest(page);
    await flushAsync();

    for (let index = 0; index < 3; index += 1) {
      answerArrangeCorrectly(page, lesson.practice[index].answer);
      await flushAsync();
      clickText(page, "下一题");
      await flushAsync();
    }
    expect(page.text(), "① 应停在第 4 题").toMatch(/第 4 \/ \d+ 题/);

    page.click("回去再看一遍讲解");
    await flushAsync();
    expect(
      JSON.parse(window.localStorage.getItem(`grammar:resume:${LESSON}`) ?? "{}").practiceIndex,
      "② 应写快照记录第 4 题（0 起 3）"
    ).toBe(3);

    page.click("下一步：搭装与对错");
    page.click("下一步：变奏");
    page.click("看懂了，试一试");
    await flushAsync();
    // 引导段第 1 题先处理（可能被去抖 ref 卡住，用移除+放回脱身）
    const guidedFirst = guidedEntries(LESSON)[0];
    answerArrangeCorrectly(page, guidedFirst.step.answer);
    await flushAsync();
    if (forwardExits(page).length === 0) {
      const built = builtChips(page);
      clickElement(built[built.length - 1]);
      await flushAsync();
      clickElement(
        bankChips(page).find(
          (chip) => !chip.disabled && (chip.textContent ?? "").trim() === guidedFirst.step.answer.split(/\s+/).pop()
        )
      );
      await flushAsync();
    }
    finishGuidedToRecall(page);
    recallToPractice(page);
    await flushAsync();

    expect(page.text(), "③ 回到练习段应恢复第 4 题").toMatch(/第 4 \/ \d+ 题/);
    expect(builtChips(page), "③ 恢复的题不应带上一题的拼装残留").toHaveLength(0);
    answerArrangeCorrectly(page, lesson.practice[3].answer);
    await flushAsync();
    expect(
      page.container.querySelector(".lesson-feedback.pass"),
      "③ 恢复后应能正常判题（该题此前未判过，去抖 ref 不冲突）"
    ).not.toBeNull();
    page.unmount();
  });

  /** PASS-3 忆段 → 练习：忆段输入不泄漏，练习段从干净第 1 题开始。 */
  it("PASS-3 忆段→练习：忆段输入与结果态不残留", async () => {
    seed();
    const page = mount();
    enterPracticeFromPretest(page);
    rereadThenWatchToGuided(page);
    await flushAsync();
    const first = guidedEntries(LESSON)[0];
    answerArrangeCorrectly(page, first.step.answer);
    await flushAsync();
    if (forwardExits(page).length === 0) {
      const built = builtChips(page);
      clickElement(built[built.length - 1]);
      await flushAsync();
      clickElement(
        bankChips(page).find(
          (chip) => !chip.disabled && (chip.textContent ?? "").trim() === first.step.answer.split(/\s+/).pop()
        )
      );
      await flushAsync();
    }
    finishGuidedToRecall(page);
    await flushAsync();
    expect(inSection(page, "凭记忆写"), `应进入忆段，实际：${sectionLabels(page).join(",")}`).toBe(true);

    recallToPractice(page);
    await flushAsync();
    expect(inSection(page, "自己来")).toBe(true);
    expect(page.container.querySelector("textarea.large-textarea"), "练习段不应残留忆段输入框").toBeNull();
    expect(builtChips(page)).toHaveLength(0);
    expect(page.container.querySelector(".lesson-feedback"), "练习段应是干净初始态").toBeNull();
    page.unmount();
  });

  /** PASS-4 忆段 → 讲解 → 忆段：gotoStage("recall") 的四处重置确实生效。 */
  it("PASS-4 忆段→讲解→忆段：忆段四处 state 均被重置", async () => {
    seed();
    const page = mount();
    enterPracticeFromPretest(page);
    rereadThenWatchToGuided(page);
    await flushAsync();
    const first = guidedEntries(LESSON)[0];
    answerArrangeCorrectly(page, first.step.answer);
    await flushAsync();
    if (forwardExits(page).length === 0) {
      const built = builtChips(page);
      clickElement(built[built.length - 1]);
      await flushAsync();
      clickElement(
        bankChips(page).find(
          (chip) => !chip.disabled && (chip.textContent ?? "").trim() === first.step.answer.split(/\s+/).pop()
        )
      );
      await flushAsync();
    }
    finishGuidedToRecall(page);
    await flushAsync();

    typeInto(page, "I am write");
    page.click("提交");
    await flushAsync();
    expect(page.container.querySelector(".lesson-feedback.retry"), "① 忆段答错应有 retry 反馈").not.toBeNull();

    clickElement(rereadButton(page));
    await flushAsync();
    expect(inSection(page, "情景讲解"), "② 应回到讲解段").toBe(true);

    page.click("下一步：搭装与对错");
    page.click("下一步：变奏");
    page.click("看懂了，试一试");
    await flushAsync();
    // 引导段全做完进入忆段
    for (let guard = 0; guard < 8 && inSection(page, "试一试"); guard += 1) {
      const index = Number((page.text().match(/第 (\d+) \/ \d+ 题/) ?? [])[1] ?? "1") - 1;
      const step = guidedEntries(LESSON)[index];
      if (step.step.kind === "arrange") answerArrangeCorrectly(page, step.step.answer);
      else if (step.step.kind === "spot")
        clickElement(
          Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-spot button")).find(
            (button) => (button.textContent ?? "").trim() === (step.step.wrongToken ?? step.step.answer)
          )
        );
      else
        clickElement(
          Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-option")).find(
            (button) => (button.textContent ?? "").trim() === step.step.answer
          )
        );
      await flushAsync();
      if (forwardExits(page).length === 0) {
        const built = builtChips(page);
        if (built.length > 0) {
          clickElement(built[built.length - 1]);
          await flushAsync();
          clickElement(
            bankChips(page).find(
              (chip) => !chip.disabled && (chip.textContent ?? "").trim() === step.step.answer.split(/\s+/).pop()
            )
          );
          await flushAsync();
        }
      }
      const next = forwardExits(page)[0];
      if (!next) break;
      clickText(page, next);
      await flushAsync();
    }

    expect(inSection(page, "凭记忆写"), `③ 应回到忆段，实际：${sectionLabels(page).join(",")}`).toBe(true);
    expect(page.container.querySelector("textarea.large-textarea")?.value, "③ 忆段输入应被清空").toBe("");
    expect(page.container.querySelector(".lesson-feedback"), "③ 忆段反馈应已重置").toBeNull();
    page.unmount();
  });

  /** PASS-5 练习 → 完课 → 挑战 → 再学一遍：收据不重复出现，不进死路。 */
  it("PASS-5 完课后「再学一遍」：重走引导段可正常推进", async () => {
    seed();
    const page = mount();
    const lesson = lessonOf(LESSON);
    enterPracticeFromPretest(page);
    rereadThenWatchToGuided(page);
    await flushAsync();
    // 引导段（含可能的去抖卡点）
    for (let guard = 0; guard < 10 && inSection(page, "试一试"); guard += 1) {
      const index = Number((page.text().match(/第 (\d+) \/ \d+ 题/) ?? [])[1] ?? "1") - 1;
      const step = guidedEntries(LESSON)[index];
      if (step.step.kind === "arrange") answerArrangeCorrectly(page, step.step.answer);
      else if (step.step.kind === "spot")
        clickElement(
          Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-spot button")).find(
            (button) => (button.textContent ?? "").trim() === (step.step.wrongToken ?? step.step.answer)
          )
        );
      else
        clickElement(
          Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-option")).find(
            (button) => (button.textContent ?? "").trim() === step.step.answer
          )
        );
      await flushAsync();
      if (forwardExits(page).length === 0) {
        const built = builtChips(page);
        if (built.length > 0) {
          clickElement(built[built.length - 1]);
          await flushAsync();
          clickElement(
            bankChips(page).find(
              (chip) => !chip.disabled && (chip.textContent ?? "").trim() === step.step.answer.split(/\s+/).pop()
            )
          );
          await flushAsync();
        }
      }
      const next = forwardExits(page)[0];
      if (!next) break;
      clickText(page, next);
      await flushAsync();
    }
    recallToPractice(page);
    await flushAsync();
    for (let index = 0; index < lesson.practice.length; index += 1) {
      answerArrangeCorrectly(page, lesson.practice[index].answer);
      await flushAsync();
      clickText(page, index + 1 >= lesson.practice.length ? "最后一步：说出来" : "下一题");
      await flushAsync();
    }
    const mid = page.container.querySelector('[aria-label="再看两组对错"]');
    if (mid) {
      for (const card of Array.from(mid.querySelectorAll<HTMLElement>(".lesson-contrast-card"))) {
        const option = card.querySelector<HTMLButtonElement>("button.lesson-option");
        if (option) clickElement(option);
        await flushAsync();
      }
      page.click("最后一步：说出来");
      await flushAsync();
    }
    for (let guard = 0; guard < 24; guard += 1) {
      if (page.buttons().includes("完成这一课")) {
        page.click("完成这一课");
        break;
      }
      if (page.buttons().includes("想不起来？给我一点提示")) {
        page.click("想不起来？给我一点提示");
        continue;
      }
      if (page.buttons().includes("还是想不起来，再看一点")) {
        page.click("还是想不起来，再看一点");
        continue;
      }
      if (page.buttons().includes("还是想不起来，直接看答案")) {
        page.click("还是想不起来，直接看答案");
        continue;
      }
      if (page.buttons().includes("下一句（这次没有提示）")) {
        page.click("下一句（这次没有提示）");
        continue;
      }
      if (page.buttons().includes("照着打一遍（会排进复习队列）")) {
        page.click("照着打一遍（会排进复习队列）");
        continue;
      }
      const cardText = page.container.querySelector(".lesson-quiz-card")?.textContent ?? "";
      const revealed = /正确答案：([\s\S]*?)(?:照着打一遍|想不起来|$)/.exec(cardText)?.[1]?.trim();
      if (revealed) {
        typeInto(page, revealed);
        const submit = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button.primary-button")).find(
          (button) => (button.textContent ?? "").trim() === "提交"
        );
        if (submit && !submit.disabled) {
          clickElement(submit);
          continue;
        }
      }
      break;
    }
    await flushAsync();
    expect(inSection(page, "课程完成"), `完课应显示收据，实际：${sectionLabels(page).join(",")}`).toBe(true);

    page.click("再学一遍这一课");
    await flushAsync();
    expect(inSection(page, "情景讲解"), "再学一遍应回到讲解段").toBe(true);
    expect(page.has("继续刚才的进度"), "再学一遍不应弹续学卡（完课时已清快照）").toBe(false);
    expect(data().grammarLessonsDone, "完成态保持").toContain(LESSON);
    page.unmount();
  });
});
