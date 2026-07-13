"use client";

import { useEffect } from "react";
import { PortfolioProvider, usePortfolioState } from "@/context/PortfolioContext";
import Header from "@/components/Header";
import UrlSync from "@/components/UrlSync";
import Landing from "@/components/pages/Landing";
import FormWizard from "@/components/pages/FormWizard";
import Generating from "@/components/pages/Generating";
import Preview from "@/components/pages/Preview";
import Templates from "@/components/pages/Templates";
import AILayout from "@/components/pages/AILayout";
import FinalPortfolio from "@/components/pages/FinalPortfolio";
import Published from "@/components/pages/Published";

function AppShell() {
  const state = usePortfolioState();

  // Keep <html data-theme="..."> in sync so the CSS variable tokens flip.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  const pages = {
    landing: <Landing />,
    form: <FormWizard />,
    generating: <Generating />,
    preview: <Preview />,
    templates: <Templates />,
    ailayout: <AILayout />,
    final: <FinalPortfolio />,
    published: <Published />,
  };

  return (
    <div className="app">
      <div className="blueprint-grid" />
      <div className="crop tl" />
      <div className="crop tr" />
      <div className="crop bl" />
      <div className="crop br" />
      <div className="coord tl mono">FIG.01 — PORTFOLIO DRAFT</div>
      <div className="coord br mono">
        SCALE 1:1 — <span>{state.page.toUpperCase()}</span>
      </div>

      <Header />
      <UrlSync />

      {Object.entries(pages).map(([key, node]) => (
        <section key={key} className={`page ${state.page === key ? "active" : ""}`}>
          {state.page === key ? node : null}
        </section>
      ))}

      <footer className="foot">
        BLUEPRINT — DRAFTED ENTIRELY IN YOUR BROWSER · NO SERVER · NO DATA LEAVES THIS TAB
      </footer>
    </div>
  );
}

export default function PortfolioApp() {
  return (
    <PortfolioProvider>
      <AppShell />
    </PortfolioProvider>
  );
}
