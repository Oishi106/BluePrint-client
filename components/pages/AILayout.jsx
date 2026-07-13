"use client";

import { useState } from "react";
import { usePortfolioState, usePortfolioDispatch } from "@/context/PortfolioContext";
import BackButton from "@/components/BackButton";
import { generateLayoutFromPrompt } from "@/lib/mockAI";

const QUICK_STYLES = [
  { label: "futuristic, neon", value: "futuristic with neon colors" },
  { label: "Apple-style minimal", value: "Apple-style minimal" },
  { label: "frosted glass", value: "frosted glass, dreamy" },
  { label: "warm & earthy", value: "warm terracotta, earthy" },
];

export default function AILayout() {
  const state = usePortfolioState();
  const dispatch = usePortfolioDispatch();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  function runGenerate(text) {
    const value = (text ?? prompt).trim();
    if (!value) return;
    setGenerating(true);
    setTimeout(() => {
      const layout = generateLayoutFromPrompt(value);
      dispatch({ type: "SET_LAYOUT", layout });
      setGenerating(false);
    }, 700);
  }

  function quickStyle(value) {
    setPrompt(value);
    runGenerate(value);
  }

  function build() {
    dispatch({ type: "SET_MODE", mode: "ai-layout" });
    dispatch({ type: "GO_TO", page: "final" });
  }

  const layout = state.layoutJson;

  return (
    <div className="wrap" style={{ maxWidth: 700 }}>
      <div className="page-back-row">
        <BackButton label="← Back to content" />
      </div>
      <div className="eyebrow">PHASE 03B — AI LAYOUT</div>
      <h2 style={{ fontSize: 28 }}>Describe a style</h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 8 }}>
        One line is enough. AI maps it to a hero, about, project and skills arrangement, plus a color theme.
      </p>

      <div className="style-input-box">
        <input
          type="text"
          placeholder="e.g. futuristic with neon colors, Apple-style minimal, frosted glass…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runGenerate()}
        />
        <button className="btn" onClick={() => runGenerate()}>
          {generating ? "Generating…" : "Generate"}
        </button>
      </div>

      <div className="style-chips">
        {QUICK_STYLES.map((s) => (
          <button className="style-chip" key={s.label} onClick={() => quickStyle(s.value)}>
            {s.label}
          </button>
        ))}
      </div>

      {layout && (
        <div className="layout-json-preview">
          <div className="kv">
            <span className="k">hero</span>
            <span className="v">{layout.hero}</span>
          </div>
          <div className="kv">
            <span className="k">about</span>
            <span className="v">{layout.about}</span>
          </div>
          <div className="kv">
            <span className="k">projects</span>
            <span className="v">{layout.projects}</span>
          </div>
          <div className="kv">
            <span className="k">skills</span>
            <span className="v">{layout.skills}</span>
          </div>
          <div className="kv">
            <span className="k">theme.mode</span>
            <span className="v">{layout.theme.mode}</span>
          </div>
          <div className="kv">
            <span className="k">theme.accentColor</span>
            <span className="v">
              <span className="swatch" style={{ background: layout.theme.accentColor }} />
              {layout.theme.accentColor}
            </span>
          </div>
          <div className="kv">
            <span className="k">theme.font</span>
            <span className="v">{layout.theme.font}</span>
          </div>
        </div>
      )}

      <div className="form-nav">
        <BackButton label="← Back to content" />
        <button className="btn small" disabled={!layout} onClick={build}>
          Build portfolio →
        </button>
      </div>
    </div>
  );
}
