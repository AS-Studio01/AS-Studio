# Implementation Plan: Clean URLs & 403 Forbidden Resolution

## Objectives
1. Eliminate all `.html` extensions and physical folder names from browser URLs across all studio pages, legal docs, concept demos, and admin dashboard.
2. Fix the **403 Forbidden / No Page Found** error when clicking links in the mobile or desktop navigation menu.
3. Provide seamless HTTP 301 redirects for any incoming request containing `.html` extensions or legacy paths to the clean canonical route.
4. Replace all internal anchor tags (`href`) across the codebase with root-relative clean paths.
5. Enforce client-side address bar normalization via synchronous `<head>` script, `history.replaceState`, and click interception so navigation remains clean.

## Completed Tasks
- [x] **Resolution of 403 Forbidden & Routing Overrides (`server.js`)**:
  - Added `app.set("trust proxy", true)` to ensure Cloud Run / Nginx reverse proxy headers are honored without redirect loops or proxy rejections.
  - Set `{ index: false }` on all static directory mounts (`/work`, `/demos`, `/legal`, `/assets`, `/x7q2m9r4v8k1p6z3`) preventing directory listing collisions that triggered 403 Forbidden.
  - Implemented `resolveHtmlFile()` helper supporting both dev environment and production `dist/` directory outputs.
  - Added explicit routes with and without trailing slash (`/work`, `/work/`, `/packages`, `/packages/`, `/about`, `/about/`, `/contact`, `/contact/`, `/privacy`, `/terms`, `/disclaimer`, `/refund`, `/admin`).
  - Added dynamic case study route `/work/:caseStudy` serving all 7 case studies (`as-studio`, `mitti-cafe`, `apex-residences`, `atelier-north`, `fold-atelier`, `rao-law`, `vitalcare`).
  - Added branded 404 handler sending `404.html` with status 404 for unmapped paths.
- [x] **Server-side 301 Redirect Middleware (`server.js`)**:
  - `/packages.html` -> 301 to `/packages`
  - `/work.html` -> 301 to `/work`
  - `/about.html` -> 301 to `/about`
  - `/contact.html` -> 301 to `/contact`
  - `/legal/privacy.html` -> 301 to `/privacy`
  - `/legal/terms.html` -> 301 to `/terms`
  - `/legal/disclaimer.html` -> 301 to `/disclaimer`
  - `/legal/cancellation-refund.html` -> 301 to `/refund`
  - `/work/*.html` -> 301 to `/work/*`
  - `/demos/*` (all 7 demos and subpages) -> 301 to clean URLs (`/vitalcare`, `/mitti`, `/fold`, `/atelier`, `/apex`, `/rao`, `/delta`)
  - Any remaining `/*.html` -> 301 to `/*`
- [x] **Client-Side Menu & Navigation Fixes (`js/site.js` & HTML)**:
  - Fixed mobile menu dynamic Home link generation in `js/site.js` to point to `/` instead of `../index.html`.
  - Updated legal policy banner to point to clean URLs (`/privacy`, `/terms`, `/disclaimer`, `/refund`).
  - Injected early synchronous clean-URL script in `<head>` of `index.html`, `packages.html`, `work.html`, `about.html`, `contact.html`, and `404.html` to eliminate address bar flash.
  - Implemented active link pre-cleaning and click interception preventing default on `.html` links and redirecting to clean routes directly.
- [x] **Vite Build Configuration (`vite.config.js`) & `sitemap.xml`**:
  - Updated Rollup inputs to include all case studies and demo subpages.
  - Replaced all legacy `.html` loc entries in `sitemap.xml` with clean URLs.
- [x] **Verification**:
  - Tested all endpoints with curl: all return `200 OK` or `301 Moved Permanently` (zero 403 Forbidden).
  - Dev server restarted and build compilation succeeded with 0 errors.
