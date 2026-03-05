"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser, prettyErrorMessage, registerUser } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type Mode = "login" | "signup";

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function AuthPageInner() {
  const { state, setAuth, logout } = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  const initialMode = (params.get("mode") as Mode) || "login";
  const [mode, setMode] = React.useState<Mode>(initialMode);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const afterLoginPath = process.env.NEXT_PUBLIC_AFTER_LOGIN_PATH || "/generator";

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (mode === "signup" && name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res =
        mode === "signup"
          ? await registerUser({ name: name.trim(), email: email.trim(), password })
          : await loginUser({ email: email.trim(), password });

      if (!res?.token) {
        throw new Error("Login succeeded but no token was returned.");
      }

      setAuth({ token: res.token, user: res.user || { name: name.trim(), email: email.trim() } });
      setSuccess(mode === "signup" ? "Account created. Logged in!" : "Logged in!");
      router.push(afterLoginPath);
    } catch (err) {
      setError(prettyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="card-inner">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 className="h1">{state.token ? "Account" : "Login / Signup"}</h1>
            <p className="muted" style={{ marginTop: 8 }}>
              Auth state is stored client-side. The backend should validate tokens on protected
              endpoints.
            </p>
          </div>
          {state.token ? (
            <button className="btn btn-danger" onClick={logout}>
              Log out
            </button>
          ) : (
            <span className="badge">retro auth</span>
          )}
        </div>

        <hr className="hr" />

        {state.token ? (
          <div className="alert alert-success">
            <div className="mono small">Logged in as: {state.user?.email || "unknown"}</div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                className={`btn ${mode === "login" ? "btn-primary" : ""}`}
                onClick={() => setMode("login")}
                type="button"
              >
                Login
              </button>
              <button
                className={`btn ${mode === "signup" ? "btn-primary" : ""}`}
                onClick={() => setMode("signup")}
                type="button"
              >
                Signup
              </button>
            </div>

            <form onSubmit={onSubmit} style={{ marginTop: 14 }}>
              <div className="row">
                {mode === "signup" ? (
                  <div>
                    <label className="label" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="input"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ada Lovelace"
                      autoComplete="name"
                      disabled={loading}
                    />
                  </div>
                ) : (
                  <div />
                )}

                <div>
                  <label className="label" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="input"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    autoComplete={mode === "signup" ? "email" : "username"}
                    disabled={loading}
                  />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <label className="label" htmlFor="password">
                  Password
                </label>
                <input
                  className="input"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  disabled={loading}
                />
              </div>

              {error ? (
                <div className="alert alert-error" style={{ marginTop: 12 }}>
                  {error}
                </div>
              ) : null}
              {success ? (
                <div className="alert alert-success" style={{ marginTop: 12 }}>
                  {success}
                </div>
              ) : null}

              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? "Working…" : mode === "signup" ? "Create account" : "Login"}
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setName("");
                    setEmail("");
                    setPassword("");
                    setError(null);
                    setSuccess(null);
                  }}
                >
                  Reset
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function AuthPage() {
  /** Suspense wrapper required for useSearchParams() during static export. */
  return (
    <React.Suspense
      fallback={
        <div className="card">
          <div className="card-inner">
            <div className="h2">Loading…</div>
            <p className="muted" style={{ marginTop: 8 }}>
              Preparing auth console.
            </p>
          </div>
        </div>
      }
    >
      <AuthPageInner />
    </React.Suspense>
  );
}
