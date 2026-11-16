/**
 * Studio console — client
 *
 * IMPORTANT: this file contains no secrets and makes no access decisions.
 * Every request goes to an endpoint that verifies the signed HttpOnly session
 * cookie server-side. Deleting lines here or calling the API directly from a
 * console gets you nothing: the server returns 401 without a valid session.
 */

(function () {
  'use strict';

  var gate      = document.getElementById('gate');
  var app       = document.getElementById('app');
  var loginForm = document.getElementById('loginForm');
  var loginBtn  = document.getElementById('loginBtn');
  var loginErr  = document.getElementById('loginErr');
  var logoutBtn = document.getElementById('logoutBtn');
  var who       = document.getElementById('who');
  var saveMsg   = document.getElementById('saveMsg');

  /* ---------------- api helper ---------------- */
  function api(path, options) {
    var opts = Object.assign({ credentials: 'same-origin', headers: {} }, options || {});
    opts.headers = Object.assign({ Accept: 'application/json' }, opts.headers || {});
    return fetch(path, opts).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (body) {
        return { status: res.status, ok: res.ok, body: body };
      });
    });
  }

  /* ---------------- screen switching ---------------- */
  function showApp(session) {
    gate.hidden = true;
    app.hidden = false;
    if (who && session && session.email) who.textContent = session.email;
    loadConfig();
    loadInquiries(true);
  }

  function showGate() {
    app.hidden = true;
    gate.hidden = false;
  }

  /* ---------------- login ---------------- */
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      loginErr.textContent = '';
      loginBtn.disabled = true;
      loginBtn.textContent = 'Signing in…';

      api('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email.value.trim(),
          password: loginForm.password.value
        })
      })
        .then(function (out) {
          if (out.ok) {
            loginForm.reset();
            showApp(out.body);
          } else {
            loginErr.textContent = out.body.error || 'Sign in failed.';
          }
        })
        .catch(function () {
          loginErr.textContent = 'Network error. Please try again.';
        })
        .then(function () {
          loginBtn.disabled = false;
          loginBtn.textContent = 'Sign in';
        });
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      api('/api/auth/logout', { method: 'POST' }).then(showGate).catch(showGate);
    });
  }

  /* ---------------- session probe on load ---------------- */
  api('/api/auth/me')
    .then(function (out) {
      if (out.ok && out.body && out.body.authenticated) showApp(out.body);
      else showGate();
    })
    .catch(showGate);

  /* ---------------- tabs ---------------- */
  var tabs = document.querySelectorAll('.tab');
  Array.prototype.forEach.call(tabs, function (tab) {
    tab.addEventListener('click', function () {
      Array.prototype.forEach.call(tabs, function (t) {
        t.classList.remove('on');
        t.setAttribute('aria-selected', 'false');
        var p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = true;
      });
      tab.classList.add('on');
      tab.setAttribute('aria-selected', 'true');
      var panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (panel) panel.hidden = false;
      if (tab.id === 'tab-inquiries') loadInquiries();
    });
  });

  /* ---------------- config ---------------- */
  var fieldMap = {
    'studio.status':        'cfgStatus',
    'studio.statusLabel':   'cfgStatusLabel',
    'pricing.starter':      'cfgStarter',
    'pricing.growth':       'cfgGrowth',
    'pricing.signature':    'cfgSignature',
    'links.fiverr':         'cfgFiverrUrl',
    'links.upwork':         'cfgUpworkUrl',
    'studio.telegram':      'cfgTelegram',
    'studio.email':         'cfgEmail',
    'announcement':         'cfgAnnounce'
  };

  function dig(obj, path) {
    return path.split('.').reduce(function (acc, k) {
      return acc && acc[k] !== undefined ? acc[k] : undefined;
    }, obj);
  }

  function loadConfig() {
    api('/api/admin/config').then(function (out) {
      if (out.status === 401) { showGate(); return; }
      if (!out.ok) return;
      var cfg = out.body.config || out.body;

      Object.keys(fieldMap).forEach(function (path) {
        var el = document.getElementById(fieldMap[path]);
        if (!el) return;
        var value = dig(cfg, path);
        if (value === undefined || value === null) return;
        if (el.type === 'checkbox') el.checked = !!value;
        else el.value = value;
      });

      if (cfg.marketplace) {
        var f = document.getElementById('cfgFiverrOn');
        var u = document.getElementById('cfgUpworkOn');
        if (f) f.checked = !!cfg.marketplace.fiverr;
        if (u) u.checked = !!cfg.marketplace.upwork;
      }
    }).catch(function () { /* ignore */ });
  }

  var configForm = document.getElementById('configForm');
  var saveBtn = document.getElementById('saveBtn');

  if (configForm) {
    configForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (saveMsg) { saveMsg.textContent = ''; saveMsg.className = 'save-msg'; }
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving…';

      var payload = {
        studio: {
          status: document.getElementById('cfgStatus').value,
          statusLabel: document.getElementById('cfgStatusLabel').value.trim()
        },
        pricing: {
          starter:   parseInt(document.getElementById('cfgStarter').value, 10),
          growth:    parseInt(document.getElementById('cfgGrowth').value, 10),
          signature: parseInt(document.getElementById('cfgSignature').value, 10)
        },
        marketplace: {
          fiverr: document.getElementById('cfgFiverrOn').checked,
          upwork: document.getElementById('cfgUpworkOn').checked
        },
        links: {
          fiverr: document.getElementById('cfgFiverrUrl').value.trim(),
          upwork: document.getElementById('cfgUpworkUrl').value.trim()
        },
        studioExtra: {
          telegram: document.getElementById('cfgTelegram').value.trim(),
          email:    document.getElementById('cfgEmail').value.trim()
        },
        announcement: document.getElementById('cfgAnnounce').value.trim()
      };

      api('/api/admin/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (out) {
        if (out.status === 401) { showGate(); return; }
        if (out.ok) {
          if (saveMsg) { saveMsg.textContent = '✓ Saved. Live within two minutes.'; saveMsg.className = 'save-msg ok'; }
        } else {
          if (saveMsg) {
            saveMsg.textContent = '✗ ' + (out.body.error || 'Could not save.');
            saveMsg.className = 'save-msg bad';
          }
        }
      }).catch(function () {
        if (saveMsg) { saveMsg.textContent = '✗ Network error.'; saveMsg.className = 'save-msg bad'; }
      }).then(function () {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save configuration';
      });
    });
  }

  /* ---------------- inquiries ---------------- */
  var inqList = document.getElementById('inqList');
  var inqMsg = document.getElementById('inqMsg');
  var inqCount = document.getElementById('inqCount');
  var refreshBtn = document.getElementById('refreshInq');

  function esc(str) {
    var d = document.createElement('div');
    d.textContent = str == null ? '' : String(str);
    return d.innerHTML;
  }

  function timeAgo(iso) {
    var then = new Date(iso).getTime();
    if (!then) return '';
    var diff = Math.max(0, Date.now() - then);
    var mins = Math.round(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + ' min ago';
    var hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + (hrs === 1 ? ' hour ago' : ' hours ago');
    var days = Math.round(hrs / 24);
    if (days < 30) return days + (days === 1 ? ' day ago' : ' days ago');
    return new Date(iso).toLocaleDateString();
  }

  function loadInquiries(silent) {
    if (!silent && inqMsg) { inqMsg.textContent = 'Loading…'; inqMsg.className = 'save-msg'; }

    api('/api/admin/inquiries').then(function (out) {
      if (out.status === 401) { showGate(); return; }

      if (!out.ok) {
        if (inqMsg) {
          inqMsg.textContent = out.body.error || 'Could not load inquiries.';
          inqMsg.className = 'save-msg bad';
        }
        return;
      }

      var items = out.body.inquiries || [];
      if (inqMsg) { inqMsg.textContent = ''; inqMsg.className = 'save-msg'; }

      if (inqCount) {
        inqCount.textContent = String(items.length);
        inqCount.hidden = items.length === 0;
      }

      if (!items.length) {
        inqList.innerHTML = '<div class="empty">No inquiries yet. New briefs from the contact form will appear here.</div>';
        return;
      }

      inqList.innerHTML = items.map(function (item) {
        var channel = item.contactChannel || 'contact';
        var value = item.contactValue || '';
        var href = '';
        if (channel === 'email') href = 'mailto:' + value;
        else if (channel === 'telegram') href = 'https://t.me/' + String(value).replace(/^@/, '');
        else if (channel === 'phone') href = 'tel:' + String(value).replace(/[^0-9+]/g, '');

        return '<article class="inq">' +
          '<div class="inq-top">' +
            '<span class="inq-name">' + esc(item.clientName) +
              (item.businessName ? ' · ' + esc(item.businessName) : '') +
              (item.budget ? '<span class="badge">' + esc(item.budget) + '</span>' : '') +
            '</span>' +
            '<span class="inq-when">' + esc(timeAgo(item.receivedAt)) + '</span>' +
          '</div>' +
          '<div class="inq-meta">' +
            (href
              ? '<a href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' + esc(value) + '</a>'
              : esc(value)) +
            ' · via ' + esc(channel) +
          '</div>' +
          '<div class="inq-body">' + esc(item.scopeSummary) + '</div>' +
        '</article>';
      }).join('');
    }).catch(function () {
      if (inqMsg) { inqMsg.textContent = 'Network error.'; inqMsg.className = 'save-msg bad'; }
    });
  }

  if (refreshBtn) refreshBtn.addEventListener('click', function () { loadInquiries(); });
})();
