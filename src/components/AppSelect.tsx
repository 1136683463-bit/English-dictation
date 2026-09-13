import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface AppSelectOption {
  value: string;
  label: string;
  /** 可选分组名：传入后选项按 group 分节展示，顺序按 groupOrder，缺省在末尾 */
  group?: string;
}

interface AppSelectProps {
  id?: string;
  options: AppSelectOption[];
  value: string;
  onChange: (value: string) => void;
  /** 触发器 aria-label；label 元素包裹时也可省略 */
  ariaLabel?: string;
  /** 未匹配到 value 时的占位文案 */
  placeholder?: string;
  /** 下拉列表 aria-label，缺省用 ariaLabel */
  listAriaLabel?: string;
  /** 分组显示顺序：未在列表中的组按出现顺序追加在末尾 */
  groupOrder?: string[];
  /** 触发器额外 className，用于尺寸/宽度微调 */
  className?: string;
  disabled?: boolean;
}

/**
 * 全局统一下拉组件（替换原生 <select>）：
 * 应用风格面板——可选分组、勾选选中项、限高滚动、键盘可达、视口不足自动向上展开。
 * 样式见 styles.css 中 `app-select` 系列（与 voice-picker 同源，voice-picker 是其别名）。
 */
export default function AppSelect({
  id,
  options,
  value,
  onChange,
  ariaLabel,
  placeholder = "请选择",
  listAriaLabel,
  groupOrder,
  className,
  disabled = false
}: AppSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropUp, setDropUp] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = options.find((option) => option.value === value);
  const currentIndex = options.findIndex((option) => option.value === value);

  // 分组：有 group 的选项按 groupOrder 排序分节，无 group 的选项单独作为"未分组"块置底
  const grouped = (() => {
    const ungrouped = options.filter((option) => !option.group);
    const byGroup = new Map<string, AppSelectOption[]>();
    for (const option of options) {
      if (!option.group) continue;
      const bucket = byGroup.get(option.group);
      if (bucket) bucket.push(option);
      else byGroup.set(option.group, [option]);
    }
    const orderedNames: string[] = [];
    if (groupOrder) {
      for (const name of groupOrder) {
        if (byGroup.has(name)) orderedNames.push(name);
      }
    }
    for (const name of byGroup.keys()) {
      if (!orderedNames.includes(name)) orderedNames.push(name);
    }
    const groups = orderedNames.map((name) => ({ name, items: byGroup.get(name) ?? [] }));
    if (ungrouped.length > 0) groups.push({ name: "", items: ungrouped });
    return groups;
  })();

  const hasGroups = grouped.some((group) => group.name !== "");

  const openList = () => {
    if (disabled) return;
    setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
    // 视口下方空间不足时向上展开，避免遮挡面板下方的控件
    const rect = rootRef.current?.getBoundingClientRect();
    if (rect) {
      setDropUp(window.innerHeight - rect.bottom < 320);
    }
    setOpen(true);
    requestAnimationFrame(() => {
      const active = listRef.current?.querySelector('[data-active="true"]');
      active?.scrollIntoView({ block: "nearest" });
    });
  };

  const commit = (option: AppSelectOption) => {
    onChange(option.value);
    setOpen(false);
  };

  const onButtonKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) {
        if (activeIndex >= 0 && options[activeIndex]) commit(options[activeIndex]);
        else setOpen(false);
      } else {
        openList();
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) openList();
      else setActiveIndex((index) => Math.min(index + 1, options.length - 1));
    } else if (event.key === "ArrowUp" && open) {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    }
  };

  return (
    <div className={`app-select${className ? ` ${className}` : ""}`} ref={rootRef}>
      <button
        type="button"
        id={id}
        className="app-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onButtonKeyDown}
      >
        <span className={`app-select-value${selected ? "" : " is-placeholder"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={15} aria-hidden="true" className={open ? "open" : ""} />
      </button>
      {open && (
        <ul
          className={`app-select-list${dropUp ? " drop-up" : ""}`}
          role="listbox"
          aria-label={listAriaLabel ?? ariaLabel}
          ref={listRef}
        >
          {grouped.map((group) => (
            <li key={group.name || "__ungrouped__"} className="app-select-group" role="presentation">
              {hasGroups && group.name !== "" && <span className="app-select-group-label">{group.name}</span>}
              <ul role="presentation">
                {group.items.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      data-active={isSelected}
                      className={`app-select-option${isSelected ? " selected" : ""}`}
                      onClick={() => commit(option)}
                      onMouseEnter={() => setActiveIndex(options.findIndex((item) => item.value === option.value))}
                    >
                      {isSelected && <Check size={14} aria-hidden="true" />}
                      <span>{option.label}</span>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
