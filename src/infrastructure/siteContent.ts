import { ServiceItem, ProcessStep } from './types';

export const STUDIO_META = {
  name: 'AS Studio',
  tagline: 'Clean, fast, and mobile-first websites for modern businesses & founders.',
  founded: 'Independent Studio',
  guarantees: [
    {
      title: '100% Source Code Ownership',
      desc: 'Complete handover of clean Git repository & production assets on launch. Zero proprietary builder lock-in.',
    },
    {
      title: 'Live Smartphone Staging',
      desc: 'Test the real, responsive website on your own device before sign-off or final milestone payments.',
    },
    {
      title: '30-Day Post-Launch Warranty',
      desc: 'Complimentary bug fixes, content adjustments, and performance monitoring after go-live.',
    },
    {
      title: 'Flexible & Negotiable Pricing',
      desc: 'We adapt to your business stage and scope. Transparent milestone deliverables with no corporate bloat.',
    },
  ],
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'business-websites',
    title: 'Business Websites',
    turnaround: '10–14 Days',
    idealFor: 'Clinics, local practices, architectural ateliers, and boutique firms.',
    description: 'High-credibility multi-page websites designed to turn local visitors into booked consultations and calls.',
    deliverables: [
      'Custom UI design & typography system',
      'Mobile-first responsive architecture',
      'Contact inquiry & appointment triage forms',
      'Local SEO metadata & schema markup',
    ],
    features: ['Zero slow WordPress plugins', 'Sub-second page speeds', 'Google Maps & contact routing'],
  },
  {
    id: 'landing-pages',
    title: 'High-Conversion Landing Pages',
    turnaround: '5–7 Days',
    idealFor: 'Product launches, new services, SaaS teasers, and targeted ad campaigns.',
    description: 'Laser-focused single page architectures engineered with crisp benefit hierarchy and frictionless actions.',
    deliverables: [
      'High-impact hero with clear proposition',
      'Social proof, metrics & trust indicators',
      'Direct intake / checkout integrations',
      'Conversion tracking readiness',
    ],
    features: ['A/B test ready structure', 'Micro-interactions & animations', 'Ultra-lightweight bundle'],
  },
  {
    id: 'redesigns',
    title: 'Website Redesigns',
    turnaround: '7–12 Days',
    idealFor: 'Outdated websites that fail to convert mobile visitors or load slowly.',
    description: 'Complete visual and architectural overhaul replacing heavy templates with bespoke, modern code.',
    deliverables: [
      'Full UX audit & bottleneck analysis',
      'Clean modern aesthetic refresh',
      'Preservation of existing SEO rankings',
      'Lightning-fast mobile performance',
    ],
    features: ['Eliminate 50MB PDF downloads', 'Clear doctor / team credibility', 'One-tap messaging actions'],
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Discovery & Scope Alignment',
    duration: 'Day 1–2',
    description: 'We review your target clients, competitors, key services, and exact conversion goals.',
    deliverables: ['Project brief', 'Sitemap blueprint', 'Wireframe concepts'],
  },
  {
    step: '02',
    title: 'Design & Interactive Prototype',
    duration: 'Day 3–6',
    description: 'We craft high-fidelity, high-contrast layouts tailored to your brand personality with mobile focus.',
    deliverables: ['Custom design system', 'Interactive prototype', 'Typography & color palette'],
  },
  {
    step: '03',
    title: 'Production Build & Integration',
    duration: 'Day 7–11',
    description: 'Handcrafted clean code with zero template bloat, sub-second load times, and custom forms.',
    deliverables: ['Fully functional web application', 'Form routing', 'Live staging link on your phone'],
  },
  {
    step: '04',
    title: 'Launch & 30-Day Warranty',
    duration: 'Day 12–14',
    description: 'Domain connection, SEO indexing, full source code delivery, and 30 days of complimentary support.',
    deliverables: ['Production deployment', 'Git repo ownership', 'Search engine sitemap submission'],
  },
];
