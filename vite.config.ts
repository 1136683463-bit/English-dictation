import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

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
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            delete proxyRes.headers["content-disposition"];
            proxyRes.headers["content-type"] = "audio/mpeg";
          });
        }
      },
      "/sentence-audio": {
        target: "https://fanyi.baidu.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sentence-audio/, "/gettts"),
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            delete proxyRes.headers["content-disposition"];
            proxyRes.headers["content-type"] = "audio/mpeg";
          });
        }
      }
    }
  },
  test: {
    environment: "jsdom",
    restoreMocks: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"]
  }
});
