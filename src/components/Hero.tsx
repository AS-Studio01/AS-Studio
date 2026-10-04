import { ArrowRight, CheckCircle2, ShieldCheck, Smartphone, Lock, Clock, Code2, Zap } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { PageType } from '../types';

interface HeroProps {
  onNavigate: (page: PageType) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const { content } = useSiteContent();
  const brand = content.brand;

  const credibilityItems = [
    'Strategy',
    'UI/UX',
    'Development',
    'SEO-ready',
    'Performance',
  ];

  const studioGuarantees = [
    {
      label: 'Source Code Handover',
      value: 'Source Code Handover',
      desc: 'Clean GitHub repo or production files. No proprietary platform lock-in.',
      icon: Lock,
    },
    {
      label: 'Pre-Launch Verification',
      value: 'Live Smartphone Staging',
      desc: 'Test the live site on your phone before domain launch or final payment.',
      icon: Smartphone,
    },
    {
      label: 'Turnaround Timeline',
      value: '1–3 Weeks Typical',
      desc: 'Disciplined sprints tailored to agreed deliverables and business scope.',
      icon: Clock,
    },
    {
      label: 'Post-Launch Assurance',
      value: '30-Day Support Warranty',
      desc: 'Complimentary bug fixes and responsive adjustments for delivered scope.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#E5E2D9] dark:border-white/[0.08] bg-[#FAF9F5] dark:bg-[#09090C] overflow-hidden transition-colors duration-150">
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-gradient-to-b from-blue-600/5 dark:from-blue-600/10 via-indigo-600/5 to-transparent blur-[100px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Studio Headline, Positioning & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* Subtle Eyebrow */}
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#52525B] dark:text-[#A1A1AA]">
              <span className="w-2 h-2 rounded-full bg-[#0047AB] dark:bg-blue-500" />
              <span className="text-[#18181B] dark:text-white">AS Studio</span>
              <span className="text-[#A1A1AA] dark:text-[#52525B]">·</span>
              <span>Independent Digital Studio</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#090A0D] dark:text-white leading-[1.08]">
              Websites for businesses ready to look established online.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#374151] dark:text-[#D4D4D8] leading-relaxed font-normal max-w-xl">
              AS Studio designs and develops modern, fast and conversion-focused websites for businesses that need a stronger online presence.
            </p>

            {/* Primary & Secondary Pill CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('contact')}
                className="glass-btn-primary px-8 py-3.5 text-xs uppercase tracking-wider text-white font-bold rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('work')}
                className="glass-btn px-8 py-3.5 text-xs uppercase tracking-wider text-[#18181B] dark:text-white font-bold rounded-full transition-all flex items-center justify-center gap-2"
              >
                <span>View Our Work</span>
                <ArrowRight className="w-4 h-4 text-[#0047AB] dark:text-[#60A5FA]" />
              </button>
            </div>

            {/* Subtle Credibility Row */}
            <div className="pt-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#52525B] dark:text-[#A1A1AA] font-mono">
                {credibilityItems.map((item, index) => (
                  <span key={item} className="inline-flex items-center gap-3">
                    <span className="text-[#18181B] dark:text-[#E4E4E7] font-semibold">{item}</span>
                    {index < credibilityItems.length - 1 && (
                      <span className="text-[#A1A1AA] dark:text-[#52525B]">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Transparent Pricing Commitment Note */}
            <div className="flex items-center gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA] pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Project scope determines the final investment. Typical projects launch within 1–3 weeks.</span>
            </div>
          </div>

          {/* Right Column: High-Craft Studio Engineering Overview Card */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#121218] border border-[#E5E2D9] dark:border-white/[0.12] p-6 sm:p-7 shadow-xl dark:shadow-2xl space-y-5 transition-colors">
              
              {/* Card Header: Studio Standards */}
              <div className="flex items-center justify-between border-b border-[#E5E2D9] dark:border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0047AB] dark:bg-blue-500" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#18181B] dark:text-white">
                    Studio Delivery Standards
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Production-Ready
                </span>
              </div>

              {/* Engineering Blueprint Matrix */}
              <div className="space-y-3">
                {studioGuarantees.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-white/[0.02] border border-[#E5E2D9] dark:border-white/[0.06] hover:border-[#2563EB] dark:hover:border-white/15 transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] dark:text-[#71717A] flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-[#0047AB] dark:text-blue-400" />
                          <span>{item.label}</span>
                        </span>
                        <span className="text-xs font-bold text-[#18181B] dark:text-white font-mono">
                          {item.value}
                        </span>
                      </div>
                      <p className="text-xs text-[#4B5563] dark:text-[#A1A1AA] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Sub-Second Performance Strip */}
              <div className="p-3.5 rounded-xl bg-[#F4F2EC] dark:bg-[#0B0B0F] border border-[#E5E2D9] dark:border-white/[0.08] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-[#374151] dark:text-[#D4D4D8]">
                  <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                  <span>Performance Target:</span>
                </div>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  FCP &lt; 0.9s · 95+ Score
                </span>
              </div>

              {/* Action Link to Work Page */}
              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="text-[#6B7280] dark:text-[#71717A] font-mono">
                  3 Flagship Concepts Ready
                </span>
                <button
                  onClick={() => onNavigate('work')}
                  className="text-[#0047AB] dark:text-blue-400 font-bold hover:underline transition-colors inline-flex items-center gap-1"
                >
                  <span>Explore Concepts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

