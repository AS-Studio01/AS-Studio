import { ArrowRight, ShieldCheck, Zap, Lock, Sparkles } from 'lucide-react';
import { PageType } from '../types';

interface HeroProps {
  onNavigate: (page: PageType) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const guarantees = [
    { label: 'Turnaround', value: '7–14 Days', note: 'Fast production preview', icon: Zap },
    { label: 'Code Ownership', value: '100% Yours', note: 'Full source handover & IP', icon: Lock },
    { label: 'Pricing Terms', value: 'Negotiable', note: 'Flexible to your budget', icon: ShieldCheck },
    { label: 'Post-Launch', value: '30-Day Support', note: 'Free warranty included', icon: Sparkles },
  ];

  return (
    <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 landscape:pt-8 landscape:pb-12 landscape:sm:pt-14 landscape:sm:pb-16 border-b border-[#27272A] ambient-glow overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* Tags & Domain Indicator */}
          <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6 text-xs text-[#A1A1AA]">
            <span className="font-bold uppercase tracking-wider text-white">AS Studio</span>
            <span className="text-[#52525B]">·</span>
            <span className="font-semibold">Independent Digital Design Practice</span>
            <span className="text-[#52525B]">·</span>
            <span className="text-[#3B82F6] font-bold">India & Remote Worldwide</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] mb-5 sm:mb-8 landscape:text-3xl landscape:sm:text-5xl landscape:mb-4">
            Websites that make your business easier to choose.
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl lg:text-2xl text-[#D4D4D8] leading-relaxed font-medium mb-6 sm:mb-10 landscape:mb-5 max-w-2xl">
            AS Studio designs clean, fast and mobile-first websites for local businesses, clinics, cafes, home decor ateliers, and early-stage teams.
          </p>

          {/* Apple-style Glassmorphic Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-12 landscape:mb-6">
            <button
              onClick={() => onNavigate('work')}
              className="glass-btn inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-7 sm:py-4 text-xs font-bold uppercase tracking-wider text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
            >
              <span>View selected work</span>
              <ArrowRight className="w-4 h-4 text-[#3B82F6]" />
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className="glass-btn-primary inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-7 sm:py-4 text-xs font-bold uppercase tracking-wider text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
            >
              <span>Start a project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Client Reassurance Line */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#A1A1AA] pb-2">
            <span className="inline-flex items-center gap-1.5 font-bold text-white shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
              <span>Client Security Promise:</span>
            </span>
            <span>You test on your phone before launch. Zero proprietary lock-in. Full source code delivered.</span>
          </div>
        </div>

        {/* Highlighted studio data strip with bold values */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#27272A] grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 landscape:gap-3">
          {guarantees.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.label} 
                className="space-y-1.5 sm:space-y-2 p-4 sm:p-5 landscape:p-3 bg-[#141418]/80 border border-white/[0.08] hover:border-[#3B82F6]/40 transition-colors backdrop-blur-md rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between text-[#A1A1AA]">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold font-mono">
                    {item.label}
                  </span>
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3B82F6]" />
                </div>
                <div className="text-lg sm:text-2xl font-black tracking-tight text-white">
                  {item.value}
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-[#A1A1AA] block leading-tight">
                  {item.note}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
