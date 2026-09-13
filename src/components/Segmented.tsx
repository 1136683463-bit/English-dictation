import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";

export type SegmentedItem = {
  key: string;
  label: ReactNode;
  ariaLabel?: string;
};

type Thumb = { x: number; y: number; w: number; h: number };

type SegmentedProps = {
  items: SegmentedItem[];
  value: string;
  onChange: (key: string) => void;
  /** "control" → 胶囊分段控件（segmented-control）；"tabs" → 白底指示块页签（segmented-tabs） */
  variant?: "control" | "tabs";
  className?: string;
  ariaLabel?: string;
};

/**
 * 带滑动指示块的分段页签。
 * 指示块只动 transform + width/height（合成层属性），Move 曲线过渡，
 * 首次挂载在绘制前定位、不做动画；容器尺寸或字体加载变化时自动重测。
 */
export function Segmented({ items, value, onChange, variant = "control", className = "", ariaLabel }: SegmentedProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const [thumb, setThumb] = useState<Thumb | null>(null);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const button = buttonRefs.current.get(value);
    if (!container || !button) {
      setThumb(null);
      return;
    }
    setThumb({
      x: button.offsetLeft,
      y: button.offsetTop,
      w: button.offsetWidth,
      h: button.offsetHeight,
    });
  }, [value]);

  useLayoutEffect(() => {
    measure();
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => undefined);
    }
    return () => observer.disconnect();
  }, [measure]);

  return (
    <div
      ref={containerRef}
      className={`${variant === "tabs" ? "segmented-tabs" : "segmented-control"} ${className}`.trim()}
      aria-label={ariaLabel}
    >
      {thumb && (
        <span
          className="segmented-thumb"
          aria-hidden="true"
          style={{
            transform: `translate3d(${thumb.x}px, ${thumb.y}px, 0)`,
            width: `${thumb.w}px`,
            height: `${thumb.h}px`,
          }}
        />
      )}
      {items.map((item) => {
        const selected = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            ref={(el) => {
              if (el) buttonRefs.current.set(item.key, el);
              else buttonRefs.current.delete(item.key);
            }}
            className={selected ? "selected" : ""}
            aria-pressed={selected}
            aria-label={item.ariaLabel}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
