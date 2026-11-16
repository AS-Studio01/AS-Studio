(function () {
  'use strict';

  var root = document.documentElement;

  function setYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = year;
    });
  }

  function initThemeToggle() {
    var btns = document.querySelectorAll('[data-theme-toggle]');
    function syncLabels(theme) {
      btns.forEach(function (btn) {
        btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        var label = btn.querySelector('[data-theme-label]');
        if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
      });
    }
    var current = root.getAttribute('data-theme') || 'dark';
    syncLabels(current);
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = (root.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try {
          localStorage.setItem('as_theme', next);
        } catch (_) {}
        syncLabels(next);
      });
    });
  }

  function initNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var drawer = document.getElementById('mobile-drawer');
    var closeBtn = document.querySelector('[data-nav-close]');

    function closeDrawer() {
      if (!drawer || !toggle) return;
      drawer.hidden = true;
      drawer.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }

    function openDrawer() {
      if (!drawer || !toggle) return;
      drawer.hidden = false;
      drawer.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
      var firstLink = drawer.querySelector('a, button');
      if (firstLink) firstLink.focus();
    }

    if (toggle && drawer) {
      toggle.addEventListener('click', function () {
        var isOpen = toggle.getAttribute('aria-expanded') === 'true';
        if (isOpen) closeDrawer();
        else openDrawer();
      });
      if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
      drawer.addEventListener('click', function (e) {
        if (e.target === drawer) closeDrawer();
      });
      drawer.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          closeDrawer();
        });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !drawer.hidden) {
          closeDrawer();
          toggle.focus();
        }
      });
    }

    // Highlight active route cleanly
    var currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
    document.querySelectorAll('.site-nav a, #mobile-drawer a').forEach(function (link) {
      var href = (link.getAttribute('href') || '').replace(/\/+$/, '') || '/';
      if (href === currentPath) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function initAccordions() {
    document.querySelectorAll('[data-accordion-trigger]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        var panelId = btn.getAttribute('aria-controls');
        var panel = panelId ? document.getElementById(panelId) : null;
        var group = btn.closest('[data-accordion-group]');
        if (group && !expanded) {
          group.querySelectorAll('[data-accordion-trigger]').forEach(function (other) {
            if (other !== btn) {
              other.setAttribute('aria-expanded', 'false');
              var otherPanel = document.getElementById(other.getAttribute('aria-controls') || '');
              if (otherPanel) otherPanel.hidden = true;
            }
          });
        }
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (panel) panel.hidden = expanded;
      });
    });
  }

  function initReveal() {
    var nodes = document.querySelectorAll('.reveal');
    if (!nodes.length) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    nodes.forEach(function (el) { io.observe(el); });
  }

  function applyPublicConfig(config) {
    if (!config) return;

    document.querySelectorAll('[data-config="availability"]').forEach(function (el) {
      el.textContent = config.availability || 'Accepting commissions';
    });
    document.querySelectorAll('[data-config="email"]').forEach(function (el) {
      el.textContent = config.email;
      if (el.tagName === 'A') el.setAttribute('href', 'mailto:' + config.email);
    });
    document.querySelectorAll('[data-config="telegram"]').forEach(function (el) {
      el.textContent = config.telegram;
      if (el.tagName === 'A' && config.telegramUrl) {
        el.setAttribute('href', config.telegramUrl);
      }
    });
    document.querySelectorAll('[data-config="fiverr-link"]').forEach(function (el) {
      if (config.fiverrUrl) el.setAttribute('href', config.fiverrUrl);
    });
    document.querySelectorAll('[data-config="upwork-link"]').forEach(function (el) {
      if (config.upworkUrl) el.setAttribute('href', config.upworkUrl);
    });

    if (config.announcement) {
      var banner = document.getElementById('studio-announcement');
      if (banner) {
        banner.textContent = config.announcement;
        banner.hidden = false;
      }
    }

    if (Array.isArray(config.packages)) {
      config.packages.forEach(function (pkg) {
        document.querySelectorAll('[data-pkg-price="' + pkg.id + '"]').forEach(function (el) {
          el.textContent = '$' + pkg.priceUsd;
        });
        document.querySelectorAll('[data-pkg-days="' + pkg.id + '"]').forEach(function (el) {
          el.textContent = pkg.days + ' days';
        });
        document.querySelectorAll('[data-pkg-pages="' + pkg.id + '"]').forEach(function (el) {
          el.textContent = pkg.pages + (pkg.pages === 1 ? ' page' : ' pages');
        });
        document.querySelectorAll('[data-pkg-summary="' + pkg.id + '"]').forEach(function (el) {
          el.textContent = pkg.summary;
        });
      });
    }

    // Respect optional mode override or configured mode for primary booking CTAs
    var overrideMode = root.getAttribute('data-mode');
    var activeMode = overrideMode || config.mode || 'direct';
    document.querySelectorAll('[data-mode-cta]').forEach(function (el) {
      if (activeMode === 'fiverr' && config.fiverrUrl) {
        el.setAttribute('href', config.fiverrUrl);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
        if (el.dataset.modeLabel === 'auto') el.textContent = 'Commission on Fiverr';
      } else if (activeMode === 'upwork' && config.upworkUrl) {
        el.setAttribute('href', config.upworkUrl);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
        if (el.dataset.modeLabel === 'auto') el.textContent = 'Commission on Upwork';
      } else {
        el.setAttribute('href', '/contact');
        el.removeAttribute('target');
        el.removeAttribute('rel');
      }
    });
  }

  function hydrateConfig() {
    fetch('/api/public/config', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (payload) {
        if (payload && payload.ok && payload.config) {
          applyPublicConfig(payload.config);
        }
      })
      .catch(function () {});
  }

  function initInquiryForm() {
    var form = document.getElementById('brief-form');
    if (!form) return;

    var params = new URLSearchParams(window.location.search);
    var pkgParam = params.get('package');
    var pkgSelect = form.querySelector('[name="package"]');
    if (pkgParam && pkgSelect && ['starter', 'growth', 'signature', 'custom'].indexOf(pkgParam) !== -1) {
      pkgSelect.value = pkgParam;
    }

    var statusEl = document.getElementById('brief-status');
    var submitBtn = form.querySelector('[type="submit"]');

    function showStatus(kind, message) {
      if (!statusEl) return;
      statusEl.hidden = false;
      statusEl.className = 'form-status ' + (kind === 'error' ? 'is-error' : 'is-success');
      statusEl.textContent = message;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = {
        name: (form.querySelector('[name="name"]') || {}).value || '',
        business: (form.querySelector('[name="business"]') || {}).value || '',
        contact: (form.querySelector('[name="contact"]') || {}).value || '',
        package: (form.querySelector('[name="package"]') || {}).value || 'starter',
        timeline: (form.querySelector('[name="timeline"]') || {}).value || 'Flexible',
        brief: (form.querySelector('[name="brief"]') || {}).value || '',
        website: (form.querySelector('[name="website"]') || {}).value || ''
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalLabel = submitBtn.textContent;
        submitBtn.textContent = 'Sending brief...';
      }

      fetch('/api/public/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (resp) {
          return resp.json().then(function (body) {
            return { ok: resp.ok, body: body };
          });
        })
        .then(function (res) {
          if (res.ok && res.body && res.body.ok) {
            form.reset();
            showStatus('success', 'Brief received. Reference ' + res.body.id + ' — we respond within 24 hours.');
          } else {
            showStatus('error', (res.body && res.body.error) || 'Please check your brief details and try again.');
          }
        })
        .catch(function () {
          showStatus('error', 'Network error while sending brief. Email us directly at asbusinessofficial01@gmail.com.');
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalLabel || 'Send project brief';
          }
        });
    });
  }

  function initAdminShortcut() {
    var mark = document.querySelector('[data-admin-trigger]');
    if (!mark) return;
    var clicks = 0;
    var timer = null;
    mark.addEventListener('click', function () {
      clicks += 1;
      clearTimeout(timer);
      if (clicks >= 3) {
        window.location.href = '/admin';
        return;
      }
      timer = setTimeout(function () { clicks = 0; }, 900);
    });
  }

  setYear();
  initThemeToggle();
  initNavigation();
  initAccordions();
  initReveal();
  hydrateConfig();
  initInquiryForm();
  initAdminShortcut();
})();
