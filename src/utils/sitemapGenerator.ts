/**
 * SITEMAP.XML GENERATOR
 * ==============================================================================
 * Dynamically constructs valid XML sitemaps containing all core pages,
 * services, and showcase project routes based on current application configuration.
 * ==============================================================================
 */

import { PROJECTS } from '../data/projects';

export interface SitemapRoute {
  path: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  lastmod?: string;
}

export function getSitemapRoutes(): SitemapRoute[] {
  const today = new Date().toISOString().split('T')[0];

  const coreRoutes: SitemapRoute[] = [
    { path: '', changefreq: 'weekly', priority: 1.0, lastmod: today },
    { path: 'work', changefreq: 'weekly', priority: 0.9, lastmod: today },
    { path: 'services', changefreq: 'monthly', priority: 0.9, lastmod: today },
    { path: 'process', changefreq: 'monthly', priority: 0.8, lastmod: today },
    { path: 'contact', changefreq: 'weekly', priority: 0.9, lastmod: today },
  ];

  // Dynamic project routes
  const projectRoutes: SitemapRoute[] = PROJECTS.map((proj) => ({
    path: `work/${proj.id}`,
    changefreq: 'monthly',
    priority: 0.85,
    lastmod: today,
  }));

  return [...coreRoutes, ...projectRoutes];
}

/**
 * Generate standard-compliant XML string for sitemap.xml
 */
export function generateSitemapXml(baseUrl: string): string {
  const sanitizedBase = baseUrl.replace(/\/+$/, '');
  const routes = getSitemapRoutes();

  const xmlEntries = routes
    .map((route) => {
      const url = route.path ? `${sanitizedBase}/${route.path}` : sanitizedBase;
      return `  <url>
    <loc>${url}</loc>
    <lastmod>${route.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(2)}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
}
