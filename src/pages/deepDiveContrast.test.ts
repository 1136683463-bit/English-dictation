import { describe, expect, it } from "vitest";
import { parseContrastParagraph as parseContrastParagraphForTest } from "../services/grammarContrastParser";

/**
 * 深挖卡段落结构化（2026-09-22）：paragraphs 是纯文本，渲染层按行首模式
 * 识别「对比项」（X 说「…」：<例句>——重点是「…」）并分层展示。
 * 这里锁定解析规则，避免措辞微调导致结构化静默失效。
 */
describe("深挖卡段落结构化解析", () => {
  it("识别对比项：拆出术语 / 正文 / 侧注", () => {
    const parsed = parseContrastParagraphForTest(
      "There be 说「某处存在某物」：There is a book on the desk（桌上有一本书）——重点是「那个地方有什么」。"
    );
    expect(parsed).not.toBeNull();
    expect(parsed?.term).toBe("There be");
    expect(parsed?.body).toContain("There is a book on the desk");
    expect(parsed?.focus).toBe("「那个地方有什么」。");
  });

  it("识别第二个对比项（have）", () => {
    const parsed = parseContrastParagraphForTest(
      "have 说「某人拥有某物」：I have a book（我有一本书）——重点是「谁拥有」。"
    );
    expect(parsed?.term).toBe("have");
    expect(parsed?.body).toContain("I have a book");
    expect(parsed?.focus).toBe("「谁拥有」。");
  });

  it("补充规则段落不误判（无「说」句式）", () => {
    expect(
      parseContrastParagraphForTest(
        "说一个用 There is，说好几个用 There are，数不清的也用 There is（牛奶、水这类）：There is some milk。"
      )
    ).toBeNull();
    expect(
      parseContrastParagraphForTest("问句把 Is / Are 搬到句首：Is there…? / Are there…?；否定在 be 后面加 not：isn't / aren't。")
    ).toBeNull();
  });

  it("其他课的真实对比项也能识别（多词术语）", () => {
    const parsed = parseContrastParagraphForTest(
      "be 动词 说「状态」：She is happy（她很开心）——重点是「她是怎样的」。"
    );
    expect(parsed?.term).toBe("be 动词");
    expect(parsed?.focus).toBe("「她是怎样的」。");
  });

  it("无侧注时 focus 为 null，正文完整保留", () => {
    const parsed = parseContrastParagraphForTest("have 说「拥有」：I have a book。");
    expect(parsed?.term).toBe("have");
    expect(parsed?.body).toContain("I have a book");
    expect(parsed?.focus).toBeNull();
  });
});
