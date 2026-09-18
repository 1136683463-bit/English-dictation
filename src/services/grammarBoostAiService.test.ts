import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  GRAMMAR_CORRECTION_RULES,
  boostAiTimeoutMs,
  boostContentHash,
  buildBoostBatchCorrectionMessages,
  buildVariantMessages,
  canUseBoostAi,
  clearBoostAiCache,
  generatedToBoostItem,
  requestBoostBatchCorrection,
  requestBoostVariantItems,
  validateGeneratedItems
} from "./grammarBoostAiService";
import type { AiProviderSettings } from "../types";

const baseProvider = (overrides: Partial<AiProviderSettings> = {}): AiProviderSettings => ({
  enabled: true,
  baseUrl: "https://api.example.com/v1",
  apiKey: "sk-test",
  model: "test-model",
  temperature: 0.7,
  timeoutMs: 120000,
  fallbackToLocal: true,
  ...overrides
});

const anchors = [
  { en: "I am drawing a picture.", zh: "我正在画一幅画。" },
  { en: "She is reading a book.", zh: "她正在读一本书。" }
];

beforeEach(() => {
  clearBoostAiCache();
  vi.restoreAllMocks();
});

describe("grammarBoostAiService · 契约与超时", () => {
  it("批改 prompt 复用共享规则常量，并说明这是「刚学完本课的课后产出」", () => {
    const messages = buildBoostBatchCorrectionMessages({
      grammarPoint: "be 动词 · I am",
      entries: [
        { intentZh: "我正在画一幅画。", answerEn: "I draw a picture.", targetEn: "I am drawing a picture." }
      ]
    });
    const system = messages[0].content;
    // 共性规则来自共享常量（防两处 prompt 漂移）
    expect(system).toContain(GRAMMAR_CORRECTION_RULES);
    expect(system).toContain("post-lesson recap exercise");
    expect(system).toContain("be 动词 · I am");
    // 输出契约
    expect(system).toContain('"corrected"');
    expect(system).toContain('"recast"');
    expect(system).toContain('"issues"');
    expect(system).toContain('"comment"');
  });

  it("默认温柔档：先夸一处 + 最多指一处", () => {
    const gentle = buildBoostBatchCorrectionMessages(
      { grammarPoint: "g", entries: [{ intentZh: "q", answerEn: "a", targetEn: "t" }] },
      "gentle"
    )[0].content;
    expect(gentle).toContain("GENTLE");
    expect(gentle).toContain("AT MOST 1 issue");
    // 共享规则里必须保留「不出现挫败性表述」的温暖中文要求
    expect(gentle).toContain("warm and encouraging");
  });

  it("逐题超时被夹在 8–10 秒（不吃 provider 默认 120s）", () => {
    expect(boostAiTimeoutMs(baseProvider({ timeoutMs: 120000 }))).toBe(10000);
    expect(boostAiTimeoutMs(baseProvider({ timeoutMs: 3000 }))).toBe(8000);
    expect(boostAiTimeoutMs(baseProvider({ timeoutMs: 9000 }))).toBe(9000);
  });

  it("未配置 AI 时 canUseBoostAi=false，且调用立刻降级（不发起请求）", async () => {
    const provider = baseProvider({ enabled: false });
    expect(canUseBoostAi(provider)).toBe(false);
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const outcome = await requestBoostBatchCorrection(provider, {
      lessonId: "lesson-13-now",
      tier: 3,
      grammarPoint: "g",
      contentHash: "h",
      entries: [{ intentZh: "q", answerEn: "a", targetEn: "t" }]
    });
    expect(outcome.ok).toBe(false);
    expect(outcome.degraded).toBe(true);
    expect(outcome.degradeReason).toBe("not_configured");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("contentHash 对同一课同一锚点稳定、锚点变化即变（缓存失效依据）", () => {
    const stable = boostContentHash("lesson-13-now", ["I am drawing a picture."]);
    const sameAgain = boostContentHash("lesson-13-now", ["I am drawing a picture."]);
    const changed = boostContentHash("lesson-13-now", ["I am painting a picture."]);
    const otherLesson = boostContentHash("lesson-14-is", ["I am drawing a picture."]);
    expect(stable).toBe(sameAgain);
    expect(stable).not.toBe(changed);
    expect(stable).not.toBe(otherLesson);
  });
});

describe("grammarBoostAiService · 生成题校验（6 条，不过则丢弃）", () => {
  it("① 答案必须命中课程锚点：AI 自行变形造句的题被丢弃", () => {
    const items = validateGeneratedItems(
      [
        { zh: "我正在画一幅画。", en: "I am drawing a picture." }, // 合法（命中锚点）
        { zh: "她昨天读了一本书。", en: "She read a book yesterday." } // 不在锚点里 → 丢弃
      ],
      anchors
    );
    expect(items).toHaveLength(1);
    expect(items[0].answer).toBe("I am drawing a picture.");
  });

  it("② 题面泄漏答案原文的题被丢弃", () => {
    const items = validateGeneratedItems(
      [{ zh: "就是 drawing 这个动作，我正在做。", en: "I am drawing a picture." }],
      anchors
    );
    expect(items).toEqual([]);
  });

  it("③/④ 题面混英文、空题面、超长题面都被丢弃", () => {
    expect(validateGeneratedItems([{ zh: "say I drawing now", en: "I am drawing a picture." }], anchors)).toEqual([]);
    expect(validateGeneratedItems([{ zh: "   ", en: "I am drawing a picture." }], anchors)).toEqual([]);
    expect(
      validateGeneratedItems(
        [{ zh: "这是一段特别长的中文题面".repeat(8), en: "I am drawing a picture." }],
        anchors
      )
    ).toEqual([]);
  });

  it("⑤ 答案超过 12 个词的题被丢弃", () => {
    const longSentence = "I am drawing a picture and she is reading a book at the same time today here";
    const longAnchors = [{ en: longSentence, zh: "长句" }];
    expect(validateGeneratedItems([{ zh: "长句的中文意思", en: longSentence }], longAnchors)).toEqual([]);
  });

  it("⑥ 同一批内答案重复的题被丢弃（只保留第一条）", () => {
    const items = validateGeneratedItems(
      [
        { zh: "我正在画一幅画。", en: "I am drawing a picture." },
        { zh: "我正好也在画一幅画。", en: "I am drawing a picture." }
      ],
      anchors
    );
    expect(items).toHaveLength(1);
  });

  it("非法输入（非数组元素 / 缺字段）不抛错，安静丢弃", () => {
    const items = validateGeneratedItems(
      [{} as { zh?: unknown; en?: unknown }, { zh: null, en: 42 } as unknown as { zh?: unknown; en?: unknown }],
      anchors
    );
    expect(items).toEqual([]);
  });

  it("校验通过的生成题转成 BoostItem 时答案取自课程锚点、标记 itemKind=ai", () => {
    const item = generatedToBoostItem(
      { intentZh: "我正在画一幅画。", answer: "I am drawing a picture.", anchorRef: "ai:abc" },
      "lesson-13-now",
      0
    );
    expect(item.answer).toBe("I am drawing a picture.");
    expect(item.itemKind).toBe("ai");
    expect(item.kind).toBe("produce");
    expect(item.sourceRef).toBe("ai:abc");
  });

  it("变式题 prompt 明确禁止改写英文锚点（答案先定、AI 只措辞）", () => {
    const messages = buildVariantMessages({
      grammarPoint: "be 动词 · I am",
      anchors,
      count: 2,
      weakSpotPlain: ["缺 be 动词"]
    });
    const system = messages[0].content;
    expect(system).toContain("never change, shorten, or re-inflect the English anchor sentence");
    expect(system).toContain("must not contain any English word");
    // 弱点加权：请求体里带上薄弱点
    expect(messages[1].content).toContain("缺 be 动词");
  });
});

describe("grammarBoostAiService · 整档一次性批改（PRD §4.6 的正解）", () => {
  /**
   * 回归：批改曾只挂在「看答案」按钮上——正常作答（含答对）永远看不到 AI，用户反馈「没感受到哪里用了 AI」。
   * 现在改为整档结束一次性提交本档所有产出，本组测试锁定该契约。
   */
  it("batch prompt 说明「会收到多句、逐句点评」，并要求按输入顺序返回", () => {
    const messages = buildBoostBatchCorrectionMessages({
      grammarPoint: "现在进行时 · I am",
      entries: [
        { intentZh: "我正在画一幅画。", answerEn: "I am drawing a picture.", targetEn: "I am drawing a picture." },
        { intentZh: "她在读书。", answerEn: "She reading a book.", targetEn: "She is reading a book." }
      ]
    });
    const system = messages[0].content;
    // 共性规则仍来自共享常量（不复制粘贴 prompt）
    expect(system).toContain(GRAMMAR_CORRECTION_RULES);
    expect(system).toContain("one item per input sentence, in the same order");
    expect(system).toContain('"items"');
    // 请求体带上全部句子
    expect(messages[1].content).toContain("She reading a book.");
    expect(messages[1].content).toContain("我正在画一幅画。");
  });

  it("未配置 AI 时 batch 立即降级，不发请求（页面据此走本地对照）", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const outcome = await requestBoostBatchCorrection(baseProvider({ enabled: false }), {
      lessonId: "lesson-13-now",
      tier: 3,
      grammarPoint: "g",
      contentHash: "h",
      entries: [{ intentZh: "q", answerEn: "a", targetEn: "t" }]
    });
    expect(outcome.ok).toBe(false);
    expect(outcome.entries).toEqual([]);
    expect(outcome.degradeReason).toBe("not_configured");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("空产出列表不调用 AI（用户一句没写时不打扰）", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const outcome = await requestBoostBatchCorrection(baseProvider(), {
      lessonId: "lesson-13-now",
      tier: 3,
      grammarPoint: "g",
      contentHash: "h",
      entries: []
    });
    expect(outcome.ok).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("正常返回：按顺序解析多句，非法 tag 丢弃但该条 issue 保留，并按句子集合缓存", async () => {
    const payload = {
      items: [
        {
          corrected: "I am drawing a picture.",
          recast: "I'm drawing a picture right now.",
          comment: "这句很地道。",
          issues: []
        },
        {
          corrected: "She is reading a book.",
          recast: "",
          comment: "差了一个小词。",
          issues: [
            { original: "She reading", correction: "She is reading", explanation: "她做事，前面要有 is。", tag: "missing_be" },
            { original: "x", correction: "y", explanation: "非法罪名", tag: "not_a_real_tag" }
          ]
        }
      ]
    };
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(payload) } }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );
    const input = {
      lessonId: "lesson-13-now",
      tier: 3 as const,
      grammarPoint: "现在进行时 · I am",
      contentHash: "h",
      entries: [
        { intentZh: "我正在画一幅画。", answerEn: "I am drawing a picture.", targetEn: "I am drawing a picture." },
        { intentZh: "她在读书。", answerEn: "She reading a book.", targetEn: "She is reading a book." }
      ]
    };
    const outcome = await requestBoostBatchCorrection(baseProvider(), input);
    expect(outcome.ok).toBe(true);
    expect(outcome.entries).toHaveLength(2);
    // 顺序与输入一致，并回显用户原句
    expect(outcome.entries[0].originalEn).toBe("I am drawing a picture.");
    expect(outcome.entries[0].comment).toBe("这句很地道。");
    expect(outcome.entries[1].originalEn).toBe("She reading a book.");
    expect(outcome.entries[1].issues[0].tag).toBe("missing_be");
    expect(outcome.entries[1].issues[1].tag).toBeUndefined();
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // 同句子集合 → 命中缓存，不再发请求
    const cached = await requestBoostBatchCorrection(baseProvider(), input);
    expect(cached.cached).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // 用户改了答案 → 缓存失效（不能复用上一份批改）
    await requestBoostBatchCorrection(baseProvider(), {
      ...input,
      entries: [{ intentZh: "我正在画一幅画。", answerEn: "I draw picture.", targetEn: "I am drawing a picture." }]
    });
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("返回非法结构（无 items / 全空 corrected）时按 invalid 降级", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: '{"items":[]}' } }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );
    const outcome = await requestBoostBatchCorrection(baseProvider(), {
      lessonId: "lesson-13-now",
      tier: 3,
      grammarPoint: "g",
      contentHash: "h",
      entries: [{ intentZh: "q", answerEn: "a", targetEn: "t" }]
    });
    expect(outcome.ok).toBe(false);
    expect(outcome.degradeReason).toBe("invalid");
  });
});

describe("grammarBoostAiService · 生成失败路径", () => {
  it("未配置时返回空数组 + degraded（调用方据此用本地题补位）", async () => {
    const outcome = await requestBoostVariantItems(baseProvider({ enabled: false }), {
      lessonId: "lesson-13-now",
      anchors,
      grammarPoint: "g",
      count: 2,
      contentHash: "h"
    });
    expect(outcome.items).toEqual([]);
    expect(outcome.degraded).toBe(true);
    expect(outcome.degradeReason).toBe("not_configured");
  });

  it("锚点为空时直接降级，不发请求", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const outcome = await requestBoostVariantItems(baseProvider(), {
      lessonId: "lesson-13-now",
      anchors: [],
      grammarPoint: "g",
      count: 2,
      contentHash: "h"
    });
    expect(outcome.ok).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("请求抛错（断网）时降级且不抛出——页面不会被阻断", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Load failed"));
    const outcome = await requestBoostBatchCorrection(baseProvider(), {
      lessonId: "lesson-13-now",
      tier: 3,
      grammarPoint: "g",
      contentHash: "h",
      entries: [{ intentZh: "q", answerEn: "a", targetEn: "t" }]
    });
    expect(outcome.ok).toBe(false);
    expect(outcome.degraded).toBe(true);
  });

});
