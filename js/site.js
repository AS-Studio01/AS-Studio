// AS Studio Main Site Controller
import { initInteractions } from './interactions.js';

export function initSite() {
  initInteractions();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSite);
  } else {
    initSite();
  }
}
