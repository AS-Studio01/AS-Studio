import { CheckCircle2, ArrowRight } from 'lucide-react';
import { PageType } from '../types';

interface ProcessPageProps {
  onNavigate: (page: PageType) => void;
}

export function ProcessPage({ onNavigate }: ProcessPageProps) {
  const steps = [
    {
      step: '01',
      title: 'Brief',
      exactHeadline: 'Tell us about your business, audience and main goal.',
      duration: 'Day 1–2',
      whatHappens: [
        'You submit your business details, target audience, and current website challenges.',
        'We review your existing materials and identify the primary customer action needed.',
        'We define a fixed scope, clear milestone schedule, and flat quote with zero hidden fees.',
      ],
      output: 'Project Scope Document & Content Inventory',
    },
    {
      step: '02',
      title: 'Direction',
      exactHeadline: 'We create a clear page structure and visual direction.',
      duration: 'Day 3–5',
      whatHappens: [
        'We establish the content hierarchy and structural wireframes for both mobile and desktop.',
        'We select modern typographic pairings and a focused color palette tailored to your field.',
        'We refine copy headlines and calls-to-action so your value proposition is clear within 5 seconds.',
      ],
      output: 'Wireframe Architecture & Visual Direction Approval',
    },
    {
      step: '03',
      title: 'Build',
      exactHeadline: 'You receive a working preview before launch.',
      duration: 'Day 6–10',
      whatHappens: [
        'We build your website using clean, production-grade frontend code (TypeScript, modern CSS).',
        'We optimize all layouts for mobile touch screens, ensuring buttons and links are effortlessly tap-friendly.',
        'You receive a private staging URL to test all interactions live on your own smartphone and desktop.',
      ],
      output: 'Interactive Live Staging Preview',
    },
    {
      step: '04',
      title: 'Launch',
      exactHeadline: 'Final checks, handover and source-code delivery.',
      duration: 'Day 11–14',
      whatHappens: [
        'We run final cross-browser checks, SEO metadata audits, and speed benchmarks.',
        'We connect your custom domain name and verify secure HTTPS SSL certificates.',
        'Full source code and visual assets are transferred directly to you with zero platform lock-in.',
      ],
      output: 'Live Website & Complete Source Code Repository',
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
          <span className="text-[#121212] dark:text-white font-bold">Process</span>
        </div>

        {/* Page Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#6B6661] dark:text-[#A1A1AA] font-bold font-mono">
            <span>Methodology</span>
            <span className="text-[#999288] dark:text-[#52525B]">·</span>
            <span className="text-[#0047AB] dark:text-[#3B82F6]">A Clear Process</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#121212] dark:text-white leading-[1.08]">
            How we take your website from blank brief to live launch.
          </h1>
          <p className="text-base sm:text-xl text-[#3E3B37] dark:text-[#D4D4D8] leading-relaxed font-medium">
            No jargon. No endless slide decks. Just a straightforward 4-stage pipeline built to deliver high-quality work on predictable timelines.
          </p>
        </div>

        {/* Highlight Stats Strip */}
        <div className="mb-16 p-6 sm:p-8 bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] grid grid-cols-2 md:grid-cols-4 gap-6 text-[#121212] dark:text-white backdrop-blur-sm">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-bold font-mono">Timeline</span>
            <span className="text-2xl font-black tracking-tight block mt-1">2 Weeks</span>
            <span className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA]">Average end-to-end delivery</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-bold font-mono">Communication</span>
            <span className="text-2xl font-black tracking-tight block mt-1">Async-First</span>
            <span className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA]">Direct Telegram & email updates</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-bold font-mono">Revisions</span>
            <span className="text-2xl font-black tracking-tight block mt-1 text-[#0047AB] dark:text-[#3B82F6]">Iterative</span>
            <span className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA]">Refinements during preview phase</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-bold font-mono">Delivery</span>
            <span className="text-2xl font-black tracking-tight block mt-1">Source Code</span>
            <span className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA]">Complete asset package handover</span>
          </div>
        </div>

        {/* 4 Steps In-Depth */}
        <div className="space-y-8">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] p-8 sm:p-10 hover:border-[#121212] dark:hover:border-white transition-colors shadow-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left col: Step number and headline */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-black text-[#0047AB] dark:text-[#3B82F6] tracking-widest">
                      PHASE {item.step}
                    </span>
                    <span className="text-[#DDD7CD] dark:text-[#3F3F46]">·</span>
                    <span className="text-xs font-mono font-bold text-[#736E66] dark:text-[#A1A1AA]">
                      {item.duration}
                    </span>
                  </div>

                  <h2 className="text-3xl font-black tracking-tight text-[#121212] dark:text-white">
                    {item.step} — {item.title}
                  </h2>

                  <p className="text-base sm:text-lg text-[#2E2B27] dark:text-[#E4E4E7] font-semibold leading-relaxed">
                    "{item.exactHeadline}"
                  </p>

                  <div className="pt-4 border-t border-[#F0EBE1] dark:border-[#27272A]">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#736E66] dark:text-[#A1A1AA] block mb-1">
                      Milestone Deliverable:
                    </span>
                    <span className="text-xs font-bold text-[#121212] dark:text-white bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] px-2.5 py-1 inline-block">
                      {item.output}
                    </span>
                  </div>
                </div>

                {/* Right col: Activities */}
                <div className="lg:col-span-7 bg-[#FAF8F5] dark:bg-[#141416] border border-[#E7E2DA] dark:border-[#27272A] p-6 sm:p-7">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white mb-4">
                    Key Execution Points
                  </h3>
                  <ul className="space-y-3 text-xs sm:text-sm text-[#4A4641] dark:text-[#D4D4D8]">
                    {item.whatHappens.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-[#0047AB] dark:text-[#3B82F6] shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-medium">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Communication Protocol Box */}
        <div className="mt-16 p-8 bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] space-y-4 shadow-sm backdrop-blur-sm">
          <span className="text-xs uppercase font-bold tracking-wider text-[#0047AB] dark:text-[#3B82F6] block font-mono">
            Direct Working Relationship
          </span>
          <h3 className="text-2xl font-black tracking-tight text-[#121212] dark:text-white">
            No middle managers. You talk directly with the engineer.
          </h3>
          <p className="text-sm text-[#4A4641] dark:text-[#D4D4D8] leading-relaxed max-w-3xl font-medium">
            We operate asynchronously and efficiently. For day-to-day updates, we use Telegram voice notes, screenshots, and concise email summaries. When it is time to review the staging site, you can click through every interaction on your actual phone.
          </p>
          <div className="pt-2 text-xs text-[#736E66] dark:text-[#A1A1AA]">
            Active channels: Telegram (@AS_Studio_official01) & Gmail (asbusinessofficial01@gmail.com). WhatsApp is disabled.
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 bg-[#F5F2EB] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] transition-colors">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-[#121212] dark:text-white">
              Have an upcoming project you would like to map out?
            </h4>
            <p className="text-xs font-medium text-[#4A4641] dark:text-[#D4D4D8]">
              Submit your business details and we will reply with an initial direction.
            </p>
          </div>
          <button
            onClick={() => {
              onNavigate('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="glass-btn-primary inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shrink-0"
          >
            <span>Start a project</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
