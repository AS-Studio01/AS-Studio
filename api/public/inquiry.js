import {
  checkRateLimit,
  createInquiry,
  readJsonBody,
  sendJson,
  validateInquiry,
  verifyOrigin
} from '../../lib/core.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { ok: false, error: 'Method not allowed' }, { Allow: 'POST' });
  }
  if (!verifyOrigin(req)) {
    return sendJson(res, 403, { ok: false, error: 'Invalid request origin' });
  }

  const rate = checkRateLimit(req, 'inquiry', 6, 15 * 60 * 1000);
  if (!rate.allowed) {
    return sendJson(
      res,
      429,
      { ok: false, error: 'Too many briefs sent recently. Please try again shortly.' },
      { 'Retry-After': String(rate.retryAfter) }
    );
  }

  try {
    const body = await readJsonBody(req);
    const result = validateInquiry(body);
    if (result.honeypot) {
      return sendJson(res, 200, { ok: true, id: 'received' });
    }
    if (result.error) {
      return sendJson(res, 400, { ok: false, error: result.error });
    }
    await createInquiry(result.data);
    return sendJson(
      res,
      201,
      { ok: true, id: result.data.id },
      { 'Cache-Control': 'no-store' }
    );
  } catch (err) {
    const code = err?.statusCode || 500;
    return sendJson(res, code, {
      ok: false,
      error: code < 500 ? err.message : 'Unable to save project brief right now.'
    });
  }
}
