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
    id: 'srv-website-design',
    number: '01',
    title: 'Website Design',
    description: 'Custom visual design tailored to your brand identity, business positioning, and target client expectations.',
    idealFor: 'Businesses launching a new online presence or seeking an authoritative, non-template visual identity.',
    problemSolved: 'Eliminates generic template aesthetics and establishes an immediate impression of commercial credibility.',
    whatItIncludes: [
      'Visual direction & art direction discovery',
      'High-contrast typographic hierarchy and palette selection',
      'Desktop, tablet, and mobile wireframes and high-fidelity layouts',
      'Conversion-focused section sequencing and content hierarchy',
      'Interactive design assets and component specifications',
    ],
    features: [
      'Visual direction & art direction discovery',
      'High-contrast typographic hierarchy and palette selection',
      'Responsive layouts across mobile, tablet, and desktop',
      'Conversion-focused section sequencing',
      'Bespoke component specifications',
    ],
    icon: 'layout',
    accentColor: '#3B82F6',
    ctaText: 'Start a Project',
    enabled: true,
    order: 1,
  },
  {
    id: 'srv-website-development',
    number: '02',
    title: 'Website Development',
    description: 'Clean, responsive, and maintainable engineering built with modern web standards and zero builder lock-in.',
    idealFor: 'Companies requiring fast, stable, and easily maintained web applications with full source code ownership.',
    problemSolved: 'Replaces slow, fragile WordPress plugins and proprietary builders with fast, dependable code.',
    whatItIncludes: [
      'Modern React & TypeScript engineering',
      'Responsive, mobile-first layouts tested on real devices',
      'Performance-minded asset loading and responsive implementation',
      'Contact forms with automated email dispatch and database storage',
      'Complete GitHub repository handover with full rights',
    ],
    features: [
      'Semantic React & TypeScript development',
      'Mobile-first responsive architecture',
      'Performance-conscious implementation',
      'Direct form inquiry routing & verification',
      'Production files and agreed access handover',
    ],
    icon: 'code',
    accentColor: '#06B6D4',
    ctaText: 'Start a Project',
    enabled: true,
    order: 2,
  },
  {
    id: 'srv-ui-ux-design',
    number: '03',
    title: 'UI/UX Design',
    description: 'Interface and user experience design focused on ease of navigation, clarity of offer, and low inquiry friction.',
    idealFor: 'Firms with complex services, multiple customer personas, or low conversion rates from current traffic.',
    problemSolved: 'Removes decision friction, clarifies service offerings, and makes inquiry actions intuitive.',
    whatItIncludes: [
      'Information architecture and user journey mapping',
      'Friction-free intake form and contact flow design',
      'Mobile thumb-zone touch navigation optimization',
      'Micro-interactions and feedback states',
      'Accessibility compliance (WCAG AA standards)',
    ],
    features: [
      'User journey mapping & information hierarchy',
      'Frictionless contact flow optimization',
      'Touch-friendly mobile interface design',
      'Subtle, purposeful interaction feedback',
      'WCAG AA accessible contrast & typography',
    ],
    icon: 'sparkles',
    accentColor: '#6366F1',
    ctaText: 'Start a Project',
    enabled: true,
    order: 3,
  },
  {
    id: 'srv-business-redesign',
    number: '04',
    title: 'Business Website Redesign',
    description: 'Complete overhaul of outdated, slow, or cluttered websites into modern, conversion-focused digital assets.',
    idealFor: 'Established businesses whose website has fallen behind their offline reputation and service quality.',
    problemSolved: 'Replaces high bounce rates and outdated aesthetics with a modern, authoritative web presence.',
    whatItIncludes: [
      'Content audit and structural re-architecture',
      'Visual refresh with clean typography and spacing',
      'Preservation of existing search rankings and URL structures',
      'Elimination of bloated, vulnerable third-party dependencies',
      'Live smartphone staging comparison before launch',
    ],
    features: [
      'Full visual refresh and typography overhaul',
      'SEO equity & URL redirection preservation',
      'Elimination of legacy plugins & builder dependencies',
      'Live smartphone staging comparison',
      '30-day post-launch technical warranty',
    ],
    icon: 'zap',
    accentColor: '#10B981',
    ctaText: 'Request an Estimate',
    enabled: true,
    order: 4,
  },
  {
    id: 'srv-seo-architecture',
    number: '05',
    title: 'SEO-Ready Website Architecture',
    description: 'Technical foundations structured for clean search engine crawling, rapid indexation, and local search visibility.',
    idealFor: 'Local businesses, clinics, and professional practices seeking qualified organic search traffic.',
    problemSolved: 'Fixes poor Google search visibility, broken social share previews, and slow search indexation.',
    whatItIncludes: [
      'Semantic HTML5 document outlines with strict heading hierarchy',
      'Schema.org structured data (LocalBusiness, MedicalBusiness, FAQPage)',
      'Dynamic XML sitemaps, robots.txt, and canonical URL tags',
      'High-impact OpenGraph and Twitter/X social preview cards',
      'Mobile Core Web Vitals optimization for ranking factors',
    ],
    features: [
      'Schema.org structured data (JSON-LD)',
      'Semantic HTML5 heading hierarchy',
      'Dynamic XML sitemaps & robots.txt',
      'OpenGraph & Twitter social preview cards',
      'Core Web Vitals mobile compliance',
    ],
    icon: 'globe',
    accentColor: '#8B5CF6',
    ctaText: 'Start a Project',
    enabled: true,
    order: 5,
  },
  {
    id: 'srv-maintenance-support',
    number: '06',
    title: 'Website Maintenance & Support',
    description: 'Reliable post-launch technical support, maintenance, and bug fixes to ensure smooth, uninterrupted operation.',
    idealFor: 'Clients seeking ongoing technical peace of mind and direct assistance without hiring full-time staff.',
    problemSolved: 'Prevents post-launch neglect, silent contact form failures, and unresolved technical issues.',
    whatItIncludes: [
      'Post-launch warranty covering bug fixes in delivered scope',
      'Regular performance checks and browser compatibility audits',
      'Minor copy, service, and contact detail updates',
      'Domain, DNS, and SSL security monitoring',
      'Direct priority communication via Telegram and Gmail',
    ],
    features: [
      'Complimentary 30-day post-launch technical warranty',
      'Cross-browser & mobile compatibility checks',
      'Form & inquiry delivery health monitoring',
      'Minor copy adjustments & content updates',
      'Direct founder support channel',
    ],
    icon: 'shield',
    accentColor: '#F59E0B',
    ctaText: 'Start a Project',
    enabled: true,
    order: 6,
  },
];

export const DEFAULT_PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'proc-discover',
    step: '01',
    title: 'Discover',
    description: 'Understand the business, audience and goals.',
    details: 'We begin with a focused discovery conversation to identify your primary business objectives, target clients, and the specific reasons visitors are not taking action today.',
    duration: 'Phase 1',
    deliverables: ['Project Scope Document', 'Site Architecture Outline', 'Technical Stack Specification'],
    enabled: true,
    order: 1,
  },
  {
    id: 'proc-design',
    step: '02',
    title: 'Design',
    description: 'Create the visual direction, information hierarchy and user experience.',
    details: 'We craft clear wireframes and high-fidelity responsive layouts, establishing typography, color systems, and section pacing tailored to your industry.',
    duration: 'Phase 2',
    deliverables: ['Information Architecture', 'Responsive Layout System', 'Typographic & Palette Hierarchy'],
    enabled: true,
    order: 2,
  },
  {
    id: 'proc-build',
    step: '03',
    title: 'Build',
    description: 'Develop the responsive website with performance and maintainability in mind.',
    details: 'We build the website using clean React & TypeScript with sub-second asset bundling, semantic structure, database storage, and email notification dispatches.',
    duration: 'Phase 3',
    deliverables: ['Production-Grade React Codebase', 'Sub-Second Loading Performance', 'Inquiry Routing & Storage'],
    enabled: true,
    order: 3,
  },
  {
    id: 'proc-launch',
    step: '04',
    title: 'Launch',
    description: 'Test, refine, deploy and hand over the completed website.',
    details: 'You review the live build on your smartphone via a private staging URL. Once approved, we connect your domain, transfer production files and agreed access, and begin your 30-day warranty.',
    duration: 'Phase 4',
    deliverables: ['Responsive Preview & Review', 'Domain Connection & SSL Setup', 'Production Files & Access Handover', '30-Day Technical Warranty'],
    enabled: true,
    order: 4,
  },
];

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [];

export const DEFAULT_SITE_CONTENT: SiteContent = {
  brand: {
    studioLabel: 'AS Studio',
    eyebrow: 'Independent Digital Studio · India & Remote Worldwide',
    location: 'India & Remote Worldwide',
    headline: 'Websites for businesses ready to look established online.',
    description: 'AS Studio designs and develops modern, fast and conversion-focused websites for businesses that need a stronger online presence.',
    reassurance: 'Project scope determines the final investment. Timelines are agreed according to project scope.',
    primaryCta: 'Start a Project',
    secondaryCta: 'View Our Work',
  },
  services: DEFAULT_SERVICES,
  projects: PROJECTS,
  processSteps: DEFAULT_PROCESS_STEPS,
  testimonials: DEFAULT_TESTIMONIALS,
  sections: {
    work: {
      eyebrow: 'Selected Work',
      title: 'Intentional web experiences built for real businesses.',
      description: 'Explore our studio concepts across healthcare, interior ateliers, and hospitality. Clearly structured for review and demonstration.',
    },
    services: {
      eyebrow: 'Capabilities & Offerings',
      title: 'Strategy, design and development in one focused process.',
      description: 'Clear business offerings built to establish credibility, improve visibility, and convert visitors into clients.',
    },
    process: {
      eyebrow: 'Our Process',
      title: 'A disciplined, transparent path from brief to launch.',
      description: 'Four connected phases with live phone staging, clear production handover, and post-launch support.',
    },
    testimonials: {
      eyebrow: 'Our Commitments',
      title: 'What clients can expect from every engagement.',
      description: 'Honest communication, working previews on your phone, and zero proprietary lock-in.',
    },
    contact: {
      eyebrow: 'Initiate a Project',
      title: 'Have a project in mind?',
      description: 'Tell us what you are building, what is not working today, and what you want the website to achieve.',
      reassurance: 'Project scope determines the final investment. Every proposal is scoped transparently.',
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
      description: 'AS Studio designs clean, fast, and mobile-first websites and landing pages for local clinics, cafes, home decor ateliers, and early-stage founders with clear production handover.',
      ogTitle: 'AS Studio — Clean Business Websites & Digital Experiences',
      ogDescription: 'Websites that make your business easier to choose. Mobile-first engineering, live phone staging, and scope-based project pricing.',
      ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      twitterTitle: 'AS Studio — Clean Business Websites & Redesigns',
      twitterDescription: 'Bespoke websites that make your business easier to choose. Mobile-first engineering, clear production handover, and live phone staging.',
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
      ogDescription: 'Timelines are agreed according to project scope and deliverables.',
      ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      twitterTitle: 'Web Design Services & Sprints — AS Studio',
      twitterDescription: 'Turnaround in 5–14 days. clear production handover and live smartphone staging.',
      twitterImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      canonical: 'https://as-studio-delta.vercel.app/services',
      noIndex: false,
      primaryKeyword: 'web design services for local businesses',
      secondaryKeywords: ['business website development', 'high-converting landing pages', 'website redesign sprint', 'production handover'],
      searchIntent: 'service_investigation',
    },
    process: {
      title: 'Our Methodology & 6-Phase Sprint — AS Studio',
      description: 'From Discovery and Strategy to Live Phone Staging and Launch. A clear, transparent path to a working website.',
      ogTitle: 'The Studio Methodology — AS Studio',
      ogDescription: 'How AS Studio builds fast, bespoke business websites in 7–14 days.',
      ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      twitterTitle: 'The Studio Methodology & Sprint — AS Studio',
      twitterDescription: 'A clear path from brief to launch with responsive review and agreed post-launch support.',
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
      ogDescription: 'Direct project enquiries with scope-based pricing for businesses.',
      ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      twitterTitle: 'Start a Project with AS Studio',
      twitterDescription: 'Direct enquiries via Telegram & Gmail with project scope and pricing agreed for each engagement.',
      twitterImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      canonical: 'https://as-studio-delta.vercel.app/contact',
      noIndex: false,
      primaryKeyword: 'hire independent web design studio',
      secondaryKeywords: ['start website project', 'business website pricing', 'clinic website inquiry', 'telegram web design consultation'],
      searchIntent: 'direct_conversion',
    },
    track: {
      title: 'Track Project & Order Status — AS Studio',
      description: 'Check real-time milestone progress, smartphone staging links, and delivery status for your AS Studio inquiry or project.',
      ogTitle: 'Track Project & Order Status — AS Studio',
      ogDescription: 'Live milestone verification and delivery pipeline tracking for AS Studio clients.',
      ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      twitterTitle: 'Track Order Status — AS Studio',
      twitterDescription: 'Live verification and milestone tracking for AS Studio projects.',
      twitterImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85',
      canonical: 'https://as-studio-delta.vercel.app/track',
      noIndex: false,
      primaryKeyword: 'track website order status',
      secondaryKeywords: ['website project tracker', 'client project milestone', 'staging preview tracking'],
      searchIntent: 'client_tracking',
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

// Strictly zero fake client projects
export const SAMPLE_CLIENT_PROJECTS: ClientProject[] = [];

// Helper to filter out any legacy demo or fake client projects
function sanitizeClientProjects(projects: ClientProject[]): ClientProject[] {
  return (projects || []).filter((p) => {
    if (!p || !p.id) return false;
    const id = p.id.toLowerCase();
    const title = (p.title || '').toLowerCase();
    const business = (p.businessName || '').toLowerCase();
    return (
      !id.includes('demo') &&
      !id.includes('glasshouse') &&
      !id.includes('verdant') &&
      !title.includes('glasshouse') &&
      !title.includes('verdant') &&
      !business.includes('glasshouse') &&
      !business.includes('verdant')
    );
  });
}

export async function getClientProjects(userEmail?: string, userUid?: string): Promise<ClientProject[]> {
  try {
    const colRef = collection(db, CLIENT_PROJECTS_COLLECTION);
    const snap = await getDocs(colRef);
    const rawList: ClientProject[] = [];
    snap.forEach((d) => {
      const data = d.data() as ClientProject;
      rawList.push({ ...data, id: d.id });
    });

    const list = sanitizeClientProjects(rawList);

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

  // Fallback to cache
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_CLIENT_PROJECTS_KEY);
      if (cached) {
        const rawList: ClientProject[] = JSON.parse(cached);
        const list = sanitizeClientProjects(rawList);
        // Resave sanitized list to wipe legacy cached fake items
        if (list.length !== rawList.length) {
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
    } catch {}
  }

  return [];
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
