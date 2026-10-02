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
    id: 'privacy',
    title: 'Privacy Policy',
    updatedAt: '2026',
    contentHtml: `<p><strong>Last updated:</strong> 2026. AS Studio respects your privacy and is committed to protecting your personal information.</p><h3>1. Information We Collect</h3><p>We collect information you voluntarily provide through project briefs, direct communication, and email correspondence.</p><h3>2. How Information is Used</h3><p>Your details are used to evaluate requirements, prepare proposals, and coordinate project delivery.</p><h3>3. Contact</h3><p>For privacy questions, contact asbusinessofficial01@gmail.com.</p>`,
  },
  terms: {
    id: 'terms',
    title: 'Terms & Conditions',
    updatedAt: '2026',
    contentHtml: `<p><strong>Last updated:</strong> 2026.</p><h3>1. Scope of Engagement</h3><p>AS Studio delivers bespoke digital design, responsive architecture, and production frontend code.</p><h3>2. Ownership</h3><p>Upon project completion and final payment, agreed source code and design assets are transferred to the client.</p><h3>3. Client Verification</h3><p>Clients receive opportunities to review staging work before launch.</p>`,
  },
  disclaimer: {
    id: 'disclaimer',
    title: 'Disclaimer & Practice Disclosure',
    updatedAt: '2026',
    contentHtml: `<p><strong>Last updated:</strong> 2026.</p><h3>General Information</h3><p>Project timelines, outcomes and estimates depend on scope, feedback cycles, third-party services and client-provided materials.</p><h3>No Guarantee of Business Results</h3><p>AS Studio builds digital experiences but cannot guarantee specific traffic, rankings, revenue or conversion outcomes.</p>`,
  },
};

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
