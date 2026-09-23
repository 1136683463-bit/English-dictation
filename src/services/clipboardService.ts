/**
 * 剪贴板写入的跨环境封装（2026-09-22 第 9 轮）。
 *
 * 直接用 `navigator.clipboard.writeText` 有三个环境陷阱：
 *
 * ① **非安全上下文下整个 API 不存在**。`navigator.clipboard` 只在
 *    「安全上下文」里被定义：https、localhost、以及 Tauri 的本地 scheme 算安全，
 *    但用户用 `http://192.168.x.x` 或局域网主机名打开网页版时**它不是 undefined**，
 *    而是**根本不存在**——`navigator.clipboard.writeText` 直接抛 TypeError。
 *
 * ② **返回的是 Promise，会 reject**。权限被拒（部分浏览器在非用户手势、
 *    或窗口失焦时拒绝）会 reject，不 catch 就是 unhandled rejection。
 *
 * ③ **Tauri 桌面端的差异**。macOS 的 WKWebView 剪贴板默认可用
 *    （wry 的 `clipboard` 开关只作用于 Linux/Windows，见 wry lib.rs:702）；
 *    而 Linux/Windows 的 WebView 需要在 Rust 侧开 `with_clipboard(true)`，
 *    本应用没有开。所以桌面端「网页里复制」是**可能失败**的真实路径。
 *
 * 本模块统一成 `Promise<boolean>`：调用方据此决定要不要显示成功对勾，
 * 而不是在失败时也告诉用户「复制好了」。
 */

/**
 * 回退方案：`document.execCommand("copy")`。
 *
 * 已废弃但在所有仍在维护的浏览器里都能工作，且**不要求安全上下文**——
 * 这正是它能补上 `navigator.clipboard` 缺失场景的原因。
 * 需要一个能接收选区的元素，所以临时插一个不可见的 textarea。
 */
const copyViaExecCommand = (text: string): boolean => {
  if (typeof document === "undefined" || typeof document.execCommand !== "function") return false;

  const textarea = document.createElement("textarea");
  textarea.value = text;
  // 不能 display:none / visibility:hidden —— 那样无法被选中。
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);

  const selection = typeof window !== "undefined" ? window.getSelection() : null;
  const previousRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  try {
    textarea.select();
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
    // 还原用户原有的选区，避免复制动作把用户正在编辑的选中范围吃掉。
    if (selection && previousRange) {
      selection.removeAllRanges();
      selection.addRange(previousRange);
    }
  }
};

/**
 * 把文本写进系统剪贴板。成功返回 `true`；返回 `false` 时**必须**让用户看到
 * 替代路径（手动选中复制），不能显示成功反馈。
 */
export const writeToClipboard = async (text: string): Promise<boolean> => {
  const clipboard = typeof navigator !== "undefined"
    ? (navigator as Navigator & { clipboard?: Clipboard }).clipboard
    : undefined;

  if (clipboard && typeof clipboard.writeText === "function") {
    try {
      await clipboard.writeText(text);
      return true;
    } catch {
      // 权限被拒或窗口失焦：落到下面的回退方案，而不是直接放弃。
    }
  }

  return copyViaExecCommand(text);
};
