const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function createPortfolio(payload) {
  return request("/portfolio", { method: "POST", body: JSON.stringify(payload) });
}

export function getPortfolio(id) {
  return request(`/portfolio/${id}`);
}

export function updatePortfolio(id, payload) {
  return request(`/portfolio/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export function generateAIContent(data) {
  return request("/portfolio/generate", { method: "POST", body: JSON.stringify({ data }) });
}

export function publishPortfolio(id, slug) {
  return request(`/portfolio/${id}/publish`, { method: "PATCH", body: JSON.stringify({ slug }) });
}

export function getPublicPortfolio(slug) {
  return request(`/portfolio/slug/${slug}`);
}