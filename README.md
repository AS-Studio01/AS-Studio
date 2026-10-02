# AS Studio — Official Digital Practice Web Platform

> **"Websites that make your business easier to choose."**  
> AS Studio designs clean, fast, and mobile-first websites for local businesses, clinics, cafes, home decor ateliers, and early-stage teams worldwide.

---

## 📌 Table of Contents

- [Overview & Identity](#overview--identity)
- [Client Guarantees & Terms](#client-guarantees--terms)
- [Key Features](#key-features)
  - [1. AS Studio Helper AI](#1-as-studio-helper-ai)
  - [2. Pre-Built Inquiry Generator](#2-pre-built-inquiry-generator)
  - [3. Interactive Work & Prototype Showcase](#3-interactive-work--prototype-showcase)
  - [4. Glassmorphic Backdrop & Tap-to-Exit](#4-glassmorphic-backdrop--tap-to-exit)
  - [5. Guaranteed Landing Page Navigation](#5-guaranteed-landing-page-navigation)
- [Communication & Direct Channels](#communication--direct-channels)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Development & Deployment](#development--deployment)
- [Changelog & Updates](#changelog--updates)

---

## 🏛️ Overview & Identity

**AS Studio** is an independent digital design practice based in India, delivering bespoke web design and frontend engineering remote worldwide. 

The studio focuses on:
- **Local Clinics & Healthcare**: Transparent treatment scope, doctor credentials, and clean emergency triage.
- **Cafes, Bakeries & Roasteries**: Mobile-optimized, zero-PDF digital menus and direct reservation inquiry flows.
- **Home Decor & Architectural Ateliers**: Tactile material lookbooks, collection showcases, and bespoke inquiry cards.
- **Early-Stage Ventures**: High-converting landing pages built for speed and clarity.

---

## 🛡️ Client Guarantees & Terms

1. **100% Full Source Code Ownership**:
   - Every client receives a clean GitHub repository or production zip handover upon launch.
   - Zero proprietary builder lock-in or ongoing mandatory licensing fees.
2. **Live Smartphone Staging**:
   - Real responsive testing on client devices before launch and before final payment.
3. **Fully Negotiable Pricing**:
   - Flexible pricing structures adapted to project scope and budget—no rigid corporate minimums.
4. **Fast Turnaround Timelines**:
   - Landing Pages: **5–7 business days**
   - Redesigns: **7–12 business days**
   - Full Multi-Page Websites: **10–14 business days**
5. **30-Day Post-Launch Warranty**:
   - Complimentary bug fixes, responsive adjustments, and text updates included.

---

## 🚀 Key Features

### 1. AS Studio Helper AI
- **Instant Digital Concierge**: Floating launcher in bottom-right immediately opens a multi-turn chat interface.
- **High-Speed Sub-Second Responses**: Powered by `@google/genai` using `gemini-3.1-flash-lite` with `ThinkingLevel.MINIMAL` to eliminate reasoning latency.
- **Realistic Typing & Thinking Indicator**: Two-phase dynamic status (*"thinking..."* → *"typing..."*) with glowing wave bounce animations and smooth typewriter streaming.
- **Smart Fallback & Direct Contact Integration**: Answers questions accurately about turnaround, pricing, and process. If an inquiry requires custom specs or human founders, it renders direct 1-tap Telegram and Gmail cards.

### 2. Pre-Built Inquiry Generator
- **Conversation Synthesis (`/api/chat/generate-inquiry`)**: Analyzes multi-turn chat history to extract business focus, discussed features, negotiable budget preferences, and questions.
- **Interactive Action Card**:
  - **1-Tap Telegram Send**: Opens `t.me/AS_Studio_official01` with the inquiry pre-filled into the chat message.
  - **1-Tap Gmail Send**: Opens `mailto:asbusinessofficial01@gmail.com` with a formatted subject line and structured body.
  - **1-Tap Copy**: Instant clipboard copy with animated checkmark feedback.
  - **Fill Contact Form**: Automatically transfers the generated brief into the website's Contact page form.

### 3. Interactive Work & Prototype Showcase
Deep-dive interactive prototype modal showcasing:
- **Atelier Forma** (Home Decor & Lighting) — Material switcher, lookbook explorer, and direct quote drawer.
- **Nova Dental Studio** (Healthcare) — Cosmetic dentistry before/after comparison and appointment triage.
- **Mitti Café & Roastery** (Specialty Coffee) — Zero-PDF menu filters, origin cards, and reservation triage.

### 4. Glassmorphic Backdrop & Tap-to-Exit
- Full-screen frosted glass blur (`bg-black/65 backdrop-blur-md`) when either the **AI Chatbot** or the **Mobile Menu (Three Lines Menu)** is active.
- **Tap Anywhere to Exit**: Clicking or tapping outside the window/drawer closes it immediately.
- Keyboard accessible: <kbd>Escape</kbd> key dismisses both overlays.

### 5. Guaranteed Landing Page Navigation
- Clean React state-based routing (`home`, `work`, `services`, `process`, `contact`).
- Strict safeguard ensuring new visits or reloads always open directly on the **Home Page (Landing Page)** rather than subpages.

---

## 📬 Communication & Direct Channels

- **Telegram**: [@AS_Studio_official01](https://t.me/AS_Studio_official01) *(Fastest direct chat, < 24h replies)*
- **Gmail**: [asbusinessofficial01@gmail.com](mailto:asbusinessofficial01@gmail.com)
- **WhatsApp**: *Currently disabled and unavailable across all studio touchpoints.*

---

## 💻 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & Design** | Tailwind CSS v4, Glassmorphism, Plus Jakarta Sans |
| **Animation & Motion** | Framer Motion (`motion/react`) |
| **Icons** | Lucide React |
| **Server & API** | Node.js, Express, TSX |
| **AI Assistant** | `@google/genai` (SDK v0.1.x), `gemini-3.1-flash-lite` |

---

## 📁 Project Structure

```
├── server.ts                    # Express server, Vite middleware & AI API endpoints
├── index.html                   # HTML entry point with typography & SEO meta
├── package.json                 # Dependencies & project scripts
├── src/
│   ├── main.tsx                 # React application root
│   ├── App.tsx                  # Core state-based router & modal coordinators
│   ├── index.css                # Tailwind CSS v4 directives & glassmorphic styles
│   ├── types.ts                 # TypeScript types (Projects, Pages, Guarantees)
│   ├── constants/
│   │   └── communication.ts     # Official studio Telegram, Gmail & URL builders
│   ├── data/
│   │   └── projects.ts          # Showcase case studies data (Atelier Forma, Nova Dental, Mitti)
│   ├── components/
│   │   ├── Header.tsx           # Sticky nav with mobile drawer & blur backdrop
│   │   ├── Footer.tsx           # Studio footer with legal modals & direct channels
│   │   ├── Hero.tsx             # Hero section with guarantees strip
│   │   ├── SelectedWork.tsx     # Case studies preview cards
│   │   ├── Services.tsx         # Service packages (Landing Page, Business Site, Redesign)
│   │   ├── Process.tsx          # 4-stage delivery timeline (Audit → Staging → Launch)
│   │   ├── FAQ.tsx              # Frequently asked questions accordion
│   │   ├── FloatingCommunicationHub.tsx # 1-tap bottom-right AI launcher button
│   │   ├── StudioAIChatbot.tsx  # Concierge chat, pre-built inquiry generator & tap-to-exit
│   │   ├── ProjectModal.tsx     # Deep-dive interactive prototype modal
│   │   ├── LegalModal.tsx       # Privacy policy & terms modal
│   │   └── ScrollProgressBar.tsx # Top reading progress indicator
│   └── pages/
│       ├── HomePage.tsx         # Main Landing Page combining all studio highlights
│       ├── WorkPage.tsx         # Full work portfolio with filters
│       ├── ServicesPage.tsx     # Detailed services breakdown & pricing principles
│       ├── ProcessPage.tsx      # Step-by-step collaboration guide
│       └── ContactPage.tsx      # Project brief form with AI prefill support
```

---

## 🛠️ Development & Deployment

### Run Locally:
```bash
npm run dev
```
Starts Express on port 3000 with Vite middleware mounted.

### Build for Production:
```bash
npm run build
```

### Type Checking & Linting:
```bash
npm run lint
```

---

## 📝 Changelog & Updates

- **v1.9.0** *(Current)*:
  - **Eliminated Scroll Lag & Bloat ("Bekaar Things")**:
    - Removed `ScrollProgressBar` which ran unthrottled `scroll` listeners measuring `document.documentElement.scrollHeight` and recalculating physics springs on every scroll event, eliminating layout thrashing and forced reflows.
    - Stripped expensive per-button `backdrop-filter: blur(16px)` off all CTA and navigation buttons, replacing them with performant smoky dark CSS layers to eliminate GPU rasterization bottlenecks.
    - Removed infinite `animate-ping` keyframe loops that caused continuous compositor repaints when the page was idle.
    - Optimized rendering pipeline for smooth 60–120 FPS performance on tablets and mobile phones.
- **v1.8.0**:
  - **Dynamic Schema-Driven FAQ Component**: Upgraded `src/components/FAQ.tsx` and created `schemaFaqParser.ts` to dynamically parse and render questions and answers directly from the `FAQPage` JSON-LD schema with search, category filtering, and live Schema.org trust indicators.
  - **Modular Architecture Placeholders**: Added comprehensive, typed placeholders for **Authentication** (`auth.placeholder.ts`), **Database** (`database.placeholder.ts`), and **Gmail** (`gmail.placeholder.ts`) with documented environment variables in `.env.example`.
  - **Fixed Tablet Navigation Collision**: Resolved the layout overlap where "Digital Studio" collided with the "Home" nav link by showing the studio subtitle strictly at `xl:` (1280px+) and adjusting the tablet nav breakpoint to `lg:` (1024px+).
  - **Device Rotation & Landscape Optimization**: Optimized the entire viewport for landscape mode on tablets and mobile phones. The bottom bar, floating AI launcher, mobile drawer, hero section, and interactive modals now gracefully scale to prevent screen blocking.
- **v1.7.0**:
  - **Dynamic SEO & Agency Schema Markup**: Updated `index.html` with dynamic canonical URL resolution (`canonical`, `og:url`, `twitter:url`) and localized Schema.org structured data (JSON-LD) for `ProfessionalService`, `LocalBusiness`, and `FAQPage`.
  - **Unified & Prominent Bottom Bar**: Enlarged and consolidated the permanent bottom bar (`sticky bottom-0 z-30`) so `© 2026 AS Studio. All rights reserved.`, the consent agreement notice, and the three interactive modal links (`Terms & Conditions`, `Privacy Policy`, `Disclaimer`) are all housed together in one single, prominent, beautifully styled element across every page.
  - **Cleaned Footer Structure**: Removed duplicate footer copyright fragments to keep the design harmonious and cohesive.
- **v1.6.0**:
  - **Persistent Bottom Legal & Compliance Strip**: Added a permanent, non-collapsible bottom bar (`sticky bottom-0 z-30`) on every page with glassmorphic styling, stating: *"By continuing to browse this site or submit an inquiry, you acknowledge that you have read and agree to our Terms & Conditions, Privacy Policy, and Disclaimer."*
  - **Added Full Legal Disclaimer Modal**: Added dedicated **Disclaimer** support in `LegalModal.tsx` covering independent concept disclosures, pricing consultation scopes, and communication policies.
  - **Footer & Form Synchronization**: Integrated clickable links for Terms & Conditions, Privacy Policy, and Disclaimer across both the main footer and the Contact page submission form.
- **v1.5.0**:
  - **Subtle Cross-Fade Page Transitions**: Implemented a pure, buttery smooth cross-fade animation between pages (`opacity: 0` ↔ `1`, `duration: 0.22s`) without layout jumping or vertical shift.
  - **Fixed & Enhanced Inquiry Message Editor**: Made the pre-built inquiry card directly editable inline with a dedicated "Edit Message" / "Done" toggle and click-to-edit interface. Changes automatically update the Telegram link, Gmail draft, Copy to Clipboard, and Contact Form transfer in real time.
  - **Icon Clarification**: Replaced the Contact form pre-fill button icon from `Edit3` to `FileText` to eliminate confusion between editing the message and navigating to the form.
- **v1.4.0**:
  - Added comprehensive `README.md` tracking architecture, studio policies, and features.
  - Added full-screen glassmorphic backdrop with **Tap-to-Exit** for both AI Chat and Mobile Navigation drawer.
  - Implemented **Pre-Built Inquiry Generator**: AI analyzes the active chat and crafts a structured inquiry with 1-tap Telegram, Gmail, Copy, and Contact form pre-fill.
  - Optimized AI endpoint using `gemini-3.1-flash-lite` and `ThinkingLevel.MINIMAL` for sub-second response times.
  - Added realistic 2-phase typing indicators (*"thinking..."* → *"typing..."*) and typewriter streaming.
  - Fixed landing page routing so the app strictly loads on the Home Landing Page on open/refresh.
- **v1.3.0**:
  - Integrated 1-tap AI Helper floating button.
  - Added studio guarantees (100% source code ownership, live phone staging, negotiable pricing).
  - Clarified direct contact touchpoints (Telegram & Gmail only; WhatsApp explicitly disabled).
- **v1.2.0**:
  - Added interactive prototype showcase modal for Atelier Forma, Nova Dental, and Mitti Café.
- **v1.1.0**:
  - Multi-page navigation (Home, Work, Services, Process, Contact).
- **v1.0.0**:
  - Initial studio release.
