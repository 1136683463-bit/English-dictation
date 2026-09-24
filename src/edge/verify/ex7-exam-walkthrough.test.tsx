// @vitest-environment jsdom
/**
 * EX7 · 整卷走查：卷首 → 三节作答 → 逐节揭晓 → 诊断屏（端到端）
 *
 * 规格：PRD §4.1 三节 ｜ §4.8 结果页 ｜ §12 验收 ｜ §13 M2 出口「G1–G15 全勾」
 *
 * 为什么必须有整卷走查（而不是只测单题与单节）：
 *   前面的用例各测一段，**段与段的接缝**没人管：节末是否真的进揭晓、揭晓按钮是否真的
 *   跳到下一节、最后一节是否真的交卷、写作题是否真的走写作通路。本文件第一次跑起来就
 *   抓出一个接缝 bug：写作题没有 options，落进了通用作答分支，被翻译判分器判了一次、
 *   且原文进不了 `session.writing`（AI 批改永远拿不到文本）。
 *
 * 走查按卷面真实顺序驱动（从 `buildExamPaper` 取同一张卷），所以它同时验证
 * 「页面渲染顺序 == 卷面顺序」。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "../harness";
import { clickElement, flushAsync, setInputValue } from "./drive";
import GrammarExamPage from "../../pages/GrammarExamPage";
import { grammarLessons } from "../../data/grammarLessons";
import { buildExamPaper } from "../../services/grammarExamPaperService";
import { itemsOfSection } from "../../services/grammarExamSessionService";
import type { ExamPaperItem } from "../../services/grammarExamPaperService";
import { makeAppData, seedAppData, readAppData, readTelemetry } from "./fixtures";
import { aiSettings, stubFetch } from "../huntDiaryEnv";
import { defaultSettings } from "../../services/storage";
import type { AppData } from "../../types";

const paper = buildExamPaper({ seasonId: "season-1", variantIndex: 0, variantCount: 5 });
const WRITING_TEXT = "Sunday was sunny. I went to the park with my friend.";

const seedSeason1Done = (settingsPatch: Record<string, unknown> = {}) => {
  const lessons = grammarLessons.filter((lesson) => lesson.number <= 12);
  const stages: Record<string, number[]> = {};
  for (const lesson of lessons) stages[lesson.id] = [1];
  seedAppData(
    makeAppData({
      grammarLessonsDone: lessons.map((lesson) => lesson.id),
      grammarLessonStagesDone: stages,
      settings: { ...defaultSettings, ...settingsPatch }
    }) as AppData
  );
};

const query = <T extends HTMLElement>(page: ReturnType<typeof mountPage>, testId: string) =>
  page.container.querySelector<T>(`[data-testid='${testId}']`);

/** 按卷面真实题型作答一题。`correct` 决定答对还是答错。 */
const answerItem = async (
  page: ReturnType<typeof mountPage>,
  item: ExamPaperItem,
  correct: boolean
) => {
  if (item.kind === "write") {
    const field = query<HTMLTextAreaElement>(page, "exam-writing-input");
    expect(field, "写作题应渲染写作输入框").toBeTruthy();
    setInputValue(field!, correct ? WRITING_TEXT : "不知道怎么写");
    await flushAsync();
    clickElement(query<HTMLButtonElement>(page, "exam-writing-submit"));
    await flushAsync();
    return;
  }
  const options = item.options ?? [];
  if (options.length > 0) {
    const pickedId = correct
      ? item.answerId!
      : options.find((option) => option.id !== item.answerId)!.id;
    const option = query<HTMLButtonElement>(page, `exam-option-${pickedId}`);
    expect(option, `找不到选项 ${pickedId}（题 ${item.id}）`).toBeTruthy();
    clickElement(option);
    await flushAsync();
    clickElement(query<HTMLButtonElement>(page, "exam-next"));
    await flushAsync();
    return;
  }
  // 翻译题（自由输入）
  const field = query<HTMLTextAreaElement>(page, "exam-input");
  expect(field, `翻译题应渲染输入框（题 ${item.id}）`).toBeTruthy();
  setInputValue(field!, correct ? item.answer : "完全不相干的内容");
  await flushAsync();
  clickElement(query<HTMLButtonElement>(page, "exam-next"));
  await flushAsync();
};

/** 从卷首一路走到诊断屏。 */
const walkPaper = async (page: ReturnType<typeof mountPage>, correct: boolean) => {
  clickElement(page.container.querySelector("button"));
  await flushAsync();
  for (const section of [1, 2, 3] as const) {
    for (const item of itemsOfSection(paper, section)) {
      await answerItem(page, item, correct);
    }
    const revealNext = query<HTMLButtonElement>(page, "exam-reveal-next");
    expect(revealNext, `第 ${section} 节答完后应出现揭晓屏`).toBeTruthy();
    clickElement(revealNext);
    await flushAsync();
  }
};

describe("EX7 整卷走查", () => {
  beforeEach(() => resetStorage());

  it("全对走查：25 题 → 诊断屏显示稳住 12 件事、全部稳住", async () => {
    seedSeason1Done();
    const page = mountPage(<GrammarExamPage />, "/grammar/exam/season-1", "/grammar/exam/:seasonId");
    await walkPaper(page, true);

    expect(query(page, "exam-stabilized")?.textContent, "应显示稳住了 12 件事").toContain("12");
    expect(query(page, "exam-all-stable"), "全对时应有「都稳住了」的收束文案").toBeTruthy();
    expect(query(page, "exam-missing-list"), "全对时不该有还漏清单").toBeNull();

    // 交卷落盘：submittedAt 已写、写作原文进了 session.writing（这条是接缝 bug 的回归闸）
    const persisted = readAppData() as AppData;
    const session = Object.values(persisted.examSessions ?? {})[0];
    expect(session.submittedAt, "交卷时间应落盘").toBeTruthy();
    expect(session.writing?.text, "写作原文必须进 session.writing（AI 批改的输入）").toBe(WRITING_TEXT);
    // 客观题 = 选择 10 + 填空 6 + 翻译 4 + 阅读 4 = 24（写作不进判分）
    expect(session.results.length, "24 道客观题应全部进 results（写作不进判分）").toBe(24);

    // 埋点齐全（G15 的一半：卷与作答侧）
    const kinds = readTelemetry().map((event) => event.kind);
    for (const required of ["exam_paper_generated", "exam_started", "exam_item_result", "exam_section_reveal", "exam_submitted"]) {
      expect(kinds.includes(required), `缺少埋点 ${required}`).toBe(true);
    }
    expect(kinds.filter((kind) => kind === "exam_item_result").length, "24 道客观题各一条").toBe(24);
    expect(kinds.filter((kind) => kind === "exam_section_reveal").length, "三节各一条").toBe(3);
    const submitted = readTelemetry().find((event) => event.kind === "exam_submitted")!;
    expect(typeof submitted.totalMs).toBe("number");
    page.unmount();
  });

  it("全错走查：诊断屏给出还漏清单，每条都能回到出处课（G6）", async () => {
    seedSeason1Done();
    const page = mountPage(<GrammarExamPage />, "/grammar/exam/season-1", "/grammar/exam/:seasonId");
    await walkPaper(page, false);

    expect(query(page, "exam-stabilized")?.textContent).toContain("0");
    expect(query(page, "exam-missing")?.textContent, "应显示还漏 12 处").toContain("12");
    const list = query(page, "exam-missing-list");
    expect(list, "应出现还漏清单").toBeTruthy();
    const rows = Array.from(list!.querySelectorAll("li"));
    expect(rows.length, "还漏条目数应等于还漏处数").toBe(12);
    for (const row of rows) {
      const link = row.querySelector("a");
      expect(link, `还漏条目缺出处链接：${row.textContent?.slice(0, 30)}`).toBeTruthy();
      expect(link!.getAttribute("href"), "出处链接应指向某一课").toMatch(/^\/grammar\/lesson\//);
    }
    // 异议入口存在（只记录不改判，PRD §4.6 禁翻供）
    expect(row0DisputeButton(page), "应提供「我觉得这句没错」入口").toBeTruthy();
    page.unmount();
  });

  it("整卷 UI 不出现裁决词、不出现计时器、不出现百分比（G4/G5）", async () => {
    seedSeason1Done();
    const page = mountPage(<GrammarExamPage />, "/grammar/exam/season-1", "/grammar/exam/:seasonId");
    await walkPaper(page, false);
    const text = page.text();
    for (const banned of ["正确", "错误", "得分", "分数", "及格", "倒计时", "剩余时间", "限时"]) {
      expect(text.includes(banned), `整卷不得出现「${banned}」`).toBe(false);
    }
    expect(/%/.test(text), "不得出现百分比（不出总分）").toBe(false);
    expect(/\d{1,2}:\d{2}/.test(text), "不得出现计时器形态").toBe(false);
    page.unmount();
  });
});

const row0DisputeButton = (page: ReturnType<typeof mountPage>) =>
  page.container.querySelector("[data-testid^='exam-dispute-']");

describe("EX7 写作 AI 批改接缝（P0-7）", () => {
  beforeEach(() => resetStorage());

  it("配置了 AI：结果屏给出「可以这样说」与可以改的地方，**没有分数**（G8）", async () => {
    seedSeason1Done(aiSettings());
    const restore = stubFetch({
      content: JSON.stringify({
        corrected: "Sunday was sunny. I went to the park with my friend.",
        recast: "It was sunny on Sunday, so I went to the park with my friend.",
        issues: [
          { original: "I go to the park", correction: "I went to the park", explanation: "说的是星期天，已经过去了。", tag: "tense" }
        ],
        comment: "星期天写得清楚，天气和地点都交代到了。"
      })
    });
    const page = mountPage(<GrammarExamPage />, "/grammar/exam/season-1", "/grammar/exam/:seasonId");
    await walkPaper(page, true);
    restore();

    expect(query(page, "exam-writing-mine")?.textContent, "应回显用户原文").toContain("Sunday was sunny");
    expect(query(page, "exam-writing-corrected")?.textContent, "应给出「可以这样说」").toContain("I went to the park");
    expect(query(page, "exam-writing-issues"), "应列出可以改的地方").toBeTruthy();
    expect(query(page, "exam-writing-comment")?.textContent).toContain("星期天");
    expect(query(page, "exam-writing-degraded"), "成功时不该显示降级提示").toBeNull();

    // G8：写作结果区不出现任何分数/等级措辞
    const writingText = query(page, "exam-writing-result")?.textContent ?? "";
    for (const banned of ["分", "score", "level", "band", "%"]) {
      expect(writingText.includes(banned), `写作结果区不得出现「${banned}」：${writingText.slice(0, 80)}`).toBe(false);
    }
    // 批改结果落盘
    const session = Object.values((readAppData() as AppData).examSessions ?? {})[0];
    expect(session.writing?.corrected, "批改结果应落盘").toContain("I went to the park");
    expect(session.writing?.degraded, "成功时不该标降级").toBeFalsy();
    page.unmount();
  });

  it("G-A3 AI 失败：显示「这次没能给出批改」+ 保留原文 + 重试入口，不伪造评语", async () => {
    seedSeason1Done(aiSettings());
    const restore = stubFetch({ throwError: "network down" });
    const page = mountPage(<GrammarExamPage />, "/grammar/exam/season-1", "/grammar/exam/:seasonId");
    await walkPaper(page, true);
    restore();

    expect(query(page, "exam-writing-degraded")?.textContent, "应显示降级提示").toContain("这次没能给出批改");
    expect(query(page, "exam-writing-mine")?.textContent, "原文必须保留").toContain("Sunday was sunny");
    expect(query(page, "exam-writing-retry"), "应提供重试入口").toBeTruthy();
    expect(query(page, "exam-writing-corrected"), "降级时不得出现任何伪造评语").toBeNull();
    expect(query(page, "exam-writing-issues"), "降级时不得出现伪造的议题清单").toBeNull();

    const session = Object.values((readAppData() as AppData).examSessions ?? {})[0];
    expect(session.writing?.degraded).toBe(true);
    expect(session.writing?.corrected).toBeUndefined();
    // 降级也要留读数（止损判据③依赖 exam_graded）
    const graded = readTelemetry().filter((event) => event.kind === "exam_graded");
    expect(graded.length, "应交一条 exam_graded").toBeGreaterThan(0);
    expect(graded[graded.length - 1].degraded).toBe(true);
    page.unmount();
  });
});
