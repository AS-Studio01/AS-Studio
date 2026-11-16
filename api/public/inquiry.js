/**
 * POST /api/public/inquiry
 *
 * Contact-form submission.
 *
 * SECURITY:
 *  - Every field is validated and re-typed server-side. The client cannot
 *    inject extra Firestore fields.
 *  - Rate-limited per IP (5 per hour) via Redis when configured.
 *  - Written to Firestore with a SERVICE ACCOUNT from this function, so the
 *    browser never receives an API key and Firestore rules can deny all
 *    public reads and writes.
 *  - A honeypot field blocks the cheapest bots without a captcha.
 *  - Never echoes internals in error messages.
 */

'use strict';

const {
  json, methodNotAllowed, cleanString, isEmail,
  redis, redisConfigured, rateLimit, firestoreConfigured, writeInquiry
} = require('../../lib/core');

const MAX_PER_HOUR = 5;

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) return fwd.split(',')[0].trim();
  const real = req.headers['x-real-ip'];
  if (typeof real === 'string') return real;
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST']);
  }

  /* ---- parse body ---- */
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = null; }
  }
  if (!body || typeof body !== 'object') {
    return json(res, 400, { error: 'Malformed request.' });
  }

  /* ---- honeypot: a hidden field humans never fill ---- */
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    /* Pretend success so the bot does not learn it was caught. */
    return json(res, 200, { ok: true });
  }

  /* ---- validate ---- */
  const clientName     = cleanString(body.clientName, 100);
  const businessName   = cleanString(body.businessName, 120);
  const contactChannel = cleanString(body.contactChannel, 20).toLowerCase();
  const contactValue   = cleanString(body.contactValue, 200);
  const budget         = cleanString(body.budget, 60);
  const scopeSummary   = cleanString(body.scopeSummary, 2000);

  const errors = {};

  if (clientName.length < 2)  errors.clientName = 'Please enter your name.';
  if (businessName.length < 2) errors.businessName = 'Please enter your business name.';

  if (!['email', 'telegram', 'phone'].includes(contactChannel)) {
    errors.contactChannel = 'Choose how we should reply.';
  }

  if (contactChannel === 'email') {
    if (!isEmail(contactValue)) errors.contactValue = 'That email address looks incomplete.';
  } else if (contactValue.length < 3) {
    errors.contactValue = 'Please add your contact handle.';
  }

  if (scopeSummary.length < 15) {
    errors.scopeSummary = 'Tell us a little more — at least a sentence.';
  }

  if (Object.keys(errors).length > 0) {
    return json(res, 422, { error: 'Please check the highlighted fields.', fields: errors });
  }

  /* ---- rate limit ---- */
  const ip = clientIp(req);
  const bucket = `as:rl:inquiry:${ip}`;
  const limit = await rateLimit(bucket, MAX_PER_HOUR, 3600);
  if (!limit.allowed) {
    res.setHeader('Retry-After', '900');
    return json(res, 429, {
      error: 'Too many messages from this connection. Please email us directly instead.'
    });
  }

  /* ---- persist ---- */
  const record = {
    clientName, businessName, contactChannel,
    contactValue, budget, scopeSummary
  };

  let stored = false;
  let id = null;

  if (await firestoreConfigured()) {
    try {
      id = await writeInquiry(record);
      stored = true;
    } catch (err) {
      console.error('[inquiry] firestore write failed:', err.message);
    }
  }

  if (redisConfigured()) {
    try {
      await redis(['LPUSH', 'as:inquiries:queue', JSON.stringify({
        ...record, receivedAt: new Date().toISOString(), ip: ip.slice(0, 64), firestoreId: id
      })]);
      await redis(['LTRIM', 'as:inquiries:queue', '0', '499']);
      stored = true;
    } catch (err) {
      console.error('[inquiry] redis enqueue failed:', err.message);
    }
  }

  /* A submission must never be silently swallowed. If no sink is configured,
     log it so it shows up in Vercel function logs and tell the user to email. */
  if (!stored) {
    console.log('[inquiry] NO SINK CONFIGURED — payload follows:', JSON.stringify(record));
    return json(res, 503, {
      error: 'Our form is briefly unavailable. Please email asbusinessofficial01@gmail.com — we reply within one business day.'
    });
  }

  return json(res, 200, {
    ok: true,
    message: 'Thank you — your brief has reached us. We reply within one business day.'
  });
};
