/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { ProjectModal } from './components/ProjectModal';
import { LegalModal } from './components/LegalModal';
import { FloatingCommunicationHub } from './components/FloatingCommunicationHub';
import { HomePage } from './pages/HomePage';
import { WorkPage } from './pages/WorkPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProcessPage } from './pages/ProcessPage';
import { ContactPage } from './pages/ContactPage';
import { PROJECTS } from './data/projects';
import { Project, PageType } from './types';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '').toLowerCase();
      if (['work', 'services', 'process', 'contact'].includes(hash)) {
        setCurrentPage(hash as PageType);
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0E0E10] text-[#121212] dark:text-[#F4F4F6] flex flex-col font-sans selection:bg-[#0047AB] selection:text-white transition-colors duration-300">
      {/* Horizontal Scroll Progress Bar at the very top of screen */}
      <ScrollProgressBar />

      {/* 1. Header with dynamic page switching and theme toggle */}
      <Header
        currentPage={currentPage}
        onNavigate={navigateTo}
      />

      {/* Main Page View with Framer Motion slide & fade transition */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
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

      {/* Floating Bottom-Right Direct Channels Launcher */}
      <FloatingCommunicationHub
        onNavigateToContact={() => navigateTo('contact')}
      />

      {/* Project details modal */}
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

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
      <Analytics />
    </ThemeProvider>
  );
}

