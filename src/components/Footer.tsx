import { Mail, Send } from 'lucide-react';
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
    <footer className="bg-[#FAF8F5] dark:bg-[#0E0E10] text-[#121212] dark:text-[#F4F4F6] pt-16 pb-12 border-t border-[#E7E2DA] dark:border-[#27272A] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-4 max-w-sm">
            <span className="text-2xl font-black tracking-tight text-[#121212] dark:text-white block">
              AS STUDIO
            </span>
            <p className="text-sm font-medium text-[#4A4641] dark:text-[#D4D4D8] leading-relaxed">
              Clean digital experiences for businesses ready to be easier to choose.
            </p>
            <div className="pt-2 text-xs text-[#736E66] dark:text-[#A1A1AA] font-medium">
              Studio practice based in India. Designing websites for local practices & modern founders worldwide.
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
                    className="hover:text-[#0047AB] dark:hover:text-[#3B82F6] transition-colors font-bold text-xs uppercase tracking-wider"
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
                  className="hover:text-[#0047AB] dark:hover:text-[#3B82F6] transition-colors font-bold text-xs"
                >
                  {STUDIO_CONTACT.telegramHandle}
                </a>
              </li>

              <li>
                <div className="text-xs text-[#736E66] dark:text-[#A1A1AA] mb-0.5 font-medium">WhatsApp</div>
                <span className="text-[#8C857B] dark:text-[#71717A] italic text-xs font-semibold">
                  (show unavailable)
                </span>
                <span className="block text-[11px] text-[#A8A29E] dark:text-[#71717A] mt-0.5 font-medium">
                  WhatsApp communication disabled.
                </span>
              </li>

              <li>
                <div className="text-xs text-[#736E66] dark:text-[#A1A1AA] mb-0.5 font-medium">Discord</div>
                <span className="text-[#8C857B] dark:text-[#71717A] italic text-xs font-semibold">
                  (placeholder for now)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
