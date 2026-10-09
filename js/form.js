/**
 * AS Studio - Project Brief Submission Engine (Firebase Firestore & Notification)
 */
import * as F from './firebase.js';

export function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4200);
}

export function initBriefForm() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  // Auto-populate package selection from URL parameter if present (?package=core etc.)
  const urlParams = new URLSearchParams(window.location.search);
  const pkgParam = urlParams.get('package');
  const packageSelect = form.querySelector('[name="package"]');
  if (pkgParam && packageSelect) {
    for (const opt of packageSelect.options) {
      if (opt.value.toLowerCase().includes(pkgParam.toLowerCase())) {
        opt.selected = true;
        break;
      }
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : 'Send brief →';

    const f = new FormData(form);
    const clientName = (f.get('name') || '').trim();
    const businessName = (f.get('business') || '').trim();
    const contactChannel = (f.get('email') || '').trim();
    const scopeSummary = (f.get('scope') || '').trim();
    const targetBudget = (f.get('budget') || 'Flexible / Negotiable').trim();
    const packageChoice = (f.get('package') || 'Not specified').trim();

    if (!clientName || !businessName || !contactChannel || !scopeSummary) {
      showToast('Please fill out all required fields.');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting brief...';
    }

    const payload = {
      clientName,
      businessName,
      contactChannel,
      scopeSummary: `[Selected Package: ${packageChoice}]\n\n${scopeSummary}`,
      targetBudget,
      source: 'website_contact_form',
      status: 'new'
    };

    try {
      // 1. Save directly to verified Firestore collection 'inquiries'
      await F.addDoc(F.collection(F.db, 'inquiries'), {
        ...payload,
        createdAt: F.serverTimestamp(),
        updatedAt: F.serverTimestamp()
      });

      // 2. Notify studio founders via automated email dispatcher
      fetch('/api/inquiry/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('Inquiry webhook background notify error:', err));

      form.reset();
      showToast('Project brief received. We will respond within 24 hours.');
    } catch (err) {
      console.error('Firestore brief submit error:', err);
      // Graceful fallback notice providing direct Telegram & email
      showToast('Connection offline. Please chat directly on Telegram @AS_Studio_official01 or email hello@asstudio.in');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });
}

// Auto-run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBriefForm);
} else {
  initBriefForm();
}
