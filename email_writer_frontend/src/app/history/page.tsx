"use client";

import Link from "next/link";
import React from "react";
import { deleteEmail, listEmails, prettyErrorMessage, SavedEmail } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useDraft } from "@/lib/draft";

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export default function HistoryPage() {
  const { state } = useAuth();
  const { setDraft } = useDraft();

  const [items, setItems] = React.useState<SavedEmail[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  async function refresh() {
    setError(null);
    setNotice(null);

    if (!state.token) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const res = await listEmails(state.token);
      setItems(Array.isArray(res?.items) ? res.items : []);
    } catch (err) {
      setError(prettyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  async function onDelete(emailId: string | undefined) {
    if (!state.token) return;
    if (!emailId) {
      setError("Cannot delete: missing email id.");
      return;
    }
    setError(null);
    setNotice(null);
    try {
      await deleteEmail(state.token, emailId);
      setNotice("Deleted.");
      await refresh();
    } catch (err) {
      setError(prettyErrorMessage(err));
    }
  }

  return (
    <div className="card">
      <div className="card-inner">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 className="h1">History</h1>
            <p className="muted" style={{ marginTop: 8 }}>
              Previously saved drafts (requires login).
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn" onClick={refresh} disabled={loading || !state.token} type="button">
              {loading ? "Loading…" : "Refresh"}
            </button>
            {!state.token ? (
              <Link className="btn btn-primary" href="/auth">
                Login
              </Link>
            ) : null}
          </div>
        </div>

        <hr className="hr" />

        {error ? <div className="alert alert-error">{error}</div> : null}
        {notice ? <div className="alert alert-success">{notice}</div> : null}

        {!state.token ? (
          <div className="alert" style={{ marginTop: 10 }}>
            <div className="mono small">
              You are in guest mode. Login to view saved drafts.
            </div>
          </div>
        ) : null}

        <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
          {state.token && !loading && items.length === 0 ? (
            <div className="alert">
              <div className="mono small">No saved emails yet. Save one from the Editor.</div>
            </div>
          ) : null}

          {items.map((it, idx) => {
            const title = it.subject || `Saved Draft #${idx + 1}`;
            return (
              <div key={it.id} className="card">
                <div className="card-inner">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div className="h2">{title}</div>
                      <div className="small muted mono" style={{ marginTop: 6 }}>
                        tone: {it.tone || "—"} • created: {formatDate(it.created_at)}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setDraft({
                            subject: it.subject || "",
                            content: it.content || "",
                            tone: it.tone || "friendly",
                            topic: "",
                            keyPoints: "",
                            updatedAt: Date.now(),
                          });
                        }}
                      >
                        Load into Draft
                      </button>
                      <Link className="btn" href="/editor">
                        Open Editor
                      </Link>
                      <button className="btn btn-danger" type="button" onClick={() => onDelete(it.id)}>
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="codeblock" style={{ marginTop: 12 }}>
                    {it.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
