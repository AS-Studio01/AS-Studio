import {
  buildSessionCookie,
  checkRateLimit,
  createSessionToken,
  readJsonBody,
  sendJson,
  verifyAdminCredentials,
  verifyOrigin
} from '../../lib/core.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { ok: false, error: 'Method not allowed' }, { Allow: 'POST' });
  }
  if (!verifyOrigin(req)) {
    return sendJson(res, 403, { ok: false, error: 'Invalid request origin' });
  }

  const rate = checkRateLimit(req, 'login', 10, 15 * 60 * 1000);
  if (!rate.allowed) {
    return sendJson(
      res,
      429,
      { ok: false, error: 'Too many sign-in attempts. Please wait a few minutes.' },
      { 'Retry-After': String(rate.retryAfter), 'Cache-Control': 'no-store' }
    );
  }

  try {
    const body = await readJsonBody(req, 4096);
    const password = typeof body?.password === 'string' ? body.password : '';
    const check = verifyAdminCredentials(password);
    if (!check.configured) {
      return sendJson(
        res,
        503,
        {
          ok: false,
          error: 'Admin password hash is not configured. Run npm run hash and set ADMIN_PASSWORD_HASH.'
        },
        { 'Cache-Control': 'no-store' }
      );
    }
    if (!check.valid) {
      return sendJson(
        res,
        401,
        { ok: false, error: 'Incorrect password.' },
        { 'Cache-Control': 'no-store' }
      );
    }

    const token = createSessionToken('admin');
    return sendJson(
      res,
      200,
      { ok: true, authenticated: true },
      {
        'Set-Cookie': buildSessionCookie(req, token),
        'Cache-Control': 'no-store'
      }
    );
  } catch (err) {
    const code = err?.statusCode || 500;
    return sendJson(
      res,
      code,
      { ok: false, error: code < 500 ? err.message : 'Unable to complete sign in.' },
      { 'Cache-Control': 'no-store' }
    );
  }
}
