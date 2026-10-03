import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type SeoPageKey = 'home' | 'work' | 'services' | 'process' | 'contact';

export interface SeoSettings {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonical: string;
  noIndex: boolean;
}

export const DEFAULT_SEO: Record<SeoPageKey, SeoSettings> = {
  home: {
    title: 'AS Studio — Premium Websites for Growing Businesses',
    description: 'AS Studio designs fast, premium, mobile-first websites that help businesses earn trust and convert visitors.',
    ogTitle: 'AS Studio — Premium Websites for Growing Businesses',
    ogDescription: 'Premium web design and development by AS Studio.',
    ogImage: '',
    canonical: '/',
    noIndex: false,
  },
  work: {
    title: 'Selected Work — AS Studio',
    description: 'Explore selected websites and digital experiences crafted by AS Studio.',
    ogTitle: 'Selected Work — AS Studio',
    ogDescription: 'Selected web design and development projects.',
    ogImage: '',
    canonical: '/work',
    noIndex: false,
  },
  services: {
    title: 'Web Design Services — AS Studio',
    description: 'Strategy, UI design and production frontend development for modern businesses.',
    ogTitle: 'Web Design Services — AS Studio',
    ogDescription: 'Design and development services for ambitious businesses.',
    ogImage: '',
    canonical: '/services',
    noIndex: false,
  },
  process: {
    title: 'Our Process — AS Studio',
    description: 'A focused, milestone-based process for launching a polished business website.',
    ogTitle: 'Our Process — AS Studio',
    ogDescription: 'See how AS Studio takes a website from brief to launch.',
    ogImage: '',
    canonical: '/process',
    noIndex: false,
  },
  contact: {
    title: 'Start a Project — AS Studio',
    description: 'Tell AS Studio about your business, goals and website project.',
    ogTitle: 'Start a Project — AS Studio',
    ogDescription: 'Start a website project with AS Studio.',
    ogImage: '',
    canonical: '/contact',
    noIndex: false,
  },
};

export interface LegalDocument {
  id: 'privacy' | 'terms' | 'disclaimer';
  title: string;
  contentHtml: string;
  updatedAt: string;
}

export const DEFAULT_LEGAL: Record<LegalDocument['id'], LegalDocument> = {
  privacy: {
    id: 'privacy', title: 'Privacy Policy', updatedAt: '2026',
    contentHtml: `<p><strong>Last updated:</strong> 2026. AS Studio respects your privacy and is committed to protecting your personal information.</p><h3>1. Information We Collect</h3><p>We only collect information voluntarily provided by you through our project brief forms, direct Telegram communication, or email correspondence (such as your name, business name, and email or Telegram handle).</p><h3>2. How Information is Used</h3><p>Your details are strictly used to evaluate project requirements, prepare custom scope proposals, and coordinate design and engineering deliverables. We never sell, rent, or trade your data to third-party advertisers.</p><h3>3. Zero Invasive Tracking</h3><p>AS Studio uses zero advertising networks, tracking pixels, or invasive behavioral profiling. We prioritize clean, minimal web telemetry solely for essential app functionality.</p><h3>4. Contact & Inquiries</h3><p>For any questions regarding data handling, contact us at <strong>asbusinessofficial01@gmail.com</strong>.</p>`,
  },
  terms: {
    id: 'terms', title: 'Terms & Conditions', updatedAt: '2026',
    contentHtml: `<p><strong>Last updated:</strong> 2026. Terms governing design, development, and consultation by AS Studio.</p><h3>1. Scope of Engagement</h3><p>AS Studio delivers bespoke digital design, mobile-first responsive architecture, and production frontend code. Every sprint begins with an agreed-upon milestone schedule and pricing breakdown.</p><h3>2. 100% Code Ownership</h3><p>Upon project completion and final payment, 100% of clean source code, design assets, and repository rights are transferred to the client with zero mandatory monthly builder lock-ins or licensing fees.</p><h3>3. Staging & Client Verification</h3><p>Clients receive live smartphone staging previews to test performance and usability on their real hardware prior to production release and final payment.</p><h3>4. 30-Day Post-Launch Warranty</h3><p>We provide a 30-day post-launch warranty covering complimentary bug fixes, cross-browser adjustments, and minor copy updates.</p>`,
  },
  disclaimer: {
    id: 'disclaimer', title: 'Disclaimer & Practice Disclosure', updatedAt: '2026',
    contentHtml: `<p><strong>Last updated:</strong> 2026. Official Practice Disclosure and Legal Disclaimer for AS Studio.</p><h3>1. Exploratory Case Studies & Concepts</h3><p>Select featured prototypes labeled &quot;Independent Concept&quot; in our portfolio (including <em>Atelier Forma</em>, <em>Nova Dental Studio</em>, and <em>Mitti Café & Roastery</em>) are self-initiated architectural and UX case studies. They are designed to demonstrate design excellence, material lookbooks, and conversion triage, and do not imply official brand affiliation or endorsement.</p><h3>2. Scope & Pricing Estimates</h3><p>All pricing figures and sprint timelines published on this site or discussed with our AI assistant represent typical ranges and starting points. Every project is individually scoped with flexible, negotiable pricing tailored to the client&apos;s specific budget.</p><h3>3. Direct Channels Only (WhatsApp Disabled)</h3><p>AS Studio operates exclusively through official direct channels: Telegram (<strong>@AS_Studio_official01</strong>) and Gmail (<strong>asbusinessofficial01@gmail.com</strong>). WhatsApp is currently disabled. We never conduct cold calls or send unsolicited marketing messages.</p><h3>4. Intellectual Property</h3><p>All custom design systems, interactive prototypes, and code created by AS Studio are protected. Upon contractual delivery and completion, complete ownership of client deliverables transfers in full to the client.</p>`,
  },
};


export interface SiteContent {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  primaryCta: string;
  secondaryCta: string;
  reassurance: string;
  studioLabel: string;
  studioLocation: string;
  sectionLabels: { work: string; services: string; process: string; contact: string };
  theme: {
    work: string;
    services: string;
    process: string;
    contact: string;
    accent: string;
  };
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroEyebrow: 'Independent digital design practice',
  heroTitle: 'Websites that make your business easier to choose.',
  heroDescription: 'AS Studio designs clean, fast and mobile-first websites for local businesses, clinics, cafes, home decor ateliers, and early-stage teams.',
  primaryCta: 'Start a project',
  secondaryCta: 'View selected work',
  reassurance: 'You test on your phone before launch. Zero proprietary lock-in. Full source code delivered.',
  studioLabel: 'AS Studio',
  studioLocation: 'India & Remote Worldwide',
  sectionLabels: { work: 'Proof of craft', services: 'What we build', process: 'How we work', contact: 'Start something' },
  theme: { work: '#3B82F6', services: '#8B5CF6', process: '#10B981', contact: '#F59E0B', accent: '#3B82F6' },
};

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const snap = await getDoc(doc(db, 'site_settings', 'site_content'));
    const data = snap.exists() ? snap.data() : {};
    return { ...DEFAULT_SITE_CONTENT, ...data, sectionLabels: { ...DEFAULT_SITE_CONTENT.sectionLabels, ...(data.sectionLabels || {}) }, theme: { ...DEFAULT_SITE_CONTENT.theme, ...(data.theme || {}) } };
  } catch { return DEFAULT_SITE_CONTENT; }
}

export async function saveSiteContent(value: SiteContent) {
  await setDoc(doc(db, 'site_settings', 'site_content'), value, { merge: true });
}

export interface ClientProject {
  id: string;
  clientUid: string;
  clientEmail?: string;
  businessName: string;
  title: string;
  phase: string;
  status: 'planning' | 'design' | 'development' | 'review' | 'launched';
  progress: number;
  summary: string;
  nextMilestone: string;
  updatedAt: string;
}

export async function getSeoSettings(page: SeoPageKey): Promise<SeoSettings> {
  try {
    const snap = await getDoc(doc(db, 'site_settings', `seo_${page}`));
    return snap.exists() ? { ...DEFAULT_SEO[page], ...snap.data() } as SeoSettings : DEFAULT_SEO[page];
  } catch { return DEFAULT_SEO[page]; }
}

export async function saveSeoSettings(page: SeoPageKey, value: SeoSettings) {
  await setDoc(doc(db, 'site_settings', `seo_${page}`), value, { merge: true });
}

export async function getLegalDocument(id: LegalDocument['id']): Promise<LegalDocument> {
  try {
    const snap = await getDoc(doc(db, 'legal_documents', id));
    return snap.exists() ? { ...DEFAULT_LEGAL[id], ...snap.data(), id } as LegalDocument : DEFAULT_LEGAL[id];
  } catch { return DEFAULT_LEGAL[id]; }
}

export async function saveLegalDocument(docData: LegalDocument) {
  await setDoc(doc(db, 'legal_documents', docData.id), { ...docData, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function getClientProjects(clientUid: string): Promise<ClientProject[]> {
  try {
    const snap = await getDocs(query(collection(db, 'client_projects'), where('clientUid', '==', clientUid)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClientProject))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch { return []; }
}

export async function getAllClientProjects(): Promise<ClientProject[]> {
  const snap = await getDocs(collection(db, 'client_projects'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClientProject));
}

export async function saveClientProject(project: ClientProject) {
  await setDoc(doc(db, 'client_projects', project.id), { ...project, updatedAt: new Date().toISOString() }, { merge: true });
}
