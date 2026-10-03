import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PROJECTS } from '../data/projects';
import type { Project } from '../types';

export type LegalDocumentKey = 'privacy' | 'terms' | 'disclaimer';
export type PageSeoKey = 'home' | 'work' | 'services' | 'process' | 'contact';
export interface EditableService { number: string; title: string; description: string; idealFor: string; }
export interface SeoEntry { title: string; description: string; ogTitle: string; ogDescription: string; ogImage: string; noIndex: boolean; }
export interface LegalEntry { title: string; updatedAt: string; html: string; }
export interface SiteContent {
  brand: { eyebrow: string; location: string; headline: string; description: string; reassurance: string; primaryCta: string; secondaryCta: string };
  services: EditableService[];
  projects: Project[];
  sections: {
    work: { eyebrow: string; title: string; description: string };
    services: { eyebrow: string; title: string; description: string };
    process: { eyebrow: string; title: string; description: string };
    testimonials: { eyebrow: string; title: string };
  };
  theme: { work: string; services: string; process: string; contact: string; hero: string; accent: string };
  seo: Record<PageSeoKey, SeoEntry>;
  legal: Record<LegalDocumentKey, LegalEntry>;
}

const legalBase = (title: string, html: string): LegalEntry => ({ title, updatedAt: new Date().toISOString(), html });

export const DEFAULT_SITE_CONTENT: SiteContent = {
  brand: { eyebrow: 'AS Studio · Independent Digital Design Practice', location: 'India & Remote Worldwide', headline: 'Websites that make your business easier to choose.', description: 'AS Studio designs clean, fast and mobile-first websites for local businesses, clinics, cafes, home decor ateliers, and early-stage teams.', reassurance: 'You test on your phone before launch. Full source code delivered. No proprietary lock-in.', primaryCta: 'Start a project', secondaryCta: 'View selected work' },
  services: [
    { number: '01', title: 'Business Websites', description: 'Clear, responsive websites that explain your business and turn visitors into enquiries.', idealFor: 'Local clinics, professional practices, artisan studios & service firms.' },
    { number: '02', title: 'Landing Pages', description: 'Focused pages for a launch, offer, booking campaign or campaign.', idealFor: 'Product launches, marketing campaigns, event venues & direct campaigns.' },
    { number: '03', title: 'Website Redesigns', description: 'Cleaner structure, stronger messaging and a better mobile experience.', idealFor: 'Existing websites that need a sharper digital presence.' },
  ],
  projects: PROJECTS,
  sections: {
    work: { eyebrow: 'Selected Projects', title: 'Work with a point of view.', description: 'Interactive demos and focused interfaces designed around trust, clarity and action.' },
    services: { eyebrow: 'Capabilities', title: 'Built around the moment your customer decides.', description: 'Every service is structured to make your offer clearer and the next action easier.' },
    process: { eyebrow: 'The Studio Method', title: 'A clear path from brief to launch.', description: 'Four focused stages, visible progress and a working preview before anything goes live.' },
    testimonials: { eyebrow: 'Client Outcomes', title: 'Trust is part of the interface.' },
  },
  theme: { work: '#4F46E5', services: '#06B6D4', process: '#10B981', contact: '#F59E0B', hero: '#7C3AED', accent: '#60A5FA' },
  seo: {
    home: { title: 'AS Studio — Websites that make your business easier to choose', description: 'Clean, fast and mobile-first websites for businesses, clinics, cafes and modern founders.', ogTitle: 'AS Studio — Digital design & websites', ogDescription: 'Websites engineered for clarity, credibility and enquiries.', ogImage: '', noIndex: false },
    work: { title: 'Selected Work — AS Studio', description: 'Explore interactive website demos and digital projects by AS Studio.', ogTitle: 'Selected Work — AS Studio', ogDescription: 'Interactive demos and focused digital experiences.', ogImage: '', noIndex: false },
    services: { title: 'Web Design Services — AS Studio', description: 'Business websites, landing pages and website redesigns.', ogTitle: 'Services — AS Studio', ogDescription: 'Digital design and website development services.', ogImage: '', noIndex: false },
    process: { title: 'Our Process — AS Studio', description: 'A clear four-stage process from brief to launch.', ogTitle: 'Process — AS Studio', ogDescription: 'A transparent path from brief to live website.', ogImage: '', noIndex: false },
    contact: { title: 'Start a Project — AS Studio', description: 'Tell AS Studio about your business and website goals.', ogTitle: 'Start a Project — AS Studio', ogDescription: 'Start a focused website project with AS Studio.', ogImage: '', noIndex: false },
  },
  legal: {
    privacy: legalBase('Privacy Policy', '<h3>1. Information we collect</h3><p>We collect information you choose to submit through enquiry forms, client communications and project workflows.</p><h3>2. How we use information</h3><p>Information is used to respond to enquiries, deliver services, communicate about projects and maintain site security.</p><h3>3. Data sharing</h3><p>We do not sell personal information. Limited service providers may process information when necessary to operate the website or deliver a requested service.</p><h3>4. Contact</h3><p>For privacy questions, contact AS Studio through the official contact channels on this website.</p>'),
    terms: legalBase('Terms of Service', '<h3>1. Scope</h3><p>AS Studio provides website design, development and related digital services according to an agreed project scope.</p><h3>2. Client responsibilities</h3><p>Clients are responsible for supplying accurate content, approvals and access needed for delivery.</p><h3>3. Changes</h3><p>Revisions and additional work are handled according to the agreed project scope and communication.</p><h3>4. Delivery</h3><p>Final deliverables are supplied after completion of the agreed work and applicable payment obligations.</p>'),
    disclaimer: legalBase('Disclaimer', '<h3>1. General information</h3><p>Information on this website is provided for general informational purposes and does not constitute legal, financial or professional advice.</p><h3>2. Demonstrations</h3><p>Some portfolio items may be concepts, prototypes or demonstrations. They should not be interpreted as claims about a live client business unless explicitly identified.</p><h3>3. External services</h3><p>Third-party services and external links are subject to their own terms and policies.</p>'),
  },
};

const CONTENT_DOC = doc(db, 'site_content', 'public');
export async function getSiteContent(): Promise<SiteContent> {
  try { const snap = await getDoc(CONTENT_DOC); return snap.exists() ? mergeContent(DEFAULT_SITE_CONTENT, snap.data() as Partial<SiteContent>) : DEFAULT_SITE_CONTENT; }
  catch (error) { console.warn('[SiteContent] Falling back to defaults:', error); return DEFAULT_SITE_CONTENT; }
}
export async function saveSiteContent(content: SiteContent): Promise<void> { await setDoc(CONTENT_DOC, content, { merge: true }); }
export async function saveLegalDocument(key: LegalDocumentKey, document: LegalEntry): Promise<void> { await setDoc(CONTENT_DOC, { legal: { [key]: document } }, { merge: true }); }
function mergeContent(base: SiteContent, incoming: Partial<SiteContent>): SiteContent {
  return {
    ...base, ...incoming,
    brand: { ...base.brand, ...(incoming.brand || {}) },
    services: incoming.services || base.services,
    projects: incoming.projects || base.projects,
    sections: { ...base.sections, ...(incoming.sections || {}), work: { ...base.sections.work, ...(incoming.sections?.work || {}) }, services: { ...base.sections.services, ...(incoming.sections?.services || {}) }, process: { ...base.sections.process, ...(incoming.sections?.process || {}) }, testimonials: { ...base.sections.testimonials, ...(incoming.sections?.testimonials || {}) } },
    theme: { ...base.theme, ...(incoming.theme || {}) },
    seo: { ...base.seo, ...(incoming.seo || {}) },
    legal: { ...base.legal, ...(incoming.legal || {}) },
  };
}
