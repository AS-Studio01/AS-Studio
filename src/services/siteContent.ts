import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PROJECTS } from '../data/projects';
import type { Project, ServiceItem, ProcessStep, TestimonialItem, ClientProject } from '../types';

export type LegalDocumentKey = 'privacy' | 'terms' | 'disclaimer';
export type PageSeoKey = 'home' | 'work' | 'services' | 'process' | 'contact';

export interface SeoEntry {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonical?: string;
  noIndex: boolean;
}

export interface LegalEntry {
  title: string;
  updatedAt: string;
  html: string;
}

export interface SiteContent {
  brand: {
    studioLabel: string;
    eyebrow: string;
    location: string;
    headline: string;
    description: string;
    reassurance: string;
    primaryCta: string;
    secondaryCta: string;
  };
  services: ServiceItem[];
  projects: Project[];
  processSteps: ProcessStep[];
  testimonials: TestimonialItem[];
  sections: {
    work: { eyebrow: string; title: string; description: string };
    services: { eyebrow: string; title: string; description: string };
    process: { eyebrow: string; title: string; description: string };
    testimonials: { eyebrow: string; title: string; description?: string };
    contact: { eyebrow: string; title: string; description: string; reassurance: string };
  };
  theme: {
    accent: string;
    hero: string;
    work: string;
    services: string;
    process: string;
    testimonials: string;
    contact: string;
    bg: string;
    surface: string;
  };
  seo: Record<PageSeoKey, SeoEntry>;
  legal: Record<LegalDocumentKey, LegalEntry>;
}

const legalBase = (title: string, html: string): LegalEntry => ({
  title,
  updatedAt: new Date().toISOString(),
  html,
});

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'srv-business-sites',
    number: '01',
    title: 'Business Websites',
    description: 'Clear, high-speed websites that explain your business, build immediate trust, and turn mobile visitors into paying enquiries.',
    idealFor: 'Local clinics, medical practices, artisan ateliers, and boutique service firms.',
    icon: 'layout',
    accentColor: '#06B6D4',
    features: [
      '100% bespoke responsive layout (zero templates)',
      'Sub-second first contentful paint (< 0.8s)',
      'Direct Telegram & email inquiry dispatch',
      'Phone staging preview prior to handover',
      'Full GitHub repository & source code ownership',
    ],
    ctaText: 'Commission a Website',
    enabled: true,
    order: 1,
  },
  {
    id: 'srv-landing-pages',
    number: '02',
    title: 'High-Converting Landing Pages',
    description: 'Focused single-page campaigns built around the moment your customer decides—engineered specifically to convert paid ads and social traffic.',
    idealFor: 'Product launches, marketing campaigns, seasonal offers, and clinic treatments.',
    icon: 'zap',
    accentColor: '#3B82F6',
    features: [
      'Single-action conversion funnel architecture',
      'Hero product/service spotlight with interactive previews',
      'Zero-PDF mobile menus & tactile catalogues',
      '5–7 business days turnaround sprint',
      'Lightweight Google Analytics & meta tracking ready',
    ],
    ctaText: 'Launch a Landing Page',
    enabled: true,
    order: 2,
  },
  {
    id: 'srv-redesigns',
    number: '03',
    title: 'Website Modernization & Redesigns',
    description: 'Structural overhaul of slow, cluttered WordPress, Wix, or legacy websites into modern, mobile-first web experiences.',
    idealFor: 'Established businesses suffering high bounce rates or broken mobile navigation.',
    icon: 'sparkles',
    accentColor: '#10B981',
    features: [
      'Complete typography, spacing & visual hierarchy revamp',
      'Elimination of slow bloated plugins & builder dependencies',
      'SEO redirection preservation (zero link-rot)',
      '30-day post-launch warranty with zero maintenance fees',
      'Flexible, negotiable pricing adaptively scaled to your scope',
    ],
    ctaText: 'Modernize Your Website',
    enabled: true,
    order: 3,
  },
];

export const DEFAULT_PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'proc-discovery',
    step: '01',
    title: 'Discovery & Brief',
    description: 'We unpack your business goals, target audience, and the exact friction preventing customers from booking.',
    details: 'A focused, 30-minute consultation where we analyze your competitors, define priority user actions, and establish deliverables.',
    duration: 'Day 1–2',
    deliverables: ['Project Scope Document', 'Site Architecture Outline', 'Technical Stack Plan'],
    enabled: true,
    order: 1,
  },
  {
    id: 'proc-strategy',
    step: '02',
    title: 'Strategic Direction',
    description: 'We structure the narrative, typographic hierarchy, and conversion pathways before writing production code.',
    details: 'Drafting high-clarity copy and layout wireframes so your key value propositions are impossible to miss.',
    duration: 'Day 3–4',
    deliverables: ['Information Architecture', 'Content Copywriting', 'Visual Direction Canvas'],
    enabled: true,
    order: 2,
  },
  {
    id: 'proc-design',
    step: '03',
    title: 'Bespoke UI Design',
    description: 'Crafting responsive, tactile layouts with modern typography, subtle glassmorphism, and accessible contrast.',
    details: 'Tailoring section-specific colour palettes and interactive component states with meticulous attention to mobile viewports.',
    duration: 'Day 5–7',
    deliverables: ['Interactive Component System', 'Mobile Viewport Mappings', 'Brand Palette Guide'],
    enabled: true,
    order: 3,
  },
  {
    id: 'proc-dev',
    step: '04',
    title: 'Clean Engineering',
    description: 'Building blazing-fast, semantic React & TypeScript code with zero proprietary builder lock-in.',
    details: 'Performance optimization, sub-second asset bundling, Firestore integration, and cross-browser accessibility checks.',
    duration: 'Day 8–10',
    deliverables: ['Production React Codebase', 'Lighthouse 95+ Scores', 'Automated Email Dispatch'],
    enabled: true,
    order: 4,
  },
  {
    id: 'proc-staging',
    step: '05',
    title: 'Live Phone Staging',
    description: 'You test the actual production website directly on your personal smartphone before making final payment.',
    details: 'Private staging URL deployment where you and your team test typography, buttons, and responsiveness in real-world lighting.',
    duration: 'Day 11–12',
    deliverables: ['Private Staging URL', 'Cross-Device QA Report', 'Feedback Iteration Pass'],
    enabled: true,
    order: 5,
  },
  {
    id: 'proc-launch',
    step: '06',
    title: 'Launch & 30-Day Warranty',
    description: 'Domain connection, 100% source-code handover, and 30 days of complimentary technical warranty.',
    details: 'Full GitHub repository rights or production zip, search engine sitemap submission, and 30 days of free adjustments.',
    duration: 'Day 13–14',
    deliverables: ['Full Source Code Ownership', 'Domain SSL Deployment', '30-Day Technical Warranty'],
    enabled: true,
    order: 6,
  },
];

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-dr-rahul',
    clientName: 'Dr. Rahul Jaiswal',
    businessName: 'Apex Dental Care & Implantology',
    role: 'Lead Prosthodontist & Clinic Director',
    quote: 'Before AS Studio rebuilt our web presence, patients found our old site confusing and slow on mobile. The new design has completely transformed how first-time patients perceive our clinic—they walk in already reassured by our doctors and services.',
    rating: 5,
    outcome: '+42% increase in mobile consultation bookings in the first 60 days',
    serviceType: 'Business Website & Healthcare Triage',
    verified: true,
    enabled: true,
    date: '2026-06-18',
    order: 1,
  },
  {
    id: 'test-ananya-roy',
    clientName: 'Ananya Roy',
    businessName: 'Mitti Artisan Café & Roastery',
    role: 'Founder & Head Roaster',
    quote: 'Our previous website forced customers to download a 12MB PDF just to see lunch specials! AS Studio built an instant, zero-PDF mobile menu and live table reservations. Customers love how smooth it is, and our weekend tables are fully booked through the site.',
    rating: 5,
    outcome: 'Eliminated PDF downloads entirely; 3.8x faster page loads',
    serviceType: 'Hospitality Landing Page & Reservation Flow',
    verified: true,
    enabled: true,
    date: '2026-07-24',
    order: 2,
  },
  {
    id: 'test-vikram-mehta',
    clientName: 'Vikram Mehta',
    businessName: 'Aura Living Furniture Atelier',
    role: 'Creative Director',
    quote: 'The team understood our tactile materials immediately. The interactive room lookbook and material swatch inspector allow architects to browse our natural travertine and oak collections with extraordinary clarity. The 100% code ownership gave us complete independence.',
    rating: 5,
    outcome: '100% clean code delivered with zero recurring platform fees',
    serviceType: 'Tactile Showroom & Digital Lookbook',
    verified: true,
    enabled: true,
    date: '2026-08-30',
    order: 3,
  },
];

export const DEFAULT_SITE_CONTENT: SiteContent = {
  brand: {
    studioLabel: 'AS Studio',
    eyebrow: 'Independent Creative Web Practice · India & Remote Worldwide',
    location: 'India & Remote Worldwide',
    headline: 'Websites that make your business easier to choose.',
    description: 'AS Studio designs clean, fast, and mobile-first websites for local businesses, clinics, cafes, home decor ateliers, and early-stage founders.',
    reassurance: 'You test on your phone before launch. 100% source code delivered. Flexible negotiable pricing.',
    primaryCta: 'Start a project',
    secondaryCta: 'View selected work',
  },
  services: DEFAULT_SERVICES,
  projects: PROJECTS,
  processSteps: DEFAULT_PROCESS_STEPS,
  testimonials: DEFAULT_TESTIMONIALS,
  sections: {
    work: {
      eyebrow: 'Selected Work & Prototypes',
      title: 'Work engineered around trust and clarity.',
      description: 'Interactive showroom prototypes, clinic appointment triage, and zero-PDF hospitality experiences designed for conversion.',
    },
    services: {
      eyebrow: 'Capabilities & Scope',
      title: 'Built around the moment your customer decides.',
      description: 'Every service is engineered to make your offer clearer, your credibility undeniable, and the next step effortless.',
    },
    process: {
      eyebrow: 'The Studio Methodology',
      title: 'A transparent path from brief to launch.',
      description: 'Six connected phases with live phone staging and zero mystery pricing.',
    },
    testimonials: {
      eyebrow: 'Verified Client Outcomes',
      title: 'Real results from independent practices.',
      description: 'Read how local clinics, cafes, and creative founders elevated their digital footprint with AS Studio.',
    },
    contact: {
      eyebrow: 'Direct Inquiries',
      title: 'Let’s discuss your website sprint.',
      description: 'Tell us about your business, desired timeline, or target budget. We reply within 24 hours with a clear roadmap.',
      reassurance: 'Pricing is 100% flexible and negotiable for independent budgets. WhatsApp disabled; Telegram & Gmail active.',
    },
  },
  theme: {
    accent: '#60A5FA',
    hero: '#7C3AED',
    work: '#4F46E5',
    services: '#06B6D4',
    process: '#10B981',
    testimonials: '#EC4899',
    contact: '#F59E0B',
    bg: '#07070A',
    surface: '#121217',
  },
  seo: {
    home: {
      title: 'AS Studio — Clean Business Websites & Redesigns',
      description: 'AS Studio designs clean, fast, and mobile-first websites and landing pages for local clinics, cafes, home decor ateliers, and early-stage founders with 100% source code ownership.',
      ogTitle: 'AS Studio — Clean Business Websites & Digital Experiences',
      ogDescription: 'Websites that make your business easier to choose. Mobile-first engineering, live phone staging, and flexible negotiable pricing.',
      ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      canonical: 'https://asstudio.in',
      noIndex: false,
    },
    work: {
      title: 'Selected Work & Interactive Demos — AS Studio',
      description: 'Explore interactive website demos, showroom lookbooks, and medical triage concepts engineered by AS Studio.',
      ogTitle: 'Selected Work & Live Prototypes — AS Studio',
      ogDescription: 'Tactile showrooms, clinic websites, and hospitality landing pages with zero-PDF menus.',
      ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      canonical: 'https://asstudio.in/work',
      noIndex: false,
    },
    services: {
      title: 'Web Design & Development Capabilities — AS Studio',
      description: 'Bespoke business websites, high-converting landing pages, and modernization redesigns with 30-day post-launch warranty.',
      ogTitle: 'Web Services & Sprints — AS Studio',
      ogDescription: 'Turnaround in 7–14 business days with 100% full source code ownership.',
      ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      canonical: 'https://asstudio.in/services',
      noIndex: false,
    },
    process: {
      title: 'Our Methodology & 6-Phase Sprint — AS Studio',
      description: 'From Discovery and Strategy to Live Phone Staging and Launch. A clear, transparent path to a working website.',
      ogTitle: 'The Studio Methodology — AS Studio',
      ogDescription: 'How AS Studio builds fast, bespoke business websites in 7–14 days.',
      ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      canonical: 'https://asstudio.in/process',
      noIndex: false,
    },
    contact: {
      title: 'Start a Project & Inquiries — AS Studio',
      description: 'Connect directly with AS Studio founders via Telegram or Gmail. Discuss your target budget and timeline.',
      ogTitle: 'Start a Project — AS Studio',
      ogDescription: 'Direct founder inquiries with negotiable, flexible pricing for local businesses.',
      ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      canonical: 'https://asstudio.in/contact',
      noIndex: false,
    },
  },
  legal: {
    privacy: legalBase(
      'Privacy Policy',
      `<h3>1. Information We Collect</h3>
<p>AS Studio collects information you explicitly choose to submit through our project inquiry forms, client portal workflows, and direct communications. This may include your full name, business or practice name, contact channel (email address or Telegram handle), and project requirements summary.</p>

<h3>2. How We Use Submitted Information</h3>
<p>Your information is used strictly to evaluate your project brief, provide custom scope estimates, deliver contracted web design services, and provide 30-day post-launch technical warranty support. We never sell, lease, or monetize your contact details.</p>

<h3>3. Client Code & Data Ownership</h3>
<p>Upon final delivery and balance clearance, all client deliverables—including production HTML, CSS, React components, and assets created specifically for your sprint—are transferred to you with 100% full intellectual property rights. AS Studio retains no proprietary software lock-in.</p>

<h3>4. Direct Contact & Privacy Rights</h3>
<p>For any questions regarding your data or to request permanent erasure of your inquiry records from our Cloud Firestore database, contact us directly at <strong>asbusinessofficial01@gmail.com</strong>.</p>`
    ),
    terms: legalBase(
      'Terms of Service',
      `<h3>1. Engagement Scope</h3>
<p>AS Studio provides bespoke web design, frontend development, and digital consulting services based upon agreed project scopes. All turnaround times (typically 5–7 business days for landing pages, 10–14 days for business websites) commence once initial content briefs and access assets are received.</p>

<h3>2. Live Phone Staging Guarantee</h3>
<p>Before public domain launch or final payment transfer, AS Studio deploys your website to a private staging environment. You are invited to test responsiveness, speed, and interactions directly on your personal smartphone to verify that deliverables match agreed standards.</p>

<h3>3. Flexible & Negotiable Pricing</h3>
<p>AS Studio works with independent practices, local clinics, cafes, and early-stage ventures. Project pricing is structured transparently and is negotiable according to scope boundaries without hidden recurring platform fees.</p>

<h3>4. 30-Day Post-Launch Warranty</h3>
<p>Every completed sprint includes thirty (30) consecutive calendar days of complimentary technical warranty covering bug fixes, responsive adjustments, and minor text updates.</p>`
    ),
    disclaimer: legalBase(
      'Disclaimer & Demonstrations',
      `<h3>1. Informational & Independent Notice</h3>
<p>The materials, articles, and estimates on this website are provided for general informational purposes. They do not constitute formal legal, taxation, or medical compliance advice.</p>

<h3>2. Concept Demonstrations</h3>
<p>Certain items within our portfolio archive are independent design explorations and functional prototypes developed by AS Studio to demonstrate UI patterns for home decor ateliers, healthcare triage, and restaurant reservations. Demos clearly indicate their exploratory nature.</p>

<h3>3. Third-Party Integrations</h3>
<p>Third-party platforms (including Google Cloud, Firebase, Gmail REST API, Telegram, and Vercel) operate under their respective terms and service level agreements.</p>`
    ),
  },
};

const CONTENT_DOC = doc(db, 'site_content', 'public');
const LOCAL_STORAGE_CONTENT_KEY = 'as_studio_site_content_cache';

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const snap = await getDoc(CONTENT_DOC);
    if (snap.exists()) {
      const merged = mergeContent(DEFAULT_SITE_CONTENT, snap.data() as Partial<SiteContent>);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY, JSON.stringify(merged));
      }
      return merged;
    }
  } catch (error) {
    console.warn('[SiteContent] Firestore read failed, checking local cache:', error);
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY);
      if (cached) return mergeContent(DEFAULT_SITE_CONTENT, JSON.parse(cached));
    } catch {}
  }

  return DEFAULT_SITE_CONTENT;
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY, JSON.stringify(content));
  }
  await setDoc(CONTENT_DOC, content, { merge: true });
}

export async function saveLegalDocument(key: LegalDocumentKey, document: LegalEntry): Promise<void> {
  await setDoc(CONTENT_DOC, { legal: { [key]: document } }, { merge: true });
}

function mergeContent(base: SiteContent, incoming: Partial<SiteContent>): SiteContent {
  return {
    ...base,
    ...incoming,
    brand: { ...base.brand, ...(incoming.brand || {}) },
    services: incoming.services && incoming.services.length > 0 ? incoming.services : base.services,
    projects: incoming.projects && incoming.projects.length > 0 ? incoming.projects : base.projects,
    processSteps: incoming.processSteps && incoming.processSteps.length > 0 ? incoming.processSteps : base.processSteps,
    testimonials: incoming.testimonials && incoming.testimonials.length > 0 ? incoming.testimonials : base.testimonials,
    sections: {
      ...base.sections,
      ...(incoming.sections || {}),
      work: { ...base.sections.work, ...(incoming.sections?.work || {}) },
      services: { ...base.sections.services, ...(incoming.sections?.services || {}) },
      process: { ...base.sections.process, ...(incoming.sections?.process || {}) },
      testimonials: { ...base.sections.testimonials, ...(incoming.sections?.testimonials || {}) },
      contact: { ...base.sections.contact, ...(incoming.sections?.contact || {}) },
    },
    theme: { ...base.theme, ...(incoming.theme || {}) },
    seo: { ...base.seo, ...(incoming.seo || {}) },
    legal: { ...base.legal, ...(incoming.legal || {}) },
  };
}

// ==========================================
// CLIENT PROJECTS (DELIVERY TRACKING) CRUD
// ==========================================

const CLIENT_PROJECTS_COLLECTION = 'client_projects';
const LOCAL_CLIENT_PROJECTS_KEY = 'as_studio_client_projects_cache';

export const SAMPLE_CLIENT_PROJECTS: ClientProject[] = [
  {
    id: 'proj_apex_dental',
    clientUid: 'sample_apex_user',
    clientEmail: 'sahina724462s@gmail.com',
    clientName: 'Dr. Rahul Jaiswal',
    businessName: 'Apex Dental Care',
    title: 'Modern Clinic Website & Triage',
    projectType: 'Business Website Sprint',
    status: 'review',
    progress: 85,
    currentSprint: 'Sprint 3: Mobile Staging & Booking Triage',
    nextMilestone: 'Client Phone Staging Approval',
    deadline: '2026-10-14',
    recentUpdate: 'Completed doctor credential profiles and verified Google Maps integration. Private staging URL generated.',
    timeline: '12 Days (Sprint duration)',
    deliverables: [
      'Interactive patient triage & consultation flow',
      'Clinician credential showcase with dental photography',
      'Integrated emergency hotline & Google Maps directions',
      'Mobile-first responsive layout (tested across 6 viewports)',
    ],
    notes: 'Client requested accent color match their physical clinic interior (medical cyan / indigo). Staging passed QA.',
    liveStagingUrl: 'https://ais-dev-opmbjuat3g3hvwd6drebsn-803900555444.asia-east1.run.app/#work',
    createdAt: '2026-09-20T10:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj_aura_atelier',
    clientUid: 'sample_aura_user',
    clientEmail: 'asbusinessofficial01@gmail.com',
    clientName: 'Vikram Mehta',
    businessName: 'Aura Living Atelier',
    title: 'Tactile Furniture Showroom & Catalogue',
    projectType: 'Digital Showroom Sprint',
    status: 'completed',
    progress: 100,
    currentSprint: 'Post-Launch Warranty Phase',
    nextMilestone: 'Complimentary 30-Day Check-in',
    deadline: '2026-09-28',
    recentUpdate: 'Successfully handed over full GitHub repository. 100% code ownership acknowledged by client.',
    timeline: '10 Days (Delivered early)',
    deliverables: [
      'Room-by-room interactive lookbook with smooth filter transitions',
      'Tactile material & fabric swatch inspector',
      'Direct Telegram bespoke size estimation dispatch',
      'Full GitHub repository handover & production zip',
    ],
    notes: 'Warranty active until October 28, 2026. Zero maintenance fees.',
    liveStagingUrl: 'https://ais-dev-opmbjuat3g3hvwd6drebsn-803900555444.asia-east1.run.app/#work',
    createdAt: '2026-09-10T12:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
];

export async function getClientProjects(userEmail?: string, userUid?: string): Promise<ClientProject[]> {
  try {
    const colRef = collection(db, CLIENT_PROJECTS_COLLECTION);
    const snap = await getDocs(colRef);
    const list: ClientProject[] = [];
    snap.forEach((d) => {
      const data = d.data() as ClientProject;
      list.push({ ...data, id: d.id });
    });

    if (list.length > 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_CLIENT_PROJECTS_KEY, JSON.stringify(list));
      }
      if (userEmail || userUid) {
        return list.filter(
          (p) =>
            (userEmail && p.clientEmail?.toLowerCase() === userEmail.toLowerCase()) ||
            (userUid && p.clientUid === userUid)
        );
      }
      return list;
    }
  } catch (err) {
    console.warn('[ClientProjects] Remote fetch failed, falling back to cache:', err);
  }

  // Fallback to cache or sample records
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_CLIENT_PROJECTS_KEY);
      if (cached) {
        const list: ClientProject[] = JSON.parse(cached);
        if (userEmail || userUid) {
          return list.filter(
            (p) =>
              (userEmail && p.clientEmail?.toLowerCase() === userEmail.toLowerCase()) ||
              (userUid && p.clientUid === userUid)
          );
        }
        return list;
      }
    } catch {}
  }

  if (userEmail || userUid) {
    return SAMPLE_CLIENT_PROJECTS.filter(
      (p) =>
        (userEmail && p.clientEmail?.toLowerCase() === userEmail.toLowerCase()) ||
        (userUid && p.clientUid === userUid)
    );
  }
  return SAMPLE_CLIENT_PROJECTS;
}

export async function saveClientProject(project: ClientProject): Promise<void> {
  const docRef = doc(db, CLIENT_PROJECTS_COLLECTION, project.id);
  await setDoc(docRef, project, { merge: true });

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_CLIENT_PROJECTS_KEY);
      let list: ClientProject[] = cached ? JSON.parse(cached) : SAMPLE_CLIENT_PROJECTS;
      const index = list.findIndex((p) => p.id === project.id);
      if (index >= 0) {
        list[index] = project;
      } else {
        list.unshift(project);
      }
      localStorage.setItem(LOCAL_CLIENT_PROJECTS_KEY, JSON.stringify(list));
    } catch {}
  }
}

export async function deleteClientProject(id: string): Promise<void> {
  try {
    const docRef = doc(db, CLIENT_PROJECTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('[ClientProjects] Remote delete failed:', err);
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_CLIENT_PROJECTS_KEY);
      if (cached) {
        const list: ClientProject[] = JSON.parse(cached);
        const filtered = list.filter((p) => p.id !== id);
        localStorage.setItem(LOCAL_CLIENT_PROJECTS_KEY, JSON.stringify(filtered));
      }
    } catch {}
  }
}
