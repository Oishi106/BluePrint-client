"use client";

import { useState } from "react";
import { usePortfolioState, usePortfolioDispatch } from "@/context/PortfolioContext";
import BackButton from "@/components/BackButton";

export default function Published() {
  const state = usePortfolioState();
  const dispatch = usePortfolioDispatch();
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = `${origin}/portfolio/${state.slug}`;

  function copyLink() {
    if (navigator.clipboard) navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="publish-box">
      <div className="page-back-row" style={{ marginBottom: 20 }}>
        <BackButton label="← Back to portfolio" />
      </div>
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
        <a className="btn ghost" href={`/portfolio/${state.slug}`} target="_blank" rel="noopener noreferrer">
          View portfolio
        </a>
        <button
          className="btn"
          onClick={() => {
            dispatch({ type: "RESET" });          
            dispatch({ type: "GO_TO", page: "landing" });
          }}
        >
          Start a new draft
        </button>                 
      </div>                         
    </div>                        
  );
}