/**
 * VitalCare Multispecialty Clinic
 * Client-side interactivity & dynamic clinical appointment slot engine
 */
(() => {
  'use strict';

  // --- Theme Management ---
  const body = document.body;
  const savedTheme = (() => {
    try { return localStorage.getItem('vitalcare-theme'); } catch (_) { return null; }
  })();

  if (savedTheme === 'dark') body.classList.add('dark');

  function updateThemeUI() {
    const isDark = body.classList.contains('dark');
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
      const icon = btn.querySelector('.theme-icon');
      if (icon) icon.textContent = isDark ? '☼' : '◐';
    });
  }
  updateThemeUI();

  document.addEventListener('click', e => {
    const btn = e.target.closest('.theme-toggle');
    if (!btn) return;
    body.classList.toggle('dark');
    try {
      localStorage.setItem('vitalcare-theme', body.classList.contains('dark') ? 'dark' : 'light');
    } catch (_) {}
    updateThemeUI();
  });

  // --- Navigation & Mobile Menu ---
  const navToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  navToggle?.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  mainNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mainNav?.classList.contains('is-open')) {
      mainNav.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
      navToggle?.focus();
    }
  });

  // --- Department Operating Hours & Realistic Appointment Slot System ---
  const CLINIC_SCHEDULE = {
    'general-medicine': {
      name: 'General Medicine (Primary Care)',
      hours: 'Mon–Fri: 08:30 – 17:30 | Sat: 09:00 – 13:00 | Sun: Urgent Triage Only',
      weekdays: [
        { label: 'Morning Primary Care (08:30 – 12:00)', slots: ['08:30 AM (Urgent Triage)', '09:15 AM', '10:00 AM', '10:45 AM', '11:30 AM'] },
        { label: 'Afternoon Consultations (14:00 – 17:30)', slots: ['02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM', '05:00 PM'] }
      ],
      saturday: [
        { label: 'Saturday Morning Session (09:00 – 13:00)', slots: ['09:00 AM', '10:00 AM', '11:15 AM', '12:30 PM'] }
      ],
      sunday: [
        { label: 'Sunday On-Call Urgent Triage', slots: ['10:00 AM (Urgent Assessment)', '11:30 AM (Urgent Assessment)'] }
      ]
    },
    'paediatrics': {
      name: 'Paediatrics & Child Health',
      hours: 'Mon–Fri: 09:00 – 16:30 | Sat: 09:30 – 12:30 | Sun: Closed',
      weekdays: [
        { label: 'Morning Child Health Clinic (09:00 – 12:00)', slots: ['09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM'] },
        { label: 'Afternoon Well-Child & Immunisation (13:30 – 16:30)', slots: ['01:30 PM', '02:15 PM', '03:00 PM', '03:45 PM', '04:15 PM'] }
      ],
      saturday: [
        { label: 'Saturday Family Clinic (09:30 – 12:30)', slots: ['09:30 AM', '10:30 AM', '11:45 AM'] }
      ],
      sunday: []
    },
    'dermatology': {
      name: 'Dermatology & Skin Clinic',
      hours: 'Mon–Fri: 10:00 – 18:00 | Sat: 10:00 – 14:00 | Sun: Closed',
      weekdays: [
        { label: 'Diagnostic Skin Consultations (10:00 – 13:00)', slots: ['10:00 AM', '10:45 AM', '11:30 AM', '12:15 PM'] },
        { label: 'Afternoon Procedures & Reviews (14:30 – 18:00)', slots: ['02:30 PM', '03:15 PM', '04:00 PM', '04:45 PM', '05:30 PM'] }
      ],
      saturday: [
        { label: 'Saturday Skin Clinic (10:00 – 14:00)', slots: ['10:00 AM', '11:00 AM', '12:15 PM', '01:15 PM'] }
      ],
      sunday: []
    },
    'physiotherapy': {
      name: 'Physiotherapy & Rehabilitation',
      hours: 'Mon–Fri: 07:30 – 19:00 | Sat: 08:30 – 14:00 | Sun: Closed',
      weekdays: [
        { label: 'Early Morning Athletic Conditioning (07:30 – 11:30)', slots: ['07:30 AM', '08:15 AM', '09:00 AM', '10:00 AM', '11:00 AM'] },
        { label: 'Afternoon & Evening Spinal Rehab (13:30 – 19:00)', slots: ['01:30 PM', '02:30 PM', '03:45 PM', '05:00 PM', '06:00 PM', '06:45 PM'] }
      ],
      saturday: [
        { label: 'Saturday Musculoskeletal Clinic (08:30 – 14:00)', slots: ['08:30 AM', '09:30 AM', '10:45 AM', '12:00 PM', '01:00 PM'] }
      ],
      sunday: []
    },
    'diagnostics': {
      name: 'Diagnostics & Clinical Pathology',
      hours: 'Mon–Fri: 07:30 – 15:30 (Fasting 07:30–10:30) | Sat: 08:00 – 12:00 | Sun: Closed',
      weekdays: [
        { label: 'Morning Fasting Profiles & Ultrasound (07:30 – 11:30)', slots: ['07:30 AM (Fasting Profile)', '08:15 AM (Fasting Profile)', '09:00 AM (Fasting Profile)', '10:00 AM', '11:00 AM'] },
        { label: 'Afternoon Non-Fasting Scans & ECG (13:00 – 15:30)', slots: ['01:00 PM (ECG / Ultrasound)', '02:00 PM', '03:00 PM'] }
      ],
      saturday: [
        { label: 'Saturday Morning Diagnostic Draws (08:00 – 12:00)', slots: ['08:00 AM (Fasting)', '09:15 AM', '10:30 AM', '11:30 AM'] }
      ],
      sunday: []
    },
    'dental-care': {
      name: 'Dental Care & Oral Surgery',
      hours: 'Mon–Fri: 09:00 – 17:30 | Sat: 09:00 – 13:00 | Sun: Closed',
      weekdays: [
        { label: 'Morning Hygiene & Examinations (09:00 – 12:00)', slots: ['09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM'] },
        { label: 'Afternoon Operatory & Restorative (13:45 – 17:30)', slots: ['01:45 PM', '02:30 PM', '03:15 PM', '04:00 PM', '04:45 PM'] }
      ],
      saturday: [
        { label: 'Saturday Preventative Care (09:00 – 13:00)', slots: ['09:00 AM', '10:00 AM', '11:15 AM', '12:15 PM'] }
      ],
      sunday: []
    },
    'general-consult': {
      name: 'General Clinical Enquiry & Triage',
      hours: 'Mon–Fri: 09:00 – 17:00 | Sat: 09:30 – 12:30 | Sun: Closed',
      weekdays: [
        { label: 'Morning Triage (09:00 – 12:00)', slots: ['09:15 AM', '10:30 AM', '11:45 AM'] },
        { label: 'Afternoon Triage (14:00 – 17:00)', slots: ['02:15 PM', '03:30 PM', '04:30 PM'] }
      ],
      saturday: [
        { label: 'Saturday Morning Intake', slots: ['09:30 AM', '11:00 AM'] }
      ],
      sunday: []
    }
  };

  /**
   * Populates the appointment time slots in the booking form based on the selected specialty,
   * ensuring slots reflect authentic departmental clinic operating hours.
   *
   * @param {string} specialty - Specialty slug (e.g. 'general-medicine', 'dermatology')
   * @param {string} [dateStr] - Selected date in YYYY-MM-DD format (optional)
   */
  function populateAppointmentTimeSlots(specialty, dateStr) {
    const slotSelect = document.querySelector('#appointment-time-slot') || document.querySelector('select[name="time"]');
    const badgeEl = document.querySelector('#operating-hours-badge');
    const dateHelper = document.querySelector('#date-helper');
    if (!slotSelect) return;

    // Normalise specialty key
    let key = (specialty || '').toLowerCase().trim();
    if (key.includes('general') && !key.includes('consult')) key = 'general-medicine';
    else if (key.includes('paediatric') || key.includes('pediatric')) key = 'paediatrics';
    else if (key.includes('derm')) key = 'dermatology';
    else if (key.includes('physio')) key = 'physiotherapy';
    else if (key.includes('diagnos') || key.includes('lab')) key = 'diagnostics';
    else if (key.includes('dent')) key = 'dental-care';
    else if (key.includes('sure') || key.includes('consult') || key.includes('triage')) key = 'general-consult';

    const dept = CLINIC_SCHEDULE[key];

    if (!dept) {
      slotSelect.innerHTML = '<option value="">Please choose a clinical department first</option>';
      slotSelect.disabled = true;
      if (badgeEl) badgeEl.textContent = '';
      if (dateHelper) dateHelper.textContent = '';
      return;
    }

    slotSelect.disabled = false;

    // Determine Day of Week
    let dayOfWeek = null; // 0 = Sun, 1 = Mon ... 6 = Sat
    if (dateStr) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        // Construct local date avoiding timezone shift
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        dayOfWeek = d.getDay();
      }
    }

    let groups = dept.weekdays;
    let dayNote = '';

    if (dayOfWeek === 0) {
      // Sunday
      if (dept.sunday && dept.sunday.length > 0) {
        groups = dept.sunday;
        dayNote = 'Sunday urgent care schedule active.';
      } else {
        groups = dept.weekdays;
        dayNote = `Note: ${dept.name} is closed on Sundays. Showing standard weekday consultation slots — our triage team will confirm your alternate date.`;
      }
    } else if (dayOfWeek === 6) {
      // Saturday
      if (dept.saturday && dept.saturday.length > 0) {
        groups = dept.saturday;
        dayNote = 'Saturday half-day operating schedule active.';
      } else {
        groups = dept.weekdays;
        dayNote = `Note: Limited Saturday service for ${dept.name}. Showing weekday availability.`;
      }
    } else if (dayOfWeek !== null) {
      dayNote = 'Standard weekday clinic schedule active.';
    }

    // Update Date Helper Text
    if (dateHelper) {
      dateHelper.textContent = dayNote;
    }

    // Update Operating Hours Badge
    if (badgeEl) {
      badgeEl.textContent = `Operating Hours: ${dept.hours}`;
    }

    // Build Time Slot Options
    slotSelect.innerHTML = '<option value="">Choose an available appointment slot</option>';

    groups.forEach(group => {
      const optGroup = document.createElement('optgroup');
      optGroup.label = group.label;
      group.slots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        optGroup.appendChild(option);
      });
      slotSelect.appendChild(optGroup);
    });
  }

  // Expose function globally for automated tests and direct access
  window.populateAppointmentTimeSlots = populateAppointmentTimeSlots;

  // --- Initialise Form Handlers ---
  const form = document.querySelector('#appointment-form');
  if (form) {
    const specialtySelect = form.elements.service;
    const dateInput = form.elements.date;
    const slotSelect = form.elements.time;
    const messageInput = form.elements.message;
    const charCount = document.querySelector('.char-count');

    // Restrict date picker to today onwards
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }

    // Character counter
    messageInput?.addEventListener('input', () => {
      if (charCount) charCount.textContent = `${messageInput.value.length} / 400`;
    });

    // Populate slots whenever specialty changes
    specialtySelect?.addEventListener('change', () => {
      populateAppointmentTimeSlots(specialtySelect.value, dateInput?.value);
    });

    // Re-filter slots when appointment date changes
    dateInput?.addEventListener('input', () => {
      if (specialtySelect?.value) {
        populateAppointmentTimeSlots(specialtySelect.value, dateInput.value);
      }
    });

    // Read URL query parameter (e.g. ?service=dermatology)
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam && specialtySelect) {
      for (const option of specialtySelect.options) {
        if (
          option.value.toLowerCase() === serviceParam.toLowerCase() ||
          option.text.toLowerCase().includes(serviceParam.toLowerCase())
        ) {
          option.selected = true;
          break;
        }
      }
    }

    // Trigger initial population
    if (specialtySelect && specialtySelect.value) {
      populateAppointmentTimeSlots(specialtySelect.value, dateInput?.value);
    } else {
      populateAppointmentTimeSlots('', '');
    }

    // Form Submission & Validation
    form.addEventListener('submit', e => {
      e.preventDefault();
      form.querySelectorAll('.field-error').forEach(el => el.textContent = '');

      let firstInvalid = null;
      for (const field of form.querySelectorAll('[required]')) {
        let valid = field.type === 'checkbox' ? field.checked : (field.checkValidity() && field.value.trim() !== '');
        if (!valid) {
          const label = field.closest('label');
          const err = label?.querySelector('.field-error') || (field.name === 'consent' ? form.querySelector('.consent-error') : null);
          if (err) {
            err.textContent = field.type === 'checkbox'
              ? 'Please confirm this is a demo enquiry.'
              : field.validity.typeMismatch
                ? 'Enter a valid email address.'
                : 'Please complete this required field.';
          }
          field.setAttribute('aria-invalid', 'true');
          if (!firstInvalid) firstInvalid = field;
        } else {
          field.removeAttribute('aria-invalid');
        }
      }

      const result = document.querySelector('#form-result');
      if (firstInvalid) {
        firstInvalid.focus();
        if (result) result.hidden = true;
        return;
      }

      const data = new FormData(form);
      const chosenService = data.get('service') || 'General consultation';
      const chosenTime = data.get('time') || 'Selected clinic slot';
      const chosenDate = data.get('date') ? ` on ${data.get('date')}` : '';

      if (result) {
        result.textContent = `Demo enquiry preview confirmed: Requested ${chosenService} for ${data.get('name')} (${chosenTime}${chosenDate}). This is a portfolio simulation by AS Studio — no real medical data was transmitted or saved.`;
        result.hidden = false;
        result.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'nearest'
        });
      }
    });
  }

  // --- FAQs Accordion ---
  document.querySelectorAll('.faq-list details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      const span = detail.querySelector('summary span');
      if (span) span.textContent = detail.open ? '—' : '＋';
    });
  });
})();