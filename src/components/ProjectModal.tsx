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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
      <div 
        className="w-full max-w-4xl bg-[#FAF9F5] dark:bg-[#121216] border border-[#E5E2D9] dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] fade-in text-[#18181B] dark:text-[#E4E4E7] transition-colors"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2D9] dark:border-white/10 bg-white dark:bg-white/[0.03]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] uppercase tracking-wider text-[#6B7280] dark:text-[#A1A1AA] font-bold font-mono">
                {project.category}
              </span>
              <span className="text-[#A1A1AA] dark:text-[#52525B]">/</span>
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#0047AB] dark:text-[var(--accent)] font-mono">
                {project.badge}
              </span>
            </div>
            <h2 id="modal-project-title" className="text-xl sm:text-2xl font-black tracking-tight text-[#090A0D] dark:text-white mt-0.5">
              {project.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full glass-btn p-0 text-[#52525B] hover:text-[#090A0D] dark:text-[#A1A1AA] dark:hover:text-white flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation: Interactive Demo vs Deliverables Specs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#E5E2D9] dark:border-white/10 bg-[#FAF9F5] dark:bg-white/[0.02]">
          <button
            onClick={() => setActiveTab('demo')}
            className={`inline-flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'demo'
                ? 'border-[#0047AB] dark:border-[var(--accent)] text-[#0047AB] dark:text-white'
                : 'border-transparent text-[#6B7280] hover:text-[#090A0D] dark:text-[#A1A1AA] dark:hover:text-white'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Interactive Demo Prototype</span>
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`inline-flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'specs'
                ? 'border-[#0047AB] dark:border-[var(--accent)] text-[#0047AB] dark:text-white'
                : 'border-transparent text-[#6B7280] hover:text-[#090A0D] dark:text-[#A1A1AA] dark:hover:text-white'
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
              <div className="p-3 rounded-2xl bg-white dark:bg-white/[0.03] border border-[#E5E2D9] dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                <span className="font-mono">Live Staging Mode: Test user interactions & mobile booking flow</span>
                <div className="flex items-center gap-3">
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#0047AB] dark:text-cyan-400 font-bold font-mono transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Site Inspiration</span>
                    </a>
                  )}
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">100% Client Code Handover</span>
                </div>
              </div>
              <ProjectLiveDemo projectId={project.id} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Classification Banner */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-white/[0.03] border border-[#E5E2D9] dark:border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#6B7280] dark:text-[#A1A1AA] block">Project Classification</span>
                  <span className="text-xs font-bold text-[#18181B] dark:text-white">
                    {project.projectType || (project.isConcept ? 'Studio Concept (Exploratory Prototype)' : 'Client Project')}
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-blue-500/10 text-[#0047AB] dark:text-[#60A5FA] border border-blue-500/20 font-bold">
                  {project.badge}
                </span>
              </div>

              {/* Overview & Services Involved */}
              <div>
                <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-[#6B7280] dark:text-[#A1A1AA] mb-2">Project Overview</h3>
                <p className="text-sm text-[#374151] dark:text-[#D4D4D8] leading-relaxed">
                  {project.conceptDetails?.overview || project.description}
                </p>
                {project.servicesInvolved && project.servicesInvolved.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase text-[#6B7280] dark:text-[#71717A] mr-1">Services:</span>
                    {project.servicesInvolved.map((srv, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#F4F2EC] dark:bg-white/[0.04] text-[#18181B] dark:text-white border border-[#E5E2D9] dark:border-white/10"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Problem, Approach, Solution Triad */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-[#E5E2D9] dark:border-white/[0.08] space-y-2">
                  <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">The Challenge</span>
                  <h4 className="text-xs font-bold text-[#18181B] dark:text-white uppercase">Problem</h4>
                  <p className="text-xs text-[#4B5563] dark:text-[#A1A1AA] leading-relaxed">
                    {project.problem || 'Outdated digital representation failing to convert high-intent prospects or differentiate the business.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-[#E5E2D9] dark:border-white/[0.08] space-y-2">
                  <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400 font-bold uppercase tracking-wider">Strategy & Design</span>
                  <h4 className="text-xs font-bold text-[#18181B] dark:text-white uppercase">Approach</h4>
                  <p className="text-xs text-[#4B5563] dark:text-[#A1A1AA] leading-relaxed">
                    {project.approach || 'Content-first wireframing, high-contrast typography, and friction-free direct action pathways.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-[#E5E2D9] dark:border-white/[0.08] space-y-2">
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">Engineering</span>
                  <h4 className="text-xs font-bold text-[#18181B] dark:text-white uppercase">Solution</h4>
                  <p className="text-xs text-[#4B5563] dark:text-[#A1A1AA] leading-relaxed">
                    {project.solution || 'Modern responsive codebase, sub-second load times, and custom interaction patterns tailored to business goals.'}
                  </p>
                </div>
              </div>

              {/* Deliverables & Focus Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-[#E5E2D9] dark:border-white/[0.08]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B] dark:text-white mb-3">Key Deliverables</h4>
                  <ul className="space-y-2 text-xs text-[#374151] dark:text-[#D4D4D8]">
                    {(project.deliverables || project.conceptDetails?.keyDeliverables || []).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-[#E5E2D9] dark:border-white/[0.08]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B] dark:text-white mb-3">Target Audience & Focus</h4>
                  <ul className="space-y-2 text-xs text-[#374151] dark:text-[#D4D4D8]">
                    {(project.conceptDetails?.focusAreas || ['Boutique studios & independent clinics', 'High-intent clients seeking fast contact', 'Mobile-first decision makers']).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#0047AB] dark:text-[#60A5FA] font-bold">―</span>
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-[#E5E2D9] dark:border-white/10 bg-white dark:bg-white/[0.03]">
          <span className="text-xs font-bold text-[#18181B] dark:text-white">
            Pricing is negotiable for independent budgets:
          </span>
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onStartProject();
              }}
              className="glass-btn flex-1 sm:flex-none px-5 py-2.5 text-xs uppercase tracking-wider text-[#18181B] dark:text-white"
            >
              Fill Project Brief
            </button>
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-btn flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs uppercase tracking-wider text-[#0047AB] dark:text-[#60A5FA]"
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
