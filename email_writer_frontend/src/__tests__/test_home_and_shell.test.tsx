import React from "react";
import { render, screen } from "@testing-library/react";

import HomePage from "@/app/page";
import { AppShell } from "@/components/AppShell";

// next/link can render as an anchor for our test purposes.
vi.mock("next/link", () => {
  return {
    default: ({ href, children, ...props }: any) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  };
});

// We don't need AuthProvider in this test; AppShell consumes useAuth hook.
vi.mock("@/lib/auth", () => {
  return {
    useAuth: () => ({
      state: { token: null, user: null },
      logout: vi.fn(),
    }),
  };
});

describe("basic render tests", () => {
  it("renders the Home page heading", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: /ai email writer/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open generator/i })).toBeInTheDocument();
  });

  it("renders AppShell with sidebar brand", () => {
    render(
      <AppShell>
        <div>Child content</div>
      </AppShell>,
    );

    expect(screen.getByText(/email craft pro/i)).toBeInTheDocument();
    expect(screen.getByText(/child content/i)).toBeInTheDocument();
    expect(screen.getByText(/guest mode/i)).toBeInTheDocument();
  });
});
