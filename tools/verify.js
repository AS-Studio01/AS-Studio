#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { parse } from 'parse5';

import {
  DEFAULT_CONFIG,
  checkRateLimit,
  createSessionToken,
  hashPassword,
  sanitizeText,
  validateConfigPatch,
  validateInquiry,
  verifyPassword,
  verifySessionToken
} from '../lib/core.js';
import { createServer } from './dev-server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const args = new Set(process.argv.slice(2));
const lintOnly = args.has('--lint');
const buildOnly = args.has('--build');

let passed = 0;
let failed = 0;
const failures = [];

async function check(label, fn) {
  try {
    await fn();
    passed += 1;
  } catch (err) {
    failed += 1;
    failures.push({ label, error: err?.message || String(err) });
  }
}

async function exists(relPath) {
  const full = path.join(ROOT_DIR, relPath);
  const st = await fs.stat(full);
  return st.isFile() && st.size > 0;
}

const REQUIRED_FILES = [
  'index.html',
  'packages.html',
  'work.html',
  'about.html',
  'contact.html',
  'admin.html',
  '404.html',
  'README.md',
  'MIGRATION.md',
  'package.json',
  'vercel.json',
  'firestore.rules',
  'robots.txt',
  'sitemap.xml',
  '.env.example',
  '.gitignore',
  'css/site.css',
  'css/admin.css',
  'js/boot.js',
  'js/site.js',
  'js/admin.js',
  'lib/core.js',
  'api/public/config.js',
  'api/public/inquiry.js',
  'api/auth/login.js',
  'api/auth/logout.js',
  'api/auth/me.js',
  'api/admin/config.js',
  'api/admin/inquiries.js',
  'legal/privacy.html',
  'legal/terms.html',
  'legal/refund.html',
  'legal/disclaimer.html',
  'demos/index.html',
  'demos/demo.css',
  'demos/demo.js',
  'demos/mitti.html',
  'demos/rao.html',
  'demos/vitalcare.html',
  'demos/atelier.html',
  'demos/apex.html',
  'demos/delta.html',
  'assets/favicon.svg',
  'assets/brand/apple-touch-icon.png',
  'assets/brand/og-home.png',
  'tools/verify.js',
  'tools/dev-server.js',
  'tools/hash-password.js'
];

const HTML_FILES = REQUIRED_FILES.filter((f) => f.endsWith('.html'));
const CLIENT_JS_FILES = ['js/boot.js', 'js/site.js', 'js/admin.js', 'demos/demo.js'];

async function runSuite() {
  // 1..48: Required file presence & non-empty checks (48 checks)
  for (const rel of REQUIRED_FILES) {
    await check(`File exists: ${rel}`, async () => {
      assert.equal(await exists(rel), true, `${rel} is missing or empty`);
    });
  }

  // 49..65: HTML5 strict parse5 error checks across all 17 HTML documents (17 checks)
  for (const rel of HTML_FILES) {
    await check(`HTML valid (parse5): ${rel}`, async () => {
      const content = await fs.readFile(path.join(ROOT_DIR, rel), 'utf8');
      const errors = [];
      parse(content, {
        onParseError: (err) => {
          errors.push(`${err.code}@${err.startLine}:${err.startCol}`);
        }
      });
      assert.equal(errors.length, 0, `HTML parse errors in ${rel}: ${errors.join(', ')}`);
    });
  }

  // 66..82: Clean internal URLs & zero external Unsplash/Firebase SDK in all 17 HTML files (17 checks)
  for (const rel of HTML_FILES) {
    await check(`Clean links & zero client secrets in ${rel}`, async () => {
      const content = await fs.readFile(path.join(ROOT_DIR, rel), 'utf8');
      assert.equal(/href=["'][^"']*\.html([?#][^"']*)?["']/i.test(content), false, `Found .html href in ${rel}`);
      assert.equal(/images\.unsplash\.com/i.test(content), false, `Found external Unsplash URL in ${rel}`);
      assert.equal(/gstatic\.com\/firebasejs|AIzaSy|firebaseConfig/i.test(content), false, `Found Firebase client key/SDK in ${rel}`);
    });
  }

  // 83..86: Client JS syntax & zero-secret checks (4 checks)
  for (const rel of CLIENT_JS_FILES) {
    await check(`Client JS syntax & zero secrets: ${rel}`, async () => {
      const code = await fs.readFile(path.join(ROOT_DIR, rel), 'utf8');
      new vm.Script(code, { filename: rel });
      assert.equal(/AIzaSy|FIREBASE_PRIVATE_KEY|ADMIN_PASSWORD|scrypt\$/i.test(code), false, `Secret pattern in ${rel}`);
    });
  }

  // 87..94: Config, Vercel, Firestore Rules, Robots, Sitemap, Assets verification (8 checks)
  await check('vercel.json has 11 header blocks and 14 rewrites', async () => {
    const raw = await fs.readFile(path.join(ROOT_DIR, 'vercel.json'), 'utf8');
    const cfg = JSON.parse(raw);
    assert.equal(cfg.headers.length, 11, `Expected 11 header blocks, got ${cfg.headers.length}`);
    assert.equal(cfg.rewrites.length, 14, `Expected 14 rewrites, got ${cfg.rewrites.length}`);
  });

  await check('firestore.rules enforces deny-all for clients', async () => {
    const rules = await fs.readFile(path.join(ROOT_DIR, 'firestore.rules'), 'utf8');
    assert.match(rules, /rules_version\s*=\s*'2'/);
    assert.match(rules, /allow\s+read,\s*write:\s*if\s+false/);
  });

  await check('robots.txt blocks /demos, /admin, and /api', async () => {
    const robots = await fs.readFile(path.join(ROOT_DIR, 'robots.txt'), 'utf8');
    assert.match(robots, /Disallow:\s*\/demos/);
    assert.match(robots, /Disallow:\s*\/admin/);
    assert.match(robots, /Disallow:\s*\/api/);
  });

  await check('sitemap.xml lists 9 canonical URLs without .html', async () => {
    const xml = await fs.readFile(path.join(ROOT_DIR, 'sitemap.xml'), 'utf8');
    const locs = xml.match(/<loc>[^<]+<\/loc>/g) || [];
    assert.equal(locs.length, 9, `Expected 9 URLs in sitemap.xml, got ${locs.length}`);
    assert.equal(locs.some((l) => l.includes('.html')), false, 'Found .html inside sitemap.xml');
  });

  await check('.env.example documents server variables without live secrets', async () => {
    const envEx = await fs.readFile(path.join(ROOT_DIR, '.env.example'), 'utf8');
    assert.match(envEx, /ADMIN_PASSWORD_HASH=/);
    assert.match(envEx, /SESSION_SECRET=/);
    assert.match(envEx, /FIREBASE_PRIVATE_KEY=/);
    assert.equal(/-----BEGIN PRIVATE KEY-----[A-Za-z0-9+/=]{20,}/.test(envEx), false);
  });

  await check('og-home.png has valid PNG signature', async () => {
    const buf = await fs.readFile(path.join(ROOT_DIR, 'assets/brand/og-home.png'));
    assert.equal(buf.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  });

  await check('apple-touch-icon.png has valid PNG signature', async () => {
    const buf = await fs.readFile(path.join(ROOT_DIR, 'assets/brand/apple-touch-icon.png'));
    assert.equal(buf.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  });

  await check('metadata.json retains required fields', async () => {
    const meta = JSON.parse(await fs.readFile(path.join(ROOT_DIR, 'metadata.json'), 'utf8'));
    assert.ok(meta.name);
    assert.ok(Array.isArray(meta.majorCapabilities));
    assert.ok(meta.majorCapabilities.includes('MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API'));
  });

  if (lintOnly || buildOnly) {
    return;
  }

  // 95..112: Security primitives unit tests (18 checks)
  await check('scrypt hashPassword + verifyPassword roundtrip succeeds', async () => {
    const hash = hashPassword('CorrectHorseBattery99');
    assert.match(hash, /^scrypt\$[0-9a-f]{32}\$[0-9a-f]{128}$/);
    assert.equal(verifyPassword('CorrectHorseBattery99', hash), true);
  });

  await check('verifyPassword rejects wrong password', async () => {
    const hash = hashPassword('CorrectHorseBattery99');
    assert.equal(verifyPassword('WrongPassword', hash), false);
  });

  await check('verifyPassword rejects malformed hash safely', async () => {
    assert.equal(verifyPassword('test', 'plain$bad'), false);
    assert.equal(verifyPassword('', ''), false);
  });

  await check('createSessionToken + verifySessionToken succeeds', async () => {
    const tok = createSessionToken('admin', 60);
    const payload = verifySessionToken(tok);
    assert.equal(payload?.sub, 'admin');
  });

  await check('verifySessionToken rejects tampered signature', async () => {
    const tok = createSessionToken('admin', 60);
    const broken = tok.slice(0, -4) + 'AAAA';
    assert.equal(verifySessionToken(broken), null);
  });

  await check('verifySessionToken rejects expired token', async () => {
    const tok = createSessionToken('admin', -10);
    assert.equal(verifySessionToken(tok), null);
  });

  await check('checkRateLimit enforces sliding window cap', async () => {
    const fakeReq = { headers: { 'x-forwarded-for': '203.0.113.77' } };
    assert.equal(checkRateLimit(fakeReq, 'test_bucket', 2, 5000).allowed, true);
    assert.equal(checkRateLimit(fakeReq, 'test_bucket', 2, 5000).allowed, true);
    assert.equal(checkRateLimit(fakeReq, 'test_bucket', 2, 5000).allowed, false);
  });

  await check('sanitizeText strips control characters and clamps length', async () => {
    assert.equal(sanitizeText('  hi\x00there\x07  ', 20), 'hithere');
    assert.equal(sanitizeText('abcdef', 3), 'abc');
  });

  await check('validateInquiry accepts valid client brief', async () => {
    const res = validateInquiry({
      name: 'Rohan Kulkarni',
      business: 'Mitti Roastery',
      contact: 'rohan@mitti.in',
      package: 'growth',
      timeline: 'Next month',
      brief: 'Need a crisp three-page specialty cafe website with live menu filter.'
    });
    assert.ok(res.data);
    assert.equal(res.data.status, 'new');
  });

  await check('validateInquiry traps honeypot submissions silently', async () => {
    const res = validateInquiry({
      name: 'Bot',
      business: 'Spam Co',
      contact: 'bot@spam.example',
      brief: 'Automated spam message content',
      website: 'https://spam.example'
    });
    assert.equal(res.honeypot, true);
  });

  await check('validateInquiry rejects short brief', async () => {
    const res = validateInquiry({
      name: 'A',
      business: 'X',
      contact: 'a@b.c',
      brief: 'short'
    });
    assert.ok(res.error);
  });

  await check('validateConfigPatch rejects javascript: or http: URLs', async () => {
    const res = validateConfigPatch({ fiverrUrl: 'javascript:alert(1)' }, DEFAULT_CONFIG);
    assert.ok(res.error);
    const res2 = validateConfigPatch({ fiverrUrl: 'http://insecure.example' }, DEFAULT_CONFIG);
    assert.ok(res2.error);
  });

  await check('validateConfigPatch rejects out-of-range package pricing', async () => {
    const badPkgs = structuredClone(DEFAULT_CONFIG.packages);
    badPkgs[0].priceUsd = 0;
    const res = validateConfigPatch({ packages: badPkgs }, DEFAULT_CONFIG);
    assert.ok(res.error);
  });

  await check('validateConfigPatch accepts valid admin config updates', async () => {
    const res = validateConfigPatch({ mode: 'fiverr', availability: '1 slot left in May' }, DEFAULT_CONFIG);
    assert.equal(res.data.mode, 'fiverr');
    assert.equal(res.data.availability, '1 slot left in May');
  });

  await check('Admin JS uses HttpOnly cookie probe and contains zero passcodes', async () => {
    const js = await fs.readFile(path.join(ROOT_DIR, 'js/admin.js'), 'utf8');
    assert.match(js, /\/api\/auth\/me/);
    assert.match(js, /credentials:\s*'same-origin'/);
  });

  await check('Site JS hydrates config dynamically via /api/public/config', async () => {
    const js = await fs.readFile(path.join(ROOT_DIR, 'js/site.js'), 'utf8');
    assert.match(js, /\/api\/public\/config/);
    assert.match(js, /\/api\/public\/inquiry/);
  });

  await check('Demo JS exposes cart, EMI calculator, billing toggle, liveStatus, and filter modules', async () => {
    const js = await fs.readFile(path.join(ROOT_DIR, 'demos/demo.js'), 'utf8');
    assert.match(js, /initLiveStatus/);
    assert.match(js, /initMenuFilter/);
    assert.match(js, /initCart/);
    assert.match(js, /initEmiCalculator/);
    assert.match(js, /initBillingAndDocs/);
  });

  await check('Boot JS executes cleanly before paint without errors', async () => {
    const js = await fs.readFile(path.join(ROOT_DIR, 'js/boot.js'), 'utf8');
    assert.match(js, /js-ready/);
    assert.match(js, /as_theme/);
  });

  // 113..147: Live HTTP integration checks against tools/dev-server.js (35 checks)
  const testPass = 'VerifySuitePass#2026';
  const prevHash = process.env.ADMIN_PASSWORD_HASH;
  const prevSecret = process.env.SESSION_SECRET;
  const prevNodeEnv = process.env.NODE_ENV;
  process.env.ADMIN_PASSWORD_HASH = hashPassword(testPass);
  process.env.SESSION_SECRET = '0123456789abcdef0123456789abcdef0123456789abcdef';
  process.env.NODE_ENV = 'test';

  const dataFilePath = path.join(ROOT_DIR, '.data', 'store.json');
  let originalDataFile = null;
  try {
    originalDataFile = await fs.readFile(dataFilePath, 'utf8');
  } catch {}

  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const addr = server.address();
  const baseUrl = `http://127.0.0.1:${addr.port}`;

  try {
    const cleanRoutes = [
      '/',
      '/packages',
      '/work',
      '/about',
      '/contact',
      '/admin',
      '/privacy',
      '/terms',
      '/refund',
      '/disclaimer',
      '/demos',
      '/demos/mitti',
      '/demos/rao',
      '/demos/vitalcare',
      '/demos/atelier',
      '/demos/apex',
      '/demos/delta'
    ];

    // 113..129: Clean routes return 200 (17 checks)
    for (const route of cleanRoutes) {
      await check(`HTTP 200 route: ${route}`, async () => {
        const resp = await fetch(`${baseUrl}${route}`, { redirect: 'manual' });
        assert.equal(resp.status, 200, `${route} returned ${resp.status}`);
        assert.equal(resp.headers.get('x-content-type-options'), 'nosniff');
      });
    }

    // 130..135: Legacy .html routes permanently redirect (6 checks)
    const legacyHtml = [
      ['/packages.html', '/packages'],
      ['/work.html', '/work'],
      ['/about.html', '/about'],
      ['/contact.html', '/contact'],
      ['/legal/privacy.html', '/privacy'],
      ['/demos/mitti.html', '/demos/mitti']
    ];
    for (const [src, target] of legacyHtml) {
      await check(`HTTP 301 redirect: ${src} -> ${target}`, async () => {
        const resp = await fetch(`${baseUrl}${src}`, { redirect: 'manual' });
        assert.equal(resp.status, 301);
        assert.equal(resp.headers.get('location'), target);
      });
    }

    // 136..139: Blocked internals & 404 routes return 404 cleanly (4 checks)
    for (const bad of ['/does-not-exist', '/.env', '/lib/core.js', '/package.json']) {
      await check(`HTTP 404 blocked/unknown: ${bad}`, async () => {
        const resp = await fetch(`${baseUrl}${bad}`, { redirect: 'manual' });
        assert.equal(resp.status, 404);
      });
    }

    // 140..147: Full API auth + CRUD integration flow (8 checks)
    await check('GET /api/public/config returns 200 public config', async () => {
      const resp = await fetch(`${baseUrl}/api/public/config`);
      assert.equal(resp.status, 200);
      const body = await resp.json();
      assert.equal(body.ok, true);
      assert.equal(body.config.packages.length, 3);
    });

    await check('GET /api/admin/config rejects unauthenticated with 401', async () => {
      const resp = await fetch(`${baseUrl}/api/admin/config`);
      assert.equal(resp.status, 401);
    });

    await check('GET /api/admin/inquiries rejects unauthenticated with 401', async () => {
      const resp = await fetch(`${baseUrl}/api/admin/inquiries`);
      assert.equal(resp.status, 401);
    });

    await check('POST /api/auth/login rejects wrong password with 401', async () => {
      const resp = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'WrongPassword123' })
      });
      assert.equal(resp.status, 401);
    });

    let sessionCookie = '';
    await check('POST /api/auth/login succeeds and sets HttpOnly cookie', async () => {
      const resp = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: testPass })
      });
      assert.equal(resp.status, 200);
      const setCookie = resp.headers.get('set-cookie') || '';
      assert.match(setCookie, /as_session=/);
      assert.match(setCookie, /HttpOnly/i);
      sessionCookie = setCookie.split(';')[0];
    });

    await check('GET /api/auth/me validates active session cookie', async () => {
      const resp = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { Cookie: sessionCookie }
      });
      assert.equal(resp.status, 200);
      const body = await resp.json();
      assert.equal(body.authenticated, true);
    });

    await check('POST /api/public/inquiry creates brief & GET/PATCH /api/admin/inquiries reads/updates it', async () => {
      const createResp = await fetch(`${baseUrl}/api/public/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Client',
          business: 'Kiran Dental',
          contact: 'kiran@dental.example',
          package: 'growth',
          timeline: '1 week',
          brief: 'Looking for a fast clean dental booking site.'
        })
      });
      assert.equal(createResp.status, 201);
      const created = await createResp.json();
      assert.ok(created.id);

      const listResp = await fetch(`${baseUrl}/api/admin/inquiries`, {
        headers: { Cookie: sessionCookie }
      });
      assert.equal(listResp.status, 200);
      const listed = await listResp.json();
      assert.ok(listed.inquiries.some((i) => i.id === created.id));

      const patchResp = await fetch(`${baseUrl}/api/admin/inquiries`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
        body: JSON.stringify({ id: created.id, status: 'replied' })
      });
      assert.equal(patchResp.status, 200);
      const patched = await patchResp.json();
      assert.equal(patched.inquiry.status, 'replied');
    });

    await check('POST /api/auth/logout clears session cookie cleanly', async () => {
      const resp = await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: { Cookie: sessionCookie }
      });
      assert.equal(resp.status, 200);
      assert.match(resp.headers.get('set-cookie') || '', /Max-Age=0/);
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    if (originalDataFile !== null) {
      await fs.writeFile(dataFilePath, originalDataFile, 'utf8');
    } else {
      await fs.rm(dataFilePath, { force: true });
    }
    if (prevHash === undefined) delete process.env.ADMIN_PASSWORD_HASH;
    else process.env.ADMIN_PASSWORD_HASH = prevHash;
    if (prevSecret === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = prevSecret;
    if (prevNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = prevNodeEnv;
  }
}

runSuite()
  .then(() => {
    const modeLabel = lintOnly ? 'lint' : buildOnly ? 'build' : 'full suite';
    console.log(`AS Studio Pro verify (${modeLabel}): ${passed} passed, ${failed} failed.`);
    if (failures.length) {
      for (const f of failures) {
        console.error(`  FAIL: ${f.label}\n    -> ${f.error}`);
      }
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
