import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="card" role="alert" aria-live="assertive">
      <div className="card-inner">
        <h1 className="h1">404 – Page Not Found</h1>
        <p className="muted" style={{ marginTop: 10 }}>
          The page you’re looking for doesn’t exist.
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <Link className="btn btn-primary" href="/">
            Back Home
          </Link>
          <Link className="btn" href="/generator">
            Generator
          </Link>
        </div>
      </div>
    </div>
  );
}
