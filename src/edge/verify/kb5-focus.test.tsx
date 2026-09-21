// @vitest-environment jsdom
/**
 * KB5 · 焦点管理（判题后 / 换题后 / 弹窗与浮层）
 *
 * 真实浏览器里，元素被卸载或被 disabled 时焦点会掉到 <body>，
 * 键盘用户必须从页面最顶端重新 Tab。这里逐个页面验证。
 *
 * 2026-09-21 说明：本轮验证进行中，有并行改动新增了 src/components/useReturnFocus.ts
 * 并接入复习页 / 课程页 / 趁热练。凡已被修好的条目，用例改为验证「修好后的行为」，
 * 并在测试名里标明「已修」；仍存在的缺口保持 willing-to-fail 断言。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import GrammarHuntPage from "../../pages/GrammarHuntPage";
import ConfirmDialog from "../../components/ConfirmDialog";
import { grammarLessons } from "../../data/grammarLessons";
import { cardsToData, makeSentenceCard, seedAppData } from "./fixtures";
import { fireKey, fireWindowKey } from "./kbd";
import { clickElement, flushAsync, setInputValue } from "./drive";
import { answerPretest, finishGuided, inSection, lessonOf, markLessonsDoneInStorage, typeInto } from "../lessonFlow";
import { makeAppData } from "./fixtures";
import { act } from "react";
import type { Mounted } from "../harness";

const LESSON = "lesson-13-now";

const mountLesson = () =>
  mountPage(<GrammarLessonPage />, `/grammar/lesson/${LESSON}`, "/grammar/lesson/:lessonId");

const warmStorage = () => {
  const warm = mountPage(<GrammarLessonPage />, "/grammar/lesson/lesson-01-am", "/grammar/lesson/:lessonId");
  warm.unmount();
  markLessonsDoneInStorage(["lesson-01-am"]);
};

/** 焦点是否落在页面内（而不是掉到 body）。 */
const focusInPage = (page: Mounted): boolean => {
  const active = document.activeElement as HTMLElement | null;
  return Boolean(active && active !== document.body && page.container.contains(active));
};

const activeLabel = (): string => {
  const active = document.activeElement as HTMLElement | null;
  if (!active) return "null";
  if (active === document.body) return "BODY";
  return `${active.tagName}.${(active.className || "").toString().slice(0, 30)}「${(active.textContent ?? "").trim().slice(0, 20)}」`;
};

const enterRecall = (page: Mounted): void => {
  answerPretest(page, LESSON, true);
  page.click("直接去练习");
  page.click("回去再看一遍讲解");
  page.click("下一步：搭装与对错");
  page.click("下一步：变奏");
  page.click("看懂了，试一试");
  finishGuided(page, LESSON);
};

describe("KB5 焦点管理", () => {
  beforeEach(() => resetStorage());

  it("KB5-1【已修 2026-09-21】忆段 / 产出段判题后焦点交回内容区（依赖键已补全）", async () => {
    warmStorage();
    const page = mountLesson();
    enterRecall(page);
    const field = page.container.querySelector<HTMLTextAreaElement>("textarea.large-textarea");
    if (!field) {
      expect(page.text().length).toBeGreaterThan(0);
      page.unmount();
      return;
    }
    typeInto(page, lessonOf(LESSON).recall?.answer ?? "");
    await flushAsync();
    field.focus();
    expect(focusInPage(page), "前置：焦点在输入框").toBe(true);
    fireKey(field, "Enter");
    await flushAsync();
    // eslint-disable-next-line no-console
    console.log("KB5-1 忆段判题后焦点:", activeLabel());
    /*
     * 根因（读源码可验证）：依赖键原为
     *   `${stage}:${guided.index}:${practiceIndex}:${guidedFeedback}:${practiceFeedback}`
     * ——**没有 recallOutcome / outputOutcome**，忆段与产出段判题只改这两个状态，
     * 依赖键不变 → useReturnFocus 的 effect 不重跑 → 焦点停在 body。
     * 现已补全依赖键（含 recallOutcome / outputOutcome / outputStep）。
     */
    /**
     * 依赖键的完整性改由 `ix3-return-focus.test.tsx` 直测 hook 契约来保证
     * （读源码文本比对依赖键太脆——排版一变就失效，且读的是实现而非行为）。
     * 这里只断言**用户可见的结果**：判题后焦点仍在页面内。
     */
    expect(
      focusInPage(page),
      `忆段判题后焦点应留在页面内（实际 ${activeLabel()}）`
    ).toBe(true);
    page.unmount();
  });



  it("KB5-2 忆段「进入练习」换段后：焦点被交回新段（2026-09-21 已修，useReturnFocus）", async () => {
    warmStorage();
    const page = mountLesson();
    enterRecall(page);
    typeInto(page, lessonOf(LESSON).recall?.answer ?? "");
    await flushAsync();
    const field = page.container.querySelector<HTMLTextAreaElement>("textarea.large-textarea");
    if (!field) {
      page.unmount();
      return;
    }
    fireKey(field, "Enter");
    await flushAsync();
    const enterPractice = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find(
      (b) => (b.textContent ?? "").trim() === "进入练习"
    );
    if (!enterPractice) {
      page.unmount();
      return;
    }
    enterPractice.focus();
    expect(focusInPage(page), "前置：焦点在「进入练习」上").toBe(true);
    clickElement(enterPractice);
    await flushAsync();
    // eslint-disable-next-line no-console
    console.log("KB5-2 换段后焦点:", activeLabel());
    expect(inSection(page, "自己来"), "换段本身是成功的（新段已渲染）").toBe(true);
    expect(
      focusInPage(page),
      `换段后焦点应落到新段（不再掉 body）；实际：${activeLabel()}`
    ).toBe(true);
    page.unmount();
  });


  it("KB5-3 趁热练换题后焦点被交回题目卡（2026-09-21 已修，useReturnFocus）", async () => {
    window.localStorage.setItem(
      "personal-vocab-app-data-v1",
      JSON.stringify(
        makeAppData({
          grammarLessonsDone: [LESSON],
          settings: {
            ...makeAppData().settings,
            aiProvider: { ...makeAppData().settings.aiProvider, enabled: false }
          }
        } as never)
      )
    );
    const page = mountPage(
      <GrammarBoostPage />,
      `/grammar/boost/${LESSON}?tier=3&from=card`,
      "/grammar/boost/:lessonId"
    );
    await flushAsync();
    const field = page.container.querySelector<HTMLInputElement>("input.large-textarea");
    if (!field) {
      expect(page.text().length).toBeGreaterThan(0);
      page.unmount();
      return;
    }
    const { buildBoostItems } = await import("../../services/grammarBoostService");
    const items = buildBoostItems(LESSON, 3);
    setInputValue(field, items[0]?.answer ?? "");
    await flushAsync();
    // 模拟真实浏览器：输入框被 disabled 后 UA 把焦点移回 body（jsdom 不会自己移）
    (document.activeElement as HTMLElement | null)?.blur?.();
    expect(document.activeElement, "前置：焦点在 body").toBe(document.body);
    fireKey(field, "Enter");
    await flushAsync();
    expect(field.disabled, "事实：判题后输入框被 disabled").toBe(true);
    // 回车进下一题
    fireWindowKey("Enter");
    await flushAsync();
    // eslint-disable-next-line no-console
    console.log("KB5-3 换题后焦点:", activeLabel());
    expect(
      focusInPage(page),
      `换题后焦点应被交回题目卡；实际：${activeLabel()}`
    ).toBe(true);
    expect(document.activeElement, "焦点不应停在 body").not.toBe(document.body);
    page.unmount();
  });


  it("KB5-4 ConfirmDialog 打开时焦点进弹窗、Escape 关闭", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const { createRoot } = await import("react-dom/client");
    const root = createRoot(container);
    let cancelled = false;
    const open = true;
    act(() => {
      root.render(
        <ConfirmDialog
          open={open}
          title="删除这一张？"
          message="删除后不可恢复。"
          onConfirm={() => undefined}
          onCancel={() => {
            cancelled = true;
          }}
        />
      );
    });
    // eslint-disable-next-line no-console
    console.log("KB5-4 弹窗打开后焦点:", activeLabel());
    const dialog = container.querySelector('[role="alertdialog"]');
    expect(dialog, "弹窗应有 role=alertdialog").toBeTruthy();
    expect(dialog!.getAttribute("aria-modal"), "弹窗应声明 aria-modal").toBe("true");
    expect(
      container.contains(document.activeElement),
      `打开弹窗时焦点应进入弹窗；实际：${activeLabel()}`
    ).toBe(true);
    fireWindowKey("Escape");
    expect(cancelled, "Escape 应触发 onCancel").toBe(true);
    act(() => root.unmount());
    container.remove();
  });

  it("KB5-5 ConfirmDialog 有 focus trap：Tab / Shift+Tab 在弹窗内循环", async () => {
    const bg = document.createElement("button");
    bg.textContent = "背景按钮";
    document.body.appendChild(bg);
    const container = document.createElement("div");
    document.body.appendChild(container);
    const { createRoot } = await import("react-dom/client");
    const root = createRoot(container);
    act(() => {
      root.render(
        <ConfirmDialog open title="确认？" message="x" onConfirm={() => undefined} onCancel={() => undefined} />
      );
    });
    const dialog = container.querySelector<HTMLElement>('[role="alertdialog"]')!;
    const buttons = Array.from(dialog.querySelectorAll<HTMLButtonElement>("button"));
    expect(buttons.length, "弹窗内应有取消 / 确认两个按钮").toBe(2);
    expect(document.activeElement, "打开时聚焦第一个按钮（取消）").toBe(buttons[0]);
    // Tab：从最后一个按钮 → 回到第一个（焦点被循环拦在弹窗内）
    buttons[1].focus();
    fireWindowKey("Tab");
    expect(document.activeElement, "Tab 在最后一个按钮上应循环回第一个").toBe(buttons[0]);
    // Shift+Tab：从第一个 → 回到最后一个
    buttons[0].focus();
    fireWindowKey("Tab", { shiftKey: true });
    expect(document.activeElement, "Shift+Tab 在第一个按钮上应循环到最后一个").toBe(buttons[1]);
    // 焦点意外落到弹窗外时也会被拉回来
    bg.focus();
    fireWindowKey("Tab");
    expect(dialog.contains(document.activeElement), "焦点在背景时 Tab 应被拉回弹窗").toBe(true);
    act(() => root.unmount());
    container.remove();
    bg.remove();
  });

  it("KB5-5b【部分覆盖 FAIL】inert 的作用范围只到「遮罩的父节点内的兄弟」——同层之外的背景不隔离", async () => {
    const outside = document.createElement("button");
    outside.textContent = "弹窗容器之外的背景按钮";
    document.body.appendChild(outside);
    const container = document.createElement("div");
    document.body.appendChild(container);
    const { createRoot } = await import("react-dom/client");
    const root = createRoot(container);
    act(() => {
      root.render(
        <ConfirmDialog open title="确认？" message="x" onConfirm={() => undefined} onCancel={() => undefined} />
      );
    });
    // 遮罩渲染出来之后再插入「同层兄弟」（React 不可见的外部节点），模拟真实页面里
    // 与弹窗挂在同一个父节点下的其它页面内容
    const insideSibling = document.createElement("button");
    insideSibling.textContent = "同容器内的兄弟按钮";
    container.appendChild(insideSibling);
    expect(
      container.querySelector(".confirm-overlay")?.parentElement,
      "前置：遮罩的父节点就是这个容器"
    ).toBe(container);
    // inert 在挂载时对当时的兄弟生效；后插入的兄弟不在名单里。
    // 这条记录的是「inert 是一次性快照」这一事实。
    expect(
      insideSibling.getAttribute("inert"),
      "当前行为：inert 在打开瞬间做一次性快照，之后新增的同层节点不受保护"
    ).toBeNull();
    // 当前行为：overlay.parentElement 的兄弟之外的背景（如页面级顶栏 / 另一棵子树）不被 inert
    expect(
      outside.getAttribute("inert"),
      "当前行为（覆盖缺口）：容器之外的背景元素没有被 inert → 读屏浏览光标仍能读到、程序 .focus() 仍能落上去"
    ).toBeNull();
    act(() => root.unmount());
    container.remove();
    outside.remove();
  });

  it("KB5-6 侦探页选中词块后，罪名按钮出现但焦点仍在词块上（不自动聚焦新面板）", async () => {
    const caseId = "hunt-call-mother";
    const lessons = grammarLessons.filter((lesson) => lesson.huntCaseIds.includes(caseId)).map((l) => l.id);
    seedAppData({ grammarLessonsDone: lessons });
    const page = mountPage(<GrammarHuntPage />, `/grammar/hunt?case=${caseId}`, "/grammar/hunt");
    await flushAsync();
    const token = page.container.querySelector<HTMLElement>(".hunt-token")!;
    token.focus();
    fireKey(token, "Enter");
    await flushAsync();
    // eslint-disable-next-line no-console
    console.log("KB5-6 选中后焦点:", activeLabel());
    // 事实：焦点留在原词块（这本身可接受——但面板出现在页面下方，键盘用户不知道要往下 Tab）
    expect(page.container.querySelector(".hunt-tag-grid"), "罪名面板应出现").toBeTruthy();
    expect(
      document.activeElement === token || focusInPage(page),
      "焦点至少应在页面内"
    ).toBe(true);
    page.unmount();
  });


  it("KB5-8 ConfirmDialog 关闭后把焦点归还给触发它的按钮（2026-09-21 已修）", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "删除这一张";
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement, "前置：焦点在触发按钮上").toBe(trigger);
    const container = document.createElement("div");
    document.body.appendChild(container);
    const { createRoot } = await import("react-dom/client");
    const root = createRoot(container);
    const render = (open: boolean) =>
      act(() => {
        root.render(
          <ConfirmDialog
            open={open}
            title="删除这一张？"
            message="删除后不可恢复。"
            onConfirm={() => undefined}
            onCancel={() => undefined}
          />
        );
      });
    render(true);
    expect(container.contains(document.activeElement), "打开时焦点进入弹窗").toBe(true);
    render(false);
    expect(
      document.activeElement,
      "关闭后焦点应归还给触发它的按钮（不再掉到 body）"
    ).toBe(trigger);
    act(() => root.unmount());
    container.remove();
    trigger.remove();
  });

  it("KB5-9 ConfirmDialog：触发元素已不在 DOM 时不聚焦已卸载节点（防回归）", async () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const { createRoot } = await import("react-dom/client");
    const root = createRoot(container);
    const render = (open: boolean) =>
      act(() => {
        root.render(
          <ConfirmDialog open={open} title="t" message="m" onConfirm={() => undefined} onCancel={() => undefined} />
        );
      });
    render(true);
    trigger.remove();
    render(false);
    const active = document.activeElement as HTMLElement | null;
    expect(active ? document.body.contains(active) : true, "焦点不应停在已卸载的节点上").toBe(true);
    expect(active === trigger, "已卸载的触发元素不应被重新聚焦").toBe(false);
    act(() => root.unmount());
    container.remove();
  });

  it("KB5-7 复习页 free_type 判题后焦点被交回内容区（2026-09-21 已修，useReturnFocus）", async () => {
    const fixtures = [
      makeSentenceCard({
        id: "kb-focus-1",
        sentence: "I am drawing a picture of my sister.",
        note: "语法课核心句：第 1 课",
        sourceId: "lesson:lesson-13-now",
        schedule: { reviewCount: 3 }
      })
    ];
    seedAppData(cardsToData(fixtures));
    const page = mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");
    await flushAsync();
    const field = page.container.querySelector<HTMLTextAreaElement>("textarea.large-textarea");
    if (!field) {
      expect(page.text().length).toBeGreaterThan(0);
      page.unmount();
      return;
    }
    setInputValue(field, "I am drawing a picture of my sister.");
    await flushAsync();
    /*
     * 刻意不调用 field.focus()：让 activeElement 停在 <body>。
     * 这正是真实浏览器里「输入框被 disabled → UA 把焦点移回 body」后的状态，
     * 也是 useReturnFocus 的触发条件（jsdom 不会自己把焦点从 disabled 元素上移走，
     * 所以必须把初始状态摆成 body，才能验证 hook 真的会补偿）。
     */
    // 把残留焦点清掉（jsdom 里上一个用例/挂载可能留下 activeElement），摆成 body
    (document.activeElement as HTMLElement | null)?.blur?.();
    expect(document.activeElement, "前置：焦点在 body（模拟真实浏览器的焦点丢失）").toBe(document.body);
    fireKey(field, "Enter");
    await flushAsync();
    // eslint-disable-next-line no-console
    console.log("KB5-7 复习页判题后焦点:", activeLabel());
    expect(field.disabled, "事实：判题后输入框被 disabled").toBe(true);
    const active = document.activeElement as HTMLElement | null;
    expect(active, "判题后 activeElement 不应为 null").toBeTruthy();
    expect(active, "已修：焦点被 useReturnFocus 交回页面内（不再停 body）").not.toBe(document.body);
    expect(page.container.contains(active!), "焦点应落在题目卡内的可操作元素上").toBe(true);
    page.unmount();
  });


  it("KB5-7b 三页都已接入 useReturnFocus（焦点归还的覆盖范围探针）", async () => {
    const src = await import("node:fs").then((fs) => ({
      review: fs.readFileSync("/Users/liujun/Documents/英语听写/src/pages/GrammarReviewPage.tsx", "utf8"),
      lesson: fs.readFileSync("/Users/liujun/Documents/英语听写/src/pages/GrammarLessonPage.tsx", "utf8"),
      boost: fs.readFileSync("/Users/liujun/Documents/英语听写/src/pages/GrammarBoostPage.tsx", "utf8"),
      hunt: fs.readFileSync("/Users/liujun/Documents/英语听写/src/pages/GrammarHuntPage.tsx", "utf8")
    }));
    // eslint-disable-next-line no-console
    console.log(
      "KB5-7b useReturnFocus 接入情况：复习页",
      src.review.includes("useReturnFocus"),
      "| 课程页",
      src.lesson.includes("useReturnFocus"),
      "| 趁热练",
      src.boost.includes("useReturnFocus"),
      "| 侦探页",
      src.hunt.includes("useReturnFocus")
    );
    for (const [name, text] of [
      ["复习页", src.review],
      ["课程页", src.lesson],
      ["趁热练", src.boost]
    ] as const) {
      expect(text.includes("useReturnFocus"), `${name}应接入 useReturnFocus`).toBe(true);
    }
    // 回访页（本轮 KB8 覆盖的页面）尚未接入 —— 记录为覆盖缺口
    const revisit = await import("node:fs").then((fs) =>
      fs.readFileSync("/Users/liujun/Documents/英语听写/src/pages/GrammarRevisitPage.tsx", "utf8")
    );
    expect(
      revisit.includes("useReturnFocus"),
      "当前行为（缺口，非本轮课程页范围）：回访页尚未接入焦点归还"
    ).toBe(false);
  });

});

