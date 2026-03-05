"use client";

import Link from "next/link";
import React from "react";
import { generateEmail, prettyErrorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useDraft } from "@/lib/draft";
import { copyToClipboard, downloadTxtFile } from "@/lib/exporting";

const tones = ["formal", "friendly", "concise", "persuasive"] as const;

export default function GeneratorPage() {
  const { state } = useAuth();
  const { draft, setDraft } = useDraft();

  const [topic, setTopic] = React.useState(draft?.topic || "");
  const [keyPoints, setKeyPoints] = React.useState(draft?.keyPoints || "");
  const [tone, setTone] = React.useState(draft?.tone || "friendly");

  const [subject, setSubject] = React.useState(draft?.subject || "");
  const [content, setContent] = React.useState(draft?.content || "");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (topic.trim().length < 3) {
      setError("Topic must be at least 3 characters.");
      return;
    }
    if (keyPoints.trim().length < 3) {
      setError("Key points must be at least 3 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await generateEmail(
        { topic: topic.trim(), keyPoints: keyPoints.trim(), tone },
        state.token
      );

      const nextSubject = res.subject || subject || "";
      const nextContent = res.content || "";

      setSubject(nextSubject);
      setContent(nextContent);

      setDraft({
        subject: nextSubject,
        content: nextContent,
        tone: res.tone || tone,
        topic: topic.trim(),
        keyPoints: keyPoints.trim(),
        updatedAt: Date.now(),
      });

      setNotice("Draft generated. Open the editor to refine it.");
    } catch (err) {
      setError(prettyErrorMessage(err));
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="card">
      <div className="card-inner">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 className="h1">Generator</h1>
            <p className="muted" style={{ marginTop: 8 }}>
              Generate an email draft from topic + key points + tone.
            </p>
          </div>

          <div className="badge" title="Auth">
            <span>{state.token ? "SIGNED IN" : "GUEST"}</span>
            <span className="muted">{state.user?.email || "no-save"}</span>
          </div>
        </div>

        <hr className="hr" />

        <form onSubmit={onGenerate}>
          <div className="row">
            <div>
              <label className="label" htmlFor="topic">
                Topic
              </label>
              <input
                className="input"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Follow-up after interview"
                disabled={loading}
              />
            </div>
            <div>
              <label className="label" htmlFor="tone">
                Tone
              </label>
              <select
                className="select"
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                disabled={loading}
              >
                {tones.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label className="label" htmlFor="keyPoints">
              Key Points (bullet-like text is fine)
            </label>
            <textarea
              className="textarea"
              id="keyPoints"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder="- Thank them for their time\n- Reiterate interest\n- Ask about next steps"
              disabled={loading}
            />
          </div>

          {error ? (
            <div className="alert alert-error" style={{ marginTop: 12 }}>
              {error}
            </div>
          ) : null}
          {notice ? (
            <div className="alert alert-success" style={{ marginTop: 12 }}>
              {notice}
            </div>
          ) : null}

          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <button className="btn btn-primary" disabled={loading} type="submit">
              {loading ? "Generating…" : "Generate email"}
            </button>
            <Link className="btn" href="/editor">
              Open Editor
            </Link>
          </div>
        </form>

        <hr className="hr" />

        <div className="row">
          <div>
            <label className="label" htmlFor="subject">
              Subject (optional)
            </label>
            <input
              className="input"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject line"
              disabled={loading}
            />
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "end", flexWrap: "wrap" }}>
            <button className="btn" type="button" onClick={onCopy} disabled={!content}>
              Copy
            </button>
            <button className="btn" type="button" onClick={onExport} disabled={!content}>
              Export .txt
            </button>
          </div>
        </div>

        <div style={{ marginTop: 12 }} className="codeblock" aria-label="Generated email content">
          {content ? content : "Generated content will appear here."}
        </div>

        <div className="small muted" style={{ marginTop: 10 }}>
          Any generated draft is stored locally and can be edited on the Editor page.
        </div>
      </div>
    </div>
  );
}
