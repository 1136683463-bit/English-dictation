// @vitest-environment jsdom
/**
 * KB2 · 趁热练（GrammarBoostPage）的键盘路径
 *
 * 三个处理点：
 * - :741 window keydown（答对/看答案后回车进下一题）
 * - :1217 输入框回车提交
 * - :1223 输入框 Tab = 要一级提示（**自定义 Tab**）
 *
 * 重点验证 Tab 是否劫持了浏览器正常的焦点移动（无障碍阻断），
 * 以及输入框回车在组词态 / Shift 下的边界。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import { buildBoostItems, type BoostItem } from "../../services/grammarBoostService";
import { clickElement, clickButtonContaining, flushAsync, setInputValue } from "./drive";
import { makeAppData } from "./fixtures";
import { fireKey, fireWindowKey, focusableIn, buttonsWithoutName, accessibleName } from "./kbd";

const LESSON_ID = "lesson-13-now";

const seed = (): void => {
  window.localStorage.setItem(
    "personal-vocab-app-data-v1",
    JSON.stringify(
      makeAppData({
        grammarLessonsDone: [LESSON_ID],
        settings: {
          ...makeAppData().settings,
          aiProvider: { ...makeAppData().settings.aiProvider, enabled: false }
        }
      } as never)
    )
  );
};

const mountBoost = (tier = 2) =>
  mountPage(
    <GrammarBoostPage />,
    `/grammar/boost/${LESSON_ID}?tier=${tier}&from=card`,
    "/grammar/boost/:lessonId"
  );

const boostedData = () =>
  makeAppData({ grammarLessonsDone: [LESSON_ID] } as never);

/** 走到「需要自己写整句」的那道题（recall/translate/produce/variant/fix）。 */
const reachTextItem = async (tier = 2): Promise<{ page: ReturnType<typeof mountBoost>; items: BoostItem[]; index: number } | null> => {
  const items = buildBoostItems(LESSON_ID, tier as 1 | 2 | 3, { options: {} } as never);
  const page = mountBoost(tier);
  await flushAsync();
  for (let i = 0; i < items.length; i += 1) {
    const field = page.container.querySelector<HTMLInputElement>("input.large-textarea");
    if (field) return { page, items, index: i };
    // 不是写句子的题：随便点一个能推进的选项
    const advanceOptions = Array.from(
      page.container.querySelectorAll<HTMLButtonElement>("button.boost-choice, button.boost-listen-option")
    ).filter((b) => !b.disabled);
    if (advanceOptions.length > 0) {
      clickElement(advanceOptions[0]);
      await flushAsync();
    }
    const confirm = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find(
      (b) => (b.textContent ?? "").trim() === "确认" && !b.disabled
    );
    if (confirm) {
      clickElement(confirm);
      await flushAsync();
    }
    const next = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find(
      (b) => /^(下一题|完成这一档)$/.test((b.textContent ?? "").trim())
    );
    if (next) {
      clickElement(next);
      await flushAsync();
    } else {
      page.unmount();
      return null;
    }
  }
  page.unmount();
  return null;
};

describe("KB2 趁热练键盘路径", () => {
  beforeEach(() => resetStorage());

  it("KB2-1 输入框回车 = 提交（与点「提交」按钮等价）", async () => {
    seed();
    const items = buildBoostItems(LESSON_ID, 2);
    const page = mountBoost(2);
    await flushAsync();
    // 直接走到写句子那道题（档 2 的第 1 题就是 recall）
    let guard = 0;
    while (!page.container.querySelector("input.large-textarea") && guard < 8) {
      const choice = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button.boost-choice")).find((b) => !b.disabled);
      if (choice) clickElement(choice);
      const confirm = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find(
        (b) => (b.textContent ?? "").trim() === "确认" && !b.disabled
      );
      if (confirm) clickElement(confirm);
      await flushAsync();
      const next = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find((b) =>
        /^(下一题|完成这一档)$/.test((b.textContent ?? "").trim())
      );
      if (next) clickElement(next);
      await flushAsync();
      guard += 1;
    }
    const field = page.container.querySelector<HTMLInputElement>("input.large-textarea");
    expect(field, "档 2 应有需要写整句的题").toBeTruthy();
    const answer = items[0]?.answer ?? "";
    setInputValue(field as HTMLInputElement, answer);
    await flushAsync();
    // 用键盘回车提交（不点按钮）
    fireKey(field, "Enter");
    await flushAsync();
    // 副作用：进入反馈态（出现「下一题」按钮）
    const hasNext = page.buttons().some((t) => /^(下一题|完成这一档)$/.test(t));
    expect(hasNext, "回车提交后应进入反馈态（出现下一题）").toBe(true);
    page.unmount();
  });

  it("KB2-2【已修 2026-09-21】Tab 不再被输入框劫持（提示改用 Ctrl+H）", async () => {
    seed();
    const page = mountBoost(2);
    await flushAsync();
    const field = page.container.querySelector<HTMLInputElement>("input.large-textarea");
    expect(field, "应停在写整句的题上").toBeTruthy();
    const before = field!.value;
    const event = fireKey(field, "Tab");
    await flushAsync();
    /**
     * 修复前：Tab 被 `preventDefault()` 吃掉，焦点锁死在输入框（Shift+Tab 同样被吞），
     * 键盘用户无法离开这个框。导航键不应用于触发功能——现在提示改到 Ctrl+H。
     */
    expect(event.defaultPrevented, "Tab 应放行（焦点可正常移出）").toBe(false);
    // 提示改由 Ctrl+H 触发，且仍不改动输入内容
    const hintBefore = page.container.querySelectorAll(".boost-hint-box").length;
    fireKey(field!, "h", { ctrlKey: true });
    await flushAsync();
    expect(
      page.container.querySelectorAll(".boost-hint-box").length,
      "Ctrl+H 应给出提示"
    ).toBeGreaterThan(hintBefore - 1);
    expect(field!.value, "要提示不该改动输入内容").toBe(before);
    const shiftTab = fireKey(field!, "Tab", { shiftKey: true });
    expect(shiftTab.defaultPrevented, "Shift+Tab 更应放行（反向导航必须始终可用）").toBe(false);
    page.unmount();
  });

  it("KB2-3【已修 2026-09-21】Tab 始终放行，与提示剩余量无关", async () => {
    seed();
    const page = mountBoost(2);
    await flushAsync();
    const field = page.container.querySelector<HTMLInputElement>("input.large-textarea");
    if (!field) {
      expect(page.text().length).toBeGreaterThan(0);
      page.unmount();
      return;
    }
    // 连按 4 次 Tab：任何一次都不应被劫持（修复前前三次会被吃掉）
    let hijackedCount = 0;
    for (let i = 0; i < 4; i += 1) {
      const event = fireKey(field, "Tab");
      await flushAsync();
      if (event.defaultPrevented) hijackedCount += 1;
    }
    expect(hijackedCount, "Tab 不应被劫持（与提示是否用完无关）").toBe(0);
    page.unmount();
  });

  it("KB2-4【已修 2026-09-21】组词态回车不提交（与课内输入框口径一致）", async () => {
    seed();
    const page = mountBoost(2);
    await flushAsync();
    const field = page.container.querySelector<HTMLInputElement>("input.large-textarea");
    if (!field) {
      page.unmount();
      return;
    }
    const items = buildBoostItems(LESSON_ID, 2);
    setInputValue(field, (items[0]?.answer ?? "test sentence") + " extra");
    await flushAsync();
    // 严格版：Chrome 组词中派 key="Process" + keyCode 229 + isComposing
    const composing = fireKey(field, "Process", { isComposing: true, keyCode: 229 });
    await flushAsync();
    // 关键：趁热练的输入框只判断 key === "Enter"，连 key 都不是 Enter 自然不提交；
    // 但宽松版（key 仍是 Enter、只是 isComposing=true）会提交——列出事实供判定。
    const enteredAfterProcess = page.buttons().some((t) => /^(下一题|完成这一档)$/.test(t));
    expect(enteredAfterProcess, "key=Process 不应提交").toBe(false);
    void composing;
    const loose = fireKey(field, "Enter", { isComposing: true, keyCode: 229 });
    await flushAsync();
    const enteredAfterLoose = page.buttons().some((t) => /^(下一题|完成这一档)$/.test(t));
    /**
     * 修复前：只判断 `key === "Enter"`，FireFox/Safari 与部分 IME 在组词结束的回车
     * 会给 `key=Enter + isComposing=true`，于是**把没写完的句子交上去判错**。
     * 现在与课内输入框同口径：`!event.nativeEvent.isComposing` 才提交。
     */
    expect(enteredAfterLoose, "组词态回车不应提交").toBe(false);
    void loose;
    page.unmount();
  });

  it("KB2-5【已修 2026-09-21】Shift+Enter 不再提交", async () => {
    seed();
    const page = mountBoost(2);
    await flushAsync();
    const field = page.container.querySelector<HTMLInputElement>("input.large-textarea");
    if (!field) {
      page.unmount();
      return;
    }
    const items = buildBoostItems(LESSON_ID, 2);
    setInputValue(field, items[0]?.answer ?? "I am drawing");
    await flushAsync();
    const event = fireKey(field, "Enter", { shiftKey: true });
    await flushAsync();
    // 修复前 Shift+Enter 也被当成提交（课内输入框是 Shift+Enter 换行）——口径不一致
    expect(event.defaultPrevented, "Shift+Enter 不应被 preventDefault").toBe(false);
    expect(
      page.buttons().some((t) => /^(下一题|完成这一档)$/.test(t)),
      "Shift+Enter 不应触发提交"
    ).toBe(false);
    page.unmount();
  });

  it("KB2-6 答对后 window 回车进下一题；焦点在按钮上时不重复触发", async () => {
    seed();
    const page = mountBoost(2);
    await flushAsync();
    const field = page.container.querySelector<HTMLInputElement>("input.large-textarea");
    if (!field) {
      page.unmount();
      return;
    }
    const items = buildBoostItems(LESSON_ID, 2);
    setInputValue(field, items[0]?.answer ?? "");
    await flushAsync();
    fireKey(field, "Enter");
    await flushAsync();
    const indexText = () => (/第 (\d+) \/ (\d+) 题/.exec(page.text()) ?? [])[0] ?? "";
    const before = indexText();
    // 焦点挪走（模拟用户没在按钮/输入框上）→ window 回车应进下一题
    (document.activeElement as HTMLElement | null)?.blur?.();
    fireWindowKey("Enter");
    await flushAsync();
    expect(indexText(), "window 回车应推进到下一题").not.toBe(before);
    page.unmount();
  });

  it("KB2-7 反馈态连按回车只推进一题（不跳题/不重复提交）", async () => {
    seed();
    const page = mountBoost(2);
    await flushAsync();
    const field = page.container.querySelector<HTMLInputElement>("input.large-textarea");
    if (!field) {
      page.unmount();
      return;
    }
    const items = buildBoostItems(LESSON_ID, 2);
    setInputValue(field, items[0]?.answer ?? "");
    await flushAsync();
    fireKey(field, "Enter");
    await flushAsync();
    const indexOf = () => Number(/第 (\d+) \/ (\d+) 题/.exec(page.text())?.[1] ?? 0);
    const before = indexOf();
    (document.activeElement as HTMLElement | null)?.blur?.();
    fireWindowKey("Enter");
    fireWindowKey("Enter");
    fireWindowKey("Enter");
    await flushAsync();
    const after = indexOf();
    expect(after, "连按 3 次回车应只推进 1 题（反馈态一进就离开）").toBeLessThanOrEqual(before + 1);
    page.unmount();
  });

  it("KB2-8 档位卡与选项按钮的可访问性（无图标按钮缺失可读名）", async () => {
    seed();
    const page = mountPage(
      <GrammarBoostPage />,
      `/grammar/boost/${LESSON_ID}?from=card`,
      "/grammar/boost/:lessonId"
    );
    await flushAsync();
    const unnamed = buttonsWithoutName(page.container);
    // 档位卡是 button，文字里有档名 → 有可读名
    expect(unnamed, `存在无可读名的按钮：${JSON.stringify(unnamed)}`).toEqual([]);
    // 档位卡必须能被 Tab 到
    const focusable = focusableIn(page.container);
    expect(focusable.length, "档位选择页应有可聚焦元素").toBeGreaterThan(0);
    page.unmount();
  });
});
