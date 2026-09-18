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

// Keep in sync with RELAY_BRIDGE_PREFIX in vite.config.ts, which serves it.
export const RELAY_BRIDGE_PREFIX = "/__ai-relay__/";

const LOOPBACK_HOSTNAMES = new Set(["127.0.0.1", "localhost", "::1"]);

const hostnameOf = (url: URL) => url.hostname.toLowerCase().replace(/^\[|\]$/g, "");

export const isLoopbackRelayUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    // Plain HTTP only: the bridge forwards without TLS, so an https loopback
    // relay must stay on its own connection rather than be redirected into it.
    return parsed.protocol === "http:" && LOOPBACK_HOSTNAMES.has(hostnameOf(parsed));
  } catch {
    return false;
  }
};

/**
 * Rewrite a loopback relay URL onto the dev server's same-origin bridge.
 *
 * A relay on http://127.0.0.1:7865 is a different origin than the page the dev
 * server serves, and such gateways usually send no CORS headers at all (their
 * OPTIONS preflight answers 405), so the browser blocks the call as "Load
 * failed" before it is ever sent. Routing it through the dev server keeps the
 * request same-origin in the browser while the server does the hop to loopback.
 *
 * Only when the page itself is served from loopback: elsewhere the bridge route
 * would not exist, and rewriting would replace a clear CORS failure with a
 * confusing "not found" from whatever host is serving the page.
 */
export const toRelayBridgeUrl = (url: string) => {
  if (isTauriRuntime() || !isLoopbackRelayUrl(url)) return url;
  const pageOrigin = typeof window !== "undefined" ? window.location?.origin ?? "" : "";
  if (!isLoopbackRelayUrl(pageOrigin)) return url;
  const parsed = new URL(url);
  return `${RELAY_BRIDGE_PREFIX}${parsed.host}${parsed.pathname}${parsed.search}`;
};

export const requestFetch = async (input: string, init: RequestInit): Promise<Response> => {
  if (isTauriRuntime()) {
    const tauriHttp = await import("@tauri-apps/plugin-http");
    return await tauriHttp.fetch(input, init) as Response;
  }
  return globalThis.fetch(toRelayBridgeUrl(input), init);
};

/**
 * Headers for every OpenAI-compatible chat request.
 *
 * The X-WB2A-* headers opt into verbatim system prompts and no DeepSeek
 * thinking on gateways that read them, and are ignored by HTTP convention
 * everywhere else. They are not a reliable switch though: the wb2api gateway
 * only honours the thinking state carried in the request body, so the real
 * control travels as a body field (see buildAiThinkingParams).
 */
export const buildAiRequestHeaders = (apiKey: string): Record<string, string> => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${apiKey}`,
  "X-WB2A-Prompt-Mode": "passthrough",
  "X-WB2A-Thinking": "disabled"
});

/**
 * Ask the relay to answer without hidden reasoning.
 *
 * The wb2api gateway enables DeepSeek thinking for any request that does not
 * say otherwise, and those reasoning tokens are billed against `max_tokens`.
 * A 2600-token chapter budget came back with 1860 tokens spent on reasoning
 * and the JSON cut off mid-object, which surfaced as "模型续章内容不完整".
 * Its X-WB2A-Thinking header is never consulted, so this body field is what
 * actually turns the thinking off.
 */
export const buildAiThinkingParams = () => ({ thinking: { type: "disabled" } });

/**
 * Whether a 400 names one of the optional compatibility fields above, meaning
 * the relay rejects them even though it speaks chat completions. Strict
 * OpenAI-style APIs answer this way for unknown arguments, so callers retry
 * once without them rather than failing the whole feature.
 */
export const isOptionalRelayFieldRejection = (message: string) =>
  /response.?format|json.?object|thinking|reasoning|unsupported|不支持|unrecognized|not permitted|extra inputs/i.test(message);

/**
 * Send one chat completion, retrying once without the optional compatibility
 * fields when the relay rejects them by name.
 *
 * `thinking` is not part of the OpenAI schema, so a strict API answers 400 for
 * it; dropping both optional fields on that specific reply keeps such relays
 * working while the permissive ones (which ignore unknown fields) keep the
 * thinking opt-out that stops their reasoning tokens from eating the budget.
 */
export const postChatCompletion = async <T = any>(
  url: string,
  apiKey: string,
  buildBody: (withOptionalFields: boolean) => Record<string, unknown>,
  signal?: AbortSignal
): Promise<{ response: Response; json: T }> => {
  const send = async (withOptionalFields: boolean) => {
    const response = await requestFetch(url, {
      method: "POST",
      headers: buildAiRequestHeaders(apiKey),
      body: JSON.stringify(buildBody(withOptionalFields)),
      signal
    });
    return { response, json: await readResponsePayload<T>(response) };
  };

  const first = await send(true);
  const errorMessage = (first.json as { error?: { message?: string } } | undefined)?.error?.message ?? "";
  if (!first.response.ok && first.response.status === 400 && isOptionalRelayFieldRejection(errorMessage)) {
    return await send(false);
  }
  return first;
};

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
