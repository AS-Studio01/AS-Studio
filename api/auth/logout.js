/**
 * POST /api/auth/logout — clears the session cookie.
 */
'use strict';

const { json, methodNotAllowed, sessionCookie } = require('../../lib/core');

module.exports = (req, res) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  res.setHeader('Set-Cookie', sessionCookie('', 0));
  return json(res, 200, { ok: true });
};
