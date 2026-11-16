import {
  getConfig,
  getSessionFromRequest,
  readJsonBody,
  saveConfig,
  sendJson,
  validateConfigPatch,
  verifyOrigin
} from '../../lib/core.js';

export default async function handler(req, res) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return sendJson(
      res,
      401,
      { ok: false, error: 'Authentication required.' },
      { 'Cache-Control': 'no-store' }
    );
  }

  if (req.method === 'GET') {
    try {
      const config = await getConfig();
      return sendJson(res, 200, { ok: true, config }, { 'Cache-Control': 'no-store' });
    } catch {
      return sendJson(res, 500, { ok: false, error: 'Failed to load configuration.' }, { 'Cache-Control': 'no-store' });
    }
  }

  if (req.method === 'PATCH') {
    if (!verifyOrigin(req)) {
      return sendJson(res, 403, { ok: false, error: 'Invalid request origin.' }, { 'Cache-Control': 'no-store' });
    }
    try {
      const current = await getConfig();
      const body = await readJsonBody(req);
      const checked = validateConfigPatch(body, current);
      if (checked.error) {
        return sendJson(res, 400, { ok: false, error: checked.error }, { 'Cache-Control': 'no-store' });
      }
      const saved = await saveConfig(checked.data);
      return sendJson(res, 200, { ok: true, config: saved }, { 'Cache-Control': 'no-store' });
    } catch (err) {
      const code = err?.statusCode || 500;
      return sendJson(
        res,
        code,
        { ok: false, error: code < 500 ? err.message : 'Unable to save configuration.' },
        { 'Cache-Control': 'no-store' }
      );
    }
  }

  return sendJson(res, 405, { ok: false, error: 'Method not allowed' }, { Allow: 'GET, PATCH', 'Cache-Control': 'no-store' });
}
