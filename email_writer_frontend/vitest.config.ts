import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // NOTE:
  // - We intentionally do NOT use `vite-tsconfig-paths` here.
  // - Recent versions of `vite-tsconfig-paths` are ESM-only and can trigger
  //   startup failures in some Vitest/Node resolution modes when loaded from TS.
  // - Our codebase only needs the `@/* -> ./src/*` mapping, so an explicit alias
  //   is simpler and more robust.
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    css: true,
    include: ["src/**/__tests__/test_*.{ts,tsx}"],
  },
});
