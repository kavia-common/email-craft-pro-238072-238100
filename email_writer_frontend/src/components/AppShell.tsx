"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "@/lib/auth";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link href={href} data-active={active ? "true" : "false"}>
      <span>{label}</span>
      <span className="small muted">{active ? "●" : "○"}</span>
    </Link>
  );
}

// PUBLIC_INTERFACE
export function AppShell({ children }: { children: React.ReactNode }) {
  /** Shared application shell with retro sidebar navigation. */
  const { state, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div>
            <div className="brand-title">Email Craft Pro</div>
            <div className="small muted mono">AI retro mailroom</div>
          </div>
          <span className="badge" title="Build">
            v0.1
          </span>
        </div>

        <div className="nav" aria-label="Primary navigation">
          <NavLink href="/" label="Home" />
          <NavLink href="/generator" label="Generator" />
          <NavLink href="/editor" label="Editor" />
          <NavLink href="/history" label="History" />
          <NavLink href="/auth" label={state.token ? "Account" : "Login / Signup"} />
        </div>

        <hr className="hr" />

        <div className="card">
          <div className="card-inner">
            <div className="small muted">Session</div>
            <div className="mono" style={{ marginTop: 6 }}>
              {state.token ? (
                <>
                  <div className="small">
                    user: <span className="muted">{state.user?.email || "unknown"}</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                    <button
                      className="btn btn-ghost"
                      onClick={() => {
                        logout();
                        router.push("/");
                      }}
                    >
                      Log out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="small muted">guest mode</div>
                  <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                    <Link className="btn btn-primary" href="/auth">
                      Sign in
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14 }} className="small muted">
          Tip: Use <span className="kbd">Copy</span> / <span className="kbd">Export</span> on drafts.
        </div>
      </aside>

      <main className="main">
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
