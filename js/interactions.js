/**
 * AS Studio - Interaction & UI State Engine
 */

export function initInteractions() {
  // 1. Navigation scroll state & progress bar
  const nav = document.querySelector('.nav');
  const progressBar = document.querySelector('.scroll-progress');

  function updateScrollState() {
    const scrollY = window.scrollY;
    if (nav) {
      nav.classList.toggle('scrolled', scrollY > 20);
    }
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progressPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      progressBar.style.width = `${progressPercent}%`;
    }
  }

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  // 2. Mobile Navigation Toggle
  const menuBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.textContent = isOpen ? '✕' : '☰';
    });
  }

  // 3. Scroll Reveal Observer
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('on'));
  }

  // 4. Interactive FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close sibling items for clean single-open behavior
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('open')) {
          other.classList.remove('open');
          const otherContent = other.querySelector('.faq-content');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        content.style.maxHeight = null;
      } else {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // 5. Work Filter Tabs (Functional client-side filtering on work.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('[data-package]');
  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') || 'all';
        
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        projectCards.forEach(card => {
          const pkg = card.getAttribute('data-package');
          if (filter === 'all' || pkg === filter) {
            card.style.display = '';
            setTimeout(() => card.classList.add('on'), 20);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 6. "Which package fits me?" interactive advisor (packages.html)
  const advisorSelector = document.querySelector('#advisorSelect');
  const advisorResult = document.querySelector('#advisorResult');
  if (advisorSelector && advisorResult) {
    advisorSelector.addEventListener('change', (e) => {
      const val = e.target.value;
      const recs = {
        'founder': {
          title: 'Launchpad Landing Page',
          desc: 'Fast 5–7 day high-conversion single page designed to validate your offer, collect waitlist leads, or pitch investors without bloated timelines.',
          link: '/contact.html?package=launchpad'
        },
        'practice': {
          title: 'Core Business Website',
          desc: '7–12 day multi-page presence for clinics, legal practices, and local consultancies requiring doctor credibility, Google Maps, and direct triage.',
          link: '/contact.html?package=core'
        },
        'atelier': {
          title: 'Bespoke Flagship Experience',
          desc: '10–14 day custom architectural lookbook or luxury monograph with tactile materials, bespoke micro-interactions, and private inquiry.',
          link: '/contact.html?package=flagship'
        }
      };

      const data = recs[val];
      if (data) {
        advisorResult.innerHTML = `
          <div style="padding: 24px; background: var(--panel); border: 1px solid var(--warm); border-radius: var(--r-sm); margin-top: 16px;">
            <span class="eyebrow">Recommended Package</span>
            <h4 style="margin: 6px 0 10px; font-size: 20px;">${data.title}</h4>
            <p style="font-size: 14px; margin-bottom: 18px;">${data.desc}</p>
            <a class="btn warm sm" href="${data.link}">Select this package →</a>
          </div>
        `;
        advisorResult.hidden = false;
      } else {
        advisorResult.hidden = true;
      }
    });
  }

  // 7. Legal Notice Dismissal
  const legalBar = document.querySelector('#legalBar');
  const legalDismiss = document.querySelector('#legalDismiss');
  if (legalBar) {
    if (localStorage.getItem('asstudio_legal_ack') === '1') {
      legalBar.classList.add('hidden');
    }
    if (legalDismiss) {
      legalDismiss.addEventListener('click', () => {
        localStorage.setItem('asstudio_legal_ack', '1');
        legalBar.classList.add('hidden');
      });
    }
  }

  // 8. Secret Backdoor Trigger (5 rapid clicks on logo opens private index)
  const secretTrigger = document.querySelector('.secret-trigger');
  if (secretTrigger) {
    let clicks = 0;
    let clickTimer;
    secretTrigger.addEventListener('click', (e) => {
      clicks++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { clicks = 0; }, 1800);
      if (clicks >= 5) {
        clicks = 0;
        e.preventDefault();
        window.location.href = '/x7q2m9r4v8k1p6z3/Index.html';
      }
    });
  }
}

// Auto-run if element exists on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInteractions);
} else {
  initInteractions();
}
