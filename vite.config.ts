import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: false
  },
  test: {
    environment: "jsdom",
    restoreMocks: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"]
  }
});
