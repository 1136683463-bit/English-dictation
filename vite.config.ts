import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

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

export default defineConfig({
  plugins: [react()],
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
