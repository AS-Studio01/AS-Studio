import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export function SiteEnhancements() {
  const { content } = useSiteContent();
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
      setShowTop(window.scrollY > 360);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Determine active page key from pathname or hash
    const pathKey = location.pathname.replace(/^\//, '').split('/')[0];
    const key = (pathKey || 'home') as keyof typeof content.seo;
    const seo = content.seo[key] || content.seo.home;

    if (seo) {
      document.title = seo.title;

      const setMeta = (name: string, value: string, property = false) => {
        const attr = property ? 'property' : 'name';
        let el = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute(attr, name);
          document.head.appendChild(el);
        }
        el.content = value;
      };

      setMeta('description', seo.description);
      setMeta('og:title', seo.ogTitle || seo.title, true);
      setMeta('og:description', seo.ogDescription || seo.description, true);
      if (seo.ogImage) setMeta('og:image', seo.ogImage, true);
      setMeta('robots', seo.noIndex ? 'noindex,nofollow' : 'index,follow');

      // Canonical link
      if (seo.canonical) {
        let canonicalEl = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
        if (!canonicalEl) {
          canonicalEl = document.createElement('link');
          canonicalEl.setAttribute('rel', 'canonical');
          document.head.appendChild(canonicalEl);
        }
        canonicalEl.href = seo.canonical;
      }
    }

    // Dynamic root CSS variables from Theme CMS
    const root = document.documentElement;
    if (content.theme) {
      if (content.theme.accent) root.style.setProperty('--accent', content.theme.accent);
      if (content.theme.hero) root.style.setProperty('--hero-accent', content.theme.hero);
      if (content.theme.work) root.style.setProperty('--work-accent', content.theme.work);
      if (content.theme.services) root.style.setProperty('--services-accent', content.theme.services);
      if (content.theme.process) root.style.setProperty('--process-accent', content.theme.process);
      if (content.theme.testimonials) root.style.setProperty('--testimonials-accent', content.theme.testimonials);
      if (content.theme.contact) root.style.setProperty('--contact-accent', content.theme.contact);
      if (content.theme.bg) root.style.setProperty('--bg', content.theme.bg);
      if (content.theme.surface) root.style.setProperty('--surface', content.theme.surface);
    }
  }, [content]);

  return (
    <>
      {/* Dynamic Slim Reading Progress Bar */}
      <div
        className="site-progress"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${content.theme?.accent || '#60A5FA'}, ${content.theme?.hero || '#7C3AED'})`,
        }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />

      {/* Floating Pill Back to Top Button */}
      {showTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll back to top of page"
          title="Back to top"
        >
          <ArrowUp className="w-4 h-4 text-white" />
        </button>
      )}
    </>
  );
}
