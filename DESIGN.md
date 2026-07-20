---
name: BLUEPRINT
description: AI portfolio drafting tool — precision UI for builders, runs entirely in the browser.
colors:
  # Dark theme (primary)
  navy-deep: "#0A1628"
  navy-elevated: "#0F2137"
  navy-elevated-2: "#142B45"
  amber: "#F2A65A"
  teal: "#5EEAD4"
  ink-light: "#EAF2FB"
  muted-blue: "#8CA3C2"
  border-base: "#1E3A5F"
  border-strong: "#2E5580"
  danger: "#F2735A"
  # Light theme
  warm-paper: "#F6F1E7"
  warm-surface: "#FFFFFF"
  warm-surface-2: "#FBF7EE"
  terracotta: "#C1571F"
  teal-light: "#1F7A6C"
  ink-dark: "#241F16"
  muted-warm: "#8B8270"
  danger-light: "#B23A1F"
typography:
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(38px, 6vw, 68px)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.08em"
rounded:
  none: "0px"
  xs: "3px"
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "14px"
  pill: "20px"
  full: "50%"
spacing:
  xs: "6px"
  sm: "12px"
  md: "22px"
  lg: "36px"
  xl: "60px"
  2xl: "90px"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.navy-deep}"
    rounded: "{rounded.xs}"
    padding: "13px 26px"
  button-primary-hover:
    backgroundColor: "{colors.amber}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.xs}"
    padding: "13px 26px"
  button-small:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.navy-deep}"
    rounded: "{rounded.xs}"
    padding: "9px 16px"
  input-field:
    backgroundColor: "{colors.navy-elevated}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.xs}"
    padding: "12px 14px"
  chip-tag:
    backgroundColor: "{colors.navy-elevated-2}"
    textColor: "{colors.muted-blue}"
    rounded: "{rounded.pill}"
    padding: "5px 10px"
---

# Design System: BLUEPRINT

## 1. Overview

**Creative North Star: "The Architect's Workbench"**

BLUEPRINT's visual system is what a precision drafting table would look like as software: dark, structured, technical — but inhabited. The navy-deep background reads like drafting paper in a darkened studio; the amber accent is the glow of the desk lamp falling across a schematic. Every element earns its place because drafting tools are built for focus, not decoration. The surface communicates "this is where real work happens" without needing to shout about it.

The system is committed to contrast as craft. The dark-mode base (`#0A1628`) is not "dark because tools look cool dark" — it's because junior developers are already living in dark terminals, dark editors, dark IDEs. BLUEPRINT speaks their ambient language. The light mode (`#F6F1E7`, terracotta) is not a warm-neutral default but a deliberate counterpoint: the same schematic on cream drafting paper, sunlit.

Motion is purposeful and immediate. State feedback is fast. The aesthetic signals competence — not through ornament but through *density of detail done right*: monospaced labels at 9-11px, crop marks at fixed corners, coordinate labels that flip with each page. These are not decorations; they're metadata that makes the interface feel authored, not generated.

This system explicitly rejects: generic SaaS portfolio builders (soft pastels, stock-photo heroes, rounded-to-oblivion cards); enterprise overbuilt tools (four-column nav, onboarding wizards, feature flags); and above all, the visual grammar of AI-slop generators — cream backgrounds, gradient text, glassmorphism-as-default, identical card grids, eyebrow labels on every section. BLUEPRINT generates portfolios that look human-crafted; its own interface must model that standard at all times.

**Key Characteristics:**
- Dark navy base with amber accent; teal as secondary signal color (completion, success)
- Monospace type (`JetBrains Mono`) for all labels, metadata, and structural chrome
- Sharp corners (`border-radius: 3px`) as the system default; curves only for pills and circles
- Grid backdrop and crop-mark decoration — structural, not decorative
- Motion: `cubic-bezier(.22,.9,.31,1)` — fast out, no bounce; state changes only at rest

## 2. Colors: The Blueprint Palette

Two themes share one palette arc: dark is the primary mode; light is a deliberate inversion, not an afterthought.

### Primary
- **Blueprint Navy** (`#0A1628`): The page-level background in dark mode. Deep but not black — the 22-degree blue-navy tint gives it warmth without softness. Everything else sits on this.
- **Amber Signal** (`#F2A65A`): The system's ink color — interactive primary, active state, brand accent. Appears on CTAs, active stage dots, eyebrows, form focus states. Its rarity on the dark surface is the point: amber means "this matters."
- **Blueprint Teal** (`#5EEAD4`): Secondary signal color. Used for done states (completed checklist items, completed stage dots), regen button hover, and link emphasis inside AI content. Teal signals "resolved" where amber signals "active."

### Secondary
- **Elevated Navy** (`#0F2137`): Surface elevation level 1 — cards, panels, the header backdrop. Subtle tonal lift from the deep navy base.
- **Elevated Navy 2** (`#142B45`): Surface elevation level 2 — tag pills, nested surfaces. One step further from the floor.

### Neutral
- **Blueprint White** (`#EAF2FB`): Body text in dark mode. Soft blue-white, not pure white — maintains warmth on the navy ground and hits 4.5:1 comfortably.
- **Muted Blue** (`#8CA3C2`): Secondary text, labels, disabled states, placeholder copy. Visible but deliberately subordinate. **Verify: meets 3:1 against `#0F2137` for large text; does not meet 4.5:1 for body copy — do not use for running body text.**
- **Border** (`#1E3A5F`) / **Border Strong** (`#2E5580`): Structural dividers and card edges. Never decorative stripes.
- **Danger** (`#F2735A`): Error and destructive action states only.

### Light Mode Counterparts
- **Warm Paper** (`#F6F1E7`): Light mode page background. This is NOT the AI default cream-sand; it's committed with warm terracotta intent.
- **Terracotta** (`#C1571F`): Light mode ink color — same amber role, different temperature.
- **Ink Dark** (`#241F16`): Light mode body text. Near-black with a warm cast, pairs naturally with the paper bg.
- **Teal Warm** (`#1F7A6C`): Light mode secondary signal.

### Named Rules
**The Amber Rarity Rule.** Amber (`#F2A65A` / `#C1571F`) appears on ≤15% of any given screen. CTAs, active states, focus outlines, eyebrow lines. When everything is amber, nothing is amber.

**The Muted Gray Ceiling.** Muted text (`--muted: #8CA3C2`) is for metadata labels and supporting copy only. Never use it for body prose or any text the user needs to read to complete a task. Verify contrast before applying.

## 3. Typography

**Display Font:** Space Grotesk (400, 500, 600, 700) — loaded via `next/font/google`
**Body Font:** Inter (400, 500, 600, 700) — loaded via `next/font/google`
**Label/Mono Font:** JetBrains Mono (400, 500, 600) — loaded via `next/font/google`

**Character:** Space Grotesk carries the architectural language — slight quirk in the geometric forms that reads as designed-by-a-person, not generated. Inter is invisible in the best way: maximum legibility at small sizes. JetBrains Mono is the structural chrome — every label, coordinate, and machine-state string is in mono, reinforcing that this is a tool for developers.

### Hierarchy
- **Display** (600, `clamp(38px, 6vw, 68px)`, line-height 1.02): Hero headings only. Letter-spacing `-0.01em` — tight but not cramped. `text-wrap: balance` on all display headings.
- **Headline** (600, 22-28px, line-height 1.2): Section headers, modal titles, preview section names.
- **Title** (600, 14-16px, line-height 1.3): Card titles, form step labels, template names.
- **Body** (Inter 400, 13-18px, line-height 1.6-1.7): Lead copy, form field descriptions, AI-generated content editable areas. Max line length: 65-75ch on reading surfaces.
- **Label** (JetBrains Mono 400, 9-12px, letter-spacing 0.05-0.14em, UPPERCASE): All structural metadata — stage indicators, form field labels, coordinate overlays, chip text, section eyebrows. This is the system's structural voice.

### Named Rules
**The Mono-as-Chrome Rule.** JetBrains Mono is reserved for *the interface talking about itself* — stage labels, field names, coordinate metadata, machine states, version strings. Running body copy and AI-generated content are always Inter. Mixing mono into prose signals "this is a UI label", never "this is readable content."

**The Display Ceiling Rule.** No heading exceeds `clamp(38px, 6vw, 68px)`. Letter-spacing floor at `-0.02em` for display; `-0.01em` is the system default. Anything tighter than `-0.04em` on display type makes letters touch and reads as cramped, not designed.

## 4. Elevation

BLUEPRINT uses **hybrid elevation**: tonal layering as the default; a single ambient shadow only on modals and large floating surfaces. The three navy tones (`#0A1628`, `#0F2137`, `#142B45`) form the elevation stack — surfaces are distinguished by luminance shift, not by dramatic shadows. This is appropriate for a tool-grade interface: shadows are not decoration, they answer the question "does this element float above the page?"

### Shadow Vocabulary
- **Ambient Depth** (`0 20px 60px rgba(0,0,0,.45)`): Used on the portfolio frame only — the final output preview that should feel like a document sitting on the workbench. One occurrence per page.
- **Hover Glow** (`0 10px 24px color-mix(in srgb, var(--ink) 35%, transparent)`): On primary button hover — not a shadow but a chromatic lift. Ephemeral; disappears at rest.
- **Focus Ring** (`0 0 0 3px color-mix(in srgb, var(--ink) 25%, transparent)`): Active stage dots and focused interactive elements. Ambient ring, not a hard focus outline.

### Named Rules
**The Flat-By-Default Rule.** Cards, panels, and elevated surfaces use tonal color shifts (`--bg-elev`) to indicate layering. Shadows appear only when an element genuinely floats above the page in the user's mental model (modal, final portfolio frame). Never add a shadow to a card that's flush with the page.

## 5. Components

### Buttons
- **Shape:** 3px radius (`--radius: 3px`) — intentionally sharp; deliberately not SaaS-rounded
- **Primary:** Amber fill (`#F2A65A`) + navy text (`#0A1628`), padding `13px 26px`, Space Grotesk 600 14px. Hover: `-2px` Y-translate + amber shadow glow. No `box-shadow` border; the fill IS the affordance.
- **Ghost:** Transparent background, `border: 1.5px solid var(--border-strong)`, `color: var(--text)`. Hover: border shifts to amber, text shifts to amber. Ghost button does not have a fill state — if it needs fill, it's a primary button.
- **Small:** Same as primary but `9px 16px`, 12px font. Used for inline actions (regen, add-row).
- **Disabled:** `opacity: 0.4`, `pointer-events: none`. Never shown as a separate variant; it's a state, not a variant.

**Named Rule: The Ghost Transition Rule.** Ghost buttons only shift their border and text color to amber on hover — never fill the background. A ghost button that fills on hover has become a primary button mid-interaction, which is incoherent. Keep the state progression: ghost → amber-bordered ghost → primary (when clicked).

### Inputs / Fields
- **Style:** `background: var(--bg-elev)` (elevated navy), `border: 1px solid var(--border)`, `border-radius: 3px`, `padding: 12px 14px`, Inter 400 14px.
- **Focus:** Border shifts to amber (`var(--ink)`). No outline, no box-shadow; the border shift is the signal.
- **Label:** JetBrains Mono 11px, `letter-spacing: 0.05em`, uppercase, `color: var(--muted)`. Sits above the field.
- **Textarea:** Same as text input; `min-height: 90px`, `resize: vertical`.
- **Tag input:** Inline chips + text input combination. Tags displayed as `border-radius: 14px` pills — exception to the 3px system rule because pills are a distinct semantic form.

### Cards / Containers
- **Corner Style:** 6px (`--radius` + 3px) for standard cards; 8-10px for the portfolio frame outer. Never exceeds 16px.
- **Background:** `var(--bg-elev)` for primary card surfaces; `var(--bg)` for the feature grid (flush with page, separated by border lines, not shadow).
- **Shadow Strategy:** None at rest. The portfolio-frame-outer uses `var(--shadow)` because it represents a rendered document.
- **Border:** `1px solid var(--border)` is the default card edge. `1.5px solid var(--border-strong)` for selected/active cards (template cards, choice cards).
- **Internal Padding:** `18-26px` for standard cards; `22-30px` for schematic panels.

**Named Rule: The No-Nested-Cards Rule.** Cards do not contain cards. When a card surface needs to hold sub-items, use dashed borders (`border: 1px dashed var(--border-strong)`) or divider lines. A card inside a card signals a broken information hierarchy.

### Navigation / Header
- **Style:** `position: sticky; top: 0; z-index: 40`. `backdrop-filter: blur(6px)` with 88% opacity base color — the header is glassy, but only the header.
- **Logo:** Blueprint logotype in Space Grotesk 700 15px, with JetBrains Mono 9px subtitle below. The logo-mark is a nested-square SVG icon in amber — the schematic mark of the brand.
- **Stage Schematic:** Five stage dots with connecting lines. Dots: 8px circles, amber for active (+ 3px amber ring), teal for done, border-strong for upcoming. Labels in JetBrains Mono 9px UPPERCASE, hidden on mobile.
- **Theme Toggle:** `border-radius: 20px` pill toggle (exception to 3px rule — toggle pills are a UX convention, not a brand element). Amber knob.

### Progress Rail (Form)
- **Style:** Flex row with circles and connector bars. Circles 28px diameter; bars `1px solid var(--border-strong)`.
- **States:** Active circle = amber fill; done circle = teal fill; upcoming = border-strong stroke.
- **Labels:** JetBrains Mono 10px, `letter-spacing: 0.05em`. Active label uses `var(--text)` (high contrast); all others use `var(--muted)`.

### Blueprint Grid Backdrop (Signature Component)
The defining visual of the workbench metaphor. A fixed-position two-scale CSS grid overlay — fine grid at `24×24px` in `rgba(120,175,255,0.07)`, heavy grid at `120×120px` in `rgba(120,175,255,0.14)`. Accompanied by four corner crop marks and two coordinate labels (`FIG.01 — PORTFOLIO DRAFT`, `SCALE 1:1 — [PAGE]`).

This component is **not decorative**: it communicates that the interface is a drafting tool and that the content is in-progress (like an architectural drawing, not a finished page). It is `pointer-events: none; position: fixed; z-index: 0`.

**Named Rule: The Grid-As-Context Rule.** The blueprint grid and crop marks appear only on the app shell (the drafting table). They must be absent from the generated portfolio frame (the output document). The contrast between working surface and finished output is the central user experience.

### Portfolio Output Frame (Second Surface)

BLUEPRINT renders **two distinct design surfaces**, each with its own token namespace and its own rules. Mixing them is the most common source of incorrect edits.

| Surface | CSS scope | Token prefix | Governed by |
|---|---|---|---|
| **App shell** | Everything outside `.portfolio-frame` | `--bg`, `--ink`, `--text`, `--border`, `--muted` | This DESIGN.md in full |
| **Output frame** | `.portfolio-frame` and descendants | `--p-bg`, `--p-surface`, `--p-text`, `--p-muted`, `--p-accent`, `--p-font` | The active template skin only |

The output frame is the *finished portfolio document* the user is building. It intentionally feels different from the workbench around it — that contrast is the product's core UX. The output frame's tokens are set per-template at render time via inline CSS variables; they are not part of the app shell token system.

**Named Rule: The Two-Surface Rule.** A rule in `.portfolio-frame` or any `.tmpl-*` selector is output-layer code, not app shell code. Never use a skin rule as evidence that a pattern is acceptable in the app shell. The surfaces are architecturally separate.

#### Template Skin Exception Table

Each skin is a deliberate visual language for the *user's portfolio*, not the tool itself. Every skin suspends specific app shell rules within `.portfolio-frame` scope — intentionally. These are documented exceptions, not inconsistencies to fix.

| Skin | Class | Suspended app shell rule | Why it's intentional |
|---|---|---|---|
| **Developer** | `.tmpl-developer` | `border-left: 2px solid var(--p-accent)` on `.p-proj` (side-stripe ban) | Terminal/IDE convention; the left rule reads as a code-block gutter in this context, not a decorative stripe |
| **Developer** | `.tmpl-developer` | `border-radius: 2px` on `.p-proj` (below system minimum) | Reinforces the sharp-edged, no-nonsense code editor feel |
| **Glassmorphism** | `.tmpl-glass` | Full `backdrop-filter: blur` + translucent fill on cards, nav, avatar (glassmorphism ban) | The skin *is* the glassmorphism demonstration; the user explicitly chose this aesthetic for their portfolio |
| **Glassmorphism** | `.tmpl-glass` | `border-radius: 40px` on nav, `18px` on project cards (radius ceiling) | Pill nav and large-radius cards are intrinsic to the glass aesthetic; over-rounding is correct here |
| **Creative** | `.tmpl-creative` | `border-radius: 16-20px` on cards and avatar (radius ceiling) | Expressive, rounded-block editorial feel is the Creative template's identity |
| **Creative** | `.tmpl-creative` | `box-shadow: 0 6px 0 0 color-mix(...)` on cards (shadow-on-card ban) | The coloured bottom shadow is a design element (offset block effect), not the ghost-card pattern — it's opaque and structural, not soft and ambient |
| **Editorial** | `.tmpl-editorial` | `border-top: 2px solid var(--p-accent)` on `.p-proj` (side-stripe adjacent) | Top rule on cards is a magazine typesetting convention, not a decorative side-stripe; accent is carried by the rule, not a left/right edge |
| **Brutalist** | `.tmpl-brutalist` | `border: 2px solid var(--p-text)` + `box-shadow: 5px 5px 0 var(--p-accent)` on all cards (ghost-card ban) | The hard border + offset shadow is the brutalist design language itself; it's opaque, flat, and structural — the opposite of the ambient ghost-card pattern it superficially resembles |
| **Brutalist** | `.tmpl-brutalist` | `border-radius: 0 !important` everywhere (below system minimum) | Zero radius is the defining formal rule of brutalism in this skin |
| **Minimal** | `.tmpl-minimal` | `border: none; border-bottom: 1px solid rgba(...)` on `.p-proj` (no border on cards) | Minimal template removes card boundaries entirely; items are separated by hairline rules, not boxes |

**Scope guard:** All `.tmpl-*` selectors live under `.portfolio-frame` in the DOM. None of them can accidentally affect app shell components as long as `.portfolio-frame` is a single-root element that is never an ancestor of app shell chrome. Keep it that way.

## 6. Do's and Don'ts

### Do:
- **Do** use JetBrains Mono for all structural labels, field names, stage indicators, and machine-state text. It's the voice of the interface talking about itself.
- **Do** keep amber (`#F2A65A`) rare — CTAs, active states, eyebrow lines. Its rarity is its signal value.
- **Do** use 3px radius as the default for all interactive controls. Reserve larger radii for pills (tag inputs, badges) and circles (avatars, toggles).
- **Do** use tonal elevation (color shift from `--bg` to `--bg-elev` to `--bg-elev-2`) rather than shadows to show depth.
- **Do** keep the blueprint grid and crop-mark decoration only on the app shell. The generated portfolio output must feel like a different surface.
- **Do** treat `.tmpl-*` CSS as output-layer code. When reading globals.css and encountering a skin rule that appears to violate a DESIGN.md rule (a side-stripe, glassmorphism, large radius), check the selector first — if it's scoped to `.tmpl-*`, it's a documented skin exception, not a bug.
- **Do** keep `.portfolio-frame` as a single-root DOM element that is never an ancestor of app shell chrome (header, footer, stage schematic). This is the structural guarantee that skin rules cannot bleed into the shell.
- **Do** use `backdrop-filter: blur(6px)` on the sticky header — the one location where glass is legitimate because it solves a real problem (seeing the grid behind the header as the user scrolls).
- **Do** verify that muted blue text (`#8CA3C2`) is only used for metadata labels, not body prose. It does not meet 4.5:1 for body text on `#0F2137`.
- **Do** use `text-wrap: balance` on display headings (`h1`–`h3`) to prevent orphaned words.

### Don't:
- **Don't** use gradient text (`background-clip: text` with `linear-gradient`). Never. It's the single most common AI-generated tell.
- **Don't** use glassmorphism (`backdrop-filter: blur` + translucent fill) on cards, list items, or callouts in the **app shell**. The `.tmpl-glass` skin uses it legitimately inside `.portfolio-frame` — that is a documented exception, not a precedent.
- **Don't** add new `.tmpl-*` selectors that apply outside `.portfolio-frame`. The scope guard depends on this containment; breaking it silently applies skin rules to app chrome.
- **Don't** use `border-left` or `border-right` wider than `1px` as a colored accent stripe on cards or list items. This is a banned pattern system-wide. Use a full border or a background tint instead.
- **Don't** use `border-radius` greater than `16px` on cards or section containers. `32px+` reads as over-rounded; it's the codex tell. Cards top out at 10px; the portfolio-frame-outer at 10px is the maximum.
- **Don't** pair `border: 1px solid X` with `box-shadow: 0 Npx Mpx ...` (blur ≥ 16px) on the same element. The ghost-card pattern. Pick one: border OR shadow, never both as decoration.
- **Don't** use cream, sand, beige, or warm-neutral body backgrounds as defaults (`oklch L 0.84-0.97, C < 0.06, hue 40-100`). The light mode uses `#F6F1E7` only because it's paired with terracotta — a saturated committed identity, not the AI warm-default reflex.
- **Don't** apply eyebrow labels (small all-caps tracked text, "ABOUT / FEATURES / PRICING") to every section. One system-level label role (the `.eyebrow` class) exists for deliberate emphasis. Using it on every section makes it noise.
- **Don't** design the app shell to look like a generic SaaS product builder (Wix, Squarespace, Canva aesthetic). The aesthetic gap between BLUEPRINT and those tools is a feature. If it could be mistaken for them, it's failed.
- **Don't** use sketchy SVG illustrations, `feTurbulence`/`feDisplacementMap` paper-grain filters, or hand-drawn strokes as decorative elements. These read as amateurish, not whimsical.
- **Don't** use `repeating-linear-gradient(...)` stripe backgrounds or decorative two-axis CSS grid overlays on any surface other than the Blueprint Grid Backdrop component. Those are system-reserved.
