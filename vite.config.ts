import http from "node:http";
import type { ServerResponse } from "node:http";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import type { Connect, Plugin } from "vite";

// Upstream TTS hosts answer with an empty "200 OK" when the request carries a
// Referer/Origin header (they reject localhost page sources). The browser sends
// them by default, which leaves the player with a 0-byte audio response and
// makes every playback fall back to the slow system voice. Strip them here so
// the proxy can never leak them upstream.
const stripAudioProxyHeaders = (proxy: {
  on: (event: "proxyReq" | "proxyRes", handler: (arg: any) => void) => void;
}) => {
  proxy.on("proxyReq", (proxyReq) => {
    proxyReq.removeHeader("referer");
    proxyReq.removeHeader("origin");
  });
  proxy.on("proxyRes", (proxyRes) => {
    delete proxyRes.headers["content-disposition"];
    proxyRes.headers["content-type"] = "audio/mpeg";
  });
};

// Keep in sync with RELAY_BRIDGE_PREFIX in src/services/aiHttpClient.ts, which
// builds these URLs on the client.
const RELAY_BRIDGE_PREFIX = "/__ai-relay__/";

// Only loopback targets may be bridged. Anything else would turn the dev server
// into an open proxy that whatever page is loaded could reach hosts through.
const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);

const normalizeHostname = (hostname: string) => hostname.toLowerCase().replace(/^\[|\]$/g, "");

const sendBridgeError = (res: ServerResponse, status: number, message: string) => {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ error: { message } }));
};

/**
 * A local relay such as http://127.0.0.1:7865/v1 is a *different origin* than
 * the page the dev server serves, and these gateways commonly answer with no
 * CORS headers at all — their OPTIONS preflight returns 405 — so the browser
 * rejects every model call as "Load failed" before it is ever sent.
 *
 * The client rewrites loopback relay URLs onto this same-origin path; the dev
 * server then forwards them server-to-server, where CORS does not apply.
 */
const relayBridgeMiddleware: Connect.NextHandleFunction = (req, res, next) => {
  const requestUrl = req.url ?? "";
  if (!requestUrl.startsWith(RELAY_BRIDGE_PREFIX)) return next();

  let target: URL;
  try {
    target = new URL(`http://${requestUrl.slice(RELAY_BRIDGE_PREFIX.length)}`);
  } catch {
    sendBridgeError(res, 400, "中转站桥接地址无法解析。");
    return;
  }

  if (!LOOPBACK_HOSTS.has(normalizeHostname(target.hostname))) {
    sendBridgeError(res, 403, "中转站桥接只允许本机地址（127.0.0.1 / localhost）。");
    return;
  }

  const headers = { ...req.headers, host: target.host };
  // The relay is reached server-to-server here, so the page's Origin and
  // Referer carry no meaning and only risk tripping a local allowlist.
  delete headers.origin;
  delete headers.referer;

  const proxyReq = http.request({
    hostname: normalizeHostname(target.hostname),
    port: target.port || 80,
    path: `${target.pathname}${target.search}`,
    method: req.method,
    headers
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (error: Error) => {
    // 502 (not an empty 200) so the app reports the real cause: the configured
    // relay is not answering on that loopback port.
    if (res.headersSent) {
      res.destroy();
      return;
    }
    sendBridgeError(res, 502, `无法连接本机中转站 ${target.host}：${error.message}`);
  });

  req.pipe(proxyReq);
};

const aiRelayBridge = (): Plugin => ({
  name: "ai-relay-bridge",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use(relayBridgeMiddleware);
  },
  configurePreviewServer(server) {
    server.middlewares.use(relayBridgeMiddleware);
  }
});

export default defineConfig({
  plugins: [react(), aiRelayBridge()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: false,
    proxy: {
      "/youdao-audio": {
        target: "https://dict.youdao.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/youdao-audio/, "/dictvoice"),
        configure: stripAudioProxyHeaders
      },
      "/sentence-audio": {
        target: "https://fanyi.baidu.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sentence-audio/, "/gettts"),
        configure: stripAudioProxyHeaders
      }
    }
  },
  test: {
    environment: "jsdom",
    restoreMocks: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"]
  }
});
