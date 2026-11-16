(function () {
  var root = document.documentElement;
  root.classList.add('js-ready');
  try {
    var savedTheme = localStorage.getItem('as_theme');
    var theme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
    root.setAttribute('data-theme', theme);
    var params = new URLSearchParams(window.location.search);
    var modeParam = params.get('mode');
    if (modeParam === 'direct' || modeParam === 'fiverr' || modeParam === 'upwork') {
      localStorage.setItem('as_mode', modeParam);
    }
    var mode = localStorage.getItem('as_mode');
    if (mode === 'direct' || mode === 'fiverr' || mode === 'upwork') {
      root.setAttribute('data-mode', mode);
    }
  } catch (_) {
    root.setAttribute('data-theme', 'dark');
  }
})();
