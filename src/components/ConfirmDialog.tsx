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

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    cancelButtonRef.current?.focus();
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="confirm-overlay" role="presentation" onClick={onCancel}>
      <div
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
