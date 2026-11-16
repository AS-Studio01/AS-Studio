# Deployment & Migration Runbook

This guide covers deploying **AS Studio Pro** to Vercel with optional server-side Firestore persistence and hardened admin authentication.

## 1. Generate Credentials

1. Create a strong `SESSION_SECRET` (at least 32 characters):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Generate `ADMIN_PASSWORD_HASH` via salted `scrypt`:
   ```bash
   npm run hash
   ```

## 2. Configure Vercel Environment Variables

Add the following environment variables in **Vercel Project Settings -> Environment Variables**:

| Variable | Required | Purpose |
| :--- | :--- | :--- |
| `SESSION_SECRET` | Yes (Prod) | Signs HMAC-SHA256 `HttpOnly` admin session cookies |
| `ADMIN_PASSWORD_HASH` | Yes (Prod) | Salted `scrypt$...` hash verified at `/api/auth/login` |
| `FIREBASE_PROJECT_ID` | Optional | Google Cloud / Firebase project ID for persistent storage |
| `FIREBASE_DATABASE_ID` | Optional | Firestore database ID (default `(default)`) |
| `FIREBASE_CLIENT_EMAIL` | Optional | Service account email with `Cloud Datastore User` role |
| `FIREBASE_PRIVATE_KEY` | Optional | Service account PKCS#8 private key (`\n` preserved) |

> Never prefix server secrets with `VITE_` or `NEXT_PUBLIC_`. Browser JS has zero access to Firebase credentials.

## 3. Deploy Firestore Deny-All Rules

Ensure `firestore.rules` is deployed so direct browser Firestore queries remain locked down:

```bash
firebase deploy --only firestore:rules
```

## 4. Verify Before Cutover

Run the local verification suite prior to pushing:

```bash
npm run check
```

Confirm:
- All clean URLs (`/`, `/packages`, `/work`, `/about`, `/contact`, `/demos`, `/demos/mitti`..`/demos/delta`, `/privacy`, `/terms`, `/refund`, `/disclaimer`) return HTTP `200`
- Legacy `.html` requests issue `301` redirects to clean canonical routes
- `/api/admin/config` and `/api/admin/inquiries` return HTTP `401` without a signed session cookie
- `/robots.txt` blocks `/demos`, `/admin`, and `/api/`
