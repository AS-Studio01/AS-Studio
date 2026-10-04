import { CheckCircle2, MessageSquare, Compass, Zap, Smartphone, Code2, Target } from 'lucide-react';

interface AboutSectionProps {
  onStartProject?: () => void;
}

export function AboutSection({ onStartProject }: AboutSectionProps) {
  const principles = [
    {
      icon: MessageSquare,
      title: 'Clear communication',
      description: 'You communicate directly with the designer and engineer building your site. No layers of account managers, miscommunicated briefs, or delayed answers.',
    },
    {
      icon: Compass,
      title: 'Thoughtful design',
      description: 'We prioritize typography, readable measure, and deliberate visual hierarchy over decorative trends. Every decision is made to reflect your business authority.',
    },
    {
      icon: Zap,
      title: 'Fast performance',
      description: 'We keep layouts, assets and interactions purposeful, then check performance against the actual content and hosting used for the project.',
    },
    {
      icon: Smartphone,
      title: 'Responsive development',
      description: 'Mobile is not an afterthought. Layouts are designed specifically for touch viewports and verified directly on smartphones before public release.',
    },
    {
      icon: Code2,
      title: 'Maintainable builds',
      description: 'Maintainable React and TypeScript builds with an agreed production handover. Hosting and third-party services are chosen according to the project.',
    },
    {
      icon: Target,
      title: 'Business-focused UX',
      description: 'We design around the exact moment your customer chooses whether to contact you, making your services, credibility, and inquiry pathways undeniable.',
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 border-b border-[#E5E2D9] dark:border-white/[0.08] bg-[#FFFFFF] dark:bg-[#0A0A0E] relative overflow-hidden transition-colors duration-150">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#52525B] dark:text-[#A1A1AA] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#0047AB] dark:bg-blue-500" />
            <span>About AS Studio</span>
            <span className="text-[#A1A1AA] dark:text-[#52525B]">·</span>
            <span className="text-[#18181B] dark:text-white">Independent Practice</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#090A0D] dark:text-white mb-6 leading-[1.12]">
            An independent digital studio focused on clarity and craftsmanship.
          </h2>

          <p className="text-base sm:text-lg text-[#374151] dark:text-[#D4D4D8] leading-relaxed font-normal">
            AS Studio is an independent digital studio focused on designing and developing modern websites for businesses that want a clearer, more credible online presence.
          </p>

          <p className="text-sm sm:text-base text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed mt-3 font-normal">
            We work with clinics, professional firms, real estate businesses, hospitality brands, architecture ateliers, and growing companies worldwide. We operate without the bloat, rigid minimums, or bureaucracy of conventional agencies.
          </p>
        </div>

        {/* 6 Guiding Studio Principles */}
        <div className="mb-14">
          <div className="mb-6 flex items-center justify-between border-b border-[#E5E2D9] dark:border-white/[0.08] pb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#71717A]">
              Our Operating Principles
            </span>
            <span className="text-xs font-mono text-[#0047AB] dark:text-[#60A5FA] font-bold">
              Human-led design · Clear project handover
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-2xl bg-[#FAF9F5] dark:bg-[#121218] border border-[#E5E2D9] dark:border-white/[0.08] hover:border-[#0047AB] dark:hover:border-white/20 transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#0047AB] dark:text-blue-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#18181B] dark:text-white tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#A1A1AA] leading-relaxed">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Honest Business Positioning Note */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF9F5] dark:bg-white/[0.02] border border-[#E5E2D9] dark:border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Transparent Studio Collaboration</span>
            </div>
            <p className="text-xs sm:text-sm text-[#374151] dark:text-[#D4D4D8] leading-relaxed">
              Every project is scoped according to its unique requirements. We deliver working phone previews before launch, full source code ownership, and 30 days of post-launch technical support.
            </p>
          </div>

          {onStartProject && (
            <button
              onClick={onStartProject}
              className="glass-btn-primary px-6 py-3 text-xs uppercase tracking-wider text-white font-bold rounded-full shrink-0 shadow-lg"
            >
              Start a Project
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
