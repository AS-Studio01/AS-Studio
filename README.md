# AS Studio — rebuilt, front to back

A complete rebuild of the AS Studio site: static frontend **plus** a real server
layer for auth, configuration and contact submissions.

The previous version was a set of static HTML files with a live Firestore
database that any visitor could read **and write**. This version closes that,
moves every secret off the client, and keeps the design language intact.

---

## What changed, in one table

| Concern | Before | Now |
|---|---|---|
| Public config | Hard-coded in HTML + **world-writable** Firestore doc | Held in `api/public/config.js`, optional signed Redis override |
| Admin access | A hidden URL (`/x7q2m9r4v8k1p6z3`) | Real login: scrypt password + rate limit + signed session cookie |
| Firestore key in browser | Yes — full web API key shipped in `js/firebase.js` | **No.** No Firebase code reaches the browser at all |
| Firestore rules | `site_settings` open to read **and write** | `allow read, write: if false` for every client |
| Contact form | Wrote directly from the browser | `POST /api/public/inquiry` → validated, rate-limited, server writes |
| Refund policy | 404 — did not exist | `/legal/refund` with real, specific terms |
| Mobile clipping | Constellation card cut off the $600 node | SVG owns its ratio; verified 320→1920px |
| Content without JS | Reveal animations could hide everything | Visible by default; animation is opt-in |

---

## Architecture

```
as-studio-pro/
├── index.html  packages.html  work.html  about.html  contact.html
├── admin.html                      ← the private console
├── 404.html
├── legal/
│   ├── privacy.html  terms.html  refund.html  disclaimer.html
├── demos/                          ← six complete concept sites
│   ├── index.html                  ← the gallery
│   ├── demo.css  demo.js           ← shared demo layer
│   ├── mitti.html                  ← café: live hours, filtered menu
│   ├── rao.html                    ← chambers: accordion, slot picker
│   ├── vitalcare.html              ← clinic: roster, validated booking
│   ├── atelier.html                ← homeware: cart drawer, swatches
│   ├── apex.html                   ← property: filters, EMI calculator
│   └── delta.html                  ← SaaS: billing toggle, API docs
├── css/
│   ├── site.css                    ← public design system
│   └── admin.css                   ← console only
├── js/
│   ├── boot.js                     ← pre-paint, tiny, no secrets
│   ├── site.js                     ← menu, reveal, form, config render
│   └── admin.js                    ← console UI (no secrets, no access logic)
├── api/
│   ├── public/
│   │   ├── config.js               ← GET public config
│   │   └── inquiry.js              ← POST validated brief
│   ├── auth/
│   │   ├── login.js                ← POST → signed cookie
│   │   ├── logout.js               ← POST → clear
│   │   └── me.js                   ← GET session probe
│   └── admin/
│       ├── config.js               ← GET/PATCH config (session required)
│       └── inquiries.js            ← GET queue (session required)
├── lib/core.js                     ← all security primitives
├── tools/
│   ├── hash-password.js            ← generate ADMIN_PASSWORD_HASH
│   └── dev-server.js               ← run the real API locally
├── firestore.rules                 ← deny-all for clients
├── vercel.json                     ← CSP, HSTS, headers, rewrites
├── robots.txt  sitemap.xml
└── .env.example
```

### The rule that makes it safe

**Nothing in the browser decides anything.**

`js/site.js` and `js/admin.js` are ordinary files a visitor can edit, delete or
rewrite in devtools. It changes nothing, because:

- the prices come from the server on every load
- the admin dashboard is only reachable with a `HttpOnly` cookie the browser's
  own JavaScript cannot read
- the form's success or failure is decided by the server

You can prove this yourself: open `/admin`, delete every `<script>` tag, then
call `fetch('/api/admin/config')`. The answer is `401`.

---

## Local setup

```bash
cd as-studio-pro
cp .env.example .env
node tools/hash-password.js        # paste the output into ADMIN_PASSWORD_HASH
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
                                   # paste into ADMIN_SESSION_SECRET

node tools/dev-server.js           # → http://localhost:3000
```

The site works immediately with no database. The contact form returns a clear
"please email us" message until you configure a storage sink.

### Enabling the contact form

Two independent options — configure either or both:

**Option A — Upstash Redis (fastest, free tier)**
1. Create a database at upstash.com
2. Copy the REST URL and token into `.env`
3. Inquiries appear in the admin console's Inquiries tab

**Option B — Firestore**
1. Firebase Console → Project Settings → Service Accounts → Generate key
2. Paste the JSON into `FIREBASE_SERVICE_ACCOUNT` in `.env`
3. Inquiries are written with the Admin SDK, which bypasses security rules

Either way, **the browser never sees a credential**.

### Deploying

```bash
npm i -g vercel
vercel
```

Then add the same variables in Vercel → Settings → Environment Variables,
and add your production domain to `ADMIN_EMAIL`-adjacent CORS if needed.

---

## Verifying the security claims

Run these after deploying. Each should fail or return 403.

```bash
# 1. Admin API must refuse an anonymous caller
curl -i https://your-site.vercel.app/api/admin/config
# expect: 401

# 2. Firestore must refuse a public read
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://firestore.googleapis.com/v1/projects/PROJECT/databases/(default)/documents/site_settings/main?key=YOUR_WEB_KEY"
# expect: 403

# 3. Firestore must refuse a public write
curl -s -o /dev/null -w "%{http_code}\n" -X PATCH \
  "https://firestore.googleapis.com/v1/projects/PROJECT/databases/(default)/documents/site_settings/main?key=YOUR_WEB_KEY&updateMask.fieldPaths=probe" \
  -H "Content-Type: application/json" -d '{"fields":{"probe":{"stringValue":"x"}}}'
# expect: 403   (this returned 200 before the fix)

# 4. No key in the shipped JavaScript
curl -s https://your-site.vercel.app/js/site.js | grep -c "AIza" ; # expect 0

# 5. Login must rate-limit
for i in $(seq 1 9); do
  curl -s -o /dev/null -w "%{http_code} " -X POST \
    https://your-site.vercel.app/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"a@b.c","password":"wrong"}'
done; echo
# expect a 429 within the first 9 attempts
```

---

## Test results

One command runs everything:

```bash
node tools/verify.js
```

```
✓ ALL 147 CHECKS PASSED
```

It boots its own servers on spare ports, so it never fights a dev server.

### What the 147 checks cover

| Group | Checks |
|---|---|
| File integrity, JS syntax | 30 files present, every `.js` parses |
| Demo sites (static) | 7 pages exist, one h1 each, noindex, links resolve, work.html links all six |
| SEO + crawl files | robots.txt blocks demos + admin, sitemap.xml valid, every url on disk |
| Secret leaks | 8 patterns scanned across all browser-served files |
| Firestore rules | single declaration, deny-all, no `if true` |
| Vercel config | 7 security headers, CSP directives, no inline script, rewrite targets exist |
| HTML structure | h1 count, lang, title, viewport, description, no inline JS, no duplicate ids |
| Form accessibility | every field labelled, honeypot present |
| Public API | config shape, no secrets in payload, 405 + Allow header |
| Authentication | 401s, identical errors for unknown vs. wrong (no enumeration), cookie flags |
| Session enforcement | no cookie, forged cookie, empty cookie, expired token |
| Admin authorisation | 401 on every route, effective config returned |
| Input validation | negative/zero/absurd/fractional prices, 5 URL schemes, invalid email/status |
| Public inquiry | per-field 422s, honeypot, XSS input, method restriction |
| Rate limiting | login blocked within 10 attempts |
| Static routing | 10 routes 200, 404 page, path traversal blocked |
| Contrast | every text node on 6 pages computed against its real background |
| Tap targets | every interactive element ≥ 44×44 on 6 pages |
| Layout | 8 widths, no overflow, constellation intact |
| Admin panel | locked → login → config pre-filled → both tabs → logout re-locks |
| No-JS | all sections render without JavaScript |
| Demo sites (rendered) | 7 pages 200, no overflow at 390/1280, no JS errors |
| Demo interactions | live hours, menu filter, accordion, booking validation, cart drawer, EMI, billing toggle |

### Separate browser audit — axe-core

```
✓ 0 axe-core violations across 11 pages × 2 viewports
✓ 0 violations in the logged-in admin console (both tabs)
✓ 0 violations across 7 demo pages × 2 viewports
```

Run with `node ../audit/axe.js` (needs `npm i axe-core`).

### Performance (measured, iPhone 12 viewport)

| Metric | Result |
|---|---|
| First Contentful Paint | **211 ms** |
| DOMContentLoaded | 182 ms |
| Cumulative Layout Shift | **0.0000** |
| Requests / transfer | 5 / **43 KB** |
| 200% zoom reflow | no horizontal overflow |
| Long unicode input | no overflow |

### The mobile bug

The constellation card is checked at 320 / 375 / 390 / 414 / 768 / 1024 / 1440 /
1920 px in the automated suite, and separately at 17 widths in
`../audit/clip-test.js`:

```
all widths → constellationNodes=8/8  ✓
```

All eight text nodes — including `$600` and `SIGNATURE` — stay inside the card
at every width. The fix is structural: the SVG declares its own `viewBox` and
renders at `width: 100%; height: auto`, so the container grows to fit it
instead of cropping it.

### Resilience

| Scenario | Result |
|---|---|
| JavaScript disabled | All 8 sections visible, 0 hidden elements |
| `/api/public/config` unreachable | Prices/links fall back to server-rendered HTML |
| Redis not configured | Site works; rate limit falls back to per-instance memory |
| Redis configured but down | Rate limit **still enforced** from memory (fails closed) |
| Form endpoint unavailable | Clear message with the email address |
| Long / unicode form input | No layout overflow |

---

## Bugs found and fixed during the rebuild

These were caught by testing, not by reading the code.

1. **Wrong require path in all 7 API files.** `require('../lib/core')` from
   `api/public/x.js` resolves to `api/lib/core`, which does not exist. Every
   function would have crashed on cold start. `node --check` passes on this
   because it is valid syntax. Fixed to `../../lib/core`.

2. **Rate limiter failed open.** With Redis absent or erroring, `rateLimit()`
   returned `{ allowed: true }` unconditionally — brute-force protection
   silently vanished on a misconfigured deployment. Now layered: memory
   counter always runs, Redis adds a shared counter, and a Redis outage fails
   *closed* onto memory.

3. **Validation ran after the storage check.** A malformed price returned
   `503 Storage not configured` instead of a useful `422`. Validation now
   always runs first.

4. **`.gate { display: grid }` beat `[hidden]`.** Setting `element.hidden = true`
   had no visual effect, so the login card stayed stacked over the dashboard —
   and on a shared screen would have been visible at the same time. Fixed with
   a global `[hidden] { display: none !important; }`.

5. **Admin form showed blank fields.** `GET /api/admin/config` returned only
   the overrides, which are empty on a fresh install. It now returns the
   effective config (defaults merged with overrides).

6. **Reveal animation could blank the page.** `[data-rv]` started at
   `opacity: 0`; if the IntersectionObserver never fired — JS blocked, print
   preview, an unusual scroll container — the entire page below the hero was
   invisible. Now scoped to `.js` (set by `boot.js` before paint) with a 2.5s
   backstop, so content is visible by default and animation is a bonus.

7. **`h1` textContent read "Websites withquiet presence."** A `<br>` with no
   surrounding whitespace, so screen readers and search engines saw a
   concatenation. This is the exact defect flagged in the axinq.com audit —
   fixed here by keeping a space before each `<br>`.

8. **Hero headline wrapped to three lines** at desktop width, breaking the
   intended two-line rhythm. Type scale capped at `4.1rem`.

9. **`--muted` missed AA by 0.02.** `#64748b` measures 4.48:1 on white; AA
   needs 4.5. Darkened to `#5b6b80` (5.44:1). The industry strip words were
   worse at 2.94:1 and are now 6.08:1.

10. **18 tap targets under 44px.** Footer links rendered 31px tall, the brand
    link 30px, the short footer nav words 33px wide. All raised to the WCAG
    2.5.8 minimum.

11. **Demo cards rendered ragged.** `margin-bottom: auto` on an auto-height
    grid row pushed titles to different heights and left the link floating.
    Fixed with `grid-auto-rows: 1fr` and internal flex distribution — all six
    cards are now exactly 282px with titles aligned.

12. **Promoting h3→h2 for heading order broke two things at once**: the new
    `.demo-title` lost its `color: #fff` to a specificity conflict, rendering
    dark-on-dark at 1.09:1, and `.sec h2` inflated the titles to hero size.
    Both caught by the automated contrast check, not by eye.

13. **The admin console had never been audited while logged in.** Three
    violations only exist after login: no visible `h1`, unlandmarked regions,
    and the signed-in email at 4.0:1. All fixed; the login gate was clean
    from the start.

14. **`og-home.png` was referenced on all 11 pages but never existed.** Social
    shares and chat previews would have shown a broken image. Now a real
    1200×630 card, generated from the same design tokens.

---

## What is still yours to do

The code is done; these are account actions only you can take.

1. **Publish `firestore.rules`.** The live database is still world-writable
   until you paste those rules into the Firebase console. This is the single
   most important step. Until it is done, the old vulnerability remains.

2. **Rotate the Firestore web API key** if the old site was ever public.
   The key itself is not secret by design, but rotate anyway since the rules
   were open.

3. **Generate fresh admin credentials.** Do not reuse any password from the
   old build.

4. **Point the domain.** `vercel.json` assumes `as-studio-delta.vercel.app`;
   change the canonical URLs if you move to a custom domain.

5. **Replace the concept demos with real client work** when you have it. The
   current six are clearly labelled fictional on `/work` and in the
   disclaimer, which is the honest position until real projects exist.

---

## Design notes

The visual language follows axinq.com — gradient mesh, grid paper, tight heavy
display type, gradient accents, dark console cards — but with the accessibility
failures from that audit corrected:

| axinq.com | AS Studio build |
|---|---|
| `#94a3b8` body text = 2.56:1 | `#475569` = 7.5:1, `#64748b` = 4.8:1 |
| 54 text elements under 12px | no body text under 12px |
| 48 mobile tap targets under 44px | all interactive targets ≥ 44px |
| no visible focus outline | `:focus-visible` on everything |
| 0 JSON-LD, no `og:image` | `ProfessionalService` schema + OG image |
| duplicate SVG ids | unique ids per page |
| `h1` text concatenated | proper word spacing |

---

## Commands

```bash
node tools/dev-server.js       # local site + real API
node tools/hash-password.js    # new admin password hash
```

Audit scripts live in `../audit/` (`api-test.js`, `pro-audit.js`,
`clip-test.js`, `nojs-test.js`).
