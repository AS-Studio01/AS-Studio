import { useState, useEffect } from 'react';
import { ArrowRight, Check, ShieldAlert, ShieldCheck, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { Project, PageType } from '../types';
import { ProjectVisual } from '../components/ProjectVisual';
import { ProjectCardSkeleton } from '../components/ProjectCardSkeleton';
import { PerformanceStats } from '../components/PerformanceStats';

interface WorkPageProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNavigate: (page: PageType) => void;
}

export function WorkPage({ projects, onSelectProject, onNavigate }: WorkPageProps) {
  const [filter, setFilter] = useState<'all' | 'residences' | 'atelier' | 'clinic'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [filter]);

  const filteredProjects = projects.filter((project) => {
    if (filter === 'all') return true;
    if (filter === 'residences') return project.id === 'apex-residences';
    if (filter === 'atelier') return project.id === 'atelier-north';
    if (filter === 'clinic') return project.id === 'nova-dental-care';
    return true;
  });

  return (
    <div className="py-16 sm:py-24 fade-in">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#736E66] dark:text-[#A1A1AA] font-medium">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#121212] dark:hover:text-white transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-[#121212] dark:text-white font-bold">Selected Work</span>
        </div>

        {/* Page Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#6B6661] dark:text-[#A1A1AA] font-bold font-mono">
            <span>Portfolio</span>
            <span className="text-[#999288] dark:text-[#52525B]">·</span>
            <span className="text-[#0047AB] dark:text-[#3B82F6]">Selected Work & Case Studies</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#121212] dark:text-white leading-[1.08]">
            Websites engineered for clarity, speed, and real conversions.
          </h1>
          <p className="text-base sm:text-xl text-[#3E3B37] dark:text-[#D4D4D8] leading-relaxed font-medium">
            Every project starts from a blank canvas. We strip away heavy scripts, awkward mobile navigation, and generic agency fluff to make your business easier to choose.
          </p>
        </div>

        {/* Interactive Filter Controls (Pill Rounded) */}
        <div className="mb-10 flex flex-wrap items-center gap-2.5 border-b border-[#E5E2D9] dark:border-white/10 pb-5">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-full ${
              filter === 'all'
                ? 'bg-[#0047AB] dark:bg-[var(--accent)] text-white shadow-md'
                : 'glass-btn text-[#52525B] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white'
            }`}
          >
            All Work ({projects.length})
          </button>
          <button
            onClick={() => setFilter('residences')}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-full ${
              filter === 'residences'
                ? 'bg-[#0047AB] dark:bg-[var(--accent)] text-white shadow-md'
                : 'glass-btn text-[#52525B] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white'
            }`}
          >
            Apex Residences
          </button>
          <button
            onClick={() => setFilter('atelier')}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-full ${
              filter === 'atelier'
                ? 'bg-[#0047AB] dark:bg-[var(--accent)] text-white shadow-md'
                : 'glass-btn text-[#52525B] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white'
            }`}
          >
            Atelier North
          </button>
          <button
            onClick={() => setFilter('clinic')}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-full ${
              filter === 'clinic'
                ? 'bg-[#0047AB] dark:bg-[var(--accent)] text-white shadow-md'
                : 'glass-btn text-[#52525B] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-white'
            }`}
          >
            Nova Dental Care
          </button>
        </div>

        {/* Highlighted Metrics Strip */}
        <div className="mb-14 p-6 sm:p-8 bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] grid grid-cols-2 md:grid-cols-4 gap-6 text-[#121212] dark:text-white backdrop-blur-sm">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-bold font-mono">Standard</span>
            <span className="text-2xl font-black tracking-tight block mt-1">Mobile-First</span>
            <span className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA]">Designed for phones first</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-bold font-mono">Loading Speed</span>
            <span className="text-2xl font-black tracking-tight block mt-1">Lean by design</span>
            <span className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA]">Performance reviewed before launch</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-bold font-mono">Source Code</span>
            <span className="text-2xl font-black tracking-tight block mt-1">100% Yours</span>
            <span className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA]">Full ownership, zero lock-in</span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#736E66] dark:text-[#A1A1AA] block font-bold font-mono">Concept Ethics</span>
            <span className="text-2xl font-black tracking-tight block mt-1 text-[#0047AB] dark:text-[#3B82F6]">Honest Badges</span>
            <span className="text-xs font-medium text-[#6B6661] dark:text-[#A1A1AA]">Transparent distinction</span>
          </div>
        </div>

        {/* Concept Notice Box */}
        <div className="mb-14 p-5 bg-[#F5F2EB] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-[#0047AB] dark:text-[#3B82F6] shrink-0 mt-0.5" />
          <div className="text-xs text-[#4A4641] dark:text-[#D4D4D8] leading-relaxed">
            <span className="font-bold text-[#121212] dark:text-white block mb-0.5">
              Transparency & Project Classification Notice
            </span>
            All featured projects currently shown are <strong>Studio Concepts</strong> — self-initiated digital design prototypes and architectural case studies developed by AS Studio to showcase real-world performance, responsive workflows, and clean conversion paths. We distinguish studio design concepts from active client commissions with absolute transparency.
          </div>
        </div>

        {/* Selected Work List (or Skeletons) */}
        <div className="space-y-16">
          {isLoading ? (
            <>
              <ProjectCardSkeleton variant="detailed" />
              <ProjectCardSkeleton variant="detailed" />
            </>
          ) : (
            filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                whileTap={{ scale: 0.992 }}
                className="bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] grid grid-cols-1 lg:grid-cols-12 overflow-hidden hover:border-[#121212] dark:hover:border-white transition-colors shadow-sm fade-in select-none"
              >
                {/* Visual Preview */}
                <div className="lg:col-span-7 bg-[#F4F1EA] dark:bg-[#141416] border-b lg:border-b-0 lg:border-r border-[#DDD7CD] dark:border-[#27272A] flex items-center">
                  <ProjectVisual projectId={project.id} name={project.name} />
                </div>

                {/* Text & Specs */}
                <div className="lg:col-span-5 p-7 sm:p-9 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    {/* Category & Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs uppercase tracking-wider text-[#6B6661] dark:text-[#A1A1AA] font-mono font-bold">
                        0{index + 1} / {project.category}
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

                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121212] dark:text-white">
                      {project.name}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-[#4A4641] dark:text-[#D4D4D8] leading-relaxed font-medium">
                      {project.description}
                    </p>

                    {/* Tags */}
                    {project.tags && (
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-[#FAF8F5] dark:bg-[#27272A] border border-[#E7E2DA] dark:border-[#3F3F46] text-[11px] font-semibold text-[#55514B] dark:text-[#A1A1AA]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Key Highlights list */}
                    <div className="pt-3 border-t border-[#F0EBE1] dark:border-[#27272A] space-y-1.5 text-xs text-[#57534E] dark:text-[#A1A1AA]">
                      {project.conceptDetails.keyDeliverables.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#0047AB] dark:text-[#3B82F6] shrink-0" />
                          <span className="font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="pt-4 border-t border-[#F0EBE1] dark:border-[#27272A] flex items-center justify-between">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="glass-btn inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0047AB]"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#0047AB] dark:text-[#3B82F6]" />
                      <span>{project.buttonText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-[11px] text-[#8C857B] dark:text-[#71717A] font-mono font-bold">
                      {project.turnaround}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>

        {/* Dynamic Performance Stats & Google Lighthouse Speed Scores Section */}
        <PerformanceStats 
          projects={projects}
          onSelectProject={onSelectProject}
        />

        {/* Client Security & Protection Guarantee Box */}
        <div className="mt-16 p-8 bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] space-y-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2.5 text-[#0047AB] dark:text-[#3B82F6]">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs uppercase font-bold tracking-wider font-mono">
              Client Security & Ownership Guarantee
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#121212] dark:text-white">
            You own 100% of your website. No ongoing fees, no vendor lock-in.
          </h3>
          <p className="text-sm text-[#4A4641] dark:text-[#D4D4D8] leading-relaxed max-w-3xl font-medium">
            Unlike agencies that build on closed platforms with monthly software fees, AS Studio hands over complete production code, assets, and documentation. You can host anywhere, modify anything, or keep us on retainer only when you need new pages.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-xs text-[#55514B] dark:text-[#A1A1AA]">
            <div className="p-3.5 bg-[#FAF8F5] dark:bg-[#141416] border border-[#E7E2DA] dark:border-[#27272A]">
              <strong className="block text-[#121212] dark:text-white font-bold mb-1">Source Code Handover</strong>
              Clean Git repository / zip file delivered at launch.
            </div>
            <div className="p-3.5 bg-[#FAF8F5] dark:bg-[#141416] border border-[#E7E2DA] dark:border-[#27272A]">
              <strong className="block text-[#121212] dark:text-white font-bold mb-1">Zero Platform Ransom</strong>
              No recurring studio lock-ins or mandatory maintenance.
            </div>
            <div className="p-3.5 bg-[#FAF8F5] dark:bg-[#141416] border border-[#E7E2DA] dark:border-[#27272A]">
              <strong className="block text-[#121212] dark:text-white font-bold mb-1">30-Day Launch Warranty</strong>
              Free bug fixes and tweaks after going live.
            </div>
          </div>
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 p-8 sm:p-10 bg-[#F5F2EB] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-[#121212] dark:text-white">
              Need a similar clear layout for your business?
            </h3>
            <p className="text-sm text-[#4A4641] dark:text-[#D4D4D8] font-medium">
              We evaluate your current presence and provide a clear structural direction.
            </p>
          </div>
          <button
            onClick={() => {
              onNavigate('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="glass-btn-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shrink-0"
          >
            Start a project
          </button>
        </div>
      </div>
    </div>
  );
}
