// AS Studio Mode Switcher (Direct vs Fiverr order modes)
export function initMode() {
  try {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    const fiverrUrlParam = params.get('fiverr_url');

    if (fiverrUrlParam && /^https:\/\/(www\.)?fiverr\.com\//i.test(fiverrUrlParam)) {
      localStorage.setItem('as-fiverr-url', fiverrUrlParam);
    }
    if (modeParam === 'fiverr' || modeParam === 'direct') {
      localStorage.setItem('as-mode', modeParam);
    }

    const savedMode = localStorage.getItem('as-mode');
    const savedFiverrUrl = localStorage.getItem('as-fiverr-url');
    const activeMode = (savedMode === 'fiverr' && /^https:\/\/(www\.)?fiverr\.com\//i.test(savedFiverrUrl || '')) ? 'fiverr' : 'direct';

    document.documentElement.setAttribute('data-mode', activeMode);

    if (savedFiverrUrl) {
      document.querySelectorAll('[data-fiverr-link]').forEach(el => {
        el.setAttribute('href', savedFiverrUrl);
      });
    }
  } catch (e) {
    console.warn('Mode controller error:', e);
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMode);
  } else {
    initMode();
  }
}
