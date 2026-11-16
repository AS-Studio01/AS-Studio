/**
 * GET /api/auth/me — returns the current session, or 401.
 * The admin UI polls this to decide whether to render the dashboard.
 */
'use strict';

const { json, methodNotAllowed, getSession } = require('../../lib/core');

module.exports = (req, res) => {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  const session = getSession(req);
  if (!session) return json(res, 401, { authenticated: false });
  return json(res, 200, {
    authenticated: true,
    email: session.email,
    expiresAt: new Date(session.exp).toISOString()
  });
};
