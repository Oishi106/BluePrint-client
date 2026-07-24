export default function TemplateThree({ data }) {
  return (
    <div style={{ padding: 60, textAlign: "center", fontFamily: "sans-serif" }}>
      <h2>TemplateThree (Glassmorphism) — coming soon</h2>
      <p style={{ color: "#888" }}>Name: {data?.name || "—"}</p>
    </div>
  );
}