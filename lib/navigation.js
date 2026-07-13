export const VALID_PAGES = [
  "landing",
  "form",
  "generating",
  "preview",
  "templates",
  "ailayout",
  "final",
  "published",
];

export function isValidPage(page) {
  return VALID_PAGES.includes(page);
}

export function pageFromUrl() {
  if (typeof window === "undefined") return "landing";
  const page = new URLSearchParams(window.location.search).get("page");
  return isValidPage(page) ? page : "landing";
}

export function syncUrl(page, replace = false) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (page === "landing") {
    url.searchParams.delete("page");
  } else {
    url.searchParams.set("page", page);
  }
  const next = url.pathname + url.search + url.hash;
  const current = window.location.pathname + window.location.search + window.location.hash;
  if (next === current) return;
  if (replace) {
    window.history.replaceState({ page }, "", next);
  } else {
    window.history.pushState({ page }, "", next);
  }
}

export function getPreviousPage(page, state) {
  switch (page) {
    case "form":
      return "landing";
    case "generating":
      return "form";
    case "preview":
      return "form";
    case "templates":
      return "preview";
    case "ailayout":
      return "preview";
    case "final":
      if (state.mode === "template") return "templates";
      if (state.mode === "ai-layout") return "ailayout";
      return "preview";
    case "published":
      return "final";
    default:
      return null;
  }
}

const STORAGE_KEY = "blueprint-portfolio-state";

export function loadPersistedState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePersistedState(state) {
  if (typeof window === "undefined") return;
  const { data, content, mode, selectedTemplate, layoutJson, published, slug, portfolioId, theme, page } = state;
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        page,
        theme,
        content,
        mode,
        selectedTemplate,
        layoutJson,
        published,
        slug,
        portfolioId,
        data: { ...data, photoFile: null },
      })
    );
  } catch {
    // sessionStorage full or unavailable — ignore
  }
}

export function clearPersistedState() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function resolvePageOnRestore(persisted, urlPage) {
  let page = isValidPage(urlPage) ? urlPage : persisted?.page || "landing";

  // Don't re-run AI generation on refresh — jump to preview if content exists.
  if (page === "generating" && persisted?.content) {
    page = "preview";
  }

  return page;
}
