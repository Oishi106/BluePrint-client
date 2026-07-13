"use client";

import { usePortfolioState, usePortfolioDispatch } from "@/context/PortfolioContext";
import BackButton from "@/components/BackButton";

export default function Preview() {
  const state = usePortfolioState();
  const dispatch = usePortfolioDispatch();
  const c = state.content;

  if (!c) {
    return (
      <div className="wrap">
        <div className="page-back-row">
          <BackButton label="← Back to form" />
        </div>
        <p style={{ color: "var(--muted)" }}>No draft yet — go back and fill out the form.</p>
      </div>
    );
  }

  function regenerate(field) {
    dispatch({ type: "REGENERATE_FIELD", field });
  }

  return (
    <div className="wrap" style={{ maxWidth: 760 }}>
      <div className="page-back-row">
        <BackButton label="← Back to form" />
      </div>
      <div className="eyebrow">PHASE 02 — REVIEW &amp; EDIT</div>
      <h2 style={{ fontSize: 28, marginBottom: 8 }}>Your AI-generated draft</h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 34 }}>
        Edit anything by hand, or regenerate a single section.
      </p>

      <div className="preview-section">
        <div className="ps-head">
          <span className="tag-lbl mono">TAGLINE</span>
          <button className="regen-btn" onClick={() => regenerate("tagline")}>
            ↻ Regenerate
          </button>
        </div>
        <textarea
          className="editable"
          rows={1}
          value={c.tagline}
          onChange={(e) => dispatch({ type: "UPDATE_CONTENT_FIELD", field: "tagline", value: e.target.value })}
        />
      </div>

      <div className="preview-section">
        <div className="ps-head">
          <span className="tag-lbl mono">HERO TEXT</span>
          <button className="regen-btn" onClick={() => regenerate("heroText")}>
            ↻ Regenerate
          </button>
        </div>
        <textarea
          className="editable"
          rows={2}
          value={c.heroText}
          onChange={(e) => dispatch({ type: "UPDATE_CONTENT_FIELD", field: "heroText", value: e.target.value })}
        />
      </div>

      <div className="preview-section">
        <div className="ps-head">
          <span className="tag-lbl mono">ABOUT ME</span>
          <button className="regen-btn" onClick={() => regenerate("aboutMe")}>
            ↻ Regenerate
          </button>
        </div>
        <textarea
          className="editable"
          rows={4}
          value={c.aboutMe}
          onChange={(e) => dispatch({ type: "UPDATE_CONTENT_FIELD", field: "aboutMe", value: e.target.value })}
        />
      </div>

      <div className="preview-section">
        <div className="ps-head">
          <span className="tag-lbl mono">SKILLS DESCRIPTION</span>
          <button className="regen-btn" onClick={() => regenerate("skillsDescription")}>
            ↻ Regenerate
          </button>
        </div>
        <textarea
          className="editable"
          rows={2}
          value={c.skillsDescription}
          onChange={(e) =>
            dispatch({ type: "UPDATE_CONTENT_FIELD", field: "skillsDescription", value: e.target.value })
          }
        />
      </div>

      <div className="preview-section">
        <div className="ps-head">
          <span className="tag-lbl mono">PROJECT DESCRIPTIONS</span>
          <button className="regen-btn" onClick={() => regenerate("projectDescriptions")}>
            ↻ Regenerate all
          </button>
        </div>
        {c.projectDescriptions.length ? (
          c.projectDescriptions.map((p, i) => (
            <div className="proj-mini" key={i}>
              <h5>{p.title}</h5>
              <textarea
                className="editable"
                rows={2}
                value={p.description}
                onChange={(e) => dispatch({ type: "UPDATE_PROJECT_DESC", index: i, value: e.target.value })}
              />
              <div className="chips">
                {p.techStack.map((t, ti) => (
                  <span className="chip" key={ti}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "var(--muted)", fontSize: 13 }}>No projects added yet.</p>
        )}
      </div>

      <div className="choose-design">
        <div className="eyebrow" style={{ justifyContent: "center" }}>
          PHASE 03 — DESIGN
        </div>
        <h3>Now, how should it look?</h3>
        <p>Both paths use your content above — pick a hand-picked template, or describe a style and let AI arrange it.</p>
        <div className="choose-btns">
          <button className="choice-card" onClick={() => dispatch({ type: "GO_TO", page: "templates" })}>
            <div className="cnum mono">OPTION 01</div>
            <h4>Pick a template</h4>
            <p>Choose from 4 hand-built styles: Developer, Minimal, Glassmorphism, Creative.</p>
          </button>
          <button className="choice-card" onClick={() => dispatch({ type: "GO_TO", page: "ailayout" })}>
            <div className="cnum mono">OPTION 02</div>
            <h4>Let AI design the layout</h4>
            <p>Describe a mood or style in one line — AI picks the arrangement and palette.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
