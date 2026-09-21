// @vitest-environment jsdom
/**
 * ST5 · 重复进入与幂等（六段流程的状态机验证）
 *
 * 同一课反复进出（含 StrictMode 双跑）时必须满足三条幂等：
 *  ① 遥测不重复上报（进入/完成/退出各一条口径）；
 *  ② 进度不重复累加（grammarLessonsDone / grammarLessonStagesDone 各只有一份）；
 *  ③ 复习队列不重复入队（同一句 + 同一课只收一次卡）。
 *
 * 约定同 st1：`FAIL-` = 已确认缺陷，`PASS-` = 验过没问题。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { StrictMode } from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "../../AppContext";
import { mountPage, resetStorage } from "../harness";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import { addLessonCoreSentence, addLessonMistakeSentence, markLessonDone, markLessonStageDone } from "../../services/lessonService";
import { loadData, saveData } from "../../services/storage";
import type { AppData } from "../../types";
import { makeAppData, seedAppData, readTelemetry, telemetryOfKind } from "./fixtures";
import { clickElement, flushAsync } from "./drive";
import {
  answerArrangeCorrectly,
  answerArrangeWrongly,
  answerPretest,
  bankChips,
  builtChips,
  guidedEntries,
  inSection,
  lessonOf,
  sectionLabels,
  typeInto,
  type Mounted
} from "../lessonFlow";

const LESSON = "lesson-13-now";
const ROUTE = "/grammar/lesson/:lessonId";

const seed = (): void => {
  window.localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(makeAppData()));
};
const mount = (lessonId = LESSON) =>
  mountPage(<GrammarLessonPage />, `/grammar/lesson/${lessonId}`, ROUTE);
const appData = (): AppData => JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}");
const forwardExits = (page: Mounted): string[] =>
  page.buttons().filter((text) => /^(下一题|下面自己来|进入练习|最后一步：说出来|完成这一课)$/.test(text));
const clickExact = (page: Mounted, label: string): void =>
  clickElement(
    Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find(
      (button) => !button.disabled && (button.textContent ?? "").trim() === label
    )
  );
const escapeIfStuck = (page: Mounted, answer: string): void => {
  if (forwardExits(page).length > 0) return;
  const built = builtChips(page);
  if (built.length === 0) return;
  clickElement(built[built.length - 1]);
  clickElement(
    bankChips(page).find(
      (chip) => !chip.disabled && (chip.textContent ?? "").trim() === answer.split(/\s+/).filter(Boolean).pop()
    )
  );
};
const answerContrastCard = (
  page: Mounted,
  card: HTMLElement,
  item: { wrong: string; bothRight?: boolean },
  index: number
): void => {
  const correctFirst = (item.wrong.length + index) % 2 === 0;
  const options = Array.from(card.querySelectorAll<HTMLButtonElement>("button.lesson-option"));
  const target = item.bothRight || correctFirst ? options[0] : options[1];
  if (target) clickElement(target);
};
/** 走完整课到收据。 */
const completeLesson = async (page: Mounted): Promise<void> => {
  const lesson = lessonOf(LESSON);
  answerPretest(page, LESSON, true);
  page.click("直接去练习");
  page.click("回去再看一遍讲解");
  page.click("下一步：搭装与对错");
  page.click("下一步：变奏");
  page.click("看懂了，试一试");
  await flushAsync();
  for (const entry of guidedEntries(LESSON)) {
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
    escapeIfStuck(page, entry.step.answer);
    clickExact(page, forwardExits(page)[0]);
    await flushAsync();
  }
  if (inSection(page, "凭记忆写")) {
    typeInto(page, lesson.recall?.answer ?? "");
    page.click("提交");
    await flushAsync();
    page.click("进入练习");
    await flushAsync();
  }
  for (let index = 0; index < lesson.practice.length; index += 1) {
    answerArrangeCorrectly(page, lesson.practice[index].answer);
    await flushAsync();
    clickExact(page, index + 1 >= lesson.practice.length ? "最后一步：说出来" : "下一题");
    await flushAsync();
  }
  const mid = page.container.querySelector('[aria-label="再看两组对错"]');
  if (mid) {
    const cards = Array.from(mid.querySelectorAll<HTMLElement>(".lesson-contrast-card"));
    cards.forEach((card, position) => {
      const item = (lesson.contrast ?? [])[2 + position];
      if (item) answerContrastCard(page, card, item, 2 + position);
    });
    await flushAsync();
    clickExact(page, "最后一步：说出来");
    await flushAsync();
  }
  for (let guard = 0; guard < 24; guard += 1) {
    if (page.buttons().includes("完成这一课")) {
      page.click("完成这一课");
      await flushAsync();
      return;
    }
    if (page.buttons().includes("下一句（这次没有提示）")) {
      page.click("下一句（这次没有提示）");
      await flushAsync();
      continue;
    }
    if (page.buttons().includes("想不起来？给我一点提示")) {
      page.click("想不起来？给我一点提示");
      await flushAsync();
      continue;
    }
    if (page.buttons().includes("还是想不起来，再看一点")) {
      page.click("还是想不起来，再看一点");
      await flushAsync();
      continue;
    }
    if (page.buttons().includes("还是想不起来，直接看答案")) {
      page.click("还是想不起来，直接看答案");
      await flushAsync();
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
        await flushAsync();
        continue;
      }
    }
    break;
  }
  throw new Error(`未走到收据，当前段：${sectionLabels(page).join(",")}`);
};

/** StrictMode 下挂载课程页（与 main.tsx 同构）。 */
const mountStrict = async () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      <StrictMode>
        <AppProvider>
          <MemoryRouter initialEntries={[`/grammar/lesson/${LESSON}`]}>
            <Routes>
              <Route path={ROUTE} element={<GrammarLessonPage />} />
            </Routes>
          </MemoryRouter>
        </AppProvider>
      </StrictMode>
    );
  });
  await flushAsync();
  return {
    container,
    text: () => container.textContent ?? "",
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    }
  };
};

describe("ST5 · 重复进入与幂等", () => {
  beforeEach(() => resetStorage());

  /** PASS-1 进度幂等：反复进出 + 完课只写一次完成态（旧字段与新字段各一份）。 */
  it("PASS-1 反复进出后完课：完成态只写一次，字段无重复", async () => {
    seed();
    // 进出三轮（不完成）
    for (let round = 0; round < 3; round += 1) {
      const page = mount();
      await flushAsync();
      page.unmount();
    }
    expect(appData().grammarLessonsDone, "未完成时不应有完成态").toEqual([]);

    const page = mount();
    await completeLesson(page);
    const done = appData().grammarLessonsDone;
    expect(done.filter((id) => id === LESSON).length, "完成态只写一次").toBe(1);
    expect(appData().grammarLessonStagesDone?.[LESSON], "关 1 只写一次").toEqual([1]);
    page.unmount();
  });

  /** PASS-2 卡片幂等：同一课的核心句/错句卡只入队一次（含连续两次完课路径）。 */
  it("PASS-2 卡片幂等：核心句与错句各只入队一份", async () => {
    seed();
    const page = mount();
    await completeLesson(page);
    await flushAsync();
    const firstCards = (appData().cards ?? []).filter((card) => card.sourceId === `lesson:${LESSON}`);
    expect(firstCards.length, "首次完课应有卡入队").toBeGreaterThan(0);
    page.unmount();

    // 再学一遍并再完课（已完课的课可重学）
    const again = mount();
    await completeLesson(again);
    await flushAsync();
    const cardsAfter = (appData().cards ?? []).filter((card) => card.sourceId === `lesson:${LESSON}`);
    expect(
      cardsAfter.length,
      "再完课不应重复入队（同句 + 同课只收一次）"
    ).toBe(firstCards.length);
    const fronts = cardsAfter.map((card) => card.front);
    expect(new Set(fronts).size, "队列里没有重复句面").toBe(fronts.length);
    again.unmount();
  });

  /** PASS-3 markLessonDone / markLessonStageDone 的纯函数幂等。 */
  it("PASS-3 markLessonDone / markLessonStageDone 幂等（纯函数层）", () => {
    seedAppData(makeAppData());
    const base = loadData();
    const once = markLessonDone(base, LESSON);
    const twice = markLessonDone(once, LESSON);
    expect(twice.grammarLessonsDone.filter((id) => id === LESSON).length).toBe(1);
    const coreOnce = addLessonCoreSentence(twice, lessonOf(LESSON));
    const coreTwice = addLessonCoreSentence(coreOnce, lessonOf(LESSON));
    expect(
      coreTwice.cards.filter((card) => card.sourceId === `lesson:${LESSON}`).length,
      "addLessonCoreSentence 幂等"
    ).toBe(1);

    const stageOnce = markLessonStageDone(base, LESSON, 1);
    const stageTwice = markLessonStageDone(stageOnce, LESSON, 1);
    expect(stageTwice.grammarLessonStagesDone?.[LESSON], "markLessonStageDone 幂等").toEqual([1]);
    // 关 2/3 不写旧字段
    const stage2 = markLessonStageDone(base, LESSON, 2);
    expect(stage2.grammarLessonsDone, "关 2 不写「完课」旧字段").toEqual([]);
    expect(stage2.grammarLessonStagesDone?.[LESSON]).toEqual([2]);
    // 未知课 id 原样返回
    expect(markLessonDone(base, "lesson-nope").grammarLessonsDone).toEqual([]);
    expect(markLessonStageDone(base, "lesson-nope", 1).grammarLessonStagesDone ?? {}).toEqual({});
    saveData(base);
  });

  /** PASS-4 addLessonMistakeSentence 幂等（同句 + 同课只收一次）。 */
  it("PASS-4 addLessonMistakeSentence 幂等", () => {
    seedAppData(makeAppData());
    const base = loadData();
    const lesson = lessonOf(LESSON);
    const once = addLessonMistakeSentence(base, lesson, "I am reading a book.", "规则");
    const twice = addLessonMistakeSentence(once, lesson, "I am reading a book.", "规则");
    expect(twice.cards.filter((card) => card.front === "I am reading a book.").length).toBe(1);
    // 空句不写
    expect(addLessonMistakeSentence(base, lesson, "   ", "x").cards).toEqual([]);
    // 同句不同课可以各收一份
    const other = addLessonMistakeSentence(once, lessonOf("lesson-12-will"), "I am reading a book.", "规则");
    expect(other.cards.filter((card) => card.front === "I am reading a book.").length).toBe(2);
    saveData(base);
  });

  /**
   * FAIL-1（P1 遥测污染 · lesson_exit 重复上报）
   * `lesson_exit` 的 effect 在挂载时注册清理函数，StrictMode 下 React 会
   * 「挂载 → 立即卸载 → 再挂载」，于是**刚打开页面就记了一条 durationMs≈0 的退出**
   * （GrammarLessonPage.tsx:782-797 的清理函数），随后真正卸载时再记一条。
   * 一次进入产生 2 条 exit，且第一条的 section 恒为 pretest、dwellMs≈0 ——
   * 「在哪一段退出」的漏斗统计被人为灌入一批虚假的 pretest 退出。
   */
  it("FAIL-1 StrictMode 下 lesson_exit 重复上报：挂载即记一条假退出", async () => {
    seed();
    const page = await mountStrict();
    const exitsAtMount = telemetryOfKind("lesson_exit");
    expect(
      exitsAtMount.length,
      "★ 缺陷：StrictMode 下仅挂载（用户什么都没做）就已记录退出事件"
    ).toBe(1);
    expect(
      String((exitsAtMount[0] as { section?: string }).section),
      "★ 缺陷：这条假退出的 section 恒为 pretest（用户还没离开过任何段）"
    ).toBe("pretest");
    expect(Number((exitsAtMount[0] as { dwellMs?: number }).dwellMs), "★ 缺陷：停留时长≈0").toBeLessThan(1000);

    act(() => undefined);
    page.unmount();
    expect(
      telemetryOfKind("lesson_exit").length,
      "★ 缺陷：真正卸载后又记一条 —— 一次进入共 2 条 exit，退出率分母翻倍"
    ).toBe(2);

    // 对照：非 StrictMode 只记一条，且是真正卸载时记的
    resetStorage();
    seed();
    const normal = mount();
    await flushAsync();
    expect(telemetryOfKind("lesson_exit").length, "对照：挂载时不记 exit").toBe(0);
    normal.unmount();
    expect(telemetryOfKind("lesson_exit").length, "对照：卸载时记一条").toBe(1);
  });

  /**
   * PASS-5 `grammar_lesson_started` 在 StrictMode 下只记一条（ref 守卫有效）。
   * 与 FAIL-1 对比：同一个 effect 里 started 有去重、exit 没有。
   */
  it("PASS-5 StrictMode 下 grammar_lesson_started 仍只记一条（ref 守卫有效）", async () => {
    seed();
    const page = await mountStrict();
    expect(
      telemetryOfKind("grammar_lesson_started").length,
      "started 有 startedLessonRef 守卫，StrictMode 双跑不重复"
    ).toBe(1);
    page.unmount();
    expect(
      telemetryOfKind("grammar_lesson_started").length,
      "卸载不产生新的 started"
    ).toBe(1);
    // 对照：非 StrictMode 同样一条
    resetStorage();
    seed();
    const normal = mount();
    await flushAsync();
    expect(telemetryOfKind("grammar_lesson_started").length).toBe(1);
    normal.unmount();
  });

  /** PASS-6 完课遥测不重复：重进已完课的课不会再写 grammar_lesson_completed。 */
  it("PASS-6 已完课重进：不写第二条 grammar_lesson_completed", async () => {
    seed();
    const page = mount();
    await completeLesson(page);
    expect(telemetryOfKind("grammar_lesson_completed").length, "首次完课一条").toBe(1);
    page.unmount();

    const again = mount();
    await flushAsync();
    expect(
      telemetryOfKind("grammar_lesson_completed").length,
      "重进不写完成事件"
    ).toBe(1);
    // 已完课重进显示「趁热练」与完成态文案
    expect(again.has("趁热练"), "已完课重进应显示趁热练条").toBe(true);
    expect(again.has("继续刚才的进度"), "完课时已清快照，不应再弹续学").toBe(false);
    again.unmount();
  });

  /**
   * PASS-7 续学快照幂等：反复「推进 → 退出」不会累积多条快照（单键覆盖）。
   */
  /**
   * PASS-7 续学快照单键覆盖：反复「推进 → 退出」只留一份快照，且指向最后进度。
   *
   * 注意：第二轮起，重挂时会先弹「继续刚才的进度」卡（快照仍在），
   * 此时页面被这张卡占据，必须先做选择才能继续 —— 这正是 E3 已覆盖的续学语义。
   * 这里选「继续刚才」以回到练习段。
   */
  it("PASS-7 续学快照单键覆盖：反复进退只有一份，且指向最后进度", async () => {
    seed();
    const lesson = lessonOf(LESSON);
    const resumeKey = `grammar:resume:${LESSON}`;
    for (let round = 0; round < 3; round += 1) {
      const page = mount();
      await flushAsync();
      if (round === 0) {
        answerPretest(page, LESSON, true);
        page.click("直接去练习");
      } else {
        expect(page.has("继续刚才的进度"), `第 ${round + 1} 轮应弹续学卡`).toBe(true);
        page.click("继续刚才");
      }
      await flushAsync();
      expect(page.text(), `第 ${round + 1} 轮应停在 第 ${round + 1} 题`).toMatch(new RegExp(`第 ${round + 1} \\/ 5 题`));
      answerArrangeCorrectly(page, lesson.practice[round].answer);
      await flushAsync();
      page.click("下一题");
      expect(
        JSON.parse(window.localStorage.getItem(resumeKey) ?? "{}").practiceIndex,
        `第 ${round + 1} 轮快照推进到下一题`
      ).toBe(round + 1);
      page.unmount();
    }
    const keys = Object.keys(window.localStorage).filter((key) => key.startsWith("grammar:resume:"));
    expect(keys, "三进三出只留一个快照键").toEqual([resumeKey]);
    const value = JSON.parse(window.localStorage.getItem(resumeKey) ?? "{}");
    expect(Number(value.practiceIndex), "快照指向最后进度（第 4 题，0 起 3）").toBe(3);
    expect(typeof value.lessonId, "快照带 lessonId").toBe("string");
    expect(value.lessonId, "lessonId 与当前课一致").toBe(LESSON);
    expect(typeof value.savedAt, "快照带 savedAt").toBe("string");
    expect(Number.isFinite(Date.parse(value.savedAt)), "savedAt 是合法 ISO").toBe(true);

    const page = mount();
    await flushAsync();
    expect(page.has("继续刚才的进度"), "重进应给续学入口").toBe(true);
    expect(page.has("第 4 题"), "卡片写明上次练到第 4 题").toBe(true);
    page.click("继续刚才");
    expect(page.text(), "恢复到第 4 题").toMatch(/第 4 \/ 5 题/);
    page.unmount();
  });

  /**
   * PASS-8 错句入队不因重复答错而累积：同一句错过多次仍只入队一份。
   */
  it("PASS-8 同一句重复答错：入队只有一份", async () => {
    seed();
    const page = mount();
    const lesson = lessonOf(LESSON);
    answerPretest(page, LESSON, true);
    page.click("直接去练习");
    await flushAsync();
    // 同一题连续错两次
    answerArrangeWrongly(page, lesson.practice[0].answer);
    await flushAsync();
    answerArrangeWrongly(page, lesson.practice[0].answer);
    await flushAsync();
    answerArrangeCorrectly(page, lesson.practice[0].answer);
    await flushAsync();
    await flushAsync();
    const cards = (appData().cards ?? []).filter((card) => card.front === lesson.practice[0].answer);
    expect(cards.length, "同一句重复错过仍只入队一份").toBe(1);
    expect(cards[0].sourceId, "sourceId 带课标识").toBe(`lesson:${LESSON}`);
    page.unmount();
  });

  /**
   * PASS-9 跨课切换：同一路由换 lessonId（路由层已加 key），
   * 上一课的 stage/完成态不带进下一课。这里在测试里显式重挂模拟该行为。
   */
  it("PASS-9 换课不继承上一课的段与完成态", async () => {
    seed();
    const first = mount("lesson-12-will");
    await flushAsync();
    await completeLessonFor(first, "lesson-12-will");
    expect(inSection(first, "课程完成"), "L12 应完课").toBe(true);
    first.unmount();

    const second = mount(LESSON);
    await flushAsync();
    expect(sectionLabels(second), "L13 应回到课前测，而不是停在收据页").toContain("课前试一试");
    expect(second.has("第 13 课完成"), "L13 不应显示 L12 的收据").toBe(false);
    second.unmount();
  });

  /**
   * FAIL-2（P1 体验 · 已完课重进的收据回显 0）
   * 与 st4 的回访页同源：收据页的「还差什么」等区块依赖会话内 state，
   * 已完课重进直接走完课早退分支时这些 state 是初值，于是若用户凑巧
   * 落在 completion 视图上会看到「本课没有留下漏洞——真棒。」这类
   * 与历史不符的结论。本用例记录该口径：重进时 reviewNotes 为空，
   * 收据只能给「没有留下漏洞」。
   */
  /**
   * FAIL-2（P1 功能错误 · 收据与队列自相矛盾）
   * 收据「还差什么」区块只有 `reviewNotes`（会话内 state，只在错过题时才 push）
   * 一条数据源。全程没错过题时它为空 → 渲染「本课没有留下漏洞——真棒。」，
   * **紧接着同一块里**又写「上面这些句子已排进复习队列，明天会自动来见你」——
   * 而完课本身就会把核心句送进 SM-2 队列（markLessonDone → addLessonCoreSentence）。
   * 于是同一屏上「没有任何漏洞」与「有句子进了复习队列」并存。
   *
   * 实测（本用例断言的就是这个组合）：points 项数 = 0，
   * 而 queue 提示存在、localStorage 里确实有 1 张 lesson:<id> 的卡。
   */
  it("FAIL-2 全程没错过题时：收据说「没有留下漏洞」同屏又说「已排进复习队列」", async () => {
    seed();
    const page = mount();
    await completeLesson(page);
    await flushAsync();
    expect(inSection(page, "课程完成"), "应到收据").toBe(true);
    const gapBlock = page.container.querySelector(".receipt-card.gap");
    expect(gapBlock, "收据应有「还差什么」区块").not.toBeNull();

    const points = page.container.querySelectorAll(".receipt-card.gap .receipt-points li").length;
    const queued = (appData().cards ?? []).filter((card) => card.sourceId === `lesson:${LESSON}`);

    expect(points, "会话内 reviewNotes 为空（全程没错过题）").toBe(0);
    expect(
      gapBlock?.textContent ?? "",
      "★ 缺陷：同一块里先给「本课没有留下漏洞」，紧接着又说「已排进复习队列」"
    ).toContain("本课没有留下漏洞");
    expect(
      gapBlock?.textContent ?? "",
      "★ 缺陷：两句结论同屏并存"
    ).toContain("已排进复习队列");
    expect(
      queued.length,
      "★ 对照事实：复习队列里确实有卡（完课即入队核心句），所以「没有留下漏洞」是错的结论"
    ).toBeGreaterThan(0);
    page.unmount();
  });
});

/** 通用完课（指定课号）。 */
const completeLessonFor = async (page: Mounted, lessonId: string): Promise<void> => {
  const lesson = lessonOf(lessonId);
  answerPretest(page, lessonId, true);
  page.click("直接去练习");
  page.click("回去再看一遍讲解");
  page.click("下一步：搭装与对错");
  page.click("下一步：变奏");
  page.click("看懂了，试一试");
  await flushAsync();
  for (const entry of guidedEntries(lessonId)) {
    const index = Number((page.text().match(/第 (\d+) \/ \d+ 题/) ?? [])[1] ?? "1") - 1;
    const step = guidedEntries(lessonId)[index];
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
    escapeIfStuck(page, entry.step.answer);
    clickExact(page, forwardExits(page)[0]);
    await flushAsync();
  }
  if (inSection(page, "凭记忆写")) {
    typeInto(page, lesson.recall?.answer ?? "");
    page.click("提交");
    await flushAsync();
    page.click("进入练习");
    await flushAsync();
  }
  for (let index = 0; index < lesson.practice.length; index += 1) {
    answerArrangeCorrectly(page, lesson.practice[index].answer);
    await flushAsync();
    clickExact(page, index + 1 >= lesson.practice.length ? "最后一步：说出来" : "下一题");
    await flushAsync();
  }
  const mid = page.container.querySelector('[aria-label="再看两组对错"]');
  if (mid) {
    const cards = Array.from(mid.querySelectorAll<HTMLElement>(".lesson-contrast-card"));
    cards.forEach((card, position) => {
      const item = (lesson.contrast ?? [])[2 + position];
      if (item) answerContrastCard(page, card, item, 2 + position);
    });
    await flushAsync();
    clickExact(page, "最后一步：说出来");
    await flushAsync();
  }
  for (let guard = 0; guard < 24; guard += 1) {
    if (page.buttons().includes("完成这一课")) {
      page.click("完成这一课");
      await flushAsync();
      return;
    }
    if (page.buttons().includes("下一句（这次没有提示）")) {
      page.click("下一句（这次没有提示）");
      await flushAsync();
      continue;
    }
    if (page.buttons().includes("想不起来？给我一点提示")) {
      page.click("想不起来？给我一点提示");
      await flushAsync();
      continue;
    }
    if (page.buttons().includes("还是想不起来，再看一点")) {
      page.click("还是想不起来，再看一点");
      await flushAsync();
      continue;
    }
    if (page.buttons().includes("还是想不起来，直接看答案")) {
      page.click("还是想不起来，直接看答案");
      await flushAsync();
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
        await flushAsync();
        continue;
      }
    }
    break;
  }
  throw new Error(`未走到收据，当前段：${sectionLabels(page).join(",")}`);
};
