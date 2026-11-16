/**
 * AS Studio — shared server library
 *
 * SECURITY MODEL
 * --------------
 * 1. NOTHING the browser holds is configurable. All public API responses are
 *    hard-coded server-side. A user can edit any JS they like and change nothing.
 * 2. Admin state lives in Redis (Upstash/Vercel KV), server-only.
 * 3. Admin is protected by a real password check (scrypt, rate-limited) that
 *    mints a signed, HttpOnly, SameSite=Strict session cookie.
 *    There is no "hidden URL" as security.
 * 4. The Firebase web apiKey is NOT shipped to the browser. Inquiries are written
 *    from this server using a service account, so Firestore rules can be
 *    `allow read, write: if false` for all public clients.
 */

'use strict';

const crypto = require('crypto');

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const SESSION_COOKIE = 'as_admin_session';
const SESSION_TTL_SECONDS = (function () {
  const n = parseInt(process.env.ADMIN_SESSION_HOURS, 10);
  if (Number.isInteger(n) && n >= 1 && n <= 168) return 60 * 60 * n; // 1h..7d
  return 60 * 60 * 8;                                               // default 8h
})();
const RATE_LIMIT_WINDOW = 15 * 60;                 // 15 min
const RATE_LIMIT_MAX = 6;                          // login attempts per window

function env(name) {
  const v = process.env[name];
  return typeof v === 'string' && v.length > 0 ? v : null;
}

/* ------------------------------------------------------------------ */
/* Response helpers                                                    */
/* ------------------------------------------------------------------ */

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-store');
}

function json(res, status, payload) {
  setSecurityHeaders(res);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(status).json(payload);
}

function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '));
  return json(res, 405, { error: 'Method not allowed' });
}

/* ------------------------------------------------------------------ */
/* Input validation                                                    */
/* ------------------------------------------------------------------ */

/** Trim, collapse whitespace, strip control characters, hard-cap length. */
function cleanString(input, maxLength) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\u0000-\u001f\u007f]/g, ' ')   // control chars
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function isEmail(value) {
  if (typeof value !== 'string' || value.length > 254) return false;
  // Deliberately simple: one @, a dot in the domain, no whitespace.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function isSafeHttpUrl(value) {
  if (typeof value !== 'string' || value.length > 500) return false;
  try {
    const u = new URL(value);
    return (u.protocol === 'https:' || u.protocol === 'http:');
  } catch (_) {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Password hashing (scrypt, timing-safe)                              */
/* ------------------------------------------------------------------ */

/**
 * Verifies a password against a stored scrypt hash.
 * Stored format:  scrypt$<saltHex>$<hashHex>
 * Generate one with:  node -e "…"  — see tools/hash-password.js
 */
function verifyPassword(password, stored) {
  if (typeof password !== 'string' || typeof stored !== 'string') return false;
  const parts = stored.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;

  const salt = Buffer.from(parts[1], 'hex');
  const expected = Buffer.from(parts[2], 'hex');
  if (salt.length < 16 || expected.length < 32) return false;

  let actual;
  try {
    actual = crypto.scryptSync(password, salt, expected.length, { N: 16384, r: 8, p: 1 });
  } catch (_) {
    return false;
  }
  // constant-time compare — length is already equal by construction
  return crypto.timingSafeEqual(actual, expected);
}

function hashPassword(password) {
  const salt = crypto.randomBytes(24);
  const hash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

/* ------------------------------------------------------------------ */
/* Signed session tokens (stateless, HMAC-SHA256)                      */
/* ------------------------------------------------------------------ */

function b64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str) {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

function sessionSecret() {
  const s = env('ADMIN_SESSION_SECRET');
  if (!s || s.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET missing or too short (min 32 chars)');
  }
  return s;
}

function signSession(payload) {
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', sessionSecret()).update(body).digest();
  return `${body}.${b64url(sig)}`;
}

function verifySession(token) {
  if (typeof token !== 'string' || token.length > 600) return null;
  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;

  const body = token.slice(0, dot);
  const given = token.slice(dot + 1);

  let expected;
  try {
    expected = b64url(crypto.createHmac('sha256', sessionSecret()).update(body).digest());
  } catch (_) {
    return null;
  }
  // timing-safe compare of equal-length strings
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  let payload;
  try {
    payload = JSON.parse(b64urlDecode(body).toString('utf8'));
  } catch (_) {
    return null;
  }
  if (!payload || typeof payload.exp !== 'number') return null;
  if (Date.now() > payload.exp) return null;
  return payload;
}

function parseCookies(header) {
  const out = {};
  if (typeof header !== 'string') return out;
  header.split(';').forEach(function (pair) {
    const i = pair.indexOf('=');
    if (i < 0) return;
    const k = pair.slice(0, i).trim();
    const v = pair.slice(i + 1).trim();
    if (k) {
      try { out[k] = decodeURIComponent(v); } catch (_) { out[k] = v; }
    }
  });
  return out;
}

function sessionCookie(token, maxAge) {
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    `Max-Age=${maxAge}`
  ];
  return parts.join('; ');
}

function getSession(req) {
  const cookies = parseCookies(req.headers && req.headers.cookie);
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;
  return verifySession(token);
}

function requireAdmin(req, res) {
  const session = getSession(req);
  if (!session) {
    json(res, 401, { error: 'Not authenticated' });
    return null;
  }
  return session;
}

/* ------------------------------------------------------------------ */
/* Storage (Upstash Redis REST) — optional                             */
/* ------------------------------------------------------------------ */

function redisConfigured() {
  return Boolean(env('UPSTASH_REDIS_REST_URL') && env('UPSTASH_REDIS_REST_TOKEN'));
}

async function redis(command) {
  const url = env('UPSTASH_REDIS_REST_URL');
  const token = env('UPSTASH_REDIS_REST_TOKEN');
  if (!url || !token) throw new Error('Redis not configured');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(command)
  });
  if (!res.ok) {
    throw new Error(`Redis ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  return res.json();
}

/* ------------------------------------------------------------------ */
/* Rate limiting                                                       */
/* ------------------------------------------------------------------ */
/*
 * Two layers, deliberately:
 *
 *   1. An in-process memory counter. Always active, no configuration needed,
 *      so brute-force protection exists even on a bare deployment. It is
 *      per-instance, so it is a floor, not a guarantee.
 *
 *   2. Upstash Redis, when configured, gives a shared counter across every
 *      serverless instance — the real defence.
 *
 * FAIL-CLOSED POLICY: if Redis is configured but errors out, we still fall
 * back to the memory counter rather than allowing the request through.
 * An unavailable store must never silently remove the limit. The one
 * exception is a *missing* configuration, which is reported honestly as
 * `degraded: true` so operators can see it.
 */

const MEMORY_LIMITS = new Map();          // key -> { count, resetAt }
const MEMORY_MAX_KEYS = 5000;             // cap memory on a long-lived instance

function memoryRateLimit(key, max, windowSeconds) {
  const now = Date.now();
  let entry = MEMORY_LIMITS.get(key);

  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowSeconds * 1000 };
    if (MEMORY_LIMITS.size >= MEMORY_MAX_KEYS) {
      // evict the oldest key so the map cannot grow without bound
      MEMORY_LIMITS.delete(MEMORY_LIMITS.keys().next().value);
    }
    MEMORY_LIMITS.set(key, entry);
  }

  entry.count += 1;
  return {
    allowed: entry.count <= max,
    remaining: Math.max(0, max - entry.count),
    resetAt: entry.resetAt
  };
}

async function rateLimit(key, max, windowSeconds) {
  // Layer 1 — always available
  const local = memoryRateLimit(key, max, windowSeconds);

  if (!redisConfigured()) {
    return {
      allowed: local.allowed,
      remaining: local.remaining,
      degraded: true,                    // honest: shared limiter not configured
      source: 'memory'
    };
  }

  // Layer 2 — shared across instances
  try {
    const r = await redis(['INCR', key]);
    const count = Number(r.result) || 1;
    if (count === 1) await redis(['EXPIRE', key, String(windowSeconds)]);
    return {
      allowed: count <= max && local.allowed,
      remaining: Math.max(0, Math.min(max - count, local.remaining)),
      degraded: false,
      source: 'redis'
    };
  } catch (err) {
    // Fail closed onto the memory counter — never fail fully open.
    console.error('[rateLimit] redis unavailable, using memory counter:', err.message);
    return {
      allowed: local.allowed,
      remaining: local.remaining,
      degraded: true,
      source: 'memory'
    };
  }
}

/* ------------------------------------------------------------------ */
/* Firestore (server-side, service account) — optional                 */
/* ------------------------------------------------------------------ */

/**
 * Mints a Google OAuth token from a service account JSON in env, then writes
 * an inquiry document. The browser never sees a key.
 *
 * Env:  FIREBASE_SERVICE_ACCOUNT  (full JSON, single line)
 *       FIREBASE_PROJECT_ID
 *       FIREBASE_DB_ID            (named database, optional)
 */
async function firestoreConfigured() {
  return Boolean(env('FIREBASE_SERVICE_ACCOUNT') && env('FIREBASE_PROJECT_ID'));
}

async function googleAccessToken() {
  const raw = env('FIREBASE_SERVICE_ACCOUNT');
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT not set');

  let sa;
  try {
    sa = JSON.parse(raw);
  } catch (_) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is not valid JSON');
  }
  if (!sa.client_email || !sa.private_key) {
    throw new Error('Service account missing client_email/private_key');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  }));
  const unsigned = `${header}.${claims}`;
  const signature = b64url(
    crypto.createSign('RSA-SHA256')
      .update(unsigned)
      .sign(sa.private_key.replace(/\\n/g, '\n'))
  );
  const assertion = `${unsigned}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion
    })
  });
  if (!res.ok) throw new Error(`Google token ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

async function writeInquiry(doc) {
  const projectId = env('FIREBASE_PROJECT_ID');
  const dbId = env('FIREBASE_DB_ID') || '(default)';
  const token = await googleAccessToken();

  const id = 'inq_' + Date.now().toString(36) + crypto.randomBytes(5).toString('hex');
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}`
    + `/databases/${encodeURIComponent(dbId)}/documents/inquiries?documentId=${id}`;

  const fields = {
    clientName: { stringValue: doc.clientName },
    businessName: { stringValue: doc.businessName },
    contactChannel: { stringValue: doc.contactChannel },
    contactValue: { stringValue: doc.contactValue },
    budget: { stringValue: doc.budget },
    scopeSummary: { stringValue: doc.scopeSummary },
    source: { stringValue: 'website_contact_form' },
    status: { stringValue: 'new' },
    createdAt: { timestampValue: new Date().toISOString() }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields })
  });
  if (!res.ok) {
    throw new Error(`Firestore ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  return id;
}

/* ------------------------------------------------------------------ */

module.exports = {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  RATE_LIMIT_WINDOW,
  RATE_LIMIT_MAX,
  env,
  json,
  methodNotAllowed,
  cleanString,
  isEmail,
  isSafeHttpUrl,
  hashPassword,
  verifyPassword,
  signSession,
  verifySession,
  sessionCookie,
  getSession,
  requireAdmin,
  redisConfigured,
  redis,
  rateLimit,
  firestoreConfigured,
  writeInquiry
};
