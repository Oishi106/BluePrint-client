"use client";

import { usePortfolioState, usePortfolioDispatch } from "@/context/PortfolioContext";
import BackButton from "@/components/BackButton";
import { TEMPLATES, suggestTemplate } from "@/lib/templates";

function Thumb({ t }) {
  const theme = t.layout.theme;
  const frameStyle = {
    "--p-bg": theme.primaryColor,
    "--p-surface": theme.mode === "dark" ? `color-mix(in srgb, ${theme.primaryColor} 80%, white 8%)` : "#FFFFFF",
    "--p-text": theme.mode === "dark" ? "#EAF2FB" : "#241F16",
    "--p-muted": theme.mode === "dark" ? "#8CA3C2" : "#8B8270",
    "--p-accent": theme.accentColor,
    "--p-font": theme.font,
  };

  const bgStyle = t.flavor === "glass" 
    ? { background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})` }
    : { background: frameStyle["--p-bg"] };

  return (
    <div className="tmpl-thumb" style={{ position: "relative", overflow: "hidden", ...bgStyle }}>
      <div 
        className={`portfolio-frame ${t.cls}`} 
        style={{ 
          ...frameStyle,
          position: "absolute",
          top: 0,
          left: 0,
          width: 800,
          height: 600,
          transform: "scale(0.35)",
          transformOrigin: "top left",
          padding: 32,
          boxSizing: "border-box",
          pointerEvents: "none"
        }}
      >
        <section className="p-section" style={{ padding: 0 }}>
          <header className="p-nav" style={{ marginBottom: 40, borderBottom: "none" }}>
            <div className="p-nav-mark" style={{ fontSize: 24, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "var(--p-text)", color: "var(--p-bg)" }}>JD</div>
            <div className="p-nav-links" style={{ fontSize: 20 }}>
              <span>Work</span>
              <span>About</span>
            </div>
          </header>

          <div style={{ marginBottom: 60 }}>
            <h1 style={{ fontSize: 56, lineHeight: 1.1, marginBottom: 16, color: "var(--p-text)" }}>Jane Doe</h1>
            <p style={{ fontSize: 24, color: "var(--p-muted)", maxWidth: "80%" }}>
              Crafting digital experiences with precision and intent.
            </p>
          </div>

          <div className={`p-projects ${t.layout.projects}`} style={{ display: "grid", gap: 24, gridTemplateColumns: "1fr 1fr" }}>
            {[1, 2].map((i) => (
              <div className="p-proj" key={i} style={{ background: "var(--p-surface)" }}>
                <div className="p-proj-img empty" style={{ height: 160, background: "color-mix(in srgb, var(--p-text) 10%, transparent)" }} />
                <div className="p-proj-body" style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 28, margin: 0, marginBottom: 8, color: "var(--p-text)" }}>Project {i}</h3>
                  <p style={{ fontSize: 20, color: "var(--p-muted)", margin: 0 }}>Brief layout overview.</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
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
      <div className="page-back-row">
        <BackButton label="← Back to content" />
      </div>
      <div className="eyebrow">PHASE 03A — TEMPLATE</div>
      <h2 className="headline">Pick a template</h2>
      <p className="body" style={{ color: "var(--muted)" }}>
        {TEMPLATES.length} templates, one AI pick. Suggested: &ldquo;
        {TEMPLATES.find((t) => t.id === rec)?.name}&rdquo; for a {state.data.role || "your"} role.
      </p>

      <div className="tmpl-grid">
        {TEMPLATES.map((t) => (
          <div
            key={t.id}
            role="button"
            tabIndex={0}
            className={`tmpl-card ${state.selectedTemplate === t.id ? "selected" : ""}`}
            onClick={() => dispatch({ type: "SET_TEMPLATE", id: t.id })}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                dispatch({ type: "SET_TEMPLATE", id: t.id });
              }
            }}
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
        <BackButton label="← Back to content" />
        <button className="btn small" disabled={!state.selectedTemplate} onClick={build}>
          Build portfolio →
        </button>
      </div>
    </div>
  );
}