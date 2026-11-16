(function () {
  'use strict';

  function setYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = year;
    });
  }

  function initReveal() {
    var items = document.querySelectorAll('.d-reveal');
    if (!items.length) return;
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Live open/closed schedule status indicator (e.g., Mitti Café 08:00-22:30, VitalCare 08:00-20:00)
  function initLiveStatus() {
    document.querySelectorAll('[data-live-status]').forEach(function (el) {
      var openHour = Number(el.getAttribute('data-open-hour') || 8);
      var closeHour = Number(el.getAttribute('data-close-hour') || 22);
      var labelOpen = el.getAttribute('data-open-label') || 'Open now';
      var labelClosed = el.getAttribute('data-closed-label') || 'Closed now';

      var now = new Date();
      var istOffsetMin = 330;
      var utcMin = now.getUTCHours() * 60 + now.getUTCMinutes();
      var istHour = Math.floor(((utcMin + istOffsetMin) % 1440) / 60);
      var isOpen = istHour >= openHour && istHour < closeHour;
      el.textContent = (isOpen ? labelOpen : labelClosed) + ' · ' + openHour + ':00–' + closeHour + ':00 IST';
    });
  }

  // Category / Menu / Roster filter tabs
  function initMenuFilter() {
    document.querySelectorAll('[data-filter-group]').forEach(function (group) {
      var targetId = group.getAttribute('data-filter-group');
      var container = document.getElementById(targetId);
      if (!container) return;

      var buttons = group.querySelectorAll('[data-filter]');
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var category = btn.getAttribute('data-filter');
          buttons.forEach(function (b) {
            var active = b === btn;
            b.classList.toggle('is-active', active);
            b.setAttribute('aria-pressed', active ? 'true' : 'false');
          });
          container.querySelectorAll('[data-category]').forEach(function (item) {
            var itemCats = (item.getAttribute('data-category') || '').split(/\s+/);
            item.hidden = category !== 'all' && itemCats.indexOf(category) === -1;
          });
        });
      });
    });
  }

  // Accordion panels (Rao Chambers / FAQ)
  function initAccordion() {
    document.querySelectorAll('[data-acc-trigger]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        var panel = document.getElementById(btn.getAttribute('aria-controls') || '');
        btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        if (panel) panel.hidden = isOpen;
      });
    });
  }

  // Slide-over shopping cart drawer (Atelier North)
  function initCart() {
    var drawer = document.getElementById('cart-drawer');
    if (!drawer) return;

    var itemsEl = document.getElementById('cart-items');
    var subtotalEl = document.getElementById('cart-subtotal');
    var countEl = document.getElementById('cart-count');
    var checkoutMsg = document.getElementById('cart-message');
    var cart = [];

    function render() {
      if (!itemsEl) return;
      itemsEl.textContent = '';
      var total = 0;
      var count = 0;

      if (!cart.length) {
        var empty = document.createElement('p');
        empty.style.color = 'var(--d-muted)';
        empty.textContent = 'Your bag is currently empty.';
        itemsEl.appendChild(empty);
      } else {
        cart.forEach(function (entry, idx) {
          total += entry.price * entry.qty;
          count += entry.qty;

          var row = document.createElement('div');
          row.className = 'cart-row';

          var info = document.createElement('div');
          var title = document.createElement('strong');
          title.textContent = entry.name;
          var price = document.createElement('div');
          price.className = 'd-price';
          price.style.fontSize = '0.84rem';
          price.style.color = 'var(--d-muted)';
          price.textContent = '$' + (entry.price * entry.qty);
          info.appendChild(title);
          info.appendChild(price);

          var qtyBox = document.createElement('div');
          qtyBox.className = 'cart-qty';
          var minus = document.createElement('button');
          minus.type = 'button';
          minus.textContent = '-';
          minus.setAttribute('aria-label', 'Decrease quantity');
          minus.addEventListener('click', function () {
            entry.qty -= 1;
            if (entry.qty <= 0) cart.splice(idx, 1);
            render();
          });

          var qtyLabel = document.createElement('span');
          qtyLabel.textContent = String(entry.qty);

          var plus = document.createElement('button');
          plus.type = 'button';
          plus.textContent = '+';
          plus.setAttribute('aria-label', 'Increase quantity');
          plus.addEventListener('click', function () {
            entry.qty += 1;
            render();
          });

          qtyBox.appendChild(minus);
          qtyBox.appendChild(qtyLabel);
          qtyBox.appendChild(plus);
          row.appendChild(info);
          row.appendChild(qtyBox);
          itemsEl.appendChild(row);
        });
      }

      if (subtotalEl) subtotalEl.textContent = '$' + total.toLocaleString();
      if (countEl) countEl.textContent = String(count);
    }

    function openCart() {
      drawer.hidden = false;
      if (checkoutMsg) checkoutMsg.hidden = true;
    }

    function closeCart() {
      drawer.hidden = true;
    }

    document.querySelectorAll('[data-open-cart]').forEach(function (btn) {
      btn.addEventListener('click', openCart);
    });
    document.querySelectorAll('[data-close-cart]').forEach(function (btn) {
      btn.addEventListener('click', closeCart);
    });
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) closeCart();
    });

    document.querySelectorAll('[data-add-to-cart]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var name = btn.getAttribute('data-name') || 'Edition Piece';
        var price = Number(btn.getAttribute('data-price') || 0);
        var existing = cart.find(function (item) { return item.name === name; });
        if (existing) existing.qty += 1;
        else cart.push({ name: name, price: price, qty: 1 });
        render();
        openCart();
      });
    });

    var checkoutBtn = document.getElementById('cart-checkout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function () {
        if (!cart.length) return;
        cart = [];
        render();
        if (checkoutMsg) {
          checkoutMsg.hidden = false;
          checkoutMsg.textContent = 'Demo order queued for trade dispatch confirmation.';
        }
      });
    }

    render();
  }

  // Interactive EMI Calculator (Apex Residences)
  function initEmiCalculator() {
    var priceEl = document.getElementById('emi-price');
    var downEl = document.getElementById('emi-down');
    var rateEl = document.getElementById('emi-rate');
    var yearsEl = document.getElementById('emi-years');
    var outMonthly = document.getElementById('emi-monthly');
    var outLoan = document.getElementById('emi-loan');
    if (!priceEl || !downEl || !rateEl || !yearsEl || !outMonthly) return;

    function recalc() {
      var price = Number(priceEl.value);
      var downPct = Number(downEl.value);
      var ratePct = Number(rateEl.value);
      var years = Number(yearsEl.value);

      var loan = price * (1 - downPct / 100);
      var monthlyRate = ratePct / 12 / 100;
      var months = years * 12;
      var factor = Math.pow(1 + monthlyRate, months);
      var emi = monthlyRate > 0 ? (loan * monthlyRate * factor) / (factor - 1) : loan / months;

      outMonthly.textContent = '$' + Math.round(emi).toLocaleString() + ' / mo';
      if (outLoan) outLoan.textContent = '$' + Math.round(loan).toLocaleString();

      var downVal = document.getElementById('emi-down-val');
      var rateVal = document.getElementById('emi-rate-val');
      var yearsVal = document.getElementById('emi-years-val');
      if (downVal) downVal.textContent = downPct + '%';
      if (rateVal) rateVal.textContent = ratePct.toFixed(1) + '%';
      if (yearsVal) yearsVal.textContent = years + ' yrs';
    }

    [priceEl, downEl, rateEl, yearsEl].forEach(function (ctrl) {
      ctrl.addEventListener('input', recalc);
      ctrl.addEventListener('change', recalc);
    });
    recalc();
  }

  // Billing toggle & API snippet switcher (Delta.OS)
  function initBillingAndDocs() {
    var toggle = document.getElementById('billing-toggle');
    if (toggle) {
      toggle.addEventListener('change', function () {
        var annual = toggle.checked;
        document.querySelectorAll('[data-monthly][data-annual]').forEach(function (el) {
          el.textContent = annual ? el.getAttribute('data-annual') : el.getAttribute('data-monthly');
        });
      });
    }

    var tabButtons = document.querySelectorAll('[data-code-tab]');
    var codeDisplay = document.getElementById('api-code-block');
    if (tabButtons.length && codeDisplay) {
      var snippets = {
        curl: 'curl -X POST https://api.deltaos.example/v2/events \\\n  -H "Authorization: Bearer $DELTA_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"service":"checkout-api","latency_ms":42,"ok":true}\'',
        node: 'import { DeltaClient } from "@delta-os/sdk";\n\nconst delta = new DeltaClient({ token: process.env.DELTA_TOKEN });\nawait delta.track("checkout.completed", { latencyMs: 42, region: "ap-south-1" });',
        sql: 'SELECT service, percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms) AS p95\nFROM telemetry_events\nWHERE recorded_at > NOW() - INTERVAL \'1 hour\'\nGROUP BY service;'
      };
      tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key = btn.getAttribute('data-code-tab');
          tabButtons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
          codeDisplay.textContent = snippets[key] || snippets.curl;
        });
      });
    }

    var copyBtn = document.getElementById('copy-snippet');
    if (copyBtn && codeDisplay) {
      copyBtn.addEventListener('click', function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(codeDisplay.textContent || '');
        }
        copyBtn.textContent = 'Copied';
        setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1600);
      });
    }
  }

  // Interactive Booking / Slot / Reservation forms (no network side effects)
  function initDemoForms() {
    document.querySelectorAll('[data-demo-form]').forEach(function (form) {
      var status = form.querySelector('[data-demo-status]');
      var message = form.getAttribute('data-confirm-message') || 'Request recorded in demo mode.';
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        if (status) {
          status.hidden = false;
          status.textContent = message;
        }
        form.reset();
      });
    });
  }

  setYear();
  initReveal();
  initLiveStatus();
  initMenuFilter();
  initAccordion();
  initCart();
  initEmiCalculator();
  initBillingAndDocs();
  initDemoForms();
})();
