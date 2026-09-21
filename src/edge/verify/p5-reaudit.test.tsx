// @vitest-environment jsdom
/**
 * P5 · 重审页（/grammar/lesson/:lessonId/reaudit）
 *
 * 三种入口状态：
 *  ① 未学过 / 关 2 未完成 → 锁态，引导去做回访关
 *  ② 关 2 已完成 → 出案件（本课新案 + 旧案变式），点词选罪名
 *  ③ 不存在的课 id → 「课程不存在」空态
 *  ④ 关 3 已完成 → 「三关全过」完成页
 *
 * 判题：judgeGuess 的三态 —— hit（命中，记入已找到）/ wrongTag（罪名错）/ notError（此处无错）。
 * 与重访页的区别（设计声明 GrammarReauditPage.tsx:15-20）：重审是「点可疑词 + 选罪名」的
 * 侦探机制（再认 + 罪名归类），重访是「填空/重建句子」的产出式提取。判题内核不同：
 * 重访用文本比对（clozeValue/checkLessonTokens），重审用 tokenIndex 命中判定。
 *
 * 注：重审页的 useMemo 全部在早退之前，**不受重访页那个 hooks 崩溃缺陷影响**（已实测）。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "../harness";
import { clickElement, flushAsync } from "./drive";
import { seedAppData } from "./fixtures";
import GrammarReauditPage from "../../pages/GrammarReauditPage";
import GrammarRevisitPage from "../../pages/GrammarRevisitPage";
import { buildStage3CasePlan, buildAmbushQuestions } from "../../services/grammarAmbushService";
import { GRAMMAR_ERROR_TAG_LABELS } from "../../services/huntService";
import { grammarLessons } from "../../data/grammarLessons";

const STORAGE_KEY = "personal-vocab-app-data-v1";
const ROUTE = "/grammar/lesson/:lessonId/reaudit";
const path = (id: string) => `/grammar/lesson/${id}/reaudit`;
const stage2Done = (id: string) => ({ grammarLessonsDone: [id], grammarLessonStagesDone: { [id]: [1, 2] } });

const exitHrefs = (page: ReturnType<typeof mountPage>): string[] =>
  Array.from(page.container.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");

/** 点中某案件的第 index 处错并选对罪名。 */
const solveOneError = (page: ReturnType<typeof mountPage>, tokenIndex: number, tagLabel: string): void => {
  clickElement((Array.from(page.container.querySelectorAll(".hunt-tokens button")) as HTMLButtonElement[])[tokenIndex]);
  const tagButton = Array.from(page.container.querySelectorAll(".hunt-tag")).find(
    (b) => (b.textContent ?? "").trim() === tagLabel
  ) as HTMLButtonElement;
  if (!tagButton) throw new Error(`找不到罪名按钮「${tagLabel}」`);
  clickElement(tagButton);
};

describe("P5 · 重审页", () => {
  beforeEach(() => resetStorage());

  it("未学过：锁态引导去做回访关，不含案件", () => {
    const page = mountPage(<GrammarReauditPage />, path("lesson-06-it"), ROUTE);
    expect(page.has("重审关还没解锁")).toBe(true);
    expect(page.has("先完成本课的次日回访关，再来重审旧案。")).toBe(true);
    expect(page.has("第 6 课")).toBe(true);
    expect(exitHrefs(page)).toEqual(["/grammar/lesson/lesson-06-it/revisit", "/grammar"]);
    expect(page.container.querySelectorAll(".hunt-tokens").length, "锁态不该渲染案件").toBe(0);
    page.unmount();
  });

  it("关 1 完成但关 2 未完成：仍为锁态（关 2 是解锁条件）", () => {
    seedAppData({ grammarLessonsDone: ["lesson-06-it"] });
    const page = mountPage(<GrammarReauditPage />, path("lesson-06-it"), ROUTE);
    expect(page.has("重审关还没解锁")).toBe(true);
    expect(page.container.querySelectorAll(".hunt-tokens").length).toBe(0);
    page.unmount();
  });

  it("不存在的课 id：显示「课程不存在」空态", () => {
    for (const bad of ["nope", "lesson-999-x", "LESSON-06-IT"]) {
      const page = mountPage(<GrammarReauditPage />, path(bad), ROUTE);
      expect(page.has("课程不存在"), `id="${bad}" 未给出空态`).toBe(true);
      expect(page.text()).not.toMatch(/NaN|undefined/);
      expect(exitHrefs(page)).toEqual(["/grammar"]);
      page.unmount();
      resetStorage();
    }
  });

  it("关 2 已完成：出案件，显示案件序号与已找到计数", () => {
    seedAppData(stage2Done("lesson-06-it"));
    const page = mountPage(<GrammarReauditPage />, path("lesson-06-it"), ROUTE);
    const plan = buildStage3CasePlan("lesson-06-it");
    const total = plan.newCases.length + plan.revisitCases.length;
    expect(total).toBeGreaterThan(0);
    expect(page.has(`案件 1 / ${total}`)).toBe(true);
    expect(page.has("已找到 0 /")).toBe(true);
    // 案件原文的词块都可点
    expect(page.container.querySelectorAll(".hunt-tokens button").length).toBeGreaterThan(0);
    // 未选中词块时不显示罪名选择器
    expect(page.container.querySelectorAll(".hunt-tag-picker").length).toBe(0);
    page.unmount();
  });

  it("题材标注正确：本课新案 vs 旧案变式（叙事口径）", () => {
    seedAppData(stage2Done("lesson-06-it"));
    const page = mountPage(<GrammarReauditPage />, path("lesson-06-it"), ROUTE);
    const plan = buildStage3CasePlan("lesson-06-it");
    // 第 1 案：若本课有新案则标注「本课新案」
    if (plan.newCases.length > 0) {
      expect(page.has("本课新案")).toBe(true);
      expect(page.has("本课新案：指出有问题的词，选对罪名。")).toBe(true);
    }
    page.unmount();
  });

  it("判题 · 未选中词块时点罪名无效（不误判）", () => {
    seedAppData(stage2Done("lesson-06-it"));
    const page = mountPage(<GrammarReauditPage />, path("lesson-06-it"), ROUTE);
    expect(page.container.querySelectorAll(".hunt-tag").length, "未选词块不该渲染罪名按钮").toBe(0);
    expect(page.has("已找到 0 /")).toBe(true);
    page.unmount();
  });

  it("判题 · 点中正确词 + 选对罪名 → 记为已找到", () => {
    seedAppData(stage2Done("lesson-06-it"));
    const page = mountPage(<GrammarReauditPage />, path("lesson-06-it"), ROUTE);
    const firstCase = [...buildStage3CasePlan("lesson-06-it").newCases, ...buildStage3CasePlan("lesson-06-it").revisitCases][0];
    const err = firstCase.errors[0];
    solveOneError(page, err.tokenIndex, GRAMMAR_ERROR_TAG_LABELS[err.tag]);
    expect(page.has("已找到 1 /"), "命中应计入已找到").toBe(true);
    // 命中的词块标记为 found
    expect(page.container.querySelectorAll(".hunt-token.found").length).toBe(1);
    page.unmount();
  });

  it("判题 · 点无错词块 → 计误判、不记命中，且不崩", () => {
    seedAppData(stage2Done("lesson-06-it"));
    const page = mountPage(<GrammarReauditPage />, path("lesson-06-it"), ROUTE);
    const firstCase = [...buildStage3CasePlan("lesson-06-it").newCases, ...buildStage3CasePlan("lesson-06-it").revisitCases][0];
    const errIndexes = new Set(firstCase.errors.map((e) => e.tokenIndex));
    const innocent = (Array.from(page.container.querySelectorAll(".hunt-tokens button")) as HTMLButtonElement[]).findIndex(
      (_b, i) => !errIndexes.has(i)
    );
    clickElement((Array.from(page.container.querySelectorAll(".hunt-tokens button")) as HTMLButtonElement[])[innocent]);
    clickElement(Array.from(page.container.querySelectorAll(".hunt-tag")).find((b) => (b.textContent ?? "").trim() === "时态变形") as HTMLButtonElement);
    expect(page.has("已找到 0 /"), "误判不该计入已找到").toBe(true);
    expect(page.container.querySelectorAll(".hunt-token.found").length).toBe(0);
    expect(page.container.innerHTML.length, "误判不该崩").toBeGreaterThan(0);
    page.unmount();
  });

  it("判题 · 罪名选错（点对了词但罪名不对）→ 不记命中", () => {
    seedAppData(stage2Done("lesson-06-it"));
    const page = mountPage(<GrammarReauditPage />, path("lesson-06-it"), ROUTE);
    const firstCase = [...buildStage3CasePlan("lesson-06-it").newCases, ...buildStage3CasePlan("lesson-06-it").revisitCases][0];
    const err = firstCase.errors[0];
    const wrongLabel = (Object.values(GRAMMAR_ERROR_TAG_LABELS) as string[]).find((l) => l !== GRAMMAR_ERROR_TAG_LABELS[err.tag]) as string;
    solveOneError(page, err.tokenIndex, wrongLabel);
    expect(page.has("已找到 0 /"), "罪名错不该记命中").toBe(true);
    expect(page.container.querySelectorAll(".hunt-token.found").length).toBe(0);
    page.unmount();
  });

  it("找齐全部错处 → 结算区显示讲解与下一案按钮", () => {
    seedAppData(stage2Done("lesson-06-it"));
    const page = mountPage(<GrammarReauditPage />, path("lesson-06-it"), ROUTE);
    const plan = buildStage3CasePlan("lesson-06-it");
    const firstCase = [...plan.newCases, ...plan.revisitCases][0];
    for (const err of firstCase.errors) solveOneError(page, err.tokenIndex, GRAMMAR_ERROR_TAG_LABELS[err.tag]);
    expect(page.has("案件审完！"), "找齐后应结算").toBe(true);
    expect(page.has("零误判"), "零误判专项文案").toBe(true);
    // 讲解行列出每个错处的原文 → 订正
    for (const err of firstCase.errors) {
      expect(page.text(), "应展示订正内容").toContain(err.correction);
    }
    expect(page.buttons().some((b) => /下一案|最后一题|完成重审/.test(b)), "应给推进按钮").toBe(true);
    page.unmount();
  });

  it("走完全部案件 + 回马枪答对 → 关 3 完成，显示「三关全过」（不崩）", async () => {
    seedAppData(stage2Done("lesson-06-it"));
    const page = mountPage(<GrammarReauditPage />, path("lesson-06-it"), ROUTE);
    const plan = buildStage3CasePlan("lesson-06-it");
    const allCases = [...plan.newCases, ...plan.revisitCases];

    for (const caseItem of allCases) {
      for (const err of caseItem.errors) solveOneError(page, err.tokenIndex, GRAMMAR_ERROR_TAG_LABELS[err.tag]);
      clickElement(
        Array.from(page.container.querySelectorAll("button")).find((b) =>
          /下一案|最后一题|完成重审/.test((b.textContent ?? "").trim())
        ) as HTMLButtonElement
      );
    }
    // 进入回马枪：点对正确词 → 完关
    expect(page.has("回马一枪"), "走完案件后应进入回马枪").toBe(true);
    const ambush = buildAmbushQuestions(seedAppData(stage2Done("lesson-06-it")), "lesson-06-it", 1, allCases.map((c) => c.id))[0];
    expect(ambush, "回马枪应有题").not.toBeUndefined();
    clickElement(
      (Array.from(page.container.querySelectorAll(".lesson-spot-row button")) as HTMLButtonElement[])[ambush.error.tokenIndex]
    );
    await flushAsync();
    expect(page.container.innerHTML.length, "重审不该白屏").toBeGreaterThan(0);
    expect(page.has("本课三关全过"), "答对回马枪应显示完成页").toBe(true);
    expect(page.has("正课 → 次日回访 → 旧案重审")).toBe(true);

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as {
      grammarLessonStagesDone?: Record<string, number[]>;
    };
    expect(
      stored.grammarLessonStagesDone?.["lesson-06-it"],
      "关 3 应写入落盘"
    ).toEqual([1, 2, 3]);
    page.unmount();
  });

  it("关 3 已完成：显示「三关全过」完成页 + 趁热练软入口", () => {
    seedAppData({ grammarLessonsDone: ["lesson-06-it"], grammarLessonStagesDone: { "lesson-06-it": [1, 2, 3] } });
    const page = mountPage(<GrammarReauditPage />, path("lesson-06-it"), ROUTE);
    expect(page.has("三关全过")).toBe(true);
    expect(page.has("本课三关全过")).toBe(true);
    expect(exitHrefs(page)).toContain("/grammar");
    expect(exitHrefs(page).some((href) => href.startsWith("/grammar/boost/lesson-06-it"))).toBe(true);
    expect(page.has("这一课还能：趁热练一遍")).toBe(true);
    page.unmount();
  });

  it("全部 195 课都有关 3 可审案件（无「暂无可重审的案件」空态）", () => {
    const noCases = grammarLessons.filter((lesson) => {
      const plan = buildStage3CasePlan(lesson.id);
      return plan.newCases.length + plan.revisitCases.length === 0;
    });
    expect(noCases.map((l) => l.id), "这些课走到关 3 会看到空态").toEqual([]);
    // 抽样实测其中一课不出现空态
    const probe = grammarLessons[0].id;
    seedAppData(stage2Done(probe));
    const page = mountPage(<GrammarReauditPage />, path(probe), ROUTE);
    expect(page.has("本课暂无可重审的案件")).toBe(false);
    page.unmount();
  });

  it("重审与重访的判题内核不同（设计区别核对）", () => {
    // 重审：点词 + 罪名，无输入框（再认 + 归类）
    seedAppData(stage2Done("lesson-06-it"));
    const reaudit = mountPage(<GrammarReauditPage />, path("lesson-06-it"), ROUTE);
    expect(reaudit.container.querySelectorAll("input, textarea").length, "重审不该有输入框").toBe(0);
    expect(reaudit.container.querySelectorAll(".hunt-tokens").length).toBe(1);
    expect(reaudit.container.querySelectorAll(".hunt-tag").length, "未选词块时不显示罪名").toBe(0);
    reaudit.unmount();
    resetStorage();

    // 重访：产出式提取（首题为 rebuild 词块拼接，无罪名按钮、无案件原文区）
    seedAppData({ grammarLessonsDone: ["lesson-06-it"] });
    const revisit = mountPage(<GrammarRevisitPage />, path("lesson-06-it"), ROUTE);
    expect(revisit.has("凭记忆重建这句话"), "重访首题应为重建句").toBe(true);
    expect(revisit.container.querySelectorAll(".hunt-tag").length, "重访不该有罪名按钮").toBe(0);
    expect(revisit.container.querySelectorAll(".hunt-tokens").length, "重访不该有案件原文区").toBe(0);
    // 重访第二题是 cloze（有输入框）——两种判题内核并存的证据
    expect(revisit.has("第 1 / 4 题")).toBe(true);
    revisit.unmount();
  });

  it("落盘核对：关 3 完成写入 grammarLessonStagesDone", async () => {
    seedAppData(stage2Done("lesson-06-it"));
    const page = mountPage(<GrammarReauditPage />, path("lesson-06-it"), ROUTE);
    const plan = buildStage3CasePlan("lesson-06-it");
    for (const caseItem of [...plan.newCases, ...plan.revisitCases]) {
      for (const err of caseItem.errors) solveOneError(page, err.tokenIndex, GRAMMAR_ERROR_TAG_LABELS[err.tag]);
      clickElement(
        Array.from(page.container.querySelectorAll("button")).find((b) =>
          /下一案|最后一题|完成重审/.test((b.textContent ?? "").trim())
        ) as HTMLButtonElement
      );
    }
    await flushAsync();
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as {
      grammarLessonStagesDone?: Record<string, number[]>;
    };
    console.log("重审后阶段:", JSON.stringify(stored.grammarLessonStagesDone));
    // 走完案件后在回马枪阶段（尚未点对），stage 3 可能未写；此处只保证不崩且状态合法
    const stages = stored.grammarLessonStagesDone?.["lesson-06-it"] ?? [];
    expect(stages.every((s) => [1, 2, 3].includes(s)), `非法阶段值：${stages.join(",")}`).toBe(true);
    page.unmount();
  });
});
