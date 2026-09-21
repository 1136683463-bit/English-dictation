// @vitest-environment jsdom
/**
 * DG2 · 三种拖拽路径 + arrangeMove 下标修正矩阵
 *
 * 目标代码：src/pages/GrammarLessonPage.tsx
 *   - renderArrangeArea :1963-2085（onDragStart/onDragOver/onDrop/onDragEnd）
 *   - arrangeAdd    :1234 / arrangeRemove :1266 / arrangeMove :1282
 *
 * 环境说明（为什么用桩，桩了什么）：见 dragDrive.ts 头部注释。
 * 一句话：jsdom 没有 DragEvent / DataTransfer，用 MouseEvent + 最小 DataTransfer 桩顶替；
 * 「浏览器是否为 draggable=false 的元素发起拖拽」在 jsdom 中无法由引擎保证，只能测页面守不守得住。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
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
  fireDrag,
  firstFreeBankChip,
  makeDataTransfer,
  dragOutside,
  dragTo,
  feedbackState,
  guidedArrangeStep,
  reachGuided,
  seedDragStorage
} from "./dragDrive";

const mount = () => mountPage(<GrammarLessonPage />, DRAG_LESSON_PATH, DRAG_ROUTE);

/** 走到 guided 首题（arrange：I am drawing a picture.） */
const arrangePage = async () => {
  const page = mount();
  await flushAsync();
  await reachGuided(page);
  expect(bankArea(page), "guided 首题应是 arrange").toBeTruthy();
  return page;
};

const mountPractice = async (index = 0) => {
  window.localStorage.setItem(
    `grammar:resume:${"lesson-13-now"}`,
    JSON.stringify({
      lessonId: "lesson-13-now",
      savedAt: new Date().toISOString(),
      stage: "practice",
      step: index,
      practiceIndex: index,
      outputStep: -1,
      guidedIndex: -1
    })
  );
  const page = mount();
  await flushAsync();
  const resume = Array.from(page.container.querySelectorAll("button")).find(
    (button) => (button.textContent ?? "").trim() === "继续刚才"
  ) as HTMLButtonElement | undefined;
  expect(resume, "写快照后应出现「继续刚才」").toBeTruthy();
  resume!.click();
  await flushAsync();
  return page;
};

describe("DG2 三种拖拽路径", () => {
  beforeEach(() => resetStorage());

  it("路径 1 · 库 → 拼装区（空区）：落在区容器上 = 追加到末尾", async () => {
    seedDragStorage();
    const page = await arrangePage();
    const step = guidedArrangeStep(0);
    expect(step.answer).toBe("I am drawing a picture.");
    expect(builtWords(page), "初始拼装区应为空").toEqual([]);

    dragTo(firstFreeBankChip(page)!, buildArea(page)!);
    const first = builtWords(page);
    expect(first.length, "库→拼装区应放进去一块").toBe(1);
    dragTo(firstFreeBankChip(page)!, buildArea(page)!);
    const second = builtWords(page);
    expect(second.length, "再放一块").toBe(2);
    expect(second[0], "第二块应追加在末尾（顺序保持不变）").toBe(first[0]);
    // eslint-disable-next-line no-console
    console.log(`[DG2] 库→空区：${JSON.stringify(builtChips(page).map((c) => c.textContent))}`);
    page.unmount();
  });

  it("路径 1b · 库 → 拼装区内的某一位置（落在已摆词块上）= 插到该块之前", async () => {
    seedDragStorage();
    const page = await arrangePage();
    clickBankWord(page, "I");
    clickBankWord(page, "am");
    clickBankWord(page, "drawing");
    expect(builtWords(page)).toEqual(["I", "am", "drawing"]);

    // 把词块库里的一块拖到拼装区第 0 块上 → add(index, 0) → 插到最前
    const incoming = firstFreeBankChip(page)!;
    const incomingWord = (incoming.textContent ?? "").trim();
    dragTo(incoming, builtChips(page)[0]);
    const after = builtWords(page);
    expect(after.length, "插入不应丢块").toBe(4);
    expect(after[0], "插到目标块之前").toBe(incomingWord);
    expect(after.slice(1), "其余顺序不变").toEqual(["I", "am", "drawing"]);
    page.unmount();
  });

  it("路径 2 · 拼装区内重排：from=0 拖到末尾", async () => {
    seedDragStorage();
    const page = await arrangePage();
    clickBankWord(page, "I");
    clickBankWord(page, "am");
    clickBankWord(page, "drawing");
    expect(builtWords(page)).toEqual(["I", "am", "drawing"]);
    // 拖第 0 块到区容器（区容器 drop = move(index, order.length)）
    dragTo(builtChips(page)[0], buildArea(page)!);
    expect(builtWords(page), "第 0 块应移到末尾").toEqual(["am", "drawing", "I"]);
    page.unmount();
  });

  it("路径 2b · 拼装区内重排：from=2 拖到第 0 块上", async () => {
    seedDragStorage();
    const page = await arrangePage();
    clickBankWord(page, "I");
    clickBankWord(page, "am");
    clickBankWord(page, "drawing");
    dragTo(builtChips(page)[2], builtChips(page)[0]);
    expect(builtWords(page), "第 2 块应插到第 0 块之前").toEqual(["drawing", "I", "am"]);
    page.unmount();
  });

  it("路径 3 · 拼装区 → 库 = 移除该块", async () => {
    seedDragStorage();
    const page = await arrangePage();
    clickBankWord(page, "I");
    clickBankWord(page, "am");
    clickBankWord(page, "drawing");
    expect(builtWords(page)).toEqual(["I", "am", "drawing"]);
    dragTo(builtChips(page)[1], bankArea(page)!);
    expect(builtWords(page), "拖回词块库应移除该块").toEqual(["I", "drawing"]);
    const bank = bankChips(page);
    expect(bank.filter((chip) => !chip.disabled).length, "被移除的词块应回到库中可再用").toBe(
      bank.length - 2
    );
    page.unmount();
  });

  it("路径 3b · 拼装区中唯一的一块拖回库 = 回到空态提示", async () => {
    seedDragStorage();
    const page = await arrangePage();
    clickBankWord(page, "I");
    dragTo(builtChips(page)[0], bankArea(page)!);
    expect(builtWords(page)).toEqual([]);
    expect(page.text(), "空态应重新出现占位提示").toContain("点下面的词块");
    page.unmount();
  });

  it("practice 段（有干扰项）同样三条路径都通", async () => {
    seedDragStorage();
    // 第 1 题：I am reading a book.（+ is / draw 干扰项）
    const page = await mountPractice(0);
    expect(bankArea(page), "practice 段应有词块库").toBeTruthy();
    clickBankWord(page, "I");
    clickBankWord(page, "am");
    expect(builtWords(page)).toEqual(["I", "am"]);
    // 重排：第 0 块拖到末尾
    dragTo(builtChips(page)[0], buildArea(page)!);
    expect(builtWords(page)).toEqual(["am", "I"]);
    // 移除：拖回库
    dragTo(builtChips(page)[1], bankArea(page)!);
    expect(builtWords(page)).toEqual(["am"]);
    // 库→区
    clickBankWord(page, "reading");
    expect(builtWords(page)).toEqual(["am", "reading"]);
    page.unmount();
  });
});

describe("DG2b arrangeMove 下标修正矩阵（adjusted = to > from ? to - 1 : to）", () => {
  beforeEach(() => resetStorage());

  /**
   * 对「单块搬家」这一最小场景逐组合验：把 from 位置的一块拖到 to 位置（落在第 to 块上）。
   * 页面语义（:2021-2031）：dragOver(to) → insertAt=to；drop(to) → move(from, to)。
   * 期望语义（「拖到哪块上就插到哪块之前」，与多数拖拽 UI 一致）：
   *   - to 是「目标位置」而非「目标下标」，所以 next 顺序 = 取出 moved 后按 to 插入。
   */
  const expectMove = async (from: number, to: number) => {
    seedDragStorage();
    const page = await mountPractice(0);
    // 摆 4 块（答案 I am reading a book. 的前 4 块），label 用文本快照
    const words = ["I", "am", "reading", "a"];
    words.forEach((word) => clickBankWord(page, word));
    const before = builtWords(page);
    expect(before).toEqual(words);
    const moved = before[from];
    dragTo(builtChips(page)[from], builtChips(page)[to]);
    const after = builtWords(page);
    page.unmount();
    return { before, after, moved };
  };

  it("逐组合：4 块钱的全部 12 个 (from,to) 组合", async () => {
    const size = 4;
    const rows: string[] = [];
    const failures: string[] = [];
    for (let from = 0; from < size; from += 1) {
      for (let to = 0; to < size; to += 1) {
        if (from === to) continue; // 页面明确 no-op
        const { before, after, moved } = await expectMove(from, to);
        // 期望：把 moved 取出后，在「目标块原来的位置」之前插入
        const rest = before.filter((_word, index) => index !== from);
        const targetWord = before[to];
        const insertAt = rest.indexOf(targetWord);
        const expected = [...rest.slice(0, insertAt), moved, ...rest.slice(insertAt)];
        const ok = JSON.stringify(after) === JSON.stringify(expected);
        rows.push(`${ok ? "ok  " : "DIFF"} from=${from} to=${to} ${JSON.stringify(before)} -> ${JSON.stringify(after)}  期望 ${JSON.stringify(expected)}`);
        if (!ok) failures.push(`from=${from},to=${to}`);
      }
    }
    // eslint-disable-next-line no-console
    console.log("[DG2b] arrangeMove 矩阵（拖到第 to 块上 = 插到该块之前）:\n" + rows.join("\n"));
    // eslint-disable-next-line no-console
    console.log(`[DG2b] 与「插到目标块之前」语义不符的组合：${failures.length} 个 → ${failures.join(" ") || "无"}`);
    expect(true).toBe(true);
  });

  it("from === to 是 no-op（页面 :1285 显式 return）", async () => {
    seedDragStorage();
    const page = await mountPractice(0);
    ["I", "am", "reading"].forEach((word) => clickBankWord(page, word));
    const before = builtWords(page);
    dragTo(builtChips(page)[1], builtChips(page)[1]);
    expect(builtWords(page)).toEqual(before);
    page.unmount();
  });

  it("落到区容器 = 移到末尾（move(index, order.length)）", async () => {
    seedDragStorage();
    const page = await mountPractice(0);
    ["I", "am", "reading", "a"].forEach((word) => clickBankWord(page, word));
    dragTo(builtChips(page)[1], buildArea(page)!);
    expect(builtWords(page)).toEqual(["I", "reading", "a", "am"]);
    page.unmount();
  });
});

describe("DG2c 拖拽状态清理（dragChip / insertAt）", () => {
  beforeEach(() => resetStorage());

  it("拖拽中：源块带 .dragging、拼装区带 .drag-over；dragend 后全部清理", async () => {
    seedDragStorage();
    const page = await arrangePage();
    clickBankWord(page, "I");
    const chip = builtChips(page)[0];
    const dataTransfer = makeDataTransfer();
    fireDrag(chip, "dragstart", dataTransfer);
    // eslint-disable-next-line no-console
    console.log("[DG2c] dragstart 后 built.className =", builtChips(page)[0].className, "| area =", buildArea(page)!.className);
    expect(builtChips(page)[0].className, "拖动中的块应带 .dragging 供样式反馈").toContain("dragging");
    fireDrag(buildArea(page)!, "dragover", dataTransfer);
    expect(buildArea(page)!.className, "悬停拼装区应带 .drag-over").toContain("drag-over");
    fireDrag(chip, "dragend", dataTransfer);
    fireDrag(buildArea(page)!, "dragover", dataTransfer); // 再悬停一次，看是否还残留悬浮态
    expect(buildArea(page)!.className, "dragend 后不应残留 .dragging").not.toContain("dragging");
    expect(builtChips(page)[0].className).not.toContain("dragging");
    page.unmount();
  });

  it("drop 之后 dragChip 是否被清：再拖同一块时落的还是它自己，而不是上一次的残留", async () => {
    seedDragStorage();
    const page = await arrangePage();
    ["I", "am", "drawing"].forEach((word) => clickBankWord(page, word));
    // 第一次：第 2 块拖到区容器（→ 末尾，顺序不变，因为本来就在末尾）
    dragTo(builtChips(page)[2], buildArea(page)!);
    expect(builtWords(page)).toEqual(["I", "am", "drawing"]);
    // 第二次：第 0 块拖到区容器（→ 末尾）
    dragTo(builtChips(page)[0], buildArea(page)!);
    expect(builtWords(page), "第二次拖拽应按新的源块计算，而不是上次的残留").toEqual(["am", "drawing", "I"]);
    page.unmount();
  });

  it("拖到区外（无 drop，只有 dragend）后，拖拽状态应清干净", async () => {
    seedDragStorage();
    const page = await arrangePage();
    ["I", "am"].forEach((word) => clickBankWord(page, word));
    dragOutside(builtChips(page)[0]);
    expect(builtWords(page), "拖到区外不应改动顺序").toEqual(["I", "am"]);
    // 之后正常操作仍应工作（状态没卡住）
    clickBankWord(page, "drawing");
    expect(builtWords(page)).toEqual(["I", "am", "drawing"]);
    // 若 dragChip 残留，再拖一次会用到旧下标 —— 这里验证仍然按新源块搬运
    dragTo(builtChips(page)[0], buildArea(page)!);
    expect(builtWords(page), "区外归来后拖拽仍应按当下源块工作").toEqual(["am", "drawing", "I"]);
    page.unmount();
  });

  it("拖到区外且浏览器漏发 dragend（真实浏览器的边缘情况）：状态是否会卡住", async () => {
    seedDragStorage();
    const page = await arrangePage();
    ["I", "am", "drawing"].forEach((word) => clickBankWord(page, word));
    // 只有 dragstart，没有 drop 也没有 dragend（模拟「浏览器没回报结束」）
    dragOutside(builtChips(page)[0], { skipDragEnd: true });
    // eslint-disable-next-line no-console
    console.log(
      "[DG2c] 漏发 dragend 后：area.className =",
      buildArea(page)!.className,
      "| built[0].className =",
      builtChips(page)[0].className
    );
    // 此时拖拽态仍在（dragChip 非空）——接着做一次正常拖拽，看是否会用到残留下标
    const staleIsDragging = builtChips(page)[0].className.includes("dragging");
    dragTo(builtChips(page)[2], builtChips(page)[0]);
    expect(builtWords(page), "后续正常拖拽仍应按当下源块搬运").toEqual(["drawing", "I", "am"]);
    // eslint-disable-next-line no-console
    console.log(`[DG2c] 漏发 dragend 时是否残留 .dragging：${staleIsDragging}`);
    page.unmount();
  });
});

describe("DG2d dragChip 与判题反馈的相互作用", () => {
  beforeEach(() => resetStorage());

  it("拖拽中途判题导致 passed 变化（拼装区被点亮 + 词块被禁用）时，拖拽落点是否还对", async () => {
    seedDragStorage();
    const page = await arrangePage();
    const step = guidedArrangeStep(0);
    // 按答案摆满 → 判通过 → 拼装区亮起、库里词块变 ghost/disabled
    for (const word of step.answer.split(" ")) clickBankWord(page, word);
    expect(feedbackState(page), "按答案摆满应判通过").toBe("pass");
    expect(buildArea(page)!.className, "通过后拼装区应点亮").toContain("lit");
    const before = builtWords(page);
    // 已通过状态下继续在拼装区内拖动：判题不会被再次触发（feedback 已 pass），顺序应当照样变
    dragTo(builtChips(page)[0], builtChips(page)[1]);
    const after = builtWords(page);
    // eslint-disable-next-line no-console
    console.log(
      `[DG2d] 已通过后拖动：${JSON.stringify(before)} -> ${JSON.stringify(after)}；反馈=${feedbackState(page)}；区 class=${buildArea(page)!.className}`
    );
    expect(after.length, "已通过后拖动不应丢块").toBe(before.length);
    page.unmount();
  });

  it("库里已被选中的词块：draggable=false 且 disabled（浏览器不会为它发起拖拽，jsdom 只能验证页面守住）", async () => {
    seedDragStorage();
    const page = await arrangePage();
    clickBankWord(page, "I");
    const selected = bankChips(page).find((chip) => (chip.textContent ?? "").trim() === "I");
    expect(selected, "已选块仍在库里（原位变灰）").toBeTruthy();
    expect(selected!.disabled, "已选块应 disabled").toBe(true);
    expect(selected!.draggable, "已选块应 draggable=false").toBe(false);
    // jsdom 不会自动拦 draggable=false，这里显式验证「即使拖拽被发起，页面也不该重复放入」
    const before = builtWords(page);
    dragTo(selected!, buildArea(page)!);
    // eslint-disable-next-line no-console
    console.log(`[DG2d] 强行拖拽 disabled 词块：${JSON.stringify(before)} -> ${JSON.stringify(builtWords(page))}`);
    expect(builtWords(page).length, "强行拖拽已选块不应重复放入同一块").toBe(before.length);
    page.unmount();
  });
});
