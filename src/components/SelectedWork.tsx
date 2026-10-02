import { useState, useEffect } from 'react';
import { ArrowRight, Eye } from 'lucide-react';
import { Project } from '../types';
import { ProjectVisual } from './ProjectVisual';
import { ProjectCardSkeleton } from './ProjectCardSkeleton';

interface SelectedWorkProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export function SelectedWork({ projects, onSelectProject }: SelectedWorkProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Brief simulated loading to render skeletons for perceived performance
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="work" className="py-24 sm:py-32 border-b border-[#E7E2DA] dark:border-[#27272A] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-6 border-b border-[#E7E2DA] dark:border-[#27272A] gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#6B6661] dark:text-[#A1A1AA] font-bold block mb-2 font-mono">
              Selected Projects
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#121212] dark:text-white">
              Selected work
            </h2>
          </div>
          <p className="text-sm font-medium text-[#6B6661] dark:text-[#A1A1AA] max-w-sm">
            Intentional interfaces engineered for credibility, friction-free discovery, and verified customer enquiries.
          </p>
        </div>

        {/* Three Large Project Cards Grid (or Skeletons) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {isLoading ? (
            <>
              <ProjectCardSkeleton variant="grid" />
              <ProjectCardSkeleton variant="grid" />
              <ProjectCardSkeleton variant="grid" />
            </>
          ) : (
            projects.map((project) => (
              <article
                key={project.id}
                className="bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] flex flex-col justify-between transition-all hover:border-[#121212] dark:hover:border-white shadow-sm hover:shadow-md fade-in"
              >
                <div>
                  {/* Elegant neutral visual representation */}
                  <ProjectVisual projectId={project.id} name={project.name} />

                  {/* Card Content */}
                  <div className="p-6 sm:p-7 space-y-4">
                    {/* Category & Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs text-[#6B6661] dark:text-[#A1A1AA] font-semibold tracking-wide">
                        {project.category}
                      </span>

                      {/* Prominent Badge */}
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
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
