# AS Studio website

Static site: no build step, no server. Open `index.html` locally or deploy the folder to Vercel, Netlify or any static host.

## Before you go live (5 steps)
1. **Domain placeholder.** Search for `REPLACE-WITH-YOUR-DOMAIN` in `index.html`, `packages.html`, `work.html`, `contact.html`, `404.html`, `legal/*`, `demos/**`, `robots.txt`, `sitemap.xml` and replace it with your live domain. A project-wide find and replace in your editor does it in one go.
2. **Fiverr link (later).** Not needed now. When your gig is live, open the admin panel, paste the link and switch Fiverr mode on.
3. **Deploy Firestore rules.** `firebase deploy --only firestore:rules` using `firestore.rules` and `firebase.json`. This closes the public edit/delete hole on reviews.
4. **Admin inbox.** Open `/x7q2m9r4v8k1p6z3/` and sign in with an admin account. Confirm only emails you own are listed in `firestore.rules`.
5. **Test the contact form** once from a phone and confirm the enquiry appears in the inbox.

## Structure
- `index.html`: scroll-driven hero (video scrubbed by scroll), packages, demos, process, FAQ.
- `packages.html`, `work.html`, `contact.html`, `legal/`, `404.html`
- `demos/`: six multi-page demo sites, two per package (Starter 1 page, Growth 3 pages, Signature 6 pages)
- `about.html`, `work/as-studio.html`: about page and the case study of this site
- `assets/video/`: hero scrub video and poster
- `assets/brand/`: logo mark (SVG), favicons, wordmarks
- `assets/og/`: share images, one per page and demo
- `assets/img/`: demo images in WebP (full and `-sm` sizes)
- `x7q2m9r4v8k1p6z3/`: private admin inbox (noindex)

## Notes
- The hero scrubs a 4 MB video on desktop and laptops. Phones, small windows and reduced-motion users get a static hero instead, by design.
- Demo businesses are fictional and the images are AI generated. Replace with real client work as you win it.

## Fiverr mode switch (admin panel)
Open `/x7q2m9r4v8k1p6z3/`, sign in, and use the **Fiverr mode** card.
- **Off (default):** direct pricing. Prices are negotiable, "Order on Fiverr" buttons, price chips, Fiverr FAQ answers and Fiverr legal sections are all removed, and visitors are pointed to "Start a project" and "Get a quote". The contact form gains an optional budget field.
- **On:** the fixed Fiverr packages ($95 / $275 / $600), delivery days and "Order on Fiverr" buttons appear, all linking to the URL you saved. It cannot be turned on without a valid `https://www.fiverr.com/...` link.
- The setting is stored in Firestore `site_settings/main` (public read, admin-only write). If it cannot be read, the site stays in direct mode. Visitors see a change on their next page load.
- Share images, page titles and meta descriptions contain no prices, so they are correct in both modes.

## Opening the private workspace
Tap the **AS.Studio** wordmark five times quickly on the home page, or the "(c) 2026 AS Studio" line in the footer on any page. You can also go straight to `/x7q2m9r4v8k1p6z3/`.
