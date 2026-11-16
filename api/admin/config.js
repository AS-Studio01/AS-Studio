/**
 * GET  /api/admin/config — current admin-editable config
 * PATCH /api/admin/config — update marketplace links / pricing / status
 *
 * Requires a valid session cookie. Every field is validated server-side.
 */
'use strict';

const {
  json, methodNotAllowed, requireAdmin, cleanString, isSafeHttpUrl, isEmail,
  redisConfigured, redis
} = require('../../lib/core');

const KEY = 'as:config:public';

async function readConfig() {
  if (!redisConfigured()) return null;
  try {
    const r = await redis(['GET', KEY]);
    return r && r.result ? JSON.parse(r.result) : {};
  } catch (_) { return null; }
}

/* The studio's shipped defaults. Kept here so the admin form always shows
   the values the public site is actually serving, even before anything has
   been overridden. Mirrors api/public/config.js. */
const DEFAULTS = Object.freeze({
  studio: {
    name: 'AS Studio',
    status: 'open',
    statusLabel: 'Studio open · Working worldwide',
    email: 'asbusinessofficial01@gmail.com',
    telegram: 'https://t.me/AS_Studio_official01'
  },
  pricing: { currency: 'USD', starter: 95, growth: 275, signature: 600 },
  links: {
    fiverr: 'https://www.fiverr.com/s/GPPQm9q',
    upwork: 'https://www.upwork.com/freelancers/~01db1175182843f13a?mp_source=share'
  },
  marketplace: { fiverr: true, upwork: false },
  announcement: null
});

function effectiveConfig(overrides) {
  const base = JSON.parse(JSON.stringify(DEFAULTS));
  if (!overrides || typeof overrides !== 'object') return base;

  ['links', 'marketplace', 'pricing', 'studio'].forEach(function (group) {
    if (overrides[group] && typeof overrides[group] === 'object') {
      Object.assign(base[group], overrides[group]);
    }
  });
  if (overrides.announcement !== undefined) base.announcement = overrides.announcement;
  return base;
}

module.exports = async (req, res) => {
  const session = requireAdmin(req, res);
  if (!session) return;

  if (req.method === 'GET') {
    const overrides = await readConfig();
    return json(res, 200, {
      config: effectiveConfig(overrides),
      overrides: overrides || {},
      storage: redisConfigured() ? 'redis' : 'none'
    });
  }

  if (req.method !== 'PATCH' && req.method !== 'PUT') {
    return methodNotAllowed(res, ['GET', 'PATCH']);
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = null; }
  }
  if (!body || typeof body !== 'object') return json(res, 400, { error: 'Malformed request.' });

  const next = (await readConfig()) || {};
  const errors = {};

  if (body.links && typeof body.links === 'object') {
    next.links = next.links || {};
    if (body.links.fiverr !== undefined) {
      if (body.links.fiverr === '' || body.links.fiverr === null) delete next.links.fiverr;
      else if (isSafeHttpUrl(body.links.fiverr)) next.links.fiverr = body.links.fiverr;
      else errors['links.fiverr'] = 'Must be a full http(s) URL.';
    }
    if (body.links.upwork !== undefined) {
      if (body.links.upwork === '' || body.links.upwork === null) delete next.links.upwork;
      else if (isSafeHttpUrl(body.links.upwork)) next.links.upwork = body.links.upwork;
      else errors['links.upwork'] = 'Must be a full http(s) URL.';
    }
  }

  if (body.marketplace && typeof body.marketplace === 'object') {
    next.marketplace = next.marketplace || {};
    if (body.marketplace.fiverr !== undefined) next.marketplace.fiverr = body.marketplace.fiverr !== false;
    if (body.marketplace.upwork !== undefined) next.marketplace.upwork = body.marketplace.upwork === true;
  }

  if (body.pricing && typeof body.pricing === 'object') {
    next.pricing = next.pricing || {};
    ['starter', 'growth', 'signature'].forEach(function (k) {
      if (body.pricing[k] === undefined) return;
      const n = Number(body.pricing[k]);
      if (!Number.isInteger(n) || n <= 0 || n >= 100000) {
        errors['pricing.' + k] = 'Whole number between 1 and 99999.';
      } else {
        next.pricing[k] = n;
      }
    });
  }

  if (body.studioExtra && typeof body.studioExtra === 'object') {
    body.studio = Object.assign({}, body.studio || {}, body.studioExtra);
  }

  if (body.studio && typeof body.studio === 'object') {
    next.studio = next.studio || {};
    if (body.studio.status !== undefined) {
      if (body.studio.status === 'open' || body.studio.status === 'closed') {
        next.studio.status = body.studio.status;
      } else {
        errors['studio.status'] = 'Must be "open" or "closed".';
      }
    }
    if (body.studio.statusLabel !== undefined) {
      next.studio.statusLabel = cleanString(body.studio.statusLabel, 80);
    }
    if (body.studio.email !== undefined) {
      const email = cleanString(body.studio.email, 160);
      if (email === '' || isEmail(email)) next.studio.email = email || null;
      else errors['studio.email'] = 'Enter a valid email address.';
    }
    if (body.studio.telegram !== undefined) {
      const tg = cleanString(body.studio.telegram, 200);
      if (tg === '' || isSafeHttpUrl(tg)) next.studio.telegram = tg || null;
      else errors['studio.telegram'] = 'Must be a full https:// URL.';
    }
  }

  if (body.announcement !== undefined) {
    next.announcement = body.announcement === null ? null : cleanString(body.announcement, 200) || null;
  }

  if (Object.keys(errors).length > 0) {
    return json(res, 422, { error: 'Some values were rejected.', fields: errors });
  }

  // Validation has already run above, so a bad request always gets a precise
  // 422 instead of a confusing 503. Storage is only required to persist.
  if (!redisConfigured()) {
    return json(res, 503, {
      error: 'Storage is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.'
    });
  }

  try {
    await redis(['SET', KEY, JSON.stringify(next)]);
  } catch (err) {
    console.error('[admin/config] write failed:', err.message);
    return json(res, 502, { error: 'Could not save. Storage unavailable.' });
  }

  return json(res, 200, { ok: true, config: next });
};
