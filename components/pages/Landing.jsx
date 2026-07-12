"use client";

import { usePortfolioDispatch } from "@/context/PortfolioContext";

export default function Landing() {
  const dispatch = usePortfolioDispatch();

  return (
    <div className="hero-land">
      
      <div className="eyebrow">PHASE 00 — START A NEW DRAFT</div>
      <h1>Your portfolio, <em>drafted</em> before you finish your coffee.</h1>
      <p className="lead">
        Answer a few questions, let AI write the words, then pick a template or describe a style and
        let AI arrange the layout. Everything happens right here in your browser.
      </p>
      <div className="cta-row">
        <button className="btn" onClick={() => dispatch({ type: "GO_TO", page: "form" })}>
          Start drafting →
        </button>
        <button
          className="btn ghost"
          onClick={() =>
            document.getElementById("howItWorks")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          See how it works
        </button>
      </div>

      <div className="schematic-panel" id="howItWorks">
        <span className="tag mono" style={{ color: "var(--muted)", fontSize: "10px" }}>
          SCHEMATIC — BUILD SEQUENCE
        </span>
        <div className="eyebrow" style={{ marginBottom: 0 }}>
          4-stage process
        </div>
        <div className="schem-row">
          <div className="schem-block">
            <div className="num mono">01</div>
            <h4>Input</h4>
            <p>Name, role, bio, skills, projects, education, contact.</p>
          </div>
          <div className="schem-arrow">→</div>
          <div className="schem-block">
            <div className="num mono">02</div>
            <h4>AI Content</h4>
            <p>Tagline, about-me, skills copy and project write-ups, generated and editable.</p>
          </div>
          <div className="schem-arrow">→</div>
          <div className="schem-block">
            <div className="num mono">03</div>
            <h4>Design</h4>
            <p>Pick one of 4 templates, or describe a style and let AI arrange the layout.</p>
          </div>
          <div className="schem-arrow">→</div>
          <div className="schem-block">
            <div className="num mono">04</div>
            <h4>Publish</h4>
            <p>Get a shareable link to your finished, public portfolio page.</p>
          </div>
        </div>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <div className="fnum mono">A</div>
          <h4>Two design paths</h4>
          <p>
            Choose a hand-picked template, or hand the layout decision to AI with a one-line style
            prompt like &ldquo;futuristic, neon colors.&rdquo;
          </p>
        </div>
        <div className="feature-card">
          <div className="fnum mono">B</div>
          <h4>Editable AI copy</h4>
          <p>
            Every generated section — tagline, about me, project write-ups — can be regenerated
            individually or edited by hand.
          </p>
        </div>
        <div className="feature-card">
          <div className="fnum mono">C</div>
          <h4>Composable layouts</h4>
          <p>
            A small set of hero, about, project and skill variants recombine into many distinct-looking
            portfolios.
          </p>
        </div>
      </div>
    </div>
  );
}
