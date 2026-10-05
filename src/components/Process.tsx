import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface ProcessProps {
  onStartProject?: () => void;
}

export function Process({ onStartProject }: ProcessProps) {
  const { content } = useSiteContent();
  const section = content.sections.process;
  const steps = (content.processSteps || []).filter((s) => s.enabled !== false);

  return (
    <section id="process" className="py-20 sm:py-28 border-b border-white/[0.08] bg-[#0A0A0E] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-2">
            {section.eyebrow || 'Our Process'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            {section.title || 'A disciplined, transparent path from brief to launch.'}
          </h2>
          <p className="text-sm sm:text-base text-[#D4D4D8] leading-relaxed">
            {section.description || 'Four connected phases with live phone staging, complete code handover, and post-launch support.'}
          </p>
        </div>

        {/* 4-Step Formal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <div
              key={item.id || item.step || index}
              className="p-6 sm:p-7 rounded-2xl bg-[#121218] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Step Index Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                    {item.step || `0${index + 1}`}
                  </span>
                  <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider">
                    Phase 0{index + 1}
                  </span>
                </div>

                {/* Step Title & Summary */}
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D4D4D8] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Detailed breakdown */}
                {item.details && (
                  <p className="text-xs text-[#A1A1AA] leading-relaxed pt-3 border-t border-white/[0.06]">
                    {item.details}
                  </p>
                )}

                {/* Deliverables */}
                {item.deliverables && item.deliverables.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] block font-bold">
                      Deliverables
                    </span>
                    <div className="space-y-1">
                      {item.deliverables.map((del, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-1.5 text-[11px] text-[#E4E4E7]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
                <span>Phase {index + 1} of {steps.length}</span>
                <span className="text-emerald-400 font-medium">Verified Handover</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Delivery Reassurance Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">Live Phone Staging Prior to Final Payment</h4>
            <p className="text-xs text-[#A1A1AA]">
              You test the actual production website directly on your personal phone before public domain launch. Typical projects launch within 1–3 weeks.
            </p>
          </div>
          {onStartProject && (
            <button
              onClick={onStartProject}
              className="glass-btn-primary px-6 py-2.5 text-xs uppercase tracking-wider text-white font-bold rounded-full shrink-0 shadow-md"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
}

