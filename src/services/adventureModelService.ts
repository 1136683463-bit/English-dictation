import type { AdventureChoice, AdventureLevel, AdventureNode, AdventureTemplate, AdventureVocabulary, AiProviderSettings } from "../types";
import { splitAdventureSentences } from "./adventureReaderService";
import { describeModelRequestError, isAiProviderConfigured, normalizeChatCompletionsUrl, readResponsePayload, reassembleStreamText, requestFetch } from "./aiHttpClient";

export { isAiProviderConfigured };

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: unknown;
      reasoning_content?: unknown;
      text?: unknown;
      tool_calls?: Array<{ function?: { arguments?: unknown } }>;
    };
    delta?: { content?: unknown; reasoning_content?: unknown };
    text?: unknown;
    output_text?: unknown;
    finish_reason?: string;
  }>;
  content?: unknown;
  output_text?: unknown;
  output?: unknown;
  result?: unknown;
  response?: unknown;
  data?: unknown;
  error?: { message?: string };
}

export interface AdventureModelInput {
  template: AdventureTemplate;
  title: string;
  level: AdventureLevel;
  customPrompt: string;
  path: Array<Pick<AdventureNode, "title" | "englishText" | "summary">>;
  action: string;
  targetWords: Array<{ word: string; translation: string }>;
}

export interface AdventureOpeningInput {
  level: AdventureLevel;
  customPrompt: string;
  targetWords: Array<{ word: string; translation: string }>;
}

export interface AdventureBatchModelInput {
  template: AdventureTemplate;
  title: string;
  level: AdventureLevel;
  customPrompt: string;
  path: Array<Pick<AdventureNode, "title" | "englishText" | "summary">>;
  choices: Array<{ choiceId: string; action: string }>;
  targetWords: Array<{ word: string; translation: string }>;
}

export type AdventureModelNode = Omit<AdventureNode, "id" | "parentId" | "chapter" | "createdAt" | "selectedChoiceId" | "customAction" | "source">;

/**
 * Extract a JSON object from the slightly different formats returned by
 * OpenAI-compatible gateways. In practice models may add a short preamble,
 * wrap the payload in a markdown fence, or return a JSON string that contains
 * the actual object. The old first/last-brace heuristic failed when the
 * preamble itself contained braces or when the payload was double encoded.
 */
const extractJson = (content: string): string => {
  let current = content.trim();
  for (let depth = 0; depth < 3; depth += 1) {
    const fenced = current.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1]?.trim();
    if (fenced) current = fenced;

    // A few gateways serialize message.content once more, e.g. "{\\"title\\":...}".
    if ((current.startsWith('"') && current.endsWith('"')) || (current.startsWith("'") && current.endsWith("'"))) {
      try {
        const decoded = JSON.parse(current);
        if (typeof decoded === "string") {
          current = decoded.trim();
          continue;
        }
      } catch {
        // Continue with the regular object/array scan below.
      }
    }

    if ((current.startsWith("{") && current.endsWith("}")) || (current.startsWith("[") && current.endsWith("]"))) {
      try {
        JSON.parse(current);
        return current;
      } catch {
        // The string may contain a valid JSON value alongside extra text.
      }
    }

    // Find balanced object/array slices while respecting quoted strings. This
    // avoids swallowing unrelated braces in a model's explanatory preamble.
    const starts = [...current].flatMap((char, index) => (char === "{" || char === "[" ? [index] : []));
    for (const start of starts) {
      const stack: string[] = [];
      let escaped = false;
      let inString = false;
      for (let index = start; index < current.length; index += 1) {
        const char = current[index];
        if (inString) {
          if (escaped) escaped = false;
          else if (char === "\\") escaped = true;
          else if (char === '"') inString = false;
          continue;
        }
        if (char === '"') {
          inString = true;
          continue;
        }
        if (char === "{" || char === "[") stack.push(char);
        else if (char === "}" || char === "]") {
          const expected = char === "}" ? "{" : "[";
          if (stack.pop() !== expected) break;
          if (!stack.length) {
            const slice = current.slice(start, index + 1);
            try {
              JSON.parse(slice);
              return slice;
            } catch {
              break;
            }
          }
        }
      }
    }
    break;
  }
  throw new Error("模型没有返回可解析的 JSON。");
};

const flattenResponseText = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flattenResponseText).join("");
  if (!value || typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  return flattenResponseText(record.text ?? record.content ?? record.output_text ?? record.value);
};

const extractResponseCandidates = (json: ChatCompletionResponse) => {
  const firstChoice = json.choices?.[0];
  const message = firstChoice?.message;
  // Some GLM-compatible gateways put the actual answer in content parts,
  // reasoning_content, or choice.text rather than message.content.
  const candidates = [
    message?.content,
    message?.reasoning_content,
    message?.text,
    ...(message?.tool_calls?.map((call) => call.function?.arguments) ?? []),
    firstChoice?.delta?.content,
    firstChoice?.delta?.reasoning_content,
    firstChoice?.text,
    firstChoice?.output_text,
    json.output_text,
    json.output,
    json.result,
    json.response,
    json.content,
    json.data
  ];
  const nestedCandidates: unknown[] = [];
  const visit = (value: unknown, depth = 0, seen = new Set<unknown>()) => {
    if (depth > 6 || value === null || value === undefined) return;
    if (typeof value === "object") {
      if (seen.has(value)) return;
      seen.add(value);
      if (!Array.isArray(value)) {
        const record = value as Record<string, unknown>;
        if ((record.title && record.englishText) || record.continuations) {
          try { nestedCandidates.push(JSON.stringify(value)); } catch { /* ignore circular values */ }
        }
        for (const key of ["content", "text", "output_text", "reasoning_content", "arguments", "answer", "result", "response", "output", "data", "payload"]) {
          if (record[key] !== undefined) visit(record[key], depth + 1, seen);
        }
        for (const child of Object.values(record)) visit(child, depth + 1, seen);
      } else {
        for (const child of value) visit(child, depth + 1, seen);
      }
      return;
    }
    if (typeof value === "string") nestedCandidates.push(value);
  };
  visit(json);
  return [...candidates, ...nestedCandidates]
    .flatMap((candidate) => {
      if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
        const record = candidate as Record<string, unknown>;
        const nestedText = flattenResponseText(candidate).trim();
        const looksStructured = Boolean(record.title || record.englishText || record.continuations || record.sentenceTranslations);
        if (nestedText && !looksStructured) return [nestedText];
        try { return [JSON.stringify(candidate)]; } catch { return []; }
      }
      const text = flattenResponseText(candidate);
      // Streaming-compatible gateways sometimes return one or more SSE lines
      // even when the client did not explicitly request streaming. The first
      // chunk on its own is just an empty delta, so reassemble before parsing.
      if (/^\s*data:\s*/m.test(text)) {
        const lines = text
          .split(/\r?\n/)
          .map((line) => line.replace(/^\s*data:\s*/, "").trim())
          .filter((line) => line && line !== "[DONE]");
        const assembled = reassembleStreamText(text);
        return assembled ? [assembled, ...lines] : lines;
      }
      return [text];
    })
    .map((text) => text.trim())
    .filter(Boolean);
};

const isAdventurePayload = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return Boolean(
    (record.title && record.englishText) ||
    record.continuations
  );
};

/** Unwrap provider-specific envelopes around the actual model JSON payload. */
const unwrapAdventurePayload = (value: unknown, depth = 0): unknown => {
  if (depth > 4 || isAdventurePayload(value)) return value;
  if (Array.isArray(value)) {
    const nested = value.find((item) => isAdventurePayload(item));
    return nested ? unwrapAdventurePayload(nested, depth + 1) : value;
  }
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  for (const key of ["data", "result", "output", "response", "payload", "answer", "content"]) {
    if (record[key] === undefined || record[key] === value) continue;
    const unwrapped = unwrapAdventurePayload(record[key], depth + 1);
    if (isAdventurePayload(unwrapped)) return unwrapped;
  }
  for (const child of Object.values(record)) {
    const unwrapped = unwrapAdventurePayload(child, depth + 1);
    if (isAdventurePayload(unwrapped)) return unwrapped;
  }
  return value;
};

const parseTaggedAdventureText = (content: string): Record<string, unknown> | null => {
  const text = content.replace(/```(?:text|markdown)?/gi, "").replace(/```/g, "").trim();
  // Some models open with task analysis ("Let me analyze the task: ...") instead
  // of the requested JSON. That is not a chapter; do not let the plain-text
  // fallback dress it up as one.
  if (/^(?:let me|i'll|i will|here(?:'s| is| are)|sure,|okay|certainly|first,|as requested)\b/i.test(text)) return null;
  // A salvaged JSON attempt ("{"title":"... I'll go with ... Ensure JSON...") is
  // broken model output, not tagged plain text. Dressing it up as a chapter
  // would only produce nonsense fields; let the format-reminder retry handle it.
  if (text.startsWith("{") || text.startsWith("[") || /\bensure (?:the )?json\b/i.test(text.slice(0, 300))) return null;
  const section = (name: string) => {
    const match = text.match(new RegExp(`(?:^|\\n)\\s*(?:${name})\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*[A-Z_ ]+\\s*:|$)`, "i"));
    return match?.[1]?.trim() ?? "";
  };
  const title = section("TITLE|标题");
  const englishText = section("ENGLISH(?:_TEXT)?|英文(?:故事|正文)?");
  const chineseText = section("CHINESE(?:_TEXT)?|中文(?:翻译|译文)?");
  const summary = section("SUMMARY|摘要|概要");
  // The fallback must only accept fully tagged output. Dressing up bare
  // rambling (no ENGLISH section, placeholder Chinese) as a chapter once
  // produced nonsense like a 9000-char englishText with a 16-char Chinese
  // placeholder; those failures are better handled by the format-reminder
  // retry than by surfacing a broken chapter.
  if (!englishText || !chineseText) return null;
  const choices = section("CHOICES?|选项")
    .split(/\\r?\\n/)
    .map((line, index) => line.replace(/^\\s*(?:[-*]\\s*|\\d+[.)]\\s*)/, "").trim())
    .filter(Boolean)
    .map((line, index) => {
      const parts = line.split(/\\s*[|｜]\\s*/);
      return {
        id: `choice_${index + 1}`,
        label: parts[0] || `继续路线 ${index + 1}`,
        description: parts[1] || parts[0] || "继续阅读这个方向。",
        promptHint: parts[2] || parts[0] || "Continue this route."
      };
    });
  const vocabulary = section("VOCABULARY|词汇|生词")
    .split(/\\r?\\n/)
    .map((line) => line.replace(/^\\s*(?:[-*]\\s*|\\d+[.)]\\s*)/, "").trim())
    .filter(Boolean)
    .slice(0, 8)
    .map((line) => {
      const parts = line.split(/\\s*[|｜]\\s*/);
      return { word: parts[0] ?? "", translation: parts[1] ?? "", partOfSpeech: parts[2] ?? "", sentence: parts[3] ?? "" };
    });
  return {
    title: title || "A New Chapter",
    englishText,
    chineseText,
    summary: summary || englishText.slice(0, 120),
    choices: choices.length >= 2 ? choices : [
      { id: "choice_1", label: "继续探索", description: "沿着当前线索继续前进。", promptHint: "Continue exploring." },
      { id: "choice_2", label: "寻找线索", description: "停下来寻找更多信息。", promptHint: "Look for another clue." }
    ],
    vocabulary
  };
};

const stringValue = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const normalizeChoices = (value: unknown): AdventureChoice[] =>
  (Array.isArray(value) ? value : [])
    .map((item, index) => {
      const record = item && typeof item === "object" && !Array.isArray(item) ? item as Record<string, unknown> : {};
      return {
        id: stringValue(record.id) || `choice_${index + 1}`,
        label: stringValue(record.label),
        description: stringValue(record.description),
        promptHint: stringValue(record.promptHint)
      };
    })
    .filter((item) => item.label)
    .slice(0, 4);

const normalizeVocabulary = (value: unknown): AdventureVocabulary[] => {
  const seen = new Set<string>();
  return (Array.isArray(value) ? value : [])
    .map((item) => {
      const record = item && typeof item === "object" && !Array.isArray(item) ? item as Record<string, unknown> : {};
      return {
        word: stringValue(record.word).toLowerCase(),
        translation: stringValue(record.translation),
        partOfSpeech: stringValue(record.partOfSpeech),
        sentence: stringValue(record.sentence)
      };
    })
    .filter((item) => item.word && !seen.has(item.word) && (seen.add(item.word), true))
    .slice(0, 8);
};

const normalizeSentenceTranslations = (value: unknown) =>
  (Array.isArray(value) ? value : [])
    .map(stringValue)
    .filter(Boolean);

const meaningfulWordSet = (value: string) => new Set(
  (value.toLowerCase().match(/[a-z]{4,}/g) ?? [])
);

const contentOverlap = (left: string, right: string) => {
  const a = meaningfulWordSet(left);
  const b = meaningfulWordSet(right);
  if (a.size < 8 || b.size < 8) return 0;
  let shared = 0;
  a.forEach((word) => { if (b.has(word)) shared += 1; });
  return shared / Math.min(a.size, b.size);
};

/** Show what the gateway actually replied, so a shape mismatch is diagnosable. */
const describePayload = (value: unknown) => {
  if (value === undefined || value === null) return String(value);
  try {
    const text = typeof value === "string" ? value : JSON.stringify(value);
    if (!text) return "(空)";
    return text.length > 200 ? `${text.slice(0, 200)}…` : text;
  } catch {
    return "(无法序列化)";
  }
};

export const normalizeAdventureModelNode = (value: unknown): AdventureModelNode => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`模型返回格式不是对象（中转站返回：${describePayload(value)}）。`);
  }
  const record = value as Record<string, unknown>;
  const expectedSentenceCount = splitAdventureSentences(stringValue(record.englishText)).length;
  const providedSentenceTranslations = normalizeSentenceTranslations(record.sentenceTranslations);
  const node = {
    title: stringValue(record.title),
    englishText: stringValue(record.englishText),
    chineseText: stringValue(record.chineseText),
    // Sentence splitting can differ slightly between providers. Keep the chapter
    // usable and let the reader request a dedicated translation pass when needed.
    sentenceTranslations: providedSentenceTranslations.length === expectedSentenceCount ? providedSentenceTranslations : [],
    summary: stringValue(record.summary),
    choices: normalizeChoices(record.choices),
    vocabulary: normalizeVocabulary(record.vocabulary)
  };
  if (!node.title || node.englishText.length < 60 || node.englishText.length > 2600 || node.chineseText.length < 20 || node.choices.length < 2) {
    throw new Error(`模型续章内容不完整（title=${Boolean(node.title)}，英文=${node.englishText.length}字，中文=${node.chineseText.length}字，选项=${node.choices.length}个；中转站返回：${describePayload(record)}）。`);
  }
  return node;
};

const buildSystemPrompt = () => [
  "You write a branching English reading adventure for Chinese learners.",
  "Return JSON only with title, englishText, chineseText, sentenceTranslations, summary, choices, vocabulary.",
  "Your entire reply must be one JSON object and nothing else: the first character is { and the last is }. Never write analysis, notes, reasoning, or explanations before or after it.",
  "choices must have 2-4 objects with id, label, description, promptHint.",
  "vocabulary must have at most 8 objects with word, translation, partOfSpeech, sentence.",
  "Write one coherent chapter, 90-160 English words, no Markdown.",
  "englishText must be written in English prose; never write the story itself in Chinese.",
  "When continuing a custom adventure, use customPrompt and the saved path as the only story canon; do not reshape it into a campus, city, travel, or fantasy preset.",
  "Every continuation must advance the story and use a new title, setting detail, and event; never repeat an earlier chapter's title, sentences, or outcome.",
  "chineseText must be a complete, natural Chinese translation of englishText.",
  "sentenceTranslations must be a Chinese string array with exactly one natural translation for each sentence in englishText, in the same order. Never merge or omit sentences.",
  "If targetWords are supplied, reuse several of them naturally in the chapter, with extra attention to the first target words; do not force awkward repetition.",
  "Keep choices useful and emotionally clear. Do not punish the learner."
].join(" ");

const buildOpeningSystemPrompt = () => [
  "You create the opening chapter of a branching English reading adventure for Chinese learners from one short learner idea.",
  "Return JSON only with title, englishText, chineseText, sentenceTranslations, summary, choices, vocabulary.",
  "Your entire reply must be one JSON object and nothing else: the first character is { and the last is }. Never write analysis, notes, reasoning, or explanations before or after it.",
  "Invent a memorable but manageable setting, characters, and an immediate goal from the learner idea.",
  "choices must have 2-4 objects with id, label, description, promptHint.",
  "vocabulary must have at most 8 objects with word, translation, partOfSpeech, sentence.",
  "Write one coherent opening chapter, 90-160 English words, no Markdown.",
  "englishText must be written in English prose; never write the story itself in Chinese.",
  "chineseText must be a complete, natural Chinese translation of englishText.",
  "sentenceTranslations must be a Chinese string array with exactly one natural translation for each sentence in englishText, in the same order. Never merge or omit sentences.",
  "If targetWords are supplied, reuse several of them naturally, without making the text awkward.",
  "Keep the story emotionally clear and suitable for the requested learner level."
].join(" ");

/**
 * Detect a "salvaged" JSON object whose fields swallowed the model's
 * pre-answer analysis. Some relays coerce a rambling reply into JSON with
 * garbage field values (a title full of "I'll go with...", a 5000-char
 * englishText). It parses cleanly, so it must be rejected before it can pose
 * as a chapter.
 */
const isContaminatedAdventureObject = (value: unknown): boolean => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  const title = typeof record.title === "string" ? record.title.trim() : "";
  const englishText = typeof record.englishText === "string" ? record.englishText : "";
  if (!title && !englishText) return false;
  if (title.length > 120 || /\n/.test(title) || /\b(?:i'll go with|i will go with|ensure (?:the )?json)\b/i.test(title)) return true;
  if (englishText.length > 2600) return true;
  // The story itself must be English prose. Some models answer the Chinese
  // learner context by writing the whole chapter in Chinese.
  const latin = (englishText.match(/[A-Za-z]/g) ?? []).length;
  const cjk = (englishText.match(/[\u4e00-\u9fff]/g) ?? []).length;
  if (englishText.length > 0 && cjk > latin) return true;
  return false;
};

const requestModelJson = async (
  provider: AiProviderSettings,
  messages: Array<{ role: "system" | "user"; content: string }>,
  // Room for a chapter plus its Chinese translation and per-sentence list; a
  // model that warms up with a little analysis also needs headroom here.
  maxTokens = 2600
) => {
  if (!isAiProviderConfigured(provider)) throw new Error("AI 中转站配置不完整。");
  const controller = new AbortController();
  let timedOut = false;
  const timeout = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, provider.timeoutMs);

  try {
    const endpoint = normalizeChatCompletionsUrl(provider.baseUrl);
    const request = (withResponseFormat: boolean) => requestFetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${provider.apiKey}` },
      body: JSON.stringify({
        model: provider.model,
        temperature: provider.temperature,
        max_tokens: maxTokens,
        ...(withResponseFormat ? { response_format: { type: "json_object" } } : {}),
        messages
      }),
      signal: controller.signal
    });

    let response = await request(true);
    let json = await readResponsePayload<ChatCompletionResponse>(response);
    const errorMessage = json.error?.message || `模型请求失败：${response.status}`;
    // A number of OpenAI-compatible gateways reject response_format even though
    // they support the chat-completions endpoint. Retry once without it.
    if (!response.ok && response.status === 400 && /response.?format|json.?object|unsupported|不支持/i.test(errorMessage)) {
      response = await request(false);
      json = await readResponsePayload<ChatCompletionResponse>(response);
    }
    if (!response.ok) throw new Error(json.error?.message || `模型请求失败：${response.status}`);
    const parseCandidates = (payload: ChatCompletionResponse) => {
      const candidates = extractResponseCandidates(payload);
      let lastParseError: unknown;
      for (const candidate of candidates) {
        try {
          const parsedValue = JSON.parse(extractJson(candidate)) as unknown;
          // Ignore primitive JSON values such as status strings, request ids,
          // or usage counters. They are valid JSON, but cannot be an adventure
          // payload; keep scanning for the actual object/array response.
          if (!parsedValue || (typeof parsedValue !== "object")) {
            lastParseError = new Error("模型返回的 JSON 顶层不是对象。");
            continue;
          }
          // A bare string array (e.g. the chapter written as Chinese sentences)
          // parses cleanly but can never be a chapter; force a retry instead.
          if (Array.isArray(parsedValue) && !parsedValue.some((item) => item && typeof item === "object")) {
            lastParseError = new Error("模型返回了字符串数组而不是章节对象。");
            continue;
          }
          if (isContaminatedAdventureObject(parsedValue)) {
            lastParseError = new Error("模型返回的 JSON 字段被分析文字污染。");
            continue;
          }
          return { value: parsedValue, candidates };
        } catch (error) {
          lastParseError = error;
        }
      }
      const tagged = candidates.map(parseTaggedAdventureText).find(Boolean);
      return { value: tagged, candidates, lastParseError };
    };

    let parsed = parseCandidates(json);
    if (!parsed.candidates.length) {
      const finishReason = json.choices?.[0]?.finish_reason;
      throw new Error(finishReason
        ? `模型响应没有内容（finish_reason=${finishReason}，可能是输出被截断或模型不支持当前请求格式）。`
        : "模型响应没有内容（中转站返回了空的 content）。");
    }

    if (parsed.value !== undefined) return unwrapAdventurePayload(parsed.value);

    // Some models occasionally ignore the JSON-only instruction and answer with
    // task analysis instead. These failures are probabilistic rather than
    // systematic, so retry the request with an explicit format reminder before
    // giving up. Keep response_format: this relay honours it, and dropping it
    // only makes the model ramble more. A lower temperature on retries makes
    // the recovery attempt more deterministic.
    for (let attempt = 0; attempt < 2 && parsed.value === undefined; attempt += 1) {
      try {
        const fallbackMessages = messages.map((message, index) => index === 0
          ? {
              ...message,
              content: `${message.content} Reply with the JSON object only: the first character must be { and the last must be }; do not analyze, explain, or restate the task. The englishText value must be English prose, never Chinese. If strict JSON is unavailable, return plain text using these sections exactly: TITLE:, ENGLISH_TEXT: (English prose), CHINESE_TEXT:, SUMMARY:, CHOICES: (one per line, use label | description | promptHint), VOCABULARY: (one per line, use word | translation | partOfSpeech | sentence).`
            }
          : message);
        // First retry keeps response_format for relays that honour it. The
        // second drops it: some relays "salvage" a rambling reply into
        // pseudo-JSON with contaminated fields when json mode is enforced.
        const useResponseFormat = attempt === 0;
        const retryResponse = await requestFetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${provider.apiKey}` },
          body: JSON.stringify({
            model: provider.model,
            temperature: Math.min(provider.temperature, 0.4),
            max_tokens: maxTokens,
            ...(useResponseFormat ? { response_format: { type: "json_object" } } : {}),
            messages: fallbackMessages
          }),
          signal: controller.signal
        });
        const retryJson = await readResponsePayload<ChatCompletionResponse>(retryResponse);
        if (retryResponse.ok) {
          const retryParsed = parseCandidates(retryJson);
          if (retryParsed.value !== undefined) return unwrapAdventurePayload(retryParsed.value);
          parsed = retryParsed;
        }
      } catch {
        // The original request did reach the provider; preserve the useful
        // parse/format error instead of misreporting a best-effort retry as a
        // connection failure.
      }
    }
    throw new Error(parsed.lastParseError instanceof Error
      ? `模型返回了内容，但不是可解析的 JSON：${parsed.lastParseError.message}（中转站返回开头：${describePayload(parsed.candidates[0])}；模型：${provider.model}）。请再试一次。`
      : `模型返回了内容，但不是可解析的 JSON。（模型：${provider.model}）请再试一次。`);
  } catch (error) {
    // The Tauri HTTP client reports an aborted request as "Request cancelled"
    // rather than a DOMException, so track the timeout explicitly.
    if (timedOut || (error instanceof DOMException && error.name === "AbortError")) {
      throw new Error(`模型请求超时（已等待 ${Math.round(provider.timeoutMs / 1000)} 秒）。`);
    }
    throw new Error(describeModelRequestError(error));
  } finally {
    window.clearTimeout(timeout);
  }
};

export const generateAdventureSentenceTranslationsWithModel = async (
  provider: AiProviderSettings,
  englishText: string
): Promise<string[]> => {
  const sentences = splitAdventureSentences(englishText);
  if (!sentences.length) throw new Error("没有可翻译的英文句子。");

  const value = await requestModelJson(provider, [
    {
      role: "system",
      content: "You translate English reading passages into natural Simplified Chinese. Return JSON only with sentenceTranslations. Your entire reply must be one JSON object and nothing else: the first character is { and the last is }. sentenceTranslations must contain exactly one Chinese translation for every supplied English sentence, in the same order. Never merge, omit, or add sentences."
    },
    { role: "user", content: JSON.stringify({ sentences }) }
  ]);
  const translations = normalizeSentenceTranslations(
    value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>).sentenceTranslations : undefined
  );
  if (translations.length !== sentences.length) throw new Error("逐句译文数量不匹配，请重试。");
  return translations;
};

export const generateAdventureContinuationWithModel = async (
  provider: AiProviderSettings,
  input: AdventureModelInput
): Promise<AdventureModelNode> => {
  const value = await requestModelJson(provider, [
    { role: "system", content: buildSystemPrompt() },
    {
      role: "user",
      content: JSON.stringify({
        task: "continue_adventure",
        ...input,
        // Keep the whole route's titles/summaries for continuity, while only
        // sending full prose for the most recent chapters to control latency.
        path: input.path.map((node, index) => ({
          title: node.title,
          summary: node.summary,
          englishText: index >= input.path.length - 3 ? node.englishText.slice(0, 900) : ""
        }))
      })
    }
  ]);
  const node = normalizeAdventureModelNode(value);
  const normalizedTitle = node.title.toLowerCase();
  const normalizedText = node.englishText.replace(/\s+/g, " ").trim().toLowerCase();
  const repeatsPreviousChapter = input.path.some((chapter) =>
    chapter.title.trim().toLowerCase() === normalizedTitle
    || chapter.englishText.replace(/\s+/g, " ").trim().toLowerCase() === normalizedText
    || contentOverlap(chapter.englishText, node.englishText) >= 0.78
  );
  if (repeatsPreviousChapter) throw new Error("模型重复了之前的章节。");
  return node;
};

const normalizeBatchContinuation = (value: unknown) => {
  const record = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const items = Array.isArray(value)
    ? value
    : Array.isArray(record.continuations)
      ? record.continuations
      : Array.isArray(record.items)
        ? record.items
        : Array.isArray(record.data) ? record.data : [];
  if (!items.length) throw new Error("模型批量续章返回格式不是 continuations 数组。");
  return items.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error("模型批量续章包含无效路线。");
    const entry = item as Record<string, unknown>;
    const choiceId = stringValue(entry.choiceId);
    const nodeValue = entry.node && typeof entry.node === "object" && !Array.isArray(entry.node) ? entry.node : entry;
    return { choiceId, node: normalizeAdventureModelNode(nodeValue) };
  }).filter((item) => item.choiceId);
};

export const generateAdventureContinuationsWithModel = async (
  provider: AiProviderSettings,
  input: AdventureBatchModelInput
): Promise<Array<{ choiceId: string; node: AdventureModelNode }>> => {
  if (!input.choices.length) throw new Error("没有可批量预加载的路线。");
  const value = await requestModelJson(provider, [
    {
      role: "system",
      content: [
        buildSystemPrompt(),
        "For batch continuation, return JSON only with a continuations array.",
        "Return exactly one item for every supplied choice, preserving each choiceId.",
        "Each item must have choiceId, title, englishText, chineseText, summary, choices, vocabulary. sentenceTranslations may be omitted to save tokens.",
        "For each item write 70-110 English words, 2 choices, and at most 4 vocabulary items.",
        "Write a distinct continuation for each choice while keeping all items consistent with the same saved path."
      ].join(" ")
    },
    {
      role: "user",
      content: JSON.stringify({
        task: "continue_adventure_batch",
        template: input.template,
        title: input.title,
        level: input.level,
        customPrompt: input.customPrompt,
        choices: input.choices,
        targetWords: input.targetWords,
        path: input.path.map((node, index) => ({
          title: node.title,
          summary: node.summary,
          englishText: index >= input.path.length - 3 ? node.englishText.slice(0, 900) : ""
        }))
      })
    }
  ], Math.max(2400, input.choices.length * 850));

  const continuations = normalizeBatchContinuation(value);
  const expectedIds = input.choices.map((choice) => choice.choiceId);
  const byChoiceId = new Map(continuations.map((item) => [item.choiceId, item]));
  const missing = expectedIds.filter((choiceId) => !byChoiceId.has(choiceId));
  if (missing.length) throw new Error(`模型批量续章缺少路线：${missing.join("、")}`);

  const seenTitles = new Set<string>();
  const seenTexts = new Set<string>();
  const result = expectedIds.map((choiceId) => {
    const item = byChoiceId.get(choiceId)!;
    const normalizedTitle = item.node.title.toLowerCase();
    const normalizedText = item.node.englishText.replace(/\s+/g, " ").trim().toLowerCase();
    const repeatsPreviousChapter = input.path.some((chapter) =>
      chapter.title.trim().toLowerCase() === normalizedTitle
      || chapter.englishText.replace(/\s+/g, " ").trim().toLowerCase() === normalizedText
      || contentOverlap(chapter.englishText, item.node.englishText) >= 0.78
    );
    if (repeatsPreviousChapter || seenTitles.has(normalizedTitle) || seenTexts.has(normalizedText)) {
      throw new Error("模型批量续章包含重复内容。");
    }
    seenTitles.add(normalizedTitle);
    seenTexts.add(normalizedText);
    return item;
  });
  return result;
};

export const generateAdventureOpeningWithModel = async (
  provider: AiProviderSettings,
  input: AdventureOpeningInput
): Promise<AdventureModelNode> => {
  const prompt = input.customPrompt.trim();
  if (!prompt) throw new Error("请先写一句冒险方向。");
  const value = await requestModelJson(provider, [
    { role: "system", content: buildOpeningSystemPrompt() },
    {
      role: "user",
      content: JSON.stringify({
        task: "create_adventure_opening",
        level: input.level,
        targetWords: input.targetWords,
        customPrompt: prompt
      })
    }
  ]);
  return normalizeAdventureModelNode(value);
};


export const testAdventureProviderConnection = async (provider: AiProviderSettings) => {
  const node = await generateAdventureContinuationWithModel(provider, {
    template: "city",
    title: "Connection test",
    level: "A2",
    customPrompt: "A short test story about finding a blue key.",
    path: [],
    action: "Look for the blue key.",
    targetWords: []
  });
  return Boolean(node.title && node.englishText);
};
