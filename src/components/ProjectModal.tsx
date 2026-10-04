import { useEffect } from 'react';
import { X, ArrowRight, ExternalLink } from 'lucide-react';
import { Project } from '../types';
import { buildMailtoLink, buildTelegramLink } from '../constants/communication';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onStartProject: () => void;
}

export function ProjectModal({ project, onClose, onStartProject }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const mailSubject = `Project enquiry — ${project.name}`;
  const mailBody = `Hi AS Studio team,\n\nI reviewed the ${project.name} studio concept and would like to discuss a similar website for my business.\n\nBusiness name:\nWebsite (if any):\nWhat I need:\n`;
  const emailLink = buildMailtoLink(mailSubject, mailBody);
  const telegramLink = buildTelegramLink(`Hi AS Studio, I saw the ${project.name} studio concept and would like to discuss a similar website.`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm">
      <div
        className="w-full max-w-6xl bg-[#FAF9F5] dark:bg-[#111114] border border-[#E5E2D9] dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] text-[#18181B] dark:text-[#E4E4E7]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
      >
        <header className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-[#E5E2D9] dark:border-white/10">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-[0.14em] font-bold text-[#6B7280] dark:text-[#A1A1AA]">
              <span>{project.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#2563EB] dark:text-blue-400">Studio Concept</span>
            </div>
            <h2 id="modal-project-title" className="text-xl sm:text-2xl font-black tracking-tight mt-1 truncate">
              {project.name}
            </h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 shrink-0 rounded-full border border-[#DDD7CD] dark:border-white/10 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5" aria-label="Close project preview">
            <X className="w-4 h-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="rounded-xl overflow-hidden border border-[#DDD7CD] dark:border-white/10 bg-white dark:bg-black/20 shadow-sm">
            {project.liveDemoUrl ? (
              <iframe
                src={project.liveDemoUrl}
                title={`${project.name} studio concept preview`}
                className="w-full h-[58vh] min-h-[420px] border-0 bg-white"
                loading="lazy"
                sandbox="allow-scripts allow-forms allow-same-origin"
              />
            ) : (
              <div className="h-[58vh] min-h-[420px] flex items-center justify-center text-sm text-[#6B7280] dark:text-[#A1A1AA]">
                Preview unavailable.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 items-start pt-5">
            <div>
              <p className="text-sm leading-relaxed text-[#4B5563] dark:text-[#A1A1AA] max-w-3xl">
                {project.description} This is a studio concept created to demonstrate a possible direction for a business in this category; it is not presented as a commissioned client project.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {(project.tags || []).map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full border border-[#DDD7CD] dark:border-white/10 text-[10px] uppercase tracking-wider font-semibold text-[#5F5A54] dark:text-[#A1A1AA]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
              {project.liveDemoUrl && (
                <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold border border-[#DDD7CD] dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Preview
                </a>
              )}
              <button onClick={onStartProject} className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold text-white bg-[#18181B] dark:bg-white dark:text-black hover:opacity-90">
                Request a Similar Build
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className="flex gap-2 justify-center">
                <a href={emailLink} className="text-[11px] font-semibold text-[#2563EB] dark:text-blue-400 hover:underline">Email</a>
                <span className="text-[#A1A1AA]">·</span>
                <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-[#2563EB] dark:text-blue-400 hover:underline">Telegram</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
