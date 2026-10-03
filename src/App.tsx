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

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'disclaimer' | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const { content } = useSiteContent();

  // Guarantee clean landing on 'home'
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
    <div className="min-h-screen bg-[#0E0E10] text-[#F4F4F6] flex flex-col font-sans selection:bg-[#3B82F6] selection:text-white pb-14 sm:pb-12">
      {/* Header with clean navigation, AI Concierge, and secret founder trigger */}
      <Header
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onOpenSecretAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Page View with Modern Slide-In + Cross-Fade Transition */}
      <main className="flex-1 relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ 
              duration: 0.28, 
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

      {/* Footer with clean All Rights Reserved and legal strip */}
      <Footer
        onOpenLegal={(type) => setLegalModalType(type)}
        onNavigate={navigateTo}
      />

      {/* Persistent Fixed Bottom Legal & Compliance Notice (Visible across all pages, moves with scroll, immune to overlap) */}
      <FixedBottomLegalBar
        onOpenLegal={(type) => setLegalModalType(type)}
      />

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

      {/* Secret Founder Admin Console (Restricted & Locked from Client Side) */}
      <SecretAdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Client Portal Modal (Used when client submits an inquiry or tracks their brief) */}
      <ClientPortalModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        onNavigateToContact={() => navigateTo('contact')}
        onOpenAdminPanel={() => {
          setIsPortalOpen(false);
          setIsAdminOpen(true);
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
      <SiteEnhancements />
    </div>
  );
}
