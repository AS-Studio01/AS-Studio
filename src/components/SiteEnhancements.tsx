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
      setShowTop(window.scrollY > 560);
    };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const key = location.pathname.replace('/', '') || 'home';
    const seo = content.seo[key as keyof typeof content.seo] || content.seo.home;
    document.title = seo.title;
    const root = document.documentElement;
    root.style.setProperty('--accent', content.theme.accent);
    root.style.setProperty('--hero-accent', content.theme.hero);
    root.style.setProperty('--work-accent', content.theme.work);
    root.style.setProperty('--services-accent', content.theme.services);
    root.style.setProperty('--process-accent', content.theme.process);
    root.style.setProperty('--contact-accent', content.theme.contact);
    const setMeta = (name: string, value: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let el = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.content = value;
    };
    setMeta('description', seo.description);
    setMeta('og:title', seo.ogTitle, true); setMeta('og:description', seo.ogDescription, true);
    if (seo.ogImage) setMeta('og:image', seo.ogImage, true);
    setMeta('robots', seo.noIndex ? 'noindex,nofollow' : 'index,follow');
  }, [content]);
  return <>
    <div className="site-progress" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${content.theme.accent}, ${content.theme.hero})` }} />
    {showTop && <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ArrowUp className="w-4 h-4" /></button>}
  </>;
}
