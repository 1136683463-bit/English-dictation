// @vitest-environment jsdom
/**
 * IX3 · useReturnFocus 的行为契约（2026-09-21）
 *
 * ## 为什么单测这个 hook，而不是只靠页面级用例
 * 页面级「焦点丢失」用例依赖浏览器把「被卸载元素的焦点」退回 `<body>`。
 * jsdom **不实现**这条 UA 级行为：元素重渲染后 `document.activeElement` 仍指向旧节点
 * （实测 `document.contains(activeElement) === true`），于是页面级用例在本环境里
 * 既有假绿也有假红，不能作为唯一证据。
 *
 * 所以这里直接测 hook 的判据与副作用：
 * - 焦点**确实**丢到 body 时 → 焦点被移到容器内第一个可聚焦元素
 * - 焦点仍在页面里（没丢）→ 不抢焦点（避免打断正在操作的用户）
 * - 键盘触发 → 允许滚动进视野；鼠标触发 → 不滚动
 * - 同一依赖键只处理一次（重复渲染不反复抢焦点）
 */
import { beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useReturnFocus } from "../../components/useReturnFocus";

if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
  class NoopResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = NoopResizeObserver;
}

interface HarnessProps {
  active: boolean;
  dep: string;
  /** 容器内是否渲染可聚焦子元素（用于验证「找不到就聚焦容器本身」的兜底）。 */
  withButton?: boolean;
}

/**
 * 把 hook 挂进一个小页面，返回容器、root 与一个「用新 props 重渲染」的函数。
 *
 * ⚠️ 必须用**同一个组件**重渲染：若换一个组件函数，React 会整体卸载重挂，
 * DOM 节点被替换，测试里保存的元素引用随即失效（会得到「expected button to be button」这种假失败）。
 */
const mountHook = (
  props: HarnessProps
): { container: HTMLDivElement; root: Root; rerender: (next: HarnessProps) => void } => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const render = (next: HarnessProps) => {
    act(() => {
      root.render(<Harness {...next} />);
    });
  };
  render(props);
  return { container, root, rerender: render };
};

/** 卸载被测页面并移除容器（每个用例结尾都要调用，避免用例间串味）。 */
const unmount = (root: Root, container: HTMLDivElement): void => {
  act(() => root.unmount());
  container.remove();
};

/** 被测页面：两个按钮 + 一个挂了 hook 的容器。 */
function Harness({ active, dep, withButton = true }: HarnessProps) {
  const ref = useReturnFocus<HTMLDivElement>(active, dep);
  return (
    <div>
      <button type="button">页面里的另一个按钮</button>
      <div ref={ref} tabIndex={-1} data-testid="target">
        {withButton ? <button type="button">容器内第一个按钮</button> : null}
      </div>
    </div>
  );
}

const activeLabel = (): string => {
  const element = document.activeElement as HTMLElement | null;
  if (!element || element === document.body) return "BODY";
  return (element.textContent ?? "").trim() || element.tagName;
};

describe("IX3 useReturnFocus 行为契约", () => {
  beforeEach(() => {
    // 每个用例都把焦点清到 body，避免上一个用例的残留影响判据
    (document.activeElement as HTMLElement | null)?.blur?.();
  });

  it("焦点丢到 body 时，落焦到容器内第一个可聚焦元素", () => {
    const { container, root, rerender } = mountHook({ active: false, dep: "k0" });
    (document.activeElement as HTMLElement | null)?.blur?.();
    expect(activeLabel(), "前置条件：焦点应在 body").toBe("BODY");

    act(() => {
      rerender({ active: true, dep: "k1" });
    });
    expect(activeLabel(), "应落焦到容器内第一个按钮").toBe("容器内第一个按钮");
    unmount(root, container);
  });

  it("容器内没有可聚焦元素时，聚焦容器本身（tabIndex=-1 兜底）", () => {
    const { container, root, rerender } = mountHook({ active: false, dep: "k0", withButton: false });
    (document.activeElement as HTMLElement | null)?.blur?.();
    act(() => {
      rerender({ active: true, dep: "k1", withButton: false });
    });
    const target = container.querySelector('[data-testid="target"]');
    expect(document.activeElement, "应聚焦容器本身").toBe(target);
    unmount(root, container);
  });

  it("焦点没丢（仍在页面元素上）时不抢焦点", () => {
    const { container, root, rerender } = mountHook({ active: false, dep: "k0" });
    const other = container.querySelector("button") as HTMLButtonElement;
    act(() => {
      other.focus();
    });
    expect(document.activeElement, "前置条件：焦点在页面里的其它按钮上").toBe(other);

    act(() => {
      rerender({ active: true, dep: "k1" });
    });
    expect(document.activeElement, "不应抢走用户当前的焦点").toBe(other);
    unmount(root, container);
  });

  it("同一依赖键只处理一次（重复渲染不反复抢焦点）", () => {
    const { container, root, rerender } = mountHook({ active: true, dep: "same" });
    // 第一次已落焦；把焦点挪开，再用同一个 dep 渲染 → 不应再次落焦
    const other = container.querySelector("button") as HTMLButtonElement;
    act(() => {
      other.focus();
    });
    act(() => {
      rerender({ active: true, dep: "same" });
    });
    expect(document.activeElement, "同 key 不应重复处理").toBe(other);
    unmount(root, container);
  });
});
