/**
 * POST /api/auth/login
 *
 * Replaces the old /x7q2m9r4v8k1p6z3 hidden-URL "admin".
 *
 * SECURITY:
 *  - Real password verification (scrypt, timing-safe).
 *  - Rate-limited: 6 attempts / 15 min per IP, and a global 30/15min circuit
 *    breaker so distributed guessing is throttled too.
 *  - On success mints a signed HMAC session in an HttpOnly, Secure,
 *    SameSite=Strict cookie. JavaScript cannot read it.
 *  - Identical response for "wrong password" and "no password configured"
 *    so the endpoint cannot be used to probe server state.
 */

'use strict';

const {
  json, methodNotAllowed, env, verifyPassword,
  signSession, sessionCookie, SESSION_TTL_SECONDS,
  rateLimit, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW
} = require('../../lib/core');

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) return fwd.split(',')[0].trim();
  const real = req.headers['x-real-ip'];
  if (typeof real === 'string') return real;
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

const GENERIC_FAILURE = { error: 'Incorrect email or password.' };

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST']);
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = null; }
  }
  if (!body || typeof body !== 'object') {
    return json(res, 400, { error: 'Malformed request.' });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 254) : '';
  const password = typeof body.password === 'string' ? body.password.slice(0, 512) : '';

  if (!email || !password) return json(res, 400, GENERIC_FAILURE);

  /* ---- rate limit ---- */
  const ip = clientIp(req);
  const perIp = await rateLimit(`as:rl:login:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);
  if (!perIp.allowed) {
    res.setHeader('Retry-After', String(RATE_LIMIT_WINDOW));
    return json(res, 429, { error: 'Too many attempts. Try again in 15 minutes.' });
  }
  const global = await rateLimit('as:rl:login:global', 30, RATE_LIMIT_WINDOW);
  if (!global.allowed) {
    return json(res, 429, { error: 'Too many attempts across the site. Try again shortly.' });
  }

  /* ---- verify ---- */
  const adminEmail = env('ADMIN_EMAIL');
  const adminHash = env('ADMIN_PASSWORD_HASH');

  /* Always run a scrypt comparison, even on failure, so response timing does
     not reveal whether the email was correct. */
  const emailMatches = Boolean(adminEmail) && email === adminEmail.toLowerCase();
  const dummyHash = 'scrypt$' + '0'.repeat(48) + '$' + '0'.repeat(128);
  const passwordMatches = verifyPassword(password, adminHash || dummyHash);

  if (!adminEmail || !adminHash || !emailMatches || !passwordMatches) {
    console.warn('[login] failed attempt from', ip);
    return json(res, 401, GENERIC_FAILURE);
  }

  /* ---- issue session ---- */
  const exp = Date.now() + SESSION_TTL_SECONDS * 1000;
  let token;
  try {
    token = signSession({ sub: 'admin', email: adminEmail, exp });
  } catch (err) {
    console.error('[login] session signing failed:', err.message);
    return json(res, 500, { error: 'Sign-in is not configured correctly.' });
  }

  res.setHeader('Set-Cookie', sessionCookie(token, SESSION_TTL_SECONDS));
  return json(res, 200, { ok: true, email: adminEmail, expiresAt: new Date(exp).toISOString() });
};
