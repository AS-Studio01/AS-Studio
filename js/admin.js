(function () {
  'use strict';

  var gateView = document.getElementById('admin-gate');
  var consoleView = document.getElementById('admin-console');
  var loginForm = document.getElementById('login-form');
  var loginError = document.getElementById('login-error');
  var logoutBtn = document.getElementById('logout-btn');
  var configForm = document.getElementById('config-form');
  var configStatus = document.getElementById('config-status');
  var inquiryList = document.getElementById('inquiry-list');
  var inquiryCount = document.getElementById('inquiry-count');
  var filterSelect = document.getElementById('inquiry-filter');
  var refreshBtn = document.getElementById('refresh-inquiries');

  var cachedInquiries = [];

  function showGate(message) {
    if (gateView) gateView.hidden = false;
    if (consoleView) consoleView.hidden = true;
    if (loginError) {
      loginError.hidden = !message;
      loginError.textContent = message || '';
    }
  }

  function showConsole() {
    if (gateView) gateView.hidden = true;
    if (consoleView) consoleView.hidden = false;
    loadAdminData();
  }

  function setStatusMessage(el, kind, text) {
    if (!el) return;
    el.hidden = false;
    el.className = 'admin-status ' + (kind === 'error' ? 'is-error' : 'is-success');
    el.textContent = text;
  }

  function populateConfigForm(config) {
    if (!configForm || !config) return;
    var fields = ['studioName', 'tagline', 'availability', 'announcement', 'mode', 'email', 'telegram', 'telegramUrl', 'fiverrUrl', 'upworkUrl'];
    fields.forEach(function (name) {
      var input = configForm.elements[name];
      if (input) input.value = config[name] || '';
    });
    if (Array.isArray(config.packages)) {
      config.packages.forEach(function (pkg, idx) {
        var prefix = 'pkg_' + idx + '_';
        if (configForm.elements[prefix + 'priceUsd']) configForm.elements[prefix + 'priceUsd'].value = pkg.priceUsd;
        if (configForm.elements[prefix + 'days']) configForm.elements[prefix + 'days'].value = pkg.days;
        if (configForm.elements[prefix + 'pages']) configForm.elements[prefix + 'pages'].value = pkg.pages;
        if (configForm.elements[prefix + 'summary']) configForm.elements[prefix + 'summary'].value = pkg.summary || '';
      });
    }
  }

  function formatDate(iso) {
    if (!iso) return 'Unknown date';
    try {
      return new Date(iso).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  }

  function renderInquiries() {
    if (!inquiryList) return;
    var filter = filterSelect ? filterSelect.value : 'all';
    var items = cachedInquiries.filter(function (item) {
      return filter === 'all' || item.status === filter;
    });

    if (inquiryCount) {
      inquiryCount.textContent = String(cachedInquiries.length) + ' total';
    }

    inquiryList.textContent = '';
    if (!items.length) {
      var empty = document.createElement('p');
      empty.className = 'admin-empty';
      empty.textContent = filter === 'all' ? 'No client briefs submitted yet.' : 'No inquiries match this filter.';
      inquiryList.appendChild(empty);
      return;
    }

    items.forEach(function (item) {
      var card = document.createElement('article');
      card.className = 'inquiry-card';

      var head = document.createElement('div');
      head.className = 'inquiry-head';

      var titleWrap = document.createElement('div');
      var title = document.createElement('h3');
      title.textContent = item.business + ' — ' + item.name;
      var meta = document.createElement('p');
      meta.className = 'inquiry-meta';
      meta.textContent = item.contact + ' · ' + String(item.package || '').toUpperCase() + ' · ' + (item.timeline || 'Flexible') + ' · ' + formatDate(item.createdAt);
      titleWrap.appendChild(title);
      titleWrap.appendChild(meta);

      var select = document.createElement('select');
      select.className = 'status-select';
      select.setAttribute('aria-label', 'Update inquiry status');
      ['new', 'reviewing', 'replied', 'archived'].forEach(function (st) {
        var opt = document.createElement('option');
        opt.value = st;
        opt.textContent = st.charAt(0).toUpperCase() + st.slice(1);
        if (st === item.status) opt.selected = true;
        select.appendChild(opt);
      });
      select.addEventListener('change', function () {
        updateStatus(item.id, select.value, select);
      });

      head.appendChild(titleWrap);
      head.appendChild(select);

      var body = document.createElement('p');
      body.className = 'inquiry-brief';
      body.textContent = item.brief;

      card.appendChild(head);
      card.appendChild(body);
      inquiryList.appendChild(card);
    });
  }

  function updateStatus(id, nextStatus, selectEl) {
    selectEl.disabled = true;
    fetch('/api/admin/inquiries', {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: id, status: nextStatus })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.ok) {
          var target = cachedInquiries.find(function (x) { return x.id === id; });
          if (target) target.status = nextStatus;
        }
      })
      .finally(function () {
        selectEl.disabled = false;
      });
  }

  function loadAdminData() {
    Promise.all([
      fetch('/api/admin/config', { credentials: 'same-origin', headers: { Accept: 'application/json' } }),
      fetch('/api/admin/inquiries', { credentials: 'same-origin', headers: { Accept: 'application/json' } })
    ])
      .then(function (responses) {
        if (responses[0].status === 401 || responses[1].status === 401) {
          showGate('Session expired. Please sign in again.');
          return null;
        }
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(function (results) {
        if (!results) return;
        if (results[0] && results[0].ok) populateConfigForm(results[0].config);
        if (results[1] && results[1].ok) {
          cachedInquiries = Array.isArray(results[1].inquiries) ? results[1].inquiries : [];
          renderInquiries();
        }
      })
      .catch(function () {
        setStatusMessage(configStatus, 'error', 'Failed to load studio data.');
      });
  }

  function probeSession() {
    fetch('/api/auth/me', { credentials: 'same-origin', headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.authenticated) showConsole();
        else showGate('');
      })
      .catch(function () {
        showGate('');
      });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var passwordInput = document.getElementById('admin-password');
      var password = passwordInput ? passwordInput.value : '';
      if (!password) return;
      var btn = loginForm.querySelector('[type="submit"]');
      if (btn) btn.disabled = true;

      fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ password: password })
      })
        .then(function (r) { return r.json().then(function (body) { return { status: r.status, body: body }; }); })
        .then(function (res) {
          if (res.status === 200 && res.body && res.body.ok) {
            if (passwordInput) passwordInput.value = '';
            showConsole();
          } else {
            showGate((res.body && res.body.error) || 'Sign in failed.');
          }
        })
        .catch(function () {
          showGate('Network error during sign in.');
        })
        .finally(function () {
          if (btn) btn.disabled = false;
        });
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
        .finally(function () {
          cachedInquiries = [];
          showGate('');
        });
    });
  }

  if (configForm) {
    configForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = configForm.elements;
      var payload = {
        studioName: f.studioName.value.trim(),
        tagline: f.tagline.value.trim(),
        availability: f.availability.value.trim(),
        announcement: f.announcement.value.trim(),
        mode: f.mode.value,
        email: f.email.value.trim(),
        telegram: f.telegram.value.trim(),
        telegramUrl: f.telegramUrl.value.trim(),
        fiverrUrl: f.fiverrUrl.value.trim(),
        upworkUrl: f.upworkUrl.value.trim(),
        packages: [0, 1, 2].map(function (i) {
          var names = ['Starter', 'Growth', 'Signature'];
          var ids = ['starter', 'growth', 'signature'];
          return {
            id: ids[i],
            name: names[i],
            priceUsd: Number(f['pkg_' + i + '_priceUsd'].value),
            days: Number(f['pkg_' + i + '_days'].value),
            pages: Number(f['pkg_' + i + '_pages'].value),
            summary: f['pkg_' + i + '_summary'].value.trim()
          };
        })
      };

      var saveBtn = configForm.querySelector('[type="submit"]');
      if (saveBtn) saveBtn.disabled = true;

      fetch('/api/admin/config', {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json().then(function (body) { return { status: r.status, body: body }; }); })
        .then(function (res) {
          if (res.status === 401) {
            showGate('Session expired. Please sign in again.');
            return;
          }
          if (res.status === 200 && res.body && res.body.ok) {
            populateConfigForm(res.body.config);
            setStatusMessage(configStatus, 'success', 'Studio configuration saved.');
          } else {
            setStatusMessage(configStatus, 'error', (res.body && res.body.error) || 'Could not save changes.');
          }
        })
        .catch(function () {
          setStatusMessage(configStatus, 'error', 'Network error while saving.');
        })
        .finally(function () {
          if (saveBtn) saveBtn.disabled = false;
        });
    });
  }

  if (filterSelect) filterSelect.addEventListener('change', renderInquiries);
  if (refreshBtn) refreshBtn.addEventListener('click', loadAdminData);

  probeSession();
})();
