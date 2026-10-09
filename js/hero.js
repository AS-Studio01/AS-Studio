/**
 * AS Studio - Cinematic Hero & Video Scrub Engine
 */
export function initHero() {
  const hero = document.getElementById('hero') || document.querySelector('.hero');
  const video = document.getElementById('heroVideo') || document.querySelector('.hero-video');
  const ring = document.querySelector('.ring circle');
  const bands = document.querySelectorAll('.hero .band');

  if (!hero) return;

  // Ensure video source is linked if not present
  if (video && !video.getAttribute('src') && !video.querySelector('source')) {
    video.src = '/assets/video/hero-scrub.mp4';
    video.load();
  }

  // Band visibility controller based on scroll
  function updateHeroScroll() {
    const rect = hero.getBoundingClientRect();
    const heroHeight = rect.height;
    const windowH = window.innerHeight;
    const scrollDist = -rect.top;
    const maxScroll = Math.max(1, heroHeight - windowH);
    const progress = Math.min(1, Math.max(0, scrollDist / maxScroll));

    // Update ring progress offset
    if (ring) {
      const perimeter = 126;
      const offset = perimeter * (1 - progress);
      ring.style.setProperty('--ld', String(offset));
    }

    // Video scrub
    if (video && video.duration && !isNaN(video.duration)) {
      try {
        video.currentTime = progress * video.duration;
      } catch (e) {
        // Video scrub safety
      }
    }

    // Multi-band fade/slide transitions
    if (bands.length > 1) {
      bands.forEach(band => {
        const a = parseFloat(band.getAttribute('data-a') || '0');
        const b = parseFloat(band.getAttribute('data-b') || '1');
        const isFirst = band.hasAttribute('data-first');
        const isLast = band.hasAttribute('data-last');

        let opacity = 0;
        let translateY = 20;

        if (progress >= a && progress <= b) {
          // Peak visible range
          opacity = 1;
          translateY = 0;
        } else if (progress < a && isFirst) {
          opacity = 1;
          translateY = 0;
        } else if (progress > b && isLast) {
          opacity = 1;
          translateY = 0;
        }

        band.style.opacity = String(opacity);
        band.style.transform = `translateY(${translateY}px)`;
        band.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      });
    }
  }

  window.addEventListener('scroll', updateHeroScroll, { passive: true });
  updateHeroScroll();

  // Try subtle autoplay if video can loop softly in background
  if (video) {
    video.play().catch(() => {
      // Autoplay with audio policy allowed since muted
    });
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero);
  } else {
    initHero();
  }
}
