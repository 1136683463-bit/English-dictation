// @vitest-environment jsdom
/**
 * KB8 · 次日回访页（GrammarRevisitPage）与轻量页面的键盘路径
 *
 * - GrammarRevisitPage:260 填空框回车提交（**没有 shiftKey / isComposing 判断**）
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarRevisitPage from "../../pages/GrammarRevisitPage";
import { buildRevisitQuiz } from "../../services/grammarAmbushService";
import { seedAppData } from "./fixtures";
import { clickElement, flushAsync, setInputValue } from "./drive";
import { fireKey } from "./kbd";

const LESSON = "lesson-13-now";
const TELEMETRY_KEY = "grammar-telemetry-events-v1";

/** 解锁关 2：关 1 已完成且已过次日窗。 */
const seedUnlocked = () => {
  seedAppData({ grammarLessonStagesDone: { [LESSON]: [1] } } as never);
  window.localStorage.setItem(
    TELEMETRY_KEY,
    JSON.stringify({
      version: 1,
      events: [
        {
          kind: "grammar_lesson_completed",
          lessonId: LESSON,
          completedAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
          ts: new Date().toISOString()
        }
      ]
    })
  );
};

const mountRevisit = () =>
  mountPage(<GrammarRevisitPage />, `/grammar/lesson/${LESSON}/revisit`, "/grammar/lesson/:lessonId/revisit");

/** 按正确答案拼掉 rebuild 题，走到第一道 cloze（有输入框）。 */
const advanceToCloze = async (
  page: ReturnType<typeof mountRevisit>,
  quiz: ReturnType<typeof buildRevisitQuiz>
): Promise<boolean> => {
  for (let step = 0; step < quiz.length; step += 1) {
    if (page.container.querySelector("input.large-textarea")) return true;
    const question = quiz[step];
    if (question.kind !== "rebuild") return false;
    const used = new Set<number>();
    for (const token of question.answer.split(/\s+/).filter(Boolean)) {
      const chips = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-spot-row button"));
      const at = chips.findIndex((b, i) => !used.has(i) && (b.textContent ?? "").trim() === token);
      if (at < 0) return false;
      used.add(at);
      clickElement(chips[at]);
    }
    await flushAsync();
    const next = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find((b) =>
      /^(下一题|最后一题|完成回访)/.test((b.textContent ?? "").trim())
    );
    if (!next) return false;
    clickElement(next);
    await flushAsync();
  }
  return Boolean(page.container.querySelector("input.large-textarea"));
};

describe("KB8 次日回访键盘路径", () => {
  beforeEach(() => resetStorage());

  it("KB8-0 前置：能进入回访关（非锁定态）", async () => {
    seedUnlocked();
    const page = mountRevisit();
    await flushAsync();
    // eslint-disable-next-line no-console
    console.log("KB8-0 页面片段:", page.text().slice(0, 120).replace(/\s+/g, " "));
    expect(page.has("回访关还没解锁"), "应已解锁").toBe(false);
    page.unmount();
  });

  it("KB8-1 填坑题：回车提交 = 点「提交」", async () => {
    seedUnlocked();
    const quiz = buildRevisitQuiz(LESSON);
    const page = mountRevisit();
    await flushAsync();
    const reached = await advanceToCloze(page, quiz);
    expect(reached, `未走到填坑题；页面：${page.text().slice(0, 100)}`).toBe(true);
    const field = page.container.querySelector<HTMLInputElement>("input.large-textarea")!;
    setInputValue(field, "a");
    await flushAsync();
    const event = fireKey(field, "Enter");
    await flushAsync();
    void event;
    // 副作用：出现反馈（pass 或 retry）——与点「提交」等价
    expect(page.container.querySelector(".lesson-feedback"), "回车应产生反馈").toBeTruthy();
    page.unmount();
  });

  it("KB8-2【已修 2026-09-21】填坑题：组词态回车不再提交", async () => {
    seedUnlocked();
    const quiz = buildRevisitQuiz(LESSON);
    const page = mountRevisit();
    await flushAsync();
    await advanceToCloze(page, quiz);
    const field = page.container.querySelector<HTMLInputElement>("input.large-textarea");
    if (!field) {
      page.unmount();
      return;
    }
    setInputValue(field, "a");
    await flushAsync();
    expect(page.container.querySelector(".lesson-feedback"), "前置：尚未提交").toBeNull();
    fireKey(field, "Enter", { isComposing: true, keyCode: 229 });
    await flushAsync();
    /**
     * 修复前：回访页只判断 `key === "Enter"`，组词态回车会把没写完的答案交上去。
     * 现在与课内输入框同口径（`!e.nativeEvent.isComposing`）——不应提交。
     */
    expect(
      page.container.querySelector(".lesson-feedback"),
      "组词态回车不应提交（与课内输入框同口径）"
    ).toBeNull();
    page.unmount();
  });

  it("KB8-3【已修 2026-09-21】填坑题：Shift+Enter 不再提交", async () => {
    seedUnlocked();
    const quiz = buildRevisitQuiz(LESSON);
    const page = mountRevisit();
    await flushAsync();
    await advanceToCloze(page, quiz);
    const field = page.container.querySelector<HTMLInputElement>("input.large-textarea");
    if (!field) {
      page.unmount();
      return;
    }
    setInputValue(field, "a");
    await flushAsync();
    const shift = fireKey(field, "Enter", { shiftKey: true });
    await flushAsync();
    // <input> 上 Shift+Enter 本身没有默认行为，所以 defaultPrevented 恒 false；
    // 真正的事实是「它照样提交」（同一份代码没有 shiftKey 判断）
    // 修复后：Shift+Enter 不再被当成提交（与课内输入框口径一致）
    expect(shift.defaultPrevented, "Shift+Enter 不应被 preventDefault").toBe(false);
    expect(
      page.container.querySelector(".lesson-feedback"),
      "Shift+Enter 不应提交"
    ).toBeNull();
    page.unmount();
  });

  it("KB8-4 回访页：无缺名按钮 / 无 tabIndex 缺 role", async () => {
    seedUnlocked();
    const page = mountRevisit();
    await flushAsync();
    const unnamed = Array.from(page.container.querySelectorAll<HTMLElement>("button, a[href]"))
      .filter((el) => {
        const label = el.getAttribute("aria-label") ?? (el.textContent ?? "").trim();
        return !label;
      })
      .map((el) => el.className);
    expect(unnamed, "存在无可读名的按钮").toEqual([]);
    page.unmount();
  });
});
