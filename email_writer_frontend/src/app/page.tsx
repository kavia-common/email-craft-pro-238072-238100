import Link from "next/link";

export default function HomePage() {
  return (
    <div className="card">
      <div className="card-inner">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div>
            <h1 className="h1">AI Email Writer</h1>
            <p className="muted" style={{ marginTop: 10, maxWidth: 720 }}>
              Draft emails in different tones, polish them in the editor, and (when logged in) save
              them to your history. Retro UI. Modern workflow.
            </p>
          </div>
          <div className="badge" title="Status">
            <span>STATUS</span>
            <span className="muted">prototype</span>
          </div>
        </div>

        <hr className="hr" />

        <div className="row">
          <div className="card">
            <div className="card-inner">
              <div className="h2">1) Generate</div>
              <p className="muted" style={{ marginTop: 8 }}>
                Provide a topic, key points, and a tone. We’ll ask the backend to generate a draft.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                <Link className="btn btn-primary" href="/generator">
                  Open Generator
                </Link>
                <Link className="btn" href="/editor">
                  Go to Editor
                </Link>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-inner">
              <div className="h2">2) Save & History</div>
              <p className="muted" style={{ marginTop: 8 }}>
                Guests can generate/copy/export. Logged-in users can also save drafts and view
                history.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                <Link className="btn btn-primary" href="/auth">
                  Login / Signup
                </Link>
                <Link className="btn" href="/history">
                  View History
                </Link>
              </div>
            </div>
          </div>
        </div>

        <hr className="hr" />

        <div className="alert" style={{ marginTop: 10 }}>
          <div className="mono small">
            Note: Configure <span className="kbd">NEXT_PUBLIC_API_BASE_URL</span> to connect the UI
            to the backend.
          </div>
        </div>
      </div>
    </div>
  );
}
