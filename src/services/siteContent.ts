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
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  noIndex: boolean;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  searchIntent?: string;
}

export interface LegalEntry {
  title: string;
  updatedAt: string;
  html: string;
}

export interface SiteContent {
  brand: {
    name?: string;
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

const legalBase = (title: string, html: string, updatedAt: string = '2026-10-02T00:00:00.000Z'): LegalEntry => ({
  title,
  updatedAt,
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

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [];

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
      twitterTitle: 'AS Studio — Clean Business Websites & Redesigns',
      twitterDescription: 'Bespoke websites that make your business easier to choose. Mobile-first engineering, 100% source code ownership, and live phone staging.',
      twitterImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      canonical: 'https://as-studio-delta.vercel.app/',
      noIndex: false,
      primaryKeyword: 'bespoke business websites',
      secondaryKeywords: ['mobile-first web design', 'website redesign studio', 'clinic website design', 'independent digital design practice'],
      searchIntent: 'commercial_discovery',
    },
    work: {
      title: 'Selected Work & Interactive Demos — AS Studio',
      description: 'Explore interactive website demos, showroom lookbooks, and medical triage concepts engineered by AS Studio.',
      ogTitle: 'Selected Work & Live Prototypes — AS Studio',
      ogDescription: 'Tactile showrooms, clinic websites, and hospitality landing pages with zero-PDF menus.',
      ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      twitterTitle: 'Selected Work & Interactive Demos — AS Studio',
      twitterDescription: 'Interactive prototypes for healthcare clinics, furniture lookbooks, and zero-PDF cafe menus.',
      twitterImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      canonical: 'https://as-studio-delta.vercel.app/work',
      noIndex: false,
      primaryKeyword: 'web design portfolio and live prototypes',
      secondaryKeywords: ['clinic appointment triage prototype', 'tactile furniture lookbook', 'zero-pdf cafe menu website', 'case studies'],
      searchIntent: 'portfolio_credibility',
    },
    services: {
      title: 'Web Design & Development Capabilities — AS Studio',
      description: 'Bespoke business websites, high-converting landing pages, and modernization redesigns with 30-day post-launch warranty.',
      ogTitle: 'Web Services & Sprints — AS Studio',
      ogDescription: 'Turnaround in 7–14 business days with 100% full source code ownership.',
      ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      twitterTitle: 'Web Design Services & Sprints — AS Studio',
      twitterDescription: 'Turnaround in 5–14 days. 100% source code ownership and live smartphone staging.',
      twitterImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      canonical: 'https://as-studio-delta.vercel.app/services',
      noIndex: false,
      primaryKeyword: 'web design services for local businesses',
      secondaryKeywords: ['business website development', 'high-converting landing pages', 'website redesign sprint', '100% code ownership'],
      searchIntent: 'service_investigation',
    },
    process: {
      title: 'Our Methodology & 6-Phase Sprint — AS Studio',
      description: 'From Discovery and Strategy to Live Phone Staging and Launch. A clear, transparent path to a working website.',
      ogTitle: 'The Studio Methodology — AS Studio',
      ogDescription: 'How AS Studio builds fast, bespoke business websites in 7–14 days.',
      ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      twitterTitle: 'The Studio Methodology & Sprint — AS Studio',
      twitterDescription: '6 transparent phases from brief to launch with live smartphone staging and 30-day warranty.',
      twitterImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      canonical: 'https://as-studio-delta.vercel.app/process',
      noIndex: false,
      primaryKeyword: 'website design process and sprint timeline',
      secondaryKeywords: ['6-phase website sprint', 'live phone staging preview', 'source code handover process', 'rapid web design methodology'],
      searchIntent: 'methodology_evaluation',
    },
    contact: {
      title: 'Start a Project & Inquiries — AS Studio',
      description: 'Connect directly with AS Studio founders via Telegram or Gmail. Discuss your target budget and timeline.',
      ogTitle: 'Start a Project — AS Studio',
      ogDescription: 'Direct founder inquiries with negotiable, flexible pricing for local businesses.',
      ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      twitterTitle: 'Start a Project with AS Studio',
      twitterDescription: 'Direct founder inquiries via Telegram & Gmail with flexible, negotiable pricing for independent practices.',
      twitterImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      canonical: 'https://as-studio-delta.vercel.app/contact',
      noIndex: false,
      primaryKeyword: 'hire independent web design studio',
      secondaryKeywords: ['start website project', 'negotiable web design pricing', 'clinic website inquiry', 'telegram web design consultation'],
      searchIntent: 'direct_conversion',
    },
  },
  legal: {
    privacy: legalBase(
      'Privacy Policy',
      `<p class="text-xs text-[#A1A1AA] mb-4 font-mono"><strong>Last updated:</strong> 02 October 2026</p>
<p>AS Studio (&quot;AS Studio&quot;, &quot;we&quot;, &quot;us&quot; or &quot;our&quot;) respects your privacy. This Privacy Policy explains how we collect, use and protect information when you visit asstudio.in, submit an enquiry, place a project request or contact us through email or another listed contact method.</p>

<h3>1. Information We Collect</h3>
<p>We collect only information that you choose to provide, including:</p>
<ul class="list-disc pl-5 space-y-1.5 my-2">
  <li>Your name</li>
  <li>Business or organisation name</li>
  <li>Email address</li>
  <li>Phone number or WhatsApp number</li>
  <li>Website or social-media link</li>
  <li>Project requirements, budget range, timeline and design preferences</li>
  <li>Files, images or other materials you voluntarily send for a project enquiry</li>
</ul>
<p class="mt-2">Please do not send passwords, payment-card details, government-ID numbers, banking information, private account credentials or other highly sensitive personal information through our website form or email.</p>

<h3>2. How We Use Information</h3>
<p>We use your information only to:</p>
<ul class="list-disc pl-5 space-y-1.5 my-2">
  <li>Respond to your enquiry</li>
  <li>Understand your project requirements</li>
  <li>Prepare a proposal, estimate or invoice when requested</li>
  <li>Communicate about a possible or active project</li>
  <li>Deliver agreed services</li>
  <li>Improve AS Studio's website, workflow and services</li>
  <li>Prevent spam, fraud, security incidents or misuse</li>
</ul>
<p class="mt-2">Submitting an enquiry does not create a client relationship or guarantee that AS Studio will accept a project.</p>

<h3>3. No Sale of Personal Information</h3>
<p>AS Studio does not sell, rent or trade your personal information.</p>
<p>We do not use enquiry information for unrelated advertising. We do not share your information except where reasonably necessary to operate our website, respond to you, provide agreed services, comply with law, protect our rights and security, or use trusted service providers described below.</p>

<h3>4. Service Providers and Third-Party Platforms</h3>
<p>We may use trusted third-party platforms for website hosting, forms, email, cloud storage, analytics, invoicing or project delivery. These providers may process limited information on our behalf according to their own terms and privacy policies. We use them only where reasonably necessary for AS Studio's operations.</p>

<h3>5. AI-Assisted Tools</h3>
<p>AS Studio may use AI-assisted tools for internal tasks such as research, brainstorming, drafting, coding, design exploration, quality checks or preparing project materials.</p>
<p>AI-assisted tools support our workflow but do not replace human review. We aim to minimise personal information used in AI-assisted workflows and do not intentionally submit sensitive information, passwords, payment details or private credentials to such tools. Final project decisions and deliverables are reviewed by a person.</p>

<h3>6. Data Retention</h3>
<p>If a project does not begin, we generally keep enquiry information for up to 12 months for follow-up, record-keeping and service improvement, unless you ask us to delete it earlier or law requires us to keep it longer.</p>
<p>For active clients, we retain relevant information for as long as reasonably required to deliver the project, provide agreed support, maintain records, resolve disputes or comply with legal and tax obligations.</p>

<h3>7. Security</h3>
<p>We take reasonable steps to protect information from unauthorised access, loss, misuse or disclosure. However, no online system, email service or form can be completely secure.</p>

<h3>8. Your Choices</h3>
<p>You may request access to, correction of or deletion of the personal information you have provided to AS Studio. To make a request, contact us at <a href="mailto:asbusinessofficial01@gmail.com" class="text-[#3B82F6] underline">asbusinessofficial01@gmail.com</a>.</p>

<h3>9. Governing Law</h3>
<p>This Privacy Policy is governed by the laws of India. Any disputes arising in connection with this Privacy Policy shall be subject to the exclusive jurisdiction of the courts in India.</p>

<h3>10. Legal Claim Window</h3>
<p>Any claim or dispute arising from your use of this website or interaction with AS Studio must be raised within 30 days of the event giving rise to the claim. Claims raised after this period will not be entertained.</p>

<h3>11. Changes to This Policy</h3>
<p>We may update this Privacy Policy from time to time. The current version will be posted on this page with a revised &quot;Last updated&quot; date.</p>

<h3>12. Contact</h3>
<p><strong>AS Studio</strong><br />Email: <a href="mailto:asbusinessofficial01@gmail.com" class="text-[#3B82F6] underline">asbusinessofficial01@gmail.com</a><br />Location: India</p>`
    ),
    terms: legalBase(
      'Terms of Service',
      `<p class="text-xs text-[#A1A1AA] mb-4 font-mono"><strong>Last updated:</strong> 02 October 2026</p>
<p>Welcome to AS Studio. These Terms of Service govern your access to and use of asstudio.in, including any enquiry forms, project-request forms, portfolio pages and related content.</p>
<p>By using this website, you agree to these Terms of Service. If you do not agree, please do not use the website.</p>

<h3>1. About AS Studio</h3>
<p>AS Studio is an independent creative design studio providing website design, landing-page design, website redesign and related digital services. AS Studio is not a registered company, law firm, financial institution or any regulated entity. All services are provided on a freelance and independent studio basis.</p>
<p>This website is intended to provide general information about AS Studio and allow visitors to make enquiries about services.</p>

<h3>2. Website Information and Enquiries</h3>
<p>Information on this website is provided for general information only. An enquiry, contact-form submission, email, estimate request or discussion does not create a client relationship, confirm availability, guarantee delivery or create a legally binding agreement.</p>
<p>A paid project begins only when AS Studio and the client agree in writing on the project scope, deliverables, timeline, price, payment terms, revision limits and other applicable conditions.</p>

<h3>3. Pricing, Quotes and Project Scope</h3>
<p>Any prices, timelines, packages or examples displayed on the website are guidance only unless clearly stated otherwise.</p>
<p>Final pricing, scope, payment milestones, revisions, delivery timelines, ownership rights and support terms will be stated in a separate written proposal, invoice, agreement or approved project brief.</p>
<p>Work requested outside the agreed scope may require a separate quotation, approval and timeline.</p>

<h3>4. Concept Work and Portfolio Disclaimer</h3>
<p>Some portfolio items on this website are labelled &quot;Independent Concept&quot;, &quot;Demo Project&quot; or &quot;Concept Project&quot;.</p>
<p>These projects — including but not limited to Nova Dental Care and Mitti Café — are original design exercises created independently by AS Studio for portfolio and demonstration purposes only. They were not commissioned by, affiliated with or endorsed by the named businesses or brands. Any brand names referenced belong to their respective owners and are used solely for non-commercial and demonstrative purposes. These concepts do not represent the actual online presence, services or identity of any real business.</p>
<p>A concept project does not mean that any named business hired, approved, endorsed or partnered with AS Studio in any way.</p>

<h3>5. AI-Assisted Work Disclosure</h3>
<p>AS Studio may use AI-assisted tools as part of its design and development workflow. This may include AI-assisted code generation, visual asset generation and copy drafting.</p>
<p>All final deliverables produced for clients are reviewed, edited and refined by a human before delivery. AS Studio does not deliver raw, unreviewed AI output as finished work. Every project receives human creative direction, judgment and craft before delivery.</p>
<p>The use of AI tools in creative work is standard industry practice and does not diminish the quality, originality or ownership of work delivered.</p>

<h3>6. Intellectual Property</h3>
<p>All design work, visual concepts, written copy and code produced by AS Studio remain the intellectual property of AS Studio until full payment is received. Upon full payment, ownership transfers to the client as agreed in the project terms.</p>
<p>Concept projects shown on this website that were not commissioned remain the sole intellectual property of AS Studio.</p>
<p>All content on this website — including text, layout, design and written copy — may not be reproduced, copied or used for commercial purposes without written permission from AS Studio.</p>

<h3>7. Spam and Fraudulent Use</h3>
<p>You agree not to use this website or our contact form to:</p>
<ul class="list-disc pl-5 space-y-1.5 my-2">
  <li>Submit false, misleading or fraudulent information</li>
  <li>Impersonate another person or business</li>
  <li>Send unsolicited commercial messages or spam</li>
  <li>Attempt to access, disrupt or damage any part of this website</li>
</ul>
<p class="mt-2">AS Studio reserves the right to ignore, block and report any enquiries that appear fraudulent, abusive or made in bad faith.</p>

<h3>8. Limitation of Liability</h3>
<p>To the fullest extent permitted by applicable law:</p>
<ul class="list-disc pl-5 space-y-1.5 my-2">
  <li>AS Studio shall not be liable for any direct, indirect, incidental, consequential or special damages arising from your use of this website or our services</li>
  <li>AS Studio shall not be liable for any loss of business, revenue, data or profits</li>
  <li>AS Studio's total liability to any party shall not exceed the amount paid by that party to AS Studio for the specific service in question</li>
</ul>

<h3>9. No Guarantee of Results</h3>
<p>AS Studio does not guarantee specific business results, leads, conversions, revenue, traffic or search-engine rankings from any service provided. Results depend on many factors outside AS Studio's control.</p>

<h3>10. External Links</h3>
<p>This website may contain links to third-party websites or platforms. AS Studio is not responsible for the content, policies or practices of any third-party platform. Accessing external links is at your own risk.</p>

<h3>11. Governing Law</h3>
<p>These Terms of Service are governed by the laws of India. Any disputes arising from these Terms or your use of this website shall be subject to the exclusive jurisdiction of the courts in India. AS Studio is not obligated to travel to, appear in or engage with legal proceedings initiated outside of India.</p>

<h3>12. Legal Claim Window</h3>
<p>Any claim or dispute arising from your use of this website or engagement with AS Studio must be raised within 30 days of the event giving rise to the claim. Claims raised after this period will not be entertained.</p>

<h3>13. Changes to These Terms</h3>
<p>AS Studio reserves the right to update these Terms of Service at any time. The &quot;Last updated&quot; date reflects the most recent revision. Continued use of the website after changes are posted constitutes your acceptance of the revised Terms.</p>

<h3>14. Contact</h3>
<p><strong>AS Studio</strong><br />Email: <a href="mailto:asbusinessofficial01@gmail.com" class="text-[#3B82F6] underline">asbusinessofficial01@gmail.com</a><br />Location: India</p>`
    ),
    disclaimer: legalBase(
      'Disclaimer & Demonstrations',
      `<p class="text-xs text-[#A1A1AA] mb-4 font-mono"><strong>Last updated:</strong> 02 October 2026</p>
<p>The information provided on asstudio.in by AS Studio (&quot;AS Studio&quot;, &quot;we&quot;, &quot;us&quot; or &quot;our&quot;) is for general information about our services, approach and portfolio.</p>

<h3>1. General Information Only</h3>
<p>Content on this website is provided for general informational purposes only. It is not legal, financial, tax, business, marketing, investment or professional advice.</p>
<p>Before making a business, legal, financial or tax decision, you should seek advice from a qualified professional relevant to your situation.</p>

<h3>2. Portfolio, Demo and Concept Work</h3>
<p>Some work shown on this website is labelled as &quot;Independent Project&quot;, &quot;Independent Concept&quot; or &quot;Concept Work&quot;.</p>
<p>These projects — including but not limited to Nova Dental Care and Mitti Café — are original design exercises created independently by AS Studio for portfolio and demonstration purposes only. They were not commissioned by, affiliated with or endorsed by the named businesses or brands. Any brand names referenced belong to their respective owners and are used solely for non-commercial, demonstrative and portfolio purposes. These concepts do not claim to represent the actual online presence, services or identity of any real business.</p>
<p>If any business or brand believes their name or identity has been used inappropriately, they may contact AS Studio at <a href="mailto:asbusinessofficial01@gmail.com" class="text-[#3B82F6] underline">asbusinessofficial01@gmail.com</a> and we will review the matter promptly and in good faith.</p>

<h3>3. AI-Assisted Workflow</h3>
<p>AS Studio may use AI-assisted tools for research, planning, content drafting, coding, design exploration, quality checks and internal workflow support.</p>
<p>Some elements of this website and portfolio work — including but not limited to certain visual assets, code components, copy drafts and placeholder imagery — may have been generated or assisted by artificial intelligence tools.</p>
<p>All such content has been reviewed, edited and refined by a human before being used or published. AS Studio does not publish raw, unreviewed AI output. Human creative judgment, direction and craft are applied to every element before it reaches its final form.</p>
<p>The presence of AI-assisted elements does not:</p>
<ul class="list-disc pl-5 space-y-1.5 my-2">
  <li>Invalidate the originality or quality of the work</li>
  <li>Constitute misrepresentation or fraud</li>
  <li>Transfer any liability to the tools or platforms used</li>
</ul>
<p class="mt-2">Use of AI tools in creative and development work is widely accepted industry practice. AS Studio discloses this openly in the interest of full transparency.</p>
<p>Clients remain responsible for reviewing and approving all final content, information, claims, brand materials, legal wording, pricing, product details, images and other materials before publication.</p>

<h3>4. No Guarantee of Results</h3>
<p>AS Studio aims to create clear, functional and high-quality websites and digital experiences. However, we do not guarantee specific results, including:</p>
<ul class="list-disc pl-5 space-y-1.5 my-2">
  <li>Leads, enquiries, bookings or sales</li>
  <li>Search-engine rankings or traffic</li>
  <li>Conversion rates</li>
  <li>Revenue or business growth</li>
  <li>Approval by a third party, platform or authority</li>
  <li>Compatibility with every device, browser or future software update</li>
</ul>
<p class="mt-2">Business results depend on many factors outside AS Studio's control, including the client's services, pricing, reputation, audience, marketing, competition and market conditions.</p>

<h3>5. External Links and Third-Party Services</h3>
<p>This website may contain links to third-party websites or platforms. These links are provided for convenience only. AS Studio does not control, guarantee, endorse or take responsibility for the content, availability, security, terms or privacy practices of any third-party website or service.</p>

<h3>6. Website Availability</h3>
<p>We make reasonable efforts to keep the AS Studio website accurate, secure and available. However, we do not guarantee that the website will always be uninterrupted, error-free or free from technical issues. AS Studio may update, change or remove website content or features without notice.</p>

<h3>7. Governing Law</h3>
<p>This Disclaimer is governed by the laws of India. Any disputes arising in connection with this Disclaimer shall be subject to the exclusive jurisdiction of the courts in India.</p>

<h3>8. Legal Claim Window</h3>
<p>Any claim or dispute arising from your use of this website must be raised within 30 days of the event giving rise to the claim. Claims raised after this period will not be entertained.</p>

<h3>9. Contact</h3>
<p><strong>AS Studio</strong><br />Email: <a href="mailto:asbusinessofficial01@gmail.com" class="text-[#3B82F6] underline">asbusinessofficial01@gmail.com</a><br />Location: India</p>`
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
    try {
      localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY, JSON.stringify(content));
    } catch (e) {
      console.warn('[SiteContent] LocalStorage cache write error:', e);
    }
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
    testimonials: Array.isArray(incoming.testimonials) ? incoming.testimonials : base.testimonials,
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
