import { ArrowRight, Mail, Send, ShieldCheck, CheckCircle2, Zap, Lock, Smartphone, Layers, Eye } from 'lucide-react';
import { Hero } from '../components/Hero';
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
  const coreServices = rawServices.slice(0, 3).map((s, idx) => ({
    number: s.number || `0${idx + 1}`,
    title: s.title,
    desc: s.description,
    turnaround: (s as any).turnaround || (s.id.includes('landing') ? '5–7 days' : s.id.includes('redesign') ? '7–12 days' : '10–14 days'),
    accent: s.accentColor || (idx === 0 ? '#06B6D4' : idx === 1 ? '#3B82F6' : '#10B981'),
    ideal: s.idealFor || 'Clinics, local practices, ateliers & boutique firms',
  }));

  return (
    <div className="fade-in">
      {/* 1. Hero Section with Live Staging Quick-Preview */}
      <Hero onNavigate={onNavigate} />

      {/* 2. The Three Studio Pillars (Why Choose AS Studio) */}
      <section className="py-12 sm:py-16 border-b border-white/[0.08] bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Live Phone Staging</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Test the actual responsive website directly on your personal smartphone before making final payment.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">100% Code Ownership</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Full GitHub repository or production files delivered upon completion. Zero builder lock-in or recurring platform fees.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Flexible Negotiable Pricing</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Pricing tailored transparently to independent business scopes without inflated corporate minimums.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Selected Work Spotlight (Curated 3 projects) */}
      <section className="py-16 sm:py-24 border-b border-white/[0.08] zone-work">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/[0.08]">
            <div>
              <span className="section-kicker text-[var(--work-accent)]">
                Selected Prototypes & Demos
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Work engineered for clarity and conversions.
              </h2>
            </div>
            <button
              onClick={() => onNavigate('work')}
              className="glass-btn px-5 py-2.5 text-xs uppercase tracking-wider text-white shrink-0 self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>Explore All Work & Demos ({projects.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)]" />
            </button>
          </div>

          {/* 3-Column Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="glass-card flex flex-col justify-between overflow-hidden group hover:border-white/30 transition-all"
              >
                <div>
                  <ProjectVisual projectId={project.id} name={project.name} />
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#A1A1AA] font-semibold">{project.category}</span>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/[0.05] text-[var(--accent)] border border-white/10">
                        {project.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white">{project.name}</h3>
                    <p className="text-xs text-[#D4D4D8] leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="w-full glass-btn py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white flex items-center justify-between group-hover:border-white/40 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>Test Interactive Demo</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Core Capabilities Overview Teaser */}
      <section className="py-16 sm:py-24 border-b border-white/[0.08] zone-services">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/[0.08]">
            <div>
              <span className="section-kicker text-[var(--services-accent)]">
                Capabilities & Scope
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Bespoke digital design without agency bloat.
              </h2>
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="glass-btn px-5 py-2.5 text-xs uppercase tracking-wider text-white shrink-0 self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>View All Services & Sprints</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreServices.map((srv) => (
              <div key={srv.number} className="glass-card p-6 sm:p-7 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#71717A]">{srv.number}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-white border border-white/10">
                      {srv.turnaround}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">{srv.title}</h3>
                  <p className="text-xs text-[#D4D4D8] leading-relaxed">{srv.desc}</p>
                </div>
                <div className="pt-3 border-t border-white/[0.06] text-[11px] text-[#A1A1AA]">
                  <span className="font-mono uppercase text-[9px] text-[#71717A] block">Ideal for</span>
                  <span>{srv.ideal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Sprint Methodology Teaser (3-Step Roadmap) */}
      <section className="py-16 sm:py-20 border-b border-white/[0.08] zone-process">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/[0.08]">
            <div>
              <span className="section-kicker text-[var(--process-accent)]">
                The Sprint Methodology
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                From brief to launch in 7–14 days.
              </h2>
            </div>
            <button
              onClick={() => onNavigate('process')}
              className="glass-btn px-5 py-2.5 text-xs uppercase tracking-wider text-white shrink-0 self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>Explore 6-Phase Sprint</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
              <span className="text-xs font-mono text-emerald-400 font-bold">Phase 01</span>
              <h4 className="text-base font-bold text-white">Discovery & Strategy</h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                We define your target action, customer profile, and structural wireframes without fluff.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
              <span className="text-xs font-mono text-cyan-400 font-bold">Phase 02</span>
              <h4 className="text-base font-bold text-white">Design & Live Staging</h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                You receive a private staging URL to test typography, buttons, and mobile speed directly on your phone.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
              <span className="text-xs font-mono text-indigo-400 font-bold">Phase 03</span>
              <h4 className="text-base font-bold text-white">Launch & Code Handover</h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Domain connection, 100% source code repository handover, and 30 days of warranty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Direct Contact Banner (Fast, No Endless Wall) */}
      <section className="py-16 sm:py-24 zone-contact border-b border-white/[0.08] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="glass-card p-8 sm:p-12"
            style={{
              '--accent': 'var(--contact-accent)',
            } as React.CSSProperties}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-3.5">
                <span className="section-kicker text-[var(--contact-accent)]">
                  {ctaSection?.eyebrow || 'Direct Founder Inquiries'}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                  {ctaSection?.title || 'Have a business ready to be easier to choose?'}
                </h2>
                <p className="text-xs sm:text-sm text-[#D4D4D8] leading-relaxed max-w-xl">
                  {ctaSection?.description || 'Share your current website or new business goals. We reply within 24 hours with actionable improvements and flexible, negotiable pricing.'}
                </p>

                <div className="pt-2 text-xs text-[#A1A1AA] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{ctaSection?.reassurance || 'Pricing is 100% negotiable to match your scope and timeline.'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
                <button
                  onClick={() => onNavigate('contact')}
                  className="glass-btn-primary px-7 py-3.5 text-xs uppercase tracking-wider text-white shadow-xl justify-center rounded-xl"
                >
                  <span>Submit Project Brief</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={buildTelegramLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-btn px-4 py-3 text-xs uppercase tracking-wider text-white justify-center rounded-xl"
                  >
                    <Send className="w-3.5 h-3.5 text-[#60A5FA]" />
                    <span>Telegram</span>
                  </a>

                  <a
                    href={buildMailtoLink()}
                    className="glass-btn px-4 py-3 text-xs uppercase tracking-wider text-white justify-center rounded-xl"
                  >
                    <Mail className="w-3.5 h-3.5 text-[var(--contact-accent)]" />
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
