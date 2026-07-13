"use client";

import { useEffect, useState, useRef } from "react";
import { usePortfolioState, usePortfolioDispatch } from "@/context/PortfolioContext";
import BackButton from "@/components/BackButton";
import { generateContent as generateContentMock } from "@/lib/mockAI";
import { generateAIContent, createPortfolio } from "@/lib/api";

const GEN_STEPS = [
  "Reading your input",
  "Drafting tagline & hero line",
  "Writing about-me section",
  "Describing your skills",
  "Writing project summaries",
  "Saving your draft",
];

export default function Generating() {
  const state = usePortfolioState();
  const dispatch = usePortfolioDispatch();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [errorMsg, setErrorMsg] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // avoid double-run under React StrictMode
    ran.current = true;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run() {
    // Animate through the first steps while the real AI call is in flight —
    // both run in parallel, so the checklist doesn't just freeze for 15s.
    let i = 0;
    const stepTimer = setInterval(() => {
      if (i < GEN_STEPS.length - 2) {
        setActiveIndex(i);
        i++;
      }
    }, 500);

    let content;
    try {
      const res = await generateAIContent(state.data);
      content = res.content;
    } catch (err) {
      console.error("AI generation failed, falling back to mock content:", err);
      setErrorMsg("AI service is slow or unavailable — used a local draft instead.");
      content = generateContentMock(state.data);
    }

    clearInterval(stepTimer);
    setActiveIndex(GEN_STEPS.length - 2); // "Writing project summaries" done

    setActiveIndex(GEN_STEPS.length - 1); // "Saving your draft"
    try {
      const saved = await createPortfolio({
        data: state.data,
        content,
        mode: state.mode || "template",
        selectedTemplate: state.selectedTemplate,
        layoutJson: state.layoutJson,
      });
      dispatch({ type: "SET_CONTENT", content });
      dispatch({ type: "SET_PORTFOLIO_ID", id: saved._id });
    } catch (err) {
      console.error("Failed to save portfolio:", err);
      setErrorMsg((prev) => prev || "Couldn't reach the server — continuing with a local draft.");
      dispatch({ type: "SET_CONTENT", content });
    }

    setTimeout(() => dispatch({ type: "GO_TO", page: "preview" }), 500);
  }

  return (
    <div className="gen-wrap">
      <div className="page-back-row" style={{ position: "absolute", top: 24, left: 24 }}>
        <BackButton label="← Back to form" />
      </div>
      <div className="gen-ring">
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border)" strokeWidth="3" />
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="3"
            strokeDasharray="60 200"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="eyebrow" style={{ justifyContent: "center" }}>
        PHASE 02 — AI CONTENT GENERATION
      </div>
      <h2 style={{ fontSize: 22 }}>Writing your portfolio copy…</h2>
      <p style={{ color: "var(--muted)", fontSize: 12.5, marginTop: 6 }}>
        This can take up to 15–20 seconds — Gemini is writing from scratch.
      </p>

      <div className="gen-checklist">
        {GEN_STEPS.map((s, i) => {
          const cls = `gen-item ${i < activeIndex ? "done" : ""} ${i === activeIndex ? "active" : ""}`;
          return (
            <div className={cls} key={s}>
              <div className="chk" />
              <span>{s}</span>
            </div>
          );
        })}
      </div>

      {errorMsg && (
        <p style={{ marginTop: 20, fontSize: 12.5, color: "var(--danger)", fontFamily: "var(--font-mono)" }}>
          {errorMsg}
        </p>
      )}
    </div>
  );
}