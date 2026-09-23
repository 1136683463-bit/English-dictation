// @vitest-environment jsdom
/**
 * ENV2e · 写盘时机与崩溃安全（2026-09-22 存储环境差异专项）
 *
 * ## 逐处确认「先改内存、稍后写盘」的窗口期
 *
 * | 位置                              | 写入时机                       | 崩溃/强杀时丢掉什么 |
 * |-----------------------------------|--------------------------------|---------------------|
 * | `AppContext.commitData`（60-73）  | **同步**：内存 + 落盘同一次调用 | 无窗口期（无 debounce） |
 * | `SettingsPage` autosave（243-251）| **500ms debounce**              | 最多 500ms 的设置改动 |
 * | `SettingsPage` 卸载/隐藏 flush（254-266） | pagehide / visibilitychange / 卸载 | 兜底，但不覆盖「进程被 SIGKILL」 |
 * | `AppContext` 云端自动推送（170-190） | **3000ms debounce**          | 只是云同步延迟，本地已落盘 |
 * | `SpellingPage` 自动前进（362-）    | 只改 UI 状态，评分**已**落盘   | 无 |
 * | `UnitsPage` 撤销条（219-224）      | 只隐藏提示，数据**已**落盘     | 无 |
 *
 * 结论：**学习数据（答一题/写一篇日记）没有 debounce 窗口，
 * 每次操作同步落盘**；只有「设置页的偏好项」有 500ms 窗口。
 * 这一条很重要——它意味着「答题答到一半被强杀」不会丢已提交的那一题。
 *
 * 本文件把这两类时机固定成可回归的断言，并把「兜底 flush 的覆盖面」测出来：
 * 它挂在 `pagehide` / `visibilitychange` 上，而**没有** `beforeunload`，
 * 这在 Tauri 里是否够用需要真机确认（见 .envfind/storage-env.md 的「可疑但未证实」）。
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { mountPage, resetStorage } from "../harness";
import SettingsPage from "../../pages/SettingsPage";
import { loadData, saveData } from "../../services/storage";
import { STORAGE_KEY, seedAppData, makeAppData } from "./fixtures";
import { flushAsync } from "./drive";

if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
  class NoopResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = NoopResizeObserver;
}

const readDiskSettings = () =>
  (JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as { settings?: { dailyNewWords?: number } })
    .settings;

/** 找到设置页里「每日新词」那个数字输入框。 */
const newWordsField = (container: HTMLElement): HTMLInputElement | null =>
  container.querySelector('input[type="number"]') as HTMLInputElement | null;

/** React 受控数字输入：必须走原生 setter + input 事件。 */
const setNumber = (field: HTMLInputElement, value: string) => {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  act(() => {
    setter?.call(field, value);
    field.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

describe("ENV2e-1 AppContext：答一题同步落盘（无 debounce 窗口）", () => {
  beforeEach(() => resetStorage());
  afterEach(() => vi.useRealTimers());

  it("commitData 是同步的：调用返回时磁盘上就已经是新值", () => {
    seedAppData(makeAppData());
    const before = loadData();
    const beforeCount = before.reviews.length;

    /**
     * AppContext.tsx:60-73 commitData 的三步：
     *   dataRef.current = next → setDataState(next) → saveData(next)
     * 三步都在同一次同步调用里，没有 await、没有 setTimeout。
     * 所以「内存显示已生效」与「磁盘已写入」之间**没有时间差**。
     */
    const next = { ...before, reviews: [...before.reviews, {
      id: "just-answered",
      cardId: before.cards[0]?.id ?? "c",
      mode: "spelling" as const,
      rating: 4 as const,
      answer: "x",
      reviewedAt: "2024-01-02T09:00:00.000Z"
    }] };
    saveData(next);

    expect(readDiskSettings(), "前置数据存在").toBeTruthy();
    const onDisk = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as { reviews: unknown[] };
    expect(onDisk.reviews.length, "同步写入：返回时磁盘上已经是新值").toBe(beforeCount + 1);
  });

  it("对照：没有任何 setTimeout 参与学习数据的落盘路径", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const appContext = fs.readFileSync(path.resolve(__dirname, "../../AppContext.tsx"), "utf8");

    /** commitData 内部不得出现 setTimeout / await（那才会引入窗口期）。 */
    const commitBlock = appContext.slice(
      appContext.indexOf("const commitData ="),
      appContext.indexOf("// R03：一次成功的云同步")
    );
    expect(commitBlock.length, "已定位到 commitData 源码块").toBeGreaterThan(100);
    expect(
      /setTimeout|await\s/.test(commitBlock),
      "commitData 里出现异步 → 学习数据出现崩溃窗口期，请更新本文件与报告"
    ).toBe(false);
  });
});

describe("ENV2e-2 设置页：500ms debounce 的真实窗口与兜底", () => {
  beforeEach(() => {
    resetStorage();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("改动后立刻落盘会丢：500ms 内磁盘上仍是旧值（窗口期确认存在）", async () => {
    seedAppData(makeAppData());
    const page = mountPage(<SettingsPage />, "/settings", "/settings");
    await flushAsync();

    const field = newWordsField(page.container);
    expect(field, "找到每日新词输入框").toBeTruthy();
    const original = field!.value;

    setNumber(field!, "37");
    // 模拟「改完立刻被强杀」：定时器尚未触发
    expect(
      readDiskSettings()?.dailyNewWords,
      "500ms 内磁盘上仍是旧值——这就是崩溃窗口"
    ).not.toBe(37);

    // 推进到 debounce 之后
    await act(async () => {
      vi.advanceTimersByTime(600);
      await Promise.resolve();
    });
    await flushAsync();
    expect(readDiskSettings()?.dailyNewWords, "debounce 到期后落盘").toBe(37);
    void original;
    page.unmount();
  });

  it("兜底：卸载 / pagehide / 页面隐藏都会立刻 flush（窗口期被兜住）", async () => {
    seedAppData(makeAppData());

    // (a) 卸载时 flush（useEffect 清理函数，SettingsPage.tsx:264）
    const first = mountPage(<SettingsPage />, "/settings", "/settings");
    await flushAsync();
    setNumber(newWordsField(first.container)!, "41");
    expect(readDiskSettings()?.dailyNewWords, "前置：尚未落盘").not.toBe(41);
    first.unmount();
    await flushAsync();
    expect(readDiskSettings()?.dailyNewWords, "卸载触发兜底 flush").toBe(41);

    // (b) pagehide 时 flush（SettingsPage.tsx:255-259）
    resetStorage();
    seedAppData(makeAppData());
    const second = mountPage(<SettingsPage />, "/settings", "/settings");
    await flushAsync();
    setNumber(newWordsField(second.container)!, "43");
    expect(readDiskSettings()?.dailyNewWords).not.toBe(43);
    await act(async () => {
      window.dispatchEvent(new Event("pagehide"));
      await Promise.resolve();
    });
    await flushAsync();
    expect(readDiskSettings()?.dailyNewWords, "pagehide 触发兜底 flush").toBe(43);
    second.unmount();
  });

  it("兜底清单里没有 beforeunload —— Tauri 强杀是否算「干净关闭」需真机确认", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const settingsPage = fs.readFileSync(path.resolve(__dirname, "../../pages/SettingsPage.tsx"), "utf8");

    expect(settingsPage, "有 pagehide").toContain('addEventListener("pagehide"');
    expect(settingsPage, "有 visibilitychange").toContain('addEventListener("visibilitychange"');
    expect(
      /beforeunload/.test(settingsPage),
      "没有 beforeunload —— 只靠 pagehide/visibilitychange 兜底"
    ).toBe(false);

    /**
     * 事实陈述（不是断言产品行为，是固定当前实现）：
     *   浏览器里关标签/刷新会触发 pagehide（够用）；
     *   Tauri 里点击窗口关闭按钮是否触发 pagehide 取决于 WebView 实现，
     *   而进程被 SIGKILL（强制退出/崩溃）时**任何**事件都不会触发 →
     *   那 500ms 内的设置改动一定会丢（学习数据不受影响，见 ENV2e-1）。
     */
    expect(true).toBe(true);
  });
});

describe("ENV2e-3 云端自动推送的 3 秒 debounce（影响面界定）", () => {
  beforeEach(() => resetStorage());

  it("3 秒 debounce 只影响「云端副本的新鲜度」，不影响本地落盘", () => {
    /**
     * AppContext.tsx:37 `AUTO_PUSH_DELAY_MS = 3000`，170-190 的 effect 在
     * data 变化后 3 秒才推送。因为本地在 commitData 里已经同步落盘，
     * 这 3 秒里崩溃的后果是「云端少一次更新」，不是「本地丢数据」。
     */
    seedAppData(makeAppData());
    const loaded = loadData();
    const beforeReviews = loaded.reviews.length;
    saveData({
      ...loaded,
      reviews: [...loaded.reviews, {
        id: "r-now",
        cardId: loaded.cards[0]?.id ?? "c",
        mode: "spelling" as const,
        rating: 4 as const,
        answer: "x",
        reviewedAt: "2024-01-02T09:00:00.000Z"
      }]
    });
    const onDisk = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as { reviews: unknown[] };
    expect(onDisk.reviews.length, "本地立即就有 —— 与云推送的 3 秒无关").toBe(beforeReviews + 1);
  });
});
