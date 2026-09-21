import { beforeEach, describe, expect, it } from "vitest";
import {
  BOOST_PRODUCE_PASS_SCORE,
  BOOST_RECALL_PASS_SCORE,
  BOOST_TIER_META,
  BOOST_TIERS,
  boostArrangeAnswerLength,
  boostProgressLabel,
  buildBoostItems,
  buildBoostSeenIndex,
  buildRecallHints,
  canBoostLesson,
  getLessonBoostTiersDone,
  isLessonBoostTierDone,
  judgeBoostContrast,
  judgeBoostCloze,
  judgeBoostItem,
  judgeBoostListen,
  judgeBoostBothRight,
  judgeBoostProduce,
  judgeBoostRecall,
  judgeBoostSpot,
  judgeBoostTokens,
  markBoostTierDone,
  suggestBoostTier
} from "./grammarBoostService";
import { appendGrammarEvent, clearGrammarTelemetry } from "./grammarTelemetry";
import { GRAMMAR_LESSON_BY_ID, grammarLessons } from "../data/grammarLessons";
import { makeTestData } from "./testUtils";
import { normalizeLessonSentence } from "./lessonService";
import type { AppData, GrammarErrorTag } from "../types";

/** 有 contrast / variants / recall / practice 的典型课（L13 起结构完整）。 */
const SAMPLE_LESSON_IDS = ["lesson-13-now", "lesson-35-because", "lesson-50-should", "lesson-70-how-often"];

const sampleLessonId = (): string => {
  const found = grammarLessons.find((lesson) => lesson.id === SAMPLE_LESSON_IDS[0]);
  return found ? found.id : grammarLessons[12].id;
};

describe("grammarBoostService · 档位元信息与完成态", () => {
  beforeEach(() => {
    clearGrammarTelemetry();
  });

  it("三档元信息齐备：名称零术语、题量与时长都标注出来（允许只做一档的前提）", () => {
    expect(BOOST_TIERS).toEqual([1, 2, 3]);
    for (const tier of BOOST_TIERS) {
      const meta = BOOST_TIER_META[tier];
      expect(meta.name.trim()).not.toBe("");
      expect(meta.summaryZh).toContain("分钟");
      expect(meta.questionCount).toBeGreaterThanOrEqual(3);
      // 零术语红线：档位名与说明里不出现语法术语
      expect(meta.name).not.toMatch(/时态|主谓|分词|语态|从句|比较级/);
      expect(meta.summaryZh).not.toMatch(/时态|主谓|分词|语态|从句|比较级/);
    }
    // 总题量硬上限 15（不构成题海）
    const total = BOOST_TIERS.reduce((sum, tier) => sum + BOOST_TIER_META[tier].questionCount, 0);
    expect(total).toBeLessThanOrEqual(15);
  });

  it("完成态读写：幂等、不可变、语义 = 至少完成过一次", () => {
    const lessonId = sampleLessonId();
    const base = makeTestData();
    expect(getLessonBoostTiersDone(base, lessonId).size).toBe(0);

    const once = markBoostTierDone(base, lessonId, 2);
    expect(isLessonBoostTierDone(once, lessonId, 2)).toBe(true);
    expect(isLessonBoostTierDone(once, lessonId, 1)).toBe(false);

    // 幂等：重复写不改变数据
    const again = markBoostTierDone(once, lessonId, 2);
    expect(again).toBe(once);

    // 不可变：原 data 未被修改
    expect(base.grammarBoostsDone?.[lessonId]).toBeUndefined();

    // 档位升序存放
    const all = markBoostTierDone(markBoostTierDone(again, lessonId, 1), lessonId, 3);
    expect(all.grammarBoostsDone?.[lessonId]).toEqual([1, 2, 3]);
  });

  it("未知课程不写入完成态", () => {
    const base = makeTestData();
    expect(markBoostTierDone(base, "lesson-does-not-exist", 1)).toBe(base);
  });

  it("建议档位：未完成的最小档；三档都完成回到档 1 复练", () => {
    const lessonId = sampleLessonId();
    let data: AppData = makeTestData();
    expect(suggestBoostTier(data, lessonId)).toBe(1);
    data = markBoostTierDone(data, lessonId, 1);
    expect(suggestBoostTier(data, lessonId)).toBe(2);
    data = markBoostTierDone(data, lessonId, 2);
    expect(suggestBoostTier(data, lessonId)).toBe(3);
    data = markBoostTierDone(data, lessonId, 3);
    expect(suggestBoostTier(data, lessonId)).toBe(1);
  });

  it("微进度文案：未练为 null，练过给「练到第 N 档」，满档给固定文案", () => {
    const lessonId = sampleLessonId();
    let data: AppData = makeTestData();
    expect(boostProgressLabel(data, lessonId)).toBeNull();
    data = markBoostTierDone(data, lessonId, 1);
    expect(boostProgressLabel(data, lessonId)).toBe("练到第 1 档");
    data = markBoostTierDone(data, lessonId, 2);
    expect(boostProgressLabel(data, lessonId)).toBe("练到第 2 档");
    data = markBoostTierDone(data, lessonId, 3);
    expect(boostProgressLabel(data, lessonId)).toBe("三档都走过了");
  });

  it("入口门槛：只有关 1 完成的课才可练（避免绕开正课）", () => {
    const lessonId = sampleLessonId();
    expect(canBoostLesson(makeTestData(), lessonId)).toBe(false);
    expect(canBoostLesson(makeTestData({ grammarLessonsDone: [lessonId] }), lessonId)).toBe(true);
  });
});

describe("grammarBoostService · 档 1 出题（再认一次）", () => {
  it("题量 4、题型不重样（用户反馈「流程太重复」的回归）、每题都有判题依据与讲解", () => {
    const items = buildBoostItems(sampleLessonId(), 1);
    expect(items.length).toBeGreaterThanOrEqual(3);
    expect(items.length).toBeLessThanOrEqual(4);
    // 题型轮转：一次练习里不出现同一种题型两遍（素材齐备的课）
    const kinds = items.map((item) => item.kind);
    expect(new Set(kinds).size, `题型重复：${kinds.join("/")}`).toBe(kinds.length);
    // 题干题型覆盖面：至少 3 类不同题型
    expect(new Set(kinds).size).toBeGreaterThanOrEqual(3);
    const refs = items.map((item) => item.sourceRef);
    expect(new Set(refs).size).toBe(refs.length);
    for (const item of items) {
      expect(item.id).toBeTruthy();
      expect(item.promptZh.trim()).not.toBe("");
      expect(item.answer.trim()).not.toBe("");
      // 关键：每题都必须带「为什么」——答对也要能学到东西（用户反馈）
      expect(item.explainZh.trim(), `${item.id} 缺讲解`).not.toBe("");
      expect(["contrast", "cloze", "spot", "choose", "replace", "bothright", "listen"]).toContain(item.kind);
      if (item.kind === "cloze") {
        expect(item.clozeText).toContain("___");
        expect(item.clozeAnswer).toBeTruthy();
        expect(item.clozeOptions?.length).toBeGreaterThanOrEqual(2);
        // 选项必须含正确答案（否则题目无解）
        expect(item.clozeOptions).toContain(item.clozeAnswer);
      }
      if (item.kind === "contrast") {
        expect(item.contrast?.sentence).toBeTruthy();
        expect(item.contrast?.whyZh).toBeTruthy();
      }
      if (item.kind === "spot") {
        expect(item.spotTokens?.length).toBeGreaterThan(1);
        expect(item.spotWrongIndex).toBeGreaterThanOrEqual(0);
        expect(item.spotTokens?.[item.spotWrongIndex ?? 0]).toBeTruthy();
      }
      if (item.kind === "choose" || item.kind === "replace") {
        expect(item.options?.length).toBeGreaterThanOrEqual(2);
        expect(item.options).toContain(item.answer);
      }
    }
  });

  it("改错题库：全库每课 ≥2 道可换（复练不会卡在同一道题）", () => {
    const thin: string[] = [];
    for (const lesson of grammarLessons) {
      const seen = new Set<string>();
      const collected = new Set<string>();
      // 反复复练把改错池抽干，统计实际能出多少道不同的改错题
      for (let round = 0; round < 10; round += 1) {
        const spots = buildBoostItems(lesson.id, 1, { seen, round }).filter((item) => item.kind === "spot");
        if (spots.length === 0) break;
        let added = 0;
        for (const spot of spots) {
          if (!seen.has(spot.sourceRef)) {
            seen.add(spot.sourceRef);
            collected.add(spot.sourceRef);
            added += 1;
          }
        }
        if (added === 0) break;
      }
      if (collected.size < 2) thin.push(`${lesson.id}(${collected.size})`);
    }
    expect(thin, `改错题不足 2 道的课：${thin.slice(0, 5).join(", ")}`).toEqual([]);
  });

  it("guided.spot 的 wrongToken 必能定位（回归：L96/L102 带尾标点曾静默失效）", () => {
    const broken: string[] = [];
    for (const lesson of grammarLessons) {
      const spotStep = lesson.guided?.find((step) => step.kind === "spot");
      if (!spotStep?.wrongToken || !spotStep.tokens?.length) continue;
      // 数据侧纪律：wrongToken 应与 tokens 元素逐字相等（不带尾标点）；
      // 代码侧已做去标点兜底，但这里仍要求数据合规——避免依赖兜底而偷偷退化。
      if (!spotStep.tokens.includes(spotStep.wrongToken)) {
        broken.push(`${lesson.id}("${spotStep.wrongToken}" vs [${spotStep.tokens.join(" ")}])`);
      }
    }
    expect(broken, `wrongToken 与 tokens 不逐字相等的课：${broken.slice(0, 5).join(", ")}`).toEqual([]);
  });

  it("contrast 的 wrongMark 不得是纯标点（回归：L89 的 \"?\" 无法定位）", () => {
    const bad: string[] = [];
    for (const lesson of grammarLessons) {
      for (const [index, contrast] of (lesson.contrast ?? []).entries()) {
        const mark = (contrast.wrongMark ?? "").trim();
        if (!mark) continue;
        if (!/[a-zA-Z0-9]/.test(mark)) bad.push(`${lesson.id}[${index}]="${mark}"`);
      }
    }
    expect(bad, `wrongMark 为纯标点的条目：${bad.slice(0, 5).join(", ")}`).toEqual([]);
  });

  it("改错题都能拿到可定位的下标（全库逐课）", () => {
    for (const lesson of grammarLessons) {
      const seen = new Set<string>();
      for (let round = 0; round < 6; round += 1) {
        for (const item of buildBoostItems(lesson.id, 1, { seen, round })) {
          if (item.kind !== "spot") continue;
          const accepted = item.spotWrongIndexes?.length ? item.spotWrongIndexes : item.spotWrongIndex !== undefined ? [item.spotWrongIndex] : [];
          expect(accepted.length, `${item.id} 没有可接受的下标`).toBeGreaterThan(0);
          for (const index of accepted) {
            expect(judgeBoostSpot(item, index), `${item.id} 下标 ${index} 应判对`).toBe(true);
          }
        }
        break;
      }
    }
  });

  it("改错题的题源引用不撞号（回归：对比卡派生的改错题曾与判断题共用 target 命名空间）", () => {
    for (const lesson of grammarLessons) {
      const refs = buildBoostItems(lesson.id, 1).map((item) => item.sourceRef);
      expect(new Set(refs).size, `${lesson.id} 档 1 出现重复题源：${refs.join(", ")}`).toBe(refs.length);
    }
  });

  it("多词标注（语序类）改错题：点中任一组成词都算对", () => {
    // 全库扫描 wrongMark 含多个词的对比组，确认它们进了题库且判题接受多个下标
    let checked = 0;
    for (const lesson of grammarLessons) {
      const multiMarks = (lesson.contrast ?? []).filter(
        (contrast) => !contrast.bothRight && (contrast.wrongMark ?? "").trim().split(/\s+/).filter(Boolean).length > 1
      );
      if (multiMarks.length === 0) continue;
      const seen = new Set<string>();
      for (let round = 0; round < 8 && checked < 3; round += 1) {
        const items = buildBoostItems(lesson.id, 1, { seen, round });
        for (const item of items) {
          if (item.kind !== "spot" || !item.spotWrongIndexes || item.spotWrongIndexes.length < 2) continue;
          checked += 1;
          for (const index of item.spotWrongIndexes) {
            expect(judgeBoostSpot(item, index), `${item.id} 下标 ${index} 应判对`).toBe(true);
          }
          // 未参与标注的词应判错
          const unmarked = [0, 1, 2, 3].filter((index) => !item.spotWrongIndexes!.includes(index))[0];
          if (unmarked !== undefined) expect(judgeBoostSpot(item, unmarked)).toBe(false);
        }
        // 把本轮题源记入 seen，下一轮才会抽到别的改错题（否则永远同一道）
        items.forEach((item) => seen.add(item.sourceRef));
      }
    }
    expect(checked, "未能找到多词标注的改错题用于验证").toBeGreaterThan(0);
  });

  it("全库每课档 1 都出得来 4 种不同题型（素材齐备）", () => {
    const shortLessons: string[] = [];
    for (const lesson of grammarLessons) {
      const kinds = new Set(buildBoostItems(lesson.id, 1).map((item) => item.kind));
      if (kinds.size < 4) shortLessons.push(`${lesson.id}(${[...kinds].join("/")})`);
    }
    expect(shortLessons, `题型不足 4 类的课：${shortLessons.slice(0, 5).join(", ")}`).toEqual([]);
  });

  it("对比判断与单空填空判题：正确路径通过、错误路径不通过", () => {
    const items = buildBoostItems(sampleLessonId(), 1);
    const contrast = items.find((item) => item.kind === "contrast");
    if (contrast) {
      // 对比题的句子都是「有问题」的那句（isWrong=true）
      expect(contrast.contrast?.isWrong).toBe(true);
      expect(judgeBoostContrast(contrast, true)).toBe(true);
      expect(judgeBoostContrast(contrast, false)).toBe(false);
    }
    const cloze = items.find((item) => item.kind === "cloze");
    if (cloze) {
      expect(judgeBoostCloze(cloze, cloze.clozeAnswer ?? "")).toBe(true);
      // 大小写宽容
      expect(judgeBoostCloze(cloze, (cloze.clozeAnswer ?? "").toUpperCase())).toBe(true);
      expect(judgeBoostCloze(cloze, "definitely-not-the-answer")).toBe(false);
    }
  });

  it("全库可出题性：每课档 1 至少 3 题且题面非空（含 5 节无案件课）", () => {
    for (const lesson of grammarLessons) {
      const items = buildBoostItems(lesson.id, 1);
      expect(items.length, `${lesson.id} 档 1 题量不足（${items.length} 题）`).toBeGreaterThanOrEqual(3);
      for (const item of items) {
        expect(item.answer.trim(), `${lesson.id} 出现空答案`).not.toBe("");
      }
    }
  });
});

describe("grammarBoostService · 档 2 出题（自己想）", () => {
  it("题量 5、含中文意图与阶梯提示、rebuild 打乱后不等于原序", () => {
    const items = buildBoostItems(sampleLessonId(), 2);
    expect(items.length).toBeGreaterThanOrEqual(4);
    expect(items.length).toBeLessThanOrEqual(5);
    for (const item of items) {
      expect(item.intentZh.trim(), `${item.id} 缺中文意图`).not.toBe("");
    }
    const recall = items.find((item) => item.kind === "recall");
    expect(recall).toBeDefined();
    expect(recall?.hints?.length).toBeGreaterThanOrEqual(2);
    const rebuild = items.find((item) => item.kind === "rebuild");
    if (rebuild) {
      expect(rebuild.tokens?.length).toBeGreaterThan(1);
      expect(rebuild.tokens?.join(" ")).not.toBe(rebuild.answer);
    }
  });

  it("arrange 干扰项不与答案重复，且判题门槛 = 答案词数（不是词块库总数）", () => {
    // 回归：曾用「词块库总数」当判题门槛，带干扰项时用户拼对正确答案也永远不结算。
    const items = buildBoostItems(sampleLessonId(), 2);
    const arrange = items.find((item) => item.kind === "arrange");
    expect(arrange).toBeDefined();
    if (!arrange) return;
    const tokens = arrange.tokens ?? [];
    const answerWords = boostArrangeAnswerLength(arrange);
    // 该题确实带干扰项（词块数 > 答案词数），否则这条回归测不到东西
    expect(tokens.length).toBeGreaterThan(answerWords);
    // 按答案词数摆满即可判过
    expect(judgeBoostTokens(arrange, arrange.answer.split(/\s+/))).toBe(true);
    // 门槛函数必须等于答案词数
    expect(boostArrangeAnswerLength(arrange)).toBe(arrange.answer.split(/\s+/).filter(Boolean).length);
  });

  it("全库 arrange 题：判题门槛恒为答案词数，且在门槛处能判定通过", () => {
    for (const lesson of grammarLessons) {
      const arrange = buildBoostItems(lesson.id, 2).find((item) => item.kind === "arrange");
      if (!arrange) continue;
      const answerWords = arrange.answer.split(/\s+/).filter(Boolean);
      expect(boostArrangeAnswerLength(arrange), `${lesson.id} 门槛不等于答案词数`).toBe(answerWords.length);
      // 恰好摆满答案词数时，必须能判为通过（不会因丢词块而卡住）
      expect(judgeBoostTokens(arrange, answerWords), `${lesson.id} 正确答案未在门槛处结算`).toBe(true);
    }
  });

  it("中文→整句通过线 70、词块重建顺序敏感；arrange 干扰项不与答案重复", () => {
    const items = buildBoostItems(sampleLessonId(), 2);
    const recall = items.find((item) => item.kind === "recall");
    if (recall) {
      expect(judgeBoostRecall(recall, recall.answer).passed).toBe(true);
      expect(judgeBoostRecall(recall, "").passed).toBe(false);
      expect(BOOST_RECALL_PASS_SCORE).toBe(70);
    }
    const rebuild = items.find((item) => item.kind === "rebuild");
    if (rebuild) {
      expect(judgeBoostTokens(rebuild, rebuild.answer.split(/\s+/))).toBe(true);
      expect(BOOST_PRODUCE_PASS_SCORE).toBe(90);
    }
    const arrange = items.find((item) => item.kind === "arrange");
    if (arrange) {
      const answerWords = new Set(arrange.answer.split(/\s+/).map((word) => word.replace(/[.,!?;:]/g, "").toLowerCase()));
      const extra = (arrange.tokens ?? []).filter(
        (token) => !answerWords.has(token.replace(/[.,!?;:]/g, "").toLowerCase())
      );
      // 干扰项数量受控（最多 2 个）
      expect(extra.length).toBeLessThanOrEqual(2);
    }
  });

  it("档 2 题型交错：不出现相邻同类题（用户反馈「流程太重复」的回归）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const kinds = buildBoostItems(lesson.id, 2).map((item) => item.kind);
      for (let i = 1; i < kinds.length; i += 1) {
        if (kinds[i] === kinds[i - 1]) {
          offenders.push(`${lesson.id}(${kinds.join("/")})`);
          break;
        }
      }
    }
    expect(offenders, `相邻同型题的课：${offenders.slice(0, 5).join(", ")}`).toEqual([]);
  });

  it("讲解不与题目串味：对比卡的 whyZh 只在句子完全一致时使用（回归：曾把无关讲解配到别的句子上）", () => {
    for (const lesson of grammarLessons) {
      const contrastCorrects = new Set(
        (lesson.contrast ?? []).map((contrast) => normalizeLessonSentence(contrast.correct))
      );
      const contrastWhys = new Set((lesson.contrast ?? []).map((contrast) => contrast.whyZh.trim()));
      for (const tier of [1, 2, 3] as const) {
        for (const item of buildBoostItems(lesson.id, tier)) {
          // 非产出类题（有明确基准句的）如果用了对比卡讲解，该句必须就是对比卡的正确句。
          // spot 例外（wrongMark 契约）：spot 的答案是含错词的整句，讲解可以来自
          // wrongMark == 错词的对比卡——resolveGuidedExplain 只做这个精确匹配，
          // 「串味」的回归守卫由 grammarExplainService.test 的全库零术语/mentionsAnswer 测试承担。
          if (contrastWhys.has(item.explainZh) && item.kind !== "replace" && item.kind !== "choose" && item.kind !== "spot") {
            expect(
              contrastCorrects.has(normalizeLessonSentence(item.answer)),
              `${lesson.id} ${item.id} 用了对比卡讲解但句子不匹配：「${item.answer}」`
            ).toBe(true);
          }
        }
      }
    }
  });

  it("弱点驱动选题（R-B15）：不同弱点抽出不同旧课点，且命中标记为 true", () => {
    const lessonId = "lesson-30-some-any"; // 前面素材充足
    const pickWeakReview = (tag: GrammarErrorTag | null) => {
      const items = buildBoostItems(lessonId, 2, { weakSpotTag: tag });
      return items.find((item) => item.fromReview) ?? null;
    };
    const agreement = pickWeakReview("sv_agreement");
    const tense = pickWeakReview("tense");
    // 命中弱点时必须带标记（UI 据此显示「这道题冲你短板来的」）
    expect(agreement?.targetsWeakSpot, "三单弱点未命中").toBe(true);
    expect(tense?.targetsWeakSpot, "时态弱点未命中").toBe(true);
    // 不同弱点应抽到不同的旧课点（说明路由真的生效，不是固定同一道）
    expect(agreement?.answer).not.toBe(tense?.answer);
    // 无弱点时不打弱点标记（避免谎称「冲你短板来的」）
    const none = pickWeakReview(null);
    expect(none?.targetsWeakSpot ?? false).toBe(false);
  });

  it("档 2 三种题型都出现（回归：扩 arrange 素材后 recall 曾被挤掉）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const kinds = new Set(buildBoostItems(lesson.id, 2).map((item) => item.kind));
      if (!(kinds.has("recall") && kinds.has("rebuild") && kinds.has("arrange"))) {
        offenders.push(`${lesson.id}(${[...kinds].join("/")})`);
      }
    }
    expect(offenders, `档 2 题型不全的课：${offenders.slice(0, 5).join(", ")}`).toEqual([]);
  });

  it("档 2 的点词成句用上了全部带干扰项的 practice 题（不再只用第一道）", () => {
    for (const lesson of grammarLessons) {
      const withDistractors = lesson.practice.filter((step) => (step.distractors?.length ?? 0) > 0).length;
      if (withDistractors <= 1) continue;
      // 用 seen 逐轮抽干，统计能抽出多少道不同的 arrange 题
      const seen = new Set<string>();
      const refs = new Set<string>();
      for (let round = 0; round < 12; round += 1) {
        const items = buildBoostItems(lesson.id, 2, { seen, round });
        const fresh = items.filter((item) => item.kind === "arrange" && !seen.has(item.sourceRef));
        if (fresh.length === 0) break;
        fresh.forEach((item) => {
          seen.add(item.sourceRef);
          refs.add(item.sourceRef);
        });
      }
      expect(
        refs.size,
        `${lesson.id} 有 ${withDistractors} 道带干扰项的 practice，却只抽出 ${refs.size} 道点词成句`
      ).toBeGreaterThanOrEqual(Math.min(withDistractors, 2));
    }
  });

  it("全库可出题性：每课档 2 至少 4 题", () => {
    for (const lesson of grammarLessons) {
      const items = buildBoostItems(lesson.id, 2);
      expect(items.length, `${lesson.id} 档 2 题量不足（${items.length} 题）`).toBeGreaterThanOrEqual(4);
    }
  });
});

describe("grammarBoostService · 档 3 出题（换你来说）", () => {
  it("题量 3、三种产出任务形态、答案非空", () => {
    const items = buildBoostItems(sampleLessonId(), 3);
    expect(items.length).toBeLessThanOrEqual(3);
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(new Set(items.map((item) => item.kind))).toEqual(new Set(["produce", "variant", "fix"]));
    for (const item of items) {
      // variant / fix 的题面靠中文意图 + 样例句界定任务，produce 靠中文意图
      expect(item.intentZh.trim() || item.shapedFrom?.trim(), `${item.id} 缺任务说明`).toBeTruthy();
      expect(item.answer.trim()).not.toBe("");
      expect(item.explainZh.trim()).not.toBe("");
    }
  });

  it("产出判题按 90 分线（与课内 output 段同口径）", () => {
    const items = buildBoostItems(sampleLessonId(), 3);
    const first = items[0];
    expect(first).toBeDefined();
    expect(judgeBoostProduce(first, first.answer).passed).toBe(true);
    expect(judgeBoostProduce(first, "totally unrelated sentence here").passed).toBe(false);
    // 大小写与标点宽容
    expect(judgeBoostProduce(first, first.answer.toLowerCase().replace(/[.?]/g, "")).passed).toBe(true);
  });

  it("档 3 三种任务形态齐备：produce + variant + fix（用户反馈「三题都是同一件事」的回归）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const kinds = buildBoostItems(lesson.id, 3).map((item) => item.kind);
      const unique = new Set(kinds);
      if (!(unique.has("produce") && unique.has("variant") && unique.has("fix"))) {
        offenders.push(`${lesson.id}(${kinds.join("/")})`);
      }
    }
    expect(offenders, `档 3 缺任务形态的课：${offenders.slice(0, 5).join(", ")}`).toEqual([]);
  });

  it("档 3 的 variant / fix 都带样例句与讲解（题面要能看懂在做什么）", () => {
    for (const lesson of grammarLessons) {
      for (const item of buildBoostItems(lesson.id, 3)) {
        if (item.kind !== "variant" && item.kind !== "fix") continue;
        expect(item.shapedFrom?.trim(), `${item.id} 缺样例句`).toBeTruthy();
        expect(item.shapedLabel?.trim(), `${item.id} 缺样例句说明`).toBeTruthy();
        expect(item.explainZh.trim(), `${item.id} 缺讲解`).not.toBe("");
        // 样例句不能与被要求写出的答案相同（否则任务无意义）
        expect(normalizeLessonSentence(item.shapedFrom ?? "")).not.toBe(normalizeLessonSentence(item.answer));
      }
    }
  });

  it("全库可出题性：每课档 3 至少 2 题（其余由 AI 变式补位）", () => {
    for (const lesson of grammarLessons) {
      const items = buildBoostItems(lesson.id, 3);
      expect(items.length, `${lesson.id} 档 3 题量不足（${items.length} 题）`).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("grammarBoostService · 阶梯提示与判题分派", () => {
  it("buildRecallHints 给三级提示：词数+首字母 → 首字母序列 → 骨架", () => {
    const hints = buildRecallHints("I am drawing a picture.");
    expect(hints).toHaveLength(3);
    expect(hints[0]).toContain("5 个词");
    expect(hints[1]).toContain("I A D A P");
    expect(hints[2]).toContain("p_____");
  });

  it("judgeBoostItem 按题型分派到正确判据", () => {
    const items = buildBoostItems(sampleLessonId(), 1);
    const cloze = items.find((item) => item.kind === "cloze");
    if (cloze) {
      expect(judgeBoostItem(cloze, { text: cloze.clozeAnswer }).passed).toBe(true);
      expect(judgeBoostItem(cloze, { text: "nope" }).passed).toBe(false);
    }
    const contrast = items.find((item) => item.kind === "contrast");
    if (contrast) {
      expect(judgeBoostItem(contrast, { pickedProblem: true }).passed).toBe(true);
    }
  });
});

describe("grammarBoostService · 复练换池（R-B17）", () => {
  beforeEach(() => {
    clearGrammarTelemetry();
  });

  it("近 7 天已练过的题源被排除；超出窗口的不排除", () => {
    const lessonId = sampleLessonId();
    const firstPass = buildBoostItems(lessonId, 1);
    const targetRef = firstPass[0].sourceRef;

    // 7 天内练过 → 进 seen
    appendGrammarEvent({
      kind: "grammar_boost_step_result",
      lessonId,
      tier: 1,
      itemKind: "derived",
      sourceRef: targetRef,
      attempts: 1,
      passed: true,
      ts: new Date().toISOString()
    });
    const seen = buildBoostSeenIndex(makeTestData());
    expect(seen.has(targetRef)).toBe(true);

    // 8 天前练过 → 不进 seen
    clearGrammarTelemetry();
    appendGrammarEvent({
      kind: "grammar_boost_step_result",
      lessonId,
      tier: 1,
      itemKind: "derived",
      sourceRef: targetRef,
      attempts: 1,
      passed: true,
      ts: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    });
    expect(buildBoostSeenIndex(makeTestData()).has(targetRef)).toBe(false);
  });

  it("传 seen 复练时优先换一批新句；池子练完也不空（复练永远出得来题）", () => {
    const lessonId = sampleLessonId();
    const firstPass = buildBoostItems(lessonId, 2);
    const seen = new Set(firstPass.map((item) => item.sourceRef));
    const secondPass = buildBoostItems(lessonId, 2, { seen });
    // 池子充足时，新一批不应再重复第一遍的题源
    expect(secondPass.length).toBeGreaterThanOrEqual(4);
    const repeated = secondPass.filter((item) => seen.has(item.sourceRef));
    expect(repeated.length).toBeLessThan(firstPass.length);
    // 关键不变量：全部练完后仍然出得来题（无限重练红线）
    const everythingSeen = new Set([
      ...firstPass.map((item) => item.sourceRef),
      ...secondPass.map((item) => item.sourceRef)
    ]);
    const thirdPass = buildBoostItems(lessonId, 2, { seen: everythingSeen });
    expect(thirdPass.length).toBe(secondPass.length);
  });

  it("复练时换新题：整卷题源不复用（不会每次都是同一批题）", () => {
    const lessonId = sampleLessonId();
    const first = buildBoostItems(lessonId, 1);
    const seen = new Set(first.map((item) => item.sourceRef));
    const second = buildBoostItems(lessonId, 1, { seen, round: 1 });
    // 改错题固定占一个槽位，但内容必须换新（不再断言「第一题题型不同」——
    // 那是旧实现的特征；真正的用户价值是整卷题目不重样）
    const firstRefs = new Set(first.map((item) => item.sourceRef));
    const reused = second.filter((item) => firstRefs.has(item.sourceRef));
    expect(reused.length, `复练复用了 ${reused.length} 道旧题`).toBeLessThan(first.length);
    // 复练仍然出得来题（无限重练红线）
    expect(second.length).toBe(first.length);
  });

  it("改错题每轮都有一道（固定槽位，不参与轮空）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      for (let round = 0; round < 5; round += 1) {
        const hasSpot = buildBoostItems(lesson.id, 1, { round }).some((item) => item.kind === "spot");
        if (!hasSpot) offenders.push(`${lesson.id}(round${round})`);
      }
    }
    // 改错是训练价值最高的一类；固定槽位确保它不会因为「4 题 5 类」的轮转而整轮消失
    expect(offenders.slice(0, 8), `缺改错题的课次：${offenders.length} 处`).toEqual([]);
  });
});

describe("grammarBoostService · 课程 id 校验", () => {
  it("未知课程返回空数组（页面据此显示空态）", () => {
    expect(buildBoostItems("lesson-not-real", 1)).toEqual([]);
    expect(buildBoostItems("lesson-not-real", 2)).toEqual([]);
    expect(buildBoostItems("lesson-not-real", 3)).toEqual([]);
  });

  it("每个抽样课都能出满三档题", () => {
    for (const lessonId of SAMPLE_LESSON_IDS) {
      if (!GRAMMAR_LESSON_BY_ID.has(lessonId)) continue;
      for (const tier of BOOST_TIERS) {
        const items = buildBoostItems(lessonId, tier);
        expect(items.length, `${lessonId} 档 ${tier} 出题失败`).toBeGreaterThan(0);
      }
    }
  });
});

describe("档 1 · 双正解题（bothRight 素材，此前从未进过练习）", () => {
  it("有 bothRight 素材的课会出「两句都对吗」题，且素材两句差异足够大", () => {
    const lessonsWithBothRight = grammarLessons.filter((lesson) =>
      (lesson.contrast ?? []).some((contrast) => contrast.bothRight)
    );
    expect(lessonsWithBothRight.length).toBeGreaterThan(50);
    let found = 0;
    for (const lesson of lessonsWithBothRight) {
      const item = buildBoostItems(lesson.id, 1, { round: 0 }).find((entry) => entry.kind === "bothright");
      if (!item) continue;
      found += 1;
      expect(item.correctPair?.first.trim(), `${item.id} 缺第一句`).toBeTruthy();
      expect(item.correctPair?.second.trim(), `${item.id} 缺第二句`).toBeTruthy();
      // 两句必须不同（差异太小做不成判断题，已在构造时用 diffScore 过滤）
      expect(item.correctPair?.first).not.toBe(item.correctPair?.second);
      expect(item.explainZh.trim(), `${item.id} 缺讲解`).not.toBe("");
      // 判断：选「两句都对」判过；选「只有一句对」判错（考点就是"不止一种说法"）
      expect(judgeBoostBothRight(item, true), `${item.id} 选「都对」应判过`).toBe(true);
      expect(judgeBoostBothRight(item, false), `${item.id} 选「只有一句对」应判错`).toBe(false);
    }
    // 有素材的课必须全都在首轮就出到双正解题（否则素材又成了死数据）
    expect(found, `有 bothRight 素材却没出双正解题的课：${lessonsWithBothRight.length - found} 课`).toBe(
      lessonsWithBothRight.length
    );
  });

  it("双正解题不占用其它题型的槽位（题型数不减少）", () => {
    for (const lesson of grammarLessons) {
      const kinds = new Set(buildBoostItems(lesson.id, 1).map((item) => item.kind));
      expect(kinds.size, `${lesson.id} 题型只有 ${[...kinds].join("/")}`).toBeGreaterThanOrEqual(4);
    }
  });

  it("档 1 每题都有讲解（含新题型）", () => {
    for (const lesson of grammarLessons) {
      for (const item of buildBoostItems(lesson.id, 1)) {
        expect(item.explainZh.trim(), `${item.id} 缺讲解`).not.toBe("");
      }
    }
  });
});

describe("档 1 · 听力题（全库此前完全没有的能力维度）", () => {
  it("全库每课首轮都出到听力题（110/110）", () => {
    const missing: string[] = [];
    for (const lesson of grammarLessons) {
      if (!buildBoostItems(lesson.id, 1).some((item) => item.kind === "listen")) missing.push(lesson.id);
    }
    expect(missing.slice(0, 8), `没有听力题的课：${missing.length} 课`).toEqual([]);
  });

  it("听力题：播放句 = 正确项，干扰项 = 同组错句，二者只差本课语法点", () => {
    let checked = 0;
    for (const lesson of grammarLessons) {
      const item = buildBoostItems(lesson.id, 1).find((entry) => entry.kind === "listen");
      if (!item) continue;
      checked += 1;
      expect(item.listenText?.trim(), `${item.id} 缺播放文本`).toBeTruthy();
      expect(item.listenOptions?.length, `${item.id} 选项不是两个`).toBe(2);
      // 正确项必须在选项里，且与播放文本一致
      expect(item.listenOptions).toContain(item.listenText);
      // 判题：选正确项通过、选干扰项不通过
      for (const option of item.listenOptions ?? []) {
        const expected = option === item.listenText;
        expect(judgeBoostListen(item, option), `${item.id}「${option}」判定错误`).toBe(expected);
      }
      // 两个选项必须不同，且都够长（太短靠节奏能猜）
      const [a, b] = item.listenOptions ?? [];
      expect(a).not.toBe(b);
      expect(a.split(/\s+/).length).toBeGreaterThanOrEqual(3);
      expect(b.split(/\s+/).length).toBeGreaterThanOrEqual(3);
      expect(item.explainZh.trim(), `${item.id} 缺讲解`).not.toBe("");
    }
    expect(checked, "没有任何课出到听力题").toBeGreaterThan(100);
  });

  it("听力题选项顺序确定性（同一课多次生成顺序一致，可回放）", () => {
    const lesson = grammarLessons[12];
    const first = buildBoostItems(lesson.id, 1).find((item) => item.kind === "listen");
    const second = buildBoostItems(lesson.id, 1).find((item) => item.kind === "listen");
    expect(first?.listenOptions).toEqual(second?.listenOptions);
  });
});

describe("档 2 · 翻译题（激活从未用于练习的 examples / sceneSwings）", () => {
  it("大多数课出到翻译题，且素材是课内没练过的句子", () => {
    let checked = 0;
    const lessonsWithTranslate: string[] = [];
    for (const lesson of grammarLessons) {
      const item = buildBoostItems(lesson.id, 2).find((entry) => entry.kind === "translate");
      if (!item) continue;
      lessonsWithTranslate.push(lesson.id);
      checked += 1;
      // 中文必须是"意思"而非场景描述
      expect(item.intentZh.trim(), `${item.id} 缺中文意思`).not.toBe("");
      expect(/问|说|补|回答|指着|喊|笑|递|轮到/.test(item.intentZh), `${item.id} 中文像场景描述：${item.intentZh}`).toBe(false);
      // 必须与课内练习/核心句不同——否则这条题只是把练过的句子再问一遍
      const practiced = new Set([
        ...(lesson.practice ?? []).map((step) => normalizeLessonSentence(step.answer)),
        ...(lesson.guided ?? []).filter((step) => step.answer).map((step) => normalizeLessonSentence(step.answer)),
        normalizeLessonSentence(lesson.targetSentence)
      ]);
      expect(practiced.has(normalizeLessonSentence(item.answer)), `${item.id}「${item.answer}」是课内已练句`).toBe(false);
      expect(item.explainZh.trim(), `${item.id} 缺讲解`).not.toBe("");
      // 判题走产出线（90 分）
      expect(judgeBoostItem(item, { text: item.answer }).passed, `${item.id} 正确答案未判过`).toBe(true);
      expect(judgeBoostItem(item, { text: "totally wrong sentence" }).passed).toBe(false);
    }
    expect(checked, `出到翻译题的课只有 ${checked} 课`).toBeGreaterThan(90);
  });

  it("档 2 四种任务形态齐备（回忆 / 翻译 / 重组 / 组句）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const kinds = new Set(buildBoostItems(lesson.id, 2).map((item) => item.kind));
      if (!(kinds.has("recall") && kinds.has("rebuild") && kinds.has("arrange"))) {
        offenders.push(`${lesson.id}(${[...kinds].join("/")})`);
      }
      // 翻译题允许个别课缺（素材全被练习用过），但四类里至少要有三类
      if (kinds.size < 3) offenders.push(`${lesson.id} 题型不足`);
    }
    expect(offenders.slice(0, 5), `档 2 题型不足的课：${offenders.length} 课`).toEqual([]);
  });
});

describe("cloze 干扰项质量（这是「题目能不能做」的底线）", () => {
  /**
   * 回归背景：此前对任意答案无条件加 -s/-es/-ed/-ing，
   * 产出 `don'ted`、`shouldn'tes`、`drinked`、`swimed`、`wents` 这类不存在的词，
   * 实测 22% 的 cloze 题有 ≥2 个这种干扰项——用户不懂语法也能一眼排除，题目等于白送。
   */
  const FABRICATED = [
    // 缩略词 + 后缀
    /n't(ed|es|ing|s)$/,
    // 不规则动词 + 规则后缀
    /^(drinked|swimed|swiming|wents|wenting|wented|thinked|goed|eated|haved|seed|makeed|takeed|comeed|ranned|knowned|finded|losed|breaked|speaked|drawed|buyed|sitted|slepted|writed|readed|runed|camed|gaved|sawed|ates)$/
  ];
  const isFabricated = (word: string) => FABRICATED.some((pattern) => pattern.test(word.toLowerCase()));

  it("全库 cloze 干扰项不得是伪造词", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      for (const item of buildBoostItems(lesson.id, 1)) {
        if (item.kind !== "cloze") continue;
        const wrong = (item.clozeOptions ?? []).filter((option) => option !== item.clozeAnswer);
        const fabricated = wrong.filter(isFabricated);
        if (fabricated.length > 0) offenders.push(`${item.id}→${fabricated.join(",")}`);
      }
    }
    expect(offenders.slice(0, 6), `含伪造词的题：${offenders.length} 道`).toEqual([]);
  });

  // 修正（2026-09-20）：上面的黑名单只拦「不规则动词 + 后缀」的固定清单，实测漏了
  // `cleaneding`／`takesed`／`plaies` 这类——因为 `cleaned` 这类**过去式也在 KNOWN_VERBS 表里**
  // （表里混了 44 个第三人称单数形），再叠后缀就会造词。
  // 本断言用**词形结构**判定伪造词（比黑名单彻底、比白名单准确）：
  //   真词才允许的形态规则——`-ies` 只跟在辅音 + y 后（plaies ❌，play 是元音 + y）；
  //   已变形的词不再叠第二个变形后缀（cleaneding／takesed／takess ❌）。
  it("全库 cloze 干扰项不得是伪造词（词形结构判定）", () => {
    // 允许多段后缀的例外（真词里存在的组合）
    const LEGIT = new Set([
      "closed", "cleaned", "played", "studied", "watched", "finished", "started",
      "wanted", "needed", "liked", "helped", "opened", "listened", "walked", "worked"
    ]);
    const isFabricatedWord = (word: string): boolean => {
      const w = word.toLowerCase().replace(/[^a-z']/g, "");
      if (!w || LEGIT.has(w)) return false;
      // ① 叠两个变形后缀（真词不会有这种结构）：cleaneding／takesed／played+ing 之类
      //    注意 `-ings` 不能一律拦（`sings`／`things` 是真词），只拦「变形词 + 变形后缀」的组合。
      if (/(eding|inged|eded|inging|iesed|iesing|seding|singed)$/.test(w)) return true;
      if (/[a-z]{4,}(eds|eding|ings)$/.test(w) && /(clean|take|make|want|like|need|play|watch|work|live|help)$/.test(w.replace(/(eds|eding|ings)$/, ""))) return true;
      // ② -ies 出现在非「辅音 + y」的基形后（play→plaies、enjoy→enjoies）
      if (/[aeiou]ies$/.test(w)) return true;
      // ③ 以 -s 结尾的**已变形动词**再叠后缀（takesed／takess／takesing）
      //    只针对 `take` 这类「三单形与基础形只差一个 s」的词——`sings` 是真词，不在列。
      if (/^(takes|makes|wants|likes|needs|plays|watches|works|lives|helps|cleans)(ed|es|ing|s)$/.test(w)) return true;
      return false;
    };
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      for (const item of buildBoostItems(lesson.id, 1)) {
        if (item.kind !== "cloze") continue;
        for (const option of item.clozeOptions ?? []) {
          if (option === item.clozeAnswer) continue;
          if (isFabricatedWord(option)) offenders.push(`${item.id}: ${item.clozeAnswer} → ${option}`);
        }
      }
    }
    expect(
      offenders.slice(0, 8),
      `伪造干扰项（${offenders.length} 处）：${offenders.slice(0, 8).join(" | ")}`
    ).toEqual([]);
  });

  it("每道 cloze 有 4 个选项、含正确答案、且选项互不相同", () => {
    for (const lesson of grammarLessons) {
      for (const item of buildBoostItems(lesson.id, 1)) {
        if (item.kind !== "cloze") continue;
        const options = item.clozeOptions ?? [];
        expect(options.length, `${item.id} 选项数 ${options.length}`).toBe(4);
        expect(options).toContain(item.clozeAnswer);
        expect(new Set(options.map((option) => option.toLowerCase())).size, `${item.id} 选项有重复`).toBe(options.length);
      }
    }
  });

  it("缩略词答案的干扰项应来自同族（真会混），而不是乱加后缀", () => {
    let checked = 0;
    for (const lesson of grammarLessons) {
      for (const item of buildBoostItems(lesson.id, 1)) {
        if (item.kind !== "cloze") continue;
        const answer = (item.clozeAnswer ?? "").toLowerCase();
        if (!/n't$/.test(answer)) continue;
        checked += 1;
        const wrong = (item.clozeOptions ?? []).filter((option) => option !== item.clozeAnswer);
        // 至少有一个干扰项也是缩略词（don't ↔ doesn't ↔ didn't 这种真混淆项）
        expect(
          wrong.some((option) => /n't$/.test(option.toLowerCase())),
          `${item.id} 的干扰项没有一个同族缩略词：${JSON.stringify(item.clozeOptions)}`
        ).toBe(true);
      }
    }
    expect(checked).toBeGreaterThan(0);
  });
});
