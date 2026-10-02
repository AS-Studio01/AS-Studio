import { ArrowRight, Mail, Send, ShieldCheck } from 'lucide-react';
import { Hero } from '../components/Hero';
import { SelectedWork } from '../components/SelectedWork';
import { Services } from '../components/Services';
import { Process } from '../components/Process';
import { FAQ } from '../components/FAQ';
import { Project, PageType } from '../types';
import { buildMailtoLink, buildTelegramLink } from '../constants/communication';

interface HomePageProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNavigate: (page: PageType) => void;
}

export function HomePage({ projects, onSelectProject, onNavigate }: HomePageProps) {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <Hero onNavigate={onNavigate} />

      {/* Selected Work Section (Home Decor, Nova Dental, Mitti Café) */}
      <SelectedWork
        projects={projects}
        onSelectProject={onSelectProject}
      />

      {/* View full work archive callout banner */}
      <div className="border-b border-[#E7E2DA] dark:border-[#27272A] bg-[#F5F2EB] dark:bg-[#141416] py-10 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-xs uppercase font-mono tracking-wider text-[#0047AB] dark:text-[#3B82F6] font-bold">
              Case Study & Demo Deep Dive
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#121212] dark:text-white">
              Explore complete interactive prototypes, material catalogues, and conversion triage.
            </h3>
            <p className="text-xs text-[#6B6661] dark:text-[#A1A1AA]">
              See how we structure home decor lookbooks, healthcare appointment triage, and zero-PDF restaurant menus.
            </p>
          </div>
          <button
            onClick={() => {
              onNavigate('work');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="glass-btn inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white shrink-0"
          >
            <span>Explore All Demos & Work</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0047AB] dark:text-[#3B82F6]" />
          </button>
        </div>
      </div>

      {/* Services Section */}
      <Services onStartProject={() => onNavigate('contact')} />

      {/* Process Section */}
      <Process />

      {/* FAQ Section (Collapsible Accordion with negotiable pricing) */}
      <FAQ onNavigateToContact={() => onNavigate('contact')} />

      {/* Client Security & Protection Guarantee Banner */}
      <section className="py-20 border-b border-[#E7E2DA] dark:border-[#27272A] bg-[#FAF8F5] dark:bg-[#0E0E10] transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="bg-white/80 dark:bg-[#18181B]/80 border border-[#DDD7CD] dark:border-[#27272A] p-8 sm:p-12 backdrop-blur-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-sm">
            <div className="max-w-xl space-y-3.5">
              <div className="flex items-center gap-2 text-[#0047AB] dark:text-[#3B82F6]">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-wider font-bold">
                  Client Security Guarantee
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#121212] dark:text-white">
                Have a business that needs a clearer website?
              </h2>
              <p className="text-base text-[#4A4641] dark:text-[#D4D4D8] leading-relaxed font-medium">
                Share your current website or business details. We will tell you the first improvement we would make with flexible, negotiable pricing.
              </p>
              <div className="pt-1 text-xs text-[#736E66] dark:text-[#A1A1AA] flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <span>Negotiable budgets · Fast replies via Telegram & Gmail · WhatsApp currently disabled</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-3.5 w-full lg:w-auto">
              <a
                href={buildTelegramLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-btn inline-flex items-center justify-center gap-2.5 px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-white"
              >
                <Send className="w-3.5 h-3.5 text-[#0047AB] dark:text-[#3B82F6]" />
                <span>Chat on Telegram</span>
              </a>

              <a
                href={buildMailtoLink()}
                className="glass-btn-primary inline-flex items-center justify-center gap-2.5 px-6 py-4 text-xs font-bold uppercase tracking-wider text-white"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Write to Gmail</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
