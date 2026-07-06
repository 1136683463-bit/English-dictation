import type { AiProviderSettings } from "../types";
import type { GenerateStructuredMistakeStoryInput, StructuredMistakeStoryResult } from "./aiService";

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

const isConfigured = (settings: AiProviderSettings) =>
  Boolean(settings.enabled && settings.baseUrl.trim() && settings.apiKey.trim() && settings.model.trim());

const normalizeChatCompletionsUrl = (baseUrl: string) => {
  const normalized = baseUrl.trim().replace(/\/+$/, "");
  return normalized.endsWith("/chat/completions") ? normalized : `${normalized}/chat/completions`;
};

const extractJsonObject = (content: string) => {
  const trimmed = content.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1]?.trim();
  if (fenced?.startsWith("{") && fenced.endsWith("}")) return fenced;

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) return trimmed.slice(firstBrace, lastBrace + 1);

  throw new Error("模型没有返回可解析的 JSON。");
};

const asString = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const asStringArray = (value: unknown) =>
  Array.isArray(value) ? value.map(asString).filter(Boolean) : [];

const normalizeStoryResult = (value: unknown): StructuredMistakeStoryResult => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("模型返回格式不是对象。");
  }

  const record = value as Record<string, unknown>;
  const wordNotes = Array.isArray(record.wordNotes)
    ? record.wordNotes.map((note) => {
        const item = note && typeof note === "object" && !Array.isArray(note) ? note as Record<string, unknown> : {};
        return {
          word: asString(item.word),
          translation: asString(item.translation),
          note: asString(item.note)
        };
      }).filter((note) => note.word || note.translation || note.note)
    : [];

  const result = {
    title: asString(record.title),
    englishStory: asString(record.englishStory),
    chineseTranslation: asString(record.chineseTranslation),
    usedWords: asStringArray(record.usedWords),
    missingWords: asStringArray(record.missingWords),
    wordNotes
  };

  if (!result.title || !result.englishStory) {
    throw new Error("模型返回缺少 title 或 englishStory。");
  }

  return result;
};

const buildSystemPrompt = () => [
  "You write short English mistake-word stories for Chinese learners.",
  "Return JSON only: title, englishStory, chineseTranslation, usedWords, missingWords, wordNotes.",
  "Keep target words in original spelling. No Markdown."
].join(" ");

const buildUserPrompt = (input: GenerateStructuredMistakeStoryInput) => JSON.stringify({
  task: "story",
  dateKey: input.dateKey,
  level: input.level,
  scene: input.scene,
  length: input.length,
  tone: input.tone,
  bilingual: input.bilingual,
  maxParagraphs: input.length === "long" ? 4 : input.length === "medium" ? 3 : 2,
  words: input.words
});

const maxTokensForLength = (length: GenerateStructuredMistakeStoryInput["length"]) => {
  if (length === "long") return 1200;
  if (length === "medium") return 850;
  return 600;
};

export const generateStructuredMistakeStoryWithModel = async (
  provider: AiProviderSettings,
  input: GenerateStructuredMistakeStoryInput
): Promise<StructuredMistakeStoryResult> => {
  if (!isConfigured(provider)) {
    throw new Error("AI 中转站配置不完整。");
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), provider.timeoutMs);

  try {
    const response = await fetch(normalizeChatCompletionsUrl(provider.baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        temperature: provider.temperature,
        max_tokens: maxTokensForLength(input.length),
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: buildUserPrompt(input) }
        ]
      }),
      signal: controller.signal
    });

    const json = await response.json().catch(() => ({})) as ChatCompletionResponse;
    if (!response.ok) {
      throw new Error(json.error?.message || `模型请求失败：${response.status}`);
    }

    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("模型响应没有内容。");

    return normalizeStoryResult(JSON.parse(extractJsonObject(content)));
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`模型请求超时（已等待 ${Math.round(provider.timeoutMs / 1000)} 秒）。`);
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
};

export const testAiProviderConnection = async (provider: AiProviderSettings) => {
  const result = await generateStructuredMistakeStoryWithModel(provider, {
    dateKey: "test",
    level: "A2",
    scene: "daily",
    length: "short",
    tone: "natural",
    bilingual: true,
    words: [
      { word: "review", translation: "复习", wrongAnswers: ["reveiw"] },
      { word: "clear", translation: "清晰的", wrongAnswers: [] }
    ]
  });

  return Boolean(result.title && result.englishStory);
};
