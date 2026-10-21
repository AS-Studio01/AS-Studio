/* Marketplace mode switch: instant local cache -> Express server cache -> Firestore sync
   Controls Direct, Fiverr, and Upwork states. */
(function() {
  'use strict';
  var DEFAULT_FIVERR = 'https://www.fiverr.com/s/GPPQm9q';
  var DEFAULT_UPWORK = 'https://www.upwork.com/freelancers/~01db1175182843f13a?mp_source=share';

  var P = 'profound-handbook-z3skh', DB = 'ai-studio-asstudio-bc59d6e2-7ac2-415f-a1f3-6095feae2fe1', K = 'AIzaSyA1km1IvXjyPTkO0grVOunMorlOoARLd2w';
  var FIRESTORE_URL = 'https://firestore.googleapis.com/v1/projects/' + P + '/databases/' + DB + '/documents/site_settings/main?key=' + K;

  function validFiverr(u) {
    return typeof u === 'string' && /^https:\/\/(www\.)?fiverr\.com\/\S+$/i.test(u.trim()) && u.indexOf('REPLACE') < 0;
  }

  function validUpwork(u) {
    return typeof u === 'string' && /^https:\/\/(www\.)?upwork\.com\/(freelancers|agencies)\/\S+$/i.test(u.trim()) && u.indexOf('REPLACE') < 0;
  }

  function applyMarketplaces(fiverrOn, fiverrUrl, upworkOn, upworkUrl) {
    var fvClean = (fiverrUrl || '').trim();
    var upClean = (upworkUrl || '').trim();
    if (!validFiverr(fvClean)) fvClean = DEFAULT_FIVERR;
    if (!validUpwork(upClean)) upClean = DEFAULT_UPWORK;

    var fv = !!(fiverrOn && validFiverr(fvClean));
    var up = !!(upworkOn && validUpwork(upClean));

    var doc = document.documentElement;
    doc.setAttribute('data-fiverr', fv ? 'on' : 'off');
    doc.setAttribute('data-upwork', up ? 'on' : 'off');
    doc.setAttribute('data-marketplace', (fv || up) ? 'on' : 'off');
    doc.setAttribute('data-pricing', fv ? 'fixed' : 'direct');
    doc.setAttribute('data-mode', fv ? 'fiverr' : (up ? 'upwork' : 'direct'));

    if (fv) {
      var fvLinks = document.querySelectorAll('[data-fiverr-link]');
      for (var i = 0; i < fvLinks.length; i++) {
        fvLinks[i].setAttribute('href', fvClean);
      }
    }
    if (up) {
      var upLinks = document.querySelectorAll('[data-upwork-link]');
      for (var j = 0; j < upLinks.length; j++) {
        upLinks[j].setAttribute('href', upClean);
      }
    }

    try {
      localStorage.setItem('as-fiverr-url', fvClean);
      localStorage.setItem('as-upwork-url', upClean);
      localStorage.setItem('as-fiverr-on', fv ? 'true' : 'false');
      localStorage.setItem('as-upwork-on', up ? 'true' : 'false');
      localStorage.setItem('as-mode', fv ? 'fiverr' : (up ? 'upwork' : 'direct'));
    } catch (_) {}
  }

  // 1. Instant Synchronous Layer: Fiverr Active, Upwork Inactive (account not active / connects over)
  var cachedFvUrl = DEFAULT_FIVERR;
  var cachedUpUrl = DEFAULT_UPWORK;
  var cachedFvOn = true;
  var cachedUpOn = false;

  try {
    var sf = localStorage.getItem('as-fiverr-url');
    var su = localStorage.getItem('as-upwork-url');
    var sfo = localStorage.getItem('as-fiverr-on');
    var suo = localStorage.getItem('as-upwork-on');
    if (sf && validFiverr(sf)) cachedFvUrl = sf;
    if (su && validUpwork(su)) cachedUpUrl = su;
    if (sfo !== null) cachedFvOn = sfo === 'true';
    if (suo !== null) cachedUpOn = suo === 'true';
    else cachedUpOn = false;
  } catch (_) {}

  applyMarketplaces(cachedFvOn, cachedFvUrl, cachedUpOn, cachedUpUrl);

  // 2. Real-Time Storage Listener: update immediately if changed in admin panel tab
  window.addEventListener('storage', function(e) {
    if (e.key === 'as-fiverr-url' || e.key === 'as-upwork-url' || e.key === 'as-fiverr-on' || e.key === 'as-upwork-on') {
      try {
        var sf = localStorage.getItem('as-fiverr-url') || DEFAULT_FIVERR;
        var su = localStorage.getItem('as-upwork-url') || DEFAULT_UPWORK;
        var sfo = localStorage.getItem('as-fiverr-on') !== 'false';
        var suo = localStorage.getItem('as-upwork-on') === 'true';
        applyMarketplaces(sfo, sf, suo, su);
      } catch (_) {}
    }
  });

  // 3. Fast Server Cache Layer (/api/site-settings)
  fetch('/api/site-settings', { cache: 'no-store' })
    .then(function(r) { return r.ok ? r.json() : null; })
    .then(function(data) {
      if (!data) return;
      var fvOn = data.fiverrMode !== undefined ? !!data.fiverrMode : cachedFvOn;
      var fvUrl = data.fiverrUrl || cachedFvUrl;
      var upOn = data.upworkMode !== undefined ? !!data.upworkMode : cachedUpOn;
      var upUrl = data.upworkUrl || cachedUpUrl;
      applyMarketplaces(fvOn, fvUrl, upOn, upUrl);
    })
    .catch(function() {});

  // 4. Firestore Public Read Layer
  var ctrl = window.AbortController ? new AbortController() : null;
  var timer = setTimeout(function() { if (ctrl) ctrl.abort(); }, 5000);

  fetch(FIRESTORE_URL, { cache: 'no-store', signal: ctrl ? ctrl.signal : undefined })
    .then(function(res) { return res.ok ? res.json() : null; })
    .then(function(json) {
      clearTimeout(timer);
      if (!json || !json.fields) return;
      var f = json.fields;
      var fvOn = f.fiverrMode !== undefined ? !!f.fiverrMode.booleanValue : true;
      var fvUrl = (f.fiverrUrl && f.fiverrUrl.stringValue) || DEFAULT_FIVERR;
      var upOn = f.upworkMode !== undefined ? !!f.upworkMode.booleanValue : false;
      var upUrl = (f.upworkUrl && f.upworkUrl.stringValue) || DEFAULT_UPWORK;
      applyMarketplaces(fvOn, fvUrl, upOn, upUrl);
    })
    .catch(function() {});
})();
