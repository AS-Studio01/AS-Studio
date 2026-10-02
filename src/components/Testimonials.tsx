/**
 * CLIENT TESTIMONIALS & VERIFIED REVIEWS COMPONENT
 * ==============================================================================
 * Displays ONLY 100% verified reviews from actual paying clients who commissioned
 * an AS Studio project.
 * By default, this section remains completely invisible until verified reviews
 * are submitted and approved, or enabled via the Secret Admin Panel.
 * ==============================================================================
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle2, Star, Sparkles, ShieldCheck } from 'lucide-react';
import { 
  getVerifiedReviews, 
  getReviewsVisibilitySetting, 
  VerifiedReviewRecord 
} from '../services/database';

interface TestimonialsProps {
  onOpenRateModal?: () => void;
}

export function Testimonials({ onOpenRateModal }: TestimonialsProps) {
  const [reviews, setReviews] = useState<VerifiedReviewRecord[]>([]);
  const [isVisibleOnSite, setIsVisibleOnSite] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    async function loadData() {
      const isVisible = await getReviewsVisibilitySetting();
      setIsVisibleOnSite(isVisible);

      const list = await getVerifiedReviews(true);
      setReviews(list);
    }
    loadData();
  }, []);

  // Auto-rotation when reviews exist and section is active
  useEffect(() => {
    if (isPaused || reviews.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [isPaused, reviews.length]);

  // CRITICAL RULE: If admin has not enabled visibility OR there are no approved reviews,
  // keep this section completely invisible so zero fake or unverified ratings appear!
  if (!isVisibleOnSite || reviews.length === 0) {
    return null;
  }

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const active = reviews[currentIndex];

  return (
    <section 
      aria-label="Verified Client Reviews and Ratings" 
      className="py-20 sm:py-24 border-b border-[#E7E2DA] dark:border-[#27272A] bg-[#F5F2EB] dark:bg-[#121215] transition-colors duration-300 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#0047AB] dark:text-[#3B82F6] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Client Reviews</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#121212] dark:text-white">
              Real client ratings. 100% verified.
            </h2>
          </div>

          {/* Navigation Controls & Client Rate Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            {onOpenRateModal && (
              <button
                onClick={onOpenRateModal}
                className="glass-btn px-3 py-1.5 text-xs font-mono font-bold text-[#0047AB] dark:text-[#60A5FA] flex items-center gap-1.5 rounded-lg border border-[#0047AB]/20 hover:border-[#0047AB]"
                title="Only paying clients can rate"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Rate Your Project</span>
              </button>
            )}

            {reviews.length > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-lg border border-[#DDD7CD] dark:border-white/10 bg-white dark:bg-[#18181D] hover:bg-slate-100 dark:hover:bg-white/10 text-[#121212] dark:text-white transition-all shadow-sm active:scale-95"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="font-mono text-xs text-[#736E66] dark:text-[#A1A1AA] px-1.5">
                  {currentIndex + 1} / {reviews.length}
                </span>

                <button
                  onClick={handleNext}
                  className="p-2 rounded-lg border border-[#DDD7CD] dark:border-white/10 bg-white dark:bg-[#18181D] hover:bg-slate-100 dark:hover:bg-white/10 text-[#121212] dark:text-white transition-all shadow-sm active:scale-95"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Animated Carousel Card */}
        <div className="relative min-h-[260px] sm:min-h-[220px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/95 dark:bg-[#18181D]/90 border border-[#DDD7CD] dark:border-[#27272A] p-6 sm:p-9 md:p-10 rounded-2xl shadow-sm backdrop-blur-md relative"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-4 max-w-3xl">
                  {/* Rating Stars & Verified Pill */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(active.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Commissioned Client</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#736E66] dark:text-[#A1A1AA]">
                      {active.category}
                    </span>
                  </div>

                  {/* Quote Body */}
                  <p className="text-base sm:text-lg md:text-xl font-medium text-[#1E1B18] dark:text-[#F4F4F6] leading-relaxed">
                    “{active.quote}”
                  </p>

                  {/* Author Meta */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
                    <span className="font-extrabold text-[#121212] dark:text-white text-sm">
                      {active.clientName}
                    </span>
                    <span className="hidden sm:inline text-[#DDD7CD] dark:text-[#333338]">·</span>
                    <span className="text-[#55514B] dark:text-[#A1A1AA] font-medium">
                      <span className="font-bold text-[#121212] dark:text-white">{active.businessName}</span>
                    </span>
                  </div>
                </div>

                {/* Outcome Callout Pill */}
                {active.verifiedMetric && (
                  <div className="w-full md:w-auto p-4 sm:p-5 bg-[#FAF8F5] dark:bg-[#0E0E10] border border-[#E7E2DA] dark:border-[#27272A] rounded-xl shrink-0 flex flex-col items-start md:items-end justify-center space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#736E66] dark:text-[#A1A1AA]">
                      Verified Outcome
                    </span>
                    <span className="text-base sm:text-lg font-black text-[#0047AB] dark:text-[#60A5FA]">
                      {active.verifiedMetric}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-500">
                      Commission Verified
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicator Progress Dots */}
        {reviews.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {reviews.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 transition-all rounded-full ${
                  idx === currentIndex
                    ? 'w-8 bg-[#0047AB] dark:bg-[#3B82F6]'
                    : 'w-2 bg-[#DDD7CD] dark:bg-white/20 hover:bg-[#A1A1AA]'
                }`}
                aria-label={`Jump to review ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
