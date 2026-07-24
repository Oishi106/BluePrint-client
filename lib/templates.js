export const THEME_PRESETS = {
  slateTeal:       { mode: "dark",  primaryColor: "#0A1628", accentColor: "#5EEAD4", font: "var(--font-mono)" },
  slateGreen:      { mode: "dark",  primaryColor: "#0A1F17", accentColor: "#4ADE80", font: "var(--font-mono)" },
  violetGlass:     { mode: "dark",  primaryColor: "#0F1B2E", accentColor: "#FF6B4A", font: "var(--font-display)" },
  oceanGlass:      { mode: "dark",  primaryColor: "#0B1F2A", accentColor: "#22D3EE", font: "var(--font-display)" },
  peachPop:        { mode: "light", primaryColor: "#FDF6EC", accentColor: "#F2A65A", font: "var(--font-display)" },
  crimsonPop:      { mode: "dark",  primaryColor: "#1A0E0E", accentColor: "#F87171", font: "var(--font-display)" },
  creamMin:        { mode: "light", primaryColor: "#FAF8F3", accentColor: "#2B2B2B", font: "var(--font-body)" },
  skyMin:          { mode: "light", primaryColor: "#F0F6FF", accentColor: "#2563EB", font: "var(--font-body)" },
  clayEditorial:   { mode: "light", primaryColor: "#F6F1E7", accentColor: "#C1571F", font: "var(--font-display)" },
  forestEditorial: { mode: "dark",  primaryColor: "#0D1B12", accentColor: "#6EE7B7", font: "var(--font-display)" },
  paperBrutal:     { mode: "light", primaryColor: "#FFFFFF", accentColor: "#111111", font: "var(--font-mono)" },
  charcoalBrutal:  { mode: "dark",  primaryColor: "#111111", accentColor: "#FACC15", font: "var(--font-mono)" },
  alexViolet:      { mode: "dark",  primaryColor: "#17151F", accentColor: "#A78BFA", accentColor2: "#4FD1C5", font: "var(--font-display)" },
  alexGreen:       { mode: "dark",  primaryColor: "#0F1712", accentColor: "#34D399", accentColor2: "#22D3EE", font: "var(--font-display)" },
};

const ORDER = {
  developer: ["hero", "skills", "about", "projects", "contact"],
  minimal:   ["hero", "about", "skills", "projects", "contact"],
  glass:     ["hero", "skills", "about", "projects", "contact"],
  creative:  ["hero", "projects", "about", "skills", "contact"],
  editorial: ["hero", "about", "projects", "skills", "contact"],
  brutalist: ["hero", "skills", "projects", "about", "contact"],
};

export const TEMPLATES = [
  // --- CUSTOM CODED TEMPLATES: real dedicated components, 2 color variants each ---
  {
    id: "developer", name: "Developer", category: "developer",
    custom: true, component: "TemplateOne",
    flavor: "alexdev", cls: "tmpl-developer",
    layout: { projects: "grid", order: ORDER.developer, theme: THEME_PRESETS.alexViolet },
    optionalSections: { certificates: true, achievements: true, internships: true },
  },
  {
    id: "developer-green", name: "Terminal Green", category: "developer",
    custom: true, component: "TemplateOne",
    flavor: "alexdev", cls: "tmpl-developer",
    layout: { projects: "grid", order: ORDER.developer, theme: THEME_PRESETS.alexGreen },
    optionalSections: { certificates: true, achievements: true, internships: true },
  },
  {
    id: "minimal", name: "Minimal", category: "minimal",
    custom: true, component: "TemplateTwo",
    flavor: "minimal", cls: "tmpl-minimal",
    layout: { projects: "rows", order: ORDER.minimal, theme: THEME_PRESETS.creamMin },
    optionalSections: { certificates: true, achievements: true, internships: true },
  },
  {
    id: "minimal-sky", name: "Minimal Sky", category: "minimal",
    custom: true, component: "TemplateTwo",
    flavor: "minimal", cls: "tmpl-minimal",
    layout: { projects: "rows", order: ORDER.minimal, theme: THEME_PRESETS.skyMin },
    optionalSections: { certificates: true, achievements: true, internships: true },
  },
  {
    id: "glass", name: "Glassmorphism", category: "designer",
    custom: true, component: "TemplateThree",
    flavor: "glass", cls: "tmpl-glass",
    layout: { projects: "rows", order: ORDER.glass, theme: THEME_PRESETS.violetGlass },
    optionalSections: { certificates: true, achievements: true, internships: true },
  },
  {
    id: "glass-ocean", name: "Glass Ocean", category: "designer",
    custom: true, component: "TemplateThree",
    flavor: "glass", cls: "tmpl-glass",
    layout: { projects: "rows", order: ORDER.glass, theme: THEME_PRESETS.oceanGlass },
    optionalSections: { certificates: true, achievements: true, internships: true },
  },
  // --- END CUSTOM ---

  // --- pure flavor/theme-system templates (unchanged) ---
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