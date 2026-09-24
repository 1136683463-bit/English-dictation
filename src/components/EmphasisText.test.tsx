// @vitest-environment jsdom
import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import EmphasisText from "./EmphasisText";

/**
 * 题干「…」要点强调（2026-09-24）：题干里引号包裹的是**要点**
 * （要找的语法现象 / 被替换的词 / 目标句），与指令文字同字重时扫视抓不到重点。
 * 这里锁两条契约：引号内容被标记为强调、非引号文字原样保留不丢字。
 */
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("EmphasisText 题干要点强调", () => {
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

  const render = (text: string) => {
    act(() => {
      root = createRoot(container);
      root.render(<EmphasisText text={text} />);
    });
  };

  it("引号内容标记为强调（错题重练题干）", () => {
    render("找出「事情发生在过去，动词要换成过去式」这处毛病。");
    const strong = container.querySelectorAll("strong.emphasis-quote");
    expect(strong.length).toBe(1);
    expect(strong[0].textContent).toBe("「事情发生在过去，动词要换成过去式」");
    // 引号外的指令文字原样保留
    expect(container.textContent).toBe("找出「事情发生在过去，动词要换成过去式」这处毛病。");
  });

  it("多个引号各自强调（变形题题干：原句 + 要换的词）", () => {
    render("句型转换：「I am happy.」把「开心」换成「累（tired）」，am 要怎么变？");
    const strong = [...container.querySelectorAll("strong.emphasis-quote")].map((el) => el.textContent);
    expect(strong).toEqual(["「I am happy.」", "「开心」", "「累（tired）」"]);
    // 全文不丢字
    expect(container.textContent).toBe("句型转换：「I am happy.」把「开心」换成「累（tired）」，am 要怎么变？");
  });

  it("无引号时原样渲染（多数题干没有引注）", () => {
    render("你想说：桌上有一本书。");
    expect(container.querySelectorAll("strong.emphasis-quote").length).toBe(0);
    expect(container.textContent).toBe("你想说：桌上有一本书。");
  });

  it("空字符串安全", () => {
    render("");
    expect(container.textContent).toBe("");
  });
});
