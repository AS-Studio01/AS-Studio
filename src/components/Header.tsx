import { useState, useEffect } from 'react';
import { Menu, X, Bot, User, LogIn, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageType } from '../types';
import { useAuth } from '../context/AuthContext';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

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

  // ONLY access method: Rapid 3-5 clicks on the studio logo (randomized session hash)
  const handleLogoClick = () => {
    const nextCount = logoClickCount + 1;
    setLogoClickCount(nextCount);

    if (nextCount >= 4) {
      setLogoClickCount(0);
      // Randomize hash so hackers/spammers cannot predict or bookmark a static URL
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

  const handleLinkClick = (page: PageType) => {
    setMobileMenuOpen(false);
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0E0E10]/92 backdrop-blur-md border-b border-[#27272A] text-[#F4F4F6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 md:gap-4">
          {/* Left: AS STUDIO as a text logo */}
          <button
            onClick={handleLogoClick}
            className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white hover:opacity-85 transition-opacity flex items-center gap-2.5 sm:gap-3 shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3B82F6] select-none"
            aria-label="AS Studio home page"
            title="AS Studio"
          >
            <span className="font-extrabold tracking-tighter">AS STUDIO</span>
            {/* Show 'Digital Studio' only on large screens (xl: 1280px+) */}
            <span className="hidden xl:inline-block text-[10px] font-bold uppercase tracking-widest text-[#9E9A93] border-l border-[#333338] pl-3">
              Digital Studio
            </span>
          </button>

          {/* Tablet & Desktop Navigation (Visible from md: 768px+) */}
          <div className="hidden md:flex items-center gap-3.5 lg:gap-5 xl:gap-6 shrink-0">
            <nav className="flex items-center gap-3.5 lg:gap-5 xl:gap-7 text-xs lg:text-sm font-semibold" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = currentPage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => handleLinkClick(link.page)}
                    className={`py-1.5 transition-colors relative text-xs lg:text-sm tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3B82F6] ${
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

            {/* Clean Sign In / Login button */}
            {onOpenPortal && (
              <button
                onClick={onOpenPortal}
                className="glass-btn px-2.5 py-1.5 lg:px-3 lg:py-1.5 text-xs font-bold text-[#E4E4E7] hover:text-white inline-flex items-center gap-1.5 border border-white/10 hover:border-white/30 rounded-lg transition-colors"
                title={user ? 'My Account & Inquiries' : 'Sign In / Register'}
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-4 h-4 rounded-full" />
                ) : (
                  <User className="w-3.5 h-3.5 text-[#60A5FA]" />
                )}
                <span>{user ? (user.displayName?.split(' ')[0] || 'Account') : 'Sign In / Login'}</span>
                {user && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>
            )}

            {/* AI Helper Assistant Button */}
            {onOpenAIChat && (
              <button
                onClick={onOpenAIChat}
                className="glass-btn px-2.5 py-1.5 lg:px-3 lg:py-1.5 text-xs font-bold text-white inline-flex items-center gap-1.5 border border-[#3B82F6]/30 hover:border-[#3B82F6] transition-colors rounded-lg"
                title="Open AS Studio Helper AI"
              >
                <Bot className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Helper AI</span>
              </button>
            )}

            {/* CTA button: Start a project */}
            <button
              onClick={() => handleLinkClick('contact')}
              className="glass-btn-primary px-3.5 py-1.5 lg:px-5 lg:py-2 text-xs font-bold uppercase tracking-wider text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6] rounded-lg"
            >
              Start project
            </button>
          </div>

          {/* Mobile menu trigger (< 768px) */}
          <div className="flex md:hidden items-center gap-2">
            {onOpenPortal && (
              <button
                onClick={onOpenPortal}
                className="glass-btn px-2.5 py-1.5 text-white border border-white/15 rounded-lg flex items-center gap-1 text-[11px] font-bold"
                aria-label="Sign In or User Account"
                title={user ? 'My Account' : 'Sign In / Login'}
              >
                <User className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>{user ? 'Account' : 'Login'}</span>
              </button>
            )}

            {onOpenAIChat && (
              <button
                onClick={onOpenAIChat}
                className="glass-btn p-2 text-white border border-[#3B82F6]/30 rounded-lg flex items-center gap-1 text-xs font-bold"
                aria-label="Open AS Studio Helper AI"
                title="Open AI Assistant"
              >
                <Bot className="w-4 h-4 text-[#3B82F6]" />
              </button>
            )}

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
                // Smooth touch swipe down to close
                if (info.offset.y > 55 || info.velocity.y > 250) {
                  setMobileMenuOpen(false);
                }
              }}
              className="relative z-40 md:hidden border-t border-[#27272A] bg-[#0E0E10]/98 backdrop-blur-2xl px-5 sm:px-6 pt-2 pb-6 shadow-2xl max-h-[calc(100dvh-4.5rem)] overflow-y-auto touch-pan-y"
            >
              {/* Tactile Swipe Handle */}
              <div className="w-full flex flex-col items-center justify-center pt-1 pb-3 touch-none cursor-grab active:cursor-grabbing select-none">
                <div className="w-12 h-1.5 rounded-full bg-white/25 active:bg-[#3B82F6] transition-colors" />
                <span className="text-[9px] font-mono text-[#71717A] tracking-wider uppercase mt-1">
                  Swipe down to close
                </span>
              </div>

              <nav className="flex flex-col space-y-2 text-base font-semibold">
                {navLinks.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => handleLinkClick(link.page)}
                    className={`text-left py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
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

                {onOpenPortal && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenPortal();
                    }}
                    className="text-left py-2.5 px-3 rounded-lg text-white bg-white/5 border border-white/10 transition-colors flex items-center justify-between mt-1"
                  >
                    <span className="flex items-center gap-2 text-sm font-bold">
                      <User className="w-4 h-4 text-[#60A5FA]" />
                      <span>{user ? `Account (${user.displayName || user.email})` : 'Sign In / Login'}</span>
                    </span>
                    {user ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    ) : (
                      <span className="text-xs text-[#60A5FA] font-mono font-bold">Sign In →</span>
                    )}
                  </button>
                )}

                <div className="pt-3 border-t border-[#27272A] space-y-2">
                  <a
                    href={STUDIO_CONTACT.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-[#60A5FA] font-mono py-1.5 px-3 rounded-lg hover:bg-white/5"
                  >
                    <span>Telegram: @AS_Studio_official01</span>
                  </a>
                  <a
                    href={buildMailtoLink()}
                    className="flex items-center gap-2 text-xs text-[#D4D4D8] font-mono py-1.5 px-3 rounded-lg hover:bg-white/5"
                  >
                    <span>Email: {STUDIO_CONTACT.email}</span>
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Glassmorphic Touch Backdrop for Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/75 backdrop-blur-md md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
}
