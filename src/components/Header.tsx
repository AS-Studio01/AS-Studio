import { useState, useEffect } from 'react';
import { Menu, X, Bot, User, LogIn, ChevronDown, ShieldCheck, ArrowRight, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSiteContent } from '../context/SiteContentContext';
import { useTheme } from '../context/ThemeContext';
import { STUDIO_CONTACT, buildMailtoLink } from '../constants/communication';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenAIChat?: () => void;
  onOpenPortal?: () => void;
  onOpenSecretAdmin?: () => void;
}

export function Header({ 
  currentPage, 
  onNavigate, 
  onOpenAIChat, 
  onOpenPortal, 
  onOpenSecretAdmin 
}: HeaderProps) {
  const { user, isAdmin } = useAuth();
  const { content } = useSiteContent();
  const { theme, toggleTheme } = useTheme();
  const brand = content.brand;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  const navLinks: { label: string; page?: PageType; targetId?: string }[] = [
    { label: 'Work', page: 'work' },
    { label: 'Services', page: 'services' },
    { label: 'Process', page: 'process' },
    { label: 'About', targetId: 'about' },
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

  // ONLY access method: Rapid 3-5 clicks on the studio logo (randomized session hash)
  const handleLogoClick = () => {
    const nextCount = logoClickCount + 1;
    setLogoClickCount(nextCount);

    if (nextCount >= 4) {
      setLogoClickCount(0);
      const randomSecretHash = 'sec_' + Math.random().toString(36).slice(2, 11) + Math.random().toString(36).slice(2, 7);
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#${randomSecretHash}`);
      }
      if (onOpenSecretAdmin) {
        onOpenSecretAdmin();
      }
      return;
    }

    setTimeout(() => {
      setLogoClickCount(0);
    }, 1500);

    // On single click, navigate to home as normal
    if (nextCount === 1) {
      handleLinkClick('home');
    }
  };

  const handleLinkClick = (page: PageType, targetId?: string) => {
    setMobileMenuOpen(false);
    if (targetId) {
      if (currentPage === 'home') {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      } else {
        onNavigate('home');
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 120);
        return;
      }
    }
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FAF9F5]/95 dark:bg-[#0E0E10]/95 backdrop-blur-md border-b border-[#E5E2D9] dark:border-[#27272A] text-[#18181B] dark:text-[#F4F4F6] transition-colors duration-150">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 md:gap-4">
          {/* Left: AS STUDIO as a clean text wordmark */}
          <button
            onClick={handleLogoClick}
            className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-[#18181B] dark:text-white hover:opacity-85 transition-opacity flex items-center gap-2.5 sm:gap-3 shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2563EB] select-none text-left"
            aria-label={`${brand.name || 'AS Studio'} home page`}
            title={brand.name || 'AS Studio'}
          >
            <span className="font-extrabold tracking-tight">{brand.name || 'AS STUDIO'}</span>
            <span className="hidden xl:inline-block text-[10px] font-bold uppercase tracking-widest text-[#71717A] border-l border-[#DDD9CE] dark:border-[#333338] pl-3">
              {brand.studioLabel || 'Digital Studio'}
            </span>
          </button>

          {/* Tablet & Desktop Navigation (Visible from md: 768px+) */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-5 shrink-0">
            <nav className="flex items-center gap-2.5 lg:gap-4 xl:gap-6 text-xs lg:text-sm font-semibold" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = link.page ? currentPage === link.page : false;
                return (
                  <button
                    key={link.label}
                    onClick={() => handleLinkClick(link.page || 'home', link.targetId)}
                    className={`py-1.5 transition-colors relative text-xs lg:text-sm tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2563EB] ${
                      isActive
                        ? 'text-[#0047AB] dark:text-white font-bold'
                        : 'text-[#52525B] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0047AB] dark:bg-[#3B82F6]" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quiet Client Portal Access */}
            {onOpenPortal && (
              <button
                onClick={onOpenPortal}
                className="text-xs text-[#71717A] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-white transition-colors px-2 py-1 font-medium"
                title="Client Portal & Milestone Tracking"
              >
                Client Portal
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-[#52525B] hover:text-[#18181B] dark:text-[#A1A1AA] dark:hover:text-white bg-[#F4F2EC] hover:bg-[#EAE6DC] dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-[#DDD9CE] dark:border-white/10 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#4338CA]" />
              )}
            </button>

            {/* Admin CMS Direct Shortcut when authorized */}
            {isAdmin && onOpenSecretAdmin && (
              <button
                onClick={onOpenSecretAdmin}
                className="px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-300 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 rounded-full inline-flex items-center gap-1.5 transition-colors"
                title="Founder Admin Panel & CMS Editor"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                <span>Admin CMS</span>
              </button>
            )}

            {/* Primary Business CTA */}
            <button
              onClick={() => handleLinkClick('contact')}
              className="glass-btn-primary px-4 lg:px-5 py-2 text-xs font-bold uppercase tracking-wider text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047AB] rounded-full shadow-md"
            >
              Start a Project
            </button>
          </div>

          {/* Mobile menu trigger (< 768px) */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-[#52525B] dark:text-[#A1A1AA] bg-[#F4F2EC] dark:bg-white/[0.05] border border-[#DDD9CE] dark:border-white/10"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#4338CA]" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#18181B] dark:text-white hover:text-[#0047AB] dark:hover:text-[#3B82F6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0047AB] rounded-lg border border-[#DDD9CE] dark:border-white/10"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Touch-Optimized Mobile Navigation Drawer with Swipe-to-Dismiss */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.05, bottom: 0.6 }}
              onDragEnd={(_e, info) => {
                if (info.offset.y > 55 || info.velocity.y > 250) {
                  setMobileMenuOpen(false);
                }
              }}
              className="relative z-40 md:hidden border-t border-[#E5E2D9] dark:border-[#27272A] bg-[#FAF9F5]/98 dark:bg-[#0E0E10]/98 backdrop-blur-2xl px-5 sm:px-6 pt-2 pb-6 shadow-2xl max-h-[calc(100dvh-4.5rem)] overflow-y-auto touch-pan-y text-[#18181B] dark:text-[#F4F4F6]"
            >
              {/* Tactile Swipe Handle */}
              <div className="w-full flex flex-col items-center justify-center pt-1 pb-3 touch-none cursor-grab active:cursor-grabbing select-none">
                <div className="w-12 h-1.5 rounded-full bg-black/15 dark:bg-white/25 active:bg-[#0047AB] transition-colors" />
                <span className="text-[9px] font-mono text-[#71717A] tracking-wider uppercase mt-1">
                  Swipe down to close
                </span>
              </div>

              <nav className="flex flex-col space-y-1.5 text-base font-semibold">
                {navLinks.map((link) => {
                  const isActive = link.page ? currentPage === link.page : false;
                  return (
                    <button
                      key={link.label}
                      onClick={() => handleLinkClick(link.page || 'home', link.targetId)}
                      className={`text-left py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
                        isActive
                          ? 'bg-[#0047AB]/10 text-[#0047AB] dark:bg-white/10 dark:text-white font-bold'
                          : 'text-[#3F3F46] dark:text-[#D4D4D8] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0047AB] dark:bg-[#3B82F6]" />
                      )}
                    </button>
                  );
                })}

                <div className="pt-2">
                  <button
                    onClick={() => handleLinkClick('contact')}
                    className="w-full glass-btn-primary py-3 px-4 text-xs font-bold uppercase tracking-wider text-white rounded-full flex items-center justify-center gap-2"
                  >
                    <span>Start a Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {isAdmin && onOpenSecretAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSecretAdmin();
                    }}
                    className="text-left py-2.5 px-3 rounded-lg text-rose-600 dark:text-rose-300 bg-rose-500/10 border border-rose-500/20 transition-colors flex items-center justify-between mt-1"
                  >
                    <span className="flex items-center gap-2 text-sm font-bold">
                      <ShieldCheck className="w-4 h-4 text-rose-500" />
                      <span>Studio Admin CMS</span>
                    </span>
                    <span className="text-xs text-rose-600 dark:text-rose-400 font-mono font-bold">Open Console →</span>
                  </button>
                )}

                <div className="pt-3 border-t border-[#E5E2D9] dark:border-[#27272A] space-y-2">
                  <a
                    href={STUDIO_CONTACT.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-[#0047AB] dark:text-[#60A5FA] font-mono py-1.5 px-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <span>Telegram: @AS_Studio_official01</span>
                  </a>
                  <a
                    href={buildMailtoLink()}
                    className="flex items-center gap-2 text-xs text-[#52525B] dark:text-[#D4D4D8] font-mono py-1.5 px-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <span>Email: {STUDIO_CONTACT.email}</span>
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Touch Backdrop for Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
}

