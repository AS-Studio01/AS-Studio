/**
 * GET /api/public/config
 *
 * The ONLY configuration the browser is allowed to see.
 *
 * SECURITY: this response is built from server constants and optional
 * server-side storage — never from anything the client sends. A visitor can
 * edit every byte of JavaScript in their devtools and it changes nothing,
 * because the server decides what is rendered.
 *
 * Deliberately NOT included:
 *   - Firebase apiKey / projectId / any auth config
 *   - admin routes, admin emails, session details
 *   - internal prices beyond what the page already displays
 */

'use strict';

const { json, methodNotAllowed, redisConfigured, redis, isSafeHttpUrl } = require('../../lib/core');

/* Server-owned source of truth. Update here, or override via Redis at
   `as:config:public` with the same shape. */
const DEFAULTS = Object.freeze({
  studio: {
    name: 'AS Studio',
    status: 'open',
    statusLabel: 'Studio open · Working worldwide',
    email: 'asbusinessofficial01@gmail.com',
    telegram: 'https://t.me/AS_Studio_official01'
  },
  pricing: {
    currency: 'USD',
    starter: 95,
    growth: 275,
    signature: 600
  },
  links: {
    fiverr: 'https://www.fiverr.com/s/GPPQm9q',
    upwork: 'https://www.upwork.com/freelancers/~01db1175182843f13a?mp_source=share'
  },
  marketplace: {
    fiverr: true,
    upwork: false
  },
  announcement: null
});

function sanitiseOverrides(overrides) {
  if (!overrides || typeof overrides !== 'object') return {};
  const out = {};

  if (overrides.links && typeof overrides.links === 'object') {
    out.links = {};
    if (isSafeHttpUrl(overrides.links.fiverr)) out.links.fiverr = overrides.links.fiverr;
    if (isSafeHttpUrl(overrides.links.upwork)) out.links.upwork = overrides.links.upwork;
  }
  if (overrides.marketplace && typeof overrides.marketplace === 'object') {
    out.marketplace = {
      fiverr: overrides.marketplace.fiverr !== false,
      upwork: overrides.marketplace.upwork === true
    };
  }
  if (overrides.pricing && typeof overrides.pricing === 'object') {
    out.pricing = {};
    ['starter', 'growth', 'signature'].forEach(function (k) {
      const n = Number(overrides.pricing[k]);
      if (Number.isInteger(n) && n > 0 && n < 100000) out.pricing[k] = n;
    });
  }
  if (typeof overrides.announcement === 'string' && overrides.announcement.trim().length > 0) {
    out.announcement = overrides.announcement.trim().slice(0, 200);
  }
  if (overrides.studio && typeof overrides.studio === 'object') {
    out.studio = {};
    if (typeof overrides.studio.status === 'string') {
      out.studio.status = overrides.studio.status === 'open' ? 'open' : 'closed';
    }
    if (typeof overrides.studio.statusLabel === 'string') {
      out.studio.statusLabel = overrides.studio.statusLabel.slice(0, 80);
    }
  }
  return out;
}

module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return methodNotAllowed(res, ['GET', 'HEAD']);
  }

  const config = JSON.parse(JSON.stringify(DEFAULTS));

  if (redisConfigured()) {
    try {
      const r = await redis(['GET', 'as:config:public']);
      if (r && r.result) {
        const overrides = sanitiseOverrides(JSON.parse(r.result));
        if (overrides.links) Object.assign(config.links, overrides.links);
        if (overrides.marketplace) Object.assign(config.marketplace, overrides.marketplace);
        if (overrides.pricing) Object.assign(config.pricing, overrides.pricing);
        if (overrides.studio) Object.assign(config.studio, overrides.studio);
        if (overrides.announcement !== undefined) config.announcement = overrides.announcement;
      }
    } catch (_) {
      /* fall through to defaults — a storage outage must never break the site */
    }
  }

  /* If a marketplace is switched off, do not even leak its URL. */
  if (!config.marketplace.upwork) {
    config.links.upwork = null;
  }

  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300');
  return json(res, 200, config);
};
