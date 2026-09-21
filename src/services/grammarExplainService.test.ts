import { beforeEach, describe, expect, it } from "vitest";
import { grammarLessons } from "../data/grammarLessons";
import { findZeroTermHits } from "../data/grammarZeroTerms";
import {
  buildLessonExplainContext,
  buildPresetQuestions,
  createExplainQuota,
  explainCacheKey,
  normalizeQuestion,
  validateExplainAnswer,
  DECLINED_ANSWER,
  appendWhyWrongLog,
  clearWhyWrongLog,
  listWhyWrongLog,
  whyWrongHitRate,
  describeExplainSource,
  explainForSentence,
  explainStructuralWhy,
  isThinExplain,
  resolveGuidedExplain,
  type ExplainAnswer,
  type LessonExplainContext
} from "./grammarExplainService";

const firstLesson = grammarLessons[0];

describe("grammarExplainService · 素材目录", () => {
  it("每课都能构建素材目录，且含一句话规则兜底", () => {
    for (const lesson of grammarLessons) {
      const context = buildLessonExplainContext(lesson.id);
      expect(context, `${lesson.id} 无法构建`).not.toBeNull();
      expect(context!.allowedSources.length, `${lesson.id} 素材为空`).toBeGreaterThan(0);
      expect(
        context!.allowedSources.some((entry) => entry.ref === "oneLineRule"),
        `${lesson.id} 缺一句话规则`
      ).toBe(true);
    }
  });

  it("contentHash 对素材变化敏感（缓存失效依据）", () => {
    const a = buildLessonExplainContext(firstLesson.id)!;
    const b = buildLessonExplainContext(firstLesson.id)!;
    expect(a.contentHash).toBe(b.contentHash);
    const other = buildLessonExplainContext(grammarLessons[1].id)!;
    expect(a.contentHash).not.toBe(other.contentHash);
  });

  it("未知课程返回 null", () => {
    expect(buildLessonExplainContext("lesson-does-not-exist")).toBeNull();
  });
});

describe("grammarExplainService · 预设追问（确定性生成）", () => {
  it("每课至少 1 条预设问，且基于的 ref 在本课素材里真实存在", () => {
    for (const lesson of grammarLessons) {
      const questions = buildPresetQuestions(lesson.id);
      expect(questions.length, `${lesson.id} 没有预设问`).toBeGreaterThanOrEqual(1);
      const context = buildLessonExplainContext(lesson.id)!;
      for (const question of questions) {
        expect(
          context.allowedSources.some((entry) => entry.ref === question.basedOnRef),
          `${lesson.id} 预设问「${question.text}」基于不存在的 ref ${question.basedOnRef}`
        ).toBe(true);
        expect(question.text.trim()).not.toBe("");
      }
    }
  });

  it("同课多次生成结果一致（种子可回放）", () => {
    const first = buildPresetQuestions(firstLesson.id);
    const second = buildPresetQuestions(firstLesson.id);
    expect(first).toEqual(second);
  });

  it("预设问数上限 3 条", () => {
    for (const lesson of grammarLessons) {
      expect(buildPresetQuestions(lesson.id).length).toBeLessThanOrEqual(3);
    }
  });
});

describe("grammarExplainService · 三道校验", () => {
  const context = buildLessonExplainContext(firstLesson.id)!;
  const validAnswer: ExplainAnswer = {
    answer: "因为 I 的搭档是 am。",
    citedSource: "oneLineRule",
    declined: false
  };

  it("① 零术语：含任一禁词即丢弃", () => {
    const bad: ExplainAnswer = { ...validAnswer, answer: "主语是 I 的时候用 am。" };
    const result = validateExplainAnswer(bad, context);
    expect(result.ok).toBe(false);
    expect(result.failure).toBe("term");
    expect(result.hits).toContain("主语");
  });

  it("② 长度：超过 120 字丢弃", () => {
    const bad: ExplainAnswer = { ...validAnswer, answer: "长".repeat(121) };
    expect(validateExplainAnswer(bad, context).failure).toBe("length");
  });

  it("② 形态：markdown 语法丢弃", () => {
    const bad: ExplainAnswer = { ...validAnswer, answer: "- 列表项不是讲解" };
    expect(validateExplainAnswer(bad, context).failure).toBe("length");
  });

  it("③ 回指：citedSource 不在素材目录丢弃", () => {
    const bad: ExplainAnswer = { ...validAnswer, citedSource: "not:a:ref" };
    expect(validateExplainAnswer(bad, context).failure).toBe("citation");
  });

  it("③ 回指：declined=false 时空 citedSource 丢弃", () => {
    const bad: ExplainAnswer = { ...validAnswer, citedSource: null };
    expect(validateExplainAnswer(bad, context).failure).toBe("citation");
  });

  it("② 英文片段必须逐字存在于被引素材（防 AI 造新例句）", () => {
    const bad: ExplainAnswer = {
      ...validAnswer,
      answer: "要说 I am happily dancing tomorrow.",
      citedSource: "oneLineRule"
    };
    expect(validateExplainAnswer(bad, context).failure).toBe("foreign");
  });

  it("合法答案通过（含弃权话术）", () => {
    expect(validateExplainAnswer(validAnswer, context).ok).toBe(true);
    const declined: ExplainAnswer = { answer: DECLINED_ANSWER, citedSource: null, declined: true };
    expect(validateExplainAnswer(declined, context).ok).toBe(true);
  });

  it("校验用的是共享零术语表（与课程守门同源）", () => {
    // 抽一个课程守门表里的词验证运行时同表
    const bad: ExplainAnswer = { ...validAnswer, answer: "这是复数的用法。" };
    expect(validateExplainAnswer(bad, context).failure).toBe("term");
  });
});

describe("grammarExplainService · 配额与缓存键", () => {
  it("配额：默认可问 2 次，用完即止", () => {
    const quota = createExplainQuota();
    expect(quota.canAsk()).toBe(true);
    expect(quota.remaining()).toBe(2);
    quota.consume();
    expect(quota.canAsk()).toBe(true);
    expect(quota.remaining()).toBe(1);
    quota.consume();
    expect(quota.canAsk()).toBe(false);
    expect(quota.remaining()).toBe(0);
  });

  it("缓存键：同课同锚同问同模型命中；问题归一化后等价命中", () => {
    const a = explainCacheKey("L1", "watch.deepDive", "为什么是 am？", "model-a", "hash1");
    const b = explainCacheKey("L1", "watch.deepDive", "为什么是 am？", "model-a", "hash1");
    const c = explainCacheKey("L1", "watch.deepDive", "为什么是am", "model-a", "hash1"); // 标点差异归一
    expect(a).toBe(b);
    expect(a).toBe(c); // 归一化后同键
    const d = explainCacheKey("L1", "watch.deepDive", "为什么是 am？", "model-b", "hash1");
    expect(a).not.toBe(d); // 换模型失效
    const e = explainCacheKey("L1", "watch.deepDive", "为什么是 am？", "model-a", "hash2");
    expect(a).not.toBe(e); // 内容变化失效
  });

  it("normalizeQuestion：去标点空白小写", () => {
    expect(normalizeQuestion("Why am? Is it!")).toBe("whyamisit");
  });
});

describe("错句本地留痕（R-WW8）", () => {
  it("追加与读取：滚动淘汰 ≤500 条", () => {
    clearWhyWrongLog();
    for (let index = 0; index < 505; index += 1) {
      appendWhyWrongLog({
        lessonId: `lesson-01-am`,
        stepIndex: index,
        wrongSentence: `wrong sentence ${index}`,
        matchSource: "local_exact",
        ts: "2026-09-19T10:00:00.000Z"
      });
    }
    const entries = listWhyWrongLog();
    expect(entries.length).toBe(500);
    // 滚动淘汰最旧
    expect(entries[0].wrongSentence).toBe("wrong sentence 5");
    expect(entries[499].wrongSentence).toBe("wrong sentence 504");
  });

  it("命中率计算：matched / total", () => {
    clearWhyWrongLog();
    appendWhyWrongLog({ lessonId: "L", stepIndex: 0, wrongSentence: "a", matchSource: "local_exact", ts: "t" });
    appendWhyWrongLog({ lessonId: "L", stepIndex: 1, wrongSentence: "b", matchSource: "fallback", ts: "t" });
    const { total, matched, rate } = whyWrongHitRate();
    expect(total).toBe(2);
    expect(matched).toBe(1);
    expect(rate).toBe(0.5);
  });
});

describe("grammarExplainService · 讲解质量升级层（2026-09-19）", () => {
  const lesson02 = grammarLessons.find((lesson) => lesson.id === "lesson-02-is")!;
  const lesson96 = grammarLessons.find((lesson) => lesson.id === "lesson-96-was-raining")!;

  describe("isThinExplain", () => {
    it("过短/空串判薄", () => {
      expect(isThinExplain("", "It is raining.")).toBe(true);
      expect(isThinExplain("She 的搭档是 is。", "She is my teacher.")).toBe(true);
    });

    it("复述答案判薄（剥掉答案句后剩余 ≤26 字符）", () => {
      expect(isThinExplain("动作穿 -ing 外套：It was raining。", "It was raining.")).toBe(true);
      expect(isThinExplain("问句把 Is 搬到句首。Is there a park near here?", "Is there a park near here?")).toBe(true);
    });

    it("有真实增量内容的解释不判薄", () => {
      const rich = "was 是那天版搭档，is 是现在版搭档：It was raining。讲那天的背景就用它开头，故事一下就有了画面，事情来了再接下一句。";
      expect(isThinExplain(rich, "It was raining.")).toBe(false);
    });

    it("不含答案句的普通解释不判薄", () => {
      expect(isThinExplain("昨天版搭档 + -ing 外套：三个词说完。", "It was raining.")).toBe(false);
    });
  });

  describe("resolveGuidedExplain", () => {
    it("L96 choose：复述型 explain 升级为 deepDive/spot 素材（用户实测截图问题）", () => {
      const step = lesson96.guided.find((item) => item.kind === "choose")!;
      const resolved = resolveGuidedExplain(step, lesson96);
      expect(resolved).not.toBe(step.explain.trim());
      expect(resolved.length).toBeGreaterThan(step.explain.trim().length);
      expect(resolved).toContain("raining");
    });

    it("thin explain 从本课素材升级；rich explain 原样保留（只升级不降级）", () => {
      const thin = lesson96.guided.find((item) => item.kind === "spot")!;
      expect(resolveGuidedExplain(thin, lesson96)).not.toBe(thin.explain.trim());
      const richStep = {
        kind: "arrange",
        answer: "It was raining.",
        explain: "was 是那天版搭档，is 是现在版搭档：It was raining。讲那天的背景就用它开头，故事一下就有了画面，事情来了再接下一句。"
      };
      expect(resolveGuidedExplain(richStep, lesson96)).toBe(richStep.explain);
    });

    it("choose/replace 的讲解必须提到答案词（讲别的零件=答非所问）", () => {
      // L02 choose 答案 is；本课素材里讲 am/a 的句子一律不许借
      const step = lesson02.guided.find((item) => item.kind === "choose")!;
      const resolved = resolveGuidedExplain(step, lesson02);
      if (resolved !== step.explain.trim()) expect(resolved.toLowerCase()).toContain("is");
    });

    it("borrowed 素材永不携带零术语（红线优先于覆盖率）", () => {
      for (const lesson of grammarLessons) {
        for (const step of lesson.guided) {
          const resolved = resolveGuidedExplain(step, lesson);
          expect(findZeroTermHits(resolved), `${lesson.id}·${step.kind}: ${resolved}`).toEqual([]);
        }
      }
    });
  });

  describe("explainForSentence", () => {
    it("contrast 精确句命中 whyZh", () => {
      const contrast = lesson02.contrast![0];
      const why = explainForSentence(lesson02, contrast.correct);
      expect(why.length).toBeGreaterThan(0);
    });

    it("无关句子不猜配：没有句子级素材时只退本课级讲解（recall.note / oneLineRule）", () => {
      // 与 L02 任何句子都不匹配——结果只能是本课级讲解，绝不出现别的句子的解释
      const result = explainForSentence(lesson02, "The purple elephant dances tango.");
      expect(result).toBe(lesson02.recall?.noteZh?.trim() || lesson02.oneLineRule);
    });

    it("全库 practice 句落兜底比例 ≤2%（本次升级的验收线）", () => {
      let total = 0;
      let generic = 0;
      for (const lesson of grammarLessons) {
        for (const item of lesson.practice ?? []) {
          if (!item?.answer) continue;
          total += 1;
          if (explainForSentence(lesson, item.answer) === lesson.oneLineRule) generic += 1;
        }
      }
      expect(total).toBeGreaterThan(0);
      expect(generic / total, `落兜底 ${generic}/${total}`).toBeLessThanOrEqual(0.02);
    });
  });
});

describe("完课页规则两行条 · 数据守门（2026-09-20 E1 改版）", () => {
  it("每课 summary.points 都能拆成「例句 + 说明」，说明非空", () => {
    for (const lesson of grammarLessons) {
      const points = lesson.summary?.points ?? [];
      expect(points.length, `${lesson.id} 无 summary.points`).toBeGreaterThan(0);
      for (const point of points) {
        const at = point.indexOf("——");
        const note = at >= 0 ? point.slice(at + 2).trim() : point.trim();
        expect(note.length, `${lesson.id} 说明为空：「${point}」`).toBeGreaterThan(0);
      }
    }
  });

  it("规则行渲染不产生空条件胶囊（冒号后需有实义内容才拆）", () => {
    for (const lesson of grammarLessons) {
      for (const point of lesson.summary?.points ?? []) {
        const at = point.indexOf("——");
        const note = at >= 0 ? point.slice(at + 2).trim() : point.trim();
        const colonAt = note.search(/[：:]/);
        const hasSplit = colonAt > 0 && note.slice(colonAt + 1).trim().length >= 2;
        if (hasSplit) {
          expect(note.slice(0, colonAt).trim().length, `${lesson.id} 条件为空：「${point}」`).toBeGreaterThan(0);
          expect(note.slice(colonAt + 1).trim().length, `${lesson.id} 动作为空：「${point}」`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("targetSentence 与 variants 去重后仍有句子可展示（新句子列表不为空）", () => {
    for (const lesson of grammarLessons) {
      const normalized = lesson.targetSentence.trim().toLowerCase().replace(/[.,!?;:'"()]/g, "");
      const rest = (lesson.variants ?? []).filter(
        (variant) => variant.en.trim().toLowerCase().replace(/[.,!?;:'"()]/g, "") !== normalized
      );
      expect(
        lesson.targetSentence.trim().length > 0 || rest.length > 0,
        `${lesson.id} 去重后无句子`
      ).toBe(true);
    }
  });
});

describe("M1 · 解锁存量：贴题回答应能过检（2026-09-21 先红后绿）", () => {
  const lesson01 = grammarLessons.find((lesson) => lesson.id === "lesson-01-am")!;

  it("当前题的正误句必须可被 AI 逐字引用（foreign 校验不得打回贴题讲解）", () => {
    // 根因：allowedSources 只收录中文讲解，不含 contrast 的正误句本身，
    // 于是「正确说法是 He drinks milk every day.」会被 foreign 打回，只有通用复述能过检。
    const context = buildLessonExplainContext("lesson-01-am", {
      userSentence: "I is tired.",
      correctSentence: "I am tired."
    })!;
    expect(context).not.toBeNull();
    expect(context.attemptSources?.map((entry) => entry.ref)).toEqual(["attempt:user", "attempt:correct"]);

    const verdict = validateExplainAnswer(
      {
        answer: "你说的是「I is tired.」，这句要用 「I am tired.」——I 的搭档永远钉死是 am，不换人。",
        citedSource: "attempt:correct",
        declined: false
      },
      context
    );
    expect(verdict, JSON.stringify(verdict)).toEqual({ ok: true });
  });

  it("attempt 素材不进 contentHash（防每条错句都 miss 课级缓存）", () => {
    const plain = buildLessonExplainContext("lesson-01-am")!;
    const withAttempt = buildLessonExplainContext("lesson-01-am", {
      userSentence: "I is tired.",
      correctSentence: "I am tired."
    })!;
    expect(withAttempt.contentHash).toBe(plain.contentHash);
  });

  it("无 attempt 入参时行为与旧版一致（向后兼容）", () => {
    const context = buildLessonExplainContext("lesson-01-am")!;
    expect(context.attemptSources ?? []).toEqual([]);
    expect(context.allowedSources.length).toBeGreaterThan(0);
  });

  it("AI 仍不得引用素材之外的第三句英文（白名单红线不放松）", () => {
    const context = buildLessonExplainContext("lesson-01-am", {
      userSentence: "I is tired.",
      correctSentence: "I am tired."
    })!;
    const verdict = validateExplainAnswer(
      {
        answer: "改成 I am happy now 就好了。",
        citedSource: "attempt:correct",
        declined: false
      },
      context
    );
    expect(verdict.ok).toBe(false);
    expect(verdict.failure).toBe("foreign");
  });
});

describe("M1 · 配额退还与结构解释器（2026-09-21）", () => {
  it("配额失败可退还：两次失败后仍能提问（此前失败即永久消耗）", () => {
    const quota = createExplainQuota();
    expect(quota.canAsk()).toBe(true);
    quota.consume();
    quota.consume();
    expect(quota.canAsk()).toBe(false); // 两次用尽
    quota.refund();
    expect(quota.canAsk()).toBe(true); // 失败退还后恢复可问
    expect(quota.remaining()).toBe(1);
    quota.refund();
    quota.refund(); // 多次退还不得变成负数
    expect(quota.remaining()).toBe(2);
  });

  it("换序形结构解释器给出确定性正解（AI 讲错时的兜底依据）", () => {
    // 实测：相邻换序样本 348 命中里 138 条讲解不提顺序——结构解释器对换序覆盖 100%
    const result = explainStructuralWhy("she Does let him play", "Does she let him play");
    expect(result).not.toBeNull();
    expect(result!.kind).toBe("swap");
    expect(result!.whyZh).toContain("顺序不对");
  });

  it("全库换序样本：结构解释器必须判为 swap（A3 的成立前提）", () => {
    let checked = 0;
    let swaps = 0;
    for (const lesson of grammarLessons) {
      for (const point of lesson.summary?.points ?? []) {
        const at = point.indexOf("——");
        if (at < 0) continue;
        const sentence = point.slice(0, at).trim();
        const words = sentence.split(/\s+/).filter(Boolean);
        if (words.length < 3 || words.length > 8) continue;
        // 构造相邻换序变体
        if (words[0].toLowerCase() === words[1].toLowerCase()) continue;
        const swapped = [...words];
        [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
        const result = explainStructuralWhy(swapped.join(" "), sentence);
        if (!result) continue;
        checked += 1;
        if (result.kind === "swap") swaps += 1;
      }
    }
    expect(checked).toBeGreaterThan(50);
    expect(swaps / checked).toBeGreaterThan(0.95);
  });
});

describe("M2 · 可追溯性与归因（2026-09-21）", () => {
  it("citedSource 翻译为人话来源标签（可追溯性上屏）", () => {
    expect(describeExplainSource("attempt:user")).toBe("你自己拼的那句");
    expect(describeExplainSource("attempt:correct")).toBe("这句的正确说法");
    expect(describeExplainSource("deepDive:2")).toBe("这一课的深挖卡");
    expect(describeExplainSource("contrast:0:why")).toBe("这一课的第 1 组对比");
    expect(describeExplainSource("contrast:3:why")).toBe("这一课的第 4 组对比");
    expect(describeExplainSource("guided:1:explain")).toBe("这一课的第 2 道引导题");
    expect(describeExplainSource("oneLineRule")).toBe("这一课的一句话规则");
    expect(describeExplainSource(null)).toBe("这一课的讲解");
    expect(describeExplainSource("未知:ref")).toBe("这一课的讲解");
  });
});
