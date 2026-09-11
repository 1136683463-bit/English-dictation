import { describe, expect, it, vi } from "vitest";
import { generateAdventureContinuationWithModel, generateAdventureContinuationsWithModel, generateAdventureOpeningWithModel, generateAdventureSentenceTranslationsWithModel, isAiProviderConfigured, normalizeAdventureModelNode, testAdventureProviderConnection } from "./adventureModelService";

const provider = {
  enabled: true,
  baseUrl: "https://example.com/v1",
  apiKey: "test-key",
  model: "test-model",
  temperature: 0.7,
  timeoutMs: 60000,
  fallbackToLocal: true
};

const validNode = {
  title: "The Next Clue",
  englishText: "You walk slowly across the old bridge and notice a small blue envelope under a bench. Inside, there is a kind note from the person you have been trying to find. It asks you to meet near the river before sunset, where the city lights begin to appear.",
  chineseText: "你缓缓穿过旧桥，在长椅下发现一个蓝色信封。信中请你在日落前到河边见面。",
  sentenceTranslations: ["你缓缓走过旧桥，注意到长椅下有一个小蓝信封。", "里面有一张来自你一直寻找之人的亲切便条。", "便条请你在日落前到河边相见，那里城市的灯光正开始亮起。"],
  summary: "A note points you to the river.",
  choices: [
    { id: "river", label: "Go to the river", description: "Follow the note.", promptHint: "Go to the river." },
    { id: "shop", label: "Ask at the shop", description: "Look for another clue.", promptHint: "Ask the shop owner." }
  ],
  vocabulary: [{ word: "envelope", translation: "信封", partOfSpeech: "noun", sentence: "A blue envelope is under the bench." }]
};

describe("adventure model service", () => {
  it("only considers a provider ready when enabled and all fields contain non-whitespace values", () => {
    expect(isAiProviderConfigured(provider)).toBe(true);
    expect(isAiProviderConfigured({ ...provider, enabled: false })).toBe(false);
    expect(isAiProviderConfigured({ ...provider, apiKey: "  " })).toBe(false);
  });

  it("turns browser network failures into an actionable connection message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Load failed")));

    await expect(generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    })).rejects.toThrow("无法连接 AI 中转站");
    vi.unstubAllGlobals();
  });

  it("tests the same adventure continuation endpoint used by the reader", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: JSON.stringify(validNode) } }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(testAdventureProviderConnection(provider)).resolves.toBe(true);
    const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(JSON.parse(requestBody.messages[1].content).task).toBe("continue_adventure");
    vi.unstubAllGlobals();
  });

  it("parses a fenced JSON chapter and calls the compatible chat endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: `\`\`\`json\n${JSON.stringify(validNode)}\n\`\`\`` } }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    });

    expect(result.title).toBe("The Next Clue");
    expect(result.sentenceTranslations).toHaveLength(3);
    expect(fetchMock.mock.calls[0][0]).toBe("https://example.com/v1/chat/completions");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).max_tokens).toBe(2600);
    vi.unstubAllGlobals();
  });

  it("reassembles a streaming body the gateway returns without being asked", async () => {
    const answer = JSON.stringify(validNode);
    const pieces = answer.match(/[\s\S]{1,60}/g) ?? [];
    const stream = pieces
      .map((piece) => `data: ${JSON.stringify({ choices: [{ delta: { content: piece } }] })}`)
      .join("\n\n");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => `${stream}\n\ndata: [DONE]\n`
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    });

    expect(result.title).toBe("The Next Clue");
    expect(result.choices).toHaveLength(2);
    vi.unstubAllGlobals();
  });

  it("generates all preload routes in one request and preserves choice ids", async () => {
    const batchNode = (title: string, marker: string) => ({
      ...validNode,
      title,
      englishText: `${validNode.englishText} ${marker} opens a different route.`
    });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: JSON.stringify({
        continuations: [
          { choiceId: "river", ...batchNode("River Signal", "The river") },
          { choiceId: "shop", ...batchNode("Shop Signal", "The shop") }
        ]
      }) } }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await generateAdventureContinuationsWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", path: [],
      choices: [{ choiceId: "river", action: "Go to the river." }, { choiceId: "shop", action: "Ask at the shop." }],
      targetWords: []
    });

    expect(result.map((item) => item.choiceId)).toEqual(["river", "shop"]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(JSON.parse(requestBody.messages[1].content).task).toBe("continue_adventure_batch");
    expect(requestBody.max_tokens).toBe(2400);
    vi.unstubAllGlobals();
  });

  it("retries without response_format for gateways that reject it", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 400, json: async () => ({ error: { message: "response_format is unsupported" } }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ choices: [{ message: { content: JSON.stringify(validNode) } }] }) });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    })).resolves.toMatchObject({ title: "The Next Clue" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).not.toHaveProperty("response_format");
    vi.unstubAllGlobals();
  });

  it("accepts content-part arrays from compatible gateways", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: [{ text: JSON.stringify(validNode) }] } }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    })).resolves.toMatchObject({ title: "The Next Clue" });
    vi.unstubAllGlobals();
  });

  it("accepts GLM-style reasoning_content when message.content is empty", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: null, reasoning_content: JSON.stringify(validNode) } }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    })).resolves.toMatchObject({ title: "The Next Clue" });
    vi.unstubAllGlobals();
  });

  it("tries the next response field when content contains non-JSON reasoning text", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: {
        content: "I will think about the story first.",
        reasoning_content: JSON.stringify(validNode)
      } }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    })).resolves.toMatchObject({ title: "The Next Clue" });
    vi.unstubAllGlobals();
  });

  it("accepts a plain choice.text response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ text: JSON.stringify(validNode) }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    })).resolves.toMatchObject({ title: "The Next Clue" });
    vi.unstubAllGlobals();
  });

  it("extracts JSON when the model adds a preamble containing braces", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: `Here is the chapter (schema: {title:string}):\n${JSON.stringify(validNode)}\nHope you enjoy it.` } }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    })).resolves.toMatchObject({ title: "The Next Clue" });
    vi.unstubAllGlobals();
  });

  it("extracts double-encoded JSON returned as message content", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: JSON.stringify(JSON.stringify(validNode)) } }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    })).resolves.toMatchObject({ title: "The Next Clue" });
    vi.unstubAllGlobals();
  });

  it("accepts gateways that return the structured node directly in content", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: validNode } }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    })).resolves.toMatchObject({ title: "The Next Clue" });
    vi.unstubAllGlobals();
  });

  it("unwraps provider envelopes around the adventure node", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: JSON.stringify({ data: { result: validNode } }) } }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    })).resolves.toMatchObject({ title: "The Next Clue" });
    vi.unstubAllGlobals();
  });

  it("finds a chapter nested several levels deep in a gateway response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: [{ result: { output: { answer: validNode } } }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    })).resolves.toMatchObject({ title: "The Next Clue" });
    vi.unstubAllGlobals();
  });

  it("falls back to tagged plain text when the model does not emit JSON", async () => {
    const plainText = [
      "TITLE: The Plain Text Route",
      "ENGLISH_TEXT: You step into the quiet station and find a silver key beside the clock. A note says the key will open a hidden room before the last train leaves. You decide to follow the clue and ask the guard for help.",
      "CHINESE_TEXT: 你走进安静的车站，在钟旁发现一把银色钥匙。",
      "SUMMARY: A key points to a hidden room.",
      "CHOICES:",
      "Follow the guard | Ask for help | Follow the guard.",
      "Search the clock | Look for another clue | Search the clock."
    ].join("\n");
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ choices: [{ message: { content: "Here is the story in plain text." } }] }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ choices: [{ message: { content: plainText } }] }) });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    })).resolves.toMatchObject({ title: "The Plain Text Route" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    vi.unstubAllGlobals();
  });

  it("retries when a relay salvages rambling output into contaminated JSON fields", async () => {
    const contaminated = JSON.stringify({
      title: "\"The Two Moons\" or \"The Girl Under Two Moons\". I'll go with \"Lost Under Two Moons\".",
      englishText: "The model rambled on and on. ".repeat(120),
      chineseText: "占位。",
      choices: [
        { id: "choice_1", label: "A", description: "a", promptHint: "a" },
        { id: "choice_2", label: "B", description: "b", promptHint: "b" }
      ]
    });
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ choices: [{ message: { content: contaminated } }] })
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ choices: [{ message: { content: JSON.stringify(validNode) } }] })
      });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    })).resolves.toMatchObject({ title: "The Next Clue" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    vi.unstubAllGlobals();
  });

  it("does not dress a broken JSON attempt up as a plain-text chapter", async () => {
    const brokenJson = '{"title":"He said "hi" and left the bridge. Ensure JSON output stays valid.';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: brokenJson } }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    })).rejects.toThrow("不是可解析的 JSON");
    expect(fetchMock).toHaveBeenCalledTimes(3);
    vi.unstubAllGlobals();
  });

  it("does not dress pseudo-tagged rambling without story sections up as a chapter", async () => {
    const pseudoTagged = [
      "TITLE: \"A Strange Morning in Green Park\" or similar.\"englishText\":\"The user wants me to create an opening chapter of a branching English reading adventure for Chinese learners at A2 level. " + "The model kept analysing the task instead of writing the story. ".repeat(60),
      "CHOICES:",
      "Walk deeper | Keep going | Walk deeper.",
      "Turn back | Give up this path | Turn back."
    ].join("\n");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: pseudoTagged } }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureOpeningWithModel(provider, {
      level: "A2", customPrompt: "去公园散步", targetWords: []
    })).rejects.toThrow("不是可解析的 JSON");
    expect(fetchMock).toHaveBeenCalledTimes(3);
    vi.unstubAllGlobals();
  });

  it("retries when the model answers with a bare Chinese sentence array", async () => {
    const chineseArray = JSON.stringify([
      "大机器人比赛的那个早晨，林很早就醒了。",
      "她的小机器人\"哗哗\"安静地坐在书桌上。",
      "\"在学校，一个通知很快传开了：比赛三点钟开始。\""
    ]);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: chineseArray } }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureOpeningWithModel(provider, {
      level: "A2", customPrompt: "去比赛", targetWords: []
    })).rejects.toThrow("字符串数组");
    expect(fetchMock).toHaveBeenCalledTimes(3);
    vi.unstubAllGlobals();
  });

  it("retries when the model writes the chapter itself in Chinese", async () => {
    const chineseChapter = JSON.stringify({
      ...validNode,
      englishText: "林很早就醒了。她的小机器人安静地坐在书桌上。今天有一场重要的比赛。她花了几个小时检查零件。在学校，通知很快传开了。林松了一口气。",
      sentenceTranslations: []
    });
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ choices: [{ message: { content: chineseChapter } }] })
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ choices: [{ message: { content: JSON.stringify(validNode) } }] })
      });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureOpeningWithModel(provider, {
      level: "A2", customPrompt: "去比赛", targetWords: []
    })).resolves.toMatchObject({ title: "The Next Clue" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    vi.unstubAllGlobals();
  });

  it("parses a successful text/plain response without misreporting a connection error", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify(validNode),
      json: async () => { throw new Error("not json content type"); }
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    })).resolves.toMatchObject({ title: "The Next Clue" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });

  it("keeps the original format error when a fallback retry has a network failure", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => "The provider returned a response, but not the requested story format.",
        json: async () => ({})
      })
      .mockRejectedValueOnce(new TypeError("Load failed"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureContinuationWithModel(provider, {
      template: "city", title: "City", level: "A2", customPrompt: "", action: "Walk on", path: [], targetWords: []
    })).rejects.toThrow("不是可解析的 JSON");
    vi.unstubAllGlobals();
  });


  it("rejects a continuation that repeats an earlier chapter", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: JSON.stringify(validNode) } }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateAdventureContinuationWithModel(provider, {
      template: "city",
      title: "City",
      level: "A2",
      customPrompt: "",
      action: "Walk on",
      path: [{ title: validNode.title, englishText: validNode.englishText, summary: validNode.summary }],
      targetWords: []
    })).rejects.toThrow("重复了之前的章节");
    vi.unstubAllGlobals();
  });

  it("rejects a chapter without meaningful choices", () => {
    expect(() => normalizeAdventureModelNode({ ...validNode, choices: [] })).toThrow("不完整");
  });

  it("rejects an AI chapter without a usable Chinese translation", () => {
    expect(() => normalizeAdventureModelNode({ ...validNode, chineseText: "" })).toThrow("不完整");
  });

  it("keeps an AI chapter usable when sentence translations need a second pass", () => {
    expect(normalizeAdventureModelNode({ ...validNode, sentenceTranslations: ["译文不完整。"] }).sentenceTranslations).toEqual([]);
  });

  it("quotes the raw gateway payload when the chapter shape does not match", () => {
    let message = "";
    try {
      normalizeAdventureModelNode({ status: "ok", reason: "quota_exceeded" });
    } catch (error) {
      message = error instanceof Error ? error.message : "";
    }

    expect(message).toContain("模型续章内容不完整");
    expect(message).toContain("quota_exceeded");
  });

  it("creates an AI opening chapter from one learner direction", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: JSON.stringify(validNode) } }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await generateAdventureOpeningWithModel(provider, {
      level: "A2",
      customPrompt: "在会移动的城市里找回一封信",
      targetWords: [{ word: "envelope", translation: "信封" }]
    });

    expect(result.title).toBe("The Next Clue");
    const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(JSON.parse(requestBody.messages[1].content)).toMatchObject({
      task: "create_adventure_opening",
      customPrompt: "在会移动的城市里找回一封信"
    });
    expect(JSON.parse(requestBody.messages[1].content)).not.toHaveProperty("template");
    vi.unstubAllGlobals();
  });

  it("requires a direction before requesting a custom opening", async () => {
    await expect(generateAdventureOpeningWithModel(provider, {
      level: "A2",
      customPrompt: " ",
      targetWords: []
    })).rejects.toThrow("冒险方向");
  });

  it("generates one saved translation for every sentence in a historical chapter", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: JSON.stringify({ sentenceTranslations: ["钟轻轻响起。", "你沿着河流前行。"] }) } }] })
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      generateAdventureSentenceTranslationsWithModel(provider, "The bell rings softly. You follow the river.")
    ).resolves.toEqual(["钟轻轻响起。", "你沿着河流前行。"]);
    expect(fetchMock.mock.calls[0][0]).toBe("https://example.com/v1/chat/completions");
    vi.unstubAllGlobals();
  });
});
