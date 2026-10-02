import { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { PageType } from '../types';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks: { label: string; page: PageType }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Work', page: 'work' },
    { label: 'Services', page: 'services' },
    { label: 'Process', page: 'process' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleLinkClick = (page: PageType) => {
    setMobileMenuOpen(false);
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 dark:bg-[#0E0E10]/90 backdrop-blur-md border-b border-[#E7E2DA] dark:border-[#27272A] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        {/* Left: AS STUDIO as a text logo */}
        <button
          onClick={() => handleLinkClick('home')}
          className="text-xl sm:text-2xl font-black tracking-tight text-[#121212] dark:text-white hover:opacity-85 transition-opacity flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0047AB]"
          aria-label="AS Studio home page"
        >
          <span className="font-extrabold tracking-tighter">AS STUDIO</span>
          <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest text-[#78726A] dark:text-[#9E9A93] border-l border-[#DDD7CD] dark:border-[#333338] pl-3">
            Digital Studio
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-7">
          <nav className="flex items-center gap-8 text-sm font-semibold" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleLinkClick(link.page)}
                  className={`py-1.5 transition-colors relative text-sm tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0047AB] ${
                    isActive
                      ? 'text-[#121212] dark:text-white font-bold'
                      : 'text-[#6B6661] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0047AB] dark:bg-[#3B82F6]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Theme Toggle Button (Apple Glass style) */}
          <button
            onClick={toggleTheme}
            className="glass-btn p-2.5 rounded-full text-[#4A4641] dark:text-[#E4E4E7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0047AB]"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-[#121212]" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Apple-style Glassmorphic CTA button: Start a project */}
          <button
            onClick={() => handleLinkClick('contact')}
            className="glass-btn-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047AB]"
          >
            Start a project
          </button>
        </div>

        {/* Mobile menu trigger + theme toggle */}
        <div className="flex md:hidden items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className="glass-btn p-2 rounded-full text-[#4A4641] dark:text-[#E4E4E7]"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-[#121212]" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          <button
            onClick={() => handleLinkClick('contact')}
            className="glass-btn-primary px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-white"
          >
            Start project
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#121212] dark:text-white hover:text-[#0047AB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0047AB]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E2DA] dark:border-[#27272A] bg-[#FAF8F5] dark:bg-[#0E0E10] px-6 py-5 fade-in">
          <nav className="flex flex-col space-y-4 text-base font-semibold">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleLinkClick(link.page)}
                className={`text-left py-1 text-sm ${currentPage === link.page ? 'text-[#0047AB] dark:text-[#3B82F6] font-bold' : 'text-[#33302C] dark:text-[#D4D4D8]'}`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
