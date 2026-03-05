import path from "node:path";
import { fileURLToPath } from "node:url";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    // Ensures Vite/Vitest honors tsconfig.json "paths" (e.g. @/* -> ./src/*)
    tsconfigPaths(),
  ],
  resolve: {
    // Extra safety: explicit alias for @ -> ./src (avoids tsconfig parsing edge cases)
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
