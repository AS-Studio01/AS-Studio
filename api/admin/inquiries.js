/**
 * GET /api/admin/inquiries — list queued contact submissions.
 * Requires a session cookie. Returns only the newest 100.
 */
'use strict';

const { json, methodNotAllowed, requireAdmin, redisConfigured, redis } = require('../../lib/core');

module.exports = async (req, res) => {
  const session = requireAdmin(req, res);
  if (!session) return;

  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  if (!redisConfigured()) {
    return json(res, 200, { inquiries: [], storage: 'none', note: 'Storage not configured.' });
  }

  try {
    const r = await redis(['LRANGE', 'as:inquiries:queue', '0', '99']);
    const items = (r.result || []).map(function (raw) {
      try { return JSON.parse(raw); } catch (_) { return null; }
    }).filter(Boolean);
    return json(res, 200, { inquiries: items, storage: 'redis', count: items.length });
  } catch (err) {
    console.error('[admin/inquiries]', err.message);
    return json(res, 502, { error: 'Could not read inquiries.' });
  }
};
