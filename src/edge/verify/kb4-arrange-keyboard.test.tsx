// @vitest-environment jsdom
/**
 * KB4 · 拼装区（arrange）键盘等价性
 *
 * 事实基础（GrammarLessonPage.tsx:1975-2095）：
 * - 词块是 <button>，点一下 = 加入 / 移除 → 键盘 Enter/Space 天然等价；
 * - **改顺序只有一条路：HTML5 拖拽**（onDragStart/onDragOver/onDrop → arrangeMove）；
 *   arrangeMove 只从 drag 回调里调用，没有任何键盘/点击入口。
 *
 * 结论（本文件验证）：
 * ① 顺序**理论可达**——全清后按正确顺序重摆即可（代价是 N 次逐块操作）；
 * ② 「移动一个词块」这种拖拽的最小动作，键盘没有等价路径（只能全清重摆）；
 * ③ 撤销按钮的去抖问题，**验证期间已被并行修好**（`arrangeUndoLast` 现在复位
 *    `lastJudgedLengthRef` 并保住已通过的反馈态）——KB4-4 / KB4-4b / KB4-6b 已改为
 *    验证修好后的行为；
 * ④ **但修复只覆盖了橡皮擦，漏了等价的「点击拼装区词块移除」路径**（`arrangeRemove`）：
 *    通过态下点一块仍会撤销通关 —— KB4-6 保持 willing-to-fail；
 * ⑤ 操作提示文案仍未提键盘（KB4-7 保持 willing-to-fail）。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import { focusableIn } from "./kbd";
import { flushAsync } from "./drive";
import {
  answerPretest,
  bankChips,
  builtWords,
  clickEl,
  lessonOf,
  markLessonsDoneInStorage,
  norm,
  sectionLabels,
  type Mounted
} from "../lessonFlow";

const LESSON = "lesson-13-now";

const mount = () =>
  mountPage(<GrammarLessonPage />, `/grammar/lesson/${LESSON}`, "/grammar/lesson/:lessonId");

const warmStorage = () => {
  const warm = mountPage(<GrammarLessonPage />, "/grammar/lesson/lesson-01-am", "/grammar/lesson/:lessonId");
  warm.unmount();
  markLessonsDoneInStorage(["lesson-01-am"]);
};

/** 走到 guided 段的 arrange 题。 */
const reachArrange = (page: Mounted): boolean => {
  answerPretest(page, LESSON, true);
  page.click("直接去练习");
  page.click("回去再看一遍讲解");
  page.click("下一步：搭装与对错");
  page.click("下一步：变奏");
  page.click("看懂了，试一试");
  for (let guard = 0; guard < 10; guard += 1) {
    if (page.container.querySelector(".lesson-bank")) return true;
    const spot = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-spot-row button")).find(
      (b) => !b.disabled
    );
    const option = Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-option")).find(
      (b) => !b.disabled
    );
    if (option) clickEl(option);
    else if (spot) clickEl(spot);
    else return false;
    const next = page.buttons().find((t) => /^(下一题|下面自己来)$/.test(t));
    if (next) page.click(next);
    if (page.container.querySelector(".lesson-bank")) return true;
  }
  return false;
};

const builtChips = (page: Mounted) =>
  Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-build-area button.lesson-chip"));

const undoButton = (page: Mounted) =>
  page.container.querySelector<HTMLButtonElement>('button[aria-label="移除最后一个词"]');

const addWord = (page: Mounted, word: string): boolean => {
  const chip = bankChips(page).find((b) => !b.disabled && norm(b.textContent ?? "") === norm(word));
  if (!chip) return false;
  clickEl(chip);
  return true;
};

const arrangeAnswer = (): string[] =>
  norm(lessonOf(LESSON).guided.find((step) => step.kind === "arrange" && step.answer)?.answer ?? "")
    .split(" ")
    .filter(Boolean);

const feedbackClass = (page: Mounted): string =>
  page.container.querySelector(".lesson-feedback")?.className ?? "none";

const canAdvance = (page: Mounted): boolean =>
  page.buttons().some((t) => /^(下一题|下面自己来)$/.test(t));

describe("KB4 拼装区键盘等价性", () => {
  beforeEach(() => resetStorage());

  it("KB4-0 前置：能走到 arrange 题", async () => {
    warmStorage();
    const page = mount();
    expect(reachArrange(page), `未走到 arrange；段位：${sectionLabels(page).join(",")}`).toBe(true);
    expect(bankChips(page).length).toBeGreaterThan(0);
    page.unmount();
  });

  it("KB4-1 词块是原生 button：键盘 Enter/Space 天然等价于点击（加入/移除）", async () => {
    warmStorage();
    const page = mount();
    expect(reachArrange(page)).toBe(true);
    const bank = bankChips(page);
    for (const chip of bank) {
      expect(chip.tagName, "词块必须是原生 button（否则要自己写 Enter/Space handler）").toBe("BUTTON");
      expect(chip.getAttribute("tabindex"), "原生 button 不需要额外 tabIndex").not.toBe("-1");
    }
    clickEl(bank[0]);
    await flushAsync();
    expect(builtWords(page).length, "点词块 → 进入拼装区（键盘 Enter 同理）").toBe(1);
    const built = builtChips(page);
    expect(built[0]?.tagName, "拼装区词块也必须是原生 button（否则键盘无法移除）").toBe("BUTTON");
    clickEl(built[0]);
    await flushAsync();
    expect(builtWords(page).length, "点拼装区词块 → 移除").toBe(0);
    page.unmount();
  });

  it("KB4-2 拼装区没有非原生可聚焦元素（重排完全依赖 HTML5 拖拽）", async () => {
    warmStorage();
    const page = mount();
    expect(reachArrange(page)).toBe(true);
    const area = page.container.querySelector<HTMLElement>(".lesson-arrange");
    const focusables = focusableIn(area!);
    const nonButtons = focusables.filter((el) => el.tagName !== "BUTTON" && el.tagName !== "A");
    expect(
      nonButtons.map((el) => `${el.tagName}.${el.className}`),
      "拼装区内出现非原生可聚焦元素（那才需要 role + 键盘 handler）"
    ).toEqual([]);
    const built = builtChips(page);
    if (built.length > 0) {
      expect(built[0].getAttribute("title"), "拖动提示只在 title（键盘不可发现）").toContain("拖动");
    }
    // 事实：整个拼装区没有任何 keydown 处理
    expect(/onkeydown/i.test(area!.outerHTML), "事实：拼装区 DOM 里没有任何键盘事件绑定").toBe(false);
    page.unmount();
  });

  it("KB4-3 顺序可达性：不用拖拽**能**摆出任意顺序，但代价是全清后按序重摆", async () => {
    warmStorage();
    const page = mount();
    expect(reachArrange(page)).toBe(true);
    const words = arrangeAnswer();
    expect(words.length, "答案至少 3 个词才能测换序").toBeGreaterThanOrEqual(3);
    // 摆一个「中间两词互换」的错序
    const wrongOrder = [words[0], words[2], words[1], ...words.slice(3)];
    for (const word of wrongOrder) addWord(page, word);
    await flushAsync();
    expect(builtWords(page).map(norm).join(" "), "已摆成错序").toBe(wrongOrder.join(" "));
    expect(feedbackClass(page), "摆满即判题（错序应给出提示）").toContain("retry");
    // 想只换中间两个词：把第 3 块移除再加回来，只会落到末尾
    clickEl(builtChips(page)[2]);
    await flushAsync();
    addWord(page, wrongOrder[2]);
    await flushAsync();
    expect(
      builtWords(page).map(norm)[builtWords(page).length - 1],
      "移除后重加只能落到末尾（没有「插到某位置」的键盘/点击手段）"
    ).toBe(norm(wrongOrder[2]));
    // 唯一可行路径：全清 → 按正确顺序重摆
    let removals = 0;
    for (let guard = 0; guard < 30 && builtChips(page).length > 0; guard += 1) {
      clickEl(builtChips(page)[0]);
      removals += 1;
      await flushAsync();
    }
    let additions = 0;
    for (const word of words) {
      if (addWord(page, word)) additions += 1;
      await flushAsync();
    }
    // eslint-disable-next-line no-console
    console.log(`KB4-3 只换两个词的位置：需要 ${removals} 次移除 + ${additions} 次添加（拖拽只需 1 次拖动）`);
    expect(builtWords(page).map(norm).join(" "), "全清重摆可达到正确顺序").toBe(words.join(" "));
    expect(feedbackClass(page), "重摆到正确顺序后应通过").toContain("pass");
    expect(canAdvance(page), "通过后应能继续").toBe(true);
    page.unmount();
  });

  it("KB4-4 撤销按钮后摆回同一长度会重新判题（2026-09-21 已修：erase 复位判题去抖）", async () => {
    warmStorage();
    const page = mount();
    expect(reachArrange(page)).toBe(true);
    const words = arrangeAnswer();
    for (const word of words) addWord(page, word);
    await flushAsync();
    expect(feedbackClass(page), "前置：摆对后应通过").toContain("pass");
    expect(canAdvance(page), "前置：通过后能继续").toBe(true);
    expect(undoButton(page), "撤销按钮应存在").toBeTruthy();
    clickEl(undoButton(page));
    await flushAsync();
    expect(builtWords(page).length, "撤销后少一块").toBe(words.length - 1);
    // 已通过的题：擦一块不再撤销通关（保住「下一题」，只是允许回头改）
    expect(feedbackClass(page), "已通过的题擦一块仍保留 pass 态").toContain("pass");
    expect(canAdvance(page), "已通过的题擦一块仍有「下一题」").toBe(true);
    const missing = words.find((word) => !builtWords(page).map(norm).includes(word));
    expect(missing, "应能算出缺的那个词").toBeTruthy();
    addWord(page, missing!);
    await flushAsync();
    expect(builtWords(page).map(norm).join(" "), "已重新摆成正确顺序").toBe(words.join(" "));
    expect(feedbackClass(page), "摆回同一长度后应重新判题并通过").toContain("pass");
    expect(canAdvance(page), "通过后应能继续").toBe(true);
    page.unmount();
  });

  it("KB4-4b 未通过的题：撤销后摆回同一长度也会重新判题（去抖已复位）", async () => {
    warmStorage();
    const page = mount();
    expect(reachArrange(page)).toBe(true);
    const words = arrangeAnswer();
    // 先摆一个错序触发 retry
    const wrongOrder = [words[0], words[2], words[1], ...words.slice(3)];
    for (const word of wrongOrder) addWord(page, word);
    await flushAsync();
    expect(feedbackClass(page), "前置：错序应 retry").toContain("retry");
    // 用撤销按钮擦掉最后一块 → 反馈清空（未通过，符合预期）
    clickEl(undoButton(page));
    await flushAsync();
    expect(builtWords(page).length).toBe(words.length - 1);
    expect(feedbackClass(page), "未通过的题擦一块后反馈清空").toBe("none");
    // 补回被擦掉的那块 → 长度又等于答案词数 → 必须重新判题
    const missing = wrongOrder[wrongOrder.length - 1];
    addWord(page, missing);
    await flushAsync();
    expect(
      feedbackClass(page),
      "已修：撤销后摆回同一长度应重新判题（此前因去抖未复位而无任何反馈）"
    ).not.toBe("none");
    page.unmount();
  });

  it("KB4-5【对照】点击词块移除（不经撤销按钮）会重置去抖：重摆回能正常判题", async () => {
    warmStorage();
    const page = mount();
    expect(reachArrange(page)).toBe(true);
    const words = arrangeAnswer();
    for (const word of words) addWord(page, word);
    await flushAsync();
    expect(feedbackClass(page)).toContain("pass");
    clickEl(builtChips(page)[builtChips(page).length - 1]);
    await flushAsync();
    const missing = words.find((word) => !builtWords(page).map(norm).includes(word));
    addWord(page, missing!);
    await flushAsync();
    expect(
      feedbackClass(page),
      "对照组：同样「移除+重摆回」，点词块移除能重新判题（证明 KB4-4 是撤销按钮漏了重置去抖）"
    ).toContain("pass");
    page.unmount();
  });

  it("KB4-6【已修 2026-09-21】通过态下点拼装区词块不再撤销「通过」（两条路径口径一致）", async () => {
    warmStorage();
    const page = mount();
    expect(reachArrange(page)).toBe(true);
    const words = arrangeAnswer();
    for (const word of words) addWord(page, word);
    await flushAsync();
    expect(feedbackClass(page), "前置：已通过").toContain("pass");
    expect(canAdvance(page), "前置：有「下一题」").toBe(true);
    const chip = builtChips(page)[0];
    expect(chip.disabled, "拼装区词块在通过态下仍可点（本身是允许回头改的设计）").toBe(false);
    /*
     * 修复后：两条等价路径口径一致——点拼装区词块（arrangeRemove）与橡皮擦
     * （arrangeUndoLast）都不再撤销已通过的题。此前只修了橡皮擦，
     * 点击路径仍无条件置 idle，导致「下一题」消失、用户必须重摆。
     */
    clickEl(chip);
    await flushAsync();
    expect(
      feedbackClass(page),
      "点词块移除不应撤销「通过」"
    ).toContain("pass");
    expect(canAdvance(page), "「下一题」应仍在").toBe(true);
    page.unmount();
  });

  it("KB4-6b【对照】橡皮擦路径已修：已通过的题擦一块仍保住「通过」与「下一题」", async () => {
    warmStorage();
    const page = mount();
    expect(reachArrange(page)).toBe(true);
    const words = arrangeAnswer();
    for (const word of words) addWord(page, word);
    await flushAsync();
    expect(feedbackClass(page), "前置：已通过").toContain("pass");
    clickEl(undoButton(page));
    await flushAsync();
    expect(feedbackClass(page), "橡皮擦路径：已通过的题擦一块仍保留 pass").toContain("pass");
    expect(canAdvance(page), "橡皮擦路径：下一题仍在").toBe(true);
    page.unmount();
  });

  it("KB4-7 拼装区工具区：撤销按钮有 aria-label，但操作提示只讲鼠标动作", async () => {
    warmStorage();
    const page = mount();
    expect(reachArrange(page)).toBe(true);
    const undo = undoButton(page);
    expect(undo, "图标按钮必须有 aria-label").toBeTruthy();
    expect(undo!.getAttribute("aria-label")).toBe("移除最后一个词");
    const hint = page.container.querySelector(".lesson-token-tools-hint")?.textContent ?? "";
    expect(hint, "操作提示应存在").toContain("拖动");
    expect(
      /键盘|方向键|按.*键/.test(hint),
      "事实：操作提示没有告诉键盘用户怎么换位置（只说「拖动词块可以调整位置」）"
    ).toBe(false);
    page.unmount();
  });
});
