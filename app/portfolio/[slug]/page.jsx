import PortfolioRenderer from "@/components/pages/PortfolioRenderer";
import { TEMPLATES } from "@/lib/templates";

async function fetchPortfolio(slug) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const res = await fetch(`${base}/portfolio/slug/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function PublicPortfolioPage({ params }) {
  const portfolio = await fetchPortfolio(params.slug);

  if (!portfolio) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <p>This portfolio doesn&rsquo;t exist or isn&rsquo;t published yet.</p>
      </div>
    );
  }

  let layout, flavor, frameClass;
  if (portfolio.mode === "template") {
    const t = TEMPLATES.find((t) => t.id === portfolio.selectedTemplate) || TEMPLATES[0];
    layout = t.layout;
    flavor = t.flavor;
    frameClass = t.cls;
  } else {
    layout = portfolio.layoutJson;
    flavor = "editorial";
    frameClass = "tmpl-ailayout";
  }

  return (
    <div data-theme="dark">
      <PortfolioRenderer d={portfolio.data} c={portfolio.content} layout={layout} flavor={flavor} frameClass={frameClass} />
    </div>
  );
}