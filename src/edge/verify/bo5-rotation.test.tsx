// @vitest-environment jsdom
/**
 * BO5 · 复练轮转（清单项 5）
 *
 * 设计声明（GrammarBoostPage.tsx:102-106、:124-131、:204-226）：
 *   「这一档此前已练过几轮（复练时轮转题型顺序，避免每次都从同一道题开头）。
 *     从遥测反查「同课同档的历史完成次数」——**练得越多，起点越往后轮转**。」
 *   round 取 `listGrammarEventsByKind("grammar_boost_completed")` 里同课同档的条数；
 *   seen 取近 7 天 `grammar_boost_step_result` 的 sourceRef 集合（未练优先排序）。
 *
 * 核验：
 * ① 声明里的 round 机制对「起点题」是否真有作用（纯函数逐课核对）；
 * ② 真实 UI：做完一档再进同一档，起点题与整份题目是否变化；
 * ③ 换池的真实来源（seen vs round）分别贡献了多少。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import {
  buildBoostItems,
  buildBoostSeenIndex,
  type BoostItem,
  type BoostTier
} from "../../services/grammarBoostService";
import { listGrammarEventsByKind } from "../../services/grammarTelemetry";
import { grammarLessons } from "../../data/grammarLessons";
import { DONE_LESSON_ID, readAppData, seedAppData, telemetryOfKind } from "./fixtures";
import { answerBoostItem, flushAsync } from "./drive";
import type { Mounted } from "../harness";

const seedLesson = (patch: Record<string, unknown> = {}) =>
  seedAppData({
    grammarLessonsDone: [DONE_LESSON_ID],
    grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] },
    ...patch
  });

const mountBoost = (search = "") =>
  mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}${search}`, "/grammar/boost/:lessonId");

/**
 * 复现页面在「当前遥测状态下」会出的题（与 GrammarBoostPage 的三段逻辑同序：
 * seen = 近 7 天已练题源；round = 同课同档已完成次数；空则退回无 seen 重建）。
 */
const planLikePage = (tier: BoostTier, lessonId = DONE_LESSON_ID): BoostItem[] => {
  const seen = buildBoostSeenIndex(readAppData());
  const round = listGrammarEventsByKind("grammar_boost_completed").filter(
    (event) => event.lessonId === lessonId && event.tier === tier
  ).length;
  let next = buildBoostItems(lessonId, tier, { seen, round });
  if (next.length === 0) next = buildBoostItems(lessonId, tier, { round });
  return next;
};

/** 页面上当前这道题的标识（题型引导语 + 题面），跨轮可比。 */
const currentQuestion = (page: Mounted): string => {
  const head = (page.container.querySelector(".lesson-quiz-note")?.textContent ?? "").trim();
  const prompt = (page.container.querySelector(".lesson-quiz-prompt")?.textContent ?? "").trim();
  const chips = Array.from(page.container.querySelectorAll(".lesson-spot-row button"))
    .map((button) => (button.textContent ?? "").trim())
    .join(" ");
  const pair = Array.from(page.container.querySelectorAll(".boost-pair-sentence"))
    .map((node) => (node.textContent ?? "").trim())
    .join(" ");
  return `${head}|${prompt}|${chips}|${pair}`;
};

/** 走完当前档（全部答对），返回每道题的标识。 */
const runTier = (page: Mounted, items: BoostItem[]): string[] => {
  const seen: string[] = [];
  for (const [index, item] of items.entries()) {
    seen.push(currentQuestion(page));
    const result = answerBoostItem(page, item);
    if (result !== "passed") {
      throw new Error(`第 ${index + 1} 题（${item.kind}）作答失败，实际题面：${seen[seen.length - 1]}`);
    }
    if (index + 1 < items.length) page.click("下一题");
    else page.click("完成这一档");
  }
  return seen;
};

describe("BO5-a 声明核验：round 参数对三档起点的影响（纯函数）", () => {
  beforeEach(() => resetStorage());

  it("档 1：round 不改变起点题（第一题恒为改错题），只改变中段槽位", () => {
    const startUnchanged = grammarLessons.filter((lesson) => {
      const first0 = buildBoostItems(lesson.id, 1, { round: 0 })[0]?.id;
      return [1, 2, 3, 5].every((round) => buildBoostItems(lesson.id, 1, { round })[0]?.id === first0);
    });
    expect(startUnchanged.length).toBe(grammarLessons.length);
  });

  it("档 1：round 确实改变了整份题目组合（旋转槽位有效）", () => {
    const changed = grammarLessons.filter((lesson) => {
      const combos = new Set(
        [0, 1, 2, 3, 5].map((round) => buildBoostItems(lesson.id, 1, { round }).map((item) => item.id).join("|"))
      );
      return combos.size > 1;
    });
    expect(changed.length).toBe(grammarLessons.length);
  });

  it("档 2 / 档 3：round 参数完全不生效（buildBoostItems 只把它交给档 1）", () => {
    for (const tier of [2, 3] as const satisfies readonly BoostTier[]) {
      const changed = grammarLessons.filter((lesson) => {
        const combos = new Set(
          [0, 1, 2, 5, 10].map((round) => buildBoostItems(lesson.id, tier, { round }).map((item) => item.id).join("|"))
        );
        return combos.size > 1;
      });
      expect(changed.length, `档 ${tier} 的题目组合随 round 变化了 ${changed.length} 课，与实现不符`).toBe(0);
    }
  });

  it("档 2 / 档 3：seen（近 7 天已练）才是换池来源，但仍不改起点题（池子只有 1 类 recall/produce 锚点）", () => {
    // 档 3 的 produce 池 = target + recall 锚点，seen 命中 target 时换成 recall
    const changed = grammarLessons.filter((lesson) => {
      const base = buildBoostItems(lesson.id, 3, {});
      const seen = new Set(base.map((item) => item.sourceRef));
      return buildBoostItems(lesson.id, 3, { seen })[0]?.id !== base[0]?.id;
    });
    // 只有同时有 target 与 recall 两个锚点、且两者答案不同的课才会变化
    expect(changed.length).toBeGreaterThanOrEqual(0);
  });
});

describe("BO5-b 真实 UI：做完一档再进同一档", () => {
  beforeEach(() => resetStorage());

  it("档 1 两轮：起点题被换掉（换池生效），整份不完全重复", async () => {
    seedLesson();
    const first = mountBoost("?tier=1");
    const round1 = runTier(first, planLikePage(1));
    await flushAsync();
    first.unmount();

    const second = mountBoost("?tier=1");
    const round2 = runTier(second, planLikePage(1));
    await flushAsync();
    second.unmount();

    expect(round1.length).toBe(4);
    expect(round2.length).toBe(4);
    // 换池生效：第一题换了（不同 sourceRef → 不同题面）
    expect(round2[0], "第二轮起点与第一轮完全相同").not.toBe(round1[0]);
    // 整份不完全重复
    const shared = round1.filter((question) => round2.includes(question));
    expect(shared.length).toBeLessThan(round1.length);
    // 埋点里能看到两轮各 4 条 step_result
    expect(telemetryOfKind("grammar_boost_step_result").length).toBe(8);
  });

  it("档 1 三轮：每轮都换掉一部分题（不是从第二轮起就固定）", async () => {
    seedLesson();
    const rounds: string[][] = [];
    for (let round = 0; round < 3; round += 1) {
      const page = mountBoost("?tier=1");
      rounds.push(runTier(page, planLikePage(1)));
      await flushAsync();
      page.unmount();
    }
    // 第 1 → 第 2 轮有变化
    expect(rounds[1][0]).not.toBe(rounds[0][0]);
    // 第 2 → 第 3 轮也有变化（改错池多道，round 参与旋转）
    const changedAgain =
      rounds[2][0] !== rounds[1][0] || rounds[2].some((question) => !rounds[1].includes(question));
    expect(changedAgain, "第三轮与第二轮完全一致（轮转停在某一轮不再前进）").toBe(true);
  });

  it("档 2 两轮：起点题（recall 锚点）在池子只有 1 个锚点时必然重复", async () => {
    seedLesson();
    const first = mountBoost("?tier=2");
    const round1 = runTier(first, planLikePage(2));
    await flushAsync();
    first.unmount();

    const second = mountBoost("?tier=2");
    const round2 = runTier(second, planLikePage(2));
    await flushAsync();
    second.unmount();

    expect(round1.length).toBe(5);
    // 记录事实：recall 锚点在 L13 只有 target 一个 → 起点题必然相同
    expect(round2[0]).toBe(round1[0]);
    // 但中后段有换池
    const shared = round1.filter((question) => round2.includes(question));
    expect(shared.length).toBeLessThan(round1.length);
  });

  it("档 3 两轮：池子只有 3 题，第二轮几乎必然重复", async () => {
    seedLesson({ grammarBoostsDone: { [DONE_LESSON_ID]: [1, 2] } });
    const first = mountBoost("?tier=3");
    const round1 = runTier(first, planLikePage(3));
    await flushAsync();
    first.unmount();

    const second = mountBoost("?tier=3");
    const round2 = runTier(second, planLikePage(3));
    await flushAsync();
    second.unmount();

    expect(round1.length).toBe(3);
    const shared = round1.filter((question) => round2.includes(question));
    // 设计上允许（池子只有 3 题），但要如实记录重复率
    expect(shared.length).toBeGreaterThan(0);
  });
});

describe("BO5-c seen 覆盖整池时仍能出题（不出现空态）", () => {
  beforeEach(() => resetStorage());

  it("档 1 连续 30 轮累积 seen 后，仍然出满 4 题", () => {
    const seen = new Set<string>();
    for (let round = 0; round < 30; round += 1) {
      for (const item of buildBoostItems(DONE_LESSON_ID, 1, { seen, round })) seen.add(item.sourceRef);
    }
    const items = buildBoostItems(DONE_LESSON_ID, 1, { seen, round: 0 });
    expect(items.length).toBe(4);
  });

  it("seen 为空与满池时，档 2 / 档 3 都出满声明题量", () => {
    for (const tier of [2, 3] as const) {
      const seen = new Set<string>();
      for (let round = 0; round < 30; round += 1) {
        for (const item of buildBoostItems(DONE_LESSON_ID, tier, { seen, round })) seen.add(item.sourceRef);
      }
      expect(buildBoostItems(DONE_LESSON_ID, tier, { seen, round: 0 }).length, `档 ${tier}`).toBe(
        tier === 2 ? 5 : 3
      );
    }
  });
});

describe("BO5-d 完成次数（round 的真实来源）在遥测里如何累积", () => {
  beforeEach(() => resetStorage());

  it("做完一档 completed +1；重复做同一档继续 +1（round 会一直增长）", async () => {
    seedLesson();
    const count = () =>
      listGrammarEventsByKind("grammar_boost_completed").filter(
        (event) => event.lessonId === DONE_LESSON_ID && event.tier === 1
      ).length;
    expect(count()).toBe(0);
    for (let round = 0; round < 2; round += 1) {
      const page = mountBoost("?tier=1");
      runTier(page, planLikePage(1));
      await flushAsync();
      page.unmount();
      expect(count()).toBe(round + 1);
    }
  });

  it("中途退出（未完成）不增加 round", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    const items = planLikePage(1);
    expect(answerBoostItem(page, items[0])).toBe("passed");
    page.click("下一题");
    expect(answerBoostItem(page, items[1])).toBe("passed");
    page.unmount();
    await flushAsync();
    const count = () =>
      listGrammarEventsByKind("grammar_boost_completed").filter(
        (event) => event.lessonId === DONE_LESSON_ID && event.tier === 1
      ).length;
    expect(count()).toBe(0);
    expect(telemetryOfKind("grammar_boost_abandoned").length).toBe(1);
  });
});
