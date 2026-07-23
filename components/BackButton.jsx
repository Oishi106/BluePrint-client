"use client";

import { usePortfolioState, usePortfolioDispatch } from "@/context/PortfolioContext";
import { getPreviousPage } from "@/lib/navigation";

export default function BackButton({ label = "← Back", className = "" }) {
  const state = usePortfolioState();
  const dispatch = usePortfolioDispatch();
  const prev = getPreviousPage(state.page, state);          

  if (!prev) return null;                                

  return (
    <button
      type="button"
      className={`page-back-btn btn ghost small ${className}`.trim()}
      onClick={() => dispatch({ type: "GO_TO", page: prev })}
    >
      {label}
    </button>
  );
}
