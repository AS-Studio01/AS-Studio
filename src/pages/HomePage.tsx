import { ArrowRight, Mail, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Hero } from '../components/Hero';
import { SelectedWork } from '../components/SelectedWork';
import { Testimonials } from '../components/Testimonials';
import { Services } from '../components/Services';
import { Process } from '../components/Process';
import { FAQ } from '../components/FAQ';
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

  return (
    <div className="fade-in">
      {/* 1. Hero Section with Interactive Staging Preview */}
      <Hero onNavigate={onNavigate} />

      {/* 2. Selected Work Section (Home Decor, Nova Dental, Mitti Café) */}
      <SelectedWork
        projects={projects}
        onSelectProject={onSelectProject}
      />

      {/* Interactive Case Study & Demo Bridge */}
      <div className="border-b border-white/[0.08] bg-white/[0.02] py-10 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <span className="section-kicker text-[var(--work-accent)]">
              Interactive Showroom & Triage Archive
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Explore complete interactive prototypes, material catalogues, and healthcare triage.
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              See how we structure home decor lookbooks, healthcare appointment priority, and zero-PDF restaurant menus.
            </p>
          </div>
          <button
            onClick={() => {
              onNavigate('work');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="glass-btn px-6 py-3 text-xs uppercase tracking-wider text-white shrink-0"
          >
            <span>Explore All Work & Demos</span>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)]" />
          </button>
        </div>
      </div>

      {/* 3. Capabilities & Scope */}
      <Services onStartProject={() => onNavigate('contact')} />

      {/* 4. Methodology Roadmap */}
      <Process onStartProject={() => onNavigate('contact')} />

      {/* 5. Verified Client Outcomes */}
      <Testimonials />

      {/* 6. FAQ Section */}
      <FAQ onNavigateToContact={() => onNavigate('contact')} />

      {/* 7. Final Climax CTA / Contact Zone */}
      <section className="py-20 sm:py-28 zone-contact border-b border-white/[0.08] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="glass-card p-8 sm:p-14"
            style={{
              '--accent': 'var(--contact-accent)',
            } as React.CSSProperties}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="section-kicker text-[var(--contact-accent)]">
                  {ctaSection?.eyebrow || 'Direct Founder Inquiries'}
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  {ctaSection?.title || 'Have a business ready to be easier to choose?'}
                </h2>
                <p className="text-sm sm:text-base text-[#D4D4D8] leading-relaxed max-w-xl">
                  {ctaSection?.description || 'Share your current website or new business goals. We reply within 24 hours with actionable improvements and flexible, negotiable pricing.'}
                </p>

                <div className="space-y-1.5 pt-2 text-xs text-[#A1A1AA]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{ctaSection?.reassurance || 'Pricing is 100% negotiable to match your scope and timeline.'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[var(--accent)] shrink-0" />
                    <span>Telegram ({STUDIO_CONTACT.telegramHandle}) & Gmail active · WhatsApp disabled</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Quick Inquiries */}
              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
                <button
                  onClick={() => {
                    onNavigate('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="glass-btn-primary px-7 py-3.5 text-xs uppercase tracking-wider text-white shadow-xl justify-center"
                >
                  <span>Submit Project Brief</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={buildTelegramLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-btn px-6 py-3.5 text-xs uppercase tracking-wider text-white justify-center"
                >
                  <Send className="w-4 h-4 text-[#60A5FA]" />
                  <span>Chat on Telegram</span>
                </a>

                <a
                  href={buildMailtoLink()}
                  className="glass-btn px-6 py-3.5 text-xs uppercase tracking-wider text-white justify-center"
                >
                  <Mail className="w-4 h-4 text-[var(--contact-accent)]" />
                  <span>Direct Founder Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
