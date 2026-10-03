import { ArrowRight, Layout, Zap, Sparkles, Coffee, Armchair, Stethoscope, Globe, Code, Check } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { ServiceItem } from '../types';

interface ServicesProps {
  onStartProject: () => void;
}

export function Services({ onStartProject }: ServicesProps) {
  const { content } = useSiteContent();
  const section = content.sections.services;
  const services = (content.services || []).filter((s) => s.enabled !== false);

  // Helper icon mapper
  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'sparkles': return <Sparkles className="w-5 h-5 text-emerald-400" />;
      case 'coffee': return <Coffee className="w-5 h-5 text-amber-500" />;
      case 'armchair': return <Armchair className="w-5 h-5 text-indigo-400" />;
      case 'stethoscope': return <Stethoscope className="w-5 h-5 text-cyan-400" />;
      case 'globe': return <Globe className="w-5 h-5 text-blue-400" />;
      case 'code': return <Code className="w-5 h-5 text-purple-400" />;
      case 'layout':
      default:
        return <Layout className="w-5 h-5 text-[var(--services-accent)]" />;
    }
  };

  return (
    <section id="services" className="py-20 sm:py-28 zone-services border-b border-white/[0.08] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-14 sm:mb-16">
          <span className="section-kicker text-[var(--services-accent)]">
            {section.eyebrow || 'Capabilities & Scope'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            {section.title || 'Built around the moment your customer decides.'}
          </h2>
          <p className="text-sm sm:text-base text-[#D4D4D8] leading-relaxed">
            {section.description || 'Every service is engineered to make your offer clearer, your credibility undeniable, and the next step effortless.'}
          </p>
        </div>

        {/* Dynamic Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const cardAccent = service.accentColor || 'var(--services-accent)';
            return (
              <div
                key={service.id || index}
                className="glass-card p-7 sm:p-8 flex flex-col justify-between group"
                style={{
                  '--accent': cardAccent,
                } as React.CSSProperties}
              >
                <div className="space-y-6">
                  {/* Top Bar: Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black tracking-widest text-[#71717A] group-hover:text-white transition-colors">
                      {service.number || `0${index + 1}`}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                      {renderIcon(service.icon)}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#D4D4D8] leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Ideal For Note */}
                  {service.idealFor && (
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-[#A1A1AA]">
                      <span className="font-bold text-white block mb-0.5 font-mono text-[10px] uppercase tracking-wider">Ideal For</span>
                      <span>{service.idealFor}</span>
                    </div>
                  )}

                  {/* Feature Bullets */}
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2 pt-2 border-t border-white/[0.08]">
                      {service.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-xs text-[#D4D4D8]">
                          <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Bottom CTA Pill */}
                <div className="pt-6 mt-6 border-t border-white/[0.08]">
                  <button
                    onClick={onStartProject}
                    className="w-full glass-btn py-3 text-xs uppercase tracking-wider text-white group-hover:border-white/30 transition-all justify-between px-5"
                  >
                    <span>{service.ctaText || 'Start a project'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)] group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
