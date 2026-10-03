import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ShieldCheck, Quote, CheckCircle2 } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface TestimonialsProps {
  onOpenRateModal?: () => void;
}

export function Testimonials({ onOpenRateModal }: TestimonialsProps) {
  const { content } = useSiteContent();
  const section = content.sections.testimonials;
  const testimonials = (content.testimonials || []).filter((t) => t.enabled !== false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto rotate when more than 1 testimonial exists
  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  if (testimonials.length === 0) {
    return (
      <section className="py-16 zone-testimonials border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="section-kicker text-[var(--testimonials-accent)]">Verified Client Trust</span>
          <h3 className="text-xl font-bold text-white">Trust is built on real outcomes</h3>
          <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
            Reviews on AS Studio are 100% verified from actual client engagements. Have you completed a sprint with us?
          </p>
          {onOpenRateModal && (
            <button
              onClick={onOpenRateModal}
              className="glass-btn px-6 py-2.5 text-xs uppercase tracking-wider text-white"
            >
              Submit Client Feedback
            </button>
          )}
        </div>
      </section>
    );
  }

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-20 sm:py-28 zone-testimonials border-b border-white/[0.08] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-xl">
            <span className="section-kicker text-[var(--testimonials-accent)]">
              {section.eyebrow || 'Verified Client Outcomes'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2">
              {section.title || 'Real results from independent practices.'}
            </h2>
            <p className="text-xs sm:text-sm text-[#D4D4D8]">
              {section.description || 'Every engagement is backed by live phone staging and 100% source code ownership.'}
            </p>
          </div>

          {/* Navigation Arrows */}
          {testimonials.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 rounded-full glass-btn p-0 text-white flex items-center justify-center hover:border-white/30"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-[#A1A1AA] px-2">
                {currentIndex + 1} / {testimonials.length}
              </span>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
                className="w-10 h-10 rounded-full glass-btn p-0 text-white flex items-center justify-center hover:border-white/30"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Featured Testimonial Hero Showcase */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="glass-card p-8 sm:p-12 relative"
          style={{
            '--accent': 'var(--testimonials-accent)',
          } as React.CSSProperties}
        >
          <Quote className="absolute top-6 right-6 w-16 h-16 text-white/[0.04] pointer-events-none" />

          <div className="space-y-6 max-w-4xl">
            {/* Star Rating & Verified Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: current.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              {current.verified && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Verified Client Engagement</span>
                </span>
              )}
              {current.serviceType && (
                <span className="text-xs text-[#A1A1AA] font-mono">
                  · {current.serviceType}
                </span>
              )}
            </div>

            {/* Testimonial Quote */}
            <blockquote className="text-lg sm:text-2xl text-white font-medium leading-relaxed">
              "{current.quote}"
            </blockquote>

            {/* Measurable Business Outcome Pill */}
            {current.outcome && (
              <div className="inline-flex items-center gap-2 p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-emerald-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Outcome: {current.outcome}</span>
              </div>
            )}

            {/* Author Credit */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-base font-bold text-white">{current.clientName}</div>
                <div className="text-xs text-[#A1A1AA]">
                  {current.role} · <span className="text-white font-medium">{current.businessName}</span>
                </div>
              </div>

              {onOpenRateModal && (
                <button
                  onClick={onOpenRateModal}
                  className="text-xs text-[#A1A1AA] hover:text-white transition-colors underline font-mono text-left sm:text-right"
                >
                  Verify engagement integrity →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Client Logos / Engagement Indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#71717A] px-2">
          <span>APEX DENTAL CARE</span>
          <span>MITTI ARTISAN CAFÉ</span>
          <span>AURA LIVING ATELIER</span>
          <span>100% CLIENT CODE OWNERSHIP GUARANTEED</span>
        </div>

      </div>
    </section>
  );
}
