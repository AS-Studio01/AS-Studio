import {
  getSessionFromRequest,
  listInquiries,
  readJsonBody,
  sanitizeText,
  sendJson,
  updateInquiryStatus,
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
      const inquiries = await listInquiries();
      return sendJson(res, 200, { ok: true, inquiries }, { 'Cache-Control': 'no-store' });
    } catch {
      return sendJson(res, 500, { ok: false, error: 'Unable to load inquiry queue.' }, { 'Cache-Control': 'no-store' });
    }
  }

  if (req.method === 'PATCH') {
    if (!verifyOrigin(req)) {
      return sendJson(res, 403, { ok: false, error: 'Invalid request origin.' }, { 'Cache-Control': 'no-store' });
    }
    try {
      const body = await readJsonBody(req, 4096);
      const id = sanitizeText(body?.id || '', 80);
      const status = sanitizeText(body?.status || '', 32).toLowerCase();
      if (!id) {
        return sendJson(res, 400, { ok: false, error: 'Inquiry ID is required.' }, { 'Cache-Control': 'no-store' });
      }
      const updated = await updateInquiryStatus(id, status);
      return sendJson(res, 200, { ok: true, inquiry: updated }, { 'Cache-Control': 'no-store' });
    } catch (err) {
      const code = err?.statusCode || 500;
      return sendJson(
        res,
        code,
        { ok: false, error: code < 500 ? err.message : 'Unable to update inquiry status.' },
        { 'Cache-Control': 'no-store' }
      );
    }
  }

  return sendJson(res, 405, { ok: false, error: 'Method not allowed' }, { Allow: 'GET, PATCH', 'Cache-Control': 'no-store' });
}
