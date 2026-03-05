"use client";

import Link from "next/link";
import React from "react";
import { prettyErrorMessage, saveEmailDraft } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useDraft } from "@/lib/draft";
import { copyToClipboard, downloadTxtFile } from "@/lib/exporting";

export default function EditorPage() {
  const { state } = useAuth();
  const { draft, setDraft } = useDraft();

  const [subject, setSubject] = React.useState(draft?.subject || "");
  const [tone, setTone] = React.useState(draft?.tone || "friendly");
  const [content, setContent] = React.useState(draft?.content || "");

  const [loadingSave, setLoadingSave] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Keep local UI in sync with stored draft if user returns after generating
    setSubject(draft?.subject || "");
    setTone(draft?.tone || "friendly");
    setContent(draft?.content || "");
  }, [draft?.content, draft?.subject, draft?.tone]);

  function persistDraft() {
    setDraft({
      subject,
      content,
      tone,
      topic: draft?.topic || "",
      keyPoints: draft?.keyPoints || "",
      updatedAt: Date.now(),
    });
  }

  async function onCopy() {
    setNotice(null);
    setError(null);
    try {
      await copyToClipboard(content || "");
      setNotice("Copied to clipboard.");
    } catch (err) {
      setError(prettyErrorMessage(err));
    }
  }

  function onExport() {
    const safeSubject = (subject || "email-draft").replace(/[^\w\-]+/g, "-").slice(0, 48);
    downloadTxtFile(`${safeSubject}.txt`, content || "");
    setNotice("Download started.");
  }

  async function onSave() {
    setNotice(null);
    setError(null);

    if (!state.token) {
      setError("You must be logged in to save emails.");
      return;
    }
    if (!content.trim()) {
      setError("Nothing to save yet. Generate or paste email content.");
      return;
    }

    setLoadingSave(true);
    try {
      await saveEmailDraft({ subject: subject.trim(), content: content.trim(), tone }, state.token);
      setNotice("Saved to history.");
      persistDraft();
    } catch (err) {
      setError(prettyErrorMessage(err));
    } finally {
      setLoadingSave(false);
    }
  }

  return (
    <div className="card">
      <div className="card-inner">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 className="h1">Editor</h1>
            <p className="muted" style={{ marginTop: 8 }}>
              Refine your draft. Copy/export anytime. Save requires login.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn" type="button" onClick={onCopy} disabled={!content}>
              Copy
            </button>
            <button className="btn" type="button" onClick={onExport} disabled={!content}>
              Export .txt
            </button>
            <button className="btn btn-primary" type="button" onClick={onSave} disabled={loadingSave}>
              {loadingSave ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        <hr className="hr" />

        {error ? <div className="alert alert-error">{error}</div> : null}
        {notice ? <div className="alert alert-success">{notice}</div> : null}

        <div className="row" style={{ marginTop: 12 }}>
          <div>
            <label className="label" htmlFor="subject">
              Subject
            </label>
            <input
              className="input"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onBlur={persistDraft}
              placeholder="Subject line"
            />
          </div>
          <div>
            <label className="label" htmlFor="tone">
              Tone
            </label>
            <input
              className="input"
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              onBlur={persistDraft}
              placeholder="friendly / formal / concise / persuasive"
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label className="label" htmlFor="content">
            Email Content
          </label>
          <textarea
            className="textarea"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={persistDraft}
            placeholder="Your draft content…"
          />
        </div>

        <div className="small muted" style={{ marginTop: 10 }}>
          Draft is stored locally. Generator writes here automatically.{" "}
          <Link href="/generator" className="mono" style={{ textDecoration: "underline" }}>
            Back to generator
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
