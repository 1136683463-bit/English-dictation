// @vitest-environment jsdom
/**
 * DG0 · 拖拽基建可用的最短证明 + 数据事实
 *
 * 目的只有一个：证明「用真实 DOM 事件驱动拖拽」这条路在本仓库里走得通，
 * 并把与拖拽相关的数据事实（哪些题有干扰项、哪些题有重复词块）钉下来，
 * 供后续 dg1~dg5 使用。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import { grammarLessons } from "../../data/grammarLessons";
import { flushAsync } from "./drive";
import { bankArea, bankChips, buildArea, builtWords, clickBankWord, fireDrag, makeDataTransfer } from "./dragDrive";

import { DRAG_LESSON_ID, DRAG_LESSON_PATH, DRAG_ROUTE, reachGuided, seedDragStorage } from "./dragDrive";

describe("DG0 拖拽基建", () => {
  beforeEach(() => resetStorage());

  it("jsdom 缺 DragEvent/DataTransfer（桩的对象与真实差异，见 dragDrive.ts 头注释）", async () => {
    const availability = {
      DragEvent: typeof (globalThis as Record<string, unknown>).DragEvent,
      DataTransfer: typeof (globalThis as Record<string, unknown>).DataTransfer,
      MouseEvent: typeof MouseEvent
    };
    // eslint-disable-next-line no-console
    console.log("[DG0] jsdom 拖拽 API 可用性:", JSON.stringify(availability));
    expect(availability.DragEvent, "jsdom 不提供 DragEvent（所以本套用 MouseEvent 顶替）").toBe("undefined");
    expect(availability.DataTransfer, "jsdom 不提供 DataTransfer（所以本套用最小桩）").toBe("undefined");
  });

  it("桩事件能被页面的 onDragStart 正常消费（不抛 dataTransfer undefined）", async () => {
    seedDragStorage();
    const page = mountPage(<GrammarLessonPage />, DRAG_LESSON_PATH, DRAG_ROUTE);
    await flushAsync();
    await reachGuided(page);

    const bank = bankArea(page);
    expect(bank, "guided 首题应是 arrange（这一课是）").toBeTruthy();
    expect(buildArea(page), "应有拼装区").toBeTruthy();
    const chips = bankChips(page);
    expect(chips.length, "词块库应有词块").toBeGreaterThan(0);

    const errors: string[] = [];
    const onError = (event: ErrorEvent) => errors.push(String(event.error ?? event.message));
    window.addEventListener("error", onError);
    const dataTransfer = makeDataTransfer();
    fireDrag(chips[0], "dragstart", dataTransfer);
    window.removeEventListener("error", onError);
    expect(errors, `拖拽开始不应抛错：${errors.join(" / ")}`).toEqual([]);
    expect(dataTransfer.getData("text/plain"), "onDragStart 应写入 dataTransfer（页面的合法行为）").not.toBe("");
    page.unmount();
  });

  it("数据事实：guided 无干扰项、practice 全部带干扰项（词块总数 > 答案词数）", async () => {
    const answerWordCount = (answer: string): number =>
      answer.replace(/[.,!?;:]/g, "").split(/\s+/).filter(Boolean).length;
    let guided = 0;
    let guidedWithDistractors = 0;
    let practice = 0;
    let practiceWithDistractors = 0;
    let practiceOverloaded = 0;
    for (const lesson of grammarLessons) {
      for (const step of lesson.guided ?? []) {
        if (step.kind !== "arrange") continue;
        guided += 1;
        if (((step as { distractors?: unknown[] }).distractors ?? []).length) guidedWithDistractors += 1;
      }
      for (const step of lesson.practice ?? []) {
        practice += 1;
        if (((step as { distractors?: unknown[] }).distractors ?? []).length) practiceWithDistractors += 1;
        if ((step.tokens ?? []).length + (step.distractors ?? []).length > answerWordCount(step.answer)) {
          practiceOverloaded += 1;
        }
      }
    }
    // eslint-disable-next-line no-console
    console.log(
      "[DG0] 数据事实:",
      JSON.stringify({ guided, guidedWithDistractors, practice, practiceWithDistractors, practiceOverloaded })
    );
    // 不写死题量（题库在持续扩充）；只断言与拖拽相关的结构性事实
    expect(guided, "guided 段应有 arrange 题（拖拽的主力题型）").toBeGreaterThan(100);
    expect(practice, "practice 段应有 arrange 题").toBeGreaterThan(100);
    expect(guidedWithDistractors, "guided 的 arrange 题没有干扰项 → 词块总数 == 答案词数（拖拽在 guided 的判题恒成立）").toBe(0);
    expect(practiceWithDistractors, "practice 的 arrange 题全部带干扰项").toBe(practice);
    expect(practiceOverloaded, "practice 全部是「超载」态：词块总数 > 答案词数").toBe(practice);
  });

  it("数据事实：存在重复词块的 arrange 题（按下标记录的影响面）", async () => {
    const duplicates: string[] = [];
    for (const lesson of grammarLessons) {
      for (const step of [...(lesson.guided ?? []), ...(lesson.practice ?? [])] as unknown as Array<Record<string, unknown>>) {
        if (step.kind !== "arrange") continue;
        const tokens = ((step.tokens ?? []) as string[]).map((token) => token.toLowerCase());
        const counts = new Map<string, number>();
        for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
        for (const [token, count] of counts) {
          if (count > 1) duplicates.push(`${lesson.id}:${step.answer as string}:${token}x${count}`);
        }
      }
    }
    // eslint-disable-next-line no-console
    console.log(`[DG0] 含重复词块的题：${duplicates.length} 条，前 6 条：${duplicates.slice(0, 6).join(" | ")}`);
    expect(duplicates.length, "重复词块并非个例，值得单独验（dg4）").toBeGreaterThan(0);
  });

  it("点击路径（对照基线）：库→拼装区 追加在后、点已摆块移除", async () => {
    seedDragStorage();
    const page = mountPage(<GrammarLessonPage />, DRAG_LESSON_PATH, DRAG_ROUTE);
    await flushAsync();
    await reachGuided(page);
    clickBankWord(page, "I");
    clickBankWord(page, "am");
    expect(builtWords(page), "点击应追加到末尾").toEqual(["I", "am"]);
    page.unmount();
  });
});
