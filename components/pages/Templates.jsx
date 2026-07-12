"use client";

import { usePortfolioState, usePortfolioDispatch } from "@/context/PortfolioContext";
import { TEMPLATES, suggestTemplate } from "@/lib/templates";

function Thumb({ t }) {
  const { primaryColor, accentColor, mode } = t.layout.theme;
  const style = { background: primaryColor };
  const textColor = mode === "dark" ? "rgba(255,255,255,.85)" : "#1a1a1a";

  switch (t.flavor) {
    case "developer":
      return (
        <div className="tmpl-thumb" style={style}>
          <div className="fake-hero mono" style={{ color: accentColor }}>$ whoami</div>
          <div
            className="fake-line w60"
            style={{ background: accentColor, opacity: 0.35, top: 60, position: "absolute", left: 12, right: 12 }}
          />
          <div
            className="fake-line w40"
            style={{ background: accentColor, opacity: 0.35, top: 76, position: "absolute", left: 12 }}
          />
        </div>
      );
    case "minimal":
      return (
        <div className="tmpl-thumb" style={style}>
          <div className="fake-c">
            <div className="fake-t" style={{ background: textColor }} />
            <div className="fake-s" style={{ background: textColor, opacity: 0.4 }} />
          </div>
        </div>
      );
    case "glass":
      return (
        <div className="tmpl-thumb" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}>
          <div className="fake-card" />
        </div>
      );
    case "creative":
      return (
        <div className="tmpl-thumb" style={style}>
          <div className="fake-block b1" style={{ background: textColor }} />
          <div className="fake-block b2" style={{ background: accentColor }} />
          <div className="fake-block b3" style={{ background: mode === "dark" ? "#fff" : "#111" }} />
        </div>
      );
    case "editorial":
      return (
        <div className="tmpl-thumb" style={style}>
          <div className="fake-editorial-line" style={{ background: textColor }} />
          <div className="fake-editorial-rule" style={{ background: accentColor }} />
        </div>
      );
    case "brutalist":
      return (
        <div className="tmpl-thumb" style={style}>
          <div
            className="fake-brutal-block"
            style={{ border: `2px solid ${textColor}`, boxShadow: `4px 4px 0 ${accentColor}` }}
          />
        </div>
      );
    default:
      return <div className="tmpl-thumb" style={style} />;
  }
}

export default function Templates() {
  const state = usePortfolioState();
  const dispatch = usePortfolioDispatch();
  const rec = suggestTemplate(state.data.role);

  function build() {
    dispatch({ type: "SET_MODE", mode: "template" });
    dispatch({ type: "GO_TO", page: "final" });
  }

  return (
    <div className="wrap">
      <div className="eyebrow">PHASE 03A — TEMPLATE</div>
      <h2 style={{ fontSize: 28 }}>Pick a template</h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 8 }}>
        {TEMPLATES.length} templates, one AI pick. Suggested: &ldquo;
        {TEMPLATES.find((t) => t.id === rec)?.name}&rdquo; for a {state.data.role || "your"} role.
      </p>

      <div className="tmpl-grid">
        {TEMPLATES.map((t) => (
          <div
            key={t.id}
            className={`tmpl-card ${state.selectedTemplate === t.id ? "selected" : ""}`}
            onClick={() => dispatch({ type: "SET_TEMPLATE", id: t.id })}
          >
            <Thumb t={t} />
            <div className="tmpl-meta">
              <h4>{t.name}</h4>
              {rec === t.id && <span className="rec-badge">RECOMMENDED</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="form-nav">
        <button className="btn ghost small" onClick={() => dispatch({ type: "GO_TO", page: "preview" })}>
          ← Back to content
        </button>
        <button className="btn small" disabled={!state.selectedTemplate} onClick={build}>
          Build portfolio →
        </button>
      </div>
    </div>
  );
}