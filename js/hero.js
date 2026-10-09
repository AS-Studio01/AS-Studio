/**
 * AS Studio - Hero Visual & Video Scrub Engine
 */
export function initHeroScrub() {
  const video = document.querySelector('.hero-video');
  const heroSection = document.querySelector('.section-hero');

  if (!video || !heroSection) return;

  // Ensure video metadata is loaded
  let isVideoReady = false;
  video.addEventListener('loadedmetadata', () => {
    isVideoReady = true;
  });

  // Smooth scroll scrub when within hero viewport
  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = heroSection.getBoundingClientRect();
        const heroHeight = rect.height;
        const scrolled = Math.max(0, -rect.top);

        if (scrolled <= heroHeight && isVideoReady && video.duration) {
          const progress = Math.min(1, scrolled / heroHeight);
          // Gently scrub video current time based on scroll progress
          video.currentTime = progress * (video.duration * 0.85);
        }

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Subtle ambient mouse parallax on hero content
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && window.matchMedia('(pointer: fine)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const xOffset = (clientX / window.innerWidth - 0.5) * 12;
      const yOffset = (clientY / window.innerHeight - 0.5) * 12;
      heroContent.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroContent.style.transform = 'translate3d(0, 0, 0)';
    });
  }
}

// Auto-run if element exists on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroScrub);
} else {
  initHeroScrub();
}
