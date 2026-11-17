#!/usr/bin/env node

/**
 * AS Studio — full verification suite.
 *
 *   node tools/verify.js            run everything
 *   node tools/verify.js api        backend only
 *   node tools/verify.js site       frontend only
 *
 * Boots its own server on a spare port, so it never fights with a dev server
 * you already have running. Exits non-zero if anything fails.
 */

'use strict';

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const PORT = 4177;
const ONLY = process.argv[2] || 'all';

let passed = 0, failed = 0;
const failures = [];

function check(name, ok, detail) {
  if (ok) { passed++; console.log(`  \x1b[32m✓\x1b[0m ${name}${detail ? '  \x1b[2m' + detail + '\x1b[0m' : ''}`); }
  else { failed++; failures.push(name + (detail ? ' — ' + detail : '')); console.log(`  \x1b[31m✗ ${name}${detail ? '  ' + detail : ''}\x1b[0m`); }
}

function group(title) { console.log(`\n\x1b[1m${title}\x1b[0m`); }

/* ---------------- static checks that need no server ---------------- */

function staticChecks() {
  group('1. FILE INTEGRITY');

  const required = [
    'index.html', 'packages.html', 'work.html', 'about.html', 'contact.html',
    'admin.html', '404.html',
    'legal/privacy.html', 'legal/terms.html', 'legal/refund.html', 'legal/disclaimer.html',
    'css/site.css', 'css/admin.css',
    'js/boot.js', 'js/site.js', 'js/admin.js',
    'api/public/config.js', 'api/public/inquiry.js',
    'api/auth/login.js', 'api/auth/logout.js', 'api/auth/me.js',
    'api/admin/config.js', 'api/admin/inquiries.js',
    'lib/core.js', 'firestore.rules', 'vercel.json',
    '.env.example', '.gitignore', 'README.md', 'MIGRATION.md'
  ];
  const missing = required.filter(f => !fs.existsSync(path.join(ROOT, f)));
  check(`${required.length} required files present`, missing.length === 0, missing.join(', '));

  group('2. DEMO SITES (static)');
  const DEMOS = ['mitti', 'rao', 'vitalcare', 'atelier', 'apex', 'delta'];
  const demoFiles = DEMOS.map(d => `demos/${d}.html`).concat(['demos/index.html']);

  check('all demo pages exist', demoFiles.every(f => fs.existsSync(path.join(ROOT, f))),
        `${demoFiles.filter(f => fs.existsSync(path.join(ROOT, f))).length}/${demoFiles.length}`);
  check('shared demo stylesheet exists', fs.existsSync(path.join(ROOT, 'demos/demo.css')));
  check('shared demo script exists', fs.existsSync(path.join(ROOT, 'demos/demo.js')));

  // the six demos share demo.css + demo.js; the hub uses the main site sheet
  const demoShallow = DEMOS.map(d => `demos/${d}.html`).filter(f => {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    return !/href="demo\.css"/.test(src) || !/src="demo\.js"/.test(src);
  });
  check('every demo loads the shared stylesheet and script', demoShallow.length === 0, demoShallow.join(', '));
  const hubSrc = fs.readFileSync(path.join(ROOT, 'demos/index.html'), 'utf8');
  check('demo hub uses the main site stylesheet', /href="\.\.\/css\/site\.css"/.test(hubSrc));

  // exactly one h1 per demo, and each is noindex
  const h1Bad = [];
  const noindexBad = [];
  for (const f of demoFiles) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const h1s = (src.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1) h1Bad.push(`${f}:${h1s}`);
    if (!/<meta name="robots" content="noindex/.test(src)) noindexBad.push(f);
  }
  check('each demo page has exactly one h1', h1Bad.length === 0, h1Bad.join(', '));
  check('each demo page is noindex', noindexBad.length === 0, noindexBad.join(', '));

  // no unsafe new-tab links anywhere in the demos
  const unsafeTab = demoFiles.filter(f => {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    return /target="_blank"(?![^>]*rel="[^"]*noopener)/.test(src);
  });
  check('no target=_blank without rel=noopener', unsafeTab.length === 0, unsafeTab.join(', '));

  // relative hrefs inside demos resolve on disk
  const brokenDemoLinks = [];
  for (const f of demoFiles) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const dir = path.dirname(path.join(ROOT, f));
    const hrefs = [...src.matchAll(/href="([^"#:?][^"]*)"/g)].map(m => m[1])
      .filter(h => !h.startsWith('http') && !h.startsWith('mailto:') && !h.startsWith('tel:') && !h.startsWith('#'));
    for (const h of new Set(hrefs)) {
      const target = path.resolve(dir, h.split('#')[0]);
      const candidates = [target, target + '.html', path.join(target, 'index.html')];
      if (!candidates.some(c => fs.existsSync(c) && fs.statSync(c).isFile())) {
        brokenDemoLinks.push(`${path.basename(f)} → ${h}`);
      }
    }
  }
  check('all demo links resolve', brokenDemoLinks.length === 0, brokenDemoLinks.slice(0, 4).join(', '));

  // work.html commissions all six
  const workSrc = fs.readFileSync(path.join(ROOT, 'work.html'), 'utf8');
  const linked = DEMOS.filter(d => workSrc.includes(`demos/${d}.html`));
  check('work.html links all six demos', linked.length === 6, `${linked.length}/6`);
  check('work.html has no demo card pointing at /contact', !/class="demo-card" href="\/contact"/.test(workSrc));

  group('3. SEO + CRAWL FILES');

  const robots = fs.existsSync(path.join(ROOT, 'robots.txt')) ? fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8') : '';
  check('robots.txt exists', robots.length > 0);
  check('robots.txt blocks the demo folder', /Disallow:\s*\/demos\//.test(robots));
  check('robots.txt blocks the admin console', /Disallow:\s*\/admin/.test(robots));
  check('robots.txt points at the sitemap', /Sitemap:\s*https:\/\//.test(robots));

  let sitemapOk = false, sitemapCount = 0;
  try {
    const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
    sitemapCount = (xml.match(/<loc>/g) || []).length;
    sitemapOk = /^<\?xml/.test(xml.trim()) && /<urlset/.test(xml) && sitemapCount >= 8;
  } catch (_) {}
  check('sitemap.xml is valid and lists the site', sitemapOk, `${sitemapCount} urls`);
  const smSrc = sitemapOk ? fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8') : '';
  check('sitemap excludes admin, 404 and demos',
        !/\/admin<|\/404<|\/demos\//.test(smSrc));

  // every sitemap path must actually exist on disk
  const smPaths = [...smSrc.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(m => m[1].replace(/^https?:\/\/[^/]+/, '').replace(/^\//, ''));
  const smMissing = smPaths.filter(p => {
    const f = p === '' ? 'index.html' : `${p.replace(/\/$/, '')}.html`;
    return !fs.existsSync(path.join(ROOT, f));
  });
  check('every sitemap url resolves to a file', smMissing.length === 0, smMissing.join(', '));

  group('4. JAVASCRIPT SYNTAX');
  const jsFiles = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.js')) jsFiles.push(full);
    }
  })(ROOT);

  const { execFileSync } = require('child_process');
  let badSyntax = [];
  for (const f of jsFiles) {
    try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }); }
    catch (e) { badSyntax.push(path.relative(ROOT, f)); }
  }
  check(`${jsFiles.length} JS files parse`, badSyntax.length === 0, badSyntax.join(', '));

  group('5. SECRET LEAKS IN PUBLIC FILES');
  const NON_PUBLIC_ROOT = new Set([
    'firebase-applet-config.json', 'firebase-blueprint.json', 'firebase.json',
    'metadata.json', 'package.json', 'package-lock.json', 'vercel.json'
  ]);
  const publicFiles = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (['node_modules', 'assets', '.git'].includes(entry.name) || entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { if (!['api', 'lib', 'tools'].includes(entry.name)) walk(full); }
      else if (/\.(html|css|js|json)$/.test(entry.name)) {
        if (dir === ROOT && NON_PUBLIC_ROOT.has(entry.name)) continue;
        publicFiles.push(full);
      }
    }
  })(ROOT);

  const patterns = [
    [/AIza[0-9A-Za-z_-]{30,}/, 'Firebase API key'],
    [/BEGIN (RSA )?PRIVATE KEY/, 'private key'],
    [/scrypt\$[a-f0-9]{20,}/i, 'password hash'],
    [/profound-handbook-z3skh/, 'Firebase project id'],
    [/UPSTASH_REDIS_REST_TOKEN\s*=\s*\S+/, 'Upstash token'],
    [/ADMIN_SESSION_SECRET\s*=\s*\S+/, 'session secret'],
    [/firestore\.googleapis\.com/, 'Firestore endpoint'],
    [/service_account/, 'service account marker']
  ];
  const leaks = [];
  for (const f of publicFiles) {
    const text = fs.readFileSync(f, 'utf8');
    for (const [re, label] of patterns) {
      if (re.test(text)) leaks.push(`${path.relative(ROOT, f)}: ${label}`);
    }
  }
  check(`${publicFiles.length} browser-served files clean`, leaks.length === 0, leaks.join('; '));

  group('6. FIRESTORE RULES');
  const rules = fs.readFileSync(path.join(ROOT, 'firestore.rules'), 'utf8');
  const stripped = rules.replace(/\/\/.*$/gm, '');
  check('declares rules_version 2', (stripped.match(/rules_version/g) || []).length === 1,
        (stripped.match(/rules_version/g) || []).length + ' declaration(s)');
  check('denies all client access', /allow read, write: if false/.test(stripped));
  check('no lingering allow: if true', !/allow[^;]*:\s*if\s+true/.test(stripped));

  group('7. VERCEL CONFIG');
  let vc = null;
  try { vc = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8')); } catch (_) {}
  check('valid JSON', !!vc);
  if (vc) {
    const allHeaders = vc.headers.find(h => h.source === '/(.*)');
    const keys = allHeaders ? allHeaders.headers.map(h => h.key.toLowerCase()) : [];
    ['content-security-policy', 'strict-transport-security', 'x-content-type-options',
     'x-frame-options', 'referrer-policy', 'permissions-policy',
     'cross-origin-opener-policy'].forEach(h => check(`header: ${h}`, keys.includes(h)));

    const csp = allHeaders && allHeaders.headers.find(h => h.key === 'Content-Security-Policy');
    if (csp) {
      check('CSP forbids inline script', !/script-src[^;]*unsafe-inline/.test(csp.value));
      check('CSP sets frame-ancestors none', /frame-ancestors 'none'/.test(csp.value));
      check('CSP sets object-src none', /object-src 'none'/.test(csp.value));
    }

    const adminRule = vc.headers.find(h => h.source === '/admin');
    check('/admin sets noindex', !!adminRule && adminRule.headers.some(h => h.key === 'X-Robots-Tag'));

    // every rewrite target must exist on disk
    const badTargets = (vc.rewrites || []).filter(r => {
      const target = r.destination.replace(/^\//, '');
      return !fs.existsSync(path.join(ROOT, target));
    });
    check(`${(vc.rewrites || []).length} rewrite targets exist`, badTargets.length === 0,
          badTargets.map(b => b.destination).join(', '));
  }

  group('8. HTML STRUCTURE');
  const pages = ['index.html', 'packages.html', 'work.html', 'about.html',
                 'contact.html', 'admin.html', '404.html',
                 'legal/privacy.html', 'legal/terms.html', 'legal/refund.html',
                 'legal/disclaimer.html'];
  const htmlProblems = [];
  for (const p of pages) {
    const html = fs.readFileSync(path.join(ROOT, p), 'utf8');
    // admin.html has two mutually-exclusive views (login gate + console),
    // each needing its own h1, so it is exempt from the single-h1 rule here.
    // The rendered check below verifies only one h1 is *visible* at a time.
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (p === 'admin.html') {
      if (h1 < 1 || h1 > 2) htmlProblems.push(`${p}: ${h1} h1`);
    } else if (h1 !== 1) {
      htmlProblems.push(`${p}: ${h1} h1`);
    }
    if (!/lang="en"/.test(html)) htmlProblems.push(`${p}: no lang`);
    if (!/<title>/.test(html)) htmlProblems.push(`${p}: no title`);
    if (!/name="viewport"/.test(html)) htmlProblems.push(`${p}: no viewport`);
    if (!/name="description"/.test(html)) htmlProblems.push(`${p}: no description`);
    // no inline executable script (JSON-LD is data, allowed)
    const inline = html.match(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>/g);
    if (inline) htmlProblems.push(`${p}: ${inline.length} inline script(s)`);
    // duplicate ids within a page
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupes.length) htmlProblems.push(`${p}: duplicate id ${[...new Set(dupes)].join(',')}`);
  }
  check(`${pages.length} pages structurally valid`, htmlProblems.length === 0, htmlProblems.join('; '));

  group('9. FORM ACCESSIBILITY');
  const contact = fs.readFileSync(path.join(ROOT, 'contact.html'), 'utf8');
  const inputIds = [...contact.matchAll(/<(?:input|select|textarea)[^>]*\sid="([^"]+)"[^>]*>/g)]
    .map(m => m[1]).filter(id => id !== 'website');   // honeypot is intentionally hidden
  const unlabelled = inputIds.filter(id => !contact.includes(`for="${id}"`));
  check(`${inputIds.length} form fields labelled`, unlabelled.length === 0, unlabelled.join(', '));
  check('honeypot present and hidden', /class="hp"/.test(contact) && /name="website"/.test(contact));
  check('form has novalidate (custom validation)', /novalidate/.test(contact));
}

/* ---------------- server checks ---------------- */

let nextPort = PORT;

function startServer(env) {
  const usePort = nextPort++;
  return new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, [path.join(ROOT, 'tools/dev-server.js')], {
      cwd: ROOT,
      env: Object.assign({}, process.env, env, { PORT: String(usePort) }),
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let out = '';
    const timer = setTimeout(() => reject(new Error('server did not start: ' + out)), 12000);

    proc.stdout.on('data', d => {
      out += d.toString();
      if (out.includes('AS Studio dev server')) {
        clearTimeout(timer);
        proc.port = usePort;
        resolve(proc);
      }
    });
    proc.stderr.on('data', d => { out += d.toString(); });
    proc.on('exit', c => { clearTimeout(timer); reject(new Error('server exited ' + c + ': ' + out)); });
  });
}

let activePort = PORT;

function request(method, urlPath, body, cookie) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({
      host: 'localhost', port: activePort, path: urlPath, method,
      headers: Object.assign(
        { 'Content-Type': 'application/json' },
        data ? { 'Content-Length': Buffer.byteLength(data) } : {},
        cookie ? { Cookie: cookie } : {}
      )
    }, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(raw); } catch (_) {}
        resolve({ status: res.statusCode, headers: res.headers, body: json, raw });
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function serverChecks() {
  const core = require(path.join(ROOT, 'lib/core.js'));
  const env = {
    ADMIN_EMAIL: 'verify@as-studio.test',
    ADMIN_SESSION_SECRET: crypto.randomBytes(32).toString('hex'),
    ADMIN_PASSWORD_HASH: core.hashPassword('verify-password-9876')
  };

  let proc;
  try { proc = await startServer(env); activePort = proc.port; }
  catch (e) { check('server starts', false, e.message); return; }

  try {
    group('10. PUBLIC API');

    let r = await request('GET', '/api/public/config');
    check('GET /api/public/config → 200', r.status === 200, String(r.status));
    check('prices present', r.body && r.body.pricing && r.body.pricing.starter === 95,
          JSON.stringify(r.body && r.body.pricing));
    check('no secret material in payload',
          !/AIza|private_key|scrypt|ADMIN_|UPSTASH/i.test(r.raw));
    check('upwork hidden while disabled', r.body && r.body.links && r.body.links.upwork === null);

    r = await request('POST', '/api/public/config', {});
    check('POST config → 405', r.status === 405, String(r.status));
    check('405 sends Allow header', !!r.headers.allow, r.headers.allow);

    group('11. AUTHENTICATION');

    r = await request('POST', '/api/auth/login', { email: 'x@y.z', password: 'nope' });
    check('unknown email → 401', r.status === 401, String(r.status));
    const unknownMsg = (r.body && r.body.error) || '';

    r = await request('POST', '/api/auth/login', { email: 'verify@as-studio.test', password: 'wrong-pass' });
    check('wrong password → 401', r.status === 401, String(r.status));
    const wrongMsg = (r.body && r.body.error) || '';
    check('identical error text (no enumeration)', unknownMsg === wrongMsg && unknownMsg.length > 0,
          `"${unknownMsg}"`);

    r = await request('POST', '/api/auth/login', { email: 'verify@as-studio.test', password: 'verify-password-9876' });
    check('correct password → 200', r.status === 200, String(r.status));
    const setCookie = [].concat(r.headers['set-cookie'] || [])[0] || '';
    check('HttpOnly', /HttpOnly/i.test(setCookie));
    check('Secure', /Secure/i.test(setCookie));
    check('SameSite=Strict', /SameSite=Strict/i.test(setCookie));
    check('no password echoed back', !/verify-password/.test(r.raw));
    const cookie = setCookie.split(';')[0];

    group('12. SESSION ENFORCEMENT');

    r = await request('GET', '/api/auth/me');
    check('me without cookie → 401', r.status === 401, String(r.status));

    r = await request('GET', '/api/auth/me', null, cookie);
    check('me with cookie → authenticated', r.status === 200 && r.body && r.body.authenticated === true);

    const [name] = cookie.split('=');
    r = await request('GET', '/api/auth/me', null, `${name}=eyJzdWIiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OTk5OTl9.ZmFrZQ`);
    check('forged cookie → 401', r.status === 401, String(r.status));

    r = await request('GET', '/api/auth/me', null, `${name}=`);
    check('empty cookie → 401', r.status === 401, String(r.status));

    group('13. ADMIN AUTHORISATION');

    for (const [method, p] of [['GET', '/api/admin/config'], ['PATCH', '/api/admin/config'],
                               ['GET', '/api/admin/inquiries']]) {
      r = await request(method, p, method === 'PATCH' ? {} : null);
      check(`${method} ${p} anonymous → 401`, r.status === 401, String(r.status));
    }

    r = await request('GET', '/api/admin/config', null, cookie);
    check('GET config authorised → 200', r.status === 200, String(r.status));
    check('returns effective config (not empty)',
          r.body && r.body.config && r.body.config.pricing && r.body.config.pricing.starter === 95);
    check('returns telegram + email defaults',
          r.body && r.body.config.studio && !!r.body.config.studio.telegram && !!r.body.config.studio.email);

    group('14. INPUT VALIDATION');

    r = await request('PATCH', '/api/admin/config', { pricing: { starter: -1 } }, cookie);
    check('negative price → 422', r.status === 422, String(r.status));

    r = await request('PATCH', '/api/admin/config', { pricing: { starter: 0 } }, cookie);
    check('zero price → 422', r.status === 422, String(r.status));

    r = await request('PATCH', '/api/admin/config', { pricing: { starter: 1e9 } }, cookie);
    check('absurd price → 422', r.status === 422, String(r.status));

    r = await request('PATCH', '/api/admin/config', { pricing: { starter: 'abc' } }, cookie);
    check('non-numeric price → 422', r.status === 422, String(r.status));

    r = await request('PATCH', '/api/admin/config', { pricing: { starter: 12.5 } }, cookie);
    check('fractional price → 422', r.status === 422, String(r.status));

    for (const bad of ['javascript:alert(1)', 'data:text/html,<script>', 'vbscript:x',
                       '//evil.com', 'file:///etc/passwd']) {
      r = await request('PATCH', '/api/admin/config', { links: { fiverr: bad } }, cookie);
      check(`rejects ${bad.slice(0, 22)}…`, r.status === 422, String(r.status));
    }

    r = await request('PATCH', '/api/admin/config', { studio: { email: 'not-an-email' } }, cookie);
    check('invalid email → 422', r.status === 422, String(r.status));

    r = await request('PATCH', '/api/admin/config', { studio: { status: 'hacked' } }, cookie);
    check('invalid status → 422', r.status === 422, String(r.status));

    group('15. PUBLIC INQUIRY');

    r = await request('POST', '/api/public/inquiry', {});
    check('empty → 422', r.status === 422, String(r.status));
    check('per-field errors returned', !!(r.body && r.body.fields && Object.keys(r.body.fields).length >= 4),
          JSON.stringify(r.body && r.body.fields));

    r = await request('POST', '/api/public/inquiry', {
      clientName: 'A', businessName: 'B', contactChannel: 'email',
      contactValue: 'bad', scopeSummary: 'x'
    });
    check('too-short fields → 422', r.status === 422, String(r.status));

    r = await request('POST', '/api/public/inquiry', {
      clientName: 'Test Person', businessName: 'Test Ltd',
      contactChannel: 'email', contactValue: 'person@example.com',
      scopeSummary: 'A detailed enough project description to pass the minimum length.',
      website: 'http://spam.example'
    });
    check('honeypot filled → silently discarded', r.status === 200 && !r.body.created,
          `status ${r.status}, created ${r.body && r.body.created}`);

    r = await request('POST', '/api/public/inquiry', {
      clientName: '<script>alert(1)</script>', businessName: 'XSS Test',
      contactChannel: 'email', contactValue: 'x@example.com',
      scopeSummary: '<img src=x onerror=alert(1)> <script>bad()</script> enough words here okay'
    });
    check('accepted or rejected without crashing', [200, 422, 503].includes(r.status), String(r.status));
    check('no raw script tag echoed back', !r.raw.includes('<script>'));

    r = await request('GET', '/api/public/inquiry');
    check('GET inquiry → 405', r.status === 405, String(r.status));

    group('16. LOGOUT');

    r = await request('POST', '/api/auth/logout', null, cookie);
    check('logout → 200', r.status === 200, String(r.status));
    const cleared = [].concat(r.headers['set-cookie'] || [])[0] || '';
    check('cookie cleared', /Max-Age=0|Expires=Thu, 01 Jan 1970/i.test(cleared));

    group('17. RATE LIMITING');

    const loginHits = [];
    for (let i = 0; i < 10; i++) {
      const rr = await request('POST', '/api/auth/login', { email: 'verify@as-studio.test', password: 'bad' });
      loginHits.push(rr.status);
    }
    check('login rate-limits within 10 attempts', loginHits.includes(429), loginHits.join(','));

    group('18. STATIC ROUTING');

    for (const p of ['/', '/packages', '/work', '/about', '/contact', '/admin',
                     '/legal/privacy', '/legal/refund', '/legal/terms', '/legal/disclaimer']) {
      r = await request('GET', p);
      check(`GET ${p} → 200`, r.status === 200, String(r.status));
    }

    r = await request('GET', '/does-not-exist');
    check('unknown path → 404', r.status === 404, String(r.status));
    check('404 page has content', r.raw.includes('doesn'), String(r.raw.length) + ' bytes');

    r = await request('GET', '/../package.json');
    check('path traversal blocked', r.status === 403 || r.status === 404, String(r.status));

    r = await request('GET', '/api/nope');
    check('unknown API → 404', r.status === 404, String(r.status));
  } finally {
    if (proc) proc.kill();
  }
}

/* ---------------- rendered checks (needs playwright) ---------------- */

async function renderedChecks() {
  let chromium;
  try { ({ chromium } = require('playwright')); }
  catch (_) {
    console.log('\n\x1b[2m(skipping rendered checks — playwright not installed)\x1b[0m');
    return;
  }

  let proc;
  try { proc = await startServer({}); activePort = proc.port; }
  catch (e) { check('rendered: server starts', false, e.message); return; }

  const b = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    group('19. CONTRAST (WCAG AA, computed)');
    const contrastPages = [['/', 'Home'], ['/packages', 'Packages'], ['/work', 'Work'],
                           ['/about', 'About'], ['/contact', 'Contact'], ['/legal/refund', 'Refund']];
    for (const [path, name] of contrastPages) {
      const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
      await pg.goto(`http://localhost:${activePort}${path}`, { waitUntil: 'networkidle' });
      await pg.waitForTimeout(400);
      const bad = await pg.evaluate(() => {
        function srgb(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
        function lum(rgb) { return 0.2126 * srgb(rgb[0]) + 0.7152 * srgb(rgb[1]) + 0.0722 * srgb(rgb[2]); }
        function parse(s) { const m = s.match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : null; }
        function surface(el) {
          let n = el;
          while (n && n !== document.documentElement) {
            const cs = getComputedStyle(n);
            if (cs.backgroundImage && cs.backgroundImage !== 'none') return { type: 'dark' };
            const m = cs.backgroundColor.match(/[\d.]+/g);
            if (m && !(m[0]==='0'&&m[1]==='0'&&m[2]==='0'&&m[3]==='0')) {
              const a = m.length > 3 ? parseFloat(m[3]) : 1;
              if (a > 0.9) return { type: lum(m.slice(0,3).map(Number)) < 0.35 ? 'dark' : 'light' };
            }
            n = n.parentElement;
          }
          return { type: 'light' };
        }
        const out = [];
        for (const el of document.querySelectorAll('p,li,span,a,h1,h2,h3,h4,label,summary,small,div,legend,button')) {
          if (el.children.length > 0) continue;
          const text = (el.textContent || '').trim();
          if (text.length < 2) continue;
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || el.offsetParent === null) continue;
          if (el.classList.contains('grad')) continue;
          if (/gradient/.test(cs.webkitBackgroundClip || cs.backgroundClip || '')) continue;
          const fgRaw = parse(cs.color);
          if (!fgRaw) continue;
          const fgA = parseFloat((cs.color.match(/[\d.]+\)$/) || ['1)'])[0]);
          const surf = surface(el);
          const base = surf.type === 'dark' ? [13, 21, 51] : [247, 248, 252];
          const fg = fgA < 1 ? fgRaw.map((c, i) => Math.round(c * fgA + base[i] * (1 - fgA))) : fgRaw;
          const bg = surf.type === 'dark' ? [13, 21, 51] : [255, 255, 255];
          const l1 = lum(fg), l2 = lum(bg);
          const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          const size = parseFloat(cs.fontSize);
          const bold = parseInt(cs.fontWeight, 10) >= 700;
          const need = (size >= 24 || (size >= 18.66 && bold)) ? 3.0 : 4.5;
          if (ratio < need - 0.01) out.push(`${text.slice(0,26)} ${ratio.toFixed(2)}:1`);
        }
        return out;
      });
      check(`${name}: all text meets AA`, bad.length === 0, bad.slice(0, 4).join(' | '));
      await pg.close();
    }

    group('20. TAP TARGETS (WCAG 2.5.8, 44px)');
    for (const [path, name] of contrastPages) {
      const pg = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      await pg.goto(`http://localhost:${activePort}${path}`, { waitUntil: 'networkidle' });
      await pg.waitForTimeout(300);
      const small = await pg.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll('a[href],button,input,select,textarea,summary')) {
          if (el.closest('.hp')) continue;
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || el.offsetParent === null) continue;
          if (r.width === 0 || r.height === 0) continue;
          if (el.closest('p,li,.prose') && el.tagName === 'A') continue;  // inline-text exception
          if (r.height < 44 || r.width < 44) out.push(`${el.tagName} "${(el.textContent||'').trim().slice(0,18)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
        return out;
      });
      check(`${name}: all targets ≥ 44px`, small.length === 0, small.slice(0, 4).join(' | '));
      await pg.close();
    }

    group('21. LAYOUT AT EVERY BREAKPOINT');
    for (const w of [320, 375, 390, 414, 768, 1024, 1440, 1920]) {
      const pg = await b.newPage({ viewport: { width: w, height: 900 } });
      await pg.goto(`http://localhost:${activePort}/`, { waitUntil: 'networkidle' });
      await pg.waitForTimeout(250);
      const r = await pg.evaluate(() => {
        const svg = document.querySelector('.console svg');
        const con = document.querySelector('.console');
        let nodes = 'n/a';
        if (svg && con) {
          const cr = con.getBoundingClientRect();
          const all = [...svg.querySelectorAll('text')];
          const inside = all.filter(t => {
            const tr = t.getBoundingClientRect();
            return tr.top >= cr.top - 0.5 && tr.bottom <= cr.bottom + 0.5;
          });
          nodes = `${inside.length}/${all.length}`;
        }
        return {
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          nodes
        };
      });
      check(`${w}px: no overflow, constellation intact`,
            r.overflow <= 0 && (r.nodes === 'n/a' || r.nodes.split('/')[0] === r.nodes.split('/')[1]),
            `overflow ${r.overflow}px, nodes ${r.nodes}`);
      await pg.close();
    }

    group('22. ADMIN PANEL (logged in)');
    {
      const env = {
        ADMIN_EMAIL: 'verify@as-studio.test',
        ADMIN_SESSION_SECRET: crypto.randomBytes(32).toString('hex'),
        ADMIN_PASSWORD_HASH: require(path.join(ROOT, 'lib/core.js')).hashPassword('verify-password-9876')
      };
      const adminProc = await startServer(env).catch(() => null);
      if (!adminProc) {
        check('admin server starts', false);
      } else {
        const adminPort = adminProc.port;
        const pg = await b.newPage({ viewport: { width: 1440, height: 1100 } });
        await pg.goto(`http://localhost:${adminPort}/admin`, { waitUntil: 'networkidle' });
        check('console starts locked', await pg.evaluate(() => !document.getElementById('gate').hidden));

        await pg.fill('#email', 'verify@as-studio.test');
        await pg.fill('#password', 'verify-password-9876');
        await pg.click('#loginBtn');
        const opened = await pg.waitForFunction(
          () => !document.getElementById('app').hidden, { timeout: 8000 }
        ).then(() => true).catch(() => false);
        check('login opens the dashboard', opened);

        if (opened) {
          await pg.waitForTimeout(1200);
          const filled = await pg.evaluate(() => ({
            starter: document.getElementById('cfgStarter').value,
            telegram: document.getElementById('cfgTelegram').value,
            email: document.getElementById('cfgEmail').value
          }));
          check('config form pre-filled', filled.starter === '95' && !!filled.telegram && !!filled.email,
                JSON.stringify(filled));

          for (const tab of ['tab-config', 'tab-inquiries']) {
            await pg.click('#' + tab, { timeout: 8000 }).catch(() => {});
            await pg.waitForTimeout(600);
            const r = await pg.evaluate(() => {
              const vis = [...document.querySelectorAll('[role="tabpanel"]')]
                .filter(p => !p.hidden).length;
              // count only h1s a user can actually perceive
              const h1 = [...document.querySelectorAll('h1')].filter(el => {
                const rect = el.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0 &&
                       getComputedStyle(el).visibility !== 'hidden';
              }).length;
              const banners = document.querySelectorAll('header').length;
              return { vis, h1, banners };
            });
            check(`${tab}: one visible panel`, r.vis === 1, String(r.vis));
            check(`${tab}: single visible h1`, r.h1 === 1, String(r.h1));
            check(`${tab}: single header landmark`, r.banners === 1, String(r.banners));
          }

          await pg.click('#logoutBtn');
          await pg.waitForTimeout(900);
          check('logout re-locks the console',
                await pg.evaluate(() => !document.getElementById('gate').hidden));
        }
        await pg.close();
        adminProc.kill();
      }
    }

    group('23. CONTENT VISIBLE WITHOUT JAVASCRIPT');
    const noJsCtx = await b.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
    const noJsPg = await noJsCtx.newPage();
    await noJsPg.goto(`http://localhost:${activePort}/`, { waitUntil: 'load' });
    await noJsPg.waitForTimeout(400);
    const hiddenCount = await noJsPg.locator('[data-rv]').evaluateAll(
      els => els.filter(e => parseFloat(getComputedStyle(e).opacity) < 0.1).length
    ).catch(() => -1);
    check('all sections render without JS', hiddenCount === 0, `${hiddenCount} hidden`);
    await noJsCtx.close();
  } finally {
    await b.close();
    if (proc) proc.kill();
  }
}

/* ---------------- demo rendering checks ---------------- */

async function demoChecks() {
  let b, proc;
  let chromium;
  try {
    ({ chromium } = require('playwright'));
    b = await chromium.launch({ args: ['--no-sandbox'] });
    proc = await startServer({});
    const port = proc.port;

    group('24. DEMO SITES (rendered)');
    const DEMOS = ['mitti', 'rao', 'vitalcare', 'atelier', 'apex', 'delta', 'index'];
    const errs = [];
    const results = [];

    for (const d of DEMOS) {
      const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
      pg.on('pageerror', e => errs.push(`${d}: ${e.message}`));
      const res = await pg.goto(`http://localhost:${port}/demos/${d}.html`, { waitUntil: 'load' });
      await pg.waitForTimeout(280);
      const state = await pg.evaluate(() => ({
        h1: document.querySelectorAll('h1').length,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        title: (document.title || '').trim().length
      }));
      results.push({ d, status: res.status(), ...state });
      await pg.close();

      // mobile overflow
      const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      await m.goto(`http://localhost:${port}/demos/${d}.html`, { waitUntil: 'load' });
      await m.waitForTimeout(280);
      const mOverflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      results[results.length - 1].mOverflow = mOverflow;
      await m.close();
    }

    check('all demo pages return 200', results.every(r => r.status === 200),
          results.filter(r => r.status !== 200).map(r => `${r.d}:${r.status}`).join(', '));
    check('all demo pages have a title', results.every(r => r.title > 4),
          results.filter(r => r.title <= 4).map(r => r.d).join(', '));
    check('each demo has one h1 when rendered', results.every(r => r.h1 === 1),
          results.filter(r => r.h1 !== 1).map(r => `${r.d}:${r.h1}`).join(', '));
    check('no horizontal overflow at 1280px', results.every(r => r.overflow <= 0),
          results.filter(r => r.overflow > 0).map(r => r.d).join(', '));
    check('no horizontal overflow at 390px', results.every(r => r.mOverflow <= 0),
          results.filter(r => r.mOverflow > 0).map(r => r.d).join(', '));
    check('no JavaScript errors across demos', errs.length === 0, errs.slice(0, 2).join(' | '));

    // one interaction per demo, to prove the shared script is wired up
    group('25. DEMO INTERACTIONS');

    const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });

    await pg.goto(`http://localhost:${port}/demos/mitti.html`, { waitUntil: 'load' });
    await pg.waitForTimeout(300);
    const statusTxt = (await pg.textContent('#statusText') || '').trim();
    await pg.click('.cat[data-cat="food"]');
    await pg.waitForTimeout(200);
    const foodRows = await pg.$$eval('.menu-row', els => els.filter(e => !e.hidden).length);
    check('mitti: live open/closed status computed', /open|closed/i.test(statusTxt), statusTxt.slice(0, 26));
    check('mitti: menu filter narrows the list', foodRows === 3, `${foodRows} food rows`);

    await pg.goto(`http://localhost:${port}/demos/rao.html`, { waitUntil: 'load' });
    await pg.waitForTimeout(250);
    const accBtn = await pg.$('button[aria-expanded]');
    const before = await accBtn.getAttribute('aria-expanded');
    await accBtn.click(); await pg.waitForTimeout(200);
    const after = await accBtn.getAttribute('aria-expanded');
    check('rao: practice-area accordion toggles', before !== after);

    await pg.goto(`http://localhost:${port}/demos/vitalcare.html`, { waitUntil: 'load' });
    await pg.waitForTimeout(350);
    await pg.click('form button[type="submit"]');
    await pg.waitForTimeout(300);
    const invalid = await pg.$$eval('form [aria-invalid="true"]', e => e.length);
    check('vitalcare: empty booking blocked', invalid > 0, `${invalid} fields flagged`);

    await pg.goto(`http://localhost:${port}/demos/atelier.html`, { waitUntil: 'load' });
    await pg.waitForTimeout(300);
    await pg.click('[data-add]');
    await pg.waitForTimeout(350);
    const count = await pg.$eval('[data-cart-count]', e => e.textContent.trim());
    const drawerShown = await pg.$eval('#drawer', e => e.getAttribute('aria-hidden') === 'false');
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
    const drawerHidden = await pg.$eval('#drawer', e => e.getAttribute('aria-hidden') === 'true');
    check('atelier: add to basket updates the count', count === '1');
    check('atelier: drawer opens then closes on Escape', drawerShown && drawerHidden);

    await pg.goto(`http://localhost:${port}/demos/apex.html`, { waitUntil: 'load' });
    await pg.waitForTimeout(350);
    const emiBefore = (await pg.textContent('#emiVal') || '').trim();
    await pg.$eval('#emiRate', e => { e.value = String(Number(e.value) + 2); e.dispatchEvent(new Event('input', { bubbles: true })); });
    await pg.waitForTimeout(250);
    const emiAfter = (await pg.textContent('#emiVal') || '').trim();
    const visiblePlans = await pg.$$eval('.plan', e => e.filter(x => !x.hidden).length);
    check('apex: EMI recalculates live', emiBefore !== emiAfter && /₹/.test(emiAfter), `${emiBefore} → ${emiAfter}`);
    check('apex: all plans visible by default', visiblePlans === 3, `${visiblePlans}/3`);

    await pg.goto(`http://localhost:${port}/demos/delta.html`, { waitUntil: 'load' });
    await pg.waitForTimeout(250);
    const monthly = (await pg.textContent('[data-month]') || '').trim();
    await pg.click('[data-period="year"]');
    await pg.waitForTimeout(250);
    const yearly = (await pg.textContent('[data-month]') || '').trim();
    check('delta: billing toggle swaps the price', monthly !== yearly && /year/i.test(yearly), `${monthly} → ${yearly}`);

    await pg.close();
    proc.kill();
  } finally {
    if (b) await b.close();
    if (proc) proc.kill();
  }
}

/* ---------------- main ---------------- */

(async () => {
  console.log('\n\x1b[1m\x1b[36mAS STUDIO — VERIFICATION SUITE\x1b[0m');
  console.log('\x1b[2m' + '='.repeat(58) + '\x1b[0m');

  if (ONLY === 'all' || ONLY === 'static') staticChecks();
  if (ONLY === 'all' || ONLY === 'api') await serverChecks();
  if (ONLY === 'all' || ONLY === 'site') await renderedChecks();
  if (ONLY === 'all' || ONLY === 'site' || ONLY === 'demos') await demoChecks();

  console.log('\n\x1b[2m' + '='.repeat(58) + '\x1b[0m');
  if (failed === 0) {
    console.log(`\x1b[32m\x1b[1m✓ ALL ${passed} CHECKS PASSED\x1b[0m\n`);
    process.exit(0);
  } else {
    console.log(`\x1b[31m\x1b[1m✗ ${failed} FAILED, ${passed} passed\x1b[0m`);
    failures.forEach(f => console.log('  \x1b[31m·\x1b[0m ' + f));
    console.log('');
    process.exit(1);
  }
})().catch(e => { console.error('\nSuite crashed:', e); process.exit(1); });
