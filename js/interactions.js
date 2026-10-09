/**
 * AS Studio - Interaction & UI State Engine
 */
export function initInteractions() {
  // 1. Navigation scroll state
  const nav = document.querySelector('.nav');
  function updateNav() {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // 2. Mobile Menu Toggle
  const menuButtons = document.querySelectorAll('button.menu, .menu-toggle');
  const links = document.getElementById('links') || document.querySelector('.links');
  menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (links) {
        const isOpen = links.classList.toggle('mobile-open');
        btn.setAttribute('aria-expanded', String(isOpen));
        btn.textContent = isOpen ? 'Close' : 'Menu';
      }
    });
  });

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

  // 4. Interactive Door CTA (Press / Click to Open)
  const doors = document.querySelectorAll('.door');
  doors.forEach(door => {
    let pressTimer;
    const openDoor = () => {
      door.classList.toggle('open');
      const hint = door.querySelector('.hint');
      if (hint) {
        hint.textContent = door.classList.contains('open') ? 'Door open' : 'Press and hold';
      }
    };

    door.addEventListener('click', openDoor);
    door.addEventListener('mousedown', () => {
      pressTimer = setTimeout(openDoor, 450);
    });
    door.addEventListener('mouseup', () => clearTimeout(pressTimer));
    door.addEventListener('mouseleave', () => clearTimeout(pressTimer));
    door.addEventListener('touchstart', () => {
      pressTimer = setTimeout(openDoor, 400);
    }, { passive: true });
    door.addEventListener('touchend', () => clearTimeout(pressTimer));
  });

  // 5. "Which package fits me?" Interactive Advisor (packages.html)
  const advisorSelector = document.querySelector('#advisorSelect, .advisor-box select');
  const advisorResult = document.querySelector('#advisorResult, .advisor-result');
  if (advisorSelector && advisorResult) {
    advisorSelector.addEventListener('change', (e) => {
      const val = e.target.value;
      const recs = {
        'starter': {
          title: 'Starter Package',
          badge: '1 Page · 3 Days Delivery',
          desc: 'Best for local clinics, cafes, or consultants who need a quiet, fast web presence that establishes credibility immediately without bloated complexity.',
          link: 'contact.html?package=starter'
        },
        'founder': {
          title: 'Starter Package',
          badge: '1 Page · 3 Days Delivery',
          desc: 'Best for local clinics, cafes, or consultants who need a quiet, fast web presence that establishes credibility immediately without bloated complexity.',
          link: 'contact.html?package=starter'
        },
        'growth': {
          title: 'Growth Package',
          badge: '3 Pages · 5 Days Delivery',
          desc: 'Ideal for practices and growing services that need distinct sub-pages (Services, About, Booking inquiry), lead capture, and higher organic visibility.',
          link: 'contact.html?package=growth'
        },
        'practice': {
          title: 'Growth Package',
          badge: '3 Pages · 5 Days Delivery',
          desc: 'Ideal for practices and growing services that need distinct sub-pages (Services, About, Booking inquiry), lead capture, and higher organic visibility.',
          link: 'contact.html?package=growth'
        },
        'signature': {
          title: 'Signature Package',
          badge: '6 Pages · 7 Days Delivery',
          desc: 'Designed for flagship businesses, luxury real estate, and home decor boutiques requiring custom architectural monograph layouts, direct ordering, or appointment triage.',
          link: 'contact.html?package=signature'
        },
        'atelier': {
          title: 'Signature Package',
          badge: '6 Pages · 7 Days Delivery',
          desc: 'Designed for flagship businesses, luxury real estate, and home decor boutiques requiring custom architectural monograph layouts, direct ordering, or appointment triage.',
          link: 'contact.html?package=signature'
        }
      };

      const data = recs[val];
      if (data) {
        advisorResult.innerHTML = `
          <div style="padding: 24px; background: var(--panel); border: 1px solid var(--warm); border-radius: var(--r-sm);">
            <span class="kicker">${data.badge}</span>
            <h3 style="margin: 6px 0 10px; font-size: 22px;">${data.title}</h3>
            <p style="font-size: 14px; margin-bottom: 20px; color: var(--text-secondary);">${data.desc}</p>
            <a class="btn" href="${data.link}">Get started with ${data.title} →</a>
          </div>
        `;
        advisorResult.hidden = false;
        advisorResult.style.display = 'block';
      } else {
        advisorResult.hidden = true;
        advisorResult.style.display = 'none';
      }
    });
  }

  // 6. Secret Backdoor Trigger (5 rapid clicks on logo opens private inbox)
  const logo = document.querySelector('.logo');
  if (logo) {
    let clicks = 0;
    let timer;
    logo.addEventListener('click', (e) => {
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(() => { clicks = 0; }, 2000);
      if (clicks >= 5) {
        clicks = 0;
        e.preventDefault();
        window.location.href = '/x7q2m9r4v8k1p6z3/Index.html';
      }
    });
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractions);
  } else {
    initInteractions();
  }
}
