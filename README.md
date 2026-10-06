# AS Studio V3

Production-oriented static public site with Firebase-backed enquiries, client portal, admin workspace, project case studies, editable SEO records, editable legal content, structured data, sitemap and robots controls.

## Deployment

This version intentionally has **no build step** and no React, TypeScript or Vite requirement.

### Vercel
1. Import the repository.
2. Set Framework Preset to **Other**.
3. Leave Build Command empty.
4. Leave Output Directory empty or use `.` if the dashboard requires a value.
5. Deploy from the folder containing `index.html`.

Do not use the old Vite/React preset for this version.

### Hostinger
Upload the contents of this folder to `public_html` so `public_html/index.html` exists directly at the root.

## Firebase

The browser Firebase configuration is included in `js/firebase-config.js` and is also loaded explicitly by the admin, portal, homepage and legal pages. Firebase web API keys are identifiers, not server secrets. Keep privileged credentials out of the repository.

Before production use:
- Verify Firebase Authentication providers are enabled.
- Verify the three authorized admin email addresses.
- Publish `firestore.rules`.
- Create at least one client account.
- Create client project records from `admin.html` using the client's Firebase UID.
- Add SEO records in the admin SEO editor.
- Add legal records in the admin legal editor if you want the Firestore versions to override the local fallback pages.

## Public routes
- `/index.html`
- `/work.html`
- `/services.html`
- `/project.html?project=apex`
- `/project.html?project=atelier`
- `/project.html?project=nova`
- `/portal.html`
- `/admin.html`

## Preserved demos
The original standalone demos remain under `public/demos/` and are not deleted.


## Firebase preservation
This final build keeps the existing AS Studio Firebase project configuration from the supplied last version. It does not create or switch to a new Firebase project. Update Firebase-side settings only when required for deployment, authentication providers, or Firestore rules.

## Legal content
Privacy Policy, Terms of Service, Disclaimer, and Cancellation & Refund Policy have been rewritten as production-ready website copy. They can also be overridden from the Firebase-backed Legal Pages editor. These pages are business-policy templates and should be reviewed by qualified legal counsel for the final business setup and applicable law.
