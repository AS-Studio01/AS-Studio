/**
 * SELECTED WORK SECTION
 * ==============================================================================
 * Touch-optimized showcase with fluid swipe gestures, snap physics, slide indicators,
 * and chevron controls on mobile/tablet viewports, with 3-column grid on desktop.
 * ==============================================================================
 */

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Eye, ChevronLeft, ChevronRight, Hand } from 'lucide-react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { ProjectVisual } from './ProjectVisual';
import { ProjectCardSkeleton } from './ProjectCardSkeleton';

interface SelectedWorkProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export function SelectedWork({ projects, onSelectProject }: SelectedWorkProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Track active swipe position on touch/tablet
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    if (clientWidth === 0) return;
    const newIndex = Math.round(scrollLeft / (clientWidth * 0.85));
    setActiveSlide(Math.min(Math.max(0, newIndex), projects.length - 1));
  };

  const scrollToSlide = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cards = container.querySelectorAll<HTMLElement>('[data-project-card]');
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setActiveSlide(index);
    }
  };

  return (
    <section id="work" className="py-20 sm:py-28 lg:py-32 border-b border-[#E7E2DA] dark:border-[#27272A] transition-colors duration-300 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section Heading & Mobile Swipe Helper */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-[#E7E2DA] dark:border-[#27272A] gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#6B6661] dark:text-[#A1A1AA] font-bold block mb-2 font-mono">
              Selected Projects
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#121212] dark:text-white">
              Selected work
            </h2>
          </div>
          
          <div className="flex flex-col sm:items-end gap-2">
            <p className="text-sm font-medium text-[#6B6661] dark:text-[#A1A1AA] max-w-sm sm:text-right">
              Modern websites designed for clinics, real estate, architecture ateliers, and growing companies.
            </p>

            {/* Touch Swipe Navigator (Visible on Mobile & Tablet < lg) */}
            <div className="flex lg:hidden items-center gap-3 pt-2">
              <span className="text-[11px] font-mono text-[#71717A] flex items-center gap-1.5">
                <Hand className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Swipe cards ({activeSlide + 1} of {projects.length})</span>
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => scrollToSlide(Math.max(0, activeSlide - 1))}
                  disabled={activeSlide === 0}
                  className="p-1.5 rounded-lg border border-white/10 text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5"
                  aria-label="Previous card"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToSlide(Math.min(projects.length - 1, activeSlide + 1))}
                  disabled={activeSlide === projects.length - 1}
                  className="p-1.5 rounded-lg border border-white/10 text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5"
                  aria-label="Next card"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Touch-Optimized Swipable Project Cards Track */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex lg:grid lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-none pb-6 -mx-5 px-5 sm:-mx-8 sm:px-8 touch-pan-x"
        >
          {isLoading ? (
            <>
              <div className="w-[85vw] sm:w-[70vw] md:w-[50vw] lg:w-auto shrink-0 lg:shrink">
                <ProjectCardSkeleton variant="grid" />
              </div>
              <div className="w-[85vw] sm:w-[70vw] md:w-[50vw] lg:w-auto shrink-0 lg:shrink">
                <ProjectCardSkeleton variant="grid" />
              </div>
              <div className="w-[85vw] sm:w-[70vw] md:w-[50vw] lg:w-auto shrink-0 lg:shrink">
                <ProjectCardSkeleton variant="grid" />
              </div>
            </>
          ) : (
            projects.map((project, idx) => (
              <motion.article
                key={project.id}
                data-project-card
                whileTap={{ scale: 0.985 }}
                className={`w-[85vw] sm:w-[68vw] md:w-[48vw] lg:w-auto shrink-0 lg:shrink snap-center bg-white/80 dark:bg-[#18181B]/80 border flex flex-col justify-between transition-all shadow-sm hover:shadow-md select-none ${
                  activeSlide === idx 
                    ? 'border-[#3B82F6]/60 dark:border-[#3B82F6]/70 ring-1 ring-[#3B82F6]/30' 
                    : 'border-[#DDD7CD] dark:border-[#27272A] hover:border-[#121212] dark:hover:border-white'
                }`}
              >
                <div>
                  {/* Visual preview */}
                  <ProjectVisual
                    projectId={project.id}
                    name={project.name}
                    imageUrl={project.imageUrl}
                    category={project.category}
                    accentColor={project.accentColor}
                    badge={project.badge}
                  />

                  {/* Card Content */}
                  <div className="p-6 sm:p-7 space-y-4">
                    {/* Category & Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs text-[#6B6661] dark:text-[#A1A1AA] font-semibold tracking-wide">
                        {project.category}
                      </span>

                      {project.isConcept ? (
                        <span className="border border-[#0047AB] dark:border-[#3B82F6] bg-[#F0F5FF] dark:bg-[#1E293B] text-[#0047AB] dark:text-[#60A5FA] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          {project.badge}
                        </span>
                      ) : (
                        <span className="border border-[#DDD7CD] dark:border-[#3F3F46] bg-[#F5F2EB] dark:bg-[#27272A] text-[#4A4641] dark:text-[#D4D4D8] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          {project.badge}
                        </span>
                      )}
                    </div>

                    {/* Project Name */}
                    <h3 className="text-2xl font-black tracking-tight text-[#121212] dark:text-white">
                      {project.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#4A4641] dark:text-[#D4D4D8] leading-relaxed font-medium">
                      {project.description}
                    </p>

                    {/* Tags */}
                    {project.tags && (
                      <div className="pt-1 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-[#FAF8F5] dark:bg-[#27272A] border border-[#E7E2DA] dark:border-[#3F3F46] text-[10px] font-semibold text-[#55514B] dark:text-[#A1A1AA]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button (Glassmorphic) */}
                <div className="p-6 sm:p-7 pt-0">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="glass-btn w-full inline-flex items-center justify-between px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0047AB]"
                  >
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#0047AB] dark:text-[#3B82F6]" />
                      <span>{project.buttonText}</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.article>
            ))
          )}
        </div>

        {/* Tactile Pagination Indicators (Mobile & Tablet) */}
        <div className="flex lg:hidden items-center justify-center gap-2 pt-2">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeSlide === idx
                  ? 'w-8 bg-[#3B82F6]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
