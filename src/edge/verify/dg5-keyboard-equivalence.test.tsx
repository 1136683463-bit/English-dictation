// @vitest-environment jsdom
/**
 * DG5 · 键盘替代路径（任务第 5 条）
 *
 * 问题：拖拽能做的「调整已摆词块的顺序」，键盘用户能不能做？
 *
 * ## jsdom 的一个关键限制（必须先说清）
 * jsdom **不实现原生 button 的 Enter/Space 默认激活行为**（不做 default action → 不派 click）。
 * 真实浏览器里焦点在 button 上按 Enter/Space 会派发 click 事件，因此：
 * - 「键盘加块 / 移除块」在本文件里用 **click** 代表（等价于真实浏览器里 Enter/Space 的结果）；
 * - 「键盘重排」用 **fireKey 派发方向键 / Backspace / Delete** 直接验证有没有 handler
 *   （这一条不受上面的限制影响：没有 handler 就是没有，真实浏览器也不会凭空产生行为）。
 * ix1 已覆盖「点击选中/移除/撤销」，本文件不重复那部分断言，只把它作为前提。
 *
 * ## 事实（GrammarLessonPage.tsx）
 * - arrangeMove 只在 renderArrangeArea 的 drag 回调里被调用（:1996-1997 区容器、:2021-2031 词块）；
 *   全文件没有任何落在拼装区的 onKeyDown（:2811 / :3156 两处 onKeyDown 分别是「忆」段与产出段的 textarea）。
 * - 拼装区词块 onClick 只有 arrangeRemove（:2033）；词块库词块 onClick 只有 arrangeAdd（:2067），
 *   且 add 不支持指定位置（at 省略 → push，:1243-1245）。
 * - 键盘可用的全部手段 = 加块（append）、移除块、橡皮擦（移除最后一个）。
 *
 * ## 2026-09-23 更新：拼装区已补上键盘重排
 *
 * 上面那段「事实」记录的是修复前的状态。本轮给拼装区词块加了
 * **← / → 换位**（调用与拖拽同一条 arrangeMove），并在操作提示里讲了出来。
 * 因此本文件里那条「方向键都不改变顺序」的断言已翻正为
 * 「← / → 改变顺序，其余键不改变」（见下面 DG5-reorder 两条）。
 * 修复动机：换位此前只有拖拽一条路，键盘用户排错顺序只能全清重摆（N 次操作）。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import { flushAsync } from "./drive";
import { fireKey } from "./kbd";
import {
  DRAG_LESSON_PATH,
  DRAG_ROUTE,
  bankChips,
  builtChips,
  builtWords,
  dragTo,
  feedbackState,
  guidedArrangeStep,
  reachGuided,
  seedDragStorage
} from "./dragDrive";

const mount = () => mountPage(<GrammarLessonPage />, DRAG_LESSON_PATH, DRAG_ROUTE);

const log = (line: string) => {
  // eslint-disable-next-line no-console
  console.log(line);
};

/** 点一块（= 真实浏览器里焦点在该块上按 Enter/Space 的结果）。 */
const activate = async (chip: HTMLButtonElement): Promise<void> => {
  chip.click();
  await flushAsync();
};

const bankWord = (page: ReturnType<typeof mount>, word: string): HTMLButtonElement =>
  bankChips(page).find((chip) => !chip.disabled && (chip.textContent ?? "").trim() === word) ??
  (() => {
    throw new Error(`词块库里没有「${word}」：${bankChips(page).map((c) => c.textContent).join(" | ")}`);
  })();

describe("DG5 键盘替代路径", () => {
  beforeEach(() => resetStorage());

  /**
   * DG5-reorder【已修 2026-09-23】拼装区现在有键盘重排 handler。
   *
   * 修复前：本条断言「这些键都不应改变顺序（页面没有任何键盘重排 handler）」，
   * 记录的是「换位只有拖拽一条路」这个缺口。
   * 修复后：← / → 换位，其余键不动。断言相应翻正 ——
   * 既要验证方向键**真的能用**，也要验证其它键**仍然不会误改顺序**。
   */
  it("拼装区键盘重排：← / → 换位，其余键不改变顺序", async () => {
    seedDragStorage();
    const page = mount();
    await flushAsync();
    await reachGuided(page);
    const step = guidedArrangeStep(0);
    for (const word of step.answer.split(" ").slice(0, 4)) {
      await activate(bankWord(page, word));
    }
    const before = builtWords(page);
    expect(before.length).toBe(4);
    builtChips(page)[0].focus();
    expect(document.activeElement, "键盘用户应能 Tab 到词块").toBe(builtChips(page)[0]);

    // ① ← / → 应改变顺序。
    // ⚠️ 按键要派发到**当前获得焦点的那个词块**上（不是固定的 [0]）：
    // 换位后焦点跟着词块走，第二次按键若派给 [0] 就换了另一块，测不出「可连按」。
    const reorderResults: Array<{ key: string; changed: boolean }> = [];
    for (const key of ["ArrowRight", "ArrowLeft"]) {
      const prior = builtWords(page).join(" ");
      fireKey(document.activeElement ?? builtChips(page)[0], key);
      await flushAsync();
      reorderResults.push({ key, changed: builtWords(page).join(" ") !== prior });
    }
    log(`[DG5] 拼装区重排键效果：${JSON.stringify(reorderResults)}`);
    expect(
      reorderResults.filter((row) => row.changed).map((row) => row.key),
      "← / → 都应改变顺序（2026-09-23 起支持键盘重排）"
    ).toEqual(["ArrowRight", "ArrowLeft"]);

    // ② 其余键不应改变顺序（避免误触发）
    const settled = builtWords(page);
    builtChips(page)[0].focus();
    const nonReorder: Array<{ key: string; changed: boolean }> = [];
    for (const key of ["ArrowUp", "ArrowDown", "Backspace", "Delete", "Home", "End", "PageUp", "PageDown"]) {
      fireKey(builtChips(page)[0], key);
      await flushAsync();
      nonReorder.push({ key, changed: builtWords(page).join(" ") !== settled.join(" ") });
    }
    log(`[DG5] 拼装区非重排键效果：${JSON.stringify(nonReorder)}`);
    expect(
      nonReorder.filter((row) => row.changed).map((row) => row.key),
      "这些键不应改变顺序（只有 ← / → 是重排键）"
    ).toEqual([]);
    expect(builtWords(page), "词集应完整（不丢块）").toHaveLength(4);
    page.unmount();
  });

  it("键盘在拼装区唯一能做的是「移除」：激活任一块 = 移除它（不改顺序）", async () => {
    seedDragStorage();
    const page = mount();
    await flushAsync();
    await reachGuided(page);
    const step = guidedArrangeStep(0);
    for (const word of step.answer.split(" ").slice(0, 4)) {
      await activate(bankWord(page, word));
    }
    const before = builtWords(page);
    await activate(builtChips(page)[1]);
    const after = builtWords(page);
    log(`[DG5] 激活第 1 块：${JSON.stringify(before)} -> ${JSON.stringify(after)}（移除，不是重排）`);
    expect(after, "激活 = 移除该块，其余顺序不变").toEqual(before.filter((_w, i) => i !== 1));
    page.unmount();
  });

  it("缺口：把块插到中间在键盘上不可达 —— 「移除+重加」只能追加到末尾", async () => {
    seedDragStorage();
    const page = mount();
    await flushAsync();
    await reachGuided(page);
    const step = guidedArrangeStep(0);
    const words = step.answer.split(" "); // I am drawing a picture.

    // 键盘摆出「前两词颠倒」的错序：[am, I, drawing, a, picture.]
    const wrong = [words[1], words[0], ...words.slice(2)];
    for (const word of wrong) {
      await activate(bankWord(page, word));
    }
    expect(builtWords(page), "键盘摆出错序").toEqual(wrong);
    expect(feedbackState(page), "错序摆满应判错").toBe("retry");

    // 键盘用户的唯一手段：移除第 0 块，再从库里加回来
    const removed = (builtChips(page)[0].textContent ?? "").trim();
    await activate(builtChips(page)[0]);
    log(`[DG5] 移除第 0 块「${removed}」：${JSON.stringify(builtWords(page))}`);
    await activate(bankWord(page, removed));
    const after = builtWords(page);
    log(`[DG5] 把「${removed}」加回来：${JSON.stringify(after)}（落到末尾）`);
    expect(after[after.length - 1], "键盘重加只能落到末尾，无法插回开头").toBe(removed);
    expect(after, `键盘无法把 ${JSON.stringify(wrong)} 修成 ${JSON.stringify(words)}`).not.toEqual(words);

    // 换个思路：移除「I」再加回，同样落到末尾
    const second = (builtChips(page)[1].textContent ?? "").trim();
    await activate(builtChips(page)[1]);
    await activate(bankWord(page, second));
    const after2 = builtWords(page);
    log(`[DG5] 改为移除并加回「${second}」：${JSON.stringify(after2)}；目标=${JSON.stringify(words)}`);
    expect(after2, "任何「移除+重加」都只能追加到末尾").not.toEqual(words);

    // 穷举所有「移除一块 + 加回一块」的组合，证明没有一个能到达答案序
    const attempts: string[] = [];
    for (let pos = 0; pos < wrong.length; pos += 1) {
      // 重置到错序
      for (let guard = 0; guard < 20 && builtChips(page).length > 0; guard += 1) {
        await activate(builtChips(page)[0]);
      }
      for (const word of wrong) await activate(bankWord(page, word));
      const word = (builtChips(page)[pos].textContent ?? "").trim();
      await activate(builtChips(page)[pos]);
      await activate(bankWord(page, word));
      attempts.push(builtWords(page).join(" "));
    }
    const solved = attempts.filter((text) => text === words.join(" "));
    log(`[DG5] 穷举「移除第 i 块再加回」全部 ${attempts.length} 种：得到答案序的有 ${solved.length} 种`);
    expect(solved.length, "单次移除+重加永远到不了答案序（只能 append）").toBe(0);
    page.unmount();
  });

  it("对照：同一道题、同一个错序，拖拽能修好（证明缺口只在键盘路径）", async () => {
    seedDragStorage();
    const page = mount();
    await flushAsync();
    await reachGuided(page);
    const step = guidedArrangeStep(0);
    const words = step.answer.split(" ");
    const wrong = [words[1], words[0], ...words.slice(2)];
    for (const word of wrong) await activate(bankWord(page, word));
    expect(builtWords(page)).toEqual(wrong);
    expect(feedbackState(page)).toBe("retry");

    dragTo(builtChips(page)[0], builtChips(page)[2]);
    const after = builtWords(page);
    log(`[DG5] 拖拽修序：${JSON.stringify(wrong)} -> ${JSON.stringify(after)}｜反馈=${feedbackState(page)}`);
    expect(after, "拖拽能修好键盘修不好的顺序").toEqual(words);
    expect(feedbackState(page), "修好后判通过").toBe("pass");
    page.unmount();
  });

  it("事实清单：拼装区可聚焦元素与各自的可达操作", async () => {
    seedDragStorage();
    const page = mount();
    await flushAsync();
    await reachGuided(page);
    await activate(bankWord(page, guidedArrangeStep(0).answer.split(" ")[0]));
    const area = page.container.querySelector(".lesson-arrange")!;
    const rows = Array.from(area.querySelectorAll<HTMLElement>("button, [tabindex]")).map((el) => ({
      tag: el.tagName.toLowerCase(),
      cls: el.className,
      draggable: el.getAttribute("draggable"),
      label: el.getAttribute("aria-label") ?? (el.textContent ?? "").trim().slice(0, 12),
      title: el.getAttribute("title") ?? ""
    }));
    log(`[DG5] 拼装区可聚焦元素清单：\n${JSON.stringify(rows, null, 1)}`);
    const builtTitle = rows.find((row) => row.cls.includes("built"))?.title ?? "";
    expect(builtTitle, "「拖动调整位置」的提示只存在于 title（键盘可聚焦但读不到这句提示）").toContain("拖动");
    // 橡皮擦按钮是唯一带 aria-label 的工具按钮，但它只能移除最后一个
    const eraserRow = rows.find((row) => row.label === "移除最后一个词");
    expect(eraserRow, "撤销工具按钮存在且有可读名").toBeTruthy();
    expect(eraserRow!.title).toBe("移除最后一个词");
    page.unmount();
  });
});
