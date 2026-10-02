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
    <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-[#E7E2DA] dark:border-[#27272A] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-3xl">
          {/* Tags & Domain Indicator */}
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-[#6B6661] dark:text-[#A1A1AA]">
            <span className="font-bold uppercase tracking-wider text-[#121212] dark:text-white">AS Studio</span>
            <span className="text-[#999288] dark:text-[#52525B]">·</span>
            <span className="font-semibold">Independent Digital Design Practice</span>
            <span className="text-[#999288] dark:text-[#52525B]">·</span>
            <span className="text-[#0047AB] dark:text-[#3B82F6] font-bold">India & Remote Worldwide</span>
          </div>

          {/* Headline (exact required text, bold & authoritative) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#121212] dark:text-white leading-[1.06] mb-8">
            Websites that make your business easier to choose.
          </h1>

          {/* Subheading (exact required text) */}
          <p className="text-lg sm:text-2xl text-[#3A3835] dark:text-[#D4D4D8] leading-relaxed font-medium mb-10 max-w-2xl">
            AS Studio designs clean, fast and mobile-first websites for local businesses and early-stage teams.
          </p>

          {/* Apple-style Glassmorphic Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
            <button
              onClick={() => onNavigate('work')}
              className="glass-btn inline-flex items-center justify-center gap-2.5 px-7 py-4 text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0047AB]"
            >
              <span>View selected work</span>
              <ArrowRight className="w-4 h-4 text-[#0047AB] dark:text-[#3B82F6]" />
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className="glass-btn-primary inline-flex items-center justify-center gap-2.5 px-7 py-4 text-xs font-bold uppercase tracking-wider text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0047AB]"
            >
              <span>Start a project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Client Reassurance Line */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B6661] dark:text-[#A1A1AA] pb-2">
            <span className="inline-flex items-center gap-1.5 font-bold text-[#121212] dark:text-white">
              <ShieldCheck className="w-4 h-4 text-[#0047AB] dark:text-[#3B82F6]" />
              <span>Client Security Promise:</span>
            </span>
            <span>You test on your phone before launch. Zero proprietary lock-in. Full source code delivered.</span>
          </div>
        </div>

        {/* Highlighted studio data strip with bold values */}
        <div className="mt-12 pt-8 border-t border-[#E7E2DA] dark:border-[#27272A] grid grid-cols-2 md:grid-cols-4 gap-6">
          {guarantees.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.label} 
                className="space-y-1.5 p-4 bg-white/60 dark:bg-[#18181B]/60 border border-[#E7E2DA] dark:border-[#27272A] backdrop-blur-sm"
              >
                <div className="flex items-center justify-between text-[#736E66] dark:text-[#A1A1AA]">
                  <span className="text-[11px] uppercase tracking-wider font-bold">
                    {item.label}
                  </span>
                  <Icon className="w-3.5 h-3.5 text-[#0047AB] dark:text-[#3B82F6]" />
                </div>
                <div className="text-xl sm:text-2xl font-black tracking-tight text-[#121212] dark:text-white">
                  {item.value}
                </div>
                <span className="text-xs font-medium text-[#57534E] dark:text-[#A1A1AA] block">
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
