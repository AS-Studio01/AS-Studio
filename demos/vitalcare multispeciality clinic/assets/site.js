/* VitalCare Multispecialty Clinic - Interactive Features */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Light / Dark)
  const themeToggle = document.querySelector('.theme-toggle');
  const getStoredTheme = () => {
    try { return localStorage.getItem('vitalcare-theme'); } catch (_) { return null; }
  };
  const setStoredTheme = (t) => {
    try { localStorage.setItem('vitalcare-theme', t); } catch (_) {}
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    }
  };

  const initialTheme = getStoredTheme() || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      setStoredTheme(next);
    });
  }

  // 2. Mobile Menu Navigation
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
      }
    });
  }

  // 3. Appointment Form Logic & Deep Linking
  const appointmentForm = document.getElementById('appointment-form');
  if (appointmentForm) {
    // Pre-select service from URL parameter (e.g. ?service=Paediatrics)
    const urlParams = new URLSearchParams(window.location.search);
    const prefillService = urlParams.get('service');
    const serviceSelect = appointmentForm.querySelector('select[name="service"]');
    if (prefillService && serviceSelect) {
      for (const option of serviceSelect.options) {
        if (option.value.toLowerCase() === prefillService.toLowerCase() || option.text.toLowerCase() === prefillService.toLowerCase()) {
          option.selected = true;
          break;
        }
      }
    }

    // Textarea character count
    const textarea = appointmentForm.querySelector('textarea[name="message"]');
    const charCount = appointmentForm.querySelector('.char-count');
    if (textarea && charCount) {
      textarea.addEventListener('input', () => {
        charCount.textContent = `${textarea.value.length} / ${textarea.maxLength}`;
      });
    }

    // Form submission validation & demonstration simulation
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear existing errors
      appointmentForm.querySelectorAll('.field-error').forEach(el => el.textContent = '');

      // Name validation
      const nameInput = appointmentForm.querySelector('input[name="name"]');
      if (nameInput && nameInput.value.trim().length < 2) {
        isValid = false;
        const err = nameInput.parentElement.querySelector('.field-error');
        if (err) err.textContent = 'Please enter your full name.';
      }

      // Email validation
      const emailInput = appointmentForm.querySelector('input[name="email"]');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput && !emailRegex.test(emailInput.value.trim())) {
        isValid = false;
        const err = emailInput.parentElement.querySelector('.field-error');
        if (err) err.textContent = 'Please enter a valid email address.';
      }

      // Service selection
      if (serviceSelect && !serviceSelect.value) {
        isValid = false;
        const err = serviceSelect.parentElement.querySelector('.field-error');
        if (err) err.textContent = 'Please select a care area.';
      }

      // Consent checkbox
      const consentInput = appointmentForm.querySelector('input[name="consent"]');
      const consentErr = appointmentForm.querySelector('.consent-error');
      if (consentInput && !consentInput.checked) {
        isValid = false;
        if (consentErr) consentErr.textContent = 'Please confirm that you understand this is a fictional concept.';
      }

      if (!isValid) return;

      // Render simulated preview result
      const resultBox = document.getElementById('form-result');
      if (resultBox) {
        const nameVal = nameInput ? nameInput.value.trim() : 'Patient';
        const serviceVal = serviceSelect ? serviceSelect.value : 'General Medicine';
        resultBox.hidden = false;
        resultBox.innerHTML = `
          <strong>✓ Demo Request Simulated Successfully</strong><br>
          Thank you, <em>${nameVal}</em>. In a live clinic system, your enquiry for <strong>${serviceVal}</strong> would be encrypted and securely dispatched to the clinic reception.<br>
          <small style="opacity:0.8;display:block;margin-top:6px;">(No data was saved or transmitted. This is a design demo.)</small>
        `;
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
});
