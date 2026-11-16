/**
 * AS Studio — site behaviour
 *
 * SECURITY NOTE
 * -------------
 * Nothing security-relevant lives here. This file only:
 *   - toggles the mobile menu
 *   - reveals sections on scroll
 *   - requests /api/public/config and *renders* what the server returns
 *
 * A visitor can edit every line of this file and gain nothing: the server
 * decides the config, and the only write path (/api/public/inquiry) is
 * validated server-side and rate-limited.
 */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     Mobile menu
     ============================================================ */
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });

    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
    });
  }

  /* ============================================================
     Scroll reveal
     ============================================================ */
  var revealItems = document.querySelectorAll('[data-rv]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealItems, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

    Array.prototype.forEach.call(revealItems, function (el) { io.observe(el); });

    /* Backstop: if any reveal element is still hidden after 2.5s (observer
       never fired, e.g. inside a scroll container or a print preview),
       show it anyway. Content must never stay invisible. */
    setTimeout(function () {
      Array.prototype.forEach.call(revealItems, function (el) {
        if (!el.classList.contains('in')) el.classList.add('in');
      });
    }, 2500);
  }

  /* ============================================================
     Footer year
     ============================================================ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ============================================================
     Nav shadow on scroll
     ============================================================ */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (nav) {
      nav.style.boxShadow = window.scrollY > 8
        ? '0 8px 28px -18px rgba(15,23,42,.35)'
        : 'none';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============================================================
     Server config → render
     ------------------------------------------------------------
     The server is the source of truth for pricing, marketplace
     links and studio status. If this fetch fails we keep the
     server-rendered defaults already in the HTML.
     ============================================================ */
  var config = null;

  function setText(sel, value) {
    if (!value) return;
    var nodes = document.querySelectorAll(sel);
    Array.prototype.forEach.call(nodes, function (n) { n.textContent = value; });
  }

  function applyConfig(cfg) {
    config = cfg;
    if (!cfg) return;

    /* prices */
    if (cfg.pricing) {
      ['starter', 'growth', 'signature'].forEach(function (name) {
        if (cfg.pricing[name]) {
          setText('[data-price="' + name + '"]', '$' + cfg.pricing[name]);
          setText('[data-price-tag="' + name + '"]', '$' + cfg.pricing[name]);
        }
      });
    }

    /* studio status pill */
    if (cfg.studio) {
      var pills = document.querySelectorAll('[data-status-pill]');
      Array.prototype.forEach.call(pills, function (p) {
        p.setAttribute('data-status', cfg.studio.status);
        var label = p.querySelector('span');
        if (label && cfg.studio.statusLabel) label.textContent = cfg.studio.statusLabel;
      });
    }

    /* marketplace buttons */
    var mp = cfg.marketplace || {};
    var links = cfg.links || {};

    var fiverrBtns = document.querySelectorAll('[data-market="fiverr"]');
    Array.prototype.forEach.call(fiverrBtns, function (b) {
      if (mp.fiverr && links.fiverr) {
        b.hidden = false;
        if (b.tagName === 'A') b.href = links.fiverr;
      } else {
        b.hidden = true;
      }
    });

    var upworkBtns = document.querySelectorAll('[data-market="upwork"]');
    Array.prototype.forEach.call(upworkBtns, function (b) {
      if (mp.upwork && links.upwork) {
        b.hidden = false;
        if (b.tagName === 'A') b.href = links.upwork;
      } else {
        b.hidden = true;
      }
    });

    /* announcement bar */
    if (cfg.announcement) {
      var bar = document.getElementById('announce');
      if (bar) {
        bar.textContent = cfg.announcement;
        bar.classList.add('on');
      }
    }
  }

  fetch('/api/public/config', { headers: { Accept: 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(applyConfig)
    .catch(function () { /* keep server-rendered defaults */ });

  /* ============================================================
     Contact form
     ============================================================ */
  var form = document.getElementById('inquiryForm');

  if (form) {
    var statusBox = document.getElementById('formStatus');
    var submitBtn = form.querySelector('button[type="submit"]');

    function fieldError(name, message) {
      var input = form.querySelector('[name="' + name + '"]');
      var slot = form.querySelector('[data-error="' + name + '"]');
      if (input) {
        if (message) input.setAttribute('aria-invalid', 'true');
        else input.removeAttribute('aria-invalid');
      }
      if (slot) slot.textContent = message || '';
    }

    function clearErrors() {
      ['clientName', 'businessName', 'contactChannel', 'contactValue', 'scopeSummary']
        .forEach(function (n) { fieldError(n, ''); });
    }

    function showStatus(kind, message) {
      if (!statusBox) return;
      statusBox.className = 'form-status show ' + kind;
      statusBox.textContent = message;
      statusBox.setAttribute('role', kind === 'bad' ? 'alert' : 'status');
    }

    /* Client-side validation is a convenience only — the server re-validates
       everything and is the authority. */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors();

      var data = {
        clientName:     form.clientName.value.trim(),
        businessName:   form.businessName.value.trim(),
        contactChannel: form.contactChannel.value,
        contactValue:   form.contactValue.value.trim(),
        budget:         form.budget ? form.budget.value : '',
        scopeSummary:   form.scopeSummary.value.trim(),
        website:        form.website ? form.website.value : ''  /* honeypot */
      };

      var invalid = false;
      if (data.clientName.length < 2) {
        fieldError('clientName', 'Please enter your name.');
        invalid = true;
      }
      if (data.businessName.length < 2) {
        fieldError('businessName', 'Please enter your business name.');
        invalid = true;
      }
      if (!data.contactChannel) {
        fieldError('contactChannel', 'Choose how we should reply.');
        invalid = true;
      }
      if (data.contactValue.length < 3) {
        fieldError('contactValue', 'Please add your contact detail.');
        invalid = true;
      }
      if (data.scopeSummary.length < 15) {
        fieldError('scopeSummary', 'Tell us a little more — at least a sentence.');
        invalid = true;
      }

      if (invalid) {
        showStatus('bad', 'Please check the highlighted fields.');
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      showStatus('ok', 'Sending your brief…');
      statusBox.className = 'form-status show';
      statusBox.textContent = 'Sending your brief…';

      fetch('/api/public/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          return res.json().then(function (body) {
            return { status: res.status, body: body };
          });
        })
        .then(function (out) {
          if (out.status === 200) {
            form.reset();
            showStatus('ok', out.body.message || 'Thank you — your brief has reached us.');
          } else if (out.status === 422 && out.body.fields) {
            Object.keys(out.body.fields).forEach(function (k) {
              fieldError(k, out.body.fields[k]);
            });
            showStatus('bad', out.body.error || 'Please check the highlighted fields.');
          } else {
            showStatus('bad', out.body.error || 'Something went wrong. Please email us directly.');
          }
        })
        .catch(function () {
          showStatus('bad', 'Network error. Please email asbusinessofficial01@gmail.com instead.');
        })
        .then(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send project brief';
        });
    });

    /* clear a field's error as soon as the user edits it */
    form.addEventListener('input', function (e) {
      var name = e.target.name;
      if (name) fieldError(name, '');
    });
  }
})();
