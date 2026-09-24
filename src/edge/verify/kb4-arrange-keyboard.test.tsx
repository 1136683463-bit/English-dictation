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
    // ST2（2026-09-24）：擦完拼法已不等于答案 → 横幅按事实转中性；判定与出口不变
    expect(feedbackClass(page), "已通过的题擦一块：横幅转中性，不谎称当前拼法正确").toContain("fiddling");
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
      "点词块移除不应撤销「通过」——横幅转中性、出口仍在（ST2）"
    ).toContain("fiddling");
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
    expect(feedbackClass(page), "橡皮擦路径：已通过的题擦一块 → 横幅转中性（ST2），出口仍在").toContain("fiddling");
    expect(canAdvance(page), "橡皮擦路径：下一题仍在").toBe(true);
    page.unmount();
  });

  /**
   * KB4-7【已修 2026-09-23】操作提示现在讲键盘了，且键盘换位真的可用。
   *
   * 修复前的状态（本条曾以 willing-to-fail 记录）：换位只有 HTML5 拖拽一条路，
   * 键盘用户在拼装区排错顺序只能全清重摆（N 次操作）；
   * 操作提示也只说「拖动词块可以调整位置」，键盘用户不知道有别的方式。
   *
   * 修复方式：词块加 ← / → 换位（调用与拖拽同一条 arrangeMove），
   * 并在提示里讲出来。因此本条的断言从「记录缺陷」翻成「验证能力存在」。
   */
  it("KB4-7【已修 2026-09-23】撤销按钮有 aria-label，且操作提示已告知键盘换位方式", async () => {
    warmStorage();
    const page = mount();
    expect(reachArrange(page)).toBe(true);
    const undo = undoButton(page);
    expect(undo, "图标按钮必须有 aria-label").toBeTruthy();
    expect(undo!.getAttribute("aria-label")).toBe("移除最后一个词");
    const hint = page.container.querySelector(".lesson-token-tools-hint")?.textContent ?? "";
    expect(hint, "操作提示应存在").toContain("拖动");
    expect(
      /键盘|方向键|←|→/.test(hint),
      "操作提示必须告诉键盘用户怎么换位置（修复前只说「拖动」，键盘用户无从得知 ← → 可用）"
    ).toBe(true);
    page.unmount();
  });

  /**
   * KB4-8：键盘换位的行为验证（新增 2026-09-23）。
   *
   * 上一条只验证了「提示里提到了方向键」；本条验证**这个能力真的能用**，
   * 否则提示就成了空头支票。三点都要成立：
   *  ① 焦点在词块上按 → 能与右邻块对调；
   *  ② 换位后焦点仍在该词块上（否则连按第二次就失效——换位会改 key 触发节点重建）；
   *  ③ 一路按 → 到底后不越界、词集不乱。
   */
  it("KB4-8 词块按 ← → 能换位，且换位后焦点跟着走（可连按）", async () => {
    warmStorage();
    const page = mount();
    expect(reachArrange(page)).toBe(true);
    const words = arrangeAnswer();
    for (const word of words) addWord(page, word);
    await flushAsync();

    const before = builtWords(page);
    expect(before.length, "前置：已摆满").toBe(words.length);

    const first = builtChips(page)[0];
    first.focus();
    expect(document.activeElement, "前置：第一个词块已获焦").toBe(first);

    const key = (el: Element, k: string) =>
      el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));

    key(first, "ArrowRight");
    await flushAsync();

    const after = builtWords(page);
    expect(after, "按 → 应与右邻块对调").not.toEqual(before);
    expect([...after].sort(), "换位只是换顺序，词集不变").toEqual([...before].sort());
    expect(after[1], "原第 1 块移到第 2 位").toBe(before[0]);
    expect(after[0], "原第 2 块移到第 1 位").toBe(before[1]);

    const moved = builtChips(page)[1];
    expect(document.activeElement, "换位后焦点应仍在同一词块上（否则无法连按）").toBe(moved);

    // 连续按到底：不越界、不抛错
    for (let i = 0; i < 12; i += 1) {
      key(document.activeElement ?? moved, "ArrowRight");
      await flushAsync();
    }
    const end = builtWords(page);
    expect([...end].sort(), "连按到底后词集仍完整").toEqual([...before].sort());
    expect(end[end.length - 1], "按到底后该词块停在最后一位").toBe(before[0]);
    page.unmount();
  });
});
