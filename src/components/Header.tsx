import { useState, useEffect } from 'react';
import { Menu, X, Bot, Sparkles, Send, Mail } from 'lucide-react';
import { PageType } from '../types';
import { STUDIO_CONTACT, buildMailtoLink } from '../constants/communication';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenAIChat?: () => void;
}

export function Header({ currentPage, onNavigate, onOpenAIChat }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: PageType }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Work', page: 'work' },
    { label: 'Services', page: 'services' },
    { label: 'Process', page: 'process' },
    { label: 'Contact', page: 'contact' },
  ];

  // Tap anywhere else / Escape key to exit mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleLinkClick = (page: PageType) => {
    setMobileMenuOpen(false);
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0E0E10]/90 backdrop-blur-md border-b border-[#27272A] text-[#F4F4F6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Left: AS STUDIO as a text logo (Responsive so it never collides with navigation) */}
          <button
            onClick={() => handleLinkClick('home')}
            className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white hover:opacity-85 transition-opacity flex items-center gap-3 shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
            aria-label="AS Studio home page"
          >
            <span className="font-extrabold tracking-tighter">AS STUDIO</span>
            {/* Show 'Digital Studio' only on large screens (xl: 1280px+) to prevent any overlap on tablets */}
            <span className="hidden xl:inline-block text-[10px] font-bold uppercase tracking-widest text-[#9E9A93] border-l border-[#333338] pl-3">
              Digital Studio
            </span>
          </button>

          {/* Desktop Navigation: Visible on laptops & wide tablets (lg: 1024px+) */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-7 shrink-0">
            <nav className="flex items-center gap-6 xl:gap-8 text-sm font-semibold" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = currentPage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => handleLinkClick(link.page)}
                    className={`py-1.5 transition-colors relative text-sm tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3B82F6] ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#3B82F6]" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* AI Helper Assistant Button */}
            {onOpenAIChat && (
              <button
                onClick={onOpenAIChat}
                className="glass-btn px-3 py-1.5 xl:px-3.5 xl:py-2 text-xs font-bold text-white inline-flex items-center gap-1.5 border border-[#3B82F6]/30 hover:border-[#3B82F6] transition-colors"
                title="Open AS Studio Helper AI"
              >
                <Bot className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Helper AI</span>
              </button>
            )}

            {/* Apple-style Glassmorphic CTA button: Start a project */}
            <button
              onClick={() => handleLinkClick('contact')}
              className="glass-btn-primary px-4 py-2 xl:px-5 xl:py-2.5 text-xs font-bold uppercase tracking-wider text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]"
            >
              Start a project
            </button>
          </div>

          {/* Mobile & Tablet menu trigger (Handles mobile, tablet portrait, and rotated phone views) */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-2.5">
            {onOpenAIChat && (
              <button
                onClick={onOpenAIChat}
                className="glass-btn p-2 text-white border border-[#3B82F6]/30 rounded-lg flex items-center gap-1.5 text-xs font-bold"
                aria-label="Open AS Studio Helper AI"
                title="Open AI Assistant"
              >
                <Bot className="w-4 h-4 text-[#3B82F6]" />
                <span className="hidden sm:inline">AI Help</span>
              </button>
            )}

            <button
              onClick={() => handleLinkClick('contact')}
              className="glass-btn-primary px-3 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white rounded-lg"
            >
              Start project
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:text-[#3B82F6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3B82F6] rounded-lg border border-white/10"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Drawer (With landscape scroll support so rotated phones/tablets never clip content) */}
        {mobileMenuOpen && (
          <div className="relative z-40 lg:hidden border-t border-[#27272A] bg-[#0E0E10]/95 backdrop-blur-xl px-5 sm:px-6 py-5 landscape:py-4 shadow-2xl fade-in max-h-[calc(100dvh-4.5rem)] overflow-y-auto">
            <nav className="flex flex-col space-y-3.5 landscape:space-y-2 text-base font-semibold">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => handleLinkClick(link.page)}
                  className={`text-left py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${
                    currentPage === link.page
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-[#D4D4D8] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {currentPage === link.page && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                  )}
                </button>
              ))}

              <div className="pt-3 border-t border-[#27272A] space-y-2">
                <a
                  href={STUDIO_CONTACT.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-[#60A5FA] font-mono py-1.5 px-3 rounded-lg hover:bg-white/5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram: @AS_Studio_official01</span>
                </a>
                <a
                  href={buildMailtoLink()}
                  className="flex items-center gap-2 text-xs text-[#D4D4D8] font-mono py-1.5 px-3 rounded-lg hover:bg-white/5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email: {STUDIO_CONTACT.email}</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Glassmorphic Blur Backdrop for Mobile Menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/65 backdrop-blur-md transition-opacity duration-300 md:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
}
