import { getConfig, sendJson } from '../../lib/core.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { ok: false, error: 'Method not allowed' }, { Allow: 'GET' });
  }
  try {
    const config = await getConfig();
    return sendJson(
      res,
      200,
      { ok: true, config },
      { 'Cache-Control': 'public, max-age=15, must-revalidate' }
    );
  } catch {
    return sendJson(res, 500, { ok: false, error: 'Unable to load configuration' });
  }
}
