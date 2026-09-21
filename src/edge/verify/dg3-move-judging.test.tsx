// @vitest-environment jsdom
/**
 * DG3 · 判题去抖与拖拽的相互作用
 *
 * 目标代码：
 *   - arrangeAdd  :1259-1263  判题条件 `next.length >= answerLen && next.length !== lastJudged`
 *   - arrangeRemove :1271     重置 lastJudgedLengthRef = null
 *   - arrangeMove :1282-1301  判题条件 `next.length === answerWordCount(answer).length`（`===`）
 *   - arrangeUndoLast :1302-1315  **不**重置、也**不**判题
 *
 * 本文件回答任务里第 2、3 条问题。
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
  dragTo,
  feedbackState,
  feedbackText,
  guidedArrangeStep,
  reachGuided,
  seedDragStorage
} from "./dragDrive";

const mount = () => mountPage(<GrammarLessonPage />, DRAG_LESSON_PATH, DRAG_ROUTE);

/** practice 第 index 题（有干扰项 = 超载态） */
const mountPractice = async (index = 0) => {
  window.localStorage.setItem(
    "grammar:resume:lesson-13-now",
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

const log = (line: string) => {
  // eslint-disable-next-line no-console
  console.log(line);
};

describe("DG3 摆满后拖动重排：会不会被判题（`===` vs `>=`）", () => {
  beforeEach(() => resetStorage());

  it("guided（无干扰项，词块总数 == 答案词数）：摆满→判错→拖动重排 → 是否判题", async () => {
    seedDragStorage();
    const page = mount();
    await flushAsync();
    await reachGuided(page);
    const step = guidedArrangeStep(0);
    const answerWords = step.answer.split(" ");
    // 故意错序摆满：把第 1、2 块换位（am I drawing a picture.）
    const wrongOrder = [answerWords[1], answerWords[0], ...answerWords.slice(2)];
    wrongOrder.forEach((word) => clickBankWord(page, word));
    expect(builtWords(page)).toEqual(wrongOrder);
    const afterSettle = feedbackState(page);
    log(`[DG3] guided 摆满(错序)后反馈=${afterSettle}｜文案=${JSON.stringify(feedbackText(page).slice(0, 60))}`);
    expect(afterSettle, "摆满即判题（错序应进 retry）").toBe("retry");

    // 摆满状态下拖动重排：把第 0 块拖到末尾（顺序仍错）
    const beforeDrag = builtWords(page);
    dragTo(builtChips(page)[0], buildArea(page)!);
    const afterDrag = builtWords(page);
    const afterDragFeedback = feedbackState(page);
    log(
      `[DG3] guided 满额拖动重排：${JSON.stringify(beforeDrag)} -> ${JSON.stringify(afterDrag)}｜反馈 ${afterSettle} -> ${afterDragFeedback}`
    );
    // 记录观察（是否被重新判题：feedback 会先被 arrangeMove 置 idle，若判题则回 retry/pass）
    const judgedAgain = afterDragFeedback !== "idle";
    log(`[DG3] guided 满额拖动后是否重新判题：${judgedAgain}（反馈=${afterDragFeedback}）`);
    page.unmount();
  });

  it("practice（有干扰项，词块总数 > 答案词数）：摆满→判错→拖动重排 → 是否判题", async () => {
    seedDragStorage();
    const page = await mountPractice(0);
    // 第 1 题：I am reading a book. + 干扰项 is / draw
    // 摆满 5 块（含一个干扰项）→ 长度 == 答案词数 5
    const overloadPath = ["I", "am", "reading", "a", "is"];
    overloadPath.forEach((word) => clickBankWord(page, word));
    expect(builtWords(page)).toEqual(overloadPath);
    const afterSettle = feedbackState(page);
    log(`[DG3] practice 摆满(含干扰项)后反馈=${afterSettle}`);
    expect(afterSettle, "摆满即判题").toBe("retry");

    // 拖动重排（长度仍是 5 = 答案词数）→ arrangeMove 的 === 成立 → 应重新判题
    dragTo(builtChips(page)[4], builtChips(page)[0]);
    const afterDrag = builtWords(page);
    const afterDragFeedback = feedbackState(page);
    const judgedAgain = afterDragFeedback !== "idle";
    log(
      `[DG3] practice 满额拖动重排：${JSON.stringify(afterDrag)}｜反馈 ${afterSettle} -> ${afterDragFeedback}｜重新判题=${judgedAgain}`
    );
    page.unmount();
  });

  it("关键对照：guided 摆动到正确答案位置时，拖动能救回来吗（判题是否生效）", async () => {
    seedDragStorage();
    const page = mount();
    await flushAsync();
    await reachGuided(page);
    const step = guidedArrangeStep(0); // I am drawing a picture.
    const [w0, w1, ...rest] = step.answer.split(" ");
    // 错序摆满
    [w1, w0, ...rest].forEach((word) => clickBankWord(page, word));
    expect(feedbackState(page)).toBe("retry");
    log(`[DG3] 错序摆满：${JSON.stringify(builtWords(page))}`);
    /**
     * 注意 from=0,to=1 是 no-op（落点语义是「插到目标块之前」，把块拖到紧邻的右邻居上
     * 等于原位，见 DG2b 矩阵）。所以要交换前两块，得把它拖到第 2 块上。
     */
    dragTo(builtChips(page)[0], builtChips(page)[2]);
    const after = builtWords(page);
    const fb = feedbackState(page);
    log(`[DG3] 拖动换回答案序：${JSON.stringify(after)}｜反馈=${fb}｜文案=${JSON.stringify(feedbackText(page).slice(0, 40))}`);
    expect(after, "拖动应换回答案顺序").toEqual(step.answer.split(" "));
    // 结论断言：拖到正确答案后应当得到「通过」反馈
    expect(fb, "拖成正确答案后应判通过（若为 idle 则是卡在无反馈）").toBe("pass");
    page.unmount();
  });

  it("事实：把块拖到紧邻的右邻居上是 no-op（落点=插到目标块之前）", async () => {
    seedDragStorage();
    const page = await mountPractice(0);
    ["I", "am", "reading", "a"].forEach((word) => clickBankWord(page, word));
    const before = builtWords(page);
    dragTo(builtChips(page)[0], builtChips(page)[1]);
    log(`[DG3] 拖第 0 块到第 1 块上：${JSON.stringify(before)} -> ${JSON.stringify(builtWords(page))}（无变化）`);
    expect(builtWords(page), "相邻右邻居 = 原位，顺序不变").toEqual(before);
    // 拖到第 2 块上才是有效的「前移交换」
    dragTo(builtChips(page)[0], builtChips(page)[2]);
    expect(builtWords(page), "拖到第 2 块上 = 插到它之前（= 与前一块交换）").toEqual(["am", "I", "reading", "a"]);
    page.unmount();
  });

  it("边界：摆不满时（长度 < 答案词数）拖动，不应误判", async () => {
    seedDragStorage();
    const page = await mountPractice(0); // 答案 5 词：I am reading a book.
    ["I", "am", "reading"].forEach((word) => clickBankWord(page, word));
    expect(builtWords(page)).toEqual(["I", "am", "reading"]);
    expect(feedbackState(page), "没摆满不该判题").toBe("idle");
    // 拖动重排（长度 3 ≠ 5）
    dragTo(builtChips(page)[0], buildArea(page)!);
    const after = builtWords(page);
    const fb = feedbackState(page);
    log(`[DG3] 未摆满拖动：${JSON.stringify(after)}｜反馈=${fb}`);
    expect(after).toEqual(["am", "reading", "I"]);
    expect(fb, "未摆满时拖动不应触发判题（不误判）").toBe("idle");
    page.unmount();
  });

  it("超载态（长度 > 答案词数）下拖动的判题行为对照", async () => {
    seedDragStorage();
    const page = await mountPractice(0); // 5 词答案 + 干扰项 is/draw
    // 摆满全部 7 块 —— 但库只给 5 个答案词 + 2 个干扰项 = 7 块，全摆上
    const all = ["I", "am", "reading", "a", "book.", "is", "draw"];
    for (const word of all) {
      try {
        clickBankWord(page, word);
      } catch {
        break;
      }
    }
    const state = builtWords(page);
    const fb = feedbackState(page);
    log(`[DG3] practice 尽量摆满：块数=${state.length}｜反馈=${fb}`);
    // 拖动重排（长度若 ≠ 5，arrangeMove 的 === 不成立 → 不判题）
    if (builtChips(page).length > 1) {
      dragTo(builtChips(page)[0], buildArea(page)!);
      log(`[DG3] 超载态拖动后：块数=${builtWords(page).length}｜反馈=${feedbackState(page)}`);
    }
    page.unmount();
  });
});

describe("DG3b 去抖 ref 与拖动的相互作用序列", () => {
  beforeEach(() => resetStorage());

  it("序列：摆满→判错→拖动→再拖动：是否会被卡在无反馈（idle）", async () => {
    seedDragStorage();
    const page = await mountPractice(0); // I am reading a book. + is / draw
    const wrong = ["I", "am", "is", "reading", "a"]; // 5 块，含干扰项 is
    wrong.forEach((word) => clickBankWord(page, word));
    const s1 = feedbackState(page);
    log(`[DG3b] ① 摆满判题：${JSON.stringify(builtWords(page))} → ${s1}（去抖 ref 已置 ${builtWords(page).length}）`);
    expect(s1).toBe("retry");

    // ② 第一次拖动（长度不变 = 5，move 的 === 成立 → 判题）
    dragTo(builtChips(page)[2], builtChips(page)[0]);
    const s2 = feedbackState(page);
    log(`[DG3b] ② 首次拖动：${JSON.stringify(builtWords(page))} → ${s2}`);

    // ③ 第二次拖动
    dragTo(builtChips(page)[0], builtChips(page)[4]);
    const s3 = feedbackState(page);
    log(`[DG3b] ③ 再次拖动：${JSON.stringify(builtWords(page))} → ${s3}`);

    // ④ 第三次、第四次……
    dragTo(builtChips(page)[1], builtChips(page)[0]);
    const s4 = feedbackState(page);
    dragTo(builtChips(page)[4], builtChips(page)[2]);
    const s5 = feedbackState(page);
    log(`[DG3b] ④ 第三次拖动 → ${s4}；⑤ 第四次拖动 → ${s5}`);

    // 断言：每一次拖动后都应有反馈（pass 或 retry），不应出现 idle
    expect([s2, s3, s4, s5].includes("idle"), `拖动后不应卡在无反馈：${[s1, s2, s3, s4, s5].join("→")}`).toBe(false);
    page.unmount();
  });

  it("序列：摆满→判错→拖动→点库里的块（长度变化）→ 是否重新判题", async () => {
    seedDragStorage();
    const page = await mountPractice(0);
    ["I", "am", "is", "reading", "a"].forEach((word) => clickBankWord(page, word));
    expect(feedbackState(page)).toBe("retry");
    dragTo(builtChips(page)[0], buildArea(page)!); // 拖动，长度 5
    const afterMove = feedbackState(page);
    // 再点一块 → 长度 6 ≠ 5 → add 的 >= 成立且 length 变了 → 应重判
    try {
      clickBankWord(page, "draw");
    } catch {
      /* 无可用块则跳过 */
    }
    const afterAdd = feedbackState(page);
    log(
      `[DG3b] 拖动后=${afterMove}｜再加一块(${builtWords(page).length} 块)后=${afterAdd}｜文案=${JSON.stringify(feedbackText(page).slice(0, 50))}`
    );
    expect(afterAdd, "长度变化后应重新判题（≥ 条件）").not.toBe("idle");
    page.unmount();
  });

  it("序列：摆满→判错→移除一块→再摆满：应重新判题（arrangeRemove 重置了 ref）", async () => {
    seedDragStorage();
    const page = await mountPractice(0);
    ["I", "am", "is", "reading", "a"].forEach((word) => clickBankWord(page, word));
    expect(feedbackState(page)).toBe("retry");
    clickBuiltAt(page, 0); // 点已摆块 = 移除（arrangeRemove 重置 ref）
    const afterRemove = feedbackState(page);
    expect(afterRemove, "移除后回到无反馈").toBe("idle");
    clickBankWord(page, "book."); // 再摆满 5 块
    const afterRefill = feedbackState(page);
    log(
      `[DG3b] 移除一块后=${afterRemove}｜再摆满(${builtWords(page).length} 块)=${afterRefill}｜文案=${JSON.stringify(feedbackText(page).slice(0, 50))}`
    );
    expect(afterRefill, "移除后再摆满应重新判题").not.toBe("idle");
    page.unmount();
  });

  it("序列：摆满→判错→**只拖动**→移除→再摆回：拖动是否污染了去抖 ref", async () => {
    seedDragStorage();
    const page = await mountPractice(0);
    const wrong = ["I", "am", "is", "reading", "a"];
    wrong.forEach((word) => clickBankWord(page, word));
    expect(feedbackState(page)).toBe("retry");
    // 只拖动（不改长度）
    dragTo(builtChips(page)[0], buildArea(page)!);
    const afterMove = feedbackState(page);
    // 移除一块 → ref 重置
    clickBuiltAt(page, 0);
    expect(feedbackState(page)).toBe("idle");
    // 再摆满 → 应重判
    clickBankWord(page, "book.");
    const refilled = feedbackState(page);
    log(`[DG3b] 拖动后=${afterMove}｜移除后再摆满=${refilled}`);
    expect(refilled, "移除后重摆应重新判题").not.toBe("idle");
    page.unmount();
  });

  it("guided 段对照：三题连续（拖动作答）时，去抖 ref 不跨题残留", async () => {
    seedDragStorage();
    const page = mount();
    await flushAsync();
    await reachGuided(page);
    const step1 = guidedArrangeStep(0);
    // 第 1 题：拖动摆成正确顺序（库→区内某一位置，插入法）
    // 先用点击摆成逆序，再用拖动修正到答案（不依赖点击顺序判定）
    const words1 = step1.answer.split(" ");
    [...words1].reverse().forEach((word) => clickBankWord(page, word));
    log(`[DG3b] 第 1 题逆序：${JSON.stringify(builtWords(page))}｜反馈=${feedbackState(page)}`);
    // 逐块拖到正确位置：把每块拖到它该在的位置
    for (let target = 0; target < words1.length; target += 1) {
      const current = builtWords(page);
      const at = current.indexOf(words1[target], target);
      if (at === target || at < 0) continue;
      dragTo(builtChips(page)[at], builtChips(page)[target]);
    }
    const final1 = builtWords(page);
    const fb1 = feedbackState(page);
    log(`[DG3b] 第 1 题拖完：${JSON.stringify(final1)}｜反馈=${fb1}`);
    page.unmount();
  });
});

describe("DG3c guided 段：拖动能否把错序救成通过", () => {
  beforeEach(() => resetStorage());

  it("摆满→判错→拖到正确顺序 → 应给出通过反馈（再拖动是否还有反馈）", async () => {
    seedDragStorage();
    const page = mount();
    await flushAsync();
    await reachGuided(page);
    const step = guidedArrangeStep(0);
    const words = step.answer.split(" ");
    // 用「倒序点击」摆满，必然错
    [...words].reverse().forEach((word) => clickBankWord(page, word));
    const beforeFb = feedbackState(page);
    log(`[DG3c] 倒序摆满：${JSON.stringify(builtWords(page))}｜反馈=${beforeFb}`);

    // 用拖动把它整成正确顺序：每次把第 i 块该在的块拖到位置 i
    const moves: string[] = [];
    for (let target = 0; target < words.length; target += 1) {
      const current = builtWords(page);
      const at = current.indexOf(words[target], target);
      if (at === target || at < 0) continue;
      moves.push(`${at}->${target}`);
      dragTo(builtChips(page)[at], builtChips(page)[target]);
    }
    const after = builtWords(page);
    const fb = feedbackState(page);
    log(`[DG3c] 拖动序列 ${moves.join(",")} 后：${JSON.stringify(after)}｜反馈=${fb}`);
    page.unmount();
  });
});
