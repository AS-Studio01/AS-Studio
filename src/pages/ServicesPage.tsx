import { useState } from 'react';
import { Check, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { PageType } from '../types';

interface ServicesPageProps {
  onNavigate: (page: PageType) => void;
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  const services = [
    {
      id: 'business-websites',
      number: '01',
      title: 'Business Websites',
      headline: 'Clear, responsive websites that explain your business and turn visitors into enquiries.',
      turnaround: '10–14 business days',
      idealFor: 'Local clinics, medical practices, law firms, architecture studios, artisanal brands and consulting teams.',
      tags: ['Multi-Section Architecture', 'Local SEO Metadata', 'Mobile-First Grid', 'Full Code Handover'],
      deliverables: [
        'Strategic information architecture and content hierarchy',
        'Custom responsive design tailored for mobile phones and desktops',
        'High-legibility typography system and curated brand palette',
        'Direct email and Telegram enquiry triggers with zero dead-ends',
        'Google Business Profile and local map integration',
        'Complete production source code and deployment assistance',
      ],
      clientRequirement: 'High-level business overview, team credentials, and photos (or we provide neutral architectural visuals).',
    },
    {
      id: 'landing-pages',
      number: '02',
      title: 'Landing Pages',
      headline: 'Focused pages for a launch, offer, booking campaign or WhatsApp enquiries.',
      turnaround: '5–7 business days',
      idealFor: 'Early-stage founders validating new concepts, single-product drops, event venues, and seasonal booking drives.',
      tags: ['Single Goal Focus', 'Sub-second Load', 'Conversion Tested', 'Campaign Ready'],
      deliverables: [
        'Singular, distraction-free conversion architecture',
        'High-impact headline and value proposition positioning',
        'Friction-free inquiry flow with instant copy & message actions',
        'Clean mobile wireframe preview before build starts',
        'Zero heavy script dependencies for maximum load velocity',
      ],
      clientRequirement: 'Your core offer, target customer profile, and primary call-to-action.',
    },
    {
      id: 'website-redesigns',
      number: '03',
      title: 'Website Redesigns',
      headline: 'Cleaner structure, stronger messaging and a better mobile experience.',
      turnaround: '7–12 business days',
      idealFor: 'Businesses with outdated WordPress sites, cluttered templates, slow load times, or low conversion rates.',
      tags: ['Audit & Restructure', 'Performance Boost', 'Mobile Overhaul', 'Zero Lock-in'],
      deliverables: [
        'Comprehensive audit identifying friction points and visual clutter',
        'Re-architecting content flow to prioritize what customers care about most',
        'Rewriting or sharpening headlines to eliminate jargon',
        'Complete code rewrite in clean modern TypeScript/Tailwind',
        'Seamless migration without domain downtime or lost rankings',
      ],
      clientRequirement: 'Link to your current website and what you feel isn’t working.',
    },
  ];

  const standardsComparison = [
    {
      feature: 'Source Code Ownership',
      studio: '100% delivered to you on day one',
      others: 'Locked behind proprietary builders & monthly fees',
    },
    {
      feature: 'Mobile Performance',
      studio: 'Sub-second First Contentful Paint (<1.0s)',
      others: '3–6 second load times with 40+ third-party plugins',
    },
    {
      feature: 'Communication',
      studio: 'Direct contact with designer via Telegram & Gmail',
      others: 'Layered account managers and ticketing systems',
    },
    {
      feature: 'Design Philosophy',
      studio: 'Restrained, calm, typography-led, honest badging',
      others: 'Generic templates, fake testimonials, neon gradients',
    },
  ];

  return (
    <div className="py-16 sm:py-24 fade-in">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#736E66] dark:text-[#A1A1AA] font-medium">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#121212] dark:hover:text-white transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-[#121212] dark:text-white font-bold">Services</span>
        </div>

        {/* Page Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#6B6661] dark:text-[#A1A1AA] font-bold font-mono">
            <span>Capabilities</span>
            <span className="text-[#999288] dark:text-[#52525B]">·</span>
            <span className="text-[#0047AB] dark:text-[#3B82F6]">What We Build</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#121212] dark:text-white leading-[1.08]">
            Clear, fast and purposeful websites built for real businesses.
          </h1>
          <p className="text-base sm:text-xl text-[#3E3B37] dark:text-[#D4D4D8] leading-relaxed font-medium">
            We don’t build generic agency clutter. We deliver focused digital assets designed to make your business unmistakable and effortless to contact.
          </p>
        </div>

        {/* Highlight Stats Strip */}
        <div className="mb-14 p-6 sm:p-8 bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] grid grid-cols-2 md:grid-cols-4 gap-6 text-[#121212] dark:text-white backdrop-blur-sm">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-bold font-mono">Turnaround</span>
            <span className="text-2xl font-black tracking-tight block mt-1">5–14 Days</span>
            <span className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA]">Fast, disciplined sprints</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-bold font-mono">Deliverable</span>
            <span className="text-2xl font-black tracking-tight block mt-1">Full Code</span>
            <span className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA]">Clean HTML/CSS/React/TS</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-bold font-mono">Revision Policy</span>
            <span className="text-2xl font-black tracking-tight block mt-1 text-[#0047AB] dark:text-[#3B82F6]">Working Previews</span>
            <span className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA]">Test live on your phone</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-bold font-mono">Contracts</span>
            <span className="text-2xl font-black tracking-tight block mt-1">Transparent</span>
            <span className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA]">No monthly subscription traps</span>
          </div>
        </div>

        {/* Interactive Scope Navigator Tabs */}
        <div className="mb-8 border-b border-[#E7E2DA] dark:border-[#27272A] flex overflow-x-auto gap-2 pb-2">
          {services.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(idx)}
              className={`py-3 px-5 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                activeTab === idx
                  ? 'border-b-2 border-[#0047AB] dark:border-[#3B82F6] text-[#0047AB] dark:text-[#3B82F6] bg-white dark:bg-[#18181B]'
                  : 'text-[#6B6661] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white bg-[#F5F2EB] dark:bg-[#141416]'
              }`}
            >
              {item.number} — {item.title}
            </button>
          ))}
        </div>

        {/* Selected Service Detailed View */}
        <div className="bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] p-8 sm:p-12 mb-16 shadow-sm backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Col */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-black text-[#0047AB] dark:text-[#3B82F6]">
                  SCOPE {services[activeTab].number}
                </span>
                <span className="text-[#DDD7CD] dark:text-[#3F3F46]">·</span>
                <span className="text-xs font-mono font-bold text-[#736E66] dark:text-[#A1A1AA]">
                  Timeline: {services[activeTab].turnaround}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#121212] dark:text-white">
                {services[activeTab].title}
              </h2>

              <p className="text-base sm:text-lg text-[#2A2825] dark:text-[#E4E4E7] font-semibold leading-relaxed">
                "{services[activeTab].headline}"
              </p>

              <div className="pt-2">
                <span className="text-xs uppercase font-bold tracking-wider text-[#736E66] dark:text-[#A1A1AA] block mb-1">
                  Tailored for:
                </span>
                <p className="text-xs text-[#4A4641] dark:text-[#D4D4D8] leading-relaxed font-medium">
                  {services[activeTab].idealFor}
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] text-xs text-[#57534E] dark:text-[#A1A1AA]">
                <strong className="block text-[#121212] dark:text-white font-bold mb-1">
                  What we need from you:
                </strong>
                {services[activeTab].clientRequirement}
              </div>

              {/* Tags */}
              <div className="pt-1 flex flex-wrap gap-1.5">
                {services[activeTab].tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-[#FAF8F5] dark:bg-[#27272A] border border-[#DDD7CD] dark:border-[#3F3F46] text-[11px] font-mono font-semibold text-[#57534E] dark:text-[#A1A1AA]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Col: Scope Deliverables */}
            <div className="lg:col-span-6 bg-[#FAF8F5] dark:bg-[#141416] border border-[#E7E2DA] dark:border-[#27272A] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white mb-4 pb-2 border-b border-[#E7E2DA] dark:border-[#27272A]">
                  Scope Specifications & Deliverables
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-[#4A4641] dark:text-[#D4D4D8]">
                  {services[activeTab].deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#0047AB] dark:text-[#3B82F6] shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-8 border-t border-[#E7E2DA] dark:border-[#27272A] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <span className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA]">
                  Ready to initiate this scope?
                </span>
                <button
                  onClick={() => {
                    onNavigate('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="glass-btn-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
                >
                  <span>Start this project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Client Security Commitments */}
        <div className="mb-20 p-8 sm:p-10 bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] space-y-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 text-[#0047AB] dark:text-[#3B82F6]">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">
              Client Security & Contractual Safeguards
            </span>
          </div>

          <h3 className="text-2xl font-black tracking-tight text-[#121212] dark:text-white">
            Transparent business agreements built to protect founders and local owners.
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 bg-[#FAF8F5] dark:bg-[#141416] border border-[#E7E2DA] dark:border-[#27272A] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white block">
                1. Negotiable & Budget-Adaptive Pricing
              </span>
              <p className="text-xs text-[#55514B] dark:text-[#A1A1AA] leading-relaxed font-medium">
                Before any work starts, we agree on a negotiable price tailored to your actual budget and business scale. No rigid corporate minimums or surprise invoice doubles.
              </p>
            </div>

            <div className="p-5 bg-[#FAF8F5] dark:bg-[#141416] border border-[#E7E2DA] dark:border-[#27272A] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white block">
                2. Live Smartphone Staging
              </span>
              <p className="text-xs text-[#55514B] dark:text-[#A1A1AA] leading-relaxed font-medium">
                You test the website live on your own smartphone before launch. We do not approve designs on static desktop mockups.
              </p>
            </div>

            <div className="p-5 bg-[#FAF8F5] dark:bg-[#141416] border border-[#E7E2DA] dark:border-[#27272A] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white block">
                3. Total Asset Handover
              </span>
              <p className="text-xs text-[#55514B] dark:text-[#A1A1AA] leading-relaxed font-medium">
                Clean source code, domain DNS setup, and typography licenses are transferred to you with zero proprietary platform lock-in.
              </p>
            </div>
          </div>
        </div>

        {/* Quality Standards Comparison Table */}
        <div className="mt-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs uppercase tracking-wider text-[#6B6661] dark:text-[#A1A1AA] font-bold block mb-2 font-mono">
              Honest Comparison
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121212] dark:text-white">
              How AS Studio compares to typical agency practices
            </h2>
          </div>

          <div className="bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#DDD7CD] dark:border-[#27272A] bg-[#F5F2EB] dark:bg-[#141416]">
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-[#6B6661] dark:text-[#A1A1AA] w-1/3">
                    Standard
                  </th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-[#0047AB] dark:text-[#3B82F6] w-1/3">
                    AS Studio
                  </th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-[#736E66] dark:text-[#A1A1AA] w-1/3">
                    Typical Agency / Templates
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2DA] dark:divide-[#27272A]">
                {standardsComparison.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF8F5] dark:hover:bg-[#1F1F23] transition-colors">
                    <td className="py-4 px-6 font-bold text-[#121212] dark:text-white">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 text-[#121212] dark:text-white font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#0047AB] dark:text-[#3B82F6] shrink-0" />
                      <span>{row.studio}</span>
                    </td>
                    <td className="py-4 px-6 text-[#6B6661] dark:text-[#A1A1AA] font-medium">
                      <span className="flex items-center gap-2">
                        <X className="w-4 h-4 text-[#999288] shrink-0" />
                        <span>{row.others}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 p-8 bg-[#F5F2EB] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-[#121212] dark:text-white">
              Ready to build something clean and dependable?
            </h3>
            <p className="text-sm text-[#4A4641] dark:text-[#D4D4D8] font-medium">
              Reach out via Telegram or send us a brief through our simple contact flow.
            </p>
          </div>
          <button
            onClick={() => {
              onNavigate('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="glass-btn-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shrink-0"
          >
            Start a project
          </button>
        </div>
      </div>
    </div>
  );
}
