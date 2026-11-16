import { getSessionFromRequest, sendJson } from '../../lib/core.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { ok: false, error: 'Method not allowed' }, { Allow: 'GET' });
  }
  const session = getSessionFromRequest(req);
  return sendJson(
    res,
    200,
    {
      ok: true,
      authenticated: Boolean(session),
      expiresAt: session ? new Date(session.exp * 1000).toISOString() : null
    },
    { 'Cache-Control': 'no-store' }
  );
}
