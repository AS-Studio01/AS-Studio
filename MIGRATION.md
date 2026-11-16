# Migrating the live site to this build

Read this in order. Step 1 is the urgent one.

---

## Step 0 — Understand what is live right now

The current deployment at `as-studio-delta.vercel.app` has a real vulnerability,
verified by direct request:

| Collection | Public read | Public write |
|---|---|---|
| `site_settings/main` | **open (200)** | **open (200)** |
| `inquiries` | denied (403) | denied (403) |
| `users` | denied (403) | denied (403) |
| `admins` | denied (403) | denied (403) |
| `leads` | denied (403) | denied (403) |

`site_settings/main` holds `fiverrUrl`, `upworkUrl` and the three prices. Anyone
who knows the project id can rewrite them. The realistic attack is not subtle:
repoint the Fiverr button at a lookalike page, or drop the Starter price to $1
and let orders arrive that you never agreed to.

Everything else is correctly locked. This one document is the hole.

---

## Step 1 — Close the hole (5 minutes, do this today)

This does not require the new build. It works on the site as it is.

1. Open [Firebase Console](https://console.firebase.google.com) → project
   `profound-handbook-z3skh`
2. Firestore Database → **Rules**
3. Replace the entire contents with:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. **Publish**
5. Verify — both commands must now return `403`:

```bash
KEY=AIzaSyA1km1IvXjyPTkO0grVOunMorlOoARLd2w
BASE="https://firestore.googleapis.com/v1/projects/profound-handbook-z3skh/databases/ai-studio-asstudio-bc59d6e2-7ac2-415f-a1f3-6095feae2fe1/documents"

# read
curl -s -o /dev/null -w "read : %{http_code}\n" "$BASE/site_settings/main?key=$KEY"

# write
curl -s -o /dev/null -w "write: %{http_code}\n" -X PATCH \
  "$BASE/site_settings/main?key=$KEY&updateMask.fieldPaths=probe" \
  -H "Content-Type: application/json" \
  -d '{"fields":{"probe":{"stringValue":"x"}}}'
```

> **This will break the current site.** The live contact form writes to
> Firestore from the browser. Once the rules are closed, submissions stop
> being saved. That is the correct trade: no data is better than
> attacker-controlled data. Deploy the new build (Step 3) to restore the form
> with a server-side writer.

If you are not ready to break the form yet, a narrower rule keeps writes
closed while leaving only the specific fields the site reads:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /site_settings/{doc} {
      allow read: if true;
      allow write: if false;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

That stops tampering immediately and leaves the read path working. It is a
stopgap — Step 3 removes the need for it entirely.

---

## Step 2 — Set up credentials

```bash
cd as-studio-pro
cp .env.example .env

# 1. admin password
node tools/hash-password.js
#    → ADMIN_PASSWORD_HASH=scrypt$abc123...$def456...
#    paste into .env

# 2. session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
#    → paste into ADMIN_SESSION_SECRET

# 3. your login email
#    → ADMIN_EMAIL=you@example.com

# 4. Firestore service account (optional but recommended)
#    Firebase Console → Project Settings → Service Accounts
#    → Generate new private key → download JSON
#    → collapse to one line, paste into FIREBASE_SERVICE_ACCOUNT

# 5. Upstash Redis (optional but recommended)
#    upstash.com → create database → REST URL + token
```

Choose a password you have never used on this project before. The old build
had a hidden-URL admin; treat any credential from it as compromised.

---

## Step 3 — Deploy

```bash
npm i -g vercel
vercel --prod
```

Then in Vercel → Settings → Environment Variables, add every variable from
your `.env`. Redeploy so the functions pick them up.

---

## Step 4 — Verify production

```bash
SITE=https://your-new-deployment.vercel.app

# public config works and leaks nothing
curl -s $SITE/api/public/config | head -c 300
curl -s $SITE/api/public/config | grep -c -E "AIza|private_key|scrypt"   # expect 0

# admin is closed
curl -s -o /dev/null -w "admin api: %{http_code}\n" $SITE/api/admin/config   # expect 401

# no key in shipped JS
curl -s $SITE/js/site.js | grep -c AIza                                    # expect 0

# security headers present
curl -sI $SITE | grep -E "content-security-policy|strict-transport|x-frame|referrer" -i

# login rate-limits
for i in $(seq 1 9); do
  curl -s -o /dev/null -w "%{http_code} " -X POST $SITE/api/auth/login \
    -H "Content-Type: application/json" -d '{"email":"a@b.c","password":"x"}'
done; echo                                                      # expect 429 early

# the page that used to 404
curl -s -o /dev/null -w "refund page: %{http_code}\n" $SITE/legal/refund   # expect 200
```

---

## Step 5 — Move the domain

`vercel.json` and every `<link rel="canonical">` currently reference
`as-studio-delta.vercel.app`. If you keep that hostname, nothing to do.

If you move to a custom domain (recommended — it is what makes a business look
established, which is the whole pitch):

```bash
grep -rl "as-studio-delta.vercel.app" . | xargs sed -i 's|https://as-studio-delta.vercel.app|https://yourdomain.com|g'
```

Files affected: all 11 HTML pages (canonical, `og:url`, `og:image`, JSON-LD).

Then add the domain in Vercel → Settings → Domains and set up DNS.

---

## Step 6 — What to do about the old deployment

Once the new build is live and verified:

1. Vercel → old project → Settings → **Delete project** (or disable it)
2. Keep the Firebase project — the new build uses it for storing inquiries
3. Delete the old `site_settings` document; the new build does not read it
4. Consider deleting unused collections (`users`, `admins`, `leads`) if they
   were never populated. Check first — do not delete data you might need.

---

## Rollback

If something goes wrong, the previous deployment is still on Vercel. Review →
Deployments → promote the last known-good one. The Firestore rules stay
stay closed either way, which is the desired end state.

---

## Checklist

- [ ] Firestore rules published — `site_settings` no longer writable
- [ ] Both `curl` probes in Step 1 return 403
- [ ] `.env` filled, never committed
- [ ] Deployed to Vercel with the same variables
- [ ] `/api/admin/config` returns 401 without a cookie
- [ ] `/admin` login works with the new password
- [ ] Contact form submits and the brief appears in the admin console
- [ ] `/legal/refund` returns 200
- [ ] Security headers present
- [ ] Domain updated everywhere (if changed)
- [ ] Old deployment deleted
