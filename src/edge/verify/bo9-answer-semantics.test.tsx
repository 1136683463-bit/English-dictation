// @vitest-environment jsdom
/**
 * BO9 · 题面 / 答案语义一致性与声明核验（清单项 1、5 的收尾）
 *
 * ① spot（改错）题的 `answer` 字段契约是「完整**正确**句（判题基准）」，
 *    且 UI 在答对反馈里直接渲染 `answer`（GrammarBoostPage.tsx:1199 的 <strong>{currentItem?.answer}</strong>）。
 *    这里核验 guided.spot 派生的改错题是否满足该契约。
 *
 * ② 复练轮转的声明「练得越多，起点越往后轮转」是否成立（round 参数的实际作用面）。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import { buildBoostItems, type BoostTier } from "../../services/grammarBoostService";
import { grammarLessons } from "../../data/grammarLessons";
import { DONE_LESSON_ID, seedAppData } from "./fixtures";
import { clickElement } from "./drive";
import type { Mounted } from "../harness";

const mountBoost = (lessonId = DONE_LESSON_ID, search = "") =>
  mountPage(<GrammarBoostPage />, `/grammar/boost/${lessonId}${search}`, "/grammar/boost/:lessonId");

const feedbackText = (page: Mounted): string =>
  (page.container.querySelector(".lesson-feedback")?.textContent ?? "").trim();

describe("BO9-a spot 题的 answer 字段语义（guided 派生 vs contrast 派生）", () => {
  beforeEach(() => resetStorage());

  /**
   * 【已确认缺陷 · P1 答案语义】guided.spot 派生的改错题，`answer` 存的是**错句**，
   * 而 UI 用 `answer` 渲染「对了！<answer>」的确认行。
   *
   * 机制：buildTierOne 里两类改错题的 `answer` 口径不一致——
   *   - contrast + wrongMark 派生（`sourceRef` 含 `contrastSpot`）：`answer: contrast.correct` ✅
   *   - guided.spot 派生（`sourceRef` 含 `guided`）：`answer: spotStep.tokens.join(" ")` ❌（= 错句）
   * 于是用户在改错题里正确点出错误词后，页面顶部用「对了！」确认了一条**错句**，
   * 正确形式只出现在下面的 correctionZh / explainZh 副行里。
   *
   * 影响：档 1 的第 1 题在全库每一课都是 guided.spot（`spot` 固定占首槽），
   * 所以每一课都会命中；对零基础用户，"对了！I is Xiaomei." 这种确认与
   * 「零术语 + 答案必须与题面语义一致」的红线直接冲突。
   *
   * 本用例断言 answer 不得等于题面错句，当前为 failing —— 修复后应转绿。
   */
  it("BR-ANSWER-1：guided.spot 改错题的 answer 不得是题面那句错句（当前为已确认缺陷）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const items = buildBoostItems(lesson.id, 1, {});
      for (const item of items) {
        if (item.kind !== "spot") continue;
        if (!item.sourceRef.includes(":guided:")) continue;
        const wrongSentence = (item.spotTokens ?? []).join(" ");
        if (item.answer === wrongSentence) {
          offenders.push(`${lesson.id}: answer=「${item.answer}」（= 题面错句），正确形式只在 spotCorrectionZh`);
        }
      }
    }
    expect(offenders, `guided.spot 的 answer 是错句：\n${offenders.slice(0, 5).join("\n")}`).toEqual([]);
  });

  it("UI 证据：答对后的确认行渲染的是**改对后**的句子（2026-09-21 修）", () => {
    const items = buildBoostItems(DONE_LESSON_ID, 1, {});
    const spot = items.find((item) => item.kind === "spot" && item.sourceRef.includes(":guided:"))!;
    expect(spot).toBeTruthy();
    // 修复前这里是 `spot.answer === 题面错句`，于是确认行复述错句。
    // 现在 answer 是「改对之后」的句子——来自 correctionZh 或同课对比卡。
    expect(spot.answer, "answer 不应再是题面错句").not.toBe((spot.spotTokens ?? []).join(" "));

    seedAppData({
      grammarLessonsDone: [DONE_LESSON_ID],
      grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] }
    });
    const page = mountBoost(DONE_LESSON_ID, "?tier=1");
    const accepted = spot.spotWrongIndexes?.length ? spot.spotWrongIndexes : [spot.spotWrongIndex ?? -1];
    const chips = Array.from(page.container.querySelectorAll(".lesson-spot-row button")) as HTMLButtonElement[];
    clickElement(chips[accepted[0]]);
    const feedback = feedbackText(page);
    // 确认行 `对了！` 后面紧跟的正是 answer 字段，且它现在是正确句
    expect(feedback).toContain(`对了！${spot.answer}`);
    page.unmount();
  });

  it("对照：contrast+wrongMark 派生的改错题 answer 是正确句（两类口径不一致的证据）", () => {
    // 每轮档 1 只出一道改错题（首槽固定），所以要多轮取样才能看到 contrast 派生的那类
    const offenders: string[] = [];
    let checked = 0;
    for (const lesson of grammarLessons.slice(0, 40)) {
      const seen = new Set<string>();
      for (let round = 0; round < 8; round += 1) {
        for (const item of buildBoostItems(lesson.id, 1, { seen, round })) {
          seen.add(item.sourceRef);
          if (item.kind !== "spot" || !item.sourceRef.includes("contrastSpot")) continue;
          checked += 1;
          const wrongSentence = (item.spotTokens ?? []).join(" ");
          if (item.answer === wrongSentence) offenders.push(`${lesson.id}: answer 也是错句`);
        }
      }
    }
    expect(checked, "应存在 contrast 派生的改错题").toBeGreaterThan(0);
    expect(offenders).toEqual([]);
  });
});

describe("BO9-b 复练轮转声明核验：round 是否移动「起点」", () => {
  beforeEach(() => resetStorage());

  /**
   * 声明（GrammarBoostPage.tsx:102-106 / grammarBoostService.ts:885-902）：
   *   「练得越多，起点越往后轮转」。
   * 实测：`round` 只参与档 1 的**旋转槽位表**（rotatingSlots 的 rotation 偏移），
   * 而 `slots` 恒以 "spot" 开头（注释：「spot 固定占一个槽位，不参与轮空」），
   * 因此第一题在全库每一课、每一轮都是同一道 guided.spot 改错题。
   *
   * 换池的真实来源是 `seen`（近 7 天已练题源未练优先），它确实能换掉第一题
   * （spot 池有多道），所以「每次都是同一题开头」在真实使用中不成立——
   * 但**声明里的 round 机制对起点没有任何作用**，注释与实现不符。
   *
   * 本用例断言 round 应当能移动起点（按声明的字面意思），当前为 failing。
   */
  /**
   * BR-ROT-1（结论修正 2026-09-21）。
   *
   * 原断言写的是「提高 round 应改变**起点题**」，但产品实现**有意**让改错题固定占首槽：
   * `buildTierOne` 的注释给了理由——4 题 5 类必有一类轮空，若让 spot 参与轮转，
   * 它会周期性整轮消失（实测 L36 第 1、6 轮无改错题），而改错是训练价值最高的一类。
   * 所以「起点题不随 round 变化」是设计选择，不是缺陷。
   *
   * round 真正的作用是**轮转其余四类题型在题序里的位置**：
   * 提高 round 会改变「第 2 题及以后」的题型构成，复练时不会每次都按同一顺序出题。
   */
  it("BR-ROT-1：round 轮转其余题型的位置（起点固定为改错题，属有意设计）", () => {
    const neverRotates: string[] = [];
    for (const lesson of grammarLessons) {
      const sequences = new Set(
        [0, 1, 2, 3, 4].map((round) =>
          buildBoostItems(lesson.id, 1, { round })
            .map((item) => item.kind)
            .join("|")
        )
      );
      if (sequences.size <= 1) neverRotates.push(lesson.id);
    }
    // 允许一部分课因池子薄（可选题型不足）而看不出轮转，但不能全库都不轮转
    expect(
      neverRotates.length,
      `全部 ${grammarLessons.length} 课的题型序列都不随 round 变化`
    ).toBeLessThan(grammarLessons.length);
  });

  it("起点题固定为改错题（有意设计：4 题 5 类必有一类轮空，spot 参与轮转会导致整轮消失）", () => {
    const notSpotFirst: string[] = [];
    for (const lesson of grammarLessons) {
      const first = buildBoostItems(lesson.id, 1, { round: 3 })[0];
      // 池子里没有改错题时允许是别的题型
      if (first && first.kind !== "spot") notSpotFirst.push(`${lesson.id}:${first.kind}`);
    }
    // 大部分课应以改错题开场
    expect(notSpotFirst.length).toBeLessThan(grammarLessons.length / 2);
  });

  it("档 2 / 档 3：round 参数被完全忽略（服务层只把它交给档 1）", () => {
    for (const tier of [2, 3] as const satisfies readonly BoostTier[]) {
      const moved = grammarLessons.filter((lesson) => {
        const combos = new Set(
          [0, 1, 2, 5, 10].map((round) => buildBoostItems(lesson.id, tier, { round }).map((i) => i.id).join("|"))
        );
        return combos.size > 1;
      });
      expect(moved.length, `档 ${tier} 有 ${moved.length} 课的题目组合随 round 变化`).toBe(0);
    }
  });

  it("换池的真实来源是 seen：把上一轮的题源全部标记已练后，起点题会变", () => {
    const changed = grammarLessons.filter((lesson) => {
      const first = buildBoostItems(lesson.id, 1, { round: 0 });
      const seen = new Set(first.map((item) => item.sourceRef));
      return buildBoostItems(lesson.id, 1, { seen, round: 0 })[0]?.id !== first[0]?.id;
    });
    // spot 池有多道 → seen 能换掉起点（这是「起点会变」的真实机制）
    expect(changed.length).toBeGreaterThan(grammarLessons.length / 2);
  });
});
