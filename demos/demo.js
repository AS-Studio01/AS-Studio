/* ============================================================================
   AS STUDIO — shared demo behaviour
   Small helpers the six concept demos call. No dependencies, ~2KB.
   ========================================================================== */

window.ASDemo = (function () {
  'use strict';

  /* Hides reveal targets only when JS is actually running, so a script
     failure can never leave the page blank. */
  document.documentElement.className =
    (document.documentElement.className + ' js').trim();

  /* ----------------------------------------------------------------
     Live open / closed status computed from the visitor's own clock.
     hours: { 0: [9,20] | null, 1: null, ... }  (null = closed all day)
     ---------------------------------------------------------------- */
  function liveStatus(opts) {
    var pill = document.getElementById(opts.pill);
    var text = document.getElementById(opts.text);
    if (!pill || !text || !opts.hours) return;

    function pad(n) { return n < 10 ? '0' + n : String(n); }

    function update() {
      var now = new Date();
      var day = now.getDay();
      var minutes = now.getHours() * 60 + now.getMinutes();
      var today = opts.hours[day];
      var open = !!today && minutes >= today[0] * 60 && minutes < today[1] * 60;

      pill.setAttribute('data-open', String(open));

      if (open) {
        var close = today[1];
        var suffix = close >= 12 ? 'pm' : 'am';
        var h12 = close > 12 ? close - 12 : close;
        text.textContent = 'Open now · until ' + h12 + suffix;
      } else {
        /* find the next opening day, up to a week ahead */
        var nextDay = null, nextHour = null;
        for (var i = 1; i <= 7; i++) {
          var d = (day + i) % 7;
          if (opts.hours[d]) { nextDay = d; nextHour = opts.hours[d][0]; break; }
        }
        if (nextDay !== null) {
          var names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          var h = nextHour > 12 ? nextHour - 12 : nextHour;
          var ap = nextHour >= 12 ? 'pm' : 'am';
          text.textContent = 'Closed · opens ' + (i === 1 ? 'tomorrow ' : names[nextDay] + ' ') + h + ap;
        } else {
          text.textContent = 'Closed';
        }
      }
      pill.setAttribute('aria-label', text.textContent);
    }

    update();
    setInterval(update, 60000);

    /* highlight today's row in the hours table */
    if (opts.highlight) {
      var list = document.getElementById(opts.highlight);
      if (list) {
        var row = list.querySelector('li[data-day="' + new Date().getDay() + '"]');
        if (row) row.classList.add('today');
      }
    }
  }

  /* ----------------------------------------------------------------
     Filter a list of rows by a data-cat attribute.
     ---------------------------------------------------------------- */
  function menuFilter(buttonSel, rowSel) {
    var buttons = document.querySelectorAll(buttonSel);
    var rows = document.querySelectorAll(rowSel);
    if (!buttons.length || !rows.length) return;

    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-cat');
        Array.prototype.forEach.call(buttons, function (b) {
          b.setAttribute('aria-pressed', 'false');
        });
        btn.setAttribute('aria-pressed', 'true');

        var shown = 0;
        Array.prototype.forEach.call(rows, function (row) {
          var match = cat === 'all' || row.getAttribute('data-cat') === cat;
          row.hidden = !match;
          if (match) shown++;
        });

        /* announce the result for screen readers */
        var list = document.querySelector(rowSel);
        if (list) {
          list.setAttribute('aria-live', 'polite');
          list.setAttribute('aria-label', shown + ' items shown');
        }
      });
    });
  }

  /* ----------------------------------------------------------------
     Tab / accordion behaviour.
     ---------------------------------------------------------------- */
  function accordion(itemSel, headSel) {
    var items = document.querySelectorAll(itemSel);
    Array.prototype.forEach.call(items, function (item) {
      var head = item.querySelector(headSel);
      var body = head && head.nextElementSibling;
      if (!head || !body) return;

      head.setAttribute('aria-expanded', 'false');
      body.hidden = true;

      head.addEventListener('click', function () {
        var isOpen = head.getAttribute('aria-expanded') === 'true';
        /* close siblings so only one panel is open at a time */
        Array.prototype.forEach.call(items, function (other) {
          var oh = other.querySelector(headSel);
          var ob = oh && oh.nextElementSibling;
          if (!oh || !ob) return;
          oh.setAttribute('aria-expanded', 'false');
          ob.hidden = true;
        });
        if (!isOpen) {
          head.setAttribute('aria-expanded', 'true');
          body.hidden = false;
        }
      });
    });
  }

  /* ----------------------------------------------------------------
     Simple cart that persists in sessionStorage.
     ---------------------------------------------------------------- */
  function cart(opts) {
    var KEY = opts.key || 'as-demo-cart';
    var items = [];
    try { items = JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch (_) { items = []; }

    var countEls = document.querySelectorAll(opts.countSel || '[data-cart-count]');
    var totalEls = document.querySelectorAll(opts.totalSel || '[data-cart-total]');
    var listEl = opts.listSel ? document.querySelector(opts.listSel) : null;

    function money(n) {
      return (opts.currency || '₹') + n.toLocaleString('en-IN');
    }

    function render() {
      var count = items.reduce(function (s, i) { return s + i.qty; }, 0);
      var total = items.reduce(function (s, i) { return s + i.price * i.qty; }, 0);

      Array.prototype.forEach.call(countEls, function (el) {
        el.textContent = String(count);
        el.setAttribute('aria-label', count + ' items in basket');
      });
      Array.prototype.forEach.call(totalEls, function (el) {
        el.textContent = money(total);
      });

      if (listEl) {
        if (!items.length) {
          listEl.innerHTML = '<p class="cart-empty">Your basket is empty.</p>';
        } else {
          listEl.innerHTML = items.map(function (i) {
            return '<div class="cart-line">' +
              '<span class="cart-name">' + i.name +
                '<small>' + i.qty + ' × ' + money(i.price) + '</small></span>' +
              '<span class="cart-price">' + money(i.price * i.qty) + '</span>' +
            '</div>';
          }).join('');
        }
      }

      try { sessionStorage.setItem(KEY, JSON.stringify(items)); } catch (_) {}
    }

    function add(name, price) {
      var found = null;
      for (var i = 0; i < items.length; i++) {
        if (items[i].name === name) { found = items[i]; break; }
      }
      if (found) found.qty += 1;
      else items.push({ name: name, price: price, qty: 1 });
      render();
    }

    /* wire up add buttons: data-add="Name" data-price="250" */
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-add]'),
      function (btn) {
        btn.addEventListener('click', function () {
          var name = btn.getAttribute('data-add');
          var price = parseInt(btn.getAttribute('data-price'), 10) || 0;
          add(name, price);

          var original = btn.textContent;
          btn.textContent = 'Added ✓';
          btn.disabled = true;
          setTimeout(function () {
            btn.textContent = original;
            btn.disabled = false;
          }, 1100);
        });
      }
    );

    render();
    return { add: add, render: render, money: money };
  }

  /* ----------------------------------------------------------------
     Reveal on scroll, with a hard backstop so content is never lost.
     ---------------------------------------------------------------- */
  function reveal() {
    var items = document.querySelectorAll('[data-rv]');
    if (!items.length) return;

    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

    Array.prototype.forEach.call(items, function (el) { io.observe(el); });

    setTimeout(function () {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('in'); });
    }, 2200);
  }

  /* ----------------------------------------------------------------
     Misc
     ---------------------------------------------------------------- */
  function year(id) {
    var el = document.getElementById(id || 'year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function toast(msg) {
    var existing = document.getElementById('demo-toast');
    if (existing) existing.remove();
    var el = document.createElement('div');
    el.id = 'demo-toast';
    el.textContent = msg;
    el.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;background:#060b1f;color:#fff;padding:12px 18px;border-radius:12px;font-size:13.5px;font-weight:600;box-shadow:0 16px 36px -12px rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.14);';
    document.body.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.remove(); }, 3200);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-demo-toast]');
    if (btn) {
      e.preventDefault();
      toast(btn.getAttribute('data-demo-toast'));
    }
  });

  return {
    liveStatus: liveStatus,
    menuFilter: menuFilter,
    accordion: accordion,
    cart: cart,
    reveal: reveal,
    year: year,
    toast: toast
  };
})();
