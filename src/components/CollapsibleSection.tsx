import { ChevronDown } from "lucide-react";
import { ReactNode, useId, useState } from "react";

// R6：通用折叠区（项目首次泛化，此前各页就地 useState + aria-expanded）。
// header 为 button + aria-expanded；折叠态只显示 header 行 + summary；
// prefers-reduced-motion 下跳过展开动画（见 styles.css 同名媒体查询惯例）。
interface CollapsibleSectionProps {
  eyebrow: string; // 如 "Report"
  title: ReactNode; // 区标题（含 icon）
  summary?: ReactNode; // 折叠态显示的一行摘要（如 KPI 关键数）
  defaultOpen: boolean;
  children: ReactNode;
}

export default function CollapsibleSection({ eyebrow, title, summary, defaultOpen, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();

  return (
    <section className={`collapsible-section${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="collapsible-section-head"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((value) => !value)}
      >
        <div className="collapsible-section-title">
          <span className="eyebrow">{eyebrow}</span>
          <h3>{title}</h3>
        </div>
        {!open && summary ? <div className="collapsible-section-summary">{summary}</div> : null}
        <ChevronDown size={16} className="collapsible-section-chevron" aria-hidden="true" />
      </button>
      {open ? (
        <div className="collapsible-section-body" id={bodyId}>
          {children}
        </div>
      ) : null}
    </section>
  );
}
