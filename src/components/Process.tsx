import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface ProcessProps {
  onStartProject?: () => void;
}

export function Process({ onStartProject }: ProcessProps) {
  const { content } = useSiteContent();
  const section = content.sections.process;
  const steps = (content.processSteps || []).filter((s) => s.enabled !== false);

  return (
    <section id="process" className="py-20 sm:py-28 zone-process border-b border-white/[0.08] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-14 sm:mb-16">
          <span className="section-kicker text-[var(--process-accent)]">
            {section.eyebrow || 'The Studio Methodology'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            {section.title || 'A transparent path from brief to launch.'}
          </h2>
          <p className="text-sm sm:text-base text-[#D4D4D8] leading-relaxed">
            {section.description || 'Six connected phases with live phone staging, visible progress, and zero mystery pricing.'}
          </p>
        </div>

        {/* Connected Process Roadmap */}
        <div className="relative">
          {/* Subtle connecting vertical line on desktop */}
          <div className="hidden lg:block absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-[var(--process-accent)]/40 via-white/10 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((item, index) => (
              <div
                key={item.id || item.step || index}
                className="glass-card p-6 sm:p-7 flex flex-col justify-between group"
                style={{
                  '--accent': 'var(--process-accent)',
                } as React.CSSProperties}
              >
                <div className="space-y-4">
                  {/* Step Badge & Duration */}
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-[var(--process-accent)]/15 border border-[var(--process-accent)]/30 text-[var(--process-accent)] font-mono font-black text-xs flex items-center justify-center">
                      {item.step || `0${index + 1}`}
                    </span>
                    {item.duration && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#A1A1AA] bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.08]">
                        <Clock className="w-3 h-3 text-[var(--process-accent)]" />
                        <span>{item.duration}</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#D4D4D8] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Detailed methodology explanation */}
                  {item.details && (
                    <p className="text-xs text-[#A1A1AA] leading-relaxed border-t border-white/[0.08] pt-3">
                      {item.details}
                    </p>
                  )}

                  {/* Deliverables Checklist */}
                  {item.deliverables && item.deliverables.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] block">Deliverables</span>
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

                <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#A1A1AA]">
                  <span className="font-mono uppercase tracking-wider">Phase {index + 1} of {steps.length}</span>
                  <span className="text-emerald-400 font-bold">● Guaranteed QA</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">Live Phone Staging Before Final Payment</h4>
            <p className="text-xs text-[#A1A1AA]">
              You test the actual production website directly on your personal phone before public domain launch.
            </p>
          </div>
          {onStartProject && (
            <button
              onClick={onStartProject}
              className="glass-btn-primary px-6 py-2.5 text-xs uppercase tracking-wider text-white shrink-0"
            >
              <span>Book Your Sprint</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
