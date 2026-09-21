// @vitest-environment jsdom
/**
 * P4 · 重访页（/grammar/lesson/:lessonId/revisit）
 *
 * 三种入口状态：
 *  ① 未学过 → 关 2 锁态，给明确引导（回到正课 + 返回课程地图）
 *  ② 学过（关 1 完成、无时间戳或已过次日窗）→ 正常出题
 *  ③ 刚学完（关 1 完成时间在 20h 内）→ 锁态并显示具体解锁时刻
 *  ④ 不存在的课 id → 「课程不存在」空态
 *
 * 另有【已确认缺陷】：关 2 完成后（phase 从 quiz/ambush 切到 done）页面崩溃、
 * 白屏。见文件末尾 P4-CRASH 用例（当前为 failing，登记缺陷用）。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "../harness";
import { clickElement, flushAsync } from "./drive";
import { seedAppData, TELEMETRY_KEY } from "./fixtures";
import GrammarRevisitPage from "../../pages/GrammarRevisitPage";
import { buildRevisitQuiz, buildAmbushQuestions } from "../../services/grammarAmbushService";

const STORAGE_KEY = "personal-vocab-app-data-v1";
const ROUTE = "/grammar/lesson/:lessonId/revisit";
const path = (id: string) => `/grammar/lesson/${id}/revisit`;

const exitHrefs = (page: ReturnType<typeof mountPage>): string[] =>
  Array.from(page.container.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");

const lessonCompletedEvent = (lessonId: string, completedAt: string) => ({
  kind: "grammar_lesson_completed" as const,
  lessonId,
  completedAt,
  guidedFirstTry: true,
  practiceFirstTry: true,
  durationMs: 1000
});

/** 在回访页按正确答案答完当前这题，并点向下一题/完成。 */
const answerQuizStep = (page: ReturnType<typeof mountPage>, quiz: ReturnType<typeof buildRevisitQuiz>): void => {
  const step = page.text().replace(/\s+/g, " ").match(/第 (\d+) \/ (\d+) 题/);
  const question = quiz[Number(step?.[1]) - 1];
  if (!question) throw new Error(`读不到当前题号：${page.text().slice(0, 120)}`);
  if (question.kind === "cloze") {
    const input = page.container.querySelector("input") as HTMLInputElement;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, question.clozeAnswer ?? "");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    clickElement(Array.from(page.container.querySelectorAll("button")).find((b) => (b.textContent ?? "").trim() === "提交") as HTMLButtonElement);
  } else {
    for (const token of question.answer.split(/\s+/).filter(Boolean)) {
      clickElement(
        Array.from(page.container.querySelectorAll(".lesson-spot-row button")).find(
          (b) => (b.textContent ?? "").trim() === token && !(b as HTMLButtonElement).disabled
        ) as HTMLButtonElement
      );
    }
  }
  clickElement(
    Array.from(page.container.querySelectorAll("button")).find((b) =>
      /下一题|完成回访|最后一题/.test((b.textContent ?? "").trim())
    ) as HTMLButtonElement
  );
};

describe("P4 · 重访页", () => {
  beforeEach(() => resetStorage());

  it("未学过：锁态空态给出明确引导，不含任何题目", () => {
    const page = mountPage(<GrammarRevisitPage />, path("lesson-06-it"), ROUTE);
    expect(page.has("回访关还没解锁")).toBe(true);
    expect(page.has("先完成本课正课，明天回来回访。")).toBe(true);
    expect(page.has("第 6 课"), "应标明是哪一课").toBe(true);
    expect(exitHrefs(page)).toEqual(["/grammar/lesson/lesson-06-it", "/grammar"]);
    // 锁态不得泄露题目
    expect(page.container.querySelectorAll("input").length).toBe(0);
    expect(page.container.querySelectorAll(".lesson-spot-row").length).toBe(0);
    expect(page.buttons().length, "锁态不该有任何可点按钮（出口是 Link）").toBe(0);
    page.unmount();
  });

  it("不存在的课 id：显示「课程不存在」而非崩溃或空白", () => {
    // 注：空 id（/grammar/lesson//revisit）不匹配路由（路由层行为，非本页职责），
    // 因此只验证「有值但查不到」的形态。
    for (const bad of ["nope", "lesson-999-x", "LESSON-01-AM", "lesson-01-am "]) {
      const page = mountPage(<GrammarRevisitPage />, `/grammar/lesson/${bad}/revisit`, ROUTE);
      expect(page.has("课程不存在"), `id="${bad}" 未给出空态`).toBe(true);
      expect(page.has("回到课程地图，挑一课开始吧。")).toBe(true);
      expect(page.text().trim().length, "空态不该是空白页").toBeGreaterThan(0);
      expect(page.has("NaN")).toBe(false);
      expect(exitHrefs(page)).toEqual(["/grammar"]);
      page.unmount();
      resetStorage();
    }
  });

  it("学过（无完课时间戳）：正常出题，题量 4、题型为 rebuild/cloze 组合", () => {
    seedAppData({ grammarLessonsDone: ["lesson-06-it"] });
    const page = mountPage(<GrammarRevisitPage />, path("lesson-06-it"), ROUTE);
    expect(page.has("第 6 课 · 现在几点了")).toBe(true);
    expect(page.has("第 1 / 4 题")).toBe(true);
    expect(page.has("凭记忆重建这句话")).toBe(true);
    // 词块是可点的按钮，且不含错误提示
    expect(page.buttons().length).toBeGreaterThan(0);
    expect(page.has("回访关还没解锁")).toBe(false);
    page.unmount();
  });

  it("刚学完（完课时间在 20h 内）：锁态并显示具体解锁时刻", () => {
    seedAppData({ grammarLessonsDone: ["lesson-06-it"] });
    window.localStorage.setItem(
      TELEMETRY_KEY,
      JSON.stringify({ version: 1, events: [lessonCompletedEvent("lesson-06-it", new Date().toISOString())] })
    );
    const page = mountPage(<GrammarRevisitPage />, path("lesson-06-it"), ROUTE);
    expect(page.has("回访关还没解锁")).toBe(true);
    expect(page.has("在快忘记的时候回来破案，记得最牢。")).toBe(true);
    expect(page.text(), "应给出解锁时刻而不是笼统的「明天」").toMatch(/本关将于 \d+\/\d+ \d+:\d+ 解锁/);
    expect(page.text()).not.toMatch(/NaN|Invalid Date|undefined/);
    page.unmount();
  });

  it("已过 20h 次日窗：解锁正常出题", () => {
    seedAppData({ grammarLessonsDone: ["lesson-06-it"] });
    const past = new Date(Date.now() - 21 * 3600 * 1000).toISOString();
    window.localStorage.setItem(TELEMETRY_KEY, JSON.stringify({ version: 1, events: [lessonCompletedEvent("lesson-06-it", past)] }));
    const page = mountPage(<GrammarRevisitPage />, path("lesson-06-it"), ROUTE);
    expect(page.has("第 1 / 4 题")).toBe(true);
    expect(page.has("回访关还没解锁")).toBe(false);
    page.unmount();
  });

  it("答错：给出「再试一次」的宽慰文案与重来按钮，不记完成", async () => {
    seedAppData({ grammarLessonsDone: ["lesson-06-it"] });
    const page = mountPage(<GrammarRevisitPage />, path("lesson-06-it"), ROUTE);
    const quiz = buildRevisitQuiz("lesson-06-it");
    // 第 1 题是 rebuild：故意按错序点满全部词块
    const tokens = quiz[0].answer.split(/\s+/).filter(Boolean);
    for (const token of [...tokens].reverse()) {
      const chip = Array.from(page.container.querySelectorAll(".lesson-spot-row button")).find(
        (b) => (b.textContent ?? "").trim() === token && !(b as HTMLButtonElement).disabled
      ) as HTMLButtonElement | undefined;
      if (chip) clickElement(chip);
    }
    expect(page.has("想不起来了，再试一次"), "答错应给宽慰文案").toBe(true);
    expect(page.has("忘了很正常，这正是要回访的原因。")).toBe(true);
    expect(page.buttons()).toContain("重来这题");
    await flushAsync();
    expect(page.has("回访完成"), "答错不该直接完关").toBe(false);
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as {
      grammarLessonStagesDone?: Record<string, number[]>;
    };
    expect(
      stored.grammarLessonStagesDone?.["lesson-06-it"] ?? [],
      "答错不该写入关 2 完成"
    ).not.toContain(2);
    page.unmount();
  });

  it("答对一题：显示正确答案 + 讲解 + 下一题按钮", () => {
    seedAppData({ grammarLessonsDone: ["lesson-06-it"] });
    const page = mountPage(<GrammarRevisitPage />, path("lesson-06-it"), ROUTE);
    const quiz = buildRevisitQuiz("lesson-06-it");
    for (const token of quiz[0].answer.split(/\s+/).filter(Boolean)) {
      clickElement(
        Array.from(page.container.querySelectorAll(".lesson-spot-row button")).find(
          (b) => (b.textContent ?? "").trim() === token && !(b as HTMLButtonElement).disabled
        ) as HTMLButtonElement
      );
    }
    expect(page.has("提取成功！")).toBe(true);
    expect(page.text(), "应展示完整正确句").toContain(quiz[0].answer);
    expect(page.buttons()).toContain("下一题");
    page.unmount();
  });

  it("答完 4 题后进入回马枪（本课有旧案可出）", () => {
    seedAppData({ grammarLessonsDone: ["lesson-190-learning-to-swim"] });
    const page = mountPage(<GrammarRevisitPage />, path("lesson-190-learning-to-swim"), ROUTE);
    const quiz = buildRevisitQuiz("lesson-190-learning-to-swim");
    for (let i = 0; i < quiz.length; i += 1) answerQuizStep(page, quiz);
    expect(page.has("回马一枪")).toBe(true);
    expect(page.has("指出有问题的那个词。")).toBe(true);
    // 回马枪点错：给提示，不推进
    const ambush = buildAmbushQuestions(seedAppData({ grammarLessonsDone: ["lesson-190-learning-to-swim"] }), "lesson-190-learning-to-swim", 1, [])[0];
    const chips = Array.from(page.container.querySelectorAll(".lesson-spot-row button")) as HTMLButtonElement[];
    clickElement(chips.find((_c, i) => i !== ambush.error.tokenIndex) as HTMLButtonElement);
    expect(page.has("这个词块看起来没问题，再找找别的。")).toBe(true);
    expect(page.container.innerHTML.length, "点错不该崩").toBeGreaterThan(0);
    page.unmount();
  });

  /**
   * 【已确认缺陷 · P0】关 2 完成的那一刻页面崩溃 → 白屏。
   *
   * 机制：GrammarRevisitPage 的 `revisitWhy` 是 useMemo，却被写在
   * `if (isLessonStageDone(...) || phase === "done") return ...` 之后（第 119 行）。
   * 完成关 2 时 data 写入 + setPhase("done") 触发重渲染，本次渲染提前 return，
   * 少调用一个 hook → React 抛 "Rendered fewer hooks than expected"，
   * 整棵组件树卸载（项目无 ErrorBoundary）。
   *
   * 本用例断言「不应崩溃」，当前为 failing —— 修复后应转绿。
   */
  it("P4-CRASH：完成关 2 后页面不应崩溃（当前为已确认缺陷）", async () => {
    seedAppData({ grammarLessonsDone: ["lesson-06-it"] });
    const page = mountPage(<GrammarRevisitPage />, path("lesson-06-it"), ROUTE);
    const quiz = buildRevisitQuiz("lesson-06-it");
    for (let i = 0; i < quiz.length; i += 1) answerQuizStep(page, quiz);

    const ambush = buildAmbushQuestions(seedAppData({ grammarLessonsDone: ["lesson-06-it"] }), "lesson-06-it", 1, [])[0];
    clickElement(
      (Array.from(page.container.querySelectorAll(".lesson-spot-row button")) as HTMLButtonElement[])[ambush.error.tokenIndex]
    );
    await flushAsync();

    // 期望：走完回马枪后看到「回访完成」完成页（有下一关出口）
    expect(page.container.innerHTML.length, "页面被整棵卸载（白屏）").toBeGreaterThan(0);
    expect(page.has("回访完成")).toBe(true);
    expect(page.has("下一关：旧案重审")).toBe(true);
    page.unmount();
  });

  it("P4-CRASH-B：即使数据面已标记关 2 完成，重新打开回访页也不应崩溃", async () => {
    seedAppData({
      grammarLessonsDone: ["lesson-06-it"],
      grammarLessonStagesDone: { "lesson-06-it": [1, 2] }
    });
    const page = mountPage(<GrammarRevisitPage />, path("lesson-06-it"), ROUTE);
    await flushAsync();
    expect(page.container.innerHTML.length, "页面被整棵卸载（白屏）").toBeGreaterThan(0);
    expect(page.has("回访完成")).toBe(true);
    page.unmount();
  });
});
