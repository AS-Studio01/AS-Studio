import { ArrowRight, Layout, Code, Sparkles, Zap, Globe, Shield, Check } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { ServiceItem } from '../types';

interface ServicesProps {
  onStartProject: () => void;
}

export function Services({ onStartProject }: ServicesProps) {
  const { content } = useSiteContent();
  const section = content.sections.services;
  const services = (content.services || []).filter((s) => s.enabled !== false);

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'code': return <Code className="w-5 h-5 text-cyan-400" />;
      case 'sparkles': return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'zap': return <Zap className="w-5 h-5 text-emerald-400" />;
      case 'globe': return <Globe className="w-5 h-5 text-purple-400" />;
      case 'shield': return <Shield className="w-5 h-5 text-amber-400" />;
      case 'layout':
      default:
        return <Layout className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <section id="services" className="py-20 sm:py-28 border-b border-white/[0.08] bg-[#09090D] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-2">
            {section.eyebrow || 'Capabilities & Offerings'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            {section.title || 'Strategy, design and development in one focused process.'}
          </h2>
          <p className="text-sm sm:text-base text-[#D4D4D8] leading-relaxed">
            {section.description || 'Every service is built to solve a concrete business problem, establish authority, and make your business easier to choose.'}
          </p>
        </div>

        {/* Dynamic Services Cards Grid (2x3 or 3x2 on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            return (
              <div
                key={service.id || index}
                className="p-7 sm:p-8 rounded-2xl bg-[#121218] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-5">
                  {/* Top Bar: Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold tracking-widest text-[#71717A] group-hover:text-white transition-colors">
                      SERVICE {service.number || `0${index + 1}`}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                      {renderIcon(service.icon)}
                    </div>
                  </div>

                  {/* Title & Core Description */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#D4D4D8] leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Problem Solved */}
                  {service.problemSolved && (
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block font-bold">
                        Problem It Solves
                      </span>
                      <p className="text-xs text-[#A1A1AA] leading-relaxed">
                        {service.problemSolved}
                      </p>
                    </div>
                  )}

                  {/* Who It Is For */}
                  {service.idealFor && (
                    <div className="text-xs text-[#A1A1AA] space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] block font-bold">
                        Who It Is For
                      </span>
                      <p className="text-xs text-[#D4D4D8] leading-relaxed">
                        {service.idealFor}
                      </p>
                    </div>
                  )}

                  {/* What It Includes Checklist */}
                  {service.whatItIncludes && service.whatItIncludes.length > 0 ? (
                    <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] block font-bold">
                        What It Includes
                      </span>
                      <ul className="space-y-1.5">
                        {service.whatItIncludes.map((item, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2 text-xs text-[#D4D4D8]">
                            <Check className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : service.features && service.features.length > 0 ? (
                    <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] block font-bold">
                        Key Deliverables
                      </span>
                      <ul className="space-y-1.5">
                        {service.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2 text-xs text-[#D4D4D8]">
                            <Check className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                {/* Bottom CTA Pill */}
                <div className="pt-6 mt-6 border-t border-white/[0.08]">
                  <button
                    onClick={onStartProject}
                    className="w-full glass-btn py-3 text-xs uppercase tracking-wider text-white font-bold group-hover:border-white/30 transition-all justify-between px-5 rounded-full flex items-center"
                  >
                    <span>{service.ctaText || 'Start a Project'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-1 transition-transform" />
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

