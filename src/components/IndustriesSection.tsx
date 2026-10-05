import { Stethoscope, Building2, Briefcase, GraduationCap, Compass, Utensils, TrendingUp, ArrowRight } from 'lucide-react';

interface IndustriesSectionProps {
  onStartProject?: () => void;
}

export function IndustriesSection({ onStartProject }: IndustriesSectionProps) {
  const industries = [
    {
      title: 'Healthcare & Dental',
      subtitle: 'Clinics, dentists, specialists & wellness practices',
      description: 'Websites that highlight clinician qualifications, organize treatments without medical jargon, and make appointment booking immediate.',
      icon: Stethoscope,
      accent: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Real Estate',
      subtitle: 'Brokers, developers & residential portfolios',
      description: 'High-contrast spatial layouts designed to showcase property listings, architectural specifications, and direct broker contact.',
      icon: Building2,
      accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Professional Services',
      subtitle: 'Legal consultancies, chartered accountants & advisory firms',
      description: 'Understated, authoritative websites that communicate competence, practice specializations, and clear consultation pathways.',
      icon: Briefcase,
      accent: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Education',
      subtitle: 'Academies, learning centers & specialized institutes',
      description: 'Structured websites presenting course curriculums, educator credentials, and student admission inquiries with zero clutter.',
      icon: GraduationCap,
      accent: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Architecture & Interior Design',
      subtitle: 'Ateliers, lighting designers & interior studios',
      description: 'Tactile, editorial lookbooks highlighting materials, room collections, and custom architectural inquiries on mobile screens.',
      icon: Compass,
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Hospitality',
      subtitle: 'Boutique cafes, artisanal bakeries & culinary venues',
      description: 'Zero-PDF mobile menus, neighborhood directions, operating schedules, and table reservations that load in under 1 second.',
      icon: Utensils,
      accent: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'Growing Businesses',
      subtitle: 'Early-stage founders, B2B services & modern brands',
      description: 'Fast, high-converting websites designed to explain a new offer clearly, validate market demand, and generate qualified leads.',
      icon: TrendingUp,
      accent: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
  ];

  return (
    <section id="industries" className="py-20 sm:py-28 border-b border-[#E5E2D9] dark:border-white/[0.08] bg-[#FAF9F5] dark:bg-[#09090D] relative transition-colors duration-150">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14 sm:mb-16 pb-6 border-b border-[#E5E2D9] dark:border-white/[0.08]">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#52525B] dark:text-[#A1A1AA] block mb-2">
              Who We Build For
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#090A0D] dark:text-white">
              Websites designed for businesses in…
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#A1A1AA] max-w-sm sm:text-right leading-relaxed font-normal">
            Every industry has distinct trust markers and customer decision points. We tailor the architecture to match how your buyers choose.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-[#FFFFFF] dark:bg-[#121218] border border-[#E5E2D9] dark:border-white/[0.08] hover:border-[#0047AB] dark:hover:border-white/20 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${ind.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-[#6B7280] dark:text-[#71717A] uppercase tracking-wider">
                      Sector 0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#18181B] dark:text-white tracking-tight mb-1 group-hover:text-[#0047AB] dark:group-hover:text-blue-400 transition-colors">
                      {ind.title}
                    </h3>
                    <p className="text-xs font-mono text-[#6B7280] dark:text-[#71717A] mb-2.5">
                      {ind.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#D4D4D8] leading-relaxed">
                      {ind.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E5E2D9] dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#52525B] dark:text-[#A1A1AA]">
                    Bespoke Architecture
                  </span>
                  <span className="text-xs text-[#0047AB] dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Inquire</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-white/[0.02] border border-[#E5E2D9] dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Don’t see your exact industry listed?</h4>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA] mt-0.5">
              If your business relies on authority, clear communication, and customer trust, we can help.
            </p>
          </div>
          {onStartProject && (
            <button
              onClick={onStartProject}
              className="glass-btn-primary px-6 py-2.5 text-xs uppercase tracking-wider text-white font-bold rounded-full shrink-0"
            >
              Discuss Your Project
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
