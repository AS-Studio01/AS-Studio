# Louis Luxury Dark & Light Visual Overhaul & Contrast Restoration Plan

Comprehensive engineering and design plan to resolve all element visibility, logo contrast, button readability, and demo card disappearance issues, extend the Louis luxury glass aesthetic (champagne gold, OxygenOS emerald, and Apple liquid glass) across the dark theme, and introduce a floating frosted glass policy compliance banner.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following design decisions were confirmed via interactive clarification and will govern the implementation:
> 
> - **Confirmed: Louis Luxury Dark Theme Aesthetic**: Deep obsidian liquid glass (`#080d0f` and `#0e161b`) accented with Parisian champagne gold specular highlights (`#e5be7a` / `#c59b4c`) and OxygenOS emerald teal halos (`#00f2fe` and `#10b981`).
> - **Confirmed: Legal Policy Notice Presentation**: A floating, non-intrusive frosted glass bottom banner with explicit "Accept & Continue" action and direct links to Privacy Policy, Terms of Service, Disclaimer, and Cancellation & Refund Policy (with persistent localStorage state).
> - **Confirmed: Contrast & Visibility Standard**: WCAG AAA high-contrast architecture with high-opacity glass backings, robust text tokens (`#f8fafc` on dark obsidian; `#0d1716` on alabaster light), resilient non-blocking content reveals (`opacity: 1` fail-safe), and high-contrast button color pairs (dark text `#041014` on bright teal/gold, and pure white `#ffffff` on deep emerald/slate).

---

## 1. Overview & Core Concept

### What It Delivers
This update resolves critical visual bugs and elevates the site's brand perception into an ultra-premium web design studio. It fixes broken contrast relationships that caused the logo, nav links, buttons, and demo cards to disappear, implements the "Louis" luxury frosted glass design system seamlessly across both **Obsidian Dark** and **Louis Alabaster Light** modes, and adds a floating frosted glass compliance notice.

### Target Audience & User Experience
Independent business owners, founders, and prospective clients seeking high-end, bespoke web design services. The experience must immediately communicate quiet authority, uncompromising craftsmanship, instantaneous speed, and effortless readability on every screen.

### Key Value
- **Zero Disappearing Elements**: Content is resiliently visible immediately upon load without relying on fragile scroll-animation states.
- **Uncompromised Contrast**: Guaranteed WCAG AAA compliance for brand wordmarks, navigation typography, buttons, and demo metadata.
- **Consistent Luxury Glass Architecture**: Both Dark and Light modes share the same Apple-grade liquid glass refraction, subtle specular rim lighting, and fluid OxygenOS glow.
- **Clear Legal Transparency**: Prominent, elegant compliance banner with direct access to all four legal documents.

---

## 2. User Experience & Visual Design

### Visual Identity & Theme System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DUAL LOUIS LUXURY THEME TOKENS                        │
├──────────────────────────────────────┬──────────────────────────────────────┤
│       OBSIDIAN LIQUID GLASS (DARK)   │      LOUIS ALABASTER GLASS (LIGHT)   │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ Canvas:      #080d0f (deep obsidian) │ Canvas:      #f9f7f2 (warm alabaster)│
│ Surface:     rgba(13,22,27,0.85)     │ Surface:     rgba(255,255,255,0.88)  │
│ Text/Ink:    #f8fafc (pure crisp)    │ Text/Ink:    #0d1716 (deep espresso) │
│ Accent:      #00f2fe & #10b981       │ Accent:      #b38332 (Parisian gold) │
│ Specular:    rgba(229,190,122,0.28)  │ Specular:    #ffffff (pearl highlight│
│ Borders:     rgba(255,255,255,0.12)  │ Borders:     rgba(20,48,45,0.12)     │
│ Blur:        blur(24px) sat(190%)    │ Blur:        blur(24px) sat(190%)    │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

### Component Styling & Contrast Hierarchy

1. **Top Bar & Brand Wordmark Contract**:
   - Single-element logo with crisp SVG mark and text in high-contrast ink (`#f8fafc` on dark obsidian glass, `#0d1716` on light alabaster glass).
   - Scrolled navigation glass matches the current active theme rather than hardcoding light beige in dark mode.
   - Distinct, interactive theme toggle capsule pill indicating active mode with tactile hover response.

2. **Button Legibility & State Pairing**:
   - Primary buttons: High-contrast pairing. In dark mode, `#00f2fe` accent is paired with deep dark ink text (`#041014`) for 11:1+ contrast, or champagne gold (`#e5be7a`) with `#0a1210`.
   - Ghost buttons: Clearly bounded hairline glass border with full opacity text matching theme ink.
   - Zero-pill discipline applied to metadata: quiet inline labels separated by typographic dots (`·`).

3. **Demo Cards & Flagship Delta.OS**:
   - High-contrast card surfaces with subtle frosted backdrops and clear text hierarchy.
   - Complete removal of restrictive `opacity: 0` blocking states from `.reveal` so demos, titles, and buttons are never invisible.
   - Interactive preview badges with solid legible backgrounds.

4. **Floating Frosted Glass Legal Policy Banner**:
   - Positioned fixed at the bottom viewport with safe-area padding (`env(safe-area-inset-bottom)`).
   - Crisp copy: *"By continuing to use our site, you accept our Privacy Policy, Terms of Service, Disclaimer, and Cancellation & Refund Policy."*
   - Active links to `/legal/privacy.html`, `/legal/terms.html`, `/legal/disclaimer.html`, and `/legal/cancellation-refund.html`.
   - High-contrast "Accept & Continue" button that dismisses the banner and saves consent in `localStorage` (`as-legal-consent: true`).
   - Also mirrors persistently in the standard quiet footer.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Robust Fail-Safe Reveal System
- **Chosen Approach**: Invert `.reveal` default opacity so content is visible by default (`opacity: 1`), and apply subtle, progressive entrance physics only when JavaScript confirms viewport intersection.
- **Why**: Eliminates blank page sections, disappearing demo cards, and hidden buttons caused by delayed IntersectionObserver triggers or script initialization lag.
- **Alternatives Considered**: Keeping `opacity: 0` with a timeout fallback (unreliable during fast scrolls or connection jitter).

### Decision 2: Theme-Aware Scrolled Navbar State
- **Chosen Approach**: Dynamically bind `.nav.solid` and `.nav.light` styles to `[data-theme="dark"]` and `[data-theme="light"]`. In dark mode, the scrolled navbar becomes high-density obsidian glass (`rgba(10, 16, 20, 0.88)` with champagne rim) instead of light cream.
- **Why**: Fixes the root cause of the disappearing logo and nav text when users scroll down on dark theme.
- **Alternatives Considered**: Forcing transparent navbar at all times (poor text contrast over complex content).

### Decision 3: Consent Persistence via `localStorage`
- **Chosen Approach**: Store legal acceptance under key `as-policy-accepted: 'v1'`. The banner appears smoothly for new visitors, and stays dismissed once accepted, with an accessible link always remaining in the footer.
- **Why**: Respects user attention while fulfilling compliance and the user's explicit placement preference.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SYSTEM ARCHITECTURE FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
        ┌───────────────────────┐             ┌───────────────────────┐
        │   HTML Head Early     │             │   CSS Design Tokens   │
        │   Theme Script        │             │   (Obsidian / Louis)  │
        │   (Zero-Flash Init)   │             │   (tokens.css)        │
        └───────────┬───────────┘             └───────────┬───────────┘
                    │                                     │
                    ▼                                     ▼
        ┌─────────────────────────────────────────────────────────────┐
        │                    SITE INTERFACE LAYOUT                    │
        │                                                             │
        │  [1. Fixed Nav: Logo Wordmark | Nav Links | Theme Toggle]   │
        │                                                             │
        │  [2. Content Body: Hero | Notebook | Demos | Delta.OS]      │
        │     - Resilient Visibility (Zero Latency Fallback)          │
        │     - WCAG AAA Contrast (Buttons, Cards & Typography)       │
        │                                                             │
        │  [3. Floating Frosted Glass Policy Banner (Dismissable)]    │
        │     - Accept & Continue Action -> Saves localStorage        │
        │     - 4 Direct Legal Document Links                         │
        │                                                             │
        │  [4. Quiet Studio Footer: Brand | Links | Legal Notices]    │
        └─────────────────────────────┬───────────────────────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │   site.js Event Runtime   │
                        │   - Theme Switcher Sync   │
                        │   - Legal Consent Manager │
                        │   - Resilient Intersection│
                        └───────────────────────────┘
```

### Component & State Mapping

1. **`tokens.css`**:
   - Fix `--ink`, `--panel`, `--accent`, `--line`, and `--sun` for both `[data-theme="dark"]` and `[data-theme="light"]`.
   - Provide distinct button contrast tokens: `--btn-bg`, `--btn-text`, `--btn-hover-bg`, `--btn-hover-text`.
   - Define Louis glass tokens for both modes (Obsidian dark glass blur and Alabaster light glass blur).

2. **`site.css`**:
   - Repair `.nav.solid` and `.nav.light` so they adapt to dark vs light theme.
   - Repair `.logo` and `.lm` SVG fills/strokes to guarantee visibility across all page states.
   - Refactor `.reveal` so text, cards, and buttons are never rendered invisible.
   - Add floating policy compliance banner styles (`.policy-banner`, `.policy-banner-content`, `.policy-btn`).
   - Clean up mobile navigation and ensure single-line controls with zero overflow.

3. **`site.js`**:
   - Wire up floating legal consent banner with smooth dismiss animation and `localStorage` persistence.
   - Sync theme switcher across all pages and update toggle labels accordingly.
   - Safeguard IntersectionObserver so elements are guaranteed visible under all conditions.

4. **HTML Files (`index.html`, `work.html`, `packages.html`, `about.html`, `contact.html`, `legal/*.html`)**:
   - Standardize `<header>` placement inside `<body>` for valid semantic DOM structure.
   - Ensure the theme toggle and floating legal banner are present and functional.

---

## 5. Verification & Testing Steps

1. **Theme Switch Verification**: Test toggling between Obsidian Dark Glass and Louis Alabaster Light Glass across all pages; verify that the logo, nav links, headings, body text, and buttons maintain crisp readability.
2. **Scrolled Navbar Test**: Scroll down on dark theme; verify that the navbar transitions to dark obsidian glass with gold rim and that the logo remains bright and legible.
3. **Visibility & Disappearance Test**: Rapidly scroll through `index.html` and `work.html`; confirm all cards, notebooks, and demos render with zero missing elements or stuck hidden states.
4. **Legal Consent Banner Test**: Verify banner appearance on first load, click through each of the 4 legal links, test the "Accept & Continue" button, verify smooth dismissal, and confirm state persistence on refresh.
5. **Applet Compilation**: Run `compile_applet` to confirm zero build errors or broken assets.
