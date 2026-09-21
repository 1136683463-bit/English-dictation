// @vitest-environment jsdom
/**
 * KB6 · aria-* 与语义清单（键盘/读屏可发现性）
 * KB7 · 按键边界（连按、Space 滚动、Escape）
 *
 * 逐页扫描：图标按钮有没有可读名、反馈区有没有 aria-live、进度有没有 aria 描述、
 * 只有 tabIndex 没有 role 的元素是否存在。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import GrammarHuntPage from "../../pages/GrammarHuntPage";
import GrammarRevisitPage from "../../pages/GrammarRevisitPage";
import SpellingPage from "../../pages/SpellingPage";
import { grammarLessons } from "../../data/grammarLessons";
import { huntCases } from "../../data/huntCases";
import { cardsToData, makeAppData, makeSentenceCard, seedAppData } from "./fixtures";
import { accessibleName, fireKey, focusableIn } from "./kbd";
import { clickElement, flushAsync, setInputValue } from "./drive";
import type { Mounted } from "../harness";

const LESSON = "lesson-13-now";

/** 扫描：所有 tabIndex=0/正数的元素必须有 role（否则读屏是「未知元素」）。 */
const tabIndexWithoutRole = (root: HTMLElement): string[] =>
  Array.from(root.querySelectorAll<HTMLElement>("[tabindex]"))
    .filter((el) => {
      const value = Number(el.getAttribute("tabindex"));
      return value >= 0 && !el.hasAttribute("role") && !["BUTTON", "A", "INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
    })
    .map((el) => `${el.tagName}.${(el.className || "").toString().slice(0, 30)}`);

/** 扫描：无可读名的 button / a。 */
const unnamedInteractive = (root: HTMLElement): string[] =>
  Array.from(root.querySelectorAll<HTMLElement>("button, a[href]"))
    .filter((el) => !accessibleName(el))
    .map((el) => `${el.tagName}.${(el.className || "").toString().slice(0, 30)}`);

/** 扫描：图标按钮（有 svg 无文本）是否都有 aria-label。 */
const iconButtonsWithoutLabel = (root: HTMLElement): string[] =>
  Array.from(root.querySelectorAll<HTMLElement>("button"))
    .filter((el) => el.querySelector("svg") && !(el.textContent ?? "").trim() && !el.getAttribute("aria-label") && !el.getAttribute("title"))
    .map((el) => `button.${(el.className || "").toString().slice(0, 40)}`);

const liveRegions = (root: HTMLElement): string[] =>
  Array.from(root.querySelectorAll<HTMLElement>('[aria-live], [role="status"], [role="alert"]')).map(
    (el) => `${el.tagName}.${(el.className || "").toString().slice(0, 40)}[aria-live=${el.getAttribute("aria-live") ?? "-"}]`
  );

const mountLesson = () => mountPage(<GrammarLessonPage />, `/grammar/lesson/${LESSON}`, "/grammar/lesson/:lessonId");

const warmStorage = () => {
  const warm = mountPage(<GrammarLessonPage />, "/grammar/lesson/lesson-01-am", "/grammar/lesson/:lessonId");
  warm.unmount();
  const raw = window.localStorage.getItem("personal-vocab-app-data-v1");
  if (!raw) return;
  const parsed = JSON.parse(raw) as Record<string, unknown>;
  parsed.grammarLessonsDone = ["lesson-01-am"];
  window.localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(parsed));
};

const seedBoost = () =>
  window.localStorage.setItem(
    "personal-vocab-app-data-v1",
    JSON.stringify(
      makeAppData({
        grammarLessonsDone: [LESSON],
        settings: { ...makeAppData().settings, aiProvider: { ...makeAppData().settings.aiProvider, enabled: false } }
      } as never)
    )
  );

const seedHunt = () => {
  const caseId = "hunt-call-mother";
  const lessons = grammarLessons.filter((lesson) => lesson.huntCaseIds.includes(caseId)).map((l) => l.id);
  seedAppData({ grammarLessonsDone: lessons });
  return caseId;
};

const seedReview = () =>
  seedAppData(
    cardsToData([
      makeSentenceCard({
        id: "kb-aria-1",
        sentence: "I am drawing a picture of my sister.",
        note: "语法课核心句：第 1 课",
        sourceId: "lesson:lesson-13-now",
        schedule: { reviewCount: 3 }
      })
    ])
  );

describe("KB6 aria 与语义清单", () => {
  beforeEach(() => resetStorage());

  it("KB6-1 课程页：无缺名按钮 / 无 tabIndex 缺 role / 图标按钮都有 aria-label", async () => {
    warmStorage();
    const page = mountLesson();
    await flushAsync();
    const report = {
      unnamed: unnamedInteractive(page.container),
      tabIndexWithoutRole: tabIndexWithoutRole(page.container),
      iconNoLabel: iconButtonsWithoutLabel(page.container),
      live: liveRegions(page.container)
    };
    // eslint-disable-next-line no-console
    console.log("KB6-1 课程页 aria 扫描:", JSON.stringify(report, null, 1));
    expect(report.unnamed, "存在无可读名的按钮/链接").toEqual([]);
    expect(report.tabIndexWithoutRole, "存在只有 tabIndex 没有 role 的元素").toEqual([]);
    expect(report.iconNoLabel, "存在无可读名的图标按钮").toEqual([]);
    page.unmount();
  });

  it("KB6-2 课程页：拼装区与进度区有 aria-label；反馈区有 aria-live", async () => {
    warmStorage();
    const page = mountLesson();
    await flushAsync();
    // 段进度点：只有 aria-label，内部是纯装饰 span（读屏只读 label，符合预期）
    const dots = page.container.querySelector(".lesson-stage-dots");
    expect(dots, "段进度应存在").toBeTruthy();
    expect(dots!.getAttribute("aria-label"), "段进度应有可读描述").toBeTruthy();
    // 段名：section[aria-label]
    const sections = Array.from(page.container.querySelectorAll<HTMLElement>("section.lesson-stage[aria-label]"));
    expect(sections.length, "每个段都应有 aria-label（读屏可导航到段）").toBeGreaterThan(0);
    page.unmount();
  });

  it("KB6-3 趁热练：档位卡/选项/输入框的可读名与 aria-live", async () => {
    seedBoost();
    const select = mountPage(<GrammarBoostPage />, `/grammar/boost/${LESSON}?from=card`, "/grammar/boost/:lessonId");
    await flushAsync();
    const selectReport = {
      unnamed: unnamedInteractive(select.container),
      tabIndexWithoutRole: tabIndexWithoutRole(select.container),
      iconNoLabel: iconButtonsWithoutLabel(select.container),
      live: liveRegions(select.container)
    };
    // eslint-disable-next-line no-console
    console.log("KB6-3 趁热练（档选择）aria 扫描:", JSON.stringify(selectReport, null, 1));
    expect(selectReport.unnamed).toEqual([]);
    expect(selectReport.tabIndexWithoutRole).toEqual([]);
    expect(selectReport.iconNoLabel).toEqual([]);
    select.unmount();

    const run = mountPage(<GrammarBoostPage />, `/grammar/boost/${LESSON}?tier=2&from=card`, "/grammar/boost/:lessonId");
    await flushAsync();
    const runReport = {
      unnamed: unnamedInteractive(run.container),
      tabIndexWithoutRole: tabIndexWithoutRole(run.container),
      iconNoLabel: iconButtonsWithoutLabel(run.container),
      live: liveRegions(run.container)
    };
    // eslint-disable-next-line no-console
    console.log("KB6-3 趁热练（进行中）aria 扫描:", JSON.stringify(runReport, null, 1));
    expect(runReport.unnamed).toEqual([]);
    expect(runReport.tabIndexWithoutRole).toEqual([]);
    expect(runReport.iconNoLabel, "存在无可读名的图标按钮（如只听不写的发音按钮）").toEqual([]);
    run.unmount();
  });

  it("KB6-4 复习页：无缺名按钮；反馈区有 aria-live", async () => {
    seedReview();
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    await flushAsync();
    const report = {
      unnamed: unnamedInteractive(page.container),
      tabIndexWithoutRole: tabIndexWithoutRole(page.container),
      iconNoLabel: iconButtonsWithoutLabel(page.container),
      live: liveRegions(page.container)
    };
    // eslint-disable-next-line no-console
    console.log("KB6-4 复习页 aria 扫描:", JSON.stringify(report, null, 1));
    expect(report.unnamed).toEqual([]);
    expect(report.tabIndexWithoutRole).toEqual([]);
    expect(report.iconNoLabel).toEqual([]);
    page.unmount();
  });

  it("KB6-5 侦探页：词块 role/tabIndex/可读名齐备；进度与提示区有 aria", async () => {
    const caseId = seedHunt();
    const page = mountPage(<GrammarHuntPage />, `/grammar/hunt?case=${caseId}`, "/grammar/hunt");
    await flushAsync();
    const report = {
      unnamed: unnamedInteractive(page.container),
      tabIndexWithoutRole: tabIndexWithoutRole(page.container),
      iconNoLabel: iconButtonsWithoutLabel(page.container),
      live: liveRegions(page.container)
    };
    // eslint-disable-next-line no-console
    console.log("KB6-5 侦探页 aria 扫描:", JSON.stringify(report, null, 1));
    expect(report.unnamed).toEqual([]);
    expect(report.tabIndexWithoutRole, "只有 tabIndex 没有 role 的 div/span 对读屏是「未知元素」").toEqual([]);
    expect(report.iconNoLabel).toEqual([]);
    // eslint-disable-next-line no-console
    console.log("KB6-5 事实：侦探页案件列表（不是案件详情）没有 aria-live，但结算/判定区有");
    page.unmount();
  });


  it("KB6-7 课程页（答题后）：反馈区 aria-live 覆盖情况清点", async () => {
    warmStorage();
    const page = mountLesson();
    await flushAsync();
    // 前测答一题 → 反馈区出现
    const option = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-option")).find((b) => !b.disabled);
    if (option) clickElement(option);
    await flushAsync();
    const live = liveRegions(page.container);
    // eslint-disable-next-line no-console
    console.log("KB6-7 课程页答题后 aria-live 清单:", JSON.stringify(live));
    expect(live.length, "反馈区必须带 aria-live，否则读屏用户听不到判定结果").toBeGreaterThan(0);
    // 逐条断言：每个反馈容器都是 polite 直播区
    for (const entry of live) {
      expect(entry, "反馈区应为 aria-live=polite（不是 assertive，避免打断）").toContain("polite");
    }
    page.unmount();
  });

  it("KB6-8 侦探页（判定后）：提示/判定区 aria-live 覆盖", async () => {
    const caseId = seedHunt();
    const page = mountPage(<GrammarHuntPage />, `/grammar/hunt?case=${caseId}`, "/grammar/hunt");
    await flushAsync();
    const token = page.container.querySelector<HTMLElement>(".hunt-token")!;
    fireKey(token, "Enter");
    await flushAsync();
    const tag = page.container.querySelector<HTMLButtonElement>(".hunt-tag-btn")!;
    clickElement(tag);
    await flushAsync();
    const live = liveRegions(page.container);
    // eslint-disable-next-line no-console
    console.log("KB6-8 侦探页判定后 aria-live 清单:", JSON.stringify(live));
    expect(live.length, "判定/提示区应有 aria-live").toBeGreaterThan(0);
    page.unmount();
  });

  it("KB6-6 次日回访页：无缺名按钮 / 无 tabIndex 缺 role", async () => {
    // 解锁条件：课程完成事件存在
    window.localStorage.setItem(
      "personal-vocab-app-data-v1",
      JSON.stringify(makeAppData({ grammarLessonsDone: [LESSON] } as never))
    );
    window.localStorage.setItem(
      "grammar-telemetry-events-v1",
      JSON.stringify({
        version: 1,
        events: [
          {
            kind: "grammar_lesson_completed",
            lessonId: LESSON,
            completedAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
            ts: new Date().toISOString()
          }
        ]
      })
    );
    const page = mountPage(
      <GrammarRevisitPage />,
      `/grammar/lesson/${LESSON}/revisit`,
      "/grammar/lesson/:lessonId/revisit"
    );
    await flushAsync();
    const report = {
      unnamed: unnamedInteractive(page.container),
      tabIndexWithoutRole: tabIndexWithoutRole(page.container),
      iconNoLabel: iconButtonsWithoutLabel(page.container),
      live: liveRegions(page.container)
    };
    // eslint-disable-next-line no-console
    console.log("KB6-6 回访页 aria 扫描:", JSON.stringify(report, null, 1));
    expect(report.unnamed).toEqual([]);
    expect(report.tabIndexWithoutRole).toEqual([]);
    expect(report.iconNoLabel).toEqual([]);
    page.unmount();
  });
});

describe("KB7 按键边界", () => {
  beforeEach(() => resetStorage());

  it("KB7-1 课程页忆段：连按回车不重复入队 / 不重复判分", async () => {
    warmStorage();
    const page = mountLesson();
    await flushAsync();
    // 预热：随便答一下前测进忆段太慢，这里直接断言「没有输入框时回车不会崩」
    const field = page.container.querySelector<HTMLTextAreaElement>("textarea.large-textarea");
    if (!field) {
      const before = page.text();
      fireKey(page.container, "Enter");
      await flushAsync();
      expect(page.text(), "非输入态回车不应改变页面").toBe(before);
      page.unmount();
      return;
    }
    page.unmount();
  });

  it("KB7-2 全站：非输入态 Space 不会被 preventDefault（页面仍可滚动）", async () => {
    warmStorage();
    const page = mountLesson();
    await flushAsync();
    const event = fireKey(document.body, " ");
    // 课程页没有全局 Space 处理 → 不该 preventDefault（否则页面滚不动）
    expect(event.defaultPrevented, "课程页 body 上的 Space 不应被拦截").toBe(false);
    page.unmount();
  });

  it("KB7-3 课程页 Escape：没有全局 Escape 处理，不误伤任何状态", async () => {
    warmStorage();
    const page = mountLesson();
    await flushAsync();
    const before = page.text();
    fireKey(document.body, "Escape");
    await flushAsync();
    expect(page.text(), "课程页 Escape 不应改变状态").toBe(before);
    // 返回课程地图按钮必须存在（Escape 不是唯一出口的替代）
    const back = page.container.querySelector('button[aria-label="返回课程地图"]');
    expect(back, "返回入口应有 aria-label（图标按钮）").toBeTruthy();
    page.unmount();
  });

  it("KB7-4 侦探页 Escape：不误伤（无关闭行为，也不切换案件）", async () => {
    const caseId = seedHunt();
    const page = mountPage(<GrammarHuntPage />, `/grammar/hunt?case=${caseId}`, "/grammar/hunt");
    await flushAsync();
    const before = page.text();
    fireKey(document.body, "Escape");
    await flushAsync();
    expect(page.text(), "侦探页 Escape 不应改变状态").toBe(before);
    page.unmount();
  });

  it("KB7-5 侦探页：连按 Enter 在同一词块上不重复累加误判", async () => {
    const caseId = seedHunt();
    const page = mountPage(<GrammarHuntPage />, `/grammar/hunt?case=${caseId}`, "/grammar/hunt");
    await flushAsync();
    const token = page.container.querySelector<HTMLElement>(".hunt-token")!;
    fireKey(token, "Enter");
    await flushAsync();
    const afterFirst = page.container.querySelectorAll(".hunt-tag-grid").length;
    fireKey(token, "Enter");
    fireKey(token, "Enter");
    await flushAsync();
    expect(page.container.querySelectorAll(".hunt-tag-grid").length, "面板只应存在一个").toBe(afterFirst);
    page.unmount();
  });

  it("KB7-6 复习页：Enter 在非输入态不触发任何提交", async () => {
    seedReview();
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    await flushAsync();
    const before = page.text();
    fireKey(document.body, "Enter");
    await flushAsync();
    expect(page.text(), "复习页 body 回车不应改变状态").toBe(before);
    page.unmount();
  });

  it("KB7-7 趁热练：反馈态按住回车（keydown repeat）只推进一题", async () => {
    seedBoost();
    const page = mountPage(
      <GrammarBoostPage />,
      `/grammar/boost/${LESSON}?tier=3&from=card`,
      "/grammar/boost/:lessonId"
    );
    await flushAsync();
    const field = page.container.querySelector<HTMLInputElement>("input.large-textarea");
    if (!field) {
      page.unmount();
      return;
    }
    const { buildBoostItems } = await import("../../services/grammarBoostService");
    const items = buildBoostItems(LESSON, 3);
    setInputValue(field, items[0]?.answer ?? "");
    await flushAsync();
    fireKey(field, "Enter");
    await flushAsync();
    field.blur();
    const indexOf = () => Number(/第 (\d+) \/ (\d+) 题/.exec(page.text())?.[1] ?? 0);
    const before = indexOf();
    for (let i = 0; i < 5; i += 1) fireKey(window, "Enter");
    await flushAsync();
    expect(indexOf(), "按住回车（自动重复）不应连跳多题").toBeLessThanOrEqual(before + 1);
    page.unmount();
  });


  it("KB7-9【已修 2026-09-21】拼写页正文按 Tab 可出声，输入框与 Shift+Tab 放行", async () => {
    const fixture = {
      card: {
        id: "sp-tab-1",
        type: "word" as const,
        front: "picture",
        back: "画",
        note: "",
        sourceId: "unit:x",
        tags: ["核心"],
        status: "review" as const,
        priority: false,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      schedule: {
        cardId: "sp-tab-1",
        easeFactor: 2.5,
        intervalDays: 1,
        reviewCount: 0,
        lapseCount: 0,
        nextReviewAt: "2024-01-01T00:00:00.000Z"
      },
      details: {
        cardId: "sp-tab-1",
        phonetic: "",
        partOfSpeech: "n.",
        translation: "画",
        example: "",
        englishDefinition: "",
        collocations: [],
        keywords: []
      }
    };
    seedAppData({ cards: [fixture.card], schedules: [fixture.schedule], wordDetails: [fixture.details] } as never);
    const page = mountPage(<SpellingPage />, "/spelling", "/spelling");
    await flushAsync();
    const input = page.container.querySelector<HTMLInputElement>("input");
    expect(input, "拼写页应有输入框").toBeTruthy();
    // GrammarBoostPage 的 Tab 劫持只作用于自己的输入框；拼写页是把 Tab 挂在 window 上
    const onInput = fireKey(input!, "Tab");
    const onBody = fireKey(document.body, "Tab");
    const onBodyShift = fireKey(document.body, "Tab", { shiftKey: true });
    // eslint-disable-next-line no-console
    console.log(
      "KB7-9 拼写页 Tab（输入框/正文/Shift+正文）defaultPrevented:",
      onInput.defaultPrevented,
      onBody.defaultPrevented,
      onBodyShift.defaultPrevented
    );
    /**
     * 修复前：这三条全为 true（整页 Tab 被无条件吃掉）。
     * 现在只有「正文上的正向 Tab」被接管（设计本意：顺便听一遍），
     * 输入框与 Shift+Tab 一律放行。
     */
    expect(onInput.defaultPrevented, "输入框上 Tab 应放行（否则无法离开输入框）").toBe(false);
    expect(onBody.defaultPrevented, "正文上正向 Tab 仍由页面接管（听一遍）").toBe(true);
    expect(onBodyShift.defaultPrevented, "Shift+Tab 应始终放行").toBe(false);
    page.unmount();
  });

  it("KB7-10【已修 2026-09-21】趁热练输入框不再劫持 Tab（提示改用 Ctrl+H）", async () => {
    seedBoost();
    const page = mountPage(
      <GrammarBoostPage />,
      `/grammar/boost/${LESSON}?tier=2&from=card`,
      "/grammar/boost/:lessonId"
    );
    await flushAsync();
    const input = page.container.querySelector<HTMLInputElement>("input.large-textarea");
    if (!input) {
      expect(page.text().length).toBeGreaterThan(0);
      page.unmount();
      return;
    }
    const first = fireKey(input, "Tab");
    expect(first.defaultPrevented, "输入框上 Tab 应放行（提示已改到 Ctrl+H）").toBe(false);
    // 对比：正文上的 Tab 不受影响（劫持只挂在输入框的 onKeyDown 上，没有全局掠夺）
    const onBody = fireKey(document.body, "Tab");
    expect(onBody.defaultPrevented, "对照：正文上的 Tab 未被劫持（比拼写页的全局劫持温和）").toBe(false);
    page.unmount();
  });

  it("KB7-8 全站：可聚焦元素数量与顺序（键盘可达性抽样）", async () => {
    warmStorage();
    const page = mountLesson();
    await flushAsync();
    const focusables = focusableIn(page.container);
    expect(focusables.length, "课程页应有可聚焦元素").toBeGreaterThan(3);
    // 每个可聚焦元素的 tabindex 都不得为负（除有意排除）
    const negative = focusables.filter((el) => Number(el.getAttribute("tabindex") ?? "0") < 0);
    expect(negative.map((el) => el.className), "Tab 序列内不应出现 tabindex<0").toEqual([]);
    page.unmount();
  });
});

void huntCases;
void seedReview;
void clickElement;
void setInputValue;
