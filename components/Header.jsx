"use client";

import { usePortfolioState, usePortfolioDispatch } from "@/context/PortfolioContext";

const STAGES = [
  { id: "landing", label: "START" },
  { id: "form", label: "INPUT" },
  { id: "preview", label: "CONTENT" },
  { id: "design", label: "DESIGN" },
  { id: "final", label: "PUBLISH" },
];

function stageIndexForPage(p) {
  if (p === "landing") return 0;
  if (p === "form" || p === "generating") return 1;
  if (p === "preview") return 2;
  if (p === "templates" || p === "ailayout") return 3;
  if (p === "final" || p === "published") return 4;
  return 0;
}

export default function Header() {
  const state = usePortfolioState();
  const dispatch = usePortfolioDispatch();
  const activeIdx = stageIndexForPage(state.page);

  return (
    <header className="topbar">
      <div className="logo">
        <div className="logo-mark" />
        <div>
          <div className="logo-text">BLUEPRINT</div>
          <div className="logo-sub">AI PORTFOLIO DRAFTING TOOL</div>
        </div>
      </div>

      <div className="stage-schematic">
        {STAGES.map((s, i) => (
          <div className="stage-node" key={s.id}>
            <div
              className={`stage-dot ${i < activeIdx ? "done" : ""} ${i === activeIdx ? "active" : ""}`}
            />
            <span className="stage-label">{s.label}</span>
            {i < STAGES.length - 1 && <div className="stage-line" />}
          </div>
        ))}
      </div>

      <button
        className="theme-toggle"
        aria-label="Toggle theme"
        onClick={() => dispatch({ type: "TOGGLE_THEME" })}
      >
        <div className="knob" />
      </button>
    </header>
  );
}
