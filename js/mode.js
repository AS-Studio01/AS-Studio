/* Marketplace mode switch: reads site_settings/main from Firestore (public read)
   Controls Direct, Fiverr, and Upwork states. Default is safe fallback (both off). */
(function() {
  'use strict';
  var P = 'profound-handbook-z3skh', DB = '(default)', K = 'AIzaSyA1km1IvXjyPTkO0grVOunMorlOoARLd2w';
  var URL_ = 'https://firestore.googleapis.com/v1/projects/' + P + '/databases/' + DB + '/documents/site_settings/main?key=' + K;

  function validFiverr(u) {
    return typeof u === 'string' && /^https:\/\/(www\.)?fiverr\.com\/\S+$/i.test(u.trim()) && u.indexOf('REPLACE') < 0;
  }

  function validUpwork(u) {
    return typeof u === 'string' && /^https:\/\/(www\.)?upwork\.com\/(freelancers|agencies)\/\S+$/i.test(u.trim()) && u.indexOf('REPLACE') < 0;
  }

  function applyMarketplaces(fiverrOn, fiverrUrl, upworkOn, upworkUrl) {
    var fv = !!(fiverrOn && validFiverr(fiverrUrl));
    var up = !!(upworkOn && validUpwork(upworkUrl));

    var doc = document.documentElement;
    doc.setAttribute('data-fiverr', fv ? 'on' : 'off');
    doc.setAttribute('data-upwork', up ? 'on' : 'off');
    doc.setAttribute('data-marketplace', (fv || up) ? 'on' : 'off');
    doc.setAttribute('data-pricing', fv ? 'fixed' : 'direct');
    doc.setAttribute('data-mode', fv ? 'fiverr' : 'direct');

    if (fv) {
      var fvLinks = document.querySelectorAll('[data-fiverr-link]');
      for (var i = 0; i < fvLinks.length; i++) {
        fvLinks[i].setAttribute('href', fiverrUrl.trim());
      }
    }
    if (up) {
      var upLinks = document.querySelectorAll('[data-upwork-link]');
      for (var j = 0; j < upLinks.length; j++) {
        upLinks[j].setAttribute('href', upworkUrl.trim());
      }
    }

    // Clean up stale localStorage so switched-off marketplaces are never shown from cache
    try {
      if (!fv) {
        localStorage.removeItem('as-fiverr-url');
        if (!up) localStorage.setItem('as-mode', 'direct');
      } else {
        localStorage.setItem('as-mode', 'fiverr');
        localStorage.setItem('as-fiverr-url', fiverrUrl.trim());
      }
      if (up) {
        localStorage.setItem('as-upwork-url', upworkUrl.trim());
      } else {
        localStorage.removeItem('as-upwork-url');
      }
    } catch (_) {}
  }

  // Safe fallback default: both off
  applyMarketplaces(false, '', false, '');

  var ctrl = window.AbortController ? new AbortController() : null;
  var timer = setTimeout(function() { if (ctrl) ctrl.abort(); }, 6000);

  fetch(URL_, { cache: 'no-store', signal: ctrl ? ctrl.signal : undefined })
    .then(function(res) { return res.ok ? res.json() : null; })
    .then(function(json) {
      clearTimeout(timer);
      if (!json || !json.fields) return;
      var f = json.fields;
      var fvOn = !!(f.fiverrMode && f.fiverrMode.booleanValue);
      var fvUrl = (f.fiverrUrl && f.fiverrUrl.stringValue) || '';
      var upOn = !!(f.upworkMode && f.upworkMode.booleanValue);
      var upUrl = (f.upworkUrl && f.upworkUrl.stringValue) || '';
      applyMarketplaces(fvOn, fvUrl, upOn, upUrl);
    })
    .catch(function() {
      // Safe fallback on error: remain both off
      applyMarketplaces(false, '', false, '');
    });
})();
