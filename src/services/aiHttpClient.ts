import type { AiProviderSettings } from "../types";

/**
 * Shared transport layer for every OpenAI-compatible relay call.
 *
 * Desktop builds send model traffic through Tauri's Rust HTTP client, which
 * sits outside the WebView, so a user-configured relay cannot be blocked by
 * browser CORS rules. Browser development keeps the native fetch API.
 */

export const isAiProviderConfigured = (settings: AiProviderSettings) =>
  Boolean(settings.enabled && settings.baseUrl.trim() && settings.apiKey.trim() && settings.model.trim());

export const isTauriRuntime = () =>
  typeof window !== "undefined"
  && Boolean((window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__);

export const normalizeChatCompletionsUrl = (baseUrl: string) => {
  const base = baseUrl.trim().replace(/\/+$/, "");
  try {
    const parsed = new URL(base);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("协议不支持");
  } catch {
    throw new Error("AI 中转站地址无效，请填写 http(s):// 开头的 Base URL。");
  }
  return base.endsWith("/chat/completions") ? base : `${base}/chat/completions`;
};

export const requestFetch = async (input: string, init: RequestInit): Promise<Response> => {
  if (isTauriRuntime()) {
    const tauriHttp = await import("@tauri-apps/plugin-http");
    return await tauriHttp.fetch(input, init) as Response;
  }
  return globalThis.fetch(input, init);
};

/**
 * Headers for every OpenAI-compatible chat request.
 *
 * The wb2api local gateway rewrites outbound system prompts and injects
 * DeepSeek thinking by default (both tuned for CLI clients). This app needs
 * its own system prompt kept verbatim and a thinking-free token budget, so all
 * model traffic opts into passthrough prompt + disabled thinking via the two
 * X-WB2A-* opt-in headers. Other relays ignore unknown X-headers by HTTP
 * convention, so they are safe to send everywhere.
 */
export const buildAiRequestHeaders = (apiKey: string): Record<string, string> => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${apiKey}`,
  "X-WB2A-Prompt-Mode": "passthrough",
  "X-WB2A-Thinking": "disabled"
});

export const describeModelRequestError = (error: unknown) => {
  if (error instanceof Error) {
    if (/load failed|failed to fetch|networkerror|network request failed/i.test(error.message)) {
      return "无法连接 AI 中转站（可能是网络、CORS 或地址不可达）。请先在设置中点击“测试连接”。";
    }
    return error.message;
  }
  return "无法连接 AI 中转站，请检查网络和 Base URL。";
};

/**
 * Some gateways answer with a streaming body even though the client never asked
 * for one. Turn the `data:` chunks back into a single message so the rest of
 * the pipeline can treat the answer like a normal completion.
 */
export const reassembleStreamText = (raw: string): string | null => {
  if (!/^\s*data:\s*/m.test(raw)) return null;
  const parts: string[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const payload = line.replace(/^\s*data:\s*/, "").trim();
    if (!payload || payload === "[DONE]") continue;
    let chunk: any;
    try {
      chunk = JSON.parse(payload);
    } catch {
      continue;
    }
    if (!chunk || typeof chunk !== "object") continue;
    const choice = Array.isArray(chunk.choices) ? chunk.choices[0] : undefined;
    const delta = choice?.delta ?? choice?.message;
    const piece = typeof delta?.content === "string"
      ? delta.content
      : typeof choice?.text === "string" ? choice.text : "";
    if (piece) parts.push(piece);
  }
  const text = parts.join("");
  return text.trim() ? text : null;
};

/**
 * Several compatible gateways answer with JSON bodies served as text/plain or
 * with an SSE-flavoured body. Read the raw text first so a perfectly usable
 * model answer is never discarded by a failing response.json().
 */
export const readResponsePayload = async <T = any>(response: Response): Promise<T> => {
  try {
    if (typeof response.text === "function") {
      const raw = await response.text();
      if (!raw.trim()) return {} as T;
      try {
        return JSON.parse(raw) as T;
      } catch {
        const assembled = reassembleStreamText(raw);
        if (assembled) {
          // Normalize the streaming body into the non-streaming completion shape.
          return { content: assembled, choices: [{ message: { content: assembled } }] } as T;
        }
        return { content: raw } as T;
      }
    }
  } catch {
    // Fall through to the provider's JSON helper below.
  }
  try {
    return await response.json() as T;
  } catch {
    return {} as T;
  }
};
