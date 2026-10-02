/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { LegalModal } from './components/LegalModal';
import { FloatingCommunicationHub } from './components/FloatingCommunicationHub';
import { StudioAIChatbot } from './components/StudioAIChatbot';
import { HomePage } from './pages/HomePage';
import { WorkPage } from './pages/WorkPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProcessPage } from './pages/ProcessPage';
import { ContactPage } from './pages/ContactPage';
import { PROJECTS } from './data/projects';
import { Project, PageType } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'disclaimer' | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Guarantee that whenever the site is opened or refreshed, it always lands on 'home'
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    setCurrentPage('home');
  }, []);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-[#F4F4F6] flex flex-col font-sans selection:bg-[#3B82F6] selection:text-white">
      {/* Header with navigation & AI Concierge trigger */}
      <Header
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenAIChat={() => setIsAIChatOpen(true)}
      />

      {/* Main Page View with Pure Subtle Cross-Fade Transition */}
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="w-full"
          >
            {currentPage === 'home' && (
              <HomePage
                projects={PROJECTS}
                onSelectProject={(project) => setSelectedProject(project)}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'work' && (
              <WorkPage
                projects={PROJECTS}
                onSelectProject={(project) => setSelectedProject(project)}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'services' && (
              <ServicesPage onNavigate={navigateTo} />
            )}

            {currentPage === 'process' && (
              <ProcessPage onNavigate={navigateTo} />
            )}

            {currentPage === 'contact' && (
              <ContactPage
                onOpenLegal={(type) => setLegalModalType(type)}
                onNavigate={navigateTo}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        onOpenLegal={(type) => setLegalModalType(type)}
        onNavigate={navigateTo}
      />

      {/* Unified Permanent Bottom Legal & Compliance Strip (Cannot get invisible across any page) */}
      <aside 
        aria-label="Official studio compliance and legal terms notice"
        className="sticky bottom-0 z-30 w-full bg-[#0E0E10]/95 backdrop-blur-xl border-t border-[#2E2E34] py-3 sm:py-4 landscape:py-1.5 px-4 sm:px-8 shadow-[0_-16px_40px_rgba(0,0,0,0.9)] text-xs sm:text-sm landscape:text-[11px] font-sans"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row landscape:flex-row items-center justify-between gap-2 sm:gap-3 text-center md:text-left">
          {/* Unified Branding, Copyright & Agreement text (all together in one element) */}
          <div className="flex flex-col sm:flex-row landscape:flex-row items-center gap-1.5 sm:gap-2 text-[#D4D4D8]">
            <span className="font-extrabold text-white tracking-tight shrink-0 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>© 2026 AS Studio. All rights reserved.</span>
            </span>
            <span className="hidden xl:inline landscape:hidden text-[#44444C]">|</span>
            <span className="hidden sm:inline landscape:hidden xl:landscape:inline text-[#A1A1AA] text-xs sm:text-[13px] leading-relaxed">
              By continuing to browse this site or submit an inquiry, you acknowledge that you have read and agree to our
            </span>
          </div>

          {/* Interactive Legal Document Links */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 font-mono text-xs sm:text-sm landscape:text-[11px] font-bold shrink-0">
            <button
              onClick={() => setLegalModalType('terms')}
              className="text-[#60A5FA] hover:text-white underline decoration-[#60A5FA]/40 underline-offset-4 hover:decoration-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
            >
              Terms & Conditions
            </button>
            <span className="text-[#3F3F46]">·</span>
            <button
              onClick={() => setLegalModalType('privacy')}
              className="text-[#60A5FA] hover:text-white underline decoration-[#60A5FA]/40 underline-offset-4 hover:decoration-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
            >
              Privacy Policy
            </button>
            <span className="text-[#3F3F46]">·</span>
            <button
              onClick={() => setLegalModalType('disclaimer')}
              className="text-[#60A5FA] hover:text-white underline decoration-[#60A5FA]/40 underline-offset-4 hover:decoration-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
            >
              Disclaimer
            </button>
          </div>
        </div>
      </aside>

      {/* Floating Bottom-Right Direct Channels Launcher */}
      <FloatingCommunicationHub
        onNavigateToContact={() => navigateTo('contact')}
        onOpenAIChat={() => setIsAIChatOpen(true)}
      />

      {/* AS Studio Helper AI Chatbot (Multi-turn Gemini interface) */}
      <StudioAIChatbot
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        onOpenContact={() => {
          setIsAIChatOpen(false);
          navigateTo('contact');
        }}
      />

      {/* Project details modal with Live Interactive Demo */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onStartProject={() => {
          setSelectedProject(null);
          navigateTo('contact');
        }}
      />

      {/* Legal terms & privacy policy modal */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
