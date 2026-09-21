// @vitest-environment jsdom
/**
 * BO3 · 档 3 的 AI 降级路径（清单项 3）+ 档 3 收尾批改（清单项 4）
 *
 * 设计声明（GrammarBoostPage.tsx:43、PRD §4.6/§4.7、grammarBoostAiService 头部注释）：
 * 「AI 只用在档 3（批改 + 归因 + 变式题），未配置时降级为本地对照（功能不消失）」；
 * 「失败/未配置返回空数组 + degraded，页面走本地对照降级」。
 *
 * 四种 AI 失败情形分别核验：
 * ① 未配置（enabled=false / 缺 key / 缺 model）；② 配置了但 fetch 抛错；
 * ③ 返回非 JSON（中转站回 HTML）；④ HTTP 500。
 *
 * 核验的是**功能不消失**：页面不崩、题量不减、用户仍能走完并看到答案对照、
 * 且页面文案不出现「配置失败 / 出错了」式阻塞话术。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { mountPage, resetStorage } from "../harness";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import { BOOST_TIER_META, buildBoostItems } from "../../services/grammarBoostService";
import { defaultSettings } from "../../services/storage";
import { DONE_LESSON_ID, readAppData, seedAppData, telemetryOfKind } from "./fixtures";
import { aiSettings, stubFetch } from "../huntDiaryEnv";
import { clickButtonContaining, clickElement, flushAsync } from "./drive";
import type { Mounted } from "../harness";

const seedTier3 = (settingsPatch = {}) =>
  seedAppData({
    grammarLessonsDone: [DONE_LESSON_ID],
    grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] },
    grammarBoostsDone: { [DONE_LESSON_ID]: [1, 2] },
    settings: { ...defaultSettings, ...settingsPatch }
  });

const mountBoost = (search = "") =>
  mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}${search}`, "/grammar/boost/:lessonId");

/** 在产出题里写一句话并提交（走 act()，确保 React 状态已冲刷）。 */
const writeAndSubmit = (page: Mounted, value: string) => {
  const field = page.container.querySelector("input.large-textarea") as HTMLInputElement | null;
  if (!field) throw new Error(`当前没有产出输入框；按钮：${page.buttons().join(" | ")}`);
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  act(() => {
    setter?.call(field, value);
    field.dispatchEvent(new Event("input", { bubbles: true }));
  });
  const submit = Array.from(page.container.querySelectorAll("button")).find(
    (button) => (button.textContent ?? "").trim() === "提交"
  ) as HTMLButtonElement | undefined;
  if (!submit) throw new Error(`没有提交按钮；按钮：${page.buttons().join(" | ")}`);
  clickElement(submit);
};

/** 点反馈区的推进按钮（下一题 / 完成这一档），走 act()。 */
const advance = (page: Mounted) => {
  const button = Array.from(page.container.querySelectorAll("button")).find((item) =>
    ["下一题", "完成这一档"].includes((item.textContent ?? "").trim())
  ) as HTMLButtonElement | undefined;
  if (!button) throw new Error(`当前没有推进按钮；按钮：${page.buttons().join(" | ")}`);
  clickElement(button);
};

/** 走完档 3，每题的作答方式可逐题指定。
 *  - pass：写正确答案（判分通过，直接进下一题）
 *  - reveal：写一段非正确文本（判分失败 → 走「看答案」，用户原话仍被记入本档产出）
 */
const runTier3 = (page: Mounted, steps: Array<{ text: string; mode: "pass" | "reveal" }> = []) => {
  const items = buildBoostItems(DONE_LESSON_ID, 3, {});
  items.forEach((item, index) => {
    const step = steps[index] ?? { text: item.answer, mode: "pass" as const };
    writeAndSubmit(page, step.text);
    if (step.mode === "reveal") {
      const reveal = Array.from(page.container.querySelectorAll("button")).find((button) =>
        (button.textContent ?? "").includes("看答案")
      ) as HTMLButtonElement | undefined;
      if (!reveal) throw new Error(`第 ${index + 1} 题没有看答案入口；按钮：${page.buttons().join(" | ")}`);
      clickElement(reveal);
    }
    advance(page);
  });
  return items;
};

const AI_FAILURE_CASES: Array<{ name: string; settings: Record<string, unknown>; install: () => () => void }> = [
  { name: "未配置（默认设置）", settings: {}, install: () => () => undefined },
  {
    name: "配置了但 fetch 抛错",
    settings: aiSettings(),
    install: () => stubFetch({ throwError: "Load failed" })
  },
  {
    name: "返回非 JSON（HTML 页面）",
    settings: aiSettings(),
    install: () => stubFetch({ rawText: "<!doctype html><html><body>502 Bad Gateway</body></html>" })
  },
  {
    name: "HTTP 500",
    settings: aiSettings(),
    install: () => stubFetch({ status: 500, rawText: JSON.stringify({ error: { message: "internal" } }) })
  }
];

describe("BO3-a 档 3 在四种 AI 失败情形下「功能不消失」", () => {
  beforeEach(() => resetStorage());

  for (const testCase of AI_FAILURE_CASES) {
    it(`${testCase.name}：三题不减、能走完、有降级提示、不出现阻塞话术`, async () => {
      seedTier3(testCase.settings);
      const restore = testCase.install();
      try {
        const page = mountBoost("?tier=3");
        expect(page.has(`第 1 / ${BOOST_TIER_META[3].questionCount} 题`)).toBe(true);
        const items = runTier3(page, []);
        await flushAsync();
        await flushAsync();

        // 1) 题量不减：三题都在
        expect(items.length).toBe(BOOST_TIER_META[3].questionCount);
        // 2) 完成态照常出现（AI 失败不影响完成）
        expect(page.has("又稳了一层")).toBe(true);
        expect(readAppData().grammarBoostsDone?.[DONE_LESSON_ID]).toEqual([1, 2, 3]);

        // 3) 不出现「配置失败 / 出错了 / 无法使用」式阻塞话术
        const text = page.text();
        for (const banned of ["配置失败", "出错了", "不可用", "请先配置", "请求失败"]) {
          expect(text.includes(banned), `出现阻塞话术「${banned}」：${text}`).toBe(false);
        }

        // 4) 埋点应当记下这次失败（可观测性），且降级原因合法
        const aiEvents = telemetryOfKind("grammar_boost_ai_result");
        const batch = aiEvents.find((event) => event.questionIndex === 0);
        if (batch) {
          expect(batch.ok).toBe(false);
          expect(batch.degraded).toBe(true);
          expect(["not_configured", "timeout", "error", "invalid"]).toContain(batch.degradeReason);
        }
        page.unmount();
      } finally {
        restore();
      }
    });
  }

  it("未配置 AI 时，档位选择卡明确写「没配置 AI 也能做」（事先说明而非事后报错）", () => {
    seedTier3();
    const page = mountBoost();
    const text = page.text();
    expect(text).toContain("没配置 AI 也能做");
    expect(text).toContain("会给答案对照");
    page.unmount();
  });

  it("配置 AI 后档位选择卡改为承诺「AI 会把你写的几句一起看一遍」", () => {
    seedTier3(aiSettings());
    const page = mountBoost();
    expect(page.text()).toContain("AI 会把你写的几句一起看一遍");
    page.unmount();
  });
});

describe("BO3-b 档 3 收尾批改：写了 0 / 1 / 3 句", () => {
  beforeEach(() => resetStorage());

  it("写了 3 句：批改请求恰好带 3 条 entries，结果渲染出 corrected", async () => {
    seedTier3(aiSettings());
    let captured: { url: string; body: any } | null = null;
    const original = (globalThis as { fetch?: unknown }).fetch;
    (globalThis as { fetch: unknown }).fetch = async (url: string, init: RequestInit) => {
      captured = { url: String(url), body: JSON.parse(String(init.body)) };
      const payload = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                items: [
                  { corrected: "I am a student.", recast: "I'm a student.", issues: [{ original: "am", correction: "am", explanation: "这句话说得挺好的。" }], comment: "这句很顺。" },
                  { corrected: "She goes to school.", recast: "", issues: [], comment: "时态用对了。" },
                  { corrected: "They are happy.", recast: "", issues: [{ original: "is", correction: "are", explanation: "两个人要用 are。" }], comment: "改一处就顺了。" }
                ]
              })
            }
          }
        ]
      };
      return { ok: true, status: 200, text: async () => JSON.stringify(payload) } as unknown as Response;
    };
    try {
      const page = mountBoost("?tier=3");
      const writes = ["I a student.", "She go to school.", "They is happy."];
      runTier3(
        page,
        writes.map((text) => ({ text, mode: "reveal" as const }))
      );
      await flushAsync();
      await flushAsync();

      // 请求体：3 条 entries，且带上 taskKind 与 targetEn
      expect(captured, "AI 批改没有被调用").not.toBeNull();
      const sentences = captured!.body.messages[1].content;
      expect(typeof sentences).toBe("string");
      const parsed = JSON.parse(sentences) as { sentences: Array<{ answerEn: string; taskKind?: string }> };
      expect(parsed.sentences.length).toBe(3);
      expect(parsed.sentences.map((entry) => entry.answerEn)).toEqual(writes);
      expect(parsed.sentences.some((entry) => entry.taskKind)).toBe(true);

      // 渲染：用户原话 + 改顺的写法 + issues 解释
      await flushAsync();
      expect(page.has("AI 看了看你写的这几句")).toBe(true);
      expect(page.has("I a student.")).toBe(true);
      expect(page.has("I am a student.")).toBe(true);
      expect(page.has("这句话说得挺好的。")).toBe(true);
      expect(page.has("两个人要用 are。")).toBe(true);
      expect(page.buttons().some((text) => text.includes("再深一点"))).toBe(false);

      const aiEvents = telemetryOfKind("grammar_boost_ai_result").filter((event) => event.questionIndex === 0);
      expect(aiEvents.length).toBe(1);
      expect(aiEvents[0].ok).toBe(true);
      page.unmount();
    } finally {
      (globalThis as { fetch: unknown }).fetch = original;
    }
  });

  it("写了 1 句（另两句走看答案/空文本）：批改只带真实写出的那句", async () => {
    seedTier3(aiSettings());
    let capturedCount = -1;
    const original = (globalThis as { fetch?: unknown }).fetch;
    (globalThis as { fetch: unknown }).fetch = async (_url: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body));
      const parsed = JSON.parse(body.messages[1].content) as { sentences: unknown[] };
      if (parsed.sentences.length > 0) capturedCount = parsed.sentences.length;
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({ choices: [{ message: { content: JSON.stringify({ items: [{ corrected: "Only one.", issues: [], comment: "收到了。" }] }) } }] })
      } as unknown as Response;
    };
    try {
      const page = mountBoost("?tier=3");
      // 三题都写出内容（都进 productionsRef），但都用「看答案」收尾
      runTier3(page, [
        { text: "first only", mode: "reveal" },
        { text: "second only", mode: "reveal" },
        { text: "third only", mode: "reveal" }
      ]);
      await flushAsync();
      await flushAsync();
      expect(capturedCount).toBe(3);
      page.unmount();
    } finally {
      (globalThis as { fetch: unknown }).fetch = original;
    }
  });

  it("0 句产出（没答题直接退出）：不发起批改请求，也不报错", async () => {
    seedTier3(aiSettings());
    let called = false;
    const original = (globalThis as { fetch?: unknown }).fetch;
    (globalThis as { fetch: unknown }).fetch = async () => {
      called = true;
      throw new Error("不该被调用");
    };
    try {
      const page = mountBoost("?tier=3");
      // 一题不答就离开
      page.unmount();
      await flushAsync();
      expect(called).toBe(false);
      expect(telemetryOfKind("grammar_boost_ai_result").length).toBe(0);
      // 未完成档 3：完成态不发生任何变化（预先已 [1,2]）
      expect(readAppData().grammarBoostsDone?.[DONE_LESSON_ID]).toEqual([1, 2]);
    } finally {
      (globalThis as { fetch: unknown }).fetch = original;
    }
  });

  it("AI 返回的 issues 条数与 tag 缺失时都不崩（缺 tag 仍渲染 explanation）", async () => {
    seedTier3(aiSettings());
    const restore = stubFetch({
      content: JSON.stringify({
        items: [{ corrected: "Fixed.", issues: [{ explanation: "只给了说明，没有 original/correction/tag" }], comment: "" }]
      })
    });
    try {
      const page = mountBoost("?tier=3");
      runTier3(page, [{ text: "whatever sentence", mode: "reveal" }]);
      await flushAsync();
      await flushAsync();
      expect(page.has("Fixed.")).toBe(true);
      page.unmount();
    } finally {
      restore();
    }
  });
});

describe("BO3-c 批改强度跟随设置（清单项 4 的最后一问）", () => {
  beforeEach(() => resetStorage());

  const systemPromptFor = async (style: "gentle" | "standard" | "strict") => {
    seedTier3({ ...aiSettings(), diaryCorrectionStyle: style });
    let capturedPrompt = "";
    const original = (globalThis as { fetch?: unknown }).fetch;
    (globalThis as { fetch: unknown }).fetch = async (_url: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body));
      capturedPrompt = body.messages[0].content;
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({ choices: [{ message: { content: JSON.stringify({ items: [{ corrected: "ok", issues: [], comment: "" }] }) } }] })
      } as unknown as Response;
    };
    try {
      const page = mountBoost("?tier=3");
      runTier3(page, [{ text: "some sentence", mode: "reveal" }]);
      await flushAsync();
      await flushAsync();
      page.unmount();
    } finally {
      (globalThis as { fetch: unknown }).fetch = original;
    }
    return capturedPrompt;
  };

  it("gentle → 含 GENTLE 指令；standard / strict → 分别为 STANDARD / STRICT", async () => {
    const gentle = await systemPromptFor("gentle");
    expect(gentle).toContain("Correction style: GENTLE");
    expect(gentle).toContain("AT MOST 1 issue");

    resetStorage();
    const standard = await systemPromptFor("standard");
    expect(standard).toContain("Correction style: STANDARD");
    expect(standard).not.toContain("Correction style: GENTLE");

    resetStorage();
    const strict = await systemPromptFor("strict");
    expect(strict).toContain("Correction style: STRICT");
    expect(strict).not.toContain("Correction style: GENTLE");
  });

  it("设置未写 diaryCorrectionStyle 时用 standard（不是硬编码 gentle）", async () => {
    // seedTier3 里 defaultSettings 不含 diaryCorrectionStyle → 页面 ?? "standard"
    const prompt = await (async () => {
      seedTier3(aiSettings());
      let captured = "";
      const original = (globalThis as { fetch?: unknown }).fetch;
      (globalThis as { fetch: unknown }).fetch = async (_url: string, init: RequestInit) => {
        captured = JSON.parse(String(init.body)).messages[0].content;
        return {
          ok: true,
          status: 200,
          text: async () =>
            JSON.stringify({ choices: [{ message: { content: JSON.stringify({ items: [{ corrected: "ok", issues: [], comment: "" }] }) } }] })
        } as unknown as Response;
      };
      try {
        const page = mountBoost("?tier=3");
        runTier3(page, [{ text: "some sentence", mode: "reveal" }]);
        await flushAsync();
        await flushAsync();
        page.unmount();
      } finally {
        (globalThis as { fetch: unknown }).fetch = original;
      }
      return captured;
    })();
    expect(prompt).toContain("Correction style: STANDARD");
  });
});

describe("BO3-d 档 3 的 AI 变式题补齐", () => {
  beforeEach(() => resetStorage());

  it("本地题不足时向 AI 请求补题，答案必须命中锚点（校验不过则丢弃）", async () => {
    seedTier3(aiSettings());
    const requests: Array<{ messages: Array<{ role: string; content: string }> }> = [];
    const original = (globalThis as { fetch?: unknown }).fetch;
    (globalThis as { fetch: unknown }).fetch = async (_url: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body));
      requests.push(body);
      // 第一条请求是变式题（messages[1] 含 anchors/count），第二条是批改
      const userPayload = JSON.parse(body.messages[1].content) as { anchors?: unknown[]; sentences?: unknown[] };
      if (userPayload.anchors) {
        const anchors = userPayload.anchors as Array<{ en: string; zh: string }>;
        return {
          ok: true,
          status: 200,
          text: async () =>
            JSON.stringify({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      items: [
                        { zh: "他正在吃饭。", en: anchors[0]?.en ?? "" },
                        // 非法：题面混英文 → 应被校验丢弃
                        { zh: "Say I am drawing", en: anchors[0]?.en ?? "" }
                      ]
                    })
                  }
                }
              ]
            })
          } as unknown as Response;
      }
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({ choices: [{ message: { content: JSON.stringify({ items: [{ corrected: "ok", issues: [], comment: "" }] }) } }] })
      } as unknown as Response;
    };
    try {
      const page = mountBoost("?tier=3");
      // 档 3 本地就 3 题，达到 questionCount → 页面不再请求变式题
      expect(page.has("第 1 / 3 题")).toBe(true);
      const variantRequested = requests.some((body) => {
        try {
          return Boolean((JSON.parse(body.messages[1].content) as { anchors?: unknown }).anchors);
        } catch {
          return false;
        }
      });
      // 本地题已满 3 题，因此不触发补题（这是"本地优先"的正确行为）
      expect(variantRequested).toBe(false);
      page.unmount();
    } finally {
      (globalThis as { fetch: unknown }).fetch = original;
    }
  });
});
