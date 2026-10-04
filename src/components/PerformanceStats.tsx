import { ArrowUpRight, Gauge, Smartphone, Search } from 'lucide-react';
import { Project } from '../types';

interface PerformanceStatsProps {
  projects: Project[];
  activeProjectId?: string;
  onSelectProject?: (project: Project) => void;
}

export function PerformanceStats({ projects }: PerformanceStatsProps) {
  return (
    <section className="mt-16 pt-10 border-t border-[#E7E2DA] dark:border-[#27272A]">
      <div className="max-w-3xl">
        <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#6B6661] dark:text-[#A1A1AA]">How we build</span>
        <h3 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-[#121212] dark:text-white">Built for clarity, speed and enquiries.</h3>
        <p className="mt-3 text-sm leading-relaxed text-[#5F5A54] dark:text-[#A1A1AA]">Performance is measured during the real build and depends on the final content, media, hosting and integrations. We do not publish unverified scores for concept projects.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-7">
        {[
          [Gauge, 'Performance-minded', 'Lean layouts, sensible media and responsive interactions.'],
          [Smartphone, 'Mobile-first', 'The experience is designed around real phone-sized screens.'],
          [Search, 'SEO-ready structure', 'Semantic content, metadata and crawl-friendly foundations.'],
        ].map(([Icon, title, text]) => {
          const IconComponent = Icon as typeof Gauge;
          return <div key={String(title)} className="p-5 rounded-xl border border-[#E7E2DA] dark:border-[#27272A] bg-white/70 dark:bg-white/[0.02]">
            <IconComponent className="w-5 h-5 text-[#2563EB] dark:text-blue-400" />
            <h4 className="mt-3 text-sm font-bold text-[#121212] dark:text-white">{String(title)}</h4>
            <p className="mt-1.5 text-xs leading-relaxed text-[#6B6661] dark:text-[#A1A1AA]">{String(text)}</p>
          </div>;
        })}
      </div>
      {projects.length > 0 && <div className="mt-5 text-xs text-[#8C857B] dark:text-[#71717A] flex items-center gap-1.5"><ArrowUpRight className="w-3.5 h-3.5" />Concept previews are demonstrations, not client performance reports.</div>}
    </section>
  );
}
