export default function TemplateTwo({ data }) {
  return (
    <div style={{ padding: 60, textAlign: "center", fontFamily: "sans-serif" }}>
      <h2>TemplateTwo (Minimal) — coming soon</h2>
      <p style={{ color: "#888" }}>Name: {data?.name || "—"}</p>
    </div>                         
  );
}