/* AS Studio boot — runs before paint. Restores saved theme preference.
   Kept tiny and render-blocking on purpose to avoid a flash of wrong theme. */
(function () {
  /* Progressive enhancement switch.
     Content is visible by default. Only when JS runs do we opt in to
     scroll-reveal animation — so a JS failure, a print, a screenshot or a
     text-only browser still shows the whole page. */
  document.documentElement.className =
    (document.documentElement.className + ' js').trim();

  try {
    var saved = localStorage.getItem('as-theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (_) { /* private mode — ignore */ }
})();
