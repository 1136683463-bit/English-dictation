import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import SpellingErrorReview from "./SpellingErrorReview";
import { compareLetters } from "../services/diffService";

describe("SpellingErrorReview", () => {
  it("explains the first spelling issue in readable text", () => {
    const html = renderToStaticMarkup(
      <SpellingErrorReview expected="predict" answer="perdict" tokens={compareLetters("predict", "perdict")} />
    );

    expect(html).toContain("1 处需要修改");
    expect(html).toContain("字母顺序反了：你写成 er，应为 re。");
    expect(html).toContain("正确拼写是 <b>predict</b>，你的答案是 perdict。");
    expect(html).toContain("er -&gt; re");
    expect(html).toContain("写错");
    expect(html).not.toContain("letter-diff-view");
  });
});
