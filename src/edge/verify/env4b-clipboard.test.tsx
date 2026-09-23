// @vitest-environment jsdom
/**
 * ENV4-B · 剪贴板写入的跨环境可用性（2026-09-22）
 *
 * ## 环境前提（这是「桌面能用、浏览器不能用」类问题的典型样本）
 *
 * `navigator.clipboard` 只在**安全上下文**里被定义：
 *   - https、`http://localhost`、`http://127.0.0.1`（含 `[::1]`）→ 有；
 *   - `http://192.168.x.x:1420`、`http://<主机名>:1420` → **根本没有这个对象**。
 * 本项目的浏览器入口是 `open-web.command` → `npm run dev -- --host 127.0.0.1`
 * 打开 `http://127.0.0.1:1420/`，正好落在安全上下文里，所以开发时不会暴露；
 * 但用户改成局域网地址分享/投屏时就会撞上。
 *
 * Tauri 侧的差异更大：wry 的 clipboard 开关只作用于 **Linux/Windows**
 * （wry lib.rs:702-706 的注释 + `webview2/mod.rs:497`、`webkitgtk/mod.rs:433`
 * 的实现），macOS(WKWebView) 不走这个开关；而 tauri-runtime 的
 * `WebviewAttributes::clipboard` 默认 `false`（tauri-runtime-2.11.3/src/webview.rs:516），
 * 本应用 `src-tauri/src/lib.rs` 未调用 `enable_clipboard_access()`
 * → **Windows / Linux 桌面端的「网页里复制」权限未开**，`writeText` 可能被拒。
 *
 * ## 当前状态（2026-09-22 第 9 轮修复后，本文件是回归护栏）
 *
 * 新增 `src/services/clipboardService.ts` 的 `writeToClipboard(text): Promise<boolean>`：
 *   1. 能力检测（`clipboard && typeof clipboard.writeText === "function"`）；
 *   2. `await writeText` 包 try/catch；
 *   3. 失败时回退到 `document.execCommand("copy")`（不需要安全上下文）。
 * `MistakeBookPage` 的复制按钮据此在失败时显示「没能复制到剪贴板，可以手动选中上面的文字复制。」
 * （role="alert"），而不是打对勾。
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mountPage, resetStorage } from "../harness";
import MistakeBookPage from "../../pages/MistakeBookPage";
import { cardsToData, makeAppData, makeSentenceCard, seedAppData } from "./fixtures";
import { todayKey } from "../huntDiaryEnv";
import { writeToClipboard } from "../../services/clipboardService";
import type { Review } from "../../types";

if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
  class NoopResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = NoopResizeObserver;
}

const withClipboard = (value: unknown) => {
  const had = Object.prototype.hasOwnProperty.call(navigator, "clipboard");
  const original = (navigator as unknown as { clipboard?: unknown }).clipboard;
  Object.defineProperty(navigator, "clipboard", { value, configurable: true, writable: true });
  return () => {
    if (had) {
      Object.defineProperty(navigator, "clipboard", {
        value: original,
        configurable: true,
        writable: true
      });
    } else {
      Reflect.deleteProperty(navigator as unknown as Record<string, unknown>, "clipboard");
    }
  };
};

/** 错词本页面：一条错误复习记录 + 一条已生成的错词故事（带「复制内容」按钮）。 */
const seedMistakePage = () => {
  const fixture = makeSentenceCard({ id: "c1", sentence: "I go to school." });
  const wrong = (id: string): Review =>
    ({ id, cardId: "c1", mode: "spelling", rating: 1, answer: "x", reviewedAt: new Date().toISOString() }) as Review;
  seedAppData(
    makeAppData({
      ...cardsToData([fixture]),
      reviews: [wrong("r1"), wrong("r2")],
      mistakeGenerations: [
        {
          id: "g1",
          dateKey: todayKey(),
          type: "story",
          cardIds: ["c1"],
          title: "今日错词故事",
          content: "A short story about school.",
          prompt: "p",
          createdAt: new Date().toISOString()
        }
      ]
    })
  );
};

const copyButtonOf = (container: HTMLElement) =>
  container.querySelector('button[aria-label="复制内容"]') as HTMLButtonElement | null;

/**
 * jsdom **既没有 navigator.clipboard，也没有 document.execCommand**
 * （`typeof document.execCommand === "undefined"`）。
 * 后者是 `clipboardService` 的降级路径，必须自己装上去才能观察；
 * 这也解释了为什么这条降级路径在既有测试里同样零覆盖。
 */
const installExecCommand = (result: boolean) => {
  const had = typeof (document as unknown as { execCommand?: unknown }).execCommand === "function";
  const original = (document as unknown as { execCommand?: unknown }).execCommand;
  const calls: string[] = [];
  (document as unknown as { execCommand: unknown }).execCommand = (command: string) => {
    calls.push(command);
    return result;
  };
  return {
    calls,
    restore: () => {
      if (had) {
        (document as unknown as { execCommand: unknown }).execCommand = original;
      } else {
        Reflect.deleteProperty(document as unknown as Record<string, unknown>, "execCommand");
      }
    }
  };
};

describe("ENV4-B① writeToClipboard 的行为契约", () => {
  it("clipboard 完全缺失 → 不抛错，返回 false（不再有 unhandled rejection）", async () => {
    const restore = withClipboard(undefined);
    const execCommand = installExecCommand(false);

    await expect(writeToClipboard("hello")).resolves.toBe(false);
    expect(execCommand.calls, "应尝试过降级路径").toEqual(["copy"]);

    execCommand.restore();
    restore();
  });

  it("clipboard 存在但 writeText 被拒 → 落到 execCommand 降级，仍不抛错", async () => {
    const restore = withClipboard({
      writeText: () => Promise.reject(new DOMException("Document is not focused.", "NotAllowedError"))
    });
    const execCommand = installExecCommand(true);

    await expect(writeToClipboard("hello")).resolves.toBe(true);
    expect(execCommand.calls, "降级路径救回来了").toEqual(["copy"]);

    execCommand.restore();
    restore();
  });

  it("clipboard 可用 → 走原生 API，不碰已废弃的 execCommand", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const restore = withClipboard({ writeText });
    const execCommand = installExecCommand(true);

    await expect(writeToClipboard("hello")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("hello");
    expect(execCommand.calls, "首选路径成功时不应使用降级方案").toEqual([]);

    execCommand.restore();
    restore();
  });

  it("clipboard 是半个对象（有对象无 writeText）时不炸：退到降级路径", async () => {
    const restore = withClipboard({});
    const execCommand = installExecCommand(false);
    await expect(writeToClipboard("hi")).resolves.toBe(false);
    execCommand.restore();
    restore();
  });
});

describe("ENV4-B② 错词本「复制内容」的失败可见性", () => {
  beforeEach(() => resetStorage());

  const captureRejections = () => {
    const seen: string[] = [];
    const handler = (event: PromiseRejectionEvent) => seen.push(String(event.reason));
    window.addEventListener("unhandledrejection", handler);
    return {
      seen,
      stop: () => window.removeEventListener("unhandledrejection", handler)
    };
  };

  it("★ 已修：clipboard 缺失且降级也失败时，页面给出可执行的替代路径", async () => {
    seedMistakePage();
    const restore = withClipboard(undefined);
    const execCommand = installExecCommand(false);
    const rejections = captureRejections();

    const page = mountPage(<MistakeBookPage />, "/mistakes", "/mistakes");
    const copy = copyButtonOf(page.container);
    expect(copy, "前置：生成卡有「复制内容」按钮").toBeTruthy();

    copy!.click();
    await new Promise((resolve) => setTimeout(resolve, 40));

    expect(rejections.seen, "不应再有 unhandled rejection").toEqual([]);
    expect(
      page.text(),
      "应提示「手动选中复制」这条替代路径，而不是静默或谎报成功"
    ).toMatch(/没能复制到剪贴板|手动选中/);
    expect(
      copy!.querySelector(".icon-swap")?.getAttribute("data-state"),
      "失败时不得切到对勾态"
    ).toBe("a");

    execCommand.restore();
    rejections.stop();
    restore();
    page.unmount();
  });

  it("★ 已修：writeText 被拒（权限/失焦）时同样给替代路径", async () => {
    seedMistakePage();
    const restore = withClipboard({
      writeText: () => Promise.reject(new DOMException("Document is not focused.", "NotAllowedError"))
    });
    const execCommand = installExecCommand(false);
    const rejections = captureRejections();

    const page = mountPage(<MistakeBookPage />, "/mistakes", "/mistakes");
    copyButtonOf(page.container)!.click();
    await new Promise((resolve) => setTimeout(resolve, 40));

    expect(rejections.seen).toEqual([]);
    expect(page.text()).toMatch(/没能复制到剪贴板|手动选中/);

    execCommand.restore();
    rejections.stop();
    restore();
    page.unmount();
  });

  it("成功路径：clipboard 可用时切到对勾态，不出现失败提示", async () => {
    seedMistakePage();
    const restore = withClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });

    const page = mountPage(<MistakeBookPage />, "/mistakes", "/mistakes");
    const copy = copyButtonOf(page.container)!;
    copy.click();
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(copy.querySelector(".icon-swap")?.getAttribute("data-state")).toBe("b");
    expect(page.text()).not.toMatch(/没能复制到剪贴板/);

    restore();
    page.unmount();
  });

  it("内容本身始终在 DOM 里——这是所有失败路径的最终兜底", async () => {
    seedMistakePage();
    const restore = withClipboard(undefined);
    const execCommand = installExecCommand(false);

    const page = mountPage(<MistakeBookPage />, "/mistakes", "/mistakes");
    copyButtonOf(page.container)!.click();
    await new Promise((resolve) => setTimeout(resolve, 40));

    expect(page.text(), "用户能手动选中这段文字").toContain("A short story about school.");

    execCommand.restore();
    restore();
    page.unmount();
  });
});

describe("ENV4-B③ 环境探针", () => {
  it("jsdom 里 navigator.clipboard 本来就缺 → 既有测试从未跑过复制成功路径", () => {
    expect(
      Navigator.prototype,
      "jsdom 的 Navigator 原型上没有 clipboard 定义"
    ).not.toHaveProperty("clipboard");
    expect(
      typeof (document as unknown as { execCommand?: unknown }).execCommand,
      "jsdom 连 document.execCommand 都没有 → 降级路径在既有测试里同样零覆盖（本文件手动装桩）"
    ).toBe("undefined");
  });
});
