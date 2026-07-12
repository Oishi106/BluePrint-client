# BLUEPRINT — AI Portfolio Generator (Next.js, client-only)

Same design and behavior as the single-file HTML prototype, restructured as a
real Next.js project so you can open it in VS Code.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Structure

```
app/
  layout.js        → loads Space Grotesk / Inter / JetBrains Mono via next/font, wraps <html data-theme="dark">
  globals.css       → every style from the prototype (grid backdrop, crop marks, forms, portfolio-frame, template skins)
  page.js           → renders <PortfolioApp />

components/
  PortfolioApp.jsx  → shell: decorative grid/crop marks + page switcher
  Header.jsx        → logo, stage schematic, dark/light toggle
  pages/
    Landing.jsx
    FormWizard.jsx      → 5-step form (Basics, Skills, Projects, Education, Contact)
    Generating.jsx      → animated "AI writing" checklist
    Preview.jsx         → editable AI copy, per-section regenerate
    Templates.jsx       → 4-template gallery (Developer/Minimal/Glassmorphism/Creative)
    AILayout.jsx        → style-prompt → mock layout JSON
    FinalPortfolio.jsx  → renders the finished portfolio from content + layout
    Published.jsx       → shareable link screen

context/
  PortfolioContext.js → all app state (form data, AI content, mode, template,
                         layoutJson, theme, published slug) via useReducer

lib/
  mockAI.js         → generateContent() + generateLayoutFromPrompt() — the mocked "AI".
                       Replace the body of these two functions with real fetch()
                       calls to OpenAI/Gemini later; nothing else needs to change.
  templates.js      → the 4 template presets + role → template suggestion
```

Everything runs client-side only (`"use client"` on every interactive component)
— there is no API route and no server call anywhere, matching the original
prototype. No environment variables are required.
