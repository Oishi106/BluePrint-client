export const THEME_PRESETS = {
  slateTeal:       { mode: "dark",  primaryColor: "#0A1628", accentColor: "#5EEAD4", font: "var(--font-mono)" },
  slateGreen:      { mode: "dark",  primaryColor: "#0A1F17", accentColor: "#4ADE80", font: "var(--font-mono)" },
  violetGlass:     { mode: "dark",  primaryColor: "#151A2E", accentColor: "#9AA7FF", font: "var(--font-display)" },
  oceanGlass:      { mode: "dark",  primaryColor: "#071B2E", accentColor: "#38BDF8", font: "var(--font-display)" },
  peachPop:        { mode: "light", primaryColor: "#FDF6EC", accentColor: "#F2A65A", font: "var(--font-display)" },
  crimsonPop:      { mode: "dark",  primaryColor: "#1A0E0E", accentColor: "#F87171", font: "var(--font-display)" },
  creamMin:        { mode: "light", primaryColor: "#FAF8F3", accentColor: "#2B2B2B", font: "var(--font-body)" },
  skyMin:          { mode: "light", primaryColor: "#F0F6FF", accentColor: "#2563EB", font: "var(--font-body)" },
  clayEditorial:   { mode: "light", primaryColor: "#F6F1E7", accentColor: "#C1571F", font: "var(--font-display)" },
  forestEditorial: { mode: "dark",  primaryColor: "#0D1B12", accentColor: "#6EE7B7", font: "var(--font-display)" },
  paperBrutal:     { mode: "light", primaryColor: "#FFFFFF", accentColor: "#111111", font: "var(--font-mono)" },
  charcoalBrutal:  { mode: "dark",  primaryColor: "#111111", accentColor: "#FACC15", font: "var(--font-mono)" },
};

// Each flavor gets its own section ORDER — this is what makes templates
// structurally different from each other, not just re-colored.
const ORDER = {
  developer: ["hero", "skills", "about", "projects", "contact"],
  minimal:   ["hero", "about", "skills", "projects", "contact"],
  glass:     ["hero", "projects", "skills", "about", "contact"],
  creative:  ["hero", "projects", "about", "skills", "contact"],
  editorial: ["hero", "about", "projects", "skills", "contact"],
  brutalist: ["hero", "skills", "projects", "about", "contact"],
};

export const TEMPLATES = [
  {
    id: "developer", name: "Developer", category: "developer", flavor: "developer", cls: "tmpl-developer",
    layout: { hero: "left-image", about: "left-image", projects: "grid", skills: "percent", order: ORDER.developer, theme: THEME_PRESETS.slateTeal },
  },
  {
    id: "developer-green", name: "Terminal Green", category: "developer", flavor: "developer", cls: "tmpl-developer",
    layout: { hero: "left-image", about: "left-image", projects: "grid", skills: "percent", order: ORDER.developer, theme: THEME_PRESETS.slateGreen },
  },
  {
    id: "minimal", name: "Minimal", category: "minimal", flavor: "minimal", cls: "tmpl-minimal",
    layout: { hero: "center", about: "centered-text", projects: "grid", skills: "tags", order: ORDER.minimal, theme: THEME_PRESETS.creamMin },
  },
  {
    id: "minimal-sky", name: "Minimal Sky", category: "minimal", flavor: "minimal", cls: "tmpl-minimal",
    layout: { hero: "center", about: "centered-text", projects: "grid", skills: "tags", order: ORDER.minimal, theme: THEME_PRESETS.skyMin },
  },
  {
    id: "glass", name: "Glassmorphism", category: "designer", flavor: "glass", cls: "tmpl-glass",
    layout: { hero: "left-image", about: "right-image", projects: "masonry", skills: "cards", order: ORDER.glass, theme: THEME_PRESETS.violetGlass },
  },
  {
    id: "glass-ocean", name: "Glass Ocean", category: "designer", flavor: "glass", cls: "tmpl-glass",
    layout: { hero: "left-image", about: "right-image", projects: "masonry", skills: "cards", order: ORDER.glass, theme: THEME_PRESETS.oceanGlass },
  },
  {
    id: "creative", name: "Creative", category: "creative", flavor: "creative", cls: "tmpl-creative",
    layout: { hero: "full-bleed", about: "left-image", projects: "masonry", skills: "bars", order: ORDER.creative, theme: THEME_PRESETS.peachPop },
  },
  {
    id: "creative-crimson", name: "Creative Crimson", category: "creative", flavor: "creative", cls: "tmpl-creative",
    layout: { hero: "full-bleed", about: "left-image", projects: "masonry", skills: "bars", order: ORDER.creative, theme: THEME_PRESETS.crimsonPop },
  },
  {
    id: "editorial", name: "Editorial Warm", category: "writer", flavor: "editorial", cls: "tmpl-editorial",
    layout: { hero: "center", about: "right-image", projects: "grid", skills: "tags", order: ORDER.editorial, theme: THEME_PRESETS.clayEditorial },
  },
  {
    id: "editorial-forest", name: "Editorial Forest", category: "writer", flavor: "editorial", cls: "tmpl-editorial",
    layout: { hero: "center", about: "right-image", projects: "grid", skills: "tags", order: ORDER.editorial, theme: THEME_PRESETS.forestEditorial },
  },
  {
    id: "brutalist-paper", name: "Brutalist Paper", category: "bold", flavor: "brutalist", cls: "tmpl-brutalist",
    layout: { hero: "center", about: "centered-text", projects: "grid", skills: "bars", order: ORDER.brutalist, theme: THEME_PRESETS.paperBrutal },
  },
  {
    id: "brutalist-charcoal", name: "Brutalist Charcoal", category: "bold", flavor: "brutalist", cls: "tmpl-brutalist",
    layout: { hero: "center", about: "centered-text", projects: "grid", skills: "bars", order: ORDER.brutalist, theme: THEME_PRESETS.charcoalBrutal },
  },
];

export function suggestTemplate(role = "") {
  const r = role.toLowerCase();
  if (/design|ui|ux/.test(r)) return "glass";
  if (/dev|engineer|programmer|code/.test(r)) return "developer";
  if (/photo|art|creative/.test(r)) return "creative";
  if (/write|content|journal|editor/.test(r)) return "editorial";
  return "minimal";
}