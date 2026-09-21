// @vitest-environment jsdom
/**
 * H4 · 案件解锁与课程绑定（侦探找错）
 *
 * 核心问题：锁定逻辑能否被绕过？三条路径都验：
 *   ① 列表里未解锁案是 disabled；
 *   ② ?case=<locked> 深链是否被拦（含把所有课学完前的每一种进度）；
 *   ③ 番外案（未被任何课引用）整体挂第 12 课档位，学完前 12 课才解锁。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "./harness";
import { installResizeObserverStub, seedAppData } from "./huntDiaryEnv";
import { grammarLessons } from "../data/grammarLessons";
import { huntCases } from "../data/huntCases";
import { listHuntCasesWithLock } from "../services/huntService";
import { parseBackupJson } from "../services/storage";
import { STORAGE_KEY } from "./verify/fixtures";
import GrammarHuntPage from "../pages/GrammarHuntPage";

const EXTRA_CASES = ["hunt-white-cat", "hunt-sports-day", "hunt-pen-pal-letter", "hunt-fridge-note", "hunt-term-review"];

const lessonsFor = (caseId: string): string[] =>
  grammarLessons.filter((lesson) => lesson.huntCaseIds.includes(caseId)).map((lesson) => lesson.id);

const allLessonIds = grammarLessons.map((lesson) => lesson.id);
const seasonOneIds = grammarLessons.filter((lesson) => lesson.number <= 12).map((lesson) => lesson.id);

describe("H4 案件解锁与课程绑定", () => {
  beforeEach(() => resetStorage());
  installResizeObserverStub();

  it("零进度：所有案件锁定，且锁定卡不可点（disabled）", () => {
    seedAppData();
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt");
    const cards = Array.from(page.container.querySelectorAll(".hunt-case-card")) as HTMLButtonElement[];
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.filter((card) => card.disabled).length).toBe(cards.length);
    expect(page.text()).toContain("学完第");
    console.log("[H4] 首页可见卡：", cards.length, "全部锁定");
    page.unmount();
  });

  it("未解锁案的锁定卡点击无效：不开案、不产生任何状态", () => {
    seedAppData();
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt");
    const locked = (Array.from(page.container.querySelectorAll(".hunt-case-card")) as HTMLButtonElement[]).find(
      (card) => card.disabled
    )!;
    locked.click();
    expect(page.has("你的任务")).toBe(false);
    expect(page.has("全部案件")).toBe(true);
    page.unmount();
  });

  it("深链 ?case=<locked> 被拦：停在列表页，不回落到别的路由", () => {
    seedAppData();
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt?case=hunt-my-sister", "/grammar/hunt");
    expect(page.has("你的任务")).toBe(false);
    expect(page.has("全部案件")).toBe(true);
    page.unmount();
  });

  it("深链 ?case=<unlocked> 正常开案（正例，避免因拦太狠而误伤）", () => {
    seedAppData({ grammarLessonsDone: ["lesson-01-am"] });
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt?case=hunt-call-mother", "/grammar/hunt");
    expect(page.has("你的任务")).toBe(true);
    expect(page.container.querySelectorAll(".hunt-token").length).toBeGreaterThan(0);
    page.unmount();
  });

  it("深链 ?case=<不存在的 id> / 空值：安全回落列表，不崩", () => {
    seedAppData({ grammarLessonsDone: allLessonIds });
    for (const url of ["/grammar/hunt?case=no-such-case", "/grammar/hunt?case=", "/grammar/hunt?case=../etc/passwd"]) {
      const page = mountPage(<GrammarHuntPage />, url, "/grammar/hunt");
      expect(page.has("全部案件"), `${url} 应回落列表`).toBe(true);
      expect(page.has("你的任务"), `${url} 不应开案`).toBe(false);
      page.unmount();
    }
  });

  it("绕过尝试：把课程进度塞成引用该案的课也无效（只认真实课 id）", () => {
    seedAppData({ grammarLessonsDone: ["lesson-999-fake", "hunt-my-sister", "lesson-01-am"] });
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt?case=hunt-my-sister", "/grammar/hunt");
    // lesson-01-am 不解锁 hunt-my-sister（它由第 7 课解锁）
    expect(page.has("你的任务")).toBe(false);
    page.unmount();
  });

  it("完成某课只解锁该课引用的案，其余仍锁定", () => {
    seedAppData({ grammarLessonsDone: ["lesson-01-am"] });
    const data = parseBackupJson(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    const infos = listHuntCasesWithLock(data);
    const unlocked = infos.filter((info) => info.unlocked).map((info) => info.caseItem.id);
    const expected = new Set(lessonsFor("hunt-call-mother"));
    const wronglyUnlocked = unlocked.filter((id) => {
      const owners = lessonsFor(id);
      return owners.length > 0 && !owners.some((lessonId) => expected.has(lessonId));
    });
    console.log("[H4] 完成第 1 课后解锁：", unlocked.join(", "));
    expect(wronglyUnlocked).toEqual([]);
    expect(unlocked).toContain("hunt-call-mother");
    expect(unlocked.length).toBeLessThan(huntCases.length);
  });

  it("全部 195 课完成后 201 案全部解锁，深链任意案都能开", () => {
    seedAppData({ grammarLessonsDone: allLessonIds });
    const data = parseBackupJson(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    const infos = listHuntCasesWithLock(data);
    expect(infos.filter((info) => !info.unlocked)).toEqual([]);
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt?case=hunt-term-review", "/grammar/hunt");
    expect(page.has("你的任务")).toBe(true);
    page.unmount();
  });

  it("番外 5 案：前 11 课完成仍锁定，前 12 课完成才解锁（档位边界）", () => {
    seedAppData({ grammarLessonsDone: grammarLessons.filter((lesson) => lesson.number <= 11).map((lesson) => lesson.id) });
    let data = parseBackupJson(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    let extras = listHuntCasesWithLock(data).filter((info) => EXTRA_CASES.includes(info.caseItem.id));
    expect(extras.length).toBe(EXTRA_CASES.length);
    expect(extras.every((info) => !info.unlocked)).toBe(true);

    seedAppData({ grammarLessonsDone: seasonOneIds });
    data = parseBackupJson(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    extras = listHuntCasesWithLock(data).filter((info) => EXTRA_CASES.includes(info.caseItem.id));
    expect(extras.every((info) => info.unlocked)).toBe(true);

    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt?case=hunt-white-cat", "/grammar/hunt");
    expect(page.has("你的任务")).toBe(true);
    page.unmount();
  });

  it("番外案深链在档位未达时同样被拦", () => {
    seedAppData({ grammarLessonsDone: grammarLessons.filter((lesson) => lesson.number <= 11).map((lesson) => lesson.id) });
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt?case=hunt-white-cat", "/grammar/hunt");
    expect(page.has("你的任务")).toBe(false);
    expect(page.has("全部案件")).toBe(true);
    page.unmount();
  });

  it("课程筛选条：未解锁课 chip 带锁标，筛出的案件全部不可点（只读，不越权）", async () => {
    const { clickElement } = await import("./verify/drive");
    seedAppData({ grammarLessonsDone: ["lesson-01-am"] });
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt");
    const chips = Array.from(page.container.querySelectorAll(".hunt-filter-chip")) as HTMLButtonElement[];
    const lockedChips = chips.filter((chip) => chip.className.includes("locked"));
    console.log("[H4] 筛选 chip：", chips.length, "带锁：", lockedChips.length);
    expect(chips.length).toBeGreaterThan(0);
    expect(lockedChips.length).toBeGreaterThan(0);
    // 点开「更多课程」，从里面选一门还没学到的课
    const more = chips.find((chip) => (chip.textContent ?? "").includes("更多课程"));
    if (more) clickElement(more);
    const hiddenChips = Array.from(page.container.querySelectorAll(".hunt-filter-chip.locked")) as HTMLButtonElement[];
    expect(hiddenChips.length).toBeGreaterThan(0);
    clickElement(hiddenChips[hiddenChips.length - 1]);
    const cards = Array.from(page.container.querySelectorAll(".hunt-case-card")) as HTMLButtonElement[];
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.every((card) => card.disabled)).toBe(true);
    page.unmount();
  });

  it("统计条只统计真实结算（伪造 huntResults 时 found<total 不算已破案）", () => {
    seedAppData({
      huntResults: [
        {
          id: "r1",
          caseId: "hunt-call-mother",
          found: 1, // 少于该案 2 处错误
          total: 2,
          misses: 0,
          stars: 3,
          durationMs: 1000,
          finishedAt: "2024-01-01T00:00:00.000Z"
        }
      ]
    });
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt");
    expect(page.text()).toContain("0 / 204");
    page.unmount();
  });

  it("找到全部错误数但 total 被篡改的结算不计为破案（防脏数据）", () => {
    seedAppData({
      huntResults: [
        {
          id: "r2",
          caseId: "hunt-call-mother",
          found: 99,
          total: 99,
          misses: 0,
          stars: 3,
          durationMs: 1000,
          finishedAt: "2024-01-01T00:00:00.000Z"
        }
      ]
    });
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt", "/grammar/hunt");
    // summarizeHuntProgress 用案件真实错误数比对，篡改的 total 不能骗过统计
    expect(page.text()).toContain("0 / 204");
    page.unmount();
  });

  it("正常结算后统计条 +1，且案件卡显示已破案", async () => {
    const { clickElement, flushAsync } = await import("./verify/drive");
    seedAppData({ grammarLessonsDone: lessonsFor("hunt-call-mother") });
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt?case=hunt-call-mother", "/grammar/hunt");
    const tokens = () => Array.from(page.container.querySelectorAll(".hunt-token")) as HTMLElement[];
    const tagLabel: Record<string, string> = { missing_be: "缺 be 动词" };
    const item = huntCases.find((c) => c.id === "hunt-call-mother")!;
    for (const error of item.errors) {
      clickElement(tokens()[error.tokenIndex]);
      clickElement(
        (Array.from(page.container.querySelectorAll(".hunt-tag-btn")) as HTMLElement[]).find((button) =>
          (button.textContent ?? "").includes(tagLabel[error.tag])
        ) as HTMLElement
      );
    }
    await flushAsync();
    page.clickMatch(/再来一案/);
    await flushAsync();
    expect(page.text()).toContain("1 / 204");
    const solved = Array.from(page.container.querySelectorAll(".hunt-case-card.solved"));
    expect(solved.length).toBe(1);
    expect(page.text()).toContain("已破 1 /");
    page.unmount();
  });
});
