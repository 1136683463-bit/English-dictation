import { afterEach, describe, expect, it, vi } from "vitest";
import { generateStructuredMistakeStoryWithModel } from "./modelService";
import type { AiProviderSettings } from "../types";

const provider: AiProviderSettings = {
  enabled: true,
  baseUrl: "https://proxy.example.com/v1",
  apiKey: "test-key",
  model: "story-model",
  temperature: 0.7,
  timeoutMs: 30000,
  fallbackToLocal: true
};

const input = {
  dateKey: "2026-07-04",
  level: "B1" as const,
  scene: "daily" as const,
  length: "short" as const,
  tone: "natural" as const,
  bilingual: true,
  words: [
    { word: "describe", translation: "描述", wrongAnswers: ["discribe"] }
  ]
};

const responseBody = {
  title: "Daily Review",
  englishStory: "Mia used describe in a note.",
  chineseTranslation: "Mia 在笔记里使用 describe。",
  usedWords: ["describe"],
  missingWords: [],
  wordNotes: [{ word: "describe", translation: "描述", note: "用于表达描述。" }]
};

const jsonResponse = (body: unknown, ok = true, status = 200) => ({
  ok,
  status,
  json: () => Promise.resolve(body)
});

describe("modelService", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls an OpenAI-compatible chat completions endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      choices: [{ message: { content: JSON.stringify(responseBody) } }]
    }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await generateStructuredMistakeStoryWithModel(provider, input);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://proxy.example.com/v1/chat/completions",
      expect.objectContaining({ method: "POST" })
    );
    const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(requestBody.model).toBe("story-model");
    expect(requestBody.max_tokens).toBe(600);
    expect(requestBody.messages).toHaveLength(2);
    expect(result.title).toBe("Daily Review");
    expect(result.usedWords).toEqual(["describe"]);
  });

  it("accepts a full chat completions URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      choices: [{ message: { content: JSON.stringify(responseBody) } }]
    }));
    vi.stubGlobal("fetch", fetchMock);

    await generateStructuredMistakeStoryWithModel({
      ...provider,
      baseUrl: "https://proxy.example.com/v1/chat/completions/"
    }, input);

    expect(fetchMock.mock.calls[0][0]).toBe("https://proxy.example.com/v1/chat/completions");
  });

  it("extracts JSON from fenced model output", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      choices: [{ message: { content: `\`\`\`json\n${JSON.stringify(responseBody)}\n\`\`\`` } }]
    }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateStructuredMistakeStoryWithModel(provider, input)).resolves.toMatchObject({
      englishStory: responseBody.englishStory
    });
  });

  it("surfaces provider error messages", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      error: { message: "invalid api key" }
    }, false, 401));
    vi.stubGlobal("fetch", fetchMock);

    await expect(generateStructuredMistakeStoryWithModel(provider, input)).rejects.toThrow("invalid api key");
  });
});
