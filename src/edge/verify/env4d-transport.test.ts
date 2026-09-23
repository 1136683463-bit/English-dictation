// @vitest-environment jsdom
/**
 * ENV4-D · AI / 云同步传输层的跨环境形状差异（2026-09-22）
 *
 * 两处代码在 Tauri 与浏览器下走**完全不同的实现**，但共享同一个 `Response` 类型：
 *
 *   浏览器 → `globalThis.fetch` → 标准 `Response`
 *   Tauri  → `@tauri-apps/plugin-http` 的 `fetch` → **插件自己的 Response**
 *            （`requestFetch` 里 `as Response` 是纯类型断言，不做任何转换）
 *
 * 本文件回答三件事：
 *   ① 调用方用到 `Response` 的哪些字段？这些字段在插件返回值上是否都在？
 *   ② 插件报错时抛出的**不是 Error**（是字符串），`describeModelRequestError`
 *      能不能把真实原因带到用户面前？
 *   ③ CORS：桌面端绕过、浏览器端受限 → 是否存在「桌面能用、浏览器不能用」的配置？
 *
 * ## 事实基线（源码核对 + 可执行探针）
 *
 * - 插件 `fetch` 内部 `new Response(body, { status, statusText })`，
 *   再 `Object.defineProperty` 补上 `url` 与 `headers`（plugin-http dist-js/index.js:153-176）
 *   → `ok` / `status` / `text()` / `json()` / `headers` / `url` **全部存在**，
 *   `.ok` 由 `status` 派生。调用方用到的字段集合（ok/status/text/json）在两侧一致。
 * - 作用域拒绝时 Rust 侧返回 `url not allowed on the configured scope: <url>`
 *   （tauri-plugin-http-2.6.0/src/error.rs:23），经 IPC 变成**字符串**而非 Error
 *   （tauri-2.11.5/src/ipc/mod.rs:229-234 `InvokeError::from_error` →
 *   `serde_json::Value::String(error.to_string())`）。
 * - 本应用 `src-tauri/capabilities/default.json` 的 `http:default.allow`
 *   是 `http://*:*` 与 `https://*:*`。经 urlpattern 实测（见报告）：
 *   `https://*:*` 不匹配 `http://…`，`http://*:*` 不匹配 `https://…`，
 *   两者合起来覆盖所有 http/https 主机与端口 → 当前配置**不会**触发作用域拒绝。
 */
import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import {
  describeModelRequestError,
  isLoopbackRelayUrl,
  isTauriRuntime,
  postChatCompletion,
  readResponsePayload,
  requestFetch,
  toRelayBridgeUrl
} from "../../services/aiHttpClient";

/** 装一个假的 Tauri IPC 桥；invoke 的行为由 handler 决定。 */
const installFakeTauri = (invoke: (cmd: string) => Promise<unknown>) => {
  const calls: string[] = [];
  (window as unknown as Record<string, unknown>).__TAURI_INTERNALS__ = {
    invoke: (cmd: string) => {
      calls.push(cmd);
      return invoke(cmd);
    },
    transformCallback: () => 1,
    unregisterCallback: () => undefined,
    convertFileSrc: (path: string) => path
  };
  return {
    calls,
    restore: () => {
      Reflect.deleteProperty(window as unknown as Record<string, unknown>, "__TAURI_INTERNALS__");
    }
  };
};

/**
 * 按插件的真实分帧格式给出响应体（plugin-http dist-js/index.js 的 `readChunk`）：
 *   - 每一帧的**最后一个字节是哨兵**：0 = 后面还有数据，1 = 流到此结束；
 *   - 哨兵为 1 的那一帧**只 close、不入队** `actualData`。
 * 所以「一段数据 + 一个结束帧」是两次 `fetch_read_body` 调用，不能合成一帧
 * （合成会把正文整段丢掉——这正是本文件第一轮写错的地方）。
 */
const bodyFrames = (text: string): number[][] => {
  const encoded = Array.from(new TextEncoder().encode(text));
  return encoded.length > 0 ? [[...encoded, 0], [1]] : [[1]];
};

const installTauriResponder = (options: {
  status?: number;
  statusText?: string;
  body?: string;
  throwOnFetch?: unknown;
}) => {
  const queue: number[][] = [];
  return installFakeTauri(async (cmd) => {
    if (cmd === "plugin:http|fetch") {
      if (options.throwOnFetch !== undefined) throw options.throwOnFetch;
      queue.length = 0;
      queue.push(...bodyFrames(options.body ?? ""));
      return 1;
    }
    if (cmd === "plugin:http|fetch_send") {
      return {
        status: options.status ?? 200,
        statusText: options.statusText ?? "OK",
        url: "https://relay.invalid/v1/chat/completions",
        headers: [["content-type", "application/json"]],
        rid: 2
      };
    }
    if (cmd === "plugin:http|fetch_read_body") return queue.shift() ?? [1];
    return null;
  });
};

describe("ENV4-D① Response 形状：Tauri 插件返回值与标准 Response 的字段对照", () => {
  let bridge: { restore: () => void } | null = null;
  afterEach(() => {
    bridge?.restore();
    bridge = null;
  });

  it("插件返回的对象是**原生 Response 实例**，不是自定义类", async () => {
    bridge = installTauriResponder({ body: JSON.stringify({ ok: 1 }) });
    expect(isTauriRuntime(), "假 IPC 装好后 isTauriRuntime() 为 true").toBe(true);

    const response = await requestFetch("https://relay.invalid/v1/chat/completions", { method: "POST" });
    expect(response.constructor.name).toBe("Response");
    expect(response, "是 globalThis.Response 的实例（插件内部 new Response）").toBeInstanceOf(Response);
  });

  it("调用方用到的字段全部存在且语义一致：ok / status / text() / json()", async () => {
    const payload = { choices: [{ message: { content: "hello" } }] };
    bridge = installTauriResponder({ body: JSON.stringify(payload) });

    const response = await requestFetch("https://relay.invalid/v1/chat/completions", { method: "POST" });

    expect(typeof response.ok).toBe("boolean");
    expect(response.ok, "200 → ok").toBe(true);
    expect(response.status).toBe(200);
    expect(typeof response.text).toBe("function");
    expect(typeof response.json).toBe("function");
    expect(await response.text()).toBe(JSON.stringify(payload));
  });

  it("非 2xx 时 ok 为 false 且 status 保留（调用方的 !ok + status 分支依赖这两点）", async () => {
    bridge = installTauriResponder({ status: 401, statusText: "Unauthorized", body: '{"error":{"message":"bad key"}}' });

    const response = await requestFetch("https://relay.invalid/v1/chat/completions", { method: "POST" });
    expect(response.ok).toBe(false);
    expect(response.status, "401 会被描述成「API Key 无效」").toBe(401);

    const parsed = await readResponsePayload<{ error?: { message?: string } }>(response);
    expect(parsed.error?.message).toBe("bad key");
  });

  it("readResponsePayload 在插件响应上走同一条路径（先 text 再 JSON.parse）", async () => {
    bridge = installTauriResponder({ body: "not json at all" });
    const response = await requestFetch("https://relay.invalid/v1/chat/completions", { method: "POST" });
    const payload = await readResponsePayload<{ content?: string }>(response);
    expect(payload.content, "非 JSON 时降级成 { content: 原文 }").toBe("not json at all");
  });

  it("插件响应上 SSE 风格的 body 也能被 reassemble 成 message 形状", async () => {
    const sse = [
      'data: {"choices":[{"delta":{"content":"Hello "}}]}',
      'data: {"choices":[{"delta":{"content":"world"}}]}',
      "data: [DONE]",
      ""
    ].join("\n");
    bridge = installTauriResponder({ body: sse });
    const response = await requestFetch("https://relay.invalid/v1/chat/completions", { method: "POST" });
    const payload = await readResponsePayload<{ content?: string }>(response);
    expect(payload.content).toBe("Hello world");
  });

  it("requestFetch 在 Tauri 下**不**改写 URL（桥接只服务于浏览器）", async () => {
    bridge = installTauriResponder({ body: "{}" });
    const { RELAY_BRIDGE_PREFIX } = await import("../../services/aiHttpClient");
    const loopback = "http://127.0.0.1:7865/v1/chat/completions";
    // 页面 origin 假装也是 loopback，确保不会被「非 loopback 页面」规则提前放行
    expect(toRelayBridgeUrl(loopback), "Tauri 下不做桥接重写").toBe(loopback);
    expect(toRelayBridgeUrl(loopback)).not.toContain(RELAY_BRIDGE_PREFIX);
  });
});

describe("ENV4-D② 错误形状：插件抛字符串而非 Error，真实原因被吞", () => {
  let bridge: { restore: () => void } | null = null;
  afterEach(() => {
    bridge?.restore();
    bridge = null;
  });

  it("★ 已识别：作用域拒绝抛的是**字符串**，instanceof Error 为 false", async () => {
    bridge = installTauriResponder({
      throwOnFetch: "url not allowed on the configured scope: https://blocked.example/v1"
    });

    let caught: unknown = null;
    try {
      await requestFetch("https://blocked.example/v1/chat/completions", { method: "POST" });
    } catch (error) {
      caught = error;
    }

    expect(typeof caught, "★ Rust 侧的错误经 IPC 变成字符串").toBe("string");
    expect(caught instanceof Error, "★ 不是 Error 实例").toBe(false);
  });

  it("★ 后果：字符串错误进 describeModelRequestError，真实原因被替换成通用文案", () => {
    const scopeDenial = "url not allowed on the configured scope: https://blocked.example/v1";
    expect(
      describeModelRequestError(scopeDenial),
      "★ 缺陷：作用域拒绝的原因（哪条 URL 被拒）没有传到用户面前，只剩一句通用兜底"
    ).toBe("无法连接 AI 中转站，请检查网络和 Base URL。");
    expect(describeModelRequestError(scopeDenial)).not.toContain("scope");
  });

  it("★ 后果：网络层错误（reqwest 文案）同样落进通用兜底，不含可执行线索", () => {
    const networkError = "error sending request for url (https://relay.invalid/v1/chat/completions)";
    const described = describeModelRequestError(networkError);
    expect(described).toBe("无法连接 AI 中转站，请检查网络和 Base URL。");
    expect(described, "对用户仍算可执行的兜底（去看网络与地址）").toMatch(/网络|Base URL/);
  });

  it("对照：浏览器的 fetch 抛 Error 时文案识别是准确的（CORS 提示能出来）", () => {
    expect(describeModelRequestError(new TypeError("Load failed"))).toMatch(/CORS/);
    expect(describeModelRequestError(new TypeError("Failed to fetch"))).toMatch(/CORS/);
    expect(describeModelRequestError(new TypeError("NetworkError when attempting to fetch resource."))).toMatch(/CORS/);
  });

  it("postChatCompletion 的 400 重试分支在插件响应上同样成立（ok/status 都在）", async () => {
    let sendCount = 0;
    const queue: number[][] = [];
    bridge = installFakeTauri(async (cmd) => {
      if (cmd === "plugin:http|fetch") {
        sendCount += 1;
        queue.length = 0;
        queue.push(...bodyFrames('{"error":{"message":"Unsupported parameter: thinking"}}'));
        return sendCount;
      }
      if (cmd === "plugin:http|fetch_send") {
        return {
          status: 400,
          statusText: "Bad Request",
          url: "https://relay.invalid/v1/chat/completions",
          headers: [["content-type", "application/json"]],
          rid: 10 + sendCount
        };
      }
      if (cmd === "plugin:http|fetch_read_body") return queue.shift() ?? [1];
      return null;
    });

    const result = await postChatCompletion<{ error?: { message?: string } }>(
      "https://relay.invalid/v1/chat/completions",
      "k",
      (withOptionalFields) => ({ model: "m", ...(withOptionalFields ? { thinking: { type: "disabled" } } : {}) })
    );

    expect(sendCount, "识别出可选字段被拒 → 重发一次").toBe(2);
    expect(result.response.status).toBe(400);
    expect(result.json.error?.message).toContain("thinking");
  });
});

describe("ENV4-D③ CORS 能力差异：桌面绕过、浏览器受限", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("Tauri 路径不经过 globalThis.fetch —— CORS 完全不参与", async () => {
    const globalFetch = vi.fn();
    vi.stubGlobal("fetch", globalFetch);
    const bridge = installFakeTauri(async (cmd) => {
      if (cmd === "plugin:http|fetch") return 1;
      if (cmd === "plugin:http|fetch_send") {
        return { status: 200, statusText: "OK", url: "https://relay.invalid/v1", headers: [], rid: 2 };
      }
      if (cmd === "plugin:http|fetch_read_body") return [1];
      return null;
    });

    await requestFetch("https://relay.invalid/v1/chat/completions", { method: "POST" });
    expect(globalFetch, "桌面端走 IPC + Rust reqwest，页面侧 fetch 一次都没调").not.toHaveBeenCalled();

    bridge.restore();
  });

  it("浏览器路径经过 globalThis.fetch —— 受 CORS 约束", async () => {
    const globalFetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    vi.stubGlobal("fetch", globalFetch);
    expect(isTauriRuntime()).toBe(false);

    await expect(
      requestFetch("https://relay.invalid/v1/chat/completions", { method: "POST" })
    ).rejects.toThrow(/Failed to fetch/);
    expect(globalFetch).toHaveBeenCalledTimes(1);
  });

  it("loopback 中转站在浏览器下被改写成同源桥接（绕开 CORS），桌面端不改写", async () => {
    const globalFetch = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", globalFetch);
    Object.defineProperty(window, "location", {
      value: { origin: "http://127.0.0.1:1420" },
      configurable: true,
      writable: true
    });

    await requestFetch("http://127.0.0.1:7865/v1/chat/completions", { method: "POST" });
    expect(
      globalFetch.mock.calls[0][0],
      "浏览器 + loopback 页面 → 走 dev server 桥接，服务端做那一跳"
    ).toBe("/__ai-relay__/127.0.0.1:7865/v1/chat/completions");

    // 桌面端：即使 URL 是 loopback 也不改写
    const bridge = installFakeTauri(async (cmd) => {
      if (cmd === "plugin:http|fetch") return 1;
      if (cmd === "plugin:http|fetch_send") {
        return { status: 200, statusText: "OK", url: "http://127.0.0.1:7865/v1", headers: [], rid: 2 };
      }
      if (cmd === "plugin:http|fetch_read_body") return [1];
      return null;
    });
    expect(toRelayBridgeUrl("http://127.0.0.1:7865/v1/chat/completions")).toBe(
      "http://127.0.0.1:7865/v1/chat/completions"
    );
    bridge.restore();

    Reflect.deleteProperty(window, "location");
  });

  it("★ 值得注意：桥接路由只在 dev/preview 存在，自建静态服务器下会打到 404", async () => {
    /*
     * `toRelayBridgeUrl` 的放行条件只是「**页面 origin 是 loopback**」，
     * 它并不知道 `/__ai-relay__/` 这条路由此刻有没有服务端实现。
     * 而 `aiRelayBridge` 中间件只挂在 vite 的 dev server 与 preview server 上
     * （vite.config.ts 的 `apply: "serve"` + `configurePreviewServer`）。
     * 于是把 `dist/` 挂到任意 loopback 静态服务器（`python -m http.server`
     * 之类）打开时，loopback 中转站会被改写成
     * `<该静态服务器>/__ai-relay__/…`，得到 404 —— 而错误提示说的是
     * 「可能是网络、CORS 或地址不可达」，与真实原因（路由不存在）不符。
     *
     * 桌面端不受影响：Tauri 的页面 origin 是 `tauri://localhost` /
     * `http://tauri.localhost`，`isLoopbackRelayUrl(pageOrigin)` 为 false → 不改写。
     */
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const config = readFileSync(join(process.cwd(), "vite.config.ts"), "utf8");

    expect(config, "桥接中间件只挂在 vite 的 server 上").toMatch(/apply:\s*"serve"/);
    expect(config, "dev 与 preview 都有（preview 也能桥接）").toMatch(/configurePreviewServer/);
    expect(config, "路由前缀与客户端常量同源").toMatch(/RELAY_BRIDGE_PREFIX\s*=\s*"\/__ai-relay__\/"/);
  });

  it("桌面端页面 origin 不是 loopback，因而永远不会被误改写", () => {
    // 这是 Tauri 的实际 origin（见 tauri-2.11.5/src/manager/mod.rs:338-345）
    for (const origin of ["tauri://localhost", "http://tauri.localhost", "https://tauri.localhost"]) {
      expect(isLoopbackRelayUrl(origin), `${origin} 不是 http+loopback 组合 → 不改写`).toBe(false);
    }
    // 反向确认：不带 page origin 时（jsdom 默认 http://localhost:3000 是 loopback）
    // 只验证「非 loopback 目标不改写」这一半，避免依赖宿主 origin。
    expect(toRelayBridgeUrl("https://api.example.com/v1")).toBe("https://api.example.com/v1");
  });
});

describe("ENV4-D④ 云同步走同一条 requestFetch：字段与错误映射一致", () => {
  let bridge: { restore: () => void } | null = null;
  afterEach(() => {
    bridge?.restore();
    bridge = null;
  });

  it("sync 用 response.status === 404 判「云端还没有数据」——插件响应保留 status", async () => {
    bridge = installTauriResponder({ status: 404, statusText: "Not Found", body: "" });
    const response = await requestFetch("https://sync.invalid/sync", { method: "GET" });
    expect(response.status).toBe(404);
    expect(response.ok).toBe(false);
  });

  it("sync 用 response.text() 读原始体并自己 JSON.parse —— 插件响应提供 text()", async () => {
    bridge = installTauriResponder({ body: '{"savedAt":"2026-09-22T00:00:00.000Z"}' });
    const response = await requestFetch("https://sync.invalid/sync", { method: "GET" });
    const text = await response.text();
    expect(JSON.parse(text).savedAt).toBe("2026-09-22T00:00:00.000Z");
  });

  it("★ 字符串错误在 sync 侧同样被吞（连原始文案都拿不到）", async () => {
    const { describeSyncError } = await import("../../services/syncService");
    const scopeDenial = "url not allowed on the configured scope: https://sync.invalid/sync";
    expect(
      describeSyncError(scopeDenial),
      "★ describeSyncError 对非 Error 输入只返回通用兜底，连原始文案都丢掉了"
    ).toBe("云同步失败，请检查网络和服务地址。");
    expect(
      describeSyncError(new Error(scopeDenial)),
      "对照：包成 Error 时原始文案会透给用户（说明问题只在形状）"
    ).toBe(scopeDenial);
  });
});
