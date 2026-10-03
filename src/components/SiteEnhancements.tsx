import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { PageType } from '../types';

interface SiteEnhancementsProps {
  currentPage?: PageType;
}

export function SiteEnhancements({ currentPage }: SiteEnhancementsProps) {
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
    // Determine active page key from prop or location pathname
    let key: PageType = currentPage || 'home';
    if (!currentPage && typeof window !== 'undefined') {
      const pathKey = window.location.pathname.replace(/^\//, '').split('/')[0] as PageType;
      if (pathKey && ['home', 'work', 'services', 'process', 'contact'].includes(pathKey)) {
        key = pathKey;
      }
    }

    const seo = content.seo[key] || content.seo.home;
    const prodDomain = 'https://as-studio-delta.vercel.app';
    const pageUrl = key === 'home' ? `${prodDomain}/` : `${prodDomain}/${key}`;

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
      setMeta('og:url', seo.canonical || pageUrl, true);
      if (seo.ogImage) setMeta('og:image', seo.ogImage, true);
      setMeta('robots', seo.noIndex ? 'noindex,nofollow' : 'index,follow');

      // Twitter Cards
      setMeta('twitter:title', seo.twitterTitle || seo.ogTitle || seo.title);
      setMeta('twitter:description', seo.twitterDescription || seo.ogDescription || seo.description);
      setMeta('twitter:url', seo.canonical || pageUrl);
      if (seo.twitterImage || seo.ogImage) {
        setMeta('twitter:image', seo.twitterImage || seo.ogImage);
      }

      // Canonical link tag
      const canonicalHref = seo.canonical || pageUrl;
      let canonicalEl = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.href = canonicalHref;

      // Dynamic JSON-LD structured data for the active route (BreadcrumbList + WebPage)
      const pageNames: Record<PageType, string> = {
        home: 'Home',
        work: 'Selected Work & Prototypes',
        services: 'Capabilities & Scope',
        process: 'Methodology & Sprint',
        contact: 'Start a Project & Inquiries',
      };

      const breadcrumbItems = [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${prodDomain}/`,
        },
      ];

      if (key !== 'home') {
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: 2,
          name: pageNames[key] || key,
          item: pageUrl,
        });
      }

      const dynamicSchema = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            '@id': `${pageUrl}#webpage`,
            url: pageUrl,
            name: seo.title,
            description: seo.description,
            isPartOf: {
              '@type': 'WebSite',
              '@id': `${prodDomain}/#website`,
              name: 'AS Studio',
              url: `${prodDomain}/`,
            },
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${pageUrl}#breadcrumb`,
            itemListElement: breadcrumbItems,
          },
        ],
      };

      let schemaScript = document.head.querySelector('#dynamic-seo-schema') as HTMLScriptElement | null;
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'dynamic-seo-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.text = JSON.stringify(dynamicSchema);
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
  }, [content, currentPage]);

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
