import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

import publicConfigHandler from '../api/public/config.js';
import publicInquiryHandler from '../api/public/inquiry.js';
import authLoginHandler from '../api/auth/login.js';
import authLogoutHandler from '../api/auth/logout.js';
import authMeHandler from '../api/auth/me.js';
import adminConfigHandler from '../api/admin/config.js';
import adminInquiriesHandler from '../api/admin/inquiries.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2'
};

const API_ROUTES = new Map([
  ['/api/public/config', publicConfigHandler],
  ['/api/public/inquiry', publicInquiryHandler],
  ['/api/auth/login', authLoginHandler],
  ['/api/auth/logout', authLogoutHandler],
  ['/api/auth/me', authMeHandler],
  ['/api/admin/config', adminConfigHandler],
  ['/api/admin/inquiries', adminInquiriesHandler]
]);

const REWRITES = new Map([
  ['/', 'index.html'],
  ['/packages', 'packages.html'],
  ['/packages/', 'packages.html'],
  ['/work', 'work.html'],
  ['/work/', 'work.html'],
  ['/about', 'about.html'],
  ['/about/', 'about.html'],
  ['/contact', 'contact.html'],
  ['/contact/', 'contact.html'],
  ['/admin', 'admin.html'],
  ['/admin/', 'admin.html'],
  ['/privacy', 'legal/privacy.html'],
  ['/privacy/', 'legal/privacy.html'],
  ['/terms', 'legal/terms.html'],
  ['/terms/', 'legal/terms.html'],
  ['/refund', 'legal/refund.html'],
  ['/refund/', 'legal/refund.html'],
  ['/disclaimer', 'legal/disclaimer.html'],
  ['/disclaimer/', 'legal/disclaimer.html'],
  ['/legal/cancellation-refund', 'legal/refund.html'],
  ['/demos', 'demos/index.html'],
  ['/demos/', 'demos/index.html'],
  ['/demos/mitti', 'demos/mitti.html'],
  ['/demos/rao', 'demos/rao.html'],
  ['/demos/vitalcare', 'demos/vitalcare.html'],
  ['/demos/atelier', 'demos/atelier.html'],
  ['/demos/apex', 'demos/apex.html'],
  ['/demos/delta', 'demos/delta.html'],
  ['/404', '404.html']
]);

const REDIRECTS = new Map([
  ['/index.html', '/'],
  ['/packages.html', '/packages'],
  ['/work.html', '/work'],
  ['/about.html', '/about'],
  ['/contact.html', '/contact'],
  ['/admin.html', '/admin'],
  ['/legal/privacy.html', '/privacy'],
  ['/legal/terms.html', '/terms'],
  ['/legal/refund.html', '/refund'],
  ['/legal/disclaimer.html', '/disclaimer'],
  ['/legal/cancellation-refund.html', '/refund'],
  ['/demos/index.html', '/demos'],
  ['/demos/mitti.html', '/demos/mitti'],
  ['/demos/rao.html', '/demos/rao'],
  ['/demos/vitalcare.html', '/demos/vitalcare'],
  ['/demos/atelier.html', '/demos/atelier'],
  ['/demos/apex.html', '/demos/apex'],
  ['/demos/delta.html', '/demos/delta']
]);

const BLOCKED_PREFIXES = [
  '/.env',
  '/.data',
  '/.git',
  '/.aistudio',
  '/lib/',
  '/tools/',
  '/api/',
  '/node_modules/',
  '/package.json',
  '/package-lock.json',
  '/bun.lock',
  '/firebase-applet-config.json',
  '/firebase-blueprint.json',
  '/firebase.json',
  '/firestore.rules',
  '/vercel.json',
  '/metadata.json'
];

function applyCommonHeaders(res, pathname) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/')) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
  } else if (pathname.startsWith('/demos')) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }
}

async function sendFile(res, relPath, statusCode = 200) {
  const fullPath = path.resolve(ROOT_DIR, relPath);
  if (!fullPath.startsWith(ROOT_DIR + path.sep) && fullPath !== ROOT_DIR) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }
  try {
    const stat = await fs.stat(fullPath);
    if (!stat.isFile()) {
      return sendNotFound(res);
    }
    const ext = path.extname(fullPath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    const content = await fs.readFile(fullPath);
    res.statusCode = statusCode;
    res.setHeader('Content-Type', mime);
    if (ext === '.html' && !res.getHeader('Cache-Control')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    } else if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.woff2'].includes(ext)) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
    res.end(content);
  } catch {
    await sendNotFound(res);
  }
}

async function sendNotFound(res) {
  try {
    const html = await fs.readFile(path.join(ROOT_DIR, '404.html'));
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(html);
  } catch {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('404 Not Found');
  }
}

export function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    let pathname = '/';
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      res.statusCode = 400;
      res.end('Bad Request');
      return;
    }

    applyCommonHeaders(res, pathname);

    // Route /api/* endpoints directly
    const apiHandler = API_ROUTES.get(pathname);
    if (apiHandler) {
      req.query = Object.fromEntries(url.searchParams.entries());
      return apiHandler(req, res);
    }

    if (pathname.startsWith('/api/')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ ok: false, error: 'Endpoint not found' }));
      return;
    }

    // Redirect explicit .html requests to clean URLs
    const redirectTarget = REDIRECTS.get(pathname);
    if (redirectTarget) {
      res.statusCode = 301;
      res.setHeader('Location', `${redirectTarget}${url.search}`);
      res.end();
      return;
    }

    // Block access to server source, secrets, and config internals
    if (
      pathname.includes('..') ||
      BLOCKED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix))
    ) {
      return sendNotFound(res);
    }

    // Check clean URL rewrites
    const rewriteTarget = REWRITES.get(pathname);
    if (rewriteTarget) {
      return sendFile(res, rewriteTarget, 200);
    }

    // Allow static files from /css, /js, /assets, /robots.txt, /sitemap.xml
    const staticAllowed =
      pathname.startsWith('/css/') ||
      pathname.startsWith('/js/') ||
      pathname.startsWith('/assets/') ||
      pathname === '/demos/demo.css' ||
      pathname === '/demos/demo.js' ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml';

    if (staticAllowed) {
      return sendFile(res, pathname.slice(1), 200);
    }

    return sendNotFound(res);
  });
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const port = Number(process.env.PORT || 3000);
  const host = '0.0.0.0';
  const server = createServer();
  server.listen(port, host, () => {
    console.log(`AS Studio Pro dev server listening on http://${host}:${port}`);
  });
}
