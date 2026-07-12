"use client";

import { useState } from "react";
import { usePortfolioState, usePortfolioDispatch } from "@/context/PortfolioContext";

export default function Published() {
  const state = usePortfolioState();
  const dispatch = usePortfolioDispatch();
  const [copied, setCopied] = useState(false);
  const link = `blueprint.site/portfolio/${state.slug}`;

  function copyLink() {
    if (navigator.clipboard) navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="publish-box">
      <div className="publish-icon">✓</div>
      <div className="eyebrow" style={{ justifyContent: "center" }}>
        PHASE 04 — PUBLISHED
      </div>
      <h2 style={{ fontSize: 26 }}>It&apos;s live.</h2>
      <p style={{ color: "var(--muted)", marginTop: 10, fontSize: 14 }}>
        Your portfolio is published and ready to share.
      </p>
      <div className="link-box">
        <span className="mono">{link}</span>
        <button onClick={copyLink}>{copied ? "Copied" : "Copy"}</button>
      </div>
      <div className="cta-row" style={{ justifyContent: "center", marginTop: 30 }}>
        <button className="btn ghost" onClick={() => dispatch({ type: "GO_TO", page: "final" })}>
          View portfolio
        </button>
        <button
          className="btn"
          onClick={() => {
            dispatch({ type: "RESET" });
          }}
        >
          Start a new draft
        </button>
      </div>
    </div>
  );
}
