(function(){
'use strict';

/* ==========================================================================
   AS STUDIO — CLIENT-SIDE ROUTER, URL MANAGER & NAVIGATION CONTROLLER
   ========================================================================== */

/* Clean URL address-bar mapping (strips .html, index.html and internal folder paths) */
function getCleanPath(p) {
  if (!p) return '/';
  if (p === '/index.html' || p === '/index') return '/';
  if (p === '/packages.html' || p === '/packages/') return '/packages';
  if (p === '/work.html' || p === '/work/') return '/work';
  if (p === '/about.html' || p === '/about/') return '/about';
  if (p === '/contact.html' || p === '/contact/') return '/contact';
  if (p === '/404.html') return '/404';
  if (p.includes('x7q2m9r4v8k1p6z3')) return '/admin';
  if (p.includes('/legal/privacy')) return '/privacy';
  if (p.includes('/legal/terms')) return '/terms';
  if (p.includes('/legal/disclaimer')) return '/disclaimer';
  if (p.includes('/legal/cancellation-refund')) return '/refund';

  if (p.startsWith('/work/') && p.endsWith('.html')) {
    return p.replace(/\.html$/, '');
  }

  const demoMap = [
    ['/demos/vitalcare-multispeciality-clinic', '/vitalcare'],
    ['/demos/mitti-cafe', '/mitti'],
    ['/demos/fold-atelier', '/fold'],
    ['/demos/atelier-north', '/atelier'],
    ['/demos/apex-residences', '/apex'],
    ['/demos/rao-law', '/rao'],
    ['/demos/delta-os', '/delta'],
  ];
  for (const [folder, prefix] of demoMap) {
    if (p.startsWith(folder)) {
      let sub = p.replace(folder, prefix).replace(/\/index\.html$/, '').replace(/\/index$/, '').replace(/\.html$/, '');
      return sub || prefix;
    }
    if (p.startsWith(prefix) && p.endsWith('.html')) {
      return p.replace(/\.html$/, '');
    }
  }

  if (p.endsWith('.html')) {
    return p.replace(/\.html$/, '');
  }
  return p;
}

/* Enforce initial clean address bar */
(function enforceCleanAddressBar() {
  try {
    const p = window.location.pathname;
    const s = window.location.search || '';
    const h = window.location.hash || '';
    const clean = getCleanPath(p);
    if (clean !== p) {
      window.history.replaceState(null, '', clean + s + h);
    }
  } catch (_) {}
})();

/* Clean link normalizer */
function normalizeCleanHref(raw) {
  if (!raw || raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('javascript:')) {
    return raw;
  }
  if (raw.startsWith('#')) return raw;
  const [pathPart, ...rest] = raw.split(/([?#].*)/);
  const queryAndHash = rest.join('');
  let p = pathPart;
  if (p.startsWith('../')) p = p.slice(2);
  if (!p.startsWith('/')) p = '/' + p;
  const cleanPath = getCleanPath(p);
  return cleanPath + queryAndHash;
}

/* Pre-clean all links in DOM on load */
function cleanAllLinks() {
  try {
    document.querySelectorAll('a[href]').forEach(a => {
      const raw = a.getAttribute('href');
      const clean = normalizeCleanHref(raw);
      if (clean && clean !== raw) {
        a.setAttribute('href', clean);
      }
    });
  } catch (_) {}
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', cleanAllLinks);
} else {
  cleanAllLinks();
}

const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(() => document.body.classList.add('ready')));
setTimeout(() => document.body && document.body.classList.add('ready'), 1200);

/* Visitor analytics tracking */
function trackSiteTraffic(customPath) {
  try {
    const path = customPath || location.pathname;
    const isDemo = path.includes('/demos/') || path.startsWith('/vitalcare') || path.startsWith('/mitti') || path.startsWith('/fold') || path.startsWith('/atelier') || path.startsWith('/apex') || path.startsWith('/rao') || path.startsWith('/delta');
    const demo = path.includes('/mitti') ? 'mitti-cafe' :
                 path.includes('/vitalcare') ? 'vitalcare' :
                 path.includes('/fold') ? 'fold-atelier' :
                 path.includes('/atelier') ? 'atelier-north' :
                 path.includes('/apex') ? 'apex-residences' :
                 path.includes('/rao') ? 'rao-law' :
                 path.includes('/delta') ? 'delta-os' : 'studio';
    const payload = {
      path: path,
      demo: demo,
      title: (document.title || '').slice(0, 200),
      referrer: (document.referrer || 'direct').slice(0, 300),
      createdAt: new Date().toISOString()
    };
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(function(){});
  } catch (_) {}
}
trackSiteTraffic();

/* Visual Theme Switcher (Louis Obsidian Dark Glass & Louis Luxury Light) */
(function setupThemeSwitcher() {
  const getStoredTheme = () => {
    try { return localStorage.getItem('as-theme'); } catch (_) { return null; }
  };
  const setStoredTheme = (theme) => {
    try { localStorage.setItem('as-theme', theme); } catch (_) {}
  };

  const applyTheme = (theme, updateStorage) => {
    const isLight = theme === 'light' || theme === 'louis-light';
    const targetTheme = isLight ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', targetTheme);
    if (document.body) {
      document.body.setAttribute('data-theme', targetTheme);
    }
    if (updateStorage) {
      setStoredTheme(targetTheme);
    }
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      const icon = btn.querySelector('.theme-icon');
      const text = btn.querySelector('.theme-text');
      if (isLight) {
        if (icon) icon.textContent = '✦';
        if (text) text.textContent = 'Louis Dark';
        btn.setAttribute('aria-label', 'Switch to Louis Obsidian Dark Glass theme');
        btn.title = 'Switch to Louis Obsidian Dark Glass theme';
      } else {
        if (icon) icon.textContent = '✧';
        if (text) text.textContent = 'Louis Light';
        btn.setAttribute('aria-label', 'Switch to Louis Luxury Light theme');
        btn.title = 'Switch to Louis Luxury Light theme';
      }
    });
  };

  window.applyStudioTheme = applyTheme;

  const saved = getStoredTheme();
  if (saved) {
    applyTheme(saved, false);
  } else {
    applyTheme('dark', false);
  }

  const initToggleInNav = () => {
    const navIn = document.querySelector('.nav-in');
    if (navIn && !navIn.querySelector('.theme-toggle')) {
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'theme-toggle';
      toggleBtn.type = 'button';
      toggleBtn.setAttribute('aria-label', 'Switch visual theme');
      toggleBtn.innerHTML = '<span class="theme-icon">✧</span><span class="theme-text">Louis Light</span>';
      const menuBtn = navIn.querySelector('.menu');
      if (menuBtn) {
        navIn.insertBefore(toggleBtn, menuBtn);
      } else {
        navIn.appendChild(toggleBtn);
      }
    }
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current, false);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggleInNav);
  } else {
    initToggleInNav();
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-toggle');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next, true);
  });
})();

/* Floating Frosted Glass Legal Policy Compliance Banner */
(function setupPolicyComplianceBanner() {
  const CONSENT_KEY = 'as-policy-accepted-v1';
  try {
    if (localStorage.getItem(CONSENT_KEY) === 'true') {
      return;
    }
  } catch (_) {}

  const initBanner = () => {
    if (document.querySelector('.policy-banner')) return;

    const banner = document.createElement('div');
    banner.className = 'policy-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Legal Policy Compliance Notice');
    banner.innerHTML = `
      <div class="policy-banner-text">
        <strong>Site Policies &amp; Compliance:</strong> By continuing to use our website, you accept and agree to our
        <span class="policy-banner-links">
          <a href="/privacy">Privacy Policy</a>,
          <a href="/terms">Terms of Service</a>,
          <a href="/disclaimer">Disclaimer</a>, and
          <a href="/refund">Cancellation &amp; Refund Policy</a>.
        </span>
      </div>
      <div class="policy-banner-acts">
        <button type="button" class="policy-banner-btn" id="acceptPolicyBtn">Accept &amp; Continue</button>
      </div>
    `;

    document.body.appendChild(banner);

    const btn = banner.querySelector('#acceptPolicyBtn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        try {
          localStorage.setItem(CONSENT_KEY, 'true');
        } catch (_) {}
        banner.classList.add('dismissed');
        setTimeout(() => {
          if (banner.parentNode) banner.parentNode.removeChild(banner);
        }, 400);
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBanner);
  } else {
    initBanner();
  }
})();

/* ==========================================================================
   NAVIGATION & MOBILE DRAWER MENU CONTROLLER
   ========================================================================== */
function closeNavMenu() {
  const ln = document.querySelector('.links');
  const mb = document.querySelector('.menu');
  if (ln) {
    ln.classList.remove('open');
  }
  if (mb) {
    mb.setAttribute('aria-expanded', 'false');
  }
}

function initNavControls() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const light = nav.classList.contains('light');
  let last = -1;

  const upd = () => {
    const hh = document.getElementById('hero');
    const hs = document.querySelector('.hero-static');
    const scrub = hh && getComputedStyle(hh).display !== 'none';
    const th = scrub ? hh.offsetHeight - innerHeight * 0.55 : (hs && getComputedStyle(hs).display !== 'none' ? innerHeight * 0.8 : 30);
    const s = !light && scrollY > th;
    if (s !== last) {
      last = s;
      nav.classList.toggle('solid', s || light);
    }
  };
  addEventListener('scroll', upd, { passive: true });
  upd();

  const mb = document.querySelector('.menu');
  const ln = document.querySelector('.links');

  if (ln) {
    const hasHome = Array.from(ln.querySelectorAll('a')).some(a => (a.textContent || '').trim().toLowerCase() === 'home');
    if (!hasHome) {
      const homeA = document.createElement('a');
      homeA.href = '/';
      homeA.textContent = 'Home';
      if (location.pathname === '/' || location.pathname.endsWith('/index.html') || location.pathname === '') {
        homeA.setAttribute('aria-current', 'page');
      }
      ln.insertBefore(homeA, ln.firstChild);
    }
  }

  if (mb && ln) {
    // Menu button click toggles open/close
    mb.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = ln.classList.toggle('open');
      mb.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      nav.classList.add('solid');
    };

    // Clicking outside closes the drawer
    document.addEventListener('click', function(e) {
      if (ln.classList.contains('open') && !ln.contains(e.target) && !mb.contains(e.target)) {
        closeNavMenu();
      }
    });

    // Escape closes drawer
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && ln.classList.contains('open')) {
        closeNavMenu();
        mb.focus();
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavControls);
} else {
  initNavControls();
}

/* ==========================================================================
   SEAMLESS CLIENT-SIDE SPA ROUTER (Zero 403 Errors, Instant Clean URL bar)
   ========================================================================== */
let isNavigating = false;

function updateActiveNavLinks(activePath) {
  const norm = (!activePath || activePath === '' || activePath === '/index.html' || activePath === '/index') ? '/' : activePath;
  document.querySelectorAll('.links a').forEach(a => {
    const raw = a.getAttribute('href');
    if (!raw) return;
    const clean = normalizeCleanHref(raw).split(/[?#]/)[0];
    if (clean === norm || (norm === '/' && clean === '/')) {
      a.setAttribute('aria-current', 'page');
    } else {
      a.removeAttribute('aria-current');
    }
  });
}

function initContactForm() {
  const f = document.getElementById('contactForm');
  const st = document.getElementById('status');
  if (!f || f.dataset.bound === 'true') return;
  f.dataset.bound = 'true';

  const q = new URLSearchParams(window.location.search).get('package');
  if (q) {
    const s = f.querySelector('select');
    if (s) {
      [...s.options].forEach(o => {
        if (o.text.toLowerCase() === q.toLowerCase()) s.value = o.text;
      });
    }
  }

  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f));
    if (d.company) return;
    if (!d.name || !d.business || !/^\S+@\S+\.\S+$/.test(d.email || '') || !d.scope) {
      if (st) st.textContent = 'Please fill every field with a valid email.';
      return;
    }
    const btn = f.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    if (st) st.textContent = 'Sending...';

    try {
      const res = await fetch('/api/inquiries/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: d.name.trim(),
          businessName: d.business.trim(),
          contactChannel: d.email.trim(),
          scopeSummary: ('Package: ' + (d.pack || 'Not sure') + '. ' + (d.budget ? 'Budget: ' + d.budget + '. ' : '') + d.scope).trim().slice(0, 2500),
          source: 'website_contact_form'
        })
      });
      if (res.ok) {
        f.reset();
        if (st) st.textContent = 'Received. We will reply within one business day.';
      } else {
        throw new Error('Server returned status ' + res.status);
      }
    } catch (err) {
      console.warn('[Contact Form Notice]:', err);
      const body = encodeURIComponent('Name: ' + d.name + '\nBusiness: ' + d.business + '\nEmail: ' + d.email + '\nPackage: ' + d.pack + '\nBudget: ' + (d.budget || '') + '\n\n' + d.scope);
      if (st) st.innerHTML = 'We could not send that here. <a href="mailto:asbusinessofficial01@gmail.com?subject=Project%20brief&body=' + body + '" style="text-decoration:underline">Open your email app instead</a>.';
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}

function initAccordionFaq() {
  document.querySelectorAll('.faq').forEach(faq => {
    if (faq.dataset.bound === 'true') return;
    faq.dataset.bound = 'true';
    const allDetails = [...faq.querySelectorAll('details')];
    allDetails.forEach(detail => {
      const summary = detail.querySelector('summary');
      const content = detail.querySelector('p');
      if (!summary || !content) return;
      summary.addEventListener('click', e => {
        e.preventDefault();
        if (reduce()) {
          const willOpen = !detail.hasAttribute('open');
          allDetails.forEach(d => { if (d !== detail) d.removeAttribute('open'); });
          if (willOpen) detail.setAttribute('open', ''); else detail.removeAttribute('open');
          return;
        }
        if (detail.hasAttribute('open')) {
          const startHeight = content.offsetHeight;
          content.style.overflow = 'hidden';
          const anim = content.animate([
            { height: startHeight + 'px', opacity: 1, transform: 'translateY(0)' },
            { height: '0px', opacity: 0, transform: 'translateY(-6px)' }
          ], { duration: 260, easing: 'cubic-bezier(0.16,1,0.3,1)' });
          anim.onfinish = () => {
            detail.removeAttribute('open');
            content.style.overflow = '';
            content.style.height = '';
          };
        } else {
          allDetails.forEach(other => {
            if (other !== detail && other.hasAttribute('open')) {
              const oc = other.querySelector('p');
              if (oc) {
                const sh = oc.offsetHeight;
                oc.style.overflow = 'hidden';
                const a = oc.animate([
                  { height: sh + 'px', opacity: 1 },
                  { height: '0px', opacity: 0 }
                ], { duration: 220, easing: 'cubic-bezier(0.16,1,0.3,1)' });
                a.onfinish = () => {
                  other.removeAttribute('open');
                  oc.style.overflow = '';
                  oc.style.height = '';
                };
              } else {
                other.removeAttribute('open');
              }
            }
          });
          detail.setAttribute('open', '');
          const targetHeight = content.scrollHeight;
          content.style.overflow = 'hidden';
          const anim = content.animate([
            { height: '0px', opacity: 0, transform: 'translateY(-6px)' },
            { height: targetHeight + 'px', opacity: 1, transform: 'translateY(0)' }
          ], { duration: 300, easing: 'cubic-bezier(0.16,1,0.3,1)' });
          anim.onfinish = () => {
            content.style.overflow = '';
            content.style.height = '';
          };
        }
      });
    });
  });
}

function initInteractiveDoor() {
  const door = document.querySelector('.door');
  const dl = document.querySelector('.door-links');
  if (!door || door.dataset.bound === 'true') return;
  door.dataset.bound = 'true';

  let isOpen = false;
  let isAnimating = false;
  let timer = null;

  const setOpenState = open => {
    if (isAnimating) return;
    isAnimating = true;
    door.classList.add('animating');
    if (open) {
      isOpen = true;
      door.classList.remove('is-closed');
      door.classList.add('is-open');
      door.style.setProperty('--p', '1');
      clearTimeout(timer);
      timer = setTimeout(() => {
        isAnimating = false;
        door.classList.remove('animating');
        door.classList.add('done');
        if (dl) dl.classList.add('show');
      }, 2000);
    } else {
      isOpen = false;
      door.classList.remove('done', 'is-open');
      if (dl) dl.classList.remove('show');
      door.classList.add('is-closed');
      door.style.setProperty('--p', '0');
      clearTimeout(timer);
      timer = setTimeout(() => {
        isAnimating = false;
        door.classList.remove('animating', 'is-closed');
      }, 2000);
    }
  };

  const toggle = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isAnimating) return;
    setOpenState(!isOpen);
  };

  if (reduce()) {
    isOpen = true;
    door.classList.add('done', 'is-open');
    if (dl) dl.classList.add('show');
    door.style.setProperty('--p', '1');
  }

  door.addEventListener('click', toggle);
  door.addEventListener('contextmenu', e => { e.preventDefault(); e.stopPropagation(); return false; });
  door.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e); } });
}

function reinitPageInteractiveElements() {
  initContactForm();
  initAccordionFaq();
  initInteractiveDoor();
  cleanAllLinks();
  if (window.refreshReveals) {
    window.refreshReveals();
  }
  trackSiteTraffic();
}

async function navigateTo(rawHref, pushState = true) {
  if (isNavigating) return;

  const clean = normalizeCleanHref(rawHref);
  const [targetPath] = clean.split(/([?#].*)/);
  const hashPart = clean.includes('#') ? clean.slice(clean.indexOf('#')) : '';
  const currentPath = getCleanPath(window.location.pathname);

  // If navigating to pure anchor on the same page (e.g. /#faq or #packages)
  if (targetPath === currentPath || (targetPath === '/' && (currentPath === '' || currentPath === '/'))) {
    if (hashPart) {
      const el = document.querySelector(hashPart);
      if (el) {
        if (pushState) window.history.pushState(null, '', clean);
        el.scrollIntoView({ behavior: 'smooth' });
        updateActiveNavLinks(targetPath);
        return;
      }
    } else {
      if (pushState) window.history.pushState(null, '', clean);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      updateActiveNavLinks(targetPath);
      return;
    }
  }

  isNavigating = true;

  try {
    // 1. Immediately update browser history so AI Studio URL bar updates instantly!
    if (pushState) {
      window.history.pushState(null, '', clean);
    }

    // 2. Fetch the target page HTML via clean URL
    const res = await fetch(clean, {
      credentials: 'same-origin',
      headers: { 'Accept': 'text/html' }
    });

    if (!res.ok) {
      window.location.assign(clean);
      return;
    }

    const htmlText = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    // 3. Update Title & Meta
    if (doc.title) document.title = doc.title;
    const newMetaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content');
    if (newMetaDesc) {
      const curMeta = document.querySelector('meta[name="description"]');
      if (curMeta) curMeta.setAttribute('content', newMetaDesc);
    }

    // 4. Update Header and Hero sections
    const newHero = doc.querySelector('.hero');
    const newHeroStatic = doc.querySelector('.hero-static');
    const curHero = document.querySelector('.hero');
    const curHeroStatic = document.querySelector('.hero-static');
    const curMain = document.querySelector('#main') || document.querySelector('main');
    const newMain = doc.querySelector('#main') || doc.querySelector('main');

    if (newHero && newHeroStatic) {
      if (!curHero && curMain) {
        curMain.parentNode.insertBefore(newHero.cloneNode(true), curMain);
        curMain.parentNode.insertBefore(newHeroStatic.cloneNode(true), curMain);
      }
    } else {
      if (curHero) curHero.remove();
      if (curHeroStatic) curHeroStatic.remove();
    }

    // 5. Replace Main content
    if (newMain && curMain) {
      curMain.innerHTML = newMain.innerHTML;
      curMain.className = newMain.className;
    } else if (newMain && !curMain) {
      const ftr = document.querySelector('footer');
      if (ftr) ftr.parentNode.insertBefore(newMain.cloneNode(true), ftr);
      else document.body.appendChild(newMain.cloneNode(true));
    }

    // 6. Update active nav link
    updateActiveNavLinks(targetPath);

    // 7. Scroll to top or anchor
    if (hashPart) {
      const el = document.querySelector(hashPart);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // 8. Re-initialize interactive elements
    requestAnimationFrame(() => {
      document.body.classList.add('ready');
      reinitPageInteractiveElements();
      initNavControls();
    });

  } catch (err) {
    console.warn('[Router Notice] Fallback navigation:', err);
    window.location.assign(clean);
  } finally {
    isNavigating = false;
  }
}

// Global click delegation for all navigation links
document.addEventListener('click', function(e) {
  // If not standard left-click or with modifier keys, let browser handle it
  if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

  const a = e.target.closest('a');
  if (!a) return;

  const rawHref = a.getAttribute('href');
  if (!rawHref) return;

  // External, protocols, or new tab: let browser handle natively
  if (a.target === '_blank' || rawHref.startsWith('http://') || rawHref.startsWith('https://') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('javascript:')) {
    return;
  }

  // Same-page pure hash link e.g. href="#packages"
  if (rawHref.startsWith('#')) {
    const targetEl = document.querySelector(rawHref);
    if (targetEl) {
      e.preventDefault();
      closeNavMenu();
      targetEl.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', rawHref);
    }
    return;
  }

  // Concept demo links or subpages: navigate client-side or clean
  const clean = normalizeCleanHref(rawHref);

  // If navigating within site core or legal or work
  if (clean.startsWith('/') && !clean.startsWith('//')) {
    e.preventDefault();
    closeNavMenu();
    navigateTo(clean, true);
  }
});

// Browser Back / Forward buttons handling
window.addEventListener('popstate', function() {
  navigateTo(window.location.pathname + window.location.search + window.location.hash, false);
});

/* Private workspace: tap the wordmark (or the (c) line in the footer) five times quickly */
(function(){
  var n = 0, t = null;
  function tap(e, el) {
    n++;
    clearTimeout(t);
    t = setTimeout(function(){ n = 0; }, 1800);
    if (n >= 5) {
      n = 0;
      e.preventDefault();
      navigateTo('/admin');
    }
  }
  var logo = document.querySelector('.logo');
  if (logo) logo.addEventListener('click', function(e){
    tap(e, logo);
  });
  var f = document.querySelector('.fsecret');
  if (f) f.addEventListener('click', function(e){ tap(e, f); });
})();

/* Fail-Safe Resilient Reveal */
(function setupRevealObserver() {
  const elements = document.querySelectorAll('.reveal');
  elements.forEach(el => el.classList.add('in'));

  window.refreshReveals = () => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  };

  if (reduce() || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  }, {
    root: null,
    rootMargin: '40px 0px 40px 0px',
    threshold: 0
  });

  elements.forEach(el => observer.observe(el));
})();

/* Self-drawing arch */
const arch = document.querySelector('.arch-draw');
if (arch) {
  const paths = [...arch.querySelectorAll('path[data-draw]')];
  const glow = arch.querySelector('.fillglow');
  let lp = -1;
  const set = p => {
    paths.forEach(pt => { pt.style.strokeDashoffset = String(1 - p); });
    if (glow) glow.style.opacity = (Math.max(0, p - .7) * 1.1).toFixed(2);
  };
  paths.forEach(p => p.setAttribute('pathLength', '1'));
  const upd = () => {
    if (reduce()) { set(1); return; }
    const r = arch.getBoundingClientRect();
    const p = Math.round(clamp01((innerHeight * 0.85 - r.top) / (innerHeight * 0.6)) * 100) / 100;
    if (p !== lp) { lp = p; set(p); }
  };
  function clamp01(v) { return Math.min(1, Math.max(0, v)); }
  addEventListener('scroll', upd, { passive: true });
  upd();
}

/* 2-second door open and close animation */
initInteractiveDoor();

/* Process line fills smoothly with requestAnimationFrame */
const steps = document.querySelector('.steps');
const sl = document.querySelector('.stepline');
if (steps && sl) {
  const items = [...steps.children];
  let ticking = false;
  const upd = () => {
    ticking = false;
    if (reduce()) {
      items.forEach(i => i.classList.add('on'));
      sl.style.setProperty('--sp', 1);
      return;
    }
    const r = steps.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / (r.height + innerHeight * 0.2)));
    sl.style.setProperty('--sp', p.toFixed(3));
    items.forEach((it, i) => {
      const threshold = (i + 0.25) / items.length;
      it.classList.toggle('on', p >= threshold);
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } };
  addEventListener('scroll', onScroll, { passive: true });
  upd();
}

/* Single-open FAQ accordion */
initAccordionFaq();

/* Contact Form */
initContactForm();

document.addEventListener('visibilitychange', () => document.body.classList.toggle('paused', document.hidden));

/* Subtle Scroll-to-Top Button */
(function setupScrollToTop() {
  function initBtn() {
    if (document.querySelector('.scroll-top-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Scroll back to top');
    btn.setAttribute('title', 'Scroll to top');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg>';
    document.body.appendChild(btn);

    let scrollTicking = false;
    function checkScroll() {
      scrollTicking = false;
      const shouldShow = window.scrollY > 380;
      btn.classList.toggle('visible', shouldShow);
    }

    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(checkScroll);
      }
    }, { passive: true });
    checkScroll();

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBtn);
  } else {
    initBtn();
  }
})();

})();
