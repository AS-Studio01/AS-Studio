/* Builder Mark Badge Script for Client Websites
   Reads client_sites/<key> from Firestore (public read)
   Badge shows by default and remains visible unless document exists and paid === true */
(function() {
  'use strict';

  // Read site key from own script tag attribute
  var scriptTag = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var s = scripts[i];
      if (s.src && (s.src.indexOf('builder-mark') !== -1 || s.src.indexOf('mark.js') !== -1)) {
        return s;
      }
    }
    return scripts[scripts.length - 1];
  })();

  var siteKey = scriptTag ? (
    scriptTag.getAttribute('data-site-key') ||
    scriptTag.getAttribute('data-key') ||
    scriptTag.getAttribute('data-site') ||
    ''
  ).trim() : '';

  // Determine origin from script src
  var scriptSrc = (scriptTag && scriptTag.src) ? scriptTag.src : '';
  var studioOrigin = (function() {
    try {
      if (scriptSrc) {
        var u = new URL(scriptSrc, window.location.href);
        return u.origin;
      }
    } catch (_) {}
    return 'https://asstudio.in';
  })();

  // Ensure stylesheet is dynamically linked if not already on the page
  var cssUrl = (function() {
    if (scriptSrc) {
      return scriptSrc.replace(/\.js(\?.*)?$/i, '.css');
    }
    return studioOrigin + '/builder-mark/builder-mark.css';
  })();

  if (!document.querySelector('link[href*="builder-mark"]') && !document.querySelector('link[href*="mark.css"]')) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    (document.head || document.documentElement).appendChild(link);
  }

  // Create badge element
  var logoUrl = studioOrigin + '/assets/brand/logo-mark.svg';
  var badge = document.createElement('a');
  badge.id = 'as-builder-mark';
  badge.className = 'as-builder-mark';
  badge.href = 'https://asstudio.in/';
  badge.target = '_blank';
  badge.rel = 'noopener';
  badge.setAttribute('aria-label', 'Built by AS Studio');

  badge.innerHTML =
    '<img src="' + logoUrl + '" class="as-builder-mark__logo" alt="" width="16" height="16" aria-hidden="true" onerror="this.style.display=\'none\'">' +
    '<span class="as-builder-mark__text">Built by AS Studio</span>';

  function attachBadge() {
    if (!badge.parentNode && document.body) {
      document.body.appendChild(badge);
    }
  }

  if (document.body) {
    attachBadge();
  } else {
    document.addEventListener('DOMContentLoaded', attachBadge);
  }

  // If no siteKey provided, badge must still show
  if (!siteKey) return;

  // Read public Firestore document client_sites/<key>
  var P = 'profound-handbook-z3skh', DB = '(default)', K = 'AIzaSyA1km1IvXjyPTkO0grVOunMorlOoARLd2w';
  var URL_ = 'https://firestore.googleapis.com/v1/projects/' + P + '/databases/' + DB + '/documents/client_sites/' + encodeURIComponent(siteKey) + '?key=' + K;

  var ctrl = window.AbortController ? new AbortController() : null;
  var timer = setTimeout(function() { if (ctrl) ctrl.abort(); }, 6000);

  // Read without cache so it is never hidden due to stale or cached data
  fetch(URL_, { cache: 'no-store', signal: ctrl ? ctrl.signal : undefined })
    .then(function(res) {
      clearTimeout(timer);
      if (!res.ok) {
        // Document missing (404) or network failure: badge must still show
        return null;
      }
      return res.json();
    })
    .then(function(json) {
      if (!json || !json.fields) return;
      var paid = !!(json.fields.paid && json.fields.paid.booleanValue === true);
      if (paid) {
        // Disappear ONLY when document exists and paid is true
        if (badge.parentNode) {
          badge.parentNode.removeChild(badge);
        } else {
          badge.style.display = 'none';
        }
      }
    })
    .catch(function() {
      // If the read fails, the badge must still show
    });
})();
