import { useState, useEffect } from 'react';
import { X, Mail, Send, PlayCircle, FileText, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
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
      setActiveTab('demo');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-4xl glass-panel border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.03]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] uppercase tracking-wider text-[#A1A1AA] font-bold font-mono">
                {project.category}
              </span>
              <span className="text-[#52525B]">/</span>
              <span className="text-[11px] font-bold tracking-wider uppercase text-[var(--accent)] font-mono">
                {project.badge}
              </span>
            </div>
            <h2 id="modal-project-title" className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
              {project.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full glass-btn p-0 text-[#A1A1AA] hover:text-white flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation: Interactive Demo vs Deliverables Specs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-white/[0.02]">
          <button
            onClick={() => setActiveTab('demo')}
            className={`inline-flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'demo'
                ? 'border-[var(--accent)] text-white'
                : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Interactive Demo Prototype</span>
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`inline-flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'specs'
                ? 'border-[var(--accent)] text-white'
                : 'border-transparent text-[#A1A1AA] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Scope & Architecture Specs</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {activeTab === 'demo' ? (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#A1A1AA]">
                <span className="font-mono">Live Staging Mode: Test user interactions & mobile booking flow</span>
                <div className="flex items-center gap-3">
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold font-mono transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Site Inspiration</span>
                    </a>
                  )}
                  <span className="text-emerald-400 font-bold font-mono">100% Client Code Handover</span>
                </div>
              </div>
              <ProjectLiveDemo projectId={project.id} />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-[#A1A1AA] mb-2">Project Brief & Concept</h3>
                <p className="text-sm text-[#D4D4D8] leading-relaxed">
                  {project.conceptDetails.overview || project.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Key Deliverables</h4>
                  <ul className="space-y-2 text-xs text-[#D4D4D8]">
                    {project.conceptDetails.keyDeliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Target Audience & Focus</h4>
                  <ul className="space-y-2 text-xs text-[#D4D4D8]">
                    {project.conceptDetails.focusAreas.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[var(--accent)] font-bold">―</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Pill Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-white/10 bg-white/[0.03]">
          <span className="text-xs font-bold text-white">
            Pricing is negotiable for independent budgets:
          </span>
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onStartProject();
              }}
              className="glass-btn flex-1 sm:flex-none px-5 py-2.5 text-xs uppercase tracking-wider text-white"
            >
              Fill Project Brief
            </button>
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-btn flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs uppercase tracking-wider text-[#60A5FA]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Discuss on Telegram</span>
            </a>
            <a
              href={emailLink}
              className="glass-btn-primary flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs uppercase tracking-wider text-white"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Studio</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
