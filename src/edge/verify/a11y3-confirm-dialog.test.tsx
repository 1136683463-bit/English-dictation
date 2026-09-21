// @vitest-environment jsdom
/**
 * A11Y-3 · ConfirmDialog 焦点管理逐条验证
 *
 * 六条：
 *  1. 打开时焦点进入对话框（作者实现为「聚焦取消按钮」）
 *  2. Escape 关闭
 *  3. 关闭后焦点**归还给触发元素**（WAI-ARIA APG 对 dialog 的明确要求）
 *  4. focus trap：Tab 不跑到背后的页面
 *  5. role / aria-modal / 可读名
 *  6. 点击遮罩关闭
 *
 * 驱动方式：走真实 UI（LibraryPage 的批量操作 → 确认弹窗），
 * 而不是直接渲染 ConfirmDialog——这样能同时验证「触发元素」这一环。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage, type Mounted } from "../harness";
import { cardsToData, makeSentenceCard, seedAppData } from "./fixtures";
import { clickElement, flushAsync } from "./drive";
import LibraryPage from "../../pages/LibraryPage";

if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
  class NoopResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = NoopResizeObserver;
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = NoopResizeObserver;
}

const buttonsOf = (page: Mounted): HTMLButtonElement[] =>
  Array.from(page.container.querySelectorAll<HTMLButtonElement>("button"));

const enabledByText = (page: Mounted, re: RegExp): HTMLButtonElement | undefined =>
  buttonsOf(page).find((b) => !b.disabled && re.test((b.textContent ?? "").trim()));

const dialogOf = (page: Mounted): HTMLElement | null =>
  page.container.querySelector<HTMLElement>('[role="alertdialog"], [role="dialog"]');

const focusLabel = (): string => {
  const el = document.activeElement as HTMLElement | null;
  if (!el || el === document.body) return "BODY";
  return `${el.tagName}.${(el.className || "").toString().split(" ").slice(0, 2).join(".")}["${(el.textContent ?? "")
    .trim()
    .slice(0, 20)}"]`;
};

/** 派发 keydown 到 window（ConfirmDialog 的 Escape 监听挂在 window 上）。 */
const pressEscape = async (): Promise<void> => {
  const { act } = await import("react");
  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
  });
};

/** 派发 Tab 到当前 activeElement，返回是否被 preventDefault（说明有 trap）。 */
const pressTab = async (shift = false): Promise<{ prevented: boolean }> => {
  const { act } = await import("react");
  let prevented = false;
  act(() => {
    const target = (document.activeElement as HTMLElement) ?? document.body;
    const event = new KeyboardEvent("keydown", { key: "Tab", shiftKey: shift, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    prevented = event.defaultPrevented;
  });
  return { prevented };
};

/** 打开 LibraryPage 的批量删除确认弹窗，返回触发按钮。 */
const openBulkDeleteDialog = async (page: Mounted): Promise<HTMLButtonElement | null> => {
  await flushAsync();
  // 进入批量选择模式
  const selectMode = enabledByText(page, /批量|选择|多选/);
  if (selectMode) {
    clickElement(selectMode);
    await flushAsync();
  }
  // 选中一张卡
  const item = page.container.querySelector<HTMLElement>(".library-item");
  if (item) {
    clickElement(item);
    await flushAsync();
  }
  // 找删除按钮
  const del = enabledByText(page, /删除/);
  if (!del) return null;
  (del as HTMLElement).focus();
  clickElement(del);
  await flushAsync();
  return del;
};

describe("A11Y-3 ConfirmDialog 焦点管理", () => {
  beforeEach(() => resetStorage());

  it("打开时焦点进入对话框（聚焦取消按钮）", async () => {
    seedAppData(cardsToData([makeSentenceCard({ id: "s1", sentence: "I am drawing a picture." })]));
    const page = mountPage(<LibraryPage />, "/library", "/library");
    const trigger = await openBulkDeleteDialog(page);
    if (!trigger) {
      // eslint-disable-next-line no-console
      console.log("[ConfirmDialog] 未能走到批量删除弹窗；按钮清单=", page.buttons());
      page.unmount();
      return;
    }
    const dialog = dialogOf(page);
    expect(dialog, "应出现对话框").toBeTruthy();
    const focusInside = Boolean(dialog!.contains(document.activeElement));
    // eslint-disable-next-line no-console
    console.log(`[ConfirmDialog] 打开后焦点=${focusLabel()} 在对话框内=${focusInside}`);
    expect(focusInside, `打开后焦点应进入对话框，实际落点=${focusLabel()}`).toBe(true);
    page.unmount();
  });

  it("Escape 关闭对话框", async () => {
    seedAppData(cardsToData([makeSentenceCard({ id: "s1", sentence: "I am drawing a picture." })]));
    const page = mountPage(<LibraryPage />, "/library", "/library");
    const trigger = await openBulkDeleteDialog(page);
    if (!trigger) {
      // eslint-disable-next-line no-console
      console.log("[ConfirmDialog] 未能走到批量删除弹窗（Escape 用例跳过）");
      page.unmount();
      return;
    }
    expect(dialogOf(page), "弹窗应先打开").toBeTruthy();
    await pressEscape();
    await flushAsync();
    const stillOpen = Boolean(dialogOf(page));
    // eslint-disable-next-line no-console
    console.log(`[ConfirmDialog] Escape 后弹窗仍在=${stillOpen}`);
    expect(stillOpen, "Escape 应关闭对话框").toBe(false);
    page.unmount();
  });

  it("关闭后焦点归还给触发元素（APG 要求）", async () => {
    seedAppData(cardsToData([makeSentenceCard({ id: "s1", sentence: "I am drawing a picture." })]));
    const page = mountPage(<LibraryPage />, "/library", "/library");
    const trigger = await openBulkDeleteDialog(page);
    if (!trigger) {
      // eslint-disable-next-line no-console
      console.log("[ConfirmDialog] 未能走到批量删除弹窗（焦点归还用例跳过）");
      page.unmount();
      return;
    }
    const triggerLabel = (trigger.textContent ?? "").trim();
    await pressEscape();
    await flushAsync();
    const restored = document.activeElement;
    const restoredLabel = (restored?.textContent ?? "").trim();
    // eslint-disable-next-line no-console
    console.log(
      `[ConfirmDialog] 触发元素="${triggerLabel}" 关闭后焦点=${focusLabel()} 是触发元素吗=${restored === trigger}`
    );
    expect(restored, `关闭后焦点应归还给触发元素「${triggerLabel}」，实际=${focusLabel()}`).toBe(trigger);
    expect(restoredLabel).toBe(triggerLabel);
    page.unmount();
  });

  it("focus trap：Tab 不会跑到背后页面（对话框打开时只有对话框内元素可 Tab）", async () => {
    seedAppData(cardsToData([makeSentenceCard({ id: "s1", sentence: "I am drawing a picture." })]));
    const page = mountPage(<LibraryPage />, "/library", "/library");
    const trigger = await openBulkDeleteDialog(page);
    if (!trigger) {
      // eslint-disable-next-line no-console
      console.log("[ConfirmDialog] 未能走到批量删除弹窗（trap 用例跳过）");
      page.unmount();
      return;
    }
    const dialog = dialogOf(page)!;
    const dialogButtons = Array.from(dialog.querySelectorAll<HTMLButtonElement>("button"));
    const tabbables = Array.from(
      page.container.querySelectorAll<HTMLElement>(
        'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )
    );
    const outsideFocusable = tabbables.filter(
      (el) => !dialog.contains(el) && !el.hasAttribute("inert") && !el.closest("[inert]")
    );
    const hiddenFromAt = outsideFocusable.filter((el) => el.getAttribute("aria-hidden") === "true");
    // eslint-disable-next-line no-console
    console.log(
      `[ConfirmDialog] 对话框内可聚焦=${dialogButtons.length} 个；背景 tabbable=${outsideFocusable.length} 个；` +
        `背景中被 aria-hidden/inert 屏蔽的=${hiddenFromAt.length} 个；` +
        `container 内有 inert=${Boolean(page.container.querySelector("[inert]"))}`
    );

    /*
     * jsdom 不实现原生 Tab 顺序（keydown Tab 不会移动焦点），所以「连按 Tab 看焦点是否离开」
     * 在这里恒为「没离开」，**不能**作为有 trap 的证据。
     * 可验证的替代证据：对话框打开期间，背景元素是否**还能**被聚焦。
     * 若实现里有 focus trap（或对背景加 inert / aria-hidden），则背景元素
     * 不应再接受焦点。
     */
    const probeTargets = outsideFocusable.filter((el) => el.tagName === "BUTTON").slice(0, 5);
    const accepted: string[] = [];
    for (const el of probeTargets) {
      (el as HTMLElement).focus();
      if (document.activeElement === el) {
        accepted.push(`#${tabbables.indexOf(el) + 1}<${el.tagName}.${(el.className || "").toString().slice(0, 24)}>`);
      }
      dialog.querySelector<HTMLButtonElement>("button")?.focus();
    }
    // eslint-disable-next-line no-console
    console.log(
      `[ConfirmDialog] 对话框打开时，背景按钮仍能拿到焦点的=${accepted.length}/${probeTargets.length} 个：${accepted.join(" ")}`
    );
    expect(
      accepted,
      `对话框打开时背景仍有 ${accepted.length} 个按钮可以拿到焦点 —— 没有 focus trap，Tab/读屏可以走到背后页面`
    ).toEqual([]);
    page.unmount();
  });

  it("role / aria-modal / 可读名", async () => {
    seedAppData(cardsToData([makeSentenceCard({ id: "s1", sentence: "I am drawing a picture." })]));
    const page = mountPage(<LibraryPage />, "/library", "/library");
    const trigger = await openBulkDeleteDialog(page);
    if (!trigger) {
      // eslint-disable-next-line no-console
      console.log("[ConfirmDialog] 未能走到批量删除弹窗（语义用例跳过）");
      page.unmount();
      return;
    }
    const dialog = dialogOf(page)!;
    const role = dialog.getAttribute("role");
    const ariaModal = dialog.getAttribute("aria-modal");
    const ariaLabel = dialog.getAttribute("aria-label");
    const hasLabelledby = Boolean(dialog.getAttribute("aria-labelledby"));
    // eslint-disable-next-line no-console
    console.log(
      `[ConfirmDialog] role=${role} aria-modal=${ariaModal} aria-label="${ariaLabel}" aria-labelledby=${hasLabelledby}`
    );
    expect(role, "对话框应有 role=alertdialog 或 dialog").toMatch(/^(alertdialog|dialog)$/);
    expect(ariaModal, "对话框应有 aria-modal=true").toBe("true");
    expect(Boolean(ariaLabel || hasLabelledby), "对话框应有一个可读名").toBe(true);
    page.unmount();
  });

  it("点击遮罩关闭（并检查焦点去向）", async () => {
    seedAppData(cardsToData([makeSentenceCard({ id: "s1", sentence: "I am drawing a picture." })]));
    const page = mountPage(<LibraryPage />, "/library", "/library");
    const trigger = await openBulkDeleteDialog(page);
    if (!trigger) {
      // eslint-disable-next-line no-console
      console.log("[ConfirmDialog] 未能走到批量删除弹窗（遮罩用例跳过）");
      page.unmount();
      return;
    }
    const overlay = page.container.querySelector<HTMLElement>(".confirm-overlay");
    expect(overlay, "应有遮罩层 .confirm-overlay").toBeTruthy();
    clickElement(overlay!);
    await flushAsync();
    const closed = !dialogOf(page);
    // eslint-disable-next-line no-console
    console.log(`[ConfirmDialog] 点遮罩后关闭=${closed} 焦点=${focusLabel()}`);
    expect(closed, "点遮罩应关闭对话框").toBe(true);
    expect(document.activeElement, `点遮罩关闭后焦点应归还触发元素，实际=${focusLabel()}`).toBe(trigger);
    page.unmount();
  });
});
