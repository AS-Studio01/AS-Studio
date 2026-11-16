# AS Studio Pro

Clean, security-hardened static & serverless web practice architecture for **AS Studio** (`asstudio.in`). Built with zero client-side frameworks, zero client-exposed database keys, `scrypt` + signed `HttpOnly` session cookies, clean URL rewrites, and six self-contained interactive demonstration builds.

## Architecture Overview

- **Public Pages (`/index.html`, `/packages.html`, `/work.html`, `/about.html`, `/contact.html`, `/404.html`)**: Editorial dark/light dual-theme design system driven by `/css/site.css` and `/js/boot.js` + `/js/site.js`. Zero inline scripts, zero secrets, and clean-URL navigation across every link.
- **Legal Pages (`/legal/*`)**: Privacy, Terms, Refund, and Concept Disclaimer pages rewritten to `/privacy`, `/terms`, `/refund`, `/disclaimer`.
- **Interactive Concept Commissions (`/demos/*`)**: Six working industry demos sharing `/demos/demo.css` and `/demos/demo.js`:
  - `/demos/mitti` — Café with live IST open/closed hours status and filterable INR menu
  - `/demos/rao` — Chambers with practice accordion and conflict-checked consultation slots
  - `/demos/vitalcare` — Clinic with specialist roster filtering and appointment intake
  - `/demos/atelier` — Homeware catalog with material filters and slide-over shopping bag
  - `/demos/apex` — Luxury property showcase with interactive mortgage EMI estimator
  - `/demos/delta` — B2B SaaS telemetry page with billing switcher and copyable API docs
- **Hardened Security & Serverless API (`/lib/core.js`, `/api/*`)**:
  - `GET /api/public/config`: Public package tiers, availability status, and contact metadata
  - `POST /api/public/inquiry`: CSRF origin verification, sliding-window IP rate limiting, honeypot filter, and length/schema validation
  - `POST /api/auth/login`: Constant-time `scrypt` password verification issuing HMAC-SHA256 signed `HttpOnly` cookies
  - `POST /api/auth/logout`: Clears signed session cookie
  - `GET /api/auth/me`: Session status probe
  - `GET/PATCH /api/admin/config`: Session-authenticated live configuration editing
  - `GET/PATCH /api/admin/inquiries`: Session-authenticated brief queue and workflow state updates
- **Deny-All Client Firestore Rules (`/firestore.rules`)**: Client SDK read/write operations are completely disabled (`allow read, write: if false`). Server handlers communicate with Firestore exclusively using short-lived RS256 Service Account OAuth tokens, falling back safely to `.data/store.json` in local development when Firebase credentials are unset.

## Commands

```bash
npm run dev      # Start local static + serverless API dev server on :3000
npm run serve    # Alias for local production preview on :3000
npm run hash     # Generate a salted scrypt hash for ADMIN_PASSWORD_HASH
npm run check    # Run full 147-check security, HTML, routing, and API verification suite
```

## Verification Summary

Run `npm run check` (`node tools/verify.js`) before deploying to validate file integrity, HTML5 syntax (`parse5`), zero leaked credentials, `vercel.json` rules, `firestore.rules`, cryptographic session security, and end-to-end HTTP behavior.
