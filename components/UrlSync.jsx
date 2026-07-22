"use client";

import { useEffect, useRef } from "react";
import { usePortfolioState, usePortfolioDispatch } from "@/context/PortfolioContext";
import {
  clearPersistedState,
  loadPersistedState,
  pageFromUrl,
  resolvePageOnRestore,
  savePersistedState,
  syncUrl,
} from "@/lib/navigation";

export default function UrlSync() {
  const state = usePortfolioState();
  const dispatch = usePortfolioDispatch();
  const hydrated = useRef(false);
  const skipUrlSync = useRef(false);

  useEffect(() => {
    const persisted = loadPersistedState();
    const urlPage = pageFromUrl();
    const page = resolvePageOnRestore(persisted, urlPage);

    if (persisted || page !== "landing") {
      dispatch({
        type: "RESTORE",
        payload: {
          ...persisted,
          page,
        },
      });
    }

    skipUrlSync.current = true;
    syncUrl(page, true);
    hydrated.current = true;
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated.current) return;
    savePersistedState(state);
  }, [state]);

  useEffect(() => {
    if (!hydrated.current) return;
    if (skipUrlSync.current) {
      skipUrlSync.current = false;
      return;
    }
    syncUrl(state.page);
  }, [state.page]);

  useEffect(() => {
    function onPopState() {
      skipUrlSync.current = true;
      dispatch({ type: "GO_TO", page: pageFromUrl() });
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [dispatch]);

  useEffect(() => {
    if (state.page === "landing" && !state.content && !state.data.name) {
      clearPersistedState();
    }
  }, [state.page, state.content, state.data.name]);                       

  return null;                         
}
