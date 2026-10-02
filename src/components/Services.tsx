import { ArrowRight } from 'lucide-react';

interface ServicesProps {
  onStartProject: () => void;
}

export function Services({ onStartProject }: ServicesProps) {
  const services = [
    {
      number: '01',
      title: 'Business Websites',
      description: 'Clear, responsive websites that explain your business and turn visitors into enquiries.',
      idealFor: 'Local clinics, professional practices, artisan studios & service firms.',
    },
    {
      number: '02',
      title: 'Landing Pages',
      description: 'Focused pages for a launch, offer, booking campaign or WhatsApp enquiries.',
      idealFor: 'Product launches, marketing campaigns, event venues & direct campaigns.',
    },
    {
      number: '03',
      title: 'Website Redesigns',
      description: 'Cleaner structure, stronger messaging and a better mobile experience.',
      idealFor: 'Existing websites that load slowly, look cluttered, or fail to convert on phones.',
    },
  ];

  return (
    <section id="services" className="py-24 sm:py-32 border-b border-[#E7E2DA] dark:border-[#27272A] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="max-w-xl mb-16">
          <span className="text-xs uppercase tracking-wider text-[#6B6661] dark:text-[#A1A1AA] font-bold block mb-2 font-mono">
            Scope
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#121212] dark:text-white">
            What we build
          </h2>
        </div>

        {/* Three clean cards — typography-led */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.number}
              className="bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] p-8 sm:p-9 flex flex-col justify-between hover:border-[#121212] dark:hover:border-white transition-colors shadow-sm"
            >
              <div>
                {/* Number indicator */}
                <div className="text-sm font-mono font-black text-[#0047AB] dark:text-[#3B82F6] tracking-widest mb-8">
                  {service.number}
                </div>

                {/* Service Title */}
                <h3 className="text-2xl font-black tracking-tight text-[#121212] dark:text-white mb-4">
                  {service.title}
                </h3>

                {/* Exact Description */}
                <p className="text-base text-[#4A4641] dark:text-[#D4D4D8] leading-relaxed font-medium mb-8">
                  {service.description}
                </p>
              </div>

              {/* Subdued detail note */}
              <div className="pt-6 border-t border-[#F0EBE1] dark:border-[#27272A] text-xs text-[#736E66] dark:text-[#A1A1AA]">
                <span className="font-bold text-[#121212] dark:text-white block mb-1">Tailored for:</span>
                <span>{service.idealFor}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quiet prompt with glassmorphic CTA */}
        <div className="mt-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-[#F5F2EB] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] transition-colors">
          <span className="text-sm font-semibold text-[#4A4641] dark:text-[#D4D4D8]">
            Unsure which format fits your business model best?
          </span>
          <button
            onClick={onStartProject}
            className="glass-btn px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0047AB] dark:text-[#3B82F6]"
          >
            Ask us for a recommendation →
          </button>
        </div>
      </div>
    </section>
  );
}
