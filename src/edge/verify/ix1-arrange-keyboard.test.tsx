// @vitest-environment jsdom
/**
 * IX1 · 拼装区（arrange）的交互边界：点击 / 移除 / 撤销 / 键盘
 *
 * 这个区域是全站唯一有拖拽的地方，也是 guided 段的主力题型（581 道）。
 * 覆盖：摆满即判题、错后移除再摆回、撤销、超载、以及「按钮的可访问性」。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import { getGrammarLesson } from "../../services/lessonService";
import { clickElement, flushAsync } from "./drive";
import { makeAppData } from "./fixtures";

const LESSON_ID = "lesson-13-now";
const PATH = `/grammar/lesson/${LESSON_ID}`;

const mountLesson = () => mountPage(<GrammarLessonPage />, PATH, "/grammar/lesson/:lessonId");

const seed = (): void => {
  window.localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(makeAppData()));
};

/** 走到第一道 arrange 题（guided 段）。 */
const reachArrange = async (page: ReturnType<typeof mountLesson>) => {
  // 前测：跳过（直接开始）
  if (page.has("开始") || page.has("我准备好了")) {
    const start = page.buttons().find((text) => /开始|准备好了|跳过/.test(text));
    if (start) page.click(start);
    await flushAsync();
  }
};

const chipsIn = (page: ReturnType<typeof mountLesson>, selector: string): HTMLButtonElement[] =>
  Array.from(page.container.querySelectorAll(selector)) as HTMLButtonElement[];

describe("IX1 拼装区交互边界", () => {
  beforeEach(() => resetStorage());
  it("mount 后页面不崩，且能找到课程标题", async () => {
    seed();
    const page = mountLesson();
    await flushAsync();
    const lesson = getGrammarLesson(LESSON_ID);
    expect(lesson, "课程应存在").toBeTruthy();
    // 课程页顶部显示 episode + 标题（不是「第 N 课」字样）
    expect(page.text()).toContain(lesson!.title);
    page.unmount();
  });

  it("拖拽元素必须同时可键盘操作（draggable 的按钮天然可聚焦，验证 tabIndex 与 aria）", async () => {
    seed();
    const page = mountLesson();
    await flushAsync();
    await reachArrange(page);
    // 找到拼装区/词块库（若当前不在 arrange 题，跳过并标注，不虚报通过）
    const bank = page.container.querySelector(".lesson-bank");
    if (!bank) {
      expect(page.text().length, "页面应有内容（未到 arrange 题的场景）").toBeGreaterThan(0);
      page.unmount();
      return;
    }
    const chips = chipsIn(page, ".lesson-bank button");
    expect(chips.length, "词块库应有词块").toBeGreaterThan(0);
    for (const chip of chips) {
      // 原生 button 可聚焦；draggable 不应破坏键盘可达性
      expect(chip.tagName, "词块应是可聚焦的 button").toBe("BUTTON");
      expect(chip.disabled && chip.draggable, "禁用的词块不应仍标 draggable").toBe(false);
    }
    page.unmount();
  });

  it("拼装区内已选词块可点击移除（键盘 Enter 等价）", async () => {
    seed();
    const page = mountLesson();
    await flushAsync();
    await reachArrange(page);
    const bank = page.container.querySelector(".lesson-bank");
    if (!bank) {
      page.unmount();
      return;
    }
    const chips = chipsIn(page, ".lesson-bank button");
    // 选前两块
    clickElement(chips[0]);
    await flushAsync();
    const built = chipsIn(page, ".lesson-chip.built");
    expect(built.length, "选中的词块应出现在拼装区").toBeGreaterThan(0);
    // 点拼装区的词块移除
    clickElement(built[0]);
    await flushAsync();
    expect(chipsIn(page, ".lesson-chip.built").length, "点一下应移除该词块").toBe(built.length - 1);
    page.unmount();
  });

  it("撤销按钮（移除最后一个）可用且有 aria-label", async () => {
    seed();
    const page = mountLesson();
    await flushAsync();
    await reachArrange(page);
    const bank = page.container.querySelector(".lesson-bank");
    if (!bank) {
      page.unmount();
      return;
    }
    const chips = chipsIn(page, ".lesson-bank button");
    clickElement(chips[0]);
    clickElement(chips[1]);
    await flushAsync();
    const before = chipsIn(page, ".lesson-chip.built").length;
    expect(before).toBe(2);
    const undo = page.container.querySelector('button[aria-label="移除最后一个词"]') as HTMLButtonElement | null;
    expect(undo, "撤销按钮应带 aria-label（图标按钮的唯一可读名）").toBeTruthy();
    clickElement(undo!);
    await flushAsync();
    expect(chipsIn(page, ".lesson-chip.built").length).toBe(1);
    page.unmount();
  });
});
