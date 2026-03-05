import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Minimal mocks for Next.js APIs used by client components.
vi.mock("next/navigation", () => {
  return {
    usePathname: () => "/",
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    }),
  };
});
