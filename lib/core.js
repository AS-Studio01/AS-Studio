import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export const DEFAULT_CONFIG = Object.freeze({
  studioName: 'AS Studio',
  tagline: 'Independent web practice',
  availability: 'Accepting 2 commissions for next week',
  mode: 'direct',
  email: 'asbusinessofficial01@gmail.com',
  telegram: '@AS_Studio_official01',
  telegramUrl: 'https://t.me/AS_Studio_official01',
  fiverrUrl: 'https://www.fiverr.com/s/GPPQm9q',
  upworkUrl: 'https://www.upwork.com/freelancers/~01db1175182843f13a?mp_source=share',
  announcement: '',
  packages: [
    {
      id: 'starter',
      name: 'Starter',
      priceUsd: 95,
      days: 3,
      pages: 1,
      summary: 'Focused single-page launch site engineered for local practices, cafés, and consultants.'
    },
    {
      id: 'growth',
      name: 'Growth',
      priceUsd: 275,
      days: 5,
      pages: 3,
      summary: 'Multi-page business website with service architecture, inquiry workflows, and SEO foundations.'
    },
    {
      id: 'signature',
      name: 'Signature',
      priceUsd: 600,
      days: 7,
      pages: 6,
      summary: 'Full bespoke commission with custom interactions, product catalogs, calculators, and full handoff.'
    }
  ]
});

const COOKIE_NAME = 'as_session';
const SESSION_TTL_SECONDS = 12 * 60 * 60;
const EPHEMERAL_SECRET = crypto.randomBytes(32).toString('hex');
const RATE_BUCKETS = new Map();
const DATA_FILE = path.join(process.cwd(), '.data', 'store.json');

let cachedAccessToken = null;
let cachedTokenExpiry = 0;

function isProduction() {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
}

function getSessionSecret() {
  const configured = (process.env.SESSION_SECRET || '').trim();
  if (configured.length >= 32) return configured;
  if (isProduction()) {
    throw new Error('SESSION_SECRET must be set to at least 32 characters in production.');
  }
  return EPHEMERAL_SECRET;
}

export function hashPassword(password, saltHex = crypto.randomBytes(16).toString('hex')) {
  if (typeof password !== 'string' || password.length < 8) {
    throw new Error('Password must be a string of at least 8 characters.');
  }
  const derived = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), 64, {
    N: 16384,
    r: 8,
    p: 1
  });
  return `scrypt$${saltHex}$${derived.toString('hex')}`;
}

export function verifyPassword(password, storedHash) {
  if (typeof password !== 'string' || typeof storedHash !== 'string') return false;
  const parts = storedHash.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, saltHex, expectedHex] = parts;
  if (!/^[0-9a-f]{32}$/i.test(saltHex) || !/^[0-9a-f]{128}$/i.test(expectedHex)) {
    return false;
  }
  try {
    const derived = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), 64, {
      N: 16384,
      r: 8,
      p: 1
    });
    const expected = Buffer.from(expectedHex, 'hex');
    if (derived.length !== expected.length) return false;
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

export function verifyAdminCredentials(password) {
  if (typeof password !== 'string' || password.length === 0 || password.length > 256) {
    return { configured: true, valid: false };
  }
  const hash = (process.env.ADMIN_PASSWORD_HASH || '').trim();
  if (hash) {
    return { configured: true, valid: verifyPassword(password, hash) };
  }
  const devPlain = (process.env.ADMIN_PASSWORD || '').trim();
  if (!isProduction() && devPlain) {
    const a = crypto.createHash('sha256').update(password).digest();
    const b = crypto.createHash('sha256').update(devPlain).digest();
    return { configured: true, valid: crypto.timingSafeEqual(a, b) };
  }
  return { configured: false, valid: false };
}

function base64UrlEncode(input) {
  return Buffer.from(input).toString('base64url');
}

function base64UrlDecode(str) {
  return Buffer.from(str, 'base64url').toString('utf8');
}

export function createSessionToken(subject = 'admin', ttlSeconds = SESSION_TTL_SECONDS) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: subject,
    iat: now,
    exp: now + ttlSeconds,
    jti: crypto.randomBytes(12).toString('hex')
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const sig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(encodedPayload)
    .digest('base64url');
  return `${encodedPayload}.${sig}`;
}

export function verifySessionToken(token) {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encodedPayload, providedSig] = parts;
  if (!encodedPayload || !providedSig) return null;

  try {
    const expectedSig = crypto
      .createHmac('sha256', getSessionSecret())
      .update(encodedPayload)
      .digest();
    const actualSig = Buffer.from(providedSig, 'base64url');
    if (expectedSig.length !== actualSig.length) return null;
    if (!crypto.timingSafeEqual(expectedSig, actualSig)) return null;

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    if (!payload || payload.sub !== 'admin' || typeof payload.exp !== 'number' || payload.exp <= now) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function parseCookies(req) {
  const header = req?.headers?.cookie || '';
  const out = Object.create(null);
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (!key) continue;
    try {
      out[key] = decodeURIComponent(val);
    } catch {
      out[key] = val;
    }
  }
  return out;
}

export function getSessionFromRequest(req) {
  const cookies = parseCookies(req);
  return verifySessionToken(cookies[COOKIE_NAME]);
}

export function isHttpsRequest(req) {
  const proto = String(req?.headers?.['x-forwarded-proto'] || '').toLowerCase();
  return proto === 'https' || isProduction();
}

export function buildSessionCookie(req, token, maxAgeSeconds = SESSION_TTL_SECONDS) {
  const secure = isHttpsRequest(req);
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'Path=/',
    `Max-Age=${maxAgeSeconds}`
  ];
  if (secure) {
    parts.push('SameSite=None', 'Secure', 'Partitioned');
  } else {
    parts.push('SameSite=Lax');
  }
  return parts.join('; ');
}

export function clearSessionCookie(req) {
  return buildSessionCookie(req, '', 0);
}

export function getClientIp(req) {
  const xff = req?.headers?.['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim()) {
    return xff.split(',')[0].trim();
  }
  return req?.socket?.remoteAddress || 'unknown';
}

export function checkRateLimit(req, bucket, limit = 10, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const key = `${bucket}:${getClientIp(req)}`;
  let stamps = RATE_BUCKETS.get(key) || [];
  stamps = stamps.filter((t) => now - t < windowMs);
  if (stamps.length >= limit) {
    RATE_BUCKETS.set(key, stamps);
    const retryAfter = Math.max(1, Math.ceil((stamps[0] + windowMs - now) / 1000));
    return { allowed: false, remaining: 0, retryAfter };
  }
  stamps.push(now);
  RATE_BUCKETS.set(key, stamps);
  if (RATE_BUCKETS.size > 2000) {
    for (const [k, list] of RATE_BUCKETS.entries()) {
      const fresh = list.filter((t) => now - t < windowMs);
      if (fresh.length === 0) RATE_BUCKETS.delete(k);
      else RATE_BUCKETS.set(k, fresh);
    }
  }
  return { allowed: true, remaining: Math.max(0, limit - stamps.length), retryAfter: 0 };
}

export function verifyOrigin(req) {
  const origin = req?.headers?.origin;
  const host = req?.headers?.['x-forwarded-host'] || req?.headers?.host;
  if (!origin) return true;
  if (!host) return false;
  try {
    const parsed = new URL(origin);
    return parsed.host.toLowerCase() === String(host).toLowerCase();
  } catch {
    return false;
  }
}

export async function readJsonBody(req, maxBytes = 16384) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
  if (typeof req.body === 'string') {
    if (Buffer.byteLength(req.body, 'utf8') > maxBytes) {
      throw Object.assign(new Error('Payload too large'), { statusCode: 413 });
    }
    return req.body ? JSON.parse(req.body) : {};
  }
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(Object.assign(new Error('Payload too large'), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8').trim();
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(Object.assign(new Error('Invalid JSON payload'), { statusCode: 400 }));
      }
    });
    req.on('error', (err) => reject(err));
  });
}

export function sendJson(res, statusCode, data, extraHeaders = {}) {
  const body = JSON.stringify(data);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  for (const [key, val] of Object.entries(extraHeaders)) {
    res.setHeader(key, val);
  }
  res.end(body);
}

export function sanitizeText(value, maxLen = 500) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLen);
}

export function isValidHttpsUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateInquiry(input) {
  if (!input || typeof input !== 'object') {
    return { error: 'Invalid inquiry payload.' };
  }
  // Honeypot check — silent fake acceptance for bots
  if (typeof input.website === 'string' && input.website.trim().length > 0) {
    return { honeypot: true };
  }
  if (typeof input.company_url === 'string' && input.company_url.trim().length > 0) {
    return { honeypot: true };
  }

  const name = sanitizeText(input.name, 80);
  const business = sanitizeText(input.business, 120);
  const contact = sanitizeText(input.contact, 150);
  const pkg = sanitizeText(input.package || 'starter', 32).toLowerCase();
  const timeline = sanitizeText(input.timeline || '', 80);
  const brief = sanitizeText(input.brief, 2500);

  if (name.length < 2) return { error: 'Please provide your name (at least 2 characters).' };
  if (business.length < 1) return { error: 'Please enter your business or project name.' };
  if (contact.length < 3) return { error: 'Please provide an email address or Telegram handle.' };
  if (!['starter', 'growth', 'signature', 'custom'].includes(pkg)) {
    return { error: 'Invalid package selection.' };
  }
  if (brief.length < 10) {
    return { error: 'Please describe your scope in at least 10 characters.' };
  }

  return {
    data: {
      id: `inq_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`,
      name,
      business,
      contact,
      package: pkg,
      timeline: timeline || 'Flexible',
      brief,
      status: 'new',
      source: 'contact_form',
      createdAt: new Date().toISOString()
    }
  };
}

export function validateConfigPatch(input, current = DEFAULT_CONFIG) {
  if (!input || typeof input !== 'object') {
    return { error: 'Invalid configuration payload.' };
  }
  const next = structuredClone(current);

  if (input.studioName !== undefined) {
    const v = sanitizeText(input.studioName, 60);
    if (v.length < 2) return { error: 'Studio name must be at least 2 characters.' };
    next.studioName = v;
  }
  if (input.tagline !== undefined) {
    const v = sanitizeText(input.tagline, 100);
    if (v.length < 2) return { error: 'Tagline must be at least 2 characters.' };
    next.tagline = v;
  }
  if (input.availability !== undefined) {
    const v = sanitizeText(input.availability, 120);
    if (v.length < 2) return { error: 'Availability text must be at least 2 characters.' };
    next.availability = v;
  }
  if (input.announcement !== undefined) {
    next.announcement = sanitizeText(input.announcement, 200);
  }
  if (input.mode !== undefined) {
    const m = sanitizeText(input.mode, 20).toLowerCase();
    if (!['direct', 'fiverr', 'upwork'].includes(m)) {
      return { error: 'Mode must be direct, fiverr, or upwork.' };
    }
    next.mode = m;
  }
  if (input.email !== undefined) {
    const email = sanitizeText(input.email, 120);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: 'Invalid studio email address.' };
    }
    next.email = email;
  }
  if (input.telegram !== undefined) {
    const tg = sanitizeText(input.telegram, 64);
    if (!/^@[A-Za-z0-9_]{3,60}$/.test(tg)) {
      return { error: 'Telegram handle must start with @ and contain 3–60 valid characters.' };
    }
    next.telegram = tg;
  }
  for (const field of ['telegramUrl', 'fiverrUrl', 'upworkUrl']) {
    if (input[field] !== undefined) {
      const u = sanitizeText(input[field], 300);
      if (!isValidHttpsUrl(u)) return { error: `${field} must be a valid https:// URL.` };
      next[field] = u;
    }
  }
  if (Array.isArray(input.packages)) {
    if (input.packages.length !== 3) {
      return { error: 'Exactly 3 packages are required.' };
    }
    const updated = [];
    for (let i = 0; i < 3; i++) {
      const p = input.packages[i] || {};
      const fallback = DEFAULT_CONFIG.packages[i];
      const priceUsd = Number(p.priceUsd);
      const days = Number(p.days);
      const pages = Number(p.pages);
      const summary = sanitizeText(p.summary ?? fallback.summary, 240);
      if (!Number.isInteger(priceUsd) || priceUsd < 10 || priceUsd > 50000) {
        return { error: `Invalid price for ${fallback.name}.` };
      }
      if (!Number.isInteger(days) || days < 1 || days > 90) {
        return { error: `Invalid delivery days for ${fallback.name}.` };
      }
      if (!Number.isInteger(pages) || pages < 1 || pages > 50) {
        return { error: `Invalid page count for ${fallback.name}.` };
      }
      updated.push({
        id: fallback.id,
        name: sanitizeText(p.name || fallback.name, 40) || fallback.name,
        priceUsd,
        days,
        pages,
        summary: summary || fallback.summary
      });
    }
    next.packages = updated;
  }

  return { data: next };
}

function hasFirebaseServiceAccount() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
}

async function getGoogleAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && now < cachedTokenExpiry - 120) {
    return cachedAccessToken;
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64UrlEncode(
    JSON.stringify({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/datastore',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600
    })
  );
  const unsigned = `${header}.${claim}`;
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(unsigned)
    .sign(privateKey, 'base64url');
  const assertion = `${unsigned}.${signature}`;

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion
    })
  });
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Firebase OAuth error: ${resp.status} ${errText}`);
  }
  const data = await resp.json();
  cachedAccessToken = data.access_token;
  cachedTokenExpiry = now + Number(data.expires_in || 3600);
  return cachedAccessToken;
}

function firestoreDocUrl(docPath) {
  const project = process.env.FIREBASE_PROJECT_ID;
  const dbId = process.env.FIREBASE_DATABASE_ID || '(default)';
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/${encodeURIComponent(dbId)}/documents/${docPath}`;
}

function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map((item) => toFirestoreValue(item)) } };
  }
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function fromFirestoreValue(val) {
  if (!val || typeof val !== 'object') return null;
  if ('nullValue' in val) return null;
  if ('booleanValue' in val) return Boolean(val.booleanValue);
  if ('integerValue' in val) return Number(val.integerValue);
  if ('doubleValue' in val) return Number(val.doubleValue);
  if ('stringValue' in val) return val.stringValue;
  if ('timestampValue' in val) return val.timestampValue;
  if ('arrayValue' in val) {
    return (val.arrayValue.values || []).map((v) => fromFirestoreValue(v));
  }
  if ('mapValue' in val) {
    const out = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      out[k] = fromFirestoreValue(v);
    }
    return out;
  }
  return null;
}

function fromFirestoreDoc(doc) {
  const out = {};
  for (const [k, v] of Object.entries(doc?.fields || {})) {
    out[k] = fromFirestoreValue(v);
  }
  return out;
}

async function readLocalStore() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      config: { ...DEFAULT_CONFIG, ...(parsed.config || {}) },
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : []
    };
  } catch {
    return { config: structuredClone(DEFAULT_CONFIG), inquiries: [] };
  }
}

async function writeLocalStore(store) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const tmpFile = `${DATA_FILE}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  await fs.writeFile(tmpFile, JSON.stringify(store, null, 2), 'utf8');
  await fs.rename(tmpFile, DATA_FILE);
}

export async function getConfig() {
  if (hasFirebaseServiceAccount()) {
    try {
      const token = await getGoogleAccessToken();
      const resp = await fetch(firestoreDocUrl('studio/public_config'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resp.ok) {
        const doc = await resp.json();
        return { ...DEFAULT_CONFIG, ...fromFirestoreDoc(doc) };
      }
      if (resp.status === 404) {
        return structuredClone(DEFAULT_CONFIG);
      }
    } catch {
      // Fall back to local store only when Firestore fails in non-prod
    }
  }
  const local = await readLocalStore();
  return local.config;
}

export async function saveConfig(nextConfig) {
  if (hasFirebaseServiceAccount()) {
    const token = await getGoogleAccessToken();
    const fields = {};
    for (const [k, v] of Object.entries(nextConfig)) {
      fields[k] = toFirestoreValue(v);
    }
    const resp = await fetch(firestoreDocUrl('studio/public_config'), {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields })
    });
    if (!resp.ok) {
      throw new Error(`Failed to persist Firestore config: ${resp.status}`);
    }
    return nextConfig;
  }
  const local = await readLocalStore();
  local.config = nextConfig;
  await writeLocalStore(local);
  return nextConfig;
}

export async function createInquiry(inquiry) {
  if (hasFirebaseServiceAccount()) {
    const token = await getGoogleAccessToken();
    const fields = {};
    for (const [k, v] of Object.entries(inquiry)) {
      fields[k] = toFirestoreValue(v);
    }
    const resp = await fetch(firestoreDocUrl(`inquiries/${encodeURIComponent(inquiry.id)}`), {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields })
    });
    if (!resp.ok) {
      throw new Error(`Failed to write inquiry: ${resp.status}`);
    }
    return inquiry;
  }
  const local = await readLocalStore();
  local.inquiries.unshift(inquiry);
  local.inquiries = local.inquiries.slice(0, 200);
  await writeLocalStore(local);
  return inquiry;
}

export async function listInquiries() {
  if (hasFirebaseServiceAccount()) {
    const token = await getGoogleAccessToken();
    const resp = await fetch(`${firestoreDocUrl('inquiries')}?pageSize=100`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!resp.ok) {
      if (resp.status === 404) return [];
      throw new Error(`Failed to list inquiries: ${resp.status}`);
    }
    const json = await resp.json();
    const docs = Array.isArray(json.documents) ? json.documents : [];
    return docs
      .map((d) => fromFirestoreDoc(d))
      .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  }
  const local = await readLocalStore();
  return local.inquiries;
}

export async function updateInquiryStatus(id, status) {
  if (!['new', 'reviewing', 'replied', 'archived'].includes(status)) {
    throw Object.assign(new Error('Invalid status value'), { statusCode: 400 });
  }
  if (hasFirebaseServiceAccount()) {
    const token = await getGoogleAccessToken();
    const docUrl = `${firestoreDocUrl(`inquiries/${encodeURIComponent(id)}`)}?updateMask.fieldPaths=status&updateMask.fieldPaths=updatedAt`;
    const resp = await fetch(docUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          status: toFirestoreValue(status),
          updatedAt: toFirestoreValue(new Date().toISOString())
        }
      })
    });
    if (!resp.ok) {
      throw Object.assign(new Error('Inquiry not found or update failed'), { statusCode: 404 });
    }
    return { id, status };
  }
  const local = await readLocalStore();
  const target = local.inquiries.find((item) => item.id === id);
  if (!target) {
    throw Object.assign(new Error('Inquiry not found'), { statusCode: 404 });
  }
  target.status = status;
  target.updatedAt = new Date().toISOString();
  await writeLocalStore(local);
  return target;
}
