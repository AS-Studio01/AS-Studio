import { clearSessionCookie, sendJson, verifyOrigin } from '../../lib/core.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { ok: false, error: 'Method not allowed' }, { Allow: 'POST' });
  }
  if (!verifyOrigin(req)) {
    return sendJson(res, 403, { ok: false, error: 'Invalid request origin' });
  }
  return sendJson(
    res,
    200,
    { ok: true, authenticated: false },
    {
      'Set-Cookie': clearSessionCookie(req),
      'Cache-Control': 'no-store'
    }
  );
}
