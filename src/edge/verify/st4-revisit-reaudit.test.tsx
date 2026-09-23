// @vitest-environment jsdom
/**
 * ST4 · 回访页 / 重审页的状态机（六段流程的状态机验证）
 *
 * 两页各有自己的 phase：
 *   回访 GrammarRevisitPage：quiz → ambush → done（另有 locked 早退）
 *   重审 GrammarReauditPage：cases → ambush → done（另有 locked 早退、空案早退）
 *
 * 本轮聚焦**上一轮没覆盖**的三类边界：
 *  ① 完关瞬间（含 StrictMode 双跑下的 hooks 顺序与重复上报）；
 *  ② 无内容可做（空案早退分支是否可达）；
 *  ③ 中途退出（进度是否保留、是否有退出遥测）。
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
import GrammarRevisitPage from "../../pages/GrammarRevisitPage";
import GrammarReauditPage from "../../pages/GrammarReauditPage";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import { buildAmbushQuestions, buildRevisitQuiz, buildStage3CasePlan } from "../../services/grammarAmbushService";
import { GRAMMAR_ERROR_TAG_LABELS } from "../../services/huntService";
import { grammarLessons } from "../../data/grammarLessons";
import type { GrammarLesson } from "../../types";
import { makeAppData, readTelemetry, seedAppData, telemetryOfKind } from "./fixtures";
import { clickElement, flushAsync } from "./drive";
import type { Mounted } from "../harness";

/** L13 有 recall + 2 个 huntCaseIds，用于回访/重审全流程。 */
const LESSON = "lesson-13-now";
const REVISIT_ROUTE = "/grammar/lesson/:lessonId/revisit";
const REAUDIT_ROUTE = "/grammar/lesson/:lessonId/reaudit";
const revisitPath = (id: string) => `/grammar/lesson/${id}/revisit`;
const reauditPath = (id: string) => `/grammar/lesson/${id}/reaudit`;

/** 关 1 已完成（回访解锁；因无 completed 遥测时间戳，按「已满次日窗」直接解锁）。 */
const stage1Done = (id: string) => ({ grammarLessonsDone: [id] });
/** 关 1+2 已完成（重审解锁）。 */
const stage2Done = (id: string) => ({ grammarLessonsDone: [id], grammarLessonStagesDone: { [id]: [1, 2] } });

const mountRevisit = (id = LESSON) => mountPage(<GrammarRevisitPage />, revisitPath(id), REVISIT_ROUTE);
const mountReaudit = (id = LESSON) => mountPage(<GrammarReauditPage />, reauditPath(id), REAUDIT_ROUTE);
const sectionsOf = (page: Mounted): string[] =>
  Array.from(page.container.querySelectorAll<HTMLElement>("section.lesson-stage[aria-label]")).map(
    (section) => section.getAttribute("aria-label") ?? ""
  );
const exitHrefs = (page: Mounted): string[] =>
  Array.from(page.container.querySelectorAll("a")).map((anchor) => anchor.getAttribute("href") ?? "");
const appData = () => JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}");

/** 按正确答案作答回访页当前一题（cloze 填词 / rebuild 点词块）。 */
const answerRevisitStep = (page: Mounted, question: ReturnType<typeof buildRevisitQuiz>[number]): void => {
  if (question.kind === "cloze") {
    const input = page.container.querySelector<HTMLInputElement>("input.large-textarea");
    if (!input) throw new Error("回访页找不到填空输入框");
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    act(() => {
      setter?.call(input, question.clozeAnswer ?? "");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    clickElement(
      Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find(
        (button) => (button.textContent ?? "").trim() === "提交"
      )
    );
    return;
  }
  for (const token of question.answer.split(/\s+/).filter(Boolean)) {
    const chip = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-spot-row button")).find(
      (button) => !button.disabled && (button.textContent ?? "").trim() === token
    );
    if (!chip) throw new Error(`回访页找不到词块「${token}」`);
    clickElement(chip);
  }
};
const advanceRevisit = (page: Mounted): void => {
  const button = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find((item) =>
    /下一题|完成回访|最后一题/.test((item.textContent ?? "").trim())
  );
  if (!button) throw new Error(`回访页没有推进按钮：${page.buttons().filter(Boolean).join(" | ")}`);
  clickElement(button);
};
/** 答完回访 quiz，停在回马枪（或完成页）。 */
const finishRevisitQuiz = (page: Mounted, id = LESSON): void => {
  for (const question of buildRevisitQuiz(id)) {
    answerRevisitStep(page, question);
    advanceRevisit(page);
  }
};
/** 点中回马枪的正确词块。 */
const answerAmbush = (page: Mounted, id = LESSON, exclude: string[] = []): void => {
  /**
   * R10 注意：这里**不能**用 `seedAppData(...)` 来拿数据。
   *
   * 那个函数会把一份快照写进 localStorage。在 it() 中途写盘，会被
   * `AppContext` 的多窗口合并逻辑识别为「另一个窗口改了数据」，
   * 于是本次提交改以那份新快照为基准重放 —— 实测后果是页面中途丢掉了
   * 关 2 的完成态（`[1,2]` 变 `[1]`），ST4 的 PASS-4 因此失败。
   *
   * `buildAmbushQuestions` 只要一份 AppData，不读磁盘，所以用 `makeAppData`
   * （纯对象，不碰 localStorage）就能算出同一道题。
   */
  const ambush = buildAmbushQuestions(makeAppData(stage1Done(id)), id, 1, exclude)[0];
  if (!ambush) throw new Error("出不了回马枪题");
  const chips = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-spot-row button"));
  clickElement(chips[ambush.error.tokenIndex]);
};
/** 按罪名解开一个案件的全部植错点。 */
const solveCase = (page: Mounted, caseItem: { errors: Array<{ tokenIndex: number; tag: string }> }): void => {
  for (const error of caseItem.errors) {
    const tokens = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".hunt-tokens button"));
    clickElement(tokens[error.tokenIndex]);
    const tagLabel = GRAMMAR_ERROR_TAG_LABELS[error.tag as keyof typeof GRAMMAR_ERROR_TAG_LABELS];
    const tagButton = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".hunt-tag")).find(
      (button) => (button.textContent ?? "").trim() === tagLabel
    );
    clickElement(tagButton);
  }
};
const advanceCase = (page: Mounted): void => {
  const button = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find((item) =>
    /下一案|最后一题：回马一枪|完成重审/.test((item.textContent ?? "").trim())
  );
  if (!button) throw new Error(`重审页没有推进按钮：${page.buttons().filter(Boolean).join(" | ")}`);
  clickElement(button);
};

/** StrictMode 下挂载某一页（与 main.tsx 同构）。 */
const mountStrict = async (
  element: React.ReactElement,
  path: string,
  route: string
): Promise<{ container: HTMLDivElement; text: () => string; unmount: () => void }> => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      <StrictMode>
        <AppProvider>
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route path={route} element={element} />
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

describe("ST4 · 回访页 / 重审页状态机", () => {
  beforeEach(() => resetStorage());

  /** PASS-1 回访 phase 链：quiz → ambush → done，每一步都渲染出对应 section。 */
  it("PASS-1 回访 phase 链 quiz→ambush→done 全程可达", async () => {
    seedAppData(makeAppData(stage1Done(LESSON)));
    const page = mountRevisit();
    await flushAsync();
    expect(sectionsOf(page), "① 起于 quiz 段").toContain("次日回访");
    expect(page.text(), "① 题号 1 / N").toMatch(/第 1 \/ \d+ 题/);

    finishRevisitQuiz(page);
    await flushAsync();
    expect(sectionsOf(page), "② 进回马枪段").toContain("回马一枪");

    answerAmbush(page);
    await flushAsync();
    expect(sectionsOf(page), "③ 进完成页").toContain("回访完成");
    expect(appData().grammarLessonStagesDone?.[LESSON], "完成写入关 2").toEqual([1, 2]);
    expect(exitHrefs(page), "完成页给下一关入口").toContain(`/grammar/lesson/${LESSON}/reaudit`);
    page.unmount();
  });

  /** PASS-2 回访完成事件口径：totalCount / firstTryCount 自洽；ambushFirstTry 见 FAIL-3。 */
  it("PASS-2 回访完成遥测：totalCount / firstTryCount 与答题事实一致", async () => {
    seedAppData(makeAppData(stage1Done(LESSON)));
    const page = mountRevisit();
    await flushAsync();
    finishRevisitQuiz(page);
    await flushAsync();
    answerAmbush(page);
    await flushAsync();

    const completed = telemetryOfKind("grammar_revisit_completed");
    expect(completed.length, "完成应记一条").toBe(1);
    const quiz = buildRevisitQuiz(LESSON);
    expect(completed[0].totalCount, "totalCount = 实际题量").toBe(quiz.length);
    expect(completed[0].firstTryCount, "全对一次通过").toBe(quiz.length);
    expect(
      Number(completed[0].durationMs),
      "durationMs 应为非负有限数"
    ).toBeGreaterThanOrEqual(0);
    expect(page.has(`${quiz.length} / ${quiz.length} 题一次提取成功`), "完成页数字与遥测一致").toBe(true);

    const ambushEvents = telemetryOfKind("grammar_ambush_result");
    expect(ambushEvents.length, "回马枪应记一条结果").toBe(1);
    expect(ambushEvents[0].hostId, "hostId 带关号 #2").toBe(`${LESSON}#2`);
    expect(ambushEvents[0].attempts, "一次命中记为 attempts=1").toBe(1);
    expect(ambushEvents[0].passed, "命中记为 passed=true").toBe(true);
    page.unmount();
  });

  /**
   * FAIL-3（P1 遥测错误 · 指标恒为 0）
   * `pickAmbushToken` 在命中时先 `setAmbushAttempts(attempts)` / `setAmbushDone(true)`，
   * 紧接着**在同一事件处理函数里**调用 `finishRevisit()`；而 `finishRevisit` 读的是
   * 本次渲染闭包里的 `ambushAttempts` / `ambushDone`（GrammarRevisitPage.tsx:139）——
   * 首次命中时闭包值恒为 `0` 与 `false`，于是
   * `ambushFirstTry: ambush ? ambushAttempts <= 1 && ambushDone : null`
   * 计算结果**永远是 false**。`grammar_ambush_result` 里明明写着 `attempts: 1, passed: true`，
   * 同一条路径上的 `grammar_revisit_completed.ambushFirstTry` 却是 false —— 两条事件互相矛盾，
   * 「回马枪一次命中率」在数据上结构性恒为 0%。
   */
  it("FAIL-3【已修 2026-09-23】一次命中的回马枪记为 ambushFirstTry=true", async () => {
    seedAppData(makeAppData(stage1Done(LESSON)));
    const page = mountRevisit();
    await flushAsync();
    finishRevisitQuiz(page);
    await flushAsync();
    answerAmbush(page); // 第一次就命中
    await flushAsync();

    const ambushEvents = telemetryOfKind("grammar_ambush_result");
    const completed = telemetryOfKind("grammar_revisit_completed");
    expect(ambushEvents[0].attempts, "事实：回马枪第 1 次就命中").toBe(1);
    expect(ambushEvents[0].passed, "事实：命中").toBe(true);
    /**
     * 【已修 2026-09-23】原缺陷：`ambushFirstTry` 从 state 读，而回马枪答对时
     * `setAmbushDone(true)` 尚未提交 → 闭包读到 `false`，**永远记 false**，
     * 与同路径 `ambush_result`（attempts=1, passed=true）自相矛盾。
     * 修法：由调用方显式传入本次结果（见 GrammarRevisitPage 的 finishRevisit）。
     */
    expect(
      completed[0].ambushFirstTry,
      "attempts=1 且命中 → 一次命中记为 true"
    ).toBe(true);
    expect(
      [ambushEvents[0].attempts, ambushEvents[0].passed],
      "两条同路径事件口径一致（attempts=1 + passed）"
    ).toEqual([1, true]);
    page.unmount();
  });

  /** FAIL-3b 同一缺陷的对照：先错后对同样 false（即该字段恒 false，没有 true 的分支）。 */
  it("FAIL-3b【语义订正 2026-09-23】先错后对不算一次命中（该字段已有 true 分支，见 FAIL-3）", async () => {
    seedAppData(makeAppData(stage1Done(LESSON)));
    const page = mountRevisit();
    await flushAsync();
    finishRevisitQuiz(page);
    await flushAsync();
    const ambush = buildAmbushQuestions(seedAppData(makeAppData(stage1Done(LESSON))), LESSON, 1, [])[0];
    const chips = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-spot-row button"));
    clickElement(chips.find((_chip, index) => index !== ambush.error.tokenIndex));
    await flushAsync();
    clickElement(Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-spot-row button"))[ambush.error.tokenIndex]);
    await flushAsync();

    const ambushEvents = telemetryOfKind("grammar_ambush_result");
    expect(ambushEvents.map((event) => `${event.attempts}/${event.passed}`), "事实：先错后对").toEqual([
      "1/false",
      "2/true"
    ]);
    /**
     * 【已修 2026-09-23】先错后对（attempts=2）→ `ambushFirstTry` 为 false 是**正确语义**
     * （「一次命中」才为 true）。原断言把它当作「字段没有 true 分支」的佐证，
     * 顺带记下了与之配对的另一条用例（FAIL-3：一次命中却也是 false）。
     * 两条合起来才能证明「该字段恒为 false」；现在一次命中那条已能记 true，
     * 本条只需守住「先错后对不算一次命中」。
     */
    expect(
      telemetryOfKind("grammar_revisit_completed")[0].ambushFirstTry,
      "先错后对（attempts=2）→ 不算一次命中"
    ).toBe(false);
    page.unmount();
  });

  /**
   * FAIL-1（P1 数据错误 · 展示旧数字）
   * 关 2 **已完成**的课重进回访页时，完成页的
   * 「{firstTryCount} / {quiz.length} 题一次提取成功」用的是组件内 state ——
   * 新挂载的实例里 `firstTryCount` 是初值 0，于是显示「0 / 4 题一次提取成功」，
   * 与上一轮真实写入遥测的 4/4 直接矛盾（用户看到的是「我上次一道都没答上」）。
   */
  it("FAIL-1【已修 2026-09-23】完成页回显真实成绩（不再显示 0 / N）", async () => {
    // 先跑一轮真实完成，产出遥测事实
    seedAppData(makeAppData(stage1Done(LESSON)));
    const first = mountRevisit();
    await flushAsync();
    finishRevisitQuiz(first);
    await flushAsync();
    answerAmbush(first);
    await flushAsync();
    const recorded = telemetryOfKind("grammar_revisit_completed")[0];
    expect(recorded.firstTryCount, "事实：上一轮 4/4 一次通过").toBe(4);
    first.unmount();

    // 重进（完成态已在 AppData 里 → 直接走完成页早退分支）
    const again = mountRevisit();
    await flushAsync();
    expect(sectionsOf(again), "重进直接显示完成页").toContain("回访完成");
    /**
     * 【已修 2026-09-23】修复前：完成页读的是**本次会话的 state** `firstTryCount`，
     * 重进时被重置为 0 → 明明上一轮 4/4 全对（遥测里也记着 4），页面却显示「0 / 4」。
     * 修复：已完结的课改为回显最近一条 `grammar_revisit_completed` 里的真实成绩。
     */
    expect(
      again.text(),
      "重进完成页应回显历史真实成绩 4 / 4"
    ).toContain("4 / 4 题一次提取成功");
    // 与遥测事实一致（修复前这两条互相矛盾：页面显示 0/4、遥测记着 4/4）
    expect(
      recorded.firstTryCount,
      "与遥测记录一致"
    ).toBe(4);
    expect(again.text(), "不再出现错误的 0 / 4 回显").not.toContain("0 / 4 题一次提取成功");
    again.unmount();
  });

  /**
   * PASS-3 回访中途退出：进度不落盘（重进从第 1 题开始）—— 这是当前设计，
   * 但**没有任何退出遥测**，退出点不可观测。
   */
  it("PASS-3 回访中途退出：不保留进度，且无退出遥测（可观测性盲区）", async () => {
    seedAppData(makeAppData(stage1Done(LESSON)));
    const page = mountRevisit();
    await flushAsync();
    const quiz = buildRevisitQuiz(LESSON);
    answerRevisitStep(page, quiz[0]);
    advanceRevisit(page);
    await flushAsync();
    expect(page.text(), "① 推进到第 2 题").toMatch(/第 2 \/ \d+ 题/);
    const before = readTelemetry().length;
    page.unmount();

    const again = mountRevisit();
    await flushAsync();
    expect(page.text, "② 重进从第 1 题开始（进度不保留 —— 当前设计）").toBeTruthy();
    expect(again.text(), "② 重进题号回到 1").toMatch(/第 1 \/ \d+ 题/);
    expect(
      telemetryOfKind("lesson_exit").length,
      "★ 盲区：回访页没有任何退出遥测（lesson_exit 为 0），退出点不可观测"
    ).toBe(0);
    expect(
      telemetryOfKind("grammar_revisit_started").length,
      "② 重进再记一条 started（两次进入 = 两条，符合「进入即记」口径）"
    ).toBe(2);
    expect(readTelemetry().length, "② 退出本身没有产生任何事件").toBe(before + 1);
    again.unmount();
    // 关 2 未完成
    expect(appData().grammarLessonStagesDone?.[LESSON] ?? [], "中途退出不应写完成态").not.toContain(2);
  });

  /** PASS-4 重审 phase 链：cases → ambush → done。 */
  it("PASS-4 重审 phase 链 cases→ambush→done 全程可达", async () => {
    seedAppData(makeAppData(stage2Done(LESSON)));
    const page = mountReaudit();
    await flushAsync();
    expect(sectionsOf(page), "① 起于案件段").toContain("旧案重审");
    const plan = buildStage3CasePlan(LESSON);
    const allCases = [...plan.newCases, ...plan.revisitCases];
    expect(allCases.length, "L13 应有 3 案").toBe(3);
    expect(page.text(), "① 案件计数 1 / 3").toContain("案件 1 / 3");

    for (let index = 0; index < allCases.length; index += 1) {
      expect(page.text(), `第 ${index + 1} 案题号`).toContain(`案件 ${index + 1} / ${allCases.length}`);
      solveCase(page, allCases[index]);
      await flushAsync();
      expect(page.container.querySelector(".lesson-feedback.pass"), `第 ${index + 1} 案应判定结案`).not.toBeNull();
      advanceCase(page);
      await flushAsync();
    }
    expect(sectionsOf(page), "② 进回马枪").toContain("回马一枪");
    answerAmbush(page, LESSON, allCases.map((item) => item.id));
    await flushAsync();
    expect(sectionsOf(page), "③ 进三关全过").toContain("三关全过");
    expect(appData().grammarLessonStagesDone?.[LESSON], "完成写入关 3").toEqual([1, 2, 3]);
    page.unmount();
  });

  /**
   * PASS-5 重审「无内容可做」早退分支不可达（全库扫描）：
   * `buildStage3CasePlan` 对每一课都能给出 ≥1 案，所以页面里那段
   * 「本课暂无可重审的案件 + 跳过此关」是**死代码**。
   */
  it("PASS-5 重审空案早退分支：全库 204 课均不可达（死代码）", () => {
    const empty: string[] = [];
    for (const lesson of grammarLessons) {
      const plan = buildStage3CasePlan(lesson.id);
      if (plan.newCases.length + plan.revisitCases.length === 0) empty.push(lesson.id);
    }
    expect(empty, "没有任何课会落到空案分支").toEqual([]);
    // 批四十二改为自适应：此前硬编码课数，每次加课都要手改（且漏改会误报为回归）
    expect(grammarLessons.length, "全库课程数").toBeGreaterThan(0);
  });

  /** PASS-6 重审「跳过此关」路径本身可用（构造：让 activeCase 不存在的方式是课不存在，走的是另一分支）。 */
  it("PASS-6 重审不存在的课：空态而非白屏", async () => {
    seedAppData(makeAppData(stage2Done(LESSON)));
    const page = mountPage(
      <GrammarReauditPage />,
      reauditPath("lesson-does-not-exist"),
      REAUDIT_ROUTE
    );
    await flushAsync();
    expect(page.has("课程不存在"), "未知课 id 应给「课程不存在」空态").toBe(true);
    expect(page.container.innerHTML.length, "不应白屏").toBeGreaterThan(0);
    expect(exitHrefs(page), "应给返回地图出口").toContain("/grammar");
    page.unmount();
  });

  /** PASS-7 回访锁态：关 1 未完成 → 不出题，给明确出口 + 解锁时刻。 */
  it("PASS-7 回访锁态：未完成关 1 时给解锁说明与出口", async () => {
    seedAppData(makeAppData({ grammarLessonsDone: [] }));
    const page = mountRevisit();
    await flushAsync();
    expect(page.has("回访关还没解锁"), "应显示锁态").toBe(true);
    expect(page.has("第 1 / "), "锁态不应露出题目").toBe(false);
    expect(
      telemetryOfKind("grammar_revisit_started").length,
      "锁态不记 started（锁着不算一次回访）"
    ).toBe(0);
    page.unmount();
  });

  /**
   * FAIL-2（P1 数据错误 · StrictMode 下重复上报）
   * 两个页面都在**渲染期间**用 setState 做「只记一次」的守卫：
   *   回访页 `if (lock.state !== "locked" && !startedLogged) { append(...); setStartedLogged(true); }`
   *   重审页用 useRef（`startedLoggedRef`）但同样在渲染期间写。
   * 渲染写入的副作用在 StrictMode 的双调用下会执行两次 —— 实测两个页面的
   * started 事件均为 **2 条**（生产 main.tsx 就是 StrictMode 包裹）。
   * 回访率的分母因此被系统性放大一倍。
   */
  it("FAIL-2【已修 2026-09-23】StrictMode 下回访 started 只记一条", async () => {
    seedAppData(makeAppData(stage1Done(LESSON)));
    const page = await mountStrict(<GrammarRevisitPage />, revisitPath(LESSON), REVISIT_ROUTE);
    const events = telemetryOfKind("grammar_revisit_started");
    /**
     * 修复前：埋点写在**渲染期**、用 `useState` 守卫 → StrictMode 双渲染下
     * 一次进入记 2 条，参与率分母翻倍。
     * 修复：移到 `useEffect` + `useRef` 守卫——
     * 「跑 effect → 清理 → 再跑 effect」时 ref 在同一次挂载内保留，
     * 所以第二次不重复；而**重新进入是新挂载、新 ref，照记一条**（保住「进入即记」口径，
     * 见 PASS-3 的断言）。
     */
    expect(events.length, "一次进入只记一条").toBe(1);
    expect(events[0].lessonId, "指向本课").toBe(LESSON);
    expect(typeof events[0].hoursSinceStage1, "仍带 hoursSinceStage1").toBe("number");
    page.unmount();
    // 对照：非 StrictMode 只记一条
    resetStorage();
    seedAppData(makeAppData(stage1Done(LESSON)));
    const normal = mountRevisit();
    await flushAsync();
    expect(telemetryOfKind("grammar_revisit_started").length, "对照：非 StrictMode 为 1 条").toBe(1);
    normal.unmount();
  });

  /** FAIL-2b 同一缺陷在重审页（同样 2 条）。 */
  it("FAIL-2b【已修 2026-09-23】StrictMode 下重审 started 只记一条", async () => {
    seedAppData(makeAppData(stage2Done(LESSON)));
    const page = await mountStrict(<GrammarReauditPage />, reauditPath(LESSON), REAUDIT_ROUTE);
    /**
     * 修复前：`useRef` 守卫挡不住真 StrictMode 的「卸载后重挂载」（ref 随组件重建而丢失）。
     * 修复：埋点移入 effect + ref 守卫（同一次挂载内只记一次）。
     */
    expect(
      telemetryOfKind("grammar_reaudit_started").length,
      "一次进入只记一条"
    ).toBe(1);
    page.unmount();
    resetStorage();
    seedAppData(makeAppData(stage2Done(LESSON)));
    const normal = mountReaudit();
    await flushAsync();
    expect(telemetryOfKind("grammar_reaudit_started").length, "对照：非 StrictMode 为 1 条").toBe(1);
    normal.unmount();
  });

  /**
   * PASS-8 完关瞬间不白屏（StrictMode + 非 StrictMode 双跑）。
   * 上一轮修过「完关白屏（hooks 少调用）」；这里验证修复在两种模式下都成立，
   * 且两页的完关瞬间都有可用出口。
   */
  it("PASS-8 完关瞬间不白屏（StrictMode 下回访 + 重审各一次）", async () => {
    seedAppData(makeAppData(stage1Done(LESSON)));
    const revisit = await mountStrict(<GrammarRevisitPage />, revisitPath(LESSON), REVISIT_ROUTE);
    const quiz = buildRevisitQuiz(LESSON);
    for (const question of quiz) {
      answerRevisitStep(revisit as unknown as Mounted, question);
      advanceRevisit(revisit as unknown as Mounted);
    }
    await flushAsync();
    answerAmbush(revisit as unknown as Mounted);
    await flushAsync();
    expect(revisit.container.innerHTML.length, "① 回访完关不应白屏").toBeGreaterThan(0);
    expect(revisit.text(), "① 应看到完成页").toContain("回访完成");
    revisit.unmount();

    resetStorage();
    seedAppData(makeAppData(stage2Done(LESSON)));
    const reaudit = await mountStrict(<GrammarReauditPage />, reauditPath(LESSON), REAUDIT_ROUTE);
    await flushAsync();
    const plan = buildStage3CasePlan(LESSON);
    const allCases = [...plan.newCases, ...plan.revisitCases];
    for (const caseItem of allCases) {
      solveCase(reaudit as unknown as Mounted, caseItem);
      await flushAsync();
      advanceCase(reaudit as unknown as Mounted);
      await flushAsync();
    }
    answerAmbush(reaudit as unknown as Mounted, LESSON, allCases.map((item) => item.id));
    await flushAsync();
    expect(reaudit.container.innerHTML.length, "② 重审完关不应白屏").toBeGreaterThan(0);
    expect(reaudit.text(), "② 应看到三关全过").toContain("本课三关全过");
    expect(exitHrefs(reaudit as unknown as Mounted), "② 完成页给返回地图出口").toContain("/grammar");
    reaudit.unmount();
  });

  /**
   * PASS-9 回访题面与判题口径一致：cloze 的答案就藏在 clozeText 的空缺处。
   * （防止「题面与答案不同源」这类静默错题。）
   */
  it("PASS-9 回访题面与答案同源：cloze 空缺位置可被 clozeAnswer 补全", () => {
    const mismatched: string[] = [];
    let checked = 0;
    for (const lesson of grammarLessons) {
      for (const question of buildRevisitQuiz(lesson.id)) {
        checked += 1;
        if (question.kind === "cloze") {
          if (!question.clozeAnswer || !question.clozeText?.includes("___")) {
            mismatched.push(`${lesson.id}: cloze 缺答案或占位符`);
            continue;
          }
          // 用答案填回占位符应还原成完整句
          const restored = question.clozeText.replace("___", question.clozeAnswer ?? "");
          const normalize = (value: string) =>
            value.toLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim();
          if (normalize(restored) !== normalize(question.answer)) {
            mismatched.push(`${lesson.id}: 填回后「${restored}」≠ 答案「${question.answer}」`);
          }
        } else if (question.kind === "rebuild") {
          if (!question.rebuildTokens?.length) mismatched.push(`${lesson.id}: rebuild 无词块`);
          // 词块多重集应能拼出答案
          const sorted = (list: string[]) =>
            list.map((token) => token.toLowerCase().replace(/[.,!?;:]/g, "")).sort().join("|");
          if (sorted(question.rebuildTokens ?? []) !== sorted(question.answer.split(/\s+/).filter(Boolean))) {
            mismatched.push(`${lesson.id}: rebuild 词块与答案不同源`);
          }
        }
      }
    }
    expect(checked, "全库应产出回访题").toBeGreaterThan(0);
    expect(mismatched, "题面与答案必须同源（无静默错题）").toEqual([]);
  });

  /**
   * PASS-10 回马枪题目本身自洽：错误 tokenIndex 落在词块范围内，且罪名非空。
   */
  it("PASS-10 回马枪题目自洽（tokenIndex 越界/空罪名全库为零）", () => {
    const offenders: string[] = [];
    let checked = 0;
    for (const lesson of grammarLessons as GrammarLesson[]) {
      const ambush = buildAmbushQuestions(seedAppData(makeAppData(stage2Done(lesson.id))), lesson.id, 1, [])[0];
      if (!ambush) {
        offenders.push(`${lesson.id}: 出不了回马枪`);
        continue;
      }
      checked += 1;
      if (ambush.error.tokenIndex < 0 || ambush.error.tokenIndex >= ambush.caseItem.tokens.length) {
        offenders.push(`${lesson.id}: tokenIndex ${ambush.error.tokenIndex} 越界`);
      }
      if (!ambush.error.tag) offenders.push(`${lesson.id}: 空罪名`);
      if (!ambush.caseItem.tokens[ambush.error.tokenIndex]) offenders.push(`${lesson.id}: 命中位置无词块`);
    }
    expect(checked, "全库应能出回马枪").toBe(grammarLessons.length);
    expect(offenders, "回马枪题目应全部自洽").toEqual([]);
  });

  /** PASS-11 重审罪名按钮与数据标签同源（无「按钮找不到」的静默错题）。 */
  it("PASS-11 重审案件的所有植错点都有对应罪名按钮", async () => {
    seedAppData(makeAppData(stage2Done(LESSON)));
    const page = mountReaudit();
    await flushAsync();
    const plan = buildStage3CasePlan(LESSON);
    const allCases = [...plan.newCases, ...plan.revisitCases];
    const labels = new Set(Object.values(GRAMMAR_ERROR_TAG_LABELS));
    for (const caseItem of allCases) {
      for (const error of caseItem.errors) {
        expect(labels, `案件 ${caseItem.id} 的罪名 ${error.tag} 应有标签`).toContain(
          GRAMMAR_ERROR_TAG_LABELS[error.tag]
        );
      }
    }
    solveCase(page, allCases[0]);
    await flushAsync();
    expect(
      page.container.querySelector(".lesson-feedback.pass"),
      "按数据解开第一案应成功（按钮文案与数据一致）"
    ).not.toBeNull();
    page.unmount();
  });
});
