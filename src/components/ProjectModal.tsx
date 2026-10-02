import { useState, useEffect } from 'react';
import { X, Mail, Send, PlayCircle, FileText } from 'lucide-react';
import { Project } from '../types';
import { buildMailtoLink, buildTelegramLink } from '../constants/communication';
import { ProjectLiveDemo } from './ProjectLiveDemo';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onStartProject: () => void;
}

export function ProjectModal({ project, onClose, onStartProject }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<'demo' | 'specs'>('demo');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setActiveTab('demo'); // Default to live demo preview!
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const mailSubject = `Inquiry regarding ${project.name} (Negotiable Pricing)`;
  const mailBody = `Hi AS Studio team,\n\nI reviewed your ${project.name} (${project.category}) demo and would like to discuss building something similar for my business with flexible, negotiable pricing.\n\nMy business name:\nMy estimated budget:\nKey goals:`;
  const emailLink = buildMailtoLink(mailSubject, mailBody);
  const telegramLink = buildTelegramLink(`Hi AS Studio, I saw the ${project.name} demo and want to discuss flexible pricing for my project.`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
      <div 
        className="w-full max-w-3xl bg-[#FAF8F5] dark:bg-[#141416] border border-[#DDD7CD] dark:border-[#27272A] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E0D8] dark:border-[#27272A] bg-[#F5F2EB] dark:bg-[#18181B]">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-[#6B6661] dark:text-[#A1A1AA] font-bold font-mono">{project.category}</span>
              <span className="text-[#8C857B] dark:text-[#52525B]">/</span>
              <span className={`text-xs font-bold tracking-wider uppercase ${project.isConcept ? 'text-[#0047AB] dark:text-[#3B82F6]' : 'text-[#121212] dark:text-white'}`}>
                {project.badge}
              </span>
            </div>
            <h2 id="modal-project-title" className="text-2xl font-black tracking-tight text-[#121212] dark:text-white mt-0.5">
              {project.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#6B6661] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0047AB]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher: Interactive Demo vs Architectural Specs */}
        <div className="px-6 py-2.5 bg-[#FAF8F5] dark:bg-[#111113] border-b border-[#E7E2DA] dark:border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('demo')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors ${
                activeTab === 'demo'
                  ? 'bg-[#0047AB] dark:bg-[#3B82F6] text-white shadow-sm'
                  : 'text-[#6B6661] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Interactive Live Demo</span>
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors ${
                activeTab === 'specs'
                  ? 'bg-[#0047AB] dark:bg-[#3B82F6] text-white shadow-sm'
                  : 'text-[#6B6661] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Project Deliverables</span>
            </button>
          </div>

          <span className="hidden sm:inline-block text-[11px] font-mono text-[#736E66] dark:text-[#A1A1AA]">
            Negotiable rates for small businesses
          </span>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6 overflow-y-auto space-y-6 text-[#121212] dark:text-[#F4F4F6]">
          {activeTab === 'demo' ? (
            <div className="space-y-4">
              <ProjectLiveDemo projectId={project.id} />
              <p className="text-xs text-[#736E66] dark:text-[#A1A1AA] italic">
                * This live demonstration illustrates the tactile interactions, clean hierarchy, and conversion clarity AS Studio builds into every client project.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {project.isConcept && (
                <div className="p-4 bg-[#F2EFE8] dark:bg-[#1C1C20] border border-[#DDD7CD] dark:border-[#27272A] text-xs text-[#57534E] dark:text-[#A1A1AA] leading-relaxed">
                  <strong className="text-[#121212] dark:text-white font-bold block mb-1">Independent Design Concept Notice</strong>
                  This project is an independent architectural concept developed by AS Studio to demonstrate clean, high-conversion design patterns. It is not an official client engagement or brand endorsement.
                </div>
              )}

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[#DDD7CD] dark:border-[#27272A] bg-white dark:bg-[#18181B] px-2.5 py-1 text-[11px] text-[#4A4641] dark:text-[#D4D4D8] font-mono font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6661] dark:text-[#A1A1AA] mb-2 font-mono">Project Brief</h3>
                <p className="text-base text-[#2A2825] dark:text-[#E4E4E7] leading-relaxed font-medium">
                  {project.description}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6661] dark:text-[#A1A1AA] mb-2 font-mono">Design Rationale</h3>
                <p className="text-sm text-[#4A4641] dark:text-[#D4D4D8] leading-relaxed font-medium">
                  {project.conceptDetails.overview}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#F5F2EB] dark:bg-[#18181B] border border-[#E5E0D8] dark:border-[#27272A]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white mb-3">Key Deliverables</h4>
                  <ul className="space-y-2 text-xs text-[#4A4641] dark:text-[#D4D4D8]">
                    {project.conceptDetails.keyDeliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 font-medium">
                        <span className="text-[#0047AB] dark:text-[#3B82F6] font-bold">―</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#F5F2EB] dark:bg-[#18181B] border border-[#E5E0D8] dark:border-[#27272A]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white mb-3">Focus Areas</h4>
                  <ul className="space-y-2 text-xs text-[#4A4641] dark:text-[#D4D4D8]">
                    {project.conceptDetails.focusAreas.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 font-medium">
                        <span className="text-[#0047AB] dark:text-[#3B82F6] font-bold">―</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Glassmorphic Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-[#E5E0D8] dark:border-[#27272A] bg-[#F5F2EB] dark:bg-[#18181B]">
          <span className="text-xs font-bold text-[#0047AB] dark:text-[#3B82F6]">
            Pricing is negotiable to fit your budget:
          </span>
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onStartProject();
              }}
              className="glass-btn flex-1 sm:flex-none px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white"
            >
              Fill Brief
            </button>
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-btn flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#0047AB] dark:text-[#3B82F6]"
            >
              <Send className="w-3 h-3" />
              <span>Discuss on Telegram</span>
            </a>
            <a
              href={emailLink}
              className="glass-btn-primary flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white"
            >
              <Mail className="w-3 h-3" />
              <span>Email Studio</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
