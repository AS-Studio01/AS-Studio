import { Mail, Send, ArrowUpRight } from 'lucide-react';
import { PageType } from '../types';
import { STUDIO_CONTACT, buildMailtoLink } from '../constants/communication';

interface FooterProps {
  onOpenLegal: (type: 'privacy' | 'terms' | 'disclaimer') => void;
  onNavigate?: (page: PageType) => void;
}

export function Footer({ onOpenLegal, onNavigate }: FooterProps) {
  const pages: { label: string; page: PageType }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Selected Work', page: 'work' },
    { label: 'Services', page: 'services' },
    { label: 'Process', page: 'process' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <footer className="bg-[#FAF8F5] dark:bg-[#0E0E10] text-[#121212] dark:text-[#F4F4F6] pt-14 pb-28 sm:pt-16 sm:pb-32 border-t border-[#E7E2DA] dark:border-[#27272A] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#E7E2DA] dark:border-[#27272A]">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-4 max-w-sm">
            <span className="text-2xl font-black tracking-tight text-[#121212] dark:text-white block">
              AS STUDIO
            </span>
            <p className="text-sm font-medium text-[#4A4641] dark:text-[#D4D4D8] leading-relaxed">
              Clean digital experiences for businesses ready to be easier to choose.
            </p>
            <div className="pt-1 text-xs text-[#736E66] dark:text-[#A1A1AA] font-medium leading-relaxed">
              Independent studio practice based in India. Designing fast, mobile-first websites for clinics, cafes, ateliers & modern founders worldwide.
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs uppercase tracking-wider text-[#6B6661] dark:text-[#A1A1AA] font-bold font-mono block">
              Studio Directory
            </span>
            <ul className="space-y-2 text-sm text-[#383531] dark:text-[#D4D4D8]">
              {pages.map((item) => (
                <li key={item.page}>
                  <button
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate(item.page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-[#0047AB] dark:hover:text-[#3B82F6] transition-colors font-bold text-xs uppercase tracking-wider text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-4 text-sm">
            <span className="text-xs uppercase tracking-wider text-[#6B6661] dark:text-[#A1A1AA] font-bold font-mono block">
              Direct Channels
            </span>
            <ul className="space-y-3 text-[#2E2B27] dark:text-[#E4E4E7]">
              <li>
                <div className="flex items-center gap-1.5 text-xs text-[#736E66] dark:text-[#A1A1AA] mb-0.5 font-medium">
                  <Mail className="w-3.5 h-3.5 text-[#0047AB] dark:text-[#3B82F6]" />
                  <span>Email (Gmail)</span>
                </div>
                <a
                  href={buildMailtoLink()}
                  className="hover:text-[#0047AB] dark:hover:text-[#3B82F6] transition-colors font-bold text-xs break-all"
                >
                  {STUDIO_CONTACT.email}
                </a>
              </li>

              <li>
                <div className="flex items-center gap-1.5 text-xs text-[#736E66] dark:text-[#A1A1AA] mb-0.5 font-medium">
                  <Send className="w-3.5 h-3.5 text-[#0047AB] dark:text-[#3B82F6]" />
                  <span>Telegram</span>
                </div>
                <a
                  href={STUDIO_CONTACT.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0047AB] dark:hover:text-[#3B82F6] transition-colors font-bold text-xs flex items-center gap-1"
                >
                  <span>{STUDIO_CONTACT.telegramHandle}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </li>

              <li className="pt-1 border-t border-[#E7E2DA] dark:border-[#27272A]/60">
                <div className="text-xs text-[#736E66] dark:text-[#A1A1AA] flex items-center gap-1.5">
                  <span className="line-through text-[#8C857B] dark:text-[#71717A]">WhatsApp</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">Disabled</span>
                </div>
                <span className="block text-[11px] text-[#8C857B] dark:text-[#71717A] mt-0.5 font-medium">
                  We communicate strictly via Gmail & Telegram for security & speed.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Clean, Non-Intrusive All Rights Reserved & Legal Strip */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left text-xs font-sans">
          {/* Copyright & Guarantees */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-[#52525B] dark:text-[#A1A1AA]">
            <span className="font-extrabold text-[#121212] dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="System Operational" />
              <span>© 2026 AS Studio. All rights reserved.</span>
            </span>
            <span className="hidden sm:inline text-[#DDD7CD] dark:text-[#333338]">|</span>
            <span className="text-[11px] sm:text-xs">
              100% Complete Source Code Ownership · Live Smartphone Staging
            </span>
          </div>

          {/* Interactive Legal Document Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs font-bold text-[#0047AB] dark:text-[#60A5FA]">
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-[#121212] dark:hover:text-white underline decoration-[#0047AB]/40 dark:decoration-[#60A5FA]/40 underline-offset-4 hover:decoration-white transition-colors"
            >
              Terms & Conditions
            </button>
            <span className="text-[#DDD7CD] dark:text-[#3F3F46]">·</span>
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-[#121212] dark:hover:text-white underline decoration-[#0047AB]/40 dark:decoration-[#60A5FA]/40 underline-offset-4 hover:decoration-white transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-[#DDD7CD] dark:text-[#3F3F46]">·</span>
            <button
              onClick={() => onOpenLegal('disclaimer')}
              className="hover:text-[#121212] dark:hover:text-white underline decoration-[#0047AB]/40 dark:decoration-[#60A5FA]/40 underline-offset-4 hover:decoration-white transition-colors"
            >
              Disclaimer
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
