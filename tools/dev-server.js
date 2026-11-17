#!/usr/bin/env node

/**
 * Local development server for AS Studio.
 *
 * Runs the real /api/* handlers plus the static site, so you get exactly the
 * behaviour Vercel gives you — without needing `vercel dev` or a paid account.
 *
 *   node tools/dev-server.js          → http://localhost:3000
 *   PORT=8080 node tools/dev-server.js
 *
 * This is a DEVELOPMENT tool. It is never deployed: Vercel ignores the
 * tools/ directory and runs each api/*.js as its own serverless function.
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_PORT = parseInt(process.env.DEFAULT_APP_PORT, 10) || 3000;
const RAW_ENV_PORT = parseInt(process.env.PORT, 10);
const ENV_NGINX_PORT = parseInt(process.env.NGINX_PORT, 10);
let activePort = (RAW_ENV_PORT && RAW_ENV_PORT !== ENV_NGINX_PORT) ? RAW_ENV_PORT : DEFAULT_PORT;

/* Internal/non-public paths that must never be served over HTTP */
const BLOCKED_PREFIXES = ['/api/../', '/lib/', '/tools/', '/.aistudio/', '/.git/'];
const BLOCKED_EXACT = new Set([
  '/.env', '/.env.example', '/.env.local', '/.gitignore', '/.vercelignore',
  '/firebase-applet-config.json', '/firebase-blueprint.json', '/firebase.json',
  '/firestore.rules', '/metadata.json', '/package.json', '/package-lock.json',
  '/bun.lock', '/vercel.json', '/README.md', '/MIGRATION.md'
]);

/* Load .env if present (no dependency needed) */
(function loadEnv() {
  const file = path.join(ROOT, '.env');
  if (!fs.existsSync(file)) return;
  fs.readFileSync(file, 'utf8').split('\n').forEach(function (line) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) return;
    let value = m[2].trim().replace(/^["']|["']$/g, '');
    if (process.env[m[1]] === undefined) process.env[m[1]] = value;
  });
  console.log('  .env loaded');
})();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.mp4':  'video/mp4',
  '.txt':  'text/plain; charset=utf-8',
  '.xml':  'application/xml; charset=utf-8'
};

/* routes that mirror vercel.json */
const REWRITES = {
  '/demos': 'demos/index.html',
  '/demos/': 'demos/index.html',
  '/demos/mitti': 'demos/mitti.html',
  '/demos/rao': 'demos/rao.html',
  '/demos/vitalcare': 'demos/vitalcare.html',
  '/demos/atelier': 'demos/atelier.html',
  '/demos/apex': 'demos/apex.html',
  '/demos/delta': 'demos/delta.html',
  '/packages': 'packages.html',
  '/work': 'work.html',
  '/about': 'about.html',
  '/contact': 'contact.html',
  '/admin': 'admin.html',
  '/legal/privacy': 'legal/privacy.html',
  '/legal/terms': 'legal/terms.html',
  '/legal/refund': 'legal/refund.html',
  '/legal/disclaimer': 'legal/disclaimer.html'
};

function readBody(req) {
  return new Promise(function (resolve) {
    let raw = '';
    req.on('data', function (c) { raw += c; if (raw.length > 1e6) req.destroy(); });
    req.on('end', function () {
      const ct = req.headers['content-type'] || '';
      if (ct.includes('application/json') && raw) {
        try { resolve(JSON.parse(raw)); } catch (_) { resolve(raw); }
      } else resolve(raw || undefined);
    });
    req.on('error', function () { resolve(undefined); });
  });
}

const server = http.createServer(async function (req, res) {
  const parsed = url.parse(req.url, true);
  let pathname = '/';
  try {
    pathname = decodeURIComponent(parsed.pathname || '/');
  } catch (_) {
    res.writeHead(400); return res.end('Bad request');
  }

  /* ---------- API ---------- */
  if (pathname.startsWith('/api/')) {
    const file = path.join(ROOT, pathname + '.js');
    if (!file.startsWith(path.join(ROOT, 'api')) || !fs.existsSync(file)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'No such endpoint' }));
    }
    req.body = await readBody(req);
    req.query = parsed.query;

    /* Vercel-style res helpers */
    let sent = false;
    res.status = function (c) { res.statusCode = c; return res; };
    res.json = function (payload) {
      if (sent) return res;
      sent = true;
      if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(payload));
      return res;
    };
    res.send = function (payload) { return res.json(payload); };

    try {
      const handler = require(file);
      await handler(req, res);
      if (!sent) res.end();
    } catch (err) {
      console.error('[dev] API error', err);
      if (!sent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal error', detail: err.message }));
      }
    }
    console.log(`${req.method} ${pathname} → ${res.statusCode}`);
    return;
  }

  /* ---------- block non-public files ---------- */
  if (
    BLOCKED_EXACT.has(pathname) ||
    pathname.startsWith('/.') ||
    BLOCKED_PREFIXES.some(function (p) { return pathname.startsWith(p); })
  ) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Not found');
  }

  /* ---------- static ---------- */
  if (pathname === '/') pathname = '/index.html';
  if (REWRITES[pathname]) pathname = '/' + REWRITES[pathname];

  let file = path.join(ROOT, pathname);

  /* path traversal guard */
  if (!file.startsWith(ROOT)) {
    res.writeHead(403); return res.end('Forbidden');
  }

  /* directory index */
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, 'index.html');
  }
  /* extensionless .html */
  if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html';

  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    const notFound = path.join(ROOT, '404.html');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : 'Not found');
  }

  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
  });
  fs.createReadStream(file).pipe(res);
});

function onListening() {
  console.log('\n  AS Studio dev server');
  console.log('  ─────────────────────────────');
  console.log(`  Site    http://localhost:${activePort}`);
  console.log(`  Console http://localhost:${activePort}/admin`);
  console.log(`  API     http://localhost:${activePort}/api/public/config`);
  console.log('\n  Admin login needs ADMIN_EMAIL / ADMIN_PASSWORD_HASH /');
  console.log('  ADMIN_SESSION_SECRET in .env — generate the hash with:');
  console.log('    node tools/hash-password.js\n');
}

server.on('error', function (err) {
  if (err && err.code === 'EADDRINUSE' && activePort !== DEFAULT_PORT) {
    console.warn(`  [dev] Port ${activePort} in use, switching to ${DEFAULT_PORT}`);
    activePort = DEFAULT_PORT;
    server.listen(activePort, '0.0.0.0', onListening);
  } else {
    throw err;
  }
});

server.listen(activePort, '0.0.0.0', onListening);
