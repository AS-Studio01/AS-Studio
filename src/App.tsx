/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FixedBottomLegalBar } from './components/FixedBottomLegalBar';
import { ProjectModal } from './components/ProjectModal';
import { LegalModal } from './components/LegalModal';
import { SecretAdminPanel } from './components/SecretAdminPanel';
import { ClientPortalModal } from './components/ClientPortalModal';
import { useSiteContent } from './context/SiteContentContext';
import { SiteEnhancements } from './components/SiteEnhancements';
import { FloatingCommunicationHub } from './components/FloatingCommunicationHub';
import { StudioAIChatbot } from './components/StudioAIChatbot';
import { HomePage } from './pages/HomePage';
import { WorkPage } from './pages/WorkPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProcessPage } from './pages/ProcessPage';
import { ContactPage } from './pages/ContactPage';
import { Project, PageType } from './types';

function getInitialPage(): PageType {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/^\//, '').split('/')[0];
  if (path === 'work' || path === 'services' || path === 'process' || path === 'contact') {
    return path;
  }
  return 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>(getInitialPage);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'disclaimer' | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const { content } = useSiteContent();

  // Listen to browser popstate (Back/Forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const page = getInitialPage();
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    const targetPath = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-[#F4F4F6] flex flex-col font-sans selection:bg-[#3B82F6] selection:text-white pb-14 sm:pb-12">
      {/* Header with clean navigation, AI Concierge, and secret founder trigger */}
      <Header
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onOpenPortal={() => setIsPortalOpen(true)}
        onOpenSecretAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Page View with Modern Slide-In + Cross-Fade Transition */}
      <main className="flex-1 relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ 
              duration: 0.22, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            className="w-full"
          >
            {currentPage === 'home' && (
              <HomePage
                projects={content.projects}
                onSelectProject={(project) => setSelectedProject(project)}
                onNavigate={navigateTo}
              />
            )}

            {currentPage === 'work' && (
              <WorkPage
                projects={content.projects}
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
                onOpenPortal={() => setIsPortalOpen(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Clean Footer with page navigation and direct contact channels */}
      <Footer 
        onNavigate={navigateTo} 
        onOpenLegal={(type) => setLegalModalType(type)}
      />

      {/* Fixed bottom legal compliance bar */}
      <FixedBottomLegalBar onOpenLegal={(type) => setLegalModalType(type)} />

      {/* Studio Helper AI Multi-Turn Drawer */}
      <StudioAIChatbot
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        onOpenContact={() => {
          setIsAIChatOpen(false);
          navigateTo('contact');
        }}
      />

      {/* Floating Communication Hub */}
      <FloatingCommunicationHub onOpenAIChat={() => setIsAIChatOpen(true)} />

      {/* Founder Secret Admin Panel */}
      <SecretAdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Client & Inquiries Portal */}
      <ClientPortalModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        onNavigateToContact={() => {
          setIsPortalOpen(false);
          navigateTo('contact');
        }}
        onOpenAdminPanel={() => {
          setIsPortalOpen(false);
          setIsAdminOpen(true);
        }}
      />

      {/* Interactive Project Showcase & Live Demo Modal */}
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

      {/* Dynamic SEO Meta, Social Cards, JSON-LD, Reading Progress Bar & Back to Top */}
      <SiteEnhancements currentPage={currentPage} />
    </div>
  );
}
