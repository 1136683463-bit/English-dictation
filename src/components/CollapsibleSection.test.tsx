// @vitest-environment jsdom
import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import CollapsibleSection from "./CollapsibleSection";

// R6：jsdom 组件测试（无 testing-library，createRoot + act 直驱，与项目零新依赖原则一致）。
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("CollapsibleSection 折叠区（R6）", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  const render = (defaultOpen: boolean) => {
    act(() => {
      root = createRoot(container);
      root.render(
        <CollapsibleSection eyebrow="Report" title="数据报告" summary={<span>摘要行</span>} defaultOpen={defaultOpen}>
          <p>折叠内容体</p>
        </CollapsibleSection>
      );
    });
    return container.querySelector<HTMLButtonElement>(".collapsible-section-head")!;
  };

  const clickHead = (head: HTMLButtonElement) => {
    act(() => {
      head.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
  };

  it("默认折叠不渲染 children，仅显示 header 与 summary", () => {
    render(false);
    expect(container.textContent).toContain("数据报告");
    expect(container.textContent).toContain("摘要行");
    expect(container.textContent).not.toContain("折叠内容体");
  });

  it("点击 header 展开 children，再次点击收起", () => {
    const head = render(false);
    clickHead(head);
    expect(container.textContent).toContain("折叠内容体");
    clickHead(head);
    expect(container.textContent).not.toContain("折叠内容体");
  });

  it("aria-expanded 随展开状态同步", () => {
    const head = render(false);
    expect(head.getAttribute("aria-expanded")).toBe("false");
    clickHead(head);
    expect(head.getAttribute("aria-expanded")).toBe("true");
  });

  it("defaultOpen=true 直接展开，且不显示 summary", () => {
    const head = render(true);
    expect(head.getAttribute("aria-expanded")).toBe("true");
    expect(container.textContent).toContain("折叠内容体");
    expect(container.textContent).not.toContain("摘要行");
  });
});
