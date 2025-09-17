import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["@/fvtt-testing/src/setup.ts"],
    includeSource: ["src/**/*.{ts,tsx}", "@/fvtt-testing/src/*.ts"],
  },
});
