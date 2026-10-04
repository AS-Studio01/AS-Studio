import { useEffect } from 'react';
import { X, Mail, Send, ExternalLink, ArrowRight } from 'lucide-react';
import { Project } from '../types';
import { buildMailtoLink, buildTelegramLink } from '../constants/communication';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onStartProject: () => void;
}

export function ProjectModal({ project, onClose, onStartProject }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const mailSubject = `Project enquiry inspired by ${project.name}`;
  const mailBody = `Hi AS Studio team,\n\nI reviewed the ${project.name} studio concept and would like to discuss a similar website for my business.\n\nBusiness name:\nWebsite (if any):\nMain goal:\n`; 
  const emailLink = buildMailtoLink(mailSubject, mailBody);
  const telegramLink = buildTelegramLink(`Hi AS Studio, I saw the ${project.name} concept and would like to discuss a similar website for my business.`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/80 backdrop-blur-xl">
      <div
        className="w-full max-w-6xl bg-[#0E0E10] border border-white/12 rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[94vh] text-white"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
      >
        <div className="flex items-center justify-between gap-4 px-5 sm:px-7 py-4 border-b border-white/10 bg-white/[0.025]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/45 font-semibold">
              <span>{project.category}</span>
              <span>·</span>
              <span className="text-cyan-300">Studio Concept</span>
            </div>
            <h2 id="modal-project-title" className="mt-1 text-lg sm:text-2xl font-semibold tracking-tight truncate">{project.name}</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 shrink-0 rounded-full border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] transition-colors flex items-center justify-center" aria-label="Close project preview">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-5">
            <div className="overflow-hidden rounded-[18px] border border-white/10 bg-black aspect-[16/10] min-h-[360px] sm:min-h-[460px]">
              {project.liveDemoUrl ? (
                <iframe
                  src={project.liveDemoUrl}
                  title={`${project.name} interactive studio concept`}
                  className="w-full h-full border-0 bg-white"
                  loading="eager"
                  sandbox="allow-scripts allow-forms allow-same-origin"
                />
              ) : (
                <div className="h-full min-h-[360px] grid place-items-center text-white/60 text-sm">Preview coming soon.</div>
              )}
            </div>
          </div>

          <div className="px-5 sm:px-7 pb-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 items-end">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {(project.tags || []).slice(0, 5).map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] text-white/65">{tag}</span>
                ))}
              </div>
              <p className="max-w-3xl text-sm leading-6 text-white/60">{project.conceptDetails?.overview || project.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              {project.liveDemoUrl && (
                <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold hover:bg-white/[0.1] transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Open Preview
                </a>
              )}
              <button onClick={onStartProject} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-500/20 hover:-translate-y-0.5 transition-transform">
                Request Similar Build <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-3.5 border-t border-white/10 bg-white/[0.02]">
          <span className="text-[11px] text-white/45">Concept preview — created by AS Studio for demonstration.</span>
          <div className="flex gap-2">
            <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-2 text-[11px] font-semibold text-white/75 hover:bg-white/[0.06]"><Send className="w-3.5 h-3.5" /> Telegram</a>
            <a href={emailLink} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-2 text-[11px] font-semibold text-white/75 hover:bg-white/[0.06]"><Mail className="w-3.5 h-3.5" /> Email</a>
          </div>
        </div>
      </div>
    </div>
  );
}
