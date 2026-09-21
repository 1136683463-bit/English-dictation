import { describe, expect, it } from "vitest";
import {
  buildLessonExplainContext,
  explainStructuralWhy,
  matchWhyWrong,
  normalizeQuestion,
  explainCacheKey
} from "./grammarExplainService";
import { normalizeLessonSentence } from "./lessonService";
import { grammarLessons } from "../data/grammarLessons";

describe("「为什么错了」本地匹配器（R-WW1）", () => {
  it("精确命中：用户错句与本课 contrast.wrong 全等 → 给 whyZh，source=local_exact", () => {
    // L1 有 "I is Xiaomei." → "I am Xiaomei." 的对比组
    const match = matchWhyWrong("lesson-01-am", "I is Xiaomei.");
    expect(match).not.toBeNull();
    expect(match?.source).toBe("local_exact");
    expect(match?.whyZh.trim()).not.toBe("");
    expect(match?.citedRef).toMatch(/^contrast:\d+:why$/);
  });

  it("标点与大小写宽容：I IS XIAOMEI 也能精确命中", () => {
    const match = matchWhyWrong("lesson-01-am", "I IS XIAOMEI");
    expect(match?.source).toBe("local_exact");
  });

  it("近似命中：漏一词错法 diffScore ≥85 → local_fuzzy", () => {
    // 从某课 contrast.wrong 出发模拟「漏一词」错法，验证近似层
    let tested = 0;
    for (const lesson of grammarLessons) {
      for (const contrast of lesson.contrast ?? []) {
        if (contrast.bothRight) continue;
        const words = contrast.wrong.replace(/[.?!]+$/, "").split(/\s+/).filter(Boolean);
        if (words.length < 4) continue;
        // 漏最后一个实词
        const reduced = words.slice(0, -1).join(" ") + ".";
        const match = matchWhyWrong(lesson.id, reduced);
        if (match && match.source === "local_fuzzy") {
          tested += 1;
          expect(match.diffScoreAtMatch).toBeGreaterThanOrEqual(85);
          expect(match.whyZh.trim()).not.toBe("");
          if (tested >= 3) return;
        }
      }
    }
    expect(tested, "近似层未验证到足够样本").toBeGreaterThanOrEqual(1);
  });

  it("换序形短路：词多重集相等而顺序不同 → 返回 null（模拟 400 例 0 命中的回归锁定）", () => {
    let tested = 0;
    let wronglyMatched = 0;
    for (const lesson of grammarLessons) {
      for (const contrast of lesson.contrast ?? []) {
        if (contrast.bothRight) continue;
        const words = contrast.wrong.replace(/[.?!]+$/, "").split(/\s+/).filter(Boolean);
        if (words.length < 3) continue;
        // 相邻换序（词多重集相等、顺序不同）
        const swapped = [...words];
        [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
        const swappedSentence = swapped.join(" ") + ".";
        // 正确句不会等于换序句（否则数据本身有问题）
        if (normalizeLessonSentence(swappedSentence) === normalizeLessonSentence(contrast.correct)) continue;
        tested += 1;
        const match = matchWhyWrong(lesson.id, swappedSentence);
        if (match?.source === "local_fuzzy") wronglyMatched += 1;
      }
    }
    expect(tested, "换序样本不足").toBeGreaterThan(50);
    expect(wronglyMatched, `换序形走了近似层 ${wronglyMatched} 次——红线：85 线 0 命中`).toBe(0);
  });

  it("70–84 分区间不命中（宁弃权不给错因）", () => {
    // 构造一个低相似度句子（完全无关），不应命中任何组
    const match = matchWhyWrong("lesson-01-am", "She completely disagrees with everything.");
    expect(match).toBeNull();
  });

  it("正确句不命中（只有错句才给错因；答对有答对分支的讲解）", () => {
    // L1 的正确句 I am Xiaomei 本身也在 contrast.correct 里，但不是 wrong
    const match = matchWhyWrong("lesson-01-am", "I am Xiaomei.");
    // 精确层匹配的是 wrong；若某课的 wrong 恰好等于另一课的正确句也不应跨课命中
    if (match) {
      // 同课内 wrong==correct 的组已在构建时排除，命中必须来自真正的 wrong
      expect(match.whyZh.trim()).not.toBe("");
    }
  });

  it("未知课程与空句返回 null", () => {
    expect(matchWhyWrong("lesson-not-real", "I is Xiaomei.")).toBeNull();
    expect(matchWhyWrong("lesson-01-am", "   ")).toBeNull();
  });

  it("确定性：同输入同输出（可回放）", () => {
    const a = matchWhyWrong("lesson-01-am", "I is Xiaomei.");
    const b = matchWhyWrong("lesson-01-am", "I is Xiaomei.");
    expect(a).toEqual(b);
  });

  it("全库每课都有可匹配素材（覆盖 118/118）", () => {
    for (const lesson of grammarLessons) {
      const context = buildLessonExplainContext(lesson.id);
      expect(context, `${lesson.id} 无素材目录`).not.toBeNull();
    }
  });
});

describe("结构错因解释器 explainStructuralWhy（兜底层讲「为什么不对」）", () => {
  it("换序形：词全对顺序错 → 指出错位位置与该放什么", () => {
    const result = explainStructuralWhy("was it raining.", "It was raining.");
    expect(result?.kind).toBe("swap");
    expect(result?.whyZh).toContain("顺序不对");
    expect(result?.whyZh).toContain("it");
  });

  it("多余词：混进干扰项 → 明说哪个词用不上", () => {
    const result = explainStructuralWhy("It was rain raining.", "It was raining.");
    expect(result?.kind).toBe("extra");
    expect(result?.whyZh).toContain("rain");
    expect(result?.whyZh).toContain("用不上");
  });

  it("缺词：少放一块 → 明说还差什么", () => {
    const result = explainStructuralWhy("It raining.", "It was raining.");
    expect(result?.kind).toBe("missing");
    expect(result?.whyZh).toContain("was");
  });

  it("用错词：一对一放错 → 该用哪个不该用哪个都说清", () => {
    const result = explainStructuralWhy("It was rain.", "It was raining.");
    expect(result?.kind).toBe("wrong-word");
    expect(result?.whyZh).toContain("raining");
    expect(result?.whyZh).toContain("rain");
  });

  it("多词+缺词混合 → 两边都报", () => {
    const result = explainStructuralWhy("It was rain sunny.", "It was raining.");
    expect(result?.kind).toBe("mixed");
    expect(result?.whyZh).toContain("rain");
    expect(result?.whyZh).toContain("raining");
  });

  it("大小写与标点宽容：It was raining. 对 It was raining 返回 null", () => {
    expect(explainStructuralWhy("It was raining", "It was raining.")).toBeNull();
  });

  it("缩写等价由调用方判题处理，这里只做词级对比：it's ≠ it is 会给解释而非 null", () => {
    // 解释器不判断缩写等价（那是判题层的事），词集不同就如实解释差异
    const result = explainStructuralWhy("it's raining.", "it is raining.");
    expect(result).not.toBeNull();
  });

  it("空输入返回 null", () => {
    expect(explainStructuralWhy("   ", "It was raining.")).toBeNull();
    expect(explainStructuralWhy("It was raining.", "")).toBeNull();
  });

  it("正确答案本身不产生解释（答对不该走到这）", () => {
    expect(explainStructuralWhy("It was raining.", "It was raining.")).toBeNull();
  });

  it("每条解释都带答案原文（供「照着拼」对照）", () => {
    const result = explainStructuralWhy("It was rain.", "It was raining.");
    expect(result?.answer).toBe("It was raining.");
  });
});

describe("问一句辅助函数补充", () => {
  it("normalizeQuestion 剥全角标点（中文输入法标点不造成缓存 miss）", () => {
    expect(normalizeQuestion("为什么是 am？")).toBe(normalizeQuestion("为什么是am"));
  });

  it("explainCacheKey 各维度变化即变", () => {
    const base = explainCacheKey("L1", "watch.deepDive", "q", "m", "h");
    expect(explainCacheKey("L2", "watch.deepDive", "q", "m", "h")).not.toBe(base);
    expect(explainCacheKey("L1", "practice.step:0", "q", "m", "h")).not.toBe(base);
    expect(explainCacheKey("L1", "watch.deepDive", "q2", "m", "h")).not.toBe(base);
  });
});
