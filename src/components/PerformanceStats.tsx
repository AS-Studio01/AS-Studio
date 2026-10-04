import { motion } from 'motion/react';
import { Gauge, Smartphone, Search, ShieldCheck, Code2 } from 'lucide-react';
import { Project } from '../types';

interface PerformanceStatsProps {
  projects: Project[];
  activeProjectId?: string;
  onSelectProject?: (project: Project) => void;
}

const principles = [
  { icon: Smartphone, title: 'Mobile-first', text: 'Layouts, navigation and touch targets are designed around real phone use.' },
  { icon: Gauge, title: 'Lean delivery', text: 'We keep dependencies, media and interaction layers purposeful rather than decorative.' },
  { icon: Search, title: 'SEO-ready structure', text: 'Semantic content, metadata and clean page structure are considered from the start.' },
  { icon: Code2, title: 'Maintainable code', text: 'The build is structured so future edits do not depend on a visual site-builder lock-in.' },
  { icon: ShieldCheck, title: 'Real-device review', text: 'Important flows should be checked on the devices and browsers your customers actually use.' },
];

export function PerformanceStats({ projects }: PerformanceStatsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.6 }}
      aria-label="AS Studio website performance approach"
      className="my-16 sm:my-20 rounded-[24px] border border-[#DDD7CD] dark:border-white/[0.09] bg-white/75 dark:bg-[#141418]/80 p-6 sm:p-10 backdrop-blur-md"
    >
      <div className="max-w-3xl mb-8">
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-400 font-bold">Build standards</span>
        <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-[#121212] dark:text-white">Performance is part of the design.</h2>
        <p className="mt-3 text-sm leading-6 text-[#4A4641] dark:text-[#A1A1AA]">We focus on the things that make a website feel fast and dependable instead of publishing unverified scorecards or simulated audit results.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {principles.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="rounded-2xl border border-white/10 bg-black/[0.025] dark:bg-white/[0.025] p-4 hover:-translate-y-1 hover:border-cyan-300/20 transition-all"
            >
              <Icon className="w-4 h-4 text-cyan-300" />
              <h3 className="mt-4 text-sm font-bold text-[#121212] dark:text-white">{item.title}</h3>
              <p className="mt-2 text-[11px] leading-5 text-[#6B6661] dark:text-[#A1A1AA]">{item.text}</p>
            </motion.div>
          );
        })}
      </div>

      {projects.length > 0 && (
        <p className="mt-6 text-[10px] uppercase tracking-[0.14em] text-[#8A857D] dark:text-[#71717A]">Applied to the studio concepts shown above · actual production metrics are measured on the final deployed project.</p>
      )}
    </motion.section>
  );
}
