// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarLessonPage from "../../pages/GrammarLessonPage";

describe("脚手架自检", () => {
  beforeEach(() => resetStorage());

  it("能挂载课程页并读到首屏文本", () => {
    const page = mountPage(
      <GrammarLessonPage />,
      "/grammar/lesson/lesson-01-am",
      "/grammar/lesson/:lessonId"
    );
    expect(page.has("课前试一试")).toBe(true);
    console.log("首屏按钮:", page.buttons().slice(0, 6).join(" | "));
    page.unmount();
  });
});
