import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  /** R02：影响范围明细（如"将覆盖 N 张卡片"对比表），渲染在 message 与按钮之间。 */
  details?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 确认按钮色调，默认 danger（破坏性操作）。 */
  confirmTone?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  details,
  confirmLabel = "确认删除",
  cancelLabel = "取消",
  confirmTone = "danger",
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  /** 打开前持有焦点的元素——关闭时归还给它（2026-09-21 补）。 */
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  /** 被本组件临时置为 inert 的背景元素，关闭时还原。 */
  const inertedRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!open) return;
    /**
     * 关闭后把焦点还给触发元素（2026-09-21 修，P0 无障碍）。
     *
     * 此前打开时聚焦「取消」、Escape 能关，但**关闭后焦点落到 <body>**——
     * 键盘用户按 Escape 取消之后，要从页面开头重新 Tab 一遍才能回到原处。
     * 记录打开前的 activeElement，卸载时还原（原元素已不在 DOM 里就不还原）。
     */
    previouslyFocusedRef.current = (document.activeElement as HTMLElement | null) ?? null;
    cancelButtonRef.current?.focus();

    /**
     * 背景 inert（2026-09-21 补）：把遮罩之外的**同层兄弟**标成 inert。
     *
     * 只做 Tab 循环还不够——鼠标点击与程序的 `.focus()` 仍能落到背景元素上，
     * 读屏器的浏览光标也照样能读到背后内容。`inert` 一次性解决全部三条
     * （不可聚焦、不可点、对辅助技术隐藏）。
     * 作用范围限定为「遮罩的父节点的其它子节点」，也就是这个弹窗所在的整页内容。
     */
    const overlay = overlayRef.current;
    const parent = overlay?.parentElement;
    if (overlay && parent) {
      const siblings = Array.from(parent.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement && child !== overlay
      );
      for (const sibling of siblings) {
        if (!sibling.hasAttribute("inert")) {
          sibling.setAttribute("inert", "");
          inertedRef.current.push(sibling);
        }
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
        return;
      }
      /**
       * 简易 focus trap（2026-09-21 补）：Tab / Shift+Tab 在对话框内循环。
       * 与上面的 inert 互为兜底——inert 在部分旧浏览器里不被支持。
       */
      if (event.key !== "Tab") return;
      const focusables = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = Boolean(active && dialogRef.current?.contains(active));
      if (event.shiftKey && (active === first || !inside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !inside)) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // 还原背景（必须在归还焦点之前，否则目标元素还处于 inert 状态、focus() 无效）
      for (const element of inertedRef.current) element.removeAttribute("inert");
      inertedRef.current = [];
      // 归还焦点：只在原元素仍在文档里时还原，避免聚焦到已卸载的节点
      const target = previouslyFocusedRef.current;
      if (target && document.contains(target)) target.focus();
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div ref={overlayRef} className="confirm-overlay" role="presentation" onClick={onCancel}>
      <div
        ref={dialogRef}
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirm-dialog-icon">
          <AlertTriangle size={20} />
        </div>
        <h2>{title}</h2>
        <p>{message}</p>
        {details}
        <div className="confirm-dialog-actions">
          <button ref={cancelButtonRef} type="button" className="secondary-button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={confirmTone === "primary" ? "primary-button" : "danger-button"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
