import { ArrowRight, Mail, Send, ShieldCheck, CheckCircle2, Zap, Lock, Smartphone, Layers, Eye, Check } from 'lucide-react';
import { Hero } from '../components/Hero';
import { AboutSection } from '../components/AboutSection';
import { IndustriesSection } from '../components/IndustriesSection';
import { Testimonials } from '../components/Testimonials';
import { FAQ } from '../components/FAQ';
import { ProjectVisual } from '../components/ProjectVisual';
import { Project, PageType } from '../types';
import { buildMailtoLink, buildTelegramLink, STUDIO_CONTACT } from '../constants/communication';
import { useSiteContent } from '../context/SiteContentContext';

interface HomePageProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNavigate: (page: PageType) => void;
}

export function HomePage({ projects, onSelectProject, onNavigate }: HomePageProps) {
  const { content } = useSiteContent();
  const ctaSection = content.sections.contact;

  const rawServices = content.services && content.services.length > 0 ? content.services : [];
  const coreServices = rawServices.slice(0, 3);

  return (
    <div className="fade-in">
      {/* 1. Hero Section */}
      <Hero onNavigate={onNavigate} />

      {/* 2. About AS Studio */}
      <AboutSection onStartProject={() => onNavigate('contact')} />

      {/* 3. Who AS Studio Works For (Industries & Client Types) */}
      <IndustriesSection onStartProject={() => onNavigate('contact')} />

      {/* 4. Selected Work Spotlight (Curated 3 projects) */}
      <section className="py-16 sm:py-24 border-b border-[#E5E2D9] dark:border-white/[0.08] zone-work transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#E5E2D9] dark:border-white/[0.08]">
            <div>
              <span className="section-kicker text-[#0047AB] dark:text-[var(--work-accent)]">
                Selected Work & Concepts
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#090A0D] dark:text-white">
                Work designed for credibility and conversions.
              </h2>
            </div>
            <button
              onClick={() => onNavigate('work')}
              className="glass-btn px-5 py-2.5 text-xs uppercase tracking-wider text-[#18181B] dark:text-white shrink-0 self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>Explore All Work ({projects.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0047AB] dark:text-[var(--accent)]" />
            </button>
          </div>

          {/* 3-Column Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="glass-card flex flex-col justify-between overflow-hidden group hover:border-[#0047AB] dark:hover:border-white/30 transition-all shadow-sm"
              >
                <div>
                  <ProjectVisual projectId={project.id} name={project.name} />
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6B7280] dark:text-[#A1A1AA] font-semibold">{project.category}</span>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-[#0047AB] dark:text-[#60A5FA] border border-blue-500/20">
                        {project.projectType || project.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-[#18181B] dark:text-white">{project.name}</h3>
                    <p className="text-xs text-[#4B5563] dark:text-[#D4D4D8] leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    {project.servicesInvolved && project.servicesInvolved.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {project.servicesInvolved.slice(0, 3).map((srv, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4F2EC] dark:bg-white/[0.04] text-[#52525B] dark:text-[#A1A1AA] border border-[#E5E2D9] dark:border-white/5"
                          >
                            {srv}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="w-full glass-btn py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-[#18181B] dark:text-white flex items-center justify-between group-hover:border-[#0047AB] dark:group-hover:border-white/40 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#0047AB] dark:text-[#60A5FA]" />
                      <span>{project.buttonText || 'View Case Study'}</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Core Services Overview */}
      <section className="py-16 sm:py-24 border-b border-[#E5E2D9] dark:border-white/[0.08] zone-services transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#E5E2D9] dark:border-white/[0.08]">
            <div>
              <span className="section-kicker text-[#0284C7] dark:text-[var(--services-accent)]">
                Studio Capabilities
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#090A0D] dark:text-white">
                Strategy, design and development in one focused process.
              </h2>
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="glass-btn px-5 py-2.5 text-xs uppercase tracking-wider text-[#18181B] dark:text-white shrink-0 self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>View All 6 Core Services</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0047AB] dark:text-[var(--accent)]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreServices.map((srv) => (
              <div key={srv.id || srv.number} className="glass-card p-6 sm:p-7 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#6B7280] dark:text-[#71717A]">{srv.number}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F4F2EC] dark:bg-white/[0.04] text-[#18181B] dark:text-white border border-[#E5E2D9] dark:border-white/10">
                      {srv.turnaround || '1–2 Weeks'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#18181B] dark:text-white">{srv.title}</h3>
                  <p className="text-xs text-[#4B5563] dark:text-[#D4D4D8] leading-relaxed">{srv.description}</p>
                </div>
                
                {srv.features && srv.features.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#E5E2D9] dark:border-white/[0.06]">
                    <span className="text-[10px] font-mono uppercase text-[#6B7280] dark:text-[#71717A] block">Includes</span>
                    {srv.features.slice(0, 3).map((f, fIdx) => (
                      <div key={fIdx} className="text-[11px] text-[#4B5563] dark:text-[#A1A1AA] flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="line-clamp-1">{f}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-[#E5E2D9] dark:border-white/[0.06] text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">
                  <span className="font-mono uppercase text-[9px] text-[#9CA3AF] dark:text-[#71717A] block">Ideal for</span>
                  <span>{srv.idealFor || 'Businesses ready to look established online'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Sprint Methodology (5-Stage Delivery Process) */}
      <section className="py-16 sm:py-20 border-b border-[#E5E2D9] dark:border-white/[0.08] zone-process transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#E5E2D9] dark:border-white/[0.08]">
            <div>
              <span className="section-kicker text-[#059669] dark:text-[var(--process-accent)]">
                Delivery Workflow
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#090A0D] dark:text-white">
                Clear milestones from brief to launch.
              </h2>
            </div>
            <button
              onClick={() => onNavigate('process')}
              className="glass-btn px-5 py-2.5 text-xs uppercase tracking-wider text-[#18181B] dark:text-white shrink-0 self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>Explore Detailed Process</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0047AB] dark:text-[var(--accent)]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-white/[0.02] border border-[#E5E2D9] dark:border-white/[0.08] space-y-2 shadow-sm">
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">Stage 01</span>
              <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Discovery & Strategy</h4>
              <p className="text-[11px] text-[#4B5563] dark:text-[#A1A1AA] leading-relaxed">
                Auditing current materials, defining target audience, and clarifying core conversion goals.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-white/[0.02] border border-[#E5E2D9] dark:border-white/[0.08] space-y-2 shadow-sm">
              <span className="text-[11px] font-mono text-blue-700 dark:text-blue-400 font-bold">Stage 02</span>
              <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Wireframing & UI</h4>
              <p className="text-[11px] text-[#4B5563] dark:text-[#A1A1AA] leading-relaxed">
                Page architecture, layout wireframes, typography hierarchy, and visual design system.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-white/[0.02] border border-[#E5E2D9] dark:border-white/[0.08] space-y-2 shadow-sm">
              <span className="text-[11px] font-mono text-cyan-700 dark:text-cyan-400 font-bold">Stage 03</span>
              <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Development & Staging</h4>
              <p className="text-[11px] text-[#4B5563] dark:text-[#A1A1AA] leading-relaxed">
                Modern responsive coding with a private live URL to test directly on your phone.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-white/[0.02] border border-[#E5E2D9] dark:border-white/[0.08] space-y-2 shadow-sm">
              <span className="text-[11px] font-mono text-purple-700 dark:text-purple-400 font-bold">Stage 04</span>
              <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Review & Quality Check</h4>
              <p className="text-[11px] text-[#4B5563] dark:text-[#A1A1AA] leading-relaxed">
                Mobile responsiveness check, speed audit, form validation, and client feedback integration.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-white/[0.02] border border-[#E5E2D9] dark:border-white/[0.08] space-y-2 shadow-sm">
              <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 font-bold">Stage 05</span>
              <h4 className="text-sm font-bold text-[#18181B] dark:text-white">Launch & Handover</h4>
              <p className="text-[11px] text-[#4B5563] dark:text-[#A1A1AA] leading-relaxed">
                Domain connection, 100% source code repository handover, and 30 days of warranty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Client Expectations & Delivery Commitments */}
      <Testimonials />

      {/* 8. Frequently Asked Questions */}
      <FAQ onNavigateToContact={() => onNavigate('contact')} />

      {/* 9. Direct Contact Banner */}
      <section className="py-16 sm:py-24 zone-contact border-b border-[#E5E2D9] dark:border-white/[0.08] relative transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="glass-card p-8 sm:p-12 shadow-lg"
            style={{
              '--accent': 'var(--contact-accent)',
            } as React.CSSProperties}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-3.5">
                <span className="section-kicker text-[#D97706] dark:text-[var(--contact-accent)]">
                  {ctaSection?.eyebrow || 'Direct Inquiries'}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#090A0D] dark:text-white leading-tight">
                  Ready to give your business a credible online presence?
                </h2>
                <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#D4D4D8] leading-relaxed max-w-xl">
                  Share your project scope or existing website. We review your requirements and respond within 24 hours with an actionable proposal and transparent project estimate.
                </p>

                <div className="pt-2 text-xs text-[#52525B] dark:text-[#A1A1AA] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Clear deliverables, milestone payments, and 100% code ownership.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
                <button
                  onClick={() => onNavigate('contact')}
                  className="glass-btn-primary px-7 py-3.5 text-xs uppercase tracking-wider text-white shadow-xl justify-center rounded-xl"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={buildTelegramLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-btn px-4 py-3 text-xs uppercase tracking-wider text-[#18181B] dark:text-white justify-center rounded-xl"
                  >
                    <Send className="w-3.5 h-3.5 text-[#0047AB] dark:text-[#60A5FA]" />
                    <span>Telegram</span>
                  </a>

                  <a
                    href={buildMailtoLink()}
                    className="glass-btn px-4 py-3 text-xs uppercase tracking-wider text-[#18181B] dark:text-white justify-center rounded-xl"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#D97706] dark:text-[var(--contact-accent)]" />
                    <span>Email Studio</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
