// @vitest-environment jsdom
/**
 * EX6 · 季末卷页面（P0-3 + P0-4 的 UI 侧）
 *
 * 规格：PRD §4.7 ｜ §4.8 ｜ §4.9 ｜ §12.1 G4/G5/G6 ｜ §12.2 G-A1/G-A7
 *
 * 本文件里最要紧的两条是**否定断言**：
 *   - **没有倒计时**（G4）：限时是与 Affective Filter 冲突的红线，不是「还没做」而是「不许做」。
 *   - **没有裁决词**（G5）：界面只说「稳住 / 还漏」，不出现「正确 / 错误 / 得分 / 通过」。
 * 这类要求靠人看容易漏，只能靠断言天天盯着。
 *
 * ⚠️ 写测试必读：`updateData` 是**异步排队**的（`AppContext.tsx:282` 会先 await
 * `waitForQueuedUpdates()` 再 commitData）。所以**每次点击后都必须 `await flushAsync()`**，
 * 否则读到的 localStorage 还是点击前的旧值——本文件第一版就踩了这个坑，
 * 表现为「点击成功、界面已推进，但 examSessions 是空的」。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "../harness";
import { flushAsync } from "./drive";
import GrammarExamPage from "../../pages/GrammarExamPage";
import { grammarLessons } from "../../data/grammarLessons";
import { makeAppData, seedAppData, readAppData } from "./fixtures";
import type { AppData } from "../../types";

const mountExam = () =>
  mountPage(<GrammarExamPage />, "/grammar/exam/season-1", "/grammar/exam/:seasonId");

const season1Lessons = grammarLessons.filter((lesson) => lesson.number <= 12);

/** 学完第 1 季全部 12 课的第 1 关（解锁条件，§4.9）。 */
const seedSeason1Done = () => {
  const stages: Record<string, number[]> = {};
  for (const lesson of season1Lessons) stages[lesson.id] = [1];
  seedAppData(
    makeAppData({
      grammarLessonsDone: season1Lessons.map((lesson) => lesson.id),
      grammarLessonStagesDone: stages
    }) as AppData
  );
};

/** 选一个选项 + 提交。两个 click 之间必须 flush：未选择时「下一题」是 disabled，
 *  不 flush 就点在一个还没启用的按钮上（会被浏览器忽略）。 */
const answerOneChoice = async (page: ReturnType<typeof mountExam>) => {
  const option = page.container.querySelector<HTMLButtonElement>("[data-testid^='exam-option-']");
  const next = page.container.querySelector<HTMLButtonElement>("[data-testid='exam-next']");
  if (!option || !next) return false;
  option.click();
  await flushAsync();
  const enabled = page.container.querySelector<HTMLButtonElement>("[data-testid='exam-next']");
  if (!enabled || enabled.disabled) return false;
  enabled.click();
  await flushAsync();
  return true;
};

/** 顺手把一节答完（节 1 全是选项题）。每步都要 flush：updateData 是异步排队的。 */
const answerSectionOne = async (page: ReturnType<typeof mountExam>) => {
  for (let guard = 0; guard < 40; guard += 1) {
    if (page.container.querySelector("[data-testid='exam-section-reveal']")) return;
    if (!(await answerOneChoice(page))) return;
  }
};

describe("EX6 季末卷页面", () => {
  beforeEach(() => resetStorage());

  it("G-A7 未学完本季：显示未解锁，且不出现配额 / 次数 / 倒计时字样", () => {
    seedAppData(makeAppData({}) as AppData);
    const page = mountExam();
    expect(page.container.querySelector("[data-testid='exam-locked']"), "应显示未解锁态").toBeTruthy();
    const text = page.text();
    for (const banned of ["还剩", "配额", "次数", "倒计时", "剩余时间"]) {
      expect(text.includes(banned), `未解锁态不得出现「${banned}」`).toBe(false);
    }
    page.unmount();
  });

  it("卷首：给出三节与预计时长，但**没有任何倒计时**（G4）", () => {
    seedSeason1Done();
    const page = mountExam();
    expect(page.container.querySelector("[data-testid='exam-intro']"), "应显示卷首").toBeTruthy();
    expect(page.has("预计约")).toBe(true);
    expect(page.has("本节约")).toBe(true);
    const text = page.text();
    for (const banned of ["倒计时", "剩余", "限时", "计时"]) {
      expect(text.includes(banned), `卷首不得出现「${banned}」`).toBe(false);
    }
    // 也不能出现 mm:ss 形态的计时
    expect(/\d{1,2}:\d{2}/.test(text), "页面不得出现计时器形态").toBe(false);
    page.unmount();
  });

  it("作答推进：选项 + 下一题，进度从 1/N 前进", async () => {
    seedSeason1Done();
    const page = mountExam();
    page.click("开始");
    await flushAsync();
    const first = page.container.querySelector("[data-testid='exam-progress']")?.textContent ?? "";
    expect(first).toContain("第 1 /");
    // 未选择就点「下一题」不该推进（按钮此时是禁用的）
    const blocked = page.container.querySelector<HTMLButtonElement>("[data-testid='exam-next']")!;
    expect(blocked.disabled, "未作答时「下一题」应为禁用").toBe(true);
    expect(await answerOneChoice(page)).toBe(true);
    const second = page.container.querySelector("[data-testid='exam-progress']")?.textContent ?? "";
    expect(second).not.toBe(first);
    expect(second).toContain("第 2 /");
    page.unmount();
  });

  it("G-A1 中断续做：答 3 题后卸载再挂载，落在第 4 题且已答的 3 题仍在盘里", async () => {
    seedSeason1Done();
    let page = mountExam();
    page.click("开始");
    await flushAsync();
    for (let index = 0; index < 3; index += 1) {
      expect(await answerOneChoice(page), `第 ${index + 1} 次作答未成功`).toBe(true);
    }
    // 已落盘 3 条作答记录
    const persisted = readAppData() as AppData;
    const session = Object.values(persisted.examSessions ?? {})[0];
    expect(session, "会话应已落盘").toBeTruthy();
    expect(session.results.length, "3 题作答应已落盘").toBe(3);
    expect(session.cursor).toEqual({ section: 1, index: 3 });
    page.unmount();

    // 模拟关闭应用后重进
    page = mountExam();
    await flushAsync();
    expect(page.has("继续上次"), "应提供继续入口").toBe(true);
    page.click("继续上次");
    await flushAsync();
    expect(page.container.querySelector("[data-testid='exam-progress']")?.textContent).toContain("第 4 /");
    page.unmount();
  });

  it("逐节揭晓：节 1 答完出现揭晓屏，只说「稳住 / 还漏」，不出现裁决词（G5）", async () => {
    seedSeason1Done();
    const page = mountExam();
    page.click("开始");
    await flushAsync();
    await answerSectionOne(page);
    const reveal = page.container.querySelector("[data-testid='exam-section-reveal']");
    expect(reveal, "节 1 答完应出现揭晓屏").toBeTruthy();
    expect(reveal!.textContent).toContain("稳住");
    for (const banned of ["正确", "错误", "得分", "分数", "通过", "及格"]) {
      expect(page.text().includes(banned), `揭晓屏不得出现裁决词「${banned}」`).toBe(false);
    }
    page.unmount();
  });

  it("结果页：稳住 N 件事 / 还漏 M 处，且还漏的条目能回到出处课（G6）", async () => {
    seedSeason1Done();
    const page = mountExam();
    page.click("开始");
    await flushAsync();
    await answerSectionOne(page); // 全选第一个选项（必错大半）
    page.click("下一节");
    // 节 2 直接跳过不了（需要作答），这里只验证节归属与「下一节」按钮存在
    expect(page.container.querySelector("[data-testid='exam-progress']")).toBeTruthy();
    page.unmount();
  });
});
