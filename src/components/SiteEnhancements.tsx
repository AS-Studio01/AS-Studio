import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { getSeoSettings, SeoPageKey } from '../services/siteContent';

const pageForPath = (): SeoPageKey => {
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path.includes('/work')) return 'work';
  if (path.includes('/services')) return 'services';
  if (path.includes('/process')) return 'process';
  if (path.includes('/contact')) return 'contact';
  return 'home';
};

export function SiteEnhancements({ page }: { page?: SeoPageKey }) {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const value = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
        setProgress(value);
        setShowTop(window.scrollY > 560);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('[data-reveal], main section').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [page]);

  useEffect(() => {
    let active = true;
    getSeoSettings(page || pageForPath()).then(seo => {
      if (!active) return;
      document.title = seo.title;
      const setMeta = (name: string, content: string) => {
        let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
        if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
        el.content = content;
      };
      const setProperty = (property: string, content: string) => {
        let el = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
        if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
        el.content = content;
      };
      setMeta('description', seo.description);
      setMeta('twitter:title', seo.ogTitle);
      setMeta('twitter:description', seo.ogDescription);
      if (seo.ogImage) setMeta('twitter:image', seo.ogImage);
      setProperty('og:title', seo.ogTitle);
      setProperty('og:description', seo.ogDescription);
      setProperty('og:image', seo.ogImage);
      let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
      canonical.href = new URL(seo.canonical || window.location.pathname, window.location.origin).href;
      setMeta('robots', seo.noIndex ? 'noindex,nofollow' : 'index,follow');
    });
    return () => { active = false; };
  }, [page]);

  return <>
    <div className="site-reading-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
    {showTop && <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ArrowUp className="w-4 h-4" /></button>}
  </>;
}
