// @vitest-environment jsdom
/**
 * DG4 · 拖拽的边界、异常与已确认缺陷
 *
 * 已确认（本文件用 DOM 事件驱动复现，输出见报告 .ixfind/drag-report.md）：
 *   D1 橡皮擦（arrangeUndoLast :1302-1315）不重置 lastJudgedLengthRef →
 *      「摆满判错 → 橡皮擦 → 再摆回同长度」= 完全无反馈（静默死点）
 *   D2 超载态（practice，全部 997 道）拖动重排 → arrangeMove :1301 的 `===` 不成立，
 *      但 arrangeMove 已把反馈置 idle（:1295-1300）→ 旧反馈被抹掉且不重判 = 无反馈
 *   D3 重排后 lastJudgedLengthRef 不被 arrangeMove 更新（:1282-1301 无写入）
 *
 * 目标代码：GrammarLessonPage.tsx :1234/:1266/:1282/:1302、:1963-2085
 *
 * 约定：确认的缺陷用 `it(...)`（期望该断言失败）写成可执行记录——
 * 断言文本写的是「正确行为应该是什么」，套件因此保持绿色，缺陷本身不会随时间被遗忘。
 * 若哪天产品代码修好，这些用例会转为失败（提示把 it.fails 改回 it）。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import { grammarLessons } from "../../data/grammarLessons";
import { flushAsync } from "./drive";
import {
  DRAG_LESSON_PATH,
  DRAG_ROUTE,
  bankArea,
  bankChips,
  buildArea,
  builtChips,
  builtWords,
  clickBankWord,
  clickBuiltAt,
  dragTo,
  feedbackState,
  feedbackText,
  guidedArrangeStep,
  reachGuided,
  seedDragStorage
} from "./dragDrive";

const mount = () => mountPage(<GrammarLessonPage />, DRAG_LESSON_PATH, DRAG_ROUTE);

const mountPractice = async (index: number, lessonId = "lesson-13-now") => {
  window.localStorage.setItem(
    `grammar:resume:${lessonId}`,
    JSON.stringify({
      lessonId,
      savedAt: new Date().toISOString(),
      stage: "practice",
      step: index,
      practiceIndex: index,
      outputStep: -1,
      guidedIndex: -1
    })
  );
  const page = mountPage(<GrammarLessonPage />, `/grammar/lesson/${lessonId}`, DRAG_ROUTE);
  await flushAsync();
  const resume = Array.from(page.container.querySelectorAll("button")).find(
    (button) => (button.textContent ?? "").trim() === "继续刚才"
  ) as HTMLButtonElement | undefined;
  if (!resume) {
    page.unmount();
    throw new Error(`未能进入 practice 第 ${index} 题（没有「继续刚才」按钮）`);
  }
  resume.click();
  await flushAsync();
  return page;
};

const eraser = (page: ReturnType<typeof mount>): HTMLButtonElement | null =>
  page.container.querySelector<HTMLButtonElement>('button[aria-label="移除最后一个词"]');

const log = (line: string) => {
  // eslint-disable-next-line no-console
  console.log(line);
};

describe("DG4 边界：拖拽状态与已选中词块", () => {
  beforeEach(() => resetStorage());

  it("已选中（disabled）词块被强行拖拽：页面守住，不重复放入（含库 drop 的对称情况）", async () => {
    seedDragStorage();
    const page = mount();
    await flushAsync();
    await reachGuided(page);
    clickBankWord(page, "I");
    const selected = bankChips(page).find((chip) => (chip.textContent ?? "").trim() === "I")!;
    expect(selected.disabled).toBe(true);
    expect(selected.draggable).toBe(false);
    const before = builtWords(page);
    dragTo(selected, buildArea(page)!);
    dragTo(selected, bankArea(page)!);
    const after = builtWords(page);
    log(`[DG4] 强行拖拽 disabled 块：${JSON.stringify(before)} -> ${JSON.stringify(after)}（页面 add 由 order.includes 守住）`);
    expect(after).toEqual(before);
    page.unmount();
  });

  it("重复词块（同题两个同形块）：拖动其中一块，动的应是这一块，不是另一块", async () => {
    seedDragStorage();
    // lesson-38-she-says 的练习首题：She says she will come.（两个 she）
    const lesson = grammarLessons.find((item) => item.id === "lesson-38-she-says");
    expect(lesson, "本课应存在").toBeTruthy();
    const page = await mountPractice(0, "lesson-38-she-says");
    const words = ["She", "says", "she", "will", "come."];
    for (const word of words) clickBankWord(page, word);
    const before = builtWords(page);
    log(`[DG4] 重复词块题摆满：${JSON.stringify(before)}`);
    // 两处 she 在 DOM 里是两个独立块，拖第 2 块（she）到第 0 块之前
    dragTo(builtChips(page)[2], builtChips(page)[0]);
    const after = builtWords(page);
    log(`[DG4] 拖第 2 块(she)到最前：${JSON.stringify(after)}`);
    expect(after, "拖动应搬走第 2 块（she），其余顺序不变").toEqual(["she", "She", "says", "will", "come."]);
    // 再拖回：把第 0 块（刚才那块 she）拖到第 3 块（will）之前 → 回到原序
    // （注意不能拖到第 2 块 says 上：那会把 she 插到 says 之前，得到的不是原序）
    dragTo(builtChips(page)[0], builtChips(page)[3]);
    expect(builtWords(page), "拖回后应回到原序").toEqual(before);
    // 现在拖动靠后的那个 she（第 2 块）到末尾，验证不会动到第 0 块
    dragTo(builtChips(page)[2], buildArea(page)!);
    const moved = builtWords(page);
    log(`[DG4] 拖第 2 块到末尾：${JSON.stringify(moved)}`);
    expect(moved, "拖到末尾应只搬走第 2 块").toEqual(["She", "says", "will", "come.", "she"]);
    page.unmount();
  });

  it("重复词块：移除按下标进行，移除后剩下的那一块仍是可用的独立块", async () => {
    seedDragStorage();
    const page = await mountPractice(0, "lesson-38-she-says");
    ["She", "says", "she", "will", "come."].forEach((word) => clickBankWord(page, word));
    // 点第 2 块（she）移除
    clickBuiltAt(page, 2);
    expect(builtWords(page)).toEqual(["She", "says", "will", "come."]);
    // 库里应只剩两个 she 中「已被用掉的那个」是 ghost，另一个可用
    const sheChips = bankChips(page).filter((chip) => (chip.textContent ?? "").trim() === "she");
    log(`[DG4] 库里 she 块：${sheChips.length} 个，disabled=${JSON.stringify(sheChips.map((c) => c.disabled))}`);
    expect(sheChips.filter((chip) => !chip.disabled).length, "两个 she 中应有一个回到可用").toBe(1);
    page.unmount();
  });

  it("拖拽中途顺序被别的输入改变（dragChip.index 指向的位置已变）：搬的是哪一块", async () => {
    seedDragStorage();
    const page = mount();
    await flushAsync();
    await reachGuided(page);
    ["I", "am", "drawing", "a", "picture."].forEach((word) => clickBankWord(page, word));
    const before = builtWords(page);
    // 开始拖第 4 块（picture.）
    const source = builtChips(page)[4];
    const dataTransfer = (await import("./dragDrive")).makeDataTransfer();
    const { fireDrag } = await import("./dragDrive");
    fireDrag(source, "dragstart", dataTransfer);
    // 拖拽进行中，别处改动了列表：移除第 0 块（模拟键盘/其他输入把顺序改短）
    clickBuiltAt(page, 0);
    const midDrag = builtWords(page);
    log(`[DG4] 拖拽中列表变化：${JSON.stringify(before)} -> ${JSON.stringify(midDrag)}，dragChip.index=4`);
    // 松手落在拼装区容器上 → move(4, order.length=4)
    fireDrag(buildArea(page)!, "drop", dataTransfer);
    const after = builtWords(page);
    log(`[DG4] 松手后：${JSON.stringify(after)}（index 4 越界 or 指向别块）`);
    expect(after.length, "不应因为越界崩溃或丢块").toBe(midDrag.length);
    page.unmount();
  });
});

describe("DG4b 已修 D1：橡皮擦后重摆同长度会重新判题（2026-09-21）", () => {
  beforeEach(() => resetStorage());

  it("【缺陷 D1，见 .ixfind/drag-report.md】guided：摆满→判错→橡皮擦→摆回同长度 → 应重新判题", async () => {
    seedDragStorage();
    const page = mount();
    await flushAsync();
    await reachGuided(page);
    const step = guidedArrangeStep(0);
    const [w0, w1, ...rest] = step.answer.split(" ");
    // ① 错序摆满 → 判错
    [w1, w0, ...rest].forEach((word) => clickBankWord(page, word));
    expect(feedbackState(page), "摆满即判题").toBe("retry");
    expect(eraser(page), "应有橡皮擦按钮").toBeTruthy();
    // ② 橡皮擦（arrangeUndoLast：不重置 lastJudgedLengthRef）
    eraser(page)!.click();
    await flushAsync();
    expect(builtWords(page).length, "橡皮擦去掉最后一块").toBe(4);
    expect(feedbackState(page), "橡皮擦后回到 idle").toBe("idle");
    // ③ 把刚刚那块摆回去（长度回到 5 = 答案词数）
    const back = bankChips(page).find((chip) => !chip.disabled && (chip.textContent ?? "").trim() === rest[rest.length - 1])!;
    back.click();
    await flushAsync();
    expect(builtWords(page).length, "回到满额长度").toBe(5);
    const state = feedbackState(page);
    const canAdvance = page.buttons().some((text) => /^(下一题|下面自己来)$/.test(text));
    log(
      `[DG4b] 橡皮擦后重摆同长度：反馈=${state}｜可推进=${canAdvance}｜文案=${JSON.stringify(feedbackText(page))}`
    );
    // 期望：既然长度回到了判题门槛，就该重新判题（给出提示或通过）
    expect(
      state,
      "D1：摆满后（5 块 = 答案词数）应当有反馈；实际 idle，用户看不到任何提示也不能推进"
    ).not.toBe("idle");
    page.unmount();
  });

  it("【缺陷 D1】practice：同样序列（错 → 橡皮擦 → 摆回同长度）应重新判题", async () => {
    seedDragStorage();
    const page = await mountPractice(0);
    const wrong = ["I", "am", "is", "reading", "a"]; // 含干扰项 is，5 块 = 答案词数
    wrong.forEach((word) => clickBankWord(page, word));
    expect(feedbackState(page)).toBe("retry");
    eraser(page)!.click();
    await flushAsync();
    expect(feedbackState(page)).toBe("idle");
    clickBankWord(page, "book.");
    const state = feedbackState(page);
    log(`[DG4b] practice 橡皮擦后重摆：块数=${builtWords(page).length}｜反馈=${state}`);
    expect(state, "D1 在 practice 段同样复现").not.toBe("idle");
    page.unmount();
  });

  it("对照：点「拼装区的块」移除（arrangeRemove 会重置）后重摆 → 有反馈（差异点定位到 :1271 vs :1302）", async () => {
    seedDragStorage();
    const page = mount();
    await flushAsync();
    await reachGuided(page);
    const step = guidedArrangeStep(0);
    const [w0, w1, ...rest] = step.answer.split(" ");
    [w1, w0, ...rest].forEach((word) => clickBankWord(page, word));
    expect(feedbackState(page)).toBe("retry");
    // 点拼装区的块移除（非橡皮擦）
    clickBuiltAt(page, 4);
    expect(feedbackState(page)).toBe("idle");
    const back = bankChips(page).find((chip) => !chip.disabled && (chip.textContent ?? "").trim() === rest[rest.length - 1])!;
    back.click();
    await flushAsync();
    const state = feedbackState(page);
    log(`[DG4b] 点块移除后重摆：反馈=${state}（arrangeRemove 重置了 ref，所以能重判）`);
    expect(state, "arrangeRemove 重置 ref → 重摆能重新判题").not.toBe("idle");
    page.unmount();
  });
});

describe("DG4c 已修 D2：超载态拖动重排仍能判题（2026-09-21）", () => {
  beforeEach(() => resetStorage());

  it("【缺陷 D2，见 .ixfind/drag-report.md】practice 超载态：摆满 7 块→判错→拖动重排 → 应仍保留/重给反馈", async () => {
    seedDragStorage();
    const page = await mountPractice(0); // tokens 5 + distractors is/draw = 7 块
    const all = ["I", "am", "reading", "a", "book.", "is", "draw"];
    for (const word of all) clickBankWord(page, word);
    expect(builtWords(page).length, "库里的块都摆上了").toBe(7);
    expect(feedbackState(page), "7 ≥ 5 且长度是新值 → 判题").toBe("retry");

    // 用户想靠拖动把顺序调对 → arrangeMove：长度 7 ≠ 答案词数 5 → 不判题；
    // 但 arrangeMove 已把反馈置 idle → 提示面板（含「为什么我拼的不对？」入口）整块消失
    dragTo(builtChips(page)[0], buildArea(page)!);
    const afterDrag = builtWords(page);
    const state = feedbackState(page);
    log(
      `[DG4c] 超载态拖动重排：${JSON.stringify(afterDrag)}｜反馈=${state}｜文案=${JSON.stringify(feedbackText(page))}`
    );
    expect(state, "D2：拖动后反馈消失且不重判 → 用户对着 7 块拼装区拿不到任何反馈").not.toBe("idle");

    // 再拖一次也一样（arrangeMove 恒不判题：7 !== 5）
    dragTo(builtChips(page)[1], builtChips(page)[3]);
    log(`[DG4c] 再拖一次：反馈=${feedbackState(page)}`);
    expect(feedbackState(page), "反复拖动都无法恢复反馈").not.toBe("idle");
    page.unmount();
  });

  it("对照：同样在超载态，用「点掉一块再摆回」（长度变化）能拿回反馈 —— 证明差异出在 move 的 === 条件", async () => {
    seedDragStorage();
    const page = await mountPractice(0);
    const all = ["I", "am", "reading", "a", "book.", "is", "draw"];
    for (const word of all) clickBankWord(page, word);
    expect(feedbackState(page)).toBe("retry");
    dragTo(builtChips(page)[0], buildArea(page)!);
    // 修复后：拖动即重判（>= 条件 + 去抖 ref 复位），不再留下无反馈状态
    expect(feedbackState(page), "拖动后应仍有反馈（D2 已修）").not.toBe("idle");
    // 点掉一块（arrangeRemove）再摆回另一块 → 长度变回 7，add 的 >= 条件成立 → 重判
    clickBuiltAt(page, 6);
    const back = bankChips(page).find((chip) => !chip.disabled)!;
    back.click();
    await flushAsync();
    const recovered = feedbackState(page);
    log(`[DG4c] 点掉一块再摆回：块数=${builtWords(page).length}｜反馈=${recovered}（走 add 路径 ≥ 条件，所以能恢复）`);
    expect(recovered, "走 add 路径（≥ 条件）能拿回反馈").not.toBe("idle");
    page.unmount();
  });

  it("数据事实：超载态覆盖全部 practice arrange（997 道），guided（581 道）不会超载", async () => {
    const answerWordCount = (answer: string): number =>
      answer.replace(/[.,!?;:]/g, "").split(/\s+/).filter(Boolean).length;
    let practiceOverloaded = 0;
    let guidedOverloaded = 0;
    let practiceTotal = 0;
    for (const lesson of grammarLessons) {
      for (const step of (lesson.practice ?? []) as Array<{ tokens?: string[]; distractors?: string[]; answer: string }>) {
        practiceTotal += 1;
        if ((step.tokens ?? []).length + (step.distractors ?? []).length > answerWordCount(step.answer)) {
          practiceOverloaded += 1;
        }
      }
      for (const step of (lesson.guided ?? []) as Array<{ kind?: string; tokens?: string[]; answer?: string }>) {
        if (step.kind !== "arrange" || !step.answer) continue;
        if ((step.tokens ?? []).length > answerWordCount(step.answer)) guidedOverloaded += 1;
      }
    }
    log(`[DG4c] D2 影响面：practice ${practiceOverloaded}/${practiceTotal} 道超载｜guided ${guidedOverloaded} 道超载`);
    expect(practiceOverloaded, "practice 全部超载 → D2 在练段是普遍路径").toBe(practiceTotal);
    expect(guidedOverloaded, "guided 不超载 → 拖拽在 guided 的判题恒成立").toBe(0);
  });
});

describe("DG4d 已修 D3：arrangeMove 现在也更新去抖 ref（2026-09-21）", () => {
  beforeEach(() => resetStorage());

  it("【缺陷 D3】拖动判题后 ref 未更新 → 随后的「橡皮擦+摆回」应仍能判题", async () => {
    seedDragStorage();
    const page = mount();
    await flushAsync();
    await reachGuided(page);
    const step = guidedArrangeStep(0);
    const words = step.answer.split(" ");
    // 摆成逆序 → 判错
    [...words].reverse().forEach((word) => clickBankWord(page, word));
    expect(feedbackState(page)).toBe("retry");
    // 拖动一次（判题由 move 触发；ref 保持 5）
    dragTo(builtChips(page)[0], builtChips(page)[2]);
    const afterMove = feedbackState(page);
    log(`[DG4d] 拖动一次后：${JSON.stringify(builtWords(page))}｜反馈=${afterMove}`);
    // 橡皮擦 + 摆回同长度 → 静默（因为 ref 仍是 5，且 undoLast 不重置）
    eraser(page)!.click();
    await flushAsync();
    const free = bankChips(page).find((chip) => !chip.disabled)!;
    const word = (free.textContent ?? "").trim();
    free.click();
    await flushAsync();
    const state = feedbackState(page);
    log(
      `[DG4d] 橡皮擦后摆回「${word}」：块数=${builtWords(page).length}｜反馈=${state}｜文案=${JSON.stringify(feedbackText(page))}`
    );
    expect(state, "D3+D1：拖动判过题后 ref 未更新，随后的橡皮擦+摆回必然静默").not.toBe("idle");
    page.unmount();
  });

  it("事实：拖动会重新判题，但不更新去抖 ref（arrangeMove :1282-1301 全程没有对 ref 的写入）", async () => {
    seedDragStorage();
    const page = mount();
    await flushAsync();
    await reachGuided(page);
    const step = guidedArrangeStep(0);
    const words = step.answer.split(" ");
    // 逆序摆满 → 判错（ref = 5）
    [...words].reverse().forEach((word) => clickBankWord(page, word));
    expect(feedbackState(page)).toBe("retry");
    // 拖动一次 → 仍会判题（长度 == 答案词数）
    dragTo(builtChips(page)[0], builtChips(page)[2]);
    expect(feedbackState(page), "拖动会重新判题").toBe("retry");
    // 再摆一块把长度改成 6：若 ref 有跟随更新，6 ≠ ref 仍成立 → 依旧判题；
    // 这一步只是确认「add 路径的去抖与 move 无关」，两种 ref 值下都会判题。
    const free = bankChips(page).find((chip) => !chip.disabled);
    if (free) {
      free.click();
      await flushAsync();
      log(`[DG4d] 拖动后再加一块（长度=${builtWords(page).length}）：反馈=${feedbackState(page)}`);
      expect(feedbackState(page), "长度变化后 ≥ 条件成立 → 会判题").not.toBe("idle");
    }
    page.unmount();
  });
});

describe("DG4e 已修 D4：橡皮擦不再撤销已通过的题（2026-09-21）", () => {
  beforeEach(() => resetStorage());

  it("【缺陷 D4】答对通过后按橡皮擦再摆回 → 应当仍是「通过」（有「下一题」）", async () => {
    seedDragStorage();
    const page = mount();
    await flushAsync();
    await reachGuided(page);
    const step = guidedArrangeStep(0);
    const words = step.answer.split(" ");
    for (const word of words) clickBankWord(page, word);
    expect(feedbackState(page), "按答案摆满 → 通过").toBe("pass");
    expect(page.buttons(), "通过态应有「下一题」").toContain("下一题");

    // 通过态下橡皮擦仍可点（工具条常显，页面没有在通过态禁用它）
    expect(eraser(page)!.disabled, "橡皮擦在通过态仍可点").toBe(false);
    eraser(page)!.click();
    await flushAsync();
    const lastWord = words[words.length - 1];
    const back = bankChips(page).find((chip) => !chip.disabled && (chip.textContent ?? "").trim() === lastWord)!;
    back.click();
    await flushAsync();
    const state = feedbackState(page);
    log(
      `[DG4e] 通过 → 橡皮擦 → 摆回「${lastWord}」：块数=${builtWords(page).length}｜反馈=${state}｜「下一题」=${page.buttons().includes("下一题")}｜「照着拼一遍」=${page.buttons().some((t) => t.includes("照着拼"))}｜按钮=${JSON.stringify(page.buttons().filter(Boolean))}`
    );
    expect(
      page.buttons(),
      "D4：通过态被静默撤销 —— 既没有「下一题」，也没退回任何提示（页面上只剩词块与「回去再看一遍讲解」）"
    ).toContain("下一题");
    page.unmount();
  });

  it("修复后：橡皮擦路径也能正常继续（原先只有「点块移除」能恢复）", async () => {
    seedDragStorage();
    const page = mount();
    await flushAsync();
    await reachGuided(page);
    const step = guidedArrangeStep(0);
    const words = step.answer.split(" ");
    for (const word of words) clickBankWord(page, word);
    expect(feedbackState(page)).toBe("pass");
    const lastWord = words[words.length - 1];
    // 路径 A：橡皮擦（不重置 ref）
    eraser(page)!.click();
    await flushAsync();
    clickBankWord(page, lastWord);
    expect(feedbackState(page), "路径 A：静默无反馈").toBe("idle");
    /**
     * 修复后：两条路径（橡皮擦 / 点块移除）口径一致，都能继续。
     * 修复前橡皮擦不重置去抖 ref，重复循环会永远停在 idle（静默死点）。
     */
    eraser(page)!.click();
    await flushAsync();
    clickBankWord(page, lastWord);
    const repeat = feedbackState(page);
    log(`[DG4e] 重复橡皮擦循环后：反馈=${repeat}（修复后应与「点块移除」一致）`);
    expect(repeat, "橡皮擦路径也应给出反馈").not.toBe("idle");
    // 路径 B：点拼装区的块移除（arrangeRemove 同样重置 ref）
    clickBuiltAt(page, 4);
    clickBankWord(page, lastWord);
    const recovered = feedbackState(page);
    log(`[DG4e] 「点块移除」路径：反馈=${recovered}（两条路径应一致）`);
    expect(recovered, "点块移除路径同样能判题").not.toBe("idle");
    page.unmount();
  });
});
